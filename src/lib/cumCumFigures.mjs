export const CUMCUM_KINDS = Object.freeze(['cycle', 'allocation', 'exposure', 'comparison']);
export const CUMCUM_SOURCES = Object.freeze(['S1 S3 S5', 'S1', 'S1 S3 S8', 'S3 S11']);
export function cumCumFigureReferences(lang, kind, number, sources, caption) {
  if (typeof lang !== 'string' || !['fr', 'en'].includes(lang) || typeof kind !== 'string' || !CUMCUM_KINDS.includes(kind) || typeof number !== 'string' || !/^0[1-4]$/.test(number) || CUMCUM_KINDS.indexOf(kind) + 1 !== Number(number) || typeof sources !== 'string' || typeof caption !== 'string' || !caption.trim()) throw new TypeError('Unexpected cum-cum figure');
  const refs = sources.trim().split(/\s+/);
  if (new Set(refs).size !== refs.length || refs.some(id => !/^S(?:[1-9]|1[0-5])$/.test(id)) || refs.join(' ') !== CUMCUM_SOURCES[CUMCUM_KINDS.indexOf(kind)]) throw new TypeError('Invalid cum-cum source references');
  return refs;
}
