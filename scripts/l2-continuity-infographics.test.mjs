import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { XMLParser, XMLValidator } from 'fast-xml-parser';
import sharp from 'sharp';
import postcss from 'postcss';
import { l2ContinuitySvg, L2_FEES_USD, L2_DAILY_FEES_USD, L2_FEE_PERIOD } from '../src/lib/l2ContinuityFigures.mjs';

const parser = new XMLParser({ preserveOrder: true, ignoreAttributes: false, attributeNamePrefix: '', trimValues: false, parseTagValue: false, parseAttributeValue: false });
const tag = node => Object.keys(node).find(key => key !== ':@');
const attrs = node => node[':@'] || {};
const children = node => node[tag(node)] || [];
const elements = node => tag(node) === '#text' ? [] : [node, ...children(node).flatMap(elements)];
const content = node => tag(node) === '#text' ? node['#text'] : children(node).map(content).join('');
const numeric = (node, property, fallback = 0) => {
  const value = Number(attrs(node)[property] ?? fallback);
  assert.ok(Number.isFinite(value), property);
  return value;
};
const variants = ['fr','en'].flatMap(lang => ['money','fees','exit'].flatMap(kind => [false,true].map(mobile => ({ lang, kind, mobile, svg: l2ContinuitySvg(lang,kind,mobile) }))));
const native = {};
postcss.parse(readFileSync(new URL('../src/styles/global.css',import.meta.url),'utf8')).walkDecls(declaration => {
  if(declaration.parent.type==='atrule' && declaration.parent.name==='theme') native[declaration.prop]=declaration.value;
});
const paint = role => `var(--color-${role}, ${native[`--color-${role}`]})`;

function inspect(svg) {
  assert.equal(XMLValidator.validate(svg), true);
  assert.doesNotMatch(svg, /<!|<\?/u);
  const parsed = parser.parse(svg);
  assert.equal(parsed.length, 1);
  const root = parsed[0], all = elements(root), p = attrs(root);
  assert.equal(tag(root), 'svg');
  assert.equal(p.xmlns, 'http://www.w3.org/2000/svg');
  assert.equal(p.role, 'img');
  assert.equal(p.style, 'width:100%;height:auto');
  const names = p['aria-labelledby'].split(' ');
  assert.equal(names.length,2);
  for (const type of ['title','desc']) {
    const nodes = all.filter(node => tag(node) === type);
    assert.equal(nodes.length,1);
    assert.ok(names.includes(attrs(nodes[0]).id));
    assert.ok(content(nodes[0]).trim());
  }
  const tags = new Set('svg title desc g rect line circle path text'.split(' '));
  const paints = new Set(['none', ...['ink','surface','surface-2','paper','muted','line-strong','signal','amber','accent'].map(paint)]);
  for (const node of all) {
    assert.ok(tags.has(tag(node)), tag(node));
    for (const [key,value] of Object.entries(attrs(node))) {
      assert.ok(!key.toLowerCase().startsWith('on'));
      assert.ok(!['href','xlink:href','src'].includes(key));
      assert.ok(!String(value).includes('url('));
      if (key === 'fill' || key === 'stroke') assert.ok(paints.has(value), value);
      if (key === 'style') { assert.equal(node,root); assert.equal(value,p.style); }
    }
  }
  return { root, all };
}

const glyphs = new Map();
async function textWidth(node) {
  const p = attrs(node), value = content(node), key = `${p['font-size']}/${p['font-weight']}/${value}`;
  if (!glyphs.has(key)) {
    const escaped = value.replaceAll('&','&amp;').replaceAll('<','&lt;');
    const source = `<svg xmlns="http://www.w3.org/2000/svg" width="8192" height="160"><text x="8" y="100" fill="white" font-family="Arial, Helvetica, sans-serif" font-size="${p['font-size']}" font-weight="${p['font-weight']}">${escaped}</text></svg>`;
    const { info } = await sharp(Buffer.from(source)).trim().raw().toBuffer({ resolveWithObject:true });
    glyphs.set(key,info.width+3);
  }
  return glyphs.get(key);
}

