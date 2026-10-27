import { InMemoryCache } from '@/test/fakes';
import { aPodcast } from '@/test/mothers';
import type { PodcastRepository } from '../domain/PodcastRepository';
import { CachedPodcastRepository, TOP_PODCASTS_CACHE_KEY } from './CachedPodcastRepository';

describe('CachedPodcastRepository', () => {
  const podcasts = [aPodcast({ id: '1' }), aPodcast({ id: '2' })];

  it('delegates to the inner repository and stores the result when the cache is empty', async () => {
    const inner: PodcastRepository = { findTop: jest.fn().mockResolvedValue(podcasts) };
    const cache = new InMemoryCache();

    const result = await new CachedPodcastRepository(inner, cache).findTop();

    expect(result).toBe(podcasts);
    expect(cache.get(TOP_PODCASTS_CACHE_KEY)).toEqual(podcasts.map((p) => p.toPrimitives()));
  });

  it('serves the cached podcasts without calling the inner repository', async () => {
    const inner: PodcastRepository = { findTop: jest.fn() };
    const cache = new InMemoryCache();
    cache.set(
      TOP_PODCASTS_CACHE_KEY,
      podcasts.map((p) => p.toPrimitives()),
    );

    const result = await new CachedPodcastRepository(inner, cache).findTop();

    expect(inner.findTop).not.toHaveBeenCalled();
    expect(result).toEqual(podcasts);
  });
});
