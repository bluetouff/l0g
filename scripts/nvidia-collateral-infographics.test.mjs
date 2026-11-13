import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { transform } from '@astrojs/compiler-rs';
import { XMLParser, XMLValidator } from 'fast-xml-parser';
import opentype from '@shuding/opentype.js';
import { tag, attrs, nodes, content } from './nebius-credit-svg-assertions.mjs';
import { pathPoints } from './insurance-returns-svg-assertions.mjs';
import { assertFontLicenseReferences } from './font-license-assertions.mjs';

const component = readFileSync(new URL('../src/components/infographics/NvidiaCollateral2026.astro', import.meta.url), 'utf8');
const marker = 'const art = ', start = component.indexOf(marker), end = component.indexOf(' as const;', start);
assert.ok(start >= 0 && end > start);
const art = JSON.parse(component.slice(start + marker.length, end));
const scenes = ['fr', 'en'].flatMap(lang => ['collateral', 'governance'].flatMap(kind => ['desktop', 'mobile'].map(mode => ({ lang, kind, mode, svg: art[lang][kind][mode] }))));
const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '', preserveOrder: true, trimValues: false, parseTagValue: false });
const bytes = readFileSync(new URL('../public/fonts/ukraine-reparations/liberation-sans-400.ttf', import.meta.url));
const font = opentype.parse(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength));
const entities = Object.freeze({ '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#x27;': "'" });
const decode = value => value.replace(/&(?:amp|lt|gt|quot|#x27);/gu, entity => entities[entity]);
const allowed = {
  svg: 'xmlns width style viewBox role aria-labelledby xml:lang data-kind data-variant', title: 'id', desc: 'id',
  rect: 'x y width height rx fill stroke stroke-width data-count data-denominator data-category',
  circle: 'cx cy r fill stroke stroke-width',
  text: 'x y font-family font-size font-weight text-anchor fill data-zone data-metric data-value data-unit data-status data-decision data-escalation',
  path: 'd fill stroke stroke-width stroke-linecap stroke-linejoin stroke-dasharray data-relationship',
};
const numeric = new Set('x y width height rx cx cy r font-size font-weight stroke-width data-count data-denominator data-value'.split(' '));
const number = value => { assert.match(value, /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/u); const result = Number(value); assert.ok(Number.isFinite(result)); return result; };
const box = (x1, y1, x2, y2) => ({ x1, y1, x2, y2 });
const contains = (outer, inner, margin = 0) => inner.x1 >= outer.x1 + margin && inner.y1 >= outer.y1 + margin && inner.x2 <= outer.x2 - margin && inner.y2 <= outer.y2 - margin;
const overlap = (a, b) => Math.min(a.x2, b.x2) - Math.max(a.x1, b.x1) > 1 && Math.min(a.y2, b.y2) - Math.max(a.y1, b.y1) > 1;
function inspect(svg) {
  assert.equal(XMLValidator.validate(svg), true);
  assert.doesNotMatch(svg, /<!DOCTYPE|<!ENTITY|<!\[CDATA\[|<\?|\bon[a-z]+\s*=|\b(?:href|src)\s*=|url\(/iu);
  const roots = parser.parse(svg); assert.equal(roots.length, 1);
  const root = roots[0], all = nodes(root), a = attrs(root);
  assert.equal(tag(root), 'svg'); assert.equal(a.xmlns, 'http://www.w3.org/2000/svg');
  assert.equal(a.width, '100%'); assert.equal(a.style, 'height:auto'); assert.equal(a.role, 'img');
  assert.match(a.viewBox, /^0 0 (?:800|320) 400$/u);
  const ids = all.map(n => attrs(n).id).filter(Boolean); assert.equal(ids.length, 2); assert.equal(new Set(ids).size, 2);
  for (const [i, id] of a['aria-labelledby'].split(' ').entries()) assert.equal(all.filter(n => attrs(n).id === id && tag(n) === (i ? 'desc' : 'title') && content(n).trim()).length, 1);
  for (const n of all) {
    const name = tag(n), at = attrs(n); assert.ok(Object.hasOwn(allowed, name), `Forbidden element ${name}`);
    for (const [key, value] of Object.entries(at)) {
      assert.ok(allowed[name].split(' ').includes(key), `Forbidden attribute ${name}.${key}`);
      assert.equal(typeof value, 'string');
      if (numeric.has(key) && !(name === 'svg' && key === 'width')) number(value);
      if (['fill', 'stroke'].includes(key)) assert.match(value, /^(?:none|var\(--color-(?:surface|paper|muted|line-strong|signal|amber)\))$/u);
      if (key === 'd') pathPoints(value);
      if (key === 'stroke-width') assert.ok([0, 1.1].includes(Number(value)));
    }
    if (name === 'text') {
      assert.equal(at['font-family'], 'l0g Nvidia Collateral'); assert.equal(at['font-weight'], '400'); assert.ok(at['data-zone']);
      assert.ok(['start', 'middle', 'end'].includes(at['text-anchor']));
      for (const c of content(n)) assert.notEqual(font.charToGlyphIndex(c), 0, `Missing glyph ${c}`);
    }
  }
  return { root, all };
}
function labelBox(n) {
  const a = attrs(n), size = Number(a['font-size']), value = content(n), advance = font.getAdvanceWidth(value, size, { kerning: true });
  const x = Number(a.x) - (a['text-anchor'] === 'middle' ? advance / 2 : a['text-anchor'] === 'end' ? advance : 0);
  return { value, x1: x, x2: x + advance, y1: Number(a.y) - font.ascender * size / font.unitsPerEm, y2: Number(a.y) - font.descender * size / font.unitsPerEm };
}
function zones(kind, mobile) {
  if (kind === 'collateral') return mobile ? {
    header: box(12, 8, 308, 57), bar: box(16, 74, 304, 103),
    'legend-dell': box(28, 111, 308, 130), 'legend-super': box(28, 134, 308, 153), 'legend-giga': box(28, 157, 308, 176),
    mechanism: box(8, 259, 312, 282), valuation: box(12, 290, 308, 341), loan: box(12, 351, 308, 377),
  } : {
    header: box(20, 9, 780, 64), metric: box(20, 72, 780, 98), bar: box(24, 113, 776, 150),
    'legend-dell': box(36, 160, 238, 187), 'legend-super': box(254, 160, 539, 187), 'legend-giga': box(555, 160, 783, 187),
    mechanism: box(14, 280, 786, 307), valuation: box(20, 324, 455, 380), loan: box(466, 351, 782, 380),
  };
  return mobile ? {
    header: box(12, 8, 308, 58), proposal: box(66, 76, 308, 101), committee: box(66, 123, 309, 187),
    vote: box(66, 211, 308, 254), publication: box(66, 278, 308, 322), appeal: box(12, 341, 308, 391),
  } : {
    header: box(20, 9, 780, 65), proposal: box(15, 164, 215, 217), committee: box(213, 164, 387, 217),
    vote: box(410, 164, 632, 217), publication: box(634, 164, 792, 217),
    members: box(20, 246, 780, 298), appeal: box(20, 311, 780, 381),
  };
}
function segmentCrosses([x1, y1], [x2, y2], b) {
  let enter = 0, leave = 1;
  for (const [start, delta, low, high] of [[x1, x2 - x1, b.x1 - 1, b.x2 + 1], [y1, y2 - y1, b.y1 - 1, b.y2 + 1]]) {
    if (!delta) { if (start <= low || start >= high) return false; continue; }
    const a = (low - start) / delta, z = (high - start) / delta;
    enter = Math.max(enter, Math.min(a, z)); leave = Math.min(leave, Math.max(a, z));
    if (enter >= leave) return false;
  }
  return enter < leave;
}
function geometry(svg) {
  const { root, all } = inspect(svg), a = attrs(root), [,, width, height] = a.viewBox.split(' ').map(Number);
  const frame = box(0, 0, width, height), labels = all.filter(n => tag(n) === 'text'), bounds = labels.map(labelBox), areas = zones(a['data-kind'], a['data-variant'] === 'mobile');
  for (const [i, b] of bounds.entries()) {
    const zone = areas[attrs(labels[i])['data-zone']]; assert.ok(zone, `Missing internal zone: ${b.value}`);
    assert.ok(contains(zone, b), `${b.value}: ${JSON.stringify(b)} outside ${JSON.stringify(zone)}`);
    assert.ok(contains(frame, b, 2));
  }
  for (let i = 0; i < bounds.length; i++) for (const b of bounds.slice(i + 1)) assert.ok(!overlap(bounds[i], b), `Overlapping labels: ${bounds[i].value} / ${b.value}`);
  for (const n of all) {
    const at = attrs(n), name = tag(n), margin = at.stroke === 'none' ? 0 : Number(at['stroke-width'] ?? 0) / 2;
    let b;
    if (name === 'rect') b = box(+at.x, +at.y, +at.x + +at.width, +at.y + +at.height);
    if (name === 'circle') b = box(+at.cx - +at.r, +at.cy - +at.r, +at.cx + +at.r, +at.cy + +at.r);
    if (b) assert.ok(contains(frame, b, margin), `Painted shape outside viewBox: ${name}`);
    if (name === 'path') {
      const points = pathPoints(at.d);
      for (const [x, y] of points) assert.ok(contains(frame, box(x, y, x, y), margin), 'Path outside viewBox');
      if (at['data-relationship']) for (let i = 1; i < points.length; i++) for (const label of bounds) assert.ok(!segmentCrosses(points[i - 1], points[i], label), `Connector crosses label: ${label.value}`);
    }
  }
}
function collateralIntegrity(svg) {
  const { all } = inspect(svg), segments = all.filter(n => attrs(n)['data-count']).map(attrs);
  assert.deepEqual(segments.map(a => [a['data-category'], +a['data-count']]), [['dell', 22], ['super', 52], ['giga', 119]]);
  assert.equal(segments.reduce((sum, a) => sum + +a['data-count'], 0), 193);
  const total = segments.reduce((sum, a) => sum + +a.width, 0);
  for (const a of segments) { assert.equal(a['data-denominator'], '193'); assert.ok(Math.abs(+a.width / total - +a['data-count'] / 193) < 1e-9); }
  for (let i = 1; i < segments.length; i++) assert.ok(Math.abs(+segments[i].x - (+segments[i - 1].x + +segments[i - 1].width)) < 1e-7);
  const value = all.filter(n => attrs(n)['data-metric'] === 'declared-asset-value'); assert.equal(value.length, 1);
  assert.equal(attrs(value[0])['data-value'], '485000000'); assert.equal(attrs(value[0])['data-unit'], 'CNY');
  assert.equal(all.filter(n => attrs(n)['data-status'] === 'unavailable').length, 1);
  assert.match(svg, /GPU (?:inconnus|unknown|ne sont pas identifiés)|GPUs are unidentified/u);
  assert.doesNotMatch(svg, /73 million/iu);
  assert.doesNotMatch(content(all.find(n => attrs(n)['data-status'] === 'unavailable')), /[0-9]/u);
}

test('single-pass decoding does not recursively turn escaped markup into markup', () => {
  assert.equal(decode('&amp;lt;script&amp;gt;'), '&lt;script&gt;');
  assert.equal(decode('&amp;#x27;'), '&#x27;');
  assert.equal(decode('R&amp;D &lt;GPU&gt; &quot;value&quot; &#x27;x&#x27;'), 'R&D <GPU> "value" \'x\'');
});
test('controlled component compiles, retains the font license and registers once', () => {
  assert.deepEqual(transform(component, { filename: 'src/components/infographics/NvidiaCollateral2026.astro' }).diagnostics, []);
  assertFontLicenseReferences(readFileSync(new URL('../public/fonts/ukraine-reparations/LICENSE.txt', import.meta.url), 'utf8'), 'liberation');
  const registry = readFileSync(new URL('./svg-test-suites.mjs', import.meta.url), 'utf8');
  assert.equal(registry.split("'scripts/nvidia-collateral-infographics.test.mjs'").length - 1, 1);
});
for (const s of scenes) {
  test(`${s.lang} ${s.kind} ${s.mode}: safe theme-aware SVG with bounded geometry`, () => {
    const { root, all } = inspect(s.svg); assert.equal(attrs(root)['xml:lang'], s.lang); assert.equal(attrs(root)['data-kind'], s.kind); assert.equal(attrs(root)['data-variant'], s.mode);
    geometry(s.svg); assert.doesNotMatch(s.svg, /—|ce que|ce qui|what .*reveals/iu);
    const rawLabels = [...s.svg.matchAll(/<text [^>]+>([^<]*)<\/text>/gu)].map(m => decode(m[1]));
    assert.deepEqual(rawLabels, all.filter(n => tag(n) === 'text').map(content));
    for (const actualWidth of s.mode === 'mobile' ? [280, 288] : [569, 600]) {
      const scale = actualWidth / (s.mode === 'mobile' ? 320 : 800);
      assert.ok(400 * scale <= (s.mode === 'mobile' ? 360 : 300));
      for (const n of all.filter(n => tag(n) === 'text')) { const pixels = +attrs(n)['font-size'] * scale; assert.ok(pixels >= 12 && pixels <= 18, `${content(n)}: ${pixels}px`); }
    }
  });
  if (s.kind === 'collateral') test(`${s.lang} ${s.mode}: areas encode server counts and separate asset value from debt`, () => collateralIntegrity(s.svg));
  else test(`${s.lang} ${s.mode}: proposal, committee, majority and publication remain ordered`, () => {
    const { all } = inspect(s.svg), relationships = all.filter(n => attrs(n)['data-relationship']).map(n => attrs(n)['data-relationship']);
    assert.deepEqual(relationships.slice(0, 3), ['proposal-to-erc', 'erc-to-majority-vote', 'decision-to-publication']);
    assert.equal(all.filter(n => attrs(n)['data-decision'] === 'addition-majority').length, 1);
    const plain = all.filter(n => ['text', 'desc'].includes(tag(n))).map(content).join(' ');
    for (const agency of ['Commerce', 'State', 'Defense', 'Energy', 'Treasury']) assert.ok(plain.includes(agency));
    assert.match(plain, /majoritaire|majority|Majority/u); assert.match(plain, /ACEP.*EARB/u); assert.doesNotMatch(plain, /USTR|unanim/u);
  });
}
test('integrity and geometry checks reject edited counts, distorted shares and overflow', () => {
  const svg = art.fr.collateral.desktop;
  assert.throws(() => collateralIntegrity(svg.replace('data-count="22"', 'data-count="23"')));
  assert.throws(() => collateralIntegrity(svg.replace('width="85.72020725"', 'width="90"')));
  assert.throws(() => geometry(svg.replace('x="24" y="32"', 'x="790" y="32"')));
  assert.throws(() => geometry(svg.replace('M130 249L360 249', 'M130 299L360 299')));
});
test('CSS delivers compact alternatives, semantic colours, regular typography and caption spacing', () => {
  for (const rule of [/max-width:37\.5rem/u, /max-width:18rem/u, /@container\(max-width:568px\)/u, /padding-bottom:1rem/u, /padding-bottom:\.35rem/u, /font-weight:400/u, /height:auto/u]) assert.match(component, rule);
  assert.match(component, /collateral: \['S01', 'S02', 'S03'\], governance: \['S07'\]/u);
  assert.doesNotMatch(component, /#[0-9a-f]{3,8}\b/iu);
});
