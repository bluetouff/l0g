import assert from 'node:assert/strict';
import test from 'node:test';
import {
  ASIA_US_PORTFOLIO_DEFAULTS,
  ASIA_US_PORTFOLIO_PRESETS,
  calculateAsiaUSPortfolioStress,
  normalizeAsiaUSPortfolioInputs,
} from '../src/lib/asia-us-portfolio-stress-model.ts';

test('zero shocks preserve the portfolio', () => {
  const result = calculateAsiaUSPortfolioStress({
    ...ASIA_US_PORTFOLIO_DEFAULTS,
    equityShockPct: 0,
    treasuryShockPct: 0,
    agencyShockPct: 0,
    corporateShockPct: 0,
    shortTermShockPct: 0,
  });
  assert.equal(result.totalChangeUsdBn, 0);
  assert.equal(result.stressedValueUsdBn, result.baseValueUsdBn);
});

test('the default Asia scenario is arithmetically stable', () => {
  const result = calculateAsiaUSPortfolioStress();
  assert.equal(result.baseValueUsdBn, 9_835);
  assert.ok(Math.abs(result.totalChangeUsdBn - (-1_246.5)) < 1e-9);
  assert.ok(Math.abs(result.totalChangePct - (-12.6741230300)) < 1e-8);
  assert.equal(result.largestContributor, 'equities');
});

test('a ten percent equity shock on Asia changes value by 450.4 billion dollars', () => {
  const result = calculateAsiaUSPortfolioStress({
    equityShockPct: -10,
    treasuryShockPct: 0,
    agencyShockPct: 0,
    corporateShockPct: 0,
    shortTermShockPct: 0,
  });
  assert.equal(result.equityChangeUsdBn, -450.4);
  assert.equal(result.totalChangeUsdBn, -450.4);
});

test('shocks and holdings are clamped', () => {
  const result = normalizeAsiaUSPortfolioInputs({ equitiesUsdBn: -3, equityShockPct: -300, treasuryShockPct: 250 });
  assert.equal(result.equitiesUsdBn, 0);
  assert.equal(result.equityShockPct, -100);
  assert.equal(result.treasuryShockPct, 100);
});

test('country presets retain the published broad-category arithmetic', () => {
  const japan = ASIA_US_PORTFOLIO_PRESETS.find((preset) => preset.id === 'japan');
  const singapore = ASIA_US_PORTFOLIO_PRESETS.find((preset) => preset.id === 'singapore');
  assert.ok(japan && singapore);
  assert.equal(calculateAsiaUSPortfolioStress(japan.inputs).baseValueUsdBn, 2_883);
  assert.equal(calculateAsiaUSPortfolioStress(singapore.inputs).baseValueUsdBn, 1_119);
  assert.equal(singapore.reportedTotalUsdBn, 1_118);
});

test('a zero portfolio returns finite zeros', () => {
  const result = calculateAsiaUSPortfolioStress({ equitiesUsdBn: 0, treasuryUsdBn: 0, agencyUsdBn: 0, corporateUsdBn: 0, shortTermUsdBn: 0 });
  assert.equal(result.baseValueUsdBn, 0);
  assert.equal(result.totalChangePct, 0);
  assert.equal(result.largestContributor, 'none');
  assert.ok(Object.values(result).every((value) => typeof value !== 'number' || Number.isFinite(value)));
});
