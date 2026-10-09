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
import sharp from 'sharp';
import { microsoftEditions } from '../src/config/microsoft-publication.mjs';
import { bakeMicrosoftSvg, renderMicrosoftArticle, generateMicrosoftEpub, assertMicrosoftContentModel } from './generate-microsoft-epub.mjs';

const ROOT=resolve(new URL('..',import.meta.url).pathname);
const files=dir=>readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(join(dir,e.name)):[join(dir,e.name)]);
const nodes=node=>[node,...(node.children??[]).flatMap(nodes)];
const plain=node=>toText(node).replace(/\s+/gu,' ').trim();
const sourceText=node=>{
  if(['text','inlineCode','code'].includes(node.type))return node.value;
  const value=(node.children??[]).map(sourceText).join('');
  return ['details','summary','p','ol','li'].includes(node.name)?` ${value} `:value;
};
const astParser=unified().use(remarkParse).use(remarkGfm).use(remarkMdx);
const geometry=svg=>nodes(fromHtml(svg,{fragment:true})).filter(n=>n.type==='element').map(n=>({tag:n.tagName,properties:Object.fromEntries(Object.entries(n.properties??{}).filter(([k])=>!['fill','stroke','style','xmlns'].includes(k))),text:n.children?.filter(c=>c.type==='text').map(c=>c.value).join('')}));
// XML preserves the actual nesting. An HTML parser would repair malformed
// paragraph/list structures and conceal precisely the regression being tested.
const xmlTree=source=>{
  const convert=entries=>entries.flatMap(entry=>Object.entries(entry).filter(([key])=>key!==':@').map(([tag,value])=>tag==='#text'?{type:'text',value:String(value)}:{type:'element',tagName:tag,children:Array.isArray(value)?convert(value):[]}));
  return {type:'root',children:convert(new XMLParser({preserveOrder:true,ignoreAttributes:false}).parse(source))};
};

