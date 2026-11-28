import { spawn } from 'node:child_process';
import { availableParallelism } from 'node:os';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const preflightScripts = [
  'test:dependencies',
  'test:ci-policy',
  'test:editorial-protocol',
  'test:deploy',
];

export const verificationScripts = [
  ['test:internal-links', '--', '--check-visibility'],
  ['test:performance'],
  ['test:security'],
  ['test:editorial-headings'],
  ['test:agent-surface'],
  ['test:mcp-toolset'],
  ['test:typography'],
];

export const publicationSuites = [
  'scripts/debt-publication.test.mjs',
  'scripts/cyber-recovery-publication.test.mjs',
  'scripts/insurance-promise-publication.test.mjs',
  'scripts/cumcum-publication.test.mjs',
  'scripts/ordinary-machines-publication.test.mjs',
  'scripts/encryption-backdoor-publication.test.mjs',
  'scripts/nvidia-publication.test.mjs',
  'scripts/ai-creditors-publication.test.mjs',
  'scripts/shadow-fleet-publication.test.mjs',
  'scripts/trump-war-chest-publication.test.mjs',
];

function npmCheck([name, ...args]) {
  const commandArgs = ['run', name, ...args];
  const npm = process.env.npm_execpath;
  return npm
    ? { name, command: process.execPath, args: [npm, ...commandArgs] }
    : { name, command: 'npm', args: commandArgs };
}

function nodeCheck(name, args) {
  return { name, command: process.execPath, args };
}

function runCheck({ name, command, args }) {
  const started = performance.now();
  console.log(`[build-checks] Start ${name}`);
  return new Promise((resolveCheck, rejectCheck) => {
    const child = spawn(command, args, { stdio: 'inherit' });
    child.once('error', rejectCheck);
    child.once('close', (code, signal) => {
      const duration = ((performance.now() - started) / 1000).toFixed(1);
      console.log(`[build-checks] ${name} ${code === 0 ? 'passed' : 'failed'} in ${duration}s`);
      if (code === 0) resolveCheck();
      else rejectCheck(new Error(`${name} exited with ${signal ?? code}`));
    });
  });
}

async function runChecks(group) {
  const cpus = availableParallelism();
  const workers = Math.max(1, Math.min(3, cpus - 1));
  const testWorkers = cpus > workers ? 2 : 1;
  const checks = group === 'preflight'
    ? preflightScripts.map(name => npmCheck([name]))
    : [
      nodeCheck('publication suites', ['--test', `--test-concurrency=${testWorkers}`, ...publicationSuites]),
      ...verificationScripts.map(npmCheck),
      nodeCheck('article OG', ['scripts/audit-article-social.mjs']),
      nodeCheck('guide OG', ['scripts/audit-guide-social.mjs']),
      nodeCheck('English social metadata', ['scripts/audit-english-social.mjs']),
    ];

  // The preflight tests have isolated fixtures. Verification starts after
  // Pagefind's only generated-output write and reads the completed build.
  console.log(`[build-checks] ${group} with ${workers} workers (${cpus} CPUs)`);
  const failures = [];
  let cursor = 0;
  async function work() {
    while (cursor < checks.length) {
      const check = checks[cursor++];
      try {
        await runCheck(check);
      } catch (error) {
        failures.push(error);
      }
    }
  }
  await Promise.all(Array.from({ length: workers }, work));
  if (failures.length) throw new AggregateError(failures, `${group} checks failed`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  const [, , group, ...extra] = process.argv;
  if (!['preflight', 'verify'].includes(group) || extra.length) {
    throw new Error('Usage: node scripts/run-build-checks.mjs preflight|verify');
  }
  await runChecks(group);
}
