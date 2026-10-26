export const IRON_ORE_KINDS = Object.freeze(['volumes', 'logistics', 'economics', 'grades', 'china']);
export const IRON_ORE_SOURCES = Object.freeze(['01 02 03', '01 04', '01 04', '11 12', '13 14 15']);
export function ironOreFigureReferences(lang, kind, number, sources, caption) {
  if (typeof lang !== 'string' || !['fr', 'en'].includes(lang) || typeof kind !== 'string' || !IRON_ORE_KINDS.includes(kind) || typeof number !== 'string' || !/^0[1-5]$/.test(number) || IRON_ORE_KINDS.indexOf(kind) + 1 !== Number(number) || typeof sources !== 'string' || typeof caption !== 'string' || !caption.trim()) throw new TypeError('Unexpected iron ore figure');
  const refs = sources.trim().split(/\s+/);
  if (new Set(refs).size !== refs.length || refs.some(id => !/^(?:0[1-9]|1[0-8])$/.test(id)) || refs.join(' ') !== IRON_ORE_SOURCES[IRON_ORE_KINDS.indexOf(kind)]) throw new TypeError('Invalid iron ore source references');
  return refs;
}
