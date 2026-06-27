import type { APIRoute } from 'astro';
import { AGENT_SITE, AGENT_VERSION, jsonResponse } from '../lib/agent-surface.ts';

const endpoint = (summary: string, description: string, schemaName: string) => ({
  get: {
    summary,
    description,
    operationId: schemaName.charAt(0).toLowerCase() + schemaName.slice(1),
    responses: {
      '200': {
        description: 'Réponse JSON statique générée au build.',
        content: {
          'application/json': {
            schema: { $ref: `#/components/schemas/${schemaName}` },
          },
        },
      },
    },
  },
});

export const GET: APIRoute = async () => {
  const payload = {
    openapi: '3.1.0',
    info: {
      title: 'l0g.fr Agent Surface API',
      version: AGENT_VERSION,
      description:
        'Contrat public pour agents IA : manifeste, catalogue, graphe affirmation-source, registre de sources, fraîcheur, risque et corpus.',
      license: { name: 'CC BY 4.0', url: 'https://creativecommons.org/licenses/by/4.0/' },
    },
    servers: [{ url: AGENT_SITE }],
    paths: {
      '/agents.json': endpoint('Manifeste agent', 'Découverte des capacités, endpoints, règles d’usage et politiques de preuve.', 'AgentManifest'),
      '/api/v1/catalog.json': endpoint('Catalogue complet', 'Articles, guides, méthodologies, glossaire, sources primaires et protocole éditorial.', 'Catalog'),
      '/api/v1/claims.json': endpoint('Graphe affirmation-source', 'Affirmations typées reliées à des références cliquables et datées.', 'ClaimsSurface'),
      '/api/v1/sources.json': endpoint('Registre sources', 'Sources primaires institutionnelles, hôtes cités, règles de citation et limites.', 'SourcesSurface'),
      '/api/v1/freshness.json': endpoint('Fraîcheur', 'Derniers contenus, compteurs de corpus, endpoints et politique de fraîcheur.', 'FreshnessSurface'),
      '/api/v1/risk.json': endpoint('Signaux de risque', 'Snapshots des dashboards de risque et caveats de normalisation.', 'RiskSnapshot'),
      '/llms.txt': {
        get: {
          summary: 'Carte concise agents',
          responses: { '200': { description: 'Texte brut.', content: { 'text/plain': { schema: { type: 'string' } } } } },
        },
      },
      '/llms-full.txt': {
        get: {
          summary: 'Corpus agents étendu',
          responses: { '200': { description: 'Texte brut.', content: { 'text/plain': { schema: { type: 'string' } } } } },
        },
      },
    },
    components: {
      schemas: {
        EvidenceReference: {
          type: 'object',
          required: ['label', 'href', 'dateLabel'],
          properties: {
            label: { type: 'string' },
            href: { type: 'string' },
            host: { type: ['string', 'null'] },
            kind: { type: ['string', 'null'] },
            date: { type: ['string', 'null'], format: 'date' },
            dateLabel: { type: 'string' },
          },
        },
        Claim: {
          type: 'object',
          required: ['id', 'articleSlug', 'kind', 'claim', 'dateLabel', 'references'],
          properties: {
            id: { type: 'string' },
            localId: { type: 'string' },
            articleSlug: { type: 'string' },
            articleUrl: { type: 'string', format: 'uri' },
            articleTitle: { type: 'string' },
            kind: { enum: ['fait', 'estimation', 'inférence', 'scénario'] },
            claim: { type: 'string' },
            date: { type: ['string', 'null'], format: 'date' },
            dateLabel: { type: 'string' },
            confidence: { enum: ['auto-backfill', 'structurée'] },
            references: { type: 'array', items: { $ref: '#/components/schemas/EvidenceReference' } },
          },
        },
        AgentManifest: { type: 'object', additionalProperties: true },
        Catalog: { type: 'object', additionalProperties: true },
        ClaimsSurface: {
          type: 'object',
          required: ['schema', 'version', 'generated', 'counts', 'claims', 'references'],
          properties: {
            schema: { type: 'string' },
            version: { type: 'string' },
            generated: { type: 'string', format: 'date-time' },
            counts: { type: 'object', additionalProperties: true },
            policy: { type: 'object', additionalProperties: true },
            claims: { type: 'array', items: { $ref: '#/components/schemas/Claim' } },
            references: { type: 'array', items: { type: 'object', additionalProperties: true } },
          },
        },
        SourcesSurface: { type: 'object', additionalProperties: true },
        FreshnessSurface: { type: 'object', additionalProperties: true },
        RiskSnapshot: { type: 'object', additionalProperties: true },
      },
    },
  };

  return jsonResponse(payload);
};
