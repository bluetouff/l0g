import fs from "node:fs";
import { createRequire } from "node:module";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

const require = createRequire(import.meta.url);

export const OG = {
  width: 1200,
  height: 630,
  ink: "#0c0d10",
  surface: "#121419",
  line: "rgba(255,255,255,0.12)",
  bright: "#f5f6f8",
  paper: "#e7e9ee",
  muted: "#8b909b",
  teal: "#5eead4",
  rose: "#ff4d87",
  amber: "#f5b13d",
};

const jb400 = fs.readFileSync(
  require.resolve("@fontsource/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff")
);
const jb700 = fs.readFileSync(
  require.resolve("@fontsource/jetbrains-mono/files/jetbrains-mono-latin-700-normal.woff")
);

export const fonts = [
  { name: "JetBrains Mono", data: jb400, weight: 400, style: "normal" },
  { name: "JetBrains Mono", data: jb700, weight: 700, style: "normal" },
];

export const h = (type, style, ...children) => ({
  type,
  props: {
    style,
    children: children.length === 0 ? undefined : children.length === 1 ? children[0] : children,
  },
});

function mark() {
  return h(
    "div",
    { display: "flex", alignItems: "baseline", fontWeight: 700, fontSize: "38px", color: OG.bright },
    "l",
    h("span", { color: OG.teal, textShadow: `0 0 18px ${OG.teal}` }, "0"),
    "g"
  );
}

function chip(label, color = OG.teal) {
  return h(
    "div",
    {
      display: "flex",
      alignItems: "center",
      height: "34px",
      border: `1px solid ${color}55`,
      borderRadius: "999px",
      padding: "0 16px",
      backgroundColor: `${color}10`,
      color,
      fontSize: "18px",
      letterSpacing: "1px",
      textTransform: "uppercase",
    },
    h("div", { width: "7px", height: "7px", borderRadius: "50%", backgroundColor: color, marginRight: "10px" }),
    label
  );
}

export function ogCard({
  title,
  subtitle = "Cartographier le risque des systèmes économiques",
  eyebrow = "risk intelligence",
  command = "cat /risque | cartographie",
  dateLabel,
  accent = OG.rose,
  chips = ["sources primaires", "code ouvert", "zéro tracker"],
}) {
  return h(
    "div",
    {
      width: `${OG.width}px`,
      height: `${OG.height}px`,
      display: "flex",
      backgroundColor: OG.ink,
      padding: "30px",
      fontFamily: "JetBrains Mono",
    },
    h(
      "div",
      {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        border: `1px solid ${OG.line}`,
        borderRadius: "12px",
        padding: "46px 54px",
        backgroundImage: `radial-gradient(900px 420px at 70px 0px, ${OG.teal}14, transparent 65%)`,
      },
      h(
        "div",
        { display: "flex", justifyContent: "space-between", alignItems: "flex-start", width: "100%" },
        h(
          "div",
          { display: "flex", flexDirection: "column" },
          h(
            "div",
            { display: "flex", alignItems: "center" },
            h("span", { color: OG.teal, fontSize: "24px" }, "bluetouff@l0g:~$\u00A0"),
            h("span", { color: OG.paper, fontSize: "24px" }, command),
            h("div", { width: "12px", height: "24px", backgroundColor: accent, marginLeft: "10px" })
          ),
          h("div", { marginTop: "12px", color: OG.muted, fontSize: "18px", letterSpacing: "2px", textTransform: "uppercase" }, eyebrow)
        ),
        h(
          "div",
          { display: "flex", flexDirection: "column", alignItems: "flex-end" },
          mark(),
          dateLabel ? h("div", { marginTop: "8px", color: OG.muted, fontSize: "18px" }, dateLabel) : h("span", {})
        )
      ),
      h(
        "div",
        { display: "flex", alignItems: "stretch", width: "100%" },
        h("div", { width: "7px", backgroundColor: accent, borderRadius: "2px", marginRight: "28px" }),
        h(
          "div",
          { display: "flex", flexDirection: "column", maxWidth: "970px" },
          h(
            "div",
            {
              display: "flex",
              fontWeight: 700,
              fontSize: "54px",
              lineHeight: 1.12,
              color: OG.bright,
              letterSpacing: "-1px",
            },
            title
          ),
          subtitle
            ? h("div", { display: "flex", marginTop: "22px", color: OG.muted, fontSize: "24px", lineHeight: 1.35, maxWidth: "920px" }, subtitle)
            : h("span", {})
        )
      ),
      h(
        "div",
        { display: "flex", justifyContent: "space-between", alignItems: "flex-end", width: "100%" },
        h("div", { display: "flex", flexWrap: "wrap", gap: "10px", maxWidth: "820px" }, ...chips.map((label, index) => chip(label, index === 2 ? OG.amber : OG.teal))),
        h("span", { color: OG.bright, fontSize: "23px" }, "l0g.fr")
      )
    )
  );
}

export async function renderOgPng(card) {
  const svg = await satori(card, {
    width: OG.width,
    height: OG.height,
    fonts,
  });
  return new Resvg(svg, { fitTo: { mode: "width", value: OG.width } }).render().asPng();
}
