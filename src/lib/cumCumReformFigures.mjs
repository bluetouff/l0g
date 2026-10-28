export const CUMCUM06_KINDS = Object.freeze(['cash', 'chain', 'clock', 'yield', 'horizon']);
export const CUMCUM06_SOURCES = Object.freeze(['S01', 'S04', 'S04', '', 'S02 S03 S04']);
export function cumCumReformFigureReferences(lang, kind, number, sources, caption) {
  if (typeof lang !== 'string' || !['fr', 'en'].includes(lang) || typeof kind !== 'string' || !CUMCUM06_KINDS.includes(kind) || typeof number !== 'string' || !/^0[1-5]$/.test(number) || CUMCUM06_KINDS.indexOf(kind) + 1 !== Number(number) || typeof sources !== 'string' || typeof caption !== 'string' || !caption.trim()) throw new TypeError('Unexpected cum-cum reform figure');
  const refs = sources.trim() ? sources.trim().split(/\s+/) : [];
  if (new Set(refs).size !== refs.length || refs.some(id => !/^S0[1-4]$/.test(id)) || refs.join(' ') !== CUMCUM06_SOURCES[CUMCUM06_KINDS.indexOf(kind)]) throw new TypeError('Invalid cum-cum reform source references');
  return refs;
}
