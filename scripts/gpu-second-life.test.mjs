import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateGpuSecondLife, gpuSecondLifeFields } from '../src/lib/gpu-second-life.mjs';

const initial = Object.fromEntries(gpuSecondLifeFields.map(({ key, initial }) => [key, initial]));
const scenario = (overrides = {}) => calculateGpuSecondLife({ ...initial, ...overrides });

test('the example moves the timing of reported profit while preserving the net equipment cost', () => {
  assert.deepEqual(scenario(), {
    bookAtRevision: 80,
    originalAnnual: 20,
    revisedAnnual: 40,
    originalBookAtSale: 40,
    revisedBookAtSale: 0,
    originalSaleResult: -28,
    revisedSaleResult: 12,
    netCost: 108,
  });
});

test('a sale on the revision date has the same carrying amount under either schedule', () => {
  const result = scenario({ saleYear: 2 });
  assert.equal(result.originalBookAtSale, 80);
  assert.equal(result.revisedBookAtSale, 80);
  assert.equal(result.originalSaleResult, result.revisedSaleResult);
});

test('fractional useful lives stay prospective and future book values stay non-negative', () => {
  const result = scenario({ revisedLife: 4.5, saleYear: 3.5 });
  assert.equal(result.revisedAnnual, 32);
  assert.equal(result.revisedBookAtSale, 32);
  assert.equal(result.revisedSaleResult, -20);
  const lateSale = scenario({ revisedLife: 4.5, saleYear: 10, salePrice: 0 });
  assert.equal(lateSale.originalBookAtSale, 0);
  assert.equal(lateSale.revisedBookAtSale, 0);
  assert.equal(lateSale.netCost, 120);
});

test('invalid numeric values, impossible dates and missing fields leave the result unavailable', () => {
  const invalid = [
    { cost: 0 }, { cost: Infinity }, { cost: 1_000_001 }, { cost: '120' },
    { originalLife: 0 }, { originalLife: 51 }, { revisedLife: 2 },
    { revisionYear: 0 }, { revisionYear: 1.5 }, { revisionYear: 6 },
    { saleYear: 1 }, { saleYear: NaN }, { salePrice: -1 }, { salePrice: undefined },
  ];
  for (const overrides of invalid) assert.equal(scenario(overrides), null, JSON.stringify(overrides));
  assert.equal(calculateGpuSecondLife(null), null);
  assert.equal(calculateGpuSecondLife({}), null);
});
