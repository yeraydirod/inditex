import type { Cache } from '@/shared/infrastructure/cache/Cache';
import { PodcastDetail, type PodcastDetailPrimitives } from '../domain/PodcastDetail';
import type { PodcastDetailRepository } from '../domain/PodcastDetailRepository';

export const podcastDetailCacheKey = (podcastId: string): string => `podcast-detail:${podcastId}`;

export class CachedPodcastDetailRepository implements PodcastDetailRepository {
  constructor(
    private readonly inner: PodcastDetailRepository,
    private readonly cache: Cache,
  ) {}

  async findById(podcastId: string): Promise<PodcastDetail | null> {
    const key = podcastDetailCacheKey(podcastId);
    const cached = this.cache.get<PodcastDetailPrimitives>(key);
    if (cached) {
      return PodcastDetail.fromPrimitives(cached);
    }

    const detail = await this.inner.findById(podcastId);
    if (detail) {
      this.cache.set(key, detail.toPrimitives());
    }
    return detail;
  }
}
