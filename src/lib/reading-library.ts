import { isReadingPath, readingTitle } from './reading-position.ts';

export const LIBRARY_STORAGE_KEY = 'l0g-reading-library';
export const LIBRARY_MAX_ENTRIES = 30;
export const LIBRARY_MAX_STORAGE_CHARS = 8192;

export interface SavedArticle { path: string; title: string; savedAt: number; }
type LibraryStorage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

function cleanArticle(value: unknown, now: number): SavedArticle | null {
  if (!value || typeof value !== 'object') return null;
  const item = value as Record<string, unknown>;
  const title = readingTitle(item.title);
  return isReadingPath(item.path) && title && typeof item.savedAt === 'number'
    && Number.isFinite(item.savedAt) && item.savedAt >= 0 && item.savedAt <= now
    ? { path: item.path, title, savedAt: item.savedAt } : null;
}

export function readSavedArticles(storage: LibraryStorage, now = Date.now()): SavedArticle[] {
  try {
    const raw = storage.getItem(LIBRARY_STORAGE_KEY);
    if (!raw || raw.length > LIBRARY_MAX_STORAGE_CHARS) return [];
    const data: unknown = JSON.parse(raw);
    if (!data || typeof data !== 'object' || !('version' in data) || data.version !== 1
      || !('articles' in data) || !Array.isArray(data.articles)) return [];
    const paths = new Set<string>();
    return data.articles.map((item) => cleanArticle(item, now)).filter((item): item is SavedArticle => item !== null)
      .sort((a, b) => b.savedAt - a.savedAt).filter((item) => {
        if (paths.has(item.path)) return false;
        paths.add(item.path);
        return true;
      }).slice(0, LIBRARY_MAX_ENTRIES);
  } catch { return []; }
}

export function writeSavedArticle(storage: LibraryStorage, path: string, article: SavedArticle | null, now = Date.now()): boolean {
  try {
    const clean = article ? cleanArticle(article, now) : null;
    if (!isReadingPath(path) || (article && (!clean || clean.path !== path))) return false;
    const articles = readSavedArticles(storage, now).filter((item) => item.path !== path);
    if (clean) articles.unshift(clean);
    articles.splice(LIBRARY_MAX_ENTRIES);
    let encoded = JSON.stringify({ version: 1, articles });
    while (encoded.length > LIBRARY_MAX_STORAGE_CHARS) {
      articles.pop();
      encoded = JSON.stringify({ version: 1, articles });
    }
    if (articles.length) storage.setItem(LIBRARY_STORAGE_KEY, encoded);
    else storage.removeItem(LIBRARY_STORAGE_KEY);
    return true;
  } catch { return false; }
}
