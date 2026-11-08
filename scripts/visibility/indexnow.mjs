import { safeEvidenceUrl, VERSION, digest } from './storage.mjs';
import { publicRequest } from './network.mjs';
import { timestamp } from './imports.mjs';

export function deploymentManifest(value) {
  if (value?.schema_version !== VERSION || value.successful !== true || !/^[a-f0-9]{40}$/.test(value.sha) || !Array.isArray(value.routes) || value.routes.length > 20_000) throw new Error('deployment_manifest_invalid');
  timestamp(value.verified_at);
  const seen = new Set();
  for (const row of value.routes) {
    const url = new URL(safeEvidenceUrl(row.url));
    if (url.origin !== 'https://l0g.fr' || url.search || url.hash || !url.pathname.endsWith('/') || /^\/(?:api|stats|\.\w|recherche|en\/search)(?:\/|$)/.test(url.pathname) || !/^[a-f0-9]{64}$/.test(row.hash) || seen.has(row.url)) throw new Error('deployment_route_invalid');
    seen.add(row.url);
  }
  return value;
}

export function changedUrls(current, previous, sent = []) {
  deploymentManifest(current); deploymentManifest(previous);
  const old = new Map(previous.routes.map(r => [r.url, r.hash]));
  const latest = new Map(current.routes.map(r => [r.url, r.hash]));
  const changes = current.routes.filter(r => old.get(r.url) !== r.hash).map(r => ({ ...r, change: old.has(r.url) ? 'modified' : 'added' }));
  changes.push(...previous.routes.filter(r => !latest.has(r.url)).map(r => ({ url: r.url, hash: null, change: 'removed' })));
  return changes.map(r => ({ ...r, notification_id: digest([current.sha, r.url, r.hash, r.change]) })).filter(r => !sent.includes(r.notification_id));
}

export async function notifyIndexNow({ current, previous, config, live, audit, sent = [], send = false }, fetcher = publicRequest) {
  const base = { schema_version: VERSION, checked_at: new Date().toISOString(), dry_run: !send, configured: config?.enabled === true, acknowledged_indexation: false };
  if (!current || !previous) return { ...base, state: 'not_configured', reason: 'Two verified deployment manifests required; initial bulk submission is disabled.', urls: [] };
  const changes = changedUrls(current, previous, sent);
  if (!send) return { ...base, state: 'measured', urls: changes, remaining: changes.length };
  if (!config?.enabled || !/^[a-zA-Z0-9-]{8,128}$/.test(config.key ?? '') || !live || live.served_sha !== current.sha || Date.now() - Date.parse(live.checked_at) > 3600_000) throw new Error('indexnow_activation_required');
  const keyLocation = new URL(safeEvidenceUrl(config.key_location));
  if (keyLocation.origin !== 'https://l0g.fr' || keyLocation.search || keyLocation.hash || !/^\/[a-zA-Z0-9-]+\.txt$/.test(keyLocation.pathname)) throw new Error('indexnow_key_location_invalid');
  const allowed = new Set(audit?.routes.filter(r => r.sitemap && r.expected_indexation === 'indexed').map(r => r.url));
  if (changes.some(r => r.change !== 'removed' && !allowed.has(r.url))) throw new Error('indexnow_not_indexable');
  if (!changes.length) return { ...base, state: 'no_data', urls: [], remaining: 0 };
  const proof = await fetcher(keyLocation.href, { limit: 1024 });
  if (proof.status !== 200 || proof.body.trim() !== config.key) throw new Error('indexnow_proof_failed');
  const batch = changes.slice(0, 100);
  const result = await fetcher('https://api.indexnow.org/indexnow', { hosts: ['api.indexnow.org'], method: 'POST', body: JSON.stringify({ host: 'l0g.fr', key: config.key, keyLocation: keyLocation.href, urlList: batch.map(r => r.url) }), limit: 4096 });
  const accepted = [200, 202].includes(result.status);
  return { ...base, state: accepted ? (changes.length > batch.length ? 'partial' : 'measured') : 'error', http_status: result.status, receipt: result.status === 202 ? 'received_key_validation_pending' : accepted ? 'received_only' : 'not_acknowledged', urls: batch, accepted_ids: accepted ? batch.map(r => r.notification_id) : [], remaining: changes.length - (accepted ? batch.length : 0) };
}
