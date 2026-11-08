import { lookup } from 'node:dns/promises';
import { request } from 'node:https';
import { isIP } from 'node:net';
import { setTimeout as delay } from 'node:timers/promises';
import { SITE, inspectHtml, metadataFindings } from './audit.mjs';
import { digest, VERSION } from './storage.mjs';
import { SEO_LIVE_PROBES, validateSeoObservation } from '../verify-seo-live.mjs';

export const PROBE_UA = 'l0g-visibility-probe/1.0';
export function publicAddress(address) {
  if (isIP(address) === 4) {
    const [a, b, c] = address.split('.').map(Number);
    return !(a === 0 || a === 10 || a === 127 || a >= 224 || (a === 100 && b >= 64 && b <= 127)
      || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31)
      || (a === 192 && (b === 168 || b === 0 || (b === 88 && c === 99)))
      || (a === 198 && (b === 18 || b === 19 || (b === 51 && c === 100)))
      || (a === 203 && b === 0 && c === 113));
  }
  if (isIP(address) !== 6) return false;
  // Conservative global-unicast allowlist. Reject mapped IPv4, transition
  // mechanisms, documentation, loopback, private, multicast and link-local.
  const groups = address.toLowerCase().split(':');
  const first = parseInt(groups[0], 16), second = parseInt(groups[1] || '0', 16);
  return first >= 0x2000 && first < 0x3fff && first !== 0x2002
    && !(first === 0x2001 && (second < 0x0200 || second === 0x0db8));
}

export function allowedUrl(raw, hosts = ['l0g.fr']) {
  const url = new URL(raw);
  if (url.protocol !== 'https:' || url.username || url.password || url.port || !hosts.includes(url.hostname) || url.hash) throw new Error('network_url_forbidden');
  return url;
}

// Pin a validated DNS result to the connection. HTTPS still verifies the
// original hostname. No proxy, credentials, cookies, automatic redirects or
// unlimited body buffering. All answers must be public, including IPv6.
export async function publicRequest(raw, { hosts = ['l0g.fr'], method = 'GET', body, limit = 1024 * 1024, timeout = 10_000 } = {}) {
  const url = allowedUrl(raw, hosts);
  const addresses = await Promise.race([
    lookup(url.hostname, { all: true, verbatim: true }),
    delay(timeout, null, { ref: false }).then(() => { throw new Error('dns_timeout'); }),
  ]);
  if (!addresses.length || addresses.some(a => !publicAddress(a.address))) throw new Error('network_address_forbidden');
  const pinned = addresses[0];
  return new Promise((resolve, reject) => {
    const req = request(url, {
      method, agent: false,
      lookup: (_hostname, options, callback) => callback(null, options.all ? [pinned] : pinned.address, pinned.family),
      headers: { 'User-Agent': PROBE_UA, Accept: '*/*', ...(body ? { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) } : {}) },
    }, response => {
      const remote = response.socket.remoteAddress?.replace(/^::ffff:/, '');
      if (remote !== pinned.address.replace(/^::ffff:/, '') || !publicAddress(remote)) { response.destroy(); reject(new Error('network_peer_invalid')); return; }
      const chunks = []; let bytes = 0;
      response.on('data', chunk => { bytes += chunk.length; if (bytes > limit) response.destroy(new Error('response_size_exceeded')); else chunks.push(chunk); });
      response.on('error', () => reject(new Error('network_response_failed')));
      response.on('end', () => resolve({ status: response.statusCode, headers: response.headers, body: Buffer.concat(chunks).toString('utf8') }));
    });
    const timer = setTimeout(() => req.destroy(new Error('network_timeout')), timeout);
    req.once('error', () => reject(new Error('network_request_failed')));
    req.once('close', () => clearTimeout(timer));
    req.end(body);
  });
}

export async function probeLive(inventory, { maxUrls = 20, rps = 1 } = {}, fetcher = publicRequest) {
  if (!Number.isInteger(maxUrls) || maxUrls < 4 || maxUrls > 100 || !Number.isFinite(rps) || rps < 0.2 || rps > 1) throw new Error('probe_bounds_invalid');
  const seed = ['/', '/en/', '/about/', '/en/about/', '/guides/', '/en/guides/'];
  const published = inventory.filter(p => p.sitemap);
  const samples = [...new Set([...seed.filter(path => published.some(p => p.url === SITE + path)), ...published.filter(p => p.type === 'article').slice(0, 2).map(p => new URL(p.url).pathname), ...published.filter(p => p.type === 'article').slice(-2).map(p => new URL(p.url).pathname)])];
  const requests = [
    { path: '/source.env', kind: 'revision' }, { path: '/robots.txt', kind: 'robots' },
    { path: '/visibility-missing-page-probe/', status: 404, kind: 'error' },
    ...SEO_LIVE_PROBES.filter(p => ['/posts', '/sitemap.xml', '/.well-known/mcp.json'].includes(p.path)).map(p => ({ ...p, kind: 'contract' })),
    ...samples.map(path => ({ path, status: 200, kind: 'html' })),
  ].slice(0, maxUrls);
  const results = []; let servedSha = null;
  for (const probe of requests) {
    const started = performance.now();
    try {
      const result = await fetcher(`${SITE}${probe.path}`);
      const observation = { path: probe.path, status: result.status, kind: probe.kind, content_type: result.headers['content-type'], x_robots_tag: result.headers['x-robots-tag'] ?? null, duration_ms: Math.round(performance.now() - started) };
      const errors = [];
      if (probe.status && probe.status !== result.status) errors.push('http_status');
      if (probe.kind === 'contract') {
        observation.location = result.headers.location ?? null;
        if (observation.location) allowedUrl(observation.location);
        errors.push(...validateSeoObservation(probe, observation).map(e => e.split(':')[0]));
      }
      if (probe.kind === 'revision') {
        servedSha = result.status === 200 ? result.body.match(/^L0G_RELEASE_SOURCE_SHA=([a-f0-9]{40})$/m)?.[1] ?? null : null;
        if (!servedSha) errors.push('revision_unavailable');
      }
      if (probe.kind === 'robots') { observation.sha256 = digest(result.body); if (result.status !== 200) errors.push('robots_unavailable'); }
      if (probe.kind === 'html' && result.status === 200) {
        const page = inspectHtml(result.body, SITE + probe.path);
        observation.metadata_findings = metadataFindings(page).map(f => f.id);
        if (/noindex/i.test(observation.x_robots_tag ?? '')) errors.push('header_noindex');
        errors.push(...observation.metadata_findings);
      }
      results.push({ ...observation, errors, state: errors.length ? 'error' : 'measured' });
    } catch { results.push({ path: probe.path, kind: probe.kind, state: 'error', errors: ['probe_failed'] }); }
    await delay(Math.max(0, 1000 / rps - (performance.now() - started)));
  }
  return { schema_version: VERSION, checked_at: new Date().toISOString(), state: results.some(r => r.state === 'error') ? 'partial' : 'measured', served_sha: servedSha, scope: 'bounded_public_sample; User-Agent does not authenticate crawlers', requests: results, max_urls: maxUrls, rps };
}
