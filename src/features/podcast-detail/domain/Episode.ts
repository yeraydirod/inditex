import { Duration } from './Duration';

export interface EpisodePrimitives {
  id: string;
  title: string;
  description: string;
  /** Fecha de publicación en formato ISO 8601. */
  releaseDate: string;
  durationMs: number;
  audioUrl: string;
}

export class Episode {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly releaseDate: Date;
  readonly duration: Duration;
  readonly audioUrl: string;

  constructor({ id, title, description, releaseDate, durationMs, audioUrl }: EpisodePrimitives) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.releaseDate = new Date(releaseDate);
    this.duration = Duration.fromMilliseconds(durationMs);
    this.audioUrl = audioUrl;
  }

  static fromPrimitives(primitives: EpisodePrimitives): Episode {
    return new Episode(primitives);
  }

  toPrimitives(): EpisodePrimitives {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      releaseDate: this.releaseDate.toISOString(),
      durationMs: this.duration.milliseconds,
      audioUrl: this.audioUrl,
    };
  }
}
