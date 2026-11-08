import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {XMLParser,XMLValidator} from 'fast-xml-parser';
import opentype from '@shuding/opentype.js';
import {tag,attrs,nodes,content} from './nebius-credit-svg-assertions.mjs';
import {pathPoints} from './insurance-returns-svg-assertions.mjs';
import {assertFontLicenseReferences} from './font-license-assertions.mjs';
const component=readFileSync(new URL('../src/components/AmazonAuctionFigure.astro',import.meta.url),'utf8');
const start=component.indexOf('const art = ')+'const art = '.length;
const art=JSON.parse(component.slice(start,component.indexOf(' as const;',start)));
const scenes=['fr','en'].flatMap(lang=>['auction','incrementality','revenue'].flatMap(kind=>['desktop','mobile'].map(mode=>({lang,kind,mode,svg:art[lang][kind][mode]}))));
const parser=new XMLParser({ignoreAttributes:false,attributeNamePrefix:'',preserveOrder:true,trimValues:false,parseTagValue:false});
const bytes=readFileSync(new URL('../public/fonts/ukraine-reparations/liberation-sans-400.ttf',import.meta.url)),font=opentype.parse(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength));
const colors=/^(?:none|var\(--color-(?:ink|surface|surface-2|paper|muted|line-strong|signal|accent|amber)\))$/u;
const originalCurve='M 112 674 L 400 674 L 592 580.667 L 712 580.667';
// The only curves besides the price polyline are ten controlled shopping-bag handles.
// Exact identity admits their known control-point hulls without broadening the shared parser.
const handles=new Map([["M63.68 179.0 V171.72 Q76.0 157.16 88.32 171.72 V179.0",[[63.68,179.0],[63.68,171.72],[76.0,157.16],[88.32,171.72],[88.32,179.0]]],["M151.68 179.0 V171.72 Q164.0 157.16 176.32 171.72 V179.0",[[151.68,179.0],[151.68,171.72],[164.0,157.16],[176.32,171.72],[176.32,179.0]]],["M239.68 179.0 V171.72 Q252.0 157.16 264.32 171.72 V179.0",[[239.68,179.0],[239.68,171.72],[252.0,157.16],[264.32,171.72],[264.32,179.0]]],["M327.68 179.0 V171.72 Q340.0 157.16 352.32 171.72 V179.0",[[327.68,179.0],[327.68,171.72],[340.0,157.16],[352.32,171.72],[352.32,179.0]]],["M415.68 179.0 V171.72 Q428.0 157.16 440.32 171.72 V179.0",[[415.68,179.0],[415.68,171.72],[428.0,157.16],[440.32,171.72],[440.32,179.0]]],["M503.68 179.0 V171.72 Q516.0 157.16 528.32 171.72 V179.0",[[503.68,179.0],[503.68,171.72],[516.0,157.16],[528.32,171.72],[528.32,179.0]]],["M591.68 179.0 V171.72 Q604.0 157.16 616.32 171.72 V179.0",[[591.68,179.0],[591.68,171.72],[604.0,157.16],[616.32,171.72],[616.32,179.0]]],["M679.68 179.0 V171.72 Q692.0 157.16 704.32 171.72 V179.0",[[679.68,179.0],[679.68,171.72],[692.0,157.16],[704.32,171.72],[704.32,179.0]]],["M767.68 179.0 V171.72 Q780.0 157.16 792.32 171.72 V179.0",[[767.68,179.0],[767.68,171.72],[780.0,157.16],[792.32,171.72],[792.32,179.0]]],["M855.68 179.0 V171.72 Q868.0 157.16 880.32 171.72 V179.0",[[855.68,179.0],[855.68,171.72],[868.0,157.16],[880.32,171.72],[880.32,179.0]]],["M35.0 140.25 V137.0 Q40.5 130.5 46.0 137.0 V140.25",[[35.0,140.25],[35.0,137.0],[40.5,130.5],[46.0,137.0],[46.0,140.25]]],["M69.0 140.25 V137.0 Q74.5 130.5 80.0 137.0 V140.25",[[69.0,140.25],[69.0,137.0],[74.5,130.5],[80.0,137.0],[80.0,140.25]]],["M103.0 140.25 V137.0 Q108.5 130.5 114.0 137.0 V140.25",[[103.0,140.25],[103.0,137.0],[108.5,130.5],[114.0,137.0],[114.0,140.25]]],["M137.0 140.25 V137.0 Q142.5 130.5 148.0 137.0 V140.25",[[137.0,140.25],[137.0,137.0],[142.5,130.5],[148.0,137.0],[148.0,140.25]]],["M171.0 140.25 V137.0 Q176.5 130.5 182.0 137.0 V140.25",[[171.0,140.25],[171.0,137.0],[176.5,130.5],[182.0,137.0],[182.0,140.25]]],["M205.0 140.25 V137.0 Q210.5 130.5 216.0 137.0 V140.25",[[205.0,140.25],[205.0,137.0],[210.5,130.5],[216.0,137.0],[216.0,140.25]]],["M239.0 140.25 V137.0 Q244.5 130.5 250.0 137.0 V140.25",[[239.0,140.25],[239.0,137.0],[244.5,130.5],[250.0,137.0],[250.0,140.25]]],["M273.0 140.25 V137.0 Q278.5 130.5 284.0 137.0 V140.25",[[273.0,140.25],[273.0,137.0],[278.5,130.5],[284.0,137.0],[284.0,140.25]]],["M307.0 140.25 V137.0 Q312.5 130.5 318.0 137.0 V140.25",[[307.0,140.25],[307.0,137.0],[312.5,130.5],[318.0,137.0],[318.0,140.25]]],["M341.0 140.25 V137.0 Q346.5 130.5 352.0 137.0 V140.25",[[341.0,140.25],[341.0,137.0],[346.5,130.5],[352.0,137.0],[352.0,140.25]]]]);
const points=d=>handles.has(d)?handles.get(d):pathPoints(d);

