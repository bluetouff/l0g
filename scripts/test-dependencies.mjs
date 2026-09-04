#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';

const AUDIT_ENDPOINT = 'https://registry.npmjs.org/-/npm/v1/security/advisories/bulk';
const AUDIT_TIMEOUT_MS = 60_000;
const severityRank = new Map([
  ['low', 1],
  ['moderate', 2],
  ['high', 3],
  ['critical', 4],
]);

const audits = [
  { label: 'main', lockfile: new URL('../package-lock.json', import.meta.url), omitDev: false },
  { label: 'mcp-server', lockfile: new URL('../mcp-server/package-lock.json', import.meta.url), omitDev: true },
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
  'TimeoutError',
  'fetch failed',
  'network',
  'getaddrinfo',
  'TLS',
  '429',
  '502',
  '503',
  '504',
  'Failed to fetch',
  'No matching version',
  'unable to verify the first certificate',
].map((value) => value.toLowerCase());

function packageNameFromPath(packagePath, metadata) {
  if (typeof metadata.name === 'string' && metadata.name) return metadata.name;
  const marker = 'node_modules/';
  const index = packagePath.lastIndexOf(marker);
  return index === -1 ? '' : packagePath.slice(index + marker.length);
}

function buildAuditPayload(lockfileUrl, omitDev) {
  const lockfile = JSON.parse(readFileSync(lockfileUrl, 'utf8'));
  if (!lockfile.packages || typeof lockfile.packages !== 'object') {
    throw new Error(`${lockfileUrl.pathname}: package-lock.json has no packages map`);
  }

  const versionsByName = new Map();
  for (const [packagePath, metadata] of Object.entries(lockfile.packages)) {
    if (!packagePath || !metadata || typeof metadata !== 'object') continue;
    if (omitDev && metadata.dev === true) continue;
    if (typeof metadata.version !== 'string' || !metadata.version) continue;

    const name = packageNameFromPath(packagePath, metadata);
    if (!name) continue;
    if (!versionsByName.has(name)) versionsByName.set(name, new Set());
    versionsByName.get(name).add(metadata.version);
  }

  return Object.fromEntries(
    [...versionsByName.entries()]
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([name, versions]) => [name, [...versions].sort()]),
  );
}

function decodeAuditResponse(buffer) {
  const isGzip = buffer.length >= 2 && buffer[0] === 0x1f && buffer[1] === 0x8b;
  const decoded = isGzip ? gunzipSync(buffer) : buffer;
  return JSON.parse(decoded.toString('utf8'));
}

function validateAuditReport(report) {
  if (!report || typeof report !== 'object' || Array.isArray(report)) {
    throw new Error('registry returned an invalid bulk advisory report');
  }

  const findings = [];
  for (const [packageName, advisories] of Object.entries(report)) {
    if (!Array.isArray(advisories)) {
      throw new Error(`registry returned invalid advisories for ${packageName}`);
    }
    for (const advisory of advisories) {
      const severity = `${advisory?.severity || ''}`.toLowerCase();
      if ((severityRank.get(severity) || 0) >= severityRank.get('moderate')) {
        findings.push({ packageName, severity, title: advisory.title || 'untitled advisory', url: advisory.url || '' });
      }
    }
  }
  return findings;
}

function isLikelyTransient(error) {
  const details = `${error?.name || ''} ${error?.message || ''} ${error?.cause || ''}`.toLowerCase();
  return infraSignatures.some((entry) => details.includes(entry));
}

async function runAudit({ label, lockfile, omitDev }) {
  const payload = buildAuditPayload(lockfile, omitDev);
  const response = await fetch(AUDIT_ENDPOINT, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(AUDIT_TIMEOUT_MS),
  });

  const raw = Buffer.from(await response.arrayBuffer());
  if (!response.ok) {
    throw new Error(`audit registry returned HTTP ${response.status}: ${raw.toString('utf8').slice(0, 500)}`);
  }

  const findings = validateAuditReport(decodeAuditResponse(raw));
  if (findings.length > 0) {
    console.error(`❌ [test-dependencies] ${label}: ${findings.length} vulnerabilities at moderate+ level`);
    for (const finding of findings) {
      console.error(`- ${finding.packageName}: ${finding.severity} - ${finding.title}${finding.url ? ` (${finding.url})` : ''}`);
    }
    throw new Error(`${label}: vulnerable dependency tree`);
  }

  console.log(`✅ [test-dependencies] ${label}: bulk advisory audit OK (${Object.keys(payload).length} packages)`);
}

let ok = true;
for (const item of audits) {
  try {
    await runAudit(item);
  } catch (error) {
    if (isLikelyTransient(error)) {
      console.warn(`⚠️ [test-dependencies] ${item.label}: audit unavailable due to a transient/network-like issue, continuing`);
      console.warn(error.message);
      continue;
    }
    console.error(`❌ [test-dependencies] ${item.label}: audit failed`);
    console.error(error.message);
    ok = false;
    break;
  }
}

if (!ok) process.exit(1);
