import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { PARCEL_FEE_FIELDS, PARCEL_FEE_DEFAULTS, PARCEL_FEE_UNIT as E, calculateParcelFee, parseParcelFeeQuantity, formatParcelFeeMoney } from '../src/lib/parcelFeeCalculator.mjs';
import { parcelFeeCopy } from '../src/lib/parcelFeeCalculatorUi.mjs';
const model = (overrides = {}) => calculateParcelFee({ ...PARCEL_FEE_DEFAULTS, ...overrides });
test('fictional baseline isolates the new four-euro fee and yields 26.40 including VAT', () => {
  const r = model();
  assert.equal(r.initialExVat,20n*E); assert.equal(r.initialInclVat,24n*E); assert.equal(r.fee,4n*E);
  assert.equal(r.passed,2n*E); assert.equal(r.absorbed,2n*E); assert.equal(r.additionalVat,40n*E/100n);
  assert.equal(r.customerIncrease,240n*E/100n); assert.equal(r.finalInclVat,2640n*E/100n);
});
test('zero, half and full pass-through preserve the starting price and public fee', () => {
  for (const [passThrough, final, absorbed] of [['0',2400n,400n],['50',2640n,200n],['100',2880n,0n]]) {
    const r=model({passThrough});assert.equal(r.finalInclVat,final*E/100n);assert.equal(r.absorbed,absorbed*E/100n);assert.equal(r.fee,4n*E);
  }
});
test('zero lines and zero VAT have explicit outcomes, including maximal assumptions', () => {
  const zero=model({lines:'0'});assert.equal(zero.fee,0n);assert.equal(zero.finalInclVat,zero.initialInclVat);
  const noVat=model({vat:'0',passThrough:'100'});assert.equal(noVat.finalInclVat,24n*E);assert.equal(noVat.additionalVat,0n);
  const max=model({price:'100000',lines:'1000',passThrough:'100',vat:'30'});assert.equal(max.initialInclVat,130000n*E);assert.equal(max.finalInclVat,132600n*E);assert.equal(max.fee,2000n*E);
});
test('decimal points and commas retain exact fractional pass-through and VAT', () => {
  assert.equal(parseParcelFeeQuantity('1,25','price'),125n);assert.equal(parseParcelFeeQuantity('0002','lines'),2n);
  const r=model({price:'1.01',lines:'1',passThrough:'0,01',vat:'0.01'});
  assert.equal(r.passed,20000n);assert.equal(r.additionalVat,2n);assert.equal(r.customerIncrease,20002n);assert.equal(r.initialInclVat,101010100n);
});
test('invalid syntax, unsupported fields and range failures reject rather than clamp', () => {
  for (const raw of ['', ' 2','2 ','-1','+2','1e2','0x10','Infinity','NaN','1,000.00','1.234','1/2','<script>']) assert.throws(()=>parseParcelFeeQuantity(raw,'price'));
  for (const raw of ['1.0','1,0','1001','-1','1e2']) assert.throws(()=>parseParcelFeeQuantity(raw,'lines'));
  for (const [key,raw] of [['price','0'],['price','100000.01'],['vat','30.01'],['passThrough','100.01']]) assert.throws(()=>model({[key]:raw}));
  assert.throws(()=>parseParcelFeeQuantity('2','__proto__'));assert.throws(()=>parseParcelFeeQuantity(2,'lines'));
});
test('all four own string fields are required without extra or inherited model values', () => {
  for (const value of [null,[],1,'20',{}, {...PARCEL_FEE_DEFAULTS,extra:'1'}, Object.create(PARCEL_FEE_DEFAULTS)]) assert.throws(()=>calculateParcelFee(value));
  for(const key of PARCEL_FEE_FIELDS){const x={...PARCEL_FEE_DEFAULTS};delete x[key];assert.throws(()=>calculateParcelFee(x));assert.throws(()=>model({[key]:2}));}
});
test('money rounds only for display and formats native currency separators', () => {
  assert.equal(formatParcelFeeMoney(499999n,'en'),'€0.00');assert.equal(formatParcelFeeMoney(500000n,'en'),'€0.01');
  assert.equal(formatParcelFeeMoney(132600n*E,'en'),'€132,600.00');assert.equal(formatParcelFeeMoney(2640n*E/100n,'fr'),'26,40\u00a0€');
  assert.throws(()=>formatParcelFeeMoney(-1n,'en'));assert.throws(()=>formatParcelFeeMoney(0n,'de'));assert.throws(()=>formatParcelFeeMoney(1,'fr'));
});
test('one thousand fractional scenarios conserve the fee and exactly reproduce direct price calculation', () => {
  for(let i=0;i<1000;i++){
    const price=100+(i*379)%9999901,lines=(i*19)%1001,share=(i*53)%10001,vat=(i*7)%3001;
    const decimal=n=>`${Math.floor(n/100)}.${String(n%100).padStart(2,'0')}`;
    const r=model({price:decimal(price),lines:String(lines),passThrough:decimal(share),vat:decimal(vat)});
    const direct=(BigInt(price)*100n+2n*BigInt(lines)*BigInt(share))*BigInt(10000+vat);
    assert.equal(r.finalInclVat,direct);assert.equal(r.fee,r.passed+r.absorbed);assert.equal(r.finalInclVat-r.initialInclVat,r.customerIncrease);assert.ok(r.absorbed>=0n&&r.passed>=0n);
  }
});
test('only the November two-euro amount is added, and more assumed lines are monotone', () => {
  assert.equal(model({lines:'1',passThrough:'100'}).customerIncrease,240n*E/100n);
  for(let lines=1;lines<=100;lines++){const a=model({lines:String(lines)}),b=model({lines:String(lines-1)});assert.ok(a.finalInclVat>=b.finalInclVat);assert.equal(a.fee-b.fee,2n*E);}
});
test('bilingual controls and passive client binding retain fictional scope and invalid clearing', () => {
  for(const lang of ['fr','en']){const c=parcelFeeCopy(lang);assert.equal(c.fields.length,4);assert.equal(c.labels.length,7);assert.equal(c.presetLabels.length,3);assert.ok(c.tax.includes('IOSS'));assert.match(c.scope,/3/);assert.ok(!JSON.stringify(c).includes('—'));}
  assert.throws(()=>parcelFeeCopy('de'));
  const ui=readFileSync(new URL('../src/lib/parcelFeeCalculatorUi.mjs',import.meta.url),'utf8');
  assert.doesNotMatch(ui,/\b(?:fetch|eval)\s*\(|innerHTML|localStorage|sessionStorage|XMLHttpRequest|document\.cookie/);
  assert.match(ui,/output\.textContent = copy\.unavailable/);assert.match(ui,/event\.preventDefault\(\)/);
});
