import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import test from 'node:test';
import postcss from 'postcss';
import { compile } from '@mdx-js/mdx';
import { parseFragment } from 'parse5';
import { assertFontLicenseReferences } from './font-license-assertions.mjs';
import { assertTsmcPucesElectriciteConnections, assertTsmcPucesElectriciteGeometry, assertTsmcPucesElectriciteProportions, assertTsmcPucesElectriciteQuantitative, assertTsmcPucesElectriciteSourceFaithful, inspectTsmcPucesElectriciteSvg, tsmcPucesElectriciteSourceFigures } from './tsmc-puces-electricite-svg-assertions.mjs';

const read = p => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');
const paths = ['src/content/posts/tsmc-puces-data-centers-risque-electrique.mdx', 'src/content/posts-en/tsmc-chip-demand-data-center-power-risk.mdx'];
const articles = paths.map(read), figures = articles.map(tsmcPucesElectriciteSourceFigures);
const cssBase = '/styles/tsmc-puces-electricite-v1.css';
const cssHref = `${cssBase}?v=${createHash('sha256').update(readFileSync(new URL(`../public${cssBase}`, import.meta.url))).digest('hex').slice(0,12)}`;
const all = node => [node, ...(node.childNodes ?? []).flatMap(all)];
const attrs = node => Object.fromEntries((node.attrs ?? []).map(a => [a.name,a.value]));
const text = node => node.nodeName === '#text' ? node.value : (node.childNodes ?? []).map(text).join('');
const stylesheet = article => assert.deepEqual(all(parseFragment(article)).filter(n => n.tagName === 'link' && attrs(n).rel === 'stylesheet' && (attrs(n).href ?? '').startsWith(cssBase)).map(n => attrs(n).href), [cssHref]);
function references(article) {
  const nodes = all(parseFragment(article)), entries = nodes.filter(n => n.tagName === 'li' && /^source-S[0-9]{2}$/u.test(attrs(n).id ?? ''));
  const ids = entries.map(n => attrs(n).id);
  assert.deepEqual(ids, Array.from({length:15}, (_,i) => `source-S${String(i+1).padStart(2,'0')}`));
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

test('16 native TSMC scenes retain complete accessible mechanisms, units, sources and compact typography', () => {
  assert.deepEqual(figures.map(f=>f.length),[8,8]);
  for (const [l,article] of articles.entries()) {
    stylesheet(article); references(article);
    assert.equal((article.match(/<figure className="l0g-tsmc-figure"/gu) ?? []).length,4);
    for (const [i,svg] of figures[l].entries()) { assertTsmcPucesElectriciteSourceFaithful(svg,l?'en':'fr',i); assertTsmcPucesElectriciteGeometry(svg); assertTsmcPucesElectriciteQuantitative(svg,Math.floor(i/2)+1); assertTsmcPucesElectriciteProportions(svg); }
    for (const title of all(parseFragment(article)).filter(n=>n.tagName==='title').map(text)) assert.doesNotMatch(title,/ce qu[ei’']|\bwhat\b|deux horloges|two clocks|—/iu);
  }
  const title = JSON.parse(articles[0].split('\n').find(line=>line.startsWith('title: ')).slice(7));
  for (const match of title.matchAll(/:/gu)) assert.ok(['\u00a0','\u202f'].includes(title[match.index-1]), 'French H1 punctuation stays attached');
});

test('LBNL scenarios, contract filters and distinct reported power metrics retain reproducible scales', () => {
  assert.equal(843-521,322);assert.ok(521<649&&649<843);assert.equal(11997+9356+32473,53826);assert.equal(13429+19044,32473);
  assert.equal(Math.round(13429/32473*100),41);assert.equal(Math.round(19044/32473*100),59);assert.equal(11997+9356,21353);
  for(const[index,suffix]of [[2,'-estimate-2024'],[2,'-scenario-span'],[4,'-eloa-included'],[4,'-eloa-excluded'],[6,'-active-power'],[6,'-contracted-power']])assert.throws(()=>assertTsmcPucesElectriciteQuantitative(mutateAttribute(figures[0][index],suffix,'width',v=>Number(v)+3),Math.floor(index/2)+1));
  const chart=figures[0][2],axis=all(parseFragment(chart,{sourceCodeLocationInfo:true})).find(n=>n.tagName==='line'&&attrs(n).x1==='240'&&attrs(n).x2==='940'&&attrs(n).y1==='486'&&attrs(n).y2==='486');assert.ok(axis);
  const {startOffset,endOffset}=axis.sourceCodeLocation.startTag;
  assert.throws(()=>assertTsmcPucesElectriciteQuantitative(chart.slice(0,startOffset)+chart.slice(endOffset),2),/common zero/u);
  const split=mutateAttribute(figures[0][0],'-declared-check','d',d=>d.replace(' V 250',' M 627 250'));
  assert.throws(()=>assertTsmcPucesElectriciteQuantitative(split,1),/single subpath/u);assert.throws(()=>assertTsmcPucesElectriciteGeometry(split),/single subpath/u);
});

test('physical supply, power, declared information, conditional upstream risk and backlog conversion stay visible and distinct', () => {
  for(const[index,suffix]of [[0,'-declared-check'],[0,'-risk-to-tsmc'],[0,'-grid-to-cloud'],[2,'-model-0-to-1'],[4,'-forecast-0-to-1'],[6,'-backlog-0-to-1']]){
    const svg=figures[0][index],family=Math.floor(index/2)+1;
    assert.throws(()=>assertTsmcPucesElectriciteConnections(mutateAttribute(svg,suffix,'stroke',()=> 'none'),family));
    assert.throws(()=>assertTsmcPucesElectriciteConnections(mutateAttribute(svg,suffix,'marker-end',()=> 'url(#missing)'),family));
    assert.throws(()=>assertTsmcPucesElectriciteConnections(svg.replace('</svg>','<rect x="0" y="0" width="1000" height="800" fill="var(--color-ink)" /></svg>'),family),/cover a connection/u);
  }
  assert.throws(()=>assertTsmcPucesElectriciteConnections(mutateAttribute(figures[0][0],'-risk-to-tsmc','stroke-dasharray',()=> '1 1'),1));
  assert.throws(()=>assertTsmcPucesElectriciteConnections(mutateAttribute(figures[0][6],'-backlog-0-to-1','stroke-dasharray',()=> '1 1'),4));
});

test('all panel bounds, bar separation, feedback rails, compact typography and complete bounded path grammar fail closed', () => {
  const mobile=figures[0][1],desktop=figures[0][0];
  assert.throws(()=>assertTsmcPucesElectriciteGeometry(mutateAttribute(mobile,'-grid','height',()=>40)),/panel/u);
  const crossed=mutateAttribute(mutateAttribute(desktop,'-circuits-to-gpu','x1',()=>40),'-circuits-to-gpu','x2',()=>200);
  assert.throws(()=>assertTsmcPucesElectriciteGeometry(mutateAttribute(mutateAttribute(crossed,'-circuits-to-gpu','y1',()=>388),'-circuits-to-gpu','y2',()=>388)),/rail/u);
  assert.throws(()=>assertTsmcPucesElectriciteProportions(mobile.replace('viewBox="0 0 600 930"','viewBox="0 0 600 1200"')),/compact/u);
  assert.throws(()=>assertTsmcPucesElectriciteProportions(mobile.replace('font-size="28"','font-size="20"')),/legible/u);
  const withPath=d=>desktop.replace('</svg>',`<path d="${d}" fill="none" stroke="var(--color-signal)" /></svg>`);
  assert.doesNotThrow(()=>assertTsmcPucesElectriciteGeometry(withPath('M 10 10 L 20 20 H 30 V 30 Z')));
  assert.doesNotThrow(()=>assertTsmcPucesElectriciteGeometry(withPath('M+10+10 L20.5.6 H30 V30 Z')));
  for(const d of ['M01000100','M00010002','M 10 10 L 20','M 10 10 M 20 20','M 1e3 10 L 20 20',`M ${'9'.repeat(10000)} 10`,`M 10 10 ${'L 20 20 '.repeat(1024)}`,'M NaN 10','M 10 10 C 20 20 30 30 40 40'])assert.throws(()=>assertTsmcPucesElectriciteGeometry(withPath(d)));
});

test('unsafe elements, external resources, JSX attributes and diverted sources are rejected', () => {
  const svg=figures[0][0];
  for(const element of ['<script/>','<foreignObject/>','<image href="https://example.com/x"/>','<animate/>']) assert.throws(()=>inspectTsmcPucesElectriciteSvg(svg.replace('</svg>',element+'</svg>')));
  for(const mutate of [s=>s.replace('<svg ','<svg onload="void(0)" '),s=>s.replace('font-size=','fontSize='),s=>s.replace('href="#source-S01"','href="https://example.com/x"'),s=>s.replace('fill="var(--color-ink)"','fill="url(https://example.com/x)"')]) assert.throws(()=>inspectTsmcPucesElectriciteSvg(mutate(svg)));
  assert.throws(()=>references(articles[0].replace(/<li id="source-S01">[\s\S]*?<\/li>/u,'<li id="source-S01"></li>')));
});

test('fingerprinted scoped CSS uses one container breakpoint, no clipping and the exact local DejaVu subsets', () => {
  for(const article of articles){stylesheet(article);assert.throws(()=>stylesheet(article.replace(cssHref,cssBase)));assert.throws(()=>stylesheet(article.replace(cssHref,cssBase+'?v=000000000000')));}
  const raw=read('public/styles/tsmc-puces-electricite-v1.css'),css=postcss.parse(raw),decls=n=>Object.fromEntries(n.nodes.filter(n=>n.type==='decl').map(d=>[d.prop,d.value])),rule=s=>{const n=css.nodes.find(n=>n.type==='rule'&&n.selector===s);assert.ok(n,s);return decls(n)};
  const sizing=rule('.l0g-tsmc-figure svg');assert.deepEqual([sizing.width,sizing.height,sizing.overflow],['100%','auto','visible']);
  const figure=rule('.prose figure.l0g-tsmc-figure');assert.deepEqual([figure.width,figure['max-width'],figure['container-type'],figure['padding-bottom']],['100%','48rem','inline-size','1rem']);
  assert.equal(rule('.l0g-tsmc-figure .l0g-tsmc-mobile').width,'100%');
  const gates=css.nodes.filter(n=>n.type==='atrule'&&n.name==='container');assert.equal(gates.length,1);assert.equal(gates[0].params,'(max-width: 480px)');assert.deepEqual(gates[0].nodes.map(n=>[n.selector,decls(n).display]),[['.l0g-tsmc-figure .l0g-tsmc-mobile','block'],['.l0g-tsmc-figure .l0g-tsmc-desktop','none']]);
  const h1=rule('article:has(.l0g-tsmc-figure) > .post-head .post-title');assert.deepEqual([h1.hyphens,h1['overflow-wrap'],h1['word-break']],['none','normal','normal']);
  const faces=css.nodes.filter(n=>n.type==='atrule'&&n.name==='font-face').map(decls);assert.deepEqual(faces.map(f=>[f['font-family'],f.src,f['font-weight']]),[400,700].map(w=>["'l0g TSMC'",`url('/fonts/stablecoins/dejavu-sans-${w}.ttf') format('truetype')`,String(w)]));
  css.walkRules(n=>assert.ok(n.selector.split(',').every(s=>s.includes('.l0g-tsmc-figure'))));assert.doesNotMatch(raw,/#(?:[a-f0-9]{3}){1,2}\b|@media\s*\(max-width:|overflow\s*:\s*(?:hidden|clip)|(?:clip-path|transform)\s*:/iu);
});

test('font binaries and full canonical licence preserve verified provenance and glyph coverage', () => {
  for(const [weight,hash]of [[400,'98f2d74db16bb5f41f74adf6d899aeec92861682cccc58bfdbe4d9d7d0a5ae11'],[700,'21a0350a4ac2a9f22b6a7a8dcaf6abb08c8b546d06499301f1fcf10996fd0df5']]){const bytes=readFileSync(new URL(`../public/fonts/stablecoins/dejavu-sans-${weight}.ttf`,import.meta.url));assert.equal(bytes.readUInt32BE(0),0x00010000);assert.equal(createHash('sha256').update(bytes).digest('hex'),hash);assert.ok(bytes.length<50000);}
  const licence=read('public/fonts/stablecoins/LICENSE.txt');assert.equal(createHash('sha256').update(licence).digest('hex'),'185add2050d6a40596a9a6aa46026e3cf0bd4bfff21ab18acd9cc8eebe18182f');assertFontLicenseReferences(licence,'dejavu');assertFontLicenseReferences(licence.replaceAll('\n','\r\n'),'dejavu');
  const canonical='https://dejavu-fonts.github.io/License.html';for(const replacement of ['https://dejavu-fonts.github.io.evil.example/License.html','https://dejavu-fonts.github.io@evil.example/License.html',canonical+'?x=1',canonical+'#x',canonical+'/suffix',canonical+'\u0000'])assert.throws(()=>assertFontLicenseReferences(licence.replace(canonical,replacement),'dejavu'));
  assert.throws(()=>assertFontLicenseReferences(licence+'\nOfficial licence: '+canonical,'dejavu'));assert.throws(()=>assertFontLicenseReferences(licence.replace('Official licence: '+canonical,''),'dejavu'));
  for(const svg of figures.flat()) assertTsmcPucesElectriciteGeometry(svg);
});

test('both final articles compile with native SVG syntax',async()=>{for(const article of articles)await compile(article,{format:'mdx'});});
