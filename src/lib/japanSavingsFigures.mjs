// Reviewed static chart copy and data; no external input reaches the SVG markup.
export const JAPAN_SAVINGS_KINDS = Object.freeze([
  "flows",
  "sectors",
  "hedge",
  "duration",
  "transmission",
]);
const COPY = {
  fr: [
    {
      title: "Dix mois de désinvestissement sur douze",
      desc: "Douze barres mensuelles en milliards de yens : octobre 2025 −38,5 ; novembre −64,9 ; décembre −254,3 ; janvier 2026 +40,2 ; février −618,7 ; mars −638,4 ; avril −80,2 ; mai +17,9 ; juin −41,3 ; juillet −10,6 ; août −137,3 ; septembre −288,6. Dix mois affichent des cessions nettes, deux des acquisitions nettes. Le cumul de janvier à septembre 2026 est de −1 757,0 milliards de yens. Les cessions incluent les remboursements et ne renseignent pas la destination des sommes.",
    },
    {
      title: "Les investisseurs vont dans des sens opposés",
      desc: "Sept barres divergentes montrent les soldes de transactions : banques, comptes bancaires, −11 739,2 milliards de yens ; trust banks, comptes fiduciaires, +11 415,2 ; entreprises d’instruments financiers, +2 992,6 ; autres catégories regroupées, −2 302,8 ; assureurs-vie, −1 757,0 ; trust banks, comptes bancaires, −1 483,5 ; gestionnaires de fonds de placement, −1 315,8. Total publié de l’ensemble du panel : −4 190,7. Les catégories détaillées totalisent −4 190,5 en raison des arrondis. Les comptes fiduciaires ne sont pas identifiés comme des fonds de pension.",
    },
    {
      title: "Le change peut inverser le classement",
      desc: "Graphique d’une relation calculée, avec hypothèses fictives : le rendement en yens augmente linéairement avec le taux de change à terme. Un capital de 15 000 yens converti au comptant à 150 yens par dollar achète pour 100 dollars une obligation versant 105 dollars en une seule fois après un an, sous hypothèse de remboursement. La vente à terme dès aujourd’hui de la totalité des 105 dollars donne 15 435 yens au taux de 147, soit 2,90 %, ou 15 592,5 yens au taux de 148,5, soit 3,95 %. La référence fictive en yens à 3 % donne 15 450 yens. Le taux à terme contient le coût économique de couverture ; ce n’est pas une commission ajoutée. Les risques de crédit ne sont pas comparés. La ligne horizontale à 3 % est la référence fictive en yens, et non une cotation de marché.",
    },
    {
      title: "Deux côtés du bilan réagissent",
      desc: "Une hausse parallèle des taux réduit la valeur actuelle des obligations à l’actif et celle des engagements futurs au passif. La variation du surplus économique dépend des sensibilités pondérées par les montants : A multiplié par la duration modifiée de l’actif, et L multiplié par la duration modifiée du passif. Au premier ordre, delta de A moins L égale environ L fois D L moins A fois D A, multiplié par delta r. Si la sensibilité du passif est supérieure, le surplus économique peut augmenter. Cela ne détermine pas à lui seul la direction du ratio ESR, qui dépend aussi du capital requis.",
    },
    {
      title: "Le coût de la dette se joue à la marge",
      desc: "Les coupons, remboursements, cessions et nouvelles primes alimentent des décisions de réinvestissement vers les JGB, les obligations étrangères, ou les actions et liquidités. Le change et le renouvellement de la couverture sont des décisions distinctes. Si la demande japonaise de dette étrangère recule et si les acheteurs de remplacement exigent un rendement plus élevé, le prix marginal baisse et le rendement monte. Le financement de nouvelles émissions et le refinancement peuvent alors coûter plus cher. Les autres acheteurs, l’offre de dette et les banques centrales modulent cette transmission. Les données de flux ne permettent pas de déduire les destinations.",
    },
  ],
  en: [
    {
      title: "Net disinvestment in ten of twelve months",
      desc: "Twelve monthly bars in JPY billion: October 2025 −38.5; November −64.9; December −254.3; January 2026 +40.2; February −618.7; March −638.4; April −80.2; May +17.9; June −41.3; July −10.6; August −137.3; September −288.6. Ten months show net disposals and two net acquisitions. January–September 2026 totals −JPY1,757.0 billion. Disposals include redemptions and do not identify where the money goes.",
    },
    {
      title: "Investors move in opposite directions",
      desc: "Seven diverging bars show net transactions: banks, banking accounts, −JPY11,739.2 billion; trust banks, trust accounts, +11,415.2; financial instruments firms, +2,992.6; other categories combined, −2,302.8; life insurers, −1,757.0; trust banks, banking accounts, −1,483.5; investment trust managers, −1,315.8. The separately published panel total is −4,190.7. Detailed categories sum to −4,190.5 because of rounding. Trust accounts are not identified as pension funds.",
    },
    {
      title: "FX can reverse the ranking",
      desc: "Chart of a calculated relationship under hypothetical assumptions: the yen return rises linearly with the forward exchange rate. JPY15,000 converted at a spot rate of JPY150 per dollar buys a USD100 bond with a single USD105 payment after one year, assuming repayment. Selling all USD105 forward today gives JPY15,435 at a forward rate of 147, a 2.90% return, or JPY15,592.5 at 148.5, a 3.95% return. A hypothetical 3% yen reference gives JPY15,450. The forward rate incorporates the economic hedging cost; this is not an added commission. Credit risks are not compared. The horizontal line at 3% is the hypothetical yen reference, not a market quotation.",
    },
    {
      title: "Both sides of the balance sheet respond",
      desc: "A parallel rise in rates reduces the present value of bonds on the asset side and of future obligations on the liability side. The change in economic surplus depends on amount-weighted sensitivities: A times asset modified duration and L times liability modified duration. To first order, the change in A minus L is approximately L times D L minus A times D A, multiplied by the rate change. If liability sensitivity is larger, economic surplus can rise. This alone does not determine the direction of the ESR ratio, which also depends on required capital.",
    },
    {
      title: "Debt is repriced at the margin",
      desc: "Coupons, redemptions, disposals and new premiums feed reinvestment choices among JGBs, foreign bonds, and equities or cash. Currency conversion and hedge rollover are distinct decisions. If Japanese demand for foreign debt falls and replacement buyers require a higher yield, the marginal price falls and yield rises. New issuance and refinancing can then cost more. Other buyers, debt supply and central banks shape this transmission. Transaction-flow data do not reveal the allocation destinations.",
    },
  ],
};
const MONTHLY = Object.freeze([
  -38.5, -64.9, -254.3, 40.2, -618.7, -638.4, -80.2, 17.9, -41.3, -10.6, -137.3,
  -288.6,
]);
const SECTORS = Object.freeze([
  -11739.2, 11415.2, 2992.6, -2302.8, -1757, -1483.5, -1315.8,
]);
const SOURCE_SETS = Object.freeze([
  "01 02 03",
  "02 05",
  "09",
  "13 14",
  "03 10 12 16 17",
]);
const esc = (value) =>
  String(value).replace(
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
const num = (value) => String(Math.round(value * 1000) / 1000);
const colour = (name) => `var(--color-${name})`;
const attrs = (value) =>
  Object.entries(value)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => `${k}="${esc(v)}"`)
    .join(" ");
