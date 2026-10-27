import { Outlet, ScrollRestoration, useNavigation } from 'react-router';
import { Header } from '@/shared/ui/Header/Header';
import styles from './RootLayout.module.css';

export function RootLayout() {
  const navigation = useNavigation();
  const isNavigating = navigation.state !== 'idle';

  return (
    <div className={styles.layout}>
      <Header isLoading={isNavigating} />
      <main className={styles.main}>
        <Outlet />
      </main>
      <ScrollRestoration />
    </div>
  );
}

/** Se muestra mientras se resuelven los loaders de la carga inicial de la aplicación. */
export function RootFallback() {
  return (
    <div className={styles.layout}>
      <Header isLoading />
    </div>
  );
}
