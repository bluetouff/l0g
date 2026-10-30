/** Fictional VAT-at-sale incidence of the new EUR2 fee only. Exact units: 10^-8 EUR. */
export const PARCEL_FEE_FIELDS = Object.freeze(['price', 'lines', 'passThrough', 'vat']);
export const PARCEL_FEE_DEFAULTS = Object.freeze({ price: '20', lines: '2', passThrough: '50', vat: '20' });
export const PARCEL_FEE_UNIT = 100000000n;
export const PARCEL_FEE_PER_LINE = 2n * PARCEL_FEE_UNIT;
const CENT = 1000000n;
const LIMITS = Object.freeze({ price: [100n, 10000000n], passThrough: [0n, 10000n], vat: [0n, 3000n] });
export function parseParcelFeeQuantity(raw, field) {
  if (typeof raw !== 'string' || raw.length > 9) throw new RangeError('Bounded number required');
  if (field === 'lines') {
    if (!/^\d{1,4}$/.test(raw)) throw new RangeError('Integer line count required');
    const count = BigInt(raw);
    if (count > 1000n) throw new RangeError('Line count exceeds limit');
    return count;
  }
  if (!Object.hasOwn(LIMITS, field) || !/^\d{1,6}(?:[.,]\d{1,2})?$/.test(raw)) throw new RangeError('Invalid model quantity');
  const [whole, fraction = ''] = raw.replace(',', '.').split('.');
  const value = BigInt(whole) * 100n + BigInt(fraction.padEnd(2, '0'));
  const [minimum, maximum] = LIMITS[field];
  if (value < minimum || value > maximum) throw new RangeError('Model quantity exceeds bounds');
  return value;
}
export function calculateParcelFee(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input) || Object.keys(input).length !== 4 || PARCEL_FEE_FIELDS.some(key => !Object.hasOwn(input, key))) throw new RangeError('Four model quantities required');
  const values = Object.fromEntries(PARCEL_FEE_FIELDS.map(key => [key, parseParcelFeeQuantity(input[key], key)]));
  const initialExVat = values.price * CENT;
  const initialInclVat = initialExVat * (10000n + values.vat) / 10000n;
  const fee = PARCEL_FEE_PER_LINE * values.lines;
  const passed = fee * values.passThrough / 10000n;
  const absorbed = fee - passed;
  const additionalVat = passed * values.vat / 10000n;
  const customerIncrease = passed + additionalVat;
  const finalInclVat = initialInclVat + customerIncrease;
  if (passed + absorbed !== fee || finalInclVat - initialInclVat !== customerIncrease || absorbed < 0n) throw new Error('Incidence invariant failed');
  return Object.freeze({ initialExVat, initialInclVat, fee, passed, absorbed, additionalVat, customerIncrease, finalInclVat });
}
export function formatParcelFeeMoney(value, lang) {
  if (typeof value !== 'bigint' || value < 0n || !['fr', 'en'].includes(lang)) throw new RangeError('Supported nonnegative amount required');
  const cents = (value + CENT / 2n) / CENT;
  const whole = String(cents / 100n), groups = [];
  for (let end = whole.length; end > 0; end -= 3) groups.push(whole.slice(Math.max(0, end - 3), end));
  const number = groups.reverse().join(lang === 'en' ? ',' : '\u202f') + (lang === 'en' ? '.' : ',') + String(cents % 100n).padStart(2, '0');
  return lang === 'en' ? `€${number}` : `${number}\u00a0€`;
}
