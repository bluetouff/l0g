import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {parse,parseFragment,serializeOuter} from 'parse5';
const component=readFileSync(new URL('../src/components/AmazonAuctionFigure.astro',import.meta.url),'utf8'),start=component.indexOf('const art = ')+'const art = '.length,art=JSON.parse(component.slice(start,component.indexOf(' as const;',start)));
const walk=n=>[n,...(n.childNodes??[]).flatMap(walk)],attrs=n=>Object.fromEntries((n.attrs??[]).map(a=>[a.name,a.value]));
const normalized=s=>serializeOuter(parseFragment(s).childNodes.find(n=>n.tagName==='svg'));
test('compiled FR/EN articles retain all twelve reviewed scenes, source targets and method disclosures',()=>{
 for(const[lang,route]of[['fr','posts/amazon-ads-prix-du-clic'],['en','en/analysis/amazon-ads-price-of-a-click']]){const dom=walk(parse(readFileSync(new URL('../dist/'+route+'/index.html',import.meta.url),'utf8'))),figures=dom.filter(n=>n.tagName==='figure'&&(attrs(n).class??'').split(' ').includes('amazon-auction-figure'));assert.equal(figures.length,3);
  for(const[i,kind]of['auction','incrementality','revenue'].entries()){const figure=figures[i],all=walk(figure);assert.equal(attrs(figure)['data-kind'],kind);assert.equal(attrs(figure).id,'figure-0'+(i+1));const svgs=all.filter(n=>n.tagName==='svg');assert.equal(svgs.length,2);for(const[j,mode]of['desktop','mobile'].entries()){assert.equal(normalized(serializeOuter(svgs[j])),normalized(art[lang][kind][mode]));assert.doesNotMatch(serializeOuter(svgs[j]),/<script|onload|foreignObject|href=/iu);}for(const tag of['figcaption','details','summary'])assert.equal(all.filter(n=>n.tagName===tag).length,1);const refs=all.filter(n=>n.tagName==='a'&&(attrs(n).href??'').startsWith('#source-')).map(n=>attrs(n).href);assert.ok(refs.length>=2);for(const ref of refs)assert.equal(dom.filter(n=>attrs(n).id===ref.slice(1)).length,1);if(kind!=='revenue')assert.match(all.filter(n=>n.tagName==='figcaption').map(n=>n.childNodes.map(x=>x.value??'').join('')).join(' '),lang==='fr'?/fictif|hypothèses/i:/illustrative|assumption/i);}
 }
});
