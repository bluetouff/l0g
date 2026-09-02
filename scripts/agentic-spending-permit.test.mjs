import assert from 'node:assert/strict';
import test from 'node:test';
import { assessSpendingPermit, validateSpendingPermit } from '../src/lib/agentic-spending-permit.ts';

const base = {
  executionMode: 'autonomous',
  totalBudget: 100,
  perPurchaseCap: 35,
  durationDays: 7,
  confirmationPolicy: 'threshold',
  confirmationThreshold: 30,
  merchantPolicy: 'known',
  subscriptionsAllowed: false,
  recurringAllowed: false,
  substitutionPolicy: 'never',
  productCondition: 'new',
  rankingPriority: 'total-price',
  budgetIncludesFees: true,
  returnRequired: true,
  dataPermissions: ['address'],
};

test('threshold scenario exposes the aggregate budget and a minimum transaction count', () => {
  const result = assessSpendingPermit(base);
  assert.equal(result.valid, true);
  assert.equal(result.maxAutomaticSpend, 100);
  assert.equal(result.minAutomaticTransactionsToExhaustBudget, 4);
});

test('requiring approval for every purchase removes automatic capacity', () => {
  const result = assessSpendingPermit({ ...base, confirmationPolicy: 'every' });
  assert.equal(result.maxAutomaticSpend, 0);
  assert.equal(result.minAutomaticTransactionsToExhaustBudget, 0);
});

test('non-autonomous modes never receive automatic capacity', () => {
  const result = assessSpendingPermit({ ...base, executionMode: 'approve', confirmationPolicy: 'none' });
  assert.equal(result.level, 2);
  assert.equal(result.maxAutomaticSpend, 0);
  assert.equal(result.minAutomaticTransactionsToExhaustBudget, 0);
});

test('invalid numeric inputs cannot produce plausible automatic capacity', () => {
  const result = assessSpendingPermit({ ...base, perPurchaseCap: 101 });
  assert.equal(result.valid, false);
  assert.ok(result.flags.includes('purchase-cap-invalid'));
  assert.equal(result.maxAutomaticSpend, 0);
  assert.equal(result.minAutomaticTransactionsToExhaustBudget, 0);
});

test('validation rejects non-finite, fractional and out-of-range values', () => {
  assert.deepEqual(validateSpendingPermit({ ...base, totalBudget: Number.NaN }), ['budget-invalid']);
  assert.deepEqual(validateSpendingPermit({ ...base, durationDays: 1.5 }), ['duration-invalid']);
  assert.deepEqual(validateSpendingPermit({ ...base, confirmationThreshold: 36 }), ['threshold-invalid']);
});

test('many capped purchases are flagged as high aggregate capacity', () => {
  const result = assessSpendingPermit({
    ...base,
    totalBudget: 100,
    perPurchaseCap: 10,
    confirmationPolicy: 'none',
  });
  assert.equal(result.minAutomaticTransactionsToExhaustBudget, 10);
  assert.ok(result.flags.includes('high-aggregate-capacity'));
});
