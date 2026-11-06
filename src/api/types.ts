export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
export type QueryValue = string | number | boolean;
export type QueryParams = Record<string, QueryValue | readonly QueryValue[] | null | undefined>;
/** Add generated OpenAPI types and endpoint adapters when the server contract is supplied. */
export type ResponseDecoder<T> = (value: unknown) => T;
export type ApiRequest<T> = {
  path: string;
  method?: HttpMethod;
  query?: QueryParams;
  headers?: Record<string, string>;
  body?: unknown;
  signal?: AbortSignal;
  timeoutMs?: number;
  decode?: ResponseDecoder<T>;
  responseType?: 'json' | 'blob' | 'text';
};
