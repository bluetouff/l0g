import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { assertFontLicenseReferences } from './font-license-assertions.mjs';
import test from 'node:test';
import postcss from 'postcss';
import { assertDalianGeometry, assertDalianSourceFaithful, dalianSourceFigures, inspectDalianSvg } from './sk-hynix-dalian-svg-assertions.mjs';
const read=file=>readFileSync(new URL(`../${file}`,import.meta.url),'utf8');
const articles=['posts','posts-en'].map(folder=>read(`src/content/${folder}/sk-hynix-dalian-usine-americaine-financement.mdx`));
const figures=articles.map(dalianSourceFigures);

test('all 24 native Dalian SVG compositions preserve every source coordinate, label and font attribute',()=>{
  assert.deepEqual(figures.map(group=>group.length),[12,12]);
  for(const[i,article]of articles.entries()){
    assert.equal((article.match(/<figure className="l0g-sk-figure"/gu)??[]).length,6);
    assert.match(article,/import '\.\.\/\.\.\/styles\/sk-hynix-dalian-infographics\.css';/u);
    assert.doesNotMatch(article,/<style>|<img[^>]+skhynix/iu);
    for(const[j,svg]of figures[i].entries())assertDalianSourceFaithful(svg,i?'en':'fr',j);
  }
});
test('original DejaVu glyphs stay inside viewBoxes and internal panels',()=>{for(const svg of figures.flat())assertDalianGeometry(svg);});
test('geometry, labels, panels, source paints and active markup regressions fail closed',()=>{
  const svg=figures[0][0];
  for(const replacement of [svg.replace('width="342"','width="343"'),svg.replace('>DALIAN<','>DALIAN altered<'),svg.replace('font-size="22"','font-size="21"')])assert.throws(()=>assertDalianSourceFaithful(replacement,'fr',0));
  for(const payload of ['<script/>','<foreignObject/>','<image href="https://example.com/x"/>'])assert.throws(()=>inspectDalianSvg(svg.replace('</svg>',`${payload}</svg>`)));
  assert.throws(()=>inspectDalianSvg(svg.replace('<svg ','<svg onload="void(0)" ')));
  assert.throws(()=>inspectDalianSvg(svg.replace('fill="var(--color-ink)"','fill="#101b29"')));
  assert.throws(()=>inspectDalianSvg(svg.replace('fill="var(--color-ink)"','fill="url(https://example.com/x)"')));
  assert.throws(()=>assertDalianGeometry(svg.replace('x="139" y="234.0"','x="365" y="234.0"')),/internal panel/u);
  assert.throws(()=>assertDalianGeometry(svg.replace('x="32" y="40"','x="1190" y="40"')),/viewBox/u);
});
test('scoped style inherits semantic themes, preserves fonts and switches complete mobile variants',()=>{
  const raw=read('src/styles/sk-hynix-dalian-infographics.css'),css=postcss.parse(raw),decls=node=>Object.fromEntries(node.nodes.filter(n=>n.type==='decl').map(n=>[n.prop,n.value]));
  const rule=selector=>{const node=css.nodes.find(n=>n.type==='rule'&&n.selector===selector);assert.ok(node,selector);return decls(node);};
  const figure=rule('.prose figure.l0g-sk-figure');
  assert.deepEqual([figure.width,figure['max-width'],figure.overflow,figure['container-type'],figure['padding-bottom']],['100%','48rem','visible','inline-size','1rem']);
  const svg=rule('.l0g-sk-figure svg');assert.deepEqual([svg.width,svg['max-width'],svg.height,svg.overflow],['100%','100%','auto','visible']);
  assert.equal(rule('.l0g-sk-figure .diagram').background,'var(--color-ink)');
  assert.equal(rule('.l0g-sk-figure .sk-mobile')['max-width'],'24rem');
  assert.equal(rule('.l0g-sk-figure svg text')['font-family'],"'l0g Dalian', 'DejaVu Sans', Arial, sans-serif");
  const faces=css.nodes.filter(n=>n.type==='atrule'&&n.name==='font-face').map(decls);
  assert.deepEqual(faces.map(d=>[d['font-family'],d.src,d['font-weight']]),[400,700].map(weight=>["'l0g Dalian'",`url('/fonts/sk-hynix-dalian/dejavu-sans-${weight}.ttf') format('truetype')`,String(weight)]));
  for(const kind of ['media','container']){
    const at=css.nodes.find(n=>n.type==='atrule'&&n.name===kind&&n.params===`(max-width: ${kind==='media'?700:640}px)`);assert.ok(at);
    assert.deepEqual(at.nodes.map(n=>[n.selector,decls(n).display]),[['.l0g-sk-figure .sk-mobile','block'],['.l0g-sk-figure .sk-desktop','none']]);
  }
  assert.doesNotMatch(raw,/#(?:[a-f0-9]{3}){1,2}\b|overflow\s*:\s*(?:hidden|clip)|(?:clip-path|transform)\s*:/iu);
});

test('dedicated local fonts retain the independently checked official subset hashes and full licence',()=>{
  const hashes={400:'dbbdb1b7a6a9ddcce88cd87f5c36d504a18fc4c432120f20e351ef84f35bf49f',700:'4538831f5f71c8c5e29fd0c1aec3ff2c38d88fee59f7d560391c460597d81737'};
  for(const[weight,hash]of Object.entries(hashes)){
    const bytes=readFileSync(new URL(`../public/fonts/sk-hynix-dalian/dejavu-sans-${weight}.ttf`,import.meta.url));
    assert.equal(createHash('sha256').update(bytes).digest('hex'),hash);assert.ok(bytes.length<50000);
  }
  const licence=read('public/fonts/sk-hynix-dalian/LICENSE.txt');assertFontLicenseReferences(licence,'dejavu');
  assert.equal(createHash('sha256').update(licence.slice(licence.indexOf('Fonts are (c) Bitstream'))).digest('hex'),'7a083b136e64d064794c3419751e5c7dd10d2f64c108fe5ba161eae5e5958a93');
});

test('all SVG source anchors use the exact local bibliography ID matching their visible label',()=>{
  for(const[i,group]of figures.entries())for(const[j,svg]of group.entries()){
    assertDalianSourceFaithful(svg,i?'en':'fr',j);
    if(!svg.includes('href="#source-S'))continue;
    const link=svg.match(/href="(#source-S[0-9]+)"/u)[1];
    for(const replacement of [`${link}-suffix`,`${link}?x=1`,`${link}#extra`,'#source-S99','#source-s04','https://example.com/x'])assert.throws(()=>inspectDalianSvg(svg.replace(`href="${link}"`,`href="${replacement}"`)));
  }
});

test('SVG presentation attributes reject JSX camelCase names that Astro emits unchanged into HTML',()=>{
  const svg=figures[0][0];
  for(const[from,to]of Object.entries({'font-size':'fontSize','font-family':'fontFamily','font-weight':'fontWeight','text-anchor':'textAnchor','letter-spacing':'letterSpacing','stroke-width':'strokeWidth','marker-end':'markerEnd'})){
    assert.ok(svg.includes(`${from}=`));
    assert.throws(()=>inspectDalianSvg(svg.replace(`${from}=`,`${to}=`)),/standards-compliant names/u);
  }
});
