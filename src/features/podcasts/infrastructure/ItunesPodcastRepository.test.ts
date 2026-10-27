import type { HttpClient } from '@/shared/infrastructure/http/HttpClient';
import type { ItunesTopPodcastsDto } from './ItunesTopPodcastsDto';
import { ItunesPodcastRepository, TOP_PODCASTS_URL } from './ItunesPodcastRepository';

const dto: ItunesTopPodcastsDto = {
  feed: {
    entry: [
      {
        'im:name': { label: 'Switched on Pop' },
        'im:image': [
          { label: 'https://img/55.png', attributes: { height: '55' } },
          { label: 'https://img/170.png', attributes: { height: '170' } },
          { label: 'https://img/60.png', attributes: { height: '60' } },
        ],
        'im:artist': { label: 'Vulture' },
        summary: { label: 'Pop music explained' },
        id: {
          label: 'https://podcasts.apple.com/id934552872',
          attributes: { 'im:id': '934552872' },
        },
      },
    ],
  },
};

describe('ItunesPodcastRepository', () => {
  it('fetches the top podcasts and maps them to the domain', async () => {
    const http: HttpClient = { getJson: jest.fn().mockResolvedValue(dto) };

    const [podcast] = await new ItunesPodcastRepository(http).findTop();

    expect(http.getJson).toHaveBeenCalledWith(TOP_PODCASTS_URL);
    expect(podcast.toPrimitives()).toEqual({
      id: '934552872',
      title: 'Switched on Pop',
      author: 'Vulture',
      imageUrl: 'https://img/170.png',
      summary: 'Pop music explained',
    });
  });

  it('returns an empty list when the feed has no entries', async () => {
    const http: HttpClient = { getJson: jest.fn().mockResolvedValue({ feed: {} }) };

    await expect(new ItunesPodcastRepository(http).findTop()).resolves.toEqual([]);
  });
});
