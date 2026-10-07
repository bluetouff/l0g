import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
const require = createRequire(resolve('package.json'));
const { XMLParser, XMLValidator } = require('fast-xml-parser');
const postcss = require('postcss');

// Original XML signatures preserve all labels, fonts, data and geometry. Only
// fills/strokes, the explicit ID prefix and root responsive style are normalized.
// GPU_SVG_FIXTURE_ROOT selects the private pre-integration fixture in this test only.
const fixture = process.env.GPU_SVG_FIXTURE_ROOT;
const directory = fixture ? resolve(fixture, 'prepared-svg') : resolve('public/images/gpu-credit');
const componentPath = fixture ? resolve(fixture, 'prepared-component.astro') : resolve('src/components/GpuCreditFigure.astro');
const frozen = {
  "gpu-f1-en-d.svg": "988bc299dcbd1cf84aff1c99795179e119887991a38075bf7c5c2f5e747285ae",
  "gpu-f1-en-m.svg": "50f5c7a1b3a569d7a6c9a028bcb55b0ac1a470e2750f07ab657e2dddc6ef5ee7",
  "gpu-f1-fr-d.svg": "52224a62c774d864249e8ffd96ce6cc23c3da8e9a11f188b82158c6eaea5a866",
  "gpu-f1-fr-m.svg": "97afce806e2f5ae1a6c1f85b5f05c1ccaee1969c6b0fd625805a7e4cedf3aace",
  "gpu-f2-en-d.svg": "f0a40e97762cd8591f05a047363549553091e8fc211a45deb0ec68beeafa287e",
  "gpu-f2-en-m.svg": "621b75dc469042008b531c6a05582783828aab61fe4e86f52e1ebcd2a4622a8a",
  "gpu-f2-fr-d.svg": "c4980ef17a17b4c58b7b7dea89a8424e47d68807d2f7d7a395154a8b23d306ad",
  "gpu-f2-fr-m.svg": "cfa924ed2cacfa7b29a3489453d5d1c5a7084ac6a295ec5cee9fe6fad62ee57e",
  "gpu-f3-en-d.svg": "b69048807ccf6494db6bc727d4f4c5c84ee3b7c43c1e4b076e8a02aa511c5e28",
  "gpu-f3-en-m.svg": "fcc5042529a0bc6bac3e1608395f0d25f614b3fd551d13fb1838a54deb4f206c",
  "gpu-f3-fr-d.svg": "6bcc32cf5ba9ff2191be5f167d440ef183975b7fc84e267174853b03a239e7b4",
  "gpu-f3-fr-m.svg": "232f1553d2e835dcd6855555fd5d9e46afbeb432d06f7bdb9dbb279795a4e267",
  "gpu-f4-en-d.svg": "b19bb3c25decf5bc8c677123dda4b1638336367bc9b826b16fd8df7c18d454d3",
  "gpu-f4-en-m.svg": "db83a7f6cf41e7a6abb5b9f8c9cf28bce7b065593d7d76f6680c3d7a0561f042",
  "gpu-f4-fr-d.svg": "8bee38053f45be80484e56f2acdafc379130c0c9a11e3f25e82bac4d868b602d",
  "gpu-f4-fr-m.svg": "d543c18b8a8266a865451bd6f1165ea635f1e52db1db56138c379fdc870b0941",
  "gpu-f5-en-d.svg": "99418f648d933d8132b6b12eb6a8c0379751effff1752a2b42169817f92cac5f",
  "gpu-f5-en-m.svg": "330eb843b8be0da9a31be0ffe1f2f2759c54e018b6d8d68de30afbf271c84191",
  "gpu-f5-fr-d.svg": "8e1889863b4880cd1b3ba3133ba7cbf3e6971fe2185a5e0508f52b9ae6f4832c",
  "gpu-f5-fr-m.svg": "85a8f0df65d0b1d2d3f53214797244c584116953e544afbf27d9fa74864c9090",
  "gpu-f6-en-d.svg": "c11e942cc159925480d11a478e9727918f7061fc27cf222c1fe0734cbe6f4a76",
  "gpu-f6-en-m.svg": "06e592efe93c4023e2b7312d168d0fb01ebac12cfd7ba6f7ab1ea42a29e2d8f9",
  "gpu-f6-fr-d.svg": "c0c578857e2ba4a7b1bac77240d3b01d6e4d81a4eede29bbe4203ab817a1073c",
  "gpu-f6-fr-m.svg": "374817ff7772d3629471a4aee9c35cbddaabcdadfc8fa95b7636d996dc3ce78e",
  "gpu-f7-en-d.svg": "d38db43531d84b581cb64ebe4301ab7c16ffd0eee9f3a791d8e7fe4e33989213",
  "gpu-f7-en-m.svg": "5f5a1b82ab604d09242bc4bc8ae31b0020f5e693b76d6e782b46ba88ecbc6051",
  "gpu-f7-fr-d.svg": "e8b090a41dab1243fc98eb2729d7ae2ad72624dbf0ea2386f9f20072f0cc0662",
  "gpu-f7-fr-m.svg": "067641dcc468c6a7eefc87b6b678b42223a91ccd10040eecd1a13be7bf45fe26"
};
const parser = new XMLParser({ preserveOrder: true, ignoreAttributes: false, attributeNamePrefix: '', trimValues: false, parseTagValue: false, parseAttributeValue: false });
const tag = n => Object.keys(n).find(k => k !== ':@');
const attrs = n => n[':@'] ?? {};
const children = n => n[tag(n)] ?? [];
const elements = n => tag(n) === '#text' ? [] : [n, ...children(n).flatMap(elements)];
const text = n => (tag(n) === '#text' ? n['#text'] : children(n).map(text).join(' ')).replace(/\s+/gu,' ').trim();
const files = readdirSync(directory).filter(n => n.endsWith('.svg')).sort();
const trees = new Map(files.map(name => {
  const source = readFileSync(resolve(directory, name), 'utf8');
  assert.equal(XMLValidator.validate(source), true, name);
  assert.ok(!/<!|<\?/u.test(source), 'No DTD, entity declaration or processing instruction');
  const parsed = parser.parse(source); assert.equal(parsed.length, 1);
  return [name, parsed[0]];
}));
const native = {};
postcss.parse(readFileSync('src/styles/global.css', 'utf8')).walkDecls(d => {
  if (d.parent.type === 'atrule' && d.parent.name === 'theme') native[d.prop] = d.value;
});
const paint = role => `var(--color-${role}, ${native[`--color-${role}`]})`;
const get = (figure,lang,mobile) => trees.get(`gpu-f${figure}-${lang}-${mobile?'m':'d'}.svg`);
const n = (node, key, fallback = 0) => { const v = Number(attrs(node)[key] ?? fallback); assert.ok(Number.isFinite(v), key); return v; };
const near = (a,b,tolerance=.0006) => assert.ok(Math.abs(a-b) < tolerance, `${a} != ${b}`);
const tint=(role,pct)=>`color-mix(in srgb, ${paint(role)} ${pct}%, ${paint('surface-2')})`;

