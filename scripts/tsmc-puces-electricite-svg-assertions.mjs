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
  "fr-0": "aa1a5c110f04882bda42365d9fdebe71e57236303f7f30a59e19650b410abfce",
  "fr-1": "40a743d2aa1d8cf284c757821c50a9d432a5a168174d6a7505d59ae9f8cc6401",
  "fr-2": "d6294b2d3eaa9797a126cacb265f0ba2a61e99d6741e458a35d2060aa72a05aa",
  "fr-3": "be40719fbc4293d1105ef2c51afdc506aca5d0de8537572b08dc1528765e0108",
  "fr-4": "ef1d85f350106112a64a3c12d8813d192f7a6c6d1208a7602b8172ff256709cc",
  "fr-5": "7addda147dff6be419d2116bbfe56dddda57363b15cb6b4f932e298126c6ce92",
  "fr-6": "e954b82f28e87fbeb85306262a3394c7eb29e5d444645df220458f4cf72210af",
  "fr-7": "456b6378bbe4b144e9f13c6283612b6c657147158425713d68c2de4e0df75cf2",
  "en-0": "f5e03e4f1d97b71bd2fd48c85f6bd482b446983a6e051e85708c821bb562a526",
  "en-1": "a1f98bff5daaa47fb5174403df76222342399632f6a34cae6b5ed434265bce7f",
  "en-2": "6e2ceef43cab16c4e468482e429a230aa0b22fe4bbbf3ff95c72110705da7e18",
  "en-3": "de43275c951997d84fb356daabded1bb41b722d06becb2234b9c3f889a69d5bc",
  "en-4": "28d129df6adfef17ed9c4ecf72d87f80b462b22279cac49e1c4fbb4c42f325de",
  "en-5": "59f40ddc995656b7d8b3c66e8ba13e5c9c03e4f49a72be1fb5072fd106024715",
  "en-6": "506399bf5ad1c8d373018dca90f30838374341bea89c2eb07cdb37301552dff5",
  "en-7": "519c796e3c7ea34d21cf4c98e54cd7b782ef5283908cf32e87a5367134f5da03"
};

const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '', preserveOrder: true, trimValues: false, parseTagValue: false });
export const tsmcPucesElectriciteTag = node => Object.keys(node).find(key => key !== ':@');
export const tsmcPucesElectriciteAttrs = node => node[':@'] ?? {};
export const tsmcPucesElectriciteNodes = node => [node, ...(node[tsmcPucesElectriciteTag(node)] ?? []).filter(child => tsmcPucesElectriciteTag(child) !== '#text').flatMap(tsmcPucesElectriciteNodes)];
export const tsmcPucesElectriciteText = node => (node[tsmcPucesElectriciteTag(node)] ?? []).map(child => tsmcPucesElectriciteTag(child) === '#text' ? child['#text'] : tsmcPucesElectriciteText(child)).join('');
const number = (node, key) => { const a = tsmcPucesElectriciteAttrs(node); return tsmcPucesElectriciteTag(node) === 'circle' && ['x', 'y', 'width', 'height'].includes(key) ? key === 'x' ? Number(a.cx) - Number(a.r) : key === 'y' ? Number(a.cy) - Number(a.r) : 2 * Number(a.r) : Number(a[key]); };
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
export const tsmcPucesElectriciteSourceFigures = article => [...article.matchAll(/<svg\b[\s\S]*?<\/svg>/gu)].map(match => match[0]);

