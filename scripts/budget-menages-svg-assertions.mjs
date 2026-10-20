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
  "fr-0": "c679f9d0abe16be5040a4cbaf58d927b6c32e3abeca874f26ef330f6d2012a2b",
  "fr-1": "53aee054b122a379b87d69fc119a8c71bf900053140c7687976b6db6112eddb6",
  "fr-2": "08577b69c75ced6e400af331d4931ed4ccf54c945ffc9006ebfbd1423b5cea01",
  "fr-3": "d1f1c1ae7f6efdd81fc82c4e202c7cc0136c84905ae5a097502bbe8d8ac4d041",
  "fr-4": "b5d54c45fa25e738f265c28bacf02815d99777e96c1b71e72bf53151826da936",
  "fr-5": "aa17f597f708c31cec2d2bf73efd0af67564588222c7311f231a40318a58a123",
  "fr-6": "db415fea73d9c9b771a0e1eef5b0a135a3d5233a75f9a7ebf216a7706444456e",
  "fr-7": "b8c97f46cba438057a7f007f7aecb8740c651219eb2798d976adbfafa3dcebe2",
  "fr-8": "82c52e5e0ca86d02724d0455e795c74e4aba323d3d40c46d52795475c2735b18",
  "fr-9": "6196fa38306f84aedae0bc76cec073a8abe42d58a9b043bde5721479311a307c",
  "en-0": "3cc78457e09ffdbaaa349f14f2dd5c6b5756386a0dc0a964143c7192fa1f34dc",
  "en-1": "b2bea66fa9416ef91cf6d56b76a7af6495f15dc9a0c595a3ea228b1a7ab590b0",
  "en-2": "fb11309bb8f636601bb18abe7eee5541a18cb4fbb1ba2115080fe7839a33846e",
  "en-3": "f55bc7d739d1d55f3be5b4017cfc685a7d4fb9a234afa6b82cd7a2aa81d7c798",
  "en-4": "f838af6151a9ac8282be9248e3636e730f3e950e58d1e92f2a245397a75c03a2",
  "en-5": "5aa1ddbac41aaafef838ea47573bc6cbd64977fcecfedc25aa8f8726a560f1fe",
  "en-6": "40539bc35f565dd50be9af5f21b42b1ff51bbd11b9a15d83b206fa7156a97315",
  "en-7": "f9f9b0d590a36678e65b914ba8481b047aa2ebd1e455513b2ed6e9d69909d1d6",
  "en-8": "9fc6e4b2819e52050501d62e81b8653d32605a77d67d8d6042fd0aa40433555a",
  "en-9": "dd108dacb5c03e7ee715618965ff9198ad93669d195bea85f87e782cc189b4ef"
};

const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '', preserveOrder: true, trimValues: false, parseTagValue: false });
export const budgetMenagesTag = node => Object.keys(node).find(key => key !== ':@');
export const budgetMenagesAttrs = node => node[':@'] ?? {};
export const budgetMenagesNodes = node => [node, ...(node[budgetMenagesTag(node)] ?? []).filter(child => budgetMenagesTag(child) !== '#text').flatMap(budgetMenagesNodes)];
export const budgetMenagesText = node => (node[budgetMenagesTag(node)] ?? []).map(child => budgetMenagesTag(child) === '#text' ? child['#text'] : budgetMenagesText(child)).join('');
const number = (node, key) => { const a = budgetMenagesAttrs(node); return budgetMenagesTag(node) === 'circle' && ['x', 'y', 'width', 'height'].includes(key) ? key === 'x' ? Number(a.cx) - Number(a.r) : key === 'y' ? Number(a.cy) - Number(a.r) : 2 * Number(a.r) : Number(a[key]); };
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
export const budgetMenagesSourceFigures = article => [...article.matchAll(/<svg\b[\s\S]*?<\/svg>/gu)].map(match => match[0]);

