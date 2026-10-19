import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { parse, serializeOuter } from 'parse5';
import { assertDalianRenderedFaithful, dalianSourceFigures } from './sk-hynix-dalian-svg-assertions.mjs';

const read = file => readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
const nodes = node => [node, ...(node.childNodes ?? []).flatMap(nodes)];
const attrs = node => Object.fromEntries((node.attrs ?? []).map(a => [a.name, a.value]));
const text = node => node.nodeName === '#text' ? node.value : (node.childNodes ?? []).map(text).join('');
const target = 'sk-hynix-dalian-usine-americaine-financement';
const pages = ['fr', 'en'].map(lang => ({
  lang,
  html: read(`dist/${lang === 'fr' ? 'posts' : 'en/analysis'}/${target}/index.html`),
  originals: dalianSourceFigures(read(`src/content/${lang === 'fr' ? 'posts' : 'posts-en'}/${target}.mdx`)),
}));

function assertPageFigures(html, originals, lang) {
  const tree = parse(html), all = nodes(tree);
  const figures = all.filter(n => n.tagName === 'figure' && (attrs(n).class ?? '').split(' ').includes('l0g-sk-figure'));
  assert.equal(figures.length, 6);
  for (const [index, figure] of figures.entries()) {
    assert.equal(attrs(figure).id, `figure-${String(index + 1).padStart(2, '0')}`);
    const descendants = nodes(figure), graphics = descendants.filter(n => n.tagName === 'svg');
    assert.equal(graphics.length, 2, 'Both complete desktop and mobile compositions remain inline');
    for (const [variant, svg] of graphics.entries()) assertDalianRenderedFaithful(serializeOuter(svg), originals[index * 2 + variant], lang, index * 2 + variant);
    assert.ok(descendants.some(n => n.tagName === 'div' && (attrs(n).class ?? '').split(' ').includes('sk-desktop')));
    assert.ok(descendants.some(n => n.tagName === 'div' && (attrs(n).class ?? '').split(' ').includes('sk-mobile')));
    const captions = descendants.filter(n => n.tagName === 'figcaption');
    assert.equal(captions.length, 1); assert.ok(text(captions[0]).length > 60);
    assert.equal(descendants.filter(n => n.tagName === 'details').length, [3, 5].includes(index) ? 1 : 0, 'Both original numerical method notes remain with their figures');
  }
  const ids = all.map(n => attrs(n).id).filter(Boolean);
  assert.equal(ids.length, new Set(ids).size, 'Document IDs stay unique across all 12 inline SVGs');
  for (const node of all.filter(n => n.tagName === 'a' && (attrs(n).href ?? '').startsWith('#'))) {
    assert.ok(ids.includes(attrs(node).href.slice(1)), `Local reference resolves: ${attrs(node).href}`);
  }
  return true;
}

test('compiled bilingual pages retain all 24 complete, accessible Dalian SVGs and source links', () => {
  for (const page of pages) assertPageFigures(page.html, page.originals, page.lang);
});

test('compiled regression rejects source-label changes, shifted geometry and missing mobile compositions', () => {
  const page = pages[0];
  for (const mutation of [
    html => html.replace('>DALIAN<', '>Changed label<'),
    html => html.replace('width="342"', 'width="343"'),
    html => html.replace('viewBox="0 0 640 1170"', 'viewBox="0 0 640 1171"'),
    html => html.replace('style="width:100%;height:auto"', 'style="width:1100px;height:auto"'),
    html => html.replace('class="diagram sk-mobile"', 'class="diagram removed-variant"'),
  ]) assert.throws(() => assertPageFigures(mutation(page.html), page.originals, page.lang));
});
