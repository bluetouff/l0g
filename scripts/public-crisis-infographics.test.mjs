import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { XMLBuilder } from 'fast-xml-parser';
import { createProcessor } from '@mdx-js/mdx';
import postcss from 'postcss';
import { publicCrisisSvg, publicCrisisInlineSvg, publicCrisisReferences, PUBLIC_CRISIS_KINDS, PUBLIC_CRISIS_REQUIRED_SOURCES } from '../src/lib/publicCrisisFigures.mjs';
import { assertFontLicenseReferences } from './font-license-assertions.mjs';
import { assertPublicCrisisFaithful, recoverPublicCrisisOriginal, assertPublicCrisisGeometry, assertPublicCrisisPanelGeometry, assertPublicCrisisQuantitative, inspectPublicCrisisSvg, publicCrisisKinds, PUBLIC_CRISIS_EXPECTED_SOURCES, PUBLIC_CRISIS_BIBLIOGRAPHY_SOURCES, publicCrisisPathPoints } from './public-crisis-svg-assertions.mjs';
import { jlrParser, jlrTag, jlrAttrs, jlrChildren, jlrNodes, jlrText } from './jlr-svg-assertions.mjs';
const read=file=>readFileSync(new URL(`../${file}`,import.meta.url),'utf8');
const digest=value=>createHash('sha256').update(value).digest('hex');
const variants=publicCrisisKinds.flatMap(kind=>['fr','en'].map(lang=>({kind,lang,svg:publicCrisisSvg(lang,kind)})));
const mutate=(svg,change)=>{const root=jlrParser.parse(svg)[0];change(root,jlrNodes(root));return new XMLBuilder({preserveOrder:true,ignoreAttributes:false,attributeNamePrefix:'',format:false}).build([root]);};
const attributes=n=>Object.fromEntries((n.attributes??[]).map(a=>{assert.equal(a.type,'mdxJsxAttribute');assert.equal(typeof a.value,'string');return[a.name,a.value];}));
const mdxNodes=n=>[n,...(n.children??[]).flatMap(mdxNodes)];
const mdxText=n=>n.value??(n.children??[]).map(mdxText).join(' ');
const sourceIds={decision:['01','02','18','19'],guarantee:['03','05','21'],financing:['06','07','10','11'],monitoring:['05','08','09','13','14']};
const articlePath=lang=>`src/content/${lang==='fr'?'posts/apres-cyberattaque-07-etat-financement-crise':'posts-en/after-cyberattack-07-public-crisis-financing'}.mdx`;
function articleContract(raw,lang){
 const tree=createProcessor().parse(raw.replace(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/u,'')),nodes=mdxNodes(tree),figures=nodes.filter(n=>n.name==='PublicCrisisFigure');assert.equal(figures.length,4);
 for(const[i,figure]of figures.entries()){
  const a=attributes(figure);assert.deepEqual(Object.keys(a).sort(),['caption','kind','lang','number','sources']);assert.equal(a.lang,lang);assert.equal(a.kind,publicCrisisKinds[i]);assert.equal(a.number,String(i+1).padStart(2,'0'));assert.ok(a.caption.length>40);publicCrisisReferences(a.kind,a.sources);
  const details=mdxNodes(figure).filter(n=>n.name==='details');assert.equal(details.length,1);assert.ok(mdxNodes(details[0]).some(n=>n.name==='summary'));assert.ok(mdxText(details[0]).length>100);
 }
 for(const kind of publicCrisisKinds)for(const[i,url]of PUBLIC_CRISIS_BIBLIOGRAPHY_SOURCES[kind].entries()){
  const id=`source-${sourceIds[kind][i]}`,items=nodes.filter(n=>n.name==='li'&&attributes(n).id===id);assert.equal(items.length,1,`Unique bibliography ${id}`);
  const urls=mdxNodes(items[0]).filter(n=>n.name==='a').map(n=>attributes(n).href);assert.equal(urls.filter(value=>value===url).length,1,`Complete canonical URL for ${id}`);
 }
 return figures;
}

