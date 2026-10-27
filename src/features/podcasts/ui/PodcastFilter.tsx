import styles from './PodcastFilter.module.css';

interface PodcastFilterProps {
  value: string;
  count: number;
  onChange: (value: string) => void;
}

export function PodcastFilter({ value, count, onChange }: PodcastFilterProps) {
  return (
    <div className={styles.filter}>
      <span className={styles.badge} aria-label="Podcasts found">
        {count}
      </span>
      <input
        className={styles.input}
        type="search"
        placeholder="Filter podcasts..."
        aria-label="Filter podcasts"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
