/**
 * Colonne de droite + page /dashboards/ : applications l0g.
 * Édite UNIQUEMENT ce fichier. Alimente Sidebar.astro (desktop),
 * SidebarMobile.astro et la page Dashboards.astro.
 * `accent` ∈ teal | blue | pink | amber.
 *
 * Champs « fiche produit » (question, sources, cadence, stack, repo,
 * preview) : utilisés par /dashboards/. Optionnels pour les sidebars.
 */
export interface Dashboard {
  label: string;
  sub: string;
  href: string;
  glyph: string;
  accent: 'teal' | 'blue' | 'pink' | 'amber';
  // --- fiche produit (/dashboards/) ---
  slug: string;            // ancre stable
  question: string;        // la question à laquelle l'outil répond (1 phrase)
  sources: string[];       // sources primaires
  cadence: string;         // fréquence / nature des données
  stack: string;           // techno
  repo?: string;           // dépôt public (lien « code »)
  preview?: {
    src: string;
    width: number;
    height: number;
  };                       // capture locale avec dimensions intrinsèques
  methodologySlug?: string; // slug méthodologie si différent de l'ancre slug
  beta?: boolean;          // affiche un badge « beta » sur la fiche
}

export const dashboards: Dashboard[] = [
  {
    label: 'US Macro Dashboard',
    sub: 'Indicateurs macro & risque',
    href: 'https://us.l0g.fr',
    glyph: '🇺🇸',
    accent: 'teal',
    slug: 'us-macro',
    question: 'Croissance, inflation, emploi, conditions financières : où pointe le risque macro américain ?',
    sources: ['FRED — Federal Reserve Bank of St. Louis'],
    cadence: 'Données FRED, à chaque consultation',
    stack: 'Streamlit · Python',
    repo: 'https://github.com/bluetouff/macro_dashboard',
    preview: { src: '/preview/us.png', width: 3158, height: 1638 },
  },
  {
    label: 'EU Macro Dashboard',
    sub: 'Macro européenne & risque',
    href: 'https://euro.l0g.fr',
    glyph: '🇪🇺',
    accent: 'blue',
    slug: 'eu-macro',
    methodologySlug: 'euro-macro',
    question: 'La zone euro glisse-t-elle vers le stress macro, indicateur par indicateur ?',
    sources: ['BCE — Statistical Data Warehouse', 'Eurostat'],
    cadence: 'Instantané statique, sans clé API',
    stack: 'Python · architecture snapshot',
    repo: 'https://github.com/bluetouff/euro-macro-dashboard',
    preview: { src: '/preview/eu.png', width: 3000, height: 1672 },
  },
  {
    label: 'Yen Carry Monitor',
    sub: 'Suivi du yen carry trade',
    href: 'https://yct.l0g.fr',
    glyph: '¥',
    accent: 'pink',
    slug: 'yen-carry',
    question: 'Le positionnement spéculatif sur le yen approche-t-il du point de débouclage ?',
    sources: ['CFTC — Commitments of Traders (hebdo)', 'BCE', 'FRED'],
    cadence: 'Instantané statique · COT hebdomadaire',
    stack: 'Snapshot statique · licence MIT',
    repo: 'https://github.com/bluetouff/carry-yen-monitor',
    preview: { src: '/preview/yct.png', width: 2314, height: 1678 },
  },
  {
    label: 'Energie Monitor',
    sub: "Marchés de l'énergie",
    href: 'https://energie.l0g.fr',
    glyph: '⚡',
    accent: 'amber',
    slug: 'energie',
    question: 'Pétrole, gaz, électricité : quel niveau de stress sur les marchés de l\'énergie ?',
    sources: ['Sources primaires énergie — pétrole, gaz, électricité'],
    cadence: 'Instantané statique',
    stack: 'Python · builder stdlib durci',
    repo: 'https://github.com/bluetouff/energie-stress-monitor',
    preview: { src: '/preview/ener.png', width: 2154, height: 1688 },
  },
  {
    label: 'Debt Risk Radar',
    sub: 'Dette souveraine & spreads',
    href: 'https://debt.l0g.fr',
    glyph: '∆',
    accent: 'blue',
    slug: 'debt-risk-radar',
    beta: true,
    question: 'Dette publique, crédit privé, projections budgétaires et signaux de marché : où le risque de dette se tend-il ?',
    sources: ['US Treasury Fiscal Data', 'FRED', 'BIS', 'CBO', 'World Bank Open Data', 'Massive Market Data'],
    cadence: 'APIs ouvertes et marché, à chaque consultation',
    stack: 'Streamlit · Python · systemd · Apache',
    repo: 'https://github.com/bluetouff/debt-risk-radar',
    preview: { src: '/preview/debt.png', width: 2312, height: 1204 },
  },
  {
    label: '13FLOW',
    sub: 'Confluence 13F × Form 4',
    href: 'https://13flow.eu',
    glyph: '∩',
    accent: 'teal',
    slug: '13flow',
    question: "Quels titres concentrent à la fois une accumulation de fonds suivis et des achats récents d'initiés ?",
    sources: ['SEC EDGAR — 13F-HR & Form 4', 'OpenFIGI — mapping CUSIP'],
    cadence: 'Instantané statique · 13F trimestriel, Form 4 sous 2 jours',
    stack: 'Python · ingest EDGAR · architecture snapshot',
    repo: 'https://github.com/bluetouff/13flow',
    preview: { src: '/preview/13flow.png', width: 2400, height: 1609 },
  },
  {
    label: 'Orbit',
    sub: 'Heatmap crypto temps réel',
    href: 'https://orbit.l0g.fr',
    glyph: '◎',
    accent: 'amber',
    slug: 'orbit',
    beta: true,
    question: 'Quelles cryptos bougent, accumulent ou décrochent — et où sont les anomalies ?',
    sources: ['CoinGecko — prix & marché', 'FRED — macro (10Y, USD)'],
    cadence: 'Instantané statique · refresh 2 min',
    stack: 'Python · builder stdlib · architecture snapshot',
    repo: 'https://github.com/bluetouff/orbit',
    preview: { src: '/preview/orbit.png', width: 3338, height: 1818 },
  },
];

export const sidebarAbout =
  "Plateforme de risk intelligence sur données publiques. Macro, crédit privé, crypto : sources primaires, lecture critique des annonces, et un peu de code pour rendre l'opacité lisible. Par Bluetouff.";
