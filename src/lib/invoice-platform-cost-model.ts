export const INVOICE_PLATFORM_COST_MODEL_VERSION = '1.0.0';
export const INVOICE_PLATFORM_COST_DATA_DATE = '2026-08-22';

export type InvoicePlatformLang = 'fr' | 'en';
export type InvoicePlatformCostStatus = 'calculated' | 'unknown' | 'not-applicable';

export interface InvoicePlatformCostInputs {
  profileId: string;
  isMicro: boolean;
  isNewBusiness: boolean;
  employees: number;
  users: number;
  activeClients: number;
  monthlyFlows: number;
  monthlyReceived: number;
  apiRequired: boolean;
}

export interface InvoicePlatformCostProfile {
  id: string;
  labelFr: string;
  labelEn: string;
  noteFr: string;
  noteEn: string;
  inputs: InvoicePlatformCostInputs;
}

export interface InvoicePlatformPublicOffer {
  id: string;
  name: string;
  modelFr: string;
  modelEn: string;
  sourceUrl: string;
  scopeFr: string;
  scopeEn: string;
}

export interface InvoicePlatformCostResult extends InvoicePlatformPublicOffer {
  status: InvoicePlatformCostStatus;
  cost36mEur: number | null;
  monthlyEquivalentEur: number | null;
  noteFr: string;
  noteEn: string;
}

export const INVOICE_PLATFORM_COST_DEFAULTS: Readonly<InvoicePlatformCostInputs> = Object.freeze({
  profileId: 'micro-b2b',
  isMicro: true,
  isNewBusiness: false,
  employees: 1,
  users: 1,
  activeClients: 5,
  monthlyFlows: 32,
  monthlyReceived: 20,
  apiRequired: false,
});

export const INVOICE_PLATFORM_COST_PROFILES: ReadonlyArray<InvoicePlatformCostProfile> = Object.freeze([
  {
    id: 'micro-b2b',
    labelFr: 'Micro B2B',
    labelEn: 'B2B micro-business',
    noteFr: '12 factures émises et 20 reçues par mois, un utilisateur, sans API.',
    noteEn: '12 invoices sent and 20 received each month, one user, no API.',
    inputs: { ...INVOICE_PLATFORM_COST_DEFAULTS },
  },
  {
    id: 'artisan-mixte',
    labelFr: 'Artisan mixte',
    labelEn: 'Mixed-trade business',
    noteFr: '180 flux par mois, deux utilisateurs, 25 clients actifs, activité B2B et B2C.',
    noteEn: '180 monthly flows, two users, 25 active customers, B2B and B2C activity.',
    inputs: {
      profileId: 'artisan-mixte',
      isMicro: false,
      isNewBusiness: false,
      employees: 2,
      users: 2,
      activeClients: 25,
      monthlyFlows: 180,
      monthlyReceived: 100,
      apiRequired: false,
    },
  },
  {
    id: 'tpe-structuree',
    labelFr: 'TPE structurée',
    labelEn: 'Structured small business',
    noteFr: '1 000 flux par mois, cinq utilisateurs, archivage et collaboration comptable.',
    noteEn: '1,000 monthly flows, five users, archiving and accountant collaboration.',
    inputs: {
      profileId: 'tpe-structuree',
      isMicro: false,
      isNewBusiness: false,
      employees: 7,
      users: 5,
      activeClients: 100,
      monthlyFlows: 1_000,
      monthlyReceived: 500,
      apiRequired: false,
    },
  },
  {
    id: 'pme-connectee',
    labelFr: 'PME connectée',
    labelEn: 'Connected SME',
    noteFr: '2 500 flux par mois, cinq utilisateurs et intégration API.',
    noteEn: '2,500 monthly flows, five users and API integration.',
    inputs: {
      profileId: 'pme-connectee',
      isMicro: false,
      isNewBusiness: false,
      employees: 15,
      users: 5,
      activeClients: 500,
      monthlyFlows: 2_500,
      monthlyReceived: 1_250,
      apiRequired: true,
    },
  },
  {
    id: 'eti',
    labelFr: 'ETI',
    labelEn: 'Mid-sized company',
    noteFr: 'Environ 100 000 flux par an, 25 utilisateurs et API.',
    noteEn: 'About 100,000 annual flows, 25 users and an API.',
    inputs: {
      profileId: 'eti',
      isMicro: false,
      isNewBusiness: false,
      employees: 250,
      users: 25,
      activeClients: 2_000,
      monthlyFlows: 8_334,
      monthlyReceived: 4_000,
      apiRequired: true,
    },
  },
]);

