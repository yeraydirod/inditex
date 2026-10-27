import type { PodcastRepository } from '@/features/podcasts/domain/PodcastRepository';
import { PodcastNotFoundError } from '../domain/errors';
import type { PodcastDetail } from '../domain/PodcastDetail';
import type { PodcastDetailRepository } from '../domain/PodcastDetailRepository';

/**
 * Obtiene el detalle de un podcast. El servicio de detalle no incluye la descripción del podcast,
 * así que se completa con el resumen que proporciona el listado de podcasts más populares.
 */
export class GetPodcastDetail {
  constructor(
    private readonly detailRepository: PodcastDetailRepository,
    private readonly podcastRepository: PodcastRepository,
  ) {}

  async execute(podcastId: string): Promise<PodcastDetail> {
    const [detail, topPodcasts] = await Promise.all([
      this.detailRepository.findById(podcastId),
      this.podcastRepository.findTop(),
    ]);

    if (!detail) {
      throw new PodcastNotFoundError(podcastId);
    }

    const summary = topPodcasts.find((podcast) => podcast.id === podcastId)?.summary;
    return summary ? detail.withDescription(summary) : detail;
  }
}
