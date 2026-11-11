import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {parse,parseFragment,serializeOuter} from 'parse5';
const component=readFileSync(new URL('../src/components/NvidiaInfluenceFigure.astro',import.meta.url),'utf8'),start=component.indexOf('const art = ')+'const art = '.length,art=JSON.parse(component.slice(start,component.indexOf(' as const;',start)));
const walk=n=>[n,...(n.childNodes??[]).flatMap(walk)],attrs=n=>Object.fromEntries((n.attrs??[]).map(a=>[a.name,a.value]));
const normalized=s=>serializeOuter(parseFragment(s).childNodes.find(n=>n.tagName==='svg'));
const text=n=>n.nodeName==='#text'?n.value:(n.childNodes??[]).map(text).join('');
const expectedSources={access:['#source-s10','#source-s11'],finance:['#source-s13']};
function articleRoute(lang){const collection=lang==='fr'?'posts':'posts-en',dir=new URL('../src/content/'+collection+'/',import.meta.url),files=readdirSync(dir).filter(name=>name.endsWith('.mdx')&&readFileSync(new URL(name,dir),'utf8').includes('import NvidiaInfluenceFigure from'));assert.equal(files.length,1,'One article per language owns this dedicated figure');return(lang==='fr'?'posts/':'en/analysis/')+files[0].replace(/\.mdx$/u,'');}
test('compiled bilingual pages preserve all reviewed geometry, source anchors and disclosures',()=>{
 for(const lang of ['fr','en']){const route=articleRoute(lang),dom=walk(parse(readFileSync(new URL('../dist/'+route+'/index.html',import.meta.url),'utf8'))),figures=dom.filter(n=>n.tagName==='figure'&&(attrs(n).class??'').split(' ').includes('nvidia-influence-figure'));assert.equal(figures.length,2);
 for(const [i,kind] of ['access','finance'].entries()){const f=figures[i],all=walk(f);assert.equal(attrs(f).id,'figure-0'+(i+1));assert.equal(attrs(f)['data-kind'],kind);const svgs=all.filter(n=>n.tagName==='svg');assert.equal(svgs.length,2);for(const [j,mode] of ['desktop','mobile'].entries())assert.equal(normalized(serializeOuter(svgs[j])),normalized(art[lang][kind][mode]));assert.deepEqual(all.filter(n=>n.tagName==='a').map(n=>attrs(n).href),expectedSources[kind]);for(const ref of expectedSources[kind])assert.equal(dom.filter(n=>attrs(n).id===ref.slice(1)).length,1);for(const tag of ['figcaption','details','summary'])assert.equal(all.filter(n=>n.tagName===tag).length,1);assert.ok(text(all.find(n=>n.tagName==='details')).length>100);}
 const ids=dom.map(n=>attrs(n).id).filter(Boolean);assert.equal(ids.length,new Set(ids).size);
 }
});
