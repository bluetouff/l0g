import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { XMLBuilder } from 'fast-xml-parser';
import { createProcessor } from '@mdx-js/mdx';
import postcss from 'postcss';
import { jlrGdpSvg, jlrGdpInlineSvg, jlrGdpReferences, JLR_GDP_KINDS, JLR_GDP_REQUIRED_SOURCES } from '../src/lib/jlrGdpFigures.mjs';
import { assertFontLicenseReferences } from './font-license-assertions.mjs';
import { assertGdpFaithful, assertGdpGeometry, assertGdpQuantitative, inspectGdpSvg, gdpKinds, GDP_EXPECTED_SOURCES, GDP_BIBLIOGRAPHY_SOURCES, gdpPathPoints } from './jlr-gdp-svg-assertions.mjs';
import { jlrParser, jlrTag, jlrAttrs, jlrChildren, jlrNodes, jlrText } from './jlr-svg-assertions.mjs';
const read=file=>readFileSync(new URL(`../${file}`,import.meta.url),'utf8');
const digest=value=>createHash('sha256').update(value).digest('hex');
const variants=gdpKinds.flatMap(kind=>['fr','en'].map(lang=>({kind,lang,svg:jlrGdpSvg(lang,kind)})));
const mutate=(svg,change)=>{const root=jlrParser.parse(svg)[0];change(root,jlrNodes(root));return new XMLBuilder({preserveOrder:true,ignoreAttributes:false,attributeNamePrefix:'',format:false}).build([root]);};
const attributes=n=>Object.fromEntries((n.attributes??[]).map(a=>{assert.equal(a.type,'mdxJsxAttribute');assert.equal(typeof a.value,'string');return[a.name,a.value];}));
const mdxNodes=n=>[n,...(n.children??[]).flatMap(mdxNodes)];
const mdxText=n=>n.value??(n.children??[]).map(mdxText).join(' ');
const sourceIds={production:['04','05'],recovery:['03','07'],'value-added':['09','17'],hours:['12','13','14']};
const articlePath=lang=>`src/content/${lang==='fr'?'posts/apres-cyberattaque-04-jlr-empreinte-pib':'posts-en/after-cyberattack-04-jlr-gdp-footprint'}.mdx`;
function articleContract(raw,lang){
 const tree=createProcessor().parse(raw.replace(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/u,'')),nodes=mdxNodes(tree),figures=nodes.filter(n=>n.name==='JlrGdpFigure');assert.equal(figures.length,4);
 for(const[i,figure]of figures.entries()){
  const a=attributes(figure);assert.deepEqual(Object.keys(a).sort(),['caption','kind','lang','number','sources']);assert.equal(a.lang,lang);assert.equal(a.kind,gdpKinds[i]);assert.equal(a.number,String(i+1).padStart(2,'0'));assert.ok(a.caption.length>40);jlrGdpReferences(a.kind,a.sources);
  const details=mdxNodes(figure).filter(n=>n.name==='details');assert.equal(details.length,1);assert.ok(mdxNodes(details[0]).some(n=>n.name==='summary'));assert.ok(mdxText(details[0]).length>100);
 }
 for(const kind of gdpKinds)for(const[i,url]of GDP_BIBLIOGRAPHY_SOURCES[kind].entries()){
  const id=`source-${sourceIds[kind][i]}`,items=nodes.filter(n=>n.name==='li'&&attributes(n).id===id);assert.equal(items.length,1,`Unique bibliography ${id}`);
  const urls=mdxNodes(items[0]).filter(n=>n.name==='a').map(n=>attributes(n).href);assert.equal(urls.filter(value=>value===url).length,1,`Complete canonical URL for ${id}`);
 }
 return figures;
}

