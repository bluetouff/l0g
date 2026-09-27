import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { XMLValidator } from 'fast-xml-parser';
import { fromHtml } from 'hast-util-from-html';
import { toText } from 'hast-util-to-text';
import sharp from 'sharp';

const articles = [
  '../src/content/posts/ia-ralentissement-3-modeles-chinois-prix-concurrence.md',
  '../src/content/posts-en/ai-slowdown-3-chinese-models-price-competition.md',
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

test('Model competition charts keep bilingual labels inside a compact themed layout', async () => {
  assert.deepEqual(figures.map(set => set.length), [2, 2]);
  for (const svg of figures.flat()) await geometry(svg);
});

function checkBench(svg) {
  const bars = inspect(svg).filter(node => node.tagName === 'rect' && Number(node.properties.height) === 22);
  assert.equal(bars.length, 4);
  for (const [i, value] of [74.2, 74.0, 31.2, 51.8].entries()) {
    assert.equal(Number(bars[i].properties.x), 24, 'All results must share a zero baseline');
    assert.equal(Number(bars[i].properties.width), value * 4, 'Each percentage must use the common 0–100 scale');
  }
  assert(svg.includes('DeepSWE v1.1') && svg.includes('Terminal-Bench 4.0') && svg.includes('pass@1'));
}

function checkCost(svg) {
  const bars = inspect(svg).filter(node => node.tagName === 'rect' && Number(node.properties.height) === 26);
  const tasks = 1000, hourlyCost = 30;
  const values = [tasks * 0.04, tasks * 2 * hourlyCost / 60, tasks * 0.20, tasks * 0.5 * hourlyCost / 60];
  assert.deepEqual(values, [40, 1000, 200, 250]);
  assert.equal(values[0] + values[1], 1040);
  assert.equal(values[2] + values[3], 450);
  assert.equal(bars.length, 4);
  for (const [i, value] of values.entries()) {
    assert(Math.abs(Number(bars[i].properties.width) - value / 3) < 0.000001, 'All costs must share the 0–1200 dollar scale');
    assert(Math.abs(Number(bars[i].properties.x) - (i % 2 ? 24 + values[i - 1] / 3 : 24)) < 0.000001, 'Stacked segments must start at zero and touch');
  }
}

test('Supplier results and hypothetical costs use reproducible common scales', () => {
  for (const pair of figures) { checkBench(pair[0]); checkCost(pair[1]); }
  assert.equal(10 * 0.15 + 0.60, 2.10);
  assert.equal(10 * 0.30 + 1.20, 4.20);
  const breakEvenSeconds = (0.20 - 0.04) / (30 / 3600);
  assert.equal(breakEvenSeconds, 19.2);
  for (const [i, article] of articles.entries()) {
    assert.match(article, i === 0 ? /19,2 secondes/ : /19\.2.*seconds/);
    assert.match(article, i === 0 ? /entièrement fictif/ : /entirely hypothetical/);
    assert.match(article, i === 0 ? /Les performances présentées viennent de DeepSeek/ : /supplier’s figures/);
  }
});

test('Chart checks reject a shifted baseline, distorted benchmark and broken cost stack', () => {
  assert.throws(() => checkBench(figures[0][0].replace('x="24" y="122"', 'x="30" y="122"')));
  assert.throws(() => checkBench(figures[0][0].replace('width="296.800000"', 'width="300"')));
  assert.throws(() => checkCost(figures[0][1].replace('width="333.333333"', 'width="330"')));
  assert.throws(() => checkCost(figures[0][1].replace('x="37.333333333333336"', 'x="40"')));
});

test('Geometry rejects an overflowing translation', async () => {
  await assert.rejects(geometry(figures[1][0].replace('>V4.1 Flash<', '>' + 'W'.repeat(50) + '<')));
});

test('SVG validation rejects active content, external assets and arbitrary colors', () => {
  const svg = figures[0][0];
  for (const payload of ['<script/>', '<foreignObject/>', '<image href="https://example.com/x"/>']) assert.throws(() => inspect(svg.replace('</svg>', `${payload}</svg>`)));
  assert.throws(() => inspect(svg.replace('<svg ', '<svg onload="void(0)" ')));
  assert.throws(() => inspect(svg.replace('fill="var(--color-surface)"', 'fill="url(https://example.com/x)"')));
  assert.throws(() => inspect(svg.replace('fill="var(--color-surface)"', 'fill="#123456"')));
});
