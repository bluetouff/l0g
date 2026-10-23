// Closed, bilingual passive scenes. Numbers are historical observations, not current estimates.
export const INSURANCE_ACQUISITIONS_KINDS = Object.freeze([
  "acquisition",
  "mandates",
  "earnings",
  "fees",
  "blackstone",
]);
const COPY = {
  fr: [
    [
      "AEL : le prix et le bilan acquis",
      "Acquisition d’American Equity Investment Life Holding Company le 2 mai 2024. Allocation définitive du prix, en milliards de dollars américains. Contrepartie remise aux vendeurs : 2,525 en espèces et 1,111 en actions BAM, soit 3,636. Actifs identifiables : 75,166, dont 56,327 de placements et trésorerie et 18,839 d’autres actifs, comprenant 10,861 d’incorporels. En face : 61,473 de comptes d’assurés, 9,650 d’autres passifs et 4,043 d’actifs nets avant 0,713 de minoritaires. Les deux colonnes ou barres partent de zéro, avec une échelle commune. Goodwill exclu.",
    ],
    [
      "Trois parcours vers un mandat de gestion",
      "Dollars américains, trois opérations distinctes sans comparaison quantitative commune. Apollo gérait déjà 212,6 milliards pour les comptes Athene au 31 décembre 2021, avant la fusion du 1er janvier 2022. KKR ajoute 97,503 milliards d’AUM et d’AUM rémunérant la gestion lors de la prise de contrôle de Global Atlantic le 1er février 2021. Le rachat des minoritaires le 2 janvier 2024 porte ses droits économiques à 100 %, sur des actifs déjà comptés. BAM enregistre 49 milliards d’entrées de capital facturable liées au mandat AEL en 2024, après l’acquisition du 2 mai par Brookfield Re. Les flèches indiquent l’ordre des événements et l’apport du mandat.",
    ],
    [
      "Global Atlantic : résultat et part de KKR",
      "Résultat opérationnel ajusté d’assurance avant impôt, en millions de dollars américains. En 2023, total de 1 289,699, dont 816,637 attribués à KKR et 473,062 aux minoritaires. En 2024, 1 014,546 entièrement attribués à KKR après le rachat des minoritaires. Le total recule de 21,3 %, la part de KKR augmente de 24,2 %. Barres à échelle commune depuis zéro. Mesure ajustée après frais de gestion, distincte du résultat net GAAP.",
    ],
    [
      "Frais internes : du segment au groupe",
      "Exercice 2025, en millions de dollars américains. Frais de gestion bruts entre segments : 1 441 d’Athene vers la gestion d’actifs Apollo ; 673,9 de Global Atlantic vers la gestion d’actifs KKR. Flèches de largeur égale : schéma de flux, sans proportion quantitative. La recette et la charge internes sont éliminées en consolidation GAAP. Le résultat opérationnel d’assurance est déjà calculé après ces frais. Le gestionnaire finance ses coûts avec sa recette brute.",
    ],
    [
      "Corebridge : le tarif du mandat Blackstone",
      "Dépenses de gestion déclarées par Corebridge auprès de Blackstone, en millions de dollars américains : 175 en 2023, 243 en 2024, 323 en 2025. Barres à échelle commune depuis zéro. Le tarif annuel de 30 points de base vise la tranche initiale de 50 milliards confiée en 2021, encore non réinvestie ; 45 points de base visent les actifs additionnels et les actifs initiaux réinvestis. Illustration calculée pour un milliard d’actifs éligibles maintenu un an : 3 millions contre 4,5 millions. Exclusion des fonds et structures dont Blackstone ou une filiale est sponsor, ou pour lesquels Blackstone ou une filiale a droit à d’autres frais ; minimum contractuel. Un point de base représente 0,01 point de pourcentage.",
    ],
  ],
  en: [
    [
      "AEL: acquisition price and balance sheet",
      "American Equity Investment Life Holding Company acquisition on 2 May 2024. Final purchase price allocation in billions of US dollars. Consideration delivered to sellers: 2.525 cash plus 1.111 BAM shares, totalling 3.636. Identifiable assets: 75.166, including 56.327 investments and cash and 18.839 other assets, 10.861 of intangibles. Against them: 61.473 policyholder account balances, 9.650 other liabilities and 4.043 net assets before 0.713 noncontrolling interests. Both columns or bars start at zero and use the same scale. Goodwill excluded.",
    ],
    [
      "Three pathways to a management mandate",
      "US dollars. Three separate transactions without a common quantitative comparison. Apollo already managed 212.6 billion for Athene Accounts at 31 December 2021, before the merger on 1 January 2022. KKR adds 97.503 billion of AUM and fee-paying AUM when it takes control of Global Atlantic on 1 February 2021. Buying the minorities on 2 January 2024 raises its economic ownership to 100%, on assets already counted. BAM records 49 billion of fee-bearing capital inflows from the AEL mandate in 2024, after the 2 May acquisition by Brookfield Re. Arrows indicate event order and the addition of a mandate.",
    ],
    [
      "Global Atlantic: earnings and KKR’s share",
      "Adjusted insurance operating earnings before tax, in millions of US dollars. In 2023, total earnings are 1,289.699, including 816.637 attributed to KKR and 473.062 to noncontrolling interests. The 2024 total is 1,014.546, all attributed to KKR following the minority buyout. Total earnings fall 21.3% while KKR’s share increases 24.2%. Both bars start at zero and share the same scale. Adjusted measure after management fees, distinct from GAAP net income.",
    ],
    [
      "Internal fees: from segment to group",
      "Fiscal 2025, millions of US dollars. Gross intersegment management fees: 1,441 from Athene to Apollo Asset Management; 673.9 from Global Atlantic to KKR Asset Management. Equal-width arrows indicate flows, without a quantitative scale. Internal revenue and expense are eliminated in GAAP consolidation. Insurance operating earnings already deduct these fees. The manager’s gross revenue also funds its operating costs.",
    ],
    [
      "Corebridge: Blackstone’s management fees",
      "Corebridge’s recorded expenses related to Blackstone services, millions of US dollars: 175 in 2023, 243 in 2024 and 323 in 2025. Bars start at zero and share the same scale. The annual rate is 30 basis points on unreinvested assets from the initial 50 billion entrusted in 2021, and 45 basis points on additional and reinvested initial assets. Calculated illustration for one billion of eligible assets held for a full year: 3 million versus 4.5 million. Excludes funds and vehicles sponsored by Blackstone or an affiliate, or for which Blackstone or an affiliate is entitled to other fees; the contract also has a minimum fee. One basis point is 0.01 percentage point.",
    ],
  ],
};
export const INSURANCE_ACQUISITIONS_SOURCES = Object.freeze([
  "28",
  "03 05 15 19 30",
  "19",
  "08 20",
  "39 40 41",
]);
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
const el = (tag, attrs, body = "") =>
  `<${tag} ${Object.entries(attrs)
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
      "font-family": "l0g Insurance Acquisitions",
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
const path = (id, d, stroke = "signal", extra = {}) =>
  el("path", {
    id,
    d,
    fill: "none",
    stroke: color(stroke),
    "stroke-width": 2.5,
    ...extra,
  });
const arrow = (p, id, x1, y1, x2, y2, c = "signal") =>
  line(`${p}-${id}`, x1, y1, x2, y2, c, {
    "marker-end": `url(#${p}-${c}-arrow)`,
  });
