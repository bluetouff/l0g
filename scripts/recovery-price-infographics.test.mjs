import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { XMLBuilder } from 'fast-xml-parser';
import { createProcessor } from '@mdx-js/mdx';
import postcss from 'postcss';
import { recoveryPriceSvg, recoveryPriceInlineSvg, recoveryPriceReferences, RECOVERY_PRICE_KINDS, RECOVERY_PRICE_REQUIRED_SOURCES } from '../src/lib/recoveryPriceFigures.mjs';
import { assertFontLicenseReferences } from './font-license-assertions.mjs';
import { assertRecoveryPriceFaithful, recoverRecoveryPriceOriginal, assertRecoveryPriceGeometry, assertRecoveryPricePanelGeometry, assertRecoveryPriceQuantitative, inspectRecoveryPriceSvg, recoveryPriceKinds, RECOVERY_PRICE_EXPECTED_SOURCES, RECOVERY_PRICE_BIBLIOGRAPHY_SOURCES, recoveryPricePathPoints } from './recovery-price-svg-assertions.mjs';
import { jlrParser, jlrTag, jlrAttrs, jlrChildren, jlrNodes, jlrText } from './jlr-svg-assertions.mjs';
const read=file=>readFileSync(new URL(`../${file}`,import.meta.url),'utf8');
const digest=value=>createHash('sha256').update(value).digest('hex');
const variants=recoveryPriceKinds.flatMap(kind=>['fr','en'].map(lang=>({kind,lang,svg:recoveryPriceSvg(lang,kind)})));
const mutate=(svg,change)=>{const root=jlrParser.parse(svg)[0];change(root,jlrNodes(root));return new XMLBuilder({preserveOrder:true,ignoreAttributes:false,attributeNamePrefix:'',format:false}).build([root]);};
const attributes=n=>Object.fromEntries((n.attributes??[]).map(a=>{assert.equal(a.type,'mdxJsxAttribute');assert.equal(typeof a.value,'string');return[a.name,a.value];}));
const mdxNodes=n=>[n,...(n.children??[]).flatMap(mdxNodes)];
const mdxText=n=>n.value??(n.children??[]).map(mdxText).join(' ');
const sourceIds={tsb:['01'],recovery:['04','05'],supervision:['06','07','08'],threshold:['09','11']};
const articlePath=lang=>`src/content/${lang==='fr'?'posts/apres-cyberattaque-08-prix-reprise':'posts-en/after-cyberattack-08-faster-recovery-cost'}.mdx`;
function articleContract(raw,lang){
 const tree=createProcessor().parse(raw.replace(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/u,'')),nodes=mdxNodes(tree),figures=nodes.filter(n=>n.name==='RecoveryPriceFigure');assert.equal(figures.length,4);
 for(const[i,figure]of figures.entries()){
  const a=attributes(figure);assert.deepEqual(Object.keys(a).sort(),['caption','kind','lang','number','sources']);assert.equal(a.lang,lang);assert.equal(a.kind,recoveryPriceKinds[i]);assert.equal(a.number,String(i+1).padStart(2,'0'));assert.ok(a.caption.length>40);recoveryPriceReferences(a.kind,a.sources);
  const details=mdxNodes(figure).filter(n=>n.name==='details');assert.equal(details.length,1);assert.ok(mdxNodes(details[0]).some(n=>n.name==='summary'));assert.ok(mdxText(details[0]).length>100);
 }
 for(const kind of recoveryPriceKinds)for(const[i,url]of RECOVERY_PRICE_BIBLIOGRAPHY_SOURCES[kind].entries()){
  const id=`source-${sourceIds[kind][i]}`,items=nodes.filter(n=>n.name==='li'&&attributes(n).id===id);assert.equal(items.length,1,`Unique bibliography ${id}`);
  const urls=mdxNodes(items[0]).filter(n=>n.name==='a').map(n=>attributes(n).href);assert.equal(urls.filter(value=>value===url).length,1,`Complete canonical URL for ${id}`);
 }
 return figures;
}

