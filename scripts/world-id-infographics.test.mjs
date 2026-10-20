import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import test from 'node:test';
import postcss from 'postcss';
import { compile } from '@mdx-js/mdx';
import { assertFontLicenseReferences } from './font-license-assertions.mjs';
import { assertWorldGeometry, assertWorldProportions, assertWorldQuantitative, assertWorldSourceFaithful, inspectWorldSvg, worldSourceFigures } from './world-id-svg-assertions.mjs';

const read = file => readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
const cssBase = '/styles/world-id-infographics-v1.css';
const cssHref = `${cssBase}?v=${createHash('sha256').update(readFileSync(new URL(`../public${cssBase}`, import.meta.url))).digest('hex').slice(0, 12)}`;
const articles = [read('src/content/posts/world-id-finance-preuve-humanite.mdx'), read('src/content/posts-en/world-id-banking-proof-of-human.mdx')];
const figures = articles.map(worldSourceFigures);
const stylesheet = article => assert.deepEqual([...article.matchAll(/<link\b[^>]*>/gu)].filter(m => /\brel="stylesheet"/u.test(m[0])).map(m => m[0].match(/\bhref="([^"]+)"/u)?.[1]).filter(href => href?.startsWith(cssBase)), [cssHref]);

test('all 24 accessible World ID SVGs retain verified scenes, scales, values and legible compact compositions', () => {
  assert.deepEqual(figures.map(group => group.length), [12, 12]);
  for (const [lang, article] of articles.entries()) {
    assert.equal((article.match(/<figure className="l0g-world-figure"/gu) ?? []).length, 6);
    stylesheet(article);
    assert.doesNotMatch(article, /<style>|<img[^>]+world-id/iu);
    for (const [index, svg] of figures[lang].entries()) {
      assertWorldSourceFaithful(svg, lang ? 'en' : 'fr', index);
      assertWorldGeometry(svg);
      assertWorldProportions(svg);
      assertWorldQuantitative(svg, Math.floor(index / 2) + 1);
    }
  }
});

test('cadence and hypothetical review workloads fail closed on changes to scale, units, inputs or capacity', () => {
  const cadence = figures[0][3], model = figures[0][11];
  assert.throws(() => assertWorldQuantitative(cadence.replace('width="12"', 'width="24"'), 2));
  assert.throws(() => assertWorldQuantitative(cadence.replaceAll('défaut', 'option'), 2));
  assert.throws(() => assertWorldQuantitative(model.replace('width="24.8889"', 'width="34.8889"'), 6));
  assert.throws(() => assertWorldQuantitative(model.replaceAll('FICTIF', 'OBSERVÉ'), 6));
  assert.throws(() => assertWorldQuantitative(model.replaceAll('0,6', '0,7'), 6));
});

test('active SVG, assets, source diversion, label overlap and viewport-sized artwork are rejected', () => {
  const svg = figures[0][0], mobile = figures[0][1];
  for (const payload of ['<script/>', '<foreignObject/>', '<image href="https://example.com/x"/>', '<animate/>']) assert.throws(() => inspectWorldSvg(svg.replace('</svg>', `${payload}</svg>`)));
  for (const mutate of [
    s => s.replace('<svg ', '<svg onload="void(0)" '),
    s => s.replace('fill="var(--color-ink)"', 'fill="url(https://example.com/x)"'),
    s => s.replace('href="#source-S01"', 'href="https://example.com/x"'),
    s => s.replace('font-size=', 'fontSize='),
  ]) assert.throws(() => inspectWorldSvg(mutate(svg)));
  assert.throws(() => assertWorldSourceFaithful(svg.replace('Unicité humaine', 'Unicité garantie'), 'fr', 0));
  assert.throws(() => assertWorldGeometry(svg.replace('x="46.0" y="80.0"', 'x="1190" y="80.0"')), /viewBox/u);
  assert.throws(() => assertWorldProportions(mobile.replace('viewBox="0 0 480 740"', 'viewBox="0 0 480 1300"')), /compact/u);
  assert.throws(() => assertWorldProportions(mobile.replace('font-size="22"', 'font-size="16"')), /legible/u);
});

test('authored panel containment catches the final line even beyond its original card and retains bottom padding', () => {
  const svg = figures[0][4];
  const line = [...svg.matchAll(/<text\b[^>]*data-panel="([^"]+)"[^>]*>[\s\S]*?<\/text>/gu)].find(m => m[0].includes('l’application.'));
  assert.ok(line);
  const panel = svg.match(new RegExp(`<rect\\b[^>]*id="${line[1]}"[^>]*>`))?.[0];
  assert.ok(panel);
  const bottom = Number(panel.match(/\by="([^"]+)"/u)[1]) + Number(panel.match(/\bheight="([^"]+)"/u)[1]);
  const move = y => svg.replace(line[0], line[0].replace(/\by="[^"]+"/u, `y="${y}"`));
  assert.throws(() => assertWorldGeometry(move(bottom + 12)), /internal panel/u);
  assert.throws(() => assertWorldGeometry(move(bottom - 1)), /internal panel/u);
  assert.throws(() => assertWorldGeometry(svg.replace(line[1], 'world-missing-panel')), /containing panel/u);
});

test('note cards reserve font ascent as well as the visible outlines', () => {
  const svg = figures[0][0], note = svg.match(/<rect\b[^>]*id="world-1-fr-d-panel-6"[^>]*>/u)?.[0];
  assert.ok(note);
  const line = svg.match(/<text\b[^>]*data-panel="world-1-fr-d-panel-6"[^>]*>/u)?.[0];
  const top = Number(line.match(/\by="([^"]+)"/u)[1]) - Number(line.match(/\bfont-size="([^"]+)"/u)[1]) + .5;
  assert.throws(() => assertWorldGeometry(svg.replace(note, note.replace(/\by="[^"]+"/u, `y="${top}"`))), /Typographic extents/u);
});

test('expanding cards cannot consume the gutter between adjacent mobile rows', () => {
  const svg = figures[1][1];
  const panel = id => svg.match(new RegExp(`<rect\\b[^>]*id="world-1-en-m-panel-${id}"[^>]*>`))?.[0];
  const first = panel(0), next = panel(1);
  assert.ok(first && next);
  const bottom = Number(first.match(/\by="([^"]+)"/u)[1]) + Number(first.match(/\bheight="([^"]+)"/u)[1]);
  for (const gap of [-1, .5]) assert.throws(() => assertWorldGeometry(svg.replace(next, next.replace(/\by="[^"]+"/u, `y="${bottom + gap}"`))), /gutter/u);
});

test('visible path parsing consumes its bounded numeric grammar without accepting malformed or oversized numbers', () => {
  const svg = figures[0][0], withPath = d => svg.replace('</svg>', `<path d="${d}" fill="none" stroke="var(--color-signal)" /></svg>`);
  assert.doesNotThrow(() => assertWorldGeometry(withPath('M 10 10 L 20 20 H 30 V 30 Z')));
  for (const d of ['M 10 10 L 20', 'M 1e3 10 L 20 20', 'M 10 10 C 20 20 30 30 40 40', `M ${'9'.repeat(10000)} 10`, `M 10 10 ${'L 20 20 '.repeat(1024)}`, 'M NaN 10']) assert.throws(() => assertWorldGeometry(withPath(d)));
});

test('the current CSS byte fingerprint is mandatory and cannot silently retain a stale cached style', () => {
  for (const article of articles) {
    stylesheet(article);
    assert.throws(() => stylesheet(article.replace(cssHref, cssBase)));
    assert.throws(() => stylesheet(article.replace(cssHref, `${cssBase}?v=000000000000`)));
  }
});

test('figure-only CSS keeps theme colours, full-width mobile compositions, exact local font metrics and one container breakpoint', () => {
  const raw = read('public/styles/world-id-infographics-v1.css'), css = postcss.parse(raw);
  const decls = node => Object.fromEntries(node.nodes.filter(n => n.type === 'decl').map(n => [n.prop, n.value]));
  const rule = selector => { const node = css.nodes.find(n => n.type === 'rule' && n.selector === selector); assert.ok(node, selector); return decls(node); };
  const figure = rule('.prose figure.l0g-world-figure');
  assert.deepEqual([figure.width, figure['max-width'], figure['container-type'], figure['padding-bottom']], ['100%', '48rem', 'inline-size', '1rem']);
  const svg = rule('.l0g-world-figure svg');
  assert.deepEqual([svg.width, svg.height, svg.overflow], ['100%', 'auto', 'visible']);
  const mobile = rule('.l0g-world-figure .world-mobile');
  assert.equal(mobile.width, '100%'); assert.equal(mobile['max-width'], undefined);
  assert.equal(rule('.l0g-world-figure svg text')['font-family'], "'l0g World ID', 'DejaVu Sans', Arial, sans-serif");
  const faces = css.nodes.filter(n => n.type === 'atrule' && n.name === 'font-face').map(decls);
  assert.deepEqual(faces.map(f => [f['font-family'], f.src, f['font-weight']]), [400, 700].map(weight => ["'l0g World ID'", `url('/fonts/world-id/dejavu-sans-${weight}.ttf') format('truetype')`, String(weight)]));
  const containers = css.nodes.filter(n => n.type === 'atrule' && n.name === 'container');
  assert.equal(containers.length, 1); assert.equal(containers[0].params, '(max-width: 480px)');
  assert.deepEqual(containers[0].nodes.map(n => [n.selector, decls(n).display]), [['.l0g-world-figure .world-mobile', 'block'], ['.l0g-world-figure .world-desktop', 'none']]);
  const h1 = rule('article:has(.l0g-world-figure) > .post-head .post-title');
  assert.deepEqual([h1.hyphens, h1['overflow-wrap'], h1['word-break']], ['none', 'normal', 'normal']);
  css.walkRules(n => assert.ok(n.selector.split(',').every(s => s.includes('.l0g-world-figure'))));
  assert.doesNotMatch(raw, /#(?:[a-f0-9]{3}){1,2}\b|@media\s*\(max-width:|overflow\s*:\s*(?:hidden|clip)|(?:clip-path|transform)\s*:/iu);
});

test('local DejaVu glyph subsets retain checked outlines, metrics, bytes and the complete original licence', () => {
  const hashes = { 400: '7e31c3adb9e301067d900d624fb7c7b35cb232c1b758f6c9737c11957536bf4a', 700: '232a3848f05e0a16c47d1f2a8b7d39df8ce481c936cff9375a52aba15f086288' };
  for (const [weight, hash] of Object.entries(hashes)) {
    const bytes = readFileSync(new URL(`../public/fonts/world-id/dejavu-sans-${weight}.ttf`, import.meta.url));
    assert.equal(createHash('sha256').update(bytes).digest('hex'), hash); assert.ok(bytes.length < 50000);
  }
  const licence = read('public/fonts/world-id/LICENSE.txt'); assertFontLicenseReferences(licence, 'dejavu');
  assert.equal(createHash('sha256').update(licence.slice(licence.indexOf('Fonts are (c) Bitstream'))).digest('hex'), 'f88d5294af5a772f9114eb385009e3478d62b21f3e5bbc34d159d328047c8867');
});

test('both complete MDX articles compile to native SVG without paragraph insertion and retain the shared bibliography', async () => {
  for (const article of articles) {
    const ids = [...article.matchAll(/<li id="source-(S[0-9]+)">/gu)].map(m => m[1]);
    assert.deepEqual(ids, Array.from({ length: 22 }, (_, i) => `S${String(i + 1).padStart(2, '0')}`));
    assert.equal((article.match(/<ol className="sources-list" role="list">/gu) ?? []).length, 1);
    const result = String(await compile(article.replace(/^---\n[\s\S]*?\n---\n/u, ''), { jsx: true })), svgs = worldSourceFigures(result);
    assert.equal(svgs.length, 12); for (const svg of svgs) assert.doesNotMatch(svg, /<(?:_components\.)?p(?:\s|>)/u);
  }
});
