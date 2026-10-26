import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { parse, parseFragment, serializeOuter } from 'parse5';
import { IRON_ORE_KINDS, IRON_ORE_SOURCES, ironOreScenes, assertIronOreGeometry } from './iron-ore-svg-assertions.mjs';
const walk=n=>[n,...(n.childNodes??[]).flatMap(walk)];
const attributes=n=>Object.fromEntries((n.attrs??[]).map(a=>[a.name,a.value]));
const normalized=s=>serializeOuter(parseFragment(s).childNodes.find(n=>n.tagName==='svg'));
test('both compiled articles preserve all twenty exact reviewed vectors and their actual source links',()=>{
 const paths=['dist/posts/minerai-fer-prix-attente-fortescue-cmrg/index.html','dist/en/analysis/iron-ore-price-of-waiting-fortescue-cmrg/index.html'];
 for(const[i,path]of paths.entries()){
  const lang=i?'en':'fr',all=walk(parse(readFileSync(new URL(`../${path}`,import.meta.url),'utf8'))),figures=all.filter(n=>n.tagName==='figure'&&(attributes(n).class??'').split(' ').includes('iron-ore-figure'));
  assert.equal(figures.length,5);
  for(const[j,figure]of figures.entries()){
   assert.equal(attributes(figure)['data-kind'],IRON_ORE_KINDS[j]);assert.equal(attributes(figure).id,`figure-${String(j+1).padStart(2,'0')}`);
   const descendants=walk(figure),svgs=descendants.filter(n=>n.tagName==='svg');assert.equal(svgs.length,2);
   for(const[k,svg]of svgs.entries()){const raw=serializeOuter(svg),scene=ironOreScenes().find(s=>s.lang===lang&&s.kind===IRON_ORE_KINDS[j]&&s.mobile===Boolean(k));assertIronOreGeometry(raw);assert.equal(normalized(raw),normalized(scene.svg),'Exact reviewed labels, native artwork, relations and geometry');}
   const citeBox=descendants.find(n=>n.tagName==='span'&&(attributes(n).class??'').split(' ').includes('figure-cites'));assert.ok(citeBox);const refs=walk(citeBox).filter(n=>n.tagName==='a'&&(attributes(n).href??'').startsWith('#source-')).map(n=>attributes(n).href);assert.deepEqual(refs,(IRON_ORE_SOURCES[j] ? IRON_ORE_SOURCES[j].split(' ') : []).map(id=>`#source-${id}`));for(const ref of refs)assert.ok(all.some(n=>attributes(n).id===ref.slice(1)));
   for(const name of['figcaption','details','summary'])assert.equal(descendants.filter(n=>n.tagName===name).length,1);
  }
 }
});
