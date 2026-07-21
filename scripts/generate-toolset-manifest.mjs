import { readFile, writeFile } from 'node:fs/promises';
import { Client } from '../mcp-server/node_modules/@modelcontextprotocol/sdk/dist/esm/client/index.js';
import { InMemoryTransport } from '../mcp-server/node_modules/@modelcontextprotocol/sdk/dist/esm/inMemory.js';
import { MCP_COMPACT_PUBLIC_PATH, MCP_PROTOCOL_VERSION, MCP_PUBLIC_PATH, MCP_VERSION } from '../src/config/agent-contract.mjs';
import { buildServer } from '../mcp-server/server.mjs';
import { buildToolsetManifest } from '../mcp-server/toolset-manifest.mjs';

const target = new URL('../src/generated/toolset-manifest.json', import.meta.url);
const emptySurface = {
  agent: {}, openapi: {}, catalog: {}, searchIndex: {}, claims: {}, sources: {}, freshness: {}, integrity: {}, changes: {},
  riskDiff: null, blackBox: null, evidenceGraph: {}, risk: null, debtRisk: null, signalHistory: null, riskEvents: null, confluence: null,
  dataDir: process.cwd(),
};

async function listTools(surface, data = emptySurface) {
  const server = buildServer(data, { surface });
  const client = new Client({ name: 'l0g-toolset-generator', version: '1.0.0' });
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);
  try {
    return (await client.listTools()).tools;
  } finally {
    await client.close();
    await server.close();
  }
}

const [fullTools, compactTools] = await Promise.all([listTools('full'), listTools('compact')]);
const manifest = buildToolsetManifest({
  serverVersion: MCP_VERSION,
  protocolVersion: MCP_PROTOCOL_VERSION,
  fullTools,
  compactTools,
  paths: { full: MCP_PUBLIC_PATH, compact: MCP_COMPACT_PUBLIC_PATH },
});
const serialized = `${JSON.stringify(manifest, null, 2)}\n`;

if (process.argv.includes('--check')) {
  const current = await readFile(target, 'utf8');
  if (current !== serialized) throw new Error('src/generated/toolset-manifest.json est dérivé du serveur MCP ; exécuter npm run generate:toolset');
  try {
    const catalog = JSON.parse(await readFile(new URL('../dist/api/v1/catalog.json', import.meta.url), 'utf8'));
    const deployedFullTools = await listTools('full', { ...emptySurface, catalog });
    const deployedManifest = buildToolsetManifest({
      serverVersion: MCP_VERSION,
      protocolVersion: MCP_PROTOCOL_VERSION,
      fullTools: deployedFullTools,
      compactTools,
      paths: { full: MCP_PUBLIC_PATH, compact: MCP_COMPACT_PUBLIC_PATH },
    });
    if (deployedManifest.surfaces.full.toolsetHash !== manifest.surfaces.full.toolsetHash || deployedManifest.surfaces.full.toolsListBytes !== manifest.surfaces.full.toolsListBytes) {
      throw new Error('le tools/list construit depuis dist diverge du manifeste anti-dérive');
    }
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error;
  }
} else {
  await writeFile(target, serialized, 'utf8');
}

if (compactTools.length !== 6 || manifest.surfaces.compact.toolsListBytes > 60_000) {
  throw new Error(`MCP compact hors budget: ${compactTools.length} tools, ${manifest.surfaces.compact.toolsListBytes} octets`);
}
if (fullTools.some((tool) => !tool.title || tool.annotations?.readOnlyHint !== true || tool.annotations?.destructiveHint !== false || tool.annotations?.idempotentHint !== true || tool.annotations?.openWorldHint !== false)) {
  throw new Error('annotations MCP complètes manquantes sur au moins un tool');
}

console.log(`toolset ${manifest.toolsetHash.slice(0, 12)} | complet ${fullTools.length}/${manifest.surfaces.full.toolsListBytes} octets | compact ${compactTools.length}/${manifest.surfaces.compact.toolsListBytes} octets`);
