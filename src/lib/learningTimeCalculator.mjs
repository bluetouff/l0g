/** Constructed time-allocation model. Exact unit: one millionth of a minute. */
export const LEARNING_TIME_FIELDS = Object.freeze(['cases', 'baseline', 'saving', 'checking', 'learningShare', 'session']);
export const LEARNING_TIME_DEFAULTS = Object.freeze({ cases: '100', baseline: '30', saving: '10', checking: '3', learningShare: '50', session: '30' });
export const LEARNING_TIME_UNIT = 1000000n;
const CENTIMINUTE = 10000n;
const LIMITS = Object.freeze({ baseline: [1n, 144000n], saving: [0n, 144000n], checking: [0n, 144000n], learningShare: [0n, 10000n], session: [1n, 144000n] });
export function parseLearningTimeQuantity(raw, field) {
  if (typeof raw !== 'string' || raw.length > 10) throw new RangeError('Bounded numeric text required');
  if (field === 'cases') {
    if (!/^\d{1,7}$/.test(raw)) throw new RangeError('Integer case count required');
    const value = BigInt(raw);
    if (value > 1000000n) throw new RangeError('Case count exceeds bounds');
    return value;
  }
  if (!Object.hasOwn(LIMITS, field) || !/^\d{1,4}(?:[.,]\d{1,2})?$/.test(raw)) throw new RangeError('Invalid model quantity');
  const [whole, fraction = ''] = raw.replace(',', '.').split('.');
  const value = BigInt(whole) * 100n + BigInt(fraction.padEnd(2, '0'));
  const [minimum, maximum] = LIMITS[field];
  if (value < minimum || value > maximum) throw new RangeError('Model quantity exceeds bounds');
  return value;
}
export function calculateLearningTime(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input) || Object.keys(input).length !== 6 || LEARNING_TIME_FIELDS.some(key => !Object.hasOwn(input, key))) throw new RangeError('Six model quantities required');
  const v = Object.fromEntries(LEARNING_TIME_FIELDS.map(key => [key, parseLearningTimeQuantity(input[key], key)]));
  if (v.saving > v.baseline) throw new RangeError('Saving cannot exceed initial task time');
  const baseline = v.cases * v.baseline * CENTIMINUTE;
  const grossSaving = v.cases * v.saving * CENTIMINUTE;
  const checking = v.cases * v.checking * CENTIMINUTE;
  const assisted = baseline - grossSaving + checking;
  const net = grossSaving - checking;
  const available = net > 0n ? net : 0n;
  const extraLoad = net < 0n ? -net : 0n;
  const learning = available * v.learningShare / 10000n;
  const other = available - learning;
  const sessionLength = v.session * CENTIMINUTE;
  const sessions = learning / sessionLength;
  const remainder = learning % sessionLength;
  if (baseline - assisted !== net || learning + other !== available || sessions * sessionLength + remainder !== learning || assisted < 0n) throw new Error('Time-allocation invariant failed');
  return Object.freeze({ baseline, grossSaving, checking, assisted, net, available, extraLoad, learning, other, sessionLength, sessions, remainder });
}
export function formatLearningTimeCount(value, lang) {
  if (typeof value !== 'bigint' || value < 0n || !['fr', 'en'].includes(lang)) throw new RangeError('Supported nonnegative integer required');
  const raw = String(value), groups = [];
  for (let end = raw.length; end > 0; end -= 3) groups.push(raw.slice(Math.max(0, end - 3), end));
  return groups.reverse().join(lang === 'en' ? ',' : '\u202f');
}
export function formatLearningTime(value, lang) {
  if (typeof value !== 'bigint' || !['fr', 'en'].includes(lang)) throw new RangeError('Exact duration and supported language required');
  const negative = value < 0n;
  const totalSeconds = ((negative ? -value : value) * 60n + LEARNING_TIME_UNIT / 2n) / LEARNING_TIME_UNIT;
  const hours = totalSeconds / 3600n, minutes = totalSeconds % 3600n / 60n, seconds = totalSeconds % 60n;
  const parts = [];
  if (hours) parts.push(`${formatLearningTimeCount(hours, lang)} h`);
  if (minutes) parts.push(`${minutes} min`);
  if (seconds) parts.push(`${seconds} s`);
  if (!parts.length) parts.push('0 min');
  return `${negative && totalSeconds ? '−' : ''}${parts.join(' ')}`;
}
