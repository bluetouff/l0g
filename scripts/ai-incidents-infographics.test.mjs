import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { XMLValidator } from 'fast-xml-parser';
import { fromHtml } from 'hast-util-from-html';
import { toText } from 'hast-util-to-text';
import sharp from 'sharp';

const articles = [
  '../src/content/posts/ia-ralentissement-2-incidents-securite-faits.md',
  '../src/content/posts-en/ai-slowdown-2-what-agents-actually-did.md',
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
  assert.match(root.viewBox, /^0 0 500 382$/u);
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

test('AI incident figures keep bilingual labels within a compact themed layout', async () => {
  assert.deepEqual(figures.map(set => set.length), [2, 2]);
  for (const svg of figures.flat()) await geometry(svg);
});

function checkTiming(svg) {
  const timestamps = ['09:50:23', '10:02:11', '10:05:06', '12:34:30'];
  const seconds = timestamps.map(time => time.split(':').map(Number).reduce((sum, item) => sum * 60 + item, 0));
  const intervals = seconds.slice(1).map((end, index) => end - seconds[index]);
  assert.deepEqual(intervals, [708, 175, 8964]);
  assert.equal(seconds.at(-1) - seconds[0], 9847);
  assert(timestamps.every(time => svg.includes(time)), 'All source timestamps must remain visible to assistive technology');
  const nodes = inspect(svg);
  const bars = nodes.filter(node => node.tagName === 'rect' && Number(node.properties.height) === 18);
  assert.equal(bars.length, 3);
  assert(bars.every(node => Number(node.properties.x) === 24), 'Bars must share a zero baseline');
  for (const [i, bar] of bars.entries()) {
    assert(Math.abs(Number(bar.properties.width) - intervals[i] / 60 * 400 / 180) < 0.000001, 'Duration bars must use the shared 0–180 minute scale');
  }
}

test('Shutdown intervals are independently calculated and use one zero-based minute scale', () => {
  for (const pair of figures) checkTiming(pair[1]);
});

test('Timing validation rejects a shifted baseline and a misleading duration ratio', () => {
  const svg = figures[0][1];
  assert.throws(() => checkTiming(svg.replace('x="24" y="126"', 'x="30" y="126"')));
  assert.throws(() => checkTiming(svg.replace('width="332.000000"', 'width="320"')));
});

test('Geometry rejects long translations and labels escaping their panel', async () => {
  await assert.rejects(geometry(figures[1][0].replace('>Agent A<', '>' + 'W'.repeat(50) + '<')));
  await assert.rejects(geometry(figures[0][0].replace('x="104.0" y="134.0"', 'x="180" y="134.0"')));
});

test('SVG validation rejects active content, external assets and arbitrary colors', () => {
  const svg = figures[0][0];
  for (const payload of ['<script/>', '<foreignObject/>', '<image href="https://example.com/x"/>']) assert.throws(() => inspect(svg.replace('</svg>', `${payload}</svg>`)));
  assert.throws(() => inspect(svg.replace('<svg ', '<svg onload="void(0)" ')));
  assert.throws(() => inspect(svg.replace('fill="var(--color-surface)"', 'fill="url(https://example.com/x)"')));
  assert.throws(() => inspect(svg.replace('fill="var(--color-surface)"', 'fill="#123456"')));
});
