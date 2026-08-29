export const EUDI_REQUEST_AUDIT_DATA_DATE = '2026-08-29';
export const EUDI_REQUEST_AUDIT_MODEL_VERSION = '1.0.0';

export type EvidenceAnswer = 'yes' | 'no' | 'unknown';
export type TransactionOutcome = 'not-checked' | 'success' | 'failed';
export type RequestAuditStatus = 'blocked' | 'warning' | 'aligned';
export type ReceiptAuditStatus = 'not-checked' | 'incomplete' | 'complete';

export interface EudiRequestAuditInputs {
  registryEntry: EvidenceAnswer;
  certificateValid: EvidenceAnswer;
  identityMatches: EvidenceAnswer;
  declaredAttributes: string[];
  requestedAttributes: string[];
  outcome: TransactionOutcome;
  receiptFields: Record<EudiReceiptFieldId, boolean>;
}

export interface EudiRequestAuditResult {
  requestStatus: RequestAuditStatus;
  receiptStatus: ReceiptAuditStatus;
  excessAttributes: string[];
  missingIdentityChecks: Array<'registryEntry' | 'certificateValid' | 'identityMatches'>;
  unknownIdentityChecks: Array<'registryEntry' | 'certificateValid' | 'identityMatches'>;
  missingReceiptFields: EudiReceiptFieldId[];
  declaredCount: number;
  requestedCount: number;
}

export type EudiReceiptFieldId =
  | 'timestamp'
  | 'serviceIdentity'
  | 'memberState'
  | 'requestedAttributes'
  | 'presentedAttributes'
  | 'failureReason';

export const EUDI_RECEIPT_FIELDS: Array<{
  id: EudiReceiptFieldId;
  requiredFor: 'all' | 'failed';
  labelFr: string;
  labelEn: string;
}> = [
  { id: 'timestamp', requiredFor: 'all', labelFr: 'Date et heure', labelEn: 'Date and time' },
  { id: 'serviceIdentity', requiredFor: 'all', labelFr: 'Nom et identifiant du service', labelEn: 'Service name and identifier' },
  { id: 'memberState', requiredFor: 'all', labelFr: 'État membre du service', labelEn: 'Service Member State' },
  { id: 'requestedAttributes', requiredFor: 'all', labelFr: 'Catégories de données demandées', labelEn: 'Categories of data requested' },
  { id: 'presentedAttributes', requiredFor: 'all', labelFr: 'Catégories de données présentées', labelEn: 'Categories of data presented' },
  { id: 'failureReason', requiredFor: 'failed', labelFr: 'Motif de l’échec', labelEn: 'Reason for failure' },
];

export const EUDI_REQUEST_AUDIT_SOURCES = [
  {
    role: 'registry',
    labelFr: 'Registre public des parties utilisatrices du portefeuille',
    labelEn: 'Public registry of wallet-relying parties',
    url: 'https://eur-lex.europa.eu/eli/reg_impl/2025/848/oj',
  },
  {
    role: 'overasking',
    labelFr: 'Comparaison entre demande et certificat, alerte en cas de dépassement',
    labelEn: 'Request-to-certificate comparison and overasking warning',
    url: 'https://eur-lex.europa.eu/eli/reg_impl/2026/1731/oj',
  },
  {
    role: 'transaction-log',
    labelFr: 'Champs minimaux du journal de transaction',
    labelEn: 'Minimum transaction-log fields',
    url: 'https://eur-lex.europa.eu/eli/reg_impl/2024/2979/oj',
  },
  {
    role: 'dashboard',
    labelFr: 'Tableau de bord, effacement et signalement',
    labelEn: 'Dashboard, erasure and reporting',
    url: 'https://eur-lex.europa.eu/eli/reg/2024/1183/oj',
  },
];

