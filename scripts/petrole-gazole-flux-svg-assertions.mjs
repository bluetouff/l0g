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
  "fr-0": "6eafc91679905719b25499dd5ce65967547cfb9ae67b88fd2897ac8285ee427f",
  "fr-1": "7c858968a1266dc40be8e42b60691622d30aac4eb054d8686972a84b24bc84a9",
  "fr-2": "de81054c2276b7b17e402a9313865f97cceaba5a6a2c1751b2dc4e9e1f146e03",
  "fr-3": "4758eb07a7ba70266f35aaa64e46d4b5cda5f25dd32be8457f8a99ec2d1dc9b2",
  "fr-4": "5307fcf74839740913229bcb2fa455777d3f832c35b06a24527c0d378b46a4aa",
  "fr-5": "66d6347b14cee462e364761d30e4520c0fc47ced65bf18307bc66fe7a9e4c6e7",
  "fr-6": "3b7e724f49d9f468efd474f569156c4b8c347d57b93d377c19c0b52306aa3b6a",
  "fr-7": "ce87e9477e8c8724ffe0075e0444eb0283b5a4fd7144e27669933240c19e5224",
  "en-0": "e35bdd65dca9c2d29c4b35cc41728228215d35b5ca27f2bdc6591e1ffd45c7b0",
  "en-1": "6f72bf3764776f312efc96635357c6d0bfe213f7aac33868ed3eedeb2806645d",
  "en-2": "10421d4ff2b51f8d3f9a173680d8a87e068ba520356caee3407f5bb815651ab7",
  "en-3": "6556f281824a4c511764797198995d70c9837b681b14aa1a76c938ab2a1015c6",
  "en-4": "2c275f5d335c8475e05888d4e2bdb274f455f9c23651f439c8787f935e4c3d3d",
  "en-5": "14ef62eab8aea0a73d3c7417bbc92de562063b02ab2ec943656f8cda5c180b96",
  "en-6": "2873cf9b09b0ec2d95ff32ec932ae03094c0ff5a83a9b7cb858675476f755e1d",
  "en-7": "ac2214fadc0cdfa87029de813bda05698ac2290d1d938e9e47992295db89d8ce"
};

const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '', preserveOrder: true, trimValues: false, parseTagValue: false });
export const petroleGazoleFluxTag = node => Object.keys(node).find(key => key !== ':@');
export const petroleGazoleFluxAttrs = node => node[':@'] ?? {};
export const petroleGazoleFluxNodes = node => [node, ...(node[petroleGazoleFluxTag(node)] ?? []).filter(child => petroleGazoleFluxTag(child) !== '#text').flatMap(petroleGazoleFluxNodes)];
export const petroleGazoleFluxText = node => (node[petroleGazoleFluxTag(node)] ?? []).map(child => petroleGazoleFluxTag(child) === '#text' ? child['#text'] : petroleGazoleFluxText(child)).join('');
const number = (node, key) => { const a = petroleGazoleFluxAttrs(node); return petroleGazoleFluxTag(node) === 'circle' && ['x', 'y', 'width', 'height'].includes(key) ? key === 'x' ? Number(a.cx) - Number(a.r) : key === 'y' ? Number(a.cy) - Number(a.r) : 2 * Number(a.r) : Number(a[key]); };
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
  const bytes = readFileSync(new URL(`../public/fonts/stablecoins/dejavu-sans-${weight}.ttf`, import.meta.url));
  return [weight, opentype.parse(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength))];
}));
export const petroleGazoleFluxSourceFigures = article => [...article.matchAll(/<svg\b[\s\S]*?<\/svg>/gu)].map(match => match[0]);

