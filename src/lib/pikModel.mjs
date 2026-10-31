/** Hypothetical M01, annual periods and nominal USD millions. */
export const PIK_FIELDS = Object.freeze(['principal', 'rate', 'years', 'cashShare', 'ebitda', 'multiple']);
export const PIK_DEFAULTS = Object.freeze({ principal: '100', rate: '12', years: '3', cashShare: '0', ebitda: '30', multiple: '4' });
export const PIK_LIMITS = Object.freeze({ principal: Object.freeze([0.1,100000,1]), rate: Object.freeze([0,40,1]), years: Object.freeze([1,10,0]), cashShare: Object.freeze([0,100,0]), ebitda: Object.freeze([0,100000,1]), multiple: Object.freeze([0.1,20,1]) });
export function parsePikInput(raw, field) {
  if (!Object.hasOwn(PIK_LIMITS, field) || typeof raw !== 'string' || raw.length > 10 || !/^\d{1,6}(?:[.,]\d)?$/.test(raw)) throw new RangeError('Invalid PIK input');
  const [minimum, maximum, decimals] = PIK_LIMITS[field], normalized = raw.replace(',', '.');
  if ((normalized.split('.')[1]?.length ?? 0) > decimals) throw new RangeError('Invalid PIK precision');
  const value = Number(normalized);
  if (!Number.isFinite(value) || value < minimum || value > maximum) throw new RangeError('PIK input outside limits');
  return value;
}
export function calculatePik(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input) || Object.keys(input).length !== PIK_FIELDS.length || PIK_FIELDS.some(field => !Object.hasOwn(input, field))) throw new RangeError('Six PIK fields required');
  const principal = parsePikInput(input.principal, 'principal'), rate = parsePikInput(input.rate, 'rate'), years = parsePikInput(input.years, 'years'), cashShare = parsePikInput(input.cashShare, 'cashShare'), ebitda = parsePikInput(input.ebitda, 'ebitda'), multiple = parsePikInput(input.multiple, 'multiple');
  let debt = principal, cashTotal = 0, pikTotal = 0;
  const annual = [];
  for (let year = 1; year <= years; year++) {
    const opening = debt, interest = opening * rate / 100, cash = interest * cashShare / 100, pik = interest - cash;
    debt += pik; cashTotal += cash; pikTotal += pik;
    annual.push(Object.freeze({ year, opening, interest, cash, pik, debt }));
  }
  const capacity = ebitda * multiple, gap = Math.max(0, debt - capacity), requiredEbitda = debt / multiple;
  const values = { principal, rate, years, cashShare, ebitda, multiple, debt, cashTotal, pikTotal, capacity, gap, requiredEbitda };
  if (!Object.values(values).every(Number.isFinite) || annual.some(row => !Object.values(row).every(Number.isFinite))) throw new RangeError('PIK result unavailable');
  return Object.freeze({ ...values, annual: Object.freeze(annual) });
}
export function formatPikNumber(value, lang, digits = 2) {
  if (!Number.isFinite(value) || !['fr','en'].includes(lang) || ![0,1,2].includes(digits)) throw new RangeError('Finite PIK value and supported format required');
  return new Intl.NumberFormat(lang === 'fr' ? 'fr-FR' : 'en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(value);
}
