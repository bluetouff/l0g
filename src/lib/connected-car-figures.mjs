export const CONNECTED_CAR_KINDS = Object.freeze(['flow', 'contracts', 'timeline']);
export const CONNECTED_CAR_SOURCES = Object.freeze([
  Object.freeze(['S01', 'S02', 'S03', 'S04']),
  Object.freeze(['S04']),
  Object.freeze(['S01', 'S02', 'S03', 'S11', 'S12', 'S13']),
]);

export function connectedCarFigureReferences(lang, kind, number, sources, caption, method) {
  if (!['fr', 'en'].includes(lang) || !CONNECTED_CAR_KINDS.includes(kind)) throw new TypeError('Unknown connected-car figure');
  const index = CONNECTED_CAR_KINDS.indexOf(kind), expected = CONNECTED_CAR_SOURCES[index];
  if (number !== index + 1 || !Array.isArray(sources) || sources.length !== expected.length || sources.some((value, i) => value !== expected[i])) throw new TypeError('Reviewed figure order and sources required');
  if (typeof caption !== 'string' || !caption.trim() || caption.length > 2000 || typeof method !== 'string' || !method.trim() || method.length > 6000) throw new TypeError('Reviewed caption and method required');
  return [...expected];
}
