#!/usr/bin/env node

import http from 'node:http';
import { execFile } from 'node:child_process';
import readline from 'node:readline';
import { randomBytes, timingSafeEqual } from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const ROOT = process.cwd();
const HOST = '127.0.0.1';
const PORT = Number(process.env.L0G_REVIEW_PORT || 4317);
const CLAIMS_PATH = path.join(ROOT, 'dist/api/v1/claims.json');
const REVIEW_PATH = path.join(ROOT, 'src/config/claim-reviews.json');
const PACKAGE_PATH = path.join(ROOT, 'package.json');
const HTML_PATH = path.join(path.dirname(fileURLToPath(import.meta.url)), 'review-claims.html');
const REVIEW_TOKEN = randomBytes(24).toString('hex');
const ALLOWED_KINDS = new Set(['fait', 'estimation', 'inférence', 'scénario', 'unclassified-assertion']);
const ALLOWED_PROOFS = new Set(['', 'direct-proof', 'reproduction']);
const ALLOWED_LOCATORS = new Set(['page', 'section', 'table', 'series', 'cell', 'form', 'calculation', 'other']);
const MAX_PAYLOAD_BYTES = 24_000;
const MAX_FIELD_LENGTHS = {
  claimId: 200,
  reviewedBy: 120,
  note: 6_000,
  proofDepth: 64,
  locatorType: 64,
  locatorValue: 1_000,
  reproductionArtifact: 1_200,
};
const RATE_WINDOW_MS = 60_000;
const RATE_LIMIT = 30;
const operationRequestHistory = new Map();
const securityEvents = [];
const SECURITY_EVENTS_MAX = 200;
const securityFailureCounts = new Map();
const CLI_FLAGS = new Set([
  '--commit',
  '--dry-run',
  '--push',
  '--no-push',
  '--message',
  '-m',
  '--help',
  '-h',
]);
const C = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  dim: '\x1b[2m',
};

function json(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'content-length': Buffer.byteLength(body),
    'cache-control': 'no-store',
    'x-content-type-options': 'nosniff',
    'x-frame-options': 'DENY',
    'referrer-policy': 'no-referrer',
  });
  res.end(body);
}

function text(res, status, payload, type = 'text/plain; charset=utf-8') {
  res.writeHead(status, {
    'content-type': type,
    'content-length': Buffer.byteLength(payload),
    'cache-control': 'no-store',
    'x-content-type-options': 'nosniff',
    'x-frame-options': 'DENY',
    'referrer-policy': 'no-referrer',
  });
  res.end(payload);
}

async function readJson(file) {
  return JSON.parse(await fs.readFile(file, 'utf8'));
}

async function writeJsonAtomic(file, value) {
  const tmp = `${file}.tmp-${process.pid}`;
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(tmp, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
  await fs.rename(tmp, file);
}

async function command(commandName, args, options = {}) {
  try {
    const result = await execFileAsync(commandName, args, {
      cwd: ROOT,
      maxBuffer: 20 * 1024 * 1024,
      ...options,
    });
    return { ok: true, stdout: result.stdout || '', stderr: result.stderr || '' };
  } catch (error) {
    return {
      ok: false,
      stdout: error.stdout || '',
      stderr: error.stderr || error.message || String(error),
      code: error.code ?? 1,
    };
  }
}

async function ensureRepository() {
  const pkg = await readJson(PACKAGE_PATH).catch(() => null);
  if (!pkg || pkg.name !== 'l0g') throw new Error('Lance cette commande depuis la racine du dépôt l0g.');
  const inside = await command('git', ['rev-parse', '--is-inside-work-tree']);
  if (!inside.ok || inside.stdout.trim() !== 'true') throw new Error('Le dossier courant n’est pas un dépôt Git.');
}

async function latestMtime(dir) {
  let latest = 0;
  const entries = await fs.readdir(dir, { withFileTypes: true }).catch(() => []);
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) latest = Math.max(latest, await latestMtime(full));
    else if (/\.(md|mdx|ts|json)$/i.test(entry.name)) latest = Math.max(latest, (await fs.stat(full)).mtimeMs);
  }
  return latest;
}

