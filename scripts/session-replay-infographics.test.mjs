import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {XMLParser,XMLValidator} from 'fast-xml-parser';
import opentype from '@shuding/opentype.js';
import {tag,attrs,nodes,content} from './nebius-credit-svg-assertions.mjs';
import {pathPoints} from './insurance-returns-svg-assertions.mjs';
import {assertFontLicenseReferences} from './font-license-assertions.mjs';
const component=readFileSync(new URL('../src/components/SessionReplayFigure.astro',import.meta.url),'utf8');
const start=component.indexOf('const art = ')+'const art = '.length;
const art=JSON.parse(component.slice(start,component.indexOf(' as const;',start)));
const scenes=['fr','en'].flatMap(lang=>['mechanism','circuits','margin'].flatMap(kind=>['desktop','mobile'].map(mode=>({lang,kind,mode,svg:art[lang][kind][mode]}))));
const parser=new XMLParser({ignoreAttributes:false,attributeNamePrefix:'',preserveOrder:true,trimValues:false,parseTagValue:false});
const bytes=readFileSync(new URL('../public/fonts/ukraine-reparations/liberation-sans-400.ttf',import.meta.url)),font=opentype.parse(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength));
const colors=/^(?:none|var\(--color-(?:ink|surface|surface-2|paper|muted|line-strong|signal|accent|amber)\))$/u;
const originalCurve='M123 830.0 L723 390.0';
const allowed={
 svg:'xmlns width style viewBox role aria-labelledby xml:lang data-kind data-variant',title:'id',desc:'id',
 rect:'x y width height fill stroke rx id data-label-region',
 text:'x y fill font-family font-size font-weight text-anchor data-panel data-metric data-value data-parameter data-state',
 line:'x1 y1 x2 y2 stroke stroke-width stroke-linecap stroke-dasharray',
 circle:'cx cy r fill stroke stroke-width data-metric data-points data-orders',
 path:'d stroke stroke-width fill stroke-linecap stroke-linejoin transform data-metric data-model data-formula',
};
function inspect(svg){
 assert.equal(XMLValidator.validate(svg),true);assert.doesNotMatch(svg,/<!DOCTYPE|<!ENTITY|<!\[CDATA\[|<\?|<(?:script|foreignObject|image|use)\b|\bon[a-z]+\s*=|\b(?:href|src)\s*=|url\(/iu);
 const roots=parser.parse(svg);assert.equal(roots.length,1);const root=roots[0],all=nodes(root),a=attrs(root);
 assert.equal(tag(root),'svg');assert.equal(a.role,'img');assert.equal(a.xmlns,'http://www.w3.org/2000/svg');assert.equal(a.width,'100%');assert.equal(a.style,'height:auto');
 const ids=all.map(n=>attrs(n).id).filter(Boolean);assert.equal(ids.length,new Set(ids).size);for(const id of a['aria-labelledby'].split(' '))assert.equal(all.filter(n=>attrs(n).id===id&&['title','desc'].includes(tag(n))&&content(n).trim()).length,1);
 for(const n of all){const name=tag(n),at=attrs(n);assert.ok(Object.hasOwn(allowed,name),name);
  for(const[key,v]of Object.entries(at)){assert.ok(allowed[name].split(' ').includes(key),`Forbidden ${name}.${key}`);if(['fill','stroke'].includes(key))assert.match(v,colors);if(key==='d')pathPoints(v);if(key==='transform'){
   assert.equal(name,'path');assert.equal(at['data-metric'],'net-margin');assert.equal(at.d,originalCurve);
   assert.ok(['translate(110 200) scale(1.3583333333333334 0.6136363636363636) translate(-123 -390)','translate(84 290) scale(0.4716666666666667 0.5909090909090909) translate(-123 -390)'].includes(v));
  }}
  if(name==='text'){assert.equal(at['font-weight'],'400');assert.equal(at['font-family'],'l0g Session Replay');assert.ok(Number(at['font-size'])>=18);assert.ok(at['data-panel']);for(const ch of content(n))assert.notEqual(font.charToGlyphIndex(ch),0,`Missing licensed glyph ${ch}`);}
 }
 return{root,all};
}
const contains=(a,b,p=0)=>b.x1>=a.x1+p&&b.y1>=a.y1+p&&b.x2<=a.x2-p&&b.y2<=a.y2-p;
function labelBox(n){const a=attrs(n),s=Number(a['font-size']),value=content(n),advance=font.getAdvanceWidth(value,s,{kerning:true}),x=Number(a.x)-(a['text-anchor']==='middle'?advance/2:a['text-anchor']==='end'?advance:0),y=Number(a.y);return{x1:x,y1:y-font.ascender*s/font.unitsPerEm,x2:x+advance,y2:y-font.descender*s/font.unitsPerEm,value};}
function geometry(svg){const{root,all}=inspect(svg),[,,w,h]=attrs(root).viewBox.split(' ').map(Number),frame={x1:0,y1:0,x2:w,y2:h},texts=all.filter(n=>tag(n)==='text'),boxes=texts.map(labelBox),scale=attrs(root)['data-variant']==='mobile'?280/400:660/1000,pad=2.01/scale;
 for(const[i,b]of boxes.entries()){
  assert.ok(contains(frame,b,pad),`Label escapes root: ${b.value}`);const region=attrs(texts[i])['data-panel'],a=attrs(all.find(n=>attrs(n).id===region)??{});assert.ok(a.width,'Missing intended label region');assert.ok(contains({x1:Number(a.x),y1:Number(a.y),x2:Number(a.x)+Number(a.width),y2:Number(a.y)+Number(a.height)},b,pad),`Label escapes its region: ${b.value}`);
 }
 for(const[i,a]of boxes.entries())for(const b of boxes.slice(i+1))assert.ok(Math.min(a.x2,b.x2)-Math.max(a.x1,b.x1)<=1||Math.min(a.y2,b.y2)-Math.max(a.y1,b.y1)<=1,`Full-font label overlap: ${a.value} / ${b.value}`);
 for(const n of all.filter(n=>tag(n)==='path'))for(const[x,y]of pathPoints(attrs(n).d)){
  let px=x,py=y;if(attrs(n).transform){const[x0,y0,sx,sy]=attrs(root)['data-variant']==='mobile'?[84,290,283/600,260/440]:[110,200,815/600,270/440];px=x0+(x-123)*sx;py=y0+(y-390)*sy;}
  assert.ok(contains(frame,{x1:px,x2:px,y1:py,y2:py},2),`Path outside the viewBox: ${attrs(n).d}`);
 }
 for(const n of all.filter(n=>['rect','circle','line'].includes(tag(n)))){const a=attrs(n);if(a['data-label-region']==='true')continue;if(tag(n)==='rect')assert.ok(contains(frame,{x1:Number(a.x),y1:Number(a.y),x2:Number(a.x)+Number(a.width),y2:Number(a.y)+Number(a.height)}));if(tag(n)==='circle')assert.ok(contains(frame,{x1:Number(a.cx)-Number(a.r),y1:Number(a.cy)-Number(a.r),x2:Number(a.cx)+Number(a.r),y2:Number(a.cy)+Number(a.r)},2));if(tag(n)==='line')for(const[x,y]of[[Number(a.x1),Number(a.y1)],[Number(a.x2),Number(a.y2)]])assert.ok(contains(frame,{x1:x,x2:x,y1:y,y2:y},2));}
 return{root,all};
}
const matching=(svg,metric)=>inspect(svg).all.filter(n=>attrs(n)['data-metric']===metric);
const words=svg=>inspect(svg).all.filter(n=>['text','title','desc'].includes(tag(n))).map(content).join(' ');
test('twelve passive, uniquely labelled scenes use regular typography and readable compact variants',()=>{
 assert.equal(scenes.length,12);const ids=[];for(const scene of scenes){const{root,all}=geometry(scene.svg),[,,w,h]=attrs(root).viewBox.split(' ').map(Number);assert.equal(w,scene.mode==='mobile'?400:1000);assert.ok(h<=(scene.mode==='mobile'?850:700));if(scene.mode==='desktop')assert.ok(h*800/w<=560);else assert.ok(h*340/w<=750);for(const n of all){if(attrs(n).id)ids.push(attrs(n).id);if(tag(n)==='text')assert.ok(Number(attrs(n)['font-size'])*(scene.mode==='mobile'?280/400:660/1000)>=12);}
 assert.doesNotMatch(scene.svg,/—|(?:deux|2) horloges|two clocks|mérite mieux que|deserves better than/iu);}
 assert.equal(ids.length,new Set(ids).size);
});
test('rrweb mechanism keeps the fictitious initial state and cart mutation visibly distinct',()=>{
 for(const scene of scenes.filter(s=>s.kind==='mechanism')){assert.deepEqual(matching(scene.svg,'cart-count').map(n=>attrs(n)['data-value']),['0','1']);assert.match(words(scene.svg),scene.lang==='fr'?/fictif/:/illustrative/i);assert.match(words(scene.svg),/rrweb/);assert.match(words(scene.svg),scene.lang==='fr'?/Masquage local avant envoi/:/Local masking before transmission/);}
});
test('Clarity distinguishes the two independent granted and denied parameter branches',()=>{
 for(const scene of scenes.filter(s=>s.kind==='circuits')){const branches=inspect(scene.svg).all.filter(n=>attrs(n)['data-parameter']);assert.deepEqual(branches.map(n=>[attrs(n)['data-parameter'],attrs(n)['data-state']]),[['analytics_storage','granted'],['analytics_storage','denied'],['ad_storage','granted'],['ad_storage','denied']]);assert.match(words(scene.svg),/Microsoft Ads/);assert.match(words(scene.svg),scene.lang==='fr'?/collecte limitée|Collecte limitée/:/Limited collection|Limited cookieless collection/);assert.match(words(scene.svg),scene.lang==='fr'?/consentement/:/consent/i);}
});
test('the archived economic line and explicit break-even scenario remain mathematically exact',()=>{
 for(const scene of scenes.filter(s=>s.kind==='margin')){const curve=attrs(matching(scene.svg,'net-margin')[0]);assert.equal(curve.d,originalCurve);assert.equal(curve['data-model'],'M01');assert.equal(curve['data-formula'],'100000*30*deltaPoints/100-3000');const point=attrs(matching(scene.svg,'break-even')[0]);assert.equal(point['data-points'],'0.1');assert.equal(point['data-orders'],'100');assert.match(words(scene.svg),scene.lang==='fr'?/SCÉNARIO FICTIF/:/ILLUSTRATIVE SCENARIO/);assert.match(words(scene.svg),/5 ?%/);}
 assert.equal(100000*30*.1/100-3000,0);assert.equal(100000*30*.3/100-3000,6000);assert.equal(3000/30,100);assert.equal(.001/.02*100,5);
});
test('active markup, heavy type, unknown regions and overflowing geometry fail closed',()=>{
 const s=scenes[0].svg;for(const value of[s.replace('</svg>','<script>alert(1)</script></svg>'),s.replace('<svg ','<svg onload="x" '),s.replace('<svg ','<svg href="https://evil.invalid/" '),s.replace('font-weight="400"','font-weight="700"'),s.replace('data-panel="replay-mechanism-fr-d-region-1"','data-panel="missing"'),s.replace('x="32" y="42"','x="999" y="42"')])assert.throws(()=>geometry(value));
});
test('the shared path parser consumes complete input and rejects oversized numeric payloads',{timeout:1000},()=>{
 assert.deepEqual(pathPoints(originalCurve),[[123,830],[723,390]]);for(const d of[originalCurve+' x',originalCurve+'e9',originalCurve+' LNaN 0','M0 0 L'+'9'.repeat(4096)+' 0',originalCurve+' Q0 0 0 0'])assert.throws(()=>pathPoints(d));
});
test('controlled art, licensed local font, method anchor and responsive layout remain intact',()=>{
 assertFontLicenseReferences(readFileSync(new URL('../public/fonts/ukraine-reparations/LICENSE.txt',import.meta.url),'utf8'),'liberation');assert.match(component,/Object\.prototype\.hasOwnProperty\.call\(info,kind\)/);assert.match(component,/@container \(max-width:660px\)/);assert.match(component,/max-width:340px/);assert.match(component,/padding-bottom:1rem/);assert.match(component,/\/fonts\/ukraine-reparations\/liberation-sans-400\.ttf/);assert.doesNotMatch(component,/overflow\s*:\s*hidden|font-weight:\s*700|<script/);assert.match(component,/'#methode-m01'/);assert.match(component,/`#source-\$\{id\}`/);
});
