import type { Clock } from '@/shared/domain/Clock';
import type { Cache } from './Cache';

interface CacheEntry<T> {
  storedAt: number;
  value: T;
}

interface LocalStorageCacheOptions {
  storage: Storage;
  clock: Clock;
  ttlMs: number;
  namespace?: string;
}

/** Caché persistente en `localStorage` cuyas entradas caducan pasado `ttlMs`. */
export class LocalStorageCache implements Cache {
  private readonly storage: Storage;
  private readonly clock: Clock;
  private readonly ttlMs: number;
  private readonly namespace: string;

  constructor({ storage, clock, ttlMs, namespace = 'podcaster' }: LocalStorageCacheOptions) {
    this.storage = storage;
    this.clock = clock;
    this.ttlMs = ttlMs;
    this.namespace = namespace;
  }

  get<T>(key: string): T | null {
    const storageKey = this.storageKey(key);
    const raw = this.storage.getItem(storageKey);
    if (raw === null) return null;

    try {
      const entry = JSON.parse(raw) as CacheEntry<T>;
      if (this.isExpired(entry)) {
        this.storage.removeItem(storageKey);
        return null;
      }
      return entry.value;
    } catch {
      this.storage.removeItem(storageKey);
      return null;
    }
  }

  set<T>(key: string, value: T): void {
    const entry: CacheEntry<T> = { storedAt: this.clock.now(), value };
    const serialized = JSON.stringify(entry);
    try {
      this.storage.setItem(this.storageKey(key), serialized);
    } catch {
      // Probablemente se ha superado la cuota: liberamos entradas caducadas y reintentamos una vez.
      this.evictExpired();
      try {
        this.storage.setItem(this.storageKey(key), serialized);
      } catch (error) {
        console.error(error);
      }
    }
  }

  private evictExpired(): void {
    const prefix = `${this.namespace}:`;
    const keys = Array.from({ length: this.storage.length }, (_, i) => this.storage.key(i));
    keys
      .filter((key): key is string => key !== null && key.startsWith(prefix))
      .forEach((key) => this.get(key.slice(prefix.length)));
  }

  private isExpired(entry: CacheEntry<unknown>): boolean {
    return this.clock.now() - entry.storedAt > this.ttlMs;
  }

  private storageKey(key: string): string {
    return `${this.namespace}:${key}`;
  }
}
