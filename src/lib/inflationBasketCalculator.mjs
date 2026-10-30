/** Constructed December 2025 to September 2026 baskets; definitive Insee CPI levels, base 2025. */
export const INFLATION_BASKET_CATEGORIES = Object.freeze([
  Object.freeze({ key: 'food', start: 10039n, end: 10183n, series: '011813717' }),
  Object.freeze({ key: 'tobacco', start: 10008n, end: 10329n, series: '011814110' }),
  Object.freeze({ key: 'manufactured', start: 9988n, end: 9983n, series: '011813780' }),
  Object.freeze({ key: 'energy', start: 9833n, end: 12013n, series: '011813864' }),
  Object.freeze({ key: 'services', start: 10009n, end: 10235n, series: '011813906' }),
]);
export const INFLATION_BASKET_SOURCE = 'https://www.insee.fr/fr/statistiques/series/129209311';
export const INFLATION_BASKET_PERIOD = Object.freeze({ start: '2025-12', end: '2026-09', observedOn: '2026-10-30', status: 'definitive' });
export const INFLATION_BASKET_PRESETS = Object.freeze({
  reference: Object.freeze({ food: '297.00', tobacco: '33.60', manufactured: '477.60', energy: '152.80', services: '1039.00' }),
  energy: Object.freeze({ food: '300.00', tobacco: '0.00', manufactured: '400.00', energy: '400.00', services: '900.00' }),
  food: Object.freeze({ food: '600.00', tobacco: '0.00', manufactured: '400.00', energy: '160.00', services: '840.00' }),
});
export const INFLATION_BASKET_DEFAULTS = INFLATION_BASKET_PRESETS.reference;
export function parseInflationBasketAmount(raw) {
  if (typeof raw !== 'string' || raw.length > 10 || !/^\d{1,7}(?:[.,]\d{1,2})?$/.test(raw)) throw new RangeError('Bounded decimal euro amount required');
  const [whole, decimals = ''] = raw.replace(',', '.').split('.');
  const cents = BigInt(whole) * 100n + BigInt(decimals.padEnd(2, '0'));
  if (cents > 100000000n) throw new RangeError('Category amount exceeds one million euros');
  return cents;
}
function roundRatio(numerator, denominator) {
  if (denominator <= 0n) throw new RangeError('Positive denominator required');
  const negative = numerator < 0n, value = negative ? -numerator : numerator;
  const rounded = (value * 2n + denominator) / (2n * denominator);
  return negative ? -rounded : rounded;
}
export function calculateInflationBasket(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input) || Object.keys(input).length !== 5 || INFLATION_BASKET_CATEGORIES.some(row => !Object.hasOwn(input, row.key))) throw new RangeError('Exactly five category amounts required');
  const amounts = INFLATION_BASKET_CATEGORIES.map(row => parseInflationBasketAmount(input[row.key]));
  const initial = amounts.reduce((sum, value) => sum + value, 0n);
  const rows = INFLATION_BASKET_CATEGORIES.map((category, index) => {
    const amount = amounts[index], comparative = roundRatio(amount * category.end, category.start), difference = comparative - amount;
    return Object.freeze({ key: category.key, initial: amount, comparative, difference, share: initial ? roundRatio(amount * 10000n, initial) : null, contribution: initial ? roundRatio(difference * 10000n, initial) : null });
  });
  const comparative = rows.reduce((sum, row) => sum + row.comparative, 0n), difference = comparative - initial;
  if (rows.reduce((sum, row) => sum + row.difference, 0n) !== difference) throw new Error('Basket conservation failed');
  return Object.freeze({ initial, comparative, difference, change: initial ? roundRatio(difference * 10000n, initial) : null, empty: initial === 0n, rows: Object.freeze(rows) });
}
function formatHundredths(value, lang) {
  if (typeof value !== 'bigint' || !['fr', 'en'].includes(lang)) throw new RangeError('Exact amount and supported language required');
  const negative = value < 0n, magnitude = negative ? -value : value;
  const integer = String(magnitude / 100n), groups = [];
  for (let end = integer.length; end > 0; end -= 3) groups.push(integer.slice(Math.max(0, end - 3), end));
  return `${negative ? '−' : ''}${groups.reverse().join(lang === 'fr' ? '\u202f' : ',')}${lang === 'fr' ? ',' : '.'}${String(magnitude % 100n).padStart(2, '0')}`;
}
export function formatInflationBasketMoney(value, lang) {
  const number = formatHundredths(value, lang);
  return lang === 'fr' ? `${number} €` : `${number.startsWith('−') ? '−€' + number.slice(1) : '€' + number}`;
}
export function formatInflationBasketPercent(value, lang, points = false) {
  if (value === null) return lang === 'fr' ? 'Indisponible' : 'Unavailable';
  return `${formatHundredths(value, lang)}${points ? (lang === 'fr' ? ' point(s)' : ' pp') : (lang === 'fr' ? ' %' : '%')}`;
}
