import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { XMLValidator } from 'fast-xml-parser';
import { jlrParser, jlrTag, jlrAttrs, jlrChildren, jlrNodes, jlrText, jlrNumber } from './jlr-svg-assertions.mjs';
export const GDP_GOLDENS = Object.freeze({
  "production-fr": {
    "rawHash": "b64a4cb224ffe86a62643d290849edbd124afe5f4b05b49840b2fe0176ad9648",
    "xmlHash": "b592897998a685dabceab9fa24c215c0de3ecd3de7adea88f4f99f4d941362b6",
    "geometryHash": "b3704cf19cb8c1379fa787b84a938c62ca3d264b48aed927041f36065ffafffa",
    "viewBox": "0 0 1000 1350"
  },
  "production-en": {
    "rawHash": "80f2ff68642c3df8c9c8d42d6fecfde909dfac4658d53a61d2dc42793a43325c",
    "xmlHash": "28661c2229f45a9c9f877cb7fc1ad2ebfe4430063e8aaeef4990f53e13ddf558",
    "geometryHash": "9120cd0eeb4ea5251182f3081262bf8510fb484552edba05577c4f2030d4c7bd",
    "viewBox": "0 0 1000 1350"
  },
  "recovery-fr": {
    "rawHash": "bde86064a60d3143e194f239de5caac5f5858ac068b4a0afba462dc5070477a3",
    "xmlHash": "56898f919a7d92b45d683c1ac50aaae7f354da2f440782cf429a0fb2135e9a82",
    "geometryHash": "b46efbae19fd1839c42ad3f7c0c026b6100d26295056929f51862c06bc8cf230",
    "viewBox": "0 0 1000 1570"
  },
  "recovery-en": {
    "rawHash": "2c3210e13f1e3fd49b8720bdfad341396fce20ad5a1c8795ed773c194a81f953",
    "xmlHash": "4045ba7ff4d3c242b4f01a60ede1100137477ecabc816ee13d02d8b55addd829",
    "geometryHash": "e13512f8ff234705a8acad9f99f37fc3969282a5d07b00526a0d23da9aa9361c",
    "viewBox": "0 0 1000 1570"
  },
  "value-added-fr": {
    "rawHash": "fc95d393f8a1c211518d25dc2f48a06d52a0be8a241be98995d859256ffc68c9",
    "xmlHash": "4eea802c68d5ceaac7016921a0f9b785d3e98c14b1aa1eaf3f4562d7de849ebd",
    "geometryHash": "3f63280932bf03694ab589a673ca3533968f57fd595b0ffc27fbec1e38ca5d02",
    "viewBox": "0 0 1000 1520"
  },
  "value-added-en": {
    "rawHash": "cc05aee5f6decf3d6d4446b84ea50ea90bb19235f22a7460f5dd44e8a6709a91",
    "xmlHash": "8f153c9fb1791c92070fcd94fe2cfa1526048650cac5644fc8c07a48f61b670b",
    "geometryHash": "70b505b604adc64629db8f9ab8283e16d470cfd6ddbeb43583c1294092285192",
    "viewBox": "0 0 1000 1520"
  },
  "hours-fr": {
    "rawHash": "8d080062b1cf07ce719723342905903cde2c8a9e301045a4cfc2b3fe720e6d1e",
    "xmlHash": "30f480be40b9e18e5529a1fe4ed1a4cc505b3e40148313b991d05d20cd648301",
    "geometryHash": "241a41a7f4649480254699855765775d6b8b9884975dc0f57a098a208d72f0bb",
    "viewBox": "0 0 1000 1510"
  },
  "hours-en": {
    "rawHash": "71840f1d4d2945eb8f6816fdfebeb80823a3148f19e7a2256eadc8f5d089fb1e",
    "xmlHash": "60db3c7b45fad2a500528bb996d8e0782e7d5d2331a7cf0ab3924591fc7b7bbe",
    "geometryHash": "abd72e428935618d2f62c04305b3326a139e762c1e6614876fe9aba94bdf9ba4",
    "viewBox": "0 0 1000 1510"
  }
});
export const GDP_EXPECTED_SOURCES = Object.freeze({
  "production": [
    "https://www.ons.gov.uk/economy/economicoutputandproductivity/output/timeseries/k23u/diop",
    "https://www.ons.gov.uk/economy/economicoutputandproductivity/output/bulletins/indexofproduction/august2026"
  ],
  "recovery": [
    "https://northernautoalliance.com/wp-content/uploads/2025/11/JLR-Categorisation-Statement_vf.pdf",
    "https://www.jlr.com/news/2026/02/jlr-q3-performance-impacted-previously-indicated-challenges"
  ],
  "value-added": [
    "https://www.ons.gov.uk/economy/nationalaccounts/uksectoraccounts/methodologies/aguidetotheuknationalaccountsmarch2020",
    "https://www.ons.gov.uk/economy/grossdomesticproductgdp/articles/bluebook2024advancedaggregateestimates/2024-08-07"
  ],
  "hours": [
    "https://www.annualreports.com/HostedData/AnnualReportArchive/a/LSE_AUTG_2023.pdf",
    "https://data.fca.org.uk/artefacts/NSM/RNS/5823384.html",
    "https://www.investegate.co.uk/announcement/rns/autins-group--autg/final-results/9640288"
  ]
});
export const GDP_BIBLIOGRAPHY_SOURCES = GDP_EXPECTED_SOURCES;
export const gdpKinds = Object.freeze(['production', 'recovery', 'value-added', 'hours']);
const digest = value => createHash('sha256').update(value).digest('hex');
const palette = new Set(['none','#0c0d10','#13161c','#1a1e26','#28303b','#3b4351','#69778d','#a9b3c2','#e7e9ee','#5eead4','#ff4d87','#f5b13d','#7aa2f7']);
const colors = ['teal','pink','amber','blue','quiet','text'];
const allowed = Object.fromEntries(Object.entries({
 svg:'xmlns width height viewBox role aria-labelledby lang style', title:'id', desc:'id', defs:'',
 marker:'id viewBox refX refY markerWidth markerHeight orient', path:'d fill stroke stroke-width stroke-linecap stroke-linejoin opacity marker-end',
 pattern:'id patternUnits width height', linearGradient:'id x1 y1 x2 y2', stop:'offset stop-color stop-opacity',
 rect:'x y width height rx fill stroke stroke-width opacity', text:'x y font-family font-size font-weight fill text-anchor', tspan:'x dy',
 line:'x1 y1 x2 y2 stroke stroke-width stroke-dasharray marker-end', g:'transform', circle:'cx cy r fill stroke stroke-width', metadata:'id',
}).map(([tag, list]) => [tag, new Set(list ? list.split(' ') : [])]));
const numeric = new Set('x y width height rx cx cy r x1 x2 y1 y2 dy font-size stroke-width refX refY markerWidth markerHeight opacity offset stop-opacity'.split(' '));
const projection = n => jlrTag(n)==='#text' ? null : [jlrTag(n),Object.entries(jlrAttrs(n)).sort(),jlrChildren(n).map(projection).filter(Boolean)];

