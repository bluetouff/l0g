import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { XMLParser, XMLValidator } from 'fast-xml-parser';
import postcss from 'postcss';
import sharp from 'sharp';
import { dutreilSvg, validateDutreilFigure } from '../src/lib/dutreilFigures.mjs';

const kinds=['concentration','tax','cost','fbo','timeline','reform'];
const variants=['fr','en'].flatMap(lang=>kinds.flatMap(kind=>[false,true].map(mobile=>({lang,kind,mobile,name:`${lang}-${kind}${mobile?'-mobile':''}`,svg:dutreilSvg(lang,kind,mobile)}))));
const parser=new XMLParser({preserveOrder:true,ignoreAttributes:false,attributeNamePrefix:'',trimValues:false,parseTagValue:false,parseAttributeValue:false});
const tag=node=>Object.keys(node).find(key=>key!==':@');
const attr=node=>node[':@']||{};
const children=node=>node[tag(node)]||[];
const all=node=>tag(node)==='#text'?[]:[node,...children(node).flatMap(all)];
const content=node=>tag(node)==='#text'?node['#text']:children(node).map(content).join('');
const num=(node,key,fallback=0)=>{const value=Number(attr(node)[key]??fallback);assert.ok(Number.isFinite(value),key);return value;};
const native={};
postcss.parse(readFileSync(new URL('../src/styles/global.css',import.meta.url),'utf8')).walkDecls(d=>{if(d.parent.type==='atrule'&&d.parent.name==='theme')native[d.prop]=d.value;});
const paint=role=>`var(--color-${role}, ${native[`--color-${role}`]})`;
const safePaints=new Set(['none',...['ink','surface','paper','muted','line-strong','signal','amber','accent'].map(paint)]);
const safeTags=new Set('svg title desc defs marker path rect text circle line'.split(' '));
const safeAttributes=new Set('xmlns viewBox role aria-labelledby lang id style refX refY markerWidth markerHeight orient d fill width height rx x y font-family font-size font-weight text-anchor cx cy r x1 y1 x2 y2 stroke stroke-width stroke-linejoin marker-end stroke-dasharray'.split(' '));
function inspect(svg){
  assert.equal(XMLValidator.validate(svg),true);assert.doesNotMatch(svg,/<!|<\?/u);
  const tree=parser.parse(svg);assert.equal(tree.length,1);
  const root=tree[0],nodes=all(root),p=attr(root),ids=new Set(),references=[];
  assert.equal(tag(root),'svg');assert.equal(p.xmlns,'http://www.w3.org/2000/svg');assert.equal(p.role,'img');assert.equal(p.style,'width:100%;height:auto');
  for(const node of nodes){
    assert.ok(safeTags.has(tag(node)),tag(node));
    for(const [key,value]of Object.entries(attr(node))){
      assert.ok(safeAttributes.has(key),key);assert.equal(typeof value,'string');
      if(key==='fill'||key==='stroke')assert.ok(safePaints.has(value),value);
      if(key==='style'){assert.equal(node,root);assert.equal(value,p.style);}
      if(key==='id'){assert.match(value,/^dutreil-2026-(?:fr|en)-[a-z]+-(?:wide|mobile)-[a-zA-Z][a-zA-Z0-9-]*$/u);assert.ok(!ids.has(value));ids.add(value);}
      if(key==='marker-end'){const match=value.match(/^url\(#([a-zA-Z][a-zA-Z0-9-]*)\)$/u);assert.ok(match);references.push(match[1]);}
      else assert.ok(!value.includes('url('),key);
      if(key==='font-family')assert.equal(value,'Arial, Helvetica, sans-serif');
      if(key==='font-size')assert.ok(num(node,key)>=16);
      if(key==='font-weight')assert.ok(['400','700'].includes(value));
    }
  }
  for(const id of references)assert.ok(ids.has(id));
  const names=p['aria-labelledby'].split(' ');assert.equal(names.length,2);
  for(const type of ['title','desc']){const found=nodes.filter(node=>tag(node)===type);assert.equal(found.length,1);assert.ok(names.includes(attr(found[0]).id));assert.ok(content(found[0]).trim());}
  return{root,nodes};
}

// Independently parsed supplied compositions. These fingerprints exclude only
// theme paints, accessible IDs/local marker targets and the responsive root
// style. Every primitive, coordinate, numerical label, font and note remains.
const originalSignatures={
  "fr-concentration": "c508cee9b4deeb5ecfb0ae14aa024b5f0f54857f631492ebe8b42806a6a1c758",
  "fr-concentration-mobile": "0db9f5bc56ce6d2ee3bd1ad343502088ab787ba3e096ce7c3fbcc349eac0ad91",
  "fr-tax": "1d12ff90bfd08e3cfd82b6a0016a4a738a2f9a0eeb3575025d3ff0b6600b9d2f",
  "fr-tax-mobile": "1c55139107fcb879222fa5b24602fc31b4fb7219ca10787917065d653446fb24",
  "fr-cost": "d3eca3d1110035f9f0cc05b4d92dcfb03677a4bb1de2a1245df646cdafba6d8d",
  "fr-cost-mobile": "2b830a4d4fe0f120a33b9bd9405b41d5e3e8ccbccc27a4916a439bd8d01c2b16",
  "fr-fbo": "90fb29405e93a6d8b5769aa8fa58e64d3b38f15a7c24d0c7e90cce5f8663b701",
  "fr-fbo-mobile": "31bd5751146fc62358356c839bf60fc2a5e66d899f65f6c4866fc59093ed253a",
  "fr-timeline": "9089e58d9e2dc5e81b39b9a4536cbd8de0c18886bbaeff1506aad23bb173df8a",
  "fr-timeline-mobile": "0cbf788ec32875fea0e3242b5e4d78a6dc68f891a86a16da297ba45e8aea3b07",
  "fr-reform": "14523084481826f6c2219b5fb2f0f4a47c9c2bb2bfa80287ae11ab30ba9a69d7",
  "fr-reform-mobile": "860f033be7c9709d4081c540094ad890c07a1c4a22b2e7afcc83c24ec120432c",
  "en-concentration": "74cf3642becbff85231e37320cef01b0d5fcc8af47cce71c9081774694f97be8",
  "en-concentration-mobile": "9fddd00d6402406d1d27862f5298d5055839f02fa53234b0a713e225184182f8",
  "en-tax": "266e0d504f5b6a53e69b8222577422516377a340f13e61d5e80eac9aae1d469c",
  "en-tax-mobile": "dfebb310e9508c6099308574003fbb1fa01a40d19027e3e5a1e81a3796482bf6",
  "en-cost": "2ccfe626adbfcbedf1a798f7450353befdf9b5a34482eb6cdbfb025800778bf1",
  "en-cost-mobile": "2599143c32402211ec4782e7953123b61e014134fed27bc0380923848475cb22",
  "en-fbo": "86c569e55195bb5790108899ed20faa3dd5375ec0a0dfd702423248896a45905",
  "en-fbo-mobile": "a8354cd967e04117a86261b7fb426108fd452a0cc5f5678c5998f1e7d11d9da6",
  "en-timeline": "72d777a31c00e35ef94a34f3483bb1fc6483abbfb18fb4cd9e62199137f7fbb1",
  "en-timeline-mobile": "ad4bb7acb32abb725422e1c3bcb319726717ad0621ab320da40f99adff48984e",
  "en-reform": "b786b6a680ca479d7e0f851156688fde15f31d7adb36d41e0bc2082059d6538f",
  "en-reform-mobile": "fbc1d45c6d4c290d9f5b86d45498be8fd3883636ff3ab0a22d3b579580a48ea7"
};
function signature(svg){
  const nodes=inspect(svg).nodes.map(node=>[tag(node),Object.entries(attr(node)).filter(([key])=>!['id','fill','stroke','marker-end','aria-labelledby','role','lang','xmlns','style'].includes(key)).sort(([a],[b])=>a.localeCompare(b)),['text','title','desc'].includes(tag(node))?content(node):'']);
  return createHash('sha256').update(JSON.stringify(nodes)).digest('hex');
}
test('all twenty-four supplied compositions preserve geometry, typography, text and numeric labels',()=>{
  assert.equal(variants.length,24);assert.equal(Object.keys(originalSignatures).length,24);
  for(const v of variants)assert.equal(signature(v.svg),originalSignatures[v.name],v.name);
});
test('all static SVG variants are inert, theme-native and uniquely accessible',()=>{
  const ids=new Set();
  for(const v of variants){const{root,nodes}=inspect(v.svg);assert.equal(attr(root).lang,v.lang);for(const node of nodes)if(attr(node).id){assert.ok(!ids.has(attr(node).id));ids.add(attr(node).id);}for(const node of nodes.filter(node=>tag(node)==='title'))assert.doesNotMatch(content(node),/ce (?:que|qui|qu[’'])|what .* (?:means|reveals)|—/iu);}
  for(const v of variants.filter(v=>v.kind==='timeline'&&!v.mobile))for(const label of (v.lang==='fr'?['Collectif','2 ans']:['Collective','2 years']))assert.equal(attr(inspect(v.svg).nodes.find(node=>tag(node)==='text'&&content(node)===label)).fill,paint('ink'));
});

const glyphCache=new Map();
async function glyph(node){
  const p=attr(node),label=content(node),key=JSON.stringify([p['font-size'],p['font-weight'],p['text-anchor'],label]);
  if(!glyphCache.has(key)){
    const escaped=label.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
    const xml=`<svg xmlns="http://www.w3.org/2000/svg" width="8192" height="256"><text x="4096" y="160" fill="white" text-anchor="${p['text-anchor']}" font-family="Arial, Helvetica, sans-serif" font-size="${p['font-size']}" font-weight="${p['font-weight']}">${escaped}</text></svg>`;
    const{info}=await sharp(Buffer.from(xml)).trim().raw().toBuffer({resolveWithObject:true});
    const x=-info.trimOffsetLeft-4096,y=-info.trimOffsetTop-160;glyphCache.set(key,{x,y,right:x+info.width,bottom:y+info.height});
  }
  return glyphCache.get(key);
}
test('visible shapes and real glyphs fit the canvas and cards, without overlapping or concealed labels',async()=>{
  for(const v of variants){
    const{root}=inspect(v.svg),nodes=children(root).filter(node=>!['#text','defs','title','desc'].includes(tag(node))),[left,top,width,height]=attr(root).viewBox.split(' ').map(Number);
    assert.equal(left,0);assert.equal(top,0);assert.equal(width,v.mobile?480:960);
    const inside=(x,y)=>assert.ok(x>=0&&y>=0&&x<=width&&y<=height,`${v.name}: ${x},${y} outside viewBox`);
    for(const node of nodes){
      if(tag(node)==='rect'){inside(num(node,'x'),num(node,'y'));inside(num(node,'x')+num(node,'width'),num(node,'y')+num(node,'height'));}
      if(tag(node)==='line'){inside(num(node,'x1'),num(node,'y1'));inside(num(node,'x2'),num(node,'y2'));}
      if(tag(node)==='circle'){const r=num(node,'r');inside(num(node,'cx')-r,num(node,'cy')-r);inside(num(node,'cx')+r,num(node,'cy')+r);}
      if(tag(node)==='path'){
        assert.match(attr(node).d,/^[MLz0-9.,\-\s]+$/u);
        for(const match of attr(node).d.matchAll(/[ML]([^MLz]*)/gu)){const values=match[1].trim().split(/[\s,]+/u).map(Number);assert.equal(values.length%2,0);for(let i=0;i<values.length;i+=2)inside(values[i],values[i+1]);}
      }
    }
    const boxes=[];
    for(const node of nodes.filter(node=>tag(node)==='text')){
      const g=await glyph(node),x=num(node,'x'),y=num(node,'y'),b={x:x+g.x,y:y+g.y,right:x+g.right,bottom:y+g.bottom,label:content(node)};
      assert.ok(b.x>=2&&b.y>=2&&b.right<=width-2&&b.bottom<=height-2,`${v.name}: canvas ${b.label}`);
      const earlier=nodes.slice(0,nodes.indexOf(node)),cards=earlier.filter(n=>tag(n)==='rect'&&num(n,'rx')===8&&num(n,'width')>80&&b.x>=num(n,'x')&&b.x<=num(n,'x')+num(n,'width')&&b.y>=num(n,'y')&&b.y<=num(n,'y')+num(n,'height'));
      const card=cards.at(-1);if(card)assert.ok(b.x>=num(card,'x')+2&&b.y>=num(card,'y')+2&&b.right<=num(card,'x')+num(card,'width')-2&&b.bottom<=num(card,'y')+num(card,'height')-2,`${v.name}: card ${b.label}`);
      for(const other of boxes)assert.ok(!(b.x<other.right&&b.right>other.x&&b.y<other.bottom&&b.bottom>other.y),`${v.name}: glyph collision ${other.label} / ${b.label}`);
      for(const cover of nodes.slice(nodes.indexOf(node)+1).filter(n=>tag(n)==='rect'&&attr(n).fill!=='none'))assert.ok(!(b.x<num(cover,'x')+num(cover,'width')&&b.right>num(cover,'x')&&b.y<num(cover,'y')+num(cover,'height')&&b.bottom>num(cover,'y')),`${v.name}: concealed ${b.label}`);
      boxes.push(b);
    }
  }
});

const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-10,`${a} != ${b}`);
test('beneficiary shares and cost shares retain different denominators and proportional bars',()=>{
  for(const v of variants.filter(v=>v.kind==='concentration')){
    const{root,nodes}=inspect(v.svg),dots=nodes.filter(node=>tag(node)==='circle');assert.equal(dots.length,100);assert.equal(dots.filter(node=>attr(node).fill===paint('amber')).length,1);assert.equal(dots.filter(node=>attr(node).fill===paint('muted')).length,99);
    const bars=nodes.filter(node=>tag(node)==='rect'&&num(node,'rx')===0);assert.equal(bars.length,2);close(num(bars[0],'width')/(num(bars[0],'width')+num(bars[1],'width')),.65);
    const copy=content(root).replace(/\s+/gu,' ');
    assert.match(copy,/2024/u);assert.match(copy,/110/u);assert.match(copy,v.lang==='fr'?/pas une personne|sans représenter des personnes individuelles/u:/not a person|not individual people/u);
  }
});

// Integer arithmetic independently derives the displayed 10-million-euro
// example. Bracket calculations use euro thresholds and integer cents;
// aggregate article-790 reduction is applied before whole-euro chart rounding.
function progressiveDutyCents(base){
  const ceilings=[8072n,12109n,15932n,552324n,902838n,1805677n,base],rates=[5n,10n,15n,20n,30n,40n,45n];let floor=0n,total=0n;
  for(let i=0;i<ceilings.length;i++){const end=base<ceilings[i]?base:ceilings[i];if(end>floor)total+=(end-floor)*rates[i];floor=ceilings[i];if(base<=floor)break;}
  return total;
}
test('the tax bridge and reform bars reproduce the independent progressive-tax example and identify the scenario',()=>{
  const gross=5000000n,allowance=100000n;
  const current=Number(progressiveDutyCents(gross/4n-allowance))/100;
  const scenario=Number(progressiveDutyCents(gross/2n-allowance))/100;
  const ordinary=2*Number(progressiveDutyCents(gross-allowance))/100;
  assert.equal(current,312678.15);assert.equal(scenario,842394.3);assert.equal(ordinary,3934788.6);
  for(const v of variants.filter(v=>v.kind==='tax')){
    const{root,nodes}=inspect(v.svg),bars=nodes.filter(node=>tag(node)==='rect'&&num(node,'rx')===0&&attr(node).fill===paint('amber'));
    assert.equal(bars.length,3);close(num(bars[1],'width')/num(bars[0],'width'),.25);close(num(bars[2],'width')/num(bars[0],'width'),.23);
    assert.match(content(root),v.lang==='fr'?/312 678/u:/312,678/u);assert.match(content(root),v.lang==='fr'?/156 339/u:/156,339/u);
  }
  for(const v of variants.filter(v=>v.kind==='reform')){
    const{root,nodes}=inspect(v.svg),bars=nodes.filter(node=>tag(node)==='rect'&&num(node,'rx')===0),tracks=bars.filter(node=>attr(node).fill===paint('surface')),values=bars.filter(node=>attr(node).fill!==paint('surface'));
    assert.equal(tracks.length,3);assert.equal(values.length,3);
    // Bar geometry uses unrounded liabilities; visible euro labels are rounded.
    [current,scenario,ordinary].forEach((value,i)=>close(num(values[i],'width')/num(tracks[i],'width'),(value/10000000)/.45));
    assert.match(content(root),v.lang==='fr'?/hypothétique|scénario/iu:/hypothetical|scenario/iu);assert.match(content(root),v.lang==='fr'?/1,3/iu:/1\.3/iu);
  }
});
test('historical annual costs remain separate from two budget vintages for the same 2024 observation',()=>{
  for(const v of variants.filter(v=>v.kind==='cost')){
    const{root,nodes}=inspect(v.svg),bars=nodes.filter(node=>tag(node)==='rect'&&num(node,'rx')===0);assert.equal(bars.length,7);
    const dimension=v.mobile?'width':'height',unit=num(bars.at(-1),dimension)/5.5;
    [1.6,1.2,1.2,1.4,2,3.3,5.5].forEach((value,i)=>close(num(bars[i],dimension)/unit,value));
    const copy=content(root);for(const year of ['2018','2019','2020','2021','2022','2023','2024','2025','2026'])assert.ok(copy.includes(year));
    assert.match(copy,v.lang==='fr'?/MÊME ANNÉE 2024|Même année : 2024/u:/THE SAME YEAR, 2024|Same reference year: 2024/u);
  }
});
test('family-buyout funding and the collective, individual and management periods stay distinct',()=>{
  for(const v of variants.filter(v=>v.kind==='fbo')){
    const{root,nodes}=inspect(v.svg);assert.equal(nodes.filter(node=>tag(node)==='rect'&&num(node,'rx')===8).length,v.mobile?8:6);
    assert.equal(nodes.filter(node=>tag(node)==='path'&&attr(node)['marker-end']).length,v.mobile?5:6);
    assert.match(content(root),v.lang==='fr'?/Prêt : 5 M€|Prêt de 5 M€/u:/Loan: €5m|€5m loan/u);assert.match(content(root),v.lang==='fr'?/Dividendes/u:/[Dd]ividends/u);
    assert.match(content(root),v.lang==='fr'?/conditionnel/iu:/conditional/iu);
  }
  for(const v of variants.filter(v=>v.kind==='timeline')){
    const{root,nodes}=inspect(v.svg),copy=content(root);assert.match(copy,/2026/u);assert.match(copy,v.lang==='fr'?/6 ans/u:/6 years/u);assert.match(copy,v.lang==='fr'?/3 ans|trois ans/u:/3 years|three years/u);
    if(!v.mobile){const bars=nodes.filter(node=>tag(node)==='rect'&&num(node,'rx')===0);assert.equal(bars.length,4);const unit=num(bars[0],'width')/2;close(num(bars[1],'width')/unit,6);close(num(bars[2],'width')/unit,4);close(num(bars[3],'width')/unit,8);}
  }
});
test('component inputs reject coercion and reference injection; rendering remains static and responsive',()=>{
  const props={lang:'fr',kind:'tax',number:'02',caption:'Simulation',sources:'1 2'};
  assert.deepEqual(validateDutreilFigure(props),{lang:'fr',kind:'tax',number:'02',caption:'Simulation',references:['1','2']});
  for(const bad of [null,[],{...props,lang:'de'},{...props,kind:'__proto__'},{...props,kind:{toString:()=> 'tax'}},{...props,number:'1'},{...props,number:2},{...props,caption:''},{...props,sources:'1 1'},{...props,sources:'1\" onclick=bad'},{...props,sources:''},{...props,sources:'0'}])assert.throws(()=>validateDutreilFigure(bad),TypeError);
  assert.throws(()=>dutreilSvg('fr','__proto__'),TypeError);assert.throws(()=>dutreilSvg('fr','tax','true'),TypeError);
  const component=readFileSync(new URL('../src/components/DutreilFigure.astro',import.meta.url),'utf8');
  assert.match(component,/set:html=\{dutreilSvg\(lang, kind, false\)\}/u);assert.match(component,/set:html=\{dutreilSvg\(lang, kind, true\)\}/u);
  assert.match(component,/@media \(max-width: 640px\)/u);assert.match(component,/@container \(max-width: 640px\)/u);assert.match(component,/<slot \/>/u);
  assert.doesNotMatch(component,/<script|max-height|overflow:\s*hidden|client:/u);
});
