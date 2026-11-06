import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';
import { isRiskSignalUnavailable } from '../src/config/risk-signals.ts';

const code = await readFile(new URL('../src/scripts/risk.js', import.meta.url), 'utf8');

test('cached debt remains labelled, expires in an open tab and recovers through static polling', async () => {
  let now = Date.parse('2026-10-10T18:00:00Z');
  const signal = { key: 'debt', value: 54, scale: 100, level: 'Elevated', tone: 'elevated',
    methodologyVersion: '2.0', validUntil: '2026-10-10T18:30:00Z', sourceStatus: 'ok',
    qualityStatus: 'degraded', cacheUsed: true, fallbackUsed: true, fallbackLayer: 'producer',
    sourceUpdatedAt: '2026-10-10T18:00:00Z' };
  const elements = Object.fromEntries(['value', 'level', 'fill', 'status'].map((name) => [name, { style: {}, textContent: '' }]));
  const tile = { dataset: {}, querySelector: (selector) => elements[selector.slice(6, -1)] };
  const timers = new Map();
  const listeners = new Map();
  let requests = 0;
  class Clock extends Date { static now() { return now; } }
  const document = { readyState: 'complete', hidden: false,
    querySelector: () => tile, getElementById: () => null,
    addEventListener: (name, fn) => listeners.set(name, fn) };
  vm.runInNewContext(code, { Date: Clock, document,
    fetch: async (url) => {
      assert.equal(url, '/risk.json');
      requests += 1;
      return { ok: true, json: async () => ({ indices: [{ ...signal }] }) };
    },
    window: { setTimeout: (fn) => fn(), setInterval: (fn, ms) => timers.set(ms, fn) },
  });
  const flush = () => new Promise((resolve) => setImmediate(resolve));
  await flush();
  assert.equal(elements.value.textContent, 54);
  assert.match(elements.status.textContent, /cache source validé/);
  assert.equal(requests, 1);
  now += 30 * 60_000;
  timers.get(60_000)();
  assert.equal(elements.level.textContent, 'INDISPONIBLE');
  assert.match(elements.status.textContent, /publication expirée/);
  assert.equal(requests, 1);
  document.hidden = true;
  timers.get(900_000)();
  assert.equal(requests, 1);
  signal.validUntil = '2026-10-10T19:00:00Z';
  signal.cacheUsed = false;
  signal.fallbackUsed = false;
  signal.fallbackLayer = null;
  signal.qualityStatus = 'nominal';
  document.hidden = false;
  listeners.get('visibilitychange')();
  await flush();
  assert.equal(requests, 2);
  assert.equal(elements.value.textContent, 54);
  assert.doesNotMatch(elements.status.textContent, /cache|expirée/);
});

test('static rendering rejects absent or expired debt deadlines without affecting other instruments', () => {
  const signal = { key: 'debt', methodologyVersion: '2.0', sourceStatus: 'ok' };
  assert.equal(isRiskSignalUnavailable(signal), true);
  assert.equal(isRiskSignalUnavailable({ ...signal, validUntil: '2020-01-01T00:00:00Z' }), true);
  assert.equal(isRiskSignalUnavailable({ ...signal, validUntil: new Date(Date.now() + 60_000).toISOString() }), false);
  assert.equal(isRiskSignalUnavailable({ ...signal, key: 'us' }), false);
});

function observatoryFixture({ signal = {}, initialDeadline = '2026-11-06T15:30:00Z', failure = false, extra = [] } = {}) {
  let now = Date.parse('2026-11-06T15:00:00Z');
  const current = { key:'debt', value:56, scale:100, level:'Élevé', tone:'elevated', methodologyVersion:'2.0',
    validUntil:'2026-11-06T15:30:00Z', sourcePublishedAt:'2026-11-06T14:59:00Z', observedAt:'2026-11-05T00:00:00Z', sourceStatus:'ok', ...signal };
  const node = () => ({textContent:'54',style:{},attributes:{},setAttribute(name,value){this.attributes[name]=value;},removeAttribute(name){delete this.attributes[name];},getAttribute(name){return this.attributes[name]??null;}});
  const nodes=Object.fromEntries(['value','level','fill','status','meter','source-date','observed-date','scale','axis-mid','axis-max'].map(name=>[name,node()]));
  nodes['source-date'].attributes.datetime='2026-11-06T14:45:00Z';
  nodes['observed-date'].attributes.datetime='2026-11-04T00:00:00Z';
  const tile={dataset:{methodologyVersion:'2.0',validUntil:initialDeadline},querySelector:selector=>nodes[selector.slice(6,-1)]};
  const miniValues=[node(),node()];
  const minis=miniValues.map(value=>({...node(),tagName:'A',dataset:{label:'Dette US'},querySelector:()=>value}));
  const timers=new Map(); const listeners=new Map(); const queries=[];
  let calls=0;
  class Clock extends Date {static now(){return now;}}
  const document={readyState:'complete',hidden:false,
    querySelector(selector){queries.push(selector);return selector==='[data-risk="debt"]'?tile:null;},
    querySelectorAll(selector){return selector==='[data-risk-mini="debt"]'?minis:[];},
    getElementById:()=>null,addEventListener:(name,fn)=>listeners.set(name,fn)};
  vm.runInNewContext(code,{Date:Clock,document,
    fetch:async(url)=>{assert.ok(['/risk.json','/debt-latest.json'].includes(url));calls++;if(failure)throw new Error('offline fixture');return {ok:true,json:async()=>url==='/risk.json'?{indices:[current,...extra]}:{signal:null}};},
    window:{setTimeout:fn=>fn(),setInterval:(fn,ms)=>timers.set(ms,fn)},
  });
  return {nodes,miniValues,tile,queries,timers,advance(ms){now+=ms;},calls:()=>calls};
}

