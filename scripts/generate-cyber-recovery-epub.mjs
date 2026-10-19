import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
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
import GithubSlugger from 'github-slugger';
import { XMLValidator } from 'fast-xml-parser';
import sharp from 'sharp';
import { editorialTitleViolation, contentTitleViolations } from './editorial-title-policy.mjs';
import { escapeXml as xml, xhtmlDocument } from './generate-e-invoicing-epub-lib.mjs';
import { cyberRecoveryEditions } from '../src/config/cyber-recovery-publication.mjs';
import { jlrInlineSvg, jlrReferences, JLR_KINDS } from '../src/lib/jlrFigures.mjs';
import { jlrSuppliersInlineSvg, jlrSuppliersReferences, JLR_SUPPLIERS_KINDS } from '../src/lib/jlrSuppliersFigures.mjs';
import { cyberInsuranceInlineSvg, cyberInsuranceReferences, CYBER_INSURANCE_KINDS } from '../src/lib/cyberInsuranceFigures.mjs';
import { jlrGdpInlineSvg, jlrGdpReferences, JLR_GDP_KINDS } from '../src/lib/jlrGdpFigures.mjs';
import { jlrRecoveryInlineSvg, jlrRecoveryReferences, JLR_RECOVERY_KINDS } from '../src/lib/jlrRecoveryFigures.mjs';
import { sharedProviderInlineSvg, sharedProviderReferences, SHARED_PROVIDER_KINDS } from '../src/lib/sharedProviderFigures.mjs';
import { publicCrisisInlineSvg, publicCrisisReferences, PUBLIC_CRISIS_KINDS } from '../src/lib/publicCrisisFigures.mjs';
import { recoveryPriceInlineSvg, recoveryPriceReferences, RECOVERY_PRICE_KINDS } from '../src/lib/recoveryPriceFigures.mjs';

