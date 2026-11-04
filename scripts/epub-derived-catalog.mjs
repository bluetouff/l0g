import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import { epubDependencyClosure } from './epub-dependencies.mjs';
import { oilPublication, oilChapters } from '../src/config/oil-publication.mjs';
import { oilPublicationEn, oilChaptersEn } from '../src/config/oil-publication-en.mjs';
import { scpiEditions } from '../src/config/scpi-publication.mjs';
import { commerceTracesBook, commerceTracesChapters } from '../src/config/commerce-traces-publication.mjs';
import { recouvrementBook, recouvrementChapters } from '../src/config/ia-recouvrement-publication.mjs';
import { recouvrementBookEn, recouvrementChaptersEn } from '../src/config/ia-recouvrement-publication-en.mjs';
import { slowdownEditions } from '../src/config/ai-slowdown-publication.mjs';
import { reservesEditions } from '../src/config/reserves-publication.mjs';
import { microsoftEditions } from '../src/config/microsoft-publication.mjs';
import { debtEditions } from '../src/config/debt-publication.mjs';
import { cyberRecoveryEditions } from '../src/config/cyber-recovery-publication.mjs';
import { insurancePromiseEditions } from '../src/config/insurance-promise-publication.mjs';
import { cumcumEditions } from '../src/config/cumcum-publication.mjs';
import { ordinaryMachinesEditions } from '../src/config/ordinary-machines-publication.mjs';

const unique = values => [...new Set(values)].sort();
const publication = name => `public/publications/${name}`;
const source = name => `src/epub/${name}`;
const variants = (file, widths) => widths.map(width => file.replace('.jpg', `-${width}.webp`));
const asPublic = value => {
  if (typeof value !== 'string' || !/^\/[a-zA-Z0-9/_-]+\.(?:jpg|png|webp|svg|epub)$/u.test(value) || value.includes('..')) throw new Error('Unsafe EPUB asset path');
  return `public${value}`;
};

// The legacy generators keep literal chapter arrays in their own source files.
// Parse these arrays without importing (and executing) the generators. An
// expression/spread in a chapter list fails closed instead of hiding an input.
export function literalChapterFiles(root, script, collection, fields) {
  const text = fs.readFileSync(path.join(root, script), 'utf8');
  const ast = ts.createSourceFile(script, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
  let array;
  function visit(node) {
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.name.text === collection) {
      if (array || !node.initializer) throw new Error(`Unsupported chapter list in ${script}`);
      let value = node.initializer;
      if (ts.isCallExpression(value) && ts.isPropertyAccessExpression(value.expression) && value.expression.name.text === 'map' && value.arguments.length === 1 && ts.isArrowFunction(value.arguments[0])) {
        const mapper = value.arguments[0];
        const body = ts.isParenthesizedExpression(mapper.body) ? mapper.body.expression : mapper.body;
        const parameter = mapper.parameters.length === 1 ? mapper.parameters[0].name : null;
        if (!ts.isObjectLiteralExpression(body) || !parameter || body.properties.some(property => {
          if (property.name && ts.isComputedPropertyName(property.name)) return true;
          if (ts.isSpreadAssignment(property)) return !ts.isIdentifier(parameter) || !ts.isIdentifier(property.expression) || property.expression.text !== parameter.text;
          if (!ts.isPropertyAssignment(property) && !ts.isShorthandPropertyAssignment(property)) return true;
          if (Object.hasOwn(fields, property.name.text)) return !ts.isShorthandPropertyAssignment(property) || !ts.isArrayBindingPattern(parameter) || parameter.elements[0]?.name?.getText(ast) !== property.name.text;
          return false;
        })) throw new Error(`Chapter mapper changes source filenames in ${script}`);
        value = value.expression.expression;
      }
      if (!ts.isArrayLiteralExpression(value)) throw new Error(`Unsupported chapter list in ${script}`);
      array = value;
    }
    ts.forEachChild(node, visit);
  }
  visit(ast);
  if (!array?.elements.length) throw new Error(`Missing chapter list in ${script}`);
  return array.elements.flatMap(element => {
    if (ts.isArrayLiteralExpression(element) && Object.keys(fields).length === 1 && fields.file && ts.isStringLiteral(element.elements[0])) {
      const file = element.elements[0].text;
      if (!/^[a-z0-9-]+\.mdx?$/u.test(file)) throw new Error(`Unsafe chapter filename in ${script}`);
      return [`src/content/${fields.file}/${file}`];
    }
    if (!ts.isObjectLiteralExpression(element) || element.properties.some(property => !ts.isPropertyAssignment(property) || ts.isComputedPropertyName(property.name))) throw new Error(`Unsupported chapter in ${script}`);
    return Object.entries(fields).map(([key, directory]) => {
      const matches = element.properties.filter(property => ts.isPropertyAssignment(property) && (ts.isIdentifier(property.name) || ts.isStringLiteral(property.name)) && property.name.text === key);
      if (matches.length !== 1 || !ts.isStringLiteral(matches[0].initializer)) throw new Error(`Missing literal ${key} in ${script}`);
      const file = matches[0].initializer.text;
      if (!/^[a-z0-9-]+\.mdx?$/u.test(file)) throw new Error(`Unsafe chapter filename in ${script}`);
      return `src/content/${directory}/${file}`;
    });
  });
}

