import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import test from 'node:test';
import {createProcessor,compile} from '@mdx-js/mdx';
import {parseFragment} from 'parse5';
import postcss from 'postcss';
import {assertFontLicenseReferences} from './font-license-assertions.mjs';
import {msciIndonesiaSvg,MSCI_INDONESIA_KINDS} from '../src/lib/msciIndonesiaFigures.mjs';
import {msciIndonesiaSourceFigures,inspectMsciIndonesiaSvg,assertMsciIndonesiaSourceFaithful,assertMsciIndonesiaGeometry,assertMsciIndonesiaProportions,assertMsciIndonesiaQuantitative,assertMsciIndonesiaConnections,assertMsciIndonesiaArticleReferences} from './msci-indonesia-svg-assertions.mjs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8'),hash=v=>createHash('sha256').update(v).digest('hex');
const articles=['posts/msci-indonesie-flottant-risque-indices','posts-en/msci-indonesia-free-float-index-risk'].map(p=>read('src/content/'+p+'.mdx'));
const scenes=['fr','en'].flatMap(lang=>msciIndonesiaSourceFigures(lang).map((svg,index)=>({lang,index,svg,figure:Math.floor(index/2)+1})));
const all=n=>[n,...(n.childNodes??[]).flatMap(all)],attrs=n=>Object.fromEntries((n.attrs??[]).map(a=>[a.name,a.value]));
function mutate(svg,suffix,name,value){const node=all(parseFragment(svg,{sourceCodeLocationInfo:true})).find(n=>(attrs(n).id??'').endsWith(suffix));assert.ok(node,suffix);const old=attrs(node)[name];assert.notEqual(old,undefined);const{startOffset,endOffset}=node.sourceCodeLocation.startTag,tag=svg.slice(startOffset,endOffset),changed=tag.replace(` ${name}="${old}"`,` ${name}="${typeof value==='function'?value(old):value}"`);assert.notEqual(changed,tag);return svg.slice(0,startOffset)+changed+svg.slice(endOffset);}
const scene=(figure,mobile=false,lang='fr')=>scenes.find(s=>s.figure===figure&&s.lang===lang&&s.index%2===Number(mobile)).svg;

test('20 compact passive native scenes preserve the five sourced mechanisms in both languages',()=>{
 assert.deepEqual(MSCI_INDONESIA_KINDS,['ownership','contraction','selling','transactions','calendar']);assert.equal(scenes.length,20);
 for(const s of scenes){assertMsciIndonesiaSourceFaithful(s.svg,s.lang,s.index);assertMsciIndonesiaGeometry(s.svg);assertMsciIndonesiaQuantitative(s.svg,s.figure);assertMsciIndonesiaProportions(s.svg);}
 for(const lang of [undefined,null,{},new String('fr'),'__proto__'])assert.throws(()=>msciIndonesiaSvg(lang,'ownership'));
 for(const kind of ['concentration','constructor','__proto__',{},undefined])assert.throws(()=>msciIndonesiaSvg('fr',kind));
 for(const mobile of[0,1,'false',null,{}])assert.throws(()=>msciIndonesiaSvg('fr','ownership',mobile));
});

test('numerical and geometric guards independently reproduce comparison scales, baskets and exact date positions',()=>{
 assert.equal(100*10*.3,300);assert.equal(100*8*.3,240);assert.equal(100*10*.2,200);assert.equal(18-9,9);assert.equal(Math.round((53.35581/119.14169-1)*10000)/100,-55.22);assert.equal(Math.round((.43-1.16)*100)/100,-.73);
 for(const[f,id]of [[2,'-cap-0'],[2,'-count-1'],[2,'-weight-0'],[3,'-base-0-1'],[3,'-base-1-1']])assert.throws(()=>assertMsciIndonesiaQuantitative(mutate(scene(f),id,'width',v=>Number(v)+3),f));
 assert.throws(()=>assertMsciIndonesiaQuantitative(mutate(scene(3),'-unit-1-20','stroke','var(--color-line-strong)'),3));
 assert.throws(()=>assertMsciIndonesiaQuantitative(mutate(scene(5),'-idx-a-2028','cx',v=>Number(v)+10),5));
 assert.throws(()=>assertMsciIndonesiaQuantitative(mutate(scene(5,true),'-idx-2029','cy',v=>Number(v)-10),5));
 assert.throws(()=>assertMsciIndonesiaQuantitative(mutate(scene(2),'-cap-axis','x1',v=>Number(v)+10),2));
 assert.throws(()=>assertMsciIndonesiaQuantitative(scene(2).replaceAll('119,14','119,15'),2));
 assert.throws(()=>assertMsciIndonesiaQuantitative(scene(4).replaceAll('IMI 25/50','IMI 50/50'),4));
});

