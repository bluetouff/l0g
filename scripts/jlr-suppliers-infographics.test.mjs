import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { XMLBuilder } from 'fast-xml-parser';
import { createProcessor } from '@mdx-js/mdx';
import postcss from 'postcss';
import { jlrSuppliersSvg, jlrSuppliersInlineSvg, jlrSuppliersReferences, jlrSuppliersSourceAnchor, JLR_SUPPLIERS_KINDS, JLR_SUPPLIERS_REQUIRED_SOURCES } from '../src/lib/jlrSuppliersFigures.mjs';
import { assertFontLicenseReferences } from './font-license-assertions.mjs';
import { assertSuppliersFaithful, assertSuppliersGeometry, assertSuppliersQuantitative, inspectSuppliersSvg, suppliersKinds, SUPPLIERS_EXPECTED_SOURCES, SUPPLIERS_VISIBLE_SOURCES } from './jlr-suppliers-svg-assertions.mjs';
import { jlrParser, jlrTag, jlrAttrs, jlrNodes, jlrText } from './jlr-svg-assertions.mjs';
const read=file=>readFileSync(new URL(`../${file}`,import.meta.url),'utf8');
const digest=value=>createHash('sha256').update(value).digest('hex');
const variants=suppliersKinds.flatMap(kind=>['fr','en'].map(lang=>({kind,lang,svg:jlrSuppliersSvg(lang,kind)})));
const mutate=(svg,change)=>{const root=jlrParser.parse(svg)[0];change(root,jlrNodes(root));return new XMLBuilder({preserveOrder:true,ignoreAttributes:false,attributeNamePrefix:'',format:false}).build([root]);};
const attributes=n=>Object.fromEntries((n.attributes??[]).map(a=>{assert.equal(a.type,'mdxJsxAttribute');assert.equal(typeof a.value,'string');return[a.name,a.value];}));
const mdxNodes=n=>[n,...(n.children??[]).flatMap(mdxNodes)];
const mdxText=n=>n.value??(n.children??[]).map(mdxText).join(' ');
const sourceIds={propagation:['08','01'],credit:['01'],orders:['08','09','10'],guarantee:['13','09','14','10']};
const articlePath=lang=>`src/content/${lang==='fr'?'posts/apres-cyberattaque-2-jlr-fournisseurs-credit':'posts-en/after-cyberattack-2-jlr-suppliers-credit'}.mdx`;
function articleContract(raw,lang){
 const tree=createProcessor().parse(raw.replace(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/u,'')),nodes=mdxNodes(tree),figures=nodes.filter(n=>n.name==='JlrSuppliersFigure');assert.equal(figures.length,4);
 for(const[i,figure]of figures.entries()){
  const a=attributes(figure);assert.deepEqual(Object.keys(a).sort(),['caption','kind','lang','number','sources']);assert.equal(a.lang,lang);assert.equal(a.kind,suppliersKinds[i]);assert.equal(a.number,String(i+1).padStart(2,'0'));assert.ok(a.caption.length>40);jlrSuppliersReferences(a.kind,a.sources);
  const details=mdxNodes(figure).filter(n=>n.name==='details');assert.equal(details.length,1);assert.ok(mdxNodes(details[0]).some(n=>n.name==='summary'));assert.ok(mdxText(details[0]).length>100);
 }
 for(const kind of suppliersKinds)for(const[i,url]of SUPPLIERS_EXPECTED_SOURCES[kind].entries()){
  const id=`source-${sourceIds[kind][i]}`,items=nodes.filter(n=>n.name==='li'&&attributes(n).id===id);assert.equal(items.length,1,`Unique bibliography ${id}`);
  const urls=mdxNodes(items[0]).filter(n=>n.name==='a').map(n=>attributes(n).href);assert.equal(urls.filter(value=>value===url).length,1,`Complete canonical URL for ${id}`);
 }
 return figures;
}

test('JLR suppliers variants and references reject coercion, missing citations and prototype keys',()=>{
 assert.deepEqual(JLR_SUPPLIERS_KINDS,suppliersKinds);assert.ok(Object.isFrozen(JLR_SUPPLIERS_KINDS));assert.ok(Object.isFrozen(JLR_SUPPLIERS_REQUIRED_SOURCES));assert.equal(variants.length,8);
 for(const value of ['__proto__','constructor','toString','unknown',null,{},[],12,new String('propagation')])assert.throws(()=>jlrSuppliersSvg('fr',value));
 for(const value of ['__proto__','constructor','xx',null,{},[],12,new String('fr')])assert.throws(()=>jlrSuppliersSvg(value,'propagation'));
 for(const kind of suppliersKinds){const required=JLR_SUPPLIERS_REQUIRED_SOURCES[kind];assert.ok(Object.isFrozen(required));assert.deepEqual(jlrSuppliersReferences(kind,required.join(' ')),required);for(const id of required)assert.throws(()=>jlrSuppliersReferences(kind,required.filter(x=>x!==id).join(' ')));for(const suffix of [' 99',' __proto__',` ${required[0]}`])assert.throws(()=>jlrSuppliersReferences(kind,required.join(' ')+suffix));}
 for(const sources of [null,{},12,'','1 8'])assert.throws(()=>jlrSuppliersReferences('propagation',sources));
});

