import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {XMLParser,XMLValidator} from 'fast-xml-parser';
import opentype from '@shuding/opentype.js';
import {tag,attrs,nodes,content} from './nebius-credit-svg-assertions.mjs';
import {pathPoints} from './insurance-returns-svg-assertions.mjs';
import {assertFontLicenseReferences} from './font-license-assertions.mjs';
const component=readFileSync(new URL('../src/components/StablecoinDepositFigure.astro',import.meta.url),'utf8');
const start=component.indexOf('const art = ')+'const art = '.length;
const art=JSON.parse(component.slice(start,component.indexOf(' as const;',start)));
const scenes=['fr','en'].flatMap(lang=>['mint','funding','counterparties'].flatMap(kind=>['desktop','mobile'].map(mode=>({lang,kind,mode,svg:art[lang][kind][mode]}))));
const parser=new XMLParser({ignoreAttributes:false,attributeNamePrefix:'',preserveOrder:true,trimValues:false,parseTagValue:false});
const bytes=readFileSync(new URL('../public/fonts/ukraine-reparations/liberation-sans-400.ttf',import.meta.url)),font=opentype.parse(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength));
const colors=/^(?:none|var\(--color-(?:ink|surface|surface-2|paper|muted|line-strong|signal|accent|amber)\))$/u;

