/**
 * l0g | Budget 2027 educational stress model, v1.0.0.
 * All percentages are supplied in percent, ratios in percentage points of GDP.
 * Pure, deterministic, finite, bounded calculations. No I/O or dependencies.
 * These parameters do NOT constitute an official French fiscal projection.
 */
export const MODEL_VERSION = '1.0.0';
export const AS_OF = '2026-09-22';
export const HORIZON = 6;
export const FIRST_YEAR = 2027;
export const DEFAULTS = Object.freeze({
  debt: 119.3, growth: 2.5, primaryDeficit: 2.5, effectiveRate: 2.5,
  marketRate: 4.5, repricing: 12.5, shock: 100, maturity: 10, coupon: 3,
});
export const LIMITS = Object.freeze({
  debt: Object.freeze([50, 250]),
  growth: Object.freeze([-3, 8]),
  primaryDeficit: Object.freeze([-5, 10]),
  effectiveRate: Object.freeze([0, 10]),
  marketRate: Object.freeze([0, 10]),
  repricing: Object.freeze([0, 100]),
  shock: Object.freeze([-200, 500]),
  maturity: Object.freeze([1, 50]),
  coupon: Object.freeze([0, 10]),
});

/** Strict decimal parsing. Blank, exponents, hexadecimal and HTML are rejected. */
export function parseNumber(value) {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value !== 'string' || value.length > 32) throw new TypeError('INVALID_NUMBER');
  const s = value.trim();
  if (!/^[+-]?(?:\d+(?:[.,]\d+)?|[.,]\d+)$/.test(s)) throw new TypeError('INVALID_NUMBER');
  const n = Number(s.replace(',', '.'));
  if (!Number.isFinite(n)) throw new TypeError('INVALID_NUMBER');
  return n;
}

export function validateInputs(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new TypeError('INVALID_INPUT');
  const values = {};
  for (const key of Object.keys(LIMITS)) {
    if (!Object.prototype.hasOwnProperty.call(input, key)) throw new TypeError(`MISSING_${key}`);
    const n = parseNumber(input[key]);
    const [min, max] = LIMITS[key];
    if (n < min || n > max) throw new RangeError(`RANGE_${key}`);
    if (key === 'maturity' && !Number.isInteger(n)) throw new RangeError('INTEGER_maturity');
    values[key] = n;
  }
  // Restrict the post-shock annual yield to [0%, 15%].
  const shockedRate = values.marketRate + values.shock / 100;
  if (shockedRate < 0 || shockedRate > 15) throw new RangeError('SHOCKED_RATE');
  return Object.freeze(values);
}

/** Fixed annual coupon, face 100, immediately after a coupon date; flat yield. */
export function bondPrice(couponPct, yieldPct, years) {
  if (![couponPct, yieldPct, years].every(n => typeof n === 'number' && Number.isFinite(n))) {
    throw new TypeError('INVALID_BOND');
  }
  if (couponPct < 0 || couponPct > 10 || yieldPct < 0 || yieldPct > 15 ||
      !Number.isInteger(years) || years < 1 || years > 50) throw new RangeError('BOND_RANGE');
  const y = yieldPct / 100;
  let price = 0;
  for (let t = 1; t <= years; t += 1) price += couponPct / ((1 + y) ** t);
  price += 100 / ((1 + y) ** years);
  return price;
}

/** Positive primaryDeficit is expenditure excluding interest minus revenue. */
function project(values, marketRate) {
  let debt = values.debt;
  let rate = values.effectiveRate / 100;
  const alpha = values.repricing / 100;
  const g = values.growth / 100;
  const rows = [];
  for (let k = 0; k < HORIZON; k += 1) {
    const openingDebt = debt;
    // Stylised stock-rate adjustment, not a security-by-security maturity book.
    rate = (1 - alpha) * rate + alpha * marketRate / 100;
    const interest = rate * openingDebt / (1 + g);
    const deficit = values.primaryDeficit + interest;
    debt = openingDebt / (1 + g) + deficit;
    if (![rate, interest, deficit, debt].every(Number.isFinite)) throw new RangeError('NON_FINITE_RESULT');
    rows.push(Object.freeze({year: FIRST_YEAR + k, openingDebt, debt,
      effectiveRate: rate * 100, interest, deficit}));
  }
  return Object.freeze(rows);
}

export function evaluate(input = DEFAULTS) {
  const values = validateInputs(input);
  const shockedMarketRate = values.marketRate + values.shock / 100;
  const reference = project(values, values.marketRate);
  const stressed = project(values, shockedMarketRate);
  const priceBefore = bondPrice(values.coupon, values.marketRate, values.maturity);
  const priceAfter = bondPrice(values.coupon, shockedMarketRate, values.maturity);
  const g = values.growth / 100;
  return Object.freeze({
    values, reference, stressed, shockedMarketRate, priceBefore, priceAfter,
    priceChangePct: 100 * (priceAfter / priceBefore - 1),
    debtGap: stressed[HORIZON - 1].debt - reference[HORIZON - 1].debt,
    interestGap: stressed[HORIZON - 1].interest - reference[HORIZON - 1].interest,
    // Total deficit that stabilises the opening debt ratio, zero stock-flow adjustment.
    stabilisingDeficit: values.debt * g / (1 + g),
  });
}
