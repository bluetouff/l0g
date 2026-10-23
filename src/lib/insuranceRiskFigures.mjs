// Closed, bilingual documentary scenes. No live data, external assets or dynamic markup.
export const INSURANCE_RISK_KINDS = Object.freeze([
  "resources",
  "contract",
  "clo",
  "valuations",
]);
export const INSURANCE_RISK_SOURCES = Object.freeze([
  "02 03",
  "02 07 08",
  "09 12 11",
  "17",
]);
const COPY = {
  fr: [
    [
      "Réassurance : le calcul PRA",
      "Projet PRA publié le 29 avril 2026, état documentaire au 23 octobre. Pour 1 milliard de livres d’engagements de rente : traitement actuel de la réassurance financée, 20 à 40 millions ; placements économiquement similaires, 110 à 150 millions ; cas moyen du projet, environ 100 millions. Normalisation l0g des pourcentages publiés, avec une échelle commune de zéro à 160 millions de livres. Les fourchettes sont des estimations publiées, pas des intervalles de confiance ni des transactions observées. Total : CDA, SCR et marge de risque. Un CDA plus élevé diminue la valeur de la créance, donc les fonds propres disponibles à passif inchangé. Le SCR reste une exigence distincte ; la marge de risque relève des provisions. Application proposée le 1er juillet 2027, aucune décision finale identifiée dans les recherches arrêtées au 23 octobre 2026.",
    ],
    [
      "Le contrat transforme la note",
      "Projet PRA du 29 avril 2026. Point de départ : note de solidité financière IFS du réassureur. Préalable à tout cran : collatéral accessible, séparé et protégé des droits de tiers, titres émis par le réassureur ou ses apparentées exclus. Trois améliorations indépendantes d’un cran au maximum, sous conditions : collatéral au moins égal à 100 % de la prime, dont les variations se limitent aux marchés et aux prestations restant dues ; flux dans la même monnaie sans décalage matériel et tous les actifs couverts par l’autorisation de matching adjustment du cédant ; qualité de crédit moyenne pondérée supérieure à celle du réassureur. Les critères deux et trois portent sur le pire portefeuille autorisé par le traité : qualité minimale et décalages de flux maximaux. Qualité retenue : IFS plus zéro à trois crans. Exemple pédagogique : A+ vers AA− pour un cran. La qualité retenue et l’échéance de chaque flux déterminent le fundamental spread des obligations financières, puis le CDA réduit la valeur de la créance et les fonds propres disponibles à passif inchangé. Le SCR demeure distinct. Les flèches sont des relations sans échelle monétaire ; les crans ne sont pas une nouvelle note attribuée par une agence.",
    ],
    [
      "CLO : la structure change le barème",
      "Règles NAIC adoptées le 14 août 2026 pour la clôture du 31 décembre 2026. Assiette illustrative commune de 100 millions de dollars, valeur comptable ou ajustée. Charges C-1 de base avant impôt : autres obligations puis CLO/CBO/CDO, respectivement 0,816 et 0,170 million en A / NAIC 1.F ; 1,523 et 3,240 millions en BBB / 2.B ; 4,537 et 25,150 millions en BB / 3.B. Barres depuis zéro, échelle commune de zéro à 30 millions. Le schéma de pertes montre l’attachement AP puis le détachement DP d’une tranche, sans fixer de seuil numérique ; une épaisseur actuelle DP moins AP inférieure ou égale à 4 % du pool définit le cas mince. Pour une tranche BSL CLO BBB− / 2.C, 3,28 % plus 11,77 points donnent 15,05 %, soit 15,05 millions sur une position illustrative de 100 millions. Les montants précèdent les ajustements de portefeuille, concentration, fiscalité et agrégation. Ils ne représentent ni le besoin total de capital du contrat ni une comparaison à risque identique.",
    ],
    [
      "IAIS : neuf valorisations",
      "Exercice IAIS publié en novembre 2025, valorisations au 31 décembre 2023. Neuf assureurs et réassureurs volontaires de plusieurs juridictions ont valorisé un échéancier hypothétique commun d’annuités en dollars, avec portefeuilles et certaines hypothèses choisis. Fourchettes publiées en millions de dollars : provisions techniques de 52 à 60 ; actifs requis prescrits de 53 à 68 ; actifs cibles de 54 à 74. Échelle commune de zéro à 80. Les bandes représentent des minima et maxima entre participants, pas des observations individuelles. Les bornes ne sont pas appariées entre lignes et les trois lignes ne s’additionnent pas. L’amplitude du total prescrit est de 68 moins 53, soit 15 millions. La dispersion mêle régime, actifs et choix de modèle. Participants et juridictions anonymisés ; aucun classement de pays ou écart individuel de capital ne peut en être déduit. Exercice exploratoire, pas un tarif prudentiel de 2026 ni une économie par transaction.",
    ],
  ],
  en: [
    [
      "Reinsurance: the PRA calculation",
      "PRA proposal published 29 April 2026; documentary cutoff 23 October. For £1 billion of underlying annuity liabilities: current funded reinsurance treatment £20–40 million; economically similar investments £110–150 million; proposed average case about £100 million. l0g normalization of published percentages on a common zero-to-£160-million scale. Published estimate ranges, not confidence intervals or observed deals. Total includes CDA, SCR and risk margin. Higher CDA reduces the recognized reinsurance receivable, reducing available own funds with liabilities unchanged. SCR remains a separate requirement; risk margin is part of provisions. Proposed application 1 July 2027; no final decision identified in searches through 23 October 2026.",
    ],
    [
      "The contract transforms the rating",
      "PRA proposal of 29 April 2026. Starting point: reinsurer financial strength rating, IFS. A prerequisite for every notch is accessible, segregated collateral protected from competing third-party claims, excluding securities issued by the reinsurer or its affiliates. Up to three independent one-notch uplifts, subject to conditions: collateral at least 100% of premium, varying only with markets and outstanding claims; same-currency cash flows without material mismatch and all assets within the cedant’s matching adjustment permission; weighted-average credit quality better than the reinsurer. Tests two and three use the worst portfolio permitted by the treaty: lowest credit quality and greatest cash-flow mismatches. Effective quality is IFS plus zero to three notches. Pedagogical one-notch example: A+ to AA−. Effective quality and each cash flow’s maturity determine the fundamental spread for financial bonds; CDA then reduces the receivable and, with liabilities unchanged, available own funds. SCR remains distinct. Arrows show relationships without monetary scale; uplifts do not create a new agency rating.",
    ],
    [
      "CLOs: structure changes the factor",
      "NAIC rules adopted 14 August 2026 for year-end 31 December 2026 reporting. Common illustrative US$100 million book/adjusted carrying value. Pre-tax C-1 base charges for other bonds then CLO/CBO/CDO instruments respectively: US$0.816m and US$0.170m for A / NAIC 1.F; US$1.523m and US$3.240m for BBB / 2.B; US$4.537m and US$25.150m for BB / 3.B. All bars start at zero on a common zero-to-US$30m scale. Loss diagram identifies attachment AP and detachment DP without numerical loss thresholds. Current thickness DP minus AP at most 4% of the pool defines the thin case. A BBB− / 2.C BSL CLO tranche receives 3.28% base plus 11.77 percentage points, totaling 15.05%, or US$15.05m on a hypothetical US$100m position. Before portfolio, concentration, tax and aggregation adjustments. These amounts are neither total policy capital nor a comparison of identical risk.",
    ],
    [
      "IAIS: nine valuations",
      "IAIS exercise published November 2025, valuations as of 31 December 2023. Nine voluntary insurers and reinsurers in several jurisdictions valued a common hypothetical US-dollar annuity cash-flow schedule with portfolios and some assumptions of their choice. Published US$ million ranges: technical provisions 52–60; prescribed total assets 53–68; target total assets 54–74. Common zero-to-80 scale. Bands are participant minima and maxima, not individual observations. Endpoints are not paired across rows and the three rows cannot be added. Prescribed-assets range width is 68 minus 53, or US$15m. Variation combines regimes, assets and modelling choices. Participants and jurisdictions are anonymous; the ranges support neither country rankings nor individual capital-buffer comparisons. Exploratory exercise, not a 2026 regulatory tariff or per-deal saving.",
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
      "font-family": "l0g Insurance Risk",
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
  { fill = "paper", leading = 34 } = {},
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
function frame(lang, i, m, h, body) {
  const fr = lang === "fr",
    w = m ? 600 : 1000,
    p = `insurance-risk-${lang}-f${i + 1}-${m ? "m" : "d"}`;
  const title = fr
    ? [
        "Réassurance : le calcul PRA",
        "Le contrat transforme la note",
        "CLO : la structure change le barème",
        "IAIS : neuf valorisations",
      ][i]
    : [
        "Reinsurance: the PRA calculation",
        "The contract transforms the rating",
        "CLOs: structure changes the factor",
        "IAIS: nine valuations",
      ][i];
  const titleLines =
    m && i === 0 && !fr
      ? ["Reinsurance: the PRA", "calculation"]
      : m && i === 2
        ? fr
          ? ["CLO : la structure", "change le barème"]
          : ["CLOs: structure", "changes the factor"]
        : m && i === 1
          ? fr
            ? ["Le contrat transforme", "la note"]
            : ["The contract transforms", "the rating"]
          : [title];
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" style="width:100%;height:auto" class="l0g-insurance-risk-svg" role="img" aria-labelledby="${p}-title ${p}-desc"><title id="${p}-title">${esc(COPY[lang][i][0])}</title><desc id="${p}-desc">${esc(COPY[lang][i][1])}</desc><defs><marker id="${p}-signal-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="10" markerHeight="10" orient="auto" markerUnits="userSpaceOnUse"><path d="M 1 1 L 9 5 L 1 9" fill="none" stroke="var(--color-signal)" stroke-width="2.5"></path></marker></defs>` +
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
    INSURANCE_RISK_SOURCES[i]
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
function axis(p, x, y, width, max, ticks) {
  return (
    line(`${p}-axis`, x, y, x + width, y) +
    ticks
      .map(
        (v) =>
          line(
            `${p}-tick-${v}`,
            x + (width * v) / max,
            y - 4,
            x + (width * v) / max,
            y,
          ) +
          text(x + (width * v) / max, y - 16, String(v), {
            anchor: v === 0 ? "start" : v === max ? "end" : "middle",
            fill: "muted",
          }),
      )
      .join("")
  );
}
const fmt = (v, fr, d = 0) =>
  v
    .toLocaleString(fr ? "fr-FR" : "en-US", {
      minimumFractionDigits: d,
      maximumFractionDigits: d,
    })
    .replaceAll("\u202f", " ");
function resources(lang, m) {
  return frame(lang, 0, m, m ? 930 : 780, ({ fr, w, p }) => {
    let out = lines(
      24,
      m ? 176 : 145,
      fr
        ? [
            m ? "Projet PRA · millions GBP" : "Projet PRA · 29.04.2026",
            "Base : 1 MdGBP d’engagements",
          ]
        : [
            m ? "PRA proposal · GBP million" : "PRA proposal · 29.04.2026",
            "Base: GBP1bn annuity liabilities",
          ],
      { fill: "muted", maxWidth: w - 48 },
    );
    const x = m ? 24 : 332,
      width = m ? 552 : 620,
      ay = m ? 266 : 224;
    out +=
      (!m
        ? text(24, 208, fr ? "Millions GBP" : "GBP million", {
            fill: "muted",
            maxWidth: 285,
          })
        : "") + axis(p, x, ay, width, 160, [0, 40, 80, 120, 160]);
    const rows = fr
      ? [
          ["Réassurance : actuel", "20–40"],
          ["Placements similaires", "110–150"],
          ["Réassurance : projet", "env. 100"],
        ]
      : [
          ["Reinsurance: current", "20–40"],
          ["Similar investments", "110–150"],
          ["Reinsurance: proposal", "about 100"],
        ];
    rows.forEach(([label, value], i) => {
      const y = m ? 292 + i * 130 : 278 + i * 98,
        by = m ? y + 30 : y + 18;
      out += m
        ? text(24, y, label, { weight: 700, maxWidth: 552 })
        : lines(
            24,
            y,
            (fr
              ? [
                  ["Réassurance", "actuelle"],
                  ["Placements", "similaires"],
                  ["Projet", "cas moyen"],
                ]
              : [
                  ["Current", "reinsurance"],
                  ["Similar", "investments"],
                  ["Proposed", "average case"],
                ])[i],
            { weight: 700, maxWidth: 285 },
          );
      const vals = [
          [20, 40],
          [110, 150],
          [100, 100],
        ][i],
        c = ["signal", "topic-blue", "amber"][i];
      out += line(
        `${p}-zero-${i}`,
        x,
        by + 12,
        x + (width * vals[0]) / 160,
        by + 12,
        c,
        { "stroke-dasharray": "8 7" },
      );
      if (i < 2)
        out +=
          bar(
            `${p}-range-${i}`,
            x + (width * vals[0]) / 160,
            by,
            (width * (vals[1] - vals[0])) / 160,
            24,
            c,
          ) +
          line(
            `${p}-low-${i}`,
            x + (width * vals[0]) / 160,
            by - 6,
            x + (width * vals[0]) / 160,
            by + 30,
            c,
          ) +
          line(
            `${p}-high-${i}`,
            x + (width * vals[1]) / 160,
            by - 6,
            x + (width * vals[1]) / 160,
            by + 30,
            c,
          );
      else
        out += rect(
          `${p}-point`,
          x + (width * 100) / 160 - 4,
          by - 4,
          8,
          32,
          "amber",
          0,
        );
      out += text(
        x + (width * (vals[0] + vals[1])) / 320,
        m ? by + 65 : by - 18,
        value,
        { anchor: "middle", weight: 700, fill: c },
      );
    });
    const y = m ? 728 : 566,
      cw = m ? 168 : 286,
      xs = m ? [24, 216, 408] : [24, 357, 690];
    const cells = fr
      ? [
          ["CDA +", "Valeur −"],
          ["Passif =", "Actif −"],
          ["Fonds", "propres−"],
        ]
      : m
        ? [
            ["CDA +", "Claim −"],
            ["Liab. =", "Assets −"],
            ["Own", "funds −"],
          ]
        : [
            ["CDA +", "Receivable −"],
            ["Liabilities =", "Assets −"],
            ["Own", "funds −"],
          ];
    xs.forEach((x, i) => {
      out += panel(p, `effect-${i}`, x, y, cw, 98, cells[i]);
      if (i < 2)
        out += arrow(
          p,
          `effect-arrow-${i}`,
          x + cw + 6,
          y + 48,
          xs[i + 1] - 10,
          y + 48,
        );
    });
    out += lines(
      24,
      m ? 864 : 704,
      fr
        ? ["Total : CDA + SCR + marge de risque."]
        : ["Total: CDA + SCR + risk margin."],
      { fill: "muted", maxWidth: w - 48 },
    );
    return out;
  });
}
function contract(lang, m) {
  return frame(lang, 1, m, m ? 930 : 790, ({ fr, w, p }) => {
    let out = "";
    if (m) {
      out += text(
        24,
        176,
        fr ? "Projet PRA · IFS du réassureur" : "PRA proposal · reinsurer IFS",
        { fill: "muted", maxWidth: 552 },
      );
      out += panel(
        p,
        "gate",
        24,
        202,
        552,
        126,
        fr
          ? [
              "Collatéral accessible et séparé.",
              "Droits tiers et titres émis par",
              "réassureur/apparentés exclus.",
            ]
          : [
              "Accessible, segregated collateral.",
              "No competing third-party claims.",
              "Reinsurer/affiliate issues excluded.",
            ],
      );
      const rows = fr
        ? [
            ["1 · Montant : 100 % minimum", "Marchés / prestations dues"],
            ["2 · Flux appariés, actifs MA", "Même monnaie ; flux appariés"],
            [
              "3 · Qualité de crédit moyenne",
              "Supérieure à celle du réassureur",
            ],
          ]
        : [
            [
              "1 · At least 100% of premium",
              "Markets / outstanding claims only",
            ],
            ["2 · Matched flows, MA assets", "Same currency; matched flows"],
            ["3 · Average credit quality", "Better than reinsurer IFS"],
          ];
      out +=
        line(`${p}-gate-rail`, 24, 315, 12, 315, "signal") +
        line(`${p}-gate-bus`, 12, 315, 12, 530, "signal");
      rows.forEach((r, i) => {
        const y = 350 + i * 90;
        out +=
          arrow(p, `condition-arrow-${i}`, 12, y, 22, y) +
          line(`${p}-score-branch-${i}`, 576, y + 17, 588, y + 17, "signal") +
          lines(24, y, r, { maxWidth: 475, leading: 34 }) +
          text(576, y, "+1", { anchor: "end", weight: 700, fill: "signal" });
      });
      out +=
        line(`${p}-worst-bracket`, 24, 588, 576, 588, "accent") +
        lines(
          24,
          628,
          fr
            ? [
                "Tests 2–3 : pire portefeuille permis.",
                "Qualité minimale, écarts maximaux.",
              ]
            : [
                "Tests 2–3: worst permitted portfolio.",
                "Lowest quality, greatest mismatches.",
              ],
          { fill: "accent", maxWidth: 552 },
        );
      out +=
        line(`${p}-score-bus`, 588, 367, 588, 700, "signal") +
        arrow(p, "effective-arrow", 588, 700, 300, 700) +
        text(
          300,
          736,
          fr ? "IFS + 0 à 3 crans · A+ → AA−" : "IFS + 0–3 notches · A+ → AA−",
          { anchor: "middle", weight: 700, maxWidth: 552 },
        );
      out += lines(
        24,
        788,
        fr
          ? [
              "Qualité + échéance → spread financier",
              "→ CDA → créance − → fonds propres −",
              "À passif inchangé · SCR distinct",
            ]
          : [
              "Quality + maturity → financial spread",
              "→ CDA → claim − → own funds −",
              "Liabilities unchanged · SCR separate",
            ],
        { maxWidth: 552, leading: 34 },
      );
    } else {
      out += text(
        24,
        148,
        fr
          ? "Projet PRA · 29.04.2026 · relations sans échelle monétaire"
          : "PRA proposal · 29.04.2026 · relationships without monetary scale",
        { fill: "muted", maxWidth: 952 },
      );
      out += panel(
        p,
        "ifs",
        24,
        180,
        212,
        100,
        fr ? ["Note IFS du", "réassureur"] : ["Reinsurer", "IFS rating"],
      );
      out +=
        arrow(p, "gate-arrow", 246, 230, 290, 230) +
        panel(
          p,
          "gate",
          306,
          180,
          670,
          100,
          fr
            ? [
                "Collatéral séparé ; accès, droits tiers exclus.",
                "Réassureur/apparentés : titres émis exclus.",
              ]
            : [
                "Accessible, segregated; no third-party rights.",
                "Reinsurer/affiliate issues excluded.",
              ],
        );
      const rows = fr
        ? [
            ["1 · Montant", "100 % minimum", "Marchés / sinistres"],
            ["2 · Flux / MA", "Même monnaie", "Décalage maîtrisé"],
            ["3 · Crédit", "Qualité moyenne", "Meilleure que l’IFS"],
          ]
        : [
            ["1 · Amount", "100% minimum", "Markets / claims"],
            ["2 · Flows / MA", "Same currency", "Matched flows"],
            ["3 · Credit quality", "Weighted average", "Better than the IFS"],
          ];
      rows.forEach((r, i) => {
        const x = 24 + i * 326;
        out +=
          panel(p, `test-${i}`, x, 326, 300, 148, r) +
          text(x + 284, 460, "+1", {
            anchor: "end",
            weight: 700,
            fill: "signal",
            panel: `${p}-test-${i}`,
          });
      });
      out +=
        line(`${p}-gate-stem`, 642, 280, 642, 302, "signal") +
        line(`${p}-gate-bus`, 174, 302, 826, 302, "signal") +
        [174, 500, 826]
          .map((x, i) => arrow(p, `condition-arrow-${i}`, x, 302, x, 316))
          .join("") +
        line(`${p}-worst-bracket`, 350, 494, 976, 494, "accent") +
        text(
          663,
          530,
          fr
            ? "Tests 2–3 : pire portefeuille permis"
            : "Tests 2–3: worst permitted portfolio",
          { anchor: "middle", fill: "accent", maxWidth: 626 },
        );
      out += text(
        24,
        574,
        fr
          ? "IFS + 0 à 3 crans · exemple : A+ → AA− pour un cran"
          : "IFS + 0–3 notches · example: A+ → AA− for one notch",
        { weight: 700, maxWidth: 952 },
      );
      const xs = [24, 274, 524, 774],
        cells = fr
          ? [
              ["Qualité", "retenue +", "échéance"],
              ["Spread des", "financières"],
              ["CDA", "Créance −"],
              ["Passif =", "Fonds", "propres−"],
            ]
          : [
              ["Quality +", "maturity"],
              ["Financial", "bond", "spread"],
              ["CDA", "Claim −"],
              ["Liab. =", "Own funds", "lower"],
            ];
      xs.forEach((x, i) => {
        out += panel(p, `valuation-${i}`, x, 600, 202, 116, cells[i]);
        if (i < 3)
          out += arrow(
            p,
            `valuation-arrow-${i}`,
            x + 212,
            650,
            xs[i + 1] - 10,
            650,
          );
      });
    }
    return out;
  });
}
function clo(lang, m) {
  return frame(lang, 2, m, m ? 930 : 790, ({ fr, w, p }) => {
    let out = text(
      24,
      m ? 176 : 148,
      fr
        ? m
          ? "Clôture 2026 · C-1 · base 100 M$"
          : "Clôture 2026 · C-1 avant impôt · base 100 M$"
        : m
          ? "Year-end 2026 · C-1 · base $100m"
          : "Year-end 2026 · pre-tax C-1 · base $100m",
      { fill: "muted", maxWidth: w - 48 },
    );
    out +=
      bar(`${p}-legend-other`, 24, m ? 198 : 176, 10, 24, "topic-blue") +
      text(46, m ? 220 : 198, fr ? "Autres obligations" : "Other bonds", {
        fill: "topic-blue",
      }) +
      bar(`${p}-legend-clo`, m ? 326 : 430, m ? 198 : 176, 10, 24, "signal") +
      text(m ? 348 : 452, m ? 220 : 198, "CLO/CBO/CDO", { fill: "signal" });
    const x = m ? 146 : 300,
      width = m ? 324 : 650,
      ay = m ? 272 : 248;
    out += axis(p, x, ay, width, 30, [0, 10, 20, 30]);
    const vals = [
        [0.816, 0.17],
        [1.523, 3.24],
        [4.537, 25.15],
      ],
      labels = ["A / 1.F", "BBB / 2.B", "BB / 3.B"];
    vals.forEach((v, i) => {
      const y = m ? 308 + i * 84 : 282 + i * 84;
      out += m
        ? lines(
            24,
            y + 14,
            [
              ["A", "1.F"],
              ["BBB", "2.B"],
              ["BB", "3.B"],
            ][i],
            { weight: 700, maxWidth: 112, leading: 30 },
          )
        : text(24, y + 22, labels[i], { weight: 700, maxWidth: 250 });
      v.forEach((value, j) => {
        out +=
          bar(
            `${p}-factor-${i}-${j}`,
            x,
            y + j * 30,
            (width * value) / 30,
            18,
            j ? "signal" : "topic-blue",
          ) +
          text(
            x + (width * value) / 30 + 10,
            y + 16 + j * 30,
            fmt(value, fr, 3),
            { fill: j ? "signal" : "topic-blue" },
          );
      });
    });
    out += text(
      24,
      m ? 558 : 544,
      fr
        ? "Charges de base · M$ · origine zéro"
        : "Base charges · $m · zero origin",
      { fill: "muted", maxWidth: w - 48 },
    );
    const y = m ? 614 : 596,
      ax = m ? 100 : 150,
      bx = m ? 392 : 710,
      ey = m ? 642 : 628;
    out +=
      arrow(p, "loss", 24, ey, w - 24, ey) +
      bar(`${p}-thin-tranche`, ax, ey - 12, bx - ax, 24, "amber") +
      line(`${p}-attachment`, ax, ey - 26, ax, ey + 26, "amber") +
      line(`${p}-detachment`, bx, ey - 26, bx, ey + 26, "amber") +
      text(ax, y, "AP", { fill: "amber", anchor: "middle" }) +
      text(bx, y, "DP", { fill: "amber", anchor: "middle" }) +
      text(w - 24, y, fr ? "Pertes" : "Losses", {
        anchor: "end",
        fill: "muted",
      });
    out += text(
      24,
      m ? 694 : 686,
      fr
        ? m
          ? "DP − AP : 4 % du pool au maximum"
          : "DP − AP : 4 % du pool au maximum · sans échelle"
        : m
          ? "DP − AP: at most 4% of the pool"
          : "DP − AP: at most 4% of pool · unscaled",
      { fill: "muted", maxWidth: w - 48 },
    );
    if (m)
      out += text(
        24,
        728,
        fr ? "Seuils sans échelle de pertes." : "Unscaled loss thresholds.",
        { fill: "muted", maxWidth: 552 },
      );
    out += text(
      24,
      m ? 776 : 730,
      fr
        ? m
          ? "3,28 + 11,77 = 15,05 %"
          : "BBB− / 2.C : 3,28 + 11,77 = 15,05 %"
        : m
          ? "3.28 + 11.77 = 15.05%"
          : "BBB− / 2.C: 3.28 + 11.77 = 15.05%",
      { weight: 700, fill: "amber", maxWidth: w - 48 },
    );
    if (m)
      out += lines(
        24,
        820,
        fr
          ? [
              "BSL CLO BBB− / 2.C : 15,05 M$",
              "Sur 100 M$, avant ajustements RBC.",
            ]
          : [
              "BSL CLO BBB− / 2.C: $15.05m",
              "On $100m, before RBC adjustments.",
            ],
        { fill: "muted", maxWidth: 552 },
      );
    return out;
  });
}
function valuations(lang, m) {
  return frame(lang, 3, m, m ? 900 : 760, ({ fr, w, p }) => {
    let out = lines(
      24,
      145,
      fr
        ? m
          ? [
              "9 participants volontaires",
              "Flux hypothétiques en dollars",
              "Valeurs : 31.12.2023 · pub. 11.2025",
            ]
          : [
              "9 participants volontaires · flux hypothétiques $",
              "Valeurs : 31.12.2023 · publication : 11.2025",
            ]
        : m
          ? [
              "9 voluntary participants",
              "Hypothetical US-dollar flows",
              "Values: 31.12.2023 · pub. 11.2025",
            ]
          : [
              "9 voluntary participants · hypothetical $ flows",
              "Values: 31.12.2023 · publication: 11.2025",
            ],
      { fill: "muted", maxWidth: w - 48 },
    );
    const x = m ? 24 : 340,
      width = m ? 552 : 610,
      ay = m ? 270 : 240;
    out += axis(p, x, ay, width, 80, [0, 20, 40, 60, 80]);
    const labels = fr
        ? ["Provisions techniques", "Actifs requis prescrits", "Actifs cibles"]
        : [
            "Technical provisions",
            "Prescribed total assets",
            "Target total assets",
          ],
      ranges = [
        [52, 60],
        [53, 68],
        [54, 74],
      ],
      cols = ["signal", "topic-blue", "accent"];
    ranges.forEach(([lo, hi], i) => {
      const y = m ? 300 + i * 128 : 294 + i * 102,
        by = m ? y + 30 : y + 18;
      out +=
        (m
          ? text(24, y, labels[i], { weight: 700, maxWidth: 552 })
          : lines(
              24,
              y,
              (fr
                ? [
                    ["Provisions", "techniques"],
                    ["Actifs requis", "prescrits"],
                    ["Actifs cibles"],
                  ]
                : [
                    ["Technical", "provisions"],
                    ["Prescribed", "total assets"],
                    ["Target total assets"],
                  ])[i],
              { weight: 700, maxWidth: 300 },
            )) +
        line(
          `${p}-zero-${i}`,
          x,
          by + 12,
          x + (width * lo) / 80,
          by + 12,
          cols[i],
          { "stroke-dasharray": "8 7" },
        ) +
        bar(
          `${p}-range-${i}`,
          x + (width * lo) / 80,
          by,
          (width * (hi - lo)) / 80,
          24,
          cols[i],
        ) +
        line(
          `${p}-low-${i}`,
          x + (width * lo) / 80,
          by - 6,
          x + (width * lo) / 80,
          by + 30,
          cols[i],
        ) +
        line(
          `${p}-high-${i}`,
          x + (width * hi) / 80,
          by - 6,
          x + (width * hi) / 80,
          by + 30,
          cols[i],
        ) +
        text(
          x + (width * (lo + hi)) / 160,
          m ? by + 65 : by - 18,
          `${lo}–${hi} ${fr ? "M$" : "$m"}`,
          { anchor: "middle", weight: 700, fill: cols[i] },
        );
    });
    out += lines(
      24,
      m ? 738 : 622,
      fr
        ? [
            "Bornes non appariées entre lignes.",
            "Amplitude : 68 − 53 = 15 M$",
            "Régime, actifs et modèle mêlés.",
          ]
        : [
            "Endpoints not paired across rows.",
            "Prescribed width: 68 − 53 = $15m.",
            "Regimes, assets and models combine.",
          ],
      { fill: "muted", maxWidth: w - 48, leading: 34 },
    );
    return out;
  });
}
export function insuranceRiskSvg(lang, kind, mobile = false) {
  if (
    typeof lang !== "string" ||
    !["fr", "en"].includes(lang) ||
    typeof kind !== "string" ||
    !INSURANCE_RISK_KINDS.includes(kind) ||
    typeof mobile !== "boolean"
  )
    throw new TypeError("Invalid insurance risk scene");
  return { resources, contract, clo, valuations }[kind](lang, mobile);
}