export function inspectPetroleGazoleFluxSvg(svg) {
  assert.equal(typeof svg, 'string');
  assert.ok(svg.length < 50000);
  assert.doesNotMatch(svg, /<!DOCTYPE|<!ENTITY|<!\[CDATA\[|<\?/iu);
  assert.doesNotMatch(svg, /\b(?:fontFamily|fontSize|fontWeight|textAnchor|strokeWidth|strokeDasharray|markerEnd)=/u, 'SVG presentation attributes use native names');
  assert.equal(XMLValidator.validate(svg), true);
  const roots = parser.parse(svg);
  assert.equal(roots.length, 1);
  const root = roots[0], nodes = petroleGazoleFluxNodes(root), a = petroleGazoleFluxAttrs(root);
  assert.equal(petroleGazoleFluxTag(root), 'svg');
  assert.equal(a.xmlns, 'http://www.w3.org/2000/svg');
  assert.equal(a.style, 'width:100%;height:auto');
  assert.equal(a.role, 'img');
  assert.match(a.viewBox, /^0 0 (?:600|1000) [0-9]+$/u);
  const ids = nodes.map(node => petroleGazoleFluxAttrs(node).id).filter(Boolean);
  assert.equal(ids.length, new Set(ids).size);
  for (const id of a['aria-labelledby'].split(' ')) assert.ok(nodes.some(node => petroleGazoleFluxAttrs(node).id === id && ['title', 'desc'].includes(petroleGazoleFluxTag(node)) && petroleGazoleFluxText(node).trim()));
  for (const node of nodes) {
    assert.ok(Object.hasOwn(allowed, petroleGazoleFluxTag(node)), `Forbidden SVG element: ${petroleGazoleFluxTag(node)}`);
    for (const [key, value] of Object.entries(petroleGazoleFluxAttrs(node))) {
      assert.ok(allowed[petroleGazoleFluxTag(node)].split(' ').includes(key), `Forbidden SVG attribute: ${key}`);
      if (key === 'href') {
        const label = petroleGazoleFluxText(node).trim().match(/^(S[0-9]{2})$/u)?.[1];
        assert.ok(label && Number(label.slice(1)) >= 1 && Number(label.slice(1)) <= 21);
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

export function assertPetroleGazoleFluxSourceFaithful(svg, lang, index) {
  inspectPetroleGazoleFluxSvg(svg);
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
    if (command === 'M' || command === 'L') { x = value(); y = value(); if (command === 'M') { assert.equal(origin, undefined, 'Every scene path uses a single subpath'); origin = [x, y]; } }
    else if (command === 'H') x = value();
    else if (command === 'V') y = value();
    else { assert.equal(command, 'Z'); assert.ok(origin); [x, y] = origin; }
    points.push([x, y]);
  }
  return points;
}

export function assertPetroleGazoleFluxConnections(svg, figure) {
  const { root, nodes } = inspectPetroleGazoleFluxSvg(svg);
  const prefix = petroleGazoleFluxAttrs(root)['aria-labelledby'].split(' ')[0].slice(0, -6);
  const arrows = nodes.filter(n => ['line', 'path'].includes(petroleGazoleFluxTag(n)) && petroleGazoleFluxAttrs(n)['marker-end']);
  const suffixes = [[], [], [], ['physical-0-to-1', 'physical-1-to-2', 'futures-0-to-1']][figure - 1];
  assert.ok(suffixes);
  assert.deepEqual(arrows.map(n => petroleGazoleFluxAttrs(n).id), suffixes.map(name => `${prefix}-${name}`), 'All sourced transfers remain explicit and in order');
  for (const arrow of arrows) {
    const a = petroleGazoleFluxAttrs(arrow);
    assert.match(a.stroke, /^var\(--color-(?:signal|amber|accent|topic-blue)\)$/u);
    assert.ok(number(arrow, 'stroke-width') >= 2, 'Visible connection stroke');
    const color = a.stroke.slice(12, -1), markerId = `${prefix}-${color}-arrow`;
    assert.equal(a['marker-end'], `url(#${markerId})`);
    const marker = nodes.find(n => petroleGazoleFluxTag(n) === 'marker' && petroleGazoleFluxAttrs(n).id === markerId);
    assert.ok(marker);
    const head = petroleGazoleFluxNodes(marker).find(n => petroleGazoleFluxTag(n) === 'path');
    assert.equal(petroleGazoleFluxAttrs(head).stroke, a.stroke, 'Arrowhead retains visible semantic paint');
    assert.ok(number(head, 'stroke-width') >= 1);
    const points = petroleGazoleFluxTag(arrow) === 'line' ? [[number(arrow, 'x1'), number(arrow, 'y1')], [number(arrow, 'x2'), number(arrow, 'y2')]] : pathPoints(a.d);
    const samples = points.slice(1).flatMap((b, i) => Array.from({ length: 21 }, (_, k) => [points[i][0] + (b[0] - points[i][0]) * k / 20, points[i][1] + (b[1] - points[i][1]) * k / 20]));
    assert.ok(samples.length && samples.some(([x, y]) => Math.hypot(x - points[0][0], y - points[0][1]) > 4), 'Nonzero transfer route');
    for (const shape of nodes.slice(nodes.indexOf(arrow) + 1).filter(n => ['rect', 'circle'].includes(petroleGazoleFluxTag(n)) && petroleGazoleFluxAttrs(n).fill !== 'none')) {
      const covered = ([x, y]) => petroleGazoleFluxTag(shape) === 'circle' ? Math.hypot(x - number(shape, 'cx'), y - number(shape, 'cy')) < number(shape, 'r') - .5 : x > number(shape, 'x') + .5 && x < number(shape, 'x') + number(shape, 'width') - .5 && y > number(shape, 'y') + .5 && y < number(shape, 'y') + number(shape, 'height') - .5;
      assert.ok(!samples.some(covered), 'A later background cannot cover a connection');
    }
    assert.ok(number(arrow, 'x2') > number(arrow, 'x1') || number(arrow, 'y2') > number(arrow, 'y1'), 'The hypothetical stages progress forwards');
  }
  const find = name => { const n = nodes.find(n => petroleGazoleFluxAttrs(n).id === `${prefix}-${name}`); assert.ok(n, name); return n; };
  if (figure === 1) for(const name of ['add-land-water','add-water-total']) {
    const rail=find(name),a=petroleGazoleFluxAttrs(rail);
    assert.equal(a.stroke,'var(--color-muted)');assert.equal(a['stroke-dasharray'],'5 6');assert.equal(a['marker-end'],undefined,'Waterfall links add changes without implying cargo migration');
    assert.ok(number(rail,'x2')>number(rail,'x1'));assert.equal(number(rail,'y1'),number(rail,'y2'));
  }
  if (figure === 4) {
    const rail=find('futures-already-paid'),a=petroleGazoleFluxAttrs(rail);
    assert.equal(a.stroke,'var(--color-amber)');assert.equal(a['stroke-dasharray'],'5 6');assert.equal(a['marker-end'],undefined,'The closing stage is cumulative; no second variation payment');
    assert.ok(number(rail,'x2')>number(rail,'x1')||number(rail,'y2')>number(rail,'y1'));
  }
  const routeNames = [
    ['add-land-water','add-water-total'],
    ['brent-curve','diesel-curve'],
    ['us-2025-curve','us-2026-curve','padd1-2025-curve','padd1-2026-curve'],
    ['futures-already-paid'],
  ][figure-1];
  for(const name of routeNames){
    const route=find(name),a=petroleGazoleFluxAttrs(route);
    assert.match(a.stroke,/^var\(--color-(?:signal|amber|muted)\)$/u);assert.ok(number(route,'stroke-width')>=1);
    const pts=petroleGazoleFluxTag(route)==='line'?[[number(route,'x1'),number(route,'y1')],[number(route,'x2'),number(route,'y2')]]:pathPoints(a.d);
    const samples=pts.slice(1).flatMap((b,i)=>Array.from({length:21},(_,k)=>[pts[i][0]+(b[0]-pts[i][0])*k/20,pts[i][1]+(b[1]-pts[i][1])*k/20]));
    for(const shape of nodes.slice(nodes.indexOf(route)+1).filter(n=>petroleGazoleFluxTag(n)==='rect'&&petroleGazoleFluxAttrs(n).fill!=='none'))assert.ok(!samples.some(([x,y])=>x>number(shape,'x')+.5&&x<number(shape,'x')+number(shape,'width')-.5&&y>number(shape,'y')+.5&&y<number(shape,'y')+number(shape,'height')-.5),'A later background cannot cover a connection');
  }
  return true;
}

export function assertPetroleGazoleFluxGeometry(svg) {
  const { root, nodes } = inspectPetroleGazoleFluxSvg(svg), [,, width, height] = petroleGazoleFluxAttrs(root).viewBox.split(' ').map(Number);
  const labelBoxes = [];
  const visible = node => petroleGazoleFluxTag(node) === 'defs' ? [] : [node, ...(node[petroleGazoleFluxTag(node)] ?? []).filter(child => petroleGazoleFluxTag(child) !== '#text').flatMap(visible)];
  const point = (x, y) => assert.ok(Number.isFinite(x) && Number.isFinite(y) && x >= 0 && y >= 0 && x <= width && y <= height, `Shape outside viewBox: ${x},${y}`);
  for (const node of visible(root)) {
    const a = petroleGazoleFluxAttrs(node), tag = petroleGazoleFluxTag(node);
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
  const panels = nodes.filter(node => petroleGazoleFluxTag(node) === 'circle' || petroleGazoleFluxTag(node) === 'rect' && [6, 8, 10, 12].includes(number(node, 'rx')));
  const contains = (a, b) => number(a, 'x') <= number(b, 'x') && number(a, 'y') <= number(b, 'y') && number(a, 'x') + number(a, 'width') >= number(b, 'x') + number(b, 'width') && number(a, 'y') + number(a, 'height') >= number(b, 'y') + number(b, 'height');
  const footer = nodes.filter(n => petroleGazoleFluxTag(n) === 'line' && number(n, 'x1') === 24 && number(n, 'x2') === width - 24 && number(n, 'y1') === number(n, 'y2')).sort((a, b) => number(b, 'y1') - number(a, 'y1'))[0];
  if (footer) for (const p of panels) assert.ok(number(p, 'y') + number(p, 'height') <= number(footer, 'y1') - 8, 'Panel retains space above the source footer');
  for (let i = 0; i < panels.length; i++) for (const b of panels.slice(i + 1)) {
    const a = panels[i]; if (contains(a, b) || contains(b, a)) continue; const overlapX = Math.min(number(a, 'x') + number(a, 'width'), number(b, 'x') + number(b, 'width')) - Math.max(number(a, 'x'), number(b, 'x'));
    const overlapY = Math.min(number(a, 'y') + number(a, 'height'), number(b, 'y') + number(b, 'height')) - Math.max(number(a, 'y'), number(b, 'y'));
    if (overlapX > 0) assert.ok(overlapY <= -4, 'Adjacent authored panels retain a visible gutter');
    if (overlapY > 0) assert.ok(overlapX <= -4, 'Adjacent authored panels retain a visible gutter');
  }
  for (const node of nodes.filter(node => petroleGazoleFluxTag(node) === 'text')) {
    const a = petroleGazoleFluxAttrs(node), size = Number(a['font-size']), font = fonts.get(Number(a['font-weight'])), label = petroleGazoleFluxText(node);
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
    const panel = a['data-panel'] ? nodes.find(panel => ['rect', 'circle'].includes(petroleGazoleFluxTag(panel)) && petroleGazoleFluxAttrs(panel).id === a['data-panel']) : panels.filter(panel => number(node, 'x') >= number(panel, 'x') && number(node, 'x') <= number(panel, 'x') + number(panel, 'width') && y >= number(panel, 'y') && y <= number(panel, 'y') + number(panel, 'height')).sort((a, b) => number(a, 'width') * number(a, 'height') - number(b, 'width') * number(b, 'height'))[0];
    if (a['data-panel']) assert.ok(panel, 'Authored containing panel exists');
    if (panel) assert.ok(box.x1 >= number(panel, 'x') + 2 && box.y1 >= number(panel, 'y') + 2 && box.x2 <= number(panel, 'x') + number(panel, 'width') - 2 && box.y2 <= number(panel, 'y') + number(panel, 'height') - 10, `Text outside internal panel: ${label}`);
    // Glyph outlines exclude unused ascent/descent. Chromium's getBBox()
    // includes those font extents and varies slightly with the screen scale.
    // Keep a conservative full em above the baseline and 0.3 em below it;
    // rendered browser QA separately checks every authored panel at all widths.
    if (panel) assert.ok(x >= number(panel, 'x') + 1 && y - size >= number(panel, 'y') + 1 && x + advance <= number(panel, 'x') + number(panel, 'width') - 1 && y + size * .3 <= number(panel, 'y') + number(panel, 'height') - 1, `Typographic extents outside internal panel: ${label}`);
  }
  const dataBars = nodes.filter(n => petroleGazoleFluxTag(n) === 'rect' && /-(?:land-change|water-change|total-change)$/u.test(petroleGazoleFluxAttrs(n).id ?? ''));
  for (const text of labelBoxes) for (const bar of dataBars) {
    if (text.panel === petroleGazoleFluxAttrs(bar).id) continue;
    const overlapX = Math.min(text.x2, number(bar,'x') + number(bar,'width')) - Math.max(text.x1,number(bar,'x'));
    const overlapY = Math.min(text.y2, number(bar,'y') + number(bar,'height')) - Math.max(text.y1,number(bar,'y'));
    assert.ok(overlapX <= 0 || overlapY <= 0, `Text overlaps a quantitative bar: ${text.label}`);
  }
  for (const label of labelBoxes) for (const shape of nodes.slice(nodes.indexOf(label.node) + 1).filter(n => petroleGazoleFluxTag(n) === 'rect' && petroleGazoleFluxAttrs(n).fill !== 'none')) {
    const dx = Math.min(label.x2, number(shape,'x') + number(shape,'width')) - Math.max(label.x1,number(shape,'x'));
    const dy = Math.min(label.y2, number(shape,'y') + number(shape,'height')) - Math.max(label.y1,number(shape,'y'));
    assert.ok(dx <= 1 || dy <= 1, `A later background cannot cover a label: ${label.label}`);
  }
  for (const b of labelBoxes) for (const circle of nodes.filter(n => petroleGazoleFluxTag(n) === 'circle')) {
    const a = petroleGazoleFluxAttrs(circle); if (b.panel === a.id) continue;
    const dx = number(circle, 'cx') - Math.max(b.x1, Math.min(number(circle, 'cx'), b.x2));
    const dy = number(circle, 'cy') - Math.max(b.y1, Math.min(number(circle, 'cy'), b.y2));
    assert.ok(Math.hypot(dx, dy) >= number(circle, 'r') + 1, `Text overlaps an unrelated node or badge: ${b.label}`);
  }
  for (let i = 0; i < labelBoxes.length; i++) for (let j = i + 1; j < labelBoxes.length; j++) {
    const a = labelBoxes[i], b = labelBoxes[j];
    assert.ok(!(Math.min(a.x2, b.x2) - Math.max(a.x1, b.x1) > 1 && Math.min(a.y2, b.y2) - Math.max(a.y1, b.y1) > 1), `Overlapping labels: ${a.label} / ${b.label}`);
  }
  for (const arrow of nodes.filter(n => petroleGazoleFluxTag(n) === 'line' && petroleGazoleFluxAttrs(n)['marker-end'])) {
    const x1=number(arrow,'x1'),y1=number(arrow,'y1'),x2=number(arrow,'x2'),y2=number(arrow,'y2');
    for (const label of labelBoxes) for(let i=0;i<=50;i++) {
      const x=x1+(x2-x1)*i/50,y=y1+(y2-y1)*i/50;
      assert.ok(!(x>label.x1-1 && x<label.x2+1 && y>label.y1-1 && y<label.y2+1), `A transfer rail cannot cross a label: ${label.label}`);
    }
  }

  // Data curves and additive/cumulative rails also require clear text gutters.
  // Grid lines are excluded: their labels sit outside the plotted domain.
  for(const route of nodes.filter(n=>['line','path'].includes(petroleGazoleFluxTag(n))&&/-(?:brent-curve|diesel-curve|(?:us|padd1)-202[56]-curve|add-land-water|add-water-total|futures-already-paid)$/u.test(petroleGazoleFluxAttrs(n).id??''))){
    const a=petroleGazoleFluxAttrs(route),pts=petroleGazoleFluxTag(route)==='line'?[[number(route,'x1'),number(route,'y1')],[number(route,'x2'),number(route,'y2')]]:pathPoints(a.d);
    for(let i=1;i<pts.length;i++)for(let k=0;k<=50;k++){
      const x=pts[i-1][0]+(pts[i][0]-pts[i-1][0])*k/50,y=pts[i-1][1]+(pts[i][1]-pts[i-1][1])*k/50;
      for(const b of labelBoxes)assert.ok(!(x>b.x1-1&&x<b.x2+1&&y>b.y1-1&&y<b.y2+1),`A data curve or rail cannot cross a label: ${b.label}`);
    }
  }
  return true;
}

export function assertPetroleGazoleFluxProportions(svg) {
  const { root, nodes } = inspectPetroleGazoleFluxSvg(svg), [,, width, height] = petroleGazoleFluxAttrs(root).viewBox.split(' ').map(Number), mobile = width === 600;
  assert.equal(width, mobile ? 600 : 1000);
  assert.ok(height / width <= (mobile ? 1.55 : .8), 'Artwork retains compact in-page proportions');
  assert.ok(nodes.filter(node => petroleGazoleFluxTag(node) === 'text').every(node => number(node, 'font-size') >= 28), 'Every label remains legible at the container breakpoint');
}

const near = (actual, expected) => assert.ok(Math.abs(Number(actual) - expected) <= .002, `${actual} != ${expected}`);
// Primary EIA observations independently cross-checked against the cited tables.
// Prices are published monthly averages; inventories remain integer thousand barrels.
export const PETROLE_GAZOLE_MONTHLY_INPUTS = Object.freeze([[66.6, 2.258], [70.89, 2.501], [103.13, 3.955], [117.29, 3.988], [107.14, 3.969], [85.4, 3.401], [83.76, 3.913], [91.08, 4.253], [114.16, 4.956]].map(Object.freeze));
export const PETROLE_GAZOLE_WEEKLY_INPUTS = Object.freeze([[[128938, 132015, 128945, 123951, 118480, 118615, 116564, 120472, 119154, 117595, 114783, 114362, 114626, 111082, 109231, 106878, 107815, 106708, 103553, 104132, 103408, 107638, 108884, 109398, 105332, 103622, 102797, 106970, 109901, 113536, 112971, 113685, 116028, 114242, 115923, 120638, 124684, 122999, 123577, 121559, 117030], [129273, 129244, 132592, 132921, 127368, 124665, 120099, 120351, 120780, 119431, 116904, 119936, 117825, 114681, 111559, 108132, 103638, 102344, 102534, 102906, 100799, 102301, 102101, 103052, 106116, 108599, 103619, 108175, 109570, 110632, 107159, 107149, 105619, 103391, 104187, 106274, 107859, 107431, 105180, 105138, 102611]], [[37233, 34995, 34808, 32252, 29902, 29964, 28505, 28765, 29377, 29202, 28259, 28278, 25884, 26078, 24697, 23698, 24554, 24254, 22608, 22617, 23559, 24126, 25547, 25146, 22903, 21544, 23325, 23602, 26155, 26481, 27594, 27353, 27781, 28876, 28734, 30255, 31267, 30414, 30707, 30187, 27688], [32906, 32161, 33787, 34486, 31287, 29141, 25973, 25617, 27538, 27324, 27564, 27448, 28052, 28300, 26861, 27032, 25893, 24553, 25767, 23965, 23659, 22200, 23097, 23516, 21395, 22996, 21340, 22627, 23893, 22150, 25155, 23868, 22215, 21003, 19318, 21701, 21583, 22174, 21920, 21687, 21513]]].map(region=>Object.freeze(region.map(Object.freeze))));
export function assertPetroleGazoleFluxQuantitative(svg, figure) {
  assertPetroleGazoleFluxConnections(svg, figure);
  const {root,nodes}=inspectPetroleGazoleFluxSvg(svg),width=Number(petroleGazoleFluxAttrs(root).viewBox.split(' ')[2]),mobile=width===600;
  const find=suffix=>{const n=nodes.find(n=>petroleGazoleFluxAttrs(n).id?.endsWith(suffix));assert.ok(n,`Required mark ${suffix}`);return n};
  const curve=(suffix,expected,color)=>{const node=find(suffix),a=petroleGazoleFluxAttrs(node),points=pathPoints(a.d);assert.equal(points.length,expected.length,'Every observed point is retained');assert.equal(a.stroke,`var(--color-${color})`);for(const[i,[x,y]]of points.entries()){near(x,expected[i][0]);near(y,expected[i][1])}return a};
  if(figure===1){
    const y0=mobile?350:300,scale=2.7,xs=mobile?[108,312,480]:[170,485,820],ws=mobile?[130,130,76]:[185,185,145];
    for(const[i,name]of ['land-change','water-change','total-change'].entries()){
      const bar=find('-'+name);near(number(bar,'x'),xs[i]);near(number(bar,'width'),ws[i]);near(number(bar,'height'),[113,103,10][i]*scale);near(number(bar,'y'),y0+(i===1?10:0)*scale);assert.equal(petroleGazoleFluxAttrs(bar).fill,`var(--color-${['amber','signal','paper'][i]})`);
    }
    near(number(find('-add-land-water'),'y1'),y0+113*scale);near(number(find('-add-water-total'),'y1'),y0+10*scale);
  }
  if(figure===2){
    const plot=mobile?{x:78,y:345,w:390,h:260}:{x:92,y:290,w:700,h:230},project=(i,n)=>[plot.x+i/8*plot.w,plot.y+plot.h-n/240*plot.h];
    for(const[name,col,color]of [['brent-curve',0,'signal'],['diesel-curve',1,'amber']]){
      const expected=PETROLE_GAZOLE_MONTHLY_INPUTS.map((r,i)=>project(i,r[col]*(col===1?42:1)));curve('-'+name,expected,color);
      for(const[i,[x,y]]of expected.entries()){const point=find(`-${name}-point-${i+1}`);near(number(point,'cx'),x);near(number(point,'cy'),y);assert.equal(petroleGazoleFluxAttrs(point).stroke,`var(--color-${color})`)}
    }
    const expected=[...PETROLE_GAZOLE_MONTHLY_INPUTS.map((r,i)=>project(i,r[1]*42)),...PETROLE_GAZOLE_MONTHLY_INPUTS.map((r,i)=>project(i,r[0])).toReversed()],band=find('-gross-gap-band'),points=pathPoints(petroleGazoleFluxAttrs(band).d);
    assert.equal(points.length,19);for(const[i,[x,y]]of points.entries()){const p=expected[i%18];near(x,p[0]);near(y,p[1])}assert.equal(petroleGazoleFluxAttrs(band).fill,'var(--color-surface-2)');assert.equal(petroleGazoleFluxAttrs(band).stroke,'none');
  }
  if(figure===3)for(const[k,region]of PETROLE_GAZOLE_WEEKLY_INPUTS.entries()){
    const x=mobile?85:105+k*500,y=mobile?(k?615:300):365,w=mobile?463:350,h=mobile?155:195,min=k?15:90,max=k?40:140;
    for(const[j,values]of region.entries()){
      const expected=values.map((n,i)=>[x+i/40*w,y+h-(n/1000-min)/(max-min)*h]),a=curve(`-${k?'padd1':'us'}-${2025+j}-curve`,expected,j?'signal':'muted');assert.equal(a['stroke-dasharray'],j?undefined:'6 6','2025 stays dashed and 2026 solid');
    }
  }
  if(figure===4){
    const labels=nodes.filter(n=>petroleGazoleFluxTag(n)==='text').map(petroleGazoleFluxText).join(' ');
    assert.match(labels,/120 − 20 = (?:100 M\$|\$100m)/u);assert.match(labels,/0 (?:avant frais|profit before costs)/u);
    for(let i=0;i<3;i++)for(const kind of ['physical','futures']){const panel=find(`-${kind}-${i}`);near(number(panel,'width'),mobile?kind==='physical'?224:216:276);}
    assert.ok(labels.includes('Déjà')||labels.includes('Already'),'Prior variation payments remain explicitly cumulative');
  }
  return true;
}

const projection = node => {
  if (node.nodeName === '#comment') return null;
  if (node.nodeName === '#text') return node.value.trim() ? { text: node.value } : null;
  return { tag: node.tagName ?? node.nodeName, attrs: Object.fromEntries((node.attrs ?? []).map(a => [a.name, a.value]).sort(([a], [b]) => a.localeCompare(b))), children: (node.childNodes ?? []).map(projection).filter(Boolean) };
};
export function assertPetroleGazoleFluxRenderedFaithful(svg, source, lang, index) {
  assertPetroleGazoleFluxSourceFaithful(source, lang, index);
  assertPetroleGazoleFluxGeometry(svg);
  assertPetroleGazoleFluxQuantitative(svg, Math.floor(index / 2) + 1);
  assert.deepEqual(projection(parseFragment(svg)), projection(parseFragment(source)), 'Astro preserves all native SVG attributes, text and element ordering');
}
