export const INVOICE_ACCESS_DATA_DATE = '2026-08-22';
export const INVOICE_ACCESS_MODEL_VERSION = '1.0.0';

export type InvoiceAccessLevel = 'full' | 'structured' | 'routing' | 'technical';
export type InvoiceAccessToggle = 'software' | 'accountant' | 'bank' | 'credit' | 'internalAi' | 'externalAi';

export interface InvoiceAccessInputs {
  software: boolean;
  accountant: boolean;
  bank: boolean;
  credit: boolean;
  internalAi: boolean;
  externalAi: boolean;
}

export interface InvoiceAccessNode {
  id: string;
  order: number;
  mandatory: boolean;
  toggle?: InvoiceAccessToggle;
  level: InvoiceAccessLevel;
  titleFr: string;
  titleEn: string;
  descriptionFr: string;
  descriptionEn: string;
  caveatFr: string;
  caveatEn: string;
  sourceUrl: string;
}

export const INVOICE_ACCESS_DEFAULTS: InvoiceAccessInputs = {
  software: true,
  accountant: false,
  bank: false,
  credit: false,
  internalAi: false,
  externalAi: false,
};

const nodes: InvoiceAccessNode[] = [
  {
    id: 'sender', order: 10, mandatory: true, level: 'full',
    titleFr: 'Votre entreprise', titleEn: 'Your company',
    descriptionFr: 'Les utilisateurs habilités créent, valident ou consultent le document complet.',
    descriptionEn: 'Authorised users create, approve or view the full document.',
    caveatFr: 'Les droits internes doivent suivre le besoin réel.',
    caveatEn: 'Internal permissions should follow actual need.',
    sourceUrl: 'https://www.legifrance.gouv.fr/codes/id/LEGISCTA000054552492/2026-07-29',
  },
  {
    id: 'software', order: 20, mandatory: false, toggle: 'software', level: 'full',
    titleFr: 'Logiciel, ERP ou Solution Compatible', titleEn: 'Software, ERP or compatible solution',
    descriptionFr: 'Il traite le document complet si vous l’utilisez pour créer, importer ou synchroniser la facture.',
    descriptionEn: 'It processes the full document when used to create, import or synchronise the invoice.',
    caveatFr: 'Il peut être distinct de la plateforme agréée qui transporte réellement le flux.',
    caveatEn: 'It may be separate from the approved platform that actually carries the flow.',
    sourceUrl: 'https://www.impots.gouv.fr/facturation-electronique-et-plateformes-agreees',
  },
  {
    id: 'accountant', order: 30, mandatory: false, toggle: 'accountant', level: 'full',
    titleFr: 'Expert-comptable', titleEn: 'Accountant',
    descriptionFr: 'Il peut accéder aux factures et aux données comptables selon le mandat et les droits du dossier.',
    descriptionEn: 'They may access invoices and accounting data under the engagement and workspace permissions.',
    caveatFr: 'Cet accès n’est pas automatique dans tous les produits.',
    caveatEn: 'This access is not automatic in every product.',
    sourceUrl: 'https://help.shine.fr/shine-facture/fr/articles/15885445-l-auto-validation-devient-partage-automatique',
  },
  {
    id: 'issuer-platform', order: 40, mandatory: true, level: 'full',
    titleFr: 'PA de l’émetteur', titleEn: 'Sender approved platform',
    descriptionFr: 'Elle reçoit ou crée la facture, effectue les contrôles, l’adresse et extrait les données fiscales.',
    descriptionEn: 'It receives or creates the invoice, runs checks, routes it and extracts tax data.',
    caveatFr: 'La marque visible peut utiliser une plateforme support.',
    caveatEn: 'The visible brand may rely on a support platform.',
    sourceUrl: 'https://www.legifrance.gouv.fr/codes/id/LEGISCTA000054552492/2026-07-29',
  },
  {
    id: 'technical', order: 50, mandatory: true, level: 'technical',
    titleFr: 'Infrastructure et sous-traitants éventuels', titleEn: 'Infrastructure and any subcontractors',
    descriptionFr: 'Ils peuvent disposer d’un accès technique potentiel aux données du service.',
    descriptionEn: 'They may have potential technical access to service data.',
    caveatFr: 'Accès technique ne signifie pas lecture humaine habituelle.',
    caveatEn: 'Technical access does not mean routine human reading.',
    sourceUrl: 'https://www.legifrance.gouv.fr/codes/id/LEGISCTA000054552492/2026-07-29',
  },
  {
    id: 'directory', order: 60, mandatory: true, level: 'routing',
    titleFr: 'Annuaire central', titleEn: 'Central directory',
    descriptionFr: 'Il identifie la plateforme et l’adresse de réception du client.',
    descriptionEn: 'It identifies the customer platform and receiving address.',
    caveatFr: 'Sa finalité est l’adressage, pas le contenu de la facture.',
    caveatEn: 'Its purpose is routing, not invoice content.',
    sourceUrl: 'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000049330326/2026-09-01',
  },
  {
    id: 'recipient-platform', order: 70, mandatory: true, level: 'full',
    titleFr: 'PA du destinataire', titleEn: 'Recipient approved platform',
    descriptionFr: 'Elle reçoit le document complet et le met à disposition du client.',
    descriptionEn: 'It receives the full document and makes it available to the customer.',
    caveatFr: 'Une seule PA peut tenir les deux rôles si les entreprises utilisent le même opérateur.',
    caveatEn: 'One PA may hold both roles when both companies use the same operator.',
    sourceUrl: 'https://www.legifrance.gouv.fr/codes/id/LEGISCTA000054552492/2026-07-29',
  },
  {
    id: 'recipient', order: 80, mandatory: true, level: 'full',
    titleFr: 'Entreprise cliente', titleEn: 'Customer company',
    descriptionFr: 'Elle consulte la facture, peut la refuser et traite son paiement.',
    descriptionEn: 'It views the invoice, may refuse it and processes payment.',
    caveatFr: 'Les droits d’achat, de validation et de comptabilité peuvent être séparés.',
    caveatEn: 'Purchasing, approval and accounting rights may be separated.',
    sourceUrl: 'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000054606169',
  },
  {
    id: 'tax-authority', order: 90, mandatory: true, level: 'structured',
    titleFr: 'Administration fiscale', titleEn: 'Tax authority',
    descriptionFr: 'Elle reçoit le fichier structuré, les statuts et, selon le cas, des données de transaction et de paiement.',
    descriptionEn: 'It receives the structured file, statuses and, where relevant, transaction and payment data.',
    caveatFr: 'Ce n’est pas nécessairement le PDF ou le fichier intégral échangé entre les plateformes.',
    caveatEn: 'This is not necessarily the PDF or complete file exchanged between platforms.',
    sourceUrl: 'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000054606114',
  },
  {
    id: 'bank', order: 100, mandatory: false, toggle: 'bank', level: 'structured',
    titleFr: 'Banque ou service de paiement', titleEn: 'Bank or payment service',
    descriptionFr: 'Il peut recevoir les données utiles au rapprochement, au règlement et à la trésorerie.',
    descriptionEn: 'It may receive data needed for matching, settlement and cash management.',
    caveatFr: 'L’intégration bancaire ne prouve pas un usage automatique pour le crédit.',
    caveatEn: 'Bank integration does not prove automatic use for credit scoring.',
    sourceUrl: 'https://www.shine.fr/privacy/fr/',
  },
  {
    id: 'credit', order: 110, mandatory: false, toggle: 'credit', level: 'structured',
    titleFr: 'Crédit ou affacturage', titleEn: 'Credit or factoring',
    descriptionFr: 'Un partenaire peut recevoir les données prévues par le parcours de financement activé par le client.',
    descriptionEn: 'A partner may receive data defined by a financing journey activated by the customer.',
    caveatFr: 'Le jeu de données et la décision automatisée doivent être documentés produit par produit.',
    caveatEn: 'The dataset and any automated decision must be documented product by product.',
    sourceUrl: 'https://www.shine.fr/privacy/fr/',
  },
  {
    id: 'internal-ai', order: 120, mandatory: false, toggle: 'internalAi', level: 'technical',
    titleFr: 'IA intégrée au produit', titleEn: 'Product integrated AI',
    descriptionFr: 'Elle peut lire un document ou ses données pour l’OCR, la catégorisation, la recherche ou l’assistance.',
    descriptionEn: 'It may read a document or its data for OCR, categorisation, search or assistance.',
    caveatFr: 'Il faut vérifier fournisseur, localisation, conservation et règles d’entraînement.',
    caveatEn: 'Provider, location, retention and training rules must be checked.',
    sourceUrl: 'https://www.dougs.fr/politique-confidentialite/',
  },
  {
    id: 'external-ai', order: 130, mandatory: false, toggle: 'externalAi', level: 'technical',
    titleFr: 'Assistant IA externe connecté', titleEn: 'Connected external AI assistant',
    descriptionFr: 'Les données nécessaires à la requête peuvent être envoyées au fournisseur choisi par l’utilisateur.',
    descriptionEn: 'Data required for the request may be sent to the provider chosen by the user.',
    caveatFr: 'La révocation arrête les nouveaux transferts, sans garantir l’effacement des données déjà reçues.',
    caveatEn: 'Revocation stops new transfers without guaranteeing deletion of data already received.',
    sourceUrl: 'https://support-fr.qonto.com/hc/fr/articles/47588576515089-Comment-connecter-et-utiliser-le-serveur-MCP-de-Qonto',
  },
];

export const INVOICE_ACCESS_NODES = nodes.sort((a, b) => a.order - b.order);

export const INVOICE_ACCESS_SOURCES = [
  {
    labelFr: 'Légifrance, exigences et services des plateformes agréées',
    labelEn: 'Légifrance, approved platform duties and security requirements',
    url: 'https://www.legifrance.gouv.fr/codes/id/LEGISCTA000054552492/2026-07-29',
  },
  {
    labelFr: 'Légifrance, données structurées des factures',
    labelEn: 'Légifrance, structured invoice data',
    url: 'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000054606114',
  },
  {
    labelFr: 'DGFiP, tableau des données transmises',
    labelEn: 'DGFiP, official table of transmitted data',
    url: 'https://www.impots.gouv.fr/sites/default/files/media/1_metier/2_professionnel/EV/2_gestion/290_facturation_electronique/japprof_donnees-de-facture-a-transmettre-a-ladministration-correspondance-flux_vf.pdf',
  },
];

export function activeInvoiceAccessNodes(inputs: InvoiceAccessInputs): InvoiceAccessNode[] {
  return INVOICE_ACCESS_NODES.filter((node) => node.mandatory || (node.toggle ? inputs[node.toggle] : false));
}
