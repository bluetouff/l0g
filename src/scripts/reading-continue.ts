import { readReadingPositions, READING_STORAGE_KEY } from '../lib/reading-position.ts';
import { loadReadingStyles } from '../lib/reading-styles.ts';
import styles from '../styles/reading-continue.css?url&no-inline';
for (const root of document.querySelectorAll<HTMLElement>('[data-reading-continue]')) {
  let dismissed = false;
  let ready = false;
  let request = 0;
  const render = async () => {
    if (dismissed) return;
    const id = ++request;
    try {
      const item = readReadingPositions(localStorage).find(p => root.dataset.lang === 'en' ? p.path.startsWith('/en/') : p.path.startsWith('/posts/'));
      if (item && !ready) { await loadReadingStyles(styles); ready = true; }
      if (dismissed || id !== request) return;
      root.hidden = !item;
      if (!item) return;
      const link = root.querySelector<HTMLAnchorElement>('[data-continue-link]')!;
      link.href = item.path + '#l0g-reading-position';
      root.querySelector('[data-continue-title]')!.textContent = item.title ?? item.path.split('/').filter(Boolean).at(-1)!.replace(/-/g,' ');
      root.querySelector('[data-continue-progress]')!.textContent = `${Math.round(item.progress*100)} % ${root.dataset.lang === 'en' ? 'read' : 'lu'} · ${root.dataset.lang === 'en' ? 'On this device' : 'Sur cet appareil'}`;
    } catch { root.hidden = true; }
  };
  root.querySelector('[data-continue-dismiss]')!.addEventListener('click', () => { dismissed = true; root.hidden = true; });
  window.addEventListener('storage', e => { if (!e.key || e.key === READING_STORAGE_KEY) render(); });
  document.addEventListener('l0g:reading-removed', render);
  render();
}
