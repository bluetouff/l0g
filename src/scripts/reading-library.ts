import { LIBRARY_STORAGE_KEY, readSavedArticles, writeSavedArticle } from '../lib/reading-library.ts';
import { READING_STORAGE_KEY, isReadingPath, readingTitle, readReadingPositions, writeReadingPosition } from '../lib/reading-position.ts';

const root = document.querySelector<HTMLElement>('[data-reading-library]');
if (root && typeof HTMLDialogElement !== 'undefined' && typeof HTMLDialogElement.prototype.showModal === 'function') {
  const dialog = root.querySelector<HTMLDialogElement>('dialog')!;
  const opener = root.querySelector<HTMLButtonElement>('[data-library-open]')!;
  const save = root.querySelector<HTMLButtonElement>('[data-library-save]');
  const saveLabel = save?.querySelector<HTMLElement>('[data-library-save-label]');
  const status = root.querySelector<HTMLElement>('[data-library-status]')!;
  const dialogStatus = root.querySelector<HTMLElement>('[data-library-dialog-status]')!;
  const positionsList = root.querySelector<HTMLUListElement>('[data-library-positions]')!;
  const savedList = root.querySelector<HTMLUListElement>('[data-library-saved]')!;
  const en = root.dataset.lang === 'en';
  const path = root.dataset.articlePath;
  const title = readingTitle(root.dataset.articleTitle);
  const unavailable = en ? 'Browser storage is unavailable.' : 'Le stockage du navigateur est indisponible.';
  let storage: Storage | null = null;
  let previousFocus: HTMLElement | null = null;
  let resumeCurrent = false;

  function readStorage(): Storage | null {
    try {
      const value = window.localStorage;
      value.getItem(LIBRARY_STORAGE_KEY);
      value.getItem(READING_STORAGE_KEY);
      return value;
    } catch { return null; }
  }

  function announce(message: string) {
    (dialog.open ? dialogStatus : status).textContent = message;
  }

  function updateSave() {
    if (!save) return;
    const saved = storage && readSavedArticles(storage).some((item) => item.path === path);
    save.setAttribute('aria-pressed', String(Boolean(saved)));
    if (saveLabel) saveLabel.textContent = saved ? (en ? 'Saved for later' : 'Dans ma liste') : (en ? 'Save for later' : 'À lire plus tard');
  }

  function addRow(list: HTMLUListElement, item: { path: string; title?: string; progress?: number }, position: boolean) {
    const row = document.createElement('li');
    const link = document.createElement('a');
    link.href = item.path + (position ? '#l0g-reading-position' : '');
    if (position && item.path === location.pathname) link.addEventListener('click', (event) => {
      event.preventDefault();
      resumeCurrent = true;
      dialog.close();
    });
    const label = item.title ?? item.path.split('/').filter(Boolean).at(-1)!.replace(/-/g, ' ');
    link.textContent = label;
    if (position && item.progress !== undefined) {
      const progress = document.createElement('small');
      progress.textContent = en ? `${Math.round(item.progress * 100)}% read` : `${Math.round(item.progress * 100)} % lu`;
      link.append(progress);
    }
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.textContent = en ? 'Remove' : 'Retirer';
    remove.setAttribute('aria-label', en ? `Remove ${label}` : `Retirer ${label}`);
    remove.addEventListener('click', () => {
      const store = readStorage();
      if (!store || !(position ? writeReadingPosition(store, item.path, null) : writeSavedArticle(store, item.path, null))) {
        announce(unavailable);
        return;
      }
      const next = (row.nextElementSibling ?? row.previousElementSibling)?.querySelector<HTMLButtonElement>('button');
      // Keep keyboard focus within the dialog when the active row disappears.
      (next ?? root!.querySelector<HTMLButtonElement>('[data-library-close]'))?.focus();
      if (position) document.dispatchEvent(new CustomEvent('l0g:reading-removed', { detail: { path: item.path } }));
      row.remove();
      storage = store;
      updateSave();
      updateEmpty();
      announce(en ? 'Removed from this browser.' : 'Retiré de ce navigateur.');
    });
    row.append(link, remove);
    list.append(row);
  }

  function updateEmpty() {
    root!.querySelector<HTMLElement>('[data-library-positions-heading]')!.hidden = positionsList.childElementCount === 0;
    root!.querySelector<HTMLElement>('[data-library-saved-empty]')!.hidden = savedList.childElementCount > 0;
  }

  function render() {
    storage = readStorage();
    positionsList.replaceChildren();
    savedList.replaceChildren();
    if (storage) {
      readReadingPositions(storage).forEach((item) => addRow(positionsList, item, true));
      readSavedArticles(storage).forEach((item) => addRow(savedList, item, false));
    }
    dialogStatus.textContent = storage ? '' : unavailable;
    updateSave();
    updateEmpty();
  }

  opener.addEventListener('click', () => {
    previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : opener;
    render();
    dialog.showModal();
  });
  root.querySelector<HTMLButtonElement>('[data-library-close]')!.addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    previousFocus?.focus({ preventScroll: true });
    if (resumeCurrent) {
      resumeCurrent = false;
      document.dispatchEvent(new Event('l0g:reading-resume'));
    }
  });
  save?.addEventListener('click', () => {
    storage = readStorage();
    if (!storage || !isReadingPath(path) || !title) { announce(unavailable); return; }
    const saved = readSavedArticles(storage).some((item) => item.path === path);
    if (!writeSavedArticle(storage, path, saved ? null : { path, title, savedAt: Date.now() })) { announce(unavailable); return; }
    updateSave();
    announce(saved ? (en ? 'Removed from your list.' : 'Retiré de votre liste.') : (en ? 'Saved in this browser.' : 'Ajouté à votre liste dans ce navigateur.'));
  });
  window.addEventListener('storage', (event) => {
    if (event.key !== null && event.key !== LIBRARY_STORAGE_KEY && event.key !== READING_STORAGE_KEY) return;
    if (dialog.open) render();
    else { storage = readStorage(); updateSave(); }
  });
  storage = readStorage();
  updateSave();
  const styles = document.createElement('link');
  styles.rel = 'stylesheet';
  styles.href = root.dataset.styles!;
  styles.addEventListener('load', () => { root!.hidden = false; });
  document.head.append(styles);
}
