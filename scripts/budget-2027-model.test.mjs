import test from 'node:test';
import assert from 'node:assert/strict';
import {DEFAULTS, LIMITS, evaluate, parseNumber, validateInputs, bondPrice, HORIZON} from '../src/lib/budget-2027-model.mjs';
const close = (a, b, eps=1e-10) => assert.ok(Math.abs(a-b) < eps, `${a} != ${b}`);

test('defaults are finite, six annual rows and fixed horizon', () => {
  const r=evaluate(); assert.equal(r.reference.length,HORIZON);
  assert.equal(r.reference[0].year,2027); assert.equal(r.reference.at(-1).year,2032);
  assert.ok(r.debtGap>0); assert.ok(r.priceChangePct<0);
  for(const rows of [r.reference,r.stressed]) for(const row of rows)
    assert.ok(Object.values(row).every(Number.isFinite));
});
test('zero shock exactly reproduces reference and price', () => {
  const r=evaluate({...DEFAULTS,shock:0});
  assert.deepEqual(r.stressed,r.reference); close(r.priceChangePct,0); close(r.debtGap,0);
});
test('zero repricing isolates immediate price risk from fiscal pass-through', () => {
  const r=evaluate({...DEFAULTS,repricing:0});
  assert.deepEqual(r.stressed,r.reference); assert.ok(r.priceAfter<r.priceBefore);
});
test('100 percent repricing sets effective stock rate to marginal rate', () => {
  const r=evaluate({...DEFAULTS,repricing:100});
  close(r.reference[0].effectiveRate,4.5); close(r.stressed[0].effectiveRate,5.5);
});
test('accounting identity holds in every row, including negative growth', () => {
  for(const growth of [-3,0,2.5,8]) {
    const r=evaluate({...DEFAULTS,growth});
    for(const rows of [r.reference,r.stressed]) for(const row of rows){
      close(row.debt, row.openingDebt/(1+growth/100)+row.deficit);
      close(row.deficit,DEFAULTS.primaryDeficit+row.interest);
      close(row.interest,row.effectiveRate/100*row.openingDebt/(1+growth/100));
    }
  }
});
test('debt ratio stabilising deficit is an accounting result, not a universal 3%', () => {
  const r=evaluate(); close(r.stabilisingDeficit,119.3*0.025/1.025);
  close(119.3/1.025+r.stabilisingDeficit,119.3);
});
test('higher nominal growth decreases the projected debt ratio, all else equal', () => {
  assert.ok(evaluate({...DEFAULTS,growth:4}).reference.at(-1).debt<evaluate().reference.at(-1).debt);
});
test('more primary deficit increases debt and subsequent interest', () => {
  assert.ok(evaluate({...DEFAULTS,primaryDeficit:3}).reference.at(-1).debt>evaluate().reference.at(-1).debt);
});
test('a negative yield shock has opposite price and fiscal directions', () => {
  const r=evaluate({...DEFAULTS,shock:-100}); assert.ok(r.priceChangePct>0); assert.ok(r.debtGap<0);
});
test('100 basis points is one percentage point of yield', () => {
  close(evaluate().shockedMarketRate,5.5);
});
test('bond with coupon equal to yield trades at par', () => {
  for(const n of [1,10,30,50]) close(bondPrice(3,3,n),100);
});
test('zero yield produces undiscounted cash flows', () => { close(bondPrice(3,0,10),130); });
test('zero coupon price is discounted face value', () => { close(bondPrice(0,5,10),100/1.05**10); });
test('one-year price matches closed-form formula', () => { close(bondPrice(3,4.5,1),103/1.045); });
test('long low-coupon bond is more price-sensitive in the documented example', () => {
  assert.ok(evaluate({...DEFAULTS,maturity:30}).priceChangePct<evaluate().priceChangePct);
});
test('decimal parsing is strict and supports a single decimal comma', () => {
  close(parseNumber(' 2,5 '),2.5); close(parseNumber('.5'),0.5);
  for(const bad of ['', ' ', '0x10', '1e3','1e309','NaN','Infinity','1,2,3','1.2.3','<img src=x>',
    '1'.repeat(100), null, {}, [], NaN, Infinity, true]) assert.throws(()=>parseNumber(bad));
});
test('all numerical bounds are enforced, no silent clamping', () => {
  for(const [key,[lo,hi]] of Object.entries(LIMITS)) {
    assert.throws(()=>validateInputs({...DEFAULTS,[key]:lo-1}));
    assert.throws(()=>validateInputs({...DEFAULTS,[key]:hi+1}));
  }
});
test('maturity must be integer and post-shock yield is bounded', () => {
  assert.throws(()=>evaluate({...DEFAULTS,maturity:2.5}));
  assert.throws(()=>evaluate({...DEFAULTS,marketRate:0,shock:-1}));
});
test('missing values, inherited properties and coercion gadgets are rejected', () => {
  assert.throws(()=>evaluate({})); assert.throws(()=>evaluate(Object.create(DEFAULTS)));
  assert.throws(()=>evaluate({...DEFAULTS,debt:{valueOf(){throw Error('called');}}}));
});
test('results do not mutate caller inputs and are frozen', () => {
  const a={...DEFAULTS}, before={...a}; const r=evaluate(a);
  assert.deepEqual(a,before); assert.ok(Object.isFrozen(r)); assert.ok(Object.isFrozen(r.reference));
});
test('10,000 deterministic boundary-adjacent scenarios remain finite', () => {
  let seed=7349; const rand=()=>((seed=(seed*1664525+1013904223)>>>0)/2**32);
  for(let k=0;k<10000;k++) {
    const p={}; for(const [key,[lo,hi]] of Object.entries(LIMITS)) p[key]=lo+(hi-lo)*rand();
    p.maturity=Math.floor(p.maturity); p.shock=Math.max(p.shock,-p.marketRate*100);
    const r=evaluate(p); assert.ok(Number.isFinite(r.debtGap)); assert.ok(Number.isFinite(r.priceChangePct));
  }
});

