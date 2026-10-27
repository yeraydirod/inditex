import { render } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import type { Container } from '@/app/container';
import { createRoutes } from '@/app/routes';
import { GetEpisodeDetail } from '@/features/podcast-detail/application/GetEpisodeDetail';
import { GetPodcastDetail } from '@/features/podcast-detail/application/GetPodcastDetail';
import type { PodcastDetail } from '@/features/podcast-detail/domain/PodcastDetail';
import { GetTopPodcasts } from '@/features/podcasts/application/GetTopPodcasts';
import type { Podcast } from '@/features/podcasts/domain/Podcast';

interface FakeData {
  podcasts?: Podcast[];
  details?: PodcastDetail[];
}

/** Contenedor con repositorios en memoria: los casos de uso reales sobre datos controlados. */
export function createFakeContainer({ podcasts = [], details = [] }: FakeData = {}): Container {
  const podcastRepository = { findTop: jest.fn(async () => podcasts) };
  const detailRepository = {
    findById: jest.fn(async (id: string) => details.find((detail) => detail.id === id) ?? null),
  };
  const getPodcastDetail = new GetPodcastDetail(detailRepository, podcastRepository);
  return {
    getTopPodcasts: new GetTopPodcasts(podcastRepository),
    getPodcastDetail,
    getEpisodeDetail: new GetEpisodeDetail(getPodcastDetail),
  };
}

export function renderRoute(path: string, container: Container = createFakeContainer()) {
  const router = createMemoryRouter(createRoutes(container), { initialEntries: [path] });
  return { router, ...render(<RouterProvider router={router} />) };
}
