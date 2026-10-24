import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { performance } from 'node:perf_hooks';
import test from 'node:test';
import postcss from 'postcss';
import { createProcessor, compile } from '@mdx-js/mdx';
import { assertFontLicenseReferences } from './font-license-assertions.mjs';
import { GOOGLE_CLOUD_KINDS, GOOGLE_CLOUD_SOURCES, googleCloudBankingSvg } from '../src/lib/googleCloudBankingFigures.mjs';
import { googleCloudBankingScenes, inspectGoogleCloudBankingSvg, assertGoogleCloudBankingGeometry, assertGoogleCloudBankingFaithful, assertGoogleCloudBankingSourceRecords, pathPoints, tag, attrs, content } from './google-cloud-banking-svg-assertions.mjs';
import { SVG_TEST_SUITES } from './svg-test-suites.mjs';
const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const hash = value => createHash('sha256').update(value).digest('hex');
const paths = ['src/content/posts/google-cloud-banques-automates-londres.mdx', 'src/content/posts-en/google-cloud-banks-london-power-control-failure.mdx'];

test('twenty native bilingual scenes preserve passive XML, local fonts, panels and every connector', () => {
  assert.equal(googleCloudBankingScenes().length, 20);
  for (const scene of googleCloudBankingScenes()) assertGoogleCloudBankingFaithful(scene.svg, scene.lang, scene.kind, scene.mobile);
  for (const lang of [undefined, null, {}, new String('fr'), '__proto__']) assert.throws(() => googleCloudBankingSvg(lang, 'power'));
  for (const kind of [undefined, null, {}, new String('power'), 'constructor', '__proto__']) assert.throws(() => googleCloudBankingSvg('fr', kind));
  for (const mobile of [null, {}, 0, 1, 'false']) assert.throws(() => googleCloudBankingSvg('fr', 'power', mobile));
});

test('source data preserve seven minutes, six hours ten minutes, bank service categories and dated institutional scope', () => {
  assert.equal(7 * 60 - (6 * 60 + 53), 7);
  assert.equal(13 * 60 + 10 - 7 * 60, 370);
  const labels = (lang, kind, mobile) => inspectGoogleCloudBankingSvg(googleCloudBankingSvg(lang, kind, mobile)).all.filter(n => tag(n) === 'text').map(content).join(' ').replace(/\s+/gu, ' ');
  for (const mobile of [false, true]) {
    const power = labels('fr', 'power', mobile), timeline = labels('fr', 'timeline', mobile), bank = labels('fr', 'bank-impact', mobile), regulation = labels('fr', 'regulation', mobile);
    for (const text of ['06:53 BST', '07:00 BST', 'EUROPE-WEST2-B']) assert.ok(power.includes(text));
    for (const text of ['12:29', '12:46', '13:10', '15:03']) assert.ok(timeline.includes(text));
    assert.match(bank, /18:00 BST.*6 services\/27 actifs/u);
    for (const text of ['REVOLUT', 'LLOYDS / HALIFAX', 'HSBC']) assert.ok(bank.includes(text));
    assert.match(regulation, /38 institutions/u);
    assert.match(regulation, /SIMEX26/u);
  }
  const desktop = inspectGoogleCloudBankingSvg(googleCloudBankingSvg('en', 'timeline')).all;
  const duration = desktop.filter(n => tag(n) === 'rect' && attrs(n).y === '270');
  assert.equal(duration.length, 2);
  assert.deepEqual(duration.map(n => attrs(n).fill), ['var(--color-accent)', 'var(--color-signal)'], 'Two distinct semantic duration segments');
  assert.ok(Math.abs(Number(attrs(duration[0]).width) / (Number(attrs(duration[0]).width) + Number(attrs(duration[1]).width)) - 370 / 483) < 1e-12, 'Duration bar uses the stated 07:00 to 15:03 scale');
  assert.match(labels('fr', 'cascade', false), /APPELS|Appels/u);
  assert.match(labels('en', 'cascade', false), /Synchronous calls/u);
  for (const scene of googleCloudBankingScenes().filter(s => s.lang === 'en')) assert.doesNotMatch(scene.svg, /rapport préliminaire|PÉRIMÈTRE|Mécanisme|reconstitution/u);
});