// Consume the complete, bounded path grammar used by the supplied figures.
// Control points give a conservative hull for each quadratic/cubic segment.
export function gdpPathPoints(raw) {
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

export function inspectGdpSvg(svg, lang, kind, inline=false) {
 assert.equal(typeof svg,'string');assert.ok(svg.length>100&&svg.length<25000);assert.doesNotMatch(svg,/<!|<\?|&(?!amp;|lt;|gt;|quot;|apos;)/u);assert.equal(XMLValidator.validate(svg),true);
 const roots=jlrParser.parse(svg);assert.equal(roots.length,1);const root=roots[0];assert.equal(jlrTag(root),'svg');
 const index=gdpKinds.indexOf(kind);assert.ok(index>=0&&['fr','en'].includes(lang));const prefix=`jlr4-${lang}-0${index+1}`,gold=GDP_GOLDENS[`${kind}-${lang}`];
 const [,,width,height]=gold.viewBox.split(' '),expected={xmlns:'http://www.w3.org/2000/svg',width,height,viewBox:gold.viewBox,role:'img','aria-labelledby':`${prefix}-title ${prefix}-desc`,lang};
 if(inline)expected.style='width:100%;height:auto';assert.deepEqual(jlrAttrs(root),expected);
 const nodes=jlrNodes(root),ids=[];assert.ok(nodes.length<600);
 for(const n of nodes){const tag=jlrTag(n);if(tag==='#text')continue;assert.ok(Object.hasOwn(allowed,tag),`Passive SVG element ${tag}`);
  for(const[key,value]of Object.entries(jlrAttrs(n))){assert.ok(allowed[tag].has(key),`Allowed ${tag}.${key}`);assert.equal(typeof value,'string');assert.ok(value.length<=8192);
   if(numeric.has(key)){const number=jlrNumber(value);if(['width','height','rx','r','stroke-width','markerWidth','markerHeight'].includes(key))assert.ok(number>=0);if(['opacity','stop-opacity','offset'].includes(key))assert.ok(number>=0&&number<=1);}
   if(['fill','stroke','stop-color'].includes(key))assert.ok(palette.has(value)||key==='fill'&&[...colors.map(color=>`hatch-${color}`),'pinkfade','tealfade'].some(id=>value===`url(#${prefix}-${id})`));
   if(key==='id')ids.push(value);
   if(key==='font-family')assert.ok(['Inter Variable,Inter,Arial,sans-serif','JetBrains Mono Variable,DejaVu Sans Mono,monospace'].includes(value));
   if(key==='font-size')assert.ok(jlrNumber(value)>=22&&jlrNumber(value)<=65);
   if(key==='font-weight')assert.ok(['400','500','550','600','650','700'].includes(value));
   if(key==='text-anchor')assert.ok(['start','middle','end'].includes(value));
   if(key==='stroke-linecap'||key==='stroke-linejoin')assert.equal(value,'round');
   if(key==='d')gdpPathPoints(value);
   if(key==='marker-end')assert.ok(colors.some(color=>value===`url(#${prefix}-arrow-${color})`));
   if(key==='stroke-dasharray')assert.match(value,/^\d{1,2}(?: \d{1,2})?$/u);
   if(key==='transform')assert.ok(tag==='g'&&kind==='value-added'&&['translate(427 298) scale(1.05)','translate(745 323) scale(0.76)'].includes(value));
   if(key==='style')assert.ok(n===root&&inline&&value==='width:100%;height:auto');
  }
  if(tag==='marker'){const a=jlrAttrs(n);assert.ok(colors.some(color=>a.id===`${prefix}-arrow-${color}`));assert.deepEqual({...a,id:'marker'},{id:'marker',viewBox:'0 0 12 12',refX:'10',refY:'6',markerWidth:'9',markerHeight:'9',orient:'auto-start-reverse'});}
  if(tag==='pattern'){const a=jlrAttrs(n);assert.ok(colors.some(color=>a.id===`${prefix}-hatch-${color}`));assert.deepEqual({...a,id:'hatch'},{id:'hatch',width:'12',height:'12',patternUnits:'userSpaceOnUse'});}
  if(tag==='linearGradient'){const a=jlrAttrs(n);assert.ok(['pinkfade','tealfade'].some(id=>a.id===`${prefix}-${id}`));assert.deepEqual(a,a.id===`${prefix}-pinkfade`?{id:a.id,x1:'0',y1:'0',x2:'0',y2:'1'}:{id:a.id,x1:'0',y1:'0',x2:'1',y2:'0'});}
  if(tag==='text')assert.ok(jlrChildren(n).length&&jlrChildren(n).every(c=>jlrTag(c)==='tspan'));
  if(['title','desc','metadata','tspan'].includes(tag))assert.ok(jlrChildren(n).every(c=>jlrTag(c)==='#text'));
 }
 assert.deepEqual([...ids].sort(),[`${prefix}-title`,`${prefix}-desc`,`${prefix}-sources`,`${prefix}-pinkfade`,`${prefix}-tealfade`,...colors.flatMap(c=>[`${prefix}-arrow-${c}`,`${prefix}-hatch-${c}`])].sort());
 for(const[tag,count]of [['title',1],['desc',1],['metadata',1],['defs',1],['marker',6],['pattern',6],['linearGradient',2],['stop',4]])assert.equal(nodes.filter(n=>jlrTag(n)===tag).length,count);
 const metadata=jlrText(nodes.find(n=>jlrTag(n)==='metadata')).trim().split('\n');assert.equal(metadata.shift(),`Accessed 2026-10-18. Graphic ${index+1}; geometry defined by edition/build-figures.py.`);
 const sources=metadata.filter(line=>line.trim()).map(line=>line.split(';').at(-1).trim());assert.deepEqual(sources,GDP_EXPECTED_SOURCES[kind]);
 for(const url of sources){const parsed=new URL(url);assert.equal(parsed.href,url);assert.equal(parsed.protocol,'https:');assert.equal(parsed.username,'');assert.equal(parsed.password,'');assert.equal(parsed.hash,'');}
 return{root,nodes,width:Number(width),height:Number(height),prefix};
}

export function assertGdpFaithful(svg,lang,kind,inline=false) {
 inspectGdpSvg(svg,lang,kind,inline);
 const recovered=inline?svg.replace('<svg style="width:100%;height:auto" ','<svg '):svg;
 const gold=GDP_GOLDENS[`${kind}-${lang}`];if(!inline)assert.equal(digest(recovered),gold.rawHash,'Complete supplied SVG retained');assert.equal(digest(JSON.stringify(jlrParser.parse(recovered))),gold.xmlHash,'Complete original XML including text retained');assert.equal(digest(JSON.stringify(jlrParser.parse(recovered).map(projection))),gold.geometryHash,'Every attribute and element order retained');
}

export function assertGdpGeometry(svg,lang,kind) {
 const{root,width,height}=inspectGdpSvg(svg,lang,kind);const val=(n,key)=>jlrNumber(jlrAttrs(n)[key]??'0');let shapes=0;
 const within=(points,padding=0)=>{for(const[x,y]of points)assert.ok(x-padding>=-.001&&y-padding>=-.001&&x+padding<=width+.001&&y+padding<=height+.001,'Visible geometry remains inside viewBox');};
 function walk(n,scale=1,dx=0,dy=0){const tag=jlrTag(n),a=jlrAttrs(n);if(['defs','#text'].includes(tag))return;let points=[];
  if(tag==='rect')points=[[val(n,'x'),val(n,'y')],[val(n,'x')+val(n,'width'),val(n,'y')+val(n,'height')]];
  if(tag==='circle')points=[[val(n,'cx')-val(n,'r'),val(n,'cy')-val(n,'r')],[val(n,'cx')+val(n,'r'),val(n,'cy')+val(n,'r')]];
  if(tag==='line')points=[[val(n,'x1'),val(n,'y1')],[val(n,'x2'),val(n,'y2')]];
  if(tag==='path')points=gdpPathPoints(a.d);
  const transform=points=>points.map(([x,y])=>[dx+x*scale,dy+y*scale]);
  if(points.length){shapes++;within(transform(points),a.stroke&&a.stroke!=='none'?val(n,'stroke-width')/2*scale:0);}
  if(a['marker-end']){
   assert.ok(['line','path'].includes(tag));let segment=[[val(n,'x1'),val(n,'y1')],[val(n,'x2'),val(n,'y2')]];
   if(tag==='path'){assert.doesNotMatch(a.d,/Z/u);segment=gdpPathPoints(a.d).slice(-2);assert.equal(segment.length,2);}
   const[[startX,startY],[endX,endY]]=segment,angle=Math.atan2(endY-startY,endX-startX),factor=9/12*val(n,'stroke-width');
   const corners=[[0,0],[12,0],[0,12],[12,12]].map(([x,y])=>{const dx=(x-10)*factor,dy=(y-6)*factor;return[endX+Math.cos(angle)*dx-Math.sin(angle)*dy,endY+Math.sin(angle)*dx+Math.cos(angle)*dy];});within(transform(corners));
  }
  if(tag==='text'){let y=val(n,'y');for(const child of jlrChildren(n)){y+=val(child,'dy');within(transform([[val(child,'x'),y],[val(child,'x'),y-val(n,'font-size')]]));}}
  if(tag==='g'){const match=/^translate\((\d+) (\d+)\) scale\((\d+(?:\.\d+)?)\)$/u.exec(a.transform);assert.ok(match);dx+=Number(match[1])*scale;dy+=Number(match[2])*scale;scale*=Number(match[3]);}
  for(const child of jlrChildren(n))walk(child,scale,dx,dy);
 }
 walk(root);return shapes;
}


export function assertGdpQuantitative(svg,lang,kind) {
 const{nodes}=inspectGdpSvg(svg,lang,kind),near=(actual,expected)=>assert.ok(Math.abs(Number(actual)-expected)<=.00051), texts=nodes.filter(n=>jlrTag(n)==='text').map(jlrText);
 if(kind==='production'){
  // One vintage and one explicit reference month: ONS CVMSA K23U, August 2025 = 100.
  const published=[88.5,61.9,68.6,86.1,83.3],points=nodes.filter(n=>jlrTag(n)==='circle'&&jlrAttrs(n).r==='7');assert.equal(points.length,5);
  for(const[i,node]of points.entries()){const a=jlrAttrs(node);near(a.cx,132+198*i);near(a.cy,734-(published[i]/published[0]*100)*434/110);}
  const curve=nodes.filter(n=>jlrTag(n)==='path'&&jlrAttrs(n)['stroke-width']==='4.5');assert.equal(curve.length,1);const path=gdpPathPoints(jlrAttrs(curve[0]).d);assert.equal(path.length,5);for(const[i,point]of path.entries()){near(point[0],132+198*i);near(point[1],734-published[i]/published[0]*100*434/110);}
  for(const value of lang==='fr'?['100,0','69,9','77,5','97,3','94,1','+25,5 %','−2,7 %']:['100.0','69.9','77.5','97.3','94.1','+25.5 %','−2.7 %'])assert.ok(texts.includes(value));
 }
 if(kind==='recovery'){
  // The estimate range shares one linear scale; dates and duration remain schematic.
  const range=nodes.filter(n=>jlrTag(n)==='circle'&&jlrAttrs(n).r==='9');assert.equal(range.length,1);near(jlrAttrs(range[0]).cx,514+(1.9-1.5)/.7*394);
  const interval=nodes.filter(n=>jlrTag(n)==='line'&&jlrAttrs(n)['stroke-width']==='8');assert.equal(interval.length,1);near(jlrAttrs(interval[0]).x1,514+(1.6-1.5)/.7*394);near(jlrAttrs(interval[0]).x2,514+(2.1-1.5)/.7*394);
  assert.ok(texts.includes(lang==='fr'?'1,9 Md£':'£1.9bn'));assert.ok(texts.includes('120 %')||texts.includes('120%'));
 }
 if(kind==='value-added'){
  const groups=nodes.filter(n=>jlrTag(n)==='g');assert.deepEqual(groups.map(jlrAttrs),[{transform:'translate(427 298) scale(1.05)'},{transform:'translate(745 323) scale(0.76)'}]);
  assert.ok(texts.includes(lang==='fr'?'PIB':'GDP'));
 }
 if(kind==='hours'){
  // Symbolic cells are preserved, without assigning observed hours or salaries.
  const cells=nodes.filter(n=>jlrTag(n)==='circle'&&jlrAttrs(n).cy==='979');assert.equal(cells.length,4);
 }
}
