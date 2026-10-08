import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
const require = createRequire(resolve('package.json'));
const { XMLParser, XMLValidator } = require('fast-xml-parser');
const postcss = require('postcss');

// Signatures were calculated from the supplied, unmodified XML with a maintained
// parser. Fonts, labels and all geometry except three short card backgrounds remain fixed. Only exact
// semantic paints, a known ID prefix and the responsive root style are excluded.
const directory = resolve('src/assets/banques-dette-souveraine');
const componentPath = resolve('src/components/SovereignBankFigure.astro');
const frozen = {
  "01-expositions-en-mobile.svg": "fcdcef9a734a7f2e8d76c84b8aa4070b1caabbc40cd5dbcb2cec067e404a0934",
  "01-expositions-en.svg": "6bea2aae189459aeebd9924b26925195fb73e476ee1bbab761eca551ff99205c",
  "01-expositions-fr-mobile.svg": "716d7fadb49617dd0b5b1b454b161bfcc7e7dd02ec0ee0f0fc8da4c09550748e",
  "01-expositions-fr.svg": "332051302de8e7806afe088754a1341f1b1b73701e87a430ba08ea95b938ed1e",
  "02-prix-collateral-en-mobile.svg": "d5cbae5da9baa34b5a43cd44f6ca09cf5e9377a6bade694884230e56b30cbe97",
  "02-prix-collateral-en.svg": "f822856ceb5dfa5aa5fc8bf8d095485448aef05eea0ca568fabb764288066afb",
  "02-prix-collateral-fr-mobile.svg": "6f4c8881f13e81008eb2a5cb568087e441ff42a0b3e6031bc7ba237e7e87ebf4",
  "02-prix-collateral-fr.svg": "ca7820a393d8195fa80d14807a4d873d14236a8ce7b781053178fcf4cbc065c7",
  "03-comptabilite-en-mobile.svg": "6975f1d92ec23e9915662a02a54c5abec6b00e9a0ba190988aca3486f2141cfa",
  "03-comptabilite-en.svg": "b14a1f1296923eaaa6153e2b529a4ba3d78387d197dfac75524a45cfbeb640be",
  "03-comptabilite-fr-mobile.svg": "e2aa04f6aeb6fae05c79e7868f2077d3d236cb85c671e9efccb056fb23fc6474",
  "03-comptabilite-fr.svg": "e0a7824c0cd3445cdad29bcca22f8429ac6617eaf03ec23b63a3fe9424377430",
  "04-financement-en-mobile.svg": "12665777050c339a92e56ebad8236b2160c1986f15c2fd5e271f7335d8d895e6",
  "04-financement-en.svg": "f329e15e36174b7f939b9e7b21978dd49adfd71eae2bbad1a0adabf944f1792d",
  "04-financement-fr-mobile.svg": "6bdaeb598111c82cff5802bb02fe8ce5006a4cb6a5d8fc7daa70b760483351cb",
  "04-financement-fr.svg": "166459d2bdbd4d3d1305148070748d2ef66188d3adcabf21839dd664a9e0e190",
  "05-deutsche-en-mobile.svg": "79e3217ac204d3822fcf17282babc81e95e77e76f7d4cfddb9f75d8467d38d46",
  "05-deutsche-en.svg": "52f08d18bfdc629996685a42b9515c91ff4eeb1c8cf571f2bb1114145d5f6251",
  "05-deutsche-fr-mobile.svg": "b56025a1b7e38d08beabcdfc5f9927ef1bb0600ebce102c9009b7af20acbe163",
  "05-deutsche-fr.svg": "b23ba42cbaff42a2696a84abe4da69bd7a9c5972cfe196ed1acf8404d8050ba3",
  "06-immobilier-en-mobile.svg": "b486bfe717c4fa3049bdc738a40f968857181f4ffc3eb38696dc7e328c26b25a",
  "06-immobilier-en.svg": "c3ccfc6657035399328ed3166d01818c95f554d2522709b50aa7d7112ec75e52",
  "06-immobilier-fr-mobile.svg": "f6f97faa391599e70703407d85d5b7d594836d53ca264c261395f8003124ad91",
  "06-immobilier-fr.svg": "a87fae9653a5eb2cdbee9975267a0817f8a539e48acf94376826a27dcb3d8fe4",
  "07-boucle-en-mobile.svg": "182097a48c13a3b0d7860b818c1a22833c84bc1fe168071665e9901894c26e13",
  "07-boucle-en.svg": "7fc5bcf1eec16e99e019e19c919d9bf8b9c3d1af5c1fb703bf3af47e0bc76773",
  "07-boucle-fr-mobile.svg": "bbfac1a76410b8038e172d526c2d85c60042145712985756293f7d1862695362",
  "07-boucle-fr.svg": "9c81d343943ca00631edc353209a602a02e91a1ceec7794a9ff14ba3269dc45b"
};
const repairs = {
  '01-expositions-en-mobile.svg': {y:'578.5899999999999', old:'145', new:'171', label:'stocks.', minimumPadding:8},
  '02-prix-collateral-fr-mobile.svg': {y:'241.33999999999997', old:'154', new:'177', label:'contractuels.', minimumPadding:15},
  '02-prix-collateral-en-mobile.svg': {y:'202.92', old:'154', new:'177', label:'payments.', minimumPadding:15},
};
const parser = new XMLParser({ preserveOrder: true, ignoreAttributes: false, attributeNamePrefix: '', trimValues: false, parseTagValue: false, parseAttributeValue: false });
const tag = n => Object.keys(n).find(k => k !== ':@');
const attrs = n => n[':@'] ?? {};
const children = n => n[tag(n)] ?? [];
const elements = n => tag(n) === '#text' ? [] : [n, ...children(n).flatMap(elements)];
const text = n => tag(n) === '#text' ? n['#text'] : children(n).map(text).join(' ');
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
const get = (stem, lang, mobile) => trees.get(`${stem}-${lang}${mobile ? '-mobile' : ''}.svg`);
const n = (node, key, fallback = 0) => { const v = Number(attrs(node)[key] ?? fallback); assert.ok(Number.isFinite(v), key); return v; };
const near = (a,b) => assert.ok(Math.abs(a-b) < 1e-7, `${a} != ${b}`);

