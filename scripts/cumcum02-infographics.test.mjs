import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';
import {cumCumTimelineFigureReferences} from '../src/lib/cumCumTimelineFigures.mjs';
import {CUMCUM02_KINDS,CUMCUM02_SOURCES,cumCumTimelineScenes,inspectCumCumTimelineSvg,assertCumCumTimelineGeometry,labelBox,tag,attrs,content} from './cumcum02-svg-assertions.mjs';
import {pathPoints} from './insurance-returns-svg-assertions.mjs';
import {assertFontLicenseReferences} from './font-license-assertions.mjs';
const read=p=>readFileSync(new URL(`../${p}`,import.meta.url),'utf8');
const near=(a,b)=>assert.ok(Math.abs(Number(a)-b)<.000002,`${a} matches ${b}`);
test('sixteen passive bilingual scenes preserve dated alerts, evidence gathering and distinct legal tracks',()=>{
 const scenes=cumCumTimelineScenes();assert.equal(scenes.length,16);
 for(const s of scenes){assertCumCumTimelineGeometry(s.svg);const{all}=inspectCumCumTimelineSvg(s.svg),labels=all.filter(n=>tag(n)==='text').map(content).join(' ');assert.doesNotMatch(content(all.find(n=>tag(n)==='title')),/\bce (?:que|qui|qu[’'])|\bwhat\b|horlog|clock/iu);assert.doesNotMatch(s.svg,/<defs|<pattern|<g\b|transform=|#[0-9a-f]{3,8}\b|—/iu);
  const cards=part=>all.filter(n=>tag(n)==='rect'&&attrs(n).id?.includes(part));
  if(s.kind==='alerts'){assert.equal(cards('-card-event-').length,4);for(const value of['2009','2017','2018','2019','ESMA','CORRECTIV','S01','S03','S04'])assert.match(labels,new RegExp(value,'u'));assert.match(labels,s.lang==='fr'?/Portée|portées/u:/scope/u);assert.match(labels,s.lang==='fr'?/espacement libre/u:/free spacing/u);assert.match(labels,s.lang==='fr'?/potentielles|Pratiques|Euroclear/u:/Potential|Euroclear/u);}
  if(s.kind==='evidence'){assert.equal(cards('-card-input-').length,4);assert.equal(cards('-card-output-').length,2);assert.equal(cards('-card-match').length,1);for(const value of['S01','S06','S07','S09','S11'])assert.match(labels,new RegExp(value,'u'));assert.match(labels,s.lang==='fr'?/parallèles/u:/parallel/u);assert.match(labels,s.lang==='fr'?/VOIE FISCALE/u:/TAX PROCEDURE/u);assert.match(labels,s.lang==='fr'?/VOIE PÉNALE/u:/CRIMINAL INVESTIGATION/u);}
  if(s.kind==='intervals'){const length=s.mobile?320:490;for(const[i,v]of[689,434,21].entries()){const bar=all.find(n=>tag(n)==='rect'&&attrs(n).id?.endsWith('-bar-'+i));near(attrs(bar).width,length*v/700);}for(const value of['29.10.2018','17.09.2020','25.11.2021','16.12.2021','689','434','21','S09'])assert.ok(labels.includes(value));assert.match(labels,s.lang==='fr'?/1 144 jours/u:/1,144 days/u);assert.match(labels,s.lang==='fr'?/inactivité/u:/inactivity/u);if(!s.mobile){const lastTick=labelBox(all.find(n=>tag(n)==='text'&&content(n)==='700')),unit=labelBox(all.find(n=>tag(n)==='text'&&content(n)===(s.lang==='fr'?'jours':'days')));assert.ok(Math.max(lastTick.x1-unit.x2,unit.x1-lastTick.x2)>=12,'Axis unit and final tick have a clear glyph gap');}}
  if(s.kind==='tracks'){assert.equal(cards('-card-act-').length,3);for(const value of['02.04.2021','08.12.2023','05 / 08.09.2025','CACIB','FBF','472587','S09','S11','S12'])assert.ok(labels.includes(value));assert.match(labels,s.lang==='fr'?/culpabilité/u:/declaration of guilt/u);assert.match(labels,s.lang==='fr'?/tiers hors/u:/third parties outside/u);assert.match(labels,/119 bis A/u);assert.match(labels,s.lang==='fr'?/coexister/u:/coexist/u);}
 }
 const dates=['2018-10-29','2020-09-17','2021-11-25','2021-12-16'].map(d=>Date.parse(d+'T00:00:00Z'));assert.deepEqual(dates.slice(1).map((d,i)=>(d-dates[i])/86400000),[689,434,21]);assert.equal((dates[3]-dates[0])/86400000,1144);assert.ok(22*501/1000>=11);assert.ok(17*280/420>=11);assert.ok(650*768/1000<500);
});
test('closed figure and S01 to S16 contracts reject wrong order, duplicates and nonprimitive input',()=>{
 for(let i=0;i<CUMCUM02_KINDS.length;i++)for(const lang of['fr','en'])assert.deepEqual(cumCumTimelineFigureReferences(lang,CUMCUM02_KINDS[i],String(i+1).padStart(2,'0'),CUMCUM02_SOURCES[i],'Caption'),CUMCUM02_SOURCES[i].split(' '));
 for(const lang of[undefined,null,{},new String('fr'),'__proto__'])assert.throws(()=>cumCumTimelineFigureReferences(lang,'alerts','01','S01 S03 S04','Caption'));
 for(const src of['','S01','S01 S01','S01 S17','S03 S01 S04'])assert.throws(()=>cumCumTimelineFigureReferences('fr','alerts','01',src,'Caption'));
 assert.throws(()=>cumCumTimelineFigureReferences('fr','alerts','02','S01 S03 S04','Caption'));assert.throws(()=>cumCumTimelineFigureReferences('fr','alerts','01','S01 S03 S04',' '));
});
test('allowlisted XML and glyph geometry reject active content, invalid paths, missing glyphs and false panel ownership',()=>{
 const svg=cumCumTimelineScenes().find(s=>s.lang==='fr'&&s.kind==='alerts'&&s.mobile).svg;
 for(const change of[s=>s.replace('</svg>','<script>alert(1)</script></svg>'),s=>s.replace('<svg ','<svg onload="x" '),s=>s.replace('</svg>','<image href="https://example.com/x"/></svg>'),s=>s.replace('var(--color-ink)','#11273e'),s=>s.replace('font-family="l0g CumCum"','font-family="Arial"'),s=>s.replace('font-size="17"','font-size="10"'),s=>s.replace('<rect ','<rect opacity="0" ')]){const bad=change(svg);assert.notEqual(bad,svg);assert.throws(()=>inspectCumCumTimelineSvg(bad));}
 for(const change of[s=>s.replace('>Informations fiscales<','>💥<'),s=>s.replace('>Informations fiscales<','>UN TITRE EXTRAORDINAIREMENT LONG QUI DÉBORDE DU CADRE<'),s=>s.replace('data-panel="cumcum02-fr-alerts-m-card-event-0"','data-panel="cumcum02-fr-alerts-m-card-event-2"'),s=>s.replace('x="74" y="202"','x="400" y="202"')]){const bad=change(svg);assert.notEqual(bad,svg);assert.throws(()=>assertCumCumTimelineGeometry(bad));}
 for(const d of['M 0 0 L 3 4 trailing','M 0 0 Q 1 1 2 2','M 0 0 L Infinity 4','M 0 0 L 3','L 0 0','M 0 0 M 3 4','M 0 0 '+ 'L 1 1 '.repeat(10000)])assert.throws(()=>pathPoints(d));
});
test('existing licensed glyph-complete fonts preserve theme variables and compact responsive proportions',()=>{
 const component=read('src/components/CumCumTimelineFigure.astro');for(const w of[400,700]){const p=`public/fonts/cumcum/dejavu-sans-${w}.ttf`;assert.ok(readFileSync(new URL(`../${p}`,import.meta.url)).length<60000);assert.ok(component.includes(p.replace('public','')));}
 assertFontLicenseReferences(read('public/fonts/cumcum/LICENSE.txt'),'dejavu');assert.match(component,/max-width:\s*48rem/u);assert.match(component,/max-width:\s*26rem/u);assert.match(component,/@container\s*\(max-width:\s*500px\)/u);assert.match(component,/padding-bottom:\s*1rem/u);assert.match(component,/:global\(article:has\(\.cumcum02-figure\) \.post-title\)\s*\{\s*hyphens:\s*none/u);assert.doesNotMatch(component,/overflow\s*:\s*(?:hidden|clip)|filter\s*:|client:|<script|fetch\(|@media\s*\(max-width:/iu);
});
