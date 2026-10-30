import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import test from 'node:test';
import {SMALL_PARCELS_KINDS,SMALL_PARCELS_SOURCES,smallParcelsFigureReferences} from '../src/lib/petits-colis-figures.mjs';
import {smallParcelsScenes,inspectSmallParcelsSvg,assertSmallParcelsGeometry,tag,attrs,content} from './small-parcels-svg-assertions.mjs';
import {assertFontLicenseReferences} from './font-license-assertions.mjs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const all=s=>inspectSmallParcelsSvg(s.svg).all, text=s=>all(s).filter(n=>tag(n)==='text').map(content).join(' ');
const metric=(s,key)=>{const found=all(s).filter(n=>attrs(n)['data-metric']===key);assert.equal(found.length,1);return attrs(found[0]);};
const near=(a,b)=>assert.ok(Math.abs(Number(a)-b)<.00002,`${a} differs from ${b}`);
test('twenty passive vectors retain compact responsive geometry and semantic themes',()=>{
 assert.equal(smallParcelsScenes().length,20);assert.equal(readdirSync(new URL('../src/figures/small-parcels/',import.meta.url)).length,20);
 for(const s of smallParcelsScenes()){assertSmallParcelsGeometry(s.svg);assert.equal(attrs(all(s).find(n=>tag(n)==='rect')).fill,'var(--color-ink)');assert.doesNotMatch(s.svg,/—|horlog|clock|#[0-9a-f]{3,8}\b/iu);assert.doesNotMatch(content(all(s).find(n=>tag(n)==='title')),/\bce (?:que|qui|qu[’'])|\bwhat\b/iu);for(const n of all(s).filter(n=>tag(n)==='text'))assert.ok(Number(attrs(n)['font-size'])*(s.mobile?280/420:501/1000)>=11);}
});
test('the timeline distinguishes repealed French tax, July duty and prospective November fee',()=>{
 for(const s of smallParcelsScenes().filter(s=>s.kind==='timeline')){const t=text(s);assert.match(t,s.lang==='fr'?/MARS/:/MARCH/);assert.match(t,s.lang==='fr'?/JUILLET/:/JULY/);assert.match(t,/NOVEMB/);assert.match(t,/3 € \+ 2 € = 5 €/);assert.match(t,s.lang==='fr'?/Abrogée/:/Repealed/);const d=content(all(s).find(n=>tag(n)==='desc'));assert.match(d,/2026/);assert.match(d,/150/);assert.match(d,s.lang==='fr'?/future|venir/:/yet to apply|future/i);}
});
test('objects remain distinct from assumed liable declaration lines and charge totals',()=>{
 for(const s of smallParcelsScenes().filter(s=>s.kind==='lines')){near(metric(s,'lines-0')['data-value'],1);near(metric(s,'lines-1')['data-value'],2);const t=text(s);assert.match(t,/4 /);assert.match(t,/1 T-shirt/);assert.match(t,/5 €/);assert.match(t,/10 €/);assert.match(t,s.lang==='fr'?/TVA/:/VAT/);const d=content(all(s).find(n=>tag(n)==='desc'));assert.match(d,/150/);assert.match(d,/H7/);assert.match(d,/H6/);assert.match(d,/H1/);}
 near(1*(3+2),5);near(2*(3+2),10);
});
test('EU volume bars preserve one same-vintage series and statistical item scope',()=>{
 const values=[1.39,2.44,4.67,5.88];
 for(const s of smallParcelsScenes().filter(s=>s.kind==='volumes')){for(const[i,v]of values.entries()){const bar=metric(s,'volume-'+i);near(bar['data-value'],v);near(s.mobile?bar.width:bar.height,(s.mobile?330:270)*v/6);}const t=text(s);for(const year of['2022','2023','2024','2025'])assert.match(t,new RegExp(year));assert.match(t,/0/);const d=content(all(s).find(n=>tag(n)==='desc'));assert.match(d,/2026/);assert.match(d,/1[,.]39/);assert.match(d,/5[,.]88/);assert.match(d,s.lang==='fr'?/statistiques/:/statistical/i);assert.match(d,s.lang==='fr'?/Aucun revenu fiscal|assiette fiscale/:/No tax revenue|tax base/i);}
 near((5.88/4.67-1)*100,25.910064239829);
});
test('logistics arrows keep the order-import distinction and ordinary inventory route',()=>{
 for(const s of smallParcelsScenes().filter(s=>s.kind==='logistics')){const t=text(s);assert.match(t,s.lang==='fr'?/COMMANDE AVANT IMPORTATION/:/ORDER BEFORE IMPORT/);assert.match(t,s.lang==='fr'?/IMPORTATION AVANT LA VENTE/:/IMPORT BEFORE THE SALE/);assert.match(t,s.lang==='fr'?/Stock dédouané/:/Cleared inventory/);const paths=all(s).filter(n=>tag(n)==='path').map(n=>attrs(n).d);assert.ok(paths.includes(s.mobile?'M 204 266 L 210 275 L 216 266':'M 348 269 L 357 275 L 348 281'),'Arrow tip points toward next stage');const d=content(all(s).find(n=>tag(n)==='desc'));assert.match(d,s.lang==='fr'?/régime ordinaire/:/ordinary import/i);assert.match(d,s.lang==='fr'?/sans échelle|aucun volume/:/do not encode volumes/i);}
});
test('fictional incidence keeps the fee split apart from additional VAT',()=>{
 for(const s of smallParcelsScenes().filter(s=>s.kind==='incidence')){const a=metric(s,'passed'),b=metric(s,'absorbed');near(a['data-value'],2);near(b['data-value'],2);near(Number(a.width)/Number(b.width),1);const t=text(s);assert.match(t,/24/);assert.match(t,/26[,.]40/);assert.match(t,/28[,.]80/);assert.match(t,/0[,.]40/);const d=content(all(s).find(n=>tag(n)==='desc'));assert.match(d,s.lang==='fr'?/hypothèses|Scénario choisi/:/chosen|scenario|assumed/i);assert.match(d,/20/);assert.match(d,/50/);}
 near((20+4*.5)*1.2,26.4);near(4*.5*.2,.4);near((20+4)*1.2,28.8);
});
test('the closed metadata contract rejects reference drift and unsupported language',()=>{
 for(const l of['fr','en'])for(const[i,k]of SMALL_PARCELS_KINDS.entries())assert.deepEqual(smallParcelsFigureReferences(l,k,i+1,[...SMALL_PARCELS_SOURCES[i]],'Caption','Method'),SMALL_PARCELS_SOURCES[i]);
 for(const l of[undefined,null,{},new String('fr'),'__proto__'])assert.throws(()=>smallParcelsFigureReferences(l,'timeline',1,SMALL_PARCELS_SOURCES[0],'Caption','Method'));
 for(const refs of[[],['R01'],['R01','R03','R09','R09'],['R01','R03','R09','R10" onload="x']])assert.throws(()=>smallParcelsFigureReferences('fr','timeline',1,refs,'Caption','Method'));
 assert.throws(()=>smallParcelsFigureReferences('fr','lines',2,SMALL_PARCELS_SOURCES[1],'','Method'));
});
test('passive geometry rejects scripts, external assets, label overflow and missing ownership',()=>{
 const scene=smallParcelsScenes().find(s=>s.lang==='fr'&&s.kind==='timeline'&&!s.mobile).svg;
 for(const edit of[s=>s.replace('</svg>','<script>x</script></svg>'),s=>s.replace('<svg ','<svg onload="x" '),s=>s.replace('</svg>','<image href="https://example.com/a"/></svg>'),s=>s.replace('l0g Small Parcels','Arial'),s=>s.replace('data-panel="small-parcels-fr-timeline-d-card-0"','data-panel="missing"'),s=>s.replace('x="60" y="230"','x="995" y="230"')])assert.throws(()=>assertSmallParcelsGeometry(edit(scene)));
});
test('component keeps responsive methods and the reviewed local licensed fonts',()=>{
 const c=read('src/components/PetitsColisFigure.astro');for(const weight of[400,700]){const p='public/fonts/stablecoins/dejavu-sans-'+weight+'.ttf';assert.ok(c.includes(p.replace('public','')));assert.equal(createHash('sha256').update(readFileSync(new URL('../'+p,import.meta.url))).digest('hex'),weight===400?'98f2d74db16bb5f41f74adf6d899aeec92861682cccc58bfdbe4d9d7d0a5ae11':'21a0350a4ac2a9f22b6a7a8dcaf6abb08c8b546d06499301f1fcf10996fd0df5');}
 assertFontLicenseReferences(read('public/fonts/stablecoins/LICENSE.txt'),'dejavu');assert.match(c,/@container\s*\(max-width:\s*500px\)/u);assert.match(c,/padding-bottom:\s*1rem/u);assert.doesNotMatch(c,/overflow\s*:\s*(?:hidden|clip)|client:|<script|fetch\(|incidence-colis\.html/iu);
});
