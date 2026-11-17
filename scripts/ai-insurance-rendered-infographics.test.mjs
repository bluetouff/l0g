import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { parse, serializeOuter } from 'parse5';
import { insuranceKinds, readInsuranceSvg, inspectInsuranceSvg, assertInsuranceBars, tag, attrs, children, text } from './ai-insurance-svg-assertions.mjs';

const walk = node => [node, ...(node.childNodes ?? []).flatMap(walk)];
const attr = (node, key) => node.attrs?.find(a => a.name === key)?.value;
const hasClass = (node, name) => (attr(node, 'class') ?? '').split(/\s+/u).includes(name);
const routes = { fr: 'posts/ia-assureurs-garanties-risque-hors-bilan', en: 'en/analysis/ai-insurers-guarantees-off-balance-sheet-risk' };
const plainTree = node => tag(node) === '#text' ? text(node) : [tag(node), Object.entries(attrs(node)).sort(), children(node).filter(n => tag(n) !== '#text' || text(n).trim()).map(plainTree)];

function assertRendered(html, lang) {
  const all = walk(parse(html));
  const figures = all.filter(n => n.tagName === 'figure' && hasClass(n, 'ai-insurance'));
  assert.equal(figures.length, 3, 'Three complete insurance figures');
  const ids = all.map(n => attr(n, 'id')).filter(Boolean);
  assert.equal(ids.length, new Set(ids).size, 'Document and inline SVG IDs are unique');
  for (const [i, figure] of figures.entries()) {
    const kind = insuranceKinds[i], inside = walk(figure), figureId = attr(figure, 'id');
    assert.equal(attr(figure, 'data-kind'), kind);
    const svg = inside.filter(n => n.tagName === 'svg');
    assert.equal(svg.length, 2, 'Both responsive SVGs remain inline');
    for (const [j, node] of svg.entries()) {
      const raw = serializeOuter(node), actual = inspectInsuranceSvg(raw);
      const expectedRaw = readInsuranceSvg({ lang, kind, mobile: j === 1 }).replaceAll(`ai-insurance-${lang}-${kind}-`, `${figureId}-${lang}-${kind}-`);
      const expected = inspectInsuranceSvg(expectedRaw);
      assert.ok(JSON.stringify(plainTree(actual.root)) === JSON.stringify(plainTree(expected.root)), `${lang}/${kind}: complete native drawing, text and local references`);
      if (kind === 'portfolio') assertInsuranceBars(raw);
      assert(hasClass(node.parentNode, j ? 'figure-narrow' : 'figure-wide'));
    }
    const caption = inside.filter(n => n.tagName === 'figcaption');
    assert.equal(caption.length, 1);
    const expectedSource = ['S06', 'S08', 'S09'][i];
    assert(walk(caption[0]).some(n => n.tagName === 'a' && attr(n, 'href') === `#source-${expectedSource}`));
    assert(ids.includes(`source-${expectedSource}`), 'Figure source resolves to the numbered catalogue');
  }
}

test('actual FR/EN pages preserve all twelve complete SVGs, local IDs and source anchors', () => {
  for (const lang of ['fr', 'en']) assertRendered(readFileSync(new URL(`../dist/${routes[lang]}/index.html`, import.meta.url), 'utf8'), lang);
});

test('rendered contract rejects a missing layout, a changed drawing and a broken source anchor', () => {
  const html = readFileSync(new URL(`../dist/${routes.fr}/index.html`, import.meta.url), 'utf8');
  const changes = [
    html.replace(/(<figure\b[^>]*data-kind="lookthrough"[^>]*>[\s\S]*?)<svg\b[\s\S]*?<\/svg>/u, '$1'),
    html.replace('class="ai-insurance-svg"', 'class="changed-drawing"'),
    html.replace(/(<figure\b[^>]*data-kind="lookthrough"[\s\S]*?<figcaption\b[\s\S]*?href=")#source-S06"/u, '$1#source-S99"'),
  ];
  for (const changed of changes) { assert.notEqual(changed, html); assert.throws(() => assertRendered(changed, 'fr')); }
});
