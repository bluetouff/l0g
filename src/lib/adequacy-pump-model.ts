export const ADEQUACY_PUMP_MODEL_VERSION = '1.0.0';
export const ADEQUACY_PUMP_DATA_DATE = '2026-08-21';

export interface AdequacyPumpInputs {
  zoneDemandMw: number;
  zoneDomesticMw: number;
  importCapacityMw: number;
  hydroLossMw: number;
  waterCoolingLossMw: number;
  flexibilityMw: number;
  localDemandMw: number;
  localDomesticMw: number;
  localHydroLossMw: number;
  localWaterCoolingLossMw: number;
  localImportSharePct: number;
  localFlexibilityMw: number;
}

export type ZoneVerdict = 'positive-before-measures' | 'positive-after-measures' | 'deficit';
export type LocalVerdict = 'positive' | 'deficit';
export type DualVerdict =
  | 'positive'
  | 'measures'
  | 'local-deficit'
  | 'measures-local-deficit'
  | 'zone-deficit';

export interface AdequacyPumpResult {
  inputs: AdequacyPumpInputs;
  baselineMarginMw: number;
  postWaterMarginMw: number;
  finalZoneMarginMw: number;
  localAccessibleImportsMw: number;
  finalLocalMarginMw: number;
  totalWaterLossMw: number;
  zoneVerdict: ZoneVerdict;
  localVerdict: LocalVerdict;
  dualVerdict: DualVerdict;
}

export const ADEQUACY_PUMP_DEFAULTS: Readonly<AdequacyPumpInputs> = Object.freeze({
  zoneDemandMw: 8_000,
  zoneDomesticMw: 7_000,
  importCapacityMw: 2_000,
  hydroLossMw: 800,
  waterCoolingLossMw: 700,
  flexibilityMw: 600,
  localDemandMw: 2_500,
  localDomesticMw: 2_200,
  localHydroLossMw: 300,
  localWaterCoolingLossMw: 400,
  localImportSharePct: 35,
  localFlexibilityMw: 100,
});

export const ADEQUACY_PUMP_PRESETS = Object.freeze({
  basinShock: ADEQUACY_PUMP_DEFAULTS,
  comfortable: Object.freeze({
    zoneDemandMw: 8_000,
    zoneDomesticMw: 7_700,
    importCapacityMw: 1_500,
    hydroLossMw: 350,
    waterCoolingLossMw: 250,
    flexibilityMw: 300,
    localDemandMw: 2_300,
    localDomesticMw: 2_350,
    localHydroLossMw: 100,
    localWaterCoolingLossMw: 100,
    localImportSharePct: 35,
    localFlexibilityMw: 100,
  }),
  limitedImports: Object.freeze({
    zoneDemandMw: 7_000,
    zoneDomesticMw: 6_100,
    importCapacityMw: 650,
    hydroLossMw: 700,
    waterCoolingLossMw: 650,
    flexibilityMw: 450,
    localDemandMw: 2_400,
    localDomesticMw: 2_000,
    localHydroLossMw: 250,
    localWaterCoolingLossMw: 400,
    localImportSharePct: 20,
    localFlexibilityMw: 100,
  }),
});

export const ADEQUACY_PUMP_SOURCES = Object.freeze([
  {
    label: 'ENTSO-E, Summer Outlook 2026 and methodology Q&A',
    url: 'https://www.entsoe.eu/outlooks/seasonal/',
    role: 'Scope of seasonal adequacy, climate scenarios, non-market resources and operational measures',
  },
  {
    label: 'ACER, Methodology for Short-term and Seasonal Adequacy Assessments',
    url: 'https://eepublicdownloads.entsoe.eu/clean-documents/sdc-documents/seasonal/Methodology%20for%20Short-term%20and%20Seasonal%20Adequacy%20Assessment%20-%20ACER%20Decision%2008-2020%20on%20the%20RPR8.pdf',
    role: 'Probabilistic adequacy framework, hourly resolution and zonal representation',
  },
  {
    label: 'ACER, RCC monitoring report for 2024',
    url: 'https://www.acer.europa.eu/sites/default/files/documents/Publications/ACER-2025-RCC-monitoring-report-for-2024.pdf',
    role: 'Implementation status and priorities for the short-term adequacy tool',
  },
  {
    label: 'European Commission, Electricity Coordination Group, 19 August 2026',
    url: 'https://energy.ec.europa.eu/news/electricity-coordination-group-discusses-extreme-weather-impacts-electricity-security-supply-central-2026-08-19_en',
    role: 'Observed system outcome during the Danube drought',
  },
]);