function signature(node, root = false, name) {
  if (tag(node) === '#text') return node['#text'];
  const properties = Object.fromEntries(Object.entries(attrs(node)).filter(([key]) => !['fill', 'stroke'].includes(key) && !(root && key === 'style')).sort(([a],[b]) => a.localeCompare(b)));
  const repair = repairs[name];
  if (repair && tag(node) === 'rect' && properties.x === '44' && properties.y === repair.y && properties.width === '532' && properties.rx === '12' && properties.height === repair.new) properties.height = repair.old;
  if (properties.id) properties.id = properties.id.replace(/^sovereign-banks-/u, '');
  if (properties['aria-labelledby']) properties['aria-labelledby'] = properties['aria-labelledby'].split(' ').map(id => id.replace(/^sovereign-banks-/u, '')).join(' ');
  if (properties['marker-end']) properties['marker-end'] = properties['marker-end'].replace('url(#sovereign-banks-', 'url(#');
  return [tag(node), properties, children(node).map(child => signature(child, false, name))];
}

test('all 28 SVGs are inert, named, responsive and use exact native l0g paints', () => {
  assert.deepEqual(files, Object.keys(frozen).sort());
  const roles = ['ink','surface','surface-2','paper','muted','line-strong','signal','amber','topic-blue','down'];
  const allowedPaint = new Set(['none', ...roles.map(paint)]);
  const tags = new Set('svg title desc defs marker path rect line text'.split(' '));
  const attributes = new Set('xmlns width height viewBox role aria-labelledby id refX refY markerWidth markerHeight orient d fill stroke stroke-width stroke-linecap stroke-linejoin marker-end stroke-dasharray x y rx font-family font-size font-weight text-anchor x1 y1 x2 y2 opacity cx cy r style'.split(' '));
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
        if (key === 'id') { assert.ok(value.startsWith('sovereign-banks-')); assert.ok(!globalIDs.has(value), value); globalIDs.add(value); }
        if (['fill','stroke'].includes(key)) assert.ok(allowedPaint.has(value), value);
        if (key === 'style') { assert.equal(el, tree); assert.equal(value, root.style); }
        if (key === 'xmlns') { assert.equal(el, tree); assert.equal(value, root.xmlns); }
        if (key === 'marker-end') {
          const ref = /^url\(#([\w-]+)\)$/u.exec(value); assert.ok(ref, value);
          assert.ok(all.some(item => tag(item) === 'marker' && attrs(item).id === ref[1]), value);
        } else assert.ok(!String(value).includes('url('), value);
      }
      if (tag(el) === 'text') {
        assert.equal(attrs(el)['font-family'], 'Arial, Helvetica, sans-serif');
        assert.ok(n(el, 'font-size') >= (name.includes('-mobile') ? 19 : 18), name);
      }
    }
  }
});

