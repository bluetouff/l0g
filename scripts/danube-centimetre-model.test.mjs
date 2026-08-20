import assert from 'node:assert/strict';
import test from 'node:test';
import {
  DANUBE_CENTIMETRE_DEFAULTS,
  calculateDanubeCentimetre,
  normalizeDanubeCentimetreInputs,
} from '../src/lib/danube-centimetre-model.ts';

const closeTo = (actual, expected, tolerance = 1e-9) => {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} != ${expected}`);
};

test('default one-day Cernavoda scenario follows the visible identities', () => {
  const result = calculateDanubeCentimetre();
  assert.equal(result.energyMWh, 16_920);
  closeTo(result.energyGWh, 16.92);
  assert.equal(result.grossAvoidedCostEur, 2_538_000);
  assert.equal(result.grossValuePerCmEur, 507_600);
  closeTo(result.breakEvenHours, 94.56264775413712);
  assert.equal(result.netBalanceEur, -7_462_000);
  assert.equal(result.interventionRecovered, false);
});
test('the brief example remains reproducible when the reader enters 680 MW', () => {
  const result = calculateDanubeCentimetre({
    capacityMW: 680,
    durationHours: 24,
    replacementPriceEurMWh: 150,
  });
  assert.equal(result.energyMWh, 16_320);
  assert.equal(result.grossAvoidedCostEur, 2_448_000);
});

test('break-even is null when maintained capacity or replacement price is zero', () => {
  assert.equal(calculateDanubeCentimetre({ capacityMW: 0 }).breakEvenHours, null);
  assert.equal(calculateDanubeCentimetre({ replacementPriceEurMWh: 0 }).breakEvenHours, null);
});

test('untrusted values are clamped and invalid values fall back', () => {
  const normalized = normalizeDanubeCentimetreInputs({
    capacityMW: 99_000,
    durationHours: -10,
    replacementPriceEurMWh: Number.NaN,
    localLiftCm: 0,
    interventionCostEur: Number.POSITIVE_INFINITY,
  });
  assert.equal(normalized.capacityMW, 5_000);
  assert.equal(normalized.durationHours, 0);
  assert.equal(normalized.replacementPriceEurMWh, DANUBE_CENTIMETRE_DEFAULTS.replacementPriceEurMWh);
  assert.equal(normalized.localLiftCm, 0.1);
  assert.equal(normalized.interventionCostEur, DANUBE_CENTIMETRE_DEFAULTS.interventionCostEur);
});
