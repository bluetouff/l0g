import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { XMLValidator } from 'fast-xml-parser';
import { fromHtml } from 'hast-util-from-html';
import { toText } from 'hast-util-to-text';

const source = readFileSync(new URL('../src/components/CommerceTracesChainFigure.astro', import.meta.url), 'utf8');
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

test('six intermediary-chain figures are valid, accessible, static and responsive', () => {
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

test('documentary diagrams retain distinct evidence levels in both languages', () => {
  for (const [offset, expected] of [[0, ['Aucune campagne individuelle', 'ne retrace pas toutes les données.', 'TRANSFERT ALLÉGUÉ', 'Aucune commande examinée']], [3, ['No individual campaign', 'a complete record of data flows.', 'ALLEGED TRANSFER', 'No client order examined']]]) {
    const texts = svgs.slice(offset, offset + 3).map(svg => inspect(svg).text);
    assert(texts[0].includes(expected[0]));
    assert(texts[1].includes(expected[1]));
    assert(texts[2].includes(expected[2]));
    assert(texts[2].includes(expected[3]));
  }
});

test('published pages preserve accounting units, citations, series links and social image', () => {
  // FY2026 10-K, revenue disaggregation: USD thousands, full year ended March 31.
  const subscription = 614388;
  const marketplaceAndOther = 198552;
  const total = 812940;
  assert.equal(subscription + marketplaceAndOther, total);
  const routes = ['posts/commerce-traces-chaine-intermediaires-donnees-personnelles', 'en/analysis/personal-data-chain-of-intermediaries'];
  const previous = ['/posts/commerce-traces-economie-collecte-donnees-personnelles/', '/en/analysis/personal-data-economics-collection/'];
  const sourceUrls = new Set([
    'https://www.experian.co.uk/content/dam/marketing/uki/uk/en/assets/marketing-services/documents/liveramp-actionable-audience-special-terms-dec_24.pdf',
    'https://partner-directory.liveramp.com/partners/experian',
    'https://iabtechlab.com/sellers-json/',
    'https://github.com/InteractiveAdvertisingBureau/openrtb/blob/master/supplychainobject.md',
    'https://iabtechlab.com/wp-content/uploads/2019/07/FAQ-for-sellers.json_supplychain-object.pdf',
    'https://www.legifrance.gouv.fr/cnil/id/CNILTEXT000053048614',
    'https://www.ftc.gov/system/files/ftc_gov/pdf/212_3035_-_gravy_analytics_final_consent_package_without_signatures.pdf',
  ]);
  for (const [lang, route] of routes.entries()) {
    const tree = fromHtml(readFileSync(new URL(`../dist/${route}/index.html`, import.meta.url), 'utf8'));
    const nodes = elements(tree);
    const text = toText(tree);
    for (const amount of [subscription, marketplaceAndOther, total]) {
      assert(text.includes((amount / 1000).toFixed(1).replace('.', lang ? '.' : ',')));
    }
    assert(text.includes(lang ? 'Separately rounded components' : 'composantes arrondies séparément'));
    assert(text.includes(lang ? 'Part two of a six-part investigation' : 'Deuxième volet d’une enquête en six parties'));
    assert(text.includes(lang ? 'net of the amount owed to data providers' : 'net de la part revenant aux fournisseurs'));
    assert(text.includes(lang ? 'fictional example' : 'exemple fictif'));
    const figures = nodes.filter(n => n.tagName === 'figure' && n.properties.className?.includes('commerce-chain-figure'));
    assert.equal(figures.length, 3);
    const links = figures.flatMap(figure => {
      const children = elements(figure);
      assert.equal(children.filter(n => n.tagName === 'svg').length, 1);
      assert.equal(children.filter(n => n.tagName === 'figcaption').length, 1);
      return children.filter(n => n.tagName === 'a').map(n => n.properties.href);
    });
    assert.deepEqual(new Set(links), sourceUrls);
    for (let n = 1; n <= 25; n++) {
      assert.equal(nodes.filter(node => node.properties.id === `source-${n}`).length, 1);
      assert(nodes.some(node => node.tagName === 'a' && node.properties.href === `#source-${n}`));
    }
    const annualSource = nodes.find(n => n.properties.id === 'source-10');
    assert(elements(annualSource).some(n => n.tagName === 'a' && n.properties.href ===
      'https://www.sec.gov/Archives/edgar/data/733269/000073326926000025/ramp-20260331.htm'));
    assert(nodes.some(n => n.tagName === 'a' && n.properties.href === previous[lang]));
    const previousTree = fromHtml(readFileSync(new URL(`../dist${previous[lang]}index.html`, import.meta.url), 'utf8'));
    assert(elements(previousTree).some(n => n.tagName === 'a' && n.properties.href === `/${route}/`));
    for (const property of ['og:image', 'twitter:image']) {
      assert.equal(nodes.find(n => n.tagName === 'meta' && (n.properties.property === property || n.properties.name === property))?.properties.content,
        'https://l0g.fr/illustrations/news/commerce-traces-02-v1.jpg');
    }
  }
});
