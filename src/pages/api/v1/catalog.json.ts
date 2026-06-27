import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { topics } from '../../../config/topics.ts';
import { methodologyPages, riskBandScaleCaveat } from '../../../config/methodology.ts';
import { glossaryEntries, glossarySections } from '../../../config/glossary.ts';
import { primaryInstitutions } from '../../../config/primary-sources.ts';
import { editorialChangelog, editorialProtocol } from '../../../config/editorial.ts';
import {
  AGENT_SITE as SITE,
  buildArticleRecord,
  buildGuideRecord,
  jsonResponse,
  sortGuides,
  sortPosts,
} from '../../../lib/agent-surface.ts';

/**
 * Catalogue machine de l0g.fr — v1. Sortie statique générée au build.
 * Sert de source de données au serveur MCP (l0g.fr/mcp) et, plus largement, de
 * carte du site lisible par agents : articles, guides de référence et sujets.
 * En-têtes CORS posés par Apache sur /api/. License CC BY 4.0.
 * Pas de corps d'article ici (poids) : le texte complet est servi par /posts/.../.
 */

export const GET: APIRoute = async () => {
  const posts = sortPosts(await getCollection('posts', ({ data }) => !data.draft));
  const allGuides = sortGuides(await getCollection('guides', ({ data }) => !data.draft));

  const articles = posts.map(buildArticleRecord);
  const guides = allGuides.map(buildGuideRecord);

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
    scaleCaveat: m.slug === '13flow' ? null : riskBandScaleCaveat,
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

  const editorial = {
    protocol: {
      url: `${SITE}/protocole-editorial/`,
      updated: editorialProtocol.updated,
      promise: editorialProtocol.promise,
      principles: editorialProtocol.principles,
      steps: editorialProtocol.steps,
      evidenceLevels: editorialProtocol.evidenceLevels,
      proofDepthLevels: editorialProtocol.proofDepthLevels,
      precisionGuard: editorialProtocol.precisionGuard,
      correctionPolicy: editorialProtocol.correctionPolicy,
    },
    changelog: editorialChangelog.map((entry) => ({
      ...entry,
      url: `${SITE}/changelog-editorial/`,
    })),
  };

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
      editorialChangelog: editorial.changelog.length,
    },
    topics: topics.map((t) => ({ slug: t.slug, label: t.label, blurb: t.blurb })),
    glossaryCategories: glossarySections.map((s) => ({ slug: s.slug, title: s.titre, count: s.entries.length })),
    articles,
    guides,
    methodologies,
    riskBandScaleCaveat,
    editorial,
    primarySources,
    glossary,
    license: 'CC BY 4.0',
    attribution: 'l0g.fr',
    note: 'Catalogue best-effort. Le texte complet des analyses est servi par les pages /posts/.',
  };

  return jsonResponse(payload);
};
