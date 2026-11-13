import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { transform } from '@astrojs/compiler-rs';
import { XMLParser, XMLValidator } from 'fast-xml-parser';
import opentype from '@shuding/opentype.js';
import { tag, attrs, nodes, content } from './nebius-credit-svg-assertions.mjs';
import { pathPoints } from './insurance-returns-svg-assertions.mjs';
import { assertFontLicenseReferences } from './font-license-assertions.mjs';

const component = readFileSync(new URL('../src/components/NvidiaCongressFigure.astro', import.meta.url), 'utf8');
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
  circle: 'cx cy r fill stroke stroke-width data-event data-date data-status',
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
  assert.match(a.viewBox, /^0 0 (?:800 (?:400|420)|400 (?:440|460))$/u);
  assert.ok(['fr', 'en'].includes(a['xml:lang'])); assert.ok(['agenda', 'records'].includes(a['data-kind']));
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
      assert.equal(at['font-family'], 'l0g Nvidia Congress'); assert.equal(at['font-weight'], '400');
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
function zoneBounds(kind,mobile) {
  if(kind==='agenda')return mobile?{
    header:box(12,8,388,67),deadline:box(18,68,177,128),'deadline-result':box(234,70,388,162),channel:box(18,175,382,207),
    'huang-house':box(44,211,193,279),'teter-house':box(44,293,193,361),'kessler-house':box(44,375,193,444),
    'huang-banking':box(244,211,387,279),'lutnick-banking':box(244,375,387,444),
  }:{
    header:box(16,10,784,73),deadline:box(85,84,367,143),'deadline-result':box(446,80,778,158),dates:box(230,175,776,208),channel:box(99,223,220,380),
    'huang-house':box(218,248,342,320),'teter-house':box(348,248,472,320),'kessler-house':box(478,248,602,320),
    'huang-banking':box(478,355,602,408),'lutnick-banking':box(628,355,784,408),
  };
  if(kind==='records')return mobile?{
    header:box(12,8,388,67),commercial:box(18,153,180,207),legal:box(204,153,370,207),commerce:box(218,321,370,375),congress:box(18,351,170,403),
    reported:box(212,215,370,266),'request-label':box(135,315,238,348),method:box(18,406,382,436),
  }:{
    header:box(16,10,784,73),commercial:box(24,165,218,222),legal:box(288,165,512,222),commerce:box(572,165,784,222),
    reported:box(423,89,660,123),'inventory-label':box(130,285,349,318),'request-label':box(468,277,636,310),method:box(190,362,610,394),
  };
  return {};
}
function geometry(svg) {
  const { root, all } = inspect(svg), a = attrs(root), [,, w, h] = a.viewBox.split(' ').map(Number), frame = box(0, 0, w, h), issues = [];
  const mobile = a['data-variant'] === 'mobile', scale = mobile ? 280 / 400 : 600 / 800;
  const labels = all.filter(n => tag(n) === 'text'), boxes = labels.map(textBox), zones = zoneBounds(a['data-kind'], mobile);
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



test('controlled Astro component compiles and registers one source suite',()=>{
  assert.match(component,/^---\ninterface Props /u);assert.deepEqual(transform(component,{filename:'src/components/NvidiaCongressFigure.astro'}).diagnostics,[]);
  const registry=readFileSync(new URL('./svg-test-suites.mjs',import.meta.url),'utf8');assert.equal(registry.split("'scripts/nvidia-congress-infographics.test.mjs'").length-1,1);
});
test('eight safe accessible scenes use the licensed regular font',()=>{
  assert.equal(scenes.length,8);const ids=[];
  for(const s of scenes){const {root,all}=inspect(s.svg);assert.equal(attrs(root)['xml:lang'],s.lang);assert.equal(attrs(root)['data-kind'],s.key);assert.equal(attrs(root)['data-variant'],s.mode);ids.push(...all.map(n=>attrs(n).id).filter(Boolean));assert.doesNotMatch(s.svg,/—|horloges|clocks/iu);}
  assert.equal(ids.length,new Set(ids).size);assertFontLicenseReferences(readFileSync(new URL('../public/fonts/ukraine-reparations/LICENSE.txt',import.meta.url),'utf8'),'liberation');
  assert.match(component,/@font-face\s*\{[^}]*liberation-sans-400\.ttf[^}]*font-weight:400/su);
});
for(const s of scenes)test(`${s.lang} ${s.key} ${s.mode}: compact native dimensions and internal geometry`,()=>{
  const{root,all}=inspect(s.svg),[,,w,h]=attrs(root).viewBox.split(' ').map(Number),scale=s.mode==='mobile'?280/400:600/800;
  assert.equal(w,s.mode==='mobile'?400:800);assert.ok(h*scale>=250&&h*scale<=(s.mode==='mobile'?340:330));
  for(const n of all.filter(n=>tag(n)==='text')){const pixels=+attrs(n)['font-size']*scale;assert.ok(pixels>=12&&pixels<=18,`Actual font: ${content(n)}`);}
  assert.deepEqual(geometry(s.svg),[]);
});
test('five requested appointments retain their institutions, dates and acceptance scope',()=>{
  const expected=[['huang-house','2026-12-01','requested'],['teter-house','2026-12-02','requested'],['kessler-house','2026-12-03','requested'],['huang-banking','2026-12-03','requested'],['lutnick-banking','2026-12-10','requested-date-voluntary-participation']];
  for(const s of scenes.filter(s=>s.key==='agenda')){
    const {all}=inspect(s.svg),events=all.filter(n=>attrs(n)['data-event']).map(attrs);assert.equal(events.length,5);
    assert.deepEqual(events.map(a=>[a['data-event'],a['data-date'],a['data-status']]),expected);
    const rr=routes(s.svg);assert.equal(rr.length,2);assert.ok(rr.every(a=>a['data-from']==='huang-teter'));assert.equal(rr.find(a=>a['data-to']==='subpoena')['data-status'],'announced-if-no-confirmation');
    assert.match(plain(s.svg),s.lang==='fr'?/dates demandées/u:/requested dates/u);
    const desc=content(all.find(n=>tag(n)==='desc'));assert.match(desc,/2026/u);assert.match(desc,/EST/u);assert.match(desc,/UTC/u);assert.match(desc,/Paris/u);
  }
});
test('only Teter to Kessler is a reported contact; congressional requests remain separate',()=>{
  for(const s of scenes.filter(s=>s.key==='records')){
    const rr=routes(s.svg),reported=rr.filter(a=>a['data-relationship']==='reported-contact');assert.equal(reported.length,1);assert.equal(reported[0]['data-from'],'teter');assert.equal(reported[0]['data-to'],'kessler');assert.equal(reported[0]['stroke-dasharray'],'3 5');assert.equal(reported[0]['data-status'],'reported-bloomberg-anonymous');
    assert.equal(rr.filter(a=>a['stroke-dasharray']).length,1);
    const requests=rr.filter(a=>a['data-relationship']==='official-request');assert.equal(requests.length,2);assert.ok(requests.every(a=>a['data-from']==='congress'&&a['data-status']==='official-letter'&&!a['stroke-dasharray']));assert.deepEqual(requests.map(a=>a['data-to']),['teter','kessler']);
    const inventory=rr.find(a=>a['data-relationship']==='inventory-cross-check');assert.equal(inventory['data-from'],'megaspeed-records');assert.equal(inventory['data-to'],'congress-review');assert.equal(inventory['data-status'],'qualitative-records-to-check');
    assert.ok(!rr.some(a=>a['data-from']==='megaspeed-records'&&['teter','kessler'].includes(a['data-to'])));
    assert.doesNotMatch(plain(s.svg),/licen[cs]e|détournement|diversion|suspension|approved/iu);
  }
});
test('unsafe markup, heavy type and overflow fail validation',()=>{
  const svg=art.fr.records.mobile;
  for(const bad of[svg.replace('</svg>','<script>alert(1)</script></svg>'),svg.replace('<svg ','<svg onload="alert(1)" '),svg.replace('</svg>','<image href="https://example.com/a.svg"/></svg>'),svg.replace('font-weight="400"','font-weight="700"'),svg.replace('aria-labelledby="','aria-labelledby="missing ')])assert.throws(()=>inspect(bad));
  assert.notDeepEqual(geometry(svg.replace('<text x="18"','<text x="9999"')),[]);assert.notDeepEqual(geometry(svg.replace('y="30"','y="130"')),[]);
});
test('source links, controlled markup and compact caption contract remain explicit',()=>{
  assert.match(component,/max-width:37\.5rem/u);assert.match(component,/mobile-art\{display:block;max-width:17\.5rem\}/u);assert.match(component,/padding-bottom:1rem/u);assert.match(component,/figure-number\{display:inline/u);
  assert.match(component,/set:html=\{scene\.desktop\}/u);assert.match(component,/set:html=\{scene\.mobile\}/u);assert.match(component,/href=\{`#source-\$\{id\}`\}/u);assert.doesNotMatch(component,/overflow\s*:\s*hidden|font-weight:\s*700|<script/iu);
  const start=component.indexOf('const sourceIds = '),refs=JSON.parse(component.slice(start+18,component.indexOf(' as const;',start)));assert.deepEqual(refs,{agenda:['S01','S02','S03','S04','S05','S06'],records:['S01','S03','S04','S10']});
});
test('actual label sizes stay between 12 and 18 pixels through the CSS breakpoint',()=>{
  const m=component.match(/@container\s*\(\s*max-width:\s*(\d+(?:\.\d+)?)px\s*\)/u);assert.ok(m);const threshold=+m[1];assert.ok(threshold>=565&&threshold<600);
  const cssPixels=m=>+m[1]*(m[2]==='rem'?16:1);
  const desktop=component.match(/\.nvidia-congress-figure\s*\{[^}]*max-width:\s*(\d+(?:\.\d+)?)(rem|px)/u);
  const mobile=[...component.matchAll(/\.mobile-art\s*\{([^}]*)\}/gu)].map(m=>m[1].match(/max-width:\s*(\d+(?:\.\d+)?)(rem|px)/u)).find(Boolean);assert.ok(desktop&&mobile);
  const caps={desktop:cssPixels(desktop),mobile:cssPixels(mobile)};
  for(const width of new Set([280,320,390,500,501,540,568,569,600,threshold,threshold+.01])){
    const mode=width<=threshold?'mobile':'desktop',actual=Math.min(width,caps[mode]);
    for(const s of scenes.filter(s=>s.mode===mode)){const{root,all}=inspect(s.svg),viewWidth=+attrs(root).viewBox.split(' ')[2];for(const n of all.filter(n=>tag(n)==='text')){const pixels=+attrs(n)['font-size']*actual/viewWidth;assert.ok(pixels>=12&&pixels<=18,`${s.lang}/${s.key}: ${pixels}px at ${width}px`);}}
  }
});
