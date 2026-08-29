import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import test from 'node:test';

const ROOT = fileURLToPath(new URL('../', import.meta.url));

const pages = [
  'dist/posts/taiwan-724-milliards-assureurs-vie-risque-change/index.html',
  'dist/en/analysis/taiwan-life-insurers-724-billion-currency-risk/index.html',
];

for (const page of pages) {
  test(`${page} keeps every infographic inside the SVG namespace`, () => {
    const html = readFileSync(join(ROOT, page), 'utf8');
    const infographics = html.match(
      /<svg\b[^>]*aria-labelledby="tw-(?:fr|en)-[^"]+"[^>]*>[\s\S]*?<\/svg>/gu,
    ) ?? [];

    assert.equal(infographics.length, 5, `${page}: expected five inline SVGs`);
    for (const [index, svg] of infographics.entries()) {
      assert.doesNotMatch(
        svg,
        /<(?:p|div|h[1-6]|ul|ol|li)\b/iu,
        `${page}: HTML element injected into inline SVG ${index + 1}`,
      );
    }
  });
}
