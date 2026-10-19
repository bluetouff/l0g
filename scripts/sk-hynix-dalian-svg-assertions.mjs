import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { XMLParser, XMLValidator } from 'fast-xml-parser';
import { parseFragment } from 'parse5';
import opentype from '@shuding/opentype.js';

// Goldens cover every complete source SVG, including all labels and coordinates.
const originalHashes = {
  "fr-01": "4b18ca69a15b32487c846e2b5b9855f89dd534f82f248e0ca2e9e3654b50fbda",
  "fr-02": "b533add7ef05684c89f92894ed6fbec30f39db15d6b6a761796c13ec5aef763a",
  "fr-03": "6e13d39dac98e1f20aaa1f7a251cbfaea87dd8a05361f49bcdf4dd4fc8b274fc",
  "fr-04": "bacb83da57ae7a104daa9bc40224961603b8a378828f405e9f75799b33fd238a",
  "fr-05": "e847b59264e79de5cc46ee1511fb85deec23ac16729213b615e58bab73cb7875",
  "fr-06": "8e1d2d98de505d035f4e6ed89c58adf14cf93cce818d7cbfc7b8e411a6d4cbec",
  "fr-07": "9e6dd46d3e3ad0c3ae8d06189c1c2c65f7ebb9fafbf09088faf3de3ceb8bb909",
  "fr-08": "46a652e2e8dc7666da116417c4e9d35c35d7f2dace9653b76151d777b37c3ade",
  "fr-09": "8a51a978d551d769300d6b82868ffe76cc3ebf764a5919c47962f3553530c277",
  "fr-10": "66292ec4cc8c91a45141b7b3d5d69ffa64200cf9caaa95ce1c1f3d45588abceb",
  "fr-11": "2425e4cdd1a549e248a34840fc86bd849ade9c27969b1fe85124ad37850a7539",
  "fr-12": "4edec5ea16696f8da5df6f51c8777f32717574a99c59e52e1e779815d44d248e",
  "en-01": "4b814bb5824191736080c24bd455d16bf32a5e559ab23c1a58bf3fd5e159b195",
  "en-02": "551511f41b9a10183ce73db52dd67690e12480b6e2961b541bf6d820337e1400",
  "en-03": "fc4ac318d1c148a1e50e1c86acf6d65306fa836ce7072de18946b6bcfb005a72",
  "en-04": "e26d81b687a3b782283b0fbe82f4ed4ced9db115929ce8b34601b3541a5cfd1b",
  "en-05": "f93ca744305b0e1bf55fd9154888f02ba3e143d92bfc962c0e1fc1f375b8225a",
  "en-06": "776f5a668c8f4efc91623ebfe86a158414298fab2ac576be3c23a57d05458cf4",
  "en-07": "b2b32db47008bbeb38dbaa043b659b5fde7e98cc0a20915940828eb47fca69f2",
  "en-08": "8fb39087f9e1681c4ad2bd0bc8abfd20bb0bca366b2943e706294769788c30b1",
  "en-09": "ee529daf07c02d32f4f005b4f0ec619704c3e3fae61505209d4bb2b5a591edc0",
  "en-10": "f0b3a30d5061eb15df4c02c43ff4484089e51f57fcdef8f5d582ad96c6ca1cb0",
  "en-11": "bfbffde77689d79fbdc5f00bf99f13f667d5b5a6ee06331516a6de61c6179680",
  "en-12": "af2ffa0c5f4f89c7c631eb378f0e797ca0683a8cc46333845218a7d815bebc1d"
};
const paints = {'#101b29':'ink','#182738':'surface','#203346':'surface-2','#eef3f7':'paper','#aec0d0':'muted','#35475a':'line-strong','#81d5c5':'signal','#edc077':'amber','#f19b91':'accent','#97bbf3':'topic-blue'};
const sourceUrls = {
  "S04": "https://www.sec.gov/Archives/edgar/data/50863/000005086325000060/intc-20250327.htm",
  "S06": "https://news.skhynix.com/en/groundbreaking-ceremony-in-indiana/",
  "S19": "https://news.skhynix.com/en/fact-10/",
  "S20": "https://www.solidigm.com/products/data-center/product-briefs/dc-p5510.html",
  "S03": "https://www.stocktitan.net/sec-filings/SKHY/6-k-sk-hynix-inc-current-report-foreign-issuer-f01d085fd82a.html",
  "S09": "https://media.bis.gov/press-release/department-commerce-closes-export-controls-loophole-foreign-owned-semiconductor-fabs-china",
  "S10": "https://www.govinfo.gov/content/pkg/FR-2025-09-02/pdf/2025-16735.pdf",
  "S11": "https://www.nist.gov/chips/chips-implementation-strategies/national-security/frequently-asked-questions-preventing",
  "S12": "https://www.nist.gov/news-events/news/2023/09/biden-harris-administration-announces-final-national-security-guardrails",
  "S13": "https://www.samr.gov.cn/fldes/tzgg/ftj/art/2023/art_f03608bf1b8042b78705f412e3948588.html",
  "S15": "https://news.skhynix.com/en/share-buyback-and-retirement/",
  "S21": "https://news.skhynix.com/en/q2-2026-business-results/",
  "S07": "https://www.purdue.edu/newsroom/2026/Q3/sk-hynix-breaks-ground-on-4-billion-advanced-packaging-production-facility-in-purdue-research-park/",
  "S08": "https://www.commerce.gov/news/press-releases/2024/12/biden-harris-administration-announces-chips-incentives-award-sk-hynix"
};
const attributes = { fontFamily:'font-family',fontSize:'font-size',fontWeight:'font-weight',textAnchor:'text-anchor',letterSpacing:'letter-spacing',strokeWidth:'stroke-width',strokeDasharray:'stroke-dasharray',markerEnd:'marker-end',textDecoration:'text-decoration',patternUnits:'patternUnits' };
const parser = new XMLParser({ignoreAttributes:false,attributeNamePrefix:'',preserveOrder:true,trimValues:false,parseTagValue:false});
const tag = node => Object.keys(node).find(key=>key!==':@');
const attrs = node => node[':@'] ?? {};
const scene = node => [node,...(node[tag(node)]??[]).filter(child=>tag(child)!=='#text').flatMap(scene)];
const text = node => (node[tag(node)]??[]).map(child=>tag(child)==='#text'?child['#text']:text(child)).join('');
const fonts = new Map([400,700].map(weight=>{
  const bytes=readFileSync(new URL(`../public/fonts/sk-hynix-dalian/dejavu-sans-${weight}.ttf`,import.meta.url));
  return [weight,opentype.parse(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength))];
}));
const number = (node,key) => Number(attrs(node)[key]);

