import assert from 'node:assert/strict';
import{readFileSync,readdirSync}from'node:fs';
import{createHash}from'node:crypto';
import test from'node:test';
import{TRANSITION_FIRST_LOSS_KINDS,TRANSITION_FIRST_LOSS_SOURCES,transitionFirstLossFigureReferences}from'../src/lib/transitionFirstLossFigures.mjs';
import{transitionFirstLossScenes,inspectTransitionFirstLossSvg,assertTransitionFirstLossGeometry,tag,attrs,content}from'./transition-first-loss-svg-assertions.mjs';
import{assertFontLicenseReferences}from'./font-license-assertions.mjs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const close=(a,b)=>assert.ok(Math.abs(Number(a)-b)<.000002,`${a} != ${b}`);
const all=s=>inspectTransitionFirstLossSvg(s.svg).all,labels=s=>all(s).filter(n=>tag(n)==='text').map(content).join(' '),metric=(s,k)=>{const n=all(s).filter(n=>attrs(n)['data-metric']===k);assert.equal(n.length,1);return attrs(n[0]);};
test('28 passive bilingual scenes retain compact responsive geometry, glyphs and semantic themes',()=>{
 const scenes=transitionFirstLossScenes();assert.equal(scenes.length,28);assert.equal(readdirSync(new URL('../src/figures/transition-first-loss/',import.meta.url)).length,28);
 for(const s of scenes){assertTransitionFirstLossGeometry(s.svg);const n=all(s);assert.equal(attrs(n.find(n=>tag(n)==='rect')).fill,'var(--color-ink)');for(const t of n.filter(n=>tag(n)==='text')){assert.notEqual(attrs(t).fill,'var(--color-ink)');assert.ok(Number(attrs(t)['font-size'])*(s.mobile?280/420:501/1000)>=11);}assert.doesNotMatch(s.svg,/—|horlog|clock|<foreignObject|#[0-9a-f]{3,8}\b/iu);assert.doesNotMatch(content(n.find(n=>tag(n)==='title')),/\bce (?:que|qui|qu[’'])|\bwhat\b/iu);}
});
test('projected public needs retain four approximate sectors, the conditional APS and 2025dollar scope',()=>{
 for(const s of transitionFirstLossScenes().filter(s=>s.kind==='needs')){const t=labels(s);assert.match(t,/3[.,]7/);assert.match(t,/2026.*2035/);assert.match(t,/2025/);assert.match(t,/APS/);for(const[i,v]of[.1,.2,1.1,2.3].entries()){const a=metric(s,'need-'+(i+1));close(a['data-value'],v);close(a.width,(s.mobile?364:480)*v/2.5);}assert.match(t,/> 0[.,]2/);assert.match(content(all(s).find(n=>tag(n)==='desc')),s.lang==='fr'?/Une partie seulement/:/Only part/);}
});
test('a fixed25million loss changes allocation by ranking while the waterfall exhausts10then20then70',()=>{
 for(const s of transitionFirstLossScenes().filter(s=>s.kind==='waterfall')){for(const[row,values]of[['a',[10,15]],['b',[20,5]]])for(const[i,v]of values.entries()){const a=metric(s,'loss-'+row+'-'+i);close(a['data-value'],v);close(a.width,(s.mobile?364:390)*v/25);}assert.match(labels(s),/100/);assert.match(content(all(s).find(n=>tag(n)==='desc')),s.lang==='fr'?/Aucune probabilité/:/No default probability/);const paths=all(s).filter(n=>tag(n)==='path'&&attrs(n)['stroke-width']==='3');assert.equal(paths.length,3);}
 close(10+15,25);close(20+5,25);close(10+20+70,100);close(10-5,5);
});
test('discounted coupon and principal values preserve the ten-year2percentloan and7percent reference',()=>{
 const coupons=Array.from({length:10},(_,i)=>.2/1.07**(i+1)),pv=coupons.reduce((a,b)=>a+b)+10/1.07**10,gap=10-pv;
 for(const s of transitionFirstLossScenes().filter(s=>s.kind==='discount')){for(let i=1;i<=10;i++){close(metric(s,'coupon-nominal-'+i)['data-value'],.2);const p=metric(s,'coupon-pv-'+i);close(p['data-value'],coupons[i-1]);close(p.height,(s.mobile?125:170)/1.07**i);}close(metric(s,'loan-pv')['data-value'],pv);close(metric(s,'loan-gap')['data-value'],gap);close(metric(s,'loan-pv').width,(s.mobile?364:920)*pv/10);close(metric(s,'loan-gap').width,(s.mobile?364:920)*gap/10);const t=labels(s);for(const v of['1,405','5,083','6,49','3,51'])assert.ok(t.includes(v.replace(',',s.lang==='fr'?',':'.')));assert.match(content(all(s).find(n=>tag(n)==='desc')),s.lang==='fr'?/méthode distincte|fictif/:/Fictional|fictional/);}
 close(pv,6.488209229795077);close(gap,3.511790770204923);
});
test('Monsoon signed package sums692.55million and keeps grant protection separate from loan principal',()=>{
 const values=[100,150,50,382.55,10];close(values.reduce((a,b)=>a+b),692.55);
 for(const s of transitionFirstLossScenes().filter(s=>s.kind==='monsoon')){for(const[i,v]of values.entries()){const a=metric(s,'monsoon-package-'+(i+1));close(a['data-value'],v);close(a.width,(s.mobile?364:920)*v/692.55);}const t=labels(s);assert.match(t,/692[.,]55/);assert.match(t,/600 MW/);assert.match(t,/2023/);assert.match(content(all(s).find(n=>tag(n)==='desc')),s.lang==='fr'?/restriction extrême/:/extreme curtailment/);assert.match(t,s.lang==='fr'?/Réserve|réserve/:/reserve|Reserve/);}
});
test('Verdant retains non-equivalent guarantee programme and initial rated bond scopes with national ratings',()=>{
 for(const s of transitionFirstLossScenes().filter(s=>s.kind==='guarantee')){const t=labels(s);assert.match(t,/792/);assert.match(t,/390/);assert.match(t,/15/);assert.match(t,/VND/);assert.match(t,/BB\+/);assert.match(t,/AAA/);if(!s.mobile){const heads=all(s).filter(n=>tag(n)==='path'&&attrs(n).d==='M 154 416 L 160 407 L 166 416');assert.equal(heads.length,1,'Guarantee payment arrow points upward to bondholders');}assert.match(t,s.lang==='fr'?/nationale vietnamienne/:/Vietnamese national/);assert.match(t,s.lang==='fr'?/défaut couvert/:/covered default/);assert.match(content(all(s).find(n=>tag(n)==='desc')),s.lang==='fr'?/exposition conditionnelle|garantie/:/guarantee/);}
});
test('mobilisation ratios use the same concessional denominator and an inclusive commercial numerator',()=>{
 for(const s of transitionFirstLossScenes().filter(s=>s.kind==='mobilisation')){for(const[i,v]of[1.4,3.01].entries()){const a=metric(s,'mobilisation-'+i);close(a['data-value'],v);close(a.width,(s.mobile?364:540)*v/3.5);}const t=labels(s);assert.match(t,/54/);assert.match(t,/17[.,]9/);assert.match(t,s.lang==='fr'?/mai 2026/:/May 2026/);assert.match(t,s.lang==='fr'?/inclut le privé/:/includes private/);assert.match(content(all(s).find(n=>tag(n)==='desc')),s.lang==='fr'?/scénario sans intervention/:/counterfactual/);}
});
test('support map retains a reassessment loop and four different energy financing constraints',()=>{
 for(const s of transitionFirstLossScenes().filter(s=>s.kind==='matching')){const t=labels(s);assert.match(t,s.lang==='fr'?/Éolien en mer/:/Offshore wind/);assert.match(t,s.lang==='fr'?/Batteries/:/Battery storage/);assert.match(t,s.lang==='fr'?/Solaire en toiture/:/Rooftop solar/);assert.match(t,s.lang==='fr'?/Accès isolé/:/Last-mile service/);assert.match(t,s.lang==='fr'?/concession minimale/:/minimum concession/);assert.match(content(all(s).find(n=>tag(n)==='desc')),s.lang==='fr'?/indicateurs|minimum de concession/:/minimum concessionality/);assert.ok(all(s).filter(n=>tag(n)==='path').length>=1);}
});
test('closed component contract rejects kind/order drift, source injection and foreign languages',()=>{
 for(const lang of['fr','en'])for(let i=0;i<7;i++)assert.deepEqual(transitionFirstLossFigureReferences(lang,TRANSITION_FIRST_LOSS_KINDS[i],String(i+1).padStart(2,'0'),TRANSITION_FIRST_LOSS_SOURCES[i],'Caption'),TRANSITION_FIRST_LOSS_SOURCES[i].split(' '));for(const lang of[null,undefined,{},new String('fr'),'__proto__'])assert.throws(()=>transitionFirstLossFigureReferences(lang,'needs','01','R01','Caption'));for(const refs of['','L01','R01 R01','R01 C01','R01" onload="x'])assert.throws(()=>transitionFirstLossFigureReferences('fr','needs','01',refs,'Caption'));for(const[k,n]of[['needs','02'],['__proto__','01'],['matching','8']])assert.throws(()=>transitionFirstLossFigureReferences('fr',k,n,'R01','Caption'));
});
test('geometry validators reject active markup, overflowing labels, missing panel ownership and malformed paths',()=>{
 const scene=transitionFirstLossScenes().find(s=>s.lang==='fr'&&s.kind==='monsoon'&&!s.mobile).svg;for(const change of[s=>s.replace('</svg>','<script>x</script></svg>'),s=>s.replace('<svg ','<svg onload="x" '),s=>s.replace('</svg>','<image href="https://example.com/a"/></svg>'),s=>s.replace('l0g Transition First Loss','Arial'),s=>s.replace('>Restriction<','>Un libellé beaucoup trop long qui dépasse la largeur du panneau<'),s=>s.replace('data-panel="transition-fl-fr-monsoon-d-card-0"','data-panel="missing"')])assert.throws(()=>assertTransitionFirstLossGeometry(change(scene)));assert.throws(()=>inspectTransitionFirstLossSvg(scene.replace('d="M ','d="M NaN ')));
});
test('component uses existing licensed local fonts, native methods slots and nonclipping responsive padding',()=>{
 const c=read('src/components/TransitionFirstLossFigure.astro');for(const w of[400,700]){const p='public/fonts/stablecoins/dejavu-sans-'+w+'.ttf';assert.ok(c.includes(p.replace('public','')));assert.equal(createHash('sha256').update(readFileSync(new URL('../'+p,import.meta.url))).digest('hex'),w===400?'98f2d74db16bb5f41f74adf6d899aeec92861682cccc58bfdbe4d9d7d0a5ae11':'21a0350a4ac2a9f22b6a7a8dcaf6abb08c8b546d06499301f1fcf10996fd0df5');}assertFontLicenseReferences(read('public/fonts/stablecoins/LICENSE.txt'),'dejavu');assert.match(c,/max-width:\s*48rem/u);assert.match(c,/@container\s*\(max-width:\s*500px\)/u);assert.match(c,/padding-bottom:\s*1rem/u);assert.match(c,/<slot \/>/);assert.doesNotMatch(c,/overflow\s*:\s*(?:hidden|clip)|client:|<script|fetch\(/iu);
});
