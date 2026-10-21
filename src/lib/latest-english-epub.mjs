import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, statSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';
import { XMLParser } from 'fast-xml-parser';
import sharp from 'sharp';

const parser = new XMLParser({ ignoreAttributes: false, removeNSPrefix: true, parseTagValue: false });
const list = (value) => value == null ? [] : Array.isArray(value) ? value : [value];
const text = (value) => {
  const content = typeof value === 'string' ? value : value?.['#text'];
  return typeof content === 'string' ? content.trim() : '';
};

function readMetadataEntry(archive, entry) {
  // unzip reads a named entry without extracting files or invoking a shell.
  // Reject traversal and unzip pattern syntax, including OPF paths from the archive.
  if (typeof entry !== 'string' || !/^[a-zA-Z0-9_.-]+(?:\/[a-zA-Z0-9_.-]+)*$/.test(entry)
      || entry.split('/').some((part) => part === '.' || part === '..') || entry.startsWith('-')) {
    throw new Error(`Unsafe metadata entry in EPUB: ${basename(archive)}`);
  }
  let xml;
  try {
    xml = execFileSync('unzip', ['-p', archive, entry], {
      encoding: 'utf8', maxBuffer: 512 * 1024, timeout: 5000, stdio: ['ignore', 'pipe', 'pipe'],
    });
  } catch {
    throw new Error(`Cannot read EPUB metadata: ${basename(archive)}`);
  }
  if (/<!DOCTYPE|<!ENTITY/iu.test(xml)) throw new Error(`Unsupported XML declarations in EPUB: ${basename(archive)}`);
  return parser.parse(xml, true);
}

function metadata(archive) {
  const container = readMetadataEntry(archive, 'META-INF/container.xml');
  const root = list(container.container?.rootfiles?.rootfile)
    .find((entry) => entry['@_media-type'] === 'application/oebps-package+xml');
  if (!root) throw new Error(`Missing OPF package in EPUB: ${basename(archive)}`);
  const data = readMetadataEntry(archive, root['@_full-path']).package?.metadata;
  if (!data) throw new Error(`Missing EPUB metadata: ${basename(archive)}`);
  return data;
}

/** Discover actual downloads. dc:date is first publication; modified dates and file mtimes never reorder books. */
export async function getLatestEnglishEpub({
  publicDirectory = resolve('public'),
  pagesDirectory = resolve('src/pages/en/publications'),
  now = new Date(),
} = {}) {
  if (!Number.isFinite(now.getTime())) throw new Error('Invalid publication selection date');
  const today = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Paris', year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(now);
  const directory = join(publicDirectory, 'publications');
  const candidates = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith('.epub')) continue;
    const file = join(directory, entry.name);
    const data = metadata(file);
    if (!list(data.language).some((language) => /^en(?:-|$)/i.test(text(language)))) continue;
    const date = text(data.date);
    const published = new Date(`${date}T00:00:00Z`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(published.getTime())
        || published.toISOString().slice(0, 10) !== date) {
      throw new Error(`Invalid first-publication date in EPUB: ${entry.name}`);
    }
    if (date > today) continue;
    let source;
    try { source = new URL(text(data.source)); } catch { throw new Error(`Missing canonical publication URL in EPUB: ${entry.name}`); }
    const match = source.pathname.match(/^\/en\/publications\/([a-z0-9]+(?:-[a-z0-9]+)*)\/$/);
    if (source.origin !== 'https://l0g.fr' || source.username || source.password || source.search || source.hash || !match) {
      throw new Error(`Invalid English publication URL in EPUB: ${entry.name}`);
    }
    const title = text(data.title);
    const description = text(data.description);
    if (!title || !description) throw new Error(`Missing title or description in EPUB: ${entry.name}`);
    candidates.push({ title, description, date, path: source.pathname, slug: match[1], epub: `/publications/${encodeURIComponent(entry.name)}`, bytes: statSync(file).size });
  }
  candidates.sort((a, b) => b.date.localeCompare(a.date) || a.epub.localeCompare(b.epub, 'en'));
  const latest = candidates[0];
  if (!latest) return null;

  // A new book must have its landing page and artwork, rather than silently keeping an older feature.
  if (![join(pagesDirectory, `${latest.slug}.astro`), join(pagesDirectory, latest.slug, 'index.astro')].some(existsSync)) {
    throw new Error(`Missing landing page for latest English EPUB: ${latest.slug}`);
  }
  const cover = ['jpg', 'png', 'webp'].map((extension) => `/publications/${latest.slug}-cover.${extension}`)
    .find((path) => existsSync(join(publicDirectory, path)));
  if (!cover) throw new Error(`Missing cover for latest English EPUB: ${latest.slug}`);
  const { width, height } = await sharp(join(publicDirectory, cover)).metadata();
  if (!width || !height) throw new Error(`Invalid cover dimensions for latest English EPUB: ${latest.slug}`);
  const coverStem = cover.replace(/\.[^.]+$/, '');
  const srcset = [320, 640, 960].filter((size) => existsSync(join(publicDirectory, `${coverStem}-${size}.webp`)))
    .map((size) => `${coverStem}-${size}.webp ${size}w`).join(', ');
  return { ...latest, cover, width, height, srcset };
}
