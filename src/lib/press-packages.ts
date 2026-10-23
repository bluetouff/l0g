export type PressLocale = 'fr' | 'en';
type Localized = Record<PressLocale, string>;
type Source = { label: Localized; url: string; published: string; locator: Localized };
type Row = {
  id: string;
  label: Localized;
  value: number;
  nature: 'reported' | 'calculated';
  approximate: boolean;
  relationship: string;
  formula: string;
};
export type PressPackage = {
  id: string;
  investigation: { fr: string; en: string };
  title: Localized;
  summary: Localized;
  scope: Localized;
  method: Record<PressLocale, string[]>;
  limits: Localized;
  date: string;
  reviewed: string;
  sources: Source[];
  rows: Row[];
};

// USD billions as published, stored as integer USD millions for exact arithmetic.
const coreweaveInitial = 7500;
const coreweaveCeiling = 8500;
const trafiguraCash = 7700;
const trafiguraUndrawn = 11700;

export const pressPackages: PressPackage[] = [
  {
    id: 'coreweave-ddtl4-2026-03-31',
    investigation: { fr: '/posts/gpu-collateral-ce-que-le-preteur-recupere/', en: '/en/analysis/collateral-that-cannot-leave-the-building/' },
    title: { fr: 'CoreWeave : une capacité de crédit conditionnelle', en: 'CoreWeave’s conditional borrowing capacity' },
    summary: { fr: 'Le passage du plafond initial au plafond après stabilisation dans la facilité DDTL 4.0 annoncée le 31 mars 2026.', en: 'The initial and post-stabilisation borrowing ceilings in the DDTL 4.0 facility announced on 31 March 2026.' },
    scope: { fr: 'DDTL 4.0, emprunteur CoreWeave Compute Acquisition Co. VIII, LLC. Capacités annoncées, en millions de dollars US.', en: 'DDTL 4.0, borrower CoreWeave Compute Acquisition Co. VIII, LLC. Announced borrowing capacities, in USD millions.' },
    date: '2026-03-31',
    reviewed: '2026-10-23',
    sources: [
      { label: { fr: 'CoreWeave, communiqué de clôture déposé à la SEC', en: 'CoreWeave, closing announcement filed with the SEC' }, url: 'https://www.sec.gov/Archives/edgar/data/1769628/000176962826000129/ex991.htm', published: '2026-03-31', locator: { fr: 'Paragraphes sur la capacité initiale et la stabilisation.', en: 'Paragraphs on initial capacity and asset stabilisation.' } },
      { label: { fr: 'CoreWeave, présentation DDTL 4.0', en: 'CoreWeave, DDTL 4.0 presentation' }, url: 'https://s205.q4cdn.com/133937190/files/doc_presentations/2026/Mar/2026-03-DDTL-4-Overview.pdf', published: '2026-03', locator: { fr: 'Pages 4 et 5 : conditions et dimensionnement du crédit.', en: 'Pages 4 and 5: terms and debt sizing.' } },
    ],
    rows: [
      { id: 'initial_capacity', label: { fr: 'Capacité initiale approximative', en: 'Approximate initial capacity' }, value: coreweaveInitial, nature: 'reported', approximate: true, relationship: 'alternative_to:conditional_ceiling', formula: '' },
      { id: 'conditional_ceiling', label: { fr: 'Plafond après stabilisation', en: 'Post-stabilisation ceiling' }, value: coreweaveCeiling, nature: 'reported', approximate: false, relationship: 'alternative_to:initial_capacity', formula: '' },
      { id: 'conditional_increment', label: { fr: 'Capacité additionnelle conditionnelle', en: 'Conditional additional capacity' }, value: coreweaveCeiling - coreweaveInitial, nature: 'calculated', approximate: true, relationship: 'included_in:conditional_ceiling', formula: 'conditional_ceiling - initial_capacity' },
    ],
    method: {
      fr: ['Calcul sur les montants arrondis publiés : 8 500 − 7 500 = environ 1 000 millions USD de capacité additionnelle. Les deux plafonds correspondent à deux phases d’une même facilité et ne s’additionnent pas.', 'Le communiqué conditionne la hausse à la stabilisation des actifs. La présentation décrit une avance de 90 % du coût pendant l’installation, puis un ratio de couverture du service de la dette de 1,2 fois après acceptation du client, site par site. Les barres partent de zéro et partagent la même échelle.'],
      en: ['Calculation from published rounded amounts: 8,500 − 7,500 = approximately USD1,000 million of additional capacity. The two ceilings apply to different phases of one facility and must not be added together.', 'The announcement makes the increase conditional on asset stabilisation. The presentation describes lending at 90% of cost during installation, then a debt service coverage ratio of 1.2 times after customer acceptance, site by site. Both bars start at zero and use the same scale.'],
    },
    limits: { fr: 'Déclarations de l’emprunteur à la date de l’annonce. Le graphique ne mesure ni les tirages, ni le cash reçu, ni une hausse acquise au 23 octobre. Il ne valorise pas les GPU et ne reconstitue pas l’ensemble du contrat.', en: 'Borrower disclosures at announcement. The chart does not measure drawdowns, cash received or an increase achieved by 23 October. It neither values GPUs nor reconstructs the full credit agreement.' },
  },
  {
    id: 'trafigura-liquidity-2026-03-31',
    investigation: { fr: '/posts/les-banquiers-du-baril-2-banques-financement-trafigura/', en: '/en/analysis/banking-on-oil-2-banks-financing-trafigura/' },
    title: { fr: 'Trafigura : la composition de la liquidité', en: 'Trafigura’s liquidity components' },
    summary: { fr: 'Cash disponible et lignes engagées non tirées au 31 mars 2026, avec la ligne contingente replacée dans son périmètre.', en: 'Available cash and undrawn committed facilities at 31 March 2026, with the contingent line kept inside its disclosed perimeter.' },
    scope: { fr: 'Liquidité du groupe telle que définie par Trafigura dans sa revue financière, en millions de dollars US.', en: 'Group liquidity as defined by Trafigura in its financial review, in USD millions.' },
    date: '2026-03-31',
    reviewed: '2026-10-23',
    sources: [
      { label: { fr: 'Trafigura, revue financière semestrielle 2026', en: 'Trafigura, 2026 half-year financial review' }, url: 'https://www.trafigura.com/news-and-insights/insights/2026-trafigura-half-year-report/financial-review/', published: '2026-06-04', locator: { fr: 'Paragraphes sur la liquidité de fin mars et la ligne contingente.', en: 'Paragraphs on end-March liquidity and the contingent facility.' } },
      { label: { fr: 'Trafigura, rapport semestriel 2026', en: 'Trafigura, Half Year Report 2026' }, url: 'https://www.trafigura.com/media/hbkhwzqe/2026_trafigura_half_year_report.pdf', published: '2026-06-04', locator: { fr: 'Pages 4 et 5, Financial review. Même déclaration de l’émetteur.', en: 'Pages 4 and 5, Financial review. The same issuer disclosure.' } },
    ],
    rows: [
      { id: 'available_cash', label: { fr: 'Cash immédiatement disponible', en: 'Immediately available cash' }, value: trafiguraCash, nature: 'reported', approximate: false, relationship: 'component_of:total_liquidity', formula: '' },
      { id: 'undrawn_committed', label: { fr: 'Lignes engagées non tirées', en: 'Undrawn committed facilities' }, value: trafiguraUndrawn, nature: 'reported', approximate: false, relationship: 'component_of:total_liquidity', formula: '' },
      { id: 'contingent_included', label: { fr: 'Dont ligne contingente incluse', en: 'Contingent facility already included' }, value: 3000, nature: 'reported', approximate: false, relationship: 'included_in:undrawn_committed', formula: '' },
      { id: 'total_liquidity', label: { fr: 'Total recalculé, identique au total publié', en: 'Recalculated total, matching the reported total' }, value: trafiguraCash + trafiguraUndrawn, nature: 'calculated', approximate: false, relationship: 'sum:available_cash+undrawn_committed', formula: 'available_cash + undrawn_committed' },
    ],
    method: {
      fr: ['Calcul : 7 700 + 11 700 = 19 400 millions USD, soit 19,4 milliards. Les segments du graphique partagent une échelle proportionnelle et composent ce total.', 'La ligne contingente de 3 000 millions USD est déclarée incluse et non tirée. Elle appartient aux lignes non tirées : elle ne s’ajoute ni aux 11 700 millions ni aux 19 400 millions. Le CSV distingue composantes, sous-ensemble et total ; additionner toutes ses lignes créerait un double comptage.'],
      en: ['Calculation: 7,700 + 11,700 = USD19,400 million, or USD19.4 billion. The chart segments use a proportional scale and together make up that total.', 'The USD3,000 million contingent facility is disclosed as included and undrawn. It sits within undrawn facilities: it is not added to either USD11,700 million or USD19,400 million. The CSV distinguishes components, subset and total; summing every row would double-count.'],
    },
    limits: { fr: 'Photographie déclarée par Trafigura au 31 mars, publiée le 4 juin 2026. Les montants sont arrondis au dixième de milliard. Les lignes de crédit restent soumises à leurs conditions. Le total ne constitue pas du cash immédiatement disponible et ne mesure ni les pertes possibles des banques ni la liquidité actuelle.', en: 'Trafigura’s reported position at 31 March, published on 4 June 2026. Amounts are rounded to one decimal billion. Credit lines remain subject to their terms. The total is not immediately available cash and measures neither potential bank losses nor current liquidity.' },
  },
];

