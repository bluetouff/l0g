/** Fictional, same-configuration cost transmission. Money units are 10^-10 EUR. */
export const PC_AI_PRICE_FIELDS = Object.freeze(['price', 'cost', 'increase', 'passThrough']);
export const PC_AI_PRICE_DEFAULTS = Object.freeze({ price: '1000', cost: '150', increase: '100', passThrough: '60' });
const LIMITS = Object.freeze({ price: [100n, 10000000n], cost: [0n, 10000000n], increase: [0n, 30000n], passThrough: [0n, 10000n] });
const CENT_UNIT = 100000000n;
export function parsePcAiPriceQuantity(raw, field) {
  if (!Object.hasOwn(LIMITS, field) || typeof raw !== 'string' || raw.length > 9 || !/^\d{1,6}(?:[.,]\d{1,2})?$/.test(raw)) throw new RangeError('Invalid model quantity');
  const [whole, fraction = ''] = raw.replace(',', '.').split('.');
  const value = BigInt(whole) * 100n + BigInt(fraction.padEnd(2, '0'));
  const [min, max] = LIMITS[field];
  if (value < min || value > max) throw new RangeError('Model quantity exceeds bounds');
  return value;
}
export function calculatePcAiPrice(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input) || Object.keys(input).length !== 4 || PC_AI_PRICE_FIELDS.some(key => !Object.hasOwn(input, key))) throw new RangeError('Four model quantities required');
  const value = Object.fromEntries(PC_AI_PRICE_FIELDS.map(key => [key, parsePcAiPriceQuantity(input[key], key)]));
  if (value.cost > value.price) throw new RangeError('Exposed cost exceeds initial price');
  const initialPrice = value.price * CENT_UNIT;
  const shock = value.cost * value.increase * 10000n;
  const passed = value.cost * value.increase * value.passThrough;
  const absorbed = shock - passed;
  const finalPrice = initialPrice + passed;
  if (shock !== passed + absorbed || finalPrice - initialPrice !== passed || absorbed < 0n) throw new Error('Cost allocation invariant failed');
  return Object.freeze({ initialPrice, shock, passed, absorbed, finalPrice, increaseNumerator: passed * 10000n, increaseDenominator: initialPrice });
}
function groupedTwoDecimals(scaled, lang) {
  const whole = String(scaled / 100n), groups = [];
  for (let end = whole.length; end > 0; end -= 3) groups.push(whole.slice(Math.max(0, end - 3), end));
  return groups.reverse().join(lang === 'en' ? ',' : '\u202f') + (lang === 'en' ? '.' : ',') + String(scaled % 100n).padStart(2, '0');
}
export function formatPcAiPriceMoney(value, lang) {
  if (typeof value !== 'bigint' || value < 0n || !['fr', 'en'].includes(lang)) throw new RangeError('Nonnegative model money and supported language required');
  const cents = (value + CENT_UNIT / 2n) / CENT_UNIT;
  const number = groupedTwoDecimals(cents, lang);
  return lang === 'en' ? `€${number}` : `${number}\u00a0€`;
}
export function formatPcAiPricePercent(numerator, denominator, lang) {
  if (typeof numerator !== 'bigint' || numerator < 0n || typeof denominator !== 'bigint' || denominator <= 0n || !['fr', 'en'].includes(lang)) throw new RangeError('Supported nonnegative ratio required');
  const scaled = (numerator + denominator / 2n) / denominator;
  return groupedTwoDecimals(scaled, lang) + (lang === 'en' ? '%' : '\u00a0%');
}
