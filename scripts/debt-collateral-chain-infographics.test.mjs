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
  assert.ok(value.length <= 64, `Bounded numeric attribute ${key}`);
  assert.match(value, /^-?(?:\d{1,32}(?:\.\d{1,32})?|\.\d{1,32})$/u, key);
  const result = Number(value);
  assert.ok(Number.isFinite(result), key);
  return result;
};
const close = (actual, expected, tolerance = 0.011) => assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} != ${expected}`);
const kinds = ['01-chaine', '02-echeances', '03-matrice', '04-haircuts', '05-cil', '06-compensation'];
const sourceIds = [['06', '07'], ['07', '12'], ['07'], ['13'], ['02', '03'], ['18', '19']];
const heights = { desktop: [970, 940, 1110, 970, 1150, 1130], mobile: [1510, 1420, 1520, 1420, 1700, 1780] };
const articles = ['fr', 'en'].map(lang => ({ lang, raw: read(`src/content/${lang === 'fr' ? 'posts' : 'posts-en'}/dette-etats-04-chaine-garanties.mdx`) }));
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
  assert.equal(figures.length, 12, lang);
  return figures.map((svg, index) => {
    const kind = kinds[Math.floor(index / 2)], mobile = index % 2 === 1;
    return { lang, kind, mobile, name: `${kind}-${lang}-${mobile ? 'mobile' : 'desktop'}`, prefix: `d4-${kind}-${lang}-${mobile ? 'm' : 'd'}`, svg };
  });
});
const paintTokens = new Map([
  ['#101e2b', 'var(--color-ink)'], ['#192d3d', 'var(--color-surface-2)'],
  ['#f6f1e5', 'var(--color-paper)'], ['#b4c5cf', 'var(--color-muted)'],
  ['#638098', 'var(--color-muted)'], ['#77ddc5', 'var(--color-signal)'],
  ['#3a5367', 'var(--color-line-strong)'], ['#f3bb79', 'var(--color-amber)'],
  ['#8cbcff', 'var(--color-topic-blue)'],
  ['#214c47', 'color-mix(in srgb, var(--color-signal) 14%, var(--color-ink))'],
  ['#30485c', 'color-mix(in srgb, var(--color-topic-blue) 16%, var(--color-ink))'],
  ['#715137', 'color-mix(in srgb, var(--color-amber) 25%, var(--color-ink))'],
  ['#3d3b32', 'color-mix(in srgb, var(--color-amber) 10%, var(--color-ink))'],
]);
// Finite definitions only: no CSS expression parser, custom fallback or URL.
const mixtures = new Map([
  [paintTokens.get('#214c47'), ['--color-signal', .14]],
  [paintTokens.get('#30485c'), ['--color-topic-blue', .16]],
  [paintTokens.get('#715137'), ['--color-amber', .25]],
  [paintTokens.get('#3d3b32'), ['--color-amber', .10]],
]);
const paint = original => {
  assert.ok(paintTokens.has(original), `Unknown original paint ${original}`);
  return paintTokens.get(original);
};
const paints = new Set(['none', ...paintTokens.values()]);
const allowedAttributes = Object.fromEntries(Object.entries({
  svg: 'xmlns viewBox width height role aria-labelledby style lang',
  title: 'id', desc: 'id',
  rect: 'x y width height rx fill stroke stroke-width',
  text: 'x y font-family font-size font-weight fill text-anchor',
  line: 'x1 y1 x2 y2 stroke stroke-width stroke-dasharray',
  polygon: 'points fill', circle: 'cx cy r fill stroke stroke-width',
}).map(([key, value]) => [key, new Set(value.split(' ').filter(Boolean))]));
const numericAttributes = new Set('x y x1 y1 x2 y2 width height rx cx cy r font-size stroke-width'.split(' '));

// Ordered XML fingerprints generated independently from all 24 supplied originals,
// with the exact semantic paint map above. Only the English desktop matrix label
// "TOTAL DES 16 CELLULES : 604.33 US$BN" is repaired to
// "TOTAL OF 16 CELLS: 604.33 US$BN" before hashing. Every other original field,
// including geometry, text, fonts and element order, is retained. Integration
// adds only root width/height/style, each separately validated in inspect().
const originalSignatures = {
  "01-chaine-en-desktop": "4f26a6524a47ea10da65595fd349f6854a54142f29e5655f5812271aaa27d491",
  "01-chaine-en-mobile": "21abf2043d178578b4b9ceeee009e301fa7f36e576f423a97de7ce4e41e369a9",
  "01-chaine-fr-desktop": "25923ea2ca052483bd65a77168f931ae05f4aa4d330c2065bf65784d337fd4b7",
  "01-chaine-fr-mobile": "72ce5f4b135b91ad6e2d51cd20f1cda5bc233b18d020193358d883a2c23f111f",
  "02-echeances-en-desktop": "2bafbb7f3e0d2251f3f7e40bff1b5da9070cdb294e14e55c08458ac80e272585",
  "02-echeances-en-mobile": "c6114a052fbd53439545c123e2d6d41987822699811c5015de9b52feedcd4b8f",
  "02-echeances-fr-desktop": "6d966c7870d753206d27c4fdfe8053844f6ca31f9101721e14947eba2f55fe62",
  "02-echeances-fr-mobile": "a2077148e9ca8cd68c8188c06a42649b0fa306ad0e644cf5d26dfc7209f6323c",
  "03-matrice-en-desktop": "7c51d580a089d8e8a291edb63f2b5f0d4967db9419ff8e5fd53963e0cb2b2a93",
  "03-matrice-en-mobile": "0aa8cd93fc5d720f5447c3edf151a9265ee557beed6d7ebda66dc2b1296d6004",
  "03-matrice-fr-desktop": "6aaa3bfbd00e39542ef0c20682d3911d13ca90be830d69d4c21cb1f887db02eb",
  "03-matrice-fr-mobile": "460a77c879f7a1ff6c3bedac1eee15a9ed0c4cc466f78d864a3be8c48c788379",
  "04-haircuts-en-desktop": "3d00cbbd94eddcf27aba3cd366d33572ed35f921b4cee514786bb8e5ce8efaef",
  "04-haircuts-en-mobile": "7abe071c64451c4d03e9078949c3c2b66db9c96653af8539ee00c39d2af9c06c",
  "04-haircuts-fr-desktop": "824298872594f8ead198649f999f4175806a1d7e9661cf689519fb0cd773f18e",
  "04-haircuts-fr-mobile": "91c44d73104614394df964773703bad50cb6eb355a0fae634f7f65c846904162",
  "05-cil-en-desktop": "de4ad17c81c74ea29f0742d15c01e726d674a9b431c5c5cc9b517cd647288111",
  "05-cil-en-mobile": "f19a9455b0bce089ac1b5fef466783607d28cc6a863d48fe3d0cd1ee72d46578",
  "05-cil-fr-desktop": "4bb534fc0ba8661f4c671738d99ba6893ee11087b5216b0dc6b287307f7cb72c",
  "05-cil-fr-mobile": "5ad971a636495da3b4320ca54e5a2d210ab1e04c94323cd746398332c71c2849",
  "06-compensation-en-desktop": "dc2efda59ad467838bd6f24f42340fd8f8cf41e4ca650fed10ab3137362076f0",
  "06-compensation-en-mobile": "9028064cf8380f5aae516a4f24642014d98d44b8560a50ead3addb1351986f4a",
  "06-compensation-fr-desktop": "980eae595c9e236c2c4724824f604fefc5b08eb89b3ce4e8b137d80e698f5e6b",
  "06-compensation-fr-mobile": "c47abbdb19f571d370013824d552abced5a1e5cceedaa8df4bcd26f932bf5b19"
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
      assert.ok(value.length <= 2048, `Bounded ${key} value`);
      if (numericAttributes.has(key)) number(node, key);
      if (key === 'fill' || key === 'stroke') assert.ok(paints.has(value), value);
      if (key === 'id') { assert.ok(expectedIds.includes(value)); assert.ok(!ids.has(value)); ids.add(value); }
      if (key === 'font-family') assert.equal(value, 'Arial, Helvetica, sans-serif');
      if (key === 'font-weight') assert.ok(['400', '700'].includes(value));
      if (key === 'font-size') assert.ok(number(node, key) >= 17 && number(node, key) <= 83);
      if (key === 'text-anchor') assert.ok(['start', 'middle', 'end'].includes(value));
      if (key === 'stroke-dasharray') assert.ok(['4 8', '6 8', '7 6', '8 10'].includes(value));
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
function shapeBox(node) {
  if (tag(node) === 'rect') return { x: number(node, 'x'), y: number(node, 'y'), right: number(node, 'x') + number(node, 'width'), bottom: number(node, 'y') + number(node, 'height') };
  if (tag(node) === 'circle') return { x: number(node, 'cx') - number(node, 'r'), y: number(node, 'cy') - number(node, 'r'), right: number(node, 'cx') + number(node, 'r'), bottom: number(node, 'cy') + number(node, 'r') };
  if (tag(node) === 'line') return pointsBox([[number(node, 'x1'), number(node, 'y1')], [number(node, 'x2'), number(node, 'y2')]]);
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
  const visible = children(root).filter(node => ['text', 'rect', 'line', 'polygon', 'circle'].includes(tag(node)));
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
    for (const token of ['ink', 'surface-2', 'paper', 'muted', 'signal', 'amber', 'topic-blue', 'line-strong']) assert.ok(palette.has(`--color-${token}`), `Missing theme token ${token}`);
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

test('twenty-four compositions preserve every original field except the documented integration changes', () => {
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
  assert.equal(ids.size, 48);
});
test('deterministic Liberation Sans glyph bounds and primitives stay inside canvases and cards', () => {
  const failures = [];
  for (const v of variants) { try { geometry(v); } catch (error) { failures.push(error.message); } }
  assert.deepEqual(failures, []);
});
test('complete signatures reject altered colors, text, coordinates, opacity, IDs, ordering and nesting', () => {
  const v = variants[0];
  for (const change of [
    (_, nodes) => { attrs(nodes.find(node => tag(node) === 'rect')).fill = paint('#192d3d'); },
    (_, nodes) => { attrs(nodes.find(node => tag(node) === 'text')).x = '57'; },
    (_, nodes) => { nodes.find(node => tag(node) === 'text').text = [{ '#text': 'Changed label' }]; },
    (_, nodes) => { attrs(nodes.find(node => tag(node) === 'line')).opacity = '0.85'; },
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
    'url(//example.com/a)', 'javascript:alert(1)',
    'color-mix(in srgb, var(--color-signal-fake) 14%, var(--color-ink))',
    'color-mix(in srgb, var(--color-signal) 15%, var(--color-ink))',
    'color-mix(in srgb, var(--color-signal, red) 14%, var(--color-ink))',
    'color-mix(in srgb, url(https://example.com/a) 14%, var(--color-ink))',
    `${paint('#214c47')};stroke:red`, `${paint('#214c47')} url(#local)`,
    `${paint('#214c47')}\n`];
  for (const key of ['fill', 'stroke']) for (const value of invalid) {
    assert.throws(() => inspect(mutate(v, (_, nodes) => { attrs(nodes.find(node => tag(node) === (key === 'fill' ? 'rect' : 'line')))[key] = value; })));
  }
  assert.throws(() => inspect({ ...v, svg: v.svg.replace('fill="var(--color-ink)"', 'fill="var(--color-ink&#x2c; url(https://example.com/a))"') }));
});
test('oversized SVG and numeric inputs are rejected before expensive processing', () => {
  const v = variants[0];
  assert.throws(() => inspect({ ...v, svg: `<svg>${' '.repeat(100_000)}</svg>` }));
  assert.throws(() => extractSvg(`<svg ${'x'.repeat(100_000)}`));
  for (const value of ['1'.repeat(2048), `${'1'.repeat(63)}x`, '1e100', 'Infinity', 'NaN', '1.2.3', '1 ', '+2']) {
    assert.throws(() => inspect(mutate(v, (_, nodes) => { attrs(nodes.find(node => tag(node) === 'text')).x = value; })));
  }
});
test('geometry rejects overflow, label collisions, narrowed cards and obscured labels independently of signatures', () => {
  const v = variants.find(entry => entry.kind === '01-chaine' && entry.mobile);
  assert.throws(() => geometry(mutate(v, (_, nodes) => { attrs(nodes.find(node => tag(node) === 'text')).x = '639'; })), /outside viewBox/u);
  assert.throws(() => geometry(mutate(v, (_, nodes) => { attrs(nodes.find(node => tag(node) === 'rect' && attrs(node).rx === '12')).width = '240'; })), /outside card/u);
  assert.throws(() => geometry(mutate(v, root => { root.svg.push(structuredClone(root.svg.find(node => tag(node) === 'text'))); })), /collision/u);
  assert.throws(() => geometry(mutate(v, root => { root.svg.push({ rect: [], ':@': { x: '20', y: '20', width: '600', height: '40', rx: '0', fill: paint('#192d3d') } }); })), /conceals label/u);
  assert.throws(() => geometry(mutate(v, (_, nodes) => { attrs(nodes.find(node => tag(node) === 'rect')).x = '1'; })), /shape outside viewBox/u);
});

