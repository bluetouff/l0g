import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import test from 'node:test';
import postcss from 'postcss';
import { compile } from '@mdx-js/mdx';
import { assertFontLicenseReferences } from './font-license-assertions.mjs';
import { assertPredictstreetConnections, assertPredictstreetGeometry, assertPredictstreetProportions, assertPredictstreetQuantitative, assertPredictstreetSourceFaithful, inspectPredictstreetSvg, predictstreetAttrs, predictstreetNodes, predictstreetSourceFigures, predictstreetTag } from './predictstreet-svg-assertions.mjs';
const read = p => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');
const paths = ['src/content/posts/fifa-predictstreet-volume-wash-trading.mdx', 'src/content/posts-en/fifa-predictstreet-trading-volume-risk.mdx'];
const articles = paths.map(read), figures = articles.map(predictstreetSourceFigures);
const cssBase = '/styles/predictstreet-infographics-v1.css';
const cssHref = `${cssBase}?v=${createHash('sha256').update(readFileSync(new URL(`../public${cssBase}`, import.meta.url))).digest('hex').slice(0, 12)}`;
const stylesheet = article => assert.deepEqual([...article.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*>/gu)].map(m => m[0].match(/href="([^"]+)"/u)?.[1]).filter(p => p?.startsWith(cssBase)), [cssHref]);
const mutateRect = (svg, id, attr, delta) => { const raw = svg.match(new RegExp(`<rect\\b[^>]*id="[^"]*${id}"[^>]*>`))?.[0]; assert.ok(raw); const value = Number(raw.match(new RegExp(`\\b${attr}="([^"]+)"`))[1]); return svg.replace(raw, raw.replace(new RegExp(`\\b${attr}="[^"]+"`), `${attr}="${value + delta}"`)); };

test('24 native, accessible Predictstreet scenes retain values, scales, relationships and compact legible compositions', () => {
  assert.deepEqual(figures.map(a => a.length), [12, 12]);
  for (const [l, article] of articles.entries()) {
    stylesheet(article); assert.doesNotMatch(article, /<style>|predict-dossier|className="bibliography"/u);
    assert.equal((article.match(/<figure className="l0g-predict-figure"/gu) ?? []).length, 6);
    for (const [i, svg] of figures[l].entries()) { assertPredictstreetSourceFaithful(svg, l ? 'en' : 'fr', i); assertPredictstreetGeometry(svg); assertPredictstreetQuantitative(svg, Math.floor(i / 2) + 1); assertPredictstreetProportions(svg); }
  }
});

test('attributed shares and hypothetical order-book arithmetic fail closed on changed scales or scenario labels', () => {
  assert.throws(() => assertPredictstreetQuantitative(mutateRect(figures[0][1], '-reported-108', 'width', 1), 1));
  assert.throws(() => assertPredictstreetQuantitative(mutateRect(figures[0][1], '-reported-99', 'width', -4), 1));
  assert.throws(() => assertPredictstreetQuantitative(mutateRect(figures[0][7], '-tier-3', 'height', 2), 4));
  assert.throws(() => assertPredictstreetQuantitative(figures[0][7].replaceAll('FICTIF', 'OBSERVÉ'), 4));
  const { root } = inspectPredictstreetSvg(figures[0][7]);
  const bars = predictstreetNodes(root).filter(n => predictstreetTag(n) === 'rect' && /-tier-[1-3]$/u.test(predictstreetAttrs(n).id ?? ''));
  // Recover the published whole-share quantities and cent prices from SVG
  // coordinates, whose decimal serialization has finite precision.
  const tiers = bars.map(n => [Math.round(Number(predictstreetAttrs(n).width) * 1000 / 360), Math.round(Number(predictstreetAttrs(n).height) * .55 / 180 * 100) / 100]);
  const proceeds = tiers.reduce((v, [quantity, price]) => v + quantity * price, 0), mark = 1000 * Math.max(...tiers.map(t => t[1]));
  assert.ok(Math.abs(proceeds - 350) < .001); assert.ok(Math.abs(proceeds / 1000 - .35) < .000001); assert.ok(Math.abs(mark - 500) < .001); assert.ok(Math.abs((mark - proceeds) / mark * 100 - 30) < .001);
  assert.equal(1000 * .4, 400); assert.equal(2 * 400, 800); assert.equal(1000 * 1, 1000);
  assert.equal(100 * 100 * .01 * 2, 200); assert.equal(200 - 100 - 100, 0); assert.equal(167 - 108, 59); assert.equal(Math.round(108 / 167 * 1000) / 10, 64.7);
});

