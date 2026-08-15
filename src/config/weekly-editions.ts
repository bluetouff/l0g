import generatedWeeklyEditions from './weekly-editions.generated.json' with { type: 'json' };

export const WEEKLY_SCHEDULE = {
  weekday: 'dimanche',
  weekdayIso: 7,
  time: '08:30',
  timeZone: 'Europe/Paris',
  label: 'Nouvelle édition chaque dimanche à 08 h 30, heure de Paris',
} as const;

export type WeeklyChartPoint = {
  label: string;
  shortLabel: string;
  value: number;
  valueLabel: string;
  nature: string;
  scope: string;
  tone: 'signal' | 'accent' | 'amber';
  additive: boolean;
};

export type WeeklyAnalysisLink = {
  title: string;
  href: string;
  publishedAt: string;
};

export type WeeklyEdition = {
  issue: number;
  slug: string;
  publishedAt: string;
  title: string;
  description: string;
  analysis: {
    title: string;
    href: string;
    update: string;
  };
  lead: string;
  number: {
    value: string;
    label: string;
    context: string;
  };
  mechanism: string;
  test: string;
  limits: string[];
  chart: {
    title: string;
    subtitle: string;
    note: string;
    observationDate: string;
    sourceLabel: string;
    sourceUrl: string;
    csvValueColumn?: string;
    calloutLabel?: string;
    points: WeeklyChartPoint[];
  };
  quote: string;
  linkedin: string;
  threadX: string[];
  sources: Array<{ label: string; href: string; role: string }>;
  sourcesEyebrow?: string;
  includedAnalyses?: WeeklyAnalysisLink[];
  automation?: {
    strategy: 'published-metadata-v1';
    generatedAt: string;
    windowStart: string;
    windowEnd: string;
  };
};

