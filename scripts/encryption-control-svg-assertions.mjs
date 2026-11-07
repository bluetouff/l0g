import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {XMLParser,XMLValidator} from 'fast-xml-parser';
import opentype from '@shuding/opentype.js';
import {tag,attrs,nodes,content} from './nebius-credit-svg-assertions.mjs';
import {pathPoints} from './insurance-returns-svg-assertions.mjs';
export {tag,attrs,nodes,content};
export const ENCRYPTION_CONTROL_KINDS=Object.freeze(['wiretaps','control','lifetimes']);
const bytes=readFileSync(new URL('../public/fonts/ukraine-reparations/liberation-sans-400.ttf',import.meta.url));
const font=opentype.parse(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength));
const parser=new XMLParser({ignoreAttributes:false,attributeNamePrefix:'',preserveOrder:true,trimValues:false,parseTagValue:false});
export const encryptionControlScenes=()=>['fr','en'].flatMap(lang=>ENCRYPTION_CONTROL_KINDS.flatMap(kind=>[false,true].map(mobile=>({lang,kind,mobile,svg:readFileSync(new URL(`../src/figures/encryption-control-2026/${kind}.${lang}.${mobile?'mobile':'desktop'}.svg`,import.meta.url),'utf8')}))));
export function encryptionControlLabelBox(n){
 const a=attrs(n),size=Number(a['font-size']),value=content(n),advance=font.getAdvanceWidth(value,size,{kerning:true});
 const x=Number(a.x)-(a['text-anchor']==='middle'?advance/2:a['text-anchor']==='end'?advance:0),y=Number(a.y),boxes=[];
 for(const c of value)assert.notEqual(font.charToGlyphIndex(c),0,`Missing font glyph: ${c}`);
 font.forEachGlyph(value,x,y,size,{kerning:true},(g,gx,gy)=>{if(!Number.isFinite(g.xMin)||(g.xMin===g.xMax&&g.yMin===g.yMax))return;const z=size/font.unitsPerEm;boxes.push({x1:gx+g.xMin*z,x2:gx+g.xMax*z,y1:gy-g.yMax*z,y2:gy-g.yMin*z});});
 return{value,x1:Math.min(...boxes.map(b=>b.x1)),x2:Math.max(...boxes.map(b=>b.x2)),y1:Math.min(...boxes.map(b=>b.y1)),y2:Math.max(...boxes.map(b=>b.y2)),lineY1:y-font.ascender*size/font.unitsPerEm,lineY2:y-font.descender*size/font.unitsPerEm};
}
export function inspectEncryptionControlSvg(svg){
 assert.equal(typeof svg,'string');assert.ok(svg.length>100&&svg.length<50000);assert.doesNotMatch(svg,/<!DOCTYPE|<!ENTITY|<!\[CDATA\[|<\?|\bon[a-z]+\s*=|(?:href|src)\s*=|url\(/iu);assert.equal(XMLValidator.validate(svg),true);
 const roots=parser.parse(svg);assert.equal(roots.length,1);const root=roots[0],all=nodes(root),a=attrs(root);
 assert.equal(tag(root),'svg');assert.equal(a.xmlns,'http://www.w3.org/2000/svg');assert.equal(a.style,'width:100%;height:auto');assert.equal(a.class,'l0g-control-svg');assert.equal(a.role,'img');assert.match(a.viewBox,/^0 0 (?:1000 700|420 920)$/u);
 const ids=all.map(n=>attrs(n).id).filter(Boolean);assert.equal(ids.length,new Set(ids).size);assert.equal(a['aria-labelledby'].split(' ').length,2);for(const id of a['aria-labelledby'].split(' '))assert.equal(all.filter(n=>attrs(n).id===id&&['title','desc'].includes(tag(n))&&content(n).trim()).length,1);
 const allowed={svg:'xmlns viewBox role aria-labelledby style class',title:'id',desc:'id',rect:'id x y width height rx fill stroke stroke-width data-metric data-value data-step data-unit data-group',text:'data-panel data-metric data-value data-unit data-to data-mode x y font-family font-size font-weight text-anchor fill',path:'data-icon data-metric data-from data-to data-mode d fill stroke stroke-width stroke-linecap stroke-linejoin stroke-dasharray',circle:'cx cy r fill stroke stroke-width data-metric data-to data-mode'};
 const numeric=new Set('x y width height rx font-size font-weight stroke-width cx cy r'.split(' '));
 for(const n of all){const name=tag(n);assert.ok(Object.hasOwn(allowed,name),`Forbidden SVG node ${name}`);if(name==='text')assert.ok(content(n).trim());for(const[k,v]of Object.entries(attrs(n))){assert.ok(allowed[name].split(' ').includes(k),`Forbidden ${name}.${k}`);assert.equal(typeof v,'string');assert.ok(v.length<10000);
  if(['data-value'].includes(k)){assert.match(v,/^-?\d{1,15}(?:\.\d{1,4})?$/u);assert.ok(Math.abs(Number(v))<=1000000000000);}
  else if(numeric.has(k)){assert.match(v,/^[+-]?(?:\d{1,4}(?:\.\d{0,14})?|\.\d{1,14})$/u);assert.ok(Number.isFinite(Number(v)));}
  if(['fill','stroke'].includes(k))assert.match(v,/^(?:none|var\(--color-(?:ink|surface|paper|muted|line-strong|signal|accent|amber)\))$/u);
  if(k==='font-family')assert.equal(v,'l0g Encryption Control');if(k==='font-weight')assert.equal(v,'400','Restrained regular typography');if(k==='font-size')assert.ok(Number(v)>=(a.viewBox.includes('420')?18.5:24));if(k==='text-anchor')assert.ok(['start','middle','end'].includes(v));
  if(k==='data-step')assert.fail('Unexpected numeric step');
if(k==='data-unit')assert.equal(v,'wiretaps');if(k==='data-group')assert.ok(['federal','state'].includes(v));
  if(['data-from','data-to'].includes(k))assert.ok(['authority','check','activation','collection','preparation','recipient','review'].includes(v));
  if(k==='data-mode')assert.ok(['capability','authorisation','copies'].includes(v));
  if(k==='data-metric')assert.ok(['reported-failure','other-encrypted','command','activation','data','trace','lifetime'].includes(v));if(k==='d')pathPoints(v);
 }}
 return{root,all};
}
const box=a=>({x1:Number(a.x),y1:Number(a.y),x2:Number(a.x)+Number(a.width),y2:Number(a.y)+Number(a.height)}),contains=(a,b,p=0)=>b.x1>=a.x1+p&&b.y1>=a.y1+p&&b.x2<=a.x2-p&&b.y2<=a.y2-p,overlaps=(a,b)=>Math.min(a.x2,b.x2)-Math.max(a.x1,b.x1)>1&&Math.min(a.y2,b.y2)-Math.max(a.y1,b.y1)>1;
function crosses([x1,y1],[x2,y2],b){let enter=0,leave=1;for(const[start,d,low,high]of[[x1,x2-x1,b.x1-1,b.x2+1],[y1,y2-y1,b.y1-1,b.y2+1]]){if(d===0){if(start<=low||start>=high)return false;continue;}const a=(low-start)/d,c=(high-start)/d;enter=Math.max(enter,Math.min(a,c));leave=Math.min(leave,Math.max(a,c));if(enter>=leave)return false;}return enter<leave;}
export function encryptionControlGeometryIssues(svg){
 const{root,all}=inspectEncryptionControlSvg(svg),[,,w,h]=attrs(root).viewBox.split(' ').map(Number),frame={x1:0,y1:0,x2:w,y2:h},issues=[];
 const texts=all.filter(n=>tag(n)==='text'),labels=texts.map(encryptionControlLabelBox),rects=all.filter(n=>tag(n)==='rect').map(n=>({...attrs(n),...box(attrs(n))}));
 for(const r of rects)if(!contains(frame,r))issues.push('Rectangle outside frame');
 for(const[i,b]of labels.entries()){
  if(!contains(frame,b,5))issues.push(`Text outside frame: ${b.value}`);
  const own=rects.find(r=>r.id===attrs(texts[i])['data-panel']);
  if(!own||!contains(own,b,4)||!contains(own,{...b,y1:b.lineY1,y2:b.lineY2},4))issues.push(`Text outside intended region: ${b.value}`);
  for(const r of rects.filter(r=>r['data-metric']))if(overlaps(b,r))issues.push(`Data bar crosses label: ${b.value}`);
 }
 for(const[i,b]of labels.entries())for(const c of labels.slice(i+1)){if(overlaps(b,c))issues.push(`Label overlap: ${b.value} / ${c.value}`);if(overlaps({...b,y1:b.lineY1,y2:b.lineY2},{...c,y1:c.lineY1,y2:c.lineY2}))issues.push(`Full font overlap: ${b.value} / ${c.value}`);}
 for(const n of all){const a=attrs(n);if(tag(n)==='path'){const points=pathPoints(a.d),pad=Number(a['stroke-width'])/2;for(const[x,y]of points)if(!contains(frame,{x1:x-pad,y1:y-pad,x2:x+pad,y2:y+pad}))issues.push('Path outside frame');for(let i=1;i<points.length;i++)for(const b of labels)if(crosses(points[i-1],points[i],b))issues.push(`Path crosses label: ${b.value}`);}if(tag(n)==='circle'){const radius=Number(a.r)+Number(a['stroke-width'])/2,b={x1:Number(a.cx)-radius,y1:Number(a.cy)-radius,x2:Number(a.cx)+radius,y2:Number(a.cy)+radius};if(!contains(frame,b))issues.push('Circle outside frame');for(const label of labels)if(overlaps(b,label))issues.push(`Symbol crosses label: ${label.value}`);}}
 if(w===1000)assert.ok(h*800/w<=560,'Compact desktop figure');
 return[...new Set(issues)];
}
export const assertEncryptionControlGeometry=svg=>assert.deepEqual(encryptionControlGeometryIssues(svg),[]);
