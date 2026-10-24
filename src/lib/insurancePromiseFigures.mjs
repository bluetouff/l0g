// Controlled bilingual scenes. Source references and methods are rendered by the shared figure component.
export const INSURANCE_PROMISE_KINDS = Object.freeze([
  "signatures",
  "capital",
  "protection",
]);
export const INSURANCE_PROMISE_SOURCES = Object.freeze([
  "11 06 01 08 07 05 51 04 37 43",
  "19",
  "27 24 28 30 31 26 32 33",
]);
const COPY = {
  fr: [
    [
      "Groupes et assureurs signataires",
      "Carte de trois groupes et des assureurs émetteurs de leurs contrats, avec des liens distincts de contrôle et de responsabilité des prestations. Un encart décrit le soutien en capital d’Athene Holding Ltd. à Athene Annuity and Life Company. Les chaînes intermédiaires sont simplifiées. Détails documentaires : Trois groupes, trois signatures Qui contrôle l’assureur, et qui doit servir le contrat. Contrôle indirect · chaîne simplifiée Responsabilité des prestations GROUPE DE CONTRÔLE ASSUREUR ÉMETTEUR CONTRAT ÉTATS-UNIS · ACCUMULATION Fusion · 1 janv. 2022 Apollo Global Management, Inc. via Athene Holding Ltd. Athene Annuity and Life Company MaxRate 5 Titulaire La prime initiale produit des intérêts au taux garanti pendant la période choisie. Toutes les actions ordinaires d’AHL détenues par Apollo. [S06, S01, S05] ÉTATS-UNIS · ACCUMULATION 100 % de Global Atlantic · 2 janv. 2024 KKR & Co. Inc. via Global Atlantic Forethought Life Insurance Company SecureFore II · 5 ans Titulaire Global Atlantic désigne le groupe ; Forethought émet le contrat. Chaque filiale répond de ses obligations financières et contractuelles. [S08, S07, S51] ROYAUME-UNI · RENTE VIAGÈRE Rachat clos · 1 avr. 2026 Brookfield Wealth Solutions Ltd. via BWS Holdings et Just Group Just Retirement Limited Pension Annuity Titulaire La promesse porte sur un revenu garanti à vie selon l’option choisie. JRL : filiale indirecte au 31.12.2025 ; fiche produit de juin 2026. [S04, S37, S43] Le soutien en capital a sa propre convention Un lien documenté à l’intérieur du groupe Athene Athene Holding Ltd. · AHL Athene Annuity and Life Company Apport si le capital passe sous un seuil Le 10-K 2025 décrit un seuil fixé avec le régulateur de l’assureur. Cette convention organise un renfort de capital ; la brochure MaxRate attribue à l’assureur émetteur la responsabilité des prestations. [S11, S01] Les sociétés intermédiaires sont simplifiées. La carte distingue la propriété, l’engagement de capital et le débiteur du contrat ; chaque lien a son fondement juridique.",
    ],
    [
      "L’objet de la garantie",
      "Exemple construit de deux affectations alternatives de 10000 euros sur un an, dans Linxea Spirit 2 assuré par Spirica. Source S19, conditions CG4445 du 1er septembre 2026, pages imprimées 1,4,14–18. Fonds Euro Nouvelle Génération : participation brute supposée nulle, frais maximum de 2%, résultat illustratif au plancher 9800 euros. UC générique : 100 parts à100 euros, quatre prélèvements trimestriels de0,125%, nombre final exact99.500936718994140625, prix final supposé90 euros, valeur finale8955.08430470947265625 euros. Ce résultat UC est un scénario de marché et non une borne garantie. Gestion libre, aucune option décès, transaction, fiscalité ou gestion pilotée ; le prix UC intègre les frais internes du support. Barres quantitatives partant de zéro. Aucun rendement réel ou prévu. Assureur supposé honorer ses engagements.",
    ],
    [
      "Les voies de protection",
      "Trois voies juridiques distinctes : France FGAP, Royaume-Uni FSCS et Floride FLAHIGA. Les flèches décrivent une procédure : éligibilité, évaluation des droits, continuité ou transfert. Les plafonds ont des assiettes différentes et ne mesurent pas une sécurité relative. Détails documentaires : Le secours dépend du contrat Trois voies après une défaillance reconnue · règles consultées le 24 octobre 2026 Chaque chiffre correspond à une assiette et à des conditions propres. France FGAP 1 Ouvrir le dispositif Décision de l’ACPR, après consultation du fonds. Assureur agréé en France, soumis au Code des assurances. 2 Mesurer les droits PLAFOND GÉNÉRAL 70 000 € de provisions techniques pour les prestations futures Par personne et société défaillante, tous contrats concernés regroupés. 3 Organiser la suite Le fonds contribue à la reprise des contrats par un assureur. À défaut de transfert, les versements suivent la procédure applicable. 90 000 € pour les catégories de rentes de prévoyance¹. Royaume-Uni FSCS 1 Ouvrir le dispositif Défaut ou procédure visée par les règles de protection. Assureur, contrat et demandeur éligibles selon les règles PRA. 2 Mesurer les droits TAUX DE COUVERTURE 100 % de la créance éligible d’assurance de long terme Sans plafond monétaire, selon l’évaluation des droits prévue par les règles. 3 Organiser la suite Le FSCS peut financer la continuité du contrat ou son transfert. Les prestations dues sont sécurisées selon les règles et les délais du dispositif. Protection du contrat assuré ; réassurance exclue. Floride FLAHIGA 1 Ouvrir le dispositif Insolvabilité reconnue ; liquidation ordonnée par un tribunal. Assureur membre ; rente différée et propriétaire éligibles. 2 Mesurer les droits PLAFOND APPLICABLE 250 000 $ des valeurs nettes de rachat et de retrait Par propriétaire et assureur membre ; contrats regroupés sous ce plafond. 3 Organiser la suite Reprise par un assureur solvable ou gestion des contrats par l’association. Les mesures et délais suivent la procédure de liquidation. Résidence : appréciée à la liquidation, en principe ; exclusions légales. La perte finale dépend aussi de la reprise et des recouvrements Les actifs récupérés et les conditions de reprise participent au règlement des engagements. En Floride, un montant au-delà du plafond peut rester une créance sur la liquidation. ¹ France : 90 000 € pour les rentes d’incapacité, d’invalidité et celles issues de contrats en cas de décès. Les prestations futures et celles déjà échues relèvent de dispositions distinctes. [S27] Les cas illustrés : assurance de personnes en France, assurance de long terme au Royaume-Uni, rente différée en accumulation en Floride. Les conditions d’éligibilité s’examinent pour chaque dossier. Les rentes ordinaires de retraite relèvent du seuil général.",
    ],
  ],
  en: [
    [
      "Groups and policy issuers",
      "Three groups and the insurers that issue their policies, with distinct control and benefit-responsibility relationships. An inset explains capital support from Athene Holding Ltd. to Athene Annuity and Life Company. Intermediate chains are simplified. Documentary details: Three groups, three signatures Who controls the insurer, and who owes the policy benefits. Indirect control · simplified chain Responsibility for policy benefits CONTROLLING GROUP ISSUING INSURER POLICY UNITED STATES · ACCUMULATION Merger · 1 Jan 2022 Apollo Global Management, Inc. via Athene Holding Ltd. Athene Annuity and Life Company MaxRate 5 Policyholder The initial premium earns a guaranteed rate for the selected term. Apollo holds all AHL common shares. [S06, S01, S05] UNITED STATES · ACCUMULATION 100% of Global Atlantic · 2 Jan 2024 KKR & Co. Inc. via Global Atlantic Forethought Life Insurance Company SecureFore II · 5 years Policyholder Global Atlantic identifies the group; Forethought issues the policy. Each subsidiary is responsible for its own financial and policy obligations. [S08, S07, S51] UNITED KINGDOM · LIFETIME INCOME Acquisition closed · 1 Apr 2026 Brookfield Wealth Solutions Ltd. via BWS Holdings and Just Group Just Retirement Limited Pension Annuity Policyholder The promise is a guaranteed income for life under the selected option. JRL: indirect subsidiary at 31 Dec 2025; product facts from June 2026. [S04, S37, S43] Capital support has its own agreement A documented relationship within the Athene group Athene Holding Ltd. · AHL Athene Annuity and Life Company Capital provided below an agreed threshold The 2025 10-K describes a threshold set with the insurer’s regulator. That agreement provides capital support; the MaxRate brochure assigns responsibility for policy benefits to the issuing insurer. [S11, S01] Intermediate companies are simplified. Ownership, capital commitments and the policy debtor are distinct relationships, each with its own legal basis. Sources: S11, S06, S01, S08, S07, S05, S51; S04, S37, S43. Checked on 24 October 2026 · Arrow widths do not represent money · See the source register.",
    ],
    [
      "The object of the guarantee",
      "Constructed illustration of two alternative 10000 euro allocations held for a full year in Linxea Spirit 2, insured by Spirica. Source S19, CG4445 notice dated1 September2026, printed pages1,4,14–18. Euro Nouvelle Génération fund: assumed zero gross profit-sharing and maximum2% annual fee result in an illustrated floor of9800 euros. A generic unit-linked holding:100 units initially at100 euros; four quarterly0.125% fee deductions leave99.500936718994140625 units; assumed final NAV90 euros gives8955.08430470947265625 euros. The unit-linked result is a market scenario, not a guaranteed downside bound. Self-directed allocation, no optional death cover, transactions, taxes or discretionary-management charge; NAV includes underlying fund expenses. All quantitative bars start at zero. No observed or forecast return. The insurer is assumed to fulfil its obligations.",
    ],
    [
      "Protection after failure",
      "Three distinct legal pathways: France FGAP, United Kingdom FSCS and Florida FLAHIGA. Arrows show the sequence from eligibility to claim valuation and continuity or transfer. Caps have different legal bases and do not measure relative safety. Documentary details: Protection follows the contract Three pathways after a recognised failure · rules checked on 24 October 2026 Each figure applies to a different legal measure and set of conditions. France FGAP 1 Enter the scheme ACPR decision following consultation with the fund. French-authorised insurer subject to the French Insurance Code. 2 Assess the claim GENERAL CAP €70,000 of technical provisions for future benefits Per person and insurer, with the relevant contracts combined. 3 Arrange the next step The fund contributes to transferring policies to another insurer. If a transfer fails, payments follow the applicable procedure. €90,000 for the annuity categories specified below¹. United Kingdom FSCS 1 Enter the scheme Default or proceedings specified by PRA rules. Eligible insurer, contract and claimant under PRA rules. 2 Assess the claim LEVEL OF COVER 100% of the eligible long-term insurance claim No monetary cap, subject to the rules for valuing the contractual entitlement. 3 Arrange the next step FSCS can fund continuity of cover or a transfer to another insurer. Benefits due are secured under its conditions and payment rules. Cover attaches to the policy; reinsurance is excluded. Florida FLAHIGA 1 Enter the scheme Insolvency established; court-ordered liquidation. A member insurer; eligible deferred annuity and owner. 2 Assess the claim APPLICABLE CAP $250,000 of net cash surrender and withdrawal values Per owner and insurer; multiple contracts share the same cap. 3 Arrange the next step Transfer to a solvent insurer or administration by the association. Measures and timing follow the liquidation process. Residence is generally assessed at the liquidation order; statutory exclusions apply. The ultimate loss also depends on transfers and recoveries Recovered assets and the terms of a transfer help determine how obligations are settled. In Florida, an amount above the cap may remain a claim against the liquidation estate. ¹ France: €90,000 applies to incapacity and disability annuities and annuities under death-cover policies. Future benefits and payments already due are governed by different provisions. [S27] Illustrated cases: personal insurance in France, long-term insurance in the UK and a deferred annuity in accumulation in Florida. Eligibility must be assessed for each claim. Ordinary retirement annuities use the general threshold.",
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
      "font-family": "l0g Insurance Promise",
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
  { fill = "paper", leading = 32, padding = 16, top = 34 } = {},
) {
  const key = `${p}-${id}`;
  return (
    rect(key, x, y, w, h) +
    lines(x + padding, y + top, values, {
      panel: key,
      maxWidth: w - padding * 2,
      fill,
      leading,
    })
  );
}
function frame(lang, i, m, body) {
  const fr = lang === "fr",
    w = m ? 600 : 1000,
    h = m ? 930 : 790,
    p = `insurance-promise-${lang}-f${i + 1}-${m ? "m" : "d"}`;
  const titles =
    m && i === 0
      ? fr
        ? ["Groupes et assureurs", "signataires"]
        : ["Groups and policy", "issuers"]
      : m && i === 1
        ? fr
          ? ["La garantie porte", "sur des objets différents"]
          : ["Different objects", "of guarantee"]
        : [COPY[lang][i][0]];
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" style="width:100%;height:auto" class="l0g-insurance-promise-svg" role="img" aria-labelledby="${p}-title ${p}-desc"><title id="${p}-title">${esc(COPY[lang][i][0])}</title><desc id="${p}-desc">${esc(COPY[lang][i][1])}</desc><defs><marker id="${p}-signal-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="10" markerHeight="10" orient="auto" markerUnits="userSpaceOnUse"><path d="M 1 1 L 9 5 L 1 9" fill="none" stroke="var(--color-signal)" stroke-width="2.5"></path></marker></defs>` +
    rect(undefined, 0, 0, w, h, "ink", 0) +
    text(24, 36, `l0g / 0${i + 1}`, { weight: 700, fill: "signal" }) +
    text(w - 24, 36, "24.10.2026", { anchor: "end", fill: "muted" }) +
    lines(24, 94, titles, {
      size: m ? 30 : 36,
      weight: 700,
      maxWidth: w - 48,
    }) +
    body({ fr, w, p, m }) +
    "</svg>"
  );
}
const note = (y, values, w) =>
  lines(24, y, values, { fill: "muted", maxWidth: w - 48 });
const route = (p, id, points, extra = {}) =>
  points
    .slice(1)
    .map(([x2, y2], i) =>
      line(`${p}-${id}-${i}`, points[i][0], points[i][1], x2, y2, "signal", {
        ...extra,
        ...(i === points.length - 2
          ? { "marker-end": `url(#${p}-signal-arrow)` }
          : {}),
      }),
    )
    .join("");
