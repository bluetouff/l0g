import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {STELLANTIS_CASH_DEFAULTS,STELLANTIS_CASH_PRESETS,STELLANTIS_CASH_FIXED,STELLANTIS_CASH_RESULTS,parseStellantisQ4,calculateStellantisCash,formatStellantisCash,stellantisCashDisplay,stellantisCashEquation} from '../src/lib/stellantisCashModel.mjs';
import {stellantisCashCopy,bindStellantisCashCalculators} from '../src/lib/stellantisCashUi.mjs';
const scenario=q4=>calculateStellantisCash({q4});
test('published anchors and three illustrative reference points retain distinct meanings',()=>{
 assert.deepEqual(STELLANTIS_CASH_DEFAULTS,{q4:'0'});assert.deepEqual(STELLANTIS_CASH_FIXED,{nineMonths:-4930,priorYear:-4525,historicalQ4:2784});
 assert.deepEqual(STELLANTIS_CASH_PRESETS,['0.405','2.784','4.930']);
 assert.deepEqual(scenario('0'),{q4:0,annual:-4930,difference:-405,status:'worse'});
 assert.deepEqual(scenario('0.405'),{q4:405,annual:-4525,difference:0,status:'equalPrior'});
 assert.deepEqual(scenario('2.784'),{q4:2784,annual:-2146,difference:2379,status:'improvedNegative'});
 assert.deepEqual(scenario('4.930'),{q4:4930,annual:0,difference:4525,status:'breakEven'});
 assert.ok(Object.isFrozen(scenario('0')));assert.ok(Object.isFrozen(STELLANTIS_CASH_FIXED));
});
test('strict improvement, annual zero and annual positivity are separate boundary cases',()=>{
 for(const[raw,status]of[['0.404','worse'],['0.405','equalPrior'],['0.406','improvedNegative'],['4.929','improvedNegative'],['4.930','breakEven'],['4.931','positive']])assert.equal(scenario(raw).status,status);
 assert.equal(scenario('-8').annual,-12930);assert.equal(scenario('8.000').annual,3070);
 assert.equal(parseStellantisQ4('-0.000'),0);assert.equal(Object.is(parseStellantisQ4('-0'),-0),false);
});
test('all 16001 accepted one-million-euro increments match independent BigInt arithmetic exactly',()=>{
 let previous;
 for(let amount=-8000;amount<=8000;amount++){
  const absolute=Math.abs(amount),raw=(amount<0?'-':'')+Math.floor(absolute/1000)+'.'+String(absolute%1000).padStart(3,'0'),r=scenario(raw),n=BigInt(amount);
  assert.equal(r.q4,amount);assert.equal(BigInt(r.annual),n-4930n);assert.equal(BigInt(r.difference),n-405n);
  if(previous)assert.equal(r.annual-previous.annual,1);previous=r;
 }
});
test('decimal parsing rejects malformed, non-finite, overprecise and out-of-range input without rounding',()=>{
 for(const raw of['',' ',' 1','1 ','1\n','1\r\n','8.001','-8.001','9','-9','00','01','1.0000','1e0','0x1','1,5','NaN','Infinity','١','1'.repeat(100000),null,1,{},'<script>'])assert.throws(()=>parseStellantisQ4(raw),RangeError);
 for(const[raw,value]of[['+1',1000],['.5',500],['-.5',-500],['+.001',1],['0.001',1],['-0.001',-1],['1.01',1010],['2.784',2784],['4.93',4930],['-7.999',-7999]])assert.equal(parseStellantisQ4(raw),value);
 for(const raw of[null,1,[],{},Object.create(STELLANTIS_CASH_DEFAULTS),{q4:'0',extra:'1'},{q4:'0',[Symbol('hidden')]:'1'}])assert.throws(()=>calculateStellantisCash(raw),RangeError);
});
test('native formatting and equations expose three-decimal EUR-billion values and a labelled hypothetical zero',()=>{
 assert.equal(formatStellantisCash(-4930,'fr'),'-4,930');assert.equal(formatStellantisCash(2784,'en'),'2.784');
 assert.equal(stellantisCashEquation(scenario('-1.123'),'fr'),'−4,930 + (-1,123) = -6,053');
 assert.equal(stellantisCashEquation(scenario('4.930'),'en'),'−4.930 + (4.930) = 0.000');
 for(const lang of['fr','en']){const c=stellantisCashCopy(lang);assert.equal(c.presets.length,3);assert.equal(c.resultLabels.length,2);assert.match(c.initial,lang==='fr'?/hypothèse.*distinct/:/assumed.*separate/);assert.match(c.intro,lang==='fr'?/inconnu/:/unknown/);for(const key of STELLANTIS_CASH_RESULTS)assert.equal(stellantisCashDisplay(scenario('0'),key,lang),formatStellantisCash(scenario('0')[key],lang));}
 for(const value of[NaN,Infinity,1.1,'3',Number.MAX_SAFE_INTEGER+1])assert.throws(()=>formatStellantisCash(value,'en'),RangeError);
 assert.throws(()=>formatStellantisCash(1,'de'),RangeError);assert.throws(()=>stellantisCashCopy('de'),RangeError);assert.throws(()=>stellantisCashDisplay(scenario('0'),'constructor','fr'),RangeError);
});
const node=(extra={})=>Object.assign({textContent:'',dataset:{},attrs:{},setAttribute(k,v){this.attrs[k]=String(v);}},extra);
function fixture(lang='en'){
 const input=node({value:'0'}),handlers={},form={elements:{namedItem:key=>key==='q4'?input:null},addEventListener(key,cb){handlers[key]=cb;}},fieldset={disabled:true},error=node({hidden:true}),status=node(),scenario=node(),classification=node(),equation=node();
 const outputs=STELLANTIS_CASH_RESULTS.map(key=>node({dataset:{stellantisCashResult:key}})),presets=STELLANTIS_CASH_PRESETS.map(value=>node({dataset:{stellantisPreset:value},addEventListener(key,cb){this.handler=cb;}}));
 const root={dataset:{stellantisCashLang:lang},querySelector(selector){return({form,fieldset,'[data-error]':error,'[data-status]':status,'[data-scenario]':scenario,'[data-stellantis-cash-status]':classification,'[data-stellantis-cash-equation]':equation})[selector];},querySelectorAll(selector){return selector==='[data-stellantis-cash-result]'?outputs:presets;}};
 return{root,scope:{querySelectorAll:()=>[root]},input,handlers,form,fieldset,error,status,scenario,classification,equation,outputs,presets};
}
test('scoped progressive UI binds once, selects reference points and restores the explicit zero assumption',()=>{
 for(const lang of['fr','en']){
  const f=fixture(lang);bindStellantisCashCalculators(f.scope);assert.equal(f.fieldset.disabled,false);assert.equal(f.root.dataset.valid,'true');assert.equal(f.scenario.textContent,stellantisCashCopy(lang).initial);
  const handler=f.handlers.input;bindStellantisCashCalculators(f.scope);assert.equal(f.handlers.input,handler);
  for(const[i,raw]of STELLANTIS_CASH_PRESETS.entries()){f.presets[i].handler();assert.equal(f.input.value,raw);assert.deepEqual(f.outputs.map(x=>x.textContent),STELLANTIS_CASH_RESULTS.map(key=>stellantisCashDisplay(scenario(raw),key,lang)));assert.equal(f.classification.textContent,stellantisCashCopy(lang).statuses[scenario(raw).status]);}
  f.handlers.reset({preventDefault(){}});assert.equal(f.input.value,'0');assert.equal(f.scenario.textContent,stellantisCashCopy(lang).initial);assert.equal(f.error.hidden,true);
  let prevented=false;f.handlers.submit({preventDefault(){prevented=true;}});assert.equal(prevented,true);
 }
});
test('invalid input clears both values, equation, classification and previous scenario, then recovers',()=>{
 const f=fixture();bindStellantisCashCalculators(f.scope);
 for(const raw of['','8.001','1.0001','1e0','<script>']){
  f.input.value=raw;f.handlers.input();assert.equal(f.root.dataset.valid,'false');assert.equal(f.error.hidden,false);assert.equal(f.input.attrs['aria-invalid'],'true');
  for(const n of[...f.outputs,f.equation,f.classification,f.scenario])assert.equal(n.textContent,'Unavailable');
  f.input.value='4.930';f.handlers.change();assert.equal(f.error.hidden,true);assert.equal(f.root.dataset.valid,'true');assert.equal(f.outputs[0].textContent,'0.000');
 }
 f.presets[0].dataset.stellantisPreset='<script>';f.presets[0].handler();assert.equal(f.root.dataset.valid,'false');
});
test('multiple roots are isolated and incomplete or unsupported-language markup stays disabled',()=>{
 const a=fixture('fr'),b=fixture('en');bindStellantisCashCalculators({querySelectorAll:()=>[a.root,b.root]});a.input.value='8';a.handlers.input();assert.equal(a.outputs[0].textContent,'3,070');assert.equal(b.outputs[0].textContent,'-4.930');
 const missing=fixture();missing.outputs.pop();bindStellantisCashCalculators(missing.scope);assert.equal(missing.fieldset.disabled,true);assert.deepEqual(missing.handlers,{});
 const unknown=fixture('de');bindStellantisCashCalculators(unknown.scope);assert.equal(unknown.fieldset.disabled,true);
});
test('component preserves native SSR, controlled IDs, keyboard controls, sources and passive privacy boundaries',()=>{
 const c=fs.readFileSync(new URL('../src/components/StellantisCashCalculator.astro',import.meta.url),'utf8'),ui=fs.readFileSync(new URL('../src/lib/stellantisCashUi.mjs',import.meta.url),'utf8'),model=fs.readFileSync(new URL('../src/lib/stellantisCashModel.mjs',import.meta.url),'utf8');
 for(const pattern of[/<fieldset disabled>/,/stellantisCashDisplay\(initial/,/stellantisCashEquation\(initial/,/<noscript>/,/id = `stellantis-cash-\$\{lang\}`/,/aria-describedby=/,/role="status"/,/type="button" data-stellantis-preset=/,/var\(--color-signal\)/])assert.match(c,pattern);
 assert.doesNotMatch(c,/<script\s+is:inline|onclick=|oninput=|#[\da-f]{3,8}\b/iu);
 assert.doesNotMatch(ui,/innerHTML|outerHTML|insertAdjacentHTML|fetch\(|XMLHttpRequest|WebSocket|sendBeacon|localStorage|sessionStorage|document\.cookie|eval\(|new Function/);
 assert.doesNotMatch(model,/Math\.round|parseFloat|fetch\(/);
 for(const lang of['fr','en'])for(const value of Object.values(stellantisCashCopy(lang)).filter(v=>typeof v==='string'))assert.doesNotMatch(value,/—|deux horloges|two clocks/iu);
});
