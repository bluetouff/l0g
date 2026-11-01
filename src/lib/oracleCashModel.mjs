/** Q1 FY2027 cash identities, nominal USD millions; changed inputs are arithmetic sensitivities. */
export const ORACLE_CASH_FIELDS = Object.freeze(['advance', 'capex']);
export const ORACLE_CASH_DEFAULTS = Object.freeze({ advance: '11363', capex: '28499' });
export const ORACLE_CASH_LIMITS = Object.freeze({ advance: Object.freeze([0, 60000]), capex: Object.freeze([0, 80000]) });
export const ORACLE_CASH_FIXED = Object.freeze({ otherOperating: 11740, manufacturer: -830 });
export const ORACLE_CASH_RESULTS = Object.freeze(['operating', 'fcf', 'outlay', 'balance', 'mixed', 'overcount']);
export function parseOracleCashInput(raw, field) {
  if (!Object.hasOwn(ORACLE_CASH_LIMITS, field) || typeof raw !== 'string' || !/^\d{1,5}$/.test(raw)) throw new RangeError('Whole USD millions required');
  const value = Number(raw), [minimum, maximum] = ORACLE_CASH_LIMITS[field];
  if (!Number.isSafeInteger(value) || value < minimum || value > maximum) throw new RangeError('Oracle cash input outside limits');
  return value;
}
export function calculateOracleCash(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input) || Reflect.ownKeys(input).length !== ORACLE_CASH_FIELDS.length || ORACLE_CASH_FIELDS.some(field => !Object.hasOwn(input, field))) throw new RangeError('Two Oracle cash inputs required');
  const advance = parseOracleCashInput(input.advance, 'advance'), capex = parseOracleCashInput(input.capex, 'capex');
  const { otherOperating, manufacturer } = ORACLE_CASH_FIXED;
  const operating = otherOperating + advance, fcf = operating - capex, outlay = capex - manufacturer - advance, balance = fcf + manufacturer, mixed = operating - outlay;
  if (balance !== otherOperating - outlay || mixed - balance !== advance) throw new RangeError('Oracle cash identity unavailable');
  return Object.freeze({ advance, capex, otherOperating, manufacturer, operating, fcf, outlay, balance, mixed, overcount: advance });
}
export function formatOracleCash(value, lang) {
  if (!Number.isSafeInteger(value) || !['fr', 'en'].includes(lang)) throw new RangeError('Integer USD millions and supported language required');
  return new Intl.NumberFormat(lang === 'fr' ? 'fr-FR' : 'en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3 }).format(value / 1000);
}
export function oracleCashDisplay(result, field, lang) {
  if (!ORACLE_CASH_RESULTS.includes(field)) throw new RangeError('Unknown Oracle cash result');
  return formatOracleCash(result[field], lang);
}
export function oracleCashEquation(result, field, lang) {
  const fmt = value => formatOracleCash(value, lang);
  if (field === 'a') return `${fmt(result.operating)} − ${fmt(result.capex)} − ${fmt(-result.manufacturer)} = ${fmt(result.balance)}`;
  if (field === 'b') return `${fmt(result.otherOperating)} − (${fmt(result.outlay)}) = ${fmt(result.balance)}`;
  throw new RangeError('Unknown Oracle cash equation');
}
