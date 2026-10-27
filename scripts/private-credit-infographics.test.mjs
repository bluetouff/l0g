import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import test from 'node:test';
import {privateCreditFigureReferences} from '../src/lib/privateCreditFigures.mjs';
import {PRIVATE_CREDIT_KINDS,PRIVATE_CREDIT_SOURCES,privateCreditScenes,inspectPrivateCreditSvg,assertPrivateCreditGeometry,tag,attrs,content} from './private-credit-svg-assertions.mjs';
import {pathPoints} from './insurance-returns-svg-assertions.mjs';
import {assertFontLicenseReferences} from './font-license-assertions.mjs';
const read=p=>readFileSync(new URL(`../${p}`,import.meta.url),'utf8');
const close=(a,b)=>assert.ok(Math.abs(Number(a)-b)<.000002,`${a} matches ${b}`);
test('twenty passive bilingual scenes preserve the legal chain, fictional waterfall and three separate measurement bases',()=>{
 const scenes=privateCreditScenes();assert.equal(scenes.length,20);
 for(const s of scenes){assertPrivateCreditGeometry(s.svg);const{all}=inspectPrivateCreditSvg(s.svg),labels=all.filter(n=>tag(n)==='text').map(content).join(' '),paths=all.filter(n=>tag(n)==='path'),id=needle=>all.find(n=>attrs(n).id?.endsWith(needle));
  assert.doesNotMatch(content(all.find(n=>tag(n)==='title')),/\bce (?:que|qui|qu[’'])|\bwhat\b|horlog|clock/iu);assert.doesNotMatch(s.svg,/<defs|<pattern|<g\b|transform=|#[0-9a-f]{3,8}\b|—/iu);
  if(s.kind==='structure'){assert.equal(all.filter(n=>tag(n)==='rect'&&attrs(n).id?.includes('-card-step-')).length,3);assert.match(labels,s.lang==='fr'?/FONDS MAÎTRE/u:/MASTER FUND/u);assert.match(labels,s.lang==='fr'?/parts du fonds|Parts du fonds/u:/fund units|Fund units/u);assert.match(labels,s.lang==='fr'?/service de la dette/u:/debt service/u);assert.match(labels,s.lang==='fr'?/Notes senior/u:/Senior notes/u);assert.match(labels,s.lang==='fr'?/Notes junior/u:/Junior notes/u);assert.ok(paths.some(n=>attrs(n).stroke==='var(--color-accent)'&&attrs(n)['stroke-dasharray']),'Distinct subscription path');assert.match(labels,s.lang==='fr'?/sans échelle/u:/not to scale/u);}
  if(s.kind==='losses'){const scale=(s.mobile?320:660)/100;for(const[i,vs]of[[60,20,20],[60,20,10],[60,15,0],[50,0,0]].entries())for(const[j,v]of vs.entries())if(v)close(attrs(id(`-bar-${i}-${j}`)).width,scale*v);for(const[i,v]of[[1,10],[2,25],[3,50]])close(attrs(id('-bar-loss-'+i)).width,scale*v);assert.match(labels,/100/);assert.match(labels,/60 \+ 15 \+ 0 = 75/u);assert.match(labels,s.lang==='fr'?/fictif/u:/Fictional/u);assert.match(labels,/Partners Group/u);assert.match(labels,/20/);assert.match(labels,/40/);}
  if(s.kind==='capital'){for(const[i,v]of[.158,1.016,1.523,2.168,4.537].entries())close(attrs(id('-bar-'+i)).width,(s.mobile?320:640)*v/5);assert.match(labels,/SSAP 26/u);assert.match(labels,/SVO/u);assert.match(labels,/Life \/ Fraternal/u);assert.match(labels,s.lang==='fr'?/avant fiscalité/u:/Pre-tax/u);assert.match(labels,/2026/u);assert.match(labels,/CLO\/CBO\/CDO/u);assert.match(labels,/1[,.]523/u);assert.match(labels,/Partners Group/u);}
  if(s.kind==='liquidity'){assert.equal(all.filter(n=>tag(n)==='rect'&&attrs(n).id?.includes('-card-measure-')).length,3);assert.equal(all.filter(n=>tag(n)==='rect'&&attrs(n).id?.includes('-card-insurer-')).length,3);assert.match(labels,/NAV/u);assert.match(labels,s.lang==='fr'?/CASH REÇU/u:/CASH RECEIVED/u);assert.match(labels,s.lang==='fr'?/CASH À PAYER/u:/CASH DUE/u);assert.match(labels,s.lang==='fr'?/rembourser/u:/repayable|repay/u);assert.match(labels,s.lang==='fr'?/dates, montants et devises/u:/dates, amounts and currencies/u);}
  if(s.kind==='measurement'){for(const[i,v]of[512,32,580,44,42].entries())close(attrs(id('-bar-'+i)).width,(s.mobile?320:480)*v/600);assert.match(labels,/1[ ,]210/u);assert.match(labels,/544/u);assert.match(labels,/512 \+ 32/u);assert.match(labels,/510/u);assert.match(labels,/2025/u);assert.match(labels,/2026/u);assert.match(labels,s.lang==='fr'?/recoupements identifiables|Recoupements identifiables/u:/[Ii]dentifiable overlap/u);assert.match(labels,s.lang==='fr'?/comptable ajustée/u:/adjusted carrying value/u);}
 }
 assert.equal(512+32+580+44+42,1210);assert.equal(512+32,544);assert.ok(22*501/1000>=11);assert.ok(17*280/420>=11);assert.ok(650*768/1000<500);
});
test('fictional terminal-cash waterfall conserves cash and allocates losses at each attachment point',()=>{
 for(let loss=0;loss<=100;loss++){const cash=100-loss,senior=Math.min(60,cash),junior=Math.min(20,Math.max(0,cash-60)),equity=Math.max(0,cash-80);assert.equal(senior+junior+equity,cash);assert.equal((60-senior)+(20-junior)+(20-equity),loss);assert.ok(senior>=0&&senior<=60&&junior>=0&&junior<=20&&equity>=0&&equity<=20);if(loss<=20)assert.equal(junior,20);if(loss<=40)assert.equal(senior,60);}
 assert.deepEqual([10,25,50].map(l=>{const c=100-l;return[Math.min(60,c),Math.min(20,Math.max(0,c-60)),Math.max(0,c-80)];}),[[60,20,10],[60,15,0],[50,0,0]]);close(100000000*.01523,1523000);
});
test('closed figure and citation contracts reject wrong order, duplicates and nonprimitive input',()=>{
 for(let i=0;i<PRIVATE_CREDIT_KINDS.length;i++)for(const lang of['fr','en'])assert.deepEqual(privateCreditFigureReferences(lang,PRIVATE_CREDIT_KINDS[i],String(i+1).padStart(2,'0'),PRIVATE_CREDIT_SOURCES[i],'Caption'),PRIVATE_CREDIT_SOURCES[i].split(' '));
 for(const lang of[undefined,null,{},new String('fr'),'__proto__'])assert.throws(()=>privateCreditFigureReferences(lang,'structure','01','03 04','Caption'));
 for(const src of['','03','03 03','03 18','04 03'])assert.throws(()=>privateCreditFigureReferences('fr','structure','01',src,'Caption'));
 assert.throws(()=>privateCreditFigureReferences('fr','structure','02','03 04','Caption'));assert.throws(()=>privateCreditFigureReferences('fr','structure','01','03 04',' '));
});
test('allowlisted XML and actual glyph geometry reject injection, malformed paths, missing glyphs and wrong panel ownership',()=>{
 const svg=privateCreditScenes().find(s=>s.lang==='fr'&&s.kind==='structure'&&s.mobile).svg;
 for(const change of[s=>s.replace('</svg>','<script>alert(1)</script></svg>'),s=>s.replace('<svg ','<svg onload="x" '),s=>s.replace('</svg>','<image href="https://example.com/x"/></svg>'),s=>s.replace('var(--color-ink)','#11273e'),s=>s.replace('font-family="l0g Private Credit"','font-family="Arial"'),s=>s.replace('font-size="17"','font-size="10"'),s=>s.replace('<rect ','<rect opacity="0" ')]){const bad=change(svg);assert.notEqual(bad,svg);assert.throws(()=>inspectPrivateCreditSvg(bad));}
 for(const change of[s=>s.replace('>FEEDER<','>💥<'),s=>s.replace('>FEEDER<','>UN TITRE EXTRAORDINAIREMENT LONG QUI DÉBORDE DU CADRE<'),s=>s.replace('data-panel="credit-fr-structure-m-card-step-0"','data-panel="credit-fr-structure-m-card-step-2"'),s=>s.replace('x="95" y="219"','x="400" y="219"')]){const bad=change(svg);assert.notEqual(bad,svg);assert.throws(()=>assertPrivateCreditGeometry(bad));}
 for(const d of['M 0 0 L 3 4 trailing','M 0 0 Q 1 1 2 2','M 0 0 L Infinity 4','M 0 0 L 3','L 0 0','M 0 0 M 3 4'])assert.throws(()=>pathPoints(d));
});
test('licensed glyph-complete fonts and scoped styles preserve themes and compact responsive proportions',()=>{
 const component=read('src/components/PrivateCreditFigure.astro');for(const w of[400,700]){const p=`public/fonts/private-credit/dejavu-sans-${w}.ttf`;assert.ok(readFileSync(new URL(`../${p}`,import.meta.url)).length<60000);assert.ok(component.includes(p.replace('public','')));assert.match(createHash('sha256').update(readFileSync(new URL(`../${p}`,import.meta.url))).digest('hex'),/^[a-f0-9]{64}$/u);}
 assertFontLicenseReferences(read('public/fonts/private-credit/LICENSE.txt'),'dejavu');assert.match(component,/max-width:\s*48rem/u);assert.match(component,/max-width:\s*26rem/u);assert.match(component,/@container\s*\(max-width:\s*500px\)/u);assert.match(component,/padding-bottom:\s*1rem/u);assert.match(component,/:global\(article:has\(\.private-credit-figure\) \.post-title\)\s*\{\s*hyphens:\s*none/u);assert.doesNotMatch(component,/overflow\s*:\s*(?:hidden|clip)|filter\s*:|client:|<script|fetch\(|@media\s*\(max-width:/iu);
});
