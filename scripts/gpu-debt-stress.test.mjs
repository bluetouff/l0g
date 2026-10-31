import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { GPU_DEBT_FIELDS, GPU_DEBT_DEFAULTS, GPU_DEBT_ASSUMPTIONS, calculateGpuDebt, parseGpuDebtInput, formatGpuDebtNumber, formatGpuDebtMoney } from '../src/lib/gpuDebtStress.mjs';
import { gpuDebtCopy, gpuDebtDisplay, bindGpuDebtStress } from '../src/lib/gpuDebtStressUi.mjs';
const model = (overrides = {}) => calculateGpuDebt({ ...GPU_DEBT_DEFAULTS, ...overrides });
const close = (actual, expected, tolerance = 1e-8) => assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} differs from ${expected}`);
test('fictional baseline agrees with independently recomputed decimal amounts', () => {
  const r = model();
  close(r.annualPayment, 75712.99288946348); assert.equal(r.billableHours, 52560); assert.equal(r.revenue, 210240); assert.equal(r.available, 125240);
  close(r.coverage, 1.6541414520866061); close(r.surplus, 49527.00711053652);
  close(r.threshold, 3.057705344167875); close(r.threshold135, 3.561882427716431); assert.equal(r.covered, true);
});
test('published rate and billed-hours shocks retain their correct annual cash shortfalls', () => {
  const first = model({price:'3'}), second = model({price:'3', utilization:'65'});
  assert.equal(first.revenue,157680); assert.equal(first.available,72680); close(first.surplus,-3032.99288946348); close(first.coverage,0.9599409193361109);
  assert.equal(second.revenue,136656); assert.equal(second.available,51656); close(second.surplus,-24056.99288946348); close(second.coverage,0.6822607062359128);
  assert.equal(first.covered,false); assert.equal(second.covered,false);
});
test('the annuity amortises principal and its discounted payments equal the original debt', () => {
  const {debt, annualRate, years} = GPU_DEBT_ASSUMPTIONS, {annualPayment} = model(); let balance = debt, presentValue = 0;
  for(let year=1;year<=years;year++){balance=balance*(1+annualRate)-annualPayment; presentValue+=annualPayment/(1+annualRate)**year;}
  close(balance,0,1e-7);close(presentValue,debt,1e-7);
});
test('minimum and maximum inputs remain finite and negative cash stays visible', () => {
  const low=model({price:'1',utilization:'20',costs:'150000'}), high=model({price:'8',utilization:'100',costs:'30000'});
  assert.equal(low.revenue,14016); assert.ok(low.available<0&&low.coverage<0&&low.surplus<0); assert.equal(low.covered,false);
  assert.equal(high.revenue,560640); assert.ok(high.coverage>1); assert.equal(high.covered,true);
  for(const r of [low,high]) for(const [key,value] of Object.entries(r)) if(key!=='covered') assert.ok(Number.isFinite(value));
});
test('strict input parsing accepts decimal points and commas and rejects malformed or out-of-range values', () => {
  assert.equal(parseGpuDebtInput('3,05','price'),3.05); assert.equal(parseGpuDebtInput('3.05','price'),3.05);
  const bad=['',' 4','4 ','4\n','4\r','+4','-4','1e0','0x4','NaN','Infinity','.5','4.','4.001','1,000','<svg>','1'.repeat(100000)];
  for(const field of GPU_DEBT_FIELDS) for(const raw of bad) assert.throws(()=>model({[field]:raw}),RangeError,`${field}: ${raw.slice(0,20)}`);
  for(const values of [{price:'0.99'},{price:'8.01'},{utilization:'19'},{utilization:'101'},{utilization:'75.0'},{costs:'29999'},{costs:'150001'},{costs:'85000.0'}]) assert.throws(()=>model(values),RangeError);
  for(const input of [null,[],42,{},Object.create(GPU_DEBT_DEFAULTS),{...GPU_DEBT_DEFAULTS,extra:'1'}]) assert.throws(()=>calculateGpuDebt(input),RangeError);
  assert.throws(()=>parseGpuDebtInput('4','__proto__'),RangeError); assert.throws(()=>parseGpuDebtInput(4,'price'),RangeError);
});
test('1200 scenarios preserve cash identities, threshold identities and directional responses', () => {
  for(let i=0;i<1200;i++) {
    const price=(100+(i*17)%701)/100, utilization=20+(i*7)%81, costs=30000+(i*101)%120001;
    const r=model({price:price.toFixed(2),utilization:String(utilization),costs:String(costs)});
    close(r.available+r.costs,r.revenue); close(r.surplus+r.annualPayment,r.available); close(r.coverage*r.annualPayment,r.available);
    close(r.threshold*r.billableHours-r.costs,r.annualPayment,1e-7);close(r.threshold135*r.billableHours-r.costs,1.35*r.annualPayment,1e-7);
    assert.equal(r.covered,r.surplus>=0);
    if(price<8) assert.ok(model({price:Math.min(8,price+.01).toFixed(2),utilization:String(utilization),costs:String(costs)}).coverage>r.coverage);
    if(utilization<100) assert.ok(model({price:price.toFixed(2),utilization:String(utilization+1),costs:String(costs)}).coverage>r.coverage);
    if(costs<150000) assert.ok(model({price:price.toFixed(2),utilization:String(utilization),costs:String(costs+1)}).coverage<r.coverage);
  }
});
test('native currency, signed shortfalls, coverage and thresholds retain their precision', () => {
  assert.equal(formatGpuDebtMoney(210240,'en'),'$210,240'); assert.equal(formatGpuDebtMoney(210240,'fr'),'210\u202f240\u00a0$');
  assert.equal(formatGpuDebtMoney(-3032.99288946348,'en'),'-$3,033'); assert.equal(formatGpuDebtMoney(49527.00711053652,'fr',0,true),'+49\u202f527\u00a0$');
  assert.equal(gpuDebtDisplay(model(),'coverage','en'),'1.65×'); assert.equal(gpuDebtDisplay(model(),'threshold','fr'),'3,06\u00a0$');
  for(const lang of ['fr','en']) {const copy=gpuDebtCopy(lang); assert.equal(copy.labels.length,3);assert.equal(copy.resultLabels.length,5);assert.ok(copy.limits&&copy.formula&&copy.rounding&&copy.nojs&&copy.privacy);}
  assert.throws(()=>gpuDebtCopy('de'),RangeError);assert.throws(()=>gpuDebtDisplay(model(),'constructor','en'),RangeError);
  for(const value of [NaN,Infinity,-Infinity,'4']) assert.throws(()=>formatGpuDebtNumber(value,'en'),RangeError);
  assert.throws(()=>formatGpuDebtNumber(4,'en',4),RangeError);assert.throws(()=>formatGpuDebtMoney(4,'de'),RangeError);assert.throws(()=>formatGpuDebtMoney(4,'en',0,1),RangeError);
});
function fixture(lang='en') {
  const node = extra => Object.assign({textContent:'',dataset:{},attributes:{},setAttribute(key,value){this.attributes[key]=String(value);}},extra);
  const fields=Object.fromEntries(GPU_DEBT_FIELDS.map(key=>[key,node({value:GPU_DEBT_DEFAULTS[key]})]));
  const handlers={}, form={elements:{namedItem:key=>fields[key]},addEventListener:(name,fn)=>{handlers[name]=fn;}}, fieldset={disabled:true}, error=node({hidden:true}),status=node({}),funding=node({dataset:{funding:'covered'}}),meter=node({value:0});
  const outputs=['coverage','revenue','available','surplus','threshold','threshold135'].map(key=>node({dataset:{gpuDebtOutput:key}}));
  const readouts=GPU_DEBT_FIELDS.map(key=>node({dataset:{gpuDebtReadout:key}}));
  const root={dataset:{lang},querySelector(selector){return ({form,fieldset,'[data-error]':error,'[data-status]':status,'[data-funding]':funding,meter})[selector];},querySelectorAll(selector){return selector==='[data-gpu-debt-output]'?outputs:readouts;}};
  const scope={querySelectorAll:()=>[root]};
  return {scope,fields,handlers,fieldset,error,status,funding,meter,outputs,readouts};
}
test('UI binds once, updates both languages, resets and prevents submission', () => {
  for(const lang of ['fr','en']) {
    const f=fixture(lang);bindGpuDebtStress(f.scope);assert.equal(f.fieldset.disabled,false);assert.equal(f.outputs[0].textContent,lang==='fr'?'1,65×':'1.65×');
    const listener=f.handlers.input;bindGpuDebtStress(f.scope);assert.equal(f.handlers.input,listener);
    f.fields.price.value='3';f.fields.utilization.value='65';f.handlers.input();assert.equal(f.outputs[0].textContent,lang==='fr'?'0,68×':'0.68×');assert.equal(f.funding.dataset.funding,'shortfall');
    assert.equal(f.fields.utilization.attributes['aria-valuetext'],'65 %');assert.equal(f.error.hidden,true);
    let prevented=false;f.handlers.submit({preventDefault(){prevented=true;}});assert.equal(prevented,true);
    f.handlers.reset({preventDefault(){}});assert.equal(f.fields.price.value,'4');assert.equal(f.fields.utilization.value,'75');assert.equal(f.fields.costs.value,'85000');assert.equal(f.funding.dataset.funding,'covered');
  }
});
test('malformed runtime fields or result attributes make every output unavailable and recover on correction', () => {
  const f=fixture();bindGpuDebtStress(f.scope);f.fields.price.value='Infinity';f.handlers.input();
  assert.equal(f.error.hidden,false);assert.ok(f.outputs.every(n=>n.textContent==='Unavailable'));assert.equal(f.meter.value,0);assert.equal(f.fields.price.attributes['aria-invalid'],'true');
  f.fields.price.value='4';f.handlers.input();assert.equal(f.error.hidden,true);assert.equal(f.outputs[0].textContent,'1.65×');
  f.outputs[1].dataset.gpuDebtOutput='__proto__';f.handlers.change();assert.ok(f.outputs.every(n=>n.textContent==='Unavailable'));
});
test('a negative model ratio remains negative in text and only the decorative meter is bounded', () => {
  const f=fixture();bindGpuDebtStress(f.scope);f.fields.price.value='1';f.fields.utilization.value='20';f.fields.costs.value='150000';f.handlers.input();
  assert.ok(f.outputs[0].textContent.startsWith('-'));assert.equal(f.meter.value,0);assert.equal(f.error.hidden,true);assert.equal(f.funding.dataset.funding,'shortfall');
});
test('progressive enhancement and local DOM operations preserve security and static readability', () => {
  const component=fs.readFileSync(new URL('../src/components/GpuDebtStress.astro',import.meta.url),'utf8');const ui=fs.readFileSync(new URL('../src/lib/gpuDebtStressUi.mjs',import.meta.url),'utf8');
  assert.match(component,/<fieldset disabled>/);assert.match(component,/<noscript>/);assert.match(component,/aria-live="polite"/);assert.match(component,/gpuDebtDisplay\(initial/);assert.match(component,/var\(--color-signal\)/);
  assert.doesNotMatch(component,/<script\s+is:inline|oninput=|onclick=|#[\da-f]{3,8}\b/iu);
  assert.doesNotMatch(ui,/innerHTML|insertAdjacentHTML|fetch\(|XMLHttpRequest|localStorage|sessionStorage|eval\(|new Function/);
});
