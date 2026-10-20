import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import test from 'node:test';
import postcss from 'postcss';
import { compile } from '@mdx-js/mdx';
import { assertFontLicenseReferences } from './font-license-assertions.mjs';
import { assertJpmGeometry, assertJpmQuantitative, assertJpmSourceFaithful, inspectJpmSvg, jpmSourceFigures } from './jpmorgan-svg-assertions.mjs';

const read = file => readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
const articles = [read('src/content/posts/jpmorgan-capital-strategique.mdx'), read('src/content/posts-en/jpmorgan-industrial-power-investment.mdx')];
const figures = articles.map(jpmSourceFigures);

test('24 complete supplied JPMorgan scenes preserve geometry, labels, font metrics and native SVG attributes', () => {
  assert.deepEqual(figures.map(group => group.length), [12, 12]);
  for (const [language, article] of articles.entries()) {
    assert.equal((article.match(/<figure className="l0g-jpm-figure"/gu) ?? []).length, 6);
    assert.equal((article.match(/<link rel="stylesheet" href="\/styles\/jpmorgan-infographics-v1\.css"\s*\/>/gu) ?? []).length, 1);
    assert.doesNotMatch(article, /<style>|<img[^>]+jpmorgan/iu);
    for (const [index, svg] of figures[language].entries()) {
      assertJpmSourceFaithful(svg, language ? 'en' : 'fr', index);
      assertJpmGeometry(svg);
      assertJpmQuantitative(svg, Math.floor(index / 2) + 1);
    }
  }
});

test('hypothetical cash model and GAO sample markers fail closed on arithmetic or population regressions', () => {
  const cash = figures[0][8], gao = figures[0][10];
  assert.throws(() => assertJpmQuantitative(cash.replace('M84.000 558.571', 'M84.000 548.571'), 5));
  assert.throws(() => assertJpmQuantitative(cash.replace('>+13<', '>+14<'), 5));
  assert.throws(() => assertJpmQuantitative(cash.replaceAll('EXEMPLE FICTIF', 'RÉSULTAT OBSERVÉ'), 5));
  const firstCircle = gao.indexOf('<circle');
  assert.ok(firstCircle > 0);
  assert.throws(() => assertJpmQuantitative(gao.slice(0, firstCircle) + gao.slice(firstCircle).replace('fill="var(--color-signal)"', 'fill="var(--color-surface)"'), 6));
  assert.throws(() => assertJpmQuantitative(gao.replace('>5/15<', '>5/14<'), 6));
});

test('active markup, external assets, CSS injection, source diversion and geometry mutations are rejected', () => {
  const svg = figures[0][0];
  for (const payload of ['<script/>', '<foreignObject/>', '<image href="https://example.com/x"/>', '<animate/>']) assert.throws(() => inspectJpmSvg(svg.replace('</svg>', `${payload}</svg>`)));
  for (const mutation of [
    raw => raw.replace('<svg ', '<svg onload="void(0)" '),
    raw => raw.replace('fill="var(--color-surface)"', 'fill="url(https://example.com/x)"'),
    raw => raw.replace('fill="var(--color-surface)"', 'fill="#FAF8F2"'),
    raw => raw.replace('href="#source-S01"', 'href="https://example.com/x"'),
    raw => raw.replace('font-size=', 'fontSize='),
  ]) assert.throws(() => inspectJpmSvg(mutation(svg)));
  assert.throws(() => assertJpmSourceFaithful(svg.replace('>1 500<', '>1 501<'), 'fr', 0));
  assert.throws(() => assertJpmGeometry(svg.replace('x="32" y="39"', 'x="1190" y="39"')), /viewBox/u);
});

