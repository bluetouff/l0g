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
import { ordinaryMachinesEditions } from '../src/config/ordinary-machines-publication.mjs';
import { assertOrdinaryMachinesContentModel, assertOrdinaryMachinesPassiveTree, assertOrdinaryMachinesLink, bakeOrdinaryMachinesSvg, ordinaryMachinesArticleSource, ordinaryMachinesFigureSpecs, ordinaryMachinesFontFiles, ordinaryMachinesSvgFontFiles, ordinaryMachinesSourceCounts, ordinaryMachinesPalette, renderOrdinaryMachinesArticle, prepareOrdinaryMachinesReading, generateOrdinaryMachinesEpub, ordinaryMachinesChapterDateText, referenceId } from './generate-ordinary-machines-epub.mjs';

const ROOT=resolve(new URL('..',import.meta.url).pathname),SITE='https://l0g.fr';
const files=dir=>readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(join(dir,e.name)):[join(dir,e.name)]);
const nodes=n=>[n,...(n.children??[]).flatMap(nodes)];
const plain=n=>toText(n).replace(/\s+/gu,' ').trim();
const digest=value=>createHash('sha256').update(value).digest('hex');
const ast=unified().use(remarkParse).use(remarkGfm).use(remarkMdx);
const counts=[4,4,5,5,5,5,5];
const chapterFontDirectory=()=> 'stablecoins';
const originalText=node=>{
  if(['text','inlineCode','code'].includes(node.type))return node.value;
  const value=(node.children??[]).map(originalText).join('');
  return ['paragraph','heading','tableCell'].includes(node.type)||['p','li','summary','details'].includes(node.name)?` ${value} `:value;
};
const xmlTree=source=>{
  const convert=entries=>entries.flatMap(entry=>Object.entries(entry).filter(([k])=>k!==':@').map(([tag,value])=>tag==='#text'?{type:'text',value:String(value)}:{type:'element',tagName:tag,children:Array.isArray(value)?convert(value):[]}));
  return {type:'root',children:convert(new XMLParser({preserveOrder:true,ignoreAttributes:false}).parse(source))};
};
const structural=svg=>nodes(fromHtml(svg,{fragment:true})).filter(n=>n.type==='element'&&!['style','defs'].includes(n.tagName)).map(n=>({
  tag:n.tagName,
  properties:Object.fromEntries(Object.entries(n.properties??{}).filter(([key])=>!['fill','stroke','style','href'].includes(key))),
  text:(n.children??[]).filter(child=>child.type==='text').map(child=>child.value).join(''),
}));

// Cache pure parsing for this test process; each source body still has an exact
// hash check against the generated colophon and its canonical article.
const renderedBooks=new Map();
async function renderBook(book){
  if(!renderedBooks.has(book.lang))renderedBooks.set(book.lang,(async()=>{
    const rendered=[];let offset=0;
    for(const chapter of book.chapters){const item=await renderOrdinaryMachinesArticle(ordinaryMachinesArticleSource(chapter,book.lang),chapter,offset);offset=item.next;rendered.push({...item,chapter});}
    return rendered;
  })());
  return renderedBooks.get(book.lang);
}

