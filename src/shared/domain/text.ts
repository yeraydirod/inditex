/** Normaliza un texto para comparaciones: minúsculas, sin tildes ni espacios sobrantes. */
export function normalizeText(value: string): string {
  return value.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}
