import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import test from 'node:test';
import {INFLATION_BUDGET_KINDS,INFLATION_BUDGET_SOURCES,INFLATION_BUDGET_MONTHLY,inflationBudgetFigureReferences} from '../src/lib/inflation-budget-figures.mjs';
import {inflationBudgetScenes,inspectInflationBudgetSvg,assertInflationBudgetGeometry,tag,attrs,content,labelBox} from './inflation-budget-svg-assertions.mjs';
import {pathPoints} from './insurance-returns-svg-assertions.mjs';
import {assertFontLicenseReferences} from './font-license-assertions.mjs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const all=s=>inspectInflationBudgetSvg(s.svg).all,text=s=>all(s).filter(n=>tag(n)==='text').map(content).join(' ');
const metric=(s,key)=>{const found=all(s).filter(n=>attrs(n)['data-metric']===key);assert.equal(found.length,1);return attrs(found[0]);};
const near=(a,b,t=.00002)=>assert.ok(Math.abs(Number(a)-b)<t,`${a} differs from ${b}`);
test('twenty compact passive vectors preserve semantic themes and readable text',()=>{
 assert.equal(inflationBudgetScenes().length,20);assert.equal(readdirSync(new URL('../src/figures/inflation-budget/',import.meta.url)).length,20);
 for(const s of inflationBudgetScenes()){assertInflationBudgetGeometry(s.svg);assert.equal(attrs(all(s).find(n=>tag(n)==='rect')).fill,'var(--color-ink)');assert.doesNotMatch(s.svg,/—|horlog|clock|#[0-9a-f]{3,8}\b/iu);assert.doesNotMatch(content(all(s).find(n=>tag(n)==='title')),/\bce (?:que|qui|qu[’'])|\bwhat\b/iu);for(const n of all(s).filter(n=>tag(n)==='text'))assert.ok(Number(attrs(n)['font-size'])*(s.mobile?280/420:501/1000)>=11);}
});
test('two 138-month curves use actual consecutive source observations and a 2015 mean reference',()=>{
 assert.equal(INFLATION_BUDGET_MONTHLY.length,138);assert.equal(INFLATION_BUDGET_MONTHLY[0][0],'2015-01');assert.equal(INFLATION_BUDGET_MONTHLY.at(-1)[0],'2026-06');
 for(const[i,row]of INFLATION_BUDGET_MONTHLY.entries()){assert.ok(Object.isFrozen(row));assert.equal(row.length,3);assert.equal(row[0],`${2015+Math.floor(i/12)}-${String(i%12+1).padStart(2,'0')}`);for(const n of row.slice(1))assert.ok(Number.isSafeInteger(n)&&n>0);}
 const means=[1,2].map(col=>INFLATION_BUDGET_MONTHLY.slice(0,12).reduce((a,row)=>a+row[col],0)/12);
 const h1=[1,2].map((col,i)=>INFLATION_BUDGET_MONTHLY.slice(-6).reduce((a,row)=>a+row[col]/means[i]*100,0)/6);near(h1[0],134.679603890,.00000001);near(h1[1],122.525046868,.00000001);
 for(const s of inflationBudgetScenes().filter(s=>s.kind==='levels')){
  for(const[i,key]of ['food','overall'].entries()){const path=metric(s,'levels-'+key);assert.equal(path['data-count'],'138');const points=pathPoints(path.d);assert.equal(points.length,138);for(const[j,[x,y]]of points.entries()){near(x,(s.mobile?100:120)+j*(s.mobile?270:805)/137);const value=INFLATION_BUDGET_MONTHLY[j][i+1]/means[i]*100;near(y,(s.mobile?475:455)-(value-95)*(s.mobile?200:210)/45);}}
  const d=content(all(s).find(n=>tag(n)==='desc'));for(const str of ['011813717','011814630','2015','2026','134.6796','122.5250'])assert.ok(d.includes(str)||d.includes(str.replace('.',',')),str);assert.match(d,s.lang==='fr'?/six premiers mois/:/first six months/);
 }
});
test('signed nine-month contributions preserve weights, ratios and a common points scale',()=>{
 const inputs=[[1485,10039,10183],[168,10008,10329],[2388,9988,9983],[764,9833,12013],[5195,10009,10235]],keys=['food','tobacco','manufactured','energy','services'];
 const v=inputs.map(([w,a,b])=>w/10000*(b/a-1)*100);near(v.reduce((a,b)=>a+b,0),3.1217606676,.000000001);assert.equal(inputs.reduce((a,b)=>a+b[0],0),10000);
 for(const s of inflationBudgetScenes().filter(s=>s.kind==='basket')){for(const[i,key]of keys.entries()){const n=metric(s,'contribution-'+key);near(n['data-value'],v[i]);near(n.cx,(s.mobile?90:380)+(v[i]+.1)*(s.mobile?275:535)/2.1);}assert.ok(Number(metric(s,'contribution-manufactured')['data-value'])<0);const d=content(all(s).find(n=>tag(n)==='desc'));assert.match(d,/2025/);assert.match(d,/2026/);assert.match(d,s.lang==='fr'?/neuf mois/:/neither.*annual|December/);assert.match(d,/3[.,]1217607/);assert.ok(text(s).includes(s.lang==='fr'?'7,64 % × 22,17 %':'7.64% × 22.17%'));}
});
test('housing shows ratios of group sums with 100 as the shared denominator',()=>{
 const values=[25.4,24,23.3,7.4];for(const s of inflationBudgetScenes().filter(s=>s.kind==='housing')){for(const[i,v]of values.entries()){const n=metric(s,'housing-'+i);near(n['data-value'],v);near(n.width,(s.mobile?332:480)*v/100);}const d=content(all(s).find(n=>tag(n)==='desc'));assert.match(d,/2024/);assert.match(d,/2026/);assert.match(d,s.lang==='fr'?/ratios de sommes/:/ratios of group sums/);assert.match(d,s.lang==='fr'?/capital et intérêts/:/principal and interest/);assert.match(d,s.lang==='fr'?/avant impôts directs/:/before direct taxes/);}
});
test('the constructed purchase switch keeps product price changes distinct from expenditure',()=>{
 near((1.4/1-1)*100,40);near((2.5/2-1)*100,25);near((1.4/2-1)*100,-30);
 for(const s of inflationBudgetScenes().filter(s=>s.kind==='choices')){const t=text(s),d=content(all(s).find(n=>tag(n)==='desc'));for(const value of (s.lang==='fr'?['1 €','1,40 €','2 €','2,50 €','+40 %','+25 %','−30 %']:['€1','€1.40','€2','€2.50','+40%','+25%','−30%']))assert.ok(t.includes(value));assert.equal(all(s).filter(n=>tag(n)==='path').length,3);assert.equal(all(s).filter(n=>tag(n)==='line').length,3);assert.match(d,s.lang==='fr'?/Valeurs entièrement choisies/:/All values are chosen/);assert.match(d,s.lang==='fr'?/aucune équivalence de qualité/:/no equivalence of quality/);}
});
test('three chosen compositions total 100 percent and additional costs share the 0–120 euro scale',()=>{
 const rows=[[29700,3360,47760,15280,103900],[30000,0,40000,40000,90000],[60000,0,40000,16000,84000]],keys=['food','tobacco','manufactured','energy','services'],delta=[62.44,113.1,62.85];
 for(const s of inflationBudgetScenes().filter(s=>s.kind==='scenarios')){for(const[i,row]of rows.entries()){assert.equal(row.reduce((a,b)=>a+b,0),200000);let sum=0;for(const[j,v]of row.entries()){if(!v){assert.equal(all(s).filter(n=>attrs(n)['data-metric']===`scenario-${i}-${keys[j]}`).length,0);continue;}const n=metric(s,`scenario-${i}-${keys[j]}`);near(n['data-value'],v);near(n.width,(s.mobile?332:375)*v/200000);sum+=Number(n.width);}near(sum,s.mobile?332:375);const n=metric(s,'extra-'+i);near(n['data-value'],delta[i]);near(n.width,(s.mobile?332:280)*delta[i]/120);}const d=content(all(s).find(n=>tag(n)==='desc'));assert.match(d,s.lang==='fr'?/aucun profil démographique observé/:/no observed demographic profile/);assert.match(d,/120/);assert.doesNotMatch(d,/data\/|research\//u);for(const v of(s.lang==='fr'?['+3,12 %','+5,66 %','+3,14 %']:['+3.12%','+5.66%','+3.14%']))assert.ok(text(s).includes(v));}
});
test('mobile scenario totals retain sixteen units of real-font horizontal clearance',()=>{
 const check=s=>{const totals=all(s).filter(n=>tag(n)==='text'&&content(n).startsWith('Total '));assert.equal(totals.length,3);for(const total of totals){const a=attrs(total);const delta=all(s).find(n=>tag(n)==='text'&&attrs(n)['data-panel']===a['data-panel']&&attrs(n).y===a.y&&content(n).startsWith('+'));assert.ok(delta);const gap=labelBox(total).x1-labelBox(delta).x2;assert.ok(gap>=16,`${s.lang} ${content(total)} has only ${gap} units of clearance`);}};
 const scenes=inflationBudgetScenes().filter(s=>s.mobile&&s.kind==='scenarios');assert.equal(scenes.length,2);for(const s of scenes)check(s);
 const fr=scenes.find(s=>s.lang==='fr');const crowded={...fr,svg:fr.svg.replace(/font-size="22"([^>]*>Total )/gu,'font-size="24"$1')};assert.notEqual(crowded.svg,fr.svg);assert.throws(()=>check(crowded),/clearance/);
});
test('closed reference metadata rejects unsupported languages, reference drift and missing captions',()=>{
 for(const lang of['fr','en'])for(const[i,k]of INFLATION_BUDGET_KINDS.entries())assert.deepEqual(inflationBudgetFigureReferences(lang,k,i+1,[...INFLATION_BUDGET_SOURCES[i]],'Caption','Method'),INFLATION_BUDGET_SOURCES[i]);
 for(const l of[undefined,null,{},new String('fr'),'__proto__'])assert.throws(()=>inflationBudgetFigureReferences(l,'levels',1,INFLATION_BUDGET_SOURCES[0],'Caption','Method'));
 for(const refs of[[],['R01'],['R01','R01'],['R01','R04','R15" onload="x']])assert.throws(()=>inflationBudgetFigureReferences('fr','levels',1,refs,'Caption','Method'));
 assert.throws(()=>inflationBudgetFigureReferences('fr','housing',3,INFLATION_BUDGET_SOURCES[2],'','Method'));
});
test('passive geometry rejects executable markup, external assets and internal label overflow',()=>{
 const scene=inflationBudgetScenes().find(s=>s.lang==='fr'&&s.kind==='levels'&&!s.mobile).svg;
 for(const edit of[s=>s.replace('</svg>','<script>x</script></svg>'),s=>s.replace('<svg ','<svg onload="x" '),s=>s.replace('</svg>','<image href="https://example.com/a"/></svg>'),s=>s.replace('l0g Inflation Budget','Arial'),s=>s.replace('data-panel="inflation-budget-fr-levels-d-card-plot"','data-panel="missing"'),s=>s.replace('x="90"','x="995"')])assert.throws(()=>assertInflationBudgetGeometry(edit(scene)));
});
test('component retains licensed local fonts, responsive variants, method disclosure and spacing',()=>{
 const c=read('src/components/InflationBudgetFigure.astro');for(const w of[400,700]){const p='public/fonts/stablecoins/dejavu-sans-'+w+'.ttf';assert.ok(c.includes(p.replace('public','')));assert.equal(createHash('sha256').update(readFileSync(new URL('../'+p,import.meta.url))).digest('hex'),w===400?'98f2d74db16bb5f41f74adf6d899aeec92861682cccc58bfdbe4d9d7d0a5ae11':'21a0350a4ac2a9f22b6a7a8dcaf6abb08c8b546d06499301f1fcf10996fd0df5');}assertFontLicenseReferences(read('public/fonts/stablecoins/LICENSE.txt'),'dejavu');assert.match(c,/@container\s*\(max-width:\s*500px\)/u);assert.match(c,/padding-bottom:\s*1rem/u);assert.doesNotMatch(c,/overflow\s*:\s*(?:hidden|clip)|client:|<script|fetch\(|panier-inflation\.html/iu);
});
