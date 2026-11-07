import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync,readdirSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {ENCRYPTION_CONTROL_KINDS,encryptionControlScenes,inspectEncryptionControlSvg,assertEncryptionControlGeometry,tag,attrs,content} from './encryption-control-svg-assertions.mjs';
import {pathPoints} from './insurance-returns-svg-assertions.mjs';
import {assertFontLicenseReferences} from './font-license-assertions.mjs';
const scenes=encryptionControlScenes(),read=f=>readFileSync(new URL('../'+f,import.meta.url),'utf8');
const elements=s=>inspectEncryptionControlSvg(s.svg).all,metric=(s,v)=>elements(s).filter(n=>attrs(n)['data-metric']===v),words=s=>elements(s).filter(n=>['text','title','desc'].includes(tag(n))).map(content).join(' ');

test('twelve passive scenes preserve exact-font geometry, regular typography and semantic theme colours',()=>{
 assert.equal(scenes.length,12);assert.equal(readdirSync(new URL('../src/figures/encryption-control-2026/',import.meta.url)).length,12);const ids=[];
 for(const s of scenes){assertEncryptionControlGeometry(s.svg);assert.doesNotMatch(s.svg,/<script|foreignObject|—|#[a-f0-9]{3,8}\b|(?:deux|2) horloges|two clocks|mérite mieux que|deserves better than/iu);for(const n of elements(s)){const a=attrs(n);if(a.id)ids.push(a.id);if(tag(n)==='text'){assert.equal(a['font-weight'],'400');assert.ok(Number(a['font-size'])*(s.mobile?280/420:501/1000)>=12);}if(tag(n)==='title')assert.doesNotMatch(content(n),/\bce (?:qui|que|qu[’'])|\bwhat\b|, pas |, not /iu);}}
 assert.equal(ids.length,new Set(ids).size);
});

test('wiretap bars share a zero origin and scale, preserving exact reported values and arithmetic remainders',()=>{
 for(const s of scenes.filter(s=>s.kind==='wiretaps')){
  const actual=metric(s,'reported-failure'),other=metric(s,'other-encrypted');assert.equal(actual.length,2);assert.equal(other.length,2);
  for(const[i,[group,n,remainder,total]]of [['federal',269,27,296],['state',217,12,229]].entries()){
   const a=attrs(actual[i]),b=attrs(other[i]),scale=(s.mobile?340:800)/300,start=s.mobile?40:100;
   assert.equal(a['data-group'],group);assert.equal(b['data-group'],group);assert.equal(a['data-unit'],'wiretaps');assert.equal(b['data-unit'],'wiretaps');assert.equal(Number(a['data-value']),n);assert.equal(Number(b['data-value']),remainder);assert.equal(n+remainder,total);assert.equal(Number(a.x),start);assert.equal(a.y,b.y);assert.ok(Math.abs(Number(a.width)/n-scale)<1e-7);assert.ok(Math.abs(Number(b.width)/remainder-scale)<1e-7);assert.ok(Math.abs(Number(b.x)-Number(a.x)-Number(a.width))<1e-6);assert.equal(a.fill,'var(--color-accent)');assert.equal(b.fill,'var(--color-muted)');
  }
  assert.doesNotMatch(words(s),/\d+[,.]?\d*\s*%/u);assert.match(words(s),s.lang==='fr'?/soustraction|arithmétique/:/subtraction|arithmetic/);assert.match(words(s),/2025/);assert.match(words(s),s.lang==='fr'?/interception déclarée/:/reported wiretap/);
 }
});

test('instruction activates collection while data delivery and oversight have separate explicit routes',()=>{
 for(const s of scenes.filter(s=>s.kind==='control')){
  const routes=(m)=>metric(s,m).map(n=>[attrs(n)['data-from'],attrs(n)['data-to']]);
  assert.deepEqual(routes('command'),[['authority','check'],['check','activation']]);assert.deepEqual(routes('activation'),[['activation','collection']]);assert.deepEqual(routes('data'),[['collection','preparation'],['preparation','recipient']]);assert.deepEqual(routes('trace'),[['check','review'],['preparation','review'],['recipient','review']]);
  for(const n of metric(s,'trace'))assert.equal(attrs(n)['stroke-dasharray'],'4 6');
  const end=pathPoints(attrs(metric(s,'activation')[0]).d).at(-1),sensor=s.mobile?[60,420,18*.7]:[85,400,18];assert.equal(end[0],sensor[0]);assert.ok(end[1]<sensor[1]-sensor[2]&&sensor[1]-sensor[2]-end[1]<10,'Activation reaches collection icon');
  assert.match(words(s),s.lang==='fr'?/pouvoirs selon le droit/:/powers depend on law/);
 }
});

test('three distinct qualitative lifetimes encode no duration or measured proportion',()=>{
 for(const s of scenes.filter(s=>s.kind==='lifetimes')){const timelines=metric(s,'lifetime');assert.deepEqual(timelines.map(n=>attrs(n)['data-mode']),['capability','authorisation','copies']);assert.ok(timelines.every(n=>attrs(n)['data-value']===undefined));assert.match(words(s),s.lang==='fr'?/qualitatif.*sans échelle de temps/:/Qualitative.*no time scale/i);assert.match(words(s),s.lang==='fr'?/durées non mesurées/:/unmeasured durations/);assert.match(words(s),s.lang==='fr'?/production s’arrête|production/:/Production ends/);assert.doesNotMatch(words(s),/\b(?:jours|days|hours|heures|years|années)\b/iu);}
});

test('controlled integration uses sequential anchors, exact source families and a licensed responsive font',()=>{
 const s=read('src/components/EncryptionControlFigure.astro');assertFontLicenseReferences(read('public/fonts/ukraine-reparations/LICENSE.txt'),'liberation');
 for(const kind of ENCRYPTION_CONTROL_KINDS)for(const lang of['fr','en'])for(const mode of['desktop','mobile'])assert.ok(s.includes(`../figures/encryption-control-2026/${kind}.${lang}.${mode}.svg?raw`));
 assert.deepEqual([...s.matchAll(/"number": "(\d+)"/gu)].map(m=>m[1]),['01','02','03']);assert.match(s,/Object\.prototype\.hasOwnProperty\.call\(captions, kind\)/);assert.match(s,/@container \(max-width: 500px\)/);assert.match(s,/max-width: 340px/);assert.match(s,/padding-bottom: 1rem/);assert.doesNotMatch(s,/overflow\s*:\s*hidden|Arial|Helvetica|font-weight:\s*700/);assert.match(s,/\/fonts\/ukraine-reparations\/liberation-sans-400\.ttf/);assert.match(s,/href=\{`#source-\$\{id\}`\}/);for(const id of['R01','R02','R25','R04','R20','R23'])assert.ok(s.includes('"'+id+'"'));
 assert.match(s,/249.*80/);assert.match(s,/FISA/);assert.match(s,/imputations/);assert.match(s,/without a time scale/);
});

test('geometry rejects executable markup, unknown data, missing label regions and frame escape',()=>{
 const svg=scenes[0].svg,variants=[svg.replace('</svg>','<script>alert(1)</script></svg>'),svg.replace('<svg ','<svg onload="x" '),svg.replace('<svg ','<svg href="https://example.invalid/" '),svg.replace('font-weight="400"','font-weight="700"'),svg.replace('data-panel="control-wiretaps-fr-d-label1"','data-panel="missing"'),svg.replace('x="24" y="44"','x="990" y="44"'),svg.replace('data-metric="reported-failure"','data-metric="unknown"'),svg.replace('data-group="federal"','data-group="invented"'),svg.replace('data-unit="wiretaps"','data-unit="people"')];for(const altered of variants)assert.throws(()=>assertEncryptionControlGeometry(altered));
});

test('long malformed path input fails within a bounded process',()=>{
 const script=`import{assertEncryptionControlGeometry,encryptionControlScenes}from'./scripts/encryption-control-svg-assertions.mjs';const s=encryptionControlScenes()[0].svg.replace(/d="M[^\"]+"/u,'d="M'+'1'.repeat(8000)+' 1 L2 2"');try{assertEncryptionControlGeometry(s);process.exit(1)}catch{process.exit(0)}`;const child=spawnSync(process.execPath,['--input-type=module','-e',script],{cwd:new URL('../',import.meta.url),timeout:1500,encoding:'utf8'});assert.ifError(child.error);assert.equal(child.status,0,child.stderr);
});