export const dalianSvgSource = raw => raw.replace(/\b(fontFamily|fontSize|fontWeight|textAnchor|letterSpacing|strokeWidth|strokeDasharray|markerEnd|textDecoration)=/gu,name=>`${attributes[name.slice(0,-1)]}=`);
export function inspectDalianSvg(svg) {
  assert.doesNotMatch(svg,/<!DOCTYPE|<!ENTITY|<!\[CDATA\[|<\?/iu);
  assert.doesNotMatch(svg,/\b(?:fontFamily|fontSize|fontWeight|textAnchor|letterSpacing|strokeWidth|strokeDasharray|markerEnd|textDecoration)=/u,'SVG attributes use standards-compliant names in HTML');
  assert.equal(XMLValidator.validate(dalianSvgSource(svg)),true);
  const root=parser.parse(dalianSvgSource(svg))[0],nodes=scene(root),a=attrs(root);
  assert.equal(tag(root),'svg');
  assert.equal(a.style,'width:100%;height:auto');
  assert.equal(a.role,'img');
  assert.match(a.viewBox,/^0 0 (?:1200|640) [0-9]+$/u);
  const ids=nodes.map(node=>attrs(node).id).filter(Boolean);
  assert.equal(ids.length,new Set(ids).size);
  for(const id of a['aria-labelledby'].split(' '))assert.ok(nodes.some(node=>attrs(node).id===id&&['title','desc'].includes(tag(node))&&text(node).trim()));
  for(const node of nodes){
    assert.ok(['svg','title','desc','defs','marker','path','pattern','rect','text','circle','g','line','polyline','polygon','a'].includes(tag(node)),tag(node));
    for(const[key,value]of Object.entries(attrs(node))){
      assert.doesNotMatch(key,/^(?:on|xlink:href$|src$)/iu);
      if(key==='href'){ assert.equal(tag(node),'a');const label=text(node);assert.ok(Object.hasOwn(sourceUrls,label));assert.equal(value,`#source-${label}`);assert.equal(attrs(node).target,undefined);assert.equal(attrs(node).rel,undefined); }
      if(['fill','stroke'].includes(key))assert.match(value,/^(?:none|var\(--color-(?:ink|surface|surface-2|paper|muted|line-strong|signal|amber|accent|topic-blue)\)|url\(#[a-z0-9-]+\))$/u);
      if(String(value).includes('url('))assert.match(value,/^url\(#[a-z0-9-]+\)$/u);
    }
  }
  for(const node of nodes)for(const value of Object.values(attrs(node))){
    const ref=String(value).match(/^url\(#([a-z0-9-]+)\)$/u);
    if(ref)assert.ok(ids.includes(ref[1]));
  }
  return {root,nodes};
}

export function assertDalianSourceFaithful(svg,lang,index){
  inspectDalianSvg(svg);
  let original=svg.replace('<svg style="width:100%;height:auto" ','<svg ');
  original=original.replace(/<a href="#source-(S[0-9]+)">/gu,(_,id)=>`<a href="${sourceUrls[id]}" target="_blank">`);
  for(const[from,to]of Object.entries(attributes))if(from!==to)original=original.replace(new RegExp(`\\b${to}=`, 'gu'),`${from}=`);
  for(const [paint,token]of Object.entries(paints))original=original.replaceAll(`="var(--color-${token})"`,`="${paint}"`);
  const hash=createHash('sha256').update(original).digest('hex');
  assert.equal(hash,originalHashes[`${lang}-${String(index+1).padStart(2,'0')}`],'Source geometry, text, fonts, order or metadata changed');
}

export function assertDalianGeometry(svg){
  const {root,nodes}=inspectDalianSvg(svg),[,,width,height]=attrs(root).viewBox.split(' ').map(Number);
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

export function dalianSourceFigures(article){return [...article.matchAll(/<svg\b[\s\S]*?<\/svg>/gu)].map(match=>match[0]);}

const browserProjection = node => {
  if(node.nodeName==='#comment')return null;
  if(node.nodeName==='#text')return node.value.trim()?{text:node.value}:null;
  return {tag:node.tagName??node.nodeName,attrs:Object.fromEntries((node.attrs??[]).map(a=>[a.name,a.value]).sort(([a],[b])=>a.localeCompare(b))),children:(node.childNodes??[]).map(browserProjection).filter(Boolean)};
};
export function assertDalianRenderedFaithful(svg,source,lang,index){
  assertDalianSourceFaithful(source,lang,index);
  assertDalianGeometry(svg);
  const actual=browserProjection(parseFragment(svg)),expected=browserProjection(parseFragment(dalianSvgSource(source)));
  assert.deepEqual(actual,expected,'Compiled SVG DOM preserves every source attribute and text node');
}
