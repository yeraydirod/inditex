import { useMemo, useState } from 'react';
import { useLoaderData } from 'react-router';
import { filterPodcasts } from '../application/filterPodcasts';
import type { PodcastsLoaderData } from './loaders';
import { PodcastCard } from './PodcastCard';
import { PodcastFilter } from './PodcastFilter';
import styles from './PodcastsPage.module.css';

export function PodcastsPage() {
  const { podcasts } = useLoaderData() as PodcastsLoaderData;
  const [term, setTerm] = useState('');
  const visiblePodcasts = useMemo(() => filterPodcasts(podcasts, term), [podcasts, term]);

  return (
    <>
      <PodcastFilter value={term} onChange={setTerm} count={visiblePodcasts.length} />
      <ul className={styles.grid} aria-label="Podcasts">
        {visiblePodcasts.map((podcast) => (
          <li key={podcast.id}>
            <PodcastCard podcast={podcast} />
          </li>
        ))}
      </ul>
    </>
  );
}
