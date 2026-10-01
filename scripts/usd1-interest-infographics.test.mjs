import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { XMLValidator } from 'fast-xml-parser';
import { fromHtml } from 'hast-util-from-html';
import { toText } from 'hast-util-to-text';
import sharp from 'sharp';

const articles = ['../src/content/posts/usd1-trump-taux-interets-reserves-beneficiaires.md', '../src/content/posts-en/usd1-trump-interest-rates-reserves-beneficiaries.md'].map(path => readFileSync(new URL(path, import.meta.url), 'utf8'));
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
      if (['fill', 'stroke'].includes(key)) assert.match(String(value), /^(?:none|var\(--color-(?:surface|line-strong|paper|signal|muted|accent)\))$/u);
    }
  }
  const root = nodes[0].properties;
  assert.equal(root.style, 'width:100%;height:auto');
  assert(['0 0 480 350', '0 0 480 420'].includes(root.viewBox));
  assert.equal(root.role, 'img');
  for (const id of root.ariaLabelledBy) assert(nodes.some(node => node.properties.id === id && ['title', 'desc'].includes(node.tagName) && toText(node).trim()));
  return nodes;
}

async function geometry(svg) {
  const nodes = inspect(svg), height = Number(nodes[0].properties.viewBox.split(' ').at(-1)), boxes = [];
  for (const node of nodes.filter(item => item.tagName === 'text')) {
    const p = node.properties, size = Number(p.fontSize);
    assert(size >= 20);
    const label = toText(node), escaped = label.replaceAll('&', '&amp;').replaceAll('<', '&lt;');
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
  const values = [[3.066358657, 1.129357410], [76.981, 71.047, 5.934], [10, 30.66358657, 41.95716067]], maxima = [5, 80, 50];
  for (const [index, svg] of set.entries()) {
    const bars = inspect(svg).filter(node => node.tagName === 'rect' && Number(node.properties.height) === 18);
    assert.equal(bars.length, values[index].length);
    for (const [i, node] of bars.entries()) {
      assert.equal(Number(node.properties.x), 28);
      assert(Math.abs(Number(node.properties.width) - 300 * values[index][i] / maxima[index]) < 1e-7);
    }
  }
}

test('USD1 charts retain safe markup, theme colours, readable geometry and exact common scales', async () => {
  for (const set of figures) {
    assert.equal(set.length, 3);
    for (const svg of set) await geometry(svg);
    scales(set);
  }
  assert.throws(() => inspect(figures[0][0].replace('height:auto', 'height:700px')));
  assert.throws(() => inspect(figures[0][0].replace('var(--color-signal)', '#196878')));
  assert.throws(() => scales([figures[0][0].replace('183.98151942', '230'), ...figures[0].slice(1)]));
  await assert.rejects(geometry(figures[0][0].replace('font-size="22" font-weight="700">Où se trouve la réserve ?', 'font-size="60" font-weight="700">Où se trouve la réserve ?')));
});

function csv(name) {
  const [header, ...rows] = readFileSync(new URL(`../public/data/${name}.csv`, import.meta.url), 'utf8').trim().split('\n').map(line => line.split(','));
  return rows.map(row => Object.fromEntries(header.map((key, index) => [key, row[index]])));
}

test('USD1 calculations preserve nominal units, periods, business scope and hypothetical rate transmission', async () => {
  const reserves = Object.fromEntries(csv('usd1-reserve-snapshot').map(row => {
    assert.equal(row.observation_utc, '2026-08-31T23:59:00Z');
    assert.equal(row.source_url, 'https://landing.bitgo.com/rs/552-OGK-141/images/USD1_Reserve_Attestation_Report_August_2026.pdf?version=0');
    assert.equal(row.unit, row.metric === 'redeemable_tokens' ? 'USD1' : 'USD');
    return [row.metric, Number(row.amount)];
  }));
  assert.equal(reserves.government_money_market_funds + reserves.cash_equivalents_demand_accounts, reserves.total_redemption_assets);
  assert.equal(reserves.total_redemption_assets - reserves.redeemable_tokens, 412378);
  assert.equal((100 * reserves.government_money_market_funds / reserves.total_redemption_assets).toFixed(2), '73.08');
  const bitgo = Object.fromEntries(csv('usd1-bitgo-h1-2026').map(row => {
    assert.equal(row.period_start, '2026-01-01'); assert.equal(row.period_end, '2026-06-30');
    assert.equal(row.scope, 'all_BitGo_Stablecoin_as_a_Service_unaudited_US_GAAP');
    return [row.metric, Number(row.amount_usd)];
  }));
  assert.equal(bitgo.revenue - bitgo.sponsor_fees, bitgo.difference_before_other_costs);
  for (const row of csv('usd1-rate-scenarios')) {
    assert.equal(Number(row.rate_change_decimal), 0.01); assert.equal(Number(row.years), 1);
    assert.equal(row.scope, 'hypothetical_constant_balance_full_rate_transmission_before_all_costs');
    assert(Math.abs(Number(row.incremental_gross_usd) - Number(row.base_usd) * 0.01) < 1e-7);
  }
  const volume = csv('usd1-volume-scenarios');
  for (const row of volume) {
    assert.equal(row.scope, 'hypothetical_constant_balance_before_all_costs');
    assert.equal(Number(row.gross_income_usd), Number(row.balance_usd) * Number(row.annual_rate_decimal) * Number(row.years));
  }
  assert.equal(Number(volume[0].gross_income_usd), Number(volume[2].gross_income_usd));
  assert.equal((Number(volume[0].balance_usd) - Number(volume[2].balance_usd)) / Number(volume[0].balance_usd), 0.2);
  for (const article of articles) {
    assert(!article.includes('—') && !article.includes('[[S'));
    for (const name of ['reserve-snapshot', 'bitgo-h1-2026', 'rate-scenarios', 'volume-scenarios']) assert(article.includes(`/data/usd1-${name}.csv`));
    const nodes = elements(fromHtml(article, { fragment: true }));
    assert.equal(nodes.filter(node => node.tagName === 'li' && /^source-\d+$/u.test(node.properties.id ?? '')).length, 17);
    assert(!article.includes('https://www.arcamax.com/'));
  }
  const meta = await sharp(new URL('../public/illustrations/news/usd1-interest-reserves-2026-v1.jpg', import.meta.url).pathname).metadata();
  assert.equal(meta.width, 1200); assert.equal(meta.height, 630);
});
