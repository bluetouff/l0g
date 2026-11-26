const chapters = [
  {
    image: '/illustrations/news/trump-doge-tresor-2026-11-26.jpg',
    fr: {
      slug: 'trump-doge-controle-paiements-federaux',
      title: 'Trump et les verrous de la dépense fédérale',
      summary: 'Un audit retrace les accès accordés à un membre de DOGE et le parcours d’un paiement au Trésor.',
      imageAlt: 'Illustration des systèmes de paiement du Trésor américain',
    },
    en: {
      slug: 'trump-doge-federal-spending-controls',
      title: 'Trump and the controls on federal spending',
      summary: 'An audit traces the access granted to a DOGE team member and the path of a Treasury payment.',
      imageAlt: 'Illustration of US Treasury payment systems',
    },
  },
  {
    image: '/illustrations/news/trump-budget-ice-2026-11-26.jpg',
    fr: {
      slug: 'trump-credits-geles-transferts-federaux',
      title: 'Trump, les coupes budgétaires et l’argent de l’ICE',
      summary: 'Des crédits militaires sont réaffectés aux opérations à la frontière. Les audits permettent de suivre le transfert.',
      imageAlt: 'Illustration des crédits fédéraux consacrés aux opérations à la frontière',
    },
    en: {
      slug: 'trump-frozen-funds-federal-transfers',
      title: 'Trump’s budget cuts and the money for ICE',
      summary: 'Military funding is redirected to border operations. Government audits trace the transfer.',
      imageAlt: 'Illustration of federal funding for border operations',
    },
  },
  {
    image: '/illustrations/news/trump-petrole-venezuela-2026-11-26.jpg',
    fr: {
      slug: 'trump-petrole-venezuela-comptes-garde',
      title: 'Trump et l’argent du pétrole vénézuélien',
      summary: 'Washington décide des versements depuis des comptes dont les fonds appartiennent toujours au Venezuela.',
      imageAlt: 'Illustration des recettes du pétrole vénézuélien',
    },
    en: {
      slug: 'trump-venezuela-oil-custody-accounts',
      title: 'Trump and Venezuela’s oil money',
      summary: 'Washington controls releases from accounts whose funds still belong to Venezuela.',
      imageAlt: 'Illustration of Venezuelan oil proceeds',
    },
  },
  {
    image: '/illustrations/news/trump-ice-centres-detention-2026-11-26.jpg',
    fr: {
      slug: 'trump-ice-achats-centres-detention',
      title: 'Trump, Appleton et la piste du délit d’initié',
      summary: 'Le portefeuille déclaré de Trump achète des actions CoreCivic à la date limite fixée pour se retirer de l’achat de la prison d’Appleton.',
      imageAlt: 'Illustration d’un centre de détention américain',
    },
    en: {
      slug: 'trump-ice-detention-purchases-buybacks',
      title: 'Trump’s CoreCivic trade and the Appleton insider trading question',
      summary: 'Trump’s disclosed portfolio bought CoreCivic shares on the government’s deadline to walk away from the Appleton prison deal.',
      imageAlt: 'Illustration of a US detention centre',
    },
  },
  {
    image: '/illustrations/news/trump-hadrian-contrats-fortunes-2026-11-26.jpg',
    fr: {
      slug: 'trump-hadrian-contrats-publics-fortunes-privees',
      title: 'Trump, les contrats publics et le prix de l’accès',
      summary: 'La Marine cofinance l’usine de Hadrian en Alabama. Le fonds qu’a rejoint Donald Trump Jr. est actionnaire du fabricant.',
      imageAlt: 'Illustration d’un atelier d’usinage',
    },
    en: {
      slug: 'trump-hadrian-federal-contracts-private-fortunes',
      title: 'Trump, federal contracts and the price of access',
      summary: 'The Navy co-funds a factory for Hadrian, a company backed by the investment firm Donald Trump Jr. joined.',
      imageAlt: 'Illustration of a precision machining facility',
    },
  },
  {
    image: '/illustrations/news/trump-budget-ice-shutdown-2026-11-26.jpg',
    fr: {
      slug: 'trump-ice-budget-shutdown-credits-congres',
      title: 'Trump et les crédits qui survivent aux shutdowns',
      summary: 'Le blocage budgétaire de février montre comment l’ICE a continué de financer la détention avec des crédits pluriannuels.',
      imageAlt: 'Illustration du Capitole après la pluie',
    },
    en: {
      slug: 'trump-ice-shutdown-funding-congress',
      title: 'Trump and the funding that outlasts a shutdown',
      summary: 'During February’s funding lapse, ICE kept financing detention with money Congress had provided for several years.',
      imageAlt: 'Illustration of the US Capitol after rain',
    },
  },
];

