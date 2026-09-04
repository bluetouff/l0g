import assert from 'node:assert/strict';
import test from 'node:test';
import {
  calculateKoreaFxHedge,
  normalizeKoreaFxHedgeInputs,
} from '../src/lib/korea-fx-hedge-model.ts';

test('full hedge leaves no open FX notional', () => {
  const r = calculateKoreaFxHedge({ foreignAssetsKrwTrn: 100, hedgeRatioPct: 100 });
  assert.equal(r.coveredNotionalKrwTrn, 100);
  assert.equal(r.openNotionalKrwTrn, 0);
  assert.equal(r.openFxTranslationKrwTrn, 0);
});

test('carry decomposition is explicit', () => {
  const r = calculateKoreaFxHedge({
    foreignAssetsKrwTrn: 100,
    foreignShortRatePct: 4,
    krwShortRatePct: 2.5,
    basisBp: 20,
    executionBp: 10,
    hedgeRatioPct: 100,
    grossAssetYieldPct: 4.5,
  });
  assert.ok(Math.abs(r.indicativeHedgeCarryPct - 1.8) < 1e-12);
  assert.ok(Math.abs(r.annualHedgeCarryKrwTrn - 1.8) < 1e-12);
  assert.ok(Math.abs(r.indicativeNetYieldPct - 2.7) < 1e-12);
});

test('partial hedge exposes only the open notional to the entered FX move', () => {
  const r = calculateKoreaFxHedge({
    foreignAssetsKrwTrn: 80,
    hedgeRatioPct: 75,
    foreignCurrencyMovePct: -10,
  });
  assert.equal(r.openNotionalKrwTrn, 20);
  assert.equal(r.openFxTranslationKrwTrn, -2);
});

test('basis sign convention is explicit and symmetric', () => {
  const costly = calculateKoreaFxHedge({
    foreignShortRatePct: 4,
    krwShortRatePct: 2.5,
    basisBp: 25,
    executionBp: 0,
  });
  const beneficial = calculateKoreaFxHedge({
    foreignShortRatePct: 4,
    krwShortRatePct: 2.5,
    basisBp: -25,
    executionBp: 0,
  });
  assert.equal(costly.indicativeHedgeCarryPct, 1.75);
  assert.equal(beneficial.indicativeHedgeCarryPct, 1.25);
});

test('roll count rounds up to cover the asset life', () => {
  const r = calculateKoreaFxHedge({ assetMaturityYears: 10, hedgeTenorMonths: 18 });
  assert.equal(r.rollsOverAssetLife, 7);
});

test('inputs are bounded', () => {
  const x = normalizeKoreaFxHedgeInputs({ hedgeRatioPct: 500, hedgeTenorMonths: 0 });
  assert.equal(x.hedgeRatioPct, 100);
  assert.equal(x.hedgeTenorMonths, 1);
});
