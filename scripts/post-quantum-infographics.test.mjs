import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync,readdirSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {POST_QUANTUM_KINDS,postQuantumScenes,inspectPostQuantumSvg,assertPostQuantumGeometry,postQuantumGeometryIssues,tag,attrs,content} from './post-quantum-svg-assertions.mjs';
import {assertFontLicenseReferences} from './font-license-assertions.mjs';
const scenes=postQuantumScenes(),read=file=>readFileSync(new URL('../'+file,import.meta.url),'utf8');
const nodes=s=>inspectPostQuantumSvg(s.svg).all,text=s=>nodes(s).filter(n=>['text','title','desc'].includes(tag(n))).map(content).join(' '),metric=(s,name)=>nodes(s).filter(n=>attrs(n)['data-metric']===name);

test('16 passive accessible scenes use exact regular-font geometry, safe local styling and compact desktop proportions',()=>{
 assert.equal(scenes.length,16);assert.equal(readdirSync(new URL('../src/figures/post-quantique-2026/',import.meta.url)).length,16);const ids=[];
 for(const s of scenes){assertPostQuantumGeometry(s.svg);assert.doesNotMatch(s.svg,/<script|foreignObject|—|#[a-f0-9]{3,8}\b|(?:deux|2) horloges|two clocks|mérite mieux que|deserves better than/iu);
  for(const n of nodes(s)){const a=attrs(n);if(a.id)ids.push(a.id);if(tag(n)==='text'){assert.equal(a['font-weight'],'400');assert.ok(Number(a['font-size'])*(s.mobile?280/420:501/1000)>=12)}if(tag(n)==='title')assert.doesNotMatch(content(n),/\bce (?:qui|que|qu[’'])|\bwhat\b|, pas |, not /iu);}}
 assert.equal(ids.length,new Set(ids).size);
});

test('GAO matrix preserves three independent assessments of the same 24 agencies, not a current protection rate',()=>{
 for(const s of scenes.filter(s=>s.kind==='audit')){
  const dots=metric(s,'gao-agency');assert.equal(dots.length,72);
  for(const[practice,expected]of [[0,[1,21,1,1]],[1,[0,21,0,3]],[2,[0,1,0,23]]]){const row=dots.filter(n=>Number(attrs(n)['data-practice'])===practice);assert.equal(row.length,24);assert.deepEqual([0,1,2,3].map(status=>row.filter(n=>Number(attrs(n)['data-status'])===status).length),expected)}
  assert.match(text(s),/2024–2025/);assert.match(text(s),s.lang==='fr'?/Mêmes agences/:/same agencies/);
 }
});

test('the KEM public key flows from the recipient to the sender and encapsulation flows back, with a separate signature circuit',()=>{
 for(const s of scenes.filter(s=>s.kind==='mechanism')){
  const words=text(s);for(const term of s.lang==='fr'?['Émetteur','Destinataire','Clé publique','Message','Secret K','Clé privée','signature']:['Sender','Recipient','public key','Message','secret K','Private key','signature'])assert.ok(words.toLowerCase().includes(term.toLowerCase()),term);
  assert.ok(s.svg.includes(s.mobile?'M331 214 L331 200 L89 200 L89 214':'M800 230 L800 201 L200 201 L200 230'));
  assert.ok(s.svg.includes(s.mobile?'M131 253 L286 253':'M240 278 L760 278'));
  assert.deepEqual([...new Set(nodes(s).map(n=>attrs(n)['data-icon']).filter(Boolean))].sort(),['key','laptop','lock','package','server','shield']);
 }
});

test('recorded-copy scenario uses one proportional time scale and preserves its hypothetical status',()=>{
 for(const s of scenes.filter(s=>s.kind==='retention')){
  const whole=metric(s,'confidentiality'),old=metric(s,'original-protection'),updated=metric(s,'migrated-protection'),copy=metric(s,'retained-copy');for(const xs of [whole,old,updated,copy])assert.equal(xs.length,1);
  const dimension=s.mobile?'height':'width',span=Number(attrs(whole[0])[dimension]);assert.ok(Math.abs(Number(attrs(old[0])[dimension])/span-4/15)<1e-10);assert.ok(Math.abs(Number(attrs(updated[0])[dimension])/span-11/15)<1e-10);
  assert.equal(attrs(copy[0])['data-from'],'2026');assert.equal(attrs(copy[0])['data-to'],'2041');
  const words=text(s);for(const year of[2026,2030,2038,2041])assert.ok(words.includes(String(year)));assert.match(words,s.lang==='fr'?/HYPOTHÉTIQUE/:/HYPOTHETICAL/);
 }
});

test('normative object-size charts retain source values, zero origins, distinct scales and a 32-byte shared secret',()=>{
 const rows={'kem-public-key':[800,1184,1568],'kem-ciphertext':[768,1088,1568],'dsa-public-key':[1312,1952,2592],'dsa-signature':[2420,3309,4627]};
 for(const s of scenes.filter(s=>s.kind==='bytes')){
  for(const[name,expected]of Object.entries(rows)){const bars=metric(s,name);assert.deepEqual(bars.map(n=>Number(attrs(n)['data-value'])),expected);const scale=name.startsWith('kem')?1600:5000;const width=s.mobile?190:210;for(const[n,i]of bars.map((n,i)=>[n,i])){assert.equal(Number(attrs(n)['data-scale']),scale);assert.ok(Math.abs(Number(attrs(n).width)/width-expected[i]/scale)<1e-10)}}
  assert.deepEqual(metric(s,'kem-shared-secret').map(n=>Number(attrs(n)['data-value'])),[32]);assert.match(text(s),/0–1 600/);assert.match(text(s),/0–5 000/);assert.match(text(s),/FIPS|NIST/);
 }
});

test('controlled component uses the existing licensed font with native glyph coverage and supplies source scopes',()=>{
 const c=read('src/components/PostQuantumFigure.astro');assertFontLicenseReferences(read('public/fonts/predictstreet/LICENSE.txt'),'liberation');
 for(const k of POST_QUANTUM_KINDS)for(const l of['fr','en'])for(const m of['desktop','mobile'])assert.ok(c.includes(`../figures/post-quantique-2026/${k}.${l}.${m}.svg?raw`));
 assert.match(c,/Object\.prototype\.hasOwnProperty\.call\(captions, kind\)/);assert.match(c,/@container \(max-width: 500px\)/);assert.match(c,/max-width: 340px/);assert.match(c,/padding-bottom: 1rem/);assert.doesNotMatch(c,/overflow\s*:\s*hidden|Arial|Helvetica|font-weight:\s*700/);assert.match(c,/\/fonts\/predictstreet\/liberation-sans-400\.ttf/);assert.match(c,/href=\{`#source-\$\{id\}`\}/);
 for(const phrase of['hors systèmes de sécurité nationale','2024 to September 2025','cryptographically relevant quantum computer','different security levels','complete TLS connection','1600 ou 5000 octets'])assert.ok(c.includes(phrase),phrase);
});

test('geometry guards reject internal text crossing, missing intended regions, font-weight drift and active markup',()=>{
 const s=scenes[0].svg;
 for(const altered of[s.replace('</svg>','<script>alert(1)</script></svg>'),s.replace('<svg ','<svg onload="x" '),s.replace('<svg ','<svg href="https://example.invalid/" '),s.replace('font-weight="400"','font-weight="700"'),s.replace('data-panel="pqc-audit-fr-d-header"','data-panel="missing"'),s.replace('x="32" y="96"','x="990" y="96"'),s.replace('data-metric="gao-agency"','data-metric="unknown"')])assert.throws(()=>assertPostQuantumGeometry(altered));
 assert.equal(postQuantumGeometryIssues(s).length,0);
});

test('path parsing fails closed on a long malformed numeric token within a bounded process',()=>{
 const script=`import{assertPostQuantumGeometry,postQuantumScenes}from'./scripts/post-quantum-svg-assertions.mjs';const s=postQuantumScenes()[0].svg.replace(/d="M[^\"]+"/u,'d="M'+ '1'.repeat(8000)+' 1 L2 2"');try{assertPostQuantumGeometry(s);process.exit(1)}catch{process.exit(0)}`;
 const child=spawnSync(process.execPath,['--input-type=module','-e',script],{cwd:new URL('../',import.meta.url),timeout:1500,encoding:'utf8'});assert.ifError(child.error);assert.equal(child.status,0,child.stderr);
});
