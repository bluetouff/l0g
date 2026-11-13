import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { XMLParser, XMLValidator } from 'fast-xml-parser';
import opentype from '@shuding/opentype.js';
import { jlrPathPoints } from './jlr-svg-assertions.mjs';

const paths = [
  'src/content/posts/dette-americaine-sept-ans-reouvertures-liquidite.md',
  'src/content/posts-en/us-treasury-seven-year-reopenings-liquidity.md',
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

test('three bilingual figures retain distinct mobile and desktop compositions', () => {
  assert.equal(scenes.length,12);
  const ids = [];
  for (const {svg,lang} of scenes) {
    assert.equal(XMLValidator.validate(svg),true);
    const root=parser.parse(svg)[0], a=attr(root);
    assert.equal(a['@_width'],'100%'); assert.equal(a['@_style'],'height:auto');
    assert.equal(a['@_xml:lang'],lang); assert.equal(a['@_role'],'img');
    const nn=all(root); ids.push(...nn.map(n=>attr(n)['@_id']).filter(Boolean));
    for (const id of a['@_aria-labelledby'].split(' ')) assert.equal(nn.filter(n=>attr(n)['@_id']===id && text(n).trim()).length,1);
    assert.doesNotMatch(svg,/<(?:script|foreignObject|image|use)\b|\b(?:href|src|on\w+)\s*=|url\(|\u2014|horloges|clocks/iu);
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
      assert.equal(at['@_font-family'],'l0g Treasury7');
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
    if(tag(n)==='path'){
      const points=jlrPathPoints(at['@_d']);
      b=[Math.min(...points.map(p=>p[0])),Math.min(...points.map(p=>p[1])),Math.max(...points.map(p=>p[0])),Math.max(...points.map(p=>p[1]))];
      assert.equal(points.length,41);
      const xEnd=w===340?324:350;
      for(const [x,y] of points){
        const yieldPct=2+4*(x-43)/(xEnd-43);
        const price=Array.from({length:14},(_,i)=>(2+(i===13?100:0))/(1+yieldPct/200)**(i+1)).reduce((a,b)=>a+b,0);
        assert.ok(Math.abs(y-(236-(price-80)/40*155))<.002,'Price/yield curve remains on its declared axes');
      }
    }
    if(b)assert.ok(inside(frame,b,1),'Shape outside SVG');
  }
});

test('illustrative principal and fixed-rate price calculations remain separate from market observations',()=>{
  const price=y=>Array.from({length:14},(_,i)=>(2+(i===13?100:0))/(1+y/200)**(i+1)).reduce((a,b)=>a+b,0);
  assert.equal(44*3,132); assert.equal(44*6,264); assert.equal(132*2,264);
  assert.equal((84+83+82)/3,83); assert.equal(84-28,56);
  for(const [y,expected] of [[3,106.27],[4,100],[5,94.15]])assert.ok(Math.abs(price(y)-expected)<.005);
  // An independent closed-form valuation agrees with the discounted payments.
  for(const y of [0.1,1,3,4,5,10,20]){
    const r=y/200,discount=(1+r)**-14;
    assert.ok(Math.abs(price(y)-(2*(1-discount)/r+100*discount))<1e-8);
  }
  for(const source of raw){
    for(const id of ['S01','S02','S07','S08','S12','S13','S16'])assert.ok(source.includes('#source-'+id));
    assert.match(source,/2017–(?:juin|June) 2024/u);
    assert.match(source,/106[,.]27/u);assert.match(source,/94[,.]15/u);
    assert.match(source,/illustrati(?:on|ve)/iu);
  }
  for(const {svg} of scenes.filter(x=>x.svg.includes('treasury7-'+x.lang+'-2-'))){
    const root=parser.parse(svg)[0],mobile=attr(root)['@_viewBox'].includes('340');
    const bars=all(root).filter(n=>tag(n)==='rect'&&attr(n)['@_fill']!=='var(--color-surface)');
    assert.equal(bars.length,6);
    const volume=[56.3,5.5,1.6],spread=[.66,1.22,2.23];
    const ratios=mobile?volume.flatMap((v,i)=>[v/60,spread[i]/2.5]):[...volume.map(v=>v/60),...spread.map(v=>v/2.5)];
    bars.forEach((bar,i)=>assert.ok(Math.abs(Number(attr(bar)[mobile?'@_width':'@_height'])/(mobile?(i%2?86:92):110)-ratios[i])<.00001,'Historical data preserve their independent zero-based scales'));
    assert.match(svg,/price basis points|points de base de prix/u);
  }
});
