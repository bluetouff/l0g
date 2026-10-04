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
// OCC_SVG_FIXTURE_ROOT selects the private pre-integration fixture in this test only.
const fixture = process.env.OCC_SVG_FIXTURE_ROOT;
const directory = fixture ? resolve(fixture, 'prepared-svg') : resolve('public/images/crypto-banques-occ');
const componentPath = fixture ? resolve(fixture, 'prepared-component.astro') : resolve('src/components/OccCryptoFigure.astro');
const frozen = {
  "01-decisions-en-mobile.svg": "5c5e17d4a29cfd36ae61e01b551af59025d4f4455198ffa117c692859be1d304",
  "01-decisions-en.svg": "d828a095a6072915e9dffa85bcb81f8fb0bc0b5ef63a81ed0be2cd6c095e3e0c",
  "01-decisions-fr-mobile.svg": "0eb034c98474521f0a25c5361aa726a6094b18706bed9513cbda1398d3bdc2ee",
  "01-decisions-fr.svg": "0d28725f8bcd170047f981a92d9e109e94a7413063f633d79a185ea0038cdf6d",
  "02-frontiere-en-mobile.svg": "710f32ac9e24266350867fcfa4af2574991648b654d3b957af0ec6df98007aca",
  "02-frontiere-en.svg": "a2409060f60abe812a7e904d471c5fa6436a9277f8eb44b572016e818a0ed3d6",
  "02-frontiere-fr-mobile.svg": "6e5d9d0b2fbcf50fa48b2b4b7569b27d06a23013c25405574b054f0e2026f087",
  "02-frontiere-fr.svg": "0d4d07261aa28adc9760c09d1f0854fa8c610705217d774cb1d30694acdcd8db",
  "03-actifs-en-mobile.svg": "e9fc588011411e0d3ba05feb11dc25ae9a0879893ded57ccfdaa7c0c5b67b2cc",
  "03-actifs-en.svg": "9fa2b17ae0d26cc10ebd80ff9fef8632173c490f55a87209ac97969ec1b76cca",
  "03-actifs-fr-mobile.svg": "c14002cafecfa3df990b9f80e6e65aba33149ba2a5d49babcd6d9b27d1436bc6",
  "03-actifs-fr.svg": "6b806fbcf71d17f50422638476df71f3d73ed6c2ebe58d9b49206bdac5f088b5",
  "04-protego-en-mobile.svg": "76ac07d0f2d6dcf79f77efdd0eb5e137eab4a6532c618302e5f11bf562557bd3",
  "04-protego-en.svg": "26155017ff4fb3b0d415d7744ee23f495fe2e9f45dd4ab51ad12fae7d6ccab5a",
  "04-protego-fr-mobile.svg": "e90f76e5a4e6310728447b5b2fa1b74aa93353eccfabb4c8292203e98d04690e",
  "04-protego-fr.svg": "7e8269b6499d11b7abb517f11f422be78a80acbbc15823786113a57d7f30693a",
  "05-etapes-en-mobile.svg": "5243a5bd15dea82b01313f358ece1cd60c2e84ea07b8ddd8ef02acfc893a55c7",
  "05-etapes-en.svg": "0a809373e77f9654e349151437f143835c40075f83e2bb90cad8d8ce9cb0c245",
  "05-etapes-fr-mobile.svg": "b90728e113787dd6f178ea6e1e967cc10d9ecb9b21b7b2b8ca7761d23970e7f8",
  "05-etapes-fr.svg": "0502872626cd3e2d3e2e05708acb473af01362b2500207288884b0c4d425437b",
  "06-depots-en-mobile.svg": "a9d0923a5fbcc8374706be3d1ca3f022212561eff5096a972440b184e7ba252c",
  "06-depots-en.svg": "8461de858012f38100e683b54597c08466da87f75f26045d4f5acf3d49dd341f",
  "06-depots-fr-mobile.svg": "6e9a2162b81a37aa9604cf56b5dbc8447eeac766fe1bdd7253f08f27a20873b7",
  "06-depots-fr.svg": "03c8596609e6399504397079ae4efeae89df5e12d08de3302ef56d6a92a17128"
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

function signature(node, root = false) {
  if (tag(node) === '#text') return node['#text'];
  const properties = Object.fromEntries(Object.entries(attrs(node)).filter(([key]) => !['fill', 'stroke'].includes(key) && !(root && key === 'style')).sort(([a],[b]) => a.localeCompare(b)));
  if (properties.id) properties.id = properties.id.replace(/^occ-crypto-/u, '');
  if (properties['aria-labelledby']) properties['aria-labelledby'] = properties['aria-labelledby'].split(' ').map(id => id.replace(/^occ-crypto-/u, '')).join(' ');
  if (properties['marker-end']) properties['marker-end'] = properties['marker-end'].replace('url(#occ-crypto-', 'url(#');
  return [tag(node), properties, children(node).map(child => signature(child))];
}

test('all 24 SVGs are inert, named, responsive and use exact native l0g paints', () => {
  assert.deepEqual(files, Object.keys(frozen).sort());
  const roles = ['ink','surface','surface-2','paper','muted','line-strong','signal','amber','topic-blue','down'];
  const allowedPaint = new Set(['none', ...roles.map(paint)]);
  const tags = new Set('svg title desc defs marker path rect line text circle'.split(' '));
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
        if (key === 'id') { assert.ok(value.startsWith('occ-crypto-')); assert.ok(!globalIDs.has(value), value); globalIDs.add(value); }
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

test('every original primitive, font, label and geometric coordinate is preserved', () => {
  for (const [name,tree] of trees) {
    const hash = createHash('sha256').update(JSON.stringify(signature(tree,true))).digest('hex');
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

test('the $6.8tn administered-asset stock uses the 5.2/1.6 split and keeps its scope', () => {
  for (const lang of ['fr','en']) for (const mobile of [false,true]) {
    const tree = get('03-actifs',lang,mobile), all = elements(tree), copy = text(tree);
    const bars = all.filter(el => tag(el) === 'rect' && attrs(el).rx === '0' && n(el,'height') === 100);
    assert.equal(bars.length,2); assert.equal(attrs(bars[0]).fill,paint('signal')); assert.equal(attrs(bars[1]).fill,paint('amber'));
    const width = mobile ? 532 : 1032;
    near(n(bars[0],'width'),width*5200/6800); near(n(bars[1],'width'),width*1600/6800);
    near(n(bars[0],'x'),44); near(n(bars[1],'x'),44+n(bars[0],'width')); near(n(bars[0],'y'),n(bars[1],'y'));
    assert.ok(copy.includes(lang==='fr' ? '30 septembre 2025' : 'September 30, 2025'));
    assert.ok(copy.includes(lang==='fr' ? '76,5 %' : '76.5%')); assert.ok(copy.includes(lang==='fr' ? '23,5 %' : '23.5%'));
    assert.ok(copy.includes(lang==='fr' ? 'non assurées' : 'uninsured'));
    assert.ok(copy.includes(lang==='fr' ? 'du seul marché crypto' : 'crypto-only market'));
    assert.ok(copy.includes('S15')); near(5200+1600,6800);
  }
});

test('liquidity is max(half capital, 7.5m), included in bars, with a separate 180-day buffer', () => {
  for (const lang of ['fr','en']) for (const mobile of [false,true]) {
    const tree=get('04-protego',lang,mobile),all=elements(tree),copy=text(tree);
    const capital = all.filter(el => tag(el)==='rect' && attrs(el).fill===paint('surface-2') && attrs(el).rx==='0');
    const liquid = all.filter(el => tag(el)==='rect' && attrs(el).fill===paint('signal') && attrs(el).rx==='0' && (mobile ? n(el,'height')===59 : n(el,'width')===132));
    assert.equal(capital.length,3); assert.equal(liquid.length,3);
    [15,20,30].forEach((amount,i)=>{
      const requirement=Math.max(amount*.5,7.5),scale=mobile ? 532/30 : 10;
      near(n(capital[i],mobile ? 'width':'height'),amount*scale);
      near(n(liquid[i],mobile ? 'width':'height'),requirement*scale);
      if(mobile) near(n(liquid[i],'x'),n(capital[i],'x'));
      else near(n(liquid[i],'y')+n(liquid[i],'height'),n(capital[i],'y')+n(capital[i],'height'));
    });
    assert.ok(copy.includes('180')); assert.ok(copy.includes('S13'));
    assert.ok(copy.includes(lang==='fr' ? 'HYPOTHÉTIQUES' : 'HYPOTHETICAL'));
    assert.ok(copy.includes(lang==='fr' ? 'Montant en dollars non' : mobile ? 'Dollar amount not' : 'Dollar amount not'));
    assert.ok(copy.includes(lang==='fr' ? 'capital et liquidité ne s’additionnent pas' : mobile ? 'do not add capital and liquidity' : 'do not add'));
  }
});

test('the three Circle stages stay ordered and contemplated capabilities stay dashed', () => {
  for (const lang of ['fr','en']) for (const mobile of [false,true]) {
    const tree=get('05-etapes',lang,mobile),all=elements(tree),copy=text(tree);
    const labels=lang==='fr' ? ['30.06.2025','12.12.2025','10.07.2026'] : ['Jun 30, 2025','Dec 12, 2025','Jul 10, 2026'];
    let last=-1;
    for(const label of labels){const position=copy.indexOf(label);assert.ok(position>last,label);last=position;}
    const future=all.filter(el=>tag(el)==='rect'&&attrs(el)['stroke-dasharray']);assert.equal(future.length,1);
    assert.equal(attrs(future[0]).fill,paint('ink'));assert.equal(attrs(future[0]).stroke,paint('amber'));
    assert.ok(copy.includes(lang==='fr' ? 'CAPACITÉS FUTURES ENVISAGÉES' : 'CONTEMPLATED FUTURE CAPABILITIES'));
    assert.ok(copy.includes(lang==='fr' ? 'source intéressée' : 'interested source'));
  }
});

test('both explicitly hypothetical $100 deposit circuits conserve the system total', () => {
  const cases=[[-100,100,0],[-100,0,100]];
  cases.forEach(values=>assert.equal(values.reduce((a,b)=>a+b,0),0));
  for (const lang of ['fr','en']) for (const mobile of [false,true]) {
    const tree=get('06-depots',lang,mobile),all=elements(tree),labels=all.filter(el=>tag(el)==='text').map(text),copy=text(tree);
    const zeros=labels.filter(s=>s.includes(lang==='fr' ? mobile ? 'Variation nette des dépôts : 0' : 'variation nette = 0' : mobile ? 'Net change in deposits: $0' : 'net change = $0'));
    assert.equal(zeros.length,2);assert.equal(labels.filter(s=>s.includes(lang==='fr' ? '−100' : '−$100')).length,2);
    assert.equal(labels.filter(s=>s.includes(lang==='fr' ? '+100' : '+$100')).length,2);
    assert.ok(copy.includes(lang==='fr' ? 'hypothétiques' : 'hypothetical'));
    assert.ok(copy.includes(lang==='fr' ? 'vendeur non bancaire' : 'nonbank seller'));
    assert.ok(copy.includes(lang==='fr' ? 'marché secondaire' : 'secondary market'));
    assert.ok(copy.includes(lang==='fr' ? 'émissions nouvelles' : 'new issuance'));assert.ok(copy.includes('S25'));
  }
});

test('the static component uses the original complete variants, native caption and spacing', () => {
  const component=readFileSync(componentPath,'utf8'), sheet=component.match(/<style>([\s\S]*?)<\/style>/u); assert.ok(sheet);
  const css=postcss.parse(sheet[1]);
  const declarations=(selector,media)=>{const out={};css.walkRules(rule=>{if(rule.selector===selector&&(media ? rule.parent.type==='atrule'&&rule.parent.params===media : rule.parent.type==='root'))rule.walkDecls(d=>{out[d.prop]=d.value;});});return out;};
  const svg=declarations('.occ-crypto-evidence :global(svg)');assert.equal(svg.width,'100%');assert.equal(svg.height,'auto');assert.equal(svg['max-width'],'100%');assert.equal(svg['letter-spacing'],'normal');assert.ok(!svg['max-height']);
  assert.equal(declarations('.occ-crypto-evidence')['padding-bottom'],'.75rem');
  assert.equal(declarations('.occ-crypto-mobile').display,'none');assert.equal(declarations('.occ-crypto-desktop','(max-width: 640px)').display,'none');assert.equal(declarations('.occ-crypto-mobile','(max-width: 640px)').display,'block');
  assert.equal(declarations('.occ-crypto-desktop','print').display,'block');assert.equal(declarations('.occ-crypto-mobile','print').display,'none');
  assert.equal(declarations('figcaption').color,'var(--color-muted)');assert.ok(!declarations('figcaption').font);
  assert.ok(!component.includes('<script'));assert.equal((component.match(/set:html=/gu)??[]).length,2);
  for(const[lang,file]of[['fr','src/content/posts/crypto-banques-occ-icba-agrements-trust-depots.mdx'],['en','src/content/posts-en/crypto-banks-occ-icba-trust-charters-deposits.mdx']]){
    const article=readFileSync(fixture?resolve(fixture,'archive/l0g-crypto-banques-occ-icba-2026',file):file,'utf8');
    assert.equal((article.match(/<OccCryptoFigure /gu)??[]).length,6);
    for(const stem of ['01-decisions','02-frontiere','03-actifs','04-protego','05-etapes','06-depots']) for(const suffix of['','-mobile']) assert.equal(article.split(`${stem}-${lang}${suffix}.svg?raw`).length-1,1);
  }
});
