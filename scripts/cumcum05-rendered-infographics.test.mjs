import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { parse, parseFragment, serializeOuter } from 'parse5';
import { CUMCUM05_KINDS, CUMCUM05_SOURCES, cumCumDoctrineScenes, assertCumCumDoctrineGeometry } from './cumcum05-svg-assertions.mjs';
import { cumCumDoctrineComparison } from '../src/lib/cumCumDoctrineComparison.mjs';
const walk=n=>[n,...(n.childNodes??[]).flatMap(walk)];
const attributes=n=>Object.fromEntries((n.attrs??[]).map(a=>[a.name,a.value]));
const text=n=>n.nodeName==='#text'?n.value:(n.childNodes??[]).map(text).join('');
const clean=n=>text(n).replace(/\s+/gu,' ').trim();
const normalized=s=>serializeOuter(parseFragment(s).childNodes.find(n=>n.tagName==='svg'));
test('both compiled articles preserve all sixteen exact reviewed vectors and their actual source links',()=>{
 const paths=['dist/posts/cumcum-05-bataille-doctrine-fiscale/index.html','dist/en/analysis/cumcum-05-tax-guidance-battle/index.html'];
 for(const[i,path]of paths.entries()){
  const lang=i?'en':'fr',all=walk(parse(readFileSync(new URL(`../${path}`,import.meta.url),'utf8'))),figures=all.filter(n=>n.tagName==='figure'&&(attributes(n).class??'').split(' ').includes('cumcum05-figure'));
  assert.equal(figures.length,4);
  for(const[j,figure]of figures.entries()){
   assert.equal(attributes(figure)['data-kind'],CUMCUM05_KINDS[j]);assert.equal(attributes(figure).id,`figure-${String(j+1).padStart(2,'0')}`);
   const descendants=walk(figure),svgs=descendants.filter(n=>n.tagName==='svg');assert.equal(svgs.length,2);
   for(const[k,svg]of svgs.entries()){const raw=serializeOuter(svg),scene=cumCumDoctrineScenes().find(s=>s.lang===lang&&s.kind===CUMCUM05_KINDS[j]&&s.mobile===Boolean(k));assertCumCumDoctrineGeometry(raw);assert.equal(normalized(raw),normalized(scene.svg),'Exact reviewed labels, native artwork, relations and geometry');}
   const citeBox=descendants.find(n=>n.tagName==='span'&&(attributes(n).class??'').split(' ').includes('figure-cites'));assert.ok(citeBox);const refs=walk(citeBox).filter(n=>n.tagName==='a'&&(attributes(n).href??'').startsWith('#source-')).map(n=>attributes(n).href);assert.deepEqual(refs,(CUMCUM05_SOURCES[j] ? CUMCUM05_SOURCES[j].split(' ') : []).map(id=>`#source-${id}`));for(const ref of refs)assert.ok(all.some(n=>attributes(n).id===ref.slice(1)));
   for(const name of['figcaption','details','summary'])assert.equal(descendants.filter(n=>n.tagName===name).length,1);
  }
  const comparison=all.find(n=>n.tagName==='section'&&attributes(n).id==='comparateur');assert.ok(comparison);const sections=walk(comparison).filter(n=>n.tagName==='details');const expected=cumCumDoctrineComparison(lang);assert.equal(sections.length,6);
  for(const[j,section]of sections.entries()){
   assert.equal(attributes(section).id,'comparaison-'+expected[j].id);assert.equal(attributes(section).open,undefined,'Reader chooses the document topic');const summary=walk(section).find(n=>n.tagName==='summary');assert.ok(clean(summary).includes(expected[j].title));assert.ok(clean(summary).includes(expected[j].scope));
   const panels=walk(section).filter(n=>(attributes(n).class??'').split(' ').includes('comparison-panel'));assert.equal(panels.length,expected[j].panels.length);
   for(const[k,panel]of panels.entries()){const descendants=walk(panel),data=expected[j].panels[k];for(const v of[data.date,data.label,data.text])assert.ok(clean(panel).includes(v.replace(/\s+/gu,' ').trim()),'Exact dated documentary text survives compilation');const links=descendants.filter(n=>n.tagName==='a');assert.deepEqual(links.map(n=>attributes(n).href),data.sources.map(id=>'#source-'+id));for(const n of links)assert.ok(all.some(e=>attributes(e).id===attributes(n).href.slice(1)));}
   assert.ok(clean(section).includes(expected[j].limit.replace(/\s+/gu,' ').trim()));
  }
 }
});
