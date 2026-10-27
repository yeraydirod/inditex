import { Link } from 'react-router';
import { Card } from '@/shared/ui/Card/Card';
import type { PodcastDetail } from '../domain/PodcastDetail';
import styles from './PodcastSidebar.module.css';

interface PodcastSidebarProps {
  podcast: PodcastDetail;
}

export function PodcastSidebar({ podcast }: PodcastSidebarProps) {
  const podcastUrl = `/podcast/${podcast.id}`;

  return (
    <Card className={styles.sidebar} aria-label="Podcast information">
      <Link to={podcastUrl} className={styles.imageLink}>
        <img className={styles.image} src={podcast.imageUrl} alt={podcast.title} />
      </Link>
      <div className={styles.section}>
        <h2 className={styles.title}>
          <Link to={podcastUrl}>{podcast.title}</Link>
        </h2>
        <p className={styles.author}>
          by <Link to={podcastUrl}>{podcast.author}</Link>
        </p>
      </div>
      {podcast.description && (
        <div className={styles.section}>
          <h3 className={styles.descriptionTitle}>Description:</h3>
          <p className={styles.description}>{podcast.description}</p>
        </div>
      )}
    </Card>
  );
}
