import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { XMLParser, XMLValidator } from 'fast-xml-parser';
import { parseFragment } from 'parse5';
import opentype from '@shuding/opentype.js';

// Original desktop relationships and all quantitative scales are retained.
// Native attributes, semantic themes, exact DejaVu metrics and legible reflow
// adapt the supplied scenes; separate compact mobile compositions preserve
// the same mechanisms, values, periods, sources and methodological limits.
const hashes = {
  "fr-0": "cb38b3b3ff99d56a280db6a1a45914fb8d4bb0be13d148f70ac5107a6519e896",
  "fr-1": "86a221c742dc49e2899c4014bedafc31e6ea41b7cee4d9db937f78f7cd9671d2",
  "fr-2": "23b0616799da3a1b645835009b83abc3e93f5b0d29102947fd39cc04f117b69f",
  "fr-3": "17aefd6a995e5c7d631948d68d95baab70f8209f49f080fa0ea398eca2d946a4",
  "fr-4": "fa4cf1afdd083a07d6759565baff8b9c2bf15535182acfd2c9d951074b68dfdf",
  "fr-5": "5a0805e9fcf79a1b637a0cd1335f42a4e03f63b510272f7f17d0bf46e5cfe339",
  "fr-6": "e998c80d1cdd91a84b839588b56eb1bbddf0570d73540b69a0e0a30b9af4cc82",
  "fr-7": "83d140181e5cae2a25cdb42a50dbbff78cd3a284ad0c85d17934a3e5a5489921",
  "fr-8": "cb6ad136739bb13a53468ff79525e8cc867060fb71608cb988bc9bdb465d37f1",
  "fr-9": "abe1b7c5dc66783799bdee8eed274f61b5c7ec1ca95a2c47c4ce5254d3caf8fb",
  "fr-10": "a49d307f76eca67a6da076171d72d6fb41639c1b990887cf18e317183909450c",
  "fr-11": "7aed22567d044437c4258ae6b9e9e8963a07212686b6bc1ae6cacfbcfe473d59",
  "en-0": "9a809d4e6f023cf25db532d0ee07d649c1d30f000e16c9e4af14d98cc2a093f1",
  "en-1": "29cda131018934c149c7c3ff7e11181e9d5e5a71cd0d1d538e330f79f0d41091",
  "en-2": "69bd757fa869b19bfa758a78690b6b17cefab96c830e3fefa376cb04057a2785",
  "en-3": "9bfcf939674d3aac0ad6a562e8f895de5434c950e9799cfeb6b187e0eba92ae0",
  "en-4": "e60d0132c8374385990db58346e31b140366b788763cdfef556efda71a72204e",
  "en-5": "d3ddea36580b9ba7b02ab2c4a0dd17562a85e5906d10e5e0ce0409959dd8aae8",
  "en-6": "d5141f8021fa18875d3e6ce951762d27f9281dd339fcbdc7edd06ccfb6396145",
  "en-7": "c5a28e7f9e2fab333a4ebbe0efdf2d296d7c33a9d84a26cf418fa79552c39505",
  "en-8": "20f337030b108576d835aef627cfba1603fb616c7cf7b1172c37adc260b0c2c2",
  "en-9": "e120bfaf78054922f43e5c447c159bb6fbdf199716cf4a6bde269f927d84c65f",
  "en-10": "99606f1a949906807cafa2d485a1c13087f4d9ca80905ddbed49522397e18afe",
  "en-11": "85add2b5a604163e7790bacd1903eb917cf240430c0e763cc47c310780870b3b"
};
const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '', preserveOrder: true, trimValues: false, parseTagValue: false });
export const worldTag = node => Object.keys(node).find(key => key !== ':@');
export const worldAttrs = node => node[':@'] ?? {};
export const worldNodes = node => [node, ...(node[worldTag(node)] ?? []).filter(child => worldTag(child) !== '#text').flatMap(worldNodes)];
export const worldText = node => (node[worldTag(node)] ?? []).map(child => worldTag(child) === '#text' ? child['#text'] : worldText(child)).join('');
const number = (node, key) => Number(worldAttrs(node)[key]);
const allowed = {
  svg: 'style xmlns viewBox role aria-labelledby', title: 'id', desc: 'id', defs: '',
  marker: 'id viewBox refX refY markerWidth markerHeight orient',
  pattern: 'id width height patternUnits',
  path: 'id d fill stroke stroke-width stroke-dasharray marker-end',
  rect: 'id x y width height rx fill stroke stroke-width stroke-dasharray',
  text: 'data-panel x y font-family font-size font-weight text-anchor fill',
  line: 'x1 y1 x2 y2 stroke stroke-width stroke-dasharray marker-end',
  circle: 'cx cy r fill stroke stroke-width', a: 'href',
};
const fonts = new Map([400, 700].map(weight => {
  const bytes = readFileSync(new URL(`../public/fonts/world-id/dejavu-sans-${weight}.ttf`, import.meta.url));
  return [weight, opentype.parse(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength))];
}));
export const worldSourceFigures = article => [...article.matchAll(/<svg\b[\s\S]*?<\/svg>/gu)].map(match => match[0]);

