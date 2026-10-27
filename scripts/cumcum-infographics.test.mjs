import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';
import {cumCumFigureReferences} from '../src/lib/cumCumFigures.mjs';
import {CUMCUM_KINDS,CUMCUM_SOURCES,cumCumScenes,inspectCumCumSvg,assertCumCumGeometry,tag,attrs,content} from './cumcum-svg-assertions.mjs';
import {pathPoints} from './insurance-returns-svg-assertions.mjs';
import {assertFontLicenseReferences} from './font-license-assertions.mjs';
const read=p=>readFileSync(new URL(`../${p}`,import.meta.url),'utf8');
const close=(a,b)=>assert.ok(Math.abs(Number(a)-b)<.000002,`${a} matches ${b}`);
test('sixteen passive bilingual scenes preserve the temporary holding sequence, allocation and distinct legal analyses',()=>{
 const scenes=cumCumScenes();assert.equal(scenes.length,16);
 for(const s of scenes){assertCumCumGeometry(s.svg);const{all}=inspectCumCumSvg(s.svg),labels=all.filter(n=>tag(n)==='text').map(content).join(' '),id=needle=>all.find(n=>attrs(n).id?.endsWith(needle));
  assert.doesNotMatch(content(all.find(n=>tag(n)==='title')),/\bce (?:que|qui|qu[’'])|\bwhat\b|horlog|clock/iu);assert.doesNotMatch(s.svg,/<defs|<pattern|<g\b|transform=|#[0-9a-f]{3,8}\b|—/iu);
  if(s.kind==='cycle'){assert.equal(all.filter(n=>tag(n)==='rect'&&attrs(n).id?.includes('-card-step-')).length,4);assert.match(labels,s.lang==='fr'?/DÉTACHEMENT/u:/EX-DATE/u);assert.match(labels,s.lang==='fr'?/DÉNOUEMENT/u:/UNWIND/u);assert.match(labels,s.lang==='fr'?/exposition économique/u:/Economic exposure/u);assert.match(labels,s.lang==='fr'?/sans échelle/u:/no time scale/u);assert.match(labels,/S1, S3, S5/u);}
  if(s.kind==='allocation'){const length=s.mobile?380:952;for(const[i,vs]of[[85,15],[90,10]].entries()){for(const[j,v]of vs.entries())close(attrs(id(`-card-bar-${i}-${j}`)).width,length*v/100);close(Number(attrs(id(`-card-bar-${i}-0`)).width)+Number(attrs(id(`-card-bar-${i}-1`)).width),length);}assert.match(labels,s.lang==='fr'?/5 \+ 10 = 15 €|5 €.*10 €.*15 €/u:/€5 \+ €10 = €15|€5.*€10.*€15/u);assert.match(labels,/15\s*%|15%/u);assert.match(labels,/90\s*%|90%/u);assert.match(labels,s.lang==='fr'?/avant frais|AVANT FRAIS|précèdent frais/u:/before costs|BEFORE COSTS|precedes costs/u);assert.match(labels,/§34 \[S1\]/u);}
  if(s.kind==='exposure'){assert.match(labels,s.lang==='fr'?/Société émettrice/u:/Issuing company/u);assert.match(labels,s.lang==='fr'?/composante dividende/u:/dividend component/u);assert.match(labels,s.lang==='fr'?/financement|Financement/u:/financing|Financing/u);assert.match(labels,s.lang==='fr'?/qualification fiscale|bénéficiaire effectif/u:/Tax status|beneficial ownership/u);assert.match(labels,/S1, S3, S8/u);assert.ok(all.some(n=>tag(n)==='path'&&attrs(n)['stroke-dasharray']),'Reverse contractual flow remains dashed');}
  if(s.kind==='comparison'){assert.equal(all.filter(n=>tag(n)==='rect'&&attrs(n).id?.includes('-card-case-')).length,2);assert.match(labels,/CUM-CUM/u);assert.match(labels,/CUM-EX/u);assert.match(labels,s.lang==='fr'?/prélèvement est évité/u:/Withholding is avoided/u);assert.match(labels,s.lang==='fr'?/collecte correspondante/u:/corresponding collection/u);assert.match(labels,s.lang==='fr'?/séparément|distinctes/u:/separate measurement|Distinct evidence/u);assert.match(labels,/18\/12700/u);assert.match(labels,/S3, S11/u);}
 }
 assert.equal(100*.85,85);assert.equal(100*.9,90);assert.equal(90-85,5);assert.equal(100-90,10);assert.equal(5+10,15);assert.ok(22*501/1000>=11);assert.ok(17*280/420>=11);assert.ok(650*768/1000<500);
});
test('closed figure and S1 to S15 citation contracts reject wrong order, duplicates and nonprimitive input',()=>{
 for(let i=0;i<CUMCUM_KINDS.length;i++)for(const lang of['fr','en'])assert.deepEqual(cumCumFigureReferences(lang,CUMCUM_KINDS[i],String(i+1).padStart(2,'0'),CUMCUM_SOURCES[i],'Caption'),CUMCUM_SOURCES[i].split(' '));
 for(const lang of[undefined,null,{},new String('fr'),'__proto__'])assert.throws(()=>cumCumFigureReferences(lang,'cycle','01','S1 S3 S5','Caption'));
 for(const src of['','S1','S1 S1','S1 S16','S3 S1 S5'])assert.throws(()=>cumCumFigureReferences('fr','cycle','01',src,'Caption'));
 assert.throws(()=>cumCumFigureReferences('fr','cycle','02','S1 S3 S5','Caption'));assert.throws(()=>cumCumFigureReferences('fr','cycle','01','S1 S3 S5',' '));
});
test('allowlisted XML and actual glyph geometry reject injection, malformed paths, missing glyphs and wrong panel ownership',()=>{
 const svg=cumCumScenes().find(s=>s.lang==='fr'&&s.kind==='cycle'&&s.mobile).svg;
 for(const change of[s=>s.replace('</svg>','<script>alert(1)</script></svg>'),s=>s.replace('<svg ','<svg onload="x" '),s=>s.replace('</svg>','<image href="https://example.com/x"/></svg>'),s=>s.replace('var(--color-ink)','#11273e'),s=>s.replace('font-family="l0g CumCum"','font-family="Arial"'),s=>s.replace('font-size="17"','font-size="10"'),s=>s.replace('<rect ','<rect opacity="0" ')]){const bad=change(svg);assert.notEqual(bad,svg);assert.throws(()=>inspectCumCumSvg(bad));}
 for(const change of[s=>s.replace('>AVANT<','>💥<'),s=>s.replace('>AVANT<','>UN TITRE EXTRAORDINAIREMENT LONG QUI DÉBORDE DU CADRE<'),s=>s.replace('data-panel="cumcum-fr-cycle-m-card-step-0"','data-panel="cumcum-fr-cycle-m-card-step-2"'),s=>s.replace('x="96" y="166"','x="400" y="166"')]){const bad=change(svg);assert.notEqual(bad,svg);assert.throws(()=>assertCumCumGeometry(bad));}
 for(const d of['M 0 0 L 3 4 trailing','M 0 0 Q 1 1 2 2','M 0 0 L Infinity 4','M 0 0 L 3','L 0 0','M 0 0 M 3 4','M 0 0 '+ 'L 1 1 '.repeat(10000)])assert.throws(()=>pathPoints(d));
});
test('licensed glyph-complete fonts and scoped styles preserve both themes and compact responsive proportions',()=>{
 const component=read('src/components/CumCumFigure.astro');for(const w of[400,700]){const p=`public/fonts/cumcum/dejavu-sans-${w}.ttf`;assert.ok(readFileSync(new URL(`../${p}`,import.meta.url)).length<60000);assert.ok(component.includes(p.replace('public','')));}
 assertFontLicenseReferences(read('public/fonts/cumcum/LICENSE.txt'),'dejavu');assert.match(component,/max-width:\s*48rem/u);assert.match(component,/max-width:\s*26rem/u);assert.match(component,/@container\s*\(max-width:\s*500px\)/u);assert.match(component,/padding-bottom:\s*1rem/u);assert.match(component,/:global\(article:has\(\.cumcum-figure\) \.post-title\)\s*\{\s*hyphens:\s*none/u);assert.doesNotMatch(component,/overflow\s*:\s*(?:hidden|clip)|filter\s*:|client:|<script|fetch\(|@media\s*\(max-width:/iu);
});
