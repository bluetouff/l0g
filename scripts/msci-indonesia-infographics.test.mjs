import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { XMLBuilder, XMLParser, XMLValidator } from 'fast-xml-parser';
import { parse } from 'parse5';
import { createProcessor } from '@mdx-js/mdx';
import postcss from 'postcss';
import { msciIndonesiaSvg, MSCI_INDONESIA_KINDS } from '../src/lib/msciIndonesiaFigures.mjs';

const read = file => readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
const digest = value => createHash('sha256').update(value).digest('hex');
// Independent original complete XML, DOM and attribute-tree goldens.
const originals={
  "ownership-fr-desktop": {
    "rawHash": "10c57bee2cc679ae04c3faeaa2cbf1e1a28d14031366e6b940452011a83f5c19",
    "domHash": "1bfd4838a98c3a777c1e2acdd846959527d0dc959fba27f6ba45c4fc5f07d2c1",
    "geometryHash": "259a74ac981b2ba7482c07a1ac6862d20b9cf3ae09bbe5f4aa7007d37f4be968",
    "viewBox": "0 0 1100 820"
  },
  "ownership-fr-mobile": {
    "rawHash": "9cf0c901e41b06decf0cd9ed85555ca06297b3a4b913dde3dc76a815ad201b06",
    "domHash": "5b5f9167927e85827fb5521e57e1a412a4716e1274e9286365619614cd6dbf95",
    "geometryHash": "5485d0e88ea8e53f343e08288971c87775e6456c4fcd8e8437697dc806b2acc7",
    "viewBox": "0 0 560 1460"
  },
  "contraction-fr-desktop": {
    "rawHash": "6a107dbb2b6e8b160bd3b43ba1a1d5a9cfec0e18be9b59a2b4c80c28cbc3550f",
    "domHash": "f429cf8dd3c1266b751026494236c0250c0589c6b17a89d00ddb1db41920f4af",
    "geometryHash": "af4fd6ee59a636cf170638c892ea6988d72bbd0d5860501059e142a5b0a613c8",
    "viewBox": "0 0 1100 790"
  },
  "contraction-fr-mobile": {
    "rawHash": "6f93cf8dd0987a6243f97242f2581a3bb353b33d0e95502bff523ef33368eedc",
    "domHash": "17074263aa9555d30f4fdab7ffa3692ef29c46acd008055c00f105664a1dba6c",
    "geometryHash": "b87cd6ca2b4931fac892528e0e4320073cf05d1d718a77baec92bf075cb57195",
    "viewBox": "0 0 560 1120"
  },
  "selling-fr-desktop": {
    "rawHash": "a2b514a1f063eda60c3e4a232abb26c45e10ac8b8e0d2b1a5f070581f5003144",
    "domHash": "f888526595d84d71aac1770a887a97d6f461082a568cf00efa479fc7c586baf3",
    "geometryHash": "40a1651699139b9077e9596123ca0dfaca9e644a078aca313a56a08f88054b1f",
    "viewBox": "0 0 1100 940"
  },
  "selling-fr-mobile": {
    "rawHash": "a534fcee5bc06bf367a82d7b610a24dda9078f75804eb7c555f26852873bb5c4",
    "domHash": "53feb6a5cc4754ef7a383b35c5b3a07138816d0ef164ea6b95d36206ee7a9a4e",
    "geometryHash": "ac0dc417b62304165f9ecd9248d4e1cb7b162b38947a5dd824f36e3ed5ab645e",
    "viewBox": "0 0 560 1430"
  },
  "concentration-fr-desktop": {
    "rawHash": "f7c524c20f2d045d95c1f9b1104e17b200ea867ab38fd249c8fb8a1660012dda",
    "domHash": "947e96c063cbcdb5d3756d3e596faf64a6feb7f22048e6ba1c8a2f68453ab70e",
    "geometryHash": "33351834dfaeb70c99dd8fa2e311d6750d036de179bece2a839b5952608166b2",
    "viewBox": "0 0 1100 865"
  },
  "concentration-fr-mobile": {
    "rawHash": "b0640d9729462c5c7580c58cd21314d1306a2213d5991620e920e478724bae69",
    "domHash": "28fcc8effb6f18e828d7f92f0287e7207480998ac1854caedb3459eba1c0a1ca",
    "geometryHash": "554c10c3a25e253ecea3b1e89a42f62a972ee7ea3f93dca99ee9880b9cfb6a72",
    "viewBox": "0 0 560 1430"
  },
  "calendar-fr-desktop": {
    "rawHash": "ec7c5d9117badc44fb8425fa9a36c4cbc7d798e9f721c1bc224eb37f9691c044",
    "domHash": "4c5c4f765710bea0428e2901ef4dcce974af915318cb2facca538f6f9fa72004",
    "geometryHash": "d3172fad5de7100ed75235c71fe447df38f8dfc8e5322b1b20d5424af7fd09dd",
    "viewBox": "0 0 1100 1060"
  },
  "calendar-fr-mobile": {
    "rawHash": "df0bfc8c6d375375e51386b7130f38f73b105baf5393084b5df42ced37dd62e9",
    "domHash": "842589012dcec9298affd9937e05e1acac745f251faebbd6794409ccc2693b50",
    "geometryHash": "789876369e71397a7d56d6a0cf9db944d853fea889efd1c6a24259fa0e900c9a",
    "viewBox": "0 0 560 1660"
  },
  "ownership-en-desktop": {
    "rawHash": "2d5587eb8dd45f29186501cff063bc689eb40619bb46e5bcef7267ea987a29d8",
    "domHash": "cc6fe0f7b92159096f009a5e4ed3f725cbd101981c8149a4b803e6c3483c078f",
    "geometryHash": "c233b896c9a6f078c5311574586af8f19df49cfee9771f9d2ee20ee2952f8d6b",
    "viewBox": "0 0 1100 820"
  },
  "ownership-en-mobile": {
    "rawHash": "813203ce131edcc7e436a9f0a71968df7bf53e50aa34e2e8d588327decbdb396",
    "domHash": "0f7da5d1f73ed56da72f407c2858c01b1565dbf8dd513126e1ce8a9593ab226d",
    "geometryHash": "823c09a48e78d051e7ab887cf947d040f097f08b0bf162d5810f9d64f6298357",
    "viewBox": "0 0 560 1460"
  },
  "contraction-en-desktop": {
    "rawHash": "3652420533c1e58de855b3cac735ce93a9667a93e2fe6f983fcb76c7e7cb931b",
    "domHash": "2a128f282fb865242a1e3704a5a8b0978072713607064eb487214926f3fa8ddb",
    "geometryHash": "ac21caca2361ff22a22ff3886d017cdd677d8b232a6d2a70dfd90649c6fed52d",
    "viewBox": "0 0 1100 790"
  },
  "contraction-en-mobile": {
    "rawHash": "b95d0a580a828365ba6fd407a879d46b633a7dd63880feb4bf0843170c965f50",
    "domHash": "11ba62abd51de14361e1d7f351d6aea8f4b951933fbe5fb855a4c2587382cb9d",
    "geometryHash": "65509a8e3395511924b9c1803d83c1b8b0f609549d1398800e33252f5929ca7c",
    "viewBox": "0 0 560 1120"
  },
  "selling-en-desktop": {
    "rawHash": "98a0d9bd6f8b5f882978dd996db8d73b9957e012b647963fe90597dbe05d6586",
    "domHash": "35571826b7c1e8a331898582ce4e8a0882e36eb6d2641953b316bcb58f3e78c8",
    "geometryHash": "1b1ddb997f0f8a2186f78d223b1511cf38ae3f3b6aa589b98f6aab0e15fbc1da",
    "viewBox": "0 0 1100 940"
  },
  "selling-en-mobile": {
    "rawHash": "a9047c6fed143e4806420a7874b7c4e6cebee1d4b018dc3d2cc9762fb63707ad",
    "domHash": "4258d311896810f34f7311d5fa434c1c26a06aea1ab593179c1c4358ad1585cf",
    "geometryHash": "9a71b639d79b2e31e190cc0dc8068c25a7306350ccbd12bb09c4bc1ada1b47f3",
    "viewBox": "0 0 560 1430"
  },
  "concentration-en-desktop": {
    "rawHash": "b066c21473d40607a5a3efc99cf7fb6b58102b1e92e882b0ffd72c28998e49e2",
    "domHash": "3f9b754d48396df39dd266fc160a7a7040547e7bc90221e14ac5dd5057451ef2",
    "geometryHash": "e3813e35de098a0c5ec22e779807fc26b7c9cb92f7190cc99fd4641565f97484",
    "viewBox": "0 0 1100 865"
  },
  "concentration-en-mobile": {
    "rawHash": "b61a19d1a8d888a1853e42e4d52ec78229c3535468d5ee4845408f8be2ec431d",
    "domHash": "543e88e76686d79e3ddfce4d041b720b52af096b114137e99e92c07904562cbb",
    "geometryHash": "695c7d2088ce94a2b5a3e9ef33dd2ce3f3192243f0300078670945500134583a",
    "viewBox": "0 0 560 1430"
  },
  "calendar-en-desktop": {
    "rawHash": "39ca860f9c4d2e237e97d1aa7a58e0882709dc99b2d6d5a046b6e7e1d37f78d0",
    "domHash": "657b0cb1fbdb4ecf224acbef316373edbbc495af40a4ce45cd91529035308db6",
    "geometryHash": "c4577206bb73d13c008a817501adc4b71fb8aea072f889b4fa2dd4848a18a229",
    "viewBox": "0 0 1100 1060"
  },
  "calendar-en-mobile": {
    "rawHash": "6d473f03c08ccafa7acc8b9167641d855d66e5c81bf13ec740f1b4a22e80b117",
    "domHash": "c42a9be0121811a9919cdb306083130355e6be92bf287b30ba8232668430a35b",
    "geometryHash": "573afd5ab2a5487ae854c2837ef965c44dd138a6339701d602fd0959263693bb",
    "viewBox": "0 0 560 1660"
  }
};
const textCorrections={
  "ownership-fr-mobile": {
    "pairs": [
      [
        "LE FLOTTANT CHANGE DE SENS",
        "FLOTTANT ET CONTRÔLE",
        1
      ]
    ],
    "expectedHash": "aed1f9af9fa118df22e684b188ca4430857bed10ec33e59d8a410869e63f0f75",
    "expectedDomHash": "40f2c4d650f40ef66bd9f28c502f27a10efa0c3999af28ddce0c184b3e56bb69"
  },
  "ownership-en-mobile": {
    "pairs": [
      [
        "WHAT “FLOAT” REALLY MEANS",
        "FREE FLOAT AND CONTROL",
        1
      ]
    ],
    "expectedHash": "4fc8f9e18364c329de4f2deef625dc5406a1e9c14d94b35cf28bd40d0e23b873",
    "expectedDomHash": "d15ca61acf6ac06c71aebaa22deb04c112be89be1f487ca643b174ae684f3af2"
  }
};
const kinds=["ownership","contraction","selling","concentration","calendar"];
const variants = ['fr', 'en'].flatMap(lang => kinds.flatMap(kind => [false, true].map(mobile => ({ lang, kind, mobile, key: `${kind}-${lang}-${mobile ? 'mobile' : 'desktop'}`, svg: msciIndonesiaSvg(lang, kind, mobile) }))));
const parser = new XMLParser({ preserveOrder: true, ignoreAttributes: false, attributeNamePrefix: '', trimValues: false, parseTagValue: false, parseAttributeValue: false });
const builder = new XMLBuilder({ preserveOrder: true, ignoreAttributes: false, attributeNamePrefix: '' });
const tag = n => Object.keys(n).find(k => k !== ':@');
const attrs = n => n[':@'] ?? {};
const children = n => n[tag(n)] ?? [];
const xmlNodes = n => tag(n) === '#text' ? [] : [n, ...children(n).flatMap(xmlNodes)];
const xmlText = n => tag(n) === '#text' ? n['#text'] : children(n).map(xmlText).join('');
const htmlNodes = n => [n, ...(n.childNodes ?? []).flatMap(htmlNodes)];
const canonical = n => n.nodeName === '#text' ? ['#text', n.value] : [n.tagName, (n.attrs ?? []).map(a => [a.name, a.value]).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0), (n.childNodes ?? []).filter(c => c.nodeName !== '#text' || c.value.trim() || ['text', 'tspan', 'title', 'desc', 'metadata', 'style'].includes(n.tagName)).map(canonical)];
const domHash = raw => { const roots = htmlNodes(parse(raw)).filter(n => n.tagName === 'svg'); assert.equal(roots.length, 1); return digest(JSON.stringify(canonical(roots[0]))); };
const allowed = Object.fromEntries(Object.entries({
 svg:'xmlns viewBox role aria-labelledby class', title:'id', desc:'id', defs:'',
 pattern:'id width height patternUnits', marker:'id markerWidth markerHeight refX refY orient',
 path:'d fill stroke stroke-width opacity marker-end',
 rect:'x y width height rx fill stroke stroke-width stroke-dasharray',
 text:'x y fill font-family font-size font-weight text-anchor', tspan:'x dy',
 circle:'cx cy r fill', line:'x1 y1 x2 y2 stroke stroke-width marker-end',
}).map(([k,v])=>[k,new Set(v?v.split(' '):[])]));
const palette=new Set(['#344556','#b6c4cf','#101923','#79dfbc','#f3eee4','#71849b','#efc778','#172431','#8ab8f1','#fb927f','#b4a4e8']);
const numeric=new Set('x y width height rx cx cy r x1 y1 x2 y2 font-size stroke-width opacity dy refX refY markerWidth markerHeight'.split(' '));
function number(value) {
 assert.equal(typeof value,'string');assert.ok(value.length>0&&value.length<=32);
 assert.match(value,/^-?(?:\d{1,4}(?:\.\d{1,18})?|\.\d{1,18})$/u);
 const n=Number(value);assert.ok(Number.isFinite(n)&&Math.abs(n)<=10000);return n;
}
const value=(n,k,fallback='0')=>number(attrs(n)[k]??fallback);
function curvePoints(p) {
  assert.ok([3, 4].includes(p.length) && p.flat().every(Number.isFinite));
  const points = [p[0], p.at(-1)];
  const at = t => p.length === 3
    ? [0, 1].map(k => (1 - t) ** 2 * p[0][k] + 2 * (1 - t) * t * p[1][k] + t ** 2 * p[2][k])
    : [0, 1].map(k => (1 - t) ** 3 * p[0][k] + 3 * (1 - t) ** 2 * t * p[1][k] + 3 * (1 - t) * t ** 2 * p[2][k] + t ** 3 * p[3][k]);
  for (const k of [0, 1]) {
    let roots;
    if (p.length === 3) {
      const denominator = p[0][k] - 2 * p[1][k] + p[2][k];
      roots = denominator === 0 ? [] : [(p[0][k] - p[1][k]) / denominator];
    } else {
      const a = -p[0][k] + 3 * p[1][k] - 3 * p[2][k] + p[3][k];
      const b = 2 * (p[0][k] - 2 * p[1][k] + p[2][k]);
      const c = p[1][k] - p[0][k], discriminant = b * b - 4 * a * c;
      roots = Math.abs(a) < 1e-12 ? (Math.abs(b) < 1e-12 ? [] : [-c / b])
        : discriminant < 0 ? [] : [(-b - Math.sqrt(discriminant)) / (2 * a), (-b + Math.sqrt(discriminant)) / (2 * a)];
    }
    for (const t of roots) if (t > 0 && t < 1) points.push(at(t));
  }
  assert.ok(points.flat().every(Number.isFinite)); return points;
}
// SVG 2 Appendix B.2 endpoint-to-center conversion, with true rotated extrema.
// https://www.w3.org/TR/SVG2/implnote.html#ArcImplementationNotes
function arcPoints(start, radii, rotation, large, sweep, end) {
  assert.ok([start, radii, end].every(p => p.length === 2 && p.every(Number.isFinite)));
  assert.ok(Number.isFinite(rotation) && [0, 1].includes(large) && [0, 1].includes(sweep));
  let [rx, ry] = radii.map(Math.abs);
  if ((start[0] === end[0] && start[1] === end[1]) || rx === 0 || ry === 0) return [start, end];
  const phi = (rotation % 360) * Math.PI / 180, cos = Math.cos(phi), sin = Math.sin(phi);
  const dx = (start[0] - end[0]) / 2, dy = (start[1] - end[1]) / 2;
  const xp = cos * dx + sin * dy, yp = -sin * dx + cos * dy;
  const scale = xp * xp / (rx * rx) + yp * yp / (ry * ry);
  if (scale > 1) { rx *= Math.sqrt(scale); ry *= Math.sqrt(scale); }
  const denominator = rx * rx * yp * yp + ry * ry * xp * xp;
  const factor = (large === sweep ? -1 : 1) * Math.sqrt(Math.max(0, (rx * rx * ry * ry - denominator) / denominator));
  const cxp = factor * rx * yp / ry, cyp = -factor * ry * xp / rx;
  const cx = cos * cxp - sin * cyp + (start[0] + end[0]) / 2;
  const cy = sin * cxp + cos * cyp + (start[1] + end[1]) / 2;
  const u = [(xp - cxp) / rx, (yp - cyp) / ry], v = [(-xp - cxp) / rx, (-yp - cyp) / ry];
  const theta = Math.atan2(u[1], u[0]), tau = 2 * Math.PI;
  let delta = Math.atan2(u[0] * v[1] - u[1] * v[0], u[0] * v[0] + u[1] * v[1]);
  if (!sweep && delta > 0) delta -= tau;
  if (sweep && delta < 0) delta += tau;
  const mod = a => ((a % tau) + tau) % tau;
  const withinSweep = a => (sweep ? mod(a - theta) : mod(theta - a)) <= Math.abs(delta) + 1e-12;
  const at = a => [cx + rx * Math.cos(a) * cos - ry * Math.sin(a) * sin, cy + rx * Math.cos(a) * sin + ry * Math.sin(a) * cos];
  const xCritical = Math.atan2(-ry * sin, rx * cos), yCritical = Math.atan2(ry * cos, rx * sin);
  const result = [start, end, ...[xCritical, xCritical + Math.PI, yCritical, yCritical + Math.PI].filter(withinSweep).map(at)];
  assert.ok(result.flat().every(Number.isFinite)); return result;
}
function pathPoints(raw) {
  assert.equal(typeof raw, 'string'); assert.ok(raw.length > 0 && raw.length <= 8192);
  // The supplied polylines use legal comma separators only between coordinate numbers.
  raw = raw.replace(/(?<=\d),(?=-?(?:\d|\.\d))/gu, ' ');
  const token = /[MLHVZCQTA]|-?(?:\d{1,4}(?:\.\d{1,18})?|\.\d{1,18})/uy;
  const tokens = []; let offset = 0;
  while (offset < raw.length) {
    if (/\s/u.test(raw[offset])) { offset++; continue; }
    token.lastIndex = offset; const match = token.exec(raw); assert.ok(match, 'Complete path token');
    tokens.push(match[0]); assert.ok(tokens.length <= 2048); offset = token.lastIndex;
  }
  assert.equal(tokens[0], 'M'); const points = []; let i = 0, current, origin, quadraticControl, count = 0, repeat;
  const pair = () => [number(tokens[i++]), number(tokens[i++])];
  while (i < tokens.length) {
    const command = /^[MLHVZCQTA]$/u.test(tokens[i]) ? tokens[i++] : repeat; assert.ok(['M', 'L', 'H', 'V', 'Z', 'C', 'Q', 'T', 'A'].includes(command));
    assert.ok(++count <= 512); repeat = command === 'M' ? 'L' : command === 'Z' ? undefined : command;
    if (command === 'Z') { assert.ok(origin); current = [...origin]; quadraticControl = undefined; }
    else if (command === 'M' || command === 'L') {
      if (command === 'L') assert.ok(current);
      current = pair(); quadraticControl = undefined;
      if (command === 'M') origin = [...current];
    } else if (command === 'H' || command === 'V') {
      assert.ok(current); current = [...current]; current[command === 'H' ? 0 : 1] = number(tokens[i++]); quadraticControl = undefined;
    } else if (command === 'A') {
      assert.ok(current);const radii=pair(),rotation=number(tokens[i++]),large=number(tokens[i++]),sweep=number(tokens[i++]),end=pair();
      points.push(...arcPoints(current,radii,rotation,large,sweep,end));current=end;quadraticControl=undefined;
    } else {
      assert.ok(current); let controls;
      if (command === 'C') { controls = [pair(), pair()]; quadraticControl = undefined; }
      else {
        const control = command === 'Q' ? pair() : quadraticControl ? [2 * current[0] - quadraticControl[0], 2 * current[1] - quadraticControl[1]] : [...current];
        controls = [control]; quadraticControl = control;
      }
      const end = pair(); points.push(...curvePoints([current, ...controls, end])); current = end;
    }
    points.push([...current]);
  }
  assert.ok(points.length); return points;
}
function inspect(v) {
 assert.equal(typeof v.svg,'string');assert.ok(v.svg.length>100&&v.svg.length<40000);
 assert.doesNotMatch(v.svg,/<!|<\?|&(?!amp;|lt;|gt;|quot;|apos;)/u);assert.equal(XMLValidator.validate(v.svg),true);
 const roots=parser.parse(v.svg);assert.equal(roots.length,1);const root=roots[0];assert.equal(tag(root),'svg');
 const index=kinds.indexOf(v.kind)+1,prefix=`msci-${v.lang}-f${index}-${v.mobile?'m':'d'}`;
 assert.deepEqual(attrs(root),{xmlns:'http://www.w3.org/2000/svg',viewBox:originals[v.key].viewBox,role:'img','aria-labelledby':`${prefix}-title ${prefix}-desc`,class:'l0g-msci-svg'});
 const nodes=xmlNodes(root);assert.ok(nodes.length<512);const ids=[];
 for(const n of nodes){
  assert.ok(Object.hasOwn(allowed,tag(n)),`Passive tag ${tag(n)}`);
  for(const[k,val]of Object.entries(attrs(n))){
   assert.ok(allowed[tag(n)].has(k),`Known field ${tag(n)}.${k}`);assert.equal(typeof val,'string');assert.ok(val.length<=8192);
   if(numeric.has(k)){const num=number(val);if(['width','height','rx','r','stroke-width','markerWidth','markerHeight'].includes(k))assert.ok(num>=0);if(k==='opacity')assert.ok(num>=0&&num<=1);}
   if(k==='fill'||k==='stroke')assert.ok(val==='none'||palette.has(val)||(tag(n)==='rect'&&k==='fill'&&val===`url(#${prefix}-grid)`),`Passive local paint ${val}`);
   if(k==='id'){assert.ok(['title','desc','grid','arrow'].some(s=>val===`${prefix}-${s}`));ids.push(val);}
   if(k==='font-family')assert.equal(val,'DejaVu Sans, Arial, sans-serif');
   if(k==='font-weight')assert.ok(['400','700'].includes(val));
   if(k==='font-size')assert.ok(number(val)>=12&&number(val)<=80);
   if(k==='text-anchor')assert.ok(['start','middle','end'].includes(val));
   if(k==='stroke-dasharray')assert.equal(val,'7 6');
   if(k==='marker-end')assert.equal(val,`url(#${prefix}-arrow)`);
   if(k==='d')pathPoints(val);
  }
  if(tag(n)==='marker'){
   assert.deepEqual(attrs(n),{id:`${prefix}-arrow`,markerWidth:'9',markerHeight:'9',refX:'8',refY:'4.5',orient:'auto'});
   assert.equal(children(n).length,1);assert.equal(tag(children(n)[0]),'path');assert.equal(attrs(children(n)[0]).d,'M0,0 L8,4.5 L0,9');
  }
  if(tag(n)==='pattern'){
   assert.deepEqual(attrs(n),{id:`${prefix}-grid`,width:'40',height:'40',patternUnits:'userSpaceOnUse'});
   assert.equal(children(n).length,1);assert.equal(tag(children(n)[0]),'path');assert.deepEqual(attrs(children(n)[0]),{d:'M 40 0 L 0 0 0 40',fill:'none',stroke:'#344556','stroke-width':'0.5',opacity:'0.22'});
  }
  if(tag(n)==='text')assert.ok(children(n).filter(c=>tag(c)!=='#text'||xmlText(c).trim()).every(c=>tag(c)==='tspan'));
  if(tag(n)==='tspan')assert.ok(children(n).length===1&&tag(children(n)[0])==='#text');
 }
 assert.equal(new Set(ids).size,4);assert.equal(ids.length,4);
 for(const type of ['title','desc','defs']){const found=nodes.filter(n=>tag(n)===type);assert.equal(found.length,1);if(type!=='defs')assert.ok(xmlText(found[0]).trim());}
 const [, , width,height]=attrs(root).viewBox.split(' ').map(number);return{root,nodes,width,height};
}
function faithful(v) {
 inspect(v);let original=v.svg;const correction=textCorrections[v.key];
 if(correction){
  assert.equal(digest(v.svg),correction.expectedHash);assert.equal(domHash(v.svg),correction.expectedDomHash);
  for(const[before,after,count]of [...correction.pairs].reverse()){assert.equal(original.split(after).length-1,count);original=original.replaceAll(after,before);}
 }
 assert.equal(digest(original),originals[v.key].rawHash,`${v.key}: complete original XML after exact approved inverse`);
 assert.equal(domHash(original),originals[v.key].domHash,`${v.key}: complete original browser tree`);
 const geometry=n=>tag(n)==='#text'?null:[tag(n),Object.entries(attrs(n)).sort(),children(n).filter(n=>tag(n)!=='#text').map(geometry)];
 assert.equal(digest(JSON.stringify(geometry(parser.parse(v.svg)[0]))),originals[v.key].geometryHash,`${v.key}: every supplied attribute, element and child order`);
}
const mutate = (v, change) => { const root = parser.parse(v.svg)[0]; change(root, xmlNodes(root)); return { ...v, svg: builder.build([root]) }; };
const within = (a,b,t=0) => a.x >= b.x-t && a.y >= b.y-t && a.right <= b.right+t && a.bottom <= b.bottom+t;
const overlaps = (a,b) => a.x < b.right && a.right > b.x && a.y < b.bottom && a.bottom > b.y;
const pointsBox = points => { assert.ok(points.length && points.flat().every(Number.isFinite)); return {x:Math.min(...points.map(p=>p[0])),y:Math.min(...points.map(p=>p[1])),right:Math.max(...points.map(p=>p[0])),bottom:Math.max(...points.map(p=>p[1]))}; };
function shapeBox(n) {
  if (tag(n) === 'rect') return { x: value(n, 'x'), y: value(n, 'y'), right: value(n, 'x') + value(n, 'width'), bottom: value(n, 'y') + value(n, 'height') };
  if (tag(n) === 'circle') return { x: value(n, 'cx') - value(n, 'r'), y: value(n, 'cy') - value(n, 'r'), right: value(n, 'cx') + value(n, 'r'), bottom: value(n, 'cy') + value(n, 'r') };
  if (tag(n) === 'line') return pointsBox([[value(n, 'x1'), value(n, 'y1')], [value(n, 'x2'), value(n, 'y2')]]);
  if (tag(n) === 'path') return pointsBox(pathPoints(attrs(n).d));
}
function scene(n) { return ['#text','defs'].includes(tag(n)) ? [] : [n,...children(n).flatMap(scene)]; }
function geometry(v) {
 const {root,width,height}=inspect(v),canvas={x:0,y:0,right:width,bottom:height};
 for(const n of scene(root)){
  if(['rect','circle','line','path'].includes(tag(n))){const b=shapeBox(n),s=attrs(n).stroke&&attrs(n).stroke!=='none'?value(n,'stroke-width','1')/2:0;assert.ok(within({x:b.x-s,y:b.y-s,right:b.right+s,bottom:b.bottom+s},canvas,.01),'shape outside viewBox');}
  if(tag(n)==='text'){let y=value(n,'y');for(const span of children(n)){y+=value(span,'dy');const x=value(span,'x');assert.ok(x>=0&&x<=width&&y>=0&&y<=height,'text anchor outside viewBox');}}
 }
}
test('MSCI Indonesia variant selection is frozen, complete and rejects coercion or prototypes', () => {
  assert.deepEqual(MSCI_INDONESIA_KINDS,kinds);assert.ok(Object.isFrozen(MSCI_INDONESIA_KINDS));assert.equal(variants.length,20);
  for(const lang of ['', 'FR','__proto__','constructor',{},null,['fr']])assert.throws(()=>msciIndonesiaSvg(lang,'ownership',false),TypeError);
  for(const kind of ['', '__proto__','constructor','prototype',{},null,['ownership']])assert.throws(()=>msciIndonesiaSvg('fr',kind,false),TypeError);
  for(const mobile of [0,1,'','false',null,new Boolean(false),{},[]])assert.throws(()=>msciIndonesiaSvg('fr','ownership',mobile),TypeError);
  assert.equal(msciIndonesiaSvg('fr','ownership'),msciIndonesiaSvg('fr','ownership',false));
});
test('all 20 complete supplied XML trees are recovered by the exact approved inverse mapping',()=>{for(const v of variants)faithful(v);});
test('native shape bounds and text anchors remain in the viewBoxes; browser QA measures actual platform glyphs',()=>{for(const v of variants)geometry(v);});
test('static shape and anchor checks reject off-canvas geometry',()=>{const v=variants[0];for(const change of [(_,ns)=>{attrs(ns.find(n=>tag(n)==='rect')).x='9999';},(_,ns)=>{attrs(ns.find(n=>tag(n)==='tspan')).x='-10';}])assert.throws(()=>geometry(mutate(v,change)));});
test('full XML goldens reject geometry, text, metadata, stylesheet and child-order changes', () => {
 const v=variants[0];for(const change of [(_,ns)=>{attrs(ns.find(n=>tag(n)==='tspan')).x='0';},(_,ns)=>{attrs(ns.find(n=>tag(n)==='rect')).fill='var(--panel)';},(_,ns)=>{ns.find(n=>tag(n)==='title').title=[{'#text':'Changed'}];},(_,ns)=>{attrs(ns.find(n=>tag(n)==='pattern')).width='41';},root=>{root.svg.reverse();}])assert.throws(()=>faithful(mutate(v,change)));
});
test('passive SVG validator rejects active markup, external resources and malformed fields',()=>{
 const v=variants[0];for(const type of ['script','foreignObject','image','use','a','animate','filter'])assert.throws(()=>inspect(mutate(v,root=>{root.svg.push({[type]:[]});})));
 for(const[field,val]of [['onload','alert(1)'],['href','https://example.org/'],['xlink:href','javascript:alert(1)'],['constructor','x'],['prototype','x'],['transform','translate(0 0)'],['style','fill:red'],['font-size','Infinity'],['x','1e999'],['x','10001']])assert.throws(()=>inspect(mutate(v,(_,ns)=>{attrs(ns.find(n=>tag(n)==='text'))[field]=val;})));
 for(const val of ['url(#x)','url(https://example.org/x)','var(--bg,red)','#fff','red'])assert.throws(()=>inspect(mutate(v,(_,ns)=>{attrs(ns.find(n=>tag(n)==='rect')).fill=val;})));
 for(const val of ['url(https://example.org/x)','url(#msci-fr-f1-d-arrow) trailing','url(#unknown)'])assert.throws(()=>inspect(mutate(v,(_,ns)=>{attrs(ns.find(n=>tag(n)==='path'))['marker-end']=val;})));
 for(const raw of ['<!DOCTYPE svg><svg/>','<?xml version="1.0"?><svg/>','<svg>&external;</svg>','<svg>&#65;</svg>','<svg><text></svg>',v.svg.replace('<text ','<text __proto__="x" ')])assert.throws(()=>inspect({...v,svg:raw}));
});
test('complete M/L/H/V/Z/C/Q/T parsing computes actual curve extrema and reflected controls', () => {
  assert.deepEqual(pathPoints('M0 0 H10 V20 L30 40 Z M5 6 L7 8'), [[0, 0], [10, 0], [10, 20], [30, 40], [0, 0], [5, 6], [7, 8]]);
  const q = pointsBox(pathPoints('M0 0 Q10 20 20 0'));
  assert.deepEqual(q, { x: 0, y: 0, right: 20, bottom: 10 });
  const cubic = pointsBox(pathPoints('M0 0 C0 20 20 20 20 0'));
  assert.deepEqual(cubic, { x: 0, y: 0, right: 20, bottom: 15 });
  const smooth = pointsBox(pathPoints('M0 0 Q10 20 20 0 T40 0'));
  assert.deepEqual(smooth, { x: 0, y: -10, right: 40, bottom: 10 });
  const reset = pointsBox(pathPoints('M0 0 Q10 20 20 0 L30 0 T40 0'));
  assert.deepEqual(reset, { x: 0, y: 0, right: 40, bottom: 10 });
  assert.deepEqual(pointsBox(pathPoints('M0 0 T20 10')), { x: 0, y: 0, right: 20, bottom: 10 });
  assert.ok(pathPoints('M79.53999999999999 351.02 L0 0').flat().every(Number.isFinite));
});
test('path validation rejects malformed, unconsumed and excessive work within a child deadline', () => {
  const bad = ['L0 0', 'M0', 'M0 0 trailing', 'M0 0 Z 1 1', 'MNaN 0', 'M1e999 0', 'M0,,0',
    'M0 0 C1 2 3 4 5', 'M0 0 Q1 2 3', 'M0 0 T1', 'M0 0 C1 2 3 4 5 6 trailing',
    'M0 0 H', 'M0 0 V', 'M0 0 A1 1 0 2 0 1 1', 'M0 0 q1 2 3 4', 'M0 0 S1 2 3 4',
    'M10001 0', 'M0 0 L99999 0', 'M' + '.'.repeat(8000) + ' 0', 'M' + '9'.repeat(8000) + ' 0',
    'M0.' + '9'.repeat(8000) + ' 0', 'M0 0 ' + 'L1 1 '.repeat(513), 'M0 0 ' + 'C1 1 1 1 1 1 '.repeat(300)];
  for (const raw of bad) assert.throws(() => pathPoints(raw));
  for (const raw of ['', null, {}, [], 0, new String('M0 0')]) assert.throws(() => pathPoints(raw));
  const code = `import assert from 'node:assert/strict'; const number=${number.toString()}; const curvePoints=${curvePoints.toString()}; const arcPoints=${arcPoints.toString()}; const paths=${pathPoints.toString()}; for(let i=0;i<100;i++) for(const raw of ${JSON.stringify(bad)}) assert.throws(()=>paths(raw));`;
  execFileSync(process.execPath, ['--input-type=module', '-e', code], { timeout: 5000, maxBuffer: 8192, stdio: 'pipe' });
});
test('responsive component maps all supplied paint literals to existing semantic themes without changing SVG attributes or fonts',()=>{
 const component=read('src/components/MsciIndonesiaFigure.astro'),style=component.match(/<style>([\s\S]*?)<\/style>/u)?.[1];assert.ok(style);
 const css=postcss.parse(style),declarations=n=>Object.fromEntries(n.nodes.filter(d=>d.type==='decl').map(d=>[d.prop,d.value]));
 const rule=selector=>{const n=css.nodes.find(n=>n.type==='rule'&&n.selector===selector);assert.ok(n,selector);return declarations(n);};
 const mapping={'#101923':'ink','#172431':'surface-2','#f3eee4':'paper','#b6c4cf':'muted','#344556':'line-strong','#79dfbc':'signal','#efc778':'amber','#8ab8f1':'topic-blue','#fb927f':'accent','#b4a4e8':'elevated','#71849b':'prose'};
 for(const[property,colours]of[['fill',Object.keys(mapping)],['stroke',['#344556','#b6c4cf','#79dfbc','#efc778','#8ab8f1','#fb927f','#b4a4e8']]])for(const colour of colours)assert.deepEqual(rule(`.msci-indonesia-figure :global([${property}="${colour}"])`),{[property]:`var(--color-${mapping[colour]})`});
 const base=rule('.msci-indonesia-figure');assert.deepEqual([base.width,base['max-width'],base['container-type'],base['padding-bottom'],base.overflow],['100%','760px','inline-size','.85rem','visible']);
 const graphic=rule('.msci-indonesia-figure :global(svg)');assert.deepEqual([graphic.width,graphic.height,graphic['max-width'],graphic['letter-spacing'],graphic.overflow],['100%','auto','100%','normal','visible']);
 const mobile=rule('.msci-indonesia-mobile');assert.deepEqual([mobile.display,mobile.width,mobile['max-width'],mobile['margin-inline']],['none','100%','420px','auto']);
 assert.equal(rule('.msci-indonesia-figure[data-kind="calendar"] .msci-indonesia-desktop')['max-width'],'580px');
 assert.equal(css.nodes.filter(n=>n.type==='atrule'&&n.name==='font-face').length,0);css.walkDecls('font-family',()=>assert.fail('Keep the supplied DejaVu Sans/Arial stack'));
 assert.doesNotMatch(component,/@font-face|\/fonts\/|Liberation/u);
 for(const kind of ['media','container']){const n=css.nodes.find(n=>n.type==='atrule'&&n.name===kind&&n.params==='(max-width: 640px)');assert.ok(n);assert.deepEqual(n.nodes.map(n=>[n.selector,declarations(n).display]),[['.msci-indonesia-desktop','none'],['.msci-indonesia-mobile','block']]);}
 const themes={dark:new Map(),light:new Map()};postcss.parse(read('src/styles/global.css')).walkDecls(d=>{if((d.parent.type==='atrule'&&d.parent.name==='theme')||(d.parent.type==='rule'&&d.parent.selector===':root'))themes.dark.set(d.prop,d.value);if(d.parent.type==='rule'&&d.parent.selector===':root[data-theme="light"]')themes.light.set(d.prop,d.value);});
 for(const theme of Object.values(themes))for(const v of Object.values(mapping))assert.ok(theme.has(`--color-${v}`));
 css.walkDecls(d=>assert.doesNotMatch(d.value,/#(?:[a-f0-9]{3}){1,2}\b|url\(/iu));
 assert.doesNotMatch(style,/(?:clip-path|overflow\s*:\s*(?:hidden|clip)|transform\s*:|100vw)/iu);
 assert.equal((component.match(/set:html=/gu)??[]).length,2);assert.match(component,/set:html=\{responsiveSvg\(false\)\}/u);assert.match(component,/set:html=\{responsiveSvg\(true\)\}/u);
 assert.ok(component.includes(`const responsiveSvg = (mobile: boolean) => msciIndonesiaSvg(lang, kind, mobile).replace(/^<svg /u, '<svg style="width:100%;height:auto" ');`));
 assert.doesNotMatch(component,/<script|client:|fetch\(|innerHTML/u);
});
const mdxNodes=n=>[n,...(n.children??[]).flatMap(mdxNodes)];
const figureSources={"ownership":[13],"contraction":[2],"selling":[14],"concentration":[2],"calendar":[8,2]};
function articleFigures(raw,lang){
 const tree=createProcessor().parse(raw.replace(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/u,'')),figures=mdxNodes(tree).filter(n=>n.name==='MsciIndonesiaFigure');assert.equal(figures.length,5);
 for(const[i,n]of figures.entries()){
  const a=Object.fromEntries(n.attributes.map(a=>{assert.equal(a.type,'mdxJsxAttribute');assert.equal(typeof a.value,'string');return[a.name,a.value];}));
  assert.deepEqual(Object.keys(a).sort(),['caption','kind','lang','number','sources']);assert.equal(a.kind,kinds[i]);assert.equal(a.number,String(i+1).padStart(2,'0'));assert.equal(a.lang,lang);assert.ok(a.caption.length>70);
  const refs=a.sources.trim()?a.sources.trim().split(/\s+/u).map(Number):[];assert.deepEqual(refs,figureSources[kinds[i]]);const details=mdxNodes(n).filter(c=>c.name==='details');assert.equal(details.length,1);assert.equal(mdxNodes(details[0]).filter(c=>c.name==='summary').length,1);
 }
}
test('article native MDX includes five ordered static figures, accurate references and method notes',()=>{
 for(const lang of ['fr','en'])articleFigures(read(`src/content/${lang==='fr'?'posts/msci-indonesie-flottant-risque-indices':'posts-en/msci-indonesia-free-float-index-risk'}.mdx`),lang);
});

test('comma-delimited coordinate pairs are consumed completely without accepting malformed comma runs',()=>{
 assert.deepEqual(pathPoints('M 1,2 L 3,4 L 5,-6'),[[1,2],[3,4],[5,-6]]);
 for(const d of ['M,1 2','M1,,2','M1, 2','M1 2,','M1 2 L,3 4','M1 2 , L3 4'])assert.throws(()=>pathPoints(d));
});
test('the static root adapter adds exactly the responsive style and preserves the complete passive SVG tree',()=>{
 const component=read('src/components/MsciIndonesiaFigure.astro');assert.ok(component.includes(`const responsiveSvg = (mobile: boolean) => msciIndonesiaSvg(lang, kind, mobile).replace(/^<svg /u, '<svg style="width:100%;height:auto" ');`));
 for(const v of variants){const adapted=v.svg.replace(/^<svg /u,'<svg style="width:100%;height:auto" '),roots=htmlNodes(parse(adapted)).filter(n=>n.tagName==='svg');assert.equal(roots.length,1);const root=roots[0];assert.equal(root.attrs.filter(a=>a.name==='style').length,1);assert.equal(root.attrs.find(a=>a.name==='style').value,'width:100%;height:auto');const projection={...root,attrs:root.attrs.filter(a=>a.name!=='style')};assert.equal(digest(JSON.stringify(canonical(projection))),textCorrections[v.key]?.expectedDomHash??originals[v.key].domHash);assert.equal(adapted.replace('<svg style="width:100%;height:auto" ','<svg '),v.svg);}
});

test('elliptical arcs include actual extrema for both sweeps, large arcs, rotated ellipses and corrected radii',()=>{
 const box=(d)=>pointsBox(pathPoints(d)),expect=(actual,wanted)=>Object.keys(wanted).forEach(k=>near(actual[k],wanted[k]));
 assert.deepEqual(pathPoints('M40 0 L0 0 0 40'),[[40,0],[0,0],[0,40]]);
 assert.deepEqual(pathPoints('M0 0 1 1 2 3'),[[0,0],[1,1],[2,3]]);
 expect(box('M10 0 A10 10 0 0 1 0 10'),{x:0,y:0,right:10,bottom:10});
 expect(box('M10 0 A10 10 0 1 1 0 10'),{x:0,y:0,right:20,bottom:20});
 expect(box('M-10 0 A10 5 0 0 1 10 0'),{x:-10,y:-5,right:10,bottom:0});
 expect(box('M-10 0 A10 5 0 0 0 10 0'),{x:-10,y:0,right:10,bottom:5});
 expect(box('M0 -10 A10 5 90 0 1 0 10'),{x:0,y:-10,right:5,bottom:10});
 expect(box('M-10 0 A1 1 0 0 1 10 0'),{x:-10,y:-10,right:10,bottom:0});
 expect(box('M-10 0 A-10 -5 0 0 1 10 0'),{x:-10,y:-5,right:10,bottom:0});
 expect(box('M1 2 A0 5 20 0 1 8 9'),{x:1,y:2,right:8,bottom:9});
 expect(box('M1 2 A5 5 20 1 1 1 2'),{x:1,y:2,right:1,bottom:2});
 const s=Math.sqrt(50),extent=Math.sqrt(62.5),first=arcPoints([-s,-s],[10,5],45,0,1,[s,s]),second=arcPoints([-s,-s],[10,5],45,0,0,[s,s]);
 expect(pointsBox([...first,...second]),{x:-extent,y:-extent,right:extent,bottom:extent});
 for(const d of ['M0 0 A1 1 0 2 0 1 1','M0 0 A1 1 0 0 -1 1 1','M0 0 A1 1 0 0 1 1','M0 0 A1 1 0 0 1 1 1 trailing','M0 0 a1 1 0 0 1 1 1','M0 0 '+'A1 1 0 0 1 1 1 '.repeat(300)])assert.throws(()=>pathPoints(d));
});
test('title surfaces reject forbidden empty What framing, clock metaphors and mechanical negative contrasts',()=>{
 for(const v of variants){const ns=inspect(v).nodes;const title=xmlText(ns.find(n=>tag(n)==='title'));assert.doesNotMatch(title,/—|\b(?:ce que|ce qui|what\b|two clocks|deux horloges|2 horloges)|, (?:pas|not) /iu);}
 for(const v of variants.filter(v=>v.kind==='ownership'&&v.mobile)){const labels=inspect(v).nodes.filter(n=>tag(n)==='text').map(xmlText);assert.ok(labels.some(t=>t.trim()===(v.lang==='fr'?'FLOTTANT ET CONTRÔLE':'FREE FLOAT AND CONTROL')));assert.ok(!labels.some(t=>/WHAT “FLOAT”/u.test(t)));}
});
const near = (actual, expected, tolerance = 1e-7) => assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} ≈ ${expected}`);
function quantitativeGeometry(v) {
 const { root, nodes } = inspect(v), visible = scene(root), rects = visible.filter(n => tag(n) === 'rect'), paths = visible.filter(n => tag(n) === 'path'), circles = visible.filter(n => tag(n) === 'circle');
 const labels = nodes.filter(n => tag(n) === 'text').map(n => xmlText(n).replace(/\s+/gu, ' ').trim());
 const contains = expected => assert.ok(labels.some(l => l.includes(expected)), `${v.key}: ${expected}`);
 if (v.kind === 'ownership') {
  const dots=circles.filter(n=>value(n,'r')===(v.mobile?12:10));assert.equal(dots.length, 100);
  for (const [colour, count] of [['#71849b',60],['#efc778',20],['#79dfbc',20]]) assert.equal(dots.filter(n => attrs(n).fill === colour).length, count);
  const marketCap = 1000000 * 10, apparent = marketCap * (1 - .60), independent = marketCap * .20;
  near(marketCap, 10000000);near(apparent,4000000);near(independent,2000000);
  contains(v.lang === 'fr' ? '4 M$' : '$4m');contains(v.lang === 'fr' ? '2 M$' : '$2m');
  if (!v.mobile) {
   near(value(rects.find(n=>attrs(n).fill==='#efc778'),'width'),510);
   near(value(rects.find(n=>attrs(n).fill==='#79dfbc'),'width'),255);
   near(value(rects.find(n=>attrs(n).fill==='#efc778'),'width')/value(rects.find(n=>attrs(n).fill==='#79dfbc'),'width'),apparent/independent);
  }
 }
 if (v.kind === 'contraction') {
  const capital = [119141.69,53355.81], scale = v.mobile ? 496 : 650;
  for(const[i,colour]of ['#8ab8f1','#fb927f'].entries()) {
   near(value(rects.find(n=>attrs(n).fill===colour),'width'),capital[i]/1000/120*scale);
   assert.equal(circles.filter(n=>attrs(n).fill===colour).length,[18,9][i]);
  }
  near((capital[1]/capital[0]-1)*100,-55.216507336768514);
  near(.43-1.16,-.73);contains(v.lang==='fr'?'119,14':'119.14');contains(v.lang==='fr'?'53,36':'53.36');contains(v.lang==='fr'?'−55,22':'−55.22');contains('31.12.2025');contains('30.09.2026');
 }
 if (v.kind === 'selling') {
  const fund=100000000000, initial=fund*.0043, after=initial*.8, remaining=fund+(after-initial);
  near(initial,430000000);near(after,344000000);near(remaining,99914000000);near(after/remaining*100,.3442960946413916);near(initial-after,86000000);
  for(const literal of v.lang==='fr'?['100 Md$','430 M$','344 M$','99,914','0,3443','0 vente']:['$100bn','$430m','$344m','99.914','0.3443','0 sales'])contains(literal);
  assert.equal(labels.filter(l=>l.startsWith(v.lang==='fr'?'344 M$':'$344m')).length,2);
  // The two post-shock scenarios are branches of one unchanged portfolio, not two additions.
  const decisions=rects.filter(n=>attrs(n).stroke==='#79dfbc'||attrs(n).stroke==='#fb927f');assert.equal(decisions.length,3);
  const outcomes=decisions.slice(1);assert.equal(attrs(outcomes[0]).stroke,'#79dfbc');assert.equal(attrs(outcomes[1]).stroke,'#fb927f');
  assert.equal(value(outcomes[0],'width'),value(outcomes[1],'width'));assert.equal(value(outcomes[0],'height'),value(outcomes[1],'height'));
 }
 if (v.kind === 'concentration') {
  const weights=[71.71,10.70,7.81,6.34,3.44],colours=['#79dfbc','#8ab8f1','#b4a4e8','#efc778','#fb927f'];near(weights.reduce((a,b)=>a+b,0),100);
  const arcs=paths.filter(n=>attrs(n).d.includes(' A '));assert.equal(arcs.length,5);
  const cx=v.mobile?280:241,cy=v.mobile?402:357,r=v.mobile?127:132,barScale=v.mobile?496:585;let cumulative=0;
  for(const[i,weight]of weights.entries()){
   const p=attrs(arcs[i]),m=p.d.match(/^M (-?\d+\.\d+) (-?\d+\.\d+) A (\d+) (\d+) 0 ([01]) 1 (-?\d+\.\d+) (-?\d+\.\d+)$/u);assert.ok(m);
   const from=-Math.PI/2+cumulative/100*2*Math.PI;cumulative+=weight;const to=-Math.PI/2+cumulative/100*2*Math.PI;
   near(Number(m[1]),cx+r*Math.cos(from),.00051);near(Number(m[2]),cy+r*Math.sin(from),.00051);near(Number(m[6]),cx+r*Math.cos(to),.00051);near(Number(m[7]),cy+r*Math.sin(to),.00051);
   assert.deepEqual([Number(m[3]),Number(m[4]),Number(m[5]),p.stroke,Number(p['stroke-width'])],[r,r,weight>50?1:0,colours[i],v.mobile?33:39]);
   near(value(rects.find(n=>attrs(n).fill===colours[i]),'width'),weight/100*barScale);
  }
  contains(v.lang==='fr'?'71,71':'71.71');contains(v.lang==='fr'?'30 septembre 2026':'September 30, 2026');
 }
 if (v.kind === 'calendar') {
  for(const literal of ['06.10.2026','15.10.2026','30.04.2027','30.06.2027','Secondary Emerging','Standalone'])contains(literal);
  contains(v.lang==='fr'?'Date inconnue':'Date unknown');
  const future=labels.find(l=>l.includes('30.04.2027'));assert.ok(future);
  const panels=rects.filter(n=>attrs(n).fill==='#172431');assert.equal(panels.length,v.mobile?5:8);
  // The published timeline explicitly uses schematic spacing; dates are labels, not proportional lengths.
  contains(v.lang==='fr'?'proportionnels au temps':'not proportional');
 }
}
test('independent source arithmetic agrees with dot counts, capitalisation bars, holdings branches, sector arcs and labelled dates',()=>{for(const v of variants)quantitativeGeometry(v);});
test('quantitative guards reject shape-only and numeric-label changes',()=>{
 for(const[kind,change]of[
  ['ownership',(_,ns)=>{ns.find(n=>tag(n)==='circle')[':@'].fill='#efc778';}],
  ['contraction',(_,ns)=>{attrs(ns.find(n=>tag(n)==='rect'&&attrs(n).fill==='#8ab8f1')).width='500';}],
  ['concentration',(_,ns)=>{attrs(ns.find(n=>tag(n)==='path'&&attrs(n).stroke==='#79dfbc')).d='M 241.000 225.000 A 132 132 0 0 1 111.810 384.093';}],
  ['selling',(_,ns)=>{const n=ns.find(n=>tag(n)==='tspan'&&xmlText(n)==='344 M$');n.tspan=[{'#text':'345 M$'}];}],
  ['calendar',(_,ns)=>{const n=ns.find(n=>tag(n)==='tspan'&&xmlText(n)==='30.04.2027');n.tspan=[{'#text':'30.05.2027'}];}],
 ])assert.throws(()=>quantitativeGeometry(mutate(variants.find(v=>v.lang==='fr'&&v.kind===kind&&!v.mobile),change)),kind);
});