for(const book of Object.values(microsoftEditions)) {
  const SOURCE=join(ROOT,'src/epub',book.directory),EPUB=join(ROOT,'public',book.epub);
  const article=chapter=>readFileSync(join(ROOT,'src/content',book.lang==='fr'?'posts':'posts-en',`${chapter.slug}.mdx`),'utf8');

  test(`${book.lang}: seven MDX articles retain all prose, references, captions and methodological details`,async()=>{
    let figures=0;
    for(const chapter of book.chapters){
      const source=article(chapter),mdast=astParser.parse(parseFrontmatter(source).content),expected=nodes(mdast);
      const assembled=await renderMicrosoftArticle(source,chapter);
      const actual=fromHtml(readFileSync(join(SOURCE,'EPUB/text',chapter.chapter),'utf8')),all=nodes(actual),copy=plain(actual);
      for(const n of expected.filter(n=>['paragraph','tableCell','heading','code'].includes(n.type))){
        const value=sourceText(n).replace(/\s+/gu,' ').trim();
        if(value)assert.ok(copy.includes(value),`${chapter.slug}: lost text ${value.slice(0,150)}`);
      }
      for(const n of expected.filter(n=>n.type.startsWith('mdxJsx'))){
        const get=name=>n.attributes.find(a=>a.name===name)?.value;
        if(n.name.startsWith('Microsoft'))assert.ok(copy.includes(get('caption')),'Original caption');
        if(get('id'))assert.ok(all.some(n=>n.properties?.id===get('id')),'Original source ID');
        if(get('href')?.startsWith('https://'))assert.ok(all.some(n=>n.properties?.href===get('href')),'Original source URL');
      }
      for(const n of expected.filter(n=>n.type==='link' && n.url.startsWith('https://') && new URL(n.url).origin!=='https://l0g.fr'))assert.ok(all.some(a=>a.properties?.href===n.url),'Markdown source URL');
      assert.equal(all.filter(n=>n.tagName==='figure' && n.properties.className?.includes('infographic')).length,chapter.figureCount);
      assert.equal(all.filter(n=>n.tagName==='h1').length,1);
      assert.equal(all.filter(n=>['details','summary'].includes(n.tagName)).length,0);
      const ids=all.map(n=>n.properties?.id).filter(Boolean);assert.equal(ids.length,new Set(ids).size);
      for(const other of book.chapters.filter(c=>c!==chapter))assert.ok(all.some(n=>n.properties?.href===`${other.chapter}#article-${other.number}`));
      assert.equal(assembled.attachments.length,chapter.figureCount*2);figures+=assembled.figures.length;
    }
    assert.equal(figures,15);
  });

  test(`${book.lang}: 30 SVG compositions preserve original geometry, labels and semantic descriptions`,async()=>{
    let offset=0;
    for(const chapter of book.chapters){
      const assembled=await renderMicrosoftArticle(article(chapter),chapter,offset);offset=assembled.next;
      for(const a of assembled.attachments){
        assert.equal(XMLValidator.validate(a.svg),true);
        assert.deepEqual(geometry(a.svg),geometry(a.original));
        assert.equal(readFileSync(join(SOURCE,'EPUB/media',a.name),'utf8'),a.svg);
        assert.doesNotMatch(a.svg,/var\(|color-mix\(|<style|<script|<foreignObject|\son[a-z]+=/iu);
        const svg=nodes(fromHtml(a.svg,{fragment:true})).find(n=>n.tagName==='svg');
        const box=String(svg.properties.viewBox).split(' ').map(Number);
        assert.ok(box[2]===400 || box[2]===1000);
        assert.ok(box[3]>0);
      }
    }
    assert.equal(offset,30);
  });

  test(`${book.lang}: container, metadata, source digests, manifest and all offline links agree`,()=>{
    const entries=execFileSync('unzip',['-Z1',EPUB],{encoding:'utf8'}).trim().split('\n');
    assert.equal(entries[0],'mimetype');
    assert.equal(execFileSync('unzip',['-p',EPUB,'mimetype'],{encoding:'utf8'}),'application/epub+zip');
    assert.match(execFileSync('unzip',['-lv',EPUB],{encoding:'utf8'}).split('\n').find(l=>/\bmimetype$/u.test(l)),/Stored/u);
    assert.deepEqual(entries.sort(),files(SOURCE).map(f=>relative(SOURCE,f)).sort());
    for(const file of files(SOURCE))assert.deepEqual(execFileSync('unzip',['-p',EPUB,relative(SOURCE,file)]),readFileSync(file));
    const parser=new XMLParser({ignoreAttributes:false}),opf=parser.parse(readFileSync(join(SOURCE,'EPUB/content.opf'),'utf8')).package;
    assert.equal(opf.metadata['dc:language'],book.lang);assert.equal(opf.metadata['dc:title'],book.title);
    assert.equal(opf.metadata['dc:identifier']['#text'],book.id);assert.equal(opf.metadata['dc:date'],'2026-10-09');
    assert.equal(opf.metadata.meta.find(m=>m['@_property']==='dcterms:modified')['#text'],'2026-10-09T09:30:00Z');
    assert.equal(opf.manifest.item.filter(i=>i['@_media-type']==='image/svg+xml').length,30);
    assert.equal(opf.manifest.item.filter(i=>i['@_media-type']==='image/jpeg').length,9);
    assert.equal(opf.spine.itemref.filter(i=>i['@_linear']!=='no').length,16);
    assert.equal(opf.spine.itemref.filter(i=>i['@_linear']==='no').length,30);
    const items=new Set(opf.manifest.item.map(i=>i['@_id']));
    for(const r of opf.spine.itemref)assert.ok(items.has(r['@_idref']));
    const spineFiles=opf.spine.itemref.map(r=>opf.manifest.item.find(i=>i['@_id']===r['@_idref'])['@_href']);
    const toc=nodes(fromHtml(readFileSync(join(SOURCE,'EPUB/nav.xhtml'),'utf8'))).filter(n=>n.tagName==='a').map(n=>String(n.properties.href).split('#')[0]);
    const positions=toc.map(href=>spineFiles.indexOf(href));
    assert.ok(positions.every((p,i)=>p>=0 && (i===0 || p>=positions[i-1])),'TOC follows the spine');
    const colophon=plain(fromHtml(readFileSync(join(SOURCE,'EPUB/text/ch010.xhtml'),'utf8')));
    for(const chapter of book.chapters)assert.ok(colophon.includes(createHash('sha256').update(article(chapter)).digest('hex')),'Source hash drift');
    for(const file of files(SOURCE).filter(f=>/\.(?:xhtml|xml|opf|ncx|svg)$/u.test(f))){
      const raw=readFileSync(file,'utf8');assert.equal(XMLValidator.validate(raw),true,file);
      if(file.endsWith('.xhtml'))assertMicrosoftContentModel(xmlTree(raw));
      const visit=node=>{
        if(!node || typeof node!=='object')return;
        for(const[key,value]of Object.entries(node)){
          if(['@_href','@_src','@_full-path'].includes(key) && !/^(?:https?:|mailto:)/u.test(value)){
            const[name,fragment]=String(value).split('#');
            const target=name?resolve(key==='@_full-path'?SOURCE:dirname(file),decodeURIComponent(name)):file;
            assert.ok(target.startsWith(SOURCE+'/') && existsSync(target),`Unresolved ${file}: ${value}`);
            if(key==='@_href' && file.endsWith('.xhtml') && target.endsWith('.svg'))assert.ok(spineFiles.includes(relative(join(SOURCE,'EPUB'),target)),'Enlargement target belongs to the spine');
            if(fragment)assert.ok(readFileSync(target,'utf8').includes(`id="${decodeURIComponent(fragment)}"`),`Missing fragment ${value}`);
          }
          if(key==='@_src')assert.doesNotMatch(String(value),/^(?:https?:|data:|\/\/)/u);
          visit(value);
        }
      };
      visit(parser.parse(raw));
      assert.doesNotMatch(raw,/<(?:script|iframe|object|embed|foreignObject|form|input|audio|video)\b|\son\w+=|javascript:|@import|—/iu);
    }
    for(const file of ['half_title.xhtml','title_page.xhtml','method.xhtml','figures.xhtml'])assert.ok(existsSync(join(SOURCE,'EPUB/text',file)));
    const intro=plain(fromHtml(readFileSync(join(SOURCE,'EPUB/text/ch001.xhtml'),'utf8'))),conclusion=plain(fromHtml(readFileSync(join(SOURCE,'EPUB/text/ch009.xhtml'),'utf8')));
    for(const p of book.introduction)assert.ok(intro.includes(p));for(const p of book.conclusion)assert.ok(conclusion.includes(p));
    assert.ok(statSync(EPUB).size<8_000_000);
  });

  test(`${book.lang}: MDX parser fails closed on execution, imports, spreads and foreign markup`,async()=>{
    const chapter=book.chapters[0],original=article(chapter);
    await assert.rejects(renderMicrosoftArticle(original,{...chapter}),/Unconfigured/u);
    await assert.rejects(renderMicrosoftArticle(original.replace(/^updatedDate:.*$/mu,'updatedDate: 2099-01-01T00:00:00Z'),chapter),/predates/u);
    if(book.lang==='en')await assert.rejects(renderMicrosoftArticle(original.replace(/^sourceUpdatedDate:.*$/mu,'sourceUpdatedDate: 2020-01-01T00:00:00Z'),chapter),/version drift/u);
    for(const payload of ['\nimport x from "node:fs";','\nexport const a=1;','\n{process.exit()}','\n<div {...x} />','\n<script>alert(1)</script>','\n<a href="java&#x73;cript:alert(1)">x</a>','\n<a href="//example.com">x</a>','\n<img src="https://example.com/pixel"/>','\n<style>@import "https://example.com/a";</style>','\n<p style="display:none">x</p>','\n<MicrosoftUnknownFigure />','\n## Ce qui change','\n## What remains'])await assert.rejects(renderMicrosoftArticle(original+payload,chapter),payload);
    for(const replacement of ['kind={"dependencies"}','kind="dependencies" {...evil}','kind="invented"'])await assert.rejects(renderMicrosoftArticle(original.replace('kind="dependencies"',replacement),chapter));
    await assert.rejects(renderMicrosoftArticle(original.replace("../../components/MicrosoftExitFigure.astro","../../components/Other.astro"),chapter));
    const blocks=await renderMicrosoftArticle(original+'\n\n<p>Before <details><summary>Method</summary><p>Complete detail.</p></details> After</p>\n\n<ol><li id="test-item">Complete list.</li></ol>',chapter);
    assertMicrosoftContentModel(xmlTree(blocks.html));
    assert.ok(plain(fromHtml(blocks.html)).includes('Complete detail.'));
    await assert.rejects(renderMicrosoftArticle(original+'\n\n<ol>Unwrapped text</ol>',chapter),/Invalid EPUB list child/u);
  });

  test(`${book.lang}: assets and passive styles preserve responsive compositions without clipping`,async()=>{
    for(const[path,width,height]of [[book.cover,1024,1638],[book.panorama,1600,800]]){
      const m=await sharp(join(ROOT,'public',path)).metadata();assert.equal(m.width,width);assert.equal(m.height,height);
    }
    const css=readFileSync(join(SOURCE,'EPUB/styles/stylesheet1.css'),'utf8');
    const tree=postcss.parse(css);
    tree.walkAtRules(rule=>assert.notEqual(rule.name,'import'));
    tree.walkDecls(decl=>{
      assert.doesNotMatch(decl.value,/url\(|expression\(|javascript:/iu);
      if(decl.prop==='overflow')assert.notEqual(decl.value,'hidden');
    });
    assert.match(css,/\.infographic-image\s*\{[^}]*height:auto/u);
    assert.match(css,/@media\(max-width:36em\)/u);
    assert.deepEqual(readFileSync(join(SOURCE,'EPUB/media/cover.jpg')),readFileSync(join(ROOT,'public',book.cover)));
    assert.deepEqual(readFileSync(join(SOURCE,'EPUB/media/panorama.jpg')),readFileSync(join(ROOT,'public',book.panorama)));
  });
}

test('SVG colour baking rejects executable content, remote resources and unknown roles',()=>{
  const fixture='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" style="width:100%;height:auto"><title>A</title><desc>B</desc><rect width="400" height="500" fill="var(--color-ink, #0c0d10)"/></svg>';
  assert.match(bakeMicrosoftSvg(fixture),/fill="#0c0d10"/u);
  for(const payload of ['<script/>','<foreignObject/>','<image href="https://example.com/a"/>','<style>@import "x";</style>','<animate/>'])assert.throws(()=>bakeMicrosoftSvg(fixture.replace('</svg>',payload+'</svg>')));
  for(const value of ['var(--color-unknown, red)','var(--color-constructor)','url(https://example.com/a)','javascript:alert(1)','var(--color-ink) url(x)'])assert.throws(()=>bakeMicrosoftSvg(fixture.replace('var(--color-ink, #0c0d10)',value)));
  assert.throws(()=>bakeMicrosoftSvg(fixture.replace('<rect ','<rect onload="alert(1)" ')));
  assert.throws(()=>bakeMicrosoftSvg(fixture.replace('</svg>','')));
  assert.throws(()=>bakeMicrosoftSvg(fixture.replace('<title>A</title>','<title>What changes</title>')),/Forbidden SVG title/u);
});

test('content-model validation rejects paragraph blocks, malformed lists and displaced captions without browser repair',()=>{
  for(const html of ['<p><section>Note</section></p>','<ol><p></p><li>Source</li></ol>','<figure><div>Image</div><figcaption>Caption</figcaption><section>Method</section></figure>'])assert.throws(()=>assertMicrosoftContentModel(xmlTree(html)));
  assert.doesNotThrow(()=>assertMicrosoftContentModel(xmlTree('<div><figure><div>Image</div><figcaption>Caption</figcaption></figure><section>Method</section></div>')));
});

test('book identity, dates and generation commands remain explicit and reproducible',async()=>{
  assert.notEqual(microsoftEditions.fr.id,microsoftEditions.en.id);
  await assert.rejects(generateMicrosoftEpub('../outside'),/Unsupported Microsoft/u);
  const pkg=JSON.parse(readFileSync(join(ROOT,'package.json'),'utf8'));
  assert.ok(pkg.scripts['build:epub'].includes('node scripts/generate-microsoft-epub.mjs'));
  assert.ok(pkg.scripts['test:epub'].includes('scripts/microsoft-epub.test.mjs'));
  for(const book of Object.values(microsoftEditions))assert.equal(book.chapters.reduce((n,c)=>n+c.figureCount,0),15);
  assert.throws(()=>execFileSync(process.execPath,['scripts/build-epub.mjs','../unconfigured'],{cwd:ROOT,stdio:'pipe'}));
});
