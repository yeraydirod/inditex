import { useLoaderData } from 'react-router';
import { Card } from '@/shared/ui/Card/Card';
import { EpisodeDescription } from './EpisodeDescription';
import styles from './EpisodeDetailPage.module.css';
import type { EpisodeLoaderData } from './loaders';

export function EpisodeDetailPage() {
  const { episode } = useLoaderData() as EpisodeLoaderData;

  return (
    <Card className={styles.episode}>
      <h2 className={styles.title}>{episode.title}</h2>
      <EpisodeDescription className={styles.description} description={episode.description} />
      {/* key: fuerza a recrear el reproductor al cambiar de episodio */}
      <audio key={episode.id} className={styles.player} src={episode.audioUrl} controls>
        Your browser does not support the audio element.
      </audio>
    </Card>
  );
}
