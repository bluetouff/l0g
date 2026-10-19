import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { XMLBuilder } from 'fast-xml-parser';
import { createProcessor } from '@mdx-js/mdx';
import postcss from 'postcss';
import { jlrRecoverySvg, jlrRecoveryInlineSvg, jlrRecoveryReferences, JLR_RECOVERY_KINDS, JLR_RECOVERY_REQUIRED_SOURCES } from '../src/lib/jlrRecoveryFigures.mjs';
import { assertFontLicenseReferences } from './font-license-assertions.mjs';
import { assertRecoveryFaithful, assertRecoveryGeometry, assertRecoveryQuantitative, assertRecoveryPanelGeometry, inspectRecoverySvg, recoveryKinds, RECOVERY_EXPECTED_SOURCES, RECOVERY_BIBLIOGRAPHY_SOURCES, RECOVERY_PANEL_EDITS, recoveryPathPoints } from './jlr-recovery-svg-assertions.mjs';
import { jlrParser, jlrTag, jlrAttrs, jlrChildren, jlrNodes, jlrText } from './jlr-svg-assertions.mjs';
const read=file=>readFileSync(new URL(`../${file}`,import.meta.url),'utf8');
const digest=value=>createHash('sha256').update(value).digest('hex');
const variants=recoveryKinds.flatMap(kind=>['fr','en'].map(lang=>({kind,lang,svg:jlrRecoverySvg(lang,kind)})));
const mutate=(svg,change)=>{const root=jlrParser.parse(svg)[0];change(root,jlrNodes(root));return new XMLBuilder({preserveOrder:true,ignoreAttributes:false,attributeNamePrefix:'',format:false}).build([root]);};
const attributes=n=>Object.fromEntries((n.attributes??[]).map(a=>{assert.equal(a.type,'mdxJsxAttribute');assert.equal(typeof a.value,'string');return[a.name,a.value];}));
const mdxNodes=n=>[n,...(n.children??[]).flatMap(mdxNodes)];
const mdxText=n=>n.value??(n.children??[]).map(mdxText).join(' ');
const sourceIds={reconstruction:['01'],'ms-costs':['05','18'],'ncc-retainer':['08','09','10'],workstreams:['01','03','04']};
const articlePath=lang=>`src/content/${lang==='fr'?'posts/apres-cyberattaque-05-economie-remise-en-route':'posts-en/after-cyberattack-05-economics-of-recovery'}.mdx`;
function articleContract(raw,lang){
 const tree=createProcessor().parse(raw.replace(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/u,'')),nodes=mdxNodes(tree),figures=nodes.filter(n=>n.name==='JlrRecoveryFigure');assert.equal(figures.length,4);
 for(const[i,figure]of figures.entries()){
  const a=attributes(figure);assert.deepEqual(Object.keys(a).sort(),['caption','kind','lang','number','sources']);assert.equal(a.lang,lang);assert.equal(a.kind,recoveryKinds[i]);assert.equal(a.number,String(i+1).padStart(2,'0'));assert.ok(a.caption.length>40);jlrRecoveryReferences(a.kind,a.sources);
  const details=mdxNodes(figure).filter(n=>n.name==='details');assert.equal(details.length,1);assert.ok(mdxNodes(details[0]).some(n=>n.name==='summary'));assert.ok(mdxText(details[0]).length>100);
 }
 for(const kind of recoveryKinds)for(const[i,url]of RECOVERY_BIBLIOGRAPHY_SOURCES[kind].entries()){
  const id=`source-${sourceIds[kind][i]}`,items=nodes.filter(n=>n.name==='li'&&attributes(n).id===id);assert.equal(items.length,1,`Unique bibliography ${id}`);
  const urls=mdxNodes(items[0]).filter(n=>n.name==='a').map(n=>attributes(n).href);assert.equal(urls.filter(value=>value===url).length,1,`Complete canonical URL for ${id}`);
 }
 return figures;
}

test('JLR recovery variants and references reject coercion, missing citations and prototype keys',()=>{
 assert.deepEqual(JLR_RECOVERY_KINDS,recoveryKinds);assert.ok(Object.isFrozen(JLR_RECOVERY_KINDS));assert.ok(Object.isFrozen(JLR_RECOVERY_REQUIRED_SOURCES));assert.equal(variants.length,8);
 for(const value of ['__proto__','constructor','toString','unknown',null,{},[],12,new String('reconstruction')])assert.throws(()=>jlrRecoverySvg('fr',value));
 for(const value of ['__proto__','constructor','xx',null,{},[],12,new String('fr')])assert.throws(()=>jlrRecoverySvg(value,'reconstruction'));
 for(const kind of recoveryKinds){const required=JLR_RECOVERY_REQUIRED_SOURCES[kind];assert.ok(Object.isFrozen(required));assert.deepEqual(jlrRecoveryReferences(kind,required.join(' ')),required);for(const id of required)assert.throws(()=>jlrRecoveryReferences(kind,required.filter(x=>x!==id).join(' ')));for(const suffix of [' 99',' __proto__',` ${required[0]}`])assert.throws(()=>jlrRecoveryReferences(kind,required.join(' ')+suffix));}
 for(const sources of [null,{},12,'','1 8'])assert.throws(()=>jlrRecoveryReferences('reconstruction',sources));
});

