export const FRANCE_MOODYS_KINDS = Object.freeze(['rates', 'contract', 'funding', 'maturities', 'indexation', 'budget', 'holders', 'cohort', 'incentives']);
export const FRANCE_MOODYS_SOURCES = Object.freeze(['S04 S05', 'S07 S08 S09', 'S10 S11', 'S05 S11', 'S11 S14', 'S10 S11', 'S05 S15', 'S19', 'S18 S20 S23']);
export function franceMoodysFigureReferences(lang, kind, number, sources, caption) {
  if (typeof lang !== 'string' || !['fr', 'en'].includes(lang) || typeof kind !== 'string' || !FRANCE_MOODYS_KINDS.includes(kind) || typeof number !== 'string' || !/^0[1-9]$/.test(number) || FRANCE_MOODYS_KINDS.indexOf(kind) + 1 !== Number(number) || typeof sources !== 'string' || typeof caption !== 'string' || !caption.trim()) throw new TypeError('Unexpected France ratings figure');
  const refs = sources.trim().split(/\s+/);
  if (new Set(refs).size !== refs.length || refs.some(id => !/^S(?:0[1-9]|1[0-9]|2[0-5])$/.test(id)) || refs.join(' ') !== FRANCE_MOODYS_SOURCES[FRANCE_MOODYS_KINDS.indexOf(kind)]) throw new TypeError('Invalid France ratings source references');
  return refs;
}
