// Controlled bilingual SVG scenes; no external or user-controlled markup.
export const INSURANCE_CONTRACTS_KINDS = Object.freeze([
  "debtor",
  "amounts",
  "rothesay",
  "reinsurance",
]);
const COPY = {
  fr: [
    {
      title: "AT&T : le débiteur change au transfert",
      desc: "Avant le transfert, le régime AT&T paie les prestations concernées. Après le transfert, deux filiales d’assurance Athene émettent les contrats de rente. Environ 96 000 personnes sont concernées. Les actifs du régime servent à payer la prime. L’actionnariat Apollo et Athene Holding est distinct de la dette contractuelle des assureurs. Les liens de contrôle intermédiaires sont omis.",
    },
    {
      title: "Les actifs transférés et l’écart comptable",
      desc: "AT&T, exercice 2023, en millions de dollars américains. Obligations de pension sorties : 8 067. Actifs transférés : 7 704. Les deux barres partent de zéro et utilisent la même échelle. L’écart de 363 représente un gain de règlement comptable avant impôt, pas une commission ou un taux de rendement.",
    },
    {
      title: "Prudential–Rothesay : qui doit la rente ?",
      desc: "En mars 2018, PAC réassure une activité de rentes auprès de Rothesay tout en restant juridiquement responsable envers les assurés. Le transfert juridique prend effet le 15 décembre 2021 : environ 350 000 polices ont pour assureur Rothesay Life plc ; environ 33 000 restent chez PAC et réassurées par Rothesay. Prudential administre temporairement les contrats transférés pour Rothesay. Nombres arrondis au stade final de 2021, sans comparaison avec les effectifs de 2018.",
    },
    {
      title: "Réassurer la rente : deux contrats distincts",
      desc: "Schéma générique. L’assureur doit la rente à l’assuré. Un contrat de réassurance oblige séparément le réassureur envers l’assureur, avec une prime initiale et des garanties selon le contrat. Si une clause de recapture est déclenchée, l’assureur reprend les risques cédés et récupère les actifs en garantie dans les conditions contractuelles. Son obligation envers l’assuré demeure. La recapture peut survenir avant une faillite. Aucun portefeuille AT&T ni réassureur précis n’est attribué par ce schéma.",
    },
  ],
  en: [
    {
      title: "AT&T: the debtor changes at the transfer",
      desc: "Before the transfer, the AT&T plan pays the covered benefits. After the transfer, two Athene insurance subsidiaries issue the annuity contracts. Approximately 96,000 people are covered. Plan assets pay the premium. Ownership through Apollo and Athene Holding is distinct from the insurers’ contractual debt. Intermediate ownership links are omitted.",
    },
    {
      title: "Transferred assets and the accounting difference",
      desc: "AT&T, fiscal 2023, in millions of US dollars. Pension obligations settled: 8,067. Assets transferred: 7,704. Both bars start at zero and use the same scale. The difference of 363 is a pre-tax accounting settlement gain, not a fee or a rate of return.",
    },
    {
      title: "Prudential–Rothesay: who owes the annuity?",
      desc: "In March 2018, PAC reinsures an annuity business with Rothesay while retaining legal responsibility to policyholders. The legal transfer takes effect on 15 December 2021: around 350,000 policies move to Rothesay Life plc; around 33,000 remain with PAC and are reinsured by Rothesay. Prudential temporarily administers transferred policies on Rothesay’s behalf. Rounded counts refer to the final 2021 stage, without comparison to 2018 totals.",
    },
    {
      title: "Reinsuring the annuity: two separate contracts",
      desc: "Generic diagram. The insurer owes the annuity to the policyholder. A separate reinsurance contract creates obligations from the reinsurer to the insurer, with an initial premium and collateral according to the contract. When a recapture clause is triggered, the insurer reassumes ceded risks and recovers collateral under the contractual terms. Its policyholder obligation remains. Recapture may occur before insolvency. This diagram does not assign an AT&T portfolio to any named reinsurer.",
    },
  ],
};
const SOURCE_SETS = ["01 03 04 27", "02", "11 12 13", "18 20"];
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
const element = (tag, attrs, body = "") =>
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
  element(
    "text",
    {
      "data-panel": panel,
      "data-max-width": maxWidth,
      x: num(x),
      y: num(y),
      "font-family": "l0g Insurance Contracts",
      "font-size": size,
      "font-weight": weight,
      "text-anchor": anchor,
      fill: color(fill),
    },
    esc(value),
  );
