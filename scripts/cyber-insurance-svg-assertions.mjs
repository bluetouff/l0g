import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { XMLValidator } from 'fast-xml-parser';
import { jlrParser, jlrTag, jlrAttrs, jlrChildren, jlrNodes, jlrText, jlrNumber } from './jlr-svg-assertions.mjs';
export const INSURANCE_GOLDENS = Object.freeze({
  "dependence-fr": {
    "rawHash": "a0c13593e6a9a9df7bfe7b989a8600a8c8b0c78c2089e9b598ff9451d6ccb33e",
    "xmlHash": "9ff4ddc80f3e183e17a3b07ab91082c7f715c6215cd057e6901df37bdd3d017a",
    "geometryHash": "a9c1413c5a7b0850799ed63fbbe93dd95dede5b66f466c761840a99131d35285",
    "viewBox": "0 0 1000 1260"
  },
  "dependence-en": {
    "rawHash": "d27f1a873aea0c4855db9331d47598b94619d024639e952786d0bdf5a33e8a6d",
    "xmlHash": "2a5160cf8a035809ab5401c16fc133f81f9399310b420e1b58b809ddec9150b8",
    "geometryHash": "b1f7af1f1f28d3c931b089025401c377257712852ffb0fc202a925bf187e09c1",
    "viewBox": "0 0 1000 1260"
  },
  "window-fr": {
    "rawHash": "0717368a3bd156f3dbcb9cf96521a852b8181912b8ba4abe9fd3b5d0e98366a1",
    "xmlHash": "3ad7335fae796081b80dc6ae7ad31505a7ce7cdf44a3808f9bed9b2297fc60bb",
    "geometryHash": "12aab4dfb98b83969ca5946e357358915033993bfc65c57aed5710633047fe98",
    "viewBox": "0 0 1000 1370"
  },
  "window-en": {
    "rawHash": "481a0ad2c4a1faa6b88ddcec32f380eb8fc2dcbcdd0298bc1176003e1caeca66",
    "xmlHash": "31a5ba0b313c5cc13e2e2fbedb759fa861499a49cd05f0c903a68c84cd674ef9",
    "geometryHash": "81a2feb103d00db19b2fbeeaec820828972e9981cacaeeef77d5dce85618986c",
    "viewBox": "0 0 1000 1370"
  },
  "vertu-fr": {
    "rawHash": "9c32d9316d866bec3706230c321909c5b22702b74616d2dc2fa5cee43ed44708",
    "xmlHash": "1b202e76f77f60149b13ccf09ee70b08be216de40adc371878905423c6bd0171",
    "geometryHash": "0f4d8c0c08dc8d6a3c961870eaf450741d96f23499a6a5c3bd78160125265877",
    "viewBox": "0 0 1000 1410"
  },
  "vertu-en": {
    "rawHash": "f0cd1af24dac5b629f8d270cfe33a484729bbdd8cbdb670a62320079a61c8c5e",
    "xmlHash": "37e308214d34a53f929e094ec63f46e26d7bf0021744c3f4bd3597483fe9eda0",
    "geometryHash": "385fcf5de33ae60f3961696e4b2bbfa7d0586efa1cff63ce5fa66f3faec18691",
    "viewBox": "0 0 1000 1410"
  },
  "marks-spencer-fr": {
    "rawHash": "f6f4857f83a485b1c53e92f4b12c0909782f2e4e8b3dda15dbd68b3a6f131d59",
    "xmlHash": "7c18c9c19c803d13f6cc0dc27b32db3323bb5e1bcfe1dc77ca6944cb5ee6e5e7",
    "geometryHash": "d091a871787d06e658265a0f3c6d88ef25a2834774d2987c2151fb19226458ee",
    "viewBox": "0 0 1000 1590"
  },
  "marks-spencer-en": {
    "rawHash": "5e2e178ac10d087b59fd477f6e7a88ce542ae5bd8f4af58873eab37bf0e392db",
    "xmlHash": "9accacd2286c98e8f766cbf1aabd8fba554b58620ef80149b8184bfacafaf7fd",
    "geometryHash": "96fbd98e64f061ed8ef3605987e1257d556a8de55b75147075c3e57d5c09a4c6",
    "viewBox": "0 0 1000 1590"
  }
});
export const INSURANCE_EXPECTED_SOURCES = Object.freeze({
  "dependence": [
    "https://data.fca.org.uk/artefacts/NSM/RNS/5852073.html",
    "https://data.fca.org.uk/artefacts/NSM/RNS/5823384.html",
    "https://www.beazley.com/en-001/cyber-customer-centre/cyber-risk-management-tools/cyber-business-interruption/policy-wording/",
    "https://www.hiscox.co.uk/sites/default/files/documents/2023-05/19029%20WD-PIP-UK-CCLEAR(5).pdf",
    "https://www.cfc.com/en-gb/knowledge/resources/articles/2026/01/cyber-coverage-highlights-customer-business-interruption/"
  ],
  "window": [
    "https://www.hiscox.co.uk/sites/default/files/documents/2023-05/19029%20WD-PIP-UK-CCLEAR(5).pdf"
  ],
  "vertu": [
    "https://www.stockopedia.com/share-prices/vertu-motors-LON:VTU/news/urn:newsml:reuters.com:20260430:nRSd4797Ca/",
    "https://www.vertumotors.com/custom/146662.pdf",
    "https://investors.vertumotors.com/custom/145080.pdf",
    "https://www.vertumotors.com/custom/146695.pdf"
  ],
  "marks-spencer": [
    "https://corporate.marksandspencer.com/sites/marksandspencer/files/2025-11/marks-and-spencer-hy-2526-rns.pdf",
    "https://corporate.marksandspencer.com/sites/marksandspencer/files/2026-05/fy26-rns.pdf",
    "https://corporate.marksandspencer.com/sites/marksandspencer/files/marksandspencer/annual-report/m-and-s-annual-report-and-financial-statements-2026.pdf"
  ]
});
export const INSURANCE_BIBLIOGRAPHY_SOURCES = Object.freeze({...INSURANCE_EXPECTED_SOURCES, vertu: ['https://investors.vertumotors.com/custom/146407.pdf', ...INSURANCE_EXPECTED_SOURCES.vertu.slice(1)]});
export const insuranceKinds = Object.freeze(['dependence', 'window', 'vertu', 'marks-spencer']);
const digest = value => createHash('sha256').update(value).digest('hex');
const palette = new Set(['none','#0c0d10','#121419','#171a20','#272d37','#343b48','#657084','#a5adbb','#e7e9ee','#5eead4','#ff4d87','#f5b13d','#7aa2f7']);
const colors = ['teal','pink','amber','blue','quiet','text'];
const allowed = Object.fromEntries(Object.entries({
 svg:'xmlns width height viewBox role aria-labelledby lang style', title:'id', desc:'id', defs:'',
 marker:'id viewBox refX refY markerWidth markerHeight orient', path:'d fill stroke stroke-width stroke-linecap stroke-linejoin opacity marker-end',
 pattern:'id patternUnits width height', linearGradient:'id x1 x2', stop:'offset stop-color stop-opacity',
 rect:'x y width height rx fill stroke stroke-width opacity', text:'x y font-family font-size font-weight fill text-anchor', tspan:'x dy',
 line:'x1 y1 x2 y2 stroke stroke-width marker-end', circle:'cx cy r fill stroke stroke-width', metadata:'id',
}).map(([tag, list]) => [tag, new Set(list ? list.split(' ') : [])]));
const numeric = new Set('x y width height rx cx cy r x1 x2 y1 y2 dy font-size stroke-width refX refY markerWidth markerHeight opacity offset stop-opacity'.split(' '));
const projection = n => jlrTag(n)==='#text' ? null : [jlrTag(n),Object.entries(jlrAttrs(n)).sort(),jlrChildren(n).map(projection).filter(Boolean)];

