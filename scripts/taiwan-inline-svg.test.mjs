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
    jeonseLocale: 'fr',
  },
  {
    page: 'dist/en/analysis/south-korea-jeonse-hidden-housing-credit/index.html',
    count: 6,
    pattern: /<svg\b[^>]*aria-labelledby="jeonse-[^"]+"[^>]*>[\s\S]*?<\/svg>/gu,
    jeonseLocale: 'en',
  },
];

for (const { page, count, pattern, jeonseLocale } of targets) {
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

    if (jeonseLocale) {
      const balanceSheet = infographics[0];
      for (const panel of ['bank', 'tenant', 'landlord']) {
        assert.match(
          balanceSheet,
          new RegExp(`data-jeonse-panel="${panel}-${jeonseLocale}"`, 'u'),
          `${page}: missing the measured ${panel} panel`,
        );
        assert.match(
          balanceSheet,
          new RegExp(`data-jeonse-copy="${panel}-${jeonseLocale}"`, 'u'),
          `${page}: missing the bounded ${panel} copy`,
        );
      }

      for (const panel of ['tenant', 'landlord']) {
        const copy = balanceSheet.match(
          new RegExp(`<text\\b[^>]*data-jeonse-copy="${panel}-${jeonseLocale}"[^>]*>([\\s\\S]*?)<\\/text>`, 'u'),
        )?.[1] ?? '';
        const lines = [...copy.matchAll(/<tspan\b[^>]*>([^<]+)<\/tspan>/gu)]
          .map((match) => match[1].trim());

        assert.ok(lines.length >= 5, `${page}: ${panel} copy must be explicitly wrapped`);
        assert.ok(
          lines.every((line) => line.length <= 26),
          `${page}: ${panel} contains a line that can overflow its panel`,
        );
      }

      assert.match(
        balanceSheet,
        new RegExp(`data-jeonse-flow-label="return-${jeonseLocale}">(?:retour|return)<\\/text>`, 'u'),
        `${page}: return-flow label must fit the 66-unit corridor`,
      );
    }
  });
}
