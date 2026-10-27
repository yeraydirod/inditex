import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { aPodcastDetail, anEpisode } from '@/test/mothers';
import { createFakeContainer, renderRoute } from '@/test/renderRoute';

const detail = aPodcastDetail({
  id: '1',
  title: 'Switched on Pop',
  episodes: [
    anEpisode({
      id: '100',
      title: 'Midwest Emo',
      description: '<p>Listen to <a href="https://example.com">this</a></p>',
      audioUrl: 'https://example.com/emo.mp3',
    }),
  ],
});

describe('EpisodeDetailPage', () => {
  it('shows the episode title, its interpreted HTML description and an audio player', async () => {
    renderRoute('/podcast/1/episode/100', createFakeContainer({ details: [detail] }));

    expect(await screen.findByRole('heading', { name: 'Midwest Emo' })).toBeInTheDocument();
    const description = screen.getByTestId('episode-description');
    expect(within(description).getByRole('link', { name: 'this' })).toHaveAttribute(
      'href',
      'https://example.com',
    );
    expect(description).not.toHaveTextContent('<p>');
    expect(document.querySelector('audio')).toHaveAttribute('src', 'https://example.com/emo.mp3');
  });

  it('keeps the podcast sidebar with links back to the podcast detail', async () => {
    const user = userEvent.setup();
    const { router } = renderRoute(
      '/podcast/1/episode/100',
      createFakeContainer({ details: [detail] }),
    );

    const sidebar = await screen.findByRole('region', { name: 'Podcast information' });
    const links = within(sidebar).getAllByRole('link');
    expect(links).toHaveLength(3); // imagen, título y autor
    links.forEach((link) => expect(link).toHaveAttribute('href', '/podcast/1'));

    await user.click(within(sidebar).getByRole('img', { name: 'Switched on Pop' }));

    await waitFor(() => expect(router.state.location.pathname).toBe('/podcast/1'));
  });
});
