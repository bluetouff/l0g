import assert from 'node:assert/strict';
import test from 'node:test';
import {execFileSync} from 'node:child_process';
import {readFileSync,readdirSync,existsSync,statSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {dirname,join,relative,resolve} from 'node:path';
import {XMLParser,XMLValidator} from 'fast-xml-parser';
import {fromHtml} from 'hast-util-from-html';
import {toText} from 'hast-util-to-text';
import {unified} from 'unified';
import remarkParse from 'remark-parse';
import remarkMdx from 'remark-mdx';
import remarkGfm from 'remark-gfm';
import {parseFrontmatter} from '@astrojs/markdown-remark';
import postcss from 'postcss';
import valueParser from 'postcss-value-parser';
import sharp from 'sharp';
import {cyberRecoveryEditions} from '../src/config/cyber-recovery-publication.mjs';
import {assertCyberContentModel,assertCyberPassiveTree,assertCyberLink,bakeCyberSvg,cyberArticleSource,cyberFigureSpecs,cyberFontFiles,renderCyberArticle,prepareCyberReading,generateCyberRecoveryEpub} from './generate-cyber-recovery-epub.mjs';
const ROOT=resolve(new URL('..',import.meta.url).pathname),SITE='https://l0g.fr';
const files=dir=>readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(join(dir,e.name)):[join(dir,e.name)]);
const nodes=n=>[n,...(n.children??[]).flatMap(nodes)];
const plain=n=>toText(n).replace(/\s+/gu,' ').trim();
const sourceText=n=>{
  if(['text','inlineCode','code'].includes(n.type))return n.value;
  const value=(n.children??[]).map(sourceText).join('');
  // Preserve inline adjacency (e.g. emphasis followed by punctuation), while
  // separating actual blocks such as summary and method paragraphs.
  return ['paragraph','heading','tableCell'].includes(n.type)||['p','li','summary','details'].includes(n.name)?` ${value} `:value;
};
const ast=unified().use(remarkParse).use(remarkGfm).use(remarkMdx);
const sourceCounts=[21,20,18,17,18,19,23,15];
const heights=[[1500,1430,1720,1430],[1510,1700,1780,1900],[1260,1370,1410,1590],[1350,1570,1520,1510],[1680,1590,1870,1790],[1670,1810,1850,1750],[2010,2070,2230,1930],[2180,2120,2250,2170]];
const digest=v=>createHash('sha256').update(v).digest('hex');
const xmlTree=source=>{
  const convert=entries=>entries.flatMap(entry=>Object.entries(entry).filter(([k])=>k!==':@').map(([tag,value])=>tag==='#text'?{type:'text',value:String(value)}:{type:'element',tagName:tag,children:Array.isArray(value)?convert(value):[]}));
  return {type:'root',children:convert(new XMLParser({preserveOrder:true,ignoreAttributes:false}).parse(source))};
};
// Every non-presentation property, text node and node order must be unchanged.
// Opacity is checked separately against the component-specific dark contract.
const structural=svg=>nodes(fromHtml(svg,{fragment:true})).filter(n=>n.type==='element'&&n.tagName!=='style').map(n=>({tag:n.tagName,properties:Object.fromEntries(Object.entries(n.properties??{}).filter(([k])=>!['fill','stroke','stopColor','style','href','opacity','stopOpacity'].includes(k))),text:(n.children??[]).filter(c=>c.type==='text').map(c=>c.value).join('')}));
function assertOpacity(source,baked,chapter){
  const original=nodes(fromHtml(source,{fragment:true})).filter(n=>n.type==='element'),actual=nodes(fromHtml(baked,{fragment:true})).filter(n=>n.type==='element'&&n.tagName!=='style');
  assert.equal(original.length,actual.length);
  // Rebuild the map from the same parsed object array, preserving exact parents.
  const tree=fromHtml(source,{fragment:true}),ordered=nodes(tree).filter(n=>n.type==='element'),parents=new Map();const walk=n=>{for(const c of n.children??[]){parents.set(c,n);walk(c);}};walk(tree);
  for(const [i,n]of ordered.entries()){
    let opacity=n.properties.opacity,stopOpacity=n.properties.stopOpacity;const p=parents.get(n),id=String(p?.properties?.id??'');
    if(n.tagName==='path'&&p?.tagName==='pattern'&&opacity==='0.36'){
      if(chapter>=4&&id.endsWith('-hatch-quiet'))opacity='0.12';
      if(chapter===6&&id.endsWith('-02-hatch-teal'))opacity='0.08';
      if(chapter===7&&id.endsWith('-03-hatch-teal'))opacity='0.35';
      if(chapter===8&&id.endsWith('-02-hatch-blue'))opacity='0.12';
    }
    if(n.tagName==='stop'&&p?.tagName==='linearGradient'){
      if(chapter===5&&id.endsWith('-01-teal-fade')&&stopOpacity==='0.18')stopOpacity='0.10';
      if(chapter===8&&id.endsWith('-02-tealfade')&&stopOpacity==='0.17')stopOpacity='0.12';
    }
    assert.equal(actual[i].properties.opacity,opacity,`${chapter}: opacity ${id}`);assert.equal(actual[i].properties.stopOpacity,stopOpacity,`${chapter}: stop ${id}`);
  }
}
for(const book of Object.values(cyberRecoveryEditions)){
  const SOURCE=join(ROOT,'src/epub',book.directory),EPUB=join(ROOT,'public',book.epub);
  test(`${book.lang}: all eight MDX bodies, 151 source notices and complete methodological details survive`,async()=>{
    let notices=0,figureCount=0;
    for(const chapter of book.chapters){
      const source=cyberArticleSource(chapter,book.lang),expected=nodes(ast.parse(parseFrontmatter(source).content)),rendered=await renderCyberArticle(source,chapter);
      const actual=fromHtml(readFileSync(join(SOURCE,'EPUB/text',chapter.chapter),'utf8')),all=nodes(actual),copy=plain(actual);
      for(const n of expected.filter(n=>['paragraph','tableCell','heading','code'].includes(n.type)||['p','summary','li'].includes(n.name))){
        const value=sourceText(n).replace(/\s+/gu,' ').trim();if(value)assert.ok(copy.includes(value),`${chapter.slug}: lost prose: ${value.slice(0,140)}`);
      }
      for(const n of expected.filter(n=>n.type.startsWith('mdxJsx'))){
        const get=name=>n.attributes.find(a=>a.name===name)?.value;
        if(get('caption'))assert.ok(copy.includes(get('caption')),'Exact caption');
        if(get('id'))assert.ok(all.some(a=>a.properties?.id===`c${chapter.number}-${get('id')}`),'Renamed source ID');
        if(get('href')?.startsWith('https://')&&new URL(get('href')).origin!==SITE)assert.ok(all.some(a=>a.properties?.href===get('href')),'Exact JSX source URL');
      }
      for(const n of expected.filter(n=>n.type==='link'&&/^https?:/u.test(n.url)&&new URL(n.url).origin!==SITE))assert.ok(all.some(a=>a.properties?.href===n.url),`Exact Markdown source URL ${n.url}`);
      const ids=all.map(n=>n.properties?.id).filter(Boolean),refs=ids.filter(id=>new RegExp(`^c${chapter.number}-source-\\d{2}$`,'u').test(id));
      assert.equal(refs.length,sourceCounts[chapter.number-1]);notices+=refs.length;
      assert.equal(ids.length,new Set(ids).size);assert.equal(all.filter(n=>n.tagName==='h1').length,1);
      assert.equal(all.filter(n=>n.tagName==='figure'&&n.properties.className?.includes('infographic')).length,4);
      assert.equal(all.filter(n=>['details','summary','script','aside'].includes(n.tagName)).length,0);
      assert.equal(rendered.attachments.length,4);figureCount+=4;
    }
    assert.equal(notices,151);assert.equal(figureCount,32);
  });
  test(`${book.lang}: 32 offline SVGs retain production geometry, glyphs, data, fonts and dark paint limits`,async()=>{
    let offset=0;
    for(const chapter of book.chapters){
      const rendered=await renderCyberArticle(cyberArticleSource(chapter,book.lang),chapter,offset);offset=rendered.next;
      for(const [index,a]of rendered.attachments.entries()){
        assert.equal(XMLValidator.validate(a.svg),true);assert.deepEqual(structural(a.svg),structural(a.original));assertOpacity(a.original,a.svg,chapter.number);
        assert.equal(readFileSync(join(SOURCE,'EPUB/media',a.name),'utf8'),a.svg);
        const tree=fromHtml(a.svg,{fragment:true}),all=nodes(tree),root=all.find(n=>n.tagName==='svg');
        assert.equal(root.properties.viewBox,`0 0 1000 ${heights[chapter.number-1][index]}`);
        const styles=all.filter(n=>n.tagName==='style');assert.equal(styles.length,1);
        const css=postcss.parse(toText(styles[0]));assert.equal(css.nodes.length,2);
        for(const [i,face]of css.nodes.entries()){
          assert.equal(face.type,'atrule');assert.equal(face.name,'font-face');const props=Object.fromEntries(face.nodes.map(n=>[n.prop,n.value]));
          assert.equal(props['font-family'],`"${cyberFontFiles[i].family}"`);assert.equal(props['font-weight'],cyberFontFiles[i].weight);
          const match=/^url\(data:font\/woff2;base64,([A-Za-z0-9+/=]+)\) format\("woff2"\)$/u.exec(props.src);assert.ok(match);
          assert.deepEqual(Buffer.from(match[1],'base64'),readFileSync(join(ROOT,cyberFontFiles[i].source)));
        }
        assert.doesNotMatch(a.svg,/<(?:script|foreignObject|image|animate|set)\b|\son\w+=|javascript:|@import|var\(|color-mix\(/iu);
      }
    }
    assert.equal(offset,32);
  });
  test(`${book.lang}: EPUB ZIP, manifest, offline targets, metadata, provenance and licences agree`,()=>{
    assert.ok(existsSync(EPUB),'EPUB must be built before this test');
    const entries=execFileSync('unzip',['-Z1',EPUB],{encoding:'utf8'}).trim().split('\n');
    assert.equal(entries[0],'mimetype');assert.equal(execFileSync('unzip',['-p',EPUB,'mimetype'],{encoding:'utf8'}),'application/epub+zip');
    assert.match(execFileSync('unzip',['-lv',EPUB],{encoding:'utf8'}).split('\n').find(l=>/\bmimetype$/u.test(l)),/Stored/u);
    assert.deepEqual([...entries].sort(),files(SOURCE).map(f=>relative(SOURCE,f)).sort());
    for(const file of files(SOURCE))assert.deepEqual(execFileSync('unzip',['-p',EPUB,relative(SOURCE,file)]),readFileSync(file));
    const parser=new XMLParser({ignoreAttributes:false,parseTagValue:false}),opf=parser.parse(readFileSync(join(SOURCE,'EPUB/content.opf'),'utf8')).package;
    assert.equal(opf['@_version'],'3.0');assert.equal(opf.metadata['dc:identifier']['#text'],book.id);assert.equal(opf.metadata['dc:title'],book.title);assert.equal(opf.metadata['dc:language'],book.lang);assert.equal(opf.metadata['dc:date'],book.date);assert.equal(opf.metadata['dc:description'],book.description);
    assert.equal(opf.metadata.meta.find(m=>m['@_property']==='dcterms:modified')['#text'],book.modified);
    const items=opf.manifest.item,manifestFiles=new Set(items.map(i=>i['@_href']));
    assert.equal(items.length,new Set(items.map(i=>i['@_id'])).size);assert.equal(items.filter(i=>i['@_media-type']==='image/svg+xml').length,32);
    assert.equal(items.filter(i=>i['@_media-type']==='font/woff2').length,2);assert.equal(opf.spine.itemref.filter(i=>i['@_linear']==='no').length,32);
    assert.equal(opf.spine.itemref.filter(i=>i['@_linear']!=='no').length,21);
    for(const f of files(join(SOURCE,'EPUB')))if(!f.endsWith('/content.opf'))assert.ok(manifestFiles.has(relative(join(SOURCE,'EPUB'),f)),`Unmanifested ${f}`);
    const spine=opf.spine.itemref.map(r=>{const item=items.find(i=>i['@_id']===r['@_idref']);assert.ok(item);return item['@_href'];});
    const nav=nodes(fromHtml(readFileSync(join(SOURCE,'EPUB/nav.xhtml'),'utf8'))).find(n=>n.tagName==='nav'&&n.properties.id==='toc');
    const positions=nodes(nav).filter(n=>n.tagName==='a').map(n=>spine.indexOf(n.properties.href.split('#')[0]));assert.ok(positions.every((p,i)=>p>=0&&(!i||p>=positions[i-1])));
    for(const file of files(SOURCE).filter(f=>/\.(?:xhtml|xml|opf|ncx|svg)$/u.test(f))){
      const raw=readFileSync(file,'utf8');assert.equal(XMLValidator.validate(raw),true,file);if(file.endsWith('.xhtml'))assertCyberContentModel(xmlTree(raw));
      const visit=n=>{if(!n||typeof n!=='object')return;for(const[k,v]of Object.entries(n)){
        if(['@_href','@_src','@_full-path'].includes(k)&&! /^(?:https?:|mailto:)/u.test(v)){
          const [name,fragment]=String(v).split('#'),target=name?resolve(k==='@_full-path'?SOURCE:dirname(file),decodeURIComponent(name)):file;
          assert.ok(target.startsWith(SOURCE+'/')&&existsSync(target),`Unresolved ${file}: ${v}`);
          if(fragment)assert.ok(nodes(fromHtml(readFileSync(target,'utf8'))).some(a=>a.properties?.id===decodeURIComponent(fragment)),`Missing fragment ${v}`);
          if(k==='@_href'&&file.endsWith('.xhtml')&&target.endsWith('.svg'))assert.ok(spine.includes(relative(join(SOURCE,'EPUB'),target)));
        }
        if(k==='@_src')assert.doesNotMatch(String(v),/^(?:https?:|data:|\/\/)/u);visit(v);
      }};visit(parser.parse(raw));assert.doesNotMatch(raw,/<(?:script|iframe|object|embed|foreignObject|form|input|audio|video)\b|\son\w+=|javascript:|@import/iu);
    }
    const colophon=plain(fromHtml(readFileSync(join(SOURCE,'EPUB/text/colophon.xhtml'),'utf8')));
    for(const edition of Object.values(cyberRecoveryEditions))for(const c of edition.chapters)assert.ok(colophon.includes(digest(cyberArticleSource(c,edition.lang))),'All sixteen source digests');
    for(const f of cyberFontFiles){assert.deepEqual(readFileSync(join(SOURCE,'EPUB/fonts',f.name)),readFileSync(join(ROOT,f.source)));assert.deepEqual(readFileSync(join(SOURCE,'EPUB/fonts',f.license)),readFileSync(join(ROOT,'public/fonts/jlr',f.license)));}
    for(const [filename,values]of [['ch001.xhtml',book.introduction],['conclusion.xhtml',book.conclusion],['method.xhtml',book.method],['reader-guide.xhtml',book.readerGuide]]){const body=plain(fromHtml(readFileSync(join(SOURCE,'EPUB/text',filename),'utf8')));for(const value of values)assert.ok(body.includes(value));}
    assert.ok(statSync(EPUB).size<12_000_000);
  });
  test(`${book.lang}: parser fails closed on code, imports, unexpected attributes and active HTML`,async()=>{
    const chapter=book.chapters[0],original=cyberArticleSource(chapter,book.lang),component=cyberFigureSpecs[0][0];
    await assert.rejects(renderCyberArticle(original,{...chapter}),/Unconfigured/u);
    for(const payload of ['\nimport fs from "node:fs";','\nexport const x=1;','\n{process.exit()}','\n<div {...x}/>','\n<script>alert(1)</script>','\n<img src="https://example.com/x"/>','\n<style>@import "https://example.com/x";</style>','\n<p style="display:none">x</p>','\n<a href="java&#x73;cript:alert(1)">x</a>','\n<a href="//evil.example/x">x</a>','\n<OtherFigure/>','\n## Ce qui change','\n## What remains'])await assert.rejects(renderCyberArticle(original+payload,chapter),payload);
    for(const replacement of ['kind={"circuit"}','kind="circuit" {...evil}','kind="invented"'])await assert.rejects(renderCyberArticle(original.replace('kind="circuit"',replacement),chapter));
    await assert.rejects(renderCyberArticle(original.replace(`../../components/${component}.astro`,'../../components/Other.astro'),chapter));
    await assert.rejects(renderCyberArticle(original.replace(/^updatedDate:.*$/mu,'updatedDate: "2099-01-01T00:00:00Z"'),chapter),/predates/u);
    if(book.lang==='en')await assert.rejects(renderCyberArticle(original.replace(/^sourceUpdatedDate:.*$/mu,'sourceUpdatedDate: "2020-01-01T00:00:00Z"'),chapter),/version drift/u);
  });
  test(`${book.lang}: dark reader styles and cover variants preserve responsive dimensions`,async()=>{
    const cover=await sharp(join(ROOT,'public',book.cover)).metadata();assert.equal(cover.width,1024);assert.equal(cover.height,1638);
    for(const width of [320,640,960])assert.equal((await sharp(join(ROOT,'public',book.cover.replace('.jpg',`-${width}.webp`))).metadata()).width,width);
    assert.deepEqual(readFileSync(join(SOURCE,'EPUB/media/cover.jpg')),readFileSync(join(ROOT,'public',book.cover)));
    const css=postcss.parse(readFileSync(join(SOURCE,'EPUB/styles/stylesheet1.css'),'utf8'));
    css.walkAtRules(rule=>assert.notEqual(rule.name,'import'));css.walkDecls(decl=>{
      if(decl.prop==='overflow')assert.notEqual(decl.value,'hidden');
      const parsed=valueParser(decl.value);parsed.walk(n=>{if(n.type==='function'&&n.value==='url')assert.match(valueParser.stringify(n.nodes),/^\.\.\/fonts\/(?:inter|jetbrains-mono)\.woff2$/u);});
    });
    assert.match(css.toString(),/html,body\{background:#0c0d10;color:#e7e9ee/u);assert.match(css.toString(),/\.infographic-image\{[^}]*width:100%;height:auto/u);
  });
}
test('SVG baker rejects active markup, remote resources, unknown paints, duplicate IDs and foreign CSS',()=>{
  const original=cyberFigureSpecs[0][1]('fr','circuit');
  for(const payload of ['<script/>','<foreignObject/>','<image href="https://evil.example/x"/>','<style>@import "https://evil.example/x";</style>','<animate/>','<set/>'])assert.throws(()=>bakeCyberSvg(original.replace('</svg>',payload+'</svg>'),1));
  for(const fill of ['var(--unknown)','url(https://evil.example/x)','url(#missing)','javascript:alert(1)','#ffffff'])assert.throws(()=>bakeCyberSvg(original.replace('fill="#5eead4"',`fill="${fill}"`),1));
  assert.throws(()=>bakeCyberSvg(original.replace('<rect ','<rect onload="x" '),1));assert.throws(()=>bakeCyberSvg(original.replace('</svg>',''),1));
  assert.throws(()=>bakeCyberSvg(original.replace('</svg>','<g id="fr-jlr-f1-title"/></svg>'),1));
  assert.throws(()=>bakeCyberSvg(original.replace('href="#source-06"','href="https://evil.example/x"'),1));
});
test('link validation rejects execution, ambiguous authorities and hidden controls',()=>{
  for(const href of ['javascript:alert(1)','data:text/html,x','file:///etc/passwd','//evil.example','https://user:pass@example.com/a','https:\\evil.example/x','https://example.com/\nx',' #source-01','#'])assert.throws(()=>assertCyberLink(href));
  for(const href of ['https://example.com/a.pdf?VersionId=x.y_2','mailto:editor@example.com','#source-01','/glossaire/rto/'])assert.doesNotThrow(()=>assertCyberLink(href));
});
test('offline chapter fragments fail closed and valid cross-chapter links remain navigable',async()=>{
  const book=cyberRecoveryEditions.fr,rendered=[];for(const chapter of book.chapters)rendered.push({...await renderCyberArticle(cyberArticleSource(chapter,'fr'),chapter),chapter});
  const routes=new Map(rendered.map(r=>[r.chapter.route,r])),glossary=new Map(book.glossary.map(g=>[g.path,g.slug]));
  const chapter=book.chapters[0],source=cyberArticleSource(chapter,'fr');
  const bad=await renderCyberArticle(source+'\n\n[broken](#missing-fragment)',chapter);assert.throws(()=>prepareCyberReading(bad,chapter,routes,glossary),/Unresolved/u);
  const other=book.chapters[1],good=await renderCyberArticle(source+`\n\n[chapter](${other.route}#source-01)`,chapter);assert.match(prepareCyberReading(good,chapter,routes,glossary),/href="ch003.xhtml#c2-source-01"/u);
  const relative=await renderCyberArticle(source+'\n\n[relative](../../../elsewhere/)',chapter);assert.match(prepareCyberReading(relative,chapter,routes,glossary),/href="https:\/\/l0g.fr\/elsewhere\/"/u);
});
test('content model and passive tree reject malformed structures without browser repairs',()=>{
  for(const html of ['<p><section>Note</section></p>','<ol><p>x</p><li>Source</li></ol>','<figure><div>x</div><figcaption>Caption</figcaption><section>Method</section></figure>'])assert.throws(()=>assertCyberContentModel(xmlTree(html)));
  for(const html of ['<iframe src="x"/>','<p onclick="x">x</p>','<img src="https://evil.example/pixel"/>'])assert.throws(()=>assertCyberPassiveTree(fromHtml(html,{fragment:true})));
});
test('two fixed dark editions remain distinct, complete and integrated into existing commands',async()=>{
  assert.notEqual(cyberRecoveryEditions.fr.id,cyberRecoveryEditions.en.id);assert.deepEqual(Object.values(cyberRecoveryEditions).map(b=>b.theme),['dark','dark']);
  await assert.rejects(generateCyberRecoveryEpub('../outside'),/Unsupported/u);
  const pkg=JSON.parse(readFileSync(join(ROOT,'package.json'),'utf8'));
  assert.equal(pkg.scripts['build:epub'],'node scripts/derived-assets.mjs epub');
  assert.ok(pkg.scripts['build:epub:generate'].includes('node scripts/generate-cyber-recovery-epub.mjs'));assert.ok(pkg.scripts['test:epub'].includes('scripts/cyber-recovery-epub.test.mjs'));
  for(const book of Object.values(cyberRecoveryEditions))assert.equal(book.chapters.reduce((sum,c)=>sum+c.figureCount,0),32);
});
