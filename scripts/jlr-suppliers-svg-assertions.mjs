import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { XMLValidator } from 'fast-xml-parser';
import { jlrParser, jlrTag, jlrAttrs, jlrChildren, jlrNodes, jlrText, jlrNumber, jlrPathPoints } from './jlr-svg-assertions.mjs';
export const SUPPLIERS_GOLDENS = Object.freeze({
  "propagation-fr": {
    "rawHash": "2adad0cbd02e9df5cbf4a72b06f45c546422cff488d8b85ac08ea2cd809811c6",
    "xmlHash": "21b131e62da16db20f0841da8bf27aab3c2371d6be3d2e7c333fe9e98f7e83fd",
    "geometryHash": "e77aeace1b47826ed946f14080010aee110dc30de80aedd81b44f7ae6e4360a5",
    "viewBox": "0 0 1000 1510"
  },
  "propagation-en": {
    "rawHash": "aaaf87d92379d2aae1be998b9f5e50ba69ff32979ee31ab16e7efba4254713fc",
    "xmlHash": "54d5b5fb39976db49f1157eab9b623cfe1c5735929921248b079b1114999b202",
    "geometryHash": "258537f9e675445949c6a5a7168841bafe6c565526db19013031634d51f71de8",
    "viewBox": "0 0 1000 1510"
  },
  "credit-fr": {
    "rawHash": "9dcb1271d4e4b9e2dbb51d8e8551e13dec540314305279cdf4a0bbde881ac636",
    "xmlHash": "82908c87e4f83d54a7c84a6300739a97014c6bff10fe740fb3cfc2c34fbee53d",
    "geometryHash": "2cda1f225129ef4a55c76ff77274c8f6c60671519524c7b60a232e75d6f7cb3f",
    "viewBox": "0 0 1000 1700"
  },
  "credit-en": {
    "rawHash": "9e232bfda5367a52eb2b93e2e9822a2733309d41da5daa7c72dd8563c66d70e4",
    "xmlHash": "e9ac0517c931be1c35427a37893a3a3a2eb8942ba741c8df4513a210c4dde773",
    "geometryHash": "93bcd2358de8983f3fe81a4ebf699680856fe2bba1ed57d7d3967569d3b740ba",
    "viewBox": "0 0 1000 1700"
  },
  "orders-fr": {
    "rawHash": "af7b28a3581b9b91087d11d0b859fce0c7f0da5a1243a50bb6102e91f002d082",
    "xmlHash": "c0a18bd21590c86f02a5d16aa4e42dcd090fb68b24b3bc86de366d7978ad3566",
    "geometryHash": "624da47e98a3b29638cb4355f6ef3a950a23b5a2ae0e8db0555c86e54b543104",
    "viewBox": "0 0 1000 1780"
  },
  "orders-en": {
    "rawHash": "7cd2c868195d423d419cd711b5fd304fe0b323eea9465a1fa24b798e4c4b0b5f",
    "xmlHash": "848c60cd6a898e8ad7d990afd39aec8d0c5a24e7c8fcf5bbc990f4f9fac5fd91",
    "geometryHash": "0e6df1368e744f83beca1a5c98800721a4e277360efc8c56f745456b38b92615",
    "viewBox": "0 0 1000 1780"
  },
  "guarantee-fr": {
    "rawHash": "d0b1382cdc63b3e58511e85f01c23869a32d798a81c730b6712ba932c344cca2",
    "xmlHash": "1087b683ffbf1316bd46a1f065ebb8818f71aa52e8e234363f36bf1cbd2a9ba5",
    "geometryHash": "8baafe66a12b0418ff225343e96db9f039b65f7c2e7ddb3ded930f31d0ba97ec",
    "viewBox": "0 0 1000 1900"
  },
  "guarantee-en": {
    "rawHash": "6ebae11392bafbb87d9cb6b80be73c2d0b165e9bb634455bb038f15e5ef2b682",
    "xmlHash": "1108885d5cb496eadb533d9925f6a55a0e7d2d3707d9f543c02ab2ee9fbe1200",
    "geometryHash": "5af73203d8bd7ad74ece313947a96d61630e25b9a70e64572ff413234c6beed9",
    "viewBox": "0 0 1000 1900"
  }
});
export const SUPPLIERS_EXPECTED_SOURCES = Object.freeze({
  "propagation": [
    "https://www.jlr.com/news/2025/10/jlr-restarts-manufacturing-and-introduces-new-financing-solution-pay-jlr-suppliers",
    "https://autins.com/wp-content/uploads/2026/04/Autins-Interim-Results-September-2025.pdf"
  ],
  "credit": [
    "https://autins.com/wp-content/uploads/2026/04/Autins-Interim-Results-September-2025.pdf"
  ],
  "orders": [
    "https://www.jlr.com/news/2025/10/jlr-restarts-manufacturing-and-introduces-new-financing-solution-pay-jlr-suppliers",
    "https://media.production.jlrms.com/2026-07-16/pdf/1b96461d-5ffd-4d1a-af0b-5cd8ebe3b7a0/JLR_AnnualReport_FY26.pdf?VersionId=xikZbhVtRFrOPHul.rwdanl8IgGizAHD",
    "https://activity-report.ca-cib.com/financing-activities/"
  ],
  "guarantee": [
    "https://committees.parliament.uk/publications/49980/documents/269099/default/",
    "https://media.production.jlrms.com/2026-07-16/pdf/1b96461d-5ffd-4d1a-af0b-5cd8ebe3b7a0/JLR_AnnualReport_FY26.pdf?VersionId=xikZbhVtRFrOPHul.rwdanl8IgGizAHD",
    "https://media.production.jlrms.com/2026-08-13/pdf/7989af22-64e7-4207-b410-45056d93d6d3/FY27%20Q1%20Narrative%20Reporting%20vf.pdf?VersionId=azpA_3uUAYhZz6vJ4NX0kfhG6Du2Cazg",
    "https://activity-report.ca-cib.com/financing-activities/"
  ]
});
export const SUPPLIERS_VISIBLE_SOURCES = Object.freeze({
  "propagation": {
    "url": "https://www.jlr.com/news/2025/10/jlr-restarts-manufacturing-and-introduces-new-financing-solution-pay-jlr-suppliers",
    "anchor": "#source-08"
  },
  "credit": {
    "url": "https://autins.com/wp-content/uploads/2026/04/Autins-Interim-Results-September-2025.pdf",
    "anchor": "#source-01"
  },
  "orders": {
    "url": "https://www.jlr.com/news/2025/10/jlr-restarts-manufacturing-and-introduces-new-financing-solution-pay-jlr-suppliers",
    "anchor": "#source-08"
  },
  "guarantee": {
    "url": "https://committees.parliament.uk/publications/49980/documents/269099/default/",
    "anchor": "#source-13"
  }
});
export const suppliersKinds = Object.freeze(['propagation', 'credit', 'orders', 'guarantee']);
const digest = value => createHash('sha256').update(value).digest('hex');
const palette = new Set(['none','#0c0d10','#121419','#171a20','#272d37','#343b48','#657084','#a5adbb','#e7e9ee','#5eead4','#ff4d87','#f5b13d','#7aa2f7']);
const allowed = Object.fromEntries(Object.entries({
 svg:'xmlns width height viewBox role aria-labelledby lang preserveAspectRatio style', title:'id', desc:'id', defs:'',
 marker:'id viewBox refX refY markerWidth markerHeight orient', path:'d fill stroke stroke-width stroke-linecap stroke-linejoin stroke-dasharray opacity marker-end',
 rect:'x y width height rx fill stroke stroke-width opacity', text:'x y font-family font-size font-weight fill text-anchor', tspan:'x dy', g:'transform',
 line:'x1 y1 x2 y2 stroke stroke-width stroke-dasharray marker-end opacity', circle:'cx cy r fill stroke stroke-width', a:'href', metadata:'id',
}).map(([tag, list]) => [tag, new Set(list ? list.split(' ') : [])]));
const numeric = new Set('x y width height rx cx cy r x1 x2 y1 y2 dy font-size stroke-width refX refY markerWidth markerHeight opacity'.split(' '));
const projection = n => jlrTag(n)==='#text' ? null : [jlrTag(n),Object.entries(jlrAttrs(n)).sort(),jlrChildren(n).map(projection).filter(Boolean)];
export function inspectSuppliersSvg(svg, lang, kind, inline=false) {
 assert.equal(typeof svg,'string');assert.ok(svg.length>100&&svg.length<25000);assert.doesNotMatch(svg,/<!|<\?|&(?!amp;|lt;|gt;|quot;|apos;)/u);assert.equal(XMLValidator.validate(svg),true);
 const roots=jlrParser.parse(svg);assert.equal(roots.length,1);const root=roots[0];assert.equal(jlrTag(root),'svg');
 const index=suppliersKinds.indexOf(kind);assert.ok(index>=0&&['fr','en'].includes(lang));const prefix=`${lang}-jlr2-f${index+1}`,gold=SUPPLIERS_GOLDENS[`${kind}-${lang}`];
 const [,,width,height]=gold.viewBox.split(' '),expected={xmlns:'http://www.w3.org/2000/svg',width,height,viewBox:gold.viewBox,role:'img','aria-labelledby':`${prefix}-title ${prefix}-desc`,lang,preserveAspectRatio:'xMidYMid meet'};
 if(inline)expected.style='width:100%;height:auto';assert.deepEqual(jlrAttrs(root),expected);
 const nodes=jlrNodes(root),ids=[];assert.ok(nodes.length<600);
 for(const n of nodes){const tag=jlrTag(n);if(tag==='#text')continue;assert.ok(Object.hasOwn(allowed,tag),`Passive SVG element ${tag}`);
  for(const[key,value]of Object.entries(jlrAttrs(n))){assert.ok(allowed[tag].has(key),`Allowed ${tag}.${key}`);assert.equal(typeof value,'string');assert.ok(value.length<=8192);
   if(numeric.has(key)){const number=jlrNumber(value);if(['width','height','rx','r','stroke-width','markerWidth','markerHeight'].includes(key))assert.ok(number>=0);if(key==='opacity')assert.ok(number>=0&&number<=1);}
   if(key==='fill'||key==='stroke')assert.ok(palette.has(value));
   if(key==='id')ids.push(value);
   if(key==='font-family')assert.ok(['Inter Variable, Inter, Arial, Helvetica, sans-serif','JetBrains Mono Variable, DejaVu Sans Mono, monospace'].includes(value));
   if(key==='font-size')assert.ok(jlrNumber(value)>=22&&jlrNumber(value)<=38);
   if(key==='font-weight')assert.ok(['400','500','550','600','650','700','750'].includes(value));
   if(key==='text-anchor')assert.ok(['start','middle','end'].includes(value));
   if(key==='stroke-linecap'||key==='stroke-linejoin')assert.equal(value,'round');
   if(key==='stroke-dasharray')assert.match(value,/^\d{1,2} \d{1,2}$/u);
   if(key==='d')jlrPathPoints(value);
   if(key==='marker-end')assert.ok(['teal','pink','amber','quiet','blue'].some(color=>value===`url(#${prefix}-arrow-${color})`));
   if(key==='transform'){const match=/^translate\((-?\d{1,4}(?:\.\d{1,18})?) (-?\d{1,4}(?:\.\d{1,18})?)\) scale\((\d{1,2}(?:\.\d{1,18})?)\)$/u.exec(value);assert.ok(match);match.slice(1).map(jlrNumber);assert.ok(Number(match[3])>0&&Number(match[3])<=10);}
   if(key==='style')assert.ok(n===root&&inline&&value==='width:100%;height:auto');
   if(key==='href'){assert.equal(tag,'a');assert.equal(value,inline?SUPPLIERS_VISIBLE_SOURCES[kind].anchor:SUPPLIERS_VISIBLE_SOURCES[kind].url);}
  }
  if(tag==='marker'){const a=jlrAttrs(n);assert.ok(['teal','pink','amber','quiet','blue'].some(color=>a.id===`${prefix}-arrow-${color}`));assert.deepEqual({...a,id:'marker'},{id:'marker',viewBox:'0 0 12 12',refX:'10',refY:'6',markerWidth:'9',markerHeight:'9',orient:'auto-start-reverse'});}
  if(tag==='text')assert.ok(jlrChildren(n).length&&jlrChildren(n).every(c=>jlrTag(c)==='tspan'));
  if(['title','desc','metadata','tspan'].includes(tag))assert.ok(jlrChildren(n).every(c=>jlrTag(c)==='#text'));
 }
 assert.deepEqual([...ids].sort(),[`${prefix}-title`,`${prefix}-desc`,`${prefix}-sources`,...['teal','pink','amber','quiet','blue'].map(c=>`${prefix}-arrow-${c}`)].sort());
 for(const [tag,count]of [['title',1],['desc',1],['metadata',1],['defs',1],['marker',5],['a',1]])assert.equal(nodes.filter(n=>jlrTag(n)===tag).length,count);
 const metadata=jlrText(nodes.find(n=>jlrTag(n)==='metadata')).trim().split('\n');assert.equal(metadata.shift(),'Consultation / accessed: 2026-10-18.');
 const sources=metadata.filter(line=>line.includes('| https:')).map(line=>line.split('|').at(-1).trim());assert.deepEqual(sources,SUPPLIERS_EXPECTED_SOURCES[kind]);
 for(const url of sources){const parsed=new URL(url);assert.equal(parsed.href,url);assert.equal(parsed.protocol,'https:');assert.equal(parsed.username,'');assert.equal(parsed.password,'');assert.equal(parsed.hash,'');}
 return{root,nodes,width:Number(width),height:Number(height),prefix};
}
export function assertSuppliersFaithful(svg,lang,kind,inline=false) {
 inspectSuppliersSvg(svg,lang,kind,inline);let recovered=svg;
 if(inline)recovered=recovered.replace('<svg style="width:100%;height:auto" ','<svg ').replace(` href="${SUPPLIERS_VISIBLE_SOURCES[kind].anchor}"`,` href="${SUPPLIERS_VISIBLE_SOURCES[kind].url}"`);
 const gold=SUPPLIERS_GOLDENS[`${kind}-${lang}`];if(!inline)assert.equal(digest(recovered),gold.rawHash,'Complete supplied SVG retained');assert.equal(digest(JSON.stringify(jlrParser.parse(recovered))),gold.xmlHash,'Complete original XML including text retained');assert.equal(digest(JSON.stringify(jlrParser.parse(recovered).map(projection))),gold.geometryHash,'Every attribute and element order retained');
}
export function assertSuppliersGeometry(svg,lang,kind) {
 const{root,width,height}=inspectSuppliersSvg(svg,lang,kind);const val=(n,key)=>jlrNumber(jlrAttrs(n)[key]??'0');let shapes=0;
 const within=(points,padding=0)=>{for(const[x,y]of points)assert.ok(x-padding>=-.001&&y-padding>=-.001&&x+padding<=width+.001&&y+padding<=height+.001,'Visible geometry remains inside viewBox');};
 function walk(n,tx=0,ty=0,scale=1){const tag=jlrTag(n),a=jlrAttrs(n);if(['defs','#text'].includes(tag))return;
  if(a.transform){const match=/^translate\(([^ ]+) ([^)]+)\) scale\(([^)]+)\)$/u.exec(a.transform);tx+=jlrNumber(match[1])*scale;ty+=jlrNumber(match[2])*scale;scale*=jlrNumber(match[3]);}
  let points=[];
  if(tag==='rect')points=[[val(n,'x'),val(n,'y')],[val(n,'x')+val(n,'width'),val(n,'y')+val(n,'height')]];
  if(tag==='circle')points=[[val(n,'cx')-val(n,'r'),val(n,'cy')-val(n,'r')],[val(n,'cx')+val(n,'r'),val(n,'cy')+val(n,'r')]];
  if(tag==='line')points=[[val(n,'x1'),val(n,'y1')],[val(n,'x2'),val(n,'y2')]];
  if(tag==='path')points=jlrPathPoints(a.d);
  if(points.length){shapes++;within(points.map(([x,y])=>[tx+x*scale,ty+y*scale]),a.stroke&&a.stroke!=='none'?val(n,'stroke-width')*scale/2:0);}
  if(a['marker-end']){
   assert.ok(['line','path'].includes(tag));
   let segment=[[val(n,'x1'),val(n,'y1')],[val(n,'x2'),val(n,'y2')]];
   if(tag==='path'){assert.doesNotMatch(a.d,/[QZ]/u);segment=jlrPathPoints(a.d).slice(-2);assert.equal(segment.length,2);}
   const [[startX,startY],[endX,endY]]=segment,angle=Math.atan2(endY-startY,endX-startX),factor=9/12*val(n,'stroke-width');
   const corners=[[0,0],[12,0],[0,12],[12,12]].map(([x,y])=>{const dx=(x-10)*factor,dy=(y-6)*factor;return[tx+(endX+Math.cos(angle)*dx-Math.sin(angle)*dy)*scale,ty+(endY+Math.sin(angle)*dx+Math.cos(angle)*dy)*scale];});within(corners);
  }
  if(tag==='text'){let y=val(n,'y');for(const child of jlrChildren(n)){y+=val(child,'dy');within([[val(child,'x'),y],[val(child,'x'),y-val(n,'font-size')]]);}}
  for(const child of jlrChildren(n))walk(child,tx,ty,scale);
 }
 walk(root);return shapes;
}

