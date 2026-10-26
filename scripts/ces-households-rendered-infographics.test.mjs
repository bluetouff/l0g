import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { parse, parseFragment, serializeOuter } from 'parse5';
import { CES_HOUSEHOLDS_KINDS, CES_HOUSEHOLDS_SOURCES, cesHouseholdsScenes, assertCesHouseholdsGeometry } from './ces-households-svg-assertions.mjs';
const walk=n=>[n,...(n.childNodes??[]).flatMap(walk)];
const attributes=n=>Object.fromEntries((n.attrs??[]).map(a=>[a.name,a.value]));
const normalized=s=>serializeOuter(parseFragment(s).childNodes.find(n=>n.tagName==='svg'));
test('both compiled articles preserve all twenty-eight exact reviewed vectors and their actual source links',()=>{
 const paths=['dist/posts/bce-menages-facture-plus-lourde/index.html','dist/en/analysis/ecb-households-bigger-bills/index.html'];
 for(const[i,path]of paths.entries()){
  const lang=i?'en':'fr',all=walk(parse(readFileSync(new URL(`../${path}`,import.meta.url),'utf8'))),figures=all.filter(n=>n.tagName==='figure'&&(attributes(n).class??'').split(' ').includes('ces-households-figure'));
  assert.equal(figures.length,7);
  for(const[j,figure]of figures.entries()){
   assert.equal(attributes(figure)['data-kind'],CES_HOUSEHOLDS_KINDS[j]);assert.equal(attributes(figure).id,`figure-${String(j+1).padStart(2,'0')}`);
   const descendants=walk(figure),svgs=descendants.filter(n=>n.tagName==='svg');assert.equal(svgs.length,2);
   for(const[k,svg]of svgs.entries()){const raw=serializeOuter(svg),scene=cesHouseholdsScenes().find(s=>s.lang===lang&&s.kind===CES_HOUSEHOLDS_KINDS[j]&&s.mobile===Boolean(k));assertCesHouseholdsGeometry(raw);assert.equal(normalized(raw),normalized(scene.svg),'Exact reviewed labels, native artwork, relations and geometry');}
   const refs=descendants.filter(n=>n.tagName==='a'&&(attributes(n).href??'').startsWith('#source-s')).map(n=>attributes(n).href);assert.deepEqual(refs,(CES_HOUSEHOLDS_SOURCES[j] ? CES_HOUSEHOLDS_SOURCES[j].split(' ') : []).map(id=>`#source-${id.toLowerCase()}`));for(const ref of refs)assert.ok(all.some(n=>attributes(n).id===ref.slice(1)));
   for(const name of['figcaption','details','summary'])assert.equal(descendants.filter(n=>n.tagName===name).length,1);
  }
 }
});