test('discounted coupon prices match an independent annuity formula', () => {
  for (const coupon of [0,3,10]) for (const rate of [0.1,4.5,5.5,15]) for (const years of [1,10,30,50]) {
    const y=rate/100, discount=(1+y)**(-years);
    close(bondPrice(coupon,rate,years),coupon*(1-discount)/y+100*discount,1e-8);
  }
  const annuity = y => 3*(1-(1+y)**(-10))/y+100*(1+y)**(-10);
  close(evaluate().priceChangePct,100*(annuity(.055)/annuity(.045)-1),1e-9);
});
test('constant-rate fiscal path matches closed-form compound accumulation', () => {
  for(const growth of [-3,0,2.5,8]) for(const primaryDeficit of [-5,0,10]) {
    const p={...DEFAULTS,growth,primaryDeficit,repricing:100};
    const r=evaluate(p);
    for(const [rows,rate] of [[r.reference,4.5],[r.stressed,5.5]]){
      const q=(1+rate/100)/(1+growth/100);
      for(let n=1;n<=HORIZON;n++)close(rows[n-1].debt,p.debt*q**n+primaryDeficit*(q**n-1)/(q-1),1e-8);
    }
  }
});
test('all admissible endpoint combinations stay finite and positive', () => {
  const keys=Object.keys(LIMITS);
  for(let mask=0;mask<2**keys.length;mask++){
    const p=Object.fromEntries(keys.map((key,k)=>[key,LIMITS[key][(mask>>k)&1]]));
    if(p.marketRate+p.shock/100<0){assert.throws(()=>evaluate(p),/SHOCKED_RATE/);continue;}
    const r=evaluate(p);
    for(const row of [...r.reference,...r.stressed])assert(row.debt>0&&Object.values(row).every(Number.isFinite));
    assert(r.priceBefore>0&&r.priceAfter>0);
  }
});
test('published illustrations retain units and independently recomputed magnitudes', () => {
  close(119.3/1.025+5,121.39024390243902);
  close(119.3-119.3/1.025,2.90975609756098);
  close(119.3*.015/1.015,1.763054187192118);
  close(100*.98-92*.95,10.6);
  assert.equal(evaluate().debtGap.toFixed(2),'2.77');
  assert.equal(evaluate().interestGap.toFixed(2),'0.81');
  for(const [years,before,after,loss] of [[10,'88.13','81.16','-7.91'],[30,'75.57','63.67','-15.75']]){
    const r=evaluate({...DEFAULTS,maturity:years});
    assert.equal(r.priceBefore.toFixed(2),before);assert.equal(r.priceAfter.toFixed(2),after);assert.equal(r.priceChangePct.toFixed(2),loss);
  }
});
