import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateUsefulLifeScenario } from '../src/lib/server-useful-life.ts';

const close = (actual, expected, tolerance = 1e-6) => {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} != ${expected}`);
};

test('default 10,000 dollar example is prospective after two years', () => {
  const result = calculateUsefulLifeScenario({
    cost: 10_000,
    originalLifeYears: 4,
    revisedLifeYears: 6,
    elapsedYears: 2,
  });
  close(result.originalAnnualExpense, 2_500);
  close(result.carryingAmountAtChange, 5_000);
  close(result.revisedAnnualExpense, 1_250);
  close(result.firstFullYearPretaxProfitDifference, 1_250);
  close(result.expenseMovedBeyondOriginalLife, 2_500);
  close(result.rows.reduce((sum, row) => sum + row.originalExpense, 0), 10_000);
  close(result.rows.reduce((sum, row) => sum + row.revisedExpense, 0), 10_000);
});

test('comparison from placement in service yields 1,666.67 dollars over six years', () => {
  const result = calculateUsefulLifeScenario({
    cost: 10_000,
    originalLifeYears: 4,
    revisedLifeYears: 6,
    elapsedYears: 0,
  });
  close(result.revisedAnnualExpense, 10_000 / 6);
  close(result.firstFullYearPretaxProfitDifference, 10_000 / 4 - 10_000 / 6);
});

test('shortening a life accelerates expense without changing the total', () => {
  const result = calculateUsefulLifeScenario({
    cost: 10_000,
    originalLifeYears: 6,
    revisedLifeYears: 5,
    elapsedYears: 1,
  });
  assert.ok(result.revisedAnnualExpense > result.originalAnnualExpense);
  assert.ok(result.firstFullYearPretaxProfitDifference < 0);
  close(result.rows.reduce((sum, row) => sum + row.revisedExpense, 0), 10_000);
});

test('preserves residual value under both schedules', () => {
  const result = calculateUsefulLifeScenario({
    cost: 12_000,
    residualValue: 2_000,
    originalLifeYears: 5,
    revisedLifeYears: 7,
    elapsedYears: 2,
  });
  close(result.depreciableAmount, 10_000);
  close(result.rows.at(-1).originalClosingBookValue, 2_000);
  close(result.rows.at(-1).revisedClosingBookValue, 2_000);
  close(result.rows.reduce((sum, row) => sum + row.originalExpense, 0), 10_000);
  close(result.rows.reduce((sum, row) => sum + row.revisedExpense, 0), 10_000);
});

test('rejects non-finite, fractional and invalid residual inputs', () => {
  assert.throws(() => calculateUsefulLifeScenario({
    cost: Number.NaN,
    originalLifeYears: 4,
    revisedLifeYears: 6,
    elapsedYears: 2,
  }), /cost must be finite/);
  assert.throws(() => calculateUsefulLifeScenario({
    cost: 10_000,
    originalLifeYears: 4.5,
    revisedLifeYears: 6,
    elapsedYears: 2,
  }), /originalLifeYears must be an integer/);
  assert.throws(() => calculateUsefulLifeScenario({
    cost: 10_000,
    residualValue: 10_000,
    originalLifeYears: 4,
    revisedLifeYears: 6,
    elapsedYears: 2,
  }), /residualValue must be at least zero and lower than cost/);
});

test('rejects a revised life already exhausted at the date of change', () => {
  assert.throws(() => calculateUsefulLifeScenario({
    cost: 10_000,
    originalLifeYears: 6,
    revisedLifeYears: 2,
    elapsedYears: 2,
  }), /greater than elapsedYears/);
});
