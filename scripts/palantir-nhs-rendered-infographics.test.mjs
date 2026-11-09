import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {parse,parseFragment,serializeOuter} from 'parse5';
const component=readFileSync(new URL('../src/components/PalantirNhsFigure.astro',import.meta.url),'utf8'),start=component.indexOf('const art = ')+'const art = '.length,art=JSON.parse(component.slice(start,component.indexOf(' as const;',start)));
const walk=n=>[n,...(n.childNodes??[]).flatMap(walk)],attrs=n=>Object.fromEntries((n.attrs??[]).map(a=>[a.name,a.value]));
const normalized=s=>serializeOuter(parseFragment(s).childNodes.find(n=>n.tagName==='svg'));
const text=n=>n.nodeName==='#text'?n.value:(n.childNodes??[]).map(text).join('');
const expectedSources={architecture:['#source-s02','#source-s12','#source-s25'],access:['#source-s11','#source-s14','#source-s13'],exit:['#source-s07']};
function articleRoute(lang){const collection=lang==='fr'?'posts':'posts-en',dir=new URL('../src/content/'+collection+'/',import.meta.url),files=readdirSync(dir).filter(name=>name.endsWith('.mdx')&&readFileSync(new URL(name,dir),'utf8').includes('import PalantirNhsFigure from'));assert.equal(files.length,1,'One article per language owns this dedicated figure');return(lang==='fr'?'posts/':'en/analysis/')+files[0].replace(/\.mdx$/u,'');}
test('compiled FR/EN articles retain all twelve reviewed scenes, real source targets and method disclosures',()=>{
 for(const lang of ['fr','en']){const route=articleRoute(lang),dom=walk(parse(readFileSync(new URL('../dist/'+route+'/index.html',import.meta.url),'utf8'))),figures=dom.filter(n=>n.tagName==='figure'&&(attrs(n).class??'').split(' ').includes('palantir-nhs-figure'));assert.equal(figures.length,3);
  for(const[i,kind]of['architecture','access','exit'].entries()){const figure=figures[i],all=walk(figure);assert.equal(attrs(figure)['data-kind'],kind);assert.equal(attrs(figure).id,'figure-0'+(i+1));const svgs=all.filter(n=>n.tagName==='svg');assert.equal(svgs.length,2);for(const[j,mode]of['desktop','mobile'].entries()){assert.equal(normalized(serializeOuter(svgs[j])),normalized(art[lang][kind][mode]));assert.doesNotMatch(serializeOuter(svgs[j]),/<script|onload|foreignObject|href=/iu);}for(const tag of['figcaption','details','summary'])assert.equal(all.filter(n=>n.tagName===tag).length,1);const refs=all.filter(n=>n.tagName==='a').map(n=>attrs(n).href);assert.deepEqual(refs,expectedSources[kind]);for(const ref of refs)assert.equal(dom.filter(n=>attrs(n).id===ref.slice(1)).length,1);const details=text(all.find(n=>n.tagName==='details'));assert.ok(details.length>100);assert.match(details,kind==='architecture'?/NDIT/:kind==='access'?/33/:/24/);if(kind==='access')assert.match(details,lang==='fr'?/15 juin 2026/:/June 15, 2026/);if(kind==='exit'){assert.match(details,lang==='fr'?/six mois/:/six months/);assert.match(details,/30/);}}
  const ids=dom.map(n=>attrs(n).id).filter(Boolean);assert.equal(ids.length,new Set(ids).size);
 }
});