async function ensureClaims({ force = false } = {}) {
  const stat = await fs.stat(CLAIMS_PATH).catch(() => null);
  const sourceMtime = Math.max(
    await latestMtime(path.join(ROOT, 'src/content')),
    await latestMtime(path.join(ROOT, 'src/config')),
    await latestMtime(path.join(ROOT, 'src/lib')),
  );
  if (force || !stat || stat.mtimeMs < sourceMtime) {
    const built = await command('npm', ['run', 'build']);
    if (!built.ok) throw new Error(`Le build a échoué.\n\n${built.stdout}\n${built.stderr}`);
  }
}

function shellQuote(value) {
  return `'${String(value).replace(/'/g, `'\\''`)}'`;
}

function parseArgs(argv) {
  const options = { commit: false, push: false, dryRun: false, message: 'Review evidence claims', help: false };
  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--commit') options.commit = true;
    else if (arg === '--dry-run') options.dryRun = true;
    else if (arg === '--push') options.push = true;
    else if (/^--message=/.test(arg) || /^-m=/.test(arg)) {
      const value = arg.includes('=') ? arg.split('=', 2)[1] : '';
      if (!value) {
        throw new Error(`Option message attend une valeur.
Usage: --message "..." | --message="..." | -m="..." | -m "..."`);
      }
      options.message = value;
    }
    else if (arg === '--message' || arg === '-m') {
      const next = argv[i + 1];
      if (!next) {
        throw new Error(`Option ${arg} attend une valeur.
Usage: --message "..." | --message="..." | -m="..." | -m "..."`);
      }
      if (next === '--') {
        throw new Error(`Option ${arg} attend une valeur.
Usage: --message "..." | --message="..." | -m="..." | -m "..."`);
      }
      if (next.startsWith('-') && CLI_FLAGS.has(next)) {
        throw new Error(`Option ${arg} attend une valeur; ${next} semble être une option.
Usage: --message "..." | --message="..." | -m="..." | -m "..."`);
      }
      options.message = next || '';
      i += 1;
    } else if (arg === '--help' || arg === '-h') options.help = true;
    else if (arg === '--no-push') options.push = false;
    else if (/^--/.test(arg) || /^-[^-]/.test(arg)) {
      throw new Error(`Argument inconnu: ${arg}`);
    } else {
      throw new Error(`Argument inattendu: ${arg}`);
    }
  }
  return options;
}

function printUsage() {
  console.log(`${C.blue}
Usage:
  node scripts/review-claims.mjs
      Lance l’interface locale de review sur http://127.0.0.1:4317 (localhost uniquement)

  node scripts/review-claims.mjs --commit [--push] [--message "..." ] [--dry-run]
      Committe la revue avec confirmation manuelle dans le terminal.
      Avec --dry-run, prévisualise la commande et le diff sans modifier Git.
${C.dim}Options:
  --commit        Lance le commit des reviews (terminal uniquement)
  --dry-run       Affiche un aperçu sans écrire dans Git
  --push          Pousse le commit après création
  --message, -m   Définit le message du commit
  --help, -h      Affiche cette aide${C.reset}

L’UI de review local envoie un token anti-CSRF dans l’en-tête x-review-token pour toutes les POST
locales, et le service n’accepte que JSON applicatif.
`);
}

function requireJsonRequest(req) {
  const contentType = String(req.headers['content-type'] || '').toLowerCase();
  if (!contentType.startsWith('application/json')) {
    throw new Error('Content-Type invalide: application/json requis.');
  }
}

function requireReviewToken(req) {
  const headerValue = req.headers['x-review-token'];
  const providedToken = Array.isArray(headerValue) ? headerValue[0] : headerValue;
  if (
    typeof providedToken !== 'string'
    || providedToken.length !== REVIEW_TOKEN.length
    || !timingSafeEqual(Buffer.from(providedToken), Buffer.from(REVIEW_TOKEN))
  ) {
    throw new Error('Token de sécurité manquant ou invalide.');
  }
}

function formatRemote(req) {
  return req.socket?.remoteAddress || 'unknown';
}

function securityRecord() {
  return {
    timestamp: new Date().toISOString(),
    type: 'request-rejected',
    reason: 'unknown',
    path: 'unknown',
    method: 'unknown',
    remote: 'unknown',
  };
}

function logSecurityEvent(type, req, reason) {
  const entry = securityRecord();
  entry.timestamp = new Date().toISOString();
  entry.type = type;
  entry.reason = String(reason || 'Erreur inconnue.');
  entry.path = req.url || 'unknown';
  entry.method = req.method || 'unknown';
  entry.remote = formatRemote(req);
  securityEvents.push(entry);
  if (securityEvents.length > SECURITY_EVENTS_MAX) securityEvents.shift();

  const failure = securityFailureCounts.get(entry.remote) || {
    total: 0,
    byType: {},
    lastAt: null,
    lastPath: null,
    lastReason: null,
  };
  failure.total += 1;
  failure.byType[type] = (failure.byType[type] || 0) + 1;
  failure.lastAt = entry.timestamp;
  failure.lastPath = entry.path;
  failure.lastReason = entry.reason;
  securityFailureCounts.set(entry.remote, failure);
  console.error(`[SECURITY] ${JSON.stringify(entry)}`);
}

function securityStats() {
  return {
    generatedAt: new Date().toISOString(),
    failuresByIp: Object.fromEntries(
      [...securityFailureCounts.entries()]
        .sort((a, b) => b[1].total - a[1].total)
        .map(([ip, stats]) => [ip, {
          total: stats.total,
          byType: stats.byType,
          lastAt: stats.lastAt,
          lastPath: stats.lastPath,
          lastReason: stats.lastReason,
        }]),
    ),
    recentEvents: securityEvents.slice(-40),
  };
}

function enforceRateLimit(req) {
  const path = String(req.url || '').split('?')[0] || '/';
  const key = `${formatRemote(req)}|${path}`;
  const now = Date.now();
  const items = operationRequestHistory.get(key) || [];
  const next = items.filter((ts) => now - ts < RATE_WINDOW_MS);
  if (next.length >= RATE_LIMIT) {
    throw new Error(`Trop de requêtes: max ${RATE_LIMIT} toutes les ${RATE_WINDOW_MS / 1000}s.`);
  }
  next.push(now);
  operationRequestHistory.set(key, next);
}

function sanitizeField(value, label, limit, { required = false } = {}) {
  const valueStr = String(value || '').trim();
  if (required && !valueStr) throw new Error(`${label} est requis.`);
  if (valueStr.length > limit) {
    throw new Error(`${label} trop long (${valueStr.length}/${limit} caractères).`);
  }
  return valueStr;
}

function askTerminalConfirmation() {
  if (!process.stdin.isTTY || !process.stdout.isTTY) {
    throw new Error('Le mode --commit doit être lancé en terminal interactif.');
  }
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question('Tape EXACTEMENT "CONFIRMER" pour valider le commit Git: ', (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

async function loadReviews() {
  return readJson(REVIEW_PATH).catch(() => ({
    version: new Date().toISOString().slice(0, 10),
    updated: new Date().toISOString().slice(0, 10),
    entries: [],
  }));
}

async function loadState({ forceBuild = false } = {}) {
  await ensureClaims({ force: forceBuild });
  const claimsSurface = await readJson(CLAIMS_PATH);
  const registry = await loadReviews();
  const reviewMap = new Map(registry.entries.map((entry) => [entry.claimId, entry]));
  const gitName = await command('git', ['config', 'user.name']);
  const branch = await command('git', ['branch', '--show-current']);
  const status = await command('git', ['status', '--short']);
  return {
    generated: claimsSurface.generated,
    counts: claimsSurface.counts,
    claims: claimsSurface.claims.map((claim) => ({ ...claim, review: reviewMap.get(claim.id) || null })),
    registry,
    reviewer: gitName.stdout.trim() || 'bluetouff',
    branch: branch.stdout.trim(),
    gitStatus: status.stdout.trim().split('\n').filter(Boolean),
  };
}

function validateReview(body, claimIds) {
  const claimId = sanitizeField(body.claimId, 'claimId', MAX_FIELD_LENGTHS.claimId, { required: true });
  const reviewedBy = sanitizeField(body.reviewedBy, 'Le nom du reviewer', MAX_FIELD_LENGTHS.reviewedBy, { required: true });
  const kind = sanitizeField(body.kind, 'Le type de claim', MAX_FIELD_LENGTHS.proofDepth);
  const note = sanitizeField(body.note, 'Note de revue', MAX_FIELD_LENGTHS.note, { required: true });
  const proofDepth = sanitizeField(body.proofDepth, 'Niveau de preuve', MAX_FIELD_LENGTHS.proofDepth);
  const locatorType = sanitizeField(body.evidenceLocator?.type, 'Type de localisateur', MAX_FIELD_LENGTHS.locatorType);
  const locatorValue = sanitizeField(body.evidenceLocator?.value, 'Localisateur', MAX_FIELD_LENGTHS.locatorValue);
  const reproductionArtifact = sanitizeField(body.reproductionArtifact, 'Artefact de reproduction', MAX_FIELD_LENGTHS.reproductionArtifact);

  if (!claimIds.has(claimId)) throw new Error('Claim inconnue ou corpus local obsolète.');
  if (!reviewedBy) throw new Error('Le nom du reviewer est obligatoire.');
  if (!ALLOWED_KINDS.has(kind)) throw new Error('Type de claim invalide.');
  if (!note) throw new Error('Ajoute une note de revue, même courte.');
  if (!ALLOWED_PROOFS.has(proofDepth)) throw new Error('Niveau de preuve invalide.');
  if (proofDepth && (!ALLOWED_LOCATORS.has(locatorType) || !locatorValue)) {
    throw new Error('Une preuve directe ou reproduction exige un localisateur précis.');
  }
  if (proofDepth === 'reproduction' && !reproductionArtifact) {
    throw new Error('Une reproduction exige un artefact reproductible.');
  }

  return {
    claimId,
    reviewedAt: new Date().toISOString(),
    reviewedBy,
    kind,
    note,
    ...(proofDepth ? { proofDepth, evidenceLocator: { type: locatorType, value: locatorValue } } : {}),
    ...(proofDepth === 'reproduction' ? { reproductionArtifact } : {}),
  };
}

async function saveReview(body) {
  await ensureClaims();
  const claimsSurface = await readJson(CLAIMS_PATH);
  const entry = validateReview(body, new Set(claimsSurface.claims.map((claim) => claim.id)));
  const registry = await loadReviews();
  const entries = registry.entries.filter((item) => item.claimId !== entry.claimId);
  entries.push(entry);
  entries.sort((a, b) => a.claimId.localeCompare(b.claimId, 'fr'));
  const today = new Date().toISOString().slice(0, 10);
  const next = { version: today, updated: today, entries };
  await writeJsonAtomic(REVIEW_PATH, next);
  return next;
}

async function removeReview(claimId) {
  if (!String(claimId || '').trim()) throw new Error('claimId manquant.');
  const normalized = sanitizeField(claimId, 'claimId', MAX_FIELD_LENGTHS.claimId, { required: true });
  const registry = await loadReviews();
  const today = new Date().toISOString().slice(0, 10);
  const nextEntries = registry.entries.filter((item) => item.claimId !== normalized);
  if (nextEntries.length === registry.entries.length) {
    throw new Error('Aucune review trouvée pour ce claimId.');
  }
  const next = {
    version: today,
    updated: today,
    entries: nextEntries,
  };
  await writeJsonAtomic(REVIEW_PATH, next);
  return next;
}

async function commitReviews({ push = false, message = '', confirmation = '', dryRun = false } = {}) {
  if (!dryRun && String(confirmation || '').trim() !== 'CONFIRMER') {
    throw new Error('Confirmation explicite requise : tape "CONFIRMER" pour poursuivre le commit.');
  }
  const stagedBefore = await command('git', ['diff', '--cached', '--name-only']);
  if (!stagedBefore.ok) {
    throw new Error(`Impossible de lire l’index Git: ${stagedBefore.stderr || stagedBefore.stdout}`);
  }
  if (stagedBefore.stdout.trim()) {
    throw new Error(`Des fichiers sont déjà indexés dans Git. Désindexe-les avant le commit automatique :\n${stagedBefore.stdout}`);
  }

  const build = await command('npm', ['run', 'build']);
  if (!build.ok) throw new Error(`Validation impossible : le build a échoué.\n\n${build.stdout}\n${build.stderr}`);

  const diff = await command('git', ['diff', '--', 'src/config/claim-reviews.json']);
  if (!diff.ok) {
    throw new Error(`Impossible de lire le diff du fichier de review: ${diff.stderr || diff.stdout}`);
  }
  if (diff.ok && !diff.stdout.trim()) throw new Error('Aucune nouvelle review à committer.');

  const registry = await loadReviews();
  const commitMessage = String(message || '').trim() || `Review ${registry.entries.length} evidence claim${registry.entries.length > 1 ? 's' : ''}`;
  if (dryRun) {
    return {
      dryRun: true,
      commitMessage,
      push,
      diff: diff.stdout || '',
      build: build.stdout.trim().split('\n').slice(-12).join('\n'),
    };
  }

  const add = await command('git', ['add', 'src/config/claim-reviews.json']);
  if (!add.ok) throw new Error(add.stderr || 'git add a échoué.');

  const staged = await command('git', ['diff', '--cached', '--quiet']);
  if (staged.ok) throw new Error('Aucune nouvelle review à committer.');

  const commit = await command('git', ['commit', '-m', commitMessage]);
  if (!commit.ok) throw new Error(`${commit.stdout}\n${commit.stderr}`.trim());

  let pushResult = null;
  if (push) {
    pushResult = await command('git', ['push', 'origin', 'HEAD']);
    if (!pushResult.ok) throw new Error(`Commit créé, mais push échoué.\n${pushResult.stdout}\n${pushResult.stderr}`);
  }

  return {
    commit: commit.stdout.trim(),
    push: pushResult ? `${pushResult.stdout}\n${pushResult.stderr}`.trim() : null,
    build: build.stdout.trim().split('\n').slice(-12).join('\n'),
  };
}

async function parseBody(req) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_PAYLOAD_BYTES) throw new Error('Requête trop volumineuse.');
    chunks.push(chunk);
  }
  return chunks.length ? JSON.parse(Buffer.concat(chunks).toString('utf8')) : {};
}

function isLoopbackAddress(address) {
  if (!address) return false;
  return (
    address === '127.0.0.1'
    || address === '::1'
    || address === '::ffff:127.0.0.1'
    || address === '::ffff:127.0.0.1/128'
  );
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url || '/', `http://${HOST}:${PORT}`);
    const isLocal = isLoopbackAddress(req.socket?.remoteAddress);
    if (!isLocal) return json(res, 403, { error: 'Interface réservée à localhost.' });
    if (url.pathname === '/') {
      if (req.method !== 'GET') return json(res, 405, { error: 'Méthode non autorisée.' });
      const html = (await fs.readFile(HTML_PATH, 'utf8')).replace('__REVIEW_TOKEN_PLACEHOLDER__', REVIEW_TOKEN);
      return text(res, 200, html, 'text/html; charset=utf-8');
    }
    if (url.pathname === '/api/state') {
      if (req.method !== 'GET') return json(res, 405, { error: 'Méthode non autorisée.' });
      return json(res, 200, await loadState({ forceBuild: url.searchParams.get('force') === '1' }));
    }
    if (url.pathname === '/api/review') {
      if (req.method !== 'POST') return json(res, 405, { error: 'Méthode non autorisée.' });
      enforceRateLimit(req);
      requireReviewToken(req);
      requireJsonRequest(req);
      return json(res, 200, await saveReview(await parseBody(req)));
    }
    if (url.pathname === '/api/remove') {
      if (req.method !== 'POST') return json(res, 405, { error: 'Méthode non autorisée.' });
      enforceRateLimit(req);
      requireReviewToken(req);
      requireJsonRequest(req);
      const body = await parseBody(req);
      return json(res, 200, await removeReview(String(body.claimId || '')));
    }
    if (url.pathname === '/api/security-stats') {
      if (req.method !== 'GET') return json(res, 405, { error: 'Méthode non autorisée.' });
      return json(res, 200, securityStats());
    }
    return json(res, 404, { error: 'Route inconnue.' });
  } catch (error) {
    logSecurityEvent('request-rejected', req, error.message || String(error));
    return json(res, 400, { error: error.message || String(error) });
  }
});