export const EUDI_REQUEST_AUDIT_PRESETS = {
  aligned: {
    fr: {
      registryEntry: 'yes' as const,
      certificateValid: 'yes' as const,
      identityMatches: 'yes' as const,
      declaredAttributes: ['preuve d’âge', 'nom'],
      requestedAttributes: ['preuve d’âge', 'nom'],
    },
    en: {
      registryEntry: 'yes' as const,
      certificateValid: 'yes' as const,
      identityMatches: 'yes' as const,
      declaredAttributes: ['proof of age', 'name'],
      requestedAttributes: ['proof of age', 'name'],
    },
  },
  overasking: {
    fr: {
      registryEntry: 'yes' as const,
      certificateValid: 'yes' as const,
      identityMatches: 'yes' as const,
      declaredAttributes: ['preuve d’âge', 'nom'],
      requestedAttributes: ['preuve d’âge', 'nom', 'adresse complète'],
    },
    en: {
      registryEntry: 'yes' as const,
      certificateValid: 'yes' as const,
      identityMatches: 'yes' as const,
      declaredAttributes: ['proof of age', 'name'],
      requestedAttributes: ['proof of age', 'name', 'full address'],
    },
  },
  unverifiable: {
    fr: {
      registryEntry: 'unknown' as const,
      certificateValid: 'unknown' as const,
      identityMatches: 'unknown' as const,
      declaredAttributes: [],
      requestedAttributes: [],
    },
    en: {
      registryEntry: 'unknown' as const,
      certificateValid: 'unknown' as const,
      identityMatches: 'unknown' as const,
      declaredAttributes: [],
      requestedAttributes: [],
    },
  },
};

export function canonicalAttributeName(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/\p{Diacritic}/gu, '')
    .toLocaleLowerCase('en-US')
    .replace(/[’']/gu, '')
    .replace(/[^\p{Letter}\p{Number}]+/gu, ' ')
    .trim();
}

export function parseAttributeList(value: string): string[] {
  const unique = new Map<string, string>();
  for (const raw of value.split(/[\n,;]+/gu)) {
    const display = raw.trim().replace(/\s+/gu, ' ').slice(0, 80);
    const canonical = canonicalAttributeName(display);
    if (display && canonical && !unique.has(canonical)) unique.set(canonical, display);
    if (unique.size >= 30) break;
  }
  return [...unique.values()];
}

export function emptyReceiptFields(): Record<EudiReceiptFieldId, boolean> {
  return Object.fromEntries(EUDI_RECEIPT_FIELDS.map((field) => [field.id, false])) as Record<EudiReceiptFieldId, boolean>;
}

export function evaluateEudiRequestAudit(inputs: EudiRequestAuditInputs): EudiRequestAuditResult {
  const identityKeys = ['registryEntry', 'certificateValid', 'identityMatches'] as const;
  const missingIdentityChecks = identityKeys.filter((key) => inputs[key] === 'no');
  const unknownIdentityChecks = identityKeys.filter((key) => inputs[key] === 'unknown');
  const declared = new Set(inputs.declaredAttributes.map(canonicalAttributeName).filter(Boolean));
  const excessAttributes = inputs.requestedAttributes.filter((attribute) => !declared.has(canonicalAttributeName(attribute)));
  const listsIncomplete = inputs.declaredAttributes.length === 0 || inputs.requestedAttributes.length === 0;

  const requestStatus: RequestAuditStatus = missingIdentityChecks.length > 0 || excessAttributes.length > 0
    ? 'blocked'
    : unknownIdentityChecks.length > 0 || listsIncomplete
      ? 'warning'
      : 'aligned';

  const requiredReceiptFields = inputs.outcome === 'failed'
    ? EUDI_RECEIPT_FIELDS
    : EUDI_RECEIPT_FIELDS.filter((field) => field.requiredFor === 'all');
  const missingReceiptFields = inputs.outcome === 'not-checked'
    ? []
    : requiredReceiptFields.filter((field) => !inputs.receiptFields[field.id]).map((field) => field.id);
  const receiptStatus: ReceiptAuditStatus = inputs.outcome === 'not-checked'
    ? 'not-checked'
    : missingReceiptFields.length > 0
      ? 'incomplete'
      : 'complete';

  return {
    requestStatus,
    receiptStatus,
    excessAttributes,
    missingIdentityChecks,
    unknownIdentityChecks,
    missingReceiptFields,
    declaredCount: inputs.declaredAttributes.length,
    requestedCount: inputs.requestedAttributes.length,
  };
}
