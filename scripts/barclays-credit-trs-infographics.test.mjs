import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import test from 'node:test';
import postcss from 'postcss';
import { compile } from '@mdx-js/mdx';
import { parseFragment } from 'parse5';
import { assertFontLicenseReferences } from './font-license-assertions.mjs';
import { assertBarclaysCreditTrsConnections, assertBarclaysCreditTrsGeometry, assertBarclaysCreditTrsProportions, assertBarclaysCreditTrsQuantitative, assertBarclaysCreditTrsSourceFaithful, inspectBarclaysCreditTrsSvg, barclaysCreditTrsSourceFigures } from './barclays-credit-trs-svg-assertions.mjs';

const read = p => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');
const paths = ['src/content/posts/barclays-credit-prive-trs-risque.mdx', 'src/content/posts-en/barclays-private-credit-trs-risk.mdx'];
const articles = paths.map(read), figures = articles.map(barclaysCreditTrsSourceFigures);
const cssBase = '/styles/barclays-credit-trs-v1.css';
const cssHref = `${cssBase}?v=${createHash('sha256').update(readFileSync(new URL(`../public${cssBase}`, import.meta.url))).digest('hex').slice(0,12)}`;
const all = node => [node, ...(node.childNodes ?? []).flatMap(all)];
const attrs = node => Object.fromEntries((node.attrs ?? []).map(a => [a.name,a.value]));
const text = node => node.nodeName === '#text' ? node.value : (node.childNodes ?? []).map(text).join('');
const stylesheet = article => assert.deepEqual(all(parseFragment(article)).filter(n => n.tagName === 'link' && attrs(n).rel === 'stylesheet' && (attrs(n).href ?? '').startsWith(cssBase)).map(n => attrs(n).href), [cssHref]);
function references(article) {
  const nodes = all(parseFragment(article)), entries = nodes.filter(n => n.tagName === 'li' && /^source-S[0-9]{2}$/u.test(attrs(n).id ?? ''));
  const ids = entries.map(n => attrs(n).id);
  assert.deepEqual(ids, Array.from({length:16}, (_,i) => `source-S${String(i+1).padStart(2,'0')}`));
  for (const entry of entries) { assert.ok(text(entry).trim().length > 60, 'Every citation retains nonempty bibliographic metadata'); assert.ok(all(entry).some(n => n.tagName === 'a' && /^https:\/\//u.test(attrs(n).href ?? ''))); }
  for (const link of nodes.filter(n => n.tagName === 'a' && (attrs(n).href ?? '').startsWith('#source-'))) assert.ok(ids.includes(attrs(link).href.slice(1)), 'All prose and SVG citations resolve');
}
function mutateAttribute(svg, suffix, name, update) {
  const node = all(parseFragment(svg,{sourceCodeLocationInfo:true})).find(n => (attrs(n).id ?? '').endsWith(suffix)); assert.ok(node);
  const {startOffset,endOffset} = node.sourceCodeLocation.startTag;
  const original = svg.slice(startOffset,endOffset), old = attrs(node)[name]; assert.notEqual(old,undefined);
  const changed = original.replace(` ${name}="${old}"`, ` ${name}="${update(old)}"`); assert.notEqual(changed,original);
  return svg.slice(0,startOffset) + changed + svg.slice(endOffset);
}

test('16 native Barclays scenes retain complete accessible mechanisms, units, sources and compact typography', () => {
  assert.deepEqual(figures.map(f=>f.length),[8,8]);
  for (const [l,article] of articles.entries()) {
    stylesheet(article); references(article);
    assert.equal((article.match(/<figure className="l0g-barclays-figure"/gu) ?? []).length,4);
    for (const [i,svg] of figures[l].entries()) { assertBarclaysCreditTrsSourceFaithful(svg,l?'en':'fr',i); assertBarclaysCreditTrsGeometry(svg); assertBarclaysCreditTrsQuantitative(svg,Math.floor(i/2)+1); assertBarclaysCreditTrsProportions(svg); }
    for (const title of all(parseFragment(article)).filter(n=>n.tagName==='title').map(text)) assert.doesNotMatch(title,/ce qu[ei’']|\bwhat\b|deux swaps, deux|two swaps, two|—/iu);
  }
  const title = JSON.parse(articles[0].split('\n').find(line=>line.startsWith('title: ')).slice(7));
  for (const match of title.matchAll(/:/gu)) assert.ok(['\u00a0','\u202f'].includes(title[match.index-1]), 'French H1 punctuation stays attached');
});

test('independent arithmetic preserves published inputs, gross cushions, all 61 sensitivities and separate default/liquidity cases', () => {
  const assets=[350,350*(1-.1),350*(1-.1)+20]; assert.deepEqual(assets,[350,315,335]); assert.deepEqual(assets.map(a=>a-200),[150,115,135]);
  const rounded=assets.map(a=>Math.round(200/a*1000)/10); assert.deepEqual(rounded,[57.1,63.5,59.7]);
  assert.ok(Math.abs((1-200/(350*.6))*100-100/21)<1e-12); assert.ok(Math.abs((1-200/350)*100-300/7)<1e-12);
  assert.ok(Math.abs((200/.6-315)-55/3)<1e-12);
  let previousTopup=0,previousShortfall=0;
  for(let i=0;i<=60;i++){const a=350*(1-i/100),topup=Math.max(0,(21*i-100)/6),shortfall=Math.max(0,(7*i-300)/2);assert.ok(Math.abs(topup-Math.max(0,200/.6-a))<1e-12);assert.ok(Math.abs(shortfall-Math.max(0,200-a))<1e-12);assert.ok(topup>=previousTopup&&shortfall>=previousShortfall);previousTopup=topup;previousShortfall=shortfall;}
  assert.equal(20-20,0); assert.equal(20-8,12); assert.equal(-20+20,0);
  for(const [i,suffix,key] of [[2,'-cushion-2','height'],[3,'-senior-0','width'],[6,'-unrecovered-claim','width']]) assert.throws(()=>assertBarclaysCreditTrsQuantitative(mutateAttribute(figures[0][i],suffix,key,v=>Number(v)+3),Math.floor(i/2)+1));
  const curve=mutateAttribute(figures[0][4],'-topup-curve','d',d=>d.replace('M 90 580','M 90 579'));
  assert.throws(()=>assertBarclaysCreditTrsQuantitative(curve,3));
});

test('TRS directions, top-up transfer, cash collateral and crossed unpaid claim cannot disappear or be repainted', () => {
  for(const [index,suffix] of [[0,'-performance'],[2,'-top-up'],[6,'-available-collateral']]){
    const svg=figures[0][index],family=Math.floor(index/2)+1;
    assert.throws(()=>assertBarclaysCreditTrsConnections(mutateAttribute(svg,suffix,'stroke',()=> 'none'),family));
    assert.throws(()=>assertBarclaysCreditTrsConnections(mutateAttribute(svg,suffix,'marker-end',()=> 'url(#missing)'),family));
    assert.throws(()=>assertBarclaysCreditTrsConnections(svg.replace('</svg>','<rect x="0" y="0" width="1000" height="800" fill="var(--color-ink)" /></svg>'),family),/cover a connection/u);
  }
  assert.throws(()=>assertBarclaysCreditTrsConnections(mutateAttribute(figures[0][6],'-unpaid-cross-a','x1',v=>Number(v)+2),4));
  assert.throws(()=>assertBarclaysCreditTrsConnections(mutateAttribute(figures[0][6],'-unpaid-claim','stroke-dasharray',()=> '1 1'),4));
  assert.throws(()=>assertBarclaysCreditTrsConnections(mutateAttribute(figures[0][0],'-performance','x1',()=> 800),1));
});

test('internal card and bar bounds, transfer-rail separation, proportions and complete path grammar fail closed', () => {
  const mobile=figures[0][1],desktop=figures[0][0];
  assert.throws(()=>assertBarclaysCreditTrsGeometry(mutateAttribute(mobile,'-loan','height',()=> 30)),/panel/u);
  assert.throws(()=>assertBarclaysCreditTrsGeometry(mutateAttribute(mutateAttribute(desktop,'-performance','y1',()=>247),'-performance','y2',()=>247)),/rail/u);
  assert.throws(()=>assertBarclaysCreditTrsProportions(mobile.replace('viewBox="0 0 600 900"','viewBox="0 0 600 1200"')),/compact/u);
  assert.throws(()=>assertBarclaysCreditTrsProportions(mobile.replace('font-size="28"','font-size="20"')),/legible/u);
  const withPath=d=>desktop.replace('</svg>',`<path d="${d}" fill="none" stroke="var(--color-signal)" /></svg>`);
  assert.doesNotThrow(()=>assertBarclaysCreditTrsGeometry(withPath('M 10 10 L 20 20 H 30 V 30 Z')));
  assert.doesNotThrow(()=>assertBarclaysCreditTrsGeometry(withPath('M+10+10 L20.5.6 H30 V30 Z')));
  for(const d of ['M01000100','M00010002','M 10 10 L 20','M 1e3 10 L 20 20',`M ${'9'.repeat(10000)} 10`,`M 10 10 ${'L 20 20 '.repeat(1024)}`,'M NaN 10','M 10 10 C 20 20 30 30 40 40']) assert.throws(()=>assertBarclaysCreditTrsGeometry(withPath(d)));
});

test('unsafe elements, external resources, JSX attributes and diverted sources are rejected', () => {
  const svg=figures[0][0];
  for(const element of ['<script/>','<foreignObject/>','<image href="https://example.com/x"/>','<animate/>']) assert.throws(()=>inspectBarclaysCreditTrsSvg(svg.replace('</svg>',element+'</svg>')));
  for(const mutate of [s=>s.replace('<svg ','<svg onload="void(0)" '),s=>s.replace('font-size=','fontSize='),s=>s.replace('href="#source-S04"','href="https://example.com/x"'),s=>s.replace('fill="var(--color-ink)"','fill="url(https://example.com/x)"')]) assert.throws(()=>inspectBarclaysCreditTrsSvg(mutate(svg)));
  assert.throws(()=>references(articles[0].replace(/<li id="source-S01">[\s\S]*?<\/li>/u,'<li id="source-S01"></li>')));
});

test('fingerprinted scoped CSS uses one container breakpoint, no clipping and the exact local DejaVu subsets', () => {
  for(const article of articles){stylesheet(article);assert.throws(()=>stylesheet(article.replace(cssHref,cssBase)));assert.throws(()=>stylesheet(article.replace(cssHref,cssBase+'?v=000000000000')));}
  const raw=read('public/styles/barclays-credit-trs-v1.css'),css=postcss.parse(raw),decls=n=>Object.fromEntries(n.nodes.filter(n=>n.type==='decl').map(d=>[d.prop,d.value])),rule=s=>{const n=css.nodes.find(n=>n.type==='rule'&&n.selector===s);assert.ok(n,s);return decls(n)};
  const sizing=rule('.l0g-barclays-figure svg');assert.deepEqual([sizing.width,sizing.height,sizing.overflow],['100%','auto','visible']);
  const figure=rule('.prose figure.l0g-barclays-figure');assert.deepEqual([figure.width,figure['max-width'],figure['container-type'],figure['padding-bottom']],['100%','48rem','inline-size','1rem']);
  assert.equal(rule('.l0g-barclays-figure .l0g-barclays-mobile').width,'100%');
  const gates=css.nodes.filter(n=>n.type==='atrule'&&n.name==='container');assert.equal(gates.length,1);assert.equal(gates[0].params,'(max-width: 480px)');assert.deepEqual(gates[0].nodes.map(n=>[n.selector,decls(n).display]),[['.l0g-barclays-figure .l0g-barclays-mobile','block'],['.l0g-barclays-figure .l0g-barclays-desktop','none']]);
  const h1=rule('article:has(.l0g-barclays-figure) > .post-head .post-title');assert.deepEqual([h1.hyphens,h1['overflow-wrap'],h1['word-break']],['none','normal','normal']);
  const faces=css.nodes.filter(n=>n.type==='atrule'&&n.name==='font-face').map(decls);assert.deepEqual(faces.map(f=>[f['font-family'],f.src,f['font-weight']]),[400,700].map(w=>["'l0g Barclays TRS'",`url('/fonts/barclays-credit-trs/dejavu-sans-${w}.ttf') format('truetype')`,String(w)]));
  css.walkRules(n=>assert.ok(n.selector.split(',').every(s=>s.includes('.l0g-barclays-figure'))));assert.doesNotMatch(raw,/#(?:[a-f0-9]{3}){1,2}\b|@media\s*\(max-width:|overflow\s*:\s*(?:hidden|clip)|(?:clip-path|transform)\s*:/iu);
});

test('font binaries and full canonical licence preserve verified provenance and glyph coverage', () => {
  for(const [weight,hash]of [[400,'795a7767f81ca850eda7566944e1fc330b7d352355d395b4377413a149515dbf'],[700,'8b5aa6c6714b790c61193c27b3864b63a23fd6126c4ca57c990ad5ddda40e413']]){const bytes=readFileSync(new URL(`../public/fonts/barclays-credit-trs/dejavu-sans-${weight}.ttf`,import.meta.url));assert.equal(bytes.readUInt32BE(0),0x00010000);assert.equal(createHash('sha256').update(bytes).digest('hex'),hash);assert.ok(bytes.length<50000);}
  const licence=read('public/fonts/barclays-credit-trs/LICENSE.txt');assert.equal(createHash('sha256').update(licence).digest('hex'),'7ab379f8c3950631080b354d9341028042adbf24c8610192d9aff46d66789ea8');assertFontLicenseReferences(licence,'dejavu');assertFontLicenseReferences(licence.replaceAll('\n','\r\n'),'dejavu');
  const canonical='https://dejavu-fonts.github.io/License.html';for(const replacement of ['https://dejavu-fonts.github.io.evil.example/License.html','https://dejavu-fonts.github.io@evil.example/License.html',canonical+'?x=1',canonical+'#x',canonical+'/suffix',canonical+'\u0000'])assert.throws(()=>assertFontLicenseReferences(licence.replace(canonical,replacement),'dejavu'));
  assert.throws(()=>assertFontLicenseReferences(licence+'\nOfficial licence: '+canonical,'dejavu'));assert.throws(()=>assertFontLicenseReferences(licence.replace('Official licence: '+canonical,''),'dejavu'));
  for(const svg of figures.flat()) assertBarclaysCreditTrsGeometry(svg);
});

test('both final articles compile with native SVG syntax',async()=>{for(const article of articles)await compile(article,{format:'mdx'});});
