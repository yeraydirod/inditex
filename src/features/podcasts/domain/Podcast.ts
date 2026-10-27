import { normalizeText } from '@/shared/domain/text';

export interface PodcastPrimitives {
  id: string;
  title: string;
  author: string;
  imageUrl: string;
  summary: string;
}

export class Podcast {
  readonly id: string;
  readonly title: string;
  readonly author: string;
  readonly imageUrl: string;
  readonly summary: string;

  constructor({ id, title, author, imageUrl, summary }: PodcastPrimitives) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.imageUrl = imageUrl;
    this.summary = summary;
  }

  static fromPrimitives(primitives: PodcastPrimitives): Podcast {
    return new Podcast(primitives);
  }

  /** Indica si el podcast coincide con el término buscado en su título o en su autor. */
  matches(term: string): boolean {
    const normalizedTerm = normalizeText(term);
    if (normalizedTerm === '') return true;
    return [this.title, this.author].some((field) => normalizeText(field).includes(normalizedTerm));
  }

  toPrimitives(): PodcastPrimitives {
    return {
      id: this.id,
      title: this.title,
      author: this.author,
      imageUrl: this.imageUrl,
      summary: this.summary,
    };
  }
}
