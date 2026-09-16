import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';
import { fromHtml } from 'hast-util-from-html';
import { XMLValidator } from 'fast-xml-parser';

const paths = [
  'src/content/posts/radiant-world-factures-contestees-financement.md',
  'src/content/posts-en/radiant-world-disputed-invoices-trade-finance.md',
];
const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const walk = n => [n, ...(n.children ?? []).flatMap(walk)];
const select = (n, tag) => walk(n).filter(node => node.tagName === tag);
const text = n => n.type === 'text' ? n.value : (n.children ?? []).map(text).join('');
const parse = s => fromHtml(s, { fragment: true });
const svgStyle = 'display:block;width:100%;height:auto;background:#0c0d10;border-radius:16px;font-family:system-ui,sans-serif';
const tags = new Set(['svg', 'title', 'desc', 'text', 'g', 'rect']);
const attrs = new Set(['xmlns', 'viewBox', 'role', 'ariaLabelledBy', 'style', 'id', 'x', 'y', 'width', 'height', 'rx', 'fill', 'stroke', 'fontSize', 'dataPanel']);
const sources = new Set([
  'https://www.gtreview.com/news/asia/mizuho-claims-radiant-world-faked-glencore-emails/',
  'https://news.bloomberglaw.com/bankruptcy-law/radiant-world-sent-lender-fake-glencore-contracts-lawsuit-says',
  'https://www.gtreview.com/news/global/mizuho-incomlend-file-court-claims-against-embattled-radiant-world/',
  'https://uk.marketscreener.com/news/jefferies-linked-fund-secures-freezing-order-against-trader-radiant-world-source-says-ce7858d3dd80ff26',
  'https://www.marketscreener.com/news/radiant-world-group-sues-glencore-for-2-billion-bloomberg-news-reports-ce785bddde8bf020',
  'https://www.judiciary.gov.sg/hearing-list/hearing-list-details/ds-1-687430',
  'https://www.glencore.com/media-and-insights/news/update-on-past-business-activities-involving-radiant-world-',
  'https://news.bloombergtax.com/financial-accounting/glencore-was-radiant-worlds-senior-partner-executive-says',
  'https://www.abs.org.sg/docs/library/code-of-best-practices-commodity-financing.pdf',
  'https://www.trade.gov/report/trade-finance-guide',
  'https://www.justice.gov.uk/courts/procedure-rules/civil/rules/part25',
  'https://www.abs.org.sg/industry-guidelines/compliance-and-risk-management/trade-finance-registry',
]);
function checkSource(href) {
  const url = new URL(href);
  url.hash = '';
  assert(sources.has(url.href), 'Only the exact reviewed source URLs are allowed');
}
function check(svg, index) {
  assert.equal(svg.properties.style, svgStyle);
  assert.equal(svg.properties.role, 'img');
  const height = index === 0 ? 606 : 766;
  assert.equal(svg.properties.viewBox, `0 0 520 ${height}`);
  for (const tag of ['title', 'desc']) assert.equal(select(svg, tag).length, 1);
  assert.deepEqual(svg.properties.ariaLabelledBy, [select(svg, 'title')[0].properties.id, select(svg, 'desc')[0].properties.id]);
  const inside = (label, box, padding) => {
    const p = label.properties;
    const size = Number(p.fontSize), x = Number(p.x), y = Number(p.y);
    assert(size >= 22);
    // Conservative preflight, complemented by actual browser text bounds.
    assert(x >= box.x + padding && x + [...text(label)].length * size * .61 <= box.x + box.width - padding, `horizontal bounds: ${text(label)}`);
    assert(y - size >= box.y + padding && y + 7 <= box.y + box.height - padding, `vertical bounds: ${text(label)}`);
  };
  for (const node of walk(svg).filter(n => n.type === 'element')) {
    assert(tags.has(node.tagName), `Unsafe or unexpected SVG element: ${node.tagName}`);
    for (const key of Object.keys(node.properties)) assert(attrs.has(key), `Unexpected SVG attribute: ${key}`);
    if (node.tagName === 'text') inside(node, { x: 0, y: 0, width: 520, height }, 12);
  }
  const panels = select(svg, 'g');
  assert.equal(panels.length, index === 0 ? 3 : 4);
  panels.forEach((panel, i) => {
    assert.equal(panel.properties.dataPanel, String(i + 1));
    const rects = select(panel, 'rect');
    assert.equal(rects.length, 1);
    const p = rects[0].properties;
    const box = Object.fromEntries(['x', 'y', 'width', 'height'].map(key => [key, Number(p[key])]));
    assert.deepEqual(box, { x: 24, y: 110 + i * 160, width: 472, height: 144 });
    const labels = select(panel, 'text');
    assert.equal(labels.length, 3);
    labels.forEach(label => inside(label, box, 12));
    for (let j = 1; j < labels.length; j++) assert(Number(labels[j].properties.y) - Number(labels[j - 1].properties.y) >= 36);
  });
}

