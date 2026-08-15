export interface AnalysisToolLocale {
  title: string;
  eyebrow: string;
  description: string;
  question: string;
  href: string;
  articleHref: string;
  articleLabel: string;
}

export interface AnalysisTool {
  id: string;
  version: string;
  status: 'active' | 'beta';
  category: 'economics' | 'markets' | 'macro' | 'crypto';
  updatedAt: string;
  modelHref: string;
  fr: AnalysisToolLocale;
  en: AnalysisToolLocale;
}

export const analysisTools: AnalysisTool[] = [
  {
    id: 'digital-euro-cost',
    version: '1.1.0',
    status: 'active',
    category: 'economics',
    updatedAt: '2026-08-15',
    modelHref: '/outils/prix-euro-numerique/model.json',
    fr: {
      title: 'Simulateur du coût de l’euro numérique',
      eyebrow: 'économie des paiements',
      description: 'Manipulez adoption, commissions, offline et coûts publics pour suivre la facture entre commerçants, PSP et Eurosystème.',
      question: 'Une hypothèse de commission finance-t-elle réellement toute la chaîne ?',
      href: '/outils/prix-euro-numerique/',
      articleHref: '/posts/euro-numerique-5-prix-souverainete/',
      articleLabel: 'Lire le volet 5 de l’enquête',
    },
    en: {
      title: 'Digital euro cost simulator',
      eyebrow: 'payments economics',
      description: 'Adjust adoption, fees, offline use and public costs to follow the bill across merchants, PSPs and the Eurosystem.',
      question: 'Can a proposed merchant charge actually fund the whole private chain?',
      href: '/en/tools/digital-euro-cost/',
      articleHref: '/en/analysis/digital-euro-5-price-of-sovereignty/',
      articleLabel: 'Read part 5 of the investigation',
    },
  },
];
