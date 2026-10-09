import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve, relative } from 'node:path';
import { createHash } from 'node:crypto';
import { parseFrontmatter } from '@astrojs/markdown-remark';
import { fromHtml } from 'hast-util-from-html';
import { toText } from 'hast-util-to-text';
import { unified } from 'unified';
import rehypeStringify from 'rehype-stringify';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkMdx from 'remark-mdx';
import remarkRehype from 'remark-rehype';
import valueParser from 'postcss-value-parser';
import GithubSlugger from 'github-slugger';
import { XMLValidator } from 'fast-xml-parser';
import sharp from 'sharp';
import { editorialTitleViolation, contentTitleViolations } from './editorial-title-policy.mjs';
import { microsoftEditions } from '../src/config/microsoft-publication.mjs';
import { assertPassiveTree } from './generate-scpi-epub.mjs';
import { bakeReservesSvg } from './generate-reserves-epub.mjs';
import { escapeXml as xml, xhtmlDocument } from './generate-e-invoicing-epub-lib.mjs';
import { microsoftExitSvg } from '../src/lib/microsoftExitFigures.mjs';
import { microsoftContractsSvg } from '../src/lib/microsoftContractsFigures.mjs';
import { microsoftCloudLicensingSvg } from '../src/lib/microsoftCloudLicensingFigures.mjs';
import { microsoftWorkflowSvg } from '../src/lib/microsoftWorkflowFigures.mjs';
import { microsoftTransitionCostSvg } from '../src/lib/microsoftTransitionCostFigures.mjs';
import { microsoftMigrationPracticeSvg } from '../src/lib/microsoftMigrationPracticeFigures.mjs';
import { microsoftChoiceSvg } from '../src/lib/microsoftChoiceFigures.mjs';

const ROOT = resolve(new URL('..', import.meta.url).pathname);
const TEMPLATE = join(ROOT, 'src/epub/l-argent-d-epstein');
const SITE = 'https://l0g.fr';
const paragraphs = items => items.map(p => `<p>${xml(p)}</p>`).join('\n');
const elements = node => [node, ...(node.children ?? []).flatMap(elements)];
const serialize = node => unified().use(rehypeStringify, { closeSelfClosing:true }).stringify(node);
const element = (tagName, properties, children = []) => ({ type:'element', tagName, properties, children });
const text = value => ({ type:'text', value });
const blockElements = new Set(['address','article','aside','blockquote','details','div','dl','figure','footer','h1','h2','h3','h4','h5','h6','header','hr','li','main','nav','ol','p','pre','section','table','ul']);
// MDX can place literal block JSX inside a Markdown paragraph. Split those
// paragraphs in the parsed tree, before an HTML parser can silently repair them.
function normalizeBlockParagraphs(node) {
  if(!node.children)return [node];
  node.children=node.children.flatMap(normalizeBlockParagraphs);
  if(node.tagName!=='p' || !node.children.some(c=>c.type==='element' && blockElements.has(c.tagName)))return [node];
  const siblings=[];let inline=[];
  const flush=()=>{if(inline.some(n=>n.type!=='text' || n.value.trim()))siblings.push(element('p',node.properties,inline));inline=[];};
  for(const child of node.children){
    if(child.type==='element' && blockElements.has(child.tagName)){flush();siblings.push(child);}else inline.push(child);
  }
  flush();return siblings;
}
export function assertMicrosoftContentModel(tree) {
  for(const node of elements(tree)) {
    const children=(node.children??[]).filter(c=>c.type!=='text' || c.value.trim());
    if(node.tagName==='p' && children.some(c=>c.type==='element' && blockElements.has(c.tagName)))throw new Error('Block element inside EPUB paragraph');
    if(['ol','ul'].includes(node.tagName) && children.some(c=>c.type!=='element' || c.tagName!=='li'))throw new Error('Invalid EPUB list child');
    if(node.tagName==='figure'){
      const captions=children.filter(c=>c.tagName==='figcaption');
      if(captions.length>1 || (captions.length && ![children[0],children.at(-1)].includes(captions[0])))throw new Error('Invalid EPUB figure caption position');
    }
  }
}
export const microsoftFigureRenderers = Object.freeze({
  MicrosoftExitFigure:microsoftExitSvg, MicrosoftContractsFigure:microsoftContractsSvg,
  MicrosoftCloudLicensingFigure:microsoftCloudLicensingSvg, MicrosoftWorkflowFigure:microsoftWorkflowSvg,
  MicrosoftTransitionCostFigure:microsoftTransitionCostSvg, MicrosoftMigrationPracticeFigure:microsoftMigrationPracticeSvg,
  MicrosoftChoiceFigure:microsoftChoiceSvg,
});
const chapterComponents = Object.keys(microsoftFigureRenderers);
const palette = Object.freeze({ink:'#0c0d10',surface:'#121419','surface-2':'#171a20',paper:'#e7e9ee',muted:'#8b909b','line-strong':'rgba(255, 255, 255, 0.20)',signal:'#5eead4',amber:'#f5b13d',accent:'#ff4d87'});

