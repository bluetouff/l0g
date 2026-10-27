export const CUMCUM04_KINDS = Object.freeze(['entities', 'procedure', 'outcomes', 'mako']);
export const CUMCUM04_SOURCES = Object.freeze(['S01', 'S01 S04 S06', 'S08 S09 S10 S11 S12 S18 S19 S21', 'S15']);
export function cumCumAccountabilityFigureReferences(lang, kind, number, sources, caption) {
  if (typeof lang !== 'string' || !['fr', 'en'].includes(lang) || typeof kind !== 'string' || !CUMCUM04_KINDS.includes(kind) || typeof number !== 'string' || !/^0[1-4]$/.test(number) || CUMCUM04_KINDS.indexOf(kind) + 1 !== Number(number) || typeof sources !== 'string' || typeof caption !== 'string' || !caption.trim()) throw new TypeError('Unexpected cum-cum accountability figure');
  const refs = sources.trim().split(/\s+/);
  if (new Set(refs).size !== refs.length || refs.some(id => !/^S(?:0[1-9]|1[0-9]|2[01])$/.test(id)) || refs.join(' ') !== CUMCUM04_SOURCES[CUMCUM04_KINDS.indexOf(kind)]) throw new TypeError('Invalid cum-cum accountability source references');
  return refs;
}
