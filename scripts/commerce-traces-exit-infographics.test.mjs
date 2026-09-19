import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { XMLValidator } from 'fast-xml-parser';
import { fromHtml } from 'hast-util-from-html';
import { toText } from 'hast-util-to-text';

const source = readFileSync(new URL('../src/components/CommerceTracesExitFigure.astro', import.meta.url), 'utf8');
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

test('six personal-data exit figures are valid, accessible, static and responsive', () => {
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

test('exit diagrams distinguish the reported date, the teaching example and order deadlines', () => {
  const texts = svgs.map(svg => inspect(svg).text);
  for (const offset of [0, 3]) {
    assert(texts[offset].includes('34'));
    assert(texts[offset].includes('2020') && texts[offset].includes('2023'));
    assert.match(texts[offset + 1], offset ? /Fictional example/ : /Exemple fictif/);
    assert(texts[offset + 2].includes('20') && texts[offset + 2].includes('90'));
  }
  for (const svg of svgs) {
    for (const node of inspect(svg).nodes.filter(node => node.tagName === 'text')) {
      assert(Number(node.properties.fontWeight) <= 500);
      assert(Number(node.properties.fontSize) >= 21);
    }
  }
});

test('published exit investigation has bilingual navigation, complete source anchors and dedicated art', () => {
  const routes = ['posts/commerce-traces-donnees-apres-fin-contrat', 'en/analysis/personal-data-after-the-contract-ends'];
  const previous = ['/posts/commerce-traces-acheteurs-donnees-personnelles/', '/en/analysis/personal-data-buyers-contracts/'];
  for (const [lang, route] of routes.entries()) {
    const tree = fromHtml(readFileSync(new URL(`../dist/${route}/index.html`, import.meta.url), 'utf8'));
    const nodes = elements(tree), text = toText(tree);
    assert(text.includes(lang ? 'Part five of a six-part investigation' : 'Cinquième volet d’une enquête en six parties'));
    const figures = nodes.filter(node => node.tagName === 'figure' && node.properties.className?.includes('commerce-exit-figure'));
    assert.equal(figures.length, 3);
    for (const figure of figures) {
      const children = elements(figure);
      assert.equal(children.filter(node => node.tagName === 'svg').length, 1);
      assert.equal(children.filter(node => node.tagName === 'figcaption').length, 1);
    }
    for (let n = 1; n <= 20; n++) {
      assert.equal(nodes.filter(node => node.properties.id === `source-${n}`).length, 1);
      assert(nodes.some(node => node.tagName === 'a' && node.properties.href === `#source-${n}`));
    }
    assert(nodes.some(node => node.tagName === 'a' && node.properties.href === previous[lang]));
    const prior = fromHtml(readFileSync(new URL(`../dist${previous[lang]}index.html`, import.meta.url), 'utf8'));
    assert(elements(prior).some(node => node.tagName === 'a' && node.properties.href === `/${route}/`));
    for (const property of ['og:image', 'twitter:image']) {
      assert.equal(nodes.find(node => node.tagName === 'meta' && (node.properties.property === property || node.properties.name === property))?.properties.content,
        'https://l0g.fr/illustrations/news/commerce-traces-05-v1.jpg');
    }
    assert.doesNotMatch(text, /ten tests|dix tests|l0g ran a wholly local program|l0g a exécuté un petit programme/);
  }
});
