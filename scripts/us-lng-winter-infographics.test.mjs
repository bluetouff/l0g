import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync,readdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {usLngWinterScenes,US_LNG_WINTER_KINDS,inspectUSLNGWinterSvg,assertUSLNGWinterGeometry,tag,attrs,content,labelBox} from './us-lng-winter-svg-assertions.mjs';
import {assertFontLicenseReferences} from './font-license-assertions.mjs';
const scenes=usLngWinterScenes(), read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const all=s=>inspectUSLNGWinterSvg(s.svg).all,words=s=>all(s).map(content).join(' '),data=(s,key)=>all(s).filter(n=>attrs(n)['data-metric']===key);

test('24 native scenes have readable real-font bounds, compact layouts and unique accessible labels',()=>{
 assert.equal(scenes.length,24);assert.equal(readdirSync(new URL('../src/figures/us-lng-winter-2026/',import.meta.url)).length,24);const ids=[];
 for(const s of scenes){assertUSLNGWinterGeometry(s.svg);assert.doesNotMatch(s.svg,/<script|foreignObject|—|#[a-f0-9]{3,8}\b|(?:deux|2) horloges|two clocks|mérite mieux que|deserves better than/iu);for(const n of all(s)){const a=attrs(n);if(a.id)ids.push(a.id);if(tag(n)==='text'){assert.ok(Number(a['font-size'])*(s.mobile?280/420:501/1000)>=12);assert.ok(labelBox(n).advance>0);}if(tag(n)==='title')assert.doesNotMatch(content(n),/\bce (?:qui|que|qu[’'])|\bwhat\b|, pas |, not /iu);}}
 assert.equal(ids.length,new Set(ids).size);
});
test('storage bars retain the independently checked displayed 4 November snapshot and common scale',()=>{
 for(const s of scenes.filter(s=>s.kind==='stocks')){const bars=data(s,'storage'),vals=[74.33,60.81,85.68,90.73,65.47,99.14];assert.deepEqual(bars.map(n=>Number(attrs(n)['data-value'])),vals);for(const n of bars){const a=attrs(n);assert.equal(Number(a.x),s.mobile?22:242);assert.ok(Math.abs(Number(a.width)/(s.mobile?376:430)-Number(a['data-value'])/100)<1e-6);}const t=words(s);for(const n of ['841.63','150.41','106.13','184.56','94.31','36.53'])assert.ok(t.includes(s.lang==='fr'?n.replace('.',','):n));assert.match(t,s.lang==='fr'?/Relevé affiché le 4 novembre 2026/:/Reading displayed 4 November 2026/);assert.doesNotMatch(t,/74[.,]56|844[.,]25|2 novembre|2 November/);}
});
test('supply reference bars distinguish signed rounded bounds and an approximate net estimate',()=>{
 for(const s of scenes.filter(s=>s.kind==='supply')){const bars=data(s,'supply-reference');assert.deepEqual(bars.map(n=>Number(attrs(n)['data-value'])),[-60,40,-20]);for(const n of bars){const a=attrs(n),zero=s.mobile?220:530,v=Number(a['data-value']);assert.equal(Number(a.x),zero+Math.min(v,0)*(s.mobile?2.7:6));assert.equal(Number(a.width),Math.abs(v)*(s.mobile?2.7:6));}const t=words(s);assert.match(t,s.lang==='fr'?/Plus de 60/:/Over 60/);assert.match(t,s.lang==='fr'?/Plus de 40/:/Over 40/);assert.match(t,/~ −20/);assert.match(t,/2026 \/ 2025/);assert.match(t,s.lang==='fr'?/estimation distincte/:/separate estimate/);assert.match(t,/Qatar/);}
});
test('annual export history and forecasts have proportional zero-based bars and distinct forecast outlines',()=>{
 for(const s of scenes.filter(s=>s.kind==='exports')){const bars=data(s,'us-exports');assert.deepEqual(bars.map(n=>Number(attrs(n)['data-value'])),[15.1,17.6,18.6]);for(const[i,n]of bars.entries()){const a=attrs(n),base=s.mobile?600:500;assert.ok(Math.abs(Number(a.y)+Number(a.height)-base)<1e-5);assert.ok(Math.abs(Number(a.height)/(s.mobile?360:280)-Number(a['data-value'])/20)<1e-5);assert.equal(a['stroke-dasharray'],i?'6 5':undefined);}const t=words(s);for(const y of['2025','2026','2027'])assert.ok(t.includes(y));assert.match(t,s.lang==='fr'?/réalisé/:/actual/);assert.match(t,s.lang==='fr'?/prévu/:/forecast/);assert.match(t,s.lang==='fr'?/6 octobre 2026/:/6 October 2026/);}
});
test('cargo allocation shows two delivery routes and explains the unmeasured freight adjustment',()=>{
 for(const s of scenes.filter(s=>s.kind==='arbitrage')){assert.equal(all(s).filter(n=>attrs(n)['data-connector']==='route').length,2);const t=words(s);assert.match(t,/TTF/);assert.match(t,s.lang==='fr'?/ASIE \/ GNL/:/ASIA \/ LNG/);assert.match(t,/~ 20/);assert.match(t,s.lang==='fr'?/21,5/:/21\.5/);assert.match(t,/million BTU/);assert.match(t,s.lang==='fr'?/fret/:/freight/);assert.match(t,s.lang==='fr'?/mars-octobre 2026/:/March-October 2026/);}
});
test('Eurostat origin shares are explicitly by value and sum to one full import bill',()=>{
 for(const s of scenes.filter(s=>s.kind==='origins')){const bars=data(s,'lng-import-value-share'),values=[63.2,17.3,8.1,11.4];assert.deepEqual(bars.map(n=>Number(attrs(n)['data-value'])),values);assert.ok(Math.abs(values.reduce((a,b)=>a+b,0)-100)<1e-12);let x=s.mobile?22:32;for(const n of bars){const a=attrs(n);assert.ok(Math.abs(Number(a.x)-x)<1e-5);assert.ok(Math.abs(Number(a.width)/(s.mobile?376:936)-Number(a['data-value'])/100)<1e-6);x+=Number(a.width);}const t=words(s);assert.match(t,s.lang==='fr'?/parts en valeur/:/shares by value/);assert.match(t,s.lang==='fr'?/T2 2026/:/Q2 2026/);assert.doesNotMatch(t,/parts en volume|shares by volume/);assert.match(t,s.lang==='fr'?/différence/:/subtraction/);}
});
test('the storage observation, technical threshold and conditional stress scenario stay separate',()=>{
 for(const s of scenes.filter(s=>s.kind==='thresholds')){assert.deepEqual(data(s,'storage-benchmark').map(n=>Number(attrs(n)['data-value'])),[74.33,30,10]);const t=words(s);assert.match(t,/OBSERVATION/);assert.match(t,/< 30 %/);assert.match(t,/< 10 %/);assert.match(t,s.lang==='fr'?/SCÉNARIO DE STRESS/:/STRESS SCENARIO/);assert.match(t,s.lang==='fr'?/froid|Froid/:/cold|Cold/);assert.match(t,s.lang==='fr'?/Ormuz/:/Hormuz/);assert.match(t,/2027/);assert.match(t,s.lang==='fr'?/4 novembre 2026/:/4 November 2026/);}
});
test('safety and geometry reject injection, untrusted nodes, escaped resource access and overflowing labels',()=>{
 const raw=scenes[0].svg;for(const mutate of[s=>s.replace('</svg>','<script>x</script></svg>'),s=>s.replace('<svg ','<svg onload="x" '),s=>s.replace('</svg>','<image href="https://example.invalid/a"/></svg>'),s=>s.replace('l0g US LNG Winter','Arial'),s=>s.replace(/data-panel="[^"]+"/u,'data-panel="absent"'),s=>s.replace('x="32" y="39"','x="995" y="39"')]){const changed=mutate(raw);assert.notEqual(changed,raw);assert.throws(()=>assertUSLNGWinterGeometry(changed));}for(const bad of['M'+'9'.repeat(200),'M1 1 L2','M1 1 L2 2 trailing','M0 0 Q1e999 0 4 4'])assert.throws(()=>assertUSLNGWinterGeometry(raw.replace(/d="M[^"]+"/u,`d="${bad}"`)));
});
test('malformed long path numbers fail within a bounded subprocess deadline',()=>{
 const input=new URL('./insurance-returns-svg-assertions.mjs',import.meta.url).href;execFileSync(process.execPath,['--input-type=module','-e',`import assert from 'node:assert/strict';import{pathPoints}from ${JSON.stringify(input)};assert.throws(()=>pathPoints('M'+'9'.repeat(100000)+'x'));`],{timeout:3000,stdio:'pipe'});
});
test('the component has only controlled static imports and the existing licensed local font contract',()=>{
 const c=read('src/components/USLNGWinterFigure.astro');assertFontLicenseReferences(read('public/fonts/stablecoins/LICENSE.txt'),'dejavu');for(const k of US_LNG_WINTER_KINDS)for(const l of['fr','en'])for(const mode of['desktop','mobile'])assert.ok(c.includes(`../figures/us-lng-winter-2026/${k}.${l}.${mode}.svg?raw`));assert.match(c,/max-width:800px/);assert.match(c,/@container\(max-width:500px\)/);assert.match(c,/max-width:340px/);assert.doesNotMatch(c,/overflow\s*:\s*hidden|Arial|Helvetica/);assert.match(c,/Object\.prototype\.hasOwnProperty\.call\(captions, kind\)/);assert.match(c,/href=\{`#source-\$\{id\}`\}/);assert.match(c,/parts mesurent la valeur importée/);assert.match(c,/shares measure import value/);for(const weight of[400,700]){assert.ok(c.includes(`/fonts/stablecoins/dejavu-sans-${weight}.ttf`));const b=readFileSync(new URL(`../public/fonts/stablecoins/dejavu-sans-${weight}.ttf`,import.meta.url));assert.equal(createHash('sha256').update(b).digest('hex'),weight===400?'98f2d74db16bb5f41f74adf6d899aeec92861682cccc58bfdbe4d9d7d0a5ae11':'21a0350a4ac2a9f22b6a7a8dcaf6abb08c8b546d06499301f1fcf10996fd0df5');}
});
