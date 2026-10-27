import styles from './LoadingIndicator.module.css';

export function LoadingIndicator() {
  return <span className={styles.indicator} role="status" aria-label="Loading" />;
}
