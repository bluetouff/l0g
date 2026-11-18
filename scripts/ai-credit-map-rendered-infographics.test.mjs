import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { XMLParser, XMLValidator } from 'fast-xml-parser';
import { parse, parseFragment, serializeOuter } from 'parse5';
import { inspectInsuranceSvg as inspectSvg, tag, attrs, children, text } from './ai-insurance-svg-assertions.mjs';

const walk = n => [n, ...(n.childNodes ?? []).flatMap(walk)];
const attr = (n, key) => n.attrs?.find(a => a.name === key)?.value;
const hasClass = (n, value) => (attr(n, 'class') ?? '').split(/\s+/u).includes(value);
const kinds = ['holdings', 'bridge', 'market'];
const routes = { fr: 'posts/dette-ia-cartographie-banques-fonds-assureurs', en: 'en/analysis/ai-debt-map-banks-funds-insurers' };
const xml = new XMLParser({ preserveOrder: true, ignoreAttributes: false, attributeNamePrefix: '', trimValues: false, parseTagValue: false, parseAttributeValue: false });
const tree = raw => { inspectMapSvg(raw); return plain(xml.parse(raw).find(n => tag(n) === 'svg')); };
const plain = n => tag(n) === '#text' ? text(n) : [tag(n), Object.entries(attrs(n)).sort(), children(n).filter(c => tag(c) !== '#text' || text(c).trim()).map(plain)];
const inspectMapSvg = raw => {
  assert(raw.length < 50_000, 'Bounded local SVG');
  assert.equal(XMLValidator.validate(raw), true, 'Original XML remains well formed');
  return inspectSvg(raw.replace(/ opacity="(?:0\.65|0\.95)"/gu, ''));
};
const browserSvg = raw => {
  inspectMapSvg(raw);
  // HTML decodes numeric XML entities; retain the complete resulting SVG tree.
  const svg = parseFragment(raw).childNodes.find(n => n.tagName === 'svg');
  assert(svg, 'Validated source remains an SVG in HTML');
  return tree(serializeOuter(svg));
};

function assertPage(html, lang) {
  const all = walk(parse(html)), ids = all.map(n => attr(n, 'id')).filter(Boolean);
  assert.equal(ids.length, new Set(ids).size, 'Unique document and SVG IDs');
  const figures = all.filter(n => n.tagName === 'figure' && hasClass(n, 'ai-credit-map'));
  assert.equal(figures.length, 3);
  for (const [i, figure] of figures.entries()) {
    const kind = kinds[i], inside = walk(figure), figureId = attr(figure, 'id');
    assert.equal(attr(figure, 'data-kind'), kind);
    const svgs = inside.filter(n => n.tagName === 'svg'); assert.equal(svgs.length, 2);
    for (const [j, svg] of svgs.entries()) {
      const source = readFileSync(new URL(`../src/figures/ai-credit-map/ai-map-${kind}-${lang}${j ? '-mobile' : ''}.svg`, import.meta.url), 'utf8').replaceAll(`ai-map-${lang}-${kind}-`, `${figureId}-${lang}-${kind}-`);
      assert.ok(JSON.stringify(tree(serializeOuter(svg))) === JSON.stringify(browserSvg(source)), `${lang}/${kind}: complete inline SVG and local references`);
      assert(hasClass(svg.parentNode, j ? 'figure-narrow' : 'figure-wide'));
    }
    const caption = inside.filter(n => n.tagName === 'figcaption'); assert.equal(caption.length, 1);
    const source = ['S03', 'S09', 'S18'][i];
    const primaryLink = walk(caption[0]).find(n => n.tagName === 'a');
    assert(primaryLink, 'Figure caption has a primary source link');
    assert.equal(attr(primaryLink, 'href'), `#source-${source}`, 'Primary source matches the figure contract');
    assert(ids.includes(`source-${source}`), 'Figure source resolves to the numbered catalogue');
    if (kind === 'holdings') for (const reference of ['S01', 'S03', 'S04', 'S05', 'S06', 'S07', 'S08']) {
      assert(walk(caption[0]).some(n => n.tagName === 'a' && attr(n, 'href') === `#source-${reference}`));
      assert(ids.includes(`source-${reference}`), 'Each holdings source resolves');
    }
  }
}

test('actual FR/EN retain twelve complete credit-map SVGs and their source anchors', () => {
  for (const lang of ['fr', 'en']) assertPage(readFileSync(new URL(`../dist/${routes[lang]}/index.html`, import.meta.url), 'utf8'), lang);
});

test('rendered guards reject a dropped layout, changed drawing or forged source anchor', () => {
  const html = readFileSync(new URL(`../dist/${routes.fr}/index.html`, import.meta.url), 'utf8');
  assertPage(html, 'fr');
  const mutations = [
    ['dropped layout', html.replace(/(<figure\b[^>]*data-kind="holdings"[^>]*>[\s\S]*?)<svg\b[\s\S]*?<\/svg>/u, '$1')],
    ['changed drawing', html.replace('class="ai-map-svg"', 'class="changed-drawing"')],
    ['changed opacity', html.replace(/(<figure\b[^>]*data-kind="holdings"[\s\S]*?opacity=")0\.95"/u, (_, prefix) => `${prefix}0.65"`)],
    ['forged primary source', html.replace(/(<figure\b[^>]*data-kind="holdings"[\s\S]*?<figcaption\b[\s\S]*?href=")#source-S03"/u, '$1#source-S99"')],
  ];
  for (const [label, bad] of mutations) {
    assert.ok(bad !== html, `${label}: fixture changed`);
    assert.throws(() => assertPage(bad, 'fr'), { name: 'AssertionError' }, `${label}: rejected`);
  }
  const english = readFileSync(new URL(`../dist/${routes.en}/index.html`, import.meta.url), 'utf8');
  assertPage(english, 'en');
  const changedDescription = english.replace(/(<figure\b[^>]*data-kind="holdings"[\s\S]*?<desc\b[^>]*>)([^<])/u, (_, prefix) => `${prefix}X`);
  assert.ok(changedDescription !== english, 'Description mutation changes the rendered fixture');
  assert.throws(() => assertPage(changedDescription, 'en'));
});