function frame(lang, index, mobile, height, body) {
  const fr = lang === "fr",
    w = mobile ? 600 : 1000,
    p = `insurance-acq-${lang}-f${index + 1}-${mobile ? "m" : "d"}`;
  const ts = fr
    ? [
        ["AEL : le prix et", "le bilan acquis"],
        ["Trois parcours vers", "un mandat de gestion"],
        ["Global Atlantic : résultat", "et part de KKR"],
        ["Frais internes :", "du segment au groupe"],
        ["Corebridge : le mandat", "Blackstone"],
      ]
    : [
        ["AEL: the price and", "the acquired balance sheet"],
        ["Three pathways to", "a management mandate"],
        ["Global Atlantic: earnings", "and KKR’s share"],
        ["Internal fees:", "from segment to group"],
        ["Corebridge: the", "Blackstone mandate"],
      ];
  const title = mobile ? ts[index] : [COPY[lang][index][0]];
  const defs = ["signal", "accent", "amber"]
    .map((c) =>
      el(
        "marker",
        {
          id: `${p}-${c}-arrow`,
          viewBox: "0 0 10 10",
          refX: 9,
          refY: 5,
          markerWidth: 10,
          markerHeight: 10,
          orient: "auto",
          markerUnits: "userSpaceOnUse",
        },
        path(undefined, "M 1 1 L 9 5 L 1 9", c),
      ),
    )
    .join("");
  const refs = INSURANCE_ACQUISITIONS_SOURCES[index]
    .split(" ")
    .map((s, i) =>
      el(
        "a",
        { href: `#source-s${s}` },
        text(158 + i * 64, height - 16, `S${s}`, { fill: "muted" }),
      ),
    )
    .join("");
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${height}" style="width:100%;height:auto" class="l0g-insurance-acquisitions-svg" role="img" aria-labelledby="${p}-title ${p}-desc"><title id="${p}-title">${esc(COPY[lang][index][0])}</title><desc id="${p}-desc">${esc(COPY[lang][index][1])}</desc><defs>${defs}</defs>` +
    rect(undefined, 0, 0, w, height, "ink", 0) +
    text(24, 36, `l0g / 0${index + 1}`, { weight: 700, fill: "signal" }) +
    text(w - 24, 36, "23.10.2026", { anchor: "end", fill: "muted" }) +
    lines(24, 92, title, {
      size: mobile ? 34 : 38,
      weight: 700,
      leading: 42,
      maxWidth: w - 48,
    }) +
    body({ fr, w, p, mobile }) +
    line(`${p}-source-rule`, 24, height - 47, w - 24, height - 47) +
    text(24, height - 16, fr ? "Sources :" : "Sources:", { fill: "muted" }) +
    refs +
    "</svg>"
  );
}
function acquisition(lang, mobile) {
  return frame(lang, 0, mobile, mobile ? 936 : 790, ({ fr, w, p }) => {
    let out = lines(
      24,
      mobile ? 186 : 148,
      fr
        ? [
            mobile
              ? "AEL · 02.05.2024 · Md$ US"
              : "AEL · 02.05.2024 · milliards de dollars US",
          ]
        : ["AEL · 02.05.2024 · US$ billions"],
      { fill: "muted", maxWidth: w - 48 },
    );
    const seller = `${p}-sellers`,
      sy = mobile ? 216 : 178;
    out +=
      rect(seller, 24, sy, w - 48, mobile ? 132 : 114) +
      text(42, sy + 36, fr ? "PAIEMENT AUX VENDEURS" : "PAYMENT TO SELLERS", {
        weight: 700,
        fill: "muted",
        panel: seller,
        maxWidth: w - 84,
      });
    out += lines(
      42,
      sy + 76,
      mobile
        ? fr
          ? ["2,525 espèces + 1,111 actions", "BAM = 3,636 Md$ remis au total"]
          : ["2.525 cash + 1.111 BAM shares", "= $3.636bn delivered to sellers"]
        : fr
          ? ["2,525 espèces + 1,111 actions BAM = 3,636"]
          : ["2.525 cash + 1.111 BAM shares = 3.636"],
      { weight: 700, fill: "signal", panel: seller, maxWidth: w - 84 },
    );
    if (mobile) {
      const scale = 552 / 75.166;
      out += text(
        24,
        392,
        fr ? "ACTIFS IDENTIFIABLES : 75,166" : "IDENTIFIABLE ASSETS: 75.166",
        { weight: 700, maxWidth: 552 },
      );
      out +=
        rect(
          `${p}-asset-investments`,
          24,
          414,
          56.327 * scale,
          34,
          "signal",
          0,
        ) +
        rect(
          `${p}-asset-other`,
          24 + 56.327 * scale,
          414,
          18.839 * scale,
          34,
          "amber",
          0,
        );
      const start = 24 + (75.166 - 10.861) * scale,
        end = 576;
      for (let x = start; x < end; x += 10)
        out += line(
          `${p}-hatch-${num(x)}`,
          x,
          414,
          Math.min(x + 10, end),
          448,
          "ink",
        );
      out += lines(
        24,
        486,
        fr
          ? [
              "56,327 placements et trésorerie",
              "18,839 autres actifs, dont",
              "10,861 d’incorporels (hachures)",
            ]
          : [
              "56.327 investments and cash",
              "18.839 other assets, including",
              "10.861 intangibles (hatched)",
            ],
        { maxWidth: 552 },
      );
      out += text(
        24,
        604,
        fr
          ? "PASSIFS ET ACTIFS NETS : 75,166"
          : "LIABILITIES + NET ASSETS: 75.166",
        { weight: 700, maxWidth: 552 },
      );
      let x = 24;
      for (const [id, v, c] of [
        ["policyholders", 61.473, "signal"],
        ["liabilities", 9.65, "amber"],
        ["net-assets", 4.043, "topic-blue"],
      ]) {
        out += rect(`${p}-${id}`, x, 626, v * scale, 34, c, 0);
        x += v * scale;
      }
      out += lines(
        24,
        700,
        fr
          ? [
              "61,473 comptes des assurés",
              "9,650 autres passifs",
              "4,043 actifs nets avant minoritaires",
            ]
          : [
              "61.473 policyholder account balances",
              "9.650 other liabilities",
              "4.043 net assets before NCI",
            ],
        { maxWidth: 552 },
      );
      out += lines(
        24,
        820,
        fr
          ? [
              "Avant 0,713 Md$ de minoritaires.",
              "Juste valeur ; goodwill exclu.",
            ]
          : [
              "Net assets before $0.713bn of NCI.",
              "Fair value; goodwill excluded.",
            ],
        { fill: "muted", maxWidth: 552 },
      );
    } else {
      const scale = 242 / 75.166,
        base = 620;
      out +=
        text(24, 334, fr ? "ACTIFS : 75,166" : "ASSETS: 75.166", {
          weight: 700,
          maxWidth: 450,
        }) +
        text(
          520,
          334,
          fr ? "PASSIFS + ACTIFS NETS" : "LIABILITIES + NET ASSETS",
          { weight: 700, maxWidth: 456 },
        );
      out +=
        rect(
          `${p}-asset-investments`,
          24,
          base - 56.327 * scale,
          76,
          56.327 * scale,
          "signal",
          0,
        ) +
        rect(
          `${p}-asset-other`,
          24,
          base - 75.166 * scale,
          76,
          18.839 * scale,
          "amber",
          0,
        );
      const top = base - 75.166 * scale,
        bottom = top + 10.861 * scale;
      for (let y = top; y < bottom; y += 10)
        out += line(
          `${p}-hatch-${num(y)}`,
          24,
          y,
          100,
          Math.min(y + 10, bottom),
          "ink",
        );
      out += lines(
        120,
        396,
        fr
          ? [
              "18,839 autres actifs",
              "dont 10,861 incorporels",
              "(partie hachurée)",
            ]
          : [
              "18.839 other assets",
              "10.861 of intangibles",
              "(hatched portion)",
            ],
        { maxWidth: 372 },
      );
      out += lines(
        120,
        544,
        fr
          ? ["56,327 placements", "et trésorerie"]
          : ["56.327 investments", "and cash"],
        { weight: 700, maxWidth: 372 },
      );
      let y = base;
      for (const [id, v, c] of [
        ["policyholders", 61.473, "signal"],
        ["liabilities", 9.65, "amber"],
        ["net-assets", 4.043, "topic-blue"],
      ]) {
        y -= v * scale;
        out += rect(`${p}-${id}`, 520, y, 76, v * scale, c, 0);
      }
      out += lines(
        616,
        390,
        fr
          ? ["4,043 actifs nets", "avant minoritaires"]
          : ["4.043 net assets", "before NCI"],
        { maxWidth: 360 },
      );
      out += text(
        616,
        476,
        fr ? "9,650 autres passifs" : "9.650 other liabilities",
        { maxWidth: 360 },
      );
      out += lines(
        616,
        552,
        fr
          ? ["61,473 comptes", "des assurés"]
          : ["61.473 policyholder", "account balances"],
        { weight: 700, maxWidth: 360 },
      );
      for (const x of [24, 520])
        out +=
          line(`${p}-axis-${x}`, x, base, x + 76, base) +
          text(x, 655, "0", { fill: "muted" });
      out += lines(
        24,
        694,
        fr
          ? [
              "Actifs nets avant 0,713 Md$ de minoritaires.",
              "Juste valeur à l’acquisition ; goodwill exclu.",
            ]
          : [
              "Net assets before $0.713bn noncontrolling interests.",
              "Fair values at acquisition; goodwill excluded.",
            ],
        { fill: "muted", maxWidth: 952 },
      );
    }
    return out;
  });
}
function mandates(lang, mobile) {
  return frame(lang, 1, mobile, mobile ? 936 : 790, ({ fr, w, p }) => {
    let out = text(
      24,
      mobile ? 186 : 148,
      fr ? "Md$ US · définitions distinctes" : "US$bn · distinct definitions",
      { fill: "muted", maxWidth: w - 48 },
    );
    const rows = mobile
      ? [
          [216, 180],
          [414, 234],
          [666, 184],
        ]
      : [
          [178, 154],
          [350, 192],
          [560, 154],
        ];
    const names = [
      "APOLLO / ATHENE",
      "KKR / GLOBAL ATLANTIC",
      "BROOKFIELD / AEL",
    ];
    for (const [i, [y, h]] of rows.entries()) {
      const id = `${p}-mandate-${i}`,
        c = ["topic-blue", "signal", "amber"][i];
      out +=
        rect(id, 24, y, w - 48, h) +
        text(42, y + 34, names[i], {
          fill: c,
          weight: 700,
          panel: id,
          maxWidth: w - 84,
        });
      if (mobile) {
        const vals = fr
          ? ["212,6 Md$", "+97,503 Md$", "+49 Md$"]
          : ["$212.6bn", "+$97.503bn", "+$49bn"];
        out += text(42, y + 79, vals[i], {
          size: 34,
          weight: 700,
          fill: c,
          panel: id,
          maxWidth: 280,
        });
        const dates = ["01.01.2022", "01.02.2021", "02.05.2024"];
        out += text(350, y + 77, dates[i], {
          weight: 700,
          panel: id,
          maxWidth: 208,
        });
        out += arrow(
          p,
          `mandate-link-${i}`,
          i ? 334 : 282,
          y + 92,
          i ? 282 : 334,
          y + 92,
          i === 0 ? "accent" : c,
        );
        const left = fr
          ? [
              ["Déjà gérés fin 2021", "AUM facturables"],
              ["Fee-paying AUM", "et AUM ajoutés"],
              ["Capital facturable", "pour BAM en 2024"],
            ]
          : [
              ["Managed, end-2021", "Fee-generating AUM"],
              ["Fee-paying AUM", "and added AUM"],
              ["Fee-bearing capital", "BAM, 2024 inflows"],
            ];
        const right = fr
          ? [
              ["Fusion", "Mandat établi"],
              ["Contrôle"],
              ["AEL acquise", "Brookfield Re."],
            ]
          : [
              ["Merger", "Prior mandate"],
              ["Control"],
              ["AEL acquired", "Brookfield Re."],
            ];
        out +=
          lines(42, y + 120, left[i], { panel: id, maxWidth: 288 }) +
          lines(350, y + 120, right[i], { panel: id, maxWidth: 208 });
        if (i === 1)
          out += lines(
            42,
            y + 184,
            fr
              ? [
                  "02.01.2024 : droits à 100 %.",
                  "AUM déjà comptés avant ce rachat.",
                ]
              : [
                  "02.01.2024: 100% ownership.",
                  "AUM counted before this buyout.",
                ],
            { panel: id, maxWidth: 516 },
          );
      } else {
        const vals = fr
          ? [
              "212,6 Md$ déjà gérés fin 2021",
              "+97,503 Md$ d’AUM",
              "+49 Md$ pour BAM en 2024",
            ]
          : [
              "$212.6bn managed, end-2021",
              "+$97.503bn of AUM",
              "+$49bn for BAM in 2024",
            ];
        out += text(42, y + 79, vals[i], {
          size: 30,
          weight: 700,
          fill: c,
          panel: id,
          maxWidth: 540,
        });
        out += text(
          42,
          y + 117,
          fr
            ? [
                "Athene Accounts · AUM facturables",
                "AUM et fee-paying AUM",
                "Entrées de capital facturable",
              ][i]
            : [
                "Fee-generating Athene Accounts",
                "AUM and fee-paying AUM",
                "Fee-bearing capital inflows",
              ][i],
          { panel: id, maxWidth: 540 },
        );
        out += arrow(
          p,
          `mandate-link-${i}`,
          i ? 626 : 584,
          y + 85,
          i ? 584 : 626,
          y + 85,
          i === 0 ? "accent" : c,
        );
        out += lines(
          650,
          y + 76,
          (fr
            ? [
                ["01.01.2022 · Fusion", "Mandat antérieur."],
                ["01.02.2021 · Contrôle", "Nouveau périmètre."],
                ["02.05.2024 : AEL", "par Brookfield Re."],
              ]
            : [
                ["01.01.2022 · Merger", "Prior mandate."],
                ["01.02.2021 · Control", "Added assets."],
                ["02.05.2024: AEL", "by Brookfield Re."],
              ])[i],
          { panel: id, maxWidth: 308 },
        );
        if (i === 1)
          out +=
            text(
              42,
              y + 167,
              fr
                ? "02.01.2024 : minorités à 100 %"
                : "02.01.2024: minorities bought, 100%",
              { panel: id, maxWidth: 540 },
            ) +
            text(
              650,
              y + 167,
              fr ? "AUM déjà comptés" : "AUM already counted",
              { panel: id, maxWidth: 308 },
            );
      }
    }
    return out;
  });
}
function earnings(lang, mobile) {
  return frame(lang, 2, mobile, mobile ? 900 : 770, ({ fr, w, p }) => {
    let out = lines(
      24,
      mobile ? 186 : 148,
      fr
        ? mobile
          ? [
              "Résultat ajusté avant impôt",
              "Global Atlantic · millions de dollars US",
            ]
          : [
              "Global Atlantic · résultat ajusté avant impôt · millions de dollars US",
            ]
        : mobile
          ? [
              "Adjusted operating earnings before tax",
              "Global Atlantic · US$ millions",
            ]
          : ["Global Atlantic · adjusted earnings before tax · US$ millions"],
      { fill: "muted", maxWidth: w - 48 },
    );
    const legY = mobile ? 266 : 194;
    out +=
      rect(undefined, 24, legY - 22, 20, 20, "signal", 0) +
      text(56, legY, fr ? "Part KKR" : "KKR’s share", { maxWidth: 235 }) +
      rect(undefined, mobile ? 310 : 460, legY - 22, 20, 20, "amber", 0) +
      text(mobile ? 342 : 492, legY, fr ? "Minoritaires" : "Minorities", {
        maxWidth: mobile ? 234 : 484,
      });
    const base = mobile ? 610 : 520,
      scale = 0.2,
      xs = mobile ? [130, 380] : [230, 650],
      bw = 180;
    for (const tick of [0, 400, 800, 1200]) {
      const y = base - tick * scale;
      out +=
        line(`${p}-tick-${tick}`, mobile ? 100 : 110, y, w - 24, y) +
        text(mobile ? 88 : 98, y + 9, String(tick), {
          anchor: "end",
          fill: "muted",
        });
    }
    const kkr = [816.637, 1014.546],
      minor = 473.062;
    for (let i = 0; i < 2; i++) {
      out += rect(
        `${p}-kkr-${i}`,
        xs[i],
        base - kkr[i] * scale,
        bw,
        kkr[i] * scale,
        "signal",
        0,
      );
      if (!i)
        out += rect(
          `${p}-minority`,
          xs[i],
          base - 1289.699 * scale,
          bw,
          minor * scale,
          "amber",
          0,
        );
      out += text(
        xs[i] + bw / 2,
        base - (kkr[i] * scale) / 2 + 9,
        fr ? ["816,637", "1 014,546"][i] : ["816.637", "1,014.546"][i],
        { weight: 700, anchor: "middle", fill: "ink", panel: `${p}-kkr-${i}` },
      );
      if (!i)
        out += text(
          xs[i] + bw / 2,
          base - (kkr[0] + minor / 2) * scale + 9,
          fr ? "473,062" : "473.062",
          {
            weight: 700,
            anchor: "middle",
            fill: "ink",
            panel: `${p}-minority`,
          },
        );
      out += text(
        xs[i] + bw / 2,
        base - [1289.699, 1014.546][i] * 0.2 - 18,
        fr ? ["1 289,699", "1 014,546"][i] : ["1,289.699", "1,014.546"][i],
        { weight: 700, anchor: "middle" },
      );
      out += text(xs[i] + bw / 2, base + 44, String(2023 + i), {
        weight: 700,
        anchor: "middle",
      });
    }
    out += text(xs[1] + bw / 2, base + 80, fr ? "KKR : 100 %" : "KKR: 100%", {
      anchor: "middle",
      fill: "muted",
    });
    const cy = mobile ? 724 : 634;
    for (const [i, label] of (fr
      ? ["−21,3 % : activité entière", "+24,2 % : part de KKR"]
      : ["−21.3%: whole business", "+24.2%: KKR’s share"]
    ).entries()) {
      const x = mobile ? 24 + i * 282 : 24 + i * 496;
      out += mobile
        ? lines(
            x,
            cy,
            (fr
              ? [
                  ["−21,3 %", "Activité entière"],
                  ["+24,2 %", "Part de KKR"],
                ]
              : [
                  ["−21.3%", "Whole business"],
                  ["+24.2%", "KKR’s share"],
                ])[i],
            { weight: 700, fill: i ? "signal" : "amber", maxWidth: 270 },
          )
        : text(x, cy, label, {
            weight: 700,
            fill: i ? "signal" : "amber",
            maxWidth: 476,
          });
    }
    out += text(
      24,
      mobile ? 798 : 690,
      fr ? "Mesure ajustée après frais" : "Adjusted measure, after fees",
      { fill: "muted", maxWidth: w - 48 },
    );
    return out;
  });
}
function fees(lang, mobile) {
  return frame(lang, 3, mobile, mobile ? 900 : 790, ({ fr, w, p }) => {
    let out = lines(
      24,
      mobile ? 186 : 148,
      fr
        ? mobile
          ? ["2025 · millions de dollars US", "Frais bruts entre segments"]
          : ["2025 · frais bruts entre segments · millions de dollars US"]
        : mobile
          ? ["2025 · US$ millions", "Gross intersegment fees"]
          : ["2025 · gross intersegment fees · US$ millions"],
      { fill: "muted", maxWidth: w - 48 },
    );
    const ys = mobile ? [252, 418] : [220, 370],
      bw = mobile ? 220 : 280,
      right = mobile ? 356 : 696;
    for (const [i, y] of ys.entries()) {
      const a = `${p}-insurer-${i}`,
        b = `${p}-manager-${i}`;
      out += rect(a, 24, y, bw, 110) + rect(b, right, y, bw, 110);
      out +=
        (mobile && i
          ? lines(42, y + 34, ["Global", "Atlantic"], {
              weight: 700,
              panel: a,
              maxWidth: bw - 36,
            })
          : text(42, y + 39, ["Athene", "Global Atlantic"][i], {
              weight: 700,
              panel: a,
              maxWidth: bw - 36,
            })) +
        text(right + 18, y + 39, ["Apollo", "KKR"][i], {
          weight: 700,
          panel: b,
          maxWidth: bw - 36,
        });
      out +=
        text(42, y + (mobile && i ? 96 : 85), fr ? "Charge" : "Expense", {
          panel: a,
          maxWidth: bw - 36,
        }) +
        text(right + 18, y + 85, fr ? "Recette" : "Revenue", {
          panel: b,
          maxWidth: bw - 36,
        });
      out += text(
        w / 2,
        y + 27,
        fr ? ["1 441", "673,9"][i] : ["1,441", "673.9"][i],
        {
          weight: 700,
          fill: "signal",
          anchor: "middle",
          size: mobile ? 28 : 34,
        },
      );
      out += arrow(p, `fee-${i}`, 24 + bw + 16, y + 62, right - 16, y + 62);
    }
    const note = `${p}-consolidation`,
      ny = mobile ? 566 : 522,
      nh = mobile ? 154 : 126;
    out +=
      rect(note, 24, ny, w - 48, nh) +
      text(42, ny + 35, "CONSOLIDATION GAAP", {
        weight: 700,
        fill: "signal",
        panel: note,
        maxWidth: w - 84,
      });
    out += lines(
      42,
      ny + 75,
      mobile
        ? fr
          ? ["Recette et charge internes", "éliminées en consolidation."]
          : ["Internal revenue and expense", "eliminated on consolidation."]
        : fr
          ? [
              "La recette et la charge internes s’éliminent",
              "en consolidation des comptes du groupe.",
            ]
          : [
              "Internal revenue and expense are eliminated",
              "when the group’s accounts are consolidated.",
            ],
      { panel: note, maxWidth: w - 84 },
    );
    out += lines(
      24,
      mobile ? 768 : 704,
      mobile
        ? fr
          ? [
              "Résultat d’assurance après frais.",
              "La gestion finance ses propres coûts.",
            ]
          : [
              "Insurance earnings after fees.",
              "Management revenue funds its costs.",
            ]
        : fr
          ? [
              "Résultat d’assurance après frais ; recette de gestion avant coûts.",
            ]
          : ["Insurance earnings after fees; management revenue before costs."],
      { fill: "muted", maxWidth: w - 48 },
    );
    return out;
  });
}
function blackstone(lang, mobile) {
  return frame(lang, 4, mobile, mobile ? 936 : 790, ({ fr, w, p }) => {
    let out = lines(
      24,
      mobile ? 186 : 148,
      fr
        ? mobile
          ? ["Dépenses déclarées par Corebridge", "Millions de dollars US"]
          : ["Dépenses déclarées par Corebridge · millions de dollars US"]
        : mobile
          ? ["Expenses reported by Corebridge", "US$ millions"]
          : ["Expenses reported by Corebridge · US$ millions"],
      { fill: "muted", maxWidth: w - 48 },
    );
    const base = 350,
      scale = (mobile ? 110 : 150) / 350,
      bw = mobile ? 92 : 130,
      xs = mobile ? [132, 298, 464] : [200, 450, 700];
    for (const tick of [0, 100, 200, 300]) {
      const y = base - tick * scale;
      out +=
        line(`${p}-tick-${tick}`, mobile ? 92 : 110, y, w - 24, y) +
        text(mobile ? 80 : 98, y + 9, String(tick), {
          anchor: "end",
          fill: "muted",
        });
    }
    for (const [i, value] of [175, 243, 323].entries()) {
      out +=
        rect(
          `${p}-expense-${i}`,
          xs[i],
          base - value * scale,
          bw,
          value * scale,
          "signal",
          0,
        ) +
        text(xs[i] + bw / 2, base - value * scale - 16, String(value), {
          weight: 700,
          fill: "signal",
          anchor: "middle",
          size: 34,
        }) +
        text(xs[i] + bw / 2, base + 39, String(2023 + i), {
          weight: 700,
          anchor: "middle",
        });
    }
    const py = mobile ? [420, 642] : [420, 420],
      px = mobile ? [24, 24] : [24, 524],
      pw = mobile ? 552 : 452,
      ph = mobile ? 166 : 180;
    for (let i = 0; i < 2; i++) {
      const id = `${p}-rate-${i}`,
        c = i ? "amber" : "topic-blue",
        x = px[i],
        y = py[i];
      out += rect(id, x, y, pw, ph);
      out += text(
        x + 18,
        y + 36,
        fr
          ? ["30 pb · 0,30 % / an", "45 pb · 0,45 % / an"][i]
          : ["30 bp · 0.30% a year", "45 bp · 0.45% a year"][i],
        { weight: 700, fill: c, panel: id, maxWidth: pw - 36 },
      );
      out += lines(
        x + 18,
        y + 76,
        (fr
          ? [
              ["50 Md$ confiés en 2021,", "actifs encore non réinvestis."],
              ["Actifs additionnels et actifs", "initiaux réinvestis."],
            ]
          : [
              ["Initial $50bn (2021),", "assets still unreinvested."],
              ["Additional assets and", "reinvested initial assets."],
            ])[i],
        { panel: id, maxWidth: pw - 36 },
      );
      out += text(
        x + 18,
        y + 146,
        fr
          ? ["1 Md$ → 3 M$ / an", "1 Md$ → 4,5 M$ / an"][i]
          : ["$1bn → $3m a year", "$1bn → $4.5m a year"][i],
        { weight: 700, fill: c, panel: id, maxWidth: pw - 36 },
      );
    }
    if (mobile) {
      out +=
        arrow(p, "reinvestment", 300, 598, 300, 630, "amber") +
        text(324, 620, fr ? "Réinvestissement" : "Reinvestment", {
          fill: "amber",
          maxWidth: 252,
        });
    } else {
      out +=
        path(`${p}-reinvestment`, "M 250 612 V 645 H 750 V 612", "amber", {
          "marker-end": `url(#${p}-amber-arrow)`,
        }) +
        text(500, 682, fr ? "Réinvestissement" : "Reinvestment", {
          anchor: "middle",
          fill: "amber",
        });
    }
    out += lines(
      24,
      mobile ? 844 : 720,
      mobile
        ? fr
          ? [
              "Base éligible sur un an ; minimum.",
              "Exclusions : sponsor / droit à frais.",
            ]
          : [
              "Eligible assets, full year; minimum.",
              "Exclusions: sponsor / fee entitlement.",
            ]
        : fr
          ? ["Base un an · minimum / exclusions : voir méthode."]
          : ["Full-year example; minimum / exclusions: see method."],
      { fill: "muted", maxWidth: w - 48 },
    );
    return out;
  });
}
export function insuranceAcquisitionsSvg(lang, kind, mobile = false) {
  if (
    typeof lang !== "string" ||
    !["fr", "en"].includes(lang) ||
    typeof kind !== "string" ||
    !INSURANCE_ACQUISITIONS_KINDS.includes(kind) ||
    typeof mobile !== "boolean"
  )
    throw new TypeError("Invalid insurance acquisitions SVG variant");
  return { acquisition, mandates, earnings, fees, blackstone }[kind](
    lang,
    mobile,
  );
}
