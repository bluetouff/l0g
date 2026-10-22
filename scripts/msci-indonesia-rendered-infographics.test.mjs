import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';
import {parse,serializeOuter} from 'parse5';
import {MSCI_INDONESIA_KINDS} from '../src/lib/msciIndonesiaFigures.mjs';
import {msciIndonesiaSourceFigures,assertMsciIndonesiaRenderedFaithful,assertMsciIndonesiaProportions,assertMsciIndonesiaArticleReferences} from './msci-indonesia-svg-assertions.mjs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const pages=[['fr','posts/msci-indonesie-flottant-risque-indices'],['en','en/analysis/msci-indonesia-free-float-index-risk']].map(([lang,path])=>({lang,html:read('dist/'+path+'/index.html'),originals:msciIndonesiaSourceFigures(lang)}));
const all=n=>[n,...(n.childNodes??[]).flatMap(all)],attrs=n=>Object.fromEntries((n.attrs??[]).map(a=>[a.name,a.value]));
function assertPage(html,lang,originals){
 const tree=parse(html),nodes=all(tree),figures=nodes.filter(n=>n.tagName==='figure'&&(attrs(n).class??'').split(' ').includes('msci-indonesia-figure'));assert.equal(figures.length,5);assertMsciIndonesiaArticleReferences(html);
 const ids=nodes.map(n=>attrs(n).id).filter(Boolean);assert.equal(ids.length,new Set(ids).size,'Compiled page has no duplicate IDs');
 for(const[i,figure]of figures.entries()){
  assert.equal(attrs(figure).id,'figure-'+(i+1));assert.equal(attrs(figure)['data-kind'],MSCI_INDONESIA_KINDS[i]);assert.equal(attrs(figure)['data-figure'],String(i+1).padStart(2,'0'));
  const descendants=all(figure),svg=descendants.filter(n=>n.tagName==='svg');assert.equal(svg.length,2);
  for(const[variant,node]of svg.entries()){assertMsciIndonesiaRenderedFaithful(serializeOuter(node),originals[i*2+variant],lang,i*2+variant);assertMsciIndonesiaProportions(serializeOuter(node));}
  for(const cls of['msci-indonesia-panel','msci-indonesia-desktop','msci-indonesia-mobile'])assert.equal(descendants.filter(n=>n.tagName==='div'&&(attrs(n).class??'').split(' ').includes(cls)).length,1);
  assert.equal(descendants.filter(n=>n.tagName==='figcaption').length,1);assert.equal(descendants.filter(n=>n.tagName==='details').length,1);assert.equal(descendants.filter(n=>n.tagName==='summary').length,1);
 }
 assert.equal(nodes.filter(n=>n.tagName==='section'&&(attrs(n).class??'').split(' ').includes('method')).length,1);
}
function mutateFigure(html,change){const tree=parse(html,{sourceCodeLocationInfo:true}),fig=all(tree).find(n=>n.tagName==='figure'&&(attrs(n).class??'').split(' ').includes('msci-indonesia-figure'));assert.ok(fig);const svg=all(fig).find(n=>n.tagName==='svg');const {startOffset,endOffset}=svg.sourceCodeLocation,source=html.slice(startOffset,endOffset),changed=change(source);assert.notEqual(changed,source,'Regression changes the intended article SVG');return html.slice(0,startOffset)+changed+html.slice(endOffset);}
function mutateSourceEntry(html){const node=all(parse(html,{sourceCodeLocationInfo:true})).find(n=>n.tagName==='li'&&attrs(n).id==='source-s01');assert.ok(node);const{startOffset,endOffset}=node.sourceCodeLocation;return html.slice(0,startOffset)+'<li id="source-s01"></li>'+html.slice(endOffset);}

test('both compiled existing URLs retain 20 complete compact native scenes, five methods and 19 common bibliographic sources',()=>{for(const page of pages)assertPage(page.html,page.lang,page.originals);});

test('compiled geometry, labels, roots, variants, source metadata and ETF relationships reject targeted regressions',()=>{
 const page=pages[0];
 for(const[label,change]of[
  ['visible or accessible label',h=>mutateFigure(h,s=>s.replaceAll('Le flottant suit la propriété réelle','Titre changé'))],
  ['coordinate',h=>mutateFigure(h,s=>s.replace('x="24" y="255"','x="25" y="255"'))],
  ['viewBox',h=>mutateFigure(h,s=>s.replace('viewBox="0 0 1000 800"','viewBox="0 0 1000 801"'))],
  ['fixed root width',h=>mutateFigure(h,s=>s.replace('style="width:100%;height:auto"','style="width:1100px;height:auto"'))],
  ['missing root sizing',h=>mutateFigure(h,s=>s.replace(' style="width:100%;height:auto"',''))],
  ['arrow paint',h=>mutateFigure(h,s=>s.replace('marker-end="url(#msci-fr-f1-d-signal-arrow)"','marker-end="url(#missing)"'))],
  ['mobile wrapper',h=>h.replace('class="msci-indonesia-mobile"','class="removed-variant"')],
  ['wrong citation',h=>h.replace('href="#source-s05"','href="#source-s99"')],
  ['empty source',mutateSourceEntry],
 ]){const changed=change(page.html);assert.notEqual(changed,page.html,label+': regression must mutate HTML');assert.throws(()=>assertPage(changed,page.lang,page.originals),label+': regression must be rejected');}
});