export const manualWeeklyEditions: WeeklyEdition[] = [
  {
    issue: 1,
    slug: '2026-08-02-atlas-athene',
    publishedAt: '2026-08-02T08:30:00+02:00',
    title: "Atlas dans les comptes d’Athene : quatre chiffres, aucun total honnête",
    description:
      "Athene publie 6,146 milliards de dollars de titres Atlas ou affiliés et 1,343 milliard d’engagements. Deux autres lignes de concentration décrivent un périmètre qui peut les recouper.",
    analysis: {
      title: "Quand l’entrepôt ne se vide plus : le risque Atlas dans la machine Apollo-Athene",
      href: '/posts/atlas-entrepot-credit-risque-apollo-athene/',
      update:
        "Une enquête sur le financement d’entrepôt, les sorties par titrisation, les liens de groupe et la garantie ciblée envers Credit Suisse.",
    },
    lead:
      "Le risque ne tient pas dans une addition spectaculaire. Il tient dans la coexistence de titres déjà détenus, d’engagements futurs, de concentrations par émetteur et d’une garantie contractuelle distincte.",
    number: {
      value: '6,146 Md$',
      label: "de titres Atlas ou affiliés détenus par Athene",
      context: 'Valeur publiée au 31 mars 2026 dans le Form 10-Q d’Athene. Elle ne constitue pas un total de toutes les expositions Atlas.',
    },
    mechanism:
      "Atlas finance temporairement des stocks de créances avant leur vente ou leur titrisation. Si la sortie de marché ralentit, les actifs restent plus longtemps financés, le coût de portage augmente et les protections contractuelles deviennent décisives.",
    test:
      "Chercher dans les prochains comptes un pont explicite entre titres détenus, engagements, remboursements, ventes et reclassements. Sans ce pont, une variation ne prouve ni un achat ni un transfert de risque.",
    limits: [
      "Les quatre mesures du graphique appartiennent à des tableaux et des périmètres différents.",
      "Les engagements ne sont pas des actifs déjà financés.",
      "La garantie de 2,5 milliards de dollars envers Credit Suisse ne couvre pas tous les prêts ni tous les titres Atlas.",
      "Athene jugeait le paiement de cette garantie non probable au 31 mars 2026 et ne comptabilisait aucun passif à ce titre.",
    ],
    chart: {
      title: "Atlas dans les comptes d’Athene",
      subtitle: '31 mars 2026, milliards de dollars. Mesures de périmètres différents.',
      note: "Ces quatre valeurs ne doivent pas être additionnées. Les lignes par émetteur peuvent recouper l’agrégat Atlas ou affiliés.",
      observationDate: '2026-03-31',
      sourceLabel: 'Athene Holding Ltd., Form 10-Q, 31 mars 2026',
      sourceUrl: 'https://www.sec.gov/Archives/edgar/data/1527469/000152746926000028/ahl-20260331.htm',
      points: [
        {
          label: 'Titres AFS Atlas ou affiliés',
          shortLabel: 'Titres AFS',
          value: 6.146,
          valueLabel: '6,146',
          nature: 'actifs déjà détenus',
          scope: 'agrégat Atlas ou affiliés',
          tone: 'signal',
          additive: false,
        },
        {
          label: 'Engagements supplémentaires',
          shortLabel: 'Engagements',
          value: 1.343,
          valueLabel: '1,343',
          nature: 'financement futur potentiel',
          scope: 'agrégat Atlas ou affiliés',
          tone: 'amber',
          additive: false,
        },
        {
          label: 'Atlas Securitized Products Holdings',
          shortLabel: 'Atlas SPH',
          value: 3.325,
          valueLabel: '3,325',
          nature: 'concentration par émetteur',
          scope: 'tableau distinct',
          tone: 'accent',
          additive: false,
        },
        {
          label: 'Atlas Secured Advance Funding',
          shortLabel: 'Atlas SAF',
          value: 1.964,
          valueLabel: '1,964',
          nature: 'concentration par émetteur',
          scope: 'tableau distinct',
          tone: 'accent',
          additive: false,
        },
      ],
    },
    quote:
      "Au 31 mars 2026, Athene détenait 6,146 milliards de dollars de titres émis par Atlas ou ses affiliés et 1,343 milliard d’engagements supplémentaires. Ces mesures ne forment pas un total de risque.",
    linkedin:
      "6,146 milliards de dollars. C’est le montant de titres Atlas ou affiliés qu’Athene déclarait détenir au 31 mars 2026. Le chiffre est important, mais l’addition facile serait fausse. Les 1,343 milliard d’engagements supplémentaires ne sont pas des actifs déjà financés. Deux autres lignes, 3,325 milliards pour Atlas Securitized Products Holdings et 1,964 milliard pour Atlas Secured Advance Funding, viennent d’un tableau de concentrations par émetteur et peuvent recouper le premier agrégat. Le signal utile n’est donc pas un total fabriqué. C’est la coexistence de plusieurs canaux dans un même système : investissement, financement futur et soutien conditionnel. L’enquête, le graphique SVG, le CSV et la méthode sont publiés sur l0g.fr.",
    threadX: [
      "1/6 Athene détenait 6,146 Md$ de titres Atlas ou affiliés au 31 mars 2026. C’est le chiffre central. Ce n’est pas, à lui seul, un total de risque.",
      "2/6 Le même 10-Q publie 1,343 Md$ d’engagements supplémentaires. Un engagement futur ne se confond pas avec un actif déjà financé.",
      "3/6 Un autre tableau indique 3,325 Md$ sur Atlas Securitized Products Holdings et 1,964 Md$ sur Atlas Secured Advance Funding. Ces lignes peuvent recouper l’agrégat précédent.",
      "4/6 Additionner 6,146 + 1,343 + 3,325 + 1,964 produirait un chiffre sans validité comptable. Les périmètres et les natures diffèrent.",
      "5/6 Le mécanisme à surveiller : Atlas finance des entrepôts de créances avant leur vente ou leur titrisation. Si la sortie ralentit, durée, coût de portage et besoins de liquidité augmentent.",
      "6/6 Analyse, graphique SVG, CSV et sources primaires : https://l0g.fr/hebdo/2026-08-02-atlas-athene/",
    ],
    sources: [
      {
        label: 'Athene Holding Ltd., Form 10-Q au 31 mars 2026',
        href: 'https://www.sec.gov/Archives/edgar/data/1527469/000152746926000028/ahl-20260331.htm',
        role: 'Chiffres de titres, engagements, concentrations et garanties.',
      },
      {
        label: 'Federal Reserve, Report to Congress on Risk Retention',
        href: 'https://www.federalreserve.gov/boarddocs/rptcongress/securitization/riskretention.html',
        role: "Définition du financement d’entrepôt avant titrisation.",
      },
      {
        label: 'Apollo, lancement d’Atlas SP Partners',
        href: 'https://ir.apollo.com/news-events/press-releases/detail/429/apollo-announces-launch-of-atlas-sp-partners-in-connection',
        role: 'Origine de la plateforme et transaction avec Credit Suisse.',
      },
    ],
  },
];

export const weeklyEditions: WeeklyEdition[] = [
  ...manualWeeklyEditions,
  ...(generatedWeeklyEditions as WeeklyEdition[]),
].sort((left, right) => left.publishedAt.localeCompare(right.publishedAt));

export function latestWeeklyEdition(editions = weeklyEditions) {
  return [...editions].sort((left, right) => right.publishedAt.localeCompare(left.publishedAt))[0];
}

export function weeklyPackageRoot(edition: WeeklyEdition) {
  return `/hebdo/${edition.slug}`;
}

export function weeklySitemapLastmods(site = 'https://l0g.fr') {
  const origin = site.replace(/\/$/, '');
  return new Map(weeklyEditions.map((edition) => [
    `${origin}/hebdo/${edition.slug}/`,
    new Date(edition.publishedAt).toISOString(),
  ]));
}