for (const path of paths) {
  test(`${path}: exact sources, safe dark SVGs and internal panel margins`, () => {
    const source = read(path);
    assert.doesNotMatch(source, /—|foreignObject|<script|var\(--|overflow:hidden/u);
    assert.match(source, /ogImage: \/illustrations\/news\/radiant-world-creances-v1\.jpg/u);
    const urls = new Set([...source.matchAll(/https:\/\/[^\s<>"')]+/gu)].map(m => m[0].split('#')[0]));
    assert.deepEqual([...urls].sort(), [...sources].sort());
    urls.forEach(checkSource);
    const figures = select(parse(source), 'figure');
    assert.equal(figures.length, 3);
    const ids = new Set();
    figures.forEach((figure, index) => {
      assert.equal(figure.properties.style, 'max-width:520px;margin:2rem auto 2.75rem;padding-bottom:.5rem');
      assert(select(figure, 'a').length >= 1);
      select(figure, 'a').forEach(a => checkSource(a.properties.href));
      const svg = select(figure, 'svg')[0];
      assert.equal(XMLValidator.validate(source.slice(svg.position.start.offset, svg.position.end.offset)), true);
      check(svg, index);
      walk(svg).filter(n => n.properties?.id).forEach(n => { assert(!ids.has(n.properties.id)); ids.add(n.properties.id); });
    });
    for (const amount of [/95[.,]5/u, /31[.,]7/u, /499/u, /2 (?:milliards|billion)/u]) assert.match(text(figures[1]), amount);
    assert.doesNotMatch(text(figures[1]), /May|Mai|total.*626/u);
    assert.match(source, /fictif|fictional/u);
    assert.match(source, /ne pas avoir pu immédiatement vérifier|could not immediately verify/u);
  });
}
test('negative cases reject panel overflow, crowded labels, active SVG and impostor sources', () => {
  const first = () => select(parse(read(paths[0])), 'svg')[0];
  check(first(), 0);
  for (const [key, value] of [['x', '490'], ['y', '100'], ['fontSize', '80']]) {
    const svg = first(); select(select(svg, 'g')[0], 'text')[0].properties[key] = value;
    assert.throws(() => check(svg, 0));
  }
  const crowded = first(); select(select(crowded, 'g')[0], 'text')[1].properties.y = 170;
  assert.throws(() => check(crowded, 0));
  for (const tagName of ['script', 'foreignObject', 'image', 'use']) {
    const svg = first(); svg.children.push({ type: 'element', tagName, properties: {}, children: [] });
    assert.throws(() => check(svg, 0));
  }
  for (const key of ['onLoad', 'href', 'xLinkHref']) {
    const svg = first(); svg.properties[key] = 'unexpected'; assert.throws(() => check(svg, 0));
  }
  for (const url of ['https://www.trade.gov.invalid/report/trade-finance-guide', 'https://www.trade.gov@invalid.test/report/trade-finance-guide', 'http://www.trade.gov/report/trade-finance-guide']) assert.throws(() => checkSource(url));
});
test('FR/EN chronology agrees and the fictional spread is reproducible', () => {
  const dates = path => [...read(path).matchAll(/(?:pubDate|updatedDate): "([^"]+)"/gu)].map(m => m[1]);
  assert.deepEqual(dates(paths[0]), dates(paths[1]));
  assert.equal(read(paths[1]).match(/sourceUpdatedDate: "([^"]+)"/u)?.[1], dates(paths[0])[0]);
  assert.equal(10000000 - 9800000, 200000);
});
for (const path of ['dist/posts/radiant-world-factures-contestees-financement/index.html', 'dist/en/analysis/radiant-world-disputed-invoices-trade-finance/index.html']) {
  test(`${path}: built SVG geometry`, { skip: !existsSync(new URL(`../${path}`, import.meta.url)) }, () => {
    const svgs = select(parse(read(path)), 'svg').filter(n => select(n, 'title').some(t => t.properties.id?.startsWith('radiant-')));
    assert.equal(svgs.length, 3); svgs.forEach(check);
  });
}
