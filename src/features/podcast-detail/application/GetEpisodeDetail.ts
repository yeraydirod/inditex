import { EpisodeNotFoundError } from '../domain/errors';
import type { Episode } from '../domain/Episode';
import type { PodcastDetail } from '../domain/PodcastDetail';
import type { GetPodcastDetail } from './GetPodcastDetail';

export interface EpisodeDetail {
  podcast: PodcastDetail;
  episode: Episode;
}

export class GetEpisodeDetail {
  constructor(private readonly getPodcastDetail: GetPodcastDetail) {}

  async execute(podcastId: string, episodeId: string): Promise<EpisodeDetail> {
    const podcast = await this.getPodcastDetail.execute(podcastId);
    const episode = podcast.findEpisode(episodeId);
    if (!episode) {
      throw new EpisodeNotFoundError(podcastId, episodeId);
    }
    return { podcast, episode };
  }
}
