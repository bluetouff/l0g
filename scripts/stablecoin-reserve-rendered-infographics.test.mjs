import assert from 'node:assert/strict';
import{readFileSync}from'node:fs';
import test from'node:test';
import{parse,parseFragment,serializeOuter}from'parse5';
import{STABLECOIN_RESERVE_KINDS,STABLECOIN_RESERVE_SOURCES,stablecoinReserveScenes,assertStablecoinReserveGeometry}from'./stablecoin-reserve-svg-assertions.mjs';
const walk=n=>[n,...(n.childNodes??[]).flatMap(walk)],a=n=>Object.fromEntries((n.attrs??[]).map(x=>[x.name,x.value]));
const normalized=s=>serializeOuter(parseFragment(s).childNodes.find(n=>n.tagName==='svg'));
test('compiled bilingual stablecoin reserve articles keep all28 exact reviewed vectors, source targets and accessible methods',()=>{
 const paths=['dist/posts/stablecoins-remuneration-reserves-occ-circle-coinbase/index.html','dist/en/analysis/stablecoins-yield-reserves-occ-circle-coinbase/index.html'];
 for(const[i,path]of paths.entries()){const lang=i?'en':'fr',all=walk(parse(readFileSync(new URL('../'+path,import.meta.url),'utf8'))),figures=all.filter(n=>n.tagName==='figure'&&(a(n).class??'').split(' ').includes('stablecoin-reserve-figure'));assert.equal(figures.length,7);const ids=all.map(n=>a(n).id).filter(Boolean);assert.equal(ids.length,new Set(ids).size);
 for(const[j,f]of figures.entries()){assert.equal(a(f)['data-kind'],STABLECOIN_RESERVE_KINDS[j]);assert.equal(a(f).id,'figure-0'+(j+1));const children=walk(f),svgs=children.filter(n=>n.tagName==='svg');assert.equal(svgs.length,2);for(const[k,svg]of svgs.entries()){const raw=serializeOuter(svg),scene=stablecoinReserveScenes().find(s=>s.lang===lang&&s.kind===STABLECOIN_RESERVE_KINDS[j]&&s.mobile===Boolean(k));assertStablecoinReserveGeometry(raw);assert.equal(normalized(raw),normalized(scene.svg));}const refs=children.filter(n=>n.tagName==='a'&&(a(n).href??'').startsWith('#source-')).map(n=>a(n).href);assert.deepEqual(refs,STABLECOIN_RESERVE_SOURCES[j].split(' ').map(id=>'#source-'+id.toLowerCase()));for(const ref of refs)assert.ok(all.some(n=>a(n).id===ref.slice(1)));assert.equal(children.filter(n=>n.tagName==='figcaption').length,1);assert.equal(children.filter(n=>n.tagName==='details').length,children.filter(n=>n.tagName==='summary').length);}}
});
