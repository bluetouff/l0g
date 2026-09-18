import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { XMLValidator } from 'fast-xml-parser';
import { fromHtml } from 'hast-util-from-html';
import { toText } from 'hast-util-to-text';

const source = readFileSync(new URL('../src/components/CommerceTracesProfileFigure.astro', import.meta.url), 'utf8');
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

test('six profile-manufacturing figures are valid, accessible, static and responsive', () => {
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

test('illustrations distinguish historical terms, inference and fictional calculations', () => {
  for (const [offset, words] of [[0, ['2018', 'non public', 'Exécution du contrat non vérifiée', 'sans visite nécessairement observée', 'Exemple fictif']], [3, ['2018', 'not disclosed', 'Contract performance not verified', 'a visit need not have been observed', 'Fictional example']]]) {
    const texts = svgs.slice(offset, offset + 3).map(svg => inspect(svg).text);
    for (const word of words.slice(0, 3)) assert(texts[0].includes(word));
    assert(texts[1].includes(words[3]));
    assert(texts[2].includes(words[4]));
    const numbers = inspect(svgs[offset + 2]).nodes.filter(n => n.tagName === 'text').map(n => toText(n));
    for (const value of ['80', '90', '20', '810', '170', '830']) assert(numbers.includes(value));
    const [tp, fp, fn, tn] = ['80', '90', '20', '810'].map(Number);
    assert.equal(tp + fn, 100); assert.equal(fp + tn, 900);
    assert.equal((tp + tn) / (tp + fp + fn + tn) * 100, 89);
    const precision = tp / (tp + fp);
    assert.equal((precision * 100).toFixed(1), '47.1');
    assert.equal(6 / precision, 12.75);
  }
});

test('published profiles retain citations, reciprocal series links, glossary and social image', () => {
  const routes = ['posts/commerce-traces-fabrication-profils-donnees-personnelles', 'en/analysis/personal-data-traces-to-saleable-profiles'];
  const previous = ['/posts/commerce-traces-chaine-intermediaires-donnees-personnelles/', '/en/analysis/personal-data-chain-of-intermediaries/'];
  const figureSources = new Set([
    'https://www.ftc.gov/system/files/ftc_gov/pdf/Complaint-Avast.pdf',
    'https://www.ftc.gov/system/files/ftc_gov/pdf/202_3033_-_avast_final_consent_package.pdf',
    'https://support.avast.com/en-gb/article/jumpshot-settlement-faqs/',
    'https://www.ftc.gov/system/files/ftc_gov/pdf/InMarketMedia-Complaint.pdf',
    'https://docs.foursquare.com/campaign-products/docs/build-an-audience-segment',
    'https://iabtechlab.com/wp-content/uploads/2024/04/IAB-TL-Data-Transparency-Disclosure-Schema-1.2-Privacy-Update.pdf',
    'https://docs.liveramp.com/connect/en/enable-an-individual-data-marketplace-segment.html',
  ]);
  for (const [lang, route] of routes.entries()) {
    const tree = fromHtml(readFileSync(new URL(`../dist/${route}/index.html`, import.meta.url), 'utf8'));
    const nodes = elements(tree), text = toText(tree);
    assert(text.includes(lang ? 'Part three of a six-part investigation' : 'Troisième volet d’une enquête en six parties'));
    assert(text.includes(lang ? 'January 2020' : 'janvier 2020'));
    assert(text.includes(lang ? '€12.75' : '12,75 euros'));
    const figures = nodes.filter(n => n.tagName === 'figure' && n.properties.className?.includes('commerce-profile-figure'));
    assert.equal(figures.length, 3);
    const links = figures.flatMap(figure => {
      const children = elements(figure);
      assert.equal(children.filter(n => n.tagName === 'svg').length, 1);
      assert.equal(children.filter(n => n.tagName === 'figcaption').length, 1);
      return children.filter(n => n.tagName === 'a').map(n => n.properties.href);
    });
    assert.deepEqual(new Set(links), figureSources);
    for (let n = 1; n <= 21; n++) {
      assert.equal(nodes.filter(node => node.properties.id === `source-${n}`).length, 1);
      assert(nodes.some(node => node.tagName === 'a' && node.properties.href === `#source-${n}`));
    }
    assert(nodes.some(n => n.tagName === 'a' && n.properties.href === previous[lang]));
    const prior = fromHtml(readFileSync(new URL(`../dist${previous[lang]}index.html`, import.meta.url), 'utf8'));
    assert(elements(prior).some(n => n.tagName === 'a' && n.properties.href === `/${route}/`));
    for (const slug of ['profilage', 'segment-d-audience']) {
      const path = `${lang ? '/en/glossary/' : '/glossaire/'}${slug}/`;
      assert(nodes.some(n => n.tagName === 'a' && n.properties.href === path));
      const glossary = fromHtml(readFileSync(new URL(`../dist${path}index.html`, import.meta.url), 'utf8'));
      assert(elements(glossary).some(n => n.tagName === 'a' && n.properties.href === `/${route}/`));
    }
    for (const property of ['og:image', 'twitter:image']) {
      assert.equal(nodes.find(n => n.tagName === 'meta' && (n.properties.property === property || n.properties.name === property))?.properties.content,
        'https://l0g.fr/illustrations/news/commerce-traces-03-v1.jpg');
    }
  }
});