test('figure CSS retains semantic themes, supplied font metrics, compact sizing and both responsive variants', () => {
  const raw = read('public/styles/jpmorgan-infographics-v1.css'), css = postcss.parse(raw);
  const declarations = node => Object.fromEntries(node.nodes.filter(node => node.type === 'decl').map(node => [node.prop, node.value]));
  const rule = selector => {
    const found = css.nodes.find(node => node.type === 'rule' && node.selector === selector);
    assert.ok(found, selector); return declarations(found);
  };
  const figure = rule('.prose figure.l0g-jpm-figure');
  assert.deepEqual([figure.width, figure['max-width'], figure['container-type'], figure['padding-bottom']], ['100%', '48rem', 'inline-size', '1rem']);
  const svg = rule('.l0g-jpm-figure svg');
  assert.deepEqual([svg.width, svg['max-width'], svg.height, svg.overflow], ['100%', '100%', 'auto', 'visible']);
  assert.equal(rule('.l0g-jpm-figure .jpm-mobile')['max-width'], '24rem');
  assert.equal(rule('.l0g-jpm-figure svg text')['font-family'], "'l0g JPMorgan', 'DejaVu Sans', Arial, sans-serif");
  const faces = css.nodes.filter(node => node.type === 'atrule' && node.name === 'font-face').map(declarations);
  assert.deepEqual(faces.map(face => [face['font-family'], face.src, face['font-weight']]), [400, 700].map(weight => ["'l0g JPMorgan'", `url('/fonts/jpmorgan/dejavu-sans-${weight}.ttf') format('truetype')`, String(weight)]));
  for (const [kind, width] of [['media', 700], ['container', 640]]) {
    const node = css.nodes.find(node => node.type === 'atrule' && node.name === kind && node.params === `(max-width: ${width}px)`);
    assert.ok(node); assert.deepEqual(node.nodes.map(node => [node.selector, declarations(node).display]), [['.l0g-jpm-figure .jpm-mobile', 'block'], ['.l0g-jpm-figure .jpm-desktop', 'none']]);
  }
  css.walkRules(node => assert.ok(node.selector.split(',').every(selector => selector.includes('.l0g-jpm-figure'))));
  assert.doesNotMatch(raw, /#(?:[a-f0-9]{3}){1,2}\b|overflow\s*:\s*(?:hidden|clip)|(?:clip-path|transform)\s*:/iu);
});

test('official local DejaVu subsets retain their complete licence and checked bytes', () => {
  const hashes = { 400: 'dc56176308e7e3c88a20d5e01f1c3167fa7f781d6249a87492d540e3ec5cb502', 700: 'e8b627dd723e836d90e15fb136d2df2b48d8ed356999eaeaa08b3e3b06ef8c79' };
  for (const [weight, hash] of Object.entries(hashes)) {
    const bytes = readFileSync(new URL(`../public/fonts/jpmorgan/dejavu-sans-${weight}.ttf`, import.meta.url));
    assert.equal(createHash('sha256').update(bytes).digest('hex'), hash);
    assert.ok(bytes.length < 50000);
  }
  const licence = read('public/fonts/jpmorgan/LICENSE.txt');
  assertFontLicenseReferences(licence, 'dejavu');
  assert.equal(createHash('sha256').update(licence.slice(licence.indexOf('Fonts are (c) Bitstream'))).digest('hex'), '7a083b136e64d064794c3419751e5c7dd10d2f64c108fe5ba161eae5e5958a93');
});

test('bibliography retains all source IDs and complete bilingual MDX compiles without paragraphs inside SVG', async () => {
  for (const article of articles) {
    const ids = [...article.matchAll(/<li id="source-(S[0-9]+)">/gu)].map(match => match[1]);
    assert.deepEqual(ids, Array.from({ length: 21 }, (_, index) => `S${String(index + 1).padStart(2, '0')}`));
    assert.equal((article.match(/<ol class="sources-list" role="list">/gu) ?? []).length, 1);
    const compiled = String(await compile(article.replace(/^---\n[\s\S]*?\n---\n/u, ''), { jsx: true }));
    const graphics = jpmSourceFigures(compiled); assert.equal(graphics.length, 12);
    for (const svg of graphics) assert.doesNotMatch(svg, /<(?:_components\.)?p(?:\s|>)/u, 'Compiled SVG contains no HTML paragraphs');
  }
});
