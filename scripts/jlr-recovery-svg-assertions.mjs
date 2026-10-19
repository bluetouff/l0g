import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { XMLValidator } from 'fast-xml-parser';
import { jlrParser, jlrTag, jlrAttrs, jlrChildren, jlrNodes, jlrText, jlrNumber } from './jlr-svg-assertions.mjs';
export const RECOVERY_GOLDENS = Object.freeze({
  "reconstruction-fr": {
    "rawHash": "3400e66019fe4c1db09e8a01653b9dfd985bae1f853a986955112bb614a4b481",
    "xmlHash": "4a47c52cc5393937a7a110da9933fe2f5e63ba972a93a66a8eaaa665d7f26844",
    "geometryHash": "504ef1b54f84abe3fe431d32339ec797de51115c1cf025e4d759022dfcc20083",
    "viewBox": "0 0 1000 1680"
  },
  "reconstruction-en": {
    "rawHash": "a245605e9606c5851ee0e099aff6f4100a033874b4b6dce820f5c10bf05ab92d",
    "xmlHash": "60f2c6e3bfb25b3534cb1cdbd1cdefd6ff8b84af51fa7b907671f7fc09eb7808",
    "geometryHash": "b0c997c9a910968c3dd986b4040b06a7163207918b995918a255128906c0f39c",
    "viewBox": "0 0 1000 1680"
  },
  "ms-costs-fr": {
    "rawHash": "43c269ed378c511ec5d5de109691d60339d8a4f045e8ffdac43d4815fb419c77",
    "xmlHash": "74aed39d041100a3ed23967fc2aaac9572280e832de9d987954d6c8923d4d773",
    "geometryHash": "8b1c3d004b56230a3a0bbee6bdeb94b259731e4911599ad3c08ad70a752550b2",
    "viewBox": "0 0 1000 1590"
  },
  "ms-costs-en": {
    "rawHash": "a71e6b3fa6163011ad231a02d7e098d28553a35b5e5fddca4a9c69c95278fe83",
    "xmlHash": "6af2e6e8d9b2f42d365c699782d6457ff081b53867535a397e18c4c73814c483",
    "geometryHash": "07fde5cfb9d303916a7f8bbe8a95a1cb8ac677069e1030cd077cdb6fb013a3fc",
    "viewBox": "0 0 1000 1590"
  },
  "ncc-retainer-fr": {
    "rawHash": "e53368de2ef341cf5f9d8cc46de0fdc20a445d8db77d87304e96f44b2cdf4d8d",
    "xmlHash": "5926d42e9e7a177f200e6f8e72db7a3d09b27fb231e9346196e2eaea18011eed",
    "geometryHash": "76bf1cc3f28957368f25922de2fef8338e46d07cc3d818c243998966cc59def1",
    "viewBox": "0 0 1000 1870"
  },
  "ncc-retainer-en": {
    "rawHash": "c36cda069c92927f0871610e78e3803145c365e53fa7817888644ede5979240d",
    "xmlHash": "0ffee38050165ac6ee0cdb389b9a0563c87d20eb0eeebb00d5be3b2aa5197fc3",
    "geometryHash": "0ca76bd0fb4a291dbf85666f7f656735d733fac4adc0c1dc2d1b944922a6bc46",
    "viewBox": "0 0 1000 1870"
  },
  "workstreams-fr": {
    "rawHash": "cacfdfc7589a6a73d117f7f8e730383c08832c4d4da840516827cb81e7a2a161",
    "xmlHash": "f08564443abbbcc02f19580d1e697629ddd57152a30689d3f596ce29316cc25d",
    "geometryHash": "cb73d743cc1c87d5414a5098a837dde537950574a3152e37acfcd099885356be",
    "viewBox": "0 0 1000 1790"
  },
  "workstreams-en": {
    "rawHash": "1291632829ed0af177d5708e4b55e03c5d177282126c2a91646e1143db796474",
    "xmlHash": "c7759b1ca83f93e15f7c54559074373e676ac9ef5df0a93d4cdce6f67a1b8d5e",
    "geometryHash": "76f68b0b5bcb628faeb647248c52a4c8ec0fd8b7477a98c834215527b26d3994",
    "viewBox": "0 0 1000 1790"
  }
});
export const RECOVERY_EXPECTED_SOURCES = Object.freeze({
  "reconstruction": [
    "https://www.bl.uk/files/v5dwkion/production/99206a2d1e9f07b35712b78f7d75fbb09560c08d.pdf/british-library-cyber-incident-review-8-march-2024.pdf?dl="
  ],
  "ms-costs": [
    "https://corporate.marksandspencer.com/sites/marksandspencer/files/marksandspencer/annual-report/m-and-s-annual-report-and-financial-statements-2026.pdf",
    "https://corporate.marksandspencer.com/sites/marksandspencer/files/2026-05/fy26-rns.pdf"
  ],
  "ncc-retainer": [
    "https://assets.applytosupply.digitalmarketplace.service.gov.uk/g-cloud-14/documents/716961/929698583726031-pricing-document-2024-05-07-0128.pdf",
    "https://assets.applytosupply.digitalmarketplace.service.gov.uk/g-cloud-14/documents/716961/929698583726031-terms-and-conditions-2024-05-07-0015.pdf",
    "https://assets.applytosupply.digitalmarketplace.service.gov.uk/g-cloud-14/documents/716961/929698583726031-service-definition-document-2024-05-07-1154.pdf"
  ],
  "workstreams": [
    "https://www.bl.uk/files/v5dwkion/production/99206a2d1e9f07b35712b78f7d75fbb09560c08d.pdf/british-library-cyber-incident-review-8-march-2024.pdf?dl=",
    "https://assets.publishing.service.gov.uk/media/6a57634e6d6d5c7e2845c9c0/British_Library_Annual_Report_and_Accounts_2025-26_WEB_NAO_14_July_v2.pdf",
    "https://www.bl.uk/stories/news/ethos-records-restored"
  ]
});
export const RECOVERY_BIBLIOGRAPHY_SOURCES = RECOVERY_EXPECTED_SOURCES;
export const recoveryKinds = Object.freeze(["reconstruction", "ms-costs", "ncc-retainer", "workstreams"]);
// Numeric brace entities are a spelling detail of the supplied NCC metadata.
// HTML serialisation resolves them; canonical XML checks compare the same characters.
const canonicalXml = value => jlrParser.parse(value.replaceAll('&#123;', '{').replaceAll('&#125;', '}'));
const metadataJson = node => JSON.parse(jlrText(node).replaceAll('&#123;', '{').replaceAll('&#125;', '}'));
const digest = value => createHash('sha256').update(value).digest('hex');
const palette = new Set(['none','#0c0d10','#13161c','#1a1e26','#28303b','#3b4351','#69778d','#a9b3c2','#e7e9ee','#5eead4','#ff4d87','#f5b13d','#7aa2f7']);
const colors = ['teal','pink','amber','blue','quiet','text','muted'];
const allowed = Object.fromEntries(Object.entries({
 svg:'xmlns width height viewBox role aria-labelledby lang style', title:'id', desc:'id', defs:'',
 marker:'id viewBox refX refY markerWidth markerHeight orient', path:'d fill stroke stroke-width stroke-linecap stroke-linejoin opacity marker-end stroke-dasharray',
 pattern:'id patternUnits width height', linearGradient:'id x1 y1 x2 y2', stop:'offset stop-color stop-opacity',
 rect:'x y width height rx fill stroke stroke-width opacity', text:'x y font-family font-size font-weight fill text-anchor', tspan:'x dy',
 line:'x1 y1 x2 y2 stroke stroke-width stroke-dasharray marker-end', circle:'cx cy r fill stroke stroke-width', ellipse:'cx cy rx ry fill stroke stroke-width', metadata:'id',
}).map(([tag, list]) => [tag, new Set(list ? list.split(' ') : [])]));
const numeric = new Set('x y width height rx ry cx cy r x1 x2 y1 y2 dy font-size stroke-width refX refY markerWidth markerHeight opacity offset stop-opacity'.split(' '));
const projection = n => jlrTag(n)==='#text' ? null : [jlrTag(n),Object.entries(jlrAttrs(n)).sort(),jlrChildren(n).map(projection).filter(Boolean)];

