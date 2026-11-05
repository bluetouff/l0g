import { localSearchHref } from '../lib/quick-search.ts';
import { loadReadingStyles } from '../lib/reading-styles.ts';
import styles from '../styles/quick-search.css?url&no-inline';
interface SearchData { url?: string; title?: string; plain_excerpt?: string; meta?: { title?: string; kind?: string }; }
interface SearchResult { data(): Promise<SearchData>; }
interface SearchIndex { options(value: {noWorker: boolean}): Promise<void>; init(): Promise<void>; search(query: string): Promise<{results: SearchResult[]}>; }
const en=document.documentElement.lang==='en';
const tr=(fr:string,english:string)=>en?english:fr;
const names:Record<string,string>={analysis:tr('Analyses','Analyses'),tool:tr('Outils','Tools'),glossary:tr('Définitions','Definitions'),guide:tr('Guides','Guides'),dossier:tr('Dossiers','Dossiers'),page:tr('Autres pages','Other pages')};
const fullSearch=en?'/en/search/':'/recherche/';
let dialog:HTMLDialogElement|undefined,input:HTMLInputElement,status:HTMLElement,results:HTMLElement,more:HTMLAnchorElement;
let previous:HTMLElement|null=null,index:Promise<SearchIndex>|undefined,request=0,timer:ReturnType<typeof setTimeout>;
function element<K extends keyof HTMLElementTagNameMap>(tag:K,text?:string) {const node=document.createElement(tag);if(text)node.textContent=text;return node;}
const localHref = (value: unknown) => localSearchHref(value,location.origin);
function loadIndex() {
  return index??=(async()=>{
    const path='/pagefind/pagefind.js';const module=await import(/* @vite-ignore */ path) as SearchIndex;
    await module.options({noWorker:true});await module.init();return module;
  })().catch(error=>{index=undefined;throw error;});
}
async function search() {
  const id=++request;const query=input.value.trim().slice(0,200);more.href=fullSearch+'?q='+encodeURIComponent(query);
  results.replaceChildren();results.removeAttribute('aria-busy');if(!query){status.textContent=tr('Analyses, outils, guides et définitions.','Analyses, tools, guides and definitions.');return;}
  status.textContent=tr('Recherche locale…','Searching locally…');results.setAttribute('aria-busy','true');
  try{
    const response=await(await loadIndex()).search(query);if(id!==request)return;
    const data=await Promise.all(response.results.slice(0,15).map(item=>item.data()));if(id!==request)return;
    const groups=new Map<string,SearchData[]>();
    for(const item of data){if(!localHref(item.url))continue;const kind=item.meta?.kind&&Object.hasOwn(names,item.meta.kind)?item.meta.kind:'page';const group=groups.get(kind)??[];if(group.length<4)group.push(item);groups.set(kind,group);}
    for(const kind of ['analysis','tool','glossary','guide','dossier','page']){
      const items=groups.get(kind);if(!items?.length)continue;
      const section=element('section'),heading=element('h3',names[kind]),list=element('ul');section.append(heading,list);
      for(const item of items){const li=element('li'),a=element('a');a.href=localHref(item.url)!;a.textContent=String(item.meta?.title??item.title??a.pathname).slice(0,500);li.append(a);if(typeof item.plain_excerpt==='string')li.append(element('p',item.plain_excerpt.replace(/\s+/g,' ').slice(0,230)));list.append(li);}
      results.append(section);
    }
    status.textContent=response.results.length?tr(`${response.results.length} résultats · sélection par format`,`${response.results.length} results · selection by format`):tr('Aucun résultat. Essayez un autre terme.','No results. Try another term.');
  }catch{if(id===request)status.textContent=tr('Recherche indisponible ici. Vous pouvez ouvrir la page de recherche complète.','Search is unavailable here. You can open the full search page.');}
  finally{if(id===request)results.removeAttribute('aria-busy');}
}
export async function openQuickSearch(opener:HTMLElement|null) {
  await loadReadingStyles(styles);
  if(!dialog){
    dialog=element('dialog');dialog.className='quick-search';dialog.setAttribute('aria-labelledby','quick-search-title');dialog.dataset.pagefindIgnore='';
    const header=element('header'),heading=element('h2',tr('Rechercher dans l0g','Search l0g')),close=element('button',tr('Fermer','Close'));
    heading.id='quick-search-title';close.type='button';header.append(heading,close);
    const form=element('form');form.setAttribute('role','search');const label=element('label',tr('Votre recherche','Search terms'));label.htmlFor='quick-search-input';
    input=element('input');input.id='quick-search-input';input.type='search';input.maxLength=200;input.autocomplete='off';input.spellcheck=false;input.placeholder=tr('Un mécanisme, un acteur, un sujet…','A mechanism, actor or subject…');
    form.append(label,input);status=element('p');status.setAttribute('role','status');status.setAttribute('aria-live','polite');results=element('div');results.className='quick-search-results';
    more=element('a',tr('Ouvrir la recherche complète ↗','Open full search ↗'));more.href=fullSearch;more.className='quick-search-more';
    dialog.append(header,form,status,results,more,element('small',tr('Recherche dans votre navigateur, sans suivi.','Search in your browser, without tracking.')));document.body.append(dialog);
    dialog.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();dialog!.close();}});
    close.addEventListener('click',()=>dialog!.close());dialog.addEventListener('close',()=>{++request;clearTimeout(timer);previous?.focus({preventScroll:true});});
    form.addEventListener('submit',event=>{event.preventDefault();clearTimeout(timer);void search();});input.addEventListener('input',()=>{clearTimeout(timer);++request;timer=setTimeout(()=>void search(),180);});
    dialog.addEventListener('click',event=>{if(event.target===dialog){const box=dialog!.getBoundingClientRect();if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)dialog!.close();}});
  }
  if(!dialog.open){previous=opener;dialog.showModal();}
  input.focus();void search();
}
