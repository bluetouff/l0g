import type { ArticleEvidence } from './article-evidence.ts';
export function externalDocument(href: string): boolean {
  try { const u = new URL(href); return u.protocol === 'https:' && !u.username && !u.password && !['l0g.fr','www.l0g.fr'].includes(u.hostname); }
  catch { return false; }
}
export function selectSourceFiles(evidence: ArticleEvidence) {
  const seen = new Set<string>();
  const rows = [...evidence.claims].sort((a,b)=>Number(b.reviewStatus==='reviewed')-Number(a.reviewStatus==='reviewed'))
    .flatMap(claim=>claim.references.filter(ref=>externalDocument(ref.href)).map(ref=>({claim,ref})))
    .filter(({ref})=>{if(seen.has(ref.href))return false;seen.add(ref.href);return true;}).slice(0,3);
  const fallback = evidence.primary.flatMap(item=>item.links).filter(ref=>externalDocument(ref.href))
    .filter((ref,i,all)=>all.findIndex(r=>r.href===ref.href)===i).slice(0,3);
  return { rows, fallback };
}
