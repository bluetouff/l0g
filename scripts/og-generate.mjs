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
import { createRequire } from "node:module";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

const require = createRequire(import.meta.url);

const POSTS_DIR = process.env.POSTS_DIR || "src/content/posts";
const OUT_DIR = process.env.OUT_DIR || "public/og";

// --- Charte l0g.fr (src/styles/global.css) ---
const INK = "#0c0d10";       // fond
const LINE = "rgba(255,255,255,0.12)";
const BRIGHT = "#f5f6f8";    // titre
const TEAL = "#5eead4";      // accent primaire
const ROSE = "#ff4d87";      // marque / tension
const MUTED = "#8b909b";     // labels attenues

// --- Polices JetBrains Mono (statiques .woff, lisibles par satori) ---
const jb400 = fs.readFileSync(
  require.resolve("@fontsource/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff")
);
const jb700 = fs.readFileSync(
  require.resolve("@fontsource/jetbrains-mono/files/jetbrains-mono-latin-700-normal.woff")
);

// hyperscript minimal pour satori (0 enfant -> undefined, sinon satori rejette le tableau vide)
const h = (type, style, ...children) => ({
  type,
  props: {
    style,
    children:
      children.length === 0 ? undefined : children.length === 1 ? children[0] : children,
  },
});

function card(title, dateLabel) {
  return h(
    "div",
    {
      width: "1200px",
      height: "630px",
      display: "flex",
      backgroundColor: INK,
      padding: "32px",
      fontFamily: "JetBrains Mono",
    },
    h(
      "div",
      {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        border: `1px solid ${LINE}`,
        borderRadius: "10px",
        padding: "52px 60px",
      },
      // --- invite + date ---
      h(
        "div",
        { display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" },
        h(
          "div",
          { display: "flex", alignItems: "center" },
          h("span", { color: TEAL, fontSize: "27px" }, "bluetouff@l0g:~$\u00A0"),
          h("span", { color: BRIGHT, fontSize: "27px" }, "cat article.md"),
          h("div", { width: "13px", height: "27px", backgroundColor: ROSE, marginLeft: "10px" })
        ),
        dateLabel
          ? h("span", { color: MUTED, fontSize: "22px" }, dateLabel)
          : h("span", {})
      ),
      // --- titre ---
      h(
        "div",
        { display: "flex", alignItems: "stretch" },
        h("div", { width: "7px", backgroundColor: ROSE, borderRadius: "2px", marginRight: "30px" }),
        h(
          "div",
          { display: "flex", fontWeight: 700, fontSize: "62px", lineHeight: 1.12, color: BRIGHT, maxWidth: "1000px" },
          title
        )
      ),
      // --- baseline + signature ---
      h(
        "div",
        { display: "flex", justifyContent: "space-between", alignItems: "flex-end", width: "100%" },
        h("span", { color: TEAL, fontSize: "25px" }, "macro · crypto · finance"),
        h("span", { color: BRIGHT, fontSize: "27px" }, "l0g.fr")
      )
    )
  );
}

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
  const svg = await satori(card(title, dateLabel), {
    width: 1200,
    height: 630,
    fonts: [
      { name: "JetBrains Mono", data: jb400, weight: 400, style: "normal" },
      { name: "JetBrains Mono", data: jb700, weight: 700, style: "normal" },
    ],
  });
  return new Resvg(svg, { fitTo: { mode: "width", value: 1200 } }).render().asPng();
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
