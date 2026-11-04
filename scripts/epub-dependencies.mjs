import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkMdx from 'remark-mdx';

const extensions = ['.mjs', '.js', '.ts', '.tsx', '.jsx', '.astro', '.json'];
const markdown = unified().use(remarkParse).use(remarkMdx);

function checkedPath(root, name) {
  if (!name || path.isAbsolute(name) || name.includes('\\') || name.split('/').some(part => !part || part === '.' || part === '..')) throw new Error('Unsafe EPUB dependency path');
  let file = root;
  for (const part of name.split('/')) {
    file = path.join(file, part);
    if (fs.lstatSync(file).isSymbolicLink()) throw new Error(`Symlink in EPUB dependency: ${name}`);
  }
  return file;
}

function readSource(root, name) {
  const fd = fs.openSync(checkedPath(root, name), fs.constants.O_RDONLY | fs.constants.O_NOFOLLOW | fs.constants.O_NONBLOCK);
  try {
    const before = fs.fstatSync(fd);
    if (!before.isFile() || before.nlink !== 1 || before.size > 4 * 1024 * 1024) throw new Error(`Unsafe EPUB dependency: ${name}`);
    const source = fs.readFileSync(fd, 'utf8');
    const after = fs.fstatSync(fd);
    if (before.size !== after.size || before.mtimeMs !== after.mtimeMs || before.ctimeMs !== after.ctimeMs) throw new Error(`EPUB dependency changed while reading: ${name}`);
    return source;
  } finally { fs.closeSync(fd); }
}

// Trace executable imports without evaluating generators or article components.
// Literal glob families are hashed as directories, so adding/removing a figure
// within the family invalidates its book. Unsupported dynamic imports fail closed.
export function epubDependencyClosure(root, entries) {
  const found = new Set();
  const resolve = (from, specifier, glob = false) => {
    if (typeof specifier !== 'string' || specifier.includes('\\') || specifier.includes('\0')) throw new Error(`Unsupported EPUB dependency in ${from}`);
    if (!specifier.startsWith('.')) {
      if (specifier.startsWith('/') || specifier.startsWith('#')) throw new Error(`Unsupported EPUB dependency in ${from}: ${specifier}`);
      return; // Installed package contents are covered by the lockfile/runtime.
    }
    const clean = specifier.split('?')[0];
    const prefix = glob ? clean.slice(0, clean.search(/[*{[!]/u) < 0 ? clean.length : clean.search(/[*{[!]/u)) : clean;
    const globDirectory = prefix.endsWith('/') ? prefix.slice(0, -1) : path.posix.dirname(prefix);
    const dependency = path.posix.normalize(path.posix.join(path.posix.dirname(from), glob ? globDirectory : prefix));
    if (dependency === '.' || dependency.startsWith('../') || path.posix.isAbsolute(dependency)) throw new Error(`EPUB dependency leaves project: ${from}`);
    if (glob) {
      const file = checkedPath(root, dependency);
      if (!fs.statSync(file).isDirectory()) throw new Error(`Invalid EPUB glob in ${from}`);
      found.add(dependency);
      return;
    }
    const candidates = [dependency, ...extensions.map(extension => `${dependency}${extension}`), ...extensions.map(extension => `${dependency}/index${extension}`)]
      .filter(name => { try { return fs.lstatSync(path.join(root, name)).isFile() || fs.lstatSync(path.join(root, name)).isSymbolicLink(); } catch (error) { if (error.code === 'ENOENT' || error.code === 'ENOTDIR') return false; throw error; } });
    if (candidates.length !== 1) throw new Error(`Missing or ambiguous EPUB import in ${from}: ${specifier}`);
    visit(candidates[0]);
  };
  const scan = (name, text) => {
    const ast = ts.createSourceFile(name, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const string = node => node && (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) ? node.text : null;
    const walk = node => {
      if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier) resolve(name, string(node.moduleSpecifier));
      if (ts.isCallExpression(node)) {
        const callee = node.expression.getText(ast);
        if (callee === 'import' || callee === 'require') resolve(name, string(node.arguments[0]));
        if (callee === 'import.meta.glob' || callee === 'import.meta.globEager') {
          const argument = node.arguments[0];
          const patterns = argument && ts.isArrayLiteralExpression(argument) ? [...argument.elements] : [argument];
          for (const pattern of patterns) {
            const literal = string(pattern);
            if (!literal || !literal.startsWith('.')) throw new Error(`Unsupported EPUB glob in ${name}`);
            resolve(name, literal, true);
          }
        }
      }
      ts.forEachChild(node, walk);
    };
    walk(ast);
  };
  const visit = name => {
    if (found.has(name)) return;
    if (found.size >= 4096) throw new Error('EPUB import graph exceeds budget');
    checkedPath(root, name);
    found.add(name);
    if (!/\.(?:mjs|js|ts|tsx|jsx|astro|mdx?)$/u.test(name)) return;
    const source = readSource(root, name);
    if (/\.mdx?$/u.test(name)) {
      const body = source.replace(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/u, '');
      // Ordinary Markdown is not executable; MDX exposes its ESM as AST nodes.
      if (name.endsWith('.mdx')) {
        const tree = markdown.parse(body);
        const walk = node => { if (node.type === 'mdxjsEsm') scan(name, node.value); for (const child of node.children ?? []) walk(child); };
        walk(tree);
      }
    } else if (name.endsWith('.astro')) {
      const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/u);
      if (source.startsWith('---') && !frontmatter) throw new Error(`Unsupported Astro frontmatter in ${name}`);
      if (frontmatter) scan(name, frontmatter[1]);
      for (const script of source.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gu)) {
        const src = script[1].match(/\bsrc=["']([^"']+)["']/u);
        if (src) resolve(name, src[1]);
        scan(name, script[2]);
      }
    } else scan(name, source);
  };
  for (const entry of entries) visit(entry);
  return [...found].sort();
}
