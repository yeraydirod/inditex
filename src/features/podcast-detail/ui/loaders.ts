import type { LoaderFunctionArgs } from 'react-router';
import type { EpisodeDetail, GetEpisodeDetail } from '../application/GetEpisodeDetail';
import type { GetPodcastDetail } from '../application/GetPodcastDetail';
import type { PodcastDetail } from '../domain/PodcastDetail';

export const PODCAST_ROUTE_ID = 'podcast';

export interface PodcastLoaderData {
  podcast: PodcastDetail;
}

export type EpisodeLoaderData = EpisodeDetail;

export const createPodcastDetailLoader =
  (getPodcastDetail: GetPodcastDetail) =>
  async ({ params }: LoaderFunctionArgs): Promise<PodcastLoaderData> => ({
    podcast: await getPodcastDetail.execute(params.podcastId ?? ''),
  });

export const createEpisodeDetailLoader =
  (getEpisodeDetail: GetEpisodeDetail) =>
  ({ params }: LoaderFunctionArgs): Promise<EpisodeLoaderData> =>
    getEpisodeDetail.execute(params.podcastId ?? '', params.episodeId ?? '');
