import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { transform } from '@astrojs/compiler-rs';
import { XMLParser, XMLValidator } from 'fast-xml-parser';
import opentype from '@shuding/opentype.js';
import { tag, attrs, nodes, content } from './nebius-credit-svg-assertions.mjs';
import { pathPoints } from './insurance-returns-svg-assertions.mjs';
import { assertFontLicenseReferences } from './font-license-assertions.mjs';

const component = readFileSync(new URL('../src/components/infographics/NvidiaChinaCredit2026.astro', import.meta.url), 'utf8');
const marker = 'const art = ', start = component.indexOf(marker), end = component.indexOf(' as const;', start);
assert.ok(start >= 0 && end > start);
const art = JSON.parse(component.slice(start + marker.length, end));
const scenes = ['fr', 'en'].flatMap(lang => ['funding', 'licensing'].flatMap(kind => ['desktop', 'mobile'].map(mode => ({ lang, kind, mode, svg: art[lang][kind][mode] }))));
const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '', preserveOrder: true, trimValues: false, parseTagValue: false });
const bytes = readFileSync(new URL('../public/fonts/ukraine-reparations/liberation-sans-400.ttf', import.meta.url));
const font = opentype.parse(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength));
const entities = Object.freeze({ '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#x27;': "'" });
const decode = value => value.replace(/&(?:amp|lt|gt|quot|#x27);/gu, entity => entities[entity]);
const allowed = {
  svg: 'xmlns width style viewBox role aria-labelledby xml:lang data-kind data-variant', title: 'id', desc: 'id',
  rect: 'x y width height rx fill stroke stroke-width data-count data-denominator data-category',
  circle: 'cx cy r fill stroke stroke-width',
  text: 'x y font-family font-size font-weight text-anchor fill data-zone data-metric data-value data-unit data-status data-decision data-escalation data-branch data-rate',
  path: 'd fill stroke stroke-width stroke-linecap stroke-linejoin stroke-dasharray data-relationship data-share data-crosssection data-status data-flow',
};
const numeric = new Set('x y width height rx cx cy r font-size font-weight stroke-width data-count data-denominator data-value data-share data-crosssection data-rate'.split(' '));
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
      assert.equal(at['font-family'], 'l0g Nvidia China Credit'); assert.equal(at['font-weight'], '400'); assert.ok(at['data-zone']);
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
  const width = mobile ? 320 : 800;
  return { header: box(12, 8, width - 12, 65), body: box(8, 68, width - 8, 392), metric: box(12, 61, width - 12, 85) };
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
function fundingIntegrity(svg) {
  const { all } = inspect(svg);
  const flows = all.filter(n => attrs(n)['data-share']).map(attrs);
  assert.deepEqual(flows.map(a => [a['data-flow'], +a['data-share'], +a['data-crosssection'], a['data-status']]), [
    ['bank-loans', 80, 64, 'target'], ['shareholder-funds', 20, 16, 'target'],
  ]);
  assert.equal(flows.reduce((sum, a) => sum + +a['data-share'], 0), 100);
  const total = flows.reduce((sum, a) => sum + +a['data-crosssection'], 0);
  for (const flow of flows) assert.equal(+flow['data-crosssection'] / total, +flow['data-share'] / 100);
  const mobile = attrs(all[0])['data-variant'] === 'mobile';
  for (const flow of flows) {
    const points = pathPoints(flow.d), terminal = points.filter(([x,y]) => mobile ? y === 236 : x === 500);
    assert.equal(terminal.length, 2);
    assert.equal(Math.abs(terminal[0][mobile ? 0 : 1] - terminal[1][mobile ? 0 : 1]), +flow['data-crosssection']);
  }
  const metric = all.filter(n => attrs(n)['data-metric'] === 'project-budget');
  assert.equal(metric.length, 1); assert.equal(attrs(metric[0])['data-value'], '2258930900'); assert.equal(attrs(metric[0])['data-unit'], 'CNY');
  const relationships = all.filter(n => attrs(n)['data-relationship']).map(n => attrs(n)['data-relationship']);
  for (const relationship of ['planned-funds-to-datacenter', 'datacenter-to-future-revenue', 'future-revenue-to-debt-service']) assert.ok(relationships.includes(relationship));
  for (const n of all.filter(n => ['datacenter-to-future-revenue', 'future-revenue-to-debt-service'].includes(attrs(n)['data-relationship']))) assert.equal(attrs(n)['stroke-dasharray'], '4 5');
  assert.equal(all.filter(n => attrs(n)['data-status'] === 'analytical-cycle').length, 1);
  assert.doesNotMatch(svg, /25 ?%|guarantee|garantie|disbursed|décaissé/iu);
}
function licensingIntegrity(svg) {
  const { all } = inspect(svg);
  const relationships = all.filter(n => attrs(n)['data-relationship']).map(n => attrs(n)['data-relationship']);
  assert.deepEqual(relationships, ['us-entry-to-import-duty', 'us-entry-to-license-checks', 'checks-to-license', 'license-to-authorized-end-use']);
  assert.equal(all.filter(n => attrs(n)['data-branch'] === 'import-duty' && attrs(n)['data-rate'] === '25').length, 1);
  assert.equal(all.filter(n => attrs(n)['data-branch'] === 'license').length, 1);
  const plain = all.filter(n => ['text', 'desc'].includes(tag(n))).map(content).join(' ');
  assert.match(plain, /H200/u); assert.match(plain, /États-Unis|United States/u); assert.match(plain, /éligibles|qualifying/iu);
  assert.match(plain, /exemptions/iu); assert.match(plain, /indépendants|independent/iu); assert.match(plain, /cas par cas|case by case|individual BIS/iu);
  assert.doesNotMatch(plain, /H100|automatic|automatique|25 ?%.*revenu/iu);
}

test('single-pass decoding does not recursively turn escaped markup into markup', () => {
  assert.equal(decode('&amp;lt;script&amp;gt;'), '&lt;script&gt;');
  assert.equal(decode('&amp;#x27;'), '&#x27;');
  assert.equal(decode('R&amp;D &lt;GPU&gt; &quot;value&quot; &#x27;x&#x27;'), 'R&D <GPU> "value" \'x\'');
});
test('controlled component compiles, retains the font license and registers once', () => {
  assert.deepEqual(transform(component, { filename: 'src/components/infographics/NvidiaChinaCredit2026.astro' }).diagnostics, []);
  assertFontLicenseReferences(readFileSync(new URL('../public/fonts/ukraine-reparations/LICENSE.txt', import.meta.url), 'utf8'), 'liberation');
  const registry = readFileSync(new URL('./svg-test-suites.mjs', import.meta.url), 'utf8');
  assert.equal(registry.split("'scripts/nvidia-china-credit-infographics.test.mjs'").length - 1, 1);
});
for (const s of scenes) {
  test(`${s.lang} ${s.kind} ${s.mode}: safe SVG, single-pass labels and bounded geometry`, () => {
    const { root, all } = inspect(s.svg); assert.equal(attrs(root)['xml:lang'], s.lang); assert.equal(attrs(root)['data-kind'], s.kind); assert.equal(attrs(root)['data-variant'], s.mode);
    geometry(s.svg); assert.doesNotMatch(s.svg, /—|ce que|ce qui|what .*reveals/iu);
    const rawLabels = [...s.svg.matchAll(/<text [^>]+>([^<]*)<\/text>/gu)].map(m => decode(m[1]));
    assert.deepEqual(rawLabels, all.filter(n => tag(n) === 'text').map(content));
  });
  test(`${s.lang} ${s.kind} ${s.mode}: source-backed mechanism and quantities`, () => {
    if (s.kind === 'funding') fundingIntegrity(s.svg); else licensingIntegrity(s.svg);
  });
  test(`${s.lang} ${s.kind} ${s.mode}: actual rendered typography and screen height`, () => {
    const { all } = inspect(s.svg);
    for (const actualWidth of s.mode === 'mobile' ? [280, 288] : [569, 600]) {
      const scale = actualWidth / (s.mode === 'mobile' ? 320 : 800);
      assert.ok(400 * scale <= (s.mode === 'mobile' ? 360 : 300));
      for (const n of all.filter(n => tag(n) === 'text')) {
        const pixels = +attrs(n)['font-size'] * scale;
        assert.ok(pixels >= 12 && pixels <= 18, `${content(n)}: ${pixels}px`);
      }
    }
  });
}
test('integrity and geometry checks reject distorted shares, invented budget and overflow', () => {
  const svg = art.fr.funding.desktop;
  assert.throws(() => fundingIntegrity(svg.replace('data-share="80"', 'data-share="81"')));
  assert.throws(() => fundingIntegrity(svg.replace('data-crosssection="64"', 'data-crosssection="60"')));
  assert.throws(() => fundingIntegrity(svg.replace('data-value="2258930900"', 'data-value="2250000000"')));
  assert.throws(() => geometry(svg.replace('x="24" y="32"', 'x="790" y="32"')));
  assert.throws(() => geometry(svg.replace('M622 206H660', 'M622 282H660')));
  assert.throws(() => licensingIntegrity(art.fr.licensing.desktop.replace('data-rate="25"', 'data-rate="15"')));
});
test('CSS delivers compact alternatives, semantic colours, regular typography and caption spacing', () => {
  for (const rule of [/max-width:37\.5rem/u, /max-width:18rem/u, /@container\(max-width:568px\)/u, /padding-bottom:1rem/u, /padding-bottom:\.35rem/u, /font-weight:400/u, /height:auto/u]) assert.match(component, rule);
  assert.match(component, /funding: \['S01'\], licensing: \['S06', 'S07'\]/u);
  assert.match(component, /<\/span>\{' '\}\{captions/u);
  assert.doesNotMatch(component, /#[0-9a-f]{3,8}\b/iu);
});
