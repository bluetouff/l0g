/**
 * Taxonomie curée des sujets (hubs thématiques).
 * Les tags bruts des articles sont incohérents (« private-credit » vs « private credit »,
 * « énergie » vs « energie », « politique us » vs « politique US »...). Plutôt que de
 * générer un hub par tag brut (doublons, hubs orphelins), on définit ici une liste de
 * sujets canoniques, chacun agrégeant les tags bruts qui lui correspondent.
 *
 * Pour rattacher un article à un sujet : intersection (insensible à la casse et aux
 * espaces) entre ses tags et le tableau `tags` du sujet. Un article peut appartenir à
 * plusieurs sujets, c'est voulu.
 */
export interface Topic {
  slug: string;
  label: string;
  blurb: string;
  question: string;
  accent: string; // teal | blue | pink | amber (couleurs de la charte)
  tags: string[];
  entryPoints: {
    kind: 'guide' | 'glossaire' | 'méthodologie';
    label: string;
    detail: string;
    href: string;
  }[];
}

export const topics: Topic[] = [
  {
    slug: 'credit-prive',
    label: 'Crédit privé & marchés privés',
    blurb:
      "Crédit privé, private equity, fonds semi-liquides, gating et valorisations opaques. Le filon le plus suivi du journal : où se loge le risque que les NAV stables ne disent pas.",
    question:
      "Comment distinguer rendement affiché, risque de crédit, levier et promesse de liquidité dans des actifs valorisés hors marché ?",
    accent: 'pink',
    tags: [
      'private-credit', 'private credit', 'crédit privé', 'credit prive',
      'private equity', 'marchés privés', 'marches prives', 'investissement-alternatif',
      'private markets', 'alternative-investment',
      'investissement alternatif', 'gating', 'semi-liquide', 'hlend', 'blackrock',
      'blackstone', 'apollo', 'valorisation', 'valorisations privées',
      'zombie funds', 'bdc',
    ],
    entryPoints: [
      {
        kind: 'guide',
        label: 'Analyser le crédit privé',
        detail: 'Référence durable : valorisation, liquidité, levier, covenants et points de rupture.',
        href: '/guides/analyser-credit-prive/',
      },
      {
        kind: 'glossaire',
        label: 'Définition du crédit privé',
        detail: 'Définition courte, concepts voisins et graphe documentaire.',
        href: '/glossaire/credit-prive/',
      },
      {
        kind: 'méthodologie',
        label: 'Debt Risk Radar',
        detail: 'Protocole de calcul reliant dette, crédit privé, spreads et liquidité.',
        href: '/methodologie/debt-risk-radar/',
      },
    ],
  },
  {
    slug: 'liquidite-repo',
    label: 'Liquidité, repo & collatéral',
    blurb:
      "Réserves bancaires, TGA, RRP, SOFR, repo et chaînes de collatéral. Le dossier qui sépare la liquidité mesurable du récit vague sur l'argent disponible.",
    question:
      "Où circule réellement le cash, quel collatéral le porte et par quel canal une tension de financement devient-elle un choc de marché ?",
    accent: 'teal',
    tags: [
      'liquidité', 'liquidite', 'repo', 'sofr', 'tga', 'rrp', 'collatéral',
      'collateral', 'réhypothécation', 'rehypothecation', 'basis trade',
    ],
    entryPoints: [
      {
        kind: 'guide',
        label: 'Lire la liquidité nette',
        detail: 'Réserves, TGA, RRP et limites du proxy suivi par les marchés.',
        href: '/guides/liquidite-tresor-dts-tga-rrp/',
      },
      {
        kind: 'guide',
        label: 'Lire le repo et le SOFR',
        detail: 'Marché du financement garanti, collatéral et signaux de tension.',
        href: '/guides/lire-le-marche-du-repo-sofr/',
      },
      {
        kind: 'glossaire',
        label: 'Repo',
        detail: 'Définition, mécanique et liens vers les principaux cas de stress.',
        href: '/glossaire/repo/',
      },
    ],
  },
  {
    slug: 'ormuz-petrole',
    label: 'Ormuz & marché pétrolier',
    blurb:
      "Détroit d'Ormuz, pétrole, LNG, fret et inflation importée. Un dossier ciblé pour distinguer rupture physique, prime géopolitique et transmission macroéconomique.",
    question:
      "Le choc vient-il des volumes physiques, du transport, de l'assurance ou de la prime de risque incorporée dans les prix ?",
    accent: 'amber',
    tags: ['ormuz', 'hormuz'],
    entryPoints: [
      {
        kind: 'guide',
        label: 'Lire le marché pétrolier',
        detail: 'Référence durable sur stocks, courbe, raffinage, OPEP+ et benchmarks.',
        href: '/guides/lire-le-marche-petrolier/',
      },
      {
        kind: 'glossaire',
        label: 'Chokepoint',
        detail: "Définition d'un goulet maritime et de ses canaux de contagion.",
        href: '/glossaire/chokepoint/',
      },
      {
        kind: 'méthodologie',
        label: 'Energie Monitor',
        detail: 'Calcul du stress pétrole, gaz, électricité et positionnement.',
        href: '/methodologie/energie/',
      },
    ],
  },
  {
    slug: 'regulation-crypto-us',
    label: 'CLARITY Act & régulation crypto US',
    blurb:
      "Le dossier législatif américain qui suit le CLARITY Act, la répartition SEC-CFTC, les conflits d'intérêts et son articulation avec le cadre des stablecoins.",
    question:
      "Que dit le texte disponible, où en est réellement la procédure et quelles zones de compétence ou de conflit restent ouvertes ?",
    accent: 'blue',
    tags: ['clarity act'],
    entryPoints: [
      {
        kind: 'guide',
        label: 'Qui applique le GENIUS Act ?',
        detail: 'Cadre durable voisin : compétences fédérales et étatiques sur les stablecoins.',
        href: '/guides/qui-applique-le-genius-act/',
      },
      {
        kind: 'guide',
        label: 'Stablecoins et GENIUS Act',
        detail: 'Réserves, remboursement au pair et lien avec les marchés du Trésor.',
        href: '/guides/stablecoins-genius-act/',
      },
      {
        kind: 'glossaire',
        label: 'CLARITY Act',
        detail: 'Définition du texte de structure de marché et distinction avec le GENIUS Act.',
        href: '/glossaire/clarity/',
      },
    ],
  },
  {
    slug: 'macro-banques-centrales',
    label: 'Macro & banques centrales',
    blurb:
      "Inflation, taux, bilans des banques centrales, politique monétaire. Lecture des données dures (CPI, PCE, HICP) et des décisions Fed et BCE.",
    question:
      "Qu'indiquent les données primaires sur le régime d'inflation, de taux et de bilan, au-delà du commentaire de marché ?",
    accent: 'teal',
    tags: [
      'macro', 'macroéconomie', 'macroeconomie', 'inflation', 'fed', 'ecb', 'bce',
      'macroeconomics', 'central banks', 'central-banks', 'monetary policy', 'rates',
      'politique monétaire', 'politique monetaire', 'banques centrales', 'taux',
      'tarifs', 'qt', 'quantitative tightening',
    ],
    entryPoints: [
      {
        kind: 'guide',
        label: 'Lire le bilan de la Fed',
        detail: 'H.4.1, actifs, passifs, réserves et politique de bilan.',
        href: '/guides/lire-h41-bilan-fed/',
      },
      {
        kind: 'méthodologie',
        label: 'US Macro Dashboard',
        detail: 'Protocole de lecture du régime macroéconomique américain.',
        href: '/methodologie/us-macro/',
      },
    ],
  },
  {
    slug: 'geopolitique-energie',
    label: 'Géopolitique & énergie',
    blurb:
      "Détroit d'Ormuz, conflit iranien, chocs pétroliers et marchés de l'énergie. Quand la géopolitique se lit dans le prix du baril.",
    question:
      "Quels événements modifient réellement les flux physiques, les coûts ou les contraintes de production ?",
    accent: 'amber',
    tags: [
      'géopolitique', 'geopolitique', 'énergie', 'energie', 'pétrole', 'petrole',
      'geopolitics', 'energy', 'oil', 'gas', 'commodities',
      'iran', 'ormuz', 'détroit', 'detroit', 'gaz', 'opep',
    ],
    entryPoints: [
      {
        kind: 'guide',
        label: 'Lire le marché pétrolier',
        detail: 'Stocks, courbe, raffinage, OPEP+ et principaux benchmarks.',
        href: '/guides/lire-le-marche-petrolier/',
      },
      {
        kind: 'méthodologie',
        label: 'Energie Monitor',
        detail: "Mesure reproductible des tensions sur les marchés de l'énergie.",
        href: '/methodologie/energie/',
      },
    ],
  },
  {
    slug: 'crypto',
    label: 'Crypto & stablecoins',
    blurb:
      "Bitcoin, stablecoins, DeFi, on-chain et régulation. Avec la distinction que je maintiens entre Bitcoin et le reste.",
    question:
      "Quels mécanismes sont observables on-chain, quelles promesses dépendent d'un intermédiaire et quel droit s'applique ?",
    accent: 'amber',
    tags: [
      'crypto', 'bitcoin', 'btc', 'stablecoins', 'stablecoin', 'usdt', 'tron',
      'defi', 'on-chain', 'ofac', 'clarity act', 'régulation crypto',
    ],
    entryPoints: [
      {
        kind: 'guide',
        label: 'Lire la donnée on-chain',
        detail: "UTXO, flux, réserves de plateformes et limites d'interprétation.",
        href: '/guides/lire-la-donnee-on-chain/',
      },
      {
        kind: 'guide',
        label: 'Stablecoins et GENIUS Act',
        detail: 'Réserves, droit au rachat et architecture réglementaire.',
        href: '/guides/stablecoins-genius-act/',
      },
    ],
  },
  {
    slug: 'marches-valorisations',
    label: 'Marchés & valorisations',
    blurb:
      "Bourse, IPO, Mag7, bulle IA et analyse fondamentale sur sources SEC (13F, Form 4, S-1). Où l'argent institutionnel et les initiés se rejoignent, ou pas.",
    question:
      "Que montrent les dépôts réglementaires, les flux et les valorisations sur ce qui est déjà incorporé dans les prix ?",
    accent: 'blue',
    tags: [
      'bourse', 'ipo', 'mag7', 'ai', 'ia', 'analyse fondamentale', '13f', '13flow',
      'sec edgar', 'form 4', 'marchés', 'marches', 'markets', 'equities', 'stocks',
      'fundamental analysis', 'valuations', 'valuation', 'institutional flows', 'actions', 'nasdaq', 'softbank',
    ],
    entryPoints: [
      {
        kind: 'guide',
        label: 'Analyser un 13F',
        detail: 'Positions institutionnelles, limites du formulaire et comparaisons utiles.',
        href: '/guides/analyser-13f-sec/',
      },
      {
        kind: 'méthodologie',
        label: 'Méthodologie 13FLOW',
        detail: 'Croisement reproductible des formulaires 13F et Form 4.',
        href: '/methodologie/13flow/',
      },
    ],
  },
  {
    slug: 'politique-us',
    label: 'Politique US',
    blurb:
      "Décisions, annonces et signaux politiques américains qui font bouger les marchés. Décryptage, pas relais.",
    question:
      "Quel texte, quelle procédure ou quelle décision produit un effet économique mesurable, et à quelle échéance ?",
    accent: 'pink',
    tags: ['politique us', 'politique américaine', 'us politics', 'trump', 'congrès', 'congress', 'maison blanche', 'white house'],
    entryPoints: [
      {
        kind: 'guide',
        label: 'Lire les prévisions du CBO',
        detail: 'Hypothèses, scénario de référence et limites des projections budgétaires.',
        href: '/guides/lire-les-previsions-du-cbo/',
      },
    ],
  },
];

