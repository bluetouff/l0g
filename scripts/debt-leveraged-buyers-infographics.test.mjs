import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { XMLBuilder, XMLParser, XMLValidator } from 'fast-xml-parser';
import opentype from '@shuding/opentype.js';
import postcss from 'postcss';

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const parser = new XMLParser({ preserveOrder: true, ignoreAttributes: false, attributeNamePrefix: '', trimValues: false, parseTagValue: false, parseAttributeValue: false, htmlEntities: true });
const builder = new XMLBuilder({ preserveOrder: true, ignoreAttributes: false, attributeNamePrefix: '' });
const tag = node => Object.keys(node).find(key => key !== ':@');
const attrs = node => node[':@'] ?? {};
const children = node => node[tag(node)] ?? [];
const nodesOf = node => tag(node) === '#text' ? [] : [node, ...children(node).flatMap(nodesOf)];
const textOf = node => tag(node) === '#text' ? node['#text'] : children(node).map(textOf).join('');
const number = (node, key, fallback = 0) => {
  const value = attrs(node)[key] ?? String(fallback);
  assert.match(value, /^-?(?:\d+(?:\.\d+)?|\.\d+)$/u, key);
  const result = Number(value);
  assert.ok(Number.isFinite(result), key);
  return result;
};
const close = (actual, expected, tolerance = 0.011) => assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} != ${expected}`);
const kinds = ['01-circuit', '02-capital', '03-rendement', '04-liquidite', '05-strategies'];
const sourceIds = [['01', '04', '06', '07', '09'], ['06', '08', '09'], ['10'], ['06', '07', '16'], ['11', '12', '13']];
const heights = { desktop: [1020, 940, 1090, 1130, 1100], mobile: [1650, 1310, 1420, 1610, 1370] };
const articles = ['fr', 'en'].map(lang => ({ lang, raw: read(`src/content/${lang === 'fr' ? 'posts' : 'posts-en'}/dette-etats-03-acheteurs-credit.mdx`) }));
function extractSvg(raw) {
  const result = [];
  let offset = 0;
  for (;;) {
    const start = raw.indexOf('<svg ', offset);
    if (start === -1) break;
    const end = raw.indexOf('</svg>', start);
    assert.ok(end > start && end - start < 100_000, 'Complete bounded SVG');
    result.push(raw.slice(start, end + 6));
    offset = end + 6;
  }
  return result;
}
const variants = articles.flatMap(({ lang, raw }) => {
  const figures = extractSvg(raw);
  assert.equal(figures.length, 10, lang);
  return figures.map((svg, index) => {
    const kind = kinds[Math.floor(index / 2)], mobile = index % 2 === 1;
    return { lang, kind, mobile, name: `${kind}-${lang}-${mobile ? 'mobile' : 'desktop'}`, prefix: `d3-${kind}-${lang}-${mobile ? 'm' : 'd'}`, svg };
  });
});
const paintTokens = new Map([
  ['#101d2b', 'var(--color-ink)'], ['#192a3a', 'var(--color-surface-2)'],
  ['#f6f0e4', 'var(--color-paper)'], ['#acbdc8', 'var(--color-muted)'],
  ['#647e93', 'var(--color-muted)'], ['#73dbc2', 'var(--color-signal)'],
  ['#f1b56f', 'var(--color-amber)'], ['#e99398', 'var(--color-accent)'],
  ['#88b9f2', 'var(--color-topic-blue)'], ['#dce8e7', 'var(--color-bright)'],
  ['#385064', 'var(--color-line-strong)'],
]);
const paint = original => {
  assert.ok(paintTokens.has(original), `Unknown original paint ${original}`);
  return paintTokens.get(original);
};
const paints = new Set(['none', ...paintTokens.values()]);
const allowedAttributes = Object.fromEntries(Object.entries({
  svg: 'xmlns viewBox width height role aria-labelledby style lang',
  title: 'id', desc: 'id',
  path: 'd fill stroke opacity stroke-width stroke-linejoin stroke-linecap',
  rect: 'x y width height rx fill stroke stroke-width',
  text: 'x y font-family font-size font-weight fill text-anchor letter-spacing',
  line: 'x1 y1 x2 y2 stroke stroke-width stroke-dasharray',
  polygon: 'points fill', circle: 'cx cy r fill stroke stroke-width',
}).map(([key, value]) => [key, new Set(value.split(' ').filter(Boolean))]));
const numericAttributes = new Set('x y x1 y1 x2 y2 width height rx cx cy r font-size stroke-width opacity letter-spacing'.split(' '));

// Ordered XML fingerprints of the original supplied figures, after semantic paint mapping.
// These cover every label, shape, coordinate, attribute and element order.
const originalSignatures = {
  "01-circuit-en-desktop": "ddc03e26ab9b1a6b7dec5d735fb24ac0f55028855b1c1a0fd815c190cf024a37",
  "01-circuit-en-mobile": "af069bc4796f693872212b06de15268373c37a10cc84867b3fa561e10859e2cf",
  "01-circuit-fr-desktop": "a4b0bfeaff633d73ab8cdb1deba67da4081158b57587a2069170ebce8830a94e",
  "01-circuit-fr-mobile": "661d220b59b8c2d7faac83cdb3065538b5f50d0bc17db4297109ab50c90692a7",
  "02-capital-en-desktop": "ae33715a183bbf26965208f9bcdfeab88ab1224330b3c7d1cd787d4783ca0679",
  "02-capital-en-mobile": "55c316f29e6bf4ca6f3e1cc8cbddb1898c62974728bd02ce9a6863799a658f2b",
  "02-capital-fr-desktop": "7f59ce6c47955c6e073e8eceee2db7b38b694d1c39dc740c38cdc16c895b2dc4",
  "02-capital-fr-mobile": "d2ff4cf424adfff0efdfffaed9dc077029074389dab7ba1624ff1ad6ae253c57",
  "03-rendement-en-desktop": "d713c691c170b8205c3690a99b75c4860a0c4ec8d38c43e9f5f33c9ed02aa4e2",
  "03-rendement-en-mobile": "0d919fd49baf80a68bd9f8b567c6f7ac4a02a7494457f320d4afd77c27073c3a",
  "03-rendement-fr-desktop": "96d788a6b52684b785d71b5fe7757490a0eaaa3f27fc5d0968d8c74def1736e5",
  "03-rendement-fr-mobile": "0d8f0239c5e14699879e968fead653077501c5879d61a14b2307fc53f1e5e33c",
  "04-liquidite-en-desktop": "33233683fd0b32a4c69a471abfaddbaa2cdd09db814c078e9bc3a0ac13a98f5e",
  "04-liquidite-en-mobile": "1a01bfd93331b9491b3cd94f6192fa56170107f5865c1bb9eaf00c5593dacbcd",
  "04-liquidite-fr-desktop": "bb71ec542689e6e5e93e05658a5930aca214cc6238f2e883529d22aabfef815e",
  "04-liquidite-fr-mobile": "872c925d26b1285865a8a56fdc31be94b7723f151b907afead91d27f640bffb3",
  "05-strategies-en-desktop": "d6b9f077da54277abf43b309a257b5e5e69358077f9fc489e6573ba1b1cbf86b",
  "05-strategies-en-mobile": "892c4853b0bc2aba94383486eaa5e7afd40bfe86028b8115f1dc8100c666c9b5",
  "05-strategies-fr-desktop": "220a543957c7b83072d0aca575d2883cbb26238cb4f136a30169e1fc38e2513f",
  "05-strategies-fr-mobile": "9d816989c9a9068afd72b7c40954a913c7e7469860907870063012e3096e00cc"
};
function inspect(v) {
  assert.ok(v.svg.length < 100_000);
  assert.doesNotMatch(v.svg, /<!|<\?/u, 'No declarations, entities or processing instructions');
  assert.equal(XMLValidator.validate(v.svg), true);
  const parsed = parser.parse(v.svg);
  assert.equal(parsed.length, 1);
  const root = parsed[0], nodes = nodesOf(root), ids = new Set();
  assert.equal(tag(root), 'svg');
  assert.equal(attrs(root).xmlns, 'http://www.w3.org/2000/svg');
  assert.equal(attrs(root).style, 'width:100%;height:auto');
  assert.equal(attrs(root).role, 'img');
  assert.equal(attrs(root).lang, v.lang);
  const viewBox = attrs(root).viewBox.split(' ').map(Number), index = kinds.indexOf(v.kind);
  assert.ok(index >= 0);
  assert.deepEqual(viewBox, [0, 0, v.mobile ? 640 : 1200, heights[v.mobile ? 'mobile' : 'desktop'][index]]);
  assert.equal(number(root, 'width'), viewBox[2]);
  assert.equal(number(root, 'height'), viewBox[3]);
  const expectedIds = ['title', 'desc'].map(suffix => `${v.prefix}-${suffix}`);
  for (const node of nodes) {
    const permitted = allowedAttributes[tag(node)];
    assert.ok(permitted, `Unsupported SVG tag ${tag(node)}`);
    if (tag(node) === 'svg') assert.equal(node, root, 'No nested SVG');
    for (const [key, value] of Object.entries(attrs(node))) {
      assert.ok(permitted.has(key), `Unsupported ${tag(node)} attribute ${key}`);
      assert.equal(typeof value, 'string');
      if (numericAttributes.has(key)) number(node, key);
      if (key === 'fill' || key === 'stroke') assert.ok(paints.has(value), value);
      if (key === 'id') { assert.ok(expectedIds.includes(value)); assert.ok(!ids.has(value)); ids.add(value); }
      if (key === 'font-family') assert.equal(value, 'Arial, Helvetica, sans-serif');
      if (key === 'font-weight') assert.ok(['400', '700'].includes(value));
      if (key === 'font-size') assert.ok(number(node, key) >= 17 && number(node, key) <= 74);
      if (key === 'text-anchor') assert.ok(['start', 'middle', 'end'].includes(value));
      if (key === 'stroke-linejoin' || key === 'stroke-linecap') assert.equal(value, 'round');
      if (key === 'opacity') assert.ok(['0.85', '1'].includes(value));
      if (key === 'letter-spacing') assert.equal(value, '1.4');
      if (key === 'stroke-dasharray') assert.ok(['3 5', '4 6', '5 5', '8 7'].includes(value));
      if (key === 'style' || key === 'xmlns' || key === 'lang') assert.equal(node, root);
    }
  }
  assert.deepEqual([...ids].sort(), expectedIds.sort());
  assert.equal(attrs(root)['aria-labelledby'], `${v.prefix}-title ${v.prefix}-desc`);
  for (const type of ['title', 'desc']) {
    const matches = nodes.filter(node => tag(node) === type);
    assert.equal(matches.length, 1);
    assert.equal(attrs(matches[0]).id, `${v.prefix}-${type}`);
    assert.ok(textOf(matches[0]).trim());
  }
  return { root, nodes, width: viewBox[2], height: viewBox[3] };
}
function signature(v) {
  const { root } = inspect(v);
  const canonical = (node, isRoot = false) => {
    if (tag(node) === '#text') return ['#text', node['#text']];
    const attributes = { ...attrs(node) };
    if (isRoot) { delete attributes.style; delete attributes.width; delete attributes.height; }
    return [tag(node), Object.entries(attributes).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0), children(node).map(child => canonical(child))];
  };
  return createHash('sha256').update(JSON.stringify(canonical(root, true))).digest('hex');
}
function mutate(v, change) {
  const root = parser.parse(v.svg)[0];
  change(root, nodesOf(root));
  return { ...v, svg: builder.build([root]) };
}

// Reuse the repository's unmodified Liberation Sans faces: deterministic Arial
// metric equivalents. This is a geometry regression, not a claim that every
// browser chooses the same fallback font; rendered browser inspection is needed.
const fontHashes = { 400: '76d04c18ea243f426b7de1f3ad208e927008f961dc5945e5aad352d0dfde8ee8', 700: '788abee4c806d660e8aee46689dd8540cd4bb98da03dcc9d171ce3efd99a9173' };
const fonts = Object.fromEntries([400, 700].map(weight => {
  const bytes = readFileSync(new URL(`../public/fonts/ukraine-reparations/liberation-sans-${weight}.ttf`, import.meta.url));
  assert.equal(createHash('sha256').update(bytes).digest('hex'), fontHashes[weight]);
  return [weight, opentype.parse(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength))];
}));
function pointsBox(points) {
  assert.ok(points.length > 0 && points.flat().every(Number.isFinite));
  return { x: Math.min(...points.map(p => p[0])), y: Math.min(...points.map(p => p[1])), right: Math.max(...points.map(p => p[0])), bottom: Math.max(...points.map(p => p[1])) };
}
function textBox(node) {
  const value = textOf(node), font = fonts[attrs(node)['font-weight']], size = number(node, 'font-size');
  for (const character of value) assert.ok(font.charToGlyphIndex(character) > 0, `Missing glyph U+${character.codePointAt(0).toString(16)}`);
  const spacing = number(node, 'letter-spacing'), glyphCount = font.stringToGlyphs(value).length;
  const advance = font.getAdvanceWidth(value, size) + Math.max(0, glyphCount - 1) * spacing, anchor = attrs(node)['text-anchor'];
  const x = number(node, 'x') - (anchor === 'middle' ? advance / 2 : anchor === 'end' ? advance : 0);
  const glyphs = [];
  let glyphIndex = 0;
  font.forEachGlyph(value, x, number(node, 'y'), size, {}, (glyph, gx, gy, fontSize, options) => {
    const points = glyph.getPath(gx + glyphIndex++ * spacing, gy, fontSize, options).commands.filter(command => command.type !== 'Z').flatMap(command => ['x', 'x1', 'x2'].flatMap((key, i) => key in command ? [[command[key], command[['y', 'y1', 'y2'][i]]]] : []));
    if (points.length) glyphs.push(pointsBox(points));
  });
  return { ...pointsBox(glyphs.flatMap(box => [[box.x, box.y], [box.right, box.bottom]])), glyphs };
}
// Only M/L/C/Z commands occur in the supplied static artwork. Cubic control
// points bound the curve by its convex hull, giving a conservative canvas check.
function pathPoints(value) {
  assert.ok(value.length < 2048);
  const tokens = value.match(/[MLCZ]|-?(?:\d+(?:\.\d+)?|\.\d+)/gu) ?? [];
  assert.equal(value.replace(/[MLCZ]|-?(?:\d+(?:\.\d+)?|\.\d+)|[ ,]/gu, ''), '');
  const points = [];
  for (let index = 0; index < tokens.length;) {
    const command = tokens[index++];
    assert.ok(['M', 'L', 'C', 'Z'].includes(command));
    const count = command === 'C' ? 6 : command === 'Z' ? 0 : 2;
    const values = tokens.slice(index, index + count).map(Number);
    assert.equal(values.length, count);
    assert.ok(values.every(Number.isFinite));
    for (let offset = 0; offset < values.length; offset += 2) points.push(values.slice(offset, offset + 2));
    index += count;
  }
  return points;
}
function shapeBox(node) {
  if (tag(node) === 'rect') return { x: number(node, 'x'), y: number(node, 'y'), right: number(node, 'x') + number(node, 'width'), bottom: number(node, 'y') + number(node, 'height') };
  if (tag(node) === 'circle') return { x: number(node, 'cx') - number(node, 'r'), y: number(node, 'cy') - number(node, 'r'), right: number(node, 'cx') + number(node, 'r'), bottom: number(node, 'cy') + number(node, 'r') };
  if (tag(node) === 'line') return pointsBox([[number(node, 'x1'), number(node, 'y1')], [number(node, 'x2'), number(node, 'y2')]]);
  if (tag(node) === 'path') return pointsBox(pathPoints(attrs(node).d));
  if (tag(node) === 'polygon') {
    const values = attrs(node).points.split(' ').map(pair => pair.split(',').map(Number));
    assert.ok(values.every(pair => pair.length === 2));
    return pointsBox(values);
  }
}
const within = (box, container, padding = 0) => box.x >= container.x + padding && box.y >= container.y + padding && box.right <= container.right - padding && box.bottom <= container.bottom - padding;
const overlaps = (a, b) => a.x < b.right && a.right > b.x && a.y < b.bottom && a.bottom > b.y;
function geometry(v) {
  const { root, width, height } = inspect(v);
  const visible = children(root).filter(node => ['text', 'rect', 'line', 'polygon', 'path', 'circle'].includes(tag(node)));
  const canvas = { x: 0, y: 0, right: width, bottom: height }, textBoxes = [];
  for (const [index, node] of visible.entries()) {
    if (tag(node) !== 'text') {
      const box = shapeBox(node), stroke = attrs(node).stroke ? number(node, 'stroke-width', 1) / 2 : 0;
      assert.ok(box.right >= box.x && box.bottom >= box.y);
      assert.ok(within({ x: box.x - stroke, y: box.y - stroke, right: box.right + stroke, bottom: box.bottom + stroke }, canvas), `${v.name}: shape outside viewBox`);
      continue;
    }
    const box = textBox(node), label = textOf(node);
    assert.ok(within(box, canvas, 2), `${v.name}: glyph outside viewBox: ${label} ${JSON.stringify(box)}`);
    const center = { x: (box.x + box.right) / 2, y: (box.y + box.bottom) / 2 };
    const card = visible.slice(0, index).filter(candidate => tag(candidate) === 'rect' && number(candidate, 'rx') >= 8 && number(candidate, 'x') > 0 && within({ ...center, right: center.x, bottom: center.y }, shapeBox(candidate))).at(-1);
    if (card) assert.ok(within(box, shapeBox(card), 2), `${v.name}: glyph outside card: ${label}`);
    // Aggregate text boxes may intersect only in empty space between glyphs.
    // Compare individual outlines' conservative bounds before flagging a collision.
    for (const prior of textBoxes) assert.ok(!overlaps(box, prior) || !box.glyphs.some(glyph => prior.glyphs.some(other => overlaps(glyph, other))), `${v.name}: label collision: ${label}/${prior.label}`);
    for (const later of visible.slice(index + 1).filter(candidate => tag(candidate) === 'rect' && attrs(candidate).fill !== 'none')) assert.ok(!overlaps(box, shapeBox(later)), `${v.name}: later paint conceals label: ${label}`);
    textBoxes.push({ ...box, label });
  }
}

function themePalettes() {
  const palettes = { dark: new Map(), light: new Map() };
  postcss.parse(read('src/styles/global.css')).walkDecls(declaration => {
    const parent = declaration.parent;
    if (parent.type === 'atrule' && parent.name === 'theme') palettes.dark.set(declaration.prop, declaration.value);
    if (parent.type === 'rule' && parent.selector === ':root[data-theme="light"]') palettes.light.set(declaration.prop, declaration.value);
  });
  for (const palette of Object.values(palettes)) {
    for (const token of paintTokens.values()) assert.ok(palette.has(token.slice(4, -1)), `Missing theme token ${token}`);
  }
  return palettes;
}
function rgb(hex) {
  assert.match(hex, /^#[\da-f]{6}$/iu);
  return [1, 3, 5].map(index => Number.parseInt(hex.slice(index, index + 2), 16));
}
function luminance(channels) {
  return channels.map(channel => channel / 255).map(channel => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4).reduce((sum, channel, index) => sum + channel * [0.2126, 0.7152, 0.0722][index], 0);
}
function contrast(left, right) {
  const a = luminance(left), b = luminance(right);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

test('twenty compositions preserve every original field except the documented integration changes', () => {
  assert.deepEqual(variants.map(v => v.name).sort(), Object.keys(originalSignatures).sort());
  for (const v of variants) assert.equal(signature(v), originalSignatures[v.name], v.name);
});
test('static XML, unique accessible IDs and presence of cited source anchors', () => {
  const ids = new Set();
  for (const v of variants) {
    const { nodes } = inspect(v);
    for (const node of nodes) if (attrs(node).id) { assert.ok(!ids.has(attrs(node).id)); ids.add(attrs(node).id); }
    const article = articles.find(entry => entry.lang === v.lang).raw;
    for (const id of sourceIds[kinds.indexOf(v.kind)]) assert.ok(article.includes(`id="source-${id}"`));
    assert.doesNotMatch(textOf(nodes.find(node => tag(node) === 'title')), /ce qu[ei’']|what\b|deux horloges|2 horloges|two clocks|—/iu);
  }
  assert.equal(ids.size, 40);
});
test('deterministic Liberation Sans glyph bounds and primitives stay inside canvases and cards', () => {
  const failures = [];
  for (const v of variants) { try { geometry(v); } catch (error) { failures.push(error.message); } }
  assert.deepEqual(failures, []);
});
test('complete signatures reject altered colors, text, coordinates, opacity, IDs, ordering and nesting', () => {
  const v = variants[0];
  for (const change of [
    (_, nodes) => { attrs(nodes.find(node => tag(node) === 'rect')).fill = paint('#192a3a'); },
    (_, nodes) => { attrs(nodes.find(node => tag(node) === 'text')).x = '57'; },
    (_, nodes) => { nodes.find(node => tag(node) === 'text').text = [{ '#text': 'Changed label' }]; },
    (_, nodes) => { attrs(nodes.find(node => tag(node) === 'path')).opacity = '0.85'; },
    (_, nodes) => { attrs(nodes.find(node => tag(node) === 'title')).id += '-other'; },
    root => { const label = root.svg.find(node => tag(node) === 'text'); root.svg.push(structuredClone(label)); },
    root => { const index = root.svg.findIndex(node => tag(node) === 'text'); const [label] = root.svg.splice(index, 1); root.svg.unshift(label); },
    root => { root.svg.push({ g: [root.svg.find(node => tag(node) === 'text')] }); },
  ]) assert.throws(() => assert.equal(signature(mutate(v, change)), originalSignatures[v.name]));
});
test('static XML rejects active elements, local or external references, malformed markup and event handlers', () => {
  const v = variants[0];
  for (const payload of ['<script/>', '<foreignObject/>', '<image href="https://example.com/x"/>', '<use href="#source-01"/>', '<svg/>', '<a href="#source-01"/>', '<style/>']) {
    assert.throws(() => inspect({ ...v, svg: v.svg.replace('</svg>', `${payload}</svg>`) }));
  }
  for (const [key, value] of [['onload', 'alert(1)'], ['href', '#source-01'], ['style', 'display:none'], ['transform', 'translate(1)']]) {
    assert.throws(() => inspect(mutate(v, (_, nodes) => { attrs(nodes.find(node => tag(node) === 'text'))[key] = value; })));
  }
  assert.throws(() => inspect({ ...v, svg: `<!DOCTYPE svg [<!ENTITY x "bad">]>${v.svg}` }));
  assert.throws(() => inspect({ ...v, svg: v.svg.replace('</title>', '</desc>') }));
  assert.throws(() => inspect({ ...v, svg: v.svg.replace('<svg ', '<svg onload="alert(1)" ') }));
});
test('semantic paints reject fixed colors, fabricated tokens, URL fallbacks and declaration suffixes', () => {
  const v = variants[0];
  const invalid = [...paintTokens.keys(), 'var(--color-signal-fake)', 'var(--color-signal, #5eead4)',
    'var(--color-signal, url(https://example.com/a))', 'var(--color-signal) url(https://example.com/a)',
    'var(--color-signal);fill:red', 'var(--color-signal) currentColor', 'var( --color-signal)',
    'VAR(--color-signal)', 'var(--color-signal)\n', 'url(#local)', 'url(https://example.com/a)',
    'url(//example.com/a)', 'javascript:alert(1)'];
  for (const key of ['fill', 'stroke']) for (const value of invalid) {
    assert.throws(() => inspect(mutate(v, (_, nodes) => { attrs(nodes.find(node => tag(node) === (key === 'fill' ? 'rect' : 'path')))[key] = value; })));
  }
  assert.throws(() => inspect({ ...v, svg: v.svg.replace('fill="var(--color-ink)"', 'fill="var(--color-ink&#x2c; url(https://example.com/a))"') }));
});
test('oversized SVG and path inputs are rejected before parsing or path matching', () => {
  const v = variants[0];
  assert.throws(() => inspect({ ...v, svg: `<svg>${' '.repeat(100_000)}</svg>` }));
  assert.throws(() => extractSvg(`<svg ${'x'.repeat(100_000)}`));
  assert.throws(() => pathPoints(`M${'1'.repeat(2048)} 0`));
  for (const path of ['M0 0 C1 2 3', 'M0 0 L2 Infinity', 'M0 0 A1 1 0 0 0 2 2']) assert.throws(() => pathPoints(path));
});
test('geometry rejects overflow, label collisions, narrowed cards and obscured labels independently of signatures', () => {
  const v = variants.find(entry => entry.kind === '02-capital' && entry.mobile);
  assert.throws(() => geometry(mutate(v, (_, nodes) => { attrs(nodes.find(node => tag(node) === 'text')).x = '639'; })), /outside viewBox/u);
  assert.throws(() => geometry(mutate(v, (_, nodes) => { attrs(nodes.find(node => tag(node) === 'rect' && attrs(node).rx === '14')).width = '350'; })), /outside card/u);
  assert.throws(() => geometry(mutate(v, root => { root.svg.push(structuredClone(root.svg.find(node => tag(node) === 'text'))); })), /collision/u);
  assert.throws(() => geometry(mutate(v, root => { root.svg.push({ rect: [], ':@': { x: '20', y: '20', width: '600', height: '40', rx: '0', fill: paint('#192a3a') } }); })), /conceals label/u);
  assert.throws(() => geometry(mutate(v, (_, nodes) => { attrs(nodes.find(node => tag(node) === 'rect')).x = '1'; })), /shape outside viewBox/u);
});

test('all label colors, reverse labels and data marks remain legible in the two site themes', () => {
  const foregrounds = ['paper', 'muted', 'signal', 'amber', 'accent', 'topic-blue', 'bright'];
  for (const [theme, palette] of Object.entries(themePalettes())) {
    for (const foreground of foregrounds) for (const background of ['ink', 'surface-2']) {
      const ratio = contrast(rgb(palette.get(`--color-${foreground}`)), rgb(palette.get(`--color-${background}`)));
      assert.ok(ratio >= 4.5, `${theme}: ${foreground}/${background} contrast ${ratio}`);
    }
    assert.ok(contrast(rgb(palette.get('--color-ink')), rgb(palette.get('--color-signal'))) >= 4.5);
    for (const foreground of ['signal', 'amber', 'accent', 'topic-blue', 'bright']) {
      const ink = rgb(palette.get('--color-ink')), stroke = rgb(palette.get(`--color-${foreground}`));
      const blended = stroke.map((channel, index) => .85 * channel + .15 * ink[index]);
      assert.ok(contrast(blended, ink) >= 3, `${theme}: ${foreground} rank path`);
    }
  }
});
test('article styles keep responsive variants, bounded figure sizes and caption spacing', () => {
  for (const { raw } of articles) {
    const start = raw.indexOf('<style>{`'), end = raw.indexOf('`}</style>', start);
    assert.ok(start >= 0 && end > start);
    const css = postcss.parse(raw.slice(start + '<style>{`'.length, end)), rules = [];
    css.walkDecls(declaration => {
      assert.ok(!['fill', 'stroke'].includes(declaration.prop) && !declaration.prop.startsWith('--color-'), 'No local paint overrides');
    });
    css.walkRules(rule => rules.push({ selector: rule.selector, media: rule.parent.type === 'atrule' ? rule.parent.params : '', declarations: Object.fromEntries(rule.nodes.filter(node => node.type === 'decl').map(node => [node.prop, node.value])) }));
    const find = (selector, media = '') => rules.find(rule => rule.selector === selector && rule.media === media)?.declarations;
    const svg = find('.l0g-debt3-figure svg');
    assert.equal(svg.width, '100%'); assert.equal(svg.height, 'auto'); assert.equal(svg['max-width'], '100%');
    assert.equal(find('.l0g-debt3-mobile').display, 'none');
    assert.equal(find('.l0g-debt3-mobile', '(max-width:680px)').display, 'block');
    assert.equal(find('.l0g-debt3-desktop', '(max-width:680px)').display, 'none');
    assert.equal(find('.l0g-debt3-figure figcaption').padding, '1rem .15rem');
    assert.equal(find('.l0g-debt3-figure').margin, '2.5rem auto 3rem');
    assert.equal(find('.l0g-debt3-figure')['max-width'], '820px');
    assert.equal(find('.l0g-debt3-figure', '(max-width:680px)')['max-width'], '416px');
  }
});

