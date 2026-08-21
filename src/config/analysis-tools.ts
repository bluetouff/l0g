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
    id: 'adequacy-pump-model',
    version: '1.0.0',
    status: 'active',
    category: 'economics',
    updatedAt: '2026-08-21',
    modelHref: '/outils/modele-pompe-adequation/model.json',
    fr: {
      title: 'Le modèle et la pompe',
      eyebrow: 'adéquation électrique',
      description: 'Comparez une marge à l’échelle d’une zone avec celle d’une sous-région exposée aux mêmes pertes hydriques, mais à un accès plus limité aux imports.',
      question: 'Une zone adéquate peut-elle encore contenir une poche locale déficitaire ?',
      href: '/outils/modele-pompe-adequation/',
      articleHref: '/posts/modele-pompe-prix-adequation/',
      articleLabel: 'Lire le contre-audit du modèle ENTSO-E',
    },
    en: {
      title: 'The model and the pump',
      eyebrow: 'power adequacy',
      description: 'Compare a bidding-zone margin with a sub-region facing the same water losses but more limited access to imports.',
      question: 'Can an adequate zone still contain a local pocket in deficit?',
      href: '/en/tools/model-pump-adequacy/',
      articleHref: '/en/analysis/model-pump-price-of-adequacy/',
      articleLabel: 'Read the ENTSO-E model audit',
    },
  },
  {
    id: 'reservoir-arbitrator',
    version: '1.0.0',
    status: 'active',
    category: 'economics',
    updatedAt: '2026-08-21',
    modelHref: '/outils/arbitre-reservoir/model.json',
    fr: {
      title: 'L’arbitre du réservoir',
      eyebrow: 'hydroélectricité',
      description: 'Comparez une vente immédiate, une attente et un cycle de pompage en séparant stock publié, réserve, indisponibilité et rendement.',
      question: 'Quand l’eau stockée vaut-elle davantage demain qu’aujourd’hui ?',
      href: '/outils/arbitre-reservoir/',
      articleHref: '/posts/barrage-choisit-ne-pas-produire/',
      articleLabel: 'Lire l’enquête sur le barrage qui attend',
    },
    en: {
      title: 'The reservoir arbitrator',
      eyebrow: 'hydropower',
      description: 'Compare an immediate sale, waiting, and a pumping cycle while separating published stock, reserves, unavailability and efficiency.',
      question: 'When is stored water worth more tomorrow than today?',
      href: '/en/tools/reservoir-arbitrator/',
      articleHref: '/en/analysis/the-dam-that-chooses-not-to-generate/',
      articleLabel: 'Read the investigation into the dam that waits',
    },
  },
  {
    id: 'thermal-discharge-thresholds',
    version: '1.0.0',
    status: 'active',
    category: 'economics',
    updatedAt: '2026-08-20',
    modelHref: '/outils/seuils-rejets-thermiques/model.json',
    fr: {
      title: 'Le sélecteur des seuils thermiques',
      eyebrow: 'eau et électricité',
      description: 'Choisissez une centrale, une date, un débit et le contexte RTE pour retrouver la règle publiée sans la confondre avec une prévision du fleuve.',
      question: 'Quelle limite s’applique, et sur quelle base documentaire ?',
      href: '/outils/seuils-rejets-thermiques/',
      articleHref: '/posts/degre-de-trop-rejets-thermiques-nucleaire/',
      articleLabel: 'Lire le troisième volet de l’enquête',
    },
    en: {
      title: 'Thermal-discharge threshold selector',
      eyebrow: 'water and electricity',
      description: 'Choose a plant, date, flow and RTE context to retrieve the published rule without treating it as a river forecast.',
      question: 'Which limit applies, and which public document supports it?',
      href: '/en/tools/thermal-discharge-thresholds/',
      articleHref: '/en/analysis/the-extra-degree-thermal-discharges-nuclear/',
      articleLabel: 'Read part three of the investigation',
    },
  },
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