// Only the local font files read by the book renderers. Article-specific font
// families added elsewhere under public/fonts do not affect existing books.
const bookFontInputs = [
  'public/fonts/jlr/LICENSE-inter.txt', 'public/fonts/jlr/LICENSE-jetbrains-mono.txt',
  ...['stablecoins', 'cumcum', 'cumcum04', 'cumcum05', 'cumcum06'].flatMap(directory =>
    ['dejavu-sans-400.ttf', 'dejavu-sans-700.ttf', 'LICENSE.txt'].map(file => `public/fonts/${directory}/${file}`)),
];
const sharedInputs = [
  'package.json', 'package-lock.json', 'src/publication-text', 'src/epub-assets',
  ...bookFontInputs, 'node_modules/@fontsource', 'node_modules/@fontsource-variable',
  // Authored source book reused as the older editions' container/style template.
  'src/epub/l-argent-d-epstein',
];

export function epubDerivedTasks(root) {
  const groups = [];
  const infrastructure = epubDependencyClosure(root, ['scripts/derived-assets.mjs', 'scripts/build-epub.mjs']);
  const add = ({ name, generators = [], books, chapters = [], assets = [], outputs = [], extraInputs = [] }) => {
    for (const file of chapters) if (!fs.existsSync(path.join(root, file))) throw new Error(`Missing EPUB source article: ${file}`);
    const dependencies = epubDependencyClosure(root, [...generators, ...chapters, ...extraInputs.filter(file => /\.(?:mjs|js|ts|astro)$/u.test(file))]);
    const inputPaths = unique([...sharedInputs, ...infrastructure, ...dependencies, ...assets, ...extraInputs]);
    const outputPaths = unique([...books.flatMap(book => [...(generators.length ? [source(book.directory)] : []), publication(book.file)]), ...outputs]);
    groups.push({
      name: `epub-${name}`, generators, books: books.map(book => book.directory),
      inputs: inputPaths, outputs: outputPaths,
      // The English digital-euro cover is an explicit existing input which its
      // override may regenerate. Its final bytes participate in input identity.
      stableInputs: inputPaths.filter(file => !outputPaths.includes(file)),
      snapshot: true,
    });
  };
  const legacy = (name, entries) => {
    add({ name, generators: entries.map(entry => entry.script), books: entries,
      chapters: entries.flatMap(entry => literalChapterFiles(root, entry.script, entry.collection ?? 'articles', entry.fields ?? { file: entry.lang === 'en' ? 'posts-en' : 'posts' })),
      assets: entries.flatMap(entry => entry.assets ?? []),
      outputs: entries.flatMap(entry => entry.outputs ?? []),
    });
  };
  add({name:'epstein-fr',books:[{directory:'l-argent-d-epstein',file:'l-argent-d-epstein-l0g.epub'}]});
  add({name:'opacity',books:[{directory:'auditer-l-opacite',file:'auditer-l-opacite-bluetouff.epub'}],extraInputs:['src/epub/auditer-l-opacite']});
  legacy('epstein-en',[{script:'scripts/generate-epstein-english-epub.mjs',lang:'en',directory:'epsteins-money',file:'epsteins-money-l0g.epub',outputs:['epsteins-money-cover.png','epsteins-money-infographic-1.svg','epsteins-money-infographic-2.svg'].map(publication)}]);
  legacy('digital-euro',[
    {script:'scripts/generate-digital-euro-epub.mjs',lang:'fr',directory:'euro-numerique',file:'euro-numerique-enquete-l0g.epub',outputs:[publication('euro-numerique-cover.png')]},
    {script:'scripts/generate-digital-euro-english-epub.mjs',lang:'en',directory:'digital-euro',file:'digital-euro-investigation-l0g.epub',assets:[publication('digital-euro-cover.png')],outputs:[publication('digital-euro-cover.png')]},
  ]);
  legacy('water-electricity',[
    {script:'scripts/generate-water-electricity-epub.mjs',lang:'fr',directory:'eau-electricite',file:'eau-electricite-europe-l0g.epub',outputs:[publication('eau-electricite-cover.png')]},
    {script:'scripts/generate-water-electricity-english-epub.mjs',lang:'en',directory:'water-electricity',file:'water-electricity-europe-l0g.epub',outputs:[publication('water-electricity-cover.png')]},
  ]);
  add({name:'invoicing',generators:['scripts/generate-e-invoicing-epub.mjs','scripts/generate-e-invoicing-english-epub.mjs'],
    books:[{directory:'grand-peage-facture',file:'grand-peage-facture-enquete-l0g.epub'},{directory:'great-e-invoicing-toll',file:'great-e-invoicing-toll-investigation-l0g.epub'}],
    chapters:literalChapterFiles(root,'scripts/generate-e-invoicing-epub-lib.mjs','sharedArticles',{frFile:'posts',enFile:'posts-en'}),
    outputs:['grand-peage-facture-cover.png','great-e-invoicing-toll-cover.png'].map(publication),
  });
  legacy('digital-identity',[{script:'scripts/generate-digital-identity-epub.mjs',lang:'fr',directory:'votre-identite-dans-un-telephone',file:'votre-identite-dans-un-telephone-enquete-l0g.epub',outputs:[publication('votre-identite-dans-un-telephone-cover.jpg')]}]);

  function modern(name, generator, editions, options = {}) {
    const chapters = [], assets = [], outputs = [], books = [], extraInputs = [];
    for (const book of Object.values(editions)) {
      const lang = book.lang ?? (book.path.startsWith('/en/') ? 'en' : 'fr');
      for (const chapter of book.chapters) {
        const directory = lang === 'en' ? 'posts-en' : 'posts';
        const candidates = ['md','mdx'].map(extension => `src/content/${directory}/${chapter.slug}.${extension}`).filter(file => fs.existsSync(path.join(root,file)));
        if (candidates.length !== 1) throw new Error(`Ambiguous or missing EPUB chapter: ${chapter.slug}`);
        chapters.push(candidates[0]);
        if (chapter.image) assets.push(asPublic(chapter.image));
        if (chapter.infographicDirectory) {
          if (!/^[a-z0-9-]+$/u.test(chapter.infographicDirectory)) throw new Error('Unsafe EPUB infographic directory');
          assets.push(`public/infographies/${chapter.infographicDirectory}`);
        }
        if (chapter.component) {
          if (!/^[A-Za-z][A-Za-z0-9]*$/u.test(chapter.component)) throw new Error('Unsafe EPUB chapter component');
          extraInputs.push(`src/components/${chapter.component}.astro`);
        }
      }
      for (const edition of book.editions ?? [book]) books.push({directory:edition.directory,file:edition.epub.split('/').at(-1)});
      if (options.coverInput) assets.push(asPublic(book.cover));
      else outputs.push(asPublic(book.cover), ...variants(asPublic(book.cover), [320,640,960]));
      if (options.social) outputs.push(asPublic(book.social));
      if (options.panorama) outputs.push(asPublic(book.panorama), ...variants(asPublic(book.panorama),[640,960,1600]));
    }
    add({name,generators:[generator],books,chapters,assets,extraInputs,outputs:[...outputs,...(options.outputs??[])]});
  }
  modern('oil','scripts/generate-oil-epub.mjs',{fr:{...oilPublication,lang:'fr',directory:'les-banquiers-du-baril',chapters:oilChapters},en:{...oilPublicationEn,lang:'en',directory:'banking-on-oil',chapters:oilChaptersEn}},{social:true});
  modern('scpi','scripts/generate-scpi-epub.mjs',scpiEditions,{social:true});
  modern('commerce','scripts/generate-commerce-traces-epub.mjs',{fr:{...commerceTracesBook,lang:'fr',directory:'le-commerce-de-nos-traces',chapters:commerceTracesChapters}},{social:true,panorama:true,outputs:['commerce-traces-apercu-profils.svg','commerce-traces-apercu-copies.svg'].map(publication)});
  modern('collection','scripts/generate-ia-recouvrement-epub.mjs',{fr:{...recouvrementBook,lang:'fr',chapters:recouvrementChapters},en:{...recouvrementBookEn,lang:'en',chapters:recouvrementChaptersEn}},{social:true,panorama:true,outputs:['ia-recouvrement-apercu-correction.svg','ia-recouvrement-apercu-delais.svg','ai-debt-collection-preview-correction.svg','ai-debt-collection-preview-deadlines.svg'].map(publication)});
  modern('slowdown','scripts/generate-ai-slowdown-epub.mjs',slowdownEditions,{social:true,panorama:true,outputs:['le-prix-du-ralentissement-apercu-attente.svg','le-prix-du-ralentissement-apercu-garantie.svg','the-price-of-slowing-down-preview-waiting.svg','the-price-of-slowing-down-preview-guarantee.svg'].map(publication)});
  modern('reserves','scripts/generate-reserves-epub.mjs',reservesEditions,{panorama:true});
  modern('microsoft','scripts/generate-microsoft-epub.mjs',microsoftEditions,{panorama:true});
  modern('debt','scripts/generate-debt-epub.mjs',debtEditions,{panorama:true});
  modern('cyber','scripts/generate-cyber-recovery-epub.mjs',cyberRecoveryEditions);
  modern('insurance','scripts/generate-insurance-epub.mjs',insurancePromiseEditions);
  modern('cumcum','scripts/generate-cumcum-epub.mjs',cumcumEditions,{coverInput:true});
  modern('machines','scripts/generate-ordinary-machines-epub.mjs',ordinaryMachinesEditions,{coverInput:true});
  const owners = new Set();
  for (const group of groups) for (const output of group.outputs) {
    if (owners.has(output)) throw new Error(`EPUB output has multiple owners: ${output}`);
    owners.add(output);
  }
  return groups;
}
