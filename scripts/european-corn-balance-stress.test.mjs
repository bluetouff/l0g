import assert from 'node:assert/strict';
import test from 'node:test';
import { CORN_BALANCE, DEFAULT_CORN_STRESS_INPUT, assessCornStress, validateCornStress } from '../src/lib/european-corn-balance-stress.ts';

const close = (a, b) => assert.ok(Math.abs(a - b) < 1e-10, `${a} differs from ${b}`);
test('the August USDA baseline balances and zero stress creates no gap', () => {
  close(CORN_BALANCE.openingStocks + CORN_BALANCE.production + CORN_BALANCE.imports, CORN_BALANCE.domesticUse + CORN_BALANCE.exports + CORN_BALANCE.endingStocks);
  assert.deepEqual(assessCornStress(DEFAULT_CORN_STRESS_INPUT), { valid: true, production: 50.2, availableImports: 23.5, domesticUse: 73, endingStocks: 5.05, unresolvedGap: 0, excessOffsets: 0 });
});
test('harvest loss and missing deliveries accumulate; use and stocks offset once', () => {
  const r = assessCornStress({ extraHarvestLoss: 3, importDeliveryShortfall: 2, feedDemandReduction: 1, stockDraw: .5 });
  assert.equal(r.valid, true);
  close(r.unresolvedGap, 3.5); close(r.availableImports, 21.5); close(r.endingStocks, 4.55);
});
test('excess offsets are explicit, not silently treated as a balanced forecast', () => {
  const r = assessCornStress({ ...DEFAULT_CORN_STRESS_INPUT, extraHarvestLoss: 1, feedDemandReduction: 3 });
  close(r.unresolvedGap, 0); close(r.excessOffsets, 2);
});
for (const [key, max] of Object.entries({ extraHarvestLoss: 15, importDeliveryShortfall: 15, feedDemandReduction: 15, stockDraw: 5.05 })) {
  test(`${key}: inclusive bounds, missing and malformed values`, () => {
    for (const value of [0, max]) assert.equal(assessCornStress({ ...DEFAULT_CORN_STRESS_INPUT, [key]: value }).valid, true);
    for (const value of [-.001, max + .001, NaN, Infinity, -Infinity, undefined, null, '', '5', true]) {
      const input = { ...DEFAULT_CORN_STRESS_INPUT, [key]: value };
      assert.deepEqual(validateCornStress(input), [`${key}-invalid`]);
      assert.deepEqual(assessCornStress(input), { valid: false, errors: [`${key}-invalid`] });
    }
  });
}
test('stock reductions cannot consume more than projected ending stocks', () => {
  close(assessCornStress({ ...DEFAULT_CORN_STRESS_INPUT, stockDraw: 5.05 }).endingStocks, 0);
  assert.equal(assessCornStress({ ...DEFAULT_CORN_STRESS_INPUT, stockDraw: 5.06 }).valid, false);
});
test('all boundary combinations reconcile without negative physical lines', () => {
  for (const loss of [0, .1, 15]) for (const missing of [0, .2, 15]) for (const feed of [0, .3, 15]) for (const stock of [0, .4, 5.05]) {
    const r = assessCornStress({ extraHarvestLoss: loss, importDeliveryShortfall: missing, feedDemandReduction: feed, stockDraw: stock });
    assert.equal(r.valid, true);
    close(CORN_BALANCE.openingStocks + r.production + r.availableImports + r.unresolvedGap, r.domesticUse + CORN_BALANCE.exports + r.endingStocks + r.excessOffsets);
    for (const v of Object.values(r)) if (typeof v === 'number') assert.ok(Number.isFinite(v) && v >= 0);
  }
});
