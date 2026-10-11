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
const kinds = ['01-classements', '02-portage', '03-financement', '04-enquete-fed', '05-decision', '06-compensation'];
const sourceIds = [['01'], ['05', '06'], ['05', '06'], ['11'], ['13'], ['14', '15']];
const heights = { desktop: [800, 925, 925, 865, 955, 950], mobile: [1000, 1380, 1480, 1270, 1470, 1470] };
const articles = ['fr', 'en'].map(lang => ({ lang, raw: read(`src/content/${lang === 'fr' ? 'posts' : 'posts-en'}/dette-etats-02-bilan-intermediaires.mdx`) }));
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
    return { lang, kind, mobile, name: `${kind}-${lang}-${mobile ? 'mobile' : 'desktop'}`, prefix: `d2-${kind}-${lang}-${mobile ? 'm' : 'd'}`, svg };
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

// SHA-256 over every ordered XML field of the supplied original compositions,
// with the exact forward paint mapping above. Two old blues map to muted, so no
// ambiguous reverse mapping is used. Integration adds only responsive root
// dimensions/style. The original trees were given these reviewed text repairs
// before hashing: figure 04 becomes "Les réponses de huit banques" / "Eight
// banks report on repo"; figure 05 becomes "Du bilan disponible au crédit
// accordé" / "From available capacity to credit", preserving two mobile lines.
// Its subtitle becomes "SWES britannique · choc fictif sur 10 jours ouvrés" /
// "UK SWES · hypothetical shock over 10 business days", also in the description.
// No coordinates, fonts, line breaks or other original content are normalized.
const originalSignatures = {
  '01-classements-en-desktop': '72d96ac72bc04251113b6aaa02e58fd2a24be1800043ab4075a3fc47cd7f19fa',
  '01-classements-en-mobile': '620fc7ffca13cfbc89f5ee4b35bdb9a30ce88843592b448c4a40a53de97e0648',
  '01-classements-fr-desktop': '07d842f931e5faa55024fddd49374261c676100ca45e118e6a7cb6e1d3d3a476',
  '01-classements-fr-mobile': '3c81d3a3cd39b77085af65bcb7062393e9d4d3d5d1f5af1a97f27a65bc76c5f6',
  '02-portage-en-desktop': 'b9ecd6ba974eb20730e58629b706c034d859b8eb556d1d4dff5ad09745ae9e94',
  '02-portage-en-mobile': 'a6c1ccf6cd7616c82cadaa23928be0c26c4a6a95d888c295a7f70400d50af75f',
  '02-portage-fr-desktop': '5ae3444893734ef36196b341d125ba6ada757e64b3a3ce5878b916ea44821082',
  '02-portage-fr-mobile': 'fdfc3e428ce0e4e25e16e6c9ba1240e7baeb23435993920ee69770234b7d9d10',
  '03-financement-en-desktop': 'a7c693604ba426299a175a41947f5df8c7edba43b6877025ae96e1b4ba528eb9',
  '03-financement-en-mobile': '8bf10beb4c91cf85c9cd29ade5ee89ce600443a549d4db4feb4220eac00318ef',
  '03-financement-fr-desktop': '56e2d8d95952b60d48b96728eb211ce4e3cf9d7f2e7dcf32d2dfaf1ff51a157f',
  '03-financement-fr-mobile': '9338b62f3f4014f554e04614af3124c82628eaf0be7f7e9312a751326b0cf46e',
  '04-enquete-fed-en-desktop': '627c97671e8d37028047d23fe5003fa7bb15381d09f6ea3d7413e29f1a824981',
  '04-enquete-fed-en-mobile': '09eaeb4698ca910acd9cacfc84a5760917c4428cc120b27a7ee79dc04808ef02',
  '04-enquete-fed-fr-desktop': 'e6aa6b7edd02a86e2e47970e8af375c1700cfae3111832a0fa46f7b1c36680d5',
  '04-enquete-fed-fr-mobile': 'fa4470c4680474c3fad05114b2541353c774deca4ff29ac74ecf372e036b4267',
  '05-decision-en-desktop': '62e026a748c002e76afcc5288672595d3daa3a1699593488967f2dc2e9ea1328',
  '05-decision-en-mobile': 'ff897551842c584d7690f632cdf04dc2234bc161145b5d878a0b5ea3b9484d45',
  '05-decision-fr-desktop': '3659910aa058c28ee971473f6131ad6f25e3cfb27106652c5b532df3c9f2e1c8',
  '05-decision-fr-mobile': 'c4a0ad32697e209b19d4e8355313ce625d8b85c3bee0aec6aeee37f5e1f35d93',
  '06-compensation-en-desktop': 'd771c640e4721168be26b073412dcbeb8353a381e883a1b36195c3f245c24c85',
  '06-compensation-en-mobile': '229fbe19b897bd4a32b9038a8a3d5fa42f5decb1ad50d0fd18c8fbb3d92af74f',
  '06-compensation-fr-desktop': '2ecbedd2bf57b906b5487e7e671c865a2f198caef21249887f3f68d9208d97af',
  '06-compensation-fr-mobile': '91331859994dfcd1b48dc05259e8bcd714fc933ea8b82dba1eff568343b56919',
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
      if (key === 'stroke-dasharray') assert.ok(['3 7', '6 6'].includes(value));
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

test('twenty-four compositions preserve every original field except the documented integration changes', () => {
  assert.deepEqual(variants.map(v => v.name).sort(), Object.keys(originalSignatures).sort());
  for (const v of variants) assert.equal(signature(v), originalSignatures[v.name], v.name);
});
test('static XML, accessible IDs and article citations remain unique and exact', () => {
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
    (_, nodes) => { attrs(nodes.find(node => tag(node) === 'rect')).fill = paint('#192a3a'); },
    (_, nodes) => { attrs(nodes.find(node => tag(node) === 'text')).x = '57'; },
    (_, nodes) => { nodes.find(node => tag(node) === 'text').text = [{ '#text': 'Changed label' }]; },
    (_, nodes) => { attrs(nodes.find(node => tag(node) === 'path')).opacity = '1'; },
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
  const v = variants.find(entry => entry.kind === '02-portage' && entry.mobile);
  assert.throws(() => geometry(mutate(v, (_, nodes) => { attrs(nodes.find(node => tag(node) === 'text')).x = '639'; })), /outside viewBox/u);
  assert.throws(() => geometry(mutate(v, (_, nodes) => { attrs(nodes.find(node => tag(node) === 'rect' && attrs(node).rx === '14')).width = '300'; })), /outside card/u);
  assert.throws(() => geometry(mutate(v, root => { root.svg.push(structuredClone(root.svg.find(node => tag(node) === 'text'))); })), /collision/u);
  assert.throws(() => geometry(mutate(v, root => { root.svg.push({ rect: [], ':@': { x: '20', y: '20', width: '600', height: '40', rx: '0', fill: paint('#192a3a') } }); })), /conceals label/u);
  assert.throws(() => geometry(mutate(v, (_, nodes) => { attrs(nodes.find(node => tag(node) === 'rect')).x = '1'; })), /shape outside viewBox/u);
});

function rankedBanks(v) {
  const { nodes } = inspect(v), circles = nodes.filter(node => tag(node) === 'circle');
  const pairs = [[1, 5], [2, 4], [3, 1], [4, 2], [5, 3]];
  assert.equal(circles.length, 10);
  const labels = nodes.filter(node => tag(node) === 'text');
  pairs.forEach(([primary, secondary], index) => {
    [primary, secondary].forEach((rank, side) => {
      const circle = circles[index * 2 + side];
      const label = labels.find(node => number(node, 'x') === number(circle, 'cx') && number(node, 'y') === number(circle, 'cy') + (v.mobile ? 9 : 8));
      assert.ok(label);
      assert.equal(textOf(label), String(rank));
      close(number(circle, 'cy'), v.mobile ? 323 + index * 102 : 276 + (rank - 1) * 75);
    });
  });
  if (!v.mobile) {
    const paths = nodes.filter(node => tag(node) === 'path');
    assert.equal(paths.length, 5);
    pairs.forEach(([a, b], index) => {
      const points = pathPoints(attrs(paths[index]).d);
      assert.deepEqual(points[0], [400, 276 + (a - 1) * 75]);
      assert.deepEqual(points.at(-1), [800, 276 + (b - 1) * 75]);
    });
  }
}
function inventoryBars(v) {
  const { nodes } = inspect(v), rects = nodes.filter(node => tag(node) === 'rect');
  const at = (y, color) => rects.find(node => number(node, 'y') === y && attrs(node).fill === paint(color));
  const sold = at(v.mobile ? 362 : 320, '#73dbc2'), held = at(v.mobile ? 362 : 320, '#f1b56f');
  const total = number(sold, 'width') + number(held, 'width');
  close(number(sold, 'width') / total, .6, v.mobile ? .001 : 1e-10);
  close(number(held, 'x'), number(sold, 'x') + number(sold, 'width'));
  const funded = at(v.mobile ? 855 : 611, '#73dbc2'), gap = at(v.mobile ? 855 : 611, '#f1b56f');
  close(number(funded, 'width') / (number(funded, 'width') + number(gap, 'width')), .98, 1e-10);
  close(number(gap, 'x'), number(funded, 'x') + number(funded, 'width'));
  const labels = nodes.filter(node => tag(node) === 'text').map(textOf);
  for (const label of v.lang === 'fr' ? ['100 M€', '60 M€', '40 M€', '39,2 M€', '0,8 M€', '8 711 €'] : ['€100m', '€60m', '€40m', '€39.2m', '€0.8m', '€8,711']) assert.ok(labels.includes(label));
}
function surveyIcons(v) {
  const { nodes } = inspect(v), roofs = nodes.filter(node => tag(node) === 'path');
  assert.equal(roofs.length, 8);
  assert.equal(roofs.filter(node => attrs(node).stroke === paint('#73dbc2')).length, 2);
  assert.equal(roofs.filter(node => attrs(node).stroke === paint('#647e93')).length, 6);
  assert.ok(roofs.every(node => attrs(node).opacity === '1'));
  for (const color of ['#73dbc2', '#647e93']) {
    const count = color === '#73dbc2' ? 2 : 6;
    assert.equal(nodes.filter(node => tag(node) === 'rect' && attrs(node).fill === paint(color) && number(node, 'height') > 30 && number(node, 'height') < 40).length, count * 3);
    assert.equal(nodes.filter(node => tag(node) === 'line' && attrs(node).stroke === paint(color) && attrs(node)['stroke-width'] === '3').length, count);
  }
  const labels = nodes.filter(node => tag(node) === 'text').map(textOf);
  assert.ok(labels.includes('2 / 8')); assert.ok(labels.includes('6 / 8'));
}
test('AFT ordinal ranks, inventory proportions and survey respondent counts match their separate denominators', () => {
  for (const v of variants) {
    if (v.kind === '01-classements') rankedBanks(v);
    if (v.kind === '02-portage') inventoryBars(v);
    if (v.kind === '04-enquete-fed') surveyIcons(v);
  }
});
test('illustrative funding, spread and loss calculations recompute from exact integer inputs', () => {
  const face = 100_000_000n, inventory = face - 60_000_000n;
  const repo = inventory * 98n / 100n, gap = inventory - repo;
  assert.equal(repo, 39_200_000n); assert.equal(gap, 800_000n);
  const interestNumerator = repo * 4n * 2n, interestDenominator = 100n * 360n;
  assert.equal((interestNumerator + interestDenominator / 2n) / interestDenominator, 8711n);
  assert.equal(face * (10005n - 10000n) / 10000n, 50_000n);
  assert.equal(inventory / 1000n, 40_000n);
  assert.equal(2_000_000n + 98_000_000n, face);
});
test('matched repo flows and CCP net obligations retain both cash legs and the original transaction volume', () => {
  const obligations = [['A', 'B', 100], ['B', 'C', 100], ['C', 'A', 80]], net = { A: 0, B: 0, C: 0 };
  for (const [payer, payee, amount] of obligations) { net[payer] -= amount; net[payee] += amount; }
  assert.deepEqual(net, { A: -20, B: 0, C: 20 });
  assert.equal(obligations.reduce((sum, [, , amount]) => sum + amount, 0), 280);
  for (const v of variants.filter(entry => ['03-financement', '06-compensation'].includes(entry.kind))) {
    const { nodes } = inspect(v), labels = nodes.filter(node => tag(node) === 'text').map(textOf);
    const lines = nodes.filter(node => tag(node) === 'line' && attrs(node).stroke === paint('#73dbc2'));
    if (v.kind === '03-financement') {
      assert.equal(lines.length, 2);
      const collateral = nodes.filter(node => tag(node) === 'line' && attrs(node).stroke === paint('#f1b56f'));
      assert.equal(collateral.length, 2);
      for (const line of lines) assert.ok(v.mobile ? number(line, 'y2') > number(line, 'y1') : number(line, 'x2') > number(line, 'x1'));
      for (const line of collateral) assert.ok(v.mobile ? number(line, 'y2') < number(line, 'y1') : number(line, 'x2') < number(line, 'x1'));
      assert.equal(labels.filter(label => label === (v.lang === 'fr' ? '98 M€' : '€98m')).length, v.mobile ? 2 : 4);
      assert.equal(labels.filter(label => label === (v.lang === 'fr' ? '100 M€' : '€100m')).length, 2);
    } else {
      assert.equal(lines.length, 5);
      assert.equal(labels.filter(label => label === '100').length, 2);
      assert.equal(labels.filter(label => label === '80').length, 1);
      assert.equal(labels.filter(label => label === '20').length, 2);
      assert.ok(labels.includes('net 0'));
      // A -> B -> C -> A before; A -> CCP -> C after.
      assert.ok(number(lines[0], 'x2') > number(lines[0], 'x1'));
      assert.ok(number(lines[1], 'x2') > number(lines[1], 'x1'));
      assert.ok(number(lines[2], 'x2') < number(lines[2], 'x1'));
      assert.ok(lines.slice(3).every(line => number(line, 'x2') > number(line, 'x1') && number(line, 'y2') > number(line, 'y1')));
    }
    const arrows = nodes.filter(node => tag(node) === 'polygon');
    assert.equal(arrows.length, v.kind === '03-financement' ? 4 : 5);
    for (const arrow of arrows) {
      const tip = attrs(arrow).points.split(' ')[0].split(',').map(Number);
      assert.ok(nodes.some(node => tag(node) === 'line' && Math.abs(number(node, 'x2') - tip[0]) < .01 && Math.abs(number(node, 'y2') - tip[1]) < .01 && attrs(node).stroke === attrs(arrow).fill));
    }
  }
});
test('data checks reject plausible-looking but false ranks, widths and survey categories', () => {
  const rank = variants.find(v => v.kind === '01-classements');
  assert.throws(() => rankedBanks(mutate(rank, (_, nodes) => { nodes.find(node => tag(node) === 'text' && textOf(node) === '5').text = [{ '#text': '4' }]; })));
  const bar = variants.find(v => v.kind === '02-portage');
  assert.throws(() => inventoryBars(mutate(bar, (_, nodes) => { attrs(nodes.find(node => tag(node) === 'rect' && attrs(node).y === '611')).width = '580'; })));
  const survey = variants.find(v => v.kind === '04-enquete-fed');
  assert.throws(() => surveyIcons(mutate(survey, (_, nodes) => { attrs(nodes.find(node => tag(node) === 'path')).stroke = paint('#647e93'); })));
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
    const svg = find('.l0g-debt-02 .debt-figure svg');
    assert.equal(svg.width, '100%'); assert.equal(svg.height, 'auto'); assert.equal(svg['max-width'], '100%');
    assert.equal(find('.l0g-debt-02 .debt-mobile').display, 'none');
    assert.equal(find('.l0g-debt-02 .debt-mobile', '(max-width:680px)').display, 'block');
    assert.equal(find('.l0g-debt-02 .debt-desktop', '(max-width:680px)').display, 'none');
    assert.equal(find('.l0g-debt-02 figcaption').padding, '1rem .15rem');
    assert.equal(find('.l0g-debt-02 .debt-figure').margin, '2.5rem auto 3rem');
    assert.equal(find('.l0g-debt-02 .debt-figure')['max-width'], '820px');
    assert.equal(find('.l0g-debt-02 .debt-figure', '(max-width:680px)')['max-width'], '416px');
    assert.equal(find('.l0g-debt-02 .sources li')['border-bottom'], '1px solid var(--color-line-strong)');
  }
});
