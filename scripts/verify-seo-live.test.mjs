import assert from 'node:assert/strict';
import test from 'node:test';
import {
  SEO_LIVE_PROBES,
  validateSeoObservation,
} from './verify-seo-live.mjs';

test('le contrat live couvre les entrées SEO, contact, MCP, OAuth et icônes', () => {
  const paths = SEO_LIVE_PROBES.map(({ path }) => path);
  for (const path of [
    '/sitemap.xml',
    '/contact/',
    '/en/contact/',
    '/.well-known/mcp',
    '/.well-known/oauth-protected-resource',
    '/favicon.ico',
    '/apple-touch-icon.png',
  ]) assert.ok(paths.includes(path), path);
});

test('les erreurs de statut, location et type sont explicites', () => {
  const probe = { status: 301, location: 'https://l0g.fr/cible', type: /^text\/html/ };
  assert.deepEqual(validateSeoObservation(probe, {
    status: 404,
    location: null,
    content_type: 'application/json',
  }), [
    'status:404!=301',
    'location:(absente)!=https://l0g.fr/cible',
    'content-type:application/json',
  ]);
});
