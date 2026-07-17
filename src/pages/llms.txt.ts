import type { APIRoute } from 'astro';
import { topics } from '../config/topics.ts';
import { methodologyPages } from '../config/methodology.ts';
import { glossaryEntries } from '../config/glossary.ts';
import { primaryInstitutions } from '../config/primary-sources.ts';
import { editorialChangelog, editorialProtocol, editorialProtocolRelease } from '../config/editorial.ts';
import { textResponse } from '../lib/agent-surface.ts';
import { loadAgentContent } from '../lib/agent-content.ts';

/**
 * /llms.txt - carte concise et annotee du site pour agents IA (convention llmstxt.org).
 * Markdown : titre, resume, sections de liens annotes. Le texte integral est dans
 * /llms-full.txt. Genere au build, comme les endpoints /api/.
 */

const SITE = 'https://l0g.fr';

export const GET: APIRoute = async () => {
  const { posts: allPosts, guides: allGuides } = await loadAgentContent();
  const posts = allPosts.filter((entry) => entry.collection === 'posts');
  const postsEn = allPosts.filter((entry) => entry.collection === 'postsEn');
  const guides = allGuides.filter((entry) => entry.collection === 'guides');
  const guidesEn = allGuides.filter((entry) => entry.collection === 'guidesEn');
  const d = (x?: Date) => (x ? x.toISOString().slice(0, 10) : '');

  const lines: string[] = [];
  lines.push('# l0g.fr');
  lines.push('');
  lines.push(
    '> l0g est un systeme d\'audit open source des narratifs economiques, qui tente de rendre ' +
      'l\'opacite economique mesurable a partir de donnees publiques, de signaux de marche et ' +
      'd\'indicateurs de confluence. Chaque chiffre est verifie sur source primaire (FRED, BLS, ' +
      'BEA, SEC EDGAR, IMF, BIS, FSB, banques centrales). Corpus disponible en francais et en anglais.'
  );
  lines.push('');
  lines.push(
    'Sourcing rigoureux, pas de conseil en investissement. Licence CC BY 4.0. ' +
      'Acces machine complementaire ci-dessous (API JSON, serveur MCP, corpus integral).'
  );
  lines.push('');

  lines.push('## English entry points');
  lines.push(`- [English overview](${SITE}/en/): English map of the l0g surfaces: guides, method, API, MCP, dashboards, glossary, Risk Diff and Black Box.`);
  lines.push(`- [English guided tour](${SITE}/en/tour/): visual orientation through the project for non-French readers.`);
  lines.push(`- [English manifesto](${SITE}/en/manifesto/): public-data, source-discipline and machine-readable evidence principles.`);
  lines.push(`- [English core glossary](${SITE}/en/glossary/): compact vocabulary for macro, SEC filings, Fed plumbing, credit, crypto regulation, commodities and risk surfaces.`);
  lines.push(`- [English dashboards map](${SITE}/en/dashboards/): monitoring tools and their limits.`);
  lines.push(`- [English Risk Diff](${SITE}/en/risk-diff/): what changed in risk signals, sources, claims, models and confidence.`);
  lines.push(`- [English Black Box Recorder](${SITE}/en/black-box/): point-in-time risk frame replay, hashes and explicit gaps.`);
  lines.push(`- [Complete English corpus](${SITE}/llms-full-en.txt): full text of every published English analysis and reference guide.`);
  lines.push('');

  lines.push('## English reference guides');
  for (const g of guidesEn) {
    lines.push(`- [${g.data.title}](${SITE}/en/guides/${g.id}/): ${g.data.summary ?? g.data.description}`);
  }
  lines.push('');

  lines.push('## Recent English analyses');
  for (const p of postsEn.slice(0, 20)) {
    lines.push(`- [${p.data.title}](${SITE}/en/analysis/${p.id}/): ${p.data.description} (${d(p.data.pubDate)})`);
  }
  lines.push('');
  lines.push('## Manifeste');
  lines.push(
    `- [Manifeste l0g](${SITE}/manifeste/): pacte de lecture du projet : sources primaires, code ouvert, auto-hebergement, limites assumees, zero tracker.`
  );
  lines.push(
    `- [Terminal l0g](${SITE}/terminal/): interface clavier en ligne de commande avec manuel web : man, risk today, risk regime, risk diff 7d, proof map, freshness check, integrity hash, signal history, source debt, method debt-risk, sources stale, model limits, corrections, replay par date, MCP tools et navigation interne allowlistee.`
  );
  lines.push(
    `- [Statut & intégrité](${SITE}/status/): état public du build statique, des snapshots, des endpoints, du corpus machine et des garanties de tracking.`
  );
  lines.push(
    `- [Données](${SITE}/donnees/): inventaire des snapshots publics, endpoints JSON/Atom/RSS, corpus machine, licence et limites de fraîcheur.`
  );
  lines.push(
    `- [Backtests](${SITE}/backtests/): historique point-in-time des signaux l0g, exports CSV/NDJSON/JSON, contrat de dates et garde-fous contre le look-ahead bias.`
  );
  lines.push(
    `- [Risk Diff](${SITE}/risk-diff/): lecture des changements de risque sur 1, 7 et 30 jours : signaux, sources, claims, modèles, articles et confiance.`
  );
  lines.push(
    `- [Black Box Recorder](${SITE}/black-box/): boîte noire publique des frames de risque, avec replay par date, hashes, sources, modèles, fraîcheur et changements publiés.`
  );
  lines.push(
    `- [Agent Surface v1.14.0](${SITE}/donnees/agents/): surface M2M bilingue pour agents IA : manifeste, OpenAPI, evidence graph, NDJSON, claims sourcées, séries de risque nommées et versionnées, dates séparées, retrievedAt nullable, indexedAt, sources, fraîcheur, registre Black Box append-only, intégrité attestée, revue canonique et Agent Bench déterministe.`
  );
  lines.push(
    `- [Sources primaires](${SITE}/sources/): pages institutionnelles SEC, Fed/FRED, BIS, FMI, FSB/OFR, BCE/Eurostat, CFTC, EIA, TIC, BLS/BEA.`
  );
  lines.push(
    `- [Preuves & changelog](${SITE}/preuves/): derniers commits, artefacts publiés, surfaces sécurité et liens de vérification.`
  );
  lines.push(
    `- [Protocole éditorial ${editorialProtocolRelease.version}](${SITE}/protocole-editorial/): release normative stable, chaîne source, vérification, rédaction, publication, niveaux de preuve et corrections.`
  );
  lines.push(
    `- [Changelog éditorial](${SITE}/changelog-editorial/): journal des changements de protocole, sources, données, méthode et traçabilité.`
  );
  lines.push('');

  lines.push('## Protocole editorial');
  lines.push(`- [Protocole éditorial ${editorialProtocolRelease.version}](${SITE}/protocole-editorial/): ${editorialProtocol.promise}`);
  lines.push(`- [Release normative stable](${editorialProtocolRelease.releaseUrl}): spécification EP-001 à EP-009, schémas JSON, exemple, paquet de preuves, tests, empreintes et licences.`);
  lines.push(`- [Citation](${editorialProtocolRelease.citationUrl}) et [portée des licences](${editorialProtocolRelease.licenseUrl}): MIT pour le code, les tests et les schémas ; CC BY 4.0 pour les textes, données et artefacts éditoriaux.`);
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
  lines.push(
    `- Relations affirmation-source: les articles backfillent les passages référencés en fait revu, estimation, inférence, scénario ou assertion non classée ; chaque référence exposée est cliquable et datée.`
  );
  lines.push(
    `- Politique de correction: ${editorialProtocol.correctionPolicy.summary}`
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
  lines.push(`- [Atlas de l'opacite financiere](${SITE}/glossaire/): ${glossaryEntries.length} sigles et notions de macro, finance, crypto, energie et regulation. Les entrees enrichies relient definition, intuition, articles, guides, datasets, signaux, sources primaires et concepts voisins.`);
  for (const term of glossaryEntries) {
    const atlasParts = term.atlas
      ? [
          term.atlas.formula ? `formule: ${term.atlas.formula}` : null,
          term.atlas.related?.length ? `concepts voisins: ${term.atlas.related.join(', ')}` : null,
          term.atlas.sources?.length ? `sources: ${term.atlas.sources.map((source) => source.label).join(', ')}` : null,
        ].filter(Boolean).join('; ')
      : '';
    lines.push(`- [${term.sigle}](${SITE}${term.url}): ${term.nom} - ${term.def}${atlasParts ? ` Atlas: ${atlasParts}.` : ''}`);
  }
  lines.push('');

  lines.push('## Acces machine');
  lines.push(`- [Utiliser l0g avec un agent](${SITE}/agents/): guide pratique MCP, Agent Surface, prompts, citations et verification.`);
  lines.push(`- [Agent manifest](${SITE}/agents.json): découverte des capacités, endpoints, règles d'usage et politique de preuve pour agents.`);
  lines.push(`- [OpenAPI](${SITE}/openapi.json): contrat OpenAPI 3.1 des endpoints publics.`);
  lines.push(`- [Claims](${SITE}/api/v1/claims.json): graphe affirmation-source avec faits, estimations, inférences et scénarios, références cliquables, datées quand détectable.`);
  lines.push(`- [Evidence graph](${SITE}/api/v1/evidence-graph.json): articles, claims, références, hôtes, sources primaires et datasets en nœuds/arêtes.`);
  lines.push(`- [Catalogue NDJSON](${SITE}/api/v1/catalog.ndjson): catalogue complet ligne à ligne pour ingestion streaming ou RAG.`);
  lines.push(`- [Claims NDJSON](${SITE}/api/v1/claims.ndjson): claims typées ligne à ligne, avec références embarquées.`);
  lines.push(`- [Evidence graph NDJSON](${SITE}/api/v1/evidence-graph.ndjson): graph de preuves en flux ligne à ligne.`);
  lines.push(`- [Sources](${SITE}/api/v1/sources.json): registre sources primaires et hôtes effectivement cités.`);
  lines.push(`- [Freshness](${SITE}/api/v1/freshness.json): fraîcheur du corpus et des signaux, avec observedAt, computedAt, staleAfter, expiresAt et statut de couverture.`);
  lines.push(`- [Integrity](${SITE}/api/v1/integrity.json): empreintes SHA-256 canoniques des surfaces Agent Surface, champ generated exclu.`);
  lines.push(`- [l0g Agent Bench](${SITE}/agent-bench/): 44 tests déterministes FR/EN, résultats JSON attestés dans ${SITE}/api/v1/agent-bench.json.`);
  lines.push(`- [Changes](${SITE}/api/v1/changes.json): changefeed machine avec objectId, version courante, hash courant, statut de diff et changement sémantique.`);
  lines.push(`- [Changes NDJSON](${SITE}/api/v1/changes.ndjson): changefeed ligne à ligne pour watchers et agents de veille, mêmes métadonnées de version.`);
  lines.push(`- [Risk Diff](${SITE}/api/v1/risk-diff.json): diff du risque sur 1, 7 et 30 jours, avec signaux, sources, claims, modèles, articles et confiance.`);
  lines.push(`- [Black Box Recorder](${SITE}/api/v1/black-box.json): frames point-in-time hashées pour rejouer la dernière observation publique du risque avant une date donnée.`);
  lines.push(`- [API signaux de risque](${SITE}/api/v1/risk.json): signaux US Macro, EU Macro, Yen Carry, Energie + confluence 13F, en JSON. L'échelle 0-100 est une normalisation d'affichage par instrument, pas un indice global comparable. US Macro combine z-score, drift et momentum par moyenne ponderee et penalise les faux positifs hors recession.`);
  lines.push(`- [Dette US](${SITE}/api/v1/debt-risk.json): snapshot canonique Debt Risk Radar repris de latest.json, avec score courant hors CBO, imputation neutre des buckets courants manquants, couverture, provenance et top signaux.`);
  lines.push(`- [Signaux courants](${SITE}/api/v1/signals/current.json): dernières observations point-in-time par instrument.`);
  lines.push(`- [Historique signaux](${SITE}/api/v1/signals/history.json): observations backtestables, événements de seuil, couverture et politique de replay.`);
  lines.push(`- [Historique signaux NDJSON](${SITE}/api/v1/signals/history.ndjson): flux ligne à ligne pour agents, watchers et ingestion incrémentale.`);
  lines.push(`- [Historique signaux CSV](${SITE}/api/v1/signals/history.csv): table d'observations pour pandas, R, DuckDB ou tableur.`);
  lines.push(`- [Schéma signaux](${SITE}/api/v1/signals/schema.json): contrat machine des lignes meta, observation et level-change.`);
  lines.push(`- [Catalogue](${SITE}/api/v1/catalog.json): articles, guides et sujets, en JSON.`);
  lines.push(`- [Flux Atom des risques](${SITE}/api/v1/risk.xml): changements de niveau de risque.`);
  lines.push(`- [Serveur MCP](${SITE}/api/mcp): endpoint Model Context Protocol en lecture seule (transport Streamable HTTP). Tools clés : get_risk_diff, get_black_box, get_signal_history, get_claims, get_evidence_graph. Doc : ${SITE}/mcp`);
  lines.push(`- [Statistiques MCP anonymisées](${SITE}/api/mcp/usage): volumes techniques agrégés sur 91 jours, sans IP, cookie, session, empreinte ni user-agent ; familles client masquées sous cinq initialisations.`);
  lines.push(`- [Corpus integral](${SITE}/llms-full.txt): texte complet de toutes les analyses et guides.`);
  lines.push(`- [English full corpus](${SITE}/llms-full-en.txt): complete English analyses and guides in a separate context file.`);
  lines.push('');

  lines.push('## Optional');
  for (const p of posts.slice(20)) {
    lines.push(`- [${p.data.title}](${SITE}/posts/${p.id}/): ${p.data.description}`);
  }
  for (const p of postsEn.slice(20)) {
    lines.push(`- [${p.data.title}](${SITE}/en/analysis/${p.id}/): ${p.data.description}`);
  }
  lines.push('');

  return textResponse(lines.join('\n'), 'text/plain; charset=utf-8');
};
