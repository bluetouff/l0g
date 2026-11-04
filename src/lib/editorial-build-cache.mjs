import { createHash } from 'node:crypto';
import { lstatSync, readFileSync, realpathSync } from 'node:fs';
import { dirname, extname, isAbsolute, relative, resolve, sep } from 'node:path';
import ts from 'typescript';
import { buildDateKey } from './build-clock.mjs';

const hash = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const published = entries => entries.filter(entry => !entry.data.draft);
const title = entry => entry ? { id: entry.id, title: entry.data.title } : null;
const entryState = entry => entry ? { id: entry.id, data: entry.data, body: entry.body ?? '' } : null;
const route = (collection, id) => `/${collection.startsWith('guides') ? 'guides' : 'analysis'}/${id}/`;

/** Data read outside render(entry) is not tracked by Astro's content hash.
 * Keep exactly the translation and curated reading dependencies, not a hash of
 * the whole corpus: publishing an independent entry must preserve other pages.
 */
export function relatedReadingState(collection, id, collections, config) {
  const { paths, frenchDossiers, englishLinks, suggestions } = config;
  const posts = published(collections.posts), postsEn = published(collections.postsEn);
  const guides = published(collections.guides), guidesEn = published(collections.guidesEn);
  const french = collection === 'posts' || collection === 'guides';
  const guide = collection.startsWith('guides');
  if (!french) {
    const currentRoute = `/en${route(collection, id)}`;
    const path = paths.find(item => (guide ? item.guideIds : item.analysisIds).includes(id));
    const neighbours = (path?.analysisIds ?? []).filter(slug => guide || slug !== id)
      .map(slug => postsEn.find(entry => entry.id === slug)).filter(Boolean).slice(0, 3).map(title);
    const requested = [
      ...englishLinks.filter(link => link.from === currentRoute).map(link => link.to),
      ...(!guide ? suggestions(id, 'en').map(link => link.href) : []),
    ];
    return { neighbours, requested: requested.map(href => ({ href, target: title(
      (href.startsWith('/en/analysis/') ? postsEn : guidesEn).find(entry => entry.id === href.split('/').filter(Boolean).at(-1)),
    ) })) };
  }
  const english = (guide ? guidesEn : postsEn).find(entry => entry.data[guide ? 'sourceGuide' : 'sourceArticle'] === id);
  const frenchTarget = (englishId, kind) => {
    const en = (kind === 'guides' ? guidesEn : postsEn).find(entry => entry.id === englishId);
    const fr = (kind === 'guides' ? guides : posts).find(entry => entry.id === en?.data[kind === 'guides' ? 'sourceGuide' : 'sourceArticle']);
    return { english: en ? { id: en.id, source: en.data[kind === 'guides' ? 'sourceGuide' : 'sourceArticle'] } : null, french: title(fr) };
  };
  // FrenchRelatedReading resolves these curated paths before choosing the
  // current one. Preserve that missing-target validation even for another page.
  const selectedPaths = paths.filter(item => frenchDossiers.some(dossier => dossier.id === item.id));
  const resolvedPaths = selectedPaths.map(path => ({ id: path.id,
    analyses: path.analysisIds.map(slug => frenchTarget(slug, 'posts')),
    guides: path.guideIds.map(slug => frenchTarget(slug, 'guides')),
  }));
  const ownPath = resolvedPaths.find(path => (guide ? path.guides : path.analyses).some(item => item.french?.id === id));
  const selectedRoutes = new Set(selectedPaths.flatMap(path => [
    ...path.analysisIds.map(slug => `/en/analysis/${slug}/`),
    ...path.guideIds.map(slug => `/en/guides/${slug}/`),
  ]));
  const ownEnglishRoute = english ? `/en${route(collection, english.id)}` : null;
  const requested = englishLinks.filter(link => link.from === ownEnglishRoute && (ownPath || selectedRoutes.has(link.to)))
    .map(link => ({ href: link.to, target: frenchTarget(link.to.split('/').filter(Boolean).at(-1), link.to.startsWith('/en/guides/') ? 'guides' : 'posts') }));
  const curated = !guide ? suggestions(id, 'fr').map(link => ({ href: link.href, target: title(posts.find(entry => entry.id === link.id)) })) : [];
  return { resolvedPaths, requested, curated };
}

export function editorialCacheKey(collection, entry, collections, config, now) {
  const french = collection === 'posts' || collection === 'guides';
  const guide = collection.startsWith('guides');
  const translation = french
    ? published(collections[guide ? 'guidesEn' : 'postsEn']).find(candidate => candidate.data[guide ? 'sourceGuide' : 'sourceArticle'] === entry.id)
    : collections[guide ? 'guides' : 'posts'].find(candidate => candidate.id === entry.data[guide ? 'sourceGuide' : 'sourceArticle']);
  const counterpart = french ? (translation ? { id: translation.id } : null)
    : (translation ? { id: translation.id, updated: translation.data.updatedDate ?? translation.data.pubDate } : null);
  return hash({ version: 1, collection, entry: entryState(entry), counterpart,
    related: relatedReadingState(collection, entry.id, collections, config),
    time: buildDateKey([entry.data.updatedDate ?? entry.data.pubDate], now),
  });
}

