import { toSafeHtml } from './EpisodeDescription';

describe('toSafeHtml', () => {
  it('keeps the HTML so it is rendered interpreted', () => {
    expect(toSafeHtml('<p>Hello <strong>world</strong></p>')).toBe(
      '<p>Hello <strong>world</strong></p>',
    );
  });

  it('removes dangerous markup', () => {
    expect(toSafeHtml('<p onclick="alert(1)">Hi</p><script>alert(1)</script>')).toBe('<p>Hi</p>');
  });

  it('preserves line breaks of plain text descriptions', () => {
    expect(toSafeHtml('Line 1\nLine 2 & more')).toBe('Line 1<br>Line 2 &amp; more');
  });
});
