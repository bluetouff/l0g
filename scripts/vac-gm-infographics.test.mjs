import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import test from 'node:test';
import { vacGMFigureReferences } from '../src/lib/vacGMFigures.mjs';
import { VAC_GM_KINDS, VAC_GM_SOURCES, vacGMScenes, inspectVacGMSvg, assertVacGMGeometry, polylinePoints, tag, attrs, content } from './vac-gm-svg-assertions.mjs';
import { assertFontLicenseReferences } from './font-license-assertions.mjs';
const read=p=>readFileSync(new URL(`../${p}`,import.meta.url),'utf8');
const labels=svg=>inspectVacGMSvg(svg).all.filter(n=>tag(n)==='text').map(content).join(' ');
test('twenty-eight reviewed scenes preserve readable native artwork, intended panels and safe complete geometry',()=>{
 const scenes=vacGMScenes();assert.equal(scenes.length,28);
 for(const s of scenes){
  assertVacGMGeometry(s.svg);
  const all=inspectVacGMSvg(s.svg).all,title=all.find(n=>tag(n)==='title');
  assert.doesNotMatch(content(title),/\bce (?:que|qui|qu[’'])|\bwhat\b|horlog|clock|two timelines|deux calendriers/iu);
  assert.doesNotMatch(s.svg,/<defs|<pattern|<ellipse|<g\b|transform=/iu);
  if(s.kind==='chain'&&!s.mobile){assert.equal(all.filter(n=>tag(n)==='circle').length,14);assert.ok(all.filter(n=>tag(n)==='path').length>=20,'Native mine, metal, magnet and motor artwork remains present');}
  if(s.kind==='capacity'){
   const rects=all.filter(n=>tag(n)==='rect').map(attrs);
   if(s.mobile){const parts=rects.filter(r=>r.x==='71.0'&&r.y==='467.0');assert.equal(Number(parts.find(r=>r.height==='234.0').height)/Number(parts.find(r=>r.height==='260.0').height),.9);}
   else{const parts=rects.filter(r=>r.x==='77.0'&&r.y==='483.0');assert.equal(Number(parts.find(r=>r.width==='1125.0').width)/Number(parts.find(r=>r.width==='1250.0').width),.9);}
   assert.match(labels(s.svg),/90\s?%/u);
  }
 }
 assert.ok(24*704/1410>11,'Small desktop text remains readable');assert.ok(28*280/710>11,'Small mobile text remains readable');assert.ok(830*768/1410<500,'Desktop figures stay compact');
});
test('dated bank forbearance, cash arithmetic and acquisition components retain distinct meanings',()=>{
 for(const s of vacGMScenes()){
  const value=labels(s.svg);
  if(s.kind==='calendar'){
   const dates=inspectVacGMSvg(s.svg).all.filter(n=>tag(n)==='text'&&/^20\d{2}\./u.test(content(n))).map(content);
   assert.deepEqual(dates,['2023.01','2024.09',s.lang==='fr'?'2025.T4':'2025.Q4','2026.04','2026.06.23','2026.07.01','2026.07.07','2026.07.15','2026.09.24','2026.10.13']);
   assert.match(value,s.lang==='fr'?/Abstention de recours/u:/Lender forbearance/u);assert.doesNotMatch(value,/report.*(?:échéance|dette)|maturity extension|loan extension/iu);
  }
  if(s.kind==='cash')for(const amount of s.lang==='fr'?['30,103','81,546','51,443']:['30.103','81.546','51.443'])assert.ok(value.includes(amount));
  if(s.kind==='deal')for(const amount of['718','379','300'])assert.ok(value.includes(amount));
  if(s.kind==='public')for(const amount of s.lang==='fr'?['335','94,1','111,9','15']:['335','94.1','111.9','15'])assert.ok(value.includes(amount));
 }
 assert.equal((30.103-81.546).toFixed(3),'-51.443');assert.equal((43.7+25.8).toFixed(1),'69.5');assert.equal(379+300+39,718);assert.equal((38.050/54.626*100).toFixed(2),'69.66');assert.equal((38.050/54.626*100).toFixed(1),'69.7');
 assert.ok(VAC_GM_SOURCES[VAC_GM_KINDS.indexOf('calendar')].split(' ').includes('02'),'Forbearance cites the interim accounts');
});
test('source and geometry contracts reject executable vectors, unsafe inputs, panel escapes and icon corruption',()=>{
 for(let i=0;i<VAC_GM_KINDS.length;i++)assert.deepEqual(vacGMFigureReferences('fr',VAC_GM_KINDS[i],String(i+1).padStart(2,'0'),VAC_GM_SOURCES[i],'Caption'),VAC_GM_SOURCES[i].split(' '));
 for(const invalid of[undefined,null,{},new String('fr'),'__proto__'])assert.throws(()=>vacGMFigureReferences(invalid,'chain','01',VAC_GM_SOURCES[0],'Caption'));
 for(const src of['','01 01','01 09','01 09 12 14 16','01 09 12 99'])assert.throws(()=>vacGMFigureReferences('fr','chain','01',src,'Caption'));
 const svg=vacGMScenes()[0].svg;
 for(const change of[s=>s.replace('</svg>','<script>alert(1)</script></svg>'),s=>s.replace('<svg ','<svg onload="x" '),s=>s.replace('</svg>','<image href="https://example.com/x" /></svg>'),s=>s.replace('var(--color-ink)','#11273e'),s=>s.replace('font-family="l0g VAC GM"','font-family="Arial"')])assert.throws(()=>inspectVacGMSvg(change(svg)));
 for(const change of[s=>s.replace('x="163.0" y="307.0"','x="440" y="307.0"'),s=>s.replace('>MINERAI<','>MINERAI AVEC UN LIBELLÉ BEAUCOUP TROP LONG POUR LE PANNEAU<'),s=>s.replace('M40.0 99.0 L1370.0 99.0','M40 300 L1370 300'),s=>s.replace('100,379 132,363 158,372 182,357','100,379 1430,363 158,372 182,357')]){const bad=change(svg);assert.notEqual(bad,svg);assert.throws(()=>assertVacGMGeometry(bad));}
 assert.deepEqual(polylinePoints('1,2 3,4'),[[1,2],[3,4]]);for(const points of['1 2 3','1 2 garbage 4','1 2 Infinity 4',`1 2 ${'0'.repeat(5000)} 4`])assert.throws(()=>polylinePoints(points));
});
test('the existing licensed font and shared component proportions are retained without new assets',()=>{
 const component=read('src/components/VacGMFigure.astro');
 for(const[w,digest]of[[400,'98f2d74db16bb5f41f74adf6d899aeec92861682cccc58bfdbe4d9d7d0a5ae11'],[700,'21a0350a4ac2a9f22b6a7a8dcaf6abb08c8b546d06499301f1fcf10996fd0df5']]){const p=`public/fonts/stablecoins/dejavu-sans-${w}.ttf`;assert.equal(createHash('sha256').update(readFileSync(new URL(`../${p}`,import.meta.url))).digest('hex'),digest);assert.ok(component.includes(p.replace('public','')));}
 assertFontLicenseReferences(read('public/fonts/stablecoins/LICENSE.txt'),'dejavu');assert.match(component,/max-width:\s*48rem/u);assert.match(component,/max-width:\s*26rem/u);assert.match(component,/@container\s*\(max-width:\s*640px\)/u);assert.match(component,/padding-bottom:\s*1rem/u);assert.match(component,/:global\(\.vac-source-list\)/u);assert.doesNotMatch(component,/overflow\s*:\s*(?:hidden|clip)|filter\s*:|client:|<script|fetch\(|@media\s*\(max-width:/iu);
});
