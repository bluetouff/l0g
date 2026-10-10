import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {XMLParser,XMLValidator} from 'fast-xml-parser';
import postcss from 'postcss';
import sharp from 'sharp';
import {craDisclosureSvg,validateCraDisclosureFigure,CRA_KINDS,CRA_FACTS} from '../src/lib/craDisclosureFigures.mjs';

const kinds=['threshold','clocks','routing','curl','feedback'];
const variants=['fr','en'].flatMap(lang=>kinds.flatMap(kind=>[false,true].map(mobile=>({lang,kind,mobile,name:`${kind}-${lang}-${mobile?'mobile':'desktop'}`,svg:craDisclosureSvg(lang,kind,mobile)}))));
const parser=new XMLParser({preserveOrder:true,ignoreAttributes:false,attributeNamePrefix:'',trimValues:false,parseTagValue:false,parseAttributeValue:false});
const tag=n=>Object.keys(n).find(k=>k!==':@'),attrs=n=>n[':@']||{},children=n=>n[tag(n)]||[];
const all=n=>tag(n)==='#text'?[]:[n,...children(n).flatMap(all)];
const content=n=>tag(n)==='#text'?n['#text']:children(n).map(content).join('');
const num=(n,k,f=0)=>{const v=Number(attrs(n)[k]??f);assert.ok(Number.isFinite(v));return v;};
const native={};postcss.parse(readFileSync(new URL('../src/styles/global.css',import.meta.url),'utf8')).walkDecls(d=>{if(d.parent.type==='atrule'&&d.parent.name==='theme')native[d.prop]=d.value;});
const paint=role=>`var(--color-${role}, ${native[`--color-${role}`]})`;
const safePaints=new Set(['none',...['ink','surface','surface-2','paper','muted','line-strong','signal','amber','topic-blue','accent'].map(paint)]);
const safeTags=new Set('svg title desc g rect line path circle text'.split(' '));
const safeAttributes=new Set('xmlns viewBox width height role aria-labelledby data-cra-kind style id x y rx fill stroke stroke-width x1 y1 x2 y2 stroke-dasharray d stroke-linecap stroke-linejoin cx cy r font-family font-size font-weight text-anchor data-label data-bounds'.split(' '));
function inspect(svg){
 assert.equal(XMLValidator.validate(svg),true);assert.doesNotMatch(svg,/<!|<\?/u);
 const tree=parser.parse(svg);assert.equal(tree.length,1);const root=tree[0],nodes=all(root),ids=new Set();
 assert.equal(tag(root),'svg');assert.equal(attrs(root).xmlns,'http://www.w3.org/2000/svg');assert.equal(attrs(root).role,'img');assert.equal(attrs(root).style,'display:block;width:100%;height:auto');
 for(const n of nodes){assert.ok(safeTags.has(tag(n)),tag(n));for(const[k,v]of Object.entries(attrs(n))){assert.ok(safeAttributes.has(k),k);assert.equal(typeof v,'string');if(k==='fill'||k==='stroke')assert.ok(safePaints.has(v),v);if(k==='id'){assert.match(v,/^cra-disclosure-(?:threshold|clocks|routing|curl|feedback)-(?:fr|en)-(?:desktop|mobile)-(?:title|desc)$/u);assert.ok(!ids.has(v));ids.add(v);}if(k==='style'){assert.equal(n,root);assert.equal(v,attrs(root).style);}assert.ok(!v.includes('url('));if(k==='font-family')assert.equal(v,'Arial, Helvetica, sans-serif');if(k==='font-size')assert.ok(num(n,k)>=13&&num(n,k)<=105);if(k==='font-weight')assert.ok(['400','500','600','700'].includes(v));}}
 const aria=attrs(root)['aria-labelledby'].split(' ');assert.equal(aria.length,2);for(const type of ['title','desc']){const n=nodes.filter(n=>tag(n)===type);assert.equal(n.length,1);assert.ok(aria.includes(attrs(n[0]).id));assert.ok(content(n[0]).trim());}
 return{root,nodes};
}
// Independent fingerprints of supplied XML. Only theme paints and local
// accessibility IDs are omitted. The two desktop B-note blocks were moved
// five SVG units upward to repair a 0.63/0.82-unit bottom card margin.
// Normalize this precise exception back to its original coordinates; all
// remaining geometry, fonts, labels, notes and primitive order stay locked.
const originalSignatures={
  "clocks-en-desktop": "1b413ff4bdeca2d4ef9ced56f8a5da7eb50d366725eba3fec435f6482b387989",
  "clocks-en-mobile": "e63da7bcacbcf3445503b0198e123567d6d747547cdcfe9fe05ecb9b6bb83a79",
  "clocks-fr-desktop": "3a7fa23bf3722eff40055fee1907d5eaabf6b178f6df56e12d365e0c29f9c40d",
  "clocks-fr-mobile": "b0b6bb8286b3f8c789b8426f95ffbc7bfe2fbf23d14407e28a75974432b3dccf",
  "curl-en-desktop": "1c619c00332650759581897d1f4e9a15a4094cc764b5029cd36d276de60a6b30",
  "curl-en-mobile": "f8b822d1a0e10886b1739ed181fb5fffb7cb2dc4cd34b77bd7005fc2ba2d4f37",
  "curl-fr-desktop": "f0ad7038afa729fca1348a05c3c4352e90cab8f8e79dfc07b834a790b09034d9",
  "curl-fr-mobile": "8c6655159fd06eb275d6cecbbe4ebae384fd9ce239290c72ea18d2b9811f63d4",
  "feedback-en-desktop": "0869dc353ed386075c7c60e7d7b3a42e09899568242671b3dbaef3e50079b4cc",
  "feedback-en-mobile": "11d0c70a9979c8eff60790e5ccc7b4e9c2859237b78a91a7236e2d4bb9c21a1a",
  "feedback-fr-desktop": "415f70fcb8e94fa1ad63386cfbd5eb7abad69687368b45dc1d21419fa7daa77e",
  "feedback-fr-mobile": "b6922a2c978250ce2fcc00108419f4118f865f492eeaae619a4a8179456d3f58",
  "routing-en-desktop": "3c138c2962dbf73d5a398e79d9c735535befc06e6dd4d39aa46d431744405ca5",
  "routing-en-mobile": "d899c9a85a05bc587dc0ee0926a59064761480b0ded69439351fa67a8bf529f5",
  "routing-fr-desktop": "f437388fb098363dbabf2cc409db9e8724d51e8f2b2def90996faa885e245971",
  "routing-fr-mobile": "d19e0906084f73c528939673bcba2020706121bd95ae9feeefff80e5ba9e04a4",
  "threshold-en-desktop": "aee77e621af522f1184a050df407c3b53b8ac7f22de6f8667f50415807ffab62",
  "threshold-en-mobile": "3ecdf39740e0c1100e69f3ae401a54663f169403f418aef0799a098ed21c4303",
  "threshold-fr-desktop": "93212526a08697a9ea999a116cff0b2f9f44a3c15561486d2de2ac77a5325f19",
  "threshold-fr-mobile": "09fd84503f2016a5f2990ee492f92ca18908f610f18a79ea7782b9b15034d255"
};
function signature(v){
 const {nodes}=inspect(v.svg),b=nodes.find(n=>tag(n)==='g'&&attrs(n)['data-label']==='B-note');
 if(v.kind==='routing'&&!v.mobile){assert.equal(attrs(b)['data-bounds'],'326 480 350 52');const t=children(b).filter(n=>tag(n)==='text');assert.deepEqual(t.map(n=>[num(n,'x'),num(n,'y'),attrs(n)['font-size'],attrs(n)['font-weight'],attrs(n)['text-anchor']]),[[501,496,'16','500','middle'],[501,518,'16','500','middle']]);}
 const entries=nodes.map(n=>{const a={...attrs(n)};if(v.kind==='routing'&&!v.mobile){if(n===b)a['data-bounds']='326 485 350 52';if(children(b).includes(n)&&tag(n)==='text')a.y=String(Number(a.y)+5);}return[tag(n),Object.entries(a).filter(([k])=>!['fill','stroke','id','aria-labelledby','data-cra-kind'].includes(k)).sort(([a],[b])=>a.localeCompare(b)),['text','title','desc'].includes(tag(n))?content(n):''];});
 return createHash('sha256').update(JSON.stringify(entries)).digest('hex');
}
test('all twenty supplied compositions remain unchanged apart from native paints, IDs and two documented label-margin repairs',()=>{
 assert.equal(variants.length,20);assert.deepEqual(CRA_KINDS,kinds);for(const v of variants)assert.equal(signature(v),originalSignatures[v.name],v.name);
});
test('twenty static diagrams are inert, uniquely accessible and use actual native theme tokens',()=>{
 const ids=new Set();for(const v of variants){const {nodes}=inspect(v.svg);for(const n of nodes)if(attrs(n).id){assert.ok(!ids.has(attrs(n).id));ids.add(attrs(n).id);}for(const n of nodes.filter(n=>tag(n)==='title'))assert.doesNotMatch(content(n),/ce (?:que|qui|qu[’'])|what .* (?:means|reveals)|—/iu);}assert.equal(ids.size,40);
 for(const v of variants){const {root,nodes}=inspect(v.svg);assert.equal(attrs(nodes.find(n=>tag(n)==='rect')).fill,paint('ink'));assert.equal(num(root,'width'),v.mobile?400:1000);assert.equal(num(root,'height'),attrs(root).viewBox.split(' ').map(Number)[3]);}
});
const glyphCache=new Map();
async function glyph(n){const a=attrs(n),value=content(n),key=JSON.stringify([a['font-size'],a['font-weight'],a['text-anchor'],value]);if(!glyphCache.has(key)){const escaped=value.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="8192" height="256"><text x="4096" y="160" fill="white" font-family="Arial, Helvetica, sans-serif" font-size="${a['font-size']}" font-weight="${a['font-weight']}" text-anchor="${a['text-anchor']}">${escaped}</text></svg>`;const{info}=await sharp(Buffer.from(svg)).trim().raw().toBuffer({resolveWithObject:true});const x=-info.trimOffsetLeft-4096,y=-info.trimOffsetTop-160;glyphCache.set(key,{x,y,right:x+info.width,bottom:y+info.height});}return glyphCache.get(key);}
test('actual glyphs fit their canvas and enclosing cards with padding, without collisions or later paints concealing text',async()=>{
 for(const v of variants){const{root,nodes}=inspect(v.svg),[, ,width,height]=attrs(root).viewBox.split(' ').map(Number),leaves=nodes.filter(n=>['rect','line','circle','path','text'].includes(tag(n)));const boxes=[];
 const inside=(x,y)=>assert.ok(x>=0&&y>=0&&x<=width&&y<=height,`${v.name}: outside viewBox ${x},${y}`);
 for(const n of leaves){if(tag(n)==='rect'){inside(num(n,'x'),num(n,'y'));inside(num(n,'x')+num(n,'width'),num(n,'y')+num(n,'height'));}if(tag(n)==='line'){inside(num(n,'x1'),num(n,'y1'));inside(num(n,'x2'),num(n,'y2'));}if(tag(n)==='circle'){inside(num(n,'cx')-num(n,'r'),num(n,'cy')-num(n,'r'));inside(num(n,'cx')+num(n,'r'),num(n,'cy')+num(n,'r'));}}
 for(const n of leaves.filter(n=>tag(n)==='text')){const g=await glyph(n),x=num(n,'x'),y=num(n,'y'),b={x:x+g.x,y:y+g.y,right:x+g.right,bottom:y+g.bottom,label:content(n)};assert.ok(b.x>=2&&b.y>=2&&b.right<=width-2&&b.bottom<=height-2,`${v.name}: canvas ${b.label}`);const ix=leaves.indexOf(n),earlier=leaves.slice(0,ix),cx=(b.x+b.right)/2,cy=(b.y+b.bottom)/2;const card=earlier.filter(c=>tag(c)==='rect'&&num(c,'rx')>0&&num(c,'width')>80&&num(c,'x')>0&&cx>=num(c,'x')&&cx<=num(c,'x')+num(c,'width')&&cy>=num(c,'y')&&cy<=num(c,'y')+num(c,'height')).at(-1);if(card)assert.ok(b.x>=num(card,'x')+2&&b.y>=num(card,'y')+2&&b.right<=num(card,'x')+num(card,'width')-2&&b.bottom<=num(card,'y')+num(card,'height')-2,`${v.name}: card ${b.label}`);for(const other of boxes)assert.ok(!(b.x<other.right&&b.right>other.x&&b.y<other.bottom&&b.bottom>other.y),`${v.name}: glyph collision ${other.label}/${b.label}`);for(const cover of leaves.slice(ix+1).filter(c=>tag(c)==='rect'&&attrs(c).fill!=='none'))assert.ok(!(b.x<num(cover,'x')+num(cover,'width')&&b.right>num(cover,'x')&&b.y<num(cover,'y')+num(cover,'height')&&b.bottom>num(cover,'y')),`${v.name}: concealed ${b.label}`);boxes.push(b);}
 }
});
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-10,`${a} != ${b}`);
const label=(nodes,name)=>{const n=nodes.find(n=>tag(n)==='g'&&attrs(n)['data-label']===name);assert.ok(n,name);return content(n).replace(/\s+/gu,' ');};
test('the illustrated counter offset preserves the legal awareness origin and two separate final-report triggers',()=>{
 assert.deepEqual(CRA_FACTS.awarenessHours,[24,72]);assert.equal(CRA_FACTS.illustrativeWarningHour+CRA_FACTS.documentedCounterOffsetHours,54);assert.equal(72-54,18);assert.equal(CRA_FACTS.vulnerabilityFinalDaysAfterMeasure,14);assert.equal(CRA_FACTS.incidentFinalMonthsAfterNotification,1);
 for(const v of variants.filter(v=>v.kind==='clocks')){const{root,nodes}=inspect(v.svg),copy=content(root);for(const n of ['24','48','54','72','18','14'])assert.ok(copy.includes(n),n);assert.match(label(nodes,'final-vuln-start'),v.lang==='fr'?/disponible/u:/available/u);assert.match(label(nodes,'final-incident-start'),/72/u);assert.match(copy,v.lang==='fr'?/Hypothèse|Exemple|hypothèse/u:/Example|example|illustration/u);if(v.mobile){const dots=nodes.filter(n=>tag(n)==='circle');for(const y of [240+7*6,240+7*24,240+7*54,240+7*72])assert.ok(dots.some(n=>num(n,'cy')===y));}else{const lines=nodes.filter(n=>tag(n)==='line'&&num(n,'y1')===393&&num(n,'y2')===393);assert.equal(lines.length,1);close(num(lines[0],'x1'),72+856*6/72);close(num(lines[0],'x2'),72+856*54/72);}}
});
test('the curl time axis reproduces three and eight calendar-day intervals without claiming an installation or exploitation date',()=>{
 const dates=CRA_FACTS.curl.map(d=>Date.parse(`${d}T00:00:00Z`));assert.equal((dates[1]-dates[0])/86400000,3);assert.equal((dates[2]-dates[1])/86400000,8);assert.equal((dates[2]-dates[0])/86400000,11);
 for(const v of variants.filter(v=>v.kind==='curl')){const{root,nodes}=inspect(v.svg);if(v.mobile){const dots=nodes.filter(n=>tag(n)==='circle');assert.deepEqual(dots.map(n=>num(n,'cy')),[256,427,883]);close((num(dots[1],'cy')-num(dots[0],'cy'))/(num(dots[2],'cy')-num(dots[0],'cy')),3/11);}else{const bars=nodes.filter(n=>tag(n)==='rect'&&num(n,'rx')===0);assert.equal(bars.length,2);close(num(bars[0],'width')/num(bars[1],'width'),3/8);close(num(bars[0],'width')+num(bars[1],'width'),840);}assert.match(content(root),/2023/u);assert.match(content(root),v.lang==='fr'?/n’est pas établie|date non établie/u:/does not establish|date not given/u);assert.match(content(root),v.lang==='fr'?/Aucune exploitation active|ne démontre pas une exploitation/u:/not establish malicious exploitation|Active exploitation not established/u);}
});
test('qualification branches, confidential recipients and conditional public publication stay distinct',()=>{
 for(const v of variants.filter(v=>v.kind==='threshold')){const{root,nodes}=inspect(v.svg);for(let i=0;i<3;i++){assert.ok(label(nodes,`product-${i}`).endsWith(String.fromCharCode(65+i)));assert.ok(label(nodes,`condition-${i}`));}assert.match(content(root),v.lang==='fr'?/Exemple|fictif/u:/Illustrative|Illustrative example/u);assert.match(content(root),v.lang==='fr'?/ni fréquence|ni des fréquences/u:/neither frequencies|do not measurefrequency/u);}
 for(const v of variants.filter(v=>v.kind==='routing')){const{root,nodes}=inspect(v.svg);assert.match(label(nodes,'coordinator'),/CSIRT/u);assert.match(label(nodes,'enisa'),/ENISA/u);assert.match(label(nodes,'users'),v.lang==='fr'?/Utilisateurs/u:/users/u);const copy=content(root);assert.match(copy,/EUVD/u);assert.match(copy,v.lang==='fr'?/Information déjà publique/u:/Already-public information/u);assert.match(copy,v.lang==='fr'?/Mesure disponible|mesure disponible/u:/Available measure|available measure/u);assert.match(copy,v.lang==='fr'?/Accord du fabricant|accord du fabricant/u:/Manufacturer agreement|manufacturer agreement/u);}
});
test('the upstream-return mechanism retains its delayed applicability and does not require maintainer acceptance',()=>{
 assert.equal(CRA_FACTS.manufacturerReporting,'2026-09-11');assert.equal(CRA_FACTS.stewardReporting,'2027-12-11');assert.equal(CRA_FACTS.generalRequirements,'2027-12-11');
 for(const v of variants.filter(v=>v.kind==='feedback')){const{root,nodes}=inspect(v.svg);for(const type of ['project','maker','user'])assert.ok(label(nodes,`node-${type}-title`));assert.ok(nodes.some(n=>tag(n)==='path'&&attrs(n).d===(v.mobile?'M74 637 L32 637 L32 321 L61 321':'M501 458 L501 598 L169 598 L169 470')));assert.match(content(root),v.lang==='fr'?/11\.12\.2027|11 décembre 2027|décembre 2027/u:/11 Dec 2027|December 2027/u);assert.match(label(nodes,'acceptance'),v.lang==='fr'?/libre de ne pas l’accepter|acceptation.*distincte/iu:/not compulsory|Acceptance.*separate/iu);assert.match(content(root),v.lang==='fr'?/modification.*développée|développée.*corriger/iu:/modification.*developed|developed.*address/iu);}
});
test('component props reject coercion and injection while output remains responsive, static, printable and usable without JS',()=>{
 const props={lang:'fr',kind:'threshold',number:'01',caption:'Illustration',sources:'1 3'};assert.deepEqual(validateCraDisclosureFigure(props),{lang:'fr',kind:'threshold',number:'01',caption:'Illustration',references:['1','3']});
 for(const bad of [null,[],{...props,lang:'de'},{...props,kind:'__proto__'},{...props,kind:{toString:()=> 'threshold'}},{...props,number:'2'},{...props,number:1},{...props,caption:''},{...props,sources:'1 1'},{...props,sources:'1\" onclick=bad'},{...props,sources:''},{...props,sources:'0'}])assert.throws(()=>validateCraDisclosureFigure(bad),TypeError);assert.throws(()=>craDisclosureSvg('fr','__proto__'),TypeError);assert.throws(()=>craDisclosureSvg('fr','threshold','true'),TypeError);
 const component=readFileSync(new URL('../src/components/CraDisclosureFigure.astro',import.meta.url),'utf8');assert.match(component,/set:html=\{craDisclosureSvg\(lang, kind, false\)\}/u);assert.match(component,/set:html=\{craDisclosureSvg\(lang, kind, true\)\}/u);assert.match(component,/@media \(max-width: 640px\)/u);assert.match(component,/@container \(max-width: 640px\)/u);assert.match(component,/max-width: 25rem/u);assert.match(component,/margin-inline: auto/u);assert.match(component,/@media print/u);assert.match(component,/<slot \/>/u);assert.doesNotMatch(component,/<script|max-height|overflow:\s*hidden|client:/u);
});