test('all 8 supplied recovery SVGs retain their complete bytes, geometry, fonts, text and source metadata',()=>{
 for(const{svg,lang,kind}of variants){assertRecoveryFaithful(svg,lang,kind);const{nodes}=inspectRecoverySvg(jlrRecoveryInlineSvg(lang,kind),lang,kind,true);for(const n of nodes.filter(n=>jlrTag(n)==='title'||jlrTag(n)==='text'&&jlrAttrs(n)['font-weight']==='700'))assert.doesNotMatch(jlrText(n),/—|\b(?:ce que|ce qui|what\b|clocks?|horloges?)|, (?:pas|not) /iu);}
});

test('all native shapes, cubic/quadratic paths and line/path marker extents stay inside the viewBoxes',()=>{
 assert.equal(variants.reduce((sum,v)=>sum+assertRecoveryGeometry(v.svg,v.lang,v.kind),0),404);
 const svg=jlrRecoverySvg('fr','reconstruction');
 assert.throws(()=>assertRecoveryGeometry(mutate(svg,(_,ns)=>{jlrAttrs(ns.find(n=>jlrTag(n)==='rect')).x='9999';}),'fr','reconstruction'));
 assert.throws(()=>assertRecoveryGeometry(mutate(svg,(_,ns)=>{jlrAttrs(ns.find(n=>jlrTag(n)==='path'&&jlrAttrs(n)['marker-end'])).d='M990 990 L1000 990';}),'fr','reconstruction'));
});

test('passive recovery XML rejects active markup, unsafe attributes, altered metadata and source forgery',()=>{
 const svg=jlrRecoverySvg('fr','reconstruction');
 for(const tag of ['script','foreignObject','image','animate','style','iframe','use'])assert.throws(()=>inspectRecoverySvg(svg.replace('</svg>',`<${tag}/></svg>`),'fr','reconstruction'));
 for(const[key,value]of [['onload','alert(1)'],['href','javascript:alert(1)'],['xlink:href','data:text/html,x'],['style','fill:red'],['fill','url(https://evil.example/x)'],['font-family','Arial'],['x','Infinity'],['transform','translate(1 2)']])assert.throws(()=>inspectRecoverySvg(mutate(svg,(_,ns)=>{jlrAttrs(ns.find(n=>jlrTag(n)==='text'))[key]=value;}),'fr','reconstruction'));
 for(const text of ['<!DOCTYPE svg>','<?xml-stylesheet href="https://evil.example/"?>'])assert.throws(()=>inspectRecoverySvg(text+svg,'fr','reconstruction'));
 for(const kind of recoveryKinds){const original=jlrRecoverySvg('fr',kind);for(const url of RECOVERY_EXPECTED_SOURCES[kind])for(const forged of [url+'#forged',url+'?tracking=1',url.replace('https:','http:'),`https://evil.example/?next=${url}`])assert.throws(()=>inspectRecoverySvg(mutate(original,(_,ns)=>{const metadata=ns.filter(n=>jlrTag(n)==='metadata'&&jlrAttrs(n).id===`jlr5-fr-0${recoveryKinds.indexOf(kind)+1}-sources`);assert.equal(metadata.length,1);const children=jlrChildren(metadata[0]);assert.equal(children.length,1);assert.equal(jlrTag(children[0]),'#text');let raw=children[0]['#text'];if(kind==='reconstruction'||kind==='workstreams'){const data=JSON.parse(raw),matches=Object.values(data.sources).filter(source=>source.url===url);assert.equal(matches.length,1);matches[0].url=forged;raw=JSON.stringify(data);}else{const lines=raw.split('\n'),matching=lines.flatMap((line,index)=>(kind==='ms-costs'?line.split(';').at(-1).trim():line.split(' ').at(-1))===url?[index]:[]);assert.equal(matching.length,1);assert.equal(lines[matching[0]].slice(-url.length),url);lines[matching[0]]=lines[matching[0]].slice(0,-url.length)+forged;raw=lines.join('\n');}children[0]['#text']=raw;}),'fr',kind));}
});