export function glossaryCacheKey(entry, dependencies, freshnessDate, now) {
  return hash({ version: 1, entry, dependencies, time: buildDateKey(freshnessDate ? [freshnessDate] : [], now) });
}

const staticExtensions = new Set(['.svg', '.json', '.css', '.png', '.jpg', '.jpeg', '.webp', '.avif', '.woff', '.woff2', '.ttf']);
const executableExtensions = ['.astro', '.ts', '.tsx', '.js', '.mjs', '.jsx', '.mdx'];
const runtimeIdentifiers = new Set([
  'fetch', 'require', 'eval', 'Function', 'getCollection', 'getEntry', 'getEntries',
  'Date', 'Intl', 'XMLHttpRequest', 'WebSocket', 'global', 'globalThis', 'Bun', 'Deno',
  'crypto', 'performance', 'Reflect', 'process', 'random', 'randomUUID',
]);

function staticImports(source, filename) {
  // Preserve executable Astro frontmatter. Only MDX's YAML metadata is removed.
  if (extname(filename) === '.mdx') source = source.replace(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/u, '');
  if (extname(filename) === '.astro') source = source.replace(/^---\r?\n/u, '\n').replace(/\r?\n---(?:\r?\n|$)/u, '\n');
  const tree = ts.createSourceFile(filename, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const imports = [], importPositions = new Set(), typeOnly = [];
  function visit(node) {
    if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) {
      if (ts.isImportDeclaration(node)) importPositions.add(node.getStart(tree));
      if (node.isTypeOnly || node.importClause?.isTypeOnly) typeOnly.push([node.getStart(tree), node.end]);
      else if (node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) imports.push(node.moduleSpecifier.text);
    }
    ts.forEachChild(node, visit);
  }
  visit(tree);
  // The compiler understands comments and quoted module specifiers. A second
  // lexical pass rejects unknown imports, aliases of clock/global objects and
  // runtime identifiers even in MDX fragments that are not complete TSX files.
  // Strings and comments are skipped by TypeScript's scanner, not regex edits.
  const scanner = ts.createScanner(ts.ScriptTarget.Latest, true, ts.LanguageVariant.JSX, source);
  for (let token = scanner.scan(); token !== ts.SyntaxKind.EndOfFileToken; token = scanner.scan()) {
    const position = scanner.getTokenPos();
    if (typeOnly.some(([start, end]) => position >= start && position < end)) continue;
    if (token === ts.SyntaxKind.ImportKeyword && !importPositions.has(position)) return null;
    const word = token === ts.SyntaxKind.Identifier ? scanner.getTokenValue() : scanner.getTokenText();
    if (runtimeIdentifiers.has(word)) return null;
  }
  return imports;
}

/** Conservative cache eligibility, not a sandbox or an MDX security validator.
 * Ordinary Markdown is static. Known runtime I/O, collection reads and clock or
 * random inputs in MDX's local import tree opt out of reuse. This is a cautious
 * source heuristic, not a proof that arbitrary JavaScript is pure. Unknown
 * packages and unresolved imports rerender normally; full/warm output equality
 * tests cover the actual supported corpus.
 */
export function createStaticEntryEligibility(root = process.cwd()) {
  const base = realpathSync(root), results = new Map();
  function ordinaryFile(file) {
    const rel = relative(base, file);
    if (!rel || isAbsolute(rel) || rel === '..' || rel.startsWith(`..${sep}`)) return false;
    let current = base;
    for (const part of rel.split(sep)) {
      current = resolve(current, part);
      let stat;
      try { stat = lstatSync(current); } catch { return false; }
      if (stat.isSymbolicLink()) return false;
      if (current === file && !stat.isFile()) return false;
    }
    return true;
  }
  function visit(file, pending = new Set()) {
    if (results.has(file)) return results.get(file);
    if (pending.has(file)) return true;
    if (!ordinaryFile(file)) return false;
    if (staticExtensions.has(extname(file))) return true;
    if (!executableExtensions.includes(extname(file))) return false;
    const imports = staticImports(readFileSync(file, 'utf8'), file);
    if (imports === null) return false;
    const next = new Set(pending).add(file);
    const safe = imports.every(specifier => {
      if (!specifier.startsWith('.')) return false;
      const [name, query] = specifier.split('?');
      if (query && query !== 'raw' && query !== 'url') return false;
      const target = resolve(dirname(file), name);
      const candidates = [target, ...executableExtensions.map(extension => target + extension), ...executableExtensions.map(extension => resolve(target, 'index' + extension))];
      const resolved = candidates.find(ordinaryFile);
      return resolved !== undefined && ((query === 'raw' || query === 'url') || visit(resolved, next));
    });
    // Only memoize complete root traversals. A positive intermediate result
    // inside A -> B -> A does not yet know whether A has another unsafe import.
    if (pending.size === 0) results.set(file, safe);
    return safe;
  }
  return entry => {
    if (typeof entry.filePath !== 'string') return false;
    const file = resolve(base, entry.filePath);
    if (extname(file) === '.md') return ordinaryFile(file);
    return visit(file);
  };
}
