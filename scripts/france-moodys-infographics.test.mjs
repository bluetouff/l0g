import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import test from 'node:test';
import {franceMoodysFigureReferences} from '../src/lib/franceMoodysFigures.mjs';
import {FRANCE_MOODYS_KINDS, FRANCE_MOODYS_SOURCES, franceMoodysScenes, inspectFranceMoodysSvg, assertFranceMoodysGeometry, tag, attrs, content} from './france-moodys-svg-assertions.mjs';
import {pathPoints} from './insurance-returns-svg-assertions.mjs';
import {assertFontLicenseReferences} from './font-license-assertions.mjs';
const read=p=>readFileSync(new URL(`../${p}`,import.meta.url),'utf8');
const labels=svg=>inspectFranceMoodysSvg(svg).all.filter(n=>tag(n)==='text').map(content).join(' ');
test('thirty-six complete scenes retain responsive readable figures, intended panels and painted arrow bounds',()=>{
 const scenes=franceMoodysScenes();assert.equal(scenes.length,36);
 for(const s of scenes){assertFranceMoodysGeometry(s.svg);const all=inspectFranceMoodysSvg(s.svg).all;assert.doesNotMatch(content(all.find(n=>tag(n)==='title')),/\bce (?:que|qui|qu[’'])|\bwhat\b|horlog|clock/iu);assert.doesNotMatch(s.svg,/<defs|<pattern|<g\b|transform=|#[0-9a-f]{3,8}\b/iu);
  if(s.kind==='rates'){assert.equal(all.filter(n=>tag(n)==='circle').length,18);assert.equal(pathPoints(attrs(all.find(n=>tag(n)==='path')).d).length,16);assert.match(labels(s.svg),s.lang==='fr'?/5,05 %/u:/5\.05 ?%/u);}
  if(s.kind==='holders'){assert.equal(all.filter(n=>tag(n)==='circle').length,16);assert.equal(pathPoints(attrs(all.find(n=>tag(n)==='path')).d).length,15);}
  if(s.kind==='contract'&&!s.mobile)assert.equal(all.filter(n=>tag(n)==='circle').length,12);
  if(s.kind==='cohort'){const cells=all.filter(n=>tag(n)==='rect'&&Number(attrs(n).width)===(s.mobile?28:33));assert.equal(cells.length,100);assert.equal(cells.filter(n=>attrs(n).fill==='var(--color-amber)').length,83);assert.equal(cells.filter(n=>attrs(n).fill==='var(--color-surface)').length,17);}
  if(s.kind==='incentives')assert.equal(all.filter(n=>tag(n)==='path').length,4,'All three forward relations and the return funding relation retain their arrow artwork');
 }
 assert.ok(22*500/1000>=11);assert.ok(17*280/420>11);assert.ok(650*768/1000<500);
});
test('budget vintages, funding arithmetic, coupons, stock totals and observations remain explicit',()=>{
 for(const s of franceMoodysScenes()){const value=labels(s.svg),sep=s.lang==='fr'?',':'.';
  if(s.kind==='budget'){for(const x of['59','62','72'])assert.ok(value.includes(x+sep));assert.match(value,s.lang==='fr'?/scénario AFT.*(?:29\/09\/2026|29 septembre 2026)/iu:/AFT scenario.*(?:September 29, 2026|Sep 29, 2026)/u);}
  if(s.kind==='funding')for(const x of['189','156','339'])assert.ok(value.includes(x+sep));
  if(s.kind==='contract'&&!s.mobile)assert.match(value,s.lang==='fr'?/Coupon annuel pour 100 € de nominal/u:/Annual coupon for €100 face value/u);
  if(s.kind==='contract')for(const x of['67','1','5'])assert.ok(value.includes(x+sep));
  if(s.kind==='maturities')assert.ok(value.includes('187'+sep+'666'));
  if(s.kind==='holders')for(const x of['49'+sep+'82','59'+sep+'66','9'+sep+'84'])assert.ok(value.includes(x));
 }
 assert.equal((189.2+156.4+.6-6.5).toFixed(1),'339.7');assert.equal((72.9-62.6).toFixed(1),'10.3');assert.equal((59.66-49.82).toFixed(2),'9.84');
});
test('exact source contracts, complete path syntax and passive SVG parsing reject boundary failures',()=>{
 for(let i=0;i<FRANCE_MOODYS_KINDS.length;i++)assert.deepEqual(franceMoodysFigureReferences('fr',FRANCE_MOODYS_KINDS[i],String(i+1).padStart(2,'0'),FRANCE_MOODYS_SOURCES[i],'Caption'),FRANCE_MOODYS_SOURCES[i].split(' '));
 for(const lang of[undefined,null,{},new String('fr'),'__proto__'])assert.throws(()=>franceMoodysFigureReferences(lang,'rates','01','S04 S05','Caption'));
 for(const sources of['','S04 S04','S05 S04','S04 S05 S26','S04 S99','04 05'])assert.throws(()=>franceMoodysFigureReferences('fr','rates','01',sources,'Caption'));
 const svg=franceMoodysScenes().find(s=>s.lang==='fr'&&s.kind==='contract'&&s.mobile).svg;
 for(const change of[s=>s.replace('</svg>','<script>alert(1)</script></svg>'),s=>s.replace('<svg ','<svg onload="x" '),s=>s.replace('</svg>','<image href="https://example.com/x"/></svg>'),s=>s.replace('var(--color-paper)','#11273e'),s=>s.replace('font-family="l0g France Ratings"','font-family="Arial"')])assert.throws(()=>inspectFranceMoodysSvg(change(svg)));
 for(const change of[s=>s.replace('x="50" y="335"','x="300" y="335"'),s=>s.replace('>67,10 €<','>67,10 € ET UNE LONGUE PHRASE HORS DU PANNEAU<'),s=>s.replace('M 206.16 410.98','M 500 410.98'),s=>s.replace('data-panel="fdm-fr-contract-m-card-1"','data-panel="fdm-fr-contract-m-mechanism"')]){const bad=change(svg);assert.notEqual(bad,svg);assert.throws(()=>assertFranceMoodysGeometry(bad));}
 const contract=franceMoodysScenes().find(s=>s.lang==='fr'&&s.kind==='contract'&&!s.mobile).svg;assert.throws(()=>assertFranceMoodysGeometry(contract.replace('>12 coupons à verser<','>12 coupons restant à verser<')));const maturity=franceMoodysScenes().find(s=>s.lang==='fr'&&s.kind==='maturities'&&!s.mobile).svg;assert.throws(()=>assertFranceMoodysGeometry(maturity.replace('>Réel : 1,85 %<','>Coupon 1,85 % réel<')));
 for(const d of['M 0 0 L 3 4 trailing','M 0 0 Q 1 1 2 2','M 0 0 L Infinity 4','M 0 0 L 3','L 0 0','M 0 0 M 3 4'])assert.throws(()=>pathPoints(d));
});
test('existing licensed local fonts and scoped article rules preserve chart proportions and heading words',()=>{
 const component=read('src/components/FranceMoodysFigure.astro');for(const[w,digest]of[[400,'98f2d74db16bb5f41f74adf6d899aeec92861682cccc58bfdbe4d9d7d0a5ae11'],[700,'21a0350a4ac2a9f22b6a7a8dcaf6abb08c8b546d06499301f1fcf10996fd0df5']]){const p=`public/fonts/stablecoins/dejavu-sans-${w}.ttf`;assert.equal(createHash('sha256').update(readFileSync(new URL(`../${p}`,import.meta.url))).digest('hex'),digest);assert.ok(component.includes(p.replace('public','')));}
 assertFontLicenseReferences(read('public/fonts/stablecoins/LICENSE.txt'),'dejavu');assert.match(component,/max-width:\s*48rem/u);assert.match(component,/max-width:\s*26rem/u);assert.match(component,/@container\s*\(max-width:\s*500px\)/u);assert.match(component,/padding-bottom:\s*1rem/u);assert.match(component,/:global\(article:has\(\.france-moodys-figure\) \.post-title\)\s*\{\s*hyphens:\s*none/u);assert.doesNotMatch(component,/overflow\s*:\s*(?:hidden|clip)|filter\s*:|client:|<script|fetch\(|@media\s*\(max-width:/iu);
});
