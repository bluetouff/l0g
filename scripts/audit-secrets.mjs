import { execFile } from 'node:child_process';
import { readdir, readFile, stat } from 'node:fs/promises';
import { basename, extname, join, relative } from 'node:path';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';

const execFileAsync = promisify(execFile);
const ROOT = fileURLToPath(new URL('../', import.meta.url));
const MAX_TEXT_BYTES = 5 * 1024 * 1024;
const findings = [];

const rules = [
  ['private-key', /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g],
  ['aws-access-key', /(?<![A-Z0-9])AKIA[0-9A-Z]{16}(?![A-Z0-9])/g],
  ['github-token', /(?<![A-Za-z0-9_])(?:gh[pousr]_[A-Za-z0-9_]{30,}|github_pat_[A-Za-z0-9_]{30,})/g],
  ['openai-key', /(?<![A-Za-z0-9])(?:sk-proj-[A-Za-z0-9_-]{80,}|sk-[A-Za-z0-9]{40,})(?![A-Za-z0-9])/g],
  ['slack-token', /(?<![A-Za-z0-9])xox[baprs]-[A-Za-z0-9-]{10,}/g],
  ['stripe-live-key', /(?<![A-Za-z0-9])(?:sk|rk)_live_[A-Za-z0-9]{20,}/g],
  ['google-api-key', /(?<![A-Za-z0-9_-])AIza[0-9A-Za-z_-]{30,}(?![A-Za-z0-9_-])/g],
];

function lineNumber(source, index) {
  return source.slice(0, index).split('\n').length;
}

async function scanFile(path, displayName) {
  const metadata = await stat(path);
  if (!metadata.isFile() || metadata.size > MAX_TEXT_BYTES) return;
  const buffer = await readFile(path);
  if (buffer.includes(0)) return;
  const source = buffer.toString('utf8');
  for (const [rule, pattern] of rules) {
    pattern.lastIndex = 0;
    for (const match of source.matchAll(pattern)) {
      findings.push(`${displayName}:${lineNumber(source, match.index)} (${rule})`);
    }
  }
}

async function filesUnder(path) {
  const files = [];
  for (const entry of await readdir(path, { withFileTypes: true })) {
    const child = join(path, entry.name);
    if (entry.isDirectory()) files.push(...await filesUnder(child));
    else if (entry.isFile()) files.push(child);
  }
  return files;
}

const { stdout } = await execFileAsync('git', ['ls-files', '-z'], {
  cwd: ROOT,
  encoding: 'utf8',
  maxBuffer: 20 * 1024 * 1024,
});
const trackedFiles = stdout.split('\0').filter(Boolean);
for (const name of trackedFiles) {
  const file = basename(name);
  const extension = extname(file).toLowerCase();
  if ((file === '.env' || (file.startsWith('.env.') && file !== '.env.example'))
      || ['.key', '.pem', '.p12', '.pfx', '.keystore'].includes(extension)
      || /^id_(?:rsa|ed25519)$/.test(file)) {
    findings.push(`${name} (sensitive-filename)`);
  }
  await scanFile(join(ROOT, name), name);
}

const distRoot = join(ROOT, 'dist');
try {
  for (const path of await filesUnder(distRoot)) {
    await scanFile(path, relative(ROOT, path));
  }
} catch (error) {
  if (error?.code !== 'ENOENT') throw error;
}

if (findings.length) {
  throw new Error(`Secrets potentiels détectés sans afficher leur valeur :\n${findings.join('\n')}`);
}

process.stdout.write(`Secret scan OK: ${trackedFiles.length} fichiers suivis, artefact dist ${await stat(distRoot).then(() => 'inclus').catch(() => 'absent')}.\n`);
