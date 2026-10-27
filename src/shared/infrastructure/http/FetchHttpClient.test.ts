import { FetchHttpClient } from './FetchHttpClient';
import { HttpError } from './HttpClient';

const jsonResponse = (body: unknown, status = 200) =>
  ({ ok: status >= 200 && status < 300, status, json: async () => body }) as Response;

describe('FetchHttpClient', () => {
  it('returns the parsed JSON body', async () => {
    const fetchFn = jest.fn().mockResolvedValue(jsonResponse({ hello: 'world' }));
    const client = new FetchHttpClient(fetchFn);

    await expect(client.getJson('https://api.test/resource')).resolves.toEqual({ hello: 'world' });
    expect(fetchFn).toHaveBeenCalledWith('https://api.test/resource');
  });

  it('throws an HttpError when the response is not ok', async () => {
    const client = new FetchHttpClient(jest.fn().mockResolvedValue(jsonResponse({}, 500)));

    await expect(client.getJson('https://api.test/resource')).rejects.toBeInstanceOf(HttpError);
  });
});
