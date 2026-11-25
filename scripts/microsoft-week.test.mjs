import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateMicrosoftWeek, microsoftWeekFields } from '../src/lib/microsoft-week.mjs';

const baseline = Object.fromEntries(microsoftWeekFields.map(({ key, initial }) => [key, initial]));

test('the reference scenario counts lost margin and extra expenses once', () => {
  assert.deepEqual(calculateMicrosoftWeek(baseline), {
    revenue: 1_000_000,
    exposed: 500_000,
    served: 200_000,
    backlog: 300_000,
    recovered: 225_000,
    lost: 75_000,
    contribution: 26_250,
    extra: 40_000,
    total: 66_250,
  });
});

test('the recovery sensitivities apply only to the backlog', () => {
  assert.equal(calculateMicrosoftWeek({ ...baseline, recovery: 25 }).total, 118_750);
  assert.equal(calculateMicrosoftWeek({ ...baseline, recovery: 90 }).total, 50_500);
});

test('zero sales or complete recovery leave only extra expenses', () => {
  assert.equal(calculateMicrosoftWeek({ ...baseline, revenue: 0 }).total, 40_000);
  assert.equal(calculateMicrosoftWeek({ ...baseline, fallback: 100 }).lost, 0);
  assert.equal(calculateMicrosoftWeek({ ...baseline, recovery: 100, extra: 0 }).total, 0);
  assert.equal(calculateMicrosoftWeek({ ...baseline, margin: 0 }).total, 40_000);
});

test('missing, nonnumeric and out-of-range values leave the answer unavailable', () => {
  for (const overrides of [
    { revenue: NaN }, { revenue: 1e12 + 1 }, { exposure: 101 }, { recovery: -1 },
    { fallback: '40' }, { margin: Infinity }, { extra: undefined },
  ]) {
    assert.equal(calculateMicrosoftWeek({ ...baseline, ...overrides }), null);
  }
  assert.equal(calculateMicrosoftWeek(null), null);
});
