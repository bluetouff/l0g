import { spawn } from 'node:child_process';
import { availableParallelism } from 'node:os';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { svgTestFiles } from './svg-test-suites.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

export function parseSvgTestArguments(args) {
  if (args.length === 0) return 'all';
  if (args.length !== 2 || args[0] !== '--group') {
    throw new Error('Usage: node scripts/run-svg-tests.mjs [--group source|rendered|all]');
  }
  svgTestFiles(args[1]);
  return args[1];
}

export function svgTestArguments(group, parallelism = availableParallelism()) {
  if (!Number.isSafeInteger(parallelism) || parallelism < 1) {
    throw new Error('Available parallelism must be a positive integer');
  }
  // Do not multiply libvips workers without a bound on larger developer machines.
  const concurrency = Math.max(1, Math.min(3, parallelism - 1));
  return [
    '--experimental-strip-types',
    '--test',
    `--test-concurrency=${concurrency}`,
    ...svgTestFiles(group),
  ];
}

async function main() {
  const group = parseSvgTestArguments(process.argv.slice(2));
  const args = svgTestArguments(group);
  process.stdout.write(`SVG tests: ${group}, ${svgTestFiles(group).length} files, ${args[2]}\n`);
  const child = spawn(process.execPath, args, { cwd: root, stdio: 'inherit' });
  const forwardInterrupt = () => child.kill('SIGINT');
  const forwardTermination = () => child.kill('SIGTERM');
  process.on('SIGINT', forwardInterrupt);
  process.on('SIGTERM', forwardTermination);
  try {
    process.exitCode = await new Promise((resolveExit, reject) => {
      child.once('error', reject);
      child.once('close', (code) => resolveExit(code ?? 1));
    });
  } finally {
    process.off('SIGINT', forwardInterrupt);
    process.off('SIGTERM', forwardTermination);
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  main().catch((error) => {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  });
}
