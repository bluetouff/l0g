import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { XMLValidator } from 'fast-xml-parser';
import { fromHtml } from 'hast-util-from-html';
import { toText } from 'hast-util-to-text';

const articles = ['../src/content/posts/londres-sortie-qe-tresor-billets.mdx', '../src/content/posts-en/bank-of-england-qe-exit-treasury-banknotes.mdx'].map(path => readFileSync(new URL(path, import.meta.url), 'utf8'));
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

test('six Bank of England figures are valid, accessible, static and responsive', () => {
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

test('allocations use purchase cost and proportionate bars in both languages', () => {
  for (const offset of [0, 3]) {
    const { nodes, text } = inspect(svgs[offset]);
    const bars = nodes.filter(n => n.tagName === 'rect' && Number(n.properties.y) === 85);
    assert.equal(bars.length, 3);
    const amounts = offset ? ['221.7', '146.5', '120'] : ['221,7', '146,5', '120'];
    for (let i = 0; i < 3; i++) {
      assert(text.includes(amounts[i]));
      assert(Math.abs(Number(bars[i].properties.width) / 440 * 488.2 - Number(amounts[i].replace(',', '.'))) < 0.001);
    }
    assert.match(text, offset ? /Purchase cost/ : /Coût initial/);
    assert.match(inspect(svgs[offset + 1]).text, offset ? /final decision pending/ : /décision finale requise/);
    const cash = inspect(svgs[offset + 2]);
    assert.match(cash.text, offset ? /Fictional example/ : /Scénario fictif/);
    const cashBars = cash.nodes.filter(n => n.tagName === 'rect' && Number(n.properties.height) === 14);
    assert.deepEqual(cashBars.map(n => Number(n.properties.width) / 440 * 100), [70, 30, 70, 30]);
  }
});

test('figures stay compact with fine typography and article sources remain navigable', () => {
  for (const svg of svgs) {
    const { nodes } = inspect(svg);
    assert(Number(nodes[0].properties.viewBox.split(' ')[3]) <= 430);
    for (const node of nodes.filter(n => n.tagName === 'text')) {
      assert(Number(node.properties.fontWeight) <= 500);
      assert(Number(node.properties.fontSize) >= 21);
    }
  }
  for (const article of articles) {
    assert.equal((article.match(/<figure /g) ?? []).length, 3);
    assert.equal((article.match(/<figcaption>/g) ?? []).length, 3);
    for (let n = 1; n <= 17; n++) {
      assert.equal((article.match(new RegExp(`id="source-${n}"`, 'g')) ?? []).length, 1);
      assert(article.includes(`](#source-${n})`));
    }
    assert.doesNotMatch(article, /\bce\s+qu(?:e\b|i\b|['’])|\bpreuves?\b|\bprouve(?:nt)?\b|—/iu);
    assert(article.includes('ogImage: "/illustrations/news/boe-sortie-qe-v1.jpg"'));
  }
});
