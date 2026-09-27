import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { XMLValidator } from 'fast-xml-parser';
import { fromHtml } from 'hast-util-from-html';
import { toText } from 'hast-util-to-text';
import sharp from 'sharp';

const articles = [
  '../src/content/posts/ia-ralentissement-6-dettes-contrats-garanties.md',
  '../src/content/posts-en/ai-slowdown-6-debt-contracts-guarantees.md',
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

const near = (actual, expected) => assert(Math.abs(actual - expected) < 0.00001, `${actual} differs from ${expected}`);
const bars = (svg, height) => inspect(svg).filter(node => node.tagName === 'rect' && Number(node.properties.height) === height);

function checkDurations(svg) {
  const chart = bars(svg, 32);
  assert.equal(chart.length, 2);
  for (const [i, years] of [3, 5].entries()) {
    near(Number(chart[i].properties.x), 40);
    near(Number(chart[i].properties.width), years * 80);
  }
  assert.match(svg, /moyenne|average/);
  assert.match(svg, /10 août 2026|August 10, 2026/);
}

// Compute examples independently of the SVG construction code.
const compensation = (threshold, value, triggered) => triggered ? Math.max(threshold - value, 0) : 0;
function checkGuarantee(svg) {
  const curve = inspect(svg).find(node => node.tagName === 'path' && node.properties.stroke === 'var(--color-accent)');
  assert(curve);
  const coordinates = curve.properties.d.match(/-?\d+(?:\.\d+)?/gu).map(Number);
  const expected = [70, 330 - compensation(80, 0, true) * 2.625, 70 + 80 * 380 / 120, 330, 450];
  assert.equal(coordinates.length, expected.length);
  coordinates.forEach((value, i) => near(value, expected[i]));
  const points = bars(svg, 8);
  assert.equal(points.length, 2);
  [50, 90].forEach((value, i) => {
    near(Number(points[i].properties.x) + 4, 70 + value * 380 / 120);
    near(Number(points[i].properties.y) + 4, 330 - compensation(80, value, true) * 2.625);
  });
  assert.match(svg, /fictif|Hypothetical/);
  assert.match(svg, /conditions de déclenchement|triggering conditions/);
}

function checkInterest(svg) {
  let compounded = 100, cashPaid = 0;
  for (let year = 0; year < 2; year++) { compounded += compounded * 0.1; cashPaid += 100 * 0.1; }
  near(compounded, 121); near(cashPaid, 20);
  const chart = bars(svg, 30);
  assert.equal(chart.length, 3);
  [0, 1].forEach(i => { near(Number(chart[i].properties.x), 40); near(Number(chart[i].properties.width), 100 * 3); });
  near(Number(chart[2].properties.x), 40 + 100 * 3);
  near(Number(chart[2].properties.width), (compounded - 100) * 3);
  assert.match(svg, /deux ans|two years/);
  assert.match(svg, /capitalisés annuellement|Annually compounded/);
}

test('AI debt graphics use compact theme-aware accessible geometry', async () => {
  assert.deepEqual(figures.map(set => set.length), [3, 3]);
  for (const svg of figures.flat()) await geometry(svg);
});

test('Durations, conditional compensation and compound interest determine chart geometry', () => {
  for (const [durations, guarantee, interest] of figures) { checkDurations(durations); checkGuarantee(guarantee); checkInterest(interest); }
  assert.equal(compensation(80, 50, false), 0);
  assert.equal(compensation(80, 50, true), 30);
  assert.equal(compensation(80, 80, true), 0);
  assert.equal(compensation(80, 90, true), 0);
  near(100 * 0.1 * 6 / 12, 5);
});

test('Chart checks reject shifted baselines, incorrect units and interest without compounding', () => {
  assert.throws(() => checkDurations(figures[0][0].replace('width="240.000000"', 'width="200"')));
  assert.throws(() => checkDurations(figures[0][0].replace('x="40.000000"', 'x="50"')));
  assert.throws(() => checkGuarantee(figures[0][1].replace('L323.333333 330', 'L323.333333 300')));
  assert.throws(() => checkGuarantee(figures[0][1].replace('y="247.25"', 'y="230"')));
  assert.throws(() => checkInterest(figures[0][2].replace('width="63.000000"', 'width="60"')));
  assert.throws(() => checkInterest(figures[0][2].replace('x="340.000000"', 'x="40"')));
});

test('SVG validation rejects active content, external assets and arbitrary colors', async () => {
  const svg = figures[0][0];
  for (const payload of ['<script/>', '<foreignObject/>', '<image href="https://example.com/x"/>']) assert.throws(() => inspect(svg.replace('</svg>', `${payload}</svg>`)));
  assert.throws(() => inspect(svg.replace('<svg ', '<svg onload="void(0)" ')));
  assert.throws(() => inspect(svg.replace('fill="var(--color-surface)"', 'fill="url(https://example.com/x)"')));
  assert.throws(() => inspect(svg.replace('fill="var(--color-surface)"', 'fill="#123456"')));
  await assert.rejects(geometry(svg.replaceAll('>Deux durées', '>' + 'W'.repeat(50) + 'Deux durées')));
});