async function geometry(svg) {
  const { root,all }=inspect(svg), [left,top,width,height]=attrs(root).viewBox.split(' ').map(Number);
  assert.equal(left,0); assert.equal(top,0);
  assert.ok(width===400 || width===1000);
  const inside = (x,y) => assert.ok(x>=0 && x<=width && y>=0 && y<=height, `${x},${y} outside ${width},${height}`);
  for (const node of all) {
    if (tag(node)==='rect') {
      assert.ok(numeric(node,'width')>=0 && numeric(node,'height')>=0);
      inside(numeric(node,'x'),numeric(node,'y'));
      inside(numeric(node,'x')+numeric(node,'width'),numeric(node,'y')+numeric(node,'height'));
    }
    if (tag(node)==='line') { inside(numeric(node,'x1'),numeric(node,'y1')); inside(numeric(node,'x2'),numeric(node,'y2')); }
    if (tag(node)==='circle') {
      const r=numeric(node,'r')+numeric(node,'stroke-width')/2;
      inside(numeric(node,'cx')-r,numeric(node,'cy')-r);
      inside(numeric(node,'cx')+r,numeric(node,'cy')+r);
    }
    if (tag(node)==='path') {
      assert.match(attrs(node).d,/^[MLC\d.e+\-, ]+$/u);
      const coords=attrs(node).d.match(/-?\d+(?:\.\d+)?(?:e[+-]?\d+)?/gu).map(Number);
      assert.equal(coords.length%2,0);
      // Every Bezier control point is within the canvas, so its curve is too.
      for(let i=0;i<coords.length;i+=2) inside(coords[i],coords[i+1]);
    }
  }
  const boxes=[];
  for (const node of all.filter(item=>tag(item)==='text')) {
    const p=attrs(node),size=numeric(node,'font-size'),w=await textWidth(node),label=content(node);
    assert.equal(p['font-family'],'Arial, Helvetica, sans-serif');
    assert.ok(size>=13);
    const x=numeric(node,'x')-(p['text-anchor']==='middle'?w/2:p['text-anchor']==='end'?w:0);
    const y=numeric(node,'y'),box={ x,y:y-size*.95,right:x+w,bottom:y+4,label };
    assert.ok(x>=4 && x+w<=width-4 && box.y>=4 && box.bottom<=height-4,`ViewBox: ${label}`);
    const parent=all.find(group=>tag(group)==='g' && children(group).includes(node));
    assert.ok(parent && attrs(parent)['data-region'],`Missing internal region: ${label}`);
    const [rx,ry,rw,rh]=attrs(parent)['data-bounds'].split(' ').map(Number);
    assert.ok(x>=rx+7 && x+w<=rx+rw-7 && box.y>=ry+4 && box.bottom<=ry+rh-4,`${attrs(parent)['data-region']}: ${label}; ${x},${box.y},${x+w},${box.bottom} in ${rx},${ry},${rw},${rh}`);
    for (const prior of boxes) assert.ok(!(box.x<prior.right+4 && box.right+4>prior.x && box.y<prior.bottom && box.bottom>prior.y),`Label collision: ${prior.label} / ${label}`);
    boxes.push(box);
  }
  // A diagram can fit the canvas while its connecting rail crosses a label.
  // Test real glyph bounds against all horizontal and vertical line segments.
  for(const node of all.filter(item=>tag(item)==='line')) {
    const x1=numeric(node,'x1'),x2=numeric(node,'x2'),y1=numeric(node,'y1'),y2=numeric(node,'y2');
    for(const box of boxes) {
      if(y1===y2) assert.ok(!(y1>box.y-2 && y1<box.bottom+2 && Math.min(x1,x2)<box.right+2 && Math.max(x1,x2)>box.x-2),`Horizontal rail crosses: ${box.label}`);
      if(x1===x2) assert.ok(!(x1>box.x-2 && x1<box.right+2 && Math.min(y1,y2)<box.bottom+2 && Math.max(y1,y2)>box.y-2),`Vertical rail crosses: ${box.label}`);
      if(x1!==x2 && y1!==y2) {
        let enter=0,leave=1;
        const dx=x2-x1,dy=y2-y1;
        for(const [p,q]of [[-dx,x1-box.x+2],[dx,box.right+2-x1],[-dy,y1-box.y+2],[dy,box.bottom+2-y1]]) {
          const t=q/p;
          if(p<0)enter=Math.max(enter,t); else leave=Math.min(leave,t);
        }
        assert.ok(enter>leave || leave<0 || enter>1,`Diagonal rail crosses: ${box.label}`);
      }
    }
  }
  // Circle badges must remain clear of labels, including small-screen glyphs.
  for(const node of all.filter(item=>tag(item)==='circle')) {
    const x=numeric(node,'cx'),y=numeric(node,'cy'),r=numeric(node,'r')+numeric(node,'stroke-width')/2;
    for(const box of boxes) {
      const px=Math.max(box.x,Math.min(x,box.right)),py=Math.max(box.y,Math.min(y,box.bottom));
      assert.ok(Math.hypot(px-x,py-y)>r,`Badge obscures label: ${box.label}`);
    }
  }
  return { root,all };
}

