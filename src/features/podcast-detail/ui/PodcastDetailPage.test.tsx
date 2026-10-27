import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { aPodcast, aPodcastDetail, anEpisode } from '@/test/mothers';
import { createFakeContainer, renderRoute } from '@/test/renderRoute';

const detail = aPodcastDetail({
  id: '1',
  title: 'Switched on Pop',
  author: 'Vulture',
  episodeCount: 559,
  episodes: [
    anEpisode({
      id: '100',
      title: 'Midwest Emo',
      releaseDate: '2026-10-27T07:01:00Z',
      durationMs: 1_820_000,
    }),
    anEpisode({
      id: '101',
      title: 'Long one',
      releaseDate: '2026-01-05T00:00:00Z',
      durationMs: 5_025_000,
    }),
  ],
});
const container = () =>
  createFakeContainer({
    podcasts: [aPodcast({ id: '1', summary: 'Pop music, explained.' })],
    details: [detail],
  });

describe('PodcastDetailPage', () => {
  it('shows the sidebar with image, title, author and description', async () => {
    renderRoute('/podcast/1', container());

    const sidebar = await screen.findByRole('region', { name: 'Podcast information' });
    expect(within(sidebar).getByRole('img', { name: 'Switched on Pop' })).toBeInTheDocument();
    expect(within(sidebar).getByRole('link', { name: 'Vulture' })).toHaveAttribute(
      'href',
      '/podcast/1',
    );
    expect(within(sidebar).getByText('Pop music, explained.')).toBeInTheDocument();
  });

  it('shows the number of episodes and their title, date and duration', async () => {
    renderRoute('/podcast/1', container());

    expect(await screen.findByRole('heading', { name: 'Episodes: 559' })).toBeInTheDocument();
    const rows = screen.getAllByRole('row').slice(1);
    expect(rows).toHaveLength(2);
    expect(rows[0]).toHaveTextContent('Midwest Emo');
    expect(rows[0]).toHaveTextContent('27/10/2026');
    expect(rows[0]).toHaveTextContent('30:20');
    expect(rows[1]).toHaveTextContent('05/01/2026');
    expect(rows[1]).toHaveTextContent('01:23:45');
  });

  it('navigates to the episode detail when clicking its title', async () => {
    const user = userEvent.setup();
    const { router } = renderRoute('/podcast/1', container());

    await user.click(await screen.findByRole('link', { name: 'Midwest Emo' }));

    await waitFor(() => expect(router.state.location.pathname).toBe('/podcast/1/episode/100'));
  });

  it('logs the error in the console when the podcast does not exist', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    renderRoute('/podcast/999', container());

    await waitFor(() =>
      expect(consoleError).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'PodcastNotFoundError' }),
      ),
    );
    consoleError.mockRestore();
  });
});
