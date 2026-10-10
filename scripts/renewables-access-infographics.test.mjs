import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { XMLParser, XMLValidator } from 'fast-xml-parser';
import postcss from 'postcss';
import sharp from 'sharp';
import { renewablesAccessSvg, validateRenewablesAccessFigure, EXPOSURE } from '../src/lib/renewablesAccessFigures.mjs';

const kinds=['exposure','boundaries','handoff','coverage','cash'];
const variants=['fr','en'].flatMap(lang=>kinds.flatMap(kind=>[false,true].map(mobile=>({lang,kind,mobile,name:`${kind}-${lang}-${mobile?'mobile':'desktop'}`,svg:renewablesAccessSvg(lang,kind,mobile)}))));
const parser=new XMLParser({preserveOrder:true,ignoreAttributes:false,attributeNamePrefix:'',trimValues:false,parseTagValue:false,parseAttributeValue:false});
const tag=node=>Object.keys(node).find(key=>key!==':@');
const attr=node=>node[':@']||{};
const children=node=>node[tag(node)]||[];
const all=node=>tag(node)==='#text'?[]:[node,...children(node).flatMap(all)];
const content=node=>tag(node)==='#text'?node[tag(node)]:children(node).map(content).join('');
const n=(node,key,fallback=0)=>{const value=Number(attr(node)[key]??fallback);assert.ok(Number.isFinite(value),key);return value;};
const native={};
postcss.parse(readFileSync(new URL('../src/styles/global.css',import.meta.url),'utf8')).walkDecls(d=>{if(d.parent.type==='atrule'&&d.parent.name==='theme')native[d.prop]=d.value;});
const paint=role=>`var(--color-${role}, ${native[`--color-${role}`]})`;
const safePaints=new Set(['none',...['ink','surface','surface-2','paper','muted','line-strong','signal','amber','accent'].map(paint)]);
const tags=new Set('svg title desc g rect line circle path text'.split(' '));
const attributes=new Set('xmlns viewBox role aria-labelledby style id x y width height rx fill stroke stroke-width stroke-dasharray x1 y1 x2 y2 d stroke-linecap stroke-linejoin cx cy r font-family font-size font-weight text-anchor data-region data-bounds data-node data-edge data-count-bar data-total data-unit'.split(' '));

function inspect(svg){
  assert.equal(XMLValidator.validate(svg),true);
  assert.doesNotMatch(svg,/<!|<\?/u);
  const parsed=parser.parse(svg);assert.equal(parsed.length,1);
  const root=parsed[0],nodes=all(root),p=attr(root);
  assert.equal(tag(root),'svg');assert.equal(p.xmlns,'http://www.w3.org/2000/svg');
  assert.equal(p.style,'width:100%;height:auto');assert.equal(p.role,'img');
  const ids=new Set();
  for(const node of nodes){
    assert.ok(tags.has(tag(node)),tag(node));
    for(const [key,value] of Object.entries(attr(node))){
      assert.ok(attributes.has(key),key);
      assert.ok(!String(value).includes('url('));
      if(key==='fill'||key==='stroke')assert.ok(safePaints.has(value),value);
      if(key==='style'){assert.equal(node,root);assert.equal(value,p.style);}
      if(key==='id'){assert.ok(!ids.has(value));ids.add(value);}
    }
  }
  const names=p['aria-labelledby'].split(' ');assert.equal(names.length,2);
  for(const type of ['title','desc']){const node=nodes.filter(item=>tag(item)===type);assert.equal(node.length,1);assert.ok(names.includes(attr(node[0]).id));assert.ok(content(node[0]).trim());}
  return {root,nodes};
}

