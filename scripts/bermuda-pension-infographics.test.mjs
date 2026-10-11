import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { XMLBuilder, XMLParser, XMLValidator } from 'fast-xml-parser';
import opentype from '@shuding/opentype.js';
import postcss from 'postcss';
import { bermudaPensionSvg, BERMUDA_PENSION_KINDS, BERMUDA_PENSION_DATA } from '../src/lib/bermudaPensionFigures.mjs';

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const parser = new XMLParser({ preserveOrder: true, ignoreAttributes: false, attributeNamePrefix: '', trimValues: false, parseTagValue: false, parseAttributeValue: false });
const builder = new XMLBuilder({ preserveOrder: true, ignoreAttributes: false, attributeNamePrefix: '' });
const tag = n => Object.keys(n).find(k => k !== ':@'), attrs = n => n[':@'] || {}, children = n => n[tag(n)] || [];
const nodesOf = n => tag(n) === '#text' ? [] : [n, ...children(n).flatMap(nodesOf)];
const textOf = n => tag(n) === '#text' ? n['#text'] : children(n).map(textOf).join('');
const number = (n, key, fallback = 0) => { const v = Number(attrs(n)[key] ?? fallback); assert.ok(Number.isFinite(v), key); return v; };
const close = (a, b, label = '') => assert.ok(Math.abs(a - b) < 1e-7, `${label}: ${a} != ${b}`);
const variants = ['fr', 'en'].flatMap(lang => BERMUDA_PENSION_KINDS.flatMap(kind => [false, true].map(mobile => ({ lang, kind, mobile, name: `${kind}-${lang}-${mobile ? 'mobile' : 'desktop'}`, svg: bermudaPensionSvg(lang, kind, mobile) }))));
const native = {};
postcss.parse(read('src/styles/global.css')).walkDecls(d => { if (d.parent.type === 'atrule' && d.parent.name === 'theme') native[d.prop] = d.value.replace(/\s+/gu, ''); });
const paint = role => `var(--color-${role},${native[`--color-${role}`]})`;
const safePaints = new Set(['none', ...['ink', 'surface', 'surface-2', 'line-strong', 'paper', 'muted', 'amber', 'signal', 'accent'].map(paint)]);
const safeTags = new Set('svg title desc metadata rect text line path circle polygon'.split(' '));
const safeAttrs = new Set('xmlns viewBox role aria-labelledby data-bermuda-pension-kind style id refX refY markerWidth markerHeight orient fill stroke stroke-width stroke-dasharray marker-end x y width height rx data-text font-family font-size font-weight text-anchor x1 y1 x2 y2 d cx cy r points stroke-linecap stroke-linejoin'.split(' '));
const svgNumbers = { chain: '01', capital: '02', collateral: '03', liquidity: '04', discounting: '05', solvency: '06', timeline: '07' };
const fontHashes = { 400: 'ce5d65717b2980aeb430e837dfb3de62ffeaa5316311e586264c8ec18c6985be', 700: '065b773da491a62237a59c17e77e5d8e8399ecbe7623adfecd91b3f2bb27d205' };
const fonts = Object.fromEntries([400, 700].map(weight => {
  const bytes = readFileSync(new URL(`../public/fonts/bermuda-pensions/dejavu-sans-${weight}.ttf`, import.meta.url));
  assert.equal(createHash('sha256').update(bytes).digest('hex'), fontHashes[weight]);
  assert.ok(bytes.length < 420000);
  return [weight, opentype.parse(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength))];
}));

