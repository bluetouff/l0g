import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';
import {parse,parseFragment,serializeOuter} from 'parse5';
import {AI_GOVERNANCE_KINDS,AI_GOVERNANCE_SOURCES,aiGovernanceScenes,assertAiGovernanceGeometry} from './ai-governance-svg-assertions.mjs';
const walk=n=>[n,...(n.childNodes??[]).flatMap(walk)];
const attributes=n=>Object.fromEntries((n.attrs??[]).map(a=>[a.name,a.value]));
const normalized=s=>serializeOuter(parseFragment(s).childNodes.find(n=>n.tagName==='svg'));
test('compiled FR/EN articles preserve all28 vectors, source targets and scoped methods',()=>{
 const paths=['dist/posts/gouvernance-ia-anthropic-etat-nationalisation/index.html','dist/en/analysis/ai-governance-anthropic-state-ownership/index.html'];
 for(const[i,path]of paths.entries()){const lang=i?'en':'fr',all=walk(parse(readFileSync(new URL('../'+path,import.meta.url),'utf8'))),figures=all.filter(n=>n.tagName==='figure'&&(attributes(n).class??'').split(' ').includes('ai-governance-figure'));assert.equal(figures.length,7);
 for(const[j,figure]of figures.entries()){assert.equal(attributes(figure)['data-kind'],AI_GOVERNANCE_KINDS[j]);assert.equal(attributes(figure).id,'figure-0'+(j+1));const descendants=walk(figure),svgs=descendants.filter(n=>n.tagName==='svg');assert.equal(svgs.length,2);for(const[k,svg]of svgs.entries()){const raw=serializeOuter(svg),scene=aiGovernanceScenes().find(s=>s.lang===lang&&s.kind===AI_GOVERNANCE_KINDS[j]&&s.mobile===Boolean(k));assertAiGovernanceGeometry(raw);assert.equal(normalized(raw),normalized(scene.svg),'Exact reviewed rights, denominators, directions, glyphs and geometry');}const refs=descendants.filter(n=>n.tagName==='a'&&(attributes(n).href??'').startsWith('#source-')).map(n=>attributes(n).href);assert.deepEqual(refs,AI_GOVERNANCE_SOURCES[j].split(' ').map(id=>'#source-'+id.toLowerCase()));for(const ref of refs)assert.ok(all.some(n=>attributes(n).id===ref.slice(1)));for(const name of['figcaption','details','summary'])assert.equal(descendants.filter(n=>n.tagName===name).length,1);}}
});