export function inspectBudgetMenagesSvg(svg) {
  assert.equal(typeof svg, 'string');
  assert.ok(svg.length < 50000);
  assert.doesNotMatch(svg, /<!DOCTYPE|<!ENTITY|<!\[CDATA\[|<\?/iu);
  assert.doesNotMatch(svg, /\b(?:fontFamily|fontSize|fontWeight|textAnchor|strokeWidth|strokeDasharray|markerEnd)=/u, 'SVG presentation attributes use native names');
  assert.equal(XMLValidator.validate(svg), true);
  const roots = parser.parse(svg);
  assert.equal(roots.length, 1);
  const root = roots[0], nodes = budgetMenagesNodes(root), a = budgetMenagesAttrs(root);
  assert.equal(budgetMenagesTag(root), 'svg');
  assert.equal(a.xmlns, 'http://www.w3.org/2000/svg');
  assert.equal(a.style, 'width:100%;height:auto');
  assert.equal(a.role, 'img');
  assert.match(a.viewBox, /^0 0 (?:480|600|1000) [0-9]+$/u);
  const ids = nodes.map(node => budgetMenagesAttrs(node).id).filter(Boolean);
  assert.equal(ids.length, new Set(ids).size);
  for (const id of a['aria-labelledby'].split(' ')) assert.ok(nodes.some(node => budgetMenagesAttrs(node).id === id && ['title', 'desc'].includes(budgetMenagesTag(node)) && budgetMenagesText(node).trim()));
  for (const node of nodes) {
    assert.ok(Object.hasOwn(allowed, budgetMenagesTag(node)), `Forbidden SVG element: ${budgetMenagesTag(node)}`);
    for (const [key, value] of Object.entries(budgetMenagesAttrs(node))) {
      assert.ok(allowed[budgetMenagesTag(node)].split(' ').includes(key), `Forbidden SVG attribute: ${key}`);
      if (key === 'href') {
        const label = budgetMenagesText(node).trim().match(/^(S[0-9]{2})$/u)?.[1];
        assert.ok(label && Number(label.slice(1)) >= 1 && Number(label.slice(1)) <= 18);
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

export function assertBudgetMenagesSourceFaithful(svg, lang, index) {
  inspectBudgetMenagesSvg(svg);
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

export function assertBudgetMenagesConnections(svg, figure) {
  const { nodes } = inspectBudgetMenagesSvg(svg);
  const arrows = nodes.filter(n => ['line', 'path'].includes(budgetMenagesTag(n)) && budgetMenagesAttrs(n)['marker-end']);
  assert.equal(arrows.length, [0, 0, 0, 12, 2][figure - 1], 'Every macroeconomic feedback and debt transmission remains drawn');
  const joins = figure === 5 ? nodes.filter(n => /-refinancing-rate$/u.test(budgetMenagesAttrs(n).id ?? '')) : [];
  if (figure === 5) assert.equal(joins.length, 1, 'Refinanced debt remains connected to the rate paid');
  for (const arrow of [...arrows, ...joins]) {
    const a = budgetMenagesAttrs(arrow);
    assert.match(a.stroke, /^var\(--color-(?:signal|amber)\)$/u);
    assert.ok(number(arrow, 'stroke-width') >= 2, 'Visible connection stroke');
    if (a['marker-end']) assert.match(a['marker-end'], a.stroke === 'var(--color-amber)' ? /-amber-arrow\)$/u : /(?<!amber-)arrow\)$/u);
    const points = budgetMenagesTag(arrow) === 'line' ? [[number(arrow, 'x1'), number(arrow, 'y1')], [number(arrow, 'x2'), number(arrow, 'y2')]] : pathPoints(a.d);
    const samples = points.slice(1).flatMap((b, i) => Array.from({ length: 21 }, (_, k) => [points[i][0] + (b[0] - points[i][0]) * k / 20, points[i][1] + (b[1] - points[i][1]) * k / 20]));
    assert.ok(samples.length && samples.some(([x, y]) => Math.hypot(x - points[0][0], y - points[0][1]) > 4), 'Connection has a nonzero visible route');
    for (const shape of nodes.slice(nodes.indexOf(arrow) + 1).filter(n => ['rect', 'circle'].includes(budgetMenagesTag(n)) && budgetMenagesAttrs(n).fill !== 'none')) {
      const covered = ([x, y]) => budgetMenagesTag(shape) === 'circle' ? Math.hypot(x - number(shape, 'cx'), y - number(shape, 'cy')) < number(shape, 'r') - .5 : x > number(shape, 'x') + .5 && x < number(shape, 'x') + number(shape, 'width') - .5 && y > number(shape, 'y') + .5 && y < number(shape, 'y') + number(shape, 'height') - .5;
      assert.ok(!samples.some(covered), 'A later background cannot cover a connection');
    }
  }
  return true;
}

export function assertBudgetMenagesGeometry(svg) {
  const { root, nodes } = inspectBudgetMenagesSvg(svg), [,, width, height] = budgetMenagesAttrs(root).viewBox.split(' ').map(Number);
  const labelBoxes = [];
  const visible = node => budgetMenagesTag(node) === 'defs' ? [] : [node, ...(node[budgetMenagesTag(node)] ?? []).filter(child => budgetMenagesTag(child) !== '#text').flatMap(visible)];
  const point = (x, y) => assert.ok(Number.isFinite(x) && Number.isFinite(y) && x >= 0 && y >= 0 && x <= width && y <= height, `Shape outside viewBox: ${x},${y}`);
  for (const node of visible(root)) {
    const a = budgetMenagesAttrs(node), tag = budgetMenagesTag(node);
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
  const panels = nodes.filter(node => budgetMenagesTag(node) === 'circle' || budgetMenagesTag(node) === 'rect' && [6, 8, 10, 12].includes(number(node, 'rx')));
  const contains = (a, b) => number(a, 'x') <= number(b, 'x') && number(a, 'y') <= number(b, 'y') && number(a, 'x') + number(a, 'width') >= number(b, 'x') + number(b, 'width') && number(a, 'y') + number(a, 'height') >= number(b, 'y') + number(b, 'height');
  const footer = nodes.filter(n => budgetMenagesTag(n) === 'line' && number(n, 'x1') === 24 && number(n, 'x2') === width - 24 && number(n, 'y1') === number(n, 'y2')).sort((a, b) => number(b, 'y1') - number(a, 'y1'))[0];
  if (footer) for (const p of panels) assert.ok(number(p, 'y') + number(p, 'height') <= number(footer, 'y1') - 8, 'Panel retains space above the source footer');
  for (let i = 0; i < panels.length; i++) for (const b of panels.slice(i + 1)) {
    const a = panels[i]; if (contains(a, b) || contains(b, a)) continue; const overlapX = Math.min(number(a, 'x') + number(a, 'width'), number(b, 'x') + number(b, 'width')) - Math.max(number(a, 'x'), number(b, 'x'));
    const overlapY = Math.min(number(a, 'y') + number(a, 'height'), number(b, 'y') + number(b, 'height')) - Math.max(number(a, 'y'), number(b, 'y'));
    if (overlapX > 0) assert.ok(overlapY <= -4, 'Adjacent authored panels retain a visible gutter');
    if (overlapY > 0) assert.ok(overlapX <= -4, 'Adjacent authored panels retain a visible gutter');
  }
  for (const node of nodes.filter(node => budgetMenagesTag(node) === 'text')) {
    const a = budgetMenagesAttrs(node), size = Number(a['font-size']), font = fonts.get(Number(a['font-weight'])), label = budgetMenagesText(node);
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
    const panel = a['data-panel'] ? panels.find(panel => budgetMenagesAttrs(panel).id === a['data-panel']) : panels.filter(panel => number(node, 'x') >= number(panel, 'x') && number(node, 'x') <= number(panel, 'x') + number(panel, 'width') && y >= number(panel, 'y') && y <= number(panel, 'y') + number(panel, 'height')).sort((a, b) => number(a, 'width') * number(a, 'height') - number(b, 'width') * number(b, 'height'))[0];
    if (a['data-panel']) assert.ok(panel, 'Authored containing panel exists');
    if (panel) assert.ok(box.x1 >= number(panel, 'x') + 2 && box.y1 >= number(panel, 'y') + 2 && box.x2 <= number(panel, 'x') + number(panel, 'width') - 2 && box.y2 <= number(panel, 'y') + number(panel, 'height') - 10, `Text outside internal panel: ${label}`);
    // Glyph outlines exclude unused ascent/descent. Chromium's getBBox()
    // includes those font extents and varies slightly with the screen scale.
    // Keep a conservative full em above the baseline and 0.3 em below it;
    // rendered browser QA separately checks every authored panel at all widths.
    if (panel) assert.ok(x >= number(panel, 'x') + 1 && y - size >= number(panel, 'y') + 1 && x + advance <= number(panel, 'x') + number(panel, 'width') - 1 && y + size * .3 <= number(panel, 'y') + number(panel, 'height') - 1, `Typographic extents outside internal panel: ${label}`);
  }
  const dataBars = nodes.filter(n => budgetMenagesTag(n) === 'rect' && /-(?:change_(?:eur|pct)|benefit-[0-9]|share-[0-9]|rate-202[78])/u.test(budgetMenagesAttrs(n).id ?? ''));
  for (const text of labelBoxes) for (const bar of dataBars) {
    const overlapX = Math.min(text.x2, number(bar,'x') + number(bar,'width')) - Math.max(text.x1,number(bar,'x'));
    const overlapY = Math.min(text.y2, number(bar,'y') + number(bar,'height')) - Math.max(text.y1,number(bar,'y'));
    assert.ok(overlapX <= 0 || overlapY <= 0, `Text overlaps a quantitative bar: ${text.label}`);
  }
  for (const b of labelBoxes) for (const circle of nodes.filter(n => budgetMenagesTag(n) === 'circle')) {
    const a = budgetMenagesAttrs(circle); if (b.panel === a.id) continue;
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

export function assertBudgetMenagesProportions(svg) {
  const { root, nodes } = inspectBudgetMenagesSvg(svg), [,, width, height] = budgetMenagesAttrs(root).viewBox.split(' ').map(Number), mobile = width !== 1000;
  assert.ok(height / width <= (mobile ? 1.56 : .8), 'Artwork retains compact in-page proportions');
  const minimum = Math.min(...nodes.filter(node => budgetMenagesTag(node) === 'text').map(node => number(node, 'font-size')));
  assert.ok(minimum >= (width === 600 ? 26 : mobile ? 22 : 26), 'Compactness must preserve legible typography');
}

const near = (actual, expected) => assert.ok(Math.abs(Number(actual) - expected) <= .002, `${actual} != ${expected}`);
const ventiles = [[-100,-.83],[-150,-.77],[-200,-.89],[-220,-.88],[-230,-.85],[-240,-.82],[-240,-.76],[-240,-.71],[-240,-.68],[-260,-.67],[-280,-.67],[-290,-.68],[-300,-.66],[-330,-.66],[-340,-.64],[-360,-.64],[-400,-.64],[-440,-.64],[-440,-.54],[-500,-.35]];
export function assertBudgetMenagesQuantitative(svg, figure) {
  assertBudgetMenagesConnections(svg, figure);
  const { root, nodes } = inspectBudgetMenagesSvg(svg), width = Number(budgetMenagesAttrs(root).viewBox.split(' ')[2]), mobile = width !== 1000;
  const find = suffix => { const n = nodes.find(n => budgetMenagesAttrs(n).id?.endsWith(suffix)); assert.ok(n, `Required data mark ${suffix}`); return n; };
  if (figure === 1) for (const [i, values] of ventiles.entries()) for (const [key, value, limit] of [['change_eur_per_household_year',values[0],600],['change_pct_standard_of_living',values[1],1]]) { const bar = find(`-${key}-${i+1}`); near(number(bar,'height'),Math.abs(value)/limit*(mobile?152:178)); const tip=(bar.rect ?? []).find(n => budgetMenagesTag(n)==='title'); assert.ok(tip && budgetMenagesText(tip).includes(String(i+1))); }
  if (figure === 2) {
    for (const [i, values] of [[723,965],[341,455],[81,323],[550,550]].entries()) for (const [j, value] of values.entries()) { const bar=find(`-benefit-${i}-${j}`); near(number(bar,'width'),value/1000*(mobile?336:500)); assert.equal(budgetMenagesAttrs(bar).fill,j?'none':'var(--color-signal)'); }
    for (const [start,months]of [[3,9],[9,3]]) { const line = find(`-calendar-${start}`); near(number(line,'x2')-number(line,'x1'),(mobile?216:606)*months/12); }
  }
  if (figure === 3) for (const [i,p]of [87,96,70,95,4].entries()) { near(number(find(`-share-${i}-lower`),'width'),(mobile?432:510)*p/100); near(number(find(`-share-${i}-upper`),'width'),(mobile?432:510)*(100-p)/100); }
  if (figure === 4) { for (const suffix of ['income','choices','spending','saving','output','imports','jobs','fiscal','debt','financing','investment']) assert.ok(find(`-${suffix}`)); assert.equal(nodes.filter(n=>budgetMenagesAttrs(n)['marker-end']).length,12); }
  if (figure === 5) for (const [year,value]of [[2027,3.4],[2028,8.1]]) near(number(find(`-rate-${year}`),'height'),(mobile?154:235)*value/10);
  return true;
}

const projection = node => {
  if (node.nodeName === '#comment') return null;
  if (node.nodeName === '#text') return node.value.trim() ? { text: node.value } : null;
  return { tag: node.tagName ?? node.nodeName, attrs: Object.fromEntries((node.attrs ?? []).map(a => [a.name, a.value]).sort(([a], [b]) => a.localeCompare(b))), children: (node.childNodes ?? []).map(projection).filter(Boolean) };
};
export function assertBudgetMenagesRenderedFaithful(svg, source, lang, index) {
  assertBudgetMenagesSourceFaithful(source, lang, index);
  assertBudgetMenagesGeometry(svg);
  assertBudgetMenagesQuantitative(svg, Math.floor(index / 2) + 1);
  assert.deepEqual(projection(parseFragment(svg)), projection(parseFragment(source)), 'Astro preserves all native SVG attributes, text and element ordering');
}
