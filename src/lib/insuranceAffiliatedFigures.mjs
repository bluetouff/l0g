// Closed bilingual scenes; monetary stocks, transaction flows and reporting scopes remain distinct.
export const INSURANCE_AFFILIATED_KINDS = Object.freeze([
  "exposures",
  "transfers",
  "loan",
  "holding",
  "sector",
]);
export const INSURANCE_AFFILIATED_SOURCES = Object.freeze([
  "01",
  "13 14",
  "07 09 10",
  "01 03",
  "22",
]);
const COPY = {
  fr: [
    [
      "Athene : les actifs apparentés et leurs périmètres",
      "Au 30 juin 2026, Athene publie 314 090 millions de dollars d’actifs investis nets, mesure non-GAAP, dont 44 025 millions classés apparentés : 24 778 millions dans des véhicules de titrisation gérés par Apollo, 8 468 millions dans des fonds Apollo, 7 061 millions dans des plateformes d’origination et 3 718 millions dans des plateformes de retraite. Les quatre catégories totalisent 44 025 millions ; 44 025 / 314 090 = 14,0 % après arrondi. Pour les titrisations, le lien vient du gestionnaire du véhicule ; le collatéral, l’emprunteur ou l’autre débiteur est généralement non affilié à Athene. Les fonds peuvent aussi financer des emprunteurs externes. La vue GAAP de 70 616 millions inclut notamment des véhicules consolidés et des créances de réassurance à fonds retenus : périmètre et valorisation diffèrent. Une part de fonds, une obligation de plateforme et un prêt à la holding créent des droits différents. Barres depuis zéro, même échelle, unités en millions de dollars US.",
    ],
    [
      "Global Atlantic : vente et apport en nature",
      "En janvier 2024 KKR vend à Global Atlantic des participations de DCIF, Diversified Core Infrastructure Fund, pour 555 millions de dollars et de KPPA, KKR Property Partners Americas Fund, pour 353 millions, soit 908 millions. Les participations vont de KKR vers Global Atlantic ; la contrepartie de vente va en sens inverse, avec un mode de règlement non détaillé. Au premier semestre 2026 KKR apporte au capital de l’activité d’assurance 247 millions de dollars de titres de dette et de participations dans des fonds, évalués à la juste valeur. Trait plein : transfert d’actifs ; pointillés : contrepartie de vente. Flux d’opérations à deux périodes distinctes, flèches sans échelle monétaire.",
    ],
    [
      "Brookfield : principal, recours et échéances du prêt",
      "Le 7 mai 2026, ANGI et ses filiales, dans le périmètre assurance BWS, refinancent un prêt de 450 millions de dollars à des filiales de Brookfield Infrastructure Partners L.P. Le taux fixe annuel est de 6,33 %. Remboursement prévu le 7 mai 2031 et échéance finale le 7 mai 2036. Le contrat est sans recours à la partnership Brookfield Infrastructure Partners L.P. ; les filiales emprunteuses sont les débitrices. La frise suit une échelle de temps commune, de 2026 à 2036. Au 30 juin 2026, les prêts privés de BWS à des filiales Brookfield s’élèvent à environ 4,1 milliards de dollars, dont environ 3,8 milliards pour ANGI et ses filiales. Ces encours sont emboîtés, et non additionnés. Signataires précis et sûretés du prêt non détaillés dans les pièces retenues. Un refinancement ne mesure pas un apport net de liquidités. Cadres et flèches sans échelle monétaire.",
    ],
    [
      "Athene et Apollo : le prêt de holding",
      "Au 30 juin 2026 AHL, Athene Holding Ltd., a prêté 279 millions de dollars à AGM, Apollo Global Management, Inc., sur une facilité de 500 millions ; 221 millions restent non utilisés. La facilité inverse, AGM vers AHL, a une capacité de 500 millions et un encours nul. Le prêt est non garanti, porte intérêt au taux fédéral US applicable au moyen terme et arrive à échéance le 13 décembre 2028, ou avant à la demande d’AHL. AHL comptabilise une créance à l’actif, AGM une dette au passif. Les comptes consolidés Apollo éliminent la créance et la dette internes ; le contrat entre AHL et AGM demeure. Barres à l’échelle de la capacité de 500 millions. Le prêt de holding est présenté séparément des 44 025 millions d’investissements apparentés.",
    ],
    [
      "NAIC : le périmètre des placements affiliés",
      "Assureurs-vie américains, encours fin 2025, valeur comptable ou valeur comptable ajustée. L’étude NAIC publiée en septembre 2026 indique 321 milliards de dollars d’investissements déclarés affiliés, environ 5 % de la trésorerie et des placements de l’ensemble des assureurs-vie américains. Le tableau arrondi affiche 322 milliards, tandis que le texte donne 321 milliards. Quatre annexes définissent le périmètre : D partie 1 section 1, obligations de crédit ; D partie 1 section 2, titrisations ABS ; BA, autres placements à long terme ; DA, placements à court terme. Environ 28 % représentent une exposition de crédit à un affilié ; 72 %, complément calculé, couvrent d’autres relations d’affiliation, notamment le gestionnaire d’une titrisation, un fonds ou une autre structure d’investissement. Parts arrondies, sans montant de crédit précis déduit. La classification identifie une relation à examiner ; le risque dépend du débiteur, des actifs sous-jacents, du rang du titre et des clauses du contrat.",
    ],
  ],
  en: [
    [
      "Athene: related-party assets and reporting scopes",
      "At 30 June 2026 Athene reports $314,090 million of net invested assets, a non-GAAP measure, including $44,025 million classified as related party: $24,778 million in Apollo-managed securitization vehicles, $8,468 million in Apollo funds, $7,061 million in origination platforms and $3,718 million in retirement services platforms. The four categories total $44,025 million; 44,025 / 314,090 rounds to 14.0%. For securitizations the relationship is with the vehicle manager; collateral, borrower or other credit party is generally unaffiliated with Athene. Funds may also finance external borrowers. The $70,616 million GAAP view includes consolidated vehicles and funds-withheld reinsurance receivables: valuation and scope differ. Fund interests, platform bonds and holding-company loans create distinct claims. Bars start at zero on a common scale; values in US$ million.",
    ],
    [
      "Global Atlantic: sale and in-kind contribution",
      "In January 2024 KKR sells Global Atlantic interests in DCIF, the Diversified Core Infrastructure Fund, for $555 million and KPPA, KKR Property Partners Americas Fund, for $353 million, totaling $908 million. Fund interests move from KKR to Global Atlantic; sale consideration moves the other way, with the settlement method not detailed. In the first half of 2026 KKR contributes $247 million of debt securities and fund interests to the capital of the insurance business, measured at fair value. Solid lines show asset transfers; the dashed line shows sale consideration. Transaction flows at two distinct periods; arrows are not scaled by value.",
    ],
    [
      "Brookfield: loan principal, recourse and repayment dates",
      "On 7 May 2026 ANGI and subsidiaries, within the BWS insurance scope, refinance a $450 million loan to subsidiaries of Brookfield Infrastructure Partners L.P. The fixed annual interest rate is 6.33%. Anticipated repayment is 7 May 2031 and final maturity is 7 May 2036. The loan is non-recourse to Brookfield Infrastructure Partners L.P.; the borrowing subsidiaries are the debtors. A common timeline runs from 2026 to 2036. At 30 June 2026 BWS private loans to Brookfield subsidiaries total approximately $4.1 billion, including approximately $3.8 billion at ANGI and subsidiaries. These reporting scopes are nested rather than added. Exact signatories and collateral are not detailed in the selected disclosures. Refinancing does not measure new net cash. Frames and arrows are not scaled by value.",
    ],
    [
      "Athene and Apollo: the holding-company loan",
      "At 30 June 2026 AHL, Athene Holding Ltd., has lent $279 million to AGM, Apollo Global Management, Inc., under a $500 million facility, leaving $221 million undrawn. The reverse AGM-to-AHL facility has $500 million capacity and zero outstanding. The loan is unsecured, bears interest at the US mid-term applicable federal rate, and matures on 13 December 2028, or earlier at AHL’s request. AHL records a receivable as an asset and AGM a payable as a liability. Apollo consolidated accounts eliminate the intercompany receivable and payable; the AHL–AGM contract remains in place. Bars use the $500 million contractual capacity. The holding-company loan is presented separately from $44,025 million of related-party investments.",
    ],
    [
      "NAIC: the affiliated investment reporting scope",
      "US life insurers, year-end 2025 balances at book or adjusted carrying value. The NAIC study published in September 2026 reports $321 billion of affiliated investments, about 5% of all US life insurers’ total cash and invested assets. The rounded table shows $322 billion while the text gives $321 billion. Four schedules define the scope: D part 1 section 1, issuer credit obligations; D part 1 section 2, asset-backed securities; BA, other long-term investments; DA, short-term investments. About 28% represents credit exposure to an affiliate; the calculated 72% complement covers other affiliation relationships, including a securitization manager, a fund or another investment structure. Shares are rounded; no precise credit amount is inferred. Classification identifies the relationship to examine; risk depends on the borrower, underlying assets, instrument seniority and contractual terms.",
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
      "font-family": "l0g Insurance Affiliated",
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
    p = `insurance-aff-${lang}-f${index + 1}-${mobile ? "m" : "d"}`;
  const titles = fr
    ? [
        ["Athene : actifs apparentés", "et périmètres"],
        ["Global Atlantic :", "vente et apport en nature"],
        ["Brookfield : prêt, recours", "et échéances"],
        ["Athene et Apollo :", "le prêt de holding"],
        ["NAIC : le périmètre", "des placements affiliés"],
      ]
    : [
        ["Athene: related-party", "assets and reporting scopes"],
        ["Global Atlantic: sale", "and in-kind contribution"],
        ["Brookfield: loan terms", "and repayment dates"],
        ["Athene and Apollo:", "the holding-company loan"],
        ["NAIC: the affiliated", "investment reporting scope"],
      ];
  const desktop = fr
    ? [
        "Athene : actifs apparentés et périmètres",
        "Global Atlantic : vente et apport en nature",
        "Brookfield : prêt, recours et échéances",
        "Athene et Apollo : le prêt de holding",
        "NAIC : le périmètre des placements affiliés",
      ]
    : [
        "Athene: related-party asset scopes",
        "Global Atlantic: sale and in-kind contribution",
        "Brookfield: loan terms and repayment dates",
        "Athene and Apollo: the holding-company loan",
        "NAIC: affiliated investment scope",
      ];
  const defs = ["signal", "topic-blue", "amber"]
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
  const refs = INSURANCE_AFFILIATED_SOURCES[index]
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
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${height}" style="width:100%;height:auto" class="l0g-insurance-affiliated-svg" role="img" aria-labelledby="${p}-title ${p}-desc"><title id="${p}-title">${esc(COPY[lang][index][0])}</title><desc id="${p}-desc">${esc(COPY[lang][index][1])}</desc><defs>${defs}</defs>` +
    rect(undefined, 0, 0, w, height, "ink", 0) +
    text(24, 36, `l0g / 0${index + 1}`, { weight: 700, fill: "signal" }) +
    text(w - 24, 36, "23.10.2026", { anchor: "end", fill: "muted" }) +
    lines(24, 92, mobile ? titles[index] : [desktop[index]], {
      size: mobile ? 34 : 36,
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
function exposures(lang, mobile) {
  return frame(lang, 0, mobile, mobile ? 930 : 740, ({ fr, w, p }) => {
    let out = text(
      24,
      mobile ? 180 : 145,
      fr
        ? "30.06.2026 · M$ US · net non-GAAP"
        : "30.06.2026 · US$m · net non-GAAP",
      { fill: "muted", maxWidth: w - 48 },
    );
    out += text(
      24,
      mobile ? 230 : 200,
      fr ? "314 090 M$ investis nets" : "$314,090m net invested",
      { weight: 700, maxWidth: w - 48 },
    );
    out += text(
      24,
      mobile ? 273 : 245,
      fr ? "44 025 M$ apparentés · 14,0 %" : "$44,025m related party · 14.0%",
      { weight: 700, fill: "signal", maxWidth: w - 48 },
    );
    const values = [24778, 8468, 7061, 3718],
      labels = fr
        ? [
            "Titrisations gérées par Apollo",
            "Fonds Apollo",
            "Plateformes d’origination",
            "Plateformes de retraite",
          ]
        : [
            mobile
              ? "Apollo-managed vehicles"
              : "Apollo-managed securitizations",
            "Apollo funds",
            "Origination platforms",
            mobile ? "Retirement platforms" : "Retirement services platforms",
          ];
    const start = mobile ? 24 : 470,
      scale = (mobile ? 552 : 506) / 44025;
    values.forEach((v, i) => {
      const y = mobile ? 350 + i * 105 : 335 + i * 68;
      out += text(24, y - 20, labels[i], { maxWidth: mobile ? 552 : 446 });
      out +=
        bar(`${p}-track-${i}`, start, y, mobile ? 552 : 506, 24, "surface-2") +
        bar(
          `${p}-share-${i}`,
          start,
          y,
          v * scale,
          24,
          i === 0 ? "signal" : "topic-blue",
        );
      out += text(
        w - 24,
        y - 20,
        fr
          ? v.toLocaleString("fr-FR").replaceAll("\u202f", " ")
          : v.toLocaleString("en-US"),
        { anchor: "end", weight: 700, maxWidth: 180 },
      );
    });
    out += text(start, mobile ? 787 : 610, "0", { fill: "muted" });
    out += text(w - 24, mobile ? 787 : 610, fr ? "44 025 M$" : "$44,025m", {
      anchor: "end",
      fill: "muted",
    });
    out += lines(
      24,
      mobile ? 833 : 644,
      fr
        ? ["Vue GAAP : 70 616 M$", "Périmètre et valorisation différents"]
        : ["GAAP view: $70,616m", "Different scope and valuation"],
      { fill: "muted", maxWidth: w - 48 },
    );
    return out;
  });
}
function transfers(lang, mobile) {
  return frame(lang, 1, mobile, mobile ? 930 : 750, ({ fr, w, p }) => {
    let out = text(
      24,
      mobile ? 184 : 150,
      fr ? "Opérations publiées · M$ US" : "Disclosed transactions · US$m",
      { fill: "muted", maxWidth: w - 48 },
    );
    const left = 24,
      right = mobile ? 366 : 700,
      bw = mobile ? 210 : 276;
    out += text(
      24,
      mobile ? 228 : 198,
      fr ? "JANV. 2024 · VENTE DE PARTS" : "JAN 2024 · SALE OF INTERESTS",
      { weight: 700, fill: "topic-blue", maxWidth: w - 48 },
    );
    const sy = mobile ? 250 : 224;
    out +=
      panel(
        p,
        "seller",
        left,
        sy,
        bw,
        102,
        ["KKR"],
        fr ? ["Vendeur"] : ["Seller"],
      ) +
      panel(
        p,
        "buyer",
        right,
        sy,
        bw,
        102,
        mobile ? ["Global", "Atlantic"] : ["Global Atlantic"],
        mobile ? [] : fr ? ["Acquéreur"] : ["Buyer"],
      );
    out += arrow(
      p,
      "sale",
      `M ${left + bw} ${sy + 54} H ${right}`,
      "topic-blue",
    );
    if (!mobile)
      out += text(500, sy + 39, fr ? "908 M$" : "$908m", {
        anchor: "middle",
        weight: 700,
        fill: "topic-blue",
      });
    out += text(
      24,
      mobile ? 399 : 374,
      fr ? "DCIF 555 + KPPA 353 = 908 M$" : "DCIF 555 + KPPA 353 = $908m",
      { weight: 700, maxWidth: w - 48 },
    );
    out += arrow(
      p,
      "consideration",
      `M ${right} ${mobile ? 450 : 424} H ${left + bw}`,
      "amber",
      true,
    );
    out += text(
      24,
      mobile ? 490 : 468,
      fr
        ? "Contrepartie · règlement non détaillé"
        : "Consideration · settlement unspecified",
      { fill: "muted", maxWidth: w - 48 },
    );
    out += text(
      24,
      mobile ? 550 : 523,
      fr ? "S1 2026 · APPORT EN NATURE" : "H1 2026 · IN-KIND CONTRIBUTION",
      { weight: 700, fill: "signal", maxWidth: w - 48 },
    );
    const cy = mobile ? 574 : 548;
    out +=
      panel(
        p,
        "contributor",
        left,
        cy,
        bw,
        102,
        ["KKR"],
        fr ? ["Apporteur"] : ["Contributor"],
      ) +
      panel(
        p,
        "recipient",
        right,
        cy,
        bw,
        102,
        mobile ? ["Global", "Atlantic"] : ["Global Atlantic"],
        mobile ? [] : fr ? ["Capital reçu"] : ["Capital received"],
      );
    out += arrow(p, "contribution", `M ${left + bw} ${cy + 54} H ${right}`);
    if (!mobile)
      out += text(500, cy + 39, fr ? "247 M$" : "$247m", {
        anchor: "middle",
        weight: 700,
        fill: "signal",
      });
    out += lines(
      24,
      mobile ? 726 : 690,
      mobile
        ? fr
          ? [
              "247 M$ · juste valeur",
              "Dette et parts de fonds au capital",
              "Flèches sans échelle monétaire",
            ]
          : [
              "$247m · fair value",
              "Debt and fund interests into capital",
              "Arrows not scaled by value",
            ]
        : fr
          ? ["247 M$ · dette et parts de fonds à juste valeur"]
          : ["$247m · debt and fund interests at fair value"],
      { fill: "muted", maxWidth: w - 48 },
    );
    return out;
  });
}
function loan(lang, mobile) {
  return frame(lang, 2, mobile, mobile ? 930 : 760, ({ fr, w, p }) => {
    let out = text(
      24,
      mobile ? 180 : 145,
      fr ? "7 mai 2026 · 450 M$ refinancés" : "7 May 2026 · $450m refinanced",
      { weight: 700, maxWidth: w - 48 },
    );
    out += text(
      24,
      mobile ? 220 : 185,
      fr ? "6,33 % / an · taux fixe" : "6.33% / year · fixed interest",
      { fill: "signal", maxWidth: w - 48 },
    );
    const by = mobile ? 250 : 220,
      bw = mobile ? 240 : 400,
      right = mobile ? 336 : 650;
    out += panel(
      p,
      "lender",
      24,
      by,
      bw,
      110,
      mobile
        ? fr
          ? ["ANGI", "et filiales"]
          : ["ANGI +", "subsidiaries"]
        : fr
          ? ["ANGI et filiales"]
          : ["ANGI + subsidiaries"],
      mobile ? [] : fr ? ["Périmètre BWS"] : ["BWS reporting scope"],
    );
    out += panel(
      p,
      "borrower",
      right,
      by,
      mobile ? 240 : 326,
      110,
      mobile
        ? fr
          ? ["Filiales BIP"]
          : ["BIP", "subsidiaries"]
        : fr
          ? ["Filiales BIP"]
          : ["BIP subsidiaries"],
      mobile ? [] : fr ? ["Débitrices"] : ["Borrowers"],
    );
    out += arrow(p, "principal", `M ${24 + bw} ${by + 55} H ${right}`);
    out += arrow(
      p,
      "interest",
      `M ${right} ${mobile ? 398 : 366} H ${24 + bw}`,
      "topic-blue",
    );
    out += text(24, mobile ? 398 : 366, fr ? "Intérêts" : "Interest", {
      fill: "topic-blue",
    });
    out += text(
      24,
      mobile ? 440 : 409,
      fr ? "Partnership BIP hors recours" : "Non-recourse to BIP partnership",
      { fill: "muted", maxWidth: w - 48 },
    );
    const x0 = mobile ? 100 : 130,
      x1 = mobile ? 500 : 870,
      ty = mobile ? 500 : 463;
    out += line(`${p}-timeline`, x0, ty, x1, ty, "signal");
    for (let i = 0; i < 3; i++) {
      const x = x0 + ((x1 - x0) * i) / 2;
      out += line(`${p}-date-${i}`, x, ty - 8, x, ty + 8, "signal");
      out += text(x, ty + 46, String(2026 + i * 5), {
        anchor: "middle",
        weight: 700,
      });
      const detail = fr
        ? [
            ["7 mai", "Refinancé"],
            ["7 mai", "Prévu"],
            ["7 mai", "Finale"],
          ]
        : [
            ["7 May", "Refinanced"],
            ["7 May", "Anticipated"],
            ["7 May", "Final maturity"],
          ];
      out += lines(x, ty + 82, detail[i], {
        anchor: "middle",
        fill: "muted",
        maxWidth: mobile ? 200 : 270,
      });
    }
    const ny = mobile ? 661 : 618,
      nh = mobile ? 193 : 88;
    out += panel(
      p,
      "bws",
      24,
      ny,
      w - 48,
      nh,
      fr
        ? ["BWS : ~ 4,1 Md$ de prêts privés"]
        : ["BWS: ~ $4.1bn private loans"],
      mobile
        ? []
        : fr
          ? ["Brookfield · 30.06.2026"]
          : ["Brookfield · 30.06.2026"],
    );
    out += panel(
      p,
      "angi",
      mobile ? 60 : 570,
      mobile ? ny + 78 : ny + 12,
      mobile ? 480 : 390,
      mobile ? 98 : 64,
      fr ? ["ANGI : ~ 3,8 Md$"] : ["ANGI: ~ $3.8bn"],
      mobile
        ? fr
          ? ["Encours inclus · 30.06.2026"]
          : ["Included balance · 30.06.2026"]
        : [],
    );
    return out;
  });
}
function holding(lang, mobile) {
  return frame(lang, 3, mobile, mobile ? 930 : 760, ({ fr, w, p }) => {
    let out = text(
      24,
      mobile ? 180 : 145,
      fr ? "30.06.2026 · M$ US" : "30.06.2026 · US$m",
      { fill: "muted" },
    );
    const by = mobile ? 215 : 185,
      bw = mobile ? 240 : 340,
      right = mobile ? 336 : 636;
    out +=
      panel(
        p,
        "ahl",
        24,
        by,
        bw,
        98,
        ["AHL"],
        fr ? ["Créancier"] : ["Lender"],
      ) +
      panel(
        p,
        "agm",
        right,
        by,
        bw,
        98,
        ["AGM"],
        fr ? ["Débiteur"] : ["Borrower"],
      );
    out += arrow(p, "parent-loan", `M ${24 + bw} ${by + 52} H ${right}`);
    if (!mobile)
      out += text(500, by + 36, fr ? "279 M$" : "$279m", {
        anchor: "middle",
        fill: "signal",
        weight: 700,
      });
    const y = mobile ? 365 : 343,
      scale = (w - 48) / 500;
    out += text(24, y - 22, fr ? "279 utilisés" : "279 drawn", {
      fill: "signal",
      weight: 700,
    });
    out += text(w - 24, y - 22, fr ? "221 non utilisés" : "221 undrawn", {
      anchor: "end",
      fill: "muted",
    });
    out +=
      bar(`${p}-capacity`, 24, y, w - 48, 28, "surface-2") +
      bar(`${p}-drawn`, 24, y, 279 * scale, 28, "signal");
    out +=
      text(24, y + 63, "0", { fill: "muted" }) +
      text(w - 24, y + 63, fr ? "Capacité : 500 M$" : "Capacity: $500m", {
        anchor: "end",
        fill: "muted",
      });
    out += text(
      24,
      mobile ? 475 : 450,
      fr ? "AGM → AHL : 0 M$ sur 500 M$" : "AGM → AHL: $0m of $500m",
      { weight: 700, fill: "topic-blue", maxWidth: w - 48 },
    );
    out += lines(
      24,
      mobile ? 506 : 480,
      fr
        ? mobile
          ? [
              "AHL → AGM : non garanti",
              "Taux fédéral US, moyen terme",
              "13.12.2028 ou avant, demande AHL",
            ]
          : [
              "Prêt AHL → AGM : non garanti",
              "Taux fédéral US applicable au moyen terme",
              "Échéance : 13.12.2028 ou avant à la demande d’AHL",
            ]
        : [
            "AHL → AGM: unsecured",
            "US mid-term applicable federal rate",
            "13.12.2028 or earlier at AHL request",
          ],
      { fill: "muted", maxWidth: w - 48 },
    );
    const cards = fr
      ? [
          [
            ["AHL"],
            mobile ? ["Créance de 279 M$"] : ["Actif : créance", "279 M$"],
          ],
          [
            ["AGM"],
            mobile ? ["Dette de 279 M$"] : ["Passif : dette", "279 M$"],
          ],
          [
            ["Apollo consolidé"],
            mobile
              ? ["Soldes internes éliminés"]
              : ["Soldes internes", "éliminés"],
          ],
        ]
      : [
          [
            ["AHL"],
            mobile ? ["$279m receivable"] : ["Asset: receivable", "$279m"],
          ],
          [
            ["AGM"],
            mobile ? ["$279m payable"] : ["Liability: payable", "$279m"],
          ],
          [
            ["Consolidated"],
            mobile
              ? ["Internal balances eliminated"]
              : ["Internal balances", "eliminated"],
          ],
        ];
    cards.forEach(([head, body], i) => {
      out += panel(
        p,
        "view-" + i,
        mobile ? 24 : 24 + i * 326,
        mobile ? 600 + i * 92 : 575,
        mobile ? 552 : 300,
        mobile ? 82 : 126,
        head,
        mobile ? body : body.map((t) => t),
      );
    });
    return out;
  });
}
function sector(lang, mobile) {
  return frame(lang, 4, mobile, mobile ? 930 : 760, ({ fr, w, p }) => {
    let out = lines(
      24,
      mobile ? 180 : 145,
      mobile
        ? fr
          ? ["Assureurs-vie US · fin 2025", "Valeur comptable ou ajustée"]
          : [
              "US life insurers · year-end 2025",
              "Book or adjusted carrying value",
            ]
        : fr
          ? ["Assureurs-vie US · fin 2025 · valeur comptable ou ajustée"]
          : [
              "US life insurers · year-end 2025 · book or adjusted carrying value",
            ],
      { fill: "muted", maxWidth: w - 48 },
    );
    out += text(
      24,
      mobile ? 266 : 205,
      fr ? "321 Md$ affiliés · environ 5 %" : "$321bn affiliated · about 5%",
      { weight: 700, fill: "signal", maxWidth: w - 48 },
    );
    const types = fr
      ? [
          [["D · 1 · 1"], ["Obligations", "de crédit"]],
          [["D · 1 · 2"], ["Titrisations", "ABS"]],
          [["BA · autres"], ["Placements", "long terme"]],
          [["DA"], ["Placements", "court terme"]],
        ]
      : [
          [["D · 1 · 1"], ["Issuer credit", "obligations"]],
          [["D · 1 · 2"], ["Asset-backed", "securities"]],
          [["BA"], ["Other long-term", "investments"]],
          [["DA"], ["Short-term", "investments"]],
        ];
    types.forEach(([head, body], i) => {
      out += panel(
        p,
        "schedule-" + i,
        24 + (i % 2) * (mobile ? 288 : 488),
        (mobile ? 305 : 245) + Math.floor(i / 2) * 138,
        mobile ? 264 : 464,
        120,
        head,
        body,
      );
    });
    const y = mobile ? 642 : 579,
      len = w - 48;
    out += text(
      24,
      y - 22,
      fr ? "~ 28 % crédit à un affilié" : "~ 28% credit to an affiliate",
      { weight: 700, fill: "topic-blue", maxWidth: w - 48 },
    );
    out +=
      bar(`${p}-share-track`, 24, y, len, 28, "surface-2") +
      bar(`${p}-credit-share`, 24, y, len * 0.28, 28, "topic-blue") +
      bar(`${p}-other-share`, 24 + len * 0.28, y, len * 0.72, 28, "signal");
    out += text(
      24,
      y + 64,
      fr ? "~ 72 % autres liens d’affiliation" : "~ 72% other affiliations",
      { weight: 700, fill: "signal", maxWidth: w - 48 },
    );
    out += lines(
      24,
      mobile ? 766 : 691,
      mobile
        ? fr
          ? [
              "Gestionnaire, fonds, structure :",
              "le contrat précise le risque.",
              "Texte : 321 Md$ · tableau : 322 Md$",
            ]
          : [
              "Manager, fund or structure:",
              "contract terms define the risk.",
              "Text: $321bn · table: $322bn",
            ]
        : fr
          ? ["Texte : 321 Md$ · tableau arrondi : 322 Md$"]
          : ["Text: $321bn · rounded table: $322bn"],
      { fill: "muted", maxWidth: w - 48 },
    );
    return out;
  });
}
const RENDER = Object.freeze({ exposures, transfers, loan, holding, sector });
export function insuranceAffiliatedSvg(lang, kind, mobile = false) {
  if (
    typeof lang !== "string" ||
    !["fr", "en"].includes(lang) ||
    typeof kind !== "string" ||
    !INSURANCE_AFFILIATED_KINDS.includes(kind) ||
    typeof mobile !== "boolean"
  )
    throw new TypeError("Invalid insurance affiliated scene");
  return RENDER[kind](lang, mobile);
}
