import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { parse, serializeOuter } from 'parse5';
import { assertGdpFaithful, GDP_BIBLIOGRAPHY_SOURCES, gdpKinds } from './jlr-gdp-svg-assertions.mjs';
import { JLR_GDP_REQUIRED_SOURCES } from '../src/lib/jlrGdpFigures.mjs';
const nodes=n=>[n,...(n.childNodes??[]).flatMap(nodes)];
const attrs=n=>Object.fromEntries((n.attrs??[]).map(a=>[a.name,a.value]));
const text=n=>n.nodeName==='#text'?n.value:(n.childNodes??[]).map(text).join('');
const pages=['fr','en'].map(lang=>({lang,html:readFileSync(new URL(`../dist/${lang==='fr'?'posts/apres-cyberattaque-04-jlr-empreinte-pib':'en/analysis/after-cyberattack-04-jlr-gdp-footprint'}/index.html`,import.meta.url),'utf8')}));
function figures(tree,lang){
 const all=nodes(tree),figures=all.filter(n=>n.tagName==='figure'&&(attrs(n).class??'').split(' ').includes('jlr-gdp-figure'));assert.equal(figures.length,4);
 for(const[i,figure]of figures.entries()){
  const ns=nodes(figure),a=attrs(figure),kind=gdpKinds[i];assert.equal(a.id,`figure-0${i+1}`);assert.equal(a['data-kind'],kind);assert.equal(a['data-figure'],`0${i+1}`);
  const svg=ns.filter(n=>n.tagName==='svg');assert.equal(svg.length,1);assertGdpFaithful(serializeOuter(svg[0]),lang,kind,true);
  const caption=ns.filter(n=>n.tagName==='figcaption');assert.equal(caption.length,1);assert.ok(text(caption[0]).length>60);const refs=nodes(caption[0]).filter(n=>n.tagName==='a').map(n=>attrs(n).href);for(const id of JLR_GDP_REQUIRED_SOURCES[kind])assert.ok(refs.includes(`#source-${id}`));assert.equal(new Set(refs).size,refs.length);
  const details=ns.filter(n=>n.tagName==='details');assert.ok(details.length>=1);assert.ok(details.some(n=>text(n).length>100));
 }
 const ids=all.filter(n=>attrs(n).id).map(n=>attrs(n).id);assert.equal(ids.length,new Set(ids).size,'All document and SVG IDs remain unique');
 for(const family of ['inter','jetbrains-mono'])assert.equal(all.filter(n=>n.tagName==='a'&&attrs(n).href===`/fonts/jlr/LICENSE-${family}.txt`).length,1);
 const bibliography=all.filter(n=>n.tagName==='ol'&&(attrs(n).class??'').split(' ').includes('jlr-gdp-sources'));assert.equal(bibliography.length,1);
 // The page also repeats citations in its existing evidence panel. Validate the editorial bibliography itself.
 for(const kind of gdpKinds)for(const url of GDP_BIBLIOGRAPHY_SOURCES[kind])assert.equal(nodes(bibliography[0]).filter(n=>n.tagName==='a'&&attrs(n).href===url).length,1,'Full canonical source URL retained once in bibliography');
}

test('compiled FR/EN preserve 8 complete inline SVGs, all original metadata, bibliography links and accessible notes',()=>{for(const page of pages)figures(parse(page.html),page.lang);});

test('compiled SVG guards reject geometry, text, source, responsive and executable-markup changes',()=>{
 const page=pages[0];for(const change of [
  svg=>{svg.attrs.find(a=>a.name==='viewBox').value='0 0 1000 1351';},
  svg=>{svg.attrs=svg.attrs.filter(a=>a.name!=='style');},
  svg=>{const t=nodes(svg).find(n=>n.tagName==='text');t.attrs.find(a=>a.name==='font-family').value='Arial';},
  svg=>{nodes(svg).find(n=>n.nodeName==='#text'&&n.value === 'La production remonte, le creux reste visible').value='Changed figure title';},
  svg=>{const metadata=nodes(svg).filter(n=>n.tagName==='metadata');assert.equal(metadata.length,1);assert.equal(metadata[0].childNodes.length,1);const value=metadata[0].childNodes[0];assert.equal(value.nodeName,'#text');value.value='Forged metadata';},
  svg=>{svg.childNodes.push({nodeName:'script',tagName:'script',attrs:[],childNodes:[]});},
 ]){const tree=parse(page.html),svg=nodes(tree).find(n=>n.tagName==='figure'&&attrs(n).id==='figure-01').childNodes.flatMap(nodes).find(n=>n.tagName==='svg');change(svg);assert.throws(()=>figures(tree,page.lang));}
});

test('compiled bibliography rejects duplicate canonical links inside a source entry',()=>{
 const tree=parse(pages[0].html),entry=nodes(tree).find(n=>n.tagName==='li'&&attrs(n).id==='source-04');
 const link=nodes(entry).find(n=>n.tagName==='a');entry.childNodes.push({nodeName:'a',tagName:'a',attrs:link.attrs.map(a=>({...a})),childNodes:[]});
 assert.throws(()=>figures(tree,'fr'));
});
