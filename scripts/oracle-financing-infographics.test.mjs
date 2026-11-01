import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import test from 'node:test';
import { ORACLE_FIGURE_IDS, ORACLE_FIGURE_SOURCES, oracleFigureMeta } from '../src/lib/oracle-financing-figures.mjs';
import { oracleFinancingScenes, inspectOracleFinancingSvg, assertOracleFinancingGeometry, tag, attrs, content, labelBox } from './oracle-financing-svg-assertions.mjs';
import { assertFontLicenseReferences } from './font-license-assertions.mjs';
const scenes=oracleFinancingScenes();
const nodes=s=>inspectOracleFinancingSvg(s.svg).all;
const metric=(s,key)=>nodes(s).filter(n=>attrs(n)['data-metric']===key);
const value=n=>Number(attrs(n)['data-value']);
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const text=s=>nodes(s).map(content).join(' ');

test('20 passive native scenes use theme tokens and retain compact panels with loaded-font geometry',()=>{
  assert.equal(scenes.length,20);
  assert.equal(readdirSync(new URL('../src/figures/oracle-financing/',import.meta.url)).length,20);
  const ids=[];
  for(const s of scenes){
    assertOracleFinancingGeometry(s.svg);
    assert.doesNotMatch(s.svg,/<script|foreignObject|—|horloges|two clocks|#[a-f\d]{3,8}\b/iu);
    for(const n of nodes(s)){
      if(attrs(n).id)ids.push(attrs(n).id);
      if(tag(n)==='text'){
        assert.ok(Number(attrs(n)['font-size'])*(s.mobile?280/420:501/1000)>=12,'Readable at narrow article widths');
        assert.ok(labelBox(n).advance>0);
      }
      if(tag(n)==='title')assert.doesNotMatch(content(n),/\bce (?:que|qui|qu[’'])|\bwhat\b|, pas |, not /iu);
    }
  }
  assert.equal(ids.length,new Set(ids).size);
});

test('revenue bars retain reported and projected scopes and one common zero-based scale',()=>{
  assert.equal(((225/67.357)**(1/4)-1).toFixed(3),'0.352');
  for(const s of scenes.filter(s=>s.kind==='01')){
    const bars=metric(s,'revenue-usdbn');assert.deepEqual(bars.map(value),[67.357,90,225]);
    const scale=Number(attrs(bars[0]).width)/67.357;
    for(const b of bars)assert.ok(Math.abs(Number(attrs(b).width)/value(b)-scale)<1e-6);
    const t=text(s);for(const y of['FY2026','FY2027','FY2030','FY2027–28','H2 FY2028','FY2029'])assert.ok(t.includes(y));
    assert.match(t,s.lang==='fr'?/réalisé/:/reported/);assert.match(t,/minimum/);
  }
});

test('three resource flows preserve future obligations without invented proportional weights',()=>{
  for(const s of scenes.filter(s=>s.kind==='02')){
    const all=nodes(s),t=text(s);
    assert.equal(all.filter(n=>tag(n)==='rect'&&attrs(n).id?.includes('-card-flow-')).length,3);
    assert.equal(all.filter(n=>tag(n)==='path'&&/^flow-\d$/u.test(attrs(n)['data-connector']??'')).length,3);
    assert.equal(all.filter(n=>attrs(n)['data-metric']).length,0);
    assert.match(t,s.lang==='fr'?/Avance client/:/Customer advance/);
    assert.match(t,s.lang==='fr'?/Crédit fournisseur/:/Vendor financing/);
    assert.match(t,s.lang==='fr'?/Matériel du client/:/Customer hardware/);
    assert.match(t,s.lang==='fr'?/refinancements exclus/:/refinancing excluded/);
    assert.match(oracleFigureMeta(s.lang,s.kind).method,/20/);
  }
});

test('cash-flow components and capital expenditure share one scale, with advances counted once',()=>{
  assert.equal((11.740+11.363).toFixed(3),'23.103');
  assert.equal((23.103-28.499).toFixed(3),'-5.396');
  assert.equal((11.363/23.103*100).toFixed(1),'49.2');
  for(const s of scenes.filter(s=>s.kind==='03')){
    const bars=['operating-other-usdbn','customer-advances-usdbn','capex-usdbn'].map(k=>metric(s,k)[0]);
    assert.deepEqual(bars.map(value),[11.740,11.363,28.499]);
    const scale=Number(attrs(bars[0]).width)/11.740;
    for(const b of bars)assert.ok(Math.abs(Number(attrs(b).width)/value(b)-scale)<1e-6);
    assert.ok(Math.abs(Number(attrs(bars[0]).x)+Number(attrs(bars[0]).width)-Number(attrs(bars[1]).x))<1e-6);
    assert.ok(text(s).includes(s.lang==='fr'?'−5,396':'−$5.396'));
    assert.match(oracleFigureMeta(s.lang,s.kind).method,s.lang==='fr'?/autres flux constants/:/other flows fixed/);
  }
});

test('manufacturer financing reconciliation preserves reported FCF and excludes total cash change',()=>{
  const netOutlay=28.499+0.830-11.363;
  const a=23.103-28.499-0.830,b=23.103-11.363-netOutlay;
  assert.equal(netOutlay.toFixed(3),'17.966');assert.equal(a.toFixed(3),'-6.226');assert.equal(a.toFixed(3),b.toFixed(3));
  assert.equal(((23.103-netOutlay)-a).toFixed(3),'11.363');
  for(const s of scenes.filter(s=>s.kind==='04')){
    const t=text(s);for(const n of s.lang==='fr'?['23,103','28,499','0,830','11,740','17,966','−6,226']:['23.103','28.499','0.830','11.740','17.966','−$6.226'])assert.ok(t.includes(n));
    assert.match(oracleFigureMeta(s.lang,s.kind).method,s.lang==='fr'?/autres financements/:/Other financing/);
  }
});

test('RPO bars represent approximate stock shares across unequal windows, distinct from future leases',()=>{
  for(const s of scenes.filter(s=>s.kind==='05')){
    const bars=metric(s,'rpo-share-pct');assert.deepEqual(bars.map(value),[13,37,34,16]);assert.equal(bars.reduce((v,b)=>v+value(b),0),100);
    const scale=Number(attrs(bars[0]).width)/13;for(const b of bars)assert.ok(Math.abs(Number(attrs(b).width)/value(b)-scale)<1e-6);
    const t=text(s);for(const n of ['664','288','15','19','Q2 FY2027','FY2029'])assert.ok(t.includes(n));
    assert.match(oracleFigureMeta(s.lang,s.kind).method,s.lang==='fr'?/durées inégales/:/unequal lengths/);
    assert.match(oracleFigureMeta(s.lang,s.kind).method,s.lang==='fr'?/approximatifs/:/approximate/);
  }
});

test('strict source parsing rejects injection, malformed paths, font substitutions and internal panel overflow',()=>{
  const raw=scenes[0].svg;
  const edits=[
    s=>s.replace('</svg>','<script>x</script></svg>'),
    s=>s.replace('<svg ','<svg onload="x" '),
    s=>s.replace('</svg>','<image href="https://example.com/a"/></svg>'),
    s=>s.replace('l0g Oracle','Arial'),
    s=>s.replace(/data-panel="[^"]+"/u,'data-panel="absent"'),
    s=>s.replaceAll('Une croissance à financer','Un titre extrêmement long dont le texte dépasse le cadre interne du graphique'),
    s=>s.replace('x="40" y="85"','x="990" y="85"')
  ];
  for(const fn of edits){const changed=fn(raw);assert.notEqual(changed,raw);assert.throws(()=>assertOracleFinancingGeometry(changed));}
  const flow=scenes.find(s=>s.kind==='02').svg;
  assert.throws(()=>assertOracleFinancingGeometry(flow.replace(/d="M/u,'d="M'+'9'.repeat(200))));
  for(const l of[null,{},new String('fr'),'__proto__'])assert.throws(()=>oracleFigureMeta(l,'01'));
  for(const id of['../01','01" onload="x','06',{},null])assert.throws(()=>oracleFigureMeta('fr',id));
});

test('component retains licensed local fonts, controlled raw imports, numeric citation targets and readable responsive limits',()=>{
  const c=read('src/components/OracleFigure.astro');
  for(const weight of[400,700]){
    const p='public/fonts/stablecoins/dejavu-sans-'+weight+'.ttf';assert.ok(c.includes(p.replace('public','')));
    assert.equal(createHash('sha256').update(readFileSync(new URL('../'+p,import.meta.url))).digest('hex'),weight===400?'98f2d74db16bb5f41f74adf6d899aeec92861682cccc58bfdbe4d9d7d0a5ae11':'21a0350a4ac2a9f22b6a7a8dcaf6abb08c8b546d06499301f1fcf10996fd0df5');
  }
  assertFontLicenseReferences(read('public/fonts/stablecoins/LICENSE.txt'),'dejavu');
  assert.match(c,/@container\s*\(max-width:\s*500px\)/u);assert.match(c,/padding-bottom:\s*1rem/u);assert.match(c,/max-width:\s*310px/u);
  assert.ok(1080*310/420<800);assert.match(c,/import\.meta\.glob/);assert.match(c,/#source-\$\{ref\}/u);
  assert.doesNotMatch(c,/overflow\s*:\s*(?:hidden|clip)|client:|<script|fetch\(|foreignObject/iu);
  for(const lang of['fr','en'])for(const[i,id]of ORACLE_FIGURE_IDS.entries())assert.deepEqual(oracleFigureMeta(lang,id).sources,ORACLE_FIGURE_SOURCES[i]);
});
