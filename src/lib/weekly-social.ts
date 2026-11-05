import { createHash } from 'node:crypto';
import { readFileSync, realpathSync, statSync } from 'node:fs';
import { resolve, sep } from 'node:path';
import { isWeeklyIllustration, weeklyCoverTitle } from './weekly-presentation.ts';
import type { WeeklyEdition } from '../config/weekly-editions.ts';

// Bump when the artwork or card composition changes so social crawlers receive
// a new URL, including for an edition they have already cached.
export const WEEKLY_SOCIAL_VERSION = 'magazine-tech-v3';

const dateFormatter = new Intl.DateTimeFormat('fr-FR', {
  day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Paris',
});

export function readWeeklyIllustration(src: string, publicDirectory = resolve('public')) {
  if (!isWeeklyIllustration(src)) throw new TypeError('Hebdo OG : illustration locale invalide.');
  const root = realpathSync(publicDirectory);
  const path = realpathSync(resolve(root, `.${src}`));
  if (!path.startsWith(`${root}${sep}`)) throw new Error('Hebdo OG : illustration hors du dossier public.');
  const stat = statSync(path);
  if (!stat.isFile() || stat.size === 0 || stat.size > 8_000_000) throw new Error('Hebdo OG : illustration hors budget.');
  const bytes = readFileSync(path);
  const jpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  const png = bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  const webp = bytes.subarray(0, 4).toString() === 'RIFF' && bytes.subarray(8, 12).toString() === 'WEBP';
  if (!jpeg && !png && !webp) throw new TypeError('Hebdo OG : format raster invalide.');
  return bytes;
}

export function weeklySocialCard(edition: WeeklyEdition, illustration?: string) {
  if (!edition || typeof edition !== 'object' || Array.isArray(edition)) {
    throw new TypeError('Hebdo OG : édition invalide.');
  }
  if (typeof edition.slug !== 'string' || edition.slug.length > 120
    || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(edition.slug)) {
    throw new TypeError('Hebdo OG : slug invalide.');
  }
  if (!Number.isSafeInteger(edition.issue) || edition.issue < 1) {
    throw new TypeError('Hebdo OG : numéro invalide.');
  }
  if (typeof edition.publishedAt !== 'string'
    || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/.test(edition.publishedAt)) {
    throw new TypeError('Hebdo OG : date de publication invalide.');
  }
  const publicationDate = new Date(edition.publishedAt);
  const calendarDate = new Date(`${edition.publishedAt.slice(0, 10)}T00:00:00Z`);
  if (!Number.isFinite(publicationDate.getTime()) || !Number.isFinite(calendarDate.getTime())
    || calendarDate.toISOString().slice(0, 10) !== edition.publishedAt.slice(0, 10)) {
    throw new TypeError('Hebdo OG : date de publication invalide.');
  }
  const sourceTitle = edition.editorial !== undefined
    ? edition.editorial?.title
    : weeklyCoverTitle(edition);
  if (typeof sourceTitle !== 'string' || !sourceTitle.trim() || sourceTitle.length > 500
    || /[\u0000-\u001f\u007f]/u.test(sourceTitle)) {
    throw new TypeError('Hebdo OG : titre invalide.');
  }
  const title = sourceTitle.trim();
  const issueLabel = `N° ${String(edition.issue).padStart(2, '0')}`;
  const dateLabel = dateFormatter.format(publicationDate).replace(/^1 /, '1er ');
  const artworkHash = illustration === undefined ? null : createHash('sha256').update(readWeeklyIllustration(illustration)).digest('hex');
  const fingerprint = createHash('sha256').update(JSON.stringify({
    version: WEEKLY_SOCIAL_VERSION, title, publishedAt: edition.publishedAt, issue: edition.issue, illustration: illustration ?? null, artworkHash,
  })).digest('hex').slice(0, 12);

  return {
    illustration,
    artworkHash,
    image: `/og/hebdo/${edition.slug}-${fingerprint}.png`,
    alt: `L’Hebdo l0g, ${issueLabel}, ${dateLabel} : ${title}.`,
    title,
    issueLabel,
    dateLabel,
  };
}
