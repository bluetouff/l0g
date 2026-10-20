import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import test from 'node:test';
import postcss from 'postcss';
import { compile } from '@mdx-js/mdx';
import { parseFragment } from 'parse5';
import { assertFontLicenseReferences } from './font-license-assertions.mjs';
import { assertStablecoinsConnections, assertStablecoinsGeometry, assertStablecoinsProportions, assertStablecoinsQuantitative, assertStablecoinsSourceFaithful, inspectStablecoinsSvg, stablecoinsAttrs, stablecoinsNodes, stablecoinsSourceFigures, stablecoinsTag } from './stablecoins-svg-assertions.mjs';
const read = p => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');
const paths = ['src/content/posts/stablecoins-fiscalite-calcul-plus-values.mdx', 'src/content/posts-en/france-stablecoin-tax-capital-gains.mdx'];
const articles = paths.map(read), figures = articles.map(stablecoinsSourceFigures);
const cssBase = '/styles/stablecoins-infographics-v1.css';
const cssHref = `${cssBase}?v=${createHash('sha256').update(readFileSync(new URL(`../public${cssBase}`, import.meta.url))).digest('hex').slice(0, 12)}`;
const stylesheet = article => assert.deepEqual([...article.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*>/gu)].map(m => m[0].match(/href="([^"]+)"/u)?.[1]).filter(p => p?.startsWith(cssBase)), [cssHref]);
const mutateRect = (svg, id, attr, delta) => { const raw = svg.match(new RegExp(`<rect\\b[^>]*id="[^"]*${id}"[^>]*>`))?.[0]; assert.ok(raw); const value = Number(raw.match(new RegExp(`\\b${attr}="([^"]+)"`))[1]); return svg.replace(raw, raw.replace(new RegExp(`\\b${attr}="[^"]+"`), `${attr}="${value + delta}"`)); };
const textContent = node => node.nodeName === '#text' ? node.value : (node.childNodes ?? []).map(textContent).join('');

const assertReferences = article => {
  const entries = [...article.matchAll(/<li id="source-(S[0-9]{2})">([\s\S]*?)<\/li>/gu)];
  const ids = entries.map(m => m[1]);
  assert.deepEqual(ids, Array.from({ length: 16 }, (_, i) => `S${String(i + 1).padStart(2, '0')}`));
  for (const [, id, body] of entries) {
    assert.ok(textContent(parseFragment(body)).trim().length > 60, `${id} must retain its citation metadata`);
    assert.match(body, /<a\b[^>]*href="https:\/\/[^"<>]+"/u, `${id} retains a canonical external source`);
  }
  for (const ref of article.matchAll(/href="#source-(S[0-9]+)"/gu)) assert.ok(ids.includes(ref[1]), `Resolved ${ref[1]}`);
};

test('French H1 punctuation stays attached while the figure stylesheet preserves whole words', () => {
  const title = articles[0].match(/^title: "(.*)"$/mu)?.[1]; assert.ok(title);
  const attached = heading => { for (const colon of heading.matchAll(/:/gu)) assert.match(heading[colon.index - 1] ?? '', /[\u00a0\u202f]/u); };
  attached(title); assert.throws(() => attached('Stablecoins : fiscalité'));
});

test('24 native, accessible Stablecoins scenes retain values, scales, relationships and compact legible compositions', () => {
  assert.deepEqual(figures.map(a => a.length), [12, 12]);
  for (const [l, article] of articles.entries()) {
    stylesheet(article); assert.doesNotMatch(article, /<style>|stablecoins-dossier|className="bibliography"/u);
    assert.equal((article.match(/<figure className="l0g-stablecoins-figure"/gu) ?? []).length, 6);
    for (const [i, svg] of figures[l].entries()) { assertStablecoinsSourceFaithful(svg, l ? 'en' : 'fr', i); assertStablecoinsGeometry(svg); assertStablecoinsQuantitative(svg, Math.floor(i / 2) + 1); assertStablecoinsProportions(svg); }
  }
});

