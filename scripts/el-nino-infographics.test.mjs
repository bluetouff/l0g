import { assertFontLicenseReferences } from './font-license-assertions.mjs';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { XMLBuilder, XMLParser, XMLValidator } from 'fast-xml-parser';
import { fromHtml } from 'hast-util-from-html';
import { toText } from 'hast-util-to-text';
import opentype from '@shuding/opentype.js';
import postcss from 'postcss';
import { elNinoSvg, EL_NINO_KINDS, EL_NINO_DATA } from '../src/lib/elNinoFigures.mjs';

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const parser = new XMLParser({ preserveOrder: true, ignoreAttributes: false, attributeNamePrefix: '', trimValues: false, parseTagValue: false, parseAttributeValue: false });
const builder = new XMLBuilder({ preserveOrder: true, ignoreAttributes: false, attributeNamePrefix: '' });
const tag = node => Object.keys(node).find(key => key !== ':@');
const attrs = node => node[':@'] || {};
const children = node => node[tag(node)] || [];
const nodesOf = node => tag(node) === '#text' ? [] : [node, ...children(node).flatMap(nodesOf)];
const textOf = node => tag(node) === '#text' ? node['#text'] : children(node).map(textOf).join('');
const number = (node, key, fallback = 0) => { const value = Number(attrs(node)[key] ?? fallback); assert.ok(Number.isFinite(value), key); return value; };
const close = (a, b) => assert.ok(Math.abs(a - b) < 1e-8, `${a} != ${b}`);
const variants = ['fr', 'en'].flatMap(lang => EL_NINO_KINDS.flatMap(kind => [false, true].map(mobile => ({ lang, kind, mobile, name: `${kind}-${lang}-${mobile ? 'mobile' : 'desktop'}`, svg: elNinoSvg(lang, kind, mobile) }))));
const native = {};
postcss.parse(read('src/styles/global.css')).walkDecls(decl => { if (decl.parent.type === 'atrule' && decl.parent.name === 'theme') native[decl.prop] = decl.value.replace(/\s+/gu, ''); });
const paint = role => `var(--color-${role}, ${native[`--color-${role}`]})`;
const safePaints = new Set(['none', ...['ink', 'surface', 'surface-2', 'line-strong', 'paper', 'muted', 'signal', 'amber', 'topic-blue'].map(paint)]);
const safeTags = new Set('svg title desc metadata g rect text path line circle'.split(' '));
const safeAttributes = new Set('xmlns viewBox role aria-labelledby data-el-nino-kind style id data-region data-bounds x y width height rx fill stroke stroke-width font-family font-size font-weight text-anchor d stroke-linejoin stroke-linecap stroke-dasharray x1 y1 x2 y2 cx cy r'.split(' '));

