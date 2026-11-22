const chapters = [
  // In reading order. The counterpart shares the French source article.
  {
    component: 'ShadowFleetOwnershipFigure',
    fr: {
      slug: 'flotte-fantome-arrow-propriete-petrolier',
      title: 'Flotte fantôme russe : le pétrolier Arrow et ses propriétaires',
      summary: 'Son numéro OMI relie Arrow à Sovcomflot en 2010. Les sanctions de l’UE font remonter la piste jusqu’à Hong Kong.',
      image: '/illustrations/news/flotte-fantome-arrow-2026-11-19.jpg',
      imageAlt: 'Propriété du pétrolier Arrow',
    },
    en: {
      slug: 'shadow-fleet-arrow-tanker-ownership',
      title: 'Russia’s shadow fleet: tracing ownership of the tanker Arrow',
      summary: 'Arrow’s IMO number leads back to Sovcomflot in 2010. New EU sanctions take the ownership trail to Hong Kong.',
      image: '/illustrations/news/flotte-fantome-arrow-2026-11-19.jpg',
      imageAlt: 'Ownership of the tanker Arrow',
    },
  },
  {
    component: 'ShadowFleetCreditFigure',
    fr: {
      slug: 'flotte-fantome-financement-roubles-lid-capital-lidoil',
      title: 'Flotte fantôme russe : le crédit de Moscou à Dubaï',
      summary: 'Deux émissions ont levé 1,51 milliard de roubles. Les comptes retracent le premier prêt à Lidoil.',
      image: '/illustrations/news/flotte-fantome-credit-moscou-dubai-2026-11-19.jpg',
      imageAlt: 'Financement pétrolier entre Moscou et Dubaï',
    },
    en: {
      slug: 'shadow-fleet-rouble-finance-lid-capital-lidoil',
      title: 'Russia’s shadow fleet: Moscow bonds and a Dubai borrower',
      summary: 'Two bond sales brought in 1.51 billion roubles. Lid Capital’s accounts trace the first loan to Lidoil in Dubai.',
      image: '/illustrations/news/flotte-fantome-credit-moscou-dubai-2026-11-19.jpg',
      imageAlt: 'Oil financing between Moscow and Dubai',
    },
  },
  {
    component: 'ShadowFleetPaymentFigure',
    fr: {
      slug: 'flotte-fantome-paiements-a7-a7a5-petrole',
      title: 'Flotte fantôme russe : les recettes du pétrole et le réseau A7',
      summary: 'Londres accuse A7 de traiter des recettes pétrolières. FinCEN mesure séparément les transactions du jeton A7A5.',
      image: '/illustrations/news/flotte-fantome-a7-paiements-petrole-2026-11-19.jpg',
      imageAlt: 'Réseau de paiements du pétrole russe',
    },
    en: {
      slug: 'shadow-fleet-oil-payments-a7-a7a5',
      title: 'Russia’s shadow fleet: oil proceeds and the A7 payment network',
      summary: 'Britain links A7 to Russian oil proceeds. FinCEN separately counts transactions in the A7A5 token.',
      image: '/illustrations/news/flotte-fantome-a7-paiements-petrole-2026-11-19.jpg',
      imageAlt: 'The payment network behind Russian oil sales',
    },
  },
  {
    component: 'ShadowFleetInsuranceFigure',
    fr: {
      slug: 'flotte-fantome-assurance-petrolier-echoue-facture',
      title: 'Flotte fantôme russe : qui paie après l’échouement d’un pétrolier ?',
      summary: 'À Oman, le sauvetage du Caroline Bezengi met à l’épreuve l’assurance maritime et le Fonds de 1992.',
      image: '/illustrations/news/flotte-fantome-assurance-petrolier-2026-11-20.jpg',
      imageAlt: 'Sauvetage d’un pétrolier et indemnisation',
    },
    en: {
      slug: 'shadow-fleet-tanker-insurance-compensation',
      title: 'Russia’s shadow fleet: who pays when a tanker runs aground?',
      summary: 'The Caroline Bezengi salvage off Oman tests the reach of marine insurance and the 1992 Fund.',
      image: '/illustrations/news/flotte-fantome-assurance-petrolier-2026-11-20.jpg',
      imageAlt: 'Tanker salvage and compensation',
    },
  },
];

const shared = {
  date: '2026-11-22',
  modified: '2026-11-22T17:39:30Z',
  documentationDate: '2026-11-20',
  figureCount: 8,
  sourceCount: 77,
  coverWidth: 1024,
  coverHeight: 1536,
  theme: 'dark',
  panorama: '/publications/shadow-fleet-publication-panorama.jpg',
};

/**
 * @param {'fr' | 'en'} lang
 * @param {string} directory
 * @param {{ title: string, subtitle: string, description: string, coverAlt: string }} copy
 */
function edition(lang, directory, copy) {
  const english = lang === 'en';
  return {
    ...shared,
    ...copy,
    lang,
    locale: english ? 'en-GB' : 'fr-FR',
    directory,
    path: `${english ? '/en' : ''}/publications/${directory}/`,
    epub: `/publications/${directory}-l0g.epub`,
    cover: `/publications/${directory}-cover.jpg`,
    social: `/publications/${directory}-og-v1.jpg`,
    chapters: chapters.map((pair, index) => ({
      ...pair[lang],
      number: index + 1,
      component: pair.component,
      sourceSlug: pair.fr.slug,
      route: `${english ? '/en/analysis' : '/posts'}/${pair[lang].slug}/`,
      chapter: `ch00${index + 2}.xhtml`,
    })),
  };
}

export const shadowFleetEditions = {
  fr: edition('fr', 'flotte-fantome-russe', {
    title: 'La flotte fantôme russe',
    subtitle: 'Propriétaires, paiements et risques',
    description: 'Quatre enquêtes sur les pétroliers de la flotte fantôme russe, leurs propriétaires, le financement et les paiements du pétrole, puis l’indemnisation après un échouement.',
    coverAlt: 'Couverture de La flotte fantôme russe. Un pétrolier traverse une mer sombre.',
  }),
  en: edition('en', 'russias-shadow-fleet', {
    title: 'Russia’s Shadow Fleet',
    subtitle: 'Ownership, payments and risks',
    description: 'Four investigations into Russia’s shadow fleet, from the owners of its tankers and the money behind oil sales to the question of who pays after a grounding.',
    coverAlt: 'Cover of Russia’s Shadow Fleet. An oil tanker crosses dark water.',
  }),
};