async function runServer() {
  await ensureRepository();
  await ensureClaims();
  server.listen(PORT, HOST, async () => {
    console.log(`\n✓ Interface de review l0g : http://${HOST}:${PORT}/`);
    console.log('  Ouvre cette URL dans ton navigateur.');
    console.log('  Protection: localhost uniquement.');
    console.log('  Commit via API désactivé : commit terminal uniquement avec confirmation explicite.');
    console.log('  Ctrl-C pour fermer.\n');
    const opened = await command('open', [`http://${HOST}:${PORT}/`]);
    if (!opened.ok) console.log('Ouvre cette URL dans ton navigateur.');
  });
}

async function runCommitMode(options) {
  await ensureRepository();
  const result = await commitReviews({
    push: options.push,
    message: options.message,
    confirmation: options.dryRun ? '' : await askTerminalConfirmation(),
    dryRun: options.dryRun,
  });
  if (result.dryRun) {
    console.log(`${C.blue}\nDRY-RUN actif : aucun commit Git n’est effectué.${C.reset}`);
    console.log(`Message envisagé: "${result.commitMessage}"`);
    if (result.push) console.log('Push cibles (simulation): activé');
    if (result.build) console.log(`\nBuild snapshot:\n${result.build}`);
    console.log('\nDiff du fichier de revue :\n');
    console.log(result.diff.trim() || '(aucune modif détectée)');
    console.log('\nCommande prévue :');
    console.log(`git add src/config/claim-reviews.json`);
    console.log(`git commit -m ${shellQuote(result.commitMessage || 'Review evidence claims')}`);
    if (result.push) console.log('git push origin HEAD');
    return;
  }
  console.log(`${C.blue}${result.commit}${C.reset}`);
  if (result.push) console.log(result.push);
  if (result.build) console.log(`\nBuild snapshot:\n${result.build}`);
}

let options;
try {
  options = parseArgs(process.argv);
} catch (error) {
  console.error(`${C.red}Erreur: ${error.message}${C.reset}`);
  printUsage();
  process.exit(1);
}
if (options.help) {
  printUsage();
  process.exit(0);
}
if (options.commit) {
  runCommitMode(options).catch((error) => {
    console.error(`${C.red}Erreur: ${error.message}${C.reset}`);
    process.exit(1);
  });
} else {
  runServer().catch((error) => {
    console.error(`${C.red}Erreur: ${error.message}${C.reset}`);
    process.exit(1);
  });
}
