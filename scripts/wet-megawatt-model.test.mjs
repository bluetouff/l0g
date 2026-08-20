import assert from 'node:assert/strict';
import test from 'node:test';
import {
  WET_MEGAWATT_DEFAULTS,
  calculateWetMegawatt,
  normalizeWetMegawattInputs,
} from '../src/lib/wet-megawatt-model.ts';

const closeTo = (actual, expected, tolerance = 1e-9) => {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} != ${expected}`);
};

test('zero thermal assumption reproduces the documented hydro plus nuclear floor', () => {
  const result = calculateWetMegawatt({ thermalWaterCooledSharePct: 0 });
  closeTo(result.knownFloorGW, 294.3);
  closeTo(result.waterCoupledCapacityGW, 294.3);
  closeTo(result.waterCoupledSharePct, 294.3 / 1_040.2 * 100);
  closeTo(result.addedPerPercentagePointGW, 3.196);
});

test('default 50 percent scenario applies the accounting identity', () => {
  const result = calculateWetMegawatt();
  closeTo(result.classifiedThermalGW, 159.8);
  closeTo(result.unclassifiedThermalGW, 159.8);
  closeTo(result.waterCoupledCapacityGW, 454.1);
  closeTo(result.waterCoupledSharePct, 454.1 / 1_040.2 * 100);
});

test('full thermal classification reaches 613.9 GW without exceeding total capacity', () => {
  const result = calculateWetMegawatt({ thermalWaterCooledSharePct: 100 });
  closeTo(result.classifiedThermalGW, 319.6);
  closeTo(result.unclassifiedThermalGW, 0);
  closeTo(result.waterCoupledCapacityGW, 613.9);
  assert.ok(result.waterCoupledSharePct < 100);
});

test('untrusted input is clamped and invalid input falls back', () => {
  assert.equal(normalizeWetMegawattInputs({ thermalWaterCooledSharePct: 500 }).thermalWaterCooledSharePct, 100);
  assert.equal(normalizeWetMegawattInputs({ thermalWaterCooledSharePct: -2 }).thermalWaterCooledSharePct, 0);
  assert.equal(normalizeWetMegawattInputs({ thermalWaterCooledSharePct: Number.NaN }).thermalWaterCooledSharePct, WET_MEGAWATT_DEFAULTS.thermalWaterCooledSharePct);
});
