import type { Podcast } from './Podcast';

export interface PodcastRepository {
  findTop(): Promise<Podcast[]>;
}
