import { isReadingPath, readingTitle } from './reading-position.ts';

export const WORKSPACE_KEY = 'l0g-reader-workspace-v1';
export const WORKSPACE_EVENT = 'l0g:reader-workspace';
export const MAX_COMPLETED = 100;
export const MAX_FIGURES = 30;
export const MAX_WORKSPACE_CHARS = 32_768;
export interface CompletedReading { path: string; title: string; savedAt: number; }
export interface SavedFigure extends CompletedReading { anchor: string; }
export interface ReaderWorkspace { completed: CompletedReading[]; figures: SavedFigure[]; }
type Store = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;
export const validFigureAnchor = (value: unknown): value is string => typeof value === 'string' && /^l0g-figure-\d{2,4}-*$/.test(value) && value.length <= 80;

function cleanReading(value: unknown, now: number): CompletedReading | null {
  if (!value || typeof value !== 'object') return null;
  const item = value as Partial<CompletedReading>;
  const title = readingTitle(item.title);
  return isReadingPath(item.path) && title && typeof item.savedAt === 'number' && Number.isFinite(item.savedAt)
    && item.savedAt >= 0 && item.savedAt <= now ? { path: item.path, title, savedAt: item.savedAt } : null;
}
function cleanFigure(value: unknown, now: number): SavedFigure | null {
  const reading = cleanReading(value, now);
  const anchor = (value as Partial<SavedFigure> | null)?.anchor;
  return reading && validFigureAnchor(anchor) ? { ...reading, anchor } : null;
}
function unique<T>(items: T[], key: (item: T) => string, limit: number): T[] {
  const seen = new Set<string>();
  return items.filter(item => { const id = key(item); if (seen.has(id)) return false; seen.add(id); return true; }).slice(0, limit);
}
export function readWorkspace(storage: Store, now = Date.now()): ReaderWorkspace {
  try {
    const raw = storage.getItem(WORKSPACE_KEY);
    if (!raw || raw.length > MAX_WORKSPACE_CHARS) return { completed: [], figures: [] };
    const data = JSON.parse(raw);
    if (data?.version !== 1 || !Array.isArray(data.completed) || !Array.isArray(data.figures)
      || data.completed.length > MAX_COMPLETED || data.figures.length > MAX_FIGURES) return { completed: [], figures: [] };
    const completed = data.completed.map((item: unknown) => cleanReading(item, now)).filter((item: CompletedReading | null): item is CompletedReading => !!item);
    const figures = data.figures.map((item: unknown) => cleanFigure(item, now)).filter((item: SavedFigure | null): item is SavedFigure => !!item);
    completed.sort((a: CompletedReading,b: CompletedReading) => b.savedAt-a.savedAt);
    figures.sort((a: SavedFigure,b: SavedFigure) => b.savedAt-a.savedAt);
    return { completed: unique(completed, item => item.path, MAX_COMPLETED), figures: unique(figures, item => item.path+'#'+item.anchor, MAX_FIGURES) };
  } catch { return { completed: [], figures: [] }; }
}
export function writeWorkspaceItem(storage: Store, kind: 'completed' | 'figures', value: CompletedReading | SavedFigure, remove = false, now = Date.now()): boolean {
  try {
    const clean = kind === 'completed' ? cleanReading(value, now) : cleanFigure(value, now);
    if (!clean) return false;
    storage.getItem(WORKSPACE_KEY); // A failed read must not overwrite an existing list.
    const state = readWorkspace(storage, now);
    if (kind === 'completed') {
      state.completed = state.completed.filter(item => item.path !== clean.path);
      if (!remove) state.completed.unshift(clean);
      state.completed.splice(MAX_COMPLETED);
    } else {
      const figure = clean as SavedFigure;
      state.figures = state.figures.filter(item => item.path !== figure.path || item.anchor !== figure.anchor);
      if (!remove) state.figures.unshift(figure);
      state.figures.splice(MAX_FIGURES);
    }
    // Retain the most recent entries within a strict browser-storage budget.
    let encoded = JSON.stringify({ version: 1, ...state });
    while (encoded.length > MAX_WORKSPACE_CHARS) {
      const lastReading = state.completed.at(-1)?.savedAt ?? Infinity;
      const lastFigure = state.figures.at(-1)?.savedAt ?? Infinity;
      if (lastReading <= lastFigure) state.completed.pop(); else state.figures.pop();
      encoded = JSON.stringify({ version: 1, ...state });
    }
    if (state.completed.length || state.figures.length) storage.setItem(WORKSPACE_KEY, encoded);
    else storage.removeItem(WORKSPACE_KEY);
    return true;
  } catch { return false; }
}

export interface ReadingChapter { path: string; title: string; }
/** Accept only the ordered chapter URLs explicitly published by the Book. */
export function bookChapters(value: unknown): ReadingChapter[] {
  if (!value || typeof value !== 'object') return [];
  const book = value as { '@type'?: string; hasPart?: unknown[] };
  if (book['@type'] !== 'Book' || !Array.isArray(book.hasPart) || book.hasPart.length > 100) return [];
  return unique(book.hasPart.flatMap(part => {
    if (!part || typeof part !== 'object') return [];
    const item = part as { url?: unknown; name?: unknown };
    if (typeof item.url !== 'string' || !/^(?:https:\/\/l0g\.fr)?\/(?:posts|en\/analysis)\/[a-z0-9-]+\/$/.test(item.url)) return [];
    try {
      const url = new URL(item.url, 'https://l0g.fr');
      const title = readingTitle(item.name);
      return url.origin === 'https://l0g.fr' && !url.username && !url.password && !url.search && !url.hash
        && isReadingPath(url.pathname) && title ? [{ path: url.pathname, title }] : [];
    } catch { return []; }
  }), item => item.path, 100);
}