test('all8 supplied supplier SVGs retain their complete bytes, geometry, fonts, text and source metadata',()=>{
 for(const{svg,lang,kind}of variants){assertSuppliersFaithful(svg,lang,kind);const{nodes}=inspectSuppliersSvg(svg,lang,kind);for(const n of nodes.filter(n=>jlrTag(n)==='title'||jlrTag(n)==='text'&&jlrAttrs(n)['font-weight']==='700'))assert.doesNotMatch(jlrText(n),/—|\b(?:ce que|ce qui|what\b|clocks?|horloges?)|, (?:pas|not) /iu);}
});

test('all554 native shapes, transformed icons and line/path marker extents stay inside the viewBoxes',()=>{
 assert.equal(variants.reduce((sum,v)=>sum+assertSuppliersGeometry(v.svg,v.lang,v.kind),0),554);
 const svg=jlrSuppliersSvg('fr','propagation');
 assert.throws(()=>assertSuppliersGeometry(mutate(svg,(_,ns)=>{jlrAttrs(ns.find(n=>jlrTag(n)==='g')).transform='translate(9999 9999) scale(1)';}),'fr','propagation'));
 assert.throws(()=>assertSuppliersGeometry(mutate(svg,(_,ns)=>{jlrAttrs(ns.find(n=>jlrTag(n)==='path'&&jlrAttrs(n)['marker-end'])).d='M990 990 L1000 990';}),'fr','propagation'));
});

test('passive supplier XML rejects active markup, unsafe attributes, altered metadata and source forgery',()=>{
 const svg=jlrSuppliersSvg('fr','propagation');
 for(const tag of ['script','foreignObject','image','animate','style','iframe','use'])assert.throws(()=>inspectSuppliersSvg(svg.replace('</svg>',`<${tag}/></svg>`),'fr','propagation'));
 for(const[key,value]of [['onload','alert(1)'],['href','javascript:alert(1)'],['xlink:href','data:text/html,x'],['style','fill:red'],['fill','url(https://evil.example/x)'],['font-family','Arial'],['x','Infinity'],['transform','translate(1 2)']])assert.throws(()=>inspectSuppliersSvg(mutate(svg,(_,ns)=>{jlrAttrs(ns.find(n=>jlrTag(n)==='text'))[key]=value;}),'fr','propagation'));
 for(const text of ['<!DOCTYPE svg>','<?xml-stylesheet href="https://evil.example/"?>'])assert.throws(()=>inspectSuppliersSvg(text+svg,'fr','propagation'));
 for(const{url}of Object.values(SUPPLIERS_VISIBLE_SOURCES)){assert.equal(typeof jlrSuppliersSourceAnchor(url),'string');const parsed=new URL(url);for(const forged of [`https://${parsed.hostname}.evil.example${parsed.pathname}`,`https://${parsed.hostname}@evil.example${parsed.pathname}`,`https://evil.example@${parsed.hostname}${parsed.pathname}`,`https://evil.example/?next=${url}`,`https://evil.example/#${url}`,url+'#x',url+'?x=1',url+'\u0000',url.replace('https:','http:')])assert.throws(()=>jlrSuppliersSourceAnchor(forged));}
 for(const value of ['__proto__','#source-08','https://example.org/',{},null])assert.throws(()=>jlrSuppliersSourceAnchor(value));
});

test('original goldens reject unintended paint, typography, text, ordering and proportional changes',()=>{
 const svg=jlrSuppliersSvg('fr','propagation');for(const[key,value]of [['x','111'],['font-size','23'],['fill','#ff4d87'],['font-weight','600']])assert.throws(()=>assertSuppliersFaithful(mutate(svg,(_,ns)=>{jlrAttrs(ns.find(n=>jlrTag(n)==='text'))[key]=value;}),'fr','propagation'));
 assert.throws(()=>assertSuppliersFaithful(svg.replace('La secousse remonte la chaîne','Autre titre contrôlé'),'fr','propagation'));
 assert.throws(()=>assertSuppliersFaithful(mutate(svg,root=>{[root.svg[1],root.svg[2]]=[root.svg[2],root.svg[1]];}),'fr','propagation'));
 for(const{svg,lang,kind}of variants)assertSuppliersQuantitative(svg,lang,kind);
 assert.throws(()=>assertSuppliersQuantitative(jlrSuppliersSvg('fr','credit').replace('width="523.97"','width="500"'),'fr','credit'));
 assert.throws(()=>assertSuppliersQuantitative(jlrSuppliersSvg('en','guarantee').replace('width="723.2"','width="700"'),'en','guarantee'));
});