// Consume the complete, bounded path grammar used by the supplied figures.
// Control points give a conservative hull for each quadratic/cubic segment.
export function recoveryPathPoints(raw) {
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

export function inspectRecoverySvg(svg, lang, kind, inline=false) {
 assert.equal(typeof svg,'string');assert.ok(svg.length>100&&svg.length<32000);assert.doesNotMatch(svg,/<!|<\?|&(?!amp;|lt;|gt;|quot;|apos;|#123;|#125;)/u);assert.equal(XMLValidator.validate(svg),true);
 const roots=jlrParser.parse(svg);assert.equal(roots.length,1);const root=roots[0];assert.equal(jlrTag(root),'svg');
 const index=recoveryKinds.indexOf(kind);assert.ok(index>=0&&['fr','en'].includes(lang));const prefix=`jlr5-${lang}-0${index+1}`,gold=RECOVERY_GOLDENS[`${kind}-${lang}`];
 const [,,width,height]=gold.viewBox.split(' '),expected={xmlns:'http://www.w3.org/2000/svg',width,height,viewBox:gold.viewBox,role:'img','aria-labelledby':`${prefix}-title ${prefix}-desc`,lang};
 if(inline)expected.style='width:100%;height:auto';assert.deepEqual(jlrAttrs(root),expected);
 const nodes=jlrNodes(root),ids=[];assert.ok(nodes.length<600);
 const localColors=kind==='ms-costs'?colors.slice(0,6):kind==='ncc-retainer'?['teal','pink','amber','blue','muted']:colors.slice(0,5),gradients=kind==='ncc-retainer'?[]:kind==='ms-costs'?['pinkfade','tealfade']:['teal-fade','blue-fade'];
 for(const n of nodes){const tag=jlrTag(n);if(tag==='#text')continue;assert.ok(Object.hasOwn(allowed,tag),`Passive SVG element ${tag}`);
  for(const[key,value]of Object.entries(jlrAttrs(n))){assert.ok(allowed[tag].has(key),`Allowed ${tag}.${key}`);assert.equal(typeof value,'string');assert.ok(value.length<=8192);
   if(numeric.has(key)){const number=jlrNumber(value);if(['width','height','rx','ry','r','stroke-width','markerWidth','markerHeight'].includes(key))assert.ok(number>=0);if(['opacity','stop-opacity','offset'].includes(key))assert.ok(number>=0&&number<=1);}
   if(['fill','stroke','stop-color'].includes(key))assert.ok(palette.has(value)||key==='fill'&&[...localColors.map(color=>`hatch-${color}`),...gradients].some(id=>value===`url(#${prefix}-${id})`));
   if(key==='id')ids.push(value);
   if(key==='font-family')assert.ok(['Inter Variable,Inter,Arial,sans-serif','JetBrains Mono Variable,DejaVu Sans Mono,monospace'].includes(value));
   if(key==='font-size')assert.ok(jlrNumber(value)>=22&&jlrNumber(value)<=64);
   if(key==='font-weight')assert.ok(['400','500','550','600','650','700'].includes(value));
   if(key==='text-anchor')assert.ok(['start','middle','end'].includes(value));
   if(key==='stroke-linecap'||key==='stroke-linejoin')assert.equal(value,'round');
   if(key==='d')recoveryPathPoints(value);
   if(key==='marker-end')assert.ok(localColors.some(color=>value===`url(#${prefix}-arrow-${color})`));
   if(key==='stroke-dasharray')assert.match(value,/^\d{1,2}(?: \d{1,2})?$/u);
   if(key==='style')assert.ok(n===root&&inline&&value==='width:100%;height:auto');
  }
  if(tag==='marker'){const a=jlrAttrs(n);assert.ok(localColors.some(color=>a.id===`${prefix}-arrow-${color}`));assert.deepEqual({...a,id:'marker'},{id:'marker',viewBox:'0 0 12 12',refX:'10',refY:'6',markerWidth:'9',markerHeight:'9',orient:'auto-start-reverse'});}
  if(tag==='pattern'){const a=jlrAttrs(n),size=kind==='ncc-retainer'?'10':'12';assert.ok(localColors.some(color=>a.id===`${prefix}-hatch-${color}`));assert.deepEqual({...a,id:'hatch'},{id:'hatch',width:size,height:size,patternUnits:'userSpaceOnUse'});}
  if(tag==='linearGradient'){const a=jlrAttrs(n);assert.ok(gradients.some(id=>a.id===`${prefix}-${id}`));assert.deepEqual(a,a.id===`${prefix}-pinkfade`?{id:a.id,x1:'0',y1:'0',x2:'0',y2:'1'}:{id:a.id,x1:'0',y1:'0',x2:'1',y2:'0'});}
  if(tag==='text')assert.ok(jlrChildren(n).length&&jlrChildren(n).every(c=>jlrTag(c)==='tspan'));
  if(['title','desc','metadata','tspan'].includes(tag))assert.ok(jlrChildren(n).every(c=>jlrTag(c)==='#text'));
 }
 assert.deepEqual([...ids].sort(),[`${prefix}-title`,`${prefix}-desc`,`${prefix}-sources`,...(kind==='ncc-retainer'?[`${prefix}-method`]:[]),...gradients.map(id=>`${prefix}-${id}`),...localColors.flatMap(c=>[`${prefix}-arrow-${c}`,`${prefix}-hatch-${c}`])].sort());
 for(const[tag,count]of [['title',1],['desc',1],['metadata',kind==='ncc-retainer'?2:1],['defs',1],['marker',localColors.length],['pattern',localColors.length],['linearGradient',gradients.length],['stop',gradients.length*2]])assert.equal(nodes.filter(n=>jlrTag(n)===tag).length,count);
 const metadata=nodes.filter(n=>jlrTag(n)==='metadata'&&jlrAttrs(n).id===`${prefix}-sources`);assert.equal(metadata.length,1);const raw=jlrText(metadata[0]).trim();let sources;
 if(kind==='reconstruction'||kind==='workstreams'){
  const data=JSON.parse(raw);assert.equal(data.graphic,index+1);assert.equal(data.language,lang);assert.equal(data.as_of,'2026-10-18');assert.deepEqual(data.interpretation.source_refs,kind==='reconstruction'?[1]:[1,3,4]);assert.deepEqual(Object.keys(data.sources),kind==='reconstruction'?['1']:['1','3','4']);sources=Object.values(data.sources).map(source=>source.url);
 }else if(kind==='ms-costs'){
  const lines=raw.split('\n');assert.equal(lines.shift(),'Accessed 2026-10-18. Graphic 2; geometry defined by edition/build-ms-figure.py.');assert.equal(lines.length,2);sources=lines.map(line=>line.split(';').at(-1).trim());
 }else{
  const lines=raw.split('\n');assert.equal(lines.length,3);sources=lines.map(line=>line.split(' ').at(-1));
  const method=nodes.filter(n=>jlrTag(n)==='metadata'&&jlrAttrs(n).id===`${prefix}-method`);assert.equal(method.length,1);const data=metadataJson(method[0]);assert.equal(data.figure,'03-ncc-retainer');assert.equal(data.as_of,'2026-10-18');assert.deepEqual(data.source_refs,[8,9,10]);
 }
 assert.deepEqual(sources,RECOVERY_EXPECTED_SOURCES[kind]);
 for(const url of sources){const parsed=new URL(url);assert.equal(parsed.href,url);assert.equal(parsed.protocol,'https:');assert.equal(parsed.username,'');assert.equal(parsed.password,'');assert.equal(parsed.hash,'');}
 return{root,nodes,width:Number(width),height:Number(height),prefix};
}

export const RECOVERY_PANEL_EDITS = Object.freeze({
  "fr": [
    {
      "before": "<text x=\"72\" y=\"1121\" font-family=\"Inter Variable,Inter,Arial,sans-serif\" font-size=\"22\" font-weight=\"400\" fill=\"#a9b3c2\" text-anchor=\"start\"><tspan x=\"72\" dy=\"0\">Davantage de comptages</tspan></text>",
      "after": "<text x=\"72\" y=\"1110\" font-family=\"Inter Variable,Inter,Arial,sans-serif\" font-size=\"22\" font-weight=\"400\" fill=\"#a9b3c2\" text-anchor=\"start\"><tspan x=\"72\" dy=\"0\">Davantage de</tspan><tspan x=\"72\" dy=\"27\">comptages</tspan></text>"
    },
    {
      "before": "<text x=\"383\" y=\"1083\" font-family=\"Inter Variable,Inter,Arial,sans-serif\" font-size=\"24\" font-weight=\"600\" fill=\"#e7e9ee\" text-anchor=\"start\"><tspan x=\"383\" dy=\"0\">Commandes, factures</tspan></text>",
      "after": "<text x=\"383\" y=\"1063\" font-family=\"Inter Variable,Inter,Arial,sans-serif\" font-size=\"24\" font-weight=\"600\" fill=\"#e7e9ee\" text-anchor=\"start\"><tspan x=\"383\" dy=\"0\">Commandes,</tspan><tspan x=\"383\" dy=\"28\">factures</tspan></text>"
    }
  ],
  "en": [
    {
      "before": "<text x=\"612\" y=\"542\" font-family=\"Inter Variable,Inter,Arial,sans-serif\" font-size=\"22\" font-weight=\"500\" fill=\"#e7e9ee\" text-anchor=\"start\"><tspan x=\"612\" dy=\"0\">Calculated residual: third parties,</tspan></text>",
      "after": "<text x=\"612\" y=\"539\" font-family=\"Inter Variable,Inter,Arial,sans-serif\" font-size=\"22\" font-weight=\"500\" fill=\"#e7e9ee\" text-anchor=\"start\"><tspan x=\"612\" dy=\"0\">Calculated residual:</tspan><tspan x=\"612\" dy=\"27\">third parties,</tspan></text>"
    },
    {
      "before": "<text x=\"612\" y=\"574\" font-family=\"Inter Variable,Inter,Arial,sans-serif\" font-size=\"22\" font-weight=\"400\" fill=\"#a9b3c2\" text-anchor=\"start\"><tspan x=\"612\" dy=\"0\">predominantly specialist legal</tspan><tspan x=\"612\" dy=\"29.92\">and professional services</tspan></text>",
      "after": "<text x=\"612\" y=\"598\" font-family=\"Inter Variable,Inter,Arial,sans-serif\" font-size=\"22\" font-weight=\"400\" fill=\"#a9b3c2\" text-anchor=\"start\"><tspan x=\"612\" dy=\"0\">predominantly specialist legal</tspan><tspan x=\"612\" dy=\"29.92\">and professional services</tspan></text>"
    },
    {
      "before": "<text x=\"612\" y=\"651\" font-family=\"JetBrains Mono Variable,DejaVu Sans Mono,monospace\" font-size=\"22\" font-weight=\"500\" fill=\"#ff4d87\" text-anchor=\"start\"><tspan x=\"612\" dy=\"0\">131.3 − 109.3 = 22.0</tspan></text>",
      "after": "<text x=\"612\" y=\"661\" font-family=\"JetBrains Mono Variable,DejaVu Sans Mono,monospace\" font-size=\"22\" font-weight=\"500\" fill=\"#ff4d87\" text-anchor=\"start\"><tspan x=\"612\" dy=\"0\">131.3 − 109.3 = 22.0</tspan></text>"
    },
    {
      "before": "<text x=\"72\" y=\"1121\" font-family=\"Inter Variable,Inter,Arial,sans-serif\" font-size=\"22\" font-weight=\"400\" fill=\"#a9b3c2\" text-anchor=\"start\"><tspan x=\"72\" dy=\"0\">More count attendances</tspan></text>",
      "after": "<text x=\"72\" y=\"1110\" font-family=\"Inter Variable,Inter,Arial,sans-serif\" font-size=\"22\" font-weight=\"400\" fill=\"#a9b3c2\" text-anchor=\"start\"><tspan x=\"72\" dy=\"0\">More count</tspan><tspan x=\"72\" dy=\"27\">attendances</tspan></text>"
    }
  ]
});

export function assertRecoveryFaithful(svg,lang,kind,inline=false) {
 inspectRecoverySvg(svg,lang,kind,inline);
 let recovered=inline?svg.replace('<svg style="width:100%;height:auto" ','<svg '):svg;
 if(inline&&lang==='fr'&&kind==='ms-costs'){assert.equal(recovered.split('M&amp;S : les travaux du redémarrage').length-1,2);recovered=recovered.replaceAll('M&amp;S : les travaux du redémarrage','M&amp;S : ce que mobilise le redémarrage');}
 if(inline&&kind==='ms-costs')for(const {before,after}of RECOVERY_PANEL_EDITS[lang]){assert.equal(recovered.split(after).length-1,1,'Exactly one reviewed panel adjustment');recovered=recovered.replace(after,before);}
 const gold=RECOVERY_GOLDENS[`${kind}-${lang}`];if(!inline)assert.equal(digest(recovered),gold.rawHash,'Complete supplied SVG retained');assert.equal(digest(JSON.stringify(canonicalXml(recovered))),gold.xmlHash,'Complete original XML including text retained');assert.equal(digest(JSON.stringify(canonicalXml(recovered).map(projection))),gold.geometryHash,'Every attribute and element order retained');
}
export function assertRecoveryGeometry(svg,lang,kind) {
 const{root,width,height}=inspectRecoverySvg(svg,lang,kind);const val=(n,key)=>jlrNumber(jlrAttrs(n)[key]??'0');let shapes=0;
 const within=(points,padding=0)=>{for(const[x,y]of points)assert.ok(x-padding>=-.001&&y-padding>=-.001&&x+padding<=width+.001&&y+padding<=height+.001,'Visible geometry remains inside viewBox');};
 function walk(n,scale=1,dx=0,dy=0){const tag=jlrTag(n),a=jlrAttrs(n);if(['defs','#text'].includes(tag))return;let points=[];
  if(tag==='rect')points=[[val(n,'x'),val(n,'y')],[val(n,'x')+val(n,'width'),val(n,'y')+val(n,'height')]];
  if(tag==='ellipse')points=[[val(n,'cx')-val(n,'rx'),val(n,'cy')-val(n,'ry')],[val(n,'cx')+val(n,'rx'),val(n,'cy')+val(n,'ry')]];
  if(tag==='circle')points=[[val(n,'cx')-val(n,'r'),val(n,'cy')-val(n,'r')],[val(n,'cx')+val(n,'r'),val(n,'cy')+val(n,'r')]];
  if(tag==='line')points=[[val(n,'x1'),val(n,'y1')],[val(n,'x2'),val(n,'y2')]];
  if(tag==='path')points=recoveryPathPoints(a.d);
  const transform=points=>points.map(([x,y])=>[dx+x*scale,dy+y*scale]);
  if(points.length){shapes++;within(transform(points),a.stroke&&a.stroke!=='none'?val(n,'stroke-width')/2*scale:0);}
  if(a['marker-end']){
   assert.ok(['line','path'].includes(tag));let segment=[[val(n,'x1'),val(n,'y1')],[val(n,'x2'),val(n,'y2')]];
   if(tag==='path'){assert.doesNotMatch(a.d,/Z/u);segment=recoveryPathPoints(a.d).slice(-2);assert.equal(segment.length,2);}
   const[[startX,startY],[endX,endY]]=segment,angle=Math.atan2(endY-startY,endX-startX),factor=9/12*val(n,'stroke-width');
   const corners=[[0,0],[12,0],[0,12],[12,12]].map(([x,y])=>{const dx=(x-10)*factor,dy=(y-6)*factor;return[endX+Math.cos(angle)*dx-Math.sin(angle)*dy,endY+Math.sin(angle)*dx+Math.cos(angle)*dy];});within(transform(corners));
  }
  if(tag==='text'){let y=val(n,'y');for(const child of jlrChildren(n)){y+=val(child,'dy');within(transform([[val(child,'x'),y],[val(child,'x'),y-val(n,'font-size')]]));}}
  for(const child of jlrChildren(n))walk(child,scale,dx,dy);
 }
 walk(root);return shapes;
}


export function assertRecoveryQuantitative(svg,lang,kind) {
 const{nodes}=inspectRecoverySvg(svg,lang,kind),rects=nodes.filter(n=>jlrTag(n)==='rect').map(jlrAttrs),near=(actual,expected,tolerance=.00051)=>assert.ok(Math.abs(Number(actual)-expected)<=tolerance),texts=nodes.filter(n=>jlrTag(n)==='text').map(jlrText);
 if(kind==='reconstruction'){
  // Explanatory dependencies preserve four levels; no observed workload is assigned.
  const levels=rects.filter(a=>a.x==='48'&&a.width==='620');assert.equal(levels.length,4);assert.deepEqual(levels.map(a=>a.y),['265','580','895','1235']);
 }
 if(kind==='ms-costs'){
  const bars=rects.filter(a=>a.y==='372'&&a.height==='58');assert.equal(bars.length,2);near(bars[0].x,76);near(bars[0].width,848*109.3/131.3);near(bars[1].x,76+848*109.3/131.3);near(bars[1].width,848*22/131.3);
  assert.ok(texts.includes(lang==='fr'?'131,3 M£':'£131.3m'));assert.ok(texts.includes(lang==='fr'?'83,2 %':'83.2%'));
 }
 if(kind==='ncc-retainer'){
  const bars=rects.filter(a=>a.y==='246'&&a.height==='24');assert.equal(bars.length,2);near(bars[0].width,904*9500/16100);near(bars[1].x,48+904*9500/16100);near(bars[1].width,904*6600/16100);
  const days=rects.filter(a=>a.y==='1395'&&a.fill==='#5eead4');assert.equal(days.length,5);for(const[i,a]of days.entries()){near(a.x,160+i*792/7);near(a.width,792/7);near(a.height,(17.5-9)*5);}
  const method=nodes.find(n=>jlrTag(n)==='metadata'&&jlrAttrs(n).id.endsWith('-method')),data=metadataJson(method);assert.equal(data.annual_retainer_fee+data.minimum_prepaid_days*data.normal_day_rate,data.minimum_arithmetic_commitment);assert.equal(data.normal_day_rate*data.out_of_hours_multiplier,data.out_of_hours_day_rate);
 }
 if(kind==='workstreams'){
  const bars=rects.filter(a=>a.x==='300'&&a.height==='65');assert.equal(bars.length,2);assert.deepEqual(bars.map(a=>[a.y,a.width]),[['569','208'],['669','624']]);near(Number(bars[1].width)/Number(bars[0].width),18/6);
  const start=Date.parse('2024-01-01T00:00:00Z'),end=Date.parse('2026-08-01T00:00:00Z'),y=date=>1015+(Date.parse(date+'T00:00:00Z')-start)/(end-start)*490;
  const marks=nodes.filter(n=>jlrTag(n)==='circle'&&jlrAttrs(n).cx==='148');assert.equal(marks.length,2);for(const[i,date]of ['2024-01-15','2026-07-08'].entries())near(jlrAttrs(marks[i]).cy,y(date),.006);
  const bands=rects.filter(a=>a.x==='133'&&a.width==='30');assert.equal(bands.length,2);for(const band of bands){near(band.y,y('2025-12-01'),.006);near(band.height,y('2026-01-01')-y('2025-12-01'),.000051);}
 }
}

// Conservative glyph envelopes measured from the supplied, hash-pinned fonts at
// 1000/600/350px in both themes. Widths round up the largest measured advance.
// The independent rendered QA measures actual glyph boxes, strokes and padding.
const panelProfiles = Object.freeze({
 fr: [
  {panel:[48,927,282,229],x:72,y:1110,size:22,weight:'400',top:22,bottom:6,lines:[['Davantage de',0,146],['comptages',27,119]]},
  {panel:[359,927,282,229],x:383,y:1063,size:24,weight:'600',top:24,bottom:7,lines:[['Commandes,',0,156],['factures',28,99]]},
 ],
 en: [
  {panel:[48,204,904,478],x:612,y:539,size:22,weight:'500',top:22,bottom:6,lines:[['Calculated residual:',0,210],['third parties,',27,136]]},
  {panel:[48,204,904,478],x:612,y:598,size:22,weight:'400',top:22,bottom:6,lines:[['predominantly specialist legal',0,311],['and professional services',29.92,269]]},
  {panel:[48,204,904,478],x:612,y:661,size:22,weight:'500',top:24,bottom:8,mono:true,lines:[['131.3 − 109.3 = 22.0',0,267]]},
  {panel:[48,927,282,229],x:72,y:1110,size:22,weight:'400',top:22,bottom:6,lines:[['More count',0,122],['attendances',27,131]]},
 ],
});
export function assertRecoveryPanelGeometry(svg,lang,kind) {
 const {nodes}=inspectRecoverySvg(svg,lang,kind,true);if(kind!=='ms-costs')return 0;
 let checked=0;
 for(const profile of panelProfiles[lang]){
  const [px,py,pw,ph]=profile.panel;
  const panels=nodes.filter(n=>jlrTag(n)==='rect'&&['x','y','width','height'].every((key,i)=>jlrAttrs(n)[key]===String(profile.panel[i])));assert.equal(panels.length,1,'Original internal panel bounds retained');
  const matches=nodes.filter(n=>jlrTag(n)==='text'&&jlrText(jlrChildren(n)[0])===profile.lines[0][0]);assert.equal(matches.length,1,'Unique reviewed panel label');const node=matches[0],a=jlrAttrs(node),lines=jlrChildren(node);
  assert.equal(a.x,String(profile.x));assert.equal(a.y,String(profile.y));assert.equal(a['font-size'],String(profile.size));assert.equal(a['font-weight'],profile.weight);assert.equal(a['font-family'],profile.mono?'JetBrains Mono Variable,DejaVu Sans Mono,monospace':'Inter Variable,Inter,Arial,sans-serif');assert.equal(a['text-anchor'],'start');assert.equal(lines.length,profile.lines.length);
  let baseline=Number(a.y);
  for(const [i,line]of lines.entries()){
   const [text,dy,width]=profile.lines[i],attributes=jlrAttrs(line);assert.equal(jlrText(line),text);assert.equal(attributes.x,a.x);assert.equal(attributes.dy,String(dy));baseline+=jlrNumber(attributes.dy);
   const left=jlrNumber(attributes.x),right=left+width,top=baseline-profile.top,bottom=baseline+profile.bottom;
   assert.ok(Math.min(left-px,px+pw-right,top-py,py+ph-bottom)>=12-.0001,'Reviewed glyph envelope keeps at least 12 units of panel clearance');checked++;
  }
 }
 return checked;
}
