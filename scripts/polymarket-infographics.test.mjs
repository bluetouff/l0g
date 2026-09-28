import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { XMLValidator } from 'fast-xml-parser';
import { fromHtml } from 'hast-util-from-html';
import { toText } from 'hast-util-to-text';
import sharp from 'sharp';

const articles = [
  '../src/content/posts/polymarket-europe-paris-produits-financiers.md',
  '../src/content/posts-en/polymarket-europe-betting-financial-products.md',
].map(path => readFileSync(new URL(path, import.meta.url), 'utf8'));
const figures = articles.map(article => [...article.matchAll(/<svg\b[\s\S]*?<\/svg>/gu)].map(match => match[0]));
const elements = tree => [tree, ...(tree.children ?? []).flatMap(elements)].filter(node => node.type === 'element');

function inspect(svg) {
  assert.equal(XMLValidator.validate(svg), true);
  const nodes = elements(fromHtml(svg, { fragment: true }));
  for (const node of nodes) {
    assert(['svg', 'title', 'desc', 'g', 'rect', 'text', 'path', 'line'].includes(node.tagName));
    for (const [key, value] of Object.entries(node.properties)) {
      assert(!key.toLowerCase().startsWith('on'));
      assert(!['href', 'xLinkHref', 'src'].includes(key));
      assert(!String(value).includes('url('));
      if (['fill', 'stroke'].includes(key)) assert.match(String(value), /^(?:none|var\(--color-(?:surface|line-strong|paper|signal|muted|accent)\))$/u);
    }
  }
  const root = nodes[0].properties;
  assert.equal(root.style, 'width:100%;height:auto');
  assert.equal(root.role, 'img');
  assert.match(root.viewBox, /^0 0 480 (515|580|552)$/u);
  for (const id of root.ariaLabelledBy) {
    assert(nodes.some(node => node.properties.id === id && ['title', 'desc'].includes(node.tagName) && toText(node).trim()));
  }
  return nodes;
}

async function geometry(svg) {
  const nodes = inspect(svg);
  const height = Number(nodes[0].properties.viewBox.split(' ')[3]);
  for (const node of nodes.filter(node => node.tagName === 'text')) {
    const p = node.properties, size = Number(p.fontSize);
    assert(size >= 20, 'Labels must remain readable on mobile');
    const label = toText(node).replaceAll('&', '&amp;').replaceAll('<', '&lt;');
    const { info } = await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="4096" height="128"><text x="8" y="70" fill="white" font-family="Arial, Helvetica, sans-serif" font-size="${size}" font-weight="${p.fontWeight ?? 400}">${label}</text></svg>`)).trim().raw().toBuffer({ resolveWithObject: true });
    const width = info.width + 3;
    const left = Number(p.x) - (p.textAnchor === 'middle' ? width / 2 : p.textAnchor === 'end' ? width : 0);
    const top = Number(p.y) - size * 0.95, bottom = Number(p.y) + 4;
    assert(left >= 4 && left + width <= 476 && top >= 4 && bottom <= height - 4, `ViewBox padding: ${label}`);
    const group = nodes.find(candidate => candidate.tagName === 'g' && candidate.children.includes(node));
    if (group) {
      const rect = group.children.find(child => child.tagName === 'rect').properties;
      assert(left >= Number(rect.x) + 8 && left + width <= Number(rect.x) + Number(rect.width) - 8 && top >= Number(rect.y) + 4 && bottom <= Number(rect.y) + Number(rect.height) - 4, `Panel padding: ${label}`);
    }
  }
}

const rectangles = svg => inspect(svg).filter(n => n.tagName === 'rect').map(n => n.properties);
const near = (actual, expected) => assert(Math.abs(actual - expected) < 0.00001);
function cashFlows(svg) {
  const bars = rectangles(svg).filter(p => Number(p.height) === 38);
  assert.equal(bars.length, 2);
  let x = 24;
  for (const [i, contribution] of [40, 60].entries()) {
    near(Number(bars[i].x), x);
    near(Number(bars[i].width), contribution / 100 * 432);
    x += Number(bars[i].width);
  }
  near(x, 456);
  const text = toText(fromHtml(svg, {fragment:true})).replaceAll('$', '');
  for (const gain of ['+60', '−60', '−40', '+40']) assert(text.includes(gain), gain);
}
function execution(svg) {
  const bars = rectangles(svg).filter(p => p.fillOpacity);
  assert.equal(bars.length, 2);
  let x = 60, cost = 0;
  for (const [i, [quantity, cents]] of [[50, 62], [150, 68]].entries()) {
    const p = bars[i];
    near(Number(p.x), x);
    near(Number(p.width), quantity / 200 * 388);
    near(Number(p.y), 368 - cents * 3);
    near(Number(p.height), cents * 3);
    x += Number(p.width);
    cost += quantity * cents;
  }
  near(x, 448); assert.equal(cost / 100, 133); assert.equal(cost / 200, 66.5);
  assert.match(svg, /133/); assert.match(svg, /0[,.]665/);
  const midpoint = inspect(svg).find(n => n.tagName === 'line' && n.properties.strokeDashArray && Number(n.properties.x1) === 60);
  near(Number(midpoint.properties.y1), 368 - (58 + 62) / 2 * 3);
  near(Number(midpoint.properties.y2), Number(midpoint.properties.y1));
}
function hedge(svg) {
  const bars = rectangles(svg).filter(p => Number(p.height) === 26);
  assert.equal(bars.length, 4);
  const premium = 5000 * 0.4;
  const receipts = [10000, 10000 - premium, 4000, 4000 - premium + 5000];
  for (const [i, amount] of receipts.entries()) {
    near(Number(bars[i].x), 22);
    near(Number(bars[i].width), amount / 10000 * 330);
  }
  assert.equal(receipts[0] - receipts[2], 6000);
  assert.equal(receipts[1] - receipts[3], 1000);
  assert.match(svg, /ficti|fictional|Fictional|Hypothetical/);
}
test('Polymarket diagrams use safe themed markup and readable labels within their panels', async () => {
  assert.deepEqual(figures.map(set => set.length), [3, 3]);
  for (const svg of figures.flat()) await geometry(svg);
});
test('Polymarket simulations preserve collateral, order-book cost and cash-flow geometry in both languages', () => {
  for (const [cash, order, cover] of figures) { cashFlows(cash); execution(order); hedge(cover); }
});
test('Simulation checks reject altered proportions, chart origins and payouts', () => {
  assert.throws(() => cashFlows(figures[0][0].replace('width="172.8"', 'width="170"')));
  assert.throws(() => execution(figures[0][1].replace('height="186"', 'height="180"')));
  assert.throws(() => execution(figures[0][1].replace('x="60" y="182"', 'x="62" y="182"')));
  assert.throws(() => hedge(figures[0][2].replace('width="231.0"', 'width="240"')));
});
test('Polymarket SVG checks reject active markup, external resources and overflowing panel labels', async () => {
  const svg = figures[0][0];
  for (const payload of ['<script/>', '<foreignObject/>', '<image href="https://example.com/x"/>']) assert.throws(() => inspect(svg.replace('</svg>', `${payload}</svg>`)));
  assert.throws(() => inspect(svg.replace('<svg ', '<svg onload="void(0)" ')));
  assert.throws(() => inspect(svg.replace('fill="var(--color-surface)"', 'fill="#123456"')));
  await assert.rejects(geometry(svg.replace('>100 $ à OUI<', '>' + 'W'.repeat(50) + '<')));
});
