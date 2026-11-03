import assert from 'node:assert/strict';
import {readFileSync}from'node:fs';
import test from'node:test';
import{parse,parseFragment,serializeOuter}from'parse5';
import{MACHINES03_FIGURE_KINDS,MACHINES03_FIGURE_SOURCES,machines03Scenes,assertMachines03Geometry}from'./machines03-svg-assertions.mjs';
const walk=n=>[n,...(n.childNodes??[]).flatMap(walk)],attrs=n=>Object.fromEntries((n.attrs??[]).map(a=>[a.name,a.value])),normalized=s=>serializeOuter(parseFragment(s).childNodes.find(n=>n.tagName==='svg'));
test('compiled FR/EN articles retain20exact passive machines03 scenes and resolvable references',()=>{
 for(const[i,path]of['dist/posts/guerre-machines-03-telemaintenance-prestataires/index.html','dist/en/analysis/ordinary-machines-03-remote-maintenance-contractors/index.html'].entries()){
  const lang=i?'en':'fr',all=walk(parse(readFileSync(new URL('../'+path,import.meta.url),'utf8'))),figures=all.filter(n=>n.tagName==='figure'&&(attrs(n).class??'').split(' ').includes('remote-maintenance-figure'));assert.equal(figures.length,5);
  const ids=all.map(n=>attrs(n).id).filter(Boolean);assert.equal(ids.length,new Set(ids).size);
  for(const[j,figure]of figures.entries()){
   assert.equal(attrs(figure)['data-kind'],MACHINES03_FIGURE_KINDS[j]);assert.equal(attrs(figure).id,'figure-'+String(j+1).padStart(2,'0'));const children=walk(figure),svgs=children.filter(n=>n.tagName==='svg');assert.equal(svgs.length,2);
   for(const[k,svg]of svgs.entries()){const raw=serializeOuter(svg),scene=machines03Scenes().find(s=>s.lang===lang&&s.kind===MACHINES03_FIGURE_KINDS[j]&&s.mobile===Boolean(k));assertMachines03Geometry(raw);assert.equal(normalized(raw),normalized(scene.svg));}
   const refs=children.filter(n=>n.tagName==='a'&&(attrs(n).href??'').startsWith('#source-')).map(n=>attrs(n).href);assert.deepEqual(refs,MACHINES03_FIGURE_SOURCES[j].map(id=>'#source-'+id));for(const ref of refs)assert.equal(all.filter(n=>attrs(n).id===ref.slice(1)).length,1);assert.equal(children.filter(n=>n.tagName==='figcaption').length,1);assert.equal(children.filter(n=>n.tagName==='summary').length,1);
  }
 }
});