// Consume the complete, bounded path grammar used by the supplied figures.
// Control points give a conservative hull for each quadratic/cubic segment.
export function insurancePathPoints(raw) {
 assert.equal(typeof raw,'string');assert.ok(raw.length>0&&raw.length<=8192);
 const token=/[MLHVQCZ]|-?(?:\d{1,4}(?:\.\d{1,18})?|\.\d{1,18})/uy,tokens=[];let offset=0;
 while(offset<raw.length){if(/\s/u.test(raw[offset])){offset++;continue;}token.lastIndex=offset;const match=token.exec(raw);assert.ok(match,'Consume every path character');tokens.push(match[0]);assert.ok(tokens.length<=2048);offset=token.lastIndex;}
 assert.equal(tokens[0],'M');const points=[];let i=0,origin,current,commands=0;
 const pair=()=>[jlrNumber(tokens[i++]),jlrNumber(tokens[i++])];
 while(i<tokens.length){const command=tokens[i++];assert.ok(++commands<=512);assert.ok(['M','L','H','V','Q','C','Z'].includes(command));
  if(command==='Z'){assert.ok(origin);current=[...origin];}
  else if(command==='H'||command==='V'){assert.ok(current);current=[...current];current[command==='H'?0:1]=jlrNumber(tokens[i++]);}
  else if(command==='Q'||command==='C'){assert.ok(current);points.push(pair());if(command==='C')points.push(pair());current=pair();}
  else{if(command==='L')assert.ok(current);current=pair();if(command==='M')origin=[...current];}
  points.push([...current]);
 }
 return points;
}

