import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { topics } from '../config/topics.ts';

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

  lines.push('## Acces machine');
  lines.push(`- [API indices de risque](${SITE}/api/v1/risk.json): indices US Macro, EU Macro, Yen Carry, Energie + confluence 13F, en JSON.`);
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
