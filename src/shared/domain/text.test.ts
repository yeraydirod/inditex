import { normalizeText } from './text';

describe('normalizeText', () => {
  it('lowercases, trims and removes diacritics', () => {
    expect(normalizeText('  CanciÓn Ñandú ')).toBe('cancion nandu');
  });
});
