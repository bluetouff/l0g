import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { XMLValidator } from 'fast-xml-parser';
import { fromHtml } from 'hast-util-from-html';
import { toText } from 'hast-util-to-text';
import sharp from 'sharp';

const articles = [
  '../src/content/posts/ia-ralentissement-5-japon-taux-prix-attente.md',
  '../src/content/posts-en/ai-slowdown-5-japan-rates-cost-of-waiting.md',
].map(path => readFileSync(new URL(path, import.meta.url), 'utf8'));
const figures = articles.map(article => [...article.matchAll(/<svg\b[\s\S]*?<\/svg>/gu)].map(match => match[0]));
const elements = tree => [tree, ...(tree.children ?? []).flatMap(elements)].filter(node => node.type === 'element');

function inspect(svg) {
  assert.equal(XMLValidator.validate(svg), true);
  const nodes = elements(fromHtml(svg, { fragment: true }));
  for (const node of nodes) {
    assert(['svg', 'title', 'desc', 'g', 'rect', 'text', 'path'].includes(node.tagName));
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
  assert.match(root.viewBox, /^0 0 500 420$/u);
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
    assert(left >= 4 && left + width <= 496 && top >= 4 && bottom <= height - 4, `ViewBox padding: ${label}`);
    const group = nodes.find(candidate => candidate.tagName === 'g' && candidate.children.includes(node));
    if (group) {
      const rect = group.children.find(child => child.tagName === 'rect').properties;
      assert(left >= Number(rect.x) + 8 && left + width <= Number(rect.x) + Number(rect.width) - 8 && top >= Number(rect.y) + 4 && bottom <= Number(rect.y) + Number(rect.height) - 4, `Panel padding: ${label}`);
    }
  }
}

test('Waiting-cost figures have accessible bilingual labels and compact themed geometry', async () => {
  assert.deepEqual(figures.map(set => set.length), [3, 3]);
  for (const svg of figures.flat()) await geometry(svg);
});

const bars = svg => inspect(svg).filter(node => node.tagName === 'rect' && Number(node.properties.height) === 26);
const near = (actual, expected) => assert(Math.abs(actual - expected) < 0.000001, `${actual} differs from ${expected}`);

function checkDiscount(svg) {
  const chart = bars(svg);
  assert.equal(chart.length, 3);
  for (const [i, [years, rate]] of [[5, 0.05], [5, 0.10], [7, 0.10]].entries()) {
    near(Number(chart[i].properties.x), 36);
    near(Number(chart[i].properties.width), 4 * 100 / (1 + rate) ** years);
  }
  assert.match(svg, /100/);
  assert.match(svg, /17[.,]4/);
  assert.match(svg, /ficti|hypothetical/i);
}

function checkSigned(svg, values, scale) {
  const chart = bars(svg);
  assert.equal(chart.length, values.length);
  for (const [i, value] of values.entries()) {
    near(Number(chart[i].properties.x), 250 + Math.min(0, value) * scale);
    near(Number(chart[i].properties.width), Math.abs(value) * scale);
  }
}

function checkCurrency(svg) {
  const initialYen = 15000, initialSpot = 150, dollarRate = 0.05, yenRate = 0.01;
  const finalDollars = initialYen / initialSpot * (1 + dollarRate);
  const forward = initialSpot * (1 + yenRate) / (1 + dollarRate);
  const returns = [150, 135, forward].map(rate => (finalDollars * rate / initialYen - 1) * 100);
  checkSigned(svg, returns, 35);
  near(finalDollars * forward, 15150);
  assert.match(svg, /ficti|hypothetical/i);
}

function checkFlows(svg) {
  // MOF source unit is 100 million yen; one billion is ten source units.
  const sourceValues = [12983, -1430, -10187];
  const billions = sourceValues.map(value => value / 10);
  checkSigned(svg, billions, 0.14);
  near(billions.reduce((a, b) => a + b, 0), 136.6);
  assert.match(svg, /Août 2026|August 2026/);
  assert.match(svg, /milliards de yens|billion yen/);
  assert.match(svg, /136[.,]6/);
}

test('Discounting, hedging and source-unit conversion determine bar lengths and direction', () => {
  for (const [discount, currency, flows] of figures) {
    checkDiscount(discount); checkCurrency(currency); checkFlows(flows);
  }
  // Two more years at the same rate change value, not the final payment.
  near(1 - (100 / 1.1 ** 7) / (100 / 1.1 ** 5), 1 - 1 / 1.1 ** 2);
  const coupons = [[1000, 0.08625], [4500, 0.0925], [4500, 0.0975]].map(([principal, rate]) => principal * rate);
  near(coupons.reduce((a, b) => a + b, 0), 941.25);
  for (const [i, article] of articles.entries()) {
    for (const amount of coupons) assert(article.includes(amount.toString().replace('.', i === 0 ? ',' : '.')));
    assert.match(article, /941[.,]25/);
    assert.match(article, /29 septembre|September 29|29 September/);
    assert.match(article, /non tirée|undrawn/);
    assert.match(article, /sourceArticle:|quickTake:/);
  }
});

test('Checks reject wrong scales, reversed exchange risk and shifted zero baselines', () => {
  assert.throws(() => checkDiscount(figures[0][0].replace('x="36.000000"', 'x="50"')));
  assert.throws(() => checkDiscount(figures[0][0].replace(/width="313\.410\d*"/, 'width="314"')));
  assert.throws(() => checkCurrency(figures[0][1].replace('x="57.500000"', 'x="250"')));
  assert.throws(() => checkCurrency(figures[0][1].replace('width="35.000000"', 'width="175"')));
  assert.throws(() => checkFlows(figures[0][2].replace('width="181.762000"', 'width="18.1762"')));
  assert.throws(() => checkFlows(figures[0][2].replace('x="107.382000"', 'x="250"')));
  assert.throws(() => checkFlows(figures[0][2].replaceAll('Août 2026', 'Septembre 2026')));
});

test('SVG validation rejects active content, external assets and arbitrary colors', async () => {
  const svg = figures[0][0];
  for (const payload of ['<script/>', '<foreignObject/>', '<image href="https://example.com/x"/>']) assert.throws(() => inspect(svg.replace('</svg>', `${payload}</svg>`)));
  assert.throws(() => inspect(svg.replace('<svg ', '<svg onload="void(0)" ')));
  assert.throws(() => inspect(svg.replace('fill="var(--color-surface)"', 'fill="url(https://example.com/x)"')));
  assert.throws(() => inspect(svg.replace('fill="var(--color-surface)"', 'fill="#123456"')));
  await assert.rejects(geometry(svg.replace('>Simulation ·', '>' + 'W'.repeat(50) + 'Simulation ·')));
});
