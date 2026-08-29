export const SITE_URL = 'https://l0g.fr';
export const ORGANIZATION_ID = `${SITE_URL}/#org`;
export const AUTHOR_PROFILE_URL = `${SITE_URL}/about/`;
export const AUTHOR_ID = `${AUTHOR_PROFILE_URL}#bluetouff`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

export const organizationEntity = {
  '@type': 'NewsMediaOrganization',
  '@id': ORGANIZATION_ID,
  name: 'l0g',
  alternateName: 'l0g.fr',
  legalName: 'Olivier Laurelli (EI)',
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/favicon.svg`,
  description:
    "Média d'information économique indépendant et publication de presse en ligne consacrée à la macroéconomie, aux marchés, au risque systémique et à la géopolitique financière.",
  founder: { '@id': AUTHOR_ID },
  email: 'mailto:olivier@l0g.fr',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Chartres',
    postalCode: '28000',
    addressCountry: 'FR',
  },
  masthead: `${SITE_URL}/about/#bluetouff`,
  publishingPrinciples: `${SITE_URL}/protocole-editorial/`,
  correctionsPolicy: `${SITE_URL}/changelog-editorial/`,
  sameAs: ['https://github.com/bluetouff/l0g'],
};

export const authorEntity = {
  '@type': 'Person',
  '@id': AUTHOR_ID,
  name: 'Olivier Laurelli',
  alternateName: 'bluetouff',
  url: AUTHOR_PROFILE_URL,
  description:
    'Auteur et analyste indépendant spécialisé dans les systèmes opaques, le risque systémique, la macroéconomie et la cybersécurité.',
  sameAs: [
    'https://github.com/bluetouff',
    'https://x.com/bluetouff',
  ],
  knowsAbout: [
    'Macroeconomics',
    'Systemic risk',
    'Financial regulation',
    'Public financial data',
    'Cybersecurity',
    'Open-source intelligence',
  ],
};

export const websiteEntity = {
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  url: `${SITE_URL}/`,
  name: 'l0g',
  alternateName: 'l0g.fr',
  inLanguage: ['fr', 'en'],
  creator: { '@id': AUTHOR_ID },
  publisher: { '@id': ORGANIZATION_ID },
};
