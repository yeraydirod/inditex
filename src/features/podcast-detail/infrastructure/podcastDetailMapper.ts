import { PodcastDetail } from '../domain/PodcastDetail';
import type {
  ItunesEpisodeResultDto,
  ItunesLookupDto,
  ItunesPodcastResultDto,
} from './ItunesLookupDto';

const isPodcast = (result: ItunesLookupDto['results'][number]): result is ItunesPodcastResultDto =>
  result.wrapperType === 'track';

const isEpisode = (result: ItunesLookupDto['results'][number]): result is ItunesEpisodeResultDto =>
  result.wrapperType === 'podcastEpisode';

export function toPodcastDetail(dto: ItunesLookupDto): PodcastDetail | null {
  const podcast = dto.results.find(isPodcast);
  if (!podcast) return null;

  const episodes = dto.results.filter(isEpisode);

  return new PodcastDetail({
    id: String(podcast.collectionId),
    title: podcast.collectionName,
    author: podcast.artistName,
    imageUrl: podcast.artworkUrl600 ?? podcast.artworkUrl100 ?? '',
    description: '',
    episodeCount: podcast.trackCount ?? episodes.length,
    episodes: episodes.map((episode) => ({
      id: String(episode.trackId),
      title: episode.trackName,
      description: episode.description ?? episode.shortDescription ?? '',
      releaseDate: episode.releaseDate,
      durationMs: episode.trackTimeMillis ?? 0,
      audioUrl: episode.episodeUrl ?? '',
    })),
  });
}
