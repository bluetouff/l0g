import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { XMLValidator } from 'fast-xml-parser';
import { fromHtml } from 'hast-util-from-html';
import { toText } from 'hast-util-to-text';
import postcss from 'postcss';
import sharp from 'sharp';

const publications = [
  ['fr', '../src/content/posts/reserves-petrolieres-propriete-sagess-financement.md'],
  ['en', '../src/content/posts-en/france-oil-reserves-ownership-sagess-funding.md'],
].map(([language, path]) => ({ language, article: readFileSync(new URL(path, import.meta.url), 'utf8') }));
const css = readFileSync(new URL('../src/styles/reserves-ownership-infographics.css', import.meta.url), 'utf8');
const globalCss = readFileSync(new URL('../src/styles/global.css', import.meta.url), 'utf8');
const delegationCsv = readFileSync(new URL('../public/data/reserves-02-delegation.csv', import.meta.url), 'utf8');
const maturityCsv = readFileSync(new URL('../public/data/reserves-02-sagess-maturities-2025.csv', import.meta.url), 'utf8');
// Values independently verified against legal alternatives and the 2025 accounts.
const obligationAlternatives = [[44, 56], [10, 90]];
const maturityAmounts = [500, 600, 500, 500, 500, 1000];
const maturityYears = [2027, 2028, 2029, 2030, 2031, 2032];
const viewBoxes = [['0 0 960 650', '0 0 480 620'], ['0 0 960 560', '0 0 480 550'], ['0 0 960 650', '0 0 480 620'], ['0 0 960 650', '0 0 480 620']];
const sourceAnchors = [[3, 2, 4, 15], [6, 5], [2], [7, 9]].map(ids => ids.map(id => `#source-s${String(id).padStart(2, '0')}`));
const attributes = new Set('xmlns viewBox role ariaLabelledBy style id lang x y width height rx ry cx cy r x1 x2 y1 y2 fill stroke strokeWidth strokeDashArray strokeLineCap strokeLineJoin d transform fontFamily fontSize fontWeight textAnchor dataValue dataYear dataUnit dataCoverage dataShare dataArrangement dataPercentage dataCard dataConnector dataIcon'.split(' '));
const paint = /^(?:none|var\(--color-(?:ink|surface|surface-2|paper|muted|signal|accent|amber|topic-blue|line-strong)\))$/u;
const elements = node => [node, ...(node.children ?? []).flatMap(elements)].filter(item => item.type === 'element');
const normalise = text => text.replace(/\s+/gu, ' ').trim();
const numberLabel = text => Number(normalise(text).replace(/[ ,%]/gu, ''));
const textOf = nodes => normalise(nodes.filter(node => node.tagName === 'text').map(node => toText(node)).join(' '));
const near = (actual, expected, message) => assert(Math.abs(Number(actual) - expected) < 1e-7, message);

function checkCss(text) {
  const tree = postcss.parse(text);
  const contracts = [
    ['.prose figure.l0g-reserves02-figure', { width: '100%', 'max-width': '48rem', margin: '2rem auto', 'padding-bottom': '1.25rem' }],
    ['.l0g-reserves02-figure .rsv02-wide', { display: 'block' }],
    ['.l0g-reserves02-figure .rsv02-mobile', { display: 'none' }],
    ['.l0g-reserves02-figure svg', { display: 'block', width: '100%', height: 'auto' }],
  ];
  const checkRules = (nodes, expected) => {
    const rules = nodes.filter(node => node.type !== 'comment');
    assert.equal(rules.length, expected.length);
    rules.forEach((rule, i) => {
      assert.equal(rule.type, 'rule');
      assert.equal(rule.selector, expected[i][0]);
      const declarations = rule.nodes.filter(node => node.type !== 'comment');
      assert(declarations.every(node => node.type === 'decl' && !node.important));
      assert.equal(declarations.length, Object.keys(expected[i][1]).length);
      assert.deepEqual(Object.fromEntries(declarations.map(node => [node.prop, node.value])), expected[i][1]);
    });
  };
  const root = tree.nodes.filter(node => node.type !== 'comment');
  assert.equal(root.length, 5);
  checkRules(root.slice(0, 4), contracts);
  const mobile = root[4];
  assert.equal(mobile.type, 'atrule');
  assert.equal(mobile.name, 'media');
  assert.equal(mobile.params, '(max-width: 640px)');
  checkRules(mobile.nodes, [
    ['.prose figure.l0g-reserves02-figure', { 'max-width': '24rem' }],
    ['.l0g-reserves02-figure .rsv02-wide', { display: 'none' }],
    ['.l0g-reserves02-figure .rsv02-mobile', { display: 'block' }],
  ]);
}