export const pressRights: Localized = {
  fr: 'Figure et calculs originaux l0g : CC BY 4.0. Citer l0g et les sources, conserver les dates et limites, signaler les adaptations. Les publications et données des tiers conservent leurs droits propres ; l0g ne leur attribue aucune licence nouvelle. Aucun cours de marché ni base de prix sous licence n’est redistribué.',
  en: 'Original l0g figure and calculations: CC BY 4.0. Credit l0g and the sources, retain dates and limits, and identify adaptations. Third-party publications and data retain their own rights; l0g grants no new licence over them. No market quotations or licensed price database are redistributed.',
};

export function pressPackagePaths(pack: PressPackage, locale: PressLocale) {
  const root = `/press/investigations/${pack.id}/${locale}`;
  return { svg: `${root}/figure.svg`, csv: `${root}/data.csv`, method: `${root}/method.txt`, citation: `${root}/citation.txt` };
}

export function pressPackageUrl(pack: PressPackage, locale: PressLocale) {
  return `https://l0g.fr${locale === 'fr' ? '/ressources-journalistes/' : '/en/press-resources/'}#${pack.id}`;
}

export function buildPressCitation(pack: PressPackage, locale: PressLocale) {
  const date = locale === 'fr' ? `données du ${pack.date}, vérification des sources le ${pack.reviewed}` : `data dated ${pack.date}, sources checked ${pack.reviewed}`;
  const title = locale === 'fr' ? `« ${pack.title.fr} »` : `“${pack.title.en}”`;
  return `Olivier Laurelli / l0g.fr, ${title}, ${date}, v1. ${pressPackageUrl(pack, locale)}. ${locale === 'fr' ? 'Figure et calculs originaux' : 'Original figure and calculations'} : CC BY 4.0.\n`;
}

