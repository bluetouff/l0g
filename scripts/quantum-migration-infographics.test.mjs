import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { XMLParser, XMLValidator } from 'fast-xml-parser';
import sharp from 'sharp';
import postcss from 'postcss';
import { quantumMigrationSvg, QUANTUM_SIGNATURE_BYTES } from '../src/lib/quantumMigrationFigures.mjs';

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
const variants = ['fr','en'].flatMap(lang => ['threat','size','migration'].flatMap(kind => [false,true].map(mobile => ({ lang, kind, mobile, svg: quantumMigrationSvg(lang,kind,mobile) }))));
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

test('signature scale uses exact documented primitive sizes and a common zero', () => {
  assert.deepEqual(QUANTUM_SIGNATURE_BYTES,{schnorr:64,mlDsa44:2420});
  for (const variant of variants.filter(item=>item.kind==='size')) {
    const {all}=inspect(variant.svg);
    const bar = name => children(all.find(node=>attrs(node)['data-bar']===name)).find(node=>tag(node)==='rect');
    const old=bar('schnorr'),pq=bar('ml-dsa-44');
    assert.equal(numeric(old,'x'),numeric(pq,'x'));
    assert.ok(Math.abs(numeric(old,'width')/numeric(pq,'width')-64/2420)<1e-12);
    assert.equal(numeric(pq,'width'),variant.mobile?336:936);
    assert.ok(content(all[0]).includes(variant.lang==='fr'?'37,8125':'37.8125'));
    assert.ok(content(all[0]).includes(variant.lang==='fr'?'+2 356':'+2,356'));
    assert.ok(content(all[0]).includes(variant.lang==='fr'?'référence de taille':'size reference'));
  }
  assert.equal(2420/64,37.8125);
  assert.equal(2420-64,2356);
});

test('migration and threat preserve conditional capability and future-rule caveats', () => {
  for(const variant of variants) {
    const copy=content(inspect(variant.svg).root);
    if(variant.kind==='threat') assert.ok(copy.includes(variant.lang==='fr'?'si la machine suffit':'if hardware is capable'));
    if(variant.kind==='migration') {
      assert.ok(copy.includes(variant.lang==='fr'?'Adoption et modalités à définir':'Adoption and terms remain to be set'));
      assert.ok(copy.includes(variant.lang==='fr'?'Dormance':'dormant'));
    }
    assert.doesNotMatch(copy,/2030|2035|62.?500|1.?652|TPS|—/u);
  }
});

test('geometry detects internal boundary crossings, stretched labels and collisions', async () => {
  const svg=quantumMigrationSvg('fr','threat',true);
  await assert.rejects(geometry(svg.replace('>Clé publique<',`>${'W'.repeat(80)}<`)));
  await assert.rejects(geometry(svg.replace('x="92" y="322"','x="150" y="322"')));
  await assert.rejects(geometry(svg.replace('y="354"','y="332"')));
  await assert.rejects(geometry(svg.replace('x1="390" y1="240" x2="390" y2="477"','x1="312" y1="240" x2="312" y2="477"')));
  const migration=quantumMigrationSvg('en','migration',true);
  await assert.rejects(geometry(migration.replace('x1="124" y1="497" x2="350" y2="497"','x1="124" y1="489" x2="350" y2="489"')));
  const size=quantumMigrationSvg('en','size',false);
  await assert.rejects(geometry(size.replace('width="936" height="34"','width="1100" height="34"')));
});

test('SVG contract rejects active markup, external resources, unsupported inputs and arbitrary palettes', () => {
  const svg=quantumMigrationSvg('fr','size',true);
  for(const payload of ['<script/>','<foreignObject/>','<image href="https://example.com/x"/>']) assert.throws(()=>inspect(svg.replace('</svg>',`${payload}</svg>`)));
  assert.throws(()=>inspect(svg.replace('<svg ','<svg onload="void(0)" ')));
  assert.throws(()=>inspect(svg.replace(`fill="${paint('ink')}"`,'fill="url(https://example.com/x)"')));
  assert.throws(()=>inspect(svg.replace(`fill="${paint('ink')}"`,'fill="#123456"')));
  assert.throws(()=>quantumMigrationSvg('de','size',true));
  assert.throws(()=>quantumMigrationSvg('fr','invented',true));
  assert.throws(()=>quantumMigrationSvg('fr','size','false'));
});

test('component controls raw SVG, escapes article prose and switches complete mobile compositions', () => {
  const component=readFileSync(new URL('../src/components/QuantumMigrationFigure.astro',import.meta.url),'utf8');
  assert.ok(component.includes('set:html={quantumMigrationSvg(lang, kind, false)}'));
  assert.ok(component.includes('set:html={quantumMigrationSvg(lang, kind, true)}'));
  assert.ok(!component.includes('set:html={caption}'));
  assert.ok(component.includes('<slot />'));
  assert.ok(component.includes('@media (max-width: 640px)'));
  assert.ok(component.includes('padding-bottom: .85rem'));
  assert.doesNotMatch(component,/<script|overflow:\s*hidden/u);
});