function figureFragments(article) {
  const fragments = [...article.matchAll(/<figure\b[\s\S]*?<\/figure>/gu)].map(match => match[0]);
  assert.equal(fragments.length, 4);
  assert.equal([...article.matchAll(/<svg\b/gu)].length, 8);
  return fragments;
}

function figureParts(fragment, index) {
  const nodes = elements(fromHtml(fragment, { fragment: true }));
  assert.equal(nodes[0].tagName, 'figure');
  assert.deepEqual(nodes[0].properties.className, ['infographic', 'l0g-reserves02-figure']);
  assert.equal(nodes[0].properties.style, undefined, 'Sizing follows the shared responsive stylesheet');
  const wrappers = nodes[0].children.filter(node => node.type === 'element' && node.tagName === 'div');
  assert.equal(wrappers.length, 2);
  wrappers.forEach((node, i) => {
    assert.deepEqual(node.properties.className, [i === 0 ? 'rsv02-wide' : 'rsv02-mobile']);
    assert.equal(elements(node).filter(child => child.tagName === 'svg').length, 1);
  });
  const svgs = [...fragment.matchAll(/<svg\b[\s\S]*?<\/svg>/gu)].map(match => match[0]);
  assert.equal(svgs.length, 2);
  const captions = nodes.filter(node => node.tagName === 'figcaption');
  assert.equal(captions.length, 1);
  for (const href of sourceAnchors[index]) assert(nodes.some(node => node.tagName === 'a' && node.properties.href === href), `Missing source: ${href}`);
  return { svgs, caption: normalise(toText(captions[0])), nodes };
}

function staticTransform(value) {
  const match = /^translate\((\d+(?:\.\d+)?) (\d+(?:\.\d+)?)\) scale\((\d+(?:\.\d+)?)\)$/u.exec(value);
  assert(match, 'Icons use a controlled static translation and uniform scale');
  const [x, y, scale] = match.slice(1).map(Number);
  assert([x, y, scale].every(Number.isFinite) && scale > 0 && scale <= 2);
  return { x, y, scale };
}

function positioned(root, matrix = { x: 0, y: 0, scale: 1 }) {
  let current = matrix;
  if (root.properties?.transform) {
    const own = staticTransform(root.properties.transform);
    current = { x: matrix.x + own.x * matrix.scale, y: matrix.y + own.y * matrix.scale, scale: matrix.scale * own.scale };
  }
  return [{ node: root, matrix: current }, ...(root.children ?? []).filter(node => node.type === 'element').flatMap(node => positioned(node, current))];
}

function inspect(svg, index, variant, language) {
  assert(!/<!DOCTYPE|<!ENTITY|<\?/iu.test(svg));
  assert.equal(XMLValidator.validate(svg), true, 'SVG must be valid XML');
  const nodes = elements(fromHtml(svg, { fragment: true }));
  assert.equal(nodes[0]?.tagName, 'svg');
  assert.equal(nodes.filter(node => node.tagName === 'svg').length, 1);
  const ids = new Set();
  for (const node of nodes) {
    assert(['svg', 'title', 'desc', 'g', 'path', 'circle', 'ellipse', 'line', 'rect', 'text'].includes(node.tagName), `Unsafe SVG element: ${node.tagName}`);
    for (const [name, value] of Object.entries(node.properties)) {
      assert(attributes.has(name), `Unexpected SVG attribute: ${name}`);
      assert(!name.toLowerCase().startsWith('on') && !String(value).toLowerCase().includes('url('));
      if (name === 'style') assert.equal(node.tagName, 'svg');
      if (['fill', 'stroke'].includes(name)) assert.match(String(value), paint, 'Use native semantic l0g paint');
      if (name === 'transform') { assert.equal(node.tagName, 'g'); staticTransform(value); }
      if (name === 'fontFamily') assert.equal(value, 'Arial, Helvetica, sans-serif');
      if (name === 'strokeWidth') assert(Number.isFinite(Number(value)) && Number(value) > 0 && Number(value) <= 4);
      if (name === 'strokeDashArray') {
        assert(Array.isArray(value) && value.length > 0);
        assert(value.every(part => /^\d+(?:\.\d+)?$/u.test(String(part)) && Number(part) >= 0));
      }
      if (name === 'strokeLineCap') assert.equal(value, 'round');
      if (name === 'strokeLineJoin') assert.equal(value, 'round');
      if (name === 'id') { assert(!ids.has(value)); ids.add(value); }
    }
    if (node.tagName === 'text') assert.match(String(node.properties.fill), paint);
  }
  const root = nodes[0].properties;
  assert.equal(root.xmlns, 'http://www.w3.org/2000/svg');
  assert.equal(root.viewBox, viewBoxes[index][variant]);
  assert.equal(root.lang, language);
  assert.equal(root.style, 'width:100%;height:auto');
  assert.equal(root.role, 'img');
  assert(Array.isArray(root.ariaLabelledBy) && root.ariaLabelledBy.length === 2);
  root.ariaLabelledBy.forEach((id, i) => {
    const named = nodes.filter(node => node.properties.id === id);
    assert.equal(named.length, 1);
    assert.equal(named[0].tagName, i === 0 ? 'title' : 'desc');
    assert(normalise(toText(named[0])));
  });
  return nodes;
}

