import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { XMLValidator } from 'fast-xml-parser';
import { fromHtml } from 'hast-util-from-html';
import { toText } from 'hast-util-to-text';
import sharp from 'sharp';

const articles = ['../src/content/posts/defi-intermediaires-acces-mica.md', '../src/content/posts-en/defi-gateways-mica-access.md'].map(path => readFileSync(new URL(path, import.meta.url), 'utf8'));
const elements = node => [node, ...(node.children ?? []).flatMap(elements)].filter(item => item.type === 'element');
const figures = articles.map(article => [...article.matchAll(/<svg\b[\s\S]*?<\/svg>/gu)].map(match => match[0]));

function inspect(svg) {
  assert.equal(XMLValidator.validate(svg), true);
  const nodes = elements(fromHtml(svg, { fragment: true }));
  for (const node of nodes) {
    assert(['svg', 'title', 'desc', 'rect', 'text', 'path'].includes(node.tagName));
    for (const [key, value] of Object.entries(node.properties)) {
      assert(!key.toLowerCase().startsWith('on'));
      assert(!['href', 'xLinkHref', 'src'].includes(key));
      assert(!String(value).includes('url('));
      if (['fill', 'stroke'].includes(key)) assert.match(String(value), /^(?:none|var\(--color-(?:surface|line-strong|paper|signal|muted|accent|amber)\))$/u);
    }
  }
  const p = nodes[0].properties;
  assert.equal(p.style, 'width:100%;height:auto');
  assert(['0 0 480 406', '0 0 480 480', '0 0 480 420'].includes(p.viewBox));
  assert.equal(p.role, 'img');
  for (const id of p.ariaLabelledBy) assert(nodes.some(node => node.properties.id === id && ['title', 'desc'].includes(node.tagName) && toText(node).trim()));
  return nodes;
}