function inspect(v) {
  assert.equal(XMLValidator.validate(v.svg), true); assert.doesNotMatch(v.svg, /<!|<\?/u);
  const tree = parser.parse(v.svg); assert.equal(tree.length, 1); const root = tree[0], nodes = nodesOf(root), ids = new Set();
  assert.equal(tag(root), 'svg'); assert.equal(attrs(root).xmlns, 'http://www.w3.org/2000/svg');
  assert.equal(attrs(root).role, 'img'); assert.equal(attrs(root).style, 'display:block;width:100%;height:auto');
  assert.equal(attrs(root)['data-bermuda-pension-kind'], v.name); assert.equal(attrs(root).width, undefined); assert.equal(attrs(root).height, undefined);
  const box = attrs(root).viewBox.split(' ').map(Number); assert.deepEqual(box.slice(0, 2), [0, 0]); assert.equal(box.length, 4);
  assert.equal(box[2], v.mobile ? 440 : 1200); assert.ok(box[3] >= 839 && box[3] <= 1387);
  for (const n of nodes) {
    assert.ok(safeTags.has(tag(n)), tag(n));
    for (const [key, value] of Object.entries(attrs(n))) {
      assert.ok(safeAttrs.has(key), key); assert.equal(typeof value, 'string');
      if (key === 'xmlns') { assert.equal(n, root); assert.equal(value, 'http://www.w3.org/2000/svg'); }
      else assert.doesNotMatch(value, /javascript:|data:|https?:|@import/iu);
      if (key === 'fill' || key === 'stroke') assert.ok(safePaints.has(value.replace(/\s+/gu, '')), value);
      if (key === 'style') assert.equal(n, root);
      if (key === 'font-family') assert.equal(value, 'l0g Bermuda Pensions, DejaVu Sans, Arial, sans-serif');
      if (key === 'font-size') assert.ok(number(n, key) >= 11 && number(n, key) <= 70);
      if (key === 'font-weight') assert.ok(['400', '700'].includes(value));
      if (key === 'text-anchor') assert.ok(['start', 'middle', 'end'].includes(value));
      if (key === 'id') { assert.match(value, new RegExp(`^re-bm-${svgNumbers[v.kind]}-${v.lang}-${v.mobile ? 'm' : 'd'}-(?:title|desc)$`, 'u')); assert.ok(!ids.has(value)); ids.add(value); }
      if (key === 'marker-end') assert.match(value, /^url\(#[a-z0-9-]+\)$/u);
      if (key === 'orient') assert.equal(value, 'auto-start-reverse');
    }
  }
  for (const n of nodes) if (attrs(n)['marker-end']) assert.ok(ids.has(attrs(n)['marker-end'].slice(5, -1)));
  const aria = attrs(root)['aria-labelledby'].split(' '); assert.equal(aria.length, 2);
  for (const type of ['title', 'desc']) { const found = nodes.filter(n => tag(n) === type); assert.equal(found.length, 1); assert.ok(aria.includes(attrs(found[0]).id)); assert.ok(textOf(found[0]).trim()); }
  const metadata = JSON.parse(textOf(nodes.find(n => tag(n) === 'metadata')));
  assert.equal(metadata.asOf, BERMUDA_PENSION_DATA.asOf); assert.equal(metadata.kind, v.kind); assert.equal(metadata.lang, v.lang); assert.equal(metadata.layout, v.mobile ? 'mobile' : 'desktop');
  assert.ok(metadata.sourceIds.every(id => Number.isInteger(id) && id >= 1 && id <= 11)); assert.ok(metadata.metric.trim());
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
    const panel = nodes.slice(0, index).filter(node => tag(node) === 'rect' && Number(attrs(node).rx) > 0).map(shapeBounds).filter(candidate => (box.x + box.right) / 2 > candidate.x && (box.x + box.right) / 2 < candidate.right && (box.y + box.bottom) / 2 > candidate.y && (box.y + box.bottom) / 2 < candidate.bottom).at(-1);
    if (panel) assert.ok(box.x >= panel.x + 2 && box.y >= panel.y + 2 && box.right <= panel.right - 2 && box.bottom <= panel.bottom - 2, `${v.name}: label crosses its own panel: ${label}`);
    for (const cover of nodes.slice(index + 1).filter(node => tag(node) === 'rect' && attrs(node).fill !== 'none')) assert.ok(!overlaps(box, shapeBounds(cover)), `${v.name}: concealed label: ${label}`);
    boxes.push({ ...box, label });
  }
}
function mutate(v, change) { const root = parser.parse(v.svg)[0]; change(root, nodesOf(root)); return { ...v, svg: builder.build([root]) }; }


const originalCompositionHashes = Object.freeze({
  "chain-fr-desktop": "95c539057141efe13499b0a68dcae4eae73af98842ad3ca713f29784ac0d7bf9",
  "chain-fr-mobile": "80cf87c15989533bd6f21e422ca747afd2e3b410203f675677b472222753d3b1",
  "capital-fr-desktop": "91f63b083238ab7d9d82377d048e9a28e365c1fda3664d6558f691644b14f78f",
  "capital-fr-mobile": "65e77d39422a1afc22e64e0ec46859556751afa89430f036e64c4fc5a92c9c93",
  "collateral-fr-desktop": "2a93af77921e5174da490fd9a13f8012aa19093cc83cbce7335a8a9539f62179",
  "collateral-fr-mobile": "f25a5980881c004e4ab1cb704194182b1d091963ccd49b92c6964d981badd4cd",
  "liquidity-fr-desktop": "b07e41d43ac40c4bf3e8cf3d7814f72bf4c657cd30928767d25000f6f99b98e1",
  "liquidity-fr-mobile": "84d4e41d635f134bd0a9f335429b224a4314afa922e2417d1bf72fa1b18cdd93",
  "discounting-fr-desktop": "5d8b36ff6bfdaf3589c5685da88b203287477e97f00bb7e7dc3af27db8ad99ae",
  "discounting-fr-mobile": "91f89a9c1dc05fd28e79d396810058eda8de0ccecbc9eb285d27c8a417c145e7",
  "solvency-fr-desktop": "e75803d1cea96950a33da96fdc2a26ed8aeaabb509cc606b1274c4bf33bef4f5",
  "solvency-fr-mobile": "c1a3c81beb4a9186d8ba4f26461da0688f4b02aaf06c5daec0d82d8a9aa648ae",
  "timeline-fr-desktop": "5115f2110a33bb0b1e7c5985a086900af6e54be2e0fc9704f27139e5d27b3c8a",
  "timeline-fr-mobile": "18882769fab91e74f97c2249988e8c2b624499f62d5916991f5b5a490586288b",
  "chain-en-desktop": "c4f1d80d66b173195e41ef57c6b5c9e9d4e4f1ef054fd1b535b6f0b1610659f0",
  "chain-en-mobile": "67629704b275cdcada596962cd2650775092c11fcf0035a3be43c4dd768659a8",
  "capital-en-desktop": "07f74e538a9cd70fc09a162646dc0ac29836c71867583398be6b808637cd74e8",
  "capital-en-mobile": "517bd46725e92a49ad57539a3846ba9d7f3001b85cba1a675329a984e767fab5",
  "collateral-en-desktop": "62190098ec09dffdd3aa2d86658125b8f6807b3a0f920e402f1ea7df8159ba5c",
  "collateral-en-mobile": "9955f5f6998e559dbf01c6de1a4323ecb090a33dca9c7afad99eeaedeb7072ba",
  "liquidity-en-desktop": "dbfa95d7380b51b0431a35837741c44a74fd4f965c02dcfef946720018b0786a",
  "liquidity-en-mobile": "1c8d436f829b95bc897679e2d5ddbaf66a8cfb164736787966fca595bafb3b49",
  "discounting-en-desktop": "6ff23fd8cd61eb7756704c907dabb49a07301e09ddc3eeb3536bdad2db81e3e5",
  "discounting-en-mobile": "f55d11aca3c32c854039a94e0747270e35f3119463fd92b7dddf9d33caf05487",
  "solvency-en-desktop": "0052aabd267cc49f2b194d444c9459e7b175472c4c1e6e5814dba903cb1ab655",
  "solvency-en-mobile": "e2656d35eacad13b6365c63d2b0a03a17f882e2e041036040442170528fba280",
  "timeline-en-desktop": "cee4b4dbfc7293316f6912ebae1679c9b7459f7851b242a4886b79356f407a65",
  "timeline-en-mobile": "a79fc47c3cf832280b7f07545aa1fd82e730eafbfe9cb83a37ec5f03330120fd"
});
const approvedTextCorrections = Object.freeze([
  {
    "name": "liquidity-fr-desktop",
    "x": "62.00",
    "y": "203.24",
    "old": "8 de cash libre au départ. 5 à payer aux jours 30, 60 et 90. Accès aux garanties seulement au jour 75.",
    "new": "8 M£ de cash initial. 5 M£ tous les 30 jours (J30, J60, J90, J120…). Accès aux actifs à J75."
  },
  {
    "name": "liquidity-fr-mobile",
    "x": "44.00",
    "y": "254.51",
    "old": "8 de cash libre au départ. 5 à payer aux",
    "new": "8 M£ de cash initial. 5 M£ tous les"
  },
  {
    "name": "liquidity-fr-mobile",
    "x": "44.00",
    "y": "278.31",
    "old": "jours 30, 60 et 90. Accès aux garanties",
    "new": "30 jours (J30, J60, J90, J120…)."
  },
  {
    "name": "liquidity-fr-mobile",
    "x": "44.00",
    "y": "302.11",
    "old": "seulement au jour 75.",
    "new": "Accès aux garanties à J75."
  },
  {
    "name": "timeline-fr-desktop",
    "element": "title",
    "old": "Un communiqué ne date pas le transfert",
    "new": "La date du transfert fixe le cadre proposé"
  },
  {
    "name": "timeline-fr-desktop",
    "x": "42.00",
    "y": "89.00",
    "old": "Un communiqué ne date pas le transfert",
    "new": "La date du transfert fixe le cadre proposé"
  },
  {
    "name": "timeline-fr-mobile",
    "element": "title",
    "old": "Un communiqué ne date pas le transfert",
    "new": "La date du transfert fixe le cadre proposé"
  },
  {
    "name": "timeline-fr-mobile",
    "x": "24.00",
    "y": "65.00",
    "old": "Un communiqué ne date",
    "new": "La date du transfert"
  },
  {
    "name": "timeline-fr-mobile",
    "x": "24.00",
    "y": "96.59",
    "old": "pas le transfert",
    "new": "fixe le cadre proposé"
  },
  {
    "name": "liquidity-en-desktop",
    "x": "62.00",
    "y": "203.24",
    "old": "Opening free cash: 8. Payments of 5 on days 30, 60 and 90. Collateral accessible only on day 75.",
    "new": "£8m initial cash. £5m every 30 days (D30, D60, D90, D120…). Assets accessible on day 75."
  },
  {
    "name": "liquidity-en-mobile",
    "x": "44.00",
    "y": "230.71",
    "old": "Opening free cash: 8. Payments of 5 on",
    "new": "£8m initial cash. £5m every 30 days"
  },
  {
    "name": "liquidity-en-mobile",
    "x": "44.00",
    "y": "254.51",
    "old": "days 30, 60 and 90. Collateral accessible",
    "new": "(D30, D60, D90, D120…). Collateral"
  },
  {
    "name": "liquidity-en-mobile",
    "x": "44.00",
    "y": "278.31",
    "old": "only on day 75.",
    "new": "accessible only on day 75."
  },
  {
    "name": "timeline-en-desktop",
    "element": "title",
    "old": "A press release cannot date the transfer",
    "new": "Transfer dates set the proposed treatment"
  },
  {
    "name": "timeline-en-desktop",
    "x": "42.00",
    "y": "89.00",
    "old": "A press release cannot date the transfer",
    "new": "Transfer dates set the proposed treatment"
  },
  {
    "name": "timeline-en-mobile",
    "element": "title",
    "old": "A press release cannot date the transfer",
    "new": "Transfer dates set the proposed treatment"
  },
  {
    "name": "timeline-en-mobile",
    "x": "24.00",
    "y": "65.00",
    "old": "A press release cannot",
    "new": "Transfer dates set the"
  },
  {
    "name": "timeline-en-mobile",
    "x": "24.00",
    "y": "96.59",
    "old": "date the transfer",
    "new": "proposed treatment"
  }
]);

function composition(svg) {
 return nodesOf(parser.parse(svg)[0]).filter(n => tag(n) !== 'metadata').map(n => [tag(n), Object.entries(attrs(n)).filter(([key]) => !['fill', 'stroke', 'font-family', 'style', 'data-bermuda-pension-kind', 'width', 'height'].includes(key) || tag(n) !== 'svg' && ['width', 'height'].includes(key)).sort(([a], [b]) => a.localeCompare(b)), ['title', 'desc', 'text'].includes(tag(n)) ? textOf(n) : '']);
}
function preservesComposition(v) {
 const root = parser.parse(v.svg)[0], nodes = nodesOf(root);
 for (const change of approvedTextCorrections.filter(row => row.name === v.name)) {
  const matches = nodes.filter(n => change.element === 'title' ? tag(n) === 'title' : tag(n) === 'text' && attrs(n).x === change.x && attrs(n).y === change.y);
  assert.equal(matches.length, 1, 'Ambiguous allowed correction'); assert.equal(textOf(matches[0]), change.new, 'Only exact approved wording is allowed'); matches[0][tag(matches[0])] = [{ '#text': change.old }];
 }
 assert.equal(createHash('sha256').update(JSON.stringify(composition(builder.build([root])))).digest('hex'), originalCompositionHashes[v.name], v.name);
}
function closeRounded(a, b, tolerance = .011) { assert.ok(Math.abs(a - b) <= tolerance, `${a} != ${b}`); }
function rects(v, role) { return inspect(v).nodes.filter(n => tag(n) === 'rect' && attrs(n).fill.replace(/\s+/gu, '') === paint(role) && attrs(n).rx === '0'); }

test('all twenty-eight source compositions remain accessible, inert and bound to their original geometry', () => {
 assert.deepEqual(BERMUDA_PENSION_KINDS, ['chain', 'capital', 'collateral', 'liquidity', 'discounting', 'solvency', 'timeline']); assert.equal(variants.length, 28); const ids = new Set();
 const refs = { chain: [5, 1], capital: [6], collateral: [8], liquidity: [8], discounting: [9], solvency: [9], timeline: [6, 11, 1] };
 for (const v of variants) { const { nodes, metadata } = inspect(v); preservesComposition(v); assert.deepEqual(metadata.sourceIds, refs[v.kind]);
  for (const n of nodes) if (attrs(n).id) { assert.ok(!ids.has(attrs(n).id)); ids.add(attrs(n).id); }
  assert.doesNotMatch(v.svg, /(?:deux|two|2) (?:horloges|clocks)|—/iu);
  for (const n of nodes.filter(n => tag(n) === 'title' || tag(n) === 'text' && attrs(n)['font-weight'] === '700')) assert.doesNotMatch(textOf(n), /ce (?:que|qui|qu[’'])|what .* (?:means|reveals|covers)/iu);
 } assert.equal(ids.size, 56);
});
test('licensed source DejaVu contours include every regular and bold label glyph', () => {
 let count = 0; for (const v of variants) for (const n of inspect(v).nodes.filter(node => tag(node) === 'text')) { for (const char of textOf(n)) assert.ok(fonts[attrs(n)['font-weight'] === '700' ? 700 : 400].charToGlyphIndex(char) > 0); count++; } assert.ok(count > 700);
 const licence = read('public/fonts/bermuda-pensions/LICENSE.txt'); assert.match(licence, /DejaVu Sans 2\.37/u); assert.match(licence, /unchanged DejaVu Sans outlines and metrics/u); assert.match(licence, /Copyright \(c\) 2003 by Bitstream/u); assert.match(licence, /Copyright \(c\) 2006 by Tavmjong Bah/u); assert.match(licence, /dejavu-fonts\.github\.io\/License\.html/u);
});
test('all source glyph contours and shapes fit their viewBox without collisions or concealed labels', () => { for (const v of variants) geometry(v); });
test('the collateral examples preserve separate loss, recovery and resource gap accounting', () => {
 const recovered = share => 1050 * share * .95 + 1050 * (1 - share) * .8 - 15;
 closeRounded(recovered(.4), 888); closeRounded(recovered(.9), 966.75); closeRounded(1000 - recovered(.4), 112); closeRounded(1000 - recovered(.9), 33.25);
 for (const v of variants.filter(v => v.kind === 'collateral')) {
  if (v.mobile) { const bars = rects(v, 'signal'), backdrops = rects(v, 'surface-2').filter(n => number(n, 'height') === 29); assert.equal(bars.length, 2); assert.equal(backdrops.length, 2); [recovered(.4), recovered(.9)].forEach((value, i) => closeRounded(number(bars[i], 'width'), number(backdrops[i], 'width') * value / 1000)); }
  else { const bars = ['paper', 'amber', 'accent', 'signal'].flatMap(role => rects(v, role)); assert.equal(bars.length, 5); const start = bars.find(n => attrs(n).fill.replace(/\s+/gu, '') === paint('paper')), end = bars.find(n => attrs(n).fill.replace(/\s+/gu, '') === paint('signal')); closeRounded(number(end, 'height') / number(start, 'height'), 888 / 1050, .0001); }
 }
});
test('monthly pension cash flows require larger bridging when access extends beyond day 120', () => {
 const bridge = day => Math.max(0, 5 * Math.floor((day - 1) / 30) - 8);
 assert.deepEqual([45, 75, 105, 135].map(bridge), [0, 2, 7, 12]);
 for (const v of variants.filter(v => v.kind === 'liquidity')) { const { nodes } = inspect(v), bars = rects(v, 'signal'); assert.equal(bars.length, 3); const unit = (v.mobile ? 200 : 650) / 12; [2, 7, 12].forEach((value, i) => closeRounded(number(bars[i], 'width'), value * unit));
  const correction = approvedTextCorrections.filter(row => row.name === v.name).map(row => row.new).join(' '); assert.match(correction, /(?:J120|D120)/u); assert.match(correction, /(?:tous les 30 jours|every 30 days)/u);
  const curves = nodes.filter(n => tag(n) === 'path'); assert.equal(curves.length, 2); const points = pathPoints(attrs(curves[0]).d); assert.equal(points.length, 6); const step = (points[2][1] - points[1][1]) / 5;
  closeRounded(points[4][1] - points[3][1], 5 * step); closeRounded(points[5][1], points[0][1] + 10 * step); assert.equal(attrs(curves[0]).d, attrs(curves[1]).d);
 }
});
test('present values preserve equal annual cash flows and distinct discount assumptions', () => {
 const pv = rate => Array.from({ length: 25 }, (_, i) => 60 / (1 + rate) ** (i + 1)).reduce((a, b) => a + b, 0), high = pv(.045), low = pv(.04);
 closeRounded(high, 889.6925377627604); closeRounded(low, 937.3247966190532); closeRounded(low - high, 47.63225885629288);
 for (const v of variants.filter(v => v.kind === 'discounting')) { const signal = rects(v, 'signal'), amber = rects(v, 'amber'); assert.equal(signal.length, 26); assert.equal(amber.length, 1); const payments = signal.filter(n => number(n, 'height') === 65); assert.equal(payments.length, 25); for (const n of payments) close(number(n, 'width'), number(payments[0], 'width')); const value = signal.find(n => number(n, 'height') !== 65); closeRounded(number(amber[0], 'width') / number(value, 'width'), low / high, .0001); }
});
test('published solvency ratios remain distinct from pension or asset coverage', () => {
 for (const v of variants.filter(v => v.kind === 'solvency')) { const signal = rects(v, 'signal'), amber = rects(v, 'amber'); assert.equal(signal.length, 1); assert.equal(amber.length, 1); closeRounded(number(signal[0], 'width') / number(amber[0], 'width'), 154 / 144, .0001); assert.match(inspect(v).metadata.metric, /2024-12-31/u); assert.match(v.svg, /12[,.]3/u); assert.match(v.svg, /SCR/u); }
});
test('component preserves both local font faces, closed variants and modest caption and source typography', () => {
 const component = read('src/components/BermudaPensionFigure.astro'), css = postcss.parse(component.slice(component.indexOf('<style>') + 7, component.indexOf('</style>'))), faces = [];
 css.walkAtRules('font-face', rule => faces.push(Object.fromEntries(rule.nodes.filter(n => n.type === 'decl').map(n => [n.prop, n.value])))); assert.deepEqual(faces.map(face => face['font-weight']).sort(), ['400', '700']);
 for (const face of faces) { assert.equal(face['font-family'], "'l0g Bermuda Pensions'"); assert.equal(face['font-style'], 'normal'); assert.equal(face['font-display'], 'swap'); assert.equal(face.src, "url('/fonts/bermuda-pensions/dejavu-sans-" + face['font-weight'] + ".ttf') format('truetype')"); }
 assert.match(component, /container-type: inline-size/u); assert.match(component, /@container \(max-width: 640px\)/u); assert.match(component, /font-size: \.875rem/u); assert.match(component, /bermuda-pension-sources/u); assert.ok(component.indexOf('@media print') > component.indexOf('@container'));
 for (const input of [['de', 'chain', false], ['fr', 'unknown', false], ['fr', 'chain', 'true'], ['en', 'liquidity', 1], ['fr', '__proto__', false]]) assert.throws(() => bermudaPensionSvg(...input), TypeError);
});
test('unsafe external markup, unapproved paints and altered source compositions fail closed', () => {
 const v = variants[0];
 assert.throws(() => inspect(mutate(v, (root, nodes) => { attrs(nodes.find(n => tag(n) === 'line')).href = 'https://example.com/evil.svg'; })));
 assert.throws(() => inspect(mutate(v, root => { root.svg.push({ script: [{ '#text': 'alert(1)' }] }); })));
 assert.throws(() => inspect(mutate(v, (root, nodes) => { attrs(nodes.find(n => tag(n) === 'text')).fill = '#abcdef'; })));
 assert.throws(() => preservesComposition(mutate(v, (root, nodes) => { nodes.find(n => tag(n) === 'text').text = [{ '#text': 'fabricated figure' }]; })));
 assert.throws(() => geometry(mutate(v, (root, nodes) => { attrs(nodes.find(n => tag(n) === 'text')).x = '10000'; })));
 assert.throws(() => geometry(mutate(v, (root, nodes) => { const texts = nodes.filter(n => tag(n) === 'text'); attrs(texts[1]).x = attrs(texts[0]).x; attrs(texts[1]).y = attrs(texts[0]).y; })));
 const cash = variants.find(row => row.kind === 'liquidity' && row.lang === 'fr' && row.mobile); assert.throws(() => preservesComposition(mutate(cash, (root, nodes) => { nodes.find(n => tag(n) === 'text' && textOf(n).includes('J120')).text = [{ '#text': 'Only J30, J60, J90' }]; })));
 const chain = variants.find(row => row.kind === 'chain' && row.lang === 'fr' && !row.mobile);
 assert.throws(() => geometry(mutate(chain, (root, nodes) => { attrs(nodes.find(n => tag(n) === 'text' && textOf(n) === 'Réassureur')).x = '230'; })), /own panel/u);
});
