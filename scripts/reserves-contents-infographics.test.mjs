import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { XMLValidator } from 'fast-xml-parser';
import { fromHtml } from 'hast-util-from-html';
import { toText } from 'hast-util-to-text';
import sharp from 'sharp';

const articles = [
  '../src/content/posts/reserves-petrolieres-brut-diesel-contenu-delais.md',
  '../src/content/posts-en/oil-reserves-crude-diesel-contents-delivery.md',
].map(path => readFileSync(new URL(path, import.meta.url), 'utf8'));
const figures = articles.map(article => [...article.matchAll(/<svg\b[\s\S]*?<\/svg>/gu)].map(match => match[0]));
const elements = node => [node, ...(node.children ?? []).flatMap(elements)].filter(item => item.type === 'element');
const attributes = new Set(['xmlns', 'viewBox', 'role', 'ariaLabelledBy', 'style', 'id', 'x', 'y', 'width', 'height', 'rx', 'fill', 'stroke', 'strokeWidth', 'd', 'fontFamily', 'fontSize', 'fontWeight', 'textAnchor', 'dataValue']);
const viewBoxes = ['0 0 480 410', '0 0 480 350', '0 0 480 480'];
const dataSpecs = [
  {
    file: 'eia-yields-2025',
    categories: ['finished_motor_gasoline', 'distillate_fuel_oil', 'kerosene_type_jet_fuel'],
    values: [45.9, 30, 11],
    period: '2025',
    scope: 'United States refinery fleet',
    measure: 'volumetric refinery yield with EIA adjustments; selected categories',
    source: 'https://www.eia.gov/dnav/pet/pet_pnp_pct_dc_nus_pct_a.htm',
  },
  {
    file: 'sagess-mix-2024',
    categories: ['gasoil', 'crude_oil', 'gasoline', 'jet_fuel', 'heating_oil'],
    values: [49.8, 30.6, 9.1, 7.8, 2.7],
    period: '2024-12-31',
    scope: 'SAGESS portfolio',
    measure: 'share of portfolio tonnage; historical company inventory',
    source: 'https://www.sagess.fr/sites/default/files/documents_page/sagess_2025_corporate_brochure_0.pdf',
  },
];

function inspect(svg, expectedViewBox) {
  assert(!/<!DOCTYPE|<!ENTITY/iu.test(svg), 'SVG must not declare external entities');
  assert.equal(XMLValidator.validate(svg), true);
  const nodes = elements(fromHtml(svg, { fragment: true }));
  assert.equal(nodes[0]?.tagName, 'svg');
  assert.equal(nodes.filter(node => node.tagName === 'svg').length, 1);
  for (const node of nodes) {
    assert(['svg', 'title', 'desc', 'rect', 'text', 'path'].includes(node.tagName), `Unsafe SVG element: ${node.tagName}`);
    for (const [key, value] of Object.entries(node.properties)) {
      assert(attributes.has(key), `Unexpected SVG attribute: ${key}`);
      assert(!key.toLowerCase().startsWith('on'));
      assert(!String(value).toLowerCase().includes('url('));
      if (key === 'style') assert.equal(node.tagName, 'svg');
      if (['fill', 'stroke'].includes(key)) assert.match(String(value), /^(?:none|var\(--color-(?:surface|paper|signal|muted|accent|amber|line-strong)\))$/u);
    }
  }
  const root = nodes[0].properties;
  assert.equal(root.xmlns, 'http://www.w3.org/2000/svg');
  assert.equal(root.style, 'width:100%;height:auto');
  assert.equal(root.viewBox, expectedViewBox);
  assert.equal(root.role, 'img');
  assert(Array.isArray(root.ariaLabelledBy));
  assert.equal(root.ariaLabelledBy.length, 2);
  for (const [i, id] of root.ariaLabelledBy.entries()) {
    const named = nodes.filter(node => node.properties.id === id);
    assert.equal(named.length, 1);
    assert.equal(named[0].tagName, i === 0 ? 'title' : 'desc');
    assert(toText(named[0]).trim());
  }
  return nodes;
}

