import { useEffect } from 'react';
import { useRouteError } from 'react-router';
import { Header } from '@/shared/ui/Header/Header';
import styles from './RootLayout.module.css';

/** Según el enunciado, los errores solo se muestran en la consola del navegador (mensaje y traza). */
export function RouteError() {
  const error = useRouteError();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className={styles.layout}>
      <Header isLoading={false} />
    </div>
  );
}
