import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {XMLParser,XMLValidator} from 'fast-xml-parser';
import opentype from '@shuding/opentype.js';
import {tag,attrs,nodes,content} from './nebius-credit-svg-assertions.mjs';
import {pathPoints} from './insurance-returns-svg-assertions.mjs';
import {assertFontLicenseReferences} from './font-license-assertions.mjs';
const component=readFileSync(new URL('../src/components/NvidiaInfluenceFigure.astro',import.meta.url),'utf8');
const start=component.indexOf('const art = ')+'const art = '.length;
const art=JSON.parse(component.slice(start,component.indexOf(' as const;',start)));
const scenes=['fr','en'].flatMap(lang=>['access','finance'].flatMap(kind=>['desktop','mobile'].map(mode=>({lang,kind,mode,svg:art[lang][kind][mode]}))));
const parser=new XMLParser({ignoreAttributes:false,attributeNamePrefix:'',preserveOrder:true,trimValues:false,parseTagValue:false});
const bytes=readFileSync(new URL('../public/fonts/ukraine-reparations/liberation-sans-400.ttf',import.meta.url)),font=opentype.parse(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength));
const colors=/^(?:none|var\(--color-(?:ink|surface|surface-2|paper|muted|line-strong|signal|accent|amber)\))$/u;

