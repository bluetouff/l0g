export const SITE_URL = 'https://l0g.fr';
export const ORGANIZATION_ID = `${SITE_URL}/#org`;
export const AUTHOR_PROFILE_URL = `${SITE_URL}/about/#bluetouff`;
export const AUTHOR_ID = AUTHOR_PROFILE_URL;

export const organizationEntity = {
  '@type': 'Organization',
  '@id': ORGANIZATION_ID,
  name: 'l0g',
  alternateName: 'l0g.fr',
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/favicon.svg`,
  description:
    'Risk intelligence : mettre en données la finance opaque, le risque systémique et la géopolitique financière.',
  sameAs: ['https://github.com/bluetouff/l0g'],
};

export const authorEntity = {
  '@type': 'Person',
  '@id': AUTHOR_ID,
  name: 'Bluetouff',
  alternateName: 'Olivier Laurelli',
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
