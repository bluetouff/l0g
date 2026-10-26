export const CES_HOUSEHOLDS_KINDS = Object.freeze(['horizons', 'energy', 'gap', 'budgets', 'gradient', 'uncertainty', 'transmission']);
export const CES_HOUSEHOLDS_SOURCES = Object.freeze(['S01 S03 S04 S13', 'S02', 'S01 S03', 'S01', 'S01 S03 S04', 'S07', 'S08 S09 S15']);
export function cesHouseholdsFigureReferences(lang, kind, number, sources, caption) {
  if (typeof lang !== 'string' || !['fr', 'en'].includes(lang) || typeof kind !== 'string' || !CES_HOUSEHOLDS_KINDS.includes(kind) || typeof number !== 'string' || !/^0[1-7]$/.test(number) || CES_HOUSEHOLDS_KINDS.indexOf(kind) + 1 !== Number(number) || typeof sources !== 'string' || typeof caption !== 'string' || !caption.trim()) throw new TypeError('Unexpected CES households figure');
  const refs = sources.trim() ? sources.trim().split(/\s+/) : [];
  if (new Set(refs).size !== refs.length || refs.some(id => !/^S(?:0[1-9]|1[0-5])$/.test(id)) || refs.join(' ') !== CES_HOUSEHOLDS_SOURCES[CES_HOUSEHOLDS_KINDS.indexOf(kind)]) throw new TypeError('Invalid CES households source references');
  return refs;
}
