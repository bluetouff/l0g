import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { XMLParser, XMLValidator } from 'fast-xml-parser';
import { parseFragment } from 'parse5';
import opentype from '@shuding/opentype.js';

// Original desktop relationships and all quantitative scales are retained.
// Native attributes, semantic themes, exact DejaVu Sans metrics and legible reflow
// adapt the supplied scenes; separate compact mobile compositions preserve
// the same mechanisms, values, periods, sources and methodological limits.
const hashes = {
  "fr-0": "db8ef651dad94e004be588be2558f088cd4ff59ee3ded9dceca061a3228209ba",
  "fr-1": "3144b7bf3802b551bc8d07b791631c03806340b37dcab617fe42554b6e6125d3",
  "fr-2": "96ab3172467cbb4f4d136df90b6e7440678d54e0b972ed777cf3430d6f698fda",
  "fr-3": "6a1067ad93a63b20702c49e6474bfcb22cf629df9c225cfb16e24a5e598f031a",
  "fr-4": "618c342f79f16aac328758b59bbfc901af1c746987bfbec62e4dba623bef62aa",
  "fr-5": "ad3472bef1b2b4dce201f449110ecc79fb2de919524cd28ef46762f92f6081d6",
  "fr-6": "a141195bed1be831380ec71a3a40694b3a39463b3b46064b6bd5f438e7c2a643",
  "fr-7": "e0d2abfac431107ad1c7ec4eacbe34283c65d8f954e701f8a428414915a081ec",
  "fr-8": "5d3ba87fab6ebdcf357500945f063fbd5dcd35c315093ec5add876baacea5ed4",
  "fr-9": "47a9eb89affb7cb9b40abcfeb231e037c1c1f3affcd4ffc5ce8b1e961f95ff6d",
  "fr-10": "ef6cdf331f93a8f4285c85da31ecef23bfc70591c75dfbd0c45365f6ca7da2ee",
  "fr-11": "f12fd831208f3e3a617528cb7848bb6ea7006cce4101742626c0ddb51260ce58",
  "en-0": "79fa9e8f931829a292e4fd5e468d6cd2168b55c6fe970c099fa795fa6558e8ba",
  "en-1": "c9e4928fc8c2d03e9c29c41ee432a1cfcc4dfc0a6d6cdfb76640e5fbd5b87ff9",
  "en-2": "b74d7e364dcd912755edba72b5264ae10e5b3c33fd4f7f6b8efb9bb2388eab05",
  "en-3": "db8eef1b5bbe187c21da350a00b106bc0651b664a2ac4648ae01ca7e361033e4",
  "en-4": "074d1c6ea30c347e4bad14c0223a0c63db652ad2b473b72a100b5ebb076b9b6f",
  "en-5": "fde455777974030d9b0babd7e19f3e8d110e96a07c7506f328decd63ae963c3d",
  "en-6": "8ce3ba75767f6fde0ac37e6e9a595089a720093a562b8987f38ae1763a3073af",
  "en-7": "a301b855893febbaaa7802fe4be2c526c3e1322a8c0d511d89eec00aef7f3598",
  "en-8": "7c46017c2af9a1ad04389a657800b81782652af47ae45db254873d9e85b6b114",
  "en-9": "8144c690da51a31b41586bbf5c29b1741d60c92a5f3f65611b0f2c089b47d52e",
  "en-10": "99d74c99648a59755df80f7cfacea0387f96204b5bdf01705b9102907fdc7a76",
  "en-11": "70e4e98b9474a846f50e45a193ffa301835ace3e326bdd54d88113a034bcf695"
};

const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '', preserveOrder: true, trimValues: false, parseTagValue: false });
export const stablecoinsTag = node => Object.keys(node).find(key => key !== ':@');
export const stablecoinsAttrs = node => node[':@'] ?? {};
export const stablecoinsNodes = node => [node, ...(node[stablecoinsTag(node)] ?? []).filter(child => stablecoinsTag(child) !== '#text').flatMap(stablecoinsNodes)];
export const stablecoinsText = node => (node[stablecoinsTag(node)] ?? []).map(child => stablecoinsTag(child) === '#text' ? child['#text'] : stablecoinsText(child)).join('');
const number = (node, key) => { const a = stablecoinsAttrs(node); return stablecoinsTag(node) === 'circle' && ['x', 'y', 'width', 'height'].includes(key) ? key === 'x' ? Number(a.cx) - Number(a.r) : key === 'y' ? Number(a.cy) - Number(a.r) : 2 * Number(a.r) : Number(a[key]); };
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
  const bytes = readFileSync(new URL(`../public/fonts/stablecoins/dejavu-sans-${weight}.ttf`, import.meta.url));
  return [weight, opentype.parse(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength))];
}));
export const stablecoinsSourceFigures = article => [...article.matchAll(/<svg\b[\s\S]*?<\/svg>/gu)].map(match => match[0]);