const ROOT = resolve(new URL('..', import.meta.url).pathname);
const SITE = 'https://l0g.fr';
export const cyberFigureSpecs = Object.freeze([
  ['JlrFigure',jlrInlineSvg,jlrReferences,JLR_KINDS],
  ['JlrSuppliersFigure',jlrSuppliersInlineSvg,jlrSuppliersReferences,JLR_SUPPLIERS_KINDS],
  ['CyberInsuranceFigure',cyberInsuranceInlineSvg,cyberInsuranceReferences,CYBER_INSURANCE_KINDS],
  ['JlrGdpFigure',jlrGdpInlineSvg,jlrGdpReferences,JLR_GDP_KINDS],
  ['JlrRecoveryFigure',jlrRecoveryInlineSvg,jlrRecoveryReferences,JLR_RECOVERY_KINDS],
  ['SharedProviderFigure',sharedProviderInlineSvg,sharedProviderReferences,SHARED_PROVIDER_KINDS],
  ['PublicCrisisFigure',publicCrisisInlineSvg,publicCrisisReferences,PUBLIC_CRISIS_KINDS],
  ['RecoveryPriceFigure',recoveryPriceInlineSvg,recoveryPriceReferences,RECOVERY_PRICE_KINDS],
].map(Object.freeze));
export const cyberFontFiles = Object.freeze([
  {name:'inter.woff2',family:'Inter Variable',weight:'100 900',source:'node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2',license:'LICENSE-inter.txt'},
  {name:'jetbrains-mono.woff2',family:'JetBrains Mono Variable',weight:'100 800',source:'node_modules/@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2',license:'LICENSE-jetbrains-mono.txt'},
]);
const nodes = node => [node,...(node.children??[]).flatMap(nodes)];
const element = (tagName,properties={},children=[]) => ({type:'element',tagName,properties,children});
const text = value => ({type:'text',value});
const serialize = tree => unified().use(rehypeStringify,{closeSelfClosing:true,characterReferences:{useNamedReferences:false}}).stringify(tree);
const sha = value => createHash('sha256').update(value).digest('hex');
const paragraphs = values => values.map(value=>`<p>${xml(value)}</p>`).join('\n');
const blockElements = new Set(['article','aside','blockquote','details','div','dl','figure','footer','h1','h2','h3','h4','h5','h6','header','hr','li','main','nav','ol','p','pre','section','table','ul']);
function normalizeParagraphs(node) {
  if(!node.children)return [node];
  node.children=node.children.flatMap(normalizeParagraphs);
  if(node.tagName!=='p'||!node.children.some(c=>blockElements.has(c.tagName)))return [node];
  const result=[];let inline=[];
  const flush=()=>{if(inline.some(n=>n.type!=='text'||n.value.trim()))result.push(element('p',node.properties,inline));inline=[];};
  for(const child of node.children){if(blockElements.has(child.tagName)){flush();result.push(child);}else inline.push(child);}
  flush();return result;
}
export function assertCyberContentModel(tree) {
  for(const node of nodes(tree)) {
    const children=(node.children??[]).filter(c=>c.type!=='text'||c.value.trim());
    if(node.tagName==='p'&&children.some(c=>blockElements.has(c.tagName)))throw new Error('Block inside EPUB paragraph');
    if(['ol','ul'].includes(node.tagName)&&children.some(c=>c.tagName!=='li'))throw new Error('Invalid EPUB list child');
    if(node.tagName==='figure'){
      const captions=children.filter(c=>c.tagName==='figcaption');
      if(captions.length>1||(captions.length&&![children[0],children.at(-1)].includes(captions[0])))throw new Error('Invalid EPUB figure caption position');
    }
  }
}
// Reject unsafe URLs before resolving relative paths; keep external source URLs
// byte-for-byte rather than dropping meaningful signed/version parameters.
export function assertCyberLink(value) {
  if(typeof value!=='string'||!value||/[\u0000-\u0020\u007f\\]/u.test(value)||value.startsWith('//'))throw new Error('Unsafe EPUB link');
  if(value.startsWith('#')){if(value.length===1)throw new Error('Empty EPUB fragment');return;}
  const url=new URL(value,SITE);
  if(!['https:','http:','mailto:'].includes(url.protocol)||url.username||url.password)throw new Error('Unsafe EPUB link protocol');
}
const htmlTags = new Set(['p','a','strong','em','sup','sub','code','pre','blockquote','ol','ul','li','h1','h2','h3','h4','h5','h6','hr','br','table','thead','tbody','tr','th','td','del','section','div','figure','figcaption','img','span']);
export function assertCyberPassiveTree(tree) {
  for(const n of nodes(tree)){
    if(n.type!=='element')continue;
    if(!htmlTags.has(n.tagName))throw new Error(`Unexpected EPUB element: ${n.tagName}`);
    for(const [key,value]of Object.entries(n.properties??{})){
      if(!['id','className','href','src','alt','title','colSpan','rowSpan','scope'].includes(key))throw new Error(`Unexpected EPUB attribute: ${key}`);
      if(key==='href')assertCyberLink(value);
      if(key==='src'&&!/^\.\.\/media\/(?:file\d+\.svg|chapter-[1-8]\.jpg|cover\.jpg)$/u.test(value))throw new Error('External EPUB resource');
    }
  }
  assertCyberContentModel(tree);
}
const svgTags = new Set(['svg','title','desc','defs','marker','path','rect','text','tspan','g','line','circle','a','metadata','pattern','linearGradient','stop','ellipse']);
const svgProps = new Set(['xmlns','width','height','viewBox','role','ariaLabelledBy','lang','preserveAspectRatio','id','refX','refY','markerWidth','markerHeight','orient','d','fill','stroke','strokeWidth','strokeLineCap','strokeLineJoin','x','y','rx','opacity','fontFamily','fontSize','fontWeight','textAnchor','dy','transform','x1','y1','x2','y2','cx','cy','r','markerEnd','strokeDashArray','href','patternUnits','offset','stopColor','stopOpacity','ry']);
const colourMap = Object.freeze({'#0c0d10':'#0c0d10','#121419':'#121419','#13161c':'#121419','#171a20':'#171a20','#1a1e26':'#171a20','#272d37':'rgba(255, 255, 255, 0.20)','#343b48':'rgba(255, 255, 255, 0.20)','#28303b':'rgba(255, 255, 255, 0.20)','#3b4351':'rgba(255, 255, 255, 0.20)','#657084':'#8b909b','#a5adbb':'#8b909b','#69778d':'#8b909b','#a9b3c2':'#8b909b','#e7e9ee':'#e7e9ee','#5eead4':'#5eead4','#ff4d87':'#ff4d87','#f5b13d':'#f5b13d','#7aa2f7':'#7aa2f7'});
const fontFamilies = new Set(['JetBrains Mono Variable, DejaVu Sans Mono, monospace','Inter Variable, Inter, Arial, Helvetica, sans-serif','JetBrains Mono Variable,DejaVu Sans Mono,monospace','Inter Variable,Inter,Arial,Helvetica,sans-serif','Inter Variable,Inter,Arial,sans-serif']);
function embeddedFontCss(){return cyberFontFiles.map(f=>`@font-face{font-family:"${f.family}";font-style:normal;font-weight:${f.weight};src:url(data:font/woff2;base64,${readFileSync(join(ROOT,f.source)).toString('base64')}) format("woff2");}`).join('\n');}
// Input is the reviewed production InlineSvg result, not archive markup. Only
// the components' dark semantic colours/opacities and local citation URLs change.
export function bakeCyberSvg(source,chapter) {
  if(!Number.isInteger(chapter)||chapter<1||chapter>8||XMLValidator.validate(source)!==true||/<!DOCTYPE|<!ENTITY/iu.test(source))throw new Error('Invalid cyber SVG');
  const tree=fromHtml(source,{fragment:true}),all=nodes(tree),root=tree.children.find(n=>n.tagName==='svg');
  if(tree.children.filter(n=>n.type!=='text'||n.value.trim()).length!==1||!root)throw new Error('Invalid SVG root');
  if(root.properties.style!=='width:100%;height:auto')throw new Error('Unexpected SVG root style');
  delete root.properties.style;
  const ids=new Set();
  for(const n of all)if(n.properties?.id){if(ids.has(n.properties.id))throw new Error('Duplicate SVG ID');ids.add(n.properties.id);}
  const visit=(n,parents=[])=>{
    if(n.type==='element'){
      if(!svgTags.has(n.tagName))throw new Error(`Active or unexpected SVG element: ${n.tagName}`);
      for(const [key,value]of Object.entries(n.properties)){
        if(!svgProps.has(key))throw new Error(`Unexpected SVG attribute: ${key}`);
        if(key==='href'){
          if(!/^#source-\d{2}$/u.test(value))throw new Error('Unexpected SVG citation URL');
          n.properties.href=`../text/ch${String(chapter+1).padStart(3,'0')}.xhtml#c${chapter}-${value.slice(1)}`;
        }
        if(['fill','stroke','stopColor','markerEnd'].includes(key)){
          const local=/^url\(#([A-Za-z_][\w.-]*)\)$/u.exec(value);
          if(local){if(!ids.has(local[1]))throw new Error('Unresolved SVG paint');}
          else if(value==='none'&&key!=='markerEnd'){}
          else if(Object.hasOwn(colourMap,value))n.properties[key]=colourMap[value];
          else throw new Error('Unknown SVG paint');
        }
        if(key==='fontFamily'&&!fontFamilies.has(value))throw new Error('Unknown SVG font');
      }
      const parent=parents.at(-1),id=String(parent?.properties?.id??'');
      if(n.tagName==='path'&&parent?.tagName==='pattern'&&n.properties.opacity==='0.36'){
        if(chapter>=4&&id.endsWith('-hatch-quiet'))n.properties.opacity='0.12';
        if(chapter===6&&id.endsWith('-02-hatch-teal'))n.properties.opacity='0.08';
        if(chapter===7&&id.endsWith('-03-hatch-teal'))n.properties.opacity='0.35';
        if(chapter===8&&id.endsWith('-02-hatch-blue'))n.properties.opacity='0.12';
      }
      if(n.tagName==='stop'&&parent?.tagName==='linearGradient'){
        if(chapter===5&&id.endsWith('-01-teal-fade')&&n.properties.stopOpacity==='0.18')n.properties.stopOpacity='0.10';
        if(chapter===8&&id.endsWith('-02-tealfade')&&n.properties.stopOpacity==='0.17')n.properties.stopOpacity='0.12';
      }
      if(n.tagName==='title'&&editorialTitleViolation(toText(n)))throw new Error('Forbidden SVG title');
    }
    for(const child of n.children??[])visit(child,[...parents,n]);
  };
  visit(tree);
  const defs=root.children.find(n=>n.tagName==='defs');
  if(!defs)throw new Error('Missing SVG definitions');
  defs.children.unshift(element('style',{type:'text/css'},[text(embeddedFontCss())]));
  const result=serialize(tree);
  if(XMLValidator.validate(result)!==true)throw new Error('Invalid baked SVG XML');
  return result;
}
const passiveJsx=Object.freeze({p:['class'],details:[],summary:[],a:['href'],ol:['class'],li:['id'],strong:[]});
function attributes(node,allowed){const result=Object.create(null);for(const a of node.attributes){if(a.type!=='mdxJsxAttribute'||typeof a.value!=='string'||!allowed.includes(a.name)||Object.hasOwn(result,a.name))throw new Error('Non-literal or unexpected MDX attribute');result[a.name]=a.value;}return result;}
export function cyberArticleSource(chapter,lang){
  if(!['fr','en'].includes(lang)||!/^[-a-z0-9]+$/u.test(chapter.slug))throw new Error('Unsafe article path');
  return readFileSync(join(ROOT,'src/content',lang==='fr'?'posts':'posts-en',`${chapter.slug}.mdx`),'utf8');
}
export async function renderCyberArticle(source,chapter,offset=0){
  const book=Object.values(cyberRecoveryEditions).find(b=>b.chapters.includes(chapter));
  if(!book)throw new Error('Unconfigured cyber chapter');
  const {frontmatter:meta,content}=parseFrontmatter(source);
  if(meta.title!==chapter.title||!meta.description||meta.draft||(book.lang==='en'&&meta.sourceArticle!==chapter.sourceSlug))throw new Error('Incomplete or mismatched cyber article');
  const dates=[book.modified,meta.pubDate,meta.updatedDate??meta.pubDate].map(d=>new Date(d).getTime());
  if(!dates.every(Number.isFinite)||dates[0]<Math.max(...dates.slice(1)))throw new Error('Edition predates its source');
  if(book.lang==='en'){
    const fr=parseFrontmatter(readFileSync(join(ROOT,'src/content/posts',`${chapter.sourceSlug}.mdx`),'utf8')).frontmatter;
    if(new Date(meta.sourceUpdatedDate).getTime()!==new Date(fr.updatedDate??fr.pubDate).getTime())throw new Error('English source version drift');
  }
  if(contentTitleViolations(content,new Map(Object.entries(meta))).length)throw new Error('Forbidden cyber article title');
  const [component,renderer,references,kinds]=cyberFigureSpecs[chapter.number-1];
  const mdast=unified().use(remarkParse).use(remarkGfm).use(remarkMdx).parse(content);let imported=false;
  for(const n of nodes(mdast)){
    if(n.type==='mdxjsEsm'){
      const statements=n.data?.estree?.body;
      if(!statements?.length)throw new Error('Missing MDX import AST');
      for(const s of statements){if(imported||s.type!=='ImportDeclaration'||s.specifiers.length!==1||s.specifiers[0].type!=='ImportDefaultSpecifier'||s.specifiers[0].local.name!==component||s.source.value!==`../../components/${component}.astro`)throw new Error('Unapproved MDX import or export');imported=true;}
    }else if(['mdxFlowExpression','mdxTextExpression','html','image','imageReference'].includes(n.type))throw new Error('Active or unexpected MDX content');
  }
  if(!imported)throw new Error('Missing controlled figure import');
  mdast.children=mdast.children.filter(n=>n.type!=='mdxjsEsm');
  const attachments=[],figures=[];
  const handler=(state,n)=>{
    if(n.name===component){
      const p=attributes(n,['kind','lang','number','sources','caption']),number=figures.length+1;
      if(Object.keys(p).length!==5||p.lang!==book.lang||p.number!==String(number).padStart(2,'0')||p.kind!==kinds[number-1]||!p.caption.trim())throw new Error('Invalid figure properties');
      const refs=references(p.kind,p.sources),original=renderer(book.lang,p.kind),svg=bakeCyberSvg(original,chapter.number),name=`file${offset+attachments.length}.svg`;
      const desc=nodes(fromHtml(svg,{fragment:true})).find(n=>n.tagName==='desc');if(!desc||!toText(desc).trim())throw new Error('Missing SVG alternative');
      attachments.push({name,svg,original,chapter:chapter.number,figure:number,kind:p.kind});
      figures.push({id:`figure-${p.number}`,caption:p.caption,number});
      return element('div',{className:['infographic-block']},[
        element('figure',{id:`figure-${p.number}`,className:['infographic']},[
          element('img',{src:`../media/${name}`,alt:toText(desc).trim(),className:['infographic-image']}),
          element('p',{className:['figure-enlarge']},[element('a',{href:`../media/${name}`},[text(book.lang==='fr'?'Agrandir la composition complète':'Open the complete composition')])]),
          element('figcaption',{},[element('strong',{},[text(`FIG. ${p.number}`)]),text(` ${p.caption} `),...refs.flatMap(id=>[element('a',{href:`#source-${id}`},[text(`[${Number(id)}]`)]),text(' ')])]),
        ]),...state.all(n),
      ]);
    }
    if(!Object.hasOwn(passiveJsx,n.name))throw new Error(`Unapproved MDX element: ${n.name}`);
    const p=attributes(n,passiveJsx[n.name]);if(p.class){p.className=p.class.split(/\s+/u);delete p.class;}
    let children=state.all(n);if(['p','summary'].includes(n.name)&&children.length===1&&children[0].tagName==='p')children=children[0].children;
    const tag=n.name==='details'?'section':n.name==='summary'?'p':n.name;
    if(n.name==='summary')p.className=['reading-box-title'];
    return element(tag,p,children);
  };
  const tree=await unified().use(remarkRehype,{handlers:{mdxJsxFlowElement:handler,mdxJsxTextElement:handler}}).run(mdast);
  normalizeParagraphs(tree);
  for(const n of nodes(tree))if(['th','td'].includes(n.tagName)&&n.properties.align){const a=n.properties.align;if(!['left','center','right'].includes(a))throw new Error('Invalid table alignment');n.properties.className=[`align-${a}`];delete n.properties.align;}
  assertCyberPassiveTree(tree);
  if(figures.length!==4||chapter.figureCount!==4)throw new Error('Figure count drift');
  const ids=new Map(),slugger=new GithubSlugger(),headings=[];
  for(const n of nodes(tree)){
    if(/^h[2-6]$/u.test(n.tagName??'')){
      n.properties.id??=slugger.slug(toText(n));
      if(n.tagName==='h2')headings.push({title:toText(n),id:`c${chapter.number}-${n.properties.id}`});
    }
    if(n.properties?.id){const old=String(n.properties.id);if(ids.has(old)||!/^[\p{L}\p{N}_-]+$/u.test(old))throw new Error('Duplicate or unsafe chapter ID');ids.set(old,`c${chapter.number}-${old}`);n.properties.id=ids.get(old);}
  }
  for(const f of figures)f.id=ids.get(f.id);
  return {tree,html:serialize(tree),ids,headings,figures,attachments,meta,sourceHash:sha(source),next:offset+attachments.length};
}
export function prepareCyberReading(rendered,chapter,routes,glossary){
  for(const n of nodes(rendered.tree)){
    if(n.tagName!=='a')continue;const href=String(n.properties.href);assertCyberLink(href);
    if(href.startsWith('../media/'))continue;
    const u=new URL(href,SITE+chapter.route);
    if(href.startsWith('#')){
      const id=rendered.ids.get(decodeURIComponent(u.hash.slice(1)));if(!id)throw new Error(`Unresolved chapter fragment: ${href}`);n.properties.href=`#${id}`;
    }else if(u.origin===SITE&&routes.has(u.pathname)){
      const target=routes.get(u.pathname),id=u.hash?target.ids.get(decodeURIComponent(u.hash.slice(1))):`chapter-${target.chapter.number}`;
      if(!id)throw new Error(`Unresolved cross-chapter fragment: ${href}`);n.properties.href=`${target.chapter.chapter}#${id}`;
    }else if(u.origin===SITE&&glossary.has(u.pathname)&&!u.hash){n.properties.href=`glossary.xhtml#glossary-${glossary.get(u.pathname)}`;
    }else if(!/^[a-z][a-z0-9+.-]*:/iu.test(href))n.properties.href=u.href;
  }
  assertCyberPassiveTree(rendered.tree);return serialize(rendered.tree);
}
export const cyberEpubCss = `${cyberFontFiles.map(f=>`@font-face{font-family:"${f.family}";font-style:normal;font-weight:${f.weight};src:url(../fonts/${f.name}) format("woff2");}`).join('\n')}
:root{color-scheme:dark}html,body{background:#0c0d10;color:#e7e9ee}body{font-family:"Inter Variable",sans-serif;line-height:1.7;margin:0 auto;padding:1.2em;max-width:42em}h1,h2,h3{line-height:1.25;page-break-after:avoid;break-after:avoid}h1{font-size:2em;margin:1.5em 0 .8em}h2{font-size:1.4em;margin:2em 0 .8em}h3{font-size:1.15em}p{margin:.8em 0}a{color:#5eead4;text-decoration:underline;overflow-wrap:anywhere}strong{font-weight:700}.subtitle{font-size:1.4em;color:#5eead4}.author,.chapter-kicker{color:#f5b13d}.standfirst{font-size:1.15em}.kicker,.chapter-meta,.source-meta{font-size:.82em;color:#aeb4bf}.source-id,code{font-family:"JetBrains Mono Variable",monospace;font-size:.78em;overflow-wrap:anywhere;word-break:break-all}figure{margin:1.8em auto 2.4em}img{max-width:100%;height:auto}.infographic-image{display:block;width:100%;height:auto;background:#0c0d10}.figure-enlarge{font-size:.85em;margin-top:.7em}figcaption{font-size:.9em;color:#aeb4bf;line-height:1.6}.reading-box-title{font-weight:700;color:#f5b13d}.infographic-block>section{border-left:2px solid #5eead4;padding-left:1em;font-size:.9em;margin-bottom:2em}.chapter-art{max-width:38em}.chapter-art img{display:block;width:100%}li{margin:.55em 0}table{border-collapse:collapse;font-size:.9em;width:100%;overflow-wrap:anywhere}th,td{padding:.5em;border-bottom:1px solid #555c66}th{text-align:left}.align-left{text-align:left}.align-center{text-align:center}.align-right{text-align:right}blockquote{border-left:2px solid #f5b13d;margin-left:0;padding-left:1em}.cover-page{margin:0;padding:0;max-width:none}.cover-page img{display:block;width:100%;height:auto}.half-title,.titlepage{text-align:center;margin:4em auto}.titlepage h1{font-size:2.5em}.glossary-entry{margin:2em 0;page-break-inside:avoid;break-inside:avoid}.sources li,.source-notices li{margin-bottom:1em}.license-text{font-family:"JetBrains Mono Variable",monospace;font-size:.68em;white-space:pre-wrap;overflow-wrap:anywhere}.edition-note{border-top:1px solid #555c66;padding-top:1em}@media(max-width:36em){body{padding:1em}.infographic{margin-left:0;margin-right:0}h1{font-size:1.7em}table{font-size:.8em}}
`;
function assertBook(book){
  if(book.directory!==({fr:'apres-la-cyberattaque',en:'after-the-cyberattack'})[book.lang]||book.theme!=='dark'||book.chapters.length!==8||book.figureCount!==32||!/^[-a-z0-9]+$/u.test(book.directory)||book.epub!==`/publications/${book.directory}-l0g.epub`||book.cover!==`/publications/${book.directory}-cover.jpg`)throw new Error('Invalid cyber edition');
  for(const [i,c]of book.chapters.entries())if(c.number!==i+1||c.figureCount!==4||c.chapter!==`ch${String(i+2).padStart(3,'0')}.xhtml`||!c.route.startsWith(book.lang==='fr'?'/posts/':'/en/analysis/'))throw new Error('Invalid cyber chapter configuration');
  for(const title of [book.title,book.subtitle,book.introductionTitle,book.conclusionTitle,book.methodTitle,book.readerGuideTitle,book.glossaryTitle,book.synthesisSourcesTitle,book.colophonTitle,...book.chapters.map(c=>c.title),...book.glossary.map(g=>g.title)])if(typeof title!=='string'||editorialTitleViolation(title))throw new Error(`Forbidden or missing book title: ${title}`);
}
export async function generateCyberRecoveryEpub(lang='fr'){
  if(!['fr','en'].includes(lang))throw new Error('Unsupported cyber edition language');
  const book=cyberRecoveryEditions[lang];assertBook(book);const tr=(fr,en)=>lang==='fr'?fr:en;
  // Complete parsing and link resolution before replacing an older generated book.
  let offset=0;const rendered=[];
  for(const chapter of book.chapters){const r=await renderCyberArticle(cyberArticleSource(chapter,lang),chapter,offset);offset=r.next;rendered.push({...r,chapter});}
  const routes=new Map(rendered.map(r=>[r.chapter.route,r])),glossary=new Map(book.glossary.map(g=>[g.path,g.slug]));
  const bodies=rendered.map(r=>prepareCyberReading(r,r.chapter,routes,glossary));
  const provenance=[];
  for(const edition of Object.values(cyberRecoveryEditions))for(const chapter of edition.chapters){const source=cyberArticleSource(chapter,edition.lang),meta=parseFrontmatter(source).frontmatter;provenance.push({lang:edition.lang,chapter,file:`src/content/${edition.lang==='fr'?'posts':'posts-en'}/${chapter.slug}.mdx`,hash:sha(source),date:meta.pubDate,updated:meta.updatedDate??meta.pubDate});}
  if(provenance.length!==16)throw new Error('Source provenance count drift');
  const sourceDir=join(ROOT,'src/epub',book.directory),epubDir=join(sourceDir,'EPUB'),media=join(epubDir,'media'),textDir=join(epubDir,'text');
  // Only the two statically configured generator output directories are removed.
  if(existsSync(sourceDir))rmSync(sourceDir,{recursive:true});
  for(const dir of [media,textDir,join(epubDir,'fonts'),join(epubDir,'styles'),join(sourceDir,'META-INF'),join(ROOT,'public/publications')])mkdirSync(dir,{recursive:true});
  const saveXml=(path,content)=>{const result=XMLValidator.validate(content);if(result!==true)throw new Error(`${relative(ROOT,path)}: invalid XML ${JSON.stringify(result)}`);writeFileSync(path,content);};
  writeFileSync(join(sourceDir,'mimetype'),'application/epub+zip');
  saveXml(join(sourceDir,'META-INF/container.xml'),'<?xml version="1.0" encoding="UTF-8"?><container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles><rootfile full-path="EPUB/content.opf" media-type="application/oebps-package+xml"/></rootfiles></container>');
  const documents=[];
  const writeChapter=(file,title,body,type='bodymatter')=>{
    const tree=fromHtml(body,{fragment:true});assertCyberPassiveTree(tree);
    for(const h of nodes(tree).filter(n=>/^h[1-6]$/u.test(n.tagName??'')))if(editorialTitleViolation(toText(h)))throw new Error(`Forbidden EPUB heading: ${toText(h)}`);
    let document=xhtmlDocument(book,{title,body,bodyType:type});if(file==='cover.xhtml')document=document.replace('<body ','<body class="cover-page" ');
    saveXml(join(textDir,file),document);documents.push({file,id:file.slice(0,-6)});
  };
  writeFileSync(join(epubDir,'styles/stylesheet1.css'),cyberEpubCss);
  for(const f of cyberFontFiles){copyFileSync(join(ROOT,f.source),join(epubDir,'fonts',f.name));copyFileSync(join(ROOT,'public/fonts/jlr',f.license),join(epubDir,'fonts',f.license));}
  const cover=await sharp(join(ROOT,`src/epub-assets/${book.directory}-cover.png`)).resize(1024,1638,{fit:'contain',background:'#0c0d10'}).jpeg({quality:85,mozjpeg:true}).toBuffer();
  writeFileSync(join(media,'cover.jpg'),cover);writeFileSync(join(ROOT,'public',book.cover),cover);
  for(const width of [320,640,960])await sharp(cover).resize({width}).webp({quality:84}).toFile(join(ROOT,'public',book.cover.replace('.jpg',`-${width}.webp`)));
  writeChapter('cover.xhtml',tr('Couverture','Cover'),`<img src="../media/cover.jpg" alt="${xml(book.title)}"/>`,'frontmatter cover');
  writeChapter('half_title.xhtml',book.title,`<section class="half-title"><h1>${xml(book.title)}</h1><p>${xml(book.subtitle)}</p><p>l0g</p></section>`,'frontmatter');
  writeChapter('title_page.xhtml',book.title,`<section class="titlepage"><h1>${xml(book.title)}</h1><p class="subtitle">${xml(book.subtitle)}</p><p class="author">l0g</p><p>${tr('19 octobre 2026 · Édition française','19 October 2026 · English edition')}</p><p>${tr('Huit analyses intégrales · 32 infographies · Glossaire et sources','Eight complete analyses · 32 infographics · Glossary and sources')}</p><p>Creative Commons Attribution 4.0 International</p></section>`,'frontmatter');
  writeChapter('reader-guide.xhtml',book.readerGuideTitle,`<section id="reader-guide"><h1>${xml(book.readerGuideTitle)}</h1>${paragraphs(book.readerGuide)}</section>`,'frontmatter');
  writeChapter('method.xhtml',book.methodTitle,`<section id="method"><h1>${xml(book.methodTitle)}</h1>${paragraphs(book.method)}</section>`,'frontmatter');
  writeChapter('ch001.xhtml',book.introductionTitle,`<section id="introduction"><p class="chapter-kicker">Introduction</p><h1>${xml(book.introductionTitle)}</h1>${paragraphs(book.introduction)}</section>`);
  const nav=[{title:book.readerGuideTitle,href:'text/reader-guide.xhtml'},{title:book.methodTitle,href:'text/method.xhtml'},{title:book.introductionTitle,href:'text/ch001.xhtml'}],attachments=[];
  for(const [i,r]of rendered.entries()){
    const c=r.chapter;
    if(!/^\/(?:illustrations\/news|images\/og)\/[a-z0-9-]+\.jpg$/u.test(c.image))throw new Error('Unsafe chapter image path');
    copyFileSync(join(ROOT,'public',c.image),join(media,`chapter-${c.number}.jpg`));
    const date=String(r.meta.pubDate),updated=String(r.meta.updatedDate??r.meta.pubDate);
    writeChapter(c.chapter,c.title,`<section id="chapter-${c.number}"><p class="chapter-kicker">${tr('Chapitre','Chapter')} ${c.number}</p><h1>${xml(c.title)}</h1><p class="chapter-meta">${tr('Publication','Published')}: ${xml(date)} · ${tr('Mise à jour','Updated')}: ${xml(updated)}</p><figure class="chapter-art"><img src="../media/chapter-${c.number}.jpg" alt="${xml(c.imageAlt)}"/><figcaption>${tr('Illustration conceptuelle créée avec une assistance d’intelligence artificielle ; elle ne documente aucun événement réel.','Conceptual illustration created with AI assistance; it does not document an actual event.')}</figcaption></figure>${bodies[i]}</section>`);
    for(const a of r.attachments){saveXml(join(media,a.name),a.svg);attachments.push(a);}
    nav.push({title:c.title,href:`text/${c.chapter}#chapter-${c.number}`,children:r.headings.map(h=>({title:h.title,href:`text/${c.chapter}#${h.id}`}))});
  }
  writeChapter('conclusion.xhtml',book.conclusionTitle,`<section id="conclusion"><h1>${xml(book.conclusionTitle)}</h1>${paragraphs(book.conclusion)}</section>`,'backmatter');nav.push({title:book.conclusionTitle,href:'text/conclusion.xhtml'});
  writeChapter('glossary.xhtml',book.glossaryTitle,`<section id="glossary"><h1>${xml(book.glossaryTitle)}</h1>${book.glossary.map(g=>{if(!/^[-a-z0-9]+$/u.test(g.slug))throw new Error('Invalid glossary slug');return `<section class="glossary-entry" id="glossary-${g.slug}"><h2>${xml(g.title)}</h2><p>${xml(g.definition)}</p><p>${tr('Chapitres','Chapters')}: ${g.chapters.map(n=>{const c=book.chapters[n-1];if(!c)throw new Error('Invalid glossary chapter');return `<a href="${c.chapter}#chapter-${n}">${n}</a>`;}).join(' · ')}</p><ul>${g.sources.map(s=>{assertCyberLink(s.url);return `<li><a href="${xml(s.url)}">${xml(s.title)}</a>${s.detail?` · ${xml(s.detail)}`:''} · <a href="${book.chapters[s.chapter-1]?.chapter}#c${s.chapter}-source-${String(s.reference).padStart(2,'0')}">${tr('Chapitre','Chapter')} ${s.chapter}, ${tr('source','reference')} ${s.reference}</a></li>`;}).join('')}</ul></section>`;}).join('')}</section>`,'backmatter');nav.push({title:book.glossaryTitle,href:'text/glossary.xhtml'});
  writeChapter('synthesis-sources.xhtml',book.synthesisSourcesTitle,`<section id="synthesis-sources"><h1>${xml(book.synthesisSourcesTitle)}</h1><ol>${book.synthesisSources.map(s=>{assertCyberLink(s.url);return `<li><a href="${xml(s.url)}">${xml(s.title)}</a><p>${xml(s.detail)}</p><p>${tr('Chapitres','Chapters')}: ${s.chapters.map(n=>`<a href="${book.chapters[n-1].chapter}#chapter-${n}">${n}</a>`).join(' · ')}</p></li>`;}).join('')}</ol></section>`,'backmatter');nav.push({title:book.synthesisSourcesTitle,href:'text/synthesis-sources.xhtml'});
  const figuresTitle=tr('Table des infographies','List of infographics');
  writeChapter('figures.xhtml',figuresTitle,`<section id="figures"><h1>${figuresTitle}</h1><ol>${rendered.flatMap(r=>r.figures.map(f=>`<li><a href="${r.chapter.chapter}#${f.id}">${tr('Chapitre','Chapter')} ${r.chapter.number} · FIG. ${f.number}</a><p>${xml(f.caption)}</p></li>`)).join('')}</ol></section>`,'backmatter');nav.push({title:figuresTitle,href:'text/figures.xhtml'});
  writeChapter('colophon.xhtml',book.colophonTitle,`<section id="colophon"><h1>${xml(book.colophonTitle)}</h1>${paragraphs(book.colophon)}<h2>${tr('Provenance des seize articles','Provenance of all sixteen articles')}</h2><p>${tr('Chaque empreinte SHA-256 identifie les octets du fichier MDX repris. Elle permet une comparaison avec ce fichier, sans certifier les faits ni constituer une signature numérique.','Each SHA-256 digest identifies the bytes of the source MDX file. It supports comparison with that file; it neither certifies the reporting nor constitutes a digital signature.')}</p><ol>${provenance.map(p=>`<li><a href="${SITE}${p.chapter.route}">${xml(p.chapter.title)}</a> (${p.lang})<p class="source-id">${xml(p.file)}</p><p class="source-meta">${tr('Publication','Published')}: ${xml(String(p.date))} · ${tr('Mise à jour','Updated')}: ${xml(String(p.updated))}</p><p class="source-id">SHA-256: <code>${p.hash}</code></p></li>`).join('')}</ol><p><a href="${SITE}${book.path}">${tr('Édition et corrections ultérieures','Edition and subsequent corrections')}</a></p></section>`,'backmatter');nav.push({title:book.colophonTitle,href:'text/colophon.xhtml'});
  const licenseTitle=tr('Droits et licences','Rights and licences');
  writeChapter('licenses.xhtml',licenseTitle,`<section id="licenses"><h1>${licenseTitle}</h1><p>l0g · <a href="https://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution 4.0 International</a></p><p>${tr('Les publications et figures l0g sont attribuées à l0g ; les documents cités et les marques restent soumis aux droits de leurs titulaires.','The l0g publications and figures are attributed to l0g; cited documents and trademarks remain subject to their owners’ rights.')}</p><p>${tr('Polices locales Inter Variable et JetBrains Mono Variable, SIL Open Font License 1.1. Les textes de licence complets sont reproduits ci-dessous et inclus avec les fichiers de police.','Local Inter Variable and JetBrains Mono Variable fonts, SIL Open Font License 1.1. Complete licence texts appear below and are included with the font files.')}</p>${cyberFontFiles.map(f=>`<h2>${xml(f.family)}</h2><pre class="license-text">${xml(readFileSync(join(ROOT,'public/fonts/jlr',f.license),'utf8'))}</pre>`).join('')}</section>`,'backmatter');nav.push({title:licenseTitle,href:'text/licenses.xhtml'});
  const navList=entries=>`<ol>${entries.map(e=>`<li><a href="${xml(e.href)}">${xml(e.title)}</a>${e.children?navList(e.children):''}</li>`).join('')}</ol>`;
  const contents=tr('Sommaire','Contents');
  saveXml(join(epubDir,'nav.xhtml'),xhtmlDocument(book,{title:contents,bodyType:'frontmatter',body:`<nav epub:type="toc" id="toc"><h1>${contents}</h1>${navList(nav)}</nav><nav epub:type="landmarks"><h2>${tr('Repères','Landmarks')}</h2><ol><li><a epub:type="cover" href="text/cover.xhtml">${tr('Couverture','Cover')}</a></li><li><a epub:type="bodymatter" href="text/ch001.xhtml">Introduction</a></li><li><a epub:type="glossary" href="text/glossary.xhtml">${xml(book.glossaryTitle)}</a></li></ol></nav>`}).replace('../styles/stylesheet1.css','styles/stylesheet1.css'));
  let order=0;const ncx=entries=>entries.map(e=>{const id=++order;return `<navPoint id="nav-${id}" playOrder="${id}"><navLabel><text>${xml(e.title)}</text></navLabel><content src="${xml(e.href)}"/>${e.children?ncx(e.children):''}</navPoint>`;}).join('');
  saveXml(join(epubDir,'toc.ncx'),`<?xml version="1.0" encoding="UTF-8"?><ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1" xml:lang="${lang}"><head><meta name="dtb:uid" content="${book.id}"/><meta name="dtb:depth" content="2"/><meta name="dtb:totalPageCount" content="0"/><meta name="dtb:maxPageNumber" content="0"/></head><docTitle><text>${xml(book.title)}</text></docTitle><navMap>${ncx(nav)}</navMap></ncx>`);
  const manifest=[['nav','nav.xhtml','application/xhtml+xml','nav'],['ncx','toc.ncx','application/x-dtbncx+xml'],['css','styles/stylesheet1.css','text/css'],['cover-image','media/cover.jpg','image/jpeg','cover-image'],...documents.map(d=>[d.id,`text/${d.file}`,'application/xhtml+xml']),...book.chapters.map(c=>[`art-${c.number}`,`media/chapter-${c.number}.jpg`,'image/jpeg']),...attachments.map((a,i)=>[`fig-${i}`,`media/${a.name}`,'image/svg+xml']),...cyberFontFiles.flatMap((f,i)=>[[`font-${i}`,`fonts/${f.name}`,'font/woff2'],[`font-license-${i}`,`fonts/${f.license}`,'text/plain']])];
  const spine=['cover','half_title','title_page','nav','reader-guide','method','ch001',...book.chapters.map(c=>c.chapter.slice(0,-6)),'conclusion','glossary','synthesis-sources','figures','colophon','licenses'];
  saveXml(join(epubDir,'content.opf'),`<?xml version="1.0" encoding="UTF-8"?><package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="book-id" xml:lang="${lang}" prefix="schema: http://schema.org/"><metadata xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:identifier id="book-id">${book.id}</dc:identifier><dc:title>${xml(book.title)}</dc:title><dc:language>${lang}</dc:language><dc:creator>l0g</dc:creator><dc:publisher>l0g.fr</dc:publisher><dc:date>${book.date}</dc:date><dc:description>${xml(book.description)}</dc:description><dc:source>${SITE}${book.path}</dc:source><dc:rights>Creative Commons Attribution 4.0 International</dc:rights><meta property="dcterms:modified">${book.modified}</meta><meta name="cover" content="cover-image"/><meta property="schema:accessMode">textual</meta><meta property="schema:accessMode">visual</meta><meta property="schema:accessibilityFeature">alternativeText</meta><meta property="schema:accessibilityFeature">readingOrder</meta><meta property="schema:accessibilityFeature">structuralNavigation</meta><meta property="schema:accessibilityFeature">tableOfContents</meta><meta property="schema:accessibilityHazard">none</meta><meta property="schema:accessibilitySummary">${tr('Texte redistribuable, navigation structurée, glossaire et sources. Trente-deux infographies originales complètes, avec descriptions alternatives et liens d’agrandissement ; le zoom dépend de la liseuse.','Reflowable text, structured navigation, glossary and sources. Thirty-two complete original infographics with text alternatives and enlargement links; zoom depends on the reading app.')}</meta></metadata><manifest>${manifest.map(([id,href,type,properties])=>`<item id="${id}" href="${href}" media-type="${type}"${properties?` properties="${properties}"`:''}/>`).join('')}</manifest><spine toc="ncx">${spine.map(id=>`<itemref idref="${id}"/>`).join('')}${attachments.map((a,i)=>`<itemref idref="fig-${i}" linear="no"/>`).join('')}</spine></package>`);
  // Refuse stale/unmanifested payloads even when rerunning generation.
  const actual=readdirSync(media).sort(),expected=['cover.jpg',...book.chapters.map(c=>`chapter-${c.number}.jpg`),...attachments.map(a=>a.name)].sort();
  if(JSON.stringify(actual)!==JSON.stringify(expected))throw new Error('Unexpected EPUB media payload');
  console.log(`${book.title}: 8 complete articles, 32 full SVG figures, 16 source digests, dark EPUB sources generated.`);
  return {book,sourceDir,provenance,attachments};
}
if(process.argv[1]&&resolve(process.argv[1])===new URL(import.meta.url).pathname){for(const lang of ['fr','en'])await generateCyberRecoveryEpub(lang);}
