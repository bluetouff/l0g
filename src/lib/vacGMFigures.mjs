export const VAC_GM_KINDS = Object.freeze(['chain', 'capacity', 'calendar', 'public', 'operations', 'cash', 'deal']);
export const VAC_GM_SOURCES = Object.freeze(['01 09 12 14', '01 04', '01 02 04 07 08 11 14', '02 05 06 07', '01 02', '01 02', '01 10 11']);
export function vacGMFigureReferences(lang, kind, number, sources, caption) {
  if (typeof lang !== 'string' || !['fr', 'en'].includes(lang) || typeof kind !== 'string' || !VAC_GM_KINDS.includes(kind) || typeof number !== 'string' || !/^0[1-7]$/.test(number) || VAC_GM_KINDS.indexOf(kind) + 1 !== Number(number) || typeof sources !== 'string' || typeof caption !== 'string' || !caption.trim()) throw new TypeError('Unexpected VAC GM figure');
  const refs = sources.trim().split(/\s+/);
  if (new Set(refs).size !== refs.length || refs.some(id => !/^(?:0[1-9]|1[0-6])$/.test(id)) || refs.join(' ') !== VAC_GM_SOURCES[VAC_GM_KINDS.indexOf(kind)]) throw new TypeError('Invalid VAC GM figure source references');
  return refs;
}
