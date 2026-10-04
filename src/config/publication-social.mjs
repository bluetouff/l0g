// Dedicated landscape cards. Portrait covers remain the book and catalogue artwork.
const entries = [
  ['epstein', 'fr', 'l-argent-d-epstein', ['L’argent', 'd’Epstein'], ['Remonter les circuits', 'de l’argent.'], 'Archives, registres et circuits financiers'],
  ['epstein', 'en', 'epsteins-money', ["Epstein’s", 'Money'], ['Following the money', 'through the documents.'], 'Archives, ledgers and financial circuits'],
  ['auditer-opacite', 'fr', 'auditer-l-opacite', ['Auditer', 'l’Opacité'], ['Comprendre les systèmes', 'qui rendent le risque invisible.'], 'Strates de verre et système financier opaque'],
  ['digital-euro', 'fr', 'euro-numerique', ['L’euro', 'numérique'], ['Monnaie publique, banques', 'et pouvoir de paiement.'], 'Architecture conceptuelle de monnaie publique et de paiement'],
  ['digital-euro', 'en', 'digital-euro', ['The', 'Digital Euro'], ['Public money, banks', 'and the power to pay.'], 'Conceptual public-money and payment architecture'],
  ['water-electricity', 'fr', 'eau-electricite', ['L’eau derrière', 'l’électricité'], ['Fleuves, centrales', 'et coût de l’adaptation.'], 'Fleuve, barrage, centrales et réseau électrique'],
  ['water-electricity', 'en', 'water-electricity', ['The Water', 'Behind', 'Electricity'], ['Rivers, power plants', 'and the cost of adaptation.'], 'River, dam, power plants and electricity grid'],
  ['e-invoicing', 'fr', 'grand-peage-facture', ['Le grand péage', 'de la facture'], ['Plateformes, données', 'et dépendances.'], 'Une facture traverse des infrastructures de données'],
  ['e-invoicing', 'en', 'great-e-invoicing-toll', ['The Great', 'E-Invoicing', 'Toll'], ['Platforms, data', 'and dependencies.'], 'An invoice passes through data infrastructure'],
  ['digital-identity', 'fr', 'votre-identite-dans-un-telephone', ['Votre identité', 'dans un', 'téléphone'], ['Données, droits', 'et parcours d’accès.'], 'Téléphone, justificatifs numériques et portes d’accès'],
  ['oil-trading', 'fr', 'les-banquiers-du-baril', ['Les banquiers', 'du baril'], ['Crédit, cargaisons', 'et pouvoir pétrolier.'], 'Pétrolier, documents et financement des cargaisons'],
  ['oil-trading', 'en', 'banking-on-oil', ['Banking', 'on Oil'], ['Credit, cargoes', 'and the power of oil.'], 'Oil tanker, documents and cargo finance'],
  ['scpi', 'fr', 'scpi-liquidite-fantome', ['La liquidité', 'fantôme', 'des SCPI'], ['Revenus, sorties', 'et partage des pertes.'], 'Immeubles, carnet de transactions et liquidité'],
  ['scpi', 'en', 'scpi-phantom-liquidity', ['The Phantom', 'Liquidity of', 'SCPI Funds'], ['Income, exits', 'and who bears the losses.'], 'Buildings, transaction ledger and liquidity'],
  ['commerce-traces', 'fr', 'le-commerce-de-nos-traces', ['Le commerce', 'de nos traces'], ['Dans les circuits', 'des données personnelles.'], 'Profil de verre, données et contrats'],
  ['ia-recouvrement', 'fr', 'ia-recouvrement', ['L’IA vous', 'demande', 'de payer'], ['Du dossier à la relance,', 'puis aux recours.'], 'Dossier, portes de décision et retour de la correction'],
  ['ia-recouvrement', 'en', 'ai-debt-collection', ['When AI', 'Asks You', 'to Pay'], ['From the record', 'to reminders and redress.'], 'Record, decision gates and the return path for corrections'],
  ['ai-slowdown', 'fr', 'le-prix-du-ralentissement', ['Le prix du', 'ralentissement'], ['IA : sécurité, concurrence', 'et financement.'], 'Sablier de puces, serveurs et engagements financiers'],
  ['ai-slowdown', 'en', 'the-price-of-slowing-down', ['The Price', 'of Slowing', 'Down'], ['AI: safety, competition', 'and finance.'], 'Chip hourglass, servers and financial commitments'],
  ['reserves', 'fr', 'reserves-petrolieres', ['Réserves', 'pétrolières'], ['Du stock stratégique', 'au prix du plein.'], 'Stocks pétroliers, circulation du carburant et prix du plein'],
  ['reserves', 'en', 'emergency-oil-reserves', ['Emergency', 'Oil Reserves'], ['From strategic stockpiles', 'to pump prices.'], 'Oil stockpiles, fuel distribution and pump prices'],
];

export const publicationSocialCards = entries.map(([key, lang, slug, titleLines, subtitleLines, illustration]) => ({
  key, lang, slug, titleLines, subtitleLines,
  path: `${lang === 'en' ? '/en' : ''}/publications/${slug}/`,
  image: `/publications/${slug}-og-v1.jpg`,
  art: `/publications/og/art/${key}-v1.jpg`,
  alt: `${titleLines.join(' ')} · ${illustration}. ${lang === 'en' ? 'Free EPUB, l0g.' : 'EPUB gratuit, l0g.'}`,
  label: lang === 'en' ? 'l0g publications' : 'éditions l0g',
  format: lang === 'en' ? 'FREE EPUB' : 'EPUB GRATUIT',
}));

const byPath = new Map(publicationSocialCards.map(card => [card.path, card]));

/** Returns only explicitly registered publication routes, never an inferred file path. */
export function getPublicationSocial(pathname) {
  return byPath.get(pathname);
}