test('Recovery-price variants and references reject coercion, missing citations and prototype keys',()=>{
 assert.deepEqual(RECOVERY_PRICE_KINDS,recoveryPriceKinds);assert.ok(Object.isFrozen(RECOVERY_PRICE_KINDS));assert.ok(Object.isFrozen(RECOVERY_PRICE_REQUIRED_SOURCES));assert.equal(variants.length,8);
 for(const value of ['__proto__','constructor','toString','unknown',null,{},[],12,new String('tsb')])assert.throws(()=>recoveryPriceSvg('fr',value));
 for(const value of ['__proto__','constructor','xx',null,{},[],12,new String('fr')])assert.throws(()=>recoveryPriceSvg(value,'tsb'));
 for(const kind of recoveryPriceKinds){const required=RECOVERY_PRICE_REQUIRED_SOURCES[kind];assert.ok(Object.isFrozen(required));assert.deepEqual(recoveryPriceReferences(kind,required.join(' ')),required);for(const id of required)assert.throws(()=>recoveryPriceReferences(kind,required.filter(x=>x!==id).join(' ')));for(const suffix of [' 99',' __proto__',` ${required[0]}`])assert.throws(()=>recoveryPriceReferences(kind,required.join(' ')+suffix));}
 for(const sources of [null,{},12,'','1 8'])assert.throws(()=>recoveryPriceReferences('tsb',sources));
});

test('all 8 supplied recovery-price SVGs retain their complete bytes, geometry, fonts, text and source metadata',()=>{
 for(const{svg,lang,kind}of variants){assertRecoveryPriceFaithful(svg,lang,kind);const{nodes}=inspectRecoveryPriceSvg(svg,lang,kind);for(const n of inspectRecoveryPriceSvg(recoveryPriceInlineSvg(lang,kind),lang,kind,true).nodes.filter(n=>jlrTag(n)==='title'||jlrTag(n)==='text'&&jlrAttrs(n)['font-weight']==='700'))assert.doesNotMatch(jlrText(n),/—|\b(?:ce que|ce qui|what\b|clocks?|horloges?)|, (?:pas|not) /iu);}
});

test('all native shapes, cubic/quadratic paths and line/path marker extents stay inside the viewBoxes',()=>{
 assert.equal(variants.reduce((sum,v)=>sum+assertRecoveryPriceGeometry(v.svg,v.lang,v.kind),0),556);
 const svg=recoveryPriceSvg('fr','tsb');
 assert.throws(()=>assertRecoveryPriceGeometry(mutate(svg,(_,ns)=>{jlrAttrs(ns.find(n=>jlrTag(n)==='rect')).x='9999';}),'fr','tsb'));
 assert.throws(()=>assertRecoveryPriceGeometry(mutate(svg,(_,ns)=>{jlrAttrs(ns.find(n=>jlrTag(n)==='path'&&jlrAttrs(n)['marker-end'])).d='M990 990 L1000 990';}),'fr','tsb'));
});

test('passive recovery-price XML rejects active markup, unsafe attributes, altered metadata and source forgery',()=>{
 const svg=recoveryPriceSvg('fr','tsb');
 for(const tag of ['script','foreignObject','image','animate','style','iframe','use'])assert.throws(()=>inspectRecoveryPriceSvg(svg.replace('</svg>',`<${tag}/></svg>`),'fr','tsb'));
 for(const[key,value]of [['onload','alert(1)'],['href','javascript:alert(1)'],['xlink:href','data:text/html,x'],['style','fill:red'],['fill','url(https://evil.example/x)'],['font-family','Arial'],['x','Infinity'],['transform','translate(1 2)']])assert.throws(()=>inspectRecoveryPriceSvg(mutate(svg,(_,ns)=>{jlrAttrs(ns.find(n=>jlrTag(n)==='text'))[key]=value;}),'fr','tsb'));
 for(const text of ['<!DOCTYPE svg>','<?xml-stylesheet href="https://evil.example/"?>'])assert.throws(()=>inspectRecoveryPriceSvg(text+svg,'fr','tsb'));
 for(const kind of recoveryPriceKinds){const original=recoveryPriceSvg('fr',kind);for(const url of RECOVERY_PRICE_EXPECTED_SOURCES[kind])for(const forged of [url+'#forged',url+'?tracking=1',url.replace('https:','http:'),`https://evil.example/?next=${url}`]){
  const changed=mutate(original,(_,ns)=>{const metadata=ns.filter(n=>jlrTag(n)==='metadata'&&jlrAttrs(n).id===`jlr8-fr-0${recoveryPriceKinds.indexOf(kind)+1}-sources`);assert.equal(metadata.length,1);const children=jlrChildren(metadata[0]);assert.equal(children.length,1);assert.equal(jlrTag(children[0]),'#text');const raw=children[0]['#text'].replaceAll('&#x27;',"'"),token=`'${url}'`;assert.equal(raw.split(token).length-1,1,'Mutation targets one complete canonical URL');children[0]['#text']=raw.replace(token,`'${forged}'`);});
  assert.throws(()=>inspectRecoveryPriceSvg(changed,'fr',kind));
 }}
});