function signature(node, root = false) {
  if (tag(node) === '#text') return node['#text'];
  const properties = Object.fromEntries(Object.entries(attrs(node)).filter(([key]) => !['fill', 'stroke'].includes(key) && !(root && key === 'style')).sort(([a],[b]) => a.localeCompare(b)));
  if (properties.id) properties.id = properties.id.replace(/^gpu-credit-/u, '');
  if (properties['aria-labelledby']) properties['aria-labelledby'] = properties['aria-labelledby'].split(' ').map(id => id.replace(/^gpu-credit-/u, '')).join(' ');
  if (properties['marker-end']) properties['marker-end'] = properties['marker-end'].replace('url(#gpu-credit-', 'url(#');
  return [tag(node), properties, children(node).map(child => signature(child))];
}

test('all 28 SVGs are inert, named, responsive and use exact native l0g paints', () => {
  assert.deepEqual(files, Object.keys(frozen).sort());
  const roles = ['ink','surface','surface-2','paper','muted','line-strong','signal','amber','topic-blue','down'];
  const allowedPaint = new Set(['none', ...roles.map(paint),tint('signal',8),tint('amber',22),tint('down',12)]);
  const tags = new Set('svg title desc defs marker path rect line text circle'.split(' '));
  const attributes = new Set('xmlns width height viewBox role aria-labelledby id refX refY markerWidth markerHeight orient d fill stroke stroke-width stroke-linecap stroke-linejoin marker-end stroke-dasharray x y rx font-family font-size font-weight text-anchor letter-spacing x1 y1 x2 y2 opacity cx cy r style'.split(' '));
  const globalIDs = new Set();
  for (const [name, tree] of trees) {
    const all = elements(tree), root = attrs(tree);
    assert.equal(tag(tree), 'svg'); assert.equal(root.xmlns, 'http://www.w3.org/2000/svg');
    assert.equal(root.role, 'img'); assert.equal(root.style, 'width:100%;height:auto');
    for (const kind of ['title','desc']) assert.equal(all.filter(el => tag(el) === kind).length, 1);
    const aria = root['aria-labelledby'].split(' '); assert.equal(aria.length, 2);
    for (const id of aria) assert.ok(all.some(el => attrs(el).id === id && ['title','desc'].includes(tag(el)) && text(el).trim()), name);
    for (const el of all) {
      assert.ok(tags.has(tag(el)), tag(el));
      for (const [key,value] of Object.entries(attrs(el))) {
        assert.ok(attributes.has(key), key);
        if (key === 'id') { assert.ok(value.startsWith('gpu-credit-')); assert.ok(!globalIDs.has(value), value); globalIDs.add(value); }
        if (['fill','stroke'].includes(key)) assert.ok(allowedPaint.has(value), value);
        if (key === 'style') { assert.equal(el, tree); assert.equal(value, root.style); }
        if (key === 'xmlns') { assert.equal(el, tree); assert.equal(value, root.xmlns); }
        if (key === 'marker-end') {
          const ref = /^url\(#([\w-]+)\)$/u.exec(value); assert.ok(ref, value);
          assert.ok(all.some(item => tag(item) === 'marker' && attrs(item).id === ref[1]), value);
        } else assert.ok(!String(value).includes('url('), value);
      }
      if (tag(el) === 'text') {
        assert.equal(attrs(el)['font-family'], 'Arial, sans-serif');
        assert.ok(n(el, 'font-size') >= (name.endsWith('-m.svg') ? 13 : 14), name);
      }
    }
  }
});

test('every original primitive, font, label and geometric coordinate is preserved', () => {
  for (const [name,tree] of trees) {
    const hash = createHash('sha256').update(JSON.stringify(signature(tree,true))).digest('hex');
    assert.equal(hash, frozen[name], name);
  }
});

test('primitive bounds and all label anchors stay within the original viewBoxes', () => {
  for (const [name,tree] of trees) {
    const [left,top,width,height] = attrs(tree).viewBox.split(' ').map(Number);
    assert.equal(left,0); assert.equal(top,0); assert.equal(width,name.endsWith('-m.svg') ? 440 : 1120);
    assert.ok(height > 0); assert.equal(n(tree,'width'),width); assert.equal(n(tree,'height'),height);
    const inside = (x,y) => assert.ok(x >= 0 && x <= width && y >= 0 && y <= height,name);
    for (const el of elements(tree)) {
      if (tag(el) === 'rect') { assert.ok(n(el,'width') >= 0 && n(el,'height') >= 0); inside(n(el,'x'),n(el,'y')); inside(n(el,'x')+n(el,'width'),n(el,'y')+n(el,'height')); }
      if (tag(el) === 'line') { inside(n(el,'x1'),n(el,'y1')); inside(n(el,'x2'),n(el,'y2')); }
      if (tag(el) === 'circle') { const r=n(el,'r')+n(el,'stroke-width')/2; inside(n(el,'cx')-r,n(el,'cy')-r); inside(n(el,'cx')+r,n(el,'cy')+r); }
      if (tag(el) === 'text') inside(n(el,'x'),n(el,'y'));
    }
  }
  // Browser QA additionally measures actual glyph bounds and card containment.
});


// Independent closed-form values for the expressly fictional annual model.
const payment=70*.1/(1-Math.pow(1.1,-5));
const remaining=70*Math.pow(1.1,3)-payment*(Math.pow(1.1,3)-1)/.1;
const supported=(12/1.35)*(1-Math.pow(1.1,-2))/.1;
const display=(value,lang)=>value.toFixed(2).replace('.',lang==='fr'?',':'.');
const roundedLabel=(tree,value,lang)=>assert.ok(text(tree).includes(display(value,lang)),display(value,lang));
const byType=(tree,kind)=>elements(tree).filter(el=>tag(el)===kind);

test('the four documented clocks keep independent scopes and calibrated bar lengths',()=>{
 for(const lang of ['fr','en'])for(const mobile of [false,true]){
  const tree=get(1,lang,mobile),copy=text(tree),rects=byType(tree,'rect');
  const bars=rects.filter(el=>[paint('signal'),paint('down'),paint('topic-blue')].includes(attrs(el).fill)&&n(el,'height')===(mobile?12:18));
  const scale=mobile?392:360;
  assert.equal(bars.length,3);[3,5,6].forEach((duration,i)=>near(n(bars[i],'width'),scale*duration/10));
  assert.equal(rects.filter(el=>attrs(el)['stroke-dasharray']==='5 4').length,1);
  for(const source of ['S02','S05','S06','S07'])assert.ok(copy.includes(source));
  assert.ok(copy.includes(lang==='fr'?'Durées non additives':'Non-additive durations'));
  assert.ok(copy.includes(lang==='fr'?'affirmation du fournisseur':"supplier’s claim")||copy.includes("supplier's claim"));
 }
});

test('the two observed financings keep commitments, recourse and rate scopes distinct',()=>{
 for(const lang of ['fr','en'])for(const mobile of [false,true]){
  const copy=text(get(2,lang,mobile));
  for(const word of ['CoreWeave','Lambda','DDTL 5.5','Compute I','SOFR','take-or-pay','DBRS'])assert.ok(copy.toLowerCase().includes(word.toLowerCase()),word);
  assert.ok(copy.includes(lang==='fr'?'2,6 Md$':'$2.6bn'));
  assert.ok(copy.includes(lang==='fr'?'1,008 Md$':'$1.008bn'));
  assert.ok(copy.includes(lang==='fr'?'6,78 %':'6.78%'));
  assert.ok(copy.includes(lang==='fr'?'Plafonds engagés, pas encours tirés':'Committed limits, not drawn balances'));
 }
});

test('book-value and debt curves use separate formulas and never infer resale prices',()=>{
 for(const lang of ['fr','en'])for(const mobile of [false,true]){
  const tree=get(3,lang,mobile),all=elements(tree),copy=text(tree);
  const paths=all.filter(el=>tag(el)==='path'&&[paint('topic-blue'),paint('down')].includes(attrs(el).stroke));assert.equal(paths.length,2);
  const points=path=>[...attrs(path).d.matchAll(/[ML]([\d.]+),([\d.]+)/gu)].map(match=>[Number(match[1]),Number(match[2])]);
  const book=points(paths[0]),debt=points(paths[1]);assert.equal(book.length,7);assert.equal(debt.length,7);
  const scale=(book[6][1]-book[0][1])/100,base=book[6][1];
  for(let year=0;year<=6;year++){
   near(book[year][1],base-Math.max(0,100*(1-year/6))*scale);
   const balance=year<5?70*Math.pow(1.1,year)-payment*(Math.pow(1.1,year)-1)/.1:0;
   near(debt[year][1],base-balance*scale);
  }
  roundedLabel(tree,remaining,lang);
  assert.ok(copy.includes(lang==='fr'?'Aucun prix de revente':'No resale price'));
  assert.ok(copy.includes(lang==='fr'?'valeur résiduelle comptable nulle':'zero accounting residual'));
 }
});

test('cashflow blocks are proportional to cash costs, scheduled debt and financing gaps',()=>{
 for(const lang of ['fr','en'])for(const mobile of [false,true]){
  const tree=get(4,lang,mobile),blocks=byType(tree,'rect').filter(el=>n(el,'height')===58);assert.equal(blocks.length,6);
  const scale=(mobile?392:1032)/50;
  [18,payment,32-payment,18,12,payment-12].forEach((amount,i)=>near(n(blocks[i],'width'),amount*scale));
  assert.equal(attrs(blocks[5])['stroke-dasharray'],'6 4');assert.equal(attrs(blocks[5]).fill,paint('ink'));
  roundedLabel(tree,payment,lang);roundedLabel(tree,32/payment,lang);roundedLabel(tree,12/payment,lang);
  assert.ok(text(tree).includes('take-or-pay'));
 }
});

test('heatmap values and colors encode explicit DSCR thresholds, not probabilities',()=>{
 for(const lang of ['fr','en'])for(const mobile of [false,true]){
  const tree=get(5,lang,mobile),all=elements(tree),indexes=mobile?[100,90,80,75,60]:[100,95,90,85,80,75,70,65,60];
  const cells=all.filter(el=>tag(el)==='rect'&&n(el,'width')===(mobile?61:91)&&n(el,'height')===(mobile?61:91));assert.equal(cells.length,indexes.length**2);
  cells.forEach((cell,i)=>{
   const price=indexes[i%indexes.length],hours=(mobile?[100,90,80,70,60]:indexes)[Math.floor(i/indexes.length)],ratio=(50*price*hours/10000-18)/payment;
   const label=all.find(el=>tag(el)==='text'&&attrs(el)['text-anchor']==='middle'&&n(el,'x')>n(cell,'x')&&n(el,'x')<n(cell,'x')+n(cell,'width')&&n(el,'y')>n(cell,'y')&&n(el,'y')<n(cell,'y')+n(cell,'height'));
   assert.ok(label);assert.equal(text(label),display(ratio,lang));
   const expected=ratio<.5?tint('down',12):ratio<1?tint('amber',22):ratio<1.35?tint('signal',8):paint('signal');assert.equal(attrs(cell).fill,expected);
   assert.equal(attrs(label).fill,ratio>=1.35?paint('ink'):paint('paper'));
  });
  roundedLabel(tree,((payment+18)/(50*.8))*100,lang);
  assert.ok(text(tree).includes(lang==='fr'?'les couleurs ne donnent':'colours do not imply probabilities'));
 }
});

test('resizing bars partition outstanding debt and retain the cash-retention counterpoint',()=>{
 for(const lang of ['fr','en'])for(const mobile of [false,true]){
  const tree=get(6,lang,mobile),bars=byType(tree,'rect').filter(el=>n(el,'height')===66);assert.equal(bars.length,2);
  near(n(bars[0],'width'),(mobile?392:1032)*supported/remaining);near(n(bars[1],'width'),(mobile?392:1032)*(remaining-supported)/remaining);
  for(const value of [12,12/1.35,supported,remaining,remaining-supported,3*(32-payment)])roundedLabel(tree,value,lang);
  assert.ok(text(tree).includes('2.40')||text(tree).includes('2,40'));
  assert.ok(text(tree).includes(lang==='fr'?'droits de remède':'cure rights'));
 }
});

test('sale-price illustration subtracts transaction costs before testing debt recovery',()=>{
 for(const lang of ['fr','en'])for(const mobile of [false,true]){
  const tree=get(7,lang,mobile),bars=byType(tree,'rect').filter(el=>attrs(el).rx==='0');assert.equal(bars.length,4);
  const scale=mobile?392/35:6.75;[35,3.5,2,29.5].forEach((value,i)=>near(n(bars[i],mobile?'width':'height'),value*scale));
  for(const value of [remaining-20.5,remaining-29.5,38.5-remaining])roundedLabel(tree,value,lang);
  assert.ok(text(tree).includes(lang==='fr'?'Scénarios de prix, pas cotations':'Scenario prices, not quotations'));
  assert.ok(text(tree).includes(lang==='fr'?'avant tout recours':'before any claim'));
 }
});

test('static component keeps integral variants and accessible native details without page overflow',()=>{
 const component=readFileSync(componentPath,'utf8');assert.ok(component.includes('<slot />'));assert.ok(!component.includes('<script'));
 const css=postcss.parse(component.match(/<style>([\s\S]*?)<\/style>/u)[1]);
 const rules=(selector,media)=>{const out={};css.walkRules(r=>{if(r.selector===selector&&(media?r.parent.type==='atrule'&&r.parent.params===media:r.parent.type==='root'))r.walkDecls(d=>out[d.prop]=d.value);});return out;};
 const svg=rules('.gpu-credit-evidence :global(svg)');assert.equal(svg.width,'100%');assert.equal(svg.height,'auto');assert.equal(svg['letter-spacing'],'normal');assert.ok(!svg['max-height']);
 assert.equal(rules('.gpu-credit-evidence')['padding-bottom'],'.75rem');assert.equal(rules('.gpu-credit-mobile').display,'none');assert.equal(rules('.gpu-credit-desktop','(max-width: 640px)').display,'none');assert.equal(rules('.gpu-credit-mobile','(max-width: 640px)').display,'block');
 assert.equal(rules('.gpu-credit-evidence :global(details table)')['overflow-x'],'auto');assert.equal(rules('.gpu-credit-evidence :global(details)')['font-size'],'.875rem');assert.equal(rules('.gpu-credit-evidence :global(summary)').cursor,'pointer');
});
