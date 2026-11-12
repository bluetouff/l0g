import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { XMLParser, XMLValidator } from 'fast-xml-parser';
import opentype from '@shuding/opentype.js';
import { tag, attrs, nodes, content } from './nebius-credit-svg-assertions.mjs';
import { assertFontLicenseReferences } from './font-license-assertions.mjs';

const component = readFileSync(new URL('../src/components/NvidiaGovernanceFigure.astro', import.meta.url), 'utf8');
const declaration = 'const art = ';
const start = component.indexOf(declaration);
assert.ok(start >= 0, 'The controlled SVG collection is present');
const end = component.indexOf(' as const;', start);
assert.ok(end > start);
const art = JSON.parse(component.slice(start + declaration.length, end));
const scenes = ['fr', 'en'].flatMap(lang => ['control', 'finance', 'leverage'].flatMap(kind =>
  ['desktop', 'mobile'].map(mode => ({ lang, kind, mode, svg: art[lang][kind][mode] })),
));
const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '', preserveOrder: true, trimValues: false, parseTagValue: false });
const bytes = readFileSync(new URL('../public/fonts/ukraine-reparations/liberation-sans-400.ttf', import.meta.url));
const font = opentype.parse(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength));
const colors = /^(?:none|var\(--color-(?:ink|surface|surface-2|paper|muted|line-strong|signal|accent|amber)\))$/u;
const relationshipAttributes = 'data-relationship data-from data-to data-status';
const allowed = {
  svg: 'xmlns width style viewBox role aria-labelledby xml:lang data-kind data-variant',
  title: 'id',
  desc: 'id',
  rect: 'x y width height fill stroke stroke-width rx',
  text: 'x y fill font-family font-size font-weight text-anchor',
  line: `x1 y1 x2 y2 stroke stroke-width stroke-linecap stroke-dasharray ${relationshipAttributes}`,
  circle: 'cx cy r fill stroke stroke-width',
  path: `d fill stroke stroke-width stroke-linecap stroke-linejoin stroke-dasharray ${relationshipAttributes}`,
};
const numericAttributes = new Set('x y x1 x2 y1 y2 width height cx cy r rx font-size font-weight stroke-width'.split(' '));

function boundedNumber(value) {
  assert.match(value, /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/u);
  const number = Number(value);
  assert.ok(Number.isFinite(number) && Math.abs(number) <= 10000, 'Finite bounded SVG coordinate');
  return number;
}

// For these absolute paths the end points and Bézier control points form a
// conservative bound: the entire curve remains inside their convex hull.
function pathPoints(value) {
  assert.equal(typeof value, 'string');
  assert.ok(value.length > 0 && value.length < 10000);
  const tokens = [];
  const token = /[MLHVCQZ]|[+-]?(?:\d+(?:\.\d*)?|\.\d+)/uy;
  let offset = 0;
  while (offset < value.length) {
    if (/[\s,]/u.test(value[offset])) { offset++; continue; }
    token.lastIndex = offset;
    const match = token.exec(value);
    assert.ok(match, `Unsupported path geometry at ${value.slice(offset)}`);
    tokens.push(match[0]);
    offset = token.lastIndex;
  }
  assert.equal(tokens[0], 'M');
  assert.ok(tokens.length < 1024);
  const points = [];
  let x, y, origin, index = 0;
  const number = () => boundedNumber(tokens[index++]);
  while (index < tokens.length) {
    const command = tokens[index++];
    assert.match(command, /^[MLHVCQZ]$/u, 'Every command is explicit');
    if (command === 'Z') {
      assert.ok(origin);
      [x, y] = origin;
    } else if (command === 'H') x = number();
    else if (command === 'V') y = number();
    else {
      const pairs = command === 'C' ? 3 : command === 'Q' ? 2 : 1;
      for (let i = 0; i < pairs; i++) {
        x = number(); y = number();
        points.push([x, y]);
      }
      if (command === 'M') origin = [x, y];
    }
    assert.ok(Number.isFinite(x) && Number.isFinite(y));
    points.push([x, y]);
  }
  return points;
}

