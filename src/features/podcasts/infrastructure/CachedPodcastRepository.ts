import type { Cache } from '@/shared/infrastructure/cache/Cache';
import { Podcast, type PodcastPrimitives } from '../domain/Podcast';
import type { PodcastRepository } from '../domain/PodcastRepository';

export const TOP_PODCASTS_CACHE_KEY = 'top-podcasts';

/** Decorador que sirve el listado desde caché y solo delega en el repositorio real si ha caducado. */
export class CachedPodcastRepository implements PodcastRepository {
  constructor(
    private readonly inner: PodcastRepository,
    private readonly cache: Cache,
  ) {}

  async findTop(): Promise<Podcast[]> {
    const cached = this.cache.get<PodcastPrimitives[]>(TOP_PODCASTS_CACHE_KEY);
    if (cached) {
      return cached.map(Podcast.fromPrimitives);
    }

    const podcasts = await this.inner.findTop();
    this.cache.set(
      TOP_PODCASTS_CACHE_KEY,
      podcasts.map((podcast) => podcast.toPrimitives()),
    );
    return podcasts;
  }
}