test('original goldens reject unintended paint, typography, text, ordering and proportional changes',()=>{
 const svg=jlrRecoverySvg('fr','reconstruction');for(const[key,value]of [['x','111'],['font-size','23'],['fill','#ff4d87'],['font-weight','600']])assert.throws(()=>assertRecoveryFaithful(mutate(svg,(_,ns)=>{jlrAttrs(ns.find(n=>jlrTag(n)==='text'))[key]=value;}),'fr','reconstruction'));
 assert.throws(()=>assertRecoveryFaithful(svg.replace(/(<title[^>]*>)[^<]+/u,'$1Autre titre contrôlé'),'fr','reconstruction'));
 assert.throws(()=>assertRecoveryFaithful(mutate(svg,root=>{[root.svg[1],root.svg[2]]=[root.svg[2],root.svg[1]];}),'fr','reconstruction'));
 for(const{svg,lang,kind}of variants)assertRecoveryQuantitative(svg,lang,kind);
 assert.throws(()=>assertRecoveryQuantitative(jlrRecoverySvg('fr','ms-costs').replace('width="705.913"','width="700"'),'fr','ms-costs'));
 assert.throws(()=>assertRecoveryQuantitative(jlrRecoverySvg('en','ncc-retainer').replace('width="533.416"','width="500"'),'en','ncc-retainer'));
 assert.throws(()=>assertRecoveryQuantitative(jlrRecoverySvg('fr','workstreams').replace('width="624"','width="600"'),'fr','workstreams'));
});

test('render adaptation adds responsive root style and the single permitted French title substitution',()=>{
 for(const{lang,kind,svg}of variants){const inline=jlrRecoveryInlineSvg(lang,kind);assertRecoveryFaithful(inline,lang,kind,true);let recovered=inline.replace('<svg style="width:100%;height:auto" ','<svg ');if(lang==='fr'&&kind==='ms-costs'){assert.equal(recovered.split('M&amp;S : les travaux du redémarrage').length-1,2);recovered=recovered.replaceAll('M&amp;S : les travaux du redémarrage','M&amp;S : ce que mobilise le redémarrage');}if(kind==='ms-costs')for(const {before,after}of RECOVERY_PANEL_EDITS[lang]){assert.equal(recovered.split(after).length-1,1);recovered=recovered.replace(after,before);}assert.equal(recovered,svg);}
});

