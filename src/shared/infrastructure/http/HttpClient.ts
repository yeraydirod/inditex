export interface HttpClient {
  getJson<T>(url: string): Promise<T>;
}

export class HttpError extends Error {
  constructor(
    readonly url: string,
    readonly status: number,
  ) {
    super(`Request to ${url} failed with status ${status}`);
    this.name = 'HttpError';
  }
}
