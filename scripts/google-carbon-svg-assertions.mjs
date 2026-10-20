import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { XMLParser, XMLValidator } from 'fast-xml-parser';
import { parseFragment } from 'parse5';
import opentype from '@shuding/opentype.js';

// Goldens pin the supplied complete SVGs after the documented theme, attribute and source-link adaptation.
// Two supplied paragraph bounds defects are corrected by moving six baselines upward.
// Figure 03 titles identify growth explicitly; all data, other labels, fonts and structure are retained.
const adaptedHashes = {
  "fr-01": "1333d177462ae6be96ac96bfcb2022608ae33ea7e786a077d08115941129917b",
  "fr-02": "2cac0c91645061a4caa98619f2ba075198dd26db2f643052f08f1462f75971b4",
  "fr-03": "253628011c1b2a41396fb4e61078ebab94ef629c93cab5972505b5eb1ece947e",
  "fr-04": "018773bb62e9305dc3085bc8cb29fb67db0d974a36455b58298b31d0c3b07384",
  "fr-05": "ee1cfe6e6d772ba67831b7b11b8577987f04983626d22841d4c5ff3018904a3f",
  "fr-06": "7c61b455dae11c4422edd5a5afbe5a0841a3d4f9d6e4c91d55a83be0b3eb3c5e",
  "fr-07": "ceb4b2480f5a73931be9cc9442189fd63a25b727bdfd50de56724bfa3b220f15",
  "fr-08": "0031c0c99c87e1ee36d87ac90b49c405f59d988a8091fac4b4321831225335c9",
  "fr-09": "7008b3cab23a99b64b3bfa9aefa3a3c6fdeaa630c6e40fc4102f7d1851d3bc41",
  "fr-10": "0f8003cd4d59f3d6448dc2fe04fc713b340490d8981f7f6274eb58f48259b1b4",
  "fr-11": "af51577b64344ccac5d6c332c7db83f2aa5acc1e43a860aaadbfdd05f6232861",
  "fr-12": "95f0b0d01212d838ccbd8aed42c091f8149c232cc00f1b6cbd19f32cab69900e",
  "en-01": "eb376cc374e97ad178b23dada8d9c593c6a8e628332ad1f3f1c0024833c1ead8",
  "en-02": "8a62b94eb423eac07e5da9bec08f7c2def9c83baabe6df918f06cae3aae082e6",
  "en-03": "e1a85a37ab7eb87bce04f55766ed7405a1d058a494e8ad93afeda658cb58b0a7",
  "en-04": "7da244dfa8e337e672bef96e082069faba4c8fc8d1015746b84d9263da6b70cd",
  "en-05": "474a490f30037b79c216c95da838812a777c0e3fc6121aad162e56477bda2779",
  "en-06": "cde7d9f4e56460296be846daf143153ecd2d958e14a2f23dca6f6b720428e16d",
  "en-07": "8b9982192e123a707d4fcb99f22a56054cb2393695c7bc73e6d9c9a749011ad3",
  "en-08": "dc37ace7b1aed984c03798974b0c936f42a7726d17f9bb2870eee2bb67a613db",
  "en-09": "b5daa041095534e9293e5969966317e68a4a0699c4eec0c3c0b87e7b4faf9e82",
  "en-10": "fedc6f4d797e65d83e4a27e1c47d668950dd5dba3dd03fd18af8d90d9c84500b",
  "en-11": "a50b5126750a9542808ab00f632f161dfe6dcc0d3d40be6b5acc8a0b4e939369",
  "en-12": "8edcec960b65cae6abe7e4b0149eb666827d2f702aa96707cb97ab1bde0d76db"
};
const sourceIds = new Set(Array.from({ length: 23 }, (_, index) => `S${String(index + 1).padStart(2, '0')}`));
const attributes = { fontFamily:'font-family',fontSize:'font-size',fontWeight:'font-weight',textAnchor:'text-anchor',letterSpacing:'letter-spacing',strokeWidth:'stroke-width',strokeDasharray:'stroke-dasharray',markerEnd:'marker-end',textDecoration:'text-decoration',patternUnits:'patternUnits' };
const parser = new XMLParser({ignoreAttributes:false,attributeNamePrefix:'',preserveOrder:true,trimValues:false,parseTagValue:false});
const tag = node => Object.keys(node).find(key=>key!==':@');
const attrs = node => node[':@'] ?? {};
const scene = node => [node,...(node[tag(node)]??[]).filter(child=>tag(child)!=='#text').flatMap(scene)];
const text = node => (node[tag(node)]??[]).map(child=>tag(child)==='#text'?child['#text']:text(child)).join('');
const fonts = new Map([400,700].map(weight=>{
  const bytes=readFileSync(new URL(`../public/fonts/google-carbon/dejavu-sans-${weight}.ttf`,import.meta.url));
  return [weight,opentype.parse(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength))];
}));
const number = (node,key) => Number(attrs(node)[key]);