export function inspectStablecoinsSvg(svg) {
  assert.equal(typeof svg, 'string');
  assert.ok(svg.length < 50000);
  assert.doesNotMatch(svg, /<!DOCTYPE|<!ENTITY|<!\[CDATA\[|<\?/iu);
  assert.doesNotMatch(svg, /\b(?:fontFamily|fontSize|fontWeight|textAnchor|strokeWidth|strokeDasharray|markerEnd)=/u, 'SVG presentation attributes use native names');
  assert.equal(XMLValidator.validate(svg), true);
  const roots = parser.parse(svg);
  assert.equal(roots.length, 1);
  const root = roots[0], nodes = stablecoinsNodes(root), a = stablecoinsAttrs(root);
  assert.equal(stablecoinsTag(root), 'svg');
  assert.equal(a.xmlns, 'http://www.w3.org/2000/svg');
  assert.equal(a.style, 'width:100%;height:auto');
  assert.equal(a.role, 'img');
  assert.match(a.viewBox, /^0 0 (?:480|1000) [0-9]+$/u);
  const ids = nodes.map(node => stablecoinsAttrs(node).id).filter(Boolean);
  assert.equal(ids.length, new Set(ids).size);
  for (const id of a['aria-labelledby'].split(' ')) assert.ok(nodes.some(node => stablecoinsAttrs(node).id === id && ['title', 'desc'].includes(stablecoinsTag(node)) && stablecoinsText(node).trim()));
  for (const node of nodes) {
    assert.ok(Object.hasOwn(allowed, stablecoinsTag(node)), `Forbidden SVG element: ${stablecoinsTag(node)}`);
    for (const [key, value] of Object.entries(stablecoinsAttrs(node))) {
      assert.ok(allowed[stablecoinsTag(node)].split(' ').includes(key), `Forbidden SVG attribute: ${key}`);
      if (key === 'href') {
        const label = stablecoinsText(node).trim().match(/^(S[0-9]{2})$/u)?.[1];
        assert.ok(label && Number(label.slice(1)) >= 1 && Number(label.slice(1)) <= 16);
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

export function assertStablecoinsSourceFaithful(svg, lang, index) {
  inspectStablecoinsSvg(svg);
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

export function assertStablecoinsConnections(svg, figure) {
  const { nodes } = inspectStablecoinsSvg(svg);
  const arrows = nodes.filter(n => ['line', 'path'].includes(stablecoinsTag(n)) && stablecoinsAttrs(n)['marker-end']);
  assert.equal(arrows.length, [svg.includes('0 0 480 ') ? 1 : 3, 0, 0, 0, 3, 0][figure - 1], 'Every investment and classification transition remains drawn');
  const convergence = figure === 5 ? nodes.filter(n => stablecoinsTag(n) === 'path' && /-convergence-(?:left|right)$/u.test(stablecoinsAttrs(n).id ?? '')) : [];
  if (figure === 5) assert.equal(convergence.length, 2, 'Both classification branches remain joined to the tax conclusion');
  const stages = figure === 1 && svg.includes('0 0 480 ') ? nodes.filter(n => stablecoinsTag(n) === 'line' && number(n, 'x1') === 12 && number(n, 'x2') === 21) : [];
  if (figure === 1 && svg.includes('0 0 480 ')) assert.equal(stages.length, 4, 'Every investment stage remains attached to the timeline');
  for (const arrow of [...arrows, ...convergence, ...stages]) {
    assert.equal(stablecoinsAttrs(arrow).stroke, 'var(--color-signal)');
    assert.ok(number(arrow, 'stroke-width') >= 2, 'Visible connection stroke');
    const points = stablecoinsTag(arrow) === 'line' ? [[number(arrow, 'x1'), number(arrow, 'y1')], [number(arrow, 'x2'), number(arrow, 'y2')]] : pathPoints(stablecoinsAttrs(arrow).d);
    const samples = points.slice(1).flatMap((b, i) => Array.from({ length: 21 }, (_, k) => [points[i][0] + (b[0] - points[i][0]) * k / 20, points[i][1] + (b[1] - points[i][1]) * k / 20]));
    assert.ok(samples.length && samples.some(([x, y]) => Math.hypot(x - points[0][0], y - points[0][1]) > 4), 'Connection has a nonzero visible route');
    for (const shape of nodes.slice(nodes.indexOf(arrow) + 1).filter(n => ['rect', 'circle'].includes(stablecoinsTag(n)) && stablecoinsAttrs(n).fill !== 'none')) {
      const covered = ([x, y]) => stablecoinsTag(shape) === 'circle' ? Math.hypot(x - number(shape, 'cx'), y - number(shape, 'cy')) < number(shape, 'r') - .5 : x > number(shape, 'x') + .5 && x < number(shape, 'x') + number(shape, 'width') - .5 && y > number(shape, 'y') + .5 && y < number(shape, 'y') + number(shape, 'height') - .5;
      assert.ok(!samples.some(covered), 'A later background cannot cover a connection');
    }
  }
  return true;
}

export function assertStablecoinsGeometry(svg) {
  const { root, nodes } = inspectStablecoinsSvg(svg), [,, width, height] = stablecoinsAttrs(root).viewBox.split(' ').map(Number);
  const labelBoxes = [];
  const visible = node => stablecoinsTag(node) === 'defs' ? [] : [node, ...(node[stablecoinsTag(node)] ?? []).filter(child => stablecoinsTag(child) !== '#text').flatMap(visible)];
  const point = (x, y) => assert.ok(Number.isFinite(x) && Number.isFinite(y) && x >= 0 && y >= 0 && x <= width && y <= height, `Shape outside viewBox: ${x},${y}`);
  for (const node of visible(root)) {
    const a = stablecoinsAttrs(node), tag = stablecoinsTag(node);
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
  const panels = nodes.filter(node => stablecoinsTag(node) === 'circle' || stablecoinsTag(node) === 'rect' && [6, 8, 10, 12].includes(number(node, 'rx')));
  const contains = (a, b) => number(a, 'x') <= number(b, 'x') && number(a, 'y') <= number(b, 'y') && number(a, 'x') + number(a, 'width') >= number(b, 'x') + number(b, 'width') && number(a, 'y') + number(a, 'height') >= number(b, 'y') + number(b, 'height');
  const footer = nodes.filter(n => stablecoinsTag(n) === 'line' && number(n, 'x1') === 24 && number(n, 'x2') === width - 24 && number(n, 'y1') === number(n, 'y2')).sort((a, b) => number(b, 'y1') - number(a, 'y1'))[0];
  if (footer) for (const p of panels) assert.ok(number(p, 'y') + number(p, 'height') <= number(footer, 'y1') - 8, 'Panel retains space above the source footer');
  for (let i = 0; i < panels.length; i++) for (const b of panels.slice(i + 1)) {
    const a = panels[i]; if (contains(a, b) || contains(b, a)) continue; const overlapX = Math.min(number(a, 'x') + number(a, 'width'), number(b, 'x') + number(b, 'width')) - Math.max(number(a, 'x'), number(b, 'x'));
    const overlapY = Math.min(number(a, 'y') + number(a, 'height'), number(b, 'y') + number(b, 'height')) - Math.max(number(a, 'y'), number(b, 'y'));
    if (overlapX > 0) assert.ok(overlapY <= -4, 'Adjacent authored panels retain a visible gutter');
    if (overlapY > 0) assert.ok(overlapX <= -4, 'Adjacent authored panels retain a visible gutter');
  }
  for (const node of nodes.filter(node => stablecoinsTag(node) === 'text')) {
    const a = stablecoinsAttrs(node), size = Number(a['font-size']), font = fonts.get(Number(a['font-weight'])), label = stablecoinsText(node);
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
    const panel = a['data-panel'] ? panels.find(panel => stablecoinsAttrs(panel).id === a['data-panel']) : panels.filter(panel => number(node, 'x') >= number(panel, 'x') && number(node, 'x') <= number(panel, 'x') + number(panel, 'width') && y >= number(panel, 'y') && y <= number(panel, 'y') + number(panel, 'height')).sort((a, b) => number(a, 'width') * number(a, 'height') - number(b, 'width') * number(b, 'height'))[0];
    if (a['data-panel']) assert.ok(panel, 'Authored containing panel exists');
    if (panel) assert.ok(box.x1 >= number(panel, 'x') + 2 && box.y1 >= number(panel, 'y') + 2 && box.x2 <= number(panel, 'x') + number(panel, 'width') - 2 && box.y2 <= number(panel, 'y') + number(panel, 'height') - 10, `Text outside internal panel: ${label}`);
    // Glyph outlines exclude unused ascent/descent. Chromium's getBBox()
    // includes those font extents and varies slightly with the screen scale.
    // Keep a conservative full em above the baseline and 0.3 em below it;
    // rendered browser QA separately checks every authored panel at all widths.
    if (panel) assert.ok(x >= number(panel, 'x') + 1 && y - size >= number(panel, 'y') + 1 && x + advance <= number(panel, 'x') + number(panel, 'width') - 1 && y + size * .3 <= number(panel, 'y') + number(panel, 'height') - 1, `Typographic extents outside internal panel: ${label}`);
  }
  for (const b of labelBoxes) for (const circle of nodes.filter(n => stablecoinsTag(n) === 'circle')) {
    const a = stablecoinsAttrs(circle); if (b.panel === a.id) continue;
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

export function assertStablecoinsProportions(svg) {
  const { root, nodes } = inspectStablecoinsSvg(svg), [,, width, height] = stablecoinsAttrs(root).viewBox.split(' ').map(Number), mobile = width === 480;
  assert.ok(height / width <= (mobile ? 1.56 : .8), 'Artwork retains compact in-page proportions');
  const minimum = Math.min(...nodes.filter(node => stablecoinsTag(node) === 'text').map(node => number(node, 'font-size')));
  assert.ok(minimum >= (mobile ? 22 : 24), 'Compactness must preserve legible typography');
}

const near = (actual, expected) => assert.ok(Math.abs(Number(actual) - expected) <= .001, `${actual} != ${expected}`);
export function assertStablecoinsQuantitative(svg, figure) {
  assertStablecoinsConnections(svg, figure);
  const { root, nodes } = inspectStablecoinsSvg(svg), mobile = stablecoinsAttrs(root).viewBox.startsWith('0 0 480 ');
  const find = suffix => nodes.find(n => stablecoinsAttrs(n).id?.endsWith(suffix));
  if (figure === 2) { const width = mobile ? 432 : 475; near(number(find('-gain-4000'), 'width'), width * .4); near(number(find('-gain-10000'), 'width'), width); }
  if (figure === 3) { const width = mobile ? 432 : 952; for (const [i,v] of [10000,16000].entries()) { near(number(find(`-basis-${i}-total`), 'width'), width); near(number(find(`-basis-${i}-a`), 'width'), width * v / 20000); } }
  if (figure === 4) { const scale = mobile ? .01 : .009; for (const [i,values] of [[0,10000],[-2000,-12000]].entries()) for (const [j,v] of values.entries()) { const bar = find(`-year-${i}-${j}`); if (v) near(number(bar, mobile ? 'width' : 'height'), Math.abs(v) * scale); else assert.equal(stablecoinsTag(bar),'circle'); } }
  if (figure === 6) { const width = mobile ? 432 : 430; near(number(find('-fx-10000'),'width'),width); near(number(find('-fx-9000'),'width'),width*.9); }
  return true;
}

const projection = node => {
  if (node.nodeName === '#comment') return null;
  if (node.nodeName === '#text') return node.value.trim() ? { text: node.value } : null;
  return { tag: node.tagName ?? node.nodeName, attrs: Object.fromEntries((node.attrs ?? []).map(a => [a.name, a.value]).sort(([a], [b]) => a.localeCompare(b))), children: (node.childNodes ?? []).map(projection).filter(Boolean) };
};
export function assertStablecoinsRenderedFaithful(svg, source, lang, index) {
  assertStablecoinsSourceFaithful(source, lang, index);
  assertStablecoinsGeometry(svg);
  assertStablecoinsQuantitative(svg, Math.floor(index / 2) + 1);
  assert.deepEqual(projection(parseFragment(svg)), projection(parseFragment(source)), 'Astro preserves all native SVG attributes, text and element ordering');
}
