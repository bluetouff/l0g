import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import test from 'node:test';
import postcss from 'postcss';
import { compile } from '@mdx-js/mdx';
import { assertFontLicenseReferences } from './font-license-assertions.mjs';
import { assertCarbonGeometry, assertCarbonSourceFaithful, carbonSourceFigures, inspectCarbonSvg } from './google-carbon-svg-assertions.mjs';

const read = file => readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
const articles = [
  read('src/content/posts/google-mckinsey-carbone-paturages.mdx'),
  read('src/content/posts-en/google-mckinsey-pasture-carbon-timber.mdx'),
];
const figures = articles.map(carbonSourceFigures);

test('all 24 supplied carbon SVGs retain their complete geometry, labels, fonts and source ordering', () => {
  assert.deepEqual(figures.map(group => group.length), [12, 12]);
  for (const [i, article] of articles.entries()) {
    assert.equal((article.match(/<figure className="l0g-cc-figure"/gu) ?? []).length, 6);
    assert.equal((article.match(/<link rel="stylesheet" href="\/styles\/google-carbon-infographics-v1\.css"\s*\/>/gu) ?? []).length, 1);
    assert.doesNotMatch(article, /<style>|import .*google-carbon-infographics|<img[^>]+google-mckinsey/iu);
    for (const [j, svg] of figures[i].entries()) assertCarbonSourceFaithful(svg, i ? 'en' : 'fr', j);
  }
});

test('every original DejaVu glyph stays inside the viewBox and its containing panel', () => {
  for (const svg of figures.flat()) assertCarbonGeometry(svg);
});

test('coordinate, label, typography, active-markup and external-asset regressions fail closed', () => {
  const svg = figures[0][0];
  for (const replacement of [
    svg.replace('width="951.75"', 'width="952.75"'),
    svg.replace('>320 000<', '>320 001<'),
    svg.replace('font-size="82"', 'font-size="81"'),
  ]) assert.throws(() => assertCarbonSourceFaithful(replacement, 'fr', 0));
  for (const payload of ['<script/>', '<foreignObject/>', '<image href="https://example.com/x"/>']) {
    assert.throws(() => inspectCarbonSvg(svg.replace('</svg>', `${payload}</svg>`)));
  }
  assert.throws(() => inspectCarbonSvg(svg.replace('<svg ', '<svg onload="void(0)" ')));
  assert.throws(() => inspectCarbonSvg(svg.replace('fill="var(--color-ink)"', 'fill="#FAF8F2"')));
  assert.throws(() => inspectCarbonSvg(svg.replace('fill="var(--color-ink)"', 'fill="url(https://example.com/x)"')));
  assert.throws(() => assertCarbonGeometry(svg.replace('x="821" y="240"', 'x="1150" y="240"')), /internal panel|viewBox/u);
  assert.throws(() => assertCarbonGeometry(svg.replace('x="36" y="42"', 'x="1190" y="42"')), /viewBox/u);
});