const lines = (x, y, values, options = {}) =>
  values
    .map((v, i) => text(x, y + i * (options.leading ?? 34), v, options))
    .join("");
const rect = (id, x, y, w, h, fill = "surface", rx = 8) =>
  element("rect", {
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
  element("line", {
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
  element("path", {
    id,
    d,
    fill: "none",
    stroke: color(stroke),
    "stroke-width": 2.5,
    ...extra,
  });
const titles = (fr, index, mobile) =>
  fr
    ? [
        mobile
          ? ["AT&T : le débiteur", "change au transfert"]
          : ["AT&T : le débiteur change au transfert"],
        mobile
          ? ["Deux montants,", "un écart comptable"]
          : ["Actifs transférés et écart comptable"],
        mobile
          ? ["Prudential–Rothesay :", "du risque au contrat"]
          : ["Prudential–Rothesay : du risque au contrat"],
        mobile
          ? ["Réassurer la rente :", "deux contrats distincts"]
          : ["Réassurer la rente : deux contrats distincts"],
      ][index]
    : [
        mobile
          ? ["AT&T: the debtor changes", "on transfer"]
          : ["AT&T: the debtor changes on transfer"],
        mobile
          ? ["Two amounts,", "one accounting gain"]
          : ["Assets transferred and accounting gain"],
        mobile
          ? ["Prudential–Rothesay:", "from risk to contract"]
          : ["Prudential–Rothesay: from risk to contract"],
        mobile
          ? ["Reinsuring annuities:", "two separate contracts"]
          : ["Reinsurance: two separate contracts"],
      ][index];
function frame(lang, index, mobile, height, body) {
  const fr = lang === "fr",
    w = mobile ? 600 : 1000,
    p = `insurance-${lang}-f${index + 1}-${mobile ? "m" : "d"}`;
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
  const sources = SOURCE_SETS[index]
    .split(" ")
    .map((s, i) =>
      element(
        "a",
        { href: `#source-s${s}` },
        text(158 + i * 64, height - 16, `S${s}`, { fill: "muted" }),
      ),
    )
    .join("");
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${height}" style="width:100%;height:auto" class="l0g-insurance-contracts-svg" role="img" aria-labelledby="${p}-title ${p}-desc"><title id="${p}-title">${esc(COPY[lang][index].title)}</title><desc id="${p}-desc">${esc(COPY[lang][index].desc)}</desc><defs>${defs}</defs>` +
    rect(undefined, 0, 0, w, height, "ink", 0) +
    text(24, 36, `l0g / 0${index + 1}`, { weight: 700, fill: "signal" }) +
    text(w - 24, 36, "23.10.2026", { anchor: "end", fill: "muted" }) +
    lines(24, 92, titles(fr, index, mobile), {
      size: mobile ? 34 : 38,
      weight: 700,
      leading: 42,
      maxWidth: w - 48,
    }) +
    body({ fr, w, p, mobile }) +
    line(`${p}-source-rule`, 24, height - 47, w - 24, height - 47) +
    text(24, height - 16, fr ? "Sources :" : "Sources:", { fill: "muted" }) +
    sources +
    "</svg>"
  );
}
const arrow = (p, id, x1, y1, x2, y2, c = "signal") =>
  line(`${p}-${id}`, x1, y1, x2, y2, c, {
    "marker-end": `url(#${p}-${c}-arrow)`,
  });
function debtor(lang, mobile) {
  return frame(lang, 0, mobile, mobile ? 936 : 790, ({ fr, w, p }) => {
    let out = text(
      24,
      mobile ? 186 : 148,
      fr
        ? mobile
          ? "Transfert de pensions · USA · 2023"
          : "Transfert de pensions · États-Unis · 2023"
        : mobile
          ? "Pension transfer · US · 2023"
          : "Pension risk transfer · United States · 2023",
      { fill: "muted", maxWidth: w - 48 },
    );
    if (mobile) {
      out += lines(
        24,
        237,
        fr
          ? [
              "Accord : 26.04 · Clôture : 03.05.2023",
              "Paiements Athene : dès août 2023",
            ]
          : [
              "Agreement 26 Apr · Close 3 May 2023",
              "Athene payments: from Aug 2023",
            ],
        { fill: "muted", maxWidth: 552 },
      );
      const left = `${p}-before`,
        right = `${p}-after`;
      out +=
        rect(left, 24, 307, 552, 94) +
        text(
          42,
          344,
          fr ? "AVANT : régime AT&T" : "BEFORE: AT&T pension plan",
          { weight: 700, fill: "signal", panel: left, maxWidth: 516 },
        ) +
        text(
          42,
          380,
          fr ? "Débiteur des prestations" : "Debtor for the covered benefits",
          { panel: left, maxWidth: 516 },
        );
      out +=
        arrow(p, "assets", 300, 404, 300, 443, "signal") +
        text(330, 433, fr ? "Actifs / prime" : "Assets / premium", {
          fill: "muted",
          maxWidth: 246,
        });
      out +=
        rect(right, 24, 447, 552, 134) +
        text(
          42,
          484,
          fr ? "APRÈS : deux assureurs Athene" : "AFTER: two Athene insurers",
          { weight: 700, fill: "signal", panel: right, maxWidth: 516 },
        ) +
        lines(
          42,
          524,
          fr
            ? [
                "Le contrat précise son émetteur.",
                "L’assureur doit la rente prévue.",
              ]
            : [
                "Each contract identifies its issuer.",
                "The issuer owes the agreed annuity.",
              ],
          { panel: right, maxWidth: 516, leading: 34 },
        );
      const people = `${p}-people`;
      out +=
        rect(people, 24, 615, 552, 64) +
        text(
          42,
          657,
          fr ? "Environ 96 000 personnes" : "About 96,000 people covered",
          { weight: 700, fill: "signal", panel: people, maxWidth: 516 },
        );
      out +=
        path(`${p}-plan-annuity`, "M 24 354 H 8 V 595 H 80 V 611", "signal", {
          "marker-end": `url(#${p}-signal-arrow)`,
        }) + arrow(p, "insurer-annuity", 450, 585, 450, 611, "signal");
      out += text(24, 720, fr ? "PROPRIÉTÉ DU GROUPE" : "GROUP OWNERSHIP", {
        weight: 700,
        fill: "amber",
      });
      const xs = [24, 216, 408],
        names = fr
          ? [["Apollo"], ["Athene", "Holding"], ["Filiales", "Athene"]]
          : [["Apollo"], ["Athene", "Holding"], ["Insurer", "entities"]];
      for (let i = 0; i < 3; i++) {
        const id = `${p}-owner-${i}`;
        out +=
          rect(id, xs[i], 752, 168, 82) +
          lines(xs[i] + 12, 784, names[i], {
            size: 28,
            weight: 700,
            leading: 34,
            panel: id,
            maxWidth: 144,
          });
        if (i < 2)
          out += arrow(
            p,
            `ownership-${i}`,
            xs[i] + 172,
            790,
            xs[i + 1] - 6,
            790,
            "amber",
          );
      }
      out += text(
        24,
        871,
        fr
          ? "Propriété et dette : liens distincts."
          : "Ownership and contractual debt differ.",
        { fill: "muted", maxWidth: 552 },
      );
    } else {
      out += lines(
        24,
        193,
        fr
          ? [
              "Accord 26.04.2023 · Clôture 03.05.2023",
              "Paiements Athene dès août 2023",
            ]
          : [
              "Agreement 26 Apr 2023 · Close 3 May 2023",
              "Athene payments from Aug 2023",
            ],
        { fill: "muted", maxWidth: 952 },
      );
      const a = `${p}-before`,
        b = `${p}-after`;
      out +=
        rect(a, 24, 240, 338, 166) +
        lines(
          42,
          282,
          fr
            ? ["AVANT : AT&T", "Régime de retraite", "Prestations dues"]
            : ["BEFORE: AT&T", "Pension plan", "Plan benefits"],
          { panel: a, maxWidth: 302, leading: 44, weight: 700 },
        );
      out +=
        rect(b, 522, 240, 454, 260) +
        text(
          540,
          274,
          fr ? "APRÈS : deux émetteurs" : "AFTER: issuing insurers",
          { panel: b, fill: "signal", weight: 700, maxWidth: 418 },
        ) +
        lines(
          540,
          316,
          [
            "Athene Annuity and",
            "Life Company",
            "Athene Annuity & Life",
            "Assurance Company",
            "of New York",
          ],
          { panel: b, maxWidth: 418, leading: 34 },
        ) +
        text(
          540,
          486,
          fr ? "Deux émetteurs distincts." : "Two distinct issuing entities.",
          { panel: b, fill: "muted", maxWidth: 418 },
        );
      out += line(`${p}-issuer-rule`, 540, 360, 958, 360);
      out +=
        arrow(p, "assets", 366, 326, 516, 326, "signal") +
        lines(380, 374, fr ? ["Actifs", "prime"] : ["Assets", "premium"], {
          fill: "muted",
          maxWidth: 142,
          leading: 34,
        });
      const people = `${p}-people`;
      out +=
        rect(people, 24, 520, 952, 84) +
        text(
          42,
          554,
          fr ? "Environ 96 000 personnes" : "About 96,000 people covered",
          { weight: 700, fill: "signal", panel: people, maxWidth: 916 },
        ) +
        text(
          42,
          589,
          fr
            ? "Le contrat ou certificat identifie l’assureur tenu de payer."
            : "The contract or certificate identifies the liable insurer.",
          { panel: people, maxWidth: 916 },
        );
      out +=
        arrow(p, "plan-annuity", 190, 410, 190, 516, "signal") +
        arrow(p, "insurer-annuity", 750, 504, 750, 516, "signal");
      const xs = [24, 356, 688],
        names = ["Apollo", "Athene Holding", fr ? "Filiales" : "Insurers"];
      for (let i = 0; i < 3; i++) {
        const id = `${p}-owner-${i}`;
        out +=
          rect(id, xs[i], 628, 288, 64) +
          text(xs[i] + 16, 672, names[i], {
            size: 28,
            weight: 700,
            fill: "amber",
            panel: id,
            maxWidth: 256,
          });
        if (i < 2)
          out += arrow(
            p,
            `ownership-${i}`,
            xs[i] + 292,
            660,
            xs[i + 1] - 6,
            660,
            "amber",
          );
      }
      out += text(
        24,
        719,
        fr
          ? "Propriété du groupe et dette des contrats : deux liens distincts."
          : "Group ownership and annuity debt are separate legal relationships.",
        { fill: "muted", maxWidth: 952 },
      );
    }
    return out;
  });
}
function amounts(lang, mobile) {
  return frame(lang, 1, mobile, mobile ? 800 : 620, ({ fr, w, p }) => {
    let out = text(
      24,
      mobile ? 186 : 148,
      fr
        ? mobile
          ? "AT&T · 2023 · millions de $ US"
          : "AT&T · exercice 2023 · millions de dollars US"
        : "AT&T · fiscal 2023 · USD million",
      { fill: "muted", maxWidth: w - 48 },
    );
    const left = 24,
      right = w - 24,
      scale = (right - left) / 8500,
      rows = mobile ? [274, 456] : [224, 351],
      values = [8067, 7704];
    for (let i = 0; i < 2; i++) {
      const y = rows[i];
      out +=
        text(
          left,
          y - 33,
          fr
            ? i
              ? "Actifs transférés"
              : "Engagements retirés"
            : i
              ? "Assets transferred"
              : "Obligations settled",
          { weight: 700, maxWidth: w - 48 },
        ) +
        rect(
          `${p}-bar-${i}`,
          left,
          y,
          values[i] * scale,
          35,
          i ? "signal" : "topic-blue",
          2,
        ) +
        text(
          right,
          y + 82,
          fr ? (i ? "7704" : "8067") : i ? "7,704" : "8,067",
          {
            anchor: "end",
            size: 34,
            weight: 700,
            fill: i ? "signal" : "topic-blue",
          },
        );
    }
    const axisY = mobile ? 591 : 467;
    out += line(`${p}-axis`, left, axisY, right, axisY, "muted");
    for (const v of [0, 2000, 4000, 6000, 8000]) {
      const x = left + v * scale;
      out +=
        line(`${p}-tick-${v}`, x, axisY - 8, x, axisY + 8, "muted") +
        text(x, axisY + 42, String(v), {
          anchor: v === 0 ? "start" : "middle",
          fill: "muted",
        });
    }
    out +=
      text(
        24,
        mobile ? 680 : 558,
        fr ? "8 067 − 7 704 = 363" : "8,067 − 7,704 = 363",
        {
          weight: 700,
          fill: "amber",
          maxWidth: w - 48,
        },
      ) +
      text(
        mobile ? 24 : w - 24,
        mobile ? 724 : 558,
        fr ? "Gain avant impôt" : "Pre-tax gain",
        { anchor: mobile ? "start" : "end", fill: "muted" },
      );
    return out;
  });
}
function rothesay(lang, mobile) {
  return frame(lang, 2, mobile, mobile ? 936 : 790, ({ fr, w, p }) => {
    let out = text(
      24,
      mobile ? 186 : 148,
      fr
        ? mobile
          ? "Risque, contrat, administration"
          : "Risque, débiteur et administration distincts"
        : mobile
          ? "Risk, contract, administration"
          : "Risk, legal debtor and administration differ",
      { fill: "muted", maxWidth: w - 48 },
    );
    const dates = [
      "14.03.2018",
      "16.08.2019",
      "02.12.2020",
      "24.11.2021",
      "15.12.2021",
    ];
    const events = fr
      ? [
          ["Accord + réassurance"],
          ["Transfert refusé"],
          ["Refus annulé en appel"],
          ["Transfert autorisé"],
          ["Transfert effectif"],
        ]
      : [
          ["Agreement + reinsurance"],
          ["Transfer refused"],
          ["Refusal overturned"],
          ["Transfer approved"],
          ["Transfer effective"],
        ];
    if (mobile) {
      out += line(`${p}-timeline`, 45, 236, 45, 520, "line-strong");
      for (let i = 0; i < 5; i++) {
        const y = 246 + i * 65;
        out +=
          rect(
            `${p}-event-${i}`,
            38,
            y - 15,
            14,
            14,
            i === 4 ? "signal" : "muted",
            0,
          ) +
          text(72, y, dates[i], {
            weight: 700,
            fill: i === 4 ? "signal" : "paper",
          }) +
          lines(
            266,
            y,
            events[i][0].split(" ").reduce((a, word) => {
              if (!a.length || a.at(-1).length + word.length > 16) a.push(word);
              else a[a.length - 1] += " " + word;
              return a;
            }, []),
            { maxWidth: 310, size: 28, leading: 30 },
          );
      }
      out += text(
        24,
        588,
        fr ? "PARTAGE FINAL · DÉCEMBRE 2021" : "FINAL SPLIT · DECEMBER 2021",
        { weight: 700, fill: "signal", maxWidth: 552 },
      );
      const cards = [
        [
          "350 000",
          fr ? "Rothesay : débiteur direct" : "Rothesay: direct insurer",
        ],
        [
          "33 000",
          fr
            ? "PAC assure ; Rothesay réassure"
            : "PAC insures; Rothesay reinsures",
        ],
      ];
      for (let i = 0; i < 2; i++) {
        const id = `${p}-policies-${i}`,
          y = 616 + i * 100;
        out +=
          rect(id, 24, y, 552, 86) +
          text(
            40,
            y + 34,
            (fr ? "Environ " : "About ") +
              cards[i][0].replace(" ", fr ? " " : ",") +
              (fr ? " polices" : " policies"),
            {
              weight: 700,
              panel: id,
              fill: i ? "amber" : "signal",
              maxWidth: 520,
            },
          ) +
          text(40, y + 68, cards[i][1], { panel: id, maxWidth: 520 });
      }
      out += lines(
        24,
        849,
        fr
          ? [
              "Administration Prudential transitoire.",
              "Effectifs arrondis (2021).",
            ]
          : [
              "Prudential: transitional administration.",
              "Schematic steps; rounded final counts.",
            ],
        { fill: "muted", maxWidth: 552, leading: 30 },
      );
    } else {
      for (let i = 0; i < 5; i++) {
        const x = 24 + i * 194;
        out +=
          text(x, 221, dates[i], {
            weight: 700,
            fill: i === 4 ? "signal" : "paper",
          }) +
          lines(
            x,
            266,
            events[i][0].split(" ").reduce((a, word) => {
              if (!a.length || a.at(-1).length + word.length + 1 > 10)
                a.push(word);
              else a[a.length - 1] += " " + word;
              return a;
            }, []),
            { maxWidth: 178, leading: 32 },
          );
        if (i < 4)
          out += arrow(p, `step-${i}`, x + 8, 345, x + 185, 345, "signal");
      }
      out += lines(
        24,
        397,
        fr
          ? [
              "En 2018, PAC reste tenue envers les assurés.",
              "Rothesay porte le risque réassuré.",
            ]
          : [
              "In 2018, PAC remains the legal insurer.",
              "Rothesay bears the reinsured risk.",
            ],
        { maxWidth: 952, leading: 34 },
      );
      const ids = [`${p}-policies-0`, `${p}-policies-1`];
      out += rect(ids[0], 24, 446, 454, 180) + rect(ids[1], 522, 446, 454, 180);
      for (let i = 0; i < 2; i++) {
        const x = i ? 540 : 42;
        out +=
          text(
            x,
            491,
            (fr ? "Environ " : "About ") +
              (fr ? (i ? "33 000" : "350 000") : i ? "33,000" : "350,000") +
              (fr ? " polices" : " policies"),
            {
              weight: 700,
              fill: i ? "amber" : "signal",
              panel: ids[i],
              size: 30,
              maxWidth: 418,
            },
          ) +
          lines(
            x,
            540,
            i
              ? fr
                ? ["PAC reste l’assureur.", "Rothesay reste réassureur."]
                : ["PAC remains the insurer.", "Rothesay remains reinsurer."]
              : fr
                ? ["Rothesay Life plc devient", "l’assureur directement tenu."]
                : ["Rothesay Life plc becomes", "the directly liable insurer."],
            { panel: ids[i], maxWidth: 418, leading: 36 },
          );
      }
      out +=
        text(
          24,
          678,
          fr
            ? "15.12.2021 : effet juridique · nombres arrondis au stade final."
            : "15.12.2021: legal effect · rounded counts at the final stage.",
          { fill: "muted", maxWidth: 952 },
        ) +
        text(
          24,
          718,
          fr
            ? "Prudential : administration transitoire · branches schématiques."
            : "Prudential: transitional administration · schematic branches.",
          { fill: "muted", maxWidth: 952 },
        );
    }
    return out;
  });
}
function reinsurance(lang, mobile) {
  return frame(lang, 3, mobile, mobile ? 936 : 790, ({ fr, w, p }) => {
    let out = text(
      24,
      mobile ? 186 : 148,
      fr
        ? mobile
          ? "Schéma générique · garanties"
          : "Schéma générique · contrats et garanties"
        : mobile
          ? "Generic reinsurance mechanism"
          : "Generic mechanism · contracts and collateral",
      { fill: "muted", maxWidth: w - 48 },
    );
    if (mobile) {
      const names = fr
        ? [
            ["Assuré", "Créancier de la rente"],
            ["Assureur", "Débiteur de la rente"],
            ["Réassureur", "Contrepartie de l’assureur"],
          ]
        : [
            ["Policyholder", "Annuity creditor"],
            ["Insurer", "Annuity debtor"],
            ["Reinsurer", "Counterparty to the insurer"],
          ];
      for (let i = 0; i < 3; i++) {
        const id = `${p}-party-${i}`,
          y = 224 + i * 124;
        out +=
          rect(id, 24, y, 552, 86) +
          text(42, y + 35, names[i][0], {
            weight: 700,
            panel: id,
            fill: i === 0 ? "paper" : "signal",
            maxWidth: 516,
          }) +
          text(42, y + 69, names[i][1], { panel: id, maxWidth: 516 });
      }
      out +=
        arrow(p, "annuity", 300, 344, 300, 314, "signal") +
        text(330, 335, fr ? "rente" : "annuity", { fill: "muted" });
      out +=
        arrow(p, "reinsurance-dues", 360, 468, 360, 438, "signal") +
        text(386, 459, fr ? "flux dus" : "payments", { fill: "muted" }) +
        arrow(p, "premium", 240, 438, 240, 468, "amber") +
        text(84, 459, fr ? "prime" : "premium", { fill: "amber" });
      const g = `${p}-collateral`;
      out +=
        rect(g, 24, 600, 552, 100) +
        text(42, 637, fr ? "Actifs en garantie" : "Collateral assets", {
          weight: 700,
          panel: g,
          maxWidth: 516,
        }) +
        text(
          42,
          675,
          fr
            ? "Récupération selon les accords."
            : "Recovery under the agreements.",
          { panel: g, maxWidth: 516 },
        );
      out +=
        arrow(p, "collateral-from-reinsurer", 300, 562, 300, 596, "amber") +
        path(
          `${p}-collateral-to-insurer`,
          "M 24 650 H 8 V 391 H 20",
          "signal",
          {
            "marker-end": `url(#${p}-signal-arrow)`,
            "stroke-dasharray": "5 6",
          },
        );
      out += text(
        24,
        748,
        fr ? "SI RECAPTURE DÉCLENCHÉE" : "RECAPTURE CLAUSE TRIGGERED",
        { weight: 700, fill: "amber", maxWidth: 552 },
      );
      out += lines(
        24,
        778,
        fr
          ? [
              "1. Reprendre les risques cédés",
              "2. Récupérer les garanties prévues",
              "3. Adapter actifs, liquidité et capital",
            ]
          : [
              "1. Reassume the ceded risks",
              "2. Recover the agreed collateral",
              "3. Adjust assets, liquidity / capital",
            ],
        { maxWidth: 552, leading: 32 },
      );
      out += text(
        24,
        875,
        fr ? "Assureur : rente toujours due." : "Insurer: annuity still owed.",
        { weight: 700, fill: "signal", maxWidth: 552 },
      );
    } else {
      const xs = [24, 380, 736],
        names = fr
          ? [
              ["Assuré", "Créancier de la rente"],
              ["Assureur", "Débiteur de la rente"],
              ["Réassureur", "Contrepartie"],
            ]
          : [
              ["Policyholder", "Annuity creditor"],
              ["Insurer", "Annuity debtor"],
              ["Reinsurer", "Counterparty"],
            ];
      for (let i = 0; i < 3; i++) {
        const id = `${p}-party-${i}`;
        out +=
          rect(id, xs[i], 219, 240, 136) +
          text(xs[i] + 14, 258, names[i][0], {
            weight: 700,
            panel: id,
            maxWidth: 212,
          }) +
          lines(
            xs[i] + 14,
            301,
            (fr
              ? [
                  ["Créancier", "de la rente"],
                  ["Débiteur", "de la rente"],
                  ["Contrepartie"],
                ]
              : [
                  ["Annuity", "creditor"],
                  ["Annuity", "debtor"],
                  ["Counterparty"],
                ])[i],
            { panel: id, maxWidth: 212, leading: 32 },
          );
      }
      out +=
        arrow(p, "annuity", 374, 279, 270, 279, "signal") +
        text(322, 319, fr ? "rente" : "annuity", {
          anchor: "middle",
          fill: "muted",
        });
      out +=
        arrow(p, "reinsurance-dues", 730, 264, 626, 264, "signal") +
        text(678, fr ? 241 : 205, fr ? "flux dus" : "payments", {
          anchor: "middle",
          fill: "muted",
        }) +
        arrow(p, "premium", 626, 325, 730, 325, "amber") +
        text(678, 393, fr ? "prime" : "premium", {
          anchor: "middle",
          fill: "amber",
        });
      const g = `${p}-collateral`;
      out +=
        rect(g, 380, 406, 596, 100) +
        text(398, 444, fr ? "Actifs en garantie" : "Collateral assets", {
          weight: 700,
          panel: g,
          maxWidth: 560,
        }) +
        text(
          398,
          482,
          fr
            ? "Récupération selon les accords."
            : "Recovery under the agreements.",
          { panel: g, maxWidth: 560 },
        ) +
        lines(
          24,
          444,
          fr
            ? ["Protection de la créance", "sur le réassureur."]
            : ["Protection for the claim", "on the reinsurer."],
          { maxWidth: 342, fill: "muted", leading: 36 },
        );
      out +=
        arrow(p, "collateral-from-reinsurer", 856, 359, 856, 402, "amber") +
        arrow(p, "collateral-to-insurer", 500, 402, 500, 359, "signal");
      out += text(
        24,
        558,
        fr
          ? "SI UNE CLAUSE DE RECAPTURE EST DÉCLENCHÉE"
          : "IF RECAPTURE CLAUSE TRIGGERED",
        { weight: 700, fill: "amber", maxWidth: 952 },
      );
      const tasks = fr
        ? [
            ["Reprendre", "les risques cédés"],
            ["Récupérer", "les garanties"],
            ["Adapter actifs,", "liquidité et capital"],
          ]
        : [
            ["Reassume", "ceded risks"],
            ["Recover", "agreed collateral"],
            ["Adjust assets,", "liquidity / capital"],
          ];
      for (let i = 0; i < 3; i++) {
        const id = `${p}-task-${i}`,
          x = 24 + i * 332;
        out +=
          rect(id, x, 589, 288, 105) +
          lines(x + 14, 628, tasks[i], {
            panel: id,
            maxWidth: 260,
            leading: 36,
          });
      }
      out += text(
        24,
        730,
        fr
          ? "L’assureur conserve son obligation de payer la rente."
          : "The insurer retains its obligation to pay the annuity.",
        { weight: 700, fill: "signal", maxWidth: 952 },
      );
    }
    return out;
  });
}
export function insuranceContractsSvg(lang, kind, mobile = false) {
  if (
    typeof lang !== "string" ||
    !["fr", "en"].includes(lang) ||
    typeof kind !== "string" ||
    !INSURANCE_CONTRACTS_KINDS.includes(kind) ||
    typeof mobile !== "boolean"
  )
    throw new TypeError("Invalid insurance contracts figure");
  return [debtor, amounts, rothesay, reinsurance][
    INSURANCE_CONTRACTS_KINDS.indexOf(kind)
  ](lang, mobile);
}
