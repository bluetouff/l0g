export const READING_STORAGE_KEY = 'l0g-reading-positions';
export const READING_MAX_AGE = 30 * 24 * 60 * 60 * 1000;
export const READING_MAX_ENTRIES = 20;
export const READING_MAX_STORAGE_CHARS = 8192;

export function isReadingPath(value: unknown): value is string {
  return typeof value === 'string' && value.length <= 250 && /^\/(?:posts|en\/analysis)\/[a-z0-9-]+\/$/.test(value);
}

export function readingTitle(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const title = value.replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 160);
  return title || undefined;
}

export interface ReadingPosition {
  path: string;
  revision: string;
  block: number;
  fraction: number;
  progress: number;
  savedAt: number;
  title?: string;
}

type ReadingStorage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

function validPosition(value: unknown, now: number): value is ReadingPosition {
  if (!value || typeof value !== 'object') return false;
  const item = value as Record<string, unknown>;
  return isReadingPath(item.path)
    && typeof item.revision === 'string' && /^[a-f0-9]{16}$/.test(item.revision)
    && Number.isInteger(item.block) && Number(item.block) >= 0 && Number(item.block) < 10000
    && typeof item.fraction === 'number' && Number.isFinite(item.fraction) && item.fraction >= 0 && item.fraction <= 1
    && typeof item.progress === 'number' && Number.isFinite(item.progress) && item.progress > 0 && item.progress < 1
    && typeof item.savedAt === 'number' && Number.isFinite(item.savedAt)
    && item.savedAt <= now && item.savedAt > now - READING_MAX_AGE;
}

function cleanPosition({ path, revision, block, fraction, progress, savedAt, title }: ReadingPosition): ReadingPosition {
  const label = readingTitle(title);
  return { path, revision, block, fraction, progress, savedAt, ...(label ? { title: label } : {}) };
}

export function readReadingPositions(storage: ReadingStorage, now = Date.now()): ReadingPosition[] {
  try {
    const raw = storage.getItem(READING_STORAGE_KEY);
    if (!raw || raw.length > READING_MAX_STORAGE_CHARS) return [];
    const data: unknown = JSON.parse(raw);
    if (!data || typeof data !== 'object' || !('version' in data) || data.version !== 1
      || !('positions' in data) || !Array.isArray(data.positions)) return [];
    const paths = new Set<string>();
    return data.positions.filter((item): item is ReadingPosition => validPosition(item, now))
      .sort((a, b) => b.savedAt - a.savedAt)
      .filter((item) => {
        if (paths.has(item.path)) return false;
        paths.add(item.path);
        return true;
      }).slice(0, READING_MAX_ENTRIES)
      .map(cleanPosition);
  } catch { return []; }
}

export function writeReadingPosition(storage: ReadingStorage, path: string, position: ReadingPosition | null, now = Date.now()): boolean {
  try {
    if (!isReadingPath(path) || (position && (!validPosition(position, now) || position.path !== path))) return false;
    const positions = readReadingPositions(storage, now).filter((item) => item.path !== path);
    if (position) positions.unshift(cleanPosition(position));
    positions.splice(READING_MAX_ENTRIES);
    let encoded = JSON.stringify({ version: 1, positions });
    while (encoded.length > READING_MAX_STORAGE_CHARS) {
      positions.pop();
      encoded = JSON.stringify({ version: 1, positions });
    }
    if (positions.length) storage.setItem(READING_STORAGE_KEY, encoded);
    else storage.removeItem(READING_STORAGE_KEY);
    return true;
  } catch { return false; }
}

// Progress starts at the article body and reaches 100% when its end is visible.
export function readingProgress(top: number, height: number, viewport: number): number {
  if (![top, height, viewport].every(Number.isFinite) || height <= 0 || viewport <= 0) return 0;
  if (height <= viewport) return top <= 0 ? 1 : 0;
  return Math.min(1, Math.max(0, -top / (height - viewport)));
}