test('native glyph checks reject panel crossings, crowding, viewBox leakage and connector strikes', () => {
  const svg = googleCloudBankingSvg('fr', 'power', true);
  for (const change of [
    s => s.replace('x="82" y="290"', 'x="680" y="290"'),
    s => s.replace('>RÉSEAU ÉLECTRIQUE<', '>RÉSEAU ÉLECTRIQUE AVEC UN LIBELLÉ BEAUCOUP TROP LONG<'),
    s => s.replace('y="327"', 'y="290"'),
    s => s.replace('x1="369" y1="372" x2="369" y2="414"', 'x1="100" y1="280" x2="600" y2="280"'),
    s => s.replace('cy="416"', 'cy="1240"'),
  ]) { const bad = change(svg); assert.notEqual(bad, svg); assert.throws(() => assertGoogleCloudBankingGeometry(bad)); }
});

test('mobile power panel rejects the former 27-unit title-to-body interval using native font ascenders and descenders', () => {
  for (const lang of ['fr', 'en']) {
    const svg = googleCloudBankingSvg(lang, 'power', true);
    assertGoogleCloudBankingGeometry(svg);
    const cramped = svg.replace('x="82" y="1000"', 'x="82" y="981"').replace('x="82" y="1040"', 'x="82" y="1021"');
    assert.notEqual(cramped, svg);
    assert.throws(() => assertGoogleCloudBankingGeometry(cramped), /Overlapping font line boxes/u);
  }
});

test('passive XML allow-list rejects executable nodes, event handlers, external assets, arbitrary colours and foreign namespaces', () => {
  const svg = googleCloudBankingSvg('fr', 'power');
  for (const change of [
    s => s.replace('</svg>', '<script>alert(1)</script></svg>'),
    s => s.replace('<svg ', '<svg onload="alert(1)" '),
    s => '<!DOCTYPE svg [<!ENTITY x SYSTEM "file:///etc/passwd">]>' + s,
    s => s.replace('</svg>', '<foreignObject></foreignObject></svg>'),
    s => s.replace('</svg>', '<image href="https://example.com/pixel.png"/></svg>'),
    s => s.replace('font-family="l0g Google Cloud Banking"', 'font-family="Arial"'),
    s => s.replace('fill="var(--color-ink)"', 'fill="#11273e"'),
    s => s.replace('fill="var(--color-ink)"', 'fill="url(https://example.com/a)"'),
    s => s.replace('google-cloud-fr-f1-d-panel-0', 'other-fr-f1-d-panel-0'),
    s => s.replace('width:100%;height:auto', 'width:1300px;height:auto'),
    s => s.replace('font-size="22"', 'font-size="12"'),
  ]) { const bad = change(svg); assert.notEqual(bad, svg); assert.throws(() => inspectGoogleCloudBankingSvg(bad)); }
});

test('deterministic complete-input path grammar rejects malformed and long numerics within a bounded interval', () => {
  assert.deepEqual(pathPoints('M 1 1 H 9 V 9 L 1 1 Z'), [[1, 1], [9, 1], [9, 9], [1, 1], [1, 1]]);
  const started = performance.now();
  for (const path of ['M 1 1 L 2', 'M 1 1 Q 2 3 4 5', 'M 1 1 L 2 2 garbage', 'M 1 1 M 2 2', 'M 1 1 L Infinity 2', `M ${'0'.repeat(5000)} 1`, `M 1 1 L 1.${'2'.repeat(5000)}x 2`]) assert.throws(() => pathPoints(path));
  assert.ok(performance.now() - started < 1000, 'Malformed paths fail promptly');
});

