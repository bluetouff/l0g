import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { XMLValidator } from 'fast-xml-parser';
import { fromHtml } from 'hast-util-from-html';
import { toText } from 'hast-util-to-text';
import sharp from 'sharp';

const articles = [
  '../src/content/posts/aon-blackstone-cortina-prix-risque-reassurance.md',
  '../src/content/posts-en/aon-blackstone-cortina-reinsurance-risk-pricing.md',
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
  assert.match(root.viewBox, /^0 0 480 402$/u);
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
  const rows = figures.map(svg=>inspect(svg).filter(n=>n.tagName==='rect' && Number(n.properties.height)===34).map(n=>n.properties));
  assert.deepEqual(rows.map(r=>r.length),[3,2]);
  for(const [i,value] of [5,4.75].entries()) { near(Number(rows[0][i].x),40); near(Number(rows[0][i].width)/400,value/5); }
  near(Number(rows[0][2].x),420); near(Number(rows[0][2].width)/400,.25/5);
  for(const [i,value] of [.01,.1].entries()) { near(Number(rows[1][i].x),40); near(Number(rows[1][i].width)/400,value/.1); }
  near(100*(1-.05*.05),99.75);
  near(.285*.015*100,.4275);
  near(.1*.1,.01);
  near(0*.81+100*.18+200*.01,20);
  near(0*.9+200*.1,20);
  near(((100-72-20)-(95-72-20))/(100-72-20)*100,62.5);
}
test('Cortina illustrations retain compact, themed, accessible geometry in both languages', async()=>{
  assert.deepEqual(figures.map(a=>a.length),[2,2]);
  for(const svg of figures.flat()) await geometry(svg);
});
test('Discount and joint-loss charts keep zero-based proportional scales and explicit calculations',()=>{
  for(const pair of figures) proportions(pair);
  for(const article of articles) {
    assert(article.includes('99,75')||article.includes('99.75'));
    assert(article.includes('62,5')||article.includes('62.5'));
    assert(article.includes('fictif')||article.includes('hypothetical'));
  }
});
test('Regression guards reject a displaced heading and misleading bar lengths',async()=>{
  await assert.rejects(()=>geometry(figures[0][0].replace('x="24" y="38"','x="440" y="38"')));
  assert.throws(()=>proportions([figures[0][0].replace('width="380"','width="400"'),figures[0][1]]));
  assert.throws(()=>proportions([figures[0][0],figures[0][1].replace('width="40"','width="400"')]));
});
