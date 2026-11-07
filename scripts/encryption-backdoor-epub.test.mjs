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
import { encryptionBackdoorEditions } from '../src/config/encryption-backdoor-publication.mjs';
import { assertEncryptionBackdoorContentModel, assertEncryptionBackdoorPassiveTree, assertEncryptionBackdoorLink, bakeEncryptionBackdoorSvg, encryptionBackdoorArticleSource, encryptionBackdoorFigureSpecs, encryptionBackdoorFontFiles, encryptionBackdoorSvgFontFiles, encryptionBackdoorSourceCounts, encryptionBackdoorPalette, renderEncryptionBackdoorArticle, prepareEncryptionBackdoorReading, generateEncryptionBackdoorEpub, encryptionBackdoorChapterDateText, encryptionBackdoorCaptionLiteral, encryptionBackdoorSourceIds, referenceId } from './generate-encryption-backdoor-epub.mjs';

const ROOT=resolve(new URL('..',import.meta.url).pathname),SITE='https://l0g.fr';
const files=dir=>readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(join(dir,e.name)):[join(dir,e.name)]);
const nodes=n=>[n,...(n.children??[]).flatMap(nodes)];
const plain=n=>toText(n).replace(/\s+/gu,' ').trim();
const digest=value=>createHash('sha256').update(value).digest('hex');
const ast=unified().use(remarkParse).use(remarkGfm).use(remarkMdx);
const counts=[3,3,3,3,3,3,3];
const chapterFontDirectory=()=> 'ukraine-reparations';
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
    for(const chapter of book.chapters){const item=await renderEncryptionBackdoorArticle(encryptionBackdoorArticleSource(chapter,book.lang),chapter,offset);offset=item.next;rendered.push({...item,chapter});}
    return rendered;
  })());
  return renderedBooks.get(book.lang);
}

