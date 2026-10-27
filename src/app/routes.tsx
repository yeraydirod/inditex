import type { RouteObject } from 'react-router';
import { EpisodeDetailPage } from '@/features/podcast-detail/ui/EpisodeDetailPage';
import { PodcastDetailPage } from '@/features/podcast-detail/ui/PodcastDetailPage';
import { PodcastLayout } from '@/features/podcast-detail/ui/PodcastLayout';
import {
  createEpisodeDetailLoader,
  createPodcastDetailLoader,
  PODCAST_ROUTE_ID,
} from '@/features/podcast-detail/ui/loaders';
import { createPodcastsLoader } from '@/features/podcasts/ui/loaders';
import { PodcastsPage } from '@/features/podcasts/ui/PodcastsPage';
import type { Container } from './container';
import { RootLayout, RootFallback } from './RootLayout';
import { RouteError } from './RouteError';

export const paths = {
  home: '/',
  podcast: '/podcast/:podcastId',
  episode: '/podcast/:podcastId/episode/:episodeId',
} as const;

export function createRoutes(container: Container): RouteObject[] {
  return [
    {
      path: '/',
      element: <RootLayout />,
      hydrateFallbackElement: <RootFallback />,
      errorElement: <RouteError />,
      children: [
        {
          index: true,
          loader: createPodcastsLoader(container.getTopPodcasts),
          element: <PodcastsPage />,
        },
        {
          id: PODCAST_ROUTE_ID,
          path: 'podcast/:podcastId',
          loader: createPodcastDetailLoader(container.getPodcastDetail),
          element: <PodcastLayout />,
          children: [
            { index: true, element: <PodcastDetailPage /> },
            {
              path: 'episode/:episodeId',
              loader: createEpisodeDetailLoader(container.getEpisodeDetail),
              element: <EpisodeDetailPage />,
            },
          ],
        },
      ],
    },
  ];
}
