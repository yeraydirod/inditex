import { InMemoryCache } from '@/test/fakes';
import { aPodcastDetail } from '@/test/mothers';
import type { PodcastDetailRepository } from '../domain/PodcastDetailRepository';
import {
  CachedPodcastDetailRepository,
  podcastDetailCacheKey,
} from './CachedPodcastDetailRepository';

describe('CachedPodcastDetailRepository', () => {
  const detail = aPodcastDetail();

  it('stores the detail fetched from the inner repository', async () => {
    const inner: PodcastDetailRepository = { findById: jest.fn().mockResolvedValue(detail) };
    const cache = new InMemoryCache();

    await new CachedPodcastDetailRepository(inner, cache).findById('1');

    expect(cache.get(podcastDetailCacheKey('1'))).toEqual(detail.toPrimitives());
  });

  it('serves a cached detail without calling the inner repository', async () => {
    const inner: PodcastDetailRepository = { findById: jest.fn() };
    const cache = new InMemoryCache();
    cache.set(podcastDetailCacheKey('1'), detail.toPrimitives());

    const result = await new CachedPodcastDetailRepository(inner, cache).findById('1');

    expect(inner.findById).not.toHaveBeenCalled();
    expect(result).toEqual(detail);
  });

  it('does not cache missing podcasts', async () => {
    const inner: PodcastDetailRepository = { findById: jest.fn().mockResolvedValue(null) };
    const cache = new InMemoryCache();

    await new CachedPodcastDetailRepository(inner, cache).findById('1');

    expect(cache.entries.size).toBe(0);
  });
});
