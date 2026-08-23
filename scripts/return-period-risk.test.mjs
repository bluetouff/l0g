import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { mkdtemp, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const outputDirectory = await mkdtemp(join(tmpdir(), 'return-period-risk-'));
const outputFile = join(outputDirectory, 'model.mjs');

await build({ entryPoints: ['src/lib/return-period-risk.ts'], outfile: outputFile, bundle: true, format: 'esm', platform: 'node' });
const model = await import(pathToFileURL(outputFile).href);

const case250 = model.calculateReturnPeriodRisk({ returnPeriodYears: 250, exposureYears: 20 });
assert.equal(Number(case250.annualProbabilityPct.toFixed(1)), 0.4);
assert.equal(Number(case250.cumulativeProbabilityPct.toFixed(1)), 7.7);

const case500 = model.calculateReturnPeriodRisk({ returnPeriodYears: 500, exposureYears: 20 });
assert.equal(Number(case500.annualProbabilityPct.toFixed(1)), 0.2);
assert.equal(Number(case500.cumulativeProbabilityPct.toFixed(1)), 3.9);

assert.deepEqual(model.normalizeReturnPeriodRiskInputs({ returnPeriodYears: 1, exposureYears: 999 }), { returnPeriodYears: 2, exposureYears: 100 });

const source = await readFile('src/lib/return-period-risk.ts', 'utf8');
assert.match(source, /1 - \(1 - annualProbability\) \*\* inputs\.exposureYears/);

console.log('return-period-risk: ok');
