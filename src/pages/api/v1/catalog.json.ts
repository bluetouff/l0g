import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { topics, postMatchesTopic } from '../../../config/topics.ts';
import { methodologyPages } from '../../../config/methodology.ts';
import { glossaryEntries, glossarySections } from '../../../config/glossary.ts';
import { primaryInstitutions } from '../../../config/primary-sources.ts';

/**
 * Catalogue machine de l0g.fr — v1. Sortie statique générée au build.
 * Sert de source de données au serveur MCP (l0g.fr/mcp) et, plus largement, de
 * carte du site lisible par agents : articles, guides de référence et sujets.
 * En-têtes CORS posés par Apache sur /api/. License CC BY 4.0.
 * Pas de corps d'article ici (poids) : le texte complet est servi par /posts/.../.
 */

const SITE = 'https://l0g.fr';

export const GET: APIRoute = async () => {
  const posts = (await getCollection('posts', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime()
  );
  const allGuides = (await getCollection('guides', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime()
  );

  const iso = (d?: Date) => (d ? d.toISOString().slice(0, 10) : null);

  const articles = posts.map((p) => ({
    slug: p.id,
    url: `${SITE}/posts/${p.id}/`,
    title: p.data.title,
    date: iso(p.data.pubDate),
    updated: iso(p.data.updatedDate),
    description: p.data.description,
    tags: p.data.tags ?? [],
    topics: topics.filter((t) => postMatchesTopic(p.data.tags ?? [], t)).map((t) => t.slug),
  }));

  const guides = allGuides.map((g) => ({
    slug: g.id,
    url: `${SITE}/guides/${g.id}/`,
    title: g.data.title,
    date: iso(g.data.pubDate),
    updated: iso(g.data.updatedDate),
    description: g.data.description,
    summary: g.data.summary ?? null,
    tags: g.data.tags ?? [],
  }));

  const methodologies = methodologyPages.map((m) => ({
    slug: m.slug,
    url: `${SITE}/methodologie/${m.slug}/`,
    title: m.title,
    label: m.label,
    description: m.description,
    question: m.question,
    dashboard: m.dashboardUrl,
    repo: m.repoUrl,
    updated: m.updated,
    sources: m.sources.map((s) => ({ name: s.name, url: s.url, role: s.role })),
  }));

  const glossary = glossaryEntries.map((term) => ({
    slug: term.slug,
    url: `${SITE}${term.url}`,
    sigle: term.sigle,
    name: term.nom,
    definition: term.def,
    category: term.sectionTitle,
    guide: term.guide ? `${SITE}${term.guide}` : null,
  }));

  const primarySources = primaryInstitutions.map((source) => ({
    slug: source.slug,
    url: `${SITE}/sources/${source.slug}/`,
    name: source.name,
    shortName: source.shortName,
    category: source.category,
    officialUrl: source.url,
    description: source.description,
    datasets: source.datasets.map((dataset) => ({
      name: dataset.name,
      role: dataset.role,
      cadence: dataset.cadence,
      delay: dataset.delay,
      url: dataset.url,
    })),
    limits: source.limits,
  }));

  const payload = {
    schema: 'https://l0g.fr/api/',
    version: '1',
    generated: new Date().toISOString(),
    counts: {
      articles: articles.length,
      guides: guides.length,
      topics: topics.length,
      methodologies: methodologies.length,
      glossary: glossary.length,
      primarySources: primarySources.length,
    },
    topics: topics.map((t) => ({ slug: t.slug, label: t.label, blurb: t.blurb })),
    glossaryCategories: glossarySections.map((s) => ({ slug: s.slug, title: s.titre, count: s.entries.length })),
    articles,
    guides,
    methodologies,
    primarySources,
    glossary,
    license: 'CC BY 4.0',
    attribution: 'l0g.fr',
    note: 'Catalogue best-effort. Le texte complet des analyses est servi par les pages /posts/.',
  };

  return new Response(JSON.stringify(payload, null, 2) + '\n', {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
