import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { XMLValidator } from 'fast-xml-parser';
import { fromHtml } from 'hast-util-from-html';
import { toText } from 'hast-util-to-text';

const articles = ['../src/content/posts/ubs-capital-filiales-etrangeres-double-levier.mdx', '../src/content/posts-en/ubs-foreign-subsidiaries-capital-double-leverage.mdx'].map(path => readFileSync(new URL(path, import.meta.url), 'utf8'));
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

test('six UBS capital figures are valid, accessible, static and responsive', () => {
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

test('funding bars preserve parent debt and subsidiary equity separately', () => {
  for (const offset of [0, 3]) {
    const bars = inspect(svgs[offset]).nodes.filter(n => n.tagName === 'rect' && Number(n.properties.height) === 12);
    const amounts = bars.map(n => Number(n.properties.width) * 100 / 440);
    assert.deepEqual(amounts, [45, 55, 100]);
    assert.equal(amounts[0] + amounts[1], amounts[2]);
  }
});
test('full and split deductions reconcile without an AT1 conversion', () => {
  for (const offset of [0, 3]) {
    const text = inspect(svgs[offset + 1]).text;
    for (const equation of ['160 − 100 = 60', '130 − 70 = 60']) assert(text.includes(equation));
    const bars = inspect(svgs[offset + 2]).nodes.filter(n => n.tagName === 'rect' && Number(n.properties.height) === 12);
    const amounts = bars.map(n => Number(n.properties.width) / 3.6);
    assert.deepEqual(amounts, [110, 10, 95, 25]);
    assert.equal(amounts[0] + amounts[1], amounts[2] + amounts[3]);
    assert.equal(amounts[0] - amounts[2], 30 * (1 - 0.5));
    assert.equal(amounts[3] - amounts[1], 30 * 0.5);
    assert.equal(Number(bars[1].properties.x), Number(bars[0].properties.x) + Number(bars[0].properties.width));
    assert.equal(Number(bars[3].properties.x), Number(bars[2].properties.x) + Number(bars[2].properties.width));
  }
});
test('bilingual examples retain the distinction between a loss and capital headroom', () => {
  assert.match(articles[0], /marge au-dessus des exigences augmente de 20/);
  assert.match(articles[0], /même marge diminue de 20/);
  assert.match(articles[1], /capital headroom improves by 20/);
  assert.match(articles[1], /headroom declines by 20/);
  for (const article of articles) {
    assert.equal((article.match(/<figure /g) ?? []).length, 3);
    for (let n = 1; n <= 17; n++) {
      assert.equal((article.match(new RegExp(`id="source-${n}"`, 'g')) ?? []).length, 1);
      assert(article.includes(`](#source-${n})`));
    }
    assert.doesNotMatch(article, /\bce\s+qu(?:e\b|i\b|['’])|\bpreuves?\b|\bprouve(?:nt)?\b|—/iu);
    assert(article.includes('ogImage: "/illustrations/news/ubs-capital-filiales-v1.jpg"'));
  }
  for (const svg of svgs) {
    const { nodes } = inspect(svg);
    assert(Number(nodes[0].properties.viewBox.split(' ')[3]) <= 430);
    for (const node of nodes.filter(n => n.tagName === 'text')) {
      assert(Number(node.properties.fontWeight) <= 500);
      assert(Number(node.properties.fontSize) >= 21);
    }
  }
});
