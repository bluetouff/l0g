import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { parse, parseFragment, serializeOuter } from 'parse5';
import { CLOUDFLARE_CONTENT_FIGURE_IDS, CLOUDFLARE_CONTENT_FIGURE_SOURCES, cloudflareContentScenes, assertCloudflareContentGeometry } from './cloudflare-content-svg-assertions.mjs';
const walk=n=>[n,...(n.childNodes??[]).flatMap(walk)];
const attrs=n=>Object.fromEntries((n.attrs??[]).map(a=>[a.name,a.value]));
const normalized=s=>serializeOuter(parseFragment(s).childNodes.find(n=>n.tagName==='svg'));

test('compiled FR/EN articles retain24exact passive Cloudflare vector scenes and resolvable numeric sources',()=>{
  for(const[i,path]of[
    'dist/posts/cloudflare-contenus-ia-compteur-paiement/index.html',
    'dist/en/analysis/cloudflare-ai-content-payments-usage-count/index.html'
  ].entries()){
    const lang=i?'en':'fr';
    const all=walk(parse(readFileSync(new URL('../'+path,import.meta.url),'utf8')));
    const figures=all.filter(n=>n.tagName==='figure'&&(attrs(n).class??'').split(' ').includes('cloudflare-content-figure'));
    assert.equal(figures.length,6);
    const ids=all.map(n=>attrs(n).id).filter(Boolean);assert.equal(ids.length,new Set(ids).size);
    for(const[j,figure]of figures.entries()){
      assert.equal(attrs(figure)['data-kind'],CLOUDFLARE_CONTENT_FIGURE_IDS[j]);assert.equal(attrs(figure).id,'figure-'+CLOUDFLARE_CONTENT_FIGURE_IDS[j]);
      const children=walk(figure),svgs=children.filter(n=>n.tagName==='svg');assert.equal(svgs.length,2);
      for(const[k,svg]of svgs.entries()){
        const raw=serializeOuter(svg);
        const scene=cloudflareContentScenes().find(s=>s.lang===lang&&s.kind===CLOUDFLARE_CONTENT_FIGURE_IDS[j]&&s.mobile===Boolean(k));
        assertCloudflareContentGeometry(raw);assert.equal(normalized(raw),normalized(scene.svg));
      }
      const refs=children.filter(n=>n.tagName==='a'&&(attrs(n).href??'').startsWith('#source-')).map(n=>attrs(n).href);
      assert.deepEqual(refs,CLOUDFLARE_CONTENT_FIGURE_SOURCES[j].map(id=>'#source-'+id));
      for(const ref of refs)assert.equal(all.filter(n=>attrs(n).id===ref.slice(1)).length,1);
      assert.equal(children.filter(n=>n.tagName==='figcaption').length,1);assert.equal(children.filter(n=>n.tagName==='summary').length,1);
    }
  }
});