export function assertSuppliersQuantitative(svg, lang, kind) {
 const { nodes } = inspectSuppliersSvg(svg, lang, kind);
 const rects = nodes.filter(n => jlrTag(n) === 'rect').map(jlrAttrs);
 const near = (actual, expected) => assert.ok(Math.abs(Number(actual) - expected) <= .00051);
 if (kind === 'credit') {
  const bars = rects.filter(a => a.height === '68'); assert.equal(bars.length, 2);
  for (const [index, value] of [3.47, 1.52].entries()) { near(bars[index].x, 259); near(bars[index].y, 881 + index * 150); near(bars[index].width, value * 151); }
  const texts = nodes.filter(n => jlrTag(n) === 'text').map(jlrText);
  for (const label of lang === 'fr' ? ['3,47','1,52','2024','2025'] : ['3.47','1.52','2024','2025']) assert.ok(texts.includes(label));
 }
 if (kind === 'guarantee') {
  const bars = rects.filter(a => a.height === '64'); assert.equal(bars.length, 2);
  assert.equal(300 / 1500, .2); near(bars[0].x, 48); near(bars[0].width, 904 * .8); near(bars[1].x, 48 + 904 * .8); near(bars[1].width, 904 * .2);
  const texts = nodes.filter(n => jlrTag(n) === 'text').map(jlrText);
  for (const label of lang === 'fr' ? ['80 %','20 %','30 JUIN 2026'] : ['80%','20%','30 JUNE 2026']) assert.ok(texts.includes(label));
 }
}
