/** Pagefind metadata is untrusted: results may only navigate within this site. */
export function localSearchHref(value: unknown, origin: string): string | null {
  if (typeof value !== 'string' || value.length > 2000 || /[\u0000-\u001f\u007f]/.test(value)) return null;
  try {
    const url = new URL(value, origin);
    return url.origin === origin && !url.username && !url.password && ['https:', 'http:'].includes(url.protocol)
      ? url.pathname + url.search + url.hash : null;
  } catch { return null; }
}
