import { loadReadingStyles } from '../lib/reading-styles.ts';
import styles from '../styles/publication-library.css?url&no-inline';
const root=document.querySelector<HTMLElement>('[data-publication-library]');
if(root)void loadReadingStyles(styles).then(()=>initialize(root)).catch(()=>{/* The original six-edition page and pagination remain usable. */});
function initialize(root: HTMLElement) {
  const en=root.dataset.lang==='en';const tr=(fr:string,english:string)=>en?english:fr;
  const templates=Array.from(root.querySelectorAll<HTMLTemplateElement>('[data-publication-template]'));
  const size=Number(root.dataset.pageSize);const page=Number(root.dataset.currentPage);
  if(!Number.isInteger(size)||size<1||size>20||!Number.isInteger(page)||page<1)return;
  const results=root.querySelector<HTMLElement>('[data-publication-results]')!,fallback=root.querySelector<HTMLElement>('[data-publication-fallback]')!;
  const topic=root.querySelector<HTMLSelectElement>('[data-publication-topic]')!,more=root.querySelector<HTMLButtonElement>('[data-publication-more]')!;
  const pagination=root.closest('section')?.querySelector<HTMLElement>('[data-publication-pagination]');
  let view='covers',visible=size;
  try{if(localStorage.getItem('l0g-publication-view-v1')==='details')view='details';}catch{/* Session-only preference. */}
  function render() {
    const selected=templates.filter(item=>!topic.value||item.dataset.topics?.split(' ').includes(topic.value));
    const shown=topic.value?selected.slice(0,visible):selected.slice((page-1)*size,page*size);
    root.dataset.view=view;
    results.replaceChildren(...shown.map(item=>item.content.cloneNode(true)));results.hidden=false;fallback.hidden=true;
    more.hidden=!topic.value||shown.length>=selected.length;if(pagination)pagination.hidden=!!topic.value;
    root.querySelector('[data-publication-status]')!.textContent=topic.value
      ?tr(`${selected.length} publication${selected.length>1?'s':''} · ${shown.length} affichée${shown.length>1?'s':''} · tout le catalogue`,`${selected.length} editions · ${shown.length} shown · full catalogue`)
      :tr(`${shown.length} publications · page ${page} · ${templates.length} éditions au total`,`${shown.length} editions · page ${page} · ${templates.length} in total`);
    for(const button of root.querySelectorAll<HTMLButtonElement>('[data-publication-view]'))button.setAttribute('aria-pressed',String(button.dataset.publicationView===view));
  }
  root.querySelector<HTMLElement>('[data-publication-controls]')!.hidden=false;
  root.addEventListener('click',event=>{
    const button=event.target instanceof Element?event.target.closest<HTMLElement>('[data-publication-view]'):null;if(!button)return;
    view=button.dataset.publicationView==='details'?'details':'covers';try{localStorage.setItem('l0g-publication-view-v1',view);}catch{/* Keep the view for this page. */}render();
  });
  topic.addEventListener('change',()=>{visible=size;render();});
  more.addEventListener('click',()=>{visible+=size;render();});
  root.querySelector('[data-publication-reset]')!.addEventListener('click',()=>{topic.value='';visible=size;render();});
  render();
}