test('recovery presentation follows semantic themes and preserves supplied font stacks with readable HTML notes',()=>{
 const component=read('src/components/JlrRecoveryFigure.astro'),style=component.match(/<style>([\s\S]*?)<\/style>/u)[1],css=postcss.parse(style),rules=new Map();css.walkRules(r=>{if(r.parent.type==='root')rules.set(r.selector,Object.fromEntries(r.nodes.filter(n=>n.type==='decl').map(d=>[d.prop,d.value])));});
 const mapping={'#0c0d10':'ink','#13161c':'surface','#1a1e26':'surface-2','#28303b':'line-strong','#3b4351':'line-strong','#69778d':'muted','#a9b3c2':'muted','#e7e9ee':'paper','#5eead4':'signal','#ff4d87':'accent','#f5b13d':'amber','#7aa2f7':'topic-blue'};
 for(const[color,token]of Object.entries(mapping))for(const attr of ['fill','stroke'])assert.deepEqual(rules.get(`.jlr-recovery-figure :global([${attr}="${color}"])`),{[attr]:`var(--color-${token})`});
 const figure=rules.get('.jlr-recovery-figure'),graphic=rules.get('.jlr-recovery-figure :global(svg)');assert.deepEqual([figure.width,figure['max-width'],figure['padding-bottom'],figure.overflow],['100%','600px','.85rem','visible']);assert.deepEqual([graphic.width,graphic.height,graphic['max-width'],graphic['letter-spacing'],graphic.overflow],['100%','auto','100%','normal','visible']);
 css.walkDecls(d=>assert.doesNotMatch(d.value,/#(?:[a-f0-9]{3}){1,2}\b|url\(/iu));assert.doesNotMatch(style,/@font-face|font-family|clip-path|max-height|overflow\s*:\s*(?:hidden|clip)|transform\s*:|100vw/iu);
 assert.deepEqual(rules.get('.jlr-recovery-figure :global([stop-color="#5eead4"])'),{'stop-color':'var(--color-signal)'});
 assert.deepEqual(rules.get('.jlr-recovery-figure :global([stop-color="#ff4d87"])'),{'stop-color':'var(--color-accent)'});
 assert.deepEqual(rules.get(':global(html[data-theme="dark"]) .jlr-recovery-figure :global(linearGradient[id$="-01-teal-fade"] stop[stop-opacity="0.18"])'),{'stop-opacity':'.10'});
 assert.deepEqual(rules.get(':global(html[data-theme="light"]) .jlr-recovery-figure :global(pattern path[opacity="0.36"])'),{opacity:'.18'});
 assert.match(component,/jlrRecoveryReferences\(kind, sources\)/u);assert.match(component,/jlrRecoveryInlineSvg\(lang, kind\)/u);assert.equal((component.match(/set:html=/gu)??[]).length,1);
 for(const family of ['inter','jetbrains-mono'])assert.ok(component.includes(`href="/fonts/jlr/LICENSE-${family}.txt"`));
});

test('both supplied font bytes and complete licences match the existing site assets',()=>{
 for(const[family,fontHash,licenceHash]of [['inter','3100e775e8616cd2611beecfa23a4263d7037586789b43f035236a2e6fbd4c62','3b0a5fca3d17942cde889069889dedbbbd075e9b599968c82a95f4d944e9b345'],['jetbrains-mono','18be452724bfdc236c074ca94a249a7f41a86752c7d04ab258ce9ed5651f6a7e','403581b69dac5cff4079205e01c6b467e56af449ecbd7247693ddb1baafa005b']]){
  assert.equal(digest(readFileSync(new URL(`../node_modules/@fontsource-variable/${family}/files/${family}-latin-wght-normal.woff2`,import.meta.url))),fontHash);const licence=read(`public/fonts/jlr/LICENSE-${family}.txt`);assert.equal(digest(licence),licenceHash);assertFontLicenseReferences(licence,family);
 }
});

test('native bilingual recovery MDX includes ordered figures, exact source URLs and detailed methods',()=>{for(const lang of ['fr','en'])articleContract(read(articlePath(lang)),lang);});

test('recovery MDX contract rejects incomplete, reordered, dynamic and forged declarations',()=>{
 const raw=read(articlePath('fr'));for(const mutation of [raw.replace('sources="01"','sources="05"'),raw.replace('number="01"','number="02"'),raw.replace('lang="fr" kind="reconstruction"','lang={"fr"} kind="reconstruction"'),raw.replace(RECOVERY_BIBLIOGRAPHY_SOURCES.reconstruction[0],`https://evil.example/?next=${RECOVERY_BIBLIOGRAPHY_SOURCES.reconstruction[0]}`),raw.replace('<details><summary>Méthode et périmètre</summary>','<div><summary>Méthode et périmètre</summary>')])assert.throws(()=>articleContract(mutation,'fr'));
});


test('bounded recovery path grammar consumes absolute cubic, quadratic, horizontal and vertical segments',()=>{
 assert.deepEqual(recoveryPathPoints('M1 2 H3 V4 Q5 6 7 8 C9 10 11 12 13 14 Z'),[[1,2],[3,2],[3,4],[5,6],[7,8],[9,10],[11,12],[13,14],[1,2]]);
 for(const value of ['',null,12,'M1 2 H','M1 2 C3 4 5 6','M1 2 HInfinity','M1 2 V10001','M1 2 L3 4 trailing','M1 2 S3 4 5 6','M1 2 L3,4','M1 2 3 4','M1 2 C'+ '1 2 '.repeat(1025)])assert.throws(()=>recoveryPathPoints(value));
 for(const[kind,id]of [['reconstruction','teal-fade'],['ncc-retainer','hatch-pink']]){const svg=jlrRecoverySvg('fr',kind),number=String(recoveryKinds.indexOf(kind)+1).padStart(2,'0');for(const reference of ['url(https://evil.example/x)','url(#missing)','url(javascript:alert(1))'])assert.throws(()=>inspectRecoverySvg(svg.replace(`url(#jlr5-fr-${number}-${id})`,reference),'fr',kind));}
});


test('M&S adapted labels preserve words and fonts within the original internal panels',()=>{
 let lines=0;for(const lang of ['fr','en'])lines+=assertRecoveryPanelGeometry(jlrRecoveryInlineSvg(lang,'ms-costs'),lang,'ms-costs');assert.equal(lines,11);
 for(const lang of ['fr','en']){
  const svg=jlrRecoveryInlineSvg(lang,'ms-costs'),label=lang==='fr'?'Davantage de':'More count';
  for(const change of [
   (_,ns)=>{jlrAttrs(ns.find(n=>jlrTag(n)==='text'&&jlrText(jlrChildren(n)[0])===label)).y='1150';},
   (_,ns)=>{const t=ns.find(n=>jlrTag(n)==='text'&&jlrText(jlrChildren(n)[0])===label);jlrAttrs(jlrChildren(t)[1]).x='980';},
   (_,ns)=>{const panels=ns.filter(n=>jlrTag(n)==='rect'&&jlrAttrs(n).x==='48'&&jlrAttrs(n).y==='927');assert.equal(panels.length,1);jlrAttrs(panels[0]).width='200';},
   (_,ns)=>{jlrAttrs(ns.find(n=>jlrTag(n)==='text'&&jlrText(jlrChildren(n)[0])===label))['font-size']='24';},
  ])assert.throws(()=>assertRecoveryPanelGeometry(mutate(svg,change),lang,'ms-costs'));
 }
});
