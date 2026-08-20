export const DANUBE_CENTIMETRE_MODEL_VERSION = '1.0.0';
export const DANUBE_CENTIMETRE_DATA_DATE = '2026-08-20';

export interface DanubeCentimetreInputs {
  capacityMW: number;
  durationHours: number;
  replacementPriceEurMWh: number;
  localLiftCm: number;
  interventionCostEur: number;
}

export interface DanubeCentimetreResults {
  energyMWh: number;
  energyGWh: number;
  grossAvoidedCostEur: number;
  grossValuePerCmEur: number;
  breakEvenHours: number | null;
  breakEvenDays: number | null;
  netBalanceEur: number;
  interventionRecovered: boolean;
}

export const DANUBE_CENTIMETRE_DEFAULTS: Readonly<DanubeCentimetreInputs> = Object.freeze({
  capacityMW: 705,
  durationHours: 24,
  replacementPriceEurMWh: 150,
  localLiftCm: 5,
  interventionCostEur: 10_000_000,
});

export const DANUBE_CENTIMETRE_LIMITS = Object.freeze({
  capacityMW: { min: 0, max: 5_000 },
  durationHours: { min: 0, max: 2_160 },
  replacementPriceEurMWh: { min: 0, max: 1_000 },
  localLiftCm: { min: 0.1, max: 200 },
  interventionCostEur: { min: 0, max: 500_000_000 },
});

export const DANUBE_CENTIMETRE_PRESETS = Object.freeze([
  {
    id: 'cernavoda-unit',
    labelFr: 'Une unité de Cernavodă',
    labelEn: 'One Cernavodă unit',
    noteFr: '705 MW installés, arrondis à partir des 704,8 MW publiés pour l’unité 2.',
    noteEn: '705 MW installed, rounded from the published 704.8 MW for Unit 2.',
    inputs: { ...DANUBE_CENTIMETRE_DEFAULTS },
  },
  {
    id: 'paks-turbogenerator',
    labelFr: 'Un turbogénérateur de Paks',
    labelEn: 'One Paks turbine-generator',
    noteFr: '250 MW illustratifs, soit la moitié d’un bloc de 500 MW.',
    noteEn: 'An illustrative 250 MW, half of one 500 MW unit.',
    inputs: { ...DANUBE_CENTIMETRE_DEFAULTS, capacityMW: 250 },
  },
  {
    id: 'paks-site',
    labelFr: 'Le site complet de Paks',
    labelEn: 'The full Paks site',
    noteFr: '2 000 MW installés répartis entre quatre blocs.',
    noteEn: '2,000 MW installed across four units.',
    inputs: { ...DANUBE_CENTIMETRE_DEFAULTS, capacityMW: 2_000 },
  },
]);
const clamp = (value: unknown, fallback: number, min: number, max: number) => {
  const numeric = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(numeric) ? Math.min(Math.max(numeric, min), max) : fallback;
};

export function normalizeDanubeCentimetreInputs(
  candidate: Partial<DanubeCentimetreInputs> = {},
): DanubeCentimetreInputs {
  const defaults = DANUBE_CENTIMETRE_DEFAULTS;
  const limits = DANUBE_CENTIMETRE_LIMITS;
  return {
    capacityMW: clamp(candidate.capacityMW, defaults.capacityMW, limits.capacityMW.min, limits.capacityMW.max),
    durationHours: clamp(candidate.durationHours, defaults.durationHours, limits.durationHours.min, limits.durationHours.max),
    replacementPriceEurMWh: clamp(candidate.replacementPriceEurMWh, defaults.replacementPriceEurMWh, limits.replacementPriceEurMWh.min, limits.replacementPriceEurMWh.max),
    localLiftCm: clamp(candidate.localLiftCm, defaults.localLiftCm, limits.localLiftCm.min, limits.localLiftCm.max),
    interventionCostEur: clamp(candidate.interventionCostEur, defaults.interventionCostEur, limits.interventionCostEur.min, limits.interventionCostEur.max),
  };
}

export function calculateDanubeCentimetre(
  candidate: Partial<DanubeCentimetreInputs> = {},
): DanubeCentimetreResults {
  const inputs = normalizeDanubeCentimetreInputs(candidate);
  const energyMWh = inputs.capacityMW * inputs.durationHours;
  const grossAvoidedCostEur = energyMWh * inputs.replacementPriceEurMWh;
  const hourlyAvoidedCostEur = inputs.capacityMW * inputs.replacementPriceEurMWh;
  const breakEvenHours = hourlyAvoidedCostEur > 0
    ? inputs.interventionCostEur / hourlyAvoidedCostEur
    : null;

  return {
    energyMWh,
    energyGWh: energyMWh / 1_000,
    grossAvoidedCostEur,
    grossValuePerCmEur: grossAvoidedCostEur / inputs.localLiftCm,
    breakEvenHours,
    breakEvenDays: breakEvenHours == null ? null : breakEvenHours / 24,
    netBalanceEur: grossAvoidedCostEur - inputs.interventionCostEur,
    interventionRecovered: grossAvoidedCostEur >= inputs.interventionCostEur,
  };
}

export const DANUBE_CENTIMETRE_FORMULAS = Object.freeze({
  preservedEnergy: 'E (MWh) = maintained capacity (MW) × duration (h)',
  grossAvoidedCost: 'Gross avoided cost (€) = E (MWh) × replacement price (€/MWh)',
  grossValuePerCm: 'Indicative gross value per centimetre (€ / cm) = gross avoided cost (€) ÷ local lift (cm)',
  breakEven: 'Break-even duration (h) = intervention cost (€) ÷ [maintained capacity (MW) × replacement price (€/MWh)]',
  netBalance: 'Net scenario balance (€) = gross avoided cost (€) − intervention cost (€)',
});

export const DANUBE_CENTIMETRE_SOURCES = Object.freeze([
  {
    label: 'MVM Paksi Atomerőmű, low-water operating notice, 30 July 2026',
    url: 'https://atomeromu.mvm.hu/hu-HU/Rolunk/Hirek/20260730_leallas',
    role: 'Observed Paks site capacity, operating-water requirements and pump-intake constraint',
  },
  {
    label: 'Nuclearelectrica, published installed capacity for Cernavodă Unit 2',
    url: 'https://nuclearelectrica.ro/ir/wp-content/uploads/sites/3/2025/07/Proiect-Componenta-integrala-a-planului-de-selectie-1.pdf',
    role: 'Observed installed capacity of 704.8 MWe, rounded to 705 MW in the preset',
  },
  {
    label: 'Nuclearelectrica, Unit 2 status update, 4 August 2026',
    url: 'https://nuclearelectrica.ro/ir/wp-content/uploads/sites/3/2026/08/en-RC-update-status-U2-.pdf',
    role: 'Observed local level increase after public works, without a quantified counterfactual',
  },
]);
