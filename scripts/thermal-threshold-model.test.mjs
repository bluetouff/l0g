import assert from 'node:assert/strict';
import test from 'node:test';
import {
  THERMAL_THRESHOLD_DEFAULTS,
  evaluateThermalThreshold,
  normalizeThermalThresholdInputs,
} from '../src/lib/thermal-threshold-model.ts';

test('Bugey normal, CCE and temporary decision remain distinct', () => {
  const normal = evaluateThermalThreshold(THERMAL_THRESHOLD_DEFAULTS);
  assert.deepEqual([normal.regime, normal.downstream, normal.delta], ['normal', '≤ 26 °C', '≤ 5 °C']);

  const cce = evaluateThermalThreshold({ ...THERMAL_THRESHOLD_DEFAULTS, rteRequired: true });
  assert.deepEqual([cce.regime, cce.downstream, cce.delta], ['cce', '≤ 27 °C', '≤ 1 °C']);

  const temporary = evaluateThermalThreshold({
    ...THERMAL_THRESHOLD_DEFAULTS, rteRequired: true, temporaryBugeyDecision: true,
  });
  assert.deepEqual([temporary.regime, temporary.downstream, temporary.delta, temporary.scope], [
    'exceptional', 'Projected ≤ 28 °C', '≤ 1 °C', 'bugey45',
  ]);
});

test('temporary Bugey decision fails closed outside its dates or without RTE', () => {
  const outside = evaluateThermalThreshold({
    site: 'bugey', date: '2026-07-21', rteRequired: true, temporaryBugeyDecision: true,
  });
  assert.equal(outside.regime, 'cce');
  assert.equal(outside.contextStatus, 'outside');

  const withoutRte = evaluateThermalThreshold({
    site: 'bugey', date: '2026-07-15', rteRequired: false, temporaryBugeyDecision: true,
  });
  assert.equal(withoutRte.regime, 'normal');
  assert.equal(withoutRte.contextStatus, 'needsRte');
});

test('Tricastin changes rule at the published 480 cubic metre threshold', () => {
  const below = evaluateThermalThreshold({ site: 'tricastin', canalFlowM3s: 479 });
  const boundary = evaluateThermalThreshold({ site: 'tricastin', canalFlowM3s: 480 });
  assert.equal(below.delta, '≤ 6 °C');
  assert.equal(boundary.delta, '≤ 4 °C');
});

test('Saint-Alban CCE does not invent a delta absent from the selected dataset', () => {
  const result = evaluateThermalThreshold({ site: 'saintalban', rteRequired: true });
  assert.equal(result.downstream, '≤ 29 °C');
  assert.equal(result.delta, 'Not specified');
});

test('untrusted values are normalized and bounded', () => {
  assert.deepEqual(normalizeThermalThresholdInputs({
    site: 'unknown', date: '2026-02-31', canalFlowM3s: 9_000,
  }), {
    ...THERMAL_THRESHOLD_DEFAULTS,
    canalFlowM3s: 5_000,
  });
});
