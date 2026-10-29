import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import test from 'node:test';
import { TEMPO_RED_DAYS_KINDS, TEMPO_RED_DAYS_SOURCES, tempoRedDaysFigureReferences } from '../src/lib/tempoRedDaysFigures.mjs';
import { tempoRedDaysScenes, inspectTempoRedDaysSvg, assertTempoRedDaysGeometry, tag, attrs, content } from './tempo-red-days-svg-assertions.mjs';
import { assertFontLicenseReferences } from './font-license-assertions.mjs';
import { pathPoints } from './insurance-returns-svg-assertions.mjs';
const read = p => readFileSync(new URL('../' + p, import.meta.url), 'utf8');
const close = (a,b) => assert.ok(Math.abs(Number(a)-b)<.000002, `${a} != ${b}`);
const sceneNodes = scene => inspectTempoRedDaysSvg(scene.svg).all;
const labels = scene => sceneNodes(scene).filter(n=>tag(n)==='text').map(content).join(' ');
const bars = scene => sceneNodes(scene).filter(n=>tag(n)==='rect'&&!attrs(n).id);

test('28 passive scenes preserve responsive internal geometry, glyphs and l0g semantic theme colors', () => {
  const scenes = tempoRedDaysScenes();
  assert.equal(scenes.length,28);
  assert.equal(readdirSync(new URL('../src/figures/tempo-red-days/',import.meta.url)).length,28);
  for(const s of scenes){
    assertTempoRedDaysGeometry(s.svg);
    assert.doesNotMatch(s.svg,/—|<defs|<pattern|<g\b|transform=|#[0-9a-f]{3,8}\b|foreignObject|horlog|clock/iu);
    const nodes=sceneNodes(s);
    assert.equal(attrs(nodes.find(n=>tag(n)==='rect')).fill,'var(--color-ink)');
    for(const text of nodes.filter(n=>tag(n)==='text'))assert.notEqual(attrs(text).fill,'var(--color-ink)');
    assert.doesNotMatch(content(nodes.find(n=>tag(n)==='title')),/\bce (?:que|qui|qu[’'])|\bwhat\b/iu);
    for(const n of nodes.filter(n=>tag(n)==='text'))assert.ok(Number(attrs(n)['font-size'])*(s.mobile?280/420:501/1000)>=11);
  }
});
test('old selection flow retains forecast and stock routes, eligibility, decrement and thirteen of22 red-day units',()=>{
  for(const s of tempoRedDaysScenes().filter(s=>s.kind==='selection')){
    const nodes=sceneNodes(s),box=bars(s),text=labels(s);
    assert.equal(box.length,22);
    assert.equal(box.filter(n=>attrs(n).fill==='var(--color-accent)').length,13);
    assert.equal(box.filter(n=>attrs(n).fill==='var(--color-surface-2)').length,9);
    assert.match(text,/13 \/ 22/);assert.match(text,/S − 1/);
    assert.match(text,s.lang==='fr'?/Seuil franchi OU apurement/:/Threshold.*OR.*clearing/);
    assert.match(text,s.lang==='fr'?/Jour éligible/:/Eligible day/);
    assert.ok(nodes.filter(n=>tag(n)==='path'||tag(n)==='line').length>=4);
  }
});
test('fictional24h step profiles preserve every coordinate and reverse mean-versus-peak ranking',()=>{
  for(const s of tempoRedDaysScenes().filter(s=>s.kind==='profiles')){
    const m=s.mobile,x0=m?55:100,x1=m?386:940,y0=m?420:415,y1=m?220:195;
    const fx=x=>x0+(x1-x0)*x/24,fy=y=>y0-(y0-y1)*y/100;
    const expected=[[[0,70],[12,70],[12,50],[24,50]],[[0,45],[18,45],[18,85],[19,85],[19,45],[24,45]]];
    sceneNodes(s).filter(n=>tag(n)==='path').forEach((n,i)=>{const actual=pathPoints(attrs(n).d);assert.equal(actual.length,expected[i].length);actual.forEach(([x,y],j)=>{close(x,fx(expected[i][j][0]));close(y,fy(expected[i][j][1]));});});
    assert.match(labels(s),/A\s*:\s*60\s*>\s*B\s*:\s*46[.,]6667/);
    assert.match(labels(s),/B\s*:\s*85\s*>\s*A\s*:\s*70/);
    assert.doesNotMatch(labels(s),/MOYENNE \/ MEAN|POINTE \/ PEAK/u);
    close((12*70+12*50)/24,60);close((85+23*45)/24,46.6666666667);
    assert.match(content(sceneNodes(s).find(n=>tag(n)==='desc')),s.lang==='fr'?/fictifs/:/fictional/);
  }
});
test('month-end corridor preserves all15 cumulative counts, exact guide coordinates and min/max bounds',()=>{
  const lo=[0,6,13,20,22],guide=[1,6,16,21,22],hi=[3,6,19,22,22];
  for(const s of tempoRedDaysScenes().filter(s=>s.kind==='tunnel')){
    const m=s.mobile,x0=m?60:100,x1=m?380:920,y0=m?490:485,y1=m?235:210,fx=i=>x0+(x1-x0)*i/4,fy=v=>y0-(y0-y1)*v/24;
    const bounds=sceneNodes(s).filter(n=>tag(n)==='line'&&attrs(n).stroke==='var(--color-signal)');assert.equal(bounds.length,5);
    bounds.forEach((n,i)=>{const a=attrs(n);close(a.x1,fx(i));close(a.x2,fx(i));close(a.y1,fy(lo[i]));close(a.y2,fy(hi[i]));});
    const p=pathPoints(attrs(sceneNodes(s).find(n=>tag(n)==='path')).d);assert.equal(p.length,5);p.forEach(([x,y],i)=>{close(x,fx(i));close(y,fy(guide[i]));assert.ok(labels(s).includes(`${lo[i]} / ${guide[i]} / ${hi[i]}`));});
    assert.equal(22-lo[3],2);assert.deepEqual(guide.map((v,i)=>v-(guide[i-1]??0)),[1,5,10,5,1]);
  }
});
test('retrospective efficiencies share a0–100scale and prospective shares remain separate',()=>{
  for(const s of tempoRedDaysScenes().filter(s=>s.kind==='evaluation')){
    assert.equal(bars(s).length,2);bars(s).forEach((n,i)=>close(attrs(n).width,(s.mobile?240:480)*[.95,.94][i]));
    const text=labels(s);assert.match(text,/95 %/);assert.match(text,/94 %/);assert.match(text,/13 →.*3/);assert.match(text,/1[ ,]400/);
    assert.match(text,/90\s*%.*93\s*%/);assert.match(text,/90\s*%.*< 3/);
    assert.match(text,s.lang==='fr'?/indéterminée/:/undetermined/);
  }
});
test('six EDF tax-inclusive rates use a common zero-to0.8scale and tariff hours retain16/8proportions',()=>{
  const rates=[.1356,.1654,.1536,.1921,.1615,.7295];
  for(const s of tempoRedDaysScenes().filter(s=>s.kind==='prices')){
    const b=bars(s),bw=s.mobile?205:575;assert.equal(b.length,6);
    b.forEach((n,i)=>{close(attrs(n).width,bw*rates[i]/.8);assert.ok(labels(s).includes(rates[i].toFixed(4).replace('.',s.lang==='fr'?',':'.')));});
    const hourLines=sceneNodes(s).filter(n=>tag(n)==='line'&&attrs(n)['stroke-width']==='9');assert.equal(hourLines.length,2);
    close(Number(attrs(hourLines[0]).x2)-Number(attrs(hourLines[0]).x1),(s.mobile?364:920)*2/3);
    close(Number(attrs(hourLines[1]).x2)-Number(attrs(hourLines[1]).x1),(s.mobile?364:920)/3);
    close(10*(rates[5]-rates[4]),5.68);assert.match(labels(s),/5[.,]68/);assert.match(labels(s),/22:00/);assert.match(labels(s),/06:00/);
  }
});
test('fictional color permutation preserves fixed volumes and exact pair costs on a shared16euro scale',()=>{
  close(8*.7295+20*.1654,9.1440);close(8*.1654+20*.7295,15.9132);close((20-8)*(.7295-.1654),6.7692);
  for(const s of tempoRedDaysScenes().filter(s=>s.kind==='permutation')){
    assert.equal(bars(s).length,2);bars(s).forEach((n,i)=>close(attrs(n).width,(s.mobile?364:520)*[9.1440,15.9132][i]/16));
    for(const v of['9.1440','15.9132','6.7692','5.8360','3.3080','1.3232','14.5900'])assert.ok(labels(s).includes(v.replace('.',s.lang==='fr'?',':'.')));
    assert.match(labels(s),/21/);assert.match(content(sceneNodes(s).find(n=>tag(n)==='desc')),s.lang==='fr'?/fictifs/:/fictional/);
  }
});
test('reform notice keeps distinct2026and2027dates, conditional early notice and Ecowatt branch',()=>{
  for(const s of tempoRedDaysScenes().filter(s=>s.kind==='notice')){
    const text=labels(s),desc=content(sceneNodes(s).find(n=>tag(n)==='desc'));
    assert.match(text,/01\.11\.2026/);assert.match(text,s.lang==='fr'?/31\.10\.2027/:/31 OCT 2027/);
    assert.match(text,/01\.11\.2027|1 NOV 2027/);assert.doesNotMatch(text,/and31|after10|onD−1/u);assert.match(text,/1 h max/);assert.match(text,/Ecowatt/);assert.match(text,/06:00–22:00/);
    assert.match(desc,s.lang==='fr'?/possible/:/possible/);assert.match(desc,/10h30|10:30/);
    assert.ok(sceneNodes(s).some(n=>tag(n)==='path'));
  }
});
test('figure contract rejects unknown sequence, languages, duplicate or injected sources',()=>{
  for(const lang of ['fr','en'])for(let i=0;i<7;i++)assert.deepEqual(tempoRedDaysFigureReferences(lang,TEMPO_RED_DAYS_KINDS[i],String(i+1).padStart(2,'0'),TEMPO_RED_DAYS_SOURCES[i],'Caption'),TEMPO_RED_DAYS_SOURCES[i].split(' '));
  for(const lang of [null,undefined,{},new String('fr'),'__proto__'])assert.throws(()=>tempoRedDaysFigureReferences(lang,'selection','01','G04 G01','Caption'));
  for(const sources of ['','G04','G04 G01 G01','G04 G01 T01','G04\" onload=\"x'])assert.throws(()=>tempoRedDaysFigureReferences('fr','selection','01',sources,'Caption'));
  for(const[kind,number]of [['selection','02'],['__proto__','01'],['notice','8']])assert.throws(()=>tempoRedDaysFigureReferences('fr',kind,number,'G04 G01','Caption'));
});
test('geometry rejects active assets, shape overlap, absent intended panels and malicious path input',()=>{
  const s=tempoRedDaysScenes().find(s=>s.lang==='fr'&&s.kind==='prices'&&!s.mobile).svg;
  for(const mutate of [s=>s.replace('</svg>','<script>x</script></svg>'),s=>s.replace('<svg ','<svg onload="x" '),s=>s.replace('</svg>','<image href="https://example.com/x"/></svg>'),s=>s.replace('l0g Tempo','Arial'),s=>s.replace('>Rouge HP<','>Une très longue étiquette qui dépasse la marge à droite<'),s=>s.replace('data-panel="tempo-fr-prices-d-frame"','data-panel="missing"')])assert.throws(()=>assertTempoRedDaysGeometry(mutate(s)));
  const p=tempoRedDaysScenes().find(s=>s.kind==='profiles').svg;
  assert.throws(()=>inspectTempoRedDaysSvg(p.replace('d="M ','d="M NaN ')));
});
test('component keeps licensed local fonts, padding, native details and nonclipping responsive sizing',()=>{
  const c=read('src/components/TempoRedDaysFigure.astro');
  for(const w of [400,700]){const p='public/fonts/stablecoins/dejavu-sans-'+w+'.ttf';assert.ok(c.includes(p.replace('public','')));assert.equal(createHash('sha256').update(readFileSync(new URL('../'+p,import.meta.url))).digest('hex'),w===400?'98f2d74db16bb5f41f74adf6d899aeec92861682cccc58bfdbe4d9d7d0a5ae11':'21a0350a4ac2a9f22b6a7a8dcaf6abb08c8b546d06499301f1fcf10996fd0df5');}
  assertFontLicenseReferences(read('public/fonts/stablecoins/LICENSE.txt'),'dejavu');
  assert.match(c,/@container\s*\(max-width:\s*500px\)/u);assert.match(c,/padding-bottom:\s*1rem/u);assert.doesNotMatch(c,/overflow\s*:\s*(?:hidden|clip)|client:|<script|fetch\(/iu);assert.match(c,/<slot \/>/);
});