test('the hypothetical gain, allocation, annual-loss and FX models are reproducible from their stated inputs', () => {
  const costA = 10000, valueA = 20000, costB = 10000, valueB = 5000, cost = costA + costB, value = valueA + valueB;
  assert.equal(valueA - cost * valueA / value, 4000);
  const residual = cost - cost * valueA / value;
  assert.equal(valueB - residual, 1000);
  assert.equal(valueA - costA, 10000); assert.equal(valueB - costB, -5000);
  assert.equal(4000 + 1000, 10000 - 5000); assert.equal(value - cost, 5000);
  assert.equal(cost * valueA / value, 16000); assert.equal(cost * valueB / value, 4000);
  assert.equal(valueA - 16000, 4000); assert.equal(16000 + 4000, cost);
  assert.equal(8000 - 10000, -2000); assert.equal(8000 - 20000, -12000); assert.equal(10000 - 12000, -2000);
  assert.equal(10000 * .9, 9000); assert.equal((9000 / 10000 - 1).toFixed(2), '-0.10');
  for (const [suffix, index, attr] of [['-gain-4000', 3, 'width'], ['-basis-1-a', 5, 'width'], ['-year-1-1', 7, 'width'], ['-fx-9000', 11, 'width']]) assert.throws(() => assertStablecoinsQuantitative(mutateRect(figures[0][index], suffix, attr, 2), Math.floor(index / 2) + 1));
});

test('mechanism rails cannot disappear, become invisible or be covered by a later card', () => {
  const svg = figures[0][9], first = svg.match(/<(?:line|path)\b[^>]*marker-end="[^"]+"[^>]*\/>/u)?.[0]; assert.ok(first);
  assert.throws(() => assertStablecoinsConnections(svg.replace(first, ''), 5));
  const convergence = svg.match(/<path\b[^>]*id="[^"]*-convergence-left"[^>]*\/>/u)?.[0]; assert.ok(convergence);
  assert.throws(() => assertStablecoinsConnections(svg.replace(convergence, ''), 5));
  const timeline = figures[0][1], attachment = timeline.match(/<line x1="12"[^>]*x2="21"[^>]*\/>/u)?.[0]; assert.ok(attachment);
  assert.throws(() => assertStablecoinsConnections(timeline.replace(attachment, ''), 1));
  assert.throws(() => assertStablecoinsConnections(svg.replace(first, first.replace('stroke="var(--color-signal)"', 'stroke="none"')), 5));
  assert.throws(() => assertStablecoinsConnections(svg.replace('</svg>', '<rect x="0" y="0" width="480" height="748" fill="var(--color-ink)" /></svg>'), 5), /cover a connection/u);
});

test('internal cards, source clearance, legibility and bounded path grammar fail closed', () => {
  const svg = figures[0][8], mobile = figures[0][9];
  assert.throws(() => assertStablecoinsGeometry(mutateRect(svg, '-panel-5', 'height', 35)), /source footer/u);
  assert.throws(() => assertStablecoinsGeometry(mutateRect(mobile, '-panel-1', 'height', -30)), /panel/u);
  assert.throws(() => assertStablecoinsProportions(mobile.replace('viewBox="0 0 480 748"', 'viewBox="0 0 480 1300"')), /compact/u);
  assert.throws(() => assertStablecoinsProportions(mobile.replace('font-size="22"', 'font-size="16"')), /legible/u);
  const withPath = d => svg.replace('</svg>', `<path d="${d}" fill="none" stroke="var(--color-signal)" /></svg>`);
  assert.doesNotThrow(() => assertStablecoinsGeometry(withPath('M 10 10 L 20 20 H 30 V 30 Z')));
  for (const d of ['M 10 10 L 20', 'M 1e3 10 L 20 20', `M ${'9'.repeat(10000)} 10`, `M 10 10 ${'L 20 20 '.repeat(1024)}`, 'M NaN 10', 'M 10 10 C 20 20 30 30 40 40']) assert.throws(() => assertStablecoinsGeometry(withPath(d)));
});

test('scripts, external assets, source diversion and nonnative presentation attributes fail closed', () => {
  const svg = figures[0][0];
  for (const element of ['<script/>', '<foreignObject/>', '<image href="https://example.com/x"/>', '<animate/>']) assert.throws(() => inspectStablecoinsSvg(svg.replace('</svg>', `${element}</svg>`)));
  for (const mutate of [s => s.replace('<svg ', '<svg onload="void(0)" '), s => s.replace('font-size=', 'fontSize='), s => s.replace('href="#source-S01"', 'href="https://example.com/x"'), s => s.replace('fill="var(--color-ink)"', 'fill="url(https://example.com/x)"')]) assert.throws(() => inspectStablecoinsSvg(mutate(svg)));
});

