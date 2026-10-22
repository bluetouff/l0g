import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {XMLParser, XMLValidator} from 'fast-xml-parser';
import {parseFragment} from 'parse5';
import opentype from '@shuding/opentype.js';
import {msciIndonesiaSvg,MSCI_INDONESIA_KINDS} from '../src/lib/msciIndonesiaFigures.mjs';
// Compact sourced ownership, comparison, basket, ETF and calendar scenes.
const hashes = {
  "fr-0": "3d8539e9951a3ff954068da27bff5e85006c72b00ad4cac9a07ef967b62d2867",
  "fr-1": "87436e4c65a0234d19b52e8659fe82b68cc5c7e8b0be21da5e8333de2cea2886",
  "fr-2": "dc1b37253164233f1d5d99a4decb8318ccb7eff17141a6094bc01cc075b36991",
  "fr-3": "cec6ba79923456269b869dcf08da6d3b3ff003f2e96330bf69b5bf74f87b8897",
  "fr-4": "fee9bd58fdb4042ceca0f7cb79eac0d1c7236dde4117bd79d4c0748e619dedf8",
  "fr-5": "de53125fb71695defafe1049a24ab223da46eeb6f2c40caa8a794beb068fa53a",
  "fr-6": "a2d6af315dd616d02c7259794528002a02d4ff2608e229d1c2027fe5b67ba29f",
  "fr-7": "1a23c3e0d4448969cd8c9178469974f4e1261b2c8f72b5651dd06237d051173f",
  "fr-8": "032584d839a0ce223b6575927a032bf049de36217fa0e3edbf3e9c8fe89cded5",
  "fr-9": "17bc684aee95ec7c7ecac5260bb01fb151ba7ffa714af0fc1e345c43f208b13e",
  "en-0": "554a6116c582525041262ef3a26c5bd762b37720b35d976b803060ab5320f035",
  "en-1": "8a9f79538d1d6c04306f9ee0d3cb0e8302f98f4efdfe2e330122bfa6eef5e1e8",
  "en-2": "6a855775267a71259b4a4192bccd6681742509262553f25196490e416315a92f",
  "en-3": "1760a807c9f18a993159a5c1ee89a88853e0c7c6d633cccbedd08f503e0d9c22",
  "en-4": "bfc663a147723e89dbd33be9aca0ce3c221fd116d2094610c07847b31b0ae3ff",
  "en-5": "a1a4d841de05bae5daa08d2a1c5289f9d56e9d951738fefb1b39e9d78d1d3996",
  "en-6": "43cec446ac5e59e84db261e06a418fb3f7b87daadff326e77784e4bbe7bb74b0",
  "en-7": "f6a22cbd536fbbfc96f8fc19b71a8f975bfc354fd9f321f7d24038d94805b466",
  "en-8": "f0d99ca58f4fd0830f8e09451d87eac8091f4b4d4279d7000413ab3dbac56ddd",
  "en-9": "d7cabe18f9d3baf16f14decc068a6993c4aca78e80b6f0773115daebd8312968"
};
const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '', preserveOrder: true, trimValues: false, parseTagValue: false });
export const msciIndonesiaTag = node => Object.keys(node).find(key => key !== ':@');
export const msciIndonesiaAttrs = node => node[':@'] ?? {};
export const msciIndonesiaNodes = node => [node, ...(node[msciIndonesiaTag(node)] ?? []).filter(child => msciIndonesiaTag(child) !== '#text').flatMap(msciIndonesiaNodes)];
export const msciIndonesiaText = node => (node[msciIndonesiaTag(node)] ?? []).map(child => msciIndonesiaTag(child) === '#text' ? child['#text'] : msciIndonesiaText(child)).join('');
const number = (node, key) => { const a = msciIndonesiaAttrs(node); return msciIndonesiaTag(node) === 'circle' && ['x', 'y', 'width', 'height'].includes(key) ? key === 'x' ? Number(a.cx) - Number(a.r) : key === 'y' ? Number(a.cy) - Number(a.r) : 2 * Number(a.r) : Number(a[key]); };
const allowed = {
  svg: 'style class xmlns viewBox role aria-labelledby', title: 'id', desc: 'id', defs: '',
  marker: 'id viewBox refX refY markerWidth markerHeight orient markerUnits',
  path: 'id d fill stroke stroke-width stroke-dasharray marker-end',
  rect: 'id x y width height rx fill stroke stroke-width stroke-dasharray',
  text: 'data-panel data-max-width x y font-family font-size font-weight text-anchor fill',
  line: 'id x1 y1 x2 y2 stroke stroke-width stroke-linecap stroke-dasharray marker-end',
  circle: 'id cx cy r fill stroke stroke-width', a: 'href',
};
const fonts = new Map([400, 700].map(weight => {
  const bytes = readFileSync(new URL(`../public/fonts/stablecoins/dejavu-sans-${weight}.ttf`, import.meta.url));
  return [weight, opentype.parse(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength))];
}));
export const msciIndonesiaSourceFigures = lang => MSCI_INDONESIA_KINDS.flatMap(kind => [false,true].map(mobile => msciIndonesiaSvg(lang,kind,mobile)));

