import { READING_STORAGE_KEY, readReadingPositions, writeReadingPosition, readingProgress, type ReadingPosition } from '../lib/reading-position.ts';

const root = document.querySelector<HTMLElement>('[data-reading-resume]');
const content = document.querySelector<HTMLElement>('[data-reading-body]');
const bar = document.querySelector<HTMLElement>('[data-reading-progress]');

if (root && content && bar) {
  const resume = root.querySelector<HTMLButtonElement>('[data-reading-continue]')!;
  const forget = root.querySelector<HTMLButtonElement>('[data-reading-forget]')!;
  const description = root.querySelector<HTMLElement>('[data-reading-description]')!;
  const status = root.querySelector<HTMLElement>('[data-reading-status]')!;
  const path = location.pathname;
  const revision = root.dataset.revision!;
  const en = root.dataset.lang === 'en';
  const blocks = Array.from(content.children).filter((node): node is HTMLElement => node instanceof HTMLElement);
  let storage: Storage | null = null;
  try { storage = window.localStorage; } catch { /* Reading remains available without storage. */ }
  let saved = storage ? readReadingPositions(storage).find((item) => item.path === path) : undefined;
  if (saved && (saved.revision !== revision || !blocks[saved.block])) saved = undefined;
  // Also prune expired or obsolete positions on visits that do not produce a new save.
  if (storage) writeReadingPosition(storage, path, saved ?? null);
  let disabled = false;
  let hasStored = Boolean(saved);
  let scrolled = false;
  let frame = 0;
  let timer = 0;

  if (saved) {
    description.textContent = en
      ? `Saved at ${Math.round(saved.progress * 100)}% · on this device only`
      : `Position à ${Math.round(saved.progress * 100)} % · sur cet appareil uniquement`;
    root.hidden = false;
  }

  function save() {
    if (!storage || disabled || !scrolled) return;
    const rect = content!.getBoundingClientRect();
    const progress = readingProgress(rect.top, rect.height, window.innerHeight);
    // Returning to the title must not erase a pending bookmark.
    if (progress < 0.02) return;
    if (progress >= 0.98) {
      if (!writeReadingPosition(storage, path, null)) return;
      saved = undefined;
      hasStored = false;
      resume.hidden = true;
      forget.hidden = true;
      description.textContent = en ? 'End of the article reached. Position cleared.' : 'Fin de l’article atteinte. Position effacée.';
      return;
    }
    let block = 0;
    for (let index = 0; index < blocks.length; index++) {
      const bounds = blocks[index].getBoundingClientRect();
      if (bounds.height > 0 && bounds.top <= 24) block = index;
    }
    const bounds = blocks[block]?.getBoundingClientRect();
    if (!bounds || bounds.height <= 0) return;
    const position: ReadingPosition = {
      path, revision, block, progress, savedAt: Date.now(),
      fraction: Math.min(1, Math.max(0, (24 - bounds.top) / bounds.height)),
    };
    if (writeReadingPosition(storage, path, position)) hasStored = true;
  }

  function update() {
    frame = 0;
    const rect = content!.getBoundingClientRect();
    bar!.style.transform = `scaleX(${readingProgress(rect.top, rect.height, window.innerHeight).toFixed(4)})`;
  }
  function scheduleUpdate() { if (!frame) frame = requestAnimationFrame(update); }

  resume.addEventListener('click', () => {
    if (!saved) return;
    const target = blocks[saved.block];
    const rect = target.getBoundingClientRect();
    const top = window.scrollY + rect.top + rect.height * saved.fraction - 24;
    // An immediate, user-requested jump avoids animating through a long article.
    window.scrollTo({ top, behavior: 'instant' });
    const previous = target.getAttribute('tabindex');
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
    target.addEventListener('blur', () => {
      if (previous === null) target.removeAttribute('tabindex');
      else target.setAttribute('tabindex', previous);
    }, { once: true });
    status.textContent = en ? 'Reading position restored.' : 'Position de lecture retrouvée.';
  });
  forget.addEventListener('click', () => {
    disabled = true;
    window.clearTimeout(timer);
    if (storage && writeReadingPosition(storage, path, null)) {
      saved = undefined;
      resume.hidden = true;
      forget.hidden = true;
      description.textContent = en ? 'Position erased. Saving paused for this visit.' : 'Position effacée. Mémorisation suspendue pour cette visite.';
      status.textContent = description.textContent;
    } else {
      status.textContent = en ? 'Storage is unavailable.' : 'Le stockage est indisponible.';
    }
  });
  document.addEventListener('scroll', () => {
    scrolled = true;
    scheduleUpdate();
    window.clearTimeout(timer);
    timer = window.setTimeout(save, 700);
  }, { passive: true });
  window.addEventListener('resize', scheduleUpdate);
  window.addEventListener('pagehide', save);
  document.addEventListener('visibilitychange', () => { if (document.hidden) save(); });
  window.addEventListener('storage', (event) => {
    // Erasure in another tab must not be undone by a background save.
    if (event.key === null || event.key === READING_STORAGE_KEY) {
      if (event.newValue === null || (hasStored && storage && !readReadingPositions(storage).some((item) => item.path === path))) {
        disabled = true;
        saved = undefined;
        root!.hidden = true;
      }
    }
  });
  update();
}
