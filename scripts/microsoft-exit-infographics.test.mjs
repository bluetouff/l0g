import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { XMLParser, XMLValidator } from 'fast-xml-parser';
import sharp from 'sharp';
import postcss from 'postcss';
import { microsoftExitSvg, OFFICE_EXCEPTION_SERIES, OFFICE_EXCEPTION_SCOPE } from '../src/lib/microsoftExitFigures.mjs';

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
const variants = ['fr','en'].flatMap(lang => ['dependencies','exceptions','identity'].flatMap(kind => [false,true].map(mobile => ({ lang, kind, mobile, svg: microsoftExitSvg(lang,kind,mobile) }))));
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
async function textBounds(node) {
  const p=attrs(node),value=content(node),anchor=p['text-anchor'],key=`${p['font-size']}/${p['font-weight']}/${anchor}/${value}`;
  if(!glyphs.has(key)) {
    const escaped=value.replaceAll('&','&amp;').replaceAll('<','&lt;');
    // The same renderer and anchor as the delivered SVG, with enough room on
    // either side to measure both glyph bearings and the actual ascenders.
    const source=`<svg xmlns="http://www.w3.org/2000/svg" width="8192" height="256"><text x="4096" y="160" fill="white" text-anchor="${anchor}" font-family="Arial, Helvetica, sans-serif" font-size="${p['font-size']}" font-weight="${p['font-weight']}">${escaped}</text></svg>`;
    const {info}=await sharp(Buffer.from(source)).trim().raw().toBuffer({resolveWithObject:true});
    const left=-info.trimOffsetLeft-4096-1,top=-info.trimOffsetTop-160-1;
    assert.ok(Number.isFinite(left) && Number.isFinite(top));
    glyphs.set(key,{left,top,right:left+info.width+2,bottom:top+info.height+2});
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
    const p=attrs(node),size=numeric(node,'font-size'),glyph=await textBounds(node),label=content(node);
    assert.equal(p['font-family'],'Arial, Helvetica, sans-serif');
    assert.ok(size>=13);
    const originX=numeric(node,'x'),originY=numeric(node,'y');
    const x=originX+glyph.left,w=glyph.right-glyph.left,box={x,y:originY+glyph.top,right:originX+glyph.right,bottom:originY+glyph.bottom,label};
    assert.ok(x>=4 && x+w<=width-4 && box.y>=4 && box.bottom<=height-4,`ViewBox: ${label}`);
    const parent=all.find(group=>tag(group)==='g' && children(group).includes(node));
    assert.ok(parent && attrs(parent)['data-region'],`Missing internal region: ${label}`);
    const [rx,ry,rw,rh]=attrs(parent)['data-bounds'].split(' ').map(Number);
    assert.ok(x>=rx+7 && x+w<=rx+rw-7 && box.y>=ry+4 && box.bottom<=ry+rh-4,`${attrs(parent)['data-region']}: ${label}; ${x},${box.y},${x+w},${box.bottom} in ${rx},${ry},${rw},${rh}`);
    for (const prior of boxes) assert.ok(!(box.x<prior.right+4 && box.right+4>prior.x && box.y<prior.bottom && box.bottom>prior.y),`Label collision: ${prior.label} / ${label}`);
    boxes.push(box);
  }
  // Include all straight path segments, not only SVG <line> elements: chart
  // polylines and arrowheads can cross a label even when every glyph fits.
  const segments=all.filter(item=>tag(item)==='line').map(node=>[numeric(node,'x1'),numeric(node,'y1'),numeric(node,'x2'),numeric(node,'y2')]);
  for(const node of all.filter(item=>tag(item)==='path')) {
    let cursor;
    for(const match of attrs(node).d.matchAll(/([MLC])([^MLC]*)/gu)) {
      const values=match[2].match(/-?\d+(?:\.\d+)?(?:e[+-]?\d+)?/gu).map(Number);
      if(match[1]==='L') for(let i=0;i<values.length;i+=2) { segments.push([...cursor,values[i],values[i+1]]);cursor=[values[i],values[i+1]]; }
      else cursor=values.slice(-2);
    }
  }
  for(const [x1,y1,x2,y2]of segments) {
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

test('12 authored responsive figures have accessible text, semantic paint and real glyph containment', async () => {
  const ids=new Set();
  for (const variant of variants) {
    const { all }=await geometry(variant.svg);
    for(const node of all) if(attrs(node).id) { assert.ok(!ids.has(attrs(node).id)); ids.add(attrs(node).id); }
  }
});

test('Office graph preserves a common zero and separates the reported position from future targets', () => {
  assert.deepEqual(OFFICE_EXCEPTION_SCOPE,{announcedOn:'2026-01-05',excludes:'tax-administration',unit:'workstations-requiring-office',maximum:6000});
  assert.deepEqual(OFFICE_EXCEPTION_SERIES.map(point=>[point.date,point.value,point.status]),[
    ['2025-10',5042,'reported'],['2026-12',4107,'target'],['2027-12',3320,'target'],['2028-12',2944,'target'],['2029-12',101,'target'],
  ]);
  for(const variant of variants.filter(item=>item.kind==='exceptions')) {
    const {all,root}=inspect(variant.svg),series=all.find(node=>attrs(node)['data-series']==='office-exceptions');
    const segment=children(series).find(node=>tag(node)==='path');
    assert.equal(attrs(segment)['stroke-dasharray'],'7 7');
    const scale=numeric(series,'data-scale'),zero=numeric(series,'data-zero');
    assert.equal(zero,variant.mobile?626:633);
    const observations=all.filter(node=>attrs(node)['data-observation']);
    assert.equal(observations.length,5);
    for(const [index,node]of observations.entries()) {
      const expected=OFFICE_EXCEPTION_SERIES[index],point=children(node).find(node=>tag(node)==='circle');
      assert.equal(attrs(node)['data-status'],expected.status);
      assert.equal(attrs(node)['data-observation'],expected.date);
      assert.equal(numeric(node,'data-value'),expected.value);
      const left=variant.mobile?76:120,right=variant.mobile?352:920;
      assert.ok(Math.abs(numeric(point,'cx')-(left+(right-left)*[0,14,26,38,50][index]/50))<1e-10);
      assert.ok(Math.abs((zero-numeric(point,'cy'))/scale-expected.value)<1e-9);
      assert.equal(attrs(point).fill,paint(index===0?'signal':'ink'));
    }
    assert.ok(content(root).includes(variant.lang==='fr'?'administration fiscale exclue':'tax administration excluded'));
    assert.ok(content(root).includes(variant.lang==='fr'?'Aucun bilan de réalisation 2026':'No 2026 delivery assessment'));
  }
});

test('fictitious mappings demonstrate an address-only sort and preserve the separate incident scope', () => {
  for(const variant of variants.filter(item=>item.kind==='identity')) {
    const {all,root}=inspect(variant.svg);
    const pairs=type=>all.filter(node=>attrs(node)['data-pair']===type).map(node=>[attrs(node)['data-address'],attrs(node)['data-identity']]);
    assert.deepEqual(pairs('original'),[['C','03'],['A','01'],['B','02']]);
    assert.deepEqual(pairs('broken'),[['A','03'],['B','01'],['C','02']]);
    assert.deepEqual(pairs('verified'),[['A','01'],['B','02'],['C','03']]);
    // Sorting one column preserves identifier order but breaks every pairing.
    const expected=new Map(pairs('original'));
    assert.ok(pairs('broken').every(([address,id])=>expected.get(address)!==id));
    assert.ok(pairs('verified').every(([address,id])=>expected.get(address)===id));
    const copy=content(root);
    assert.ok(copy.includes('790'));
    assert.ok(copy.includes('20/3628'));
    assert.ok(copy.includes(variant.lang==='fr'?'données fictives':'fictional data'));
    assert.ok(copy.includes(variant.lang==='fr'?'second opérateur':'second operator'));
    assert.doesNotMatch(copy,/@|3 comptes affectés|3 accounts affected|—/u);
  }
});

test('dependency model states its Microsoft-to-Microsoft scope and distinct operations', () => {
  for(const variant of variants.filter(item=>item.kind==='dependencies')) {
    const {root}=inspect(variant.svg),copy=content(root);
    assert.ok(copy.includes('SharePoint → SharePoint'));
    for(const token of variant.lang==='fr'?['Migrer','Rapprocher','droits','recréer les flux','ne mesure pas une sortie']:['Migrate','Map','identities','recreate flows','does not measure a move']) assert.ok(copy.includes(token),token);
    assert.doesNotMatch(copy,/inevitable|inévitable|impossible|—/u);
  }
});

test('geometry rejects overlong labels, internal panel escapes, rail collisions and off-canvas shapes', async () => {
  const svg=microsoftExitSvg('en','identity',true);
  await assert.rejects(geometry(svg.replace('>Mailbox C<',`>${'W'.repeat(80)}<`)));
  await assert.rejects(geometry(svg.replace('data-bounds="44 312 132 43"','data-bounds="150 312 132 43"')));
  await assert.rejects(geometry(svg.replace('</svg>','<line x1="40" y1="338" x2="345" y2="338" stroke="none"/></svg>')));
  await assert.rejects(geometry(svg.replace('</svg>','<path d="M40 338 L345 338" stroke="none"/></svg>')));
  await assert.rejects(geometry(svg.replace('width="336" height="220"','width="800" height="220"')));
});

test('SVG contract rejects executable markup, resources, non-theme paint and unsupported inputs', () => {
  const svg=microsoftExitSvg('fr','identity',true);
  for(const payload of ['<script/>','<foreignObject/>','<image href="https://example.com/x"/>']) assert.throws(()=>inspect(svg.replace('</svg>',`${payload}</svg>`)));
  assert.throws(()=>inspect(svg.replace('<svg ','<svg onload="void(0)" ')));
  assert.throws(()=>inspect(svg.replace(`fill="${paint('ink')}"`,'fill="url(https://example.com/x)"')));
  assert.throws(()=>inspect(svg.replace(`fill="${paint('ink')}"`,'fill="#123456"')));
  assert.throws(()=>microsoftExitSvg('de','identity',true));
  assert.throws(()=>microsoftExitSvg('fr','invented',true));
  assert.throws(()=>microsoftExitSvg('fr','identity','false'));
});

test('Astro only inserts controlled SVG and swaps complete compositions at narrow widths', () => {
  const component=readFileSync(new URL('../src/components/MicrosoftExitFigure.astro',import.meta.url),'utf8');
  assert.ok(component.includes('set:html={microsoftExitSvg(lang, kind, false)}'));
  assert.ok(component.includes('set:html={microsoftExitSvg(lang, kind, true)}'));
  assert.ok(!component.includes('set:html={caption}'));
  assert.ok(component.includes('<slot />'));
  assert.ok(component.includes('@media (max-width: 640px)'));
  assert.ok(component.includes('padding-bottom: .85rem'));
  assert.doesNotMatch(component,/<script|overflow:\s*hidden/u);
});