// Fed, Monin, figure 3 accessible data (2026-06-22), excerpt Jan 2023–Sep 2025.
// https://www.federalreserve.gov/econres/notes/feds-notes/decomposing-hedge-funds-u-s-treasury-exposures-accessible-20260622.htm
const basis = [213,201,235,279,328,368,448,391,427,468,471,509,587,541,524,514,536,628,733,732,814,832,753,754,780,735,725,829,798,894,848,822,832];
const swaps = [42,49,63,65,87,69,76,96,90,82,87,110,119,101,95,79,109,140,111,91,109,153,151,158,183,253,295,237,192,266,232,224,305];
function strategyChart(v) {
  const { nodes } = inspect(v);
  const paths = nodes.filter(node => tag(node) === 'path');
  assert.equal(paths.length, 2);
  for (const [index, values] of [basis, swaps].entries()) {
    const series = v.mobile ? values.slice(24) : values;
    const points = pathPoints(attrs(paths[index]).d);
    assert.equal(points.length, series.length);
    assert.equal(attrs(paths[index]).stroke, paint(index === 0 ? '#73dbc2' : '#f1b56f'));
    const x0 = v.mobile ? 86 : 124, plotWidth = v.mobile ? 437 : 929;
    const bottom = v.mobile ? 895 : 787, plotHeight = v.mobile ? 511 : 485;
    points.forEach(([x,y],i) => {
      close(x, x0 + i * plotWidth / (series.length - 1), .001);
      close(y, bottom - series[i] / 1000 * plotHeight, .001);
    });
  }
}
test('both displayed windows plot all verified Fed observations with a zero origin and common USD billion scale', () => {
  for (const v of variants.filter(v => v.kind === '05-strategies')) strategyChart(v);
  assert.equal(basis[27] - basis[26], 104);
  assert.equal(swaps[27] - swaps[26], -58);
  assert.equal(swaps[28] - swaps[26], -103);
  close((swaps[28] / swaps[26] - 1) * 100, -34.91525423728814, 1e-10);
  const v = variants.find(v => v.kind === '05-strategies');
  assert.throws(() => strategyChart(mutate(v, (_, nodes) => { attrs(nodes.find(n => tag(n) === 'path')).d = 'M124 0 L153 0'; })));
});

