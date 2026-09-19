import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { XMLValidator } from 'fast-xml-parser';
import { fromHtml } from 'hast-util-from-html';
import { toText } from 'hast-util-to-text';

const source = readFileSync(new URL('../src/components/CommerceTracesBuyersFigure.astro', import.meta.url), 'utf8');
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

test('six personal-data buyer figures are valid, accessible, static and responsive', () => {
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

test('buyer diagrams retain the limits of the contractual evidence', () => {
  const texts = svgs.map(svg => inspect(svg).text);
  for (const [offset, words] of [[0, ['GPS inutilisé', 'Anonymisation exigée', 'Ces montants ne s’additionnent pas']], [3, ['GPS not used', 'Anonymisation required', 'These amounts must not be added']]]) {
    for (let i = 0; i < 3; i++) assert(texts[offset + i].includes(words[i]));
    assert(texts[offset + 2].includes('2020–2024'));
    assert(texts[offset + 2].includes('2021–2022'));
  }
  for (const svg of svgs) {
    const { nodes } = inspect(svg);
    for (const n of nodes.filter(n => n.tagName === 'text')) {
      assert(Number(n.properties.fontWeight) <= 500);
      assert(Number(n.properties.fontSize) >= 21);
    }
  }
});

test('published buyer investigation retains exact sources, reciprocal links and social art', () => {
  const routes = ['posts/commerce-traces-acheteurs-donnees-personnelles', 'en/analysis/personal-data-buyers-contracts'];
  const previous = ['/posts/commerce-traces-fabrication-profils-donnees-personnelles/', '/en/analysis/personal-data-traces-to-saleable-profiles/'];
  const expectedSources = new Set([
    'https://oag.ca.gov/system/files/attachments/press-docs/May%208%2C%202026%20GM%20Complaint%20Court%20Stamped.pdf',
    'https://news.gm.com/home.detail.html/Pages/news/us/en/2024/apr/0424-driver.html',
    'https://www.ftc.gov/system/files/ftc_gov/pdf/Complaint-Avast.pdf',
    'https://assets.aclu.org/live/uploads/2022/07/2023-10-03-CBPs-Fourth-Production-Reprocessed.pdf',
    'https://www.usaspending.gov/award/CONT_AWD_70B04C20F00000914_7014_HSHQDC13D00022_7001',
    'https://s3.documentcloud.org/documents/23696555/cdc-safegraph-contract.pdf',
  ]);
  for (const [lang, route] of routes.entries()) {
    const tree = fromHtml(readFileSync(new URL(`../dist/${route}/index.html`, import.meta.url), 'utf8'));
    const nodes = elements(tree), text = toText(tree);
    assert(text.includes(lang ? 'Part four of a six-part investigation' : 'Quatrième volet d’une enquête en six parties'));
    const figures = nodes.filter(n => n.tagName === 'figure' && n.properties.className?.includes('commerce-buyers-figure'));
    assert.equal(figures.length, 3);
    const links = figures.flatMap(figure => {
      const children = elements(figure);
      assert.equal(children.filter(n => n.tagName === 'svg').length, 1);
      assert.equal(children.filter(n => n.tagName === 'figcaption').length, 1);
      return children.filter(n => n.tagName === 'a').map(n => n.properties.href);
    });
    assert.deepEqual(new Set(links), expectedSources);
    for (let n = 1; n <= 18; n++) {
      assert.equal(nodes.filter(node => node.properties.id === `source-${n}`).length, 1);
      assert(nodes.some(node => node.tagName === 'a' && node.properties.href === `#source-${n}`));
    }
    assert(nodes.some(n => n.tagName === 'a' && n.properties.href === previous[lang]));
    const prior = fromHtml(readFileSync(new URL(`../dist${previous[lang]}index.html`, import.meta.url), 'utf8'));
    assert(elements(prior).some(n => n.tagName === 'a' && n.properties.href === `/${route}/`));
    for (const property of ['og:image', 'twitter:image']) {
      assert.equal(nodes.find(n => n.tagName === 'meta' && (n.properties.property === property || n.properties.name === property))?.properties.content,
        'https://l0g.fr/illustrations/news/commerce-traces-04-v1.jpg');
    }
  }
});
