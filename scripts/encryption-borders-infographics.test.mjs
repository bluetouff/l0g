import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync,readdirSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {ENCRYPTION_BORDERS_KINDS,encryptionBordersScenes,inspectEncryptionBordersSvg,assertEncryptionBordersGeometry,tag,attrs,content} from './encryption-borders-svg-assertions.mjs';
import {assertFontLicenseReferences} from './font-license-assertions.mjs';
const scenes=encryptionBordersScenes(),read=f=>readFileSync(new URL('../'+f,import.meta.url),'utf8');
const elements=s=>inspectEncryptionBordersSvg(s.svg).all,metric=(s,v)=>elements(s).filter(n=>attrs(n)['data-metric']===v),words=s=>elements(s).filter(n=>['text','title','desc'].includes(tag(n))).map(content).join(' ');

test('twelve passive scenes preserve exact-font geometry, regular typography and semantic theme colours',()=>{
 assert.equal(scenes.length,12);assert.equal(readdirSync(new URL('../src/figures/encryption-borders-2026/',import.meta.url)).length,12);const ids=[];
 for(const s of scenes){assertEncryptionBordersGeometry(s.svg);assert.doesNotMatch(s.svg,/<script|foreignObject|—|#[a-f0-9]{3,8}\b|(?:deux|2) horloges|two clocks|mérite mieux que|deserves better than/iu);for(const n of elements(s)){const a=attrs(n);if(a.id)ids.push(a.id);if(tag(n)==='text'){assert.equal(a['font-weight'],'400');assert.ok(Number(a['font-size'])*(s.mobile?280/420:501/1000)>=12);}if(tag(n)==='title')assert.doesNotMatch(content(n),/\bce (?:qui|que|qu[’'])|\bwhat\b|, pas |, not /iu);}}
 assert.equal(ids.length,new Set(ids).size);
});

test('Apple UK notice counts exactly fifteen default and ten additional categories with equal marks and no volume percentage',()=>{
 for(const s of scenes.filter(s=>s.kind==='categories')){
  const marks=metric(s,'category-mark');assert.equal(marks.length,25);
  for(const[group,count,col]of[['default',15,'signal'],['additional',10,'amber']]){const subset=marks.filter(n=>attrs(n)['data-group']===group);assert.equal(subset.length,count);for(const n of subset){const a=attrs(n);assert.equal(tag(n),'circle');assert.equal(a['data-value'],'1');assert.equal(a['data-unit'],'category');assert.equal(a.fill,`var(--color-${col})`);}assert.equal(new Set(subset.map(n=>attrs(n).r)).size,1);}
  assert.equal(new Set(marks.map(n=>attrs(n).r)).size,1);assert.equal(metric(s,'key-control').length,1);assert.equal(attrs(metric(s,'key-control')[0])['data-holder'],'provider');assert.deepEqual(metric(s,'key-route').map(n=>[attrs(n)['data-from'],attrs(n)['data-to']]),[['provider','additional-data']]);assert.doesNotMatch(words(s),/\d+[,.]?\d*\s*%/u);assert.match(words(s),/2025/);assert.match(words(s),s.lang==='fr'?/une catégorie/:/one category/);assert.match(words(s),s.lang==='fr'?/protection standard/:/standard protection/);
 }
});

test('cloud relations preserve contracts, two data legs, administration and key control as distinct routes',()=>{
 for(const s of scenes.filter(s=>s.kind==='relations')){
  const routes=m=>metric(s,m).map(n=>[attrs(n)['data-from'],attrs(n)['data-to']]);
  assert.deepEqual(metric(s,'actor').map(n=>attrs(n)['data-role']),['client','contractor','service','storage','administrator','key-holder']);assert.deepEqual(routes('contract'),[['client','contractor']]);assert.deepEqual(routes('data'),[['client','service'],['service','storage']]);assert.deepEqual(routes('administration'),[['administrator','service']]);assert.deepEqual(routes('keys'),[['key-holder','storage']]);assert.notEqual(attrs(metric(s,'keys')[0]).stroke,attrs(metric(s,'administration')[0]).stroke);assert.match(words(s),s.lang==='fr'?/hypothétique|hypothétiques/:/hypothetical/i);
 }
});

test('migration encodes ordered dependencies with conditional retirement and optional coexistence, without invented time or cost',()=>{
 for(const s of scenes.filter(s=>s.kind==='migration')){
  assert.deepEqual(metric(s,'stage').map(n=>attrs(n)['data-role']),['export','adapt','validate','cutover','retirement']);assert.deepEqual(metric(s,'dependency').map(n=>[attrs(n)['data-from'],attrs(n)['data-to']]),[['export','adapt'],['adapt','validate'],['validate','cutover']]);const retire=metric(s,'retire');assert.equal(retire.length,1);assert.equal(attrs(retire[0])['data-from'],'cutover');assert.equal(attrs(retire[0])['data-to'],'retirement');assert.equal(attrs(retire[0])['data-mode'],'conditional');assert.equal(attrs(retire[0])['stroke-dasharray'],'5 6');assert.equal(metric(s,'coexistence').length,1);assert.equal(attrs(metric(s,'coexistence')[0])['data-mode'],'optional');assert.match(words(s),s.lang==='fr'?/durées non mesurées/:/durations unmeasured/);assert.doesNotMatch(words(s),/\b\d+\s*(?:EUR|USD|€|\$|days|jours|hours|heures|%)\b/u);
 }
});

test('controlled integration preserves licensed responsive typography, sequential anchors and all scope qualifications',()=>{
 const s=read('src/components/EncryptionBordersFigure.astro');assertFontLicenseReferences(read('public/fonts/ukraine-reparations/LICENSE.txt'),'liberation');
 for(const kind of ENCRYPTION_BORDERS_KINDS)for(const lang of['fr','en'])for(const mode of['desktop','mobile'])assert.ok(s.includes(`../figures/encryption-borders-2026/${kind}.${lang}.${mode}.svg?raw`));
 assert.deepEqual([...s.matchAll(/"number": "(\d+)"/gu)].map(m=>m[1]),['01','02','03']);assert.match(s,/Object\.prototype\.hasOwnProperty\.call\(captions, kind\)/);assert.match(s,/@container \(max-width: 500px\)/);assert.match(s,/max-width: 340px/);assert.match(s,/padding-bottom: 1rem/);assert.doesNotMatch(s,/overflow\s*:\s*hidden|Arial|Helvetica|font-weight:\s*700/);assert.match(s,/\/fonts\/ukraine-reparations\/liberation-sans-400\.ttf/);assert.match(s,/href=\{`#source-\$\{id\}`\}/);for(const id of['Q01','Q02','Q09','Q10','Q16','Q17','Q18','Q19','Q20'])assert.ok(s.includes('"'+id+'"'));
 assert.match(s,/Messages dans iCloud et Sauvegarde iCloud/);assert.match(s,/not an exhaustive inventory/);assert.match(s,/Data Act/);assert.match(s,/2 July 2026/);assert.match(s,/No total migration cost/);
});

test('geometry rejects executable markup, unknown semantics, missing label regions and frame escape',()=>{
 const svg=scenes[0].svg,variants=[svg.replace('</svg>','<script>alert(1)</script></svg>'),svg.replace('<svg ','<svg onload="x" '),svg.replace('<svg ','<svg href="https://example.invalid/" '),svg.replace('font-weight="400"','font-weight="700"'),svg.replace('data-panel="borders-categories-fr-d-label1"','data-panel="missing"'),svg.replace('x="24" y="44"','x="990" y="44"'),svg.replace('data-metric="category-mark"','data-metric="unknown"'),svg.replace('data-group="default"','data-group="invented"'),svg.replace('data-unit="category"','data-unit="users"')];for(const altered of variants)assert.throws(()=>assertEncryptionBordersGeometry(altered));
});

test('long malformed path input fails within a bounded process',()=>{
 const script=`import{assertEncryptionBordersGeometry,encryptionBordersScenes}from'./scripts/encryption-borders-svg-assertions.mjs';const s=encryptionBordersScenes()[0].svg.replace(/d="M[^\"]+"/u,'d="M'+'1'.repeat(8000)+' 1 L2 2"');try{assertEncryptionBordersGeometry(s);process.exit(1)}catch{process.exit(0)}`;const child=spawnSync(process.execPath,['--input-type=module','-e',script],{cwd:new URL('../',import.meta.url),timeout:1500,encoding:'utf8'});assert.ifError(child.error);assert.equal(child.status,0,child.stderr);
});
