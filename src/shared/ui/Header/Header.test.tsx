import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { Header } from './Header';

const renderHeader = (isLoading: boolean) =>
  render(
    <MemoryRouter>
      <Header isLoading={isLoading} />
    </MemoryRouter>,
  );

describe('Header', () => {
  it('links the application title to the home page', () => {
    renderHeader(false);
    expect(screen.getByRole('link', { name: 'Podcaster' })).toHaveAttribute('href', '/');
  });

  it('shows the loading indicator only while loading', () => {
    const { rerender } = renderHeader(true);
    expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument();

    rerender(
      <MemoryRouter>
        <Header isLoading={false} />
      </MemoryRouter>,
    );
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});
