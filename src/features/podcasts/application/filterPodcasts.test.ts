import { aPodcast } from '@/test/mothers';
import { filterPodcasts } from './filterPodcasts';

describe('filterPodcasts', () => {
  const podcasts = [
    aPodcast({ id: '1', title: 'Switched on Pop', author: 'Vulture' }),
    aPodcast({ id: '2', title: 'Song Exploder', author: 'Hrishikesh Hirway' }),
    aPodcast({ id: '3', title: 'Broken Record', author: 'Pushkin Industries' }),
  ];

  it('returns every podcast for an empty term', () => {
    expect(filterPodcasts(podcasts, '')).toHaveLength(3);
  });

  it('filters by title or author', () => {
    expect(filterPodcasts(podcasts, 'exploder').map((p) => p.id)).toEqual(['2']);
    expect(filterPodcasts(podcasts, 'pushkin').map((p) => p.id)).toEqual(['3']);
  });
});
