import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { XMLParser, XMLValidator } from 'fast-xml-parser';
import { parseFragment } from 'parse5';
import opentype from '@shuding/opentype.js';

// Original desktop relationships and all quantitative scales are retained.
// Native attributes, semantic themes, exact Arial-compatible Liberation metrics and legible reflow
// adapt the supplied scenes; separate compact mobile compositions preserve
// the same mechanisms, values, periods, sources and methodological limits.
const hashes = {
  "fr-0": "3ba0a4dbad5db728b8e9c93eab3e0d1b0f14e755bbcb3b467db8528956716a55",
  "fr-1": "16abe48e21ef3680854dbc3983248ac0c3a769d39e90feabefb0a541897884d0",
  "fr-2": "f479816d3cb4ae47563ebbaefc07a7ed1fcc556a01782c818888c7b89c65ebad",
  "fr-3": "685093334b4a9bf87e47e4493bdc59bd5b60bb6ce8f9342d82b1cf22c06fdb35",
  "fr-4": "be6837bb11d4ce7b128856bbbf1977029357431380f5820528cab1db22a8b93a",
  "fr-5": "e8c22498c3c18118fbb2defceea069df888478e026a46c8bd0ac7dbb9c4d9f79",
  "fr-6": "e89c850585f490f66b2d8d501f5855b79b148cb152a71ed2048e3200fa502abc",
  "fr-7": "aace1364e21711546cb0471875c44bddc4c9963a76312df3f2b3117897ded93f",
  "fr-8": "002d95556e2e278f9c0e66f2559a628c334060dde0fbee96dd5e2706d6469313",
  "fr-9": "639278ef047fc18a9a439d70f835f7f89e1cbd24a57d4a0af9e26d8e4f8a189b",
  "fr-10": "b4da474a3ab806f5978bb72b15302964ae5201500ef322994d2f279e5b04e648",
  "fr-11": "cbe0f27dbfd746d5a42eecfa9b4d256919141b11a7d00051e5d3313f98fc79ce",
  "en-0": "6c10a870492a25a1530d390f564468a25267b38c3d65a8096a8b5a81859c5fdc",
  "en-1": "71f38625e5d3afbcab4c4b4719638f705c29f25bad01a26d77df75397b0d26bc",
  "en-2": "0ad263b06df53f0a0e3ffbe5e1d7a0682d44a54401b125180de2bdd3433541d8",
  "en-3": "d1181b0ea61d4471e80a345c51578706486ffd786504f419ed0564b9f389fb91",
  "en-4": "fc41c9c9c5aeae3187fde213592bef7c7846d2eb92de5931e57fe6af15c30dd0",
  "en-5": "fd41ac3de42fd9071b0224a0aab695ebeb930c07c35bf2c4fb9172ef49f8433b",
  "en-6": "a572cb77d4e36c94679abb6382cd6e750908bb8156d08d4fbcc42597974e8926",
  "en-7": "06fece3ae361ddd6b9f0529cf3d78d79764e52a6fb62845851933eacaefc48eb",
  "en-8": "3bad933ea02b70d183e4fe19c8fb35771b143411607377ccb077cd28e9fc9a3f",
  "en-9": "766d8de221388d2446c8588cdbc629dfcadd7c948ace974c729c1407ad7a20eb",
  "en-10": "12272c529df31cd73553140883e79344583b9b38c97d64de3478c0fd30475853",
  "en-11": "da9e109abbd12cb5f9c321e78dfece6b5941934577e817c0bf1abd627a53b496"
};
const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '', preserveOrder: true, trimValues: false, parseTagValue: false });
export const predictstreetTag = node => Object.keys(node).find(key => key !== ':@');
export const predictstreetAttrs = node => node[':@'] ?? {};
export const predictstreetNodes = node => [node, ...(node[predictstreetTag(node)] ?? []).filter(child => predictstreetTag(child) !== '#text').flatMap(predictstreetNodes)];
export const predictstreetText = node => (node[predictstreetTag(node)] ?? []).map(child => predictstreetTag(child) === '#text' ? child['#text'] : predictstreetText(child)).join('');
const number = (node, key) => { const a = predictstreetAttrs(node); return predictstreetTag(node) === 'circle' && ['x', 'y', 'width', 'height'].includes(key) ? key === 'x' ? Number(a.cx) - Number(a.r) : key === 'y' ? Number(a.cy) - Number(a.r) : 2 * Number(a.r) : Number(a[key]); };
const allowed = {
  svg: 'style xmlns viewBox role aria-labelledby', title: 'id', desc: 'id', defs: '',
  marker: 'id viewBox refX refY markerWidth markerHeight orient',
  pattern: 'id width height patternUnits',
  path: 'id d fill stroke stroke-width stroke-dasharray marker-end',
  rect: 'id x y width height rx fill stroke stroke-width stroke-dasharray',
  text: 'data-panel x y font-family font-size font-weight text-anchor fill',
  line: 'id x1 y1 x2 y2 stroke stroke-width stroke-dasharray marker-end',
  circle: 'id cx cy r fill stroke stroke-width', a: 'href',
};
const fonts = new Map([400, 700].map(weight => {
  const bytes = readFileSync(new URL(`../public/fonts/predictstreet/liberation-sans-${weight}.ttf`, import.meta.url));
  return [weight, opentype.parse(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength))];
}));
export const predictstreetSourceFigures = article => [...article.matchAll(/<svg\b[\s\S]*?<\/svg>/gu)].map(match => match[0]);