function paintRgb(value, palette) {
  if (mixtures.has(value)) {
    const [token, fraction] = mixtures.get(value), front = rgb(palette.get(token)), back = rgb(palette.get('--color-ink'));
    return front.map((channel, index) => fraction * channel + (1 - fraction) * back[index]);
  }
  assert.ok([...paintTokens.values()].includes(value) && value.startsWith('var('), value);
  return rgb(palette.get(value.slice(4, -1)));
}
test('text, reversed labels, tinted matrix cells and data marks retain contrast in both themes', () => {
  for (const [theme, palette] of Object.entries(themePalettes())) {
    for (const v of variants) {
      const visible = children(inspect(v).root).filter(node => ['text', 'rect', 'line', 'polygon', 'circle'].includes(tag(node)));
      for (const [index, node] of visible.entries()) {
        if (tag(node) !== 'text') continue;
        const box = textBox(node);
        const background = visible.slice(0, index).filter(candidate => tag(candidate) === 'rect' && attrs(candidate).fill !== 'none' && within(box, shapeBox(candidate))).at(-1);
        assert.ok(background, `${v.name}: missing text backdrop`);
        const ratio = contrast(paintRgb(attrs(node).fill, palette), paintRgb(attrs(background).fill, palette));
        assert.ok(ratio >= 4.5, `${theme} ${v.name}: ${textOf(node)} contrast ${ratio}`);
      }
    }
    for (const token of ['signal', 'amber', 'topic-blue']) for (const background of ['ink', 'surface-2']) {
      assert.ok(contrast(rgb(palette.get(`--color-${token}`)), rgb(palette.get(`--color-${background}`))) >= 3);
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
    const svg = find('.l0g-debt4-figure svg');
    assert.equal(svg.width, '100%'); assert.equal(svg.height, 'auto'); assert.equal(svg['max-width'], '100%');
    assert.equal(find('.l0g-debt4-mobile').display, 'none');
    assert.equal(find('.l0g-debt4-mobile', '(max-width:680px)').display, 'block');
    assert.equal(find('.l0g-debt4-desktop', '(max-width:680px)').display, 'none');
    assert.equal(find('.l0g-debt4-figure figcaption').padding, '1rem .15rem');
    assert.equal(find('.l0g-debt4-figure').margin, '2.5rem auto 3rem');
    assert.equal(find('.l0g-debt4-figure')['max-width'], '820px');
    assert.equal(find('.l0g-debt4-figure', '(max-width:680px)')['max-width'], '416px');
  }
});

// OFR Brief 24-07, figure 8. Rows: maturity of cash lent; columns:
// maturity of cash borrowed. USD billion, average of three June 2022 dates.
// Integer hundredths avoid introducing floating-point error in the regrouping.
const maturityMatrix = [
  [24476, 956, 1223, 2468],
  [1961, 1086, 377, 409],
  [4868, 625, 3017, 1795],
  [7901, 788, 1150, 7333],
];
function matrixCells(v) {
  const { nodes } = inspect(v);
  const cells = nodes.filter(node => tag(node) === 'rect' && attrs(node).rx === '7');
  assert.equal(cells.length, 16);
  for (let row = 0; row < 4; row++) for (let column = 0; column < 4; column++) {
    const cell = cells[row * 4 + column];
    const color = row === column ? '#30485c' : row > column ? '#715137' : '#214c47';
    assert.equal(attrs(cell).fill, paint(color));
    close(number(cell, 'x'), (v.mobile ? 154 : 232) + column * (v.mobile ? 112 : 145));
    close(number(cell, 'y'), (v.mobile ? 427 : 350) + row * (v.mobile ? 96 : 84));
    const label = nodes.slice(nodes.indexOf(cell) + 1).find(node => tag(node) === 'text');
    const expected = (maturityMatrix[row][column] / 100).toFixed(2);
    assert.equal(textOf(label), v.lang === 'fr' ? expected.replace('.', ',') : expected);
    assert.ok(within(textBox(label), shapeBox(cell), 2), 'Matrix label inside its own cell');
  }
}
test('all sixteen maturity cells, semantic triangles, totals and ratio reproduce the source matrix', () => {
  let shorter = 0, longer = 0, sameClass = 0;
  maturityMatrix.forEach((row, i) => row.forEach((value, j) => {
    if (i > j) shorter += value;
    else if (i < j) longer += value;
    else sameClass += value;
  }));
  assert.equal(shorter, 17293); assert.equal(longer, 7228); assert.equal(sameClass, 35912);
  assert.equal(shorter + longer + sameClass, 60433);
  assert.equal((shorter / longer).toFixed(2), '2.39');
  assert.equal(maturityMatrix[2][0], 4868);
  for (const v of variants.filter(v => v.kind === '03-matrice')) matrixCells(v);
  const v = variants.find(v => v.kind === '03-matrice');
  assert.throws(() => matrixCells(mutate(v, (_, nodes) => { attrs(nodes.find(n => tag(n) === 'rect' && attrs(n).rx === '7')).fill = paint('#715137'); })));
  assert.throws(() => matrixCells(mutate(v, (_, nodes) => { nodes.find(n => tag(n) === 'text' && textOf(n) === '244,76').text = [{ '#text': '244,75' }]; })));
});

function haircutBars(v) {
  const { nodes } = inspect(v), width = v.mobile ? 568 : 1088, gutter = v.mobile ? 1 : 2;
  const bars = nodes.filter(node => tag(node) === 'rect' && number(node, 'height') === (v.mobile ? 90 : 108));
  assert.equal(bars.length, 3);
  let cumulative = 0;
  for (const [index, share] of [56, 34, 10].entries()) {
    close(number(bars[index], 'x'), (v.mobile ? 36 : 56) + width * cumulative / 100, 1e-8);
    close((number(bars[index], 'width') + gutter) / width * 100, share, 1e-8);
    cumulative += share;
  }
  assert.equal(cumulative, 100);
}
function clearingBars(v) {
  const { nodes } = inspect(v), full = v.mobile ? 568 : 700;
  const bars = nodes.filter(node => tag(node) === 'rect' && number(node, 'height') === (v.mobile ? 32 : 45));
  assert.equal(bars.length, 4);
  for (const [index, share] of [72, 62].entries()) {
    assert.equal(number(bars[index * 2], 'width'), full);
    close(number(bars[index * 2 + 1], 'width') / full * 100, share, 1e-8);
    assert.equal(attrs(bars[index * 2 + 1]).fill, paint('#77ddc5'));
  }
  // 46% describes a separate universe and is displayed as a separate card.
  assert.ok(nodes.some(node => tag(node) === 'text' && textOf(node) === (v.lang === 'fr' ? '≈ 46 %' : '≈ 46%')));
}
test('haircut shares and clearing proportions retain their separate denominators and truthful bar lengths', () => {
  for (const v of variants.filter(v => v.kind === '04-haircuts')) haircutBars(v);
  for (const v of variants.filter(v => v.kind === '06-compensation')) clearingBars(v);
  for (const [kind, check, height] of [['04-haircuts', haircutBars, '108'], ['06-compensation', clearingBars, '45']]) {
    const v = variants.find(v => v.kind === kind && !v.mobile);
    assert.throws(() => check(mutate(v, (_, nodes) => { attrs(nodes.find(n => tag(n) === 'rect' && attrs(n).height === height)).width = '1'; })));
  }
});
test('hypothetical repo chain and CIL calculations keep cash, gross claims and collateral distinct', () => {
  const securities = 100, buyerCash = 1, buyerRepo = 99, dealerCash = 1, dealerRepo = 98;
  assert.equal(buyerRepo + buyerCash, securities);
  assert.equal(dealerRepo + dealerCash, buyerRepo);
  assert.equal(buyerRepo + dealerRepo, 197);
  assert.equal((securities - buyerRepo) / securities * 100, 1);
  assert.equal((securities - dealerRepo) / securities * 100, 2);
  const cilCash = 100, minimumCashHaircut = .02, cilCollateral = cilCash * (1 + minimumCashHaircut);
  assert.equal(cilCollateral, 102);
  assert.equal(cilCollateral - cilCash, 2);
  close((cilCollateral - cilCash) / cilCollateral * 100, 1.9607843137254901, 1e-12);
  assert.equal(new Date('2025-12-23T00:00:00Z') - new Date('2025-12-12T00:00:00Z'), 11 * 86_400_000);
});
