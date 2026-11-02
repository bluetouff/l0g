/** Hypothetical monthly USD contributions, using exact integer-scaled inputs. */
export const CLOUDFLARE_REVENUE_FIELDS = Object.freeze(['uses', 'coverage', 'price', 'deductions', 'cost', 'visits', 'visitValue']);
export const CLOUDFLARE_REVENUE_DEFAULTS = Object.freeze({ uses: '1000000', coverage: '20', price: '0.002', deductions: '10', cost: '100', visits: '50000', visitValue: '10' });
export const CLOUDFLARE_REVENUE_LIMITS = Object.freeze({
  uses: Object.freeze({ min: '0', max: '1000000000000', step: '1', precision: 0 }),
  coverage: Object.freeze({ min: '0', max: '100', step: '0.1', precision: 1 }),
  price: Object.freeze({ min: '0', max: '100', step: '0.000001', precision: 6 }),
  deductions: Object.freeze({ min: '0', max: '100', step: '0.1', precision: 1 }),
  cost: Object.freeze({ min: '0', max: '1000000000', step: '0.01', precision: 2 }),
  visits: Object.freeze({ min: '0', max: '1000000000000', step: '1', precision: 0 }),
  visitValue: Object.freeze({ min: '0', max: '100000', step: '0.01', precision: 2 })
});
export const CLOUDFLARE_REVENUE_RESULTS = Object.freeze(['billable', 'gross', 'after', 'net', 'benchmark', 'gap', 'priceThreshold', 'coverageThreshold']);
export const CLOUDFLARE_REVENUE_PRESETS = Object.freeze(['5', '20', '50']);
const fraction = (n, d = 1n) => Object.freeze({ n, d });
function scaledValue(field, raw) {
  if (!CLOUDFLARE_REVENUE_FIELDS.includes(field) || typeof raw !== 'string' || raw.length > 20) throw new RangeError('Known field and bounded decimal string required');
  const limit = CLOUDFLARE_REVENUE_LIMITS[field];
  const match = /^(0|[1-9][0-9]{0,12})(?:[.,]([0-9]{1,6}))?$/.exec(raw);
  if (!match || match[0] !== raw || (match[2]?.length ?? 0) > limit.precision) throw new RangeError('Decimal syntax or precision outside field contract');
  const scale = 10n ** BigInt(limit.precision);
  const value = BigInt(match[1]) * scale + BigInt((match[2] ?? '').padEnd(limit.precision, '0') || '0');
  if (value > BigInt(limit.max) * scale) throw new RangeError('Input exceeds field bound');
  return value;
}
export function parseCloudflareRevenueValue(field, raw) { return Number(scaledValue(field, raw)) / 10 ** CLOUDFLARE_REVENUE_LIMITS[field].precision; }
export function calculateCloudflareRevenue(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input) || Reflect.ownKeys(input).length !== CLOUDFLARE_REVENUE_FIELDS.length || !CLOUDFLARE_REVENUE_FIELDS.every(field => Object.hasOwn(input, field))) throw new RangeError('Seven explicit hypothetical inputs required');
  const s = Object.fromEntries(CLOUDFLARE_REVENUE_FIELDS.map(field => [field, scaledValue(field, input[field])]));
  const keep = 1000n - s.deductions, base = s.uses * s.coverage, gross = base * s.price, retained = gross * keep;
  const net = retained - s.cost * 10000000000n;
  const benchmark = s.visits * s.visitValue, target = benchmark + s.cost * 1000n;
  const priceBase = base * keep, coverageBase = s.uses * s.price * keep;
  const priceThreshold = target === 0n ? fraction(0n) : priceBase === 0n ? null : fraction(target * 10n, priceBase);
  const coverageThreshold = target === 0n ? fraction(0n) : coverageBase === 0n ? null : fraction(target * 1000000n, coverageBase);
  const exact = Object.freeze({ billable: fraction(base, 1000n), gross: fraction(gross, 1000000000n), after: fraction(retained, 1000000000000n), net: fraction(net, 1000000000000n), benchmark: fraction(benchmark, 100000n), gap: fraction(net - benchmark * 10000000n, 1000000000000n), priceThreshold, coverageThreshold });
  const numeric = Object.fromEntries(CLOUDFLARE_REVENUE_RESULTS.map(field => [field, exact[field] === null ? null : Number(exact[field].n) / Number(exact[field].d)]));
  const gap = exact.gap.n;
  const status = gap < 0n ? 'below' : gap > 0n ? 'above' : 'equal';
  const coverageStatus = coverageThreshold === null ? 'undefined' : coverageThreshold.n > 100n * coverageThreshold.d ? 'unreachable' : 'reachable';
  const values = Object.freeze(Object.fromEntries(CLOUDFLARE_REVENUE_FIELDS.map(field => [field, parseCloudflareRevenueValue(field, input[field])])));
  return Object.freeze({ ...numeric, values, exact, status, coverageStatus });
}
export function formatCloudflareRevenueFraction(value, lang, digits = 2) {
  if (!['fr', 'en'].includes(lang) || !Number.isInteger(digits) || digits < 0 || digits > 6 || !value || typeof value.n !== 'bigint' || typeof value.d !== 'bigint' || value.d <= 0n) throw new RangeError('A bounded rational display is required');
  const locale = lang === 'fr' ? 'fr-FR' : 'en-GB', negative = value.n < 0n, n = negative ? -value.n : value.n, scale = 10n ** BigInt(digits);
  if (n > 0n && n * scale < value.d) return `≈ ${new Intl.NumberFormat(locale, { notation: 'scientific', maximumSignificantDigits: 4 }).format(Number(value.n) / Number(value.d))}`;
  const scaled = n * scale, quotient = scaled / value.d, remainder = scaled % value.d;
  const rounded = quotient + (2n * remainder >= value.d ? 1n : 0n), whole = rounded / scale;
  const decimal = (rounded % scale).toString().padStart(digits, '0').replace(/0+$/u, '');
  return `${remainder === 0n ? '' : '≈ '}${negative && rounded !== 0n ? '−' : ''}${new Intl.NumberFormat(locale).format(whole)}${decimal ? (lang === 'fr' ? ',' : '.') + decimal : ''}`;
}
export function cloudflareRevenueDisplay(result, field, lang) {
  if (!CLOUDFLARE_REVENUE_RESULTS.includes(field) || !['fr', 'en'].includes(lang)) throw new RangeError('Known result and language required');
  const value = result.exact[field];
  if (value === null) return lang === 'fr' ? 'Aucun seuil fini' : 'No finite threshold';
  const digits = field === 'priceThreshold' || field === 'coverageThreshold' ? 6 : 2;
  const number = formatCloudflareRevenueFraction(value, lang, digits);
  return field === 'billable' ? number : field === 'coverageThreshold' ? `${number} %` : `${number}${lang === 'fr' ? ' $US' : ' USD'}${field === 'priceThreshold' ? (lang === 'fr' ? ' / usage' : ' / use') : ''}`;
}
