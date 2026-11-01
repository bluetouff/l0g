/** Educational wafer-pass capacity model; common availability/loading, instantaneous restart. */
export const ASML_PRODUCTIVITY_FIELDS = Object.freeze(['before', 'after', 'down', 'horizon', 'availability', 'loading']);
export const ASML_PRODUCTIVITY_DEFAULTS = Object.freeze({ before: '230', after: '295', down: '42', horizon: '365', availability: '90', loading: '80' });
export const ASML_PRODUCTIVITY_LIMITS = Object.freeze({ before: Object.freeze([1, 1000]), after: Object.freeze([1, 1000]), down: Object.freeze([0, 365]), horizon: Object.freeze([1, 1460]), availability: Object.freeze([1, 100]), loading: Object.freeze([1, 100]) });
export const ASML_PRODUCTIVITY_RESULTS = Object.freeze(['baseline', 'upgraded', 'delta', 'catchup']);
function parseAsmlThousandths(raw, field) {
  if (!ASML_PRODUCTIVITY_FIELDS.includes(field) || typeof raw !== 'string' || raw.length > 8) throw new RangeError('Bounded decimal and known field required');
  const match = /^(0|[1-9][0-9]{0,3})(?:[.,]([0-9]{1,3}))?$/.exec(raw);
  if (!match || match[0] !== raw) throw new RangeError('At most three decimal places required');
  const thousandths = Number(match[1]) * 1000 + Number((match[2] ?? '').padEnd(3, '0'));
  const [minimum, maximum] = ASML_PRODUCTIVITY_LIMITS[field];
  if (thousandths < minimum * 1000 || thousandths > maximum * 1000) throw new RangeError('Scenario outside field limits');
  return thousandths;
}
export function parseAsmlProductivityValue(raw, field) { return parseAsmlThousandths(raw, field) / 1000; }
export function calculateAsmlProductivity(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input) || Reflect.ownKeys(input).length !== ASML_PRODUCTIVITY_FIELDS.length || !ASML_PRODUCTIVITY_FIELDS.every(field => Object.hasOwn(input, field))) throw new RangeError('Six explicit scenario parameters required');
  const scaled = Object.fromEntries(ASML_PRODUCTIVITY_FIELDS.map(field => [field, parseAsmlThousandths(input[field], field)]));
  const values = Object.fromEntries(ASML_PRODUCTIVITY_FIELDS.map(field => [field, scaled[field] / 1000]));
  const { before, after, down, horizon, availability, loading } = values;
  const productiveHoursPerDay = 24 * availability / 100 * loading / 100;
  const denominator = 10000000000000000n;
  const common = 24n * BigInt(scaled.availability) * BigInt(scaled.loading);
  const baselineNumerator = common * BigInt(scaled.before) * BigInt(scaled.horizon);
  const upgradedNumerator = common * BigInt(scaled.after) * BigInt(Math.max(0, scaled.horizon - scaled.down));
  const baseline = Number(baselineNumerator) / Number(denominator);
  const upgraded = Number(upgradedNumerator) / Number(denominator);
  const delta = Number(upgradedNumerator - baselineNumerator) / Number(denominator);
  const identical = before === after && down === 0;
  const catchup = after > before ? Number(BigInt(scaled.down) * BigInt(scaled.after)) / (1000 * (scaled.after - scaled.before)) : identical ? 0 : null;
  const afterRestart = catchup === null ? null : identical ? 0 : Number(BigInt(scaled.down) * BigInt(scaled.before)) / (1000 * (scaled.after - scaled.before));
  const status = identical ? 'identical' : catchup === null ? 'never' : catchup > horizon ? 'beyond' : 'within';
  return Object.freeze({ values: Object.freeze(values), productiveHoursPerDay, baseline, upgraded, delta, percent: Number(upgradedNumerator - baselineNumerator) / Number(baselineNumerator) * 100, catchup, afterRestart, status });
}
export function formatAsmlProductivity(value, lang, digits = 0) {
  if (!Number.isFinite(value) || !['fr', 'en'].includes(lang) || ![0, 1, 2, 4].includes(digits)) throw new RangeError('Finite value, native language and supported precision required');
  return new Intl.NumberFormat(lang === 'fr' ? 'fr-FR' : 'en-GB', { maximumFractionDigits: digits }).format(value === 0 ? 0 : value);
}
export function asmlProductivityDisplay(result, field, lang) {
  if (!ASML_PRODUCTIVITY_RESULTS.includes(field)) throw new RangeError('Unknown capacity result');
  if (field === 'catchup' && result.catchup === null) return lang === 'fr' ? 'Aucun' : 'None';
  const value = result[field];
  return (field === 'delta' && value > 0 ? '+' : '') + formatAsmlProductivity(value, lang, field === 'catchup' ? 1 : Math.abs(value) > 0 && Math.abs(value) < 1 ? 4 : 0);
}
export function asmlProductivityPlot(result, mode, lang) {
  if (!['desktop', 'mobile'].includes(mode) || !['fr', 'en'].includes(lang)) throw new RangeError('Known chart layout and native language required');
  const mobile = mode === 'mobile';
  const left = mobile ? 70 : 86, right = mobile ? 266 : 624, top = mobile ? 18 : 28, bottom = mobile ? 180 : 260;
  const maximum = Math.max(result.baseline, result.upgraded, 1) * 1.12;
  const x = day => left + (right - left) * day / result.values.horizon;
  const y = volume => bottom - (bottom - top) * volume / maximum;
  const n = value => value.toFixed(3);
  const restart = Math.min(result.values.down, result.values.horizon);
  const visibleCatchup = result.catchup !== null && result.catchup <= result.values.horizon;
  const ticks = mobile ? 2 : 4;
  const unitScale = maximum >= 1e6 ? 1e6 : maximum >= 1000 ? 1000 : 1;
  const unit = lang === 'fr' ? (unitScale === 1e6 ? 'Millions de passages de wafer' : unitScale === 1000 ? 'Milliers de passages de wafer' : 'Passages de wafer') : (unitScale === 1e6 ? 'Million wafer passes' : unitScale === 1000 ? 'Thousand wafer passes' : 'Wafer passes');
  const tickDigits = maximum < 1 ? 4 : 2;
  return Object.freeze({
    unit, left, right, top, bottom,
    baseline: `M ${left} ${bottom} L ${right} ${n(y(result.baseline))}`,
    upgraded: `M ${left} ${bottom} L ${n(x(restart))} ${bottom} L ${right} ${n(y(result.upgraded))}`,
    downtimeWidth: n(x(restart) - left),
    catchupVisible: visibleCatchup,
    catchupX: visibleCatchup ? n(x(result.catchup)) : String(left),
    catchupY: visibleCatchup ? n(y(result.values.before * result.productiveHoursPerDay * result.catchup)) : String(bottom),
    xTicks: Array.from({ length: ticks + 1 }, (_, i) => ({ x: n(left + (right - left) * i / ticks), label: formatAsmlProductivity(result.values.horizon * i / ticks, lang, 1) })),
    yTicks: Array.from({ length: 5 }, (_, i) => ({ y: n(y(maximum * i / 4)), label: formatAsmlProductivity(maximum * i / 4 / unitScale, lang, tickDigits) })),
  });
}