const element = (tag, a, body = "") => `<${tag} ${attrs(a)}>${body}</${tag}>`;
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
  element(
    "text",
    {
      "data-panel": panel,
      "data-max-width": maxWidth,
      x: num(x),
      y: num(y),
      "font-family": "l0g Japan Savings",
      "font-size": size,
      "font-weight": weight,
      "text-anchor": anchor,
      fill: colour(fill),
    },
    esc(value),
  );
const lines = (x, y, values, options = {}) =>
  values
    .map((v, i) => text(x, y + i * (options.leading ?? 36), v, options))
    .join("");
const rect = (id, x, y, width, height, fill = "surface", rx = 8) =>
  element("rect", {
    id,
    x: num(x),
    y: num(y),
    width: num(width),
    height: num(height),
    rx,
    fill: colour(fill),
    stroke: colour("line-strong"),
    "stroke-width": 1.5,
  });
const line = (id, x1, y1, x2, y2, stroke = "line-strong", extra = {}) =>
  element("line", {
    id,
    x1: num(x1),
    y1: num(y1),
    x2: num(x2),
    y2: num(y2),
    stroke: colour(stroke),
    "stroke-width": 2,
    ...extra,
  });
const path = (id, d, stroke = "signal", extra = {}) =>
  element("path", {
    id,
    d,
    fill: "none",
    stroke: colour(stroke),
    "stroke-width": 2.5,
    ...extra,
  });
const circle = (id, cx, cy, r, stroke = "signal") =>
  element("circle", {
    id,
    cx: num(cx),
    cy: num(cy),
    r,
    fill: colour("ink"),
    stroke: colour(stroke),
    "stroke-width": 3,
  });
