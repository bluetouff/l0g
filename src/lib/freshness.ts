export type FreshnessTone = 'fresh' | 'current' | 'watch' | 'archive';

export interface FreshnessInfo {
  tone: FreshnessTone;
  label: string;
  detail: string;
  days: number;
}

const DAY = 24 * 60 * 60 * 1000;

export function daysSince(date: Date, now = new Date()): number {
  return Math.max(0, Math.floor((now.getTime() - date.getTime()) / DAY));
}

export function freshnessFor(date: Date, now = new Date()): FreshnessInfo {
  const days = daysSince(date, now);
  if (days <= 14) {
    return { tone: 'fresh', label: 'frais', detail: `revu il y a ${days || 0} j`, days };
  }
  if (days <= 60) {
    return { tone: 'current', label: 'actif', detail: `revu il y a ${days} j`, days };
  }
  if (days <= 180) {
    return { tone: 'watch', label: 'à revoir', detail: `revu il y a ${days} j`, days };
  }
  return { tone: 'archive', label: 'archive', detail: `revu il y a ${days} j`, days };
}

export function formatDateFr(date: Date): string {
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
}
