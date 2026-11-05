import { readWorkspace, WORKSPACE_EVENT, WORKSPACE_KEY } from '../lib/reader-workspace.ts';
import { LIBRARY_STORAGE_KEY, readSavedArticles, writeSavedArticle } from '../lib/reading-library.ts';
import { isReadingPath, readingTitle } from '../lib/reading-position.ts';
import { filterDiscovery, validDiscoveryEntry, visitTime, VISIT_STORAGE_KEY, type DiscoveryEntry } from '../lib/reading-discovery-model.ts';
import { loadReadingStyles } from '../lib/reading-styles.ts';
import styles from '../styles/reading-discovery.css?url&no-inline';
const root = document.querySelector<HTMLElement>('[data-reading-discovery]');
if (root) void loadReadingStyles(styles).then(() => initialize(root)).catch(() => { /* The static feed and pagination remain usable. */ });
function initialize(root: HTMLElement) {
  const form = root.querySelector<HTMLFormElement>('form')!;
  const results = root.querySelector<HTMLElement>('[data-discovery-results]')!;
  const template = root.querySelector<HTMLTemplateElement>('template')!;
  const status = root.querySelector<HTMLElement>('[data-discovery-status]')!;
  const more = root.querySelector<HTMLButtonElement>('[data-discovery-more]')!;
  const pagination = document.querySelector<HTMLElement>('[data-discovery-pagination]');
  const initial = Array.from(results.children);
  const visitCopy = root.querySelector<HTMLElement>('[data-visit-copy]')!;
  const visitFilter = root.querySelector<HTMLButtonElement>('[data-visit-filter]')!;
  let marker: number | undefined; let since: number | undefined; let visible = 20; let request = 0;
  let catalog: Promise<DiscoveryEntry[]> | undefined;
  const load = () => catalog ??= (async () => {
    try {
      const response = await fetch('/api/v1/reading-catalog.json',{cache:'no-cache'});
      if (!response.ok) throw new Error('catalogue indisponible');
      const body = await response.text(); if (body.length > 5_000_000) throw new Error('catalogue trop volumineux');
      const data = JSON.parse(body);
      if (data?.version !== 1 || !Array.isArray(data.entries) || data.entries.length > 2000 || !data.entries.every(validDiscoveryEntry)) throw new Error('catalogue invalide');
      return data.entries as DiscoveryEntry[];
    } catch (e) { catalog = undefined; throw e; }
  })();
  function updateSaved() {
    document.dispatchEvent(new CustomEvent('l0g:discovery-updated'));
    let paths: Set<string> | undefined;
    try { paths = new Set(readSavedArticles(localStorage).map(e=>e.path)); } catch { /* storage unavailable */ }
    for (const card of results.querySelectorAll<HTMLElement>('[data-discovery-card]')) {
      card.querySelector<HTMLElement>('.discovery-actions')!.hidden = false;
      const button = card.querySelector<HTMLButtonElement>('[data-card-save]')!;
      button.hidden = false; const saved = paths?.has(card.dataset.path ?? '') ?? false;
      button.setAttribute('aria-pressed', String(saved));
      card.querySelector('[data-save-label]')!.textContent = saved ? 'Dans ma liste' : 'À lire plus tard';
      const badge = card.querySelector<HTMLElement>('[data-card-new]')!;
      const published = Date.parse(card.dataset.published ?? ''); const updated = Date.parse(card.dataset.updated ?? '');
      badge.hidden = marker === undefined || !(published > marker || updated > marker);
      badge.textContent = marker !== undefined && published > marker ? 'Nouveau depuis votre passage' : 'Mis à jour depuis votre passage';
    }
  }
  const date = (value: string) => new Date(value).toLocaleDateString('fr-FR',{day:'numeric',month:'short',year:'numeric',timeZone:'Europe/Paris'});
  function fillPreview(preview: HTMLElement, summary: NonNullable<DiscoveryEntry['summary']>) {
    for (const node of preview.querySelectorAll<HTMLElement>('[data-summary-field]')) node.textContent = summary[node.dataset.summaryField as keyof typeof summary];
    preview.querySelector<HTMLElement>('dl')!.hidden = false;
    preview.querySelector<HTMLElement>('[data-preview-message]')!.hidden = true;
    preview.dataset.ready = 'true';
  }
  function cardFor(entry: DiscoveryEntry, index: number) {
    const card = template.content.firstElementChild!.cloneNode(true) as HTMLElement;
    card.querySelector('.feed-index')!.textContent = String(index+1).padStart(2,'0');
    card.dataset.path = entry.path; card.dataset.title = entry.title; card.dataset.published = entry.published;
    card.dataset.updated = entry.updated ?? '';
    card.querySelector<HTMLAnchorElement>('.feed-item')!.href = entry.path;
    card.querySelector('.feed-title')!.textContent = entry.title; card.querySelector('.feed-desc')!.textContent = entry.description;
    const meta = card.querySelector('.feed-meta')!; meta.replaceChildren();
    const time = document.createElement('time'); time.dateTime = entry.published; time.textContent = date(entry.published); meta.append(time);
    if (entry.updated && Date.parse(entry.updated)>Date.parse(entry.published)) { const update = document.createElement('span'); update.textContent = `Mis à jour le ${date(entry.updated)}`; meta.append(update); }
    const details = document.createElement('span'); details.textContent = `${entry.minutes} min · ${entry.topicLabel}`; meta.append(details);
    const preview = card.querySelector<HTMLElement>('[data-card-preview]')!; preview.hidden = !entry.summary;
    if (entry.summary) fillPreview(preview,entry.summary);
    const revision = card.querySelector<HTMLElement>('[data-card-revision]')!; revision.hidden = !entry.revisionNote; revision.textContent = entry.revisionNote ? `Révision : ${entry.revisionNote}` : '';
    const tool = card.querySelector<HTMLAnchorElement>('[data-card-tool]')!; tool.hidden = !entry.tool;
    if (entry.tool) tool.href = entry.tool; else tool.removeAttribute('href');
    card.querySelector('[data-card-save]')!.setAttribute('aria-label',`Garder pour plus tard : ${entry.title}`);
    return card;
  }
  async function render() {
    const id = ++request;
    const data = new FormData(form);
    const hideRead = data.has('unread');
    const filter = { topic: String(data.get('topic') ?? ''), duration: String(data.get('duration') ?? ''), tool: data.has('tool'), since };
    if (!filter.topic && !filter.duration && !filter.tool && !hideRead && since === undefined) {
      results.replaceChildren(...initial); more.hidden = true; if (pagination) pagination.hidden = false;
      status.textContent = ''; results.removeAttribute('aria-busy'); updateSaved(); return;
    }
    results.setAttribute('aria-busy','true'); status.textContent = 'Recherche dans toutes les archives…';
    try {
      const entries = await load(); if (id !== request) return;
      const completed = new Set<string>();
      let storageWarning = '';
      if (hideRead) { try { localStorage.getItem(WORKSPACE_KEY); for (const item of readWorkspace(localStorage).completed) completed.add(item.path); } catch { storageWarning = ' Le suivi local est indisponible : aucun article masqué.'; } }
      const selected = filterDiscovery(entries,filter).filter(item=>!hideRead||!completed.has(item.path));
      const active = document.activeElement instanceof HTMLElement && document.activeElement.matches('[data-reader-toggle]') ? document.activeElement.closest('[data-discovery-card]') : null;
      const activeIndex = active ? Array.from(results.children).indexOf(active) : -1;
      results.replaceChildren(...selected.slice(0,visible).map(cardFor)); more.hidden = selected.length <= visible;
      if (pagination) pagination.hidden = true;
      status.textContent = selected.length ? `${selected.length} analyse${selected.length>1?'s':''} · ${Math.min(visible,selected.length)} affichée${Math.min(visible,selected.length)>1?'s':''} · toutes les archives` : 'Aucune analyse ne correspond. Essayez une autre sélection.';
      status.textContent += storageWarning;
      updateSaved();
      if (activeIndex >= 0) (results.children[Math.min(activeIndex,results.children.length-1)]?.querySelector<HTMLElement>('[data-reader-toggle]') ?? form.querySelector<HTMLElement>('[name=unread]'))?.focus({preventScroll:true});
    } catch { if (id === request) { status.textContent = 'Le catalogue est indisponible. Les dernières analyses restent accessibles ; vous pouvez réessayer.'; results.replaceChildren(...initial); if (pagination) pagination.hidden = false; more.hidden = true; updateSaved(); } }
    finally { if (id === request) results.removeAttribute('aria-busy'); }
  }
  results.addEventListener('toggle', async event => {
    const preview = event.target;
    if (!(preview instanceof HTMLDetailsElement) || !preview.matches('[data-card-preview]') || !preview.open || preview.dataset.ready) return;
    const path = preview.closest<HTMLElement>('[data-discovery-card]')?.dataset.path;
    const message = preview.querySelector<HTMLElement>('[data-preview-message]')!;
    message.textContent = 'Chargement du résumé…';
    try { const entry = (await load()).find(e=>e.path===path); if (!entry?.summary) throw new Error('summary unavailable'); fillPreview(preview,entry.summary); }
    catch { message.replaceChildren(); const link=document.createElement('a'); if(isReadingPath(path))link.href=path+'#quick-take-title'; link.textContent='Résumé indisponible ici. Ouvrir l’analyse ↗'; message.append(link); }
  },true);
  form.hidden = false;
  form.addEventListener('submit',e=>e.preventDefault());
  form.addEventListener('change',()=>{visible=20;void render();});
  form.addEventListener('reset',event=>{event.preventDefault();for(const select of form.querySelectorAll('select'))select.value='';for(const checkbox of form.querySelectorAll<HTMLInputElement>('input[type=checkbox]')) checkbox.checked=false;since=undefined;visible=20;void render();});
  more.addEventListener('click',()=>{visible+=20;void render();});
  root.addEventListener('click', e=> {
    const button = e.target instanceof Element ? e.target.closest<HTMLButtonElement>('[data-card-save]') : null;
    const card = button?.closest<HTMLElement>('[data-discovery-card]'); if (!card) return;
    const path = card.dataset.path; const title = readingTitle(card.dataset.title);
    try {
      if (!isReadingPath(path) || !title) throw new Error('invalid reading');
      const saved = readSavedArticles(localStorage).some(e=>e.path===path);
      if (!writeSavedArticle(localStorage,path,saved?null:{path,title,savedAt:Date.now()})) throw new Error('storage unavailable');
      updateSaved(); window.dispatchEvent(new StorageEvent('storage',{key:LIBRARY_STORAGE_KEY}));
      status.textContent = saved ? 'Article retiré de votre liste.' : 'Article gardé dans ce navigateur.';
    } catch { status.textContent = 'Le stockage du navigateur est indisponible. Votre liste n’a pas été modifiée.'; }
  });
  document.addEventListener('close',updateSaved,true);
  window.addEventListener('storage',e=>{if (!e.key || e.key===LIBRARY_STORAGE_KEY) updateSaved();if (!e.key || e.key===WORKSPACE_KEY) refreshRead();});
  function refreshRead() { if (form.querySelector<HTMLInputElement>('[name=unread]')?.checked) void render(); else updateSaved(); }
  window.addEventListener(WORKSPACE_EVENT,refreshRead);
  async function visitSummary() {
    visitFilter.hidden = true;
    if (marker === undefined) { visitCopy.textContent = 'Votre repère commence ici, sur cet appareil. Aucun compte ni suivi distant.'; return; }
    visitCopy.textContent = `Repère local : ${date(new Date(marker).toISOString())}.`;
    try { const entries = await load(); const count = filterDiscovery(entries,{topic:'',duration:'',tool:false,since:marker}).length;
      visitCopy.textContent = count ? `${count} analyse${count>1?'s nouvelles ou révisées':' nouvelle ou révisée'} depuis votre repère.` : 'Vous êtes à jour : aucune analyse nouvelle ou révisée depuis votre repère.'; visitFilter.hidden = count===0;
    } catch { visitCopy.textContent += ' Le décompte est momentanément indisponible.'; }
  }
  try {
    marker = visitTime(localStorage.getItem(VISIT_STORAGE_KEY));
    if (marker === undefined) localStorage.setItem(VISIT_STORAGE_KEY,new Date().toISOString());
    root.querySelector<HTMLElement>('[data-visit-panel]')!.hidden=false; void visitSummary();
  } catch { /* No false claim that a marker was saved. */ }
  visitFilter.addEventListener('click',()=>{since=marker;visible=20;void render();});
  root.querySelector('[data-visit-mark]')!.addEventListener('click',()=>{
    try {const now = Date.now();localStorage.setItem(VISIT_STORAGE_KEY,new Date(now).toISOString());marker=now;since=undefined;void visitSummary();updateSaved();void render();}
    catch {visitCopy.textContent='Le stockage du navigateur est indisponible : repère non modifié.';}
  });
  updateSaved();
  for (const preview of results.querySelectorAll<HTMLElement>('[data-card-preview]')) preview.hidden = false;
}
