import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { XMLValidator } from 'fast-xml-parser';
import { fromHtml } from 'hast-util-from-html';
import { toText } from 'hast-util-to-text';
import {runSequence,compareSequences,parseSequence,validateSequenceInput,BASE_SEQUENCE_INPUT,sequenceCSV} from '../src/lib/retirementSequenceModel.mjs';
import {renderRetirementSequence,renderSequenceResults} from '../src/lib/retirementSequenceView.mjs';
import {retirementFigureSvg} from '../src/lib/retirementSequenceFigures.mjs';
const two={...BASE_SEQUENCE_INPUT,returns:[-20,25],inflation:0};
const close=(a,b,eps=1e-6)=>assert.ok(Math.abs(a-b)<eps,`${a} != ${b}`);
test('published synthetic JSON and CSV match every independently recalculated row', () => {
  const pack = JSON.parse(readFileSync(new URL('../public/data/retraite-sequence/scenarios.json', import.meta.url), 'utf8'));
  assert.equal(pack.forecast, false); assert.equal(pack.historical_period, null); assert.equal(pack.probability_model, false);
  for (const scenario of pack.scenarios) {
    assert.deepEqual(compareSequences(scenario.input), scenario.result);
    assert.equal(readFileSync(new URL(`../public/data/retraite-sequence/${scenario.id}.csv`, import.meta.url), 'utf8'), sequenceCSV(scenario.input));
    for (const key of ['a', 'b']) {
      let opening = scenario.input.initial;
      const returns = key === 'a' ? scenario.input.returns : scenario.input.returns.toReversed();
      returns.forEach((rate, index) => {
        const assets = opening * (100 + rate) / 100 * (100 - scenario.input.fee) / 100;
        const budget = scenario.input.withdrawal * ((100 + scenario.input.inflation) / 100) ** index;
        const payment = Math.min(assets, scenario.input.mode === 'fixed' ? budget : assets * scenario.input.withdrawal / scenario.input.initial);
        const row = scenario.result[key].rows[index];
        close(row.paid, payment); close(row.closing, assets - payment); opening = assets - payment;
      });
    }
  }
});
test('input cannot inherit defaults, skip sparse array entries, or supply excessive text', () => {
  for (const input of [null, [], Object.create(BASE_SEQUENCE_INPUT), { ...two, returns: Array(2) }, { ...two, initial: '200000' }, { ...two, returns: [NaN, 1] }]) assert.throws(() => validateSequenceInput(input));
  assert.throws(() => parseSequence('1;'.repeat(4096)));
  assert.doesNotMatch(renderRetirementSequence('constructor'), /undefined|function Object/);
});
test('progressive enhancement stays inert until DOM-only handlers are attached', () => {
  for (const lang of ['fr', 'en']) {
    const html = renderRetirementSequence(lang);
    assert.match(html, /<fieldset data-sequence-form disabled>/);
    assert.doesNotMatch(html, /<form\b/);
    assert.match(html, /disabled data-sequence-export/);
  }
  const client = readFileSync(new URL('../src/lib/retirementSequenceClient.mjs', import.meta.url), 'utf8');
  assert.doesNotMatch(client, /innerHTML|outerHTML|insertAdjacentHTML|parseFromString|fetch\(|localStorage|document\.cookie/);
  assert.match(client, /textContent/); assert.match(client, /replaceChildren/);
});
test('all figure markup is valid responsive XML with a dark background and legible base fonts', () => {
  for (const lang of ['fr', 'en']) for (const kind of ['capital', 'income']) {
    const markup = retirementFigureSvg(lang, kind);
    assert.equal(XMLValidator.validate(markup, { allowBooleanAttributes: true }), true);
    const ast = fromHtml(markup, { fragment: true });
    const visit = node => {
      if (node.tagName === 'svg') assert.match(node.properties.viewBox, /^0 0 (520 870|360 320)$/);
      if (node.tagName === 'text') {
        assert.ok(Number(node.properties.fontSize) >= 18);
        assert.ok(Number(node.properties.y) > 0);
        assert.ok(toText(node).length < 52, toText(node));
      }
      assert.ok(!['script','foreignObject','image','a'].includes(node.tagName));
      for (const child of node.children ?? []) visit(child);
    };
    visit(ast); assert.match(markup, /fill="#0c0d10"/); assert.match(markup, /width:100%;height:auto/);
  }
});
test('Opening example: 177500 versus 182000',()=>{const {a,b}=compareSequences(two);close(a.closing,177500);close(b.closing,182000);close(a.totalPaid,20000);close(b.totalPaid,20000)});
test('No withdrawals: the return order leaves final wealth unchanged',()=>{const {a,b}=compareSequences({...two,withdrawal:0});close(a.closing,200000);close(b.closing,200000)});
test('Arithmetic mean 2.5%, compound mean zero',()=>{const a=runSequence(two);close(a.arithmetic,2.5);close(a.cagr,0)});
test('Synthetic 30 years: first incomplete withdrawal is year 27',()=>{const {a,b}=compareSequences(BASE_SEQUENCE_INPUT);assert.equal(a.firstUnfunded,27);assert.equal(a.firstExhaustion,27);assert.equal(a.closing,0);assert.equal(b.firstUnfunded,null);close(b.closing,550026.3294298652);close(b.realClosing,303653.5246507034);close(a.cagr,6.885014213211971)});
test('Scheduled versus paid withdrawals are not conflated after exhaustion',()=>{const {a,b}=compareSequences(BASE_SEQUENCE_INPUT);close(a.totalPaid,340151.1320288094);close(b.totalPaid,405680.792051677);assert.ok(a.rows[26].paid<a.rows[26].budget);assert.ok(a.rows.slice(27).every(r=>r.paid===0&&r.closing===0));close(a.totalPaid+a.totalShortfall,b.totalPaid)});
test('Thirty years without inflation reproduces both disclosed paths',()=>{const {a,b}=compareSequences({...BASE_SEQUENCE_INPUT,inflation:0});close(a.closing,194037.62880492627);close(b.closing,710789.3352775199)});
test('Proportional withdrawals: same final portfolio, different cash paid',()=>{const {a,b}=compareSequences({...two,mode:'proportional'});close(a.closing,180500);close(b.closing,180500);close(a.totalPaid,17500);close(b.totalPaid,22000);assert.equal(a.firstUnfunded,null);assert.equal(a.firstBudgetGap,1)});
test('Withdrawal index starts at the second withdrawal',()=>{const a=runSequence(BASE_SEQUENCE_INPUT);close(a.rows[0].budget,10000);close(a.rows[1].budget,10200);close(a.rows[20].budget,14859.473959783549)});
test('Final purchasing power uses all elapsed years',()=>{const a=runSequence({...two,withdrawal:0,inflation:2});close(a.realClosing,200000/(1.02**2))});
test('Fees are multiplicative, not subtracted from gross return',()=>{const a=runSequence({...two,returns:[5,5],fee:1,withdrawal:0});close(a.netCagr,3.95);close(a.closing,200000*(1.05*.99)**2)});
test('No overpayment, negative capital or resurrection after total loss',()=>{const a=runSequence({...two,returns:[-100,300]});assert.ok(a.rows.every(r=>r.closing===0&&r.paid===0));assert.equal(a.firstUnfunded,1);close(a.cagr,-100)});
test('Payments capped at available capital',()=>{const a=runSequence({...two,initial:1000,withdrawal:2000,returns:[0,0]});close(a.rows[0].paid,1000);close(a.rows[1].paid,0);close(a.totalShortfall,3000)});
test('Locale parsing and Unicode minus',()=>assert.deepEqual(parseSequence('−20 ; 25%\n6,5; +2.5'),[-20,25,6.5,2.5]));
test('Invalid series cannot be silently coerced',()=>{for(const s of ['', '1', '5foo;8', '2;;abc', 'Infinity;4','-101;10','301;0','<script>;0','5, 10, 15'])assert.throws(()=>parseSequence(s));assert.throws(()=>parseSequence(Array(61).fill(5).join(';')))});
test('Input validation rejects nonfinite values and proportional overdrafts',()=>{for(const changes of [{initial:NaN},{withdrawal:-1},{fee:6},{inflation:16},{returns:[-101,0]},{mode:'x'},{mode:'proportional',withdrawal:200000}])assert.throws(()=>validateSequenceInput({...two,...changes}))});
test('Order invariance without flows across permutations, inflation and fees',()=>{const returns=[-20,6,11,-3,15,2];let expected=null;for(let i=0;i<returns.length;i++){const perm=[...returns.slice(i),...returns.slice(0,i)];const a=runSequence({...BASE_SEQUENCE_INPUT,returns:perm,withdrawal:0,fee:1});if(expected===null)expected=a.closing;close(a.closing,expected)}});
test('Proportional ending-balance invariance across permutations',()=>{const returns=[-20,6,11,-3,15,2];let expected=null;for(let i=0;i<returns.length;i++){const a=runSequence({...BASE_SEQUENCE_INPUT,returns:[...returns.slice(i),...returns.slice(0,i)],mode:'proportional',fee:1});if(expected===null)expected=a.closing;close(a.closing,expected)}});
test('CSV has exactly one record per year and per scenario',()=>{const csv=sequenceCSV(two).trim().split('\n');assert.equal(csv.length,5);assert.equal(csv[0].split(',').length,14);assert.ok(csv.slice(1).every(row=>row.split(',').length===14))});
test('Both languages render without external automatic resources',()=>{for(const lang of ['fr','en']){const s=renderRetirementSequence(lang);assert.match(s,/data-retirement-sequence/);assert.doesNotMatch(s,/<(?:script|img|iframe)[^>]+https?:/);assert.ok(s.includes('550'));assert.ok(renderSequenceResults({...two,mode:'proportional'},lang).includes('180'));}});
test('SVG figures contain accessibility and provenance metadata',()=>{for(const lang of ['fr','en'])for(const kind of ['capital','income']){const svg=retirementFigureSvg(lang,kind);assert.match(svg,/<title>/);assert.match(svg,/<desc>/);assert.match(svg,/Source/);assert.doesNotMatch(svg,/NaN|Infinity|undefined/);assert.match(svg,/2026/);}});
