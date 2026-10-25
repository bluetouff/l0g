export const BARCLAYS_AI_KINDS = Object.freeze(['jobs', 'charges', 'ratio', 'profit', 'bases', 'tasks', 'evidence']);
export const BARCLAYS_AI_SOURCES = Object.freeze(['S02 S15 S17', 'S01 S06 S07', 'S01', 'S01', 'S01 S15 S16', '', 'S09 S10 S12 S13']);
export function barclaysAiFigureReferences(lang, kind, number, sources, caption) {
  if (typeof lang !== 'string' || !['fr', 'en'].includes(lang) || typeof kind !== 'string' || !BARCLAYS_AI_KINDS.includes(kind) || typeof number !== 'string' || !/^0[1-7]$/.test(number) || BARCLAYS_AI_KINDS.indexOf(kind) + 1 !== Number(number) || typeof sources !== 'string' || typeof caption !== 'string' || !caption.trim()) throw new TypeError('Unexpected Barclays AI figure');
  const refs = sources.trim() ? sources.trim().split(/\s+/) : [];
  if (new Set(refs).size !== refs.length || refs.some(id => !/^S(?:0[1-9]|1[0-7])$/.test(id)) || refs.join(' ') !== BARCLAYS_AI_SOURCES[BARCLAYS_AI_KINDS.indexOf(kind)]) throw new TypeError('Invalid Barclays AI source references');
  return refs;
}
