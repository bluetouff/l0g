import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { XMLValidator } from 'fast-xml-parser';
import { fromHtml } from 'hast-util-from-html';
import { toText } from 'hast-util-to-text';
import sharp from 'sharp';

const articles = [
  '../src/content/posts/stablecoin-reserves-delai-remboursement-dollar.md',
  '../src/content/posts-en/stablecoin-reserves-redemption-dollar.md',
].map(path => readFileSync(new URL(path, import.meta.url), 'utf8'));
const figures = articles.map(article => [...article.matchAll(/<svg\b[\s\S]*?<\/svg>/gu)].map(match => match[0]));
const elements = tree => [tree, ...(tree.children ?? []).flatMap(elements)].filter(node => node.type === 'element');

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
  assert.equal(root.role, 'img');
  assert.equal(root.viewBox, '0 0 480 450');
  for (const id of root.ariaLabelledBy) {
    assert(nodes.some(node => node.properties.id === id && ['title', 'desc'].includes(node.tagName) && toText(node).trim()));
  }
  return nodes;
}

async function geometry(svg) {
  for (const node of inspect(svg).filter(node => node.tagName === 'text')) {
    const p = node.properties, size = Number(p.fontSize);
    assert(size >= 20, 'Labels must remain readable on mobile');
    const label = toText(node).replaceAll('&', '&amp;').replaceAll('<', '&lt;');
    const { info } = await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="4096" height="128"><text x="8" y="70" fill="white" font-family="Arial, Helvetica, sans-serif" font-size="${size}" font-weight="${p.fontWeight ?? 400}">${label}</text></svg>`)).trim().raw().toBuffer({ resolveWithObject: true });
    const width = info.width + 3;
    const left = Number(p.x) - (p.textAnchor === 'middle' ? width / 2 : p.textAnchor === 'end' ? width : 0);
    assert(left >= 4 && left + width <= 476 && Number(p.y) - size * 0.95 >= 4 && Number(p.y) + 4 <= 446, `ViewBox padding: ${label}`);
  }
}

function feeScale(svg) {
  const bars = inspect(svg).filter(node => node.tagName === 'rect' && Number(node.properties.height) === 18);
  assert.equal(bars.length, 4);
  for (const [index, amount] of [100000, 250000, 500000, 1000000].entries()) {
    const percent = 100 * Math.max(1000, amount * 0.001) / amount;
    assert.equal(Number(bars[index].properties.x), 28);
    assert(Math.abs(Number(bars[index].properties.width) - 300 * percent) < 1e-7);
  }
}

function shortfallScale(svg) {
  const bars = inspect(svg).filter(node => node.tagName === 'rect' && Number(node.properties.height) === 18);
  assert.equal(bars.length, 2);
  for (const [index, tokens] of [100, 65].entries()) {
    const lossPercent = 100 * 5 / tokens;
    assert.equal(Number(bars[index].properties.x), 28);
    assert(Math.abs(Number(bars[index].properties.width) - 424 * lossPercent / 10) < 1e-7);
  }
}

test('Stablecoin figures preserve safe markup, compact geometry and common quantitative scales', async () => {
  for (const set of figures) {
    assert.equal(set.length, 3);
    for (const svg of set) await geometry(svg);
    const paths = inspect(set[0]).filter(node => node.tagName === 'path');
    for (const [name, capacity] of [['signal', 150], ['accent', 50]]) {
      const path = paths.find(node => node.properties.stroke === `var(--color-${name})`);
      const expected = [0, 1, 2, 3].map((day, index) => `${index === 0 ? 'M' : 'L'}${76 + 120 * day} ${(342 - 0.58 * Math.min(350, 200 + capacity * day)).toFixed(8)}`).join(' ');
      assert.equal(path.properties.d, expected);
    }
    feeScale(set[1]);
    shortfallScale(set[2]);
  }
  assert.throws(() => feeScale(figures[0][1].replace('300.00000000', '320')));
  assert.throws(() => shortfallScale(figures[0][2].replace('326.15384615', '350')));
  assert.throws(() => inspect(figures[0][0].replace('<rect', '<script')));
  assert.throws(() => inspect(figures[0][0].replace('var(--color-accent)', '#ff0000')));
});

function csv(name) {
  const [header, ...rows] = readFileSync(new URL(`../public/data/${name}.csv`, import.meta.url), 'utf8').trim().split('\n').map(line => line.split(','));
  return rows.map(row => Object.fromEntries(header.map((key, index) => [key, row[index]])));
}

test('Redemption calculations retain units, hypothetical scope, fee threshold and remaining claims', () => {
  const liquidity = csv('stablecoin-liquidity-example');
  assert.equal(liquidity.length, 4);
  for (const [day, row] of liquidity.entries()) {
    assert.equal(Number(row.business_day), day);
    assert.equal(Number(row.requests_usd_million), 350);
    assert.equal(Number(row.slow_paid_usd_million), Math.min(350, 200 + 50 * day));
    assert.equal(Number(row.fast_paid_usd_million), Math.min(350, 200 + 150 * day));
    assert.equal(Number(row.initial_reserves_usd_million), 1000);
    assert.equal(Number(row.initial_tokens_million), 1000);
    assert.equal(row.scenario, 'hypothetical_no_losses_or_holds');
  }
  const fees = csv('stablecoin-direct-redemption-fees');
  assert.equal(fees.length, 5);
  for (const row of fees) {
    const amount = Number(row.redemption_usd), fee = Math.max(1000, amount * 0.001);
    assert(amount >= 100000);
    assert.equal(Number(row.issuer_fee_usd), fee);
    assert.equal(Number(row.issuer_fee_percent), fee / amount * 100);
    assert.equal(Number(row.net_before_other_costs_usd), amount - fee);
    assert.equal(row.source_checked_date, '2026-09-30');
  }
  assert.equal(Number(fees.at(-1).issuer_fee_usd), 10000, 'Above the threshold, the proportional fee grows');
  const shortfall = csv('stablecoin-shortfall-example');
  assert.equal(shortfall.length, 2);
  for (const row of shortfall) {
    const tokens = Number(row.tokens_million), reserves = Number(row.reserves_usd_million);
    assert.equal(tokens - reserves, 5);
    assert.equal(Number(row.shortfall_usd_million), 5);
    assert.equal(Number(row.proportional_usd_per_token), reserves / tokens);
    assert.equal(Number(row.loss_percent), 5 / tokens * 100);
  }
  assert.equal(Number(shortfall[0].reserves_usd_million) - Number(shortfall[1].reserves_usd_million), 35);
  assert.equal(Number(shortfall[0].tokens_million) - Number(shortfall[1].tokens_million), 35);
  assert(Math.abs(1000000 * 0.08 * 3 / 365 - 657.5342465753424) < 1e-9);
  for (const article of articles) {
    assert(!article.includes('—'));
    for (const name of ['liquidity-example', 'direct-redemption-fees', 'shortfall-example']) assert(article.includes(`/data/stablecoin-${name}.csv`));
  }
});
