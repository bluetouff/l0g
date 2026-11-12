import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { transform } from '@astrojs/compiler-rs';
import { XMLParser, XMLValidator } from 'fast-xml-parser';
import opentype from '@shuding/opentype.js';
import { tag, attrs, nodes, content } from './nebius-credit-svg-assertions.mjs';
import { pathPoints } from './insurance-returns-svg-assertions.mjs';
import { assertFontLicenseReferences } from './font-license-assertions.mjs';

const component = readFileSync(new URL('../src/components/NvidiaAfterHuangFigure.astro', import.meta.url), 'utf8');
const marker = 'const art = ';
const start = component.indexOf(marker), end = component.indexOf(' as const;', start);
assert.ok(start >= 0 && end > start);
const art = JSON.parse(component.slice(start + marker.length, end));
const scenes = ['fr', 'en'].flatMap(lang => Object.entries(art[lang]).flatMap(([key, variants]) =>
  ['desktop', 'mobile'].map(mode => ({ lang, key, mode, svg: variants[mode] })),
));
const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '', preserveOrder: true, trimValues: false, parseTagValue: false });
const bytes = readFileSync(new URL('../public/fonts/ukraine-reparations/liberation-sans-400.ttf', import.meta.url));
const font = opentype.parse(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength));
const relationshipAttributes = 'data-relationship data-from data-to data-status';
const allowed = {
  svg: 'xmlns width style viewBox role aria-labelledby xml:lang data-kind data-variant data-sequence',
  title: 'id', desc: 'id',
  rect: 'x y width height rx fill stroke stroke-width data-share data-period',
  circle: 'cx cy r fill stroke stroke-width data-event data-status data-source data-role',
  text: 'x y fill font-family font-size font-weight text-anchor data-zone',
  line: `x1 y1 x2 y2 stroke stroke-width stroke-linecap ${relationshipAttributes}`,
  path: `d fill stroke stroke-width stroke-linecap stroke-linejoin stroke-dasharray ${relationshipAttributes}`,
};
const numeric = new Set('x y width height rx cx cy r x1 y1 x2 y2 font-size font-weight stroke-width data-share data-period'.split(' '));
const number = value => {
  assert.equal(typeof value, 'string');
  assert.match(value, /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/u);
  const n = Number(value); assert.ok(Number.isFinite(n) && Math.abs(n) <= 10000); return n;
};
function inspect(svg) {
  assert.equal(typeof svg, 'string'); assert.ok(svg.length > 100 && svg.length < 60000);
  assert.doesNotMatch(svg, /<!DOCTYPE|<!ENTITY|<!\[CDATA\[|<\?|\bon[a-z]+\s*=|\b(?:href|src)\s*=|url\(/iu);
  assert.equal(XMLValidator.validate(svg), true);
  const roots = parser.parse(svg); assert.equal(roots.length, 1);
  const root = roots[0], all = nodes(root), a = attrs(root);
  assert.equal(tag(root), 'svg'); assert.equal(a.xmlns, 'http://www.w3.org/2000/svg');
  assert.equal(a.width, '100%'); assert.equal(a.style, 'height:auto'); assert.equal(a.role, 'img');
  assert.match(a.viewBox, /^0 0 (?:800 (?:400|420)|400 460)$/u);
  assert.ok(['fr', 'en'].includes(a['xml:lang'])); assert.ok(['records', 'credit', 'power'].includes(a['data-kind']));
  assert.ok(['desktop', 'mobile'].includes(a['data-variant']));
  const ids = all.map(n => attrs(n).id).filter(Boolean); assert.equal(ids.length, new Set(ids).size);
  const names = a['aria-labelledby'].split(' '); assert.equal(names.length, 2);
  for (const [i, id] of names.entries()) assert.equal(all.filter(n => attrs(n).id === id && tag(n) === (i ? 'desc' : 'title') && content(n).trim()).length, 1);
  for (const n of all) {
    const name = tag(n), at = attrs(n); assert.ok(Object.hasOwn(allowed, name), `Forbidden element ${name}`);
    for (const [key, value] of Object.entries(at)) {
      assert.ok(allowed[name].split(' ').includes(key), `Forbidden attribute ${name}.${key}`);
      assert.equal(typeof value, 'string');
      if (numeric.has(key) && !(name === 'svg' && key === 'width')) number(value);
      if (['fill', 'stroke'].includes(key)) assert.match(value, /^(?:none|var\(--color-(?:surface|surface-2|paper|muted|line-strong|signal|accent|amber)\))$/u);
      if (key === 'd') pathPoints(value);
      if (key === 'stroke-dasharray') assert.ok(value.split(/\s+/u).map(number).every(n => n > 0));
    }
    if (name === 'text') {
      assert.equal(at['font-family'], 'l0g Nvidia After Huang'); assert.equal(at['font-weight'], '400');
      assert.ok(['start', 'middle', 'end'].includes(at['text-anchor'])); assert.ok(at['data-zone']);
      assert.ok(content(n).trim());
      for (const c of content(n)) assert.notEqual(font.charToGlyphIndex(c), 0, `Missing licensed glyph ${c}`);
    }
    if (at['data-relationship']) {
      assert.ok(['line', 'path'].includes(name)); assert.ok(at['data-from'] && at['data-to'] && at['data-status']);
    }
  }
  return { root, all };
}
const contains = (o, i, p = 0) => i.x1 >= o.x1 + p && i.y1 >= o.y1 + p && i.x2 <= o.x2 - p && i.y2 <= o.y2 - p;
const overlap = (a, b) => Math.min(a.x2, b.x2) - Math.max(a.x1, b.x1) > 1 && Math.min(a.y2, b.y2) - Math.max(a.y1, b.y1) > 1;
function textBox(n) {
  const a = attrs(n), size = Number(a['font-size']), value = content(n), advance = font.getAdvanceWidth(value, size, { kerning: true });
  const x = Number(a.x) - (a['text-anchor'] === 'middle' ? advance / 2 : a['text-anchor'] === 'end' ? advance : 0);
  return { value, x1: x, x2: x + advance, y1: Number(a.y) - font.ascender * size / font.unitsPerEm, y2: Number(a.y) - font.descender * size / font.unitsPerEm };
}
function segmentCrosses([x1, y1], [x2, y2], b) {
  let enter = 0, leave = 1;
  for (const [start, delta, low, high] of [[x1, x2 - x1, b.x1 - 1, b.x2 + 1], [y1, y2 - y1, b.y1 - 1, b.y2 + 1]]) {
    if (!delta) { if (start <= low || start >= high) return false; continue; }
    const a = (low - start) / delta, z = (high - start) / delta;
    enter = Math.max(enter, Math.min(a, z)); leave = Math.min(leave, Math.max(a, z)); if (enter >= leave) return false;
  }
  return enter < leave;
}
const box = (x1, y1, x2, y2) => ({ x1, y1, x2, y2 });
function zoneBounds(kind, mobile, sequence) {
  if (kind === 'records') {
    const count = sequence === '1' ? 6 : 8, cols = mobile ? 2 : 3;
    const ys = mobile ? (count <= 6 ? [90,230,370] : [80,180,280,380]) : (count <= 6 ? [145,300] : [116,226,336]);
    const zones = { header: mobile ? box(12,9,388,45) : box(16,10,784,73) };
    for (let i=0;i<count;i++) {
      const row=Math.floor(i/cols); let col=i%cols; if(row%2) col=cols-1-col;
      const x=(mobile?[28,228]:[130,400,670])[col], y=ys[row];
      zones[`number-${i+1}`]=box(x-12,y-12,x+12,y+12);
      zones[`date-${i+1}`]=mobile?box(x+22,y-12,col?386:196,y+12):box(x-112,y-44,x+112,y-12);
      zones[`label-${i+1}`]=mobile?box(18+col*200,y+13,198+col*200,y+60):box(x-112,y+14,x+112,y+62);
    }
    return zones;
  }
  if (kind === 'credit') return mobile ? {
    header: box(12, 9, 388, 68), shares: box(20, 105, 380, 140), horizons: box(18, 150, 382, 186), formula: box(18, 184, 382, 221),
    'funding-title': box(18, 236, 382, 268), funding: box(5, 270, 390, 416), 'funding-sources': box(260, 270, 380, 400), 'funding-note': box(18, 422, 382, 455),
  } : {
    header: box(16, 10, 784, 73), shares: box(40, 113, 760, 154), horizons: box(40, 165, 760, 207), formula: box(24, 202, 776, 237),
    'funding-title': box(24, 251, 776, 282), funding: box(24, 286, 776, 386), 'funding-sources': box(572, 272, 776, 382),
  };
  if (kind === 'power') return mobile ? {
    header: box(12, 9, 388, 45), control: box(16, 134, 384, 321), briefing: box(18, 61, 382, 95), 'capital-title': box(18, 336, 382, 367), capital: box(10, 400, 390, 440),
  } : {
    header: box(16, 10, 784, 73), control: box(24, 143, 776, 339), briefing: box(24, 78, 776, 113), 'capital-title': box(24, 350, 210, 395), capital: box(220, 380, 778, 410),
  };
  return {};
}
function geometry(svg) {
  const { root, all } = inspect(svg), a = attrs(root), [,, w, h] = a.viewBox.split(' ').map(Number), frame = box(0, 0, w, h), issues = [];
  const mobile = a['data-variant'] === 'mobile', scale = mobile ? 280 / 400 : 600 / 800;
  const labels = all.filter(n => tag(n) === 'text'), boxes = labels.map(textBox), zones = zoneBounds(a['data-kind'], mobile, a['data-sequence']);
  for (const [i, b] of boxes.entries()) {
    if (!contains(frame, b, 2 / scale)) issues.push(`ViewBox label: ${b.value}`);
    const zone = zones[attrs(labels[i])['data-zone']]; if (!zone || !contains(zone, b)) issues.push(`Internal zone: ${b.value}`);
  }
  for (let i = 0; i < boxes.length; i++) for (const b of boxes.slice(i + 1)) if (overlap(boxes[i], b)) issues.push(`Overlap: ${boxes[i].value} / ${b.value}`);
  for (const n of all) {
    const at = attrs(n), name = tag(n), half = at.stroke === 'none' ? 0 : Number(at['stroke-width'] ?? 0) / 2;
    let bounds, points;
    if (name === 'rect') bounds = box(+at.x, +at.y, +at.x + +at.width, +at.y + +at.height);
    if (name === 'circle') bounds = box(+at.cx - +at.r, +at.cy - +at.r, +at.cx + +at.r, +at.cy + +at.r);
    if (bounds && !contains(frame, bounds, half)) issues.push(`Shape outside viewBox: ${name}`);
    if (name === 'path') points = pathPoints(at.d);
    if (name === 'line') points = [[+at.x1, +at.y1], [+at.x2, +at.y2]];
    if (points) {
      if (points.some(([x, y]) => !contains(frame, box(x, y, x, y), half))) issues.push('Connector outside viewBox');
      if (at['data-relationship']) for (let i = 1; i < points.length; i++) for (const b of boxes) if (segmentCrosses(points[i - 1], points[i], b)) issues.push(`Relationship crosses label: ${b.value}`);
    }
  }
  return [...new Set(issues)];
}
const routes = svg => inspect(svg).all.filter(n => attrs(n)['data-relationship']).map(attrs);
const plain = svg => inspect(svg).all.filter(n => tag(n) === 'text').map(content).join(' ');

test('Astro component compiles with native chronology controls', () => {
  const result=transform(component,{filename:'src/components/NvidiaAfterHuangFigure.astro'});
  assert.deepEqual(result.diagnostics,[]);
});
test('controlled scenes are safe, accessible and use local regular type', () => {
  assert.equal(scenes.length, 20);
  const ids = [];
  for (const s of scenes) {
    const { root, all } = inspect(s.svg); assert.equal(attrs(root)['xml:lang'], s.lang); assert.equal(attrs(root)['data-variant'], s.mode);
    ids.push(...all.map(n => attrs(n).id).filter(Boolean)); assert.doesNotMatch(s.svg, /—|horloges|clocks/iu);
  }
  assert.equal(ids.length, new Set(ids).size);
  assertFontLicenseReferences(readFileSync(new URL('../public/fonts/ukraine-reparations/LICENSE.txt', import.meta.url), 'utf8'), 'liberation');
  assert.match(component, /@font-face\s*\{[^}]*liberation-sans-400\.ttf[^}]*font-weight:400/su);
});
for (const s of scenes) test(`${s.lang} ${s.key} ${s.mode}: compact, proportionate, internally bounded`, () => {
  const { root, all } = inspect(s.svg), [,, w, h] = attrs(root).viewBox.split(' ').map(Number), scale = s.mode === 'mobile' ? 280 / 400 : 600 / 800;
  assert.equal(w, s.mode === 'mobile' ? 400 : 800); assert.ok(h * scale <= (s.mode === 'mobile' ? 330 : 315));
  for (const n of all.filter(n => tag(n) === 'text')) {
    const px = +attrs(n)['font-size'] * scale; assert.ok(px >= 12 && px <= 18, `Proportionate type: ${content(n)}`);
  }
  assert.deepEqual(geometry(s.svg), []);
});
test('RPO shares retain their denominator, units and distinct payment timing', () => {
  for (const s of scenes.filter(s => s.key === 'credit')) {
    const { all } = inspect(s.svg), segments = all.filter(n => attrs(n)['data-share']).map(attrs);
    assert.deepEqual(segments.map(a => +a['data-share']), [36, 38, 26]);
    assert.equal(segments.reduce((sum, a) => sum + +a['data-share'], 0), 100);
    const full = segments.reduce((sum, a) => sum + +a.width, 0);
    for (const a of segments) assert.ok(Math.abs(+a.width / full * 100 - +a['data-share']) < 1e-7);
    const text = plain(s.svg); assert.match(text, /132[,.]3/u); assert.match(text, /RPO/u); assert.match(text, /100 - 36 - 38/u);
    assert.match(text, /1[– à]+24/u); assert.match(text, /25[– à]+48/u); assert.match(text, /49[– à]+86/u);
    const desc = content(all.find(n => tag(n) === 'desc'));
    assert.match(desc, s.lang === 'fr' ? /reconnaissance.*paiements.*contrats/iu : /revenue-recognition.*[Pp]ayment timing.*contracts/u);
    const rr = routes(s.svg); assert.equal(rr.filter(a => a['data-to'] === 'cash').length, 3); assert.equal(rr.filter(a => a['data-to'] === 'equipment').length, 1);
    assert.ok(!rr.some(a => /guarant/iu.test(a['data-relationship'])));
  }
});
test('board appointment, reported briefing and prospective equity have different evidential status', () => {
  for (const s of scenes.filter(s => s.key === 'power')) {
    const rr = routes(s.svg);
    const appointment = rr.find(a => a['data-relationship'] === 'interim-appointment');
    assert.equal(appointment['data-from'], 'board'); assert.equal(appointment['data-to'], 'interim-ceo'); assert.equal(appointment['stroke-dasharray'], undefined);
    const briefing = rr.find(a => a['data-relationship'] === 'reported-briefing');
    assert.equal(briefing['data-from'], 'board'); assert.equal(briefing['data-to'], 'white-house'); assert.equal(briefing['data-status'], 'reported-one-official'); assert.ok(briefing['stroke-dasharray']);
    const equity = rr.find(a => a['data-relationship'] === 'equity-scenario');
    assert.equal(equity['data-status'], 'analytical-scenario'); assert.equal(equity['stroke-dasharray'], '3 5');
    assert.ok(!rr.some(a => a['data-from'] === 'government' && a['data-to'] === 'interim-ceo'));
    assert.equal(rr.filter(a => a['data-relationship'] === 'transaction-condition').length, 3);
    assert.match(plain(s.svg), /Kress/u); assert.match(plain(s.svg), /CEO.*CFO/u); assert.match(plain(s.svg), /[Ss]c[ée]nario/u);
  }
});
test('unsafe SVG, heavy type, misleading percentages and internal overflow are rejected', () => {
  const svg = art.fr.credit.mobile;
  for (const bad of [svg.replace('</svg>', '<script>alert(1)</script></svg>'), svg.replace('<svg ', '<svg onload="alert(1)" '), svg.replace('</svg>', '<image href="https://example.com/a.svg"/></svg>'), svg.replace('font-weight="400"', 'font-weight="700"'), svg.replace('aria-labelledby="', 'aria-labelledby="missing ')]) assert.throws(() => inspect(bad));
  assert.notDeepEqual(geometry(svg.replace('<text x="18"', '<text x="9999"')), []);
  assert.notDeepEqual(geometry(svg.replace('y="31"', 'y="129"')), []);
});
test('chronology preserves 22 milestones, evidence status and source keys without causality', () => {
  const counts = {records1:6,records2:8,records3:8};
  for (const s of scenes.filter(s=>s.key.startsWith('records'))) {
    const {root,all}=inspect(s.svg), events=all.filter(n=>attrs(n)['data-event']).map(attrs);
    assert.equal(attrs(root)['data-sequence'],s.key.slice(-1));
    assert.equal(events.length,counts[s.key]);
    assert.deepEqual(events.map(a=>+a['data-event']),Array.from({length:counts[s.key]},(_,i)=>i+1));
    for(const e of events) { assert.match(e['data-source'],/^S\d{2}$/u); assert.ok(['reported','official','decision','requested','elapsed','future'].includes(e['data-status'])); }
    const rr=routes(s.svg);assert.equal(rr.length,counts[s.key]-1);
    assert.ok(rr.every(a=>a['data-relationship']==='chronology-order'&&a['data-status'].startsWith('editorial-order')));
    for(const [i,r] of rr.entries()){assert.equal(r['data-from'],`event-${i+1}`);assert.equal(r['data-to'],`event-${i+2}`);}
    if(s.key==='records1')assert.equal(rr.filter(a=>a['data-status']==='editorial-order-approximate').length,3);
  }
  assert.match(component,/type="radio"/u);assert.match(component,/<fieldset class="timeline-controls">/u);assert.match(component,/<legend class="visually-hidden">/u);
  assert.match(component,/aria-controls=/u);assert.match(component,/@supports selector\(:has\(\*\)\)/u);
  assert.match(component,/phase-control:focus-visible\+label/u);assert.match(component,/@media print\{[^}]*\}/u);
  assert.match(component,/trades.*August/u);assert.match(component,/Same-day ordering is unknown/u);
});
test('responsive shell keeps caption padding, local assets and controlled insertion', () => {
  assert.match(component,/^---\ninterface Props /u);
  assert.match(component, /max-width:37\.5rem/u); assert.match(component, /@container\s*\(max-width:500px\)/u);
  // Preserve the mobile type scale when the reading column grows beyond 280px.
  assert.match(component, /\.mobile-art\{[^}]*max-width:17\.5rem/u);
  assert.match(component, /padding-bottom:1rem/u); assert.match(component, /set:html=\{scene\.desktop\}/u); assert.match(component, /set:html=\{scene\.mobile\}/u);
  assert.doesNotMatch(component, /overflow\s*:\s*hidden|font-weight:\s*700|<script/iu);
  assert.match(component, /\['S09', 'S10'\]|"S09",\s*"S10"/u);
  assert.match(component, /href=\{`#source-\$\{id\}`\}/u);
});
