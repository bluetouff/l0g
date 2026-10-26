import { articleExcerpt, articleReferenceId, articleToolUrl } from '../lib/article-tools';

const root = document.querySelector<HTMLElement>('[data-article-tools]');
const body = document.querySelector<HTMLElement>('[data-reading-body]');

if (root && body) {
  const en = root.dataset.lang === 'en';
  const dialog = root.querySelector<HTMLDialogElement>('[data-article-dialog]')!;
  const preview = dialog.querySelector<HTMLElement>('[data-article-dialog-content]')!;
  const heading = dialog.querySelector<HTMLElement>('[data-article-dialog-title]')!;
  const close = dialog.querySelector<HTMLButtonElement>('[data-article-close]')!;
  const zoom = dialog.querySelector<HTMLButtonElement>('[data-article-zoom]')!;
  const zoomControls = dialog.querySelector<HTMLElement>('[data-article-zoom-controls]')!;
  const status = root.querySelector<HTMLElement>('[data-article-status]')!;
  const selectionButton = root.querySelector<HTMLButtonElement>('[data-article-selection]')!;
  const fallback = root.querySelector<HTMLTextAreaElement>('[data-article-fallback]')!;
  const indexButton = root.querySelector<HTMLButtonElement>('[data-article-index]')!;
  const figureTargets = new Map<string, HTMLElement>();
  const figureEntries: Array<{ title: string; href: string }> = [];
  const headings = Array.from(body.querySelectorAll<HTMLElement>('h2[id],h3[id],h4[id]'));
  const supportsDialog = typeof dialog.showModal === 'function';
  const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href || location.href;
  const termTemplate = root.querySelector<HTMLTemplateElement>('[data-article-terms]')!;
  const terms = new Map(Array.from(termTemplate.content.children).flatMap((node) => {
    const term = node as HTMLElement;
    const url = articleToolUrl(term.dataset.href || '', location.href);
    return url && url.origin === location.origin ? [[url.href, term] as const] : [];
  }));
  let opener: HTMLElement | null = null;
  let moved: Element | null = null;
  let placeholder: Comment | null = null;
  let figureWidth = 900;
  let excerpt: string | null = null;
  root.hidden = false;

  function restoreFigure() {
    if (moved && placeholder?.parentNode) placeholder.replaceWith(moved);
    moved = null;
    placeholder = null;
    root!.append(dialog);
    dialog.classList.remove('at-figure-dialog');
    preview.classList.remove('is-zoomed');
    preview.style.removeProperty('--at-chart-width');
    zoom.setAttribute('aria-pressed', 'false');
    zoom.textContent = en ? 'Zoom +' : 'Agrandir +';
    zoomControls.hidden = true;
    preview.replaceChildren();
  }
  function openPreview(title: string, trigger: HTMLElement) {
    opener = trigger;
    heading.textContent = title;
    selectionButton.hidden = true;
    dialog.showModal();
    close.focus();
  }
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    restoreFigure();
    opener?.focus({ preventScroll: true });
  });
  // Restore synchronously before the browser takes its print snapshot.
  window.addEventListener('beforeprint', () => {
    if (dialog.open) dialog.close();
    restoreFigure();
  });
  zoom.addEventListener('click', () => {
    const enlarged = preview.classList.toggle('is-zoomed');
    if (enlarged) preview.style.setProperty('--at-chart-width', `${Math.max(figureWidth, preview.clientWidth * 1.5, 900)}px`);
    else preview.style.removeProperty('--at-chart-width');
    zoom.setAttribute('aria-pressed', String(enlarged));
    zoom.textContent = enlarged ? (en ? 'Fit to window' : 'Ajuster à la fenêtre') : (en ? 'Zoom +' : 'Agrandir +');
  });

  function addLink(list: HTMLElement, text: string, href: string, local = false) {
    const url = articleToolUrl(href, location.href);
    if (!url) return;
    const item = document.createElement('li');
    const link = document.createElement('a');
    link.href = url.href;
    link.textContent = text;
    if (local) link.addEventListener('click', () => {
      const id = articleReferenceId(url.href, location.href);
      const target = figureTargets.get(url.href) || (id ? document.getElementById(id) : null);
      if (target) {
        const previous = target.getAttribute('tabindex');
        target.setAttribute('tabindex', '-1');
        target.addEventListener('blur', () => {
          if (previous === null) target.removeAttribute('tabindex');
          else target.setAttribute('tabindex', previous);
        }, { once: true });
        opener = target;
      }
      dialog.close();
    });
    else { link.target = '_blank'; link.rel = 'noopener noreferrer'; }
    item.append(link);
    list.append(item);
  }
  document.addEventListener('click', (event) => {
    if (!supportsDialog || event.defaultPrevented || event.button || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href]') : null;
    if (!link || dialog.contains(link)) return;
    const term = terms.get(link.href);
    const referenceId = body!.contains(link) ? articleReferenceId(link.getAttribute('href') || '', location.href) : null;
    let reference = referenceId ? document.getElementById(referenceId) : null;
    // Older analyses place an empty anchor before a paragraph or inside a list item.
    if (reference && !reference.textContent?.trim()) {
      const container = reference.closest<HTMLElement>('li,p');
      if (container?.textContent?.trim()) reference = container;
      else {
        let next = (container || reference).nextElementSibling;
        for (let count = 0; count < 8 && next?.matches('span[id]') && !next.textContent?.trim(); count++) next = next.nextElementSibling;
        reference = next instanceof HTMLElement && next.matches('p,li') ? next : null;
      }
    }
    if (!term && (!reference || !body!.contains(reference))) return;
    event.preventDefault();
    restoreFigure();
    const text = document.createElement('p');
    text.textContent = term ? term.textContent : (reference!.innerText || reference!.textContent || '').replace(/\s+/g, ' ').trim();
    preview.append(text);
    const links = document.createElement('ul');
    links.className = 'at-dialog-links';
    if (term) {
      addLink(links, en ? 'Read the glossary entry' : 'Lire la fiche du glossaire', link.href, true);
    } else {
      const seen = new Set<string>();
      for (const source of reference!.querySelectorAll<HTMLAnchorElement>('a[href]')) {
        const url = articleToolUrl(source.getAttribute('href') || '', location.href);
        if (!url || (url.origin === location.origin && url.pathname === location.pathname && url.search === location.search) || seen.has(url.href)) continue;
        seen.add(url.href);
        addLink(links, source.textContent?.trim() || url.hostname, url.href);
      }
      addLink(links, en ? 'View in the bibliography' : 'Voir dans la bibliographie', link.href, true);
    }
    preview.append(links);
    openPreview(term ? `${term.dataset.label} · ${term.dataset.name}` : `Source ${link.textContent?.trim() || ''}`, link);
  });

  for (const link of body.querySelectorAll<HTMLAnchorElement>('a[href]')) {
    if (link.closest('svg')) continue;
    const url = articleToolUrl(link.getAttribute('href') || '', location.href);
    if (!url) continue;
    const id = articleReferenceId(url.href, location.href);
    if (id && body.contains(document.getElementById(id)) && (link.textContent?.length || 0) <= 32) link.classList.add('at-source-link');
    else if (terms.has(url.href)) link.classList.add('at-glossary-link');
    else if (url.origin === location.origin && /^\/(?:posts|en\/analysis)\/[^/]+\/$/.test(url.pathname)) link.classList.add('at-analysis-link');
  }

  if (supportsDialog) {
    const figures = new Set<Element>();
    for (const svg of body.querySelectorAll<SVGSVGElement>('svg[viewBox]')) {
      if (svg.closest('svg svg') || svg.getAttribute('aria-hidden') === 'true' || svg.viewBox.baseVal.width < 200) continue;
      const figure = svg.closest('figure') || svg;
      if (figures.has(figure)) continue;
      figures.add(figure);
      const number = String(figures.size).padStart(2, '0');
      const title = svg.querySelector('title')?.textContent?.trim() || `${en ? 'Figure' : 'Graphique'} ${number}`;
      const row = document.createElement('div');
      row.className = 'at-figure-header';
      row.dataset.pagefindIgnore = '';
      row.id = `l0g-figure-${number}`;
      while (document.getElementById(row.id)) row.id += '-';
      const label = document.createElement('span');
      label.textContent = `${en ? 'Figure' : 'Graphique'} ${number}`;
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'at-action at-figure-action';
      button.textContent = en ? 'Enlarge' : 'Agrandir';
      button.setAttribute('aria-label', `${en ? 'Enlarge' : 'Agrandir'} : ${title}`);
      button.setAttribute('aria-haspopup', 'dialog');
      button.dataset.pagefindIgnore = '';
      row.append(label, button);
      figure.before(row);
      const href = new URL(`#${row.id}`, location.href).href;
      figureTargets.set(href, row);
      figureEntries.push({ title: `${number} · ${title}`, href });
      button.addEventListener('click', () => {
        restoreFigure();
        const visible = Array.from(figure.querySelectorAll<SVGSVGElement>('svg')).find((item) => item.getBoundingClientRect().width > 0) || svg;
        const title = visible.querySelector('title')?.textContent || (en ? 'Figure' : 'Graphique');
        figureWidth = Math.min(2400, Math.max(900, visible.viewBox.baseVal.width));
        placeholder = document.createComment('article figure position');
        figure.before(placeholder, dialog);
        moved = figure;
        preview.append(figure);
        dialog.classList.add('at-figure-dialog');
        zoomControls.hidden = false;
        openPreview(title, button);
      });
    }
    indexButton.hidden = figureEntries.length < 2;
    indexButton.addEventListener('click', () => {
      restoreFigure();
      const links = document.createElement('ul');
      links.className = 'at-dialog-links';
      for (const figure of figureEntries) addLink(links, figure.title, figure.href, true);
      preview.append(links);
      openPreview(en ? 'Figures in this analysis' : 'Graphiques de l’analyse', indexButton);
    });
  }

  function captureSelection(event: Event) {
    if (event.target instanceof Element && event.target.closest('[data-article-tools], .at-dialog')) return;
    const selected = window.getSelection();
    if (!selected || selected.isCollapsed || !selected.rangeCount || !body!.contains(selected.anchorNode) || !body!.contains(selected.focusNode)) {
      excerpt = null;
      selectionButton.hidden = true;
      return;
    }
    const start = selected.getRangeAt(0).startContainer;
    let section = '';
    for (const item of headings) {
      if (item.contains(start) || item.compareDocumentPosition(start) & Node.DOCUMENT_POSITION_FOLLOWING) section = item.id;
    }
    excerpt = articleExcerpt(selected.toString(), root!.dataset.title || '', canonical, section, en);
    selectionButton.hidden = !excerpt;
  }
  document.addEventListener('pointerup', captureSelection);
  document.addEventListener('keyup', captureSelection);
  for (const button of root.querySelectorAll<HTMLButtonElement>('[data-article-copy]')) {
    button.addEventListener('click', async () => {
      if (!excerpt) {
        status.textContent = en ? 'Select a passage in the analysis, then copy it with its title and section link.' : 'Sélectionnez un passage dans l’analyse, puis copiez-le avec son titre et le lien vers sa section.';
        return;
      }
      const text = excerpt;
      try {
        await navigator.clipboard.writeText(text);
        fallback.hidden = true;
        status.textContent = en ? 'Excerpt, title and section link copied.' : 'Extrait, titre et lien vers la section copiés.';
        selectionButton.hidden = true;
      } catch {
        fallback.value = text;
        fallback.hidden = false;
        status.textContent = en ? 'Automatic copying is unavailable. Copy the selected text below.' : 'La copie automatique est indisponible. Copiez le texte sélectionné ci-dessous.';
        fallback.focus();
        fallback.select();
      }
    });
  }
}
