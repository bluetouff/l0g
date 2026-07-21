import { createHash } from 'node:crypto';

const SEMANTIC_VERSIONS = {
  get_risk_indices: '2.1.0',
  build_research_pack: '1.1.0',
};

function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonical(value[key])]));
}
function stableJson(value) {
  return JSON.stringify(canonical(value));
}

function sha256(value) {
  return createHash('sha256').update(typeof value === 'string' ? value : stableJson(value), 'utf8').digest('hex');
}

function fingerprint(tool, isCompactOnly) {
  return {
    name: tool.name,
    semanticVersion: SEMANTIC_VERSIONS[tool.name] || '1.0.0',
    descriptionHash: sha256(tool.description || ''),
    inputSchemaHash: sha256(tool.inputSchema || {}),
    outputSchemaHash: sha256(tool.outputSchema || {}),
    changeType: isCompactOnly ? 'initial' : 'non-breaking',
  };
}

export function buildToolsetManifest({ serverVersion, protocolVersion, fullTools, compactTools, paths }) {
  const fullNames = new Set(fullTools.map((tool) => tool.name));
  const allTools = [...fullTools, ...compactTools.filter((tool) => !fullNames.has(tool.name))]
    .map((tool) => fingerprint(tool, !fullNames.has(tool.name)))
    .sort((a, b) => a.name.localeCompare(b.name));
  const surface = (path, tools) => {
    const contracts = tools.map((tool) => fingerprint(tool, !fullNames.has(tool.name))).sort((a, b) => a.name.localeCompare(b.name));
    return {
      path,
      toolsetHash: sha256(contracts),
      tools: contracts.map((tool) => tool.name),
      toolCount: tools.length,
      toolsListBytes: Buffer.byteLength(JSON.stringify({ tools }), 'utf8'),
    };
  };
  return {
    serverVersion,
    protocolVersion,
    toolsetHash: sha256(allTools),
    tools: allTools,
    surfaces: {
      full: surface(paths.full, fullTools),
      compact: surface(paths.compact, compactTools),
    },
  };
}
