import type { WeeklyEdition, WeeklyReading } from '../config/weekly-editions.ts';

type IllustrationPost = { id: string; data: { draft?: boolean; ogImage?: string } };

// Use the publication's own illustration. Text-only social cards and remote
// URLs are deliberately excluded from the magazine's editorial photography.
export function weeklyIllustrations(posts: IllustrationPost[]) {
  return new Map(posts.filter((post) => !post.data.draft && isWeeklyIllustration(post.data.ogImage))
    .map((post) => [`/posts/${post.id}/`, post.data.ogImage!]));
}

export function isWeeklyIllustration(value: unknown): value is string {
  return typeof value === 'string' && /^\/illustrations\/(?:[a-zA-Z0-9_-]+\/)*[a-zA-Z0-9_-]+\.(?:jpg|jpeg|png|webp)$/.test(value);
}

export function weeklyReadings(edition: WeeklyEdition): WeeklyReading[] {
  return edition.editorial?.readings ?? (edition.briefs?.length ? edition.briefs : [{
    title: edition.analysis.title, href: edition.analysis.href, topic: 'Le dossier',
    fact: edition.lead, importance: edition.mechanism, uncertainty: edition.test,
  }]);
}

export function weeklyCoverTitle(edition: WeeklyEdition) {
  if (edition.editorial) return edition.editorial.title;
  // This existing archive's original heading contains the empty framing now
  // prohibited by the editorial rules. Its source article and URL stay intact.
  if (edition.slug === '2026-08-30') return 'Pontes : le règlement entre DLT et T2';
  return edition.analysis.title;
}

export function weeklyCoverImage(edition: WeeklyEdition, illustrations: Map<string, string>) {
  if (isWeeklyIllustration(edition.editorial?.cover.src)) return edition.editorial.cover.src;
  return illustrations.get(weeklyReadings(edition)[0].href);
}

export function weeklyDate(value: string, short = false) {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric', month: short ? 'short' : 'long', year: 'numeric', timeZone: 'Europe/Paris',
  }).format(new Date(value)).replace(/^1 /, '1er ');
}
