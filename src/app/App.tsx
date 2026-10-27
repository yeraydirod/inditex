import { useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { createContainer, type Container } from './container';
import { createRoutes } from './routes';
import './styles/global.css';

interface AppProps {
  container?: Container;
}

export function App({ container }: AppProps) {
  const [router] = useState(() =>
    createBrowserRouter(createRoutes(container ?? createContainer())),
  );
  return <RouterProvider router={router} />;
}
