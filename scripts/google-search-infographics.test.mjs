import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { XMLValidator } from 'fast-xml-parser';
import { fromHtml } from 'hast-util-from-html';
import { toText } from 'hast-util-to-text';
import sharp from 'sharp';

const articles = ['../src/content/posts/google-donnees-recherche-prix-acces-vie-privee.md', '../src/content/posts-en/google-search-data-access-cost-privacy.md'].map(path => readFileSync(new URL(path, import.meta.url), 'utf8'));
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
  const p = nodes[0].properties;
  assert.equal(p.style, 'width:100%;height:auto');
  assert(['0 0 480 482', '0 0 480 390'].includes(p.viewBox));
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
  assert.equal(bars[0].length, 4); assert.equal(bars[1].length, 6);
  for (const [i, rate] of [16, 4, 20, 20].entries()) {
    assert.equal(Number(bars[0][i].x), 28);
    assert.equal(Number(bars[0][i].width), 300 * rate / 20);
  }
  for (const [i, n] of [2, 4, 8].entries()) {
    const [common, specific] = bars[1].slice(2 * i, 2 * i + 2), commonWidth = 300 * (400 / n) / 240;
    assert.equal(Number(common.x), 28); assert.equal(Number(common.width), commonWidth);
    assert.equal(Number(specific.x), 28 + commonWidth); assert.equal(Number(specific.width), 25);
    assert.equal(Number(common.y), Number(specific.y));
    assert.equal(common.fill, 'var(--color-signal)'); assert.equal(specific.fill, 'var(--color-accent)');
  }
}

test('Google Search figures preserve geometry, contiguous cost segments and comparable scales', async () => {
  for (const set of figures) {
    assert.equal(set.length, 2);
    for (const svg of set) await geometry(svg);
    scales(set);
  }
  assert.throws(() => inspect(figures[0][0].replace('height:auto', 'height:900px')));
  assert.throws(() => inspect(figures[0][0].replace('var(--color-signal)', '#196878')));
  assert.throws(() => scales([figures[0][0], figures[0][1].replace('x="278.0"', 'x="350"')]));
  await assert.rejects(geometry(figures[0][0].replace('font-size="24"', 'font-size="65"')));
});

function csv(name) {
  const [header, ...rows] = readFileSync(new URL(`../public/data/${name}.csv`, import.meta.url), 'utf8').trim().split('\n').map(line => line.split(','));
  return rows.map(row => Object.fromEntries(header.map((key, index) => [key, row[index]])));
}

test('Hypothetical click and cost calculations preserve denominators, periods and source boundaries', async () => {
  const clicks = csv('google-search-click-bias-example');
  for (const row of clicks) {
    assert.equal(row.status, 'hypothetical_teaching_model_not_Google_measurements');
    assert.equal(Number(row.displays), 1000);
    assert.equal(Number(row.click_probability_if_examined), .2);
    assert.equal(Number(row.clicks), Number(row.examined) * .2);
    assert.equal(Number(row.clicks_per_display), Number(row.clicks) / Number(row.displays));
    assert.equal(Number(row.clicks_per_examined), Number(row.clicks) / Number(row.examined));
  }
  assert.equal(Number(clicks[0].clicks_per_display) / Number(clicks[1].clicks_per_display), 4);
  const costs = csv('google-search-shared-cost-example');
  assert.equal(costs[0].period, 'one_off'); assert.equal(Number(costs[0].total_per_recipient_eur), 180000);
  for (const [i, row] of costs.entries()) {
    assert.equal(row.status, 'hypothetical_constant_costs_no_return_margin_tax_or_internal_costs');
    assert.equal(Number(row.common_share_eur), Number(row.common_cost_eur) / Number(row.beneficiaries));
    assert.equal(Number(row.total_per_recipient_eur), Number(row.common_share_eur) + Number(row.recipient_specific_eur));
    assert.equal(row.period, i === 0 ? 'one_off' : 'one_year');
  }
  assert.deepEqual(costs.slice(1).map(row => Number(row.total_per_recipient_eur)), [220000, 120000, 70000]);
  for (const article of articles) {
    assert(!article.includes('—') && !article.includes('[[S') && !article.includes('{{FIG'));
    const nodes = elements(fromHtml(article, { fragment: true }));
    const sources = nodes.filter(node => node.tagName === 'li' && /^source-\d+$/u.test(node.properties.id ?? ''));
    assert.equal(sources.length, 13);
    for (const source of sources) {
      const citation = elements(source).find(node => node.tagName === 'a'), url = new URL(citation.properties.href);
      assert.equal(url.protocol, 'https:'); assert.equal(url.username, ''); assert.equal(url.password, '');
    }
    assert(article.includes('/data/google-search-click-bias-example.csv'));
    assert(article.includes('/data/google-search-shared-cost-example.csv'));
  }
  const meta = await sharp(new URL('../public/illustrations/news/google-search-data-access-2026-v1.jpg', import.meta.url).pathname).metadata();
  assert.equal(meta.width, 1200); assert.equal(meta.height, 630);
});
