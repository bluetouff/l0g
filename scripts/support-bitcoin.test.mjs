import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { XMLParser, XMLValidator } from 'fast-xml-parser';
import {
  createBitcoinSupportUri,
  supportBitcoin,
  validateBitcoinSupportAddress,
} from '../src/config/support-bitcoin.mjs';

// Official BIP 173 examples and vectors, including both supported v0 lengths:
// https://github.com/bitcoin/bips/blob/master/bip-0173.mediawiki
const bip173MainnetV0 = [
  'BC1QW508D6QEJXTDG4Y5R3ZARVARY0C5XW7KV8F3T4',
  'bc1qrp33g0q5c5txsp9arysrx4k6zdkfs4nce4xj0gdcccefvpysxf3qccfmv3',
];

test('la configuration conserve exactement l’adresse fournie et un montant libre', () => {
  const address = 'bc1qc5ty6t3afddtzfhkkmsc0eh57v9qyhxf3thvgd';
  assert.deepEqual(supportBitcoin, { address, uri: `bitcoin:${address}` });
  assert.equal(Object.isFrozen(supportBitcoin), true);
  assert.equal(validateBitcoinSupportAddress(address), address);
  assert.equal(createBitcoinSupportUri(address), `bitcoin:${address}`);
});

test('les vecteurs mainnet v0 officiels sont acceptés et normalisés sans modifier la destination', () => {
  for (const address of bip173MainnetV0) {
    assert.equal(validateBitcoinSupportAddress(address), address.toLowerCase());
    assert.equal(validateBitcoinSupportAddress(address.toUpperCase()), address.toLowerCase());
    assert.equal(createBitcoinSupportUri(address), `bitcoin:${address.toLowerCase()}`);
  }
});