test('render adaptation changes only responsive root style and exact local bibliography anchors',()=>{
 for(const{lang,kind,svg}of variants){const inline=jlrSuppliersInlineSvg(lang,kind);assertSuppliersFaithful(inline,lang,kind,true);assert.equal(inline.replace('<svg style="width:100%;height:auto" ','<svg ').replace(` href="${SUPPLIERS_VISIBLE_SOURCES[kind].anchor}"`,` href="${SUPPLIERS_VISIBLE_SOURCES[kind].url}"`),svg);}
});

test('supplier presentation follows semantic themes and preserves supplied font stacks with readable HTML notes',()=>{
 const component=read('src/components/JlrSuppliersFigure.astro'),style=component.match(/<style>([\s\S]*?)<\/style>/u)[1],css=postcss.parse(style),rules=new Map();css.walkRules(r=>{if(r.parent.type==='root')rules.set(r.selector,Object.fromEntries(r.nodes.filter(n=>n.type==='decl').map(d=>[d.prop,d.value])));});
 const mapping={'#0c0d10':'ink','#121419':'surface','#171a20':'surface-2','#272d37':'line-strong','#343b48':'line-strong','#657084':'muted','#a5adbb':'muted','#e7e9ee':'paper','#5eead4':'signal','#ff4d87':'accent','#f5b13d':'amber','#7aa2f7':'topic-blue'};
 for(const[color,token]of Object.entries(mapping))for(const attr of ['fill','stroke'])assert.deepEqual(rules.get(`.jlr-suppliers-figure :global([${attr}="${color}"])`),{[attr]:`var(--color-${token})`});
 const figure=rules.get('.jlr-suppliers-figure'),graphic=rules.get('.jlr-suppliers-figure :global(svg)');assert.deepEqual([figure.width,figure['max-width'],figure['padding-bottom'],figure.overflow],['100%','600px','.85rem','visible']);assert.deepEqual([graphic.width,graphic.height,graphic['max-width'],graphic['letter-spacing'],graphic.overflow],['100%','auto','100%','normal','visible']);
 css.walkDecls(d=>assert.doesNotMatch(d.value,/#(?:[a-f0-9]{3}){1,2}\b|url\(/iu));assert.doesNotMatch(style,/@font-face|font-family|clip-path|max-height|overflow\s*:\s*(?:hidden|clip)|transform\s*:|100vw/iu);
 assert.match(component,/jlrSuppliersReferences\(kind, sources\)/u);assert.match(component,/jlrSuppliersInlineSvg\(lang, kind\)/u);assert.equal((component.match(/set:html=/gu)??[]).length,1);
 for(const family of ['inter','jetbrains-mono'])assert.ok(component.includes(`href="/fonts/jlr/LICENSE-${family}.txt"`));
});

test('both supplied font bytes and complete licences match the existing JLR01 public assets',()=>{
 for(const[family,fontHash,licenceHash]of [['inter','3100e775e8616cd2611beecfa23a4263d7037586789b43f035236a2e6fbd4c62','3b0a5fca3d17942cde889069889dedbbbd075e9b599968c82a95f4d944e9b345'],['jetbrains-mono','18be452724bfdc236c074ca94a249a7f41a86752c7d04ab258ce9ed5651f6a7e','403581b69dac5cff4079205e01c6b467e56af449ecbd7247693ddb1baafa005b']]){
  assert.equal(digest(readFileSync(new URL(`../node_modules/@fontsource-variable/${family}/files/${family}-latin-wght-normal.woff2`,import.meta.url))),fontHash);const licence=read(`public/fonts/jlr/LICENSE-${family}.txt`);assert.equal(digest(licence),licenceHash);assertFontLicenseReferences(licence,family);
 }
});

test('native bilingual supplier MDX includes ordered figures, exact source URLs and detailed methods',()=>{for(const lang of ['fr','en'])articleContract(read(articlePath(lang)),lang);});

test('supplier MDX contract rejects incomplete, reordered, dynamic and forged declarations',()=>{
 const raw=read(articlePath('fr'));for(const mutation of [raw.replace('sources="01 08"','sources="01"'),raw.replace('number="01"','number="02"'),raw.replace('lang="fr" kind="propagation"','lang={"fr"} kind="propagation"'),raw.replace(SUPPLIERS_VISIBLE_SOURCES.propagation.url,`https://evil.example/?next=${SUPPLIERS_VISIBLE_SOURCES.propagation.url}`),raw.replace('<details><summary>Méthode et périmètre</summary>','<div><summary>Méthode et périmètre</summary>')])assert.throws(()=>articleContract(mutation,'fr'));
});
