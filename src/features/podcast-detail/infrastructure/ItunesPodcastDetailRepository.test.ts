import type { HttpClient } from '@/shared/infrastructure/http/HttpClient';
import type { ItunesLookupDto } from './ItunesLookupDto';
import { ItunesPodcastDetailRepository, podcastLookupUrl } from './ItunesPodcastDetailRepository';

const dto: ItunesLookupDto = {
  resultCount: 2,
  results: [
    {
      wrapperType: 'track',
      kind: 'podcast',
      collectionId: 934552872,
      collectionName: 'Switched on Pop',
      artistName: 'Vulture',
      artworkUrl600: 'https://img/600.png',
      trackCount: 559,
    },
    {
      wrapperType: 'podcastEpisode',
      trackId: 1000798311308,
      trackName: 'Midwest Emo',
      description: '<p>Rich description</p>',
      releaseDate: '2026-10-27T07:01:00Z',
      trackTimeMillis: 1_820_000,
      episodeUrl: 'https://audio/episode.mp3',
    },
  ],
};

describe('ItunesPodcastDetailRepository', () => {
  it('fetches the lookup endpoint and maps the podcast detail', async () => {
    const http: HttpClient = { getJson: jest.fn().mockResolvedValue(dto) };

    const detail = await new ItunesPodcastDetailRepository(http).findById('934552872');

    expect(http.getJson).toHaveBeenCalledWith(podcastLookupUrl('934552872'));
    expect(detail?.toPrimitives()).toEqual({
      id: '934552872',
      title: 'Switched on Pop',
      author: 'Vulture',
      imageUrl: 'https://img/600.png',
      description: '',
      episodeCount: 559,
      episodes: [
        {
          id: '1000798311308',
          title: 'Midwest Emo',
          description: '<p>Rich description</p>',
          releaseDate: '2026-10-27T07:01:00.000Z',
          durationMs: 1_820_000,
          audioUrl: 'https://audio/episode.mp3',
        },
      ],
    });
  });

  it('returns null when the podcast does not exist', async () => {
    const http: HttpClient = {
      getJson: jest.fn().mockResolvedValue({ resultCount: 0, results: [] }),
    };

    await expect(new ItunesPodcastDetailRepository(http).findById('0')).resolves.toBeNull();
  });

  it('builds the lookup url with the episodes limit', () => {
    expect(podcastLookupUrl('42')).toBe(
      'https://itunes.apple.com/lookup?id=42&media=podcast&entity=podcastEpisode&limit=20',
    );
  });
});