const finite = (value: unknown, fallback: number) => {
  const number = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(number) ? number : fallback;
};

const clamp = (value: unknown, minimum: number, maximum: number, fallback: number) => (
  Math.min(Math.max(finite(value, fallback), minimum), maximum)
);

export function normalizeAdequacyPumpInputs(
  candidate: Partial<AdequacyPumpInputs> = {},
): AdequacyPumpInputs {
  return {
    zoneDemandMw: clamp(candidate.zoneDemandMw, 0, 200_000, ADEQUACY_PUMP_DEFAULTS.zoneDemandMw),
    zoneDomesticMw: clamp(candidate.zoneDomesticMw, 0, 200_000, ADEQUACY_PUMP_DEFAULTS.zoneDomesticMw),
    importCapacityMw: clamp(candidate.importCapacityMw, 0, 100_000, ADEQUACY_PUMP_DEFAULTS.importCapacityMw),
    hydroLossMw: clamp(candidate.hydroLossMw, 0, 100_000, ADEQUACY_PUMP_DEFAULTS.hydroLossMw),
    waterCoolingLossMw: clamp(candidate.waterCoolingLossMw, 0, 100_000, ADEQUACY_PUMP_DEFAULTS.waterCoolingLossMw),
    flexibilityMw: clamp(candidate.flexibilityMw, 0, 100_000, ADEQUACY_PUMP_DEFAULTS.flexibilityMw),
    localDemandMw: clamp(candidate.localDemandMw, 0, 100_000, ADEQUACY_PUMP_DEFAULTS.localDemandMw),
    localDomesticMw: clamp(candidate.localDomesticMw, 0, 100_000, ADEQUACY_PUMP_DEFAULTS.localDomesticMw),
    localHydroLossMw: clamp(candidate.localHydroLossMw, 0, 100_000, ADEQUACY_PUMP_DEFAULTS.localHydroLossMw),
    localWaterCoolingLossMw: clamp(candidate.localWaterCoolingLossMw, 0, 100_000, ADEQUACY_PUMP_DEFAULTS.localWaterCoolingLossMw),
    localImportSharePct: clamp(candidate.localImportSharePct, 0, 100, ADEQUACY_PUMP_DEFAULTS.localImportSharePct),
    localFlexibilityMw: clamp(candidate.localFlexibilityMw, 0, 100_000, ADEQUACY_PUMP_DEFAULTS.localFlexibilityMw),
  };
}

export function evaluateAdequacyPump(
  candidate: Partial<AdequacyPumpInputs> = {},
): AdequacyPumpResult {
  const inputs = normalizeAdequacyPumpInputs(candidate);
  const totalWaterLossMw = inputs.hydroLossMw + inputs.waterCoolingLossMw;
  const baselineMarginMw = inputs.zoneDomesticMw + inputs.importCapacityMw - inputs.zoneDemandMw;
  const postWaterMarginMw = inputs.zoneDomesticMw
    - totalWaterLossMw
    + inputs.importCapacityMw
    - inputs.zoneDemandMw;
  const finalZoneMarginMw = postWaterMarginMw + inputs.flexibilityMw;

  const localAccessibleImportsMw = inputs.importCapacityMw * inputs.localImportSharePct / 100;
  const finalLocalMarginMw = inputs.localDomesticMw
    - inputs.localHydroLossMw
    - inputs.localWaterCoolingLossMw
    + localAccessibleImportsMw
    + inputs.localFlexibilityMw
    - inputs.localDemandMw;

  const zoneVerdict: ZoneVerdict = finalZoneMarginMw < 0
    ? 'deficit'
    : postWaterMarginMw < 0
      ? 'positive-after-measures'
      : 'positive-before-measures';
  const localVerdict: LocalVerdict = finalLocalMarginMw < 0 ? 'deficit' : 'positive';

  let dualVerdict: DualVerdict;
  if (zoneVerdict === 'deficit') dualVerdict = 'zone-deficit';
  else if (zoneVerdict === 'positive-after-measures' && localVerdict === 'deficit') dualVerdict = 'measures-local-deficit';
  else if (localVerdict === 'deficit') dualVerdict = 'local-deficit';
  else if (zoneVerdict === 'positive-after-measures') dualVerdict = 'measures';
  else dualVerdict = 'positive';

  return {
    inputs,
    baselineMarginMw,
    postWaterMarginMw,
    finalZoneMarginMw,
    localAccessibleImportsMw,
    finalLocalMarginMw,
    totalWaterLossMw,
    zoneVerdict,
    localVerdict,
    dualVerdict,
  };
}
