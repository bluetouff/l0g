import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { XMLValidator } from 'fast-xml-parser';
import { fromHtml } from 'hast-util-from-html';
import { toText } from 'hast-util-to-text';
import sharp from 'sharp';

const articles = [
  '../src/content/posts/assurance-resiliation-sinistre-non-responsable-selection-risques.md',
  '../src/content/posts-en/not-at-fault-insurance-non-renewal-risk-selection.md',
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
  assert.match(root.viewBox, /^0 0 480 (410|420|430)$/u);
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
  const bars = index => inspect(figures[index]).filter(n => n.tagName === 'rect' && Number(n.properties.height) === 28).map(n=>n.properties);
  const cost = bars(0), payout = bars(2);
  assert.equal(cost.length, 2);
  near(Number(cost[1].width)/Number(cost[0].width),0.98*1.053);
  near(98*2106,206388);
  near((206388/200000-1)*100,3.194);
  assert.equal(payout.length,2);
  near(Number(payout[0].width)/432,300/400);
  near(Number(payout[1].width)/432,1-300/400);
  near(Number(payout[1].x),24+Number(payout[0].width));
  assert.equal(10000*300/400,7500);
  const lossBars=inspect(figures[1]).filter(n=>n.tagName==='rect'&&Number(n.properties.width)===72);
  assert.equal(lossBars.length,3);
  for(const n of lossBars){near(Number(n.properties.height),8*18);near(Number(n.properties.y),328-8*18);}
  const threshold=inspect(figures[1]).find(n=>n.tagName==='path'&&n.properties.strokeDashArray);
  assert.equal(threshold.properties.d,'M 44 148 H 450');
  near(328-148,10*18);
  assert.equal([8,8,8].reduce((sum,loss)=>sum+Math.max(0,loss-10),0),0);
  assert.equal(8*3,24);
}
test('Insurance diagrams retain readable themed labels in both languages',async()=>{
  assert.deepEqual(figures.map(a=>a.length),[3,3]);
  for(const svg of figures.flat())await geometry(svg);
});
test('Cost, per-event retention and proportional payout examples use correct arithmetic and scales',()=>{
  for(const series of figures)proportions(series);
});
test('Geometry and scale checks reject displaced text and a misleading cost bar',async()=>{
  await assert.rejects(()=>geometry(figures[0][0].replace('x="24" y="120"','x="440" y="120"')));
  assert.throws(()=>proportions([figures[0][0].replace('width="412.776"','width="430"'),figures[0][1],figures[0][2]]));
});
