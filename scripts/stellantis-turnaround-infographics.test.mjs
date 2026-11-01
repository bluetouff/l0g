import assert from 'node:assert/strict';
import {readFileSync,readdirSync}from'node:fs';
import {createHash}from'node:crypto';
import test from'node:test';
import {STELLANTIS_FIGURE_IDS,STELLANTIS_FIGURE_SOURCES,stellantisFigureMeta}from'../src/lib/stellantis-turnaround-figures.mjs';
import {stellantisTurnaroundScenes,inspectStellantisTurnaroundSvg,assertStellantisTurnaroundGeometry,tag,attrs,content,labelBox}from'./stellantis-turnaround-svg-assertions.mjs';
import {assertFontLicenseReferences}from'./font-license-assertions.mjs';
const scenes=stellantisTurnaroundScenes(),nodes=s=>inspectStellantisTurnaroundSvg(s.svg).all,metric=(s,key)=>nodes(s).filter(n=>attrs(n)['data-metric']===key),value=n=>Number(attrs(n)['data-value']),text=s=>nodes(s).map(content).join(' '),read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');

test('24 native passive scenes remain compact, readable and inside intended panels with real glyph metrics',()=>{
 assert.equal(scenes.length,24);assert.equal(readdirSync(new URL('../src/figures/stellantis-turnaround/',import.meta.url)).length,24);const ids=[];
 for(const s of scenes){assertStellantisTurnaroundGeometry(s.svg);assert.doesNotMatch(s.svg,/<script|foreignObject|—|horloges|two clocks|#[a-f\d]{3,8}\b/iu);for(const n of nodes(s)){if(attrs(n).id)ids.push(attrs(n).id);if(tag(n)==='text'){assert.ok(Number(attrs(n)['font-size'])*(s.mobile?280/420:501/1000)>=12);assert.ok(labelBox(n).advance>0);}if(tag(n)==='title')assert.doesNotMatch(content(n),/\bce (?:que|qui|qu[’'])|\bwhat\b|, pas |, not /iu);}}
 assert.equal(ids.length,new Set(ids).size);
});

test('seasonal comparisons retain all seven reported quarters and leave Q4 2026 unknown on one signed scale',()=>{
 assert.equal([-3036,31,-4304].reduce((a,b)=>a+b,0),-7309);assert.equal([-1921,1000,-4009].reduce((a,b)=>a+b,0),-4930);assert.equal(((7309-4930)/7309*100).toFixed(1),'32.5');
 for(const s of scenes.filter(s=>s.kind==='01')){const a=metric(s,'quarter-2025-eurm'),b=metric(s,'quarter-2026-eurm');assert.deepEqual(a.map(value),[-3036,31,-4304,2784]);assert.deepEqual(b.map(value),[-1921,1000,-4009]);const scale=Number(attrs(a[0]).width)/3036,zero=Number(attrs(a[0]).x)+Number(attrs(a[0]).width);for(const bar of[...a,...b]){assert.ok(Math.abs(Number(attrs(bar).width)/Math.abs(value(bar))-scale)<1e-6);assert.ok(Math.abs((value(bar)<0?Number(attrs(bar).x)+Number(attrs(bar).width):Number(attrs(bar).x))-zero)<1e-5);}assert.match(text(s),s.lang==='fr'?/À venir/:/Unknown/);assert.match(stellantisFigureMeta(s.lang,s.kind).method,s.lang==='fr'?/non désaisonnalisés/:/without seasonal adjustment/);}
});

test('cash-cycle arrows distinguish quick dealer collections from later supplier settlement and final retail',()=>{
 for(const s of scenes.filter(s=>s.kind==='02')){const all=nodes(s),t=text(s);for(const key of['dealer-cash','supplier-cash'])assert.equal(all.filter(n=>attrs(n)['data-connector']===key).length,1);assert.equal(all.filter(n=>attrs(n)['data-metric']).length,0);assert.match(t,s.lang==='fr'?/Concessionnaire/:/Dealer/);assert.match(t,s.lang==='fr'?/Fournisseur/:/Supplier/);assert.match(t,s.lang==='fr'?/automobiliste|Automobiliste/:/retail|Motorist/);assert.match(stellantisFigureMeta(s.lang,s.kind).method,s.lang==='fr'?/quelques jours/:/within days/);}
});

test('nine-month cash bridge retains every signed contribution, balances and investment-payment caveats',()=>{
 const changes=[252,2198,415,-481,-5];assert.equal(changes.reduce((a,b)=>a+b,0),2379);assert.equal(-7309+2379,-4930);assert.equal((2198/2379*100).toFixed(1),'92.4');
 for(const s of scenes.filter(s=>s.kind==='03')){const bars=metric(s,'bridge-change-eurm');assert.deepEqual(bars.map(value),changes);assert.deepEqual(metric(s,'fcf-start-eurm').map(value),[-7309]);assert.deepEqual(metric(s,'fcf-end-eurm').map(value),[-4930]);const dimension=s.mobile?'width':'height',scale=Number(attrs(bars[0])[dimension])/252;for(const bar of bars)assert.ok(Math.abs(Number(attrs(bar)[dimension])/Math.abs(value(bar))-scale)<1e-6);assert.match(stellantisFigureMeta(s.lang,s.kind).method,s.lang==='fr'?/paiements associés/:/related payments/);assert.match(stellantisFigureMeta(s.lang,s.kind).method,s.lang==='fr'?/cause exclusive/:/exclusive causality/);}
});

test('regional adjusted income includes eliminations and reconciles to the distinct group total',()=>{
 const regions=[64,-311,244,431,18,123,-313];assert.equal(regions.reduce((a,b)=>a+b,0),256);assert.equal((-311/14062*100).toFixed(1),'-2.2');assert.equal((64/15586*100).toFixed(1),'0.4');
 for(const s of scenes.filter(s=>s.kind==='04')){const bars=metric(s,'aoi-region-eurm');assert.deepEqual(bars.map(value),regions);assert.deepEqual(metric(s,'aoi-group-eurm').map(value),[256]);const scale=Number(attrs(bars[0]).width)/64;for(const bar of[...bars,...metric(s,'aoi-group-eurm')])assert.ok(Math.abs(Number(attrs(bar).width)/Math.abs(value(bar))-scale)<1e-6);assert.match(text(s),s.lang==='fr'?/élim\./:/elim\./);assert.match(stellantisFigureMeta(s.lang,s.kind).method,s.lang==='fr'?/distinct des flux/:/separate from regional cash flow/);}
});

test('hybrid tranches preserve original currencies, initial coupons and reported net-equity classification',()=>{
 for(const s of scenes.filter(s=>s.kind==='05')){const all=nodes(s),t=text(s),amounts=s.lang==='fr'?['2,2 Md€','1,8 Md€','865 M GBP']:['EUR2.2bn','EUR1.8bn','GBP865m'],coupons=s.lang==='fr'?['6,25 %','6,875 %','8,25 %']:['6.25%','6.875%','8.25%'];for(let i=0;i<3;i++){const id=all.find(n=>tag(n)==='rect'&&attrs(n).id?.endsWith('-card-tranche-'+i));assert.ok(id);const labels=all.filter(n=>tag(n)==='text'&&attrs(n)['data-panel']===attrs(id).id).map(content);assert.equal(labels[0],amounts[i]);assert.equal(labels.at(-1),coupons[i]);}assert.match(t,/4[,.]927/);assert.match(t,/IAS 32/);assert.match(t,s.lang==='fr'?/perpétuel/:/perpetual|Perpetual/);assert.match(stellantisFigureMeta(s.lang,s.kind).method,s.lang==='fr'?/sans conversion de change/:/no l0g foreign-exchange conversion/);assert.match(stellantisFigureMeta(s.lang,s.kind).method,s.lang==='fr'?/échéance fixe/:/fixed maturity/);}
});

test('Q4 thresholds separate matching 2025 from annual breakeven, with the middle case explicitly hypothetical',()=>{
 assert.equal(-4930+405,-4525);assert.equal(-4930+4930,0);assert.equal(-4930+2784,-2146);
 for(const s of scenes.filter(s=>s.kind==='06')){const bars=metric(s,'q4-threshold-eurm');assert.deepEqual(bars.map(value),[405,2784,4930]);const scale=Number(attrs(bars[0]).width)/405;for(const bar of bars)assert.ok(Math.abs(Number(attrs(bar).width)/value(bar)-scale)<1e-6);assert.match(text(s),s.lang==='fr'?/Égaler/:/Match/);assert.match(text(s),s.lang==='fr'?/scénario/:/scenario/);assert.match(text(s),s.lang==='fr'?/inconnu/:/unknown/);assert.match(stellantisFigureMeta(s.lang,s.kind).method,s.lang==='fr'?/−2 146/:/−EUR2,146/);}
});

test('strict source assertions reject active content, font substitution, malformed paths and panel overflow',()=>{
 const raw=scenes[0].svg;
 for(const fn of[s=>s.replace('</svg>','<script>x</script></svg>'),s=>s.replace('<svg ','<svg onload="x" '),s=>s.replace('</svg>','<image href="https://example.com/a"/></svg>'),s=>s.replace('l0g Stellantis','Arial'),s=>s.replace(/data-panel="[^"]+"/u,'data-panel="absent"'),s=>s.replaceAll('Le creux de l’été, dans sa saison','Un titre beaucoup trop long dont le texte dépasse le cadre interne de cette infographie'),s=>s.replace('x="40" y="85"','x="990" y="85"')]){const changed=fn(raw);assert.notEqual(changed,raw);assert.throws(()=>assertStellantisTurnaroundGeometry(changed));}
 const flow=scenes.find(s=>s.kind==='02').svg;assert.throws(()=>assertStellantisTurnaroundGeometry(flow.replace(/d="M/u,'d="M'+'9'.repeat(200))));
 for(const lang of[null,{},new String('fr'),'__proto__'])assert.throws(()=>stellantisFigureMeta(lang,'01'));for(const id of['../01','01" onload="x','07',{},null])assert.throws(()=>stellantisFigureMeta('fr',id));
});

test('component retains licensed local fonts, closed raw imports, source links and readable responsive limits',()=>{
 const c=read('src/components/StellantisFigure.astro');for(const weight of[400,700]){const p='public/fonts/stablecoins/dejavu-sans-'+weight+'.ttf';assert.ok(c.includes(p.replace('public','')));assert.equal(createHash('sha256').update(readFileSync(new URL('../'+p,import.meta.url))).digest('hex'),weight===400?'98f2d74db16bb5f41f74adf6d899aeec92861682cccc58bfdbe4d9d7d0a5ae11':'21a0350a4ac2a9f22b6a7a8dcaf6abb08c8b546d06499301f1fcf10996fd0df5');}assertFontLicenseReferences(read('public/fonts/stablecoins/LICENSE.txt'),'dejavu');assert.match(c,/@container\s*\(max-width:\s*500px\)/u);assert.match(c,/padding-bottom:\s*1rem/u);assert.match(c,/max-width:\s*310px/u);assert.ok(1080*310/420<800);assert.match(c,/import\.meta\.glob/);assert.match(c,/#source-\$\{ref\}/u);assert.doesNotMatch(c,/overflow\s*:\s*(?:hidden|clip)|client:|<script|fetch\(|foreignObject/iu);for(const lang of['fr','en'])for(const[i,id]of STELLANTIS_FIGURE_IDS.entries())assert.deepEqual(stellantisFigureMeta(lang,id).sources,STELLANTIS_FIGURE_SOURCES[i]);
});


test('waterfall labels keep visible separation and the French scenario amount stays on one SVG text line',()=>{
 for(const s of scenes.filter(s=>s.kind==='03'&&!s.mobile)){const labels=nodes(s).filter(n=>tag(n)==='text'&&Number(attrs(n).y)===566).map(labelBox).sort((a,b)=>a.x1-b.x1);assert.equal(labels.length,7);for(let i=1;i<labels.length;i++)assert.ok(labels[i].x1-labels[i-1].x2>=12,'Waterfall labels need visible safety spacing');}
 const mobile=scenes.find(s=>s.lang==='fr'&&s.kind==='06'&&s.mobile);assert.ok(nodes(mobile).some(n=>tag(n)==='text'&&content(n)==='−2 146 M€ sur 2026.'));
});