function inspect(variant) {
  const svg = variant.svg;
  assert.equal(XMLValidator.validate(svg), true);
  assert.doesNotMatch(svg, /<!|<\?/u);
  const tree = parser.parse(svg); assert.equal(tree.length, 1);
  const root = tree[0], nodes = nodesOf(root), ids = new Set();
  assert.equal(tag(root), 'svg'); assert.equal(attrs(root).xmlns, 'http://www.w3.org/2000/svg');
  assert.equal(attrs(root).role, 'img'); assert.equal(attrs(root).style, 'display:block;width:100%;height:auto');
  assert.equal(attrs(root)['data-el-nino-kind'], variant.name);
  const box = attrs(root).viewBox.split(' ').map(Number);
  assert.equal(box.length, 4); assert.deepEqual(box.slice(0, 2), [0, 0]);
  assert.equal(box[2], variant.mobile ? 400 : 1000); assert.ok(box[3] > 500 && box[3] <= 1410);
  for (const node of nodes) {
    assert.ok(safeTags.has(tag(node)), tag(node));
    for (const [key, value] of Object.entries(attrs(node))) {
      assert.ok(safeAttributes.has(key), key); assert.equal(typeof value, 'string');
      assert.doesNotMatch(value, /url\(|javascript:|data:|@import/iu);
      if (key === 'fill' || key === 'stroke') assert.ok(safePaints.has(value), value);
      if (key === 'style') assert.equal(node, root);
      if (key === 'font-family') assert.equal(value, 'l0g El Nino, DejaVu Sans, Arial, sans-serif');
      if (key === 'font-size') assert.ok(number(node, key) >= 12 && number(node, key) <= 64);
      if (key === 'font-weight') assert.ok(['400', '700'].includes(value));
      if (key === 'text-anchor') assert.ok(['start', 'middle', 'end'].includes(value));
      if (key === 'id') { assert.match(value, /^enino-(?:ocean|forecast|crops|water|stocks|macro)-(?:fr|en)-(?:d|m)-(?:title|desc)$/u); assert.ok(!ids.has(value)); ids.add(value); }
    }
  }
  const aria = attrs(root)['aria-labelledby'].split(' '); assert.equal(aria.length, 2);
  for (const type of ['title', 'desc']) {
    const found = nodes.filter(node => tag(node) === type); assert.equal(found.length, 1);
    assert.ok(aria.includes(attrs(found[0]).id)); assert.ok(textOf(found[0]).trim());
  }
  const metadata = JSON.parse(textOf(nodes.find(node => tag(node) === 'metadata')));
  assert.equal(metadata.asOf, EL_NINO_DATA.asOf); assert.equal(metadata.kind, variant.kind);
  assert.equal(metadata.lang, variant.lang); assert.equal(metadata.layout, variant.mobile ? 'mobile' : 'desktop');
  assert.ok(metadata.sourceIds.length > 0); assert.ok(metadata.sourceIds.every(id => Number.isInteger(id) && id >= 1 && id <= 18));
  return { root, nodes, width: box[2], height: box[3], metadata };
}

const fontHashes = { 400: '3c38a9eba5a7650a36aacf5e81df5e7d4807c405e6fcc2848ad97cf5a96cb3ae', 700: '2316f50dd772dae46f92b4523c3ee90c7440262260dfae5894adeedd407fbf0a' };
const fonts = Object.fromEntries([400, 700].map(weight => {
  const bytes = readFileSync(new URL(`../public/fonts/el-nino/dejavu-sans-${weight}.ttf`, import.meta.url));
  assert.equal(createHash('sha256').update(bytes).digest('hex'), fontHashes[weight]);
  assert.ok(bytes.length < 50000);
  return [weight, opentype.parse(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength))];
}));