for(const book of Object.values(encryptionBackdoorEditions)){
  const SOURCE=join(ROOT,'src/epub',book.directory),EPUB=join(ROOT,'public',book.epub);
  test(`${book.lang}: all seven complete source bodies, 160 notices, methods and captions survive`,async()=>{
    let noticeTotal=0,figureTotal=0;
    for(const rendered of await renderBook(book)){
      const chapter=rendered.chapter,source=encryptionBackdoorArticleSource(chapter,book.lang),expected=nodes(ast.parse(parseFrontmatter(source).content));
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
      const ids=all.map(n=>n.properties?.id).filter(Boolean),notices=ids.filter(id=>new RegExp(`^c${chapter.number}-source-[A-Z]\\d{2}$`,'u').test(id));
      assert.deepEqual(notices,encryptionBackdoorSourceIds[chapter.number-1].map(id=>`c${chapter.number}-source-${id}`));noticeTotal+=notices.length;
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
    assert.equal(noticeTotal,160);assert.equal(figureTotal,21);
  });

  test(`${book.lang}: 42 complete SVG scenes preserve geometry, relationships, glyphs, fonts and exact citations`,async()=>{
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
          assert.equal(after[i].properties[key],match?encryptionBackdoorPalette[match[1]]:value);
        }else if(key==='href')assert.equal(after[i].properties.href,`../text/${rendered.chapter.chapter}#c${rendered.chapter.number}-${value.slice(1)}`);
      }
      const root=all.find(n=>n.tagName==='svg');assert.equal(Number(root.properties.viewBox.split(' ')[2]),scene.mobile?420:1000);
      const style=all.filter(n=>n.tagName==='style');assert.equal(style.length,1);
      const css=postcss.parse(toText(style[0]));assert.equal(css.nodes.length,1);
      for(const [i,face]of css.nodes.entries()){
        assert.equal(face.type,'atrule');assert.equal(face.name,'font-face');const props=Object.fromEntries(face.nodes.map(n=>[n.prop,n.value]));
        assert.equal(props['font-weight'],String(encryptionBackdoorSvgFontFiles[i].weight));
        assert.equal(props['font-family'],`"${before.find(n=>n.tagName==='text').properties.fontFamily}"`);
        const match=/^url\(data:font\/ttf;base64,([A-Za-z0-9+/=]+)\) format\("truetype"\)$/u.exec(props.src);assert.ok(match);
        assert.deepEqual(Buffer.from(match[1],'base64'),readFileSync(join(ROOT,'public/fonts',chapterFontDirectory(rendered.chapter.number),encryptionBackdoorSvgFontFiles[i].name)));
      }
      assert.doesNotMatch(scene.svg,/<(?:script|foreignObject|image|animate|set)\b|\son\w+=|javascript:|@import|var\(|color-mix\(/iu);
    }
    assert.equal(scenes,42);
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
    assert.equal(items.filter(i=>i['@_media-type']==='image/svg+xml').length,42);assert.equal(items.filter(i=>i['@_media-type']==='font/woff2').length,2);
    assert.equal(opf.spine.itemref.filter(i=>i['@_linear']==='no').length,42);assert.equal(opf.spine.itemref.filter(i=>i['@_linear']!=='no').length,20);
    for(const file of files(join(SOURCE,'EPUB')))if(!file.endsWith('/content.opf'))assert.ok(manifest.has(relative(join(SOURCE,'EPUB'),file)),`Unmanifested ${file}`);
    const spine=opf.spine.itemref.map(ref=>{const item=items.find(i=>i['@_id']===ref['@_idref']);assert.ok(item);return item['@_href'];});
    const nav=nodes(fromHtml(readFileSync(join(SOURCE,'EPUB/nav.xhtml'),'utf8'))).find(n=>n.tagName==='nav'&&n.properties.id==='toc');
    const positions=nodes(nav).filter(n=>n.tagName==='a').map(n=>spine.indexOf(n.properties.href.split('#')[0]));assert.ok(positions.every((p,i)=>p>=0&&(!i||p>=positions[i-1])));
    for(const file of files(SOURCE).filter(f=>/\.(?:xhtml|xml|opf|ncx|svg)$/u.test(f))){
      const raw=readFileSync(file,'utf8');assert.equal(XMLValidator.validate(raw),true,file);if(file.endsWith('.xhtml'))assertEncryptionBackdoorContentModel(xmlTree(raw));
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
    assert.equal(provenance.edition,book.id);assert.equal(provenance.modified,book.modified);assert.equal(provenance.sourceArticles.length,14);assert.equal(provenance.figures.length,42);
    for(const p of provenance.sourceArticles)assert.equal(p.sha256,digest(readFileSync(join(ROOT,p.file))));
    for(const p of provenance.figures){assert.equal(p.sourceSha256,digest(readFileSync(join(ROOT,p.sourceFile))));assert.equal(p.epubSha256,digest(readFileSync(join(SOURCE,p.epubFile))));}
    for(const p of provenance.fonts)assert.equal(p.sha256,digest(readFileSync(join(ROOT,p.file))));
    assert.equal(provenance.cover.sha256,digest(readFileSync(join(ROOT,provenance.cover.file))));
    const colophon=plain(fromHtml(readFileSync(join(SOURCE,'EPUB/text/colophon.xhtml'),'utf8')));
    for(const edition of Object.values(encryptionBackdoorEditions))for(const chapter of edition.chapters)assert.ok(colophon.includes(digest(encryptionBackdoorArticleSource(chapter,edition.lang))),'All 14 exact MDX digests');
    for(const font of encryptionBackdoorFontFiles){assert.deepEqual(readFileSync(join(SOURCE,'EPUB/fonts',font.name)),readFileSync(join(ROOT,font.source)));assert.deepEqual(readFileSync(join(SOURCE,'EPUB/fonts',font.license)),readFileSync(join(ROOT,'public/fonts/jlr',font.license)));}
    for(const directory of ['ukraine-reparations'])assert.deepEqual(readFileSync(join(SOURCE,'EPUB/fonts',`LICENSE-${directory}.txt`)),readFileSync(join(ROOT,'public/fonts',directory,'LICENSE.txt')));
    for(const [name,values]of [['ch001.xhtml',book.introduction],['conclusion.xhtml',book.conclusion],['method.xhtml',book.method],['reader-guide.xhtml',book.readerGuide]]){const body=plain(fromHtml(readFileSync(join(SOURCE,'EPUB/text',name),'utf8')));for(const value of values)assert.ok(body.includes(value));}
    assert.ok(statSync(EPUB).size<16_000_000);
  });

  test(`${book.lang}: parsing fails closed on code, unapproved imports, mismatched figures and source drift`,async()=>{
    const chapter=book.chapters[0],original=encryptionBackdoorArticleSource(chapter,book.lang),component=encryptionBackdoorFigureSpecs[0][0];
    await assert.rejects(renderEncryptionBackdoorArticle(original,{...chapter}),/Unconfigured/u);
    for(const offset of [-1,NaN,Infinity,1.5,43])await assert.rejects(renderEncryptionBackdoorArticle(original,chapter,offset),/scene offset/u);
    for(const payload of ['\nimport fs from "node:fs";','\nexport const x=1;','\n{process.exit()}','\n<div {...x}/>','\n<script>alert(1)</script>','\n<img src="https://example.com/x"/>','\n<style>@import "https://example.com/x";</style>','\n<p style="display:none">x</p>','\n<a href="java&#x73;cript:alert(1)">x</a>','\n<a href="//evil.example/x">x</a>','\n<OtherFigure/>','\n## Ce qui change','\n## What remains'])await assert.rejects(renderEncryptionBackdoorArticle(original+payload,chapter),payload);
    for(const replacement of ['kind={"parliament"}','kind="parliament" {...evil}','kind="invented"'])await assert.rejects(renderEncryptionBackdoorArticle(original.replace('kind="parliament"',replacement),chapter));
    await assert.rejects(renderEncryptionBackdoorArticle(original.replace('kind="parliament"','kind="message"'),chapter),/figure properties/u);
    await assert.rejects(renderEncryptionBackdoorArticle(original.replace(`../../components/${component}.astro`,'../../components/Other.astro'),chapter));
    await assert.rejects(renderEncryptionBackdoorArticle(original.replace(/^updatedDate:.*$/mu,'updatedDate: "2099-01-01T00:00:00Z"'),chapter),/predates/u);
    if(book.lang==='en')await assert.rejects(renderEncryptionBackdoorArticle(original.replace(/^sourceUpdatedDate:.*$/mu,'sourceUpdatedDate: "2020-01-01T00:00:00Z"'),chapter),/version drift/u);
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
    const coverRule=css.nodes.find(n=>n.type==='rule'&&n.selector==='.cover-page>img');assert.ok(coverRule);assert.deepEqual(Object.fromEntries(coverRule.nodes.map(n=>[n.prop,n.value])),{width:'auto',height:'auto','max-width':'100%','max-height':'100vh','object-fit':'contain'});
    const coverPageRule=css.nodes.find(n=>n.type==='rule'&&n.selector==='.cover-page'&&n.nodes.some(x=>x.prop==='display'));assert.equal(coverPageRule.nodes.find(n=>n.prop==='display').value,'flex');
    assert.match(css.toString(),/@media\(max-width:36em\)\{body\{padding:\.7em\}\.infographic-desktop\{display:none\}\.infographic-mobile\{display:block;max-width:21rem;margin-left:auto;margin-right:auto\}/u);
    const licences=plain(fromHtml(readFileSync(join(SOURCE,'EPUB/text/licenses.xhtml'),'utf8')));assert.ok(licences.includes('SIL OPEN FONT LICENSE'));assert.ok(licences.includes('Liberation Sans'));assert.ok(licences.includes('l0g Encryption'));assert.ok(licences.includes('Reserved Font Name Liberation'));
  });
}

test('SVG baking refuses active markup, unknown paints/fonts, missing references and duplicate IDs',()=>{
  const source=readFileSync(join(ROOT,'src/figures/encryption-access-2026/parliament.fr.desktop.svg'),'utf8');
  for(const payload of ['<script/>','<foreignObject/>','<image href="https://evil.example/x"/>','<style>@import "https://evil.example/x";</style>','<animate/>','<set/>'])assert.throws(()=>bakeEncryptionBackdoorSvg(source.replace('</svg>',payload+'</svg>'),1));
  for(const fill of ['var(--unknown)','url(https://evil.example/x)','url(#missing)','javascript:alert(1)','#ffffff'])assert.throws(()=>bakeEncryptionBackdoorSvg(source.replace('fill="var(--color-signal)"',`fill="${fill}"`),1));
  assert.throws(()=>bakeEncryptionBackdoorSvg(source.replace('<rect ','<rect onload="x" '),1));assert.throws(()=>bakeEncryptionBackdoorSvg(source.replace('</svg>',''),1));
  assert.throws(()=>bakeEncryptionBackdoorSvg(source.replace('</svg>','<rect id="enc-parliament-fr-d-title"/></svg>'),1));
  assert.throws(()=>bakeEncryptionBackdoorSvg(source.replace('<rect ','<rect href="https://evil.example/x" '),1));
  assert.throws(()=>bakeEncryptionBackdoorSvg(source.replace('font-family="l0g Encryption Access"','font-family="Unexpected"'),1));
  assert.throws(()=>bakeEncryptionBackdoorSvg(source.replace('aria-labelledby="enc-parliament-fr-d-title enc-parliament-fr-d-desc"','aria-labelledby="missing"'),1));
});

test('URL validation rejects execution, ambiguous authority, credentials and hidden controls',()=>{
  for(const href of ['javascript:alert(1)','data:text/html,x','file:///etc/passwd','//evil.example','https://user:pass@example.com/a','https:\\evil.example/x','https://example.com/\nx',' #source-01','#'])assert.throws(()=>assertEncryptionBackdoorLink(href));
  for(const href of ['https://example.com/a.pdf?VersionId=x.y_2','mailto:editor@example.com','#source-01','/glossaire/reassurance/'])assert.doesNotThrow(()=>assertEncryptionBackdoorLink(href));
});

test('offline fragment and glossary resolution is strict and keeps external versioned documents exact',async()=>{
  const book=encryptionBackdoorEditions.fr,rendered=await renderBook(book),routes=new Map(rendered.map(r=>[r.chapter.route,r])),glossary=new Map(book.glossary.map(g=>[g.path,g.slug]));
  const chapter=book.chapters[0],source=encryptionBackdoorArticleSource(chapter,'fr');
  const bad=await renderEncryptionBackdoorArticle(source+'\n\n[broken](#missing-fragment)',chapter);assert.throws(()=>prepareEncryptionBackdoorReading(bad,chapter,routes,glossary),/Unresolved/u);
  const other=book.chapters[1],good=await renderEncryptionBackdoorArticle(source+`\n\n[chapter](${other.route}#source-T01)`,chapter);assert.match(prepareEncryptionBackdoorReading(good,chapter,routes,glossary),/href="ch003.xhtml#c2-source-T01"/u);
  const outside='https://example.com/source.pdf?VersionId=exact.x_1';
  const external=await renderEncryptionBackdoorArticle(source+`\n\n[external](${outside})`,chapter);assert.ok(prepareEncryptionBackdoorReading(external,chapter,routes,glossary).includes(outside));
  if(book.glossary.length){const entry=book.glossary[0],local=await renderEncryptionBackdoorArticle(source+`\n\n[term](${entry.path})`,chapter);assert.ok(prepareEncryptionBackdoorReading(local,chapter,routes,glossary).includes(`glossary.xhtml#glossary-${entry.slug}`));}
});

test('content validation rejects active resources and invalid lists without browser repair',()=>{
  for(const html of ['<p><section>Note</section></p>','<ol><p>x</p><li>Source</li></ol>','<figure><div>x</div><figcaption>Caption</figcaption><section>Method</section></figure>'])assert.throws(()=>assertEncryptionBackdoorContentModel(xmlTree(html)));
  for(const html of ['<iframe src="x"/>','<p onclick="x">x</p>','<img src="https://evil.example/pixel"/>'])assert.throws(()=>assertEncryptionBackdoorPassiveTree(fromHtml(html,{fragment:true})));
});

test('two fixed native editions have distinct identifiers and all real source contracts',async()=>{
  assert.notEqual(encryptionBackdoorEditions.fr.id,encryptionBackdoorEditions.en.id);
  assert.deepEqual(Object.values(encryptionBackdoorEditions).map(book=>book.directory),['le-cout-d-une-porte-derobee','the-cost-of-a-backdoor']);
  assert.deepEqual(encryptionBackdoorSourceCounts,[24,25,27,23,20,21,20]);assert.equal(encryptionBackdoorSourceCounts.reduce((a,b)=>a+b),160);
  for(const book of Object.values(encryptionBackdoorEditions)){assert.equal(book.chapters.length,7);assert.equal(book.figureCount,21);assert.equal(book.chapters.reduce((sum,c)=>sum+c.figureCount,0),21);assert.equal(book.date,'2026-11-08');}
  await assert.rejects(generateEncryptionBackdoorEpub('../outside'),/Unsupported/u);
});



test('chapter dates read natively in Paris time and omit a duplicate update instant',()=>{
  const meta={pubDate:'2026-11-03T23:00:57Z',updatedDate:'2026-11-04T00:00:57+01:00'};
  assert.equal(encryptionBackdoorChapterDateText(encryptionBackdoorEditions.fr,meta),'Publié le 4 novembre 2026');
  assert.equal(encryptionBackdoorChapterDateText(encryptionBackdoorEditions.en,meta),'Published 4 November 2026');
  const later={...meta,updatedDate:'2026-11-05T08:00:00+01:00'};
  assert.equal(encryptionBackdoorChapterDateText(encryptionBackdoorEditions.fr,later),'Publié le 4 novembre 2026 · Mis à jour le 5 novembre 2026');
  assert.equal(encryptionBackdoorChapterDateText(encryptionBackdoorEditions.en,later),'Published 4 November 2026 · Updated 5 November 2026');
  for(const value of [undefined,{}, {pubDate:'nonsense'},{pubDate:1},{pubDate:meta.pubDate,updatedDate:'invalid'}])assert.throws(()=>encryptionBackdoorChapterDateText(encryptionBackdoorEditions.fr,value));
  assert.throws(()=>encryptionBackdoorChapterDateText({...encryptionBackdoorEditions.en,locale:'fr-FR'},meta));
});


test('caption extraction reads only literal data and refuses code, spreads and duplicate keys',()=>{
 const component=readFileSync(join(ROOT,'src/components/EncryptionAccessFigure.astro'),'utf8');
 assert.equal(encryptionBackdoorCaptionLiteral(component).parliament.number,'01');
 for(const value of ['(()=>{throw new Error("executed")})()','{...captions}','{get value(){return "x"}}','{["key"]:"x"}','{a:"x",a:"y"}','{__proto__:"x"}','{a:process.env}']){
  const source='---\nconst captions = '+value+';\n---\n';
  assert.throws(()=>encryptionBackdoorCaptionLiteral(source));
 }
 assert.throws(()=>encryptionBackdoorCaptionLiteral('---\nconst captions={a:"x"};const captions={b:"y"};\n---'));
 assert.throws(()=>encryptionBackdoorCaptionLiteral('x'.repeat(100001)));
});

test('SVG baking keeps deterministic path validation bounded and canonical licences complete',()=>{
 const source=readFileSync(join(ROOT,'src/figures/encryption-access-2026/parliament.fr.desktop.svg'),'utf8');
 const child=`import{bakeEncryptionBackdoorSvg}from'./scripts/generate-encryption-backdoor-epub.mjs';import{readFileSync}from'node:fs';const s=readFileSync('src/figures/encryption-access-2026/parliament.fr.desktop.svg','utf8').replace(/d="M[^\"]+"/u,'d="M'+'1'.repeat(8000)+' 1 L2 2"');try{bakeEncryptionBackdoorSvg(s,1);process.exit(1)}catch{process.exit(0)}`;
 const result=execFileSync(process.execPath,['--input-type=module','-e',child],{cwd:ROOT,timeout:4000,stdio:'pipe'});assert.equal(result.length,0);
 assert.throws(()=>bakeEncryptionBackdoorSvg(source.replace('font-weight="400"','font-weight="700"'),1));
 for(const ref of ['S09','S26','S29','T01',1,'01','S01#x'])assert.throws(()=>referenceId(1,ref));
 for(const ref of ['S01','S27','S30'])assert.equal(referenceId(1,ref),ref);
});
