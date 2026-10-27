const dateFormatter = new Intl.DateTimeFormat('es-ES', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  timeZone: 'UTC',
});

/** Formatea una fecha como `dd/mm/aaaa`. */
export const formatDate = (date: Date): string => dateFormatter.format(date);
