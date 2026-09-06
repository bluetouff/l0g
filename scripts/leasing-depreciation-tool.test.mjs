import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import vm from 'node:vm';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const modelSource = readFileSync(`${ROOT}public/outils/leasing-decote/model.js`, 'utf8');
const modelModule = { exports: {} };
vm.runInNewContext(modelSource, { module: modelModule, globalThis: {} }, { filename: 'model.js' });
const model = modelModule.exports;

const closeTo = (actual, expected) => assert.ok(
  Math.abs(actual - expected) <= 1e-9 * Math.max(1, Math.abs(actual), Math.abs(expected)),
  `${actual} != ${expected}`,
);

test('leasing depreciation model preserves the documented examples', () => {
  const result = model.evaluate(model.defaults);
  closeTo(result.a.depreciation, 12_000);
  closeTo(result.a.monthly, 333.3333333333333);
  closeTo(result.b.depreciation, 15_000);
  closeTo(result.b.monthly, 416.6666666666667);
  closeTo(result.monthlyDifference, 83.33333333333333);
  closeTo(result.resaleThresholdB, 15_000);
  closeTo(result.per1000Monthly, 27.77777777777778);
  assert.equal(result.thresholdFeasible, true);
});

test('leasing depreciation model keeps purchase, resale and term boundaries explicit', () => {
  const zeroDepreciation = model.evaluate({ ...model.defaults, resaleB: model.defaults.purchaseB });
  closeTo(zeroDepreciation.b.monthly, 0);

  const zeroResale = model.evaluate({ ...model.defaults, resaleB: 0 });
  closeTo(zeroResale.b.depreciation, model.defaults.purchaseB);

  const noThreshold = model.evaluate({ purchaseA: 1_000_000, resaleA: 0, purchaseB: 1, resaleB: 0, months: 120 });
  assert.equal(noThreshold.thresholdFeasible, false);

  for (const value of [undefined, null, '36', '', Number.NaN, Infinity, -Infinity]) {
    assert.throws(() => model.evaluate({ ...model.defaults, months: value }));
  }
  for (const months of [0, 2.5, 121]) {
    assert.throws(() => model.evaluate({ ...model.defaults, months }));
  }
  assert.throws(() => model.evaluate({ ...model.defaults, purchaseA: 0 }));
  assert.throws(() => model.evaluate({ ...model.defaults, resaleA: -1 }));
  assert.throws(() => model.evaluate({ ...model.defaults, resaleA: model.defaults.purchaseA + 1 }));
});

test('leasing depreciation model satisfies deterministic accounting identities', () => {
  let seed = 67_092_026;
  const random = () => {
    seed = (1_664_525 * seed + 1_013_904_223) >>> 0;
    return seed / 4_294_967_296;
  };

  for (let index = 0; index < 2_000; index += 1) {
    const months = 1 + Math.floor(random() * 120);
    const purchaseA = 1 + Math.floor(random() * 1_000_000);
    const purchaseB = 1 + Math.floor(random() * 1_000_000);
    const resaleA = random() * purchaseA;
    const resaleB = random() * purchaseB;
    const input = { purchaseA, resaleA, purchaseB, resaleB, months };
    const result = model.evaluate(input);
    closeTo(result.a.depreciation, purchaseA - resaleA);
    closeTo(result.b.depreciation, purchaseB - resaleB);
    closeTo(result.a.monthly * months, result.a.depreciation);
    closeTo(result.b.monthly * months, result.b.depreciation);
    closeTo(result.monthlyDifference * months, result.depreciationDifference);
    closeTo(result.resaleThresholdB, purchaseB - result.a.depreciation);
    assert.deepEqual(input, { purchaseA, resaleA, purchaseB, resaleB, months });
  }
});

test('leasing tool is local-only and ships a restrictive document policy', () => {
  const html = readFileSync(`${ROOT}public/outils/leasing-decote/index.html`, 'utf8');
  const script = readFileSync(`${ROOT}public/outils/leasing-decote/tool-ui.js`, 'utf8');
  const css = readFileSync(`${ROOT}public/outils/leasing-decote/tool.css`, 'utf8');

  assert.match(html, /<link\s+rel="canonical"\s+href="https:\/\/l0g\.fr\/outils\/leasing-decote\/"\s*\/?>/u);
  assert.match(html, /Content-Security-Policy[^>]+connect-src 'none'/u);
  assert.match(html, /script-src-attr 'none'/u);
  assert.match(html, /frame-src 'none'/u);
  assert.match(html, /worker-src 'none'/u);
  assert.match(html, /manifest-src 'none'/u);
  assert.match(html, /object-src 'none'/u);
  assert.match(html, /base-uri 'none'/u);
  assert.match(html, /form-action 'none'/u);
  assert.match(html, /og:image:width" content="1200"/u);
  assert.match(html, /og:image:height" content="630"/u);
  assert.match(html, /twitter:card" content="summary_large_image"/u);
  assert.doesNotMatch(`${script}\n${modelSource}`, /\b(?:fetch|XMLHttpRequest|WebSocket|EventSource|sendBeacon|localStorage|sessionStorage|indexedDB|document\.cookie|eval|Function)\b/u);
  assert.doesNotMatch(`${script}\n${modelSource}`, /\b(?:innerHTML|outerHTML|insertAdjacentHTML|document\.write)\b/u);
  assert.doesNotMatch(`${script}\n${modelSource}`, /https?:\/\//u);
  assert.doesNotMatch(css, /(?:^|[;{])\s*width\s*:\s*100vw\b/u);
});