test('the CSS byte fingerprint, one container breakpoint, scoped theme styles and exact local DejaVu fonts remain mandatory', () => {
  for (const article of articles) { stylesheet(article); assert.throws(() => stylesheet(article.replace(cssHref, cssBase))); assert.throws(() => stylesheet(article.replace(cssHref, `${cssBase}?v=000000000000`))); }
  const raw = read('public/styles/stablecoins-infographics-v1.css'), css = postcss.parse(raw), decls = n => Object.fromEntries(n.nodes.filter(n => n.type === 'decl').map(n => [n.prop, n.value]));
  const rule = selector => { const n = css.nodes.find(n => n.type === 'rule' && n.selector === selector); assert.ok(n); return decls(n); };
  const figure = rule('.prose figure.l0g-stablecoins-figure'); assert.deepEqual([figure.width, figure['max-width'], figure['container-type'], figure['padding-bottom']], ['100%', '48rem', 'inline-size', '1rem']);
  const sizing = rule('.l0g-stablecoins-figure svg'); assert.deepEqual([sizing.width, sizing.height, sizing.overflow], ['100%', 'auto', 'visible']);
  assert.equal(rule('.l0g-stablecoins-figure .l0g-stablecoins-mobile').width, '100%'); assert.equal(rule('.l0g-stablecoins-figure .l0g-stablecoins-mobile')['max-width'], undefined);
  const containers = css.nodes.filter(n => n.type === 'atrule' && n.name === 'container'); assert.equal(containers.length, 1); assert.equal(containers[0].params, '(max-width: 480px)');
  assert.deepEqual(containers[0].nodes.map(n => [n.selector, decls(n).display]), [['.l0g-stablecoins-figure .l0g-stablecoins-mobile', 'block'], ['.l0g-stablecoins-figure .l0g-stablecoins-desktop', 'none']]);
  const faces = css.nodes.filter(n => n.type === 'atrule' && n.name === 'font-face').map(decls); assert.deepEqual(faces.map(f => [f['font-family'], f.src, f['font-weight']]), [400, 700].map(w => ["'l0g Stablecoins Sans'", `url('/fonts/stablecoins/dejavu-sans-${w}.ttf') format('truetype')`, String(w)]));
  const h1 = rule('article:has(.l0g-stablecoins-figure) > .post-head .post-title'); assert.deepEqual([h1.hyphens, h1['overflow-wrap'], h1['word-break']], ['none', 'normal', 'normal']);
  css.walkRules(n => assert.ok(n.selector.split(',').every(s => s.includes('.l0g-stablecoins-figure')))); assert.doesNotMatch(raw, /#(?:[a-f0-9]{3}){1,2}\b|@media\s*\(max-width:|overflow\s*:\s*(?:hidden|clip)|(?:clip-path|transform)\s*:/iu);
});

test('local DejaVu subsets retain the licensed bytes and all original metrics and outlines', () => {
  for (const [weight, hash] of [[400, '98f2d74db16bb5f41f74adf6d899aeec92861682cccc58bfdbe4d9d7d0a5ae11'], [700, '21a0350a4ac2a9f22b6a7a8dcaf6abb08c8b546d06499301f1fcf10996fd0df5']]) { const bytes = readFileSync(new URL(`../public/fonts/stablecoins/dejavu-sans-${weight}.ttf`, import.meta.url)); assert.equal(createHash('sha256').update(bytes).digest('hex'), hash); assert.ok(bytes.length < 50000); }
  const licence = read('public/fonts/stablecoins/LICENSE.txt'); assertFontLicenseReferences(licence, 'dejavu');
  const source = read('public/fonts/world-id/LICENSE.txt'), body = s => s.slice(s.indexOf('Fonts are (c) Bitstream')).split('\n').map(l => l.trimEnd()).join('\n'); assert.equal(body(licence), body(source));
  assert.match(licence, /Renamed l0g Stablecoins Sans/u);
});

test('both complete MDX articles compile natively and retain all 16 shared source entries and resolved citations', async () => {
  for (const article of articles) {
    assertReferences(article);
    assert.equal((article.match(/<ol class(?:Name)?="sources-list" role="list">/gu) ?? []).length, 1); assert.equal((article.match(/<section class(?:Name)?="method"/gu) ?? []).length, 1);
    assert.throws(() => assertReferences(article.replace(/<li id="source-S01">[\s\S]*?<\/li>/u, '<li id="source-S01"></li>')));
    assert.throws(() => assertReferences(article.replace(/<ol className="sources-list"[^>]*>[\s\S]*?<\/ol>/u, '<ol className="sources-list" role="list"></ol>')));
    const result = String(await compile(article.replace(/^---\n[\s\S]*?\n---\n/u, ''), { jsx: true })), svgs = stablecoinsSourceFigures(result); assert.equal(svgs.length, 12); for (const svg of svgs) assert.doesNotMatch(svg, /<(?:_components\.)?p(?:\s|>)/u);
  }
});