const allowed={
 svg:'xmlns width style viewBox role aria-labelledby xml:lang data-kind data-variant',title:'id',desc:'id',
 rect:'x y width height fill stroke rx id data-label-region',
 text:'x y fill font-family font-size font-weight text-anchor data-panel data-metric data-value data-parameter data-state data-bank data-case data-deposits data-reserves',
 line:'x1 y1 x2 y2 stroke stroke-width stroke-linecap stroke-dasharray',
 circle:'cx cy r fill stroke stroke-width data-metric data-points data-orders data-bp data-cost',
 path:'d stroke stroke-width fill stroke-linecap stroke-linejoin transform data-metric data-model data-formula data-values',
};
function inspect(svg){
 assert.equal(XMLValidator.validate(svg),true);assert.doesNotMatch(svg,/<!DOCTYPE|<!ENTITY|<!\[CDATA\[|<\?|<(?:script|foreignObject|image|use)\b|\bon[a-z]+\s*=|\b(?:href|src)\s*=|url\(/iu);
 const roots=parser.parse(svg);assert.equal(roots.length,1);const root=roots[0],all=nodes(root),a=attrs(root);
 assert.equal(tag(root),'svg');assert.equal(a.role,'img');assert.equal(a.xmlns,'http://www.w3.org/2000/svg');assert.equal(a.width,'100%');assert.equal(a.style,'height:auto');
 const ids=all.map(n=>attrs(n).id).filter(Boolean);assert.equal(ids.length,new Set(ids).size);for(const id of a['aria-labelledby'].split(' '))assert.equal(all.filter(n=>attrs(n).id===id&&['title','desc'].includes(tag(n))&&content(n).trim()).length,1);
 for(const n of all){const name=tag(n),at=attrs(n);assert.ok(Object.hasOwn(allowed,name),name);
  for(const[key,v]of Object.entries(at)){assert.ok(allowed[name].split(' ').includes(key),`Forbidden ${name}.${key}`);if(['fill','stroke'].includes(key))assert.match(v,colors);if(key==='d')pathPoints(v);if(key==='transform')assert.fail('Transforms are unsupported in this direct-coordinate composition');}
  if(name==='text'){assert.equal(at['font-weight'],'400');assert.equal(at['font-family'],'l0g Stablecoin Deposits');assert.ok(Number(at['font-size'])>=18);assert.ok(at['data-panel']);for(const ch of content(n))assert.notEqual(font.charToGlyphIndex(ch),0,`Missing licensed glyph ${ch}`);}
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
  const px=x,py=y;
  assert.ok(contains(frame,{x1:px,x2:px,y1:py,y2:py},2),`Path outside the viewBox: ${attrs(n).d}`);
 }
 for(const n of all.filter(n=>['rect','circle','line'].includes(tag(n)))){const a=attrs(n);if(a['data-label-region']==='true')continue;if(tag(n)==='rect')assert.ok(contains(frame,{x1:Number(a.x),y1:Number(a.y),x2:Number(a.x)+Number(a.width),y2:Number(a.y)+Number(a.height)}));if(tag(n)==='circle')assert.ok(contains(frame,{x1:Number(a.cx)-Number(a.r),y1:Number(a.cy)-Number(a.r),x2:Number(a.cx)+Number(a.r),y2:Number(a.cy)+Number(a.r)},2));if(tag(n)==='line')for(const[x,y]of[[Number(a.x1),Number(a.y1)],[Number(a.x2),Number(a.y2)]])assert.ok(contains(frame,{x1:x,x2:x,y1:y,y2:y},2));}
 if(attrs(root)['data-kind']==='funding'){
  const label=texts.find(n=>attrs(n)['data-metric']==='break-even-label');assert.ok(label,'Missing crossing label');const b=labelBox(label);
  for(const n of all.filter(n=>['retention-cost','replacement-cost'].includes(attrs(n)['data-metric']))){const pts=pathPoints(attrs(n).d);assert.equal(pts.length,2);const [[x0,y0],[x1,y1]]=pts;const left=Math.max(b.x1,x0),right=Math.min(b.x2,x1);if(left<=right){const ya=y0+(left-x0)*(y1-y0)/(x1-x0),yb=y0+(right-x0)*(y1-y0)/(x1-x0);assert.ok(Math.max(ya,yb)<b.y1-pad||Math.min(ya,yb)>b.y2+pad,'Crossing label intersects a model line');}}
 }
 return{root,all};
}
const matching=(svg,metric)=>inspect(svg).all.filter(n=>attrs(n)['data-metric']===metric);
const words=svg=>inspect(svg).all.filter(n=>['text','title','desc'].includes(tag(n))).map(content).join(' ');
test('twelve passive, uniquely labelled scenes use regular typography and readable compact variants',()=>{
 assert.equal(scenes.length,12);const ids=[];for(const scene of scenes){const{root,all}=geometry(scene.svg),[,,w,h]=attrs(root).viewBox.split(' ').map(Number);assert.equal(w,scene.mode==='mobile'?400:1000);assert.ok(h<=(scene.mode==='mobile'?880:700));if(scene.mode==='desktop')assert.ok(h*800/w<=560);else assert.ok(h*340/w<=750);for(const n of all){if(attrs(n).id)ids.push(attrs(n).id);if(tag(n)==='text')assert.ok(Number(attrs(n)['font-size'])*(scene.mode==='mobile'?280/400:660/1000)>=12);}
 assert.doesNotMatch(scene.svg,/—|(?:deux|2) horloges|two clocks|mérite mieux que|deserves better than/iu);}
 assert.equal(ids.length,new Set(ids).size);
});
test('primary issuance conserves aggregate deposits and reserves while changing claims',()=>{
 for(const s of scenes.filter(x=>x.kind==='mint')){for(const bank of['A','B'])for(const metric of['bank-deposits','bank-reserves']){const values=matching(s.svg,metric).filter(n=>attrs(n)['data-bank']===bank).map(n=>Number(attrs(n)['data-value']));assert.deepEqual(values,[bank==='A'?-100:100]);}for(const metric of['aggregate-deposits','aggregate-reserves']){const labels=matching(s.svg,metric);assert.deepEqual(labels.map(n=>Number(attrs(n)['data-value'])),[0]);assert.ok(labels.every(n=>content(n).startsWith('Δ ')),'Aggregate zeros must explicitly denote changes, not stocks');}assert.match(words(s.svg),s.lang==='fr'?/ficti/i:/fictional/i);}
});
test('counterparty and Treasury timing preserve all four aggregate outcomes',()=>{
 for(const s of scenes.filter(x=>x.kind==='counterparties')){const result={};for(const n of inspect(s.svg).all){const a=attrs(n),metric=a['data-metric'],key=a['data-case'];if(!key)continue;result[key]??={};if(metric==='aggregate-outcome')Object.assign(result[key],{deposits:Number(a['data-deposits']),reserves:Number(a['data-reserves'])});if(metric==='aggregate-deposits')result[key].deposits=Number(a['data-value']);if(metric==='aggregate-reserves')result[key].reserves=Number(a['data-value']);}assert.deepEqual(result,{'1':{deposits:0,reserves:0},'2':{deposits:-100,reserves:0},'3-before':{deposits:-100,reserves:-100},'3-after':{deposits:0,reserves:0}});assert.match(words(s.svg),/TGA/);}
});
test('funding lines retain the supplied fictional arithmetic with one honest-scale crossing',()=>{
 for(const s of scenes.filter(x=>x.kind==='funding')){const retain=attrs(matching(s.svg,'retention-cost')[0]),replace=attrs(matching(s.svg,'replacement-cost')[0]),point=attrs(matching(s.svg,'break-even')[0]);assert.equal(retain['data-formula'],'1000000000*10/10000');assert.equal(replace['data-formula'],'100000000*spreadBp/10000');assert.equal(retain['data-values'],'1,1');assert.equal(replace['data-values'],'0,2');const a=pathPoints(retain.d),b=pathPoints(replace.d);assert.equal(a[0][0],b[0][0]);assert.equal(a[1][0],b[1][0]);assert.equal(a[0][1],a[1][1]);assert.equal(a[0][1],(b[0][1]+b[1][1])/2);assert.equal(Number(point['data-bp']),100);assert.equal(Number(point['data-cost']),1000000);assert.equal(Number(point.cx),(a[0][0]+a[1][0])/2);assert.equal(Number(point.cy),a[0][1]);assert.match(words(s.svg),s.lang==='fr'?/fictif/i:/fictional/i);}
 assert.equal(1000000000*10/10000,1000000);assert.equal(100000000*100/10000,1000000);assert.equal(100000000*200/10000,2000000);
});

test('the funding annotation stays clear of both model lines; moving it with its region fails',()=>{
 const s=scenes.find(x=>x.kind==='funding'&&x.mode==='desktop'&&x.lang==='fr').svg;const all=inspect(s).all,label=matching(s,'break-even-label')[0],a=attrs(label),r=attrs(all.find(n=>attrs(n).id===a['data-panel']));let moved=s;
 const textTag=[...s.matchAll(/<text\b[^>]*>/gu)].map(x=>x[0]).find(x=>x.includes('data-metric="break-even-label"'));assert.ok(textTag);moved=moved.replace(textTag,textTag.replace('y="'+a.y+'"','y="'+(Number(a.y)+58)+'"'));
 const regionTag=[...s.matchAll(/<rect\b[^>]*>/gu)].map(x=>x[0]).find(x=>x.includes('id="'+a['data-panel']+'"'));assert.ok(regionTag);moved=moved.replace(regionTag,regionTag.replace('y="'+r.y+'"','y="'+(Number(r.y)+58)+'"'));assert.throws(()=>geometry(moved),/intersects a model line/);
});

test('active markup, heavy type, unknown regions and overflowing geometry fail closed',()=>{
 const s=scenes[0].svg;for(const value of[s.replace('</svg>','<script>alert(1)</script></svg>'),s.replace('<svg ','<svg onload="x" '),s.replace('<svg ','<svg href="https://evil.invalid/" '),s.replace('font-weight="400"','font-weight="700"'),s.replace('data-panel="stablecoin-mint-fr-d-region-1"','data-panel="missing"'),s.replace('x="32" y="42"','x="999" y="42"')])assert.throws(()=>geometry(value));
});
test('the shared path parser consumes complete input and rejects oversized numeric payloads',{timeout:1000},()=>{
 const d='M110 493 L935 248';assert.deepEqual(pathPoints(d),[[110,493],[935,248]]);for(const value of[d+' x',d+'e9',d+' LNaN 0','M0 0 L'+'9'.repeat(4096)+' 0',d+' Q0 0 0 0'])assert.throws(()=>pathPoints(value));
});
test('controlled art, canonical licensed font, methods and compact responsive wrappers remain intact',()=>{
 assertFontLicenseReferences(readFileSync(new URL('../public/fonts/ukraine-reparations/LICENSE.txt',import.meta.url),'utf8'),'liberation');assert.match(component,/Object\.prototype\.hasOwnProperty\.call\(info,kind\)/);assert.match(component,/@container \(max-width:660px\)/);assert.match(component,/max-width:340px/);assert.match(component,/padding-bottom:1rem/);assert.match(component,/\/fonts\/ukraine-reparations\/liberation-sans-400\.ttf/);assert.doesNotMatch(component,/overflow\s*:\s*hidden|font-weight:\s*700|<script/);assert.match(component,/'#methode-bilans'/);assert.match(component,/'#methode-financement'/);assert.match(component,/`#source-\$\{id\}`/);
});
