// Carte OpenGraph dédiée à l'accueil l0g.fr (1200 × 630).
// Elle reprend le dégradé identitaire de la home sans le cadre terminal des articles.

import fs from "node:fs";
import { OG, h, renderOgPng } from "./og-kit.mjs";

const OUT = "public/og-home.png";
const titleGradient = `linear-gradient(90deg, ${OG.teal}, ${OG.rose} 48%, ${OG.amber})`;

const node = (left, top, color, size = 14) =>
  h("div", {
    position: "absolute",
    left,
    top,
    width: `${size}px`,
    height: `${size}px`,
    border: `2px solid ${color}`,
    borderRadius: "50%",
    backgroundColor: OG.ink,
    boxShadow: `0 0 22px ${color}88`,
  });

const line = (left, top, width, rotate, color) =>
  h("div", {
    position: "absolute",
    left,
    top,
    width,
    height: "2px",
    backgroundImage: `linear-gradient(90deg, transparent, ${color}, transparent)`,
    transform: `rotate(${rotate}deg)`,
    transformOrigin: "left center",
    opacity: 0.72,
  });

const card = h(
  "div",
  {
    position: "relative",
    width: `${OG.width}px`,
    height: `${OG.height}px`,
    display: "flex",
    overflow: "hidden",
    backgroundColor: "#080a0e",
    backgroundImage: [
      `radial-gradient(700px 460px at 12% 2%, ${OG.teal}20, transparent 68%)`,
      `radial-gradient(640px 470px at 92% 22%, ${OG.rose}1d, transparent 67%)`,
      `radial-gradient(520px 300px at 78% 104%, ${OG.amber}16, transparent 72%)`,
    ].join(", "),
    color: OG.bright,
    fontFamily: "JetBrains Mono",
  },
  h("div", {
    position: "absolute",
    top: 0,
    left: 0,
    width: "1200px",
    height: "8px",
    backgroundImage: titleGradient,
  }),
  h("div", {
    position: "absolute",
    top: "48px",
    right: "-105px",
    width: "470px",
    height: "470px",
    border: `1px solid ${OG.teal}22`,
    borderRadius: "50%",
  }),
  h("div", {
    position: "absolute",
    top: "105px",
    right: "-48px",
    width: "356px",
    height: "356px",
    border: `1px solid ${OG.rose}2d`,
    borderRadius: "50%",
  }),
  h("div", {
    position: "absolute",
    top: "173px",
    right: "20px",
    width: "220px",
    height: "220px",
    border: `1px solid ${OG.amber}33`,
    borderRadius: "50%",
  }),
  line("872px", "138px", "238px", 18, OG.teal),
  line("835px", "312px", "268px", -24, OG.rose),
  line("922px", "430px", "178px", -67, OG.amber),
  node("918px", "144px", OG.teal),
  node("1038px", "222px", OG.rose, 16),
  node("875px", "347px", OG.rose),
  node("1005px", "394px", OG.amber, 12),
  node("1088px", "290px", OG.teal, 10),
  h(
    "div",
    {
      position: "relative",
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      padding: "54px 68px 48px",
    },
    h(
      "div",
      {
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      },
      h(
        "div",
        {
          display: "flex",
          alignItems: "baseline",
          fontSize: "40px",
          fontWeight: 700,
          letterSpacing: "-2px",
        },
        "l",
        h("span", { color: OG.teal, textShadow: `0 0 20px ${OG.teal}` }, "0"),
        "g",
        h("span", { color: OG.rose }, "_")
      ),
      h(
        "div",
        {
          display: "flex",
          color: OG.muted,
          fontSize: "17px",
          letterSpacing: "2.5px",
          textTransform: "uppercase",
        },
        "Lire les mécanismes avant qu’ils deviennent l’événement"
      )
    ),
    h(
      "div",
      {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        flex: 1,
        maxWidth: "850px",
        paddingTop: "14px",
      },
      h(
        "div",
        {
          display: "flex",
          alignItems: "center",
          color: OG.teal,
          fontSize: "18px",
          letterSpacing: "3px",
          textTransform: "uppercase",
        },
        h("div", {
          width: "42px",
          height: "1px",
          marginRight: "14px",
          backgroundColor: OG.teal,
          boxShadow: `0 0 12px ${OG.teal}`,
        }),
        "économie · marchés · risques"
      ),
      h(
        "div",
        {
          display: "flex",
          alignItems: "baseline",
          marginTop: "24px",
          fontSize: "78px",
          fontWeight: 700,
          lineHeight: 1,
          letterSpacing: "-5px",
        },
        "l",
        h("span", { color: OG.teal }, "0"),
        "g",
        h("span", { color: OG.rose, marginLeft: "14px" }, ":")
      ),
      h(
        "div",
        {
          display: "flex",
          marginTop: "12px",
          fontSize: "54px",
          fontWeight: 700,
          lineHeight: 1.15,
          letterSpacing: "-2.5px",
        },
        "les angles morts de"
      ),
      h(
        "div",
        {
          display: "flex",
          marginTop: "2px",
          fontSize: "54px",
          fontWeight: 700,
          lineHeight: 1.15,
          letterSpacing: "-2.5px",
        },
        h(
          "span",
          {
            color: "transparent",
            backgroundImage: titleGradient,
            backgroundClip: "text",
          },
          "la finance"
        )
      )
    ),
    h(
      "div",
      {
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
      },
      h(
        "div",
        {
          display: "flex",
          color: OG.paper,
          fontSize: "18px",
          letterSpacing: "1px",
        },
        "Chiffres · sources · méthodes · limites"
      ),
      h(
        "div",
        {
          display: "flex",
          alignItems: "center",
          color: OG.bright,
          fontSize: "22px",
        },
        h("span", {
          width: "7px",
          height: "7px",
          marginRight: "12px",
          borderRadius: "50%",
          backgroundColor: OG.teal,
          boxShadow: `0 0 16px ${OG.teal}`,
        }),
        "l0g.fr"
      )
    )
  )
);

fs.writeFileSync(OUT, await renderOgPng(card));
console.log(`[og-home] écrit : ${OUT}`);
