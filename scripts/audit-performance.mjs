import { gzipSync } from 'node:zlib';
import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootUrl = new URL('../dist/', import.meta.url);
const root = fileURLToPath(rootUrl);
const failures = [];

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(path));
    else files.push(path);
  }
  return files;
}

function assert(condition, message) {
  if (!condition) failures.push(message);
}

const htmlFiles = (await walk(root)).filter((file) => file.endsWith('.html'));
for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  const name = relative(root, file);
  const isRedirect = /<meta http-equiv="refresh" content="0;url=[^"]+">/.test(html);
  if (isRedirect) {
    assert(/<meta name="robots" content="noindex">/.test(html), `${name}: redirection sans noindex`);
    assert(/<link rel="canonical" href="https:\/\/l0g\.fr\/[^\"]+">/.test(html), `${name}: redirection sans canonical`);
    continue;
  }
  assert(/<title>[^<]+<\/title>/.test(html), `${name}: title absent`);
  assert(/<meta name="description" content="[^"]+">/.test(html), `${name}: meta description absente`);
  assert(/<link rel="canonical" href="https:\/\/l0g\.fr\/[^"]*">/.test(html), `${name}: canonical absente ou invalide`);
  assert((html.match(/<h1(?:\s|>)/g) || []).length === 1, `${name}: exactement un h1 attendu`);
  if (html.includes('/pagefind/pagefind-ui.js')) {
    assert(name === 'recherche/index.html', `${name}: Pagefind chargé hors de la page de recherche`);
  }
}

const home = await readFile(new URL('index.html', rootUrl));
const homeText = home.toString('utf8');
const homeGzip = gzipSync(home, { level: 9 });
const inlineScriptSizes = [...homeText.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)]
  .map((match) => Buffer.byteLength(match[1]));
const maxInline = Math.max(0, ...inlineScriptSizes);

assert(home.length <= 90_000, `index.html dépasse 90 Ko (${home.length} octets)`);
assert(homeGzip.length <= 16_000, `index.html gzip dépasse 16 Ko (${homeGzip.length} octets)`);
assert(maxInline <= 2_000, `index.html contient un script inline de ${maxInline} octets`);
assert(!homeText.includes('modelContext.registerTool'), 'WebMCP est de nouveau injecté inline dans index.html');
assert(/<script type="module" src="\/_astro\/WebMCPTools\.[^"]+\.js"><\/script>/.test(homeText), 'module WebMCP externe absent');
assert(!homeText.includes('/pagefind/pagefind-ui.js'), 'Pagefind ne doit pas être chargé sur la home');

const search = await readFile(new URL('recherche/index.html', rootUrl), 'utf8');
assert(search.includes('/pagefind/pagefind-ui.js'), 'Pagefind absent de /recherche/');

const apache = await readFile(new URL('../deploy/l0g.fr.apache.conf', import.meta.url), 'utf8');
for (const mime of ['text/plain', 'text/javascript', 'application/x-ndjson', 'application/wasm']) {
  assert(apache.includes(mime), `compression Apache absente pour ${mime}`);
}
assert(apache.includes('<LocationMatch "^/_astro/">'), 'cache fingerprinté /_astro absent');
assert(apache.includes('max-age=31536000, immutable'), 'cache immutable /_astro absent');

if (failures.length) {
  console.error(`Audit performance/SEO en échec (${failures.length})`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  `Performance/SEO OK: ${htmlFiles.length} HTML, home ${home.length} o (${homeGzip.length} o gzip), ` +
  `inline max ${maxInline} o, Pagefind limité à /recherche/.`
);
