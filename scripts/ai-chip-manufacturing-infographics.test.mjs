import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { XMLValidator } from 'fast-xml-parser';
import { fromHtml } from 'hast-util-from-html';
import { toText } from 'hast-util-to-text';
import sharp from 'sharp';

const articles = [
  '../src/content/posts/ia-ralentissement-4-chine-puces-memoire-usines.md',
  '../src/content/posts-en/ai-slowdown-4-china-chips-memory-factories.md',
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

test('Chip manufacturing charts keep bilingual labels inside compact themed layouts', async () => {
  assert.deepEqual(figures.map(set => set.length), [2, 2]);
  for (const svg of figures.flat()) await geometry(svg);
});

function checkBottleneck(svg) {
  const nodes = inspect(svg);
  const bars = nodes.filter(node => node.tagName === 'rect' && Number(node.properties.height) === 18);
  const timings = [[20, 80], [10, 80], [20, 40]];
  assert.equal(bars.length, 6);
  for (const [i, value] of timings.flat().entries()) {
    assert.equal(Number(bars[i].properties.x), 24, 'Each duration must start at zero, not stack');
    assert.equal(Number(bars[i].properties.width), value * 4, 'All durations must share the 0–100 ms scale');
  }
  const bounds = nodes.filter(node => node.tagName === 'text' && /^(?:Plancher|Lower bound):? /.test(toText(node)));
  assert.equal(bounds.length, 3);
  for (const [i, node] of bounds.entries()) {
    assert.equal(Number(toText(node).match(/(\d+) ms/)[1]), Math.max(...timings[i]), 'Fully overlapping durations take the maximum, not the sum');
  }
  assert.match(svg, /(?:entièrement simultanés|fully overlapping)/i);
}

function checkYield(svg) {
  const bars = inspect(svg).filter(node => node.tagName === 'rect' && Number(node.properties.height) === 26);
  assert.equal(bars.length, 4);
  for (const [i, [gross, yieldFraction]] of [[100, 0.90], [150, 0.60]].entries()) {
    const good = gross * yieldFraction, bad = gross - good;
    assert.equal(good, 90);
    for (const [j, value] of [good, bad].entries()) {
      assert.equal(Number(bars[2 * i + j].properties.width), value * 2.6, 'Counts share a single scale, not separately normalised percentages');
      assert.equal(Number(bars[2 * i + j].properties.x), j ? 24 + good * 2.6 : 24, 'Usable and rejected components must touch');
    }
  }
  assert.match(svg, /(?:capacité identique|equal capacity)/);
}

function checkMicronRelease(article) {
  const releasePath = '/news/press-release/2026/Micron-in-High-Volume-Production-of-HBM4-Designed-for-NVIDIA-Vera-Rubin-PCIe-Gen6-SSD-and-SOCAMM2-03-16-2026/default.aspx';
  const urls = [...article.matchAll(/https?:\/\/[^\s<>"')]+/gu)].map(([raw]) => new URL(raw));
  const releases = urls.filter(url => url.pathname === releasePath);
  assert(releases.length >= 1, 'The dated Micron release must be cited');
  for (const url of releases) assert.equal(url.origin, 'https://investors.micron.com', 'Use the canonical investor publication');
}

test('Overlap and manufacturing calculations use reproducible assumptions and shared scales', () => {
  for (const pair of figures) { checkBottleneck(pair[0]); checkYield(pair[1]); }
  for (const [i, article] of articles.entries()) {
    assert.match(article, i === 0 ? /entièrement fictif/ : /entirely hypothetical/i);
    assert.match(article, i === 0 ? /par rapport à la génération G4/ : /relative to G4/);
    assert.match(article, i === 0 ? /8 gigabits/ : /8-gigabit/);
    assert.match(article, /3C6000\/S, \/D et \/Q|3C6000\/S, \/D and \/Q/);
    checkMicronRelease(article);
  }
});

test('Micron citation check rejects staging, deceptive origins and insecure transport', () => {
  for (const origin of ['https://stage-investors.micron.com', 'https://investors.micron.com.example.org', 'https://investors.micron.com@other.example', 'https://other.example/investors.micron.com', 'http://investors.micron.com']) {
    assert.throws(() => checkMicronRelease(articles[0].replaceAll('https://investors.micron.com', origin)));
  }
});

test('Checks reject shifted baselines, a sum instead of overlap, and misleading yield bars', () => {
  assert.throws(() => checkBottleneck(figures[0][0].replace('x="24" y="131"', 'x="30" y="131"')));
  assert.throws(() => checkBottleneck(figures[0][0].replace('width="320.000000"', 'width="300"')));
  assert.throws(() => checkBottleneck(figures[1][0].replace('>Lower bound: 80 ms<', '>Lower bound: 100 ms<')));
  assert.throws(() => checkYield(figures[0][1].replace('width="234.000000"', 'width="260"')));
  assert.throws(() => checkYield(figures[0][1].replace('x="258.0"', 'x="260"')));
});

test('Geometry rejects an overflowing translation', async () => {
  await assert.rejects(geometry(figures[1][0].replace('>Compute<', '>' + 'W'.repeat(50) + '<')));
});

test('SVG validation rejects active content, external assets and arbitrary colors', () => {
  const svg = figures[0][0];
  for (const payload of ['<script/>', '<foreignObject/>', '<image href="https://example.com/x"/>']) assert.throws(() => inspect(svg.replace('</svg>', `${payload}</svg>`)));
  assert.throws(() => inspect(svg.replace('<svg ', '<svg onload="void(0)" ')));
  assert.throws(() => inspect(svg.replace('fill="var(--color-surface)"', 'fill="url(https://example.com/x)"')));
  assert.throws(() => inspect(svg.replace('fill="var(--color-surface)"', 'fill="#123456"')));
});
