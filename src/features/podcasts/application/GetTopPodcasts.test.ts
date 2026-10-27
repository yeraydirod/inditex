import { aPodcast } from '@/test/mothers';
import type { PodcastRepository } from '../domain/PodcastRepository';
import { GetTopPodcasts } from './GetTopPodcasts';

describe('GetTopPodcasts', () => {
  it('returns the podcasts provided by the repository', async () => {
    const podcasts = [aPodcast()];
    const repository: PodcastRepository = { findTop: jest.fn().mockResolvedValue(podcasts) };

    await expect(new GetTopPodcasts(repository).execute()).resolves.toBe(podcasts);
  });
});
