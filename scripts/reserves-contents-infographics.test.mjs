import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { XMLValidator } from 'fast-xml-parser';
import { fromHtml } from 'hast-util-from-html';
import { toText } from 'hast-util-to-text';
import sharp from 'sharp';

const articles = ['../src/content/posts/reserves-petrolieres-brut-diesel-contenu-delais.md', '../src/content/posts-en/oil-reserves-crude-diesel-contents-delivery.md'].map(path => readFileSync(new URL(path, import.meta.url), 'utf8'));
const figures = articles.map(article => [...article.matchAll(/<svg\b[\s\S]*?<\/svg>/gu)].map(match => match[0]));
const elements = node => [node, ...(node.children ?? []).flatMap(elements)].filter(item => item.type === 'element');
const attributes = new Set(['xmlns', 'viewBox', 'role', 'ariaLabelledBy', 'lang', 'style', 'className', 'id', 'x', 'y', 'width', 'height', 'rx', 'ry', 'cx', 'cy', 'x1', 'y1', 'x2', 'y2', 'fill', 'stroke', 'strokeWidth', 'strokeLineCap', 'strokeLineJoin', 'strokeDashArray', 'd', 'fontFamily', 'fontSize', 'fontWeight', 'textAnchor', 'dataValue', 'dataScale', 'transform', 'markerEnd', 'markerWidth', 'markerHeight', 'refX', 'refY', 'orient']);
const viewBoxes = ['0 0 1120 680', '0 0 360 818', '0 0 1120 500', '0 0 360 512', '0 0 1120 620', '0 0 360 688', '0 0 1120 600', '0 0 360 888'];
const colours = {surface: '#121419', 'surface-2': '#171a20', paper: '#e7e9ee', accent: '#ff4d87', signal: '#5eead4', amber: '#f5b13d', muted: '#8b909b', 'line-strong': '#373941'};

