export const CUMCUM02_KINDS = Object.freeze(['alerts', 'evidence', 'intervals', 'tracks']);
export const CUMCUM02_SOURCES = Object.freeze(['S01 S03 S04', 'S01 S06 S07 S09 S11', 'S09', 'S09 S11 S12']);
export function cumCumTimelineFigureReferences(lang, kind, number, sources, caption) {
  if (typeof lang !== 'string' || !['fr', 'en'].includes(lang) || typeof kind !== 'string' || !CUMCUM02_KINDS.includes(kind) || typeof number !== 'string' || !/^0[1-4]$/.test(number) || CUMCUM02_KINDS.indexOf(kind) + 1 !== Number(number) || typeof sources !== 'string' || typeof caption !== 'string' || !caption.trim()) throw new TypeError('Unexpected cum-cum timeline figure');
  const refs = sources.trim().split(/\s+/);
  if (new Set(refs).size !== refs.length || refs.some(id => !/^S(?:0[1-9]|1[0-6])$/.test(id)) || refs.join(' ') !== CUMCUM02_SOURCES[CUMCUM02_KINDS.indexOf(kind)]) throw new TypeError('Invalid cum-cum timeline source references');
  return refs;
}
