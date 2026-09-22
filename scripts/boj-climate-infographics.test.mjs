import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { XMLValidator } from 'fast-xml-parser';
import { fromHtml } from 'hast-util-from-html';
import { toText } from 'hast-util-to-text';

const articles = ['../src/content/posts/banque-japon-prets-verts-taux-reserves.mdx', '../src/content/posts-en/bank-japan-green-loans-rates-reserves.mdx'].map(path => readFileSync(new URL(path, import.meta.url), 'utf8'));
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

test('six BoJ figures remain static, accessible, compact and responsive', () => {
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

function numericCells(svg, y) {
  return inspect(svg).filter(node => node.tagName === 'text' && +node.properties.y === y && node.properties.textAnchor === 'end').map(node => +toText(node).replace(/[ ,]/g, ''));
}
test('interest illustration uses half-year exposure and distinguishes income from spread', () => {
  const principal = 100_000; // million yen
  const fixedCost = principal * 0.01;
  const reserveIncome = principal * (0.01 / 2 + 0.0125 / 2);
  for (const figures of svgs) {
    assert.deepEqual(numericCells(figures[0], 197), [reserveIncome, reserveIncome]);
    assert.deepEqual(numericCells(figures[0], 239), [fixedCost, reserveIncome]);
    assert.deepEqual(numericCells(figures[0], 292), [reserveIncome - fixedCost, 0]);
  }
  const fallingIncome = principal * (100 + 75) / 20_000;
  assert.equal(fallingIncome, 875);
  assert.equal(fallingIncome - fixedCost, -125);
  for (const article of articles) assert.match(article, /875/);
});

test('announced stocks reconcile without treating gross lending as net growth', () => {
  for (const [i, figures] of svgs.entries()) {
    const valueAt = y => {
      const node = inspect(figures[2]).find(node => node.tagName === 'text' && +node.properties.y === y && node.properties.textAnchor === 'end');
      const value = toText(node).replace(/ /g, '');
      return Number(i === 0 ? value.replace(',', '.') : value.replace(/,/g, ''));
    };
    const january = valueAt(151), july = valueAt(191), net = valueAt(244), gross = valueAt(301);
    assert.equal(january, 21114.6);
    assert.equal(july, 24936.1);
    assert.equal(Math.round((july - january) * 10), Math.round(net * 10));
    assert.equal(gross, 13981.2);
    assert(gross > net);
    assert.notEqual(january + gross, july);
  }
});

test('bilingual publication keeps every cited source and editorial constraints', () => {
  for (const article of articles) {
    for (let n = 1; n <= 16; n++) {
      assert.equal((article.match(new RegExp(`id="source-${n}"`, 'g')) ?? []).length, 1);
      assert(article.includes(`](#source-${n})`));
    }
    assert.doesNotMatch(article, /\bce\s+qu(?:e\b|i\b|['’])|\bpreuves?\b|\bprouve(?:nt)?\b|—/iu);
    assert(article.includes('ogImage: "/illustrations/news/boj-climate-loans-v1.jpg"'));
  }
});