export function inspectInsuranceSvg(svg, lang, kind, inline=false) {
 assert.equal(typeof svg,'string');assert.ok(svg.length>100&&svg.length<25000);assert.doesNotMatch(svg,/<!|<\?|&(?!amp;|lt;|gt;|quot;|apos;)/u);assert.equal(XMLValidator.validate(svg),true);
 const roots=jlrParser.parse(svg);assert.equal(roots.length,1);const root=roots[0];assert.equal(jlrTag(root),'svg');
 const index=insuranceKinds.indexOf(kind);assert.ok(index>=0&&['fr','en'].includes(lang));const prefix=`jlr3-${lang}-f0${index+1}`,gold=INSURANCE_GOLDENS[`${kind}-${lang}`];
 const [,,width,height]=gold.viewBox.split(' '),expected={xmlns:'http://www.w3.org/2000/svg',width,height,viewBox:gold.viewBox,role:'img','aria-labelledby':`${prefix}-title ${prefix}-desc`,lang};
 if(inline)expected.style='width:100%;height:auto';assert.deepEqual(jlrAttrs(root),expected);
 const nodes=jlrNodes(root),ids=[];assert.ok(nodes.length<600);
 for(const n of nodes){const tag=jlrTag(n);if(tag==='#text')continue;assert.ok(Object.hasOwn(allowed,tag),`Passive SVG element ${tag}`);
  for(const[key,value]of Object.entries(jlrAttrs(n))){assert.ok(allowed[tag].has(key),`Allowed ${tag}.${key}`);assert.equal(typeof value,'string');assert.ok(value.length<=8192);
   if(numeric.has(key)){const number=jlrNumber(value);if(['width','height','rx','r','stroke-width','markerWidth','markerHeight'].includes(key))assert.ok(number>=0);if(['opacity','stop-opacity','offset'].includes(key))assert.ok(number>=0&&number<=1);}
   if(['fill','stroke','stop-color'].includes(key))assert.ok(palette.has(value)||key==='fill'&&kind==='window'&&['hatch','glow'].some(id=>value===`url(#${prefix}-${id})`));
   if(key==='id')ids.push(value);
   if(key==='font-family')assert.ok(['Inter Variable,Inter,Arial,Helvetica,sans-serif','JetBrains Mono Variable,DejaVu Sans Mono,monospace'].includes(value));
   if(key==='font-size')assert.ok(jlrNumber(value)>=22&&jlrNumber(value)<=60);
   if(key==='font-weight')assert.ok(['400','500','550','600','650','700'].includes(value));
   if(key==='text-anchor')assert.ok(['start','middle','end'].includes(value));
   if(key==='stroke-linecap'||key==='stroke-linejoin')assert.equal(value,'round');
   if(key==='d')insurancePathPoints(value);
   if(key==='marker-end')assert.ok(colors.some(color=>value===`url(#${prefix}-a-${color})`));
   if(key==='style')assert.ok(n===root&&inline&&value==='width:100%;height:auto');
  }
  if(tag==='marker'){const a=jlrAttrs(n);assert.ok(colors.some(color=>a.id===`${prefix}-a-${color}`));assert.deepEqual({...a,id:'marker'},{id:'marker',viewBox:'0 0 12 12',refX:'10',refY:'6',markerWidth:'8',markerHeight:'8',orient:'auto-start-reverse'});}
  if(tag==='pattern')assert.deepEqual(jlrAttrs(n),{id:`${prefix}-hatch`,patternUnits:'userSpaceOnUse',width:'13',height:'13'});
  if(tag==='linearGradient')assert.deepEqual(jlrAttrs(n),{id:`${prefix}-glow`,x1:'0',x2:'1'});
  if(tag==='text')assert.ok(jlrChildren(n).length&&jlrChildren(n).every(c=>jlrTag(c)==='tspan'));
  if(['title','desc','metadata','tspan'].includes(tag))assert.ok(jlrChildren(n).every(c=>jlrTag(c)==='#text'));
 }
 assert.deepEqual([...ids].sort(),[`${prefix}-title`,`${prefix}-desc`,`${prefix}-sources`,`${prefix}-hatch`,`${prefix}-glow`,...colors.map(c=>`${prefix}-a-${c}`)].sort());
 for(const[tag,count]of [['title',1],['desc',1],['metadata',1],['defs',1],['marker',6],['pattern',1],['linearGradient',1],['stop',2]])assert.equal(nodes.filter(n=>jlrTag(n)===tag).length,count);
 const metadata=jlrText(nodes.find(n=>jlrTag(n)==='metadata')).trim().split('\n');assert.equal(metadata.shift(),'Consultation / accessed: 2026-10-18.');
 const sources=metadata.filter(line=>line.includes('| https:')).map(line=>line.split('|').at(-1).trim());assert.deepEqual(sources,INSURANCE_EXPECTED_SOURCES[kind]);
 for(const url of sources){const parsed=new URL(url);assert.equal(parsed.href,url);assert.equal(parsed.protocol,'https:');assert.equal(parsed.username,'');assert.equal(parsed.password,'');assert.equal(parsed.hash,'');}
 return{root,nodes,width:Number(width),height:Number(height),prefix};
}

