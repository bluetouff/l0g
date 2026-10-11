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
const kinds = ['01-adjudication', '02-prix-rendement', '03-nominal-tresorerie', '04-circulation', '05-acheteurs-us'];
const sourceUrls = {
  '02': 'https://www.aft.gouv.fr/fr/dernieres-adjudications',
  '03': 'https://www.aft.gouv.fr/fr/techniques-demissions',
  '06': 'https://www.aft.gouv.fr/files/medias-aft/1_AFT/2.Partenaires/2.2_SVT/Annexes_charte%20SVT%202025.pdf',
  '07': 'https://www.aft.gouv.fr/fr/banque-de-france',
  '08': 'https://www.aft.gouv.fr/fr/titre/fr0014018yr0',
  '10': 'https://www.aft.gouv.fr/fr/glossaire-accord%C3%A9on',
  '11': 'https://www.treasurydirect.gov/instit/annceresult/press/preanre/2026/R_20261008_3.pdf',
  '12': 'https://www.treasurydirect.gov/auctions/how-auctions-work/',
  '13': 'https://www.treasurydirect.gov/help-center/faqs/auction-faqs/',
  '15': 'https://www.newyorkfed.org/markets/primarydealers',
};
const sourceIds = [['03'], ['08'], ['02', '06'], ['07', '10', '12', '15'], ['11', '13']];
const dataKinds = ['hypothetical', 'observed_data_and_own_calculations', 'observed_data_and_own_calculations', 'mechanism', 'observed_data_and_own_calculations'];
const articles = ['fr', 'en'].map(lang => ({ lang, raw: read(`src/content/${lang === 'fr' ? 'posts' : 'posts-en'}/dette-etats-01-premier-acheteur.mdx`) }));

// Bounded scans avoid a broad backtracking expression over article content.
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
    return { lang, kind, mobile, name: `${kind}-${lang}-${mobile ? 'mobile' : 'desktop'}`, svg };
  });
});

