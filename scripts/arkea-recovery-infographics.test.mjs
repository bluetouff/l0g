import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync,readdirSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {ARKEA_RECOVERY_KINDS,arkeaRecoveryScenes,inspectArkeaRecoverySvg,assertArkeaRecoveryGeometry,tag,attrs,content} from './arkea-recovery-svg-assertions.mjs';
import {assertFontLicenseReferences} from './font-license-assertions.mjs';
const scenes=arkeaRecoveryScenes(),read=file=>readFileSync(new URL('../'+file,import.meta.url),'utf8');
const all=s=>inspectArkeaRecoverySvg(s.svg).all,metric=(s,name)=>all(s).filter(n=>attrs(n)['data-metric']===name),words=s=>all(s).filter(n=>['text','title','desc'].includes(tag(n))).map(content).join(' ');

test('twelve passive accessible scenes retain regular-font geometry, charter colours and readable compact proportions',()=>{
 assert.equal(scenes.length,12);assert.equal(readdirSync(new URL('../src/figures/arkea-recovery-2026/',import.meta.url)).length,12);const ids=[];
 for(const s of scenes){assertArkeaRecoveryGeometry(s.svg);assert.doesNotMatch(s.svg,/<script|foreignObject|—|#[a-f0-9]{3,8}\b|(?:deux|2) horloges|two clocks|mérite mieux que|deserves better than/iu);
  for(const n of all(s)){const a=attrs(n);if(a.id)ids.push(a.id);if(tag(n)==='text'){assert.equal(a['font-weight'],'400');assert.ok(Number(a['font-size'])*(s.mobile?280/420:501/1000)>=12)}if(tag(n)==='title')assert.doesNotMatch(content(n),/\bce (?:qui|que|qu[’'])|\bwhat\b|, pas |, not /iu);}
 }assert.equal(ids.length,new Set(ids).size);
});

test('generic payment circuit distinguishes onward transfers, a recall request and conditional return directions',()=>{
 for(const s of scenes.filter(s=>s.kind==='transfer')){
  const transfers=metric(s,'payment');assert.deepEqual(transfers.map(n=>[Number(attrs(n)['data-from']),Number(attrs(n)['data-to'])]),[[0,1],[1,2]]);
  for(const[name,from,to]of[['recall',0,1],['return',1,0]]){const xs=metric(s,name);assert.equal(xs.length,1);assert.equal(attrs(xs[0])['data-from'],String(from));assert.equal(attrs(xs[0])['data-to'],String(to));assert.equal(attrs(xs[0])['stroke-dasharray'],'7 6');}
  assert.match(words(s),s.lang==='fr'?/Circuit générique|Circuit général/:/Generic circuit/);assert.match(words(s),s.lang==='fr'?/sous conditions|conditionnel/:/conditional/i);assert.match(words(s),s.lang==='fr'?/Arkéa reste à établir/:/Arkéa’s actual payment circuit remains unconfirmed/);
 }
});

test('custody and self-custody retain overlapping signing and issuer controls on native USDC, with Bitcoin scoped separately',()=>{
 for(const s of scenes.filter(s=>s.kind==='control')){
  for(const name of ['signing','issuer-control','token'])assert.deepEqual(metric(s,name).map(n=>attrs(n)['data-mode']),['custody','self']);
  assert.equal(all(s).filter(n=>tag(n)==='text'&&content(n)==='USDC').length,2);
  const tokens=metric(s,'token');assert.ok(tokens.every(n=>tag(n)==='circle'&&attrs(n).fill==='var(--color-ink)'));
  assert.match(words(s),/Bitcoin/);assert.match(words(s),/Circle/);assert.match(words(s),s.lang==='fr'?/Aucune opération du cas Arkéa/:/No actual Arkéa transaction/);
 }
});

test('Maine dates and its single proportional axis reproduce 737 calendar days to an announcement',()=>{
 const dates=['2024-03-06','2025-01-17','2025-06-25','2026-03-13'];const offsets=dates.map(date=>(Date.parse(date+'T00:00:00Z')-Date.parse(dates[0]+'T00:00:00Z'))/86400000);assert.deepEqual(offsets,[0,317,476,737]);
 for(const s of scenes.filter(s=>s.kind==='maine')){
  const axis=metric(s,'calendar-axis');assert.equal(axis.length,1);assert.equal(attrs(axis[0])['data-from'],'0');assert.equal(attrs(axis[0])['data-to'],'737');assert.equal(attrs(axis[0])['data-value'],'737');
  const events=metric(s,'event');assert.deepEqual(events.map(n=>attrs(n)['data-date']),dates);assert.deepEqual(events.map(n=>Number(attrs(n)['data-value'])),offsets);
  const dimension=s.mobile?'cy':'cx',positions=events.map(n=>Number(attrs(n)[dimension]));for(let i=0;i<4;i++)assert.ok(Math.abs((positions[i]-positions[0])/(positions[3]-positions[0])-offsets[i]/737)<1e-10);
  assert.match(words(s),s.lang==='fr'?/annonce|annoncé/:/announcement|announced/);assert.match(words(s),s.lang==='fr'?/crédit final|crédit effectif/:/final-credit|Final credit/);assert.match(words(s),s.lang==='fr'?/sans portée de délai moyen|Aucun délai moyen/:/no average|No average/);
 }
});

test('seized USDT and the later announced dollars remain distinct amounts and units',()=>{
 for(const s of scenes.filter(s=>s.kind==='maine')){
  const seized=metric(s,'seized-usdt'),announced=metric(s,'announced-usd');assert.equal(seized.length,1);assert.equal(announced.length,1);assert.equal(attrs(seized[0])['data-value'],'470773');assert.equal(attrs(announced[0])['data-value'],'470735');assert.match(content(seized[0]),/USDT/);assert.match(content(announced[0]),/USD/);assert.match(content(announced[0]),s.lang==='fr'?/env\./:/about/);
 }
});

test('controlled bilingual component uses the existing licensed font and complete source scopes',()=>{
 const c=read('src/components/ArkeaRecoveryFigure.astro');assertFontLicenseReferences(read('public/fonts/predictstreet/LICENSE.txt'),'liberation');
 for(const k of ARKEA_RECOVERY_KINDS)for(const l of ['fr','en'])for(const m of ['desktop','mobile'])assert.ok(c.includes(`../figures/arkea-recovery-2026/${k}.${l}.${m}.svg?raw`));
 assert.match(c,/Object\.prototype\.hasOwnProperty\.call\(captions, kind\)/);assert.match(c,/@container \(max-width: 500px\)/);assert.match(c,/max-width: 340px/);assert.match(c,/padding-bottom: 1rem/);assert.doesNotMatch(c,/overflow\s*:\s*hidden|Arial|Helvetica|font-weight:\s*700/);assert.match(c,/\/fonts\/predictstreet\/liberation-sans-400\.ttf/);assert.match(c,/href=\{`#source-\$\{id\}`\}/);
 for(const phrase of ['Aucun rail de paiement','its customers’ funds or accounts','native USDC','les restrictions du jeton','the FBI obtained the key','0, 317, 476 et 737','final-credit date','aucun délai moyen'])assert.ok(c.includes(phrase),phrase);
});

test('geometry guards reject active nodes, font drift, unknown metrics and missing label regions',()=>{
 const svg=scenes[0].svg;
 for(const altered of [svg.replace('</svg>','<script>alert(1)</script></svg>'),svg.replace('<svg ','<svg onload="x" '),svg.replace('<svg ','<svg href="https://example.invalid/" '),svg.replace('font-weight="400"','font-weight="700"'),svg.replace('data-panel="arkea-transfer-fr-d-header"','data-panel="missing"'),svg.replace('x="24" y="92"','x="990" y="92"'),svg.replace('data-metric="payment"','data-metric="unknown"')])assert.throws(()=>assertArkeaRecoveryGeometry(altered));
});

test('path parsing rejects long malformed numerical input within a bounded process',()=>{
 const script=`import{assertArkeaRecoveryGeometry,arkeaRecoveryScenes}from'./scripts/arkea-recovery-svg-assertions.mjs';const s=arkeaRecoveryScenes()[0].svg.replace(/d="M[^\"]+"/u,'d="M'+ '1'.repeat(8000)+' 1 L2 2"');try{assertArkeaRecoveryGeometry(s);process.exit(1)}catch{process.exit(0)}`;
 const child=spawnSync(process.execPath,['--input-type=module','-e',script],{cwd:new URL('../',import.meta.url),timeout:1500,encoding:'utf8'});assert.ifError(child.error);assert.equal(child.status,0,child.stderr);
});
