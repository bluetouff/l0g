import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import test from 'node:test';

import './asia-dollar-hedge-model.test.mjs';

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
  {
    page: 'dist/posts/renminbi-zone-monetaire-asie/index.html',
    count: 2,
    pattern: /<svg\b[^>]*aria-label="[^"]+"[^>]*>[\s\S]*?<\/svg>/gu,
  },
  {
    page: 'dist/en/analysis/renminbi-monetary-zone-asia/index.html',
    count: 2,
    pattern: /<svg\b[^>]*aria-label="[^"]+"[^>]*>[\s\S]*?<\/svg>/gu,
  },
  {
    page: 'dist/posts/coree-du-sud-prix-couverture-parfaite/index.html',
    count: 5,
    pattern: /<svg\b[^>]*aria-labelledby="krfx-fr-[^"]+"[^>]*>[\s\S]*?<\/svg>/gu,
    checkInternalBounds: true,
  },
  {
    page: 'dist/en/analysis/south-korea-price-perfect-fx-hedge/index.html',
    count: 5,
    pattern: /<svg\b[^>]*aria-labelledby="krfx-en-[^"]+"[^>]*>[\s\S]*?<\/svg>/gu,
    checkInternalBounds: true,
  },
  {
    page: 'dist/posts/asie-usine-invisible-couverture-dollar/index.html',
    count: 6,
    pattern: /<svg\b[^>]*aria-labelledby="afx-fr-[^"]+"[^>]*>[\s\S]*?<\/svg>/gu,
    checkInternalBounds: true,
  },
  {
    page: 'dist/en/analysis/asia-invisible-dollar-hedging-machine/index.html',
    count: 6,
    pattern: /<svg\b[^>]*aria-labelledby="afx-en-[^"]+"[^>]*>[\s\S]*?<\/svg>/gu,
    checkInternalBounds: true,
  },
];

function numberAttribute(tag, name, fallback = 0) {
  const value = tag.match(new RegExp(`\\b${name}="([^"]+)"`, 'u'))?.[1];
  return value === undefined ? fallback : Number.parseFloat(value);
}

function stringAttribute(tag, name, fallback = '') {
  return tag.match(new RegExp(`\\b${name}="([^"]+)"`, 'u'))?.[1] ?? fallback;
}

function decodeEntities(value) {
  return value
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replace(/&#(\d+);/gu, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([\da-f]+);/giu, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)));
}

function visibleText(value) {
  return decodeEntities(value.replace(/<[^>]+>/gu, '').trim());
}

function assertApproximateInternalBounds(svg, page, svgIndex) {
  const rects = [...svg.matchAll(/<rect\b[^>]*>/gu)].map((match) => {
    const tag = match[0];
    const x = numberAttribute(tag, 'x');
    const y = numberAttribute(tag, 'y');
    const width = numberAttribute(tag, 'width');
    const height = numberAttribute(tag, 'height');
    return { x, y, width, height, right: x + width, bottom: y + height };
  }).filter(({ width, height }) => width > 0 && height > 0);

  for (const match of svg.matchAll(/(<text\b[^>]*>)([\s\S]*?)<\/text>/gu)) {
    const [, tag, body] = match;
    const fontSize = numberAttribute(tag, 'font-size', 16);
    const anchor = stringAttribute(tag, 'text-anchor', 'start');
    const baseX = numberAttribute(tag, 'x');
    const baseY = numberAttribute(tag, 'y');
    let currentY = baseY;
    const tspans = [...body.matchAll(/(<tspan\b[^>]*>)([\s\S]*?)<\/tspan>/gu)];
    const lines = tspans.length > 0
      ? tspans.map((line) => {
          const lineTag = line[1];
          currentY += numberAttribute(lineTag, 'dy');
          return { x: numberAttribute(lineTag, 'x', baseX), y: currentY, text: visibleText(line[2]) };
        })
      : [{ x: baseX, y: baseY, text: visibleText(body) }];

    for (const line of lines) {
      if (!line.text) continue;
      const panel = rects
        .filter((rect) => line.x >= rect.x && line.x <= rect.right && line.y >= rect.y && line.y <= rect.bottom)
        .sort((a, b) => (a.width * a.height) - (b.width * b.height))[0];
      if (!panel) continue;

      const width = [...line.text].length * fontSize * 0.62;
      const left = anchor === 'middle' ? line.x - width / 2 : anchor === 'end' ? line.x - width : line.x;
      const right = anchor === 'middle' ? line.x + width / 2 : anchor === 'end' ? line.x : line.x + width;
      const margin = panel.x === 0 && panel.y === 0 ? 0 : 4;

      assert.ok(
        left >= panel.x + margin && right <= panel.right - margin,
        `${page}: inline SVG ${svgIndex + 1} text "${line.text}" can cross its ${panel.width}-unit panel (${left.toFixed(1)}..${right.toFixed(1)} vs ${panel.x + margin}..${panel.right - margin})`,
      );
    }
  }
}

for (const { page, count, pattern, jeonseLocale, checkInternalBounds } of targets) {
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
      if (checkInternalBounds) assertApproximateInternalBounds(svg, page, index);
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
