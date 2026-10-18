import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync } from 'node:fs';
import test from 'node:test';
import { XMLBuilder } from 'fast-xml-parser';
import { createProcessor } from '@mdx-js/mdx';
import postcss from 'postcss';
import { jlrSvg, jlrInlineSvg, jlrReferences, jlrSourceAnchor, JLR_KINDS, JLR_REQUIRED_SOURCES } from '../src/lib/jlrFigures.mjs';
import { assertFontLicenseReferences } from './font-license-assertions.mjs';
import { assertJlrFaithful, assertJlrGeometry, assertJlrQuantitative, inspectJlrSvg, jlrParser, jlrTag, jlrAttrs, jlrNodes, jlrText, jlrNumber, jlrPathPoints, jlrKinds, JLR_EXPECTED_SOURCES, JLR_VISIBLE_SOURCES } from './jlr-svg-assertions.mjs';
const read=file=>readFileSync(new URL(`../${file}`,import.meta.url),'utf8');
const digest=value=>createHash('sha256').update(value).digest('hex');
const variants=jlrKinds.flatMap(kind=>['fr','en'].map(lang=>({kind,lang,svg:jlrSvg(lang,kind)})));
const mutate=(svg,change)=>{const root=jlrParser.parse(svg)[0];change(root,jlrNodes(root));return new XMLBuilder({preserveOrder:true,ignoreAttributes:false,attributeNamePrefix:'',format:false}).build([root]);};
const attributes=n=>Object.fromEntries((n.attributes??[]).map(a=>{assert.equal(a.type,'mdxJsxAttribute');assert.equal(typeof a.value,'string');return[a.name,a.value];}));
const mdxNodes=n=>[n,...(n.children??[]).flatMap(mdxNodes)];
const mdxText=n=>n.value??(n.children??[]).map(mdxText).join(' ');
const sourceIds={circuit:['06','01','04','05'],recovery:['02','01','04','05','09','14'],quarters:['11','12','13','14','06'],inventory:['12','13']};
const articlePath=lang=>`src/content/${lang==='fr'?'posts/apres-cyberattaque-1-jlr-usines-tresorerie':'posts-en/after-cyberattack-1-jlr-factories-cash-flow'}.mdx`;
function articleContract(raw,lang){
 const tree=createProcessor().parse(raw.replace(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/u,'')),nodes=mdxNodes(tree),figures=nodes.filter(n=>n.name==='JlrFigure');assert.equal(figures.length,4);
 for(const[i,figure]of figures.entries()){
  const a=attributes(figure);assert.deepEqual(Object.keys(a).sort(),['caption','kind','lang','number','sources']);assert.equal(a.lang,lang);assert.equal(a.kind,jlrKinds[i]);assert.equal(a.number,String(i+1).padStart(2,'0'));assert.ok(a.caption.length>40);jlrReferences(a.kind,a.sources);
  const details=mdxNodes(figure).filter(n=>n.name==='details');assert.equal(details.length,1);assert.ok(mdxNodes(details[0]).some(n=>n.name==='summary'));assert.ok(mdxText(details[0]).length>100);
 }
 for(const kind of jlrKinds)for(const[i,url]of JLR_EXPECTED_SOURCES[kind].entries()){
  const id=`source-${sourceIds[kind][i]}`,items=nodes.filter(n=>n.name==='li'&&attributes(n).id===id);assert.equal(items.length,1,`Unique bibliography ${id}`);
  const urls=mdxNodes(items[0]).filter(n=>n.name==='a').map(n=>attributes(n).href);assert.deepEqual(urls,[url],`Complete canonical URL for ${id}`);
 }
 return figures;
}

