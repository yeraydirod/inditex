import type { GetTopPodcasts } from '../application/GetTopPodcasts';
import type { Podcast } from '../domain/Podcast';

export interface PodcastsLoaderData {
  podcasts: Podcast[];
}

export const createPodcastsLoader =
  (getTopPodcasts: GetTopPodcasts) => async (): Promise<PodcastsLoaderData> => ({
    podcasts: await getTopPodcasts.execute(),
  });
