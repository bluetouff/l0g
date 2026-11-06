import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync, readdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { BYD_FINANCING_KINDS, bydFinancingScenes, inspectBydFinancingSvg, assertBydFinancingGeometry, tag, attrs, content } from './byd-financing-svg-assertions.mjs';
import { assertFontLicenseReferences } from './font-license-assertions.mjs';

const scenes = bydFinancingScenes();
const read = file => readFileSync(new URL('../' + file, import.meta.url), 'utf8');
const all = scene => inspectBydFinancingSvg(scene.svg).all;
const metric = (scene, name) => all(scene).filter(node => attrs(node)['data-metric'] === name);
const words = scene => all(scene).filter(node => ['text', 'title', 'desc'].includes(tag(node))).map(content).join(' ');

test('twelve passive scenes preserve exact-font geometry, regular weights and semantic l0g colours', () => {
  assert.equal(scenes.length, 12);
  assert.equal(readdirSync(new URL('../src/figures/byd-financing-2026/', import.meta.url)).length, 12);
  const ids = [];
  for (const scene of scenes) {
    assertBydFinancingGeometry(scene.svg);
    assert.doesNotMatch(scene.svg, /<script|foreignObject|—|#[a-f0-9]{3,8}\b|(?:deux|2) horloges|two clocks|mérite mieux que|deserves better than/iu);
    for (const node of all(scene)) {
      const a = attrs(node);
      if (a.id) ids.push(a.id);
      if (tag(node) === 'text') {
        assert.equal(a['font-weight'], '400');
        assert.ok(Number(a['font-size']) * (scene.mobile ? 280 / 420 : 501 / 1000) >= 12);
      }
      if (tag(node) === 'title') assert.doesNotMatch(content(node), /\bce (?:qui|que|qu[’'])|\bwhat\b|, pas |, not /iu);
    }
  }
  assert.equal(ids.length, new Set(ids).size);
});

test('the cash waterfall exactly reconciles whole CNY and uses proportional floating bars', () => {
  const values = [68395197000, 54469572000, -68857389000, -23081574000, -1144273000, 29781533000];
  const steps = ['opening', 'operating', 'investing', 'financing', 'fx', 'closing'];
  const starts = [0, values[0], values[0] + values[1], values[0] + values[1] + values[2], values[0] + values[1] + values[2] + values[3], 0];
  const ends = [values[0], ...[2, 3, 4, 5].map(length => values.slice(0, length).reduce((sum, v) => sum + v, 0)), values[5]];
  assert.equal(values.slice(0, 5).reduce((sum, value) => sum + value, 0), values[5]);
  for (const scene of scenes.filter(scene => scene.kind === 'cash')) {
    const bars = metric(scene, 'cash-flow');
    assert.deepEqual(bars.map(node => attrs(node)['data-step']), steps);
    assert.deepEqual(bars.map(node => Number(attrs(node)['data-value'])), values);
    assert.deepEqual(bars.map(node => Number(attrs(node)['data-start'])), starts);
    assert.deepEqual(bars.map(node => Number(attrs(node)['data-end'])), ends);
    for (const [i, node] of bars.entries()) {
      const a = attrs(node); assert.equal(a['data-unit'], 'CNY');
      const scale = scene.mobile ? 2.9e-9 : 2.1e-9;
      assert.ok(Math.abs(Number(a[scene.mobile ? 'width' : 'height']) - Math.abs(ends[i] - starts[i]) * scale) < 1e-8);
      const expected = scene.mobile ? 24 + Math.min(starts[i], ends[i]) * scale : 500 - Math.max(starts[i], ends[i]) * scale;
      assert.ok(Math.abs(Number(a[scene.mobile ? 'x' : 'y']) - expected) < 1e-8);
    }
    assert.match(words(scene), /2026/);
    assert.match(words(scene), scene.lang === 'fr' ? /mondial|consolidé/ : /Worldwide|Consolidated/);
    assert.match(words(scene), scene.lang === 'fr' ? /non audité/i : /unaudited/i);
    assert.match(words(scene), scene.lang === 'fr' ? /équivalents/ : /equivalents/);
  }
});

test('supplier claims remain distinct from cash and the single-company outstanding stock', () => {
  for (const scene of scenes.filter(scene => scene.kind === 'supplier')) {
    assert.deepEqual(metric(scene, 'goods-flow').map(node => [attrs(node)['data-from'], attrs(node)['data-to']]), [['supplier', 'byd']]);
    assert.deepEqual(metric(scene, 'claim-flow').map(node => [attrs(node)['data-from'], attrs(node)['data-to']]), [['byd', 'supplier']]);
    assert.deepEqual(metric(scene, 'claim-option').map(node => [attrs(node)['data-from'], attrs(node)['data-to'], attrs(node)['data-mode']]), [['holder', 'maturity', 'hold'], ['holder', 'partner', 'transfer'], ['holder', 'financier', 'finance']]);
    const stock = metric(scene, 'supplier-outstanding'); assert.equal(stock.length, 1);
    assert.equal(Number(attrs(stock[0])['data-value']), Math.round(18325.62 * 10000));
    assert.equal(attrs(stock[0])['data-unit'], 'CNY'); assert.equal(attrs(stock[0])['data-date'], '2026-03-31');
    assert.match(words(scene), /001380\.SZ/);
    assert.match(words(scene), scene.lang === 'fr' ? /Aucun échu impayé déclaré/ : /No overdue unpaid sum reported/);
    assert.match(words(scene), scene.lang === 'fr' ? /Si accepté|Si un partenaire accepte/ : /If accepted|If a partner accepts/);
  }
});

test('forty-nine payment ranks retain the conditional first-rental split and exact customer total', () => {
  for (const scene of scenes.filter(scene => scene.kind === 'lease')) {
    const payments = metric(scene, 'rental-payment'); assert.equal(payments.length, 50);
    assert.deepEqual(payments.slice(0, 2).map(node => [attrs(node)['data-rank'], attrs(node)['data-payer'], Number(attrs(node)['data-value'])]), [['1', 'customer', 1500], ['1', 'cee', 365]]);
    assert.deepEqual(payments.slice(2).map(node => Number(attrs(node)['data-rank'])), Array.from({ length: 48 }, (_, i) => i + 2));
    const scale = scene.mobile ? .105 : .12;
    for (const node of payments) {
      const a = attrs(node); assert.equal(a['data-unit'], 'EUR');
      if (a['data-rank'] !== '1') { assert.equal(a['data-payer'], 'customer'); assert.equal(a['data-value'], '219'); }
      assert.ok(Math.abs(Number(a.height) - Number(a['data-value']) * scale) < 1e-8);
    }
    const customer = payments.filter(node => attrs(node)['data-payer'] === 'customer').reduce((sum, node) => sum + Number(attrs(node)['data-value']), 0);
    assert.equal(customer, 12012); assert.equal(payments.reduce((sum, node) => sum + Number(attrs(node)['data-value']), 0), 12377);
    const total = metric(scene, 'rental-total'); assert.equal(total.length, 1); assert.equal(attrs(total[0])['data-value'], '12012'); assert.equal(attrs(total[0])['data-unit'], 'EUR');
    assert.match(words(scene), scene.lang === 'fr' ? /Rangs des échéances/ : /Payment ranks/);
    assert.match(words(scene), scene.lang === 'fr' ? /si éligible|client éligible/ : /if eligible|eligible customer/);
    assert.match(words(scene), /40(?:\s*|,)000/);
    assert.doesNotMatch(words(scene), /taux d’intérêt|interest rate|valeur résiduelle.*\d|residual value.*\d/iu);
  }
});

test('the component uses controlled variants, existing licensed fonts and adjacent source scopes', () => {
  const component = read('src/components/BydFinancingFigure.astro');
  assertFontLicenseReferences(read('public/fonts/ukraine-reparations/LICENSE.txt'), 'liberation');
  for (const kind of BYD_FINANCING_KINDS) for (const lang of ['fr', 'en']) for (const mode of ['desktop', 'mobile']) assert.ok(component.includes(`../figures/byd-financing-2026/${kind}.${lang}.${mode}.svg?raw`));
  assert.match(component, /Object\.prototype\.hasOwnProperty\.call\(captions, kind\)/);
  assert.match(component, /@container \(max-width: 500px\)/); assert.match(component, /max-width: 340px/); assert.match(component, /padding-bottom: 1rem/);
  assert.doesNotMatch(component, /overflow\s*:\s*hidden|Arial|Helvetica|font-weight:\s*700/);
  assert.match(component, /\/fonts\/ukraine-reparations\/liberation-sans-400\.ttf/);
  assert.match(component, /href=\{`#source-\$\{id\}`\}/);
});

test('geometry guards reject active input, false metrics, missing regions and frame escape', () => {
  const svg = scenes[0].svg;
  for (const altered of [svg.replace('</svg>', '<script>alert(1)</script></svg>'), svg.replace('<svg ', '<svg onload="x" '), svg.replace('<svg ', '<svg href="https://example.invalid/" '), svg.replace('font-weight="400"', 'font-weight="700"'), svg.replace('data-panel="byd-cash-fr-d-header"', 'data-panel="missing"'), svg.replace('x="24" y="88"', 'x="990" y="88"'), svg.replace('data-metric="cash-flow"', 'data-metric="unknown"')]) assert.throws(() => assertBydFinancingGeometry(altered));
});

test('long malformed path numbers fail within a bounded process', () => {
  const script = `import{assertBydFinancingGeometry,bydFinancingScenes}from'./scripts/byd-financing-svg-assertions.mjs';const s=bydFinancingScenes()[0].svg.replace(/d="M[^\"]+"/u,'d="M'+'1'.repeat(8000)+' 1 L2 2"');try{assertBydFinancingGeometry(s);process.exit(1)}catch{process.exit(0)}`;
  const child = spawnSync(process.execPath, ['--input-type=module', '-e', script], { cwd: new URL('../', import.meta.url), timeout: 1500, encoding: 'utf8' });
  assert.ifError(child.error); assert.equal(child.status, 0, child.stderr);
});