function csvCell(value: string | number | boolean) {
  const text = String(value);
  // Export only known editorial data, with formula-injection protection if labels evolve.
  const safe = /^[=+@\-\t\r]/.test(text) ? `'${text}` : text;
  return /[",\n\r]/.test(safe) ? `"${safe.replaceAll('"', '""')}"` : safe;
}

export function buildPressCsv(pack: PressPackage, locale: PressLocale) {
  const header = ['id', 'label', 'value_usd_millions', 'nature', 'approximate', 'relationship', 'formula', 'observation_date', 'primary_source_published', 'sources_checked', 'input_precision', 'scope', 'source_urls', 'method_url', 'rights'];
  const rows = pack.rows.map((row) => [row.id, row.label[locale], row.value, row.nature, row.approximate, row.relationship, row.formula, pack.date, pack.sources[0].published, pack.reviewed, 'published in USD billions; conversion adds no precision', pack.scope[locale], pack.sources.map((source) => source.url).join(' | '), `https://l0g.fr${pressPackagePaths(pack, locale).method}`, pressRights[locale]]);
  return `${[header, ...rows].map((row) => row.map(csvCell).join(',')).join('\r\n')}\r\n`;
}

export function buildPressMethod(pack: PressPackage, locale: PressLocale) {
  return [pack.title[locale], `v1 | ${pack.date} | ${locale === 'fr' ? 'Sources vérifiées' : 'Sources checked'}: ${pack.reviewed}`, pack.scope[locale], ...pack.method[locale], pack.limits[locale], ...pack.sources.map((source) => `${source.label[locale]} (${source.published}). ${source.locator[locale]} ${source.url}`), `${locale === 'fr' ? 'Enquête' : 'Investigation'}: https://l0g.fr${pack.investigation[locale]}`, pressRights[locale], buildPressCitation(pack, locale)].join('\n\n');
}

function xml(value: string) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');
}

