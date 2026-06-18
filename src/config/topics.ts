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
  accent: string; // teal | blue | pink | amber (couleurs de la charte)
  tags: string[];
}

export const topics: Topic[] = [
  {
    slug: 'credit-prive',
    label: 'Crédit privé & marchés privés',
    blurb:
      "Crédit privé, private equity, fonds semi-liquides, gating et valorisations opaques. Le filon le plus suivi du journal : où se loge le risque que les NAV stables ne disent pas.",
    accent: 'pink',
    tags: [
      'private-credit', 'private credit', 'crédit privé', 'credit prive',
      'private equity', 'marchés privés', 'marches prives', 'investissement-alternatif',
      'investissement alternatif', 'gating', 'semi-liquide', 'hlend', 'blackrock',
      'blackstone', 'apollo', 'valorisation', 'valorisations privées', 'liquidité',
      'liquidite', 'zombie funds', 'bdc',
    ],
  },
  {
    slug: 'macro-banques-centrales',
    label: 'Macro & banques centrales',
    blurb:
      "Inflation, taux, bilans des banques centrales, politique monétaire. Lecture des données dures (CPI, PCE, HICP) et des décisions Fed et BCE.",
    accent: 'teal',
    tags: [
      'macro', 'macroéconomie', 'macroeconomie', 'inflation', 'fed', 'ecb', 'bce',
      'politique monétaire', 'politique monetaire', 'banques centrales', 'taux',
      'tarifs', 'qt', 'quantitative tightening',
    ],
  },
  {
    slug: 'geopolitique-energie',
    label: 'Géopolitique & énergie',
    blurb:
      "Détroit d'Ormuz, conflit iranien, chocs pétroliers et marchés de l'énergie. Quand la géopolitique se lit dans le prix du baril.",
    accent: 'amber',
    tags: [
      'géopolitique', 'geopolitique', 'énergie', 'energie', 'pétrole', 'petrole',
      'iran', 'ormuz', 'détroit', 'detroit', 'gaz', 'opep',
    ],
  },
  {
    slug: 'crypto',
    label: 'Crypto & stablecoins',
    blurb:
      "Bitcoin, stablecoins, DeFi, on-chain et régulation. Avec la distinction que je maintiens entre Bitcoin et le reste.",
    accent: 'amber',
    tags: [
      'crypto', 'bitcoin', 'btc', 'stablecoins', 'stablecoin', 'usdt', 'tron',
      'defi', 'on-chain', 'ofac', 'clarity act', 'régulation crypto',
    ],
  },
  {
    slug: 'marches-valorisations',
    label: 'Marchés & valorisations',
    blurb:
      "Bourse, IPO, Mag7, bulle IA et analyse fondamentale sur sources SEC (13F, Form 4, S-1). Où l'argent institutionnel et les initiés se rejoignent, ou pas.",
    accent: 'blue',
    tags: [
      'bourse', 'ipo', 'mag7', 'ai', 'ia', 'analyse fondamentale', '13f', '13flow',
      'sec edgar', 'form 4', 'marchés', 'marches', 'actions', 'nasdaq', 'softbank',
    ],
  },
  {
    slug: 'politique-us',
    label: 'Politique US',
    blurb:
      "Décisions, annonces et signaux politiques américains qui font bouger les marchés. Décryptage, pas relais.",
    accent: 'pink',
    tags: ['politique us', 'politique américaine', 'trump', 'congrès', 'maison blanche'],
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
