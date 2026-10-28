export const META_CAPITAL_KINDS = Object.freeze(["cash", "forward", "votes", "dilution", "alignment", "timing"]);
export const META_CAPITAL_SOURCES = Object.freeze(["S07 S08", "S01 S02 S03", "S04 S06", "S04 S06", "S05 S06", "S01 S02 S06 S11 S12"]);
export function metaCapitalFigureReferences(lang, kind, number, sources, caption) {
  if (typeof lang !== 'string' || !['fr', 'en'].includes(lang) || typeof kind !== 'string' || !META_CAPITAL_KINDS.includes(kind) || typeof number !== 'string' || !/^0[1-6]$/.test(number) || META_CAPITAL_KINDS.indexOf(kind) + 1 !== Number(number) || typeof sources !== 'string' || typeof caption !== 'string' || !caption.trim()) throw new TypeError('Unexpected Meta capital figure');
  const refs = sources.trim() ? sources.trim().split(/\s+/) : [];
  if (new Set(refs).size !== refs.length || refs.some(id => !/^S(?:0[1-9]|1[0-4])$/.test(id)) || refs.join(' ') !== META_CAPITAL_SOURCES[META_CAPITAL_KINDS.indexOf(kind)]) throw new TypeError('Invalid Meta capital source references');
  return refs;
}