test('original goldens reject unintended paint, typography, text, ordering and proportional changes',()=>{
 const svg=recoveryPriceSvg('fr','tsb');for(const[key,value]of [['x','111'],['font-size','23'],['fill','#ff4d87'],['font-weight','600']])assert.throws(()=>assertRecoveryPriceFaithful(mutate(svg,(_,ns)=>{jlrAttrs(ns.find(n=>jlrTag(n)==='text'))[key]=value;}),'fr','tsb'));
 assert.throws(()=>assertRecoveryPriceFaithful(svg.replace(/(<title[^>]*>)[^<]+/u,'$1Autre titre contrôlé'),'fr','tsb'));
 assert.throws(()=>assertRecoveryPriceFaithful(mutate(svg,root=>{[root.svg[1],root.svg[2]]=[root.svg[2],root.svg[1]];}),'fr','tsb'));
 for(const{svg,lang,kind}of variants)assertRecoveryPriceQuantitative(svg,lang,kind);
 assert.throws(()=>assertRecoveryPriceQuantitative(recoveryPriceSvg('fr','supervision').replace('width="215.78"','width="210"'),'fr','supervision'));
 assert.throws(()=>assertRecoveryPriceQuantitative(recoveryPriceSvg('en','threshold').replace('y2="937.492"','y2="937"'),'en','threshold'));
});

test('render adaptation changes only responsive style, exact embedded font transport and four approved title nodes',()=>{
 let titles=0;
 for(const{lang,kind,svg}of variants){const inline=recoveryPriceInlineSvg(lang,kind);assertRecoveryPriceFaithful(inline,lang,kind,true);assert.equal(recoverRecoveryPriceOriginal(inline,kind,lang),svg);assert.doesNotMatch(inline,/<style|@font-face|data:font/u);
  if(kind==='recovery'){const old=lang==='fr'?'Les horloges de la reprise':'What the recovery clock measures',title=lang==='fr'?'Objectifs de reprise et durée mesurée':'Recovery targets and measured duration';assert.equal(svg.split(old).length,3);assert.equal(inline.split(title).length,3);titles+=2;assert.throws(()=>assertRecoveryPriceFaithful(inline.replace(title,old),lang,kind,true));}
 }
 assert.equal(titles,4);
 const svg=recoveryPriceSvg('fr','tsb');assert.throws(()=>inspectRecoveryPriceSvg(svg.replace('@font-face','@import'), 'fr','tsb'));assert.throws(()=>inspectRecoveryPriceSvg(svg.replace('base64,d09GMg','base64,e09GMg'),'fr','tsb'));
});

