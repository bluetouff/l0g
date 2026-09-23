import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { XMLValidator } from 'fast-xml-parser';
import { fromHtml } from 'hast-util-from-html';
import { toText } from 'hast-util-to-text';
import sharp from 'sharp';

const articles = ['../src/content/posts/produits-structures-indices-decrement-risque-epargne.mdx', '../src/content/posts-en/structured-products-decrement-indices-savings-risk.mdx'].map(path => readFileSync(new URL(path, import.meta.url), 'utf8'));
const figures = articles.map(article => [...article.matchAll(/<svg\b[\s\S]*?<\/svg>/g)].map(match => match[0]));
function inspect(svg) {
  assert.equal(XMLValidator.validate(svg), true);
  const nodes = [];
  function visit(node) {
    if (node.type === 'element') nodes.push(node);
    for (const child of node.children ?? []) visit(child);
  }
  visit(fromHtml(svg, { fragment: true }));
  for (const node of nodes) {
    assert(['svg', 'title', 'desc', 'rect', 'text', 'line'].includes(node.tagName));
    for (const [key, value] of Object.entries(node.properties)) {
      assert(!key.toLowerCase().startsWith('on'));
      assert(!['href', 'xLinkHref', 'src'].includes(key));
      assert(!String(value).includes('url('));
    }
  }
  assert.equal(nodes[0].properties.style, 'width:100%;height:auto');
  assert.equal(nodes[0].properties.role, 'img');
  for (const id of nodes[0].properties.ariaLabelledBy) assert(nodes.some(n => n.properties.id === id && ['title', 'desc'].includes(n.tagName) && toText(n).trim()));
  return nodes;
}
const widths = new Map();
async function labelWidth(label) {
  if (!widths.has(label)) {
    const escaped = label.replaceAll('&', '&amp;').replaceAll('<', '&lt;');
    const { info } = await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="4096" height="128"><text x="8" y="70" fill="white" font-family="Arial, Helvetica, sans-serif" font-size="21" font-weight="400">${escaped}</text></svg>`)).trim().raw().toBuffer({ resolveWithObject: true });
    widths.set(label, info.width + 3);
  }
  return widths.get(label);
}
async function geometry(svg) {
  const nodes = inspect(svg), boxes = [];
  assert.equal(nodes[0].properties.viewBox, '0 0 520 380');
  for (const node of nodes.filter(n => n.tagName === 'text')) {
    const p = node.properties, label = toText(node), w = await labelWidth(label);
    assert.equal(+p.fontSize, 21);
    assert.equal(+p.fontWeight, 400);
    const x = +p.x - (p.textAnchor === 'end' ? w : 0), y = +p.y;
    assert(x >= 16 && x + w <= 504 && y - 21 >= 8 && y + 4 <= 376, `Canvas padding: ${label}`);
    // The repayment and yield tables have explicit numeric columns.
    if (y >= 132 && y <= 316 && p.textAnchor === 'end') {
      const left = +p.x === 308 ? 178 : svg.includes('x="308" y="132"') ? 342 : 340;
      assert(x >= left && x + w <= +p.x, `Column padding: ${label}`);
    }
    const box = { x, y: y - 21, right: x + w, bottom: y + 4, label };
    for (const prior of boxes) assert(!(box.x < prior.right + 8 && box.right + 8 > prior.x && box.y < prior.bottom && box.bottom > prior.y), `Labels overlap: ${prior.label} / ${label}`);
    boxes.push(box);
  }
  for (const node of nodes.filter(n => ['rect', 'line'].includes(n.tagName))) {
    const p = node.properties;
    if (node.tagName === 'rect') assert(+p.x >= 0 && +p.y >= 0 && +p.x + +p.width <= 520 && +p.y + +p.height <= 380);
    else assert(+p.x1 >= 0 && +p.x2 <= 520 && +p.y1 >= 0 && +p.y2 <= 380);
  }
}
test('six compact static accessible SVGs preserve inner and outer geometry', async () => {
  assert.deepEqual(figures.map(f => f.length), [3, 3]);
  const ids = figures.flat().flatMap(svg => inspect(svg).map(n => n.properties.id).filter(Boolean));
  assert.equal(new Set(ids).size, ids.length);
  for (const svg of figures.flat()) await geometry(svg);
});
test('SVG contract rejects active content and external resources', () => {
  const svg = figures[0][0];
  for (const payload of ['<script>alert(1)</script>', '<foreignObject/>', '<image href="https://example.com/x"/>']) assert.throws(() => inspect(svg.replace('</svg>', payload + '</svg>')));
  assert.throws(() => inspect(svg.replace('<svg ', '<svg onload="alert(1)" ')));
  assert.throws(() => inspect(svg.replace('fill="#0c0e10"', 'fill="url(https://example.com/x)"')));
});
test('geometry rejects long labels, shifted numbers and internal overlaps', async () => {
  await assert.rejects(geometry(figures[0][0].replaceAll('Dans le calcul de l’indice', 'W'.repeat(80))));
  await assert.rejects(geometry(figures[0][1].replace('x="496" y="132"', 'x="310" y="132"')));
  await assert.rejects(geometry(figures[0][0].replace('x="24" y="178"', 'x="24" y="132"')));
});
function numericCells(svg, x) {
  return inspect(svg).filter(n => n.tagName === 'text' && +n.properties.x === x && +n.properties.y >= 132 && +n.properties.y <= 316).map(n => Number(toText(n).replace(/[€% ]/g, '').replace(',', '.').replace('−', '-')));
}
test('displayed examples reconcile with independent arithmetic and exact threshold boundaries', () => {
  const payout = level => level >= 65 ? 20500 : level >= 50 ? 10000 : 100 * level;
  assert.equal(payout(0), 0);
  assert.equal(payout(49), 4900);
  assert.equal(payout(49.99), 4999);
  assert.equal(payout(50), 10000);
  assert.equal(payout(64.99), 10000);
  assert.equal(payout(65), 20500);
  assert.equal(payout(200), 20500);
  for (const set of figures) {
    const values = numericCells(set[0], 496);
    assert.deepEqual(values, [1000, 30, 10, -50, 990]);
    assert.equal(values.slice(0, 4).reduce((a, b) => a + b), values[4]);
    assert.deepEqual(numericCells(set[1], 496), numericCells(set[1], 24).map(payout));
    const payments = numericCells(set[2], 308), rates = numericCells(set[2], 496);
    for (const [i, years] of [1, 3, 5, 10].entries()) {
      assert.equal(payments[i], 10000 + 1050 * years);
      assert.equal(rates[i], +((Math.pow(payments[i] / 10000, 1 / years) - 1) * 100).toFixed(2));
    }
  }
  assert.equal((10000 * 1.105 ** 10).toFixed(2), '27140.81');
  assert.equal((50 / 853.01 * 100).toFixed(4), '5.8616');
  assert.deepEqual([1000, 800, 500].map(level => 50 / level * 100), [5, 6.25, 10]);
  assert.equal(10000 * .0776, 776);
  for (const article of articles) {
    assert(article.includes('ogImage: "/illustrations/news/indices-decrement-v1.jpg"'));
    assert.doesNotMatch(article, /—|<script|<iframe|foreignObject|className=|style=\{\{/u);
    assert(article.includes('853'));
  }
});
