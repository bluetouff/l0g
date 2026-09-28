import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateRepoStress as calc, DEFAULT_REPO_INPUT as d, validateRepoInput } from '../src/lib/repo-stress.mjs';
const near=(actual,expected,eps=1e-9)=>assert.ok(Math.abs(actual-expected)<=eps,`${actual} != ${expected}`);

test('default: €4.9m credit reduction, €3.9m gap, €78m sales',()=>{
 const r=calc(d);
 for(const [k,v] of Object.entries({debtBefore:98,valueAfter:98,loanCapacity:93.1,liquidityCall:4.9,cashUsed:1,gap:3.9,sale:78,remainingCollateral:20,remainingDebt:19,priceLoss:2,priceContribution:1.96,haircutContribution:2.94,uncoveredDebt:0,positionLeverage:50}))near(r[k],v);
 assert.equal(r.feasible,true);near(r.saleShare,78/98);
});
test('haircut alone can force sales without a price loss',()=>{const r=calc({...d,priceFall:0});near(r.liquidityCall,3);near(r.gap,2);near(r.sale,40);near(r.priceLoss,0);});
test('€5m buffer covers the requirement',()=>{const r=calc({...d,cashBuffer:5});near(r.sale,0);near(r.cashUsed,4.9);near(r.unusedCash,.1);});
test('no shock leaves the balance sheet unchanged',()=>{const r=calc({...d,priceFall:0,haircutAfter:2});near(r.liquidityCall,0);near(r.sale,0);near(r.cashUsed,0);});
test('same haircut does not remove the collateral-price margin call',()=>{const r=calc({...d,haircutAfter:2});near(r.liquidityCall,1.96);near(r.sale,48);});
test('full liquidation reports residual debt, never an impossible sale',()=>{const r=calc({...d,priceFall:10,cashBuffer:0});assert.equal(r.feasible,false);near(r.requiredSale,250);near(r.sale,90);near(r.remainingCollateral,0);near(r.uncoveredDebt,8);near(r.saleShare,1);});
test('price loss equal to initial equity: full liquidation without a deficit',()=>{const r=calc({...d,cashBuffer:0});assert.equal(r.feasible,true);near(r.sale,98);near(r.remainingDebt,0);near(r.uncoveredDebt,0);});
test('position and cash scale proportionally',()=>{const a=calc(d),b=calc({...d,position:1000,cashBuffer:10});near(b.sale,a.sale*10,1e-8);near(b.saleShare,a.saleShare);});
test('increasing cash cannot increase required sales',()=>{let prev=Infinity;for(let b=0;b<=10;b+=.1){const r=calc({...d,cashBuffer:b});assert.ok(r.requiredSale<=prev+1e-9);prev=r.requiredSale;}});
test('input and result are not mutated and result is immutable',()=>{const input={...d};const before=JSON.stringify(input);const r=calc(input);assert.equal(JSON.stringify(input),before);assert.ok(Object.isFrozen(r));});
test('invalid types, missing, non-finite and hostile strings are rejected',()=>{
 assert.throws(()=>calc(Object.create(d)), /Missing/);
 for(const bad of [null,undefined,[],1,'',true])assert.throws(()=>validateRepoInput(bad));
 for(const k of Object.keys(d))for(const bad of [undefined,null,NaN,Infinity,-Infinity,'1','<img src=x onerror=alert(1)>',{},[]])assert.throws(()=>calc({...d,[k]:bad}));
});
test('numeric bounds and cross-field restrictions are enforced',()=>{
 for(const obj of [{position:0},{position:10001},{haircutBefore:0},{haircutBefore:21},{haircutAfter:41},{haircutAfter:1},{priceFall:-1},{priceFall:11},{cashBuffer:-1},{cashBuffer:101}])assert.throws(()=>calc({...d,...obj}));
});
test('allowed boundaries do not produce NaN or Infinity',()=>{
 for(const position of [1,10000])for(const h0 of [1,20])for(const h1 of [h0,40])for(const priceFall of [0,10])for(const cashBuffer of [0,position]){
  const r=calc({position,haircutBefore:h0,haircutAfter:h1,priceFall,cashBuffer});for(const v of Object.values(r))if(typeof v==='number')assert.ok(Number.isFinite(v));
 }
});
test('10,000 deterministic cases: accounting, call decomposition, financing constraint',()=>{
 let seed=246813579;const rng=()=>{seed=(1664525*seed+1013904223)>>>0;return seed/4294967296};
 for(let i=0;i<10000;i++){
  const position=1+rng()*9999,h0=1+rng()*19,h1=h0+rng()*(40-h0);
  const r=calc({position,haircutBefore:h0,haircutAfter:h1,priceFall:rng()*10,cashBuffer:rng()*position});
  const tol=1e-7*position;
  near(r.priceContribution+r.haircutContribution,r.liquidityCall,tol);
  near(r.sale+r.remainingCollateral,r.valueAfter,tol);
  near(r.cashUsed+r.unusedCash,r.cashBuffer,tol);
  assert.ok(r.sale>=0 && r.sale<=r.valueAfter+tol);
  assert.ok(r.remainingDebt>=0 && r.remainingCollateral>=0);
  if(r.feasible){assert.ok(r.remainingDebt<=(1-h1/100)*r.remainingCollateral+tol);near(r.uncoveredDebt,0,tol);}
  else {near(r.sale,r.valueAfter,tol);assert.ok(r.uncoveredDebt>0);}
 }
});
test('€3m available cash reduces sales to €38m; not a full hedge model',()=>{const r=calc({...d,cashBuffer:3});near(r.sale,38);near(r.gap,1.9);});
