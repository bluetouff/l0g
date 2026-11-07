import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync,readdirSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {ENCRYPTION_DAMAGE_KINDS,encryptionDamageScenes,inspectEncryptionDamageSvg,assertEncryptionDamageGeometry,tag,attrs,content} from './encryption-damage-svg-assertions.mjs';
import {assertFontLicenseReferences} from './font-license-assertions.mjs';
const scenes=encryptionDamageScenes(),read=f=>readFileSync(new URL('../'+f,import.meta.url),'utf8');
const elements=s=>inspectEncryptionDamageSvg(s.svg).all,metric=(s,v)=>elements(s).filter(n=>attrs(n)['data-metric']===v),words=s=>elements(s).filter(n=>['text','title','desc'].includes(tag(n))).map(content).join(' ');

test('twelve passive scenes preserve exact-font geometry, regular typography and semantic theme colours',()=>{
 assert.equal(scenes.length,12);assert.equal(readdirSync(new URL('../src/figures/encryption-damage-2026/',import.meta.url)).length,12);const ids=[];
 for(const s of scenes){assertEncryptionDamageGeometry(s.svg);assert.doesNotMatch(s.svg,/<script|foreignObject|—|#[a-f0-9]{3,8}\b|(?:deux|2) horloges|two clocks|mérite mieux que|deserves better than/iu);for(const n of elements(s)){const a=attrs(n);if(a.id)ids.push(a.id);if(tag(n)==='text'){assert.equal(a['font-weight'],'400');assert.ok(Number(a['font-size'])*(s.mobile?280/420:501/1000)>=12);}if(tag(n)==='title')assert.doesNotMatch(content(n),/\bce (?:qui|que|qu[’'])|\bwhat\b|, pas |, not /iu);}}
 assert.equal(ids.length,new Set(ids).size);
});

test('documented cases keep entry, capability and collection distinct, including the unresolved Greek entry',()=>{
 for(const s of scenes.filter(s=>s.kind==='paths')){
  const stages=metric(s,'stage');assert.equal(stages.length,6);
  for(const c of['greece','telecom'])assert.deepEqual(stages.filter(n=>attrs(n)['data-case']===c).map(n=>attrs(n)['data-role']),['entry','capability','collection']);
  const entry=metric(s,'entry-route'),collection=metric(s,'collection-route');assert.equal(entry.length,2);assert.equal(collection.length,2);
  assert.deepEqual(entry.map(n=>[attrs(n)['data-case'],attrs(n)['data-from'],attrs(n)['data-to'],attrs(n)['data-evidence']]),[['greece','entry','capability','unknown'],['telecom','entry','capability','reported']]);
  assert.equal(attrs(entry[0])['stroke-dasharray'],'5 6');assert.equal(attrs(entry[1])['stroke-dasharray'],undefined);
  assert.ok(collection.every(n=>attrs(n)['data-from']==='capability'&&attrs(n)['data-to']==='collection'&&attrs(n)['data-evidence']==='reported'));
  assert.match(words(s),/2004–2005/);assert.match(words(s),/2007/);assert.match(words(s),/2025–2026/);assert.match(words(s),s.lang==='fr'?/distincts|distinctes/:/distinct|separate/i);assert.doesNotMatch(words(s),/\d+\s*%/u);
 }
});

test('shared and separate controls expose the same illustrative datasets under explicit independence assumptions',()=>{
 for(const s of scenes.filter(s=>s.kind==='exposure')){
  const datasets=metric(s,'dataset'),controls=metric(s,'control'),links=metric(s,'scope-link');assert.equal(datasets.length,8);assert.equal(controls.length,5);assert.equal(links.length,8);
  for(const mode of['shared','separate'])assert.deepEqual(datasets.filter(n=>attrs(n)['data-architecture']===mode).map(n=>attrs(n)['data-set']),['A','B','C','D']);
  const accessible=m=>datasets.filter(n=>attrs(n)['data-architecture']===m&&attrs(n)['data-state']==='potentially-accessible').map(n=>attrs(n)['data-set']);assert.deepEqual(accessible('shared'),['A','B','C','D']);assert.deepEqual(accessible('separate'),['A']);
  assert.deepEqual(controls.filter(n=>attrs(n)['data-state']==='compromised').map(n=>attrs(n)['data-role']),['shared-control','control-A']);
  assert.deepEqual(links.filter(n=>attrs(n)['data-architecture']==='shared').map(n=>[attrs(n)['data-from'],attrs(n)['data-to']]),['A','B','C','D'].map(x=>['shared-control','set-'+x]));assert.deepEqual(links.filter(n=>attrs(n)['data-architecture']==='separate').map(n=>[attrs(n)['data-from'],attrs(n)['data-to']]),['A','B','C','D'].map(x=>['control-'+x,'set-'+x]));
  assert.match(words(s),s.lang==='fr'?/hypothèses|supposée/:/assumptions|assumed/);assert.match(words(s),s.lang==='fr'?/qualitatif|illustratifs/:/qualitative|illustrative/i);assert.ok(elements(s).every(n=>attrs(n)['data-value']===undefined));assert.doesNotMatch(words(s),/\d+\s*%|\b(?:EUR|USD)\b/u);
 }
});

test('service recovery is independent of the conditional persistence of an already readable copy',()=>{
 for(const s of scenes.filter(s=>s.kind==='recovery')){
  assert.deepEqual(metric(s,'stage').map(n=>attrs(n)['data-role']),['detection','containment','rebuilding','resumption']);assert.deepEqual(metric(s,'recovery-route').map(n=>[attrs(n)['data-from'],attrs(n)['data-to']]),[['detection','containment'],['containment','rebuilding'],['rebuilding','resumption']]);
  assert.deepEqual(metric(s,'copy').map(n=>[attrs(n)['data-role'],attrs(n)['data-mode']]),[['plaintext-copy','conditional'],['external-copy','conditional']]);const copy=metric(s,'copy-persistence');assert.equal(copy.length,1);assert.equal(attrs(copy[0])['data-mode'],'conditional');assert.equal(attrs(copy[0])['stroke-dasharray'],'5 6');assert.equal(attrs(copy[0])['data-from'],'plaintext-copy');assert.equal(attrs(copy[0])['data-to'],'external-copy');assert.equal(metric(s,'recovery-route').filter(n=>/copy/.test(attrs(n)['data-from']+attrs(n)['data-to'])).length,0);
  assert.match(words(s),/Orange/);assert.match(words(s),/2025/);assert.match(words(s),s.lang==='fr'?/scénario distinct/:/separate scenario|scenario separate/);assert.doesNotMatch(words(s),/Orange.{0,30}(?:Salt Typhoon|backdoor|porte dérobée)/iu);
 }
});

test('controlled integration preserves a licensed responsive font and the source-specific limitations',()=>{
 const s=read('src/components/EncryptionDamageFigure.astro');assertFontLicenseReferences(read('public/fonts/ukraine-reparations/LICENSE.txt'),'liberation');
 for(const kind of ENCRYPTION_DAMAGE_KINDS)for(const lang of['fr','en'])for(const mode of['desktop','mobile'])assert.ok(s.includes(`../figures/encryption-damage-2026/${kind}.${lang}.${mode}.svg?raw`));
 assert.deepEqual([...s.matchAll(/"number": "(\d+)"/gu)].map(m=>m[1]),['01','02','03']);assert.match(s,/Object\.prototype\.hasOwnProperty\.call\(captions, kind\)/);assert.match(s,/@container \(max-width: 500px\)/);assert.match(s,/max-width: 340px/);assert.match(s,/padding-bottom: 1rem/);assert.doesNotMatch(s,/overflow\s*:\s*hidden|Arial|Helvetica|font-weight:\s*700|—/);assert.match(s,/\/fonts\/ukraine-reparations\/liberation-sans-400\.ttf/);assert.match(s,/href=\{`#source-\$\{id\}`\}/);for(const id of['V02','V03','V04','V17','V19','V12','V15','V18'])assert.ok(s.includes('"'+id+'"'));
 assert.match(s,/initial entry remains unresolved/);assert.match(s,/neither compromise probability nor expected annual loss/);assert.match(s,/separate from that incident/);assert.match(s,/Salt Typhoon/);assert.match(s,/28 July 2025/);
});

test('geometry rejects active markup, invented semantics, missing regions and frame escape',()=>{
 const svg=scenes[0].svg,variants=[svg.replace('</svg>','<script>alert(1)</script></svg>'),svg.replace('<svg ','<svg onload="x" '),svg.replace('<svg ','<svg href="https://example.invalid/" '),svg.replace('font-weight="400"','font-weight="700"'),svg.replace('data-panel="damage-paths-fr-d-label1"','data-panel="missing"'),svg.replace('x="24" y="44"','x="990" y="44"'),svg.replace('data-metric="stage"','data-metric="invented"'),svg.replace('data-case="greece"','data-case="same-campaign"'),svg.replace('data-evidence="unknown"','data-evidence="certain"')];for(const altered of variants)assert.throws(()=>assertEncryptionDamageGeometry(altered));
});

test('long malformed numeric path fails within a bounded process',()=>{
 const script=`import{assertEncryptionDamageGeometry,encryptionDamageScenes}from'./scripts/encryption-damage-svg-assertions.mjs';const s=encryptionDamageScenes()[0].svg.replace(/d="M[^\"]+"/u,'d="M'+'1'.repeat(8000)+' 1 L2 2"');try{assertEncryptionDamageGeometry(s);process.exit(1)}catch{process.exit(0)}`;const child=spawnSync(process.execPath,['--input-type=module','-e',script],{cwd:new URL('../',import.meta.url),timeout:1500,encoding:'utf8'});assert.ifError(child.error);assert.equal(child.status,0,child.stderr);
});