test('Public-crisis variants and references reject coercion, missing citations and prototype keys',()=>{
 assert.deepEqual(PUBLIC_CRISIS_KINDS,publicCrisisKinds);assert.ok(Object.isFrozen(PUBLIC_CRISIS_KINDS));assert.ok(Object.isFrozen(PUBLIC_CRISIS_REQUIRED_SOURCES));assert.equal(variants.length,8);
 for(const value of ['__proto__','constructor','toString','unknown',null,{},[],12,new String('decision')])assert.throws(()=>publicCrisisSvg('fr',value));
 for(const value of ['__proto__','constructor','xx',null,{},[],12,new String('fr')])assert.throws(()=>publicCrisisSvg(value,'decision'));
 for(const kind of publicCrisisKinds){const required=PUBLIC_CRISIS_REQUIRED_SOURCES[kind];assert.ok(Object.isFrozen(required));assert.deepEqual(publicCrisisReferences(kind,required.join(' ')),required);for(const id of required)assert.throws(()=>publicCrisisReferences(kind,required.filter(x=>x!==id).join(' ')));for(const suffix of [' 99',' __proto__',` ${required[0]}`])assert.throws(()=>publicCrisisReferences(kind,required.join(' ')+suffix));}
 for(const sources of [null,{},12,'','1 8'])assert.throws(()=>publicCrisisReferences('decision',sources));
});

test('all 8 supplied public-crisis SVGs retain their complete bytes, geometry, fonts, text and source metadata',()=>{
 for(const{svg,lang,kind}of variants){assertPublicCrisisFaithful(svg,lang,kind);const{nodes}=inspectPublicCrisisSvg(svg,lang,kind);for(const n of nodes.filter(n=>jlrTag(n)==='title'||jlrTag(n)==='text'&&jlrAttrs(n)['font-weight']==='700'))assert.doesNotMatch(jlrText(n),/—|\b(?:ce que|ce qui|what\b|clocks?|horloges?)|, (?:pas|not) /iu);}
});

test('all native shapes, cubic/quadratic paths and line/path marker extents stay inside the viewBoxes',()=>{
 assert.equal(variants.reduce((sum,v)=>sum+assertPublicCrisisGeometry(v.svg,v.lang,v.kind),0),274);
 const svg=publicCrisisSvg('fr','decision');
 assert.throws(()=>assertPublicCrisisGeometry(mutate(svg,(_,ns)=>{jlrAttrs(ns.find(n=>jlrTag(n)==='rect')).x='9999';}),'fr','decision'));
 assert.throws(()=>assertPublicCrisisGeometry(mutate(svg,(_,ns)=>{jlrAttrs(ns.find(n=>jlrTag(n)==='path'&&jlrAttrs(n)['marker-end'])).d='M990 990 L1000 990';}),'fr','decision'));
});

test('passive public-crisis XML rejects active markup, unsafe attributes, altered metadata and source forgery',()=>{
 const svg=publicCrisisSvg('fr','decision');
 for(const tag of ['script','foreignObject','image','animate','style','iframe','use'])assert.throws(()=>inspectPublicCrisisSvg(svg.replace('</svg>',`<${tag}/></svg>`),'fr','decision'));
 for(const[key,value]of [['onload','alert(1)'],['href','javascript:alert(1)'],['xlink:href','data:text/html,x'],['style','fill:red'],['fill','url(https://evil.example/x)'],['font-family','Arial'],['x','Infinity'],['transform','translate(1 2)']])assert.throws(()=>inspectPublicCrisisSvg(mutate(svg,(_,ns)=>{jlrAttrs(ns.find(n=>jlrTag(n)==='text'))[key]=value;}),'fr','decision'));
 for(const text of ['<!DOCTYPE svg>','<?xml-stylesheet href="https://evil.example/"?>'])assert.throws(()=>inspectPublicCrisisSvg(text+svg,'fr','decision'));
 for(const kind of publicCrisisKinds){const original=publicCrisisSvg('fr',kind);for(const url of PUBLIC_CRISIS_EXPECTED_SOURCES[kind])for(const forged of [url+'#forged',url+'?tracking=1',url.replace('https:','http:'),`https://evil.example/?next=${url}`])assert.throws(()=>inspectPublicCrisisSvg(mutate(original,(_,ns)=>{
  const metadata=ns.filter(n=>jlrTag(n)==='metadata'&&jlrAttrs(n).id===`jlr7-fr-0${publicCrisisKinds.indexOf(kind)+1}-sources`);assert.equal(metadata.length,1);const children=jlrChildren(metadata[0]);assert.equal(children.length,1);assert.equal(jlrTag(children[0]),'#text');let raw=children[0]['#text'];
  const token=`'${url}'`;assert.equal(raw.split(token).length-1,1);children[0]['#text']=raw.replace(token,`'${forged}'`);
 }),'fr',kind));}
});

