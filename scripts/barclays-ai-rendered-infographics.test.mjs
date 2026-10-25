import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { parse, parseFragment, serializeOuter } from 'parse5';
import { BARCLAYS_AI_KINDS, BARCLAYS_AI_SOURCES, barclaysAiScenes, assertBarclaysAiGeometry } from './barclays-ai-svg-assertions.mjs';
const walk=n=>[n,...(n.childNodes??[]).flatMap(walk)];
const attributes=n=>Object.fromEntries((n.attrs??[]).map(a=>[a.name,a.value]));
const normalized=s=>serializeOuter(parseFragment(s).childNodes.find(n=>n.tagName==='svg'));
test('both compiled articles preserve all twenty-eight exact reviewed vectors and their actual source links',()=>{
 const paths=['dist/posts/barclays-ia-preuves-suppressions-postes/index.html','dist/en/analysis/barclays-ai-job-cuts-productivity-evidence/index.html'];
 for(const[i,path]of paths.entries()){
  const lang=i?'en':'fr',all=walk(parse(readFileSync(new URL(`../${path}`,import.meta.url),'utf8'))),figures=all.filter(n=>n.tagName==='figure'&&(attributes(n).class??'').split(' ').includes('barclays-ai-figure'));
  assert.equal(figures.length,7);
  for(const[j,figure]of figures.entries()){
   assert.equal(attributes(figure)['data-kind'],BARCLAYS_AI_KINDS[j]);assert.equal(attributes(figure).id,`figure-${String(j+1).padStart(2,'0')}`);
   const descendants=walk(figure),svgs=descendants.filter(n=>n.tagName==='svg');assert.equal(svgs.length,2);
   for(const[k,svg]of svgs.entries()){const raw=serializeOuter(svg),scene=barclaysAiScenes().find(s=>s.lang===lang&&s.kind===BARCLAYS_AI_KINDS[j]&&s.mobile===Boolean(k));assertBarclaysAiGeometry(raw);assert.equal(normalized(raw),normalized(scene.svg),'Exact reviewed labels, native artwork, relations and geometry');}
   const refs=descendants.filter(n=>n.tagName==='a'&&(attributes(n).href??'').startsWith('#source-s')).map(n=>attributes(n).href);assert.deepEqual(refs,(BARCLAYS_AI_SOURCES[j] ? BARCLAYS_AI_SOURCES[j].split(' ') : []).map(id=>`#source-${id.toLowerCase()}`));for(const ref of refs)assert.ok(all.some(n=>attributes(n).id===ref.slice(1)));
   for(const name of['figcaption','details','summary'])assert.equal(descendants.filter(n=>n.tagName===name).length,1);
  }
 }
});