export function assertInsuranceFaithful(svg,lang,kind,inline=false) {
 inspectInsuranceSvg(svg,lang,kind,inline);
 const recovered=inline?svg.replace('<svg style="width:100%;height:auto" ','<svg '):svg;
 const gold=INSURANCE_GOLDENS[`${kind}-${lang}`];if(!inline)assert.equal(digest(recovered),gold.rawHash,'Complete supplied SVG retained');assert.equal(digest(JSON.stringify(jlrParser.parse(recovered))),gold.xmlHash,'Complete original XML including text retained');assert.equal(digest(JSON.stringify(jlrParser.parse(recovered).map(projection))),gold.geometryHash,'Every attribute and element order retained');
}

export function assertInsuranceGeometry(svg,lang,kind) {
 const{root,width,height}=inspectInsuranceSvg(svg,lang,kind);const val=(n,key)=>jlrNumber(jlrAttrs(n)[key]??'0');let shapes=0;
 const within=(points,padding=0)=>{for(const[x,y]of points)assert.ok(x-padding>=-.001&&y-padding>=-.001&&x+padding<=width+.001&&y+padding<=height+.001,'Visible geometry remains inside viewBox');};
 function walk(n){const tag=jlrTag(n),a=jlrAttrs(n);if(['defs','#text'].includes(tag))return;let points=[];
  if(tag==='rect')points=[[val(n,'x'),val(n,'y')],[val(n,'x')+val(n,'width'),val(n,'y')+val(n,'height')]];
  if(tag==='circle')points=[[val(n,'cx')-val(n,'r'),val(n,'cy')-val(n,'r')],[val(n,'cx')+val(n,'r'),val(n,'cy')+val(n,'r')]];
  if(tag==='line')points=[[val(n,'x1'),val(n,'y1')],[val(n,'x2'),val(n,'y2')]];
  if(tag==='path')points=insurancePathPoints(a.d);
  if(points.length){shapes++;within(points,a.stroke&&a.stroke!=='none'?val(n,'stroke-width')/2:0);}
  if(a['marker-end']){
   assert.ok(['line','path'].includes(tag));let segment=[[val(n,'x1'),val(n,'y1')],[val(n,'x2'),val(n,'y2')]];
   if(tag==='path'){assert.doesNotMatch(a.d,/Z/u);segment=insurancePathPoints(a.d).slice(-2);assert.equal(segment.length,2);}
   const[[startX,startY],[endX,endY]]=segment,angle=Math.atan2(endY-startY,endX-startX),factor=8/12*val(n,'stroke-width');
   const corners=[[0,0],[12,0],[0,12],[12,12]].map(([x,y])=>{const dx=(x-10)*factor,dy=(y-6)*factor;return[endX+Math.cos(angle)*dx-Math.sin(angle)*dy,endY+Math.sin(angle)*dx+Math.cos(angle)*dy];});within(corners);
  }
  if(tag==='text'){let y=val(n,'y');for(const child of jlrChildren(n)){y+=val(child,'dy');within([[val(child,'x'),y],[val(child,'x'),y-val(n,'font-size')]]);}}
  for(const child of jlrChildren(n))walk(child);
 }
 walk(root);return shapes;
}