function inspect(svg){
 assert.equal(XMLValidator.validate(svg),true);assert.doesNotMatch(svg,/<!DOCTYPE|<!ENTITY|<!\[CDATA\[|<\?|<(?:script|foreignObject|image|use)\b|\bon[a-z]+\s*=|\b(?:href|src)\s*=|url\(/iu);
 const roots=parser.parse(svg);assert.equal(roots.length,1);const root=roots[0],all=nodes(root),a=attrs(root);
 assert.equal(tag(root),'svg');assert.equal(a.role,'img');assert.equal(a.xmlns,'http://www.w3.org/2000/svg');assert.equal(a.width,'100%');assert.equal(a.style,'height:auto');
 const ids=all.map(n=>attrs(n).id).filter(Boolean);assert.equal(ids.length,new Set(ids).size);for(const id of a['aria-labelledby'].split(' '))assert.equal(all.filter(n=>attrs(n).id===id&&['title','desc'].includes(tag(n))&&content(n).trim()).length,1);
 for(const n of all){const name=tag(n),at=attrs(n);assert.ok(['svg','title','desc','rect','text','path','circle','line'].includes(name),name);
  for(const[key,v]of Object.entries(at)){assert.ok(!/^on/iu.test(key));if(['fill','stroke'].includes(key))assert.match(v,colors);if(key==='d')points(v);if(key==='transform'){
    assert.equal(name,'path');assert.equal(at['data-metric'],'soft-reserve-price');assert.equal(at.d,originalCurve);
    assert.ok(['translate(96 466) scale(1.4066666666666667 0.8571428571428571) translate(-112 -814)','translate(64 478) scale(0.5066666666666667 0.7142857142857143) translate(-112 -814)'].includes(v));
   }}
  if(name==='text'){assert.equal(at['font-weight'],'400');assert.equal(at['font-family'],'l0g Amazon Auctions');assert.ok(Number(at['font-size'])>=18);assert.ok(at['data-panel']);for(const ch of content(n))assert.notEqual(font.charToGlyphIndex(ch),0,`Missing licensed glyph ${ch}`);}
 }
 return{root,all};
}
const contains=(a,b,p=0)=>b.x1>=a.x1+p&&b.y1>=a.y1+p&&b.x2<=a.x2-p&&b.y2<=a.y2-p;
function labelBox(n){const a=attrs(n),s=Number(a['font-size']),value=content(n),advance=font.getAdvanceWidth(value,s,{kerning:true}),x=Number(a.x)-(a['text-anchor']==='middle'?advance/2:a['text-anchor']==='end'?advance:0),y=Number(a.y);return{x1:x,y1:y-font.ascender*s/font.unitsPerEm,x2:x+advance,y2:y-font.descender*s/font.unitsPerEm,value};}
function geometry(svg){const{root,all}=inspect(svg),[,,w,h]=attrs(root).viewBox.split(' ').map(Number),frame={x1:0,y1:0,x2:w,y2:h},texts=all.filter(n=>tag(n)==='text'),boxes=texts.map(labelBox);
 for(const[i,b]of boxes.entries()){
  assert.ok(contains(frame,b,2),b.value);const region=attrs(texts[i])['data-panel'],a=attrs(all.find(n=>attrs(n).id===region)??{});assert.ok(a.width,'Missing intended label region');assert.ok(contains({x1:Number(a.x),y1:Number(a.y),x2:Number(a.x)+Number(a.width),y2:Number(a.y)+Number(a.height)},b,1),`Label escapes its region: ${b.value}`);
 }
 for(const[i,a]of boxes.entries())for(const b of boxes.slice(i+1))assert.ok(Math.min(a.x2,b.x2)-Math.max(a.x1,b.x1)<=1||Math.min(a.y2,b.y2)-Math.max(a.y1,b.y1)<=1,`Full-font label overlap: ${a.value} / ${b.value}`);
 for(const n of all.filter(n=>tag(n)==='path'))for(const[x,y]of points(attrs(n).d)){
  const transformed=attrs(n).transform,mode=attrs(root)['data-variant'];let px=x,py=y;
  if(transformed){const[x0,y0,sx,sy]=mode==='mobile'?[64,478,304/600,200/280]:[96,466,844/600,240/280];px=x0+(x-112)*sx;py=y0+(y-814)*sy;}
  assert.ok(contains(frame,{x1:px,x2:px,y1:py,y2:py}),`Path outside the viewBox: ${attrs(n).d}`);
 }
 return{root,all};
}
const matching=(svg,metric)=>inspect(svg).all.filter(n=>attrs(n)['data-metric']===metric);
const words=svg=>inspect(svg).all.filter(n=>['text','title','desc'].includes(tag(n))).map(content).join(' ');
test('twelve passive, uniquely labelled scenes use restrained type and readable responsive variants',()=>{
 assert.equal(scenes.length,12);const ids=[];
 for(const scene of scenes){const{root,all}=geometry(scene.svg),[,,w,h]=attrs(root).viewBox.split(' ').map(Number);assert.equal(w,scene.mode==='mobile'?400:1000);assert.ok(h<= (scene.mode==='mobile'?760:700));if(scene.mode==='desktop')assert.ok(h*800/w<=560);for(const n of all){if(attrs(n).id)ids.push(attrs(n).id);if(tag(n)==='text')assert.ok(Number(attrs(n)['font-size'])*(scene.mode==='mobile'?280/400:660/1000)>=12);}
  assert.doesNotMatch(scene.svg,/—|(?:deux|2) horloges|two clocks|mérite mieux que|deserves better than/iu);
 }
 assert.equal(ids.length,new Set(ids).size);
});
test('the soft-reserve example preserves the archived economic curve and fixed competitive bids',()=>{
 for(const scene of scenes.filter(s=>s.kind==='auction')){const curve=attrs(matching(scene.svg,'soft-reserve-price')[0]);assert.equal(curve.d,originalCurve);assert.equal(curve['data-model'],'M01');assert.equal(curve['data-formula'],'min(2,max(1.2,r))');assert.deepEqual(matching(scene.svg,'adjusted-bid').map(n=>[attrs(n)['data-bidder'],Number(attrs(n)['data-value'])]),[['A',2],['B',1.2],['C',.8]]);assert.match(words(scene.svg),scene.lang==='fr'?/MODÈLE FICTIF/:/ILLUSTRATIVE MODEL/);}
 assert.deepEqual([0,1.2,1.6,2.2].map(r=>Math.min(2,Math.max(1.2,r))),[1.2,1.2,1.6,2]);
});
test('attribution and incrementality retain the explicitly assumed six-to-four order split',()=>{
 for(const scene of scenes.filter(s=>s.kind==='incrementality')){const orders=matching(scene.svg,'order');assert.equal(orders.length,10);assert.equal(orders.filter(n=>attrs(n)['data-incremental']==='true').length,6);assert.equal(orders.filter(n=>attrs(n)['data-incremental']==='false').length,4);assert.deepEqual(matching(scene.svg,'contribution').map(n=>Number(attrs(n)['data-value'])),[150,90]);assert.equal(attrs(matching(scene.svg,'ad-spend')[0])['data-value'],'120');assert.match(words(scene.svg),scene.lang==='fr'?/MODÈLE FICTIF/:/ILLUSTRATIVE MODEL/);assert.match(words(scene.svg),/60 ?%/);assert.match(words(scene.svg),scene.lang==='fr'?/supposée|supposés/:/assumed|Assumed/);}
 assert.equal(10*15-120,30);assert.equal(6*15-120,-30);assert.ok(Math.abs(.1*.6*15-.9)<1e-12);
});
test('annual and quarterly advertising revenue are separate, zero-based scoped series',()=>{
 for(const scene of scenes.filter(s=>s.kind==='revenue')){assert.deepEqual(matching(scene.svg,'annual-revenue').map(n=>[attrs(n)['data-period'],attrs(n)['data-value'],attrs(n)['data-unit']]),[['2021','31160','USD million'],['2022','37739','USD million'],['2023','46906','USD million'],['2024','56214','USD million'],['2025','68635','USD million']]);assert.deepEqual(matching(scene.svg,'quarter-revenue').map(n=>[attrs(n)['data-period'],attrs(n)['data-value'],attrs(n)['data-unit']]),[['2025-Q3','17703','USD million'],['2026-Q3','19637','USD million']]);assert.match(words(scene.svg),/US GAAP/);assert.match(words(scene.svg),/Advertising services/);assert.match(words(scene.svg),/Prime Day/);const bars=matching(scene.svg,'annual-revenue').map(attrs),bottoms=bars.map(a=>Number(a.y)+Number(a.height));assert.ok(bottoms.every(y=>Math.abs(y-bottoms[0])<1e-8));}
});
test('active markup, heavy type, unknown regions and escaping geometry fail closed',()=>{
 const s=scenes[0].svg;for(const value of[s.replace('</svg>','<script>alert(1)</script></svg>'),s.replace('<svg ','<svg onload="x" '),s.replace('<svg ','<svg href="https://evil.invalid/" '),s.replace('font-weight="400"','font-weight="700"'),s.replace('data-panel="amazon-auction-fr-d-region-1"','data-panel="missing"'),s.replace('x="32" y="38"','x="999" y="38"')])assert.throws(()=>geometry(value));
});
test('path validation consumes complete input and rejects malformed or oversized numeric payloads',{timeout:1000},()=>{
 assert.deepEqual(points(originalCurve),[[112,674],[400,674],[592,580.667],[712,580.667]]);
 for(const[d,hull]of handles)assert.deepEqual(points(d),hull);
 for(const d of[originalCurve+' x',originalCurve+'e9',originalCurve+' LNaN 0','M0 0 L'+'9'.repeat(4096)+' 0',Array.from(handles.keys())[0]+' Q0 0 0 0'])assert.throws(()=>points(d));
});
test('controlled art, canonical local font licence, source anchors and unmasked responsive layout remain intact',()=>{
 assertFontLicenseReferences(readFileSync(new URL('../public/fonts/ukraine-reparations/LICENSE.txt',import.meta.url),'utf8'),'liberation');assert.match(component,/Object\.prototype\.hasOwnProperty\.call\(info,kind\)/);assert.match(component,/@container \(max-width:660px\)/);assert.match(component,/max-width:340px/);assert.match(component,/padding-bottom:1rem/);assert.match(component,/\/fonts\/ukraine-reparations\/liberation-sans-400\.ttf/);assert.doesNotMatch(component,/overflow\s*:\s*hidden|font-weight:\s*700|<script/);assert.match(component,/`#source-\$\{id\}`/);
});
