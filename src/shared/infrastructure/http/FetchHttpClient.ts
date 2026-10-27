import { HttpError, type HttpClient } from './HttpClient';

type FetchFn = (input: string) => Promise<Response>;

export class FetchHttpClient implements HttpClient {
  constructor(private readonly fetchFn: FetchFn = (input) => fetch(input)) {}

  async getJson<T>(url: string): Promise<T> {
    const response = await this.fetchFn(url);
    if (!response.ok) {
      throw new HttpError(url, response.status);
    }
    return (await response.json()) as T;
  }
}
