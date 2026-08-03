import { readdir, readFile } from 'node:fs/promises';
import { extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { legacySurfaceRedirects } from '../src/config/legacy-surface-redirects.mjs';
import { serializeInlineScriptData } from '../src/lib/security.ts';
import { scanHtmlElements } from '../src/lib/html-utils.ts';

const ROOT = fileURLToPath(new URL('../', import.meta.url));

function fail(message) {
  throw new Error(message);
}

function atLeast(actual, minimum) {
  const a = actual.split('.').map(Number);
  const b = minimum.split('.').map(Number);
  for (let i = 0; i < Math.max(a.length, b.length); i += 1) {
    const delta = (a[i] || 0) - (b[i] || 0);
    if (delta !== 0) return delta > 0;
  }
  return true;
}

async function filesUnder(root, extensions) {
  const files = [];
  for (const entry of await readdir(root, { withFileTypes: true })) {
    const path = join(root, entry.name);
    if (entry.isDirectory()) files.push(...await filesUnder(path, extensions));
    else if (extensions.has(extname(entry.name))) files.push(path);
  }
  return files;
}

const lock = JSON.parse(await readFile(join(ROOT, 'package-lock.json'), 'utf8'));
const mcpPackage = JSON.parse(await readFile(join(ROOT, 'mcp-server', 'package.json'), 'utf8'));
const mcpLock = JSON.parse(await readFile(join(ROOT, 'mcp-server', 'package-lock.json'), 'utf8'));
const mcpServerSource = await readFile(join(ROOT, 'mcp-server', 'server.mjs'), 'utf8');
const mcpDeploySource = await readFile(join(ROOT, 'mcp-server/deploy/l0g-mcp-deploy.sh'), 'utf8');
const lockedVersion = (name) => lock.packages?.[`node_modules/${name}`]?.version || '';
const lockedVersions = (sourceLock, name) => Object.entries(sourceLock.packages || {})
  .filter(([path]) => path === `node_modules/${name}` || path.endsWith(`/node_modules/${name}`))
  .map(([, metadata]) => metadata.version)
  .filter(Boolean);
const astroVersion = lockedVersion('astro');
const yamlVersion = lockedVersion('js-yaml');
const mcpSdkVersion = mcpLock.packages?.['node_modules/@modelcontextprotocol/sdk']?.version || '';
const honoVersions = lockedVersions(mcpLock, '@hono/node-server');
const fastUriVersions = [
  ...lockedVersions(lock, 'fast-uri'),
  ...lockedVersions(mcpLock, 'fast-uri'),
];

if (!atLeast(astroVersion, '7.1.0')) {
  fail(`Astro ${astroVersion || 'absent'} reste dans la plage GHSA-4g3v-8h47-v7g6`);
}
if (!atLeast(yamlVersion, '4.3.0')) {
  fail(`js-yaml ${yamlVersion || 'absent'} reste dans la plage GHSA-52cp-r559-cp3m`);
}
if (!atLeast(mcpSdkVersion, '1.30.0')) {
  fail(`SDK MCP ${mcpSdkVersion || 'absent'} antérieur à la version maintenue attendue 1.30.0`);
}
if (mcpPackage.engines?.node !== '>=22'
    || !mcpServerSource.includes('NODE_MAJOR < 22')
    || !mcpDeploySource.includes('"$NODE_MAJOR" -lt 22')) {
  fail('Le runtime MCP doit refuser les versions Node.js hors support antérieures à 22');
}
if (!honoVersions.length || honoVersions.some((version) => {
  const [major, minor, patch] = version.split('.').map(Number);
  return major === 2 && minor === 0 && patch <= 9;
})) {
  fail(`@hono/node-server vulnérable ou absent dans le lockfile MCP (${honoVersions.join(', ') || 'absent'})`);
}
if (mcpPackage.overrides?.['@hono/node-server'] !== honoVersions[0]) {
  fail(`override @hono/node-server non aligné sur le lockfile MCP (${mcpPackage.overrides?.['@hono/node-server'] || 'absent'} / ${honoVersions[0] || 'absent'})`);
}
if (!fastUriVersions.length || fastUriVersions.some((version) => !atLeast(version, '3.1.4'))) {
  fail(`fast-uri doit rester corrigé dans tous les lockfiles (${fastUriVersions.join(', ') || 'absent'})`);
}

const sourceFiles = await filesUnder(join(ROOT, 'src'), new Set(['.astro', '.js', '.mjs', '.ts']));
const sourceFindings = [];
for (const file of sourceFiles) {
  const source = await readFile(file, 'utf8');
  const name = relative(ROOT, file);
  if (/from\s+['"]astro:transitions(?:\/client)?['"]|<ClientRouter\b|transition:(?:animate|name|persist)\b/.test(source)) {
    sourceFindings.push(`${name}: API View Transitions à réauditer avant activation`);
  }
  if (/export\s+const\s+prerender\s*=\s*false\b/.test(source)) {
    sourceFindings.push(`${name}: rendu à la demande hors du modèle statique`);
  }
  source.split('\n').forEach((line, index) => {
    if (line.includes('set:html={JSON.stringify') && !line.includes(".replace(/</g, '\\\\u003c')")) {
      sourceFindings.push(`${name}:${index + 1}: JSON brut dans un contexte <script>`);
    }
  });
}
if (sourceFindings.length) fail(sourceFindings.join('\n'));

const probe = '</script><script>alert(1)</script>\u2028';
const serialized = serializeInlineScriptData({ probe });
if (serialized.includes('<') || serialized.includes('\u2028')) {
  fail('La sérialisation inline laisse passer un terminateur HTML ou U+2028 brut');
}
if (JSON.parse(serialized).probe !== probe) {
  fail('La sérialisation inline altère les données JSON');
}

const htmlFiles = await filesUnder(join(ROOT, 'dist'), new Set(['.html']));
if (!htmlFiles.length) fail('Aucune page HTML construite à auditer dans dist');
const modSecurityOracleLeakagePattern = /ORA-[0-9]{4}|java\.sql\.SQLException|Oracle error|Oracle[\s\S]*Driver|Warning[\s\S]*oci_[\s\S]*|Warning[\s\S]*ora_[\s\S]*/i;
const cssFiles = await filesUnder(join(ROOT, 'dist'), new Set(['.css']));
for (const file of cssFiles) {
  const css = await readFile(file, 'utf8');
  if (/url\(\s*["']?data:font\//i.test(css)) {
    fail(`${relative(ROOT, file)}: police data: incompatible avec font-src 'self'`);
  }
}
const builtScriptFiles = await filesUnder(join(ROOT, 'dist/_astro'), new Set(['.js', '.mjs']));
for (const file of builtScriptFiles) {
  const script = await readFile(file, 'utf8');
  if (/(?:\.innerHTML\s*=|\.outerHTML\s*=|insertAdjacentHTML\s*\(|document\.write\s*\(|new\s+DOMParser\s*\(\)\.parseFromString\s*\()/i.test(script)) {
    fail(`${relative(ROOT, file)}: sink DOM incompatible avec Trusted Types strict`);
  }
}
const pagefindInit = await readFile(join(ROOT, 'src/scripts/pagefind-init.js'), 'utf8');
if (/(?:\.innerHTML\s*=|\.outerHTML\s*=|insertAdjacentHTML\s*\(|document\.write\s*\(|new\s+DOMParser\s*\(\)\.parseFromString\s*\()/i.test(pagefindInit)) {
  fail('src/scripts/pagefind-init.js: sink DOM incompatible avec Trusted Types strict');
}
if (!/pagefind\.options\(\{\s*noWorker:\s*true\s*\}\)/.test(pagefindInit)) {
  fail('src/scripts/pagefind-init.js: Pagefind doit désactiver Worker(url), sink TrustedScriptURL');
}

const apacheConfig = await readFile(join(ROOT, 'deploy/l0g.fr.apache.conf'), 'utf8');
const mcpApacheConfig = await readFile(join(ROOT, 'mcp-server/deploy/apache-l0g-mcp.conf'), 'utf8');
for (const directive of [
  'ServerTokens Prod',
  'ServerSignature Off',
  'TraceEnable Off',
  'RequestReadTimeout handshake=10-20,MinRate=500 header=10-30,MinRate=500 body=10,MinRate=500',
  'Header always set X-XSS-Protection "0"',
]) {
  if (!apacheConfig.includes(directive)) fail(`Durcissement Apache manquant : ${directive}`);
}
if (!apacheConfig.includes('<LocationMatch "^/(agents\\.json|openapi\\.json|llms(?:-full(?:-en)?)?\\.txt)$">')) {
  fail('CORS public borné absent pour agents.json, openapi.json et llms*.txt');
}
if (!apacheConfig.includes('<Location "/api/mcp/compact">') || !apacheConfig.includes('http://127.0.0.1:8848/mcp/compact')) {
  fail('reverse proxy MCP compact absent');
}
for (const directive of ['ProxyRequests Off', 'ProxyPreserveHost On', 'ProxyAddHeaders Off']) {
  if (!apacheConfig.includes(directive)) fail(`Durcissement proxy MCP manquant : ${directive}`);
  if (!mcpApacheConfig.includes(directive)) fail(`Durcissement proxy MCP autonome manquant : ${directive}`);
}
if ((mcpApacheConfig.match(/RequestHeader set X-Forwarded-For "expr=%\{REMOTE_ADDR\}"/g) || []).length !== 2
    || mcpApacheConfig.includes('%{REMOTE_ADDR}s')) {
  fail('Le proxy MCP autonome doit remplacer X-Forwarded-For par l’adresse cliente Apache');
}
const compactLocation = apacheConfig.match(/<Location "\/api\/mcp\/compact">([\s\S]*?)<\/Location>/)?.[1] || '';
if (!compactLocation.includes('Header always unset Access-Control-Allow-Origin')
    || !compactLocation.includes('<LimitExcept POST GET>')
    || !compactLocation.includes('RequestHeader set X-Forwarded-For "expr=%{REMOTE_ADDR}"')
    || !compactLocation.includes('RequestHeader unset Proxy')) {
  fail('MCP compact doit rester sans CORS générique, borné à GET/POST et recevoir une IP proxy fiable');
}
const fullMcpLocation = apacheConfig.match(/<Location "\/api\/mcp">([\s\S]*?)<\/Location>/)?.[1] || '';
if (!fullMcpLocation.includes('RequestHeader set X-Forwarded-For "expr=%{REMOTE_ADDR}"')
    || !fullMcpLocation.includes('RequestHeader unset Proxy')) {
  fail('MCP complet doit recevoir une IP proxy fiable et neutraliser Proxy');
}
const cspHeader = apacheConfig
  .match(/Header always set Content-Security-Policy "([\s\S]*?)"/i)?.[1]
  ?.replace(/\\\s*\n\s*/g, ' ') || '';
if (!cspHeader) fail('En-tête Content-Security-Policy Apache absent');
const scriptSources = cspHeader.match(/(?:^|;)\s*script-src\s+([^;]+)/i)?.[1] || '';
if (!scriptSources) fail('Directive Apache script-src absente');
if (scriptSources.includes("'unsafe-inline'")) {
  fail('La directive Apache script-src autorise encore unsafe-inline');
}
const fetchDirectives = [
  'default-src',
  'script-src',
  'style-src',
  'img-src',
  'font-src',
  'connect-src',
  'frame-src',
  'worker-src',
  'manifest-src',
  'media-src',
  'object-src',
];
for (const directiveName of fetchDirectives) {
  const sources = cspHeader.match(new RegExp(`(?:^|;)\\s*${directiveName}\\s+([^;]+)`, 'i'))?.[1] || '';
  if (!sources) fail(`Directive Apache ${directiveName} absente`);
  if (/(?:https?:|wss?:|\*)/i.test(sources)) {
    fail(`La directive Apache ${directiveName} autorise encore une origine tierce`);
  }
}
for (const directive of [
  "script-src-attr 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  "trusted-types 'none'",
  "require-trusted-types-for 'script'",
]) {
  if (!cspHeader.includes(directive)) fail(`Directive Apache manquante : ${directive}`);
}

let executableInlineScripts = 0;
let metaPolicies = 0;
let redirectFallbacks = 0;
let thirdPartyResources = 0;
for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  const relativeFile = relative(ROOT, file);
  if (modSecurityOracleLeakagePattern.test(html)) {
    fail(`${relativeFile}: faux positif Oracle bloqué par OWASP CRS 951100/951120 dans la réponse HTML`);
  }
  const elements = scanHtmlElements(html);
  const cspMeta = elements.find((element) => element.name === 'meta' &&
    element.attributes.get('http-equiv')?.toLowerCase() === 'content-security-policy');
  const refreshMeta = elements.some((element) => element.name === 'meta' &&
    element.attributes.get('http-equiv')?.toLowerCase() === 'refresh');
  if (!cspMeta && refreshMeta) {
    redirectFallbacks += 1;
  } else if (!cspMeta) {
    fail(`${relative(ROOT, file)}: meta CSP autonome absente`);
  } else {
    const metaContent = cspMeta.attributes.get('content') || '';
    const metaScriptSources = metaContent.match(/(?:^|;)\s*script-src\s+([^;]+)/i)?.[1] || '';
    if (!metaScriptSources || metaScriptSources.includes("'unsafe-inline'")) {
      fail(`${relative(ROOT, file)}: meta CSP script-src absente ou permissive`);
    }
    if (!/(?:^|;)\s*script-src-attr\s+'none'(?:;|$)/i.test(metaContent)) {
      fail(`${relative(ROOT, file)}: meta CSP n'interdit pas les attributs de script`);
    }
    for (const directiveName of fetchDirectives) {
      const sources = metaContent.match(new RegExp(`(?:^|;)\\s*${directiveName}\\s+([^;]+)`, 'i'))?.[1] || '';
      if (!sources || /(?:https?:|wss?:|\*)/i.test(sources)) {
        fail(`${relative(ROOT, file)}: meta CSP ${directiveName} autorise une origine tierce`);
      }
    }
    metaPolicies += 1;
  }

  const resourceAttributes = new Map([
    ['script', ['src']],
    ['iframe', ['src']],
    ['img', ['src', 'srcset']],
    ['source', ['src', 'srcset']],
    ['video', ['src', 'poster']],
    ['audio', ['src']],
    ['track', ['src']],
    ['embed', ['src']],
    ['object', ['data']],
    ['input', ['src']],
    ['link', ['href']],
  ]);
  for (const element of elements) {
    const attributes = resourceAttributes.get(element.name) || [];
    for (const attribute of attributes) {
      const value = element.attributes.get(attribute) || '';
      const absoluteUrls = value.match(/(?:https?:)?\/\/[^\s,]+/gi) || [];
      const expectedExternalRedirect = relativeFile === 'dist/btc/index.html'
        ? legacySurfaceRedirects['/btc']
        : null;
      if (absoluteUrls.some((url) =>
        !/^(?:https:)?\/\/l0g\.fr(?:\/|$)/i.test(url)
        && !(refreshMeta && expectedExternalRedirect && url === expectedExternalRedirect)
      )) {
        thirdPartyResources += 1;
        fail(`${relativeFile}: ressource tierce chargée automatiquement (${element.name} ${attribute})`);
      }
    }
  }

  for (const element of elements.filter((candidate) => candidate.name === 'script')) {
    const type = element.attributes.get('type')?.toLowerCase();
    if (element.attributes.has('src') || type === 'application/ld+json' || !element.body.trim()) continue;
    executableInlineScripts += 1;
    fail(`${relative(ROOT, file)}: script inline exécutable incompatible avec la CSP Apache`);
  }
}

process.stdout.write(`${JSON.stringify({
  ok: true,
  astroVersion,
  yamlVersion,
  mcpSdkVersion,
  honoVersions,
  fastUriVersions,
  sourceFiles: sourceFiles.length,
  htmlFiles: htmlFiles.length,
  cssFiles: cssFiles.length,
  builtScriptFiles: builtScriptFiles.length,
  executableInlineScripts,
  metaPolicies,
  redirectFallbacks,
  thirdPartyResources,
})}\n`);