test('12 bilingual responsive figures are inert, accessible, themed and internally legible', async () => {
  const ids=new Set();
  for(const variant of variants) {
    const { all }=await geometry(variant.svg);
    for(const node of all) if(attrs(node).id) {
      assert.ok(!ids.has(attrs(node).id)); ids.add(attrs(node).id);
    }
  }
});

test('monthly totals preserve cents, thirty complete UTC days and a common zero', () => {
  assert.deepEqual(L2_FEE_PERIOD,{from:'2026-09-01',through:'2026-09-30',timezone:'UTC',days:30});
  assert.deepEqual(L2_FEES_USD,{blast:2067.07,abstract:121283});
  for(const values of Object.values(L2_DAILY_FEES_USD)) {
    assert.equal(values.length,30);
    assert.ok(values.every(value=>Number.isFinite(value) && value>=0));
  }
  for(const variant of variants.filter(item=>item.kind==='fees')) {
    const {all}=inspect(variant.svg);
    const bar=name=>children(all.find(node=>attrs(node)['data-total-bar']===name)).find(node=>tag(node)==='rect');
    const blast=bar('blast'),abstract=bar('abstract');
    assert.equal(numeric(blast,'x'),32);
    assert.equal(numeric(blast,'x'),numeric(abstract,'x'));
    assert.equal(numeric(abstract,'width'),variant.mobile?336:936);
    assert.ok(Math.abs(numeric(blast,'width')/numeric(abstract,'width')-2067.07/121283)<1e-12);
    const daily=all.filter(node=>attrs(node)['data-daily-bar']);
    assert.equal(daily.length,60);
    const scale=99/6053;
    for(const node of daily) {
      const name=attrs(node)['data-daily-bar'],day=Number(attrs(node)['data-day']),shape=children(node).find(child=>tag(child)==='rect');
      assert.ok(Math.abs(numeric(shape,'height')-L2_DAILY_FEES_USD[name][day-1]*scale)<1e-12);
      assert.ok(Math.abs(numeric(shape,'y')+numeric(shape,'height')-(variant.mobile?674:564))<1e-12);
    }
    const copy=content(all[0]);
    assert.ok(copy.includes('DefiLlama'));
    assert.ok(copy.includes('USD'));
    assert.ok(copy.includes('UTC'));
    assert.ok(copy.includes(variant.lang==='fr'?'La couverture dépend de l’adaptateur':'Coverage depends on the adapter'));
    assert.ok(copy.includes(variant.lang==='fr'?'Aucun coût ni revenu net retranché':'No costs or net revenue deducted'));
    assert.doesNotMatch(copy,/58[,\.](?:67|68)|profitability|rentabilité/u);
  }
});

