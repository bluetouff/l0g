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
import { ordinaryMachinesEditions } from '../src/config/ordinary-machines-publication.mjs';
import { assertCyberContentModel as assertOrdinaryMachinesContentModel, assertCyberLink as assertOrdinaryMachinesLink, cyberFontFiles as ordinaryMachinesFontFiles, cyberEpubCss } from './generate-cyber-recovery-epub.mjs';
import { COLD_CHAIN_FIGURE_KINDS, coldChainFigureMeta } from '../src/lib/cold-chain-01-figures.mjs';
import { MACHINES02_FIGURE_KINDS, machines02FigureMeta } from '../src/lib/machines02-figures.mjs';
import { MACHINES03_FIGURE_KINDS, machines03FigureMeta } from '../src/lib/machines03-figures.mjs';
import { MACHINES04_FIGURE_KINDS, machines04FigureMeta } from '../src/lib/machines04-figures.mjs';
import { MACHINES05_FIGURE_KINDS, machines05FigureMeta } from '../src/lib/machines05-figures.mjs';
import { MACHINES06_FIGURE_KINDS, machines06FigureMeta } from '../src/lib/machines06-figures.mjs';
import { MACHINES07_FIGURE_KINDS, machines07FigureMeta } from '../src/lib/machines07-figures.mjs';
export { assertOrdinaryMachinesContentModel, assertOrdinaryMachinesLink, ordinaryMachinesFontFiles };

