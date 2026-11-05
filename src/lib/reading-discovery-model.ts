import { isReadingPath } from './reading-position.ts';
export interface DiscoveryEntry {
  path: string; title: string; description: string; published: string; updated?: string; revisionNote?: string;
  minutes: number; topics: string[]; topicLabel: string; tool?: string;
  summary?: { fact: string; importance: string; uncertainty: string };
}
export function validToolPath(value: unknown): value is string {
  return typeof value === 'string' && value.length < 500 && /^\/(?:posts|outils|en\/analysis|en\/tools)\/[a-z0-9-]+\/(?:#[a-zA-Z0-9_-]+)?$/.test(value);
}
export function validDiscoveryEntry(value: unknown): value is DiscoveryEntry {
  if (!value || typeof value !== 'object') return false;
  const v = value as DiscoveryEntry;
  const text = (s: unknown, max: number) => typeof s === 'string' && s.length > 0 && s.length <= max;
  const date = (s: unknown) => typeof s === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(s) && Number.isFinite(Date.parse(s));
  return isReadingPath(v.path) && text(v.title, 500) && text(v.description, 2000) && date(v.published)
    && (v.revisionNote === undefined || (date(v.updated) && text(v.revisionNote, 320)))
    && (v.updated === undefined || date(v.updated)) && Number.isInteger(v.minutes) && v.minutes > 0 && v.minutes < 1000
    && Array.isArray(v.topics) && v.topics.length <= 30 && v.topics.every(s => text(s, 100)) && text(v.topicLabel, 150)
    && (v.tool === undefined || validToolPath(v.tool)) && (v.summary === undefined || (v.summary !== null && typeof v.summary === 'object'
      && ['fact', 'importance', 'uncertainty'].every(k => text(v.summary![k as keyof typeof v.summary], 6000))));
}
export interface DiscoveryFilter { topic: string; duration: string; tool: boolean; since?: number; }
export function filterDiscovery(entries: DiscoveryEntry[], filter: DiscoveryFilter): DiscoveryEntry[] {
  return entries.filter(e => (!filter.topic || e.topics.includes(filter.topic))
    && (filter.duration !== 'short' || e.minutes <= 5) && (filter.duration !== 'medium' || e.minutes > 5 && e.minutes <= 15)
    && (filter.duration !== 'long' || e.minutes > 15) && (!filter.tool || Boolean(e.tool))
    && (filter.since === undefined || Math.max(Date.parse(e.published), Date.parse(e.updated ?? e.published)) > filter.since));
}
export const VISIT_STORAGE_KEY = 'l0g:last-visit-v1';
export function visitTime(value: string | null, now = Date.now()): number | undefined {
  if (!value || value.length > 40) return undefined;
  const n = Date.parse(value); return Number.isFinite(n) && n > 0 && n <= now ? n : undefined;
}
