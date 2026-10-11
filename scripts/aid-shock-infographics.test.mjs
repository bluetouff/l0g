import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { XMLBuilder, XMLParser, XMLValidator } from 'fast-xml-parser';
import opentype from '@shuding/opentype.js';
import postcss from 'postcss';
import { assertFontLicenseReferences } from './font-license-assertions.mjs';
import { aidShockSvg, AID_SHOCK_KINDS, AID_SHOCK_DATA } from '../src/lib/aidShockFigures.mjs';

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const parser = new XMLParser({ preserveOrder: true, ignoreAttributes: false, attributeNamePrefix: '', trimValues: false, parseTagValue: false, parseAttributeValue: false });
const builder = new XMLBuilder({ preserveOrder: true, ignoreAttributes: false, attributeNamePrefix: '' });
const tag = n => Object.keys(n).find(k => k !== ':@'), attrs = n => n[':@'] || {}, children = n => n[tag(n)] || [];
const nodesOf = n => tag(n) === '#text' ? [] : [n, ...children(n).flatMap(nodesOf)];
const textOf = n => tag(n) === '#text' ? n['#text'] : children(n).map(textOf).join('');
const number = (n, key, fallback = 0) => { const value = Number(attrs(n)[key] ?? fallback); assert.ok(Number.isFinite(value), key); return value; };
const variants = ['fr', 'en'].flatMap(lang => AID_SHOCK_KINDS.flatMap(kind => [false, true].map(mobile => ({ lang, kind, mobile, name: `${kind}-${lang}-${mobile ? 'mobile' : 'desktop'}`, svg: aidShockSvg(lang, kind, mobile) }))));
const native = {};
postcss.parse(read('src/styles/global.css')).walkDecls(d => { if (d.parent.type === 'atrule' && d.parent.name === 'theme') native[d.prop] = d.value.replace(/\s+/gu, ''); });
const safePaints = new Set(['none', ...['ink', 'surface', 'surface-2', 'line-strong', 'paper', 'muted', 'amber', 'signal', 'accent', 'topic-blue'].map(role => `var(--color-${role},${native[`--color-${role}`]})`)]);
const safeTags = new Set('svg title desc metadata rect text g line path circle'.split(' '));
const safeAttrs = new Set('xmlns viewBox role aria-labelledby data-aid-shock-kind style id fill stroke stroke-width stroke-dasharray x y width height rx data-region data-bounds font-family font-size font-weight text-anchor x1 y1 x2 y2 d cx cy r stroke-linecap stroke-linejoin'.split(' '));
const fontHashes = { 400: '587bf363c3904914fba51cf8a3e17adcf673246c387524f86ebdc3d22d55819d', 700: 'bf1f283ab6a318592b0afb60c478803f7b703bfa68d0e2dbe1ad361a979b5638' };
const fonts = Object.fromEntries([400, 700].map(weight => {
  const bytes = readFileSync(new URL(`../public/fonts/aid-shock/dejavu-sans-${weight}.ttf`, import.meta.url));
  assert.equal(createHash('sha256').update(bytes).digest('hex'), fontHashes[weight]);
  assert.ok(bytes.length < 40000);
  return [weight, opentype.parse(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength))];
}));
// Baselines come from the 24 supplied source SVGs. Text corrections affect no geometry.
const originalGeometry = {
  "volume-fr-desktop": "1294d12ea45d104470e65136ef0538bef6418be1e3d6a14e33d2b2656e0a7598",
  "volume-fr-mobile": "a6117c586266771c269fc3bac4b1dbb72044bfd797c90c0264dabbe170982b6b",
  "routes-fr-desktop": "4a3acd365eb2e840fc4e13ed71de78960e47d5e21ca6bf4d41a700873db5513c",
  "routes-fr-mobile": "24c9404a8afef7b0695a0a1201ed56162b345370e0ac3dd00db53ae987441ddd",
  "inkind-fr-desktop": "75a084e44753e648ba930449a49e43f934070f62bdc20f9f691f907b16ad28cc",
  "inkind-fr-mobile": "8997e0d6f7446fe10075e61e2cbc34d99a75c0c2b8259e7cb32cd1609a07d5a2",
  "forex-fr-desktop": "1202307c3e3eae2a7e05278a78c39853acc69bda4581de99be1fc0149ab75cd1",
  "forex-fr-mobile": "1017ab2a6c50d78058b6516a87100ffd70ff8076172531c1a5ba3f668c2dff77",
  "service-fr-desktop": "67d659dbd253f495b35e0280ad294497178301985e3e0a0ae26e9ae610ff6679",
  "service-fr-mobile": "a14e8ca8811852d248b9e2ec6d2fdeedf923b26c0fd15709aacb96cdc3284674",
  "multilateral-fr-desktop": "528520a8c61f5575fb7b04f8db95f88dc398bb15ade81fb0edb619dd2bac46a0",
  "multilateral-fr-mobile": "e0ac723af469f5266ab5e4a0800d944abbca5dac296ffdcbeaac044bc5368ce8",
  "volume-en-desktop": "1f17bec7c3ab6cebdadf6f0652d355303ae381aea535489d3e3fcb8d4f8f4672",
  "volume-en-mobile": "3e792584bd19e879418b3e537cb6b9141ef1655e3a4ef8b2e2f40b906db0b00c",
  "routes-en-desktop": "4fd71ec701c25b8c0f27f8c3d51d49d95d0f2e778a0706a7fbc695b9102ce173",
  "routes-en-mobile": "5d23b92ca7dd1770b061550c410510af50bf8bcf9331b6787ef5ae21cccc4f7f",
  "inkind-en-desktop": "25e7216ee85a65ede6a374377ee7467fdfc798e115728be501ab275cce73cd2f",
  "inkind-en-mobile": "aae2660a937e8a7f6b743fa6ee21d7ae257ce2cf8c2b6d660290391e3377106b",
  "forex-en-desktop": "ebf5a7ea3258b3cb65fc913f3dad9796005e75915560dfe18774ef293fc0edea",
  "forex-en-mobile": "63176264604634ca904d5edc39d29042dda5245f8241ba2b72dc66d6433f7252",
  "service-en-desktop": "8adfa9f48e37aeb1cd924fd4092467dd002cfa4c383d9cd87e94a4db28b840bf",
  "service-en-mobile": "75dda4e428aace94d18f232bfab575023d54b300ff9e66bd9e78f462d0707abb",
  "multilateral-en-desktop": "a7a6edccf4bd81b407e4a43225452cd30bd655baffb8b9108dd495d0f92781cd",
  "multilateral-en-mobile": "6df2b75a995da6d20fd8a2e115eebd6b85b31b77a9cb8d424c59f38462b10879"
};
function geometry(svg) {
  return nodesOf(parser.parse(svg)[0]).filter(n => !['title', 'desc', 'metadata'].includes(tag(n))).map(n => [tag(n), Object.entries(attrs(n)).filter(([key]) => key !== 'font-family').sort(([a], [b]) => a.localeCompare(b))]);
}
function inspect(v) {
  assert.equal(XMLValidator.validate(v.svg), true); assert.doesNotMatch(v.svg, /<!|<\?/u);
  const tree = parser.parse(v.svg); assert.equal(tree.length, 1); const root = tree[0], nodes = nodesOf(root), ids = new Set();
  assert.equal(tag(root), 'svg'); assert.equal(attrs(root).xmlns, 'http://www.w3.org/2000/svg');
  assert.equal(attrs(root).role, 'img'); assert.equal(attrs(root).style, 'display:block;width:100%;height:auto');
  assert.equal(attrs(root)['data-aid-shock-kind'], v.name); assert.equal(attrs(root).width, undefined); assert.equal(attrs(root).height, undefined);
  const box = attrs(root).viewBox.split(' ').map(Number); assert.deepEqual(box.slice(0, 2), [0, 0]); assert.equal(box.length, 4);
  assert.equal(box[2], v.mobile ? 400 : 1000); assert.ok(box[3] >= 810 && box[3] <= 1460);
  for (const n of nodes) {
    assert.ok(safeTags.has(tag(n)), tag(n));
    for (const [key, value] of Object.entries(attrs(n))) {
      assert.ok(safeAttrs.has(key), key); assert.equal(typeof value, 'string');
      assert.doesNotMatch(key, /^on/iu);
      if (key === 'xmlns') { assert.equal(n, root); assert.equal(value, 'http://www.w3.org/2000/svg'); }
      else assert.doesNotMatch(value, /javascript:|data:|https?:|@import/iu);
      if (key === 'fill' || key === 'stroke') assert.ok(safePaints.has(value.replace(/\s+/gu, '')), value);
      if (key === 'style') assert.equal(n, root);
      if (key === 'font-family') assert.equal(value, 'l0g Aid Shock, DejaVu Sans, Arial, sans-serif');
      if (key === 'font-size') assert.ok(number(n, key) >= 12 && number(n, key) <= 70);
      if (key === 'font-weight') assert.ok(['400', '700'].includes(value));
      if (key === 'text-anchor') assert.ok(['start', 'middle', 'end'].includes(value));
      if (key === 'id') { assert.match(value, new RegExp(`^aidshock-${v.kind}-${v.lang}-${v.mobile ? 'm' : 'd'}-(?:title|desc)$`, 'u')); assert.ok(!ids.has(value)); ids.add(value); }
    }
  }
  const aria = attrs(root)['aria-labelledby'].split(' '); assert.equal(aria.length, 2);
  for (const type of ['title', 'desc']) { const found = nodes.filter(n => tag(n) === type); assert.equal(found.length, 1); assert.ok(aria.includes(attrs(found[0]).id)); assert.ok(textOf(found[0]).trim()); }
  const metadata = JSON.parse(textOf(nodes.find(n => tag(n) === 'metadata')));
  assert.equal(metadata.asOf, AID_SHOCK_DATA.asOf); assert.equal(metadata.kind, v.kind); assert.equal(metadata.lang, v.lang); assert.equal(metadata.layout, v.mobile ? 'mobile' : 'desktop');
  assert.ok(metadata.sourceIds.every(id => Number.isInteger(id) && id >= 1 && id <= 18)); assert.ok(metadata.status.trim());
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
}
const overlaps = (a, b) => a.x < b.right && a.right > b.x && a.y < b.bottom && a.bottom > b.y;
test('all authored variants retain closed responsive XML and the native palette', () => {
  assert.equal(variants.length, 24);
  for (const v of variants) inspect(v);
});
test('all source geometry and typography coordinates remain intact', () => {
  for (const v of variants) assert.equal(createHash('sha256').update(JSON.stringify(geometry(v.svg))).digest('hex'), originalGeometry[v.name], v.name);
});
test('font outlines keep labels and primitives within every viewBox', () => {
  for (const v of variants) {
    const { nodes, width, height } = inspect(v);
    for (const n of nodes) { const b = tag(n) === 'text' ? textBounds(n) : shapeBounds(n); if (!b) continue;
      assert.ok(b.x >= -.5 && b.y >= -.5 && b.right <= width + .5 && b.bottom <= height + .5, `${v.name}/${tag(n)} ${textOf(n)}: ${JSON.stringify(b)}`);
    }
    const texts = nodes.filter(n => tag(n) === 'text');
    for (let i = 0; i < texts.length; i++) for (let j = i + 1; j < texts.length; j++) assert.ok(!overlaps(textBounds(texts[i]), textBounds(texts[j])), `${v.name}: ${textOf(texts[i])} / ${textOf(texts[j])}`);
  }
});
test('net-flow volume keeps its conditional 2026 index distinct from grant-equivalent ODA', () => {
  for (const v of variants.filter(v => v.kind === 'volume')) {
    const { metadata, nodes } = inspect(v), d = metadata.data;
    assert.equal(d.baseYear, 2024); assert.equal(d.rows[0].value, 100);
    const projected = 100 * (1 - 23.3 / 100) * (1 - 6.9 / 100);
    assert.ok(Math.abs(d.rows[2].value - projected) < 1e-10); assert.equal(d.rows[1].value, 76.7);
    assert.match(d.metric, /cash-flow.*constant 2024 USD/u); assert.match(d.rows[1].status, /preliminary/u); assert.match(d.rows[2].status, /projection issued 2026-06-19/u);
    const bars = nodes.filter(n => tag(n) === 'rect' && number(n, 'width') === (v.mobile ? 340 : 136));
    if (!v.mobile) { const reference = bars.find(n => attrs(n).fill.includes('--color-muted')); const latest = nodes.find(n => tag(n) === 'rect' && attrs(n).stroke.includes('--color-amber') && number(n, 'width') === 136); assert.ok(Math.abs(number(latest, 'height') / number(reference, 'height') - projected / 100) < .001); }
  }
});
test('the hypothetical consignment keeps both current-account entries and goods availability', () => {
  for (const v of variants.filter(v => v.kind === 'inkind')) {
    const { metadata } = inspect(v), d = metadata.data;
    assert.match(d.status, /hypothetical/u); assert.deepEqual(d.cases.map(c => c.currentAccountEffect), [0, 0, -100]);
    assert.deepEqual(d.cases.map(c => c.medicinesAvailable), [100, 0, 100]);
    for (const c of d.cases) assert.equal(c.goodsDebit + c.transferCredit, c.currentAccountEffect);
  }
});
test('WHO reporting percentages retain each question denominator and their scope', () => {
  for (const v of variants.filter(v => v.kind === 'service')) {
    const { metadata, nodes } = inspect(v), d = metadata.data;
    assert.equal(d.respondents, 108); assert.deepEqual(d.rows.map(row => row.denominator), [105, 106]); assert.deepEqual(d.rows.map(row => row.value), [66, 54]);
    assert.match(d.respondentsScope, /question-specific/u); assert.match(d.unit, /not percent lost capacity/u);
    const description = textOf(nodes.find(n => tag(n) === 'desc'));
    assert.match(description, /105/u); assert.match(description, /106/u); assert.match(description, /108/u);
    const bars = nodes.filter(n => tag(n) === 'rect' && ['--color-signal', '--color-topic-blue'].some(role => attrs(n).fill.includes(role)) && number(n, 'width') > 10 && number(n, 'height') === (v.mobile ? 22 : 25));
    assert.equal(bars.length, 2); assert.ok(Math.abs(number(bars[0], 'width') / number(bars[1], 'width') - 66 / 54) < .001);
  }
});
test('IDA21 donor pledges and multi-year financing capacity cannot be added as annual cash', () => {
  for (const v of variants.filter(v => v.kind === 'multilateral')) { const d = inspect(v).metadata.data;
    assert.equal(d.donorPledgesUSDbn, 23.7); assert.equal(d.financingCapacityUSDbn, 100); assert.equal(d.additive, false);
    assert.equal(d.periodStart, '2025-07-01'); assert.equal(d.periodEnd, '2028-06-30'); assert.equal(d.announcementDate, '2024-12-05');
  }
});
test('component preserves local faces, closed variants, compact source type and safe selectors', () => {
  const component = read('src/components/AidShockFigure.astro'), css = postcss.parse(component.slice(component.indexOf('<style>') + 7, component.indexOf('</style>'))), faces = [];
  css.walkAtRules('font-face', rule => faces.push(Object.fromEntries(rule.nodes.filter(n => n.type === 'decl').map(n => [n.prop, n.value])))); assert.deepEqual(faces.map(face => face['font-weight']).sort(), ['400', '700']);
  for (const face of faces) { assert.equal(face['font-family'], "'l0g Aid Shock'"); assert.equal(face['font-style'], 'normal'); assert.equal(face['font-display'], 'swap'); assert.equal(face.src, "url('/fonts/aid-shock/dejavu-sans-" + face['font-weight'] + ".ttf') format('truetype')"); }
  assert.match(component, /container-type: inline-size/u); assert.match(component, /@container \(max-width: 640px\)/u); assert.match(component, /font-size: \.875rem/u); assert.match(component, /aid-shock-sources/u); assert.match(component, /max-width: 25rem/u);
  for (const input of [['de', 'volume', false], ['fr', 'unknown', false], ['fr', 'volume', 'true'], ['en', 'forex', 1], ['fr', '__proto__', false]]) assert.throws(() => aidShockSvg(...input), TypeError);
});
test('licensed DejaVu subsets preserve canonical provenance and author notices', () => {
  const licence = read('public/fonts/aid-shock/LICENSE.txt');
  assertFontLicenseReferences(licence, 'dejavu');
  assert.match(licence, /DejaVu Sans 2\.37/u); assert.match(licence, /unchanged DejaVu Sans outlines and metrics/u);
  assert.match(licence, /Copyright \(c\) 2003 by Bitstream/u); assert.match(licence, /Copyright \(c\) 2006 by Tavmjong Bah/u);
  for (const v of variants) for (const node of inspect(v).nodes.filter(n => tag(n) === 'text')) for (const char of textOf(node)) assert.ok(fonts[number(node, 'font-weight')].charToGlyphIndex(char), `${v.name}: ${char}`);
});
test('unsafe authored markup is rejected before any insertion', () => {
  const v = variants[0], mutations = [v.svg.replace('<rect', '<script'), v.svg.replace('<rect', '<foreignObject'), v.svg.replace('<rect', '<image'), v.svg.replace('<rect', '<a href="https://example.com"'), v.svg.replace('fill="none"', 'fill="url(https://example.com)"'), v.svg.replace('<rect', '<rect onclick="alert(1)"'), v.svg.replace('xmlns="http://www.w3.org/2000/svg"', 'xmlns="https://example.com"')];
  for (const svg of mutations) { assert.notEqual(svg, v.svg); assert.throws(() => inspect({ ...v, svg })); }
});