const ROOT = resolve(new URL('..', import.meta.url).pathname);
const SITE = 'https://l0g.fr';
export const ordinaryMachinesSourceCounts = Object.freeze([16,13,18,14,15,10,13]);
export const ordinaryMachinesFigureSpecs = Object.freeze([
  ['ColdChainFigure','cold-chain-01',coldChainFigureMeta,COLD_CHAIN_FIGURE_KINDS],
  ['MachineAuthorityFigure','machine-authority-02',machines02FigureMeta,MACHINES02_FIGURE_KINDS],
  ['RemoteMaintenanceFigure','remote-maintenance-03',machines03FigureMeta,MACHINES03_FIGURE_KINDS],
  ['SabotageAttributionFigure','sabotage-attribution-04',machines04FigureMeta,MACHINES04_FIGURE_KINDS],
  ['ColdLossFigure','cold-loss-05',machines05FigureMeta,MACHINES05_FIGURE_KINDS],
  ['MachineRulesFigure','machine-rules-06',machines06FigureMeta,MACHINES06_FIGURE_KINDS],
  ['MachineResilienceFigure','machine-resilience-07',machines07FigureMeta,MACHINES07_FIGURE_KINDS],
].map(Object.freeze));
export const ordinaryMachinesSvgFontFiles = Object.freeze([400,700].map(weight=>Object.freeze({
  name:`dejavu-sans-${weight}.ttf`,weight,
})));
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
const htmlTags = new Set(['p','a','strong','em','sup','sub','code','pre','blockquote','ol','ul','li','h1','h2','h3','h4','h5','h6','hr','br','table','thead','tbody','tr','th','td','del','section','div','figure','figcaption','img','span']);
export function assertOrdinaryMachinesPassiveTree(tree) {
  for(const n of nodes(tree)){
    if(n.type!=='element')continue;
    if(!htmlTags.has(n.tagName))throw new Error(`Unexpected EPUB element: ${n.tagName}`);
    for(const [key,value]of Object.entries(n.properties??{})){
      if(!['id','className','href','src','alt','title','colSpan','rowSpan','scope','ariaLabel'].includes(key))throw new Error(`Unexpected EPUB attribute: ${key}`);
      if(key==='href')assertOrdinaryMachinesLink(value);
      if(key==='src'&&!/^\.\.\/media\/(?:file\d+\.svg|chapter-[1-7]\.jpg|cover\.jpg)$/u.test(value))throw new Error('External EPUB resource');
    }
  }
  assertOrdinaryMachinesContentModel(tree);
}
const svgTags = new Set(['svg','title','desc','path','rect','text','line','circle']);
const svgProps = new Set(['xmlns','viewBox','style','className','role','ariaLabelledBy','id','d','fill','stroke','strokeWidth','strokeLineCap','strokeLineJoin','x','y','width','height','rx','fontFamily','fontSize','fontWeight','textAnchor','dataMaxWidth','dataPanel','dataRole','dataProof','dataContribution','dataPhase','dataLane','dataConnector','dataSiteHours','dataCopyDirection','dataDevice','dataBaseline','dataEndYear','dataStatus','dataSource','dataScenario','dataView','dataEvents','dataRecord','dataIncident','dataTrigger','dataLayer','dataRank','dataRateHigh','dataBranch','dataStartHour','dataResource','dataReachable','dataDate','dataEvidence','dataValue','dataExample','dataMetric','dataRawMinutes','dataMoney','dataOffsetMinutes','dataRow','dataFinishHour','dataSaving','dataTeams','dataStage','dataState','dataClosingStock','dataRecoveryOutflow','dataTrack','dataDifference','dataTeam','dataNormalisedMinutes','dataOrder','dataRule','dataNode','dataSite','dataIllustration','dataStartYear','dataRateLow','x1','y1','x2','y2','strokeDashArray','cx','cy','r']);
export const ordinaryMachinesPalette = Object.freeze({ink:'#0c0d10',surface:'#121419','surface-2':'#171a20','line-strong':'rgba(255, 255, 255, 0.20)',paper:'#e7e9ee',bright:'#f5f6f8',muted:'#8b909b',signal:'#5eead4',accent:'#ff4d87',amber:'#f5b13d','topic-blue':'#7aa2f7'});
const fontFamilyByChapter = Object.freeze(['l0g Cold Chain','l0g Machine Authority','l0g Remote Maintenance','l0g Sabotage Attribution','l0g Cold Loss','l0g Machine Rules','l0g Machine Resilience']);
const fontDirectoryByChapter = Object.freeze(Array(7).fill('stablecoins'));
export function ordinaryMachinesSvgFontCss(chapter){
  if(!Number.isInteger(chapter)||chapter<1||chapter>7)throw new Error('Invalid ordinary machines font chapter');
  return ordinaryMachinesSvgFontFiles.map(font=>`@font-face{font-family:"${fontFamilyByChapter[chapter-1]}";font-style:normal;font-weight:${font.weight};src:url(data:font/ttf;base64,${readFileSync(join(ROOT,'public/fonts',fontDirectoryByChapter[chapter-1],font.name)).toString('base64')}) format("truetype");}`).join('\n');
}
// Parse reviewed vector files without evaluating archive/MDX code. Geometry,
// text and compositions remain exact; semantic paints and local fonts are baked
// for standalone offline readers whose styles cannot inherit website variables.
export function bakeOrdinaryMachinesSvg(source,chapter) {
  if(!Number.isInteger(chapter)||chapter<1||chapter>7||typeof source!=='string'||source.length>500_000||XMLValidator.validate(source)!==true||/<!DOCTYPE|<!ENTITY/iu.test(source))throw new Error('Invalid ordinary machines SVG');
  const tree=fromHtml(source,{fragment:true}),all=nodes(tree),root=tree.children.find(n=>n.tagName==='svg');
  if(tree.children.filter(n=>n.type!=='text'||n.value.trim()).length!==1||!root)throw new Error('Invalid SVG root');
  if(root.properties.style!=='width:100%;height:auto'||root.properties.xmlns!=='http://www.w3.org/2000/svg')throw new Error('Unexpected SVG root contract');
  const ids=new Set();
  for(const n of all)if(n.properties?.id){const id=n.properties.id;if(typeof id!=='string'||! /^[A-Za-z_][\w.-]*$/u.test(id)||ids.has(id))throw new Error('Duplicate or invalid SVG ID');ids.add(id);}
  for(const n of all.filter(n=>n.type==='element')){
    if(!svgTags.has(n.tagName))throw new Error(`Active or unexpected SVG element: ${n.tagName}`);
    for(const [key,value]of Object.entries(n.properties)){
      if(!svgProps.has(key))throw new Error(`Unexpected SVG attribute: ${key}`);
      if(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]|javascript:|@import/iu.test(String(value)))throw new Error('Active SVG value');
      if(key==='style'){
        if(n!==root||value!=='width:100%;height:auto')throw new Error('Unexpected SVG style');
        delete n.properties.style;
      }else if(['fill','stroke'].includes(key)){
        const paint=/^var\(--color-([a-z0-9-]+)\)$/u.exec(value);
        if(value==='none'){}
        else if(paint&&Object.hasOwn(ordinaryMachinesPalette,paint[1]))n.properties[key]=ordinaryMachinesPalette[paint[1]];
        else throw new Error('Unknown SVG paint');
      }else if(key==='fontFamily'&&value!==fontFamilyByChapter[chapter-1])throw new Error('Unknown ordinary machines SVG font');
      else if(key==='ariaLabelledBy'){
        const refs=Array.isArray(value)?value:String(value).split(/\s+/u);
        if(!refs.length||refs.some(id=>!ids.has(id)))throw new Error('Unresolved SVG accessible name');
      }
    }
  }
  const box=String(root.properties.viewBox).split(/\s+/u).map(Number);
  if(box.length!==4||box.some(n=>!Number.isFinite(n))||box[0]!==0||box[1]!==0||![420,1000].includes(box[2])||box[3]<400||box[3]>1200)throw new Error('Unexpected ordinary machines SVG viewBox');
  root.children.unshift(element('defs',{},[element('style',{type:'text/css'},[text(ordinaryMachinesSvgFontCss(chapter))])]));
  const result=serialize(tree);if(XMLValidator.validate(result)!==true)throw new Error('Invalid baked SVG XML');return result;
}
export function referenceId(chapter,reference){
  if(!Number.isInteger(chapter)||chapter<1||chapter>7)throw new Error('Invalid reference chapter');
  const value=typeof reference==='string'&&/^\d{1,2}$/u.test(reference)?Number(reference):reference;
  if(!Number.isInteger(value)||value<1||value>ordinaryMachinesSourceCounts[chapter-1])throw new Error('Invalid source reference');
  return String(value).padStart(2,'0');
}
const passiveJsx=Object.freeze({p:['class','className'],details:['id'],summary:[],a:['id','href','aria-label','target','rel'],ol:['class','className'],li:['id'],strong:[],sup:['className'],span:['className']});
function attributes(node,allowed){const result=Object.create(null);for(const a of node.attributes){if(a.type!=='mdxJsxAttribute'||typeof a.value!=='string'||!allowed.includes(a.name)||Object.hasOwn(result,a.name))throw new Error('Non-literal or unexpected MDX attribute');result[a.name]=a.value;}return result;}
export function ordinaryMachinesArticleSource(chapter,lang){
  if(!['fr','en'].includes(lang)||!/^[-a-z0-9]+$/u.test(chapter.slug))throw new Error('Unsafe article path');
  return readFileSync(join(ROOT,'src/content',lang==='fr'?'posts':'posts-en',`${chapter.slug}.mdx`),'utf8');
}
export async function renderOrdinaryMachinesArticle(source,chapter,offset=0){
  if(!Number.isSafeInteger(offset)||offset<0||offset>66)throw new Error('Invalid ordinary machines scene offset');
  const book=Object.values(ordinaryMachinesEditions).find(b=>b.chapters.includes(chapter));
  if(!book)throw new Error('Unconfigured ordinary machines chapter');
  const {frontmatter:meta,content}=parseFrontmatter(source);
  if(meta.title!==chapter.title||!meta.description||meta.draft||(book.lang==='en'&&meta.sourceArticle!==chapter.sourceSlug))throw new Error('Incomplete or mismatched ordinary machines article');
  const dates=[book.modified,meta.pubDate,meta.updatedDate??meta.pubDate].map(d=>new Date(d).getTime());
  if(!dates.every(Number.isFinite)||dates[0]<Math.max(...dates.slice(1)))throw new Error('Edition predates its source');
  if(book.lang==='en'){
    const fr=parseFrontmatter(readFileSync(join(ROOT,'src/content/posts',`${chapter.sourceSlug}.mdx`),'utf8')).frontmatter;
    if(new Date(meta.sourceUpdatedDate).getTime()!==new Date(fr.updatedDate??fr.pubDate).getTime())throw new Error('English source version drift');
  }
  if(contentTitleViolations(content,new Map(Object.entries(meta))).length)throw new Error('Forbidden ordinary machines article title');
  const [component,figureDirectory,figureMeta,kinds]=ordinaryMachinesFigureSpecs[chapter.number-1];
  const mdast=unified().use(remarkParse).use(remarkGfm).use(remarkMdx).parse(content);const imported=new Set(), allowedImports=new Set([component]);
  for(const n of nodes(mdast)){
    if(n.type==='mdxjsEsm'){
      const statements=n.data?.estree?.body;
      if(!statements?.length)throw new Error('Missing MDX import AST');
      for(const s of statements){const name=s.specifiers?.[0]?.local?.name;if(s.type!=='ImportDeclaration'||s.specifiers.length!==1||s.specifiers[0].type!=='ImportDefaultSpecifier'||!allowedImports.has(name)||imported.has(name)||s.source.value!==`../../components/${name}.astro`)throw new Error('Unapproved MDX import or export');imported.add(name);}
    }else if(['mdxFlowExpression','mdxTextExpression','html','image','imageReference'].includes(n.type))throw new Error('Active or unexpected MDX content');
  }
  if(imported.size!==allowedImports.size)throw new Error('Missing controlled figure import');
  mdast.children=mdast.children.filter(n=>n.type!=='mdxjsEsm');
  const attachments=[],figures=[];
  const handler=(state,n)=>{
    if(n.name===component){
      const p=attributes(n,['kind','lang']),number=figures.length+1;
      if(Object.keys(p).length!==2||p.lang!==book.lang||p.kind!==kinds[number-1])throw new Error('Invalid figure properties');
      const meta=figureMeta(p.lang,p.kind),sceneOffset=offset+attachments.length;
      if(meta.number!==String(number).padStart(2,'0')||!meta.caption||!meta.method||!Array.isArray(meta.sources)||meta.sources.some(r=>referenceId(chapter.number,r)!==r))throw new Error('Invalid figure metadata');
      const original=readFileSync(join(ROOT,'src/figures',figureDirectory,`${p.kind}.${book.lang}.desktop.svg`),'utf8'),mobileOriginal=readFileSync(join(ROOT,'src/figures',figureDirectory,`${p.kind}.${book.lang}.mobile.svg`),'utf8'),svg=bakeOrdinaryMachinesSvg(original,chapter.number),mobileSvg=bakeOrdinaryMachinesSvg(mobileOriginal,chapter.number),name=`file${sceneOffset}.svg`,mobileName=`file${sceneOffset+1}.svg`;
      const desc=nodes(fromHtml(svg,{fragment:true})).find(n=>n.tagName==='desc');if(!desc||!toText(desc).trim())throw new Error('Missing SVG alternative');
      attachments.push({name,svg,original,sourceFile:`src/figures/${figureDirectory}/${p.kind}.${book.lang}.desktop.svg`,chapter:chapter.number,figure:number,kind:p.kind,mobile:false},{name:mobileName,svg:mobileSvg,original:mobileOriginal,sourceFile:`src/figures/${figureDirectory}/${p.kind}.${book.lang}.mobile.svg`,chapter:chapter.number,figure:number,kind:p.kind,mobile:true});
      figures.push({id:`figure-${meta.number}`,caption:meta.caption,method:meta.method,number});
      return element('div',{className:['infographic-block']},[
        element('figure',{id:`figure-${meta.number}`,className:['infographic']},[
          element('img',{src:`../media/${name}`,alt:toText(desc).trim(),className:['infographic-image','infographic-desktop']}),
          element('img',{src:`../media/${mobileName}`,alt:toText(desc).trim(),className:['infographic-image','infographic-mobile']}),
          element('p',{className:['figure-enlarge','infographic-desktop']},[element('a',{href:`../media/${name}`},[text(book.lang==='fr'?'Agrandir la composition complète':'Open the complete composition')])]),
          element('p',{className:['figure-enlarge','infographic-mobile']},[element('a',{href:`../media/${mobileName}`},[text(book.lang==='fr'?'Agrandir la composition complète':'Open the complete composition')])]),
          element('figcaption',{},[element('strong',{},[text(`FIG. ${meta.number}`)]),text(` ${meta.caption} `),...meta.sources.flatMap(id=>[element('a',{href:`#source-${id}`},[text(`[${id}]`)]),text(' ')])]),
        ]),element('section',{className:['figure-method']},[element('p',{className:['reading-box-title']},[text(book.lang==='fr'?'Méthode et périmètre':'Method and scope')]),element('p',{},[text(meta.method)])]),...state.all(n),
      ]);
    }
    if(!Object.hasOwn(passiveJsx,n.name))throw new Error(`Unapproved MDX element: ${n.name}`);
    const p=attributes(n,passiveJsx[n.name]);if(p.target&&p.target!=='_blank')throw new Error('Unexpected link target');if(p.rel&&p.rel!=='noopener noreferrer')throw new Error('Unexpected link rel');delete p.target;delete p.rel;if(p['aria-label']){p.ariaLabel=p['aria-label'];delete p['aria-label'];}if(p.className){if(!/^[a-z][a-z0-9-]*(?: [a-z][a-z0-9-]*)*$/u.test(p.className))throw new Error('Invalid EPUB class');p.className=p.className.split(/\s+/u);}if(p.class){p.className=p.class.split(/\s+/u);delete p.class;}
    let children=state.all(n);if(['p','summary'].includes(n.name)&&children.length===1&&children[0].tagName==='p')children=children[0].children;
    const tag=n.name==='details'?'section':n.name==='summary'?'p':n.name;
    if(n.name==='summary')p.className=['reading-box-title'];
    return element(tag,p,children);
  };
  const tree=await unified().use(remarkRehype,{handlers:{mdxJsxFlowElement:handler,mdxJsxTextElement:handler}}).run(mdast);
  normalizeParagraphs(tree);
  for(const n of nodes(tree))if(['th','td'].includes(n.tagName)&&n.properties.align){const a=n.properties.align;if(!['left','center','right'].includes(a))throw new Error('Invalid table alignment');n.properties.className=[`align-${a}`];delete n.properties.align;}
  assertOrdinaryMachinesPassiveTree(tree);
  if(figures.length!==kinds.length||chapter.figureCount!==kinds.length||offset+attachments.length>66)throw new Error('Figure count drift');
  const notices=nodes(tree).filter(n=>n.tagName==='li'&&/^source-\d{2}$/u.test(n.properties.id??''));if(notices.length!==ordinaryMachinesSourceCounts[chapter.number-1])throw new Error('Source notice count drift');
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
export function prepareOrdinaryMachinesReading(rendered,chapter,routes,glossary){
  for(const n of nodes(rendered.tree)){
    if(n.tagName!=='a'||!n.properties.href)continue;const href=String(n.properties.href);assertOrdinaryMachinesLink(href);
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
  assertOrdinaryMachinesPassiveTree(rendered.tree);return serialize(rendered.tree);
}
export const ordinaryMachinesEpubCss = `${cyberEpubCss}
.infographic{width:100%;max-width:44rem;margin:1.8em auto 2.4em;padding-bottom:1em;overflow:visible}.infographic-desktop{display:block}.infographic-mobile{display:none}.infographic-image{width:100%;height:auto;max-width:100%}.infographic-block{break-inside:auto;page-break-inside:auto}.source-meta{display:block}.sources-list{padding-left:1.3em}.sources-list>li{margin-bottom:1.5em}.sources-list>li>section{margin:.7em 0 0;padding-left:.8em;border-left:2px solid #555c66;font-size:.92em}h1,h2,h3,h4{hyphens:none;overflow-wrap:normal;word-break:normal}@media(max-width:36em){.infographic-desktop{display:none}.infographic-mobile{display:block}}`;
function assertBook(book){
  if(!book||!['fr','en'].includes(book.lang)||book.key!=='ordinary-machines'||book.date!=='2026-11-04'||!/^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}Z$/u.test(book.modified)||!Number.isFinite(new Date(book.modified).getTime())||!/^urn:uuid:[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/u.test(book.id))throw new Error('Invalid ordinary machines edition metadata');
  if(book.directory!==({fr:'la-guerre-des-machines-ordinaires',en:'the-war-on-everyday-machines'})[book.lang]||book.theme!=='dark'||book.chapters.length!==7||book.figureCount!==33||!/^[-a-z0-9]+$/u.test(book.directory)||book.epub!==`/publications/${book.directory}-l0g.epub`||book.cover!==`/publications/${book.directory}-cover.jpg`||book.path!==`${book.lang==='en'?'/en':''}/publications/${book.directory}/`||book.sourceCount!==99)throw new Error('Invalid ordinary machines edition');
  for(const [i,c]of book.chapters.entries())if(c.number!==i+1||c.figureCount!==ordinaryMachinesFigureSpecs[i][3].length||c.chapter!==`ch${String(i+2).padStart(3,'0')}.xhtml`||!c.route.startsWith(book.lang==='fr'?'/posts/':'/en/analysis/'))throw new Error('Invalid ordinary machines chapter configuration');
  for(const title of [book.title,book.subtitle,book.introductionTitle,book.conclusionTitle,book.methodTitle,book.readerGuideTitle,book.glossaryTitle,book.synthesisSourcesTitle,book.colophonTitle,...book.chapters.map(c=>c.title),...book.glossary.map(g=>g.title)])if(typeof title!=='string'||editorialTitleViolation(title))throw new Error(`Forbidden or missing book title: ${title}`);
}
export function ordinaryMachinesChapterDateText(book,meta){
  if(!book||!['fr','en'].includes(book.lang)||book.locale!==({fr:'fr-FR',en:'en-GB'})[book.lang])throw new Error('Invalid chapter date locale');
  const published=meta?.pubDate,updated=meta?.updatedDate??published;
  if(typeof published!=='string'||typeof updated!=='string'||![published,updated].every(d=>Number.isFinite(new Date(d).getTime())))throw new Error('Invalid chapter dates');
  const format=new Intl.DateTimeFormat(book.locale,{day:'numeric',month:'long',year:'numeric',timeZone:'Europe/Paris'});
  const label=(fr,en)=>book.lang==='fr'?fr:en;
  let result=`${label('Publié le','Published')} ${format.format(new Date(published))}`;
  if(new Date(updated).getTime()!==new Date(published).getTime())result+=` · ${label('Mis à jour le','Updated')} ${format.format(new Date(updated))}`;
  return result;
}
export async function generateOrdinaryMachinesEpub(lang='fr'){
  if(!['fr','en'].includes(lang))throw new Error('Unsupported ordinary machines edition language');
  const book=ordinaryMachinesEditions[lang];assertBook(book);const tr=(fr,en)=>lang==='fr'?fr:en;
  // Complete parsing and link resolution before replacing an older generated book.
  let offset=0;const rendered=[];
  for(const chapter of book.chapters){const r=await renderOrdinaryMachinesArticle(ordinaryMachinesArticleSource(chapter,lang),chapter,offset);offset=r.next;rendered.push({...r,chapter});}
  const routes=new Map(rendered.map(r=>[r.chapter.route,r])),glossary=new Map(book.glossary.map(g=>[g.path,g.slug]));
  const bodies=rendered.map(r=>prepareOrdinaryMachinesReading(r,r.chapter,routes,glossary));
  const provenance=[];
  for(const edition of Object.values(ordinaryMachinesEditions))for(const chapter of edition.chapters){const source=ordinaryMachinesArticleSource(chapter,edition.lang),meta=parseFrontmatter(source).frontmatter;provenance.push({lang:edition.lang,chapter,file:`src/content/${edition.lang==='fr'?'posts':'posts-en'}/${chapter.slug}.mdx`,hash:sha(source),date:meta.pubDate,updated:meta.updatedDate??meta.pubDate});}
  if(provenance.length!==14)throw new Error('Source provenance count drift');
  const sourceDir=join(ROOT,'src/epub',book.directory),epubDir=join(sourceDir,'EPUB'),media=join(epubDir,'media'),textDir=join(epubDir,'text');
  // Only the two statically configured generator output directories are removed.
  if(existsSync(sourceDir))rmSync(sourceDir,{recursive:true});
  for(const dir of [media,textDir,join(epubDir,'fonts'),join(epubDir,'styles'),join(sourceDir,'META-INF'),join(ROOT,'public/publications')])mkdirSync(dir,{recursive:true});
  const saveXml=(path,content)=>{const result=XMLValidator.validate(content);if(result!==true)throw new Error(`${relative(ROOT,path)}: invalid XML ${JSON.stringify(result)}`);writeFileSync(path,content);};
  writeFileSync(join(sourceDir,'mimetype'),'application/epub+zip');
  saveXml(join(sourceDir,'META-INF/container.xml'),'<?xml version="1.0" encoding="UTF-8"?><container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles><rootfile full-path="EPUB/content.opf" media-type="application/oebps-package+xml"/></rootfiles></container>');
  const documents=[];
  const writeChapter=(file,title,body,type='bodymatter')=>{
    const tree=fromHtml(body,{fragment:true});assertOrdinaryMachinesPassiveTree(tree);
    for(const h of nodes(tree).filter(n=>/^h[1-6]$/u.test(n.tagName??'')))if(editorialTitleViolation(toText(h)))throw new Error(`Forbidden EPUB heading: ${toText(h)}`);
    let document=xhtmlDocument(book,{title,body,bodyType:type});if(file==='cover.xhtml')document=document.replace('<body ','<body class="cover-page" ');
    saveXml(join(textDir,file),document);documents.push({file,id:file.slice(0,-6)});
  };
  writeFileSync(join(epubDir,'styles/stylesheet1.css'),ordinaryMachinesEpubCss);
  for(const f of ordinaryMachinesFontFiles){copyFileSync(join(ROOT,f.source),join(epubDir,'fonts',f.name));copyFileSync(join(ROOT,'public/fonts/jlr',f.license),join(epubDir,'fonts',f.license));}
  for(const directory of [...new Set(fontDirectoryByChapter)])copyFileSync(join(ROOT,'public/fonts',directory,'LICENSE.txt'),join(epubDir,'fonts',`LICENSE-${directory}.txt`));
  const cover=readFileSync(join(ROOT,'public',book.cover));
  const coverInfo=await sharp(cover).metadata();if(coverInfo.format!=='jpeg'||coverInfo.width<1000||coverInfo.height<1500)throw new Error('Incomplete publication cover');
  writeFileSync(join(media,'cover.jpg'),cover);
  writeChapter('cover.xhtml',tr('Couverture','Cover'),`<img src="../media/cover.jpg" alt="${xml(book.title)}"/>`,'frontmatter cover');
  writeChapter('half_title.xhtml',book.title,`<section class="half-title"><h1>${xml(book.title)}</h1><p>${xml(book.subtitle)}</p><p>l0g</p></section>`,'frontmatter');
  writeChapter('title_page.xhtml',book.title,`<section class="titlepage"><h1>${xml(book.title)}</h1><p class="subtitle">${xml(book.subtitle)}</p><p class="author">l0g</p><p>${xml(new Intl.DateTimeFormat(book.locale,{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(book.date+'T12:00:00Z')))} · ${tr('Édition française','English edition')}</p><p>${tr('Sept analyses intégrales · 33 infographies · Glossaire et sources','Seven complete analyses · 33 infographics · Glossary and sources')}</p><p>Creative Commons Attribution 4.0 International</p></section>`,'frontmatter');
  writeChapter('reader-guide.xhtml',book.readerGuideTitle,`<section id="reader-guide"><h1>${xml(book.readerGuideTitle)}</h1>${paragraphs(book.readerGuide)}</section>`,'frontmatter');
  writeChapter('method.xhtml',book.methodTitle,`<section id="method"><h1>${xml(book.methodTitle)}</h1>${paragraphs(book.method)}</section>`,'frontmatter');
  writeChapter('ch001.xhtml',book.introductionTitle,`<section id="introduction"><p class="chapter-kicker">Introduction</p><h1>${xml(book.introductionTitle)}</h1>${paragraphs(book.introduction)}</section>`);
  const nav=[{title:book.readerGuideTitle,href:'text/reader-guide.xhtml'},{title:book.methodTitle,href:'text/method.xhtml'},{title:book.introductionTitle,href:'text/ch001.xhtml'}],attachments=[];
  for(const [i,r]of rendered.entries()){
    const c=r.chapter;
    if(!/^\/(?:illustrations\/news|images\/og)\/[a-z0-9-]+\.jpg$/u.test(c.image))throw new Error('Unsafe chapter image path');
    copyFileSync(join(ROOT,'public',c.image),join(media,`chapter-${c.number}.jpg`));
    const dateText=ordinaryMachinesChapterDateText(book,r.meta);
    writeChapter(c.chapter,c.title,`<section id="chapter-${c.number}"><p class="chapter-kicker">${tr('Chapitre','Chapter')} ${c.number}</p><h1>${xml(c.title)}</h1><p class="chapter-meta">${xml(dateText)}</p><figure class="chapter-art"><img src="../media/chapter-${c.number}.jpg" alt="${xml(c.imageAlt)}"/><figcaption>${tr('Illustration conceptuelle créée avec une assistance d’intelligence artificielle ; elle ne documente aucun événement réel.','Conceptual illustration created with AI assistance; it does not document an actual event.')}</figcaption></figure>${bodies[i]}</section>`);
    for(const a of r.attachments){saveXml(join(media,a.name),a.svg);attachments.push(a);}
    nav.push({title:c.title,href:`text/${c.chapter}#chapter-${c.number}`,children:r.headings.map(h=>({title:h.title,href:`text/${c.chapter}#${h.id}`}))});
  }
  writeChapter('conclusion.xhtml',book.conclusionTitle,`<section id="conclusion"><h1>${xml(book.conclusionTitle)}</h1>${paragraphs(book.conclusion)}</section>`,'backmatter');nav.push({title:book.conclusionTitle,href:'text/conclusion.xhtml'});
  writeChapter('glossary.xhtml',book.glossaryTitle,`<section id="glossary"><h1>${xml(book.glossaryTitle)}</h1>${book.glossary.map(g=>{if(!/^[-a-z0-9]+$/u.test(g.slug))throw new Error('Invalid glossary slug');return `<section class="glossary-entry" id="glossary-${g.slug}"><h2>${xml(g.title)}</h2><p>${xml(g.definition)}</p><p>${tr('Chapitres','Chapters')}: ${g.chapters.map(n=>{const c=book.chapters[n-1];if(!c)throw new Error('Invalid glossary chapter');return `<a href="${c.chapter}#chapter-${n}">${n}</a>`;}).join(' · ')}</p><ul>${g.sources.map(s=>{assertOrdinaryMachinesLink(s.url);return `<li><a href="${xml(s.url)}">${xml(s.title)}</a>${s.detail?` · ${xml(s.detail)}`:''} · <a href="${book.chapters[s.chapter-1]?.chapter}#c${s.chapter}-source-${referenceId(s.chapter,s.reference)}">${tr('Chapitre','Chapter')} ${s.chapter}, ${tr('source','reference')} ${s.reference}</a></li>`;}).join('')}</ul></section>`;}).join('')}</section>`,'backmatter');nav.push({title:book.glossaryTitle,href:'text/glossary.xhtml'});
  writeChapter('synthesis-sources.xhtml',book.synthesisSourcesTitle,`<section id="synthesis-sources"><h1>${xml(book.synthesisSourcesTitle)}</h1><ol>${book.synthesisSources.map(s=>{assertOrdinaryMachinesLink(s.url);return `<li><a href="${xml(s.url)}">${xml(s.title)}</a><p>${xml(s.detail)}</p><p>${tr('Chapitres','Chapters')}: ${s.chapters.map(n=>`<a href="${book.chapters[n-1].chapter}#chapter-${n}">${n}</a>`).join(' · ')}</p></li>`;}).join('')}</ol></section>`,'backmatter');nav.push({title:book.synthesisSourcesTitle,href:'text/synthesis-sources.xhtml'});
  const figuresTitle=tr('Table des infographies','List of infographics');
  writeChapter('figures.xhtml',figuresTitle,`<section id="figures"><h1>${figuresTitle}</h1><ol>${rendered.flatMap(r=>r.figures.map(f=>`<li><a href="${r.chapter.chapter}#${f.id}">${tr('Chapitre','Chapter')} ${r.chapter.number} · FIG. ${f.number}</a><p>${xml(f.caption)}</p></li>`)).join('')}</ol></section>`,'backmatter');nav.push({title:figuresTitle,href:'text/figures.xhtml'});
  writeChapter('colophon.xhtml',book.colophonTitle,`<section id="colophon"><h1>${xml(book.colophonTitle)}</h1>${paragraphs(book.colophon)}<h2>${tr('Provenance des quatorze articles','Provenance of all fourteen articles')}</h2><p>${tr('Chaque empreinte SHA-256 identifie les octets du fichier MDX repris. Elle permet une comparaison avec ce fichier, sans certifier les faits ni constituer une signature numérique.','Each SHA-256 digest identifies the bytes of the source MDX file. It supports comparison with that file; it neither certifies the reporting nor constitutes a digital signature.')}</p><ol>${provenance.map(p=>`<li><a href="${SITE}${p.chapter.route}">${xml(p.chapter.title)}</a> (${p.lang})<p class="source-id">${xml(p.file)}</p><p class="source-meta">${tr('Publication','Published')}: ${xml(String(p.date))} · ${tr('Mise à jour','Updated')}: ${xml(String(p.updated))}</p><p class="source-id">SHA-256: <code>${p.hash}</code></p></li>`).join('')}</ol><p><a href="${SITE}${book.path}">${tr('Édition et corrections ultérieures','Edition and subsequent corrections')}</a></p></section>`,'backmatter');nav.push({title:book.colophonTitle,href:'text/colophon.xhtml'});
  const licenseTitle=tr('Droits et licences','Rights and licences');
  writeChapter('licenses.xhtml',licenseTitle,`<section id="licenses"><h1>${licenseTitle}</h1><p>l0g · <a href="https://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution 4.0 International</a></p><p>${tr('Les publications et figures l0g sont attribuées à l0g ; les documents cités et les marques restent soumis aux droits de leurs titulaires.','The l0g publications and figures are attributed to l0g; cited documents and trademarks remain subject to their owners’ rights.')}</p><p>${tr('Polices locales Inter Variable et JetBrains Mono Variable, SIL Open Font License 1.1. Les textes de licence complets sont reproduits ci-dessous et inclus avec les fichiers de police.','Local Inter Variable and JetBrains Mono Variable fonts, SIL Open Font License 1.1. Complete licence texts appear below and are included with the font files.')}</p>${ordinaryMachinesFontFiles.map(f=>`<h2>${xml(f.family)}</h2><pre class="license-text">${xml(readFileSync(join(ROOT,'public/fonts/jlr',f.license),'utf8'))}</pre>`).join('')}<p>${tr('Les figures utilisent les sous-ensembles locaux de DejaVu Sans sous les noms l0g Cold Chain, Machine Authority, Remote Maintenance, Sabotage Attribution, Cold Loss, Machine Rules et Machine Resilience. Les licences de chaque répertoire sont conservées intégralement.','The figures use local DejaVu Sans subsets under the names l0g Cold Chain, Machine Authority, Remote Maintenance, Sabotage Attribution, Cold Loss, Machine Rules and Machine Resilience. Complete licences from each source directory are retained.')}</p>${[...new Set(fontDirectoryByChapter)].map(directory=>`<h2>DejaVu Sans · ${directory}</h2><pre class="license-text">${xml(readFileSync(join(ROOT,'public/fonts',directory,'LICENSE.txt'),'utf8'))}</pre>`).join('')}</section>`,'backmatter');nav.push({title:licenseTitle,href:'text/licenses.xhtml'});
  const navList=entries=>`<ol>${entries.map(e=>`<li><a href="${xml(e.href)}">${xml(e.title)}</a>${e.children?navList(e.children):''}</li>`).join('')}</ol>`;
  const contents=tr('Sommaire','Contents');
  saveXml(join(epubDir,'nav.xhtml'),xhtmlDocument(book,{title:contents,bodyType:'frontmatter',body:`<nav epub:type="toc" id="toc"><h1>${contents}</h1>${navList(nav)}</nav><nav epub:type="landmarks"><h2>${tr('Repères','Landmarks')}</h2><ol><li><a epub:type="cover" href="text/cover.xhtml">${tr('Couverture','Cover')}</a></li><li><a epub:type="bodymatter" href="text/ch001.xhtml">Introduction</a></li><li><a epub:type="glossary" href="text/glossary.xhtml">${xml(book.glossaryTitle)}</a></li></ol></nav>`}).replace('../styles/stylesheet1.css','styles/stylesheet1.css'));
  let order=0;const ncx=entries=>entries.map(e=>{const id=++order;return `<navPoint id="nav-${id}" playOrder="${id}"><navLabel><text>${xml(e.title)}</text></navLabel><content src="${xml(e.href)}"/>${e.children?ncx(e.children):''}</navPoint>`;}).join('');
  saveXml(join(epubDir,'toc.ncx'),`<?xml version="1.0" encoding="UTF-8"?><ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1" xml:lang="${lang}"><head><meta name="dtb:uid" content="${book.id}"/><meta name="dtb:depth" content="2"/><meta name="dtb:totalPageCount" content="0"/><meta name="dtb:maxPageNumber" content="0"/></head><docTitle><text>${xml(book.title)}</text></docTitle><navMap>${ncx(nav)}</navMap></ncx>`);
  const payloadProvenance={schemaVersion:1,edition:book.id,lang,date:book.date,modified:book.modified,sourceArticles:provenance.map(p=>({lang:p.lang,chapter:p.chapter.number,file:p.file,canonical:SITE+p.chapter.route,sha256:p.hash,published:String(p.date),updated:String(p.updated)})),figures:attachments.map(a=>({chapter:a.chapter,figure:a.figure,kind:a.kind,mobile:a.mobile,sourceFile:a.sourceFile,sourceSha256:sha(a.original),epubFile:`EPUB/media/${a.name}`,epubSha256:sha(a.svg)})),fonts:[...ordinaryMachinesFontFiles.map(f=>({file:f.source,sha256:sha(readFileSync(join(ROOT,f.source))),license:f.license})),...[...new Set(fontDirectoryByChapter)].flatMap(directory=>ordinaryMachinesSvgFontFiles.map(f=>{const file=`public/fonts/${directory}/${f.name}`;return{file,sha256:sha(readFileSync(join(ROOT,file))),license:`LICENSE-${directory}.txt`};}))],cover:{file:`public${book.cover}`,sha256:sha(cover)},transformation:'Complete source bodies, notices, captions, methods and figure geometry. Disclosure content expanded for offline reading. Semantic dark paints resolved and original local vector fonts embedded. No JavaScript or external media resources.'};
  writeFileSync(join(epubDir,'provenance.json'),JSON.stringify(payloadProvenance,null,2)+'\n');
  const manifest=[['provenance','provenance.json','application/json'],['nav','nav.xhtml','application/xhtml+xml','nav'],['ncx','toc.ncx','application/x-dtbncx+xml'],['css','styles/stylesheet1.css','text/css'],['cover-image','media/cover.jpg','image/jpeg','cover-image'],...documents.map(d=>[d.id,`text/${d.file}`,'application/xhtml+xml']),...book.chapters.map(c=>[`art-${c.number}`,`media/chapter-${c.number}.jpg`,'image/jpeg']),...attachments.map((a,i)=>[`fig-${i}`,`media/${a.name}`,'image/svg+xml']),...ordinaryMachinesFontFiles.flatMap((f,i)=>[[`font-${i}`,`fonts/${f.name}`,'font/woff2'],[`font-license-${i}`,`fonts/${f.license}`,'text/plain']]),...[...new Set(fontDirectoryByChapter)].map(directory=>[`license-${directory}`,`fonts/LICENSE-${directory}.txt`,'text/plain'])];
  const spine=['cover','half_title','title_page','nav','reader-guide','method','ch001',...book.chapters.map(c=>c.chapter.slice(0,-6)),'conclusion','glossary','synthesis-sources','figures','colophon','licenses'];
  saveXml(join(epubDir,'content.opf'),`<?xml version="1.0" encoding="UTF-8"?><package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="book-id" xml:lang="${lang}" prefix="schema: http://schema.org/"><metadata xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:identifier id="book-id">${book.id}</dc:identifier><dc:title>${xml(book.title)}</dc:title><dc:language>${lang}</dc:language><dc:creator>l0g</dc:creator><dc:publisher>l0g.fr</dc:publisher><dc:date>${book.date}</dc:date><dc:description>${xml(book.description)}</dc:description><dc:source>${SITE}${book.path}</dc:source><dc:rights>Creative Commons Attribution 4.0 International</dc:rights><meta property="dcterms:modified">${book.modified}</meta><meta name="cover" content="cover-image"/><meta property="schema:accessMode">textual</meta><meta property="schema:accessMode">visual</meta><meta property="schema:accessibilityFeature">alternativeText</meta><meta property="schema:accessibilityFeature">readingOrder</meta><meta property="schema:accessibilityFeature">structuralNavigation</meta><meta property="schema:accessibilityFeature">tableOfContents</meta><meta property="schema:accessibilityHazard">none</meta><meta property="schema:accessibilitySummary">${tr('Texte redistribuable, navigation structurée, glossaire et sources. Trente-trois infographies originales complètes, avec descriptions alternatives et liens d’agrandissement ; le zoom dépend de la liseuse.','Reflowable text, structured navigation, glossary and sources. Thirty-three complete original infographics with text alternatives and enlargement links; zoom depends on the reading app.')}</meta></metadata><manifest>${manifest.map(([id,href,type,properties])=>`<item id="${id}" href="${href}" media-type="${type}"${properties?` properties="${properties}"`:''}/>`).join('')}</manifest><spine toc="ncx">${spine.map(id=>`<itemref idref="${id}"/>`).join('')}${attachments.map((a,i)=>`<itemref idref="fig-${i}" linear="no"/>`).join('')}</spine></package>`);
  // Refuse stale/unmanifested payloads even when rerunning generation.
  const actual=readdirSync(media).sort(),expected=['cover.jpg',...book.chapters.map(c=>`chapter-${c.number}.jpg`),...attachments.map(a=>a.name)].sort();
  if(JSON.stringify(actual)!==JSON.stringify(expected))throw new Error('Unexpected EPUB media payload');
  console.log(`${book.title}: 7 complete articles, 33 figures in 66 complete SVG scenes, 14 source digests, dark EPUB sources generated.`);
  return {book,sourceDir,provenance,attachments};
}
if(process.argv[1]&&resolve(process.argv[1])===new URL(import.meta.url).pathname){for(const lang of ['fr','en'])await generateOrdinaryMachinesEpub(lang);}
