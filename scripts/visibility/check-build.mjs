#!/usr/bin/env node
// Public CI consumes public build files only. It never reads private config,
// panels, console exports, reports or a provider credential.
import { audit } from './audit.mjs';
const result = await audit('dist');
for (const finding of result.findings) {
  if (finding.severity === 'error') console.error(JSON.stringify({ id: finding.id, url: finding.url }));
}
console.log(JSON.stringify({ check: 'visibility-build', ...result.summary, duration_ms: result.duration_ms, private_data_access: false, network: false }));
if (result.summary.errors) process.exitCode = 1;
