import { aPodcastDetail } from '@/test/mothers';
import { PodcastDetail } from './PodcastDetail';

describe('PodcastDetail', () => {
  it('finds an episode by id', () => {
    const detail = aPodcastDetail();

    expect(detail.findEpisode('101')?.title).toBe('Second episode');
    expect(detail.findEpisode('missing')).toBeUndefined();
  });

  it('returns a new instance with the description', () => {
    const detail = aPodcastDetail({ description: '' });
    const described = detail.withDescription('New description');

    expect(described.description).toBe('New description');
    expect(detail.description).toBe('');
  });

  it('round-trips through primitives', () => {
    const detail = aPodcastDetail();

    expect(PodcastDetail.fromPrimitives(detail.toPrimitives())).toEqual(detail);
  });
});