function pathPoints(d) {
  assert.match(d, /^[MLHVQZ\d.\s+-]+$/u, 'Controlled absolute straight and quadratic paths only');
  const tokens = d.match(/[MLHVQZ]|[-+]?(?:\d+(?:\.\d*)?|\.\d+)/gu) ?? [];
  const points = [];
  let x = 0, y = 0, command;
  for (let i = 0; i < tokens.length;) {
    if (/^[MLHVQZ]$/u.test(tokens[i])) command = tokens[i++];
    assert(command);
    if (command === 'Z') { command = undefined; continue; }
    const count = command === 'Q' ? 4 : ['M', 'L'].includes(command) ? 2 : 1;
    assert(i + count <= tokens.length && !tokens.slice(i, i + count).some(value => /^[MLHVQZ]$/u.test(value)));
    const values = tokens.slice(i, i + count).map(Number);
    assert(values.every(Number.isFinite));
    if (count === 4) { points.push([values[0], values[1]]); [x, y] = values.slice(2); }
    else if (count === 2) [x, y] = values;
    else if (command === 'H') x = values[0];
    else y = values[0];
    points.push([x, y]); i += count;
    if (command === 'M') command = 'L';
  }
  return points;
}

const labelMetrics = new Map();
async function geometry(svg, index, variant, language) {
  const nodes = inspect(svg, index, variant, language);
  const [, , width, height] = viewBoxes[index][variant].split(' ').map(Number);
  const labels = [];
  const overlap = (a, b) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
  for (const { node, matrix } of positioned(nodes[0])) {
    const p = node.properties;
    const project = ([x, y]) => [matrix.x + x * matrix.scale, matrix.y + y * matrix.scale];
    const inside = point => assert(point.every(Number.isFinite) && point[0] >= 0 && point[0] <= width && point[1] >= 0 && point[1] <= height, `${node.tagName} leaves viewBox`);
    if (node.tagName === 'path') pathPoints(p.d).map(project).forEach(inside);
    if (node.tagName === 'line') [[Number(p.x1), Number(p.y1)], [Number(p.x2), Number(p.y2)]].map(project).forEach(inside);
    if (['rect', 'circle', 'ellipse'].includes(node.tagName)) {
      let x, y, w, h;
      if (node.tagName === 'rect') { x = Number(p.x ?? 0); y = Number(p.y ?? 0); w = Number(p.width); h = Number(p.height); }
      else { const rx = Number(p.r ?? p.rx), ry = Number(p.r ?? p.ry); x = Number(p.cx) - rx; y = Number(p.cy) - ry; w = 2 * rx; h = 2 * ry; }
      assert([x, y, w, h].every(Number.isFinite) && w >= 0 && h >= 0);
      [project([x, y]), project([x + w, y + h])].forEach(inside);
    }
    if (node.tagName !== 'text') continue;
    const size = Number(p.fontSize), label = toText(node), key = `${size}/${p.fontWeight}/${p.textAnchor}/${label}`;
    assert(Number.isFinite(size) && size >= 18 && size <= 48);
    assert([400, 600, 700].includes(Number(p.fontWeight)));
    assert(['start', 'middle', 'end'].includes(p.textAnchor));
    if (!labelMetrics.has(key)) {
      const escaped = label.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
      const { info } = await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="8192" height="128"><text x="4096" y="70" fill="white" font-family="Arial, Helvetica, sans-serif" font-size="${size}" font-weight="${p.fontWeight}" text-anchor="${p.textAnchor}">${escaped}</text></svg>`)).trim().raw().toBuffer({ resolveWithObject: true });
      const left = -info.trimOffsetLeft - 4096, top = -info.trimOffsetTop - 70;
      assert([left, top, info.width, info.height].every(Number.isFinite));
      labelMetrics.set(key, { left, right: left + info.width, top, bottom: top + info.height });
    }
    const measured = labelMetrics.get(key), [x, y] = project([Number(p.x), Number(p.y)]);
    const box = { left: x + measured.left * matrix.scale - 1, right: x + measured.right * matrix.scale + 1, top: y + measured.top * matrix.scale - 1, bottom: y + measured.bottom * matrix.scale + 1, label, node };
    assert(box.left >= 3 && box.right <= width - 3 && box.top >= 3 && box.bottom <= height - 3, `Label leaves safe viewBox: ${label}`);
    labels.push(box);
  }
  for (let i = 0; i < labels.length; i++) for (let j = i + 1; j < labels.length; j++) assert(!overlap(labels[i], labels[j]), `Labels overlap: ${labels[i].label} / ${labels[j].label}`);
  for (const rect of nodes.filter(node => node.tagName === 'rect' && (node.properties.dataValue !== undefined || node.properties.dataUnit !== undefined))) {
    const p = rect.properties, box = { left: Number(p.x), right: Number(p.x) + Number(p.width), top: Number(p.y), bottom: Number(p.y) + Number(p.height) };
    for (const label of labels) {
      if (label.node.properties.dataPercentage !== undefined && Number(label.node.properties.dataPercentage) === Number(p.dataValue)) {
        assert(label.left >= box.left && label.right <= box.right && label.top >= box.top && label.bottom <= box.bottom, 'Percent label fits its segment');
      } else assert(!overlap(label, box), `Data shape crosses label: ${label.label}`);
    }
  }
  for (const card of nodes.filter(node => node.tagName === 'rect' && node.properties.dataCard)) {
    const p = card.properties;
    for (const label of labels.filter(label => Number(label.node.properties.x) >= Number(p.x) && Number(label.node.properties.x) <= Number(p.x) + Number(p.width) && Number(label.node.properties.y) > Number(p.y) && Number(label.node.properties.y) < Number(p.y) + Number(p.height))) {
      assert(label.left >= Number(p.x) + 4 && label.right <= Number(p.x) + Number(p.width) - 4 && label.top >= Number(p.y) + 3 && label.bottom <= Number(p.y) + Number(p.height) - 3, `Label leaves its card: ${label.label}`);
    }
  }
}

function circuits(svg, variant, language) {
  const nodes = inspect(svg, 0, variant, language);
  assert.equal(nodes.filter(node => node.properties.dataCard === 'actor').length, 4);
  assert.deepEqual(nodes.filter(node => node.properties.dataIcon).map(node => node.properties.dataIcon).sort(), ['depot', 'document', 'state', 'truck']);
  assert(nodes.filter(node => node.properties.dataConnector === 'true').length >= 14);
  assert(!nodes.some(node => node.properties.dataValue !== undefined));
  const text = textOf(nodes);
  for (const actor of ['DGEC', 'SAGESS', 'CPSSP', language === 'fr' ? 'Prêteurs' : 'Lenders', language === 'fr' ? 'Opérateurs' : 'Operators']) assert(text.includes(actor));
  assert.match(text, language === 'fr' ? /Fonds contre dette/u : /Funds against debt|Debt financing/u);
}

function delegation(svg, variant, language) {
  const nodes = inspect(svg, 1, variant, language);
  const bars = nodes.filter(node => node.tagName === 'rect' && node.properties.dataValue !== undefined);
  assert.equal(bars.length, 4);
  const ticks = nodes.filter(node => node.tagName === 'text' && /^(?:0|25|50|75|100%)$/u.test(normalise(toText(node))));
  assert.deepEqual(ticks.map(node => numberLabel(toText(node))), [0, 25, 50, 75, 100]);
  const zero = Number(ticks[0].properties.x), full = Number(ticks.at(-1).properties.x) - zero;
  assert(full > 0);
  ticks.forEach((tick, i) => near(tick.properties.x, zero + full * i / 4, 'Linear zero-origin percent axis'));
  obligationAlternatives.forEach(([direct, delegated], i) => {
    const row = bars.filter(node => node.properties.dataArrangement === (i === 0 ? 'A' : 'B'));
    assert.equal(row.length, 2);
    assert.deepEqual(row.map(node => node.properties.dataShare), ['delegated', 'direct']);
    row.forEach((bar, j) => {
      const value = j === 0 ? delegated : direct;
      assert.equal(Number(bar.properties.dataValue), value);
      near(bar.properties.width, full * value / 100, 'Legal percentage determines area');
      near(bar.properties.x, zero + (j === 0 ? 0 : full * delegated / 100), 'No truncation or repeated zero');
      assert.equal(bar.properties.fill, j === 0 ? 'var(--color-signal)' : 'var(--color-accent)');
      const label = nodes.find(node => node.tagName === 'text' && Number(node.properties.dataPercentage) === value);
      assert(label && numberLabel(toText(label)) === value, 'Visible percentage matches segment data');
    });
    near(row[0].properties.y, Number(row[1].properties.y));
    assert.equal(direct + delegated, 100);
  });
  assert.equal(nodes.filter(node => node.properties.dataCard === 'coverage').length, 2);
  assert.match(textOf(nodes), /obligation\s*=\s*100\s*%/u);
}

function finance(svg, variant, language) {
  const nodes = inspect(svg, 2, variant, language);
  const bars = nodes.filter(node => node.tagName === 'rect' && node.properties.dataYear !== undefined);
  assert.equal(bars.length, 6);
  assert.deepEqual(bars.map(node => Number(node.properties.dataYear)), maturityYears);
  assert.deepEqual(bars.map(node => Number(node.properties.dataValue)), maturityAmounts);
  const firstX = Math.min(...bars.map(node => Number(node.properties.x))), endX = Math.max(...bars.map(node => Number(node.properties.x) + Number(node.properties.width) / 2));
  const grid = nodes.filter(node => node.tagName === 'line' && Number(node.properties.y1) === Number(node.properties.y2) && Number(node.properties.x1) <= firstX && Number(node.properties.x2) >= endX).sort((a, b) => Number(b.properties.y1) - Number(a.properties.y1));
  assert.equal(grid.length, 3);
  const zero = Number(grid[0].properties.y1), height = zero - Number(grid[2].properties.y1);
  assert(height > 0);
  near(grid[1].properties.y1, zero - height / 2, 'Linear 0/500/1000 axis');
  grid.forEach((line, i) => assert(nodes.some(node => node.tagName === 'text' && node.properties.textAnchor === 'end' && Number(node.properties.x) < firstX && numberLabel(toText(node)) === i * 500 && Math.abs(Number(node.properties.y) - Number(line.properties.y1)) <= 18), 'Each gridline has the correct numeric tick'));
  bars.forEach((bar, i) => {
    near(bar.properties.height, height * maturityAmounts[i] / 1000, 'Principal follows the labelled linear axis');
    near(Number(bar.properties.y) + Number(bar.properties.height), zero, 'Every maturity starts at zero');
    const centre = Number(bar.properties.x) + Number(bar.properties.width) / 2;
    assert(nodes.some(node => node.tagName === 'text' && Number(node.properties.x) === centre && numberLabel(toText(node)) === maturityYears[i] && Number(node.properties.y) > zero));
    assert(nodes.some(node => node.tagName === 'text' && Number(node.properties.x) === centre && numberLabel(toText(node)) === maturityAmounts[i] && Number(node.properties.y) < Number(bar.properties.y)));
  });
  assert.equal(maturityAmounts.reduce((sum, value) => sum + value, 0), 3600);
  assert.equal(3600 + 545, 4145);
  const text = textOf(nodes).replace(/[ ,]/gu, '');
  for (const number of ['4145', '3600', '545', '1000']) assert(text.includes(number));
  assert.match(textOf(nodes), language === 'fr' ? /31 décembre 2025/u : /31 December 2025/u);
  assert.match(textOf(nodes), language === 'fr' ? /Hors prêt CPSSP et intérêts/u : /Excludes CPSSP loan and interest/u);
  assert.match(textOf(nodes), language === 'fr' ? /non tiré/u : /Undrawn/u);
  assert.match(textOf(nodes), language === 'fr' ? /[Ss]éparé/u : /[Ss]eparate/u);
}

function ticket(svg, variant, language) {
  const nodes = inspect(svg, 3, variant, language);
  const tiles = nodes.filter(node => node.tagName === 'rect' && node.properties.dataUnit !== undefined);
  assert.equal(tiles.length, 100, 'A single 100-tonne lot');
  assert(tiles.every(node => Number(node.properties.dataUnit) === 1));
  assert.equal(tiles.reduce((sum, node) => sum + Number(node.properties.dataUnit), 0), 100);
  assert.equal(tiles.filter(node => node.properties.dataCoverage === 'A').length, 70);
  assert.equal(tiles.filter(node => node.properties.dataCoverage === 'B').length, 30);
  const occupied = new Set();
  for (const tile of tiles) {
    assert(['A', 'B'].includes(tile.properties.dataCoverage));
    assert.equal(tile.properties.fill, tile.properties.dataCoverage === 'A' ? 'var(--color-signal)' : 'var(--color-amber)');
    near(tile.properties.width, Number(tiles[0].properties.width));
    near(tile.properties.height, Number(tiles[0].properties.height));
    const key = `${tile.properties.x}/${tile.properties.y}`;
    assert(!occupied.has(key), 'Units occupy distinct cells'); occupied.add(key);
  }
  const text = textOf(nodes);
  assert.match(text, language === 'fr' ? /Exemple fictif/u : /Fictional example/u);
  assert.match(text, /70\s*\+\s*30\s*=\s*100/u);
  assert.match(text, language === 'fr' ? /(?:[Pp]ropriétaire|Propriété)(?: du produit)?\s*:\s*A/u : /(?:[Pp]roduct owner|Owner)\s*:\s*A/u);
  assert.match(text, language === 'fr' ? /1 case = 1 tonne physique/u : /1 square = 1 physical tonne/u);
  assert.match(text, language === 'fr' ? /B paie la réservation à A/u : /B pays A to reserve/u);
  assert.match(text, language === 'fr' ? /A garde 30 t disponibles pour B/u : /A keeps 30 t available for B/u);
}

function csvTable(text, expectedHeader) {
  // Bounded one-line publication records; quoted commas and doubled quotes are supported.
  const lines = text.trim().split(/\r?\n/u);
  const cells = line => {
    const fields = [];
    let value = '', quoted = false, closed = false;
    for (let i = 0; i <= line.length; i++) {
      const c = line[i];
      if (quoted) {
        if (c === '"' && line[i + 1] === '"') { value += '"'; i++; }
        else if (c === '"') { quoted = false; closed = true; }
        else { assert(c !== undefined, 'Unclosed CSV quote'); value += c; }
      } else if (c === ',' || c === undefined) { fields.push(value); value = ''; closed = false; }
      else if (c === '"') { assert(value === '' && !closed, 'Quote must start a CSV cell'); quoted = true; }
      else { assert(!closed, 'Characters after closing CSV quote'); value += c; }
    }
    return fields;
  };
  assert.deepEqual(cells(lines[0]), expectedHeader, 'CSV header preserves units and meaning');
  return lines.slice(1).map(line => {
    const values = cells(line);
    assert.equal(values.length, expectedHeader.length);
    return Object.fromEntries(expectedHeader.map((name, i) => [name, values[i]]));
  });
}

function checkDelegationCsv(text) {
  const rows = csvTable(text, ['reviewed_at', 'arrangement', 'direct_obligation_percent', 'delegated_cpssp_percent', 'scope', 'source']);
  assert.equal(rows.length, 2);
  rows.forEach((row, i) => {
    assert.equal(row.reviewed_at, '2026-10-03');
    assert.equal(row.arrangement, obligationAlternatives[i].join('/'));
    assert.match(row.direct_obligation_percent, /^\d+$/u);
    assert.match(row.delegated_cpssp_percent, /^\d+$/u);
    assert.deepEqual([Number(row.direct_obligation_percent), Number(row.delegated_cpssp_percent)], obligationAlternatives[i]);
    assert.equal(Number(row.direct_obligation_percent) + Number(row.delegated_cpssp_percent), 100);
    assert.match(row.scope, /^Approved operators in metropolitan France; obligation normalised to\s*100 percent; not physical stock shares$/u);
    assert.equal(row.source, 'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000031946331');
  });
  return rows;
}

function checkMaturityCsv(text) {
  const rows = csvTable(text, ['reference_date', 'year_of_maturity', 'bond_principal_EUR_million', 'scope', 'source', 'source_page', 'retrieved_at']);
  assert.equal(rows.length, 6);
  rows.forEach((row, i) => {
    assert.equal(row.reference_date, '2025-12-31');
    assert.match(row.year_of_maturity, /^\d{4}$/u);
    assert.equal(Number(row.year_of_maturity), maturityYears[i]);
    assert.match(row.bond_principal_EUR_million, /^\d+$/u);
    assert.equal(Number(row.bond_principal_EUR_million), maturityAmounts[i]);
    assert.equal(row.scope, 'SAGESS outstanding bonds; excludes commercial paper, interest and 2026 issue');
    const source = new URL(row.source);
    assert.equal(source.protocol, 'https:');
    assert.equal(source.hostname, 'www.sagess.fr');
    assert.equal(source.username + source.password, '');
    assert.match(source.pathname, /^\/(?:fr|en)\/file\/\d+\/download$|^\/sites\/default\/files\/.+\.pdf$/u);
    assert.equal(row.source_page, '61');
    assert.equal(row.retrieved_at, '2026-10-03');
  });
  assert.equal(rows.reduce((sum, row) => sum + Number(row.bond_principal_EUR_million), 0), 3600);
  return rows;
}

function fundingText(article, language) {
  const paragraph = article.split(/\n\s*\n/u).find(text => language === 'fr' ? text.includes('endettement externe') : text.includes('external debt'));
  assert(paragraph, 'External-debt amounts remain present in the article');
  const text = normalise(paragraph.replaceAll('**', ''));
  assert.match(text, language === 'fr' ? /4,145 milliards d’euros d’endettement externe/u : /€4\.145 billion of external debt/u);
  assert.match(text, language === 'fr' ? /3,6 milliards d’obligations/u : /€3\.6 billion of bonds/u);
  assert.match(text, language === 'fr' ? /545 millions de billets de trésorerie/u : /€545 million of commercial paper/u);
  assert.match(text, language === 'fr' ? /hors prêt du CPSSP et hors intérêts dus/u : /excluding the CPSSP loan and interest payable/u);
  assert.match(text, language === 'fr' ? /31 décembre 2025/u : /31 December 2025/u);
}

function change(text, before, after) {
  assert(text.includes(before), `Mutation must match input: ${before}`);
  return text.replace(before, after);
}
function rejectsMutation(check, source, before, after) {
  const edited = change(source, before, after);
  assert.throws(() => check(edited));
}

function checkCaptions(fragment, index, language) {
  const { caption, nodes } = figureParts(fragment, index);
  if (index === 0) {
    assert.match(caption, language === 'fr' ? /8 avril 2026/u : /8 April 2026/u);
    assert.match(caption, language === 'fr' ? /ni délai ni volume/u : /neither delivery times nor volumes/u);
  } else if (index === 1) {
    assert.match(caption, language === 'fr' ? /obligation est normalisée à 100 %/u : /obligation is normalised to 100%/u);
    assert.match(caption, language === 'fr' ? /ni la propriété ni le contenu physique/u : /without measuring ownership or physical reserve contents/u);
    assert(nodes.some(node => node.properties.href === '/data/reserves-02-delegation.csv'));
  } else if (index === 2) {
    assert.match(caption, language === 'fr' ? /31 décembre 2025/u : /31 December 2025/u);
    assert.match(caption, /545/u);
    assert.match(caption, language === 'fr' ? /ligne bancaire de 1 Md€ était inutilisée/u : /€1bn bank facility was undrawn/u);
    assert.match(caption, language === 'fr' ? /2026 est postérieure/u : /2026 issue falls after/u);
    assert(nodes.some(node => node.properties.href === '/data/reserves-02-sagess-maturities-2025.csv'));
  } else {
    assert.match(caption, language === 'fr' ? /sans correspondance avec un contrat observé/u : /not an observed contract/u);
    assert.match(caption, language === 'fr' ? /un seul stock/u : /one physical stock/u);
  }
}

test('Four restored figures preserve safe, accessible, bounded and legible wide/mobile SVG compositions', async () => {
  const ids = [];
  for (const { article, language } of publications) for (const [index, fragment] of figureFragments(article).entries()) {
    checkCaptions(fragment, index, language);
    for (const [variant, svg] of figureParts(fragment, index).svgs.entries()) {
      ids.push(...inspect(svg, index, variant, language).filter(node => node.properties.id).map(node => node.properties.id));
      await geometry(svg, index, variant, language);
    }
  }
  assert.equal(new Set(ids).size, ids.length);
});

test('Responsive CSS chooses one compact composition with bounded layout and no external or active declarations', () => {
  checkCss(css);
  assert(postcss.parse(globalCss).nodes.some(node => node.type === 'atrule' && node.name === 'import' && node.params === "'./reserves-ownership-infographics.css'"));
  rejectsMutation(checkCss, css, '48rem', '88rem');
  rejectsMutation(checkCss, css, '24rem', '60rem');
  rejectsMutation(checkCss, css, '640px', '2400px');
  rejectsMutation(checkCss, css, 'height: auto', 'height: 1800px');
  assert.throws(() => checkCss(css + '\n@import url(https://example.com/a.css);'));
});

test('Circuit actors, named financial mechanisms and normalized 56/44 or 90/10 legal alternatives are preserved', () => {
  for (const { article, language } of publications) {
    const figures = figureFragments(article);
    figureParts(figures[0], 0).svgs.forEach((svg, variant) => circuits(svg, variant, language));
    figureParts(figures[1], 1).svgs.forEach((svg, variant) => delegation(svg, variant, language));
  }
  checkDelegationCsv(delegationCsv);
});

test('Six historical maturities total 3600 EUR million and external debt adds only 545 of commercial paper', () => {
  for (const { article, language } of publications) {
    figureParts(figureFragments(article)[2], 2).svgs.forEach((svg, variant) => finance(svg, variant, language));
    fundingText(article, language);
  }
  checkMaturityCsv(maturityCsv);
});

test('Every fictional waffle contains one physical lot of 100 one-tonne cells covering 70 for A and 30 for B', () => {
  for (const { article, language } of publications) figureParts(figureFragments(article)[3], 3).svgs.forEach((svg, variant) => ticket(svg, variant, language));
});

test('Wrong legal ratios, maturity scales or dates and ticket double-counting fail independently of generated graphics', () => {
  const figures = figureFragments(publications[0].article);
  const delegated = figureParts(figures[1], 1).svgs[0];
  rejectsMutation(svg => delegation(svg, 0, 'fr'), delegated, 'data-value="56"', 'data-value="57"');
  rejectsMutation(svg => delegation(svg, 0, 'fr'), delegated, 'width="425.6"', 'width="400"');
  rejectsMutation(svg => delegation(svg, 0, 'fr'), delegated, '>100%</text>', '>90%</text>');
  const funded = figureParts(figures[2], 2).svgs[0];
  rejectsMutation(svg => finance(svg, 0, 'fr'), funded, 'height="75.0"', 'height="80"');
  rejectsMutation(svg => finance(svg, 0, 'fr'), funded, 'data-year="2027"', 'data-year="2026"');
  rejectsMutation(svg => finance(svg, 0, 'fr'), funded, '>2027</text>', '>2026</text>');
  rejectsMutation(svg => finance(svg, 0, 'fr'), funded, '>4 145 M€</text>', '>5 145 M€</text>');
  const waffle = figureParts(figures[3], 3).svgs[0];
  rejectsMutation(svg => ticket(svg, 0, 'fr'), waffle, 'data-unit="1"', 'data-unit="2"');
  rejectsMutation(svg => ticket(svg, 0, 'fr'), waffle, 'data-coverage="A"', 'data-coverage="B"');
  rejectsMutation(svg => ticket(svg, 0, 'fr'), waffle, '>70 + 30 = 100</text>', '>70 + 30 = 200</text>');
  rejectsMutation(svg => ticket(svg, 0, 'fr'), waffle, '>Exemple fictif ·', '>Stock SAGESS observé ·');
});

test('CSV changes to amount, year, units, perimeter and official source fail; changing a SAGESS access token is permitted', () => {
  rejectsMutation(checkDelegationCsv, delegationCsv, ',44,56,', ',45,56,');
  rejectsMutation(checkDelegationCsv, delegationCsv, 'direct_obligation_percent', 'direct_stock_tonnes');
  rejectsMutation(checkDelegationCsv, delegationCsv, '2026-10-03', '2025-10-03');
  rejectsMutation(checkDelegationCsv, delegationCsv, 'not physical stock shares', 'physical stock shares');
  rejectsMutation(checkMaturityCsv, maturityCsv, ',2032,1000,', ',2033,1000,');
  rejectsMutation(checkMaturityCsv, maturityCsv, '2025-12-31', '2026-12-31');
  rejectsMutation(checkMaturityCsv, maturityCsv, 'bond_principal_EUR_million', 'bond_principal_EUR_billion');
  rejectsMutation(checkMaturityCsv, maturityCsv, 'excludes commercial paper, interest and 2026 issue', 'includes undrawn bank facilities');
  rejectsMutation(checkMaturityCsv, maturityCsv, 'https://www.sagess.fr/', 'https://example.com/');
  rejectsMutation(article => fundingText(article, 'fr'), publications[0].article, '4,145 milliards', '5,145 milliards');
  checkMaturityCsv(maturityCsv.replace(/https:\/\/www\.sagess\.fr\/[^,\r\n]+/gu, 'https://www.sagess.fr/fr/file/98956/download?token=changed'));
  assert.throws(() => csvTable('a,b\n"unclosed,b', ['a', 'b']));
});

test('Active SVG, unsafe transforms, external assets, palette drift and overflowing or tiny labels are rejected', async () => {
  const svg = figureParts(figureFragments(publications[0].article)[0], 0).svgs[0];
  const check = value => inspect(value, 0, 0, 'fr');
  for (const [before, after] of [
    ['<svg ', '<svg onload="alert(1)" '],
    ['</svg>', '<script>alert(1)</script></svg>'],
    ['</svg>', '<image href="https://example.com/image.svg"/></svg>'],
    ['var(--color-signal)', '#153b70'],
    ['var(--color-signal)', 'url(https://example.com/image.svg)'],
    ['height:auto', 'height:900px'],
    ['translate(46 177) scale(0.84)', 'rotate(30)'],
  ]) rejectsMutation(check, svg, before, after);
  const longLabel = svg.replace(/(<text\b[^>]*>)[^<]*(<\/text>)/u, (_, start, end) => start + 'Overflowing label '.repeat(60) + end);
  assert.notEqual(longLabel, svg);
  await assert.rejects(geometry(longLabel, 0, 0, 'fr'));
  await assert.rejects(geometry(change(svg, 'font-size="18"', 'font-size="12"'), 0, 0, 'fr'));
  await assert.rejects(geometry(change(svg, 'translate(46 177) scale(0.84)', 'translate(946 177) scale(0.84)'), 0, 0, 'fr'));
});
