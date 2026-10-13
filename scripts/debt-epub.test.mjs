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
import opentype from '@shuding/opentype.js';
import sharp from 'sharp';
import { debtEditions } from '../src/config/debt-publication.mjs';
import { assertFontLicenseReferences } from './font-license-assertions.mjs';
import { assertMicrosoftContentModel } from './generate-microsoft-epub.mjs';
import { bakeDebtSvg, renderDebtArticle, prepareDebtReading, generateDebtEpub, debtPalettes, debtFontFiles, debtSvgFontCss } from './generate-debt-epub.mjs';

const ROOT=resolve(new URL('..',import.meta.url).pathname);
const files=dir=>readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(join(dir,e.name)):[join(dir,e.name)]);
const nodes=node=>[node,...(node.children??[]).flatMap(nodes)];
const plain=node=>toText(node).replace(/\s+/gu,' ').trim();
const tight=value=>value.replace(/\s+/gu,'');
const digest=value=>createHash('sha256').update(value).digest('hex');
const astParser=unified().use(remarkParse).use(remarkGfm).use(remarkMdx);
const sourceText=node=>node.type==='mdxTextExpression'?node.data.estree.body[0].expression.value:['text','inlineCode','code'].includes(node.type)?node.value:(node.children??[]).map(sourceText).join('');
const proseNodes=node=>node.name==='svg'||node.name==='style'?[]:[node,...(node.children??[]).flatMap(proseNodes)];
const geometry=svg=>nodes(fromHtml(svg,{fragment:true})).filter(n=>n.type==='element' && n.tagName!=='style').map(n=>({tag:n.tagName,properties:Object.fromEntries(Object.entries(n.properties??{}).filter(([k])=>!['fill','stroke','stopColor','style','xmlns','id','ariaLabelledBy','href'].includes(k))),text:n.children?.filter(c=>c.type==='text').map(c=>c.value).join('')}));
const xmlTree=source=>{
  const convert=entries=>entries.flatMap(entry=>Object.entries(entry).filter(([key])=>key!==':@').map(([tag,value])=>tag==='#text'?{type:'text',value:String(value)}:{type:'element',tagName:tag,children:Array.isArray(value)?convert(value):[]}));
  return {type:'root',children:convert(new XMLParser({preserveOrder:true,ignoreAttributes:false}).parse(source))};
};
const fontSource=join(ROOT,'src/epub-assets/debt-chain-fonts');
const font=file=>{const bytes=readFileSync(join(fontSource,file));return opentype.parse(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength));};
const fonts=Object.fromEntries(debtFontFiles.map(file=>[file,{full:font(file),subset:font(file.replace('.ttf','-svg-subset.ttf'))}]));

