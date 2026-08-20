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
    id: 'wet-megawatt-counter',
    version: '1.0.0',
    status: 'active',
    category: 'economics',
    updatedAt: '2026-08-20',
    modelHref: '/outils/compteur-megawatt-humide/model.json',
    fr: {
      title: 'Le compteur de mégawatts humides',
      eyebrow: 'eau et électricité',
      description: 'Classez une part du thermique classique comme refroidie par eau et mesurez l’effet comptable sur le périmètre européen, sans le confondre avec un risque de panne.',
      question: 'Combien de gigawatts le registre incomplet laisse-t-il hors du plancher observable ?',
      href: '/outils/compteur-megawatt-humide/',
      articleHref: '/posts/megawatt-humide-europe-eau-electricite/',
      articleLabel: 'Lire l’enquête source',
    },
    en: {
      title: 'The wet megawatt counter',
      eyebrow: 'water and electricity',
      description: 'Classify a share of classic thermal capacity as water-cooled and see the accounting effect without turning it into an outage-risk estimate.',
      question: 'How many gigawatts sit outside the observable floor because the register is incomplete?',
      href: '/en/tools/wet-megawatt-counter/',
      articleHref: '/en/analysis/wet-megawatt-europe-water-electricity/',
      articleLabel: 'Read the source investigation',
    },
  },
  {
    id: 'danube-centimetre-value',
    version: '1.0.0',
    status: 'active',
    category: 'economics',
    updatedAt: '2026-08-20',
    modelHref: '/outils/prix-centimetre-danube/model.json',
    fr: {
      title: 'Le prix d’un centimètre de Danube',
      eyebrow: 'économie de l’électricité',
      description: 'Testez puissance, durée, prix de remplacement, relèvement local et coût des travaux sans inventer de relation physique entre eau et mégawatts.',
      question: 'Combien d’heures de production faut-il préserver pour amortir une intervention ?',
      href: '/outils/prix-centimetre-danube/',
      articleHref: '/posts/combien-vaut-un-centimetre-de-danube/',
      articleLabel: 'Lire l’enquête source',
    },
    en: {
      title: 'The price of one centimetre of Danube',
      eyebrow: 'power economics',
      description: 'Test capacity, duration, replacement price, local lift and intervention cost without inventing a physical water-to-power relationship.',
      question: 'How many preserved operating hours would repay an intervention?',
      href: '/en/tools/value-of-danube-centimetre/',
      articleHref: '/en/analysis/how-much-is-one-centimetre-of-danube-worth/',
      articleLabel: 'Read the source investigation',
    },
  },
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
