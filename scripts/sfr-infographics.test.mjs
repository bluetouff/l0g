import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { XMLValidator } from 'fast-xml-parser';
import { fromHtml } from 'hast-util-from-html';
import { toText } from 'hast-util-to-text';
import sharp from 'sharp';

const articles = [
  '../src/content/posts/sfr-rachat-partage-operateur-prix-forfaits.md',
  '../src/content/posts-en/sfr-breakup-phone-bill-networks-competition.md',
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


const rectangles = svg => inspect(svg).filter(n => n.tagName === 'rect').map(n => n.properties);
const near = (actual, expected) => assert(Math.abs(actual - expected) < 0.00001);
function wholesale(svg) {
  const bars = rectangles(svg).filter(p => Number(p.height) === 28);
  assert.equal(bars.length, 6);
  for (const [row, access] of [6, 7].entries()) {
    const values = [access, 2, 10 - access - 2]; let x = 40;
    for (const [column, value] of values.entries()) {
      const bar = bars[row * 3 + column];
      near(Number(bar.x), x); near(Number(bar.width), value * 42); x += value * 42;
      assert.equal(bar.fill, `var(--color-${['accent', 'muted', 'signal'][column]})`);
    }
    near(x, 460);
  }
  assert.match(svg, /fictif|Hypothetical/); assert.match(svg, /HT|ex VAT/);
}
function timeline(svg) {
  const bars = rectangles(svg).filter(p => Number(p.height) === 28);
  assert.equal(bars.length, 2);
  for (const [i, completion] of [2027.5, 2028].entries()) {
    const start = Number(bars[i].x), width = Number(bars[i].width);
    near(start, 50 + (completion - 2027) * 100);
    near(width, 30 / 12 * 100);
    near(2027 + (start + width - 50) / 100, completion + 2.5);
  }
  assert.match(svg, /minimum|at least/);
  assert.match(svg, /début 2029|early 2029/);
}

test('SFR diagrams are compact, theme-aware and keep labels inside their panels', async () => {
  assert.deepEqual(figures.map(set => set.length), [3, 3]);
  for (const svg of figures.flat()) await geometry(svg);
});
test('SFR wholesale bars preserve revenue and the transition lasts at least thirty months', () => {
  for (const [, cost, calendar] of figures) { wholesale(cost); timeline(calendar); }
});
test('Chart checks reject wrong shares, wrong baselines and shortened transitions', () => {
  assert.throws(() => wholesale(figures[0][1].replace('width="252"', 'width="250"')));
  assert.throws(() => wholesale(figures[0][1].replace('x="40"', 'x="44"')));
  assert.throws(() => timeline(figures[0][2].replace('width="250"', 'width="240"')));
});
test('SFR SVG checks reject unsafe content and overflowing labels', async () => {
  const svg = figures[0][0];
  for (const payload of ['<script/>', '<foreignObject/>', '<image href="https://example.com/x"/>']) assert.throws(() => inspect(svg.replace('</svg>', `${payload}</svg>`)));
  assert.throws(() => inspect(svg.replace('<svg ', '<svg onload="void(0)" ')));
  assert.throws(() => inspect(svg.replace('fill="var(--color-surface)"', 'fill="#123456"')));
  await assert.rejects(geometry(svg.replace('>Avant · A', '>' + 'W'.repeat(50))));
});
