import test from 'node:test';
import assert from 'node:assert/strict';
import { simulateRefinancing, validateRefinancingParams } from '../src/lib/sovereign-refinancing.ts';

const base = {
  stock: 3000,
  oldRate: 2,
  newRate: 4,
  slowShare: 12.5,
  fastShare: 25,
  years: 8,
};

test('default scenario reaches the expected year-four rates', () => {
  const rows = simulateRefinancing(base);
  assert.equal(rows.length, 8);
  const y4 = rows[3];
  assert.equal(y4.slowRepricedShare, 0.5);
  assert.equal(y4.fastRepricedShare, 1);
  assert.equal(y4.slowEffectiveRate, 3);
  assert.equal(y4.fastEffectiveRate, 4);
  assert.equal(y4.slowInterest, 90);
  assert.equal(y4.fastInterest, 120);
});

test('both profiles converge after full repricing', () => {
  const y8 = simulateRefinancing(base)[7];
  assert.equal(y8.slowEffectiveRate, 4);
  assert.equal(y8.fastEffectiveRate, 4);
  assert.equal(y8.slowInterest, 120);
  assert.equal(y8.fastInterest, 120);
});

test('falling yields generate negative extra interest', () => {
  const rows = simulateRefinancing({ ...base, oldRate: 4, newRate: 2, years: 4 });
  assert.ok(rows[0].slowExtraInterest < 0);
  assert.ok(rows[0].fastExtraInterest < 0);
});

test('validation rejects unsupported inputs', () => {
  assert.throws(() => validateRefinancingParams({ ...base, stock: 0 }), /stock/);
  assert.throws(() => validateRefinancingParams({ ...base, slowShare: 0 }), /slowShare/);
  assert.throws(() => validateRefinancingParams({ ...base, years: 31 }), /years/);
  assert.throws(() => validateRefinancingParams({ ...base, oldRate: Number.NaN }), /finite/);
});
