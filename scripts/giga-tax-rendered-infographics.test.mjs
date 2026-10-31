import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { parse, parseFragment, serializeOuter } from 'parse5';
import { GIGA_TAX_KINDS, GIGA_TAX_SOURCES, gigaTaxScenes, assertGigaTaxGeometry } from './giga-tax-svg-assertions.mjs';
const walk=n=>[n,...(n.childNodes??[]).flatMap(walk)],attrs=n=>Object.fromEntries((n.attrs??[]).map(a=>[a.name,a.value]));
const normalized=s=>serializeOuter(parseFragment(s).childNodes.find(n=>n.tagName==='svg'));
test('compiled FR/EN articles retain12exact passive vector scenes and their source/method targets',()=>{
  for(const[i,path]of['dist/posts/taxe-giga-internet-ps/index.html','dist/en/analysis/france-gigabyte-tax-internet/index.html'].entries()){
    const lang=i?'en':'fr',all=walk(parse(readFileSync(new URL('../'+path,import.meta.url),'utf8'))),figures=all.filter(n=>n.tagName==='figure'&&(attrs(n).class??'').split(' ').includes('giga-tax-figure'));assert.equal(figures.length,3);const ids=all.map(n=>attrs(n).id).filter(Boolean);assert.equal(ids.length,new Set(ids).size);
    for(const[j,figure]of figures.entries()){
      assert.equal(attrs(figure)['data-kind'],GIGA_TAX_KINDS[j]);assert.equal(attrs(figure).id,'figure-'+(j+1));const children=walk(figure),svgs=children.filter(n=>n.tagName==='svg');assert.equal(svgs.length,2);
      for(const[k,svg]of svgs.entries()){const raw=serializeOuter(svg),scene=gigaTaxScenes().find(s=>s.lang===lang&&s.kind===GIGA_TAX_KINDS[j]&&s.mobile===Boolean(k));assertGigaTaxGeometry(raw);assert.equal(normalized(raw),normalized(scene.svg));}
      const refs=children.filter(n=>n.tagName==='a'&&(attrs(n).href??'').startsWith('#source-')).map(n=>attrs(n).href);assert.deepEqual(refs,GIGA_TAX_SOURCES[j].map(id=>'#source-'+id.toLowerCase()));for(const ref of refs)assert.ok(all.some(n=>attrs(n).id===ref.slice(1)));assert.equal(children.filter(n=>n.tagName==='figcaption').length,1);assert.ok(children.some(n=>n.tagName==='summary'));
    }
  }
});
