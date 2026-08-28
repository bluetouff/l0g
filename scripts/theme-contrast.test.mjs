import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const css = read('src/styles/global.css');

function channel(value) {
  const normalized = value / 255;
  return normalized <= 0.04045
    ? normalized / 12.92
    : ((normalized + 0.055) / 1.055) ** 2.4;
}

function luminance(hex) {
  const channels = hex.slice(1).match(/../gu).map((part) => channel(Number.parseInt(part, 16)));
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrast(left, right) {
  const a = luminance(left);
  const b = luminance(right);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

function lightToken(name) {
  const block = css.match(/:root\[data-theme="light"\]\s*\{(?<body>[\s\S]*?)\n\}/u)?.groups?.body;
  assert.ok(block, 'light theme token block must exist');
  const value = block.match(new RegExp(`--${name}:\\s*(#[0-9a-f]{6})`, 'u'))?.[1];
  assert.ok(value, `light theme must define --${name}`);
  return value;
}

test('small light-theme accent text keeps strong contrast on every shared surface', () => {
  const foregrounds = [
    'color-signal',
    'color-accent',
    'color-amber',
    'color-topic-blue',
    'color-elevated',
  ].map(lightToken);
  const backgrounds = ['#ffffff', '#e7e9ee', '#eef0f4'];

  for (const foreground of foregrounds) {
    for (const background of backgrounds) {
      assert.ok(
        contrast(foreground, background) >= 5.5,
        `${foreground} must reach 5.5:1 on ${background}`,
      );
    }
  }
});

test('editorial and dashboard accents follow theme-aware CSS tokens', () => {
  const files = [
    'src/config/topics.ts',
    'src/config/primary-sources.ts',
    'src/config/glossary.ts',
    'src/config/glossary-atlas-en.ts',
    'src/components/RiskBand.astro',
    'src/scripts/risk.js',
    'src/components/PublicationSpotlight.astro',
    'src/components/PaCheckCard.astro',
  ];
  const rawDarkAccents = /#(?:5eead4|7aa2f7|ff4d87|f5b13d|ff8a3d)/iu;

  for (const file of files) {
    assert.doesNotMatch(read(file), rawDarkAccents, `${file} must not freeze a dark-theme accent`);
  }
});

test('Shiki emits both palettes and the stylesheet selects the active one', () => {
  const config = read('astro.config.mjs');
  assert.match(config, /light:\s*'github-light'/u);
  assert.match(config, /dark:\s*'github-dark'/u);
  assert.match(config, /defaultColor:\s*false/u);
  assert.match(css, /var\(--shiki-dark-bg\)/u);
  assert.match(css, /var\(--shiki-light-bg\)/u);
  assert.match(css, /var\(--shiki-light\)/u);
});
