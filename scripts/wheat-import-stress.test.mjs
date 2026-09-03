import assert from 'node:assert/strict';
import test from 'node:test';
import {
  DEFAULT_WHEAT_IMPORT_STRESS_INPUT,
  assessWheatImportStress,
  validateWheatImportStress,
} from '../src/lib/wheat-import-stress.ts';

const close = (actual, expected, epsilon = 1e-10) => {
  assert.ok(Math.abs(actual - expected) <= epsilon, `${actual} differs from ${expected}`);
};

test('default scenario decomposes the import-bill increase', () => {
  const result = assessWheatImportStress(DEFAULT_WHEAT_IMPORT_STRESS_INPUT);
  assert.equal(result.valid, true);
  close(result.baseLandedUsdPerTonne, 300);
  close(result.stressedLandedUsdPerTonne, 342);
  close(result.baseAnnualBillUsdBn, 3);
  close(result.stressedAnnualBillUsdBn, 3.42);
  close(result.grainContributionUsdBn, 0.27);
  close(result.freightContributionUsdBn, 0.15);
  close(result.annualBillIncreaseUsdBn, 0.42);
  close(result.dollarBillIndex, 114);
  close(result.currencyContributionIndexPoints, 5.7);
  close(result.localCurrencyBillIndex, 119.7);
  close(result.landedPriceChangePct, 14);
});

test('zero shocks leave both bills unchanged', () => {
  const result = assessWheatImportStress({
    ...DEFAULT_WHEAT_IMPORT_STRESS_INPUT,
    wheatPriceShockPct: 0,
    freightShockPct: 0,
    exchangeRateShockPct: 0,
  });
  close(result.annualBillIncreaseUsdBn, 0);
  close(result.localCurrencyBillIndex, 100);
  close(result.landedPriceChangePct, 0);
});

test('a rising local-currency cost of USD changes the local-currency index, not the dollar bill', () => {
  const base = assessWheatImportStress({
    ...DEFAULT_WHEAT_IMPORT_STRESS_INPUT,
    wheatPriceShockPct: 0,
    freightShockPct: 0,
    exchangeRateShockPct: 20,
  });
  close(base.stressedAnnualBillUsdBn, base.baseAnnualBillUsdBn);
  close(base.dollarBillIndex, 100);
  close(base.currencyContributionIndexPoints, 20);
  close(base.localCurrencyBillIndex, 120);
});

test('the grain and freight contributions reconcile to the dollar increase', () => {
  const result = assessWheatImportStress({
    ...DEFAULT_WHEAT_IMPORT_STRESS_INPUT,
    annualImportsMt: 31.4,
    baseFobUsdPerTonne: 280,
    baseFreightUsdPerTonne: 45,
    wheatPriceShockPct: 12,
    freightShockPct: 80,
    exchangeRateShockPct: 7,
  });
  close(result.grainContributionUsdBn + result.freightContributionUsdBn, result.annualBillIncreaseUsdBn);
});

test('price and freight declines produce a negative dollar change without breaking the decomposition', () => {
  const result = assessWheatImportStress({
    ...DEFAULT_WHEAT_IMPORT_STRESS_INPUT,
    wheatPriceShockPct: -10,
    freightShockPct: -20,
    exchangeRateShockPct: -5,
  });
  assert.equal(result.valid, true);
  assert.ok(result.annualBillIncreaseUsdBn < 0);
  close(result.grainContributionUsdBn + result.freightContributionUsdBn, result.annualBillIncreaseUsdBn);
  close(result.localCurrencyBillIndex, result.dollarBillIndex * 0.95);
});

test('invalid, non-finite and implausible values are rejected', () => {
  assert.deepEqual(
    validateWheatImportStress({ ...DEFAULT_WHEAT_IMPORT_STRESS_INPUT, annualImportsMt: Number.NaN }),
    ['imports-invalid'],
  );
  assert.deepEqual(
    validateWheatImportStress({ ...DEFAULT_WHEAT_IMPORT_STRESS_INPUT, wheatPriceShockPct: -100 }),
    ['wheat-shock-invalid'],
  );
  assert.equal(
    assessWheatImportStress({ ...DEFAULT_WHEAT_IMPORT_STRESS_INPUT, exchangeRateShockPct: 999 }).valid,
    false,
  );
});

test('invalid scenarios expose no fabricated monetary results', () => {
  assert.deepEqual(assessWheatImportStress({
    ...DEFAULT_WHEAT_IMPORT_STRESS_INPUT,
    baseFobUsdPerTonne: Number.NaN,
  }), { valid: false, errors: ['fob-invalid'] });
});

test('a 20% loss in local currency value requires a 25% rise in its USD quote', () => {
  const result = assessWheatImportStress({
    ...DEFAULT_WHEAT_IMPORT_STRESS_INPUT,
    wheatPriceShockPct: 0,
    freightShockPct: 0,
    exchangeRateShockPct: (1 / (1 - 0.2) - 1) * 100,
  });
  assert.equal(result.valid, true);
  close(result.localCurrencyBillIndex, 125);
});

const boundaries = {
  annualImportsMt: [0.01, 250, 'imports-invalid'],
  baseFobUsdPerTonne: [1, 5000, 'fob-invalid'],
  baseFreightUsdPerTonne: [0, 1000, 'freight-invalid'],
  wheatPriceShockPct: [-90, 500, 'wheat-shock-invalid'],
  freightShockPct: [-90, 1000, 'freight-shock-invalid'],
  exchangeRateShockPct: [-80, 500, 'currency-shock-invalid'],
};
for (const [key, [min, max, error]] of Object.entries(boundaries)) {
  test(`${key}: inclusive bounds and invalid values`, () => {
    for (const value of [min, max]) {
      const result = assessWheatImportStress({ ...DEFAULT_WHEAT_IMPORT_STRESS_INPUT, [key]: value });
      assert.equal(result.valid, true);
      for (const output of Object.values(result)) if (typeof output === 'number') assert.ok(Number.isFinite(output));
    }
    for (const value of [min - 0.001, max + 0.001, NaN, Infinity, -Infinity, undefined, null, '', '5']) {
      assert.deepEqual(validateWheatImportStress({ ...DEFAULT_WHEAT_IMPORT_STRESS_INPUT, [key]: value }), [error]);
    }
  });
}

test('zero freight is valid and does not create a transport shock', () => {
  const result = assessWheatImportStress({ ...DEFAULT_WHEAT_IMPORT_STRESS_INPUT, baseFreightUsdPerTonne: 0 });
  assert.equal(result.valid, true);
  close(result.freightContributionUsdBn, 0);
  close(result.stressedFreightUsdPerTonne, 0);
});

test('changing volume scales amounts but leaves price and currency indices unchanged', () => {
  const one = assessWheatImportStress(DEFAULT_WHEAT_IMPORT_STRESS_INPUT);
  const two = assessWheatImportStress({ ...DEFAULT_WHEAT_IMPORT_STRESS_INPUT, annualImportsMt: 20 });
  close(two.annualBillIncreaseUsdBn, one.annualBillIncreaseUsdBn * 2);
  close(two.localCurrencyBillIndex, one.localCurrencyBillIndex);
  close(two.landedPriceChangePct, one.landedPriceChangePct);
});
