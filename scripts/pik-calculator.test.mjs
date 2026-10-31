import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { PIK_FIELDS, PIK_DEFAULTS, PIK_LIMITS, calculatePik, parsePikInput, formatPikNumber } from '../src/lib/pikModel.mjs';
import { pikCopy, pikDisplay, bindPikCalculators } from '../src/lib/pikCalculatorUi.mjs';
const model = (overrides={}) => calculatePik({...PIK_DEFAULTS,...overrides});
const close=(a,b,tolerance=1e-8)=>assert.ok(Math.abs(a-b)<=tolerance,`${a} differs from ${b}`);
test('base and cash/mixed comparisons agree with independently recomputed decimal cash flows',()=>{
 const p=model(),c=model({cashShare:'100'}),m=model({cashShare:'50'});
 close(p.debt,140.4928);close(p.cashTotal,0);close(p.pikTotal,40.4928);close(p.capacity,120);close(p.gap,20.4928);close(p.requiredEbitda,35.1232);
 assert.deepEqual(p.annual.map(r=>r.opening),[100,112,125.44]);close(p.annual[2].interest,15.0528);
 close(c.debt,100);close(c.cashTotal,36);close(c.pikTotal,0);close(c.gap,0);
 close(m.debt,119.1016);close(m.cashTotal,19.1016);close(m.pikTotal,19.1016);close(m.gap,0);
 close(model({years:'4'}).debt,157.351936);close(model({years:'4'}).debt-p.debt,16.859136);
});
test('zero interest, fully cash coupons and zero exit EBITDA retain defined values',()=>{
 const z=model({rate:'0',ebitda:'0'});assert.equal(z.debt,100);assert.equal(z.cashTotal,0);assert.equal(z.pikTotal,0);assert.equal(z.capacity,0);assert.equal(z.gap,100);
 const h=model({principal:'100000',rate:'40',years:'10',cashShare:'0',ebitda:'0',multiple:'0.1'});
 close(h.debt,100000*1.4**10,1e-7);assert.ok(h.requiredEbitda>h.debt);assert.ok(Object.values(h).filter(v=>typeof v==='number').every(Number.isFinite));
 const covered=model({ebitda:'100000',multiple:'20'});assert.equal(covered.gap,0);
});
test('strict parsing rejects invalid values instead of normalising them to plausible scenarios',()=>{
 assert.equal(parsePikInput('12,5','rate'),12.5);assert.equal(parsePikInput('0.1','multiple'),.1);
 const bad=['',' 3','3 ','3\n','+3','-3','NaN','Infinity','1e2','0x10','.5','3.','3.01','1'.repeat(100000),'<script>'];
 for(const field of PIK_FIELDS)for(const raw of bad)assert.throws(()=>model({[field]:raw}),RangeError);
 for(const [field,[min,max]] of Object.entries(PIK_LIMITS)){assert.throws(()=>model({[field]:String(min-.1)}),RangeError);assert.throws(()=>model({[field]:String(max+.1)}),RangeError);}
 for(const field of ['years','cashShare'])assert.throws(()=>model({[field]:'3.1'}),RangeError);
 for(const input of [null,[],42,{},Object.create(PIK_DEFAULTS),{...PIK_DEFAULTS,extra:'1'}])assert.throws(()=>calculatePik(input),RangeError);
 assert.throws(()=>parsePikInput('1','constructor'),RangeError);assert.throws(()=>parsePikInput(1,'rate'),RangeError);
});
test('2000 scenarios preserve cash identities, promised annual returns and directional responses',()=>{
 for(let i=0;i<2000;i++){
  const principal=(1+(i*37)%999999)/10,rate=((i*13)%401)/10,years=1+i%10,cashShare=(i*7)%101,ebitda=((i*101)%1000000)/10,multiple=(1+(i*17)%200)/10;
  const raw={principal:principal.toFixed(1),rate:rate.toFixed(1),years:String(years),cashShare:String(cashShare),ebitda:ebitda.toFixed(1),multiple:multiple.toFixed(1)};const r=calculatePik(raw);
  close(r.debt-principal,r.pikTotal,1e-7);close(r.capacity,ebitda*multiple);close(r.requiredEbitda*multiple,r.debt,1e-7);close(r.gap,Math.max(0,r.debt-r.capacity));
  let pv=0;for(const row of r.annual){close(row.interest,row.cash+row.pik,1e-7);close(row.debt,row.opening+row.pik,1e-7);pv+=(row.cash+(row.year===years?r.debt:0))/(1+rate/100)**row.year;}
  close(pv,principal,1e-6);
  if(cashShare<100&&rate>0)assert.ok(calculatePik({...raw,cashShare:String(cashShare+1)}).debt<r.debt);
  if(rate<40&&cashShare<100)assert.ok(calculatePik({...raw,rate:(rate+.1).toFixed(1)}).debt>r.debt);
 }
});
test('formats and copy are native, finite, bounded and describe assumptions explicitly',()=>{
 assert.equal(formatPikNumber(140.4928,'fr'),'140,49');assert.equal(formatPikNumber(140.4928,'en'),'140.49');
 for(const lang of ['fr','en']){const c=pikCopy(lang);assert.equal(c.labels.length,6);assert.equal(c.resultLabels.length,4);assert.equal(c.columns.length,5);assert.ok(c.limits&&c.formula&&c.rounding&&c.privacy&&c.nojs);assert.equal(pikDisplay(model(),'gap',lang),lang==='fr'?'20,49':'20.49');}
 for(const v of [NaN,Infinity,-Infinity,'3'])assert.throws(()=>formatPikNumber(v,'fr'),RangeError);
 assert.throws(()=>formatPikNumber(3,'de'),RangeError);assert.throws(()=>formatPikNumber(3,'fr',3),RangeError);assert.throws(()=>pikCopy('de'),RangeError);assert.throws(()=>pikDisplay(model(),'__proto__','en'),RangeError);
});
function node(extra={}){return Object.assign({textContent:'',dataset:{},attrs:{},children:[],setAttribute(k,v){this.attrs[k]=String(v);},appendChild(n){this.children.push(n);},replaceChildren(...ns){this.children=ns;}},extra);}
function fixture(lang='en'){
 const fields=Object.fromEntries(PIK_FIELDS.map(k=>[k,node({value:PIK_DEFAULTS[k]})]));const handlers={},form={elements:{namedItem:k=>fields[k]},addEventListener(k,f){handlers[k]=f;}},fieldset={disabled:true},error=node({hidden:true}),status=node(),tbody=node();
 const outputs=['debt','cashTotal','gap','requiredEbitda'].map(k=>node({dataset:{pikResult:k}}));
 const root={dataset:{pikLang:lang},querySelector(s){return({form,fieldset,'[data-error]':error,'[data-status]':status,tbody})[s];},querySelectorAll:()=>outputs};
 return{root,scope:{querySelectorAll:()=>[root]},fields,handlers,fieldset,error,status,tbody,outputs};
}
function withDom(fn){const previous=globalThis.document;globalThis.document={createElement:()=>node()};try{fn();}finally{if(previous===undefined)delete globalThis.document;else globalThis.document=previous;}}
test('UI binds once, performs native recalculation, updates annual rows, resets and prevents submits',()=>withDom(()=>{
 for(const lang of ['fr','en']){const f=fixture(lang);bindPikCalculators(f.scope);assert.equal(f.fieldset.disabled,false);assert.equal(f.outputs[0].textContent,lang==='fr'?'140,49':'140.49');assert.equal(f.tbody.children.length,3);const handler=f.handlers.input;bindPikCalculators(f.scope);assert.equal(f.handlers.input,handler);
 f.fields.cashShare.value='100';f.handlers.input();assert.equal(f.outputs[0].textContent,lang==='fr'?'100,00':'100.00');assert.equal(f.outputs[1].textContent,lang==='fr'?'36,00':'36.00');assert.equal(f.root.dataset.valid,'true');
 let prevented=false;f.handlers.submit({preventDefault(){prevented=true;}});assert.equal(prevented,true);f.handlers.reset({preventDefault(){}});assert.equal(f.fields.cashShare.value,'0');assert.equal(f.error.hidden,true);assert.equal(f.tbody.children[0].children[0].attrs.scope,'row');}
}));
test('invalid input or mutated result attributes clear every output and annual row, then recover',()=>withDom(()=>{
 const f=fixture();bindPikCalculators(f.scope);f.fields.years.value='3.1';f.handlers.input();assert.equal(f.root.dataset.valid,'false');assert.equal(f.error.hidden,false);assert.ok(f.outputs.every(n=>n.textContent==='Unavailable'));assert.equal(f.tbody.children.length,0);assert.ok(Object.values(f.fields).every(n=>n.attrs['aria-invalid']==='true'));
 f.fields.years.value='3';f.handlers.change();assert.equal(f.error.hidden,true);assert.equal(f.tbody.children.length,3);f.outputs[0].dataset.pikResult='constructor';f.handlers.input();assert.ok(f.outputs.every(n=>n.textContent==='Unavailable'));assert.equal(f.tbody.children.length,0);
}));
test('progressive enhancement retains SSR results, controlled DOM output and the existing theme',()=>{
 const component=fs.readFileSync(new URL('../src/components/PikCalculator.astro',import.meta.url),'utf8'),ui=fs.readFileSync(new URL('../src/lib/pikCalculatorUi.mjs',import.meta.url),'utf8');
 assert.match(component,/<fieldset disabled>/);assert.match(component,/pikDisplay\(initial/);assert.match(component,/initial.annual.map/);assert.match(component,/<noscript>/);assert.match(component,/var\(--color-signal\)/);
 assert.doesNotMatch(component,/<script\s+is:inline|oninput=|onclick=|#[\da-f]{3,8}\b/iu);assert.doesNotMatch(ui,/innerHTML|insertAdjacentHTML|fetch\(|XMLHttpRequest|localStorage|sessionStorage|eval\(|new Function/);
});
