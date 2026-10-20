import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import test from 'node:test';
import { parse, serializeOuter } from 'parse5';
import { assertPredictstreetProportions, assertPredictstreetRenderedFaithful, predictstreetSourceFigures } from './predictstreet-svg-assertions.mjs';

const read = file => readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
const stylesheetBase = '/styles/predictstreet-infographics-v1.css';
const stylesheetHash = createHash('sha256').update(readFileSync(new URL(`../public${stylesheetBase}`, import.meta.url))).digest('hex').slice(0, 12);
const stylesheetHref = `${stylesheetBase}?v=${stylesheetHash}`;
const nodes = node => [node, ...(node.childNodes ?? []).flatMap(nodes)];
const attrs = node => Object.fromEntries((node.attrs ?? []).map(a => [a.name, a.value]));
const pages = [
  { lang: 'fr', section: 'posts', folder: 'posts', slug: 'fifa-predictstreet-volume-wash-trading' },
  { lang: 'en', section: 'en/analysis', folder: 'posts-en', slug: 'fifa-predictstreet-trading-volume-risk' },
].map(page => ({ ...page, html: read(`dist/${page.section}/${page.slug}/index.html`), originals: predictstreetSourceFigures(read(`src/content/${page.folder}/${page.slug}.mdx`)) }));

function assertPageFigures(html, originals, lang) {
  const all = nodes(parse(html)), figures = all.filter(node => node.tagName === 'figure' && (attrs(node).class ?? '').split(' ').includes('l0g-predict-figure'));
  assert.equal(figures.length, 6);
  const stylesheets = all.filter(node => node.tagName === 'link' && attrs(node).rel === 'stylesheet' && (attrs(node).href ?? '').startsWith(stylesheetBase)).map(node => attrs(node).href);
  assert.deepEqual(stylesheets, [stylesheetHref], 'Compiled stylesheet link must carry the exact current CSS content fingerprint');
  for (const [index, figure] of figures.entries()) {
    const descendants = nodes(figure), graphics = descendants.filter(node => node.tagName === 'svg');
    assert.equal(attrs(figure).id, `figure-${index + 1}`);
    assert.equal(graphics.length, 2);
    for (const [variant, svg] of graphics.entries()) {
      assertPredictstreetRenderedFaithful(serializeOuter(svg), originals[index * 2 + variant], lang, index * 2 + variant);
      assertPredictstreetProportions(serializeOuter(svg));
    }
    for (const kind of ['predict-desktop', 'predict-mobile']) assert.ok(descendants.some(node => node.tagName === 'div' && (attrs(node).class ?? '').split(' ').includes(kind)));
    assert.equal(descendants.filter(node => node.tagName === 'figcaption').length, 1);
  }
  assert.equal(all.filter(node => node.tagName === 'section' && (attrs(node).class ?? '').split(' ').includes('method')).length, 1);
  assert.equal(all.filter(node => node.tagName === 'ol' && (attrs(node).class ?? '').split(' ').includes('sources-list')).length, 1);
  assert.equal(all.filter(node => node.tagName === 'li' && /^source-S[0-9]{2}$/u.test(attrs(node).id ?? '')).length, 14);
  const ids = all.map(node => attrs(node).id).filter(Boolean);
  assert.equal(ids.length, new Set(ids).size);
  for (const node of all.filter(node => node.tagName === 'a' && (attrs(node).href ?? '').startsWith('#source-'))) assert.ok(ids.includes(attrs(node).href.slice(1)));
}

test('compiled bilingual pages retain all complete inline SVGs, references, arithmetic and method notes', () => {
  for (const page of pages) assertPageFigures(page.html, page.originals, page.lang);
  for (const path of ['dist/index.html', 'dist/en/index.html']) assert.doesNotMatch(read(path), /predictstreet-infographics-v1\.css/u);
});

test('compiled coordinate, sizing, label, reference and missing-mobile regressions fail closed', () => {
  const page = pages[0];
  for (const mutate of [
    html => html.replace('167 M$', '168 M$'),
    html => html.replace('width="1000"', 'width="1001"'),
    html => html.replace('viewBox="0 0 1000 770"', 'viewBox="0 0 1000 771"'),
    html => html.replace('style="width:100%;height:auto"', 'style="width:1100px;height:auto"'),
    html => html.replace('class="predict-mobile"', 'class="removed-variant"'),
    html => html.replace('href="#source-S01"', 'href="#source-S99"'),
    html => html.replace(stylesheetHref, stylesheetBase),
    html => html.replace(stylesheetHref, `${stylesheetBase}?v=000000000000`),
  ]) {
    const changed = mutate(page.html);
    assert.notEqual(changed, page.html, 'Each regression must mutate the current compiled HTML');
    assert.throws(() => assertPageFigures(changed, page.originals, page.lang));
  }
});
