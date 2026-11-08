import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {XMLParser,XMLValidator} from 'fast-xml-parser';
import opentype from '@shuding/opentype.js';
import {tag,attrs,nodes,content} from './nebius-credit-svg-assertions.mjs';
import {pathPoints} from './insurance-returns-svg-assertions.mjs';
import {assertFontLicenseReferences} from './font-license-assertions.mjs';
const component=readFileSync(new URL('../src/components/TrumpPortfolioFigure.astro',import.meta.url),'utf8');
const start=component.indexOf('const art = ')+'const art = '.length;
const art=JSON.parse(component.slice(start,component.indexOf(' as const;',start)));
const scenes=['fr','en'].flatMap(lang=>['intel','floor','korea'].flatMap(kind=>['desktop','mobile'].map(mode=>({lang,kind,mode,svg:art[lang][kind][mode]}))));
const parser=new XMLParser({ignoreAttributes:false,attributeNamePrefix:'',preserveOrder:true,trimValues:false,parseTagValue:false});
const bytes=readFileSync(new URL('../public/fonts/ukraine-reparations/liberation-sans-400.ttf',import.meta.url)),font=opentype.parse(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength));
const color=/^(?:none|var\(--color-(?:ink|surface|surface-2|paper|muted|line-strong|signal|accent|amber)\))$/u;
function inspect(svg){
 assert.equal(XMLValidator.validate(svg),true);assert.doesNotMatch(svg,/<!DOCTYPE|<!ENTITY|<!\[CDATA\[|<\?|<(?:script|foreignObject|image|use)\b|\bon[a-z]+\s*=|\b(?:href|src)\s*=|url\(/iu);
 const roots=parser.parse(svg);assert.equal(roots.length,1);const root=roots[0],all=nodes(root),a=attrs(root);
 assert.equal(tag(root),'svg');assert.equal(a.role,'img');assert.equal(a.xmlns,'http://www.w3.org/2000/svg');assert.equal(a.style,'width:100%;height:auto');assert.equal(a.class,'l0g-trump-svg');
 const ids=all.map(n=>attrs(n).id).filter(Boolean);assert.equal(ids.length,new Set(ids).size);for(const id of a['aria-labelledby'].split(' '))assert.equal(all.filter(n=>attrs(n).id===id&&['title','desc'].includes(tag(n))&&content(n).trim()).length,1);
 for(const n of all){const name=tag(n),at=attrs(n);assert.ok(['svg','title','desc','rect','text','path','circle','line','g'].includes(name),name);
  for(const [key,v]of Object.entries(at)){assert.ok(!/^on/iu.test(key));if(['fill','stroke'].includes(key))assert.match(v,color);if(key==='d')pathPoints(v);if(key==='transform')assert.equal(v,'matrix(0.8 0 0 0.8 0 -100)');}
  if(name==='text'){assert.equal(at['font-weight'],'400');assert.equal(at['font-family'],'l0g Trump Portfolio');assert.ok(Number(at['font-size'])>=18.5);for(const ch of content(n))assert.notEqual(font.charToGlyphIndex(ch),0,`Unlicensed or missing glyph ${ch}`);}
 }
 return{root,all};
}
function labelBox(n){const a=attrs(n),s=Number(a['font-size']),value=content(n),advance=font.getAdvanceWidth(value,s,{kerning:true}),x=Number(a.x)-(a['text-anchor']==='middle'?advance/2:a['text-anchor']==='end'?advance:0),y=Number(a.y);return{x1:x,y1:y-font.ascender*s/font.unitsPerEm,x2:x+advance,y2:y-font.descender*s/font.unitsPerEm,value};}
const contains=(a,b,p=0)=>b.x1>=a.x1+p&&b.y1>=a.y1+p&&b.x2<=a.x2-p&&b.y2<=a.y2-p;
function geometry(svg){const{root,all}=inspect(svg),[,,w,h]=attrs(root).viewBox.split(' ').map(Number),frame={x1:0,y1:0,x2:w,y2:h},scaled=all.some(n=>tag(n)==='g'),map=b=>scaled?{...b,x1:b.x1*.8,x2:b.x2*.8,y1:b.y1*.8-100,y2:b.y2*.8-100}:b;const texts=all.filter(n=>tag(n)==='text'),boxes=texts.map(labelBox);
 for(const [i,b]of boxes.entries()){assert.ok(contains(frame,map(b),2),b.value);const region=attrs(texts[i])['data-panel'];if(region){const a=attrs(all.find(n=>attrs(n).id===region)??{});assert.ok(a.width,'Missing intended label region');assert.ok(contains({x1:Number(a.x),y1:Number(a.y),x2:Number(a.x)+Number(a.width),y2:Number(a.y)+Number(a.height)},b,1),`Label escapes its region: ${b.value}`);}}
 for(const[i,a]of boxes.entries())for(const b of boxes.slice(i+1))assert.ok(Math.min(a.x2,b.x2)-Math.max(a.x1,b.x1)<=1||Math.min(a.y2,b.y2)-Math.max(a.y1,b.y1)<=1,`Full-font label overlap: ${a.value} / ${b.value}`);
 for(const n of all.filter(n=>tag(n)==='path'))for(const[x,y]of pathPoints(attrs(n).d)){const p=map({x1:x,x2:x,y1:y,y2:y});assert.ok(contains(frame,p),`Path outside the viewBox: ${attrs(n).d}`);}
 return{root,all};
}
const matching=(svg,metric)=>inspect(svg).all.filter(n=>attrs(n)['data-metric']===metric);
const words=svg=>inspect(svg).all.filter(n=>['text','title','desc'].includes(tag(n))).map(content).join(' ');

test('twelve scenes are passive, uniquely labelled, regular-weight and readable at the responsive threshold',()=>{
 assert.equal(scenes.length,12);const ids=[];
 for(const scene of scenes){const{root,all}=geometry(scene.svg),[,,w,h]=attrs(root).viewBox.split(' ').map(Number);assert.equal(w,scene.mode==='mobile'?420:1000);assert.ok(h<= (scene.mode==='mobile'?920:700));if(scene.mode==='desktop')assert.ok(h*800/w<=560);for(const n of all){if(attrs(n).id)ids.push(attrs(n).id);if(tag(n)==='text')assert.ok(Number(attrs(n)['font-size'])*(scene.mode==='mobile'?280/420:660/1000)*(scene.kind==='floor'&&scene.mode==='desktop'?.8:1)>=12);}
  assert.doesNotMatch(scene.svg,/—|(?:deux|2) horloges|two clocks|mérite mieux que|deserves better than/iu);
 }
 assert.equal(ids.length,new Set(ids).size);
});
test('Intel preserves the dated announced stake and the distinct commercial and Secure Enclave scopes',()=>{
 for(const s of scenes.filter(s=>s.kind==='intel')){const funding=matching(s.svg,'announced-funding');assert.equal(funding.length,1);const a=attrs(funding[0]);assert.equal(a['data-value'],'5.7');assert.equal(a['data-scope'],'commercial-chips');assert.ok(Math.abs(Number(a.width)/(s.mode==='mobile'?372:940)-5.7/8.9)<1e-10);assert.equal(attrs(matching(s.svg,'eligible-cost')[0])['data-value'],'7.865');const stake=attrs(matching(s.svg,'announced-stake')[0]);assert.equal(stake['data-value'],'9.9');assert.equal(stake['data-date'],'2025-08-22');assert.match(words(s.svg),/Secure Enclave/);assert.match(words(s.svg),s.lang==='fr'?/Obligations maintenues/:/Obligations remain/);}
});
test('the price floor retains the archived piecewise curves, fixed-volume examples and milestone condition',()=>{
 for(const s of scenes.filter(s=>s.kind==='floor')){const pay=attrs(matching(s.svg,'floor-payment')[0]),ret=attrs(matching(s.svg,'floor-return')[0]);assert.equal(pay['data-floor'],'110');assert.equal(pay['data-unit'],'USD/kg');assert.equal(ret['data-rate'],'0.30');assert.equal(ret['data-condition'],'after-10x');if(s.mode==='desktop'){assert.equal(pay.d,'M 86.0 308.5 L 807.1875 633.0 L 1135.0 633.0');assert.equal(ret.d,'M 807.1875 633.0 L 1135.0 588.75');}else{assert.deepEqual(pathPoints(pay.d),[[62,125.83333333333334],[287.5,355],[390,355]]);assert.deepEqual(pathPoints(ret.d),[[287.5,355],[390,323.75]]);}const text=words(s.svg);assert.match(text,/50/);assert.match(text,/20/);assert.match(text,/6/);assert.match(text,/10X/);assert.match(text,s.lang==='fr'?/scénarios|Simulation|simulations/i:/hypothetical|scenario|Simulation/i);assert.equal(Math.max(110-60,0)*1000000,50000000);assert.equal(Math.max(110-90,0)*1000000,20000000);assert.equal(.3*Math.max(130-110,0)*1000000,6000000);}
});
test('Crucible keeps ownership, subscribed equity, associated interest and direct debt as separate edges',()=>{
 const edges=[['pentagon','jv','mixed-funding'],['investors','jv','equity'],['korea-zinc','jv','equity'],['jv','korea-zinc','share-subscription'],['korea-zinc','project','project-equity'],['jv','commerce','associated-interest'],['commerce','project','grant'],['pentagon','project','project-debt'],['banks','project','project-debt']].map(a=>a.join('|')).sort();
 for(const s of scenes.filter(s=>s.kind==='korea')){const actual=inspect(s.svg).all.filter(n=>attrs(n)['data-from']).map(n=>{const a=attrs(n);return[a['data-from'],a['data-to'],a['data-metric']].join('|');}).sort();assert.deepEqual(actual,edges);assert.match(words(s.svg),s.lang==='fr'?/10,59 %/:/10\.59%/);assert.match(words(s.svg),s.lang==='fr'?/déjà transférés/:/already transferred/);assert.match(words(s.svg),s.lang==='fr'?/prévu|prévoi/:/planned|Planned/);assert.equal(matching(s.svg,'project-debt').length,2);}
});
test('unsafe active markup, heavy type and geometry escape are rejected',()=>{
 const s=scenes[0].svg;for(const value of [s.replace('</svg>','<script>alert(1)</script></svg>'),s.replace('<svg ','<svg onload="x" '),s.replace('<svg ','<svg href="https://evil.invalid/" '),s.replace('font-weight="400"','font-weight="700"'),s.replace('data-panel="trump-intel-fr-d-label1"','data-panel="missing"'),s.replace('x="30" y="42"','x="999" y="42"')])assert.throws(()=>geometry(value));
});
test('the component uses controlled art, scoped source links, a licensed font and unmasked responsive layouts',()=>{
 assertFontLicenseReferences(readFileSync(new URL('../public/fonts/ukraine-reparations/LICENSE.txt',import.meta.url),'utf8'),'liberation');assert.match(component,/Object\.prototype\.hasOwnProperty\.call\(info,kind\)/);assert.match(component,/@container \(max-width:660px\)/);assert.match(component,/max-width:340px/);assert.match(component,/padding-bottom:1rem/);assert.match(component,/\/fonts\/ukraine-reparations\/liberation-sans-400\.ttf/);assert.doesNotMatch(component,/overflow\s*:\s*hidden|font-weight:\s*700|<script/);assert.match(component,/id\.toLowerCase\(\)/);
});
