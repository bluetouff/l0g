import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { XMLParser, XMLValidator } from 'fast-xml-parser';
import opentype from '@shuding/opentype.js';

const paths = [
  'src/content/posts/kalshi-trump-jr-cftc-enquete-represailles.md',
  'src/content/posts-en/kalshi-trump-jr-cftc-retaliation-investigation.md',
];
const parser = new XMLParser({ ignoreAttributes: false, preserveOrder: true, trimValues: false, parseTagValue: false });
const bytes = readFileSync(new URL('../public/fonts/ukraine-reparations/liberation-sans-400.ttf', import.meta.url));
const font = opentype.parse(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength));
const attr = n => n[':@'] ?? {};
const tag = n => Object.keys(n).find(k => k !== ':@');
const children = n => Array.isArray(n[tag(n)]) ? n[tag(n)] : [];
const all = n => [n, ...children(n).flatMap(all)];
const text = n => tag(n) === '#text' ? n['#text'] : children(n).map(text).join('');
const inside = (a,b,p=0) => b[0]>=a[0]+p && b[1]>=a[1]+p && b[2]<=a[2]-p && b[3]<=a[3]-p;
const overlap = (a,b) => Math.min(a[2],b[2])-Math.max(a[0],b[0])>1 && Math.min(a[3],b[3])-Math.max(a[1],b[1])>1;
const raw = paths.map(p => readFileSync(new URL(`../${p}`,import.meta.url),'utf8'));
const scenes = raw.flatMap((s,i) => [...s.matchAll(/<svg\b[\s\S]*?<\/svg>/gu)].map(m => ({lang:i?'en':'fr',svg:m[0]})));

test('four bilingual figures retain distinct mobile and desktop compositions', () => {
  assert.equal(scenes.length,16);
  const ids = [];
  for (const {svg,lang} of scenes) {
    assert.equal(XMLValidator.validate(svg),true);
    const root=parser.parse(svg)[0], a=attr(root);
    assert.equal(a['@_width'],'100%'); assert.equal(a['@_style'],'height:auto');
    assert.equal(a['@_xml:lang'],lang); assert.equal(a['@_role'],'img');
    const nn=all(root); ids.push(...nn.map(n=>attr(n)['@_id']).filter(Boolean));
    for (const id of a['@_aria-labelledby'].split(' ')) assert.equal(nn.filter(n=>attr(n)['@_id']===id && text(n).trim()).length,1);
    assert.doesNotMatch(svg,/<(?:script|foreignObject|image|use)\b|\b(?:href|src|on\w+)\s*=|url\(|—|horloges|clocks/iu);
    for(const n of nn) for(const [key,value] of Object.entries(attr(n))) if(['@_fill','@_stroke'].includes(key)) assert.match(value,/^(?:none|var\(--color-(?:paper|muted|line-strong|signal|accent|amber|surface)\))$/u);
  }
  assert.equal(ids.length,new Set(ids).size);
});

for (const {svg,lang} of scenes) test(`${lang}: ${svg.match(/aria-labelledby="([^"]+)/u)?.[1]} geometry and restrained type`,()=>{
  const root=parser.parse(svg)[0],a=attr(root),nn=all(root),[,,w,h]=a['@_viewBox'].split(' ').map(Number), frame=[0,0,w,h];
  assert.ok(w===340||w===600); assert.ok(h<=350); assert.ok(h>=250);
  const boxes=[];
  const walk=(node,region=frame)=>{
    const at=attr(node);
    if(at['@_data-region']) {const [x,y,rw,rh]=at['@_data-region'].split(' ').map(Number);region=[x,y,x+rw,y+rh];assert.ok(inside(frame,region));}
    if(tag(node)==='text') {
      const s=+at['@_font-size'],value=text(node),advance=font.getAdvanceWidth(value,s,{kerning:true});
      assert.ok(s>=12&&s<=18); assert.equal(at['@_font-weight'],'400');
      assert.equal(at['@_font-family'],'l0g Kalshi');
      for(const c of value)assert.notEqual(font.charToGlyphIndex(c),0,`Missing glyph: ${c}`);
      const x=+at['@_x']-(at['@_text-anchor']==='middle'?advance/2:at['@_text-anchor']==='end'?advance:0),y=+at['@_y'];
      const b=[x,y-font.ascender*s/font.unitsPerEm,x+advance,y-font.descender*s/font.unitsPerEm];
      assert.ok(inside(region,b),`Label outside its region: ${value}`); assert.ok(inside(frame,b,3),`ViewBox: ${value}`); boxes.push({b,value});
    }
    for(const c of children(node))walk(c,region);
  };
  walk(root);
  for(let i=0;i<boxes.length;i++)for(const b of boxes.slice(i+1))assert.ok(!overlap(boxes[i].b,b.b),`Overlapping labels: ${boxes[i].value} / ${b.value}`);
  for(const n of nn){const at=attr(n),num=k=>+at[`@_${k}`];let b;
    if(tag(n)==='rect')b=[num('x'),num('y'),num('x')+num('width'),num('y')+num('height')];
    if(tag(n)==='circle')b=[num('cx')-num('r'),num('cy')-num('r'),num('cx')+num('r'),num('cy')+num('r')];
    if(tag(n)==='line')b=[Math.min(num('x1'),num('x2')),Math.min(num('y1'),num('y2')),Math.max(num('x1'),num('x2')),Math.max(num('y1'),num('y2'))];
    if(b)assert.ok(inside(frame,b,1),'Shape outside SVG');
  }
});

test('hypothetical payoffs and 41-day calendar comparison remain reproducible',()=>{
  assert.equal((Date.UTC(2025,7,26)-Date.UTC(2025,6,16))/86400000,41);
  assert.equal(Math.round((1-.4)*100),60); assert.equal(Math.round((0-.4)*100),-40);
  for(const s of raw){assert.match(s,/0[,.]40/u);assert.match(s,/0[,.]60/u);assert.match(s,/41/u);assert.match(s,/#source-S13/u);assert.match(s,/#source-S07/u);}
});
