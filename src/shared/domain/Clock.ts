export interface Clock {
  /** Instante actual en milisegundos desde epoch. */
  now(): number;
}
