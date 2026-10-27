import { Outlet, useLoaderData } from 'react-router';
import type { PodcastLoaderData } from './loaders';
import styles from './PodcastLayout.module.css';
import { PodcastSidebar } from './PodcastSidebar';

/** Layout compartido por el detalle del podcast y el detalle de un episodio. */
export function PodcastLayout() {
  const { podcast } = useLoaderData() as PodcastLoaderData;

  return (
    <div className={styles.layout}>
      <PodcastSidebar podcast={podcast} />
      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  );
}
