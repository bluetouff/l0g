export const DIGITAL_EURO_COST_MODEL_VERSION = '1.1.0';
export const DIGITAL_EURO_COST_DATA_DATE = '2026-08-14';

export type InterPspMode = 'rate' | 'fixed';

export interface DigitalEuroCostInputs {
  adoption: number;
  cardFee: number;
  digitalFee: number;
  interPsp: number;
  interPspMode: InterPspMode;
  offline: number;
  development: number;
  annualOpex: number;
  amortisation: number;
  noWorseOff: boolean;
}

export interface DigitalEuroCostResults {
  averageCardTicket: number;
  volume: number;
  transactions: number;
  onlineShare: number;
  onlineVolume: number;
  onlineTransactions: number;
  applicableMsc: number;
  capApplied: boolean;
  currentCost: number;
  digitalCost: number;
  savings: number;
  distributorRevenue: number;
  distributorEffectiveRate: number;
  acquirerRemainder: number;
  opexPerTransaction: number;
  fullPerTransaction: number;
  negativeAcquirer: boolean;
}

export const DIGITAL_EURO_CARD_BASE = Object.freeze({
  value: 3_530_718_386_134.8506,
  transactions: 91_708_654_727,
  geography: 'Euro area',
  period: '2025-S1 + 2025-S2',
  valueSeries: 'PAY.H.U2.W0.CP0.1._Z.N.EUR',
  transactionSeries: 'PAY.H.U2.W0.CP0.1._Z.N.PN',
  source: 'European Central Bank Data Portal',
  sourceUrl: 'https://data.ecb.europa.eu/data/datasets/PAY/PAY.H.U2.W0.CP0.1._Z.N.EUR',
});

export const DIGITAL_EURO_COST_DEFAULTS: Readonly<DigitalEuroCostInputs> = Object.freeze({
  adoption: 10,
  cardFee: 0.5,
  digitalFee: 0.3,
  interPsp: 0.18,
  interPspMode: 'rate',
  offline: 10,
  development: 1.3e9,
  annualOpex: 320e6,
  amortisation: 10,
  noWorseOff: true,
});

export const DIGITAL_EURO_COST_LIMITS = Object.freeze({
  adoption: { min: 1, max: 50 },
  cardFee: { min: 0.1, max: 1.5 },
  digitalFee: { min: 0, max: 1 },
  interPsp: { min: 0, max: 0.6 },
  offline: { min: 0, max: 50 },
  development: { min: 0.5e9, max: 3e9 },
  annualOpex: { min: 100e6, max: 800e6 },
  amortisation: { min: 5, max: 20 },
});

const clamp = (value: unknown, fallback: number, min: number, max: number) => {
  const numeric = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(numeric) ? Math.min(Math.max(numeric, min), max) : fallback;
};

export function normalizeDigitalEuroCostInputs(
  candidate: Partial<DigitalEuroCostInputs> = {},
): DigitalEuroCostInputs {
  const defaults = DIGITAL_EURO_COST_DEFAULTS;
  const limits = DIGITAL_EURO_COST_LIMITS;
  return {
    adoption: clamp(candidate.adoption, defaults.adoption, limits.adoption.min, limits.adoption.max),
    cardFee: clamp(candidate.cardFee, defaults.cardFee, limits.cardFee.min, limits.cardFee.max),
    digitalFee: clamp(candidate.digitalFee, defaults.digitalFee, limits.digitalFee.min, limits.digitalFee.max),
    interPsp: clamp(candidate.interPsp, defaults.interPsp, limits.interPsp.min, limits.interPsp.max),
    interPspMode: candidate.interPspMode === 'fixed' ? 'fixed' : 'rate',
    offline: clamp(candidate.offline, defaults.offline, limits.offline.min, limits.offline.max),
    development: clamp(candidate.development, defaults.development, limits.development.min, limits.development.max),
    annualOpex: clamp(candidate.annualOpex, defaults.annualOpex, limits.annualOpex.min, limits.annualOpex.max),
    amortisation: clamp(candidate.amortisation, defaults.amortisation, limits.amortisation.min, limits.amortisation.max),
    noWorseOff: typeof candidate.noWorseOff === 'boolean' ? candidate.noWorseOff : defaults.noWorseOff,
  };
}

