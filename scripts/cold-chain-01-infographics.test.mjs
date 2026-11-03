import assert from 'node:assert/strict';
import {readFileSync,readdirSync}from'node:fs';
import {createHash}from'node:crypto';
import test from'node:test';
import {COLD_CHAIN_FIGURE_KINDS,COLD_CHAIN_FIGURE_SOURCES,coldChainFigureMeta}from'../src/lib/cold-chain-01-figures.mjs';
import {coldChainScenes,inspectColdChainSvg,assertColdChainGeometry,tag,attrs,content,labelBox}from'./cold-chain-01-svg-assertions.mjs';
import {assertFontLicenseReferences}from'./font-license-assertions.mjs';
const scenes=coldChainScenes(),all=s=>inspectColdChainSvg(s.svg).all,text=s=>all(s).map(content).join(' '),metric=(s,name)=>all(s).filter(n=>attrs(n)['data-metric']===name),connector=(s,name)=>all(s).filter(n=>attrs(n)['data-connector']===name),read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
test('16 passive cold-chain scenes keep native labels, semantic colours and internal panel geometry',()=>{
 assert.equal(scenes.length,16);assert.equal(readdirSync(new URL('../src/figures/cold-chain-01/',import.meta.url)).length,16);const ids=[];
 for(const s of scenes){assertColdChainGeometry(s.svg);assert.equal(attrs(all(s).find(n=>tag(n)==='rect'&&attrs(n).id?.endsWith('-frame'))).fill,'var(--color-ink)');assert.doesNotMatch(s.svg,/<script|foreignObject|—|horloges|clocks|#[a-f\d]{3,8}\b/iu);for(const n of all(s)){if(attrs(n).id)ids.push(attrs(n).id);if(tag(n)==='text'){assert.ok(Number(attrs(n)['font-size'])*(s.mobile?280/420:501/1000)>=12);assert.ok(labelBox(n).advance>0);}if(tag(n)==='title')assert.doesNotMatch(content(n),/\bce (?:que|qui|qu[’'])|\bwhat\b|, pas |, not /iu);}}
 assert.equal(ids.length,new Set(ids).size);
});
test('timeline separates five dated reports and documents without asserting a common campaign',()=>{
 assert.equal((Date.UTC(2026,10,2)-Date.UTC(2026,9,12))/86400000,21);
 for(const s of scenes.filter(s=>s.kind==='timeline')){assert.deepEqual(metric(s,'event').map(n=>Number(attrs(n)['data-value'])),[0,1,2,3,4]);for(const d of['12 OCT','13 OCT','16 OCT','21 OCT','02 NOV'])assert.ok(text(s).includes(d));assert.ok(text(s).includes('21'));const m=coldChainFigureMeta(s.lang,s.kind).method;assert.match(m,s.lang==='fr'?/sans proportion temporelle/:/not a time scale/);assert.match(m,s.lang==='fr'?/lien.*demeure ouvert/:/connection.*unproven/);}
});
test('control architecture retains permission, supervision, local action, heat and measurement feedback',()=>{
 for(const s of scenes.filter(s=>s.kind==='control')){const t=text(s);for(const term of s.lang==='fr'?['Accès distant','Droits autorisés','Superviseur','Régulateur local','Dégivrage électrique']:['Remote access','Permissions','Supervisor','Local controller','Electric defrost'])assert.ok(t.includes(term));assert.equal(connector(s,'measurement').length,1);const m=coldChainFigureMeta(s.lang,s.kind).method;assert.match(m,s.lang==='fr'?/dégivrage électrique/:/electric-defrost/);assert.match(m,s.lang==='fr'?/inconnus/:/unknown/);assert.doesNotMatch(t,/\b(?:admin|password|curl|https?:|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\b/iu);}
});
test('temperature scene separates target, air and food and limits minus18C to quick-frozen products',()=>{
 for(const s of scenes.filter(s=>s.kind==='temperature')){const t=text(s);for(const term of s.lang==='fr'?['Consigne','Air','Produit','−18','C']:['Setpoint','Air','Food','−18','C'])assert.ok(t.includes(term));const m=coldChainFigureMeta(s.lang,s.kind).method;assert.match(m,/89\/108/);assert.match(m,/37\/2005/);assert.match(m,s.lang==='fr'?/surgelés/:/quick-frozen/);assert.match(m,s.lang==='fr'?/tolérances/:/tolerances/);assert.match(m,s.lang==='fr'?/sans valeur mesurée/:/without depicting readings/);assert.equal(connector(s,s.mobile?'instruction':'setpoint').length,1);assert.ok(all(s).some(n=>tag(n)==='circle'&&attrs(n).fill==='none'&&attrs(n).stroke==='var(--color-amber)'),'Degree symbol is a passive vector ring, not a missing font glyph');}
});
test('the hourly report is a four-sample mean, with three15minute gaps and no invented measurements',()=>{
 for(const s of scenes.filter(s=>s.kind==='logging')){assert.deepEqual(metric(s,'sample').map(n=>Number(attrs(n)['data-value'])),[1,2,3,4]);const labels=all(s).filter(n=>tag(n)==='text').map(content);assert.equal(labels.filter(t=>t==='15 min').length,3);for(const symbol of['T1','T2','T3','T4','(T1 + T2 + T3 + T4) / 4'])assert.ok(labels.includes(symbol));for(let i=0;i<4;i++)assert.equal(connector(s,'aggregate-'+i).length,1);const m=coldChainFigureMeta(s.lang,s.kind).method;for(const term of['BC337629891709en-001101','2026','5.10','52'])assert.ok(m.includes(term));assert.match(m,s.lang==='fr'?/juin/:/June/);assert.match(m,s.lang==='fr'?/symboles/:/symbols/);assert.match(m,s.lang==='fr'?/victimes.*inconnue/:/victim.*unknown/);assert.doesNotMatch(text(s),/60\s*min/u);}
});
test('averaging cannot identify a unique maximum or exposure history',()=>{
 const avg=a=>a.reduce((s,v)=>s+v,0)/a.length;
 const sequences=[[1,1,1,1],[0,0,0,4],[0,2,0,2]];assert.deepEqual(sequences.map(avg),[1,1,1]);assert.deepEqual(sequences.map(x=>Math.max(...x)),[1,4,2]);
});
test('passive parser and geometry reject unsafe markup, hidden labels, missing fonts and malformed paths',()=>{
 const raw=scenes[0].svg;
 for(const mutate of[s=>s.replace('</svg>','<script>x</script></svg>'),s=>s.replace('<svg ','<svg onload="x" '),s=>s.replace('</svg>','<image href="https://example.invalid/a"/></svg>'),s=>s.replace('l0g Cold Chain','Arial'),s=>s.replace(/data-panel="[^"]+"/u,'data-panel="absent"'),s=>s.replace('x="28" y="45"','x="990" y="45"')]){const changed=mutate(raw);assert.notEqual(changed,raw);assert.throws(()=>assertColdChainGeometry(changed));}
 const flow=scenes.find(s=>s.kind==='control').svg;assert.throws(()=>assertColdChainGeometry(flow.replace(/d="M/u,'d="M'+'9'.repeat(200))));for(const lang of[null,{},new String('fr'),'__proto__'])assert.throws(()=>coldChainFigureMeta(lang,'timeline'));for(const kind of['../timeline','timeline" onload="x','wrong',{},null])assert.throws(()=>coldChainFigureMeta('fr',kind));
});
test('the component uses licensed local fonts and compact, padding-safe closed imports',()=>{
 const c=read('src/components/ColdChainFigure.astro');for(const w of[400,700]){const p='public/fonts/stablecoins/dejavu-sans-'+w+'.ttf';assert.ok(c.includes(p.replace('public','')));assert.equal(createHash('sha256').update(readFileSync(new URL('../'+p,import.meta.url))).digest('hex'),w===400?'98f2d74db16bb5f41f74adf6d899aeec92861682cccc58bfdbe4d9d7d0a5ae11':'21a0350a4ac2a9f22b6a7a8dcaf6abb08c8b546d06499301f1fcf10996fd0df5');}assertFontLicenseReferences(read('public/fonts/stablecoins/LICENSE.txt'),'dejavu');assert.match(c,/@container\s*\(max-width:\s*500px\)/u);assert.match(c,/padding-bottom:\s*1rem/u);assert.match(c,/max-width:\s*310px/u);assert.ok(1080*310/420<800);assert.match(c,/import\.meta\.glob/);assert.match(c,/#source-\$\{ref\}/u);assert.doesNotMatch(c,/overflow\s*:\s*(?:hidden|clip)|client:|<script|fetch\(|foreignObject/iu);for(const lang of['fr','en'])for(const[i,kind]of COLD_CHAIN_FIGURE_KINDS.entries())assert.deepEqual(coldChainFigureMeta(lang,kind).sources,COLD_CHAIN_FIGURE_SOURCES[i]);
});
