import { parseFrontmatter } from '@astrojs/markdown-remark';
import { readdir, readFile, rename, unlink, writeFile } from 'node:fs/promises';
import { dirname, extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createAutomatedWeeklyEdition } from '../src/lib/weekly-generation.ts';
import {
  WEEKLY_AUTOMATION,
  addCalendarDays,
  latestDueWeeklyDate,
  weeklyDatesBetween,
  weeklyPublishedAt,
} from '../src/lib/weekly-schedule.ts';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const postsDir = join(root, 'src', 'content', 'posts');
const generatedPath = join(root, 'src', 'config', 'weekly-editions.generated.json');
const args = new Set(process.argv.slice(2));
const mode = args.has('--write') ? 'write' : args.has('--check') ? 'check' : null;
const asOfArg = process.argv.find((arg) => arg.startsWith('--as-of='))?.slice('--as-of='.length);
const asOf = asOfArg || process.env.L0G_WEEKLY_AS_OF || new Date().toISOString();

if (!mode || (args.has('--write') && args.has('--check'))) {
  throw new Error('Utilisation : generate-weekly-editions.mjs --write|--check [--as-of=<ISO>].');
}

async function filesBelow(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await filesBelow(path));
    else if (entry.isFile() && ['.md', '.mdx'].includes(extname(entry.name))) files.push(path);
  }
  return files;
}

function normalizedDate(value, id) {
  const parsed = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(parsed.getTime())) throw new TypeError(`${id}: pubDate invalide.`);
  return parsed.toISOString();
}

function normalizedQuickTake(value, id) {
  if (value === undefined) return undefined;
  if (!value || typeof value !== 'object') throw new TypeError(`${id}: quickTake invalide.`);
  const quickTake = {
    fact: value.fact,
    importance: value.importance,
    uncertainty: value.uncertainty,
  };
  if (Object.values(quickTake).some((item) => typeof item !== 'string' || item.trim().length < 20)) {
    throw new TypeError(`${id}: quickTake incomplet.`);
  }
  return quickTake;
}

async function loadPosts() {
  const posts = [];
  const seen = new Set();
  for (const path of await filesBelow(postsDir)) {
    const id = relative(postsDir, path).replace(/\.(?:md|mdx)$/i, '').replaceAll('\\', '/');
    if (seen.has(id)) throw new Error(`Identifiant d’analyse dupliqué : ${id}.`);
    seen.add(id);
    const source = await readFile(path, 'utf8');
    const { frontmatter } = parseFrontmatter(source);
    if (frontmatter.draft === true) continue;
    if (typeof frontmatter.title !== 'string' || typeof frontmatter.description !== 'string') {
      throw new TypeError(`${id}: title ou description manquant.`);
    }
    posts.push({
      id,
      title: frontmatter.title,
      description: frontmatter.description,
      pubDate: normalizedDate(frontmatter.pubDate, id),
      quickTake: normalizedQuickTake(frontmatter.quickTake, id),
    });
  }
  return posts;
}

function validateExisting(editions) {
  if (!Array.isArray(editions)) throw new TypeError('Le registre Hebdo généré doit être un tableau JSON.');
  const slugs = new Set();
  const issues = new Set();
  editions.forEach((edition, index) => {
    const expectedIssue = WEEKLY_AUTOMATION.firstIssue + index;
    const expectedDate = addCalendarDays(WEEKLY_AUTOMATION.firstEditionDate, index * 7);
    if (edition.issue !== expectedIssue || edition.slug !== expectedDate) {
      throw new Error(`Registre Hebdo non continu à l’index ${index}.`);
    }
    if (edition.publishedAt !== weeklyPublishedAt(expectedDate)) {
      throw new Error(`Date de publication incohérente pour ${edition.slug}.`);
    }
    if (edition.automation?.strategy !== 'published-metadata-v1') {
      throw new Error(`Provenance automatique absente pour ${edition.slug}.`);
    }
    if (slugs.has(edition.slug) || issues.has(edition.issue)) {
      throw new Error(`Édition Hebdo dupliquée : ${edition.slug}.`);
    }
    slugs.add(edition.slug);
    issues.add(edition.issue);
  });
}

const existing = JSON.parse(await readFile(generatedPath, 'utf8'));
validateExisting(existing);
const dueDate = latestDueWeeklyDate(asOf);
const nextDate = existing.length > 0
  ? addCalendarDays(existing.at(-1).slug, 7)
  : WEEKLY_AUTOMATION.firstEditionDate;
const missingDates = dueDate >= nextDate ? weeklyDatesBetween(nextDate, dueDate) : [];

if (missingDates.length === 0) {
  process.stdout.write(`Hebdo automatique à jour jusqu’au ${existing.at(-1)?.slug ?? 'démarrage non atteint'}.\n`);
  process.exit(0);
}

if (mode === 'check') {
  throw new Error(`Hebdo en retard : ${missingDates.join(', ')}.`);
}

const posts = await loadPosts();
const next = [...existing];
for (const editionDate of missingDates) {
  next.push(createAutomatedWeeklyEdition({
    issue: WEEKLY_AUTOMATION.firstIssue + next.length,
    editionDate,
    generatedAt: asOf,
    posts,
  }));
}
validateExisting(next);

const temporaryPath = `${generatedPath}.tmp-${process.pid}`;
try {
  await writeFile(temporaryPath, `${JSON.stringify(next, null, 2)}\n`, { encoding: 'utf8', flag: 'wx' });
  await rename(temporaryPath, generatedPath);
} finally {
  await unlink(temporaryPath).catch(() => {});
}

process.stdout.write(`Hebdo généré : ${missingDates.join(', ')}.\n`);
