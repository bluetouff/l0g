import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync,readdirSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {GOOGLE_OZANS_KINDS,googleOzansScenes,inspectGoogleOzansSvg,assertGoogleOzansGeometry,tag,attrs,content} from './google-ozans-svg-assertions.mjs';
import {assertFontLicenseReferences} from './font-license-assertions.mjs';
const scenes=googleOzansScenes(),read=file=>readFileSync(new URL('../'+file,import.meta.url),'utf8');
const all=s=>inspectGoogleOzansSvg(s.svg).all,metric=(s,name)=>all(s).filter(n=>attrs(n)['data-metric']===name),words=s=>all(s).filter(n=>['text','title','desc'].includes(tag(n))).map(content).join(' ');

test('twelve passive scenes retain exact-font geometry, regular weights, semantic colours and compact proportions',()=>{
 assert.equal(scenes.length,12);assert.equal(readdirSync(new URL('../src/figures/google-ozans-2026/',import.meta.url)).length,12);const ids=[];
 for(const s of scenes){assertGoogleOzansGeometry(s.svg);assert.doesNotMatch(s.svg,/<script|foreignObject|—|#[a-f0-9]{3,8}\b|(?:deux|2) horloges|two clocks|mérite mieux que|deserves better than/iu);
  for(const n of all(s)){const a=attrs(n);if(a.id)ids.push(a.id);if(tag(n)==='text'){assert.equal(a['font-weight'],'400');assert.ok(Number(a['font-size'])*(s.mobile?280/420:501/1000)>=12)}if(tag(n)==='title')assert.doesNotMatch(content(n),/\bce (?:qui|que|qu[’'])|\bwhat\b|, pas |, not /iu);}
 }assert.equal(ids.length,new Set(ids).size);
});

test('capacity bars add the continuing120MW branch to300MW or1200MW on a common proportional scale',()=>{
 for(const s of scenes.filter(s=>s.kind==='capacity')){
  const totals=metric(s,'stage-total');assert.deepEqual(totals.map(n=>Number(attrs(n)['data-value'])),[120,420,1320]);
  for(let stage=0;stage<3;stage++){
   const bars=metric(s,'connection-capacity').filter(n=>Number(attrs(n)['data-stage'])===stage);assert.deepEqual(bars.map(n=>Number(attrs(n)['data-value'])),[[120],[120,300],[120,1200]][stage]);
   assert.equal(bars.reduce((sum,n)=>sum+Number(attrs(n)['data-value']),0),Number(attrs(totals[stage])['data-value']));
   for(const n of bars)assert.ok(Math.abs(Number(attrs(n).width)/(s.mobile?370:520)-Number(attrs(n)['data-value'])/1320)<1e-12);
   assert.deepEqual(bars.map(n=>Number(attrs(n)['data-kv'])),stage===0?[225]:[225,400]);
  }
  assert.match(words(s),/2030/);assert.match(words(s),/2031/);assert.match(words(s),/2032/);assert.match(words(s),/Éguzon–Marmagne/);assert.match(words(s),s.lang==='fr'?/au plus tôt/:/at the earliest/);assert.match(words(s),s.lang==='fr'?/maximale/:/Maximum|Maximum/i);
 }
});

test('financing separates the eligible70/30 cost category from two fully Google-funded categories',()=>{
 for(const s of scenes.filter(s=>s.kind==='financing')){
  const shares=metric(s,'funding-share'),eligible=shares.filter(n=>attrs(n)['data-category']==='eligible');assert.deepEqual(eligible.map(n=>[attrs(n)['data-payer'],Number(attrs(n)['data-value'])]),[['google',70],['rte',30]]);
  const full=eligible.reduce((sum,n)=>sum+Number(attrs(n).width),0);for(const n of eligible)assert.ok(Math.abs(Number(attrs(n).width)/full-Number(attrs(n)['data-value'])/100)<1e-12);
  for(const category of ['backup','private']){const n=shares.filter(n=>attrs(n)['data-category']===category);assert.equal(n.length,1);assert.equal(attrs(n[0])['data-payer'],'google');assert.equal(attrs(n[0])['data-value'],'100');}
  assert.match(words(s),s.lang==='fr'?/tarifs du réseau/:/network tariffs/);assert.match(words(s),s.lang==='fr'?/insuffisante|ne permet pas de chiffrer/:/unquantified|insufficient/);assert.doesNotMatch(words(s),/37[,.]5\s*(?:M|million)/u);
 }
});

test('closed-loop cooling preserves opposite water flows, heat export and distinct stock and daily sanitary units',()=>{
 for(const s of scenes.filter(s=>s.kind==='cooling')){
  assert.deepEqual(metric(s,'water-flow').map(n=>[attrs(n)['data-from'],attrs(n)['data-to']]),[['exchanger','cooler'],['cooler','exchanger']]);
  const heat=metric(s,'heat-flow').map(n=>[attrs(n)['data-from'],attrs(n)['data-to']]);assert.ok(heat.some(([a,b])=>a==='servers'&&b==='exchanger'));assert.ok(heat.some(([a,b])=>a==='cooler'&&b==='air'));
  const fill=metric(s,'initial-fill');assert.equal(fill.length,1);assert.equal(attrs(fill[0])['data-value'],'1000');assert.equal(attrs(fill[0])['data-unit'],'m3');
  for(const name of ['sanitary-input','sanitary-discharge']){const n=metric(s,name);assert.equal(n.length,1);assert.equal(attrs(n[0])['data-value'],'10.4');assert.equal(attrs(n[0])['data-unit'],'m3/day');}
  assert.match(words(s),s.lang==='fr'?/Appoints|appoints/:/top-ups/);assert.match(words(s),s.lang==='fr'?/quantifiés/:/unquantified/);assert.match(words(s),s.lang==='fr'?/bâtiment/:/building/);
 }
});

test('component uses a complete controlled bilingual family, canonical existing font licence and adjacent source scopes',()=>{
 const c=read('src/components/GoogleOzansFigure.astro');assertFontLicenseReferences(read('public/fonts/ukraine-reparations/LICENSE.txt'),'liberation');
 for(const k of GOOGLE_OZANS_KINDS)for(const l of ['fr','en'])for(const m of ['desktop','mobile'])assert.ok(c.includes(`../figures/google-ozans-2026/${k}.${l}.${m}.svg?raw`));
 assert.match(c,/Object\.prototype\.hasOwnProperty\.call\(captions, kind\)/);assert.match(c,/@container \(max-width: 500px\)/);assert.match(c,/max-width: 340px/);assert.match(c,/padding-bottom: 1rem/);assert.doesNotMatch(c,/overflow\s*:\s*hidden|Arial|Helvetica|font-weight:\s*700/);assert.match(c,/\/fonts\/ukraine-reparations\/liberation-sans-400\.ttf/);assert.match(c,/href=\{`#source-\$\{id\}`\}/);
});

test('geometry guards reject active nodes, wrong font weight, unknown metric, missing label region and frame escape',()=>{
 const svg=scenes[0].svg;
 for(const altered of [svg.replace('</svg>','<script>alert(1)</script></svg>'),svg.replace('<svg ','<svg onload="x" '),svg.replace('<svg ','<svg href="https://example.invalid/" '),svg.replace('font-weight="400"','font-weight="700"'),svg.replace('data-panel="ozans-capacity-fr-d-header"','data-panel="missing"'),svg.replace('x="24" y="94"','x="990" y="94"'),svg.replace('data-metric="connection-capacity"','data-metric="unknown"')])assert.throws(()=>assertGoogleOzansGeometry(altered));
});

test('path parsing consumes long malformed numerical input within a bounded process',()=>{
 const script=`import{assertGoogleOzansGeometry,googleOzansScenes}from'./scripts/google-ozans-svg-assertions.mjs';const s=googleOzansScenes()[0].svg.replace(/d="M[^\"]+"/u,'d="M'+ '1'.repeat(8000)+' 1 L2 2"');try{assertGoogleOzansGeometry(s);process.exit(1)}catch{process.exit(0)}`;
 const child=spawnSync(process.execPath,['--input-type=module','-e',script],{cwd:new URL('../',import.meta.url),timeout:1500,encoding:'utf8'});assert.ifError(child.error);assert.equal(child.status,0,child.stderr);
});
