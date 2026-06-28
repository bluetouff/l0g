import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { glossaryEntries } from '../config/glossary.ts';
import { primaryInstitutions } from '../config/primary-sources.ts';
import { editorialChangelog, editorialProtocol } from '../config/editorial.ts';

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
  out.push(
    `Agent Surface v1.8.0 : ${SITE}/donnees/agents/ documente la surface M2M statique. Le guide pratique ${SITE}/agents/ explique comment utiliser l0g avec un agent : choix des endpoints, prompts, citations, verification, dates separees, retrievedAt nullable, indexedAt, revue humaine et MCP public. Points d acces principaux : ${SITE}/agents.json pour la decouverte, ${SITE}/openapi.json pour le contrat, ${SITE}/api/v1/claims.json pour le graphe affirmation-source, ${SITE}/api/v1/evidence-graph.json pour le graphe articles-claims-sources, ${SITE}/api/v1/sources.json pour le registre sources, ${SITE}/api/v1/freshness.json pour la fraicheur du corpus et des signaux, ${SITE}/api/v1/integrity.json pour les empreintes SHA-256 canoniques attestees en CI et ${SITE}/api/v1/changes.json pour le changefeed machine avec objectId, version/hash courant, statut de diff et changement semantique. Les variantes NDJSON principales sont ${SITE}/api/v1/catalog.ndjson, ${SITE}/api/v1/claims.ndjson, ${SITE}/api/v1/evidence-graph.ndjson et ${SITE}/api/v1/changes.ndjson.`
  );
  out.push(
    "Le fichier risk.json expose un tableau de bord consolide de signaux, pas un indice unique de risque systemique : les scores 0-100 sont normalises par instrument et ne sont pas statistiquement equivalents entre US Macro, Euro Macro, Yen Carry et Energie."
  );
  out.push(SEP);
  out.push('PREUVES : Changelog et artefacts verifiables');
  out.push(`URL : ${SITE}/preuves/`);
  out.push('-'.repeat(76));
  out.push(
    "Page de tracabilite publique : derniers commits Git, artefacts publies, security.txt, lockfile, configuration Apache durcie, fraicheur des snapshots et liens de verification vers GitHub."
  );
  out.push(SEP);
  out.push('PROTOCOLE EDITORIAL : Sources, verification, preuve, correction');
  out.push(`URL : ${SITE}/protocole-editorial/`);
  out.push('-'.repeat(76));
  out.push(editorialProtocol.promise);
  out.push('');
  out.push('Principes :');
  for (const principle of editorialProtocol.principles) {
    out.push(`- ${principle.title} : ${principle.text}`);
  }
  out.push('');
  out.push('Niveaux de preuve :');
  for (const level of editorialProtocol.evidenceLevels) {
    out.push(`- ${level.rank} · ${level.label} : ${level.description}`);
  }
  out.push('');
  out.push('Profondeur de preuve :');
  for (const level of editorialProtocol.proofDepthLevels) {
    out.push(`- ${level.label} : ${level.meaning} Statut : ${level.status}.`);
  }
  out.push('');
  out.push('Garde-fou contre l illusion de precision :');
  out.push(editorialProtocol.precisionGuard.summary);
  out.push(`Exigences : ${editorialProtocol.precisionGuard.requirements.join(', ')}.`);
  out.push(editorialProtocol.precisionGuard.warning);
  out.push('');
  out.push('Relations affirmation-source :');
  out.push('Les articles generent automatiquement des relations entre passages references et sources cliquables. Chaque relation est typee : fait revu, estimation, inference, scenario ou assertion non classee. Les references exposent une date utile extraite du passage ou, a defaut, la date de publication de l article.');
  out.push('');
  out.push('Politique de correction :');
  out.push(editorialProtocol.correctionPolicy.summary);
  for (const rule of editorialProtocol.correctionPolicy.revisionRules) {
    out.push(`- ${rule}`);
  }
  out.push(SEP);
  out.push('CHANGELOG EDITORIAL : Changements structurants');
  out.push(`URL : ${SITE}/changelog-editorial/`);
  out.push('-'.repeat(76));
  for (const entry of editorialChangelog) {
    out.push(`${entry.date} · ${entry.kind} · ${entry.title}`);
    out.push(entry.summary);
    out.push('');
  }
  out.push(SEP);
  out.push('SOURCES PRIMAIRES : Institutions et limites');
  out.push(`URL : ${SITE}/sources/`);
  out.push('-'.repeat(76));
  for (const source of primaryInstitutions) {
    out.push(`${source.shortName} (${source.name})`);
    out.push(`URL : ${SITE}/sources/${source.slug}/`);
    out.push(`Source officielle : ${source.url}`);
    out.push(source.description);
    out.push(`Lecture l0g : ${source.why}`);
    out.push(`Limites : ${source.limits.join(' ')}`);
    out.push('');
  }
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