// SHA-256 of the complete ordered XML trees from the supplied original SVGs.
// Only the added root style, JSON URL escaping, the exact conversion of the
// source hyperlink into its local citation, the bijective semantic paint mapping
// below and the hatch's contrast repair (.50 to .75 opacity) are reversed.
// Every original paint role, geometry, metadata and label stays in the
// fingerprint, including whitespace text nodes.
const originalSignatures = {
  '01-adjudication-en-desktop': '47280c926a1106e54088c6415f872c65d309b584e9588a62c8d54183e65a6d41',
  '01-adjudication-en-mobile': 'efaf26d11472e8a9813c24eb95d5ed1bf3d635fde43833b94e73b4e418eddf03',
  '01-adjudication-fr-desktop': '5df6432d27e8ad0a81170be39e85feacdff55221c66c33ef40a1f0e3697081bb',
  '01-adjudication-fr-mobile': '17a182729a23f736849df5513047018aa7cbb817d4d960306b8d4eb13d1bdce8',
  '02-prix-rendement-en-desktop': 'b19e8f1b628308a580c519af3e944461b1527a3626bc1a6a8afd3a1499773655',
  '02-prix-rendement-en-mobile': 'd7eb19af1e9c29da4ed10d9622094694d6ef15ef1e6ee7f13599fe36b8407b04',
  '02-prix-rendement-fr-desktop': '83768946623c7b31ab801413270e3278643850510b95bb3f5d64665eb5544f2f',
  '02-prix-rendement-fr-mobile': 'c7e0cb2cecfddd3976feae4fbecb675cc0405a61117f46c03d513418c9f6ecf3',
  '03-nominal-tresorerie-en-desktop': 'ff5109765a024acb2cbfd3b7a23e4f650898857cd2c9471e3da04481fa6ab18d',
  '03-nominal-tresorerie-en-mobile': '7b16226fa4135351b4e901d05c0fa6a15f5a849fea8a3028f651b6b385d01753',
  '03-nominal-tresorerie-fr-desktop': 'ece24a6add90632689226e9db8e0754f2dfc822cb1f74dd5e27e913747fd7109',
  '03-nominal-tresorerie-fr-mobile': '4065db701415de3e59104e53af31eb878a0e017d6d81af522806c80a59a3f8c6',
  '04-circulation-en-desktop': '9fd3d1511f4f92f9792931a57403f3355b09475d24cb5f5bd0c02973427836a3',
  '04-circulation-en-mobile': '2dc263411edaa42067c4812dc5e0d92912c00e707e5eba85a228fec86b006b53',
  '04-circulation-fr-desktop': '65a4416f8a808a320993bb4530550a375568a4808e1c806ac8767e60d08578df',
  '04-circulation-fr-mobile': '80e7dfc8da992564462963d576d7b15648903cf79523edae6fb88d3361838af5',
  '05-acheteurs-us-en-desktop': '26fba52acfc9bb816abbc2a129810437ac0f2551130f1043192e2bd57ecce819',
  '05-acheteurs-us-en-mobile': '7bad3a21cc0152335c89da922a0304d6fe421539435fcdc6795b87309c299d93',
  '05-acheteurs-us-fr-desktop': '44f9f2b8854a6280a893ab70af80b8bf308724fb827d8258ce8a0218fda288e5',
  '05-acheteurs-us-fr-mobile': 'ecab34e5af563b804899f36c4efb224299cdb54c8bc3f492941be04517802414',
};
const allowedAttributes = Object.fromEntries(Object.entries({
  svg: 'xmlns viewBox width height role aria-labelledby style',
  title: 'id', desc: 'id', defs: '', metadata: '',
  pattern: 'id width height patternUnits',
  path: 'd fill stroke stroke-opacity stroke-width stroke-linejoin stroke-linecap',
  rect: 'x y width height rx fill stroke stroke-width',
  text: 'x y font-family font-size font-weight fill text-anchor',
  line: 'x1 y1 x2 y2 stroke stroke-width stroke-dasharray',
  polygon: 'points fill', circle: 'cx cy r fill stroke stroke-width', a: 'href',
}).map(([key, value]) => [key, new Set(value.split(' ').filter(Boolean))]));
const paintTokens = new Map([
  ['#101b27', 'var(--color-ink)'],
  ['#172737', 'var(--color-surface)'],
  ['#21374b', 'var(--color-surface-2)'],
  ['#304456', 'var(--color-line-strong)'],
  ['#66dfc1', 'var(--color-signal)'],
  ['#91b9f5', 'var(--color-topic-blue)'],
  ['#aec0cd', 'var(--color-muted)'],
  ['#f5f4ef', 'var(--color-paper)'],
  ['#ffd18b', 'var(--color-amber)'],
]);
const originalPaints = new Map([...paintTokens].map(([original, token]) => [token, original]));
assert.equal(paintTokens.size, 9);
assert.equal(originalPaints.size, paintTokens.size, 'The semantic paint mapping must remain bijective');
const paint = original => {
  assert.ok(paintTokens.has(original), `Unknown original paint ${original}`);
  return paintTokens.get(original);
};
const paints = new Set(['none', ...paintTokens.values()]);
const numericAttributes = new Set('x y x1 y1 x2 y2 width height rx cx cy r font-size stroke-width stroke-opacity'.split(' '));