export function inspectWorldSvg(svg) {
  assert.equal(typeof svg, 'string');
  assert.ok(svg.length < 50000);
  assert.doesNotMatch(svg, /<!DOCTYPE|<!ENTITY|<!\[CDATA\[|<\?/iu);
  assert.doesNotMatch(svg, /\b(?:fontFamily|fontSize|fontWeight|textAnchor|strokeWidth|strokeDasharray|markerEnd)=/u, 'SVG presentation attributes use native names');
  assert.equal(XMLValidator.validate(svg), true);
  const roots = parser.parse(svg);
  assert.equal(roots.length, 1);
  const root = roots[0], nodes = worldNodes(root), a = worldAttrs(root);
  assert.equal(worldTag(root), 'svg');
  assert.equal(a.style, 'width:100%;height:auto');
  assert.equal(a.role, 'img');
  assert.match(a.viewBox, /^0 0 (?:480|1200) [0-9]+$/u);
  const ids = nodes.map(node => worldAttrs(node).id).filter(Boolean);
  assert.equal(ids.length, new Set(ids).size);
  for (const id of a['aria-labelledby'].split(' ')) assert.ok(nodes.some(node => worldAttrs(node).id === id && ['title', 'desc'].includes(worldTag(node)) && worldText(node).trim()));
  for (const node of nodes) {
    assert.ok(Object.hasOwn(allowed, worldTag(node)), `Forbidden SVG element: ${worldTag(node)}`);
    for (const [key, value] of Object.entries(worldAttrs(node))) {
      assert.ok(allowed[worldTag(node)].split(' ').includes(key), `Forbidden SVG attribute: ${key}`);
      if (key === 'href') {
        const label = worldText(node).trim().match(/^(S[0-9]{2})$/u)?.[1];
        assert.ok(label && Number(label.slice(1)) >= 1 && Number(label.slice(1)) <= 22);
        assert.equal(value, `#source-${label}`);
      }
      if (['fill', 'stroke'].includes(key)) assert.match(value, /^(?:none|var\(--color-(?:ink|surface|surface-2|paper|muted|line-strong|signal|amber)\)|url\(#[a-z0-9-]+\))$/u);
      if (String(value).includes('url(')) {
        const reference = String(value).match(/^url\(#([a-z0-9-]+)\)$/u);
        assert.ok(reference && ids.includes(reference[1]));
      }
    }
  }
  return { root, nodes };
}

export function assertWorldSourceFaithful(svg, lang, index) {
  inspectWorldSvg(svg);
  assert.equal(createHash('sha256').update(svg).digest('hex'), hashes[`${lang}-${index}`], 'Verified compact composition, labels or semantic-theme mapping changed');
}

export function assertWorldMobileActionConnections(svg) {
  const { root, nodes } = inspectWorldSvg(svg), language = worldAttrs(root)['aria-labelledby'].match(/^world-4-(fr|en)-m-title\b/u)?.[1];
  assert.ok(language, 'Mobile action workflow');
  const connections = nodes.filter(n => ['line', 'path'].includes(worldTag(n)) && worldAttrs(n)['marker-end']);
  assert.equal(connections.length, 4, 'Human attachment and all three action transitions remain visible');
  for (const n of connections) {
    assert.equal(worldAttrs(n).stroke, 'var(--color-signal)', 'Connections have a visible semantic stroke');
    assert.ok(number(n, 'stroke-width') >= 2);
  }
  const panels = Array.from({ length: 6 }, (_, i) => nodes.find(n => worldAttrs(n).id === `world-4-${language}-m-panel-${i}`));
  assert.ok(panels.every(Boolean));
  const attachment = connections.find(n => worldTag(n) === 'line');
  assert.ok(attachment);
  assert.ok(number(attachment, 'x1') >= number(panels[0], 'x') + number(panels[0], 'width') + 8 && number(attachment, 'x2') <= number(panels[1], 'x') - 8 && number(attachment, 'x2') > number(attachment, 'x1'));
  const lastBackground = Math.max(...panels.map(p => nodes.indexOf(p)));
  for (let i = 0; i < 3; i++) {
    const rail = connections.find(n => worldAttrs(n).id === `world-4-${language}-m-step-${i + 1}`);
    assert.ok(rail, 'Each successive action has its own drawn connection');
    assert.ok(nodes.indexOf(rail) > lastBackground, 'Side rails are painted after the card backgrounds');
    const match = worldAttrs(rail).d.match(/^M ([0-9.]+) ([0-9.]+) H ([0-9.]+) V ([0-9.]+) H ([0-9.]+)$/u);
    assert.ok(match, 'Side rail has an explicit descending route');
    const [startX, startY, railX, endY, endX] = match.slice(1).map(Number), from = panels[i + 2], to = panels[i + 3];
    const left = Math.min(number(from, 'x'), number(to, 'x'));
    assert.ok(railX >= 10 && railX < startX && railX < endX && startX <= left - 2 && endX <= left - 4, 'Rails and arrowheads remain in the clear left margin');
    assert.ok(startY > number(from, 'y') + 8 && startY < number(from, 'y') + number(from, 'height') - 8 && endY > number(to, 'y') + 8 && endY < number(to, 'y') + number(to, 'height') - 8 && endY > startY, 'Connections lead from each card to the following card');
  }
  return true;
}

export function assertWorldGeometry(svg) {
  const { root, nodes } = inspectWorldSvg(svg), [,, width, height] = worldAttrs(root).viewBox.split(' ').map(Number);
  if (/^world-4-(?:fr|en)-m-title\b/u.test(worldAttrs(root)['aria-labelledby'])) assertWorldMobileActionConnections(svg);
  const labelBoxes = [];
  const visible = node => worldTag(node) === 'defs' ? [] : [node, ...(node[worldTag(node)] ?? []).filter(child => worldTag(child) !== '#text').flatMap(visible)];
  const point = (x, y) => assert.ok(Number.isFinite(x) && Number.isFinite(y) && x >= 0 && y >= 0 && x <= width && y <= height, `Shape outside viewBox: ${x},${y}`);
  for (const node of visible(root)) {
    const a = worldAttrs(node), tag = worldTag(node);
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
  const panels = nodes.filter(node => worldTag(node) === 'rect' && [6, 8, 10, 12].includes(number(node, 'rx')));
  for (let i = 0; i < panels.length; i++) for (const b of panels.slice(i + 1)) {
    const a = panels[i], overlapX = Math.min(number(a, 'x') + number(a, 'width'), number(b, 'x') + number(b, 'width')) - Math.max(number(a, 'x'), number(b, 'x'));
    const overlapY = Math.min(number(a, 'y') + number(a, 'height'), number(b, 'y') + number(b, 'height')) - Math.max(number(a, 'y'), number(b, 'y'));
    if (overlapX > 0) assert.ok(overlapY <= -4, 'Adjacent authored panels retain a visible gutter');
    if (overlapY > 0) assert.ok(overlapX <= -4, 'Adjacent authored panels retain a visible gutter');
  }
  for (const node of nodes.filter(node => worldTag(node) === 'text')) {
    const a = worldAttrs(node), size = Number(a['font-size']), font = fonts.get(Number(a['font-weight'])), label = worldText(node);
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
    labelBoxes.push({ ...box, label });
    const panel = a['data-panel'] ? panels.find(panel => worldAttrs(panel).id === a['data-panel']) : panels.filter(panel => number(node, 'x') >= number(panel, 'x') && number(node, 'x') <= number(panel, 'x') + number(panel, 'width') && y >= number(panel, 'y') && y <= number(panel, 'y') + number(panel, 'height')).sort((a, b) => number(a, 'width') * number(a, 'height') - number(b, 'width') * number(b, 'height'))[0];
    if (a['data-panel']) assert.ok(panel, 'Authored containing panel exists');
    if (panel) assert.ok(box.x1 >= number(panel, 'x') + 2 && box.y1 >= number(panel, 'y') + 2 && box.x2 <= number(panel, 'x') + number(panel, 'width') - 2 && box.y2 <= number(panel, 'y') + number(panel, 'height') - 10, `Text outside internal panel: ${label}`);
    // Glyph outlines exclude unused ascent/descent. Chromium's getBBox()
    // includes those font extents and varies slightly with the screen scale.
    // Keep a conservative full em above the baseline and 0.3 em below it;
    // rendered browser QA separately checks every authored panel at all widths.
    if (panel) assert.ok(x >= number(panel, 'x') + 1 && y - size >= number(panel, 'y') + 1 && x + advance <= number(panel, 'x') + number(panel, 'width') - 1 && y + size * .3 <= number(panel, 'y') + number(panel, 'height') - 1, `Typographic extents outside internal panel: ${label}`);
  }
  for (let i = 0; i < labelBoxes.length; i++) for (let j = i + 1; j < labelBoxes.length; j++) {
    const a = labelBoxes[i], b = labelBoxes[j];
    assert.ok(!(Math.min(a.x2, b.x2) - Math.max(a.x1, b.x1) > 1 && Math.min(a.y2, b.y2) - Math.max(a.y1, b.y1) > 1), `Overlapping labels: ${a.label} / ${b.label}`);
  }
  return true;
}

export function assertWorldProportions(svg) {
  const { root, nodes } = inspectWorldSvg(svg), [,, width, height] = worldAttrs(root).viewBox.split(' ').map(Number), mobile = width === 480;
  assert.ok(height / width <= (mobile ? 1.55 : .8), 'Artwork retains compact in-page proportions');
  const minimum = Math.min(...nodes.filter(node => worldTag(node) === 'text').map(node => number(node, 'font-size')));
  assert.ok(minimum >= (mobile ? 22 : 28), 'Compactness must preserve legible typography');
}

const near = (actual, expected) => assert.ok(Math.abs(Number(actual) - expected) <= .001, `${actual} != ${expected}`);
export function assertWorldQuantitative(svg, figure) {
  const { root, nodes } = inspectWorldSvg(svg), mobile = worldAttrs(root).viewBox.startsWith('0 0 480 ');
  const rects = nodes.filter(node => worldTag(node) === 'rect' && worldAttrs(node).fill === 'var(--color-signal)');
  if (figure === 2) {
    const bars = rects.filter(node => number(node, 'height') === (mobile ? 26 : 40));
    assert.equal(bars.length, 4);
    for (const [index, days] of [1, 7, 15, 30].entries()) near(number(bars[index], 'width'), (mobile ? 360 : 780) * days / 30);
    const labels = nodes.filter(node => worldTag(node) === 'text').map(worldText).join(' ');
    assert.match(labels, /défaut|default/u);
    assert.match(labels, /jours|days/u);
  }
  if (figure === 6) {
    const bars = rects.filter(node => number(node, 'height') === (mobile ? 30 : 54));
    assert.equal(bars.length, 3);
    for (const [index, share] of [.001, .005, .01].entries()) near(number(bars[index], 'width'), (mobile ? 280 : 800) * (1000000 * share * 8 / 60) / 1500);
    const labels = nodes.filter(node => worldTag(node) === 'text').map(worldText).join(' ');
    assert.match(labels, /FICTIF|HYPOTHETICAL/u);
    assert.match(labels, /800/u);
    assert.match(labels, /0[,.]6/u);
    assert.match(labels, /4[ ,]000/u);
  }
}

const projection = node => {
  if (node.nodeName === '#comment') return null;
  if (node.nodeName === '#text') return node.value.trim() ? { text: node.value } : null;
  return { tag: node.tagName ?? node.nodeName, attrs: Object.fromEntries((node.attrs ?? []).map(a => [a.name, a.value]).sort(([a], [b]) => a.localeCompare(b))), children: (node.childNodes ?? []).map(projection).filter(Boolean) };
};
export function assertWorldRenderedFaithful(svg, source, lang, index) {
  assertWorldSourceFaithful(source, lang, index);
  assertWorldGeometry(svg);
  assertWorldQuantitative(svg, Math.floor(index / 2) + 1);
  assert.deepEqual(projection(parseFragment(svg)), projection(parseFragment(source)), 'Astro preserves all native SVG attributes, text and element ordering');
}
