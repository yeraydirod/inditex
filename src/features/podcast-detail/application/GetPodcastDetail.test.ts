import type { PodcastRepository } from '@/features/podcasts/domain/PodcastRepository';
import { aPodcast, aPodcastDetail } from '@/test/mothers';
import { PodcastNotFoundError } from '../domain/errors';
import type { PodcastDetailRepository } from '../domain/PodcastDetailRepository';
import { GetPodcastDetail } from './GetPodcastDetail';

describe('GetPodcastDetail', () => {
  const build = (detail = aPodcastDetail(), top = [aPodcast({ id: '1', summary: 'Summary' })]) => {
    const detailRepository: PodcastDetailRepository = {
      findById: jest.fn().mockResolvedValue(detail),
    };
    const podcastRepository: PodcastRepository = { findTop: jest.fn().mockResolvedValue(top) };
    return { useCase: new GetPodcastDetail(detailRepository, podcastRepository), detailRepository };
  };

  it('returns the detail enriched with the summary of the top podcasts list', async () => {
    const { useCase, detailRepository } = build();

    const detail = await useCase.execute('1');

    expect(detailRepository.findById).toHaveBeenCalledWith('1');
    expect(detail.description).toBe('Summary');
    expect(detail.episodes).toHaveLength(2);
  });

  it('keeps the detail as is when the podcast is not in the top list', async () => {
    const { useCase } = build(aPodcastDetail({ description: '' }), []);

    await expect(useCase.execute('1')).resolves.toMatchObject({ description: '' });
  });

  it('throws PodcastNotFoundError when the podcast does not exist', async () => {
    const { useCase } = build(null as never);

    await expect(useCase.execute('1')).rejects.toBeInstanceOf(PodcastNotFoundError);
  });
});
