import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { XMLBuilder, XMLParser, XMLValidator } from 'fast-xml-parser';
import opentype from '@shuding/opentype.js';
import postcss from 'postcss';
import { usMortgageRiskSvg, US_MORTGAGE_RISK_KINDS, US_MORTGAGE_RISK_DATA } from '../src/lib/usMortgageRiskFigures.mjs';

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const parser = new XMLParser({ preserveOrder: true, ignoreAttributes: false, attributeNamePrefix: '', trimValues: false, parseTagValue: false, parseAttributeValue: false });
const builder = new XMLBuilder({ preserveOrder: true, ignoreAttributes: false, attributeNamePrefix: '' });
const tag = n => Object.keys(n).find(k => k !== ':@'), attrs = n => n[':@'] || {}, children = n => n[tag(n)] || [];
const nodesOf = n => tag(n) === '#text' ? [] : [n, ...children(n).flatMap(nodesOf)];
const textOf = n => tag(n) === '#text' ? n['#text'] : children(n).map(textOf).join('');
const number = (n, key, fallback = 0) => { const v = Number(attrs(n)[key] ?? fallback); assert.ok(Number.isFinite(v), key); return v; };
const close = (a, b, label = '') => assert.ok(Math.abs(a - b) < 1e-7, `${label}: ${a} != ${b}`);
const variants = ['fr', 'en'].flatMap(lang => US_MORTGAGE_RISK_KINDS.flatMap(kind => [false, true].map(mobile => ({ lang, kind, mobile, name: `${kind}-${lang}-${mobile ? 'mobile' : 'desktop'}`, svg: usMortgageRiskSvg(lang, kind, mobile) }))));
const native = {};
postcss.parse(read('src/styles/global.css')).walkDecls(d => { if (d.parent.type === 'atrule' && d.parent.name === 'theme') native[d.prop] = d.value.replace(/\s+/gu, ''); });
const paint = role => `var(--color-${role},${native[`--color-${role}`]})`;
const safePaints = new Set(['none', ...['ink', 'surface', 'surface-2', 'line-strong', 'paper', 'muted', 'amber', 'signal', 'accent'].map(paint)]);
const safeTags = new Set('svg title desc metadata rect text line path circle polygon'.split(' '));
const safeAttrs = new Set('xmlns viewBox role aria-labelledby data-us-mortgage-risk-kind style id refX refY markerWidth markerHeight orient fill stroke stroke-width stroke-dasharray marker-end x y width height rx data-text font-family font-size font-weight text-anchor x1 y1 x2 y2 d cx cy r points stroke-linecap stroke-linejoin'.split(' '));
const svgNumbers = { household: '01', chain: '02', principal: '03', refinancing: '04', hedging: '05', margin: '06', sensitivities: '07' };
const fontHashes = { 400: '3c34634a434f2de5681a9a758d46b9a6ef685b668bc843d9463f763895241713', 700: '5e783e61a4a2c30c260245f7ba2d60686b5036dc1e463d4fc139097fc04512c5' };
const fonts = Object.fromEntries([400, 700].map(weight => {
  const bytes = readFileSync(new URL(`../public/fonts/us-mortgage-risk/dejavu-sans-${weight}.ttf`, import.meta.url));
  assert.equal(createHash('sha256').update(bytes).digest('hex'), fontHashes[weight]);
  assert.ok(bytes.length < 420000);
  return [weight, opentype.parse(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength))];
}));

