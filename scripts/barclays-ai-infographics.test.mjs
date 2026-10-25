import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import test from 'node:test';
import {barclaysAiFigureReferences} from '../src/lib/barclaysAiFigures.mjs';
import {BARCLAYS_AI_KINDS,BARCLAYS_AI_SOURCES,barclaysAiScenes,inspectBarclaysAiSvg,assertBarclaysAiGeometry,tag,attrs,content} from './barclays-ai-svg-assertions.mjs';
import {pathPoints} from './insurance-returns-svg-assertions.mjs';
import {assertFontLicenseReferences} from './font-license-assertions.mjs';
const read=p=>readFileSync(new URL(`../${p}`,import.meta.url),'utf8');
const labels=svg=>inspectBarclaysAiSvg(svg).all.filter(n=>tag(n)==='text').map(content).join(' ');
const close=(a,b)=>assert.ok(Math.abs(Number(a)-b)<.00001,`${a} matches ${b}`);
test('all twenty-eight scenes retain native glyph bounds, intended panels, chart marks and painted arrow bounds',()=>{
 const scenes=barclaysAiScenes();assert.equal(scenes.length,28);
 for(const s of scenes){assertBarclaysAiGeometry(s.svg);const {all}=inspectBarclaysAiSvg(s.svg),value=labels(s.svg);assert.doesNotMatch(content(all.find(n=>tag(n)==='title')),/\bce (?:que|qui|qu[’'])|\bwhat\b|horlog|clock/iu);assert.doesNotMatch(s.svg,/<defs|<pattern|<g\b|transform=|#[0-9a-f]{3,8}\b|—/iu);
  if(s.kind==='jobs'){const cells=all.filter(n=>tag(n)==='rect'&&Number(attrs(n).width)===(s.mobile?32:41.45));assert.equal(cells.length,100);assert.equal(cells.filter(n=>attrs(n).fill==='var(--color-signal)').length,20);assert.equal(cells.filter(n=>attrs(n).fill==='var(--color-ink)').length,80);assert.match(value,s.lang==='fr'?/60 %.*second semestre 2026.*distinct/su:/60 %.*H2 2026.*differs/su);assert.match(value,s.lang==='fr'?/Consultations requises/u:/subject to required consultations/u);}
  if(s.kind==='charges'){for(const n of ['201','300','200'])assert.ok(value.includes(n));assert.equal(all.filter(n=>tag(n)==='path').length,2,'Chronological link retains an explicit painted arrowhead');}
  if(s.kind==='ratio'){for(const[i,vals]of[[7167,4497],[7365,4560]].entries())for(const[j,n]of vals.entries()){const b=all.find(n=>attrs(n).id===`bai-${s.lang}-ratio-${s.mobile?'m':'d'}-${j?'expenses':'income'}-${i}`);assert.ok(b);close(attrs(b).width,(s.mobile?330:690)*n/8000);assert.equal(Number(attrs(b).x),s.mobile?22:80);}for(const v of s.lang==='fr'?['62,7 %','61,9 %','+2,8 %','+1,4 %']:['62.7%','61.9%','+2.8%','+1.4%'])assert.ok(value.includes(v));}
  if(s.kind==='profit'){for(const n of['198','311','23','271','19','129','245','400'])assert.ok(value.includes(n));const bars=all.filter(n=>tag(n)==='rect'&&!attrs(n).id);assert.equal(bars.length,s.mobile?6:8);const deltas=[198,-311,-23,271,-19,129];if(s.mobile)for(const[i,n]of deltas.entries()){close(attrs(bars[i]).width,Math.abs(n)*.43);close(attrs(bars[i]).x,220+Math.min(0,n)*.43);}else{const h=[2077,...deltas.map(Math.abs),2322];for(const[i,n]of h.entries())close(attrs(bars[i]).height,n*230/2500);} }
  if(s.kind==='bases'){assert.match(value,s.lang==='fr'?/rythme de sortie/u:/exit-rate base/u);assert.doesNotMatch(value,/base récurrente|recurring base/iu);const bars=all.filter(n=>tag(n)==='rect'&&!attrs(n).id);assert.equal(bars.length,4);for(const[i,n]of[18.5,18,18.4].entries()){const b=bars[i===2?3:i];close(attrs(b).width,(s.mobile?330:780)*n/20);}close(attrs(bars[2]).width,(s.mobile?330:780)*.5/20);}
  if(s.kind==='tasks'){assert.match(value,/HYPOTH[EÉ]TI[QC]|HYPOTHETICAL/u);for(const n of['100 min','80 min','90 min','10','11'])assert.ok(value.includes(n));const bars=all.filter(n=>tag(n)==='rect'&&attrs(n).id?.includes('-bar-'));assert.equal(bars.length,7);const widths=[40,60,20,60,20,60,10];for(const[i,v]of widths.entries())close(attrs(bars[i]).width,(s.mobile?350:840)*v/100);}
  if(s.kind==='evidence')assert.equal(all.filter(n=>tag(n)==='path').length,14,'Seven explicit relations preserve forward stages, comparison loop and three management choices');
 }
 assert.ok(22*501/1000>=11);assert.ok(17*280/420>11);assert.ok(650*768/1000<500);
 assert.equal(2077+198-311-23+271-19+129,2322);assert.equal((271+129),400);assert.equal((100/90-1).toFixed(3),'0.111');
});
test('source contracts reject unexpected figure requests and preserve the unsourced hypothetical example',()=>{
 for(let i=0;i<BARCLAYS_AI_KINDS.length;i++)assert.deepEqual(barclaysAiFigureReferences('fr',BARCLAYS_AI_KINDS[i],String(i+1).padStart(2,'0'),BARCLAYS_AI_SOURCES[i],'Caption'),BARCLAYS_AI_SOURCES[i]?BARCLAYS_AI_SOURCES[i].split(' '):[]);
 for(const lang of[undefined,null,{},new String('fr'),'__proto__'])assert.throws(()=>barclaysAiFigureReferences(lang,'jobs','01','S02 S15 S17','Caption'));
 for(const src of['','S02','S02 S02','S15 S02 S17','S02 S15 S17 S18','02 15 17'])assert.throws(()=>barclaysAiFigureReferences('fr','jobs','01',src,'Caption'));
 assert.throws(()=>barclaysAiFigureReferences('en','tasks','06','S01','Hypothetical'));assert.throws(()=>barclaysAiFigureReferences('fr','jobs','02','S02 S15 S17','Caption'));assert.throws(()=>barclaysAiFigureReferences('fr','jobs','01','S02 S15 S17',' '));
});
test('passive SVG contracts and glyph geometry reject executable content, hidden marks, overflow and incorrect panel ownership',()=>{
 const svg=barclaysAiScenes().find(s=>s.lang==='fr'&&s.kind==='jobs'&&s.mobile).svg;
 for(const change of[s=>s.replace('</svg>','<script>alert(1)</script></svg>'),s=>s.replace('<svg ','<svg onload="x" '),s=>s.replace('</svg>','<image href="https://example.com/x"/></svg>'),s=>s.replace('var(--color-paper)','#11273e'),s=>s.replace('font-family="l0g Barclays AI"','font-family="Arial"'),s=>s.replace('font-size="17"','font-size="10"'),s=>s.replace('<rect ','<rect opacity="0" ')])assert.throws(()=>inspectBarclaysAiSvg(change(svg)));
 for(const change of[s=>s.replace('>≈ 5 000 postes<','>UN TITRE EXTRAORDINAIREMENT LONG QUI DÉBORDE DU CADRE<'),s=>s.replace('x="22" y="220"','x="400" y="220"'),s=>s.replace('data-panel="bai-fr-jobs-m-frame"','data-panel="bai-fr-jobs-m-card-support"')]){const bad=change(svg);assert.notEqual(bad,svg);assert.throws(()=>assertBarclaysAiGeometry(bad));}
 for(const d of['M 0 0 L 3 4 trailing','M 0 0 Q 1 1 2 2','M 0 0 L Infinity 4','M 0 0 L 3','L 0 0','M 0 0 M 3 4'])assert.throws(()=>pathPoints(d));
});
test('licensed local fonts and scoped article rules keep in-page charts compact and heading words intact',()=>{
 const component=read('src/components/BarclaysAiFigure.astro');for(const [w,digest] of [[400,'8c058827b31c31dd5bdb66897b4089822fe2ba625695044b8d7019f33c720502'],[700,'72490d0123a5a29130e278bf478ff918905ec8c583fee33c0dcffcc69a34fc2b']]){const p=`public/fonts/barclays-ai/dejavu-sans-${w}.ttf`;assert.ok(readFileSync(new URL(`../${p}`,import.meta.url)).length<60000);assert.ok(component.includes(p.replace('public','')));assert.equal(createHash('sha256').update(readFileSync(new URL(`../${p}`,import.meta.url))).digest('hex'),digest);}
 assertFontLicenseReferences(read('public/fonts/barclays-ai/LICENSE.txt'),'dejavu');assert.match(component,/max-width:\s*48rem/u);assert.match(component,/max-width:\s*26rem/u);assert.match(component,/@container\s*\(max-width:\s*500px\)/u);assert.match(component,/padding-bottom:\s*1rem/u);assert.match(component,/:global\(article:has\(\.barclays-ai-figure\) \.post-title\)\s*\{\s*hyphens:\s*none/u);assert.doesNotMatch(component,/overflow\s*:\s*(?:hidden|clip)|filter\s*:|client:|<script|fetch\(|@media\s*\(max-width:/iu);
});
