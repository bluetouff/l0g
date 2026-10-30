import test from 'node:test';
import assert from 'node:assert/strict';
import { LEARNING_TIME_DEFAULTS, LEARNING_TIME_FIELDS, LEARNING_TIME_UNIT, calculateLearningTime, parseLearningTimeQuantity, formatLearningTime, formatLearningTimeCount } from '../src/lib/learningTimeCalculator.mjs';

test('fictional article example preserves all monthly time and whole-session identities', () => {
  const v = calculateLearningTime(LEARNING_TIME_DEFAULTS), u = LEARNING_TIME_UNIT;
  assert.equal(v.baseline, 3000n * u); assert.equal(v.grossSaving, 1000n * u); assert.equal(v.checking, 300n * u);
  assert.equal(v.assisted, 2300n * u); assert.equal(v.net, 700n * u);
  assert.equal(v.learning, 350n * u); assert.equal(v.other, 350n * u);
  assert.equal(v.sessions, 11n); assert.equal(v.remainder, 20n * u); assert.equal(v.extraLoad, 0n);
});
test('checking longer than the gross saving is a real added workload, with zero allocatable time', () => {
  const v = calculateLearningTime({ ...LEARNING_TIME_DEFAULTS, checking: '15' });
  assert.equal(v.net, -500n * LEARNING_TIME_UNIT); assert.equal(v.assisted, 3500n * LEARNING_TIME_UNIT); assert.equal(v.extraLoad, 500n * LEARNING_TIME_UNIT);
  for (const key of ['available', 'learning', 'other', 'sessions', 'remainder']) assert.equal(v[key], 0n);
});
test('zero volume, zero gain, and 0/100 percent allocations retain their meaning', () => {
  for (const overrides of [{ cases: '0' }, { checking: '10' }]) {
    const v = calculateLearningTime({ ...LEARNING_TIME_DEFAULTS, ...overrides });
    for (const key of ['net', 'available', 'learning', 'other', 'sessions', 'remainder']) assert.equal(v[key], 0n);
  }
  for (const share of ['0', '100']) {
    const v = calculateLearningTime({ ...LEARNING_TIME_DEFAULTS, learningShare: share });
    assert.equal(v.learning, share === '0' ? 0n : v.net); assert.equal(v.learning + v.other, v.net);
  }
});
test('fractional minutes and percentage preserve the millionth-minute precision', () => {
  const v = calculateLearningTime({ cases: '1', baseline: '0,01', saving: '0.01', checking: '0', learningShare: '0,01', session: '0.01' });
  assert.equal(v.net, 10000n); assert.equal(v.learning, 1n); assert.equal(v.other, 9999n); assert.equal(v.sessions, 0n); assert.equal(v.remainder, 1n);
});
test('bounds support maximum workload without Number overflow or negative assisted time', () => {
  const v = calculateLearningTime({ cases: '1000000', baseline: '1440', saving: '0', checking: '1440', learningShare: '100', session: '0.01' });
  assert.equal(v.baseline, 1440000000000000n); assert.equal(v.assisted, 2880000000000000n); assert.equal(v.net, -1440000000000000n);
  assert.throws(() => calculateLearningTime({ ...LEARNING_TIME_DEFAULTS, baseline: '2', saving: '3' }), RangeError);
});
test('invalid, missing and hostile numeric text is rejected instead of coerced or clamped', () => {
  for (const key of LEARNING_TIME_FIELDS) {
    for (const bad of ['', ' ', '-1', '+2', '1e2', 'Infinity', 'NaN', '<img>', '1 000', '1.234', '1,2.3', '1'.repeat(20000), 2, null]) assert.throws(() => calculateLearningTime({ ...LEARNING_TIME_DEFAULTS, [key]: bad }), RangeError);
  }
  for (const [key, value] of [['cases', '1.2'], ['cases', '1000001'], ['baseline', '0'], ['session', '0'], ['baseline', '1440.01'], ['saving', '1440.01'], ['checking', '1440.01'], ['learningShare', '100.01']]) assert.throws(() => calculateLearningTime({ ...LEARNING_TIME_DEFAULTS, [key]: value }), RangeError);
  for (const value of [null, [], {}, { ...LEARNING_TIME_DEFAULTS, extra: '1' }]) assert.throws(() => calculateLearningTime(value), RangeError);
  assert.throws(() => parseLearningTimeQuantity('1', '__proto__'), RangeError);
});
test('each accepted quantity has an exact integer representation and comma parity', () => {
  assert.equal(parseLearningTimeQuantity('100', 'cases'), 100n);
  assert.equal(parseLearningTimeQuantity('1.25', 'checking'), 125n);
  assert.equal(parseLearningTimeQuantity('1,25', 'checking'), 125n);
  assert.equal(parseLearningTimeQuantity('0.01', 'learningShare'), 1n);
});
test('1000 deterministic scenarios match an independently rearranged centiminute oracle', () => {
  const text = n => `${Math.floor(n / 100)}.${String(n % 100).padStart(2, '0')}`;
  for (let i = 1; i <= 1000; i++) {
    const count = i % 997, base = (i * 179) % 60000 + 1, save = (i * 173) % (base + 1), check = (i * 43) % 60000, share = (i * 97) % 10001, length = (i * 13) % 6000 + 1;
    const v = calculateLearningTime({ cases: String(count), baseline: text(base), saving: text(save), checking: text(check), learningShare: text(share), session: text(length) });
    const signedCenti = count * (save - check), availableCenti = Math.max(0, signedCenti), expectedLearning = availableCenti * share;
    assert.equal(v.baseline, BigInt(count * base) * 10000n); assert.equal(v.assisted, BigInt(count * (base - save + check)) * 10000n);
    assert.equal(v.net, BigInt(signedCenti) * 10000n); assert.equal(v.learning, BigInt(expectedLearning));
    assert.equal(v.other, BigInt(availableCenti) * 10000n - BigInt(expectedLearning));
    assert.equal(v.sessions, BigInt(Math.floor(expectedLearning / (length * 10000))));
    assert.equal(v.remainder, BigInt(expectedLearning % (length * 10000)));
  }
});
test('duration display rounds only at the final second and retains signed workload', () => {
  assert.equal(formatLearningTime(700n * LEARNING_TIME_UNIT, 'fr'), '11 h 40 min');
  assert.equal(formatLearningTime(-500n * LEARNING_TIME_UNIT, 'en'), '−8 h 20 min');
  assert.equal(formatLearningTime(350n * LEARNING_TIME_UNIT, 'en'), '5 h 50 min');
  assert.equal(formatLearningTime(8333n, 'fr'), '0 min'); assert.equal(formatLearningTime(8334n, 'fr'), '1 s');
  assert.equal(formatLearningTime(59999999n, 'en'), '1 h');
  assert.equal(formatLearningTimeCount(1000000n, 'fr'), '1\u202f000\u202f000');
  assert.equal(formatLearningTimeCount(1000000n, 'en'), '1,000,000');
  assert.throws(() => formatLearningTime(1, 'fr'), RangeError); assert.throws(() => formatLearningTime(1n, 'xx'), RangeError); assert.throws(() => formatLearningTimeCount(-1n, 'en'), RangeError);
});