test('ownership links and all ETF transfer directions remain visible and cannot be occluded',()=>{
 for(const mobile of[false,true])for(const f of[1,4]){const svg=scene(f,mobile);assertMsciIndonesiaConnections(svg,f);const id=f===1?'-disclosure-to-owner':'-redeemed-units';for(const[key,val]of[['stroke','none'],['marker-end','url(#missing)']])assert.throws(()=>assertMsciIndonesiaConnections(mutate(svg,id,key,val),f));assert.throws(()=>assertMsciIndonesiaConnections(svg.replace('</svg>',`<rect x="0" y="0" width="${mobile?600:1000}" height="${mobile?930:800}" fill="var(--color-ink)" /></svg>`),f),/cover a relationship/u);}
 assert.throws(()=>assertMsciIndonesiaConnections(mutate(scene(1),'-control-0','stroke-dasharray','1 1'),1));
 assert.throws(()=>assertMsciIndonesiaConnections(mutate(scene(1,true),'-control-0','d',d=>d.replace('H 108','H 300')),1),/declared destination/u);
 assert.throws(()=>assertMsciIndonesiaConnections(mutate(scene(4),'-redemption-assets','x2',900),4));
 assert.throws(()=>assertMsciIndonesiaQuantitative(scene(1).replace('href="#source-s05"','href="#source-s06"'),1));
});

test('internal panel typography, full glyph coverage, bar gutters and compact proportions fail closed',()=>{
 assert.throws(()=>assertMsciIndonesiaGeometry(mutate(scene(1),'-stage-0','height',40)),/panel/u);
 assert.throws(()=>assertMsciIndonesiaGeometry(mutate(scene(3,true),'-case-0','height',250)),/panel/u);
 assert.throws(()=>assertMsciIndonesiaGeometry(scene(2).replace('x="42" y="370"','x="9999" y="370"')));
 assert.throws(()=>assertMsciIndonesiaProportions(scene(1,true).replace('600 930','600 1200')),/compact/u);
 assert.throws(()=>inspectMsciIndonesiaSvg(scene(1).replace('font-size="28"','font-size="20"')));
 for(const s of scenes)assertMsciIndonesiaGeometry(s.svg);
});

test('bounded deterministic path grammar rejects joined numeric tokens, malformed paths and repeated subpaths',()=>{
 const svg=scene(1),withPath=d=>svg.replace('</svg>',`<path id="msci-fr-f1-d-test" d="${d}" fill="none" stroke="var(--color-signal)" /></svg>`);
 assert.doesNotThrow(()=>assertMsciIndonesiaGeometry(withPath('M 10 10 L 20 20 H 30 V 30 Z')));
 assert.doesNotThrow(()=>assertMsciIndonesiaGeometry(withPath('M+10+10 L20.5.6 H30 V30 Z')));
 for(const d of['M01000100','M00010002','M 10 10 L 20','M 10 10 M 20 20','M 1e3 10 L 20 20','M 10 10 C 20 20 30 30 40 40','M NaN 10','M 10 10 '+ 'L 20 20 '.repeat(1024)])assert.throws(()=>assertMsciIndonesiaGeometry(withPath(d)));
 const code=`import{assertMsciIndonesiaGeometry as check}from'./scripts/msci-indonesia-svg-assertions.mjs';import{msciIndonesiaSvg}from'./src/lib/msciIndonesiaFigures.mjs';const s=msciIndonesiaSvg('fr','ownership');let rejected=false;try{check(s.replace('</svg>','<path id="msci-fr-f1-d-test" d="M '+ '9'.repeat(10000)+' 10" fill="none" stroke="var(--color-signal)" /></svg>'))}catch{rejected=true}if(!rejected)process.exit(1);`;
 execFileSync(process.execPath,['--input-type=module','-e',code],{cwd:new URL('../',import.meta.url),timeout:3000,stdio:'pipe'});
});

