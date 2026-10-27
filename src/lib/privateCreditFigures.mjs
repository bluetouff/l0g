export const PRIVATE_CREDIT_KINDS = Object.freeze(['structure', 'losses', 'capital', 'liquidity', 'measurement']);
export const PRIVATE_CREDIT_SOURCES = Object.freeze(['03 04', '04', '06 07 08 09', '04 13 14', '01 12']);
export function privateCreditFigureReferences(lang, kind, number, sources, caption) {
  if (typeof lang !== 'string' || !['fr', 'en'].includes(lang) || typeof kind !== 'string' || !PRIVATE_CREDIT_KINDS.includes(kind) || typeof number !== 'string' || !/^0[1-5]$/.test(number) || PRIVATE_CREDIT_KINDS.indexOf(kind) + 1 !== Number(number) || typeof sources !== 'string' || typeof caption !== 'string' || !caption.trim()) throw new TypeError('Unexpected private credit figure');
  const refs = sources.trim().split(/\s+/);
  if (new Set(refs).size !== refs.length || refs.some(id => !/^(?:0[1-9]|1[0-7])$/.test(id)) || refs.join(' ') !== PRIVATE_CREDIT_SOURCES[PRIVATE_CREDIT_KINDS.indexOf(kind)]) throw new TypeError('Invalid private credit source references');
  return refs;
}
