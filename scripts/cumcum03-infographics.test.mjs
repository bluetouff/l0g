import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { cumCumTaxLossFigureReferences } from '../src/lib/cumCumTaxLossFigures.mjs';
import { CUMCUM03_KINDS, CUMCUM03_SOURCES, cumCumTaxLossScenes, inspectCumCumTaxLossSvg, assertCumCumTaxLossGeometry, tag, attrs, content } from './cumcum03-svg-assertions.mjs';
import { assertFontLicenseReferences } from './font-license-assertions.mjs';
const read = p => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');
const near = (a, b) => assert.ok(Math.abs(Number(a) - b) < .000002, `${a} matches ${b}`);
const labelsOf = all => all.filter(n => tag(n) === 'text').map(content).join(' ');
const rect = (all, suffix) => attrs(all.find(n => tag(n) === 'rect' && attrs(n).id?.endsWith(suffix)));
test('twenty passive bilingual scenes preserve the five supplied explanatory mechanisms and exact scales', () => {
  const scenes = cumCumTaxLossScenes(); assert.equal(scenes.length, 20);
  const countries = { FR:33.27037, DE:28.54782, NL:26.9624, ES:18.82012, IT:13.27447, BE:7.17791, US:4.85843, CH:4.83289, LU:2.19171, AT:1.05195 };
  for (const s of scenes) {
    assertCumCumTaxLossGeometry(s.svg); const { all } = inspectCumCumTaxLossSvg(s.svg), labels = labelsOf(all);
    assert.doesNotMatch(content(all.find(n => tag(n) === 'title')), /\bce (?:que|qui|qu[’'])|\bwhat\b|horlog|clock/iu);
    assert.doesNotMatch(s.svg, /<defs|<pattern|<g\b|transform=|#[0-9a-f]{3,8}\b|—/iu);
    if (s.kind === 'model') {
      for (const [i,v] of [625.593,443.60487,221.802435,33.27036525].entries()) near(rect(all, '-bar-'+i).width, (s.mobile ? 372 : 532)*v/650);
      for (const value of ['2000–2020','2021','625','443','221','33','50','15','S01']) assert.ok(labels.includes(value));
      assert.match(labels, s.lang === 'fr' ? /hypothèse|Hypothèse/u : /Assumption/u);
      assert.match(labels, s.lang === 'fr' ? /modélisée/u : /modelled/u);
    }
    if (s.kind === 'sensitivity') {
      assert.equal(all.filter(n => tag(n)==='rect' && attrs(n).id?.includes('-card-scenario-')).length, 16);
      for (const [i,p] of [25,50,75,100].entries()) for (const [j,t] of [5,10,15,20].entries()) {
        const card = rect(all,`-card-scenario-${i}-${j}`); const label = all.find(n=>tag(n)==='text' && attrs(n)['data-panel']===card.id);
        const expected=(443.60487*p*t/10000).toFixed(2).replace('.',s.lang==='fr'?',':'.'); assert.equal(content(label),expected);
        assert.equal(card.stroke, p===50&&t===15 ? 'var(--color-signal)' : undefined);
      }
      assert.match(labels, s.lang === 'fr' ? /sans probabilité/u : /no assigned probability/u);
    }
    if (s.kind === 'scope') {
      for (const [code,v] of Object.entries(countries)) near(rect(all,'-bar-'+code).width,(s.mobile?372:266)*v/35);
      for (const value of ['131','136','140','2000–2020','2000–2008','S01']) assert.ok(labels.includes(value));
      assert.match(labels, s.lang === 'fr' ? /incomplète/u : /Incomplete/u);
    }
    if (s.kind === 'evidence') {
      const length=s.mobile?340:430;near(rect(all,'-bar-tax-2022').width,length*804/1213);near(rect(all,'-bar-penalties-2022').width,length*409/1213);near(rect(all,'-bar-cash-2022').width,length*277/1213);
      for (const value of ['25.10.2022','15.10.2026','804','409','277','S03','S04']) assert.ok(labels.includes(value));
      assert.match(labels,s.lang==='fr'?/non détaillés/u:/not itemised/u);
    }
    if (s.kind === 'settlements') {
      for (const [i,[tax,fine]] of [[46.184568,88.247869],[34.464424,267.531]].entries()) {
        const length=s.mobile?372:676;near(rect(all,'-bar-tax-'+i).width,length*tax/320);near(rect(all,'-bar-fine-'+i).width,length*fine/320);
      }
      const length=s.mobile?372:952;near(rect(all,'-bar-restitutive').width,length*49026594/88247869);near(rect(all,'-bar-punitive').width,length*39221275/88247869);
      for (const value of ['Crédit Agricole CIB','HSBC Bank plc','08.09.2025','08.01.2026','80','355','S05','S06','S07']) assert.ok(labels.includes(value));
      assert.match(labels,s.lang==='fr'?/Statuts à publication/u:/Status at publication/u);
    }
  }
  near(443604.87*.5*.15,33270.36525); assert.equal(49026594+39221275,88247869);assert.equal(46184568+34464424,80648992);assert.equal(88247869+267531000,355778869);
});
test('closed figure and source contracts reject wrong figure order, duplicate sources and nonprimitive input', () => {
  for(let i=0;i<CUMCUM03_KINDS.length;i++) for(const lang of ['fr','en']) assert.deepEqual(cumCumTaxLossFigureReferences(lang,CUMCUM03_KINDS[i],String(i+1).padStart(2,'0'),CUMCUM03_SOURCES[i],'Caption'),CUMCUM03_SOURCES[i].split(' '));
  for(const lang of [undefined,null,{},new String('fr'),'__proto__']) assert.throws(()=>cumCumTaxLossFigureReferences(lang,'model','01','S01','Caption'));
  for(const src of ['','S01 S01','S00','S11','S02']) assert.throws(()=>cumCumTaxLossFigureReferences('fr','model','01',src,'Caption'));
  assert.throws(()=>cumCumTaxLossFigureReferences('fr','model','02','S01','Caption')); assert.throws(()=>cumCumTaxLossFigureReferences('fr','model','01','S01',' '));
});
test('XML, passive primitives, font coverage and panel ownership reject dangerous or clipped artwork', () => {
  const svg=cumCumTaxLossScenes().find(s=>s.lang==='fr'&&s.kind==='scope'&&s.mobile).svg;
  for(const change of [s=>s.replace('</svg>','<script>alert(1)</script></svg>'),s=>s.replace('<svg ','<svg onload="x" '),s=>s.replace('</svg>','<image href="https://example.com/x"/></svg>'),s=>s.replace('var(--color-ink)','#11273e'),s=>s.replace('font-family="l0g CumCum"','font-family="Arial"'),s=>s.replace('font-size="17"','font-size="10"'),s=>s.replace('<rect ','<rect opacity="0" ')]) { const bad=change(svg);assert.notEqual(bad,svg);assert.throws(()=>inspectCumCumTaxLossSvg(bad)); }
  for(const change of [s=>s.replace('>France<','>💥<'),s=>s.replace('>France<','>UN TITRE EXTRAORDINAIREMENT LONG QUI DÉBORDE DU CADRE<'),s=>s.replace('data-panel="cumcum03-fr-scope-m-card-scope-0"','data-panel="cumcum03-fr-scope-m-card-scope-2"'),s=>s.replace('x="24" y="506"','x="410" y="506"')]) { const bad=change(svg);assert.notEqual(bad,svg);assert.throws(()=>assertCumCumTaxLossGeometry(bad)); }
});
test('licensed existing fonts and responsive containers retain legible theme-native proportions', () => {
  const component=read('src/components/CumCumTaxLossFigure.astro');
  for(const w of [400,700]) {const p=`public/fonts/cumcum/dejavu-sans-${w}.ttf`; assert.ok(readFileSync(new URL(`../${p}`,import.meta.url)).length<60000);assert.ok(component.includes(p.replace('public','')));}
  assertFontLicenseReferences(read('public/fonts/cumcum/LICENSE.txt'),'dejavu');
  assert.match(component,/max-width:\s*48rem/u);assert.match(component,/max-width:\s*26rem/u);assert.match(component,/@container\s*\(max-width:\s*500px\)/u);assert.match(component,/padding-bottom:\s*1rem/u);
  assert.doesNotMatch(component,/overflow\s*:\s*(?:hidden|clip)|filter\s*:|client:|<script|fetch\(|@media\s*\(max-width:|sources-list|source-meta/iu);
  assert.ok(22*501/1000>=11);assert.ok(17*280/420>=11);assert.ok(720*768/1000<560);
});