test('original goldens reject unintended paint, typography, text, ordering and proportional changes',()=>{
 const svg=publicCrisisSvg('fr','decision');for(const[key,value]of [['x','111'],['font-size','23'],['fill','#ff4d87'],['font-weight','600']])assert.throws(()=>assertPublicCrisisFaithful(mutate(svg,(_,ns)=>{jlrAttrs(ns.find(n=>jlrTag(n)==='text'))[key]=value;}),'fr','decision'));
 assert.throws(()=>assertPublicCrisisFaithful(svg.replace(/(<title[^>]*>)[^<]+/u,'$1Autre titre contrôlé'),'fr','decision'));
 assert.throws(()=>assertPublicCrisisFaithful(mutate(svg,root=>{[root.svg[1],root.svg[2]]=[root.svg[2],root.svg[1]];}),'fr','decision'));
 for(const{svg,lang,kind}of variants)assertPublicCrisisQuantitative(svg,lang,kind);
 assert.throws(()=>assertPublicCrisisQuantitative(publicCrisisSvg('fr','guarantee').replace('width="723.2"','width="700"'),'fr','guarantee'));
 assert.throws(()=>assertPublicCrisisQuantitative(publicCrisisSvg('en','financing').replace('width="198"','width="190"'),'en','financing'));
});

test('render adaptation has only responsive root style, eight monitoring baseline moves and two accounting-scope labels',()=>{
 let moves=0,accountingLabels=0;
 for(const{lang,kind,svg}of variants){const inline=publicCrisisInlineSvg(lang,kind);assertPublicCrisisFaithful(inline,lang,kind,true);assert.equal(recoverPublicCrisisOriginal(inline,kind,lang),svg);
  if(kind==='monitoring')for(const[from,to]of [[559,554],[594,589],[816,811],[851,846]]){assert.equal(svg.split(`<text x="786" y="${from}"`).length,2);assert.equal(inline.split(`<text x="786" y="${to}"`).length,2);moves++;}
 }
 assert.equal(moves,8);
 for(const lang of ['fr','en']){const original=publicCrisisSvg(lang,'financing'),adapted=publicCrisisInlineSvg(lang,'financing'),oldLabel=lang==='fr'?'Dernier constat vérifié : 30 juin 2026.':'Last verified observation: 30 June 2026.',newLabel=lang==='fr'?'Dernier constat comptable : 30 juin 2026.':'Latest accounts checked: 30 June 2026.';assert.equal(original.split(oldLabel).length,2);assert.equal(adapted.split(newLabel).length,2);assert.equal(recoverPublicCrisisOriginal(adapted,'financing',lang),original);assert.throws(()=>assertPublicCrisisFaithful(adapted.replace(newLabel,oldLabel),lang,'financing',true));accountingLabels++;}
 assert.equal(accountingLabels,2);
 const changed=publicCrisisInlineSvg('fr','monitoring');
 for(const[to,bad]of [[554,553],[589,590],[811,812],[846,847]])assert.throws(()=>assertPublicCrisisFaithful(changed.replace(`<text x="786" y="${to}"`,`<text x="786" y="${bad}"`),'fr','monitoring',true));
});

