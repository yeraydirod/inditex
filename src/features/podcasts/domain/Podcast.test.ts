import { aPodcast } from '@/test/mothers';
import { Podcast } from './Podcast';

describe('Podcast', () => {
  const podcast = aPodcast({ title: 'Switched on Pop', author: 'Vulture' });

  it.each(['', '   ', 'switched', 'ON POP', 'vult'])('matches the term "%s"', (term) => {
    expect(podcast.matches(term)).toBe(true);
  });

  it('matches ignoring diacritics', () => {
    expect(aPodcast({ title: 'Música en vena' }).matches('musica')).toBe(true);
  });

  it('does not match terms absent from title and author', () => {
    expect(podcast.matches('jazz')).toBe(false);
  });

  it('round-trips through primitives', () => {
    expect(Podcast.fromPrimitives(podcast.toPrimitives())).toEqual(podcast);
  });
});
