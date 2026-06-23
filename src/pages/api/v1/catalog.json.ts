import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { topics, postMatchesTopic } from '../../../config/topics.ts';

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

  const payload = {
    schema: 'https://l0g.fr/api/',
    version: '1',
    generated: new Date().toISOString(),
    counts: { articles: articles.length, guides: guides.length, topics: topics.length },
    topics: topics.map((t) => ({ slug: t.slug, label: t.label, blurb: t.blurb })),
    articles,
    guides,
    license: 'CC BY 4.0',
    attribution: 'l0g.fr',
    note: 'Catalogue best-effort. Le texte complet des analyses est servi par les pages /posts/.',
  };

  return new Response(JSON.stringify(payload, null, 2) + '\n', {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