function inspect(v) {
  assert.ok(v.svg.length < 100_000);
  assert.doesNotMatch(v.svg, /<!|<\?/u, 'No declarations, entity definitions or processing instructions');
  assert.equal(XMLValidator.validate(v.svg), true);
  const parsed = parser.parse(v.svg);
  assert.equal(parsed.length, 1);
  const root = parsed[0], nodes = nodesOf(root), ids = new Set();
  assert.equal(tag(root), 'svg');
  assert.equal(attrs(root).xmlns, 'http://www.w3.org/2000/svg');
  assert.equal(attrs(root).style, 'width:100%;height:auto');
  assert.equal(attrs(root).role, 'img');
  const viewBox = attrs(root).viewBox.split(' ').map(Number);
  assert.equal(viewBox.length, 4);
  assert.deepEqual(viewBox.slice(0, 2), [0, 0]);
  assert.equal(viewBox[2], v.mobile ? 640 : 1200);
  assert.equal(number(root, 'width'), viewBox[2]);
  assert.equal(number(root, 'height'), viewBox[3]);
  assert.ok(viewBox[3] > 0 && viewBox[3] < 2000);
  const expectedIds = ['title', 'desc', 'hatch'].map(suffix => `${v.name}-${suffix}`);
  const index = kinds.indexOf(v.kind);
  assert.ok(index >= 0);
  for (const node of nodes) {
    const permitted = allowedAttributes[tag(node)];
    assert.ok(permitted, `Unsupported SVG tag ${tag(node)}`);
    if (tag(node) === 'svg') assert.equal(node, root, 'No nested SVG');
    for (const [key, value] of Object.entries(attrs(node))) {
      assert.ok(permitted.has(key), `Unsupported ${tag(node)} attribute ${key}`);
      assert.equal(typeof value, 'string');
      if (numericAttributes.has(key)) number(node, key);
      if (key === 'fill' || key === 'stroke') assert.ok(paints.has(value) || (key === 'fill' && value === `url(#${v.name}-hatch)`), value);
      if (key === 'id') { assert.ok(expectedIds.includes(value)); assert.ok(!ids.has(value)); ids.add(value); }
      if (key === 'font-family') assert.equal(value, 'Arial, Helvetica, sans-serif');
      if (key === 'font-weight') assert.ok(['400', '700'].includes(value));
      if (key === 'font-size') assert.ok(number(node, key) >= 17 && number(node, key) <= 52);
      if (key === 'text-anchor') assert.ok(['start', 'middle', 'end'].includes(value));
      if (key === 'stroke-linejoin' || key === 'stroke-linecap') assert.equal(value, 'round');
      if (key === 'stroke-opacity') assert.ok(number(node, key) >= 0 && number(node, key) <= 1);
      if (key === 'stroke-dasharray') assert.equal(value, '5 7');
      if (key === 'patternUnits') assert.equal(value, 'userSpaceOnUse');
      if (key === 'href') assert.equal(value, `#source-${sourceIds[index][0]}`);
      if (key === 'style' || key === 'xmlns') assert.equal(node, root);
    }
  }
  assert.deepEqual([...ids].sort(), expectedIds.sort());
  assert.equal(attrs(root)['aria-labelledby'], `${v.name}-title ${v.name}-desc`);
  for (const type of ['title', 'desc', 'metadata', 'pattern', 'a']) {
    assert.equal(nodes.filter(node => tag(node) === type).length, 1, type);
  }
  for (const type of ['title', 'desc']) {
    const node = nodes.find(candidate => tag(candidate) === type);
    assert.equal(attrs(node).id, `${v.name}-${type}`);
    assert.ok(textOf(node).trim());
  }
  const pattern = nodes.find(node => tag(node) === 'pattern');
  assert.equal(attrs(pattern).id, `${v.name}-hatch`);
  assert.equal(number(pattern, 'width'), 9);
  assert.equal(number(pattern, 'height'), 9);
  const hatchPaths = children(pattern).filter(node => tag(node) === 'path');
  assert.equal(hatchPaths.length, 1);
  assert.equal(attrs(hatchPaths[0])['stroke-opacity'], '.75');
  assert.deepEqual(nodes.filter(node => Object.hasOwn(attrs(node), 'stroke-opacity')), hatchPaths);
  const metadata = JSON.parse(textOf(nodes.find(node => tag(node) === 'metadata')));
  assert.deepEqual(metadata, {
    creator: 'l0g', verification_date: '2026-10-11', figure: v.kind, language: v.lang,
    sources: sourceIds[index].map(id => ({ id, url: sourceUrls[id] })), kind: dataKinds[index],
  });
  return { root, nodes, width: viewBox[2], height: viewBox[3] };
}
function signature(v) {
  const { root } = inspect(v);
  const hatch = nodesOf(root).find(node => tag(node) === 'pattern');
  const hatchPath = children(hatch).find(node => tag(node) === 'path');
  const metadata = nodesOf(root).find(node => tag(node) === 'metadata');
  metadata.metadata = [{ '#text': textOf(metadata).replaceAll(String.raw`https\u003a//`, 'https://').replaceAll(String.raw`\u002e`, '.') }];
  const canonical = (node, isRoot = false) => {
    if (tag(node) === '#text') return ['#text', node['#text']];
    const attributes = { ...attrs(node) };
    if (isRoot) delete attributes.style;
    if (node === hatchPath) {
      assert.equal(attributes['stroke-opacity'], '.75');
      attributes['stroke-opacity'] = '.50';
    }
    for (const key of ['fill', 'stroke']) {
      if (originalPaints.has(attributes[key])) attributes[key] = originalPaints.get(attributes[key]);
    }
    if (tag(node) === 'a') {
      const id = sourceIds[kinds.indexOf(v.kind)][0];
      assert.equal(attributes.href, `#source-${id}`);
      attributes.href = sourceUrls[id];
      attributes.target = '_blank';
      attributes.rel = 'noopener noreferrer';
    }
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
  const advance = font.getAdvanceWidth(value, size), anchor = attrs(node)['text-anchor'];
  const x = number(node, 'x') - (anchor === 'middle' ? advance / 2 : anchor === 'end' ? advance : 0);
  const glyphs = [];
  font.forEachGlyph(value, x, number(node, 'y'), size, {}, (glyph, gx, gy, fontSize, options) => {
    const points = glyph.getPath(gx, gy, fontSize, options).commands.filter(command => command.type !== 'Z').flatMap(command => ['x', 'x1', 'x2'].flatMap((key, i) => key in command ? [[command[key], command[['y', 'y1', 'y2'][i]]]] : []));
    if (points.length) glyphs.push(pointsBox(points));
  });
  return { ...pointsBox(glyphs.flatMap(box => [[box.x, box.y], [box.right, box.bottom]])), glyphs };
}
function pathPoints(value) {
  assert.ok(value.length < 2048);
  const tokens = value.match(/[ML]|-?(?:\d+(?:\.\d+)?|\.\d+)/gu) ?? [];
  assert.equal(value.replace(/[ML]|-?(?:\d+(?:\.\d+)?|\.\d+)|[ ,]/gu, ''), '');
  assert.equal(tokens.length % 3, 0);
  const points = [];
  for (let index = 0; index < tokens.length; index += 3) {
    assert.ok(['M', 'L'].includes(tokens[index]));
    const point = tokens.slice(index + 1, index + 3).map(Number);
    assert.ok(point.every(Number.isFinite));
    points.push(point);
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
  // A pattern's intentionally overshooting hatch is clipped to its 9x9 tile.
  const visible = children(root).flatMap(node => tag(node) === 'a' ? children(node) : [node]).filter(node => ['text', 'rect', 'line', 'polygon', 'path', 'circle'].includes(tag(node)));
  const canvas = { x: 0, y: 0, right: width, bottom: height }, textBoxes = [];
  for (const [index, node] of visible.entries()) {
    if (tag(node) !== 'text') {
      const box = shapeBox(node), stroke = attrs(node).stroke ? number(node, 'stroke-width') / 2 : 0;
      assert.ok(box.right >= box.x && box.bottom >= box.y);
      assert.ok(within({ x: box.x - stroke, y: box.y - stroke, right: box.right + stroke, bottom: box.bottom + stroke }, canvas), `${v.name}: shape outside viewBox`);
      continue;
    }
    const box = textBox(node), label = textOf(node);
    assert.ok(within(box, canvas, 2), `${v.name}: glyph outside viewBox: ${label} ${JSON.stringify(box)}`);
    const center = { x: (box.x + box.right) / 2, y: (box.y + box.bottom) / 2 };
    const card = visible.slice(0, index).filter(candidate => tag(candidate) === 'rect' && number(candidate, 'rx') >= 12 && number(candidate, 'x') > 0 && within({ ...center, right: center.x, bottom: center.y }, shapeBox(candidate))).at(-1);
    if (card) assert.ok(within(box, shapeBox(card), 2), `${v.name}: glyph outside card: ${label}`);
    // Run-wide rectangles can overlap where a comma descends under empty space
    // beside an axis tick. Compare individual glyph outlines' conservative bounds.
    for (const prior of textBoxes) assert.ok(!overlaps(box, prior) || !box.glyphs.some(glyph => prior.glyphs.some(other => overlaps(glyph, other))), `${v.name}: label collision: ${label}/${prior.label}`);
    for (const later of visible.slice(index + 1).filter(candidate => tag(candidate) === 'rect' && attrs(candidate).fill !== 'none')) assert.ok(!overlaps(box, shapeBox(later)), `${v.name}: later paint conceals label: ${label}`);
    textBoxes.push({ ...box, label });
  }
}

test('twenty supplied SVG compositions preserve all original fields except the documented integration adaptations', () => {
  assert.deepEqual(variants.map(v => v.name).sort(), Object.keys(originalSignatures).sort());
  for (const v of variants) assert.equal(signature(v), originalSignatures[v.name], v.name);
});
test('static XML, accessible IDs, source metadata and citation targets remain exact and local', () => {
  const ids = new Set();
  for (const v of variants) {
    const { nodes } = inspect(v);
    for (const node of nodes) if (attrs(node).id) { assert.ok(!ids.has(attrs(node).id)); ids.add(attrs(node).id); }
    const article = articles.find(entry => entry.lang === v.lang).raw;
    for (const id of sourceIds[kinds.indexOf(v.kind)]) assert.ok(article.includes(`id="source-${id}"`));
  }
  assert.equal(ids.size, 60);
});
test('MDX metadata uses JSON URL escapes to keep automatic links out of SVG JSON', () => {
  for (const v of variants) {
    const start = v.svg.indexOf('<metadata>') + '<metadata>'.length;
    const end = v.svg.indexOf('</metadata>', start);
    assert.ok(start >= '<metadata>'.length && end > start);
    const source = v.svg.slice(start, end);
    assert.doesNotMatch(source, /https:\/\//u);
    assert.doesNotMatch(source, /www\./u);
    assert.equal(source.split(String.raw`https\u003a//`).length - 1, sourceIds[kinds.indexOf(v.kind)].length);
    // inspect also checks the decoded JSON against every complete canonical URL.
    inspect(v);
  }
});
test('deterministic Liberation Sans glyph bounds and drawn primitives stay inside canvases and cards', () => {
  const failures = [];
  for (const v of variants) { try { geometry(v); } catch (error) { failures.push(error.message); } }
  assert.deepEqual(failures, []);
});

test('original composition signatures reject changes to paints, text, labels, metadata, coordinates and nesting', () => {
  const v = variants[0];
  for (const change of [
    (_, nodes) => { attrs(nodes.find(node => tag(node) === 'rect')).fill = paint('#172737'); },
    (_, nodes) => { attrs(nodes.find(node => tag(node) === 'text')).x = '57'; },
    (_, nodes) => { nodes.find(node => tag(node) === 'text').text = [{ '#text': 'A changed label' }]; },
    (_, nodes) => { nodes.find(node => tag(node) === 'metadata').metadata = [{ '#text': '{}' }]; },
    root => { const text = root.svg.find(node => tag(node) === 'text'); root.svg.push(structuredClone(text)); },
    root => {
      const index = root.svg.findIndex(node => tag(node) === 'text');
      const [label] = root.svg.splice(index, 1);
      root.svg.find(node => tag(node) === 'a').a.unshift(label);
    },
  ]) {
    assert.throws(() => assert.equal(signature(mutate(v, change)), originalSignatures[v.name]));
  }
});
test('XML and exact local URL contracts reject active content, malformed XML, escaped URLs and cross-figure references', () => {
  const v = variants[0];
  for (const payload of ['<script/>', '<foreignObject/>', '<image href="https://example.com/x"/>', '<use href="#source-03"/>', '<svg/>']) assert.throws(() => inspect({ ...v, svg: v.svg.replace('</svg>', `${payload}</svg>`) }));
  for (const href of ['javascript:alert(1)', 'https://www.aft.gouv.fr/fr/techniques-demissions', '//example.com', '#source-03%0a', '#source-03 ', '#source-02']) assert.throws(() => inspect(mutate(v, (_, nodes) => { attrs(nodes.find(node => tag(node) === 'a')).href = href; })));
  for (const fill of ['url(https://example.com/paint)', 'url(#01-adjudication-en-desktop-hatch)', 'url( #01-adjudication-fr-desktop-hatch)', 'uRl(#01-adjudication-fr-desktop-hatch)', 'url(#01-adjudication-fr-desktop-hatch) red']) assert.throws(() => inspect(mutate(v, (_, nodes) => { attrs(nodes.find(node => tag(node) === 'rect')).fill = fill; })));
  assert.throws(() => inspect({ ...v, svg: v.svg.replace('#source-03', 'java&#x73;cript:alert(1)') }));
  assert.throws(() => inspect({ ...v, svg: `<!DOCTYPE svg [<!ENTITY x "bad">]>${v.svg}` }));
  assert.throws(() => inspect({ ...v, svg: v.svg.replace('</title>', '</desc>') }));
  assert.throws(() => inspect(mutate(v, root => { attrs(root).onload = 'alert(1)'; })));
  assert.throws(() => inspect(mutate(v, (_, nodes) => { attrs(nodes.find(node => tag(node) === 'text')).style = 'display:none'; })));
});
test('paint tokens reject fixed colors, fabricated variables, fallbacks, URL payloads and declaration suffixes', () => {
  const v = variants[0];
  const invalid = [
    ...paintTokens.keys(),
    'var(--color-signal-fake)',
    'var(--color-signal, #5eead4)',
    'var(--color-signal, url(https://example.com/paint))',
    'var(--color-signal) url(https://example.com/paint)',
    'var(--color-signal);fill:url(https://example.com/paint)',
    'var(--color-signal) currentColor',
    'var( --color-signal)',
    'VAR(--color-signal)',
    'var(--color-signal)\n',
  ];
  for (const key of ['fill', 'stroke']) for (const value of invalid) {
    assert.throws(() => inspect(mutate(v, (_, nodes) => {
      attrs(nodes.find(node => tag(node) === (key === 'fill' ? 'rect' : 'path')))[key] = value;
    })), `Reject ${key}=${value}`);
  }
  assert.throws(() => inspect({ ...v, svg: v.svg.replace('fill="var(--color-ink)"', 'fill="var(--color-ink&#x2c; url(https://example.com/paint))"') }));
});
test('the hatch contrast repair is limited to its single known path and rejects the original weak opacity', () => {
  const v = variants[0];
  for (const opacity of ['.50', '.5', '0', '1', '.750']) {
    assert.throws(() => inspect(mutate(v, (_, nodes) => {
      attrs(nodes.find(node => Object.hasOwn(attrs(node), 'stroke-opacity')))['stroke-opacity'] = opacity;
    })));
  }
  assert.throws(() => inspect(mutate(v, (_, nodes) => {
    attrs(nodes.find(node => tag(node) === 'line'))['stroke-opacity'] = '.75';
  })));
});

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
test('all five label colors retain at least 4.5:1 contrast on the three figure surfaces in both site themes', () => {
  const foregrounds = ['paper', 'muted', 'signal', 'amber', 'topic-blue'];
  const used = new Set(variants.flatMap(v => inspect(v).nodes.filter(node => tag(node) === 'text').map(node => attrs(node).fill)));
  assert.deepEqual([...used].sort(), foregrounds.map(role => `var(--color-${role})`).sort());
  for (const [theme, palette] of Object.entries(themePalettes())) {
    for (const foreground of foregrounds) for (const background of ['ink', 'surface', 'surface-2']) {
      const ratio = contrast(rgb(palette.get(`--color-${foreground}`)), rgb(palette.get(`--color-${background}`)));
      assert.ok(ratio >= 4.5, `${theme}: ${foreground}/${background} contrast ${ratio}`);
    }
  }
});
test('75 percent amber hatch strokes reach 3:1 contrast on their dark and light backgrounds', () => {
  for (const [theme, palette] of Object.entries(themePalettes())) {
    const foreground = rgb(palette.get('--color-amber'));
    for (const background of ['ink', 'surface-2']) {
      const base = rgb(palette.get(`--color-${background}`));
      const blended = foreground.map((channel, index) => channel * 0.75 + base[index] * 0.25);
      const ratio = contrast(blended, base);
      assert.ok(ratio >= 3, `${theme}: hatch/${background} contrast ${ratio}`);
    }
  }
});
test('oversized and unterminated SVG input is rejected before parsing or path matching', () => {
  const v = variants[0];
  assert.throws(() => inspect({ ...v, svg: `<svg>${' '.repeat(100_000)}</svg>` }));
  assert.throws(() => extractSvg(`<svg ${'x'.repeat(100_000)}`));
  assert.throws(() => pathPoints(`M${'1'.repeat(2048)} 0`));
});
test('geometry independently rejects moved glyphs, narrow cards, hidden labels and displaced shapes', () => {
  const v = variants[0];
  assert.throws(() => geometry(mutate(v, (_, nodes) => { attrs(nodes.find(node => tag(node) === 'text')).x = '1199'; })), /outside viewBox/u);
  assert.throws(() => geometry(mutate(v, (_, nodes) => { attrs(nodes.find(node => tag(node) === 'rect' && attrs(node).rx === '14')).width = '120'; })), /outside card/u);
  assert.throws(() => geometry(mutate(v, root => { const label = root.svg.find(node => tag(node) === 'text'); root.svg.push(structuredClone(label)); })), /collision/u);
  assert.throws(() => geometry(mutate(v, root => { root.svg.push({ rect: [], ':@': { x: '40', y: '20', width: '1100', height: '40', rx: '0', fill: paint('#172737') } }); })), /conceals label/u);
  assert.throws(() => geometry(mutate(v, (_, nodes) => { attrs(nodes.find(node => tag(node) === 'rect')).x = '1'; })), /shape outside viewBox/u);
});

function barProportions(v) {
  const { nodes } = inspect(v), rectangles = nodes.filter(node => tag(node) === 'rect');
  if (v.kind === '01-adjudication') {
    const requested = rectangles.filter(node => attrs(node).fill === paint('#21374b'));
    const awarded = rectangles.filter(node => attrs(node).fill === paint('#66dfc1'));
    assert.equal(requested.length, 3); assert.equal(awarded.length, 3);
    const unit = number(requested[0], 'width') / 50;
    [50, 40, 40].forEach((value, i) => close(number(requested[i], 'width'), unit * value));
    [50, 40, 10].forEach((value, i) => close(number(awarded[i], 'width'), unit * value));
    close((50 * 99.20 + 40 * 99.10 + 10 * 99) / 100, 99.14, 1e-10);
    assert.ok(textOf(nodes.find(node => tag(node) === 'desc')).includes(v.lang === 'fr' ? '99,14' : '99.14'));
  }
  if (v.kind === '03-nominal-tresorerie') {
    const nominal = rectangles.filter(node => attrs(node).fill === paint('#21374b') && attrs(node).rx === '3');
    const cash = rectangles.filter(node => attrs(node).fill === paint('#66dfc1'));
    const discount = rectangles.filter(node => attrs(node).fill === `url(#${v.name}-hatch)`);
    assert.equal(nominal.length, 4); assert.equal(cash.length, 4); assert.equal(discount.length, 4);
    const amounts = [7927, 2056, 2828, 2795], prices = [90.38, 90.46, 67.10, 57.23];
    const unit = (v.mobile ? 572 : 580) / 8000;
    amounts.forEach((amount, i) => {
      close(number(nominal[i], 'width'), amount * unit);
      close(number(cash[i], 'width'), amount * prices[i] / 100 * unit);
      close(number(discount[i], 'width'), amount * (1 - prices[i] / 100) * unit);
      close(number(discount[i], 'x'), number(cash[i], 'x') + number(cash[i], 'width'));
    });
    assert.equal(amounts.reduce((sum, amount) => sum + amount), 15606);
    close(amounts.reduce((sum, amount, i) => sum + amount * prices[i] / 100, 0), 12521.4467, 1e-8);
  }
  if (v.kind === '05-acheteurs-us') {
    const requested = rectangles.filter(node => attrs(node).fill === paint('#91b9f5'));
    const awarded = rectangles.filter(node => attrs(node).fill === paint('#66dfc1'));
    assert.equal(requested.length, 3); assert.equal(awarded.length, 3);
    const tenders = [29432.5, 7608.9, 18811.544], awards = [1490.5, 4583.0441, 15866.0595];
    const unit = (v.mobile ? 455 : 660) / 30000;
    tenders.forEach((amount, i) => close(number(requested[i], 'width'), amount * unit));
    awards.forEach((amount, i) => close(number(awarded[i], 'width'), amount * unit));
    close(awards[0] / awards.reduce((a, b) => a + b) * 100, 6.793650547086457, 1e-10);
  }
}
test('auction, clean proceeds and US allocation bars retain the verified numerators and denominators', () => {
  for (const v of variants) barProportions(v);
});
test('price and yield paths preserve the five separate auction observations and fixed coupon reference', () => {
  for (const v of variants.filter(entry => entry.kind === '02-prix-rendement')) {
    const { nodes } = inspect(v), paths = nodes.filter(node => tag(node) === 'path' && attrs(node).fill === 'none');
    assert.equal(paths.length, 2);
    const values = [[99.16, 99.74, 98.28, 95.66, 90.38], [3.80, 3.73, 3.90, 4.23, 4.93]];
    const circles = nodes.filter(node => tag(node) === 'circle');
    assert.equal(circles.length, 10);
    paths.forEach((path, series) => {
      const points = pathPoints(attrs(path).d);
      assert.equal(points.length, 5);
      const unit = (points[0][1] - points[4][1]) / (values[series][4] - values[series][0]);
      assert.ok(unit > 0);
      points.forEach(([x, y], i) => {
        close(x, points[0][0] + (points[4][0] - points[0][0]) * i / 4, 1e-8);
        close(y, points[0][1] - unit * (values[series][i] - values[series][0]), 1e-8);
        close(number(circles[series * 5 + i], 'cx'), x, 1e-8);
        close(number(circles[series * 5 + i], 'cy'), y, 1e-8);
      });
      if (series === 1) {
        const coupon = nodes.find(node => tag(node) === 'line' && attrs(node)['stroke-dasharray'] === '5 7');
        close(number(coupon, 'y1'), points[0][1] - unit * (3.7 - values[series][0]), 1e-8);
      }
    });
  }
});
test('bar tests reject a numerically wrong width even when the canvas still contains it', () => {
  for (const kind of ['01-adjudication', '03-nominal-tresorerie', '05-acheteurs-us']) {
    const v = variants.find(entry => entry.kind === kind);
    assert.throws(() => barProportions(mutate(v, (_, nodes) => { attrs(nodes.find(node => tag(node) === 'rect' && attrs(node).fill === paint('#66dfc1'))).width = '100'; })));
  }
});
test('both article styles preserve desktop/mobile alternation, fluid SVG dimensions and caption separation', () => {
  for (const { raw } of articles) {
    const start = raw.indexOf('<style>{`'), end = raw.indexOf('`}</style>', start);
    assert.ok(start >= 0 && end > start);
    const css = postcss.parse(raw.slice(start + '<style>{`'.length, end));
    css.walkDecls(declaration => {
      assert.ok(!['fill', 'stroke'].includes(declaration.prop) && !declaration.prop.startsWith('--color-'), 'Article CSS must not override SVG semantic paints');
    });
    const rules = [];
    css.walkRules(rule => rules.push({ selector: rule.selector, media: rule.parent.type === 'atrule' ? rule.parent.params : '', declarations: Object.fromEntries(rule.nodes.filter(node => node.type === 'decl').map(node => [node.prop, node.value])) }));
    const find = (selector, media = '') => rules.find(rule => rule.selector === selector && rule.media === media)?.declarations;
    const svg = find('.l0g-debt-01 .debt-figure svg');
    assert.equal(svg.width, '100%'); assert.equal(svg.height, 'auto'); assert.equal(svg['max-width'], '100%');
    assert.equal(find('.l0g-debt-01 .debt-figure .debt-mobile').display, 'none');
    assert.equal(find('.l0g-debt-01 .debt-figure .debt-mobile', '(max-width:650px)').display, 'block');
    assert.equal(find('.l0g-debt-01 .debt-figure .debt-desktop', '(max-width:650px)').display, 'none');
    assert.equal(find('.l0g-debt-01 .debt-figure figcaption').margin, '1rem auto 0');
    assert.equal(find('.l0g-debt-01 .debt-figure').margin, '2.4rem auto 3rem');
    assert.equal(find('.l0g-debt-01 .debt-figure')['max-width'], '820px');
    assert.equal(find('.l0g-debt-01 .debt-figure', '(max-width:650px)')['max-width'], '416px');
    assert.equal(find('.l0g-debt-01 .debt-sources')['border-top'], '1px solid var(--color-line-strong)');
  }
});
