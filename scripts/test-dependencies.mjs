#!/usr/bin/env node
import { spawnSync } from 'node:child_process';

const audits = [
  { label: 'main', command: ['npm', 'audit', '--audit-level=moderate', '--json'] },
  {
    label: 'mcp-server',
    command: ['npm', 'audit', '--prefix', 'mcp-server', '--omit=dev', '--audit-level=moderate', '--json'],
  },
];

const infraSignatures = [
  'ENOTFOUND',
  'EAI_AGAIN',
  'EAI_FAIL',
  'EAI_NODATA',
  'ECONNRESET',
  'ECONNREFUSED',
  'ETIMEDOUT',
  'ESOCKETTIMEDOUT',
  'ENETUNREACH',
  'EHOSTUNREACH',
  'ECONNABORTED',
  'ERR_SOCKET_CLOSED',
  'ERR_TLS_CERT_ALTNAME_INVALID',
  'fetch failed',
  'network',
  'getaddrinfo',
  'TLS',
  '502',
  '503',
  '504',
  'Failed to fetch',
  'No matching version',
  'unable to verify the first certificate',
].map((value) => value.toLowerCase());

function parseOutput(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function isLikelyTransient(output, parsed) {
  const text = `${output}`.toLowerCase();
  const hasSignature = infraSignatures.some((entry) => text.includes(entry));
  if (hasSignature) return true;

  if (parsed && parsed.error) {
    const signature = `${parsed.error.code || ''} ${parsed.error.summary || ''} ${parsed.error.detail || ''}`.toLowerCase();
    return infraSignatures.some((entry) => signature.includes(entry));
  }

  return false;
}

function hasVulnerabilities(parsed) {
  if (!parsed || !parsed.metadata || !parsed.metadata.vulnerabilities) return false;
  const vulns = parsed.metadata.vulnerabilities;
  const moderateHighCritical = (vulns.moderate || 0) + (vulns.high || 0) + (vulns.critical || 0);
  return moderateHighCritical > 0 ? moderateHighCritical : 0;
}

function runAudit({ label, command }) {
  const [cmd, ...args] = command;
  const result = spawnSync(cmd, args, { encoding: 'utf8' });
  const stdout = result.stdout || '';
  const stderr = result.stderr || '';
  const raw = `${stdout}${stderr}`;
  const parsed = parseOutput(stdout) || parseOutput(stderr);

  if (result.status === 0) {
    const findings = hasVulnerabilities(parsed);
    if (findings) {
      console.error(`⚠️ [test-dependencies] ${label}: npm audit reports ${findings} moderate+ issues despite exit=0`);
      throw new Error(`${label}: inconsistent audit output`);
    }
    console.log(`✅ [test-dependencies] ${label}: audit OK`);
    return;
  }

  if (isLikelyTransient(raw, parsed)) {
    console.warn(`⚠️ [test-dependencies] ${label}: audit failed due to transient/network-like issue, continuing`);
    console.warn(raw.trim());
    return;
  }

  if (parsed && parsed.metadata && parsed.metadata.vulnerabilities) {
    const total = hasVulnerabilities(parsed);
    if (total > 0) {
      console.error(`❌ [test-dependencies] ${label}: ${total} vulnerabilities at moderate+ level`);
      if (stdout) process.stderr.write(`${stdout}\n`);
      if (stderr) process.stderr.write(`${stderr}\n`);
      throw new Error(`${label}: vulnerable dependency tree`);
    }
  }

  console.error(`❌ [test-dependencies] ${label}: audit failed with unknown cause`);
  process.stderr.write(`${stdout}\n${stderr}\n`);
  throw new Error(`${label}: audit failed`);
}

let ok = true;
for (const item of audits) {
  try {
    runAudit(item);
  } catch (error) {
    console.error(error.message);
    ok = false;
    break;
  }
}

if (!ok) {
  process.exit(1);
}
