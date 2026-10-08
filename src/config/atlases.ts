export const atlases = [
  {
    id: 'financement-ia',
    href: '/atlas/financement-ia/',
    label: 'Financement de l’IA',
    theme: 'ia',
    image: '/illustrations/news/openai-credit-guarantee-v1.jpg',
    eyebrow: 'Infrastructures · Capital · Garanties',
    description: 'Derrière les centres de données, des investisseurs, des locataires et des garants. Explorez les contrats qui les relient et les conditions de leurs engagements.',
    actors: 'Nvidia · OpenAI · SB Energy · AIP',
    question: 'Qui finance les infrastructures de l’IA ?',
  },
  {
    id: 'credit-prive',
    href: '/atlas/credit-prive/',
    label: 'Crédit privé',
    theme: 'credit',
    image: '/illustrations/news/credit-prive-logiciels-ia-v1.jpg',
    eyebrow: 'Fonds · Assureurs · Banques',
    description: 'Des capitaux des investisseurs aux entreprises financées, suivez le rôle des gérants, des assureurs et des banques dans les circuits du crédit privé.',
    actors: 'Apollo · Athene · Ares Capital · BNP Paribas',
    question: 'Par où passe l’argent avant d’être prêté ?',
  },
  {
    id: 'financement-petrole',
    href: '/atlas/petrole/',
    label: 'Financement du pétrole',
    theme: 'petrole',
    image: '/illustrations/news/oil-trade-bank-finance-v1.jpg',
    eyebrow: 'Cargaisons · Négoce · Recettes publiques',
    description: 'Du paiement d’une cargaison aux recettes d’un pays producteur, explorez les relations entre banques, négociants et emprunteurs.',
    actors: 'UniCredit · Trafigura · Glencore · Tchad',
    question: 'Qui avance l’argent, qui reçoit les recettes ?',
  },
] as const;

export const englishAtlases = [
  {
    ...atlases[0], href: '/en/atlas/ai-financing/', label: 'AI financing',
    eyebrow: 'Infrastructure · Capital · Guarantees',
    description: 'Behind data centres sit investors, tenants and guarantors. Explore the contracts connecting them and the conditions attached to their commitments.',
    question: 'Who finances AI infrastructure?',
  },
  {
    ...atlases[1], href: '/en/atlas/private-credit/', label: 'Private credit',
    eyebrow: 'Funds · Insurers · Banks',
    description: 'Follow capital from investors to borrowers through asset managers, insurers and banks, and distinguish direct lending from asset-backed finance.',
    question: 'Where does the money go before it becomes a loan?',
  },
  {
    ...atlases[2], href: '/en/atlas/oil-financing/', label: 'Oil financing',
    eyebrow: 'Cargoes · Trading · Public revenues', actors: 'UniCredit · Trafigura · Glencore · Chad',
    description: 'From paying for a cargo to allocating a producing country’s revenues, explore the documented links between banks, traders and borrowers.',
    question: 'Who advances the money, and who receives the revenues?',
  },
] as const;

export function atlasAlternateLinks(id?: string) {
  const french = id ? atlases.find(atlas => atlas.id === id)?.href : '/atlas/';
  const english = id ? englishAtlases.find(atlas => atlas.id === id)?.href : '/en/atlas/';
  if (!french || !english) throw new Error('Unknown atlas language pair');
  return [
    { hreflang: 'fr', href: `https://l0g.fr${french}` },
    { hreflang: 'en', href: `https://l0g.fr${english}` },
    { hreflang: 'x-default', href: `https://l0g.fr${french}` },
  ];
}