for(const book of Object.values(ordinaryMachinesEditions)){
  const SOURCE=join(ROOT,'src/epub',book.directory),EPUB=join(ROOT,'public',book.epub);
  test(`${book.lang}: all seven complete source bodies, 99 notices, methods and captions survive`,async()=>{
    let noticeTotal=0,figureTotal=0;
    for(const rendered of await renderBook(book)){
      const chapter=rendered.chapter,source=ordinaryMachinesArticleSource(chapter,book.lang),expected=nodes(ast.parse(parseFrontmatter(source).content));
      const actual=fromHtml(readFileSync(join(SOURCE,'EPUB/text',chapter.chapter),'utf8')),all=nodes(actual),copy=plain(actual);
      for(const node of expected.filter(n=>['paragraph','tableCell','heading','code'].includes(n.type)||['p','summary','li'].includes(n.name))){
        const value=originalText(node).replace(/\s+/gu,' ').trim();if(value)assert.ok(copy.includes(value),`${chapter.slug}: omitted prose ${value.slice(0,160)}`);
      }
      for(const node of expected.filter(n=>n.type.startsWith('mdxJsx'))){
        const get=name=>node.attributes.find(a=>a.name===name)?.value;
        if(get('caption'))assert.ok(all.filter(n=>n.tagName==='figcaption').some(n=>n.children.some(child=>child.type==='text'&&child.value.includes(get('caption')))),'Exact caption text and spacing');
        if(get('id'))assert.ok(all.some(n=>n.properties?.id===`c${chapter.number}-${get('id')}`),'Exact prefixed source ID');
        const href=get('href');if(href?.startsWith('https://')&&new URL(href).origin!==SITE)assert.ok(all.some(n=>n.properties?.href===href),`External source URL ${href}`);
      }
      for(const node of expected.filter(n=>n.type==='link'&&/^https?:/u.test(n.url)&&new URL(n.url).origin!==SITE))assert.ok(all.some(n=>n.properties?.href===node.url),`Exact Markdown source URL ${node.url}`);
      const ids=all.map(n=>n.properties?.id).filter(Boolean),notices=ids.filter(id=>new RegExp(`^c${chapter.number}-source-\\d{2}$`,'u').test(id));
      assert.deepEqual(notices,Array.from({length:ordinaryMachinesSourceCounts[chapter.number-1]},(_,i)=>`c${chapter.number}-source-${referenceId(chapter.number,i+1)}`));noticeTotal+=notices.length;
      assert.equal(ids.length,new Set(ids).size);assert.equal(all.filter(n=>n.tagName==='h1').length,1);
      assert.equal(all.filter(n=>n.tagName==='figure'&&n.properties.className?.includes('infographic')).length,counts[chapter.number-1]);
      assert.equal(all.filter(n=>['details','summary','script','aside'].includes(n.tagName)).length,0);
      assert.equal(rendered.attachments.length,2*counts[chapter.number-1]);figureTotal+=rendered.figures.length;
      for(const figure of rendered.figures){assert.ok(all.some(n=>n.properties?.id===figure.id));assert.ok(copy.includes(figure.caption));assert.ok(copy.includes(figure.method));}
      const formatter=new Intl.DateTimeFormat(book.locale,{day:'numeric',month:'long',year:'numeric',timeZone:'Europe/Paris'});
      const dateMeta=plain(all.find(n=>n.properties?.className?.includes('chapter-meta')));
      assert.ok(dateMeta.includes(`${book.lang==='fr'?'Publié le':'Published'} ${formatter.format(new Date(rendered.meta.pubDate))}`));
      assert.ok(!dateMeta.includes(String(rendered.meta.pubDate)),'Raw ISO dates belong to provenance, not chapter reading headers');
      assert.equal(dateMeta.includes(book.lang==='fr'?'Mis à jour le':'Updated '),new Date(rendered.meta.updatedDate??rendered.meta.pubDate).getTime()!==new Date(rendered.meta.pubDate).getTime());
    }
    assert.equal(noticeTotal,99);assert.equal(figureTotal,33);
  });

  test(`${book.lang}: 66 complete SVG scenes preserve geometry, relationships, glyphs, fonts and exact citations`,async()=>{
    let scenes=0;
    for(const rendered of await renderBook(book))for(const scene of rendered.attachments){
      scenes++;assert.equal(XMLValidator.validate(scene.svg),true);assert.deepEqual(structural(scene.svg),structural(scene.original));
      assert.equal(readFileSync(join(SOURCE,'EPUB/media',scene.name),'utf8'),scene.svg);
      const before=nodes(fromHtml(scene.original,{fragment:true})).filter(n=>n.type==='element');
      const all=nodes(fromHtml(scene.svg,{fragment:true})),after=all.filter(n=>n.type==='element'&&!['style','defs'].includes(n.tagName));
      assert.equal(before.length,after.length);
      for(const [i,node]of before.entries())for(const [key,value]of Object.entries(node.properties??{})){
        if(['fill','stroke'].includes(key)){
          const match=/^var\(--color-([a-z0-9-]+)\)$/u.exec(value);
          assert.equal(after[i].properties[key],match?ordinaryMachinesPalette[match[1]]:value);
        }else if(key==='href')assert.equal(after[i].properties.href,`../text/${rendered.chapter.chapter}#c${rendered.chapter.number}-${value.slice(1)}`);
      }
      const root=all.find(n=>n.tagName==='svg');assert.equal(Number(root.properties.viewBox.split(' ')[2]),scene.mobile?420:1000);
      const style=all.filter(n=>n.tagName==='style');assert.equal(style.length,1);
      const css=postcss.parse(toText(style[0]));assert.equal(css.nodes.length,2);
      for(const [i,face]of css.nodes.entries()){
        assert.equal(face.type,'atrule');assert.equal(face.name,'font-face');const props=Object.fromEntries(face.nodes.map(n=>[n.prop,n.value]));
        assert.equal(props['font-weight'],String(ordinaryMachinesSvgFontFiles[i].weight));
        assert.equal(props['font-family'],`"${before.find(n=>n.tagName==='text').properties.fontFamily}"`);
        const match=/^url\(data:font\/ttf;base64,([A-Za-z0-9+/=]+)\) format\("truetype"\)$/u.exec(props.src);assert.ok(match);
        assert.deepEqual(Buffer.from(match[1],'base64'),readFileSync(join(ROOT,'public/fonts',chapterFontDirectory(rendered.chapter.number),ordinaryMachinesSvgFontFiles[i].name)));
      }
      assert.doesNotMatch(scene.svg,/<(?:script|foreignObject|image|animate|set)\b|\son\w+=|javascript:|@import|var\(|color-mix\(/iu);
    }
    assert.equal(scenes,66);
  });

  test(`${book.lang}: EPUB ZIP, manifest, reading order, provenance and offline targets agree`,async()=>{
    assert.ok(existsSync(EPUB),'Build the final EPUB before this test');
    const entries=execFileSync('unzip',['-Z1',EPUB],{encoding:'utf8'}).trim().split('\n');
    assert.equal(entries[0],'mimetype');assert.equal(entries.filter(x=>x==='mimetype').length,1);
    assert.equal(execFileSync('unzip',['-p',EPUB,'mimetype'],{encoding:'utf8'}),'application/epub+zip');
    assert.match(execFileSync('unzip',['-lv',EPUB],{encoding:'utf8'}).split('\n').find(l=>/\bmimetype$/u.test(l)),/Stored/u);
    execFileSync('unzip',['-t',EPUB],{stdio:'pipe'});
    assert.deepEqual([...entries].sort(),files(SOURCE).map(file=>relative(SOURCE,file)).sort());
    for(const file of files(SOURCE))assert.deepEqual(execFileSync('unzip',['-p',EPUB,relative(SOURCE,file)]),readFileSync(file));
    const parser=new XMLParser({ignoreAttributes:false,parseTagValue:false}),opf=parser.parse(readFileSync(join(SOURCE,'EPUB/content.opf'),'utf8')).package;
    assert.equal(opf['@_version'],'3.0');assert.equal(opf.metadata['dc:identifier']['#text'],book.id);assert.equal(opf.metadata['dc:title'],book.title);assert.equal(opf.metadata['dc:language'],book.lang);assert.equal(opf.metadata['dc:date'],book.date);assert.equal(opf.metadata['dc:description'],book.description);assert.equal(opf.metadata['dc:source'],SITE+book.path);
    assert.equal(opf.metadata.meta.find(m=>m['@_property']==='dcterms:modified')['#text'],book.modified);
    const items=opf.manifest.item,manifest=new Set(items.map(i=>i['@_href']));
    assert.equal(items.length,new Set(items.map(i=>i['@_id'])).size);assert.equal(items.length,manifest.size);
    assert.equal(items.filter(i=>i['@_media-type']==='image/svg+xml').length,66);assert.equal(items.filter(i=>i['@_media-type']==='font/woff2').length,2);
    assert.equal(opf.spine.itemref.filter(i=>i['@_linear']==='no').length,66);assert.equal(opf.spine.itemref.filter(i=>i['@_linear']!=='no').length,20);
    for(const file of files(join(SOURCE,'EPUB')))if(!file.endsWith('/content.opf'))assert.ok(manifest.has(relative(join(SOURCE,'EPUB'),file)),`Unmanifested ${file}`);
    const spine=opf.spine.itemref.map(ref=>{const item=items.find(i=>i['@_id']===ref['@_idref']);assert.ok(item);return item['@_href'];});
    const nav=nodes(fromHtml(readFileSync(join(SOURCE,'EPUB/nav.xhtml'),'utf8'))).find(n=>n.tagName==='nav'&&n.properties.id==='toc');
    const positions=nodes(nav).filter(n=>n.tagName==='a').map(n=>spine.indexOf(n.properties.href.split('#')[0]));assert.ok(positions.every((p,i)=>p>=0&&(!i||p>=positions[i-1])));
    for(const file of files(SOURCE).filter(f=>/\.(?:xhtml|xml|opf|ncx|svg)$/u.test(f))){
      const raw=readFileSync(file,'utf8');assert.equal(XMLValidator.validate(raw),true,file);if(file.endsWith('.xhtml'))assertOrdinaryMachinesContentModel(xmlTree(raw));
      const visit=node=>{if(!node||typeof node!=='object')return;for(const[key,value]of Object.entries(node)){
        if(['@_href','@_src','@_full-path'].includes(key)&&! /^(?:https?:|mailto:)/u.test(value)){
          const [name,fragment]=String(value).split('#'),target=name?resolve(key==='@_full-path'?SOURCE:dirname(file),decodeURIComponent(name)):file;
          assert.ok(target.startsWith(SOURCE+'/')&&existsSync(target),`Unresolved ${file}: ${value}`);
          if(fragment)assert.ok(nodes(fromHtml(readFileSync(target,'utf8'))).some(n=>n.properties?.id===decodeURIComponent(fragment)),`Unresolved fragment ${value}`);
          if(key==='@_href'&&file.endsWith('.xhtml')&&target.endsWith('.svg'))assert.ok(spine.includes(relative(join(SOURCE,'EPUB'),target)));
        }
        if(key==='@_src')assert.doesNotMatch(String(value),/^(?:https?:|data:|\/\/)/u);visit(value);
      }};visit(parser.parse(raw));assert.doesNotMatch(raw,/<(?:script|iframe|object|embed|foreignObject|form|input|audio|video)\b|\son\w+=|javascript:|@import/iu);
    }
    const provenance=JSON.parse(readFileSync(join(SOURCE,'EPUB/provenance.json'),'utf8'));
    assert.equal(provenance.edition,book.id);assert.equal(provenance.modified,book.modified);assert.equal(provenance.sourceArticles.length,14);assert.equal(provenance.figures.length,66);
    for(const p of provenance.sourceArticles)assert.equal(p.sha256,digest(readFileSync(join(ROOT,p.file))));
    for(const p of provenance.figures){assert.equal(p.sourceSha256,digest(readFileSync(join(ROOT,p.sourceFile))));assert.equal(p.epubSha256,digest(readFileSync(join(SOURCE,p.epubFile))));}
    for(const p of provenance.fonts)assert.equal(p.sha256,digest(readFileSync(join(ROOT,p.file))));
    assert.equal(provenance.cover.sha256,digest(readFileSync(join(ROOT,provenance.cover.file))));
    const colophon=plain(fromHtml(readFileSync(join(SOURCE,'EPUB/text/colophon.xhtml'),'utf8')));
    for(const edition of Object.values(ordinaryMachinesEditions))for(const chapter of edition.chapters)assert.ok(colophon.includes(digest(ordinaryMachinesArticleSource(chapter,edition.lang))),'All 14 exact MDX digests');
    for(const font of ordinaryMachinesFontFiles){assert.deepEqual(readFileSync(join(SOURCE,'EPUB/fonts',font.name)),readFileSync(join(ROOT,font.source)));assert.deepEqual(readFileSync(join(SOURCE,'EPUB/fonts',font.license)),readFileSync(join(ROOT,'public/fonts/jlr',font.license)));}
    for(const directory of ['stablecoins'])assert.deepEqual(readFileSync(join(SOURCE,'EPUB/fonts',`LICENSE-${directory}.txt`)),readFileSync(join(ROOT,'public/fonts',directory,'LICENSE.txt')));
    for(const [name,values]of [['ch001.xhtml',book.introduction],['conclusion.xhtml',book.conclusion],['method.xhtml',book.method],['reader-guide.xhtml',book.readerGuide]]){const body=plain(fromHtml(readFileSync(join(SOURCE,'EPUB/text',name),'utf8')));for(const value of values)assert.ok(body.includes(value));}
    assert.ok(statSync(EPUB).size<16_000_000);
  });

  test(`${book.lang}: parsing fails closed on code, unapproved imports, mismatched figures and source drift`,async()=>{
    const chapter=book.chapters[0],original=ordinaryMachinesArticleSource(chapter,book.lang),component=ordinaryMachinesFigureSpecs[0][0];
    await assert.rejects(renderOrdinaryMachinesArticle(original,{...chapter}),/Unconfigured/u);
    for(const offset of [-1,NaN,Infinity,1.5,67])await assert.rejects(renderOrdinaryMachinesArticle(original,chapter,offset),/scene offset/u);
    for(const payload of ['\nimport fs from "node:fs";','\nexport const x=1;','\n{process.exit()}','\n<div {...x}/>','\n<script>alert(1)</script>','\n<img src="https://example.com/x"/>','\n<style>@import "https://example.com/x";</style>','\n<p style="display:none">x</p>','\n<a href="java&#x73;cript:alert(1)">x</a>','\n<a href="//evil.example/x">x</a>','\n<OtherFigure/>','\n## Ce qui change','\n## What remains'])await assert.rejects(renderOrdinaryMachinesArticle(original+payload,chapter),payload);
    for(const replacement of ['kind={"timeline"}','kind="timeline" {...evil}','kind="invented"'])await assert.rejects(renderOrdinaryMachinesArticle(original.replace('kind="timeline"',replacement),chapter));
    await assert.rejects(renderOrdinaryMachinesArticle(original.replace('kind="timeline"','kind="logging"'),chapter),/figure properties/u);
    await assert.rejects(renderOrdinaryMachinesArticle(original.replace(`../../components/${component}.astro`,'../../components/Other.astro'),chapter));
    await assert.rejects(renderOrdinaryMachinesArticle(original.replace(/^updatedDate:.*$/mu,'updatedDate: "2099-01-01T00:00:00Z"'),chapter),/predates/u);
    if(book.lang==='en')await assert.rejects(renderOrdinaryMachinesArticle(original.replace(/^sourceUpdatedDate:.*$/mu,'sourceUpdatedDate: "2020-01-01T00:00:00Z"'),chapter),/version drift/u);
  });

  test(`${book.lang}: reader CSS keeps two native scene layouts, responsive dimensions and complete font licences`,async()=>{
    const cover=await sharp(join(ROOT,'public',book.cover)).metadata();assert.ok(cover.width>=1000);assert.ok(cover.height>=1500);
    for(const width of [320,640,960])assert.equal((await sharp(join(ROOT,'public',book.cover.replace('.jpg',`-${width}.webp`))).metadata()).width,width);
    assert.deepEqual(readFileSync(join(SOURCE,'EPUB/media/cover.jpg')),readFileSync(join(ROOT,'public',book.cover)));
    const css=postcss.parse(readFileSync(join(SOURCE,'EPUB/styles/stylesheet1.css'),'utf8'));
    css.walkAtRules(rule=>assert.notEqual(rule.name,'import'));css.walkDecls(decl=>{
      if(decl.prop==='overflow')assert.notEqual(decl.value,'hidden');
      valueParser(decl.value).walk(n=>{if(n.type==='function'&&n.value==='url')assert.match(valueParser.stringify(n.nodes),/^\.\.\/fonts\/(?:inter|jetbrains-mono)\.woff2$/u);});
    });
    assert.match(css.toString(),/\.infographic-image\{[^}]*width:100%;height:auto/u);
    assert.match(css.toString(),/@media\(max-width:36em\)\{\.infographic-desktop\{display:none\}\.infographic-mobile\{display:block\}/u);
    const licences=plain(fromHtml(readFileSync(join(SOURCE,'EPUB/text/licenses.xhtml'),'utf8')));assert.ok(licences.includes('SIL OPEN FONT LICENSE'));assert.ok(licences.includes('Bitstream'));assert.ok(licences.includes('DejaVu'));assert.ok(licences.includes('l0g Cold Chain'));
  });
}

test('SVG baking refuses active markup, unknown paints/fonts, missing references and duplicate IDs',()=>{
  const source=readFileSync(join(ROOT,'src/figures/cold-chain-01/timeline.fr.desktop.svg'),'utf8');
  for(const payload of ['<script/>','<foreignObject/>','<image href="https://evil.example/x"/>','<style>@import "https://evil.example/x";</style>','<animate/>','<set/>'])assert.throws(()=>bakeOrdinaryMachinesSvg(source.replace('</svg>',payload+'</svg>'),1));
  for(const fill of ['var(--unknown)','url(https://evil.example/x)','url(#missing)','javascript:alert(1)','#ffffff'])assert.throws(()=>bakeOrdinaryMachinesSvg(source.replace('fill="var(--color-signal)"',`fill="${fill}"`),1));
  assert.throws(()=>bakeOrdinaryMachinesSvg(source.replace('<rect ','<rect onload="x" '),1));assert.throws(()=>bakeOrdinaryMachinesSvg(source.replace('</svg>',''),1));
  assert.throws(()=>bakeOrdinaryMachinesSvg(source.replace('</svg>','<rect id="cc-timeline-fr-d-t"/></svg>'),1));
  assert.throws(()=>bakeOrdinaryMachinesSvg(source.replace('<rect ','<rect href="https://evil.example/x" '),1));
  assert.throws(()=>bakeOrdinaryMachinesSvg(source.replace('font-family="l0g Cold Chain"','font-family="Unexpected"'),1));
  assert.throws(()=>bakeOrdinaryMachinesSvg(source.replace('aria-labelledby="cc-timeline-fr-d-t cc-timeline-fr-d-d"','aria-labelledby="missing"'),1));
});

test('URL validation rejects execution, ambiguous authority, credentials and hidden controls',()=>{
  for(const href of ['javascript:alert(1)','data:text/html,x','file:///etc/passwd','//evil.example','https://user:pass@example.com/a','https:\\evil.example/x','https://example.com/\nx',' #source-01','#'])assert.throws(()=>assertOrdinaryMachinesLink(href));
  for(const href of ['https://example.com/a.pdf?VersionId=x.y_2','mailto:editor@example.com','#source-01','/glossaire/reassurance/'])assert.doesNotThrow(()=>assertOrdinaryMachinesLink(href));
});

test('offline fragment and glossary resolution is strict and keeps external versioned documents exact',async()=>{
  const book=ordinaryMachinesEditions.fr,rendered=await renderBook(book),routes=new Map(rendered.map(r=>[r.chapter.route,r])),glossary=new Map(book.glossary.map(g=>[g.path,g.slug]));
  const chapter=book.chapters[0],source=ordinaryMachinesArticleSource(chapter,'fr');
  const bad=await renderOrdinaryMachinesArticle(source+'\n\n[broken](#missing-fragment)',chapter);assert.throws(()=>prepareOrdinaryMachinesReading(bad,chapter,routes,glossary),/Unresolved/u);
  const other=book.chapters[1],good=await renderOrdinaryMachinesArticle(source+`\n\n[chapter](${other.route}#source-01)`,chapter);assert.match(prepareOrdinaryMachinesReading(good,chapter,routes,glossary),/href="ch003.xhtml#c2-source-01"/u);
  const outside='https://example.com/source.pdf?VersionId=exact.x_1';
  const external=await renderOrdinaryMachinesArticle(source+`\n\n[external](${outside})`,chapter);assert.ok(prepareOrdinaryMachinesReading(external,chapter,routes,glossary).includes(outside));
  if(book.glossary.length){const entry=book.glossary[0],local=await renderOrdinaryMachinesArticle(source+`\n\n[term](${entry.path})`,chapter);assert.ok(prepareOrdinaryMachinesReading(local,chapter,routes,glossary).includes(`glossary.xhtml#glossary-${entry.slug}`));}
});

test('content validation rejects active resources and invalid lists without browser repair',()=>{
  for(const html of ['<p><section>Note</section></p>','<ol><p>x</p><li>Source</li></ol>','<figure><div>x</div><figcaption>Caption</figcaption><section>Method</section></figure>'])assert.throws(()=>assertOrdinaryMachinesContentModel(xmlTree(html)));
  for(const html of ['<iframe src="x"/>','<p onclick="x">x</p>','<img src="https://evil.example/pixel"/>'])assert.throws(()=>assertOrdinaryMachinesPassiveTree(fromHtml(html,{fragment:true})));
});

test('two fixed native editions have distinct identifiers and all real source contracts',async()=>{
  assert.notEqual(ordinaryMachinesEditions.fr.id,ordinaryMachinesEditions.en.id);
  assert.deepEqual(Object.values(ordinaryMachinesEditions).map(book=>book.directory),['la-guerre-des-machines-ordinaires','the-war-on-everyday-machines']);
  assert.deepEqual(ordinaryMachinesSourceCounts,[16,13,18,14,15,10,13]);assert.equal(ordinaryMachinesSourceCounts.reduce((a,b)=>a+b),99);
  for(const book of Object.values(ordinaryMachinesEditions)){assert.equal(book.chapters.length,7);assert.equal(book.figureCount,33);assert.equal(book.chapters.reduce((sum,c)=>sum+c.figureCount,0),33);assert.equal(book.date,'2026-11-04');}
  await assert.rejects(generateOrdinaryMachinesEpub('../outside'),/Unsupported/u);
});



test('chapter dates read natively in Paris time and omit a duplicate update instant',()=>{
  const meta={pubDate:'2026-11-03T23:00:57Z',updatedDate:'2026-11-04T00:00:57+01:00'};
  assert.equal(ordinaryMachinesChapterDateText(ordinaryMachinesEditions.fr,meta),'Publié le 4 novembre 2026');
  assert.equal(ordinaryMachinesChapterDateText(ordinaryMachinesEditions.en,meta),'Published 4 November 2026');
  const later={...meta,updatedDate:'2026-11-05T08:00:00+01:00'};
  assert.equal(ordinaryMachinesChapterDateText(ordinaryMachinesEditions.fr,later),'Publié le 4 novembre 2026 · Mis à jour le 5 novembre 2026');
  assert.equal(ordinaryMachinesChapterDateText(ordinaryMachinesEditions.en,later),'Published 4 November 2026 · Updated 5 November 2026');
  for(const value of [undefined,{}, {pubDate:'nonsense'},{pubDate:1},{pubDate:meta.pubDate,updatedDate:'invalid'}])assert.throws(()=>ordinaryMachinesChapterDateText(ordinaryMachinesEditions.fr,value));
  assert.throws(()=>ordinaryMachinesChapterDateText({...ordinaryMachinesEditions.en,locale:'fr-FR'},meta));
});
