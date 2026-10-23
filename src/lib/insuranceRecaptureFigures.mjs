// Closed, bilingual documentary scenes. All quantities retain their source perimeter.
export const INSURANCE_RECAPTURE_KINDS = Object.freeze([
  "branches",
  "ratio",
  "payments",
  "rebalancing",
]);
export const INSURANCE_RECAPTURE_SOURCES = Object.freeze([
  "03 04",
  "03",
  "04 02 09 01",
  "03 04",
]);
const COPY = {
  fr: [
    [
      "LIST : le scénario bifurque",
      "LIST 2025, bilans au 31 décembre 2024, résultats publiés le 17 novembre 2025. Après les étapes 1 et 2 communes, le scénario central poursuit une étape 3 de stabilisation. La Section C modifie cette étape 3 en ajoutant une reprise déclenchée par une condition de solvabilité du réassureur. Le scénario central couvre onze entités ; la reprise couvre le sous-échantillon ayant une exposition matérielle. La contrepartie est choisie pour son effet immédiat le plus défavorable sur le ratio de chaque assureur. 12,3 milliards de livres d’engagements sont repris, environ 50 % de l’exposition FundedRe retenue fin 2024. Périmètre : accords depuis le 1er janvier 2016, hors intragroupe. Aucun montant de trésorerie ou de perte n’est représenté. Schéma de branchement sans durée ni volume monétaire proportionnel. Choc initial : taux et actions en baisse, écarts de rendement qui se creusent. L’étape 2 ajoute dégradations, défauts et baisse de l’immobilier. L’étape 3 centrale resserre les spreads et permet rééquilibrage et actions de gestion. Calibrage exploratoire sans probabilité cible.",
    ],
    [
      "La reprise déplace le ratio",
      "Sous-échantillon LIST 2025 avec réassurance financée matérielle. Couverture SCR publiée : 154 % dans le scénario central de comparaison et 144 % avec reprise. La PRA rapporte un SCR en hausse de 6 % et des fonds propres admissibles en baisse de 1 %. Illustration en indices : avec un SCR central de 100 et des fonds propres de 154, ces variations arrondies donnent un SCR de 106 et des fonds propres de 152,46 ; 152,46 divisé par 106 donne environ 143,83 %, cohérent avec 144 % arrondis. Barres sur une même échelle commençant à zéro. Ces indices sont pédagogiques et ne reconstituent aucun montant de capital en livres.",
    ],
    [
      "Des actifs repris aux paiements",
      "Les conditions de reconnaissance du collatéral dans LIST sont la propriété bénéficiaire au jour 1 et la propriété juridique dans les six mois. Ces bornes ne garantissent aucun délai réel. Les rentes suivent le calendrier contractuel. Les actifs peuvent être conservés pour leurs flux ou vendus sous conditions de contrôle juridique et de marché liquide. La trésorerie finance les rentes, appels de marge et coûts. L’admissibilité au matching adjustment fait l’objet d’un examen prudentiel distinct. Les facilités externes préarrangées sont les seules autorisées aux étapes a à d de la section C. Flèches sans échelle monétaire.",
    ],
    [
      "Rééquilibrer le portefeuille MA",
      "LIST 2025, scénario central, onze entités. À l’étape 3, le rééquilibrage imposé ramène 25 % des actifs dégradés concernés de chaque portefeuille MA à leur note initiale ; les titrisations ERM sont exclues. 3,4 milliards de livres de ventes de titres sous investment grade sont estimés par la PRA ; 0,9 milliard supplémentaire est échangé dans les actions de gestion. Le coût total du rééquilibrage imposé est de 0,8 milliard de livres de fonds propres admissibles après impôt, avec un effet de moins un point sur la couverture du SCR. Les volumes des barres ne mesurent pas le coût ni les besoins de cash de la recapture. Dans la branche exploratoire, le collatéral repris est explicitement exclu de la règle des 25 %. Le coût global couvre un périmètre plus large que les seules ventes de titres sous investment grade représentées par les barres. La baisse agrégée des fonds propres admissibles après impôt atteint 0,8 milliard de livres ; les 3,4 et 0,9 milliards sont des volumes de transactions distincts. Effet modélisé sur les fonds propres et volumes échangés relèvent ainsi de périmètres différents.",
    ],
  ],
  en: [
    [
      "LIST: the scenario branches",
      "LIST 2025 applies to balance sheets at 31 December 2024; results were published on 17 November 2025. After common Stages 1 and 2, the core scenario proceeds to market stabilisation in Stage 3. Section C modifies Stage 3 by adding recapture triggered by breach of a reinsurer solvency condition. The core scenario covers eleven entities; recapture covers the material-exposure subset. Each firm’s selected counterparty is the one with the largest immediate adverse solvency-ratio impact. £12.3 billion of liabilities are recaptured, approximately 50% of the qualifying end-2024 FundedRe exposure. Scope: agreements from 1 January 2016, excluding intragroup reinsurance. No cash requirement or loss amount is shown. Branching diagram without proportional time or monetary volume. The initial shock combines falling rates and equities with widening spreads. Stage 2 adds downgrades, defaults and falling property values. Core Stage 3 narrows spreads and permits rebalancing and management actions. The exploratory recapture scenario has no target probability.",
    ],
    [
      "Recapture shifts the ratio",
      "LIST 2025 material funded-reinsurance exposure subset. Published SCR coverage is 154% in the core comparator and 144% with recapture. The PRA reports a 6% rise in SCR and a 1% fall in eligible own funds. Illustrative indices: setting core SCR to 100 and own funds to 154, the rounded changes produce SCR of 106 and own funds of 152.46; 152.46 divided by 106 is approximately 143.83%, consistent with the published rounded 144%. Bars use one scale beginning at zero. The indices explain the calculation without reconstructing capital amounts in pounds.",
    ],
    [
      "From recaptured assets to payments",
      "LIST recognises collateral subject to beneficial ownership from day 1 and legal ownership within six months. These conditions do not guarantee actual transfer times. Annuity payments follow contractual dates. Assets can be held for their cash flows or sold subject to legal control and a liquid market. Available cash funds annuity benefits, margin calls and costs. Matching-adjustment eligibility requires a separate prudential assessment. Only pre-arranged external facilities may be drawn in Section C steps a to d. Arrows have no monetary scale.",
    ],
    [
      "Rebalancing the MA portfolio",
      "LIST 2025 core scenario, eleven entities. At Stage 3, prescribed rebalancing restores 25% of the relevant downgraded assets in each MA portfolio to their original rating; ERM securitisations are excluded. The PRA estimates £3.4bn of sub-investment-grade sales; firms trade a further £0.9bn through management actions. The total prescribed-rebalancing cost is £0.8bn of post-tax eligible own funds, with a one-percentage-point effect on SCR coverage. The bar volumes are not recapture costs or cash needs. In the exploratory branch, recaptured collateral is explicitly excluded from the 25% rule. The overall cost covers a wider scope than the sub-investment-grade sales shown by the bars. GBP0.8bn is the aggregate after-tax reduction in eligible own funds; GBP3.4bn and GBP0.9bn are separate transaction volumes. The modelled own-funds effect and traded amounts have different perimeters.",
    ],
  ],
};
const esc = (v) =>
  String(v).replace(
    /[&<>"']/gu,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&apos;",
      })[c],
  );
