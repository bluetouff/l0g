import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { XMLValidator } from 'fast-xml-parser';
import { fromHtml } from 'hast-util-from-html';
import { toText } from 'hast-util-to-text';

const articles = ['../src/content/posts/assurance-prix-fidelite.mdx', '../src/content/posts-en/insurance-loyalty-pricing.mdx'].map(path => readFileSync(new URL(path, import.meta.url), 'utf8'));
const svgs = articles.map(article => [...article.matchAll(/<svg\b[\s\S]*?<\/svg>/g)].map(match => match[0]));
function elements(tree) {
  return [tree, ...(tree.children ?? []).flatMap(elements)].filter(node => node.type === 'element');
}
function inspect(svg) {
  assert.equal(XMLValidator.validate(svg), true);
  const nodes = elements(fromHtml(svg, { fragment: true }));
  const allowed = new Set(['svg', 'title', 'desc', 'rect', 'text', 'line']);
  for (const node of nodes) {
    assert(allowed.has(node.tagName));
    for (const [key, value] of Object.entries(node.properties)) {
      assert(!key.toLowerCase().startsWith('on'));
      assert(!['href', 'xLinkHref', 'src'].includes(key));
      assert(!String(value).includes('url('));
    }
  }
  assert.equal(nodes[0].properties.style, 'width:100%;height:auto');
  assert.equal(nodes[0].properties.role, 'img');
  for (const id of nodes[0].properties.ariaLabelledBy) {
    assert(nodes.some(node => node.properties.id === id && ['title', 'desc'].includes(node.tagName) && toText(node).trim()));
  }
  return nodes;
}

test('six insurance loyalty figures remain static, accessible, compact and responsive', () => {
  const ids = [];
  for (const figures of svgs) {
    assert.equal(figures.length, 3);
    for (const svg of figures) {
      const nodes = inspect(svg);
      ids.push(...nodes.map(node => node.properties.id).filter(Boolean));
      assert(+nodes[0].properties.viewBox.split(' ')[3] <= 420);
      for (const node of nodes.filter(node => node.tagName === 'text')) {
        assert(+node.properties.fontWeight <= 500);
        assert(+node.properties.fontSize >= 21);
      }
    }
  }
  assert.equal(new Set(ids).size, ids.length);
});

test('SVG validation rejects executable or externally loaded markup', () => {
  for (const payload of ['<script>alert(1)</script>', '<foreignObject/>', '<image href="https://example.com/x"/>']) {
    assert.throws(() => inspect(svgs[0][0].replace('</svg>', `${payload}</svg>`)));
  }
  assert.throws(() => inspect(svgs[0][0].replace('<svg ', '<svg onload="alert(1)" ')));
  assert.throws(() => inspect(svgs[0][0].replace('<rect ', '<rect href="https://example.com/x" ')));
  assert.throws(() => inspect(svgs[0][0].replace('fill="#0c0e10"', 'fill="url(https://example.com/x)"')));
});

function cells(svg, y) {
  return inspect(svg).filter(n => n.tagName === 'text' && +n.properties.y === y && n.properties.textAnchor === 'end').map(n => Number(toText(n).replace(/[€% ]/g, '')));
}
test('hypothetical contribution weights each retained-policy margin by renewal probability', () => {
  for (const figures of svgs) {
    const prices = cells(figures[1], 111);
    assert.deepEqual(prices, [600, 660]);
    for (const [probabilityY, contributionY] of [[163, 202], [263, 302]]) {
      const probabilities = cells(figures[1], probabilityY);
      const contributions = cells(figures[1], contributionY);
      assert(probabilities.every(p => p >= 0 && p <= 100));
      assert.deepEqual(contributions, prices.map((price, i) => (price - 500) * probabilities[i] / 100));
    }
    assert.deepEqual(cells(figures[1], 202), [90, 80]);
    assert.deepEqual(cells(figures[1], 302), [95, 144]);
  }
});
test('FCA interval geometry preserves a negative estimate and a zero reference', () => {
  for (const [i, figures] of svgs.entries()) {
    const nodes = inspect(figures[2]);
    const x = value => 42 + (value + 14) * 28;
    const interval = nodes.find(n => n.tagName === 'line' && +n.properties.y1 === 151 && +n.properties.y2 === 151);
    assert.equal(+interval.properties.x1, x(-12.59));
    assert.equal(+interval.properties.x2, x(-0.68));
    const estimate = nodes.find(n => n.tagName === 'line' && +n.properties.y1 === 132);
    assert.equal(+estimate.properties.x1, x(-6.63));
    assert(+interval.properties.x1 < +estimate.properties.x1 && +estimate.properties.x1 < +interval.properties.x2);
    assert(+interval.properties.x2 < x(0));
    const label = nodes.find(n => n.tagName === 'text' && +n.properties.y === 112);
    assert.equal(Number(toText(label).replace('−', '-').replace(',', '.')), -6.63);
    assert.match(toText(nodes.find(n => n.tagName === 'desc')), i ? /Q1 2019 to Q1 2024/ : /T1 2019 au T1 2024/);
  }
});
test('both articles retain citations and editorial constraints', () => {
  for (const article of articles) {
    for (let n = 1; n <= 18; n++) {
      assert.equal((article.match(new RegExp(`id="source-${n}"`, 'g')) ?? []).length, 1);
      assert(article.includes(`](#source-${n})`));
    }
    assert.doesNotMatch(article, /\bce\s+qu(?:e\b|i\b|['’])|\bpreuves?\b|\bprouve(?:nt)?\b|—/iu);
    assert(article.includes('ogImage: "/illustrations/news/insurance-loyalty-pricing-v1.jpg"'));
  }
});
