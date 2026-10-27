import type { Clock } from '@/shared/domain/Clock';

export class SystemClock implements Clock {
  now(): number {
    return Date.now();
  }
}
