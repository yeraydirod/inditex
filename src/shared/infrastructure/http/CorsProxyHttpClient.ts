import type { HttpClient } from './HttpClient';

/**
 * Decorador que enruta las peticiones a través de un proxy CORS que devuelve la respuesta en crudo
 * (p. ej. `https://api.allorigins.win/raw?url=`). Útil si el servicio externo deja de enviar
 * cabeceras CORS.
 */
export class CorsProxyHttpClient implements HttpClient {
  constructor(
    private readonly inner: HttpClient,
    private readonly proxyBaseUrl: string,
  ) {}

  getJson<T>(url: string): Promise<T> {
    return this.inner.getJson<T>(`${this.proxyBaseUrl}${encodeURIComponent(url)}`);
  }
}
