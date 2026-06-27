import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import {
  buildCatalogSurface,
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

  return jsonResponse(buildCatalogSurface(posts, allGuides));
};