export const INVOICE_PLATFORM_PUBLIC_OFFERS: ReadonlyArray<InvoicePlatformPublicOffer> = Object.freeze([
  {
    id: 'qonto',
    name: 'Qonto Facturation',
    modelFr: 'Entrée à 0 €, facturation annoncée illimitée',
    modelEn: 'Zero-price entry, invoicing advertised as unlimited',
    sourceUrl: 'https://qonto.com/fr/invoicing/free-software',
    scopeFr: 'La page gratuite ne précise pas les droits multi-utilisateurs ni le périmètre API.',
    scopeEn: 'The free page does not specify multi-user rights or API scope.',
  },
  {
    id: 'indy',
    name: 'Indy',
    modelFr: 'Offre Essentiel à 0 €',
    modelEn: 'Essentiel plan at €0',
    sourceUrl: 'https://www.indy.fr/prix/',
    scopeFr: 'Le calcul retient seulement un usage individuel sans API.',
    scopeEn: 'The calculation covers individual use without an API only.',
  },
  {
    id: 'abby',
    name: 'Abby',
    modelFr: 'Plan Basique à 0 €',
    modelEn: 'Basique plan at €0',
    sourceUrl: 'https://abby.fr/tarifs/',
    scopeFr: 'Les fonctions multi-utilisateurs et avancées relèvent de plans payants dont les promotions évoluent.',
    scopeEn: 'Multi-user and advanced features sit in paid plans whose promotions change.',
  },
  {
    id: 'dougs',
    name: 'Dougs Facturation',
    modelFr: '0 €, volume annoncé illimité',
    modelEn: '€0, advertised as unlimited by volume',
    sourceUrl: 'https://www.dougs.fr/logiciel-facturation-gratuit/',
    scopeFr: 'Les conditions API et multi-utilisateurs ne sont pas tarifées publiquement sur cette page.',
    scopeEn: 'API and multi-user conditions are not publicly priced on this page.',
  },
  {
    id: 'tiime',
    name: 'Tiime',
    modelFr: '0 €, sans engagement annoncé',
    modelEn: '€0, advertised without commitment',
    sourceUrl: 'https://www.tiime.fr/facturation-electronique',
    scopeFr: 'Les droits multi-utilisateurs et l’API ne sont pas chiffrés dans le périmètre gratuit public.',
    scopeEn: 'Multi-user rights and the API are not priced in the public free scope.',
  },
  {
    id: 'pennylane',
    name: 'Pennylane',
    modelFr: '0 € pour les micro-entreprises, 1 utilisateur, 1 200 factures par an',
    modelEn: '€0 for micro-businesses, one user, 1,200 invoices a year',
    sourceUrl: 'https://www.pennylane.com/fr/facture-electronique-gratuite',
    scopeFr: 'Les autres structures commencent avec un plan public annoncé à 7 € par mois.',
    scopeEn: 'Other legal forms start with a public plan advertised at €7 a month.',
  },
  {
    id: 'super-pdp',
    name: 'SUPER PDP',
    modelFr: 'Compte gratuit jusqu’à 1 000 factures par mois, puis API au volume',
    modelEn: 'Free account up to 1,000 invoices a month, then a volume-priced API',
    sourceUrl: 'https://www.superpdp.tech/tarifs/',
    scopeFr: 'Le calcul ajoute les 2 € de vérification KYC ou KYB et le minimum API de 10 € par an.',
    scopeEn: 'The calculation adds the €2 KYC or KYB check and the €10 annual API minimum.',
  },
  {
    id: 'b2brouter',
    name: 'B2BRouter',
    modelFr: '24 transactions par an à 0 €, puis 110 € ou 300 € par an',
    modelEn: '24 annual transactions at €0, then €110 or €300 a year',
    sourceUrl: 'https://www.b2brouter.net/fr/tarifs/',
    scopeFr: 'Une transaction comprend une facture émise, reçue ou une déclaration fiscale.',
    scopeEn: 'A transaction includes an invoice sent, received, or a tax declaration.',
  },
  {
    id: 'vosfactures',
    name: 'VosFactures',
    modelFr: '3 documents par mois à 0 €, puis plans de 5 € à 60 € par mois',
    modelEn: 'Three monthly documents at €0, then plans from €5 to €60 a month',
    sourceUrl: 'https://vosfactures.fr/tarifs',
    scopeFr: 'Le calcul utilise les flux saisis comme approximation prudente du nombre de documents.',
    scopeEn: 'The calculation uses entered flows as a conservative proxy for document count.',
  },
  {
    id: 'macompta',
    name: 'macompta.fr',
    modelFr: '0 € jusqu’à 20 flux par mois pour un non-abonné, puis paliers',
    modelEn: '€0 up to 20 monthly flows for a non-subscriber, then tiers',
    sourceUrl: 'https://www.macompta.fr/facturation-electronique',
    scopeFr: 'Un flux d’e-reporting compte comme une facture. Au-delà de 500, un devis est nécessaire.',
    scopeEn: 'One e-reporting flow counts as one invoice. Above 500, a quote is required.',
  },
  {
    id: 'shine',
    name: 'Shine Facture',
    modelFr: '0 € avec cinq clients, puis 9 € ou 20 € par mois en paiement annuel',
    modelEn: '€0 with five customers, then €9 or €20 a month with annual billing',
    sourceUrl: 'https://www.shine.fr/tarifs-shine-facture/',
    scopeFr: 'La limite gratuite porte sur cinq clients. La FAQ annonce émission et réception incluses, mais la grille marque encore l’émission électronique comme à venir pour Free.',
    scopeEn: 'The free limit applies to five customers. The FAQ says sending and receiving are included, while the price grid still marks electronic issuance as forthcoming for Free.',
  },
  {
    id: 'kolecto',
    name: 'Kolecto',
    modelFr: 'Gratuit la première année pour certains créateurs, puis prix selon effectif',
    modelEn: 'Free in year one for eligible new businesses, then employee-based pricing',
    sourceUrl: 'https://www.kolecto.fr/tarifs',
    scopeFr: 'Les quotas annuels sont faibles au regard des profils l0g. Un calcul sur 36 mois devient vite indéterminé.',
    scopeEn: 'Annual quotas are low relative to l0g profiles. A 36-month calculation quickly becomes indeterminate.',
  },
  {
    id: 'docaposte',
    name: 'Docaposte e-Facture / SERES',
    modelFr: '19 € pour 50 réceptions, 69 € pour 100 documents, puis 149 €',
    modelEn: '€19 for 50 receipts, €69 for 100 documents, then €149',
    sourceUrl: 'https://www.docaposte.com/solutions/facture-electronique/logiciel-facture-electronique',
    scopeFr: 'Les volumes au-delà de la grille publiée et les intégrations restent à confirmer.',
    scopeEn: 'Volumes beyond the published grid and integrations still require confirmation.',
  },
  {
    id: 'sellsy',
    name: 'Sellsy Facturation',
    modelFr: 'Abonnement par utilisateur avec deux licences minimum',
    modelEn: 'Per-user subscription with a two-licence minimum',
    sourceUrl: 'https://go.sellsy.com/offres',
    scopeFr: 'Le calcul applique la promotion de première année visible au 22 août 2026, puis le tarif normal public.',
    scopeEn: 'The calculation applies the first-year promotion visible on 22 August 2026, then the public standard price.',
  },
  {
    id: 'odoo',
    name: 'Odoo Facturation',
    modelFr: 'Une application gratuite, utilisateurs illimités',
    modelEn: 'One free app, unlimited users',
    sourceUrl: 'https://www.odoo.com/fr_FR/pricing',
    scopeFr: 'Le zéro suppose de rester dans une seule application. L’API externe relève du plan Personnalisé.',
    scopeEn: 'The zero price assumes use of one app only. External API access requires the Custom plan.',
  },
  {
    id: 'sage',
    name: 'Sage',
    modelFr: 'PA incluse dans plusieurs abonnements, avec plafonds',
    modelEn: 'Approved platform included in several subscriptions, with caps',
    sourceUrl: 'https://www.sage.com/fr-fr/dematerialisation/facture-electronique/sage-plateforme-de-dematerialisation-partenaire/',
    scopeFr: 'Le prix public des dépassements et le coût autonome complet ne sont pas publiés de façon homogène.',
    scopeEn: 'Public overage prices and the complete standalone cost are not published consistently.',
  },
  {
    id: 'cegid',
    name: 'Cegid',
    modelFr: 'PA annoncée sans surcoût pour plusieurs produits Cegid et EBP',
    modelEn: 'Approved platform advertised at no extra charge for several Cegid and EBP products',
    sourceUrl: 'https://www.cegid.com/fr/blog/comment-inscrire-entreprise-annuaire-facture-electronique/',
    scopeFr: 'Aucune grille unifiée de plafond et de dépassement n’a été identifiée.',
    scopeEn: 'No unified cap and overage grid was identified.',
  },
  {
    id: 'dext',
    name: 'Dext',
    modelFr: 'PA incluse dans les abonnements existants, outil gratuit distinct',
    modelEn: 'Approved platform included in existing subscriptions, separate free tool',
    sourceUrl: 'https://dext.com/fr/produits/logiciel-facturation-gratuit',
    scopeFr: 'Le compte gratuit documente la création, l’envoi et la réception. Le e-reporting est annoncé prochainement et son inclusion dans le périmètre autonome gratuit n’est pas explicitée.',
    scopeEn: 'The free account documents creation, sending and receipt. E-reporting is described as forthcoming and its inclusion in the standalone free scope is not explicit.',
  },
  {
    id: 'axonaut',
    name: 'Axonaut',
    modelFr: 'PA incluse dans le logiciel de gestion',
    modelEn: 'Approved platform included in the management software',
    sourceUrl: 'https://axonaut.com/content/prix',
    scopeFr: 'La grille dynamique ne fournit pas ici un coût homogène et vérifiable pour les profils.',
    scopeEn: 'The dynamic grid does not provide a homogeneous and verifiable cost for these profiles here.',
  },
]);

