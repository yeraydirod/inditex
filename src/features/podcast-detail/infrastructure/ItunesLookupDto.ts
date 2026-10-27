export interface ItunesPodcastResultDto {
  wrapperType: 'track';
  kind: 'podcast';
  collectionId: number;
  collectionName: string;
  artistName: string;
  artworkUrl600?: string;
  artworkUrl100?: string;
  trackCount?: number;
}

export interface ItunesEpisodeResultDto {
  wrapperType: 'podcastEpisode';
  trackId: number;
  trackName: string;
  description?: string;
  shortDescription?: string;
  releaseDate: string;
  trackTimeMillis?: number;
  episodeUrl?: string;
}

export interface ItunesLookupDto {
  resultCount: number;
  results: (ItunesPodcastResultDto | ItunesEpisodeResultDto)[];
}