export const pressFigureSize = { width: 480, height: 720 };

export function buildPressSvg(pack: PressPackage, locale: PressLocale) {
  const fr = locale === 'fr';
  const value = (id: string) => {
    const row = pack.rows.find((item) => item.id === id);
    if (!row || !Number.isSafeInteger(row.value) || row.value < 0) throw new Error(`Invalid press figure value: ${id}`);
    return row.value;
  };
  const number = (amount: number) => (amount / 1000).toFixed(1).replace('.', fr ? ',' : '.');
  const text = (x: number, y: number, content: string, size = 22, color = '#e7e9ee', weight = 400) => `<text x="${x}" y="${y}" font-size="${size}" fill="${color}" font-weight="${weight}">${xml(content)}</text>`;
  const line = (y: number) => `<path d="M28 ${y}H452" stroke="#505660"/>`;
  const coreweave = pack.id === 'coreweave-ddtl4-2026-03-31';
  let chart: string;
  if (coreweave) {
    const initial = value('initial_capacity');
    const ceiling = value('conditional_ceiling');
    const increment = value('conditional_increment');
    if (ceiling === 0 || ceiling < initial || increment !== ceiling - initial) throw new Error('Inconsistent CoreWeave capacities');
    const barWidth = 424 * initial / ceiling;
    chart = [
      text(28, 49, 'COREWEAVE / DDTL 4.0', 19, '#5eead4', 700),
      text(28, 91, fr ? 'Une capacité de crédit' : 'Conditional borrowing', 29, '#e7e9ee', 700),
      text(28, 126, fr ? 'sous conditions' : 'capacity', 29, '#e7e9ee', 700),
      text(28, 161, fr ? 'Annonce du 31 mars 2026 · Md USD' : '31 March 2026 announcement · USD bn', 19, '#b4b9c3'),
      text(28, 214, fr ? 'Plafond initial' : 'Initial ceiling', 22),
      text(28, 261, `≈ ${number(initial)}`, 41, '#5eead4', 700),
      `<rect x="28" y="280" width="424" height="26" fill="#252b32"/><rect x="28" y="280" width="${barWidth}" height="26" fill="#5eead4" data-value="${initial}"/>`,
      text(28, 348, fr ? 'Plafond après stabilisation' : 'Post-stabilisation ceiling', 22),
      text(28, 395, number(ceiling), 41, '#e7e9ee', 700),
      `<rect x="28" y="414" width="${barWidth}" height="26" fill="#5eead4"/><rect x="${28 + barWidth}" y="414" width="${424 - barWidth}" height="26" fill="#f5b13d" data-value="${increment}"/>`,
      text(28, 470, '0', 17, '#b4b9c3'), text(420, 470, number(ceiling), 17, '#b4b9c3'),
      text(28, 513, `≈ +${number(increment)} ${fr ? 'Md USD conditionnel' : 'bn, conditional'}`, 24, '#f5b13d', 700),
      text(28, 546, fr ? 'Écart de capacité : 8,5 − 7,5.' : 'Capacity difference: 8.5 − 7.5.', 20),
      text(28, 577, fr ? 'Tirages et cash reçu non mesurés.' : 'Drawdowns and cash received not shown.', 20),
      text(28, 607, fr ? 'La hausse dépend de la stabilisation.' : 'The increase depends on stabilisation.', 20),
      line(632),
      text(28, 660, fr ? 'Source : CoreWeave, annonce et présentation.' : 'Source: CoreWeave announcement and slides.', 17, '#b4b9c3'),
    ].join('\n');
  } else if (pack.id === 'trafigura-liquidity-2026-03-31') {
    const cash = value('available_cash');
    const total = value('total_liquidity');
    const undrawn = value('undrawn_committed');
    const included = value('contingent_included');
    if (total === 0 || cash + undrawn !== total || included > undrawn) throw new Error('Inconsistent Trafigura liquidity components');
    const cashWidth = 424 * cash / total;
    chart = [
      text(28, 49, 'TRAFIGURA / 31.03.2026', 19, '#5eead4', 700),
      text(28, 91, fr ? 'La composition' : 'The components', 29, '#e7e9ee', 700),
      text(28, 126, fr ? 'de la liquidité' : 'of liquidity', 29, '#e7e9ee', 700),
      text(28, 161, fr ? 'Déclaration du groupe · Md USD' : 'Company-reported amounts · USD bn', 19, '#b4b9c3'),
      text(28, 222, number(total), 48, '#e7e9ee', 700),
      text(160, 222, fr ? 'au total' : 'total', 24, '#b4b9c3'),
      `<rect x="28" y="246" width="${cashWidth}" height="38" fill="#5eead4" data-value="${cash}"/><rect x="${28 + cashWidth}" y="246" width="${424 - cashWidth}" height="38" fill="#7aa2f7" data-value="${undrawn}"/>`,
      text(28, 335, number(cash), 36, '#5eead4', 700),
      text(128, 325, fr ? 'Cash immédiatement' : 'Immediately available', 21),
      text(128, 352, fr ? 'disponible' : 'cash', 21),
      text(28, 412, number(undrawn), 36, '#7aa2f7', 700),
      text(128, 402, fr ? 'Lignes engagées' : 'Undrawn committed', 21),
      text(128, 429, fr ? 'non tirées' : 'facilities', 21),
      line(455),
      text(28, 493, fr ? `Dont ${number(included)} Md USD de ligne` : `Includes a USD${number(included)}bn contingent`, 23, '#f5b13d', 700),
      text(28, 524, fr ? 'contingente déjà incluse et non tirée.' : 'facility, already counted and undrawn.', 21, '#f5b13d'),
      text(28, 568, fr ? '7,7 + 11,7 = 19,4. Aucun ajout des 3,0.' : '7.7 + 11.7 = 19.4. Do not add the 3.0.', 20),
      text(28, 607, fr ? 'Les crédits restent soumis à conditions.' : 'Credit remains subject to facility terms.', 20),
      line(632),
      text(28, 660, fr ? 'Source : Trafigura, revue du 4 juin 2026.' : 'Source: Trafigura, review of 4 June 2026.', 17, '#b4b9c3'),
    ].join('\n');
  } else throw new Error(`Unknown press figure: ${pack.id}`);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 720" width="480" height="720" role="img" aria-labelledby="title desc" lang="${locale}" style="display:block;width:100%;height:auto" font-family="Arial, Helvetica, sans-serif">
<title id="title">${xml(pack.title[locale])}</title>
<desc id="desc">${xml(`${pack.summary[locale]} ${pack.method[locale][0]} ${pack.limits[locale]}`)}</desc>
<metadata>${xml(`${pressRights[locale]} ${pressPackageUrl(pack, locale)} ${pack.sources.map((source) => source.url).join(' ')}`)}</metadata>
<rect width="480" height="720" fill="#121419" rx="12"/>
${chart}
<a href="${xml(pressPackageUrl(pack, locale))}">${text(28, 695, fr ? 'Figure et calculs : l0g.fr · CC BY 4.0' : 'Figure and calculations: l0g.fr · CC BY 4.0', 17, '#b4b9c3')}</a>
</svg>`;
}
