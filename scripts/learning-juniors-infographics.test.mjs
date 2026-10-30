import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import test from 'node:test';
import {LEARNING_JUNIORS_KINDS,LEARNING_JUNIORS_SOURCES,learningJuniorsFigureReferences} from '../src/lib/ia-apprentissage-juniors-figures.mjs';
import {learningJuniorsScenes,inspectLearningJuniorsSvg,assertLearningJuniorsGeometry,tag,attrs,content} from './learning-juniors-svg-assertions.mjs';
import {assertFontLicenseReferences} from './font-license-assertions.mjs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const all=s=>inspectLearningJuniorsSvg(s.svg).all, text=s=>all(s).filter(n=>tag(n)==='text').map(content).join(' ');
const metric=(s,key)=>{const found=all(s).filter(n=>attrs(n)['data-metric']===key);assert.equal(found.length,1);return attrs(found[0]);};
const near=(a,b)=>assert.ok(Math.abs(Number(a)-b)<.00002,`${a} differs from ${b}`);
test('twenty passive vectors retain compact responsive geometry and semantic themes',()=>{
 assert.equal(learningJuniorsScenes().length,20);assert.equal(readdirSync(new URL('../src/figures/ai-learning-juniors/',import.meta.url)).length,20);
 for(const s of learningJuniorsScenes()){assertLearningJuniorsGeometry(s.svg);assert.equal(attrs(all(s).find(n=>tag(n)==='rect')).fill,'var(--color-ink)');assert.doesNotMatch(s.svg,/—|horlog|clock|#[0-9a-f]{3,8}\b/iu);assert.doesNotMatch(content(all(s).find(n=>tag(n)==='title')),/\bce (?:que|qui|qu[’'])|\bwhat\b/iu);for(const n of all(s).filter(n=>tag(n)==='text'))assert.ok(Number(attrs(n)['font-size'])*(s.mobile?280/420:501/1000)>=11);}
});
test('the proposed loop preserves task steps, distinct outcomes and reflection return',()=>{
 for(const s of learningJuniorsScenes().filter(s=>s.kind==='loop')){const t=text(s);for(const word of (s.lang==='fr'?['Observer','Proposer','Tester','Agir','Retour','Expérience']:['Observe','Propose','Test','Act','review','Experience']))assert.ok(t.includes(word));const d=content(all(s).find(n=>tag(n)==='desc'));assert.match(d,s.lang==='fr'?/proposée|proposé/:/proposed/);assert.match(d,/RNCP40799/);assert.match(d,/AFEST/);assert.ok(all(s).filter(n=>tag(n)==='path').length>=7,'Work and reflection loop paths visible');}
});
test('employment uses four same-vintage endpoints on the common 80–120 index axis',()=>{
 const v=[[108.4,87.66],[114.3,109]];
 for(const s of learningJuniorsScenes().filter(s=>s.kind==='employment')){for(let i=0;i<2;i++)for(let j=0;j<2;j++){const n=metric(s,`employment-${i}-${j}`);near(n['data-value'],v[i][j]);near(n.cx,(s.mobile?70:370)+(v[i][j]-80)*(s.mobile?300:530)/40);}const t=text(s);for(const z of ['22–25','35–40','80','100','120'])assert.ok(t.includes(z));const d=content(all(s).find(n=>tag(n)==='desc'));assert.match(d,/2022/);assert.match(d,/2026/);assert.match(d,/Q1/);assert.match(d,/Q5/);assert.match(d,s.lang==='fr'?/sans interpolation/:/no monthly interpolation/);assert.match(d,s.lang==='fr'?/causal/:/causal/);}
});
test('learning distinguishes two assessments and published coefficients with one-SE whiskers',()=>{
 const values=[[13.7,36.1],[-5.4,-.4]],ses=[[3.1,3.2],[2.2,1.3]];
 for(const s of learningJuniorsScenes().filter(s=>s.kind==='learning')){for(let i=0;i<2;i++)for(let j=0;j<2;j++){const n=metric(s,`effect-${i}-${j}`);near(n['data-value'],values[i][j]);const scale=v=>(s.mobile?100:320)+(v+10)*(s.mobile?270:630)/55;near(n.cx,scale(values[i][j]));const line=all(s).filter(n=>tag(n)==='line').map(attrs).find(a=>Number(a.y1)===Number(n.cy)&&Number(a.y2)===Number(n.cy)&&Math.abs(Number(a.x1)-scale(values[i][j]-ses[i][j]))<.00002);assert.ok(line);near(line.x2,scale(values[i][j]+ses[i][j]));}const d=content(all(s).find(n=>tag(n)==='desc'));assert.match(d,/2[ ,]848/);assert.match(d,/95/);assert.match(d,/standard/);assert.match(d,s.lang==='fr'?/5 %/:/5%/);}
});
test('diagnostic observations preserve A to B failure, C to B failure and A to D success',()=>{
 for(const s of learningJuniorsScenes().filter(s=>s.kind==='diagnosis')){const rects=all(s).filter(n=>tag(n)==='rect').map(attrs);for(let i=0;i<3;i++){assert.ok(rects.some(a=>a.id===`learning-juniors-${s.lang}-diagnosis-${s.mobile?'m':'d'}-card-pc-${i}`));assert.ok(rects.some(a=>a.id===`learning-juniors-${s.lang}-diagnosis-${s.mobile?'m':'d'}-card-printer-${i}`));}const t=text(s);assert.match(t,s.lang==='fr'?/Échec.*Échec.*Réussite/:/Failure.*Failure.*Success/);const d=content(all(s).find(n=>tag(n)==='desc'));assert.match(d,s.lang==='fr'?/fictif/:/Fictional/);assert.match(d,s.lang==='fr'?/sans identifier la cause/:/without proving a cause/);}
});
test('fictional time bars allocate the full 3000 minutes and preserve the learning budget',()=>{
 for(const s of learningJuniorsScenes().filter(s=>s.kind==='time')){let width=0;for(const[k,v]of Object.entries({operations:2300,learning:350,other:350})){const n=metric(s,k);near(n['data-value'],v);near(n.width,(s.mobile?364:920)*v/3000);width+=Number(n.width);}near(width,s.mobile?364:920);const t=text(s);for(const v of ['16 h 40','11 h 40','5 h 50','30 min','20 min'])assert.ok(t.includes(v));const d=content(all(s).find(n=>tag(n)==='desc'));assert.match(d,s.lang==='fr'?/hypothèses|Modèle illustratif/:/assumptions|Illustrative model/);assert.match(d,/350/);assert.match(d,s.lang==='fr'?/tuteur exclu/:/mentor.*excluded/);}
 near(100*(10-3),700);near(700*.5,350);near(11*30+20,350);near(2300+350+350,3000);
});
test('the closed metadata contract rejects reference drift and unsupported language',()=>{
 for(const l of['fr','en'])for(const[i,k]of LEARNING_JUNIORS_KINDS.entries())assert.deepEqual(learningJuniorsFigureReferences(l,k,i+1,[...LEARNING_JUNIORS_SOURCES[i]],'Caption','Method'),LEARNING_JUNIORS_SOURCES[i]);
 for(const l of[undefined,null,{},new String('fr'),'__proto__'])assert.throws(()=>learningJuniorsFigureReferences(l,'loop',1,LEARNING_JUNIORS_SOURCES[0],'Caption','Method'));
 for(const refs of[[],['R01'],['R01','R01'],['R01','R02" onload="x']])assert.throws(()=>learningJuniorsFigureReferences('fr','loop',1,refs,'Caption','Method'));
 assert.throws(()=>learningJuniorsFigureReferences('fr','employment',2,LEARNING_JUNIORS_SOURCES[1],'','Method'));
});
test('passive geometry rejects scripts, external assets, label overflow and missing ownership',()=>{
 const scene=learningJuniorsScenes().find(s=>s.lang==='fr'&&s.kind==='loop'&&!s.mobile).svg;
 for(const edit of[s=>s.replace('</svg>','<script>x</script></svg>'),s=>s.replace('<svg ','<svg onload="x" '),s=>s.replace('</svg>','<image href="https://example.com/a"/></svg>'),s=>s.replace('l0g Learning Juniors','Arial'),s=>s.replace('data-panel="learning-juniors-fr-loop-d-card-stage-0"','data-panel="missing"'),s=>s.replace('x="56" y="249"','x="995" y="249"')])assert.throws(()=>assertLearningJuniorsGeometry(edit(scene)));
});
test('component retains responsive methods and the reviewed local licensed fonts',()=>{
 const c=read('src/components/ApprentissageJuniorsFigure.astro');for(const weight of[400,700]){const p='public/fonts/stablecoins/dejavu-sans-'+weight+'.ttf';assert.ok(c.includes(p.replace('public','')));assert.equal(createHash('sha256').update(readFileSync(new URL('../'+p,import.meta.url))).digest('hex'),weight===400?'98f2d74db16bb5f41f74adf6d899aeec92861682cccc58bfdbe4d9d7d0a5ae11':'21a0350a4ac2a9f22b6a7a8dcaf6abb08c8b546d06499301f1fcf10996fd0df5');}
 assertFontLicenseReferences(read('public/fonts/stablecoins/LICENSE.txt'),'dejavu');assert.match(c,/@container\s*\(max-width:\s*500px\)/u);assert.match(c,/padding-bottom:\s*1rem/u);assert.doesNotMatch(c,/overflow\s*:\s*(?:hidden|clip)|client:|<script|fetch\(|reinvestir-le-temps\.html/iu);
});
