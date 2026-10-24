import assert from 'node:assert/strict';
import{readFileSync}from'node:fs';
import test from'node:test';
import{parse,parseFragment,serializeOuter}from'parse5';
import{NEBIUS_KINDS,NEBIUS_SOURCES,nebiusScenes,assertNebiusGeometry}from'./nebius-credit-svg-assertions.mjs';
const walk=n=>[n,...(n.childNodes??[]).flatMap(walk)];
const a=n=>Object.fromEntries((n.attrs??[]).map(x=>[x.name,x.value]));
const normalized=s=>serializeOuter(parseFragment(s).childNodes.find(n=>n.tagName==='svg'));
test('both compiled articles preserve the twenty-eight exact reviewed vectors and all source links',()=>{
 const paths=['dist/posts/nebius-citi-credit-364-jours-gpu/index.html','dist/en/analysis/nebius-citi-364-day-gpu-credit/index.html'];
 for(const[i,path]of paths.entries()){
  const lang=i?'en':'fr',html=readFileSync(new URL(`../${path}`,import.meta.url),'utf8'),all=walk(parse(html)),figures=all.filter(n=>n.tagName==='figure'&&(a(n).class??'').split(' ').includes('nebius-credit-figure'));
  assert.equal(figures.length,7);
  for(const[j,figure]of figures.entries()){
   assert.equal(a(figure)['data-kind'],NEBIUS_KINDS[j]);assert.equal(a(figure).id,`figure-${String(j+1).padStart(2,'0')}`);
   const descendants=walk(figure),svgs=descendants.filter(n=>n.tagName==='svg');assert.equal(svgs.length,2);
   for(const[k,svg]of svgs.entries()){const raw=serializeOuter(svg),scene=nebiusScenes().find(s=>s.lang===lang&&s.kind===NEBIUS_KINDS[j]&&s.mobile===Boolean(k));assertNebiusGeometry(raw);assert.equal(normalized(raw),normalized(scene.svg),'Compiled vector preserves exact labels, relationships and geometry');}
   const refs=descendants.filter(n=>n.tagName==='a'&&(a(n).href??'').startsWith('#source-s')).map(n=>a(n).href);assert.deepEqual(refs,NEBIUS_SOURCES[j].split(' ').map(id=>`#source-s${id}`));for(const ref of refs)assert.ok(all.some(n=>a(n).id===ref.slice(1)));
   for(const tag of['figcaption','details','summary'])assert.equal(descendants.filter(n=>n.tagName===tag).length,1);
  }
 }
});
