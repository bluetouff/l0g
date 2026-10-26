export const HELIUM_WAFER_KINDS = Object.freeze(['wafer', 'production', 'delivery', 'recovery', 'timeline']);
export const HELIUM_WAFER_SOURCES = Object.freeze(['03 04 05', '08', '11 12 13 14', '15 16', '01 02 17']);
export function heliumWaferFigureReferences(lang, kind, number, sources, caption) {
  if (typeof lang !== 'string' || !['fr', 'en'].includes(lang) || typeof kind !== 'string' || !HELIUM_WAFER_KINDS.includes(kind) || typeof number !== 'string' || !/^0[1-5]$/.test(number) || HELIUM_WAFER_KINDS.indexOf(kind) + 1 !== Number(number) || typeof sources !== 'string' || typeof caption !== 'string' || !caption.trim()) throw new TypeError('Unexpected helium wafer figure');
  const refs = sources.trim().split(/\s+/);
  if (new Set(refs).size !== refs.length || refs.some(id => !/^(?:0[1-9]|1[0-9]|2[01])$/.test(id)) || refs.join(' ') !== HELIUM_WAFER_SOURCES[HELIUM_WAFER_KINDS.indexOf(kind)]) throw new TypeError('Invalid helium wafer source references');
  return refs;
}
