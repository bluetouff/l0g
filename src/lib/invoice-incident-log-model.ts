export const INVOICE_INCIDENT_DATA_DATE = '2026-08-22';
export const INVOICE_INCIDENT_MODEL_VERSION = '1.0.0';

export type IncidentDirection = 'received' | 'sent' | 'reporting';

export interface IncidentStep {
  id: string;
  order: number;
  titleFr: string;
  titleEn: string;
  detailFr: string;
  detailEn: string;
  sourceSectionFr: string;
  sourceSectionEn: string;
}

export const INVOICE_INCIDENT_STEPS: IncidentStep[] = [
  {
    id: 'identify', order: 10,
    titleFr: 'Identifier le flux touché', titleEn: 'Identify the affected flow',
    detailFr: 'Notez la facture ou la période concernée, le canal attendu et le symptôme observé.',
    detailEn: 'Record the affected invoice or period, expected channel and observed symptom.',
    sourceSectionFr: 'Questions 6, 16, 21 et 22',
    sourceSectionEn: 'Questions 6, 16, 21 and 22',
  },
  {
    id: 'preserve', order: 20,
    titleFr: 'Conserver les preuves', titleEn: 'Preserve evidence',
    detailFr: 'Gardez les statuts, messages d’erreur, horodatages, tickets et échanges avec les parties.',
    detailEn: 'Keep statuses, error messages, timestamps, tickets and exchanges with the parties.',
    sourceSectionFr: 'Questions 6, 16, 25 et 26',
    sourceSectionEn: 'Questions 6, 16, 25 and 26',
  },
  {
    id: 'contact', order: 30,
    titleFr: 'Alerter le bon interlocuteur', titleEn: 'Contact the right party',
    detailFr: 'Contactez la plateforme, l’éditeur, le prestataire ou le client selon l’origine apparente.',
    detailEn: 'Contact the platform, software vendor, provider or customer according to the apparent cause.',
    sourceSectionFr: 'Questions 2, 11, 13, 25 et 26',
    sourceSectionEn: 'Questions 2, 11, 13, 25 and 26',
  },
  {
    id: 'continuity', order: 40,
    titleFr: 'Organiser la continuité', titleEn: 'Organise continuity',
    detailFr: 'Si le blocage le justifie, utilisez un canal alternatif et rattachez clairement la copie à la facture initiale.',
    detailEn: 'If the disruption warrants it, use an alternative channel and clearly link the copy to the original invoice.',
    sourceSectionFr: 'Questions 13, 14 et 15',
    sourceSectionEn: 'Questions 13, 14 and 15',
  },
  {
    id: 'duplicate-lock', order: 50,
    titleFr: 'Verrouiller les doublons', titleEn: 'Block duplicate processing',
    detailFr: 'Désignez une référence unique et empêchez le double paiement, la double comptabilisation, déduction ou déclaration.',
    detailEn: 'Choose one reference and prevent duplicate payment, booking, deduction or reporting.',
    sourceSectionFr: 'Questions 5 et 15',
    sourceSectionEn: 'Questions 5 and 15',
  },
  {
    id: 'regularise', order: 60,
    titleFr: 'Régulariser le circuit', titleEn: 'Regularise the flow',
    detailFr: 'Transmettez la même facture ou les données attendues dès le rétablissement, puis rapprochez les traces.',
    detailEn: 'Transmit the same invoice or required data after recovery, then reconcile the records.',
    sourceSectionFr: 'Questions 14, 15, 21, 22 et 24',
    sourceSectionEn: 'Questions 14, 15, 21, 22 and 24',
  },
  {
    id: 'close', order: 70,
    titleFr: 'Clore et conserver', titleEn: 'Close and retain',
    detailFr: 'Datez le retour à la normale, le rapprochement et les corrections qui restent à suivre.',
    detailEn: 'Date the recovery, reconciliation and any corrective actions still outstanding.',
    sourceSectionFr: 'Questions 16, 27 et 29',
    sourceSectionEn: 'Questions 16, 27 and 29',
  },
];

export const INVOICE_INCIDENT_SOURCES = [
  {
    labelFr: 'DGFiP, guide pratique de démarrage au 1er septembre 2026',
    labelEn: 'DGFiP, practical go-live guide for 1 September 2026',
    url: 'https://www.impots.gouv.fr/sites/default/files/media/1_metier/2_professionnel/EV/2_gestion/290_facturation_electronique/guide_pratique_facturation_electronique.pdf',
  },
  {
    labelFr: 'Légifrance, article 289 bis du code général des impôts',
    labelEn: 'Légifrance, Article 289 bis of the French General Tax Code',
    url: 'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000046195635',
  },
];
