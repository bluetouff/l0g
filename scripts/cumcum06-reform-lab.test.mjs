import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { CUMCUM_REFORM_DEFAULTS as defaults, CUMCUM_REFORM_PRESETS as presets, calculateCumCumReform as calculate, parseCumCumAmount as parse } from '../src/lib/cumCumReformLab.mjs';
import { bindCumCumReformLabs, CUMCUM_REFORM_OUTPUTS as keys, cumCumLabOutputText, formatCumCumLabValue } from '../src/lib/cumCumReformLabUi.mjs';
const scaled = s => BigInt(s.replace('.', ''));
test('Default fictional scenario separates base and yield exactly', () => {
  const r = calculate(defaults);
  assert.deepEqual(Object.fromEntries(keys.map(k => [k, r[k]])), { y0:'12.00',y1:'10.00',delta:'30.00',points:'-2.00',base:'60.00',rate:'-30.00',sum:'30.00',growth:'25.00' });
});
test('All three archive presets preserve their economic interpretation', () => {
  const constant=calculate(presets[1]), higher=calculate(presets[2]);
  assert.equal(constant.y0,constant.y1);assert.equal(constant.rate,'0.00');assert.equal(constant.base,'24.00');
  assert.equal(higher.base,'24.00');assert.equal(higher.rate,'24.00');assert.equal(higher.growth,'40.00');
});
test('Strict inputs accept decimal comma and boundaries, rejecting malformed/oversized/nonfinite values', () => {
  assert.equal(parse('0,01'),1n);assert.equal(parse('1000000.00'),100000000n);assert.equal(parse('0'),0n);
  for(const v of ['', ' ', ' 1', '1 ', '-0','-1','+1','1e3','1E3','NaN','Infinity','1 000','1,000.00','1.000,00','0.001','.5','1.','1000000.01','1000001','00000000001','1'.repeat(10000),NaN,Infinity,1,null,undefined]) assert.throws(()=>parse(v),RangeError,String(v));
  for(const p of [{...defaults,d0:'0'},{...defaults,d1:'0.00'},{...defaults,n0:'1000.01'},{...defaults,n1:'1500.01'},null,[],{...defaults,extra:'1'}]) assert.throws(()=>calculate(p),RangeError);
});
test('Zero initial receipts leave growth unavailable, while every other result is valid', () => {
  const r=calculate({...defaults,n0:'0',n1:'0'});assert.equal(r.growth,null);for(const k of keys.filter(k=>k!=='growth'))assert.match(r[k],/^-?\d+\.\d{2}$/);
  assert.equal(calculate({...defaults,n0:'0',n1:'1'}).growth,null);
});
test('Exact rational and displayed decomposition survives inputs with products above 2^53', () => {
  const cases=[{d0:'999999.99',n0:'999999.98',d1:'1000000.00',n1:'0.01'},{d0:'0.01',n0:'0.01',d1:'1000000',n1:'1000000'}];
  for(let i=1;i<=150;i++)cases.push({d0:String(i*17),n0:`${i%17}.01`,d1:String(i*31),n1:`${i%31}.02`});
  for(const input of cases){const r=calculate(input),e=r.exact;assert.equal(BigInt(e.baseNumerator)+BigInt(e.yieldNumerator),BigInt(e.deltaCents)*BigInt(e.denominator));assert.equal(scaled(r.base)+scaled(r.rate),scaled(r.delta));assert.equal(r.sum,r.delta);for(const k of keys)if(r[k]!==null){assert.match(r[k],/^-?\d+\.\d{2}$/);assert.notEqual(r[k],'-0.00');}}
});
test('Formatting keeps two decimals, local units and normalises a rounded negative zero', () => {
  assert.equal(formatCumCumLabValue('-0.00','fr',true),'0,00');assert.equal(cumCumLabOutputText('rate','-30.00','en'),'−30.00 €m');assert.equal(cumCumLabOutputText('base','60.00','fr'),'+60,00 M€');assert.match(cumCumLabOutputText('growth',null,'en'),/initial receipts are zero/);
});
function fixture(lang='en'){
  const element=()=>({value:'',disabled:true,hidden:false,textContent:'',dataset:{},attrs:{},events:{},setAttribute(k,v){this.attrs[k]=v;},addEventListener(k,f){(this.events[k]??=[]).push(f);},fire(k){for(const f of this.events[k]??[])f({preventDefault(){}});}});
  const fields=Object.fromEntries(Object.entries(defaults).map(([k,v])=>[k,Object.assign(element(),{value:v})]));
  const form=element();form.elements={namedItem:k=>fields[k]};const fieldset=element(),error=element(),status=element();
  const outputs=Object.fromEntries(keys.map(k=>[k,element()])),buttons=presets.map(()=>element());
  const root={dataset:{lang},querySelector(s){return s==='form'?form:s==='fieldset'?fieldset:s==='[data-error]'?error:s==='[data-status]'?status:outputs[/^\[data-output="([^"]+)"\]$/.exec(s)?.[1]];},querySelectorAll(s){return s==='[data-preset]'?buttons:[];}};
  return {scope:{querySelectorAll:()=>[root]},root,fields,form,fieldset,error,status,outputs,buttons};
}
test('Progressive binder enables controls once and fails closed after any invalid edit',()=>{
  const f=fixture();bindCumCumReformLabs(f.scope);bindCumCumReformLabs(f.scope);
  assert.equal(f.fieldset.disabled,false);assert.equal(f.form.events.input.length,1);assert.equal(f.outputs.delta.textContent,'+30.00 €m');
  f.fields.n1.value='99999999';f.form.fire('input');assert.equal(f.error.hidden,false);for(const output of Object.values(f.outputs))assert.equal(output.textContent,'Unavailable');assert.match(f.status.textContent,/Invalid scenario/);
  f.buttons[1].fire('click');assert.equal(f.outputs.rate.textContent,'0.00 €m');assert.equal(f.error.hidden,true);
  f.fields.n0.value='0';f.form.fire('input');assert.match(f.outputs.growth.textContent,/initial receipts are zero/);assert.notEqual(f.outputs.delta.textContent,'Unavailable');
  f.form.fire('reset');assert.equal(f.outputs.delta.textContent,'+30.00 €m');
});
test('French client output is native; incomplete markup remains safely disabled',()=>{
  const f=fixture('fr');bindCumCumReformLabs(f.scope);assert.equal(f.outputs.y0.textContent,'12,00 %');
  const broken=fixture();broken.fields.n0=null;bindCumCumReformLabs(broken.scope);assert.equal(broken.fieldset.disabled,true);
});
test('Static Astro has useful defaults, native labels, disabled controls and a bundled CSP-compatible script',()=>{
  const source=readFileSync(new URL('../src/components/CumCumReformLab.astro',import.meta.url),'utf8');
  assert.match(source,/<details class="reform-lab-controls"><summary>\{copy.controlsTitle\}<\/summary>/);assert.doesNotMatch(source,/<details[^>]*\bopen(?:\s|=|>)/);assert.ok(source.indexOf('<details class="reform-lab-controls">')<source.indexOf('data-preset'));assert.ok(source.indexOf('data-output={key}')<source.lastIndexOf('</details>'));
  assert.match(source,/calculateCumCumReform\(CUMCUM_REFORM_DEFAULTS\)/);assert.match(source,/<fieldset disabled>/);assert.match(source,/<button[^>]+data-preset[^>]+disabled>/);assert.match(source,/<label for=/);assert.match(source,/<noscript>/);assert.match(source,/aria-live="polite"/);assert.match(source,/<script>import '\.\.\/lib\/cumCumReformLabUi\.mjs';<\/script>/);
  const client=readFileSync(new URL('../src/lib/cumCumReformLabUi.mjs',import.meta.url),'utf8');
  assert.doesNotMatch(source+client,/innerHTML|outerHTML|insertAdjacentHTML|fetch\(|XMLHttpRequest|localStorage|sessionStorage|is:inline|set:html/);
});
