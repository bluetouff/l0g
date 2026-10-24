import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { XMLParser, XMLValidator } from 'fast-xml-parser';
import { tag, attrs, nodes, content, labelBox } from './nebius-credit-svg-assertions.mjs';
import { pathPoints } from './insurance-returns-svg-assertions.mjs';
import { VAC_GM_KINDS, VAC_GM_SOURCES } from '../src/lib/vacGMFigures.mjs';
export { tag, attrs, nodes, content, labelBox, VAC_GM_KINDS, VAC_GM_SOURCES };
const parser = new XMLParser({ ignoreAttributes:false, attributeNamePrefix:'', preserveOrder:true, trimValues:false, parseTagValue:false });
export const vacGMScenes = () => ['fr','en'].flatMap(lang => VAC_GM_KINDS.flatMap(kind => [false,true].map(mobile => ({lang,kind,mobile,svg:readFileSync(new URL(`../src/figures/vac/${lang}-${kind}${mobile?'-mobile':''}.svg`,import.meta.url),'utf8')}))));
const numeric = value => {assert.match(value,/^[+-]?(?:\d{1,4}(?:\.\d{0,12})?|\.\d{1,12})$/u);assert.ok(Number.isFinite(Number(value))&&Math.abs(Number(value))<=10000);return Number(value);};
export function polylinePoints(value) {assert.equal(typeof value,'string');assert.ok(value.length<10000);const tokens=value.trim().split(/[\s,]+/u).map(numeric);assert.ok(tokens.length>=4&&tokens.length%2===0);return Array.from({length:tokens.length/2},(_,i)=>tokens.slice(i*2,i*2+2));}
export function inspectVacGMSvg(svg) {
 assert.equal(typeof svg,'string');assert.ok(svg.length>100&&svg.length<60000);assert.doesNotMatch(svg,/<!DOCTYPE|<!ENTITY|<!\[CDATA\[|<\?|\bon[a-z]+\s*=|(?:href|src)\s*=|url\(/iu);assert.equal(XMLValidator.validate(svg),true);
 const roots=parser.parse(svg);assert.equal(roots.length,1);const root=roots[0],all=nodes(root),a=attrs(root);
 assert.equal(tag(root),'svg');assert.equal(a.xmlns,'http://www.w3.org/2000/svg');assert.equal(a.style,'width:100%;height:auto');assert.equal(a.class,'l0g-vac-gm-svg');assert.equal(a.role,'img');assert.match(a.viewBox,/^0 0 (?:1410 830|710 1190)$/u);
 const allowed={svg:'xmlns role aria-labelledby viewBox style class',title:'id',desc:'id',rect:'id x y width height rx fill stroke stroke-width opacity',text:'data-panel x y fill font-family font-size font-weight text-anchor opacity',path:'d fill stroke stroke-width stroke-linecap stroke-linejoin stroke-dasharray opacity',polyline:'points fill stroke stroke-width stroke-linecap stroke-linejoin opacity',circle:'cx cy r fill stroke stroke-width opacity'};
 const ids=all.map(n=>attrs(n).id).filter(Boolean);assert.equal(ids.length,new Set(ids).size);assert.equal(a['aria-labelledby'].split(' ').length,2);
 for(const id of a['aria-labelledby'].split(' '))assert.equal(all.filter(n=>attrs(n).id===id&&['title','desc'].includes(tag(n))&&content(n).trim()).length,1);
 const numbers=new Set('x y width height rx cx cy r font-size font-weight stroke-width opacity'.split(' '));
 for(const n of all){const name=tag(n);assert.ok(Object.hasOwn(allowed,name),`Forbidden ${name}`);for(const[k,v]of Object.entries(attrs(n))){assert.ok(allowed[name].split(' ').includes(k),`Forbidden ${k}`);assert.equal(typeof v,'string');assert.ok(v.length<10000);if(numbers.has(k))numeric(v);if(k==='fill'||k==='stroke')assert.match(v,/^(?:none|var\(--color-(?:ink|surface|surface-2|paper|muted|line-strong|signal|accent|amber)\))$/u);if(k==='font-family')assert.equal(v,'l0g VAC GM');if(k==='font-weight')assert.ok(['400','700'].includes(v));if(k==='font-size')assert.ok(Number(v)>=(a.viewBox.includes('710')?28:24));if(k==='text-anchor')assert.ok(['start','middle','end'].includes(v));if(k==='d')pathPoints(v);if(k==='points')polylinePoints(v);}}
 return{root,all};
}
const rectBox=a=>({x1:Number(a.x),y1:Number(a.y),x2:Number(a.x)+Number(a.width),y2:Number(a.y)+Number(a.height)});
const contains=(a,b,p=0)=>b.x1>=a.x1+p&&b.y1>=a.y1+p&&b.x2<=a.x2-p&&b.y2<=a.y2-p;
const overlaps=(a,b)=>Math.min(a.x2,b.x2)-Math.max(a.x1,b.x1)>1&&Math.min(a.y2,b.y2)-Math.max(a.y1,b.y1)>1;
function crosses([x1,y1],[x2,y2],b){let enter=0,leave=1;for(const[start,d,low,high]of[[x1,x2-x1,b.x1-1,b.x2+1],[y1,y2-y1,b.y1-1,b.y2+1]]){if(d===0){if(start<=low||start>=high)return false;continue;}const a=(low-start)/d,c=(high-start)/d;enter=Math.max(enter,Math.min(a,c));leave=Math.min(leave,Math.max(a,c));if(enter>=leave)return false;}return enter<leave;}
export function vacGMGeometryIssues(svg){
 const{root,all}=inspectVacGMSvg(svg),[,,w,h]=attrs(root).viewBox.split(' ').map(Number),frame={x1:0,y1:0,x2:w,y2:h},issues=[];
 const texts=all.filter(n=>tag(n)==='text'),labels=texts.map(labelBox),panels=all.filter(n=>tag(n)==='rect').map(n=>({...attrs(n),...rectBox(attrs(n))}));
 for(const p of panels)if(!contains(frame,p))issues.push('Panel outside viewBox');
 for(const[i,b]of labels.entries()){if(!contains(frame,b,7))issues.push(`ViewBox: ${b.value}`);const own=panels.find(p=>p.id===attrs(texts[i])['data-panel']);if(!own||!contains(own,b,3))issues.push(`Panel: ${b.value}`);for(const other of panels)if(own&&other.id!==own.id&&!contains(other,own)&&overlaps(b,other))issues.push(`Unrelated panel: ${b.value}`);}
 for(const[i,a]of labels.entries())for(const b of labels.slice(i+1))if(overlaps(a,b))issues.push(`Overlap: ${a.value} / ${b.value}`);
 for(const n of all){const a=attrs(n);let points;if(tag(n)==='path')points=pathPoints(a.d);if(tag(n)==='polyline')points=polylinePoints(a.points);if(tag(n)==='circle'&&!contains(frame,{x1:Number(a.cx)-Number(a.r),x2:Number(a.cx)+Number(a.r),y1:Number(a.cy)-Number(a.r),y2:Number(a.cy)+Number(a.r)}))issues.push('Circle outside viewBox');if(points){for(const[x,y]of points)if(!contains(frame,{x1:x,x2:x,y1:y,y2:y}))issues.push('Connector outside viewBox');for(let i=1;i<points.length;i++)for(const b of labels)if(crosses(points[i-1],points[i],b))issues.push(`Connector crosses label: ${b.value}`);}}
 if(w===1410)assert.ok(h*768/w<500,'Compact desktop figure');return[...new Set(issues)];
}
export function assertVacGMGeometry(svg){assert.deepEqual(vacGMGeometryIssues(svg),[]);return true;}
