import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { XMLValidator } from 'fast-xml-parser';
import { fromHtml } from 'hast-util-from-html';
import { toText } from 'hast-util-to-text';
import sharp from 'sharp';

const articles = [
  '../src/content/posts/quand-le-credit-commence-a-trier-l-ia.md',
  '../src/content/posts-en/when-credit-starts-sorting-ai.md',
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
  assert.match(root.viewBox, /^0 0 480 440$/u);
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

const near = (a,b) => assert(Math.abs(a-b)<1e-7, `${a} != ${b}`);
function proportions(figures) {
  const rows = figures.map(svg => inspect(svg).filter(n => n.tagName === 'rect' && [30,34].includes(Number(n.properties.height))).map(n => n.properties));
  assert.deepEqual(rows.map(r => r.length), [2,3]);
  for (const [i,value] of [23.103,28.499].entries()) { near(Number(rows[0][i].x),24); near(Number(rows[0][i].width)/420,value/30); }
  for (const [i,value] of [100,112,100].entries()) { near(Number(rows[1][i].x),24); near(Number(rows[1][i].width)/420,value/120); }
  near(23.103-28.499,-5.396);
  assert.equal((100*(1-1/1.12)).toFixed(1),'10.7');
}
test('AI credit graphics preserve compact, themed, accessible geometry in both languages', async () => {
  assert.deepEqual(figures.map(a => a.length),[2,2]);
  for(const svg of figures.flat()) await geometry(svg);
});
test('Cash flow and DSCR graphics retain zero-based scales and correct arithmetic', () => {
  for(const pair of figures) proportions(pair);
  for(const article of articles) {
    assert(article.includes('23,103 − 28,499') || article.includes('23.103 − 28.499'));
    assert(article.includes('1 − 1 / 1,12') || article.includes('1 − 1 / 1.12'));
    assert(article.includes('2025')); assert(article.includes('2026'));
    assert(article.includes('modèle') || article.includes('model'));
    assert(article.includes('avances clients') || article.includes('customer advances'));
    assert(article.includes('non-GAAP'));
    for(const unverified of ['7,55','7.55','230 points','255 points','185 points']) assert(!article.includes(unverified));
  }
});
test('Regression guards reject shifted labels, distorted values and unsafe SVG', async () => {
  await assert.rejects(() => geometry(figures[0][0].replace('x="24" y="38"','x="440" y="38"')));
  assert.throws(() => proportions([figures[0][0].replace('width="323.442000"','width="420"'),figures[0][1]]));
  assert.throws(() => proportions([figures[0][0],figures[0][1].replace('width="392.000000"','width="350"')]));
  assert.throws(() => inspect(figures[0][0].replace('<svg ', '<svg onload="alert(1)" ')));
});
