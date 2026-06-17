// scripts/og-default.mjs
// Genere public/og-default.png : la carte de partage "marque" (home + pages
// sans carte dediee). One-off : a lancer a la main, le PNG est commite.
//   node scripts/og-default.mjs

import fs from "node:fs";
import { createRequire } from "node:module";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

const require = createRequire(import.meta.url);
const OUT = process.env.OUT || "public/og-default.png";

// charte l0g.fr
const INK = "#0c0d10";
const LINE = "rgba(255,255,255,0.12)";
const BRIGHT = "#f5f6f8";
const TEAL = "#5eead4";
const ROSE = "#ff4d87";

const jb400 = fs.readFileSync(require.resolve("@fontsource/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff"));
const jb700 = fs.readFileSync(require.resolve("@fontsource/jetbrains-mono/files/jetbrains-mono-latin-700-normal.woff"));

const h = (type, style, ...children) => ({
  type,
  props: {
    style,
    children: children.length === 0 ? undefined : children.length === 1 ? children[0] : children,
  },
});

const card = h(
  "div",
  { width: "1200px", height: "630px", display: "flex", backgroundColor: INK, padding: "32px", fontFamily: "JetBrains Mono" },
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
    // invite (echo de la home)
    h(
      "div",
      { display: "flex", alignItems: "center" },
      h("span", { color: TEAL, fontSize: "27px" }, "bluetouff@l0g:~$\u00A0"),
      h("span", { color: BRIGHT, fontSize: "27px" }, "cat /risque | cartographie"),
      h("div", { width: "13px", height: "27px", backgroundColor: ROSE, marginLeft: "10px" })
    ),
    // titre du site
    h(
      "div",
      { display: "flex", alignItems: "stretch" },
      h("div", { width: "7px", backgroundColor: ROSE, borderRadius: "2px", marginRight: "30px" }),
      h(
        "div",
        { display: "flex", fontWeight: 700, fontSize: "60px", lineHeight: 1.14, color: BRIGHT, maxWidth: "1000px" },
        "Cartographier le risque des systèmes économiques"
      )
    ),
    // baseline + signature
    h(
      "div",
      { display: "flex", justifyContent: "space-between", alignItems: "flex-end", width: "100%" },
      h("span", { color: TEAL, fontSize: "25px" }, "macro · crypto · finance"),
      h("span", { color: BRIGHT, fontSize: "27px" }, "l0g.fr")
    )
  )
);

const svg = await satori(card, {
  width: 1200,
  height: 630,
  fonts: [
    { name: "JetBrains Mono", data: jb400, weight: 400, style: "normal" },
    { name: "JetBrains Mono", data: jb700, weight: 700, style: "normal" },
  ],
});
fs.writeFileSync(OUT, new Resvg(svg, { fitTo: { mode: "width", value: 1200 } }).render().asPng());
console.log(`[og-default] écrit : ${OUT}`);