const allowed={
 svg:'xmlns width style viewBox role aria-labelledby xml:lang data-kind data-variant',title:'id',desc:'id',
 rect:'x y width height fill stroke rx id data-label-region data-metric data-value data-company data-counted data-unit data-scale',
 text:'x y fill font-family font-size font-weight text-anchor data-panel data-painted-panel data-metric data-value data-denominator data-unit data-company data-origin data-status data-period',
 line:'x1 y1 x2 y2 stroke stroke-width stroke-linecap stroke-dasharray data-relationship data-from data-to data-status data-route data-unit',
 circle:'cx cy r fill stroke stroke-width data-metric data-unit data-filled',
 path:'d stroke stroke-width fill stroke-linecap stroke-linejoin transform data-metric data-model data-formula data-values data-relationship data-from data-to data-status',
};
function inspect(svg){
 assert.equal(XMLValidator.validate(svg),true);assert.doesNotMatch(svg,/<!DOCTYPE|<!ENTITY|<!\[CDATA\[|<\?|<(?:script|foreignObject|image|use)\b|\bon[a-z]+\s*=|\b(?:href|src)\s*=|url\(/iu);
 const roots=parser.parse(svg);assert.equal(roots.length,1);const root=roots[0],all=nodes(root),a=attrs(root);
 assert.equal(tag(root),'svg');assert.equal(a.role,'img');assert.equal(a.xmlns,'http://www.w3.org/2000/svg');assert.equal(a.width,'100%');assert.equal(a.style,'height:auto');
 const ids=all.map(n=>attrs(n).id).filter(Boolean);assert.equal(ids.length,new Set(ids).size);for(const id of a['aria-labelledby'].split(' '))assert.equal(all.filter(n=>attrs(n).id===id&&['title','desc'].includes(tag(n))&&content(n).trim()).length,1);
 for(const n of all){const name=tag(n),at=attrs(n);assert.ok(Object.hasOwn(allowed,name),name);
  for(const[key,v]of Object.entries(at)){assert.ok(allowed[name].split(' ').includes(key),`Forbidden ${name}.${key}`);if(['fill','stroke'].includes(key))assert.match(v,colors);if(key==='d')pathPoints(v);if(key==='transform')assert.fail('Transforms are unsupported in this direct-coordinate composition');}
  if(name==='text'){assert.equal(at['font-weight'],'400');assert.equal(at['font-family'],'l0g Nvidia Investigation');assert.ok(Number(at['font-size'])>=18);assert.ok(at['data-panel']);for(const ch of content(n))assert.notEqual(font.charToGlyphIndex(ch),0,`Missing licensed glyph ${ch}`);}
 }
 return{root,all};
}
const contains=(a,b,p=0)=>b.x1>=a.x1+p&&b.y1>=a.y1+p&&b.x2<=a.x2-p&&b.y2<=a.y2-p;
function labelBox(n){const a=attrs(n),s=Number(a['font-size']),value=content(n),advance=font.getAdvanceWidth(value,s,{kerning:true}),x=Number(a.x)-(a['text-anchor']==='middle'?advance/2:a['text-anchor']==='end'?advance:0),y=Number(a.y);return{x1:x,y1:y-font.ascender*s/font.unitsPerEm,x2:x+advance,y2:y-font.descender*s/font.unitsPerEm,value};}
function geometry(svg){const{root,all}=inspect(svg),[,,w,h]=attrs(root).viewBox.split(' ').map(Number),frame={x1:0,y1:0,x2:w,y2:h},texts=all.filter(n=>tag(n)==='text'),boxes=texts.map(labelBox),scale=attrs(root)['data-variant']==='mobile'?280/400:660/1000,pad=2.01/scale;
 for(const[i,b]of boxes.entries()){
  assert.ok(contains(frame,b,pad),`Label escapes root: ${b.value}`);const region=attrs(texts[i])['data-panel'],a=attrs(all.find(n=>attrs(n).id===region)??{});assert.ok(a.width,'Missing intended label region');assert.ok(contains({x1:Number(a.x),y1:Number(a.y),x2:Number(a.x)+Number(a.width),y2:Number(a.y)+Number(a.height)},b),`Label escapes its logical region: ${b.value}`);const paintedId=attrs(texts[i])['data-painted-panel'];if(paintedId){const paint=all.find(n=>attrs(n).id===paintedId);assert.ok(paint,'Assigned painted panel exists');assert.equal(tag(paint),'rect');const q=attrs(paint);assert.notEqual(q['data-label-region'],'true');assert.ok(contains({x1:Number(q.x),y1:Number(q.y),x2:Number(q.x)+Number(q.width),y2:Number(q.y)+Number(q.height)},b,pad),`Label escapes assigned painted panel: ${b.value}`);}const painted=all.filter(n=>tag(n)==='rect'&&attrs(n)['data-label-region']!=='true'&&(attrs(n).fill!=='none'||attrs(n).stroke!=='none')).map(n=>{const r=attrs(n);return{x1:Number(r.x),y1:Number(r.y),x2:Number(r.x)+Number(r.width),y2:Number(r.y)+Number(r.height)};}).filter(r=>(b.x1+b.x2)/2>=r.x1&&(b.x1+b.x2)/2<=r.x2&&(b.y1+b.y2)/2>=r.y1&&(b.y1+b.y2)/2<=r.y2).sort((x,y)=>(x.x2-x.x1)*(x.y2-x.y1)-(y.x2-y.x1)*(y.y2-y.y1))[0];if(painted)assert.ok(contains(painted,b,pad),`Label escapes its painted panel: ${b.value}`);
 }
 for(const[i,a]of boxes.entries())for(const b of boxes.slice(i+1))assert.ok(Math.min(a.x2,b.x2)-Math.max(a.x1,b.x1)<=1||Math.min(a.y2,b.y2)-Math.max(a.y1,b.y1)<=1,`Full-font label overlap: ${a.value} / ${b.value}`);
 for(const n of all.filter(n=>tag(n)==='path'))for(const[x,y]of pathPoints(attrs(n).d)){
  const px=x,py=y;
  assert.ok(contains(frame,{x1:px,x2:px,y1:py,y2:py},2),`Path outside the viewBox: ${attrs(n).d}`);
 }
 for(const n of all.filter(n=>['rect','circle','line'].includes(tag(n)))){const a=attrs(n);if(a['data-label-region']==='true')continue;if(tag(n)==='rect')assert.ok(contains(frame,{x1:Number(a.x),y1:Number(a.y),x2:Number(a.x)+Number(a.width),y2:Number(a.y)+Number(a.height)}));if(tag(n)==='circle')assert.ok(contains(frame,{x1:Number(a.cx)-Number(a.r),y1:Number(a.cy)-Number(a.r),x2:Number(a.cx)+Number(a.r),y2:Number(a.cy)+Number(a.r)},2));if(tag(n)==='line')for(const[x,y]of[[Number(a.x1),Number(a.y1)],[Number(a.x2),Number(a.y2)]])assert.ok(contains(frame,{x1:x,x2:x,y1:y,y2:y},2));}
 return{root,all};
}

test('eight passive scenes retain licensed regular type and padded internal geometry',()=>{
 assert.equal(scenes.length,8);const ids=[];
 for(const scene of scenes){const {root,all}=geometry(scene.svg);const [,,w,h]=attrs(root).viewBox.split(' ').map(Number);assert.equal(w,scene.mode==='mobile'?400:1000);assert.ok(h<=(scene.mode==='mobile'?760:620));for(const n of all){if(attrs(n).id)ids.push(attrs(n).id);if(tag(n)==='text')assert.ok(Number(attrs(n)['font-size'])*(scene.mode==='mobile'?280/400:660/1000)>=12);}assert.doesNotMatch(scene.svg,/—|horloges|clocks|mérite mieux que|deserves better/iu);}
 assert.equal(ids.length,new Set(ids).size);
});
test('physical delivery and remote access keep separate explicitly labelled paths',()=>{
 for(const scene of scenes.filter(s=>s.kind==='access')){const lines=inspect(scene.svg).all.filter(n=>attrs(n)['data-relationship']).map(attrs);assert.ok(lines.some(a=>a['data-relationship']==='physical'));assert.ok(lines.some(a=>a['data-relationship']==='remote'));for(const a of lines)assert.equal(Boolean(a['stroke-dasharray']),a['data-relationship']==='remote');assert.doesNotMatch(inspect(scene.svg).all.filter(n=>tag(n)==='text').map(content).join(' '),/Megaspeed|Xi.an|Speedmatrix|874/);}
});
test('security points from grantor to chargee and is distinct from parentage or a cash payment',()=>{
 for(const scene of scenes.filter(s=>s.kind==='finance')){const relations=inspect(scene.svg).all.filter(n=>attrs(n)['data-relationship']).map(attrs);assert.deepEqual(relations.map(a=>[a['data-relationship'],a['data-from'],a['data-to'],a['data-status']]),[['ultimate-parent','Alibaba','Apex','reproduced-record'],['security-interest','Speedmatrix','Apex','reproduced-record']]);assert.doesNotMatch(scene.svg,/4[.,]1|4 152|4,152|loan paid|prêt versé/);assert.match(scene.svg,/Culper/);assert.match(scene.svg,/2024/);}
});
test('unknown active markup, heavy type and internal text overflow fail closed',()=>{
 const s=scenes[0].svg;
 for(const bad of[s.replace('</svg>','<script>alert(1)</script></svg>'),s.replace('<svg ','<svg onload="x" '),s.replace('font-weight="400"','font-weight="700"'),s.replace('x="24" y="40"','x="999" y="40"'),s.replace('data-panel="nvi-access-fr-d-region-1"','data-panel="missing"')])assert.throws(()=>geometry(bad));
});
test('container variants and controlled static markup preserve font attribution',()=>{
 assertFontLicenseReferences(readFileSync(new URL('../public/fonts/ukraine-reparations/LICENSE.txt',import.meta.url),'utf8'),'liberation');
 assert.match(component,/Object\.prototype\.hasOwnProperty\.call\(titles,kind\)/);assert.match(component,/@container \(max-width:660px\)/);assert.match(component,/max-width:340px/);assert.match(component,/padding-bottom:1rem/);assert.doesNotMatch(component,/overflow\s*:\s*hidden|font-weight:\s*700|<script/);
});
