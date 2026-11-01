type ReadingPurpose = 'mechanism' | 'case' | 'context';

export const editorialReadingDocuments = {
  repo: { fr: 'repo-collateral-fabrique-liquidite', en: 'repo-the-liquidity-factory' },
  basis: { fr: 'basis-trade-treasuries-levier', en: 'the-treasury-basis-trade' },
  collateral: { fr: 'collateral-rehypothecation-cle-de-voute', en: 'collateral-and-rehypothecation' },
  fx: { fr: 'cross-currency-basis-prix-cache-dollar', en: 'the-cross-currency-basis' },
  eurodollars: { fr: 'eurodollars-dollar-offshore-dette-cachee', en: 'eurodollars-the-offshore-dollar' },
  helium: { fr: 'helium-geopolitique-ballon-anniversaire', en: 'helium-geopolitics-birthday-balloon' },
  wafer: { fr: 'helium-geopolitique-sous-les-puces', en: 'helium-geopolitics-beneath-the-wafer' },
  healthcare: { fr: 'ge-healthcare-achete-du-temps', en: 'ge-healthcare-buys-time' },
  regionalBanks: { fr: 'banques-regionales-us-liquidite-lcr', en: 'us-regional-banks-liquidity-lcr' },
  htm: { fr: 'detenu-jusqu-a-l-echeance-pertes-latentes', en: 'held-to-maturity' },
} as const;

type DocumentKey = keyof typeof editorialReadingDocuments;
interface EditorialReadingLink {
  from: DocumentKey;
  to: DocumentKey;
  purpose: ReadingPurpose;
  note: { fr: string; en: string };
}

// Each link is an editorial choice, rather than a ranking based on matching tags.
export const editorialReadingLinks: readonly EditorialReadingLink[] = [
  { from: 'repo', to: 'basis', purpose: 'case', note: {
    fr: 'Suivre une utilisation du repo : financer un achat de Treasuries couvert par une vente de contrats à terme.',
    en: 'Follow one use of repo: funding a Treasury purchase hedged by a short futures position.',
  } },
  { from: 'repo', to: 'collateral', purpose: 'mechanism', note: {
    fr: 'Examiner la réutilisation des titres remis en garantie et les dépendances créées entre intermédiaires.',
    en: 'Examine how pledged securities are reused and how this connects the intermediaries receiving them.',
  } },
  { from: 'basis', to: 'repo', purpose: 'mechanism', note: {
    fr: 'Revenir au financement de la position : prêteurs de liquidités, garanties et capacité de bilan des dealers.',
    en: 'Return to the funding leg: cash lenders, collateral and the balance-sheet capacity of dealers.',
  } },
  { from: 'basis', to: 'collateral', purpose: 'context', note: {
    fr: 'Élargir la lecture du levier aux chaînes de garanties qui relient les opérations de financement.',
    en: 'Extend the leverage analysis to the collateral chains linking funding transactions.',
  } },
  { from: 'collateral', to: 'repo', purpose: 'mechanism', note: {
    fr: 'Détailler l’opération de pension livrée par laquelle un titre est échangé contre des liquidités.',
    en: 'Inspect the repurchase agreement through which a security is exchanged for cash.',
  } },
  { from: 'collateral', to: 'fx', purpose: 'context', note: {
    fr: 'Comparer les contraintes de bilan des dealers avec celles qui pèsent sur le financement en dollar par swap de change.',
    en: 'Compare dealer balance-sheet constraints with those affecting dollar funding through FX swaps.',
  } },
  { from: 'fx', to: 'eurodollars', purpose: 'context', note: {
    fr: 'Replacer le coût de couverture dans le réseau de financements en dollar situé hors des États-Unis.',
    en: 'Place hedging costs within the network of dollar funding outside the United States.',
  } },
  { from: 'fx', to: 'repo', purpose: 'mechanism', note: {
    fr: 'Comparer deux marchés où la disponibilité du bilan des intermédiaires influe sur le coût de financement.',
    en: 'Compare two markets where intermediary balance-sheet capacity affects funding costs.',
  } },
  { from: 'eurodollars', to: 'fx', purpose: 'mechanism', note: {
    fr: 'Examiner le coût d’accès au dollar par les swaps de change et les limites de l’arbitrage entre devises.',
    en: 'Examine the cost of obtaining dollars through FX swaps and the limits to cross-currency arbitrage.',
  } },
  { from: 'eurodollars', to: 'collateral', purpose: 'context', note: {
    fr: 'Compléter la lecture des engagements en dollar par la circulation des garanties entre intermédiaires.',
    en: 'Complement the analysis of dollar obligations with the movement of collateral between intermediaries.',
  } },
  { from: 'helium', to: 'wafer', purpose: 'case', note: {
    fr: 'Suivre le même gaz dans une autre industrie : la fabrication des semi-conducteurs et ses exigences d’approvisionnement.',
    en: 'Follow the same gas into semiconductor manufacturing and its supply requirements.',
  } },
  { from: 'helium', to: 'healthcare', purpose: 'case', note: {
    fr: 'Comparer l’approvisionnement des appareils d’IRM avec les contraintes de production et de livraison des produits radiopharmaceutiques.',
    en: 'Compare MRI supply needs with the production and delivery constraints of radiopharmaceuticals.',
  } },
  { from: 'wafer', to: 'helium', purpose: 'context', note: {
    fr: 'Revenir à la production et au transport de l’hélium avant d’examiner son usage dans les usines de puces.',
    en: 'Return to helium production and transport before examining its use in chip factories.',
  } },
  { from: 'healthcare', to: 'helium', purpose: 'case', note: {
    fr: 'Comparer deux chaînes médicales distinctes : l’hélium des aimants d’IRM et les produits destinés à l’imagerie nucléaire.',
    en: 'Compare two distinct medical supply chains: helium for MRI magnets and products used in nuclear imaging.',
  } },
  { from: 'regionalBanks', to: 'htm', purpose: 'mechanism', note: {
    fr: 'Distinguer la valeur comptable des obligations et les pertes susceptibles d’apparaître lors d’une vente pour financer des retraits.',
    en: 'Distinguish the carrying value of bonds from losses that may emerge when assets are sold to meet withdrawals.',
  } },
  { from: 'htm', to: 'regionalBanks', purpose: 'case', note: {
    fr: 'Appliquer la distinction entre pertes latentes et besoins de liquidités aux faillites bancaires américaines de 2023.',
    en: 'Apply the distinction between unrealised losses and liquidity needs to the US bank failures of 2023.',
  } },
];

const purposeLabels: Record<'fr' | 'en', Record<ReadingPurpose, string>> = {
  fr: { mechanism: 'Comprendre le mécanisme', case: 'Examiner un cas', context: 'Élargir le contexte' },
  en: { mechanism: 'Understand the mechanism', case: 'Examine a case', context: 'Broaden the context' },
};

export function editorialReadingSuggestions(id: string, lang: 'fr' | 'en') {
  return editorialReadingLinks
    .filter((link) => editorialReadingDocuments[link.from][lang] === id)
    .map((link) => {
      const targetId = editorialReadingDocuments[link.to][lang];
      return {
        id: targetId,
        href: `${lang === 'en' ? '/en/analysis' : '/posts'}/${targetId}/`,
        note: link.note[lang],
        purpose: purposeLabels[lang][link.purpose],
      };
    });
}