test('JLR GDP variants and references reject coercion, missing citations and prototype keys',()=>{
 assert.deepEqual(JLR_GDP_KINDS,gdpKinds);assert.ok(Object.isFrozen(JLR_GDP_KINDS));assert.ok(Object.isFrozen(JLR_GDP_REQUIRED_SOURCES));assert.equal(variants.length,8);
 for(const value of ['__proto__','constructor','toString','unknown',null,{},[],12,new String('production')])assert.throws(()=>jlrGdpSvg('fr',value));
 for(const value of ['__proto__','constructor','xx',null,{},[],12,new String('fr')])assert.throws(()=>jlrGdpSvg(value,'production'));
 for(const kind of gdpKinds){const required=JLR_GDP_REQUIRED_SOURCES[kind];assert.ok(Object.isFrozen(required));assert.deepEqual(jlrGdpReferences(kind,required.join(' ')),required);for(const id of required)assert.throws(()=>jlrGdpReferences(kind,required.filter(x=>x!==id).join(' ')));for(const suffix of [' 99',' __proto__',` ${required[0]}`])assert.throws(()=>jlrGdpReferences(kind,required.join(' ')+suffix));}
 for(const sources of [null,{},12,'','1 8'])assert.throws(()=>jlrGdpReferences('production',sources));
});

test('all 8 supplied GDP SVGs retain their complete bytes, geometry, fonts, text and source metadata',()=>{
 for(const{svg,lang,kind}of variants){assertGdpFaithful(svg,lang,kind);const{nodes}=inspectGdpSvg(svg,lang,kind);for(const n of nodes.filter(n=>jlrTag(n)==='title'||jlrTag(n)==='text'&&jlrAttrs(n)['font-weight']==='700'))assert.doesNotMatch(jlrText(n),/—|\b(?:ce que|ce qui|what\b|clocks?|horloges?)|, (?:pas|not) /iu);}
});

test('all native shapes, cubic/quadratic paths and line/path marker extents stay inside the viewBoxes',()=>{
 assert.equal(variants.reduce((sum,v)=>sum+assertGdpGeometry(v.svg,v.lang,v.kind),0),350);
 const svg=jlrGdpSvg('fr','production');
 assert.throws(()=>assertGdpGeometry(mutate(svg,(_,ns)=>{jlrAttrs(ns.find(n=>jlrTag(n)==='rect')).x='9999';}),'fr','production'));
 assert.throws(()=>assertGdpGeometry(mutate(svg,(_,ns)=>{jlrAttrs(ns.find(n=>jlrTag(n)==='path'&&jlrAttrs(n)['marker-end'])).d='M990 990 L1000 990';}),'fr','production'));
});

test('passive GDP XML rejects active markup, unsafe attributes, altered metadata and source forgery',()=>{
 const svg=jlrGdpSvg('fr','production');
 for(const tag of ['script','foreignObject','image','animate','style','iframe','use'])assert.throws(()=>inspectGdpSvg(svg.replace('</svg>',`<${tag}/></svg>`),'fr','production'));
 for(const[key,value]of [['onload','alert(1)'],['href','javascript:alert(1)'],['xlink:href','data:text/html,x'],['style','fill:red'],['fill','url(https://evil.example/x)'],['font-family','Arial'],['x','Infinity'],['transform','translate(1 2)']])assert.throws(()=>inspectGdpSvg(mutate(svg,(_,ns)=>{jlrAttrs(ns.find(n=>jlrTag(n)==='text'))[key]=value;}),'fr','production'));
 for(const text of ['<!DOCTYPE svg>','<?xml-stylesheet href="https://evil.example/"?>'])assert.throws(()=>inspectGdpSvg(text+svg,'fr','production'));
 for(const kind of gdpKinds){const original=jlrGdpSvg('fr',kind);for(const url of GDP_EXPECTED_SOURCES[kind])for(const forged of [url+'#forged',url+'?tracking=1',url.replace('https:','http:'),`https://evil.example/?next=${url}`])assert.throws(()=>inspectGdpSvg(mutate(original,(_,ns)=>{const metadata=ns.filter(n=>jlrTag(n)==='metadata');assert.equal(metadata.length,1);const children=jlrChildren(metadata[0]);assert.equal(children.length,1);assert.equal(jlrTag(children[0]),'#text');const lines=children[0]['#text'].split('\n'),matching=lines.flatMap((line,index)=>line.split(';').at(-1).trim()===url?[index]:[]);assert.equal(matching.length,1);const parts=lines[matching[0]].split(';');parts[parts.length-1]=` ${forged}`;lines[matching[0]]=parts.join(';');children[0]['#text']=lines.join('\n');}),'fr',kind));}
});