for (const [label, address] of [
  ['réseau testnet officiel', 'tb1qrp33g0q5c5txsp9arysrx4k6zdkfs4nce4xj0gdcccefvpysxf3q0sl5k7'],
  ['réseau inconnu officiel', 'tc1qw508d6qejxtdg4y5r3zarvary0c5xw7kg3g4ty'],
  ['somme de contrôle officielle incorrecte', 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t5'],
  ['version de témoin officielle incorrecte', 'BC13W508D6QEJXTDG4Y5R3ZARVARY0C5XW7KN40WF2'],
  ['longueur de programme v0 officielle incorrecte', 'BC1QR508D6QEJXTDG4Y5R3ZARVARYV98GJ9P'],
  ['casse mixte officielle', 'tb1qrp33g0q5c5txsp9arysrx4k6zdkfs4nce4xj0gdcccefvpysxf3q0sL5k7'],
  ['données officielles vides', 'bc1gmk9yu'],
  // BIP 350 retains Bech32 for v0 and requires Bech32m for later versions.
  // https://github.com/bitcoin/bips/blob/master/bip-0350.mediawiki
  ['v0 avec somme Bech32m officielle', 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kemeawh'],
  ['v1 Bech32m officiel hors périmètre', 'bc1p0xlxvlhemja6c4dqv22uapctqupfhlxm9h8z3k2e72q4k9hcz7vqzk5jj0'],
  ['v1 Bech32 historique hors périmètre', 'bc1pw508d6qejxtdg4y5r3zarvary0c5xw7kw508d6qejxtdg4y5r3zarvary0c5xw7k7grplx'],
]) {
  test(`une adresse ${label} est refusée`, () => {
    assert.throws(() => validateBitcoinSupportAddress(address), TypeError);
    assert.throws(() => createBitcoinSupportUri(address), TypeError);
  });
}

// Fixed malformed-v0 fixtures with valid Bech32 checksums, produced using the
// BIP 173 Python reference algorithm. No encoder from the implementation under
// test is used, so padding and length checks cannot hide behind a bad checksum.
for (const [label, address, reason] of [
  ['remplissage non nul', 'bc1qrp33g0q5c5txsp9arysrx4k6zdkfs4nce4xj0gdcccefvpysxf3p9waw3r', /remplissage/],
  ['plus de quatre bits de remplissage', 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kqkhhp9x', /remplissage/],
  ['programme de 19 octets', 'bc1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqmql8k8', /20 ou 32 octets/],
  ['programme de 21 octets', 'bc1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqj9pecr', /20 ou 32 octets/],
  ['réseau regtest', 'bcrt1qw508d6qejxtdg4y5r3zarvary0c5xw7kygt080', /réseau/],
]) {
  test(`une adresse avec ${label} est refusée malgré sa somme de contrôle`, () => {
    assert.throws(() => validateBitcoinSupportAddress(address), reason);
  });
}

test('chaque substitution simple de la partie données de l’adresse configurée est détectée', () => {
  const alphabet = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l';
  for (let index = 3; index < supportBitcoin.address.length; index += 1) {
    for (const replacement of alphabet) {
      if (replacement === supportBitcoin.address[index]) continue;
      const changed = supportBitcoin.address.slice(0, index) + replacement + supportBitcoin.address.slice(index + 1);
      assert.throws(() => validateBitcoinSupportAddress(changed), TypeError);
    }
  }
});

test('URI, paramètres, fragments, espaces et contenus injectables sont refusés sans correction', () => {
  for (const value of [
    null, undefined, 42, {}, [], new String(supportBitcoin.address), '',
    `bitcoin:${supportBitcoin.address}`, `bitcoin://${supportBitcoin.address}`,
    `https://example.test/${supportBitcoin.address}`, 'javascript:alert(1)',
    `${supportBitcoin.address}?amount=1`, `${supportBitcoin.address}#fragment`,
    `${supportBitcoin.address}?label=<script>`, `${supportBitcoin.address}\" onclick=\"alert(1)`,
    ` ${supportBitcoin.address}`, `${supportBitcoin.address} `,
    `${supportBitcoin.address}\n`, `${supportBitcoin.address}\u0000`,
    `${supportBitcoin.address.slice(0, 4).toUpperCase()}${supportBitcoin.address.slice(4)}`,
    `bc1q${'q'.repeat(100)}`, supportBitcoin.address.replace('c5', 'c１'),
  ]) {
    assert.throws(() => validateBitcoinSupportAddress(value), TypeError);
    assert.throws(() => createBitcoinSupportUri(value), TypeError);
  }
});

test('le QR local reste passif et conserve la destination ainsi que sa zone de silence', () => {
  const bytes = readFileSync(new URL('../src/assets/support-bitcoin-qr.svg', import.meta.url));
  const svg = bytes.toString('utf8');

  // Generated offline with ReportLab 4.4.9, error correction Q. Re-decode the
  // resulting QR image before any update to this digest; metadata alone cannot
  // establish which payment destination its visible modules encode.
  assert.equal(
    createHash('sha256').update(bytes).digest('hex'),
    'bc1546ac11c933a8b9c2e3a3ff4076a61d197853217922460f27a129ac937267',
    'Le QR a changé : redécoder son image avant de renouveler son empreinte.',
  );
  assert.doesNotMatch(svg, /<!DOCTYPE|<!ENTITY|<\?/iu);
  assert.equal(XMLValidator.validate(svg), true);
  const document = new XMLParser({
    ignoreAttributes: false,
    parseTagValue: false,
    trimValues: false,
    processEntities: false,
  }).parse(svg);
  assert.deepEqual(Object.keys(document), ['svg']);
  const root = document.svg;
  assert.deepEqual(Object.keys(root).sort(), [
    '#text', '@_height', '@_shape-rendering', '@_viewBox', '@_width', '@_xmlns',
    'metadata', 'path', 'rect',
  ].sort());
  assert.match(root['#text'], /^\s*$/u);
  assert.equal(root['@_xmlns'], 'http://www.w3.org/2000/svg');
  assert.equal(root['@_viewBox'], '0 0 45 45');
  assert.equal(root['@_width'], root['@_height']);
  assert.match(root['@_width'], /^[1-9][0-9]*$/u);
  assert.equal(root['@_shape-rendering'], 'crispEdges');
  assert.equal(root.metadata, supportBitcoin.uri);
  assert.deepEqual(root.rect, { '@_width': '100%', '@_height': '100%', '@_fill': '#fff' });
  assert.deepEqual(Object.keys(root.path).sort(), ['@_d', '@_fill']);
  assert.equal(root.path['@_fill'], '#000');

  // The path uses one-unit-high horizontal black runs on a 37-module matrix,
  // inset by four modules on every side of the 45 × 45 white canvas.
  const path = root.path['@_d'];
  const runs = [...path.matchAll(/M([0-9]+) ([0-9]+)h([0-9]+)v1h-([0-9]+)z/gu)];
  assert.ok(runs.length > 0);
  assert.equal(runs.map(run => run[0]).join(''), path);
  const bounds = runs.map(([, x, y, width, back]) => {
    assert.equal(width, back);
    const rectangle = { x: Number(x), y: Number(y), width: Number(width) };
    assert.ok(rectangle.width > 0);
    assert.ok(rectangle.x >= 4 && rectangle.y >= 4);
    assert.ok(rectangle.x + rectangle.width <= 41 && rectangle.y + 1 <= 41);
    return rectangle;
  });
  assert.equal(Math.min(...bounds.map(run => run.x)), 4);
  assert.equal(Math.min(...bounds.map(run => run.y)), 4);
  assert.equal(Math.max(...bounds.map(run => run.x + run.width)), 41);
  assert.equal(Math.max(...bounds.map(run => run.y + 1)), 41);
});