test('existing canonical local font bytes, licence and semantic theme tokens are retained', () => {
  const component = read('src/components/GoogleCloudBankingFigure.astro');
  for (const [weight, expected] of [[400, '98f2d74db16bb5f41f74adf6d899aeec92861682cccc58bfdbe4d9d7d0a5ae11'], [700, '21a0350a4ac2a9f22b6a7a8dcaf6abb08c8b546d06499301f1fcf10996fd0df5']]) {
    assert.equal(hash(readFileSync(new URL(`../public/fonts/stablecoins/dejavu-sans-${weight}.ttf`, import.meta.url))), expected);
    assert.ok(component.includes(`/fonts/stablecoins/dejavu-sans-${weight}.ttf`));
  }
  const license = read('public/fonts/stablecoins/LICENSE.txt');
  assert.equal(hash(license), '185add2050d6a40596a9a6aa46026e3cf0bd4bfff21ab18acd9cc8eebe18182f');
  assertFontLicenseReferences(license, 'dejavu');
  const declarations = [];
  postcss.parse(read('src/styles/global.css')).walkDecls(decl => declarations.push(decl.prop));
  for (const name of ['ink', 'surface', 'surface-2', 'paper', 'muted', 'line-strong', 'signal', 'accent', 'amber']) assert.ok(declarations.filter(p => p === `--color-${name}`).length >= 2, `Both theme definitions contain ${name}`);
  assert.doesNotMatch(component, /overflow\s*:\s*(?:hidden|clip)|filter\s*:|client:|<script|fetch\(|@media\s*\(max-width:/iu);
  const css = postcss.parse(component.slice(component.indexOf('<style>') + 7, component.indexOf('</style>')));
  assert.ok(css.nodes.some(node => node.type === 'atrule' && node.name === 'container' && node.params === '(max-width: 640px)'));
  assert.match(component, /max-width:\s*44rem/u);
  assert.match(component, /padding-bottom:\s*1rem/u);
  assert.ok(850 * 704 / 1300 < 500);
  assert.ok(30 * 280 / 740 >= 11, 'Narrow mobile labels stay above 11px');
  assert.ok(22 * 704 / 1300 > 11, 'Desktop labels stay above 11px');
});

test('both MDX articles contain the five ordered mechanisms, exact source sets and sixteen canonical source records', async () => {
  const walk = node => [node, ...(node.children ?? []).flatMap(walk)];
  for (const [i, path] of paths.entries()) {
    const article = read(path), body = article.replace(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/u, '');
    assertGoogleCloudBankingSourceRecords(article);
    const figures = walk(createProcessor().parse(body)).filter(node => node.name === 'GoogleCloudBankingFigure');
    assert.equal(figures.length, 5);
    for (const [j, figure] of figures.entries()) {
      const a = Object.fromEntries(figure.attributes.map(attribute => { assert.equal(attribute.type, 'mdxJsxAttribute'); assert.equal(typeof attribute.value, 'string'); return [attribute.name, attribute.value]; }));
      assert.equal(a.lang, i ? 'en' : 'fr');
      assert.equal(a.kind, GOOGLE_CLOUD_KINDS[j]);
      assert.equal(a.number, String(j + 1).padStart(2, '0'));
      assert.equal(a.sources, GOOGLE_CLOUD_SOURCES[j]);
      assert.ok(a.caption.length > 20);
      for (const name of ['details', 'summary']) assert.equal(walk(figure).filter(node => node.name === name).length, 1);
    }
    await compile(body, { format: 'mdx' });
  }
});

test('source fragments and canonical URLs reject missing, duplicate, suffix-host and hidden-reference mutations', () => {
  const article = read(paths[0]);
  for (const change of [
    s => s.replace('id="source-s16"', 'id="source-s15"'),
    s => s.replace('#source-s01', '#source-s99'),
    s => s.replace('href="https://status.cloud.google.com/incidents/', 'href="https://status.cloud.google.com.evil.example/incidents/'),
    s => s.replace('href="https://status.cloud.google.com/incidents/', 'href="https://status.cloud.google.com@evil.example/incidents/'),
    s => s.replace('href="https://status.cloud.google.com/incidents/', 'href="http://status.cloud.google.com/incidents/'),
    s => s.replace('href="https://status.cloud.google.com/incidents/', 'href="https://evil.example/?source=https://status.cloud.google.com/incidents/'),
    s => s.replace('href="https://status.cloud.google.com/incidents/', 'href="https://evil.example/#https://status.cloud.google.com/incidents/'),
    s => s.replace('</ol>', '<li id="source-s17"><a href="https://example.com">extra</a></li></ol>'),
  ]) { const bad = change(article); assert.notEqual(bad, article); assert.throws(() => assertGoogleCloudBankingSourceRecords(bad)); }
});

test('source and rendered groups register each new suite once', () => {
  for (const [group, file] of [['source', 'scripts/google-cloud-banking-infographics.test.mjs'], ['rendered', 'scripts/google-cloud-banking-rendered-infographics.test.mjs']]) {
    assert.equal(SVG_TEST_SUITES[group].filter(value => value === file).length, 1);
    assert.equal(SVG_TEST_SUITES[group === 'source' ? 'rendered' : 'source'].includes(file), false);
  }
});