test('original goldens reject unintended paint, typography, text, ordering and proportional changes',()=>{
 const svg=jlrGdpSvg('fr','production');for(const[key,value]of [['x','111'],['font-size','23'],['fill','#ff4d87'],['font-weight','600']])assert.throws(()=>assertGdpFaithful(mutate(svg,(_,ns)=>{jlrAttrs(ns.find(n=>jlrTag(n)==='text'))[key]=value;}),'fr','production'));
 assert.throws(()=>assertGdpFaithful(svg.replace('La production remonte, le creux reste visible','Autre titre contrôlé'),'fr','production'));
 assert.throws(()=>assertGdpFaithful(mutate(svg,root=>{[root.svg[1],root.svg[2]]=[root.svg[2],root.svg[1]];}),'fr','production'));
 for(const{svg,lang,kind}of variants)assertGdpQuantitative(svg,lang,kind);
 assert.throws(()=>assertGdpQuantitative(jlrGdpSvg('fr','production').replace('cy="458.041"','cy="450"'),'fr','production'));
 assert.throws(()=>assertGdpQuantitative(jlrGdpSvg('en','recovery').replace('cx="739.143"','cx="700"'),'en','recovery'));
});

test('render adaptation adds only responsive root style and preserves all source metadata',()=>{
 for(const{lang,kind,svg}of variants){const inline=jlrGdpInlineSvg(lang,kind);assertGdpFaithful(inline,lang,kind,true);assert.equal(inline.replace('<svg style="width:100%;height:auto" ','<svg '),svg);}
});

