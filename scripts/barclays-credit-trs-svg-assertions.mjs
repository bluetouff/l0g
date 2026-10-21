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
  "fr-0": "02795d5fa6d8e2abaca79713d0548e0054fc40f7cd1639dc8283a0ee6d9e41ef",
  "fr-1": "3976210c3e1965dea18724b0e0b5807732f8622ad2098a122f47088e9677840d",
  "fr-2": "a21a3b3744491874b83edd8e9f5517181a83ebebe628f756103a873e71c90ea3",
  "fr-3": "a69f53b79c47dab1646ed0fa60ba9bc21a3faf3b10de984d461a8a706c098615",
  "fr-4": "70d50cfaf868dcf2c51dfae3019dc2eabf6f1dfe1550202226915933bad58dbc",
  "fr-5": "5c322fbf302d86d765d6ee4669f43424a9da2801be0dce2c493340e70cb9345b",
  "fr-6": "e93a3165b0686dde3cbaa6a061b962464fea1c6f90736bf415520dc8464ed25c",
  "fr-7": "ddaa4e44e2c502a2a03c1e4bcd68f0fef2ac816a38139a8c4726acffbd8a79fb",
  "en-0": "4b3c10ea90bf5f7c9a5ddc75cb63aa6e4686bad9599048968eb607af20ef3a4f",
  "en-1": "77de965191f1ab7fd1bd5ba79f1a4cd093e879d780ba6235979a6661d17fbfb1",
  "en-2": "3bcee3a4ed27e33ee03295737efe31832f9120906aa170aa195b98c76735cd90",
  "en-3": "58dcc10d711e010b99017c82b0bec1a224c787cfaadbaa3b1f746ee29eb70e24",
  "en-4": "e476b06116c3906a63ad1b9a84b2c2c96ab6bce7457da6ec1759957eb205f709",
  "en-5": "f54d5318cdd56383561d0cc230113e4d10a62d2e3a92e88285499248153efd91",
  "en-6": "a0baa77be30d14e3e108cbb733a3bea78406df1781e8353934ee7eb1454e722a",
  "en-7": "2346a27b45fe32130f7c43986fc601983770d6897240cf5a84c415c9ffeec85b"
};

const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '', preserveOrder: true, trimValues: false, parseTagValue: false });
export const barclaysCreditTrsTag = node => Object.keys(node).find(key => key !== ':@');
export const barclaysCreditTrsAttrs = node => node[':@'] ?? {};
export const barclaysCreditTrsNodes = node => [node, ...(node[barclaysCreditTrsTag(node)] ?? []).filter(child => barclaysCreditTrsTag(child) !== '#text').flatMap(barclaysCreditTrsNodes)];
export const barclaysCreditTrsText = node => (node[barclaysCreditTrsTag(node)] ?? []).map(child => barclaysCreditTrsTag(child) === '#text' ? child['#text'] : barclaysCreditTrsText(child)).join('');
const number = (node, key) => { const a = barclaysCreditTrsAttrs(node); return barclaysCreditTrsTag(node) === 'circle' && ['x', 'y', 'width', 'height'].includes(key) ? key === 'x' ? Number(a.cx) - Number(a.r) : key === 'y' ? Number(a.cy) - Number(a.r) : 2 * Number(a.r) : Number(a[key]); };
const allowed = {
  svg: 'style xmlns viewBox role aria-labelledby', title: 'id', desc: 'id', defs: '',
  marker: 'id viewBox refX refY markerWidth markerHeight orient',
  pattern: 'id width height patternUnits',
  path: 'id d fill stroke stroke-width stroke-dasharray marker-end',
  rect: 'id x y width height rx fill stroke stroke-width stroke-dasharray',
  text: 'data-panel data-max-width x y font-family font-size font-weight text-anchor fill',
  line: 'id x1 y1 x2 y2 stroke stroke-width stroke-linecap stroke-dasharray marker-end',
  circle: 'id cx cy r fill stroke stroke-width', a: 'href',
};
const fonts = new Map([400, 700].map(weight => {
  const bytes = readFileSync(new URL(`../public/fonts/barclays-credit-trs/dejavu-sans-${weight}.ttf`, import.meta.url));
  return [weight, opentype.parse(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength))];
}));
export const barclaysCreditTrsSourceFigures = article => [...article.matchAll(/<svg\b[\s\S]*?<\/svg>/gu)].map(match => match[0]);

