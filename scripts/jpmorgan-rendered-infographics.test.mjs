import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { parse, serializeOuter } from 'parse5';
import { assertJpmRenderedFaithful, jpmSourceFigures } from './jpmorgan-svg-assertions.mjs';

const read = file => readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
const nodes = node => [node, ...(node.childNodes ?? []).flatMap(nodes)];
const attrs = node => Object.fromEntries((node.attrs ?? []).map(a => [a.name, a.value]));
const pages = [
  { lang: 'fr', section: 'posts', folder: 'posts', slug: 'jpmorgan-capital-strategique' },
  { lang: 'en', section: 'en/analysis', folder: 'posts-en', slug: 'jpmorgan-industrial-power-investment' },
].map(page => ({ ...page, html: read(`dist/${page.section}/${page.slug}/index.html`), originals: jpmSourceFigures(read(`src/content/${page.folder}/${page.slug}.mdx`)) }));

function assertPageFigures(html, originals, lang) {
  const all = nodes(parse(html)), figures = all.filter(node => node.tagName === 'figure' && (attrs(node).class ?? '').split(' ').includes('l0g-jpm-figure'));
  assert.equal(figures.length, 6);
  assert.equal(all.filter(node => node.tagName === 'link' && attrs(node).rel === 'stylesheet' && attrs(node).href === '/styles/jpmorgan-infographics-v1.css').length, 1);
  for (const [index, figure] of figures.entries()) {
    const descendants = nodes(figure), graphics = descendants.filter(node => node.tagName === 'svg');
    assert.equal(attrs(figure).id, `figure-${index + 1}`);
    assert.equal(graphics.length, 2);
    for (const [variant, svg] of graphics.entries()) assertJpmRenderedFaithful(serializeOuter(svg), originals[index * 2 + variant], lang, index * 2 + variant);
    for (const kind of ['jpm-desktop', 'jpm-mobile']) assert.ok(descendants.some(node => node.tagName === 'div' && (attrs(node).class ?? '').split(' ').includes(kind)));
    assert.equal(descendants.filter(node => node.tagName === 'figcaption').length, 1);
    assert.equal(descendants.filter(node => node.tagName === 'details').length, 1);
  }
  const ids = all.map(node => attrs(node).id).filter(Boolean);
  assert.equal(ids.length, new Set(ids).size);
  for (const node of all.filter(node => node.tagName === 'a' && (attrs(node).href ?? '').startsWith('#source-'))) assert.ok(ids.includes(attrs(node).href.slice(1)));
}

test('compiled bilingual pages retain all complete inline SVGs, references, arithmetic and method notes', () => {
  for (const page of pages) assertPageFigures(page.html, page.originals, page.lang);
  for (const path of ['dist/index.html', 'dist/en/index.html']) assert.doesNotMatch(read(path), /jpmorgan-infographics-v1\.css/u);
});

test('compiled coordinate, sizing, label, reference and missing-mobile regressions fail closed', () => {
  const page = pages[0];
  for (const mutate of [
    html => html.replace('>1 500<', '>1 501<'),
    html => html.replace('width="251"', 'width="252"'),
    html => html.replace('viewBox="0 0 1200 788"', 'viewBox="0 0 1200 789"'),
    html => html.replace('style="width:100%;height:auto"', 'style="width:1100px;height:auto"'),
    html => html.replace('class="jpm-mobile"', 'class="removed-variant"'),
    html => html.replace('href="#source-S01"', 'href="#source-S99"'),
  ]) assert.throws(() => assertPageFigures(mutate(page.html), page.originals, page.lang));
});
