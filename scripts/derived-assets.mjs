#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import sharp from 'sharp';
import { publicationSocialCards } from '../src/config/publication-social.mjs';
import { englishPageSocialCards } from '../src/config/english-page-social.mjs';
import { cyberRecoveryEditions } from '../src/config/cyber-recovery-publication.mjs';
import { insurancePromiseEditions } from '../src/config/insurance-promise-publication.mjs';
import { cumcumEditions } from '../src/config/cumcum-publication.mjs';
import { runDerivedTask } from './derived-assets-cache.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const publicPath = (name) => `public${name}`;
const covers = ['eau-electricite', 'water-electricity', 'euro-numerique', 'digital-euro'];
const coverOutputs = covers.flatMap((name) => [
  ...[320, 640, 960].map((width) => `public/publications/${name}-cover-${width}.webp`),
  `public/publications/${name}-cover.jpg`, `public/publications/${name}-cover-social.jpg`,
]);
const artworkOutputs = [
  ...Object.values(cyberRecoveryEditions), ...Object.values(insurancePromiseEditions), ...Object.values(cumcumEditions),
].map((book) => `src/epub-assets/${book.directory}-cover.png`);
for (const prefix of ['cyber-recovery', 'insurance-promise', 'cumcum']) {
  artworkOutputs.push(`public/publications/${prefix}-publication-panorama.jpg`);
  for (const width of [640, 960, 1600]) artworkOutputs.push(`public/publications/${prefix}-publication-panorama-${width}.webp`);
  artworkOutputs.push(`public/publications/og/art/${prefix}-v1.jpg`);
}
for (const book of Object.values(cumcumEditions)) {
  artworkOutputs.push(publicPath(book.cover));
  for (const width of [320, 640, 960]) artworkOutputs.push(publicPath(book.cover.replace('.jpg', `-${width}.webp`)));
}
const ogOutputs = [...new Set([
  'public/og',
  ...['home', 'default', 'manifeste', 'terminal', 'status', 'donnees', 'protocole-editorial', 'changelog-editorial', 'l-argent-d-epstein', 'epsteins-money'].map((name) => `public/og-${name}.png`),
  ...publicationSocialCards.map((card) => publicPath(card.image)),
  ...englishPageSocialCards.map((card) => publicPath(card.image)),
])].filter((name) => !name.startsWith('public/og/'));
const commonInputs = ['package.json', 'package-lock.json', 'scripts'];
const fonts = ['public/fonts', 'node_modules/@fontsource', 'node_modules/@fontsource-variable'];

// Deliberately broad source trees protect imported figure helpers and templates.
// Exclusions only separate outputs owned by a different, later stage.
export const derivedTasks = {
  icons: {
    script: 'icons:generate',
    inputs: [...commonInputs, 'public/favicon.svg'],
    outputs: ['public/favicon-32x32.png', 'public/apple-touch-icon.png', 'public/apple-touch-icon-precomposed.png', 'public/favicon.ico'],
  },
  artwork: {
    script: 'build:artwork:generate',
    inputs: [...commonInputs, ...fonts, 'src/config', ...['cyber-recovery', 'insurance-promise', 'cumcum'].flatMap((name) => [`src/epub-assets/${name}-cover-art.png`, `src/epub-assets/${name}-panorama.png`])],
    outputs: artworkOutputs,
  },
  og: {
    script: 'og:generate',
    inputs: [...commonInputs, ...fonts, 'src/config', 'src/content', 'public/publications/og/art'],
    outputs: ogOutputs,
    overrides: ['OUT', 'TITLE', 'SUBTITLE', 'EYEBROW', 'COMMAND', 'CHIPS', 'ACCENT', 'POSTS_DIR', 'OG_LANG', 'OUT_DIR'],
  },
  epub: {
    script: 'build:epub:generate',
    inputs: [...commonInputs, ...fonts, 'src/content', 'src/components', 'src/config', 'src/lib', 'src/assets', 'src/data', 'src/figures', 'src/styles', 'src/publication-text', 'src/epub-assets', 'src/epub', 'public/illustrations', 'public/infographies', 'public/styles', 'public/og', { path: 'public/publications', exclude: coverOutputs }],
    outputs: ['src/epub', { path: 'public/publications', exclude: [...coverOutputs, 'public/publications/og', ...ogOutputs.filter((name) => name.startsWith('public/publications/')), ...artworkOutputs.filter((name) => name.startsWith('public/publications/'))] }],
    overrides: ['REGENERATE_DIGITAL_EURO_COVER'],
  },
  covers: {
    script: 'build:cover-variants:generate',
    inputs: [...commonInputs, ...covers.map((name) => `public/publications/${name}-cover.png`)],
    outputs: coverOutputs,
  },
};

// These original source books are templates as well as packaging inputs. Other
// src/epub trees and publication derivatives are rewritten by this stage.
derivedTasks.epub.stableInputs = [
  ...derivedTasks.epub.inputs.filter((input) => input !== 'src/epub' && typeof input === 'string'),
  'src/epub/l-argent-d-epstein', 'src/epub/auditer-l-opacite',
];

function execute(command, args, options = {}) {
  const result = spawnSync(command, args, { cwd: ROOT, stdio: 'inherit', ...options });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`Derived asset command failed (${result.status ?? result.signal})`);
  return result;
}

export async function generateDerivedAssets(name) {
  if (!Object.hasOwn(derivedTasks, name)) throw new Error(`Unknown derived asset group: ${name}`);
  const task = derivedTasks[name];
  const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
  const identity = {
    command: packageJson.scripts[task.script],
    runtime: process.versions, platform: process.platform, architecture: process.arch, sharp: sharp.versions,
    locale: Intl.DateTimeFormat().resolvedOptions(),
    zipOptions: name === 'epub' ? process.env.ZIPOPT ?? null : null,
  };
  if (name === 'epub') identity.zip = execute('zip', ['-v'], { stdio: 'pipe', encoding: 'utf8' }).stdout;
  await runDerivedTask({
    root: ROOT, name, inputs: task.inputs, outputs: task.outputs, stableInputs: task.stableInputs, identity,
    // Keep existing one-off generator overrides effective, without trusting a
    // manifest whose declared outputs do not cover a caller's custom paths.
    cache: !task.overrides?.some((key) => process.env[key] !== undefined),
    run: () => execute('npm', ['run', task.script]),
  });
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  if (process.argv.length !== 3) throw new Error('Usage: node scripts/derived-assets.mjs icons|artwork|og|epub|covers');
  await generateDerivedAssets(process.argv[2]);
}
