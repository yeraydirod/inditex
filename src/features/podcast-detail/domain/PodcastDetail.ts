import { Episode, type EpisodePrimitives } from './Episode';

export interface PodcastDetailPrimitives {
  id: string;
  title: string;
  author: string;
  imageUrl: string;
  description: string;
  episodeCount: number;
  episodes: EpisodePrimitives[];
}

export class PodcastDetail {
  readonly id: string;
  readonly title: string;
  readonly author: string;
  readonly imageUrl: string;
  readonly description: string;
  /** Número total de episodios que tiene el podcast (puede ser mayor que los episodios cargados). */
  readonly episodeCount: number;
  readonly episodes: readonly Episode[];

  constructor(primitives: PodcastDetailPrimitives) {
    this.id = primitives.id;
    this.title = primitives.title;
    this.author = primitives.author;
    this.imageUrl = primitives.imageUrl;
    this.description = primitives.description;
    this.episodeCount = primitives.episodeCount;
    this.episodes = primitives.episodes.map(Episode.fromPrimitives);
  }

  static fromPrimitives(primitives: PodcastDetailPrimitives): PodcastDetail {
    return new PodcastDetail(primitives);
  }

  findEpisode(episodeId: string): Episode | undefined {
    return this.episodes.find((episode) => episode.id === episodeId);
  }

  withDescription(description: string): PodcastDetail {
    return new PodcastDetail({ ...this.toPrimitives(), description });
  }

  toPrimitives(): PodcastDetailPrimitives {
    return {
      id: this.id,
      title: this.title,
      author: this.author,
      imageUrl: this.imageUrl,
      description: this.description,
      episodeCount: this.episodeCount,
      episodes: this.episodes.map((episode) => episode.toPrimitives()),
    };
  }
}
