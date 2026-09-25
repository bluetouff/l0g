import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { XMLValidator } from 'fast-xml-parser';
import { fromHtml } from 'hast-util-from-html';
import { toText } from 'hast-util-to-text';
import sharp from 'sharp';

const articles = [
  '../src/content/posts/yanbu-france-houthis-route-petrole.md',
  '../src/content/posts-en/yanbu-france-houthis-oil-route.md',
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
  assert.match(root.viewBox, /^0 0 500 (426|334)$/u);
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

test('Yanbu route and fleet graphics are compact, themed, accessible and fit translated labels', async () => {
  assert.deepEqual(figures.map(set => set.length), [2, 2]);
  for (const svg of figures.flat()) await geometry(svg);
});

test('fleet bars share a zero baseline and reflect the exact inverse rotation relationship', () => {
  const daily = days => 10 * 2_000_000 / days;
  assert.equal(Math.round(daily(60) / 1_000) * 1_000, 333_000);
  assert.equal(Math.round(daily(90) / 1_000) * 1_000, 222_000);
  for (const pair of figures) {
    const bars = inspect(pair[1]).filter(node => node.tagName === 'rect' && Number(node.properties.height) === 32);
    assert.equal(bars.length, 2);
    assert.equal(bars[0].properties.x, bars[1].properties.x);
    assert(Math.abs(Number(bars[1].properties.width) / Number(bars[0].properties.width) - daily(90) / daily(60)) < 1e-12);
  }
});

test('geometry rejects translated overflow and labels crossing their own panel', async () => {
  await assert.rejects(geometry(figures[1][0].replace('Eastern Saudi Arabia → East-West pipeline', 'W'.repeat(50))));
  await assert.rejects(geometry(figures[0][0].replace('x="131" y="345"', 'x="230" y="345"')));
});

test('SVG validation rejects active content, external assets and off-brand colors', () => {
  const svg = figures[0][0];
  for (const payload of ['<script/>', '<foreignObject/>', '<image href="https://example.com/x"/>']) {
    assert.throws(() => inspect(svg.replace('</svg>', `${payload}</svg>`)));
  }
  assert.throws(() => inspect(svg.replace('<svg ', '<svg onload="void(0)" ')));
  assert.throws(() => inspect(svg.replace('fill="var(--color-surface)"', 'fill="url(https://example.com/x)"')));
  assert.throws(() => inspect(svg.replace('fill="var(--color-surface)"', 'fill="#123456"')));
});
