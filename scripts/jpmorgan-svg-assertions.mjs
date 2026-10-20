import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { XMLParser, XMLValidator } from 'fast-xml-parser';
import { parseFragment } from 'parse5';
import opentype from '@shuding/opentype.js';

// Complete supplied scenes retain every coordinate, font and element order.
// Adaptations: semantic themes, native attributes, MDX whitespace, responsive
// roots, local source links and two figure-1 qualifiers about third-party funds.
const hashes = {
  "fr-0": "7ea01305d4e63e8cd80135237c2fb4ab4ef2fec509af1ec9fc60294fb5625be1",
  "fr-1": "187ed7c020da675c528f0f95a1c9df2ab562ef10a2d3088fd68ab5a1e507f1e3",
  "fr-2": "0b1ca19bbefeec70dcec49e4cb6cfda350760665c44ccd61675ca1c5d87ff8fa",
  "fr-3": "17d65a2584266be826ac7cce1c676fcc44c307d4d193c8e8ebcc90f174fca880",
  "fr-4": "bc425621652eb702a2f7deb86ef00ce4697f9478700d8d887d53530577e33c43",
  "fr-5": "55afe1a462e83e4ff6656bb604150dd0cbc763439684b6d81c8c8abb933825d3",
  "fr-6": "7c7dc08df10b9423521582b56ee7086ce61c287595f6dce087f860e27f2f6538",
  "fr-7": "82f80f3299e106e1a0b20fbe79938b509e9e603b09ac3ce79a6b25afce932ac3",
  "fr-8": "27700aaab05c0c3cf960e72e27ce382f47ec93490e1bc38fedb45c4ba5cd1aec",
  "fr-9": "086c99d13faa86d80a7bf2892a61e06759122337102c9121a50c8366a9f260b1",
  "fr-10": "804e5b46a50eee225b708b142b5d9f483ed7ee17c73c93f64b41a1d601efa3f9",
  "fr-11": "9a063bd34e07b10c5869604002803f099d4e33bdbc8937bb8ea856bd58c42b49",
  "en-0": "cf7d66e5cc4ffb9241ee219924dc0cfab3828a6bb4f223144890bcbac5dcf693",
  "en-1": "9e039e8abc5ba3eaa7d5d80afe2ed06d421b8f7fb3a95656f25980e09031e25a",
  "en-2": "abba8d71372b3debae6626d602a69e20b6188cafbac5b2ca9fad989ad6584a38",
  "en-3": "24b83d3cee1abb85f8019133648ee3fe7352ff6a80ccba712febca1b18af04ca",
  "en-4": "b47a9577dd70096ec2cca0bfbadfd300f909483d3dd35837839bf2998942aede",
  "en-5": "c0b84cc5dc1699b1a355daabd9f1ddfb23c33312f9792921fbd63eb56238dc29",
  "en-6": "954b0f714a3c95c1b91c57f5c64a281516fc7c97ebbc49493b79aa5df981c3e6",
  "en-7": "72a82e5f814b304239b9d5cf0308755acab02696d3ec58ce3906210a7510e8e9",
  "en-8": "42731144daba781c709ec7eef89e5d26688be1051c2cdc29eacb0abec19e3f40",
  "en-9": "b9886009328325e1ebe097ff9ba6c0b59dff864091cac1ea0d680aa1d8db6cc8",
  "en-10": "c88d37078f3bb951e7d73e7e5c22d1f6b3556fb896a4fc8d6ba0f491c3ec1ceb",
  "en-11": "b160d824fd6d7b7bacfbfb47137deebd5fdc348444af7c22b7a558c6328d4dbd"
};
const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '', preserveOrder: true, trimValues: false, parseTagValue: false });
export const jpmTag = node => Object.keys(node).find(key => key !== ':@');
export const jpmAttrs = node => node[':@'] ?? {};
export const jpmNodes = node => [node, ...(node[jpmTag(node)] ?? []).filter(child => jpmTag(child) !== '#text').flatMap(jpmNodes)];
export const jpmText = node => (node[jpmTag(node)] ?? []).map(child => jpmTag(child) === '#text' ? child['#text'] : jpmText(child)).join('');
const number = (node, key) => Number(jpmAttrs(node)[key]);
const allowed = {
  svg: 'style xmlns viewBox role aria-labelledby', title: 'id', desc: 'id', defs: '',
  marker: 'id viewBox refX refY markerWidth markerHeight orient',
  pattern: 'id width height patternUnits',
  path: 'd fill stroke stroke-width stroke-dasharray marker-end',
  rect: 'x y width height rx fill stroke stroke-width stroke-dasharray',
  text: 'x y font-family font-size font-weight text-anchor fill',
  line: 'x1 y1 x2 y2 stroke stroke-width stroke-dasharray marker-end',
  circle: 'cx cy r fill stroke stroke-width', a: 'href',
};
const fonts = new Map([400, 700].map(weight => {
  const bytes = readFileSync(new URL(`../public/fonts/jpmorgan/dejavu-sans-${weight}.ttf`, import.meta.url));
  return [weight, opentype.parse(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength))];
}));
export const jpmSourceFigures = article => [...article.matchAll(/<svg\b[\s\S]*?<\/svg>/gu)].map(match => match[0]);

