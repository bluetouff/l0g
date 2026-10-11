import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { XMLBuilder, XMLParser, XMLValidator } from 'fast-xml-parser';
import opentype from '@shuding/opentype.js';
import postcss from 'postcss';
import { ukraineReparationsSvg, UKRAINE_REPARATIONS_KINDS, UKRAINE_REPARATIONS_DATA } from '../src/lib/ukraineReparationsFigures.mjs';

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const parser = new XMLParser({ preserveOrder: true, ignoreAttributes: false, attributeNamePrefix: '', trimValues: false, parseTagValue: false, parseAttributeValue: false });
const builder = new XMLBuilder({ preserveOrder: true, ignoreAttributes: false, attributeNamePrefix: '' });
const tag = n => Object.keys(n).find(k => k !== ':@'), attrs = n => n[':@'] || {}, children = n => n[tag(n)] || [];
const nodesOf = n => tag(n) === '#text' ? [] : [n, ...children(n).flatMap(nodesOf)];
const textOf = n => tag(n) === '#text' ? n['#text'] : children(n).map(textOf).join('');
const number = (n, key, fallback = 0) => { const v = Number(attrs(n)[key] ?? fallback); assert.ok(Number.isFinite(v), key); return v; };
const close = (a, b, label = '') => assert.ok(Math.abs(a - b) < 1e-7, `${label}: ${a} != ${b}`);
const variants = ['fr', 'en'].flatMap(lang => UKRAINE_REPARATIONS_KINDS.flatMap(kind => [false, true].map(mobile => ({ lang, kind, mobile, name: `${kind}-${lang}-${mobile ? 'mobile' : 'desktop'}`, svg: ukraineReparationsSvg(lang, kind, mobile) }))));
const native = {};
postcss.parse(read('src/styles/global.css')).walkDecls(d => { if (d.parent.type === 'atrule' && d.parent.name === 'theme') native[d.prop] = d.value.replace(/\s+/gu, ''); });
const paint = role => `var(--color-${role},${native[`--color-${role}`]})`;
const safePaints = new Set(['none', ...['ink', 'surface', 'surface-2', 'line-strong', 'paper', 'muted', 'amber', 'topic-blue'].map(paint)]);
const safeTags = new Set('svg title desc metadata defs marker rect text line path circle'.split(' '));
const safeAttrs = new Set('xmlns viewBox role aria-labelledby data-ukraine-reparations-kind style id refX refY markerWidth markerHeight orient fill stroke stroke-width stroke-dasharray marker-end x y width height rx data-text font-family font-size font-weight text-anchor x1 y1 x2 y2 d cx cy r'.split(' '));
const svgNumbers = { timing: 1, disbursements: 2, sharing: 5, guarantee: 3, carrying: 6, resources: 4 };
const fontHashes = { 400: '76d04c18ea243f426b7de1f3ad208e927008f961dc5945e5aad352d0dfde8ee8', 700: '788abee4c806d660e8aee46689dd8540cd4bb98da03dcc9d171ce3efd99a9173' };
const fonts = Object.fromEntries([400, 700].map(weight => {
  const bytes = readFileSync(new URL(`../public/fonts/ukraine-reparations/liberation-sans-${weight}.ttf`, import.meta.url));
  assert.equal(createHash('sha256').update(bytes).digest('hex'), fontHashes[weight]);
  assert.ok(bytes.length < 420000);
  return [weight, opentype.parse(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength))];
}));