const num = (v) => String(Math.round(v * 1000) / 1000);
const color = (n) => `var(--color-${n})`;
const el = (tag, a, body = "") =>
  `<${tag} ${Object.entries(a)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => `${k}="${esc(v)}"`)
    .join(" ")}>${body}</${tag}>`;
const text = (
  x,
  y,
  value,
  {
    size = 28,
    weight = 400,
    fill = "paper",
    anchor = "start",
    panel,
    maxWidth,
  } = {},
) =>
  el(
    "text",
    {
      "data-panel": panel,
      "data-max-width": maxWidth,
      x: num(x),
      y: num(y),
      "font-family": "l0g Insurance Recapture",
      "font-size": size,
      "font-weight": weight,
      "text-anchor": anchor,
      fill: color(fill),
    },
    esc(value),
  );
const lines = (x, y, values, o = {}) =>
  values.map((v, i) => text(x, y + i * (o.leading ?? 34), v, o)).join("");
const rect = (id, x, y, w, h, fill = "surface", rx = 8) =>
  el("rect", {
    id,
    x: num(x),
    y: num(y),
    width: num(w),
    height: num(h),
    rx,
    fill: color(fill),
    stroke: color("line-strong"),
    "stroke-width": 1.5,
  });
const bar = (id, x, y, w, h, fill) =>
  el("rect", {
    id,
    x: num(x),
    y: num(y),
    width: num(w),
    height: num(h),
    rx: 0,
    fill: color(fill),
    stroke: "none",
    "stroke-width": 0,
  });