function axis(p, x, y, width, max, ticks, maxAnchor = "end") {
  return (
    line(`${p}-axis`, x, y, x + width, y) +
    ticks
      .map(
        (v) =>
          text(x + (width * v) / max, y - 14, String(v), {
            anchor: v === 0 ? "start" : v === max ? maxAnchor : "middle",
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
function signatures(lang, m) {
  return frame(lang, 0, m, ({ fr, w, p }) => {
    const groups = [
      ["Apollo Global", "Management, Inc.", "01.01.2022"],
      ["KKR & Co. Inc.", "via Global Atlantic", "02.01.2024"],
      ["Brookfield Wealth", "Solutions Ltd.", "01.04.2026"],
    ];
    const issuers = [
      ["Athene Annuity and", "Life Company"],
      ["Forethought Life", "Insurance Company"],
      ["Just Retirement", "Limited"],
    ];
    const products = [
      ["MaxRate 5", fr ? "Titulaire" : "Owner"],
      [
        "SecureFore",
        "II · 5 " + (fr ? "ans" : "years"),
        fr ? "Titulaire" : "Owner",
      ],
      ["Pension", "Annuity", fr ? "Titulaire" : "Owner"],
    ];
    let out = "";
    if (m) {
      for (let i = 0; i < 3; i++) {
        const y = 160 + i * 198,
          group =
            i === 0
              ? "Apollo Global Management, Inc."
              : i === 1
                ? "KKR & Co. Inc."
                : "Brookfield Wealth Solutions Ltd.";
        out += panel(p, `group-${i}`, 24, y, 552, 52, [group]);
        out += arrow(p, `control-${i}`, 182, y + 52, 182, y + 68).replace(
          'stroke-width="2"',
          'stroke-width="2" stroke-dasharray="8 7"',
        );
        out += panel(p, `issuer-${i}`, 24, y + 68, 316, 112, issuers[i]);
        out += panel(p, `policy-${i}`, 376, y + 68, 200, 112, products[i]);
        out += arrow(p, `benefit-${i}`, 340, y + 124, 376, y + 124);
      }
      out += text(
        24,
        782,
        fr
          ? "Renfort : seuil fixé avec le régulateur"
          : "Support: threshold set with regulator",
        { fill: "muted", maxWidth: 552 },
      );
      out +=
        panel(p, "support-parent", 24, 808, 230, 64, ["AHL"]) +
        panel(p, "support-issuer", 318, 808, 258, 64, ["Athene ALC"]) +
        arrow(p, "capital-support", 254, 840, 318, 840);
    } else {
      out += note(
        150,
        fr
          ? ["Contrôle indirect simplifié ; prestations dues par l’émetteur."]
          : ["Simplified indirect control; issuer owes the policy benefits."],
        w,
      );
      out +=
        line(`${p}-control-key`, 24, 176, 104, 176, "signal", {
          "stroke-dasharray": "8 7",
          "marker-end": `url(#${p}-signal-arrow)`,
        }) +
        text(116, 184, fr ? "Contrôle" : "Control", { fill: "muted" }) +
        arrow(p, "benefit-key", 526, 176, 606, 176) +
        text(618, 184, fr ? "Prestations" : "Benefits", { fill: "muted" });
      for (let i = 0; i < 3; i++) {
        const y = 220 + i * 140;
        out +=
          panel(p, `group-${i}`, 24, y, 300, 112, groups[i]) +
          panel(p, `issuer-${i}`, 374, y, 360, 112, issuers[i]) +
          panel(p, `policy-${i}`, 784, y, 192, 112, products[i]);
        out +=
          line(`${p}-control-${i}`, 324, y + 56, 374, y + 56, "signal", {
            "stroke-dasharray": "8 7",
            "marker-end": `url(#${p}-signal-arrow)`,
          }) + arrow(p, `benefit-${i}`, 734, y + 56, 784, y + 56);
      }
      out += text(
        24,
        646,
        fr
          ? "Convention de capital distincte des prestations"
          : "Capital support is a separate agreement",
        { fill: "muted", maxWidth: 952 },
      );
      out +=
        panel(p, "support-parent", 24, 662, 300, 80, [
          "Athene Holding",
          "Ltd.",
        ]) +
        panel(p, "support-issuer", 374, 662, 360, 80, [
          "Athene Annuity and",
          "Life Company",
        ]) +
        arrow(p, "capital-support", 324, 702, 374, 702) +
        lines(
          754,
          696,
          fr
            ? ["Seuil fixé avec", "le régulateur"]
            : ["Threshold set", "with regulator"],
          { maxWidth: 222, leading: 32 },
        );
    }
    return out;
  });
}
function capital(lang, m) {
  return frame(lang, 1, m, ({ fr, w, p }) => {
    let out = note(
      m ? 166 : 150,
      fr
        ? [
            m
              ? "Spirit 2 / Spirica · 01.09.2026"
              : "Linxea Spirit 2 / Spirica · notice du 01.09.2026",
          ]
        : [
            m
              ? "Spirit 2 / Spirica · 01.09.2026"
              : "Linxea Spirit 2 / Spirica · notice 01.09.2026",
          ],
      w,
    );
    out += text(
      24,
      m ? 205 : 215,
      fr ? "2 options · 10 000 EUR · 1 an" : "2 options · EUR10,000 · 1 year",
      { weight: 700, maxWidth: w - 48 },
    );
    if (m) {
      out += route(
        p,
        "alternative-bus",
        [
          [300, 218],
          [12, 218],
          [12, 515],
        ],
        {},
      ).replace(/ marker-end="[^"]+"/u, "");
      out +=
        arrow(p, "euro-entry", 12, 310, 24, 310) +
        arrow(p, "units-entry", 12, 515, 24, 515);
      out += panel(
        p,
        "euro",
        24,
        240,
        552,
        144,
        fr
          ? [
              "Euro Nouvelle Génération",
              "0 % brut ; frais max 2 %",
              "10 000 − 200 = 9 800 EUR",
              "Plancher illustré sur 1 an",
            ]
          : [
              "Euro Nouvelle Génération",
              "0% gross; maximum fee 2%",
              "10,000 − 200 = EUR9,800",
              "Illustrated one-year floor",
            ],
      );
      out += panel(
        p,
        "units",
        24,
        410,
        552,
        210,
        fr
          ? [
              "UC générique : 100 parts à 100 EUR",
              "Frais : 0,125 % par trimestre",
              "100 × (1 − 0,00125)^4 parts",
              "99,50094 parts en fin d’année",
              "Prix supposé : 90 EUR (−10 %)",
              "8 955,08 EUR : scénario",
            ]
          : [
              "Generic units: 100 at EUR100",
              "Quarterly policy fee: 0.125%",
              "100 × (1 − 0.00125)^4 units",
              "99.50094 units at year-end",
              "Assumed NAV: EUR90 (−10%)",
              "EUR8,955.08: scenario",
            ],
      );
    } else {
      out +=
        route(p, "euro-entry", [
          [500, 230],
          [500, 260],
          [249, 260],
          [249, 300],
        ]) +
        route(p, "units-entry", [
          [500, 260],
          [751, 260],
          [751, 300],
        ]);
      out += panel(
        p,
        "euro",
        24,
        300,
        450,
        178,
        fr
          ? [
              "Euro Nouvelle Génération",
              "0 % brut ; frais max 2 %",
              "10 000 − 200 = 9 800 EUR",
              "Plancher sous hypothèses",
            ]
          : [
              "Euro Nouvelle Génération",
              "0% gross; maximum fee 2%",
              "10,000 − 200 = EUR9,800",
              "Floor for this illustration",
            ],
      );
      out += panel(
        p,
        "units",
        526,
        300,
        450,
        178,
        fr
          ? [
              "UC générique : 100 parts",
              "Frais trimestriels : 0,125 %",
              "99,50094 parts × 90 EUR",
              "8 955,08 EUR : scénario",
            ]
          : [
              "Generic holding: 100 units",
              "Quarterly policy fee: 0.125%",
              "99.50094 units × EUR90",
              "EUR8,955.08: scenario",
            ],
      );
    }
    const x = m ? 24 : 330,
      width = m ? 552 : 500,
      ay = m ? 664 : 534;
    out += axis(
      p,
      x,
      ay,
      width,
      10000,
      [0, 2500, 5000, 7500, 10000],
      m ? "end" : "middle",
    );
    const values = [10000, 9800, 8955.084304709473],
      labels = fr
        ? ["Initial", "Euro : plancher", "UC : scénario"]
        : ["Initial", "Euro: floor", "Units: scenario"],
      numbers = fr
        ? ["10 000", "9 800", "8 955,08"]
        : ["10,000", "9,800", "8,955.08"];
    for (let i = 0; i < 3; i++) {
      const y = m ? 710 + i * 56 : 566 + i * 54,
        colour = ["muted", "signal", "topic-blue"][i];
      out += text(
        24,
        m ? y - 14 : y + 20,
        `${labels[i]}${m ? " : " + numbers[i] + " EUR" : ""}`,
        { fill: colour, maxWidth: m ? 552 : 280 },
      );
      out += bar(
        `${p}-amount-${i}`,
        x,
        y,
        (width * values[i]) / 10000,
        m ? 10 : 18,
        colour,
      );
      if (!m)
        out += text(976, y + 20, numbers[i], { anchor: "end", fill: colour });
    }
    out += note(
      m ? 872 : 732,
      fr
        ? [
            m
              ? "Hypothèses ; assureur supposé payer."
              : "EUR · Hypothèses ; assureur supposé payer le contrat.",
          ]
        : [
            m
              ? "Illustration; insurer fulfils policy."
              : "EUR · Illustration; insurer assumed to honour the policy.",
          ],
      w,
    );
    return out;
  });
}
function protection(lang, m) {
  return frame(lang, 2, m, ({ fr, w, p }) => {
    let out = "";
    if (m) {
      out += note(
        128,
        fr
          ? ["Éligibilité → droits → suite du contrat"]
          : ["Eligibility → rights → policy outcome"],
        w,
      );
      const groups = fr
        ? [
            [
              "France / FGAP",
              [
                "1 · ACPR ; assureur agréé",
                "2 · 70 000 EUR : provisions futures",
                "90 000 EUR : incapacité/invalidité",
                "ou rentes issues d’un décès",
                "Par personne et même assureur",
                "3 · Transfert ou procédure",
              ],
            ],
            [
              "Royaume-Uni / FSCS",
              [
                "1 · Éligibilité selon les règles PRA",
                "2 · 100 % : créance de long terme",
                "Sans plafond monétaire",
                "Réassurance exclue",
                "3 · Continuité ou transfert financé",
              ],
            ],
            [
              "Floride / FLAHIGA",
              [
                "1 · Liquidation ; tribunal ; membre",
                "2 · 250 000 USD net rachat/retrait",
                "Propriétaire et assureur membre",
                "Contrats regroupés ; résidence",
                "à la liquidation, en principe",
                "3 · Reprise ou gestion en procédure",
                "Excédent : créance en liquidation",
              ],
            ],
          ]
        : [
            [
              "France / FGAP",
              [
                "1 · ACPR; licensed insurer",
                "2 · EUR70,000: future provisions",
                "EUR90,000: disability/incapacity",
                "or annuities arising from death cover",
                "Per person and failed insurer",
                "3 · Transfer or applicable procedure",
              ],
            ],
            [
              "United Kingdom / FSCS",
              [
                "1 · Eligibility under PRA rules",
                "2 · 100%: protected long-term claim",
                "No monetary upper limit",
                "Reinsurance excluded",
                "3 · Continuity or funded transfer",
              ],
            ],
            [
              "Florida / FLAHIGA",
              [
                "1 · Court liquidation; member insurer",
                "2 · USD250,000 net surrender/",
                "withdrawal; owner / member insurer",
                "Policies combined; residence",
                "at liquidation, generally",
                "3 · Transfer / association management",
                "Excess: claim against the estate",
              ],
            ],
          ];
      const titleY = [156, 410, 632],
        startY = [194, 448, 670];
      for (let i = 0; i < 3; i++) {
        out +=
          text(24, titleY[i], groups[i][0], {
            weight: 700,
            fill: "signal",
            maxWidth: 552,
          }) +
          lines(24, startY[i], groups[i][1], { maxWidth: 552, leading: 32 });
        const first = startY[i],
          second = first + 32,
          last = first + (i === 0 ? 5 : i === 1 ? 4 : 5) * 32;
        out +=
          arrow(p, `rights-${i}`, 12, first + 8, 12, second - 8) +
          arrow(p, `outcome-${i}`, 12, second + 10, 12, last - 8);
      }
    } else {
      out += note(
        150,
        fr
          ? [
              "Trois procédures ; assiettes et éligibilités propres à chaque contrat.",
            ]
          : [
              "Three legal processes, with distinct eligibility and valuation bases.",
            ],
        w,
      );
      const names = fr
        ? ["France · FGAP", "UK · FSCS", "Floride · FLAHIGA"]
        : ["France · FGAP", "UK · FSCS", "Florida · FLAHIGA"];
      const opening = fr
        ? [
            ["1 · Décision ACPR", "Assureur agréé", "Code assurances"],
            ["1 · Éligibilité", "Assureur / contrat", "Demandeur : PRA"],
            [
              "1 · Liquidation",
              "Tribunal ; membre",
              "Propriétaire",
              "éligible",
            ],
          ]
        : [
            ["1 · ACPR decision", "Licensed insurer", "Insurance Code"],
            ["1 · Eligibility", "Insurer / policy", "Claimant: PRA rules"],
            ["1 · Liquidation", "Court; member", "Eligible owner"],
          ];
      const rights = fr
        ? [
            [
              "2 · Provisions",
              "prestations futures",
              "70 000 EUR",
              "90 000 EUR : rentes",
              "invalidité/incapacité",
              "ou issues de décès",
              "Personne / assureur",
            ],
            [
              "2 · Assurance",
              "de long terme",
              "100 % éligible",
              "Plafond monétaire :",
              "aucun",
              "Évaluer les droits",
              "Réassurance exclue",
            ],
            [
              "2 · Valeurs nettes",
              "rachat/retrait",
              "250 000 USD",
              "Par propriétaire,",
              "même assureur",
              "Résidence :",
              "à la liquidation,",
              "en principe",
            ],
          ]
        : [
            [
              "2 · Future benefits",
              "Provisions",
              "EUR70,000 general",
              "EUR90,000",
              "disability/incapacity",
              "or from death cover",
              "Per person / insurer",
            ],
            [
              "2 · Long-term",
              "insurance claim",
              "100% eligible",
              "No monetary cap",
              "Valuation rules",
              "Reinsurance",
              "excluded",
            ],
            [
              "2 · Net surrender",
              "withdrawal values",
              "USD250,000",
              "Per owner / insurer",
              "Policies combined",
              "Residence generally",
              "at liquidation",
            ],
          ];
      const outcomes = fr
        ? [
            ["3 · Transfert", "Fonds + assureur", "sinon procédure"],
            ["3 · Continuité", "ou transfert", "FSCS peut financer"],
            ["3 · Reprise", "ou gestion", "selon liquidation"],
          ]
        : [
            ["3 · Transfer", "Fund and insurer", "or legal procedure"],
            ["3 · Continuity", "or transfer", "FSCS may fund"],
            ["3 · Transfer", "or administration", "in liquidation"],
          ];
      for (let i = 0; i < 3; i++) {
        const x = 24 + i * 324;
        out +=
          text(x, 184, names[i], {
            weight: 700,
            fill: "signal",
            maxWidth: 304,
          }) +
          panel(p, `eligibility-${i}`, x, 204, 304, 144, opening[i], {
            padding: 8,
          }) +
          panel(p, `rights-${i}`, x, 372, 304, 240, rights[i], {
            padding: 8,
            leading: fr && i === 2 ? 28 : 32,
            top: fr && i === 2 ? 29 : 34,
          }) +
          panel(p, `outcome-${i}`, x, 634, 304, 112, outcomes[i], {
            padding: 8,
          }) +
          arrow(p, `eligibility-rights-${i}`, x + 152, 348, x + 152, 372) +
          arrow(p, `rights-outcome-${i}`, x + 152, 612, x + 152, 634);
      }
    }
    return out;
  });
}
export function insurancePromiseSvg(lang, kind, mobile = false) {
  if (
    typeof lang !== "string" ||
    !["fr", "en"].includes(lang) ||
    typeof kind !== "string" ||
    !INSURANCE_PROMISE_KINDS.includes(kind) ||
    typeof mobile !== "boolean"
  )
    throw new TypeError("Invalid insurance promise scene");
  return { signatures, capital, protection }[kind](lang, mobile);
}
