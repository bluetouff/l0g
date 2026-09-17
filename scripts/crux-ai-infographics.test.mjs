import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { XMLValidator } from 'fast-xml-parser';
import { fromHtml } from 'hast-util-from-html';
import { toText } from 'hast-util-to-text';

const source = readFileSync(new URL('../src/components/CruxAiFigure.astro', import.meta.url), 'utf8');
const svgs = [...source.matchAll(/<svg\b[\s\S]*?<\/svg>/g)].map((match) => match[0]);
const elements = (tree) => {
  const result = [];
  const visit = (node) => {
    if (node.type === 'element') result.push(node);
    for (const child of node.children ?? []) visit(child);
  };
  visit(tree);
  return result;
};

function inspectSvg(svg) {
  assert.equal(XMLValidator.validate(svg), true);
  const tree = fromHtml(svg, { fragment: true });
  const nodes = elements(tree);
  const root = nodes[0];
  const allowed = new Set(['svg', 'title', 'desc', 'rect', 'text', 'tspan', 'line', 'polygon']);
  for (const node of nodes) {
    assert(allowed.has(node.tagName), `Unexpected SVG element: ${node.tagName}`);
    for (const property of Object.keys(node.properties)) {
      assert(!property.toLowerCase().startsWith('on'), 'Event handlers are forbidden');
      assert(!['href', 'xLinkHref', 'src'].includes(property), 'External SVG references are forbidden');
    }
  }
  assert.equal(root.properties.role, 'img');
  assert.equal(root.properties.style, 'width:100%;height:auto');
  assert.equal(root.properties.ariaLabelledBy.length, 2);
  for (const id of root.properties.ariaLabelledBy) {
    const label = nodes.find((node) => node.properties.id === id);
    assert(label && ['title', 'desc'].includes(label.tagName));
    assert(toText(label).trim());
  }
  return { root, nodes, text: toText(tree) };
}

test('all twelve Crux variants remain static, accessible, valid and responsive SVGs', () => {
  assert.equal(svgs.length, 12);
  const ids = svgs.flatMap((svg) => inspectSvg(svg).nodes.map((node) => node.properties.id).filter(Boolean));
  assert.equal(new Set(ids).size, ids.length);
});

test('Crux SVG checks reject executable markup, event handlers and external assets', () => {
  const svg = svgs[0];
  for (const payload of ['<script>alert(1)</script>', '<foreignObject><div>external</div></foreignObject>', '<image href="https://example.com/image.svg"/>']) {
    assert.throws(() => inspectSvg(svg.replace('</svg>', `${payload}</svg>`)));
  }
  assert.throws(() => inspectSvg(svg.replace('<svg ', '<svg onload="alert(1)" ')));
  assert.throws(() => inspectSvg(svg.replace('<rect ', '<rect href="https://example.com/asset" ')));
});

test('every cash-flow graphic preserves the fictional scope and independently calculated ratios', () => {
  const cashFigures = svgs.map(inspectSvg).filter(({ root }) => root.properties.ariaLabelledBy[0].includes('tresorerie'));
  assert.equal(cashFigures.length, 4);
  for (const { root, text } of cashFigures) {
    const en = root.properties.ariaLabelledBy[0].includes('-en-');
    assert(text.includes(en ? 'FICTIONAL EXAMPLE' : 'EXEMPLE FICTIF'));
    assert(text.includes(en ? 'NOT CRUX DATA' : 'AUCUNE DONNÉE CRUX'));
    for (const revenue of [100, 80]) {
      const cash = revenue - 60;
      const ratio = (cash / 30).toFixed(2).replace('.', en ? '.' : ',');
      const balance = cash - 30;
      assert(text.includes(`DSCR ${ratio}`));
      assert(text.includes(`${balance > 0 ? '+' : '−'}${Math.abs(balance)}`));
    }
    assert(text.includes(en ? 'Arbitrary units' : 'Unités arbitraires'));
  }
});

test('both built articles contain three inline figures and the same dedicated social image', () => {
  for (const route of ['posts/crux-ai-google-blackstone-banques-puces-collateral', 'en/analysis/crux-ai-google-blackstone-bank-risk-chip-collateral']) {
    const html = readFileSync(new URL(`../dist/${route}/index.html`, import.meta.url), 'utf8');
    const nodes = elements(fromHtml(html));
    const figures = nodes.filter((node) => node.tagName === 'figure' && node.properties.className?.includes('crux-figure'));
    assert.equal(figures.length, 3);
    for (const figure of figures) {
      const children = elements(figure);
      assert.equal(children.filter((node) => node.tagName === 'svg').length, 2);
      assert.equal(children.filter((node) => node.tagName === 'figcaption').length, 1);
      assert.equal(children.filter((node) => node.tagName === 'img').length, 0);
    }
    const image = 'https://l0g.fr/illustrations/news/crux-ai-credit-infrastructure-v1.jpg';
    for (const property of ['og:image', 'twitter:image']) {
      assert.equal(nodes.find((node) => node.tagName === 'meta' && (node.properties.property === property || node.properties.name === property))?.properties.content, image);
    }
  }
});
