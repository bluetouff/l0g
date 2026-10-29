export const STABLECOIN_RESERVE_KINDS = Object.freeze(['reserve', 'accounts', 'rates', 'rule', 'deposits', 'redemption', 'jurisdictions']);
export const STABLECOIN_RESERVE_SOURCES = Object.freeze(['P02 L01', 'F01 F02', 'F01', 'L01 L02 L04', 'M01 M02 M05', 'L01', 'L01 L03 M06']);
export function stablecoinReserveFigureReferences(lang, kind, number, sources, caption) {
  if (typeof lang !== 'string' || !['fr', 'en'].includes(lang) || typeof kind !== 'string' || !STABLECOIN_RESERVE_KINDS.includes(kind) || typeof number !== 'string' || !/^0[1-7]$/.test(number) || STABLECOIN_RESERVE_KINDS.indexOf(kind) + 1 !== Number(number) || typeof sources !== 'string' || typeof caption !== 'string' || !caption.trim()) throw new TypeError('Unexpected stablecoin reserve figure');
  const refs = sources.trim() ? sources.trim().split(/\s+/) : [];
  if (new Set(refs).size !== refs.length || refs.join(' ') !== STABLECOIN_RESERVE_SOURCES[STABLECOIN_RESERVE_KINDS.indexOf(kind)]) throw new TypeError('Invalid stablecoin source references');
  return refs;
}
