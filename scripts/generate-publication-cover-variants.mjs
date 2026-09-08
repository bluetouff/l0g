#!/usr/bin/env node
import sharp from 'sharp';

// Keep the archival PNG/EPUB masters. Only the web surfaces use these derivatives.
const covers = ['eau-electricite', 'water-electricity', 'euro-numerique', 'digital-euro'];
for (const cover of covers) {
  const base = `public/publications/${cover}-cover`;
  for (const width of [320, 640, 960]) {
    const result = await sharp(`${base}.png`).resize({ width }).webp({ quality: 84 }).toFile(`${base}-${width}.webp`);
    if (result.size >= 500_000) throw new Error(`Couverture hors budget: ${base}-${width}.webp`);
  }
  const result = await sharp(`${base}.png`).resize({ width: 1200 }).jpeg({ quality: 85, mozjpeg: true }).toFile(`${base}.jpg`);
  if (result.size >= 500_000) throw new Error(`Couverture JPEG hors budget: ${base}.jpg`);
  // A wide social card keeps the complete cover instead of cropping its title.
  const social = await sharp(`${base}.png`)
    .resize(1200, 630, { fit: 'contain', background: '#071018' })
    .jpeg({ quality: 85, mozjpeg: true }).toFile(`${base}-social.jpg`);
  if (social.size >= 500_000) throw new Error(`Carte sociale hors budget: ${base}-social.jpg`);
}