test('GDP presentation follows semantic themes and preserves supplied font stacks with readable HTML notes',()=>{
 const component=read('src/components/JlrGdpFigure.astro'),style=component.match(/<style>([\s\S]*?)<\/style>/u)[1],css=postcss.parse(style),rules=new Map();css.walkRules(r=>{if(r.parent.type==='root')rules.set(r.selector,Object.fromEntries(r.nodes.filter(n=>n.type==='decl').map(d=>[d.prop,d.value])));});
 const mapping={'#0c0d10':'ink','#13161c':'surface','#1a1e26':'surface-2','#28303b':'line-strong','#3b4351':'line-strong','#69778d':'muted','#a9b3c2':'muted','#e7e9ee':'paper','#5eead4':'signal','#ff4d87':'accent','#f5b13d':'amber','#7aa2f7':'topic-blue'};
 for(const[color,token]of Object.entries(mapping))for(const attr of ['fill','stroke'])assert.deepEqual(rules.get(`.jlr-gdp-figure :global([${attr}="${color}"])`),{[attr]:`var(--color-${token})`});
 const figure=rules.get('.jlr-gdp-figure'),graphic=rules.get('.jlr-gdp-figure :global(svg)');assert.deepEqual([figure.width,figure['max-width'],figure['padding-bottom'],figure.overflow],['100%','600px','.85rem','visible']);assert.deepEqual([graphic.width,graphic.height,graphic['max-width'],graphic['letter-spacing'],graphic.overflow],['100%','auto','100%','normal','visible']);
 css.walkDecls(d=>assert.doesNotMatch(d.value,/#(?:[a-f0-9]{3}){1,2}\b|url\(/iu));assert.doesNotMatch(style,/@font-face|font-family|clip-path|max-height|overflow\s*:\s*(?:hidden|clip)|transform\s*:|100vw/iu);
 assert.deepEqual(rules.get('.jlr-gdp-figure :global([stop-color="#5eead4"])'),{'stop-color':'var(--color-signal)'});
 assert.deepEqual(rules.get('.jlr-gdp-figure :global([stop-color="#ff4d87"])'),{'stop-color':'var(--color-accent)'});
 assert.deepEqual(rules.get(':global(html[data-theme="light"]) .jlr-gdp-figure :global(pattern path[opacity="0.36"])'),{opacity:'.18'});
 assert.match(component,/jlrGdpReferences\(kind, sources\)/u);assert.match(component,/jlrGdpInlineSvg\(lang, kind\)/u);assert.equal((component.match(/set:html=/gu)??[]).length,1);
 for(const family of ['inter','jetbrains-mono'])assert.ok(component.includes(`href="/fonts/jlr/LICENSE-${family}.txt"`));
});

test('both supplied font bytes and complete licences match the existing site assets',()=>{
 for(const[family,fontHash,licenceHash]of [['inter','3100e775e8616cd2611beecfa23a4263d7037586789b43f035236a2e6fbd4c62','3b0a5fca3d17942cde889069889dedbbbd075e9b599968c82a95f4d944e9b345'],['jetbrains-mono','18be452724bfdc236c074ca94a249a7f41a86752c7d04ab258ce9ed5651f6a7e','403581b69dac5cff4079205e01c6b467e56af449ecbd7247693ddb1baafa005b']]){
  assert.equal(digest(readFileSync(new URL(`../node_modules/@fontsource-variable/${family}/files/${family}-latin-wght-normal.woff2`,import.meta.url))),fontHash);const licence=read(`public/fonts/jlr/LICENSE-${family}.txt`);assert.equal(digest(licence),licenceHash);assertFontLicenseReferences(licence,family);
 }
});

test('native bilingual GDP MDX includes ordered figures, exact source URLs and detailed methods',()=>{for(const lang of ['fr','en'])articleContract(read(articlePath(lang)),lang);});

test('GDP MDX contract rejects incomplete, reordered, dynamic and forged declarations',()=>{
 const raw=read(articlePath('fr'));for(const mutation of [raw.replace('sources="04 05"','sources="01"'),raw.replace('number="01"','number="02"'),raw.replace('lang="fr" kind="production"','lang={"fr"} kind="production"'),raw.replace(GDP_BIBLIOGRAPHY_SOURCES.production[0],`https://evil.example/?next=${GDP_BIBLIOGRAPHY_SOURCES.production[0]}`),raw.replace('<details><summary>Méthode et périmètre</summary>','<div><summary>Méthode et périmètre</summary>')])assert.throws(()=>articleContract(mutation,'fr'));
});


test('bounded GDP path grammar consumes absolute cubic, quadratic, horizontal and vertical segments',()=>{
 assert.deepEqual(gdpPathPoints('M1 2 H3 V4 Q5 6 7 8 C9 10 11 12 13 14 Z'),[[1,2],[3,2],[3,4],[5,6],[7,8],[9,10],[11,12],[13,14],[1,2]]);
 for(const value of ['',null,12,'M1 2 H','M1 2 C3 4 5 6','M1 2 HInfinity','M1 2 V10001','M1 2 L3 4 trailing','M1 2 S3 4 5 6','M1 2 L3,4','M1 2 3 4','M1 2 C'+ '1 2 '.repeat(1025)])assert.throws(()=>gdpPathPoints(value));
 for(const id of ['hatch-pink','pinkfade']){const svg=jlrGdpSvg('fr','production');for(const reference of ['url(https://evil.example/x)','url(#missing)','url(javascript:alert(1))'])assert.throws(()=>inspectGdpSvg(svg.replace(`url(#jlr4-fr-01-${id})`,reference),'fr','production'));}
});
