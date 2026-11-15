import assert from 'node:assert/strict';
import test from 'node:test';
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join, relative, resolve } from 'node:path';
import { XMLParser, XMLValidator } from 'fast-xml-parser';
import { fromHtml } from 'hast-util-from-html';
import { toText } from 'hast-util-to-text';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkMdx from 'remark-mdx';
import remarkGfm from 'remark-gfm';
import { parseFrontmatter } from '@astrojs/markdown-remark';
import postcss from 'postcss';
import valueParser from 'postcss-value-parser';
import sharp from 'sharp';
import { nvidiaEditions } from '../src/config/nvidia-publication.mjs';
import { assertNvidiaContentModel, assertNvidiaPassiveTree, assertNvidiaLink, bakeNvidiaSvg, nvidiaComponentLiteral, nvidiaArticleSource, nvidiaFigureSpecs, nvidiaFontFiles, nvidiaSvgFontFiles, nvidiaSourceCounts, nvidiaSourceIds, nvidiaFigureCounts, nvidiaPalette, renderNvidiaArticle, prepareNvidiaReading, nvidiaChapterDateText } from './generate-nvidia-epub.mjs';

const ROOT=resolve(new URL('..',import.meta.url).pathname),SITE='https://l0g.fr';
const files=dir=>readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(join(dir,e.name)):[join(dir,e.name)]);
const nodes=n=>[n,...(n.children??[]).flatMap(nodes)];
const plain=n=>toText(n).replace(/\s+/gu,' ').trim();
const digest=value=>createHash('sha256').update(value).digest('hex');
const ast=unified().use(remarkParse).use(remarkGfm).use(remarkMdx);
const originalText=node=>{
  if(['text','inlineCode','code'].includes(node.type))return node.value;
  const value=(node.children??[]).map(originalText).join('');
  return ['paragraph','heading','tableCell'].includes(node.type)||['p','li','summary'].includes(node.name)?` ${value} `:value;
};
function sourceAst(source,chapter){
  let content=parseFrontmatter(source).content;
  if(chapter.number===1)content=content.replace(/<style>[\s\S]*?<\/style>/gu,'').replace(/<svg\b[\s\S]*?<\/svg>/gu,'');
  return nodes(ast.parse(content));
}
const xmlTree=source=>{
  const convert=entries=>entries.flatMap(entry=>Object.entries(entry).filter(([k])=>k!==':@').map(([tag,value])=>tag==='#text'?{type:'text',value:String(value)}:{type:'element',tagName:tag,children:Array.isArray(value)?convert(value):[]}));
  return{type:'root',children:convert(new XMLParser({preserveOrder:true,ignoreAttributes:false}).parse(source))};
};
const structural=svg=>{
  const tree=fromHtml(svg,{fragment:true});
  const visit=n=>n.type==='element'&&n.tagName==='defs'&&n.children.some(c=>c.tagName==='style')?[]:[n,...(n.children??[]).flatMap(visit)];
  return visit(tree).filter(n=>n.type==='element').map(n=>({tag:n.tagName,properties:Object.fromEntries(Object.entries(n.properties??{}).filter(([key])=>!['fill','stroke','style'].includes(key)&&!(n.tagName==='svg'&&['fontFamily','fontWeight'].includes(key)))),text:(n.children??[]).filter(c=>c.type==='text').map(c=>c.value).join('')}));
};
const renderedBooks=new Map();
async function renderBook(book){
  if(!renderedBooks.has(book.lang))renderedBooks.set(book.lang,(async()=>{const rendered=[];let offset=0;for(const chapter of book.chapters){const item=await renderNvidiaArticle(nvidiaArticleSource(chapter,book.lang),chapter,offset);offset=item.next;rendered.push({...item,chapter});}return rendered;})());
  return renderedBooks.get(book.lang);
}
for(const book of Object.values(nvidiaEditions)){
  const SOURCE=join(ROOT,'src/epub',book.directory),EPUB=join(ROOT,'public',book.epub);
  test(`${book.lang}: exact twelve-source corpus, dates, all prose and 293 reference notices survive`,async()=>{
    assert.equal(book.chapters.length,12);assert.equal(new Set(book.chapters.map(c=>c.file)).size,12);
    let noticeTotal=0,figureTotal=0;
    for(const rendered of await renderBook(book)){
      const chapter=rendered.chapter,source=nvidiaArticleSource(chapter,book.lang),expected=sourceAst(source,chapter);
      assert.equal(digest(source),chapter.sha256,'Approved source bytes remain untouched');
      const actual=fromHtml(readFileSync(join(SOURCE,'EPUB/text',chapter.chapter),'utf8')),all=nodes(actual),copy=plain(actual);
      for(const node of expected.filter(n=>['paragraph','tableCell','heading','code'].includes(n.type)||['p','summary','li','figcaption'].includes(n.name))){const value=originalText(node).replace(/\s+/gu,' ').trim();if(value)assert.ok(copy.includes(value),`${chapter.slug}: omitted prose ${value.slice(0,180)}`);}
      for(const node of expected.filter(n=>n.type.startsWith('mdxJsx'))){
        const get=name=>node.attributes?.find(a=>a.name===name)?.value;
        if(get('id'))assert.ok(all.some(n=>n.properties?.id===`c${chapter.number}-${get('id')}`),'Exact prefixed source ID');
        const href=get('href');if(href?.startsWith('https://')&&new URL(href).origin!==SITE)assert.ok(all.some(n=>n.properties?.href===href),`External source URL ${href}`);
      }
      for(const node of expected.filter(n=>n.type==='link'&&/^https?:/u.test(n.url)&&new URL(n.url).origin!==SITE))assert.ok(all.some(n=>n.properties?.href===node.url),`Exact Markdown source URL ${node.url}`);
      const ids=all.map(n=>n.properties?.id).filter(Boolean),notices=ids.filter(id=>id.startsWith(`c${chapter.number}-source-`));
      assert.deepEqual(notices,nvidiaSourceIds[chapter.number-1].map(id=>`c${chapter.number}-source-${id}`));noticeTotal+=notices.length;
      assert.equal(ids.length,new Set(ids).size);assert.equal(all.filter(n=>n.tagName==='h1').length,1);
      assert.equal(all.filter(n=>n.tagName==='figure'&&n.properties.className?.includes('infographic')).length,nvidiaFigureCounts[chapter.number-1]);figureTotal+=rendered.figures.length;
      assert.equal(all.filter(n=>['details','summary','script','input','fieldset','aside'].includes(n.tagName)).length,0);
      for(const figure of rendered.figures)assert.ok(all.some(n=>n.properties?.id===figure.id));
      assert.ok(copy.includes(String(rendered.meta.pubDate)));if(rendered.meta.updatedDate)assert.ok(copy.includes(String(rendered.meta.updatedDate)));
      assert.equal(rendered.meta.pubDate,chapter.date);assert.equal(rendered.meta.updatedDate??rendered.meta.pubDate,chapter.updatedDate);
      for(const spec of nvidiaFigureSpecs[chapter.number-1]){
        for(const key of ['captions','titles','methods'])if(spec[key]){
          const data=spec[key],values=typeof data[book.lang]==='string'?[data[book.lang]]:Object.values(data).map(value=>value[book.lang]);
          for(const value of values)assert.ok(copy.includes(value.replace(/\s+/gu,' ').trim()),`Complete original ${key}: ${value.slice(0,100)}`);
        }
        if(spec.notes)assert.ok(copy.includes(spec.notes[book.lang].replace(/\s+/gu,' ').trim()),'Original method or time-zone note survives');
        if(spec.phases)for(const phase of spec.phases[book.lang])for(const key of ['title','label','caption'])assert.ok(copy.includes(phase[key].replace(/\s+/gu,' ').trim()),'Every offline chronology panel retains its scope');
      }

    }
    assert.equal(noticeTotal,293);assert.equal(figureTotal,26);
    const first=nvidiaChapterDateText(book,(await renderBook(book))[0].meta);assert.match(first,/2026-11-09(?: ·|$)/u);assert.doesNotMatch(first,/2026-11-09T/u);
  });
  test(`${book.lang}: 56 SVG scenes retain original geometry, labels, values and offline fonts`,async()=>{
    let total=0;
    for(const rendered of await renderBook(book))for(const scene of rendered.attachments){
      total++;assert.equal(XMLValidator.validate(scene.svg),true);assert.deepEqual(structural(scene.svg),structural(scene.original));
      assert.equal(readFileSync(join(SOURCE,'EPUB/media',scene.name),'utf8'),scene.svg);
      const all=nodes(fromHtml(scene.svg,{fragment:true})),before=nodes(fromHtml(scene.original,{fragment:true})).filter(n=>n.type==='element');
      for(const node of before)for(const key of ['fill','stroke'])if(node.properties[key]?.startsWith('var('))assert.ok(Object.values(nvidiaPalette).some(color=>scene.svg.includes(color)));
      const style=all.filter(n=>n.tagName==='style');assert.equal(style.length,1);
      const css=postcss.parse(toText(style[0]));assert.ok(css.nodes.length>=1);
      for(const face of css.nodes){assert.equal(face.type,'atrule');assert.equal(face.name,'font-face');const props=Object.fromEntries(face.nodes.map(n=>[n.prop,n.value]));const match=/^url\(data:font\/(ttf|woff2);base64,([A-Za-z0-9+/=]+)\) format\("(?:truetype|woff2)"\)$/u.exec(props.src);assert.ok(match);const font=nvidiaSvgFontFiles[match[1]==='ttf'?0:1];assert.deepEqual(Buffer.from(match[2],'base64'),readFileSync(join(ROOT,font.source)));}
      assert.doesNotMatch(scene.svg,/<(?:script|foreignObject|image|animate|set|iframe)\b|\son\w+=|javascript:|@import|var\(|color-mix\(/iu);
    }
    assert.equal(total,56);
    const timeline=(await renderBook(book))[3],panels=timeline.attachments.filter(a=>a.kind.startsWith('records'));
    assert.equal(panels.length,6);assert.deepEqual([...new Set(panels.map(a=>a.kind))],['records1','records2','records3']);
    const html=readFileSync(join(SOURCE,'EPUB/text',timeline.chapter.chapter),'utf8');for(const phase of ['records1','records2','records3'])assert.ok(panels.some(a=>a.kind===phase)&&html.includes(panels.find(a=>a.kind===phase).name));
  });
  test(`${book.lang}: EPUB ZIP, manifest, spine, navigation and every offline target resolve`,async()=>{
    assert.ok(existsSync(EPUB),'Build final EPUB before this test');
    const entries=execFileSync('unzip',['-Z1',EPUB],{encoding:'utf8'}).trim().split('\n');
    assert.equal(entries[0],'mimetype');assert.equal(entries.filter(x=>x==='mimetype').length,1);
    assert.equal(execFileSync('unzip',['-p',EPUB,'mimetype'],{encoding:'utf8'}),'application/epub+zip');
    assert.match(execFileSync('unzip',['-lv',EPUB],{encoding:'utf8'}).split('\n').find(l=>/\bmimetype$/u.test(l)),/Stored/u);execFileSync('unzip',['-t',EPUB],{stdio:'pipe'});
    assert.deepEqual([...entries].sort(),files(SOURCE).map(file=>relative(SOURCE,file)).sort());
    for(const file of files(SOURCE))assert.deepEqual(execFileSync('unzip',['-p',EPUB,relative(SOURCE,file)]),readFileSync(file));
    const parser=new XMLParser({ignoreAttributes:false,parseTagValue:false}),opf=parser.parse(readFileSync(join(SOURCE,'EPUB/content.opf'),'utf8')).package;
    assert.equal(opf['@_version'],'3.0');assert.equal(opf.metadata['dc:identifier']['#text'],book.id);assert.equal(opf.metadata['dc:title'],book.title);assert.equal(opf.metadata['dc:language'],book.lang);assert.equal(opf.metadata['dc:date'],book.date);assert.equal(opf.metadata['dc:description'],book.description);assert.equal(opf.metadata['dc:source'],SITE+book.path);assert.equal(opf.metadata.meta.find(m=>m['@_property']==='dcterms:modified')['#text'],book.modified);
    const items=opf.manifest.item,manifest=new Set(items.map(i=>i['@_href']));assert.equal(items.length,new Set(items.map(i=>i['@_id'])).size);assert.equal(items.length,manifest.size);
    assert.equal(items.filter(i=>i['@_media-type']==='image/svg+xml').length,56);assert.equal(items.filter(i=>i['@_media-type']==='font/woff2').length,2);
    assert.equal(opf.spine.itemref.filter(i=>i['@_linear']==='no').length,56);assert.equal(opf.spine.itemref.filter(i=>i['@_linear']!=='no').length,25);
    for(const file of files(join(SOURCE,'EPUB')))if(!file.endsWith('/content.opf'))assert.ok(manifest.has(relative(join(SOURCE,'EPUB'),file)),`Unmanifested ${file}`);
    const spine=opf.spine.itemref.map(ref=>{const item=items.find(i=>i['@_id']===ref['@_idref']);assert.ok(item);return item['@_href'];});
    const nav=nodes(fromHtml(readFileSync(join(SOURCE,'EPUB/nav.xhtml'),'utf8'))).find(n=>n.tagName==='nav'&&n.properties.id==='toc'),positions=nodes(nav).filter(n=>n.tagName==='a').map(n=>spine.indexOf(n.properties.href.split('#')[0]));assert.ok(positions.every((p,i)=>p>=0&&(!i||p>=positions[i-1])));
    for(const file of files(SOURCE).filter(f=>/\.(?:xhtml|xml|opf|ncx|svg)$/u.test(f))){
      const raw=readFileSync(file,'utf8');assert.equal(XMLValidator.validate(raw),true,file);if(file.endsWith('.xhtml'))assertNvidiaContentModel(xmlTree(raw));
      const visit=node=>{if(!node||typeof node!=='object')return;for(const[key,value]of Object.entries(node)){
        if(['@_href','@_src','@_full-path'].includes(key)&&! /^(?:https?:|mailto:)/u.test(value)){
          const[name,fragment]=String(value).split('#'),target=name?resolve(key==='@_full-path'?SOURCE:dirname(file),decodeURIComponent(name)):file;
          assert.ok(target.startsWith(SOURCE+'/')&&existsSync(target),`Unresolved ${relative(SOURCE,file)}: ${value}`);
          if(fragment)assert.ok(nodes(fromHtml(readFileSync(target,'utf8'))).some(n=>n.properties?.id===decodeURIComponent(fragment)),`Unresolved fragment ${value}`);
        }
        if(key==='@_src')assert.doesNotMatch(String(value),/^(?:https?:|data:|\/\/)/u);visit(value);
      }};visit(parser.parse(raw));assert.doesNotMatch(raw,/<(?:script|iframe|object|embed|foreignObject|form|input|audio|video)\b|\son\w+=|javascript:|@import/iu);
    }
    assert.ok(statSync(EPUB).size<16_000_000,'Bounded, useful mobile download');
  });
  test(`${book.lang}: colophon and machine provenance identify every exact source and exported scene`,async()=>{
    const manifest=JSON.parse(readFileSync(join(SOURCE,'EPUB/provenance.json'),'utf8')),colophon=plain(fromHtml(readFileSync(join(SOURCE,'EPUB/text/colophon.xhtml'),'utf8')));
    assert.equal(manifest.sourceArticles.length,24);assert.equal(manifest.figures.length,56);assert.equal(manifest.edition,book.id);assert.equal(manifest.modified,book.modified);assert.ok(colophon.includes(book.modified));
    for(const edition of Object.values(nvidiaEditions))for(const chapter of edition.chapters){const source=nvidiaArticleSource(chapter,edition.lang),hash=digest(source);assert.ok(manifest.sourceArticles.some(s=>s.lang===edition.lang&&s.chapter===chapter.number&&s.sha256===hash&&s.published===chapter.date&&s.updated===chapter.updatedDate));}
    for(const scene of manifest.figures)assert.equal(scene.epubSha256,digest(readFileSync(join(SOURCE,scene.epubFile))));
    for(const[name,values]of[['ch001.xhtml',book.introduction],['conclusion.xhtml',book.conclusion],['method.xhtml',book.method],['reader-guide.xhtml',book.readerGuide]]){const all=nodes(fromHtml(readFileSync(join(SOURCE,'EPUB/text',name),'utf8'))),copy=plain(all[0]);for(const value of values)assert.ok(copy.includes(value.replace(/\s+/gu,' ').trim()));for(const marker of values.flatMap(v=>v.match(/\[B\d{2}\]/gu)??[]))assert.ok(all.some(n=>n.tagName==='a'&&n.properties.href===`synthesis-sources.xhtml#book-source-${marker.slice(1,-1)}`));}
    const sources=nodes(fromHtml(readFileSync(join(SOURCE,'EPUB/text/synthesis-sources.xhtml'),'utf8')));for(const s of book.synthesisSources)assert.ok(sources.some(n=>n.properties?.id===`book-source-${s.id}`)&&sources.some(n=>n.properties?.href===s.url));
  });
  test(`${book.lang}: reader CSS, real cover and font licences support offline mobile reading`,async()=>{
    const cover=await sharp(join(ROOT,'public',book.cover)).metadata();assert.equal(cover.width,book.coverWidth);assert.equal(cover.height,book.coverHeight);assert.deepEqual(readFileSync(join(SOURCE,'EPUB/media/cover.jpg')),readFileSync(join(ROOT,'public',book.cover)));
    const css=postcss.parse(readFileSync(join(SOURCE,'EPUB/styles/stylesheet1.css'),'utf8'));css.walkAtRules(rule=>assert.notEqual(rule.name,'import'));css.walkDecls(decl=>{if(decl.prop==='overflow')assert.notEqual(decl.value,'hidden');valueParser(decl.value).walk(n=>{if(n.type==='function'&&n.value==='url')assert.match(valueParser.stringify(n.nodes),/^\.\.\/fonts\/(?:inter|jetbrains-mono)\.woff2$/u);});});
    assert.match(css.toString(),/\.infographic-image\{[^}]*width:100%;height:auto/u);assert.match(css.toString(),/@media\(max-width:36em\)\{\.infographic-desktop\{display:none\}\.infographic-mobile\{display:block\}/u);
    for(const font of nvidiaFontFiles){assert.deepEqual(readFileSync(join(SOURCE,'EPUB/fonts',font.name)),readFileSync(join(ROOT,font.source)));assert.deepEqual(readFileSync(join(SOURCE,'EPUB/fonts',font.license)),readFileSync(join(ROOT,'public/fonts/jlr',font.license)));}
    assert.deepEqual(readFileSync(join(SOURCE,'EPUB/fonts/LICENSE-liberation.txt')),readFileSync(join(ROOT,'public/fonts/ukraine-reparations/LICENSE.txt')));
  });
  test(`${book.lang}: conversion fails closed on code, arbitrary imports, attributes and source drift`,async()=>{
    const chapter=book.chapters[1],original=nvidiaArticleSource(chapter,book.lang),component=nvidiaFigureSpecs[1][0];
    await assert.rejects(renderNvidiaArticle(original,{...chapter}),/Unconfigured/u);
    for(const offset of[-1,NaN,Infinity,1.5,57])await assert.rejects(renderNvidiaArticle(original,chapter,offset),/scene offset/u);
    for(const payload of['\nimport fs from "node:fs";','\nexport const x=1;','\n{process.exit()}','\n<div {...x}/>','\n<script>alert(1)</script>','\n<img src="https://example.com/x"/>','\n<style>@import "https://example.com/x";</style>','\n<p style="display:none">x</p>','\n<a href="java&#x73;cript:alert(1)">x</a>','\n<a href="//evil.example/x">x</a>','\n<OtherFigure/>','\n## Ce qui change','\n## What remains'])await assert.rejects(renderNvidiaArticle(original+payload,chapter),payload);
    for(const replacement of['kind={"access"}','kind="access" {...evil}','kind="invented"'])await assert.rejects(renderNvidiaArticle(original.replace('kind="access"',replacement),chapter));
    await assert.rejects(renderNvidiaArticle(original.replace(component.path,'../../components/Other.astro'),chapter));
    await assert.rejects(renderNvidiaArticle(original.replace(/^updatedDate:.*$/mu,'updatedDate: "2099-01-01T00:00:00Z"'),chapter),/predates/u);
    if(book.lang==='en')await assert.rejects(renderNvidiaArticle(original.replace(/^sourceUpdatedDate:.*$/mu,'sourceUpdatedDate: "2020-01-01T00:00:00Z"'),chapter),/version drift/u);
    const first=book.chapters[0],firstSource=nvidiaArticleSource(first,book.lang);for(const payload of['\n<NvidiaInlineSvg index="0" />','\n<style>p{color:red}</style>'])await assert.rejects(renderNvidiaArticle(firstSource+payload,first));
  });
}
test('SVG baking refuses active nodes, URL paints, unexpected fonts, duplicate IDs and missing accessible names',()=>{
  const source=nvidiaFigureSpecs[1][0].art.fr.access.desktop;
  for(const payload of['<script/>','<foreignObject/>','<image href="https://evil.example/x"/>','<style>@import "https://evil.example/x";</style>','<animate/>','<set/>','<iframe/>'])assert.throws(()=>bakeNvidiaSvg(source.replace('</svg>',payload+'</svg>')));
  for(const fill of['var(--unknown)','url(https://evil.example/x)','url(#missing)','javascript:alert(1)','#ffffff'])assert.throws(()=>bakeNvidiaSvg(source.replace('fill="var(--color-signal)"',`fill="${fill}"`)));
  assert.throws(()=>bakeNvidiaSvg(source.replace('<rect ','<rect onload="x" ')));assert.throws(()=>bakeNvidiaSvg(source.replace('</svg>','')));
  const id=/id="([^"]+)"/u.exec(source)[1];assert.throws(()=>bakeNvidiaSvg(source.replace('</svg>',`<rect id="${id}"/></svg>`)));
  assert.throws(()=>bakeNvidiaSvg(source.replace('font-family="l0g Nvidia Investigation"','font-family="Unexpected"')));
  assert.throws(()=>bakeNvidiaSvg(source.replace(/<desc[\s\S]*?<\/desc>/u,'')));
  assert.throws(()=>bakeNvidiaSvg('<!DOCTYPE svg [<!ENTITY x SYSTEM "file:///etc/passwd">]>'+source));
});
test('static Astro literal reader rejects executable expressions, getters, spreads, prototypes and ambiguous declarations',()=>{
  for(const value of['get x(){return "x"}','...globalThis','x:process.exit()','["x"]:"value"','__proto__:"x"','constructor:"x"','x:"a",x:"b"'])assert.throws(()=>nvidiaComponentLiteral(`---\nconst art={${value}};\n---`,'art'));
  assert.throws(()=>nvidiaComponentLiteral('---\nconst art={x:"a"};const art={x:"b"};\n---','art'));assert.throws(()=>nvidiaComponentLiteral('---\nconst art=`x${process.exit()}`;\n---','art'));
  assert.deepEqual(JSON.parse(JSON.stringify(nvidiaComponentLiteral('---\nconst art={fr:{desktop:"<svg/>",mobile:"<svg/>"}} as const;\n---','art'))),{fr:{desktop:'<svg/>',mobile:'<svg/>'}});
});
test('URL and passive tree validation refuse execution, ambiguous hosts, external media and controls',()=>{
  for(const href of['javascript:alert(1)','data:text/html,x','file:///etc/passwd','//evil.example','https://user:pass@example.com/a','https:\\evil.example/x','https://example.com/\nx',' #source-S01','#'])assert.throws(()=>assertNvidiaLink(href));
  for(const href of['https://example.com/a.pdf?VersionId=x.y_2','mailto:editor@example.com','#source-S01','/glossaire/reassurance/'])assert.doesNotThrow(()=>assertNvidiaLink(href));
  for(const payload of['<img src="https://evil.example/x"/>','<a onclick="x" href="https://example.com">x</a>','<script>x</script>'])assert.throws(()=>assertNvidiaPassiveTree(fromHtml(payload,{fragment:true})));
  assert.throws(()=>assertNvidiaPassiveTree({type:'root',children:[{type:'element',tagName:'p',properties:{},children:[{type:'element',tagName:'div',properties:{},children:[]}]}]}));
});
test('offline fragment and cross-chapter resolution is strict while versioned source URLs remain exact',async()=>{
  const book=nvidiaEditions.fr,rendered=await renderBook(book),routes=new Map(rendered.map(r=>[r.chapter.route,r])),glossary=new Map(book.glossary.filter(g=>g.path).map(g=>[g.path,g.slug]));
  const chapter=book.chapters[1],source=nvidiaArticleSource(chapter,'fr'),bad=await renderNvidiaArticle(source+'\n\n[broken](#missing-fragment)',chapter);assert.throws(()=>prepareNvidiaReading(bad,chapter,routes,glossary),/Unresolved/u);
  const other=book.chapters[2],good=await renderNvidiaArticle(source+`\n\n[chapter](${other.route}#source-s01)`,chapter);assert.match(prepareNvidiaReading(good,chapter,routes,glossary),/href="ch004.xhtml#c3-source-s01"/u);
});
