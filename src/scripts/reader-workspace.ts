import { readWorkspace, writeWorkspaceItem, WORKSPACE_KEY, WORKSPACE_EVENT, validFigureAnchor, bookChapters, type CompletedReading, type SavedFigure, type ReadingChapter } from '../lib/reader-workspace.ts';
import { isReadingPath, readingTitle } from '../lib/reading-position.ts';
import { loadReadingStyles } from '../lib/reading-styles.ts';
import styles from '../styles/reader-workspace.css?url&no-inline';

const en = document.documentElement.lang === 'en';
const tr = (fr: string, english: string) => en ? english : fr;
function storage(): Storage | null { try { const value=localStorage;value.getItem(WORKSPACE_KEY);return value; } catch { return null; } }
const current = () => { const store=storage();return store?readWorkspace(store):{completed:[],figures:[]}; };
const label = (text: unknown) => typeof text === 'string' ? readingTitle(text.slice(0,160)) : undefined;
function identity(button: HTMLElement) {
  const owner=button.closest<HTMLElement>('[data-reader-path], [data-discovery-card]');
  return { path:button.dataset.readerPath ?? owner?.dataset.readerPath ?? owner?.dataset.path,
    title:label(button.dataset.readerTitle ?? owner?.dataset.readerTitle ?? owner?.dataset.title) };
}
function announce(button: HTMLElement, message: string) {
  const owner=button.closest('[data-reader-actions], [data-reading-library], [data-publication-progress], [data-reading-discovery]');
  const status=owner?.querySelector('[data-reader-status], [data-library-dialog-status], [data-discovery-status]');
  if(status)status.textContent=message;
}
function refreshButtons() {
  const state=current();
  for(const button of document.querySelectorAll<HTMLButtonElement>('[data-reader-toggle]')) {
    const {path,title}=identity(button);const done=state.completed.some(item=>item.path===path);
    button.setAttribute('aria-pressed',String(done));
    const text=done?tr('Lu','Read'):tr('Marquer comme lu','Mark as read');
    const node=button.querySelector('[data-reader-label]')??button;if(node.textContent!==text)node.textContent=text;
    button.setAttribute('aria-label',`${text}${title?' : '+title:''}`);
  }
  for(const button of document.querySelectorAll<HTMLButtonElement>('[data-figure-toggle]')) {
    const done=state.figures.some(item=>item.path===button.dataset.readerPath&&item.anchor===button.dataset.figureAnchor);
    button.setAttribute('aria-pressed',String(done));const text=done?tr('Graphique enregistré','Figure saved'):tr('Garder ce graphique','Save this figure');if(button.textContent!==text)button.textContent=text;
  }
}
function renderLibrary() {
  const state=current();
  for(const root of document.querySelectorAll<HTMLElement>('[data-reading-library]')) {
    const done=root.querySelector<HTMLElement>('[data-library-completed]');const figures=root.querySelector<HTMLElement>('[data-library-figures]');
    if(!done||!figures)continue;
    for(const [list,items,figure] of [[done,state.completed,false],[figures,state.figures,true]] as const) {
      list.replaceChildren();
      for(const item of items) {
        const row=document.createElement('li'),link=document.createElement('a'),remove=document.createElement('button');
        link.href=item.path+(figure?'#'+(item as SavedFigure).anchor:'');link.textContent=item.title;
        remove.type='button';remove.textContent=tr('Retirer','Remove');remove.setAttribute('aria-label',`${tr('Retirer','Remove')} : ${item.title}`);
        remove.dataset.readerPath=item.path;remove.dataset.readerTitle=item.title;
        if(figure){remove.dataset.figureRemove='';remove.dataset.figureAnchor=(item as SavedFigure).anchor;}else remove.dataset.readerRemove='';
        row.append(link,remove);list.append(row);
      }
      const empty=root.querySelector<HTMLElement>(figure?'[data-library-figures-empty]':'[data-library-completed-empty]');if(empty)empty.hidden=items.length>0;
    }
  }
}
const progress=document.querySelector<HTMLElement>('[data-publication-progress]');
let chapters:ReadingChapter[]=[];
function renderProgress() {
  if(!progress||!chapters.length)return;
  const completed=new Set(current().completed.map(item=>item.path));const count=chapters.filter(item=>completed.has(item.path)).length;
  progress.querySelector('[data-chapter-count]')!.textContent=tr(`${count} chapitre${count>1?'s':''} lu${count>1?'s':''} sur ${chapters.length}`,`${count} of ${chapters.length} chapters read`);
  const next=chapters.find(item=>!completed.has(item.path))??chapters[0];const link=progress.querySelector<HTMLAnchorElement>('[data-chapter-next]')!;
  link.href=next.path;link.textContent=`${count===chapters.length?tr('Relire','Read again'):count?tr('Continuer','Continue'):tr('Commencer','Start')} : ${next.title}`;
  const list=progress.querySelector('[data-chapter-list]')!;list.replaceChildren();
  for(const [index,item] of chapters.entries()) {
    const row=document.createElement('li'),a=document.createElement('a'),button=document.createElement('button');
    a.href=item.path;a.textContent=`${String(index+1).padStart(2,'0')} · ${item.title}`;
    button.type='button';button.dataset.readerToggle='';button.dataset.readerPath=item.path;button.dataset.readerTitle=item.title;
    row.append(a,button);list.append(row);
  }
  refreshButtons();
}
function refresh() { refreshButtons();renderLibrary();renderProgress(); }
document.addEventListener('click',event=>{
  if(!(event.target instanceof Element))return;
  if(event.target.closest('[data-library-open]'))renderLibrary();
  const figureLink=event.target.closest<HTMLAnchorElement>('[data-library-figures] a');
  if(figureLink&&!event.ctrlKey&&!event.metaKey&&!event.shiftKey&&!event.altKey&&event.button===0){
    figureLink.closest('dialog')?.close();
    if(figureLink.pathname===location.pathname&&validFigureAnchor(figureLink.hash.slice(1))){
      event.preventDefault();location.hash=figureLink.hash;
      requestAnimationFrame(()=>document.getElementById(figureLink.hash.slice(1))?.scrollIntoView({block:'start'}));
    }
  }
  const button=event.target.closest<HTMLButtonElement>('[data-reader-toggle], [data-reader-remove], [data-figure-toggle], [data-figure-remove]');if(!button)return;
  const {path,title}=identity(button);const store=storage();
  if(!store||!isReadingPath(path)||!title){announce(button,tr('Le stockage local est indisponible.','Browser storage is unavailable.'));return;}
  const figure=button.hasAttribute('data-figure-toggle')||button.hasAttribute('data-figure-remove');const anchor=button.dataset.figureAnchor;
  const state=current();const exists=figure?state.figures.some(item=>item.path===path&&item.anchor===anchor):state.completed.some(item=>item.path===path);
  const remove=exists||button.hasAttribute('data-reader-remove')||button.hasAttribute('data-figure-remove');
  if(figure&&!validFigureAnchor(anchor))return;
  const item:CompletedReading|SavedFigure={path,title,savedAt:Date.now(),...(figure?{anchor:anchor!}:{})};
  const list=button.closest('ul,ol');const position=list?Array.from(list.children).indexOf(button.closest('li')!):-1;
  if(!writeWorkspaceItem(store,figure?'figures':'completed',item,remove)){announce(button,tr('Enregistrement impossible : le stockage local est indisponible.','Unable to save: browser storage is unavailable.'));return;}
  const message=figure?(remove?tr('Graphique retiré.','Figure removed.'):tr('Graphique enregistré dans ce navigateur.','Figure saved in this browser.')):remove?tr('Marqué comme non lu.','Marked as unread.'):tr('Marqué comme lu dans ce navigateur.','Marked as read in this browser.');
  // Keep an explicit status and keyboard focus after lists are rebuilt.
  const status=button.closest('[data-reading-library], [data-publication-progress], [data-reader-actions], [data-reading-discovery]')?.querySelector('[data-reader-status], [data-library-dialog-status], [data-discovery-status]');
  button.focus({preventScroll:true});
  window.dispatchEvent(new CustomEvent(WORKSPACE_EVENT));if(status)status.textContent=message;
  if(list&&position>=0){const next=list.children[Math.min(position,list.children.length-1)]?.querySelector<HTMLElement>('button');(next??document.querySelector<HTMLElement>('[data-library-close]'))?.focus({preventScroll:true});}
});
window.addEventListener(WORKSPACE_EVENT,refresh);
window.addEventListener('storage',event=>{if(!event.key||event.key===WORKSPACE_KEY)refresh();});
document.addEventListener('l0g:discovery-updated',refreshButtons);
refresh();