const line = (id, x1, y1, x2, y2, stroke = "line-strong", extra = {}) =>
  el("line", {
    id,
    x1: num(x1),
    y1: num(y1),
    x2: num(x2),
    y2: num(y2),
    stroke: color(stroke),
    "stroke-width": 2,
    ...extra,
  });
const arrow = (p, id, x1, y1, x2, y2) =>
  line(`${p}-${id}`, x1, y1, x2, y2, "signal", {
    "marker-end": `url(#${p}-signal-arrow)`,
  });
function panel(
  p,
  id,
  x,
  y,
  w,
  h,
  values,
  { fill = "paper", leading = 32 } = {},
) {
  const key = `${p}-${id}`;
  return (
    rect(key, x, y, w, h) +
    lines(x + 16, y + 34, values, {
      panel: key,
      maxWidth: w - 32,
      fill,
      leading,
    })
  );
}
function frame(lang, i, m, body) {
  const fr = lang === "fr",
    w = m ? 600 : 1000,
    h = m ? 930 : 790;
  const p = `insurance-recapture-${lang}-f${i + 1}-${m ? "m" : "d"}`;
  const title = COPY[lang][i][0];
  const titleLines =
    m && i === 2
      ? fr
        ? ["Des actifs repris", "aux paiements"]
        : ["From recaptured assets", "to payments"]
      : m && i === 3
        ? fr
          ? ["Rééquilibrer le", "portefeuille MA"]
          : ["Rebalancing the", "MA portfolio"]
        : [title];
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" style="width:100%;height:auto" class="l0g-insurance-recapture-svg" role="img" aria-labelledby="${p}-title ${p}-desc"><title id="${p}-title">${esc(title)}</title><desc id="${p}-desc">${esc(COPY[lang][i][1])}</desc><defs><marker id="${p}-signal-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="10" markerHeight="10" orient="auto" markerUnits="userSpaceOnUse"><path d="M 1 1 L 9 5 L 1 9" fill="none" stroke="var(--color-signal)" stroke-width="2.5"></path></marker></defs>` +
    rect(undefined, 0, 0, w, h, "ink", 0) +
    text(24, 36, `l0g / 0${i + 1}`, { weight: 700, fill: "signal" }) +
    text(w - 24, 36, "23.10.2026", { anchor: "end", fill: "muted" }) +
    lines(24, 94, titleLines, {
      size: m ? 30 : 36,
      weight: 700,
      maxWidth: w - 48,
    }) +
    body({ fr, w, p, m }) +
    line(`${p}-source-rule`, 24, h - 47, w - 24, h - 47) +
    text(24, h - 16, fr ? "Sources :" : "Sources:", { fill: "muted" }) +
    INSURANCE_RECAPTURE_SOURCES[i]
      .split(" ")
      .map((s, j) =>
        el(
          "a",
          { href: `#source-s${s}` },
          text(158 + j * 92, h - 16, `S${s}`, { fill: "muted" }),
        ),
      )
      .join("") +
    "</svg>"
  );
}
const note = (y, values, w) =>
  lines(24, y, values, { fill: "muted", maxWidth: w - 48 });
const route = (p, id, points, arrowEnd = true) =>
  points
    .slice(1)
    .map(([x2, y2], i) =>
      line(
        `${p}-${id}-${i}`,
        points[i][0],
        points[i][1],
        x2,
        y2,
        "signal",
        arrowEnd && i === points.length - 2
          ? { "marker-end": `url(#${p}-signal-arrow)` }
          : {},
      ),
    )
    .join("");
