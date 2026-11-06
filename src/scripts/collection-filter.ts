import { collectionQuery, collectionMatches } from '../lib/collection-filter.ts';

for (const form of document.querySelectorAll<HTMLFormElement>('[data-collection-filter]')) {
  const input=form.querySelector<HTMLInputElement>('input')!;
  const status=form.querySelector<HTMLElement>('[role=status]')!;
  const cards=Array.from(form.closest('[data-filter-collection]')?.querySelectorAll<HTMLElement>('[data-filter-card]')??[]);
  if(!cards.length)continue;
  const text=new Map(cards.map(card=>[card,card.dataset.filterText??card.textContent??'']));
  const collection=form.closest('[data-filter-collection]')!;
  const groups=Array.from(collection.querySelectorAll<HTMLElement>('[data-filter-group]'));
  const targets=Array.from(collection.querySelectorAll<HTMLAnchorElement>('[data-filter-target]'));
  const en=form.dataset.lang==='en';
  function render() {
    const words=collectionQuery(input.value);let count=0;
    for(const card of cards){const visible=collectionMatches(text.get(card)!,words);card.hidden=!visible;if(visible)count++;}
    for(const group of groups)group.hidden=!cards.some(card=>group.contains(card)&&!card.hidden);
    for(const target of targets)target.hidden=groups.find(group=>group.id===target.dataset.filterTarget)?.hidden??false;
    status.textContent=count ? (en?`${count} of ${cards.length} entries`:`${count} résultat${count>1?'s':''} sur ${cards.length}`) : (en?'No result. Try another term.':'Aucun résultat. Essayez un autre terme.');
  }
  form.hidden=false;render();
  form.addEventListener('submit',event=>event.preventDefault());
  input.addEventListener('input',render);
  form.addEventListener('reset',event=>{event.preventDefault();input.value='';render();input.focus();});
}
