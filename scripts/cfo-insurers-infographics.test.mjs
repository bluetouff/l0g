import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { XMLValidator } from 'fast-xml-parser';
import { fromHtml } from 'hast-util-from-html';
import { toText } from 'hast-util-to-text';

const articles = ['../src/content/posts/private-equity-cfo-obligations-assureurs.mdx', '../src/content/posts-en/private-equity-cfo-bonds-insurers.mdx'].map(path => readFileSync(new URL(path, import.meta.url), 'utf8'));
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

test('four CFO figures are valid, accessible, static and responsive', () => {
  assert.equal(svgs.length, 4);
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

test('liquidation bars honour seniority and conserve initial capital', () => {
  for (const index of [1, 3]) {
    const rows = [193, 273, 353];
    const expected = [[60,15,25,0],[60,10,0,30],[35,0,0,65]];
    const fills = ['#72e5df','#f2c875','#c2a5e8','#536273'];
    const rects = inspect(svgs[index]).nodes.filter(n => n.tagName === 'rect' && +n.properties.height === 12);
    rows.forEach((y,i) => {
      const bars = rects.filter(n => +n.properties.y === y);
      const values = fills.map(fill => +(bars.filter(n => n.properties.fill === fill).reduce((sum,n) => sum + +n.properties.width,0)/4.4).toFixed(6));
      assert.deepEqual(values,expected[i]);
      assert.equal(values.reduce((a,b) => a+b),100);
      const proceeds = 100-values[3];
      assert.equal(values[0],Math.min(proceeds,60));
      assert.equal(values[1],Math.min(Math.max(proceeds-60,0),15));
      assert.equal(values[2],Math.max(proceeds-75,0));
      for(let j=1;j<bars.length;j++)assert(Math.abs(+bars[j].properties.x-(+bars[j-1].properties.x + +bars[j-1].properties.width)) < 0.0001);
    });
  }
});
test('cash shortfall is derived from the published table and deferral changes the assumption', () => {
  for (const [i,article] of articles.entries()) {
    const rows = article.split('\n').filter(l => l.startsWith('|'));
    const values = rows.slice(2).map(l => Number(l.split('|')[2].replace(/[ *]/g,'').replace('−','-')));
    assert.deepEqual(values,[2,1,-6,3]);
    assert.equal(-(values[0]+values[1]+values[2]),values[3]);
    assert.match(article,i === 0 ? /autre hypothèse contractuelle/ : /alternative contractual assumption/);
    assert(article.includes(i === 0 ? 'paiements exigibles passent à 4' : 'Payments due fall to 4'));
    assert.equal(6-2-(2+1),1);
  }
});
test('compact bilingual figures preserve units, citations and safe typography', () => {
  for (const article of articles) {
    assert.equal((article.match(/<figure /g) ?? []).length,2);
    for(let n=1;n<=16;n++){
      assert.equal((article.match(new RegExp(`id="source-${n}"`,'g')) ?? []).length,1);
      assert(article.includes(`](#source-${n})`));
    }
    assert.doesNotMatch(article,/\bce\s+qu(?:e\b|i\b|['’])|\bpreuves?\b|\bprouve(?:nt)?\b|—/iu);
    assert(article.includes('ogImage: "/illustrations/news/cfo-assureurs-v1.jpg"'));
  }
  for(const svg of svgs){
    const {nodes}=inspect(svg);
    assert(+nodes[0].properties.viewBox.split(' ')[3]<=430);
    for(const node of nodes.filter(n=>n.tagName==='text')){
      assert(+node.properties.fontWeight<=500);
      assert(+node.properties.fontSize>=21);
    }
  }
});