test('JLR variants and source references are complete, frozen and reject coercion or prototype keys',()=>{
 assert.deepEqual(JLR_KINDS,jlrKinds);assert.ok(Object.isFrozen(JLR_KINDS));assert.ok(Object.isFrozen(JLR_REQUIRED_SOURCES));assert.equal(variants.length,8);
 for(const value of ['__proto__','constructor','toString','unknown',null,{},[],12,new String('circuit')])assert.throws(()=>jlrSvg('fr',value));
 for(const value of ['__proto__','constructor','xx',null,{},[],12,new String('fr')])assert.throws(()=>jlrSvg(value,'circuit'));
 for(const kind of jlrKinds){const required=JLR_REQUIRED_SOURCES[kind];assert.ok(Object.isFrozen(required));assert.deepEqual(jlrReferences(kind,required.join(' ')),required);for(const id of required)assert.throws(()=>jlrReferences(kind,required.filter(x=>x!==id).join(' ')));for(const suffix of [' 99',' __proto__',` ${required[0]}`])assert.throws(()=>jlrReferences(kind,required.join(' ')+suffix));}
 assert.deepEqual(jlrReferences('recovery','01 02 04 05 09 10 14'),['01','02','04','05','09','10','14']);
 for(const sources of [null,{},12,'','1 4 5 6'])assert.throws(()=>jlrReferences('circuit',sources));
});

test('all8 supplied SVGs retain their complete bytes, geometry, fonts and source metadata after the approved title correction',()=>{
 for(const{svg,lang,kind}of variants){assertJlrFaithful(svg,lang,kind);const{nodes}=inspectJlrSvg(svg,lang,kind);for(const n of nodes.filter(n=>jlrTag(n)==='title'||jlrTag(n)==='text'&&jlrAttrs(n)['font-weight']==='700'))assert.doesNotMatch(jlrText(n),/—|\b(?:ce que|ce qui|what\b|clocks?|horloges?)|, (?:pas|not) /iu);}
});

test('native shapes, quadratic control envelopes, transformed icons, marker extents and multiline anchors remain inside every viewBox',()=>{
 assert.equal(variants.reduce((sum,v)=>sum+assertJlrGeometry(v.svg,v.lang,v.kind),0),350);
 const svg=jlrSvg('fr','circuit');assert.throws(()=>assertJlrGeometry(svg.replace('translate(63 271)','translate(9999 9999)'),'fr','circuit'));
 assert.throws(()=>assertJlrGeometry(svg.replace('<tspan x="110" dy="0">','<tspan x="9999" dy="0">'),'fr','circuit'));
});

test('passive XML validation rejects executable elements, unsafe resources, added attributes and source forgery',()=>{
 const svg=jlrSvg('fr','circuit');
 for(const tag of ['script','foreignObject','image','animate','style','iframe','use'])assert.throws(()=>inspectJlrSvg(svg.replace('</svg>',`<${tag}/></svg>`),'fr','circuit'));
 for(const[key,value]of [['onload','alert(1)'],['href','javascript:alert(1)'],['xlink:href','data:text/html,x'],['style','fill:red'],['fill','url(https://evil.example/x)'],['font-family','Arial'],['x','Infinity'],['transform','translate(1 2)']])assert.throws(()=>inspectJlrSvg(mutate(svg,(_,ns)=>{jlrAttrs(ns.find(n=>jlrTag(n)==='text'))[key]=value;}),'fr','circuit'));
 for(const text of ['<!DOCTYPE svg>','<?xml-stylesheet href="https://evil.example/"?>'])assert.throws(()=>inspectJlrSvg(text+svg,'fr','circuit'));
 for(const{url}of Object.values(JLR_VISIBLE_SOURCES)){assert.equal(typeof jlrSourceAnchor(url),'string');const parsed=new URL(url);for(const forged of [`https://${parsed.hostname}.evil.example${parsed.pathname}`,`https://${parsed.hostname}@evil.example${parsed.pathname}`,`https://evil.example@${parsed.hostname}${parsed.pathname}`,`https://evil.example/?next=${url}`,`https://evil.example/#${url}`,`https://evil.example/${url}`,url+'#x',url+'&x=1',url+'\u0000',url.replace('https:','http:')])assert.throws(()=>jlrSourceAnchor(forged));}
 for(const value of ['__proto__','#source-06','https://example.org/',{},null])assert.throws(()=>jlrSourceAnchor(value));
 const url=JLR_EXPECTED_SOURCES.circuit[1];assert.throws(()=>inspectJlrSvg(svg.replace(url,`https://evil.example/?next=${url}`),'fr','circuit'));
});

