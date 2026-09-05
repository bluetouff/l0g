import assert from 'node:assert/strict';
import test from 'node:test';
import {
  CHINA_EXTERNAL_LAYERS,
  compareChinaExternalLayers,
  getChinaExternalLayer,
} from '../src/lib/china-external-balance-sheet-lens-model.ts';

test('direct and portfolio investment are additive components', () => {
  const result = compareChinaExternalLayers('iip-direct-2026q1', 'iip-portfolio-2026q1');
  assert.equal(result.relation, 'disjoint_additive');
  assert.equal(result.canAdd, true);
  assert.ok(Math.abs(result.calculatedValue - 5651.8) < 1e-9);
});

test('assets and liabilities can be netted but official rounding differs', () => {
  const result = compareChinaExternalLayers('iip-assets-2026q1', 'iip-liabilities-2026q1');
  assert.equal(result.relation, 'nettable');
  assert.ok(Math.abs(result.calculatedValue - 4006.1) < 1e-9);
  assert.equal(result.officialReference, 4006.0);
  assert.ok(Math.abs(result.roundingGap - 0.1) < 1e-9);
});

test('reserve assets cannot be added to the IIP total', () => {
  const result = compareChinaExternalLayers('iip-assets-2026q1', 'iip-reserves-2026q1');
  assert.equal(result.relation, 'component_overlap');
  assert.equal(result.canAdd, false);
});

test('bank external assets overlap the national IIP total', () => {
  const result = compareChinaExternalLayers('iip-assets-2026q1', 'banks-assets-2026q1');
  assert.equal(result.relation, 'subset_overlap');
});

test('US survey and SAFE non-reserve destination data are not comparable totals', () => {
  const result = compareChinaExternalLayers('us-securities-mainland-2025', 'nonreserve-us-2025');
  assert.equal(result.relation, 'not_comparable');
});

test('IIP reserve assets and monthly FX reserves differ by date and definition', () => {
  const result = compareChinaExternalLayers('iip-reserves-2026q1', 'fx-reserves-2026m7');
  assert.equal(result.relation, 'scope_or_date_mismatch');
});

test('insurance and bank totals use incompatible units', () => {
  const result = compareChinaExternalLayers('insurance-assets-2026q2', 'banks-assets-2026q1');
  assert.equal(result.relation, 'unit_mismatch');
});

test('unknown identifiers fall back safely', () => {
  assert.equal(getChinaExternalLayer('missing').id, CHINA_EXTERNAL_LAYERS[0].id);
});
