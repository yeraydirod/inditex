import type { Podcast } from '../domain/Podcast';
import type { PodcastRepository } from '../domain/PodcastRepository';

export class GetTopPodcasts {
  constructor(private readonly repository: PodcastRepository) {}

  execute(): Promise<Podcast[]> {
    return this.repository.findTop();
  }
}
