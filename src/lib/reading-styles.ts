const pending = new Map<string, Promise<void>>();

/** Reveal an optional reading control only once its noncritical styles are ready. */
export function loadReadingStyles(href: string): Promise<void> {
  let result = pending.get(href);
  if (!result) {
    result = new Promise<void>((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.addEventListener('load', () => resolve(), { once: true });
      link.addEventListener('error', () => { pending.delete(href); link.remove(); reject(new Error('Reading styles unavailable')); }, { once: true });
      document.head.append(link);
    });
    pending.set(href, result);
  }
  return result;
}