test('complete original goldens reject allowed but unintended geometry, text, font, paint and ordering changes',()=>{
 const svg=jlrSvg('fr','circuit');for(const[key,value]of [['x','111'],['font-size','23'],['fill','#ff4d87'],['font-weight','600']])assert.throws(()=>assertJlrFaithful(mutate(svg,(_,ns)=>{jlrAttrs(ns.find(n=>jlrTag(n)==='text'))[key]=value;}),'fr','circuit'));
 assert.throws(()=>assertJlrFaithful(svg.replace('Deux circuits autour d’un véhicule','Autre titre contrôlé'),'fr','circuit'));
 assert.throws(()=>assertJlrFaithful(mutate(svg,root=>{[root.svg[1],root.svg[2]]=[root.svg[2],root.svg[1]];}),'fr','circuit'));
});

test('render adaptation changes only the root responsive style and four exact local bibliography hrefs',()=>{
 for(const{lang,kind,svg}of variants){const inline=jlrInlineSvg(lang,kind);assertJlrFaithful(inline,lang,kind,true);assert.equal(inline.replace('<svg style="width:100%;height:auto" ','<svg ').replace(` href="${JLR_VISIBLE_SOURCES[kind].anchor}"`,` href="${JLR_VISIBLE_SOURCES[kind].url}"`),svg);}
});

test('whole path input is consumed deterministically with valid subpaths and bounded malformed-input handling',()=>{
 assert.deepEqual(jlrPathPoints('M0 0 L10 10 Q20 20 30 0 Z M5 5 L6 6'),[[0,0],[10,10],[20,20],[30,0],[0,0],[5,5],[6,6]]);
 const bad=['','M0 0 L1','M0 0 trailing','L1 1','M0 0 Z 1 2','M0 0 Q1 2 3','M0 0 L1e99 0','M0 0 L'+'.'.repeat(7000),'M0 0 L'+'1.'.repeat(3000),'M0 0 L'+'9'.repeat(6000)+' 0'];
 for(const raw of [...bad,null,{},[],new String('M0 0')])assert.throws(()=>jlrPathPoints(raw));
 const code=`import assert from 'node:assert/strict';const jlrNumber=${jlrNumber.toString()};const paths=${jlrPathPoints.toString()};for(let i=0;i<20;i++)for(const raw of ${JSON.stringify(bad)})assert.throws(()=>paths(raw));assert.deepEqual(paths('M0 0 L1 2'),[[0,0],[1,2]]);`;
 execFileSync(process.execPath,['--input-type=module','-e',code],{timeout:5000,maxBuffer:1024*1024});
});

test('quarterly zero bases, all12 bar proportions, inventory signs and calendar distances match verified inputs',()=>{
 for(const{svg,lang,kind}of variants)assertJlrQuantitative(svg,lang,kind);
 assert.throws(()=>assertJlrQuantitative(jlrSvg('fr','quarters').replace('height="185.919"','height="180"'),'fr','quarters'));
 assert.throws(()=>assertJlrQuantitative(jlrSvg('en','inventory').replace('width="209.22"','width="250"'),'en','inventory'));
 assert.throws(()=>assertJlrQuantitative(jlrSvg('fr','recovery').replace('x1="330.771"','x1="340.771"'),'fr','recovery'));
});

