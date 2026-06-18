/**
 * Estime le temps de lecture d'un article à partir de son corps Markdown.
 * Base : ~200 mots/minute. Renvoie un entier de minutes (minimum 1).
 */
export function readingTime(body: string | undefined): number {
  if (!body) return 1;
  const text = body
    .replace(/```[\s\S]*?```/g, ' ') // blocs de code
    .replace(/`[^`]*`/g, ' ') // code inline
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1') // liens/images -> texte
    .replace(/[#>*_~`|]/g, ' '); // ponctuation Markdown
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
