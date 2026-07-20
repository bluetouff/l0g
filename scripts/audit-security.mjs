import { readdir, readFile } from 'node:fs/promises';
import { extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { serializeInlineScriptData } from '../src/lib/security.ts';

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
const lockedVersion = (name) => lock.packages?.[`node_modules/${name}`]?.version || '';
const astroVersion = lockedVersion('astro');
const yamlVersion = lockedVersion('js-yaml');

if (!atLeast(astroVersion, '7.1.0')) {
  fail(`Astro ${astroVersion || 'absent'} reste dans la plage GHSA-4g3v-8h47-v7g6`);
}
if (!atLeast(yamlVersion, '4.3.0')) {
  fail(`js-yaml ${yamlVersion || 'absent'} reste dans la plage GHSA-52cp-r559-cp3m`);
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

const apacheConfig = await readFile(join(ROOT, 'deploy/l0g.fr.apache.conf'), 'utf8');
const cspHeader = apacheConfig
  .match(/Header always set Content-Security-Policy "([\s\S]*?)"/i)?.[1]
  ?.replace(/\\\s*\n\s*/g, ' ') || '';
if (!cspHeader) fail('En-tête Content-Security-Policy Apache absent');
const scriptSources = cspHeader.match(/(?:^|;)\s*script-src\s+([^;]+)/i)?.[1] || '';
if (!scriptSources) fail('Directive Apache script-src absente');
if (scriptSources.includes("'unsafe-inline'")) {
  fail('La directive Apache script-src autorise encore unsafe-inline');
}
for (const directive of [
  "script-src-attr 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
]) {
  if (!cspHeader.includes(directive)) fail(`Directive Apache manquante : ${directive}`);
}

let executableInlineScripts = 0;
let metaPolicies = 0;
let redirectFallbacks = 0;
for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  const cspMeta = (html.match(/<meta\b[^>]*>/gi) || [])
    .find((tag) => /http-equiv=["']content-security-policy["']/i.test(tag));
  if (!cspMeta && /http-equiv=["']refresh["']/i.test(html)) {
    redirectFallbacks += 1;
  } else if (!cspMeta) {
    fail(`${relative(ROOT, file)}: meta CSP autonome absente`);
  } else {
    const metaContent = cspMeta.match(/content="([^"]*)"/i)?.[1] || '';
    const metaScriptSources = metaContent.match(/(?:^|;)\s*script-src\s+([^;]+)/i)?.[1] || '';
    if (!metaScriptSources || metaScriptSources.includes("'unsafe-inline'")) {
      fail(`${relative(ROOT, file)}: meta CSP script-src absente ou permissive`);
    }
    if (!/(?:^|;)\s*script-src-attr\s+'none'(?:;|$)/i.test(metaContent)) {
      fail(`${relative(ROOT, file)}: meta CSP n'interdit pas les attributs de script`);
    }
    metaPolicies += 1;
  }

  for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    const [, attributes, body] = match;
    const type = attributes.match(/\btype=["']([^"']+)["']/i)?.[1]?.toLowerCase();
    if (/\bsrc=["']/i.test(attributes) || type === 'application/ld+json' || !body.trim()) continue;
    executableInlineScripts += 1;
    fail(`${relative(ROOT, file)}: script inline exécutable incompatible avec la CSP Apache`);
  }
}

process.stdout.write(`${JSON.stringify({
  ok: true,
  astroVersion,
  yamlVersion,
  sourceFiles: sourceFiles.length,
  htmlFiles: htmlFiles.length,
  executableInlineScripts,
  metaPolicies,
  redirectFallbacks,
})}\n`);
