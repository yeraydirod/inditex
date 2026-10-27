const pad = (value: number): string => String(value).padStart(2, '0');

export class Duration {
  private constructor(readonly milliseconds: number) {}

  static fromMilliseconds(milliseconds: number): Duration {
    return new Duration(Number.isFinite(milliseconds) && milliseconds > 0 ? milliseconds : 0);
  }

  /** Devuelve la duración como `HH:MM:SS`, o `MM:SS` si dura menos de una hora. */
  format(): string {
    const totalSeconds = Math.floor(this.milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return hours > 0
      ? `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
      : `${pad(minutes)}:${pad(seconds)}`;
  }
}
