import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { XMLValidator } from 'fast-xml-parser';
import { fromHtml } from 'hast-util-from-html';
import { toText } from 'hast-util-to-text';

const articles = ['../src/content/posts/budget-2027-risque-obligataire-france.mdx', '../src/content/posts-en/france-2027-budget-bond-market-risk.mdx'].map(path => readFileSync(new URL(path, import.meta.url), 'utf8'));
const source = articles.join('\n');
const svgs = [...source.matchAll(/<svg\b[\s\S]*?<\/svg>/g)].map((match) => match[0]);
function elements(tree) {
  const nodes = [];
  function visit(node) {
    if (node.type === 'element') nodes.push(node);
    for (const child of node.children ?? []) visit(child);
  }
  visit(tree);
  return nodes;
}
function inspect(svg) {
  assert.equal(XMLValidator.validate(svg), true);
  const tree = fromHtml(svg, { fragment: true });
  const nodes = elements(tree);
  const allowed = new Set(['svg', 'title', 'desc', 'rect', 'text', 'line', 'polyline']);
  for (const node of nodes) {
    assert(allowed.has(node.tagName), `Unexpected element: ${node.tagName}`);
    for (const [key, value] of Object.entries(node.properties)) {
      assert(!key.toLowerCase().startsWith('on'));
      assert(!['href', 'xLinkHref', 'src'].includes(key));
      assert(!String(value).includes('url('));
    }
  }
  assert.equal(nodes[0].properties.style, 'width:100%;height:auto');
  assert.equal(nodes[0].properties.role, 'img');
  for (const id of nodes[0].properties.ariaLabelledBy) {
    assert(nodes.some((node) => node.properties.id === id && ['title', 'desc'].includes(node.tagName) && toText(node).trim()));
  }
  return { nodes, text: toText(tree) };
}

test('six budget figures are valid, accessible, static and responsive', () => {
  assert.equal(svgs.length, 6);
  const ids = svgs.flatMap((svg) => inspect(svg).nodes.map((node) => node.properties.id).filter(Boolean));
  assert.equal(new Set(ids).size, ids.length);
});

test('SVG contract rejects executable content and external resources', () => {
  for (const payload of ['<script>alert(1)</script>', '<foreignObject/>', '<image href="https://example.com/x"/>']) {
    assert.throws(() => inspect(svgs[0].replace('</svg>', `${payload}</svg>`)));
  }
  assert.throws(() => inspect(svgs[0].replace('<svg ', '<svg onload="alert(1)" ')));
  assert.throws(() => inspect(svgs[0].replace('<rect ', '<rect href="https://example.com/x" ')));
  assert.throws(() => inspect(svgs[0].replace('fill="#0c0e10"', 'fill="url(https://example.com/x)"')));
});

test('bilingual charts preserve compact typography, units and all source anchors', () => {
  for(const article of articles){
    assert.equal((article.match(/<figure /g)??[]).length,3);
    for(let n=1;n<=19;n++){
      assert.equal((article.match(new RegExp(`id="source-${n}"`,'g'))??[]).length,1);
      assert(article.includes(`](#source-${n})`));
    }
    assert.doesNotMatch(article,/\bce\s+qu(?:e\b|i\b|['’])|\bpreuves?\b|\bprouve(?:nt)?\b|—/iu);
    assert(article.includes('ogImage: "/illustrations/news/budget-2027-france-v1.jpg"'));
  }
  for(const svg of svgs){
    const {nodes}=inspect(svg);
    assert(+nodes[0].properties.viewBox.split(' ')[3]<=400);
    for(const n of nodes.filter(n=>n.tagName==='text')){assert(+n.properties.fontWeight<=500);assert(+n.properties.fontSize>=21);}
  }
});
test('bond and collateral bar lengths match their cash-flow calculations', () => {
  for(const index of [1,4]){
    const bars=inspect(svgs[index]).nodes.filter(n=>n.tagName==='rect'&&+n.properties.height===10);
    const price=(n,y)=>3*(1-(1+y)**(-n))/y+100*(1+y)**(-n);
    const expected=[price(10,.045),price(10,.055),price(30,.045),price(30,.055)];
    assert.equal(bars.length,4);
    bars.forEach((b,i)=>assert(Math.abs(+b.properties.width/4.4-expected[i])<.0001));
  }
  for(const index of [2,5]){
    const bars=inspect(svgs[index]).nodes.filter(n=>n.tagName==='rect'&&+n.properties.height===10);
    assert(Math.abs(+bars[0].properties.width/4.4-98)<.000001);
    assert(Math.abs(+bars[1].properties.width/4.4-87.4)<.000001);
  }
});
