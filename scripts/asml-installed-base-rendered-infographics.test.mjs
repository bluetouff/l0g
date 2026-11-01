import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { parse, parseFragment, serializeOuter } from 'parse5';
import { ASML_FIGURE_IDS, ASML_FIGURE_SOURCES, asmlInstalledBaseScenes, assertAsmlInstalledBaseGeometry } from './asml-installed-base-svg-assertions.mjs';
const walk=n=>[n,...(n.childNodes??[]).flatMap(walk)];
const attrs=n=>Object.fromEntries((n.attrs??[]).map(a=>[a.name,a.value]));
const normalized=s=>serializeOuter(parseFragment(s).childNodes.find(n=>n.tagName==='svg'));

test('compiled FR/EN articles retain24exact passive ASML vector scenes and resolvable numeric sources',()=>{
  for(const[i,path]of[
    'dist/posts/asml-seconde-vie-financiere-machines-puces/index.html',
    'dist/en/analysis/asml-earnings-engine-installed-base/index.html'
  ].entries()){
    const lang=i?'en':'fr';
    const all=walk(parse(readFileSync(new URL('../'+path,import.meta.url),'utf8')));
    const figures=all.filter(n=>n.tagName==='figure'&&(attrs(n).class??'').split(' ').includes('asml-figure'));
    assert.equal(figures.length,6);
    const ids=all.map(n=>attrs(n).id).filter(Boolean);assert.equal(ids.length,new Set(ids).size);
    for(const[j,figure]of figures.entries()){
      assert.equal(attrs(figure)['data-kind'],ASML_FIGURE_IDS[j]);assert.equal(attrs(figure).id,'figure-'+ASML_FIGURE_IDS[j]);
      const children=walk(figure),svgs=children.filter(n=>n.tagName==='svg');assert.equal(svgs.length,2);
      for(const[k,svg]of svgs.entries()){
        const raw=serializeOuter(svg);
        const scene=asmlInstalledBaseScenes().find(s=>s.lang===lang&&s.kind===ASML_FIGURE_IDS[j]&&s.mobile===Boolean(k));
        assertAsmlInstalledBaseGeometry(raw);assert.equal(normalized(raw),normalized(scene.svg));
      }
      const refs=children.filter(n=>n.tagName==='a'&&(attrs(n).href??'').startsWith('#source-')).map(n=>attrs(n).href);
      assert.deepEqual(refs,ASML_FIGURE_SOURCES[j].map(id=>'#source-'+id));
      for(const ref of refs)assert.equal(all.filter(n=>attrs(n).id===ref.slice(1)).length,1);
      assert.equal(children.filter(n=>n.tagName==='figcaption').length,1);assert.equal(children.filter(n=>n.tagName==='summary').length,1);
    }
  }
});