// Archive compositions, independently parsed before adaptation. Paints and
// accessible IDs may change; primitives, coordinates and fonts may not. The
// four scoped labels below explicitly identify the source's serial link. The
// desktop insurance connector has a gap around the original note, which it
// previously crossed; every card, label and arrowhead remains in place.
const originalSignatures={
  "exposure-fr-desktop": "b9d63258c4863aa57efaef5738ef23fbef4af1b972c709a7970b8d0461ec2a58",
  "exposure-fr-mobile": "ba13c0e584ed674ce435e8a4a2d43e84f4c258e3733b108574aab66e3da02f4c",
  "boundaries-fr-desktop": "0d0d1be46046390ee69a69cc927dc63343f17169fcdb4440e3aee0b0762aeb4d",
  "boundaries-fr-mobile": "e51eb5c47401f66ec5083ff8945caa06d32a6ea0d8d9775d61e3d5a012ec5336",
  "handoff-fr-desktop": "8711a045ab3f76cae19d8b0cfa86a4bf116cf9c94b7192ff2d62d2978ccf22ce",
  "handoff-fr-mobile": "8be65bde46c8e82ff06b4fff4ad0f2459224cdf1bf3e23b78d8058e65335cd11",
  "coverage-fr-desktop": "61ff72dfae1a779bab64bff74679eb3f6380a6700d376a07b8d34c53b2afb006",
  "coverage-fr-mobile": "ca37c8c532c996b5a901d0935d5734d7a69dc3e96209f1bce95802511fe928ca",
  "cash-fr-desktop": "f7e1eaefa4bc5d62553658100d68c8cac61f393772a597be7e79c107171988d9",
  "cash-fr-mobile": "27f74f021ea7ab9f2e8cf70bddec264b467e227f075676841f3023d557c33c97",
  "exposure-en-desktop": "199fe9a4553d7761676bde72f278678d3f6be6aeb10153c911110360c9e1a7af",
  "exposure-en-mobile": "a65d0e96c09cb8bd675c12cdb698d2582962daa91e173df76a8858e5bc47d39b",
  "boundaries-en-desktop": "b0844c2a263c3caf73e9269d877b1d5baa65af87cddd6185f0901b3c0ce2b2cf",
  "boundaries-en-mobile": "c29adc76d38eb70c5dde933d44aa103988ea78365b3a65ce5e056f062cfdea66",
  "handoff-en-desktop": "1a91185bc966805f87694ffa65175eb4b80e1bf22c8addc661c1d22218a55d94",
  "handoff-en-mobile": "b6b4121ef8ddd72455ca55152262b9df5e46a7385fd9e61bb6e851d31791225a",
  "coverage-en-desktop": "2c98aac89def9c1cae6f3c603672246f09bbf402c0905be9fa7579e560a05292",
  "coverage-en-mobile": "6946cafda2bb51432f636fb53c1cadf6479ab5d906406e4f43820755b192af08",
  "cash-en-desktop": "c5a67fb4673aa6ff570f065f1b6f13bcae71778b27028e638b11eb514ff0d88b",
  "cash-en-mobile": "5e58ddb3727a6d742211e3f62eb59c2a6fd97bf50ac51218ecd652fd58fa616b"
};
function normalized(node,variant,region=''){
  const name=tag(node),currentRegion=attr(node)['data-region']||region;
  if(name==='#text'){
    let value=node[name];
    if(variant.kind==='boundaries'&&region===(variant.mobile?'operations':'operations-body')){
      if(variant.lang==='fr'&&value==='Liaison série spécifiée')value=variant.mobile?'Liaison opérationnelle spécifiée':'Liaison spécifiée';
      if(variant.lang==='en'&&value==='Specified serial link')value=variant.mobile?'Specified operational link':'Specified link';
    }
    return ['#text',value];
  }
  let descendants=children(node);
  if(name==='svg'&&variant.kind==='coverage'&&!variant.mobile){
    const first=descendants.findIndex(child=>tag(child)==='line'&&attr(child).x1==='391'&&attr(child).y1==='646'&&attr(child).x2==='391'&&attr(child).y2==='657');
    assert.ok(first>=0,'Insurance connector top segment');
    const second=attr(descendants[first+1]);
    assert.equal(tag(descendants[first+1]),'line');assert.equal(second.x1,'391');assert.equal(second.y1,'690');assert.equal(second.x2,'391');assert.equal(second.y2,'703');
    descendants=[...descendants.slice(0,first),{...descendants[first],':@':{...attr(descendants[first]),y2:'703'}},...descendants.slice(first+2)];
  }
  return [name,Object.entries(attr(node)).filter(([key])=>!['fill','stroke','id','aria-labelledby'].includes(key)).sort(([a],[b])=>a.localeCompare(b)),descendants.map(child=>normalized(child,variant,currentRegion))];
}
const signature=v=>createHash('sha256').update(JSON.stringify(parser.parse(v.svg).map(node=>normalized(node,v)))).digest('hex');

