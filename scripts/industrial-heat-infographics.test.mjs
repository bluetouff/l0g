import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { XMLValidator } from 'fast-xml-parser';
import { fromHtml } from 'hast-util-from-html';
import { toText } from 'hast-util-to-text';
import sharp from 'sharp';
import { editorialSourceDomainTiers } from '../src/config/primary-sources.ts';

const articles = [
  '../src/content/posts/chaleur-industrielle-if26-prime-carbone-sixieme-annee.md',
  '../src/content/posts-en/industrial-heat-if26-carbon-premium-year-six.md',
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

function fundingScale(svg) {
  const bars = inspect(svg).filter(node => node.tagName === 'rect' && Number(node.properties.height) === 16);
  assert.equal(bars.length, 4);
  for (const [index, value] of [1000, 1234.882277, 476.940985, 396.512332].entries()) {
    assert.equal(Number(bars[index].properties.x), 28);
    assert(Math.abs(Number(bars[index].properties.width) - 424 * value / 1300) < 1e-7);
  }
}

test('IF26 figures are safe, compact, accessible and have honest funding scales', async () => {
  for (const set of figures) {
    assert.equal(set.length, 3);
    for (const svg of set) await geometry(svg);
    fundingScale(set[0]);
    assert.match(toText(fromHtml(set[1], { fragment: true })), /200 × 0[,.]75/u);
    assert.match(set[2], /M64 169\.99307755 H244 V324\.82187755 H424/u);
  }
  assert.throws(() => fundingScale(figures[0][0].replace('326.15384615', '350')));
  assert.throws(() => inspect(figures[0][0].replace('<rect', '<script')));
  assert.throws(() => inspect(figures[0][0].replace('var(--color-accent)', '#ff0000')));
});

test('Annual cash flows preserve units, support expiry and the year-zero investment', () => {
  const csv = readFileSync(new URL('../public/data/industrial-heat-if26-example.csv', import.meta.url), 'utf8');
  const [header, ...rows] = csv.trim().split(/\r?\n/u).map(line => line.split(','));
  assert.deepEqual(header, ['year_from_commissioning', 'support_eur', 'incremental_operating_cash_eur', 'initial_conversion_outlay_eur', 'cumulative_cash_eur', 'scenario']);
  assert.equal(rows.length, 11);
  const heat = 10 * 6000, gas = (40 + 70 * 0.202) / 0.90, electric = 85 / 0.98;
  const premium = 160 * 0.224, annualGrant = heat * premium;
  assert.equal(annualGrant, 2150400);
  assert.equal(6000 <= 8760 * 0.70, true);
  assert(Math.abs((gas + premium) * 0.98 - 94.07564444444444) < 1e-10);
  assert(Math.abs(gas * 0.98 - 58.95244444444444) < 1e-10);
  let cumulative = -3000000;
  for (const [year, row] of rows.entries()) {
    assert.equal(Number(row[0]), year);
    assert.equal(row[5], 'hypothetical_constant_prices_forced_electric_operation');
    const supported = year >= 1 && year <= 5;
    assert.equal(Number(row[1]), supported ? annualGrant : 0);
    const cash = year === 0 ? 0 : (gas - electric + (supported ? premium : 0)) * heat;
    assert(Math.abs(Number(row[2]) - cash) < 1e-6);
    assert.equal(Number(row[3]), year === 0 ? 3000000 : 0);
    cumulative += cash;
    assert(Math.abs(Number(row[4]) - cumulative) < 1e-6);
  }
  assert(Number(rows[5][2]) > 0 && Number(rows[6][2]) < 0);
  for (const article of articles) {
    assert(article.includes('/data/industrial-heat-if26-example.csv'));
    assert(article.includes('0.224') || article.includes('0,224'));
    assert(!article.includes('calculation script') && !article.includes('script de calcul'));
    assert(!article.includes('—'));
    for (const url of [...article.matchAll(/href="(https:[^"]+)"/gu)].map(match => match[1])) {
      assert(['climate.ec.europa.eu', 'www.iea.org', 'www.isi.fraunhofer.de'].includes(new URL(url).hostname));
    }
  }
});
