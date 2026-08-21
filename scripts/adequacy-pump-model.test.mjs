import assert from 'node:assert/strict';
import test from 'node:test';
import { ADEQUACY_PUMP_DEFAULTS, ADEQUACY_PUMP_PRESETS, evaluateAdequacyPump, normalizeAdequacyPumpInputs } from '../src/lib/adequacy-pump-model.ts';

test('default basin shock distinguishes zonal recovery from a local deficit', () => {
  const result = evaluateAdequacyPump(ADEQUACY_PUMP_DEFAULTS);
  assert.equal(result.baselineMarginMw, 1000);
  assert.equal(result.postWaterMarginMw, -500);
  assert.equal(result.finalZoneMarginMw, 100);
  assert.equal(result.localAccessibleImportsMw, 700);
  assert.equal(result.finalLocalMarginMw, -200);
  assert.equal(result.dualVerdict, 'measures-local-deficit');
});

test('comfortable preset remains positive before additional measures', () => {
  const result = evaluateAdequacyPump(ADEQUACY_PUMP_PRESETS.comfortable);
  assert.equal(result.finalZoneMarginMw, 900);
  assert.equal(result.finalLocalMarginMw, 475);
  assert.equal(result.zoneVerdict, 'positive-before-measures');
  assert.equal(result.dualVerdict, 'positive');
});

test('limited imports preset produces a zonal deficit', () => {
  const result = evaluateAdequacyPump(ADEQUACY_PUMP_PRESETS.limitedImports);
  assert.equal(result.finalZoneMarginMw, -1150);
  assert.equal(result.dualVerdict, 'zone-deficit');
});

test('untrusted values are normalized and bounded', () => {
  const normalized = normalizeAdequacyPumpInputs({ zoneDemandMw: -1, importCapacityMw: Number.NaN, localImportSharePct: 130 });
  assert.equal(normalized.zoneDemandMw, 0);
  assert.equal(normalized.importCapacityMw, ADEQUACY_PUMP_DEFAULTS.importCapacityMw);
  assert.equal(normalized.localImportSharePct, 100);
});
