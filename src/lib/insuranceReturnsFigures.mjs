// Closed bilingual scenes. Product projections, half-year results and fee streams keep distinct scopes.
export const INSURANCE_RETURNS_KINDS = Object.freeze([
  "contracts",
  "liquidity",
  "athene",
  "kkr",
]);
export const INSURANCE_RETURNS_SOURCES = Object.freeze([
  "01 02 04 05 09",
  "01 02 03 04 05",
  "13",
  "20",
]);
const COPY = {
  fr: [
    [
      "Deux contrats sur cinq ans",
      "Comparaison documentaire pour une prime de 150 000 dollars, à 60 ans en Floride. Athene MaxRate 5 : 6,05 % par an, carte du 14 octobre 2026. SecureFore II 5 : 6,00 %, carte du 12 octobre 2026. Calcul l0g par capitalisation annuelle : 150 000 × (1 + taux) puissance cinq. Valeurs finales de 201 207,71 et 200 733,84 dollars ; écart calculé avant arrondis de 473,88 dollars. Hypothèse de conservation cinq ans, sans retrait ni versement complémentaire, avant impôt et après expiration effective de la période de frais. Cartes publiques à des dates distinctes, sans devis personnalisé simultané. Convention MaxRate contrôlée dans une illustration historique de 2023. Barres empilées depuis zéro : prime initiale et intérêts calculés, échelle commune.",
    ],
    [
      "Le prix de la disponibilité",
      "Athene MaxRate 5 : franchise annuelle égale au taux multiyear de 6,05 % multiplié par la valeur accumulée au plus récent anniversaire du contrat ; droit ouvert dès la première année, base initiale distincte non précisée dans la brochure actuelle. SecureFore II 5 : 10 % de la prime initiale en première année, puis 10 % de la valeur au début de l’année. Floride, frais de retrait sur les montants concernés au-delà de la franchise : Athene 10 %, 10 %, 10 %, 10 %, 10 % ; SecureFore II 8 %, 8 %, 7 %, 6 %, 5 % pour les années une à cinq. Barres depuis zéro sur une échelle commune. Pendant la période de frais, l’ajustement de valeur de marché lié aux taux peut majorer ou réduire le montant reçu au-delà de la franchise. Son montant reste non calculé. Les clauses et les dates de sortie gouvernent le résultat.",
    ],
    [
      "La formation du résultat d’Athene",
      "Premier semestre 2026, millions de dollars US, montants semestriels non annualisés. Vue non-GAAP de la direction d’Athene Holding Ltd., retenant la quote-part économique d’Athene dans ACRA. 7 795 de revenus nets des placements, plus 73 de frais de gestion stratégique reçus par Athene, moins 5 749 de coût agrégé des engagements, donnent 2 119 de marge sur placements. Après déduction de 229 d’autres charges opérationnelles et de 294 de financement, le résultat SRE avant impôt est de 1 596. Barres flottantes à échelle commune. Pour S1 2025 puis S1 2026, rendement gagné annualisé : 5,14 % puis 5,16 % ; coût des engagements : 3,57 % puis 3,80 % ; SRE : 1 624 puis 1 596 millions. Le coût des engagements agrège intérêts, options, provisions et amortissements. Le taux de coût des engagements diffère du taux contractuel crédité aux assurés. Les 785 millions de frais Apollo, sur un périmètre ACRA incluant les minoritaires, sont déjà comptabilisés dans les revenus nets GAAP : aucune seconde déduction ni addition aux 7 795 pour reconstituer un revenu brut.",
    ],
    [
      "Les quatre composantes de la contribution assurance de KKR",
      "Premier semestre 2026, millions de dollars US. Mesure élargie non-GAAP définie par KKR : 548,550 de résultat opérationnel de l’assurance avant impôt, 289,460 de frais de gestion payés par l’assurance nets de rémunération FRE, 125,578 de frais de sidecars nets de rémunération FRE et 33,817 de frais d’opérations de marché liés à Global Atlantic nets de rémunération FRE, soit 997,405. Barre empilée à l’échelle ; milliers publiés divisés par 1 000. Le résultat de l’assurance tient déjà compte des frais de gestion supportés par ce segment. Frais de gestion bruts 350,860 moins 61,400 de rémunération FRE calculée par différence donnent 289,460. La rémunération FRE exclut la rémunération en actions. Des tiers rémunèrent KKR pour la gestion des actifs d’Ivy et des sidecars associés. Les opérations de marché sont facilitées ou soutenues par Global Atlantic. La mesure assemble un résultat avant impôt et des frais nets de rémunération FRE, avant allocation de tous les autres frais généraux du gestionnaire et impôts.",
    ],
  ],
  en: [
    [
      "Two five-year contracts",
      "Documentary comparison for a US$150,000 premium, age 60 in Florida. Athene MaxRate 5: 6.05% a year, 14 October 2026 rate card. SecureFore II 5: 6.00%, 12 October 2026 rate card. l0g calculation with annual compounding: 150,000 × (1 + rate) to the fifth power. Final values US$201,207.71 and US$200,733.84; difference US$473.88 calculated before rounding. Five-year holding assumption, no withdrawals or additional premiums, before tax and after the charge period has actually expired. Public rate cards have different dates; these are not simultaneous personalized quotes. MaxRate convention cross-checked against a historical 2023 illustration. Stacked bars start at zero and show initial premium and calculated interest on a common scale.",
    ],
    [
      "The price of access",
      "Athene MaxRate 5: annual free-withdrawal amount equals the 6.05% multiyear rate times accumulated value at the most recent contract anniversary. The right begins in year one; the current brochure does not separately specify its first-year reference base. SecureFore II 5: 10% of the initial premium in year one, then 10% of beginning-year contract value. Florida withdrawal charges on applicable amounts above the allowance are 10%, 10%, 10%, 10%, 10% for Athene and 8%, 8%, 7%, 6%, 5% for SecureFore II in years one to five. Bars start at zero on a common scale. During the charge period, the rate-linked market value adjustment can increase or reduce proceeds above the allowance. Its amount is not calculated. Contract terms and exit dates determine the outcome.",
    ],
    [
      "Athene’s earnings bridge",
      "First half of 2026, US$ million, half-year amounts not annualized. Athene Holding Ltd. management non-GAAP view retaining Athene’s economic share of ACRA. Net investment earnings 7,795 plus strategic capital management fees received by Athene 73 less aggregate cost of funds 5,749 produce net investment spread 2,119. After other operating expenses 229 and financing costs 294, pre-tax spread-related earnings are 1,596. Floating bars use a common scale. H1 2025 then H1 2026: annualized investment earned rate 5.14% then 5.16%, cost of funds 3.57% then 3.80%, SRE US$1,624m then US$1,596m. Cost of funds combines interest, options, reserves and amortization, and differs from individual policy crediting rates. The US$785m Apollo fee figure includes ACRA minority interests and is already reflected in GAAP net investment income: it is neither deducted twice nor added to 7,795 to reconstruct gross income.",
    ],
    [
      "KKR’s four insurance contribution components",
      "First half of 2026, US$ million. KKR-defined broader non-GAAP measure: pre-tax insurance operating earnings 548.550, insurance-paid management fees net of FRE compensation 289.460, sidecar fees net of FRE compensation 125.578 and Global Atlantic-related capital-markets fees net of FRE compensation 33.817, totaling 997.405. Stacked bar to scale; published US$ thousands divided by 1,000. Insurance operating earnings already reflect the management fees incurred by the segment. Gross management fees 350.860 less FRE compensation of 61.400 calculated by subtraction equal 289.460. FRE compensation excludes equity-based pay. Third parties pay KKR to manage Ivy and related sidecars; capital-markets transactions are anchored or facilitated by Global Atlantic. The measure combines pre-tax earnings with fees net of FRE compensation, before allocation of all other manager overhead and taxes.",
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
const num = (v) => String(Math.round(v * 1000) / 1000),
  color = (n) => `var(--color-${n})`;
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
      "font-family": "l0g Insurance Returns",
      "font-size": size,
      "font-weight": weight,
      "text-anchor": anchor,
      fill: color(fill),
    },
    esc(value),
  );
const lines = (x, y, values, opts = {}) =>
  values.map((v, i) => text(x, y + i * (opts.leading ?? 34), v, opts)).join("");
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
    x1,
    y1,
    x2,
    y2,
    stroke: color(stroke),
    "stroke-width": 2,
    ...extra,
  });
