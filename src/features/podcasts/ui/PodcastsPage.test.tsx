import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { aPodcast, aPodcastDetail } from '@/test/mothers';
import { createFakeContainer, renderRoute } from '@/test/renderRoute';

const podcasts = [
  aPodcast({ id: '1', title: 'Switched on Pop', author: 'Vulture' }),
  aPodcast({ id: '2', title: 'Song Exploder', author: 'Hrishikesh Hirway' }),
  aPodcast({ id: '3', title: 'Broken Record', author: 'Pushkin Industries' }),
];

describe('PodcastsPage', () => {
  it('lists the top podcasts with their count', async () => {
    renderRoute('/', createFakeContainer({ podcasts }));

    const list = await screen.findByRole('list', { name: 'Podcasts' });
    expect(within(list).getAllByRole('listitem')).toHaveLength(3);
    expect(screen.getByLabelText('Podcasts found')).toHaveTextContent('3');
    expect(screen.getByText('Author: Vulture')).toBeInTheDocument();
  });

  it('filters immediately by title and author as the user types', async () => {
    const user = userEvent.setup();
    renderRoute('/', createFakeContainer({ podcasts }));
    const input = await screen.findByRole('searchbox', { name: 'Filter podcasts' });

    await user.type(input, 'push');
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
    expect(screen.getByRole('heading', { name: 'Broken Record' })).toBeInTheDocument();

    await user.clear(input);
    await user.type(input, 'EXPLODER');
    expect(screen.getByLabelText('Podcasts found')).toHaveTextContent('1');
    expect(screen.getByRole('heading', { name: 'Song Exploder' })).toBeInTheDocument();
  });

  it('navigates to the podcast detail on click', async () => {
    const user = userEvent.setup();
    const { router } = renderRoute(
      '/',
      createFakeContainer({ podcasts, details: [aPodcastDetail({ id: '2' })] }),
    );

    await user.click(await screen.findByRole('link', { name: /Song Exploder/ }));

    await waitFor(() => expect(router.state.location.pathname).toBe('/podcast/2'));
    expect(await screen.findByRole('heading', { name: 'Episodes: 559' })).toBeInTheDocument();
  });
});