function inspect(v) {
  assert.equal(XMLValidator.validate(v.svg), true); assert.doesNotMatch(v.svg, /<!|<\?/u);
  const tree = parser.parse(v.svg); assert.equal(tree.length, 1); const root = tree[0], nodes = nodesOf(root), ids = new Set();
  assert.equal(tag(root), 'svg'); assert.equal(attrs(root).xmlns, 'http://www.w3.org/2000/svg');
  assert.equal(attrs(root).role, 'img'); assert.equal(attrs(root).style, 'display:block;width:100%;height:auto');
  assert.equal(attrs(root)['data-us-mortgage-risk-kind'], v.name); assert.equal(attrs(root).width, undefined); assert.equal(attrs(root).height, undefined);
  const box = attrs(root).viewBox.split(' ').map(Number); assert.deepEqual(box.slice(0, 2), [0, 0]); assert.equal(box.length, 4);
  assert.equal(box[2], v.mobile ? 440 : 1200); assert.ok(box[3] >= 788 && box[3] <= 1251);
  for (const n of nodes) {
    assert.ok(safeTags.has(tag(n)), tag(n));
    for (const [key, value] of Object.entries(attrs(n))) {
      assert.ok(safeAttrs.has(key), key); assert.equal(typeof value, 'string');
      if (key === 'xmlns') { assert.equal(n, root); assert.equal(value, 'http://www.w3.org/2000/svg'); }
      else assert.doesNotMatch(value, /javascript:|data:|https?:|@import/iu);
      if (key === 'fill' || key === 'stroke') assert.ok(safePaints.has(value.replace(/\s+/gu, '')), value);
      if (key === 'style') assert.equal(n, root);
      if (key === 'font-family') assert.equal(value, 'l0g US Mortgage Risk, DejaVu Sans, Arial, sans-serif');
      if (key === 'font-size') assert.ok(number(n, key) >= 11 && number(n, key) <= 70);
      if (key === 'font-weight') assert.ok(['400', '700'].includes(value));
      if (key === 'text-anchor') assert.ok(['start', 'middle', 'end'].includes(value));
      if (key === 'id') { assert.match(value, new RegExp(`^mbs-${svgNumbers[v.kind]}-${v.lang}-${v.mobile ? 'm' : 'd'}-(?:title|desc)$`, 'u')); assert.ok(!ids.has(value)); ids.add(value); }
      if (key === 'marker-end') assert.match(value, /^url\(#[a-z0-9-]+\)$/u);
      if (key === 'orient') assert.equal(value, 'auto-start-reverse');
    }
  }
  for (const n of nodes) if (attrs(n)['marker-end']) assert.ok(ids.has(attrs(n)['marker-end'].slice(5, -1)));
  const aria = attrs(root)['aria-labelledby'].split(' '); assert.equal(aria.length, 2);
  for (const type of ['title', 'desc']) { const found = nodes.filter(n => tag(n) === type); assert.equal(found.length, 1); assert.ok(aria.includes(attrs(found[0]).id)); assert.ok(textOf(found[0]).trim()); }
  const metadata = JSON.parse(textOf(nodes.find(n => tag(n) === 'metadata')));
  assert.equal(metadata.asOf, US_MORTGAGE_RISK_DATA.asOf); assert.equal(metadata.kind, v.kind); assert.equal(metadata.lang, v.lang); assert.equal(metadata.layout, v.mobile ? 'mobile' : 'desktop');
  assert.ok(metadata.sourceIds.every(id => Number.isInteger(id) && id >= 1 && id <= 14)); assert.ok(metadata.metric.trim());
  return { root, nodes, width: box[2], height: box[3], metadata };
}
function pointsBox(points) {
  assert.ok(points.length && points.flat().every(Number.isFinite));
  return { x: Math.min(...points.map(p => p[0])), y: Math.min(...points.map(p => p[1])), right: Math.max(...points.map(p => p[0])), bottom: Math.max(...points.map(p => p[1])) };
}
function textBounds(n) {
  const value = textOf(n), face = fonts[attrs(n)['font-weight'] === '700' ? 700 : 400], size = number(n, 'font-size');
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
  if (tag(n) === 'polygon') return pointsBox(attrs(n).points.trim().split(/\s+/u).map(pair => pair.split(',').map(Number)));
}
const overlaps = (a, b) => a.x < b.right && a.right > b.x && a.y < b.bottom && a.bottom > b.y;
function geometry(v) {
  const { nodes, width, height } = inspect(v), boxes = [];
  for (const [index, n] of nodes.entries()) {
    if (['rect', 'circle', 'line', 'path', 'polygon'].includes(tag(n))) {
      const box = shapeBounds(n), padding = attrs(n).stroke && attrs(n).stroke !== 'none' ? number(n, 'stroke-width') / 2 : 0;
      assert.ok(box.x - padding >= -.5 && box.y - padding >= -.5 && box.right + padding <= width + .5 && box.bottom + padding <= height + .5, `${v.name}: shape outside viewBox`);
    }
    if (tag(n) !== 'text') continue;
    const box = textBounds(n), label = textOf(n);
    assert.ok(box.x >= 1 && box.y >= 1 && box.right <= width - 1 && box.bottom <= height - 1, `${v.name}: glyph outside viewBox: ${label}`);
    for (const previous of boxes) assert.ok(!overlaps(box, previous), `${v.name}: glyph collision: ${label}/${previous.label}`);
    const panel = nodes.slice(0, index).filter(node => tag(node) === 'rect' && attrs(node).rx === '4').map(shapeBounds).filter(candidate => (box.x + box.right) / 2 > candidate.x && (box.x + box.right) / 2 < candidate.right && (box.y + box.bottom) / 2 > candidate.y && (box.y + box.bottom) / 2 < candidate.bottom).at(-1);
    if (panel) assert.ok(box.x >= panel.x + 2 && box.y >= panel.y + 2 && box.right <= panel.right - 2 && box.bottom <= panel.bottom - 2, `${v.name}: label crosses its own panel: ${label}`);
    for (const cover of nodes.slice(index + 1).filter(node => tag(node) === 'rect' && attrs(node).fill !== 'none')) assert.ok(!overlaps(box, shapeBounds(cover)), `${v.name}: concealed label: ${label}`);
    boxes.push({ ...box, label });
  }
}
function mutate(v, change) { const root = parser.parse(v.svg)[0]; change(root, nodesOf(root)); return { ...v, svg: builder.build([root]) }; }

const originalCompositionHashes = Object.freeze({
  "household-fr-desktop": "dd0cec6e13488191d9eb4473fbaae5e080bdd70cf9b101d28052a175a3de3182",
  "household-fr-mobile": "2143efb2899a2daf2699684815cb1afd4f2343e5a0fc9bf85167514c49d72d6a",
  "chain-fr-desktop": "0b7f741e7a128185690501a2edc042cf92b94f66519350c33b535d6f94d547a1",
  "chain-fr-mobile": "374a0bae04fba70f3e57bda15db28048c0b9fb9c9e396870ff571dd9463cab62",
  "principal-fr-desktop": "896c5f324725e7497af4a6623ea6ebff7e6617668752daae31c26eae7cfebe1c",
  "principal-fr-mobile": "7de3e779be5eeb01d55655a4b0a8c8e70d59bc29aa094a104dacd0f73ebc0a34",
  "refinancing-fr-desktop": "e4b613cc3b5ab298ad4e739713dd382459239c37dad63559f6779d40f8ad752a",
  "refinancing-fr-mobile": "61726d2d1580595ba46cfcacc21a35698221c482d5c4394dd892f4c76d37535c",
  "hedging-fr-desktop": "f8e6e98efdf149961e6bd8da629fbe3bb8dbfd572e0b58eefca172a710b2ffd9",
  "hedging-fr-mobile": "9cf1dcca9d896db85359d25f6756307e607b3ce76366e4f98a67f1b128b232ff",
  "margin-fr-desktop": "b8b68c79b33e2f3fbb5029d02f560f16479bc71ae7a3385e8ae333aa50c5340d",
  "margin-fr-mobile": "b75d28958b9957dbfd1b2f2cead5649b0ac6382b8c0fba3ff2cdac9b09f5ce27",
  "sensitivities-fr-desktop": "0e616d49336c445a52f2bde6f288e15a36b96d996377b3d3395658773dd647c7",
  "sensitivities-fr-mobile": "9db45839de4736c1f24d76e28f26e6b190589ba916993997e2045d29b47b77c5",
  "household-en-desktop": "8477d9360bf5aa08d8967e7ed260a03e902cd66e9232c0c05e8078db9de00fc0",
  "household-en-mobile": "1d81d8490e36b5d766f99494006c0cad941e998227f4ced238fb911d98e10574",
  "chain-en-desktop": "061393c204d4bdd15290700a89e5cc67e7f34965ad5d7c40e36574d7ca619a71",
  "chain-en-mobile": "b48575dfc88decb09d3de2818f9955659bbb8f35e9f8a289735269d087547877",
  "principal-en-desktop": "4b60be3b588aea57624d34113e02f5d407b36ac91bb93f3334435956aa98095a",
  "principal-en-mobile": "ae7f5dc62ff8346578989b228bfd4ee58d84f79aba94d03cdfc2d6160e7018d0",
  "refinancing-en-desktop": "e3443b864494abfb1eedad35e29a609c9bc66024ba757e658d00cb561cce65aa",
  "refinancing-en-mobile": "4cbc550807daf6958b08e09ca30aed8bda49a637246db7060e75f6cf89f31d6a",
  "hedging-en-desktop": "98c916206bbaa1b21a84e75bbc6807b0d8739684077138d01ce380bb91222cd1",
  "hedging-en-mobile": "0fadaf85fa281eaa1eb08bd03aa296c613d1bc7a75ee386df685d354a56b63a7",
  "margin-en-desktop": "8ab50bf8d0b21e4fa312a3b76f59e6dedd2d746f535f93924c0589d914f89c40",
  "margin-en-mobile": "23a383f9ded3f82ce04b0a7d851b10741de77fc4f1751a488189d6a0ba4a4353",
  "sensitivities-en-desktop": "18403f006bb89f458f4d7d0fefff9518b55c0206124490dda361fa1617804d2e",
  "sensitivities-en-mobile": "d19ddc549a296c648b66192ebc34c1e0a6f01fa0d710cb88b680e4c1ceeedecc"
});
function composition(svg) { return nodesOf(parser.parse(svg)[0]).filter(n => tag(n) !== 'metadata').map(n => [tag(n), Object.entries(attrs(n)).filter(([key]) => !['fill', 'stroke', 'font-family', 'style', 'data-us-mortgage-risk-kind'].includes(key)).sort(([a], [b]) => a.localeCompare(b)), ['title', 'desc', 'text'].includes(tag(n)) ? textOf(n) : '']); }
function preservesComposition(v) { assert.equal(createHash('sha256').update(JSON.stringify(composition(v.svg))).digest('hex'), originalCompositionHashes[v.name], v.name); }
function closeRounded(a, b, tolerance = .0051) { assert.ok(Math.abs(a - b) <= tolerance, a + ' != ' + b); }
function fillRows(v, role) { return inspect(v).nodes.filter(n => tag(n) === 'rect' && attrs(n).fill.replace(/\s+/gu, '') === paint(role) && attrs(n).rx === '0'); }
test('all twenty-eight accessible responsive compositions use inert markup and native semantic paints', () => {
  assert.deepEqual(US_MORTGAGE_RISK_KINDS, ['household', 'chain', 'principal', 'refinancing', 'hedging', 'margin', 'sensitivities']); assert.equal(variants.length, 28); const ids = new Set();
  for (const v of variants) { const { nodes } = inspect(v); preservesComposition(v); for (const n of nodes) if (attrs(n).id) { assert.ok(!ids.has(attrs(n).id)); ids.add(attrs(n).id); }
    assert.doesNotMatch(v.svg, /(?:deux|two|2) (?:horloges|clocks)|—/iu);
    for (const n of nodes.filter(n => tag(n) === 'title' || tag(n) === 'text' && attrs(n)['font-weight'] === '700')) assert.doesNotMatch(textOf(n), /ce (?:que|qui|qu[’'])|what .* (?:means|reveals|covers)/iu);
  } assert.equal(ids.size, 56);
});
test('licensed original DejaVu outlines include every regular and bold label glyph', () => {
  let count = 0; for (const v of variants) for (const n of inspect(v).nodes.filter(node => tag(node) === 'text')) { for (const char of textOf(n)) assert.ok(fonts[attrs(n)['font-weight'] === '700' ? 700 : 400].charToGlyphIndex(char) > 0); count++; } assert.equal(count, 762);
  const licence = read('public/fonts/us-mortgage-risk/LICENSE.txt'); assert.match(licence, /DejaVu Sans 2\.37/u); assert.match(licence, /unchanged DejaVu Sans outlines and metrics/u); assert.match(licence, /Copyright \(c\) 2003 by Bitstream/u); assert.match(licence, /Copyright \(c\) 2006 by Tavmjong Bah/u); assert.match(licence, /dejavu-fonts\.github\.io\/License\.html/u);
});
test('glyph contours and every path or shape stay inside their viewBox without collision or concealment', () => { for (const v of variants) geometry(v); });
test('hypothetical mortgage payments preserve the equal-balance equal-term bar scale', () => {
 const monthly = (principal, rate, months) => principal * (rate / 12) / (1 - (1 + rate / 12) ** -months), old = monthly(300000, .03, 360), balance = 300000 * (1 + .03 / 12) ** 60 - old * ((1 + .03 / 12) ** 60 - 1) / (.03 / 12), changed = monthly(balance, .074, 300);
 closeRounded(old, 1264.812101188368, 1e-6); closeRounded(changed, 1953.7143211552861, 1e-6); closeRounded(changed - old, 688.9022199669182, 1e-6);
 for (const v of variants.filter(v => v.kind === 'household')) { const background = fillRows(v, 'surface-2').filter(n => number(n, 'height') === 22); const oldBar = fillRows(v, 'signal'), replacementBar = fillRows(v, 'amber'); assert.equal(background.length, 2); assert.equal(oldBar.length, 1); assert.equal(replacementBar.length, 1); closeRounded(number(oldBar[0], 'width'), number(background[0], 'width') * old / 2200); closeRounded(number(replacementBar[0], 'width'), number(background[1], 'width') * changed / 2200); }
});
test('both principal curves encode cumulative returned principal for all 300 months, including CPR failure boundaries', () => {
 function repaid(cpr) { const smm = 1 - (1 - cpr) ** (1 / 12), out = [0]; let balance = 100000000; for (let month = 1; month <= 300; month++) { const payment = balance * (.03 / 12) / (1 - (1 + .03 / 12) ** -(301 - month)); const scheduled = Math.min(balance, payment - balance * .03 / 12), prepaid = (balance - scheduled) * smm; balance -= scheduled + prepaid; out.push(100000000 - balance); } return out; }
 const fast = repaid(.12), slow = repaid(.03); closeRounded(fast[60], 54876031.450775206, .01); closeRounded(slow[60], 26573538.69593357, .01); assert.ok(fast[60] > slow[60]); closeRounded(repaid(0)[300], 100000000, .01); closeRounded(repaid(1)[1], 100000000, .01);
 for (const v of variants.filter(v => v.kind === 'principal')) { const curves = inspect(v).nodes.filter(n => tag(n) === 'path'); assert.equal(curves.length, 2); for (const [i, curve] of curves.entries()) { const points = pathPoints(attrs(curve).d), values = i === 0 ? fast : slow; assert.equal(points.length, 301); const x0 = points[0][0], y0 = points[0][1], dx = points[300][0] - x0, dy = y0 - points[300][1]; for (let month = 0; month <= 300; month++) { closeRounded(points[month][0], x0 + dx * month / 300); closeRounded(points[month][1], y0 - dy * values[month] / 100000000); } } }
});
test('refinancing circles retain independent one-point scenarios and the half-point hurdle', () => {
 const values = [.03, .065, .075].flatMap(rate => [.064, .074].map(newRate => (rate - newRate - .005) * 100));
 for (const v of variants.filter(v => v.kind === 'refinancing')) { const points = inspect(v).nodes.filter(n => tag(n) === 'circle' && number(n, 'r') === 6); assert.equal(points.length, 6); const zeroLabel = inspect(v).nodes.find(n => tag(n) === 'text' && textOf(n) === '0'); assert.ok(zeroLabel); const zero = number(zeroLabel, 'x'), pixelsPerPoint = (number(points[0], 'cx') - number(points[1], 'cx')) / (values[0] - values[1]); assert.ok(pixelsPerPoint > 0); points.forEach((n, i) => closeRounded(number(n, 'cx'), zero + values[i] * pixelsPerPoint)); }
});
test('DV01 and repo examples distinguish a hedge exposure, valuation loss and cash margin call', () => {
 assert.equal(1e9 * 4 * .0001, 400000); assert.equal(1e9 * 6 * .0001, 600000); assert.equal(200000 / (8 * .0001), 250000000); closeRounded(100 * .97 * .95, 92.15); closeRounded(95 - 100 * .97 * .95, 2.85); assert.equal(100 - 100 * .97, 3);
 for (const v of variants.filter(v => ['hedging', 'margin'].includes(v.kind))) { const description = textOf(inspect(v).nodes.find(n => tag(n) === 'desc')); assert.match(description, v.lang === 'fr' ? /ficti|modèle/u : /hypothetical|approximation/iu); }
 for (const v of variants.filter(v => v.kind === 'margin')) { const repo = fillRows(v, 'signal'), equity = fillRows(v, 'amber').filter(n => number(n, 'width') > 50); assert.equal(repo.length, 2); assert.equal(equity.length, 2); const unit = number(repo[0], 'height') / 95; closeRounded(number(repo[1], 'height'), 95 * unit); closeRounded(number(equity[0], 'height'), 5 * unit); closeRounded(number(equity[1], 'height'), 2 * unit); }
});
test('issuer sensitivity bars retain separate 25bp scenarios and a common 15-percent scale', () => {
 for (const v of variants.filter(v => v.kind === 'sensitivities')) { const backdrop = fillRows(v, 'surface-2'), rate = fillRows(v, 'signal'), spread = fillRows(v, 'accent'); assert.equal(backdrop.length, 2); assert.equal(rate.length, 1); assert.equal(spread.length, 1); closeRounded(number(rate[0], 'width'), number(backdrop[0], 'width') * 2.3 / 15); closeRounded(number(spread[0], 'width'), number(backdrop[1], 'width') * 12.2 / 15); const metadata = inspect(v).metadata; assert.match(metadata.metric, /2026-06-30/u); assert.deepEqual(metadata.sourceIds, [8]); }
});
test('component guards variants, preserves both original font faces and keeps captions and bibliography discreet', () => {
 const component = read('src/components/UsMortgageRiskFigure.astro'), css = postcss.parse(component.slice(component.indexOf('<style>') + 7, component.indexOf('</style>'))), faces = [];
 css.walkAtRules('font-face', rule => faces.push(Object.fromEntries(rule.nodes.filter(n => n.type === 'decl').map(n => [n.prop, n.value])))); assert.deepEqual(faces.map(face => face['font-weight']).sort(), ['400', '700']);
 for (const face of faces) { assert.equal(face['font-family'], "'l0g US Mortgage Risk'"); assert.equal(face['font-style'], 'normal'); assert.equal(face['font-display'], 'swap'); assert.equal(face.src, "url('/fonts/us-mortgage-risk/dejavu-sans-" + face['font-weight'] + ".ttf') format('truetype')"); }
 assert.match(component, /container-type: inline-size/u); assert.match(component, /@container \(max-width: 640px\)/u); assert.match(component, /font-size: \.875rem/u); assert.match(component, /us-mortgage-risk-sources/u); assert.ok(component.indexOf('@media print') > component.indexOf('@container'));
 for (const input of [['de', 'household', false], ['fr', 'unknown', false], ['fr', 'household', 'true'], ['en', 'margin', 1], ['fr', '__proto__', false]]) assert.throws(() => usMortgageRiskSvg(...input), TypeError);
});
test('unsafe external markup, unapproved paints, altered amounts and moved or colliding labels are rejected', () => {
 const v = variants[0];
 assert.throws(() => inspect(mutate(v, (root, nodes) => { attrs(nodes.find(n => tag(n) === 'line')).href = 'https://example.com/evil.svg'; })));
 assert.throws(() => inspect(mutate(v, root => { root.svg.push({ script: [{ '#text': 'alert(1)' }] }); })));
 assert.throws(() => inspect(mutate(v, (root, nodes) => { attrs(nodes.find(n => tag(n) === 'text')).fill = '#abcdef'; })));
 assert.throws(() => preservesComposition(mutate(v, (root, nodes) => { nodes.find(n => tag(n) === 'text').text = [{ '#text': 'fabricated figure' }]; })));
 assert.throws(() => geometry(mutate(v, (root, nodes) => { attrs(nodes.find(n => tag(n) === 'text')).x = '10000'; })));
 const chain = variants.find(row => row.kind === 'chain' && row.lang === 'fr' && !row.mobile);
 assert.throws(() => geometry(mutate(chain, (root, nodes) => { attrs(nodes.find(n => tag(n) === 'text' && textOf(n) === 'MÉNAGE')).x = '236'; })), /own panel/u);
 assert.throws(() => geometry(mutate(v, (root, nodes) => { const texts = nodes.filter(n => tag(n) === 'text'); attrs(texts[1]).x = attrs(texts[0]).x; attrs(texts[1]).y = attrs(texts[0]).y; })));
});
