import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve, relative } from 'node:path';
import { createHash } from 'node:crypto';
import { parseFrontmatter } from '@astrojs/markdown-remark';
import { load as loadYaml, JSON_SCHEMA } from 'js-yaml';
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
import ts from 'typescript';
import { editorialTitleViolation, contentTitleViolations } from './editorial-title-policy.mjs';
import { escapeXml as xml, xhtmlDocument } from './generate-e-invoicing-epub-lib.mjs';
import { aiCreditorsEditions } from '../src/config/ai-creditors-publication.mjs';
import { assertCyberContentModel as assertAiCreditorsContentModel, assertCyberLink as assertAiCreditorsLink, cyberFontFiles as aiCreditorsFontFiles, cyberEpubCss } from './generate-cyber-recovery-epub.mjs';
export { assertAiCreditorsContentModel, assertAiCreditorsLink, aiCreditorsFontFiles };

const ROOT = resolve(new URL('..', import.meta.url).pathname);
const SITE = 'https://l0g.fr';
// JSON_SCHEMA keeps unquoted YAML timestamps as their original strings. The
// default YAML Date constructor would discard the article's written UTC offset.
export function parseAiCreditorsFrontmatter(source){
  const match=/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/u.exec(source);
  if(!match)throw new Error('Missing article frontmatter');
  const frontmatter=loadYaml(match[1],{schema:JSON_SCHEMA});
  if(!frontmatter||typeof frontmatter!=='object'||Array.isArray(frontmatter))throw new Error('Invalid article frontmatter');
  return{frontmatter,content:parseFrontmatter(source).content};
}
export const aiCreditorsSourceCounts = Object.freeze([12,18,11,14,9,23]);
export const aiCreditorsFigureCounts = Object.freeze([2,3,3,3,3,3]);
export const aiCreditorsSourceIds = Object.freeze(aiCreditorsSourceCounts.map(count => Object.freeze(Array.from({length:count},(_,n)=>`S${String(n+1).padStart(2,'0')}`))));
const nodes = n => [n,...(n.children??[]).flatMap(nodes)];
const element = (tagName,properties={},children=[]) => ({type:'element',tagName,properties,children});
const text = value => ({type:'text',value});
const serialize = tree => unified().use(rehypeStringify,{closeSelfClosing:true,characterReferences:{useNamedReferences:false}}).stringify(tree);
const sha = value => createHash('sha256').update(value).digest('hex');
const blockElements = new Set(['article','aside','blockquote','details','div','dl','figure','footer','figcaption','h1','h2','h3','h4','h5','h6','header','hr','li','main','nav','ol','p','pre','section','table','ul']);
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
export function assertAiCreditorsPassiveTree(tree) {
  for(const n of nodes(tree)) {
    if(n.type!=='element')continue;
    if(!htmlTags.has(n.tagName))throw new Error(`Unexpected EPUB element: ${n.tagName}`);
    for(const [key,value]of Object.entries(n.properties??{})) {
      if(!['id','className','href','src','alt','title','colSpan','rowSpan','scope','ariaLabel'].includes(key))throw new Error(`Unexpected EPUB attribute: ${key}`);
      if(key==='href')assertAiCreditorsLink(value);
      if(key==='src'&&!/^\.\.\/media\/(?:file\d+\.svg|chapter-[1-6]\.jpg|cover\.jpg)$/u.test(value))throw new Error('External EPUB resource');
    }
  }
  assertAiCreditorsContentModel(tree);
}

