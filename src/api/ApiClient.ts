import { URL } from 'react-native-url-polyfill';
import { ApiError } from './ApiError';
import type { ApiRequest, QueryParams } from './types';

export type ApiClientOptions = {
  baseUrl: string;
  /** Inject fetch in tests or when the host supplies its own transport. */
  fetch?: typeof fetch;
  headers?: () => Record<string, string> | Promise<Record<string, string>>;
  timeoutMs?: number;
};
function buildUrl(baseUrl: string, path: string, query?: QueryParams): string {
  if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(path) || path.includes('?') || path.includes('#')) throw new TypeError('API path must be a relative path without query or fragment');
  const base = new URL(baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`);
  if (!['http:', 'https:'].includes(base.protocol) || base.username || base.password || base.search || base.hash) throw new TypeError('API base URL must be an HTTP(S) URL without credentials, query, or fragment');
  const url = new URL(path.replace(/^\/+/, ''), base);
  if (url.origin !== base.origin || !url.pathname.startsWith(base.pathname)) throw new TypeError('API path must stay within the base URL');
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value == null) continue;
    const values = Array.isArray(value) ? value : [value];
    values.forEach(item => url.searchParams.append(key, String(item)));
  }
  return url.toString();
}
export class ApiClient {
  private readonly baseUrl: string;
  private readonly transport: typeof fetch;
  private readonly getHeaders?: ApiClientOptions['headers'];
  private readonly timeoutMs: number;
  constructor(options: ApiClientOptions) {
    this.baseUrl = options.baseUrl;
    this.transport = options.fetch ?? globalThis.fetch;
    this.getHeaders = options.headers;
    this.timeoutMs = options.timeoutMs ?? 30000;
    buildUrl(this.baseUrl, '');
  }
  async request<T = unknown>({ path, method = 'GET', query, headers, body, signal, timeoutMs = this.timeoutMs, decode, responseType = 'json' }: ApiRequest<T>): Promise<T | undefined> {
    const url = buildUrl(this.baseUrl, path, query);
    if (!Number.isFinite(timeoutMs) || timeoutMs < 0) throw new TypeError('timeoutMs must be a non-negative finite number');
    if (signal?.aborted) throw new ApiError('aborted', 'Request was cancelled');
    const mergedHeaders = new Headers(await this.getHeaders?.());
    for (const [key, value] of Object.entries(headers ?? {})) mergedHeaders.set(key, value);
    if (!mergedHeaders.has('Accept')) mergedHeaders.set('Accept', responseType === 'blob' ? '*/*' : responseType === 'text' ? 'text/plain' : 'application/json');
    let payload: string | undefined;
    if (body !== undefined) {
      payload = JSON.stringify(body);
      if (!mergedHeaders.has('Content-Type')) mergedHeaders.set('Content-Type', 'application/json');
    }
    const controller = new AbortController();
    const abort = () => controller.abort();
    signal?.addEventListener('abort', abort, { once: true });
    if (signal?.aborted) controller.abort();
    let timedOut = false;
    const timer = timeoutMs > 0 ? setTimeout(() => { timedOut = true; controller.abort(); }, timeoutMs) : undefined;
    try {
      if (controller.signal.aborted) throw new ApiError('aborted', 'Request was cancelled');
      const response = await this.transport(url, { method, headers: mergedHeaders, body: payload, signal: controller.signal });
      if (!response.ok) throw new ApiError('http', `Request failed with status ${response.status}`, response.status);
      if (response.status === 204 || response.status === 205) return undefined;
      if (responseType === 'blob') return await response.blob() as T;
      if (responseType === 'text') return await response.text() as T;
      let value: unknown;
      try { value = await response.json(); } catch (error) { if (controller.signal.aborted) throw error; throw new ApiError('invalid-response', 'Response is not valid JSON', response.status); }
      if (decode) {
        try { return decode(value); } catch { throw new ApiError('invalid-response', 'Response did not match the expected contract', response.status); }
      }
      return value as T;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      if (timedOut) throw new ApiError('timeout', 'Request timed out');
      if (controller.signal.aborted) throw new ApiError('aborted', 'Request was cancelled');
      throw new ApiError('network', 'Unable to reach the server');
    } finally {
      if (timer !== undefined) clearTimeout(timer);
      signal?.removeEventListener('abort', abort);
    }
  }
}
