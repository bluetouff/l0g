/** Exact arithmetic for explicitly fictional dividend/receipt scenarios, in EUR millions. */
export const CUMCUM_REFORM_FIELDS = Object.freeze(['d0', 'n0', 'd1', 'n1']);
export const CUMCUM_REFORM_PRESETS = Object.freeze([
  Object.freeze({ d0: '1000', n0: '120', d1: '1500', n1: '150' }),
  Object.freeze({ d0: '1000', n0: '120', d1: '1200', n1: '144' }),
  Object.freeze({ d0: '1000', n0: '120', d1: '1200', n1: '168' }),
]);
export const CUMCUM_REFORM_DEFAULTS = CUMCUM_REFORM_PRESETS[0];
const MAX = 100000000n;
export function parseCumCumAmount(raw) {
  if (typeof raw !== 'string' || raw.length > 10 || !/^(?:0|[1-9]\d{0,6})(?:[.,]\d{1,2})?$/.test(raw)) throw new RangeError('Invalid decimal amount');
  const [whole, fraction = ''] = raw.replace(',', '.').split('.');
  const cents = BigInt(whole) * 100n + BigInt(fraction.padEnd(2, '0'));
  if (cents > MAX) throw new RangeError('Amount exceeds one million EUR million');
  return cents;
}
function roundRatio(n, d) {
  if (d <= 0n) throw new RangeError('Positive denominator required');
  const sign = n < 0n ? -1n : 1n, absolute = n < 0n ? -n : n;
  return sign * ((absolute * 2n + d) / (2n * d));
}
function decimal(cents) {
  const absolute = cents < 0n ? -cents : cents;
  return `${cents < 0n ? '-' : ''}${absolute / 100n}.${String(absolute % 100n).padStart(2, '0')}`;
}
export function calculateCumCumReform(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input) || Object.keys(input).length !== 4 || CUMCUM_REFORM_FIELDS.some(key => !Object.hasOwn(input, key))) throw new RangeError('Four decimal inputs required');
  const [d0, n0, d1, n1] = CUMCUM_REFORM_FIELDS.map(key => parseCumCumAmount(input[key]));
  if (d0 < 1n || d1 < 1n || n0 > d0 || n1 > d1) throw new RangeError('Receipts must be between zero and dividends');
  const baseNumerator = (d1 - d0) * n0;
  const yieldNumerator = n1 * d0 - d1 * n0;
  const delta = n1 - n0;
  if (baseNumerator + yieldNumerator !== delta * d0) throw new Error('Receipt decomposition invariant violated');
  // Allocate the possible one-cent presentation remainder to the yield effect.
  const base = roundRatio(baseNumerator, d0), rate = delta - base;
  return Object.freeze({
    inputs: Object.freeze(Object.fromEntries(CUMCUM_REFORM_FIELDS.map((key, i) => [key, decimal([d0, n0, d1, n1][i])]))),
    y0: decimal(roundRatio(n0 * 10000n, d0)),
    y1: decimal(roundRatio(n1 * 10000n, d1)),
    delta: decimal(delta), points: decimal(roundRatio(yieldNumerator * 10000n, d0 * d1)),
    base: decimal(base), rate: decimal(rate), sum: decimal(base + rate),
    growth: n0 === 0n ? null : decimal(roundRatio(delta * 10000n, n0)),
    exact: Object.freeze({ baseNumerator: String(baseNumerator), yieldNumerator: String(yieldNumerator), denominator: String(d0), deltaCents: String(delta) }),
  });
}