export function inspectPredictstreetSvg(svg) {
  assert.equal(typeof svg, 'string');
  assert.ok(svg.length < 50000);
  assert.doesNotMatch(svg, /<!DOCTYPE|<!ENTITY|<!\[CDATA\[|<\?/iu);
  assert.doesNotMatch(svg, /\b(?:fontFamily|fontSize|fontWeight|textAnchor|strokeWidth|strokeDasharray|markerEnd)=/u, 'SVG presentation attributes use native names');
  assert.equal(XMLValidator.validate(svg), true);
  const roots = parser.parse(svg);
  assert.equal(roots.length, 1);
  const root = roots[0], nodes = predictstreetNodes(root), a = predictstreetAttrs(root);
  assert.equal(predictstreetTag(root), 'svg');
  assert.equal(a.xmlns, 'http://www.w3.org/2000/svg');
  assert.equal(a.style, 'width:100%;height:auto');
  assert.equal(a.role, 'img');
  assert.match(a.viewBox, /^0 0 (?:480|1000) [0-9]+$/u);
  const ids = nodes.map(node => predictstreetAttrs(node).id).filter(Boolean);
  assert.equal(ids.length, new Set(ids).size);
  for (const id of a['aria-labelledby'].split(' ')) assert.ok(nodes.some(node => predictstreetAttrs(node).id === id && ['title', 'desc'].includes(predictstreetTag(node)) && predictstreetText(node).trim()));
  for (const node of nodes) {
    assert.ok(Object.hasOwn(allowed, predictstreetTag(node)), `Forbidden SVG element: ${predictstreetTag(node)}`);
    for (const [key, value] of Object.entries(predictstreetAttrs(node))) {
      assert.ok(allowed[predictstreetTag(node)].split(' ').includes(key), `Forbidden SVG attribute: ${key}`);
      if (key === 'href') {
        const label = predictstreetText(node).trim().match(/^(S[0-9]{2})$/u)?.[1];
        assert.ok(label && Number(label.slice(1)) >= 1 && Number(label.slice(1)) <= 14);
        assert.equal(value, `#source-${label}`);
      }
      if (['fill', 'stroke'].includes(key)) assert.match(value, /^(?:none|var\(--color-(?:ink|surface|surface-2|paper|muted|line-strong|signal|amber|accent)\)|url\(#[a-z0-9-]+\))$/u);
      if (String(value).includes('url(')) {
        const reference = String(value).match(/^url\(#([a-z0-9-]+)\)$/u);
        assert.ok(reference && ids.includes(reference[1]));
      }
    }
  }
  return { root, nodes };
}

export function assertPredictstreetSourceFaithful(svg, lang, index) {
  inspectPredictstreetSvg(svg);
  assert.equal(createHash('sha256').update(svg).digest('hex'), hashes[`${lang}-${index}`], 'Verified compact composition, labels or semantic-theme mapping changed');
}

function pathPoints(d) {
  const token = /[MLHVZ]|-?(?:\d{1,4}(?:\.\d{1,18})?|\.\d{1,18})/uy, tokens = [], points = [];
  let offset = 0;
  while (offset < d.length) {
    if (/\s/u.test(d[offset])) { offset++; continue; }
    token.lastIndex = offset; const match = token.exec(d); assert.ok(match, 'Every path character is consumed');
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
    points.push([x, y]);
  }
  return points;
}

export function assertPredictstreetConnections(svg, figure) {
  const { nodes } = inspectPredictstreetSvg(svg);
  const arrows = nodes.filter(n => ['line', 'path'].includes(predictstreetTag(n)) && predictstreetAttrs(n)['marker-end']);
  assert.equal(arrows.length, [0, 3, 5, 0, 2, 3][figure - 1], 'Every exchange, cycle, fee and evidence transition remains drawn');
  for (const arrow of arrows) {
    assert.equal(predictstreetAttrs(arrow).stroke, 'var(--color-signal)');
    assert.ok(number(arrow, 'stroke-width') >= 2, 'Visible connection stroke');
    const points = predictstreetTag(arrow) === 'line' ? [[number(arrow, 'x1'), number(arrow, 'y1')], [number(arrow, 'x2'), number(arrow, 'y2')]] : pathPoints(predictstreetAttrs(arrow).d);
    const samples = points.slice(1).flatMap((b, i) => Array.from({ length: 21 }, (_, k) => [points[i][0] + (b[0] - points[i][0]) * k / 20, points[i][1] + (b[1] - points[i][1]) * k / 20]));
    assert.ok(samples.length && samples.some(([x, y]) => Math.hypot(x - points[0][0], y - points[0][1]) > 4), 'Connection has a nonzero visible route');
    for (const shape of nodes.slice(nodes.indexOf(arrow) + 1).filter(n => ['rect', 'circle'].includes(predictstreetTag(n)) && predictstreetAttrs(n).fill !== 'none')) {
      const covered = ([x, y]) => predictstreetTag(shape) === 'circle' ? Math.hypot(x - number(shape, 'cx'), y - number(shape, 'cy')) < number(shape, 'r') - .5 : x > number(shape, 'x') + .5 && x < number(shape, 'x') + number(shape, 'width') - .5 && y > number(shape, 'y') + .5 && y < number(shape, 'y') + number(shape, 'height') - .5;
      assert.ok(!samples.some(covered), 'A later background cannot cover a connection');
    }
  }
  return true;
}

export function assertPredictstreetGeometry(svg) {
  const { root, nodes } = inspectPredictstreetSvg(svg), [,, width, height] = predictstreetAttrs(root).viewBox.split(' ').map(Number);
  const labelBoxes = [];
  const visible = node => predictstreetTag(node) === 'defs' ? [] : [node, ...(node[predictstreetTag(node)] ?? []).filter(child => predictstreetTag(child) !== '#text').flatMap(visible)];
  const point = (x, y) => assert.ok(Number.isFinite(x) && Number.isFinite(y) && x >= 0 && y >= 0 && x <= width && y <= height, `Shape outside viewBox: ${x},${y}`);
  for (const node of visible(root)) {
    const a = predictstreetAttrs(node), tag = predictstreetTag(node);
    if (tag === 'rect') {
      const x = Number(a.x ?? 0), y = Number(a.y ?? 0), w = a.width === '100%' ? width : Number(a.width), h = a.height === '100%' ? height : Number(a.height);
      assert.ok(w >= 0 && h >= 0); point(x, y); point(x + w, y + h);
    }
    if (tag === 'circle') { const x = number(node, 'cx'), y = number(node, 'cy'), r = number(node, 'r'); assert.ok(r >= 0); point(x - r, y - r); point(x + r, y + r); }
    if (tag === 'line') { point(number(node, 'x1'), number(node, 'y1')); point(number(node, 'x2'), number(node, 'y2')); }
    if (tag === 'path') {
      // All supplied visible paths use absolute straight segments. Consume the
      // entire bounded grammar rather than extracting numbers from unknown SVG.
      for (const [x, y] of pathPoints(a.d)) point(x, y);
    }
  }
  const panels = nodes.filter(node => predictstreetTag(node) === 'circle' || predictstreetTag(node) === 'rect' && [6, 8, 10, 12].includes(number(node, 'rx')));
  const contains = (a, b) => number(a, 'x') <= number(b, 'x') && number(a, 'y') <= number(b, 'y') && number(a, 'x') + number(a, 'width') >= number(b, 'x') + number(b, 'width') && number(a, 'y') + number(a, 'height') >= number(b, 'y') + number(b, 'height');
  const footer = nodes.filter(n => predictstreetTag(n) === 'line' && number(n, 'x1') === 24 && number(n, 'x2') === width - 24 && number(n, 'y1') === number(n, 'y2')).sort((a, b) => number(b, 'y1') - number(a, 'y1'))[0];
  if (footer) for (const p of panels) assert.ok(number(p, 'y') + number(p, 'height') <= number(footer, 'y1') - 8, 'Panel retains space above the source footer');
  for (let i = 0; i < panels.length; i++) for (const b of panels.slice(i + 1)) {
    const a = panels[i]; if (contains(a, b) || contains(b, a)) continue; const overlapX = Math.min(number(a, 'x') + number(a, 'width'), number(b, 'x') + number(b, 'width')) - Math.max(number(a, 'x'), number(b, 'x'));
    const overlapY = Math.min(number(a, 'y') + number(a, 'height'), number(b, 'y') + number(b, 'height')) - Math.max(number(a, 'y'), number(b, 'y'));
    if (overlapX > 0) assert.ok(overlapY <= -4, 'Adjacent authored panels retain a visible gutter');
    if (overlapY > 0) assert.ok(overlapX <= -4, 'Adjacent authored panels retain a visible gutter');
  }
  for (const node of nodes.filter(node => predictstreetTag(node) === 'text')) {
    const a = predictstreetAttrs(node), size = Number(a['font-size']), font = fonts.get(Number(a['font-weight'])), label = predictstreetText(node);
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
    labelBoxes.push({ ...box, label, panel: a['data-panel'] });
    const panel = a['data-panel'] ? panels.find(panel => predictstreetAttrs(panel).id === a['data-panel']) : panels.filter(panel => number(node, 'x') >= number(panel, 'x') && number(node, 'x') <= number(panel, 'x') + number(panel, 'width') && y >= number(panel, 'y') && y <= number(panel, 'y') + number(panel, 'height')).sort((a, b) => number(a, 'width') * number(a, 'height') - number(b, 'width') * number(b, 'height'))[0];
    if (a['data-panel']) assert.ok(panel, 'Authored containing panel exists');
    if (panel) assert.ok(box.x1 >= number(panel, 'x') + 2 && box.y1 >= number(panel, 'y') + 2 && box.x2 <= number(panel, 'x') + number(panel, 'width') - 2 && box.y2 <= number(panel, 'y') + number(panel, 'height') - 10, `Text outside internal panel: ${label}`);
    // Glyph outlines exclude unused ascent/descent. Chromium's getBBox()
    // includes those font extents and varies slightly with the screen scale.
    // Keep a conservative full em above the baseline and 0.3 em below it;
    // rendered browser QA separately checks every authored panel at all widths.
    if (panel) assert.ok(x >= number(panel, 'x') + 1 && y - size >= number(panel, 'y') + 1 && x + advance <= number(panel, 'x') + number(panel, 'width') - 1 && y + size * .3 <= number(panel, 'y') + number(panel, 'height') - 1, `Typographic extents outside internal panel: ${label}`);
  }
  for (const b of labelBoxes) for (const circle of nodes.filter(n => predictstreetTag(n) === 'circle')) {
    const a = predictstreetAttrs(circle); if (b.panel === a.id) continue;
    const dx = number(circle, 'cx') - Math.max(b.x1, Math.min(number(circle, 'cx'), b.x2));
    const dy = number(circle, 'cy') - Math.max(b.y1, Math.min(number(circle, 'cy'), b.y2));
    assert.ok(Math.hypot(dx, dy) >= number(circle, 'r') + 1, `Text overlaps an unrelated node or badge: ${b.label}`);
  }
  for (let i = 0; i < labelBoxes.length; i++) for (let j = i + 1; j < labelBoxes.length; j++) {
    const a = labelBoxes[i], b = labelBoxes[j];
    assert.ok(!(Math.min(a.x2, b.x2) - Math.max(a.x1, b.x1) > 1 && Math.min(a.y2, b.y2) - Math.max(a.y1, b.y1) > 1), `Overlapping labels: ${a.label} / ${b.label}`);
  }
  return true;
}

export function assertPredictstreetProportions(svg) {
  const { root, nodes } = inspectPredictstreetSvg(svg), [,, width, height] = predictstreetAttrs(root).viewBox.split(' ').map(Number), mobile = width === 480;
  assert.ok(height / width <= (mobile ? 1.56 : .8), 'Artwork retains compact in-page proportions');
  const minimum = Math.min(...nodes.filter(node => predictstreetTag(node) === 'text').map(node => number(node, 'font-size')));
  assert.ok(minimum >= (mobile ? 22 : 24), 'Compactness must preserve legible typography');
}

const near = (actual, expected) => assert.ok(Math.abs(Number(actual) - expected) <= .001, `${actual} != ${expected}`);
export function assertPredictstreetQuantitative(svg, figure) {
  assertPredictstreetConnections(svg, figure);
  const { root, nodes } = inspectPredictstreetSvg(svg), mobile = predictstreetAttrs(root).viewBox.startsWith('0 0 480 '), width = mobile ? 432 : 952;
  const labels = nodes.filter(n => predictstreetTag(n) === 'text').map(predictstreetText).join(' ');
  const find = suffix => nodes.find(n => predictstreetAttrs(n).id?.endsWith(suffix));
  if (figure === 1) {
    near(number(find('-reported-108'), 'width'), width * 108 / 167);
    near(number(find('-reported-59'), 'width'), width * 59 / 167);
    near(number(find('-reported-99'), 'width'), width * .99);
    for (const pattern of [/167/u, /108/u, /59/u, /64[,.]7/u, /99/u, /795/u, /septemb|September/u, /août|August/u, /préliminaire|preliminary/u]) assert.match(labels, pattern);
  }
  if ([2, 4, 5].includes(figure)) assert.match(labels, /FICTIF|HYPOTHETICAL/u);
  if (figure === 2) for (const pattern of [/400/u, /1[ ,]000/u, /0[,.]40/u, /hors frais|no fees/u]) assert.match(labels, pattern);
  if (figure === 3) { for (const pattern of [/Alice/u, /Bernard/u, /−100/u, /\+100/u, /MM/u, /Cycle fermé|Closed cycle/u]) assert.match(labels, pattern); assert.equal(nodes.filter(n => predictstreetAttrs(n)['marker-end']).length, 5); }
  if (figure === 4) {
    const chartWidth = mobile ? 360 : 860, chartHeight = mobile ? 180 : 230;
    for (const [i, [quantity, price]] of [[100, .5], [200, .45], [700, .3]].entries()) { const bar = find(`-tier-${i + 1}`); near(number(bar, 'width'), chartWidth * quantity / 1000); near(number(bar, 'height'), chartHeight * price / .55); }
    for (const pattern of [/350/u, /500/u, /30/u, /0[,.]50/u, /1[ ,]000|1000/u]) assert.match(labels, pattern);
  }
  if (figure === 5) { for (const pattern of [/100/u, /200/u, /1\s*%/u, /\+200 − 200 = 0/u, /commun|common/iu]) assert.match(labels, pattern); assert.equal(nodes.filter(n => predictstreetAttrs(n)['marker-end']).length, 2); }
  if (figure === 6) assert.equal(nodes.filter(n => predictstreetAttrs(n)['marker-end']).length, 3);
}

const projection = node => {
  if (node.nodeName === '#comment') return null;
  if (node.nodeName === '#text') return node.value.trim() ? { text: node.value } : null;
  return { tag: node.tagName ?? node.nodeName, attrs: Object.fromEntries((node.attrs ?? []).map(a => [a.name, a.value]).sort(([a], [b]) => a.localeCompare(b))), children: (node.childNodes ?? []).map(projection).filter(Boolean) };
};
export function assertPredictstreetRenderedFaithful(svg, source, lang, index) {
  assertPredictstreetSourceFaithful(source, lang, index);
  assertPredictstreetGeometry(svg);
  assertPredictstreetQuantitative(svg, Math.floor(index / 2) + 1);
  assert.deepEqual(projection(parseFragment(svg)), projection(parseFragment(source)), 'Astro preserves all native SVG attributes, text and element ordering');
}
