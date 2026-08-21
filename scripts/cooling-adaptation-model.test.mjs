import assert from 'node:assert/strict';
import test from 'node:test';
import {
  COOLING_QUOTE_DEFAULTS,
  COOLING_QUOTE_PRESETS,
  capitalRecoveryFactor,
  evaluateCoolingQuote,
  normalizeCoolingQuoteInputs,
} from '../src/lib/cooling-adaptation-model.ts';

test('default scenario preserves the published cost model invariants', () => {
  const result = evaluateCoolingQuote(COOLING_QUOTE_DEFAULTS);
  assert.equal(result.outageMWh, 1_872_000);
  assert.equal(result.outageCost, 187_200_000);
  assert.equal(result.auxiliaryMWh, 42_250);
  assert.equal(result.costPerKWSecured, 1_000);
  assert.ok(Math.abs(result.costPerMWhPreserved - 433.04870103876715) < 1e-9);
  assert.equal(result.withdrawalDeltaM3MWh, -67);
  assert.ok(Math.abs(result.consumptionDeltaM3MWh - 1.7) < 1e-9);
  assert.deepEqual(result.completeness, {
    securedCapacity: true, preservedEnergy: true, lifetime: true,
    replacementPrice: true, waterWithdrawal: true, waterConsumption: true,
  });
});

test('public-cost presets fail closed when denominators are undocumented', () => {
  for (const preset of [COOLING_QUOTE_PRESETS.paks, COOLING_QUOTE_PRESETS.frenchTower]) {
    const result = evaluateCoolingQuote(preset);
    assert.equal(Number.isFinite(result.costPerKWSecured), false);
    assert.equal(Number.isFinite(result.costPerMWhPreserved), false);
    assert.equal(Number.isFinite(result.annualEquivalentCost), false);
    assert.equal(result.completeness.securedCapacity, false);
    assert.equal(result.completeness.preservedEnergy, false);
    assert.equal(result.completeness.lifetime, false);
    assert.equal(result.completeness.replacementPrice, false);
  }
});

test('capital recovery handles a zero rate and rejects a missing lifetime', () => {
  assert.equal(capitalRecoveryFactor(0, 20), 0.05);
  assert.equal(Number.isFinite(capitalRecoveryFactor(4, 0)), false);
});

test('untrusted inputs are normalized and bounded', () => {
  const normalized = normalizeCoolingQuoteInputs({
    currency: 'GBP', siteCapacityMW: -1, securedCapacityMW: Number.NaN,
    discountRatePct: 90, auxiliaryHoursPerYear: 10_000, constraintDestination: 'ocean',
  });
  assert.equal(normalized.currency, COOLING_QUOTE_DEFAULTS.currency);
  assert.equal(normalized.siteCapacityMW, 0);
  assert.equal(normalized.securedCapacityMW, COOLING_QUOTE_DEFAULTS.securedCapacityMW);
  assert.equal(normalized.discountRatePct, 50);
  assert.equal(normalized.auxiliaryHoursPerYear, 8760);
  assert.equal(normalized.constraintDestination, COOLING_QUOTE_DEFAULTS.constraintDestination);
});
