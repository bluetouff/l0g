import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import test from 'node:test';
import {cesHouseholdsFigureReferences} from '../src/lib/cesHouseholdsFigures.mjs';
import {CES_HOUSEHOLDS_KINDS,CES_HOUSEHOLDS_SOURCES,cesHouseholdsScenes,inspectCesHouseholdsSvg,assertCesHouseholdsGeometry,tag,attrs,content} from './ces-households-svg-assertions.mjs';
import {pathPoints} from './insurance-returns-svg-assertions.mjs';
import {assertFontLicenseReferences} from './font-license-assertions.mjs';
const read=p=>readFileSync(new URL(`../${p}`,import.meta.url),'utf8');
const close=(actual,expected)=>assert.ok(Math.abs(Number(actual)-expected)<.000002,`${actual} matches ${expected}`);
test('all twenty-eight passive bilingual scenes keep legible glyphs, semantic colours, explicit panel ownership and compact desktop geometry',()=>{
 const scenes=cesHouseholdsScenes();assert.equal(scenes.length,28);
 for(const s of scenes){assertCesHouseholdsGeometry(s.svg);const {all}=inspectCesHouseholdsSvg(s.svg),labels=all.filter(n=>tag(n)==='text').map(content).join(' '),bars=all.filter(n=>tag(n)==='rect'&&!attrs(n).id),lines=all.filter(n=>tag(n)==='line'),circles=all.filter(n=>tag(n)==='circle');assert.doesNotMatch(content(all.find(n=>tag(n)==='title')),/\bce (?:que|qui|qu[’'])|\bwhat\b|horlog|clock/iu);assert.doesNotMatch(s.svg,/<defs|<pattern|<g\b|transform=|#[0-9a-f]{3,8}\b|—/iu);assert.doesNotMatch(labels,/\[S\d{2}\s+S\d{2}/u,'Multiple visible references use commas');
  if(s.kind==='horizons'){
   assert.equal(circles.length,8);const start=s.mobile?30:318,len=s.mobile?360:620;for(const[i,v]of[3,3.1,2.9,2.9,2.5,2.5].entries())close(attrs(circles[i+2]).cx,start+len*v/4);assert.equal(lines.filter(n=>attrs(n).stroke==='var(--color-amber)').length,3);for(const v of['0–12','24–36','48–60'])assert.ok(labels.includes(v)||content(all.find(n=>tag(n)==='desc')).includes(v));
  }
  if(s.kind==='energy'){
   assert.equal(bars.length,6);const w=s.mobile?376:440;for(const[i,v]of[9.03,45].entries())close(attrs(bars[i]).width,w*v/100);for(const[i,v]of[1.71,1.52,.29,.25].entries())close(attrs(bars[i+2]).width,(s.mobile?376:390)*v/2);assert.ok(labels.includes(s.lang==='fr'?'3,77':'3.77'));assert.ok(labels.includes(s.lang==='fr'?'3,8':'3.8'));assert.match(labels,/21/);close(1.71/3.8*100,45);close(1.71+1.52+.29+.25,3.77);
  }
  if(s.kind==='gap'){
   assert.equal(bars.length,6);const measures=bars.slice(2);for(const[i,v]of[1,3.6,1.1,3.7].entries())close(attrs(measures[i]).width,(s.mobile?342:620)*v/4);assert.equal(all.filter(n=>tag(n)==='text'&&content(n)===(s.lang==='fr'?'2,6 points':'2.6 points')).length,2);close(3.6-1,3.7-1.1);
  }
  if(s.kind==='budgets'){
   assert.equal(bars.length,8);const scale=(s.mobile?220:207)/350;for(const[j,[start,cost,end]]of[[250,83.25,194.25],[25,91.575,-39.075]].entries()){for(const[i,v]of[start,27.5,cost,Math.abs(end)].entries())close(attrs(bars[j*4+i]).height,v*scale);assert.ok(labels.includes(s.lang==='fr'?['194,25','39,08'][j]:['194.25','39.08'][j]));}assert.match(labels,/FICTIF|FICTIONAL/);assert.ok(labels.includes(s.lang==='fr'?'-91,58':'-91.58'));assert.equal((250000*1011-225000*1037)/100000,194.25);close(2500*1.011-2475*1.037,-39.075);
  }
  if(s.kind==='gradient'){
   assert.equal(bars.length,8);const values=[[1.5,1.2,2],[13.6,9.7,16],[5.7,4.4,6]];for(const[i,[low,high,max]]of values.entries())for(const[j,v]of[low,high].entries())close(attrs(bars[2+i*2+j]).width,(s.mobile?318:440)*v/max);assert.match(labels,s.lang==='fr'?/Trois échelles distinctes/u:/Three separate scales/u);
  }
  if(s.kind==='uncertainty'){
   assert.equal(bars.length,6);for(const[i,v]of[53,42,37,26].entries())close(attrs(bars[i+2]).width,(s.mobile?340:600)*v/60);assert.ok(labels.includes('2025'));assert.equal((labels.match(/11 points/gu)??[]).length,2);assert.match(labels,/HISTORI/);assert.equal(53-42,37-26);
  }
  if(s.kind==='transmission'){
   assert.equal(all.filter(n=>tag(n)==='path').length,8,'Four conditional relations retain four visible painted arrowheads');assert.equal(all.filter(n=>tag(n)==='path'&&attrs(n)['stroke-dasharray']).length,4);assert.equal(all.filter(n=>tag(n)==='rect'&&attrs(n).id?.includes('-card-')).length,5);assert.match(labels,s.lang==='fr'?/répartition/u:/distributed/u);assert.match(labels,s.lang==='fr'?/conditionnel/u:/conditional/u);
  }
 }
 assert.ok(22*501/1000>=11);assert.ok(17*280/420>=11);assert.ok(650*768/1000<500);
});
test('closed figure and citation contracts reject duplicate, reordered and unknown references',()=>{
 for(let i=0;i<CES_HOUSEHOLDS_KINDS.length;i++)for(const lang of['fr','en'])assert.deepEqual(cesHouseholdsFigureReferences(lang,CES_HOUSEHOLDS_KINDS[i],String(i+1).padStart(2,'0'),CES_HOUSEHOLDS_SOURCES[i],'Caption'),CES_HOUSEHOLDS_SOURCES[i].split(' '));
 for(const lang of[undefined,null,{},new String('fr'),'__proto__'])assert.throws(()=>cesHouseholdsFigureReferences(lang,'energy','02','S02','Caption'));
 for(const src of['','S01','S02 S02','S02 S16','S03 S01 S04 S13'])assert.throws(()=>cesHouseholdsFigureReferences('fr','energy','02',src,'Caption'));
 assert.throws(()=>cesHouseholdsFigureReferences('fr','horizons','02','S01 S03 S04 S13','Caption'));assert.throws(()=>cesHouseholdsFigureReferences('fr','energy','02','S02',' '));
});
test('passive SVG, panel ownership, glyph bounds and whole path grammar reject malicious or unreadable mutations',()=>{
 const svg=cesHouseholdsScenes().find(s=>s.lang==='fr'&&s.kind==='transmission'&&s.mobile).svg;
 for(const change of[s=>s.replace('</svg>','<script>alert(1)</script></svg>'),s=>s.replace('<svg ','<svg onload="x" '),s=>s.replace('</svg>','<image href="https://example.com/x"/></svg>'),s=>s.replace('var(--color-paper)','#11273e'),s=>s.replace('font-family="l0g CES Households"','font-family="Arial"'),s=>s.replace('font-size="17"','font-size="10"'),s=>s.replace('<rect ','<rect opacity="0" ')]){const bad=change(svg);assert.notEqual(bad,svg);assert.throws(()=>inspectCesHouseholdsSvg(bad));}
 for(const change of[s=>s.replace('>Prix futurs attendus en hausse<','>UN TITRE EXTRAORDINAIREMENT LONG QUI DÉBORDE DU CADRE<'),s=>s.replace('data-panel="ces-fr-transmission-m-card-start"','data-panel="ces-fr-transmission-m-card-buy"'),s=>s.replace('x="36" y="236"','x="400" y="236"')]){const bad=change(svg);assert.notEqual(bad,svg);assert.throws(()=>assertCesHouseholdsGeometry(bad));}
 for(const d of['M 0 0 L 3 4 trailing','M 0 0 Q 1 1 2 2','M 0 0 L Infinity 4','M 0 0 L 3','L 0 0','M 0 0 M 3 4'])assert.throws(()=>pathPoints(d));
});
test('existing licensed fonts and scoped component styles preserve theme adaptation, mobile contract and unbroken headings',()=>{
 const component=read('src/components/CesHouseholdsFigure.astro');for(const w of[400,700]){const p=`public/fonts/stablecoins/dejavu-sans-${w}.ttf`;assert.ok(readFileSync(new URL(`../${p}`,import.meta.url)).length<60000);assert.ok(component.includes(p.replace('public','')));assert.equal(createHash('sha256').update(readFileSync(new URL(`../${p}`,import.meta.url))).digest('hex'),w===400?'98f2d74db16bb5f41f74adf6d899aeec92861682cccc58bfdbe4d9d7d0a5ae11':'21a0350a4ac2a9f22b6a7a8dcaf6abb08c8b546d06499301f1fcf10996fd0df5');}
 assertFontLicenseReferences(read('public/fonts/stablecoins/LICENSE.txt'),'dejavu');assert.match(component,/max-width:\s*48rem/u);assert.match(component,/max-width:\s*26rem/u);assert.match(component,/@container\s*\(max-width:\s*500px\)/u);assert.match(component,/padding-bottom:\s*1rem/u);assert.match(component,/:global\(article:has\(\.ces-households-figure\) \.post-title\)\s*\{\s*hyphens:\s*none/u);assert.doesNotMatch(component,/overflow\s*:\s*(?:hidden|clip)|filter\s*:|client:|<script|fetch\(|@media\s*\(max-width:/iu);
});
