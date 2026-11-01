/** Stellantis Q4 sensitivity; nominal EUR millions internally, input in EUR billions. */
export const STELLANTIS_CASH_DEFAULTS = Object.freeze({ q4: '0' });
export const STELLANTIS_CASH_LIMITS = Object.freeze({ min: -8, max: 8, step: 0.001 });
export const STELLANTIS_CASH_FIXED = Object.freeze({ nineMonths: -4930, priorYear: -4525, historicalQ4: 2784 });
export const STELLANTIS_CASH_PRESETS = Object.freeze(['0.405', '2.784', '4.930']);
export const STELLANTIS_CASH_RESULTS = Object.freeze(['annual', 'difference']);
export function parseStellantisQ4(raw) {
  if (typeof raw !== 'string' || raw.length > 6) throw new RangeError('Bounded EUR-billion decimal required');
  const match = /^([+-]?)(?:([0-8])(?:\.([0-9]{1,3}))?|\.([0-9]{1,3}))$/.exec(raw);
  if (!match || match[0] !== raw) throw new RangeError('Up to three decimal places required');
  const absolute = Number(match[2] ?? '0') * 1000 + Number((match[3] ?? match[4] ?? '').padEnd(3, '0'));
  if (absolute > 8000) throw new RangeError('Q4 scenario outside limits');
  return absolute === 0 ? 0 : (match[1] === '-' ? -absolute : absolute);
}
export function calculateStellantisCash(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input) || Reflect.ownKeys(input).length !== 1 || !Object.hasOwn(input, 'q4')) throw new RangeError('One Q4 hypothesis required');
  const q4 = parseStellantisQ4(input.q4), annual = STELLANTIS_CASH_FIXED.nineMonths + q4, difference = annual - STELLANTIS_CASH_FIXED.priorYear;
  const status = annual > 0 ? 'positive' : annual === 0 ? 'breakEven' : difference > 0 ? 'improvedNegative' : difference === 0 ? 'equalPrior' : 'worse';
  return Object.freeze({ q4, annual, difference, status });
}
export function formatStellantisCash(value, lang) {
  if (!Number.isSafeInteger(value) || !['fr', 'en'].includes(lang)) throw new RangeError('Integer EUR millions and native language required');
  return new Intl.NumberFormat(lang === 'fr' ? 'fr-FR' : 'en-GB', { minimumFractionDigits: 3, maximumFractionDigits: 3 }).format(value / 1000);
}
export function stellantisCashDisplay(result, field, lang) {
  if (!STELLANTIS_CASH_RESULTS.includes(field)) throw new RangeError('Unknown cash result');
  return formatStellantisCash(result[field], lang);
}
export function stellantisCashEquation(result, lang) {
  return `−4${lang === 'fr' ? ',' : '.'}930 + (${formatStellantisCash(result.q4, lang)}) = ${formatStellantisCash(result.annual, lang)}`;
}
