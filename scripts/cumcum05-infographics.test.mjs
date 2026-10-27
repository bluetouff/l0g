import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { cumCumDoctrineFigureReferences } from '../src/lib/cumCumDoctrineFigures.mjs';
import { CUMCUM05_KINDS, CUMCUM05_SOURCES, cumCumDoctrineScenes, inspectCumCumDoctrineSvg, assertCumCumDoctrineGeometry, tag, attrs, content, labelBox } from './cumcum05-svg-assertions.mjs';
import { assertFontLicenseReferences } from './font-license-assertions.mjs';
const read=p=>readFileSync(new URL(`../${p}`,import.meta.url),'utf8');
const labelsOf=all=>all.filter(n=>tag(n)==='text').map(content).join(' ');
const near=(a,b)=>assert.ok(Math.abs(Number(a)-b)<.000002,`${a} matches ${b}`);
test('sixteen bilingual scenes preserve the paired legal tests, known-counterparty paths, measured period and conditional guarantee',()=>{
 const scenes=cumCumDoctrineScenes();assert.equal(scenes.length,16);
 for(const s of scenes){
  assertCumCumDoctrineGeometry(s.svg);const{all}=inspectCumCumDoctrineSvg(s.svg),labels=labelsOf(all);
  assert.doesNotMatch(content(all.find(n=>tag(n)==='title')),/\bce (?:que|qui|qu[’'])|\bwhat\b|horlog|clock/iu);assert.doesNotMatch(s.svg,/<defs|<pattern|<g\b|transform=|#[0-9a-f]{3,8}\b|—/iu);
  const cards=part=>all.filter(n=>tag(n)==='rect'&&attrs(n).id?.includes('-card-'+part));
  if(s.kind==='qualification'){
   assert.equal(cards('flow-').length,3);assert.equal(cards('test-').length,2);for(const v of['14.02.2025','119 bis','119 bis A','S03','S04'])assert.ok(labels.includes(v));
   assert.match(labels,s.lang==='fr'?/bénéficiaire/u:/beneficiary/u);assert.match(labels,s.lang==='fr'?/réputés constituer un revenu distribué/u:/treated as distributed income/u);assert.match(labels,s.lang==='fr'?/Exemple conceptuel/u:/Conceptual example/u);
  }
  if(s.kind==='market'){
   assert.equal(cards('path-').length,2);assert.equal(cards('market').length,1);assert.equal(cards('opinion-').length,2);assert.match(labels,s.lang==='fr'?/Contrepartie inconnue/u:/Unknown counterparty/u);assert.match(labels,s.lang==='fr'?/Contrepartie connue/u:/Known counterparty/u);assert.match(labels,s.lang==='fr'?/POINT 12.*POINT 13/u:/PARAGRAPH 12.*PARAGRAPH 13/u);assert.match(labels,s.lang==='fr'?/conditions sont réunies/u:/conditions are met/u);assert.ok(labels.includes('S03'));
  }
  if(s.kind==='window'){
   if(s.mobile&&s.lang==='fr'){assert.equal(attrs(all.find(n=>tag(n)==='svg')).viewBox,'0 0 420 1080');assert.ok(Math.min(...all.filter(n=>tag(n)==='text').map(n=>1080-labelBox(n).y2))>=24,'Real bottom padding below all painted glyphs');}
   for(const v of['98','55','43','17.04.2025','11.06.2025','24.07.2025','20.01.2026','S05','S06','S07'])assert.ok(labels.includes(v));assert.match(labels,s.lang==='fr'?/retrait exclu du calcul/u:/withdrawal date excluded/u);assert.match(labels,s.lang==='fr'?/légalité au fond non tranchée/u:/substantive legality left undecided/u);
   if(!s.mobile){near(attrs(all.find(n=>tag(n)==='rect'&&attrs(n).id?.endsWith('-bar-before-claim'))).width,666*55/98);near(attrs(all.find(n=>tag(n)==='rect'&&attrs(n).id?.endsWith('-bar-after-claim'))).width,666*43/98);}
  }
  if(s.kind==='guarantee'){
   assert.equal(cards('step-').length,4);for(const v of['24.07.2025','L.80 A','L.64','2020','20.01.2026','28.10.2020','S07','S08'])assert.ok(labels.includes(v));assert.match(labels,s.lang==='fr'?/termes de l’interprétation/u:/terms of the interpretation/u);assert.match(labels,s.lang==='fr'?/hors cum-cum/u:/unrelated to cum-cum/u);assert.match(labels,s.lang==='fr'?/exclusivement fiscal/u:/exclusively tax-driven/u);
  }
 }
 const days=(start,end)=>(Date.parse(end+'T00:00:00Z')-Date.parse(start+'T00:00:00Z'))/86400000;
 assert.equal(days('2025-04-17','2025-06-11'),55);assert.equal(days('2025-06-11','2025-07-24'),43);assert.equal(days('2025-04-17','2025-07-24'),98);assert.equal(55+43,98);
});
test('closed figure contracts reject reordered, duplicate, coerced and unreviewed references',()=>{
 for(let i=0;i<4;i++)for(const lang of['fr','en'])assert.deepEqual(cumCumDoctrineFigureReferences(lang,CUMCUM05_KINDS[i],String(i+1).padStart(2,'0'),CUMCUM05_SOURCES[i],'Caption'),CUMCUM05_SOURCES[i].split(' '));
 for(const lang of[undefined,null,{},new String('fr'),'__proto__'])assert.throws(()=>cumCumDoctrineFigureReferences(lang,'market','02','S03','Caption'));
 for(const src of['','S03 S03','S00','S14','S02',new String('S03'),{}])assert.throws(()=>cumCumDoctrineFigureReferences('fr','market','02',src,'Caption'));
 assert.throws(()=>cumCumDoctrineFigureReferences('fr','market','01','S03','Caption'));assert.throws(()=>cumCumDoctrineFigureReferences('fr','market','02','S03',' '));
});
test('passive XML, fully consumed paths, glyph coverage and ownership reject hidden or clipped alterations',()=>{
 const svg=cumCumDoctrineScenes().find(s=>s.lang==='fr'&&s.kind==='market'&&s.mobile).svg;
 for(const change of[s=>s.replace('</svg>','<script>alert(1)</script></svg>'),s=>s.replace('<svg ','<svg onload="x" '),s=>s.replace('</svg>','<image href="https://example.com/x"/></svg>'),s=>s.replace('var(--color-ink)','#11273e'),s=>s.replace('font-family="l0g CumCum05"','font-family="Arial"'),s=>s.replace('font-size="17"','font-size="10"'),s=>s.replace('<rect ','<rect opacity="0" ')]){const bad=change(svg);assert.notEqual(bad,svg);assert.throws(()=>inspectCumCumDoctrineSvg(bad));}
 for(const change of[s=>s.replace('>Contrepartie connue<','>💥<'),s=>s.replace('>Contrepartie connue<','>UN TITRE EXTRAORDINAIREMENT LONG QUI DÉBORDE DU CADRE<'),s=>s.replace('data-panel="cumcum05-fr-market-m-card-path-0"','data-panel="cumcum05-fr-market-m-card-path-1"'),s=>s.replace('x="40" y="194"','x="410" y="194"')]){const bad=change(svg);assert.notEqual(bad,svg);assert.throws(()=>assertCumCumDoctrineGeometry(bad));}
 for(const suffix of[' junk',' Q 1 2',' L Infinity 3',' L 100000 2'])assert.throws(()=>inspectCumCumDoctrineSvg(svg.replace(/d="(M[^"]+)"/u,(_,d)=>`d="${d}${suffix}"`)));
});
test('dedicated licensed fonts and responsive containers preserve the charter without changing old fonts',()=>{
 const component=read('src/components/CumCumDoctrineFigure.astro');for(const w of[400,700]){const p=`public/fonts/cumcum05/dejavu-sans-${w}.ttf`;assert.ok(readFileSync(new URL(`../${p}`,import.meta.url)).length<60000);assert.ok(component.includes(p.replace('public','')));}
 assertFontLicenseReferences(read('public/fonts/cumcum05/LICENSE.txt'),'dejavu');assert.match(component,/max-width:\s*48rem/u);assert.match(component,/max-width:\s*26rem/u);assert.match(component,/@container\s*\(max-width:\s*500px\)/u);assert.match(component,/padding-bottom:\s*1rem/u);assert.doesNotMatch(component,/overflow\s*:\s*(?:hidden|clip)|filter\s*:|client:|<script|fetch\(|@media\s*\(max-width:|sources-list|source-meta/iu);assert.ok(22*501/1000>=11);assert.ok(17*280/420>=11);assert.ok(720*768/1000<560);
});

test('document comparisons preserve dated versions, primary references and distinct legal scope', async()=>{
 const{cumCumDoctrineComparison,CUMCUM05_COMPARISON_IDS}=await import('../src/lib/cumCumDoctrineComparison.mjs');
 assert.deepEqual(CUMCUM05_COMPARISON_IDS,['beneficiaire','perimetre','marche','retrait','garantie','calendriers']);
 const references=[['S01','S04 S03'],['S01','S04'],['S02','S03','S05'],['S05','S06'],['S07','S08'],['S06','S04 S10 S11']];
 for(const lang of['fr','en']){
  const rows=cumCumDoctrineComparison(lang);assert.equal(rows.length,6);assert.equal(rows.flatMap(r=>r.panels).length,13);
  for(const[i,row]of rows.entries()){assert.equal(row.id,CUMCUM05_COMPARISON_IDS[i]);assert.doesNotMatch(row.title,/\bce (?:que|qui|qu[’'])|\bwhat\b|horlog|clock/iu);assert.deepEqual(row.panels.map(p=>p.sources.join(' ')),references[i]);for(const value of[row.title,row.scope,row.limit,...row.panels.flatMap(p=>[p.date,p.label,p.text])]){assert.equal(typeof value,'string');assert.ok(value.trim());assert.doesNotMatch(value,/<|>|—/u);}}
  const retired=rows.find(r=>r.id==='retrait');assert.equal(retired.panels[0].date,'17.04.2025');assert.equal(retired.panels[1].date,'24.07.2025');assert.match(retired.panels[1].text,lang==='fr'?/reste du rescrit subsiste/u:/rest of the guidance remains/u);
  const market=rows.find(r=>r.id==='marche');assert.equal(market.panels[0].date,'28.11.2024');assert.match(market.panels[0].text,lang==='fr'?/rejeté/u:/rejected/u);assert.equal(market.panels[1].date,'27.01.2025');assert.equal(market.panels[2].date,'17.04.2025');
  const timeline=rows.find(r=>r.id==='calendriers');assert.equal(timeline.panels[0].date,'16.02.2025');assert.equal(timeline.panels[1].date,'01.01.2026 / 16.03.2026');
 }
 for(const invalid of['de','__proto__',{},new String('fr'),null])assert.throws(()=>cumCumDoctrineComparison(invalid));
 const first=cumCumDoctrineComparison('fr');first[0].panels[0].sources.push('S99');assert.deepEqual(cumCumDoctrineComparison('fr')[0].panels[0].sources,['S01'],'Callers cannot mutate the published comparison data');
 const component=read('src/components/CumCumDoctrineComparison.astro');assert.match(component,/<details class="comparison-topic"/u);assert.match(component,/<summary>/u);assert.match(component,/aria-labelledby=\{titleId\}/u);assert.match(component,/@container \(max-width: 480px\)/u);assert.match(component,/minmax\(0, 1fr\)/u);assert.doesNotMatch(component,/client:|<script|set:html|innerHTML|on:click|sources-list|source-meta|#[0-9a-f]{3,8}\b/u);
});