test('responsive component preserves supplied typography, all semantic theme mappings and readable HTML notes',()=>{
 const component=read('src/components/JlrFigure.astro'),style=component.match(/<style>([\s\S]*?)<\/style>/u)[1],css=postcss.parse(style),rules=new Map();css.walkRules(r=>{if(r.parent.type==='root')rules.set(r.selector,Object.fromEntries(r.nodes.filter(n=>n.type==='decl').map(d=>[d.prop,d.value])));});
 const mapping={'#0c0d10':'ink','#121419':'surface','#171a20':'surface-2','#272d37':'line-strong','#343b48':'line-strong','#657084':'muted','#a5adbb':'muted','#e7e9ee':'paper','#5eead4':'signal','#ff4d87':'accent','#f5b13d':'amber','#7aa2f7':'topic-blue'};
 for(const[color,token]of Object.entries(mapping))for(const attr of ['fill','stroke'])assert.deepEqual(rules.get(`.jlr-figure :global([${attr}="${color}"])`),{[attr]:`var(--color-${token})`});
 const figure=rules.get('.jlr-figure'),graphic=rules.get('.jlr-figure :global(svg)');assert.deepEqual([figure.width,figure['max-width'],figure['padding-bottom'],figure.overflow],['100%','600px','.85rem','visible']);assert.deepEqual([graphic.width,graphic.height,graphic['max-width'],graphic['letter-spacing'],graphic.overflow],['100%','auto','100%','normal','visible']);
 css.walkDecls(d=>assert.doesNotMatch(d.value,/#(?:[a-f0-9]{3}){1,2}\b|url\(/iu));assert.doesNotMatch(style,/@font-face|font-family|clip-path|max-height|overflow\s*:\s*(?:hidden|clip)|transform\s*:|100vw/iu);
 assert.ok(rules.get('figcaption')['font-size']);assert.match(component,/jlrReferences\(kind, sources\)/u);assert.match(component,/jlrInlineSvg\(lang, kind\)/u);assert.equal((component.match(/set:html=/gu)??[]).length,1);
 for(const family of ['inter','jetbrains-mono'])assert.ok(component.includes(`href="/fonts/jlr/LICENSE-${family}.txt"`));
});

test('existing Inter and JetBrains fonts and complete accessible licences match the supplied originals exactly',()=>{
 assert.deepEqual(readdirSync(new URL('../public/fonts/jlr/',import.meta.url)).sort(),['LICENSE-inter.txt','LICENSE-jetbrains-mono.txt']);
 for(const[family,fontHash,licenceHash]of [['inter','3100e775e8616cd2611beecfa23a4263d7037586789b43f035236a2e6fbd4c62','3b0a5fca3d17942cde889069889dedbbbd075e9b599968c82a95f4d944e9b345'],['jetbrains-mono','18be452724bfdc236c074ca94a249a7f41a86752c7d04ab258ce9ed5651f6a7e','403581b69dac5cff4079205e01c6b467e56af449ecbd7247693ddb1baafa005b']]){
  assert.equal(digest(readFileSync(new URL(`../node_modules/@fontsource-variable/${family}/files/${family}-latin-wght-normal.woff2`,import.meta.url))),fontHash);const licence=read(`public/fonts/jlr/LICENSE-${family}.txt`);assert.equal(digest(licence),licenceHash);assertFontLicenseReferences(licence,family);assert.equal(licence,read(`node_modules/@fontsource-variable/${family}/LICENSE`));
 }
});

test('native bilingual MDX includes four ordered figures, complete exact bibliography references and detailed methods',()=>{for(const lang of ['fr','en'])articleContract(read(articlePath(lang)),lang);});

test('MDX contract rejects incomplete, reordered, dynamic or forged figure and bibliography declarations',()=>{
 const raw=read(articlePath('fr'));for(const mutation of [raw.replace('sources="01 04 05 06"','sources="01 06"'),raw.replace('number="01"','number="02"'),raw.replace('lang="fr" kind="circuit"','lang={"fr"} kind="circuit"'),raw.replace(JLR_VISIBLE_SOURCES.circuit.url,`https://evil.example/?next=${JLR_VISIBLE_SOURCES.circuit.url}`),raw.replace('<details><summary>Méthode et périmètre</summary>','<div><summary>Méthode et périmètre</summary>')])assert.throws(()=>articleContract(mutation,'fr'));
});
