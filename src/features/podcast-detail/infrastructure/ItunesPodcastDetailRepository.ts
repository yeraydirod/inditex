import type { HttpClient } from '@/shared/infrastructure/http/HttpClient';
import type { PodcastDetail } from '../domain/PodcastDetail';
import type { PodcastDetailRepository } from '../domain/PodcastDetailRepository';
import type { ItunesLookupDto } from './ItunesLookupDto';
import { toPodcastDetail } from './podcastDetailMapper';

export const EPISODES_LIMIT = 20;

export const podcastLookupUrl = (podcastId: string): string =>
  `https://itunes.apple.com/lookup?id=${encodeURIComponent(podcastId)}` +
  `&media=podcast&entity=podcastEpisode&limit=${EPISODES_LIMIT}`;

export class ItunesPodcastDetailRepository implements PodcastDetailRepository {
  constructor(private readonly http: HttpClient) {}

  async findById(podcastId: string): Promise<PodcastDetail | null> {
    const dto = await this.http.getJson<ItunesLookupDto>(podcastLookupUrl(podcastId));
    return toPodcastDetail(dto);
  }
}