// The outlines come from the same checked local fonts that the browser loads.
// Their control-point envelope conservatively contains the entire painted glyph.
// This avoids hundreds of separate raster jobs during the source-only CI phase.
function textBounds(node) {
  const value = textOf(node), face = fonts[attrs(node)['font-weight']], size = number(node, 'font-size');
  for (const char of value) assert.ok(face.charToGlyphIndex(char) > 0, `Missing glyph U+${char.codePointAt(0).toString(16)}`);
  const advance = face.getAdvanceWidth(value, size), anchor = attrs(node)['text-anchor'];
  const x = number(node, 'x') - (anchor === 'middle' ? advance / 2 : anchor === 'end' ? advance : 0);
  const commands = face.getPath(value, x, number(node, 'y'), size).commands.filter(command => command.type !== 'Z');
  return pointsBox(commands.flatMap(command => ['x', 'x1', 'x2'].flatMap((key, i) => key in command ? [[command[key], command[['y', 'y1', 'y2'][i]]]] : [])));
}
function pointsBox(points) {
  assert.ok(points.length > 0 && points.flat().every(Number.isFinite));
  return { x: Math.min(...points.map(p => p[0])), y: Math.min(...points.map(p => p[1])), right: Math.max(...points.map(p => p[0])), bottom: Math.max(...points.map(p => p[1])) };
}
function pathPoints(data) {
  const tokens = data.match(/[MLCQZ]|[-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?/gu) || [];
  assert.equal(data.replace(/[MLCQZ]|[-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?|[\s,]/gu, ''), '', 'Unsupported path syntax');
  const points = [];
  for (let i = 0; i < tokens.length;) {
    const command = tokens[i++]; assert.ok(['M', 'L', 'C', 'Q', 'Z'].includes(command));
    const count = { M: 2, L: 2, C: 6, Q: 4, Z: 0 }[command];
    const values = tokens.slice(i, i + count).map(Number); assert.equal(values.length, count); assert.ok(values.every(Number.isFinite));
    for (let j = 0; j < count; j += 2) points.push([values[j], values[j + 1]]);
    i += count;
  }
  return points;
}
function shapeBounds(node) {
  const t = tag(node);
  if (t === 'rect') return { x: number(node, 'x'), y: number(node, 'y'), right: number(node, 'x') + number(node, 'width'), bottom: number(node, 'y') + number(node, 'height') };
  if (t === 'circle') return { x: number(node, 'cx') - number(node, 'r'), y: number(node, 'cy') - number(node, 'r'), right: number(node, 'cx') + number(node, 'r'), bottom: number(node, 'cy') + number(node, 'r') };
  if (t === 'line') return pointsBox([[number(node, 'x1'), number(node, 'y1')], [number(node, 'x2'), number(node, 'y2')]]);
  if (t === 'path') return pointsBox(pathPoints(attrs(node).d));
}
const overlaps = (a, b) => a.x < b.right && a.right > b.x && a.y < b.bottom && a.bottom > b.y;
function geometry(variant) {
  const { root, nodes, width, height } = inspect(variant), boxes = [];
  const parents = new Map();
  const link = node => { for (const child of children(node)) if (tag(child) !== '#text') { parents.set(child, node); link(child); } }; link(root);
  for (const [index, node] of nodes.entries()) {
    if (['rect', 'line', 'circle', 'path'].includes(tag(node))) {
      const b = shapeBounds(node), pad = attrs(node).stroke && attrs(node).stroke !== 'none' ? number(node, 'stroke-width') / 2 : 0;
      assert.ok(b.x - pad >= -0.5 && b.y - pad >= -0.5 && b.right + pad <= width + 0.5 && b.bottom + pad <= height + 0.5, `${variant.name}: shape outside viewBox`);
    }
    if (tag(node) !== 'text') continue;
    const b = textBounds(node), value = textOf(node);
    assert.ok(b.x >= 2 && b.y >= 2 && b.right <= width - 2 && b.bottom <= height - 2, `${variant.name}: glyph outside viewBox: ${value}`);
    let region = parents.get(node);
    while (region && !attrs(region)['data-bounds']) region = parents.get(region);
    if (region) {
      const [x, y, w, h] = attrs(region)['data-bounds'].split(' ').map(Number); assert.ok([x, y, w, h].every(Number.isFinite) && w > 0 && h > 0);
      assert.ok(b.x >= x - 1 && b.y >= y - 1 && b.right <= x + w + 1 && b.bottom <= y + h + 1, `${variant.name}: glyph outside label region: ${value}`);
    }
    for (const previous of boxes) assert.ok(!overlaps(b, previous), `${variant.name}: glyph collision: ${value}/${previous.label}`);
    for (const cover of nodes.slice(index + 1).filter(n => tag(n) === 'rect' && attrs(n).fill !== 'none')) assert.ok(!overlaps(b, shapeBounds(cover)), `${variant.name}: concealed glyph: ${value}`);
    boxes.push({ ...b, label: value });
  }
}
function mutate(variant, change) {
  const root = parser.parse(variant.svg)[0]; change(root, nodesOf(root));
  return { ...variant, svg: builder.build([root]) };
}

test('twenty-four inert accessible compositions preserve their native palette and unique identifiers', () => {
  assert.deepEqual(EL_NINO_KINDS, ['ocean', 'forecast', 'crops', 'water', 'stocks', 'macro']); assert.equal(variants.length, 24);
  const ids = new Set();
  for (const variant of variants) {
    const { nodes } = inspect(variant);
    for (const node of nodes) if (attrs(node).id) { assert.ok(!ids.has(attrs(node).id)); ids.add(attrs(node).id); }
    assert.doesNotMatch(textOf(nodes.find(node => tag(node) === 'title')), /ce (?:que|qui|qu[’'])|what .* (?:means|reveals)|—/iu);
    if (variant.lang === 'fr') assert.doesNotMatch(textOf(nodes.find(node => tag(node) === 'desc')), /^(?:Two |NOAA probabilities|Historical descriptive|A conceptual|Forecast rice|Conditional macroeconomic)/u);
  }
  assert.equal(ids.size, 48);
});
test('local regular and bold fonts cover all figure characters and carry their redistribution licence', () => {
  const chars = new Set(variants.flatMap(v => inspect(v).nodes.filter(n => tag(n) === 'text').flatMap(n => [...textOf(n)])));
  for (const face of Object.values(fonts)) for (const char of chars) assert.ok(face.charToGlyphIndex(char) > 0, `Missing glyph U+${char.codePointAt(0).toString(16)}`);
  const component = read('src/components/ElNinoFigure.astro'), start = component.indexOf('<style>'), end = component.indexOf('</style>'); assert.ok(start >= 0 && end > start);
  const css = postcss.parse(component.slice(start + 7, end)), faces = [];
  css.walkAtRules('font-face', rule => faces.push(Object.fromEntries(rule.nodes.filter(n => n.type === 'decl').map(n => [n.prop, n.value]))));
  assert.deepEqual(faces.map(face => face['font-weight']).sort(), ['400', '700']);
  for (const face of faces) { assert.equal(face['font-family'], "'l0g El Nino'"); assert.equal(face['font-style'], 'normal'); assert.equal(face['font-display'], 'swap'); assert.equal(face.src, `url('/fonts/el-nino/dejavu-sans-${face['font-weight']}.ttf') format('truetype')`); }
  const licence = read('public/fonts/el-nino/LICENSE.txt'); assertFontLicenseReferences(licence, 'dejavu'); assert.match(licence, /Copyright \(c\) 2003 by Bitstream/u); assert.match(licence, /Copyright \(c\) 2006 by Tavmjong Bah/u); assert.match(licence, /Permission is hereby granted/u);
});
test('every visible shape and checked-font glyph fits its canvas and label region without collisions or concealment', () => { for (const variant of variants) geometry(variant); });
test('structural and geometric regressions reject executable markup, external paints, displaced shapes and unsupported glyphs', () => {
  const variant = variants[0];
  for (const payload of ['<script>alert(1)</script>', '<image href="https://example.com/a"/>', '<foreignObject/>']) assert.throws(() => inspect({ ...variant, svg: variant.svg.replace('</svg>', `${payload}</svg>`) }));
  assert.throws(() => inspect({ ...variant, svg: variant.svg.replace('<svg ', '<svg onload="alert(1)" ') }));
  assert.throws(() => inspect(mutate(variant, (_, nodes) => { attrs(nodes.find(n => tag(n) === 'rect')).fill = 'url(https://example.com/a)'; })));
  assert.throws(() => geometry(mutate(variant, (_, nodes) => { attrs(nodes.find(n => tag(n) === 'rect')).x = '5000'; })), /shape outside viewBox/u);
  assert.throws(() => geometry(mutate(variant, (_, nodes) => { attrs(nodes.find(n => tag(n) === 'text')).x = '5000'; })), /glyph outside viewBox/u);
  assert.throws(() => geometry(mutate(variant, (_, nodes) => { nodes.find(n => tag(n) === 'text').text = [{ '#text': '\u{1f984}' }]; })), /Missing glyph/u);
  assert.throws(() => geometry(mutate(variant, root => { const n = nodesOf(root).find(n => tag(n) === 'text'); root.svg.push(structuredClone(n)); })), /glyph collision/u);
});
test('variant selectors fail closed on unknown names, prototypes and invalid mobile types', () => {
  for (const args of [['xx', 'water', false], ['fr', '<script>', false], ['en', '__proto__', false], ['fr', 'ocean', 'false'], [null, 'ocean', false]]) assert.throws(() => elNinoSvg(...args), TypeError);
});
test('NOAA probabilities retain their threshold and overlapping periods, with proportional zero-based bars', () => {
  const forecast = EL_NINO_DATA.noaaForecast;
  assert.equal(forecast.published, '2026-10-08'); assert.deepEqual(forecast.rows.map(row => row.value), [54, 83, 70]);
  assert.match(forecast.metric, /three-month RONI.*\+2\.5/u); assert.equal(forecast.unit, 'percent');
  assert.equal(forecast.overlappingPeriods, true); assert.equal(forecast.independentEvents, false); assert.equal(forecast.economicLossProbability, false);
  for (const variant of variants.filter(v => v.kind === 'forecast')) {
    const { nodes } = inspect(variant), bars = nodes.filter(n => tag(n) === 'rect' && number(n, 'height') === (variant.mobile ? 24 : 25) && [paint('topic-blue'), paint('signal')].includes(attrs(n).fill));
    assert.equal(bars.length, 3);
    bars.forEach((bar, i) => { close(number(bar, 'width') / (variant.mobile ? 344 : 562), forecast.rows[i].value / 100); close(number(bar, 'x'), variant.mobile ? 28 : 334); });
  }
});
test('rice stock arithmetic and proportional segments preserve milled tonnes, marketing seasons and unknown exportable volume', () => {
  const stock = EL_NINO_DATA.riceStocks; close(stock.chinaCalculated, stock.world - stock.exChina); close(stock.chinaSharePercentCalculated, 100 * stock.chinaCalculated / stock.world);
  assert.equal(stock.unit, 'million tonnes, milled basis'); assert.match(stock.period, /national 2026\/27 marketing seasons/u); assert.equal(stock.status, 'forecast');
  assert.equal(stock.freelyExportableVolume, null); assert.equal(stock.simultaneousPhysicalCensus, false);
  for (const variant of variants.filter(v => v.kind === 'stocks')) {
    const bars = inspect(variant).nodes.filter(n => tag(n) === 'rect' && number(n, 'height') === (variant.mobile ? 45 : 63) && [paint('topic-blue'), paint('amber')].includes(attrs(n).fill));
    assert.equal(bars.length, 2); close(number(bars[0], 'width') / (variant.mobile ? 352 : 928), stock.chinaCalculated / stock.world); close(number(bars[1], 'width') / (variant.mobile ? 352 : 928), stock.exChina / stock.world); close(number(bars[0], 'x') + number(bars[0], 'width'), number(bars[1], 'x'));
  }
});
test('historical yield ranges use the same trend deviation scale without implying confidence intervals or a 2026 forecast', () => {
  const yields = EL_NINO_DATA.yieldRanges; assert.deepEqual(yields.rice, [-1.5, -1]); assert.deepEqual(yields.soybean, [1.5, 2]); assert.equal(yields.rangesAreConfidenceIntervals, false); assert.match(yields.status, /not a 2026 forecast/u);
  for (const variant of variants.filter(v => v.kind === 'crops')) {
    const ranges = inspect(variant).nodes.filter(n => tag(n) === 'line' && number(n, 'stroke-width') === (variant.mobile ? 15 : 17)); assert.equal(ranges.length, 2);
    const zero = variant.mobile ? 197 : 590.5, scale = variant.mobile ? 61.2 : 133.8;
    for (const [i, values] of [yields.rice, yields.soybean].entries()) { close((number(ranges[i], 'x1') - zero) / scale, values[0]); close((number(ranges[i], 'x2') - zero) / scale, values[1]); }
  }
});
test('both article versions retain six figures, the same eighteen HTTPS sources and valid source anchors', () => {
  const elements = tree => [tree, ...(tree.children || []).flatMap(elements)].filter(n => n.type === 'element'), sourceUrls = [];
  for (const [lang, path] of [['fr', 'src/content/posts/el-nino-secours-meme-pluie.mdx'], ['en', 'src/content/posts-en/el-nino-backup-same-rain.mdx']]) {
    const article = read(path), nodes = elements(fromHtml(article, { fragment: true })), sources = nodes.filter(n => n.tagName === 'li' && /^source-\d+$/u.test(n.properties.id || ''));
    assert.equal(sources.length, 18); assert.equal(new Set(sources.map(n => n.properties.id)).size, 18);
    const anchors = new Set(sources.map(n => n.properties.id));
    for (const node of nodes.filter(n => n.tagName === 'a' && /^#source-/u.test(n.properties.href || ''))) assert.ok(anchors.has(node.properties.href.slice(1)), node.properties.href);
    const figures = nodes.filter(n => n.tagName === 'elninofigure'); assert.equal(figures.length, 6);
    assert.deepEqual(figures.map(n => n.properties.kind), EL_NINO_KINDS);
    for (const figure of figures) { assert.equal(figure.properties.lang, lang); assert.ok(figure.properties.caption.trim()); for (const id of figure.properties.sources.split(' ')) assert.ok(anchors.has(`source-${id}`), id); }
    const urls = sources.map(source => { const link = elements(source).find(n => n.tagName === 'a'); assert.ok(link); assert.equal(new URL(link.properties.href).protocol, 'https:'); assert.ok(toText(link).trim()); return link.properties.href; }); sourceUrls.push(urls);
    assert.doesNotMatch(article, /—|\[S\d+\]|turn\d+(?:search|view)/u);
    if (lang === 'en') { assert.match(article, /^sourceArticle: el-nino-secours-meme-pluie$/mu); assert.match(article, /^sourceUpdatedDate: 2026-10-11/mu); }
  }
  assert.deepEqual(sourceUrls[0], sourceUrls[1]);
});