const path = (id, d, stroke = "signal", extra = {}) =>
  el("path", {
    id,
    d,
    fill: "none",
    stroke: color(stroke),
    "stroke-width": 2.5,
    ...extra,
  });
const arrow = (p, id, d, c = "signal", dash = false) =>
  path(`${p}-${id}`, d, c, {
    "marker-end": `url(#${p}-${c}-arrow)`,
    "stroke-dasharray": dash ? "8 7" : undefined,
  });
function panel(p, id, x, y, w, h, head, body = [], opts = {}) {
  const key = `${p}-${id}`;
  return (
    rect(key, x, y, w, h) +
    lines(x + 16, y + 34, head, {
      weight: 700,
      panel: key,
      maxWidth: w - 32,
      ...opts,
    }) +
    lines(x + 16, y + 34 + head.length * 34, body, {
      fill: "muted",
      panel: key,
      maxWidth: w - 32,
    })
  );
}
function frame(lang, index, mobile, height, body) {
  const fr = lang === "fr",
    w = mobile ? 600 : 1000,
    p = `insurance-ret-${lang}-f${index + 1}-${mobile ? "m" : "d"}`;
  const titles = {
    fr: [
      ["Deux contrats sur cinq ans"],
      ["Le prix de la disponibilité"],
      ["Athene : formation du résultat"],
      ["KKR : revenus de l’assurance"],
    ],
    en: [
      ["Two five-year contracts"],
      ["The price of access"],
      ["Athene’s earnings bridge"],
      ["KKR’s insurance contribution"],
    ],
  };
  const refs = INSURANCE_RETURNS_SOURCES[index]
    .split(" ")
    .map(
      (s, i, ids) =>
        el(
          "a",
          { href: `#source-s${s}` },
          text(158 + i * 80, height - 16, `S${s}`, { fill: "muted" }),
        ) +
        (i < ids.length - 1
          ? text(211.402 + i * 80, height - 16, ",", { fill: "muted" })
          : ""),
    )
    .join("");
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${height}" style="width:100%;height:auto" class="l0g-insurance-returns-svg" role="img" aria-labelledby="${p}-title ${p}-desc"><title id="${p}-title">${esc(COPY[lang][index][0])}</title><desc id="${p}-desc">${esc(COPY[lang][index][1])}</desc><defs><marker id="${p}-signal-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="10" markerHeight="10" orient="auto" markerUnits="userSpaceOnUse"><path d="M 1 1 L 9 5 L 1 9" fill="none" stroke="var(--color-signal)" stroke-width="2.5"></path></marker></defs>` +
    rect(undefined, 0, 0, w, height, "ink", 0) +
    text(24, 36, `l0g / 0${index + 1}`, { weight: 700, fill: "signal" }) +
    text(w - 24, 36, "23.10.2026", { anchor: "end", fill: "muted" }) +
    lines(24, 94, titles[lang][index], {
      size: mobile ? 30 : 36,
      weight: 700,
      maxWidth: w - 48,
    }) +
    body({ fr, w, p, mobile }) +
    line(`${p}-source-rule`, 24, height - 47, w - 24, height - 47) +
    text(24, height - 16, fr ? "Sources :" : "Sources:", { fill: "muted" }) +
    refs +
    "</svg>"
  );
}
const fmt = (v, fr, d = 0) =>
  v
    .toLocaleString(fr ? "fr-FR" : "en-US", {
      minimumFractionDigits: d,
      maximumFractionDigits: d,
    })
    .replaceAll("\u202f", " ");
function contracts(lang, mobile) {
  return frame(lang, 0, mobile, mobile ? 930 : 760, ({ fr, w, p }) => {
    let out = text(
      24,
      145,
      fr ? "150 000 $ · 60 ans · Floride" : "$150,000 · age 60 · Florida",
      { fill: "muted", maxWidth: w - 48 },
    );
    const products = ["Athene MaxRate 5", "SecureFore II 5"],
      rates = fr ? ["6,05 %", "6,00 %"] : ["6.05%", "6.00%"],
      dates = ["14.10.2026", "12.10.2026"];
    products.forEach((name, i) => {
      const x = mobile ? 24 : 24 + i * 488,
        y = mobile ? 180 + i * 143 : 180,
        pw = mobile ? 552 : 464,
        key = `${p}-product-${i}`;
      out +=
        rect(key, x, y, pw, 128) +
        text(x + 16, y + 35, name, {
          weight: 700,
          fill: i ? "topic-blue" : "signal",
          panel: key,
          maxWidth: pw - 32,
        }) +
        text(x + 16, y + 88, rates[i], { size: 38, weight: 700, panel: key }) +
        text(x + pw - 16, y + 85, dates[i], {
          anchor: "end",
          fill: "muted",
          panel: key,
        });
    });
    let legend = text(
      24,
      mobile ? 480 : 338,
      fr
        ? "Capital initial + intérêts calculés"
        : "Initial premium + calculated interest",
      { fill: "muted", maxWidth: w - 48 },
    );
    out += legend;
    const yy = mobile ? 510 : 378,
      scale = (w - 48) / 210000;
    [201207.7123417247, 200733.83664].forEach((v, i) => {
      const y = yy + i * 92;
      out +=
        text(24, y, products[i], { fill: i ? "topic-blue" : "signal" }) +
        text(w - 24, y, fmt(v, fr, 2) + (fr ? " $" : ""), {
          anchor: "end",
          weight: 700,
        });
      out +=
        bar(`${p}-capital-${i}`, 24, y + 17, 150000 * scale, 28, "surface-2") +
        bar(
          `${p}-interest-${i}`,
          24 + 150000 * scale,
          y + 17,
          (v - 150000) * scale,
          28,
          i ? "topic-blue" : "signal",
        );
    });
    out +=
      text(24, yy + 182, fr ? "0" : "$0", { fill: "muted" }) +
      text(w - 24, yy + 182, fr ? "210 000 $" : "$210,000", {
        anchor: "end",
        fill: "muted",
      });
    const base = mobile ? 747 : 615;
    out += text(
      24,
      base,
      fr ? "Écart calculé : 473,88 $" : "Calculated difference: $473.88",
      { weight: 700, fill: "signal", maxWidth: w - 48 },
    );
    out += lines(
      24,
      base + 42,
      fr
        ? [
            "Hypothèse : capitalisation annuelle.",
            "Avant impôt, période de frais expirée.",
          ]
        : [
            "Assumption: annual compounding.",
            "Before tax; charge period expired.",
          ],
      { fill: "muted", maxWidth: w - 48, leading: 36 },
    );
    return out;
  });
}
function liquidity(lang, mobile) {
  return frame(lang, 1, mobile, mobile ? 930 : 780, ({ fr, w, p }) => {
    let out = text(
      24,
      145,
      fr ? "Floride · franchise et sortie" : "Florida · allowance and exit",
      { fill: "muted", maxWidth: w - 48 },
    );
    const heads = ["Athene MaxRate 5", "SecureFore II 5"];
    heads.forEach((head, i) => {
      const x = mobile ? 24 : 24 + i * 488,
        y = mobile ? 175 + i * 142 : 175,
        pw = mobile ? 552 : 464,
        key = `${p}-allowance-${i}`;
      out +=
        rect(key, x, y, pw, 128) +
        text(x + 16, y + 34, head, {
          weight: 700,
          fill: i ? "topic-blue" : "signal",
          panel: key,
        });
      out += lines(
        x + 16,
        y + 75,
        i
          ? fr
            ? ["10 % de la prime, année 1 ;", "puis valeur en début d’année."]
            : ["10% of premium in year one;", "then beginning-year value."]
          : fr
            ? ["6,05 % × valeur au dernier", "anniversaire du contrat."]
            : ["6.05% × value at the most", "recent contract anniversary."],
        { panel: key, fill: "muted", leading: 33, maxWidth: pw - 32 },
      );
    });
    const top = mobile ? 530 : 407,
      bottom = mobile ? 744 : 587,
      scale = (bottom - top) / 10,
      step = (w - 48) / 5;
    out += text(
      24,
      mobile ? 474 : 357,
      fr
        ? "Frais de retrait · % · années 1 à 5"
        : "Exit charges · % · years 1–5",
      { weight: 700, maxWidth: w - 48 },
    );
    [10, 8, 7, 6, 5].forEach((_v, i) => {
      const cx = 24 + step * (i + 0.5),
        bw = mobile ? 34 : 56,
        gap = mobile ? 10 : 14;
      for (const [j, v] of [10, [8, 8, 7, 6, 5][i]].entries()) {
        const x = cx - (2 * bw + gap) / 2 + j * (bw + gap);
        out +=
          bar(
            `${p}-charge-${j}-${i}`,
            x,
            bottom - v * scale,
            bw,
            v * scale,
            j ? "topic-blue" : "signal",
          ) +
          text(x + bw / 2, bottom - v * scale - 10, String(v), {
            anchor: "middle",
            fill: j ? "topic-blue" : "signal",
            weight: 700,
          });
      }
      out += text(cx, bottom + 38, String(i + 1), {
        anchor: "middle",
        fill: "muted",
      });
    });
    out += line(`${p}-zero`, 24, bottom, w - 24, bottom);
    const my = mobile ? 812 : 673;
    out += text(
      24,
      my,
      fr ? "Ajustement de valeur de marché" : "Market value adjustment",
      { fill: "muted", maxWidth: w - 48 },
    );
    out +=
      text(24, my + 37, fr ? "Ajustement" : "Adjustment", { fill: "muted" }) +
      line(`${p}-mva`, 210, my + 28, 318, my + 28, "signal", {
        "marker-end": `url(#${p}-signal-arrow)`,
      }) +
      text(350, my + 37, fr ? "Reçu + / −" : "Proceeds + / −", {
        fill: "muted",
        maxWidth: w - 374,
      });

    return out;
  });
}
function athene(lang, mobile) {
  return frame(lang, 2, mobile, mobile ? 930 : 780, ({ fr, w, p }) => {
    let out = text(
      24,
      145,
      fr ? "S1 2026 · M$ US · non-GAAP" : "H1 2026 · US$m · non-GAAP",
      { fill: "muted", maxWidth: w - 48 },
    );
    const labels = fr
      ? [
          "Placements",
          "Frais reçus",
          "Coût du passif",
          "Marge",
          "Autres charges",
          "Financement",
          "SRE pré-impôt",
        ]
      : [
          "Investments",
          "Fees received",
          "Cost of funds",
          "Spread",
          "Other costs",
          "Financing",
          "Pre-tax SRE",
        ];
    const values = [7795, 73, -5749, 2119, -229, -294, 1596],
      running = [7795, 7868, 2119, 2119, 1890, 1596, 1596],
      subs = new Set([0, 3, 6]);
    const gx = mobile ? 342 : 358,
      gw = mobile ? 234 : 270,
      scale = gw / 8000,
      step = mobile ? 59 : 61;
    for (let i = 0; i < 7; i++) {
      const y = 200 + i * step,
        v = values[i],
        previous = i ? running[i - 1] : 0,
        from = subs.has(i) ? 0 : Math.min(previous, running[i]),
        to = subs.has(i) ? v : Math.max(previous, running[i]);
      out +=
        text(24, y, labels[i], { maxWidth: 235 }) +
        text(
          mobile ? 320 : 330,
          y,
          (i === 1 ? "+" : "") +
            (mobile ? fmt(v, fr).replaceAll(" ", "") : fmt(v, fr)),
          {
            anchor: "end",
            weight: 700,
            fill: subs.has(i) ? "signal" : v > 0 ? "topic-blue" : "amber",
          },
        );
      out +=
        line(`${p}-track-${i}`, gx, y - 9, gx + gw, y - 9) +
        bar(
          `${p}-waterfall-${i}`,
          gx + from * scale,
          y - 23,
          (to - from) * scale,
          28,
          subs.has(i) ? "signal" : v > 0 ? "topic-blue" : "amber",
        );
    }
    if (mobile) {
      out += lines(
        24,
        660,
        fr
          ? [
              "Quote-part ACRA d’Athene · non-GAAP",
              "S1 2025 → S1 2026 · taux annualisés",
              "Rendement gagné : 5,14 % → 5,16 %",
              "Coût des fonds : 3,57 % → 3,80 %",
              "SRE : 1 624 → 1 596 M$",
            ]
          : [
              "Athene’s ACRA share · non-GAAP",
              "H1 2025 → H1 2026 · annualized rates",
              "Earned rate: 5.14% → 5.16%",
              "Cost of funds: 3.57% → 3.80%",
              "SRE: $1,624m → $1,596m",
            ],
        { fill: "muted", maxWidth: 552, leading: 43 },
      );
    } else {
      const id = `${p}-comparison`;
      out +=
        rect(id, 650, 177, 326, 414) +
        lines(
          680,
          215,
          fr
            ? [
                "S1 2025 → S1 2026",
                "Taux annualisés",
                "Rendement gagné",
                "5,14 % → 5,16 %",
                "Coût des fonds",
                "3,57 % → 3,80 %",
                "SRE · M$",
                "1 624 → 1 596",
              ]
            : [
                "H1 2025 → H1 2026",
                "Annualized rates",
                "Earned rate",
                "5.14% → 5.16%",
                "Cost of funds",
                "3.57% → 3.80%",
                "SRE · US$m",
                "1,624 → 1,596",
              ],
          { panel: id, maxWidth: 286, leading: 47, fill: "muted" },
        );
      out += lines(
        24,
        666,
        fr
          ? [
              "Quote-part économique d’Athene dans ACRA.",
              "Coût : intérêts, options, provisions, amortissements.",
            ]
          : [
              "Athene’s economic share of ACRA.",
              "Cost of funds: interest, options, reserves and amortization.",
            ],
        { fill: "muted", maxWidth: 952, leading: 38 },
      );
    }
    return out;
  });
}
function kkr(lang, mobile) {
  return frame(lang, 3, mobile, mobile ? 930 : 780, ({ fr, w, p }) => {
    let out =
      text(
        24,
        145,
        fr ? "S1 2026 · M$ US · non-GAAP" : "H1 2026 · US$m · non-GAAP",
        { fill: "muted", maxWidth: w - 48 },
      ) +
      text(24, 204, fmt(997.405, fr, 3) + (fr ? " M$" : "m"), {
        size: 38,
        weight: 700,
        fill: "signal",
      }) +
      text(w - 24, 204, fr ? "4 composantes" : "4 components", {
        anchor: "end",
        fill: "muted",
      });
    const values = [548.55, 289.46, 125.578, 33.817],
      cols = ["signal", "topic-blue", "accent", "amber"];
    let x = 24;
    for (let i = 0; i < 4; i++) {
      const wid = ((w - 48) * values[i]) / 997.405;
      out += bar(`${p}-contribution-${i}`, x, 240, wid, 44, cols[i]);
      x += wid;
    }
    out += text(
      24,
      324,
      fr
        ? "Barre à l’échelle, depuis zéro."
        : "Bar to scale, starting at zero.",
      { fill: "muted", maxWidth: w - 48 },
    );
    const rows = fr
      ? [
          ["Assurance avant impôt", "548,550"],
          ["Gestion de l’assurance", "289,460"],
          ["Gestion des sidecars", "125,578"],
          ["Opérations de marché GA", "33,817"],
        ]
      : [
          ["Pre-tax insurance", "548.550"],
          ["Insurance management", "289.460"],
          ["Sidecar management", "125.578"],
          ["GA capital-markets fees", "33.817"],
        ];
    rows.forEach(([label, value], i) => {
      const y = mobile ? 387 + i * 71 : 383 + i * 60;
      out +=
        bar(`${p}-key-${i}`, 24, y - 23, 8, 28, cols[i]) +
        text(48, y, label, { maxWidth: mobile ? 374 : 730 }) +
        text(w - 24, y, value, { anchor: "end", weight: 700, fill: cols[i] });
    });
    const yy = mobile ? 705 : 610;
    out += lines(
      24,
      yy,
      fr
        ? [
            "Frais : nets de rémunération FRE.",
            "Gestion assurance : 350,860 − 61,400",
            "= 289,460 M$ · calcul par différence.",
            "Autres frais généraux et impôts à part.",
          ]
        : [
            "Fees: net of FRE compensation.",
            "Insurance fees: 350.860 − 61.400",
            "= $289.460m · subtraction calculation.",
            "Other overhead and tax separate.",
          ],
      { fill: "muted", maxWidth: w - 48, leading: 36 },
    );
    return out;
  });
}
export function insuranceReturnsSvg(lang, kind, mobile = false) {
  if (
    typeof lang !== "string" ||
    !["fr", "en"].includes(lang) ||
    typeof kind !== "string" ||
    !INSURANCE_RETURNS_KINDS.includes(kind) ||
    typeof mobile !== "boolean"
  )
    throw new TypeError("Invalid insurance returns scene");
  return { contracts, liquidity, athene, kkr }[kind](lang, mobile);
}