function inspect(svg, expectedViewBox) {
  assert(!/<!DOCTYPE|<!ENTITY/iu.test(svg));
  assert.equal(XMLValidator.validate(svg), true);
  const nodes = elements(fromHtml(svg, { fragment: true }));
  assert.equal(nodes[0]?.tagName, 'svg');
  assert.equal(nodes.filter(node => node.tagName === 'svg').length, 1);
  const ids = nodes.map(node => node.properties.id).filter(Boolean);
  assert.equal(new Set(ids).size, ids.length);
  for (const node of nodes) {
    assert(['svg', 'title', 'desc', 'defs', 'marker', 'rect', 'text', 'path', 'g', 'ellipse', 'line'].includes(node.tagName));
    for (const [key, value] of Object.entries(node.properties)) {
      assert(attributes.has(key), `Unexpected SVG attribute: ${key}`);
      assert(!key.toLowerCase().startsWith('on'));
      if (key === 'style') assert.equal(node.tagName, 'svg');
      if (['fill', 'stroke'].includes(key)) assert.match(String(value), /^(?:none|var\(--color-(?:surface(?:-2)?|paper|signal|muted|accent|amber|line-strong)\))$/u);
      if (key === 'markerEnd') {
        const reference = String(value).match(/^url\(#([a-zA-Z0-9-]+)\)$/u);
        assert(reference && ids.includes(reference[1]), 'Arrows reference an internal marker');
      } else assert(!String(value).toLowerCase().includes('url('));
      if (key === 'transform') assert.match(String(value), /^translate\(\d+(?:\.\d+)? \d+(?:\.\d+)?\) scale\(\d+(?:\.\d+)?\)$/u);
    }
  }
  const root = nodes[0].properties;
  assert.equal(root.style, 'width:100%;height:auto');
  assert.equal(root.viewBox, expectedViewBox);
  assert.equal(root.role, 'img');
  assert.equal(root.ariaLabelledBy.length, 2);
  for (const [i, id] of root.ariaLabelledBy.entries()) {
    const named = nodes.filter(node => node.properties.id === id);
    assert.equal(named.length, 1);
    assert.equal(named[0].tagName, i === 0 ? 'title' : 'desc');
    assert(toText(named[0]).trim());
  }
  return nodes;
}

async function geometry(svg, expectedViewBox) {
  const nodes = inspect(svg, expectedViewBox), [, , width, height] = expectedViewBox.split(' ').map(Number), boxes = [];
  for (const node of nodes.filter(item => item.tagName === 'text')) {
    const p = node.properties, size = Number(p.fontSize), label = toText(node);
    assert(size >= (Number(p.y) <= 40 ? 12 : width === 360 ? 16 : 18), `Small label: ${label}`);
    const escaped = label.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
    const { info } = await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="4096" height="128"><text x="8" y="70" fill="white" font-family="Arial, Helvetica, sans-serif" font-size="${size}" font-weight="${p.fontWeight ?? 400}">${escaped}</text></svg>`)).trim().raw().toBuffer({ resolveWithObject: true });
    const w = info.width + 2;
    const left = Number(p.x) - (p.textAnchor === 'middle' ? w / 2 : p.textAnchor === 'end' ? w : 0);
    const box = {left, right: left + w, top: Number(p.y) - size * .9, bottom: Number(p.y) + 4, label};
    assert(box.left >= 4 && box.right <= width - 4 && box.top >= 4 && box.bottom <= height - 4, `Label leaves viewBox: ${label}`);
    for (const panel of nodes.filter(item => item.tagName === 'rect' && Number(item.properties.width) >= 140 && Number(item.properties.height) >= 70)) {
      const r = panel.properties, x = Number(r.x ?? 0), y = Number(r.y ?? 0), w = Number(r.width), h = Number(r.height);
      if (Number(p.x) > x && Number(p.x) < x + w && Number(p.y) > y && Number(p.y) < y + h) {
        assert(box.left >= x + 4 && box.right <= x + w - 4 && box.top >= y + 4 && box.bottom <= y + h - 4, `Label crosses its panel: ${label}`);
      }
    }
    boxes.push(box);
  }
  for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) {
    const a = boxes[i], b = boxes[j];
    assert(!(a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top), `Labels overlap: ${a.label} / ${b.label}`);
  }
  // Render the actual paths, marker tips and transformed icons with a transparent
  // margin. Unlike a clipped viewport this catches any painted shape outside it.
  const padded = svg.replace(expectedViewBox, `-64 -64 ${width + 128} ${height + 128}`).replace('<svg ', `<svg width="${width + 128}" height="${height + 128}" `).replace(/var\(--color-([\w-]+)\)/gu, (_, name) => colours[name]);
  const { data, info } = await sharp(Buffer.from(padded)).ensureAlpha().raw().toBuffer({resolveWithObject: true});
  for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) {
    if (x >= 64 && x < width + 64 && y >= 64 && y < height + 64) continue;
    assert.equal(data[(y * info.width + x) * info.channels + 3], 0, `Painted geometry exceeds ${expectedViewBox} at ${x},${y}`);
  }
}

function scales(set) {
  assert.equal(set.length, 8);
  for (const variant of [0, 1]) {
    const yieldBars = inspect(set[2 + variant], viewBoxes[2 + variant]).filter(node => node.properties.dataValue !== undefined);
    assert.equal(yieldBars.length, 3);
    yieldBars.forEach((bar, i) => {
      assert.equal(Number(bar.properties.dataValue), dataSpecs[0].values[i]);
      assert.equal(Number(bar.properties.dataScale), 50);
      assert.equal(Number(bar.properties.x), variant ? 18 : 363);
      assert(Math.abs(Number(bar.properties.width) - (variant ? 300 : 625) * dataSpecs[0].values[i] / 50) < 1e-7);
    });
    const mixBars = inspect(set[4 + variant], viewBoxes[4 + variant]).filter(node => node.properties.dataValue !== undefined);
    assert.equal(mixBars.length, 6);
    const mixLabels = inspect(set[4 + variant], viewBoxes[4 + variant]).filter(node => node.tagName === 'text').map(toText);
    for (const bar of mixBars) assert(mixLabels.some(label => Number(label.match(/(\d+(?:[.,]\d+)?)\s*%/u)?.[1].replace(',', '.')) === Number(bar.properties.dataValue)), 'Every composition share has a visible numeric label');
    assert.deepEqual(mixBars.map(node => Number(node.properties.dataValue)), [30.6, 69.4, 49.8, 9.1, 7.8, 2.7]);
    const totalWidth = variant ? 324 : 1036, origin = variant ? 18 : 42;
    for (let i = 0; i < 2; i++) assert(Math.abs(Number(mixBars[i].properties.width) - totalWidth * Number(mixBars[i].properties.dataValue) / 100) < 1e-7);
    assert.equal(Number(mixBars[0].properties.x), origin);
    assert(Math.abs(Number(mixBars[1].properties.x) - origin - Number(mixBars[0].properties.width)) < 1e-7);
    for (const bar of mixBars.slice(2)) {
      assert.equal(Number(bar.properties.dataScale), 50);
      assert.equal(Number(bar.properties.x), variant ? 18 : 627);
      assert(Math.abs(Number(bar.properties.width) - (variant ? 324 : 360) * Number(bar.properties.dataValue) / 50) < 1e-7);
    }
  }
}

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


test('Archive compositions remain accessible, themed and within their internal panels', async () => {
  for (const set of figures) {
    assert.equal(set.length, 8);
    for (const [i, svg] of set.entries()) await geometry(svg, viewBoxes[i]);
    const ids = set.flatMap(svg => inspect(svg, svg.match(/viewBox="([^"]+)"/u)[1]).map(node => node.properties.id).filter(Boolean));
    assert.equal(ids.length, new Set(ids).size);
  }
  const css = readFileSync(new URL('../src/styles/global.css', import.meta.url), 'utf8');
  assert(css.includes('.prose .l0g-reserves01-figure > .l0g-reserves01-mobile { display: none; }'));
  assert(css.includes('@media (max-width: 640px)'));
  assert(css.includes('.prose .l0g-reserves01-figure > .l0g-reserves01-desktop { display: none; }'));
  assert(css.includes('.prose .l0g-reserves01-figure > .l0g-reserves01-mobile { display: block; }'));
});

test('EIA and SAGESS preserve independent scales and identical data in both compositions', () => {
  for (const set of figures) scales(set);
});

test('Published CSVs preserve source, period, scope and volume-versus-tonnage distinctions', () => {
  dataSpecs.forEach((spec, i) => csvRows(csvFiles[i], spec));
  const sagess = csvRows(csvFiles[1], dataSpecs[1]);
  const tenths = row => Math.round(Number(row.value) * 10);
  assert.equal(sagess.reduce((sum, row) => sum + tenths(row), 0), 1000);
  assert.equal(sagess.filter(row => row.category !== 'crude_oil').reduce((sum, row) => sum + tenths(row), 0), 694);
  for (const [i, article] of articles.entries()) {
    assert(article.includes(i === 0 ? '69,4 %' : '69.4%'));
    for (const spec of dataSpecs) assert(article.includes(`/data/reserves-01-${spec.file}.csv`));
    assert(!article.includes('[[FIG') && !article.includes('—'));
    assert.equal((article.match(/<figure class="infographic l0g-reserves01-figure">/gu) ?? []).length, 4);
    for (const svg of figures[i].slice(6)) assert(svg.includes(i ? '100m barrels pledged' : '100 M barils annoncés'));
  }
});

test('Tampered scales, dates and source substitutions are rejected', () => {
  const badWidth = figures[0][2].replace('width="573.75"', 'width="560"');
  assert.notEqual(badWidth, figures[0][2]);
  assert.throws(() => scales(figures[0].map((svg, i) => i === 2 ? badWidth : svg)));
  const badZero = figures[0][2].replace('x="363" y="209"', 'x="400" y="209"');
  assert.notEqual(badZero, figures[0][2]);
  assert.throws(() => scales(figures[0].map((svg, i) => i === 2 ? badZero : svg)));
  const missingLabel = figures[0][5].replace(/<text[^>]*>2,7 %<\/text>/u, '');
  assert.notEqual(missingLabel, figures[0][5]);
  assert.throws(() => scales(figures[0].map((svg, i) => i === 5 ? missingLabel : svg)));
  assert.throws(() => csvRows(csvFiles[0].replace(',2025,', ',2026,'), dataSpecs[0]));
  assert.throws(() => csvRows(csvFiles[1].replace(',2024-12-31,', ',2025-12-31,'), dataSpecs[1]));
  assert.throws(() => csvRows(csvFiles[0].replace(dataSpecs[0].source, 'https://example.com/'), dataSpecs[0]));
  assert.throws(() => csvRows(csvFiles[1].replace('share of portfolio tonnage', 'share of portfolio volume'), dataSpecs[1]));
});

test('Active content, external marker references, theme drift and geometry regressions are rejected', async () => {
  const svg = figures[0][0];
  for (const unsafe of [
    svg.replace('<svg ', '<svg onload="alert(1)" '),
    svg.replace('</svg>', '<script>alert(1)</script></svg>'),
    svg.replace('</svg>', '<image href="https://example.com/image.svg"/></svg>'),
    svg.replace('var(--color-signal)', '#153b70'),
    svg.replace('height:auto', 'height:900px'),
    svg.replace('url(#', 'url(https://example.com/#'),
    svg.replace('var(--color-signal)', 'url(https://example.com/image.svg)'),
  ]) assert.throws(() => inspect(unsafe, viewBoxes[0]));
  await assert.rejects(geometry(svg.replace('font-size="32"', 'font-size="90"'), viewBoxes[0]));
  // A label can stay inside the overall canvas yet cross its intended card.
  await assert.rejects(geometry(svg.replace('x="156" y="219"', 'x="450" y="219"'), viewBoxes[0]));
  // A transformed icon outside the canvas must not pass through viewport clipping.
  await assert.rejects(geometry(svg.replace('translate(65 196)', 'translate(1165 196)'), viewBoxes[0]));
});
