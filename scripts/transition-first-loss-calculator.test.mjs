import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { FIRST_LOSS_DEFAULTS, FIRST_LOSS_FIELDS, FIRST_LOSS_ACTORS, calculateFirstLoss, parseFirstLossQuantity, formatFirstLossMoney } from '../src/lib/transitionFirstLossCalculator.mjs';
import { firstLossCopy } from '../src/lib/transitionFirstLossCalculatorUi.mjs';
const model = (overrides = {}) => calculateFirstLoss({ ...FIRST_LOSS_DEFAULTS, ...overrides });
const USD = 1000000n;
test('fictional baseline allocates 25m exactly and moves 5m between public and private equity', () => {
  const r = model();
  assert.equal(r.capital, 100000000n * USD); assert.equal(r.loss, 25000000n * USD);
  assert.equal(r.publicFirst.public.loss, 10000000n * USD); assert.equal(r.publicFirst.equity.loss, 15000000n * USD);
  assert.equal(r.equityFirst.public.loss, 5000000n * USD); assert.equal(r.equityFirst.equity.loss, 20000000n * USD);
  assert.equal(r.publicDifference, 5000000n * USD); assert.equal(r.publicFirst.senior.loss, 0n); assert.equal(r.remaining, 75000000n * USD);
});
test('loss boundaries and senior attachment keep their exact priority', () => {
  for (const [lossShare, aPublic, bPublic, senior] of [['0',0,0,0],['5',5,0,0],['10',10,0,0],['20',10,0,0],['25',10,5,0],['30',10,10,0],['40',10,10,10],['100',10,10,70]]) {
    const r = model({ lossShare });
    assert.equal(r.publicFirst.public.loss, BigInt(aPublic) * 1000000n * USD);
    assert.equal(r.equityFirst.public.loss, BigInt(bPublic) * 1000000n * USD);
    assert.equal(r.publicFirst.senior.loss, BigInt(senior) * 1000000n * USD);
  }
});
test('zero capital and zero or full tranches are valid', () => {
  for (const values of [{capital:'0'}, {publicShare:'0',equityShare:'0'}, {publicShare:'100',equityShare:'0'}, {publicShare:'0',equityShare:'100'}, {publicShare:'33.33',equityShare:'66.67'}]) {
    const r = model({...values,lossShare:'100'});
    assert.equal(r.loss,r.capital); assert.equal(r.remaining,0n); assert.equal(r.publicDifference,0n);
  }
});
test('fractional decimal and comma inputs retain micro-dollar precision', () => {
  const r = model({capital:'0.01', publicShare:'33,33', equityShare:'33.33', lossShare:'66.67'});
  assert.equal(r.capital,10000n); assert.equal(r.loss,6667n);
  assert.equal(r.publicFirst.public.loss,3333n); assert.equal(r.publicFirst.equity.loss,3333n); assert.equal(r.publicFirst.senior.loss,1n);
  assert.equal(formatFirstLossMoney(r.loss,'en'),'$0.01');
});
test('maximum values remain exact', () => {
  const r = model({capital:'1000000000.00',publicShare:'50',equityShare:'50',lossShare:'100'});
  assert.equal(r.capital,1000000000000000n); assert.equal(r.loss,r.capital); assert.equal(r.publicFirst.senior.capital,0n);
});
test('malformed, ambiguous, excessive and unknown fields fail closed', () => {
  const bad = ['', ' 1', '1 ', '-1', '+1', '1e2', '1,000,000', '.5', '1.', '1.234', 'NaN', 'Infinity', '0x10', '<svg>', '1\n', '1'.repeat(100000)];
  for (const raw of bad) for (const field of FIRST_LOSS_FIELDS) assert.throws(() => model({[field]:raw}),RangeError);
  assert.throws(() => model({capital:'1000000000.01'}),RangeError);
  for(const field of ['publicShare','equityShare','lossShare']) assert.throws(()=>model({[field]:'100.01'}),RangeError);
  assert.throws(()=>model({publicShare:'50.01',equityShare:'50'}),RangeError);
  for(const input of [null,[],42,{}, {...FIRST_LOSS_DEFAULTS,extra:'1'},Object.create(FIRST_LOSS_DEFAULTS)]) assert.throws(()=>calculateFirstLoss(input),RangeError);
  assert.throws(()=>parseFirstLossQuantity('1','constructor'),RangeError); assert.throws(()=>parseFirstLossQuantity(1,'capital'),RangeError);
});
test('1000 independent attachment-point scenarios conserve capital and keep senior loss unchanged', () => {
  for(let i=0;i<1000;i++) {
    const publicBp=(i*71)%10001, equityBp=(i*37)%(10001-publicBp), lossBp=(i*137)%10001;
    const cents=BigInt(i*997+1), decimal = n => `${Math.floor(n/100)}.${String(n%100).padStart(2,'0')}`;
    const r=model({capital:decimal(Number(cents)),publicShare:decimal(publicBp),equityShare:decimal(equityBp),lossShare:decimal(lossBp)});
    const capped = (v,min,max) => v<min?min:v>max?max:v;
    const totalLoss=cents*BigInt(lossBp), publicCap=cents*BigInt(publicBp), equityCap=cents*BigInt(equityBp);
    assert.equal(r.publicFirst.public.loss,capped(totalLoss,0n,publicCap));
    assert.equal(r.equityFirst.public.loss,capped(totalLoss-equityCap,0n,publicCap));
    assert.equal(r.publicFirst.senior.loss,capped(totalLoss-publicCap-equityCap,0n,r.publicFirst.senior.capital));
    for(const key of ['publicFirst','equityFirst']) {
      assert.equal(FIRST_LOSS_ACTORS.reduce((s,a)=>s+r[key][a].loss,0n),r.loss);
      for(const actor of FIRST_LOSS_ACTORS) {const row=r[key][actor];assert.equal(row.loss+row.remaining,row.capital);assert.ok(row.loss>=0n&&row.loss<=row.capital);}
    }
    assert.equal(r.publicFirst.senior.loss,r.equityFirst.senior.loss);
  }
});
test('money formatting rounds half-up to cents with native separators', () => {
  assert.equal(formatFirstLossMoney(4999n,'en'),'$0.00');assert.equal(formatFirstLossMoney(5000n,'en'),'$0.01');
  assert.equal(formatFirstLossMoney(1234567890000n,'fr'),'1\u202f234\u202f567,89\u00a0$');
  for(const args of [[-1n,'fr'],[1,'en'],[1n,'de']])assert.throws(()=>formatFirstLossMoney(...args),RangeError);
});
test('copy keeps conditional allocation distinct from actual transaction or expected fiscal cost', () => {
  for(const lang of ['fr','en']) {const c=firstLossCopy(lang);assert.equal(c.fields.length,4);assert.equal(c.columns.length,3);assert.equal(c.actors.length,3);assert.equal(c.structures.length,2);assert.ok(c.limits&&c.rounding&&c.nojs&&c.privacy);}
  assert.throws(()=>firstLossCopy('de'),RangeError);
});
test('progressive enhancement has a closed default, SSR outputs and safe local DOM operations', () => {
  const component=fs.readFileSync(new URL('../src/components/TransitionFirstLossCalculator.astro',import.meta.url),'utf8');
  const ui=fs.readFileSync(new URL('../src/lib/transitionFirstLossCalculatorUi.mjs',import.meta.url),'utf8');
  assert.match(component,/<details class="loss-controls">/);assert.match(component,/<fieldset disabled>/);assert.match(component,/<noscript>/);assert.match(component,/aria-live="polite"/);
  assert.match(component,/\.loss-structures>section\{min-width:0\}/, 'Grid children must shrink so large table values stay inside keyboard-scrollable regions');
  assert.match(component,/\.first-loss-calculator table\{display:table;overflow:visible;/, 'The named focusable region owns horizontal scrolling instead of an unfocusable table');
  assert.match(ui,/outputs\.length !== 21/);assert.match(ui,/output\.textContent = copy\.unavailable/);assert.match(ui,/fieldset\.disabled = false/);
  assert.doesNotMatch(ui,/innerHTML|insertAdjacentHTML|fetch\(|XMLHttpRequest|localStorage|sessionStorage|eval\(|new Function/);
});
