import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { XMLParser, XMLValidator } from 'fast-xml-parser';
import sharp from 'sharp';
import postcss from 'postcss';
import { microsoftChoiceSvg, SOVEREIGNTY, SWITCHING } from '../src/lib/microsoftChoiceFigures.mjs';

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
const variants = ['fr','en'].flatMap(lang => ['sovereignty','switching'].flatMap(kind => [false,true].map(mobile => ({ lang, kind, mobile, svg: microsoftChoiceSvg(lang,kind,mobile) }))));
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
    // A later filled rectangle can conceal a label even when text and rails fit.
    for(const cover of all.slice(all.indexOf(node)+1).filter(item=>tag(item)==='rect' && attrs(item).fill!=='none')) {
      const cx=numeric(cover,'x'),cy=numeric(cover,'y'),cr=cx+numeric(cover,'width'),cb=cy+numeric(cover,'height');
      assert.ok(!(box.x<cr && box.right>cx && box.y<cb && box.bottom>cy),`Later panel obscures: ${label}`);
    }
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


test('sovereignty distinguishes the all-objectives gate from normalized weighted scoring', () => {
  assert.deepEqual(SOVEREIGNTY.weights,[15,10,10,15,20,15,10,5]);
  assert.equal(SOVEREIGNTY.weights.reduce((a,b)=>a+b,0),100);
  assert.equal(SOVEREIGNTY.minimumPerObjective,2);
  assert.equal(SOVEREIGNTY.aggregateSeal,'minimum');
  assert.equal(SOVEREIGNTY.candidateScores,null);
  for(const variant of variants.filter(v=>v.kind==='sovereignty')) {
    const {all,root}=inspect(variant.svg),copy=content(root);
    for(const key of ['objectives','minimum-gate','eligible'])assert.equal(all.filter(n=>attrs(n)['data-node']===key).length,1);
    for(const key of ['threshold-passed','threshold-failed','eligible-to-score','score-to-quality'])assert.equal(all.filter(n=>attrs(n)['data-edge']===key).length,1);
    const weights=all.filter(n=>attrs(n)['data-weight']);
    assert.equal(weights.length,8);
    weights.forEach((group,i)=>{
      assert.equal(Number(attrs(group)['data-weight']),SOVEREIGNTY.weights[i]);
      assert.equal(Number(attrs(group)['data-objective']),i+1);
      const bar=children(group).find(n=>tag(n)==='rect');
      assert.equal(numeric(bar,variant.mobile?'height':'width'),(variant.mobile?300:772)*SOVEREIGNTY.weights[i]/100);
    });
    assert.ok(copy.includes('SEAL 2'));
    assert.match(copy,variant.lang==='fr'?/maximum.*pondéré/su:/divided by its maximum/su);
    assert.ok(copy.includes(variant.lang==='fr'?'offre écartée':'offer rejected'));
    assert.ok(copy.includes(variant.lang==='fr'?'score de qualité':'quality score'));
    assert.doesNotMatch(copy,/—|180|SEAL 3|SEAL 4/u);
  }
});

test('switching preserves separate calendar and working-day deadlines and conditions', () => {
  assert.deepEqual(SWITCHING,{noticeMonths:2,transitionCalendarDays:30,retrievalMinimumCalendarDays:30,infeasibilityNoticeWorkingDays:14,alternativeTransitionMonths:7,customerExtensions:1,erasureCondition:'successful-switch',terminationCondition:'successful-switch',timelineScale:false});
  for(const variant of variants.filter(v=>v.kind==='switching')) {
    const {all,root}=inspect(variant.svg),copy=content(root);
    for(const key of ['notice','transition','retrieval','erasure','technical-extension','customer-extension'])assert.equal(all.filter(n=>attrs(n)['data-node']===key).length,1);
    for(const key of ['notice-to-transition','transition-to-retrieval','retrieval-to-erasure','technical-to-transition','customer-to-transition'])assert.equal(all.filter(n=>attrs(n)['data-edge']===key).length,1);
    for(const value of variant.lang==='fr'?['14 jours ouvrables','7 mois','2 mois','30 jours','si le changement a réussi','notifiée par le fournisseur']:['14 working days','7 months','2 months','30 days','switching succeeded','contract termination'])assert.ok(copy.replaceAll('30 calendar days','30 days').includes(value),value);
    assert.ok(copy.includes(variant.lang==='fr'?'aucune durée totale':'no total duration'));
    assert.doesNotMatch(copy,/—|9 mois|9 months|90 jours|90 days/u);
  }
});

test('geometry rejects overflow, false region bounds, concealment and crossing rails', async () => {
  const svg=microsoftChoiceSvg('en','sovereignty',true);
  await assert.rejects(geometry(svg.replace('>8 OBJECTIVES ASSESSED<',`>${'W'.repeat(80)}<`)));
  await assert.rejects(geometry(svg.replace('data-bounds="40 229 320 38"','data-bounds="200 229 320 38"')));
  for(const obstruction of ['<line x1="24" y1="250" x2="350" y2="250" stroke="none"/>','<path d="M24 250 L350 250" stroke="none"/>',`<rect x="24" y="240" width="328" height="30" fill="${paint('surface')}"/>`])await assert.rejects(geometry(svg.replace('</svg>',`${obstruction}</svg>`)));
  await assert.rejects(geometry(svg.replace('width="400" height="1690"','width="800" height="1690"')));
});

test('controlled SVG rejects active markup, external resources and unsupported input', () => {
  const svg=microsoftChoiceSvg('fr','switching',true);
  for(const payload of ['<script/>','<foreignObject/>','<image href="https://example.com/x"/>'])assert.throws(()=>inspect(svg.replace('</svg>',`${payload}</svg>`)));
  assert.throws(()=>inspect(svg.replace('<svg ','<svg onload="void(0)" ')));
  assert.throws(()=>inspect(svg.replace(`fill="${paint('ink')}"`,'fill="url(https://example.com/x)"')));
  assert.throws(()=>inspect(svg.replace(`fill="${paint('ink')}"`,'fill="#123456"')));
  assert.throws(()=>microsoftChoiceSvg('de','sovereignty',true));
  assert.throws(()=>microsoftChoiceSvg('fr','invented',true));
  assert.throws(()=>microsoftChoiceSvg('fr','switching','false'));
});

test('Astro uses controlled markup and reflows complete compositions below 640 pixels', () => {
  const component=readFileSync(new URL('../src/components/MicrosoftChoiceFigure.astro',import.meta.url),'utf8');
  assert.ok(component.includes('set:html={microsoftChoiceSvg(lang, kind, false)}'));
  assert.ok(component.includes('set:html={microsoftChoiceSvg(lang, kind, true)}'));
  assert.ok(!component.includes('set:html={caption}'));
  assert.ok(component.includes('<slot />'));
  assert.ok(component.includes('@media (max-width: 640px)'));
  assert.ok(component.includes('padding-bottom: .85rem'));
  assert.doesNotMatch(component,/<script|overflow:\s*hidden/u);
});