test('mechanisms distinguish money routes and preserve closure-specific limits', () => {
  for(const variant of variants) {
    const copy=content(inspect(variant.svg).root);
    assert.doesNotMatch(copy,/—|always recoverable|toujours récupérable|24:00|23:59|countdown/u);
    if(variant.kind==='money') {
      assert.ok(copy.includes(variant.lang==='fr'?'Paiement de l’achat':'Purchase payment'));
      assert.ok(copy.includes(variant.lang==='fr'?'Frais de la transaction':'Transaction fee'));
      assert.ok(copy.includes(variant.lang==='fr'?'Redistributions éventuelles':'Possible distributions'));
      assert.ok(copy.includes(variant.lang==='fr'?'Relations qualitatives':'Qualitative routes'));
      assert.ok(copy.includes(variant.lang==='fr'?'selon le protocole':'protocol'));
    }
    if(variant.kind==='exit') {
      assert.ok(copy.includes(variant.lang==='fr'?'26 octobre 2026':'26 October 2026'));
      assert.ok(copy.includes(variant.lang==='fr'?'15 décembre 2026':'15 December 2026'));
      assert.ok(copy.includes(variant.lang==='fr'?'Aucune récupération promise':'No recovery promised'));
      assert.match(copy,variant.lang==='fr'?/opérations et des acteurs(?: encore)? disponibles/u:/available operations and actors/u);
      assert.ok(copy.includes(variant.lang==='fr'?'preuve ou délai':'proof or delay'));
      assert.ok(copy.includes(variant.lang==='fr'?'dernier bloc':'final-block'));
    }
  }
});

test('geometry detects stretched labels, internal boundary violations and rail collisions', async () => {
  const svg=l2ContinuitySvg('fr','fees',true);
  await assert.rejects(geometry(svg.replace('>Blast<',`>${'W'.repeat(80)}<`)));
  assert.ok(svg.includes('x="32" y="231"'));
  await assert.rejects(geometry(svg.replace('x="32" y="231"','x="210" y="231"')));
  await assert.rejects(geometry(svg.replace('width="336" height="32"','width="1100" height="32"')));
  const exit=l2ContinuitySvg('en','exit',true);
  await assert.rejects(geometry(exit.replace('x1="386" y1="251" x2="386" y2="475"','x1="310" y1="251" x2="310" y2="475"')));
  const money=l2ContinuitySvg('fr','money',false);
  assert.ok(money.includes('x1="151" y1="333" x2="215" y2="399"'));
  await assert.rejects(geometry(money.replace('x1="151" y1="333" x2="215" y2="399"','x1="151" y1="333" x2="400" y2="373"')));
  assert.ok(money.includes('cx="530" cy="399" r="53"'));
  await assert.rejects(geometry(money.replace('cx="530" cy="399" r="53"','cx="350" cy="350" r="53"')));
});

test('SVG contract rejects active markup, external resources and unsupported inputs', () => {
  const svg=l2ContinuitySvg('fr','fees',true);
  for(const payload of ['<script/>','<foreignObject/>','<image href="https://example.com/x"/>']) assert.throws(()=>inspect(svg.replace('</svg>',`${payload}</svg>`)));
  assert.throws(()=>inspect(svg.replace('<svg ','<svg onload="void(0)" ')));
  assert.throws(()=>inspect(svg.replace(`fill="${paint('ink')}"`,'fill="url(https://example.com/x)"')));
  assert.throws(()=>inspect(svg.replace(`fill="${paint('ink')}"`,'fill="#123456"')));
  assert.throws(()=>l2ContinuitySvg('de','fees',true));
  assert.throws(()=>l2ContinuitySvg('fr','invented',true));
  assert.throws(()=>l2ContinuitySvg('fr','fees','false'));
});

test('component controls raw SVG and switches complete mobile compositions', () => {
  const component=readFileSync(new URL('../src/components/L2ContinuityFigure.astro',import.meta.url),'utf8');
  assert.ok(component.includes('set:html={l2ContinuitySvg(lang, kind, false)}'));
  assert.ok(component.includes('set:html={l2ContinuitySvg(lang, kind, true)}'));
  assert.ok(!component.includes('set:html={caption}'));
  assert.ok(component.includes('<slot />'));
  assert.ok(component.includes('@media (max-width: 640px)'));
  assert.ok(component.includes('padding-bottom: .85rem'));
  assert.doesNotMatch(component,/<script|overflow:\s*hidden/u);
});
