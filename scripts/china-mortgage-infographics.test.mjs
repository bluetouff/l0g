import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { XMLValidator } from 'fast-xml-parser';
import { fromHtml } from 'hast-util-from-html';
import { toText } from 'hast-util-to-text';
import sharp from 'sharp';
import { editorialSourceDomainTiers } from '../src/config/primary-sources.ts';

const articles = [
  '../src/content/posts/chine-credit-immobilier-bonification-mensualites.md',
  '../src/content/posts-en/china-mortgage-subsidy-household-payments.md',
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
  assert.match(root.viewBox, /^0 0 480 (?:500|514|534)$/u);
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


const near=(a,b,tolerance=1e-6)=>assert(Math.abs(a-b)<tolerance, `${a} != ${b}`);
const rate=.03/12, payment=1_000_000*rate/(1-(1+rate)**-360);
let principal=1_000_000;const months=[];
for(let month=1;month<=360;month++){
 const interest=principal*rate,subsidy=month<=60?principal*.01/12:0;
 months.push({month,opening:principal,interest,repayment:payment-interest,subsidy,household:payment-subsidy});
 principal-=payment-interest;
}
function proportions(pair){
 const nodes=pair.map(inspect),bars=i=>nodes[i].filter(n=>n.tagName==='rect'&&[23,28].includes(Number(n.properties.height))).map(n=>n.properties);
 const first=bars(0);assert.equal(first.length,6);
 const expected=[months[0].repayment,months[0].interest,months[0].repayment,months[0].interest-months[0].subsidy,0,months[0].subsidy];
 for(const [i,value]of expected.entries())near(Number(first[i].width),350*value/4500);
 const market=bars(2);assert.equal(market.length,4);
 for(const [i,value]of [13,25.4,25.4,22.4].entries()){
  near(Number(market[i].width),420*value/30);near(Number(market[i].x)+Number(market[i].width),444);
 }
 const line=nodes[1].find(n=>n.tagName==='path'&&n.properties.stroke==='var(--color-signal)');assert(line);
 const points=String(line.properties.d).match(/[ML][\d.]+ [\d.]+/gu).map(point=>point.slice(1).split(' ').map(Number));assert.equal(points.length,61);
 for(const [i,[x,y]]of points.entries()){
  near(x,80+i*364/60);near(y,398-months[i].household*270/4500);
 }
}
test('China mortgage figures have compact themed accessible geometry in both languages',async()=>{
 assert.deepEqual(figures.map(pair=>pair.length),[3,3]);for(const svg of figures.flat())await geometry(svg);
});
test('Subsidy cash flows and NBS chart scales preserve the stated calculations',()=>{
 near(payment,4216.04033729456);near(months[59].household,3473.496967548704);
 near(months.reduce((sum,m)=>sum+m.subsidy,0),47342.017901548024);
 near(months[60].household-months[59].household,742.5433697458561);
 near(principal,0,1e-6);assert.equal(Math.round(months[59].household),3473);
 assert.equal(months[59].subsidy>0,true);assert.equal(months[60].subsidy,0);assert.equal(months[359].subsidy,0);
 for(const pair of figures)proportions(pair);
 for(const article of articles){
  assert(article.includes('106817'));assert(article.includes('106823'));
  assert(article.includes('120'));assert(article.includes('40'));
  assert(article.includes('47 342')||article.includes('47,342'));
  assert(article.includes('3 473')||article.includes('3,473'));
  assert(!article.includes('3 474')&&!article.includes('3,474'));
  assert(article.includes('hypothèses')||article.includes('assumptions'));
  assert(article.includes('bases comparables')||article.includes('comparable bases'));
  assert(article.includes('prévente')||article.includes('presale'));
  assert(article.includes('500 milliards')||article.includes('500-billion'));
  assert(article.includes('juxtapose')||article.includes('cash savings'));
  assert(article.indexOf('## Sources')<article.indexOf('## M'));
 }
});
test('Unsafe SVG and misleading chart mutations fail validation',()=>{
 const pair=figures[0];assert.throws(()=>inspect(pair[0].replace('role="img"','role="img" onload="alert(1)"')));
 assert.throws(()=>inspect(pair[0].replace('fill="var(--color-signal)"','fill="red"')));
 assert.throws(()=>proportions([pair[0].replace(/width="133\.46980401"/u,'width="140"'),pair[1],pair[2]]));
 assert.throws(()=>proportions([pair[0],pair[1],pair[2].replace('width="182.00000000"','width="190"')]));
});