test('hypothetical balance sheet, funding return and cash-call accounting reconcile independently', () => {
  const bonds = 100_000_000, haircut = .01, initialMargin = 1_000_000, cash = 1_000_000;
  const repo = bonds * (1 - haircut), assets = bonds + initialMargin + cash;
  const capital = assets - repo;
  assert.equal(repo, 99_000_000); assert.equal(capital, 3_000_000);
  close(bonds / capital, 33.333333333333336, 1e-10);
  const gross = 1_160_000, fees = 20_000, dayFraction = 90 / 360;
  const net = rate => gross - repo * rate * dayFraction - fees;
  assert.equal(net(.04), 150_000); assert.equal(net(.046), 1_500);
  assert.equal(net(.04) / capital, .05);
  const breakEven = (gross - fees) / (repo * dayFraction);
  close(breakEven * 100, 4.606060606060606, 1e-10);
  close(net(breakEven), 0, 1e-8);
  const variation = 980_000, addedMargin = 500_000, bondGain = 1_000_000;
  assert.equal(variation + addedMargin, 1_480_000);
  assert.equal(variation + addedMargin - cash, 480_000);
  assert.equal(bondGain - variation, 20_000);
  assert.equal((bonds + bondGain) * (1 - haircut) - repo, 990_000);
  for (const v of variants.filter(v => v.kind === '03-rendement' && !v.mobile)) {
    const bars = inspect(v).nodes.filter(n => tag(n) === 'rect' && attrs(n).y === '353');
    assert.equal(bars.length, 3);
    [990_000, fees, net(.04)].forEach((value,i) => close(number(bars[i], 'width') / 1088, value / gross, 1e-10));
  }
});