export function assertInsuranceQuantitative(svg,lang,kind) {
 const{nodes}=inspectInsuranceSvg(svg,lang,kind),rects=nodes.filter(n=>jlrTag(n)==='rect').map(jlrAttrs),near=(actual,expected)=>assert.ok(Math.abs(Number(actual)-expected)<=.00051);
 if(kind==='vertu'){
  const bars=rects.filter(a=>a.height==='143');assert.equal(bars.length,3);near(bars[0].x,48);near(bars[0].width,904);near(bars[1].x,48);near(bars[1].width,904*.5/3.9);near(bars[2].x,48+904*.5/3.9-14);near(bars[2].width,14);
  assert.equal(39-5,34);const texts=nodes.filter(n=>jlrTag(n)==='text').map(jlrText);for(const value of lang==='fr'?['3,9 M£','0,5','3,4']:['£3.9m','0.5','3.4'])assert.ok(texts.includes(value));
 }
 if(kind==='marks-spencer'){
  const bars=rects.filter(a=>a.height==='127');assert.equal(bars.length,2);near(bars[0].x,48);near(bars[0].width,904);near(bars[1].x,48+904*101.6/131.3);near(bars[1].width,904*29.7/131.3);assert.equal(1313-1016,297);
  const texts=nodes.filter(n=>jlrTag(n)==='text').map(jlrText);for(const value of lang==='fr'?['101,6','+29,7','100 M£']:['101.6','+29.7','£100m'])assert.ok(texts.includes(value));
 }
}
