import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { parse, serializeOuter } from 'parse5';
import { assertCarbonRenderedFaithful, carbonSourceFigures } from './google-carbon-svg-assertions.mjs';

const read = file => readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
const nodes = node => [node, ...(node.childNodes ?? []).flatMap(nodes)];
const attrs = node => Object.fromEntries((node.attrs ?? []).map(a => [a.name, a.value]));
const text = node => node.nodeName === '#text' ? node.value : (node.childNodes ?? []).map(text).join('');
const pages = [
  { lang: 'fr', section: 'posts', folder: 'posts', slug: 'google-mckinsey-carbone-paturages' },
  { lang: 'en', section: 'en/analysis', folder: 'posts-en', slug: 'google-mckinsey-pasture-carbon-timber' },
].map(page => ({
  ...page,
  html: read(`dist/${page.section}/${page.slug}/index.html`),
  originals: carbonSourceFigures(read(`src/content/${page.folder}/${page.slug}.mdx`)),
}));

function assertPageFigures(html, originals, lang) {
  const all = nodes(parse(html));
  const figures = all.filter(n => n.tagName === 'figure' && (attrs(n).class ?? '').split(' ').includes('l0g-cc-figure'));
  assert.equal(figures.length, 6);
  const stylesheet = all.filter(n => n.tagName === 'link' && attrs(n).rel === 'stylesheet' && attrs(n).href === '/styles/google-carbon-infographics-v1.css');
  assert.equal(stylesheet.length, 1, 'Only the current article includes its figure stylesheet');
  for (const [index, figure] of figures.entries()) {
    assert.equal(attrs(figure).id, `figure-${String(index + 1).padStart(2, '0')}`);
    const descendants = nodes(figure), graphics = descendants.filter(n => n.tagName === 'svg');
    assert.equal(graphics.length, 2, 'Both complete desktop and mobile compositions remain inline');
    for (const [variant, svg] of graphics.entries()) assertCarbonRenderedFaithful(serializeOuter(svg), originals[index * 2 + variant], lang, index * 2 + variant);
    for (const variant of ['cc-desktop', 'cc-mobile']) assert.ok(descendants.some(n => n.tagName === 'div' && (attrs(n).class ?? '').split(' ').includes(variant)));
    const captions = descendants.filter(n => n.tagName === 'figcaption');
    assert.equal(captions.length, 1);
    assert.ok(text(captions[0]).length > 60);
    assert.equal(descendants.filter(n => n.tagName === 'details').length, 1, 'Every original numerical method note remains with its figure');
  }
  const ids = all.map(n => attrs(n).id).filter(Boolean);
  assert.equal(ids.length, new Set(ids).size, 'Document IDs stay unique across all inline compositions');
  for (const node of all.filter(n => n.tagName === 'a' && (attrs(n).href ?? '').startsWith('#'))) {
    assert.ok(ids.includes(attrs(node).href.slice(1)), `Local reference resolves: ${attrs(node).href}`);
  }
  return true;
}

test('compiled bilingual pages retain all complete accessible SVGs, local references and data notes', () => {
  for (const page of pages) assertPageFigures(page.html, page.originals, page.lang);
  for (const path of ['dist/index.html', 'dist/en/index.html']) {
    assert.doesNotMatch(read(path), /google-carbon-infographics-v1\.css/u, 'Figure-only stylesheet stays off both homepages');
  }
});

test('compiled source-label, coordinate, sizing and missing-mobile regressions fail closed', () => {
  const page = pages[0];
  for (const mutation of [
    html => html.replace('>320 000<', '>320 001<'),
    html => html.replace('width="951.75"', 'width="952.75"'),
    html => html.replace('viewBox="0 0 720 1210"', 'viewBox="0 0 720 1211"'),
    html => html.replace('style="width:100%;height:auto"', 'style="width:1100px;height:auto"'),
    html => html.replace('class="cc-panel cc-mobile"', 'class="cc-panel removed-variant"'),
  ]) assert.throws(() => assertPageFigures(mutation(page.html), page.originals, page.lang));
});
