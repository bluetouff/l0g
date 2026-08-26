import { readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const source = await readFile(new URL('../public/favicon.svg', import.meta.url));
const favicon = await sharp(source).resize(32, 32).png().toBuffer();
const appleTouch = await sharp(source).resize(180, 180).png().toBuffer();

// Un fichier ICO peut contenir directement un PNG. L'en-tête fixe ci-dessous
// décrit une image 32 x 32, 32 bits, placée juste après les 22 octets ICO.
const header = Buffer.alloc(22);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(1, 4);
header.writeUInt8(32, 6);
header.writeUInt8(32, 7);
header.writeUInt8(0, 8);
header.writeUInt8(0, 9);
header.writeUInt16LE(1, 10);
header.writeUInt16LE(32, 12);
header.writeUInt32LE(favicon.length, 14);
header.writeUInt32LE(header.length, 18);

await Promise.all([
  writeFile(new URL('../public/favicon-32x32.png', import.meta.url), favicon),
  writeFile(new URL('../public/apple-touch-icon.png', import.meta.url), appleTouch),
  writeFile(new URL('../public/apple-touch-icon-precomposed.png', import.meta.url), appleTouch),
  writeFile(new URL('../public/favicon.ico', import.meta.url), Buffer.concat([header, favicon])),
]);

console.log('Icônes publiques générées depuis public/favicon.svg.');
