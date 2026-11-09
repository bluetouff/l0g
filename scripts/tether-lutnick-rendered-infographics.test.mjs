import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {parse,parseFragment,serializeOuter} from 'parse5';
const component=readFileSync(new URL('../src/components/TetherLutnickFigure.astro',import.meta.url),'utf8'),start=component.indexOf('const art = ')+'const art = '.length,art=JSON.parse(component.slice(start,component.indexOf(' as const;',start)));
const walk=n=>[n,...(n.childNodes??[]).flatMap(walk)],attrs=n=>Object.fromEntries((n.attrs??[]).map(a=>[a.name,a.value]));
const normalized=s=>serializeOuter(parseFragment(s).childNodes.find(n=>n.tagName==='svg'));
const text=n=>n.nodeName==='#text'?n.value:(n.childNodes??[]).map(text).join('');
const expectedSources={relations:['#source-s01','#source-s02','#source-s05'],reserves:['#source-s11','#source-s12'],denominator:['#source-s15','#source-s16']};
test('compiled FR/EN articles retain all twelve reviewed scenes, real source targets and method disclosures',()=>{
 for(const[lang,route]of[['fr','posts/lutnick-tether-credit-cession-familiale'],['en','en/analysis/lutnick-tether-family-trust-cantor-sale']]){const dom=walk(parse(readFileSync(new URL('../dist/'+route+'/index.html',import.meta.url),'utf8'))),figures=dom.filter(n=>n.tagName==='figure'&&(attrs(n).class??'').split(' ').includes('tether-lutnick-figure'));assert.equal(figures.length,3);
  for(const[i,kind]of['relations','reserves','denominator'].entries()){const figure=figures[i],all=walk(figure);assert.equal(attrs(figure)['data-kind'],kind);assert.equal(attrs(figure).id,'figure-0'+(i+1));const svgs=all.filter(n=>n.tagName==='svg');assert.equal(svgs.length,2);for(const[j,mode]of['desktop','mobile'].entries()){assert.equal(normalized(serializeOuter(svgs[j])),normalized(art[lang][kind][mode]));assert.doesNotMatch(serializeOuter(svgs[j]),/<script|onload|foreignObject|href=/iu);}for(const tag of['figcaption','details','summary'])assert.equal(all.filter(n=>n.tagName===tag).length,1);const refs=all.filter(n=>n.tagName==='a').map(n=>attrs(n).href);assert.deepEqual(refs,expectedSources[kind]);for(const ref of refs)assert.equal(dom.filter(n=>attrs(n).id===ref.slice(1)).length,1);const details=text(all.find(n=>n.tagName==='details'));assert.ok(details.length>100);assert.match(details,kind==='relations'?(lang==='fr'?/avril 2024/:/April 2024/):kind==='reserves'?/191451091374/:/846/);if(kind==='relations')assert.match(details,lang==='fr'?/rapportés par Bloomberg/:/reported by Bloomberg/);if(kind==='denominator')assert.match(details,lang==='fr'?/adresses additionnelles.*hors de cet agrégat/:/Additional addresses.*outside this aggregate/);}
  const ids=dom.map(n=>attrs(n).id).filter(Boolean);assert.equal(ids.length,new Set(ids).size);
 }
});