const limits = Object.freeze({
  employees: { min: 0, max: 100_000 },
  users: { min: 1, max: 100_000 },
  activeClients: { min: 0, max: 10_000_000 },
  monthlyFlows: { min: 0, max: 100_000_000 },
  monthlyReceived: { min: 0, max: 100_000_000 },
});

const clamp = (candidate: unknown, fallback: number, min: number, max: number) => {
  const value = typeof candidate === 'number' ? candidate : Number(candidate);
  return Number.isFinite(value) ? Math.min(Math.max(value, min), max) : fallback;
};

export function normalizeInvoicePlatformCostInputs(
  candidate: Partial<InvoicePlatformCostInputs> = {},
): InvoicePlatformCostInputs {
  const defaults = INVOICE_PLATFORM_COST_DEFAULTS;
  const monthlyFlows = clamp(candidate.monthlyFlows, defaults.monthlyFlows, limits.monthlyFlows.min, limits.monthlyFlows.max);
  return {
    profileId: typeof candidate.profileId === 'string' ? candidate.profileId : defaults.profileId,
    isMicro: typeof candidate.isMicro === 'boolean' ? candidate.isMicro : defaults.isMicro,
    isNewBusiness: typeof candidate.isNewBusiness === 'boolean' ? candidate.isNewBusiness : defaults.isNewBusiness,
    employees: clamp(candidate.employees, defaults.employees, limits.employees.min, limits.employees.max),
    users: clamp(candidate.users, defaults.users, limits.users.min, limits.users.max),
    activeClients: clamp(candidate.activeClients, defaults.activeClients, limits.activeClients.min, limits.activeClients.max),
    monthlyFlows,
    monthlyReceived: Math.min(
      clamp(candidate.monthlyReceived, defaults.monthlyReceived, limits.monthlyReceived.min, limits.monthlyReceived.max),
      monthlyFlows,
    ),
    apiRequired: typeof candidate.apiRequired === 'boolean' ? candidate.apiRequired : defaults.apiRequired,
  };
}

