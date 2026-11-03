import assert from 'node:assert/strict';
import {readFileSync}from'node:fs';
import test from'node:test';
import{parse,parseFragment,serializeOuter}from'parse5';
import{COLD_CHAIN_FIGURE_KINDS,COLD_CHAIN_FIGURE_SOURCES,coldChainScenes,assertColdChainGeometry}from'./cold-chain-01-svg-assertions.mjs';
const walk=n=>[n,...(n.childNodes??[]).flatMap(walk)],attrs=n=>Object.fromEntries((n.attrs??[]).map(a=>[a.name,a.value])),normalized=s=>serializeOuter(parseFragment(s).childNodes.find(n=>n.tagName==='svg'));
test('compiled FR/EN articles retain16exact passive cold-chain scenes and resolvable references',()=>{
 for(const[i,path]of['dist/posts/guerre-machines-01-congelateurs-cible/index.html','dist/en/analysis/ordinary-machines-01-freezers-target/index.html'].entries()){
  const lang=i?'en':'fr',all=walk(parse(readFileSync(new URL('../'+path,import.meta.url),'utf8'))),figures=all.filter(n=>n.tagName==='figure'&&(attrs(n).class??'').split(' ').includes('cold-chain-figure'));assert.equal(figures.length,4);
  const ids=all.map(n=>attrs(n).id).filter(Boolean);assert.equal(ids.length,new Set(ids).size);
  for(const[j,figure]of figures.entries()){
   assert.equal(attrs(figure)['data-kind'],COLD_CHAIN_FIGURE_KINDS[j]);assert.equal(attrs(figure).id,'figure-'+String(j+1).padStart(2,'0'));const children=walk(figure),svgs=children.filter(n=>n.tagName==='svg');assert.equal(svgs.length,2);
   for(const[k,svg]of svgs.entries()){const raw=serializeOuter(svg),scene=coldChainScenes().find(s=>s.lang===lang&&s.kind===COLD_CHAIN_FIGURE_KINDS[j]&&s.mobile===Boolean(k));assertColdChainGeometry(raw);assert.equal(normalized(raw),normalized(scene.svg));}
   const refs=children.filter(n=>n.tagName==='a'&&(attrs(n).href??'').startsWith('#source-')).map(n=>attrs(n).href);assert.deepEqual(refs,COLD_CHAIN_FIGURE_SOURCES[j].map(id=>'#source-'+id));for(const ref of refs)assert.equal(all.filter(n=>attrs(n).id===ref.slice(1)).length,1);assert.equal(children.filter(n=>n.tagName==='figcaption').length,1);assert.equal(children.filter(n=>n.tagName==='summary').length,1);
  }
 }
});