for(const book of Object.values(debtEditions)) {
  const article=chapter=>readFileSync(join(ROOT,'src/content',book.lang==='fr'?'posts':'posts-en',`${chapter.slug}.mdx`),'utf8');
  for(const edition of book.editions) {
    const SOURCE=join(ROOT,'src/epub',edition.directory),EPUB=join(ROOT,'public',edition.epub),label=`${book.lang}/${edition.theme}`;
    test(`${label}: all seven articles retain prose, notes, bibliography, qualifications and 40 captions`,async()=>{
      let count=0,offset=0;
      for(const chapter of book.chapters) {
        const source=article(chapter),expected=proseNodes(astParser.parse(parseFrontmatter(source).content));
        const assembled=await renderDebtArticle(source,chapter,edition.theme,offset);offset=assembled.next;
        const actual=fromHtml(readFileSync(join(SOURCE,'EPUB/text',chapter.chapter),'utf8')),all=nodes(actual),copy=tight(plain(actual));
        for(const n of expected.filter(n=>['paragraph','tableCell','heading','code'].includes(n.type))) {
          const value=tight(sourceText(n));
          if(value)assert.ok(copy.includes(value),`${chapter.slug}: lost text ${value.slice(0,150)}`);
        }
        for(const n of expected.filter(n=>n.type?.startsWith('mdxJsx'))) {
          const attrs=Object.fromEntries(n.attributes.map(a=>[a.name,a.value]));
          if(attrs.id)assert.ok(all.some(n=>n.properties?.id===attrs.id),`Original identifier ${attrs.id}`);
          if(attrs.href?.startsWith('https://') && new URL(attrs.href).origin!=='https://l0g.fr')assert.ok(all.some(n=>n.properties?.href===attrs.href),`Original citation ${attrs.href}`);
        }
        for(const n of expected.filter(n=>n.type==='link' && n.url.startsWith('https://') && new URL(n.url).origin!=='https://l0g.fr'))assert.ok(all.some(n=>n.properties?.href===n.url),'Original Markdown source URL');
        for(const f of assembled.figures)assert.ok(copy.includes(tight(f.caption)),'Complete original figure caption');
        assert.equal(all.filter(n=>n.tagName==='figure').length,chapter.figureCount);
        assert.equal(all.filter(n=>n.tagName==='h1').length,1);
        const ids=all.map(n=>n.properties?.id).filter(Boolean);assert.equal(ids.length,new Set(ids).size);
        count+=chapter.figureCount;
      }
      assert.equal(count,40);assert.equal(offset,80);
    });
    test(`${label}: 80 compositions retain all geometry, labels and source links with resolved theme paints`,async()=>{
      let offset=0;
      for(const chapter of book.chapters) {
        const assembled=await renderDebtArticle(article(chapter),chapter,edition.theme,offset);offset=assembled.next;
        for(const a of assembled.attachments) {
          assert.equal(XMLValidator.validate(a.svg),true);
          assert.deepEqual(geometry(a.svg),geometry(a.original),'Original geometry and visible text');
          assert.equal(readFileSync(join(SOURCE,'EPUB/media',a.name),'utf8'),a.svg);
          assert.doesNotMatch(a.svg,/var\(|color-mix\(|<script|<foreignObject|\son[a-z]+=/iu);
          const baked=nodes(fromHtml(a.svg,{fragment:true})),original=nodes(fromHtml(a.original,{fragment:true}));
          const svg=baked.find(n=>n.tagName==='svg');
          const ids=baked.map(n=>n.properties?.id).filter(Boolean);
          assert.equal(ids.length,new Set(ids).size);
          ids.forEach(id=>assert.match(id,/^[A-Za-z_][\w.-]*$/u));
          const labelled=svg.properties.ariaLabelledBy;
          for(const id of labelled)assert.ok(ids.includes(id),'Accessible name refers to actual XML ID');
          for(const p of baked.flatMap(n=>Object.values(n.properties??{})))if(typeof p==='string' && p.startsWith('url(#'))assert.ok(ids.includes(p.slice(5,-1)),'Pattern/gradient local reference');
          for(const n of original.filter(n=>n.tagName==='a'))assert.ok(baked.some(a=>a.properties?.href===`../text/${chapter.chapter}${n.properties.href}`),'SVG source note opens its chapter offline');
          const texts=original.filter(n=>n.tagName==='text'),family=texts[0].properties.fontFamily.startsWith('DejaVu')?'DejaVu Sans':'Arial';
          const styles=baked.filter(n=>n.tagName==='style');assert.equal(styles.length,1);
          assert.equal(digest(styles[0].children.map(n=>n.value??'').join('')),digest(debtSvgFontCss(family)),'Only the controlled local subset stylesheet is embedded');
          assert.equal(baked.find(n=>n.tagName==='rect').properties.fill,debtPalettes[edition.theme].ink,'Native theme canvas');
        }
      }
      assert.equal(offset,80);
    });
    test(`${label}: EPUB ZIP, XML, identifiers, manifest, spine and every offline link agree`,()=>{
      const entries=execFileSync('unzip',['-Z1',EPUB],{encoding:'utf8'}).trim().split('\n');
      assert.equal(entries[0],'mimetype');
      assert.equal(execFileSync('unzip',['-p',EPUB,'mimetype'],{encoding:'utf8'}),'application/epub+zip');
      assert.match(execFileSync('unzip',['-lv',EPUB],{encoding:'utf8'}).split('\n').find(l=>/\bmimetype$/u.test(l)),/Stored/u);
      assert.deepEqual(entries.sort(),files(SOURCE).map(f=>relative(SOURCE,f)).sort());
      for(const file of files(SOURCE))assert.deepEqual(execFileSync('unzip',['-p',EPUB,relative(SOURCE,file)]),readFileSync(file));
      const parser=new XMLParser({ignoreAttributes:false}),opf=parser.parse(readFileSync(join(SOURCE,'EPUB/content.opf'),'utf8')).package;
      assert.equal(opf.metadata['dc:language'],book.lang);assert.equal(opf.metadata['dc:title'],book.title);
      assert.equal(opf.metadata['dc:identifier']['#text'],edition.id);assert.equal(opf.metadata['dc:date'],book.date);
      assert.equal(opf.metadata.meta.find(m=>m['@_property']==='dcterms:modified')['#text'],book.modified);
      assert.equal(opf.manifest.item.filter(i=>i['@_media-type']==='image/svg+xml').length,80);
      assert.equal(opf.manifest.item.filter(i=>i['@_media-type']==='font/ttf').length,4);
      assert.equal(opf.manifest.item.filter(i=>i['@_media-type']==='image/jpeg').length,1);
      const items=new Map(opf.manifest.item.map(i=>[i['@_id'],i['@_href']]));
      assert.equal(items.size,opf.manifest.item.length);
      for(const r of opf.spine.itemref)assert.ok(items.has(r['@_idref']));
      const spineFiles=opf.spine.itemref.map(r=>items.get(r['@_idref']));
      const toc=nodes(fromHtml(readFileSync(join(SOURCE,'EPUB/nav.xhtml'),'utf8'))).filter(n=>n.tagName==='a').map(n=>String(n.properties.href).split('#')[0]);
      const positions=toc.map(href=>spineFiles.indexOf(href));
      assert.ok(positions.every((p,i)=>p>=0 && (i===0 || p>=positions[i-1])),'TOC follows the linear reading order');
      assert.equal(opf.spine.itemref.filter(i=>i['@_linear']==='no').length,80);
      const colophon=plain(fromHtml(readFileSync(join(SOURCE,'EPUB/text/ch010.xhtml'),'utf8')));
      for(const chapter of book.chapters)assert.ok(colophon.includes(digest(article(chapter))),'Exact source MDX digest');
      for(const file of files(SOURCE).filter(f=>/\.(?:xhtml|xml|opf|ncx|svg)$/u.test(f))) {
        const raw=readFileSync(file,'utf8');assert.equal(XMLValidator.validate(raw),true,file);
        if(file.endsWith('.xhtml'))assertMicrosoftContentModel(xmlTree(raw));
        const visit=node=>{
          if(!node||typeof node!=='object')return;
          for(const[key,value]of Object.entries(node)) {
            if(['@_href','@_src','@_full-path'].includes(key) && !/^(?:https?:|mailto:)/u.test(value)) {
              const[name,fragment]=String(value).split('#');
              const target=name?resolve(key==='@_full-path'?SOURCE:dirname(file),decodeURIComponent(name)):file;
              assert.ok(target.startsWith(SOURCE+'/') && existsSync(target),`Unresolved ${file}: ${value}`);
              if(fragment)assert.ok(readFileSync(target,'utf8').includes(`id="${decodeURIComponent(fragment)}"`),`Missing fragment ${value}`);
              if(key==='@_href' && file.endsWith('.xhtml') && target.endsWith('.svg'))assert.ok(spineFiles.includes(relative(join(SOURCE,'EPUB'),target)),'Enlargement belongs to non-linear SVG spine');
            }
            if(key==='@_src')assert.doesNotMatch(String(value),/^(?:https?:|data:|\/\/)/u);
            visit(value);
          }
        };
        visit(parser.parse(raw));
        assert.doesNotMatch(raw,/<(?:script|iframe|object|embed|foreignObject|form|input|audio|video)\b|\son\w+=|javascript:|@import|—/iu);
      }
      for(const file of ['half_title.xhtml','title_page.xhtml','method.xhtml','figures.xhtml','glossary.xhtml'])assert.ok(existsSync(join(SOURCE,'EPUB/text',file)));
      const intro=plain(fromHtml(readFileSync(join(SOURCE,'EPUB/text/ch001.xhtml'),'utf8'))),conclusion=plain(fromHtml(readFileSync(join(SOURCE,'EPUB/text/ch009.xhtml'),'utf8'))),method=plain(fromHtml(readFileSync(join(SOURCE,'EPUB/text/method.xhtml'),'utf8'))),glossary=plain(fromHtml(readFileSync(join(SOURCE,'EPUB/text/glossary.xhtml'),'utf8')));
      for(const p of book.introduction)assert.ok(intro.includes(p));for(const p of book.conclusion)assert.ok(conclusion.includes(p));
      for(const p of [...book.method,...book.readerGuide])assert.ok(method.includes(p));
      for(const g of book.glossary)assert.ok(glossary.includes(g.definition));
      assert.ok(statSync(EPUB).size<5_000_000,'Bounded download size');
    });
    test(`${label}: explicit foreground/background and fonts remain passive and responsive`,async()=>{
      const css=readFileSync(join(SOURCE,'EPUB/styles/stylesheet1.css'),'utf8'),tree=postcss.parse(css);
      tree.walkAtRules(rule=>assert.notEqual(rule.name,'import'));
      tree.walkDecls(decl=>{
        assert.doesNotMatch(decl.value,/expression\(|javascript:/iu);
        if(decl.prop==='overflow')assert.notEqual(decl.value,'hidden');
        if(decl.value.includes('url('))assert.ok(debtFontFiles.some(f=>decl.value===`url("../fonts/${f}") format("truetype")`),'Only canonical embedded font references');
      });
      const body=tree.nodes.find(n=>n.selector==='html,body');
      assert.equal(body.nodes.find(d=>d.prop==='color').value,debtPalettes[edition.theme].paper);
      assert.equal(body.nodes.find(d=>d.prop==='background').value,debtPalettes[edition.theme].ink);
      assert.match(css,/\.infographic-image\{[^}]*width:100%;height:auto/u);assert.match(css,/@media\(max-width:36em\)/u);
      const cover=await sharp(join(SOURCE,'EPUB/media/cover.jpg')).metadata();assert.equal(cover.width,1024);assert.equal(cover.height,1638);
      assert.deepEqual(readFileSync(join(SOURCE,'EPUB/media/cover.jpg')),readFileSync(join(ROOT,'public',book.cover)));
      for(const file of debtFontFiles)assert.deepEqual(readFileSync(join(SOURCE,'EPUB/fonts',file)),readFileSync(join(fontSource,file)));
      for(const family of ['dejavu','liberation'])assertFontLicenseReferences(readFileSync(join(SOURCE,'EPUB/fonts',`${family}-LICENSE.txt`),'utf8'),family);
    });
  }
  test(`${book.lang}: only one dark edition exists and removed light assets cannot be rebuilt`,async()=>{
    assert.deepEqual(book.editions.map(e=>e.theme),['dark']);
    assert.equal(book.editions[0].directory,`${book.directory}-dark`);
    assert.equal(book.editions[0].epub,`/publications/${book.directory}-dark-l0g.epub`);
    assert.equal(existsSync(join(ROOT,'src/epub',`${book.directory}-light`)),false,'No orphan light source tree');
    assert.equal(existsSync(join(ROOT,'public/publications',`${book.directory}-light-l0g.epub`)),false,'No orphan light download');
    await assert.rejects(generateDebtEpub(book.lang,'light'),/Unsupported debt EPUB theme/u);
    await assert.rejects(renderDebtArticle(article(book.chapters[0]),book.chapters[0],'light'),/Unsupported debt EPUB theme/u);
    assert.throws(()=>execFileSync(process.execPath,['scripts/build-epub.mjs',`${book.directory}-light`],{cwd:ROOT,stdio:'pipe'}));
    const method=readFileSync(join(ROOT,'src/epub',book.editions[0].directory,'EPUB/text/method.xhtml'),'utf8');
    assert.doesNotMatch(method,/Les deux éditions|Both editions|fond clair|light edition/iu);
  });
  test(`${book.lang}: MDX adapter fails closed on imports, executable expressions, styles, markup and unsafe URLs`,async()=>{
    const chapter=book.chapters[0],original=article(chapter);
    await assert.rejects(renderDebtArticle(original,{...chapter},'dark'),/Unconfigured/u);
    await assert.rejects(renderDebtArticle(original,chapter,'invented'),/Unsupported/u);
    await assert.rejects(renderDebtArticle(original.replace(/^updatedDate:.*$/mu,'updatedDate: 2099-01-01T00:00:00Z'),chapter,'dark'),/predates/u);
    if(book.lang==='en')await assert.rejects(renderDebtArticle(original.replace(/^sourceUpdatedDate:.*$/mu,'sourceUpdatedDate: 2020-01-01T00:00:00Z'),chapter,'dark'),/version drift/u);
    for(const payload of ['\nimport x from "node:fs";','\nexport const a=1;','\n{process.exit()}','\n{"unapproved expression"}','\n<div {...x} />','\n<script>alert(1)</script>','\n<a href="java&#x73;cript:alert(1)">x</a>','\n<a href="//example.com">x</a>','\n<a href="../../secret">x</a>','\n<a href="https://name:secret@example.com/">x</a>','\n<img src="https://example.com/pixel"/>','\n<style>{`@import "https://example.com/a";`}</style>','\n<p style="display:none">x</p>','\n<UnknownComponent />','\n## Ce qui change','\n## What remains'])await assert.rejects(renderDebtArticle(original+payload,chapter,'dark'),payload);
    await assert.rejects(renderDebtArticle(original.replace('<style>{`','<style>{evil + `'),chapter,'dark'));
    await assert.rejects(renderDebtArticle(original.replace('<svg xmlns=', '<svg onload="alert(1)" xmlns='),chapter,'dark'));
    const inserted='<a href="/posts/dette-etats-02-bilan-intermediaires/">Next</a><a href="https://l0g.fr.evil.example/posts/dette-etats-02-bilan-intermediaires/">Fake origin</a><a href="https://l0g.fr/posts/dette-etats-02-bilan-intermediaires/?unexpected=1">Query</a>';
    const reading=prepareDebtReading((await renderDebtArticle(original+'\n'+inserted,chapter,'dark')).html,book,chapter.number);
    const exercises=new Set(['Next','Fake origin','Query']);
    const links=nodes(fromHtml(reading.html,{fragment:true})).filter(n=>n.tagName==='a' && exercises.has(toText(n))).map(n=>[toText(n),n.properties.href]);
    const expected=book.lang==='fr'?'ch003.xhtml#article-2':'https://l0g.fr/posts/dette-etats-02-bilan-intermediaires/';
    assert.deepEqual(links,[
      ['Next',expected],
      ['Fake origin','https://l0g.fr.evil.example/posts/dette-etats-02-bilan-intermediaires/'],
      ['Query','https://l0g.fr/posts/dette-etats-02-bilan-intermediaires/?unexpected=1'],
    ]);
  });
}

test('font subsets include every original glyph with the original complete-font advance width',()=>{
  for(const book of Object.values(debtEditions))for(const chapter of book.chapters) {
    const source=readFileSync(join(ROOT,'src/content',book.lang==='fr'?'posts':'posts-en',`${chapter.slug}.mdx`),'utf8');
    for(const [svg]of source.matchAll(/<svg\b[\s\S]*?<\/svg>/gu))for(const node of nodes(fromHtml(svg,{fragment:true})).filter(n=>n.tagName==='text')) {
      const family=node.properties.fontFamily.startsWith('DejaVu')?'dejavu-sans':'liberation-sans',weight=node.properties.fontWeight,file=`${family}-${weight}.ttf`,value=toText(node),size=Number(node.properties.fontSize);
      const {full,subset}=fonts[file];
      for(const char of value)assert.ok(subset.charToGlyphIndex(char)>0,`${file}: missing U+${char.codePointAt(0).toString(16)}`);
      assert.equal(subset.getAdvanceWidth(value,size),full.getAdvanceWidth(value,size),'Subset retains complete-font metrics');
    }
  }
});


// Read the sfnt name table directly: the existing OpenType subset exposes glyph
// tables but deliberately omits names. No font metadata is evaluated as code.
function fontNames(bytes) {
  const count=bytes.readUInt16BE(4); let nameOffset;
  for(let i=0;i<count;i++) {
    const row=12+i*16;
    if(bytes.toString('ascii',row,row+4)==='name') {
      nameOffset=bytes.readUInt32BE(row+8);
      assert.ok(nameOffset+bytes.readUInt32BE(row+12)<=bytes.length);
      break;
    }
  }
  assert.notEqual(nameOffset,undefined,'Required font name table');
  const recordCount=bytes.readUInt16BE(nameOffset+2),storage=nameOffset+bytes.readUInt16BE(nameOffset+4),records=[];
  for(let i=0;i<recordCount;i++) {
    const row=nameOffset+6+i*12,platform=bytes.readUInt16BE(row),id=bytes.readUInt16BE(row+6),length=bytes.readUInt16BE(row+8),offset=storage+bytes.readUInt16BE(row+10);
    assert.ok(offset+length<=bytes.length,'Bounded font name record');
    const raw=Buffer.from(bytes.subarray(offset,offset+length));
    if(platform===0||platform===3)assert.equal(raw.length%2,0,'UTF-16 font name');
    const value=platform===0||platform===3?raw.swap16().toString('utf16le'):raw.toString('latin1');
    records.push({id,value});
  }
  return records;
}

test('redistributed Liberation-derived subsets use an original family name while complete fonts retain theirs',()=>{
  for(const weight of [400,700]) {
    const subset=fontNames(readFileSync(join(fontSource,`liberation-sans-${weight}-svg-subset.ttf`))),full=fontNames(readFileSync(join(fontSource,`liberation-sans-${weight}.ttf`)));
    const style=weight===400?'Regular':'Bold';
    assert.ok(full.filter(n=>n.id===1).every(n=>n.value==='Liberation Sans'),'Original complete font names');
    for(const id of [1,3,4,6])assert.ok(subset.some(n=>n.id===id),'Required renamed subset record');
    for(const record of subset.filter(n=>[1,2,3,4,6,16,17,18].includes(n.id))) {
      assert.doesNotMatch(record.value,/Liberation/iu,'Reserved family name absent from derived names');
      if([1,16].includes(record.id))assert.equal(record.value,'l0g Debt Sans');
      if([2,17].includes(record.id))assert.equal(record.value,style);
      if([3,4,18].includes(record.id))assert.equal(record.value,`l0g Debt Sans ${style}`);
      if(record.id===6)assert.equal(record.value,`l0gDebtSans-${style}`);
    }
  }
});

test('SVG adapter rejects foreign content, styles, remote references, paint expressions and missing local identifiers',()=>{
  const fixture='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" style="width:100%;height:auto"><title>A</title><desc>B</desc><rect width="400" height="500" fill="var(--color-ink)"/></svg>';
  assert.match(bakeDebtSvg(fixture,'dark'),/fill="#0c0d10"/u);assert.throws(()=>bakeDebtSvg(fixture,'light'),/Unsupported debt EPUB theme/u);
  for(const payload of ['<script/>','<foreignObject/>','<image href="https://example.com/a"/>','<style>@import "x";</style>','<animate/>','<a href="https://example.com/">x</a>'])assert.throws(()=>bakeDebtSvg(fixture.replace('</svg>',payload+'</svg>'),'dark','ch002.xhtml'));
  for(const value of ['var(--color-unknown)','var(--color-constructor)','var(--color-ink) url(x)','url(https://example.com/a)','url(#missing)','var(--color-ink, red)','color-mix(in srgb, var(--color-amber) 99%, var(--color-ink))','javascript:alert(1)'])assert.throws(()=>bakeDebtSvg(fixture.replace('var(--color-ink)',value),'dark'));
  assert.throws(()=>bakeDebtSvg(fixture.replace('<rect ','<rect onload="alert(1)" '),'dark'));
  assert.throws(()=>bakeDebtSvg(fixture.replace('<rect ','<rect id="x" ' ).replace('</svg>','<circle id="x"/></svg>'),'dark'),/Duplicate/u);
  assert.throws(()=>bakeDebtSvg(fixture.replace('</svg>',''),'dark'));
  assert.throws(()=>bakeDebtSvg(fixture.replace('<title>A</title>','<title>What changes</title>'),'dark'),/Forbidden/u);
  assert.throws(()=>bakeDebtSvg(fixture,'constructor'),/Unsupported/u);
});

test('publication identities, source counts and generation commands are explicit',async()=>{
  const editions=Object.values(debtEditions).flatMap(b=>b.editions);
  assert.equal(editions.length,2);assert.equal(new Set(editions.map(e=>e.id)).size,2);
  for(const book of Object.values(debtEditions))assert.equal(book.chapters.reduce((n,c)=>n+c.figureCount,0),40);
  await assert.rejects(generateDebtEpub('../outside','dark'),/Unsupported/u);await assert.rejects(generateDebtEpub('fr','../outside'),/Unsupported/u);
  const pkg=JSON.parse(readFileSync(join(ROOT,'package.json'),'utf8'));
  assert.ok(pkg.scripts['build:epub'].includes('node scripts/generate-debt-epub.mjs'));
  assert.ok(pkg.scripts['test:epub'].includes('scripts/debt-epub.test.mjs'));
  assert.ok(pkg.scripts['build:verify'].includes('scripts/debt-publication.test.mjs'));
  assert.throws(()=>execFileSync(process.execPath,['scripts/build-epub.mjs','../unconfigured'],{cwd:ROOT,stdio:'pipe'}));
});
