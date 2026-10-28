export const BLACKOUT_KINDS = Object.freeze(['purchase', 'cards', 'restoration', 'rte', 'offline', 'preparedness']);
export const BLACKOUT_SOURCES = Object.freeze(['S03 S22', 'S03', 'S05', 'S06', 'S07 S08 S22', 'S14']);
export function blackoutFigureReferences(lang, kind, number, sources, caption) {
  if (typeof lang !== 'string' || !['fr', 'en'].includes(lang) || typeof kind !== 'string' || !BLACKOUT_KINDS.includes(kind) || typeof number !== 'string' || !/^0[1-6]$/.test(number) || BLACKOUT_KINDS.indexOf(kind) + 1 !== Number(number) || typeof sources !== 'string' || typeof caption !== 'string' || !caption.trim()) throw new TypeError('Unexpected blackout figure');
  const refs = sources.trim() ? sources.trim().split(/\s+/) : [];
  if (new Set(refs).size !== refs.length || refs.some(id => !/^S(?:0[1-9]|1[0-9]|2[0-5])$/.test(id)) || refs.join(' ') !== BLACKOUT_SOURCES[BLACKOUT_KINDS.indexOf(kind)]) throw new TypeError('Invalid blackout source references');
  return refs;
}
