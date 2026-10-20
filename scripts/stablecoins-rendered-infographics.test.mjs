import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import test from 'node:test';
import { parse, serializeOuter } from 'parse5';
import { assertStablecoinsProportions, assertStablecoinsRenderedFaithful, stablecoinsSourceFigures } from './stablecoins-svg-assertions.mjs';

const read = file => readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
const stylesheetBase = '/styles/stablecoins-infographics-v1.css';
const stylesheetHash = createHash('sha256').update(readFileSync(new URL(`../public${stylesheetBase}`, import.meta.url))).digest('hex').slice(0, 12);
const stylesheetHref = `${stylesheetBase}?v=${stylesheetHash}`;
const nodes = node => [node, ...(node.childNodes ?? []).flatMap(nodes)];
const attrs = node => Object.fromEntries((node.attrs ?? []).map(a => [a.name, a.value]));
const pages = [
  { lang: 'fr', section: 'posts', folder: 'posts', slug: 'stablecoins-fiscalite-calcul-plus-values' },
  { lang: 'en', section: 'en/analysis', folder: 'posts-en', slug: 'france-stablecoin-tax-capital-gains' },
].map(page => ({ ...page, html: read(`dist/${page.section}/${page.slug}/index.html`), originals: stablecoinsSourceFigures(read(`src/content/${page.folder}/${page.slug}.mdx`)) }));

function assertPageFigures(html, originals, lang) {
  const all = nodes(parse(html)), figures = all.filter(node => node.tagName === 'figure' && (attrs(node).class ?? '').split(' ').includes('l0g-stablecoins-figure'));
  assert.equal(figures.length, 6);
  const stylesheets = all.filter(node => node.tagName === 'link' && attrs(node).rel === 'stylesheet' && (attrs(node).href ?? '').startsWith(stylesheetBase)).map(node => attrs(node).href);
  assert.deepEqual(stylesheets, [stylesheetHref], 'Compiled stylesheet link must carry the exact current CSS content fingerprint');
  for (const [index, figure] of figures.entries()) {
    const descendants = nodes(figure), graphics = descendants.filter(node => node.tagName === 'svg');
    assert.equal(attrs(figure).id, `figure-${index + 1}`);
    assert.equal(graphics.length, 2);
    for (const [variant, svg] of graphics.entries()) {
      assertStablecoinsRenderedFaithful(serializeOuter(svg), originals[index * 2 + variant], lang, index * 2 + variant);
      assertStablecoinsProportions(serializeOuter(svg));
    }
    for (const kind of ['l0g-stablecoins-desktop', 'l0g-stablecoins-mobile']) assert.ok(descendants.some(node => node.tagName === 'div' && (attrs(node).class ?? '').split(' ').includes(kind)));
    assert.equal(descendants.filter(node => node.tagName === 'figcaption').length, 1);
  }
  assert.equal(all.filter(node => node.tagName === 'section' && (attrs(node).class ?? '').split(' ').includes('method')).length, 1);
  assert.equal(all.filter(node => node.tagName === 'ol' && (attrs(node).class ?? '').split(' ').includes('sources-list')).length, 1);
  assert.equal(all.filter(node => node.tagName === 'li' && /^source-S[0-9]{2}$/u.test(attrs(node).id ?? '')).length, 16);
  for (const li of all.filter(node => node.tagName === 'li' && /^source-S[0-9]{2}$/u.test(attrs(node).id ?? ''))) {
    const citation = nodes(li); assert.ok(citation.filter(n => n.nodeName === '#text').map(n => n.value).join('').trim().length > 60, 'Every source retains its citation metadata');
    assert.ok(citation.some(n => n.tagName === 'a' && /^https:\/\//u.test(attrs(n).href ?? '')), 'Every source retains its external canonical link');
  }
  const ids = all.map(node => attrs(node).id).filter(Boolean);
  assert.equal(ids.length, new Set(ids).size);
  for (const node of all.filter(node => node.tagName === 'a' && (attrs(node).href ?? '').startsWith('#source-'))) assert.ok(ids.includes(attrs(node).href.slice(1)));
}

test('compiled bilingual pages retain all complete inline SVGs, references, arithmetic and method notes', () => {
  for (const page of pages) assertPageFigures(page.html, page.originals, page.lang);
  for (const path of ['dist/index.html', 'dist/en/index.html']) assert.doesNotMatch(read(path), /stablecoins-infographics-v1\.css/u);
});

// Bound mutations to the article graphic. A page has header icons before the
// article; a regex spanning their closing SVG can otherwise mutate prose.
const mutateFirstFigure = (html, mutate) => {
  const matches = [...html.matchAll(/<svg\b[^>]*aria-labelledby="stablecoins-1-fr-d-title stablecoins-1-fr-d-desc"[^>]*>[\s\S]*?<\/svg>/gu)];
  assert.equal(matches.length, 1, 'The first article SVG is located uniquely');
  const original = matches[0][0], changed = mutate(original);
  assert.notEqual(changed, original, 'The intended SVG mutation changes the graphic');
  return html.replace(original, changed);
};

test('compiled coordinate, sizing, label, reference and missing-mobile regressions fail closed', () => {
  const page = pages[0];
  for (const [label, mutate] of [
    ['figure label', html => mutateFirstFigure(html, svg => svg.replace('20 000', '20 001'))],
    ['viewBox', html => mutateFirstFigure(html, svg => svg.replace('viewBox="0 0 1000 800"', 'viewBox="0 0 1000 801"'))],
    ['responsive sizing', html => mutateFirstFigure(html, svg => svg.replace('style="width:100%;height:auto"', 'style="width:1100px;height:auto"'))],
    ['mobile variant', html => html.replace('class="l0g-stablecoins-mobile"', 'class="removed-variant"')],
    ['citation target', html => html.replace('href="#source-S01"', 'href="#source-S99"')],
    ['empty source', html => html.replace(/<li id="source-S01">[\s\S]*?<\/li>/u, '<li id="source-S01"></li>')],
    ['missing CSS fingerprint', html => html.replace(stylesheetHref, stylesheetBase)],
    ['stale CSS fingerprint', html => html.replace(stylesheetHref, `${stylesheetBase}?v=000000000000`)],
  ]) {
    const changed = mutate(page.html);
    assert.notEqual(changed, page.html, `${label}: regression must mutate the current compiled HTML`);
    assert.throws(() => assertPageFigures(changed, page.originals, page.lang), `${label}: regression must be rejected`);
  }
});