test('recovery-price presentation follows semantic themes and preserves supplied font stacks with readable HTML notes',()=>{
 const component=read('src/components/RecoveryPriceFigure.astro'),style=component.match(/<style>([\s\S]*?)<\/style>/u)[1],css=postcss.parse(style),rules=new Map();css.walkRules(r=>{if(r.parent.type==='root')rules.set(r.selector,Object.fromEntries(r.nodes.filter(n=>n.type==='decl').map(d=>[d.prop,d.value])));});
 const mapping={'#0c0d10':'ink','#13161c':'surface','#1a1e26':'surface-2','#28303b':'line-strong','#3b4351':'line-strong','#69778d':'muted','#a9b3c2':'muted','#e7e9ee':'paper','#5eead4':'signal','#ff4d87':'accent','#f5b13d':'amber','#7aa2f7':'topic-blue'};
 for(const[color,token]of Object.entries(mapping))for(const attr of ['fill','stroke'])assert.deepEqual(rules.get(`.recovery-price-figure :global([${attr}="${color}"])`),{[attr]:`var(--color-${token})`});
 const figure=rules.get('.recovery-price-figure'),graphic=rules.get('.recovery-price-figure :global(svg)');assert.deepEqual([figure.width,figure['max-width'],figure['padding-bottom'],figure.overflow],['100%','600px','.85rem','visible']);assert.deepEqual([graphic.width,graphic.height,graphic['max-width'],graphic['letter-spacing'],graphic.overflow],['100%','auto','100%','normal','visible']);
 css.walkDecls(d=>assert.doesNotMatch(d.value,/#(?:[a-f0-9]{3}){1,2}\b|url\(/iu));assert.doesNotMatch(style,/@font-face|font-family|clip-path|max-height|overflow\s*:\s*(?:hidden|clip)|transform\s*:|100vw/iu);
 assert.deepEqual(rules.get('.recovery-price-figure :global([stop-color="#5eead4"])'),{'stop-color':'var(--color-signal)'});
 assert.deepEqual(rules.get('.recovery-price-figure :global([stop-color="#ff4d87"])'),{'stop-color':'var(--color-accent)'});
 assert.deepEqual(rules.get(':global(html[data-theme="dark"]) .recovery-price-figure :global(pattern[id$="-02-hatch-blue"] path[opacity="0.36"])'),{opacity:'.12'});
 assert.deepEqual(rules.get(':global(html[data-theme="light"]) .recovery-price-figure :global(pattern[id$="-02-hatch-blue"] path[opacity="0.36"])'),{opacity:'.16'});
 assert.deepEqual(rules.get(':global(html[data-theme="dark"]) .recovery-price-figure :global(linearGradient[id$="-02-tealfade"] stop[stop-opacity="0.17"])'),{'stop-opacity':'.12'});
 assert.deepEqual(rules.get(':global(html[data-theme="dark"]) .recovery-price-figure :global(pattern[id$="-hatch-quiet"] path[opacity="0.36"])'),{opacity:'.12'});
 assert.deepEqual(rules.get(':global(html[data-theme="light"]) .recovery-price-figure :global(pattern path[opacity="0.36"])'),{opacity:'.18'});
 assert.match(component,/recoveryPriceReferences\(kind, sources\)/u);assert.match(component,/recoveryPriceInlineSvg\(lang, kind\)/u);assert.equal((component.match(/set:html=/gu)??[]).length,1);
 for(const family of ['inter','jetbrains-mono'])assert.ok(component.includes(`href="/fonts/jlr/LICENSE-${family}.txt"`));
});

test('both supplied font bytes and complete licences match the existing site assets',()=>{
 for(const[family,fontHash,licenceHash]of [['inter','3100e775e8616cd2611beecfa23a4263d7037586789b43f035236a2e6fbd4c62','3b0a5fca3d17942cde889069889dedbbbd075e9b599968c82a95f4d944e9b345'],['jetbrains-mono','18be452724bfdc236c074ca94a249a7f41a86752c7d04ab258ce9ed5651f6a7e','403581b69dac5cff4079205e01c6b467e56af449ecbd7247693ddb1baafa005b']]){
  assert.equal(digest(readFileSync(new URL(`../node_modules/@fontsource-variable/${family}/files/${family}-latin-wght-normal.woff2`,import.meta.url))),fontHash);const licence=read(`public/fonts/jlr/LICENSE-${family}.txt`);assert.equal(digest(licence),licenceHash);assertFontLicenseReferences(licence,family);
 }
});

test('embedded data-fonts decode to the exact local font files and metadata-only research references reject forgery',()=>{
 const expected=['3100e775e8616cd2611beecfa23a4263d7037586789b43f035236a2e6fbd4c62','18be452724bfdc236c074ca94a249a7f41a86752c7d04ab258ce9ed5651f6a7e'];
 for(const{svg,lang,kind}of variants){const{nodes}=inspectRecoveryPriceSvg(svg,lang,kind),styles=nodes.filter(n=>jlrTag(n)==='style');assert.equal(styles.length,1);const fonts=[...jlrText(styles[0]).matchAll(/url\(data:font\/woff2;base64,([A-Za-z0-9+/=]+)\)/gu)];assert.equal(fonts.length,2);assert.deepEqual(fonts.map(match=>digest(Buffer.from(match[1],'base64'))),expected);}
 const original=recoveryPriceSvg('fr','supervision'),changed=mutate(original,(_,ns)=>{const metadata=ns.find(n=>jlrTag(n)==='metadata'),child=jlrChildren(metadata)[0],before="0.596";assert.equal(child['#text'].split(before).length,2,'Mutation changes exactly one metadata coefficient');child['#text']=child['#text'].replace(before,"0.600");});assert.throws(()=>inspectRecoveryPriceSvg(changed,'fr','supervision'));
});

test('native bilingual recovery-price MDX includes ordered figures, exact source URLs and detailed methods',()=>{for(const lang of ['fr','en'])articleContract(read(articlePath(lang)),lang);});

test('recovery-price MDX contract rejects incomplete, reordered, dynamic and forged declarations',()=>{
 const raw=read(articlePath('fr'));for(const mutation of [raw.replace('sources="01"','sources="99"'),raw.replace('number="01"','number="02"'),raw.replace('lang="fr" kind="tsb"','lang={"fr"} kind="tsb"'),raw.replace(RECOVERY_PRICE_BIBLIOGRAPHY_SOURCES.tsb[0],`https://evil.example/?next=${RECOVERY_PRICE_BIBLIOGRAPHY_SOURCES.tsb[0]}`),raw.replace('<details><summary>Méthode et périmètre</summary>','<div><summary>Méthode et périmètre</summary>')])assert.throws(()=>articleContract(mutation,'fr'));
});


test('bounded recovery-price path grammar consumes absolute cubic, quadratic, horizontal and vertical segments',()=>{
 assert.deepEqual(recoveryPricePathPoints('M1 2 H3 V4 Q5 6 7 8 C9 10 11 12 13 14 Z'),[[1,2],[3,2],[3,4],[5,6],[7,8],[9,10],[11,12],[13,14],[1,2]]);
 for(const value of ['',null,12,'M1 2 H','M1 2 C3 4 5 6','M1 2 HInfinity','M1 2 V10001','M1 2 L3 4 trailing','M1 2 S3 4 5 6','M1 2 L3,4','M1 2 3 4','M1 2 C'+ '1 2 '.repeat(1025)])assert.throws(()=>recoveryPricePathPoints(value));
 for(const id of ['hatch-quiet']){const svg=recoveryPriceSvg('fr','supervision');for(const reference of ['url(https://evil.example/x)','url(#missing)','url(javascript:alert(1))'])assert.throws(()=>inspectRecoveryPriceSvg(svg.replace(`url(#jlr8-fr-03-${id})`,reference),'fr','supervision'));}
});







test('all 84 internal panels retain 288 label associations with the supplied font metrics',()=>{
 assert.equal(variants.reduce((sum,v)=>sum+assertRecoveryPricePanelGeometry(recoveryPriceInlineSvg(v.lang,v.kind),v.lang,v.kind,true),0),288);
 const svg=recoveryPriceInlineSvg('fr','recovery');
 const move=(axis,value)=>mutate(svg,(_,ns)=>{const n=ns.find(n=>jlrTag(n)==='text'&&jlrText(n)==='Réconcilier et valider');jlrAttrs(n)[axis]=value;if(axis==='x')for(const span of jlrChildren(n))jlrAttrs(span).x=value;});
 for(const[axis,value]of [['x','800'],['y','1270']]){const changed=move(axis,value);assert.throws(()=>assertRecoveryPricePanelGeometry(changed,'fr','recovery',true),/internal panel/u);}
 for(const change of [
  (_,ns)=>{jlrAttrs(ns.find(n=>jlrTag(n)==='rect'&&jlrAttrs(n).x==='206'&&jlrAttrs(n).y==='1130')).width='100';},
  (_,ns)=>{jlrAttrs(ns.find(n=>jlrTag(n)==='text'&&jlrText(n)==='Réconcilier et valider'))['font-size']='30';},
  (_,ns)=>{jlrAttrs(jlrChildren(ns.find(n=>jlrTag(n)==='text'&&jlrText(n)==='Réconcilier et valider'))[0]).dy='1';},
 ])assert.throws(()=>assertRecoveryPricePanelGeometry(mutate(svg,change),'fr','recovery',true));
});
