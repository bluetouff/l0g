export const TRANSITION_FIRST_LOSS_KINDS = Object.freeze(['needs', 'waterfall', 'discount', 'monsoon', 'guarantee', 'mobilisation', 'matching']);
export const TRANSITION_FIRST_LOSS_SOURCES = Object.freeze(['R01', 'R01 G02', 'G05 G06', 'C01 C11', 'C06 C07 C08 C09', 'R01 G01', 'R01 G01']);
export function transitionFirstLossFigureReferences(lang, kind, number, sources, caption) {
  if (typeof lang !== 'string' || !['fr', 'en'].includes(lang) || typeof kind !== 'string' || !TRANSITION_FIRST_LOSS_KINDS.includes(kind) || typeof number !== 'string' || !/^0[1-7]$/.test(number) || TRANSITION_FIRST_LOSS_KINDS.indexOf(kind) + 1 !== Number(number) || typeof sources !== 'string' || typeof caption !== 'string' || !caption.trim()) throw new TypeError('Unexpected transition first-loss figure');
  const refs = sources.trim() ? sources.trim().split(/\s+/) : [];
  if (new Set(refs).size !== refs.length || refs.join(' ') !== TRANSITION_FIRST_LOSS_SOURCES[TRANSITION_FIRST_LOSS_KINDS.indexOf(kind)]) throw new TypeError('Invalid transition first-loss source references');
  return refs;
}
