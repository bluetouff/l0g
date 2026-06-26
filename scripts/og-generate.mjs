// scripts/og-generate.mjs
// Genere une image OpenGraph (1200x630) par article, au build, a la charte l0g.fr.
// Stack : satori (HTML/flex -> SVG) + @resvg/resvg-js (SVG -> PNG). Build-time uniquement.
//
//   - lit le frontmatter de chaque .md/.mdx dans POSTS_DIR
//   - si l'article a deja "ogImage" -> on saute (surcharge manuelle prioritaire)
//   - sinon -> ecrit OUT_DIR/<slug>.png avec le titre injecte
//   - slug = nom de fichier sans extension (routage Astro filename-based)
//
// Env (defauts cales sur le repo) : POSTS_DIR=src/content/posts  OUT_DIR=public/og

import fs from "node:fs";
import path from "node:path";
import { OG, ogCard, renderOgPng } from "./og-kit.mjs";

const POSTS_DIR = process.env.POSTS_DIR || "src/content/posts";
const OUT_DIR = process.env.OUT_DIR || "public/og";

function frontmatter(src) {
  const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return {};
  const block = m[1];
  const field = (name) => {
    const r = block.match(new RegExp(`^${name}:\\s*(.*\\S)\\s*$`, "m"));
    if (!r) return undefined;
    let v = r[1].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    return v;
  };
  return { title: field("title"), ogImage: field("ogImage"), pubDate: field("pubDate") };
}

function frDate(raw) {
  if (!raw) return null;
  const d = new Date(raw);
  if (isNaN(d)) return null;
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

async function render(title, dateLabel) {
  const isGuide = POSTS_DIR.includes("guides");
  return renderOgPng(
    ogCard({
      title,
      subtitle: isGuide
        ? "Guide de référence l0g : notion durable, sources primaires, révision datée."
        : "Analyse l0g : lecture critique, sources citées, données publiques.",
      eyebrow: isGuide ? "guide de référence" : "analyse",
      command: isGuide ? "cat guide.md" : "cat article.md",
      dateLabel,
      accent: isGuide ? OG.teal : OG.rose,
      chips: isGuide
        ? ["révision datée", "sources primaires", "zéro tracker"]
        : ["lecture datée", "sources citées", "zéro tracker"],
    })
  );
}

async function main() {
  if (!fs.existsSync(POSTS_DIR)) {
    console.error(`[og] dossier introuvable : ${POSTS_DIR}`);
    process.exit(1);
  }
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md") || f.endsWith(".mdx"));
  let made = 0,
    skipped = 0;
  for (const file of files) {
    const slug = file.replace(/\.mdx?$/, "");
    const fm = frontmatter(fs.readFileSync(path.join(POSTS_DIR, file), "utf8"));
    if (!fm.title) {
      console.warn(`[og] sans titre, ignore : ${file}`);
      continue;
    }
    if (fm.ogImage) {
      skipped++;
      console.log(`[og] surcharge manuelle, ignore : ${slug}`);
      continue;
    }
    fs.writeFileSync(path.join(OUT_DIR, `${slug}.png`), await render(fm.title, frDate(fm.pubDate)));
    made++;
    console.log(`[og] ${slug}.png  <-  ${fm.title}`);
  }
  console.log(`[og] termine : ${made} carte(s), ${skipped} surcharge(s) ignoree(s).`);
}

main().catch((e) => {
  console.error("[og] erreur :", e);
  process.exit(1);
});
