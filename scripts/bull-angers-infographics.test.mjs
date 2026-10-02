import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { XMLValidator } from 'fast-xml-parser';
import { fromHtml } from 'hast-util-from-html';
import { toText } from 'hast-util-to-text';
import sharp from 'sharp';

const articles = ['../src/content/posts/bull-usine-angers-supercalculateurs.md', '../src/content/posts-en/bull-angers-supercomputer-factory.md'].map(path => readFileSync(new URL(path, import.meta.url), 'utf8'));
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
  assert(['0 0 480 430', '0 0 480 440', '0 0 480 400'].includes(p.viewBox));
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

function csv(name) {
  const [header, ...rows] = readFileSync(new URL(`../public/data/bull-angers-${name}-model.csv`, import.meta.url), 'utf8').trim().split('\n').map(line => line.split(','));
  return rows.map(row => Object.fromEntries(header.map((key, i) => [key, row[i]])));
}

function scales(set) {
  const specs = [
    { values: [100, 100, 140, 200], max: 200, zero: 24, extent: 400 },
    { values: [-15, -55, 15, 20], max: 60, zero: 264, extent: 150 },
  ];
  for (const [i, spec] of specs.entries()) {
    const bars = inspect(set[i]).filter(n => n.tagName === 'rect' && n.properties.dataValue !== undefined);
    assert.equal(bars.length, spec.values.length);
    bars.forEach((bar, j) => {
      const p = bar.properties, v = spec.values[j], w = spec.extent * Math.abs(v) / spec.max;
      assert.equal(Number(p.dataValue), v);
      assert(Math.abs(Number(p.width) - w) < 1e-7);
      assert(Math.abs(Number(p.x) - (v < 0 ? spec.zero - w : spec.zero)) < 1e-7);
    });
  }
  const energy = inspect(set[2]).filter(n => n.tagName === 'rect' && n.properties.dataValue !== undefined);
  assert.deepEqual(energy.map(n => Number(n.properties.dataValue)), [87.6, 26.28, 87.6, 8.76]);
  energy.forEach((bar, i) => {
    assert(Math.abs(Number(bar.properties.width) - 400 * Number(bar.properties.dataValue) / 120) < 1e-7);
    assert(Math.abs(Number(bar.properties.x) - (i % 2 ? 24 + 400 * 87.6 / 120 : 24)) < 1e-7);
  });
}

test('Bull charts keep safe theme geometry, signed cash scales and energy boundaries', async () => {
  for (const set of figures) {
    assert.equal(set.length, 3);
    for (const svg of set) await geometry(svg);
    scales(set);
  }
  assert.throws(() => inspect(figures[0][0].replace('height:auto', 'height:900px')));
  assert.throws(() => inspect(figures[0][0].replace('var(--color-signal)', '#153b70')));
  assert.throws(() => inspect(figures[0][0].replace('<svg ', '<svg onload="alert(1)" ')));
  assert.throws(() => scales([figures[0][0].replace('width="200.00000000"', 'width="201"'), ...figures[0].slice(1)]));
  await assert.rejects(geometry(figures[0][0].replace('font-size="24"', 'font-size="65"')));
});

test('Fictitious bottlenecks, netted milestones and annual energy reconcile independently', () => {
  const throughput = csv('throughput');
  assert.deepEqual(throughput.map(r => Number(r.output_index)), [100, 100, 140, 200]);
  for (const r of throughput) {
    assert.equal(r.status, 'hypothetical_not_bull');
    assert.equal(Number(r.output_index), Math.min(...['components_index', 'assembly_index', 'validation_index'].map(k => Number(r[k]))));
  }
  const cash = csv('cash');
  assert.deepEqual(cash.map(r => Number(r.month)), [0, 4, 8, 12]);
  let balance = 0;
  for (const r of cash) {
    assert.equal(r.status, 'hypothetical_not_bull');
    const flow = Number(r.customer_receipts_m_eur) - Number(r.production_payments_m_eur);
    assert.equal(flow, Number(r.net_flow_m_eur));
    balance += flow; assert.equal(balance, Number(r.cumulative_cash_m_eur));
  }
  assert.equal(cash.reduce((s, r) => s + Number(r.customer_receipts_m_eur), 0), 100);
  assert.equal(cash.reduce((s, r) => s + Number(r.production_payments_m_eur), 0), 80);
  assert.equal(Math.min(...cash.map(r => Number(r.cumulative_cash_m_eur))), -55);
  assert.equal(balance, 20);
  assert.equal(Math.round(55e6 * .06 * 90 / 365), 813699);
  const energy = csv('energy');
  assert.deepEqual(energy.map(r => Number(r.total_energy_mwh)), [113880, 96360]);
  for (const r of energy) {
    assert.equal(r.status, 'hypothetical_not_bull');
    const it = Number(r.average_it_load_mw) * Number(r.hours);
    assert.equal(it, 87600); assert.equal(it, Number(r.it_energy_mwh));
    assert(Math.abs(it * Number(r.pue) - Number(r.total_energy_mwh)) < 1e-8);
    assert(Math.abs(Number(r.total_energy_mwh) - it - Number(r.non_it_energy_mwh)) < 1e-9);
    assert.equal(Number(r.total_energy_mwh) * Number(r.electricity_eur_per_mwh), Number(r.annual_electricity_eur));
  }
  assert.equal(Number(energy[0].annual_electricity_eur) - Number(energy[1].annual_electricity_eur), 2102400);
  assert.equal(Number(((1 - 1.1 / 1.3) * 100).toFixed(1)), 15.4);
  for (const article of articles) {
    assert(article.includes('354,8') || article.includes('354.8'));
    assert(article.includes('193,9') || article.includes('193.9'));
    assert(article.includes('813 698,63') || article.includes('813,698.63'));
    assert(article.includes('aucun résultat de Bull') || article.includes('does not estimate Bull’s profit'));
    assert(!article.includes('[[FIGURE_') && !article.includes('—'));
  }
});
