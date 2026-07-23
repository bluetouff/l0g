import type { RiskSignalKey } from './risk-signals.ts';

export interface MonitoringCheckpoint {
  label: string;
  cadence: string;
  detail: string;
  source: string;
  href: string;
}

export interface TopicMonitoring {
  watch: string[];
  counterSignals: string[];
  checkpoints: MonitoringCheckpoint[];
  relatedSignals: RiskSignalKey[];
}

const monitoring: Record<string, TopicMonitoring> = {
  'credit-prive': {
    watch: [
      'Écart entre valorisations déclarées, transactions observables et prix de sortie.',
      'Montée du paiement en nature, des amendements de covenants et des défauts sélectifs.',
      'Promesse de liquidité des véhicules face aux demandes de rachat et aux gates.',
    ],
    counterSignals: [
      'Réouverture durable des refinancements sans concessions croissantes.',
      'Sorties réalisées à des prix cohérents avec les dernières NAV publiées.',
    ],
    checkpoints: [
      {
        label: 'Dépôts 10-Q, 10-K et 8-K des BDC et gestionnaires cotés',
        cadence: 'trimestriel et événementiel',
        detail: 'Portefeuilles, non-accruals, valorisations, levier et liquidité.',
        source: 'SEC EDGAR',
        href: 'https://www.sec.gov/edgar/search/',
      },
      {
        label: 'Travaux sur l’intermédiation non bancaire',
        cadence: 'selon publication',
        detail: 'Vulnérabilités, levier et interconnexions des marchés privés.',
        source: 'Financial Stability Board',
        href: 'https://www.fsb.org/work-of-the-fsb/financial-innovation-and-structural-change/non-bank-financial-intermediation/',
      },
    ],
    relatedSignals: ['debt'],
  },
  'liquidite-repo': {
    watch: [
      'Niveau des réserves bancaires face aux variations du TGA et du bilan de la Fed.',
      'Écart entre taux repo garantis, taux directeurs et capacité de bilan des dealers.',
      'Qualité et disponibilité du collatéral dans les chaînes de financement.',
    ],
    counterSignals: [
      'Repo stable autour des taux administrés malgré les dates de règlement tendues.',
      'Absorption du financement du Trésor sans baisse marquée des réserves.',
    ],
    checkpoints: [
      {
        label: 'H.4.1 : bilan de la Réserve fédérale',
        cadence: 'chaque jeudi',
        detail: 'Actifs, réserves, ON RRP et principaux postes de liquidité.',
        source: 'Federal Reserve',
        href: 'https://www.federalreserve.gov/releases/h41/',
      },
      {
        label: 'Daily Treasury Statement',
        cadence: 'chaque jour ouvré',
        detail: 'Solde du Trésor, encaissements, décaissements et financement.',
        source: 'US Treasury Fiscal Data',
        href: 'https://fiscaldata.treasury.gov/datasets/daily-treasury-statement/operating-cash-balance',
      },
      {
        label: 'SOFR et volumes du repo',
        cadence: 'chaque jour ouvré',
        detail: 'Taux et volumes du financement garanti en dollars.',
        source: 'Federal Reserve Bank of New York',
        href: 'https://www.newyorkfed.org/markets/reference-rates/sofr',
      },
    ],
    relatedSignals: ['us', 'debt'],
  },
  'ormuz-petrole': {
    watch: [
      'Flux physiques réellement interrompus, au-delà des déclarations et de la prime de risque.',
      'Coût du fret, de l’assurance de guerre et disponibilité des navires.',
      'Réaction des stocks commerciaux, capacités de raffinage et réserves stratégiques.',
    ],
    counterSignals: [
      'Maintien des volumes exportés malgré une hausse de la prime géopolitique.',
      'Détente simultanée du fret, des assurances et de la courbe du brut.',
    ],
    checkpoints: [
      {
        label: 'Weekly Petroleum Status Report',
        cadence: 'chaque semaine',
        detail: 'Stocks, production, raffinage et importations des États-Unis.',
        source: 'US Energy Information Administration',
        href: 'https://www.eia.gov/petroleum/supply/weekly/',
      },
      {
        label: 'Monthly Oil Market Report',
        cadence: 'mensuel',
        detail: 'Production, demande, capacités et équilibre pétrolier mondial.',
        source: 'OPEC',
        href: 'https://www.opec.org/opec_web/en/publications/338.htm',
      },
    ],
    relatedSignals: ['energie'],
  },
  'regulation-crypto-us': {
    watch: [
      'Version du texte réellement disponible et différences entre projets de Chambre et de Sénat.',
      'Répartition des compétences entre SEC, CFTC, régulateurs bancaires et États.',
      'Décrets d’application, délais et exemptions après le vote éventuel.',
    ],
    counterSignals: [
      'Absence de texte consolidé ou calendrier parlementaire incompatible avec le récit politique.',
      'Désaccord persistant entre commissions ou autorités chargées de l’application.',
    ],
    checkpoints: [
      {
        label: 'Actions, amendements et textes du Congrès',
        cadence: 'à chaque action législative',
        detail: 'Statut procédural et versions officielles des textes.',
        source: 'Congress.gov',
        href: 'https://www.congress.gov/',
      },
      {
        label: 'Règles proposées et finales',
        cadence: 'chaque jour ouvré',
        detail: 'Consultations et textes d’application des agences fédérales.',
        source: 'Federal Register',
        href: 'https://www.federalregister.gov/',
      },
    ],
    relatedSignals: ['us'],
  },
  'macro-banques-centrales': {
    watch: [
      'Écart entre inflation publiée, composantes persistantes et attentes de marché.',
      'Réaction de l’emploi, du crédit et de l’activité aux conditions financières.',
      'Trajectoire des bilans de banques centrales et disponibilité des réserves.',
    ],
    counterSignals: [
      'Désinflation confirmée par plusieurs mesures plutôt que par une composante isolée.',
      'Assouplissement du crédit sans réaccélération parallèle des prix.',
    ],
    checkpoints: [
      {
        label: 'Calendrier des réunions du FOMC',
        cadence: 'selon calendrier officiel',
        detail: 'Décisions, projections, conférences et minutes.',
        source: 'Federal Reserve',
        href: 'https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm',
      },
      {
        label: 'Inflation et emploi américains',
        cadence: 'mensuel',
        detail: 'CPI, PPI, rapport emploi, JOLTS et autres publications datées.',
        source: 'Bureau of Labor Statistics',
        href: 'https://www.bls.gov/schedule/',
      },
      {
        label: 'PIB, PCE et comptes nationaux',
        cadence: 'mensuel et trimestriel',
        detail: 'Dépenses, revenus, inflation PCE et activité américaine.',
        source: 'Bureau of Economic Analysis',
        href: 'https://www.bea.gov/news/schedule',
      },
    ],
    relatedSignals: ['us', 'eu'],
  },
  'geopolitique-energie': {
    watch: [
      'Événements qui modifient les volumes, infrastructures ou routes commerciales.',
      'Sanctions effectivement applicables, exemptions et capacités de contournement.',
      'Transmission aux prix du brut, du gaz, du fret et de l’électricité.',
    ],
    counterSignals: [
      'Écart durable entre récit géopolitique et volumes physiques observés.',
      'Compensation rapide d’une rupture par les stocks ou des routes alternatives.',
    ],
    checkpoints: [
      {
        label: 'Données hebdomadaires sur les marchés pétroliers',
        cadence: 'chaque semaine',
        detail: 'Stocks, production, raffinage et flux observables.',
        source: 'US Energy Information Administration',
        href: 'https://www.eia.gov/petroleum/supply/weekly/',
      },
      {
        label: 'Sanctions et désignations américaines',
        cadence: 'à chaque publication',
        detail: 'Entités, navires, juridictions et motifs officiels.',
        source: 'US Treasury OFAC',
        href: 'https://ofac.treasury.gov/recent-actions',
      },
    ],
    relatedSignals: ['energie', 'eu'],
  },
  crypto: {
    watch: [
      'Liquidité réellement disponible, profondeur des marchés et concentration des contreparties.',
      'Réserves, droits de rachat et dépendances bancaires des stablecoins.',
      'Séparation entre données on-chain observables et expositions hors chaîne.',
    ],
    counterSignals: [
      'Croissance d’activité sans dépendance accrue à un intermédiaire ou à un levier caché.',
      'Réserves vérifiables et rachats au pair pendant un épisode de tension.',
    ],
    checkpoints: [
      {
        label: 'Prix, volumes et capitalisations',
        cadence: 'continu',
        detail: 'Repère de marché, à recouper avec les sources des plateformes.',
        source: 'CoinGecko',
        href: 'https://www.coingecko.com/',
      },
      {
        label: 'TVL, stablecoins et protocoles DeFi',
        cadence: 'continu',
        detail: 'Inventaire agrégé des chaînes et protocoles, avec limites de couverture.',
        source: 'DefiLlama',
        href: 'https://defillama.com/',
      },
      {
        label: 'Règles et actions réglementaires américaines',
        cadence: 'selon publication',
        detail: 'Textes, consultations et décisions concernant les actifs numériques.',
        source: 'SEC',
        href: 'https://www.sec.gov/newsroom/crypto-task-force',
      },
    ],
    relatedSignals: ['us'],
  },
  'marches-valorisations': {
    watch: [
      'Écart entre croissance bénéficiaire, multiples et coût du capital.',
      'Transactions des initiés et évolution des positions institutionnelles publiées.',
      'Financement hors bilan, garanties et dette associée aux investissements.',
    ],
    counterSignals: [
      'Révisions bénéficiaires capables de rattraper les multiples sans hypothèse extrême.',
      'Convergence entre discours, cash-flow publié et comportement des initiés.',
    ],
    checkpoints: [
      {
        label: '10-Q, 10-K, 8-K, Form 4 et 13F',
        cadence: 'quotidien, trimestriel et événementiel',
        detail: 'Comptes, risques, transactions d’initiés et positions institutionnelles.',
        source: 'SEC EDGAR',
        href: 'https://www.sec.gov/edgar/search/',
      },
      {
        label: 'Commitments of Traders',
        cadence: 'hebdomadaire',
        detail: 'Positionnement déclaré sur les principaux marchés à terme.',
        source: 'CFTC',
        href: 'https://www.cftc.gov/MarketReports/CommitmentsofTraders/index.htm',
      },
    ],
    relatedSignals: ['us', 'yen'],
  },
  'politique-us': {
    watch: [
      'Texte juridiquement disponible plutôt que déclaration ou résumé partisan.',
      'Étape procédurale réellement franchie et autorités chargées de l’exécution.',
      'Coût budgétaire, financement et calendrier de mise en œuvre.',
    ],
    counterSignals: [
      'Absence de majorité, de texte consolidé ou de crédits correspondants.',
      'Écart entre annonce présidentielle et règle effectivement publiée.',
    ],
    checkpoints: [
      {
        label: 'Textes et activité du Congrès',
        cadence: 'à chaque action législative',
        detail: 'Projets, votes, rapports de commission et versions officielles.',
        source: 'Congress.gov',
        href: 'https://www.congress.gov/',
      },
      {
        label: 'Règles, décrets et notices fédérales',
        cadence: 'chaque jour ouvré',
        detail: 'Texte applicable, agence responsable et période de commentaire.',
        source: 'Federal Register',
        href: 'https://www.federalregister.gov/',
      },
      {
        label: 'Estimations et perspectives budgétaires',
        cadence: 'selon publication',
        detail: 'Coûts, scénarios de référence et contraintes fiscales.',
        source: 'Congressional Budget Office',
        href: 'https://www.cbo.gov/publication-type/cost-estimate',
      },
    ],
    relatedSignals: ['us', 'debt'],
  },
};

const fallback: TopicMonitoring = {
  watch: ['Nouvelles données primaires et changement de régime documenté.'],
  counterSignals: ['Éléments observables qui contredisent la lecture dominante.'],
  checkpoints: [],
  relatedSignals: [],
};

export function monitoringForTopic(slug: string): TopicMonitoring {
  return monitoring[slug] ?? fallback;
}
