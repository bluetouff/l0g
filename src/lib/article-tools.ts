/** Only navigation URLs are copied into the reading tools. Never accept active schemes. */
export function articleToolUrl(value: string, base: string): URL | null {
  if (!value || /[\u0000-\u0020\u007f]/.test(value)) return null;
  try {
    const url = new URL(value, base);
    return /^(https?:)$/.test(url.protocol) && !url.username && !url.password ? url : null;
  } catch { return null; }
}

export function articleReferenceId(value: string, base: string): string | null {
  const url = articleToolUrl(value, base);
  const page = articleToolUrl(base, base);
  if (!url || !page || url.origin !== page.origin || url.pathname !== page.pathname || url.search !== page.search) return null;
  try {
    const id = decodeURIComponent(url.hash.slice(1));
    return /^(?:source[-_]|ref[-_]|(?:user-content-)?fn-|s\d{1,3}$)/i.test(id) ? id : null;
  } catch { return null; }
}

export function articleExcerpt(text: string, title: string, pageUrl: string, section: string, en = false): string | null {
  const selected = text.trim();
  const url = articleToolUrl(pageUrl, pageUrl);
  if (!url || !selected || selected.length > 12000) return null;
  url.search = '';
  url.hash = section;
  return `${en ? '“' : '« '}${selected}${en ? '”' : ' »'}\n\n${title.trim()}\n${url.href}`;
}
