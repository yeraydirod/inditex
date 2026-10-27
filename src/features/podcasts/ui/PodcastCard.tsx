import { Link } from 'react-router';
import type { Podcast } from '../domain/Podcast';
import styles from './PodcastCard.module.css';

interface PodcastCardProps {
  podcast: Podcast;
}

export function PodcastCard({ podcast }: PodcastCardProps) {
  return (
    <Link to={`/podcast/${podcast.id}`} className={styles.card}>
      <img className={styles.image} src={podcast.imageUrl} alt="" loading="lazy" />
      <h2 className={styles.title}>{podcast.title}</h2>
      <p className={styles.author}>Author: {podcast.author}</p>
    </Link>
  );
}
