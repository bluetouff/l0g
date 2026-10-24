import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { XMLParser, XMLValidator } from 'fast-xml-parser';
import opentype from '@shuding/opentype.js';
import { NEBIUS_KINDS, NEBIUS_SOURCES } from '../src/lib/nebiusCreditFigures.mjs';
export { NEBIUS_KINDS, NEBIUS_SOURCES };
import { pathPoints } from './insurance-returns-svg-assertions.mjs';
const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '', preserveOrder: true, trimValues: false, parseTagValue: false });
export const tag = n => Object.keys(n).find(k => k !== ':@');
export const attrs = n => n[':@'] ?? {};
export const nodes = n => [n, ...(n[tag(n)] ?? []).filter(x => tag(x) !== '#text').flatMap(nodes)];
export const content = n => (n[tag(n)] ?? []).map(x => x['#text'] ?? content(x)).join('');
const fonts = new Map([400, 700].map(weight => {
 const bytes = readFileSync(new URL(`../public/fonts/stablecoins/dejavu-sans-${weight}.ttf`, import.meta.url));
 return [weight, opentype.parse(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength))];
}));
export const nebiusScenes = () => ['fr', 'en'].flatMap(lang => NEBIUS_KINDS.flatMap(kind => [false, true].map(mobile => ({ lang, kind, mobile, svg: readFileSync(new URL(`../src/figures/nebius/${lang}-${kind}${mobile ? '-mobile' : ''}.svg`, import.meta.url), 'utf8') }))));
export function inspectNebiusSvg(svg) {
 assert.equal(typeof svg, 'string'); assert.ok(svg.length > 100 && svg.length < 60000);
 assert.doesNotMatch(svg, /<!DOCTYPE|<!ENTITY|<!\[CDATA\[|<\?|\bon[a-z]+\s*=|(?:href|src)\s*=|url\(/iu);
 assert.equal(XMLValidator.validate(svg), true);
 const roots=parser.parse(svg);assert.equal(roots.length,1);const root=roots[0],all=nodes(root),a=attrs(root);
 assert.equal(tag(root),'svg');assert.equal(a.xmlns,'http://www.w3.org/2000/svg');assert.equal(a.style,'width:100%;height:auto');assert.equal(a.class,'l0g-nebius-credit-svg');assert.equal(a.role,'img');
 assert.match(a.viewBox,/^0 0 (?:1440 845|760 (?:1190|1280|1300))$/u);
 const allowed={svg:'xmlns role aria-labelledby viewBox style class',title:'id',desc:'id',rect:'id x y width height rx fill stroke stroke-width opacity',text:'data-panel x y fill font-family font-size font-weight text-anchor opacity',path:'d fill stroke stroke-width stroke-linecap stroke-linejoin stroke-dasharray opacity',circle:'cx cy r fill stroke stroke-width opacity',line:'x1 y1 x2 y2 stroke stroke-width opacity'};
 const ids=all.map(n=>attrs(n).id).filter(Boolean);assert.equal(ids.length,new Set(ids).size);
 for(const id of a['aria-labelledby'].split(' '))assert.ok(all.some(n=>attrs(n).id===id&&['title','desc'].includes(tag(n))&&content(n).trim()));
 for(const n of all){const name=tag(n);assert.ok(Object.hasOwn(allowed,name),`Forbidden ${name}`);for(const[k,v]of Object.entries(attrs(n))){assert.ok(allowed[name].split(' ').includes(k),`Forbidden ${k}`);if(k==='fill'||k==='stroke')assert.match(v,/^(?:none|var\(--color-(?:ink|surface|surface-2|paper|muted|line-strong|signal|accent|amber)\))$/u);if(k==='font-family')assert.equal(v,'l0g Nebius Credit');if(k==='font-weight')assert.ok(['400','700'].includes(v));if(k==='font-size')assert.ok(Number(v)>=(a.viewBox.includes('760')?30:24));}}
 return {root,all};
}
export function labelBox(n){const a=attrs(n),size=Number(a['font-size']),font=fonts.get(Number(a['font-weight'])),value=content(n),advance=font.getAdvanceWidth(value,size,{kerning:true}),x=Number(a.x)-(a['text-anchor']==='middle'?advance/2:a['text-anchor']==='end'?advance:0),boxes=[];for(const c of value)assert.notEqual(font.charToGlyphIndex(c),0,`Missing glyph ${c}`);font.forEachGlyph(value,x,Number(a.y),size,{kerning:true},(g,gx,gy)=>{if(!Number.isFinite(g.xMin)||(g.xMin===g.xMax&&g.yMin===g.yMax))return;const z=size/font.unitsPerEm;boxes.push({x1:gx+g.xMin*z,x2:gx+g.xMax*z,y1:gy-g.yMax*z,y2:gy-g.yMin*z});});return{value,advance,x1:Math.min(...boxes.map(b=>b.x1)),x2:Math.max(...boxes.map(b=>b.x2)),y1:Math.min(...boxes.map(b=>b.y1)),y2:Math.max(...boxes.map(b=>b.y2))};}
const boxOfRect = a => ({x1:Number(a.x),y1:Number(a.y),x2:Number(a.x)+Number(a.width),y2:Number(a.y)+Number(a.height)});
const contains = (outer, inner, margin = 0) => inner.x1 >= outer.x1 + margin && inner.y1 >= outer.y1 + margin && inner.x2 <= outer.x2 - margin && inner.y2 <= outer.y2 - margin;
const overlaps = (a, b) => Math.min(a.x2,b.x2)-Math.max(a.x1,b.x1)>1 && Math.min(a.y2,b.y2)-Math.max(a.y1,b.y1)>1;
function segmentCrosses([x1,y1],[x2,y2],b) {
 let enter=0,leave=1;
 for(const[start,delta,low,high]of[[x1,x2-x1,b.x1-1,b.x2+1],[y1,y2-y1,b.y1-1,b.y2+1]]) {
  if(delta===0){if(start<=low||start>=high)return false;continue;}
  const a=(low-start)/delta,c=(high-start)/delta;enter=Math.max(enter,Math.min(a,c));leave=Math.min(leave,Math.max(a,c));if(enter>=leave)return false;
 }
 return enter<leave;
}
export function nebiusGeometryIssues(svg) {
 const {root,all}=inspectNebiusSvg(svg),[,,w,h]=attrs(root).viewBox.split(' ').map(Number),frame={x1:0,y1:0,x2:w,y2:h},issues=[];
 const texts=all.filter(n=>tag(n)==='text'),labels=texts.map(labelBox),panels=all.filter(n=>tag(n)==='rect').map(n=>({...attrs(n),...boxOfRect(attrs(n))}));
 for(const p of panels)if(!contains(frame,p))issues.push('Panel outside viewBox');
 for(const[i,b]of labels.entries()){
  if(!contains(frame,b,7))issues.push(`ViewBox: ${b.value}`);
  const a=attrs(texts[i]),own=panels.find(p=>p.id===a['data-panel']);
  if(!own||!contains(own,b,3))issues.push(`Panel: ${b.value}`);
 }
 for(const[i,a]of labels.entries())for(const b of labels.slice(i+1))if(overlaps(a,b))issues.push(`Overlap: ${a.value} / ${b.value}`);
 for(const n of all){const a=attrs(n);let points;
  if(tag(n)==='path')points=pathPoints(a.d);
  if(tag(n)==='line')points=[[Number(a.x1),Number(a.y1)],[Number(a.x2),Number(a.y2)]];
  if(tag(n)==='circle'&&!contains(frame,{x1:Number(a.cx)-Number(a.r),x2:Number(a.cx)+Number(a.r),y1:Number(a.cy)-Number(a.r),y2:Number(a.cy)+Number(a.r)}))issues.push('Circle outside viewBox');
  if(points){for(const[x,y]of points)if(!contains(frame,{x1:x,x2:x,y1:y,y2:y}))issues.push('Connector outside viewBox');for(let i=1;i<points.length;i++)for(const b of labels)if(segmentCrosses(points[i-1],points[i],b))issues.push(`Connector crosses label: ${b.value}`);}
 }
 if(w===1440)assert.ok(h*768/w<500,'Compact desktop figure');
 return [...new Set(issues)];
}
export function assertNebiusGeometry(svg){assert.deepEqual(nebiusGeometryIssues(svg),[]);return true;}
