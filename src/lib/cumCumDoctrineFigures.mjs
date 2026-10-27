export const CUMCUM05_KINDS = Object.freeze(['qualification', 'market', 'window', 'guarantee']);
export const CUMCUM05_SOURCES = Object.freeze(['S03 S04', 'S03', 'S05 S06 S07', 'S07 S08']);
export function cumCumDoctrineFigureReferences(lang, kind, number, sources, caption) {
  if (typeof lang !== 'string' || !['fr', 'en'].includes(lang) || typeof kind !== 'string' || !CUMCUM05_KINDS.includes(kind) || typeof number !== 'string' || !/^0[1-4]$/.test(number) || CUMCUM05_KINDS.indexOf(kind) + 1 !== Number(number) || typeof sources !== 'string' || typeof caption !== 'string' || !caption.trim()) throw new TypeError('Unexpected cum-cum doctrine figure');
  const refs = sources.trim().split(/\s+/);
  if (new Set(refs).size !== refs.length || refs.some(id => !/^S(?:0[1-9]|1[0-3])$/.test(id)) || refs.join(' ') !== CUMCUM05_SOURCES[CUMCUM05_KINDS.indexOf(kind)]) throw new TypeError('Invalid cum-cum doctrine source references');
  return refs;
}
