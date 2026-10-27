import { Link, useRouteLoaderData } from 'react-router';
import { Card } from '@/shared/ui/Card/Card';
import { formatDate } from './format';
import { PODCAST_ROUTE_ID, type PodcastLoaderData } from './loaders';
import styles from './PodcastDetailPage.module.css';

export function PodcastDetailPage() {
  const { podcast } = useRouteLoaderData(PODCAST_ROUTE_ID) as PodcastLoaderData;

  return (
    <>
      <Card>
        <h2 className={styles.count}>Episodes: {podcast.episodeCount}</h2>
      </Card>
      <Card>
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">Title</th>
              <th scope="col">Date</th>
              <th scope="col" className={styles.numeric}>
                Duration
              </th>
            </tr>
          </thead>
          <tbody>
            {podcast.episodes.map((episode) => (
              <tr key={episode.id}>
                <td>
                  <Link to={`/podcast/${podcast.id}/episode/${episode.id}`}>{episode.title}</Link>
                </td>
                <td className={styles.nowrap}>{formatDate(episode.releaseDate)}</td>
                <td className={styles.numeric}>{episode.duration.format()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}
