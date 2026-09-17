import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { XMLValidator } from 'fast-xml-parser';
import { fromHtml } from 'hast-util-from-html';
import { toText } from 'hast-util-to-text';

const source = readFileSync(new URL('../src/components/CommerceTracesFigure.astro', import.meta.url), 'utf8');
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

test('six commerce figures are valid, accessible, static and responsive', () => {
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

test('reported annual amounts, revenue share and chart scales agree in FR/EN', () => {
  const annualDataRevenue = [21.6, 26.6, 32.7]; // FY2025 10-K, Note 2: millions of USD.
  const totalRevenue = 489481 / 1000; // Consolidated statement: thousands of USD.
  const share = annualDataRevenue[2] / totalRevenue * 100;
  assert.equal(share.toFixed(4), '6.6805');
  assert.equal((68.412 / annualDataRevenue[2]).toFixed(1), '2.1');
  for (let lang = 0; lang < 2; lang++) {
    const figures = svgs.slice(lang * 3, lang * 3 + 3).map(inspect);
    const number = (value) => value.toFixed(1).replace('.', lang ? '.' : ',');
    assert(figures[1].text.includes(number(share)));
    for (const [i, value] of annualDataRevenue.entries()) {
      assert(figures[1].text.includes(number(value)));
      const bar = figures[1].nodes.find((node) => node.tagName === 'rect' && Number(node.properties.y) === 157 + 95 * i);
      assert.equal(Number(bar.properties.x), 132);
      assert.equal(Number(bar.properties.width), Math.round(value / 40 * 428 * 100) / 100);
    }
    assert(figures[0].text.includes(lang ? 'Amounts are redacted' : 'Les montants sont occultés'));
    assert(figures[2].text.includes(lang ? 'does not establish a sale' : 'ne démontre pas une vente'));
  }
});

test('published FR/EN pages preserve sources, series scope and dedicated social image', () => {
  const routes = ['posts/commerce-traces-economie-collecte-donnees-personnelles', 'en/analysis/personal-data-economics-collection'];
  const sourceUrls = new Set([
    'https://www.sec.gov/Archives/edgar/data/1581760/000119312522172365/d328928dex1013.htm',
    'https://www.sec.gov/Archives/edgar/data/1581760/000158176024000006/exhibit1012amendmentno1tod.htm',
    'https://www.sec.gov/Archives/edgar/data/1581760/000158176026000016/lifx-20251231.htm',
    'https://www.legifrance.gouv.fr/cnil/id/CNILTEXT000053048614',
    'https://www.cnil.fr/fr/violation-de-donnees-sanction-dun-million-deuros-lencontre-de-la-societe-mobius-solutions-ltd',
  ]);
  for (const [lang, route] of routes.entries()) {
    const tree = fromHtml(readFileSync(new URL(`../dist/${route}/index.html`, import.meta.url), 'utf8'));
    const nodes = elements(tree);
    const figures = nodes.filter((node) => node.tagName === 'figure' && node.properties.className?.includes('commerce-figure'));
    assert.equal(figures.length, 3);
    const links = figures.flatMap((figure) => {
      const descendants = elements(figure);
      assert.equal(descendants.filter((node) => node.tagName === 'svg').length, 1);
      assert.equal(descendants.filter((node) => node.tagName === 'figcaption').length, 1);
      return descendants.filter((node) => node.tagName === 'a').map((node) => node.properties.href);
    });
    assert.deepEqual(new Set(links), sourceUrls);
    for (let n = 1; n <= 20; n++) assert.equal(nodes.filter((node) => node.properties.id === `source-${n}`).length, 1);
    assert(toText(tree).includes(lang ? 'Part one of a six-part investigation' : 'Premier volet d’une enquête en six parties'));
    for (const property of ['og:image', 'twitter:image']) {
      assert.equal(nodes.find((node) => node.tagName === 'meta' && (node.properties.property === property || node.properties.name === property))?.properties.content,
        'https://l0g.fr/illustrations/news/commerce-traces-01-v1.jpg');
    }
  }
});