const calculated = (
  offer: InvoicePlatformPublicOffer,
  cost36mEur: number,
  noteFr: string,
  noteEn: string,
): InvoicePlatformCostResult => ({
  ...offer,
  status: 'calculated',
  cost36mEur,
  monthlyEquivalentEur: cost36mEur / 36,
  noteFr,
  noteEn,
});

const unknown = (
  offer: InvoicePlatformPublicOffer,
  noteFr: string,
  noteEn: string,
): InvoicePlatformCostResult => ({
  ...offer,
  status: 'unknown',
  cost36mEur: null,
  monthlyEquivalentEur: null,
  noteFr,
  noteEn,
});

function resultForOffer(
  offer: InvoicePlatformPublicOffer,
  input: InvoicePlatformCostInputs,
): InvoicePlatformCostResult {
  const annualFlows = input.monthlyFlows * 12;

  switch (offer.id) {
    case 'qonto':
      return input.users === 1 && !input.apiRequired
        ? calculated(offer, 0, 'Coût direct public : 0 €. Multi-utilisateurs et API non chiffrés.', 'Public direct cost: €0. Multi-user and API use are not priced.')
        : unknown(offer, 'Le périmètre gratuit public ne permet pas de chiffrer ce nombre d’utilisateurs ou l’API.', 'The public free scope does not price this user count or the API.');

    case 'indy':
    case 'abby':
    case 'dougs':
    case 'tiime':
      return input.users === 1 && !input.apiRequired
        ? calculated(offer, 0, 'Coût direct public : 0 € pour le périmètre individuel retenu.', 'Public direct cost: €0 for the individual-use scope used here.')
        : unknown(offer, 'Le coût multi-utilisateurs ou API n’est pas assez documenté dans l’offre gratuite.', 'Multi-user or API pricing is not documented clearly enough in the free offer.');

    case 'pennylane':
      if (input.isMicro && input.users === 1 && annualFlows <= 1_200 && !input.apiRequired) {
        return calculated(offer, 0, 'Offre gratuite micro, dans la limite de 1 200 factures par an.', 'Free micro-business offer, within the 1,200-invoice annual cap.');
      }
      if (input.users === 1 && !input.apiRequired) {
        return calculated(offer, 7 * 36, 'Plan Starter public à 7 € par mois. Vérifier son adéquation fonctionnelle.', 'Public Starter plan at €7 a month. Functional fit still needs checking.');
      }
      return unknown(offer, 'Le besoin sort du périmètre public à un utilisateur.', 'The requirement falls outside the public one-user scope.');

    case 'super-pdp': {
      if (!input.apiRequired && input.monthlyFlows <= 1_000) {
        return calculated(offer, 2, 'Compte gratuit, avec 2 € de vérification KYC ou KYB comptés une fois.', 'Free account, with the €2 KYC or KYB check counted once.');
      }
      const unitPrice = input.monthlyFlows <= 10_000
        ? 0.01
        : input.monthlyFlows <= 100_000
          ? 0.005
          : 0.0025;
      const annualPrice = Math.max(10, annualFlows * unitPrice);
      return calculated(offer, 2 + annualPrice * 3, 'Tarif API public, minimum annuel de 10 € inclus.', 'Public API tariff, including the €10 annual minimum.');
    }

    case 'b2brouter':
      if (annualFlows <= 24 && input.users <= 1 && !input.apiRequired) {
        return calculated(offer, 0, 'Plan Basic à 24 transactions par an.', 'Basic plan with 24 annual transactions.');
      }
      if (input.users <= 2 && !input.apiRequired) {
        return calculated(offer, 110 * 3, 'Plan Professional à 110 € par an.', 'Professional plan at €110 a year.');
      }
      if (input.users <= 10 && !input.apiRequired) {
        return calculated(offer, 300 * 3, 'Plan Business à 300 € par an.', 'Business plan at €300 a year.');
      }
      return unknown(offer, 'Les produits intégrés et l’API sont sur demande.', 'Integrated products and the API are quote-based.');

    case 'vosfactures': {
      if (input.apiRequired && input.users > 6) {
        return unknown(offer, 'Le plan et le coût de l’API pour ce profil doivent être confirmés.', 'The plan and API cost for this profile require confirmation.');
      }
      const monthly = input.monthlyFlows <= 3 && input.users <= 1
        ? 0
        : input.users <= 1
          ? 5
          : input.users <= 3
            ? 15
            : input.users <= 6
              ? 25
              : 60;
      return calculated(offer, monthly * 36, 'Le nombre de flux est utilisé comme approximation du nombre de documents.', 'The entered flow count is used as a proxy for document count.');
    }

    case 'macompta': {
      if (input.apiRequired || input.monthlyFlows > 500) {
        return unknown(offer, 'API ou plus de 500 flux par mois : devis nécessaire.', 'API use or more than 500 monthly flows requires a quote.');
      }
      const monthly = input.monthlyFlows <= 20
        ? 0
        : input.monthlyFlows <= 50
          ? 5
          : input.monthlyFlows <= 100
            ? 10
            : input.monthlyFlows <= 250
              ? 15
              : 20;
      return calculated(offer, monthly * 36, 'Tarif public pour un utilisateur non-abonné aux autres logiciels.', 'Public price for a user not subscribing to the other software products.');
    }

    case 'shine':
      if (input.apiRequired) {
        return unknown(offer, 'Aucun tarif API public identifié.', 'No public API price was identified.');
      }
      if (input.activeClients <= 5 && input.users <= 1) {
        return calculated(offer, 0, 'Plan Free dans la limite de cinq clients. La date d’activation de l’émission électronique reste à confirmer dans la grille.', 'Free plan within the five-customer limit. The price grid still requires confirmation of the electronic-issuance activation date.');
      }
      if (input.users <= 1) {
        return calculated(offer, 9 * 36, 'Équivalent mensuel du paiement annuel Start.', 'Monthly equivalent of annual Start billing.');
      }
      if (input.users <= 2) {
        return calculated(offer, 20 * 36, 'Équivalent mensuel du paiement annuel Plus.', 'Monthly equivalent of annual Plus billing.');
      }
      return unknown(offer, 'La grille publique s’arrête à deux accès.', 'The public grid stops at two accesses.');

    case 'kolecto': {
      const tier = input.employees <= 3
        ? { monthly: 12, quota: 150, users: 1 }
        : input.employees <= 9
          ? { monthly: 39, quota: 200, users: 5 }
          : { monthly: 99, quota: 300, users: 10 };
      if (input.isNewBusiness) {
        return unknown(offer, 'La première année peut être gratuite, mais le coût des années 2 et 3 dépend du futur plan et des quotas.', 'Year one may be free, but years two and three depend on the later plan and quotas.');
      }
      if (!input.apiRequired && annualFlows <= tier.quota && input.users <= tier.users) {
        return calculated(offer, tier.monthly * 36, 'Plan Essentiel public, dans les quotas de documents et utilisateurs.', 'Public Essentiel plan, within document and user caps.');
      }
      return unknown(offer, 'Le volume, les utilisateurs ou l’API imposent des modules ou un devis non modélisables.', 'Volume, users or API needs require modules or a quote that cannot be modelled.');
    }

    case 'docaposte':
      if (input.apiRequired) {
        return unknown(offer, 'L’intégration API n’est pas chiffrée dans la grille publique.', 'API integration is not priced in the public grid.');
      }
      if (input.monthlyReceived <= 50) {
        return calculated(offer, 19 * 36, 'Plan Starter public.', 'Public Starter plan.');
      }
      if (input.monthlyReceived <= 100) {
        return calculated(offer, 69 * 36, 'Plan Standard public.', 'Public Standard plan.');
      }
      return unknown(offer, 'Le volume dépasse la grille publique directement comparable.', 'The volume exceeds the directly comparable public grid.');

    case 'sellsy': {
      if (input.apiRequired) {
        return unknown(offer, 'Le plan nécessaire à l’API doit être confirmé.', 'The plan required for API use must be confirmed.');
      }
      const licences = Math.max(2, input.users);
      const firstYear = licences * 29 * 12;
      const followingYears = licences * 39 * 24;
      return calculated(offer, firstYear + followingYears, 'Deux licences minimum. Promotion visible jusqu’au 31 août 2026 pour la première année, puis tarif normal public.', 'Two-licence minimum. Promotion visible through 31 August 2026 for year one, then the public standard price.');
    }

    case 'odoo':
      return !input.apiRequired
        ? calculated(offer, 0, 'Coût direct : 0 € seulement si Facturation reste l’unique application utilisée.', 'Direct cost: €0 only if Invoicing remains the only app used.')
        : unknown(offer, 'L’API externe relève du plan Personnalisé, facturé par utilisateur.', 'External API access requires the per-user Custom plan.');

    case 'sage':
    case 'cegid':
    case 'dext':
    case 'axonaut':
      return unknown(offer, offer.scopeFr, offer.scopeEn);

    default:
      return unknown(offer, 'Modèle non disponible.', 'Model unavailable.');
  }
}

