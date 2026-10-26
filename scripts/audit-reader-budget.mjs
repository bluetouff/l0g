import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { build, transform } from 'esbuild';

// Conservative standalone bundles: count shared storage helpers in full, even
// when Vite shares them with the existing reading-position module at build time.
let total = 0;
for (const name of ['article-tools', 'reading-library', 'article-print']) {
  const result = await build({ entryPoints: [`src/scripts/${name}.ts`], bundle: true, minify: true, write: false, format: 'esm', target: 'es2022' });
  const style = await transform(await readFile(`src/styles/${name}.css`, 'utf8'), { loader: 'css', minify: true });
  total += gzipSync(result.outputFiles[0].contents).length + gzipSync(style.code).length;
}
assert.ok(total <= 8000, `Reading tools exceed the 8,000-byte gzip budget: ${total}`);
console.log(`Reading tools: ${total} bytes gzip of JS + CSS, budget 8000 (no generated media).`);
