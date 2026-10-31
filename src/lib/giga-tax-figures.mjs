export const GIGA_TAX_KINDS = Object.freeze(['flow', 'cache', 'cap']);
export const GIGA_TAX_SOURCES = Object.freeze([
  Object.freeze(['S01', 'S03']),
  Object.freeze(['S01', 'S04']),
  Object.freeze(['S01']),
]);

export function gigaTaxFigureReferences(lang, kind, number, sources, caption, method) {
  if (!['fr', 'en'].includes(lang) || !GIGA_TAX_KINDS.includes(kind)) throw new TypeError('Unknown giga-tax figure');
  const index = GIGA_TAX_KINDS.indexOf(kind), expected = GIGA_TAX_SOURCES[index];
  if (number !== index + 1 || !Array.isArray(sources) || sources.length !== expected.length || sources.some((value, i) => value !== expected[i])) throw new TypeError('Reviewed figure order and sources required');
  if (typeof caption !== 'string' || !caption.trim() || caption.length > 2000 || typeof method !== 'string' || !method.trim() || method.length > 6000) throw new TypeError('Reviewed caption and method required');
  return [...expected];
}