export function inspectBarclaysCreditTrsSvg(svg) {
  assert.equal(typeof svg, 'string');
  assert.ok(svg.length < 50000);
  assert.doesNotMatch(svg, /<!DOCTYPE|<!ENTITY|<!\[CDATA\[|<\?/iu);
  assert.doesNotMatch(svg, /\b(?:fontFamily|fontSize|fontWeight|textAnchor|strokeWidth|strokeDasharray|markerEnd)=/u, 'SVG presentation attributes use native names');
  assert.equal(XMLValidator.validate(svg), true);
  const roots = parser.parse(svg);
  assert.equal(roots.length, 1);
  const root = roots[0], nodes = barclaysCreditTrsNodes(root), a = barclaysCreditTrsAttrs(root);
  assert.equal(barclaysCreditTrsTag(root), 'svg');
  assert.equal(a.xmlns, 'http://www.w3.org/2000/svg');
  assert.equal(a.style, 'width:100%;height:auto');
  assert.equal(a.role, 'img');
  assert.match(a.viewBox, /^0 0 (?:600|1000) [0-9]+$/u);
  const ids = nodes.map(node => barclaysCreditTrsAttrs(node).id).filter(Boolean);
  assert.equal(ids.length, new Set(ids).size);
  for (const id of a['aria-labelledby'].split(' ')) assert.ok(nodes.some(node => barclaysCreditTrsAttrs(node).id === id && ['title', 'desc'].includes(barclaysCreditTrsTag(node)) && barclaysCreditTrsText(node).trim()));
  for (const node of nodes) {
    assert.ok(Object.hasOwn(allowed, barclaysCreditTrsTag(node)), `Forbidden SVG element: ${barclaysCreditTrsTag(node)}`);
    for (const [key, value] of Object.entries(barclaysCreditTrsAttrs(node))) {
      assert.ok(allowed[barclaysCreditTrsTag(node)].split(' ').includes(key), `Forbidden SVG attribute: ${key}`);
      if (key === 'href') {
        const label = barclaysCreditTrsText(node).trim().match(/^(S[0-9]{2})$/u)?.[1];
        assert.ok(label && Number(label.slice(1)) >= 1 && Number(label.slice(1)) <= 15);
        assert.equal(value, `#source-${label}`);
      }
      if (['fill', 'stroke'].includes(key)) assert.match(value, /^(?:none|var\(--color-(?:ink|surface|surface-2|paper|muted|line-strong|signal|amber|accent|topic-blue)\)|url\(#[a-z0-9-]+\))$/u);
      if (String(value).includes('url(')) {
        const reference = String(value).match(/^url\(#([a-z0-9-]+)\)$/u);
        assert.ok(reference && ids.includes(reference[1]));
      }
    }
  }
  return { root, nodes };
}

export function assertBarclaysCreditTrsSourceFaithful(svg, lang, index) {
  inspectBarclaysCreditTrsSvg(svg);
  assert.equal(createHash('sha256').update(svg).digest('hex'), hashes[`${lang}-${index}`], 'Verified compact composition, labels or semantic-theme mapping changed');
}

function pathPoints(d) {
  // Consume the entire number before checking bounds. Limiting the lexical
  // match to four digits would split a single token such as 01000100 into
  // two coordinates without a valid SVG separator.
  const token = /[MLHVZ]|[+-]?(?:\d+(?:\.\d*)?|\.\d+)/uy, tokens = [], points = [];
  let offset = 0;
  while (offset < d.length) {
    if (/\s/u.test(d[offset])) { offset++; continue; }
    token.lastIndex = offset; const match = token.exec(d); assert.ok(match, 'Every path character is consumed');
    if (!/^[MLHVZ]$/u.test(match[0])) assert.match(match[0], /^[+-]?(?:\d{1,4}(?:\.\d{0,18})?|\.\d{1,18})$/u, 'Every coordinate is one complete bounded SVG number');
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

export function assertBarclaysCreditTrsConnections(svg, figure) {
  const { root, nodes } = inspectBarclaysCreditTrsSvg(svg);
  const prefix = barclaysCreditTrsAttrs(root)['aria-labelledby'].split(' ')[0].slice(0, -6);
  const arrows = nodes.filter(n => ['line', 'path'].includes(barclaysCreditTrsTag(n)) && barclaysCreditTrsAttrs(n)['marker-end']);
  const suffixes = [['performance', 'financing', 'fall'], ['top-up'], [], ['performing-B-to-A', 'performing-C-to-B', 'default-B-to-A', 'available-collateral']][figure - 1];
  assert.ok(suffixes);
  assert.deepEqual(arrows.map(n => barclaysCreditTrsAttrs(n).id), suffixes.map(name => `${prefix}-${name}`), 'All sourced transfers remain explicit and in order');
  for (const arrow of arrows) {
    const a = barclaysCreditTrsAttrs(arrow);
    assert.match(a.stroke, /^var\(--color-(?:signal|amber|accent|topic-blue)\)$/u);
    assert.ok(number(arrow, 'stroke-width') >= 2, 'Visible connection stroke');
    const color = a.stroke.slice(12, -1), markerId = `${prefix}-${color}-arrow`;
    assert.equal(a['marker-end'], `url(#${markerId})`);
    const marker = nodes.find(n => barclaysCreditTrsTag(n) === 'marker' && barclaysCreditTrsAttrs(n).id === markerId);
    assert.ok(marker);
    const head = barclaysCreditTrsNodes(marker).find(n => barclaysCreditTrsTag(n) === 'path');
    assert.equal(barclaysCreditTrsAttrs(head).stroke, a.stroke, 'Arrowhead retains visible semantic paint');
    assert.ok(number(head, 'stroke-width') >= 1);
    const points = barclaysCreditTrsTag(arrow) === 'line' ? [[number(arrow, 'x1'), number(arrow, 'y1')], [number(arrow, 'x2'), number(arrow, 'y2')]] : pathPoints(a.d);
    const samples = points.slice(1).flatMap((b, i) => Array.from({ length: 21 }, (_, k) => [points[i][0] + (b[0] - points[i][0]) * k / 20, points[i][1] + (b[1] - points[i][1]) * k / 20]));
    assert.ok(samples.length && samples.some(([x, y]) => Math.hypot(x - points[0][0], y - points[0][1]) > 4), 'Nonzero transfer route');
    for (const shape of nodes.slice(nodes.indexOf(arrow) + 1).filter(n => ['rect', 'circle'].includes(barclaysCreditTrsTag(n)) && barclaysCreditTrsAttrs(n).fill !== 'none')) {
      const covered = ([x, y]) => barclaysCreditTrsTag(shape) === 'circle' ? Math.hypot(x - number(shape, 'cx'), y - number(shape, 'cy')) < number(shape, 'r') - .5 : x > number(shape, 'x') + .5 && x < number(shape, 'x') + number(shape, 'width') - .5 && y > number(shape, 'y') + .5 && y < number(shape, 'y') + number(shape, 'height') - .5;
      assert.ok(!samples.some(covered), 'A later background cannot cover a connection');
    }
    if (figure === 1) assert.equal(number(arrow, 'x1') < number(arrow, 'x2'), a.id.endsWith('-performance'), 'TRS performance and reverse payments have opposite directions');
    if (figure === 2) assert.ok(number(arrow, 'x2') > number(arrow, 'x1') || number(arrow, 'y2') > number(arrow, 'y1'), 'Collateral top-up progresses to the next state');
    if (figure === 4) {
      if (a.id.endsWith('-available-collateral')) assert.ok(number(arrow, 'y1') > number(arrow, 'y2') && number(arrow, 'x1') === number(arrow, 'x2'), 'Already-held collateral is applied to B');
      else assert.ok(number(arrow, 'x1') > number(arrow, 'x2'), 'Payments run from C to B and from B to A');
    }
  }
  if (figure === 4) {
    const find = name => { const n = nodes.find(n => barclaysCreditTrsAttrs(n).id === `${prefix}-${name}`); assert.ok(n, name); return n; };
    const claim = find('unpaid-claim'), a = barclaysCreditTrsAttrs(claim), x = (number(claim, 'x1') + number(claim, 'x2')) / 2, y = number(claim, 'y1');
    assert.equal(a.stroke, 'var(--color-accent)'); assert.equal(a['stroke-dasharray'], '6 6'); assert.equal(a['marker-end'], undefined, 'An unpaid claim must not appear as a completed payment');
    for (const [name, direction] of [['unpaid-cross-a', 1], ['unpaid-cross-b', -1]]) {
      const cross = find(name); assert.equal(barclaysCreditTrsAttrs(cross).stroke, 'var(--color-accent)'); assert.ok(number(cross, 'stroke-width') >= 2);
      assert.equal(number(cross, 'x1'), x - 7); assert.equal(number(cross, 'x2'), x + 7); assert.equal(number(cross, 'y1'), y - 7 * direction); assert.equal(number(cross, 'y2'), y + 7 * direction);
    }
  }
  return true;
}

export function assertBarclaysCreditTrsGeometry(svg) {
  const { root, nodes } = inspectBarclaysCreditTrsSvg(svg), [,, width, height] = barclaysCreditTrsAttrs(root).viewBox.split(' ').map(Number);
  const labelBoxes = [];
  const visible = node => barclaysCreditTrsTag(node) === 'defs' ? [] : [node, ...(node[barclaysCreditTrsTag(node)] ?? []).filter(child => barclaysCreditTrsTag(child) !== '#text').flatMap(visible)];
  const point = (x, y) => assert.ok(Number.isFinite(x) && Number.isFinite(y) && x >= 0 && y >= 0 && x <= width && y <= height, `Shape outside viewBox: ${x},${y}`);
  for (const node of visible(root)) {
    const a = barclaysCreditTrsAttrs(node), tag = barclaysCreditTrsTag(node);
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
  const panels = nodes.filter(node => barclaysCreditTrsTag(node) === 'circle' || barclaysCreditTrsTag(node) === 'rect' && [6, 8, 10, 12].includes(number(node, 'rx')));
  const contains = (a, b) => number(a, 'x') <= number(b, 'x') && number(a, 'y') <= number(b, 'y') && number(a, 'x') + number(a, 'width') >= number(b, 'x') + number(b, 'width') && number(a, 'y') + number(a, 'height') >= number(b, 'y') + number(b, 'height');
  const footer = nodes.filter(n => barclaysCreditTrsTag(n) === 'line' && number(n, 'x1') === 24 && number(n, 'x2') === width - 24 && number(n, 'y1') === number(n, 'y2')).sort((a, b) => number(b, 'y1') - number(a, 'y1'))[0];
  if (footer) for (const p of panels) assert.ok(number(p, 'y') + number(p, 'height') <= number(footer, 'y1') - 8, 'Panel retains space above the source footer');
  for (let i = 0; i < panels.length; i++) for (const b of panels.slice(i + 1)) {
    const a = panels[i]; if (contains(a, b) || contains(b, a)) continue; const overlapX = Math.min(number(a, 'x') + number(a, 'width'), number(b, 'x') + number(b, 'width')) - Math.max(number(a, 'x'), number(b, 'x'));
    const overlapY = Math.min(number(a, 'y') + number(a, 'height'), number(b, 'y') + number(b, 'height')) - Math.max(number(a, 'y'), number(b, 'y'));
    if (overlapX > 0) assert.ok(overlapY <= -4, 'Adjacent authored panels retain a visible gutter');
    if (overlapY > 0) assert.ok(overlapX <= -4, 'Adjacent authored panels retain a visible gutter');
  }
  for (const node of nodes.filter(node => barclaysCreditTrsTag(node) === 'text')) {
    const a = barclaysCreditTrsAttrs(node), size = Number(a['font-size']), font = fonts.get(Number(a['font-weight'])), label = barclaysCreditTrsText(node);
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
    labelBoxes.push({ ...box, label, panel: a['data-panel'], node });
    if (a['data-max-width']) assert.ok(advance <= Number(a['data-max-width']) + 1, `Text exceeds its authored column: ${label}`);
    const panel = a['data-panel'] ? nodes.find(panel => ['rect', 'circle'].includes(barclaysCreditTrsTag(panel)) && barclaysCreditTrsAttrs(panel).id === a['data-panel']) : panels.filter(panel => number(node, 'x') >= number(panel, 'x') && number(node, 'x') <= number(panel, 'x') + number(panel, 'width') && y >= number(panel, 'y') && y <= number(panel, 'y') + number(panel, 'height')).sort((a, b) => number(a, 'width') * number(a, 'height') - number(b, 'width') * number(b, 'height'))[0];
    if (a['data-panel']) assert.ok(panel, 'Authored containing panel exists');
    if (panel) assert.ok(box.x1 >= number(panel, 'x') + 2 && box.y1 >= number(panel, 'y') + 2 && box.x2 <= number(panel, 'x') + number(panel, 'width') - 2 && box.y2 <= number(panel, 'y') + number(panel, 'height') - 10, `Text outside internal panel: ${label}`);
    // Glyph outlines exclude unused ascent/descent. Chromium's getBBox()
    // includes those font extents and varies slightly with the screen scale.
    // Keep a conservative full em above the baseline and 0.3 em below it;
    // rendered browser QA separately checks every authored panel at all widths.
    if (panel) assert.ok(x >= number(panel, 'x') + 1 && y - size >= number(panel, 'y') + 1 && x + advance <= number(panel, 'x') + number(panel, 'width') - 1 && y + size * .3 <= number(panel, 'y') + number(panel, 'height') - 1, `Typographic extents outside internal panel: ${label}`);
  }
  const dataBars = nodes.filter(n => barclaysCreditTrsTag(n) === 'rect' && /-(?:senior-[0-2]|cushion-[0-2]|recovered-collateral|unrecovered-claim)$/u.test(barclaysCreditTrsAttrs(n).id ?? ''));
  for (const text of labelBoxes) for (const bar of dataBars) {
    if (text.panel === barclaysCreditTrsAttrs(bar).id) continue;
    const overlapX = Math.min(text.x2, number(bar,'x') + number(bar,'width')) - Math.max(text.x1,number(bar,'x'));
    const overlapY = Math.min(text.y2, number(bar,'y') + number(bar,'height')) - Math.max(text.y1,number(bar,'y'));
    assert.ok(overlapX <= 0 || overlapY <= 0, `Text overlaps a quantitative bar: ${text.label}`);
  }
  for (const label of labelBoxes) for (const shape of nodes.slice(nodes.indexOf(label.node) + 1).filter(n => barclaysCreditTrsTag(n) === 'rect' && barclaysCreditTrsAttrs(n).fill !== 'none')) {
    const dx = Math.min(label.x2, number(shape,'x') + number(shape,'width')) - Math.max(label.x1,number(shape,'x'));
    const dy = Math.min(label.y2, number(shape,'y') + number(shape,'height')) - Math.max(label.y1,number(shape,'y'));
    assert.ok(dx <= 1 || dy <= 1, `A later background cannot cover a label: ${label.label}`);
  }
  for (const b of labelBoxes) for (const circle of nodes.filter(n => barclaysCreditTrsTag(n) === 'circle')) {
    const a = barclaysCreditTrsAttrs(circle); if (b.panel === a.id) continue;
    const dx = number(circle, 'cx') - Math.max(b.x1, Math.min(number(circle, 'cx'), b.x2));
    const dy = number(circle, 'cy') - Math.max(b.y1, Math.min(number(circle, 'cy'), b.y2));
    assert.ok(Math.hypot(dx, dy) >= number(circle, 'r') + 1, `Text overlaps an unrelated node or badge: ${b.label}`);
  }
  for (let i = 0; i < labelBoxes.length; i++) for (let j = i + 1; j < labelBoxes.length; j++) {
    const a = labelBoxes[i], b = labelBoxes[j];
    assert.ok(!(Math.min(a.x2, b.x2) - Math.max(a.x1, b.x1) > 1 && Math.min(a.y2, b.y2) - Math.max(a.y1, b.y1) > 1), `Overlapping labels: ${a.label} / ${b.label}`);
  }
  for (const arrow of nodes.filter(n => barclaysCreditTrsTag(n) === 'line' && barclaysCreditTrsAttrs(n)['marker-end'])) {
    const x1=number(arrow,'x1'),y1=number(arrow,'y1'),x2=number(arrow,'x2'),y2=number(arrow,'y2');
    for (const label of labelBoxes) for(let i=0;i<=50;i++) {
      const x=x1+(x2-x1)*i/50,y=y1+(y2-y1)*i/50;
      assert.ok(!(x>label.x1-1 && x<label.x2+1 && y>label.y1-1 && y<label.y2+1), `A transfer rail cannot cross a label: ${label.label}`);
    }
  }

  return true;
}

export function assertBarclaysCreditTrsProportions(svg) {
  const { root, nodes } = inspectBarclaysCreditTrsSvg(svg), [,, width, height] = barclaysCreditTrsAttrs(root).viewBox.split(' ').map(Number), mobile = width === 600;
  assert.equal(width, mobile ? 600 : 1000);
  assert.ok(height / width <= (mobile ? 1.5 : .8), 'Artwork retains compact in-page proportions');
  assert.ok(nodes.filter(node => barclaysCreditTrsTag(node) === 'text').every(node => number(node, 'font-size') >= 28), 'Every label remains legible at the container breakpoint');
}

const near = (actual, expected) => assert.ok(Math.abs(Number(actual) - expected) <= .002, `${actual} != ${expected}`);
export function assertBarclaysCreditTrsQuantitative(svg, figure) {
  assertBarclaysCreditTrsConnections(svg, figure);
  const { root, nodes } = inspectBarclaysCreditTrsSvg(svg), width = Number(barclaysCreditTrsAttrs(root).viewBox.split(' ')[2]), mobile = width === 600;
  const find = suffix => { const n = nodes.find(n => barclaysCreditTrsAttrs(n).id?.endsWith(suffix)); assert.ok(n, `Required mark ${suffix}`); return n; };
  if (figure === 2) for (const [i, assets] of [350,315,335].entries()) {
    const senior = find(`-senior-${i}`), cushion = find(`-cushion-${i}`), scale = mobile ? 552 / 350 : .7, dimension = mobile ? 'width' : 'height';
    near(number(senior,dimension), 200 * scale); near(number(cushion,dimension),(assets - 200) * scale);
    assert.equal(barclaysCreditTrsAttrs(senior).fill,'var(--color-signal)'); assert.equal(barclaysCreditTrsAttrs(cushion).fill,'var(--color-amber)');
    if (mobile) { near(number(senior,'x'),24); near(number(cushion,'x'),24+200*scale); near(number(senior,'y'),250+i*174); near(number(cushion,'y'),number(senior,'y')); }
    else { near(number(senior,'y')+number(senior,'height'),555); near(number(cushion,'y')+number(cushion,'height'),number(senior,'y')); }
  }
  if (figure === 3) {
    const plot = mobile ? {x:85,y:335,w:465,h:270} : {x:90,y:280,w:640,h:300};
    for (const [name, formula, color] of [['topup-curve', i => Math.max(0,(21*i-100)/6),'amber'],['shortfall-curve',i=>Math.max(0,(7*i-300)/2),'accent']]) {
      const curve = find(`-${name}`), points = pathPoints(barclaysCreditTrsAttrs(curve).d); assert.equal(points.length,61,'Every integer decline from 0 through 60 is retained'); assert.equal(barclaysCreditTrsAttrs(curve).stroke,`var(--color-${color})`);
      for (const [i,[x,y]] of points.entries()) { near(x,plot.x+i/60*plot.w); near(y,plot.y+plot.h-formula(i)/210*plot.h); }
    }
    for (const [name, fall] of [['margin-threshold',1/21],['shortfall-threshold',3/7]]) { const line=find(`-${name}`); near(number(line,'x1'),plot.x+fall/.6*plot.w); near(number(line,'x2'),number(line,'x1')); near(number(line,'y1'),plot.y); near(number(line,'y2'),plot.y+plot.h); }
  }
  if (figure === 4) { const barWidth=mobile?552:600; near(number(find('-recovered-collateral'),'width'),barWidth*8/20); near(number(find('-unrecovered-claim'),'width'),barWidth*12/20); near(number(find('-unrecovered-claim'),'x'),24+barWidth*8/20); }
  return true;
}

const projection = node => {
  if (node.nodeName === '#comment') return null;
  if (node.nodeName === '#text') return node.value.trim() ? { text: node.value } : null;
  return { tag: node.tagName ?? node.nodeName, attrs: Object.fromEntries((node.attrs ?? []).map(a => [a.name, a.value]).sort(([a], [b]) => a.localeCompare(b))), children: (node.childNodes ?? []).map(projection).filter(Boolean) };
};
export function assertBarclaysCreditTrsRenderedFaithful(svg, source, lang, index) {
  assertBarclaysCreditTrsSourceFaithful(source, lang, index);
  assertBarclaysCreditTrsGeometry(svg);
  assertBarclaysCreditTrsQuantitative(svg, Math.floor(index / 2) + 1);
  assert.deepEqual(projection(parseFragment(svg)), projection(parseFragment(source)), 'Astro preserves all native SVG attributes, text and element ordering');
}
