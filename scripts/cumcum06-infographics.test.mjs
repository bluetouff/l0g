import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';
import {cumCumReformFigureReferences} from '../src/lib/cumCumReformFigures.mjs';
import {CUMCUM06_KINDS,CUMCUM06_SOURCES,cumCumReformScenes,inspectCumCumReformSvg,assertCumCumReformGeometry,labelBox,tag,attrs,content} from './cumcum06-svg-assertions.mjs';
import {assertFontLicenseReferences} from './font-license-assertions.mjs';
const read=p=>readFileSync(new URL(`../${p}`,import.meta.url),'utf8');
const labelsOf=all=>all.filter(n=>tag(n)==='text').map(content).join(' ');
const rect=(all,suffix)=>attrs(all.find(n=>tag(n)==='rect'&&attrs(n).id?.endsWith(suffix)));
const near=(a,b)=>assert.ok(Math.abs(Number(a)-b)<.000002,`${a} matches ${b}`);
test('twenty bilingual scenes preserve hypothetical cash flows, evidence checks, statutory periods and waterfall arithmetic',()=>{
 const scenes=cumCumReformScenes();assert.equal(scenes.length,20);
 for(const s of scenes){
  assertCumCumReformGeometry(s.svg);const{root,all}=inspectCumCumReformSvg(s.svg),labels=labelsOf(all),texts=all.filter(n=>tag(n)==='text');
  assert.doesNotMatch(s.svg,/<defs|<pattern|<g\b|transform=|#[0-9a-f]{3,8}\b|—/iu);
  for(const n of all.filter(n=>['title','desc','text'].includes(tag(n))))assert.doesNotMatch(content(n),/horloge|\bclocks?\b/iu);
  assert.doesNotMatch(content(all.find(n=>tag(n)==='title')),/\bce (?:que|qui|qu[’'])|\bwhat\b/iu);
  const [,,,h]=attrs(root).viewBox.split(' ').map(Number);assert.ok(Math.min(...texts.map(n=>h-labelBox(n).y2))>=20,'At least20 SVG units below painted text');
  if(s.kind==='cash'){
   const w=s.mobile?340:666;near(rect(all,'-bar-gross').width,w);near(rect(all,'-bar-investor').width,w*.75);near(rect(all,'-bar-tax').width,w*.25);near(rect(all,'-bar-investor-final').width,w*.75);near(rect(all,'-bar-refund').width,w*.25);
   for(const v of['100','75','25','0','S01'])assert.ok(labels.includes(v));assert.match(labels,s.lang==='fr'?/Exemple fictif/u:/Fictional example/u);assert.match(labels,s.lang==='fr'?/Exonération complète établie/u:/Full exemption established/u);
  }
  if(s.kind==='chain'){
   assert.equal(all.filter(n=>tag(n)==='rect'&&attrs(n).id?.includes('-card-flow-')).length,4);for(const v of['eTRC','S04','10–12','II'])assert.ok(labels.includes(v));assert.match(labels,s.lang==='fr'?/Résidence fiscale/u:/Tax residence/u);assert.match(labels,s.lang==='fr'?/Droit au revenu et arrangements liés/u:/Entitlement and related arrangements/u);
  }
  if(s.kind==='clock'){
   for(const v of['15.03.2030','31.05.2030','30.07.2030','137','77','60','14','S04'])assert.ok(labels.includes(v));assert.match(labels,s.lang==='fr'?/14 jours calendaires/u:/14 calendar days/u);assert.match(labels,s.lang==='fr'?/sous réserve de vérifications/u:/subject to further checks/u);assert.match(labels,s.lang==='fr'?/Exemple/u:/illustration|Illustration/u);
   if(!s.mobile){near(rect(all,'-bar-application').width,952*77/137);near(rect(all,'-bar-processing').width,952*60/137);}
  }
  if(s.kind==='yield'){
   for(const[i,[top,height]]of[[340,180],[250,90],[250,45],[295,225]].entries()){const r=rect(all,'-bar-'+i);near(r.y,top);near(r.height,height);near(r.width,s.mobile?50:140);}
   for(const v of['120','+60','−30','150','12','10','500','−2'])assert.ok(labels.includes(v));assert.match(labels,s.lang==='fr'?/Scénario fictif/u:/Fictional scenario/u);assert.match(labels,s.lang==='fr'?/après restitutions/u:/after refunds/u);
  }
  if(s.kind==='horizon'){
   for(const v of['28.10.2026','16.02.2025','01.01.2026','31.12.2028','01.01.2030','31.12.2032','31.12.2034','S02','S03','S04'])assert.ok(labels.includes(v));assert.equal(all.filter(n=>tag(n)==='rect'&&attrs(n).id?.includes('-card-milestone-')).length,6);assert.match(labels,s.lang==='fr'?/espacement schématique/u:/schematic spacing/u);
  }
 }
 const days=(a,b)=>(Date.parse(b+'T00:00:00Z')-Date.parse(a+'T00:00:00Z'))/86400000;assert.equal(days('2030-03-15','2030-05-31'),77);assert.equal(days('2030-05-31','2030-07-30'),60);assert.equal(days('2030-03-15','2030-07-30'),137);assert.equal(100-25+25,100);assert.equal(25-25,0);near(1000*.12,120);near(500*.12,60);near(1500*-.02,-30);near(120+60-30,150);near((150/120-1)*100,25);
});
test('closed bilingual contracts allow the unsourced hypothetical calculation only in its reviewed figure',()=>{
 for(let i=0;i<5;i++)for(const lang of['fr','en'])assert.deepEqual(cumCumReformFigureReferences(lang,CUMCUM06_KINDS[i],String(i+1).padStart(2,'0'),CUMCUM06_SOURCES[i],'Caption'),CUMCUM06_SOURCES[i]?CUMCUM06_SOURCES[i].split(' '):[]);
 for(const lang of[undefined,null,{},new String('fr'),'__proto__'])assert.throws(()=>cumCumReformFigureReferences(lang,'cash','01','S01','Caption'));
 for(const src of['','S01 S01','S00','S05','S02',new String('S01'),{}])assert.throws(()=>cumCumReformFigureReferences('fr','cash','01',src,'Caption'));
 assert.throws(()=>cumCumReformFigureReferences('fr','cash','02','S01','Caption'));assert.throws(()=>cumCumReformFigureReferences('fr','cash','01','S01',' '));assert.throws(()=>cumCumReformFigureReferences('fr','yield','04','S01','Caption'));
});
test('passive XML, fully consumed paths, glyph coverage and ownership reject concealed or clipped alterations',()=>{
 const svg=cumCumReformScenes().find(s=>s.lang==='fr'&&s.kind==='chain'&&s.mobile).svg;
 for(const change of[s=>s.replace('</svg>','<script>alert(1)</script></svg>'),s=>s.replace('<svg ','<svg onload="x" '),s=>s.replace('</svg>','<image href="https://example.com/x"/></svg>'),s=>s.replace('var(--color-ink)','#11273e'),s=>s.replace('font-family="l0g CumCum06"','font-family="Arial"'),s=>s.replace('font-size="17"','font-size="10"'),s=>s.replace('<rect ','<rect opacity="0" ')]){const bad=change(svg);assert.notEqual(bad,svg);assert.throws(()=>inspectCumCumReformSvg(bad));}
 for(const change of[s=>s.replace('>01 / Émetteur<','>💥<'),s=>s.replace('>01 / Émetteur<','>UN TITRE EXTRAORDINAIREMENT LONG QUI DÉBORDE DU CADRE<'),s=>s.replace('data-panel="cumcum06-fr-chain-m-card-flow-0"','data-panel="cumcum06-fr-chain-m-card-flow-1"'),s=>s.replace('x="40" y="201"','x="410" y="201"')]){const bad=change(svg);assert.notEqual(bad,svg);assert.throws(()=>assertCumCumReformGeometry(bad));}
 for(const suffix of[' junk',' Q 1 2',' L Infinity 3',' L 100000 2'])assert.throws(()=>inspectCumCumReformSvg(svg.replace(/d="(M[^"]+)"/u,(_,d)=>`d="${d}${suffix}"`)));
});
test('dedicated licensed fonts and responsive containers retain theme-native compact readable proportions',()=>{
 const component=read('src/components/CumCumReformFigure.astro');for(const w of[400,700]){const p=`public/fonts/cumcum06/dejavu-sans-${w}.ttf`;assert.ok(readFileSync(new URL(`../${p}`,import.meta.url)).length<60000);assert.ok(component.includes(p.replace('public','')));}
 assertFontLicenseReferences(read('public/fonts/cumcum06/LICENSE.txt'),'dejavu');assert.match(component,/max-width:\s*48rem/u);assert.match(component,/max-width:\s*26rem/u);assert.match(component,/@container\s*\(max-width:\s*500px\)/u);assert.match(component,/padding-bottom:\s*1rem/u);assert.match(component,/\.cumcum06-figure \.figure-cites a\s*\{[^}]*font-size:\s*\.8125rem;\s*line-height:\s*1\.7/u);assert.doesNotMatch(component,/overflow\s*:\s*(?:hidden|clip)|filter\s*:|client:|<script|fetch\(|@media\s*\(max-width:|sources-list|source-meta/iu);assert.ok(22*501/1000>=11);assert.ok(17*280/420>=11);assert.ok(720*768/1000<560);
});