function axis(p, x, y, width, max, ticks) {
  return (
    line(`${p}-axis`, x, y, x + width, y) +
    ticks
      .map(
        (v) =>
          text(x + (width * v) / max, y - 14, String(v), {
            anchor: v === 0 ? "start" : v === max ? "end" : "middle",
            fill: "muted",
          }) +
          line(
            `${p}-tick-${v}`,
            x + (width * v) / max,
            y - 5,
            x + (width * v) / max,
            y,
          ),
      )
      .join("")
  );
}
function branches(lang, m) {
  return frame(lang, 0, m, ({ fr, w, p }) => {
    let out = note(
      150,
      fr
        ? ["LIST 2025 · bilans au 31.12.2024", "Résultats : 17.11.2025"]
        : ["LIST 2025 · balance sheets 31.12.2024", "Results: 17.11.2025"],
      w,
    );
    if (m) {
      out += panel(
        p,
        "stage-1",
        24,
        206,
        552,
        76,
        fr ? ["1 · Choc initial de marché"] : ["1 · Initial market shock"],
      );
      out += arrow(p, "stage-1-to-2", 300, 282, 300, 310);
      out += panel(
        p,
        "stage-2",
        24,
        310,
        552,
        110,
        fr
          ? ["2 · Dégradations et défauts", "Même choc sur le collatéral"]
          : ["2 · Downgrades and defaults", "Collateral takes the same shock"],
      );
      out +=
        route(
          p,
          "common-branch",
          [
            [300, 420],
            [300, 448],
            [157, 448],
          ],
          false,
        ) +
        line(`${p}-branch-right`, 300, 448, 443, 448, "signal") +
        arrow(p, "central-entry", 157, 448, 157, 474) +
        arrow(p, "recapture-entry", 443, 448, 443, 474);
      out += panel(
        p,
        "central",
        24,
        474,
        266,
        154,
        fr
          ? ["3 · Central", "11 entités", "Stabilisation", "Gestion permise"]
          : ["3 · Core", "11 entities", "Stabilisation", "Actions allowed"],
      );
      out += panel(
        p,
        "recapture",
        310,
        474,
        266,
        154,
        fr
          ? [
              "3 · Section C",
              "Clause rompue",
              "Contrepartie au",
              "pire effet initial",
            ]
          : [
              "3 · Section C",
              "Trigger broken",
              "Counterparty:",
              "worst effect",
            ],
      );
      out += arrow(p, "recapture-result", 443, 628, 443, 664);
      out += panel(
        p,
        "result",
        24,
        664,
        552,
        124,
        fr
          ? [
              "Reprise : 12,3 Md GBP",
              "Environ 50 % de l’exposition",
              "FundedRe du sous-ensemble",
            ]
          : [
              "Recapture: GBP12.3bn",
              "About 50% of the subset’s",
              "qualifying funded reinsurance",
            ],
      );
      out += note(
        830,
        fr
          ? [
              "Accords depuis le 01.01.2016 ;",
              "hors intragroupe · exposition fin 2024",
            ]
          : [
              "Agreements since 01.01.2016;",
              "intragroup excluded · year-end 2024",
            ],
        w,
      );
    } else {
      out += panel(
        p,
        "stage-1",
        24,
        210,
        430,
        110,
        fr
          ? ["1 · Choc initial de marché", "Taux, actions, spreads"]
          : ["1 · Initial market shock", "Rates, equities, spreads"],
      );
      out += arrow(p, "stage-1-to-2", 454, 265, 526, 265);
      out += panel(
        p,
        "stage-2",
        526,
        210,
        450,
        110,
        fr
          ? ["2 · Dégradations et défauts", "Même choc sur le collatéral"]
          : ["2 · Downgrades and defaults", "Same shock on collateral"],
      );
      out +=
        route(
          p,
          "common-branch",
          [
            [751, 320],
            [751, 354],
            [249, 354],
          ],
          false,
        ) +
        arrow(p, "central-entry", 249, 354, 249, 388) +
        arrow(p, "recapture-entry", 751, 354, 751, 388);
      out += panel(
        p,
        "central",
        24,
        388,
        450,
        144,
        fr
          ? [
              "3 · Central · 11 entités",
              "Stabilisation des marchés",
              "Rééquilibrage et gestion",
            ]
          : [
              "3 · Core · 11 entities",
              "Markets stabilise",
              "Rebalancing and actions",
            ],
      );
      out += panel(
        p,
        "recapture",
        526,
        388,
        450,
        144,
        fr
          ? [
              "3 modifiée · Section C",
              "Seuil de solvabilité rompu",
              "Pire effet initial par assureur",
            ]
          : [
              "3 modified · Section C",
              "Solvency trigger breached",
              "Worst effect for each insurer",
            ],
      );
      out += arrow(p, "recapture-result", 751, 532, 751, 566);
      out += panel(
        p,
        "result",
        526,
        566,
        450,
        110,
        fr
          ? ["12,3 Md GBP d’engagements", "Environ 50 % du périmètre"]
          : ["GBP12.3bn liabilities", "About 50% of the subset"],
      );
      out += lines(
        24,
        585,
        fr
          ? [
              "Branches distinctes :",
              "central et exploratoire.",
              "Flèches sans échelle",
              "de durée ou de cash.",
            ]
          : [
              "Separate core and",
              "exploratory branches.",
              "Arrows carry no time",
              "or cash-flow scale.",
            ],
        { fill: "muted", maxWidth: 450 },
      );
      out += note(
        720,
        fr
          ? [
              "Exposition fin 2024 ; accords depuis 01.01.2016, hors intragroupe.",
            ]
          : ["Year-end 2024; since 01.01.2016, intragroup excluded."],
        w,
      );
    }
    return out;
  });
}
function ratio(lang, m) {
  return frame(lang, 1, m, ({ fr, w, p }) => {
    let out = note(
      150,
      fr
        ? [
            "LIST 2025 · sous-ensemble FundedRe",
            "Bilans fin 2024 · publié 17.11.2025",
          ]
        : [
            "LIST 2025 · material FundedRe subset",
            "Year-end 2024 · published 17.11.2025",
          ],
      w,
    );
    out +=
      text(24, 236, "154 % → 144 %", {
        size: 38,
        weight: 700,
        fill: "signal",
      }) +
      text(
        m ? 24 : 526,
        m ? 278 : 236,
        fr ? "−10 points publiés" : "−10 published coverage points",
        { fill: "muted", maxWidth: m ? 552 : 450 },
      );
    const x = m ? 24 : 320,
      width = m ? 552 : 620;
    out += axis(p, x, m ? 330 : 330, width, 160, [0, 40, 80, 120, 160]);
    const values = [
        [154, 152.46],
        [100, 106],
      ],
      colours = ["signal", "topic-blue"];
    for (let i = 0; i < 2; i++) {
      const label = fr
        ? i
          ? "Capital requis (SCR) : +6 %"
          : "Fonds propres admissibles : −1 %"
        : i
          ? "Required capital (SCR): +6%"
          : "Eligible own funds: −1%";
      if (m)
        out += text(24, 370 + i * 185, label, { weight: 700, maxWidth: 552 });
      else
        out += lines(
          24,
          403 + i * 150,
          fr
            ? i
              ? ["Capital requis", "SCR : +6 %"]
              : ["Fonds propres", "admissibles", "−1 %"]
            : i
              ? ["Required capital", "SCR: +6%"]
              : ["Eligible funds", "−1%"],
          { weight: 700, maxWidth: 270 },
        );
      for (let j = 0; j < 2; j++) {
        const y = m ? 414 + i * 185 + j * 72 : 398 + i * 150 + j * 55;
        const value = values[i][j],
          display = fr ? String(value).replace(".", ",") : String(value);
        if (m)
          out += text(
            x,
            y - 12,
            `${fr ? (j ? "Après" : "Avant") : j ? "After" : "Before"} : ${display}`,
            { fill: colours[j] },
          );
        else
          out += text(
            x + width,
            y - 12,
            `${fr ? (j ? "Après" : "Avant") : j ? "After" : "Before"} ${display}`,
            { fill: colours[j], anchor: "end" },
          );
        out += bar(
          `${p}-index-${i}-${j}`,
          x,
          y,
          (width * value) / 160,
          18,
          colours[j],
        );
      }
    }
    out += note(
      m ? 738 : 658,
      m
        ? fr
          ? [
              "Indices : SCR central = 100.",
              "152,46 ÷ 106 × 100",
              "Environ 143,83 % ; PRA : 144 %.",
              "Entrées arrondies.",
            ]
          : [
              "Indices: core comparator SCR = 100.",
              "152.46 ÷ 106 × 100",
              "About 143.83%; PRA: 144%.",
              "Rounded inputs.",
            ]
        : fr
          ? [
              "Indices : SCR central = 100.",
              "152,46 ÷ 106 × 100 : environ 143,83 %.",
              "Entrées arrondies ; PRA : 144 %.",
            ]
          : [
              "Indices: core comparator SCR = 100.",
              "152.46 ÷ 106 × 100: about 143.83%.",
              "Rounded inputs; PRA ratio: 144%.",
            ],
      w,
    );
    return out;
  });
}
function payments(lang, m) {
  return frame(lang, 2, m, ({ fr, w, p }) => {
    let out = "";
    if (m) {
      out += text(
        24,
        167,
        fr
          ? "LIST : reconnaissance du collatéral"
          : "LIST collateral recognition",
        { fill: "muted", maxWidth: 552 },
      );
      out +=
        text(24, 205, fr ? "J1 : bénéficiaire" : "Day 1: beneficial", {
          fill: "topic-blue",
        }) +
        text(576, 241, fr ? "6 mois : juridique" : "6 months: legal", {
          fill: "topic-blue",
          anchor: "end",
        });
      out += arrow(p, "recognition", 24, 254, 576, 254);
      out += text(
        24,
        292,
        fr
          ? "Rentes : échéances du contrat"
          : "Annuities: contractual due dates",
        { fill: "amber", maxWidth: 552 },
      );
      out += panel(
        p,
        "assets",
        24,
        330,
        552,
        62,
        fr
          ? ["Actifs repris : droits et gestion"]
          : ["Recaptured assets: rights, control"],
      );
      out +=
        route(p, "hold-entry", [
          [300, 392],
          [300, 418],
          [154, 418],
          [154, 440],
        ]) +
        route(p, "sell-entry", [
          [300, 418],
          [446, 418],
          [446, 440],
        ]);
      out += panel(
        p,
        "hold",
        24,
        440,
        260,
        112,
        fr
          ? ["Conserver", "Flux des actifs", "Selon les actifs"]
          : ["Hold assets", "Asset inflows", "Asset due dates"],
      );
      out += panel(
        p,
        "sell",
        316,
        440,
        260,
        112,
        fr
          ? ["Vendre", "Titre acquis", "Marché liquide"]
          : ["Sell assets", "Legal title", "Liquid market"],
      );
      out +=
        route(p, "hold-cash", [
          [154, 552],
          [154, 578],
          [446, 578],
          [446, 606],
        ]) + arrow(p, "sell-cash", 446, 552, 446, 606);
      out += panel(
        p,
        "facility",
        24,
        606,
        260,
        112,
        fr
          ? ["Lignes externes", "préarrangées", "Section C : a–d"]
          : ["Prearranged", "external lines", "Section C: a–d"],
      );
      out += panel(
        p,
        "cash",
        316,
        606,
        260,
        112,
        fr
          ? ["Cash disponible", "Aux échéances"]
          : ["Available cash", "At due dates"],
      );
      out += arrow(p, "facility-cash", 284, 663, 316, 663);
      out +=
        route(
          p,
          "cash-payments",
          [
            [446, 718],
            [446, 744],
            [112, 744],
          ],
          false,
        ) + line(`${p}-outgoing-bus`, 112, 744, 488, 744, "signal");
      for (const [i, label] of (fr
        ? ["Rentes", "Marges", "Frais"]
        : ["Annuities", "Margin", "Costs"]
      ).entries()) {
        const x = 24 + i * 188;
        out +=
          arrow(p, `outgoing-${i}`, x + 88, 744, x + 88, 756) +
          panel(p, `payment-${i}`, x, 756, 176, 56, [label]);
      }
      out += route(p, "assets-ma", [
        [576, 361],
        [590, 361],
        [590, 839],
        [576, 839],
      ]);
      out += note(
        839,
        fr
          ? ["Contrôle MA distinct : valeur du passif."]
          : ["Separate MA check: liability value."],
        w,
      );
      out += text(
        24,
        870,
        fr
          ? "Suivre les points bas de cash."
          : "Track intrahorizon cash low points.",
        { fill: "muted", maxWidth: 552 },
      );
    } else {
      out += note(
        150,
        fr
          ? ["LIST : reconnaissance selon les contrats et le droit applicable"]
          : ["LIST: recognition under contract and applicable law"],
        w,
      );
      out +=
        text(
          24,
          198,
          fr ? "J1 : propriété bénéficiaire" : "Day 1: beneficial ownership",
          { fill: "topic-blue" },
        ) +
        text(
          976,
          198,
          fr ? "6 mois : propriété juridique" : "6 months: legal ownership",
          { fill: "topic-blue", anchor: "end" },
        );
      out += arrow(p, "recognition", 24, 221, 976, 221);
      out += text(
        24,
        262,
        fr
          ? "Rentes : échéances du contrat pendant les transferts"
          : "Annuities: contractual payments throughout transfers",
        { fill: "amber", maxWidth: 952 },
      );
      out += panel(
        p,
        "assets",
        24,
        295,
        654,
        62,
        fr
          ? ["Actifs repris : exercer les droits, administrer"]
          : ["Recaptured assets: enforce rights, manage"],
      );
      out += panel(
        p,
        "ma",
        712,
        295,
        264,
        146,
        fr
          ? [
              "Contrôle MA",
              "Selon agrément",
              "Flux appariés",
              "Valeur du passif",
            ]
          : [
              "MA eligibility",
              "Firm permission",
              "Flow matching",
              "Liability value",
            ],
      );
      out += arrow(p, "assets-ma", 678, 326, 712, 326);
      out +=
        route(p, "hold-entry", [
          [351, 357],
          [351, 385],
          [176, 385],
          [176, 410],
        ]) +
        route(p, "sell-entry", [
          [351, 385],
          [526, 385],
          [526, 410],
        ]);
      out += panel(
        p,
        "hold",
        24,
        410,
        304,
        144,
        fr
          ? ["Conserver", "Flux du portefeuille", "Détention durable"]
          : ["Hold assets", "Asset inflows", "Long-term holding"],
      );
      out += panel(
        p,
        "sell",
        374,
        410,
        304,
        144,
        fr
          ? ["Vendre", "Titre acquis", "Marché liquide", "Prix et frais"]
          : ["Sell assets", "Legal title", "Liquid market", "Price and costs"],
      );
      out +=
        route(p, "hold-cash", [
          [176, 554],
          [176, 564],
          [351, 564],
          [351, 574],
        ]) +
        route(
          p,
          "sell-cash",
          [
            [526, 554],
            [526, 564],
            [351, 564],
          ],
          false,
        );
      out += panel(
        p,
        "cash",
        24,
        574,
        654,
        80,
        fr
          ? [
              "Cash mobilisable aux échéances",
              "Coupons encaissés / produit de cession",
            ]
          : [
              "Cash available when payments fall due",
              "Received cash flows / sale proceeds",
            ],
      );
      out += panel(
        p,
        "facility",
        712,
        478,
        264,
        176,
        fr
          ? [
              "Lignes externes",
              "préarrangées",
              "Section C : a–d",
              "Droits existants",
            ]
          : [
              "Prearranged",
              "external lines",
              "Section C: a–d",
              "Existing rights",
            ],
      );
      out += arrow(p, "facility-cash", 712, 618, 678, 618);
      out +=
        route(
          p,
          "cash-payments",
          [
            [351, 654],
            [351, 678],
            [132, 678],
          ],
          false,
        ) + line(`${p}-outgoing-bus`, 132, 678, 570, 678, "signal");
      for (const [i, label] of (fr
        ? ["Rentes", "Marges", "Coûts"]
        : ["Annuities", "Margin calls", "Costs"]
      ).entries()) {
        const x = 24 + i * 218;
        out +=
          arrow(p, `outgoing-${i}`, x + 108, 678, x + 108, 698) +
          text(x + 108, 730, label, { anchor: "middle", maxWidth: 210 });
      }
      out += lines(
        712,
        696,
        fr
          ? ["Points bas du cash", "dans l’intervalle."]
          : ["Cash low points", "within the horizon."],
        { fill: "muted", maxWidth: 264 },
      );
    }
    return out;
  });
}
function rebalancing(lang, m) {
  return frame(lang, 3, m, ({ fr, w, p }) => {
    let out = note(
      m ? 168 : 150,
      fr
        ? [
            "LIST 2025 · central · 11 entités",
            "25 % des actifs dégradés concernés.",
            "Retour à la note initiale ; ERM exclues.",
          ]
        : [
            "LIST 2025 · core · 11 entities",
            "25% of affected downgraded assets.",
            "Restore original rating; ERM excluded.",
          ],
      w,
    );
    const x = m ? 24 : 450,
      width = m ? 552 : 500;
    out += axis(p, x, m ? 310 : 292, width, 4, [0, 1, 2, 3, 4]);
    const values = [3.4, 0.9],
      colours = ["signal", "topic-blue"];
    for (let i = 0; i < 2; i++) {
      const y = m ? 380 + i * 102 : 350 + i * 66;
      const label = fr
        ? i
          ? "Actions de gestion : 0,9"
          : "Rééquilibrage imposé : 3,4"
        : i
          ? "Management actions: 0.9"
          : "Prescribed rebalancing: 3.4";
      out += text(m ? 24 : 24, m ? y - 16 : y + 20, label, {
        fill: colours[i],
        maxWidth: m ? 552 : 410,
      });
      out += bar(
        `${p}-sales-${i}`,
        x,
        y,
        (width * values[i]) / 4,
        22,
        colours[i],
      );
    }
    out += text(
      24,
      m ? 538 : 467,
      fr
        ? "Volumes de titres sous IG · Md GBP"
        : "Sub-IG transaction volumes · GBP bn",
      { fill: "muted", maxWidth: w - 48 },
    );
    if (m) {
      out += text(
        24,
        580,
        fr ? "Vendre → acheter mieux noté" : "Sell → buy better-rated assets",
        { weight: 700, maxWidth: 552 },
      );
      out +=
        route(p, "credit-branch", [
          [300, 596],
          [300, 616],
          [157, 616],
          [157, 640],
        ]) +
        route(p, "own-funds-branch", [
          [300, 616],
          [443, 616],
          [443, 640],
        ]);
      out += panel(
        p,
        "credit",
        24,
        640,
        266,
        112,
        fr ? ["Crédit −", "SCR −"] : ["Credit risk −", "SCR −"],
      );
      out += panel(
        p,
        "own-funds",
        310,
        640,
        266,
        112,
        fr
          ? ["MA −", "Provisions +", "Fonds propres −"]
          : ["MA −", "Provisions +", "Own funds −"],
      );
      out += text(
        24,
        780,
        fr ? "Coût global : 0,8 Md GBP" : "Global cost: GBP0.8bn",
        { weight: 700, fill: "amber", maxWidth: 552 },
      );
      out += text(
        24,
        810,
        fr
          ? "Après impôt · couverture −1 point"
          : "After tax · coverage −1 point",
        { maxWidth: 552 },
      );
      out += text(
        24,
        840,
        fr
          ? "Plus large que les ventes sous IG."
          : "Wider than sub-IG sales alone.",
        { fill: "muted", maxWidth: 552 },
      );
      out += note(
        870,
        fr
          ? ["Reprise : collatéral exclu des 25 %."]
          : ["Recapture: collateral outside the 25%."],
        w,
      );
    } else {
      out += panel(
        p,
        "sell",
        24,
        498,
        450,
        56,
        fr ? ["Vendre des titres dégradés"] : ["Sell lower-rated securities"],
      );
      out += panel(
        p,
        "buy",
        526,
        498,
        450,
        56,
        fr ? ["Acheter mieux noté"] : ["Buy better-rated assets"],
      );
      out += arrow(p, "sell-buy", 474, 526, 526, 526);
      out +=
        route(p, "credit-branch", [
          [751, 554],
          [751, 580],
          [249, 580],
          [249, 594],
        ]) + arrow(p, "own-funds-branch", 751, 580, 751, 594);
      out += panel(
        p,
        "credit",
        24,
        594,
        450,
        80,
        fr ? ["Risque de crédit − ; SCR −"] : ["Credit risk −; SCR −"],
      );
      out += panel(
        p,
        "own-funds",
        526,
        594,
        450,
        80,
        fr
          ? ["MA − ; provisions +", "Fonds propres admissibles −"]
          : ["MA −; provisions +", "Eligible own funds −"],
      );
      out += lines(
        24,
        700,
        fr
          ? [
              "Coût global : 0,8 Md GBP après impôt ; couverture −1 point.",
              "Périmètre plus large que les seules ventes sous IG.",
            ]
          : [
              "Global cost: GBP0.8bn after tax; coverage −1 point.",
              "Wider scope than sub-IG sales alone.",
            ],
        { fill: "amber", maxWidth: 952, leading: 32 },
      );
    }
    return out;
  });
}
export function insuranceRecaptureSvg(lang, kind, mobile = false) {
  if (
    typeof lang !== "string" ||
    !["fr", "en"].includes(lang) ||
    typeof kind !== "string" ||
    !INSURANCE_RECAPTURE_KINDS.includes(kind) ||
    typeof mobile !== "boolean"
  )
    throw new TypeError("Invalid insurance recapture scene");
  return { branches, ratio, payments, rebalancing }[kind](lang, mobile);
}
