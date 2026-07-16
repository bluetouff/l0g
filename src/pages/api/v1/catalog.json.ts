import type { APIRoute } from 'astro';
import { loadAgentContent } from '../../../lib/agent-content.ts';
import { buildCatalogSurface, jsonResponse } from '../../../lib/agent-surface.ts';

/**
 * Catalogue machine de l0g.fr — v1. Sortie statique générée au build.
 * Sert de source de données au serveur MCP (l0g.fr/mcp) et, plus largement, de
 * carte du site lisible par agents : articles, guides de référence et sujets.
 * En-têtes CORS posés par Apache sur /api/. License CC BY 4.0.
 * Pas de corps d'article ici (poids) : le texte complet est servi par /posts/ et
 * /guides/ en français, /en/analysis/ et /en/guides/ en anglais.
 */

export const GET: APIRoute = async () => {
  const { posts, guides } = await loadAgentContent();
  return jsonResponse(buildCatalogSurface(posts, guides));
};
