import type { Podcast } from '../domain/Podcast';

export function filterPodcasts(podcasts: readonly Podcast[], term: string): Podcast[] {
  return podcasts.filter((podcast) => podcast.matches(term));
}