test('original compositions are preserved with exactly three repaired card backgrounds', () => {
  for (const [name,tree] of trees) {
    const hash = createHash('sha256').update(JSON.stringify(signature(tree,true,name))).digest('hex');
    assert.equal(hash, frozen[name], name);
  }
});

test('primitive bounds and all label anchors stay within the original viewBoxes', () => {
  for (const [name,tree] of trees) {
    const [left,top,width,height] = attrs(tree).viewBox.split(' ').map(Number);
    assert.equal(left,0); assert.equal(top,0); assert.equal(width,name.includes('-mobile') ? 620 : 1120);
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


test('sovereign exposure bars retain a common zero-based scale and the stock scope', () => {
  for (const lang of ['fr','en']) for (const mobile of [false,true]) {
    const tree=get('01-expositions',lang,mobile),all=elements(tree),copy=text(tree);
    const bars=all.filter(el=>tag(el)==='rect'&&attrs(el).rx==='0');assert.equal(bars.length,2);
    const scale=mobile?90:190;near(n(bars[0],'width'),3.65*scale);near(n(bars[1],'width'),4.18*scale);
    for(const bar of bars)near(n(bar,'x'),44);
    assert.equal(attrs(bars[0]).fill,paint('topic-blue'));assert.equal(attrs(bars[1]).fill,paint('signal'));
    for(const value of ['2024','2025','206','232','530','S03'])assert.ok(copy.includes(value),value);
    assert.ok(copy.includes(lang==='fr'?'UE/EEE':'EU/EEA'));
    assert.ok(copy.includes(lang==='fr'?'n’est pas une perte':'not a loss'));
  }
});

test('the illustrative bond bars use discounted contractual payments, not a linear duration shortcut', () => {
  const price=years=>Array.from({length:years},(_,i)=>3/1.045**(i+1)).reduce((a,b)=>a+b,0)+100/1.045**years;
  for(const lang of ['fr','en'])for(const mobile of [false,true]){
    const tree=get('02-prix-collateral',lang,mobile),all=elements(tree),copy=text(tree);
    const bars=all.filter(el=>tag(el)==='rect'&&attrs(el).rx==='0');assert.equal(bars.length,8);
    const scale=(mobile?430:930)/100;
    [2,5,10,20].forEach((years,i)=>{near(n(bars[i*2],'width'),100*scale);near(n(bars[i*2+1],'width'),price(years)*scale);near(n(bars[i*2],'x'),n(bars[i*2+1],'x'));near(n(bars[i*2],'y'),n(bars[i*2+1],'y'));});
    assert.ok(copy.includes(lang==='fr'?'97,19':'97.19'));assert.ok(copy.includes(lang==='fr'?'80,49':'80.49'));
    assert.ok(copy.includes(lang==='fr'?'95,00':'95.00'));assert.ok(copy.includes(lang==='fr'?'83,72':'83.72'));
    assert.ok(copy.includes(lang==='fr'?'Simulation':'model')||copy.includes('Model'));
    assert.ok(copy.includes(lang==='fr'?'pas un barème de la BCE':'not an ECB schedule'));
    near(Math.round(100*.95*100)/100,95);near(Math.round(price(10)*.95*100)/100,83.72);
  }
});

test('economic value and one-year income use separate signed scales and remain scenarios', () => {
  for(const lang of ['fr','en'])for(const mobile of [false,true]){
    const tree=get('05-deutsche',lang,mobile),all=elements(tree),copy=text(tree);
    const bars=all.filter(el=>tag(el)==='rect'&&attrs(el).rx==='0');assert.equal(bars.length,4);
    const full=mobile?460:960,eveScale=full/9,niiScale=full/700;
    near(n(bars[0],'width'),6.694*eveScale);near(n(bars[1],'width'),1.647*eveScale);
    near(n(bars[0],'x')+n(bars[0],'width'),n(bars[1],'x'));
    near(n(bars[2],'width'),63*niiScale);near(n(bars[3],'width'),682*niiScale);
    near(n(bars[2],'x')+n(bars[2],'width'),n(bars[3],'x')+n(bars[3],'width'));
    assert.equal(attrs(bars[0]).fill,paint('down'));assert.equal(attrs(bars[1]).fill,paint('signal'));
    assert.ok(copy.includes('EVE')&&copy.includes('NII')&&copy.includes('S10'));
    assert.ok(copy.includes(lang==='fr'?'ne se cumulent pas':'must not be added'));
    assert.ok(copy.includes(lang==='fr'?'ne sont pas des pertes réalisées':'not realised October losses'));
  }
});

test('the conditional feedback loop retains four modules, four links and the prior-period buffers', () => {
  for(const lang of ['fr','en'])for(const mobile of [false,true]){
    const tree=get('07-boucle',lang,mobile),all=elements(tree),copy=text(tree);
    const arrows=all.filter(el=>tag(el)==='path'&&attrs(el)['marker-end']);assert.equal(arrows.length,4);
    assert.equal(arrows.filter(el=>attrs(el)['stroke-dasharray']).length,1);
    for(const value of ['16','154','2,17','2.17'].filter(v=>!v.includes('.')||lang==='en').filter(v=>!v.includes(',')||lang==='fr'))assert.ok(copy.includes(value),value);
    assert.ok(copy.includes(lang==='fr'?'les flèches ne sont pas une prévision':'arrows are not a forecast'));
    assert.ok(copy.includes(lang==='fr'?'T2 2026':'Q2 2026'));assert.ok(copy.includes('S15')&&copy.includes('S17'));
    assert.ok(copy.includes(lang==='fr'?'conditionnel':'conditional'));
  }
});

test('the controlled static component keeps the whole responsive drawings and native captions', () => {
  const component=readFileSync(componentPath,'utf8'),sheet=component.match(/<style>([\s\S]*?)<\/style>/u);assert.ok(sheet);
  const css=postcss.parse(sheet[1]);
  const decl=(selector,media)=>{const out={};css.walkRules(r=>{if(r.selector===selector&&(media?r.parent.type==='atrule'&&r.parent.params===media:r.parent.type==='root'))r.walkDecls(d=>out[d.prop]=d.value);});return out;};
  const svg=decl('.sovereign-bank-figure :global(svg)');assert.equal(svg.width,'100%');assert.equal(svg.height,'auto');assert.equal(svg['max-width'],'100%');assert.equal(svg['letter-spacing'],'normal');assert.ok(!svg['max-height']);
  assert.equal(decl('.sovereign-bank-mobile').display,'none');
  assert.equal(decl('.sovereign-bank-desktop','(max-width: 640px)').display,'none');assert.equal(decl('.sovereign-bank-mobile','(max-width: 640px)').display,'block');
  assert.equal(decl('.sovereign-bank-desktop','print').display,'block');assert.equal(decl('.sovereign-bank-mobile','print').display,'none');
  assert.equal(decl('.sovereign-bank-figure')['padding-bottom'],'.75rem');assert.equal(decl('figcaption').color,'var(--color-muted)');assert.ok(!decl('figcaption').font);
  assert.ok(!component.includes('<script'));assert.equal((component.match(/set:html=/gu)||[]).length,2);assert.ok(component.includes('Invalid sovereign-bank figure source reference'));
  css.walkDecls(d=>assert.ok(!d.value.includes('#'),'CSS uses semantic colors'));
});

test('the three repaired backgrounds enclose the final glyphs with positive bottom padding', () => {
  for (const [name, repair] of Object.entries(repairs)) {
    const all=elements(trees.get(name)),cards=all.filter(el=>tag(el)==='rect'&&attrs(el).x==='44'&&attrs(el).y===repair.y&&attrs(el).width==='532'&&attrs(el).rx==='12');
    assert.equal(cards.length,1,name);assert.equal(attrs(cards[0]).height,repair.new);
    const last=all.filter(el=>tag(el)==='text'&&text(el)===repair.label);assert.equal(last.length,1,name);
    // Rendered Arial bounds measured independently are below this conservative
    // descent bound (0.3em). Browser QA measures the actual glyph rectangle too.
    const conservativeBottom=n(last[0],'y')+.3*n(last[0],'font-size');
    assert.ok(n(cards[0],'y')+n(cards[0],'height')-conservativeBottom>=repair.minimumPadding,name);
  }
});
