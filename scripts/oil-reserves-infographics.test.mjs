import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { XMLValidator } from 'fast-xml-parser';
import { fromHtml } from 'hast-util-from-html';
import { toText } from 'hast-util-to-text';
import sharp from 'sharp';
import { editorialSourceDomainTiers } from '../src/config/primary-sources.ts';

const articles = [
  '../src/content/posts/petrole-reserves-strategiques-prets-temps.md',
  '../src/content/posts-en/strategic-oil-reserves-borrowing-time.md',
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

const near = (a,b) => assert(Math.abs(a-b)<1e-6, `${a} != ${b}`);
function proportions(pair) {
  const nodes=pair.map(inspect);
  const flow=nodes[0].filter(n=>n.tagName==='rect'&&['var(--color-signal)','var(--color-accent)'].includes(n.properties.fill)).map(n=>n.properties);
  assert.equal(flow.length,2);
  for(const [i,[days,rate]]of [[20,2],[61,40/61]].entries()){
    near(Number(flow[i].x),60);near(Number(flow[i].width)/6,days);near(Number(flow[i].height)/50,rate);
    near(Number(flow[i].y)+Number(flow[i].height),i===0?240:440);
    near(Number(flow[i].width)*Number(flow[i].height)/(6*50),40);
  }
  const bars=i=>nodes[i].filter(n=>n.tagName==='rect'&&Number(n.properties.height)===26).map(n=>n.properties);
  assert.equal(bars(1).length,4);assert.equal(bars(2).length,6);
  for(const [i,value] of [7.5,14.5,16.5,17.5].entries()){near(Number(bars(1)[i].x),24);near(Number(bars(1)[i].width)/420,value/20);}
  for(const [i,value] of [406,284.6,414.8,426.4,123,107.4].entries()){near(Number(bars(2)[i].x),24);near(Number(bars(2)[i].width)/350,value/450);}
  near(7.5+10,17.5);near(40/61/2*100,32.78688524590164);near(40/2,20);
}
test('Oil reserve graphics preserve compact themed accessible geometry in both languages', async()=>{
  assert.deepEqual(figures.map(pair=>pair.length),[3,3]);for(const svg of figures.flat())await geometry(svg);
});
test('Stocks, physical premiums and stock-flow examples use distinct units, dates and zero-based scales',()=>{
  for(const pair of figures)proportions(pair);
  for(const article of articles){
    assert(article.includes('2029'));assert(article.includes('2027'));
    assert(article.includes('19 septembre 2025')||article.includes('September 19, 2025'));
    assert(article.includes('18 septembre 2026')||article.includes('September 18, 2026'));
    assert(article.includes('non arrondis')||article.includes('unrounded'));
    assert(article.includes('non américains')||article.includes('non-U.S.'));
    assert(article.includes('hypothétique')||article.includes('hypothetical'));
    assert(article.includes('prime supplémentaire')||article.includes('additional premium'));
    assert(article.includes('sans annualisation')||article.includes('not annualised'));
    assert(article.includes('500 000')||article.includes('500,000'));
    assert(!article.includes('83,33')&&!article.includes('$83.33'));
    assert(!article.includes('[[FIG')&&!article.includes('[S0')&&!article.includes('—'));
  }
});
test('Regression guards reject unsafe markup, clipped labels and changed chart quantities',async()=>{
  await assert.rejects(()=>geometry(figures[0][0].replace('x="24" y="38"','x="440" y="38"')));
  assert.throws(()=>inspect(figures[0][0].replace('<svg ','<svg onload="alert(1)" ')));
  const flow=[...figures[0]];flow[0]=flow[0].replace('width="120.000000"','width="180.000000"');assert.throws(()=>proportions(flow));
  const premium=[...figures[0]];premium[1]=premium[1].replace('width="157.500000"','width="200.000000"');assert.throws(()=>proportions(premium));
  const stock=[...figures[0]];stock[2]=stock[2].replace('width="315.777778"','width="350.000000"');assert.throws(()=>proportions(stock));
});
test('Reference lists retain bilingual parity, primary contract records and recognised publishers',()=>{
  const sources=articles.map(article=>elements(fromHtml(article.match(/<ol class="l0g-oil-reserves-sources">[\s\S]*?<\/ol>/u)[0],{fragment:true})).filter(n=>n.tagName==='a').map(n=>n.properties.href));
  assert.equal(sources[0].length,18);assert.deepEqual(sources[0],sources[1]);
  assert(sources[0][3].endsWith('Award%20Information.pdf'));
  assert(sources[0][17].endsWith('Request%20for%20Proposal.pdf'));
  for(const host of ['energy.gov','doe.gov','cmegroup.com']){
    assert(editorialSourceDomainTiers.primary.includes(host));assert(!editorialSourceDomainTiers.primary.includes(`${host}.example.org`));
    assert(sources[0].some(url=>{const h=new URL(url).hostname;return h===host||h.endsWith('.'+host)}));
  }
});
