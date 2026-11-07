import { createHash } from 'node:crypto';
import { closeSync, constants, fstatSync, openSync, readSync, realpathSync } from 'node:fs';
import { resolve, sep } from 'node:path';

// Bump for every visual/font change: social crawlers must receive a new URL.
export const ARTICLE_SOCIAL_VERSION = 'photo-title-excerpt-v1';
const illustration = /^\/illustrations\/news\/[a-zA-Z0-9][a-zA-Z0-9._-]*\.(?:jpe?g|png|webp)$/u;
const digest = bytes => createHash('sha256').update(bytes).digest('hex');

export function readArticleIllustration(src, publicDirectory = resolve('public')) {
  if (typeof src !== 'string' || !illustration.test(src)) throw new TypeError('Article OG: invalid local illustration.');
  const root = realpathSync(publicDirectory);
  const file = realpathSync(resolve(root, `.${src}`));
  if (!file.startsWith(`${root}${sep}`)) throw new Error('Article OG: illustration outside public directory.');
  const fd = openSync(file, constants.O_RDONLY | constants.O_NOFOLLOW | constants.O_NONBLOCK);
  try {
    const before = fstatSync(fd);
    if (!before.isFile() || before.nlink !== 1 || before.size === 0 || before.size > 8_000_000) throw new Error('Article OG: illustration exceeds file budget.');
    const bytes = Buffer.alloc(before.size + 1);
    let length = 0, count;
    while (length < bytes.length && (count = readSync(fd, bytes, length, bytes.length - length, null)) > 0) length += count;
    const after = fstatSync(fd);
    if (length !== before.size || after.size !== before.size || after.mtimeMs !== before.mtimeMs || after.ctimeMs !== before.ctimeMs) throw new Error('Article OG: illustration changed while reading.');
    const data = bytes.subarray(0, length);
    const jpeg = data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff;
    const png = data.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
    const webp = data.subarray(0, 4).toString() === 'RIFF' && data.subarray(8, 12).toString() === 'WEBP';
    if (!jpeg && !png && !webp) throw new TypeError('Article OG: unsupported raster illustration.');
    return data;
  } finally { closeSync(fd); }
}

function text(value, name, maximum) {
  if (typeof value !== 'string' || !value.trim() || value.length > maximum || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/u.test(value)) throw new TypeError(`Article OG: invalid ${name}.`);
  return value.replace(/\s+/gu, ' ').trim();
}

function excerpt(value, maximum = 160) {
  const points = Array.from(value);
  if (points.length <= maximum) return value;
  const prefix = points.slice(0, maximum - 1).join('');
  const boundary = prefix.lastIndexOf(' ');
  return `${(boundary >= maximum / 2 ? prefix.slice(0, boundary) : prefix).trimEnd()}…`;
}

function publicationDate(value) {
  if (!(value instanceof Date)) {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2}))?$/u.test(value)) throw new TypeError('Article OG: invalid publication date.');
    const calendar = new Date(`${value.slice(0, 10)}T00:00:00Z`);
    if (!Number.isFinite(calendar.getTime()) || calendar.toISOString().slice(0, 10) !== value.slice(0, 10)) throw new TypeError('Article OG: invalid calendar date.');
  }
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) throw new TypeError('Article OG: invalid publication date.');
  return date;
}

/** Only editorial illustrations become composited cards; bespoke OG artwork keeps priority. */
export function articleSocialCard(entry, lang, { publicDirectory } = {}) {
  if (!['fr', 'en'].includes(lang)) throw new TypeError('Article OG: unsupported language.');
  const data = entry?.data;
  if (!data || typeof data !== 'object' || Array.isArray(data)) throw new TypeError('Article OG: missing article metadata.');
  if (data.draft !== undefined && typeof data.draft !== 'boolean') throw new TypeError('Article OG: invalid draft flag.');
  if (data.draft || typeof data.ogImage !== 'string' || !illustration.test(data.ogImage)) return null;
  if (typeof entry.id !== 'string' || entry.id.length > 180 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(entry.id)) throw new TypeError('Article OG: invalid slug.');
  const typography = value => lang === 'fr' ? value.replace(/ +([:;!?])/gu, '\u00a0$1') : value;
  const title = typography(text(data.ogTitle ?? data.title, 'title', 500));
  const description = typography(excerpt(text(data.description, 'description', 4096)));
  const date = publicationDate(data.pubDate);
  const tags = Array.isArray(data.tags) ? data.tags.filter(tag => typeof tag === 'string' && tag.trim()) : [];
  const category = tags.find(tag => /^infrastructures?$/iu.test(tag)) ?? tags[0];
  const label = [lang === 'fr' ? 'ENQUÊTE' : 'INVESTIGATION', category ? excerpt(text(category, 'category', 500), 30).toLocaleUpperCase(lang) : null].filter(Boolean).join(' · ');
  const dateLabel = date.toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-GB', {
    day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Europe/Paris',
  }).toLocaleUpperCase(lang);
  const artworkHash = digest(readArticleIllustration(data.ogImage, publicDirectory));
  const content = { version: ARTICLE_SOCIAL_VERSION, lang, title, description, label, publishedAt: date.toISOString(), dateLabel, illustration: data.ogImage, artworkHash };
  const fingerprint = digest(JSON.stringify(content)).slice(0, 16);
  return { ...content, image: `/og/analysis/${lang}/${entry.id}-${fingerprint}.jpg`, alt: `${title}. ${description} l0g.fr` };
}

/** Artwork bytes are an explicit dependency of cached editorial HTML. */
export function articleSocialCacheKey(key, entry, lang, options) {
  const card = articleSocialCard(entry, lang, options);
  return digest(JSON.stringify({ key, socialImage: card?.image ?? null }));
}
