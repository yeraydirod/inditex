export interface Cache {
  get<T>(key: string): T | null;
  set<T>(key: string, value: T): void;
}

export const ONE_DAY_MS = 24 * 60 * 60 * 1000;