test('figure-only stylesheet follows semantic themes, compact proportions and complete mobile variants', () => {
  const raw = read('public/styles/google-carbon-infographics-v1.css');
  const css = postcss.parse(raw);
  const declarations = node => Object.fromEntries(node.nodes.filter(n => n.type === 'decl').map(n => [n.prop, n.value]));
  const rule = selector => {
    const node = css.nodes.find(n => n.type === 'rule' && n.selector === selector);
    assert.ok(node, selector);
    return declarations(node);
  };
  const figure = rule('.prose figure.l0g-cc-figure');
  assert.deepEqual([figure.width, figure['max-width'], figure.overflow, figure['container-type'], figure['padding-bottom']], ['100%', '48rem', 'visible', 'inline-size', '1rem']);
  const svg = rule('.l0g-cc-figure svg');
  assert.deepEqual([svg.width, svg['max-width'], svg.height, svg.overflow], ['100%', '100%', 'auto', 'visible']);
  assert.equal(rule('.l0g-cc-figure .cc-panel').background, 'var(--color-ink)');
  assert.equal(rule('.l0g-cc-figure .cc-mobile')['max-width'], '24rem');
  assert.equal(rule('.l0g-cc-figure svg text')['font-family'], "'l0g Carbon', 'DejaVu Sans', Arial, sans-serif");
  const faces = css.nodes.filter(n => n.type === 'atrule' && n.name === 'font-face').map(declarations);
  assert.deepEqual(faces.map(d => [d['font-family'], d.src, d['font-weight']]), [400, 700].map(weight => ["'l0g Carbon'", `url('/fonts/google-carbon/dejavu-sans-${weight}.ttf') format('truetype')`, String(weight)]));
  for (const kind of ['media', 'container']) {
    const at = css.nodes.find(n => n.type === 'atrule' && n.name === kind && n.params === `(max-width: ${kind === 'media' ? 700 : 640}px)`);
    assert.ok(at);
    assert.deepEqual(at.nodes.map(n => [n.selector, declarations(n).display]), [['.l0g-cc-figure .cc-mobile', 'block'], ['.l0g-cc-figure .cc-desktop', 'none']]);
  }
  css.walkRules(node => assert.ok(node.selector.split(',').every(selector => selector.includes('.l0g-cc-figure')), `Figure-only selector: ${node.selector}`));
  assert.doesNotMatch(raw, /#(?:[a-f0-9]{3}){1,2}\b|overflow\s*:\s*(?:hidden|clip)|(?:clip-path|transform)\s*:/iu);
});

test('local font subsets retain checked official glyphs and the complete original licence', () => {
  const hashes = {
    400: '0ed21bfbc6f9a96fee9c790b2d687d24b85d020d4a7b90ddc7a25e77b3538740',
    700: 'f3105e92ba21dcd4dde08e3755ce8232ad1e8b07c4ea096df3ab4e2d7acfc8ba',
  };
  for (const [weight, hash] of Object.entries(hashes)) {
    const bytes = readFileSync(new URL(`../public/fonts/google-carbon/dejavu-sans-${weight}.ttf`, import.meta.url));
    assert.equal(createHash('sha256').update(bytes).digest('hex'), hash);
    assert.ok(bytes.length < 50000);
  }
  const licence = read('public/fonts/google-carbon/LICENSE.txt');
  assertFontLicenseReferences(licence, 'dejavu');
  assert.equal(createHash('sha256').update(licence.slice(licence.indexOf('Fonts are (c) Bitstream'))).digest('hex'), 'f88d5294af5a772f9114eb385009e3478d62b21f3e5bbc34d159d328047c8867');
});

test('bibliography keeps every source ID and SVG source labels point to that exact local entry', () => {
  for (const [i, article] of articles.entries()) {
    assert.equal((article.match(/<ol class="sources-list" role="list">/gu) ?? []).length, 1);
    const ids = [...article.matchAll(/<li id="source-(S[0-9]+)">/gu)].map(m => m[1]);
    assert.deepEqual(ids, Array.from({ length: 23 }, (_, index) => `S${String(index + 1).padStart(2, '0')}`));
    assert.equal((article.match(/class="source-meta"/gu) ?? []).length, 23);
    assert.doesNotMatch(article, /className="(?:cc-reference|cc-sources|source-item|source-url|sid)"/u);
    for (const [j, svg] of figures[i].entries()) {
      assertCarbonSourceFaithful(svg, i ? 'en' : 'fr', j);
      const link = svg.match(/href="(#source-S[0-9]+)"/u)?.[1];
      if (!link) continue;
      for (const replacement of [`${link}-suffix`, `${link}?x=1`, `${link}#extra`, '#source-S99', '#source-s01', 'https://example.com/x']) {
        assert.throws(() => inspectCarbonSvg(svg.replace(`href="${link}"`, `href="${replacement}"`)));
      }
    }
  }
});

test('SVG presentation attributes use standards-compliant names in generated HTML', () => {
  const svg = figures[0][0];
  for (const [from, to] of Object.entries({ 'font-size': 'fontSize', 'font-family': 'fontFamily', 'font-weight': 'fontWeight', 'text-anchor': 'textAnchor', 'stroke-width': 'strokeWidth' })) {
    assert.ok(svg.includes(`${from}=`));
    assert.throws(() => inspectCarbonSvg(svg.replace(`${from}=`, `${to}=`)), /standards-compliant names/u);
  }
});

// SVG can be XML-valid while MDX classifies its outer wrappers as a paragraph.
// Compile both complete article bodies as Astro does after extracting YAML frontmatter.
test('complete bilingual MDX compiles and emits native SVG without inserted paragraph tags', async () => {
  for (const article of articles) {
    const body = article.replace(/^---\n[\s\S]*?\n---\n/u, '');
    const compiled = String(await compile(body, { jsx: true }));
    const graphics = [...compiled.matchAll(/<svg\b[\s\S]*?<\/svg>/gu)].map(match => match[0]);
    assert.equal(graphics.length, 12);
    for (const svg of graphics) {
      assert.doesNotMatch(svg, /<(?:_components\.)?p(?:\s|>)/u, 'Compiled SVG must not contain HTML paragraphs');
    }
  }
});