test('public-crisis presentation follows semantic themes and preserves supplied font stacks with readable HTML notes',()=>{
 const component=read('src/components/PublicCrisisFigure.astro'),style=component.match(/<style>([\s\S]*?)<\/style>/u)[1],css=postcss.parse(style),rules=new Map();css.walkRules(r=>{if(r.parent.type==='root')rules.set(r.selector,Object.fromEntries(r.nodes.filter(n=>n.type==='decl').map(d=>[d.prop,d.value])));});
 const mapping={'#0c0d10':'ink','#13161c':'surface','#1a1e26':'surface-2','#28303b':'line-strong','#3b4351':'line-strong','#69778d':'muted','#a9b3c2':'muted','#e7e9ee':'paper','#5eead4':'signal','#ff4d87':'accent','#f5b13d':'amber','#7aa2f7':'topic-blue'};
 for(const[color,token]of Object.entries(mapping))for(const attr of ['fill','stroke'])assert.deepEqual(rules.get(`.public-crisis-figure :global([${attr}="${color}"])`),{[attr]:`var(--color-${token})`});
 const figure=rules.get('.public-crisis-figure'),graphic=rules.get('.public-crisis-figure :global(svg)');assert.deepEqual([figure.width,figure['max-width'],figure['padding-bottom'],figure.overflow],['100%','600px','.85rem','visible']);assert.deepEqual([graphic.width,graphic.height,graphic['max-width'],graphic['letter-spacing'],graphic.overflow],['100%','auto','100%','normal','visible']);
 css.walkDecls(d=>assert.doesNotMatch(d.value,/#(?:[a-f0-9]{3}){1,2}\b|url\(/iu));assert.doesNotMatch(style,/@font-face|font-family|clip-path|max-height|overflow\s*:\s*(?:hidden|clip)|transform\s*:|100vw/iu);
 assert.deepEqual(rules.get('.public-crisis-figure :global([stop-color="#5eead4"])'),{'stop-color':'var(--color-signal)'});
 assert.deepEqual(rules.get('.public-crisis-figure :global([stop-color="#ff4d87"])'),{'stop-color':'var(--color-accent)'});
 assert.deepEqual(rules.get(':global(html[data-theme="dark"]) .public-crisis-figure :global(pattern[id$="-03-hatch-teal"] path[opacity="0.36"])'),{opacity:'.35'});
 assert.deepEqual(rules.get(':global(html[data-theme="dark"]) .public-crisis-figure :global(pattern[id$="-hatch-quiet"] path[opacity="0.36"])'),{opacity:'.12'});
 assert.deepEqual(rules.get(':global(html[data-theme="light"]) .public-crisis-figure :global(pattern path[opacity="0.36"])'),{opacity:'.18'});
 assert.match(component,/publicCrisisReferences\(kind, sources\)/u);assert.match(component,/publicCrisisInlineSvg\(lang, kind\)/u);assert.equal((component.match(/set:html=/gu)??[]).length,1);
 for(const family of ['inter','jetbrains-mono'])assert.ok(component.includes(`href="/fonts/jlr/LICENSE-${family}.txt"`));
});

test('both supplied font bytes and complete licences match the existing site assets',()=>{
 for(const[family,fontHash,licenceHash]of [['inter','3100e775e8616cd2611beecfa23a4263d7037586789b43f035236a2e6fbd4c62','3b0a5fca3d17942cde889069889dedbbbd075e9b599968c82a95f4d944e9b345'],['jetbrains-mono','18be452724bfdc236c074ca94a249a7f41a86752c7d04ab258ce9ed5651f6a7e','403581b69dac5cff4079205e01c6b467e56af449ecbd7247693ddb1baafa005b']]){
  assert.equal(digest(readFileSync(new URL(`../node_modules/@fontsource-variable/${family}/files/${family}-latin-wght-normal.woff2`,import.meta.url))),fontHash);const licence=read(`public/fonts/jlr/LICENSE-${family}.txt`);assert.equal(digest(licence),licenceHash);assertFontLicenseReferences(licence,family);
 }
});

test('native bilingual public-crisis MDX includes ordered figures, exact source URLs and detailed methods',()=>{for(const lang of ['fr','en'])articleContract(read(articlePath(lang)),lang);});

test('public-crisis MDX contract rejects incomplete, reordered, dynamic and forged declarations',()=>{
 const raw=read(articlePath('fr'));for(const mutation of [raw.replace('sources="01 02 18 19"','sources="01"'),raw.replace('number="01"','number="02"'),raw.replace('lang="fr" kind="decision"','lang={"fr"} kind="decision"'),raw.replace(PUBLIC_CRISIS_BIBLIOGRAPHY_SOURCES.decision[0],`https://evil.example/?next=${PUBLIC_CRISIS_BIBLIOGRAPHY_SOURCES.decision[0]}`),raw.replace('<details><summary>Méthode et périmètre</summary>','<div><summary>Méthode et périmètre</summary>')])assert.throws(()=>articleContract(mutation,'fr'));
});


test('bounded public-crisis path grammar consumes absolute cubic, quadratic, horizontal and vertical segments',()=>{
 assert.deepEqual(publicCrisisPathPoints('M1 2 H3 V4 Q5 6 7 8 C9 10 11 12 13 14 Z'),[[1,2],[3,2],[3,4],[5,6],[7,8],[9,10],[11,12],[13,14],[1,2]]);
 for(const value of ['',null,12,'M1 2 H','M1 2 C3 4 5 6','M1 2 HInfinity','M1 2 V10001','M1 2 L3 4 trailing','M1 2 S3 4 5 6','M1 2 L3,4','M1 2 3 4','M1 2 C'+ '1 2 '.repeat(1025)])assert.throws(()=>publicCrisisPathPoints(value));
 for(const id of ['hatch-teal','hatch-quiet']){const svg=publicCrisisSvg('fr','financing');for(const reference of ['url(https://evil.example/x)','url(#missing)','url(javascript:alert(1))'])assert.throws(()=>inspectPublicCrisisSvg(svg.replace(`url(#jlr7-fr-03-${id})`,reference),'fr','financing'));}
});





test('all 106 internal panels retain 238 label associations after the eight approved baseline moves',()=>{
 assert.equal(variants.reduce((sum,v)=>sum+assertPublicCrisisPanelGeometry(publicCrisisInlineSvg(v.lang,v.kind),v.lang,v.kind,true),0),238);
 const svg=publicCrisisInlineSvg('fr','monitoring');
 const move=(axis,value)=>mutate(svg,(_,ns)=>{const n=ns.find(n=>jlrTag(n)==='text'&&jlrText(n)==='UKEF');jlrAttrs(n)[axis]=value;if(axis==='x')for(const span of jlrChildren(n))jlrAttrs(span).x=value;});
 for(const[axis,value]of [['x','500'],['y','460']]){const changed=move(axis,value);assert.throws(()=>assertPublicCrisisPanelGeometry(changed,'fr','monitoring',true),/internal panel/u);}
 for(const change of [
  (_,ns)=>{jlrAttrs(ns.find(n=>jlrTag(n)==='rect'&&jlrAttrs(n).x==='48'&&jlrAttrs(n).y==='300')).width='100';},
  (_,ns)=>{jlrAttrs(ns.find(n=>jlrTag(n)==='text'&&jlrText(n)==='UKEF'))['font-size']='30';},
  (_,ns)=>{jlrAttrs(jlrChildren(ns.find(n=>jlrTag(n)==='text'&&jlrText(n)==='UKEF'))[0]).dy='1';},
 ])assert.throws(()=>assertPublicCrisisPanelGeometry(mutate(svg,change),'fr','monitoring',true));
});