function inspect(v) {
  assert.equal(XMLValidator.validate(v.svg), true); assert.doesNotMatch(v.svg, /<!|<\?/u);
  const tree = parser.parse(v.svg); assert.equal(tree.length, 1); const root = tree[0], nodes = nodesOf(root), ids = new Set();
  assert.equal(tag(root), 'svg'); assert.equal(attrs(root).xmlns, 'http://www.w3.org/2000/svg');
  assert.equal(attrs(root).role, 'img'); assert.equal(attrs(root).style, 'display:block;width:100%;height:auto');
  assert.equal(attrs(root)['data-ukraine-reparations-kind'], v.name); assert.equal(attrs(root).width, undefined); assert.equal(attrs(root).height, undefined);
  const box = attrs(root).viewBox.split(' ').map(Number); assert.deepEqual(box.slice(0, 2), [0, 0]); assert.equal(box.length, 4);
  assert.equal(box[2], v.mobile ? 390 : 1120); assert.ok(box[3] >= 900 && box[3] <= 1574);
  for (const n of nodes) {
    assert.ok(safeTags.has(tag(n)), tag(n));
    for (const [key, value] of Object.entries(attrs(n))) {
      assert.ok(safeAttrs.has(key), key); assert.equal(typeof value, 'string');
      if (key === 'xmlns') { assert.equal(n, root); assert.equal(value, 'http://www.w3.org/2000/svg'); }
      else assert.doesNotMatch(value, /javascript:|data:|https?:|@import/iu);
      if (key === 'fill' || key === 'stroke') assert.ok(safePaints.has(value.replace(/\s+/gu, '')), value);
      if (key === 'style') assert.equal(n, root);
      if (key === 'font-family') assert.equal(value, 'l0g Ukraine Reparations, Liberation Sans, Arial, sans-serif');
      if (key === 'font-size') assert.ok(number(n, key) >= 12 && number(n, key) <= 44);
      if (key === 'font-weight') assert.ok(['normal', 'bold'].includes(value));
      if (key === 'text-anchor') assert.ok(['start', 'middle', 'end'].includes(value));
      if (key === 'id') { assert.match(value, new RegExp(`^ukr-${svgNumbers[v.kind]}-${v.lang}-${v.mobile ? 'm' : 'd'}-(?:title|desc|ink|blue|amber|slate)$`, 'u')); assert.ok(!ids.has(value)); ids.add(value); }
      if (key === 'marker-end') assert.match(value, /^url\(#[a-z0-9-]+\)$/u);
      if (key === 'orient') assert.equal(value, 'auto-start-reverse');
    }
  }
  for (const n of nodes) if (attrs(n)['marker-end']) assert.ok(ids.has(attrs(n)['marker-end'].slice(5, -1)));
  const aria = attrs(root)['aria-labelledby'].split(' '); assert.equal(aria.length, 2);
  for (const type of ['title', 'desc']) { const found = nodes.filter(n => tag(n) === type); assert.equal(found.length, 1); assert.ok(aria.includes(attrs(found[0]).id)); assert.ok(textOf(found[0]).trim()); }
  const metadata = JSON.parse(textOf(nodes.find(n => tag(n) === 'metadata')));
  assert.equal(metadata.asOf, UKRAINE_REPARATIONS_DATA.asOf); assert.equal(metadata.kind, v.kind); assert.equal(metadata.lang, v.lang); assert.equal(metadata.layout, v.mobile ? 'mobile' : 'desktop');
  assert.ok(metadata.sourceIds.every(id => Number.isInteger(id) && id >= 1 && id <= 19)); assert.ok(metadata.metric.trim());
  return { root, nodes, width: box[2], height: box[3], metadata };
}
function pointsBox(points) {
  assert.ok(points.length && points.flat().every(Number.isFinite));
  return { x: Math.min(...points.map(p => p[0])), y: Math.min(...points.map(p => p[1])), right: Math.max(...points.map(p => p[0])), bottom: Math.max(...points.map(p => p[1])) };
}
function textBounds(n) {
  const value = textOf(n), face = fonts[attrs(n)['font-weight'] === 'bold' ? 700 : 400], size = number(n, 'font-size');
  for (const char of value) assert.ok(face.charToGlyphIndex(char) > 0, `Missing glyph U+${char.codePointAt(0).toString(16)}`);
  const advance = face.getAdvanceWidth(value, size), anchor = attrs(n)['text-anchor'];
  const x = number(n, 'x') - (anchor === 'middle' ? advance / 2 : anchor === 'end' ? advance : 0);
  const commands = face.getPath(value, x, number(n, 'y'), size).commands.filter(c => c.type !== 'Z');
  return pointsBox(commands.flatMap(c => ['x', 'x1', 'x2'].flatMap((key, i) => key in c ? [[c[key], c[['y', 'y1', 'y2'][i]]]] : [])));
}
function pathPoints(data) {
  const tokens = data.match(/[MLHVZ]|[-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?/gu) || [];
  assert.equal(data.replace(/[MLHVZ]|[-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?|[\s,]/gu, ''), '');
  let x = 0, y = 0; const points = [];
  for (let i = 0; i < tokens.length;) {
    const command = tokens[i++]; assert.ok(['M', 'L', 'H', 'V', 'Z'].includes(command));
    if (command === 'Z') continue;
    const count = command === 'H' || command === 'V' ? 1 : 2, values = tokens.slice(i, i + count).map(Number);
    assert.equal(values.length, count); assert.ok(values.every(Number.isFinite)); i += count;
    if (command === 'H') x = values[0]; else if (command === 'V') y = values[0]; else [x, y] = values;
    points.push([x, y]);
  }
  return points;
}
function shapeBounds(n) {
  if (tag(n) === 'rect') return { x: number(n, 'x'), y: number(n, 'y'), right: number(n, 'x') + number(n, 'width'), bottom: number(n, 'y') + number(n, 'height') };
  if (tag(n) === 'circle') return { x: number(n, 'cx') - number(n, 'r'), y: number(n, 'cy') - number(n, 'r'), right: number(n, 'cx') + number(n, 'r'), bottom: number(n, 'cy') + number(n, 'r') };
  if (tag(n) === 'line') return pointsBox([[number(n, 'x1'), number(n, 'y1')], [number(n, 'x2'), number(n, 'y2')]]);
  if (tag(n) === 'path') return pointsBox(pathPoints(attrs(n).d));
}
const overlaps = (a, b) => a.x < b.right && a.right > b.x && a.y < b.bottom && a.bottom > b.y;
function geometry(v) {
  const { nodes, width, height } = inspect(v), boxes = [];
  for (const [index, n] of nodes.entries()) {
    if (['rect', 'circle', 'line', 'path'].includes(tag(n))) {
      const box = shapeBounds(n), padding = attrs(n).stroke && attrs(n).stroke !== 'none' ? number(n, 'stroke-width') / 2 : 0;
      assert.ok(box.x - padding >= -.5 && box.y - padding >= -.5 && box.right + padding <= width + .5 && box.bottom + padding <= height + .5, `${v.name}: shape outside viewBox`);
    }
    if (tag(n) !== 'text') continue;
    const box = textBounds(n), label = textOf(n);
    assert.ok(box.x >= 1 && box.y >= 1 && box.right <= width - 1 && box.bottom <= height - 1, `${v.name}: glyph outside viewBox: ${label}`);
    for (const previous of boxes) assert.ok(!overlaps(box, previous), `${v.name}: glyph collision: ${label}/${previous.label}`);
    for (const cover of nodes.slice(index + 1).filter(node => tag(node) === 'rect' && attrs(node).fill !== 'none')) assert.ok(!overlaps(box, shapeBounds(cover)), `${v.name}: concealed label: ${label}`);
    boxes.push({ ...box, label });
  }
}
function mutate(v, change) { const root = parser.parse(v.svg)[0]; change(root, nodesOf(root)); return { ...v, svg: builder.build([root]) }; }
function barGroups(v) {
  const nodes = inspect(v).nodes.filter(n => tag(n) === 'rect' && attrs(n).rx === '0' && number(n, 'height') >= 40);
  const groups = new Map();
  for (const n of nodes) { const y = number(n, 'y'); if (!groups.has(y)) groups.set(y, []); groups.get(y).push(n); }
  return [...groups].sort(([a], [b]) => a - b).map(([, rows]) => rows.sort((a, b) => number(a, 'x') - number(b, 'x')));
}
test('twenty-four responsive inert SVGs retain accessible identities and semantic charter paints', () => {
  assert.deepEqual(UKRAINE_REPARATIONS_KINDS, ['timing', 'disbursements', 'sharing', 'guarantee', 'carrying', 'resources']); assert.equal(variants.length, 24); const ids = new Set();
  for (const v of variants) {
    const { nodes } = inspect(v); for (const n of nodes) if (attrs(n).id) { assert.ok(!ids.has(attrs(n).id)); ids.add(attrs(n).id); }
    assert.doesNotMatch(v.svg, /(?:deux|two|2) (?:horloges|clocks)|—/iu);
    assert.doesNotMatch(textOf(nodes.find(n => tag(n) === 'title')), /ce (?:que|qui|qu[’'])|what .* (?:means|reveals)/iu);
  }
  assert.equal(ids.size, 144);
});
test('unmodified licensed regular and bold fonts cover every authored label', () => {
  let count = 0; for (const v of variants) for (const n of inspect(v).nodes.filter(node => tag(node) === 'text')) { for (const char of textOf(n)) assert.ok(fonts[attrs(n)['font-weight'] === 'bold' ? 700 : 400].charToGlyphIndex(char) > 0); count++; }
  assert.equal(count, 737);
  const licence = read('public/fonts/ukraine-reparations/LICENSE.txt');
  assert.match(licence, /Liberation Sans 2\.1\.5/u); assert.match(licence, /Unmodified local font files/u); assert.match(licence, /SIL OPEN FONT LICENSE Version 1\.1/u); assert.match(licence, /Copyright \(c\) 2012 Red Hat/u); assert.match(licence, /Digitized data copyright \(c\) 2010 Google/u); assert.match(licence, /github\.com\/liberationfonts\/liberation-fonts/u);
});
test('actual glyph control points and shapes remain inside each viewBox without collisions or concealed text', () => {
  for (const v of variants) geometry(v);
});
test('ceilings, subset envelopes and payment bars keep their distinct mathematical scales', () => {
  for (const v of variants.filter(v => v.kind === 'disbursements')) {
    const width = inspect(v).width - (v.mobile ? 40 : 84), groups = barGroups(v); assert.equal(groups.length, 3);
    assert.deepEqual(groups.map(rows => rows.length), [2, 3, 2]);
    [60, 30].forEach((value, i) => close(number(groups[0][i], 'width'), width * value / 90));
    [28.3, 8.35, 8.35].forEach((value, i) => close(number(groups[1][i], 'width'), width * value / 90));
    [0.8, 2.1].forEach((value, i) => close(number(groups[2][i], 'width'), width * value / 2.9));
  }
});
test('hypothetical reparations bars conserve amounts and distinguish balances from the payment', () => {
  for (const v of variants.filter(v => v.kind === 'sharing')) {
    const width = inspect(v).width - (v.mobile ? 40 : 84), [balances, received] = barGroups(v);
    assert.equal(balances.length, 3); assert.equal(received.length, 2);
    [90, 40, 20].forEach((value, i) => close(number(balances[i], 'width'), width * value / 150));
    [18, 12].forEach((value, i) => close(number(received[i], 'width'), width * value / 30));
    assert.equal(90 / 150 * 30, 18); assert.equal(90 - 18, 72);
    assert.match(textOf(inspect(v).nodes.find(n => tag(n) === 'desc')), v.lang === 'fr' ? /encours fictifs/iu : /hypothetical balances/iu);
  }
});
test('interest scenarios preserve annual payments without compounding and their change at year five', () => {
  for (const v of variants.filter(v => v.kind === 'carrying')) {
    const curves = inspect(v).nodes.filter(n => tag(n) === 'path' && attrs(n)['stroke-width'] === '3.1'); assert.equal(curves.length, 2);
    const steady = pathPoints(attrs(curves[0]).d), changed = pathPoints(attrs(curves[1]).d); assert.equal(steady.length, 21); assert.equal(changed.length, 21);
    const zero = steady[0][1], units = (zero - steady[20][1]) / 6;
    for (let year = 0; year <= 20; year++) { close(steady[year][1], zero - year * .3 * units, 'steady'); close(changed[year][1], zero - (Math.min(year, 5) * .3 + Math.max(year - 5, 0) * .5) * units, 'changed'); close(changed[year][0], steady[year][0]); }
    assert.match(textOf(inspect(v).nodes.find(n => tag(n) === 'desc')), v.lang === 'fr' ? /sans capitalisation/iu : /never capitalised/iu);
    assert.doesNotMatch(v.svg, /model\/calculate\.py/u);
    const modelLabels = inspect(v).nodes.filter(n => tag(n) === 'text' && textOf(n) === (v.lang === 'fr' ? 'Source : modèle l0g, hypothèses fictives' : 'Source: l0g model, hypothetical inputs'));
    assert.equal(modelLabels.length, 1);
  }
});
test('budget capacity and transferred revenue allocations remain quantitative without inventing cash reserves', () => {
  for (const v of variants.filter(v => v.kind === 'guarantee')) { const circles = inspect(v).nodes.filter(n => tag(n) === 'circle'); assert.equal(circles.length, 27); assert.equal(circles.filter(n => attrs(n).fill.replace(/\s+/gu, '') === paint('topic-blue')).length, 24); }
  for (const v of variants.filter(v => v.kind === 'resources')) { const width = inspect(v).width - (v.mobile ? 40 : 84), [rows] = barGroups(v); assert.equal(rows.length, 2); close(number(rows[0], 'width'), width * .95); close(number(rows[1], 'width'), width * .05); }
});
test('the component uses the exact local faces and limits figure/source variants', () => {
  const component = read('src/components/UkraineReparationsFigure.astro'), start = component.indexOf('<style>'), end = component.indexOf('</style>'); assert.ok(start >= 0 && end > start);
  const css = postcss.parse(component.slice(start + 7, end)), faces = [];
  css.walkAtRules('font-face', rule => faces.push(Object.fromEntries(rule.nodes.filter(n => n.type === 'decl').map(n => [n.prop, n.value]))));
  assert.deepEqual(faces.map(face => face['font-weight']).sort(), ['400', '700']);
  for (const face of faces) { assert.equal(face['font-family'], "'l0g Ukraine Reparations'"); assert.equal(face['font-style'], 'normal'); assert.equal(face['font-display'], 'swap'); assert.equal(face.src, `url('/fonts/ukraine-reparations/liberation-sans-${face['font-weight']}.ttf') format('truetype')`); }
  assert.match(component, /container-type: inline-size/u); assert.match(component, /@container \(max-width: 640px\)/u); assert.ok(component.indexOf('@media print') > component.indexOf('@container'));
  for (const input of [['de', 'timing', false], ['fr', 'unknown', false], ['fr', 'timing', 'true'], ['en', 'resources', 1], ['fr', '__proto__', false]]) assert.throws(() => ukraineReparationsSvg(...input), TypeError);
  assert.match(component, /Invalid Ukraine reparations source reference/u);
});
test('unsafe markers, scripts, unapproved paints and moved labels are rejected', () => {
  const v = variants[0];
  assert.throws(() => inspect(mutate(v, (root, nodes) => { attrs(nodes.find(n => tag(n) === 'path'))['marker-end'] = 'url(https://example.com/evil.svg#marker)'; })));
  assert.throws(() => inspect(mutate(v, root => { root.svg.push({ script: [{ '#text': 'alert(1)' }] }); })));
  assert.throws(() => inspect(mutate(v, (root, nodes) => { attrs(nodes.find(n => tag(n) === 'text')).fill = '#abcdef'; })));
  assert.throws(() => geometry(mutate(v, (root, nodes) => { attrs(nodes.find(n => tag(n) === 'text')).x = '10000'; })));
  assert.throws(() => geometry(mutate(v, (root, nodes) => { const texts = nodes.filter(n => tag(n) === 'text'); attrs(texts[1]).x = attrs(texts[0]).x; attrs(texts[1]).y = attrs(texts[0]).y; })));
});