export function inspectJpmSvg(svg) {
  assert.equal(typeof svg, 'string');
  assert.ok(svg.length < 50000);
  assert.doesNotMatch(svg, /<!DOCTYPE|<!ENTITY|<!\[CDATA\[|<\?/iu);
  assert.doesNotMatch(svg, /\b(?:fontFamily|fontSize|fontWeight|textAnchor|strokeWidth|strokeDasharray|markerEnd)=/u, 'SVG presentation attributes use native names');
  assert.equal(XMLValidator.validate(svg), true);
  const roots = parser.parse(svg);
  assert.equal(roots.length, 1);
  const root = roots[0], nodes = jpmNodes(root), a = jpmAttrs(root);
  assert.equal(jpmTag(root), 'svg');
  assert.equal(a.style, 'width:100%;height:auto');
  assert.equal(a.role, 'img');
  assert.match(a.viewBox, /^0 0 (?:600|1200) [0-9]+(?:\.0)?$/u);
  const ids = nodes.map(node => jpmAttrs(node).id).filter(Boolean);
  assert.equal(ids.length, new Set(ids).size);
  for (const id of a['aria-labelledby'].split(' ')) assert.ok(nodes.some(node => jpmAttrs(node).id === id && ['title', 'desc'].includes(jpmTag(node)) && jpmText(node).trim()));
  for (const node of nodes) {
    assert.ok(Object.hasOwn(allowed, jpmTag(node)), `Forbidden SVG element: ${jpmTag(node)}`);
    for (const [key, value] of Object.entries(jpmAttrs(node))) {
      assert.ok(allowed[jpmTag(node)].split(' ').includes(key), `Forbidden SVG attribute: ${key}`);
      if (key === 'href') {
        const label = jpmText(node).trim().match(/^(S[0-9]{2}) · /u)?.[1];
        assert.ok(label && Number(label.slice(1)) >= 1 && Number(label.slice(1)) <= 20);
        assert.equal(value, `#source-${label}`);
      }
      if (['fill', 'stroke'].includes(key)) assert.match(value, /^(?:none|var\(--color-(?:surface|surface-2|paper|muted|line-strong|signal|amber)\)|url\(#[a-z0-9-]+\))$/u);
      if (String(value).includes('url(')) {
        const reference = String(value).match(/^url\(#([a-z0-9-]+)\)$/u);
        assert.ok(reference && ids.includes(reference[1]));
      }
    }
  }
  return { root, nodes };
}

export function assertJpmSourceFaithful(svg, lang, index) {
  inspectJpmSvg(svg);
  assert.equal(createHash('sha256').update(svg).digest('hex'), hashes[`${lang}-${index}`], 'Complete supplied composition, labels or semantic-theme mapping changed');
}

export function assertJpmGeometry(svg) {
  const { root, nodes } = inspectJpmSvg(svg), [,, width, height] = jpmAttrs(root).viewBox.split(' ').map(Number);
  const visible = node => jpmTag(node) === 'defs' ? [] : [node, ...(node[jpmTag(node)] ?? []).filter(child => jpmTag(child) !== '#text').flatMap(visible)];
  const point = (x, y) => assert.ok(Number.isFinite(x) && Number.isFinite(y) && x >= 0 && y >= 0 && x <= width && y <= height, `Shape outside viewBox: ${x},${y}`);
  for (const node of visible(root)) {
    const a = jpmAttrs(node), tag = jpmTag(node);
    if (tag === 'rect') {
      const x = Number(a.x ?? 0), y = Number(a.y ?? 0), w = a.width === '100%' ? width : Number(a.width), h = a.height === '100%' ? height : Number(a.height);
      assert.ok(w >= 0 && h >= 0); point(x, y); point(x + w, y + h);
    }
    if (tag === 'circle') { const x = number(node, 'cx'), y = number(node, 'cy'), r = number(node, 'r'); assert.ok(r >= 0); point(x - r, y - r); point(x + r, y + r); }
    if (tag === 'line') { point(number(node, 'x1'), number(node, 'y1')); point(number(node, 'x2'), number(node, 'y2')); }
    if (tag === 'path') {
      // All supplied visible paths use absolute straight segments. Consume the
      // entire bounded grammar rather than extracting numbers from unknown SVG.
      const token = /[MLHVZ]|-?(?:\d{1,4}(?:\.\d{1,18})?|\.\d{1,18})/uy, tokens = [];
      let offset = 0;
      while (offset < a.d.length) {
        if (/\s/u.test(a.d[offset])) { offset++; continue; }
        token.lastIndex = offset; const match = token.exec(a.d); assert.ok(match, 'Every path character is consumed');
        tokens.push(match[0]); offset = token.lastIndex;
      }
      assert.ok(tokens.length < 1024); assert.equal(tokens[0], 'M');
      let i = 0, x, y, origin;
      const value = () => { const n = Number(tokens[i++]); assert.ok(Number.isFinite(n)); return n; };
      while (i < tokens.length) {
        const command = tokens[i++];
        if (command === 'M' || command === 'L') { x = value(); y = value(); if (command === 'M') origin = [x, y]; }
        else if (command === 'H') x = value();
        else if (command === 'V') y = value();
        else { assert.equal(command, 'Z'); assert.ok(origin); [x, y] = origin; }
        point(x, y);
      }
    }
  }
  const panels = nodes.filter(node => jpmTag(node) === 'rect' && [8, 10, 12].includes(number(node, 'rx')));
  for (const node of nodes.filter(node => jpmTag(node) === 'text')) {
    const a = jpmAttrs(node), size = Number(a['font-size']), font = fonts.get(Number(a['font-weight'])), label = jpmText(node);
    assert.ok(font);
    for (const glyph of Array.from(label)) assert.ok(font.charToGlyphIndex(glyph) > 0, `Missing local glyph: ${glyph}`);
    const advance = font.getAdvanceWidth(label, size), x = number(node, 'x') - (a['text-anchor'] === 'middle' ? advance / 2 : a['text-anchor'] === 'end' ? advance : 0), y = number(node, 'y');
    const box = { x1: Infinity, y1: Infinity, x2: -Infinity, y2: -Infinity }, scale = size / font.unitsPerEm;
    font.forEachGlyph(label, x, y, size, {}, (glyph, gx, gy) => {
      if (!Number.isFinite(glyph.xMin) || glyph.xMin === glyph.xMax && glyph.yMin === glyph.yMax) return;
      box.x1 = Math.min(box.x1, gx + glyph.xMin * scale); box.x2 = Math.max(box.x2, gx + glyph.xMax * scale);
      box.y1 = Math.min(box.y1, gy - glyph.yMax * scale); box.y2 = Math.max(box.y2, gy - glyph.yMin * scale);
    });
    assert.ok(box.x1 >= 2 && box.y1 >= 2 && box.x2 <= width - 2 && box.y2 <= height - 2, `Text outside viewBox: ${label}`);
    const panel = panels.filter(panel => number(node, 'x') >= number(panel, 'x') && number(node, 'x') <= number(panel, 'x') + number(panel, 'width') && y >= number(panel, 'y') && y <= number(panel, 'y') + number(panel, 'height')).sort((a, b) => number(a, 'width') * number(a, 'height') - number(b, 'width') * number(b, 'height'))[0];
    if (panel) assert.ok(box.x1 >= number(panel, 'x') + 2 && box.y1 >= number(panel, 'y') + 2 && box.x2 <= number(panel, 'x') + number(panel, 'width') - 2 && box.y2 <= number(panel, 'y') + number(panel, 'height') - 2, `Text outside internal panel: ${label}`);
  }
  return true;
}

const near = (actual, expected) => assert.ok(Math.abs(Number(actual) - expected) <= .0006, `${actual} != ${expected}`);
export function assertJpmQuantitative(svg, figure) {
  const { root, nodes } = inspectJpmSvg(svg), mobile = jpmAttrs(root).viewBox.startsWith('0 0 600 '), english = jpmAttrs(root)['aria-labelledby'].includes('-en-');
  if (figure === 5) {
    // Explicit hypothetical annual model: revenues × 45% - fixed costs 20 - debt service 12.
    const chart = nodes.find(node => jpmTag(node) === 'path' && /^M84\.000 /u.test(jpmAttrs(node).d ?? ''));
    assert.ok(chart);
    const points = [...jpmAttrs(chart).d.matchAll(/[ML]([0-9.]+) ([0-9.]+)/gu)].map(match => match.slice(1).map(Number));
    assert.equal(points.length, 71);
    const x = revenue => 84 + (revenue - 40) / 70 * (mobile ? 464 : 1064);
    const top = mobile ? (english ? 380 : 426) : (english ? 284 : 238);
    const y = balance => top + (20 - balance) / 35 * (mobile ? 418 : 330);
    for (const [index, point] of points.entries()) { near(point[0], x(40 + index)); near(point[1], y((40 + index) * .45 - 32)); }
    for (const [revenue, radius] of [[60, 7], [100, 7], [32 / .45, 5]]) {
      const circle = nodes.find(node => jpmTag(node) === 'circle' && number(node, 'r') === radius && Math.abs(number(node, 'cx') - x(revenue)) < .001);
      assert.ok(circle); near(number(circle, 'cy'), y(.45 * revenue - 32));
    }
    const labels = nodes.filter(node => jpmTag(node) === 'text').map(jpmText);
    for (const label of ['−5', '+13']) assert.ok(labels.includes(label));
    assert.ok(labels.some(label => /71[,.]1/u.test(label)));
    assert.ok(labels.some(label => /FICTIF|HYPOTHETICAL/u.test(label)), 'Hypothetical values remain identified');
  }
  if (figure === 6) {
    const circles = nodes.filter(node => jpmTag(node) === 'circle'), rows = [...new Set(circles.map(node => number(node, 'cy')))];
    assert.equal(rows.length, 3);
    const expected = [5, 12, 3];
    for (const [index, row] of rows.entries()) {
      const group = circles.filter(node => number(node, 'cy') === row);
      assert.equal(group.length, 15);
      assert.equal(group.filter(node => jpmAttrs(node).fill === 'var(--color-signal)').length, expected[index]);
    }
    const labels = nodes.filter(node => jpmTag(node) === 'text').map(jpmText);
    for (const count of expected) assert.ok(labels.includes(`${count}/15`));
    assert.ok(labels.some(label => /généralisable|generalizable/u.test(label)), 'GAO sample limit remains visible');
  }
}

const projection = node => {
  if (node.nodeName === '#comment') return null;
  if (node.nodeName === '#text') return node.value.trim() ? { text: node.value } : null;
  return { tag: node.tagName ?? node.nodeName, attrs: Object.fromEntries((node.attrs ?? []).map(a => [a.name, a.value]).sort(([a], [b]) => a.localeCompare(b))), children: (node.childNodes ?? []).map(projection).filter(Boolean) };
};
export function assertJpmRenderedFaithful(svg, source, lang, index) {
  assertJpmSourceFaithful(source, lang, index);
  assertJpmGeometry(svg);
  assertJpmQuantitative(svg, Math.floor(index / 2) + 1);
  assert.deepEqual(projection(parseFragment(svg)), projection(parseFragment(source)), 'Astro preserves all native SVG attributes, text and element ordering');
}
