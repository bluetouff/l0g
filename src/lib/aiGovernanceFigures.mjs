export const AI_GOVERNANCE_KINDS = Object.freeze(["anthropic", "trust", "openai", "equity", "rights", "courts", "state"]);
export const AI_GOVERNANCE_SOURCES = Object.freeze(["A01 A03 A04 A05 A06", "A03 A04 A05", "C01 C03 C04", "P09", "P11 P12 P13 P14 P15", "R01 R02 R03 A01", "P16 P17"]);
export function aiGovernanceFigureReferences(lang, kind, number, sources, caption) {
  if (typeof lang !== 'string' || !['fr', 'en'].includes(lang) || typeof kind !== 'string' || !AI_GOVERNANCE_KINDS.includes(kind) || typeof number !== 'string' || !/^0[1-7]$/.test(number) || AI_GOVERNANCE_KINDS.indexOf(kind) + 1 !== Number(number) || typeof sources !== 'string' || typeof caption !== 'string' || !caption.trim()) throw new TypeError('Unexpected AI governance figure');
  const refs = sources.trim() ? sources.trim().split(/\s+/) : [];
  if (new Set(refs).size !== refs.length || refs.some(id => !/^(?:A(?:01|03|04|05|06|08)|C(?:0[1-9]|10)|P(?:0[124-9]|1[0-7])|R0[1-8])$/.test(id)) || refs.join(' ') !== AI_GOVERNANCE_SOURCES[AI_GOVERNANCE_KINDS.indexOf(kind)]) throw new TypeError('Invalid AI governance source references');
  return refs;
}