export function bakeMicrosoftSvg(source) {
  if (XMLValidator.validate(source)!==true || /<!DOCTYPE|<!ENTITY/iu.test(source)) throw new Error('Invalid Microsoft SVG');
  const tree=fromHtml(source,{fragment:true});
  for(const title of elements(tree).filter(n=>n.tagName==='title'))if(editorialTitleViolation(toText(title)))throw new Error(`Forbidden SVG title: ${toText(title)}`);
  for(const node of elements(tree)) for(const [key,raw] of Object.entries(node.properties ?? {})) {
    if(!String(raw).includes('var(')) continue;
    if(!['fill','stroke'].includes(key)) throw new Error('Unexpected SVG colour property');
    const ast=valueParser(String(raw));
    if(ast.nodes.length!==1 || ast.nodes[0].type!=='function' || ast.nodes[0].value!=='var')throw new Error('Unexpected SVG colour expression');
    const name=ast.nodes[0].nodes[0];
    if(name?.type!=='word' || !name.value.startsWith('--color-') || !Object.hasOwn(palette,name.value.slice(8)))throw new Error('Unknown SVG colour');
    node.properties[key]=palette[name.value.slice(8)];
  }
  return bakeReservesSvg(tree);
}

const passiveJsx = Object.freeze({sup:[],a:['href'],details:[],summary:[],p:[],ol:['class'],li:['id']});
function attributes(node, allowed) {
  const props=Object.create(null);
  for(const attr of node.attributes) {
    if(attr.type!=='mdxJsxAttribute' || typeof attr.value!=='string' || !allowed.includes(attr.name) || Object.hasOwn(props,attr.name))throw new Error('Non-literal or unexpected MDX attribute');
    props[attr.name]=attr.value;
  }
  return props;
}

