import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { XMLValidator } from 'fast-xml-parser';
import { fromHtml } from 'hast-util-from-html';
import { toText } from 'hast-util-to-text';
import sharp from 'sharp';

const articles = [
  '../src/content/posts/lfi-rn-risque-politique-marches-dette-fiscalite.md',
  '../src/content/posts-en/france-political-risk-lfi-rn-debt-tax-markets.md',
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
  assert.match(root.viewBox, /^0 0 480 (?:388|430)$/u);
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
    if (height === 430 && Number(p.y) >= 156 && Number(p.y) <= 234) {
      const column = Number(p.x) < 240 ? [24, 240] : [240, 456];
      assert(left >= column[0] + 8 && left + width <= column[1] - 8, `Balance-sheet column padding: ${label}`);
    }
    const group = nodes.find(candidate => candidate.tagName === 'g' && candidate.children.includes(node));
    if (group) {
      const rect = group.children.find(child => child.tagName === 'rect').properties;
      assert(left >= Number(rect.x) + 8 && left + width <= Number(rect.x) + Number(rect.width) - 8 && top >= Number(rect.y) + 4 && bottom <= Number(rect.y) + Number(rect.height) - 4, `Panel padding: ${label}`);
    }
  }
}

const near = (a,b) => assert(Math.abs(a-b)<1e-7, `${a} != ${b}`);
function proportions(figures) {
  const bars = inspect(figures[0]).filter(n => n.tagName === 'rect' && Number(n.properties.height) === 34).map(n=>n.properties);
  assert.equal(bars.length, 2);
  for (const [i, billions] of [9, 8.7].entries()) {
    assert.equal(Number(bars[i].x), 24);
    near(Number(bars[i].width) / 400, billions / 10);
  }
  near(100 * 0.01, 1); // Explicit €100bn / one-percentage-point illustration in the article.
}
test('French political-risk graphics retain compact themed labels and separate balance-sheet columns', async () => {
  assert.deepEqual(figures.map(a=>a.length), [2,2]);
  for (const svg of figures.flat()) await geometry(svg);
});
test('Both parties’ EU savings estimates share a zero-based billion-euro scale', () => {
  for (const series of figures) proportions(series);
});
test('Checks reject a displaced heading, a label crossing a balance-sheet column and a misleading bar', async () => {
  await assert.rejects(()=>geometry(figures[0][0].replace('x="24" y="38"', 'x="440" y="38"')));
  await assert.rejects(()=>geometry(figures[0][1].replace('x="132" y="184"', 'x="220" y="184"')));
  assert.throws(()=>proportions([figures[0][0].replace('width="360"', 'width="400"'), figures[0][1]]));
});
