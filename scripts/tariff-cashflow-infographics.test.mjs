import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { XMLValidator } from 'fast-xml-parser';
import { fromHtml } from 'hast-util-from-html';
import { toText } from 'hast-util-to-text';
import sharp from 'sharp';

const articles = ['../src/content/posts/droits-douane-tresorerie-proces-section-301.md', '../src/content/posts-en/tariffs-cash-flow-section-301-litigation.md'].map(path => readFileSync(new URL(path, import.meta.url), 'utf8'));
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
  assert.equal(root.viewBox, '0 0 480 450');
  assert.equal(root.role, 'img');
  for (const id of root.ariaLabelledBy) assert(nodes.some(node => node.properties.id === id && ['title', 'desc'].includes(node.tagName) && toText(node).trim()));
  return nodes;
}

async function geometry(svg) {
  const boxes = [];
  for (const node of inspect(svg).filter(node => node.tagName === 'text')) {
    const p = node.properties, size = Number(p.fontSize);
    assert(size >= 20);
    const label = toText(node).replaceAll('&', '&amp;').replaceAll('<', '&lt;');
    const { info } = await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="4096" height="128"><text x="8" y="70" fill="white" font-family="Arial, Helvetica, sans-serif" font-size="${size}" font-weight="${p.fontWeight ?? 400}">${label}</text></svg>`)).trim().raw().toBuffer({ resolveWithObject: true });
    const width = info.width + 3;
    const left = Number(p.x) - (p.textAnchor === 'middle' ? width / 2 : p.textAnchor === 'end' ? width : 0);
    assert(left >= 4 && left + width <= 476 && Number(p.y) - size * .95 >= 4 && Number(p.y) + 4 <= 446, `Visible safety padding: ${label}`);
    boxes.push({ left: left - 1, right: left + width + 1, top: Number(p.y) - size * .95 - 1, bottom: Number(p.y) + 5, label });
  }
  for (const node of inspect(svg).filter(node => node.tagName === 'path')) {
    const tokens = node.properties.d.match(/[MHV]|-?\d+(?:\.\d+)?/gu);
    let x = 0, y = 0;
    while (tokens.length) {
      const command = tokens.shift(), oldX = x, oldY = y;
      if (command === 'M') { x = Number(tokens.shift()); y = Number(tokens.shift()); continue; }
      assert(command === 'H' || command === 'V');
      if (command === 'H') x = Number(tokens.shift()); else y = Number(tokens.shift());
      for (const box of boxes) {
        const crossing = command === 'H'
          ? y > box.top && y < box.bottom && Math.max(x, oldX) > box.left && Math.min(x, oldX) < box.right
          : x > box.left && x < box.right && Math.max(y, oldY) > box.top && Math.min(y, oldY) < box.bottom;
        assert(!crossing, `Line crosses label: ${box.label}`);
      }
    }
  }
}

function scales(figures) {
  const bars = index => inspect(figures[index]).filter(node => node.tagName === 'rect' && Number(node.properties.height) === 18).map(node => node.properties);
  const stacked = bars(0);
  assert.equal(stacked.length, 8);
  for (const [index, additional] of [100, 125, 60, 85].entries()) {
    assert.equal(Number(stacked[2 * index].x), 28);
    assert.equal(Number(stacked[2 * index].width), 60);
    assert.equal(Number(stacked[2 * index + 1].x), 88);
    assert.equal(Number(stacked[2 * index + 1].width), additional * 1.5);
  }
  const contribution = bars(2);
  assert.equal(contribution.length, 4);
  for (const [index, value] of [300000, 175000, 300000, 331250].entries()) {
    assert.equal(Number(contribution[index].x), 28);
    assert(Math.abs(Number(contribution[index].width) - 270 * value / 350000) < 1e-7);
  }
  const path = inspect(figures[1]).find(node => node.tagName === 'path' && node.properties.stroke === 'var(--color-signal)').properties.d;
  const values = [125000, 250000, 375000, 375000, 375000, 375000, 250000, 125000, 0];
  let expected = `M80 ${330 - 230 * values[0] / 400000}`;
  for (let index = 1; index < values.length; index++) expected += ` H${80 + 350 * index * 30 / 240} V${330 - 230 * values[index] / 400000}`;
  const commands = value => value.match(/[MHV]|-?\d+(?:\.\d+)?/gu).map(token => /[MHV]/u.test(token) ? token : Number(token));
  assert.deepEqual(commands(path), commands(expected));
}

test('Tariff charts preserve semantic colours, compact readable geometry and honest common scales', async () => {
  for (const article of articles) {
    const figures = [...article.matchAll(/<svg\b[\s\S]*?<\/svg>/gu)].map(match => match[0]);
    assert.equal(figures.length, 3);
    await Promise.all(figures.map(geometry));
    scales(figures);
    assert.throws(() => scales([figures[0].replace('width="187.5"', 'width="200"'), ...figures.slice(1)]));
    assert.throws(() => inspect(figures[0].replace('var(--color-accent)', '#ff0000')));
    assert.throws(() => inspect(figures[0].replace('height:auto', 'height:800px')));
    await assert.rejects(geometry(figures[1].replace('<text x="430" y="95"', '<text x="430" y="147.5"')));
    assert(article.includes('/illustrations/news/tariff-cashflow-2026-v1.jpg'));
    assert(!article.includes('[[FIG') && !article.includes('[S15]') && !article.includes('—'));
  }
  const metadata = await sharp(new URL('../public/illustrations/news/tariff-cashflow-2026-v1.jpg', import.meta.url).pathname).metadata();
  assert.equal(metadata.width, 1200);
  assert.equal(metadata.height, 630);
});

function csv(name) {
  const [header, ...rows] = readFileSync(new URL(`../public/data/${name}.csv`, import.meta.url), 'utf8').trim().split(/\r?\n/u).map(line => line.split(','));
  return rows.map(row => Object.fromEntries(header.map((key, index) => [key, row[index]])));
}

test('Duty, cash-cycle and contribution examples keep units, netting, timing and funding assumptions', () => {
  for (const row of csv('tariff-calculation-example')) {
    const value = Number(row.customs_value_usd), ordinary = Number(row.ordinary_rate_percent), headline = Number(row.headline_rate_percent);
    const extra = value * (row.mode === 'additive' ? headline : Math.max(0, headline - ordinary)) / 100;
    assert.equal(Number(row.additional_duty_usd), extra);
    assert.equal(Number(row.total_duty_usd), value * ordinary / 100 + extra);
    assert(row.scenario.startsWith('hypothetical_'));
  }
  assert.equal(1000000 * Math.max(0, 10 - 12) / 100, 0);
  const pipeline = csv('tariff-working-capital-example');
  let held = 0, paidTotal = 0, interestTotal = 0;
  for (const [index, row] of pipeline.entries()) {
    const day = index * 30, paid = day <= 150 ? 125000 : 0, collected = day >= 90 ? 125000 : 0;
    held += paid - collected; paidTotal += paid;
    assert.equal(Number(row.day), day);
    assert.equal(Number(row.paid_usd), paid);
    assert.equal(Number(row.collected_usd), collected);
    assert.equal(Number(row.net_funding_usd), held);
    assert.equal(Number(row.credit_limit_usd), 300000);
    assert.equal(Number(row.unfunded_usd), Math.max(0, held - 300000));
    assert.equal(Number(row.next_interval_calendar_days), day < 240 ? 30 : 0);
    assert.equal(Number(row.annual_funding_rate_percent), 9);
    assert.equal(Number(row.day_count_basis), 365);
    const interest = held * .09 * Number(row.next_interval_calendar_days) / 365;
    assert(Math.abs(Number(row.interval_interest_usd) - interest) < 1e-9);
    interestTotal += interest;
    assert(row.scenario.includes('same_day_netting'));
  }
  assert.equal(pipeline.length, 9);
  assert.equal(paidTotal, 750000);
  assert.equal(held, 0);
  assert.equal(Math.max(...pipeline.map(row => Number(row.net_funding_usd))), 375000);
  assert(Math.abs(interestTotal - 6 * 125000 * .09 * 90 / 365) < 1e-9);
  for (const row of csv('tariff-contribution-example')) {
    const revenue = Number(row.revenue_usd), contribution = revenue - Number(row.variable_costs_usd);
    assert.equal(Number(row.contribution_usd), contribution);
    assert(Math.abs(Number(row.contribution_percent) - 100 * contribution / revenue) < 1e-9);
    assert(Math.abs(Number(row.price_increase_percent) - 100 * (revenue / 1500000 - 1)) < 1e-9);
    assert(row.scenario.includes('constant_quantity_before_fixed_costs_and_finance'));
  }
  assert.equal((300000 - 175000) / 300000, 5 / 12);
});
