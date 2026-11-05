import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync,readdirSync} from 'node:fs';
import {criticalMineralsScenes,CRITICAL_MINERALS_KINDS,inspectCriticalMineralsSvg,assertCriticalMineralsGeometry,tag,attrs,content} from './critical-minerals-svg-assertions.mjs';
import {assertFontLicenseReferences} from './font-license-assertions.mjs';
const scenes=criticalMineralsScenes(),read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const all=s=>inspectCriticalMineralsSvg(s.svg).all,words=s=>all(s).map(content).join(' '),data=(s,key)=>all(s).filter(n=>attrs(n)['data-metric']===key);

test('24 native scenes retain safe XML, intended panels, actual font bounds and readable responsive sizing',()=>{
 assert.equal(scenes.length,24);assert.equal(readdirSync(new URL('../src/figures/critical-minerals-2026/',import.meta.url)).length,24);const ids=[];
 for(const s of scenes){assertCriticalMineralsGeometry(s.svg);assert.doesNotMatch(s.svg,/<script|foreignObject|—|#[a-f0-9]{3,8}\b|(?:deux|2) horloges|two clocks|mérite mieux que|deserves better than/iu);for(const n of all(s)){const a=attrs(n);if(a.id)ids.push(a.id);if(tag(n)==='text')assert.ok(Number(a['font-size'])*(s.mobile?280/420:501/1000)>=12);if(tag(n)==='title')assert.doesNotMatch(content(n),/\bce (?:qui|que|qu[’'])|\bwhat\b|, pas |, not /iu);}}
 assert.equal(ids.length,new Set(ids).size);
});
test('the scope figure keeps plan and company units separate and sizes 66 plans against the 632-plan inventory',()=>{
 for(const s of scenes.filter(s=>s.kind==='scope')){const bars=data(s,'critical-plans');assert.equal(bars.length,1);assert.equal(Number(attrs(bars[0])['data-value']),66);assert.ok(Math.abs(Number(attrs(bars[0]).width)/(s.mobile?376:936)-66/632)<1e-8);const t=words(s);for(const n of['632','66','59','43'])assert.ok(t.includes(n));assert.match(t,s.lang==='fr'?/Février 2026/:/February 2026/);assert.match(t,s.lang==='fr'?/entreprises distinctes/:/distinct companies/);assert.doesNotMatch(t,/43,75|43\.75/);}
});
test('the ownership waffle counts all 43 entities without assigning a nationality to unresolved or other resolved cases',()=>{
 for(const s of scenes.filter(s=>s.kind==='ownership')){assert.equal(data(s,'foreign-parent').length,14);assert.equal(data(s,'other-resolved').length,18);assert.equal(data(s,'unresolved').length,11);assert.equal(all(s).filter(n=>tag(n)==='circle').length,43);const t=words(s);assert.match(t,s.lang==='fr'?/au moins 14/:/at least 14/);assert.match(t,s.lang==='fr'?/autres structures résolues/:/other resolved structures/);assert.match(t,s.lang==='fr'?/filiales repérées/:/subsidiaries identified/);assert.doesNotMatch(t,/mères étrangères repérées|foreign parents identified/);assert.match(t,/14 \/ 32/);assert.doesNotMatch(t,/février|February|chinoises|Chinese/);}
});
test('minority equity arcs preserve the lower bound and approximation while keeping contractual rights qualified',()=>{
 for(const s of scenes.filter(s=>s.kind==='stakes')){assert.deepEqual(data(s,'minority-equity').map(n=>Number(attrs(n)['data-value'])),[11,12]);const t=words(s);assert.match(t,/minimum/);assert.match(t,/~12 %/);assert.match(t,s.lang==='fr'?/Mère britannique/:/UK parent/);assert.match(t,s.lang==='fr'?/Mère canadienne/:/Canadian parent/);}
});
test('KGHM separates the Polish Treasury equity stake from company-reported accounting control',()=>{
 for(const s of scenes.filter(s=>s.kind==='kghm')){const bars=data(s,'treasury-equity');assert.equal(bars.length,1);assert.equal(Number(attrs(bars[0])['data-value']),31.79);assert.ok(Math.abs(Number(attrs(bars[0]).width)/(s.mobile?376:936)-.3179)<1e-8);const t=words(s);assert.match(t,s.lang==='fr'?/Contrôle comptable déclaré par KGHM/:/Accounting control reported by KGHM/);assert.match(t,s.lang==='fr'?/Chaîne simplifiée/:/Simplified chain/);assert.match(t,/2025/);assert.match(t,s.lang==='fr'?/49 300/:/49,300/);}
});
test('export destinations use a volume denominator and keep the 2025 totals distinct from the 2019-2025 accumulated shares',()=>{
 for(const s of scenes.filter(s=>s.kind==='exports')){const bars=data(s,'export-destination'),values=[23,18,15,9,6,29];assert.deepEqual(bars.map(n=>Number(attrs(n)['data-value'])),values);assert.equal(values.reduce((a,b)=>a+b,0),100);for(const [i,n]of bars.entries())assert.ok(Math.abs(Number(attrs(n).width)/(s.mobile?376:936)-values[i]/100)<1e-8);const t=words(s);assert.match(t,/2019-2025/);assert.match(t,/2025/);assert.match(t,s.lang==='fr'?/solde de parts arrondies/:/residual of rounded shares/);assert.match(t,s.lang==='fr'?/Parts en volume/:/Shares by volume/);}
});
test('import reliance bars share a 0-100 scale across explicitly different product categories',()=>{
 for(const s of scenes.filter(s=>s.kind==='refining')){const bars=data(s,'net-import-reliance'),values=[100,100,67,57];assert.deepEqual(bars.map(n=>Number(attrs(n)['data-value'])),values);for(const [i,n]of bars.entries())assert.ok(Math.abs(Number(attrs(n).width)/(s.mobile?376:520)-values[i]/100)<1e-8);const t=words(s);assert.match(t,/2025/);assert.match(t,/0 (?:à|to) 100/);assert.match(t,s.lang==='fr'?/composés et métaux/:/compounds and metals/);assert.doesNotMatch(t,/chinoise|Chinese/);}
});
test('the component uses reviewed controlled imports, source anchors, responsive variants and already licensed local fonts',()=>{
 const c=read('src/components/CriticalMineralsFigure.astro');assertFontLicenseReferences(read('public/fonts/stablecoins/LICENSE.txt'),'dejavu');for(const k of CRITICAL_MINERALS_KINDS)for(const l of['fr','en'])for(const m of['desktop','mobile'])assert.ok(c.includes(`../figures/critical-minerals-2026/${k}.${l}.${m}.svg?raw`));assert.match(c,/Object\.prototype\.hasOwnProperty\.call\(captions,kind\)/);assert.match(c,/@container\(max-width:500px\)/);assert.match(c,/max-width:340px/);assert.match(c,/padding-bottom:1rem/);assert.doesNotMatch(c,/overflow\s*:\s*hidden|Arial|Helvetica/);assert.match(c,/href=\{`#source-\$\{id\}`\}/);assert.match(c,/Future 1, KGHM International, Robinson Holdings \(USA\)/);assert.match(c,/entité contrôlante ultime au sens comptable/);for(const w of[400,700])assert.ok(c.includes(`/fonts/stablecoins/dejavu-sans-${w}.ttf`));
});
test('source validation rejects active markup, outside resources, unexpected metrics and overflowing labels',()=>{
 const raw=scenes[0].svg;for(const mutate of[s=>s.replace('</svg>','<script>x</script></svg>'),s=>s.replace('<svg ','<svg onload="x" '),s=>s.replace('</svg>','<image href="https://example.invalid/a"/></svg>'),s=>s.replace('l0g Critical Minerals','Arial'),s=>s.replace(/data-panel="[^"]+"/u,'data-panel="missing"'),s=>s.replace('data-metric="critical-plans"','data-metric="invented"'),s=>s.replace('x="32" y="42"','x="995" y="42"')]){const changed=mutate(raw);assert.notEqual(changed,raw);assert.throws(()=>assertCriticalMineralsGeometry(changed));}
});