export const carbonSvgSource = raw => raw.replace(/\b(fontFamily|fontSize|fontWeight|textAnchor|letterSpacing|strokeWidth|strokeDasharray|markerEnd|textDecoration)=/gu,name=>`${attributes[name.slice(0,-1)]}=`);
export function inspectCarbonSvg(svg) {
  assert.doesNotMatch(svg,/<!DOCTYPE|<!ENTITY|<!\[CDATA\[|<\?/iu);
  assert.doesNotMatch(svg,/\b(?:fontFamily|fontSize|fontWeight|textAnchor|letterSpacing|strokeWidth|strokeDasharray|markerEnd|textDecoration)=/u,'SVG attributes use standards-compliant names in HTML');
  assert.equal(XMLValidator.validate(carbonSvgSource(svg)),true);
  const root=parser.parse(carbonSvgSource(svg))[0],nodes=scene(root),a=attrs(root);
  assert.equal(tag(root),'svg');
  assert.equal(a.style,'width:100%;height:auto');
  assert.equal(a.role,'img');
  assert.match(a.viewBox,/^0 0 (?:1200|720) [0-9]+$/u);
  const ids=nodes.map(node=>attrs(node).id).filter(Boolean);
  assert.equal(ids.length,new Set(ids).size);
  for(const id of a['aria-labelledby'].split(' '))assert.ok(nodes.some(node=>attrs(node).id===id&&['title','desc'].includes(tag(node))&&text(node).trim()));
  for(const node of nodes){
    assert.ok(['svg','title','desc','defs','marker','path','pattern','rect','text','circle','g','line','polyline','polygon','a'].includes(tag(node)),tag(node));
    for(const[key,value]of Object.entries(attrs(node))){
      assert.doesNotMatch(key,/^(?:on|xlink:href$|src$)/iu);
      if(key==='href'){ assert.equal(tag(node),'a');const label=text(node).trim().match(/^(S[0-9]+) · /u)?.[1];assert.ok(label&&sourceIds.has(label));assert.equal(value,`#source-${label}`);assert.equal(attrs(node).target,undefined);assert.equal(attrs(node).rel,undefined); }
      if(['fill','stroke'].includes(key))assert.match(value,/^(?:none|var\(--color-(?:ink|surface|surface-2|paper|muted|line-strong|signal|amber|accent)\)|url\(#[a-z0-9-]+\))$/u);
      if(String(value).includes('url('))assert.match(value,/^url\(#[a-z0-9-]+\)$/u);
    }
  }
  for(const node of nodes)for(const value of Object.values(attrs(node))){
    const ref=String(value).match(/^url\(#([a-z0-9-]+)\)$/u);
    if(ref)assert.ok(ids.includes(ref[1]));
  }
  return {root,nodes};
}

export function assertCarbonSourceFaithful(svg,lang,index){
  inspectCarbonSvg(svg);
  const hash=createHash('sha256').update(svg).digest('hex');
  assert.equal(hash,adaptedHashes[`${lang}-${String(index+1).padStart(2,'0')}`],'Supplied geometry, text, fonts, order or theme mapping changed');
}

export function assertCarbonGeometry(svg){
  const {root,nodes}=inspectCarbonSvg(svg),[,,width,height]=attrs(root).viewBox.split(' ').map(Number);
  const panels=nodes.filter(node=>tag(node)==='rect'&&[10,12].includes(number(node,'rx')));
  for(const node of nodes.filter(node=>tag(node)==='text')){
    const a=attrs(node),size=Number(a['font-size']),weight=Number(a['font-weight']??400),label=text(node);
    const font=fonts.get(weight<=500?400:700);
    for(const glyph of Array.from(label))assert.ok(font.charToGlyphIndex(glyph)>0,`Unsupported glyph ${glyph}`);
    const options={letterSpacing:Number(a['letter-spacing']??0)/size};
    const advance=font.getAdvanceWidth(label,size,options),anchor=a['text-anchor']??'start';
    const x=number(node,'x')-(anchor==='middle'?advance/2:anchor==='end'?advance:0),y=number(node,'y');
    const box={x1:Infinity,y1:Infinity,x2:-Infinity,y2:-Infinity},scale=size/font.unitsPerEm;
    font.forEachGlyph(label,x,y,size,options,(glyph,gx,gy)=>{
      if(!Number.isFinite(glyph.xMin)||glyph.xMin===glyph.xMax&&glyph.yMin===glyph.yMax)return;
      box.x1=Math.min(box.x1,gx+glyph.xMin*scale);box.x2=Math.max(box.x2,gx+glyph.xMax*scale);
      box.y1=Math.min(box.y1,gy-glyph.yMax*scale);box.y2=Math.max(box.y2,gy-glyph.yMin*scale);
    });
    assert.ok(box.x1>=2&&box.y1>=2&&box.x2<=width-2&&box.y2<=height-2,`Text outside viewBox: ${label}`);
    const panel=panels.filter(panel=>number(node,'x')>=number(panel,'x')&&number(node,'x')<=number(panel,'x')+number(panel,'width')&&y>=number(panel,'y')&&y<=number(panel,'y')+number(panel,'height')).sort((a,b)=>number(a,'width')*number(a,'height')-number(b,'width')*number(b,'height'))[0];
    if(panel)assert.ok(box.x1>=number(panel,'x')+2&&box.y1>=number(panel,'y')+2&&box.x2<=number(panel,'x')+number(panel,'width')-2&&box.y2<=number(panel,'y')+number(panel,'height')-2,`Text outside internal panel: ${label}`);
  }
  return true;
}

export function carbonSourceFigures(article){return [...article.matchAll(/<svg\b[\s\S]*?<\/svg>/gu)].map(match=>match[0]);}

const browserProjection = node => {
  if(node.nodeName==='#comment')return null;
  if(node.nodeName==='#text')return node.value.trim()?{text:node.value}:null;
  return {tag:node.tagName??node.nodeName,attrs:Object.fromEntries((node.attrs??[]).map(a=>[a.name,a.value]).sort(([a],[b])=>a.localeCompare(b))),children:(node.childNodes??[]).map(browserProjection).filter(Boolean)};
};
export function assertCarbonRenderedFaithful(svg,source,lang,index){
  assertCarbonSourceFaithful(source,lang,index);
  assertCarbonGeometry(svg);
  const actual=browserProjection(parseFragment(svg)),expected=browserProjection(parseFragment(carbonSvgSource(source)));
  assert.deepEqual(actual,expected,'Compiled SVG DOM preserves every source attribute and text node');
}