function inspect(svg) {
  assert.equal(typeof svg, 'string');
  assert.ok(svg.length > 100 && svg.length < 60000);
  assert.doesNotMatch(svg, /<!DOCTYPE|<!ENTITY|<!\[CDATA\[|<\?|\bon[a-z]+\s*=|\b(?:href|src)\s*=|url\(/iu);
  assert.equal(XMLValidator.validate(svg), true, 'Well-formed XML');
  const roots = parser.parse(svg);
  assert.equal(roots.length, 1);
  const root = roots[0], all = nodes(root), a = attrs(root);
  assert.equal(tag(root), 'svg');
  assert.equal(a.xmlns, 'http://www.w3.org/2000/svg');
  assert.equal(a.role, 'img');
  assert.equal(a.width, '100%');
  assert.equal(a.style, 'height:auto');
  assert.match(a.viewBox, /^0 0 [1-9]\d* [1-9]\d*$/u);
  assert.ok(['fr', 'en'].includes(a['xml:lang']));
  assert.ok(['control', 'finance', 'leverage'].includes(a['data-kind']));
  assert.ok(['desktop', 'mobile'].includes(a['data-variant']));
  const ids = all.map(n => attrs(n).id).filter(Boolean);
  assert.equal(ids.length, new Set(ids).size, 'IDs are unique inside each scene');
  const namedIds = a['aria-labelledby']?.split(/\s+/u);
  assert.equal(namedIds?.length, 2, 'Both title and description label the image');
  for (const [index, id] of namedIds.entries()) {
    assert.equal(all.filter(n => attrs(n).id === id && tag(n) === (index === 0 ? 'title' : 'desc') && content(n).trim()).length, 1);
  }
  for (const n of all) {
    const name = tag(n), at = attrs(n);
    assert.ok(Object.hasOwn(allowed, name), `Forbidden element ${name}`);
    for (const [key, value] of Object.entries(at)) {
      assert.ok(allowed[name].split(' ').includes(key), `Forbidden attribute ${name}.${key}`);
      assert.equal(typeof value, 'string');
      if (numericAttributes.has(key) && !(name === 'svg' && key === 'width')) boundedNumber(value);
      if (['fill', 'stroke'].includes(key)) assert.match(value, colors);
      if (key === 'd') pathPoints(value);
      if (key === 'stroke-dasharray') {
        const pattern = value.trim().split(/[\s,]+/u).map(boundedNumber);
        assert.ok(pattern.length >= 2 && pattern.every(v => v > 0));
      }
    }
    if (name === 'text') {
      assert.equal(at['font-family'], 'l0g Nvidia Investigation');
      assert.equal(at['font-weight'], '400');
      assert.ok(['start', 'middle', 'end'].includes(at['text-anchor']));
      assert.ok(Number(at['font-size']) > 0);
      assert.ok(content(n).trim(), 'No empty visible label');
      for (const character of content(n)) assert.notEqual(font.charToGlyphIndex(character), 0, `Missing licensed glyph ${character}`);
    }
    if (at['data-relationship']) {
      assert.ok(['path', 'line'].includes(name), 'A relationship has visible geometry');
      assert.ok(at['data-from'] && at['data-to'] && at['data-status']);
      assert.notEqual(at.stroke, 'none');
      assert.ok(Number(at['stroke-width']) > 0);
    }
  }
  return { root, all };
}

const contains = (outer, inner, padding = 0) =>
  inner.x1 >= outer.x1 + padding && inner.y1 >= outer.y1 + padding &&
  inner.x2 <= outer.x2 - padding && inner.y2 <= outer.y2 - padding;
function labelBox(n) {
  const a = attrs(n), size = Number(a['font-size']), value = content(n);
  const advance = font.getAdvanceWidth(value, size, { kerning: true });
  const x = Number(a.x) - (a['text-anchor'] === 'middle' ? advance / 2 : a['text-anchor'] === 'end' ? advance : 0);
  // Use the full font ascent/descent, including accents and descenders, rather
  // than only the black pixels of the particular phrase.
  return { value, x1: x, x2: x + advance, y1: Number(a.y) - font.ascender * size / font.unitsPerEm, y2: Number(a.y) - font.descender * size / font.unitsPerEm };
}

function geometryIssues(svg) {
  const { root, all } = inspect(svg), [,, width, height] = attrs(root).viewBox.split(' ').map(Number);
  const frame = { x1: 0, y1: 0, x2: width, y2: height }, issues = [];
  const scale = attrs(root)['data-variant'] === 'mobile' ? 280 / 400 : 640 / 800;
  const boxes = all.filter(n => tag(n) === 'text').map(labelBox);
  for (const box of boxes) if (!contains(frame, box, 2 / scale)) issues.push(`Label outside padded viewBox: ${box.value}`);
  for (const [index, a] of boxes.entries()) for (const b of boxes.slice(index + 1)) {
    if (Math.min(a.x2, b.x2) - Math.max(a.x1, b.x1) > 1 && Math.min(a.y2, b.y2) - Math.max(a.y1, b.y1) > 1) {
      issues.push(`Full-font label overlap: ${a.value} / ${b.value}`);
    }
  }
  for (const n of all) {
    const a = attrs(n), name = tag(n), halfStroke = a.stroke === 'none' ? 0 : Number(a['stroke-width'] ?? 0) / 2;
    let bounds;
    if (name === 'rect') {
      assert.ok(Number(a.width) >= 0 && Number(a.height) >= 0);
      bounds = { x1: Number(a.x), y1: Number(a.y), x2: Number(a.x) + Number(a.width), y2: Number(a.y) + Number(a.height) };
    }
    if (name === 'circle') {
      assert.ok(Number(a.r) >= 0);
      bounds = { x1: Number(a.cx) - Number(a.r), x2: Number(a.cx) + Number(a.r), y1: Number(a.cy) - Number(a.r), y2: Number(a.cy) + Number(a.r) };
    }
    if (bounds && !contains(frame, bounds, halfStroke)) issues.push(`${name} outside viewBox`);
    const points = name === 'path' ? pathPoints(a.d) : name === 'line' ? [[Number(a.x1), Number(a.y1)], [Number(a.x2), Number(a.y2)]] : [];
    for (const [x, y] of points) if (!contains(frame, { x1: x, x2: x, y1: y, y2: y }, halfStroke)) issues.push(`${name} outside viewBox: ${a.d ?? `${x},${y}`}`);
  }
  return [...new Set(issues)];
}

const relations = svg => inspect(svg).all.filter(n => attrs(n)['data-relationship']).map(attrs);
const visibleText = svg => inspect(svg).all.filter(n => tag(n) === 'text').map(content).join(' ');
function relation(routes, name, from, to) {
  const matches = routes.filter(a => a['data-relationship'] === name);
  assert.equal(matches.length, 1, `One ${name} route`);
  assert.equal(matches[0]['data-from'], from, `${name} origin`);
  assert.equal(matches[0]['data-to'], to, `${name} destination`);
  return matches[0];
}

test('twelve safe accessible scenes use unique IDs and locally licensed regular type', () => {
  assert.equal(scenes.length, 12);
  const ids = [];
  for (const scene of scenes) {
    const { root, all } = inspect(scene.svg);
    assert.equal(attrs(root)['xml:lang'], scene.lang);
    assert.equal(attrs(root)['data-kind'], scene.kind);
    assert.equal(attrs(root)['data-variant'], scene.mode);
    for (const n of all) if (attrs(n).id) ids.push(attrs(n).id);
    assert.doesNotMatch(scene.svg, /—|horloges|clocks/iu);
  }
  assert.equal(ids.length, new Set(ids).size, 'All twelve inline scenes can coexist without ID collisions');
  assertFontLicenseReferences(readFileSync(new URL('../public/fonts/ukraine-reparations/LICENSE.txt', import.meta.url), 'utf8'), 'liberation');
  assert.match(component, /@font-face\s*\{[^}]*liberation-sans-400\.ttf[^}]*font-weight:400/su);
});

for (const scene of scenes) test(`${scene.lang} ${scene.kind} ${scene.mode}: readable labels and bounded geometry`, () => {
  const { root, all } = inspect(scene.svg);
  const [,, width] = attrs(root).viewBox.split(' ').map(Number);
  assert.equal(width, scene.mode === 'mobile' ? 400 : 800);
  const renderedWidth = scene.mode === 'mobile' ? 280 : 640;
  for (const n of all.filter(n => tag(n) === 'text')) {
    assert.ok(Number(attrs(n)['font-size']) * renderedWidth / width >= 12, `Label below 12 rendered pixels: ${content(n)}`);
  }
  assert.deepEqual(geometryIssues(scene.svg), []);
});

test('corporate control, outside inquiry and employee compliance retain their separate directions', () => {
  for (const scene of scenes.filter(s => s.kind === 'control')) {
    const routes = relations(scene.svg);
    relation(routes, 'election', 'shareholders', 'board');
    relation(routes, 'appoint-remove', 'board', 'officer');
    relation(routes, 'independent-oversight', 'board', 'independent-directors');
    const inquiry = relation(routes, 'inquiry-mandate', 'independent-directors', 'outside-counsel');
    assert.match(inquiry['data-status'], /^announced-2026-11-10$/u);
    assert.equal(relation(routes, 'board-report', 'outside-counsel', 'board')['data-status'], 'reporting-process');
    relation(routes, 'employee-report', 'employee', 'compliance');
    relation(routes, 'case-handling', 'compliance', 'handling');
    assert.ok(routes.every(a => !/court|tribunal|judicial/iu.test(`${a['data-from']} ${a['data-to']} ${a['data-relationship']}`)), 'Compliance is not represented as a court route');
    const text = visibleText(scene.svg);
    assert.match(text, scene.lang === 'fr' ? /majorité.*(?:conseil|administrateurs)/iu : /majority/iu);
    assert.match(text, scene.lang === 'fr' ? /siège.*distinct/iu : /seat.*separate/iu);
  }
});

test('CoreWeave lending and debt service are separate from Nvidia sales, equity and conditional capacity purchases', () => {
  for (const scene of scenes.filter(s => s.kind === 'finance')) {
    const routes = relations(scene.svg);
    relation(routes, 'lending', 'lenders', 'operator');
    relation(routes, 'debt-service', 'operator', 'lenders');
    relation(routes, 'gpu-sale', 'nvidia', 'operator');
    relation(routes, 'equity', 'nvidia', 'operator');
    assert.equal(relation(routes, 'residual-capacity-purchase', 'nvidia', 'operator')['data-status'], 'signed-conditional');
    relation(routes, 'compute', 'operator', 'customers');
    relation(routes, 'usage-payment', 'customers', 'operator');
    assert.ok(!routes.some(a => a['data-from'] === 'nvidia' && a['data-to'] === 'lenders'), 'No Nvidia payment or guarantee to CoreWeave lenders');
    assert.ok(!routes.some(a => /guarant/iu.test(a['data-relationship'])), 'A conditional capacity contract is not a loan guarantee');
    assert.match(visibleText(scene.svg), /CoreWeave/u);
    assert.match(visibleText(scene.svg), scene.lang === 'fr' ? /capacité/iu : /capacity/iu);
    const description = content(inspect(scene.svg).all.find(n => tag(n) === 'desc'));
    assert.match(description, scene.lang === 'fr' ? /conditions.*capacité résiduelle/iu : /conditionally.*residual.*capacity/iu);
  }
});

test('signed obligations are solid and new decisions require a visibly distinct authorisation route', () => {
  for (const scene of scenes.filter(s => s.kind === 'finance')) {
    const routes = relations(scene.svg);
    const signed = relation(routes, 'signed-obligations', 'signed-contract', 'contract-performance');
    assert.equal(signed['data-status'], 'signed');
    assert.equal(signed['stroke-dasharray'], undefined);
    for (const route of [relation(routes, 'new-decision', 'proposal', 'authority-review'), relation(routes, 'new-authorisation', 'authority-review', 'new-commitment')]) {
      assert.equal(route['data-status'], 'prospective');
      assert.ok(route['stroke-dasharray'], 'Future decisions have a dashed route');
    }
  }
});

test('public licensing and equity remain distinct, with a dated passive Intel precedent and a dotted Nvidia scenario', () => {
  for (const scene of scenes.filter(s => s.kind === 'leverage')) {
    const routes = relations(scene.svg);
    relation(routes, 'regulatory-route', 'government', 'licensing');
    relation(routes, 'equity-route', 'government', 'equity-transaction');
    const intel = relation(routes, 'intel-precedent', 'equity-transaction', 'intel-2025');
    assert.equal(intel['data-status'], 'announced-2025-08-22');
    assert.equal(intel['stroke-dasharray'], undefined);
    const nvidia = relation(routes, 'nvidia-scenario', 'equity-transaction', 'nvidia-hypothesis');
    assert.equal(nvidia['data-status'], 'analytical-scenario');
    const dash = nvidia['stroke-dasharray']?.split(/[\s,]+/u).map(Number);
    assert.ok(dash && dash[0] < dash[1], 'The scenario route is visibly dotted');
    assert.ok(!routes.some(a => a['data-from'] === 'licensing' && /equity|nvidia/iu.test(a['data-to'])), 'A licence does not automatically create an equity transaction');
    const text = visibleText(scene.svg);
    assert.match(text, /Intel[^]*2025/u);
    assert.match(text, scene.lang === 'fr' ? /8,9\s*Md\$.*9,9\s*%/u : /\$8\.9bn.*9\.9\s*%/u);
    assert.match(text, /[Pp]assiv/u);
    assert.match(text, scene.lang === 'fr' ? /sans siège/u : /no board seat/u);
    assert.match(text, /[Ss]c[ée]nario/u);
    const description = content(inspect(scene.svg).all.find(n => tag(n) === 'desc'));
    assert.match(description, scene.lang === 'fr' ? /autorité.*fonds.*accord.*droits/u : /authority.*funds.*agreement.*rights/u);
  }
});

test('active markup, malformed geometry, heavy text and overflowing labels fail closed', () => {
  const svg = scenes[0].svg;
  for (const bad of [
    svg.replace('</svg>', '<script>alert(1)</script></svg>'),
    svg.replace('<svg ', '<svg onload="alert(1)" '),
    svg.replace('</svg>', '<image href="https://example.com/image.svg"/></svg>'),
    svg.replace('font-weight="400"', 'font-weight="700"'),
    svg.replace('<text ', '<text transform="translate(0 0)" '),
    svg.replace('aria-labelledby="', 'aria-labelledby="missing '),
  ]) assert.throws(() => inspect(bad));
  for (const path of ['M0 0L10 NaN', 'M0 0A1 1 0 0 0 2 2', 'M0 0Q1 2', 'M0 0H1e8']) assert.throws(() => pathPoints(path));
  assert.notDeepEqual(geometryIssues(svg.replace('<text x="24"', '<text x="9999"')), []);
  assert.notDeepEqual(geometryIssues(svg.replace(/<text\s+x="[^"]+"\s+y="[^"]+"/gu, '<text x="24" y="35"')), []);
});

test('responsive variants retain padding and only insert the validated static collection', () => {
  assert.match(component, /Object\.prototype\.hasOwnProperty\.call\(art\[lang\],\s*kind\)/u);
  assert.match(component, /set:html=\{scene\.desktop\}/u);
  assert.match(component, /set:html=\{scene\.mobile\}/u);
  assert.match(component, /@container\s*\(max-width:\s*500px\)/u);
  assert.match(component, /padding-bottom:\s*1rem/u);
  assert.doesNotMatch(component, /overflow\s*:\s*hidden|font-weight:\s*700|<script/iu);
});
