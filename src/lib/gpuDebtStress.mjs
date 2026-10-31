/** Fictional eight-GPU project. All money values are nominal illustrative USD. */
export const GPU_DEBT_FIELDS = Object.freeze(['price', 'utilization', 'costs']);
export const GPU_DEBT_DEFAULTS = Object.freeze({ price: '4', utilization: '75', costs: '85000' });
export const GPU_DEBT_ASSUMPTIONS = Object.freeze({ gpus: 8, hoursPerYear: 8760, upfrontCost: 320000, debt: 240000, annualRate: 0.1, years: 4 });
const LIMITS = Object.freeze({ price: [1, 8, 2], utilization: [20, 100, 0], costs: [30000, 150000, 0] });
export function parseGpuDebtInput(raw, field) {
  if (!Object.hasOwn(LIMITS, field) || typeof raw !== 'string' || raw.length > 9 || raw.trim() !== raw || !/^\d{1,6}(?:[.,]\d{1,2})?$/.test(raw)) throw new RangeError('Invalid model input');
  const [minimum, maximum, decimals] = LIMITS[field];
  const normalized = raw.replace(',', '.');
  if ((normalized.split('.')[1]?.length ?? 0) > decimals) throw new RangeError('Input precision exceeds field limit');
  const value = Number(normalized);
  if (!Number.isFinite(value) || value < minimum || value > maximum) throw new RangeError('Model input outside its limits');
  return value;
}
export function calculateGpuDebt(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input) || Object.keys(input).length !== 3 || GPU_DEBT_FIELDS.some(key => !Object.hasOwn(input, key))) throw new RangeError('Three model fields required');
  const values = Object.fromEntries(GPU_DEBT_FIELDS.map(key => [key, parseGpuDebtInput(input[key], key)]));
  const a = GPU_DEBT_ASSUMPTIONS;
  const annualPayment = a.debt * a.annualRate / (1 - (1 + a.annualRate) ** -a.years);
  const billableHours = a.gpus * a.hoursPerYear * values.utilization / 100;
  const revenue = billableHours * values.price, available = revenue - values.costs;
  const coverage = available / annualPayment, surplus = available - annualPayment;
  const threshold = (values.costs + annualPayment) / billableHours;
  const threshold135 = (values.costs + 1.35 * annualPayment) / billableHours;
  const result = { ...values, annualPayment, billableHours, revenue, available, coverage, surplus, threshold, threshold135 };
  if (!Object.values(result).every(Number.isFinite) || annualPayment <= 0 || billableHours <= 0) throw new RangeError('Model result unavailable');
  return Object.freeze({ ...result, covered: surplus >= 0 });
}
export function formatGpuDebtNumber(value, lang, digits = 2) {
  if (!Number.isFinite(value) || !['fr', 'en'].includes(lang) || ![0, 2].includes(digits)) throw new RangeError('Finite number and supported format required');
  return new Intl.NumberFormat(lang === 'fr' ? 'fr-FR' : 'en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(value);
}
export function formatGpuDebtMoney(value, lang, digits = 0, signed = false) {
  if (!Number.isFinite(value) || typeof signed !== 'boolean') throw new RangeError('Finite value and boolean sign option required');
  const formatted = formatGpuDebtNumber(Math.abs(value), lang, digits), sign = value < 0 ? '-' : signed ? '+' : '';
  return sign + (lang === 'en' ? `$${formatted}` : `${formatted}\u00a0$`);
}