const shared = {
  key: 'trump-war-chest',
  date: '2026-11-26',
  modified: '2026-11-26T20:34:10Z',
  documentationDate: '2026-11-26',
  coverWidth: 1024,
  coverHeight: 1536,
  figureCount: 16,
  sourceCount: 167,
  theme: 'dark',
  panorama: '/publications/trump-war-chest-publication-panorama.jpg',
};

/**
 * @param {'fr' | 'en'} lang
 * @param {string} directory
 * @param {{ title: string, subtitle: string, description: string, coverAlt: string, lede: string, summary: string }} copy
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
      image: pair.image,
      number: index + 1,
      sourceSlug: pair.fr.slug,
      route: `${english ? '/en/analysis' : '/posts'}/${pair[lang].slug}/`,
      chapter: `ch00${index + 2}.xhtml`,
    })),
  };
}

export const trumpWarChestEditions = {
  fr: edition('fr', 'le-tresor-de-guerre-du-clan-trump', {
    title: 'Le trésor de guerre du clan Trump',
    subtitle: 'L’argent public et le pouvoir de décider',
    description: 'Six enquêtes sur les paiements du Trésor, les crédits de l’ICE, les comptes du pétrole vénézuélien et les intérêts privés dans les contrats publics.',
    coverAlt: 'Couverture du Trésor de guerre du clan Trump, illustrée par un dossier et le Capitole.',
    lede: 'Le 13 avril, le portefeuille déclaré de Donald Trump achète des actions CoreCivic. L’administration a jusqu’au soir pour se retirer de l’achat d’une prison du groupe, qu’elle examine dans la confidentialité. L’État acquiert le site en août. En remontant aux décisions qui rendent ces dépenses possibles, les six enquêtes éclairent la marge de manœuvre de la Maison-Blanche.',
    summary: 'Des systèmes de paiement du Trésor aux comptes sous garde qui reçoivent les recettes du Venezuela, le livre suit les décisions qui mettent l’argent en mouvement. Il examine aussi les intérêts privés qui rencontrent ces décisions, puis revient sur les crédits votés pour plusieurs années et le pouvoir du nouveau Congrès.',
  }),
  en: edition('en', 'trump-clans-war-chest', {
    title: 'The Trump Clan’s War Chest',
    subtitle: 'Public money and the power to spend',
    description: 'Six investigations into Treasury payments, ICE funding, Venezuelan oil accounts and private stakes in federal contracts under Donald Trump.',
    coverAlt: 'Cover of The Trump Clan’s War Chest, illustrated with a dossier and the US Capitol.',
    lede: 'On April 13, Donald Trump’s disclosed portfolio bought CoreCivic shares. That afternoon was the government’s deadline to walk away from buying one of the company’s prisons, after a confidential review. The government acquired the site in August. The book traces the public decisions behind such deals and the discretion they give the White House.',
    summary: 'From Treasury payment systems to the accounts holding Venezuela’s oil proceeds, the book follows the decisions that put money in motion. It examines the private interests tied to government decisions, then returns to the funding already on the books when the new Congress takes office.',
  }),
};