const actions=document.querySelector<HTMLElement>('[data-reader-actions]');
if(actions||progress)void loadReadingStyles(styles).then(()=>{
  if(progress) {
    for(const script of Array.from(document.querySelectorAll('script[type="application/ld+json"]')).slice(0,12)) {
      if((script.textContent?.length??0)>1_000_000)continue;
      try {const value=JSON.parse(script.textContent??'null');const candidates=Array.isArray(value)?value:Array.isArray(value?.['@graph'])?value['@graph']:[value];
        for(const candidate of candidates.slice(0,100)){chapters=bookChapters(candidate);if(chapters.length)break;}
      }catch{/* A malformed metadata block cannot create chapter links. */}
      if(chapters.length)break;
    }
    if(chapters.length){renderProgress();progress.hidden=false;}
  }
  if(!actions)return;
  actions.hidden=false;
  const exit=document.querySelector<HTMLButtonElement>('[data-focus-exit]')!;document.body.append(exit);
  const toggle=actions.querySelector<HTMLButtonElement>('[data-focus-toggle]')!;
  const focusLabel=toggle.querySelector<HTMLElement>('[data-focus-label]')!;
  function setFocus(active:boolean,persist=false) {
    const body=document.querySelector('[data-reading-body]');
    const anchor=persist?Array.from(body?.children??[]).find(node=>{const box=node.getBoundingClientRect();return box.top<=100&&box.bottom>100;}):undefined;
    const top=anchor?.getBoundingClientRect().top;
    document.documentElement.toggleAttribute('data-reading-focus',active);exit.hidden=!active;toggle.setAttribute('aria-pressed',String(active));
    focusLabel.textContent=active?tr('Quitter la lecture immersive','Exit focus reading'):tr('Lecture immersive','Focus reading');
    if(anchor&&top!==undefined)requestAnimationFrame(()=>scrollBy(0,anchor.getBoundingClientRect().top-top));
    if(persist)try{localStorage.setItem('l0g-reading-focus-v1',active?'1':'0');}catch{announce(toggle,tr('Mode appliqué pour cette page ; préférence non enregistrée.','Mode applied for this page; preference could not be saved.'));}
  }
  try{setFocus(localStorage.getItem('l0g-reading-focus-v1')==='1');}catch{setFocus(false);}
  toggle.addEventListener('click',()=>setFocus(!document.documentElement.hasAttribute('data-reading-focus'),true));
  exit.addEventListener('click',()=>{setFocus(false,true);toggle.focus({preventScroll:true});});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!event.defaultPrevented&&!document.querySelector('dialog[open]')&&document.documentElement.hasAttribute('data-reading-focus')){setFocus(false,true);toggle.focus({preventScroll:true});}});
  if(location.hash==='#l0g-reading-position')document.dispatchEvent(new CustomEvent('l0g:reading-resume'));
  const body=document.querySelector<HTMLElement>('[data-reading-body]');let restored=false;
  function figures() {
    if(!body)return;
    for(const row of body.querySelectorAll<HTMLElement>('.at-figure-header')) {
      if(!validFigureAnchor(row.id)||row.querySelector('[data-figure-toggle]'))continue;
      const original=row.querySelector('[aria-label]');
      const title=label(original?.getAttribute('aria-label')?.replace(/^[^:]*:\s*/,''))??tr('Graphique','Figure')+' '+row.id.slice(11);
      const button=document.createElement('button');button.type='button';button.className='figure-save';button.dataset.figureToggle='';button.dataset.readerPath=actions!.dataset.readerPath;button.dataset.readerTitle=title;button.dataset.figureAnchor=row.id;
      row.append(button);
    }
    refreshButtons();
    if(!restored)try{const id=decodeURIComponent(location.hash.slice(1));const target=validFigureAnchor(id)?document.getElementById(id):null;if(target){restored=true;requestAnimationFrame(()=>target.scrollIntoView({block:'start'}));}}catch{/* Invalid URL fragment. */}
  }
  if(body){new MutationObserver(figures).observe(body,{childList:true,subtree:true});figures();}
}).catch(()=>{/* Static reading remains available when optional styles fail. */});
