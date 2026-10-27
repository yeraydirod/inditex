import DOMPurify from 'dompurify';
import { useMemo } from 'react';

const HTML_TAG = /<\/?[a-z][\s\S]*?>/i;

const escapeHtml = (text: string): string =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * Convierte la descripción de un episodio en HTML seguro. Algunas descripciones ya contienen HTML
 * (que debe mostrarse interpretado); las de texto plano conservan sus saltos de línea.
 */
export function toSafeHtml(description: string): string {
  const html = HTML_TAG.test(description)
    ? description
    : escapeHtml(description).replace(/\n/g, '<br>');
  return DOMPurify.sanitize(html, { ADD_ATTR: ['target'] });
}

interface EpisodeDescriptionProps {
  description: string;
  className?: string;
}

export function EpisodeDescription({ description, className }: EpisodeDescriptionProps) {
  const html = useMemo(() => toSafeHtml(description), [description]);
  return (
    <div
      className={className}
      data-testid="episode-description"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
