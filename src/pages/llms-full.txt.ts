import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { glossaryEntries } from '../config/glossary.ts';

/**
 * /llms-full.txt — corpus integral pour agents IA (convention llmstxt.org).
 * Texte complet de toutes les analyses et guides, infographies SVG retirees,
 * Markdown aplati en texte. Genere au build. Borne souple par document pour ne
 * pas saturer une fenetre de contexte.
 */

const SITE = 'https://l0g.fr';
const MAX_PER_DOC = 24000; // garde-fou par document

function toPlain(md: string): string {
  return String(md || '')
    .replace(/<figure[\s\S]*?<\/figure>/gi, '') // infographies SVG
    .replace(/<[^>]+>/g, '') // autres balises eventuelles
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '') // images
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1') // liens -> texte
    .replace(/^\s*#{1,6}\s*/gm, '') // titres
    .replace(/[*_`>]/g, '') // emphase, citations, code
    .replace(/\s*[—–]\s*/g, ' · ') // tirets cadratins/demi : separateur maison
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export const GET: APIRoute = async () => {
  const posts = (await getCollection('posts', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime()
  );
  const guides = (await getCollection('guides', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime()
  );
  const d = (x?: Date) => (x ? x.toISOString().slice(0, 10) : '');
  const SEP = '\n\n' + '='.repeat(76) + '\n';

  const out: string[] = [];
  out.push('# l0g.fr · corpus integral');
  out.push('');
  out.push(
    '> l0g est un systeme d\'audit open source des narratifs economiques. Texte complet ' +
      'des analyses et guides, infographies retirees. Chiffres verifies sur source primaire. ' +
      'Licence CC BY 4.0, attribution l0g.fr. Pas un conseil en investissement.'
  );
  out.push('');
  out.push(`Genere le ${new Date().toISOString()}. ${guides.length} guides, ${posts.length} analyses.`);
  out.push(`Carte concise : ${SITE}/llms.txt`);
  out.push(SEP);
  out.push('MANIFESTE : Manifeste l0g');
  out.push(`URL : ${SITE}/manifeste/`);
  out.push('-'.repeat(76));
  out.push(
    "l0g est un atelier de risk intelligence construit sur une idee simple : une analyse utile doit pouvoir etre interrogee, refaite, contredite et datee. Le projet rend l'opacite lisible a partir de sources primaires, expose ses methodes, assume ses limites et refuse les signaux magiques, le conseil en investissement, les boites noires et le tracking inutile."
  );
  out.push(SEP);
  out.push('TERMINAL : Terminal l0g');
  out.push(`URL : ${SITE}/terminal/`);
  out.push('-'.repeat(76));
  out.push(
    "Interface de navigation en ligne de commande pour explorer l0g : help, ls, cat manifeste, open dashboards, open methodologie, open api, curl risk. Elle donne un acces rapide aux pages de methode, aux outils, aux sources, a l'API et au corpus machine."
  );
  out.push(SEP);
  out.push('STATUS : Statut & intégrité');
  out.push(`URL : ${SITE}/status/`);
  out.push('-'.repeat(76));
  out.push(
    "Page de controle public du site : date de build statique, compte des articles et guides, presence des snapshots risk.json, confluence.json et risk-events.json, liste des endpoints API et corpus machine, garanties zero tracker maison et limites de fraicheur des donnees."
  );
  out.push(SEP);
  out.push('DONNEES : Inventaire des jeux de donnees');
  out.push(`URL : ${SITE}/donnees/`);
  out.push('-'.repeat(76));
  out.push(
    "Inventaire des snapshots publics et endpoints l0g : risk.json, confluence.json, risk-events.json, catalog.json, llms.txt, llms-full.txt, rss.xml et risk.xml. Precise licence CC BY 4.0, attribution, cadence best-effort et limites de fraicheur."
  );
  out.push(SEP);
  out.push('PREUVES : Changelog et artefacts verifiables');
  out.push(`URL : ${SITE}/preuves/`);
  out.push('-'.repeat(76));
  out.push(
    "Page de tracabilite publique : derniers commits Git, artefacts publies, security.txt, lockfile, configuration Apache durcie, fraicheur des snapshots et liens de verification vers GitHub."
  );
  out.push(SEP);
  out.push('GLOSSAIRE : Sigles et notions');
  out.push(`URL : ${SITE}/glossaire/`);
  out.push('-'.repeat(76));
  for (const term of glossaryEntries) {
    out.push(`${term.sigle} (${term.nom})`);
    out.push(`URL : ${SITE}${term.url}`);
    out.push(`Categorie : ${term.sectionTitle}`);
    out.push(term.def);
    if (term.guide) out.push(`Guide lie : ${SITE}${term.guide}`);
    out.push('');
  }

  for (const g of guides) {
    let body = toPlain(g.body ?? '');
    if (body.length > MAX_PER_DOC) body = body.slice(0, MAX_PER_DOC) + '\n[...]';
    out.push(SEP);
    out.push(`GUIDE DE REFERENCE : ${g.data.title}`);
    out.push(`URL : ${SITE}/guides/${g.id}/`);
    out.push(`Date : ${d(g.data.pubDate)}${g.data.updatedDate ? ' (revu le ' + d(g.data.updatedDate) + ')' : ''}`);
    out.push('-'.repeat(76));
    out.push(body);
  }

  for (const p of posts) {
    let body = toPlain(p.body ?? '');
    if (body.length > MAX_PER_DOC) body = body.slice(0, MAX_PER_DOC) + '\n[...]';
    out.push(SEP);
    out.push(`ANALYSE : ${p.data.title}`);
    out.push(`URL : ${SITE}/posts/${p.id}/`);
    out.push(`Date : ${d(p.data.pubDate)}${p.data.updatedDate ? ' (revu le ' + d(p.data.updatedDate) + ')' : ''}`);
    if (p.data.tags?.length) out.push(`Themes : ${p.data.tags.join(', ')}`);
    out.push('-'.repeat(76));
    out.push(body);
  }

  return new Response(out.join('\n') + '\n', {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
