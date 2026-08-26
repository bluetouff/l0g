import assert from 'node:assert/strict';
import test from 'node:test';
import {
  GOLD_LOAN_STRESS_DEFAULTS,
  evaluateGoldLoanStress,
} from '../src/lib/gold-loan-stress-model.ts';

const closeTo = (actual, expected, tolerance = 1e-9) => {
  assert.ok(
    Math.abs(actual - expected) <= tolerance,
    `Expected ${actual} to be within ${tolerance} of ${expected}`,
  );
};

test('default scenario includes maturity interest and a 20% gold shock', () => {
  const result = evaluateGoldLoanStress(GOLD_LOAN_STRESS_DEFAULTS);

  closeTo(result.maturityDebtLakh, 7.08);
  closeTo(result.currentPrincipalLtvPct, 60);
  closeTo(result.maturityLtvPct, 70.8);
  closeTo(result.shockedCollateralLakh, 8);
  closeTo(result.postShockMaturityLtvPct, 88.5);
  closeTo(result.maxCompliantPrincipalLakh, 6.779661016949153);
  closeTo(result.headroomAtOriginationLakh, 0.779661016949153);
  closeTo(result.repaymentToRestoreCapLakh, 0.68);
  closeTo(result.breakEvenGoldDeclinePct, 29.2);
  assert.equal(result.status, 'cap-breach');
});

test('a 40% decline takes a 60% principal LTV to 100% before interest', () => {
  const result = evaluateGoldLoanStress({
    collateralLakh: 10,
    principalLakh: 6,
    annualInterestPct: 0,
    months: 12,
    goldShockPct: -40,
    capPct: 75,
  });

  closeTo(result.postShockMaturityLtvPct, 100);
  assert.equal(result.status, 'cap-breach');
});

test('debt above shocked collateral is classified as underwater', () => {
  const result = evaluateGoldLoanStress({
    collateralLakh: 10,
    principalLakh: 8,
    annualInterestPct: 18,
    months: 12,
    goldShockPct: -20,
    capPct: 80,
  });

  assert.ok(result.postShockMaturityLtvPct > 100);
  assert.equal(result.status, 'underwater');
});

test('invalid and extreme inputs are clamped to finite model bounds', () => {
  const result = evaluateGoldLoanStress({
    collateralLakh: Number.NaN,
    principalLakh: Number.POSITIVE_INFINITY,
    annualInterestPct: -5,
    months: 0,
    goldShockPct: -100,
    capPct: 150,
  });

  assert.ok(Number.isFinite(result.postShockMaturityLtvPct));
  assert.ok(result.collateralLakh > 0);
  assert.equal(result.principalLakh, GOLD_LOAN_STRESS_DEFAULTS.principalLakh);
});
