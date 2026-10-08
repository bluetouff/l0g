import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
const require=createRequire(resolve('package.json'));
const {XMLParser,XMLValidator}=require('fast-xml-parser');
const postcss=require('postcss');
// These maintained-parser signatures freeze the supplied, original drawings.
// Only semantic paints, a known ID prefix and responsive root style are excluded.
const frozen={
  "01-calendars-en-desktop.svg": "2da04b1a33eb70b28f886990295fdd0669715a046edaafd5bd2f03f8a06d5bd1",
  "01-calendars-en-mobile.svg": "9aea371332ae801cc0b017076288d552b58d67d8988c43df761fc60582911493",
  "01-calendars-fr-desktop.svg": "659462654e8f10c396b7c3762232d00f556b216ae45a2572010cc7ed0853bbb9",
  "01-calendars-fr-mobile.svg": "b7d6b652d9b082fc1338d2ec02057d3ae43017105c9163eaff405976f8d133e2",
  "02-issuance-en-desktop.svg": "973e462125dcfd9be2815a23443977957f0f63805cc47233b6d2e8eecd0dfd4f",
  "02-issuance-en-mobile.svg": "c46895d5e7914beb21383c60c67be226c2237b2e84722b848cc75e2a9318526a",
  "02-issuance-fr-desktop.svg": "424b4c25b95fa9f19b89e3b49be6e59778b82745867226b49b7ddf6624d0310f",
  "02-issuance-fr-mobile.svg": "37afba751f5f43eee85f26d51aa8e6dab225bc437b5cba92d417a8677549e491",
  "03-maturities-en-desktop.svg": "373430161408731c219f64591898069f6a7b8b48ffc8e58eac01d4168bd6ba7b",
  "03-maturities-en-mobile.svg": "a6a9e6208f80a02480778a83e1df6132ea8a11b885ae2c4e8928e30d2e2cca24",
  "03-maturities-fr-desktop.svg": "0a61e2d14f2fce09a37cb7b458feeaf43f24dab5e18f03d0b1a70079addb9376",
  "03-maturities-fr-mobile.svg": "2c6d7af0574fc57234b83d456cb7c30a7fe944fd45d14cc2b8ed2fd775d79b36",
  "04-interest-en-desktop.svg": "b96d36ff2e6408665398369b742f46e90bff440dac37ab002f23df27e2ebb229",
  "04-interest-en-mobile.svg": "1231b3fa4b862aa8541d1da39d047d7608d3652b6eb24c4fbc19cbdebcea5fe3",
  "04-interest-fr-desktop.svg": "28b57a341b0d65764129cdb5c8872c9915171ecdd546ed2d026f2398820385c8",
  "04-interest-fr-mobile.svg": "16a85a7e1694c33dbb7442137af6f1be033c720ef76b0275274b0be3822baca0",
  "05-coupon-price-en-desktop.svg": "199665eaa63557dd05e1e635b2b1ac26ad653e41af805339067962dcdae2d744",
  "05-coupon-price-en-mobile.svg": "cb603609d2091efc5172011f89759782811ad333a249ad540c95ee44d7c3d657",
  "05-coupon-price-fr-desktop.svg": "858002d868080b1a86dfe32f716e500f5138cdfdcddd1b964f341b0f1e7e7ad1",
  "05-coupon-price-fr-mobile.svg": "81fd069facb903a9664889b7416fcfa05bedee75d84f45c13ba6d218ed50f145",
  "06-risk-transfer-en-desktop.svg": "d7d9022f7861112b2e5a5f89492670ce084373a778a1523cbf9895240fcb2be2",
  "06-risk-transfer-en-mobile.svg": "3f58a0be1b73a1c098787a843754b70abae1ffbe488561c125cbcb72f127c547",
  "06-risk-transfer-fr-desktop.svg": "cd4f2a2a804f92c0029fb39f56922269191a28c418d50980320b820752b866af",
  "06-risk-transfer-fr-mobile.svg": "22c68de4e6f509492d3d655c21a1a11b4f9e977a05c1a54c5a004f8301d03773"
};
const fontHashes={
  "400": "d4bd6877fba658196ff791cf29f2078cb6bee5059e939aa74140b6c491c4e17d",
  "700": "d5d3fd741f6c0df39e7204cd64659dc3627cbbec891faddfb3766872d7735b6e"
};
const parser=new XMLParser({preserveOrder:true,ignoreAttributes:false,attributeNamePrefix:'',trimValues:false,parseTagValue:false,parseAttributeValue:false});
const tag=n=>Object.keys(n).find(k=>k!==':@');const attrs=n=>n[':@']??{};const children=n=>n[tag(n)]??[];const all=n=>tag(n)==='#text'?[]:[n,...children(n).flatMap(all)];const text=n=>tag(n)==='#text'?n['#text']:children(n).map(text).join(' ');
const dir=resolve('src/assets/france-debt-calendar'),files=readdirSync(dir).filter(n=>n.endsWith('.svg')).sort();
const trees=new Map(files.map(name=>{const raw=readFileSync(resolve(dir,name),'utf8');assert.equal(XMLValidator.validate(raw),true,name);assert.ok(!/<!|<\?/u.test(raw),'No declarations or processing instructions');const parsed=parser.parse(raw);assert.equal(parsed.length,1);return[name,parsed[0]];}));
const native={};postcss.parse(readFileSync('src/styles/global.css','utf8')).walkDecls(d=>{if(d.parent.type==='atrule'&&d.parent.name==='theme')native[d.prop]=d.value;});const paint=role=>`var(--color-${role}, ${native[`--color-${role}`]})`;
const num=(el,key,zero=0)=>{const n=Number(attrs(el)[key]??zero);assert.ok(Number.isFinite(n));return n;};const near=(a,b,tolerance=.001)=>assert.ok(Math.abs(a-b)<=tolerance,`${a} != ${b}`);
function signature(n,root=false){if(tag(n)==='#text')return n['#text'];const p=Object.fromEntries(Object.entries(attrs(n)).filter(([k])=>!['fill','stroke'].includes(k)&&!(root&&k==='style')).sort(([a],[b])=>a.localeCompare(b)));for(const k of ['id','aria-labelledby'])if(p[k])p[k]=p[k].split(' ').map(s=>s.replace(/^france-debt-time-/u,'')).join(' ');return[tag(n),p,children(n).map(c=>signature(c))];}
const get=(stem,lang,mode)=>trees.get(`${stem}-${lang}-${mode}.svg`);
test('24 checked original compositions retain every primitive, label, number and font',()=>{
 assert.deepEqual(files,Object.keys(frozen).sort());for(const[name,tree]of trees){assert.equal(createHash('sha256').update(JSON.stringify(signature(tree,true))).digest('hex'),frozen[name],name);}
});
test('inert static XML uses only native semantic paints and globally unique accessible IDs',()=>{
 const tags=new Set('svg title desc rect text tspan line circle path'.split(' ')),keys=new Set('xmlns width height viewBox role aria-labelledby font-family id x y data-max-width font-size font-weight fill text-anchor dy x1 y1 x2 y2 stroke stroke-width cx cy r rx d stroke-dasharray stroke-linecap stroke-linejoin style'.split(' ')),paints=new Set(['none',...['ink','surface','surface-2','paper','muted','line-strong','signal','amber','topic-blue','down'].map(paint)]),ids=new Set();
 for(const[name,tree]of trees){const root=attrs(tree);assert.equal(tag(tree),'svg');assert.equal(root.xmlns,'http://www.w3.org/2000/svg');assert.equal(root.style,'width:100%;height:auto');assert.equal(root.role,'img');assert.equal(root['font-family'],'DejaVu Sans, Arial, sans-serif');const elements=all(tree);for(const k of ['title','desc'])assert.equal(elements.filter(e=>tag(e)===k).length,1);const aria=root['aria-labelledby'].split(' ');assert.equal(aria.length,2);for(const id of aria)assert.ok(elements.some(e=>attrs(e).id===id&&['title','desc'].includes(tag(e))&&text(e).trim()));
 for(const el of elements){assert.ok(tags.has(tag(el)));for(const[k,v]of Object.entries(attrs(el))){assert.ok(keys.has(k),k);if(k==='id'){assert.ok(v.startsWith('france-debt-time-'));assert.ok(!ids.has(v));ids.add(v);}if(['fill','stroke'].includes(k))assert.ok(paints.has(v),v);if(k==='style')assert.equal(el,tree);assert.ok(!v.includes('url(')&&!v.includes('javascript:'),v);}if(tag(el)==='text'){assert.ok(num(el,'font-size')>=(name.includes('mobile')?14:16));assert.ok(['400','700'].includes(attrs(el)['font-weight']));assert.ok(num(el,'data-max-width')>0);}}
 }
});
test('all primitives and text anchors stay in the unchanged canvases',()=>{
 for(const[name,tree]of trees){const[x,y,w,h]=attrs(tree).viewBox.split(' ').map(Number);assert.equal(x,0);assert.equal(y,0);assert.equal(w,name.includes('mobile')?440:1200);assert.equal(num(tree,'width'),w);assert.equal(num(tree,'height'),h);const inside=(x,y)=>assert.ok(x>=0&&x<=w&&y>=0&&y<=h,`${name} ${x},${y}`);
 for(const el of all(tree)){if(tag(el)==='rect'){inside(num(el,'x'),num(el,'y'));inside(num(el,'x')+num(el,'width'),num(el,'y')+num(el,'height'));}if(tag(el)==='line'){inside(num(el,'x1'),num(el,'y1'));inside(num(el,'x2'),num(el,'y2'));}if(tag(el)==='circle'){const r=num(el,'r')+num(el,'stroke-width')/2;inside(num(el,'cx')-r,num(el,'cy')-r);inside(num(el,'cx')+r,num(el,'cy')+r);}if(tag(el)==='text')inside(num(el,'x'),num(el,'y'));if(tag(el)==='path'){const points=attrs(el).d.match(/[ML]\s*[-\d.]+[ ,]+[-\d.]+/gu);assert.ok(points);assert.equal(points.join(' ').replace(/[ ,]+/gu,' '),attrs(el).d.replace(/[ ,]+/gu,' '));for(const p of points){const v=p.slice(1).trim().split(/[ ,]+/u).map(Number);inside(...v);}}}
 }
});
test('seven issuance bars share one scale while the BTF stock uses its separate denominator',()=>{
 const values=[3.7,42.3,56.2,21.3,90.2,35.5,12.2];for(const lang of ['fr','en'])for(const mode of ['desktop','mobile']){const tree=get('02-issuance',lang,mode),els=all(tree),bars=els.filter(e=>tag(e)==='rect'&&attrs(e).rx==='2');assert.equal(bars.length,7);const scale=num(bars[0],'width')/values[0];bars.forEach((bar,i)=>{near(num(bar,'width'),values[i]*scale,.01);assert.equal(attrs(bar).fill,paint(i===4?'signal':'topic-blue'));});const stock=els.filter(e=>tag(e)==='rect'&&attrs(e).rx==='0');assert.equal(stock.length,2);near(num(stock[1],'width')/num(stock[0],'width'),217658000000/2896181146497,.000001);const copy=text(tree);for(const v of ['2026','AFT','436'])assert.ok(copy.includes(v));assert.ok(copy.includes(lang==='fr'?'7,5':'7.5'));}
});
test('four cumulative-interest paths retain annual flows and the shared horizon',()=>{
 for(const lang of ['fr','en'])for(const mode of ['desktop','mobile']){const tree=get('04-interest',lang,mode),paths=all(tree).filter(e=>tag(e)==='path');assert.equal(paths.length,4);const points=paths.map(p=>attrs(p).d.match(/[-\d.]+/gu).map(Number).reduce((arr,v,i,a)=>{if(i%2===0)arr.push([v,a[i+1]]);return arr;},[]));points.forEach(ps=>assert.equal(ps.length,11));const origin=points[2][0],unit=(origin[1]-points[2][10][1])/5;const scenarios=[y=>.3*Math.min(y,2)+.2*Math.max(0,y-2),y=>.3*y,y=>.5*y,y=>.3*Math.min(y,2)+.6*Math.max(0,y-2)];points.forEach((ps,i)=>ps.forEach(([x,y],year)=>{near(x,origin[0]+(points[2][10][0]-origin[0])*year/10);near(y,origin[1]-unit*scenarios[i](year),.002);}));assert.ok(text(tree).includes(lang==='fr'?'5,5 %':'5.5%')||text(tree).includes('5.5 %'));}
});
test('the two price-shock bars follow discounted cash flows, not a duration shortcut',()=>{
 const price=(years,coupon,yieldRate)=>Array.from({length:years},(_,i)=>coupon/(1+yieldRate)**(i+1)).reduce((a,b)=>a+b,0)+100/(1+yieldRate)**years;
 for(const lang of ['fr','en'])for(const mode of ['desktop','mobile']){const tree=get('06-risk-transfer',lang,mode),bars=all(tree).filter(e=>tag(e)==='rect'&&attrs(e).rx==='0');assert.equal(bars.length,4);for(const[i,years,coupon,yieldRate]of[[0,2,3,.04],[2,10,5,.06]])near(100*num(bars[i+1],'width')/num(bars[i],'width'),price(years,coupon,yieldRate),.001);assert.ok(text(tree).includes(lang==='fr'?'MODÈLE HYPOTHÉTIQUE':'ILLUSTRATIVE MODEL'));assert.ok(text(tree).includes(lang==='fr'?'fictifs':'fictional'));}
});
test('the whole responsive component retains caption/data slots and local original fonts',()=>{
 const raw=readFileSync('src/components/FranceDebtCalendarFigure.astro','utf8');assert.ok(raw.includes('<slot name="caption" />'));assert.ok(raw.includes('<slot />'));assert.ok(raw.includes('data-figure={`F${figureNumber}`}'));assert.ok(raw.includes('id={`figure-${figureNumber}`}'));assert.ok(!raw.includes('<script'));
 const start=raw.indexOf('<style>'),end=raw.indexOf('</style>');assert.ok(start>=0&&end>start);const css=postcss.parse(raw.slice(start+7,end));const fontRules=[];let breakpoint=false;css.walkAtRules(rule=>{if(rule.name==='font-face')fontRules.push(rule);if(rule.name==='media'&&rule.params==='(max-width: 700px)')breakpoint=true;});assert.equal(fontRules.length,2);assert.ok(breakpoint);css.walkDecls(d=>{assert.ok(!['max-height','height'].includes(d.prop)||d.value==='auto');assert.ok(!d.prop.includes('animation'));});for(const weight of [400,700]){const bytes=readFileSync(`public/fonts/france-debt-calendar/dejavu-sans-${weight}.ttf`);assert.equal(bytes.readUInt32BE(0),0x00010000);assert.equal(createHash('sha256').update(bytes).digest('hex'),fontHashes[weight]);assert.ok(bytes.length<50000);}const licence=readFileSync('public/fonts/france-debt-calendar/LICENSE.txt','utf8');assert.ok(licence.includes('Copyright (c) 2003 by Bitstream'));assert.ok(licence.includes('Copyright (c) 2006 by Tavmjong Bah'));assert.ok(licence.includes('https://dejavu-fonts.github.io/License.html'));
});
