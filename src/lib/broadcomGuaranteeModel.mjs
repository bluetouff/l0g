/** Conditional default-and-sale branch, in explicitly fictional units. */
export const BROADCOM_GUARANTEE_FIELDS = Object.freeze(['lease', 'resale']);
export const BROADCOM_GUARANTEE_DEFAULTS = Object.freeze({ lease: '100', resale: '50', defaulted: true });
export const BROADCOM_GUARANTEE_LIMITS = Object.freeze({ min: 0, max: 100, step: '0.001' });
export const BROADCOM_GUARANTEE_RESULTS = Object.freeze(['support', 'base']);
export const BROADCOM_GUARANTEE_PRESETS = Object.freeze(['30', '60', '90']);
function parseThousandths(raw) {
  if (typeof raw !== 'string' || raw.length > 7) throw new RangeError('Bounded decimal string required');
  const match = /^(0|[1-9][0-9]{0,2})(?:[.,]([0-9]{1,3}))?$/.exec(raw);
  if (!match || match[0] !== raw) throw new RangeError('At most three decimal places required');
  const value = Number(match[1]) * 1000 + Number((match[2] ?? '').padEnd(3, '0'));
  if (value < 0 || value > 100000) throw new RangeError('Fictional unit range is zero to one hundred');
  return value;
}
export function parseBroadcomGuaranteeValue(raw) { return parseThousandths(raw) / 1000; }
export function calculateBroadcomGuarantee(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input) || Reflect.ownKeys(input).length !== 3 || !['lease', 'resale', 'defaulted'].every(key => Object.hasOwn(input, key)) || typeof input.defaulted !== 'boolean') throw new RangeError('Two explicit values and one boolean scenario required');
  const leaseScaled = parseThousandths(input.lease), resaleScaled = parseThousandths(input.resale);
  // 72.5% = 29/40; all intermediate values are exact bounded integers.
  const baseNumerator = 29 * leaseScaled;
  const supportNumerator = input.defaulted ? Math.max(0, baseNumerator - 40 * resaleScaled) : 0;
  const status = !input.defaulted ? 'paying' : supportNumerator > 0 ? 'support' : 'covered';
  return Object.freeze({ values: Object.freeze({ lease: leaseScaled / 1000, resale: resaleScaled / 1000, defaulted: input.defaulted }), base: baseNumerator / 40000, support: supportNumerator / 40000, baseNumerator, supportNumerator, status });
}
export function formatBroadcomGuarantee(value, lang) {
  if (!Number.isFinite(value) || !['fr', 'en'].includes(lang)) throw new RangeError('Finite fictional value and supported language required');
  return new Intl.NumberFormat(lang === 'fr' ? 'fr-FR' : 'en-GB', { maximumFractionDigits: 6 }).format(value === 0 ? 0 : value);
}
export function broadcomGuaranteeDisplay(result, field, lang) {
  if (!BROADCOM_GUARANTEE_RESULTS.includes(field)) throw new RangeError('Known conditional result required');
  return formatBroadcomGuarantee(result[field], lang);
}
export function broadcomGuaranteeEquation(result, lang) {
  const f = value => formatBroadcomGuarantee(value, lang);
  if (!result.values.defaulted) return lang === 'fr' ? 'Hypothèse de loyers payés : G = 0' : 'Rent paid as assumed: G = 0';
  return `G = max(0 ; ${lang === 'fr' ? '0,725' : '0.725'} × ${f(result.values.lease)} − ${f(result.values.resale)}) = ${f(result.support)}`;
}