export function calculateInvoicePlatformCosts(
  candidate: Partial<InvoicePlatformCostInputs> = {},
): InvoicePlatformCostResult[] {
  const input = normalizeInvoicePlatformCostInputs(candidate);
  return INVOICE_PLATFORM_PUBLIC_OFFERS
    .map((offer) => resultForOffer(offer, input))
    .sort((a, b) => {
      if (a.cost36mEur == null && b.cost36mEur == null) return a.name.localeCompare(b.name);
      if (a.cost36mEur == null) return 1;
      if (b.cost36mEur == null) return -1;
      return a.cost36mEur - b.cost36mEur || a.name.localeCompare(b.name);
    });
}

export const INVOICE_PLATFORM_COST_FORMULA =
  'TCO 36 mois = prix direct + volume + utilisateurs et entités + intégration + archivage et support + produits nécessaires + paiements + sortie';

export const INVOICE_PLATFORM_COST_LIMITS_FR = Object.freeze([
  'Le calcul chiffre seulement le coût direct publiquement calculable.',
  'Une cellule inconnue ne signifie ni gratuité ni prix élevé.',
  'La qualité, la sécurité, le support, le temps gagné et les coûts internes ne sont pas notés.',
  'Les tarifs promotionnels et les périmètres sont photographiés au 22 août 2026.',
]);

export const INVOICE_PLATFORM_COST_LIMITS_EN = Object.freeze([
  'The tool prices only the publicly calculable direct cost.',
  'An unknown result means neither free nor expensive.',
  'Quality, security, support, time saved and internal costs are not scored.',
  'Promotions and scopes are a snapshot taken on 22 August 2026.',
]);