function inspectPath(node, height) {
  const path = String(node.properties.d);
  assert.match(path, /^[MLHV\d.\s+-]+$/u, 'Paths use bounded absolute straight segments');
  const tokens = path.match(/[MLHV]|[-+]?(?:\d+(?:\.\d*)?|\.\d+)/gu) ?? [];
  let x = 0, y = 0, command;
  for (let i = 0; i < tokens.length;) {
    if (/^[MLHV]$/u.test(tokens[i])) command = tokens[i++];
    assert(command && i < tokens.length, 'Path must have coordinates after a command');
    const count = ['M', 'L'].includes(command) ? 2 : 1;
    assert(i + count <= tokens.length);
    const coordinates = tokens.slice(i, i + count).map(Number);
    assert(coordinates.every(Number.isFinite));
    if (count === 2) [x, y] = coordinates;
    else if (command === 'H') x = coordinates[0];
    else y = coordinates[0];
    assert(x >= 4 && x <= 476 && y >= 4 && y <= height - 4, 'Path leaves the safe viewBox');
    i += count;
    if (command === 'M') command = 'L';
  }
}

async function geometry(svg, expectedViewBox) {
  const nodes = inspect(svg, expectedViewBox);
  const height = Number(expectedViewBox.split(' ').at(-1));
  const boxes = [];
  for (const node of nodes.filter(item => item.tagName === 'text')) {
    const p = node.properties, size = Number(p.fontSize), label = toText(node);
    assert(Number.isFinite(size) && size >= 18, `Small label: ${label}`);
    assert.equal(p.fontFamily, 'Arial, Helvetica, sans-serif');
    assert(['start', 'middle', 'end'].includes(p.textAnchor));
    const escaped = label.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
    const { info } = await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="4096" height="128"><text x="8" y="70" fill="white" font-family="Arial, Helvetica, sans-serif" font-size="${size}" font-weight="${p.fontWeight ?? 400}">${escaped}</text></svg>`)).trim().raw().toBuffer({ resolveWithObject: true });
    const width = info.width + 3;
    const left = Number(p.x) - (p.textAnchor === 'middle' ? width / 2 : p.textAnchor === 'end' ? width : 0);
    assert(left >= 4 && left + width <= 476 && Number(p.y) - size * .95 >= 4 && Number(p.y) + 5 <= height - 4, `Label leaves safe viewBox: ${label}`);
    boxes.push({ left: left - 1, right: left + width + 1, top: Number(p.y) - size * .95 - 1, bottom: Number(p.y) + 5, label });
  }
  for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) {
    const a = boxes[i], b = boxes[j];
    assert(!(a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top), `Labels overlap: ${a.label} / ${b.label}`);
  }
  for (const node of nodes.filter(item => item.tagName === 'rect')) {
    const p = node.properties, x = Number(p.x ?? 0), y = Number(p.y ?? 0), width = Number(p.width), h = Number(p.height);
    assert([x, y, width, h].every(Number.isFinite));
    assert(width >= 0 && h >= 0 && x >= 0 && y >= 0 && x + width <= 480 && y + h <= height);
    if (p.dataValue === undefined) continue;
    for (const box of boxes) assert(!(box.left < x + width && box.right > x && box.top < y + h && box.bottom > y), `Bar crosses label: ${box.label}`);
  }
  for (const path of nodes.filter(item => item.tagName === 'path')) inspectPath(path, height);
}

function scales(set) {
  assert.equal(set.length, 3);
  const qualitative = inspect(set[0], viewBoxes[0]);
  assert.equal(qualitative.filter(node => node.properties.dataValue !== undefined).length, 0);
  assert.equal(qualitative.filter(node => node.tagName === 'path').length, 3);
  for (const [i, spec] of dataSpecs.entries()) {
    const nodes = inspect(set[i + 1], viewBoxes[i + 1]);
    const bars = nodes.filter(node => node.tagName === 'rect' && node.properties.dataValue !== undefined);
    assert.equal(bars.length, spec.values.length);
    bars.forEach((bar, j) => {
      const p = bar.properties;
      assert.equal(Number(p.dataValue), spec.values[j]);
      assert.equal(Number(p.x), 24, 'All bars must start at the same zero');
      assert.equal(Number(p.height), 18);
      assert(Math.abs(Number(p.width) - 400 * spec.values[j] / 60) < 1e-7, 'Width must follow the independent 0–60% scale');
    });
    const ticks = nodes.filter(node => node.tagName === 'text' && Number(node.properties.y) === (i === 0 ? 304 : 428));
    assert.deepEqual(ticks.map(node => toText(node)), ['0', '30', '60 %']);
    assert.deepEqual(ticks.map(node => Number(node.properties.x)), [24, 224, 424]);
  }
}

const csvFiles = dataSpecs.map(spec => readFileSync(new URL(`../public/data/reserves-01-${spec.file}.csv`, import.meta.url), 'utf8'));

function csvRows(text, spec) {
  // These publication CSVs deliberately contain no quoted or multiline cells.
  assert(!text.includes('"'), 'Unexpected quoted CSV field');
  const [header, ...lines] = text.trim().split(/\r?\n/u).map(line => line.split(','));
  assert.deepEqual(header, ['category', 'value', 'unit', 'reference_period', 'scope', 'measure', 'source_url', 'retrieved_on']);
  assert.equal(lines.length, spec.values.length);
  const rows = lines.map((line, i) => {
    assert.equal(line.length, header.length);
    const row = Object.fromEntries(header.map((name, j) => [name, line[j]]));
    assert.equal(row.category, spec.categories[i]);
    assert.equal(Number(row.value), spec.values[i]);
    assert.equal(row.unit, 'percent');
    assert.equal(row.reference_period, spec.period);
    assert.equal(row.scope, spec.scope);
    assert.equal(row.measure, spec.measure);
    assert.equal(row.source_url, spec.source);
    assert.equal(row.retrieved_on, '2026-10-03');
    assert.match(row.value, /^\d+(?:\.\d)?$/u);
    return row;
  });
  return rows;
}

test('Reserve figures preserve safe theme markup, accessible names and bounded legible geometry', async () => {
  for (const set of figures) {
    assert.equal(set.length, 3);
    for (const [i, svg] of set.entries()) await geometry(svg, viewBoxes[i]);
  }
});

test('EIA and SAGESS use independent zero-origin scales and identical bilingual values', () => {
  for (const set of figures) scales(set);
});

test('Published CSVs preserve source, period, scope and volume-versus-tonnage distinctions', () => {
  dataSpecs.forEach((spec, i) => csvRows(csvFiles[i], spec));
  const sagess = csvRows(csvFiles[1], dataSpecs[1]);
  const tenths = row => Math.round(Number(row.value) * 10);
  assert.equal(sagess.reduce((sum, row) => sum + tenths(row), 0), 1000);
  const refined = sagess.filter(row => row.category !== 'crude_oil').reduce((sum, row) => sum + tenths(row), 0);
  assert.equal(refined, 694);
  assert.equal(1000 - tenths(sagess.find(row => row.category === 'crude_oil')), refined);
  for (const [i, article] of articles.entries()) {
    assert(article.includes(i === 0 ? '69,4 %' : '69.4%'));
    for (const spec of dataSpecs) assert(article.includes(`/data/reserves-01-${spec.file}.csv`));
    assert(!article.includes('[[FIG') && !article.includes('—'));
  }
});

test('Tampered scales and period or source substitutions are rejected', () => {
  const badWidth = figures[0][1].replace('width="306.00000000"', 'width="300"');
  assert.notEqual(badWidth, figures[0][1]);
  assert.throws(() => scales([figures[0][0], badWidth, figures[0][2]]));
  const badZero = figures[0][1].replace('data-value="45.9" x="24"', 'data-value="45.9" x="44"');
  assert.notEqual(badZero, figures[0][1]);
  assert.throws(() => scales([figures[0][0], badZero, figures[0][2]]));
  assert.throws(() => csvRows(csvFiles[0].replace(',2025,', ',2026,'), dataSpecs[0]));
  assert.throws(() => csvRows(csvFiles[1].replace(',2024-12-31,', ',2025-12-31,'), dataSpecs[1]));
  assert.throws(() => csvRows(csvFiles[0].replace(dataSpecs[0].source, 'https://example.com/'), dataSpecs[0]));
  assert.throws(() => csvRows(csvFiles[1].replace('share of portfolio tonnage', 'share of portfolio volume'), dataSpecs[1]));
});

test('Active SVG, external assets, theme drift and labels outside their boxes are rejected', async () => {
  const svg = figures[0][0];
  for (const unsafe of [
    svg.replace('<svg ', '<svg onload="alert(1)" '),
    svg.replace('</svg>', '<script>alert(1)</script></svg>'),
    svg.replace('</svg>', '<image href="https://example.com/image.svg"/></svg>'),
    svg.replace('var(--color-signal)', '#153b70'),
    svg.replace('height:auto', 'height:900px'),
    svg.replace('var(--color-signal)', 'url(https://example.com/image.svg)'),
  ]) assert.throws(() => inspect(unsafe, viewBoxes[0]));
  await assert.rejects(geometry(svg.replace('font-size="24"', 'font-size="65"'), viewBoxes[0]));
  await assert.rejects(geometry(svg.replace('M128 140 V184', 'M128 140 V500'), viewBoxes[0]));
});
