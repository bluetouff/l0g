import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { topics } from '../config/topics.ts';
import { methodologyPages } from '../config/methodology.ts';
import { glossaryEntries } from '../config/glossary.ts';
import { primaryInstitutions } from '../config/primary-sources.ts';
import { editorialChangelog, editorialProtocol } from '../config/editorial.ts';

/**
 * /llms.txt — carte concise et annotee du site pour agents IA (convention llmstxt.org).
 * Markdown : titre, resume, sections de liens annotes. Le texte integral est dans
 * /llms-full.txt. Genere au build, comme les endpoints /api/.
 */

const SITE = 'https://l0g.fr';

export const GET: APIRoute = async () => {
  const posts = (await getCollection('posts', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime()
  );
  const guides = (await getCollection('guides', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime()
  );
  const d = (x?: Date) => (x ? x.toISOString().slice(0, 10) : '');

  const lines: string[] = [];
  lines.push('# l0g.fr');
  lines.push('');
  lines.push(
    '> l0g est un systeme d\'audit open source des narratifs economiques, qui tente de rendre ' +
      'l\'opacite economique mesurable a partir de donnees publiques, de signaux de marche et ' +
      'd\'indicateurs de confluence. Chaque chiffre est verifie sur source primaire (FRED, BLS, ' +
      'BEA, SEC EDGAR, IMF, BIS, FSB, banques centrales). Contenu en francais.'
  );
  lines.push('');
  lines.push(
    'Sourcing rigoureux, pas de conseil en investissement. Licence CC BY 4.0. ' +
      'Acces machine complementaire ci-dessous (API JSON, serveur MCP, corpus integral).'
  );
  lines.push('');

  lines.push('## Manifeste');
  lines.push(
    `- [Manifeste l0g](${SITE}/manifeste/): pacte de lecture du projet : sources primaires, code ouvert, auto-hebergement, limites assumees, zero tracker.`
  );
  lines.push(
    `- [Terminal l0g](${SITE}/terminal/): interface de navigation en ligne de commande vers manifeste, methodologie, dashboards, API, sources et corpus machine.`
  );
  lines.push(
    `- [Statut & intégrité](${SITE}/status/): état public du build statique, des snapshots, des endpoints, du corpus machine et des garanties de tracking.`
  );
  lines.push(
    `- [Données](${SITE}/donnees/): inventaire des snapshots publics, endpoints JSON/Atom/RSS, corpus machine, licence et limites de fraîcheur.`
  );
  lines.push(
    `- [Sources primaires](${SITE}/sources/): pages institutionnelles SEC, Fed/FRED, BIS, FMI, FSB/OFR, BCE/Eurostat, CFTC, EIA, TIC, BLS/BEA.`
  );
  lines.push(
    `- [Preuves & changelog](${SITE}/preuves/): derniers commits, artefacts publiés, surfaces sécurité et liens de vérification.`
  );
  lines.push(
    `- [Protocole éditorial](${SITE}/protocole-editorial/): chaîne source, vérification, rédaction, publication, niveaux de preuve et corrections.`
  );
  lines.push(
    `- [Changelog éditorial](${SITE}/changelog-editorial/): journal des changements de protocole, sources, données, méthode et traçabilité.`
  );
  lines.push('');

  lines.push('## Protocole editorial');
  lines.push(`- [Protocole éditorial](${SITE}/protocole-editorial/): ${editorialProtocol.promise}`);
  for (const principle of editorialProtocol.principles) {
    lines.push(`- ${principle.title}: ${principle.text}`);
  }
  lines.push('- Echelle de profondeur de preuve :');
  for (const level of editorialProtocol.proofDepthLevels) {
    lines.push(`  - ${level.label}: ${level.meaning} (${level.status})`);
  }
  lines.push(
    `- Garde-fou precision: ${editorialProtocol.precisionGuard.summary} Exigences: ${editorialProtocol.precisionGuard.requirements.join(', ')}. ${editorialProtocol.precisionGuard.warning}`
  );
  lines.push('');

  lines.push('## Changelog editorial');
  for (const entry of editorialChangelog) {
    lines.push(`- ${entry.date} · ${entry.kind} · [${entry.title}](${SITE}/changelog-editorial/): ${entry.summary}`);
  }
  lines.push('');

  lines.push('## Guides de reference');
  for (const g of guides) {
    lines.push(`- [${g.data.title}](${SITE}/guides/${g.id}/): ${g.data.summary ?? g.data.description}`);
  }
  lines.push('');

  lines.push('## Analyses recentes');
  for (const p of posts.slice(0, 20)) {
    lines.push(`- [${p.data.title}](${SITE}/posts/${p.id}/): ${p.data.description} (${d(p.data.pubDate)})`);
  }
  lines.push('');

  lines.push('## Sujets');
  for (const t of topics) {
    lines.push(`- [${t.label}](${SITE}/sujet/${t.slug}/): ${t.blurb}`);
  }
  lines.push('');

  lines.push('## Methodologie des outils');
  lines.push(`- [Hub méthodologie](${SITE}/methodologie/): synthèse des indicateurs l0g, limites et accès aux fiches d'instrument.`);
  for (const page of methodologyPages) {
    lines.push(`- [${page.label}](${SITE}/methodologie/${page.slug}/): ${page.question}`);
  }
  lines.push('');

  lines.push('## Sources primaires');
  lines.push(`- [Hub sources primaires](${SITE}/sources/): institutions, cadences, limites et liens de verification.`);
  for (const source of primaryInstitutions) {
    lines.push(`- [${source.shortName}](${SITE}/sources/${source.slug}/): ${source.description}`);
  }
  lines.push('');

  lines.push('## Glossaire');
  lines.push(`- [Glossaire l0g](${SITE}/glossaire/): ${glossaryEntries.length} sigles et notions de macro, finance, crypto, energie et regulation, chacun avec une page dediee.`);
  for (const term of glossaryEntries) {
    lines.push(`- [${term.sigle}](${SITE}${term.url}): ${term.nom} — ${term.def}`);
  }
  lines.push('');

  lines.push('## Acces machine');
  lines.push(`- [API signaux de risque](${SITE}/api/v1/risk.json): signaux US Macro, EU Macro, Yen Carry, Energie + confluence 13F, en JSON. L'échelle 0-100 est une normalisation d'affichage par instrument, pas un indice global comparable.`);
  lines.push(`- [Catalogue](${SITE}/api/v1/catalog.json): articles, guides et sujets, en JSON.`);
  lines.push(`- [Flux Atom des risques](${SITE}/api/v1/risk.xml): changements de niveau de risque.`);
  lines.push(`- [Serveur MCP](${SITE}/api/mcp): endpoint Model Context Protocol en lecture seule (transport Streamable HTTP). Doc : ${SITE}/mcp`);
  lines.push(`- [Corpus integral](${SITE}/llms-full.txt): texte complet de toutes les analyses et guides.`);
  lines.push('');

  lines.push('## Optional');
  for (const p of posts.slice(20)) {
    lines.push(`- [${p.data.title}](${SITE}/posts/${p.id}/): ${p.data.description}`);
  }
  lines.push('');

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
