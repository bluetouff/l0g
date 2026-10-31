import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import test from 'node:test';
import { GIGA_TAX_KINDS, GIGA_TAX_SOURCES, gigaTaxFigureReferences } from '../src/lib/giga-tax-figures.mjs';
import { gigaTaxScenes, inspectGigaTaxSvg, assertGigaTaxGeometry, tag, attrs, content, labelBox } from './giga-tax-svg-assertions.mjs';
import { pathPoints } from './insurance-returns-svg-assertions.mjs';
import { assertFontLicenseReferences } from './font-license-assertions.mjs';
const read = name => readFileSync(new URL('../' + name, import.meta.url), 'utf8');
const all = scene => inspectGigaTaxSvg(scene.svg).all;
const text = scene => all(scene).filter(n => tag(n) === 'text').map(content).join(' ');
const connector = (scene, id) => {
  const found = all(scene).filter(n => attrs(n)['data-connector'] === id);
  assert.equal(found.length, 1, id);
  return attrs(found[0]);
};

test('twelve passive scenes retain native copy, compact dimensions and internal-panel geometry', () => {
  const scenes = gigaTaxScenes(), ids = [];
  assert.equal(scenes.length, 12);
  assert.equal(readdirSync(new URL('../src/figures/gigabyte-tax/', import.meta.url)).length, 12);
  for (const scene of scenes) {
    assertGigaTaxGeometry(scene.svg);
    const nodes = all(scene);
    assert.equal(attrs(nodes.find(n => tag(n) === 'rect')).fill, 'var(--color-ink)');
    assert.doesNotMatch(scene.svg, /—|horlog|clock|#[0-9a-f]{3,8}\b/iu);
    assert.doesNotMatch(content(nodes.find(n => tag(n) === 'title')), /\bce (?:que|qui|qu[’'])|\bwhat\b|, pas |, not /iu);
    for (const n of nodes) {
      if (attrs(n).id) ids.push(attrs(n).id);
      if (tag(n) === 'text') assert.ok(Number(attrs(n)['font-size']) * (scene.mobile ? 280 / 420 : 501 / 1000) >= 12);
    }
  }
  assert.equal(ids.length, new Set(ids).size);
});

test('the proposed collection mechanism separates data, aggregate reports, payment and contingent incidence', () => {
  for (const scene of gigaTaxScenes().filter(s => s.kind === 'flow')) {
    for (const id of ['data-to-access', 'data-to-subscriber', 'measured-volumes']) {
      assert.equal(connector(scene, id).stroke, 'var(--color-signal)');
      assert.equal(connector(scene, id)['stroke-dasharray'], undefined);
    }
    assert.equal(connector(scene, 'tax-payment').stroke, 'var(--color-amber)');
    assert.equal(connector(scene, 'possible-incidence').stroke, 'var(--color-accent)');
    assert.equal(connector(scene, 'possible-incidence')['stroke-dasharray'], '7 7');
    assert.match(text(scene), scene.lang === 'fr' ? /effets possibles/ : /possible effects/);
    assert.match(content(all(scene).find(n => tag(n) === 'desc')), scene.lang === 'fr' ? /répartition dépend du marché/ : /distribution depends on the market/);
  }
});

test('cache bands preserve the Arcep normalised 1:11 volume ratio and outbound assessment point', () => {
  for (const scene of gigaTaxScenes().filter(s => s.kind === 'cache')) {
    const input = connector(scene, 'cache-input-band'), output = connector(scene, 'cache-output-band');
    assert.equal(input['data-value'], '1'); assert.equal(output['data-value'], '11');
    const ip = pathPoints(input.d), op = pathPoints(output.d);
    const inputThickness = scene.mobile ? ip[1][0] - ip[0][0] : ip.at(-2)[1] - ip[0][1];
    const outputThickness = scene.mobile ? op[1][0] - op[0][0] : op.at(-2)[1] - op[0][1];
    assert.equal(outputThickness / inputThickness, 11);
    const value = text(scene), description = content(all(scene).find(n => tag(n) === 'desc'));
    for (const t of ['Arcep', '2025', '11/1', '8/1', '23/1']) assert.ok(value.includes(t));
    assert.match(description, scene.lang === 'fr' ? /volumes, et non des requêtes individuelles/ : /volume ratio, not individual requests/);
    assert.match(description, scene.lang === 'fr' ? /somme des flux sortant du CDN/ : /sum of flows leaving the CDN/);
    assert.equal(connector(scene, 'tax-bracket').stroke, 'var(--color-accent)');
  }
});

test('the illustrative cap curve keeps the stated rate, unchanged revenue, exact breakpoint and flat marginal amount', () => {
  for (const scene of gigaTaxScenes().filter(s => s.kind === 'cap')) {
    const raw = connector(scene, 'gross-tax'), cap = connector(scene, 'capped-tax');
    assert.equal(raw['data-value'], '0.055'); assert.equal(cap['data-value'], '150000');
    const [start, stop] = pathPoints(raw.d), [cstart, pivot, flatEnd] = pathPoints(cap.d);
    assert.deepEqual(start, cstart); assert.equal(pivot[1], flatEnd[1]); assert.equal(flatEnd[0], stop[0]);
    const fraction = (pivot[0] - start[0]) / (stop[0] - start[0]);
    assert.ok(Math.abs(fraction * 4e6 - 150000 / 0.055) < 1e-6);
    assert.ok(Math.abs((start[1] - pivot[1]) / (start[1] - stop[1]) - 150000 / (4e6 * 0.055)) < 1e-12);
    const description = content(all(scene).find(n => tag(n) === 'desc'));
    assert.match(description, scene.lang === 'fr' ? /fictif/ : /hypothetical/);
    assert.match(description, scene.lang === 'fr' ? /constant/ : /constant/);
    assert.match(description, scene.lang === 'fr' ? /aussi 2 %/ : /also mentions 2%/);
    assert.match(description, scene.lang === 'fr' ? /ne tranche pas l’articulation juridique/ : /does not determine how the legal alternatives interact/);
    assert.ok(text(scene).includes('15 %') || text(scene).includes('15%'));
  }
});

test('closed figure metadata rejects unknown scenes, reordered sources and missing context', () => {
  for (const lang of ['fr', 'en']) for (const [i, kind] of GIGA_TAX_KINDS.entries()) assert.deepEqual(gigaTaxFigureReferences(lang, kind, i + 1, [...GIGA_TAX_SOURCES[i]], 'Caption', 'Method'), GIGA_TAX_SOURCES[i]);
  for (const lang of [undefined, null, {}, new String('fr'), '__proto__']) assert.throws(() => gigaTaxFigureReferences(lang, 'flow', 1, GIGA_TAX_SOURCES[0], 'Caption', 'Method'));
  for (const refs of [[], ['S01'], ['S03', 'S01'], ['S01', 'S03" onload="x']]) assert.throws(() => gigaTaxFigureReferences('fr', 'flow', 1, refs, 'Caption', 'Method'));
  assert.throws(() => gigaTaxFigureReferences('fr', 'cap', 2, GIGA_TAX_SOURCES[2], 'Caption', 'Method'));
  assert.throws(() => gigaTaxFigureReferences('fr', 'cache', 2, GIGA_TAX_SOURCES[1], '', 'Method'));
  assert.throws(() => gigaTaxFigureReferences('fr', 'cache', 2, GIGA_TAX_SOURCES[1], 'Caption', ''));
});

test('geometry rejects active content, external references, unsupported fonts, overlap and panel misassignment', () => {
  const scene = gigaTaxScenes().find(s => s.lang === 'fr' && s.kind === 'flow' && !s.mobile).svg;
  const mutations = [
    svg => svg.replace('</svg>', '<script>x</script></svg>'),
    svg => svg.replace('<svg ', '<svg onload="x" '),
    svg => svg.replace('</svg>', '<image href="https://example.com/a"/></svg>'),
    svg => svg.replace('l0g Giga Tax', 'Arial'),
    svg => svg.replace('data-panel="giga-fr-flow-d-card-issuer"', 'data-panel="missing"'),
    svg => svg.replace('x="40" y="48"', 'x="995" y="48"'),
    svg => svg.replace('Fournit le contenu', 'Fournit le contenu et une longue étiquette débordante'),
  ];
  for (const mutate of mutations) { const changed = mutate(scene); assert.notEqual(changed, scene); assert.throws(() => assertGigaTaxGeometry(changed)); }
  assert.ok(all({svg: scene}).filter(n => tag(n) === 'text').every(n => labelBox(n).x2 > labelBox(n).x1));
});

test('the component preserves exact licensed fonts, responsive scenes, source links and trailing space', () => {
  const component = read('src/components/GigaTaxFigure.astro');
  for (const weight of [400, 700]) {
    const name = 'public/fonts/stablecoins/dejavu-sans-' + weight + '.ttf';
    assert.ok(component.includes(name.replace('public', '')));
    assert.equal(createHash('sha256').update(readFileSync(new URL('../' + name, import.meta.url))).digest('hex'), weight === 400 ? '98f2d74db16bb5f41f74adf6d899aeec92861682cccc58bfdbe4d9d7d0a5ae11' : '21a0350a4ac2a9f22b6a7a8dcaf6abb08c8b546d06499301f1fcf10996fd0df5');
  }
  assertFontLicenseReferences(read('public/fonts/stablecoins/LICENSE.txt'), 'dejavu');
  assert.match(component, /@container\s*\(max-width:\s*500px\)/u);
  assert.match(component, /padding-bottom:\s*1rem/u);
  assert.match(component, /figures\/gigabyte-tax/u);
  assert.doesNotMatch(component, /overflow\s*:\s*(?:hidden|clip)|client:|<script|fetch\(|foreignObject/iu);
});
