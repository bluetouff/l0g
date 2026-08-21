import assert from 'node:assert/strict';
import test from 'node:test';
import {
  RESERVOIR_ARBITRATOR_DEFAULTS,
  evaluateReservoirArbitrator,
  normalizeReservoirArbitratorInputs,
} from '../src/lib/reservoir-arbitrator-model.ts';

const closeTo = (actual, expected, tolerance = 1e-9) => {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} != ${expected}`);
};

test('reservoir scenario separates usable, withheld and unavailable energy', () => {
  const result = evaluateReservoirArbitrator(RESERVOIR_ARBITRATOR_DEFAULTS);
  closeTo(result.deductionsGWh, 25);
  closeTo(result.usableNowGWh, 75);
  closeTo(result.expectedFutureGWh, 67.5);
  closeTo(result.immediateValueMEur, 5.625);
  closeTo(result.futureValueMEur, 7.425);
  closeTo(result.futureBreakEvenEurMWh, 75 / 0.9);
  assert.equal(result.decision, 'wait');
});

test('over-allocation floors usable energy at zero and remains explicit', () => {
  const result = evaluateReservoirArbitrator({
    reportedStockGWh: 10,
    strategicReserveGWh: 8,
    nonPowerEquivalentGWh: 7,
    technicalUnavailableGWh: 2,
  });
  assert.equal(result.usableNowGWh, 0);
  assert.equal(result.overAllocationGWh, 7);
  assert.equal(result.immediateValueMEur, 0);
  assert.equal(result.futureValueMEur, 0);
  assert.equal(result.decision, 'balanced');
});

test('pumped-storage cycle applies round-trip efficiency before revenue', () => {
  const result = evaluateReservoirArbitrator({
    mode: 'pumped',
    pumpingInputGWh: 10,
    roundTripEfficiencyPct: 80,
    pumpingPriceEurMWh: 30,
    futureSalePriceEurMWh: 120,
  });
  closeTo(result.pumpedDeliverableGWh, 8);
  closeTo(result.pumpingCostMEur, 0.3);
  closeTo(result.pumpedRevenueMEur, 0.96);
  closeTo(result.pumpedMarginMEur, 0.66);
  closeTo(result.pumpedBreakEvenEurMWh, 37.5);
  assert.equal(result.decision, 'pump');
});

test('untrusted values are normalized and bounded', () => {
  const normalized = normalizeReservoirArbitratorInputs({
    mode: 'invalid',
    reportedStockGWh: -5,
    currentPriceEurMWh: Number.NaN,
    roundTripEfficiencyPct: 0,
    futureAvailabilityPct: 120,
  });
  assert.equal(normalized.mode, 'reservoir');
  assert.equal(normalized.reportedStockGWh, 0);
  assert.equal(normalized.currentPriceEurMWh, RESERVOIR_ARBITRATOR_DEFAULTS.currentPriceEurMWh);
  assert.equal(normalized.roundTripEfficiencyPct, 1);
  assert.equal(normalized.futureAvailabilityPct, 100);
});
