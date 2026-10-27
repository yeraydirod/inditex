import { GetEpisodeDetail } from '@/features/podcast-detail/application/GetEpisodeDetail';
import { GetPodcastDetail } from '@/features/podcast-detail/application/GetPodcastDetail';
import { CachedPodcastDetailRepository } from '@/features/podcast-detail/infrastructure/CachedPodcastDetailRepository';
import { ItunesPodcastDetailRepository } from '@/features/podcast-detail/infrastructure/ItunesPodcastDetailRepository';
import { GetTopPodcasts } from '@/features/podcasts/application/GetTopPodcasts';
import { CachedPodcastRepository } from '@/features/podcasts/infrastructure/CachedPodcastRepository';
import { ItunesPodcastRepository } from '@/features/podcasts/infrastructure/ItunesPodcastRepository';
import { ONE_DAY_MS } from '@/shared/infrastructure/cache/Cache';
import { LocalStorageCache } from '@/shared/infrastructure/cache/LocalStorageCache';
import { SystemClock } from '@/shared/infrastructure/clock/SystemClock';
import { CorsProxyHttpClient } from '@/shared/infrastructure/http/CorsProxyHttpClient';
import { FetchHttpClient } from '@/shared/infrastructure/http/FetchHttpClient';
import type { HttpClient } from '@/shared/infrastructure/http/HttpClient';

/** Casos de uso que la capa de presentación necesita. */
export interface Container {
  getTopPodcasts: GetTopPodcasts;
  getPodcastDetail: GetPodcastDetail;
  getEpisodeDetail: GetEpisodeDetail;
}

interface ContainerOptions {
  storage?: Storage;
  corsProxyUrl?: string;
}

/** Composition root: ensambla adaptadores y casos de uso (inyección de dependencias manual). */
export function createContainer({
  storage = window.localStorage,
  corsProxyUrl = process.env.CORS_PROXY_URL,
}: ContainerOptions = {}): Container {
  const fetchClient = new FetchHttpClient();
  const http: HttpClient = corsProxyUrl
    ? new CorsProxyHttpClient(fetchClient, corsProxyUrl)
    : fetchClient;
  const cache = new LocalStorageCache({ storage, clock: new SystemClock(), ttlMs: ONE_DAY_MS });

  const podcastRepository = new CachedPodcastRepository(new ItunesPodcastRepository(http), cache);
  const podcastDetailRepository = new CachedPodcastDetailRepository(
    new ItunesPodcastDetailRepository(http),
    cache,
  );

  const getPodcastDetail = new GetPodcastDetail(podcastDetailRepository, podcastRepository);

  return {
    getTopPodcasts: new GetTopPodcasts(podcastRepository),
    getPodcastDetail,
    getEpisodeDetail: new GetEpisodeDetail(getPodcastDetail),
  };
}