const number = (v, fr, decimals = 1) =>
  (v < 0 ? "−" : v > 0 ? "+" : "") +
  new Intl.NumberFormat(fr ? "fr-FR" : "en-GB", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(Math.abs(v));
const monthLabels = (fr) =>
  fr
    ? [
        "oct.",
        "nov.",
        "déc.",
        "janv.",
        "févr.",
        "mars",
        "avr.",
        "mai",
        "juin",
        "juil.",
        "août",
        "sept.",
      ]
    : [
        "Oct",
        "Nov",
        "Dec",
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
      ];
const titleLines = (index, fr, mobile) => {
  const titles = fr
    ? [
        ["Dix mois de cessions nettes", "sur douze"],
        ["Des investisseurs en sens opposés"],
        ["Le change peut inverser le classement"],
        ["Les deux côtés du bilan réagissent"],
        ["Le prix de la dette se joue à la marge"],
      ]
    : [
        ["Ten months of net", "disinvestment in twelve"],
        ["Investors move in opposite directions"],
        ["FX can reverse the ranking"],
        ["Both sides of the balance sheet respond"],
        ["Debt is repriced at the margin"],
      ];
  if (!mobile)
    return [
      fr
        ? [
            "Dix mois de désinvestissement sur douze",
            "Des investisseurs en sens opposés",
            "Le change peut inverser le classement",
            "Les deux côtés du bilan réagissent",
            "Le prix de la dette se joue à la marge",
          ][index]
        : [
            "Net disinvestment in ten of twelve months",
            "Investors move in opposite directions",
            "FX can reverse the ranking",
            "Both sides of the balance sheet respond",
            "Debt is repriced at the margin",
          ][index],
    ];
  return index === 0
    ? titles[0]
    : fr
      ? [
          titles[index][0]
            .split(" ")
            .slice(0, index === 1 ? 3 : 5)
            .join(" "),
          titles[index][0]
            .split(" ")
            .slice(index === 1 ? 3 : 5)
            .join(" "),
        ].filter(Boolean)
      : index === 1
        ? ["Investors move in", "opposite directions"]
        : index === 3
          ? ["Both sides of the", "balance sheet respond"]
          : index === 4
            ? ["Debt is repriced", "at the margin"]
            : ["FX can reverse", "the ranking"];
};
function frame(lang, index, mobile, height, body) {
  const fr = lang === "fr",
    w = mobile ? 600 : 1000,
    p = `japan-${lang}-f${index + 1}-${mobile ? "m" : "d"}`;
  const defs = ["signal", "accent", "amber"]
    .map((c) =>
      element(
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
  const heading = lines(24, 92, titleLines(index, fr, mobile), {
    size: mobile ? 34 : 38,
    weight: 700,
    leading: 42,
    maxWidth: w - 48,
  });
  const sources = SOURCE_SETS[index]
    .split(" ")
    .map((id, i) =>
      element(
        "a",
        { href: `#source-s${id}` },
        text((mobile ? 158 : 154) + i * 64, height - 16, `S${id}`, {
          fill: "muted",
        }),
      ),
    )
    .join("");
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${height}" style="width:100%;height:auto" class="l0g-japan-savings-svg" role="img" aria-labelledby="${p}-title ${p}-desc"><title id="${p}-title">${esc(COPY[lang][index].title)}</title><desc id="${p}-desc">${esc(COPY[lang][index].desc)}</desc><defs>${defs}</defs>` +
    rect(undefined, 0, 0, w, height, "ink", 0) +
    text(24, 36, `l0g / 0${index + 1}`, { weight: 700, fill: "signal" }) +
    text(w - 24, 36, "22.10.2026", { anchor: "end", fill: "muted" }) +
    heading +
    body({ fr, w, p, mobile }) +
    line(`${p}-source-rule`, 24, height - 47, w - 24, height - 47) +
    text(24, height - 16, fr ? "Sources :" : "Sources:", { fill: "muted" }) +
    sources +
    "</svg>"
  );
}
function monthly(lang, mobile) {
  return frame(lang, 0, mobile, mobile ? 930 : 790, ({ fr, w, p }) => {
    const labels = monthLabels(fr);
    let out = lines(
      24,
      mobile ? 186 : 148,
      mobile
        ? fr
          ? [
              "Assureurs-vie · dette étrangère",
              "Moyen / long terme · Md¥",
              "Oct. 2025 à sept. 2026",
            ]
          : [
              "Life insurers · foreign debt",
              "Medium / long term · JPYbn",
              "Oct 2025 to Sep 2026",
            ]
        : fr
          ? [
              "Assureurs-vie · dette étrangère à moyen / long terme",
              "Oct. 2025 à sept. 2026 · milliards de yens",
            ]
          : [
              "Life insurers · foreign medium / long-term debt",
              "Oct 2025 to Sep 2026 · JPY billion",
            ],
      { size: 28, fill: "muted", leading: 36, maxWidth: w - 48 },
    );
    if (mobile) {
      const x0 = 208,
        scale = 250 / 700,
        top = 310,
        row = 38;
      out +=
        text(x0, 290, "−700", { fill: "muted" }) +
        text(420, 290, "0", { fill: "muted", anchor: "end" }) +
        text(576, 290, "+100", { fill: "muted", anchor: "end" });
      const baseline = 420;
      out += line(
        `${p}-zero`,
        baseline,
        298,
        baseline,
        top + 11 * row + 20,
        "muted",
      );
      for (const [i, v] of MONTHLY.entries()) {
        const y = top + i * row;
        out += text(
          24,
          y + 22,
          labels[i] + (i === 0 ? " 25" : i === 3 ? " 26" : ""),
          { fill: "muted" },
        );
        out += rect(
          `${p}-bar-${i}`,
          v < 0 ? baseline + v * scale : baseline,
          y,
          Math.abs(v) * scale,
          22,
          v < 0 ? "accent" : "signal",
          2,
        );
        out += text(576, y + 22, number(v, fr), {
          anchor: "end",
          fill: v < 0 ? "accent" : "signal",
          weight: 700,
        });
      }
      out +=
        rect(`${p}-total`, 24, 792, 552, 54, "surface-2") +
        text(
          42,
          830,
          fr
            ? "Janv.–sept. 2026 : −1 757,0 Md¥"
            : "Jan–Sep 2026: −JPY1,757.0bn",
          { weight: 700, fill: "accent", maxWidth: 516, panel: `${p}-total` },
        );
      out += text(
        24,
        872,
        fr
          ? "Cessions, remboursements inclus."
          : "Net disposals, including redemptions.",
        { fill: "muted", maxWidth: 552 },
      );
    } else {
      const left = 110,
        right = 976,
        zero = 257,
        scale = 240 / 700,
        step = (right - left) / 12;
      for (const v of [-600, -400, -200, 0, 100]) {
        const y = zero - v * scale;
        out +=
          line(
            `${p}-grid-${Math.abs(v)}`,
            left,
            y,
            right,
            y,
            v === 0 ? "muted" : "line-strong",
          ) +
          text(94, y + 10, String(v).replace("-", "−"), {
            anchor: "end",
            fill: "muted",
          });
      }
      for (const [i, v] of MONTHLY.entries()) {
        const x = left + step * (i + 0.5),
          y = zero - v * scale;
        out +=
          rect(
            `${p}-bar-${i}`,
            x - 18,
            Math.min(y, zero),
            36,
            Math.abs(v) * scale,
            v < 0 ? "accent" : "signal",
            2,
          ) +
          text(x, 550 + (i % 2) * 36, number(v, fr), {
            anchor: "middle",
            size: 28,
            fill: v < 0 ? "accent" : "signal",
          }) +
          text(x, 624, labels[i], { anchor: "middle", fill: "muted" });
      }
      out +=
        text(200, 670, "2025", { anchor: "middle", fill: "muted" }) +
        text(640, 670, "2026", { anchor: "middle", fill: "muted" }) +
        text(
          976,
          730,
          fr ? "Janv.–sept. : −1 757,0 Md¥" : "Jan–Sep: −JPY1,757.0bn",
          { anchor: "end", weight: 700, fill: "accent" },
        );
    }
    return out;
  });
}
function sectors(lang, mobile) {
  return frame(lang, 1, mobile, mobile ? 930 : 750, ({ fr, w, p }) => {
    const labels = fr
      ? [
          ["Banques", "comptes bancaires"],
          ["Trust banks", "comptes fiduciaires"],
          ["Entreprises d’instruments", "financiers"],
          ["Autres catégories", "regroupées"],
          ["Assureurs-vie"],
          ["Trust banks", "comptes bancaires"],
          ["Gestionnaires de fonds", "de placement"],
        ]
      : [
          ["Banks", "banking accounts"],
          ["Trust banks", "trust accounts"],
          ["Financial instruments", "firms"],
          ["Other categories", "combined"],
          ["Life insurers"],
          ["Trust banks", "banking accounts"],
          ["Investment trust", "managers"],
        ];
    let out = lines(
      24,
      mobile ? 186 : 148,
      fr
        ? [
            "Dette étrangère · janv.–sept. 2026",
            mobile
              ? "Solde net · milliards de yens"
              : "Acquisitions − cessions · milliards de yens",
          ]
        : [
            "Foreign debt · Jan–Sep 2026",
            mobile
              ? "Net transactions · JPY billion"
              : "Acquisitions − disposals · JPY billion",
          ],
      { fill: "muted", maxWidth: w - 48 },
    );
    if (!mobile) {
      const one = fr
        ? [
            "Banques : comptes bancaires",
            "Trust banks : comptes fiduciaires",
            "Entreprises d’instruments financiers",
            "Autres catégories regroupées",
            "Assureurs-vie",
            "Trust banks : comptes bancaires",
            "Gestionnaires de fonds",
          ]
        : [
            "Banks: banking accounts",
            "Trust banks: trust accounts",
            "Financial instruments firms",
            "Other categories combined",
            "Life insurers",
            "Trust banks: banking accounts",
            "Investment trust managers",
          ];
      for (let i = 0; i < 7; i++) labels[i] = [one[i]];
    } else {
      const short = fr
        ? [
            ["Banques", "bancaires"],
            ["Trust banks", "fiduciaires"],
            ["Entreprises", "financières"],
            ["Autres", "catégories"],
            ["Assureurs", "vie"],
            ["Trust banks", "bancaires"],
            ["Gestion de", "fonds"],
          ]
        : [
            ["Banks", "banking"],
            ["Trust banks", "trust"],
            ["Financial", "firms"],
            ["Other", "categories"],
            ["Life", "insurers"],
            ["Trust banks", "banking"],
            ["Fund", "managers"],
          ];
      for (let i = 0; i < 7; i++) labels[i] = short[i];
    }
    const top = mobile ? 300 : 271,
      row = mobile ? 72 : 49,
      zero = mobile ? 310 : 650,
      scale = mobile ? 80 / 12000 : 100 / 12000;
    out += line(`${p}-zero`, zero, top - 24, zero, top + 6 * row + 30, "muted");
    for (const v of [-12000, 0, 12000])
      out += text(
        zero + v * scale,
        mobile ? 268 : 238,
        v === 0 ? "0" : v < 0 ? "−12 000" : "+12 000",
        { anchor: "middle", fill: "muted" },
      );
    for (const [i, v] of SECTORS.entries()) {
      const y = top + i * row;
      out += lines(24, y, labels[i], {
        size: 28,
        leading: 30,
        weight: i === 4 ? 700 : 400,
        maxWidth: mobile ? 190 : 520,
      });
      out += rect(
        `${p}-bar-${i}`,
        v < 0 ? zero + v * scale : zero,
        y - 17,
        Math.abs(v) * scale,
        22,
        v < 0 ? "accent" : "signal",
        2,
      );
      out += text(mobile ? 576 : 976, y + 8, number(v, fr), {
        anchor: "end",
        fill: v < 0 ? "accent" : "signal",
        weight: 700,
      });
    }
    const y = mobile ? 825 : 648;
    out += text(
      24,
      y,
      fr ? "Total publié : −4 190,7 Md¥" : "Published total: −JPY4,190.7bn",
      { weight: 700, fill: "signal", maxWidth: w - 48 },
    );
    if (!mobile)
      out += text(
        24,
        684,
        fr
          ? "Comptes fiduciaires : clientèle distincte des comptes bancaires."
          : "Trust accounts: a different client base from banking accounts.",
        { fill: "muted", maxWidth: w - 48 },
      );
    else
      out += text(
        24,
        866,
        fr
          ? "Catégories arrondies : −4 190,5 Md¥."
          : "Rounded categories: −JPY4,190.5bn.",
        { fill: "muted", maxWidth: w - 48 },
      );
    return out;
  });
}
function hedge(lang, mobile) {
  return frame(lang, 2, mobile, mobile ? 930 : 740, ({ fr, w, p }) => {
    let out = text(
      24,
      mobile ? 186 : 148,
      fr ? "EXEMPLE FICTIF · UN AN" : "HYPOTHETICAL · ONE YEAR",
      { weight: 700, fill: "amber" },
    );
    const y = mobile ? 218 : 183,
      boxW = mobile ? 168 : 288,
      xs = mobile ? [24, 216, 408] : [24, 356, 688];
    const vals = fr
      ? ["15 000 ¥", "100 $", "105 $"]
      : mobile
        ? ["15 000 ¥", "100 $", "105 $"]
        : ["JPY15,000", "USD100", "USD105"];
    const labels = fr
      ? [
          ["Comptant", "150 ¥ / $"],
          ["Obligation", "achetée"],
          ["Paiement", "à un an"],
        ]
      : [
          ["Spot rate", "150 ¥ / $"],
          ["Bond", "purchase"],
          ["Payment", "one year"],
        ];
    for (let i = 0; i < 3; i++) {
      const id = `${p}-stage-${i}`;
      out +=
        rect(id, xs[i], y, boxW, mobile ? 154 : 146) +
        text(xs[i] + 12, y + 38, vals[i], {
          size: mobile ? 28 : 34,
          weight: 700,
          fill: "signal",
          panel: id,
        }) +
        lines(xs[i] + 12, y + 80, labels[i], {
          size: 28,
          leading: 34,
          panel: id,
          maxWidth: boxW - 24,
        });
      if (i < 2)
        out += line(
          `${p}-flow-${i}`,
          xs[i] + boxW + 4,
          y + 64,
          xs[i + 1] - 6,
          y + 64,
          "signal",
          { "marker-end": `url(#${p}-signal-arrow)` },
        );
    }
    const chartTop = mobile ? 442 : 396,
      chartBottom = mobile ? 646 : 565,
      left = mobile ? 80 : 96,
      right = w - 46,
      low = 2.5,
      high = 4.2,
      xmin = 146.8,
      xmax = 148.7;
    const px = (f) => left + ((f - xmin) / (xmax - xmin)) * (right - left),
      py = (r) =>
        chartBottom - ((r - low) / (high - low)) * (chartBottom - chartTop);
    out += text(
      24,
      mobile ? 414 : 366,
      fr
        ? "Rendement yen (%) · 105 $ couverts"
        : "Yen return (%) · all USD105 hedged",
      { fill: "muted", maxWidth: w - 48 },
    );
    for (const r of [2.5, 3, 3.5, 4])
      out +=
        line(
          `${p}-grid-${r}`,
          left,
          py(r),
          right,
          py(r),
          r === 3 ? "muted" : "line-strong",
          r === 3 ? { "stroke-dasharray": "5 6" } : {},
        ) +
        text(left - 14, py(r) + 10, String(r).replace(".", fr ? "," : "."), {
          anchor: "end",
          fill: "muted",
        });
    out += path(
      `${p}-return-line`,
      `M ${num(px(xmin))} ${num(py(((1.05 * xmin) / 150 - 1) * 100))} L ${num(px(xmax))} ${num(py(((1.05 * xmax) / 150 - 1) * 100))}`,
    );
    for (const f of [147, 147.5, 148, 148.5])
      out += text(
        px(f),
        chartBottom + 38,
        String(f).replace(".", fr ? "," : "."),
        { anchor: "middle", fill: "muted" },
      );
    for (const [f, r] of [
      [147, 2.9],
      [148.5, 3.95],
    ])
      out += circle(
        `${p}-point-${f}`,
        px(f),
        py(r),
        7,
        f === 147 ? "accent" : "signal",
      );
    if (mobile) {
      out += text(
        24,
        760,
        fr ? "F = 147 → 2,90 % · 15 435 ¥" : "F = 147 → 2.90% · JPY15,435",
        { fill: "accent", weight: 700, maxWidth: 552 },
      );
      out += text(
        24,
        801,
        fr
          ? "F = 148,5 → 3,95 % · 15 592,5 ¥"
          : "F = 148.5 → 3.95% · JPY15,592.5",
        { fill: "signal", weight: 700, maxWidth: 552 },
      );
      out += text(
        24,
        856,
        fr
          ? "Référence fictive : 3 % · 15 450 ¥"
          : "Fictional reference: 3% · JPY15,450",
        { fill: "muted", maxWidth: 552 },
      );
    } else {
      out +=
        line(
          `${p}-low-leader-v`,
          px(147),
          py(2.9) - 9,
          px(147),
          py(2.9) - 48,
          "accent",
        ) +
        line(
          `${p}-low-leader-h`,
          px(147),
          py(2.9) - 48,
          px(147) + 14,
          py(2.9) - 48,
          "accent",
        );
      out +=
        text(px(147) + 18, py(2.9) - 60, fr ? "147 → 2,90 %" : "147 → 2.90%", {
          fill: "accent",
          weight: 700,
        }) +
        text(
          px(148.5) - 18,
          py(3.95) - 22,
          fr ? "148,5 → 3,95 %" : "148.5 → 3.95%",
          { fill: "signal", anchor: "end", weight: 700 },
        );
      out += text(
        24,
        670,
        fr
          ? "F = 147 : 15 435 ¥ · F = 148,5 : 15 592,5 ¥"
          : "F = 147: JPY15,435 · F = 148.5: JPY15,592.5",
        { fill: "paper", maxWidth: 952 },
      );
    }
    out += text(
      (left + right) / 2,
      chartBottom + 78,
      fr ? "À terme F (¥ / $)" : "Forward F (JPY / USD)",
      { anchor: "middle", fill: "muted" },
    );
    return out;
  });
}
function duration(lang, mobile) {
  return frame(lang, 3, mobile, mobile ? 930 : 790, ({ fr, w, p }) => {
    let out = lines(
      24,
      mobile ? 186 : 148,
      mobile
        ? fr
          ? ["Choc parallèle · flux fixes", "Approximation au premier ordre"]
          : ["Parallel shock · fixed cash flows", "First-order approximation"]
        : fr
          ? ["Choc parallèle · flux fixes · premier ordre"]
          : ["Parallel shock · fixed cash flows · first order"],
      { fill: "muted", maxWidth: w - 48 },
    );
    const startY = mobile ? 264 : 199;
    out +=
      rect(`${p}-rates`, 24, startY, w - 48, 74) +
      text(
        w / 2,
        startY + 47,
        fr ? "Taux d’actualisation ↑" : "Discount rates ↑",
        { weight: 700, anchor: "middle", panel: `${p}-rates` },
      );
    const y = startY + 118,
      h = mobile ? 168 : 145,
      boxW = (w - 80) / 2,
      xs = [24, w / 2 + 16];
    const labels = fr
      ? [
          [
            "ACTIF · A",
            "Obligations",
            mobile ? "Valeur ↓" : "Valeur actuelle ↓",
          ],
          [
            "PASSIF · L",
            "Engagements",
            mobile ? "Valeur ↓" : "Valeur actuelle ↓",
          ],
        ]
      : [
          ["ASSETS · A", "Bonds", mobile ? "Value ↓" : "Present value ↓"],
          [
            mobile ? "L · LIABILITIES" : "LIABILITIES · L",
            "Obligations",
            mobile ? "Value ↓" : "Present value ↓",
          ],
        ];
    for (let i = 0; i < 2; i++) {
      const id = `${p}-balance-${i}`,
        colour = i ? "accent" : "signal";
      out +=
        line(
          `${p}-rate-flow-${i}`,
          xs[i] + boxW / 2,
          startY + 76,
          xs[i] + boxW / 2,
          y - 5,
          colour,
          { "marker-end": `url(#${p}-${colour}-arrow)` },
        ) +
        rect(id, xs[i], y, boxW, h) +
        text(xs[i] + 16, y + 40, labels[i][0], {
          weight: 700,
          fill: colour,
          panel: id,
          maxWidth: boxW - 32,
        }) +
        text(xs[i] + 16, y + 84, labels[i][1], {
          panel: id,
          maxWidth: boxW - 32,
        }) +
        text(xs[i] + 16, y + 128, labels[i][2], {
          fill: colour,
          panel: id,
          maxWidth: boxW - 32,
        });
    }
    const by = y + h + (mobile ? 62 : 40);
    out += text(
      24,
      by,
      mobile
        ? fr
          ? "Sensibilités en montant"
          : "Compare weighted sensitivities"
        : fr
          ? "Comparer les sensibilités en montant"
          : "Compare amount-weighted sensitivities",
      { weight: 700, maxWidth: w - 48 },
    );
    out += text(w / 2, by + 60, "A × Dₐ   ↔   L × Dₗ", {
      size: mobile ? 34 : 38,
      weight: 700,
      anchor: "middle",
      fill: "signal",
    });
    out += mobile
      ? lines(w / 2, by + 104, ["Δ(A − L) ≈", "(L × Dₗ − A × Dₐ) × Δr"], {
          size: 28,
          anchor: "middle",
          weight: 700,
          maxWidth: w - 48,
        })
      : text(w / 2, by + 104, "Δ(A − L) ≈ (L × Dₗ − A × Dₐ) × Δr", {
          size: 34,
          anchor: "middle",
          weight: 700,
          maxWidth: w - 48,
        });
    out += lines(
      24,
      by + (mobile ? 182 : 154),
      fr
        ? ["Si L × Dₗ > A × Dₐ et Δr > 0 :", "le surplus A − L augmente."]
        : ["If L × Dₗ > A × Dₐ and Δr > 0:", "economic surplus A − L rises."],
      { fill: "paper", maxWidth: w - 48 },
    );
    out += text(
      24,
      mobile ? 861 : 726,
      fr
        ? mobile
          ? "ESR : le capital requis compte aussi."
          : "Le ratio ESR dépend aussi du capital requis."
        : "ESR also depends on required capital.",
      { fill: "amber", maxWidth: w - 48 },
    );
    return out;
  });
}
function transmission(lang, mobile) {
  return frame(lang, 4, mobile, mobile ? 936 : 750, ({ fr, w, p }) => {
    let out = lines(
      24,
      mobile ? 186 : 148,
      mobile
        ? fr
          ? ["CHAÎNE CONDITIONNELLE"]
          : ["CONDITIONAL CHAIN"]
        : fr
          ? ["CHAÎNE CONDITIONNELLE · flèches sans volume"]
          : ["CONDITIONAL CHAIN · arrows encode no volume"],
      { size: 28, fill: "amber", maxWidth: w - 48 },
    );
    const inputY = mobile ? 210 : 183,
      inputH = mobile ? 120 : 92,
      id = `${p}-input`;
    out +=
      rect(id, 24, inputY, w - 48, inputH) +
      text(
        42,
        inputY + 38,
        fr ? "Des liquidités à réinvestir" : "Cash available for reinvestment",
        { weight: 700, panel: id, maxWidth: w - 84 },
      ) +
      lines(
        42,
        inputY + 76,
        mobile
          ? fr
            ? ["Coupons, remboursements,", "cessions et nouvelles primes."]
            : ["Coupons, redemptions,", "disposals and new premiums."]
          : fr
            ? ["Coupons, remboursements, cessions et nouvelles primes."]
            : ["Coupons, redemptions, disposals and new premiums."],
        { panel: id, leading: 30, maxWidth: w - 84 },
      );
    const y = inputY + inputH + 38,
      boxW = mobile ? 168 : 288,
      h = mobile ? 135 : 127,
      xs = mobile ? [24, 216, 408] : [24, 356, 688];
    const labels = fr
      ? [
          ["JGB", ["Dette au Japon", "Conversion en ¥"]],
          ["Dette étrangère", ["Titres renouvelés", "Change / hedge"]],
          ["Actions / cash", ["Autre allocation", "Cash en devises"]],
        ]
      : [
          ["JGBs", ["Japanese debt", "JPY if needed"]],
          ["Foreign debt", ["Hold / replace", "FX / hedging"]],
          ["Equities / cash", ["Other allocation", "FX cash stays FX"]],
        ];
    if (mobile) {
      labels[0] = fr
        ? ["JGB", ["Au Japon", "Change ¥"]]
        : ["JGBs", ["Japan", "To JPY"]];
      labels[1] = fr
        ? ["Dette", ["Étrangère", "Changer"]]
        : ["Bonds", ["Foreign", "Replace"]];
      labels[2] = fr
        ? ["Actions", ["Cash", "Devises"]]
        : ["Equities", ["FX cash", "stays FX"]];
    }
    const branchY = y - 22,
      mid = w / 2;
    out +=
      line(`${p}-stem`, mid, inputY + inputH + 2, mid, branchY, "muted") +
      line(
        `${p}-branch`,
        xs[0] + boxW / 2,
        branchY,
        xs[2] + boxW / 2,
        branchY,
        "muted",
      );
    for (let i = 0; i < 3; i++) {
      const panel = `${p}-destination-${i}`,
        c = ["signal", "accent", "amber"][i];
      out +=
        line(
          `${p}-allocation-${i}`,
          xs[i] + boxW / 2,
          branchY,
          xs[i] + boxW / 2,
          y - 4,
          c,
          { "marker-end": `url(#${p}-${c}-arrow)` },
        ) +
        rect(panel, xs[i], y, boxW, h) +
        text(xs[i] + 12, y + 36, labels[i][0], {
          size: 28,
          fill: c,
          weight: 700,
          panel,
          maxWidth: boxW - 24,
        }) +
        lines(xs[i] + 12, y + 78, labels[i][1], {
          size: 28,
          leading: 32,
          panel,
          maxWidth: boxW - 24,
        });
    }
    const hedgeY = y + h + 30;
    out += text(
      24,
      hedgeY,
      mobile
        ? fr
          ? "Couverture : choix distinct."
          : "Hedging: a separate decision."
        : fr
          ? "Couverture : décision distincte du portefeuille."
          : "Hedging: a separate portfolio decision.",
      { fill: "muted", maxWidth: w - 48 },
    );
    const bottomY = hedgeY + 38;
    if (mobile) {
      const stages = fr
        ? [
            [
              "Si la demande du Japon recule…",
              "Remplaçants : rendement plus haut",
            ],
            [
              "Prix marginal ↓ · rendement ↑",
              "Un ajustement de marché possible",
            ],
            ["Émissions / refinancement", "Leur coût peut augmenter"],
          ]
        : [
            ["If Japanese demand falls…", "Replacements require higher yields"],
            ["Marginal price ↓ · yield ↑", "A possible market adjustment"],
            ["New issues / refinancing", "Their funding cost can rise"],
          ];
      for (let i = 0; i < 3; i++) {
        const yy = bottomY + i * 100,
          panel = `${p}-stage-${i}`;
        out +=
          rect(panel, 24, yy, 552, 80) +
          text(40, yy + 35, stages[i][0], {
            size: 28,
            weight: 700,
            fill: i === 0 ? "accent" : "signal",
            panel,
            maxWidth: 520,
          }) +
          text(40, yy + 65, stages[i][1], { size: 28, panel, maxWidth: 520 });
        if (i < 2)
          out += line(
            `${p}-repricing-${i}`,
            300,
            yy + 83,
            300,
            yy + 96,
            "signal",
            { "marker-end": `url(#${p}-signal-arrow)` },
          );
      }
      out += text(
        24,
        875,
        fr
          ? "Offre et acheteurs modulent la chaîne."
          : "Other actors shape transmission.",
        { fill: "muted", maxWidth: 552 },
      );
    } else {
      const stages = fr
        ? [
            [["Demande ↓"], ["Remplaçants :", "taux plus haut"]],
            [["Prix marginal ↓"], ["Rendement ↑", "Ajustement"]],
            [["Financement ↑"], ["Émissions", "Refinancement"]],
          ]
        : [
            [["Japan demand ↓"], ["New buyers", "require more yield"]],
            [["Marginal price ↓"], ["Yield ↑", "Adjustment"]],
            [["Funding cost ↑"], ["New issuance", "and refinancing"]],
          ];
      for (let i = 0; i < 3; i++) {
        const panel = `${p}-stage-${i}`;
        out +=
          rect(panel, xs[i], bottomY, boxW, 132) +
          lines(xs[i] + 12, bottomY + 37, stages[i][0], {
            size: 28,
            weight: 700,
            fill: i === 0 ? "accent" : "signal",
            panel,
            maxWidth: boxW - 24,
          }) +
          lines(xs[i] + 12, bottomY + 80, stages[i][1], {
            size: 28,
            leading: 33,
            panel,
            maxWidth: boxW - 24,
          });
        if (i < 2)
          out += line(
            `${p}-repricing-${i}`,
            xs[i] + boxW + 4,
            bottomY + 65,
            xs[i + 1] - 6,
            bottomY + 65,
            "signal",
            { "marker-end": `url(#${p}-signal-arrow)` },
          );
      }
      out += text(
        24,
        686,
        fr
          ? "Offre, acheteurs et banques centrales modulent la chaîne."
          : "Other buyers, supply and central banks shape transmission.",
        { fill: "muted", maxWidth: 952 },
      );
    }
    return out;
  });
}
export function japanSavingsSvg(lang, kind, mobile = false) {
  if (
    typeof lang !== "string" ||
    !["fr", "en"].includes(lang) ||
    typeof kind !== "string" ||
    !JAPAN_SAVINGS_KINDS.includes(kind) ||
    typeof mobile !== "boolean"
  )
    throw new TypeError("Invalid Japan savings figure variant");
  return [monthly, sectors, hedge, duration, transmission][
    JAPAN_SAVINGS_KINDS.indexOf(kind)
  ](lang, mobile);
}
