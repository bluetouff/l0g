import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { XMLValidator } from 'fast-xml-parser';
import { fromHtml } from 'hast-util-from-html';
import { toText } from 'hast-util-to-text';

const articles = ['../src/content/posts/credit-prive-emprunteurs-refinancement-revenus.mdx', '../src/content/posts-en/private-credit-borrower-exits-reinvestment-risk.mdx'].map(path => readFileSync(new URL(path, import.meta.url), 'utf8'));
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

test('six private credit figures are valid, accessible, static and responsive', () => {
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

test('spread bars preserve the same zero-based basis-point scale', () => {
  for (const offset of [0, 3]) {
    const { nodes } = inspect(svgs[offset]);
    const bars = nodes.filter(n => n.tagName === 'rect' && Number(n.properties.height) === 12);
    assert.deepEqual(bars.map(n => Number(n.properties.width) / 440 * 500), [450, 275]);
    const difference = (450 - 275) / 10_000;
    assert.equal(Math.round(1_650_000_000 * difference), 28_875_000);
    assert.equal(Math.round(1_600_000_000 * difference), 28_000_000);
    assert.equal(1_650_000_000 * (100 - 99.75) / 100, 4_125_000);
  }
});

test('cash delay and one-off premium are distinct from recurring interest', () => {
  const capital = 100;
  const recurring = capital * 0.04 * 2 / 12 + capital * 0.07 * 10 / 12;
  assert(Math.abs(recurring - 6.5) < 1e-10);
  for (const offset of [0, 3]) {
    const { nodes, text } = inspect(svgs[offset + 1]);
    const bars = nodes.filter(n => n.tagName === 'rect' && Number(n.properties.height) === 12);
    assert.deepEqual(bars.map(n => Number(n.properties.width) / 44), [8.5, 7, 6.5, 6.5, 1]);
    assert.equal(Number(bars[4].properties.x), Number(bars[3].properties.x) + Number(bars[3].properties.width));
    assert.equal(bars[4].properties.fill, '#f2c875');
    assert.match(text, offset ? /Fictional example/ : /Scénario fictif/);
    assert.match(text, offset ? /paid once/ : /une seule fois/);
    assert.match(text, offset ? /\$7m the next year/ : /7 M\$ l’année suivante/);
  }
});

test('repayment changes the loan denominator while retained cash preserves total assets', () => {
  for (const offset of [0, 3]) {
    const { nodes } = inspect(svgs[offset + 2]);
    const bars = nodes.filter(n => n.tagName === 'rect' && Number(n.properties.height) === 12);
    const amounts = bars.map(n => Number(n.properties.width) / 440 * 1000);
    assert.deepEqual(amounts, [100, 900, 100, 650, 250]);
    assert.equal(amounts[0] + amounts[1], amounts[2] + amounts[3] + amounts[4]);
    assert.equal(amounts[0] / (amounts[0] + amounts[1]), 0.1);
    assert.equal((100 * amounts[2] / (amounts[2] + amounts[3])).toFixed(1), '13.3');
    assert.equal(amounts[2] / (amounts[2] + amounts[3] + amounts[4]), 0.1);
  }
});

test('compact bilingual figures and references retain publication contracts', () => {
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
    for (let n = 1; n <= 10; n++) {
      assert.equal((article.match(new RegExp(`id="source-${n}"`, 'g')) ?? []).length, 1);
      assert(article.includes(`](#source-${n})`));
    }
    assert.doesNotMatch(article, /\bce\s+qu(?:e\b|i\b|['’])|\bpreuves?\b|\bprouve(?:nt)?\b|—/iu);
    assert(article.includes('ogImage: "/illustrations/news/credit-prive-refinancements-v1.jpg"'));
  }
});
