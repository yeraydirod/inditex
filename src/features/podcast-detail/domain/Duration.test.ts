import { Duration } from './Duration';

describe('Duration', () => {
  it.each([
    [0, '00:00'],
    [59_000, '00:59'],
    [1_820_000, '30:20'],
    [3_600_000, '01:00:00'],
    [5_025_999, '01:23:45'],
    [-10, '00:00'],
    [Number.NaN, '00:00'],
  ])('formats %d ms as %s', (ms, expected) => {
    expect(Duration.fromMilliseconds(ms).format()).toBe(expected);
  });
});
