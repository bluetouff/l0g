#!/usr/bin/env node

function argument(name, fallback = null) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : fallback;
}

const endpoint = argument('--endpoint', 'https://l0g.fr/api/mcp');
const expectedVersion = argument('--version');
const expectedSha = argument('--sha');
const attempts = Number.parseInt(argument('--attempts', '1'), 10);
const delayMs = Number.parseInt(argument('--delay-ms', '10000'), 10);
if (!expectedVersion || !expectedSha) throw new Error('--version et --sha sont requis');
if (!/^[0-9a-f]{40}$/i.test(expectedSha)) throw new Error('SHA attendu invalide');

async function readServerResource() {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json, text/event-stream',
      'User-Agent': 'l0g-mcp-release-verifier/1',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'resources/read',
      params: { uri: 'l0g://mcp/server' },
    }),
    signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const payload = await response.json();
  if (payload.error) throw new Error(`MCP ${payload.error.code}: ${payload.error.message}`);
  return JSON.parse(payload.result?.contents?.[0]?.text || '{}');
}

let lastError;
for (let attempt = 1; attempt <= attempts; attempt += 1) {
  try {
    const server = await readServerResource();
    if (server.version !== expectedVersion || server.sha !== expectedSha || server.shaStatus !== 'verified-hex' || server.releaseAttested !== true) {
      throw new Error(`vivant=${server.version || 'unknown'}@${server.sha || 'unknown'}, attested=${server.releaseAttested === true}, attendu=${expectedVersion}@${expectedSha}`);
    }
    process.stdout.write(`${JSON.stringify({ ok: true, endpoint, version: server.version, sha: server.sha })}\n`);
    process.exit(0);
  } catch (error) {
    lastError = error;
    process.stderr.write(`Tentative ${attempt}/${attempts}: ${error.message}\n`);
    if (attempt < attempts) await new Promise((resolve) => setTimeout(resolve, delayMs));
  }
}
throw lastError;
