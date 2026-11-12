import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { transform } from '@astrojs/compiler-rs';
import { XMLParser, XMLValidator } from 'fast-xml-parser';
import opentype from '@shuding/opentype.js';
import { tag, attrs, nodes, content } from './nebius-credit-svg-assertions.mjs';
import { pathPoints } from './insurance-returns-svg-assertions.mjs';
import { assertFontLicenseReferences } from './font-license-assertions.mjs';

const component = readFileSync(new URL('../src/components/NvidiaStateLeverageFigure.astro', import.meta.url), 'utf8');
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
  circle: 'cx cy r fill stroke stroke-width data-condition data-gate',
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
  assert.ok(['fr', 'en'].includes(a['xml:lang'])); assert.ok(['justice', 'project'].includes(a['data-kind']));
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
      assert.equal(at['font-family'], 'l0g Nvidia State Leverage'); assert.equal(at['font-weight'], '400');
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
function zoneBounds(kind, mobile) {
  if(kind==='justice') {
    const zones={header:mobile?box(12,8,388,66):box(16,10,784,73),channel:mobile?box(18,64,382,95):box(24,80,776,271),'court-step':box(300,110,480,140),legend:box(24,378,776,410)};
    for(let i=0;i<8;i++){
      const x=mobile?(i<4?105:295):[90,290,495,695][i%4],y=mobile?[118,208,298,388][i%4]:(i<4?147:305);
      zones[`node-${i}`]=mobile?box(x-87,y+16,x+87,y+63):box(x-91,y+24,x+91,y+73);
    }
    return zones;
  }
  if(kind==='project') return mobile?{
    header:box(12,8,388,67),counterparty:box(18,147,382,179),finance:box(104,72,273,205),'conditions-title':box(18,217,382,250),
    'condition-0':box(8,247,129,294),'condition-1':box(135,247,265,294),'condition-2':box(270,247,393,294),operator:box(182,321,218,358),consents:box(18,432,382,456),
  }:{
    header:box(16,10,784,73),counterparty:box(24,168,470,203),finance:box(132,90,340,223),'conditions-title':box(24,253,776,283),
    'condition-0':box(24,279,218,325),'condition-1':box(253,279,447,325),'condition-2':box(480,279,670,325),operator:box(332,355,368,392),consents:box(590,168,776,224),period:box(380,378,650,410),
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


test('Astro source compiles and preserves controlled figure selection', () => {
  assert.match(component,/^---\ninterface Props /u);
  const result=transform(component,{filename:'src/components/NvidiaStateLeverageFigure.astro'});assert.deepEqual(result.diagnostics,[]);
});
test('eight static scenes use safe XML, accessible names and licensed regular type', () => {
  assert.equal(scenes.length,8);const ids=[];
  for(const s of scenes){const{root,all}=inspect(s.svg);assert.equal(attrs(root)['xml:lang'],s.lang);assert.equal(attrs(root)['data-kind'],s.key);assert.equal(attrs(root)['data-variant'],s.mode);ids.push(...all.map(n=>attrs(n).id).filter(Boolean));assert.doesNotMatch(s.svg,/—|horloges|clocks/iu);}
  assert.equal(ids.length,new Set(ids).size);
  assertFontLicenseReferences(readFileSync(new URL('../public/fonts/ukraine-reparations/LICENSE.txt',import.meta.url),'utf8'),'liberation');
  assert.match(component,/@font-face\s*\{[^}]*liberation-sans-400\.ttf[^}]*font-weight:400/su);
});
for(const s of scenes)test(`${s.lang} ${s.key} ${s.mode}: labels and connectors fit at native reading size`,()=>{
  const {root,all}=inspect(s.svg),[,,w,h]=attrs(root).viewBox.split(' ').map(Number),scale=s.mode==='mobile'?280/400:600/800;
  assert.equal(w,s.mode==='mobile'?400:800);assert.equal(h*scale,s.mode==='mobile'?322:315);
  for(const n of all.filter(n=>tag(n)==='text')){const px=+attrs(n)['font-size']*scale;assert.ok(px>=12&&px<=18,`Actual font size: ${content(n)}`);}
  assert.deepEqual(geometry(s.svg),[]);
});
test('justice diagram separates evidence gathering from possible procedural outcomes',()=>{
  for(const s of scenes.filter(s=>s.key==='justice')){
    const rr=routes(s.svg);assert.equal(rr.length,6);assert.equal(rr.filter(a=>a['data-status']==='evidence-gathering').length,2);
    for(const r of rr){if(r['data-status']==='evidence-gathering')assert.equal(r['stroke-dasharray'],undefined);else{assert.equal(r['data-status'],'possible-next-step');assert.equal(r['stroke-dasharray'],'3 5');}}
    const labels=plain(s.svg);assert.match(labels,/Grand jury/u);assert.match(labels,s.lang==='fr'?/Accusation éventuelle/u:/Possible charge/u);
    assert.doesNotMatch(labels,/Nvidia|Megaspeed|Supermicro|White House|Maison-Blanche|capital|equity/iu);
  }
});
test('MP Materials consent period has three alternative conditions, not an ownership percentage',()=>{
  for(const s of scenes.filter(s=>s.key==='project')){
    const {all}=inspect(s.svg),conditions=all.filter(n=>attrs(n)['data-condition']).map(n=>attrs(n)['data-condition']);assert.deepEqual(conditions,['holding','contracts','loan']);
    assert.equal(all.filter(n=>attrs(n)['data-gate']==='OR').length,1);
    const rr=routes(s.svg),inputs=rr.filter(a=>a['data-relationship']==='condition-input');assert.equal(inputs.length,3);assert.ok(inputs.every(a=>a['data-to']==='or-gate'&&a['data-status']==='alternative-condition'));
    const period=rr.find(a=>a['data-relationship']==='specified-period');assert.equal(period['data-from'],'or-gate');assert.equal(period['data-to'],'defined-consents');assert.equal(period['data-status'],'one-condition-suffices');
    const desc=content(all.find(n=>tag(n)==='desc'));assert.match(desc,/Mountain Pass/u);assert.match(desc,/10X/u);assert.match(desc,/400/u);assert.match(desc,/150/u);
    const labels=plain(s.svg);assert.match(labels,s.lang==='fr'?/ OU /u:/ OR /u);assert.match(labels,s.lang==='fr'?/Achats ou prix en vigueur/u:/Offtake or floor in force/u);assert.doesNotMatch(labels,/%|Nvidia|CEO|chief executive/iu);assert.match(labels,/2025/u);
    assert.ok(!rr.some(a=>/justice|DOJ|prosecut|court/iu.test(a['data-from']+' '+a['data-to'])));
  }
});
test('unsafe markup, heavy type and internal geometry failures are rejected',()=>{
  const svg=art.fr.justice.mobile;
  for(const bad of[svg.replace('</svg>','<script>alert(1)</script></svg>'),svg.replace('<svg ','<svg onload="alert(1)" '),svg.replace('</svg>','<image href="https://example.com/a.svg"/></svg>'),svg.replace('font-weight="400"','font-weight="700"'),svg.replace('aria-labelledby="','aria-labelledby="missing ')])assert.throws(()=>inspect(bad));
  assert.notDeepEqual(geometry(svg.replace('<text x="18"','<text x="9999"')),[]);assert.notDeepEqual(geometry(svg.replace('y="30"','y="130"')),[]);
});
test('responsive contract caps mobile artwork at 280 pixels and keeps sources visible',()=>{
  assert.match(component,/max-width:37\.5rem/u);assert.match(component,/@container\s*\(max-width:\d+px\)/u);assert.match(component,/mobile-art\{display:block;max-width:17\.5rem\}/u);
  assert.match(component,/padding-bottom:1rem/u);assert.match(component,/set:html=\{scene\.desktop\}/u);assert.match(component,/set:html=\{scene\.mobile\}/u);assert.match(component,/href=\{`#source-\$\{id\}`\}/u);
  assert.doesNotMatch(component,/overflow\s*:\s*hidden|font-weight:\s*700|<script/iu);
  assert.match(component,/"justice": \[\s*"S13",\s*"S14"/u);assert.match(component,/"project": \[\s*"S06"/u);
});


test('SVG labels remain readable across responsive boundaries', () => {
  const breakpoint = component.match(/@container\s*\(\s*max-width:\s*(\d+(?:\.\d+)?)px\s*\)/u);
  assert.ok(breakpoint, 'Explicit container breakpoint');
  const threshold = Number(breakpoint[1]);
  assert.ok(threshold >= 565 && threshold < 600);

  // Default root size used by the site's CSS and browser qualification.
  const cssPixels = match => Number(match[1]) * (match[2] === 'rem' ? 16 : 1);
  const desktopLimit = component.match(/\.nvidia-state-leverage-figure\s*\{[^}]*max-width:\s*(\d+(?:\.\d+)?)(rem|px)/u);
  const mobileLimit = [...component.matchAll(/\.mobile-art\s*\{([^}]*)\}/gu)]
    .map(match => match[1].match(/max-width:\s*(\d+(?:\.\d+)?)(rem|px)/u))
    .find(Boolean);
  assert.ok(desktopLimit && mobileLimit);
  const caps = { desktop: cssPixels(desktopLimit), mobile: cssPixels(mobileLimit) };
  const widths = new Set([280, 320, 390, 500, 501, 540, 568, 569, 600, threshold, threshold + 0.01]);

  for (const containerWidth of widths) {
    const mode = containerWidth <= threshold ? 'mobile' : 'desktop';
    const displayWidth = Math.min(containerWidth, caps[mode]);
    for (const scene of scenes.filter(scene => scene.mode === mode)) {
      const { root, all } = inspect(scene.svg);
      const viewBoxWidth = Number(attrs(root).viewBox.split(' ')[2]);
      const scale = displayWidth / viewBoxWidth;
      for (const node of all.filter(node => tag(node) === 'text')) {
        const pixels = Number(attrs(node)['font-size']) * scale;
        assert.ok(pixels >= 12 && pixels <= 18,
          `${scene.lang}/${scene.key}: ${pixels}px at ${containerWidth}px`);
      }
    }
  }
});