test('passive validation and complete source pins reject active nodes, unsafe resources and changed text or child order',()=>{
 const s=scene(1);for(const element of['<script/>','<foreignObject/>','<image href="https://example.com/x"/>','<animate/>'])assert.throws(()=>inspectMsciIndonesiaSvg(s.replace('</svg>',element+'</svg>')));
 for(const mutation of[x=>x.replace('<svg ','<svg onload="void(0)" '),x=>x.replace('font-size=','fontSize='),x=>x.replace('href="#source-s05"','href="https://example.com/x"'),x=>x.replace('font-family="l0g MSCI Indonesia"','font-family="Arial"'),x=>x.replace('fill="var(--color-ink)"','fill="url(https://example.com/x)"'),x=>x.replace('CUAN','CUAA')])assert.throws(()=>assertMsciIndonesiaSourceFaithful(mutation(s),'fr',0));
});

test('scoped Astro CSS uses one container breakpoint, responsive native roots and the licensed local font metrics',()=>{
 const source=read('src/components/MsciIndonesiaFigure.astro'),css=postcss.parse(source.slice(source.indexOf('<style>')+7,source.lastIndexOf('</style>'))),decls=n=>Object.fromEntries(n.nodes.filter(n=>n.type==='decl').map(d=>[d.prop,d.value])),rule=s=>{const n=css.nodes.find(n=>n.type==='rule'&&n.selector===s);assert.ok(n,s);return decls(n)};
 const root=rule('.msci-indonesia-figure'),svg=rule('.msci-indonesia-figure :global(svg)');assert.deepEqual([root.width,root['max-width'],root['container-type'],root['padding-bottom'],root.overflow],['100%','48rem','inline-size','1rem','visible']);assert.deepEqual([svg.width,svg.height,svg.overflow],['100%','auto','visible']);
 const gates=css.nodes.filter(n=>n.type==='atrule'&&n.name==='container');assert.equal(gates.length,1);assert.equal(gates[0].params,'(max-width: 480px)');assert.deepEqual(gates[0].nodes.map(n=>[n.selector,decls(n).display]),[['.msci-indonesia-desktop','none'],['.msci-indonesia-mobile','block']]);
 assert.equal(rule('.msci-indonesia-mobile').width,'100%');assert.equal(rule('.msci-indonesia-mobile')['max-width'],undefined);assert.doesNotMatch(source,/@media\s*\(max-width:|overflow\s*:\s*(?:hidden|clip)|clip-path|transform\s*:/iu);
 const h1=rule(':global(article:has(.msci-indonesia-figure) > .post-head .post-title)');assert.deepEqual([h1.hyphens,h1['overflow-wrap'],h1['word-break']],['none','normal','normal']);
 const faces=css.nodes.filter(n=>n.type==='atrule'&&n.name==='font-face').map(decls);assert.deepEqual(faces.map(f=>[f['font-family'],f.src,f['font-weight']]),[400,700].map(w=>["'l0g MSCI Indonesia'",`url('/fonts/stablecoins/dejavu-sans-${w}.ttf') format('truetype')`,String(w)]));
 assert.equal((source.match(/set:html=/gu)??[]).length,2);assert.match(source,/set:html=\{responsiveSvg\(false\)\}/u);assert.match(source,/set:html=\{responsiveSvg\(true\)\}/u);assert.match(source,/<slot \/>/u);assert.doesNotMatch(source,/<script|client:|fetch\(|innerHTML/u);
});

test('font binaries and complete canonical licence preserve verified provenance',()=>{
 for(const[w,expected]of[[400,'98f2d74db16bb5f41f74adf6d899aeec92861682cccc58bfdbe4d9d7d0a5ae11'],[700,'21a0350a4ac2a9f22b6a7a8dcaf6abb08c8b546d06499301f1fcf10996fd0df5']]){const b=readFileSync(new URL(`../public/fonts/stablecoins/dejavu-sans-${w}.ttf`,import.meta.url));assert.equal(hash(b),expected);assert.equal(b.readUInt32BE(0),0x00010000);}
 const licence=read('public/fonts/stablecoins/LICENSE.txt'),url='https://dejavu-fonts.github.io/License.html';assert.equal(hash(licence),'185add2050d6a40596a9a6aa46026e3cf0bd4bfff21ab18acd9cc8eebe18182f');for(const input of[licence,licence.replaceAll('\n','\r\n')])assertFontLicenseReferences(input,'dejavu');
 for(const value of['https://dejavu-fonts.github.io.evil.example/License.html','https://dejavu-fonts.github.io@evil.example/License.html',url+'?x=1',url+'#x',url+'/suffix',url+'\u0000'])assert.throws(()=>assertFontLicenseReferences(licence.replace(url,value),'dejavu'));
 assert.throws(()=>assertFontLicenseReferences(licence+'\nOfficial licence: '+url,'dejavu'));assert.throws(()=>assertFontLicenseReferences(licence.replace('Official licence: '+url,''),'dejavu'));assert.throws(()=>assertFontLicenseReferences(licence.replace('Official licence: '+url,'Official licence: '+url+'\rX'),'dejavu'));
});

test('both articles retain five ordered component figures, full methods and all 19 nonempty common source records',async()=>{
 const sourceSets=['05 06 07 08 09','02','05 16','01 02 12 13 14 15 18','01 02 08'],walk=n=>[n,...(n.children??[]).flatMap(walk)];
 for(const [i,article]of articles.entries()){assertMsciIndonesiaArticleReferences(article);const tree=createProcessor().parse(article.replace(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/u,'')),figures=walk(tree).filter(n=>n.name==='MsciIndonesiaFigure');assert.equal(figures.length,5);
  for(const[j,fig]of figures.entries()){const a=Object.fromEntries(fig.attributes.map(a=>{assert.equal(a.type,'mdxJsxAttribute');assert.equal(typeof a.value,'string');return[a.name,a.value]}));assert.deepEqual(Object.keys(a).sort(),['caption','kind','lang','number','sources']);assert.equal(a.kind,MSCI_INDONESIA_KINDS[j]);assert.equal(a.lang,i?'en':'fr');assert.equal(a.number,String(j+1).padStart(2,'0'));assert.equal(a.sources,sourceSets[j]);assert.ok(a.caption.trim().length>25);assert.equal(walk(fig).filter(n=>n.name==='details').length,1);assert.equal(walk(fig).filter(n=>n.name==='summary').length,1);}
  const entries=all(parseFragment(article,{sourceCodeLocationInfo:true})).filter(n=>n.tagName==='li'&&attrs(n).id==='source-s01');assert.equal(entries.length,1);const loc=entries[0].sourceCodeLocation;assert.throws(()=>assertMsciIndonesiaArticleReferences(article.slice(0,loc.startOffset)+'<li id="source-s01"></li>'+article.slice(loc.endOffset)));
  await compile(article.replace(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/u,''),{format:'mdx'});
 }
 for(const{svg}of scenes){const texts=all(parseFragment(svg)).filter(n=>n.tagName==='title').map(n=>(n.childNodes??[]).map(n=>n.value??'').join(''));for(const t of texts)assert.doesNotMatch(t,/\b(?:ce que|ce qui|what|deux horloges|two clocks)\b|—|, (?:pas|not) /iu);}
});
