import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { XMLValidator } from 'fast-xml-parser';
import { fromHtml } from 'hast-util-from-html';
import { toText } from 'hast-util-to-text';
import sharp from 'sharp';

const articles = [
  '../src/content/posts/neutralite-carbone-credits-produit-promesse.md',
  '../src/content/posts-en/carbon-neutral-claims-offsets-product-risk.md',
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
  assert.match(root.viewBox, /^0 0 480 (?:454|440)$/u);
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
  const rows = figures.map(svg=>inspect(svg).filter(n=>n.tagName==='rect' && [30,38].includes(Number(n.properties.height))).map(n=>n.properties));
  assert.deepEqual(rows.map(r=>r.length),[3,4]);
  for(const [i,value] of [100,100,80].entries()) { near(Number(rows[0][i].x),32); near(Number(rows[0][i].width)/400,value/100); }
  for(const [i,value] of [40,60,40,20].entries()) { near(Number(rows[1][i].x),i%2?192:32); near(Number(rows[1][i].width)/400,value/100); }
  near((100-80)/100*100,20); near(100-40,60); near(60-40,20); near((100-40)/(60-40),3);
}
test('Carbon illustrations retain compact, themed, accessible geometry in both languages', async()=>{
  assert.deepEqual(figures.map(a=>a.length),[2,2]);
  for(const svg of figures.flat()) await geometry(svg);
});
test('Product and baseline comparisons preserve zero-based proportional scales',()=>{
  for(const pair of figures) proportions(pair);
  for(const article of articles) {
    assert(article.includes('100 − 80')); assert(article.includes('100 − 40')); assert(article.includes('60 − 40'));
    assert(article.includes('fictif')||article.includes('hypothetical'));
    assert(article.includes('kg CO₂e')); assert(article.includes('tonnes'));
  }
});
test('Regression guards reject displaced labels, misleading lengths and unsafe SVG',async()=>{
  await assert.rejects(()=>geometry(figures[0][0].replace('x="24" y="38"','x="440" y="38"')));
  assert.throws(()=>proportions([figures[0][0].replace('width="320"','width="400"'),figures[0][1]]));
  assert.throws(()=>proportions([figures[0][0],figures[0][1].replace('width="80"','width="240"')]));
  assert.throws(()=>inspect(figures[0][0].replace('<svg ', '<svg onload="alert(1)" ')));
});
