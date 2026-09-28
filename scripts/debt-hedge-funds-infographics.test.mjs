import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { XMLValidator } from 'fast-xml-parser';
import { fromHtml } from 'hast-util-from-html';
import { toText } from 'hast-util-to-text';
import sharp from 'sharp';

const articles = [
  '../src/content/posts/dette-francaise-hedge-funds.mdx',
  '../src/content/posts-en/french-debt-hedge-funds.mdx',
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
  assert.match(root.viewBox, /^0 0 480 (480|440|420)$/u);
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
  const bars = index => inspect(figures[index]).filter(n => n.tagName === 'rect').map(n => n.properties);
  const shares = bars(0).filter(p => Number(p.height) === 12 && Number(p.width) < 432);
  assert.equal(shares.length,5);
  [57.5,20.6,10.5,9.6,1.8].forEach((v,i)=>near(Number(shares[i].width),432*v/100));
  near([57.5,20.6,10.5,9.6,1.8].reduce((a,b)=>a+b),100);
  const sale = bars(1).filter(p=>Number(p.height)===34);
  assert.equal(sale.length,3);
  near(Number(sale[0].width),432);
  near(Number(sale[1].width),432*.95);
  near(Number(sale[2].width),432*.05);
  near(Number(sale[2].x),24+Number(sale[1].width));
  const cost = bars(2).filter(p=>Number(p.height)===20);
  assert.equal(cost.length,3);
  [3.2,23.5,33.5].forEach((v,i)=>near(Number(cost[i].width),432*v/35));
}
test('Debt diagrams use safe themed SVG with legible labels and internal padding', async()=>{
  assert.deepEqual(figures.map(a=>a.length),[3,3]);
  for(const svg of figures.flat()) await geometry(svg);
});
test('Holdings, collateral reduction and annual budget costs preserve their denominators',()=>{
  for(const series of figures)proportions(series);
});
test('Geometry and calculation checks reject a displaced label or a changed scale',async()=>{
  await assert.rejects(()=>geometry(figures[0][0].replace('x="456"','x="486"')));
  assert.throws(()=>proportions([figures[0][0],figures[0][1].replace('width="410.4"','width="400"'),figures[0][2]]));
});
