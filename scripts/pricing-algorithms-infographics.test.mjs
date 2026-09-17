import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { XMLValidator } from 'fast-xml-parser';
import { fromHtml } from 'hast-util-from-html';
import { toText } from 'hast-util-to-text';

const source = readFileSync(new URL('../src/components/PricingAlgorithmsFigure.astro', import.meta.url), 'utf8');
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
  const allowed = new Set(['svg', 'title', 'desc', 'g', 'rect', 'text', 'line']);
  for (const node of nodes) {
    assert(allowed.has(node.tagName), `Unexpected element: ${node.tagName}`);
    for (const key of Object.keys(node.properties)) {
      assert(!key.toLowerCase().startsWith('on'));
      assert(!['href', 'xLinkHref', 'src'].includes(key));
    }
  }
  assert.equal(nodes[0].properties.style, 'width:100%;height:auto');
  assert.equal(nodes[0].properties.role, 'img');
  for (const id of nodes[0].properties.ariaLabelledBy) {
    assert(nodes.some((node) => node.properties.id === id && ['title', 'desc'].includes(node.tagName) && toText(node).trim()));
  }
  return { nodes, text: toText(tree) };
}

test('six pricing figures are valid, accessible, static and responsive', () => {
  assert.equal(svgs.length, 6);
  const ids = svgs.flatMap((svg) => inspect(svg).nodes.map((node) => node.properties.id).filter(Boolean));
  assert.equal(new Set(ids).size, ids.length);
});

test('SVG contract rejects executable content and remote references', () => {
  for (const payload of ['<script>alert(1)</script>', '<foreignObject/>', '<image href="https://example.com/x"/>']) {
    assert.throws(() => inspect(svgs[0].replace('</svg>', `${payload}</svg>`)));
  }
  assert.throws(() => inspect(svgs[0].replace('<svg ', '<svg onload="alert(1)" ')));
  assert.throws(() => inspect(svgs[0].replace('<g ', '<g href="https://example.com/x" ')));
});

test('fictional calculations, denominators and graphical scales agree in both languages', () => {
  const contributionCents = (minutes) => (1000 + 500 * minutes / 60) * 8;
  assert.equal(contributionCents(0), 8000);
  assert.equal(contributionCents(30), 10000);
  assert.equal(contributionCents(60), 12000);
  for (let lang = 0; lang < 2; lang++) {
    const format = (value, decimals) => value.toFixed(decimals).replace('.', lang ? '.' : ',');
    const figures = svgs.slice(lang * 3, lang * 3 + 3).map(inspect);
    for (const { text } of figures) assert(text.includes(lang ? 'FICTIONAL SCENARIO' : 'SCÉNARIO FICTIF'));
    for (const t of [1, 60]) assert(figures[0].text.includes(format(contributionCents(t) / 100, 2)));
    for (const [y, t] of [[381, 60], [477, 1]]) {
      const bar = figures[0].nodes.find((node) => node.tagName === 'rect' && Number(node.properties.y) === y);
      assert.equal(Number(bar.properties.width), Math.round(contributionCents(t) / 100 * 3 * 10) / 10);
    }
    assert(figures[0].text.includes('30 min'));
    assert(figures[1].text.includes(format((182 - 180) / (180 - 170) * 100, 0)));
    assert(figures[1].text.includes(format((182 - 180) / 180 * 100, 2)));
    assert(figures[2].text.includes(format((170 + 184) / 2 / 100, 3)));
    assert(figures[2].text.includes(format((170 * 20 + 184 * 80) / 10000, 3)));
  }
});

test('built FR/EN articles expose three inline figures and the dedicated social image', () => {
  for (const route of ['posts/prix-automatiques-concurrence-algorithmes', 'en/analysis/pricing-algorithms-competition']) {
    const nodes = elements(fromHtml(readFileSync(new URL(`../dist/${route}/index.html`, import.meta.url), 'utf8')));
    const figures = nodes.filter((node) => node.tagName === 'figure' && node.properties.className?.includes('pricing-figure'));
    assert.equal(figures.length, 3);
    for (const figure of figures) {
      assert.equal(elements(figure).filter((node) => node.tagName === 'svg').length, 1);
      assert.equal(elements(figure).filter((node) => node.tagName === 'figcaption').length, 1);
    }
    for (const property of ['og:image', 'twitter:image']) {
      assert.equal(nodes.find((node) => node.tagName === 'meta' && (node.properties.property === property || node.properties.name === property))?.properties.content,
        'https://l0g.fr/illustrations/news/pricing-algorithms-competition-v1.jpg');
    }
  }
});
