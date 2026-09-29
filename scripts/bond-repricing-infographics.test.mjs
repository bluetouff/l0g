import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { XMLValidator } from 'fast-xml-parser';
import { fromHtml } from 'hast-util-from-html';
import { toText } from 'hast-util-to-text';
import sharp from 'sharp';
import { editorialSourceDomainTiers } from '../src/config/primary-sources.ts';

const articles = [
  '../src/content/posts/le-monde-redecouvre-le-prix-de-l-argent.md',
  '../src/content/posts-en/the-world-rediscovers-the-price-of-money.md',
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
  assert.match(root.viewBox, /^0 0 480 534$/u);
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
  const rows=figures.map(svg=>inspect(svg).filter(n=>n.tagName==='rect'&&Number(n.properties.height)===26).map(n=>n.properties));
  assert.deepEqual(rows.map(r=>r.length),[4,4]);
  for(const [i,value] of [4.79,5.26,5.27,5.59].entries()){near(Number(rows[0][i].x),24);near(Number(rows[0][i].width)/420,value/6);}
  for(const [i,value] of [20,26,38,50].entries()){near(Number(rows[1][i].x),24);near(Number(rows[1][i].width)/420,value/50);}
  near((5.26-4.79)*100,47);near((5.59-5.27)*100,32);
  for(let year=0;year<=5;year++) near(1000*((1-year*0.2)*0.02+year*0.2*0.05),20+6*year);
  assert.equal((100/1.03**10).toFixed(2),'74.41');assert.equal((100/1.05**10).toFixed(2),'61.39');
}
test('Bond repricing graphics preserve compact, themed, accessible geometry in both languages', async () => {
  assert.deepEqual(figures.map(a => a.length),[2,2]);
  for(const svg of figures.flat()) await geometry(svg);
});
test('Bond repricing charts preserve observation dates, units, zero-based scales and calculations', () => {
  for(const pair of figures) proportions(pair);
  for(const article of articles) {
    assert(article.includes('29 septembre 2026')||article.includes('September 29, 2026'));
    assert(article.includes('hypothétique')||article.includes('hypothetical'));
    assert(article.includes('capitalisation continue')||article.includes('continuous compounding'));
    assert(article.includes('refinancement au début')||article.includes('start-of-year refinancing'));
    assert(article.includes('1,25 %')||article.includes('1.25%'));
    assert(article.includes('réinvestissement')||article.includes('reinvestment'));
    assert(article.includes('double comptage')||article.includes('double counting'));
    assert(!article.includes('@@'));assert(!article.includes('—'));
  }
});
test('Regression guards reject shifted labels, distorted values and unsafe SVG', async () => {
  await assert.rejects(() => geometry(figures[0][0].replace('x="24" y="38"','x="440" y="38"')));
  assert.throws(() => proportions([figures[0][0].replace('width="335.300000"','width="420"'),figures[0][1]]));
  assert.throws(() => proportions([figures[0][0],figures[0][1].replace('width="319.200000"','width="350"')]));
  assert.throws(() => inspect(figures[0][0].replace('<svg ', '<svg onload="alert(1)" ')));
});
test('Bond repricing references retain bilingual parity and recognised official publishers', () => {
  const sources = articles.map(article => elements(fromHtml(article.match(/<ol class="l0g-bond-repricing-sources">[\s\S]*?<\/ol>/u)[0], { fragment: true }))
    .filter(node => node.tagName === 'a').map(node => node.properties.href));
  assert.equal(sources[0].length, 11);
  assert.deepEqual(sources[0], sources[1]);
  for (const host of ['fhfa.gov']) {
    assert(editorialSourceDomainTiers.primary.includes(host));
    assert(!editorialSourceDomainTiers.primary.includes(`${host}.example.org`));
    assert(sources[0].some(url => new URL(url).hostname.replace(/^www\./u, '') === host));
  }
});