export function inspectMsciIndonesiaSvg(svg) {
  assert.equal(typeof svg, 'string');
  assert.ok(svg.length > 100 && svg.length < 50000);
  assert.doesNotMatch(svg, /<!DOCTYPE|<!ENTITY|<!\[CDATA\[|<\?/iu);
  assert.doesNotMatch(svg, /\b(?:fontFamily|fontSize|fontWeight|textAnchor|strokeWidth|strokeDasharray|markerEnd)=/u, 'SVG presentation attributes use native names');
  assert.equal(XMLValidator.validate(svg), true);
  const roots = parser.parse(svg);
  assert.equal(roots.length, 1);
  const root = roots[0], nodes = msciIndonesiaNodes(root), a = msciIndonesiaAttrs(root);
  assert.equal(msciIndonesiaTag(root), 'svg');
  assert.equal(a.xmlns, 'http://www.w3.org/2000/svg');
  if (a.style !== undefined) assert.equal(a.style, 'width:100%;height:auto');
  assert.equal(a.class, 'l0g-msci-svg');
  assert.equal(a.role, 'img');
  assert.match(a.viewBox, /^0 0 (?:600|1000) [0-9]+$/u);
  const ids = nodes.map(node => msciIndonesiaAttrs(node).id).filter(Boolean);
  assert.equal(ids.length, new Set(ids).size);
  for (const id of a['aria-labelledby'].split(' ')) assert.ok(nodes.some(node => msciIndonesiaAttrs(node).id === id && ['title', 'desc'].includes(msciIndonesiaTag(node)) && msciIndonesiaText(node).trim()));
  assert.ok(nodes.length < 800);
  for (const node of nodes) {
    assert.ok(Object.hasOwn(allowed, msciIndonesiaTag(node)), `Forbidden SVG element: ${msciIndonesiaTag(node)}`);
    for (const [key, value] of Object.entries(msciIndonesiaAttrs(node))) {
      assert.ok(allowed[msciIndonesiaTag(node)].split(' ').includes(key), `Forbidden SVG attribute: ${key}`);
      assert.equal(typeof value, 'string'); assert.ok(value.length <= 8192);
      if (['x','y','width','height','rx','r','cx','cy','x1','y1','x2','y2','font-size','stroke-width','refX','refY','markerWidth','markerHeight','data-max-width'].includes(key)) { assert.match(value,/^[+-]?(?:\d{1,4}(?:\.\d{0,18})?|\.\d{1,18})$/u); assert.ok(Number.isFinite(Number(value)) && Math.abs(Number(value)) <= 10000); }
      if (key === 'markerUnits') assert.equal(value,'userSpaceOnUse');
      if (key === 'stroke-dasharray') assert.equal(value,'5 6');
      if (['stroke-width','width','height','rx','r','markerWidth','markerHeight'].includes(key)) assert.ok(Number(value)>=0);
      if (key === 'id') assert.match(value,/^msci-(?:fr|en)-f[1-5]-(?:d|m)-[a-z0-9-]+$/u);
      if (key === 'font-family') assert.equal(value,'l0g MSCI Indonesia');
      if (key === 'font-weight') assert.ok(['400','700'].includes(value));
      if (key === 'font-size') assert.ok(Number(value) >= 28 && Number(value) <= 48);
      if (key === 'text-anchor') assert.ok(['start','middle','end'].includes(value));
      if (key === 'd') pathPoints(value);
      if (key === 'href') {
        const label = msciIndonesiaText(node).trim().match(/^(S[0-9]{2})$/u)?.[1];
        assert.ok(label && Number(label.slice(1)) >= 1 && Number(label.slice(1)) <= 19);
        assert.equal(value, `#source-${label.toLowerCase()}`);
      }
      if (['fill', 'stroke'].includes(key)) assert.match(value, /^(?:none|var\(--color-(?:ink|surface|surface-2|paper|muted|line-strong|signal|amber|accent|topic-blue)\)|url\(#[a-z0-9-]+\))$/u);
      if (String(value).includes('url(')) {
        const reference = String(value).match(/^url\(#([a-z0-9-]+)\)$/u);
        assert.ok(reference && ids.includes(reference[1]));
      }
    }
  }
  return { root, nodes };
}

export function assertMsciIndonesiaSourceFaithful(svg, lang, index) {
  inspectMsciIndonesiaSvg(svg);
  assert.equal(createHash('sha256').update(svg.replace(' style="width:100%;height:auto"', '')).digest('hex'), hashes[`${lang}-${index}`], 'Verified compact composition, labels or semantic-theme mapping changed');
}

function pathPoints(d) {
  // Consume the entire number before checking bounds. Limiting the lexical
  // match to four digits would split a single token such as 01000100 into
  // two coordinates without a valid SVG separator.
  const token = /[MLHVZ]|[+-]?(?:\d+(?:\.\d*)?|\.\d+)/uy, tokens = [], points = [];
  let offset = 0;
  while (offset < d.length) {
    if (/\s/u.test(d[offset])) { offset++; continue; }
    token.lastIndex = offset; const match = token.exec(d); assert.ok(match, 'Every path character is consumed');
    if (!/^[MLHVZ]$/u.test(match[0])) assert.match(match[0], /^[+-]?(?:\d{1,4}(?:\.\d{0,18})?|\.\d{1,18})$/u, 'Every coordinate is one complete bounded SVG number');
    tokens.push(match[0]); offset = token.lastIndex;
  }
  assert.ok(tokens.length < 1024); assert.equal(tokens[0], 'M');
  let i = 0, x, y, origin;
  const value = () => { const n = Number(tokens[i++]); assert.ok(Number.isFinite(n)); return n; };
  while (i < tokens.length) {
    const command = tokens[i++];
    if (command === 'M' || command === 'L') { x = value(); y = value(); if (command === 'M') { assert.equal(origin, undefined, 'Every scene path uses a single subpath'); origin = [x, y]; } }
    else if (command === 'H') x = value();
    else if (command === 'V') y = value();
    else { assert.equal(command, 'Z'); assert.ok(origin); [x, y] = origin; }
    points.push([x, y]);
  }
  return points;
}


const routePoints = node => msciIndonesiaTag(node) === 'line' ? [[number(node,'x1'),number(node,'y1')],[number(node,'x2'),number(node,'y2')]] : pathPoints(msciIndonesiaAttrs(node).d);
export function assertMsciIndonesiaConnections(svg, figure) {
  const {nodes,root}=inspectMsciIndonesiaSvg(svg),prefix=msciIndonesiaAttrs(root)['aria-labelledby'].split(' ')[0].slice(0,-6);
  const expected=[['disclosure-to-owner','owner-to-fif'],[],[],['secondary-shares','redeemed-units','redemption-assets'],[]][figure-1];assert.ok(expected);
  const arrows=nodes.filter(n=>msciIndonesiaAttrs(n)['marker-end']);
  assert.deepEqual(arrows.map(n=>msciIndonesiaAttrs(n).id),expected.map(id=>prefix+'-'+id),'All sourced directional flows remain explicit');
  const routes=[...arrows];
  if(figure===1)for(const type of ['control','holding'])for(let i=0;i<3;i++){const path=nodes.find(n=>msciIndonesiaAttrs(n).id===`${prefix}-${type}-${i}`);assert.ok(path,'The complete three-account ownership graph remains');assert.equal(msciIndonesiaAttrs(path).stroke,`var(--color-${type==='control'?'accent':'signal'})`);assert.equal(msciIndonesiaAttrs(path)['stroke-dasharray'],type==='control'?'5 6':undefined);const pts=routePoints(path),account=nodes.find(n=>msciIndonesiaAttrs(n).id===`${prefix}-account-${i}`),controller=nodes.find(n=>msciIndonesiaAttrs(n).id===prefix+'-controller'),issuer=nodes.find(n=>msciIndonesiaAttrs(n).id===prefix+'-issuer'),mobile=msciIndonesiaAttrs(root).viewBox.startsWith('0 0 600 ');assert.ok(account&&controller&&issuer);const start=type==='control'?mobile?[number(controller,'x')+number(controller,'width')/2,number(controller,'y')+number(controller,'height')]:[number(controller,'x')+number(controller,'width'),number(controller,'y')+number(controller,'height')/2]:mobile?[number(account,'x')+number(account,'width')/2,number(account,'y')+number(account,'height')]:[number(account,'x')+number(account,'width'),number(account,'y')+number(account,'height')/2];const end=type==='control'?mobile?[number(account,'x')+number(account,'width')/2,number(account,'y')-2]:[number(account,'x')-4,number(account,'y')+number(account,'height')/2]:mobile?[number(issuer,'x')+number(issuer,'width')/2,number(issuer,'y')-2]:[number(issuer,'x')-4,number(issuer,'y')+number(issuer,'height')/2];assert.deepEqual(pts[0],start,'The relationship starts at its declared owner');assert.deepEqual(pts.at(-1),end,'Every account remains connected to its declared destination');routes.push(path);}
  for(const route of routes){const a=msciIndonesiaAttrs(route);assert.ok(number(route,'stroke-width')>=2);assert.ok(['var(--color-signal)','var(--color-accent)'].includes(a.stroke));const pts=routePoints(route);assert.ok(pts.length>=2&&pts.some(p=>Math.hypot(p[0]-pts[0][0],p[1]-pts[0][1])>4),'Every relationship has a visible nonzero route');
    const samples=pts.slice(1).flatMap((p,i)=>Array.from({length:31},(_,k)=>[pts[i][0]+(p[0]-pts[i][0])*k/30,pts[i][1]+(p[1]-pts[i][1])*k/30]));
    for(const shape of nodes.slice(nodes.indexOf(route)+1).filter(n=>msciIndonesiaTag(n)==='rect'&&msciIndonesiaAttrs(n).fill!=='none'))assert.ok(!samples.some(([x,y])=>x>number(shape,'x')+.5&&x<number(shape,'x')+number(shape,'width')-.5&&y>number(shape,'y')+.5&&y<number(shape,'y')+number(shape,'height')-.5),'A later background cannot cover a relationship');
    if(a['marker-end']){const color=figure===4&&a.id.endsWith('-redeemed-units')?'accent':'signal';assert.equal(a.stroke,`var(--color-${color})`);const mid=prefix+'-'+color+'-arrow';assert.equal(a['marker-end'],`url(#${mid})`);const marker=nodes.find(n=>msciIndonesiaTag(n)==='marker'&&msciIndonesiaAttrs(n).id===mid);assert.ok(marker);const head=msciIndonesiaNodes(marker).find(n=>msciIndonesiaTag(n)==='path');assert.equal(msciIndonesiaAttrs(head).stroke,a.stroke);assert.ok(number(head,'stroke-width')>=1);assert.equal(msciIndonesiaAttrs(head).fill,'none');const forward=!a.id.endsWith('-redemption-assets');assert.ok(forward?pts.at(-1)[0]>pts[0][0]:pts.at(-1)[0]<pts[0][0],'Shares, returned units and redemption assets retain their direction');}
  }
  return true;
}
const near=(a,b)=>assert.ok(Math.abs(Number(a)-b)<=.002,`${a} != ${b}`);
export function assertMsciIndonesiaQuantitative(svg, figure){
  const {root,nodes}=inspectMsciIndonesiaSvg(svg),a=msciIndonesiaAttrs(root),prefix=a['aria-labelledby'].split(' ')[0].slice(0,-6),mobile=a.viewBox.startsWith('0 0 600 '),fr=prefix.startsWith('msci-fr-');
  const find=id=>{const n=nodes.find(n=>msciIndonesiaAttrs(n).id===prefix+'-'+id);assert.ok(n,'Required datum '+id);return n},labels=nodes.filter(n=>msciIndonesiaTag(n)==='text').map(msciIndonesiaText),joined=labels.join(' '),includes=s=>assert.ok(labels.some(l=>l.includes(s)),'Required label '+s);
  assertMsciIndonesiaConnections(svg,figure);
  const sources=nodes.filter(n=>msciIndonesiaTag(n)==='a').map(n=>msciIndonesiaAttrs(n).href);assert.deepEqual(sources,[[5,6,7,8,9],[2],[5,16],[1,2,12,13,14,15,18],[1,2,8]][figure-1].map(n=>'#source-s'+String(n).padStart(2,'0')),'Every original figure source survives');
  if(figure===1){for(const id of ['controller','account-0','account-1','account-2','issuer'])find(id);includes('1 %');includes(fr?'15 %':'15%');includes('CUAN');includes('BREN');includes('OJK');assert.match(msciIndonesiaText(nodes.find(n=>msciIndonesiaTag(n)==='desc')),/qualitatif|qualitative/iu);}
  if(figure===2){
    const metrics=[['cap',[119.14169,53.35581],120],['count',[18,9],20],['weight',[1.16,.43],1.2]];
    for(const[i,[name,values,max]]of metrics.entries()){const x=mobile?260:24+i*326+18,scale=mobile?292:264,axis=find(name+'-axis');near(number(axis,'x1'),x);near(number(axis,'x2'),x+scale);near(number(axis,'y1'),number(axis,'y2'));
      for(const[j,v]of values.entries()){const bar=find(name+'-'+j);near(number(bar,'x'),x);near(number(bar,'width'),scale*v/max);near(number(bar,'height'),mobile?22:28);assert.equal(msciIndonesiaAttrs(bar).fill,`var(--color-${j?'signal':'topic-blue'})`);}}
    for(const s of fr?['31.12.2025','30.09.2026','119,14','53,36','−55,22','−0,73']:['31 Dec 2025','30 Sep 2026','119.14','53.36','−55.22','−0.73'])includes(s);
    near((53.35581/119.14169-1)*100,-55.216507336768514);
  }
  if(figure===3){
    for(let i=0;i<2;i++){const units=nodes.filter(n=>msciIndonesiaTag(n)==='rect'&&msciIndonesiaAttrs(n).id?.startsWith(prefix+`-unit-${i}-`));assert.equal(units.length,100);assert.equal(units.filter(n=>msciIndonesiaAttrs(n).fill==='var(--color-signal)').length,i?20:30);assert.equal(units.filter(n=>msciIndonesiaAttrs(n).stroke==='var(--color-accent)').length,i?10:0);for(const[j,v]of[300,i?200:240].entries()){const b=find(`base-${i}-${j}`);near(number(b,'width'),(mobile?396:330)*v/300);near(number(b,'x'),mobile?42:42+i*492);near(number(b,'height'),16);}}
    for(const s of ['30 → 30','30 → 20','300','240','200','100 ×','30 %'])if(fr||s!=='30 %')includes(s);assert.match(joined,/fictif|Hypothetical/iu);assert.match(joined,/poids.*prix|weight.*price/iu);
  }
  if(figure===4){for(const s of ['EEM','IEMG','EIDO','EM IMI','Indonesia','IMI 25/50','Standalone','AP'])includes(s);assert.match(joined,/inchangés|unchanged/u);assert.match(joined,/nature|In-kind|espèces|Securities/u);assert.match(joined,/Rééquilibrage|Rebalancing/u);for(const i of[0,1,2])find('mandate-'+i);}
  if(figure===5){
    const start=Date.UTC(2026,9,1),end=Date.UTC(2029,2,31),pos=d=>(Date.parse(d+'T00:00:00Z')-start)/(end-start),coord=d=>(mobile?232:180)+pos(d)*(mobile?454:770);
    for(const[id,d]of [['launch','2026-10-15'],['feedback','2027-04-30'],['decision','2027-06-30'],...(mobile?[['idx-2027','2027-03-31'],['idx-2028','2028-03-31'],['idx-2029','2029-03-31']]:[['idx-a-2027','2027-03-31'],['idx-a-2028','2028-03-31'],['idx-b-2027','2027-03-31'],['idx-c-2029','2029-03-31']])])near(number(find(id),mobile?'cy':'cx'),coord(d));
    const axis=find('calendar-axis');near(number(axis,mobile?'y1':'x1'),mobile?232:180);near(number(axis,mobile?'y2':'x2'),mobile?686:950);assert.equal(msciIndonesiaAttrs(find('decision')).fill,'var(--color-ink)','The decision deadline remains hollow and is not an implementation date');
    for(const s of fr?['12,5','15 %','5 000','31.03.']:['12.5','15%','IDR5tn','31.03.'])includes(s);assert.match(joined,/non fixée|date unset/u);assert.match(joined,/max\.|Decision due/u);assert.match(joined,/minimal IDX|IDX minimum|IDX min\./u);
  }
  return true;
}
export function assertMsciIndonesiaGeometry(svg) {
  const { root, nodes } = inspectMsciIndonesiaSvg(svg), [,, width, height] = msciIndonesiaAttrs(root).viewBox.split(' ').map(Number);
  const labelBoxes = [];
  const visible = node => msciIndonesiaTag(node) === 'defs' ? [] : [node, ...(node[msciIndonesiaTag(node)] ?? []).filter(child => msciIndonesiaTag(child) !== '#text').flatMap(visible)];
  const point = (x, y) => assert.ok(Number.isFinite(x) && Number.isFinite(y) && x >= 0 && y >= 0 && x <= width && y <= height, `Shape outside viewBox: ${x},${y}`);
  for (const node of visible(root)) {
    const a = msciIndonesiaAttrs(node), tag = msciIndonesiaTag(node);
    if (tag === 'rect') {
      const x = Number(a.x ?? 0), y = Number(a.y ?? 0), w = a.width === '100%' ? width : Number(a.width), h = a.height === '100%' ? height : Number(a.height);
      assert.ok(w >= 0 && h >= 0); point(x, y); point(x + w, y + h);
    }
    if (tag === 'circle') { const x = number(node, 'cx'), y = number(node, 'cy'), r = number(node, 'r'); assert.ok(r >= 0); point(x - r, y - r); point(x + r, y + r); }
    if (tag === 'line') { point(number(node, 'x1'), number(node, 'y1')); point(number(node, 'x2'), number(node, 'y2')); }
    if (tag === 'path') {
      // All supplied visible paths use absolute straight segments. Consume the
      // entire bounded grammar rather than extracting numbers from unknown SVG.
      for (const [x, y] of pathPoints(a.d)) point(x, y);
    }
  }
  const panels = nodes.filter(node => msciIndonesiaTag(node) === 'rect' && [6, 8, 10, 12].includes(number(node, 'rx')));
  const contains = (a, b) => number(a, 'x') <= number(b, 'x') && number(a, 'y') <= number(b, 'y') && number(a, 'x') + number(a, 'width') >= number(b, 'x') + number(b, 'width') && number(a, 'y') + number(a, 'height') >= number(b, 'y') + number(b, 'height');
  const footer = nodes.filter(n => msciIndonesiaTag(n) === 'line' && number(n, 'x1') === 24 && number(n, 'x2') === width - 24 && number(n, 'y1') === number(n, 'y2')).sort((a, b) => number(b, 'y1') - number(a, 'y1'))[0];
  if (footer) for (const p of panels) assert.ok(number(p, 'y') + number(p, 'height') <= number(footer, 'y1') - 8, 'Panel retains space above the source footer');
  for (let i = 0; i < panels.length; i++) for (const b of panels.slice(i + 1)) {
    const a = panels[i]; if (contains(a, b) || contains(b, a)) continue; const overlapX = Math.min(number(a, 'x') + number(a, 'width'), number(b, 'x') + number(b, 'width')) - Math.max(number(a, 'x'), number(b, 'x'));
    const overlapY = Math.min(number(a, 'y') + number(a, 'height'), number(b, 'y') + number(b, 'height')) - Math.max(number(a, 'y'), number(b, 'y'));
    if (overlapX > 0) assert.ok(overlapY <= -4, 'Adjacent authored panels retain a visible gutter');
    if (overlapY > 0) assert.ok(overlapX <= -4, 'Adjacent authored panels retain a visible gutter');
  }
  for (const node of nodes.filter(node => msciIndonesiaTag(node) === 'text')) {
    const a = msciIndonesiaAttrs(node), size = Number(a['font-size']), font = fonts.get(Number(a['font-weight'])), label = msciIndonesiaText(node);
    assert.ok(font);
    for (const glyph of Array.from(label)) assert.ok(font.charToGlyphIndex(glyph) > 0, `Missing local glyph: ${glyph}`);
    const advance = font.getAdvanceWidth(label, size), x = number(node, 'x') - (a['text-anchor'] === 'middle' ? advance / 2 : a['text-anchor'] === 'end' ? advance : 0), y = number(node, 'y');
    const box = { x1: Infinity, y1: Infinity, x2: -Infinity, y2: -Infinity }, scale = size / font.unitsPerEm;
    font.forEachGlyph(label, x, y, size, {}, (glyph, gx, gy) => {
      if (!Number.isFinite(glyph.xMin) || glyph.xMin === glyph.xMax && glyph.yMin === glyph.yMax) return;
      box.x1 = Math.min(box.x1, gx + glyph.xMin * scale); box.x2 = Math.max(box.x2, gx + glyph.xMax * scale);
      box.y1 = Math.min(box.y1, gy - glyph.yMax * scale); box.y2 = Math.max(box.y2, gy - glyph.yMin * scale);
    });
    assert.ok(box.x1 >= 2 && box.y1 >= 2 && box.x2 <= width - 2 && box.y2 <= height - 2, `Text outside viewBox: ${label}`);
    labelBoxes.push({ ...box, label, panel: a['data-panel'], node });
    if (a['data-max-width']) assert.ok(advance <= Number(a['data-max-width']) + 1, `Text exceeds its authored column: ${label}`);
    const panel = a['data-panel'] ? nodes.find(panel => ['rect', 'circle'].includes(msciIndonesiaTag(panel)) && msciIndonesiaAttrs(panel).id === a['data-panel']) : panels.filter(panel => number(node, 'x') >= number(panel, 'x') && number(node, 'x') <= number(panel, 'x') + number(panel, 'width') && y >= number(panel, 'y') && y <= number(panel, 'y') + number(panel, 'height')).sort((a, b) => number(a, 'width') * number(a, 'height') - number(b, 'width') * number(b, 'height'))[0];
    if (a['data-panel']) assert.ok(panel, 'Authored containing panel exists');
    if (panel) assert.ok(box.x1 >= number(panel, 'x') + 2 && box.y1 >= number(panel, 'y') + 2 && box.x2 <= number(panel, 'x') + number(panel, 'width') - 2 && box.y2 <= number(panel, 'y') + number(panel, 'height') - 10, `Text outside internal panel: ${label}`);
    // Glyph outlines exclude unused ascent/descent. Chromium's getBBox()
    // includes those font extents and varies slightly with the screen scale.
    // Keep a conservative full em above the baseline and 0.3 em below it;
    // rendered browser QA separately checks every authored panel at all widths.
    if (panel) assert.ok(x >= number(panel, 'x') + 1 && y - size >= number(panel, 'y') + 1 && x + advance <= number(panel, 'x') + number(panel, 'width') - 1 && y + size * .3 <= number(panel, 'y') + number(panel, 'height') - 1, `Typographic extents outside internal panel: ${label}`);
  }
  const dataBars = nodes.filter(n => msciIndonesiaTag(n) === 'rect' && /-(?:cap|count|weight|base-[01])-[01]$/u.test(msciIndonesiaAttrs(n).id ?? ''));
  for (const text of labelBoxes) for (const bar of dataBars) {
    if (text.panel === msciIndonesiaAttrs(bar).id) continue;
    const overlapX = Math.min(text.x2, number(bar,'x') + number(bar,'width')) - Math.max(text.x1,number(bar,'x'));
    const overlapY = Math.min(text.y2, number(bar,'y') + number(bar,'height')) - Math.max(text.y1,number(bar,'y'));
    assert.ok(overlapX <= 0 || overlapY <= 0, `Text overlaps a quantitative bar: ${text.label}`);
  }
  for (const label of labelBoxes) for (const shape of nodes.slice(nodes.indexOf(label.node) + 1).filter(n => msciIndonesiaTag(n) === 'rect' && msciIndonesiaAttrs(n).fill !== 'none')) {
    const dx = Math.min(label.x2, number(shape,'x') + number(shape,'width')) - Math.max(label.x1,number(shape,'x'));
    const dy = Math.min(label.y2, number(shape,'y') + number(shape,'height')) - Math.max(label.y1,number(shape,'y'));
    assert.ok(dx <= 1 || dy <= 1, `A later background cannot cover a label: ${label.label}`);
  }
  for (const b of labelBoxes) for (const circle of nodes.filter(n => msciIndonesiaTag(n) === 'circle')) {
    const a = msciIndonesiaAttrs(circle); if (b.panel === a.id) continue;
    const dx = number(circle, 'cx') - Math.max(b.x1, Math.min(number(circle, 'cx'), b.x2));
    const dy = number(circle, 'cy') - Math.max(b.y1, Math.min(number(circle, 'cy'), b.y2));
    assert.ok(Math.hypot(dx, dy) >= number(circle, 'r') + 1, `Text overlaps an unrelated node or badge: ${b.label}`);
  }
  for (let i = 0; i < labelBoxes.length; i++) for (let j = i + 1; j < labelBoxes.length; j++) {
    const a = labelBoxes[i], b = labelBoxes[j];
    assert.ok(!(Math.min(a.x2, b.x2) - Math.max(a.x1, b.x1) > 1 && Math.min(a.y2, b.y2) - Math.max(a.y1, b.y1) > 1), `Overlapping labels: ${a.label} / ${b.label}`);
  }
  for (const arrow of nodes.filter(n => msciIndonesiaTag(n) === 'line' && msciIndonesiaAttrs(n)['marker-end'])) {
    const x1=number(arrow,'x1'),y1=number(arrow,'y1'),x2=number(arrow,'x2'),y2=number(arrow,'y2');
    for (const label of labelBoxes) for(let i=0;i<=50;i++) {
      const x=x1+(x2-x1)*i/50,y=y1+(y2-y1)*i/50;
      assert.ok(!(x>label.x1-1 && x<label.x2+1 && y>label.y1-1 && y<label.y2+1), `A transfer rail cannot cross a label: ${label.label}`);
    }
  }

  // Multi-segment feedback arrows require the same clear text gutters as straight rails.
  for(const route of nodes.filter(n=>msciIndonesiaTag(n)==='path'&&msciIndonesiaAttrs(n)['marker-end'])){
    const pts=pathPoints(msciIndonesiaAttrs(route).d);
    for(let i=1;i<pts.length;i++)for(let k=0;k<=50;k++){
      const x=pts[i-1][0]+(pts[i][0]-pts[i-1][0])*k/50,y=pts[i-1][1]+(pts[i][1]-pts[i-1][1])*k/50;
      for(const b of labelBoxes)assert.ok(!(x>b.x1-1&&x<b.x2+1&&y>b.y1-1&&y<b.y2+1),`A feedback rail cannot cross a label: ${b.label}`);
    }
  }
  return true;
}

export function assertMsciIndonesiaProportions(svg) {
  const { root, nodes } = inspectMsciIndonesiaSvg(svg), [,, width, height] = msciIndonesiaAttrs(root).viewBox.split(' ').map(Number), mobile = width === 600;
  assert.equal(width, mobile ? 600 : 1000);
  assert.ok(height / width <= (mobile ? 1.55 : .8), 'Artwork retains compact in-page proportions');
  assert.ok(nodes.filter(node => msciIndonesiaTag(node) === 'text').every(node => number(node, 'font-size') >= 28), 'Every label remains legible at the container breakpoint');
}

const projection = node => {
  if (node.nodeName === '#comment') return null;
  if (node.nodeName === '#text') return node.value.trim() ? { text: node.value } : null;
  return { tag: node.tagName ?? node.nodeName, attrs: Object.fromEntries((node.attrs ?? []).map(a => [a.name, a.value]).sort(([a], [b]) => a.localeCompare(b))), children: (node.childNodes ?? []).map(projection).filter(Boolean) };
};
export function assertMsciIndonesiaRenderedFaithful(svg, source, lang, index) {
  assertMsciIndonesiaSourceFaithful(source, lang, index);
  assert.equal(msciIndonesiaAttrs(inspectMsciIndonesiaSvg(svg).root).style,'width:100%;height:auto','The compiled root keeps its responsive contract');
  assertMsciIndonesiaGeometry(svg);
  assertMsciIndonesiaQuantitative(svg, Math.floor(index / 2) + 1);
  assert.deepEqual(projection(parseFragment(svg.replace(' style="width:100%;height:auto"', ''))), projection(parseFragment(source.replace(' style="width:100%;height:auto"', ''))), 'Astro preserves all native SVG attributes, text and element ordering');
}

export function assertMsciIndonesiaArticleReferences(article) {
  const all=n=>[n,...(n.childNodes??[]).flatMap(all)],attr=(n,k)=>n.attrs?.find(a=>a.name===k)?.value,text=n=>n.nodeName==='#text'?n.value:(n.childNodes??[]).map(text).join('');
  const nodes=all(parseFragment(article)),entries=nodes.filter(n=>n.tagName==='li'&&/^source-s(?:0[1-9]|1[0-9])$/u.test(attr(n,'id')??''));
  const expected=Array.from({length:19},(_,i)=>'source-s'+String(i+1).padStart(2,'0'));assert.deepEqual(entries.map(n=>attr(n,'id')),expected,'All 19 complete source records remain');
  const lists=nodes.filter(n=>n.tagName==='ol'&&((attr(n,'class')??attr(n,'classname')??'').split(/\s/u).includes('sources-list')));assert.equal(lists.length,1,'One shared bibliography');assert.deepEqual(all(lists[0]).filter(n=>n.tagName==='li').map(n=>attr(n,'id')),expected);
  for(const entry of entries){assert.ok(text(entry).trim().length>60,'Every source retains nonempty bibliographic metadata');assert.ok(all(entry).some(n=>n.tagName==='a'&&/^https:\/\//u.test(attr(n,'href')??'')),'Every source has an HTTPS origin');}
  for(const link of nodes.filter(n=>n.tagName==='a'&&(attr(n,'href')??'').startsWith('#source-')))assert.ok(expected.includes(attr(link,'href').slice(1)),'Every citation resolves');
  return true;
}
