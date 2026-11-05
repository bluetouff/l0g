import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync,readdirSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {souveraineteScenes,SOUVERAINETE_KINDS,inspectSouveraineteSvg,assertSouveraineteGeometry,tag,attrs,content,labelBox} from './souverainete-svg-assertions.mjs';
import {assertFontLicenseReferences} from './font-license-assertions.mjs';
const scenes=souveraineteScenes(),read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const all=s=>inspectSouveraineteSvg(s.svg).all,words=s=>all(s).map(content).join(' '),data=(s,key)=>all(s).filter(n=>attrs(n)['data-metric']===key);

test('24 native scenes preserve responsive sizing, actual font bounds and accessible identities',()=>{
 assert.equal(scenes.length,24);assert.equal(readdirSync(new URL('../src/figures/souverainete-numerique-2026/',import.meta.url)).length,24);const ids=[];
 for(const s of scenes){assertSouveraineteGeometry(s.svg);assert.doesNotMatch(s.svg,/<script|foreignObject|—|#[a-f0-9]{3,8}\b|(?:deux|2) horloges|two clocks|mérite mieux que|deserves better than/iu);for(const n of all(s)){const a=attrs(n);if(a.id)ids.push(a.id);if(tag(n)==='text'){assert.ok(Number(a['font-size'])*(s.mobile?280/420:501/1000)>=12);assert.ok(labelBox(n).advance>0);}if(tag(n)==='title')assert.doesNotMatch(content(n),/\bce (?:qui|que|qu[’'])|\bwhat\b|, pas |, not /iu);}}
 assert.equal(ids.length,new Set(ids).size);
});
test('planned public budgets and the calculated remainder use the same proportional bar',()=>{
 for(const s of scenes.filter(s=>s.kind==='commitments')){const bars=[...data(s,'planned-public'),...data(s,'planned-remainder')],width=s.mobile?376:936;assert.deepEqual(bars.map(n=>Number(attrs(n)['data-value'])),[205.9,83.4]);assert.ok(Math.abs(205.9+83.4-289.3)<1e-12);assert.ok(Math.abs(bars.reduce((v,n)=>v+Number(attrs(n).width),0)-width)<1e-5);for(const n of bars)assert.ok(Math.abs(Number(attrs(n).width)/width-Number(attrs(n)['data-value'])/289.3)<1e-8);const t=words(s);assert.match(t,s.lang==='fr'?/près de la moitié/:/nearly half/);assert.doesNotMatch(t,/50\s*%|100\s*(?:Md|bn)/);}
});
test('the funding handover retains all three RRF deadlines and the proposed next MFF',()=>{
 for(const s of scenes.filter(s=>s.kind==='timeline')){const t=words(s);for(const y of['2026','2027','2028','2034'])assert.ok(t.includes(y));assert.match(t,s.lang==='fr'?/31 août/:/31 Aug/);assert.match(t,s.lang==='fr'?/30 sept\./:/30 Sept/);assert.match(t,s.lang==='fr'?/31 déc\./:/31 Dec/);assert.match(t,/DIGITAL/);assert.match(t,s.lang==='fr'?/Négociation en cours/:/Negotiations ongoing/);assert.doesNotMatch(t,/adopté|adopted/);}
});
test('chip observations, Commission projection and EU target remain distinct on a zero-based scale',()=>{
 for(const s of scenes.filter(s=>s.kind==='chips')){const bars=data(s,'eu-chip-share');assert.deepEqual(bars.map(n=>Number(attrs(n)['data-value'])),[9.9,9.8,11.7,20]);for(const[i,n]of bars.entries()){const a=attrs(n);assert.equal(Number(a.x),s.mobile?22:350);assert.ok(Math.abs(Number(a.width)/(s.mobile?376:560)-Number(a['data-value'])/20)<1e-8);assert.equal(a['stroke-dasharray'],i>=2?'6 5':undefined);if(i===3)assert.equal(a.fill,'none');}const t=words(s);assert.match(t,/0 (?:à|to) 20/);assert.match(t,s.lang==='fr'?/Commission, projection juillet 2024/:/Commission projection, July 2024/);assert.match(t,s.lang==='fr'?/cible UE/:/EU target/);}
});
test('cloud and AI adoption bars share a visible 0-100 percent scale without rescaling the 55 percent bar',()=>{
 for(const s of scenes.filter(s=>s.kind==='adoption')){const cloud=data(s,'paid-cloud'),ai=data(s,'ai-adoption'),width=s.mobile?376:440;assert.equal(cloud.length,1);assert.equal(Number(attrs(cloud[0])['data-value']),52.7);assert.deepEqual(ai.map(n=>Number(attrs(n)['data-value'])),[55,18.9,20]);for(const n of[...cloud,...ai])assert.ok(Math.abs(Number(attrs(n).width)/width-Number(attrs(n)['data-value'])/100)<1e-8);const t=words(s);assert.match(t,/0 (?:à|to) 100/);assert.match(t,s.lang==='fr'?/10 à 249/:/10-249/);assert.match(t,s.lang==='fr'?/Indicateurs distincts/:/Separate indicators/);}
});
test('AI gigafactory procurement and the private-investment goal reach an operator through separate conditional levers',()=>{
 for(const s of scenes.filter(s=>s.kind==='giga')){const t=words(s);assert.match(t,s.lang==='fr'?/JUSQU’À 10 Md€/:/UP TO €10bn/);assert.match(t,s.lang==='fr'?/20 Md€ MINIMUM/:/€20bn MINIMUM/);assert.match(t,s.lang==='fr'?/achat de temps de calcul/:/purchases of computing time/);assert.match(t,s.lang==='fr'?/à mobiliser/:/to be mobilised/);assert.match(t,s.lang==='fr'?/Montants conditionnels/:/Conditional amounts/);assert.equal(all(s).filter(n=>attrs(n)['data-connector']==='public-procurement').length,2);assert.equal(all(s).filter(n=>attrs(n)['data-connector']==='private-investment').length,2);assert.doesNotMatch(t,/subvention|subsidy|30\s*(?:Md|bn)/i);}
});
test('the analytical chain includes recurring funding needs rather than an invented measured causal series',()=>{
 for(const s of scenes.filter(s=>s.kind==='system')){const t=words(s);assert.match(t,s.lang==='fr'?/Modèle analytique l0g/:/l0g analytical model/);assert.match(t,s.lang==='fr'?/Renouvellement/:/Renewal/);assert.equal(all(s).filter(n=>attrs(n)['data-connector']==='stage').length,6);assert.equal(all(s).filter(n=>attrs(n)['data-connector']==='renewal').length,2);assert.equal(all(s).filter(n=>attrs(n)['data-value']!==undefined).length,0);}
});
test('the component uses controlled imports, validated variants and existing canonical font licences',()=>{
 const c=read('src/components/SouveraineteNumeriqueFigure.astro');assertFontLicenseReferences(read('public/fonts/stablecoins/LICENSE.txt'),'dejavu');for(const k of SOUVERAINETE_KINDS)for(const l of['fr','en'])for(const m of['desktop','mobile'])assert.ok(c.includes(`../figures/souverainete-numerique-2026/${k}.${l}.${m}.svg?raw`));assert.match(c,/Object\.prototype\.hasOwnProperty\.call\(captions,kind\)/);assert.match(c,/@container\(max-width:500px\)/);assert.match(c,/max-width:340px/);assert.match(c,/padding-bottom:1rem/);assert.doesNotMatch(c,/overflow\s*:\s*hidden|Arial|Helvetica/);assert.match(c,/href=\{`#source-\$\{id\}`\}/);assert.match(c,/EuroHPC décrit un achat de temps de calcul/);for(const w of[400,700])assert.ok(c.includes(`/fonts/stablecoins/dejavu-sans-${w}.ttf`));
});
test('source geometry rejects active nodes, resource access, unknown panels and overflowing text',()=>{
 const raw=scenes[0].svg;for(const mutate of[s=>s.replace('</svg>','<script>x</script></svg>'),s=>s.replace('<svg ','<svg onload="x" '),s=>s.replace('</svg>','<image href="https://example.invalid/a"/></svg>'),s=>s.replace('l0g Souverainete','Arial'),s=>s.replace(/data-panel="[^"]+"/u,'data-panel="missing"'),s=>s.replace('x="32" y="40"','x="995" y="40"')]){const changed=mutate(raw);assert.notEqual(changed,raw);assert.throws(()=>assertSouveraineteGeometry(changed));}
});
test('shared complete-input path validation rejects malformed numerics within a bounded deadline',()=>{
 const input=new URL('./insurance-returns-svg-assertions.mjs',import.meta.url).href;execFileSync(process.execPath,['--input-type=module','-e',`import assert from 'node:assert/strict';import{pathPoints}from ${JSON.stringify(input)};for(const value of ['M'+'9'.repeat(100000)+'x','M1 1 L2','M1 1 L2 2 trailing','M0 0 Q1e999 0 4 4'])assert.throws(()=>pathPoints(value));`],{timeout:3000,stdio:'pipe'});
});
