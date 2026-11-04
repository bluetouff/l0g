import { spawn } from 'node:child_process';
import { availableParallelism } from 'node:os';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { svgTestFiles } from './svg-test-suites.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const SVG_SOURCE_SHARDS = Object.freeze(['1/4', '2/4', '3/4', '4/4']);

function validateShard(group, shard) {
  if (shard !== undefined && (group !== 'source' || !SVG_SOURCE_SHARDS.includes(shard))) {
    throw new Error('SVG sharding requires --group source and --shard 1/4, 2/4, 3/4 or 4/4');
  }
}

export function parseSvgTestArguments(args) {
  if (args.length === 0) return { group: 'all', shard: undefined };
  if (![2, 4].includes(args.length) || args[0] !== '--group'
    || (args.length === 4 && args[2] !== '--shard')) {
    throw new Error('Usage: node scripts/run-svg-tests.mjs [--group source|rendered|all [--shard 1/4|2/4|3/4|4/4]]');
  }
  const group = args[1];
  const shard = args[3];
  svgTestFiles(group);
  validateShard(group, shard);
  return { group, shard };
}

export function svgTestArguments(group, parallelism = availableParallelism(), shard) {
  if (!Number.isSafeInteger(parallelism) || parallelism < 1) {
    throw new Error('Available parallelism must be a positive integer');
  }
  validateShard(group, shard);
  // Do not multiply libvips workers without a bound on larger developer machines.
  const concurrency = Math.max(1, Math.min(3, parallelism - 1));
  return [
    '--experimental-strip-types',
    '--test',
    `--test-concurrency=${concurrency}`,
    ...(shard === undefined ? [] : [`--test-shard=${shard}`]),
    ...svgTestFiles(group),
  ];
}

async function main() {
  const { group, shard } = parseSvgTestArguments(process.argv.slice(2));
  const args = svgTestArguments(group, availableParallelism(), shard);
  process.stdout.write(`SVG tests: ${group}, ${svgTestFiles(group).length} files${shard ? `, shard ${shard}` : ''}, ${args[2]}\n`);
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
