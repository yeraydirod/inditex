import type { PodcastDetail } from './PodcastDetail';

export interface PodcastDetailRepository {
  findById(podcastId: string): Promise<PodcastDetail | null>;
}
