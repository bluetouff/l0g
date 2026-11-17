#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { ADVISORY_URL as PICOMATCH_ADVISORY_URL, assertSecureInstallations } from './picomatch-security.mjs';

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
      if (!advisory || typeof advisory !== 'object' || Array.isArray(advisory)) {
        throw new Error(`registry returned an invalid advisory for ${packageName}`);
      }
      if (typeof advisory.severity !== 'string') {
        throw new Error(`registry returned a non-string advisory severity for ${packageName}`);
      }
      const severity = advisory.severity.toLowerCase();
      if (!severityRank.has(severity)) {
        throw new Error(`registry returned an unknown advisory severity for ${packageName}`);
      }
      if ((severityRank.get(severity) || 0) >= severityRank.get('moderate')) {
        findings.push({ packageName, severity, title: advisory.title || 'untitled advisory', url: advisory.url || '', id: advisory.id, vulnerableVersions: advisory.vulnerable_versions });
      }
    }
  }
  return findings;
}

function isLikelyTransient(error) {
  // A local verification deadline is a failed security check, not an
  // unavailable registry. Do not continue to the second audit in that case.
  if (String(error?.message || '').startsWith('picomatch:')) return false;
  const details = `${error?.name || ''} ${error?.message || ''} ${error?.cause || ''}`.toLowerCase();
  return infraSignatures.some((entry) => details.includes(entry));
}

function verifyLocalRemediation(finding, { label, payload }) {
  // This is a capability restriction in both installed parsers, not a claim
  // that the published versions are fixed. Any changed/other advisory blocks.
  if (label !== 'main' || finding.packageName !== 'picomatch' ||
      finding.id !== 1247710 || finding.url !== PICOMATCH_ADVISORY_URL ||
      finding.severity !== 'high' || finding.vulnerableVersions !== '<=4.0.7' ||
      finding.title !== 'picomatch vulnerable to ReDoS through single-branch repeated extglobs') return false;
  const reportedVersions = payload.picomatch;
  if (!Array.isArray(reportedVersions) || reportedVersions.length === 0) return false;
  const evidence = assertSecureInstallations();
  const verifiedVersions = [...new Set(evidence.installations.map(item => item.version))].sort();
  if (JSON.stringify(verifiedVersions) !== JSON.stringify([...reportedVersions].sort())) {
    throw new Error('picomatch: audited versions differ from the verified installed parsers');
  }
  console.log(`🔒 [test-dependencies] ${label}: ${finding.url} locally mitigated; repeated +(...) and *(...) extglobs rejected in all ${evidence.installations.length} verified installations`);
  return true;
}

async function runAudit({ label, lockfile, omitDev }) {
  const payload = buildAuditPayload(lockfile, omitDev);
  // An empty or temporarily changed registry report must not make a missing
  // capability restriction acceptable. Recheck again when qualifying the GHSA.
  if (label === 'main') assertSecureInstallations();
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

  const findings = validateAuditReport(decodeAuditResponse(raw))
    .filter(finding => !verifyLocalRemediation(finding, { label, payload }));
  if (findings.length > 0) {
    console.error(`❌ [test-dependencies] ${label}: ${findings.length} vulnerabilities at moderate+ level`);
    for (const finding of findings) {
      console.error(`- ${finding.packageName}: ${finding.severity} - ${finding.title}${finding.url ? ` (${finding.url})` : ''}`);
    }
    throw new Error(`${label}: vulnerable dependency tree`);
  }

  console.log(`✅ [test-dependencies] ${label}: no unmitigated moderate+ advisory (${Object.keys(payload).length} packages)`);
}

let ok = true;
for (const item of audits) {
  try {
    await runAudit(item);
  } catch (error) {
    if (isLikelyTransient(error)) {
      console.error(`❌ [test-dependencies] ${item.label}: audit unavailable; publication check fails closed`);
      console.error(error.message);
      ok = false;
      continue;
    }
    console.error(`❌ [test-dependencies] ${item.label}: audit failed`);
    console.error(error.message);
    ok = false;
    break;
  }
}

if (!ok) process.exit(1);
