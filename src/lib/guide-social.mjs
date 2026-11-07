import { createHash } from 'node:crypto';

// Bump when changing the composition or fonts, to renew social-crawler URLs.
export const GUIDE_SOCIAL_VERSION = 'reference-manual-v1';
const digest = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const categories = {
  macro: ['Macroéconomie', 'Macroeconomics'],
  fed: ['Banques & liquidité', 'Banks & liquidity'],
  marches: ['Marchés & entreprises', 'Markets & companies'],
  crypto: ['Crypto & régulation', 'Crypto & regulation'],
};

function text(value, name, maximum) {
  if (typeof value !== 'string' || !value.trim() || value.length > maximum || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/u.test(value)) throw new TypeError(`Guide OG: invalid ${name}.`);
  return value.replace(/\s+/gu, ' ').trim();
}

function excerpt(value) {
  if (Array.from(value).length <= 160) return value;
  const prefix = Array.from(value).slice(0, 159).join('');
  const boundary = prefix.lastIndexOf(' ');
  return `${(boundary >= 80 ? prefix.slice(0, boundary) : prefix).trimEnd()}…`;
}

function date(value) {
  if (!(value instanceof Date)) {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2}))?$/u.test(value)) throw new TypeError('Guide OG: invalid revision date.');
    const calendar = new Date(`${value.slice(0, 10)}T00:00:00Z`);
    if (!Number.isFinite(calendar.getTime()) || calendar.toISOString().slice(0, 10) !== value.slice(0, 10)) throw new TypeError('Guide OG: invalid calendar date.');
  }
  const result = new Date(value);
  if (!Number.isFinite(result.getTime())) throw new TypeError('Guide OG: invalid revision date.');
  return result;
}

/** Native guide copy; existing bespoke artwork retains priority. */
export function guideSocialCard(entry, lang) {
  if (!['fr', 'en'].includes(lang)) throw new TypeError('Guide OG: unsupported language.');
  const data = entry?.data;
  if (!data || typeof data !== 'object' || Array.isArray(data)) throw new TypeError('Guide OG: missing metadata.');
  if (data.draft !== undefined && typeof data.draft !== 'boolean') throw new TypeError('Guide OG: invalid draft flag.');
  if (data.ogImage !== undefined && (typeof data.ogImage !== 'string' || !data.ogImage.trim())) throw new TypeError('Guide OG: invalid custom image.');
  if (data.draft || data.ogImage) return null;
  if (typeof entry.id !== 'string' || entry.id.length > 180 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(entry.id)) throw new TypeError('Guide OG: invalid slug.');
  if (data.category !== undefined && !Object.hasOwn(categories, data.category)) throw new TypeError('Guide OG: invalid category.');
  const typography = value => lang === 'fr' ? value.replace(/ +([:;!?])/gu, '\u00a0$1') : value;
  const title = typography(text(lang === 'en' ? data.ogTitle ?? data.title : data.title, 'title', 500));
  const description = typography(excerpt(text(data.description, 'description', 4096)));
  const revised = date(data.updatedDate ?? data.pubDate);
  const category = data.category ? categories[data.category][lang === 'fr' ? 0 : 1] : lang === 'fr' ? 'Économie & finance' : 'Economics & finance';
  const revisedLabel = revised.toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Europe/Paris' });
  const content = { version: GUIDE_SOCIAL_VERSION, lang, title, description, category, revisedAt: revised.toISOString(), dateLabel: `${lang === 'fr' ? 'Révisé le' : 'Revised'} ${revisedLabel}`, label: lang === 'fr' ? 'GUIDE DE RÉFÉRENCE' : 'REFERENCE GUIDE' };
  return { ...content, image: `/og/guides/${lang}/${entry.id}-${digest(content).slice(0, 16)}.jpg`, alt: `${content.label} : ${title}. ${description} l0g.fr` };
}

export function guideSocialCacheKey(key, entry, lang) {
  return digest({ key, socialImage: guideSocialCard(entry, lang)?.image ?? null });
}
