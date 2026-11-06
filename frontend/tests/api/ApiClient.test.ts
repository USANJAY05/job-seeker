import { ApiClient } from '../../src/api/ApiClient';
import { ApiError } from '../../src/api/ApiError';

const response = (status: number, json: () => Promise<unknown> = async () => ({})) => ({ ok: status >= 200 && status < 300, status, json }) as Response;
test('builds a relative URL and combines query parameters and headers', async () => {
  const transport = jest.fn(async () => response(200, async () => ({ id: 7 })));
  const api = new ApiClient({ baseUrl: 'https://example.test/v1', fetch: transport as unknown as typeof fetch, headers: () => ({ Authorization: 'Bearer example' }) });
  await expect(api.request({ path: 'items', query: { q: 'hello world', tags: ['a', 'b'], empty: undefined }, decode: value => (value as { id: number }).id })).resolves.toBe(7);
  const [url, options] = transport.mock.calls[0] as unknown as [string, RequestInit];
  expect(url).toBe('https://example.test/v1/items?q=hello+world&tags=a&tags=b');
  expect((options.headers as Headers).get('Authorization')).toBe('Bearer example');
  expect((options.headers as Headers).get('Accept')).toBe('application/json');
});
test('serializes JSON bodies and handles empty responses', async () => {
  const transport = jest.fn(async () => response(204));
  const api = new ApiClient({ baseUrl: 'https://example.test/', fetch: transport as unknown as typeof fetch });
  await expect(api.request({ path: 'items', method: 'POST', body: { name: 'X' } })).resolves.toBeUndefined();
  const options = (transport.mock.calls[0] as unknown as [string, RequestInit])[1];
  expect(options.body).toBe('{"name":"X"}');
  expect((options.headers as Headers).get('Content-Type')).toBe('application/json');
});
test('rejects foreign URLs and traversal outside the configured base', async () => {
  const api = new ApiClient({ baseUrl: 'https://example.test/v1/', fetch: jest.fn() as unknown as typeof fetch });
  await expect(api.request({ path: 'https://other.test/path' })).rejects.toThrow(TypeError);
  await expect(api.request({ path: '../private' })).rejects.toThrow(TypeError);
});
test('reports HTTP, malformed JSON, contract and network failures', async () => {
  const transport = jest.fn()
    .mockResolvedValueOnce(response(403))
    .mockResolvedValueOnce(response(200, async () => { throw new Error('bad json'); }))
    .mockResolvedValueOnce(response(200, async () => ({ invalid: true })))
    .mockRejectedValueOnce(new Error('offline'));
  const api = new ApiClient({ baseUrl: 'https://example.test/', fetch: transport });
  await expect(api.request({ path: 'a' })).rejects.toMatchObject({ kind: 'http', status: 403 });
  await expect(api.request({ path: 'b' })).rejects.toMatchObject({ kind: 'invalid-response' });
  await expect(api.request({ path: 'c', decode: () => { throw new Error('invalid'); } })).rejects.toMatchObject({ kind: 'invalid-response' });
  await expect(api.request({ path: 'd' })).rejects.toMatchObject({ kind: 'network' });
});
test('cancels on timeout and caller abort', async () => {
  const transport = jest.fn((_url, options: RequestInit) => new Promise((_resolve, reject) => options.signal?.addEventListener('abort', () => reject(new Error('aborted')))));
  const api = new ApiClient({ baseUrl: 'https://example.test/', fetch: transport as unknown as typeof fetch });
  await expect(api.request({ path: 'timeout', timeoutMs: 1 })).rejects.toMatchObject({ kind: 'timeout' });
  const controller = new AbortController();
  const promise = api.request({ path: 'cancel', signal: controller.signal });
  await Promise.resolve(); controller.abort();
  await expect(promise).rejects.toBeInstanceOf(ApiError);
  await expect(promise).rejects.toMatchObject({ kind: 'aborted' });
});

test('caller abort before the request does not call the transport', async () => {
  const transport = jest.fn();
  const controller = new AbortController();
  controller.abort();
  const api = new ApiClient({ baseUrl: 'https://example.test/', fetch: transport });
  await expect(api.request({ path: 'x', signal: controller.signal })).rejects.toMatchObject({ kind: 'aborted' });
  expect(transport).not.toHaveBeenCalled();
});
test('abort while reading JSON is classified as cancellation', async () => {
  const controller = new AbortController();
  const transport = jest.fn(async () => response(200, async () => { controller.abort(); throw new Error('cancelled'); }));
  const api = new ApiClient({ baseUrl: 'https://example.test/', fetch: transport as unknown as typeof fetch });
  await expect(api.request({ path: 'x', signal: controller.signal })).rejects.toMatchObject({ kind: 'aborted' });
});
