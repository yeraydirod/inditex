import { CorsProxyHttpClient } from './CorsProxyHttpClient';
import type { HttpClient } from './HttpClient';

describe('CorsProxyHttpClient', () => {
  it('prefixes the encoded url with the proxy base url', async () => {
    const inner: HttpClient = { getJson: jest.fn().mockResolvedValue({ ok: true }) };
    const client = new CorsProxyHttpClient(inner, 'https://proxy.test/raw?url=');

    await client.getJson('https://itunes.apple.com/lookup?id=1&media=podcast');

    expect(inner.getJson).toHaveBeenCalledWith(
      'https://proxy.test/raw?url=https%3A%2F%2Fitunes.apple.com%2Flookup%3Fid%3D1%26media%3Dpodcast',
    );
  });
});
