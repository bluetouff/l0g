import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import test from 'node:test';
import { nebiusFigureReferences } from '../src/lib/nebiusCreditFigures.mjs';
import { NEBIUS_KINDS, NEBIUS_SOURCES, nebiusScenes, inspectNebiusSvg, assertNebiusGeometry, tag, content } from './nebius-credit-svg-assertions.mjs';
import { assertFontLicenseReferences } from './font-license-assertions.mjs';
const read=p=>readFileSync(new URL(`../${p}`,import.meta.url),'utf8');
test('all twenty-eight bilingual native scenes have passive XML, chart geometry and compact readable proportions',()=>{
 assert.equal(nebiusScenes().length,28);
 for(const s of nebiusScenes()){
  assertNebiusGeometry(s.svg);
  assert.doesNotMatch(s.svg,/horlog|clock|deux calendriers|two schedules|#(?:[0-9a-f]{3})\b|<defs|<pattern|<ellipse/iu);
  const labels=inspectNebiusSvg(s.svg).all.filter(n=>tag(n)==='text').map(content).join(' ');
  if(s.kind==='spread')for(const v of s.lang==='fr'?['2,75 %','3,00 %','3,25 %','3,50 %']:['2.75%','3.00%','3.25%','3.50%'])assert.ok(labels.includes(v));
  if(s.kind==='capacity'){for(const v of['5 GW','170 MW'])assert.ok(labels.includes(v));assert.doesNotMatch(labels,/\bmai\b|\bMay\b/u);assert.match(labels,s.lang==='fr'?/fév/u:/February/u);}
  if(s.kind==='cash')for(const v of s.lang==='fr'?['4,504','4,395','8,130','3,626','9,160']:['4.504','4.395','8.130','3.626','9.160'])assert.ok(labels.includes(v));
 }
 assert.equal((4.395/4.504*100).toFixed(1),'97.6');
 for(const[share,expected]of[[.36,'13.497'],[.4,'14.996'],[.24,'8.998']])assert.equal((37.491*share).toFixed(3),expected);
});
test('geometry rejects viewBox leaks, long labels, unintended panel exits and connector strikes',()=>{
 const svg=nebiusScenes()[0].svg;
 for(const change of[s=>s.replace('x="69" y="311"','x="1420" y="311"'),s=>s.replace('>A. CLIENTS<','>CLIENTS AVEC UN LIBELLÉ BEAUCOUP TROP LONG POUR SON PANNEAU<'),s=>s.replace('M40 100 L1400 100','M40 300 L1400 300')]){const bad=change(svg);assert.notEqual(bad,svg);assert.throws(()=>assertNebiusGeometry(bad));}
});
test('closed figure inputs and XML reject external input, executable SVG and mismatched source references',()=>{
 for(let i=0;i<NEBIUS_KINDS.length;i++)assert.deepEqual(nebiusFigureReferences('fr',NEBIUS_KINDS[i],String(i+1).padStart(2,'0'),NEBIUS_SOURCES[i],'Caption'),NEBIUS_SOURCES[i].split(' '));
 for(const invalid of[undefined,null,{},new String('fr'),'__proto__'])assert.throws(()=>nebiusFigureReferences(invalid,'funding','01','01 03 04 06','Caption'));
 for(const sources of['','01 01','01 03','01 03 04 06 16','01 03 04 99','01 03 04 06\" onclick=\"x'])assert.throws(()=>nebiusFigureReferences('fr','funding','01',sources,'Caption'));
 const svg=nebiusScenes()[0].svg;
 for(const change of[s=>s.replace('</svg>','<script>alert(1)</script></svg>'),s=>s.replace('<svg ','<svg onload="x" '),s=>s.replace('</svg>','<image href="https://example.com/x" /></svg>'),s=>s.replace('var(--color-ink)','#11273e'),s=>s.replace('font-family="l0g Nebius Credit"','font-family="Arial"')])assert.throws(()=>inspectNebiusSvg(change(svg)));
});
test('existing licensed local font bytes and component responsive contract remain stable',()=>{
 const component=read('src/components/NebiusCreditFigure.astro');
 for(const[w,digest]of[[400,'98f2d74db16bb5f41f74adf6d899aeec92861682cccc58bfdbe4d9d7d0a5ae11'],[700,'21a0350a4ac2a9f22b6a7a8dcaf6abb08c8b546d06499301f1fcf10996fd0df5']]){const p=`public/fonts/stablecoins/dejavu-sans-${w}.ttf`;assert.equal(createHash('sha256').update(readFileSync(new URL(`../${p}`,import.meta.url))).digest('hex'),digest);assert.ok(component.includes(p.replace('public','')));}
 assertFontLicenseReferences(read('public/fonts/stablecoins/LICENSE.txt'),'dejavu');
 assert.match(component,/max-width:\s*48rem/u);assert.match(component,/max-width:\s*26rem/u);assert.match(component,/@container\s*\(max-width:\s*640px\)/u);assert.match(component,/padding-bottom:\s*1rem/u);assert.doesNotMatch(component,/overflow\s*:\s*(?:hidden|clip)|filter\s*:|client:|<script|fetch\(|@media\s*\(max-width:/iu);
});
