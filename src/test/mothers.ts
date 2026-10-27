import { Podcast, type PodcastPrimitives } from '@/features/podcasts/domain/Podcast';
import type { EpisodePrimitives } from '@/features/podcast-detail/domain/Episode';
import {
  PodcastDetail,
  type PodcastDetailPrimitives,
} from '@/features/podcast-detail/domain/PodcastDetail';

export const aPodcast = (overrides: Partial<PodcastPrimitives> = {}): Podcast =>
  new Podcast({
    id: '1',
    title: 'Switched on Pop',
    author: 'Vulture',
    imageUrl: 'https://example.com/image.png',
    summary: 'A podcast about the making and meaning of popular music.',
    ...overrides,
  });

export const anEpisode = (overrides: Partial<EpisodePrimitives> = {}): EpisodePrimitives => ({
  id: '100',
  title: 'The bummer hope of Midwest Emo',
  description: '<p>Episode <strong>description</strong></p>',
  releaseDate: '2026-10-27T07:01:00.000Z',
  durationMs: 1_820_000,
  audioUrl: 'https://example.com/episode.mp3',
  ...overrides,
});

export const aPodcastDetail = (overrides: Partial<PodcastDetailPrimitives> = {}): PodcastDetail =>
  new PodcastDetail({
    id: '1',
    title: 'Switched on Pop',
    author: 'Vulture',
    imageUrl: 'https://example.com/image600.png',
    description: '',
    episodeCount: 559,
    episodes: [anEpisode(), anEpisode({ id: '101', title: 'Second episode' })],
    ...overrides,
  });