async function geometry(svg) {
  const nodes = inspect(svg), height = Number(nodes[0].properties.viewBox.split(' ').at(-1)), boxes = [];
  for (const node of nodes.filter(item => item.tagName === 'text')) {
    const p = node.properties, size = Number(p.fontSize), label = toText(node);
    assert(size >= 20);
    const escaped = label.replaceAll('&', '&amp;').replaceAll('<', '&lt;');
    const { info } = await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="4096" height="128"><text x="8" y="70" fill="white" font-family="Arial, Helvetica, sans-serif" font-size="${size}" font-weight="${p.fontWeight ?? 400}">${escaped}</text></svg>`)).trim().raw().toBuffer({ resolveWithObject: true });
    const width = info.width + 3, left = Number(p.x) - (p.textAnchor === 'middle' ? width / 2 : p.textAnchor === 'end' ? width : 0);
    assert(left >= 4 && left + width <= 476 && Number(p.y) - size * .95 >= 4 && Number(p.y) + 5 <= height - 4, `Safety padding: ${label}`);
    boxes.push({ left: left - 1, right: left + width + 1, top: Number(p.y) - size * .95 - 1, bottom: Number(p.y) + 5, label });
  }
  for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) {
    const a = boxes[i], b = boxes[j];
    assert(!(a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top), `Labels overlap: ${a.label} / ${b.label}`);
  }
  for (const node of nodes.filter(item => item.tagName === 'rect')) {
    const p = node.properties, x = Number(p.x ?? 0), y = Number(p.y ?? 0), w = Number(p.width), h = Number(p.height);
    assert(x >= 0 && y >= 0 && x + w <= 480 && y + h <= height);
    if (h !== 18) continue;
    for (const box of boxes) assert(!(box.left < x + w && box.right > x && box.top < y + h && box.bottom > y), `Bar crosses label: ${box.label}`);
  }
}

function scales(set) {
  const bars = set.map(svg => inspect(svg).filter(node => node.tagName === 'rect' && Number(node.properties.height) === 18).map(node => node.properties));
  for (const [figureIndex, values, maximum] of [[0, [34560, 9600, 3840], 48000], [1, [1.2, 1, .96, 1.04], 1.5], [2, [48, 59, 38, 46], 100]]) {
    assert.equal(bars[figureIndex].length, values.length);
    for (const [i, value] of values.entries()) {
      assert.equal(Number(bars[figureIndex][i].x), 28);
      assert(Math.abs(Number(bars[figureIndex][i].width) - 300 * value / maximum) < 1e-7);
    }
  }
  const markers = inspect(set[1]).filter(node => node.tagName === 'path' && node.properties.stroke === 'var(--color-amber)');
  assert.equal(markers.length, 4);
  for (const [i, marker] of markers.entries()) assert.equal(marker.properties.d, `M228 ${126 + 74 * i} V${148 + 74 * i}`);
}

test('DeFi figures retain comparable scales, liquidation markers and safe mobile geometry', async () => {
  for (const set of figures) {
    assert.equal(set.length, 3);
    for (const svg of set) await geometry(svg);
    scales(set);
  }
  assert.throws(() => inspect(figures[0][0].replace('height:auto', 'height:900px')));
  assert.throws(() => inspect(figures[0][0].replace('var(--color-signal)', '#116a5f')));
  assert.throws(() => inspect(figures[0][0].replace('<svg ', '<svg onclick="alert(1)" ')));
  assert.throws(() => scales([figures[0][0], figures[0][1].replace('M228 126', 'M250 126'), figures[0][2]]));
  await assert.rejects(geometry(figures[0][0].replace('font-size="24"', 'font-size="65"')));
});

function csv(name) {
  const [header, ...rows] = readFileSync(new URL(`../public/data/${name}.csv`, import.meta.url), 'utf8').trim().split('\n').map(line => line.split(','));
  return rows.map(row => Object.fromEntries(header.map((key, index) => [key, row[index]])));
}

test('DeFi models reconcile money flows, liquidation equity and historical observation dates', () => {
  const [loan] = csv('defi-lending-model');
  assert.equal(loan.status, 'hypothetical_not_live_Aave_parameters');
  assert.equal(loan.period, 'one_year');
  const interest = Number(loan.borrowed_usd) * Number(loan.borrow_rate);
  const treasury = interest * Number(loan.reserve_fraction);
  const distributor = (interest - treasury) * Number(loan.distributor_fraction_of_supplier_interest);
  const suppliers = interest - treasury - distributor;
  assert.equal(interest, Number(loan.interest_usd));
  assert.equal(treasury, Number(loan.treasury_usd));
  assert.equal(distributor, Number(loan.distributor_usd));
  assert.equal(suppliers, Number(loan.suppliers_usd));
  assert.equal(suppliers / Number(loan.supplied_usd), Number(loan.net_simple_yield));
  assert.equal(Number(loan.supplied_usd) - Number(loan.borrowed_usd), 200000);
  const liquidation = csv('defi-liquidation-model');
  for (const row of liquidation) {
    assert.equal(row.status, 'hypothetical_not_live_deployment');
    assert(Math.abs(Number(row.collateral_usd) * Number(row.liquidation_threshold) / Number(row.debt_usd) - Number(row.health_factor)) < 1e-12);
    assert.equal(Number(row.collateral_usd) - Number(row.debt_usd), Number(row.equity_usd));
  }
  const [start, boundary, stress, after] = liquidation;
  assert.equal(Math.round((1 - Number(boundary.collateral_usd) / Number(start.collateral_usd)) * 1000) / 10, 16.7);
  assert.equal(Number(stress.collateral_usd) - Number(after.seized_collateral_usd), Number(after.collateral_usd));
  assert.equal(Number(stress.debt_usd) - Number(after.repaid_debt_usd), Number(after.debt_usd));
  assert.equal(Number(stress.equity_usd) - Number(after.equity_usd), 200);
  assert.equal(Number(after.seized_collateral_usd) / Number(after.repaid_debt_usd), 1.05);
  const holdings = csv('defi-governance-may2023');
  assert.deepEqual(holdings.map(row => Number(row.top_five_holder_share_percent)), [48, 59, 38, 46]);
  for (const row of holdings) {
    assert.equal(row.observation_period, '2023-05');
    assert.equal(row.publication_date, '2026-03-26');
    assert.equal(row.table, '3');
    assert.equal(row.source, 'https://www.ecb.europa.eu/pub/pdf/scpwps/ecb.wp3208~051a880042.en.pdf');
  }
  for (const [i, article] of articles.entries()) {
    assert(!article.includes('—') && !article.includes('{{FIG') && !article.includes('[S0'));
    assert.equal((article.match(/<li id="source-/gu) ?? []).length, 16);
    assert(article.indexOf(i ? '## Sources and documents' : '## Sources et documents') < article.indexOf(i ? '## Scope and method' : '## Périmètre et méthode'));
    for (const value of i ? ['3.456%', '16.7%', 'May 2023', '0.875%'] : ['3,456 %', '16,7 %', 'mai 2023', '0,875 %']) assert(article.includes(value));
    for (const path of ['defi-lending-model.csv', 'defi-liquidation-model.csv', 'defi-governance-may2023.csv']) assert(article.includes('/data/' + path));
  }
});