test('connections cannot disappear, become invisible or be covered by later card backgrounds', () => {
  const svg = figures[0][5], first = svg.match(/<(?:line|path)\b[^>]*marker-end="[^"]+"[^>]*\/>/u)?.[0]; assert.ok(first);
  assert.throws(() => assertPredictstreetConnections(svg.replace(first, ''), 3), /remains drawn/u);
  assert.throws(() => assertPredictstreetConnections(svg.replace(first, first.replace('stroke="var(--color-signal)"', 'stroke="none"')), 3));
  assert.throws(() => assertPredictstreetConnections(svg.replace('</svg>', '<rect x="0" y="0" width="480" height="748" fill="var(--color-ink)" /></svg>'), 3), /cover a connection/u);
});

test('font ascent, badge collisions, footer clearance, malformed paths and proportion regressions are rejected', () => {
  const svg = figures[0][10], mobile = figures[0][11];
  assert.throws(() => assertPredictstreetGeometry(mobile.replace('x="84" y="195"', 'x="42" y="195"')), /badge|Overlapping/u);
  assert.throws(() => assertPredictstreetGeometry(mutateRect(svg, '-panel-5', 'height', 20)), /source footer/u);
  assert.throws(() => assertPredictstreetProportions(mobile.replace('viewBox="0 0 480 748"', 'viewBox="0 0 480 1300"')), /compact/u);
  assert.throws(() => assertPredictstreetProportions(mobile.replace('font-size="22"', 'font-size="16"')), /legible/u);
  const withPath = d => svg.replace('</svg>', `<path d="${d}" fill="none" stroke="var(--color-signal)" /></svg>`);
  assert.doesNotThrow(() => assertPredictstreetGeometry(withPath('M 10 10 L 20 20 H 30 V 30 Z')));
  for (const d of ['M 10 10 L 20', 'M 1e3 10 L 20 20', `M ${'9'.repeat(10000)} 10`, `M 10 10 ${'L 20 20 '.repeat(1024)}`, 'M NaN 10', 'M 10 10 C 20 20 30 30 40 40']) assert.throws(() => assertPredictstreetGeometry(withPath(d)));
});

test('scripts, external assets, source diversion and nonnative SVG attributes fail closed', () => {
  const svg = figures[0][0];
  for (const element of ['<script/>', '<foreignObject/>', '<image href="https://example.com/x"/>', '<animate/>']) assert.throws(() => inspectPredictstreetSvg(svg.replace('</svg>', `${element}</svg>`)));
  for (const mutate of [s => s.replace('<svg ', '<svg onload="void(0)" '), s => s.replace('font-size=', 'fontSize='), s => s.replace('href="#source-S02"', 'href="https://example.com/x"'), s => s.replace('fill="var(--color-ink)"', 'fill="url(https://example.com/x)"')]) assert.throws(() => inspectPredictstreetSvg(mutate(svg)));
});