const norm = (s: string) => s.trim().toLowerCase();

const tagToSlug = new Map<string, string>();
for (const t of topics) {
  for (const tag of t.tags) {
    const k = norm(tag);
    if (!tagToSlug.has(k)) tagToSlug.set(k, t.slug);
  }
}

/** Renvoie le slug du sujet associé à un tag brut, ou undefined. */
export function topicForTag(tag: string): string | undefined {
  return tagToSlug.get(norm(tag));
}

/** Vrai si l'article (par ses tags) appartient au sujet. */
export function postMatchesTopic(postTags: string[], topic: Topic): boolean {
  const set = new Set(topic.tags.map(norm));
  return (postTags || []).some((t) => set.has(norm(t)));
}

/** Sujet principal d'un article : premier sujet (dans l'ordre) qui matche ses tags. */
export function primaryTopic(postTags: string[]): Topic | undefined {
  return topics.find((t) => postMatchesTopic(postTags || [], t));
}

/** Accents de la charte → valeur CSS (aligné sur sidebar / dashboards). */
export const ACCENT_HEX: Record<string, string> = {
  teal: '#5eead4',
  blue: '#7aa2f7',
  pink: '#ff4d87',
  amber: '#f5b13d',
};

/** Couleur CSS du sujet principal d'un article (teal par défaut). */
export function accentForTags(postTags: string[]): string {
  const t = primaryTopic(postTags);
  return ACCENT_HEX[t?.accent ?? 'teal'] ?? ACCENT_HEX.teal;
}

/** Libellés courts pour les pastilles du flux. */
const SHORT_LABEL: Record<string, string> = {
  'credit-prive': 'crédit privé',
  'liquidite-repo': 'liquidité',
  'ormuz-petrole': 'ormuz',
  'regulation-crypto-us': 'clarity act',
  'macro-banques-centrales': 'macro',
  'geopolitique-energie': 'géopolitique',
  crypto: 'crypto',
  'marches-valorisations': 'marchés',
  'politique-us': 'politique us',
};

/** Libellé du sujet principal d'un article (court par défaut pour les pastilles). */
export function topicLabelForTags(postTags: string[], short = true): string | undefined {
  const t = primaryTopic(postTags || []);
  if (!t) return undefined;
  return short ? SHORT_LABEL[t.slug] ?? t.label : t.label;
}
