import { copyFileSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
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
import { debtEditions } from '../src/config/debt-publication.mjs';
import { assertPassiveTree } from './generate-scpi-epub.mjs';
import { assertMicrosoftContentModel } from './generate-microsoft-epub.mjs';
import { assertFontLicenseReferences } from './font-license-assertions.mjs';
import { editorialTitleViolation, contentTitleViolations } from './editorial-title-policy.mjs';
import { escapeXml as xml, xhtmlDocument } from './generate-e-invoicing-epub-lib.mjs';

const ROOT = resolve(new URL('..', import.meta.url).pathname);
const TEMPLATE = join(ROOT, 'src/epub/l-argent-d-epstein');
const FONT_SOURCE = join(ROOT, 'src/epub-assets/debt-chain-fonts');
const SITE = 'https://l0g.fr';
const elements = node => [node, ...(node.children ?? []).flatMap(elements)];
const serialize = node => unified().use(rehypeStringify, { closeSelfClosing: true }).stringify(node);
const element = (tagName, properties, children = []) => ({ type: 'element', tagName, properties, children });
const text = value => ({ type: 'text', value });
const paragraphs = items => items.map(p => `<p>${xml(p)}</p>`).join('\n');
const digest = source => createHash('sha256').update(source).digest('hex');
export const debtPalettes = Object.freeze({
  dark: Object.freeze({ ink:'#0c0d10', surface:'#121419', 'surface-2':'#171a20', paper:'#e7e9ee', bright:'#f5f6f8', muted:'#8b909b', signal:'#5eead4', amber:'#f5b13d', accent:'#ff4d87', 'topic-blue':'#7aa2f7', 'line-strong':'rgba(255, 255, 255, 0.20)' }),
  light: Object.freeze({ ink:'#e7e9ee', surface:'#ffffff', 'surface-2':'#eef0f4', paper:'#1b1d23', bright:'#0c0d10', muted:'#4d5461', signal:'#0b5f58', amber:'#92400e', accent:'#a50f4d', 'topic-blue':'#1d4ed8', 'line-strong':'rgba(12, 13, 16, 0.26)' }),
});
const webStyleHashes = [
  '0a6fff0d61be8c480855e76a273256290e4dca9bf76b2e408b973f92419383c7',
  '5074a124260863be127585e79a4ef92a2ffe0a6571971e16ecf6035eaaf1d1b8',
  '89bdbcdca469c72ad4b86f3f0743e1ccee39789bdbee1a0b02658a04f1306096',
  '942b81579d6cf70516fa1b8624a044614aedfc83a589be330a37a0987fe98a05',
  '87ce4e05ce235f2ab643d31c9107a3518370cb8e296ec6bcd2867a73971ec20c',
  '9c6ecf99a1c367a09013a287994263481d3f1983941c611eff7221bb8922cb66',
  '0f4de538ff9648ffab75951d5bd45c43108bac4392a3c246c02f3c9a0c85fbec',
];
export const debtFontFiles = Object.freeze(['liberation-sans-400.ttf', 'liberation-sans-700.ttf', 'dejavu-sans-400.ttf', 'dejavu-sans-700.ttf']);
export const debtFontCss = debtFontFiles.map(file => {
  const family = file.startsWith('liberation') ? 'Arial' : 'DejaVu Sans';
  const weight = file.includes('-700') ? 700 : 400;
  return `@font-face{font-family:"${family}";src:url("../fonts/${file}") format("truetype");font-weight:${weight};font-style:normal}`;
}).join('\n');
export function debtSvgFontCss(family) {
  if (!['Arial','DejaVu Sans'].includes(family)) throw new Error('Unexpected embedded debt SVG font');
  const base=family==='Arial'?'liberation-sans':'dejavu-sans';
  return [400,700].map(weight=>{
    const bytes=readFileSync(join(FONT_SOURCE,`${base}-${weight}-svg-subset.ttf`));
    if(bytes.length>100_000 || bytes.length<1000 || bytes.readUInt32BE(0)!==0x00010000) throw new Error('Invalid embedded debt SVG font');
    return `@font-face{font-family:"${family}";src:url("data:font/ttf;base64,${bytes.toString('base64')}") format("truetype");font-weight:${weight};font-style:normal}`;
  }).join('\n');
}
const svgTags = new Set(['svg','title','desc','metadata','defs','pattern','path','rect','text','line','polygon','circle','linearGradient','stop','a']);
const svgAttributes = new Set(['xmlns','viewBox','width','height','role','ariaLabelledBy','style','lang','id','patternUnits','d','stroke','strokeOpacity','strokeWidth','fill','strokeLineJoin','strokeLineCap','opacity','strokeDashArray','x','y','rx','fontFamily','fontSize','fontWeight','textAnchor','letterSpacing','x1','y1','x2','y2','points','cx','cy','r','stopColor','offset','href']);
const svgJsxAttributes = new Set(['xmlns','viewBox','width','height','role','aria-labelledby','style','lang','id','patternUnits','d','stroke','stroke-opacity','stroke-width','fill','stroke-linejoin','stroke-linecap','opacity','stroke-dasharray','x','y','rx','font-family','font-size','font-weight','text-anchor','letter-spacing','x1','y1','x2','y2','points','cx','cy','r','stop-color','offset','href']);
const passiveJsx = Object.freeze({div:['class','id'],p:['class'],sup:['class'],a:['href','title','rel','aria-label','class'],figure:['class','id','data-kind'],figcaption:[],section:['class','id','aria-label','aria-labelledby'],h2:['id'],strong:[],span:['class'],em:[],ol:['class'],li:['id'],small:[],b:[]});
const blockElements = new Set(['article','aside','blockquote','details','div','dl','figure','figcaption','footer','h1','h2','h3','h4','h5','h6','header','hr','li','main','nav','ol','p','pre','section','table','ul']);
function normalizeParagraphs(node) {
  if (!node.children) return [node];
  node.children = node.children.flatMap(normalizeParagraphs);
  if (node.tagName !== 'p' || !node.children.some(c => c.type === 'element' && blockElements.has(c.tagName))) return [node];
  const siblings = []; let inline = [];
  const flush = () => { if (inline.some(n => n.type !== 'text' || n.value.trim())) siblings.push(element('p',node.properties,inline)); inline=[]; };
  for (const child of node.children) { if (child.type === 'element' && blockElements.has(child.tagName)) { flush(); siblings.push(child); } else inline.push(child); }
  flush(); return siblings;
}
function attributes(node, allowed) {
  const props = Object.create(null);
  for (const attr of node.attributes) {
    if (attr.type !== 'mdxJsxAttribute' || typeof attr.value !== 'string' || !allowed.includes(attr.name) || Object.hasOwn(props,attr.name)) throw new Error('Non-literal or unexpected debt MDX attribute');
    props[attr.name] = attr.value;
  }
  return props;
}
function literalExpression(node, type) {
  const body = node.data?.estree?.body;
  const expression = body?.[0]?.expression;
  if (body?.length !== 1 || body[0].type !== 'ExpressionStatement') throw new Error('Unexpected debt MDX expression');
  if (type === 'string' && expression?.type === 'Literal' && typeof expression.value === 'string') return expression.value;
  if (type === 'template' && expression?.type === 'TemplateLiteral' && expression.expressions.length === 0 && expression.quasis.length === 1) return expression.quasis[0].value.cooked;
  throw new Error('Executable debt MDX expression');
}

// Resolve the existing semantic paints for an explicit edition. No geometry,
// data, labels or font families are altered; only a local font stylesheet is added.
export function bakeDebtSvg(original, theme, sourceDocument) {
  if (!Object.hasOwn(debtPalettes,theme)) throw new Error('Unsupported debt EPUB theme');
  if (typeof original !== 'string' || original.length > 500_000 || XMLValidator.validate(original) !== true || /<!DOCTYPE|<!ENTITY/iu.test(original)) throw new Error('Invalid debt SVG');
  const palette = debtPalettes[theme], tree = fromHtml(original,{fragment:true}), nodes = elements(tree), svg = nodes.find(n => n.tagName === 'svg');
  if (!svg || nodes.filter(n => n.tagName === 'svg').length !== 1) throw new Error('Expected one debt SVG');
  const ids = nodes.map(n => n.properties?.id).filter(Boolean);
  if (ids.length !== new Set(ids).size) throw new Error('Duplicate debt SVG ID');
  const epubIds=new Map(ids.map(id=>[id,/^[A-Za-z_][\w.-]*$/u.test(id)?id:`svg-${id}`]));
  if ([...epubIds.values()].some(id=>!/^[A-Za-z_][\w.-]*$/u.test(id)) || new Set(epubIds.values()).size!==ids.length) throw new Error('Invalid debt SVG XML identifier');
  for (const node of nodes.filter(n => n.type === 'element')) {
    if (!svgTags.has(node.tagName)) throw new Error(`Unapproved debt SVG element: ${node.tagName}`);
    if (node.tagName === 'title' && editorialTitleViolation(toText(node))) throw new Error('Forbidden debt SVG title');
    for (const [key,raw] of Object.entries(node.properties ?? {})) {
      if (!svgAttributes.has(key)) throw new Error(`Unapproved debt SVG attribute: ${key}`);
      const value = String(raw);
      if (key === 'id') {
        node.properties.id=epubIds.get(value);
      } else if (key === 'ariaLabelledBy') {
        const refs=Array.isArray(raw)?raw:value.split(/\s+/u);
        if (refs.some(id=>!epubIds.has(id))) throw new Error('Missing debt SVG accessible name reference');
        node.properties.ariaLabelledBy=refs.map(id=>epubIds.get(id));
      } else if (key === 'href') {
        if (node.tagName !== 'a' || !/^#source-\d{2}$/u.test(value) || !/^ch00[2-8]\.xhtml$/u.test(sourceDocument??'')) throw new Error('Unexpected debt SVG link');
        node.properties.href=`../text/${sourceDocument}${value}`;
      } else if (key === 'style') {
        if (node !== svg || value !== 'width:100%;height:auto') throw new Error('Unexpected debt SVG style');
        delete node.properties.style;
      } else if (value.includes('var(')) {
        if (!['fill','stroke','stopColor'].includes(key)) throw new Error('Unexpected debt SVG colour property');
        const mix = value.match(/^color-mix\(in srgb, var\(--color-(amber|signal|topic-blue)\) (10|14|16|25)%, var\(--color-ink\)\)$/u);
        if (mix && new Set(['amber:10','amber:25','signal:14','topic-blue:16']).has(`${mix[1]}:${mix[2]}`)) {
          const percent=Number(mix[2])/100,colour=palette[mix[1]],ink=palette.ink;
          const channels=[1,3,5].map(i=>Math.round(parseInt(colour.slice(i,i+2),16)*percent+parseInt(ink.slice(i,i+2),16)*(1-percent)));
          node.properties[key]=`#${channels.map(c=>c.toString(16).padStart(2,'0')).join('')}`;
          continue;
        }
        const ast = valueParser(value), item = ast.nodes[0];
        if (ast.nodes.length !== 1 || item?.type !== 'function' || item.value !== 'var' || item.nodes.length !== 1 || item.nodes[0].type !== 'word' || !/^--color-[a-z\d-]+$/u.test(item.nodes[0].value)) throw new Error(`Unexpected debt SVG colour expression: ${value}`);
        const role = item.nodes[0].value.slice(8);
        if (!Object.hasOwn(palette,role)) throw new Error('Unknown debt SVG colour role');
        node.properties[key] = palette[role];
      } else if (value.includes('url(')) {
        const ref = value.match(/^url\(#([\w-]+)\)$/u);
        if (!['fill','stroke'].includes(key) || !ref || !ids.includes(ref[1])) throw new Error('External or missing debt SVG resource');
        node.properties[key]=`url(#${epubIds.get(ref[1])})`;
      } else if (['fill','stroke','stopColor'].includes(key) && value !== 'none') throw new Error('Unapproved literal debt SVG paint');
      else if (/javascript:|@import|color-mix\(|[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/iu.test(value)) throw new Error('Active debt SVG value');
      if (key === 'fontFamily' && !['Arial, Helvetica, sans-serif','DejaVu Sans, Arial, sans-serif','DejaVu Sans,Arial,sans-serif'].includes(value)) throw new Error('Unexpected debt SVG font family');
    }
  }
  const box = String(svg.properties.viewBox).trim().split(/\s+/u).map(Number);
  if (box.length !== 4 || box.some(v => !Number.isFinite(v)) || box[2] <= 0 || box[3] <= 0) throw new Error('Invalid debt SVG viewBox');
  svg.properties.xmlns = 'http://www.w3.org/2000/svg';
  const family=nodes.some(n=>n.properties?.fontFamily?.startsWith('DejaVu'))?'DejaVu Sans':'Arial';
  svg.children.unshift(element('style',{type:'text/css'},[text(debtSvgFontCss(family))]));
  const result = serialize(svg);
  if (XMLValidator.validate(result) !== true) throw new Error('Invalid baked debt SVG XML');
  return result;
}

export async function renderDebtArticle(source, chapter, theme, offset = 0) {
  const book = Object.values(debtEditions).find(b => b.chapters.includes(chapter));
  if (!book) throw new Error('Unconfigured debt chapter');
  if (!Object.hasOwn(debtPalettes,theme)) throw new Error('Unsupported debt EPUB theme');
  const {frontmatter:meta,content} = parseFrontmatter(source);
  if (!meta.title || !meta.description || meta.draft || (book.lang === 'en' && meta.sourceArticle !== chapter.sourceSlug)) throw new Error('Incomplete debt article');
  const dates = [book.modified,meta.pubDate,meta.updatedDate??meta.pubDate].map(d => new Date(d).getTime());
  if (!dates.every(Number.isFinite) || dates[0] < Math.max(...dates.slice(1))) throw new Error('Debt edition predates its source');
  if (book.lang === 'en') {
    const fr = parseFrontmatter(readFileSync(join(ROOT,'src/content/posts',`${chapter.sourceSlug}.mdx`),'utf8')).frontmatter;
    if (new Date(meta.sourceUpdatedDate).getTime() !== new Date(fr.updatedDate??fr.pubDate).getTime()) throw new Error('English debt source version drift');
  }
  if (/<!DOCTYPE|<!ENTITY/iu.test(content)) throw new Error('Unexpected debt article declaration');
  if (contentTitleViolations(content,new Map(Object.entries(meta))).length) throw new Error('Forbidden debt article heading');
  const parser = unified().use(remarkParse).use(remarkGfm).use(remarkMdx);
  const mdast = parser.parse(content);
  let styleCount = 0;
  function inspect(node,parent,inSvg=false) {
    if (['mdxjsEsm','html','image','imageReference','mdxFlowExpression'].includes(node.type)) throw new Error('Active or unexpected debt MDX content');
    if (node.type === 'mdxTextExpression') {
      const value = literalExpression(node,'string');
      const href = parent?.name === 'a' ? attributes(parent,passiveJsx.a).href : null;
      if (!href || value !== href) throw new Error('Unexpected literal debt MDX expression');
    }
    if (node.type?.startsWith('mdxJsx')) {
      if (node.name === 'style') {
        styleCount++;
        if (parent !== mdast || node.attributes.length || node.children.length !== 1 || node.children[0].type !== 'mdxFlowExpression' || digest(literalExpression(node.children[0],'template')) !== webStyleHashes[chapter.number-1]) throw new Error('Unexpected debt website style');
        return;
      }
      const svg = inSvg || node.name === 'svg';
      if (svg) {
        if (!svgTags.has(node.name)) throw new Error(`Unapproved debt SVG markup: ${node.name}`);
        attributes(node,[...svgJsxAttributes]);
      } else {
        if (!Object.hasOwn(passiveJsx,node.name)) throw new Error(`Unapproved debt MDX element: ${node.name}`);
        attributes(node,passiveJsx[node.name]);
      }
      node.children?.forEach(c => inspect(c,node,svg)); return;
    }
    node.children?.forEach(c => inspect(c,node,inSvg));
  }
  inspect(mdast,null);
  if (styleCount !== 1) throw new Error('Missing or duplicate debt website style');
  mdast.children = mdast.children.filter(n => n.name !== 'style');
  const originals = [];
  const handler = (state,node) => {
    if (node.name === 'svg') {
      const original = content.slice(node.position.start.offset,node.position.end.offset), name = `file${offset+originals.length}.svg`;
      const svg = bakeDebtSvg(original,theme,chapter.chapter), desc = elements(fromHtml(original,{fragment:true})).find(n => n.tagName === 'desc');
      if (!desc || !toText(desc).trim()) throw new Error('Missing debt SVG alternative description');
      originals.push({name,original,svg,chapter:chapter.number});
      return element('img',{src:`../media/${name}`,className:['infographic-image'],alt:toText(desc).trim()});
    }
    const props = attributes(node,passiveJsx[node.name]);
    if (props.class) { props.className=props.class.split(/\s+/u); delete props.class; }
    let children = state.all(node);
    if (['p','h2'].includes(node.name) && children.length === 1 && children[0].tagName === 'p') children=children[0].children;
    return element(node.name,props,children);
  };
  const processor = unified().use(remarkRehype,{handlers:{mdxJsxFlowElement:handler,mdxJsxTextElement:handler,mdxTextExpression:(_state,node)=>text(literalExpression(node,'string'))}});
  const tree = await processor.run(mdast);
  normalizeParagraphs(tree);
  const figures = elements(tree).filter(n => n.tagName === 'figure');
  if (figures.length !== chapter.figureCount || originals.length !== chapter.figureCount*2) throw new Error('Debt figure count drift');
  for (const [i,figure] of figures.entries()) {
    const images = elements(figure).filter(n => n.tagName === 'img');
    const captions = figure.children.filter(n => n.tagName === 'figcaption');
    if (images.length !== 2 || captions.length !== 1) throw new Error(`Incomplete original debt figure: ${chapter.number}/${i+1} images${images.length} captions${captions.length}`);
    figure.properties.id ??= `c${chapter.number}-infographic-${i+1}`;
    originals[i*2].kind='complete'; originals[i*2+1].kind='reading';
    originals[i*2].figure=i+1; originals[i*2+1].figure=i+1;
    const links = element('p',{className:['figure-enlarge']},[
      element('a',{href:images[0].properties.src},[text(book.lang==='fr'?'Composition complète':'Complete composition')]),text(' · '),
      element('a',{href:images[1].properties.src},[text(book.lang==='fr'?'Version verticale':'Vertical composition')]),
    ]);
    figure.properties={id:figure.properties.id,className:['infographic']};
    figure.children=[element('div',{className:['infographic-wide']},[images[0]]),element('div',{className:['infographic-reading']},[images[1]]),links,...captions];
  }
  for (const node of elements(tree)) {
    if (['th','td'].includes(node.tagName) && node.properties.align) {
      const align=node.properties.align;
      if (!['left','center','right'].includes(align)) throw new Error('Invalid debt table alignment');
      node.properties.className=[`align-${align}`]; delete node.properties.align;
    }
  }
  assertMicrosoftContentModel(tree); assertPassiveTree(tree);
  for (const link of elements(tree).filter(n=>n.tagName==='a')) {
    const href=String(link.properties.href??'');
    if (href.startsWith('#') || href.startsWith('/') || originals.some(a=>href===`../media/${a.name}`)) continue;
    if (!/^(?:https?:|mailto:)/u.test(href)) throw new Error('Unapproved relative debt article link');
    const url=new URL(href);
    if (url.username || url.password) throw new Error('Credentials in debt article URL');
  }
  return {html:serialize(tree),attachments:originals,figures:figures.map((f,i)=>({id:f.properties.id,number:i+1,caption:toText(f.children.find(n=>n.tagName==='figcaption'))})),next:offset+originals.length,sourceHash:digest(source)};
}

export function prepareDebtReading(html,book,number) {
  const tree=fromHtml(html,{fragment:true}),headings=[],slugger=new GithubSlugger();
  assertPassiveTree(tree);
  const routes = new Map(book.chapters.map(c => [c.route,`${c.chapter}#article-${c.number}`]));
  const glossary = new Map(book.glossary.map(g => [g.path,`glossary.xhtml#term-${g.slug}`]));
  for (const node of elements(tree)) {
    if (node.tagName === 'h2') { const title=toText(node); node.properties.id ??= slugger.slug(title); headings.push({title,id:node.properties.id}); }
    if (node.tagName === 'a' && node.properties.href && !String(node.properties.href).startsWith('#')) {
      const raw=String(node.properties.href),url=new URL(raw,SITE);
      if (url.origin === SITE && !url.username && !url.password && !url.search && routes.has(url.pathname)) {
        const [file,id]=routes.get(url.pathname).split('#'); node.properties.href=`${file}${url.hash||`#${id}`}`;
      } else if (url.origin === SITE && !url.username && !url.password && !url.search && !url.hash && glossary.has(url.pathname)) node.properties.href=glossary.get(url.pathname);
      else if (raw.startsWith('/')) node.properties.href=url.href;
    }
  }
  assertPassiveTree(tree); assertMicrosoftContentModel(tree);
  return {html:serialize(tree),headings};
}

function canonicalSourceUrl(value) {
  if(typeof value!=='string' || /[\\\u0000-\u0020\u007f]/u.test(value) || value.startsWith('//') || !(value.startsWith('/') || value.startsWith('https://'))) throw new Error('Unsafe debt glossary/source URL');
  const url=new URL(value,SITE);
  if(url.protocol!=='https:' || url.username || url.password) throw new Error('Unsafe debt glossary/source URL');
  return url.href;
}

export function debtStyles(theme) {
  const p=debtPalettes[theme]; if (!p) throw new Error('Unsupported debt EPUB theme');
  return `@charset "UTF-8";\n${debtFontCss}\n@page{margin:5%;background:${p.ink};color:${p.paper}}\nhtml,body{color:${p.paper};background:${p.ink};color-scheme:${theme==='dark'?'dark':'light'}}
*{box-sizing:border-box}body{margin:0 auto;max-width:42em;padding:0 1.25em 2.5em;font-family:Georgia,"Times New Roman",serif;font-size:1em;line-height:1.65;widows:2;orphans:2;hyphens:auto;overflow-wrap:break-word}
h1,h2,h3{font-family:Arial,Helvetica,sans-serif;color:${p.paper};line-height:1.2;hyphens:none;page-break-after:avoid;break-after:avoid}h1{margin:1.2em 0 .75em;font-size:1.9em;letter-spacing:-.02em}h2{margin:2.2em 0 .65em;padding-top:.45em;border-top:1px solid ${p['line-strong']};font-size:1.3em}h3{margin:1.7em 0 .55em;font-size:1.08em}p{margin:.8em 0}a{color:${p.signal};text-decoration:underline;overflow-wrap:anywhere}strong,b{color:${p.paper}}ul,ol{margin:.8em 0 1em 1.3em;padding:0}li{margin:.5em 0}sup{font-family:Arial,sans-serif;font-size:.72em;line-height:0;white-space:nowrap}blockquote{margin:1.4em 0;padding:.2em 0 .2em 1em;border-left:3px solid ${p.signal};color:${p.muted}}
figure{margin:1.8em auto 2.4em;max-width:40em;page-break-inside:avoid;break-inside:avoid}img{display:block;max-width:100%;height:auto;margin:0 auto}.infographic-image{display:block;width:100%;height:auto;background:${p.ink}}.infographic-reading{display:none}.infographic-reading .infographic-image{max-width:28em;margin:0 auto 1em}.figure-enlarge{font-family:Arial,sans-serif;font-size:.75em;margin:.6em 0}figcaption{font-family:Arial,sans-serif;font-size:.82em;line-height:1.5;margin:1em .15em 0;padding-bottom:.5em;color:${p.muted}}figcaption strong{display:block;margin:.35em 0}figcaption span{display:block;color:${p.signal};font-size:.85em}.align-left{text-align:left}.align-center{text-align:center}.align-right{text-align:right}
table{width:100%;margin:1.4em 0;border-collapse:collapse;table-layout:fixed;font-family:Arial,sans-serif;font-size:.78em;line-height:1.4}th,td{padding:.5em;border:1px solid ${p['line-strong']};vertical-align:top;overflow-wrap:anywhere}th{background:${p['surface-2']};text-align:left}.chapter-kicker,.author{font-family:Arial,sans-serif;color:${p.signal};font-size:.8em;font-weight:700;letter-spacing:.08em;text-transform:uppercase}.chapter-dek{font-family:Arial,sans-serif;font-size:1.07em;line-height:1.5;color:${p.muted}}.chapter-meta{font-family:Arial,sans-serif;font-size:.78em;color:${p.muted};border-bottom:2px solid ${p.amber};padding-bottom:.9em;margin-bottom:2em}.half-title{text-align:center;margin:5em 0 3em}.titlepage{padding-top:12%}.titlepage .subtitle{font-family:Arial,sans-serif;font-size:1.15em;line-height:1.5;border-top:3px solid ${p.signal};padding-top:.9em}.titlepage .author{margin-top:3em}.source-id{font-family:monospace;font-size:.72em;overflow-wrap:anywhere;word-break:break-all}.source-url{display:block;overflow-wrap:anywhere}small{display:block;color:${p.muted};font-size:.84em}.glossary-term{margin:2em 0}.glossary-term h2{margin:0 0 .5em}.cover-page{max-width:none;margin:0;padding:0}.cover-page img{width:100%;height:auto}code{overflow-wrap:anywhere}nav#toc ol{margin-left:1em}
@media(max-width:36em){body{padding-right:1em;padding-left:1em}h1{font-size:1.65em}.infographic-wide{display:none}.infographic-reading{display:block}figure.infographic{page-break-inside:auto;break-inside:auto}table{font-size:.7em}th,td{padding:.3em}}\n`;
}

export async function generateDebtEpub(lang='fr',theme='dark') {
  if (!Object.hasOwn(debtEditions,lang)) throw new Error('Unsupported debt EPUB language');
  if (!Object.hasOwn(debtPalettes,theme)) throw new Error('Unsupported debt EPUB theme');
  const book=debtEditions[lang],edition=book.editions.find(e=>e.theme===theme);
  if (!edition || edition.directory!==`${book.directory}-${theme}`) throw new Error('Unconfigured debt EPUB edition');
  const metaBook={...book,id:edition.id},tr=(fr,en)=>lang==='fr'?fr:en;
  for (const title of [book.title,book.subtitle,book.introductionTitle,book.conclusionTitle,book.methodTitle,...book.chapters.map(c=>c.title)]) if (editorialTitleViolation(title)) throw new Error(`Forbidden debt book title: ${title}`);
  const sourceDir=join(ROOT,'src/epub',edition.directory),epubDir=join(sourceDir,'EPUB'),media=join(epubDir,'media'),textDir=join(epubDir,'text'),fontsDir=join(epubDir,'fonts');
  // Regeneration removes only this configured generated edition, so stale assets
  // cannot leak into a later archive. No source article or other book is touched.
  rmSync(sourceDir,{recursive:true,force:true});
  for (const dir of [media,textDir,fontsDir,join(epubDir,'styles'),join(sourceDir,'META-INF'),join(ROOT,'public/publications')]) mkdirSync(dir,{recursive:true});
  for (const file of ['mimetype','META-INF/container.xml','META-INF/com.apple.ibooks.display-options.xml']) copyFileSync(join(TEMPLATE,file),join(sourceDir,file));
  for (const file of [...debtFontFiles,'dejavu-LICENSE.txt','liberation-LICENSE.txt']) copyFileSync(join(FONT_SOURCE,file),join(fontsDir,file));
  for (const family of ['dejavu','liberation']) assertFontLicenseReferences(readFileSync(join(fontsDir,`${family}-LICENSE.txt`),'utf8'),family);
  const saveXml=(path,content)=>{if(XMLValidator.validate(content)!==true)throw new Error(`Invalid debt EPUB XML: ${relative(ROOT,path)}`);writeFileSync(path,content);};
  const writeChapter=(file,title,body,type='bodymatter')=>{
    if (editorialTitleViolation(title)) throw new Error('Forbidden debt EPUB chapter title');
    for (const heading of elements(fromHtml(body,{fragment:true})).filter(n=>/^h[1-6]$/u.test(n.tagName))) if (editorialTitleViolation(toText(heading))) throw new Error('Forbidden debt EPUB heading');
    const document=xhtmlDocument(metaBook,{title,body,bodyType:type});
    saveXml(join(textDir,file),type==='frontmatter cover'?document.replace('<body ','<body class="cover-page" '):document);
  };
  writeFileSync(join(epubDir,'styles/stylesheet1.css'),debtStyles(theme));
  const cover=await sharp(join(ROOT,`src/epub-assets/${book.directory}-cover.png`)).resize(1024,1638,{fit:'contain',background:'#0c0d10'}).jpeg({quality:85,mozjpeg:true}).toBuffer();
  writeFileSync(join(media,'cover.jpg'),cover);writeFileSync(join(ROOT,'public',book.cover),cover);
  for (const width of [320,640,960]) await sharp(cover).resize({width}).webp({quality:84}).toFile(join(ROOT,'public',book.cover.replace('.jpg',`-${width}.webp`)));
  if (book.panorama) {
    const panorama=await sharp(join(ROOT,'src/epub-assets/debt-chain-panorama.png')).resize(1600,800,{fit:'cover'}).jpeg({quality:86,mozjpeg:true}).toBuffer();
    writeFileSync(join(ROOT,'public',book.panorama),panorama);
    for (const width of [640,960,1600]) await sharp(panorama).resize({width}).webp({quality:82}).toFile(join(ROOT,'public',book.panorama.replace('.jpg',`-${width}.webp`)));
  }
  const date=new Intl.DateTimeFormat(book.locale,{dateStyle:'long',timeZone:'Europe/Paris'}).format(new Date(book.modified));
  const themeLabel=theme==='dark'?tr('Édition sombre','Dark edition'):tr('Édition claire','Light edition');
  writeChapter('cover.xhtml',tr('Couverture','Cover'),`<img src="../media/cover.jpg" alt="${xml(book.title)}" />`,'frontmatter cover');
  writeChapter('half_title.xhtml',book.title,`<section class="half-title"><p>l0g · ${tr('Enquête documentaire','Documentary investigation')}</p><h1>${xml(book.title)}</h1></section>`,'frontmatter');
  writeChapter('title_page.xhtml',book.title,`<section class="titlepage" epub:type="titlepage"><h1>${xml(book.title)}</h1><p class="subtitle">${xml(book.subtitle)}</p><p class="author">l0g</p><p>${xml(date)} · ${tr('Édition française','English edition')} · ${themeLabel}</p><p>${tr('Sept articles complets, quarante infographies, une introduction, une conclusion et un glossaire.','Seven complete articles, forty infographics, an introduction, a conclusion and a glossary.')}</p><p>${tr('Documentation arrêtée au','Documentary cut-off:')} ${xml(book.documentationDate)}.</p><p>Creative Commons Attribution 4.0 International</p></section>`,'frontmatter');
  writeChapter('method.xhtml',book.methodTitle,`<section id="method"><h1>${xml(book.methodTitle)}</h1>${paragraphs(book.method)}<h2>${xml(book.readerGuideTitle)}</h2>${paragraphs(book.readerGuide)}<h2>${xml(book.synthesisSourcesTitle)}</h2><ol>${book.synthesisSources.map(s=>`<li><a href="${xml(canonicalSourceUrl(s.url))}">${xml(s.title)}</a><p>${xml(s.note)}</p></li>`).join('')}</ol><p>${tr('Les deux éditions présentent le même texte et les mêmes données. Seules les couleurs de lecture diffèrent. La couleur du fond dépend aussi des préférences et des fonctions de la liseuse.','Both editions contain the same text and data. Only the reading colours differ. The displayed background also depends on the reading application’s settings and capabilities.')}</p><p>${tr('Les quarante figures conservent leurs compositions complète et verticale, leur géométrie et leurs libellés. Les deux compositions sont disponibles hors ligne par lien ; le choix automatique suit la largeur de lecture. Les polices locales Liberation Sans et DejaVu Sans sont incluses avec leurs licences. L’agrandissement et la prise en charge des polices dépendent de la liseuse.','All forty figures retain their complete and vertical compositions, geometry and labels. Both compositions are linked offline; automatic selection follows the reading width. Local Liberation Sans and DejaVu Sans fonts are included with their licences. Enlargement and font support depend on the reading application.')}</p></section>`,'frontmatter');
  writeChapter('ch001.xhtml',book.introductionTitle,`<section id="introduction" epub:type="introduction"><p class="chapter-kicker">Introduction</p><h1>${xml(book.introductionTitle)}</h1>${paragraphs(book.introduction)}<p>${tr('Les mécanismes et les sources de cette synthèse sont développés dans les','The mechanisms and sources behind this synthesis are developed in the')} <a href="../nav.xhtml#toc">${tr('sept chapitres','seven chapters')}</a>.</p></section>`);
  const nav=[{title:book.methodTitle,href:'text/method.xhtml'},{title:`Introduction${tr(' : ',': ')}${book.introductionTitle}`,href:'text/ch001.xhtml'}],attachments=[],provenance=[],figureIndex=[];
  for (const chapter of book.chapters) {
    const source=readFileSync(join(ROOT,'src/content',lang==='fr'?'posts':'posts-en',`${chapter.slug}.mdx`),'utf8'),meta=parseFrontmatter(source).frontmatter;
    const assembled=await renderDebtArticle(source,chapter,theme,attachments.length),reading=prepareDebtReading(assembled.html,book,chapter.number);
    for (const attachment of assembled.attachments) saveXml(join(media,attachment.name),attachment.svg);
    attachments.push(...assembled.attachments);provenance.push({chapter,hash:assembled.sourceHash,date:meta.pubDate,updated:meta.updatedDate});figureIndex.push(...assembled.figures.map(f=>({...f,chapter})));
    const published=new Intl.DateTimeFormat(book.locale,{dateStyle:'long',timeZone:'Europe/Paris'}).format(new Date(meta.pubDate));
    writeChapter(chapter.chapter,meta.title,`<section id="article-${chapter.number}"><p class="chapter-kicker">${tr('Chapitre','Chapter')} ${chapter.number}</p><h1>${xml(meta.title)}</h1><p class="chapter-dek">${xml(meta.description)}</p><p class="chapter-meta">${xml(published)} · <a href="${SITE}${chapter.route}">${tr('Version en ligne','Online article')}</a></p>${reading.html}</section>`);
    nav.push({title:`${chapter.number}. ${chapter.title}`,href:`text/${chapter.chapter}`,children:reading.headings.map(h=>({title:h.title,href:`text/${chapter.chapter}#${h.id}`}))});
  }
  if (attachments.length!==book.figureCount*2) throw new Error('Debt book figure count drift');
  writeChapter('ch009.xhtml',book.conclusionTitle,`<section id="conclusion" epub:type="conclusion"><p class="chapter-kicker">Conclusion</p><h1>${xml(book.conclusionTitle)}</h1>${paragraphs(book.conclusion)}<p>${tr('Les références restent attachées aux','References remain attached to the')} <a href="../nav.xhtml#toc">${tr('chapitres correspondants','relevant chapters')}</a>.</p></section>`);
  nav.push({title:`Conclusion${tr(' : ',': ')}${book.conclusionTitle}`,href:'text/ch009.xhtml'});
  const glossaryTitle=tr('Glossaire de la chaîne obligataire','Bond-market glossary');
  writeChapter('glossary.xhtml',glossaryTitle,`<section id="glossary"><h1>${glossaryTitle}</h1><p>${tr('Définitions reprises du glossaire l0g. Les liens des chapitres vers ces entrées fonctionnent hors ligne ; la version en ligne peut évoluer.','Definitions reproduced from the l0g glossary. Chapter links to these entries work offline; the online version may change.')}</p>${book.glossary.map(g=>`<section class="glossary-term" id="term-${xml(g.slug)}"><h2>${xml(g.title)}</h2><p>${xml(g.definition)}</p><p>${tr('Chapitres','Chapters')}: ${g.chapters.map(n=>`<a href="${book.chapters[n-1].chapter}#article-${n}">${n}</a>`).join(' · ')}.</p><ul>${g.sources.map(s=>`<li><a href="${xml(canonicalSourceUrl(s.url))}">${xml(s.title)}</a></li>`).join('')}</ul><p><a href="${SITE}${xml(g.path)}">${tr('Entrée en ligne','Online entry')}</a></p></section>`).join('')}</section>`,'backmatter');
  nav.push({title:glossaryTitle,href:'text/glossary.xhtml'});
  const figuresTitle=tr('Index des infographies','Index of infographics');
  writeChapter('figures.xhtml',figuresTitle,`<section id="figures"><h1>${figuresTitle}</h1><ol>${figureIndex.map(f=>`<li><a href="${f.chapter.chapter}#${xml(f.id)}">${tr('Chapitre','Chapter')} ${f.chapter.number} · FIG. ${f.number}</a><p>${xml(f.caption)}</p></li>`).join('')}</ol></section>`,'backmatter');
  nav.push({title:figuresTitle,href:'text/figures.xhtml'});
  const aboutTitle=tr('Colophon et provenance','Colophon and provenance');
  writeChapter('ch010.xhtml',aboutTitle,`<section id="edition"><h1>${aboutTitle}</h1><p>${xml(date)} · ${themeLabel}. ${tr('Ce livre rassemble les sept volets de l’enquête Qui tient la dette des États ?, avec une introduction et une conclusion originales. Les synthèses reprennent les mécanismes sourcés dans les chapitres et n’introduisent aucune observation nouvelle.','This book collects the seven parts of the investigation Who holds sovereign debt?, with an original introduction and conclusion. The syntheses draw on the sourced mechanisms in the chapters and introduce no new observations.')}</p><p>${tr('La couverture est une composition conceptuelle créée avec une assistance d’intelligence artificielle. Elle ne représente aucun flux mesuré, bilan réel ou institution identifiable.','The cover is a conceptual composition created with AI assistance. It depicts no measured flow, actual balance sheet or identifiable institution.')}</p><p>${tr('Aucun script, police distante ni outil de suivi n’est embarqué. Textes, glossaire et infographies sont disponibles hors ligne ; les sources externes nécessitent une connexion.','No script, remote font or tracker is embedded. Text, glossary and infographics are available offline; external sources require a connection.')}</p><h2>${tr('Articles d’origine et empreintes SHA-256','Original articles and SHA-256 digests')}</h2><p>${tr('Chaque empreinte identifie les octets exacts du fichier MDX repris. Elle permet une comparaison documentaire ; elle ne constitue ni une certification des faits ni une signature numérique.','Each digest identifies the exact bytes of the MDX file used. It supports documentary comparison; it is neither a certification of the reporting nor a digital signature.')}</p><ol>${provenance.map(p=>`<li><a href="${SITE}${p.chapter.route}">${xml(p.chapter.title)}</a><p>${xml(p.chapter.slug)}.mdx</p><p>${tr('Publication','Published')}: ${xml(new Date(p.date).toISOString())}${p.updated?` · ${tr('Mise à jour','Updated')}: ${xml(new Date(p.updated).toISOString())}`:''}</p><p class="source-id">SHA-256: <code>${p.hash}</code></p></li>`).join('')}</ol><h2>${tr('Polices et licences','Fonts and licences')}</h2><p>${tr('Liberation Sans est utilisée comme police locale compatible avec les métriques Arial des figures. DejaVu Sans conserve la typographie du dernier chapitre. Les polices complètes sont incluses sans modification ; des sous-ensembles des glyphes des figures sont aussi intégrés directement dans chaque SVG pour améliorer la compatibilité.','Liberation Sans supplies a local font compatible with the Arial metrics used by the figures. DejaVu Sans preserves the final chapter’s typography. Complete fonts are included unmodified; subsets of the figure glyphs are also embedded directly in each SVG to improve compatibility.')}</p><p><a href="https://github.com/liberationfonts/liberation-fonts/blob/main/LICENSE">Liberation Sans · SIL Open Font License 1.1</a> · <a href="https://dejavu-fonts.github.io/License.html">DejaVu Sans · ${tr('licence','licence')}</a></p><p><a href="${SITE}${book.path}">${tr('Page de l’édition et corrections ultérieures','Edition page and subsequent corrections')}</a></p><p><a href="https://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution 4.0 International</a> · l0g</p></section>`,'backmatter');
  nav.push({title:aboutTitle,href:'text/ch010.xhtml'});
  const navList=items=>`<ol>${items.map(e=>`<li><a href="${e.href}">${xml(e.title)}</a>${e.children?navList(e.children):''}</li>`).join('')}</ol>`;
  for (const entry of nav.flatMap(n=>[n,...(n.children??[])])) if (editorialTitleViolation(entry.title)) throw new Error('Forbidden debt EPUB navigation title');
  saveXml(join(epubDir,'nav.xhtml'),xhtmlDocument(metaBook,{title:tr('Sommaire','Contents'),bodyType:'frontmatter',body:`<nav epub:type="toc" id="toc"><h1>${tr('Sommaire','Contents')}</h1>${navList(nav)}</nav>`}).replace('../styles/stylesheet1.css','styles/stylesheet1.css'));
  let order=0;const ncx=items=>items.map(e=>{const n=++order;return `<navPoint id="nav-${n}" playOrder="${n}"><navLabel><text>${xml(e.title)}</text></navLabel><content src="${e.href}"/>${e.children?ncx(e.children):''}</navPoint>`;}).join('');
  saveXml(join(epubDir,'toc.ncx'),`<?xml version="1.0" encoding="UTF-8"?><ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1" xml:lang="${lang}"><head><meta name="dtb:uid" content="${edition.id}"/><meta name="dtb:depth" content="2"/><meta name="dtb:totalPageCount" content="0"/><meta name="dtb:maxPageNumber" content="0"/></head><docTitle><text>${xml(book.title)}</text></docTitle><navMap>${ncx(nav)}</navMap></ncx>`);
  const sections=Array.from({length:10},(_,i)=>`ch${String(i+1).padStart(3,'0')}`),extra=['half_title','method','glossary','figures'];
  saveXml(join(epubDir,'content.opf'),`<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="book-id" xml:lang="${lang}" prefix="schema: http://schema.org/">
<metadata xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:identifier id="book-id">${edition.id}</dc:identifier><dc:title>${xml(book.title)}</dc:title><dc:language>${lang}</dc:language><dc:creator>l0g</dc:creator><dc:publisher>l0g.fr</dc:publisher><dc:date>${book.date}</dc:date><dc:description>${xml(book.description)} ${themeLabel}.</dc:description><dc:source>${SITE}${book.path}</dc:source><dc:rights>Creative Commons Attribution 4.0 International</dc:rights><meta property="dcterms:modified">${book.modified}</meta><meta name="cover" content="cover-image"/><meta property="schema:accessMode">textual</meta><meta property="schema:accessMode">visual</meta><meta property="schema:accessibilityFeature">alternativeText</meta><meta property="schema:accessibilityFeature">readingOrder</meta><meta property="schema:accessibilityFeature">structuralNavigation</meta><meta property="schema:accessibilityFeature">tableOfContents</meta><meta property="schema:accessibilityHazard">none</meta><meta property="schema:accessibilitySummary">${tr('Texte redistribuable, navigation structurée, tableaux, sources cliquables et descriptions alternatives. Quarante infographies avec deux compositions hors ligne chacune. Agrandissement et choix de couleurs selon la liseuse.','Reflowable text, structured navigation, tables, linked sources and text alternatives. Forty infographics with two offline compositions each. Enlargement and colour preferences depend on the reading app.')}</meta></metadata>
<manifest><item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/><item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/><item id="css" href="styles/stylesheet1.css" media-type="text/css"/><item id="cover-image" href="media/cover.jpg" media-type="image/jpeg" properties="cover-image"/><item id="cover" href="text/cover.xhtml" media-type="application/xhtml+xml"/><item id="title" href="text/title_page.xhtml" media-type="application/xhtml+xml"/>${extra.concat(sections).map(id=>`<item id="${id}" href="text/${id}.xhtml" media-type="application/xhtml+xml"/>`).join('')}${attachments.map((a,i)=>`<item id="fig-${i}" href="media/${a.name}" media-type="image/svg+xml"/>`).join('')}${debtFontFiles.map((f,i)=>`<item id="font-${i}" href="fonts/${f}" media-type="font/ttf"/>`).join('')}${['dejavu','liberation'].map(f=>`<item id="licence-${f}" href="fonts/${f}-LICENSE.txt" media-type="text/plain"/>`).join('')}</manifest>
<spine toc="ncx"><itemref idref="cover"/><itemref idref="half_title"/><itemref idref="title"/><itemref idref="nav"/><itemref idref="method"/>${sections.slice(0,-1).map(id=>`<itemref idref="${id}"/>`).join('')}<itemref idref="glossary"/><itemref idref="figures"/><itemref idref="ch010"/>${attachments.map((a,i)=>`<itemref idref="fig-${i}" linear="no"/>`).join('')}</spine></package>`);
  console.log(`${book.title} (${theme}): seven articles, ${book.figureCount} figures, ${attachments.length} original offline SVG compositions.`);
}
if (process.argv[1] && resolve(process.argv[1])===new URL(import.meta.url).pathname) for (const lang of ['fr','en']) for (const theme of ['dark','light']) await generateDebtEpub(lang,theme);