test('the CSS byte fingerprint, one container breakpoint, scoped theme styles and local Arial-compatible fonts remain mandatory', () => {
  for (const article of articles) { stylesheet(article); assert.throws(() => stylesheet(article.replace(cssHref, cssBase))); assert.throws(() => stylesheet(article.replace(cssHref, `${cssBase}?v=000000000000`))); }
  const raw = read('public/styles/predictstreet-infographics-v1.css'), css = postcss.parse(raw), decls = n => Object.fromEntries(n.nodes.filter(n => n.type === 'decl').map(n => [n.prop, n.value]));
  const rule = selector => { const n = css.nodes.find(n => n.type === 'rule' && n.selector === selector); assert.ok(n); return decls(n); };
  const figure = rule('.prose figure.l0g-predict-figure'); assert.deepEqual([figure.width, figure['max-width'], figure['container-type'], figure['padding-bottom']], ['100%', '48rem', 'inline-size', '1rem']);
  const sizing = rule('.l0g-predict-figure svg'); assert.deepEqual([sizing.width, sizing.height, sizing.overflow], ['100%', 'auto', 'visible']);
  assert.equal(rule('.l0g-predict-figure .predict-mobile').width, '100%'); assert.equal(rule('.l0g-predict-figure .predict-mobile')['max-width'], undefined);
  const containers = css.nodes.filter(n => n.type === 'atrule' && n.name === 'container'); assert.equal(containers.length, 1); assert.equal(containers[0].params, '(max-width: 480px)');
  assert.deepEqual(containers[0].nodes.map(n => [n.selector, decls(n).display]), [['.l0g-predict-figure .predict-mobile', 'block'], ['.l0g-predict-figure .predict-desktop', 'none']]);
  const faces = css.nodes.filter(n => n.type === 'atrule' && n.name === 'font-face').map(decls); assert.deepEqual(faces.map(f => [f['font-family'], f.src, f['font-weight']]), [400, 700].map(w => ["'l0g Predictstreet Sans'", `url('/fonts/predictstreet/liberation-sans-${w}.ttf') format('truetype')`, String(w)]));
  const h1 = rule('article:has(.l0g-predict-figure) > .post-head .post-title'); assert.deepEqual([h1.hyphens, h1['overflow-wrap'], h1['word-break']], ['none', 'normal', 'normal']);
  css.walkRules(n => assert.ok(n.selector.split(',').every(s => s.includes('.l0g-predict-figure')))); assert.doesNotMatch(raw, /#(?:[a-f0-9]{3}){1,2}\b|@media\s*\(max-width:|overflow\s*:\s*(?:hidden|clip)|(?:clip-path|transform)\s*:/iu);
});

test('renamed local font subsets retain licensed bytes, original outlines and Arial-compatible metrics', () => {
  for (const [weight, hash] of [[400, '7e92837ad003964a19db8640df42c6743387f3204a9bad779c1c1f54b4499a20'], [700, 'ef133b4befe616f718b5f033d2efeb084540b3a3fe89a4b0b2b13fc2e42e3cf8']]) { const bytes = readFileSync(new URL(`../public/fonts/predictstreet/liberation-sans-${weight}.ttf`, import.meta.url)); assert.equal(createHash('sha256').update(bytes).digest('hex'), hash); assert.ok(bytes.length < 40000); }
  const licence = read('public/fonts/predictstreet/LICENSE.txt'); assertFontLicenseReferences(licence, 'liberation');
  const source = read('public/fonts/ukraine-reparations/LICENSE.txt'), body = s => s.slice(s.indexOf('Digitized data copyright')).split('\n').map(l => l.trimEnd()).join('\n'); assert.equal(body(licence), body(source));
  assert.match(licence, /renamed l0g Predictstreet Sans/u);
});

test('both complete MDX articles compile natively and retain all 14 shared source entries and resolved citations', async () => {
  for (const article of articles) {
    const ids = [...article.matchAll(/<li id="source-(S[0-9]+)">/gu)].map(m => m[1]); assert.deepEqual(ids, Array.from({ length: 14 }, (_, i) => `S${String(i + 1).padStart(2, '0')}`));
    assert.equal((article.match(/<ol class(?:Name)?="sources-list" role="list">/gu) ?? []).length, 1); assert.equal((article.match(/<section class(?:Name)?="method"/gu) ?? []).length, 1);
    for (const ref of article.matchAll(/href="#source-(S[0-9]+)"/gu)) assert.ok(ids.includes(ref[1]), `Resolved ${ref[1]}`);
    const result = String(await compile(article.replace(/^---\n[\s\S]*?\n---\n/u, ''), { jsx: true })), svgs = predictstreetSourceFigures(result); assert.equal(svgs.length, 12); for (const svg of svgs) assert.doesNotMatch(svg, /<(?:_components\.)?p(?:\s|>)/u);
  }
});
