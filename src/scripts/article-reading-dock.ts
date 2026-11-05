const dock = document.querySelector<HTMLElement>('[data-reading-dock]');
const header = document.querySelector<HTMLElement>('.post-head');
const body = document.querySelector<HTMLElement>('[data-reading-body]');
if (dock && header && body && 'IntersectionObserver' in window) {
  let passed = false; let reading = false;
  const render = () => { dock.hidden = !(passed && reading); if (dock.hidden) dock.querySelector('details')?.removeAttribute('open'); };
  new IntersectionObserver(([entry])=>{passed=!entry.isIntersecting && entry.boundingClientRect.bottom<0;render();}).observe(header);
  new IntersectionObserver(([entry])=>{reading=entry.isIntersecting;render();}).observe(body);
  dock.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{ dock.querySelector('details')?.removeAttribute('open'); if(a.getAttribute('href')==='#article-source-files')document.querySelector('#article-source-files details')?.setAttribute('open',''); }));
  const figures = dock.querySelector<HTMLButtonElement>('[data-dock-figures]')!;
  const update = () => { figures.hidden = !document.querySelector('.at-figure-action'); };
  const observer = new MutationObserver(() => { update(); if (!figures.hidden) observer.disconnect(); });
  observer.observe(body,{childList:true,subtree:true}); update(); if (!figures.hidden) observer.disconnect();
  figures.addEventListener('click',()=>{dock.querySelector('details')?.removeAttribute('open');document.querySelector('[data-article-dialog]')?.addEventListener('close',()=>figures.focus({preventScroll:true}),{once:true});document.querySelector<HTMLButtonElement>('[data-article-index]')?.click();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')dock.querySelector('details')?.removeAttribute('open');});
}
