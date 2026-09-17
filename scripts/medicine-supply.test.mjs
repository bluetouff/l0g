import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { XMLValidator } from 'fast-xml-parser';
import { medicineFigureSvg, renderMedicineFigure } from '../src/lib/medicineSupplyFigures.mjs';
import {DEFAULTS,validateInputs,simulateSupply,compareSupply,csvSupply} from '../src/lib/medicineSupplyModel.mjs';
import {renderMedicineSupplyLab,renderSupplyChart} from '../src/lib/medicineSupplyView.mjs';
const near=(a,b)=>assert.ok(Math.abs(a-b)<=1e-7*Math.max(1,Math.abs(b)),`${a} != ${b}`);
test('default baseline leaves 22,000 units unmet, first on day 24',()=>{const {baseline:q}=compareSupply();near(q.totalUnmet,22000);assert.equal(q.firstShortage,24);near(q.totalDelivered,38000);});
test('default backup leaves 12,800 unmet, first on day 29',()=>{const {backup:q}=compareSupply();near(q.totalUnmet,12800);assert.equal(q.firstShortage,29);near(q.serviceRate,47200/60000);});
test('full replacement from day 15 leaves 5,600 units in stock',()=>{const q=simulateSupply({...DEFAULTS,backupShare:60});near(q.totalUnmet,0);near(q.endingStock,5600);assert.equal(q.firstShortage,null);});
test('no stock delivers only the available flows',()=>{const q=simulateSupply({dailyDemand:100,stockDays:0,outageDays:3,lostShare:70,backupShare:20,backupDelayDays:1});assert.deepEqual(q.rows.map(r=>Math.round(r.delivered)),[30,50,50]);near(q.totalUnmet,170);});
test('no lost supply means no stock is drawn',()=>{const q=simulateSupply({lostShare:0});near(q.endingStock,q.initialStock);near(q.totalUnmet,0);assert.equal(q.effectiveBackupShare,0);});
test('zero delay brings backup on day 1',()=>{const q=simulateSupply({stockDays:0,lostShare:60,backupShare:60,backupDelayDays:0});near(q.totalUnmet,0);near(q.rows[0].backupFlow,600);});
test('14 complete days means backup begins on day 15',()=>{const q=simulateSupply();near(q.rows[13].backupFlow,0);near(q.rows[14].backupFlow,200);});
test('a delay lasting the entire incident produces no benefit',()=>{const q=compareSupply({backupDelayDays:60});near(q.baseline.totalUnmet,q.backup.totalUnmet);});
test('backup is capped at the lost share',()=>{const q=simulateSupply({lostShare:20,backupShare:100,backupDelayDays:0});assert.equal(q.effectiveBackupShare,20);near(q.endingStock,q.initialStock);});
test('full loss and no backup uses inventory first',()=>{const q=simulateSupply({dailyDemand:100,stockDays:2,outageDays:4,lostShare:100,backupShare:0});assert.equal(q.firstShortage,3);near(q.totalUnmet,200);});
test('exact exhaustion at end of final day is not an unserved day',()=>{const q=simulateSupply({dailyDemand:100,stockDays:2,outageDays:2,lostShare:100,backupShare:0});assert.equal(q.firstShortage,null);near(q.endingStock,0);});
test('unmet demand is not backlogged',()=>{const q=simulateSupply({stockDays:0,outageDays:4,lostShare:100,backupShare:100,backupDelayDays:2});assert.deepEqual(q.rows.map(r=>r.unmet),[1000,1000,0,0]);near(q.totalUnmet,2000);});
test('one-day incident is handled',()=>{const q=simulateSupply({outageDays:1,stockDays:0,backupShare:0});near(q.totalUnmet,600);assert.equal(q.rows.length,1);});
test('invalid input types and bounds are rejected',()=>{for(const input of [{dailyDemand:0},{stockDays:-1},{outageDays:366},{lostShare:101},{backupShare:NaN},{backupDelayDays:1.5},{dailyDemand:'1000'},{stockDays:Infinity}])assert.throws(()=>validateInputs(input),RangeError);});
test('partial configuration preserves defaults without mutation',()=>{const p={stockDays:3};const q=validateInputs(p);assert.equal(q.dailyDemand,1000);assert.deepEqual(p,{stockDays:3});assert.equal(DEFAULTS.stockDays,14);});
test('CSV rows and column totals agree with the model',()=>{const csv=csvSupply().trim().split('\n');assert.equal(csv.length,61);assert.equal(csv[0].split(',').length,10);const rows=csv.slice(1).map(s=>s.split(',').map(Number));near(rows.reduce((s,r)=>s+r[5],0),22000);near(rows.reduce((s,r)=>s+r[9],0),12800);});
test('small fractional daily quantities conserve material',()=>{const q=simulateSupply({dailyDemand:1,stockDays:0,outageDays:10,lostShare:33,backupShare:0});near(q.totalDelivered,6.7);near(q.totalUnmet,3.3);});
test('large permitted values remain finite',()=>{const q=simulateSupply({dailyDemand:1e9,stockDays:365,outageDays:365});assert.ok(Number.isFinite(q.totalDelivered));near(q.serviceRate,1);});
test('1,000 deterministic configurations obey conservation and monotonicity',()=>{
 let seed=72491;const rnd=max=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed%max;};
 for(let k=0;k<1000;k++){
  const p={dailyDemand:rnd(100000)+1,stockDays:rnd(50),outageDays:rnd(90)+1,lostShare:rnd(101),backupShare:rnd(101),backupDelayDays:rnd(91)};
  const {baseline:a,backup:b}=compareSupply(p);
  assert.ok(b.totalUnmet<=a.totalUnmet+1e-5);assert.ok(b.serviceRate>=-1e-10&&b.serviceRate<=1+1e-10);
  for(const q of [a,b]){near(q.totalDelivered+q.totalUnmet,p.dailyDemand*p.outageDays);near(q.initialStock+q.rows.reduce((s,r)=>s+r.inflow,0),q.endingStock+q.totalDelivered);for(const r of q.rows){assert.ok(r.endingStock>=0);assert.ok(r.endingStock<=r.beginningStock+1e-5);near(r.delivered+r.unmet,r.demand);}}
 }
});
test('FR and EN render controls and a non-script default result',()=>{for(const lang of ['fr','en']){const html=renderMedicineSupplyLab(lang);assert.match(html,new RegExp(`data-lang="${lang}"`));assert.equal((html.match(/type="number"/g)||[]).length,6);assert.match(html,/data-metric="unmet-backup"/);assert.match(html,/<noscript>/);}});
test('desktop and mobile chart IDs are distinct and accessible',()=>{for(const mobile of [false,true]){const svg=renderSupplyChart('en',compareSupply(),`test-${mobile}`,mobile);assert.match(svg,new RegExp(`aria-labelledby="test-${mobile}-t test-${mobile}-d"`));assert.match(svg,/viewBox="0 0 (400|640) /);}});
test('closed-form cumulative shortage agrees independently with the daily loop', () => {
  for (const demand of [1, 137, 1000, 1e9]) for (const lost of [0, 33, 60, 100]) for (const backup of [0, 20, 100]) for (const delay of [0, 14, 60, 365]) {
    const p={dailyDemand:demand,lostShare:lost,backupShare:backup,backupDelayDays:delay,stockDays:14,outageDays:60};
    const gap=demand*(lost*Math.min(delay,60)+(lost-Math.min(backup,lost))*Math.max(0,60-delay))/100;
    near(simulateSupply(p).totalUnmet,Math.max(0,gap-demand*14));
  }
});
test('malformed containers and unknown keys cannot silently become valid defaults', () => {
  for (const input of [null, [], '1000', Object.create(DEFAULTS), {extra:1}, JSON.parse('{"__proto__":{}}')]) assert.throws(()=>validateInputs(input),RangeError);
  assert.throws(()=>renderSupplyChart('fr',compareSupply(),'bad" id'),RangeError);
  assert.doesNotMatch(renderMedicineSupplyLab('constructor'),/undefined|function Object/);
});
test('initial results survive without scripts and inactive controls cannot submit a query', () => {
  const html=renderMedicineSupplyLab('fr');
  assert.match(html,/<fieldset class="ms-form" disabled>/); assert.doesNotMatch(html,/<form\b/);
  const client=readFileSync(new URL('../src/lib/medicineSupplyClient.mjs',import.meta.url),'utf8');
  assert.doesNotMatch(client,/innerHTML|outerHTML|insertAdjacentHTML|parseFromString|fetch\(|localStorage|document\.cookie/);
  assert.match(client,/textContent/);assert.match(client,/replaceChildren/);
  assert.match(client,/results\.hidden = true; rows\.hidden = true/);assert.match(client,/exportButton\.disabled = true/);
});
test('all inline figures are valid, responsive, dark, static XML with accessible names', () => {
  for (const lang of ['fr','en']) for (const kind of ['chain','stock','commitments']) for (const mobile of [false,true]) {
    const svg=medicineFigureSvg(lang,kind,mobile);
    assert.equal(XMLValidator.validate(svg),true);
    assert.match(svg,/style="width:100%;height:auto"/);assert.match(svg,/fill="#0b0d10"/);
    assert.match(svg,/<title/);assert.match(svg,/<desc/);assert.match(svg,/Source/);
    assert.doesNotMatch(svg,/<(?:script|image|foreignObject|use)\b|\bon\w+=|NaN|Infinity/);
    assert.match(renderMedicineFigure(lang,kind),/<figcaption>/);
  }
  for (const lang of ['fr','en']) for (const mobile of [false,true]) assert.equal(XMLValidator.validate(renderSupplyChart(lang,compareSupply(),'xml',mobile)),true);
});
test('responsive figure breakpoint and prose override stay unclipped', () => {
  const css=readFileSync(new URL('../src/styles/medicine-supply.css',import.meta.url),'utf8');
  assert.match(css,/\.prose figure\.ms-figure\s*\{[^}]*overflow:visible/);
  assert.match(css,/@media\(max-width:780px\)/);
});
