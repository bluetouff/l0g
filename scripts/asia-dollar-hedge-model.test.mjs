import assert from 'node:assert/strict';
import test from 'node:test';
import {
  ASIA_DOLLAR_HEDGE_DEFAULTS,
  calculateAsiaDollarHedge,
  normalizeAsiaDollarHedgeInputs,
} from '../src/lib/asia-dollar-hedge-model.ts';

test('default scenario separates natural, derivative and open exposure', () => {
  const result = calculateAsiaDollarHedge();
  assert.equal(result.naturalHedgeUsdBn, 10);
  assert.equal(result.derivativeHedgeUsdBn, 60);
  assert.equal(result.openNotionalUsdBn, 30);
  assert.equal(result.coveragePct, 70);
  assert.equal(result.hedgeContractsPerPosition, 80);
  assert.equal(result.renewalsAfterInitial, 79);
  assert.equal(result.averageMonthlyRollUsdBn, 20);
  assert.equal(result.cumulativeGrossRollNotionalUsdBn, 4_800);
  assert.equal(result.annualCarryCostUsdBn, 0.9);
  assert.equal(result.incrementalAnnualBasisCostUsdBn, 0.6);
  assert.equal(result.collateralCallUsdBn, 1.8);
  assert.equal(result.openFxTranslationUsdBn, -3);
});

test('derivative share is capped after the natural hedge', () => {
  const normalized = normalizeAsiaDollarHedgeInputs({ naturalHedgePct: 70, derivativeHedgePct: 80 });
  assert.equal(normalized.naturalHedgePct, 70);
  assert.equal(normalized.derivativeHedgePct, 30);
  const result = calculateAsiaDollarHedge(normalized);
  assert.equal(result.openNotionalUsdBn, 0);
});

test('a pure natural hedge creates no derivative roll or collateral scenario', () => {
  const result = calculateAsiaDollarHedge({
    ...ASIA_DOLLAR_HEDGE_DEFAULTS,
    naturalHedgePct: 100,
    derivativeHedgePct: 60,
  });
  assert.equal(result.derivativeHedgePct, 0);
  assert.equal(result.derivativeHedgeUsdBn, 0);
  assert.equal(result.averageMonthlyRollUsdBn, 0);
  assert.equal(result.collateralCallUsdBn, 0);
});

test('a twelve-month hedge spans twenty contracts over twenty years', () => {
  const result = calculateAsiaDollarHedge({ hedgeTenorMonths: 12 });
  assert.equal(result.hedgeContractsPerPosition, 20);
  assert.equal(result.renewalsAfterInitial, 19);
  assert.equal(result.averageMonthlyRollUsdBn, 5);
  assert.equal(result.cumulativeGrossRollNotionalUsdBn, 1_200);
});

test('a zero portfolio returns finite zeros', () => {
  const result = calculateAsiaDollarHedge({ portfolioUsdBn: 0 });
  assert.equal(result.coveragePct, 0);
  assert.equal(result.openNotionalUsdBn, 0);
  assert.equal(result.annualCarryCostUsdBn, 0);
  assert.ok(Object.values(result).every((value) => typeof value !== 'number' || Number.isFinite(value)));
});

test('a zero horizon creates no hedge contract or renewal', () => {
  const result = calculateAsiaDollarHedge({ assetHorizonYears: 0 });
  assert.equal(result.hedgeContractsPerPosition, 0);
  assert.equal(result.renewalsAfterInitial, 0);
  assert.equal(result.cumulativeGrossRollNotionalUsdBn, 0);
});
