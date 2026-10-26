// The browser creates a PDF only on request; the site stores no PDF copy.
const articleBody = document.querySelector<HTMLElement>('[data-reading-body]');
if (articleBody) {
  document.querySelector<HTMLButtonElement>('[data-article-print]')?.addEventListener('click', () => window.print());
  let folded: HTMLDetailsElement[] = [];
  window.addEventListener('beforeprint', () => {
    if (folded.length) return;
    folded = Array.from(articleBody.querySelectorAll<HTMLDetailsElement>('details:not([open])'));
    for (const item of folded) item.open = true;
  });
  window.addEventListener('afterprint', () => {
    for (const item of folded) item.open = false;
    folded = [];
  });
}
