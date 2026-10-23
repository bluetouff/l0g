const BECH32_ALPHABET = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l';
const BECH32_GENERATORS = [0x3b6a57b2, 0x26508e6d, 0x1ea119fa, 0x3d4233dd, 0x2a1462b3];

function bech32Polymod(values) {
  let checksum = 1;
  for (const value of values) {
    const high = checksum >>> 25;
    checksum = ((checksum & 0x1ffffff) << 5) ^ value;
    for (let bit = 0; bit < BECH32_GENERATORS.length; bit += 1) {
      if ((high >>> bit) & 1) checksum ^= BECH32_GENERATORS[bit];
    }
  }
  return checksum;
}

/** Local format validation only: mainnet SegWit v0 (BIP 173), not v1/Bech32m.
 * https://github.com/bitcoin/bips/blob/master/bip-0173.mediawiki
 * This cannot establish ownership, wallet access or receipt of funds. */
export function validateBitcoinSupportAddress(value) {
  if (typeof value !== 'string' || value.length > 90 || value.length < 14) {
    throw new TypeError('Adresse Bitcoin invalide : une adresse SegWit v0 du réseau principal est attendue.');
  }
  if (value !== value.toLowerCase() && value !== value.toUpperCase()) {
    throw new TypeError('Adresse Bitcoin invalide : casse mixte interdite.');
  }

  const address = value.toLowerCase();
  const encodedData = address.slice(3);
  if (!address.startsWith('bc1') || /[^qpzry9x8gf2tvdw0s3jn54khce6mua7l]/.test(encodedData)) {
    throw new TypeError('Adresse Bitcoin invalide : réseau ou caractères non autorisés.');
  }

  const data = [...encodedData].map(character => BECH32_ALPHABET.indexOf(character));
  const hrp = 'bc';
  const expandedHrp = [
    ...[...hrp].map(character => character.charCodeAt(0) >>> 5),
    0,
    ...[...hrp].map(character => character.charCodeAt(0) & 31),
  ];
  if (bech32Polymod([...expandedHrp, ...data]) !== 1) {
    throw new TypeError('Adresse Bitcoin invalide : somme de contrôle Bech32 incorrecte.');
  }
  if (data[0] !== 0) {
    throw new TypeError('Adresse Bitcoin invalide : seule la version SegWit v0 est prise en charge.');
  }

  // Decode the witness program's bit length and retain only the unused tail.
  // BIP 173 permits at most four unused bits, all zero, after 5-to-8 conversion.
  let remaining = 0;
  let bits = 0;
  let programLength = 0;
  for (const word of data.slice(1, -6)) {
    remaining = (remaining << 5) | word;
    bits += 5;
    if (bits >= 8) {
      bits -= 8;
      programLength += 1;
    }
    remaining &= (1 << bits) - 1;
  }
  if (bits > 4 || remaining !== 0) {
    throw new TypeError('Adresse Bitcoin invalide : bits de remplissage incorrects.');
  }
  if (programLength !== 20 && programLength !== 32) {
    throw new TypeError('Adresse Bitcoin invalide : le programme SegWit v0 doit contenir 20 ou 32 octets.');
  }

  return address;
}

export function createBitcoinSupportUri(address) {
  return `bitcoin:${validateBitcoinSupportAddress(address)}`;
}

// A recipient change also requires regenerating the local QR asset and
// independently decoding it before updating its locked test fingerprint.
const address = validateBitcoinSupportAddress('bc1qc5ty6t3afddtzfhkkmsc0eh57v9qyhxf3thvgd');

export const supportBitcoin = Object.freeze({
  address,
  uri: createBitcoinSupportUri(address),
});
