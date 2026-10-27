import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { aPodcast, aPodcastDetail } from '@/test/mothers';
import { createFakeContainer, renderRoute } from '@/test/renderRoute';

describe('RootLayout', () => {
  it('shows the loading indicator while a client navigation is in progress', async () => {
    const user = userEvent.setup();
    const container = createFakeContainer({ podcasts: [aPodcast({ id: '1' })] });
    let resolveDetail: (value: ReturnType<typeof aPodcastDetail>) => void = () => {};
    jest
      .spyOn(container.getPodcastDetail, 'execute')
      .mockReturnValue(new Promise((resolve) => (resolveDetail = resolve)));
    renderRoute('/', container);

    await user.click(await screen.findByRole('link', { name: /Switched on Pop/ }));
    expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument();

    await act(async () => resolveDetail(aPodcastDetail({ id: '1' })));
    expect(await screen.findByRole('heading', { name: 'Episodes: 559' })).toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});
