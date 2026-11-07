import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync,readdirSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {ENCRYPTION_EVIDENCE_KINDS,encryptionEvidenceScenes,inspectEncryptionEvidenceSvg,assertEncryptionEvidenceGeometry,tag,attrs,content} from './encryption-evidence-svg-assertions.mjs';
import {assertFontLicenseReferences} from './font-license-assertions.mjs';
const scenes=encryptionEvidenceScenes(),read=f=>readFileSync(new URL('../'+f,import.meta.url),'utf8');
const elements=s=>inspectEncryptionEvidenceSvg(s.svg).all,metric=(s,v)=>elements(s).filter(n=>attrs(n)['data-metric']===v),words=s=>elements(s).filter(n=>['text','title','desc'].includes(tag(n))).map(content).join(' '),values=(s,m,keys)=>metric(s,m).map(n=>keys.map(k=>attrs(n)['data-'+k]));
test('twelve passive scenes preserve exact-font geometry, regular type and semantic themes',()=>{
 assert.equal(scenes.length,12);assert.equal(readdirSync(new URL('../src/figures/encryption-evidence-2026/',import.meta.url)).length,12);const ids=[];
 for(const s of scenes){assertEncryptionEvidenceGeometry(s.svg);assert.doesNotMatch(s.svg,/<script|foreignObject|—|#[a-f0-9]{3,8}\b|(?:deux|2) horloges|two clocks|mérite mieux que|deserves better than/iu);for(const n of elements(s)){const a=attrs(n);if(a.id)ids.push(a.id);if(tag(n)==='text'){assert.equal(a['font-weight'],'400');assert.ok(Number(a['font-size'])*(s.mobile?280/420:501/1000)>=12);}if(tag(n)==='title')assert.doesNotMatch(content(n),/\bce (?:qui|que|qu[’'])|\bwhat\b|, pas |, not /iu);}}
 assert.equal(ids.length,new Set(ids).size);
});
test('Signal preserves queried numbers, account results and metadata precision without personal identifiers',()=>{
 for(const s of scenes.filter(s=>s.kind==='signal')){
  assert.deepEqual(values(s,'request',['role','date']),['A','B','C','D'].map(x=>['number-'+x,'2026-10-05']));
  assert.deepEqual(values(s,'request-route',['from','to']),[['query','lookup']]);assert.deepEqual(values(s,'result-route',['from','to']),[['lookup','absent'],['lookup','present']]);
  assert.deepEqual(values(s,'result',['result']),[['absent'],['absent'],['absent'],['present']]);assert.equal(attrs(metric(s,'result').at(-1))['data-date'],'2026-10-06');assert.deepEqual(values(s,'field',['role','resolution']),[['creation','date-time'],['last-contact','date-only']]);
  assert.match(words(s),s.lang==='fr'?/Signal.*expurgées/s:/Signal.*redacted/s);assert.match(words(s),s.lang==='fr'?/fournisseur/:/provider/);assert.doesNotMatch(words(s),/\+\d{8,}|\d{3}[- .]\d{3}[- .]\d{4}|four people|quatre personnes/iu);
 }
});
test('production and review deadlines retain distinct triggers and conditions',()=>{
 for(const s of scenes.filter(s=>s.kind==='orders')){
  assert.deepEqual(values(s,'transmission',['case','start','deadline']),[['ordinary','epoc-receipt','10d'],['notified','epoc-receipt','10d'],['emergency','epoc-receipt','8h']]);assert.deepEqual(values(s,'legal-review',['start','deadline']),[['notification-receipt','96h']]);assert.deepEqual(values(s,'notification',['case']),[['emergency-notified']]);assert.deepEqual(values(s,'order',['role']),[['epoc']]);
  assert.match(words(s),s.lang==='fr'?/motif de refus/:/refusal grounds/);assert.match(words(s),s.lang==='fr'?/accord exprès/:/express clearance/);assert.match(words(s),s.lang==='fr'?/normatifs/:/Legal deadlines/);assert.doesNotMatch(words(s),/\d+\s*%/u);
 }
});
test('vulnerability routes distinguish restricted use, possible review and patch deployment',()=>{
 for(const s of scenes.filter(s=>s.kind==='vulnerability')){
  assert.deepEqual(values(s,'stage',['role']).flat().sort(),['known-flaw','decision','restricted','vendor','investigation','patch','protection'].sort());assert.deepEqual(values(s,'decision-route',['from','to']),[['known-flaw','decision'],['decision','restricted'],['decision','vendor']]);assert.deepEqual(values(s,'work-route',['from','to']),[['restricted','investigation'],['vendor','patch'],['patch','protection']]);assert.deepEqual(values(s,'reconsideration',['from','to','mode']),[['restricted','vendor','conditional']]);assert.deepEqual(values(s,'exposure',['from','to','mode']),[['known-flaw','protection','conditional']]);assert.equal(attrs(metric(s,'exposure')[0])['stroke-dasharray'],'5 6');
  assert.match(words(s),/2017/);assert.match(words(s),/2021/);assert.match(words(s),/MIIT/);assert.match(words(s),s.lang==='fr'?/cadres distincts/:/distinct frameworks/i);assert.doesNotMatch(words(s),/\d+\s*%/u);
 }
});
test('integration keeps licensed responsive type and source-specific limitations',()=>{
 const s=read('src/components/EncryptionEvidenceFigure.astro');assertFontLicenseReferences(read('public/fonts/ukraine-reparations/LICENSE.txt'),'liberation');for(const k of ENCRYPTION_EVIDENCE_KINDS)for(const l of['fr','en'])for(const m of['desktop','mobile'])assert.ok(s.includes(`../figures/encryption-evidence-2026/${k}.${l}.${m}.svg?raw`));
 assert.deepEqual([...s.matchAll(/"number": "(\d+)"/gu)].map(m=>m[1]),['01','02','03']);assert.match(s,/Object\.prototype\.hasOwnProperty\.call\(captions, kind\)/);assert.match(s,/@container \(max-width: 500px\)/);assert.match(s,/max-width: 340px/);assert.match(s,/padding-bottom: 1rem/);assert.doesNotMatch(s,/overflow\s*:\s*hidden|Arial|Helvetica|font-weight:\s*700|—/);assert.match(s,/\/fonts\/ukraine-reparations\/liberation-sans-400\.ttf/);assert.match(s,/href=\{`#source-\$\{id\}`\}/);for(const id of['W02','W07','W13','W14','W19','W20'])assert.ok(s.includes('"'+id+'"'));
 for(const phrase of['redacted court documents','notification by default','investigation’s outcome remains unknown','from receipt of the notification','expressly confirms','two legal frameworks remain distinct','reporting; patch deployment'])assert.ok(s.includes(phrase),phrase);assert.doesNotMatch(s,/PDF.{0,30}(?:inaccess|unread|non consult)/iu);
});
test('geometry rejects active markup, invented semantics, missing regions and frame escape',()=>{
 const svg=scenes[0].svg,variants=[svg.replace('</svg>','<script>alert(1)</script></svg>'),svg.replace('<svg ','<svg onload="x" '),svg.replace('<svg ','<svg href="https://example.invalid/" '),svg.replace('font-weight="400"','font-weight="700"'),svg.replace('data-panel="evidence-signal-fr-d-label1"','data-panel="missing"'),svg.replace('x="24" y="44"','x="990" y="44"'),svg.replace('data-metric="request"','data-metric="invented"'),svg.replace('data-result="absent"','data-result="proven-person"'),svg.replace('data-resolution="date-only"','data-resolution="exact-time"')];for(const s of variants)assert.throws(()=>assertEncryptionEvidenceGeometry(s));
});
test('malformed numeric paths fail in a bounded process',()=>{
 const script=`import{assertEncryptionEvidenceGeometry,encryptionEvidenceScenes}from'./scripts/encryption-evidence-svg-assertions.mjs';const s=encryptionEvidenceScenes()[0].svg.replace(/d="M[^\"]+"/u,'d="M'+'1'.repeat(8000)+' 1 L2 2"');try{assertEncryptionEvidenceGeometry(s);process.exit(1)}catch{process.exit(0)}`;const child=spawnSync(process.execPath,['--input-type=module','-e',script],{cwd:new URL('../',import.meta.url),timeout:1500,encoding:'utf8'});assert.ifError(child.error);assert.equal(child.status,0,child.stderr);
});
