import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { XMLParser, XMLValidator } from 'fast-xml-parser';

export const JLR_GOLDENS = Object.freeze({
  "circuit-fr": {
    "rawHash": "37fa48ed2c656689283aad1b33c5351f044474c8d40df420be65fd70147263a1",
    "geometryHash": "5136953654962c0456aa233204e63b72f39627cdeca56b8c4362c8d8f2cd1798",
    "viewBox": "0 0 1000 1500",
    "xmlHash": "a77efd733a1ed1e18f18a5c7bdf1e20fe345051e852b71691b775586f0aac4ad"
  },
  "circuit-en": {
    "rawHash": "701038dee71320d55d54f9098225166a2832398f8b5e4116c62420c4e02fd4b6",
    "geometryHash": "0b66fdc83e49a7fe3602a9a625b92bd36aa4b85574707b60953bf9c8e8caa3a5",
    "viewBox": "0 0 1000 1500",
    "xmlHash": "d2d18085a20d8ed2c046fb8fc431e22dc5955850287f899481b3c73247e91160"
  },
  "recovery-fr": {
    "rawHash": "57fafb43c44f57a7e36928e185f80d97b025204aebb74415432e0b78a165d154",
    "geometryHash": "cdd6a6465f1669d002866a9007200feb2bab3dfc94faf8639b7c63ddf0fb5b9a",
    "viewBox": "0 0 1000 1430",
    "xmlHash": "36da1842e5952516a541b90521a08a8f8bb95bf255f583c35d0dcaa4325f6859"
  },
  "recovery-en": {
    "rawHash": "1b5ad8c36770b975d7d6ea9213659664afde398a0dc5a78bbaf738e44005fe22",
    "geometryHash": "b7e98627a5b3d59ccfb7d5f6f1a74f8394f176ffe189ff253004b1eaa3c71674",
    "viewBox": "0 0 1000 1430",
    "xmlHash": "37ef0bb0c08868cd801d212c0903c883fce0d2c9340bd2825ff01ebab706942f"
  },
  "quarters-fr": {
    "rawHash": "8164e8820188f63934148eda7d1ebe7070677375a74238ee64ae0052f4ae495b",
    "geometryHash": "13ad251e231ecf5de6d1654ebca06acfd10e0e8774eeb0a0b6d450ad677f002f",
    "viewBox": "0 0 1000 1720",
    "xmlHash": "2cde4a587a5a898fc5942f5d3fa3d8456417f23b619ee7d54961614ac5e93f75"
  },
  "quarters-en": {
    "rawHash": "c48fdac1a73286b49d534b60be36aa938b7368f41d04ee60b60e43d19617aa99",
    "geometryHash": "ce2ecbb5d2ffdca8be45432161ccb6779c39350677860e995af9399559a2707e",
    "viewBox": "0 0 1000 1720",
    "xmlHash": "12d52094ccee8b419df530eedaf3b3111ed20b4d08c9433610056c4bddc21f79"
  },
  "inventory-fr": {
    "rawHash": "612c7b230c55b08018adaeddfce84208bb894e5556f6a1a866169265dd6d0fe9",
    "geometryHash": "692456516c6fea087273d70a0d3c350bcd774d4b5daeed38943975c84b5fa9fc",
    "viewBox": "0 0 1000 1430",
    "xmlHash": "7cdf84faceef89f9ae919ad18cba990f169dcea213b2cd2e86bc3c6b6a34714e"
  },
  "inventory-en": {
    "rawHash": "7fe70aa9596b92d20417ef048c9d9809e88b1921e47dc23b3d29bc4af1b81a5c",
    "geometryHash": "d621cf2c7efaf7063acf68d499ef970f4689eab8d13e2bbbbab3a6b53cb8d9a9",
    "viewBox": "0 0 1000 1430",
    "xmlHash": "2fd42eb91fcb310e01277bc89e6b49e5c1ef3b482e7a9acbdec536c843877d0c"
  }
});
export const JLR_EXPECTED_SOURCES = Object.freeze({
  "circuit": [
    "https://media.production.jlrms.com/2026-07-16/pdf/1b96461d-5ffd-4d1a-af0b-5cd8ebe3b7a0/JLR_AnnualReport_FY26.pdf?VersionId=xikZbhVtRFrOPHul.rwdanl8IgGizAHD",
    "https://media.jlr.com/corporate/news/2025/09/statement-cyber-incident-5",
    "https://media.jlr.com/corporate/news/2025/10/jlr-restarts-manufacturing-and-introduces-new-financing-solution-pay-jlr-suppliers",
    "https://media.jlr.com/corporate/news/2025/11/jlr-performance-impacted-challenging-quarter"
  ],
  "recovery": [
    "https://media.jlr.com/corporate/news/2025/09/statement-cyber-incident",
    "https://media.jlr.com/corporate/news/2025/09/statement-cyber-incident-5",
    "https://media.jlr.com/corporate/news/2025/10/jlr-restarts-manufacturing-and-introduces-new-financing-solution-pay-jlr-suppliers",
    "https://media.jlr.com/corporate/news/2025/11/jlr-performance-impacted-challenging-quarter",
    "https://media.jlr.com/corporate/news/2026/01/jlr-q3-sales-impacted-cyber-incident-previously-indicated",
    "https://media.production.jlrms.com/2026-05-14/pdf/e1735c6a-e7f2-41db-af28-4bf5984ed66f/Q4%20FY26%20Results%20Deck%20vF.pdf?VersionId=T2JrAEAYyQIDdIQj1oPn0iY66nOAdGsU"
  ],
  "quarters": [
    "https://media.production.jlrms.com/2025-08-08/pdf/7304004d-ecd5-4d31-89dd-bbdca11a63df/FY26%20Q1%20Narrative%20Reporting.pdf?VersionId=nnH3TVkvrTsK9oocQOChXWMu7kZXyNIe",
    "https://media.production.jlrms.com/2025-11-14/pdf/5e39d1a1-ba79-4bf7-8aea-be456b7c5cf5/FY26%20Q2%20Interim%20Financial%20Statements.pdf?VersionId=.qldkmajqLW.Suulo8MYoxfuxwSG7MPC",
    "https://media.production.jlrms.com/2026-02-05/pdf/4a20e2a8-c7e0-457a-8501-b0e685991b56/FY26%20Q3%20Interim%20Financial%20Statements.pdf?VersionId=Mr33D0IXacFapqbaaxZmNJvb2GUhfFTR",
    "https://media.production.jlrms.com/2026-05-14/pdf/e1735c6a-e7f2-41db-af28-4bf5984ed66f/Q4%20FY26%20Results%20Deck%20vF.pdf?VersionId=T2JrAEAYyQIDdIQj1oPn0iY66nOAdGsU",
    "https://media.production.jlrms.com/2026-07-16/pdf/1b96461d-5ffd-4d1a-af0b-5cd8ebe3b7a0/JLR_AnnualReport_FY26.pdf?VersionId=xikZbhVtRFrOPHul.rwdanl8IgGizAHD"
  ],
  "inventory": [
    "https://media.production.jlrms.com/2025-11-14/pdf/5e39d1a1-ba79-4bf7-8aea-be456b7c5cf5/FY26%20Q2%20Interim%20Financial%20Statements.pdf?VersionId=.qldkmajqLW.Suulo8MYoxfuxwSG7MPC",
    "https://media.production.jlrms.com/2026-02-05/pdf/4a20e2a8-c7e0-457a-8501-b0e685991b56/FY26%20Q3%20Interim%20Financial%20Statements.pdf?VersionId=Mr33D0IXacFapqbaaxZmNJvb2GUhfFTR"
  ]
});
export const JLR_VISIBLE_SOURCES = Object.freeze({
  "circuit": {
    "url": "https://media.production.jlrms.com/2026-07-16/pdf/1b96461d-5ffd-4d1a-af0b-5cd8ebe3b7a0/JLR_AnnualReport_FY26.pdf?VersionId=xikZbhVtRFrOPHul.rwdanl8IgGizAHD",
    "anchor": "#source-06"
  },
  "recovery": {
    "url": "https://media.jlr.com/corporate/news/2025/09/statement-cyber-incident",
    "anchor": "#source-02"
  },
  "quarters": {
    "url": "https://media.production.jlrms.com/2025-08-08/pdf/7304004d-ecd5-4d31-89dd-bbdca11a63df/FY26%20Q1%20Narrative%20Reporting.pdf?VersionId=nnH3TVkvrTsK9oocQOChXWMu7kZXyNIe",
    "anchor": "#source-11"
  },
  "inventory": {
    "url": "https://media.production.jlrms.com/2025-11-14/pdf/5e39d1a1-ba79-4bf7-8aea-be456b7c5cf5/FY26%20Q2%20Interim%20Financial%20Statements.pdf?VersionId=.qldkmajqLW.Suulo8MYoxfuxwSG7MPC",
    "anchor": "#source-12"
  }
});
export const jlrKinds = Object.freeze(['circuit', 'recovery', 'quarters', 'inventory']);
export const jlrParser = new XMLParser({ preserveOrder: true, ignoreAttributes: false, attributeNamePrefix: '', trimValues: false, parseTagValue: false, parseAttributeValue: false });
export const jlrTag = n => Object.keys(n).find(k => k !== ':@');
export const jlrAttrs = n => n[':@'] ?? {};
export const jlrChildren = n => Array.isArray(n[jlrTag(n)]) ? n[jlrTag(n)] : [];
export const jlrNodes = n => [n, ...jlrChildren(n).flatMap(jlrNodes)];
export const jlrText = n => jlrTag(n) === '#text' ? n['#text'] : jlrChildren(n).map(jlrText).join('');
const digest = value => createHash('sha256').update(value).digest('hex');
const palette = new Set(['none','#0c0d10','#121419','#171a20','#272d37','#343b48','#657084','#a5adbb','#e7e9ee','#5eead4','#ff4d87','#f5b13d','#7aa2f7']);
const allowed = Object.fromEntries(Object.entries({
 svg:'xmlns width height viewBox role aria-labelledby lang preserveAspectRatio style', title:'id', desc:'id', defs:'',
 marker:'id viewBox refX refY markerWidth markerHeight orient', path:'d fill stroke stroke-width stroke-linecap stroke-linejoin stroke-dasharray opacity marker-end',
 rect:'x y width height rx fill stroke stroke-width opacity', text:'x y font-family font-size font-weight fill text-anchor', tspan:'x dy', g:'transform',
 line:'x1 y1 x2 y2 stroke stroke-width stroke-dasharray marker-end opacity', circle:'cx cy r fill stroke stroke-width', a:'href', metadata:'id',
}).map(([tag, list]) => [tag, new Set(list ? list.split(' ') : [])]));
const numeric = new Set('x y width height rx cx cy r x1 x2 y1 y2 dy font-size stroke-width refX refY markerWidth markerHeight opacity'.split(' '));
export function jlrNumber(raw) {
 assert.equal(typeof raw,'string');assert.ok(raw.length>0&&raw.length<=32);
 assert.match(raw,/^-?(?:\d{1,4}(?:\.\d{1,18})?|\.\d{1,18})$/u);
 const result=Number(raw);assert.ok(Number.isFinite(result)&&Math.abs(result)<=10000);return result;
}
export function jlrPathPoints(raw) {
 assert.equal(typeof raw,'string');assert.ok(raw.length>0&&raw.length<=8192);
 const token=/[MLQZ]|-?(?:\d{1,4}(?:\.\d{1,18})?|\.\d{1,18})/uy,tokens=[];let offset=0;
 while(offset<raw.length){if(/\s/u.test(raw[offset])){offset++;continue;}token.lastIndex=offset;const match=token.exec(raw);assert.ok(match,'Consume every path character');tokens.push(match[0]);assert.ok(tokens.length<=2048);offset=token.lastIndex;}
 assert.equal(tokens[0],'M');const points=[];let i=0,origin,current,commands=0;
 const pair=()=>[jlrNumber(tokens[i++]),jlrNumber(tokens[i++])];
 while(i<tokens.length){const command=tokens[i++];assert.ok(++commands<=512);assert.ok(['M','L','Q','Z'].includes(command));
  if(command==='Z'){assert.ok(origin);current=[...origin];}
  else if(command==='Q'){assert.ok(current);points.push(pair());current=pair();}
  else{if(command==='L')assert.ok(current);current=pair();if(command==='M')origin=[...current];}
  points.push([...current]);
 }
 return points;
}
const projection = n => jlrTag(n)==='#text' ? null : [jlrTag(n),Object.entries(jlrAttrs(n)).sort(),jlrChildren(n).map(projection).filter(Boolean)];
export function inspectJlrSvg(svg, lang, kind, inline=false) {
 assert.equal(typeof svg,'string');assert.ok(svg.length>100&&svg.length<25000);assert.doesNotMatch(svg,/<!|<\?|&(?!amp;|lt;|gt;|quot;|apos;)/u);assert.equal(XMLValidator.validate(svg),true);
 const roots=jlrParser.parse(svg);assert.equal(roots.length,1);const root=roots[0];assert.equal(jlrTag(root),'svg');
 const index=jlrKinds.indexOf(kind);assert.ok(index>=0&&['fr','en'].includes(lang));const prefix=`${lang}-jlr-f${index+1}`,gold=JLR_GOLDENS[`${kind}-${lang}`];
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
   if(key==='font-weight')assert.ok(['400','500','600','700'].includes(value));
   if(key==='text-anchor')assert.ok(['start','middle','end'].includes(value));
   if(key==='stroke-linecap'||key==='stroke-linejoin')assert.equal(value,'round');
   if(key==='stroke-dasharray')assert.match(value,/^\d{1,2} \d{1,2}$/u);
   if(key==='d')jlrPathPoints(value);
   if(key==='marker-end')assert.ok(['teal','pink','amber','quiet','blue'].some(color=>value===`url(#${prefix}-arrow-${color})`));
   if(key==='transform'){const match=/^translate\((-?\d{1,4}(?:\.\d{1,18})?) (-?\d{1,4}(?:\.\d{1,18})?)\) scale\((\d{1,2}(?:\.\d{1,18})?)\)$/u.exec(value);assert.ok(match);match.slice(1).map(jlrNumber);assert.ok(Number(match[3])>0&&Number(match[3])<=10);}
   if(key==='style')assert.ok(n===root&&inline&&value==='width:100%;height:auto');
   if(key==='href'){assert.equal(tag,'a');assert.equal(value,inline?JLR_VISIBLE_SOURCES[kind].anchor:JLR_VISIBLE_SOURCES[kind].url);}
  }
  if(tag==='marker'){const a=jlrAttrs(n);assert.ok(['teal','pink','amber','quiet','blue'].some(color=>a.id===`${prefix}-arrow-${color}`));assert.deepEqual({...a,id:'marker'},{id:'marker',viewBox:'0 0 12 12',refX:'10',refY:'6',markerWidth:'9',markerHeight:'9',orient:'auto-start-reverse'});}
  if(tag==='text')assert.ok(jlrChildren(n).length&&jlrChildren(n).every(c=>jlrTag(c)==='tspan'));
  if(['title','desc','metadata','tspan'].includes(tag))assert.ok(jlrChildren(n).every(c=>jlrTag(c)==='#text'));
 }
 assert.deepEqual([...ids].sort(),[`${prefix}-title`,`${prefix}-desc`,`${prefix}-sources`,...['teal','pink','amber','quiet','blue'].map(c=>`${prefix}-arrow-${c}`)].sort());
 for(const [tag,count]of [['title',1],['desc',1],['metadata',1],['defs',1],['marker',5],['a',1]])assert.equal(nodes.filter(n=>jlrTag(n)===tag).length,count);
 const metadata=jlrText(nodes.find(n=>jlrTag(n)==='metadata')).trim().split('\n');assert.equal(metadata.shift(),'Accessed / consulté: 2026-10-18.');
 const sources=metadata.map(line=>line.split('|').at(-1).trim());assert.deepEqual(sources,JLR_EXPECTED_SOURCES[kind]);
 for(const url of sources){const parsed=new URL(url);assert.equal(parsed.href,url);assert.equal(parsed.protocol,'https:');assert.equal(parsed.username,'');assert.equal(parsed.password,'');assert.equal(parsed.hash,'');}
 return{root,nodes,width:Number(width),height:Number(height),prefix};
}
export function assertJlrFaithful(svg,lang,kind,inline=false) {
 inspectJlrSvg(svg,lang,kind,inline);let recovered=svg;
 if(inline)recovered=recovered.replace('<svg style="width:100%;height:auto" ','<svg ').replace(` href="${JLR_VISIBLE_SOURCES[kind].anchor}"`,` href="${JLR_VISIBLE_SOURCES[kind].url}"`);
 if(kind==='recovery'&&lang==='en'){assert.equal(recovered.split('Recovery milestones at JLR').length-1,2);recovered=recovered.replaceAll('Recovery milestones at JLR','Recovery runs on several clocks');}
 const gold=JLR_GOLDENS[`${kind}-${lang}`];if(!inline)assert.equal(digest(recovered),gold.rawHash,'Complete supplied SVG retained');assert.equal(digest(JSON.stringify(jlrParser.parse(recovered))),gold.xmlHash,'Complete original XML including text retained');assert.equal(digest(JSON.stringify(jlrParser.parse(recovered).map(projection))),gold.geometryHash,'Every attribute and element order retained');
}
export function assertJlrGeometry(svg,lang,kind) {
 const{root,width,height}=inspectJlrSvg(svg,lang,kind);const val=(n,key)=>jlrNumber(jlrAttrs(n)[key]??'0');let shapes=0;
 const within=(points,padding=0)=>{for(const[x,y]of points)assert.ok(x-padding>=-.001&&y-padding>=-.001&&x+padding<=width+.001&&y+padding<=height+.001,'Visible geometry remains inside viewBox');};
 function walk(n,tx=0,ty=0,scale=1){const tag=jlrTag(n),a=jlrAttrs(n);if(['defs','#text'].includes(tag))return;
  if(a.transform){const match=/^translate\(([^ ]+) ([^)]+)\) scale\(([^)]+)\)$/u.exec(a.transform);tx+=jlrNumber(match[1])*scale;ty+=jlrNumber(match[2])*scale;scale*=jlrNumber(match[3]);}
  let points=[];
  if(tag==='rect')points=[[val(n,'x'),val(n,'y')],[val(n,'x')+val(n,'width'),val(n,'y')+val(n,'height')]];
  if(tag==='circle')points=[[val(n,'cx')-val(n,'r'),val(n,'cy')-val(n,'r')],[val(n,'cx')+val(n,'r'),val(n,'cy')+val(n,'r')]];
  if(tag==='line')points=[[val(n,'x1'),val(n,'y1')],[val(n,'x2'),val(n,'y2')]];
  if(tag==='path')points=jlrPathPoints(a.d);
  if(points.length){shapes++;within(points.map(([x,y])=>[tx+x*scale,ty+y*scale]),a.stroke&&a.stroke!=='none'?val(n,'stroke-width')*scale/2:0);}
  if(a['marker-end']){assert.equal(tag,'line');const angle=Math.atan2(val(n,'y2')-val(n,'y1'),val(n,'x2')-val(n,'x1')),factor=9/12*val(n,'stroke-width');const corners=[[0,0],[12,0],[0,12],[12,12]].map(([x,y])=>{const dx=(x-10)*factor,dy=(y-6)*factor;return[tx+(val(n,'x2')+Math.cos(angle)*dx-Math.sin(angle)*dy)*scale,ty+(val(n,'y2')+Math.sin(angle)*dx+Math.cos(angle)*dy)*scale];});within(corners);}
  if(tag==='text'){let y=val(n,'y');for(const child of jlrChildren(n)){y+=val(child,'dy');within([[val(child,'x'),y],[val(child,'x'),y-val(n,'font-size')]]);}}
  for(const child of jlrChildren(n))walk(child,tx,ty,scale);
 }
 walk(root);return shapes;
}
export function assertJlrQuantitative(svg,lang,kind) {
 const{nodes}=inspectJlrSvg(svg,lang,kind),rects=nodes.filter(n=>jlrTag(n)==='rect').map(jlrAttrs),near=(a,b)=>assert.ok(Math.abs(Number(a)-b)<=.00051);
 if(kind==='quarters'){
  const bars=rects.filter(a=>a.width==='94');assert.equal(bars.length,12);
  const rows=[{values:[87286,66165,59149,95315],scale:.00213,base:610},{values:[6604,4900,4538,6870],scale:.0255,base:986},{values:[-758,-791,-1509,829],scale:.12,base:1254}];
  for(const[r,row]of rows.entries())for(const[c,value]of row.values.entries()){const bar=bars[r*4+c];near(bar.x,229+c*186);near(bar.height,Math.abs(value)*row.scale);near(bar.y,value>=0?row.base-value*row.scale:row.base);}
  assert.equal(307915-212600,95315);assert.equal(rows[1].values.reduce((a,b)=>a+b),22912);assert.equal(rows[2].values.reduce((a,b)=>a+b),-2229);
 }
 if(kind==='inventory'){const bars=rects.filter(a=>a.height==='54');assert.equal(bars.length,2);near(bars[0].x,535);near(bars[0].width,634*.33);near(bars[1].x,535-795*.33);near(bars[1].width,795*.33);}
 if(kind==='recovery'){
  const days=(date)=> (Date.parse(date+'T00:00:00Z')-Date.parse('2025-09-02T00:00:00Z'))/86400000,x=date=>233+days(date)*708/days('2026-03-31');
  const guides=nodes.filter(n=>jlrTag(n)==='line'&&jlrAttrs(n).y1==='394'&&jlrAttrs(n).y2==='1143');assert.equal(guides.length,7);
  for(const[n,date]of ['2025-09-02','2025-10-01','2025-11-01','2025-12-01','2026-01-01','2026-02-01','2026-03-31'].entries())near(jlrAttrs(guides[n]).x1,x(date));
 }
}
