export interface PrimarySourceDataset {
  name: string;
  role: string;
  cadence: string;
  delay: string;
  url: string;
}

export interface PrimarySourceLink {
  label: string;
  href: string;
}

export interface PrimarySourceInstitution {
  slug: string;
  name: string;
  shortName: string;
  category: string;
  accent: string;
  url: string;
  description: string;
  why: string;
  readFor: string[];
  datasets: PrimarySourceDataset[];
  limits: string[];
  verification: string[];
  related: PrimarySourceLink[];
}

export const primarySourcesUpdated = '27 juin 2026';
export const primarySourcesUpdatedIso = '2026-06-27';

export const primaryInstitutions: PrimarySourceInstitution[] = [
  {
    slug: 'sec-edgar',
    name: 'SEC EDGAR',
    shortName: 'SEC',
    category: 'marchés, filings & disclosure',
    accent: 'var(--color-signal)',
    url: 'https://www.sec.gov/edgar',
    description:
      "Source primaire des déclarations réglementaires américaines : 13F, Form 4, 10-K, 8-K, S-1 et documents d'émetteurs.",
    why:
      "EDGAR est la couche de preuve des analyses actions US : positions institutionnelles, transactions d'initiés, rapports annuels, risques déclarés et documents d'introduction en bourse.",
    readFor: [
      "Comparer ce qu'un émetteur déclare réellement avec le récit de marché.",
      "Lire les positions 13F et les transactions Form 4 sans passer par un agrégateur.",
      "Retrouver le document exact derrière une citation, une levée ou une alerte de risque.",
    ],
    datasets: [
      {
        name: '13F-HR',
        role: 'Positions longues trimestrielles de gérants institutionnels.',
        cadence: 'Trimestrielle',
        delay: "Jusqu'à 45 jours après la fin du trimestre",
        url: 'https://www.sec.gov/edgar/search/',
      },
      {
        name: 'Form 4',
        role: "Transactions déclarées par dirigeants, administrateurs et actionnaires à plus de 10 %.",
        cadence: 'Au fil des dépôts',
        delay: 'Deux jours ouvrés en régime normal',
        url: 'https://www.sec.gov/edgar/search/',
      },
      {
        name: '10-K / 10-Q / 8-K',
        role: 'Rapports périodiques, risques, états financiers et événements significatifs.',
        cadence: 'Selon obligations de reporting',
        delay: 'Variable selon dépôt',
        url: 'https://www.sec.gov/edgar/search/',
      },
      {
        name: 'company_tickers.json',
        role: "Résolution CIK, nom d'émetteur et ticker.",
        cadence: 'Mise à jour SEC',
        delay: 'Variable',
        url: 'https://www.sec.gov/files/company_tickers.json',
      },
    ],
    limits: [
      "Le 13F ne montre ni les shorts, ni les dérivés complexes, ni les positions non américaines hors périmètre.",
      "Les dépôts peuvent arriver en retard ou être amendés : il faut vérifier la date et le type de formulaire.",
      "Un dépôt réglementaire décrit ce qui est déclaré ; il ne donne pas toujours l'intention économique complète.",
    ],
    verification: [
      "Toujours conserver le type de formulaire, le CIK et la date de dépôt.",
      "Comparer les amendements avec le dépôt initial quand une valeur change fortement.",
      "Préférer le document SEC original à la reprise par une base de données commerciale.",
    ],
    related: [
      { label: '13FLOW', href: '/methodologie/13flow/' },
      { label: 'Guide 13F', href: '/guides/analyser-13f-sec/' },
      { label: 'Guide Form 4', href: '/guides/analyser-form-4-sec/' },
      { label: 'Guide 10-K', href: '/guides/lire-le-10-k-sec/' },
    ],
  },
  {
    slug: 'federal-reserve-fred',
    name: 'Federal Reserve & FRED',
    shortName: 'Fed / FRED',
    category: 'macro américaine & liquidité',
    accent: '#7aa2f7',
    url: 'https://fred.stlouisfed.org/',
    description:
      'Réserve fédérale, FRED et publications associées : taux, inflation, emploi, bilan, liquidité, conditions financières et séries macro américaines.',
    why:
      "FRED sert de colonne vertébrale au suivi macro US : il agrège des séries officielles, mais l0g conserve la provenance et la définition de chaque indicateur.",
    readFor: [
      "Lire un régime macro US à partir de séries datées et révisables.",
      "Suivre taux, bilan Fed, liquidité, inflation, crédit et emploi.",
      "Comparer la donnée brute avec la version normalisée utilisée dans les dashboards.",
    ],
    datasets: [
      {
        name: 'FRED series',
        role: 'Catalogue macro, taux, inflation, activité, emploi et conditions financières.',
        cadence: 'Selon série',
        delay: 'Variable selon publication source',
        url: 'https://fred.stlouisfed.org/',
      },
      {
        name: 'Federal Reserve statistical releases',
        role: 'Communiqués, bilan et statistiques monétaires officielles.',
        cadence: 'Quotidienne à mensuelle',
        delay: 'Variable',
        url: 'https://www.federalreserve.gov/data.htm',
      },
      {
        name: 'Liberty Street Economics',
        role: 'Analyses de la New York Fed sur repo, money markets et stabilité financière.',
        cadence: 'Au fil des publications',
        delay: 'Éditorial',
        url: 'https://libertystreeteconomics.newyorkfed.org/',
      },
    ],
    limits: [
      "FRED est souvent un agrégateur de sources officielles : il faut lire la source et l'unité de chaque série.",
      "Les séries macro sont révisées ; un backtest doit distinguer donnée temps réel et donnée révisée.",
      "Une donnée mensuelle peut réagir trop tard à un choc financier intrajournalier.",
    ],
    verification: [
      "Citer le code de série FRED et la date d'observation.",
      "Contrôler l'unité, la fréquence et le traitement saisonnier avant comparaison.",
      "Identifier les séries révisables quand l'analyse dépend du temps réel.",
    ],
    related: [
      { label: 'US Macro', href: '/methodologie/us-macro/' },
      { label: 'Liquidité', href: '/guides/liquidite-tresor-dts-tga-rrp/' },
      { label: 'Glossaire FFR', href: '/glossaire/ffr/' },
      { label: 'Glossaire SOFR', href: '/glossaire/sofr/' },
    ],
  },
  {
    slug: 'bis',
    name: 'Bank for International Settlements',
    shortName: 'BIS',
    category: 'stabilité financière globale',
    accent: 'var(--color-accent)',
    url: 'https://www.bis.org/',
    description:
      'Banque des règlements internationaux : stabilité financière, banques centrales, marchés de dette, dérivés, dollar funding et finance non bancaire.',
    why:
      "La BIS donne le cadre institutionnel pour relier liquidité mondiale, levier, shadow banking, stablecoins et canaux de contagion transfrontaliers.",
    readFor: [
      "Lire les fragilités de bilan qui ne se voient pas dans les prix de marché.",
      "Suivre dollar funding, dérivés, dette internationale et intermédiation non bancaire.",
      "Recouper un narratif de marché avec une lecture banque centrale.",
    ],
    datasets: [
      {
        name: 'BIS statistics',
        role: 'Statistiques bancaires internationales, dette, dérivés et paiements.',
        cadence: 'Trimestrielle à annuelle',
        delay: 'Variable',
        url: 'https://www.bis.org/statistics/index.htm',
      },
      {
        name: 'BIS Quarterly Review',
        role: 'Analyse des marchés financiers globaux et des vulnérabilités.',
        cadence: 'Trimestrielle',
        delay: 'Éditorial',
        url: 'https://www.bis.org/publ/qtrpdf.htm',
      },
      {
        name: 'Working Papers',
        role: 'Travaux de recherche sur stabilité, monnaie, crédit et infrastructures financières.',
        cadence: 'Au fil des publications',
        delay: 'Éditorial',
        url: 'https://www.bis.org/list/wpapers/index.htm',
      },
    ],
    limits: [
      "Les statistiques BIS sont puissantes mais souvent agrégées, avec granularité limitée.",
      "Les délais de publication peuvent être longs pour lire une crise en temps réel.",
      "Une lecture BIS est structurelle : elle complète, mais ne remplace pas, la donnée de marché fraîche.",
    ],
    verification: [
      "Identifier le tableau statistique et la période de référence.",
      "Distinguer analyse BIS, working paper et donnée statistique brute.",
      "Comparer les ordres de grandeur avec FMI, FSB ou données nationales quand c'est possible.",
    ],
    related: [
      { label: 'Crédit privé', href: '/guides/analyser-credit-prive/' },
      { label: 'Glossaire BIS', href: '/glossaire/bis/' },
      { label: 'Glossaire basis trade', href: '/glossaire/basis-trade/' },
    ],
  },
  {
    slug: 'imf',
    name: 'International Monetary Fund',
    shortName: 'FMI',
    category: 'macro mondiale & dette',
    accent: '#7aa2f7',
    url: 'https://www.imf.org/en/Data',
    description:
      'FMI : données macro internationales, dette, balance des paiements, réserves, stabilité financière et surveillance pays.',
    why:
      "Le FMI sert de point d'ancrage pour les comparaisons internationales : dette, réserves, balances externes, vulnérabilités pays et risques financiers globaux.",
    readFor: [
      "Comparer des pays avec des définitions institutionnelles cohérentes.",
      "Vérifier dette, réserves, balance des paiements et projections macro.",
      "Distinguer récit géopolitique et contrainte macro mesurable.",
    ],
    datasets: [
      {
        name: 'IMF Data',
        role: 'Portail de séries macro et financières internationales.',
        cadence: 'Selon base',
        delay: 'Variable',
        url: 'https://www.imf.org/en/Data',
      },
      {
        name: 'Global Financial Stability Report',
        role: 'Analyse des vulnérabilités financières mondiales.',
        cadence: 'Semestrielle',
        delay: 'Éditorial',
        url: 'https://www.imf.org/en/Publications/GFSR',
      },
      {
        name: 'World Economic Outlook',
        role: 'Projections macro et scénarios pays.',
        cadence: 'Semestrielle',
        delay: 'Éditorial',
        url: 'https://www.imf.org/en/Publications/WEO',
      },
    ],
    limits: [
      "Les données FMI peuvent être révisées et dépendre de déclarations nationales.",
      "Les projections sont des scénarios institutionnels, pas des faits observés.",
      "La comparabilité internationale exige de vérifier définitions et périmètres.",
    ],
    verification: [
      "Citer la base FMI utilisée, la période et l'édition éventuelle.",
      "Séparer donnée observée, projection et commentaire analytique.",
      "Recouper les points sensibles avec banques centrales, trésors nationaux ou BIS.",
    ],
    related: [
      { label: 'Glossaire FMI', href: '/glossaire/fmi/' },
      { label: 'Dédollarisation', href: '/posts/dedollarisation-recit-vs-chiffres/' },
      { label: 'Crédit privé', href: '/guides/analyser-credit-prive/' },
    ],
  },
  {
    slug: 'fsb-ofr',
    name: 'Financial Stability Board & OFR',
    shortName: 'FSB / OFR',
    category: 'risque systémique & shadow banking',
    accent: 'var(--color-amber)',
    url: 'https://www.fsb.org/',
    description:
      'FSB et Office of Financial Research : surveillance du risque systémique, finance non bancaire, interconnexions, levier et vulnérabilités.',
    why:
      "Ces deux institutions aident à lire ce que les prix ne montrent pas : interconnexions, levier, finance non bancaire et canaux de contagion.",
    readFor: [
      "Comprendre les vulnérabilités du shadow banking et du crédit privé.",
      "Identifier les canaux de contagion entre fonds, banques, assureurs et marchés.",
      "Recouper une intuition de risque systémique avec une surveillance institutionnelle.",
    ],
    datasets: [
      {
        name: 'FSB publications',
        role: 'Rapports sur finance non bancaire, stabilité et régulation globale.',
        cadence: 'Au fil des rapports',
        delay: 'Éditorial',
        url: 'https://www.fsb.org/publications/',
      },
      {
        name: 'OFR data & monitors',
        role: 'Données et outils américains de surveillance du risque financier.',
        cadence: 'Variable',
        delay: 'Variable',
        url: 'https://www.financialresearch.gov/',
      },
      {
        name: 'Annual reports',
        role: 'Cartographie institutionnelle des vulnérabilités systémiques.',
        cadence: 'Annuelle',
        delay: 'Éditorial',
        url: 'https://www.fsb.org/work-of-the-fsb/financial-innovation-and-structural-change/non-bank-financial-intermediation/',
      },
    ],
    limits: [
      "Les rapports sont souvent synthétiques : ils montrent le risque, rarement toutes les positions sous-jacentes.",
      "La donnée de stabilité financière arrive avec retard par rapport au marché.",
      "Le périmètre global masque parfois des fragilités locales ou sectorielles.",
    ],
    verification: [
      "Identifier le rapport et son millésime, surtout pour le crédit privé.",
      "Distinguer constats quantitatifs et recommandations de régulation.",
      "Recouper avec BIS, FMI, SEC ou données nationales selon le sujet.",
    ],
    related: [
      { label: 'Crédit privé', href: '/guides/analyser-credit-prive/' },
      { label: 'Glossaire FSB', href: '/glossaire/fsb/' },
      { label: 'Glossaire OFR', href: '/glossaire/ofr/' },
    ],
  },
  {
    slug: 'ecb-eurostat',
    name: 'ECB Data Portal & Eurostat',
    shortName: 'BCE / Eurostat',
    category: 'zone euro',
    accent: '#7aa2f7',
    url: 'https://data.ecb.europa.eu/',
    description:
      'BCE et Eurostat : taux, monnaie, crédit, stress financier, inflation, activité, emploi, sentiment et indicateurs européens.',
    why:
      "La zone euro ne se lit pas avec une seule série : l0g combine variables financières BCE et statistiques réelles Eurostat pour éviter de confondre marché et économie.",
    readFor: [
      "Suivre taux, spreads, monnaie, crédit, CISS et conditions financières européennes.",
      "Lire HICP, activité, emploi, production, ventes de détail et indicateurs de sentiment.",
      "Comparer la tension financière avec les données réelles publiées plus lentement.",
    ],
    datasets: [
      {
        name: 'ECB Data Portal',
        role: 'Taux, €STR, CISS, monnaie, crédit, rendements souverains et variables financières.',
        cadence: 'Selon série',
        delay: 'Variable',
        url: 'https://data.ecb.europa.eu/',
      },
      {
        name: 'Eurostat',
        role: 'HICP, production industrielle, ventes de détail, chômage, faillites et sentiment.',
        cadence: 'Mensuelle à trimestrielle',
        delay: 'Variable selon publication',
        url: 'https://ec.europa.eu/eurostat',
      },
      {
        name: 'ECB reference exchange rates',
        role: 'Taux de change de référence utilisés notamment pour USD/JPY via BCE.',
        cadence: 'Quotidienne les jours ouvrés',
        delay: 'Jour ouvré',
        url: 'https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html',
      },
    ],
    limits: [
      "Les séries réelles européennes arrivent souvent tard et sont révisées.",
      "La zone euro agrège des pays hétérogènes : un score global peut masquer des divergences.",
      "Les indicateurs financiers réagissent plus vite que les indicateurs macro officiels.",
    ],
    verification: [
      "Conserver le code série BCE ou Eurostat et la fréquence.",
      "Contrôler si la série est corrigée des variations saisonnières.",
      "Lire les révisions avant de comparer deux snapshots éloignés.",
    ],
    related: [
      { label: 'Euro Macro', href: '/methodologie/euro-macro/' },
      { label: 'Yen Carry', href: '/methodologie/yen-carry/' },
      { label: 'Glossaire BCE', href: '/glossaire/bce/' },
    ],
  },
  {
    slug: 'cftc',
    name: 'Commodity Futures Trading Commission',
    shortName: 'CFTC',
    category: 'positionnement futures',
    accent: 'var(--color-accent)',
    url: 'https://www.cftc.gov/MarketReports/CommitmentsofTraders/index.htm',
    description:
      'CFTC Commitments of Traders : positionnement déclaré sur futures, notamment devises, pétrole, gaz naturel et matières premières.',
    why:
      "Le COT permet de lire l'encombrement d'un trade : ce n'est pas le prix, c'est la structure des positions déclarées.",
    readFor: [
      "Identifier des positions spéculatives extrêmes ou très consensuelles.",
      "Relier prix, taux et positionnement sur yen, pétrole ou gaz.",
      "Repérer les situations où un mouvement de prix peut forcer un débouclage.",
    ],
    datasets: [
      {
        name: 'Commitments of Traders',
        role: 'Positions agrégées par catégorie de participants sur marchés futures.',
        cadence: 'Hebdomadaire',
        delay: 'Quelques jours',
        url: 'https://www.cftc.gov/MarketReports/CommitmentsofTraders/index.htm',
      },
      {
        name: 'Historical Compressed',
        role: 'Fichiers historiques téléchargeables pour backtests et séries longues.',
        cadence: 'Hebdomadaire',
        delay: 'Quelques jours',
        url: 'https://www.cftc.gov/MarketReports/CommitmentsofTraders/HistoricalCompressed/index.htm',
      },
    ],
    limits: [
      "Le COT couvre les marchés déclarés, pas toutes les positions OTC ou bilans bancaires.",
      "La donnée est hebdomadaire et publiée avec délai.",
      "Les catégories CFTC sont utiles mais imparfaites pour inférer l'intention économique.",
    ],
    verification: [
      "Vérifier contrat, marché, date de report et format legacy/disaggregated.",
      "Éviter de mélanger micro-contrats et contrats standards sans déduplication.",
      "Lire le positionnement avec le prix et la volatilité, pas isolément.",
    ],
    related: [
      { label: 'Yen Carry', href: '/methodologie/yen-carry/' },
      { label: 'Énergie', href: '/methodologie/energie/' },
      { label: 'Glossaire CFTC', href: '/glossaire/cftc/' },
    ],
  },
  {
    slug: 'eia-energy',
    name: 'U.S. Energy Information Administration',
    shortName: 'EIA',
    category: 'énergie',
    accent: 'var(--color-amber)',
    url: 'https://www.eia.gov/',
    description:
      'EIA : statistiques publiques américaines sur pétrole, gaz, stocks, production, consommation, prix et perspectives énergétiques.',
    why:
      "L'EIA ancre les analyses énergie sur des séries publiques : stocks, production, prix et scénarios, plutôt que sur les seuls titres géopolitiques.",
    readFor: [
      "Suivre stocks et production pétrole/gaz avec une source officielle.",
      "Comparer les scénarios de prix et d'offre avec les mouvements de marché.",
      "Distinguer choc de prix, choc de stock et contrainte d'approvisionnement.",
    ],
    datasets: [
      {
        name: 'Petroleum & other liquids',
        role: 'Stocks, production, consommation et prix pétrole.',
        cadence: 'Hebdomadaire à mensuelle',
        delay: 'Variable',
        url: 'https://www.eia.gov/petroleum/',
      },
      {
        name: 'Natural gas',
        role: 'Production, stockage, consommation et prix gaz naturel.',
        cadence: 'Hebdomadaire à mensuelle',
        delay: 'Variable',
        url: 'https://www.eia.gov/naturalgas/',
      },
      {
        name: 'Short-Term Energy Outlook',
        role: 'Scénarios EIA de court terme sur prix, offre et demande.',
        cadence: 'Mensuelle',
        delay: 'Éditorial',
        url: 'https://www.eia.gov/outlooks/steo/',
      },
    ],
    limits: [
      "L'EIA couvre très bien les États-Unis ; le marché mondial exige d'autres sources en complément.",
      "Les séries physiques ont leurs propres délais et révisions.",
      "Un scénario STEO reste une projection, pas une donnée observée.",
    ],
    verification: [
      "Identifier la série EIA ou le rapport exact avant citation.",
      "Séparer prix observés, stocks publiés et projection STEO.",
      "Recouper un choc international avec IEA, GIE, Kpler ou données nationales si disponible.",
    ],
    related: [
      { label: 'Énergie', href: '/methodologie/energie/' },
      { label: 'Glossaire EIA', href: '/glossaire/eia/' },
      { label: 'Glossaire WTI', href: '/glossaire/wti/' },
    ],
  },
  {
    slug: 'treasury-tic',
    name: 'U.S. Treasury TIC',
    shortName: 'TIC',
    category: 'flux internationaux & Treasuries',
    accent: 'var(--color-signal)',
    url: 'https://home.treasury.gov/data/treasury-international-capital-tic-system',
    description:
      'Treasury International Capital : flux de capitaux transfrontaliers, détention étrangère de Treasuries et mouvements financiers internationaux.',
    why:
      "TIC permet de tester les récits sur la demande étrangère de dette américaine, la dédollarisation et les flux internationaux.",
    readFor: [
      "Observer qui détient et achète des Treasuries américains.",
      "Comparer un récit géopolitique avec les flux de capitaux mesurés.",
      "Lire la demande internationale de dollar dans les données officielles.",
    ],
    datasets: [
      {
        name: 'Major foreign holders',
        role: 'Détention étrangère de titres du Trésor américain par pays.',
        cadence: 'Mensuelle',
        delay: 'Variable',
        url: 'https://home.treasury.gov/data/treasury-international-capital-tic-system',
      },
      {
        name: 'TIC flows',
        role: 'Achats et ventes transfrontaliers de titres américains.',
        cadence: 'Mensuelle',
        delay: 'Variable',
        url: 'https://home.treasury.gov/data/treasury-international-capital-tic-system',
      },
    ],
    limits: [
      "Les détenteurs sont souvent attribués par juridiction de garde, pas toujours par bénéficiaire final.",
      "Les données mensuelles ne montrent pas tous les arbitrages intramensuels.",
      "Les centres financiers peuvent brouiller la lecture géopolitique directe.",
    ],
    verification: [
      "Toujours préciser s'il s'agit de stock ou de flux.",
      "Éviter de lire une juridiction de garde comme un acteur final sans prudence.",
      "Recouper avec Fed, FMI COFER et données de marché quand l'analyse porte sur le dollar.",
    ],
    related: [
      { label: 'Dédollarisation', href: '/posts/dedollarisation-recit-vs-chiffres/' },
      { label: 'Liquidité', href: '/guides/liquidite-tresor-dts-tga-rrp/' },
      { label: 'Glossaire DTS', href: '/glossaire/dts/' },
    ],
  },
  {
    slug: 'bls-bea',
    name: 'BLS & BEA',
    shortName: 'BLS / BEA',
    category: 'inflation, emploi & PIB US',
    accent: '#7aa2f7',
    url: 'https://www.bls.gov/',
    description:
      'Bureau of Labor Statistics et Bureau of Economic Analysis : inflation, emploi, salaires, productivité, PIB, revenus et comptes nationaux américains.',
    why:
      "BLS et BEA sont nécessaires pour lire l'économie réelle américaine derrière les prix de marché : inflation, emploi, consommation, revenus et croissance.",
    readFor: [
      "Vérifier CPI, emploi, salaires et productivité à la source.",
      "Lire PIB, PCE, revenus et consommation sans passer par un résumé de presse.",
      "Distinguer un choc de prix d'un choc de demande ou de revenu.",
    ],
    datasets: [
      {
        name: 'BLS CPI / Employment',
        role: 'Inflation consommateurs, emploi, chômage, salaires et productivité.',
        cadence: 'Mensuelle à trimestrielle',
        delay: 'Calendrier officiel',
        url: 'https://www.bls.gov/data/',
      },
      {
        name: 'BEA NIPA / PCE / GDP',
        role: 'Comptes nationaux, PIB, PCE, revenus et consommation.',
        cadence: 'Mensuelle à trimestrielle',
        delay: 'Calendrier officiel',
        url: 'https://www.bea.gov/data',
      },
    ],
    limits: [
      "Les données sont révisées, parfois substantiellement.",
      "Les effets de composition peuvent brouiller les lectures rapides de salaires ou inflation.",
      "Un chiffre headline doit souvent être lu avec sa méthodologie et ses composantes.",
    ],
    verification: [
      "Citer la table ou la série exacte, pas seulement le communiqué.",
      "Séparer données préliminaires, révisions et séries finales.",
      "Lire composantes et ajustements saisonniers avant de tirer une conclusion macro.",
    ],
    related: [
      { label: 'US Macro', href: '/methodologie/us-macro/' },
      { label: 'Glossaire BLS', href: '/glossaire/bls/' },
      { label: 'Glossaire CPI', href: '/glossaire/cpi/' },
      { label: 'Glossaire PCE', href: '/glossaire/pce/' },
    ],
  },
];

export const primaryInstitutionBySlug = new Map(primaryInstitutions.map((source) => [source.slug, source]));

export function primarySourceUrl(slug: string): string {
  return `/sources/${slug}/`;
}
