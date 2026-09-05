import assert from 'node:assert/strict';
import {test} from 'node:test';
import {calculate,PRESETS,LIMITS} from '../src/lib/asia-dollar-stress.mjs';
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-9,`${a} != ${b}`);
test('published worked example reconciles price, FX, hedge and cash',()=>{
  const r=calculate();
  close(r.usdBond,91.2);close(r.localBond,82.08);close(r.hedgePnl,7);close(r.pnl,-10.92);
  close(r.usableGain,1.75);close(r.gap,3.25);close(r.saleFairValue,3.25/.98);close(r.saleLoss,3.25/.98-3.25);
  close(r.dueUsd,28);close(r.noRollUsd,7);
});
test('strong dollar improves asset outcome but increases collateral outflow',()=>{
  const r=calculate(PRESETS.dollarUp);close(r.pnl,-6.68);close(r.fxPayment,7);close(r.gap,12);
  assert.ok(r.pnl>calculate().pnl);assert.ok(r.gap>calculate().gap);
});
test('full initial-principal FX hedge cancels a pure spot shock in both directions',()=>{
  for(const fx of [-20,-10,0,10,20]) close(calculate({fx,hedge:100,rate:0,spread:0}).pnl,0);
});
test('fixed notional leaves FX exposure on the bond price change',()=>{
  close(calculate({hedge:100}).pnl,-7.92);
});
test('liquidity timing cannot change market P&L',()=>{
  const r=calculate({available:0});close(r.pnl,calculate().pnl);close(r.gap,5);
  close(calculate({available:100}).gap,0);
});
test('redemptions and collateral are not deducted a second time from market P&L',()=>{
  const r=calculate({outflow:30,otherMargin:20});close(r.pnl,calculate().pnl);
  const a=calculate({discount:0});close(a.saleLoss,0);close(a.saleProceeds,a.gap);
});
test('notional that cannot roll is shown separately, never treated as loss or net cash',()=>{
  const a=calculate({noRoll:100,maturity:100}),b=calculate({noRoll:0,maturity:0});
  close(a.noRollUsd,70);close(a.pnl,b.pnl);close(a.gap,b.gap);
});
test('sale capacity is finite and residual shortfall remains visible',()=>{
  const r=calculate({fx:20,hedge:100,cash:0,outflow:30,otherMargin:20,rate:150,spread:300,discount:10});
  assert.ok(r.saleFairValue<=r.localBond);close(r.gap,r.saleProceeds+r.remainingGap);
});
test('stress domain is finite, sign-safe and arithmetically reconciled',()=>{
  for(const fx of [-20,0,20])for(const rate of [-150,0,150])for(const hedge of [0,50,100]){
    const r=calculate({fx,rate,hedge,spread:300});
    assert.ok(Object.values(r).every(Number.isFinite));
    close(r.pnl,r.rateEffect+r.creditEffect+r.fxEffect+r.hedgePnl);
    assert.ok(r.usableGain*r.fxPayment===0);assert.ok(r.gap>=0);assert.ok(r.saleLoss>=0);
  }
});
test('invalid inputs are rejected instead of silently producing a plausible output',()=>{
  for(const value of [NaN,Infinity,'10',-21,21]) assert.throws(()=>calculate({fx:value}),RangeError);
  for(const [key,[lo,hi]] of Object.entries(LIMITS)) {assert.throws(()=>calculate({[key]:lo-1}));assert.throws(()=>calculate({[key]:hi+1}));}
});
