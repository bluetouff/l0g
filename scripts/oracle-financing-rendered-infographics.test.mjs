import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { parse, parseFragment, serializeOuter } from 'parse5';
import { ORACLE_FIGURE_IDS, ORACLE_FIGURE_SOURCES, oracleFinancingScenes, assertOracleFinancingGeometry } from './oracle-financing-svg-assertions.mjs';
const walk=n=>[n,...(n.childNodes??[]).flatMap(walk)];
const attrs=n=>Object.fromEntries((n.attrs??[]).map(a=>[a.name,a.value]));
const normalized=s=>serializeOuter(parseFragment(s).childNodes.find(n=>n.tagName==='svg'));

test('compiled FR/EN articles retain20exact passive Oracle vector scenes and resolvable numeric sources',()=>{
  for(const[i,path]of[
    'dist/posts/oracle-qui-finance-le-chantier-des-225-milliards/index.html',
    'dist/en/analysis/oracle-who-funds-the-225-billion-buildout/index.html'
  ].entries()){
    const lang=i?'en':'fr';
    const all=walk(parse(readFileSync(new URL('../'+path,import.meta.url),'utf8')));
    const figures=all.filter(n=>n.tagName==='figure'&&(attrs(n).class??'').split(' ').includes('oracle-figure'));
    assert.equal(figures.length,5);
    const ids=all.map(n=>attrs(n).id).filter(Boolean);assert.equal(ids.length,new Set(ids).size);
    for(const[j,figure]of figures.entries()){
      assert.equal(attrs(figure)['data-kind'],ORACLE_FIGURE_IDS[j]);assert.equal(attrs(figure).id,'figure-'+ORACLE_FIGURE_IDS[j]);
      const children=walk(figure),svgs=children.filter(n=>n.tagName==='svg');assert.equal(svgs.length,2);
      for(const[k,svg]of svgs.entries()){
        const raw=serializeOuter(svg);
        const scene=oracleFinancingScenes().find(s=>s.lang===lang&&s.kind===ORACLE_FIGURE_IDS[j]&&s.mobile===Boolean(k));
        assertOracleFinancingGeometry(raw);assert.equal(normalized(raw),normalized(scene.svg));
      }
      const refs=children.filter(n=>n.tagName==='a'&&(attrs(n).href??'').startsWith('#source-')).map(n=>attrs(n).href);
      assert.deepEqual(refs,ORACLE_FIGURE_SOURCES[j].map(id=>'#source-'+id));
      for(const ref of refs)assert.equal(all.filter(n=>attrs(n).id===ref.slice(1)).length,1);
      assert.equal(children.filter(n=>n.tagName==='figcaption').length,1);assert.equal(children.filter(n=>n.tagName==='summary').length,1);
    }
  }
});