// Parse MDX, inspect its ESTree imports, and render only an explicit component
// map. Imports are never loaded or evaluated and expressions are never executed.
export async function renderMicrosoftArticle(source, chapter, offset=0) {
  const book=Object.values(microsoftEditions).find(b=>b.chapters.includes(chapter));
  if(!book)throw new Error('Unconfigured Microsoft chapter');
  const {frontmatter:meta,content}=parseFrontmatter(source);
  if(!meta.title || !meta.description || meta.draft || (book.lang==='en' && meta.sourceArticle!==chapter.sourceSlug))throw new Error('Incomplete Microsoft article');
  const modified=new Date(book.modified).getTime(), published=new Date(meta.pubDate).getTime(), updated=new Date(meta.updatedDate??meta.pubDate).getTime();
  if(![modified,published,updated].every(Number.isFinite) || modified<Math.max(published,updated))throw new Error('Microsoft edition predates its source');
  if(book.lang==='en'){
    const fr=parseFrontmatter(readFileSync(join(ROOT,'src/content/posts',`${chapter.sourceSlug}.mdx`),'utf8')).frontmatter;
    if(new Date(meta.sourceUpdatedDate).getTime()!==new Date(fr.updatedDate??fr.pubDate).getTime())throw new Error('English source version drift');
  }
  const titleViolations=contentTitleViolations(content,new Map(Object.entries(meta)));
  if(titleViolations.length)throw new Error(`Forbidden Microsoft article title: ${JSON.stringify(titleViolations)}`);
  const expectedComponent=chapterComponents[chapter.number-1];
  const parser=unified().use(remarkParse).use(remarkGfm).use(remarkMdx);
  const mdast=parser.parse(content), imported=new Set();
  for(const node of elements(mdast)) {
    if(node.type==='mdxjsEsm') {
      const statements=node.data?.estree?.body;
      if(!statements?.length)throw new Error('Missing import AST');
      for(const statement of statements) {
        if(statement.type!=='ImportDeclaration' || statement.specifiers.length!==1 || statement.specifiers[0].type!=='ImportDefaultSpecifier' || statement.specifiers[0].local.name!==expectedComponent || statement.source.value!==`../../components/${expectedComponent}.astro` || imported.has(expectedComponent))throw new Error('Unapproved MDX import or export');
        imported.add(expectedComponent);
      }
    } else if(['mdxFlowExpression','mdxTextExpression','html','image','imageReference'].includes(node.type))throw new Error('Active or unexpected MDX content');
  }
  if(!imported.has(expectedComponent))throw new Error('Missing controlled figure import');
  mdast.children=mdast.children.filter(n=>n.type!=='mdxjsEsm');
  const attachments=[],figures=[];
  const handler=(state,node)=>{
    if(node.name===expectedComponent) {
      const props=attributes(node,['kind','lang','number','sources','caption']);
      if(Object.keys(props).length!==5 || props.lang!==book.lang || props.number!==String(figures.length+1).padStart(2,'0') || !props.caption.trim() || !/^[1-9]\d?(?:\s+[1-9]\d?)*$/u.test(props.sources))throw new Error('Invalid figure properties');
      const number=figures.length+1, id=`c${chapter.number}-infographic-${number}`;
      const image=mobile=>{
        const original=microsoftFigureRenderers[expectedComponent](book.lang,props.kind,mobile),svg=bakeMicrosoftSvg(original);
        const name=`file${offset+attachments.length}.svg`, kind=mobile?'reading':'complete';
        attachments.push({name,svg,original,kind,chapter:chapter.number,figure:number});
        const desc=elements(fromHtml(svg,{fragment:true})).find(n=>n.tagName==='desc');
        return element('img',{src:`../media/${name}`,className:['infographic-image'],alt:toText(desc).trim()});
      };
      const wide=image(false),reading=image(true);
      figures.push({id,caption:props.caption,number});
      return element('div',{className:['infographic-block']},[element('figure',{id,className:['infographic']},[
        element('div',{className:['infographic-wide']},[wide]),
        element('div',{className:['infographic-reading']},[reading]),
        element('p',{className:['figure-enlarge']},[
          element('a',{href:wide.properties.src},[text(book.lang==='fr'?'Composition complète':'Complete composition')]),text(' · '),
          element('a',{href:reading.properties.src},[text(book.lang==='fr'?'Version verticale':'Vertical composition')]),
        ]),
        element('figcaption',{},[element('strong',{},[text(`FIG. ${props.number}`)]),text(` ${props.caption} `),...props.sources.split(/\s+/u).flatMap(n=>[element('a',{href:`#source-${n}`},[text(`[${n}]`)]),text(' ')])]),
      ]),
        ...state.all(node),
      ]);
    }
    if(!Object.hasOwn(passiveJsx,node.name))throw new Error(`Unapproved MDX element: ${node.name}`);
    const props=attributes(node,passiveJsx[node.name]);
    if(props.class){props.className=props.class.split(/\s+/u);delete props.class;}
    let children=state.all(node);
    if(['p','summary'].includes(node.name) && children.length===1 && children[0].tagName==='p')children=children[0].children;
    return element(node.name,props,children);
  };
  const processor=unified().use(remarkRehype,{handlers:{mdxJsxFlowElement:handler,mdxJsxTextElement:handler}});
  const tree=await processor.run(mdast);
  normalizeBlockParagraphs(tree);
  assertMicrosoftContentModel(tree);
  if(figures.length!==chapter.figureCount)throw new Error('Microsoft figure count drift');
  for(const node of elements(tree)) {
    if(node.type==='element' && node.tagName==='style')throw new Error('Active EPUB style');
    if(node.properties?.style)throw new Error('Unexpected EPUB inline style');
    if(['th','td'].includes(node.tagName) && node.properties.align) {
      const alignment=node.properties.align;
      if(!['left','center','right'].includes(alignment))throw new Error('Invalid table alignment');
      node.properties.className=[`align-${alignment}`];delete node.properties.align;
    }
  }
  assertPassiveTree(tree);
  return {html:serialize(tree),attachments,figures,next:offset+attachments.length,sourceHash:createHash('sha256').update(source).digest('hex')};
}

