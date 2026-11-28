#!/usr/bin/env node
// Public CI consumes public build files only. It never reads private config,
// panels, console exports, reports or a provider credential.
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { audit } from './audit.mjs';

export async function checkBuildVisibility(indexability) {
  const result = await audit('dist', indexability);
  for (const finding of result.findings) {
    if (finding.severity === 'error') console.error(JSON.stringify({ id: finding.id, url: finding.url }));
  }
  console.log(JSON.stringify({ check: 'visibility-build', ...result.summary, duration_ms: result.duration_ms, private_data_access: false, network: false }));
  if (result.summary.errors) process.exitCode = 1;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  await checkBuildVisibility();
}
