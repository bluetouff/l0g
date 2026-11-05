import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync,readdirSync} from 'node:fs';
import {AIRFARE_AGENTS_KINDS,airfareAgentsScenes,inspectAirfareAgentsSvg,assertAirfareAgentsGeometry,tag,attrs,content} from './airfare-agents-svg-assertions.mjs';
import {assertFontLicenseReferences} from './font-license-assertions.mjs';
const scenes=airfareAgentsScenes(),read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const all=s=>inspectAirfareAgentsSvg(s.svg).all,words=s=>all(s).map(content).join(' '),metrics=(s,key)=>all(s).filter(n=>attrs(n)['data-metric']===key).map(n=>Number(attrs(n)['data-value']));

test('20 native scenes are safe, accessible, compact and readable with actual font bounds',()=>{
 assert.equal(scenes.length,20);assert.equal(readdirSync(new URL('../src/figures/airfare-agents-2026/',import.meta.url)).length,20);const ids=[];
 for(const s of scenes){assertAirfareAgentsGeometry(s.svg);assert.doesNotMatch(s.svg,/<script|foreignObject|—|#[a-f0-9]{3,8}\b|(?:deux|2) horloges|two clocks|mérite mieux que|deserves better than/iu);for(const n of all(s)){const a=attrs(n);if(a.id)ids.push(a.id);if(tag(n)==='text')assert.ok(Number(a['font-size'])*(s.mobile?280/420:501/1000)>=12);if(tag(n)==='title')assert.doesNotMatch(content(n),/\bce (?:qui|que|qu[’'])|\bwhat\b|, pas |, not /iu);}}
 assert.equal(ids.length,new Set(ids).size);
});
test('last-seat expected revenue and break-even probability use explicitly hypothetical inputs',()=>{
 for(const s of scenes.filter(s=>s.kind==='decision')){assert.deepEqual(metrics(s,'immediate-offer'),[180]);assert.deepEqual(metrics(s,'future-probability'),[40,80]);assert.deepEqual(metrics(s,'expected-revenue'),[120,240]);assert.deepEqual(metrics(s,'threshold'),[60]);assert.equal(300*.4,120);assert.equal(300*.8,240);assert.equal(180/300*100,60);const t=words(s);assert.match(t,s.lang==='fr'?/hypothétique/:/Hypothetical/);assert.match(t,/300/);assert.match(t,s.lang==='fr'?/Vendre|Conserver/:/Sell|Keep/);}
});
test('request and intention conversion preserve the same synthetic cohort and different denominators',()=>{
 for(const s of scenes.filter(s=>s.kind==='conversion')){assert.deepEqual(metrics(s,'intentions'),[1000]);assert.deepEqual(metrics(s,'bookings'),[100]);assert.deepEqual(metrics(s,'requests-per-intention'),[10,1000]);assert.deepEqual(metrics(s,'total-requests'),[10000,1000000]);assert.deepEqual(metrics(s,'request-conversion'),[1,.01]);assert.deepEqual(metrics(s,'intention-conversion'),[10]);assert.equal(100/10000*100,1);assert.equal(100/1000000*100,.01);assert.equal(100/1000*100,10);const t=words(s);assert.match(t,s.lang==='fr'?/Cohorte synthétique/:/Synthetic cohort/);}
});
test('exploration keeps cached comparison, live checks and binding approval as distinct stages',()=>{
 for(const s of scenes.filter(s=>s.kind==='pipeline')){const t=words(s);for(const stage of s.lang==='fr'?['Explorer','Mutualiser','Sélectionner','Revérifier','Confirmer']:['Explore','Share results','Select','Recheck','Confirm'])assert.ok(t.includes(stage),stage);assert.match(t,s.lang==='fr'?/Achat distinct|Accord explicite pour acheter/:/Separate purchase|Explicit approval to buy/);assert.match(t,/IATA \[08\], Sabre \[09\]/);assert.match(t,s.lang==='fr'?/Architecture proposée/:/Proposed design/);}
});
test('the four channels preserve their own evidence levels without estimating an airfare effect',()=>{
 for(const s of scenes.filter(s=>s.kind==='channels')){const t=words(s);for(const stage of s.lang==='fr'?['Consultations','Signal biaisé','Retenues','Comparaison']:['Searches','Biased signal','Seat holds','Comparison'])assert.ok(t.includes(stage),stage);assert.match(t,s.lang==='fr'?/aucun effet net chiffré/:/no quantified net effect/);assert.match(t,s.lang==='fr'?/Menace générique/:/Generic threat/);assert.match(t,/\[04, 05\]/);assert.match(t,/\[08, 09\]/);assert.match(t,/\[10\]/);assert.doesNotMatch(t,/OAT-016|skewing|%/);}
});
test('privacy design keeps sensitive constraints private and separates an offer from approval to buy',()=>{
 for(const s of scenes.filter(s=>s.kind==='privacy')){const t=words(s);assert.match(t,s.lang==='fr'?/protectrice proposée/:/Proposed protective design/);assert.match(t,s.lang==='fr'?/Budget, urgence, flexibilité/:/Budget, urgency, flexibility/);assert.match(t,s.lang==='fr'?/Trajet, dates, passagers/:/Route, dates, passengers/);assert.match(t,s.lang==='fr'?/ACCORD EXPLICITE|PERMISSION DISTINCTE/:/EXPLICIT APPROVAL|SEPARATE PERMISSION/);assert.match(t,s.lang==='fr'?/donnée[s]? à examiner/:/data to examine/);assert.match(t,/\[12, 13\]/);}
});
test('component uses controlled raw imports, source targets, responsive variants and licensed local fonts',()=>{
 const c=read('src/components/AirfareAgentsFigure.astro');assertFontLicenseReferences(read('public/fonts/stablecoins/LICENSE.txt'),'dejavu');for(const k of AIRFARE_AGENTS_KINDS)for(const l of['fr','en'])for(const m of['desktop','mobile'])assert.ok(c.includes(`../figures/airfare-agents-2026/${k}.${l}.${m}.svg?raw`));assert.match(c,/Object\.prototype\.hasOwnProperty\.call\(captions,kind\)/);assert.match(c,/@container\(max-width:500px\)/);assert.match(c,/max-width:340px/);assert.match(c,/padding-bottom:1rem/);assert.doesNotMatch(c,/overflow\s*:\s*hidden|Arial|Helvetica/);assert.match(c,/href=\{`#source-\$\{id\}`\}/);for(const w of[400,700])assert.ok(c.includes(`/fonts/stablecoins/dejavu-sans-${w}.ttf`));assert.match(c,/vendeur neutre au risque/);assert.match(c,/sans relation estimée avec un volume de requêtes/);assert.match(c,/fréquence aérienne mesurée/);assert.match(c,/n’attribue à aucune entreprise/);
});
test('source validation rejects active markup, external resources, unexpected metrics and overflow',()=>{
 const raw=scenes[0].svg;
 for(const altered of[raw.replace('</svg>','<script>alert(1)</script></svg>'),raw.replace('<svg ','<svg onload="x" '),raw.replace('<svg ','<svg href="https://example.invalid/" '),raw.replace('data-metric="immediate-offer"','data-metric="unknown"'),raw.replace('x="32" y="42"','x="990" y="42"')])assert.throws(()=>assertAirfareAgentsGeometry(altered));
});
