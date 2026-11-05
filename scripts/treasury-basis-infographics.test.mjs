import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync,readdirSync} from 'node:fs';
import {TREASURY_BASIS_KINDS,treasuryBasisScenes,inspectTreasuryBasisSvg,assertTreasuryBasisGeometry,tag,attrs,content} from './treasury-basis-svg-assertions.mjs';
import {assertFontLicenseReferences} from './font-license-assertions.mjs';
const scenes=treasuryBasisScenes(),read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const all=s=>inspectTreasuryBasisSvg(s.svg).all,words=s=>all(s).map(content).join(' '),data=(s,k)=>all(s).filter(n=>attrs(n)['data-metric']===k),values=(s,k)=>data(s,k).map(n=>Number(attrs(n)['data-value']));
test('24 passive scenes retain safe XML, unique accessible names, intended panels and readable actual-font geometry',()=>{
 assert.equal(scenes.length,24);assert.equal(readdirSync(new URL('../src/figures/treasury-basis-2026/',import.meta.url)).length,24);const ids=[];
 for(const s of scenes){assertTreasuryBasisGeometry(s.svg);assert.doesNotMatch(s.svg,/<script|foreignObject|—|#[a-f0-9]{3,8}\b|(?:deux|2) horloges|two clocks|mérite mieux que|deserves better than/iu);for(const n of all(s)){const a=attrs(n);if(a.id)ids.push(a.id);if(tag(n)==='text')assert.ok(Number(a['font-size'])*(s.mobile?280/420:501/1000)>=12);if(tag(n)==='title')assert.doesNotMatch(content(n),/\bce (?:qui|que|qu[’'])|\bwhat\b|, pas |, not /iu);}}
 assert.equal(ids.length,new Set(ids).size);
});
test('the mechanism separates asset exposure, futures and repo funding without measuring every link as 830bn',()=>{
 for(const s of scenes.filter(s=>s.kind==='mechanism')){assert.deepEqual(values(s,'basis-estimate'),[830]);const t=words(s);for(const term of s.lang==='fr'?['Investisseur','Fonds','Dealer / repo','Fournissent du cash']:['Asset manager','Hedge fund','Dealer / repo','Provide cash'])assert.ok(t.includes(term),term);assert.match(t,/2025/);assert.match(t,/Fed \[01, 03\]/);assert.match(t,s.lang==='fr'?/conceptuel/:/Conceptual/);assert.ok(all(s).filter(n=>tag(n)==='path'&&attrs(n)['data-connector']==='flow').length>=6);}
});
test('seven exclusive categories use one scale and preserve the rounded 2395bn denominator',()=>{
 const expected=[830,305,395,375,245,175,70];assert.equal(expected.reduce((a,b)=>a+b,0),2395);
 for(const s of scenes.filter(s=>s.kind==='exposures')){assert.deepEqual(values(s,'long-category'),expected);for(const[n,v]of data(s,'long-category').map((n,i)=>[n,expected[i]]))assert.ok(Math.abs(Number(attrs(n).width)/(s.mobile?376:335)-v/900)<1e-8);const t=words(s);assert.match(t,/2[ ,]395/);assert.match(t,/2[ ,]400/);assert.match(t,s.lang==='fr'?/Titres non grevés/:/Treasury liquidity buffer/);assert.match(t,s.lang==='fr'?/catégories exclusives/:/exclusive categories/);assert.match(t,s.lang==='fr'?/Échelle commune : 0 à 900 Md\$/:/Shared scale: \$0–900bn/);assert.doesNotMatch(t,/47 %/);}
});
test('funding keeps long exposure, net repo and a historical model association in separate panels',()=>{
 for(const s of scenes.filter(s=>s.kind==='funding')){assert.deepEqual(values(s,'long-trend'),[.6,2.4]);assert.deepEqual(values(s,'net-repo'),[1.8]);assert.deepEqual(values(s,'associated-spread'),[10]);for(const[n,v]of data(s,'long-trend').map((n,i)=>[n,[.6,2.4][i]]))assert.ok(Math.abs(Number(attrs(n).width)/(s.mobile?336:487)-v/2.4)<1e-8);const t=words(s);assert.match(t,/10–20/);assert.match(t,/2014/);assert.match(t,/2025/);assert.match(t,s.lang==='fr'?/Association de modèle|association de modèle/:/Model association|model association/);assert.doesNotMatch(t,/830/);}
});
test('historical comparison has qualitative 2020 content and only the documented 2025 position reductions',()=>{
 for(const s of scenes.filter(s=>s.kind==='history')){assert.deepEqual(values(s,'swap-reduction'),[-60,-40]);const t=words(s);assert.match(t,/2020/);assert.match(t,/2025/);assert.match(t,/Basis trade/);assert.match(t,/Swap spread/);assert.match(t,s.lang==='fr'?/Basis relativement stable/:/Basis relatively stable/);assert.equal(all(s).filter(n=>tag(n)==='path'&&attrs(n)['data-connector']!=='footer').length,0,'No invented time-series line');}
});
test('hypothetical haircut arithmetic preserves collateral value and excludes treating the cash contribution as NAV',()=>{
 for(const s of scenes.filter(s=>s.kind==='haircut')){assert.deepEqual(values(s,'bond-value'),[100,100]);assert.deepEqual(values(s,'repo-loan'),[99,97]);assert.deepEqual(values(s,'cash-equity'),[1,3]);assert.deepEqual(values(s,'extra-cash'),[2]);assert.equal(100*(1-.01),99);assert.equal(100*(1-.03),97);assert.equal(99-97,2);const t=words(s);assert.match(t,s.lang==='fr'?/hypothétique/:/Hypothetical/);assert.doesNotMatch(t,/NAV|fonds propres|net assets/);}
});
test('clearing shares compare an observed baseline with a fixed-behaviour scenario on the same historical data',()=>{
 for(const s of scenes.filter(s=>s.kind==='clearing')){assert.deepEqual(values(s,'cleared-share'),[45,77]);for(const[n,v]of data(s,'cleared-share').map((n,i)=>[n,[45,77][i]]))assert.ok(Math.abs(Number(attrs(n).width)/(s.mobile?336:400)-v/100)<1e-8);const t=words(s);assert.match(t,/2025/);assert.match(t,s.lang==='fr'?/OBSERVÉ|OBSERVÉE/:/OBSERVED/);assert.match(t,/SIMULATION/);assert.match(t,/2026/);assert.match(t,/2027/);assert.match(t,s.lang==='fr'?/Exemptions supplémentaires|Exemptions ajoutées/:/Additional exemptions|Exemptions added/);assert.match(t,/OFR \[10\] · SEC \[09, 15\]/);}
});
test('component restricts controlled variants, uses licensed fonts and supplies scope and current rule qualifications',()=>{
 const c=read('src/components/TreasuryBasisFigure.astro');assertFontLicenseReferences(read('public/fonts/stablecoins/LICENSE.txt'),'dejavu');for(const k of TREASURY_BASIS_KINDS)for(const l of['fr','en'])for(const m of['desktop','mobile'])assert.ok(c.includes(`../figures/treasury-basis-2026/${k}.${l}.${m}.svg?raw`));assert.match(c,/Object\.prototype\.hasOwnProperty\.call\(captions,kind\)/);assert.match(c,/@container\(max-width:500px\)/);assert.match(c,/max-width:340px/);assert.match(c,/padding-bottom:1rem/);assert.doesNotMatch(c,/overflow\s*:\s*hidden|Arial|Helvetica/);assert.match(c,/href=\{`#source-\$\{id\}`\}/);for(const w of[400,700])assert.ok(c.includes(`/fonts/stablecoins/dejavu-sans-${w}.ttf`));assert.match(c,/unencumbered Treasury securities/);assert.match(c,/transactions et comportement constants/);assert.match(c,/30 octobre 2026/);assert.match(c,/4 novembre/);assert.match(c,/Futures margin/);assert.match(c,/average dollar amount of Treasury repo outstanding/);assert.match(c,/does not net opposing repos/);assert.match(c,/finances only the bond leg/);
});
test('guards reject executable markup, external assets, unknown metrics and overflowing labels',()=>{
 const raw=scenes[0].svg;for(const altered of[raw.replace('</svg>','<script>alert(1)</script></svg>'),raw.replace('<svg ','<svg onload="x" '),raw.replace('<svg ','<svg href="https://example.invalid/" '),raw.replace('data-metric="basis-estimate"','data-metric="unknown"'),raw.replace('x="32" y="42"','x="990" y="42"')])assert.throws(()=>assertTreasuryBasisGeometry(altered));
});