export function inspectTsmcPucesElectriciteSvg(svg) {
  assert.equal(typeof svg, 'string');
  assert.ok(svg.length < 50000);
  assert.doesNotMatch(svg, /<!DOCTYPE|<!ENTITY|<!\[CDATA\[|<\?/iu);
  assert.doesNotMatch(svg, /\b(?:fontFamily|fontSize|fontWeight|textAnchor|strokeWidth|strokeDasharray|markerEnd)=/u, 'SVG presentation attributes use native names');
  assert.equal(XMLValidator.validate(svg), true);
  const roots = parser.parse(svg);
  assert.equal(roots.length, 1);
  const root = roots[0], nodes = tsmcPucesElectriciteNodes(root), a = tsmcPucesElectriciteAttrs(root);
  assert.equal(tsmcPucesElectriciteTag(root), 'svg');
  assert.equal(a.xmlns, 'http://www.w3.org/2000/svg');
  assert.equal(a.style, 'width:100%;height:auto');
  assert.equal(a.role, 'img');
  assert.match(a.viewBox, /^0 0 (?:600|1000) [0-9]+$/u);
  const ids = nodes.map(node => tsmcPucesElectriciteAttrs(node).id).filter(Boolean);
  assert.equal(ids.length, new Set(ids).size);
  for (const id of a['aria-labelledby'].split(' ')) assert.ok(nodes.some(node => tsmcPucesElectriciteAttrs(node).id === id && ['title', 'desc'].includes(tsmcPucesElectriciteTag(node)) && tsmcPucesElectriciteText(node).trim()));
  for (const node of nodes) {
    assert.ok(Object.hasOwn(allowed, tsmcPucesElectriciteTag(node)), `Forbidden SVG element: ${tsmcPucesElectriciteTag(node)}`);
    for (const [key, value] of Object.entries(tsmcPucesElectriciteAttrs(node))) {
      assert.ok(allowed[tsmcPucesElectriciteTag(node)].split(' ').includes(key), `Forbidden SVG attribute: ${key}`);
      if (key === 'href') {
        const label = tsmcPucesElectriciteText(node).trim().match(/^(S[0-9]{2})$/u)?.[1];
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

export function assertTsmcPucesElectriciteSourceFaithful(svg, lang, index) {
  inspectTsmcPucesElectriciteSvg(svg);
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

export function assertTsmcPucesElectriciteConnections(svg, figure) {
  const { root, nodes } = inspectTsmcPucesElectriciteSvg(svg);
  const prefix = tsmcPucesElectriciteAttrs(root)['aria-labelledby'].split(' ')[0].slice(0, -6);
  const arrows = nodes.filter(n => ['line', 'path'].includes(tsmcPucesElectriciteTag(n)) && tsmcPucesElectriciteAttrs(n)['marker-end']);
  const suffixes = [['circuits-to-gpu','gpu-to-cloud','cloud-to-service','declared-check','risk-to-tsmc','risk-to-supplier','grid-to-cloud'],['model-0-to-1','model-1-to-2'],['forecast-0-to-1','forecast-1-to-2'],['backlog-0-to-1','backlog-1-to-2']][figure-1];
  assert.ok(suffixes);
  assert.deepEqual(arrows.map(n => tsmcPucesElectriciteAttrs(n).id), suffixes.map(name => `${prefix}-${name}`), 'All sourced transfers remain explicit and in order');
  for (const arrow of arrows) {
    const a = tsmcPucesElectriciteAttrs(arrow);
    assert.match(a.stroke, /^var\(--color-(?:signal|amber|accent|topic-blue)\)$/u);
    assert.ok(number(arrow, 'stroke-width') >= 2, 'Visible connection stroke');
    const color = a.stroke.slice(12, -1), markerId = `${prefix}-${color}-arrow`;
    assert.equal(a['marker-end'], `url(#${markerId})`);
    const marker = nodes.find(n => tsmcPucesElectriciteTag(n) === 'marker' && tsmcPucesElectriciteAttrs(n).id === markerId);
    assert.ok(marker);
    const head = tsmcPucesElectriciteNodes(marker).find(n => tsmcPucesElectriciteTag(n) === 'path');
    assert.equal(tsmcPucesElectriciteAttrs(head).stroke, a.stroke, 'Arrowhead retains visible semantic paint');
    assert.ok(number(head, 'stroke-width') >= 1);
    const points = tsmcPucesElectriciteTag(arrow) === 'line' ? [[number(arrow, 'x1'), number(arrow, 'y1')], [number(arrow, 'x2'), number(arrow, 'y2')]] : pathPoints(a.d);
    const samples = points.slice(1).flatMap((b, i) => Array.from({ length: 21 }, (_, k) => [points[i][0] + (b[0] - points[i][0]) * k / 20, points[i][1] + (b[1] - points[i][1]) * k / 20]));
    assert.ok(samples.length && samples.some(([x, y]) => Math.hypot(x - points[0][0], y - points[0][1]) > 4), 'Nonzero transfer route');
    for (const shape of nodes.slice(nodes.indexOf(arrow) + 1).filter(n => ['rect', 'circle'].includes(tsmcPucesElectriciteTag(n)) && tsmcPucesElectriciteAttrs(n).fill !== 'none')) {
      const covered = ([x, y]) => tsmcPucesElectriciteTag(shape) === 'circle' ? Math.hypot(x - number(shape, 'cx'), y - number(shape, 'cy')) < number(shape, 'r') - .5 : x > number(shape, 'x') + .5 && x < number(shape, 'x') + number(shape, 'width') - .5 && y > number(shape, 'y') + .5 && y < number(shape, 'y') + number(shape, 'height') - .5;
      assert.ok(!samples.some(covered), 'A later background cannot cover a connection');
    }
    const pointsStart=points[0],pointsEnd=points.at(-1);
    const expectedColor=figure===1?a.id.endsWith('-declared-check')?'topic-blue':a.id.includes('-risk-')?'amber':'signal':figure===4?'amber':'signal';
    assert.equal(a.stroke,`var(--color-${expectedColor})`);
    assert.equal(a['stroke-dasharray'],figure===1?a.id.endsWith('-declared-check')?'7 6':a.id.includes('-risk-')?'5 6':undefined:figure===4?'5 6':undefined,'Physical supply, declared information and conditional risk keep distinct styles');
    if(figure>1)assert.ok(pointsEnd[0]>pointsStart[0],'The explanatory chain progresses left to right');
    if(figure===1){
      if(a.id.endsWith('-risk-to-tsmc')||a.id.endsWith('-declared-check'))assert.ok(pointsEnd[0]<pointsStart[0],'Information and conditional risk travel upstream');
      if(a.id.endsWith('-grid-to-cloud'))assert.ok(pointsEnd[1]<pointsStart[1],'Grid power supplies the cloud site');
      if(a.id.endsWith('-risk-to-supplier'))assert.ok(pointsEnd[1]<points.at(-2)[1],'Conditional risk returns to the supplier');
    }
  }
  return true;
}

export function assertTsmcPucesElectriciteGeometry(svg) {
  const { root, nodes } = inspectTsmcPucesElectriciteSvg(svg), [,, width, height] = tsmcPucesElectriciteAttrs(root).viewBox.split(' ').map(Number);
  const labelBoxes = [];
  const visible = node => tsmcPucesElectriciteTag(node) === 'defs' ? [] : [node, ...(node[tsmcPucesElectriciteTag(node)] ?? []).filter(child => tsmcPucesElectriciteTag(child) !== '#text').flatMap(visible)];
  const point = (x, y) => assert.ok(Number.isFinite(x) && Number.isFinite(y) && x >= 0 && y >= 0 && x <= width && y <= height, `Shape outside viewBox: ${x},${y}`);
  for (const node of visible(root)) {
    const a = tsmcPucesElectriciteAttrs(node), tag = tsmcPucesElectriciteTag(node);
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
  const panels = nodes.filter(node => tsmcPucesElectriciteTag(node) === 'circle' || tsmcPucesElectriciteTag(node) === 'rect' && [6, 8, 10, 12].includes(number(node, 'rx')));
  const contains = (a, b) => number(a, 'x') <= number(b, 'x') && number(a, 'y') <= number(b, 'y') && number(a, 'x') + number(a, 'width') >= number(b, 'x') + number(b, 'width') && number(a, 'y') + number(a, 'height') >= number(b, 'y') + number(b, 'height');
  const footer = nodes.filter(n => tsmcPucesElectriciteTag(n) === 'line' && number(n, 'x1') === 24 && number(n, 'x2') === width - 24 && number(n, 'y1') === number(n, 'y2')).sort((a, b) => number(b, 'y1') - number(a, 'y1'))[0];
  if (footer) for (const p of panels) assert.ok(number(p, 'y') + number(p, 'height') <= number(footer, 'y1') - 8, 'Panel retains space above the source footer');
  for (let i = 0; i < panels.length; i++) for (const b of panels.slice(i + 1)) {
    const a = panels[i]; if (contains(a, b) || contains(b, a)) continue; const overlapX = Math.min(number(a, 'x') + number(a, 'width'), number(b, 'x') + number(b, 'width')) - Math.max(number(a, 'x'), number(b, 'x'));
    const overlapY = Math.min(number(a, 'y') + number(a, 'height'), number(b, 'y') + number(b, 'height')) - Math.max(number(a, 'y'), number(b, 'y'));
    if (overlapX > 0) assert.ok(overlapY <= -4, 'Adjacent authored panels retain a visible gutter');
    if (overlapY > 0) assert.ok(overlapX <= -4, 'Adjacent authored panels retain a visible gutter');
  }
  for (const node of nodes.filter(node => tsmcPucesElectriciteTag(node) === 'text')) {
    const a = tsmcPucesElectriciteAttrs(node), size = Number(a['font-size']), font = fonts.get(Number(a['font-weight'])), label = tsmcPucesElectriciteText(node);
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
    const panel = a['data-panel'] ? nodes.find(panel => ['rect', 'circle'].includes(tsmcPucesElectriciteTag(panel)) && tsmcPucesElectriciteAttrs(panel).id === a['data-panel']) : panels.filter(panel => number(node, 'x') >= number(panel, 'x') && number(node, 'x') <= number(panel, 'x') + number(panel, 'width') && y >= number(panel, 'y') && y <= number(panel, 'y') + number(panel, 'height')).sort((a, b) => number(a, 'width') * number(a, 'height') - number(b, 'width') * number(b, 'height'))[0];
    if (a['data-panel']) assert.ok(panel, 'Authored containing panel exists');
    if (panel) assert.ok(box.x1 >= number(panel, 'x') + 2 && box.y1 >= number(panel, 'y') + 2 && box.x2 <= number(panel, 'x') + number(panel, 'width') - 2 && box.y2 <= number(panel, 'y') + number(panel, 'height') - 10, `Text outside internal panel: ${label}`);
    // Glyph outlines exclude unused ascent/descent. Chromium's getBBox()
    // includes those font extents and varies slightly with the screen scale.
    // Keep a conservative full em above the baseline and 0.3 em below it;
    // rendered browser QA separately checks every authored panel at all widths.
    if (panel) assert.ok(x >= number(panel, 'x') + 1 && y - size >= number(panel, 'y') + 1 && x + advance <= number(panel, 'x') + number(panel, 'width') - 1 && y + size * .3 <= number(panel, 'y') + number(panel, 'height') - 1, `Typographic extents outside internal panel: ${label}`);
  }
  const dataBars = nodes.filter(n => tsmcPucesElectriciteTag(n) === 'rect' && /-(?:estimate-2024|scenario-span|contract-ESA|contract-CLOA|eloa-included|eloa-excluded|active-power|contracted-power)$/u.test(tsmcPucesElectriciteAttrs(n).id ?? ''));
  for (const text of labelBoxes) for (const bar of dataBars) {
    if (text.panel === tsmcPucesElectriciteAttrs(bar).id) continue;
    const overlapX = Math.min(text.x2, number(bar,'x') + number(bar,'width')) - Math.max(text.x1,number(bar,'x'));
    const overlapY = Math.min(text.y2, number(bar,'y') + number(bar,'height')) - Math.max(text.y1,number(bar,'y'));
    assert.ok(overlapX <= 0 || overlapY <= 0, `Text overlaps a quantitative bar: ${text.label}`);
  }
  for (const label of labelBoxes) for (const shape of nodes.slice(nodes.indexOf(label.node) + 1).filter(n => tsmcPucesElectriciteTag(n) === 'rect' && tsmcPucesElectriciteAttrs(n).fill !== 'none')) {
    const dx = Math.min(label.x2, number(shape,'x') + number(shape,'width')) - Math.max(label.x1,number(shape,'x'));
    const dy = Math.min(label.y2, number(shape,'y') + number(shape,'height')) - Math.max(label.y1,number(shape,'y'));
    assert.ok(dx <= 1 || dy <= 1, `A later background cannot cover a label: ${label.label}`);
  }
  for (const b of labelBoxes) for (const circle of nodes.filter(n => tsmcPucesElectriciteTag(n) === 'circle')) {
    const a = tsmcPucesElectriciteAttrs(circle); if (b.panel === a.id) continue;
    const dx = number(circle, 'cx') - Math.max(b.x1, Math.min(number(circle, 'cx'), b.x2));
    const dy = number(circle, 'cy') - Math.max(b.y1, Math.min(number(circle, 'cy'), b.y2));
    assert.ok(Math.hypot(dx, dy) >= number(circle, 'r') + 1, `Text overlaps an unrelated node or badge: ${b.label}`);
  }
  for (let i = 0; i < labelBoxes.length; i++) for (let j = i + 1; j < labelBoxes.length; j++) {
    const a = labelBoxes[i], b = labelBoxes[j];
    assert.ok(!(Math.min(a.x2, b.x2) - Math.max(a.x1, b.x1) > 1 && Math.min(a.y2, b.y2) - Math.max(a.y1, b.y1) > 1), `Overlapping labels: ${a.label} / ${b.label}`);
  }
  for (const arrow of nodes.filter(n => tsmcPucesElectriciteTag(n) === 'line' && tsmcPucesElectriciteAttrs(n)['marker-end'])) {
    const x1=number(arrow,'x1'),y1=number(arrow,'y1'),x2=number(arrow,'x2'),y2=number(arrow,'y2');
    for (const label of labelBoxes) for(let i=0;i<=50;i++) {
      const x=x1+(x2-x1)*i/50,y=y1+(y2-y1)*i/50;
      assert.ok(!(x>label.x1-1 && x<label.x2+1 && y>label.y1-1 && y<label.y2+1), `A transfer rail cannot cross a label: ${label.label}`);
    }
  }

  // Multi-segment feedback arrows require the same clear text gutters as straight rails.
  for(const route of nodes.filter(n=>tsmcPucesElectriciteTag(n)==='path'&&tsmcPucesElectriciteAttrs(n)['marker-end'])){
    const pts=pathPoints(tsmcPucesElectriciteAttrs(route).d);
    for(let i=1;i<pts.length;i++)for(let k=0;k<=50;k++){
      const x=pts[i-1][0]+(pts[i][0]-pts[i-1][0])*k/50,y=pts[i-1][1]+(pts[i][1]-pts[i-1][1])*k/50;
      for(const b of labelBoxes)assert.ok(!(x>b.x1-1&&x<b.x2+1&&y>b.y1-1&&y<b.y2+1),`A feedback rail cannot cross a label: ${b.label}`);
    }
  }
  return true;
}

export function assertTsmcPucesElectriciteProportions(svg) {
  const { root, nodes } = inspectTsmcPucesElectriciteSvg(svg), [,, width, height] = tsmcPucesElectriciteAttrs(root).viewBox.split(' ').map(Number), mobile = width === 600;
  assert.equal(width, mobile ? 600 : 1000);
  assert.ok(height / width <= (mobile ? 1.55 : .8), 'Artwork retains compact in-page proportions');
  assert.ok(nodes.filter(node => tsmcPucesElectriciteTag(node) === 'text').every(node => number(node, 'font-size') >= 28), 'Every label remains legible at the container breakpoint');
}

const near = (actual, expected) => assert.ok(Math.abs(Number(actual) - expected) <= .002, `${actual} != ${expected}`);
// Inputs are the cited LBNL estimate/scenarios and the two companies' reported
// contractual metrics. They retain different scopes and dates rather than
// becoming an invented utilization ratio or delivered-demand forecast.
export function assertTsmcPucesElectriciteQuantitative(svg,figure){
  assertTsmcPucesElectriciteConnections(svg,figure);
  const {root,nodes}=inspectTsmcPucesElectriciteSvg(svg),mobile=Number(tsmcPucesElectriciteAttrs(root).viewBox.split(' ')[2])===600;
  const find=suffix=>{const n=nodes.find(n=>tsmcPucesElectriciteAttrs(n).id?.endsWith(suffix));assert.ok(n,`Required mark ${suffix}`);return n},labels=nodes.filter(n=>tsmcPucesElectriciteTag(n)==='text').map(tsmcPucesElectriciteText).join(' ');
  const axis=(x,y,width)=>assert.equal(nodes.filter(n=>tsmcPucesElectriciteTag(n)==='line'&&number(n,'x1')===x&&number(n,'x2')===x+width&&number(n,'y1')===y&&number(n,'y2')===y).length,1,'The quantitative axis retains its common zero and full linear scale');
  if(figure===1){assert.match(labels,/Si retard|Si le retard|If .*persist/u);assert.match(labels,/compatible/u);assert.match(labels,/TSMC/u);}
  if(figure===2){
    const x=mobile?90:240,w=mobile?450:700,scale=w/900,by=mobile?280:250,sy=mobile?454:386;
    axis(x,mobile?573:486,w);
    const estimate=find('-estimate-2024'),span=find('-scenario-span'),reference=find('-reference-2030');
    near(number(estimate,'x'),x);near(number(estimate,'y'),by);near(number(estimate,'width'),192*scale);near(number(estimate,'height'),34);
    near(number(span,'x'),x+521*scale);near(number(span,'y'),sy);near(number(span,'width'),(843-521)*scale);near(number(span,'height'),36);
    near(number(reference,'cx'),x+649*scale);near(number(reference,'cy'),sy+18);assert.equal(tsmcPucesElectriciteAttrs(estimate).fill,'var(--color-signal)');assert.equal(tsmcPucesElectriciteAttrs(span).fill,'var(--color-surface-2)');
    for(const value of ['192 TWh','649 TWh','521','843'])assert.ok(labels.includes(value));assert.match(labels,/non modélisées|not modeled/u);assert.match(labels,/IT × PUE/u);
  }
  if(figure===3){
    const x=mobile?24:260,scale=(mobile?552:650)/35000,ys=mobile?[270,365,460]:[250,350,450];
    axis(x,mobile?520:510,mobile?552:650);
    for(const[i,code]of ['ESA','CLOA'].entries()){const bar=find('-contract-'+code);near(number(bar,'x'),x);near(number(bar,'y'),ys[i]);near(number(bar,'width'),[11997,9356][i]*scale);near(number(bar,'height'),34);assert.equal(tsmcPucesElectriciteAttrs(bar).fill,'var(--color-topic-blue)');}
    const included=find('-eloa-included'),excluded=find('-eloa-excluded');near(number(included,'x'),x);near(number(included,'y'),ys[2]);near(number(included,'width'),13429*scale);near(number(excluded,'x'),x+13429*scale);near(number(excluded,'y'),ys[2]);near(number(excluded,'width'),19044*scale);near(number(included,'width')+number(excluded,'width'),32473*scale);
    assert.equal(tsmcPucesElectriciteAttrs(included).fill,'var(--color-signal)');assert.match(tsmcPucesElectriciteAttrs(excluded).fill,/^url\(#tsmc-[1-4]-(?:fr|en)-(?:m|d)-hatch\)$/u);
    assert.match(labels,/2032/u);assert.match(labels,/5 ans|5 years/u);assert.match(labels,/63 ?%/u);assert.match(labels,/Firm/u);
  }
  if(figure===4){
    const x=mobile?24:250,scale=(mobile?552:650)/4.5,ys=mobile?[270,370]:[250,350];
    axis(x,mobile?440:432,mobile?552:650);
    for(const[i,name]of ['active-power','contracted-power'].entries()){const bar=find('-'+name);near(number(bar,'x'),x);near(number(bar,'y'),ys[i]);near(number(bar,'width'),[1.5,3.7][i]*scale);near(number(bar,'height'),34);assert.equal(tsmcPucesElectriciteAttrs(bar).fill,`var(--color-${i?'surface-2':'signal'})`);}
    assert.match(labels,/~4[,.]2 GW/u);assert.match(labels,/~104/u);assert.match(labels,/non précisé|unspecified/u);
  }
  return true;
}

const projection = node => {
  if (node.nodeName === '#comment') return null;
  if (node.nodeName === '#text') return node.value.trim() ? { text: node.value } : null;
  return { tag: node.tagName ?? node.nodeName, attrs: Object.fromEntries((node.attrs ?? []).map(a => [a.name, a.value]).sort(([a], [b]) => a.localeCompare(b))), children: (node.childNodes ?? []).map(projection).filter(Boolean) };
};
export function assertTsmcPucesElectriciteRenderedFaithful(svg, source, lang, index) {
  assertTsmcPucesElectriciteSourceFaithful(source, lang, index);
  assertTsmcPucesElectriciteGeometry(svg);
  assertTsmcPucesElectriciteQuantitative(svg, Math.floor(index / 2) + 1);
  assert.deepEqual(projection(parseFragment(svg)), projection(parseFragment(source)), 'Astro preserves all native SVG attributes, text and element ordering');
}
