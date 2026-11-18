import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { parse, parseFragment, serializeOuter } from 'parse5';
import { inspectInsuranceSvg as inspectSvg, tag, attrs, children, text } from './ai-insurance-svg-assertions.mjs';

const walk = n => [n, ...(n.childNodes ?? []).flatMap(walk)];
const attr = (n, key) => n.attrs?.find(a => a.name === key)?.value;
const hasClass = (n, value) => (attr(n, 'class') ?? '').split(/\s+/u).includes(value);
const kinds = ['surety', 'trap', 'reserves'];
const routes = { fr: 'posts/dette-ia-tresorerie-clauses-contrats', en: 'en/analysis/ai-debt-cash-contract-conditions' };
const plain = n => tag(n) === '#text' ? text(n) : [tag(n), Object.entries(attrs(n)).sort(), children(n).filter(c => tag(c) !== '#text' || text(c).trim()).map(plain)];
const browserSvg = raw => {
  inspectSvg(raw);
  // HTML decodes numeric XML entities; retain the complete resulting SVG tree.
  const svg = parseFragment(raw).childNodes.find(n => n.tagName === 'svg');
  assert(svg, 'Validated source remains an SVG in HTML');
  return plain(inspectSvg(serializeOuter(svg)).root);
};

function assertPage(html, lang) {
  const all = walk(parse(html)), ids = all.map(n => attr(n, 'id')).filter(Boolean);
  assert.equal(ids.length, new Set(ids).size, 'Unique document and SVG IDs');
  const figures = all.filter(n => n.tagName === 'figure' && hasClass(n, 'ai-cash-flow'));
  assert.equal(figures.length, 3);
  for (const [i, figure] of figures.entries()) {
    const kind = kinds[i], inside = walk(figure), figureId = attr(figure, 'id');
    assert.equal(attr(figure, 'data-kind'), kind);
    const svgs = inside.filter(n => n.tagName === 'svg'); assert.equal(svgs.length, 2);
    for (const [j, svg] of svgs.entries()) {
      const source = readFileSync(new URL(`../src/figures/ai-cash/ai-cash-${kind}-${lang}${j ? '-mobile' : ''}.svg`, import.meta.url), 'utf8').replaceAll(`ai-cash-${lang}-${kind}-`, `${figureId}-${lang}-${kind}-`);
      assert.ok(JSON.stringify(plain(inspectSvg(serializeOuter(svg)).root)) === JSON.stringify(browserSvg(source)), `${lang}/${kind}: complete inline SVG and local references`);
      assert(hasClass(svg.parentNode, j ? 'figure-narrow' : 'figure-wide'));
    }
    const caption = inside.filter(n => n.tagName === 'figcaption'); assert.equal(caption.length, 1);
    const source = ['S01', 'S04', 'S06'][i];
    assert(walk(caption[0]).some(n => n.tagName === 'a' && attr(n, 'href') === `#source-${source}`));
    assert(ids.includes(`source-${source}`), 'Figure source resolves to the numbered catalogue');
  }
}

test('actual FR/EN retain twelve complete cash-flow SVGs and their source anchors', () => {
  for (const lang of ['fr', 'en']) assertPage(readFileSync(new URL(`../dist/${routes[lang]}/index.html`, import.meta.url), 'utf8'), lang);
});

test('rendered guards reject a dropped layout, changed drawing or forged source anchor', () => {
  const html = readFileSync(new URL(`../dist/${routes.fr}/index.html`, import.meta.url), 'utf8');
  assertPage(html, 'fr');
  for (const bad of [html.replace(/(<figure\b[^>]*data-kind="surety"[^>]*>[\s\S]*?)<svg\b[\s\S]*?<\/svg>/u, '$1'), html.replace('class="ai-cash-svg"', 'class="changed-drawing"'), html.replace(/(<figure\b[^>]*data-kind="surety"[\s\S]*?<figcaption\b[\s\S]*?href=")#source-S01"/u, '$1#source-S99"')]) {
    assert.ok(bad !== html, 'Mutation changes the rendered fixture'); assert.throws(() => assertPage(bad, 'fr'));
  }
  const english = readFileSync(new URL(`../dist/${routes.en}/index.html`, import.meta.url), 'utf8');
  assertPage(english, 'en');
  const changedDescription = english.replace(/(<desc\b[^>]*>APLD ComputeCo )2/u, (_, prefix) => `${prefix}9`);
  assert.ok(changedDescription !== english, 'Description mutation changes the rendered fixture');
  assert.throws(() => assertPage(changedDescription, 'en'));
});
