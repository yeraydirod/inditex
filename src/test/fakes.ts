import type { Clock } from '@/shared/domain/Clock';
import type { Cache } from '@/shared/infrastructure/cache/Cache';

export class FakeClock implements Clock {
  constructor(private current = 0) {}

  now(): number {
    return this.current;
  }

  advance(ms: number): void {
    this.current += ms;
  }
}

export class InMemoryCache implements Cache {
  readonly entries = new Map<string, unknown>();

  get<T>(key: string): T | null {
    return (this.entries.get(key) as T | undefined) ?? null;
  }

  set<T>(key: string, value: T): void {
    this.entries.set(key, value);
  }
}
