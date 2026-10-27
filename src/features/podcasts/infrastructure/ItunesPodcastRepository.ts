import type { HttpClient } from '@/shared/infrastructure/http/HttpClient';
import type { Podcast } from '../domain/Podcast';
import type { PodcastRepository } from '../domain/PodcastRepository';
import type { ItunesTopPodcastsDto } from './ItunesTopPodcastsDto';
import { toPodcasts } from './podcastMapper';

export const TOP_PODCASTS_URL =
  'https://itunes.apple.com/us/rss/toppodcasts/limit=100/genre=1310/json';

export class ItunesPodcastRepository implements PodcastRepository {
  constructor(private readonly http: HttpClient) {}

  async findTop(): Promise<Podcast[]> {
    const dto = await this.http.getJson<ItunesTopPodcastsDto>(TOP_PODCASTS_URL);
    return toPodcasts(dto);
  }
}
