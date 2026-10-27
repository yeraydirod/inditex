import { aPodcastDetail } from '@/test/mothers';
import { EpisodeNotFoundError } from '../domain/errors';
import { GetEpisodeDetail } from './GetEpisodeDetail';
import type { GetPodcastDetail } from './GetPodcastDetail';

describe('GetEpisodeDetail', () => {
  const podcast = aPodcastDetail();
  const getPodcastDetail = {
    execute: jest.fn().mockResolvedValue(podcast),
  } as unknown as GetPodcastDetail;

  it('returns the podcast and the requested episode', async () => {
    const result = await new GetEpisodeDetail(getPodcastDetail).execute('1', '101');

    expect(result.podcast).toBe(podcast);
    expect(result.episode.title).toBe('Second episode');
  });

  it('throws EpisodeNotFoundError when the episode is not in the podcast', async () => {
    await expect(
      new GetEpisodeDetail(getPodcastDetail).execute('1', 'missing'),
    ).rejects.toBeInstanceOf(EpisodeNotFoundError);
  });
});
