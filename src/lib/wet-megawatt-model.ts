export const WET_MEGAWATT_MODEL_VERSION = '1.0.0';
export const WET_MEGAWATT_DATA_DATE = '2026-08-20';
export const WET_MEGAWATT_DATA_VINTAGE = 2023;

export const WET_MEGAWATT_OBSERVED = Object.freeze({
  hydroGW: 199.9,
  nuclearGW: 94.4,
  classicThermalGW: 319.6,
  totalCapacityGW: 1_040.2,
});

export interface WetMegawattInputs {
  thermalWaterCooledSharePct: number;
}

export interface WetMegawattResults {
  knownFloorGW: number;
  classifiedThermalGW: number;
  unclassifiedThermalGW: number;
  waterCoupledCapacityGW: number;
  waterCoupledSharePct: number;
  increaseOverFloorGW: number;
  addedPerPercentagePointGW: number;
}

export const WET_MEGAWATT_DEFAULTS: Readonly<WetMegawattInputs> = Object.freeze({
  thermalWaterCooledSharePct: 50,
});

export const WET_MEGAWATT_LIMITS = Object.freeze({
  thermalWaterCooledSharePct: { min: 0, max: 100 },
});

export const WET_MEGAWATT_PRESETS = Object.freeze([0, 25, 50, 75, 100]);

const clamp = (value: unknown, fallback: number, min: number, max: number) => {
  const numeric = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(numeric) ? Math.min(Math.max(numeric, min), max) : fallback;
};

export function normalizeWetMegawattInputs(
  candidate: Partial<WetMegawattInputs> = {},
): WetMegawattInputs {
  return {
    thermalWaterCooledSharePct: clamp(
      candidate.thermalWaterCooledSharePct,
      WET_MEGAWATT_DEFAULTS.thermalWaterCooledSharePct,
      WET_MEGAWATT_LIMITS.thermalWaterCooledSharePct.min,
      WET_MEGAWATT_LIMITS.thermalWaterCooledSharePct.max,
    ),
  };
}

export function calculateWetMegawatt(
  candidate: Partial<WetMegawattInputs> = {},
): WetMegawattResults {
  const inputs = normalizeWetMegawattInputs(candidate);
  const knownFloorGW = WET_MEGAWATT_OBSERVED.hydroGW + WET_MEGAWATT_OBSERVED.nuclearGW;
  const classifiedThermalGW = WET_MEGAWATT_OBSERVED.classicThermalGW
    * inputs.thermalWaterCooledSharePct / 100;
  const waterCoupledCapacityGW = knownFloorGW + classifiedThermalGW;

  return {
    knownFloorGW,
    classifiedThermalGW,
    unclassifiedThermalGW: WET_MEGAWATT_OBSERVED.classicThermalGW - classifiedThermalGW,
    waterCoupledCapacityGW,
    waterCoupledSharePct: waterCoupledCapacityGW / WET_MEGAWATT_OBSERVED.totalCapacityGW * 100,
    increaseOverFloorGW: classifiedThermalGW,
    addedPerPercentagePointGW: WET_MEGAWATT_OBSERVED.classicThermalGW / 100,
  };
}

export const WET_MEGAWATT_FORMULAS = Object.freeze({
  knownFloor: 'Known floor (GW) = hydropower capacity (GW) + nuclear capacity (GW)',
  classifiedThermal: 'Classified thermal (GW) = classic thermal capacity (GW) × assumed water-cooled share (%) ÷ 100',
  waterCoupled: 'Water-coupled capacity (GW) = known floor (GW) + classified thermal (GW)',
  shareOfTotal: 'Share of total (%) = water-coupled capacity (GW) ÷ total installed capacity (GW) × 100',
});

export const WET_MEGAWATT_SOURCES = Object.freeze([
  {
    label: 'Red Eléctrica, European installed-capacity panorama for 2023',
    url: 'https://www.sistemaelectrico-ree.es/en/2023/spanish-electricity-system/european-landscape/generation',
    role: 'Observed ENTSO-E member-state capacities used in every calculation',
  },
  {
    label: 'European Environment Agency, Water savings for a water-resilient Europe',
    url: 'https://www.eea.europa.eu/en/analysis/publications/water-savings-for-a-water-resilient-europe',
    role: 'Context on electricity cooling, water abstraction and data limitations',
  },
  {
    label: 'JRC Open Power Plants Database',
    url: 'https://data.jrc.ec.europa.eu/dataset/9810feeb-f062-49cd-8e76-8d8cfd488a05',
    role: 'Evidence that cooling and water fields can exist at unit level, with incomplete and irregularly updated coverage',
  },
]);