// Read only explicitly named literal data from trusted component source. Nothing
// in Astro frontmatter, MDX imports or expressions is evaluated.
export function aiCreditorsComponentLiteral(source,name) {
  if(typeof source!=='string'||source.length>1_000_000||name!=='copy')throw new Error('Invalid literal request');
  const match=/^---\r?\n([\s\S]*?)\r?\n---/u.exec(source);if(!match)throw new Error('Missing component frontmatter');
  const file=ts.createSourceFile('figure.ts',match[1],ts.ScriptTarget.Latest,true,ts.ScriptKind.TS);
  if(file.parseDiagnostics.length)throw new Error('Invalid component TypeScript');
  const declarations=file.statements.filter(ts.isVariableStatement).flatMap(s=>[...s.declarationList.declarations]).filter(d=>ts.isIdentifier(d.name)&&d.name.text===name);
  if(declarations.length!==1)throw new Error(`Expected one ${name} literal`);
  const read=n=>{
    if(ts.isAsExpression(n)||ts.isParenthesizedExpression(n))return read(n.expression);
    if(ts.isStringLiteral(n)||ts.isNoSubstitutionTemplateLiteral(n))return n.text;
    if(ts.isNumericLiteral(n))return Number(n.text);
    if(ts.isArrayLiteralExpression(n))return n.elements.map(read);
    if(ts.isObjectLiteralExpression(n)){
      const result=Object.create(null);
      for(const p of n.properties){
        if(!ts.isPropertyAssignment(p)||!(ts.isIdentifier(p.name)||ts.isStringLiteral(p.name)))throw new Error('Non-literal component property');
        const key=p.name.text;if(['__proto__','constructor','prototype'].includes(key)||Object.hasOwn(result,key))throw new Error('Duplicate or unsafe component key');
        result[key]=read(p.initializer);
      }
      return result;
    }
    throw new Error('Non-literal component value');
  };
  return read(declarations[0].initializer);
}
// These six approved components have a deliberately small passive projection.
// Hash guards cover their templates as well as the literal caption objects, so a
// later behavioural change cannot silently omit content in the offline edition.
const componentDefinitions = Object.freeze([
  {name:'AiCreditorsOpeningFigure',directory:'ai-creditors-opening',kinds:['sale', 'scope'],pattern:'{lang}-{kind}',sha256:'4048ef85099780c430888e9e06e9e8619f81833ccf783e3976a87363b88d5250'},
  {name:'AiBankExposureFigure',directory:'ai-bank-exposure',kinds:['loan', 'portfolio', 'power'],pattern:'{lang}-{kind}',sha256:'56ac545dcffe89a4eaf7fdf97b38ad27c8e7c4dc065f83c3c7c1b1a044e359be'},
  {name:'AiPrivateCreditFigure',directory:'ai-private-credit',kinds:['holdings', 'map', 'liquidity'],pattern:'{lang}-{kind}',sha256:'9c97b67a5cfb66da2e34d89fee56ee2d68dcaa45a31d473ea60dd37ad3829c75'},
  {name:'AiInsuranceFigure',directory:'ai-insurance',kinds:['lookthrough', 'portfolio', 'guarantee'],pattern:'{lang}-{kind}',sha256:'67b2ff9efeaffbb475f51fa8d71e715f4c722bf3910735c7d5034859b07b2643'},
  {name:'AiCashFlowFigure',directory:'ai-cash',kinds:['surety', 'trap', 'reserves'],pattern:'ai-cash-{kind}-{lang}',sha256:'e4d94e4607345bd84e41dd1d843afac21781c0fe5a15596cb2b0d25836bdbd0f'},
  {name:'AiCreditMapFigure',directory:'ai-credit-map',kinds:['holdings', 'bridge', 'market'],pattern:'ai-map-{kind}-{lang}',sha256:'2f9395749fb1f44d3a85214d2dd970b8cf584fea74495c49d428a17bc495ce8b'},
].map(Object.freeze));
export const aiCreditorsFigureSpecs = Object.freeze(componentDefinitions.map(spec=>{
  const source=readFileSync(join(ROOT,'src/components',spec.name+'.astro'),'utf8');
  if(sha(source)!==spec.sha256)throw new Error(`Approved figure component changed: ${spec.name}`);
  const copy=aiCreditorsComponentLiteral(source,'copy');
  const art=Object.fromEntries(['fr','en'].map(lang=>[lang,Object.fromEntries(spec.kinds.map(kind=>{
    const prefix=spec.pattern.replace('{lang}',lang).replace('{kind}',kind);
    const read=variant=>readFileSync(join(ROOT,'src/figures',spec.directory,prefix+variant+'.svg'),'utf8');
    return[kind,{desktop:read(''),mobile:read('-mobile')}];
  }))]));
  return Object.freeze({...spec,path:`../../components/${spec.name}.astro`,source,copy,art});
}));
export const aiCreditorsSvgFontFiles = Object.freeze([
  Object.freeze({name:'inter.woff2',source:'node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2',format:'woff2'}),
]);
const fontFamilies = new Set(['Inter Variable, Inter, sans-serif']);
export const aiCreditorsPalette = Object.freeze({ink:'#0c0d10',surface:'#121419','surface-2':'#171a20',line:'rgba(255, 255, 255, 0.10)','line-strong':'rgba(255, 255, 255, 0.20)',paper:'#e7e9ee',bright:'#f5f6f8',muted:'#8b909b',signal:'#5eead4',accent:'#ff4d87',amber:'#f5b13d','topic-blue':'#7aa2f7'});
const svgTags = new Set(['svg','title','desc','rect','text','path','circle','g','defs','marker','line']);
const svgProps = new Set('xmlns viewBox role ariaLabelledBy focusable style id width height rx fill x y fontSize textAnchor d stroke strokeWidth strokeLineCap strokeLineJoin strokeDashArray cx cy r transform refX refY markerWidth markerHeight orient strokeOpacity fontFamily fontWeight markerEnd opacity xmlLang dataKind dataVariant dataLabelRegion dataPanel x1 y1 x2 y2 dataRelationship dataFrom dataTo dataStatus dataZone dataShare dataPeriod dataSequence dataEvent dataSource dataRole dataCondition dataGate dataDate dataCount dataDenominator dataCategory dataMetric dataValue dataUnit dataDecision dataEscalation dataCrosssection dataFlow dataBranch dataRate fillOpacity dataIcon className'.split(' '));
export function bakeAiCreditorsSvg(source) {
  if(typeof source!=='string'||source.length>500_000||XMLValidator.validate(source)!==true||/<!DOCTYPE|<!ENTITY/iu.test(source))throw new Error('Invalid AiCreditors SVG');
  const tree=fromHtml(source,{fragment:true}),all=nodes(tree),root=tree.children.find(n=>n.tagName==='svg');
  if(tree.children.filter(n=>n.type!=='text'||n.value.trim()).length!==1||!root||root.properties.xmlns!=='http://www.w3.org/2000/svg')throw new Error('Invalid SVG root');
  const ids=new Set(),families=new Set();
  for(const n of all)if(n.properties?.id){const id=n.properties.id;if(typeof id!=='string'||! /^[A-Za-z_][\w.-]*$/u.test(id)||ids.has(id))throw new Error('Duplicate or invalid SVG ID');ids.add(id);}
  for(const n of all.filter(n=>n.type==='element'))for(const [key,value]of Object.entries(n.properties??{})){
    if(!svgTags.has(n.tagName))throw new Error(`Active or unexpected SVG element: ${n.tagName}`);
    if(!svgProps.has(key)||/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]|javascript:|@import/iu.test(String(value)))throw new Error(`Unexpected SVG attribute: ${key}`);
    if(key==='style'){
      if(n!==root||value!=='width:100%;height:auto')throw new Error('Unexpected SVG style');
      delete n.properties.style;
    }else if(['fill','stroke','markerEnd'].includes(key)){
      const local=/^url\(#([A-Za-z_][\w.-]*)\)$/u.exec(value),paint=/^var\(--color-([a-z0-9-]+)(?:,\s*(#[a-f0-9]{6}))?\)$/iu.exec(value);
      if(local){if(!ids.has(local[1]))throw new Error('Unresolved SVG paint');}
      else if(value==='none'&&key!=='markerEnd'){}
      else if(paint&&key!=='markerEnd'&&Object.hasOwn(aiCreditorsPalette,paint[1]))n.properties[key]=aiCreditorsPalette[paint[1]];
      else throw new Error('Unknown SVG paint');
    }else if(key==='fontFamily'){
      if(!fontFamilies.has(value))throw new Error('Unknown AiCreditors SVG font');families.add(value);n.properties.fontFamily='Inter Variable';
    }else if(key==='ariaLabelledBy'){
      const refs=Array.isArray(value)?value:String(value).split(/\s+/u);if(!refs.length||refs.some(id=>!ids.has(id)))throw new Error('Unresolved SVG accessible name');
    }
  }
  if(all.some(n=>n.type==='element'&&!svgTags.has(n.tagName)))throw new Error('Unexpected SVG element');
  const box=String(root.properties.viewBox).split(/\s+/u).map(Number);
  if(box.length!==4||box.some(n=>!Number.isFinite(n))||box[0]!==0||box[1]!==0||box[2]<300||box[2]>1000||box[3]<200||box[3]>1000)throw new Error('Unexpected AiCreditors SVG viewBox');
  if(!all.some(n=>n.tagName==='title'&&toText(n).trim())||!all.some(n=>n.tagName==='desc'&&toText(n).trim()))throw new Error('Missing SVG text alternative');
  const fontCss=[...families].map(()=>{
    const font=aiCreditorsSvgFontFiles[0];
    return `@font-face{font-family:"Inter Variable";font-style:normal;font-weight:100 900;src:url(data:font/woff2;base64,${readFileSync(join(ROOT,font.source)).toString('base64')}) format("woff2");}`;
  }).join('\n');
  // A standalone SVG opens independently of the chapter's image CSS. Supply
  // the same dark paper so light reader themes retain the source contrast.
  root.children.unshift(element('defs',{},[element('style',{type:'text/css'},[text(fontCss)])]),element('rect',{className:['epub-figure-background'],x:0,y:0,width:box[2],height:box[3],fill:aiCreditorsPalette.ink}));
  const result=serialize(tree);if(XMLValidator.validate(result)!==true)throw new Error('Invalid baked SVG XML');return result;
}
const passiveJsx=Object.freeze({p:['class','className'],details:['id'],summary:[],a:['id','href','aria-label','target','rel'],ol:['class','className','role'],ul:['class','className'],li:['id'],strong:[],em:[],sup:['className'],sub:[],span:['class','className','aria-hidden'],div:['class'],figure:['class'],figcaption:[],br:[]});
function attributes(node,allowed){
  const result=Object.create(null);
  for(const a of node.attributes){
    if(a.type!=='mdxJsxAttribute'||!allowed.includes(a.name)||Object.hasOwn(result,a.name))throw new Error(`Non-literal or unexpected MDX attribute: ${node.name}/${a.name??a.type}`);
    if(typeof a.value==='string')result[a.name]=a.value;
    else if(a.name==='number'&&a.value?.type==='mdxJsxAttributeValueExpression'){
      const body=a.value.data?.estree?.body;
      if(body?.length!==1||body[0].type!=='ExpressionStatement'||body[0].expression.type!=='Literal'||!Number.isSafeInteger(body[0].expression.value))throw new Error('Non-literal figure number');
      result.number=body[0].expression.value;
    }else throw new Error(`Non-literal MDX attribute: ${a.name}`);
  }
  return result;
}
export function aiCreditorsArticleSource(chapter,lang){
  const book=aiCreditorsEditions[lang];if(!book||!book.chapters.includes(chapter)||!/^src\/content\/(?:posts|posts-en)\/[-a-z0-9]+\.mdx?$/u.test(chapter.file))throw new Error('Unsafe or unconfigured article path');
  return readFileSync(join(ROOT,chapter.file),'utf8');
}
export function aiCreditorsReferenceId(chapter,reference){
  if(!Number.isInteger(chapter)||!aiCreditorsSourceIds[chapter-1]?.includes(reference))throw new Error(`Invalid source reference: ${chapter}/${reference}`);return reference;
}
export async function renderAiCreditorsArticle(source,chapter,offset=0){
  if(!Number.isSafeInteger(offset)||offset<0||offset>34)throw new Error('Invalid AI creditors scene offset');
  const book=Object.values(aiCreditorsEditions).find(b=>b.chapters.includes(chapter));if(!book)throw new Error('Unconfigured AI creditors chapter');
  const {frontmatter:meta,content}=parseAiCreditorsFrontmatter(source);
  if(meta.title!==chapter.title||!meta.description||meta.draft||(book.lang==='en'&&meta.sourceArticle!==chapter.sourceSlug))throw new Error('Incomplete or mismatched AI creditors article');
  const dates=[book.modified,meta.pubDate,meta.updatedDate??meta.pubDate].map(d=>new Date(d).getTime());if(!dates.every(Number.isFinite)||dates[0]<Math.max(...dates.slice(1)))throw new Error('Edition predates its source');
  if(book.lang==='en'){
    const frChapter=aiCreditorsEditions.fr.chapters[chapter.number-1],fr=parseAiCreditorsFrontmatter(aiCreditorsArticleSource(frChapter,'fr')).frontmatter;
    if(new Date(meta.sourceUpdatedDate).getTime()!==new Date(fr.updatedDate??fr.pubDate).getTime())throw new Error('English source version drift');
  }
  if(contentTitleViolations(content,new Map(Object.entries(meta))).length)throw new Error('Forbidden AI creditors article title');
  const mdast=unified().use(remarkParse).use(remarkGfm).use(remarkMdx).parse(content),spec=aiCreditorsFigureSpecs[chapter.number-1],imported=new Set();
  for(const n of nodes(mdast)){
    if(n.type==='mdxjsEsm'){
      const statements=n.data?.estree?.body;if(!statements?.length)throw new Error('Missing MDX import AST');
      for(const s of statements){const name=s.specifiers?.[0]?.local?.name;if(s.type!=='ImportDeclaration'||s.specifiers.length!==1||s.specifiers[0].type!=='ImportDefaultSpecifier'||spec.name!==name||imported.has(name)||s.source.value!==spec.path)throw new Error('Unapproved MDX import or export');imported.add(name);}
    }else if(['mdxFlowExpression','mdxTextExpression','html','image','imageReference'].includes(n.type))throw new Error('Active or unexpected MDX content');
  }
  if(imported.size!==1)throw new Error('Missing controlled figure import');mdast.children=mdast.children.filter(n=>n.type!=='mdxjsEsm');
  const attachments=[],figures=[];
  const scene=(original,figure,kind,mobile)=>{
    const name=`file${offset+attachments.length}.svg`,svg=bakeAiCreditorsSvg(original),desc=nodes(fromHtml(original,{fragment:true})).find(n=>n.tagName==='desc');
    attachments.push({name,svg,original,chapter:chapter.number,figure,kind,mobile});
    return element('a',{href:`../media/${name}`,ariaLabel:book.lang==='fr'?'Ouvrir cette infographie en grand':'Open this infographic at full size',className:[mobile?'infographic-mobile':'infographic-desktop']},[element('img',{src:`../media/${name}`,alt:toText(desc).trim(),className:['infographic-image']})]);
  };
  const handler=(state,n)=>{
    if(n.name===spec.name){
      const allowed=['kind','lang','number','sourceHref','caption',...(chapter.number>=4?['id']:[]),...(chapter.number===6?['sourceLabel','credit']:[])];
      const p=attributes(n,allowed),number=figures.length+1,kind=p.kind;
      if(p.lang!==book.lang||p.number!==number||kind!==spec.kinds[number-1]||p.sourceHref!==`#source-${aiCreditorsReferenceId(chapter.number,p.sourceHref?.replace('#source-',''))}`)throw new Error('Unexpected figure properties, reference or order');
      const copy=spec.copy[book.lang]?.[kind],a=spec.art[book.lang]?.[kind];
      if(!copy||!a?.desktop||!a.mobile||['caption','source','credit'].some(key=>typeof copy[key]!=='string'||!copy[key].trim()))throw new Error('Missing figure copy or scene');
      const id=p.id??`figure-${number}`;if(!/^[A-Za-z][A-Za-z0-9_-]*$/u.test(id))throw new Error('Invalid figure ID');
      const caption=p.caption??copy.caption,credit=p.credit??copy.credit,sourceLabel=p.sourceLabel??copy.source;
      const description=toText(nodes(fromHtml(a.desktop,{fragment:true})).find(node=>node.tagName==='desc')).trim(),descriptionId=`description-c${chapter.number}-f${number}`;
      const extra=chapter.number===6&&kind==='holdings'?['S01','S03','S04','S05','S06','S07','S08']:[];
      const sourceText=book.lang==='fr'?'Source : ':'Source: ';
      const children=[scene(a.desktop,number,kind,false),scene(a.mobile,number,kind,true),element('figcaption',{},[
        element('span',{className:['figure-number']},[text(`FIG. ${String(number).padStart(2,'0')}`)]),text(caption),
        element('span',{className:['figure-source']},[text(sourceText),element('a',{href:p.sourceHref},[text(sourceLabel)]),text('.'),...extra.flatMap(ref=>[text(' · '),element('a',{href:`#source-${aiCreditorsReferenceId(chapter.number,ref)}`},[text(ref)])])]),
        element('span',{className:['figure-credit']},[text(credit)]),
        element('a',{className:['figure-alt-link'],href:`figures.xhtml#${descriptionId}`},[text(book.lang==='fr'?'Description textuelle':'Text description')]),
      ])];
      figures.push({id,number:String(number).padStart(2,'0'),caption,description,descriptionId});
      return element('div',{className:['infographic-block']},[element('figure',{id,className:['infographic']},children),...state.all(n)]);
    }
    if(!Object.hasOwn(passiveJsx,n.name))throw new Error(`Unapproved MDX element: ${n.name}`);
    const p=attributes(n,passiveJsx[n.name]);if(p.target&&p.target!=='_blank')throw new Error('Unexpected link target');if(p.rel&&p.rel!=='noopener noreferrer')throw new Error('Unexpected link rel');delete p.target;delete p.rel;
    if(p['aria-hidden']&&p['aria-hidden']!=='true')throw new Error('Unexpected hidden attribute');delete p['aria-hidden'];
    if(p.role&&p.role!=='list')throw new Error('Unexpected role');delete p.role;
    if(p['aria-label']){p.ariaLabel=p['aria-label'];delete p['aria-label'];}
    if(p.className||p.class){const value=p.className??p.class;if(!/^[a-z][a-z0-9-]*(?: [a-z][a-z0-9-]*)*$/u.test(value))throw new Error('Invalid EPUB class');p.className=value.split(/\s+/u);delete p.class;}
    let children=state.all(n);if(['p','summary'].includes(n.name)&&children.length===1&&children[0].tagName==='p')children=children[0].children;
    const tag=n.name==='details'?'section':n.name==='summary'?'p':n.name;if(n.name==='summary')p.className=['reading-box-title'];
    return element(tag,p,children);
  };
  const tree=await unified().use(remarkRehype,{handlers:{mdxJsxFlowElement:handler,mdxJsxTextElement:handler}}).run(mdast);normalizeParagraphs(tree);
  for(const n of nodes(tree))if(['th','td'].includes(n.tagName)&&n.properties.align){if(!['left','center','right'].includes(n.properties.align))throw new Error('Invalid table alignment');n.properties.className=[`align-${n.properties.align}`];delete n.properties.align;}
  assertAiCreditorsPassiveTree(tree);
  if(figures.length!==aiCreditorsFigureCounts[chapter.number-1]||chapter.figureCount!==figures.length||offset+attachments.length>34)throw new Error('Figure count drift');
  const notices=nodes(tree).filter(n=>n.tagName==='li'&&/^source-/u.test(n.properties.id??''));if(JSON.stringify(notices.map(n=>n.properties.id))!==JSON.stringify(aiCreditorsSourceIds[chapter.number-1].map(id=>'source-'+id)))throw new Error('Source notice count or order drift');
  const ids=new Map(),slugger=new GithubSlugger(),headings=[];
  for(const n of nodes(tree)){
    if(/^h[2-6]$/u.test(n.tagName??'')){n.properties.id??=slugger.slug(toText(n));if(n.tagName==='h2')headings.push({title:toText(n),id:`c${chapter.number}-${n.properties.id}`});}
    if(n.properties?.id){const old=String(n.properties.id);if(ids.has(old)||!/^[-\p{L}\p{N}_]+$/u.test(old))throw new Error('Duplicate or unsafe chapter ID');ids.set(old,`c${chapter.number}-${old}`);n.properties.id=ids.get(old);}
  }
  for(const f of figures)f.id=ids.get(f.id);
  return{tree,html:serialize(tree),ids,headings,figures,attachments,meta,sourceHash:sha(source),next:offset+attachments.length};
}
export function prepareAiCreditorsReading(rendered,chapter,routes,glossary){
  for(const n of nodes(rendered.tree)){
    if(n.tagName!=='a')continue;const href=String(n.properties.href);assertAiCreditorsLink(href);if(href.startsWith('../media/'))continue;
    if(n.properties.className?.includes('figure-alt-link')){if(!rendered.figures.some(f=>href===`figures.xhtml#${f.descriptionId}`))throw new Error('Unknown figure text alternative');continue;}
    const u=new URL(href,SITE+chapter.route);
    if(href.startsWith('#')){const id=rendered.ids.get(decodeURIComponent(u.hash.slice(1)));if(!id)throw new Error(`Unresolved chapter fragment: ${href}`);n.properties.href=`#${id}`;}
    else if(u.origin===SITE&&routes.has(u.pathname)){const target=routes.get(u.pathname),id=u.hash?target.ids.get(decodeURIComponent(u.hash.slice(1))):`chapter-${target.chapter.number}`;if(!id)throw new Error(`Unresolved cross-chapter fragment: ${href}`);n.properties.href=`${target.chapter.chapter}#${id}`;}
    else if(u.origin===SITE&&/^\/(?:en\/glossary|glossaire)\//u.test(u.pathname)){if(u.hash||!glossary.has(u.pathname))throw new Error(`Unmapped offline glossary term: ${href}`);n.properties.href=`glossary.xhtml#glossary-${glossary.get(u.pathname)}`;}
    else if(!/^[a-z][a-z0-9+.-]*:/iu.test(href))n.properties.href=u.href;
  }
  assertAiCreditorsPassiveTree(rendered.tree);return serialize(rendered.tree);
}
export const aiCreditorsEpubCss = `${cyberEpubCss}
.infographic{width:100%;max-width:44rem;margin:1.6em auto 2.1em;padding-bottom:.8em;overflow:visible}.infographic-desktop{display:block}.infographic-mobile{display:none}.infographic-image{display:block;width:100%;height:auto;max-width:100%;margin:.4em auto}.infographic-block{break-inside:auto;page-break-inside:auto}.infographic figcaption strong{display:block;font-weight:400;color:#e7e9ee;margin:.2em 0}.figure-number{display:block;color:#5eead4;font-size:.75em;letter-spacing:.1em;margin-bottom:.3em}.figure-phase{margin:1em 0 .5em;font-size:.9em;color:#5eead4}.figure-method{font-size:.82em;line-height:1.5;color:#a8afbd}.source-meta{display:block}.figure-source,.figure-credit{display:block;margin-top:.35em}.sources-list{padding-left:1.3em}.sources-list>li{margin-bottom:1.25em}.sources-list section{font-size:.85em;line-height:1.55}.source-id{overflow-wrap:anywhere}.chapter-meta{font-size:.75em;line-height:1.6}h1,h2,h3,h4{hyphens:none;overflow-wrap:normal;word-break:normal}@media(max-width:36em){.infographic-desktop{display:none}.infographic-mobile{display:block}.infographic-image{max-width:25rem}}`;
function bookCopy(book,value){
  if(typeof value!=='string')throw new Error('Invalid book paragraph');
  return xml(value).replace(/\[(B\d{2})\]/gu,(_,id)=>{
    if(!book.synthesisSources.some(s=>s.id===id))throw new Error(`Unresolved book citation: ${id}`);
    return `<a class="book-citation" href="synthesis-sources.xhtml#book-source-${id}">[${id}]</a>`;
  });
}
const bookParagraphs=(book,values)=>values.map(v=>`<p>${bookCopy(book,v)}</p>`).join('\n');
function assertBook(book){
  if(!book||!['fr','en'].includes(book.lang)||book.key!=='ai-creditors'||book.date!=='2026-11-18'||!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/u.test(book.modified)||!Number.isFinite(new Date(book.modified).getTime())||!/^urn:uuid:[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/u.test(book.id))throw new Error('Invalid AiCreditors edition metadata');
  if(book.directory!==({fr:'les-creanciers-de-l-ia',en:'ai-creditors'})[book.lang]||book.theme!=='dark'||book.chapters.length!==6||book.figureCount!==17||book.sceneCount!==34||book.sourceCount!==87||book.epub!==`/publications/${book.directory}-l0g.epub`||book.cover!==`/publications/${book.directory}-cover.jpg`||book.path!==`${book.lang==='en'?'/en':''}/publications/${book.directory}/`)throw new Error('Invalid AiCreditors edition');
  for(const [i,c]of book.chapters.entries())if(c.number!==i+1||c.figureCount!==aiCreditorsFigureCounts[i]||c.chapter!==`ch${String(i+2).padStart(3,'0')}.xhtml`||c.route!==`${book.lang==='fr'?'/posts/':'/en/analysis/'}${c.slug}/`||!/^[a-f0-9]{64}$/u.test(c.sha256))throw new Error('Invalid AiCreditors chapter configuration');
  for(const key of ['introduction','conclusion','method','readerGuide','colophon'])if(!Array.isArray(book[key])||!book[key].length||book[key].some(s=>typeof s!=='string'||!s.trim()))throw new Error(`Missing book prose: ${key}`);
  for(const title of [book.title,book.subtitle,book.introductionTitle,book.conclusionTitle,book.methodTitle,book.readerGuideTitle,book.glossaryTitle,book.synthesisSourcesTitle,book.colophonTitle,...book.chapters.map(c=>c.title),...book.glossary.map(g=>g.title)])if(typeof title!=='string'||editorialTitleViolation(title))throw new Error(`Forbidden or missing book title: ${title}`);
  const ids=new Set();for(const source of book.synthesisSources){if(!/^B\d{2}$/u.test(source.id)||ids.has(source.id)||!source.title||!(source.scope??source.detail))throw new Error('Invalid book source');ids.add(source.id);assertAiCreditorsLink(source.url);}
  for(const key of ['introduction','conclusion','method','readerGuide','colophon'])for(const paragraph of book[key])bookCopy(book,paragraph);
  if(!Array.isArray(book.glossary)||book.glossary.length!==16||new Set(book.glossary.map(g=>g.slug)).size!==book.glossary.length||new Set(book.glossary.map(g=>g.path)).size!==book.glossary.length)throw new Error('Invalid offline glossary corpus');
  for(const g of book.glossary){if(!/^[-a-z0-9]+$/u.test(g.slug)||!g.definition||!Array.isArray(g.sources)||!g.sources.length)throw new Error('Invalid glossary definition');bookCopy(book,g.definition);for(const s of g.sources){aiCreditorsReferenceId(s.chapter,s.reference);assertAiCreditorsLink(s.url);}}
}
export function aiCreditorsChapterDateText(book,meta){
  if(!book||!['fr','en'].includes(book.lang)||typeof meta.pubDate!=='string'||!Number.isFinite(new Date(meta.pubDate).getTime()))throw new Error('Invalid chapter dates');
  const label=(fr,en)=>book.lang==='fr'?fr:en;
  // Preserve the source's precision, including the date-only first installment.
  let result=`${label('Publication','Published')}: ${meta.pubDate}`;
  if(meta.updatedDate&&meta.updatedDate!==meta.pubDate)result+=` · ${label('Révision rédactionnelle','Editorial revision')}: ${meta.updatedDate}`;
  return result;
}
export async function generateAiCreditorsEpub(lang='fr'){
  if(!['fr','en'].includes(lang))throw new Error('Unsupported AiCreditors edition language');
  const book=aiCreditorsEditions[lang];assertBook(book);const tr=(fr,en)=>lang==='fr'?fr:en;
  let offset=0;const rendered=[];
  for(const chapter of book.chapters){const source=aiCreditorsArticleSource(chapter,lang);if(sha(source)!==chapter.sha256)throw new Error(`Approved source bytes changed: ${chapter.file}`);const r=await renderAiCreditorsArticle(source,chapter,offset);offset=r.next;rendered.push({...r,chapter});}
  if(offset!==book.sceneCount)throw new Error('Book scene count drift');
  const routes=new Map(rendered.map(r=>[r.chapter.route,r])),glossary=new Map(book.glossary.filter(g=>g.path).map(g=>[g.path,g.slug]));
  const bodies=rendered.map(r=>prepareAiCreditorsReading(r,r.chapter,routes,glossary));
  const checkCitation=s=>{
    aiCreditorsReferenceId(s.chapter,s.reference);const target=rendered[s.chapter-1],notice=nodes(target.tree).find(n=>n.tagName==='li'&&n.properties.id===`c${s.chapter}-source-${s.reference}`);
    if(!notice||!nodes(notice).some(n=>n.tagName==='a'&&n.properties.href===s.url))throw new Error(`Citation does not match chapter notice: ${s.chapter}/${s.reference}`);
  };
  for(const g of book.glossary)for(const source of g.sources)checkCitation(source);
  for(const source of book.synthesisSources){
    for(const ref of source.references??[])checkCitation({...ref,url:source.url});
    if(source.chapters?.length&&!source.chapters.some(n=>rendered[n-1]&&(source.url===SITE+rendered[n-1].chapter.route||nodes(rendered[n-1].tree).some(node=>node.tagName==='a'&&node.properties.href===source.url))))throw new Error(`Untraceable synthesis source: ${source.id}`);
  }
  const provenance=[];
  for(const edition of Object.values(aiCreditorsEditions))for(const chapter of edition.chapters){const source=aiCreditorsArticleSource(chapter,edition.lang),meta=parseAiCreditorsFrontmatter(source).frontmatter;if(sha(source)!==chapter.sha256)throw new Error('Source provenance drift');provenance.push({lang:edition.lang,chapter,file:chapter.file,hash:sha(source),date:meta.pubDate,updated:meta.updatedDate??meta.pubDate});}
  if(provenance.length!==12)throw new Error('Source provenance count drift');
  const sourceDir=join(ROOT,'src/epub',book.directory),epubDir=join(sourceDir,'EPUB'),media=join(epubDir,'media'),textDir=join(epubDir,'text');
  const cover=readFileSync(join(ROOT,'public',book.cover)),coverInfo=await sharp(cover).metadata();
  if(coverInfo.format!=='jpeg'||coverInfo.width!==book.coverWidth||coverInfo.height!==book.coverHeight)throw new Error('Incomplete publication cover');
  // All source conversion, citation resolution and metadata checks finish before
  // the two fixed generated directories are replaced.
  if(existsSync(sourceDir))rmSync(sourceDir,{recursive:true});
  for(const dir of [media,textDir,join(epubDir,'fonts'),join(epubDir,'styles'),join(sourceDir,'META-INF'),join(ROOT,'public/publications')])mkdirSync(dir,{recursive:true});
  const saveXml=(path,content)=>{const result=XMLValidator.validate(content);if(result!==true)throw new Error(`${relative(ROOT,path)}: invalid XML ${JSON.stringify(result)}`);writeFileSync(path,content);};
  writeFileSync(join(sourceDir,'mimetype'),'application/epub+zip');
  saveXml(join(sourceDir,'META-INF/container.xml'),'<?xml version="1.0" encoding="UTF-8"?><container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles><rootfile full-path="EPUB/content.opf" media-type="application/oebps-package+xml"/></rootfiles></container>');
  const documents=[];
  const writeChapter=(file,title,body,type='bodymatter')=>{
    const tree=fromHtml(body,{fragment:true});assertAiCreditorsPassiveTree(tree);
    for(const h of nodes(tree).filter(n=>/^h[1-6]$/u.test(n.tagName??'')))if(editorialTitleViolation(toText(h)))throw new Error(`Forbidden EPUB heading: ${toText(h)}`);
    let document=xhtmlDocument(book,{title,body,bodyType:type});if(file==='cover.xhtml')document=document.replace('<body ','<body class="cover-page" ');
    saveXml(join(textDir,file),document);documents.push({file,id:file.slice(0,-6)});
  };
  writeFileSync(join(epubDir,'styles/stylesheet1.css'),aiCreditorsEpubCss);
  for(const f of aiCreditorsFontFiles){copyFileSync(join(ROOT,f.source),join(epubDir,'fonts',f.name));copyFileSync(join(ROOT,'public/fonts/jlr',f.license),join(epubDir,'fonts',f.license));}
  writeFileSync(join(media,'cover.jpg'),cover);
  writeChapter('cover.xhtml',tr('Couverture','Cover'),`<img src="../media/cover.jpg" alt="${xml(book.title)}"/>`,'frontmatter cover');
  writeChapter('half_title.xhtml',book.title,`<section class="half-title"><h1>${xml(book.title)}</h1><p>${xml(book.subtitle)}</p><p>l0g</p></section>`,'frontmatter');
  writeChapter('title_page.xhtml',book.title,`<section class="titlepage"><h1>${xml(book.title)}</h1><p class="subtitle">${xml(book.subtitle)}</p><p class="author">l0g</p><p>${tr('Édition française du 18 novembre 2026','English edition, 18 November 2026')}</p><p>${tr('Six enquêtes intégrales · 17 infographies · Glossaire et sources','Six complete investigations · 17 infographics · Glossary and sources')}</p><p>Creative Commons Attribution 4.0 International</p></section>`,'frontmatter');
  writeChapter('reader-guide.xhtml',book.readerGuideTitle,`<section id="reader-guide"><h1>${xml(book.readerGuideTitle)}</h1>${bookParagraphs(book,book.readerGuide)}</section>`,'frontmatter');
  writeChapter('method.xhtml',book.methodTitle,`<section id="method"><h1>${xml(book.methodTitle)}</h1>${bookParagraphs(book,book.method)}</section>`,'frontmatter');
  writeChapter('ch001.xhtml',book.introductionTitle,`<section id="introduction"><p class="chapter-kicker">Introduction</p><h1>${xml(book.introductionTitle)}</h1>${bookParagraphs(book,book.introduction)}</section>`);
  const nav=[{title:book.readerGuideTitle,href:'text/reader-guide.xhtml'},{title:book.methodTitle,href:'text/method.xhtml'},{title:book.introductionTitle,href:'text/ch001.xhtml'}],attachments=[];
  for(const [i,r]of rendered.entries()){
    const c=r.chapter,dateText=aiCreditorsChapterDateText(book,r.meta);
    writeChapter(c.chapter,c.title,`<section id="chapter-${c.number}"><p class="chapter-kicker">${tr('Chapitre','Chapter')} ${c.number}</p><h1>${xml(c.title)}</h1><p class="chapter-meta">${xml(dateText)}</p><p class="chapter-original"><a href="${SITE}${c.route}">${tr('Édition originale en ligne','Original online edition')}</a></p>${bodies[i]}</section>`);
    for(const a of r.attachments){saveXml(join(media,a.name),a.svg);attachments.push(a);}
    nav.push({title:c.title,href:`text/${c.chapter}#chapter-${c.number}`,children:r.headings.map(h=>({title:h.title,href:`text/${c.chapter}#${h.id}`}))});
  }
  writeChapter('conclusion.xhtml',book.conclusionTitle,`<section id="conclusion"><h1>${xml(book.conclusionTitle)}</h1>${bookParagraphs(book,book.conclusion)}</section>`,'backmatter');nav.push({title:book.conclusionTitle,href:'text/conclusion.xhtml'});
  const citationLink=s=>`<a href="${book.chapters[s.chapter-1].chapter}#c${s.chapter}-source-${aiCreditorsReferenceId(s.chapter,s.reference)}">${tr('Chapitre','Chapter')} ${s.chapter}, ${tr('source','reference')} ${xml(s.reference)}</a>`;
  writeChapter('glossary.xhtml',book.glossaryTitle,`<section id="glossary"><h1>${xml(book.glossaryTitle)}</h1>${book.glossary.map(g=>`<section class="glossary-entry" id="glossary-${g.slug}"><h2>${xml(g.title)}</h2><p>${bookCopy(book,g.definition)}</p><ul>${g.sources.map(s=>`<li>${citationLink(s)}${s.title?` · <a href="${xml(s.url)}">${xml(s.title)}</a>`:''}${s.detail?` · ${xml(s.detail)}`:''}</li>`).join('')}</ul></section>`).join('')}</section>`,'backmatter');nav.push({title:book.glossaryTitle,href:'text/glossary.xhtml'});
  writeChapter('synthesis-sources.xhtml',book.synthesisSourcesTitle,`<section id="synthesis-sources"><h1>${xml(book.synthesisSourcesTitle)}</h1><ol class="sources-list">${book.synthesisSources.map(s=>`<li id="book-source-${s.id}"><span class="source-meta">${xml(s.id)}${s.publication?` · ${tr('Publication','Published')}: ${xml(s.publication)}`:''}${s.consultation?` · ${tr('Consultation','Accessed')}: ${xml(s.consultation)}`:''}</span><a href="${xml(s.url)}">${xml(s.title)}</a><p>${xml(s.scope??s.detail)}</p>${s.references?.length?`<p>${s.references.map(ref=>citationLink(ref)).join(' · ')}</p>`:s.chapters?.length?`<p>${tr('Chapitres','Chapters')}: ${s.chapters.map(n=>`<a href="${book.chapters[n-1].chapter}#chapter-${n}">${n}</a>`).join(' · ')}</p>`:''}</li>`).join('')}</ol></section>`,'backmatter');nav.push({title:book.synthesisSourcesTitle,href:'text/synthesis-sources.xhtml'});
  const figuresTitle=tr('Table des infographies','List of infographics');
  writeChapter('figures.xhtml',figuresTitle,`<section id="figures"><h1>${figuresTitle}</h1><ol>${rendered.flatMap(r=>r.figures.map(f=>`<li id="${f.descriptionId}"><a href="${r.chapter.chapter}#${f.id}">${tr('Chapitre','Chapter')} ${r.chapter.number} · FIG. ${f.number}</a><p>${xml(f.caption)}</p><p class="figure-description">${xml(f.description)}</p></li>`)).join('')}</ol></section>`,'backmatter');nav.push({title:figuresTitle,href:'text/figures.xhtml'});
  const editionParis=new Intl.DateTimeFormat(book.locale,{dateStyle:'long',timeStyle:'long',timeZone:'Europe/Paris'}).format(new Date(book.modified));
  writeChapter('colophon.xhtml',book.colophonTitle,`<section id="colophon"><h1>${xml(book.colophonTitle)}</h1>${bookParagraphs(book,book.colophon)}<p class="source-meta">${tr('Arrêté éditorial de cette édition','Editorial cutoff for this edition')} ${xml(book.modified)} · ${xml(editionParis)} (Europe/Paris).</p><p><a href="${SITE}${book.path}">${tr('Édition en ligne et corrections ultérieures','Online edition and subsequent corrections')}</a></p></section>`,'backmatter');nav.push({title:book.colophonTitle,href:'text/colophon.xhtml'});
  const licenseTitle=tr('Droits et licences','Rights and licences');
  writeChapter('licenses.xhtml',licenseTitle,`<section id="licenses"><h1>${licenseTitle}</h1><p>l0g · <a href="https://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution 4.0 International</a></p><p>${tr('Les textes et figures de l0g sont attribués à l0g. Les citations, documents, photographies et marques de tiers conservent leurs droits respectifs.','The l0g texts and figures are attributed to l0g. Third-party quotations, documents, photographs and trademarks retain their respective rights.')}</p><p>${tr('Polices locales Inter Variable, JetBrains Mono Variable. Les licences complètes accompagnent les fichiers.','Local Inter Variable, JetBrains Mono Variable fonts. Their complete licences accompany the files.')}</p>${aiCreditorsFontFiles.map(f=>`<h2>${xml(f.family)}</h2><pre class="license-text">${xml(readFileSync(join(ROOT,'public/fonts/jlr',f.license),'utf8'))}</pre>`).join('')}</section>`,'backmatter');nav.push({title:licenseTitle,href:'text/licenses.xhtml'});
  const navList=entries=>`<ol>${entries.map(e=>`<li><a href="${xml(e.href)}">${xml(e.title)}</a>${e.children?navList(e.children):''}</li>`).join('')}</ol>`,contents=tr('Sommaire','Contents');
  saveXml(join(epubDir,'nav.xhtml'),xhtmlDocument(book,{title:contents,bodyType:'frontmatter',body:`<nav epub:type="toc" id="toc"><h1>${contents}</h1>${navList(nav)}</nav><nav epub:type="landmarks"><h2>${tr('Repères','Landmarks')}</h2><ol><li><a epub:type="cover" href="text/cover.xhtml">${tr('Couverture','Cover')}</a></li><li><a epub:type="bodymatter" href="text/ch001.xhtml">Introduction</a></li><li><a epub:type="glossary" href="text/glossary.xhtml">${xml(book.glossaryTitle)}</a></li></ol></nav>`}).replace('../styles/stylesheet1.css','styles/stylesheet1.css'));
  let order=0;const ncx=entries=>entries.map(e=>{const id=++order;return `<navPoint id="nav-${id}" playOrder="${id}"><navLabel><text>${xml(e.title)}</text></navLabel><content src="${xml(e.href)}"/>${e.children?ncx(e.children):''}</navPoint>`;}).join('');
  saveXml(join(epubDir,'toc.ncx'),`<?xml version="1.0" encoding="UTF-8"?><ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1" xml:lang="${lang}"><head><meta name="dtb:uid" content="${book.id}"/><meta name="dtb:depth" content="2"/><meta name="dtb:totalPageCount" content="0"/><meta name="dtb:maxPageNumber" content="0"/></head><docTitle><text>${xml(book.title)}</text></docTitle><navMap>${ncx(nav)}</navMap></ncx>`);
  const payloadProvenance={schemaVersion:1,edition:book.id,lang,date:book.date,modified:book.modified,sourceArticles:provenance.map(p=>({lang:p.lang,chapter:p.chapter.number,file:p.file,canonical:SITE+p.chapter.route,sha256:p.hash,published:String(p.date),updated:String(p.updated)})),figures:attachments.map(a=>({chapter:a.chapter,figure:a.figure,kind:a.kind,mobile:a.mobile,sourceSha256:sha(a.original),epubFile:`EPUB/media/${a.name}`,epubSha256:sha(a.svg)})),fonts:[...aiCreditorsFontFiles,...aiCreditorsSvgFontFiles].map(f=>({file:f.source,sha256:sha(readFileSync(join(ROOT,f.source)))})),cover:{file:`public${book.cover}`,sha256:sha(cover)},transformation:'Complete six-article source corpus and all 87 reference notices. Passive offline text. Original 17 figure compositions in 34 desktop/mobile SVG scenes. CSS paints resolved, dark paper supplied for standalone figures, licensed local fonts embedded, and original SVG descriptions provided as reflowable text in the figure index. Original source date precision preserved. No JavaScript, active forms or external media resources.'};
  writeFileSync(join(epubDir,'provenance.json'),JSON.stringify(payloadProvenance,null,2)+'\n');
  const manifest=[['provenance','provenance.json','application/json'],['nav','nav.xhtml','application/xhtml+xml','nav'],['ncx','toc.ncx','application/x-dtbncx+xml'],['css','styles/stylesheet1.css','text/css'],['cover-image','media/cover.jpg','image/jpeg','cover-image'],...documents.map(d=>[d.id,`text/${d.file}`,'application/xhtml+xml']),...attachments.map((a,i)=>[`fig-${i}`,`media/${a.name}`,'image/svg+xml']),...aiCreditorsFontFiles.flatMap((f,i)=>[[`font-${i}`,`fonts/${f.name}`,'font/woff2'],[`font-license-${i}`,`fonts/${f.license}`,'text/plain']])];
  const spine=['cover','half_title','title_page','nav','reader-guide','method','ch001',...book.chapters.map(c=>c.chapter.slice(0,-6)),'conclusion','glossary','synthesis-sources','figures','colophon','licenses'];
  saveXml(join(epubDir,'content.opf'),`<?xml version="1.0" encoding="UTF-8"?><package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="book-id" xml:lang="${lang}" prefix="schema: http://schema.org/"><metadata xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:identifier id="book-id">${book.id}</dc:identifier><dc:title>${xml(book.title)}</dc:title><dc:language>${lang}</dc:language><dc:creator>l0g</dc:creator><dc:publisher>l0g.fr</dc:publisher><dc:date>${book.date}</dc:date><dc:description>${xml(book.description)}</dc:description><dc:source>${SITE}${book.path}</dc:source><dc:rights>Creative Commons Attribution 4.0 International</dc:rights><meta property="dcterms:modified">${book.modified}</meta><meta name="cover" content="cover-image"/><meta property="schema:accessMode">textual</meta><meta property="schema:accessMode">visual</meta><meta property="schema:accessibilityFeature">alternativeText</meta><meta property="schema:accessibilityFeature">readingOrder</meta><meta property="schema:accessibilityFeature">structuralNavigation</meta><meta property="schema:accessibilityFeature">tableOfContents</meta><meta property="schema:accessibilityHazard">none</meta><meta property="schema:accessibilitySummary">${tr('Texte redistribuable, sommaire hiérarchisé, glossaire autonome et sources. Dix-sept infographies complètes, variantes mobile et ordinateur, avec descriptions alternatives.','Reflowable text, hierarchical contents, standalone glossary and references. Seventeen complete infographics with mobile and desktop variants and text alternatives.')}</meta></metadata><manifest>${manifest.map(([id,href,type,properties])=>`<item id="${id}" href="${href}" media-type="${type}"${properties?` properties="${properties}"`:''}/>`).join('')}</manifest><spine toc="ncx">${spine.map(id=>`<itemref idref="${id}"/>`).join('')}${attachments.map((a,i)=>`<itemref idref="fig-${i}" linear="no"/>`).join('')}</spine></package>`);
  const actual=readdirSync(media).sort(),expected=['cover.jpg',...attachments.map(a=>a.name)].sort();if(JSON.stringify(actual)!==JSON.stringify(expected))throw new Error('Unexpected EPUB media payload');
  console.log(`${book.title}: 6 complete articles, 87 notices, 17 figures in 34 SVG scenes, 12 approved source digests.`);
  return{book,sourceDir,provenance,attachments};
}
if(process.argv[1]&&resolve(process.argv[1])===new URL(import.meta.url).pathname){for(const lang of ['fr','en'])await generateAiCreditorsEpub(lang);}
