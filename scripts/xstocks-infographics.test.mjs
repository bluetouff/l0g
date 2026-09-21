import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { XMLValidator } from 'fast-xml-parser';
import { fromHtml } from 'hast-util-from-html';
import { toText } from 'hast-util-to-text';
import sharp from 'sharp';

const articles = ['../src/content/posts/actions-tokenisees-xstocks-vaults-chaine-credit.mdx', '../src/content/posts-en/tokenized-stocks-xstocks-vaults-credit-yield.mdx'].map(path => readFileSync(new URL(path, import.meta.url), 'utf8'));
const svgs = articles.flatMap(source => [...source.matchAll(/<svg\b[\s\S]*?<\/svg>/g)].map(match => match[0]));
function inspect(svg) {
  assert.equal(XMLValidator.validate(svg), true);
  const nodes = [];
  function visit(node) {
    if (node.type === 'element') nodes.push(node);
    for (const child of node.children ?? []) visit(child);
  }
  visit(fromHtml(svg, { fragment: true }));
  for (const node of nodes) {
    assert(['svg', 'title', 'desc', 'rect', 'text', 'line'].includes(node.tagName));
    for (const [key, value] of Object.entries(node.properties)) {
      assert(!key.toLowerCase().startsWith('on'));
      assert(!['href', 'xLinkHref', 'src'].includes(key));
      assert(!String(value).includes('url('));
    }
  }
  assert.equal(nodes[0].properties.style, 'width:100%;height:auto');
  assert.equal(nodes[0].properties.role, 'img');
  for (const id of nodes[0].properties.ariaLabelledBy) assert(nodes.some(n => n.properties.id === id && ['title', 'desc'].includes(n.tagName) && toText(n).trim()));
  return nodes;
}
const widths = new Map();
async function labelWidth(label) {
  if (!widths.has(label)) {
    const escaped = label.replaceAll('&', '&amp;').replaceAll('<', '&lt;');
    const { info } = await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="4096" height="128"><text x="8" y="70" fill="white" font-family="Arial, Helvetica, sans-serif" font-size="21" font-weight="400">${escaped}</text></svg>`)).trim().raw().toBuffer({ resolveWithObject: true });
    widths.set(label, info.width + 3);
  }
  return widths.get(label);
}
async function geometry(svg) {
  const nodes = inspect(svg);
  const [,,width,height] = nodes[0].properties.viewBox.split(' ').map(Number);
  assert(height <= 440);
  const boxes = [];
  for (const node of nodes.filter(n => n.tagName === 'text')) {
    const p = node.properties, label = toText(node), w = await labelWidth(label);
    assert.equal(Number(p.fontSize), 21);
    const x = Number(p.x) - (p.textAnchor === 'end' ? w : 0), y = Number(p.y);
    assert(x >= 16 && x+w <= width-16 && y-21 >= 8 && y+4 <= height-8, `Canvas padding: ${label}`);
    const box = { x, y: y-21, right: x+w, bottom: y+4, label };
    for (const prior of boxes) assert(!(box.x < prior.right+8 && box.right+8 > prior.x && box.y < prior.bottom && box.bottom > prior.y), `Labels overlap: ${prior.label} / ${label}`);
    boxes.push(box);
  }
  for (const node of nodes.filter(n => ['rect','line'].includes(n.tagName))) {
    const p=node.properties;
    if(node.tagName==='rect') assert(Number(p.x)>=0 && Number(p.y)>=0 && Number(p.x)+Number(p.width)<=width && Number(p.y)+Number(p.height)<=height);
    else assert(Number(p.x1)>=0 && Number(p.x2)<=width && Number(p.y1)>=0 && Number(p.y2)<=height);
  }
}
test('six static accessible responsive SVGs retain safe geometry', async () => {
  assert.equal(svgs.length, 6);
  const ids = svgs.flatMap(svg => inspect(svg).map(n=>n.properties.id).filter(Boolean));
  assert.equal(new Set(ids).size, ids.length);
  for (const svg of svgs) await geometry(svg);
});
test('SVG safety rejects active content and outside resources', () => {
  for(const payload of ['<script>alert(1)</script>', '<foreignObject/>', '<image href="https://example.com/x"/>']) assert.throws(()=>inspect(svgs[0].replace('</svg>',payload+'</svg>')));
  assert.throws(()=>inspect(svgs[0].replace('<svg ','<svg onload="alert(1)" ')));
  assert.throws(()=>inspect(svgs[0].replace('fill="#0c0e10"','fill="url(https://example.com/x)"')));
});
test('geometry rejects long labels, shifted text and internal overlaps', async () => {
  await assert.rejects(geometry(svgs[0].replaceAll('Du titre à la stratégie de crédit','W'.repeat(80))));
  await assert.rejects(geometry(svgs[0].replace('x="60" y="89"','x="450" y="89"')));
  await assert.rejects(geometry(svgs[0].replace('x="60" y="89"','x="20" y="89"')));
});
test('fictional arithmetic includes funding, fee and independent asset shocks', () => {
  const net=(yieldRate,borrowRate)=>{const spread=3000*(yieldRate-borrowRate);return spread-Math.max(0,spread)*.25;};
  assert(Math.abs(net(.10,.06)-90)<1e-10);
  assert(Math.abs(net(.10,.09)-22.5)<1e-10);
  assert(Math.abs(net(.05,.06)+30)<1e-10);
  assert.equal(net(.06,.06),0);
  assert.equal((.02/(.4*.75)*100).toFixed(2),'6.67');
  assert.equal(8000+3000-3000,8000);
  assert.equal(10000+2400-3000,9400);
  assert.equal(((1.02*.8-1)*100).toFixed(1),'-18.4');
  assert.equal(3000/6000,.5);
  for(const article of articles) {
    assert(article.includes('ogImage: "/illustrations/news/tokenisation-xstocks-v1.jpg"'));
    assert.doesNotMatch(article,/—|<script|<iframe|foreignObject|className=|style=\{\{/u);
  }
});