export function prepareMicrosoftReading(html,routes,number) {
  const tree=fromHtml(html,{fragment:true}),headings=[],slugger=new GithubSlugger();
  assertPassiveTree(tree);
  for(const node of elements(tree)) {
    if(node.tagName==='details'){node.tagName='section';delete node.properties.open;}
    if(node.tagName==='summary'){node.tagName='p';node.properties.className=['reading-box-title'];}
    if(node.tagName==='h2'){
      const title=toText(node);node.properties.id??=`c${number}-${slugger.slug(title)}`;headings.push({title,id:node.properties.id});
    }
    if(node.tagName==='a' && node.properties.href && !String(node.properties.href).startsWith('#')){
      const url=new URL(String(node.properties.href),SITE);
      if(url.origin===SITE && routes.has(url.pathname)){
        const destination=routes.get(url.pathname);node.properties.href=`${destination.split('#')[0]}${url.hash||`#${destination.split('#')[1]}`}`;
      } else if(String(node.properties.href).startsWith('/'))node.properties.href=url.href;
    }
  }
  assertMicrosoftContentModel(tree);
  return {html:serialize(tree),headings};
}

export async function generateMicrosoftEpub(lang = 'fr') {
  if (!['fr', 'en'].includes(lang)) throw new Error('Unsupported Microsoft edition language');
  const book = microsoftEditions[lang], isEn = lang === 'en', chapters = book.chapters;
  for(const title of [book.title,book.subtitle,book.introductionTitle,book.conclusionTitle,book.methodTitle,...chapters.map(c=>c.title)]){
    const violation=editorialTitleViolation(title);if(violation)throw new Error(`Forbidden Microsoft publication title: ${title}: ${violation}`);
  }
  const tr = (fr, en) => isEn ? en : fr;
  const sourceDir = join(ROOT, 'src/epub', book.directory), epubDir = join(sourceDir, 'EPUB');
  const media = join(epubDir, 'media'), textDir = join(epubDir, 'text');
  for (const dir of [media, textDir, join(epubDir, 'styles'), join(sourceDir, 'META-INF'), join(ROOT, 'public/publications')]) mkdirSync(dir, { recursive: true });
  for (const file of ['mimetype', 'META-INF/container.xml', 'META-INF/com.apple.ibooks.display-options.xml']) copyFileSync(join(TEMPLATE, file), join(sourceDir, file));
  const saveXml = (path, content) => {
    const valid = XMLValidator.validate(content);
    if (valid !== true) throw new Error(`${relative(ROOT, path)}: invalid EPUB XML: ${JSON.stringify(valid)}`);
    writeFileSync(path, content);
  };
  const writeChapter = (file, title, body, bodyType = 'bodymatter') => {
    const violation=editorialTitleViolation(title);if(violation)throw new Error(`Forbidden EPUB title: ${title}`);
    for(const heading of elements(fromHtml(body,{fragment:true})).filter(n=>['h1','h2','h3','h4','h5','h6'].includes(n.tagName)))if(editorialTitleViolation(toText(heading)))throw new Error(`Forbidden EPUB heading: ${toText(heading)}`);
    const document = xhtmlDocument(book, { title, body, bodyType });
    saveXml(join(textDir, file), bodyType === 'frontmatter cover' ? document.replace('<body ', '<body class="cover-page" ') : document);
  };
  const css = readFileSync(join(TEMPLATE, 'EPUB/styles/stylesheet1.css'), 'utf8');
  writeFileSync(join(epubDir, 'styles/stylesheet1.css'), `${css}\nfigure { margin:1.6em auto 2em; max-width:38em; }\n.infographic-image { width:100%; height:auto; background:#0c0d10; }\n.infographic-reading { display:none; }\n.infographic-reading .infographic-image { margin:0 auto 1em; max-width:28em; page-break-inside:avoid; break-inside:avoid; }\n.figure-enlarge { font-size:.75em; }\n.chapter-art { width:100%; margin:1.5em auto 2em; }\n.chapter-art img { width:100%; }\n.sources li { margin-bottom:1em; }\n.source-meta { display:block; font-size:.85em; color:#555c66; }\n.source-id { font-family:monospace; font-size:.75em; overflow-wrap:anywhere; word-break:break-all; }\n.half-title { margin:8em 0 4em; text-align:center; }\n.align-left {text-align:left} .align-center {text-align:center} .align-right {text-align:right}\n.reading-box-title { font-weight:bold; }\n.cover-page { max-width:none; margin:0; padding:0; }\n@media(max-width:36em) { .infographic-wide { display:none; } .infographic-reading { display:block; } figure.infographic { page-break-inside:auto; break-inside:auto; } }\n`);
  const cover = await sharp(join(ROOT, `src/epub-assets/${book.directory}-cover.png`)).resize(1024, 1638, { fit:'contain', background:'#0c0d10' }).jpeg({ quality:85, mozjpeg:true }).toBuffer();
  writeFileSync(join(media, 'cover.jpg'), cover);
  writeFileSync(join(ROOT, 'public', book.cover), cover);
  for (const width of [320, 640, 960]) await sharp(cover).resize({ width }).webp({ quality:84 }).toFile(join(ROOT, 'public', book.cover.replace('.jpg', `-${width}.webp`)));
  // Social artwork is deliberately generated separately in the site's OG workflow.
  const panorama = await sharp(join(ROOT, 'src/epub-assets/microsoft-panorama.png')).resize(1600, 800, { fit:'cover' }).jpeg({ quality:86, mozjpeg:true }).toBuffer();
  writeFileSync(join(ROOT, 'public', book.panorama), panorama);
  writeFileSync(join(media, 'panorama.jpg'), panorama);
  for (const width of [640, 960, 1600]) await sharp(panorama).resize({ width }).webp({ quality:82 }).toFile(join(ROOT, 'public', book.panorama.replace('.jpg', `-${width}.webp`)));
  writeChapter('cover.xhtml', tr('Couverture', 'Cover'), `<img src="../media/cover.jpg" alt="${xml(book.title)}" />`, 'frontmatter cover');
  writeChapter('title_page.xhtml', book.title, `<section class="titlepage" epub:type="titlepage"><h1>${xml(book.title)}</h1><p class="subtitle">${xml(book.subtitle)}</p><p class="author">l0g</p><p>${tr('9 octobre 2026 · Édition française', '9 October 2026 · English edition')}</p><p>${tr('Sept articles, quinze infographies, une introduction et une conclusion originales.', 'Seven complete articles, fifteen infographics, an original introduction and conclusion.')}</p><p>${tr('Documentation arrêtée au 9 octobre 2026. Les sept volets de l’enquête réunis.', 'Documentary cut-off: 9 October 2026. All seven instalments of the investigation.')}</p><p>Creative Commons Attribution 4.0 International</p></section>`, 'frontmatter');
  writeChapter('ch001.xhtml', book.introductionTitle, `<section id="introduction" epub:type="introduction"><p class="chapter-kicker">Introduction</p><h1>${xml(book.introductionTitle)}</h1><figure class="chapter-art"><img src="../media/panorama.jpg" alt="${tr('Illustration conceptuelle des dépendances et du passage entre environnements numériques.', 'Conceptual illustration of dependencies and the transition between digital environments.')}" /><figcaption>${tr('Illustration conceptuelle créée avec une assistance d’intelligence artificielle. Aucun site, réseau ou flux mesuré représenté.', 'Conceptual illustration created with AI assistance. It depicts no actual facility, network or measured flow.')}</figcaption></figure>${paragraphs(book.introduction)}<p>${tr('Les mécanismes et les références de cette synthèse sont développés dans les', 'The mechanisms and references behind this overview are developed in the')} <a href="../nav.xhtml#toc">${tr('sept chapitres', 'seven chapters')}</a>.</p></section>`);
  const routes = new Map(chapters.map(c => [c.route, `${c.chapter}#article-${c.number}`]));
  const nav = [{title:book.methodTitle,href:'text/method.xhtml'}, { title:`Introduction${tr(' : ', ': ')}${book.introductionTitle}`, href:'text/ch001.xhtml' }];
  const attachments = [], provenance = [], figureIndex = [];
  for (const chapter of chapters) {
    const source = readFileSync(join(ROOT, isEn ? 'src/content/posts-en' : 'src/content/posts', `${chapter.slug}.mdx`), 'utf8');
    const meta = parseFrontmatter(source).frontmatter;
    const assembled = await renderMicrosoftArticle(source, chapter, attachments.length);
    for (const attachment of assembled.attachments) saveXml(join(media, attachment.name), attachment.svg);
    attachments.push(...assembled.attachments);
    provenance.push({chapter,hash:assembled.sourceHash,date:meta.pubDate,updated:meta.updatedDate});
    figureIndex.push(...assembled.figures.map(f=>({...f,chapter})));
    const reading = prepareMicrosoftReading(assembled.html, routes, chapter.number);
    reading.html += `<nav aria-label="${tr('Autres chapitres', 'Other chapters')}"><h2>${tr('Poursuivre la lecture', 'Continue reading')}</h2><ol>${chapters.filter(c => c.number !== chapter.number).map(c => `<li><a href="${c.chapter}#article-${c.number}">${c.number}. ${xml(c.title)}</a></li>`).join('')}</ol></nav>`;
    copyFileSync(join(ROOT, 'public', chapter.image), join(media, `chapter-${chapter.number}.jpg`));
    const date = new Intl.DateTimeFormat(book.locale, { dateStyle:'long', timeZone:'Europe/Paris' }).format(new Date(meta.pubDate));
    writeChapter(chapter.chapter, meta.title, `<section id="article-${chapter.number}"><p class="chapter-kicker">${tr('Chapitre', 'Chapter')} ${chapter.number}</p><h1>${xml(meta.title)}</h1><p class="chapter-dek">${xml(meta.description)}</p><p class="chapter-meta">${xml(date)} · <a href="${SITE}${chapter.route}">${tr('Version en ligne', 'Online article')}</a></p><figure class="chapter-art"><img src="../media/chapter-${chapter.number}.jpg" alt="${xml(chapter.imageAlt)}" /><figcaption>${tr('Illustration conceptuelle. Les faits et les relations étudiées sont décrits et sourcés dans le chapitre.', 'Conceptual illustration. The facts and relationships examined are described and sourced in the chapter.')}</figcaption></figure>${reading.html}</section>`);
    nav.push({ title:`${chapter.number}. ${chapter.title}`, href:`text/${chapter.chapter}`, children:reading.headings.map(h => ({ title:h.title, href:`text/${chapter.chapter}#${h.id}` })) });
  }
  if (attachments.filter(a => a.kind === 'complete').length !== book.figureCount) throw new Error('Microsoft figure count drift');
  writeChapter('ch009.xhtml', book.conclusionTitle, `<section id="conclusion" epub:type="conclusion"><p class="chapter-kicker">Conclusion</p><h1>${xml(book.conclusionTitle)}</h1>${paragraphs(book.conclusion)}<p>${tr('Les sources de cette synthèse restent attachées aux', 'The sources for this synthesis remain attached to the')} <a href="../nav.xhtml#toc">${tr('chapitres correspondants', 'corresponding chapters')}</a>.</p></section>`);
  nav.push({ title:`Conclusion${tr(' : ', ': ')}${book.conclusionTitle}`, href:'text/ch009.xhtml' });
  writeChapter('half_title.xhtml',book.title,`<section class="half-title"><p>l0g · ${tr('Enquête documentaire','Documentary investigation')}</p><h1>${xml(book.title)}</h1></section>`,'frontmatter');
  writeChapter('method.xhtml',book.methodTitle,`<section id="method"><h1>${xml(book.methodTitle)}</h1>${paragraphs(book.method)}<p>${tr('Les sept articles sont reproduits intégralement, avec leurs dates, sources et réserves. Les encadrés sont ouverts. Les liens entre chapitres et les renvois de notes fonctionnent hors ligne. Les sources externes et le glossaire nécessitent une connexion.','All seven articles are reproduced in full, including their dates, references and qualifications. Explanatory boxes are expanded. Chapter links and note references work offline. External sources and the glossary require a connection.')}</p><p>${tr('Les quinze infographies conservent leurs deux compositions originales. La liseuse peut afficher la version large ou verticale selon la largeur disponible ; les deux restent accessibles par lien. Les SVG gardent leur géométrie et leur texte. Leur agrandissement dépend de l’application de lecture.','Each of the fifteen infographics retains both original compositions. The reader may display the wide or vertical version depending on available width; both remain available through links. SVG geometry and text are preserved. Enlargement depends on the reading application.')}</p></section>`,'frontmatter');
  const figuresTitle=tr('Repères visuels','Visual reference');
  writeChapter('figures.xhtml',figuresTitle,`<section id="figures"><h1>${figuresTitle}</h1><ol>${figureIndex.map(f=>`<li><a href="${f.chapter.chapter}#${f.id}">${tr('Chapitre','Chapter')} ${f.chapter.number} · FIG. ${f.number}</a><p>${xml(f.caption)}</p></li>`).join('')}</ol></section>`,'backmatter');
  nav.push({title:figuresTitle,href:'text/figures.xhtml'});
  const aboutTitle = tr('Colophon et provenance', 'Colophon and provenance');
  writeChapter('ch010.xhtml', aboutTitle, `<section id="edition"><h1>${aboutTitle}</h1><p>${tr('Édition du 9 octobre 2026. Ce livre rassemble les sept volets de l’enquête Quitter Microsoft, une introduction, une conclusion et quinze infographies. Les synthèses reprennent les mécanismes sourcés dans les chapitres et n’introduisent aucune observation nouvelle.','Edition dated 9 October 2026. This book collects all seven parts of Leaving Microsoft, an introduction, a conclusion and fifteen infographics. The syntheses draw on the sourced mechanisms in the chapters and introduce no new observations.')}</p><p>${tr('La couverture, le panorama et les sept illustrations de chapitre sont des compositions conceptuelles créées avec une assistance d’intelligence artificielle. Elles ne documentent aucun site, contrat ou déploiement réel.','The cover, panorama and seven chapter illustrations are conceptual compositions created with AI assistance. They do not document an actual site, contract or deployment.')}</p><p>${tr('Aucun script, police distante ou outil de suivi n’est embarqué. Les textes et infographies sont disponibles hors ligne.','No scripts, remote fonts or trackers are embedded. Text and infographics are available offline.')}</p><h2>${tr('Articles d’origine et empreintes SHA-256','Original articles and SHA-256 digests')}</h2><p>${tr('Chaque empreinte identifie les octets exacts du fichier MDX repris pour cette édition. Elle permet de comparer une copie du fichier ; elle ne constitue ni une certification des faits ni une signature numérique.','Each digest identifies the exact bytes of the MDX file used in this edition. It supports comparison with a copy of that file; it is neither a certification of the reporting nor a digital signature.')}</p><ol>${provenance.map(p=>`<li><a href="${SITE}${p.chapter.route}">${xml(p.chapter.title)}</a><p>${xml(p.chapter.slug)}.mdx</p><p>${tr('Publication','Published')}: ${xml(new Date(p.date).toISOString())}${p.updated?` · ${tr('Mise à jour','Updated')}: ${xml(new Date(p.updated).toISOString())}`:''}</p><p class="source-id">SHA-256: <code>${p.hash}</code></p></li>`).join('')}</ol><p><a href="${SITE}${book.path}">${tr('Page de l’édition et corrections ultérieures','Edition page and subsequent corrections')}</a></p><p><a href="https://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution 4.0 International</a> · l0g</p></section>`,'backmatter');
  nav.push({ title:aboutTitle, href:'text/ch010.xhtml' });
  for(const entry of nav.flatMap(n=>[n,...(n.children??[])]))if(editorialTitleViolation(entry.title))throw new Error(`Forbidden EPUB navigation title: ${entry.title}`);
  const navList = items => `<ol>${items.map(e => `<li><a href="${e.href}">${xml(e.title)}</a>${e.children ? navList(e.children) : ''}</li>`).join('')}</ol>`;
  saveXml(join(epubDir, 'nav.xhtml'), xhtmlDocument(book, { title:tr('Sommaire', 'Contents'), bodyType:'frontmatter', body:`<nav epub:type="toc" id="toc"><h1>${tr('Sommaire', 'Contents')}</h1>${navList(nav)}</nav>` }).replace('../styles/stylesheet1.css', 'styles/stylesheet1.css'));
  let order = 0;
  const ncx = items => items.map(e => { const n = ++order; return `<navPoint id="nav-${n}" playOrder="${n}"><navLabel><text>${xml(e.title)}</text></navLabel><content src="${e.href}"/>${e.children ? ncx(e.children) : ''}</navPoint>`; }).join('');
  saveXml(join(epubDir, 'toc.ncx'), `<?xml version="1.0" encoding="UTF-8"?><ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1" xml:lang="${book.lang}"><head><meta name="dtb:uid" content="${book.id}"/><meta name="dtb:depth" content="2"/><meta name="dtb:totalPageCount" content="0"/><meta name="dtb:maxPageNumber" content="0"/></head><docTitle><text>${xml(book.title)}</text></docTitle><navMap>${ncx(nav)}</navMap></ncx>`);
  const extraSections=['half_title','method','figures'];
  const sections = Array.from({ length:10 }, (_, i) => `ch${String(i + 1).padStart(3, '0')}`);
  saveXml(join(epubDir, 'content.opf'), `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="book-id" xml:lang="${book.lang}" prefix="schema: http://schema.org/">
<metadata xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:identifier id="book-id">${book.id}</dc:identifier><dc:title>${xml(book.title)}</dc:title><dc:language>${book.lang}</dc:language><dc:creator>l0g</dc:creator><dc:publisher>l0g.fr</dc:publisher><dc:date>${book.date}</dc:date><dc:description>${xml(book.description)}</dc:description><dc:source>${SITE}${book.path}</dc:source><dc:rights>Creative Commons Attribution 4.0 International</dc:rights><meta property="dcterms:modified">${book.modified}</meta><meta name="cover" content="cover-image"/><meta property="schema:accessMode">textual</meta><meta property="schema:accessMode">visual</meta><meta property="schema:accessibilityFeature">alternativeText</meta><meta property="schema:accessibilityFeature">readingOrder</meta><meta property="schema:accessibilityFeature">structuralNavigation</meta><meta property="schema:accessibilityFeature">tableOfContents</meta><meta property="schema:accessibilityHazard">none</meta><meta property="schema:accessibilitySummary">${tr('Texte redistribuable, navigation structurée, tableaux, sources cliquables et descriptions alternatives. Quinze infographies avec compositions complètes et adaptations de lecture hors ligne. Agrandissement selon la liseuse.', 'Reflowable text, structured navigation, tables, linked sources and text alternatives. Fifteen infographics with complete compositions and offline reading adaptations. Enlargement depends on the reading app.')}</meta></metadata>
<manifest><item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/><item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/><item id="css" href="styles/stylesheet1.css" media-type="text/css"/><item id="cover-image" href="media/cover.jpg" media-type="image/jpeg" properties="cover-image"/><item id="panorama" href="media/panorama.jpg" media-type="image/jpeg"/><item id="cover" href="text/cover.xhtml" media-type="application/xhtml+xml"/><item id="title" href="text/title_page.xhtml" media-type="application/xhtml+xml"/>${extraSections.concat(sections).map(id => `<item id="${id}" href="text/${id}.xhtml" media-type="application/xhtml+xml"/>`).join('')}${chapters.map(c => `<item id="art-${c.number}" href="media/chapter-${c.number}.jpg" media-type="image/jpeg"/>`).join('')}${attachments.map((a, i) => `<item id="fig-${i}" href="media/${a.name}" media-type="image/svg+xml"/>`).join('')}</manifest>
<spine toc="ncx"><itemref idref="cover"/><itemref idref="half_title"/><itemref idref="title"/><itemref idref="nav"/><itemref idref="method"/>${sections.slice(0,-1).map(id => `<itemref idref="${id}"/>`).join('')}<itemref idref="figures"/><itemref idref="ch010"/>${attachments.map((a,i)=>`<itemref idref="fig-${i}" linear="no"/>`).join('')}</spine></package>`);
  console.log(`${book.title}: seven complete articles, introduction, conclusion, 15 original diagrams, ${attachments.length} offline SVG compositions and reading panels.`);
}

if (process.argv[1] && resolve(process.argv[1]) === new URL(import.meta.url).pathname) {
  for (const lang of ['fr', 'en']) await generateMicrosoftEpub(lang);
}
