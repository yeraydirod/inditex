import { FakeClock } from '@/test/fakes';
import { ONE_DAY_MS } from './Cache';
import { LocalStorageCache } from './LocalStorageCache';

describe('LocalStorageCache', () => {
  let clock: FakeClock;
  let cache: LocalStorageCache;

  beforeEach(() => {
    localStorage.clear();
    clock = new FakeClock(1_000);
    cache = new LocalStorageCache({ storage: localStorage, clock, ttlMs: ONE_DAY_MS });
  });

  it('returns null when the key does not exist', () => {
    expect(cache.get('missing')).toBeNull();
  });

  it('returns the stored value before it expires', () => {
    cache.set('key', { value: 42 });
    clock.advance(ONE_DAY_MS);

    expect(cache.get('key')).toEqual({ value: 42 });
  });

  it('returns null and removes the entry once it has expired', () => {
    cache.set('key', { value: 42 });
    clock.advance(ONE_DAY_MS + 1);

    expect(cache.get('key')).toBeNull();
    expect(localStorage.getItem('podcaster:key')).toBeNull();
  });

  it('ignores corrupted entries', () => {
    localStorage.setItem('podcaster:key', '{not json');

    expect(cache.get('key')).toBeNull();
  });

  it('evicts expired entries and retries when the storage is full', () => {
    cache.set('old', 'stale');
    clock.advance(ONE_DAY_MS + 1);

    const setItem = jest.spyOn(Storage.prototype, 'setItem');
    setItem.mockImplementationOnce(() => {
      throw new DOMException('quota', 'QuotaExceededError');
    });

    cache.set('new', 'fresh');

    expect(localStorage.getItem('podcaster:old')).toBeNull();
    expect(cache.get('new')).toBe('fresh');
    setItem.mockRestore();
  });
});
