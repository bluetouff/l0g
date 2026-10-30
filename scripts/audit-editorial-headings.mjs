import { readdir, readFile } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import { parse } from 'parse5';

const distRoot = join(process.cwd(), 'dist');
const violations = [];

const bannedPatterns = [
  { label: 'opposition ou négation française', regex: /(?<![\p{L}\p{M}\p{N}_])(?:pas|sans|mais|ni|contre)(?![\p{L}\p{M}\p{N}_])/iu },
  { label: 'opposition ou négation anglaise', regex: /(?<![\p{L}\p{M}\p{N}_])(?:not|without|but|versus|neither|nor)(?![\p{L}\p{M}\p{N}_])/iu },
  { label: 'comparaison abrégée', regex: /(?<![\p{L}\p{M}\p{N}_])vs\.?(?![\p{L}\p{M}\p{N}_])/iu },
  { label: 'contraction négative anglaise', regex: /(?<![\p{L}\p{M}\p{N}_])(?:isn|aren|wasn|weren|doesn|don|didn|can|couldn|won|wouldn|shouldn)['’]t(?![\p{L}\p{M}\p{N}_])/iu },
];

function routeFor(path) {
  const file = relative(distRoot, path).split(sep).join('/');
  if (file === 'index.html') return '/';
  if (file.endsWith('/index.html')) return `/${file.slice(0, -'index.html'.length)}`;
  return `/${file.replace(/\.html$/u, '')}`;
}

function isAnalysisRoute(route) {
  return route.startsWith('/posts/') || route.startsWith('/en/analysis/');
}

function nodeText(node) {
  if (node.nodeName === '#text') return node.value ?? '';
  return (node.childNodes ?? []).map(nodeText).join(' ');
}

function inspectNode(node, route, file) {
  if (['h1', 'h2', 'h3'].includes(node.tagName)) {
    const heading = nodeText(node).replace(/\s+/gu, ' ').trim();
    for (const pattern of bannedPatterns) {
      // This exact financial term names the lender's recourse perimeter, not a rhetorical contrast.
      if (route === '/glossaire/financement-sans-recours/' && node.tagName === 'h1' && heading === 'Financement sans recours') continue;
      // This exact share-class term describes voting rights, not a rhetorical contrast.
      if (route === '/glossaire/action-sans-droit-de-vote/' && node.tagName === 'h1' && heading === 'Action sans droit de vote') continue;
      // This exact assessment term names the absence of an aid in an experiment, not a rhetorical contrast.
      if (route === '/glossaire/evaluation-sans-assistance/' && node.tagName === 'h1' && heading === 'Évaluation sans assistance') continue;
      if (pattern.regex.test(heading)) {
        violations.push({ route, file, tag: node.tagName, heading, rule: pattern.label });
        break;
      }
    }
  }

  for (const child of node.childNodes ?? []) inspectNode(child, route, file);
}

async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      await walk(path);
      continue;
    }
    if (!entry.isFile() || !entry.name.endsWith('.html')) continue;

    const route = routeFor(path);
    if (isAnalysisRoute(route)) continue;

    const document = parse(await readFile(path, 'utf8'));
    inspectNode(document, route, relative(distRoot, path));
  }
}

await walk(distRoot);

if (violations.length > 0) {
  console.error(`Titres éditoriaux : ${violations.length} opposition(s) mécanique(s) hors analyses.`);
  for (const violation of violations) {
    console.error(`- ${violation.route} ${violation.tag.toUpperCase()} [${violation.rule}] : ${violation.heading}`);
  }
  process.exit(1);
}

console.log('Titres éditoriaux : aucune opposition mécanique dans les H1, H2 et H3 hors analyses.');
