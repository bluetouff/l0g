// scripts/og-default.mjs
// Genere une carte OpenGraph de marque (1200x630).
// Parametrable par env pour les pages canoniques :
//   OUT=public/og-manifeste.png TITLE="..." SUBTITLE="..." node scripts/og-default.mjs

import fs from "node:fs";
import { OG, ogCard, renderOgPng } from "./og-kit.mjs";

const OUT = process.env.OUT || "public/og-default.png";
const TITLE = process.env.TITLE || "Cartographier le risque des systèmes économiques";
const SUBTITLE =
  process.env.SUBTITLE ||
  "Macro, crédit privé, crypto : sources primaires, outils ouverts, aucun tracker.";
const EYEBROW = process.env.EYEBROW || "risk intelligence";
const COMMAND = process.env.COMMAND || "cat /risque | cartographie";
const CHIPS = (process.env.CHIPS || "sources primaires,code ouvert,zéro tracker")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

fs.writeFileSync(
  OUT,
  await renderOgPng(
    ogCard({
      title: TITLE,
      subtitle: SUBTITLE,
      eyebrow: EYEBROW,
      command: COMMAND,
      accent: process.env.ACCENT || OG.rose,
      chips: CHIPS,
    })
  )
);

console.log(`[og-default] écrit : ${OUT}`);
