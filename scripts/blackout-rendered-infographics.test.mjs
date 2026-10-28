import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';
import {parse,parseFragment,serializeOuter} from 'parse5';
import {BLACKOUT_KINDS,BLACKOUT_SOURCES,blackoutScenes,assertBlackoutGeometry} from './blackout-svg-assertions.mjs';
const walk=n=>[n,...(n.childNodes??[]).flatMap(walk)];
const attributes=n=>Object.fromEntries((n.attrs??[]).map(a=>[a.name,a.value]));
const normalized=s=>serializeOuter(parseFragment(s).childNodes.find(n=>n.tagName==='svg'));
test('compiled French and English articles retain all24 reviewed vectors, actual source targets and complete methods',()=>{
 const paths=['dist/posts/blackout-heures-autonomie-financement/index.html','dist/en/analysis/blackouts-who-pays-service-continuity/index.html'];
 for(const[i,path]of paths.entries()){const lang=i?'en':'fr',all=walk(parse(readFileSync(new URL(`../${path}`,import.meta.url),'utf8'))),figures=all.filter(n=>n.tagName==='figure'&&(attributes(n).class??'').split(' ').includes('blackout-autonomy-figure'));assert.equal(figures.length,6);
  for(const[j,figure]of figures.entries()){assert.equal(attributes(figure)['data-kind'],BLACKOUT_KINDS[j]);assert.equal(attributes(figure).id,`figure-0${j+1}`);const descendants=walk(figure),svgs=descendants.filter(n=>n.tagName==='svg');assert.equal(svgs.length,2);for(const[k,svg]of svgs.entries()){const raw=serializeOuter(svg),scene=blackoutScenes().find(s=>s.lang===lang&&s.kind===BLACKOUT_KINDS[j]&&s.mobile===Boolean(k));assertBlackoutGeometry(raw);assert.equal(normalized(raw),normalized(scene.svg),'Exact reviewed data, labels, directions, glyphs and geometry');}const refs=descendants.filter(n=>n.tagName==='a'&&(attributes(n).href??'').startsWith('#source-s')).map(n=>attributes(n).href);assert.deepEqual(refs,BLACKOUT_SOURCES[j].split(' ').map(id=>`#source-${id.toLowerCase()}`));for(const ref of refs)assert.ok(all.some(n=>attributes(n).id===ref.slice(1)));for(const name of['figcaption','details','summary'])assert.equal(descendants.filter(n=>n.tagName===name).length,1);if(j===1){assert.equal(descendants.filter(n=>n.tagName==='table').length,1);assert.equal(descendants.filter(n=>n.tagName==='tbody').flatMap(n=>(n.childNodes??[]).filter(n=>n.tagName==='tr')).length,10);}}
 }
});
