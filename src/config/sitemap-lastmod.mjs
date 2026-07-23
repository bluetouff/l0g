import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));

function filesUnder(relativeDirectory, extensions = new Set(['.md', '.mdx'])) {
  const directory = join(ROOT, relativeDirectory);
  if (!existsSync(directory)) return [];
  const files = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const relativePath = `${relativeDirectory}/${entry.name}`;
    if (entry.isDirectory()) {
      files.push(...filesUnder(relativePath, extensions));
    } else if ([...extensions].some((extension) => entry.name.endsWith(extension))) {
      files.push(relativePath);
    }
  }
  return files.sort();
}

function loadCommittedModificationDates() {
  const output = execFileSync(
    'git',
    [
      'log',
      '--format=@@%cI',
      '--name-only',
      '--',
      'src/pages',
      'src/content',
      'src/config',
      'src/lib',
      'public',
    ],
    { cwd: ROOT, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 }
  );
  const dates = new Map();
  let commitDate = '';
  for (const rawLine of output.split('\n')) {
    const line = rawLine.trim();
    if (line.startsWith('@@')) {
      commitDate = line.slice(2);
    } else if (line && commitDate && !dates.has(line)) {
      dates.set(line, commitDate);
    }
  }
  return dates;
}

const modifiedAt = loadCommittedModificationDates();
const posts = filesUnder('src/content/posts');
const postsEn = filesUnder('src/content/posts-en');
const guides = filesUnder('src/content/guides');
const guidesEn = filesUnder('src/content/guides-en');
const signalData = [
  'public/risk.json',
  'public/debt-latest.json',
  'public/risk-events.json',
  'public/signals-history.ndjson',
];

function addDirectPageSources(paths, pathname) {
  const route = decodeURIComponent(pathname).replace(/^\/|\/$/g, '');
  if (!route) return;
  const base = `src/pages/${route}`;
  for (const candidate of [
    `${base}.astro`,
    `${base}/index.astro`,
  ]) {
    if (existsSync(join(ROOT, candidate))) paths.add(candidate);
  }
}

function addContentSource(paths, directory, slug) {
  for (const extension of ['.md', '.mdx']) {
    const candidate = `${directory}/${slug}${extension}`;
    if (existsSync(join(ROOT, candidate))) paths.add(candidate);
  }
}

function latestCommittedDate(paths, pathname) {
  const dates = [...paths]
    .map((path) => modifiedAt.get(path)
      ?? (existsSync(join(ROOT, path)) ? statSync(join(ROOT, path)).mtime.toISOString() : null))
    .filter(Boolean)
    .sort();
  if (!dates.length) {
    throw new Error(`lastmod éditorial introuvable pour ${pathname} (${[...paths].join(', ') || 'aucune source'})`);
  }
  return dates.at(-1);
}

export function sitemapLastmod(pageUrl) {
  const { pathname } = new URL(pageUrl);
  const paths = new Set();
  addDirectPageSources(paths, pathname);

  if (pathname === '/' || /^\/\d+\/$/.test(pathname)) {
    paths.add('src/pages/[...page].astro');
    posts.forEach((path) => paths.add(path));
  } else if (pathname === '/guides/') {
    guides.forEach((path) => paths.add(path));
    guidesEn.forEach((path) => paths.add(path));
  } else if (pathname === '/en/analysis/' || /^\/en\/analysis\/page\/\d+\/$/.test(pathname)) {
    postsEn.forEach((path) => paths.add(path));
    if (/\/page\//.test(pathname)) paths.add('src/pages/en/analysis/page/[page].astro');
  } else if (pathname === '/en/guides/') {
    guidesEn.forEach((path) => paths.add(path));
  } else if (pathname === '/sujets/' || pathname.startsWith('/sujet/')) {
    paths.add('src/config/topics.ts');
    posts.forEach((path) => paths.add(path));
    if (pathname.startsWith('/sujet/')) paths.add('src/pages/sujet/[slug].astro');
  } else if (pathname === '/glossaire/' || pathname.startsWith('/glossaire/')) {
    paths.add('src/config/glossary.ts');
    paths.add('src/config/glossary-atlas-en.ts');
    if (pathname !== '/glossaire/') paths.add('src/pages/glossaire/[slug].astro');
  } else if (pathname === '/en/glossary/' || pathname.startsWith('/en/glossary/')) {
    paths.add('src/config/glossary.ts');
    paths.add('src/config/glossary-atlas-en.ts');
    if (pathname !== '/en/glossary/') paths.add('src/pages/en/glossary/[slug].astro');
  } else if (pathname === '/methodologie/' || pathname.startsWith('/methodologie/')) {
    paths.add('src/config/methodology.ts');
    if (pathname !== '/methodologie/') paths.add('src/pages/methodologie/[slug].astro');
  } else if (pathname === '/sources/' || pathname.startsWith('/sources/')) {
    paths.add('src/config/primary-sources.ts');
    if (pathname !== '/sources/') paths.add('src/pages/sources/[slug].astro');
  } else if (pathname === '/series/' || pathname.startsWith('/series/')) {
    paths.add('src/config/risk-signals.ts');
    paths.add('src/lib/signal-history.ts');
    signalData.forEach((path) => paths.add(path));
    if (pathname !== '/series/') paths.add('src/pages/series/[slug].astro');
  } else if (['/black-box/', '/risk-diff/', '/backtests/'].includes(pathname)) {
    signalData.forEach((path) => paths.add(path));
    posts.forEach((path) => paths.add(path));
    guides.forEach((path) => paths.add(path));
  } else if (['/donnees/', '/preuves/', '/status/'].includes(pathname)) {
    [
      ...signalData,
      'public/confluence.json',
    ].forEach((path) => paths.add(path));
  } else {
    const matchers = [
      [/^\/posts\/(.+)\/$/, 'src/content/posts', 'src/pages/posts/[...slug].astro'],
      [/^\/guides\/(.+)\/$/, 'src/content/guides', 'src/pages/guides/[...slug].astro'],
      [/^\/en\/analysis\/(.+)\/$/, 'src/content/posts-en', 'src/pages/en/analysis/[...slug].astro'],
      [/^\/en\/guides\/(.+)\/$/, 'src/content/guides-en', 'src/pages/en/guides/[...slug].astro'],
    ];
    for (const [pattern, directory, template] of matchers) {
      const match = pathname.match(pattern);
      if (!match) continue;
      addContentSource(paths, directory, match[1]);
      paths.add(template);
      break;
    }
  }

  return latestCommittedDate(paths, pathname);
}
