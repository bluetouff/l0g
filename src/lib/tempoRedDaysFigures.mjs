export const TEMPO_RED_DAYS_KINDS = Object.freeze(['selection', 'profiles', 'tunnel', 'evaluation', 'prices', 'permutation', 'notice']);
export const TEMPO_RED_DAYS_SOURCES = Object.freeze(['G04 G01', 'G04 R02', 'R02', 'G01', 'T01 T07', 'T01', 'G01 R02 T07']);
export function tempoRedDaysFigureReferences(lang, kind, number, sources, caption) {
  if (typeof lang !== 'string' || !['fr', 'en'].includes(lang) || typeof kind !== 'string' || !TEMPO_RED_DAYS_KINDS.includes(kind) || typeof number !== 'string' || !/^0[1-7]$/.test(number) || TEMPO_RED_DAYS_KINDS.indexOf(kind) + 1 !== Number(number) || typeof sources !== 'string' || typeof caption !== 'string' || !caption.trim()) throw new TypeError('Unexpected Tempo figure');
  const refs = sources.trim() ? sources.trim().split(/\s+/) : [];
  if (new Set(refs).size !== refs.length || refs.join(' ') !== TEMPO_RED_DAYS_SOURCES[TEMPO_RED_DAYS_KINDS.indexOf(kind)]) throw new TypeError('Invalid Tempo source references');
  return refs;
}
