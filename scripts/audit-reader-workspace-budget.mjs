import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { build, transform } from 'esbuild';

// Separate limits for the additional reader functions. The existing reading
// tools keep their unchanged 9 KB limit. Search content and Pagefind are lazy.
for (const [name, limit] of [['reader-workspace', 5500], ['publication-library', 2500], ['quick-search', 3250], ['quick-search-launcher', 800]]) {
  const result = await build({entryPoints:[`src/scripts/${name}.ts`],bundle:true,minify:true,write:false,format:'esm',target:'es2022',external:['*?url&no-inline','./quick-search.ts']});
  let size = gzipSync(result.outputFiles[0].contents).length;
  if (name !== 'quick-search-launcher') {
    const style = await transform(await readFile(`src/styles/${name}.css`, 'utf8'), {loader:'css',minify:true});
    size += gzipSync(style.code).length;
  }
  assert.ok(size <= limit, `${name}: ${size} bytes gzip exceeds ${limit}`);
  console.log(`${name}: ${size} bytes gzip of JS + CSS, budget ${limit}.`);
}
