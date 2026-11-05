let pending: Promise<typeof import('./quick-search.ts')> | undefined;
const fullSearch = () => document.documentElement.lang === 'en' ? '/en/search/' : '/recherche/';
function open(opener: HTMLElement | null) {
  pending ??= import('./quick-search.ts');
  void pending.then(module=>module.openQuickSearch(opener)).catch(()=>{pending=undefined;location.assign(fullSearch()+'?focus=1');});
}
document.addEventListener('click',event=>{
  if(event.defaultPrevented||event.button||event.ctrlKey||event.metaKey||event.altKey||event.shiftKey)return;
  const link=event.target instanceof Element?event.target.closest<HTMLAnchorElement>('a.nav-search, a.mobile-search, a.en-search'):null;
  if(!link||typeof HTMLDialogElement==='undefined'||typeof HTMLDialogElement.prototype.showModal!=='function'||location.pathname===fullSearch())return;
  event.preventDefault();open(link);
},true);
document.addEventListener('keydown',event=>{
  if(event.defaultPrevented||event.altKey)return;
  const target=event.target instanceof Element?event.target:null;
  if(target?.closest('input,textarea,select,[contenteditable="true"]'))return;
  const shortcut=event.key==='/'&&!event.ctrlKey&&!event.metaKey||event.key.toLowerCase()==='k'&&(event.metaKey||event.ctrlKey);
  if(!shortcut||typeof HTMLDialogElement==='undefined'||typeof HTMLDialogElement.prototype.showModal!=='function')return;
  if(location.pathname===fullSearch())return;
  event.preventDefault();event.stopImmediatePropagation();
  if(document.querySelector('dialog[open]:not(.quick-search)'))return;
  open(document.activeElement instanceof HTMLElement?document.activeElement:null);
},true);
