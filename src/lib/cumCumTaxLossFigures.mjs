export const CUMCUM03_KINDS = Object.freeze(['model', 'sensitivity', 'scope', 'evidence', 'settlements']);
export const CUMCUM03_SOURCES = Object.freeze(['S01', 'S01', 'S01', 'S03 S04', 'S05 S06 S07']);
export function cumCumTaxLossFigureReferences(lang, kind, number, sources, caption) {
  if (typeof lang !== 'string' || !['fr', 'en'].includes(lang) || typeof kind !== 'string' || !CUMCUM03_KINDS.includes(kind) || typeof number !== 'string' || !/^0[1-5]$/.test(number) || CUMCUM03_KINDS.indexOf(kind) + 1 !== Number(number) || typeof sources !== 'string' || typeof caption !== 'string' || !caption.trim()) throw new TypeError('Unexpected cum-cum tax-loss figure');
  const refs = sources.trim().split(/\s+/);
  if (new Set(refs).size !== refs.length || refs.some(id => !/^S(?:0[1-9]|10)$/.test(id)) || refs.join(' ') !== CUMCUM03_SOURCES[CUMCUM03_KINDS.indexOf(kind)]) throw new TypeError('Invalid cum-cum tax-loss source references');
  return refs;
}
