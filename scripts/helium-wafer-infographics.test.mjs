import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import test from 'node:test';
import {heliumWaferFigureReferences} from '../src/lib/heliumWaferFigures.mjs';
import {HELIUM_WAFER_KINDS,HELIUM_WAFER_SOURCES,heliumWaferScenes,inspectHeliumWaferSvg,assertHeliumWaferGeometry,tag,attrs,content} from './helium-wafer-svg-assertions.mjs';
import {pathPoints} from './insurance-returns-svg-assertions.mjs';
import {assertFontLicenseReferences} from './font-license-assertions.mjs';
const read=p=>readFileSync(new URL(`../${p}`,import.meta.url),'utf8');
const close=(actual,expected)=>assert.ok(Math.abs(Number(actual)-expected)<.000002,`${actual} matches ${expected}`);
test('twenty passive bilingual scenes preserve their thermal paths, quantities, loop and separately scaled chronology',()=>{
 const scenes=heliumWaferScenes();assert.equal(scenes.length,20);
 for(const s of scenes){assertHeliumWaferGeometry(s.svg);const {all}=inspectHeliumWaferSvg(s.svg),labels=all.filter(n=>tag(n)==='text').map(content).join(' '),paths=all.filter(n=>tag(n)==='path');assert.doesNotMatch(content(all.find(n=>tag(n)==='title')),/\bce (?:que|qui|qu[’'])|\bwhat\b|horlog|clock/iu);assert.doesNotMatch(s.svg,/<defs|<pattern|<g\b|transform=|#[0-9a-f]{3,8}\b|—/iu);assert.doesNotMatch(labels,/\[\d{1,2}\s+\d{1,2}/u);
  const id=needle=>all.find(n=>attrs(n).id?.endsWith(needle));
  if(s.kind==='wafer'){
   for(const [label,v] of [['He',155.7],['N₂',25.9],['Ar',17.7]])close(attrs(id('-bar-'+label)).width,(s.mobile?245:175)*v/160);
   assert.match(labels,/300 K/);assert.match(labels,/mW\/\(m·K\)/u);assert.ok(paths.filter(n=>attrs(n).stroke==='var(--color-amber)').length>=4);assert.ok(paths.filter(n=>attrs(n).stroke==='var(--color-signal)').length>=2);assert.ok(paths.filter(n=>attrs(n).stroke==='var(--color-accent)').length>=2);assert.ok(id('-card-chuck'));assert.ok(id('-card-cooling'));assert.match(labels,s.lang==='fr'?/pression|Pression/u:/pressure|Pressure/u);assert.match(labels,s.lang==='fr'?/sans échelle/u:/not to scale/u);
  }
  if(s.kind==='production'){
   for(const [i,v] of [81,63,18,11,6,3,3,.5].entries())close(attrs(id('-bar-'+i)).width,(s.mobile?170:330)*v/90);
   assert.match(labels,/190/);assert.match(labels,/76/);assert.match(labels,/15 °C/u);assert.match(labels,s.lang==='fr'?/101,325 kPa/u:/101\.325 kPa/u);assert.match(labels,s.lang==='fr'?/<0,5/u:/<0\.5/u);assert.match(labels,/2025/);assert.match(labels,/Canada/);assert.match(labels,s.lang==='fr'?/arrondi|Arrondis/u:/rounded|rounding/u);close((81+63)/190*100,75.78947368421052);
  }
  if(s.kind==='delivery'){
   assert.ok(id('-card-cavern'));assert.ok(id('-card-tank'));assert.match(labels,/BEAUMONT/);assert.match(labels,/HELICS/);assert.match(labels,/48/);assert.match(labels,/5[,.]7 bar/u);assert.match(labels,/30 °C/u);assert.match(labels,/99[,.]9999/u);assert.match(labels,/2025/);assert.match(labels,s.lang==='fr'?/Remplissage actuel : non publié/u:/Current fill level: not disclosed/u);assert.equal(all.filter(n=>tag(n)==='rect'&&attrs(n).id?.includes('-card-step-')).length,4);assert.ok(paths.filter(n=>attrs(n).stroke==='var(--color-signal)').length>=8);assert.match(labels,s.lang==='fr'?/générique/u:/Generic|generic/u);
  }
  if(s.kind==='recovery'){
   assert.equal(all.filter(n=>tag(n)==='rect'&&attrs(n).id?.includes('-card-step-')).length,6);assert.ok(paths.filter(n=>attrs(n).stroke==='var(--color-signal)').length>=12);assert.equal(paths.filter(n=>attrs(n)['stroke-dasharray']).length,1);assert.ok(paths.filter(n=>attrs(n).stroke==='var(--color-accent)').length>=4);assert.ok(paths.some(n=>attrs(n).d===(s.mobile?'M 230 756 L 230 781':'M 167 405 L 167 435 L 550 435')),'Off-specification quality-control output stays visible');assert.match(labels,/4[,.]7/);assert.match(labels,/2025/);assert.match(labels,s.lang==='fr'?/[Uu]ne ligne/u:/[Oo]ne (?:production )?line/u);assert.match(labels,s.lang==='fr'?/référence.*précisée/u:/[Bb]aseline.*disclosed/u);assert.match(labels,s.lang==='fr'?/générique/u:/Generic|generic/u);
  }
  if(s.kind==='timeline'){
   assert.match(labels,/2029/);assert.match(labels,/2026-21884|Sources \[1, 2, 17\]/u);assert.match(labels,/Audrey Robertson/);assert.match(labels,/21/);assert.match(labels,/23/);assert.match(labels,/26/);assert.match(labels,/27/);assert.match(labels,s.lang==='fr'?/JOURS|Jours|jours/u:/DAYS/u);assert.match(labels,s.lang==='fr'?/ANNÉES/u:/YEARS/u);assert.match(labels,s.lang==='fr'?/prévue/u:/scheduled|due/u);assert.match(labels,s.lang==='fr'?/21 août 2026/u:/21 August 2026/u);assert.equal(paths.filter(n=>attrs(n)['stroke-dasharray']).length,1);
   const cs=all.filter(n=>tag(n)==='circle').slice(0,4).map(n=>Number(attrs(n)[s.mobile?'cy':'cx'])),start=cs[0],range=cs[3]-start;for(const[i,day]of[0,2,5,6].entries())close((cs[i]-start)/range,day/6);
  }
 }
 assert.ok(22*501/1000>=11);assert.ok(17*280/420>=11);assert.ok(650*768/1000<500);
});
test('closed figure and citation contracts reject duplicates, wrong order, unknown values and nonprimitive input',()=>{
 for(let i=0;i<HELIUM_WAFER_KINDS.length;i++)for(const lang of['fr','en'])assert.deepEqual(heliumWaferFigureReferences(lang,HELIUM_WAFER_KINDS[i],String(i+1).padStart(2,'0'),HELIUM_WAFER_SOURCES[i],'Caption'),HELIUM_WAFER_SOURCES[i].split(' '));
 for(const lang of[undefined,null,{},new String('fr'),'__proto__'])assert.throws(()=>heliumWaferFigureReferences(lang,'production','02','08','Caption'));
 for(const src of['','03','08 08','08 22','03 05 04'])assert.throws(()=>heliumWaferFigureReferences('fr','production','02',src,'Caption'));
 assert.throws(()=>heliumWaferFigureReferences('fr','wafer','02','03 04 05','Caption'));assert.throws(()=>heliumWaferFigureReferences('fr','production','02','08',' '));
});
test('security allowlist and measured geometry reject injected content, invalid whole paths, missing glyphs and wrong panel ownership',()=>{
 const svg=heliumWaferScenes().find(s=>s.lang==='fr'&&s.kind==='recovery'&&s.mobile).svg;
 for(const change of[s=>s.replace('</svg>','<script>alert(1)</script></svg>'),s=>s.replace('<svg ','<svg onload="x" '),s=>s.replace('</svg>','<image href="https://example.com/x"/></svg>'),s=>s.replace('var(--color-ink)','#11273e'),s=>s.replace('font-family="l0g Helium Wafer"','font-family="Arial"'),s=>s.replace('font-size="17"','font-size="10"'),s=>s.replace('<rect ','<rect opacity="0" ')]){const bad=change(svg);assert.notEqual(bad,svg);assert.throws(()=>inspectHeliumWaferSvg(bad));}
 for(const change of[s=>s.replace('>Distribution<','>💥<'),s=>s.replace('>Distribution<','>UN TITRE EXTRAORDINAIREMENT LONG QUI DÉBORDE DU CADRE<'),s=>s.replace('data-panel="he-fr-recovery-m-card-step-0"','data-panel="he-fr-recovery-m-card-step-5"'),s=>s.replace('x="88" y="188"','x="400" y="188"')]){const bad=change(svg);assert.notEqual(bad,svg);assert.throws(()=>assertHeliumWaferGeometry(bad));}
 for(const d of['M 0 0 L 3 4 trailing','M 0 0 Q 1 1 2 2','M 0 0 L Infinity 4','M 0 0 L 3','L 0 0','M 0 0 M 3 4'])assert.throws(()=>pathPoints(d));
});
test('licensed glyph-complete local fonts and scoped styles retain theme adaptation and compact responsive presentation',()=>{
 const component=read('src/components/HeliumWaferFigure.astro');for(const w of[400,700]){const p=`public/fonts/helium-wafer/dejavu-sans-${w}.ttf`;assert.ok(readFileSync(new URL(`../${p}`,import.meta.url)).length<60000);assert.ok(component.includes(p.replace('public','')));assert.equal(createHash('sha256').update(readFileSync(new URL(`../${p}`,import.meta.url))).digest('hex'),w===400?'d6bbe9e31b1a71ac113ba88cda6da03ed324231d3e2c63622b30357dc8ac524e':'dc020620febd525bb321f972e0bfc188adabc8636793a1e6309bcbcb2e2ac700');}
 assertFontLicenseReferences(read('public/fonts/helium-wafer/LICENSE.txt'),'dejavu');assert.match(component,/max-width:\s*48rem/u);assert.match(component,/max-width:\s*26rem/u);assert.match(component,/@container\s*\(max-width:\s*500px\)/u);assert.match(component,/padding-bottom:\s*1rem/u);assert.match(component,/:global\(article:has\(\.helium-wafer-figure\) \.post-title\)\s*\{\s*hyphens:\s*none/u);assert.doesNotMatch(component,/overflow\s*:\s*(?:hidden|clip)|filter\s*:|client:|<script|fetch\(|@media\s*\(max-width:/iu);
});
