import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync,readdirSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {ENCRYPTION_PROOF_KINDS,encryptionProofScenes,inspectEncryptionProofSvg,assertEncryptionProofGeometry,tag,attrs,content} from './encryption-proof-svg-assertions.mjs';
import {assertFontLicenseReferences} from './font-license-assertions.mjs';
const scenes=encryptionProofScenes(),read=f=>readFileSync(new URL('../'+f,import.meta.url),'utf8');
const elements=s=>inspectEncryptionProofSvg(s.svg).all,metric=(s,v)=>elements(s).filter(n=>attrs(n)['data-metric']===v),words=s=>elements(s).filter(n=>['text','title','desc'].includes(tag(n))).map(content).join(' '),values=(s,m,keys)=>metric(s,m).map(n=>keys.map(k=>attrs(n)['data-'+k]));
test('twelve passive scenes retain regular exact-font geometry and semantic themes',()=>{
 assert.equal(scenes.length,12);assert.equal(readdirSync(new URL('../src/figures/encryption-proof-2026/',import.meta.url)).length,12);const ids=[];
 for(const s of scenes){assertEncryptionProofGeometry(s.svg);assert.doesNotMatch(s.svg,/<script|foreignObject|—|#[a-f0-9]{3,8}\b|(?:deux|2) horloges|two clocks|mérite mieux que|deserves better than/iu);for(const n of elements(s)){const a=attrs(n);if(a.id)ids.push(a.id);if(tag(n)==='text'){assert.equal(a['font-weight'],'400');assert.ok(Number(a['font-size'])*(s.mobile?280/420:501/1000)>=12);}if(tag(n)==='title')assert.doesNotMatch(content(n),/\bce (?:qui|que|qu[’'])|\bwhat\b|, pas |, not /iu);}}
 assert.equal(ids.length,new Set(ids).size);
});
test('AES estimate preserves respondent inputs, extrapolation and real accumulated units',()=>{
 for(const s of scenes.filter(s=>s.kind==='estimate')){
  assert.deepEqual(values(s,'input',['role','value']),[['direct','74'],['modelled','95']]);assert.deepEqual(values(s,'combined',['value']),[['169']]);assert.equal(74+95,169);
  assert.deepEqual(values(s,'benefit',['value','unit','period']),[['250.6','billion-USD-2017','1998-2017']]);
  assert.deepEqual(values(s,'calculation',['from','to']),[['inputs','combined'],['combined','sectors'],['sectors','benefit']]);
  assert.match(words(s),/1996–2017/);assert.match(words(s),/1998–2017/);assert.match(words(s),/169/);assert.match(words(s),s.lang==='fr'?/≥ 10 répondants/:/≥ 10 respondents/);assert.match(words(s),s.lang==='fr'?/7 % réel\/an/:/7% real\/year/);assert.match(words(s),s.lang==='fr'?/bénéfices bruts estimés/i:/estimated gross benefits/i);assert.match(words(s),s.lang==='fr'?/non quantifiable/:/cannot be quantified/);
 }
});
test('weighted concern comparison uses true 0–100 positions and the reviewed France/EU pairs',()=>{
 const reviewed=[['criminals',64,62],['foreign-government',49,49],['businesses',50,47],['intelligence',37,42],['national-government',41,42],['law-enforcement',33,37]];
 for(const s of scenes.filter(s=>s.kind==='trust')){
  assert.deepEqual(values(s,'axis',['min','max']),[['0','100']]);const marks=metric(s,'concern');assert.equal(marks.length,12);
  const x0=s.mobile?45:420,x1=s.mobile?285:800;
  for(const[i,[category,fr,eu]]of reviewed.entries())for(const[j,[series,value]]of [['fr',fr],['eu',eu]].entries()){
   const a=attrs(marks[i*2+j]);assert.equal(a['data-category'],category);assert.equal(a['data-series'],series);assert.equal(a['data-unit'],'percent');assert.equal(Number(a['data-value']),value);assert.ok(Math.abs(Number(a.cx)-(x0+(x1-x0)*value/100))<.00001);
   assert.equal(Number(a.cy),(s.mobile?267+i*100:260+i*65)+(series==='fr'?-6:6));
  }
  assert.match(words(s),/100 %/);assert.match(words(s),s.lang==='fr'?/26 453/:/26,453/);assert.match(words(s),s.lang==='fr'?/France incluse/:/France is part/);assert.match(words(s),s.lang==='fr'?/notes 5–7/:/scores 5–7/);assert.match(words(s),s.lang==='fr'?/non-utilisateurs/:/non-users/);
 }
});
test('review model contains observed feedback and three conditional options',()=>{
 for(const s of scenes.filter(s=>s.kind==='review')){
  assert.deepEqual(values(s,'stage',['role']).flat().sort(),['define','evaluate','decide','observe','review','correct','suspend','withdraw'].sort());
  assert.deepEqual(values(s,'route',['from','to']),[['define','evaluate'],['evaluate','decide'],['decide','observe'],['observe','review']]);assert.deepEqual(values(s,'option',['from','to']),[['review','correct'],['review','suspend'],['review','withdraw']]);assert.deepEqual(values(s,'feedback',['from','to']),[['review','define']]);assert.equal(attrs(metric(s,'feedback')[0])['stroke-dasharray'],'5 6');
  assert.match(words(s),s.lang==='fr'?/Proposition l0g/:/l0g proposal/);assert.match(words(s),s.lang==='fr'?/échecs · incidents · coûts/:/failures · incidents · costs/);assert.doesNotMatch(words(s),/\d+\s*%/u);
 }
});
test('integration keeps responsive licensed type and explicit analytical scope',()=>{
 const s=read('src/components/EncryptionProofFigure.astro');assertFontLicenseReferences(read('public/fonts/ukraine-reparations/LICENSE.txt'),'liberation');for(const k of ENCRYPTION_PROOF_KINDS)for(const l of['fr','en'])for(const m of['desktop','mobile'])assert.ok(s.includes(`../figures/encryption-proof-2026/${k}.${l}.${m}.svg?raw`));
 assert.deepEqual([...s.matchAll(/"number": "(\d+)"/gu)].map(m=>m[1]),['01','02','03']);assert.match(s,/Object\.prototype\.hasOwnProperty\.call\(captions, kind\)/);assert.match(s,/@container \(max-width: 500px\)/);assert.match(s,/max-width: 340px/);assert.match(s,/padding-bottom: 1rem/);assert.doesNotMatch(s,/overflow\s*:\s*hidden|Arial|Helvetica|font-weight:\s*700|—/);assert.match(s,/\/fonts\/ukraine-reparations\/liberation-sans-400\.ttf/);assert.match(s,/href=\{`#source-\$\{id\}`\}/);for(const id of['X19','X07','X04','X08','X12'])assert.ok(s.includes('"'+id+'"'));
 for(const phrase of['underlying benefits: 1998–2017','unquantifiable initial uncertainty','including non-users','neither a universal legal procedure already in force nor a validated technical architecture','no decryption obligation'])assert.ok(s.includes(phrase),phrase);
});
test('geometry rejects active input, false data, missing label regions and escaping coordinates',()=>{
 const svg=scenes[0].svg,variants=[svg.replace('</svg>','<script>alert(1)</script></svg>'),svg.replace('<svg ','<svg onload="x" '),svg.replace('<svg ','<svg href="https://example.invalid/" '),svg.replace('font-weight="400"','font-weight="700"'),svg.replace('data-panel="proof-estimate-fr-d-label1"','data-panel="missing"'),svg.replace('x="24" y="44"','x="990" y="44"'),svg.replace('data-value="74"','data-value="75"'),svg.replace('data-period="1998-2017"','data-period="1996-2017"'),svg.replace('data-unit="billion-USD-2017"','data-unit="annual-GDP"')];for(const s of variants)assert.throws(()=>assertEncryptionProofGeometry(s));
});
test('malformed path numerics fail within a bounded process',()=>{
 const script=`import{assertEncryptionProofGeometry,encryptionProofScenes}from'./scripts/encryption-proof-svg-assertions.mjs';const s=encryptionProofScenes()[0].svg.replace(/d="M[^\"]+"/u,'d="M'+'1'.repeat(8000)+' 1 L2 2"');try{assertEncryptionProofGeometry(s);process.exit(1)}catch{process.exit(0)}`;const child=spawnSync(process.execPath,['--input-type=module','-e',script],{cwd:new URL('../',import.meta.url),timeout:1500,encoding:'utf8'});assert.ifError(child.error);assert.equal(child.status,0,child.stderr);
});
