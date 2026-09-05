#!/usr/bin/env node

import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE = 'https://l0g.fr';

export const SEO_LIVE_PROBES = Object.freeze([
  { path: '/sitemap.xml', status: 301, location: `${SITE}/sitemap-index.xml` },
  { path: '/sitemap-index.xml', status: 200, type: /^application\/xml\b/i },
  { path: '/contact/', status: 200, type: /^text\/html\b/i },
  { path: '/en/contact/', status: 200, type: /^text\/html\b/i },
  { path: '/.well-known/mcp', status: 308, location: `${SITE}/.well-known/mcp.json` },
  { path: '/.well-known/mcp.json', status: 200, type: /^application\/json\b/i },
  { path: '/.well-known/oauth-protected-resource', status: 404, type: /^application\/json\b/i },
  { path: '/.well-known/oauth-authorization-server', status: 404, type: /^application\/json\b/i },
  { path: '/favicon.ico', status: 200, type: /^image\//i },
  { path: '/apple-touch-icon.png', status: 200, type: /^image\/png\b/i },
  { path: '/apple-touch-icon-precomposed.png', status: 200, type: /^image\/png\b/i },
]);

export function validateSeoObservation(probe, observation) {
  const errors = [];
  if (observation.status !== probe.status) errors.push(`status:${observation.status}!=${probe.status}`);
  if (probe.location && observation.location !== probe.location) {
    errors.push(`location:${observation.location ?? '(absente)'}!=${probe.location}`);
  }
  if (probe.type && !probe.type.test(observation.content_type ?? '')) {
    errors.push(`content-type:${observation.content_type ?? '(absent)'}`);
  }
  return errors;
}

async function observe(probe) {
  const response = await fetch(`${SITE}${probe.path}`, {
    method: 'HEAD',
    redirect: 'manual',
    headers: { 'User-Agent': 'l0g-seo-live-verifier/1.0' },
    signal: AbortSignal.timeout(20_000),
  });
  return {
    path: probe.path,
    status: response.status,
    location: response.headers.get('location'),
    content_type: response.headers.get('content-type'),
    server_date: response.headers.get('date'),
  };
}

async function sourceRevision() {
  const response = await fetch(`${SITE}/source.env`, {
    headers: { 'User-Agent': 'l0g-seo-live-verifier/1.0' },
    signal: AbortSignal.timeout(20_000),
  });
  if (!response.ok) throw new Error(`source.env:${response.status}`);
  const body = await response.text();
  return body.match(/^L0G_RELEASE_SOURCE_SHA=(?<sha>[0-9a-f]{40})$/m)?.groups?.sha ?? null;
}

export async function verifySeoLive() {
  const observations = await Promise.all(SEO_LIVE_PROBES.map(observe));
  const results = observations.map((observation, index) => {
    const errors = validateSeoObservation(SEO_LIVE_PROBES[index], observation);
    return { ...observation, ok: errors.length === 0, errors };
  });
  return {
    schema_version: '1.0.0',
    checked_at: new Date().toISOString(),
    site: SITE,
    source_commit: await sourceRevision(),
    ok: results.every(({ ok }) => ok),
    oauth_policy: '404 volontaire: serveur MCP public sans OAuth',
    results,
  };
}

async function runCli() {
  const args = process.argv.slice(2);
  const outputIndex = args.indexOf('--output');
  const output = outputIndex >= 0 ? args[outputIndex + 1] : null;
  const report = await verifySeoLive();
  const body = `${JSON.stringify(report, null, 2)}\n`;
  if (output) {
    const destination = resolve(output);
    await mkdir(dirname(destination), { recursive: true });
    await writeFile(destination, body);
  }
  process.stdout.write(body);
  if (!report.ok) process.exitCode = 1;
}

if (resolve(process.argv[1] ?? '') === fileURLToPath(import.meta.url)) {
  await runCli();
}
