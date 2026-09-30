import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { XMLValidator } from 'fast-xml-parser';
import { fromHtml } from 'hast-util-from-html';
import { toText } from 'hast-util-to-text';
import sharp from 'sharp';
import { editorialSourceDomainTiers } from '../src/config/primary-sources.ts';

const articles = [
  '../src/content/posts/les-fournisseurs-invisibles-du-risque-bancaire-europeen.md',
  '../src/content/posts-en/invisible-suppliers-european-banking-risk.md',
].map(path => readFileSync(new URL(path, import.meta.url), 'utf8'));
const figures = articles.map(article => [...article.matchAll(/<svg\b[\s\S]*?<\/svg>/gu)].map(match => match[0]));
const elements = tree => [tree, ...(tree.children ?? []).flatMap(elements)].filter(node => node.type === 'element');

function inspect(svg) {
  assert.equal(XMLValidator.validate(svg), true);
  const nodes = elements(fromHtml(svg, { fragment: true }));
  for (const node of nodes) {
    assert(['svg', 'title', 'desc', 'g', 'rect', 'text', 'path', 'line'].includes(node.tagName));
    for (const [key, value] of Object.entries(node.properties)) {
      assert(!key.toLowerCase().startsWith('on'));
      assert(!['href', 'xLinkHref', 'src'].includes(key));
      assert(!String(value).includes('url('));
      if (['fill', 'stroke'].includes(key)) assert.match(String(value), /^(?:none|var\(--color-(?:surface|line-strong|paper|signal|muted|accent)\))$/u);
    }
  }
  const root = nodes[0].properties;
  assert.equal(root.style, 'width:100%;height:auto');
  assert.equal(root.role, 'img');
  assert.match(root.viewBox, /^0 0 480 (?:430|450)$/u);
  for (const id of root.ariaLabelledBy) {
    assert(nodes.some(node => node.properties.id === id && ['title', 'desc'].includes(node.tagName) && toText(node).trim()));
  }
  return nodes;
}

async function geometry(svg) {
  const nodes = inspect(svg);
  const height = Number(nodes[0].properties.viewBox.split(' ')[3]);
  for (const node of nodes.filter(node => node.tagName === 'text')) {
    const p = node.properties, size = Number(p.fontSize);
    assert(size >= 20, 'Labels must remain readable on mobile');
    const label = toText(node).replaceAll('&', '&amp;').replaceAll('<', '&lt;');
    const { info } = await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="4096" height="128"><text x="8" y="70" fill="white" font-family="Arial, Helvetica, sans-serif" font-size="${size}" font-weight="${p.fontWeight ?? 400}">${label}</text></svg>`)).trim().raw().toBuffer({ resolveWithObject: true });
    const width = info.width + 3;
    const left = Number(p.x) - (p.textAnchor === 'middle' ? width / 2 : p.textAnchor === 'end' ? width : 0);
    const top = Number(p.y) - size * 0.95, bottom = Number(p.y) + 4;
    assert(left >= 4 && left + width <= 476 && top >= 4 && bottom <= height - 4, `ViewBox padding: ${label}`);
    const group = nodes.find(candidate => candidate.tagName === 'g' && candidate.children.includes(node));
    if (group) {
      const rect = group.children.find(child => child.tagName === 'rect').properties;
      assert(left >= Number(rect.x) + 8 && left + width <= Number(rect.x) + Number(rect.width) - 8 && top >= Number(rect.y) + 4 && bottom <= Number(rect.y) + Number(rect.height) - 4, `Panel padding: ${label}`);
    }
  }
}


function cloudScale(svg) {
  const nodes = inspect(svg);
  const bars = nodes.filter(node => node.tagName === 'rect' && Number(node.properties.height) === 30);
  assert.equal(bars.length, 2);
  for (const [index, value] of [4, 17].entries()) {
    assert.equal(Number(bars[index].properties.x), 42);
    assert.equal(Number(bars[index].properties.width), 360 * value / 20);
  }
}
function sharedDependency(svg) {
  const nodes = inspect(svg);
  const panels = nodes.filter(node => node.tagName === 'g');
  assert.equal(panels.length, 4);
  const provider = panels[0].children.find(node => node.tagName === 'rect').properties;
  assert.equal(Number(provider.x) + Number(provider.width) / 2, 240);
  const banks = panels.slice(1).map(panel => panel.children.find(node => node.tagName === 'rect').properties);
  assert.deepEqual(banks.map(bank => Number(bank.x) + Number(bank.width) / 2), [90, 240, 390]);
  const path = nodes.find(node => node.tagName === 'path').properties.d;
  assert.equal(path, 'M240 184 V222 M90 256 V222 H390 V256 M240 222 V256 M84 249 L90 256 L96 249 M234 249 L240 256 L246 249 M384 249 L390 256 L396 249');
}
test('Bank supplier figures are compact, accessible, themed and safe in both languages', async () => {
  assert.deepEqual(figures.map(pair => pair.length), [2, 2]);
  for (const svg of figures.flat()) await geometry(svg);
});
test('Cloud figures use a common spending scale and the network has one shared dependency', () => {
  for (const pair of figures) { cloudScale(pair[0]); sharedDependency(pair[1]); }
  for (const article of articles) {
    assert(article.includes('4 %') || article.includes('4%'));
    assert(article.includes('17 %') || article.includes('17%'));
    assert(article.includes('38 %') || article.includes('38%'));
    assert(article.includes('19'));
    assert(article.includes('fictives') || article.includes('fictional'));
    assert(article.includes('non encore applicables') || article.includes('not yet applicable'));
    assert(article.indexOf('## Sources') < article.indexOf('## M'));
    assert(!article.includes('—'));
  }
  for (const host of ['bankingsupervision.europa.eu', 'eba.europa.eu', 'esma.europa.eu']) {
    assert(editorialSourceDomainTiers.primary.includes(host));
  }
});
test('Unsafe markup, palette changes, misleading bar widths and severed dependencies are rejected', () => {
  const pair = figures[0];
  assert.throws(() => inspect(pair[0].replace('role="img"', 'role="img" onload="alert(1)"')));
  assert.throws(() => inspect(pair[0].replace('fill="var(--color-signal)"', 'fill="blue"')));
  assert.throws(() => cloudScale(pair[0].replace('width="72.0"', 'width="85"')));
  assert.throws(() => sharedDependency(pair[1].replace('M240 184 V222', 'M240 184 V205')));
});
