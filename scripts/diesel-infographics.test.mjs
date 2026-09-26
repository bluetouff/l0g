import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { XMLValidator } from 'fast-xml-parser';
import { fromHtml } from 'hast-util-from-html';
import { toText } from 'hast-util-to-text';
import sharp from 'sharp';

const articles = [
  '../src/content/posts/diesel-americain-exportations-prix-essence.md',
  '../src/content/posts-en/us-diesel-export-restrictions-gasoline-prices.md',
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
  assert.match(root.viewBox, /^0 0 500 (340|334)$/u);
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

test('Diesel figures keep bilingual labels within a compact themed layout', async () => {
  assert.deepEqual(figures.map(set => set.length), [2, 2]);
  for (const svg of figures.flat()) await geometry(svg);
});

function checkBars(svg) {
  const bars = inspect(svg).filter(node => node.tagName === 'rect' && Number(node.properties.height) === 30).map(node => node.properties);
  assert.equal(bars.length, 2);
  for (const [i, value] of [5.215, 1.559].entries()) {
    assert.equal(Number(bars[i].x), 24);
    assert(Math.abs(Number(bars[i].width) / 440 * 6 - value) < 1e-8, 'Each bar must use the 0–6 million barrels/day scale');
  }
  assert(Math.abs(Number(bars[1].width) / Number(bars[0].width) - 1.559 / 5.215) < 1e-8);
  assert.notEqual(bars[0].y, bars[1].y, 'Production and gross exports are separate flows, not a stacked allocation');
}

test('Exports and net production use the same scale and four-week scope', () => {
  for (const [i, pair] of figures.entries()) {
    checkBars(pair[0]);
    const text = toText(fromHtml(pair[0], { fragment: true }));
    assert(text.includes(i === 0 ? '18 septembre 2026' : 'September 18, 2026'));
    assert(text.includes(i === 0 ? '29,9' : '29.9'));
  }
  assert.throws(() => checkBars(figures[0][0].replace('width="114.326667"', 'width="200"')));
});

test('Joint production connects one refinery to four distinct outputs without quantitative shares', () => {
  for (const pair of figures) {
    const nodes = inspect(pair[1]);
    const connectors = nodes.filter(node => node.tagName === 'path').map(node => node.properties.d);
    assert(connectors.includes('M200 199H246 M246 117V291'));
    for (const y of [117, 175, 233, 291]) assert(connectors.some(d => d.startsWith(`M246 ${y}H274`)));
    assert.equal(nodes.filter(node => node.tagName === 'g').length, 5);
  }
});

test('Geometry rejects translated overflow and text escaping its output panel', async () => {
  await assert.rejects(geometry(figures[1][1].replace('>Other products<', '>' + 'W'.repeat(50) + '<')));
  await assert.rejects(geometry(figures[0][1].replace('x="379.0" y="125.0"', 'x="490" y="125.0"')));
});

test('SVG validation rejects active content, external assets and arbitrary colors', () => {
  const svg = figures[0][0];
  for (const payload of ['<script/>', '<foreignObject/>', '<image href="https://example.com/x"/>']) assert.throws(() => inspect(svg.replace('</svg>', `${payload}</svg>`)));
  assert.throws(() => inspect(svg.replace('<svg ', '<svg onload="void(0)" ')));
  assert.throws(() => inspect(svg.replace('fill="var(--color-surface)"', 'fill="url(https://example.com/x)"')));
  assert.throws(() => inspect(svg.replace('fill="var(--color-surface)"', 'fill="#123456"')));
});
