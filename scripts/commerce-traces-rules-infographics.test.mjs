import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { XMLValidator } from 'fast-xml-parser';
import { fromHtml } from 'hast-util-from-html';
import { toText } from 'hast-util-to-text';

const source = readFileSync(new URL('../src/components/CommerceTracesRulesFigure.astro', import.meta.url), 'utf8');
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

test('six personal-data enforcement figures are valid, accessible, static and responsive', () => {
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

test('enforcement figures keep the cash-flow chronology and separate DROP populations', () => {
  const texts = svgs.map(svg => inspect(svg).text);
  for (const offset of [0, 3]) {
    assert(texts[offset].includes('2024') && texts[offset].includes('2025'));
    assert(texts[offset + 1].includes('2020') && texts[offset + 1].includes('2024') && texts[offset + 1].includes('2025'));
    assert.match(texts[offset + 1], offset ? /16\.5.*15\.3/s : /16,5.*15,3/s);
    assert.match(texts[offset + 2], offset ? /99\.9%.*at least one broker.*25%.*654/s : /99,9 %.*au moins un courtier.*25 %.*654/s);
  }
  for (const svg of svgs) {
    for (const node of inspect(svg).nodes.filter(node => node.tagName === 'text')) {
      assert(Number(node.properties.fontWeight) <= 500);
      assert(Number(node.properties.fontSize) >= 21);
    }
  }
});

test('published finale links the whole series, cites its sources and uses direct headings', () => {
  const routes = ['posts/commerce-traces-prix-regle-sanctions-donnees-personnelles', 'en/analysis/personal-data-trade-cost-of-enforcement'];
  const previous = ['/posts/commerce-traces-donnees-apres-fin-contrat/', '/en/analysis/personal-data-after-the-contract-ends/'];
  const series = [
    ['commerce-traces-economie-collecte-donnees-personnelles','commerce-traces-chaine-intermediaires-donnees-personnelles','commerce-traces-fabrication-profils-donnees-personnelles','commerce-traces-acheteurs-donnees-personnelles','commerce-traces-donnees-apres-fin-contrat'],
    ['personal-data-economics-collection','personal-data-chain-of-intermediaries','personal-data-traces-to-saleable-profiles','personal-data-buyers-contracts','personal-data-after-the-contract-ends'],
  ];
  for (const [lang, route] of routes.entries()) {
    const tree = fromHtml(readFileSync(new URL(`../dist/${route}/index.html`, import.meta.url), 'utf8'));
    const nodes = elements(tree), text = toText(tree);
    assert(text.includes(lang ? 'Sixth and final part of a six-part investigation' : 'Sixième et dernier volet d’une enquête en six parties'));
    const figures = nodes.filter(node => node.tagName === 'figure' && node.properties.className?.includes('commerce-rules-figure'));
    assert.equal(figures.length, 3);
    for (const figure of figures) {
      const children = elements(figure);
      assert.equal(children.filter(node => node.tagName === 'svg').length, 1);
      assert.equal(children.filter(node => node.tagName === 'figcaption').length, 1);
    }
    for (let n = 1; n <= 23; n++) {
      assert.equal(nodes.filter(node => node.properties.id === `source-${n}`).length, 1);
      assert(nodes.some(node => node.tagName === 'a' && node.properties.href === `#source-${n}`));
    }
    for (const slug of series[lang]) {
      const href = `${lang ? '/en/analysis/' : '/posts/'}${slug}/`;
      assert(nodes.some(node => node.tagName === 'a' && node.properties.href === href), href);
    }
    const prior = fromHtml(readFileSync(new URL(`../dist${previous[lang]}index.html`, import.meta.url), 'utf8'));
    assert(elements(prior).some(node => node.tagName === 'a' && node.properties.href === `/${route}/`));
    for (const property of ['og:image', 'twitter:image']) {
      assert.equal(nodes.find(node => node.tagName === 'meta' && (node.properties.property === property || node.properties.name === property))?.properties.content,
        'https://l0g.fr/illustrations/news/commerce-traces-06-v1.jpg');
    }
    for (const heading of nodes.filter(node => ['h1','h2','h3'].includes(node.tagName))) {
      assert.doesNotMatch(toText(heading), /\bce\s+qu(?:e\b|i\b|['’])|\bwhat (?:enforcement|the documents|rules)\b/iu);
    }
    const prose = nodes.find(node => node.properties.className?.includes('prose') && node.properties.dataReadingBody !== undefined);
    assert(prose, 'Published article body must be present');
    assert.doesNotMatch(toText(prose), /\bce\s+qu(?:e\b|i\b|['’])|\bpreuves?\b|\bprouve(?:nt)?\b|\bproves?\b|—/iu);
  }
});
