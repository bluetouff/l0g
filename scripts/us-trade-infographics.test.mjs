import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { XMLValidator } from 'fast-xml-parser';
import { fromHtml } from 'hast-util-from-html';
import { toText } from 'hast-util-to-text';
import sharp from 'sharp';

const articles = ['../src/content/posts/deficit-commercial-americain-importations-aout-2026.md', '../src/content/posts-en/us-trade-deficit-imports-august-2026.md'].map(path => readFileSync(new URL(path, import.meta.url), 'utf8'));
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
  assert(['0 0 480 530', '0 0 480 380'].includes(p.viewBox));
  assert.equal(p.role, 'img');
  for (const id of p.ariaLabelledBy) assert(nodes.some(node => node.properties.id === id && ['title', 'desc'].includes(node.tagName) && toText(node).trim()));
  return nodes;
}

async function geometry(svg) {
  const nodes = inspect(svg), height = Number(nodes[0].properties.viewBox.split(' ').at(-1)), boxes = [];
  for (const node of nodes.filter(item => item.tagName === 'text')) {
    const p = node.properties, size = Number(p.fontSize), label = toText(node);
    assert(size >= 18);
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
    assert(w >= 0 && h >= 0 && x >= 0 && y >= 0 && x + w <= 480 && y + h <= height);
    if (h !== 18) continue;
    for (const box of boxes) assert(!(box.left < x + w && box.right > x && box.top < y + h && box.bottom > y), `Bar crosses label: ${box.label}`);
  }
}

const factor = Array.from({ length: 5 }, (_, i) => 1 / 1.08 ** (i + 1)).reduce((sum, value) => sum + value, 0);
const npvs = [240000, 300000, 360000].map(cash => (cash * factor - 1200000) / 1000);

function scales(set) {
  const specifications = [
    { values: [4.235, 2.951, 1.986, 1.797, 1.49, 1.24], max: 5, zero: 24, extent: 300 },
    { values: [1.2, -1, .2], max: 1.5, zero: 238, extent: 142 },
    { values: npvs, max: 300, zero: 238, extent: 142 },
  ];
  for (const [i, spec] of specifications.entries()) {
    const nodes = inspect(set[i]);
    const bars = nodes.filter(node => node.tagName === 'rect' && Number(node.properties.height) === 18);
    assert.equal(bars.length, spec.values.length);
    for (const [j, bar] of bars.entries()) {
      const value = spec.values[j], width = spec.extent * Math.abs(value) / spec.max;
      assert(Math.abs(Number(bar.properties.dataValue) - value) < 1e-9);
      assert(Math.abs(Number(bar.properties.width) - width) < 1e-7);
      assert(Math.abs(Number(bar.properties.x) - (value < 0 ? spec.zero - width : spec.zero)) < 1e-7);
    }
    if (i > 0) assert.equal(nodes.filter(node => node.tagName === 'path' && String(node.properties.d).startsWith('M238')).length, 3);
  }
}

test('Trade charts retain common scales, signed offsets, accessible labels and safe geometry', async () => {
  for (const set of figures) {
    assert.equal(set.length, 3);
    for (const svg of set) await geometry(svg);
    scales(set);
  }
  assert.throws(() => inspect(figures[0][0].replace('height:auto', 'height:900px')));
  assert.throws(() => inspect(figures[0][0].replace('var(--color-signal)', '#153b70')));
  assert.throws(() => inspect(figures[0][0].replace('<svg ', '<svg onload="alert(1)" ')));
  assert.throws(() => scales([figures[0][0].replace('width="254.10000000"', 'width="290"'), ...figures[0].slice(1)]));
  await assert.rejects(geometry(figures[0][0].replace('font-size="24"', 'font-size="65"')));
});

function csv(name) {
  const [header, ...rows] = readFileSync(new URL(`../public/data/${name}.csv`, import.meta.url), 'utf8').trim().split('\n').map(line => line.split(','));
  return rows.map(row => Object.fromEntries(header.map((key, i) => [key, row[i]])));
}

test('Census contributions reconcile with the published vintage without mixing bases', () => {
  const rows = csv('us-trade-august-2026');
  assert.equal(rows.length, 6);
  for (const row of rows) {
    assert.equal(row.adjustment, 'seasonally_adjusted_current_dollars');
    assert.equal(row.vintage, '2026-09-30');
    assert.equal(row.source, 'https://www.census.gov/econ/indicators/2026/advance_report2608.pdf');
    const imports = Number(row.imports_august_usd_millions) - Number(row.imports_july_usd_millions);
    const exports = Number(row.exports_august_usd_millions) - Number(row.exports_july_usd_millions);
    assert.equal(imports, Number(row.delta_imports_usd_millions));
    assert.equal(exports, Number(row.delta_exports_usd_millions));
    assert.equal(imports - exports, Number(row.delta_deficit_usd_millions));
  }
  const capital = rows.find(row => row.category === 'capital');
  assert.equal(Number((Number(capital.imports_august_usd_millions) / 336051 * 100).toFixed(1)), 43.4);
  assert.equal(Number(((Number(capital.imports_august_usd_millions) / Number(capital.imports_august2025_usd_millions) - 1) * 100).toFixed(1)), 57.2);
  assert.equal(rows.reduce((sum, row) => sum + Number(row.delta_deficit_usd_millions), 0), 13699);
  assert.equal(13699 - (132636 - 118940), 3);
  for (const article of articles) {
    assert(article.includes('0,003') || article.includes('0.003'));
    assert(article.includes('balance des paiements') || article.includes('balance-of-payments'));
    assert(article.includes('2025') && article.includes('23'));
    assert(article.includes('6 octobre') || article.includes('October 6'));
  }
});

test('Hypothetical GDP, inventory and return models preserve units, timing and cash flows', () => {
  const [gdp] = csv('us-trade-gdp-model');
  assert(gdp.status.startsWith('hypothetical_'));
  assert.equal(Number(gdp.investment_usd) - Number(gdp.imports_usd), Number(gdp.gdp_usd));
  assert.equal(Number(gdp.gdp_usd), 200000);
  const inventory = csv('us-trade-inventory-model');
  assert.deepEqual(inventory.map(row => Number(row.gdp_usd)), [0, 20]);
  for (const row of inventory) assert.equal(Number(row.consumption_usd) + Number(row.inventory_change_usd) - Number(row.imports_usd), Number(row.gdp_usd));
  assert.equal(inventory.reduce((sum, row) => sum + Number(row.inventory_change_usd), 0), 0);
  const projects = csv('us-trade-project-model');
  assert.deepEqual(projects.map(row => Number(row.annual_operating_cash_usd)), [240000, 300000, 360000]);
  for (const row of projects) {
    assert.equal(row.status, 'hypothetical_not_forecast');
    assert.equal(Number(row.years), 5);
    assert.equal(Number(row.discount_rate), .08);
    assert.equal(Number(row.terminal_value_usd), 0);
    const cash = Number(row.annual_operating_cash_usd);
    assert(Math.abs(cash * factor - Number(row.present_value_usd)) < 1e-6);
    assert(Math.abs(cash * factor - 1200000 - Number(row.npv_usd)) < 1e-6);
    assert(Math.abs(Number(row.break_even_annual_cash_usd) * factor - 1200000) < 1e-6);
  }
  assert.equal(Math.round(Number(projects[0].break_even_annual_cash_usd)), 300548);
  assert.equal(Math.round(Number(projects[0].npv_usd)), -241750);
  assert.equal(Math.round(Number(projects[2].npv_usd)), 237376);
});
