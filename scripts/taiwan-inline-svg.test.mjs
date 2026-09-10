import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import test from 'node:test';
import { fromHtml } from 'hast-util-from-html';
import { toText } from 'hast-util-to-text';

import './asia-dollar-hedge-model.test.mjs';
import './asia-dollar-stress.test.mjs';
import './asia-dollar-purchases.test.mjs';
import './aircraft-engine-tool.test.mjs';
import './cocoa-financing-tool.test.mjs';
import './openai-rating-infographics.test.mjs';
import './tfff-infographics.test.mjs';
import './bessent-yen-infographics.test.mjs';
import './business-aid-infographics.test.mjs';
import './ghana-gold-infographics.test.mjs';

const ROOT = fileURLToPath(new URL('../', import.meta.url));

const targets = [
  ...[
    'dist/posts/ghana-or-cedi-goldbod-cout-devises/index.html',
    'dist/en/analysis/ghana-goldbod-gold-dollar-trade-public-cost/index.html',
  ].map((page) => ({
    page,
    count: 3,
    pattern: /<svg\b[^>]*aria-labelledby="ghgold26-(?:fr|en)-[^"]+"[^>]*>[\s\S]*?<\/svg>/gu,
    checkInternalBounds: true,
    requireDarkBackground: true,
    darkBackgroundToken: 'background:#0b0d10',
  })),
  ...[
    'dist/posts/aides-entreprises-211-milliards-chiffre-trompeur/index.html',
    'dist/en/analysis/france-211-billion-business-aid-misleading-figure/index.html',
  ].map((page) => ({
    page,
    count: 3,
    pattern: /<svg\b[^>]*aria-labelledby="aid26-(?:fr|en)-[^"]+"[^>]*>[\s\S]*?<\/svg>/gu,
    checkInternalBounds: true,
    requireDarkBackground: true,
    darkBackgroundToken: 'background:#0b0d10',
  })),
  ...[
    'dist/posts/bessent-yen-dette-americaine-fima-rachats/index.html',
    'dist/en/analysis/bessent-yen-us-debt-fima-buybacks/index.html',
  ].map((page) => ({
    page,
    count: 3,
    pattern: /<svg\b[^>]*aria-labelledby="bsy26-(?:fr|en)-[^"]+"[^>]*>[\s\S]*?<\/svg>/gu,
    checkInternalBounds: true,
    requireDarkBackground: true,
    darkBackgroundToken: 'background:#0b0d10',
  })),
  ...[
    'dist/posts/tfff-forets-bresil-fonds-obligations-risques/index.html',
    'dist/en/analysis/tfff-brazil-forest-fund-bond-market-risk/index.html',
  ].map((page) => ({
    page,
    count: 3,
    pattern: /<svg\b[^>]*aria-labelledby="tfff26-(?:fr|en)-[^"]+"[^>]*>[\s\S]*?<\/svg>/gu,
    checkInternalBounds: true,
    requireDarkBackground: true,
    darkBackgroundToken: 'background:#0b0d10',
  })),
  ...[
    'dist/posts/openai-note-credit-garantie-nvidia-ipo/index.html',
    'dist/en/analysis/openai-credit-rating-nvidia-guarantee-ipo/index.html',
  ].map((page) => ({
    page,
    count: 3,
    pattern: /<svg\b[^>]*aria-labelledby="ai26-(?:fr|en)-[^"]+"[^>]*>[\s\S]*?<\/svg>/gu,
    checkInternalBounds: true,
    requireDarkBackground: true,
    darkBackgroundToken: 'background:#0b0d10',
  })),
  ...[
    'dist/posts/senegal-arrieres-etat-entreprises-creancieres/index.html',
    'dist/en/analysis/senegal-government-arrears-suppliers-cash-flow/index.html',
  ].map((page) => ({
    page,
    count: 3,
    pattern: /<svg\b[^>]*aria-labelledby="sn26-(?:fr|en)-[^"]+"[^>]*>[\s\S]*?<\/svg>/gu,
    checkInternalBounds: true,
    requireDarkBackground: true,
    darkBackgroundToken: 'background:#0b0d10',
  })),
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
  {
    page: 'dist/posts/asie-actifs-americains-treasuries-mbs-credit/index.html',
    count: 6,
    pattern: /<svg\b[^>]*aria-labelledby="asia-us-fr-[^"]+"[^>]*>[\s\S]*?<\/svg>/gu,
    checkInternalBounds: true,
  },
  {
    page: 'dist/en/analysis/what-asia-really-buys-in-america/index.html',
    count: 6,
    pattern: /<svg\b[^>]*aria-labelledby="asia-us-en-[^"]+"[^>]*>[\s\S]*?<\/svg>/gu,
    checkInternalBounds: true,
  },
  {
    page: 'dist/posts/chine-risque-dollar-bilan-reserves-banques/index.html',
    count: 6,
    pattern: /<svg\b[^>]*aria-labelledby="cn-fr-[^"]+"[^>]*>[\s\S]*?<\/svg>/gu,
    checkInternalBounds: true,
  },
  {
    page: 'dist/en/analysis/china-dollar-risk-reserves-banks-balance-sheets/index.html',
    count: 6,
    pattern: /<svg\b[^>]*aria-labelledby="cn-en-[^"]+"[^>]*>[\s\S]*?<\/svg>/gu,
    checkInternalBounds: true,
  },
  {
    page: 'dist/posts/asie-dollar-stress-test-trois-risques/index.html',
    count: 3,
    pattern: /<svg\b[^>]*aria-labelledby="ats8-[^"]+"[^>]*>[\s\S]*?<\/svg>/gu,
    checkInternalBounds: true,
  },
  {
    page: 'dist/en/analysis/asia-dollar-stress-test-three-risks/index.html',
    count: 3,
    pattern: /<svg\b[^>]*aria-labelledby="ats8-[^"]+"[^>]*>[\s\S]*?<\/svg>/gu,
    checkInternalBounds: true,
  },
  {
    page: 'dist/posts/asie-dollar-cesser-acheter/index.html',
    count: 3,
    pattern: /<svg\b[^>]*aria-labelledby="ad9-[^"]+"[^>]*>[\s\S]*?<\/svg>/gu,
    checkInternalBounds: true,
  },
  {
    page: 'dist/en/analysis/asia-dollar-stop-buying/index.html',
    count: 3,
    pattern: /<svg\b[^>]*aria-labelledby="ad9-[^"]+"[^>]*>[\s\S]*?<\/svg>/gu,
    checkInternalBounds: true,
  },
  {
    page: 'dist/posts/moteurs-avion-penurie-maintenance-location/index.html',
    count: 3,
    pattern: /<svg\b[^>]*aria-labelledby="engine-[^"]+-fr-title engine-[^"]+-fr-desc"[^>]*>[\s\S]*?<\/svg>/gu,
    checkInternalBounds: true,
  },
  {
    page: 'dist/en/analysis/aircraft-engine-shortage-maintenance-leasing/index.html',
    count: 3,
    pattern: /<svg\b[^>]*aria-labelledby="engine-[^"]+-en-title engine-[^"]+-en-desc"[^>]*>[\s\S]*?<\/svg>/gu,
    checkInternalBounds: true,
  },
  {
    page: 'dist/posts/cacao-ghana-financement-tresorerie/index.html',
    count: 3,
    pattern: /<svg\b[^>]*aria-labelledby="cocoa-[^"]+-fr-title cocoa-[^"]+-fr-desc"[^>]*>[\s\S]*?<\/svg>/gu,
    checkInternalBounds: true,
  },
  {
    page: 'dist/posts/trump-sanctions-russie-iran-concessions/index.html',
    count: 4,
    pattern: /<svg\b[^>]*aria-labelledby="sanctions-fr-[^"]+-title sanctions-fr-[^"]+-desc"[^>]*>[\s\S]*?<\/svg>/gu,
    checkInternalBounds: true,
  },
  {
    page: 'dist/en/analysis/trump-sanctions-russia-iran-concessions/index.html',
    count: 4,
    pattern: /<svg\b[^>]*aria-labelledby="sanctions-en-[^"]+-title sanctions-en-[^"]+-desc"[^>]*>[\s\S]*?<\/svg>/gu,
    checkInternalBounds: true,
  },
  {
    page: 'dist/posts/les-banquiers-du-baril-4-trafigura-platts-prix-fioul/index.html',
    count: 3,
    pattern: /<svg\b[^>]*aria-labelledby="bb4-fr-[^"]+-title bb4-fr-[^"]+-desc"[^>]*>[\s\S]*?<\/svg>/gu,
    checkInternalBounds: true,
  },
  {
    page: 'dist/en/analysis/banking-on-oil-4-trafigura-platts-fuel-oil-benchmark/index.html',
    count: 3,
    pattern: /<svg\b[^>]*aria-labelledby="bb4-en-[^"]+-title bb4-en-[^"]+-desc"[^>]*>[\s\S]*?<\/svg>/gu,
    checkInternalBounds: true,
  },
  {
    page: 'dist/posts/les-banquiers-du-baril-5-vitol-raffineries-terminaux-engen/index.html',
    count: 3,
    pattern: /<svg\b[^>]*aria-labelledby="bdb5-fr-fig[0-9]+-title bdb5-fr-fig[0-9]+-desc"[^>]*>[\s\S]*?<\/svg>/gu,
    checkInternalBounds: true,
    requireDarkBackground: true,
  },
  {
    page: 'dist/en/analysis/banking-on-oil-5-vitol-refineries-terminals-engen/index.html',
    count: 3,
    pattern: /<svg\b[^>]*aria-labelledby="bdb5-en-fig[0-9]+-title bdb5-en-fig[0-9]+-desc"[^>]*>[\s\S]*?<\/svg>/gu,
    checkInternalBounds: true,
    requireDarkBackground: true,
  },
  {
    page: 'dist/posts/les-banquiers-du-baril-6-trafigura-nickel-fantome/index.html',
    count: 3,
    pattern: /<svg\b[^>]*aria-labelledby="bdb6-fr-fig[0-9]+-title bdb6-fr-fig[0-9]+-desc"[^>]*>[\s\S]*?<\/svg>/gu,
    checkInternalBounds: true,
    requireDarkBackground: true,
    darkBackgroundToken: '--color-surface:#0b0d10',
  },
  {
    page: 'dist/en/analysis/banking-on-oil-6-trafigura-nickel-fraud/index.html',
    count: 3,
    pattern: /<svg\b[^>]*aria-labelledby="bdb6-en-fig[0-9]+-title bdb6-en-fig[0-9]+-desc"[^>]*>[\s\S]*?<\/svg>/gu,
    checkInternalBounds: true,
    requireDarkBackground: true,
    darkBackgroundToken: '--color-surface:#0b0d10',
  },
  {
    page: 'dist/posts/les-banquiers-du-baril-7-trafigura-petrobras-corruption/index.html',
    count: 3,
    pattern: /<svg\b[^>]*aria-labelledby="bdb7-fr-fig[0-9]+-title bdb7-fr-fig[0-9]+-desc"[^>]*>[\s\S]*?<\/svg>/gu,
    checkInternalBounds: true,
    requireDarkBackground: true,
    darkBackgroundToken: '--color-surface:#0b0d10',
  },
  {
    page: 'dist/en/analysis/banking-on-oil-7-trafigura-petrobras-bribery/index.html',
    count: 3,
    pattern: /<svg\b[^>]*aria-labelledby="bdb7-en-fig[0-9]+-title bdb7-en-fig[0-9]+-desc"[^>]*>[\s\S]*?<\/svg>/gu,
    checkInternalBounds: true,
    requireDarkBackground: true,
    darkBackgroundToken: '--color-surface:#0b0d10',
  },
  {
    page: 'dist/posts/les-banquiers-du-baril-8-credit-livraisons-petrole/index.html',
    count: 3,
    pattern: /<svg\b[^>]*aria-labelledby="bdb8-fr-fig[0-9]+-title bdb8-fr-fig[0-9]+-desc"[^>]*>[\s\S]*?<\/svg>/gu,
    checkInternalBounds: true,
    requireDarkBackground: true,
    darkBackgroundToken: '--color-surface:#0b0d10',
  },
  {
    page: 'dist/en/analysis/banking-on-oil-8-credit-squeeze-oil-supplies/index.html',
    count: 3,
    pattern: /<svg\b[^>]*aria-labelledby="bdb8-en-fig[0-9]+-title bdb8-en-fig[0-9]+-desc"[^>]*>[\s\S]*?<\/svg>/gu,
    checkInternalBounds: true,
    requireDarkBackground: true,
    darkBackgroundToken: '--color-surface:#0b0d10',
  },
  {
    page: 'dist/en/analysis/ghana-cocoa-financing-cash-crisis/index.html',
    count: 3,
    pattern: /<svg\b[^>]*aria-labelledby="cocoa-[^"]+-en-title cocoa-[^"]+-en-desc"[^>]*>[\s\S]*?<\/svg>/gu,
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

test('Senegal infographics preserve their zero baselines, units and calculated bar widths', () => {
  const expectedWidths = [
    [372, 372 * 0.495, 372, 372 * 2406 / 5425],
    [372, 372 * (100 * 0.12 * 90 / 360) / 12, 372, 372 * (100 * 0.12 * 180 / 360) / 12, 372, 372],
    [372, 372 * 6.7 / 8, 372, 372 * 2.2 / 8],
  ];
  for (const target of targets.filter(({ page }) => page.includes('senegal-'))) {
    const html = readFileSync(join(ROOT, target.page), 'utf8');
    assert.match(html, /\.prose \.sn26-figure>svg\{[^}]*max-width:560px/u, 'The compact figure rule must override the global prose SVG rule');
    const svgs = html.match(target.pattern) ?? [];
    assert.equal(svgs.length, 3);
    for (const [index, svg] of svgs.entries()) {
      const rectangles = [...svg.matchAll(/<rect\b[^>]*>/gu)].map(([tag]) => tag);
      assert.equal(rectangles.length, expectedWidths[index].length);
      for (const [bar, tag] of rectangles.entries()) {
        assert.equal(numberAttribute(tag, 'x'), 24, 'All bars must share the zero baseline');
        assert.ok(Math.abs(numberAttribute(tag, 'width') - expectedWidths[index][bar]) < 0.001);
        assert.ok(numberAttribute(tag, 'x') + numberAttribute(tag, 'width') <= 396);
      }
      assert.match(svg, /width:100%;height:auto/u);
      assert.doesNotMatch(svg, /var\(--color-/u, 'Chart colors must stay dark-theme-safe');
    }
  }
});

function visibleText(value) {
  return toText(fromHtml(value.trim(), { fragment: true }));
}

test('visibleText parses markup and character references exactly once', () => {
  assert.equal(visibleText(' Revenue &amp; costs '), 'Revenue & costs');
  assert.equal(visibleText('&#65;&#x42;'), 'AB');
  assert.equal(visibleText('&#160;A&#xA0;'), '\u00a0A\u00a0');
  assert.equal(visibleText('&amp;lt;script&amp;gt;'), '&lt;script&gt;');
  assert.equal(visibleText('&amp;#60;script&amp;#x3e;'), '&#60;script&#x3e;');
  assert.equal(
    visibleText('<tspan data-note="1 > 0">safe &amp; sound</tspan>'),
    'safe & sound',
  );
});

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

for (const { page, count, pattern, jeonseLocale, checkInternalBounds, requireDarkBackground, darkBackgroundToken = '--b5-bg:#0b0d10' } of targets) {
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
      if (requireDarkBackground) {
        assert.ok(svg.includes(darkBackgroundToken), `${page}: inline SVG ${index + 1} must keep the l0g dark background`);
        assert.doesNotMatch(
          svg,
          /prefers-color-scheme|--b5-bg:#(?:fff|ffffff)/iu,
          `${page}: inline SVG ${index + 1} must not switch to a white background`,
        );
      }
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
