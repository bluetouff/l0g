// Shared by frame creation and the publication-only Astro prepass.
export const BLACK_BOX_FRAME_SUBJECTS = Object.freeze([
  'agents.json', 'openapi.json', 'api/v1/catalog.json', 'api/v1/search-index.json',
  'api/v1/claims.json', 'api/v1/evidence-graph.json', 'api/v1/sources.json',
  'api/v1/freshness.json', 'api/v1/changes.json', 'api/v1/risk-diff.json',
  'api/v1/risk.json', 'api/v1/debt-risk.json', 'api/v1/signals/history.json',
]);

export const BLACK_BOX_SEED_PATHS = Object.freeze([
  ...BLACK_BOX_FRAME_SUBJECTS, 'api/v1/integrity.json',
]);
