export class PodcastNotFoundError extends Error {
  constructor(readonly podcastId: string) {
    super(`Podcast ${podcastId} not found`);
    this.name = 'PodcastNotFoundError';
  }
}

export class EpisodeNotFoundError extends Error {
  constructor(
    readonly podcastId: string,
    readonly episodeId: string,
  ) {
    super(`Episode ${episodeId} not found in podcast ${podcastId}`);
    this.name = 'EpisodeNotFoundError';
  }
}