export function calculateDigitalEuroCost(
  candidate: Partial<DigitalEuroCostInputs> = {},
): DigitalEuroCostResults {
  const inputs = normalizeDigitalEuroCostInputs(candidate);
  const volume = DIGITAL_EURO_CARD_BASE.value * inputs.adoption / 100;
  const transactions = DIGITAL_EURO_CARD_BASE.transactions * inputs.adoption / 100;
  const onlineShare = 1 - inputs.offline / 100;
  const onlineVolume = volume * onlineShare;
  const onlineTransactions = transactions * onlineShare;
  const applicableMsc = inputs.noWorseOff
    ? Math.min(inputs.digitalFee, inputs.cardFee)
    : inputs.digitalFee;
  const currentCost = volume * inputs.cardFee / 100;
  const digitalCost = onlineVolume * applicableMsc / 100;
  const distributorRevenue = inputs.interPspMode === 'fixed'
    ? onlineTransactions * inputs.interPsp
    : onlineVolume * inputs.interPsp / 100;
  const acquirerRemainder = digitalCost - distributorRevenue;

  return {
    averageCardTicket: DIGITAL_EURO_CARD_BASE.value / DIGITAL_EURO_CARD_BASE.transactions,
    volume,
    transactions,
    onlineShare,
    onlineVolume,
    onlineTransactions,
    applicableMsc,
    capApplied: inputs.noWorseOff && inputs.digitalFee > inputs.cardFee,
    currentCost,
    digitalCost,
    savings: currentCost - digitalCost,
    distributorRevenue,
    distributorEffectiveRate: onlineVolume > 0 ? distributorRevenue / onlineVolume * 100 : 0,
    acquirerRemainder,
    opexPerTransaction: inputs.annualOpex / transactions * 100,
    fullPerTransaction: (inputs.annualOpex + inputs.development / inputs.amortisation) / transactions * 100,
    negativeAcquirer: acquirerRemainder < 0,
  };
}

export const DIGITAL_EURO_COST_QUERY_KEYS = Object.freeze({
  adoption: 'a',
  cardFee: 'card',
  digitalFee: 'msc',
  interPsp: 'inter',
  interPspMode: 'im',
  offline: 'offline',
  development: 'dev',
  annualOpex: 'opex',
  amortisation: 'amort',
  noWorseOff: 'nwo',
});

export const DIGITAL_EURO_COST_FORMULAS = Object.freeze({
  migratedValue: 'V = V_card × adoption / 100',
  migratedTransactions: 'N = N_card × adoption / 100',
  applicableMsc: 'm = no-worse-off ? min(MSC, card fee) : MSC',
  cardCounterfactual: 'C_card = V × card fee / 100',
  digitalMerchantCharge: 'C_DE = V × (1 - offline / 100) × m / 100',
  distributorRate: 'R_distributor = V_online × inter-PSP rate / 100',
  distributorFixed: 'R_distributor = N_online × fixed inter-PSP fee',
  acquirerRemainder: 'R_acquirer = C_DE - R_distributor',
  merchantSavings: 'Savings = C_card - C_DE',
  publicOpex: 'OPEX/transaction = annual OPEX / N',
  publicFull: 'Full public cost/transaction = (annual OPEX + development/amortisation) / N',
});

export const DIGITAL_EURO_COST_SOURCES = Object.freeze([
  {
    label: 'ECB payment statistics, card payments sent, 2025',
    url: DIGITAL_EURO_CARD_BASE.sourceUrl,
    role: 'Observed card value and transaction count',
  },
  {
    label: 'ECB, moving to the next phase of the digital euro project, 30 October 2025',
    url: 'https://www.ecb.europa.eu/press/pr/date/2025/html/ecb.pr251030~8c5b5beef0.en.html',
    role: 'Official central development and annual operating cost estimates',
  },
  {
    label: 'European Parliament, ECON report A10-0185/2026',
    url: 'https://www.europarl.europa.eu/doceo/document/A-10-2026-0185_EN.pdf',
    role: 'Parliament negotiating position on fee caps and offline payments',
  },
  {
    label: 'Council of the EU, negotiating mandate 16695/25',
    url: 'https://data.consilium.europa.eu/doc/document/ST-16695-2025-INIT/en/pdf',
    role: 'Council negotiating position and fee-cap methodology',
  },
]);
