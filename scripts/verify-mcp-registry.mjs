#!/usr/bin/env node

function argument(name, fallback = null) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : fallback;
}

const expectedVersion = argument('--version');
const attempts = Number.parseInt(argument('--attempts', '1'), 10);
const delayMs = Number.parseInt(argument('--delay-ms', '5000'), 10);
if (!expectedVersion) throw new Error('--version est requis');
const url = 'https://registry.modelcontextprotocol.io/v0.1/servers?search=io.github.bluetouff%2Fl0g';

let lastError;
for (let attempt = 1; attempt <= attempts; attempt += 1) {
  try {
    const response = await fetch(url, {
      headers: { Accept: 'application/json', 'User-Agent': 'l0g-mcp-release-verifier/1' },
      signal: AbortSignal.timeout(15_000),
    });
    if (!response.ok) throw new Error(`Registry HTTP ${response.status}`);
    const payload = await response.json();
    const entries = payload.servers?.filter(({ server }) => server?.name === 'io.github.bluetouff/l0g') ?? [];
    if (!entries.length) throw new Error('entrée Registry absente');
    const latestEntries = entries.filter((entry) => entry._meta?.['io.modelcontextprotocol.registry/official']?.isLatest === true);
    if (latestEntries.length !== 1) throw new Error(`Registry latest ambigu : ${latestEntries.length} entrée(s)`);
    const [entry] = latestEntries;
    const server = entry.server;
    if (server.version !== expectedVersion) throw new Error(`Registry=${server.version}, attendu=${expectedVersion}`);
    if (!server.remotes?.some((remote) => remote.type === 'streamable-http' && remote.url === 'https://l0g.fr/api/mcp')) {
      throw new Error('endpoint canonique absent du Registry');
    }
    process.stdout.write(`${JSON.stringify({ ok: true, version: server.version, status: 'latest' })}\n`);
    process.exit(0);
  } catch (error) {
    lastError = error;
    process.stderr.write(`Tentative Registry ${attempt}/${attempts}: ${error.message}\n`);
    if (attempt < attempts) await new Promise((resolve) => setTimeout(resolve, delayMs));
  }
}
throw lastError;
