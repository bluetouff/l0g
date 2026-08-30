import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import test from 'node:test';

const ROOT = fileURLToPath(new URL('../', import.meta.url));

const targets = [
  {
    page: 'dist/posts/taiwan-724-milliards-assureurs-vie-risque-change/index.html',
    count: 5,
    pattern: /<svg\b[^>]*aria-labelledby="tw-(?:fr|en)-[^"]+"[^>]*>[\s\S]*?<\/svg>/gu,
  },
  {
    page: 'dist/en/analysis/taiwan-life-insurers-724-billion-currency-risk/index.html',
    count: 5,
    pattern: /<svg\b[^>]*aria-labelledby="tw-(?:fr|en)-[^"]+"[^>]*>[\s\S]*?<\/svg>/gu,
  },
  {
    page: 'dist/posts/jeonse-coree-du-sud-credit-cache-logement/index.html',
    count: 6,
    pattern: /<svg\b[^>]*aria-labelledby="jeonse-[^"]+"[^>]*>[\s\S]*?<\/svg>/gu,
  },
  {
    page: 'dist/en/analysis/south-korea-jeonse-hidden-housing-credit/index.html',
    count: 6,
    pattern: /<svg\b[^>]*aria-labelledby="jeonse-[^"]+"[^>]*>[\s\S]*?<\/svg>/gu,
  },
];

for (const { page, count, pattern } of targets) {
  test(`${page} keeps every infographic inside the SVG namespace`, () => {
    const html = readFileSync(join(ROOT, page), 'utf8');
    const infographics = html.match(pattern) ?? [];

    assert.equal(infographics.length, count, `${page}: expected ${count} inline SVGs`);
    for (const [index, svg] of infographics.entries()) {
      assert.doesNotMatch(
        svg,
        /<(?:p|div|h[1-6]|ul|ol|li)\b/iu,
        `${page}: HTML element injected into inline SVG ${index + 1}`,
      );
    }
  });
}
