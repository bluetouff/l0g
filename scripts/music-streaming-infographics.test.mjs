import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { XMLValidator } from 'fast-xml-parser';
import { fromHtml } from 'hast-util-from-html';
import { toText } from 'hast-util-to-text';
import sharp from 'sharp';

const articles = [
  '../src/content/posts/musique-ia-fausses-ecoutes-revenus-streaming.md',
  '../src/content/posts-en/ai-music-fake-streams-royalties.md',
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
  assert.match(root.viewBox, /^0 0 480 (520|530)$/u);
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
function allocation(svg) {
  const bars = rectangles(svg).filter(p => Number(p.height) === 32);
  assert.equal(bars.length, 5);
  const pool = 1000, real = 100000, artist = 10000, fake = 20000;
  const amounts = [pool * artist / real, pool * (real - artist) / real,
    pool * artist / (real + fake), pool * (real - artist) / (real + fake), pool * fake / (real + fake)];
  let x = 24;
  for (const [i, amount] of amounts.entries()) {
    if (i === 2) x = 24;
    near(Number(bars[i].x), x);
    near(Number(bars[i].width), amount / pool * 432);
    x += Number(bars[i].width);
    if (i === 1 || i === 4) near(x, 456);
  }
  near(amounts.slice(2).reduce((a,b) => a+b, 0), pool);
  near((amounts[0]-amounts[2])/amounts[0], 1/6);
  assert.match(svg, /83[,.]33/); assert.match(svg, /166[,.]67/);
}
function detection(svg) {
  const population = 10000, generated = 100, sensitivity = 0.99, specificity = 0.99;
  const correctFlags = generated * sensitivity;
  const incorrectFlags = (population-generated) * (1-specificity);
  near(correctFlags, 99); near(incorrectFlags, 99);
  near(correctFlags / (correctFlags + incorrectFlags), 0.5);
  near((correctFlags + (population-generated) * specificity) / population, 0.99);
  const bars = rectangles(svg).filter(p => [28,32].includes(Number(p.height)));
  assert.equal(bars.length,6);
  for (const [i, ratio] of [sensitivity,1-sensitivity,1-specificity,specificity,0.5,0.5].entries()) {
    near(Number(bars[i].width),432*ratio);
    near(Number(bars[i].x), i%2 ? 24+Number(bars[i-1].width) : 24);
  }
  assert.match(svg, /198/); assert.match(svg, /50 ?%/);
}
test('Music diagrams use safe themed SVG and keep readable labels inside the drawing', async () => {
  assert.deepEqual(figures.map(a=>a.length),[2,2]);
  for (const svg of figures.flat()) await geometry(svg);
});
test('Royalty dilution and classifier base rates match the displayed proportions in FR and EN', () => {
  for (const [money, detector] of figures) { allocation(money); detection(detector); }
});
test('Checks reject altered payouts, denominators and proportional bar geometry', () => {
  assert.throws(()=>allocation(figures[0][0].replace('width="36"','width="40"')));
  assert.throws(()=>allocation(figures[0][0].replaceAll('83,33','85,00')));
  assert.throws(()=>detection(figures[0][1].replace('width="4.32"','width="43.2"')));
  assert.throws(()=>detection(figures[0][1].replace('x="240" y="390"','x="241" y="390"')));
});
test('Checks reject active markup, foreign colours and text overflowing the chart', async () => {
  const svg=figures[0][0];
  for(const payload of ['<script/>','<foreignObject/>','<image href="https://example.com/x"/>']) assert.throws(()=>inspect(svg.replace('</svg>',payload+'</svg>')));
  assert.throws(()=>inspect(svg.replace('<svg ','<svg onload="void(0)" ')));
  assert.throws(()=>inspect(svg.replace('fill="var(--color-surface)"','fill="#123456"')));
  await assert.rejects(geometry(svg.replace('>Artiste : 100 €<','>'+'W'.repeat(50)+'<')));
});
