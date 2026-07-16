#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function assert(condition, message) {
  if (!condition) throw new Error(`Conformité refusée: ${message}`);
}

async function json(path) {
  return JSON.parse(await readFile(resolve(ROOT, path), 'utf8'));
}

const [release, articleSchema, evidenceSchema, article, evidencePack, markdown, license] = await Promise.all([
  json('release.json'),
  json('schemas/article.schema.json'),
  json('schemas/evidence-pack.schema.json'),
  json('example/article.json'),
  json('example/evidence-pack.json'),
  readFile(resolve(ROOT, 'example/article.md'), 'utf8'),
  readFile(resolve(ROOT, 'LICENSE'), 'utf8'),
]);

const ajv = new Ajv2020({ allErrors: true, strict: true });
addFormats(ajv);
for (const [schema, value, label] of [
  [articleSchema, article, 'article'],
  [evidenceSchema, evidencePack, 'paquet de preuves'],
]) {
  const validate = ajv.compile(schema);
  assert(validate(value), `${label}: ${ajv.errorsText(validate.errors, { separator: '; ' })}`);
}

assert(release.status === 'stable' && release.version === '1.0.0', 'coordonnées de release');
assert(article.id === evidencePack.articleId, 'articleId divergent');
assert(article.protocolVersion === release.version, 'version de protocole divergente');

const claims = new Map();
for (const claim of article.claims) {
  assert(!claims.has(claim.id), `claim dupliquée: ${claim.id}`);
  claims.set(claim.id, claim);
}
const evidence = new Map();
for (const item of evidencePack.evidence) {
  assert(!evidence.has(item.id), `preuve dupliquée: ${item.id}`);
  evidence.set(item.id, item);
  for (const claimId of item.claimIds) assert(claims.has(claimId), `claim inconnue dans ${item.id}: ${claimId}`);
}
for (const claim of claims.values()) {
  for (const evidenceId of claim.evidenceIds) {
    const item = evidence.get(evidenceId);
    assert(item, `preuve inconnue dans ${claim.id}: ${evidenceId}`);
    assert(item.claimIds.includes(claim.id), `lien inverse absent entre ${claim.id} et ${evidenceId}`);
  }
  if (claim.type === 'fact') {
    assert(
      claim.evidenceIds.some((id) => ['direct-proof', 'reproduction'].includes(evidence.get(id)?.proofDepth)),
      `fait sans preuve directe: ${claim.id}`,
    );
  }
}

assert(/^---\n[\s\S]+?\n---\n/.test(markdown), 'frontmatter Markdown absent');
assert(markdown.includes('## Sources'), 'section Sources absente');
assert(markdown.includes('## Limites'), 'section Limites absente');
for (const item of evidence.values()) assert(markdown.includes(item.url), `URL de preuve absente du Markdown: ${item.id}`);
assert(license.includes('MIT') && license.includes('CC BY 4.0'), 'notices de licence incomplètes');

const sums = await readFile(resolve(ROOT, 'SHA256SUMS'), 'utf8');
for (const line of sums.trim().split('\n')) {
  const match = line.match(/^([0-9a-f]{64})  (.+)$/);
  assert(match, `ligne SHA256SUMS invalide: ${line}`);
  const [, expected, relativePath] = match;
  assert(relativePath !== 'SHA256SUMS', 'SHA256SUMS ne doit pas se référencer');
  const actual = createHash('sha256').update(await readFile(resolve(ROOT, relativePath))).digest('hex');
  assert(actual === expected, `empreinte incorrecte: ${relativePath}`);
}

process.stdout.write(`${JSON.stringify({ ok: true, protocol: release.title, version: release.version, claims: claims.size, evidence: evidence.size })}\n`);
