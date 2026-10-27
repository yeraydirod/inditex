import { Link } from 'react-router';
import { LoadingIndicator } from '../LoadingIndicator/LoadingIndicator';
import styles from './Header.module.css';

interface HeaderProps {
  isLoading: boolean;
}

export function Header({ isLoading }: HeaderProps) {
  return (
    <header className={styles.header}>
      <Link to="/" className={styles.title}>
        Podcaster
      </Link>
      {isLoading && <LoadingIndicator />}
    </header>
  );
}
