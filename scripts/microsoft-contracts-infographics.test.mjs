import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { XMLParser, XMLValidator } from 'fast-xml-parser';
import sharp from 'sharp';
import postcss from 'postcss';
import { microsoftContractsSvg, CROYDON_AWARD, CROYDON_CRITERIA } from '../src/lib/microsoftContractsFigures.mjs';

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
const variants = ['fr','en'].flatMap(lang => ['procurement','activation'].flatMap(kind => [false,true].map(mobile => ({ lang, kind, mobile, svg: microsoftContractsSvg(lang,kind,mobile) }))));
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

test('eight compositions use semantic paint, accessible descriptions and actual glyph containment', async () => {
  const ids=new Set(),errors=[];
  for(const variant of variants) {
    try {
      const {all}=await geometry(variant.svg);
      for(const node of all) if(attrs(node).id) { assert.ok(!ids.has(attrs(node).id)); ids.add(attrs(node).id); }
    } catch(error) { errors.push(`${variant.lang}/${variant.kind}/${variant.mobile?'mobile':'desktop'}: ${error.message}`); }
  }
  assert.deepEqual(errors,[]);
});

test('Croydon weights total 100 and their bar lengths encode criteria rather than bid scores', () => {
  assert.deepEqual(CROYDON_AWARD,{tenders:4,winner:'Bytes Software Services Limited',start:'2025-07-01',end:'2028-06-30',notice:'2025-07-11'});
  assert.deepEqual(CROYDON_CRITERIA,[{key:'price',weight:70},{key:'technical',weight:20},{key:'social',weight:10}]);
  assert.equal(CROYDON_CRITERIA.reduce((sum,item)=>sum+item.weight,0),100);
  for(const variant of variants.filter(item=>item.kind==='procurement')) {
    const {all,root}=inspect(variant.svg);
    const offers=all.filter(node=>attrs(node)['data-offer']);
    assert.equal(offers.length,4);
    assert.ok(offers.every(node=>attrs(node)['data-offer']==='anonymous'));
    const scope=all.find(node=>attrs(node)['data-scope']);
    assert.ok(offers.every(node=>elements(scope).includes(node)));
    const criteria=all.filter(node=>attrs(node)['data-criterion']);
    assert.equal(criteria.length,3);
    let right;
    for(const [i,node] of criteria.entries()) {
      const bar=children(node).find(item=>tag(item)==='rect');
      assert.equal(attrs(node)['data-criterion'],CROYDON_CRITERIA[i].key);
      assert.equal(numeric(node,'data-weight'),CROYDON_CRITERIA[i].weight);
      assert.equal(numeric(bar,'width')/numeric(node,'data-bar-width')*100,CROYDON_CRITERIA[i].weight);
      if(right!==undefined)assert.equal(numeric(bar,'x'),right);
      right=numeric(bar,'x')+numeric(bar,'width');
    }
    const copy=content(root);
    assert.ok(copy.includes('039343-2025'));
    assert.ok(copy.includes('Bytes Software Services Limited'));
    assert.ok(copy.includes(variant.lang==='fr'?'pas des notes obtenues':'not bidders’ scores'));
    assert.doesNotMatch(copy,/—|four environments|quatre environnements/u);
  }
});

test('the group model branches into enabled and disabled plans and scopes removal to this assignment', () => {
  for(const variant of variants.filter(item=>item.kind==='activation')) {
    const {all,root}=inspect(variant.svg),copy=content(root);
    assert.equal(all.filter(node=>attrs(node)['data-node']==='product-licence').length,1);
    assert.deepEqual(all.filter(node=>attrs(node)['data-plan']).map(node=>attrs(node)['data-plan']),['enabled','disabled']);
    for(const relation of ['group-to-licence','licence-to-enabled','licence-to-disabled']) {
      const link=all.find(node=>attrs(node)['data-link']===relation);
      assert.ok(link,relation);
      assert.ok(children(link).some(node=>tag(node)==='path'));
    }
    for(const token of variant.lang==='fr'?['cette attribution est retirée','D’autres groupes','L’installation du logiciel est une autre étape','Cas pédagogique']:['this assignment is removed','Other groups','Software installation is a separate step','Teaching example'])assert.ok(copy.includes(token),token);
    assert.doesNotMatch(copy,/—|installation automatique|automatically installs/u);
  }
});

test('geometry fails on overlong type, shifted inner bounds, crossing rails and overflowing shapes', async () => {
  const svg=microsoftContractsSvg('en','activation',true);
  await assert.rejects(geometry(svg.replace('>Group<',`>${'W'.repeat(80)}<`)));
  await assert.rejects(geometry(svg.replace(/data-bounds="104 342 192 \d+"/u,'data-bounds="270 342 192 44"')));
  await assert.rejects(geometry(svg.replace('</svg>','<line x1="100" y1="364" x2="304" y2="364" stroke="none"/></svg>')));
  await assert.rejects(geometry(svg.replace('</svg>','<path d="M100 364 L304 364" stroke="none"/></svg>')));
  await assert.rejects(geometry(svg.replace('width="208" height="80"','width="600" height="80"')));
});

test('controlled SVG rejects script, resources, raw paint and unsupported inputs', () => {
  const svg=microsoftContractsSvg('fr','activation',true);
  for(const payload of ['<script/>','<foreignObject/>','<image href="https://example.com/x"/>'])assert.throws(()=>inspect(svg.replace('</svg>',`${payload}</svg>`)));
  assert.throws(()=>inspect(svg.replace('<svg ','<svg onload="void(0)" ')));
  assert.throws(()=>inspect(svg.replace(`fill="${paint('ink')}"`,'fill="url(https://example.com/x)"')));
  assert.throws(()=>inspect(svg.replace(`fill="${paint('ink')}"`,'fill="#123456"')));
  assert.throws(()=>microsoftContractsSvg('de','activation',true));
  assert.throws(()=>microsoftContractsSvg('fr','invented',true));
  assert.throws(()=>microsoftContractsSvg('fr','activation','false'));
});

test('Astro inserts only controlled markup and switches complete compositions at 640 pixels', () => {
  const component=readFileSync(new URL('../src/components/MicrosoftContractsFigure.astro',import.meta.url),'utf8');
  assert.ok(component.includes('set:html={microsoftContractsSvg(lang, kind, false)}'));
  assert.ok(component.includes('set:html={microsoftContractsSvg(lang, kind, true)}'));
  assert.ok(!component.includes('set:html={caption}'));
  assert.ok(component.includes('<slot />'));
  assert.ok(component.includes('@media (max-width: 640px)'));
  assert.ok(component.includes('padding-bottom: .85rem'));
  assert.doesNotMatch(component,/<script|overflow:\s*hidden/u);
});