const settle = async () => {await new Promise(resolve=>setImmediate(resolve));await new Promise(resolve=>setImmediate(resolve));};

test('observatory synchronizes all mini readings, accessible meter and distinct source/observation dates',async()=>{
  const view=observatoryFixture();await settle();
  assert.equal(view.nodes.value.textContent,56);
  assert.ok(view.miniValues.every(node=>node.textContent===56));
  assert.equal(view.nodes.meter.attributes['aria-valuenow'],'56');
  assert.equal(view.nodes.meter.attributes['aria-valuemax'],'100');
  assert.equal(view.nodes['source-date'].attributes.datetime,'2026-11-06T14:59:00Z');
  assert.equal(view.nodes['observed-date'].attributes.datetime,'2026-11-05T00:00:00Z');
  assert.match(view.nodes['source-date'].textContent,/2026/);
  assert.match(view.nodes['observed-date'].textContent,/05\/11\/2026/);
});

test('expired SSR debt is hidden before any response and while the network stays unavailable',async()=>{
  const expired=observatoryFixture({failure:true,initialDeadline:'2026-11-06T14:59:59Z'});
  assert.equal(expired.nodes.value.textContent,'—');
  assert.ok(expired.miniValues.every(node=>node.textContent==='—'));
  await settle();assert.match(expired.nodes.status.textContent,/publication expirée/);
  const later=observatoryFixture({failure:true});await settle();
  assert.equal(later.nodes.value.textContent,'54');
  const calls=later.calls();later.advance(30*60_000);later.timers.get(60_000)();
  assert.equal(later.nodes.value.textContent,'—');
  assert.equal(later.nodes.level.textContent,'INDISPONIBLE');
  assert.equal(later.nodes.meter.attributes.role,'img');
  assert.equal(later.calls(),calls,'expiry must not add provider requests');
});

test('invalid numeric values and fallbacks clear the meter and both mini readings',async()=>{
  for(const signal of [{value:null},{value:'56'},{value:NaN},{value:Infinity},{value:-1},{value:101},{scale:0},{sourceStatus:'fallback'},{fallbackLayer:'aggregator'},{timelinessStatus:'stale'}]){
    const view=observatoryFixture({signal});await settle();
    assert.equal(view.nodes.value.textContent,'—');
    assert.equal(view.nodes.level.textContent,'INDISPONIBLE');
    assert.equal(view.nodes.fill.style.width,'0%');
    assert.equal(view.nodes.meter.attributes['aria-valuenow'],undefined);
    assert.ok(view.miniValues.every(node=>node.textContent==='—'));
  }
});

test('unknown selector keys and invalid dates never become DOM selectors or plausible timestamps',async()=>{
  const view=observatoryFixture({signal:{sourcePublishedAt:1234,sourceUpdatedAt:null,observedAt:'invalid'},extra:[null,{key:'debt"] [data-value]',value:999}]});await settle();
  assert.ok(view.queries.every(selector=>selector==='[data-risk="debt"]'));
  assert.equal(view.nodes['source-date'].textContent,'Non datée');
  assert.equal(view.nodes['observed-date'].textContent,'Non datée');
  assert.equal(view.nodes['source-date'].attributes.datetime,undefined);
  assert.equal(view.nodes.value.textContent,56);
});

test('native scale stays consistent across the reading, axis and accessible meter',async()=>{
  const view=observatoryFixture({signal:{scale:200}});await settle();
  assert.equal(view.nodes.scale.textContent,'/200');
  assert.equal(view.nodes['axis-mid'].textContent,'100');
  assert.equal(view.nodes['axis-max'].textContent,'200');
  assert.equal(view.nodes.meter.attributes['aria-valuemax'],'200');
  assert.ok(Math.abs(parseFloat(view.nodes.fill.style.width)-28)<1e-9);
});
