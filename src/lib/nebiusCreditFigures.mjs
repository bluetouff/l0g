export const NEBIUS_KINDS = Object.freeze(['funding', 'spread', 'security', 'cash', 'rpo', 'contracts', 'capacity']);
export const NEBIUS_SOURCES = Object.freeze(['01 03 04 06', '01', '01 06', '03 04', '04', '08 09 10', '05 08 16']);
export function nebiusFigureReferences(lang, kind, number, sources, caption) {
  if (typeof lang !== 'string' || !['fr', 'en'].includes(lang) || typeof kind !== 'string' || !NEBIUS_KINDS.includes(kind) || typeof number !== 'string' || !/^0[1-7]$/.test(number) || NEBIUS_KINDS.indexOf(kind) + 1 !== Number(number) || typeof sources !== 'string' || typeof caption !== 'string' || !caption.trim()) throw new TypeError('Unexpected Nebius figure');
  const refs = sources.trim().split(/\s+/);
  if (new Set(refs).size !== refs.length || refs.some(id => !/^(?:0[1-9]|1[0-6])$/.test(id)) || refs.join(' ') !== NEBIUS_SOURCES[NEBIUS_KINDS.indexOf(kind)]) throw new TypeError('Invalid Nebius figure source references');
  return refs;
}