const glyphCache=new Map();
async function glyph(node){
  const p=attr(node),label=content(node),key=JSON.stringify([p['font-size'],p['font-weight'],p['text-anchor'],label]);
  if(!glyphCache.has(key)){
    const escaped=label.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="8192" height="256"><text x="4096" y="160" fill="white" text-anchor="${p['text-anchor']}" font-family="Arial, Helvetica, sans-serif" font-size="${p['font-size']}" font-weight="${p['font-weight']}">${escaped}</text></svg>`;
    const {info}=await sharp(Buffer.from(svg)).trim().raw().toBuffer({resolveWithObject:true});
    // Sharp supplies the actual nontransparent pixel extent. Canvas/card
    // padding is checked below; an extra raster pixel here would invent an
    // overflow on the original left bearing of the lowercase j.
    const x=-info.trimOffsetLeft-4096,y=-info.trimOffsetTop-160;
    glyphCache.set(key,{x,y,right:x+info.width,bottom:y+info.height});
  }
  return glyphCache.get(key);
}

async function geometry(svg){
  const {root,nodes}=inspect(svg),[left,top,width,height]=attr(root).viewBox.split(' ').map(Number);
  assert.equal(left,0);assert.equal(top,0);assert.ok(width===400||width===1000);assert.ok(height>0);
  const inside=(x,y)=>assert.ok(x>=0&&x<=width&&y>=0&&y<=height,`${x},${y} outside ${width},${height}`);
  for(const node of nodes){
    const p=attr(node);
    if(tag(node)==='rect'){assert.ok(n(node,'width')>=0&&n(node,'height')>=0);inside(n(node,'x'),n(node,'y'));inside(n(node,'x')+n(node,'width'),n(node,'y')+n(node,'height'));}
    if(tag(node)==='line'){inside(n(node,'x1'),n(node,'y1'));inside(n(node,'x2'),n(node,'y2'));}
    if(tag(node)==='circle'){const radius=n(node,'r')+n(node,'stroke-width')/2;inside(n(node,'cx')-radius,n(node,'cy')-radius);inside(n(node,'cx')+radius,n(node,'cy')+radius);}
    if(tag(node)==='path'){
      assert.match(p.d,/^[MLHVZ\d.e+\-, ]+$/u);
      let cursor=[0,0];
      for(const match of p.d.matchAll(/([MLHVZ])([^MLHVZ]*)/gu)){
        const values=match[2].match(/-?\d+(?:\.\d+)?(?:e[+-]?\d+)?/gu)?.map(Number)||[];
        if(match[1]==='M'||match[1]==='L'){assert.equal(values.length%2,0);for(let i=0;i<values.length;i+=2){cursor=values.slice(i,i+2);inside(...cursor);}}
        if(match[1]==='H')for(const x of values){cursor=[x,cursor[1]];inside(...cursor);}
        if(match[1]==='V')for(const y of values){cursor=[cursor[0],y];inside(...cursor);}
      }
    }
  }
  const boxes=[];
  for(const node of nodes.filter(item=>tag(item)==='text')){
    const p=attr(node),size=n(node,'font-size'),g=await glyph(node),label=content(node);
    assert.equal(p['font-family'],'Arial, Helvetica, sans-serif');assert.ok(size>=13);
    const x=n(node,'x'),y=n(node,'y'),box={x:x+g.x,y:y+g.y,right:x+g.right,bottom:y+g.bottom,label};
    assert.ok(box.x>=2&&box.y>=2&&box.right<=width-2&&box.bottom<=height-2,`ViewBox: ${label}`);
    const parent=nodes.find(group=>tag(group)==='g'&&children(group).includes(node));
    if(parent&&attr(parent)['data-region']){
      const [rx,ry,rw,rh]=attr(parent)['data-bounds'].split(' ').map(Number);
      assert.ok(box.x>=rx-1&&box.right<=rx+rw+1&&box.y>=ry-1&&box.bottom<=ry+rh+1,`Region ${attr(parent)['data-region']}: ${label}`);
    }
    const card=nodes.find(group=>attr(group)['data-node']&&all(group).includes(node));
    const background=card&&children(card).find(item=>tag(item)==='rect');
    if(background){const rx=n(background,'x'),ry=n(background,'y'),rw=n(background,'width'),rh=n(background,'height');assert.ok(box.x>=rx+2&&box.right<=rx+rw-2&&box.y>=ry+2&&box.bottom<=ry+rh-2,`Card ${attr(card)['data-node']}: ${label}`);}
    for(const other of boxes)assert.ok(!(box.x<other.right&&box.right>other.x&&box.y<other.bottom&&box.bottom>other.y),`Collision: ${other.label} / ${label}`);
    for(const cover of nodes.slice(nodes.indexOf(node)+1).filter(item=>tag(item)==='rect'&&attr(item).fill!=='none')){const cx=n(cover,'x'),cy=n(cover,'y');assert.ok(!(box.x<cx+n(cover,'width')&&box.right>cx&&box.y<cy+n(cover,'height')&&box.bottom>cy),`Concealed label: ${label}`);}
    if(parent&&attr(parent)['data-region']==='not-covered'){
      for(const connector of nodes.filter(item=>tag(item)==='line'&&n(item,'x1')===n(item,'x2'))){
        const cx=n(connector,'x1'),y1=n(connector,'y1'),y2=n(connector,'y2');
        assert.ok(!(cx>box.x-2&&cx<box.right+2&&Math.max(y1,y2)>box.y-2&&Math.min(y1,y2)<box.bottom+2),'Connector crosses insurance note');
      }
    }
    boxes.push(box);
  }
  return {root,nodes};
}

test('twenty compositions preserve all cards/fonts/data, with four serial labels and a gap around the insurance note',()=>{
  assert.equal(variants.length,20);assert.equal(Object.keys(originalSignatures).length,20);
  for(const v of variants)assert.equal(signature(v),originalSignatures[v.name],v.name);
});

test('all variants are inert, use exact native paints and have distinct accessible IDs',()=>{
  const ids=new Set();
  for(const v of variants){const {nodes}=inspect(v.svg);for(const node of nodes)if(attr(node).id){assert.ok(!ids.has(attr(node).id));ids.add(attr(node).id);}for(const node of nodes.filter(item=>tag(item)==='title'||attr(item)['data-region']==='title'))assert.doesNotMatch(content(node),/ce (?:que|qui|qu[’'])|what .* (?:means|reveals)|—/iu);}
});

test('glyphs fit the viewBox, declared regions and cards without concealed or overlapping labels',async()=>{
  const errors=[];for(const v of variants)try{await geometry(v.svg);}catch(error){errors.push(`${v.name}: ${error.message}`);}assert.deepEqual(errors,[]);
});

test('exposure counts systems rather than plants or capacity, with a proportional solar/wind split',()=>{
  assert.deepEqual(EXPOSURE,{total:8547,solar:7942,wind:605,countries:35,published:'2026-10-06',unit:'systems',observationDate:null,plants:null,megawatts:null});
  assert.equal(EXPOSURE.solar+EXPOSURE.wind,EXPOSURE.total);
  for(const v of variants.filter(v=>v.kind==='exposure')){
    const {nodes,root}=inspect(v.svg),bar=nodes.find(node=>attr(node)['data-count-bar']==='true'),rects=children(bar).filter(node=>tag(node)==='rect');
    assert.equal(attr(bar)['data-total'],'8547');assert.equal(attr(bar)['data-unit'],'systems');assert.equal(rects.length,2);
    const total=n(rects[0],'width')+n(rects[1],'width');assert.ok(Math.abs(n(rects[0],'width')/total-7942/8547)<1e-12);assert.ok(Math.abs(n(rects[1],'width')/total-605/8547)<1e-12);
    assert.ok(content(root).includes(v.lang==='fr'?'Aucune estimation de MW menacés.':'No estimate of threatened MW.'));
    assert.ok(content(root).includes(v.lang==='fr'?'Modat':'Modat'));
  }
});

test('control, administration and uncertain onward reconstruction remain distinct',()=>{
  for(const v of variants.filter(v=>v.kind==='boundaries')){
    const {root,nodes}=inspect(v.svg),copy=content(root);
    for(const name of ['operations','router','admin-entry','private-network','other-site'])assert.equal(nodes.filter(node=>attr(node)['data-node']===name).length,1);
    assert.ok(copy.includes('2025'));assert.ok(copy.includes(v.lang==='fr'?'Administration':'Administration'));
    assert.ok(copy.includes(v.lang==='fr'?'Liaison série spécifiée':'Specified serial link'));
    assert.ok(nodes.some(node=>attr(node)['stroke-dasharray']==='6 7'));
    assert.match(copy,v.lang==='fr'?/incert/iu:/uncertain/iu);
  }
});

test('handoff retains authority, test, deploy, evidence, deferral and a review loop',()=>{
  for(const v of variants.filter(v=>v.kind==='handoff')){
    const {root,nodes}=inspect(v.svg);
    for(const name of ['information-0','information-1','information-2','mandate','qualification','install','proof','temporary'])assert.equal(nodes.filter(node=>attr(node)['data-node']===name).length,1);
    const loop=nodes.find(node=>attr(node)['data-edge']==='review-loop');assert.ok(loop);assert.ok(all(loop).some(node=>attr(node)['stroke-dasharray']==='5 6'));
    assert.ok(content(root).includes('III.4'));assert.ok(content(root).includes(v.lang==='fr'?'chaque contrat':'each contract')||content(root).includes(v.lang==='fr'?'pas un contrat de parc':'not an actual plant contract'));
  }
});

test('insurance wording is a model with conditional gates, not an observed payment; cash remains qualitative',()=>{
  for(const v of variants.filter(v=>v.kind==='coverage')){
    const {root,nodes}=inspect(v.svg),copy=content(root);
    for(const name of ['lma5400','lma5401','gate-0','gate-1','gate-2','possible-payment','retained'])assert.equal(nodes.filter(node=>attr(node)['data-node']===name).length,1);
    for(const term of ['LMA5400','LMA5401','Cyber Incident','Cyber Act'])assert.ok(copy.includes(term));
    assert.ok(copy.includes(v.lang==='fr'?'Indemnité possible':'Possible indemnity')||copy.includes(v.lang==='fr'?'Indemnitépossible':'Possibleindemnity'));
  }
  for(const v of variants.filter(v=>v.kind==='cash')){
    const copy=content(inspect(v.svg).root);
    assert.ok(copy.includes(v.lang==='fr'?'Scénario qualitatif':'Qualitative scenario'));
    assert.ok(copy.includes(v.lang==='fr'?'pas une échelle de temps':'not a time scale')||copy.includes(v.lang==='fr'?'PAS UNE ÉCHELLE DE TEMPS':'NOT A TIME SCALE'));
    assert.ok(copy.includes(v.lang==='fr'?'si due':'if due'));assert.doesNotMatch(copy,/[€$]|\d+\s*(?:jours|days)/u);
  }
});

test('input guards reject injection, coercion, invalid language, kind, number and references',()=>{
  const valid={lang:'fr',kind:'exposure',number:'1',caption:'Caption <script> remains plain Astro text',sources:'1 2 7'};
  assert.deepEqual(validateRenewablesAccessFigure(valid).references,['1','2','7']);
  for(const props of [null,[],{...valid,lang:'de'},{...valid,kind:'__proto__'},{...valid,number:'2'},{...valid,number:1},{...valid,caption:''},{...valid,sources:'1 1'},{...valid,sources:'01'},{...valid,sources:'1 javascript:alert(1)'},{...valid,sources:['1']}])assert.throws(()=>validateRenewablesAccessFigure(props));
  for(const args of [['de','cash',false],['fr','toString',false],['fr',{toString(){throw Error('coercion');}},false],['fr','cash','false']])assert.throws(()=>renewablesAccessSvg(...args));
  const svg=variants[0].svg;
  for(const bad of ['<script/>','<foreignObject/>','<image href="https://example.org/x"/>'])assert.throws(()=>inspect(svg.replace('</svg>',`${bad}</svg>`)));
  for(const bad of [svg.replace('<svg ','<svg onload="alert(1)" '),svg.replace(`fill="${paint('ink')}"`,'fill="url(https://example.org/x)"'),svg.replace(`fill="${paint('ink')}"`,'fill="#123456"')])assert.throws(()=>inspect(bad));
});

test('geometry failures are caught rather than hidden by clipping or a height clamp',async()=>{
  const svg=renewablesAccessSvg('en','handoff',true);
  await assert.rejects(geometry(svg.replace('>Deploy the patch<',`>${'W'.repeat(100)}<`)));
  await assert.rejects(geometry(svg.replace('width="344" height="143"','width="344" height="40"')));
  await assert.rejects(geometry(svg.replace('</svg>',`<rect x="28" y="1286" width="344" height="84" fill="${paint('surface')}"/></svg>`)));
  const coverage=renewablesAccessSvg('fr','coverage',false);
  await assert.rejects(geometry(coverage.replace('y2="657"','y2="703"')),/Connector crosses insurance note/u);
});

test('Astro keeps complete static variants, escaped captions, native details and responsive container reflow',()=>{
  const component=readFileSync(new URL('../src/components/RenewablesAccessFigure.astro',import.meta.url),'utf8');
  assert.ok(component.includes('validateRenewablesAccessFigure(Astro.props)'));
  for(const mobile of ['false','true'])assert.ok(component.includes(`set:html={renewablesAccessSvg(lang, kind, ${mobile})}`));
  assert.ok(component.includes('<slot />'));assert.ok(component.includes('@media (max-width: 640px)'));assert.ok(component.includes('@container (max-width: 640px)'));assert.ok(component.includes('padding-bottom: .85rem'));
  assert.doesNotMatch(component,/<script|set:html=\{caption\}|overflow:\s*hidden|max-height|text-overflow/u);
});
