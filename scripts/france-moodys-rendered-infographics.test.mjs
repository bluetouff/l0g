import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { parse, parseFragment, serializeOuter } from 'parse5';
import { FRANCE_MOODYS_KINDS, FRANCE_MOODYS_SOURCES, franceMoodysScenes, assertFranceMoodysGeometry } from './france-moodys-svg-assertions.mjs';
const walk=n=>[n,...(n.childNodes??[]).flatMap(walk)];
const attributes=n=>Object.fromEntries((n.attrs??[]).map(a=>[a.name,a.value]));
const normalized=s=>serializeOuter(parseFragment(s).childNodes.find(n=>n.tagName==='svg'));
test('both compiled articles preserve all thirty-six exact reviewed vectors and their actual source links',()=>{
 const paths=['dist/posts/france-moodys-budget-2027-prix-dette/index.html','dist/en/analysis/france-moodys-reprieve-2027-borrowing-costs/index.html'];
 for(const[i,path]of paths.entries()){
  const lang=i?'en':'fr',all=walk(parse(readFileSync(new URL(`../${path}`,import.meta.url),'utf8'))),figures=all.filter(n=>n.tagName==='figure'&&(attributes(n).class??'').split(' ').includes('france-moodys-figure'));
  assert.equal(figures.length,9);
  for(const[j,figure]of figures.entries()){
   assert.equal(attributes(figure)['data-kind'],FRANCE_MOODYS_KINDS[j]);assert.equal(attributes(figure).id,`figure-${String(j+1).padStart(2,'0')}`);
   const descendants=walk(figure),svgs=descendants.filter(n=>n.tagName==='svg');assert.equal(svgs.length,2);
   for(const[k,svg]of svgs.entries()){const raw=serializeOuter(svg),scene=franceMoodysScenes().find(s=>s.lang===lang&&s.kind===FRANCE_MOODYS_KINDS[j]&&s.mobile===Boolean(k));assertFranceMoodysGeometry(raw);assert.equal(normalized(raw),normalized(scene.svg),'Exact reviewed labels, native artwork, relations and geometry');}
   const refs=descendants.filter(n=>n.tagName==='a'&&(attributes(n).href??'').startsWith('#source-s')).map(n=>attributes(n).href);assert.deepEqual(refs,FRANCE_MOODYS_SOURCES[j].split(' ').map(id=>`#source-${id.toLowerCase()}`));for(const ref of refs)assert.ok(all.some(n=>attributes(n).id===ref.slice(1)));
   for(const name of['figcaption','details','summary'])assert.equal(descendants.filter(n=>n.tagName===name).length,1);
  }
 }
});
