import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { cumCumAccountabilityFigureReferences } from '../src/lib/cumCumAccountabilityFigures.mjs';
import { CUMCUM04_KINDS, CUMCUM04_SOURCES, cumCumAccountabilityScenes, inspectCumCumAccountabilitySvg, assertCumCumAccountabilityGeometry, tag, attrs, content } from './cumcum04-svg-assertions.mjs';
import { assertFontLicenseReferences } from './font-license-assertions.mjs';
const read = p => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');
const labelsOf = all => all.filter(n => tag(n) === 'text').map(content).join(' ');
test('sixteen bilingual scenes preserve legal entities, procedural boundaries, latest known acts and exact sterling calculation', () => {
 const scenes=cumCumAccountabilityScenes();assert.equal(scenes.length,16);
 for(const s of scenes){
  assertCumCumAccountabilityGeometry(s.svg);const{all}=inspectCumCumAccountabilitySvg(s.svg),labels=labelsOf(all);
  assert.doesNotMatch(content(all.find(n=>tag(n)==='title')),/\bce (?:que|qui|qu[’'])|\bwhat\b|horlog|clock/iu);
  assert.doesNotMatch(s.svg,/<defs|<pattern|<g\b|transform=|#[0-9a-f]{3,8}\b|—/iu);
  if(s.kind==='entities'){
   for(const v of['HSBC Bank plc','HSBC Continental Europe','2014–2019','08.01.2026','05.01.2026','S01'])assert.ok(labels.includes(v));
   assert.match(labels,s.lang==='fr'?/267 531 000 €/u:/€267,531,000/u);
   assert.match(labels,s.lang==='fr'?/Qualification envisagée/u:/Proposed offence/u);
   assert.match(labels,s.lang==='fr'?/cette enquête/u:/this investigation/u);
   assert.equal(all.filter(n=>tag(n)==='rect'&&attrs(n).id?.includes('-card-entity-')).length,2);
  }
  if(s.kind==='procedure'){
   assert.equal(all.filter(n=>tag(n)==='rect'&&attrs(n).id?.includes('-card-step-')).length,4);
   for(const v of['01 /','02 /','03 /','04 /','S01 / S04 / S06'])assert.ok(labels.includes(v));
   assert.match(labels,s.lang==='fr'?/Dix jours/u:/Ten days/u);
   assert.match(labels,s.lang==='fr'?/responsabilité personnelle reste distincte/u:/Personal liability remains separate/u);
   assert.match(labels,s.lang==='fr'?/périmètre convenu/u:/agreed scope/u);
  }
  if(s.kind==='outcomes'){
   for(const v of['Hanno Berger','Christian Olearius','Sanjay Shah','Kai-Uwe Steck','13.12.2022','12.05.2026*','24.06.2024','18.03.2026','12.12.2024','03.06.2025','27.10.2026','S08–S12 / S18 / S19 / S21'])assert.ok(labels.includes(v));
   assert.match(labels,s.lang==='fr'?/Deux condamnations définitives/u:/Two final convictions/u);
   assert.match(labels,s.lang==='fr'?/Confiscation renvoyée/u:/Confiscation remitted/u);
   assert.match(labels,/Nov\. 2026–(?:mai|May) 2027/u);assert.match(labels,/Ritzau \(13\.08\.2026\)/u);
   assert.ok(labels.includes('08.06.2026'));assert.match(labels,s.lang==='fr'?/Recours du parquet rejeté/u:/Prosecution appeal rejected/u);assert.match(labels,s.lang==='fr'?/avec sursis/u:/suspended/u);
   assert.equal(all.filter(n=>tag(n)==='rect'&&attrs(n).id?.includes('-card-case-')).length,4);
  }
  if(s.kind==='mako'){
   const values=s.lang==='fr'?['1 448 345 £','311 062 £','1 137 283 £','750 607 £','70 %','30 %','525 424,90 £','1 662 707,90 £','1 662 700 £']:['£1,448,345','£311,062','£1,137,283','£750,607','70%','30%','£525,424.90','£1,662,707.90','£1,662,700'];
   for(const v of values)assert.ok(labels.includes(v));assert.ok(labels.includes('17.02.2025'));assert.ok(labels.includes('§§6.4–6.26'));
   assert.match(labels,s.lang==='fr'?/Montant conservé intégralement/u:/Retained in full/u);
  }
 }
 // Pence arithmetic: only the punitive element receives the settlement discount.
 assert.equal(144834500-31106200,113728300);assert.equal(75060700*70/100,52542490);assert.equal(113728300+52542490,166270790);assert.equal(Math.floor(166270790/10000)*10000,166270000);
});
test('closed figure contracts reject reordered, duplicate, coerced and unreviewed references',()=>{
 for(let i=0;i<4;i++)for(const lang of['fr','en'])assert.deepEqual(cumCumAccountabilityFigureReferences(lang,CUMCUM04_KINDS[i],String(i+1).padStart(2,'0'),CUMCUM04_SOURCES[i],'Caption'),CUMCUM04_SOURCES[i].split(' '));
 for(const lang of[undefined,null,{},new String('fr'),'__proto__'])assert.throws(()=>cumCumAccountabilityFigureReferences(lang,'entities','01','S01','Caption'));
 for(const src of['','S01 S01','S00','S22','S02',new String('S01'),{}])assert.throws(()=>cumCumAccountabilityFigureReferences('fr','entities','01',src,'Caption'));
 assert.throws(()=>cumCumAccountabilityFigureReferences('fr','entities','02','S01','Caption'));assert.throws(()=>cumCumAccountabilityFigureReferences('fr','entities','01','S01',' '));
});
test('passive XML, fully consumed paths, glyph coverage and ownership reject hidden or clipped alterations',()=>{
 const svg=cumCumAccountabilityScenes().find(s=>s.lang==='fr'&&s.kind==='entities'&&s.mobile).svg;
 for(const change of[s=>s.replace('</svg>','<script>alert(1)</script></svg>'),s=>s.replace('<svg ','<svg onload="x" '),s=>s.replace('</svg>','<image href="https://example.com/x"/></svg>'),s=>s.replace('var(--color-ink)','#11273e'),s=>s.replace('font-family="l0g CumCum"','font-family="Arial"'),s=>s.replace('font-size="17"','font-size="10"'),s=>s.replace('<rect ','<rect opacity="0" ')]){const bad=change(svg);assert.notEqual(bad,svg);assert.throws(()=>inspectCumCumAccountabilitySvg(bad));}
 for(const change of[s=>s.replace('>HSBC Bank plc<','>💥<'),s=>s.replace('>HSBC Bank plc<','>UN TITRE EXTRAORDINAIREMENT LONG QUI DÉBORDE DU CADRE<'),s=>s.replace('data-panel="cumcum04-fr-entities-m-card-entity-0"','data-panel="cumcum04-fr-entities-m-card-entity-1"'),s=>s.replace('x="40" y="190"','x="410" y="190"')]){const bad=change(svg);assert.notEqual(bad,svg);assert.throws(()=>assertCumCumAccountabilityGeometry(bad));}
 const proc=cumCumAccountabilityScenes().find(s=>s.kind==='procedure'&&!s.mobile).svg;
 for(const suffix of[' junk',' Q 1 2',' L Infinity 3',' L 100000 2'])assert.throws(()=>inspectCumCumAccountabilitySvg(proc.replace(/d="(M[^"]+)"/u,(_,d)=>`d="${d}${suffix}"`)));
});
test('existing licensed fonts and responsive containers keep theme-native compact readable proportions',()=>{
 const component=read('src/components/CumCumAccountabilityFigure.astro');
 for(const w of[400,700]){const p=`public/fonts/cumcum04/dejavu-sans-${w}.ttf`;assert.ok(readFileSync(new URL(`../${p}`,import.meta.url)).length<60000);assert.ok(component.includes(p.replace('public','')));}
 assertFontLicenseReferences(read('public/fonts/cumcum04/LICENSE.txt'),'dejavu');
 assert.match(component,/max-width:\s*48rem/u);assert.match(component,/max-width:\s*26rem/u);assert.match(component,/@container\s*\(max-width:\s*500px\)/u);assert.match(component,/padding-bottom:\s*1rem/u);
 assert.doesNotMatch(component,/overflow\s*:\s*(?:hidden|clip)|filter\s*:|client:|<script|fetch\(|@media\s*\(max-width:|sources-list|source-meta/iu);
 assert.ok(22*501/1000>=11);assert.ok(17*280/420>=11);assert.ok(720*768/1000<560);
});
