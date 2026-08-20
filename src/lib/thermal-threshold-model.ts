export const THERMAL_THRESHOLD_MODEL_VERSION = '1.0.0';
export const THERMAL_THRESHOLD_DATA_DATE = '2026-08-20';

export const THERMAL_SITES = ['bugey', 'tricastin', 'golfech', 'nogent', 'saintalban'] as const;
export type ThermalSite = typeof THERMAL_SITES[number];

export interface ThermalThresholdInputs {
  site: ThermalSite;
  date: string;
  canalFlowM3s: number;
  rteRequired: boolean;
  temporaryBugeyDecision: boolean;
}

export type ThermalRegime = 'normal' | 'cce' | 'exceptional';
export type ThermalQualifier = 'summer' | 'winter' | 'allYear' | 'lowFlow' | 'highFlow' | 'projected';
export type ThermalContextStatus = 'hidden' | 'outside' | 'needsRte' | 'available';

export interface ThermalThresholdResult {
  inputs: ThermalThresholdInputs;
  regime: ThermalRegime;
  downstream: string;
  delta: string;
  qualifier: ThermalQualifier;
  scope: 'all' | 'bugey45';
  basis: string;
  showFlow: boolean;
  showTemporary: boolean;
  temporaryAvailable: boolean;
  contextStatus: ThermalContextStatus;
}

export const THERMAL_THRESHOLD_DEFAULTS: Readonly<ThermalThresholdInputs> = Object.freeze({
  site: 'bugey',
  date: '2026-07-15',
  canalFlowM3s: 500,
  rteRequired: false,
  temporaryBugeyDecision: false,
});

export const THERMAL_THRESHOLD_SOURCES = Object.freeze([
  {
    label: 'EDF Open Data, thermal-discharge thresholds and limits',
    url: 'https://opendata.edf.fr/datasets/seuils-et-limites-des-rejets-thermiques-aux-abords-des-centrales-nucleaires-d-edf-sa',
    role: 'Normal and permanent exceptional-climatic-condition rules for the five selected sites',
  },
  {
    label: 'ASNR, thermal discharges during summer periods, July 2025',
    url: 'https://www.asnr.fr/sites/asnr/files/2025-07/rejets-thermique-des-centrales-nucleaires-pendant-les-periodes-estivales.pdf',
    role: 'Regulatory tiers, cooling-system context and limits of interpretation',
  },
  {
    label: 'ASNR decision 2026-DC-052, 10 July 2026',
    url: 'https://reglementation-controle.asnr.fr/content/download/210156/file/2026-DC-052.pdf',
    role: 'Temporary Bugey rule, eligible dates, RTE condition, scope and projected downstream temperature',
  },
]);

const validSite = (value: unknown): ThermalSite => (
  typeof value === 'string' && (THERMAL_SITES as readonly string[]).includes(value)
    ? value as ThermalSite
    : THERMAL_THRESHOLD_DEFAULTS.site
);

const validDate = (value: unknown) => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return THERMAL_THRESHOLD_DEFAULTS.date;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value
    ? THERMAL_THRESHOLD_DEFAULTS.date
    : value;
};

const clampFlow = (value: unknown) => {
  const numeric = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(numeric) ? Math.min(Math.max(numeric, 0), 5_000) : THERMAL_THRESHOLD_DEFAULTS.canalFlowM3s;
};

export function normalizeThermalThresholdInputs(candidate: Partial<ThermalThresholdInputs> = {}): ThermalThresholdInputs {
  return {
    site: validSite(candidate.site),
    date: validDate(candidate.date),
    canalFlowM3s: clampFlow(candidate.canalFlowM3s),
    rteRequired: candidate.rteRequired === true,
    temporaryBugeyDecision: candidate.temporaryBugeyDecision === true,
  };
}

const monthDay = (date: string) => Number(date.slice(5, 7)) * 100 + Number(date.slice(8, 10));
const within = (date: string, start: number, end: number) => {
  const value = monthDay(date);
  return start <= end ? value >= start && value <= end : value >= start || value <= end;
};

const normalRule = (inputs: ThermalThresholdInputs) => {
  switch (inputs.site) {
    case 'bugey': {
      const summer = within(inputs.date, 501, 915);
      return {
        downstream: summer ? '≤ 26 °C' : '≤ 24 °C',
        delta: summer ? '≤ 5 °C' : '≤ 7 °C',
        qualifier: summer ? 'summer' : 'winter',
        basis: 'EDF Open Data, amended 2014 Bugey decision',
      } as const;
    }
    case 'tricastin': {
      const lowFlow = inputs.canalFlowM3s < 480;
      return {
        downstream: '≤ 28 °C',
        delta: lowFlow ? '≤ 6 °C' : '≤ 4 °C',
        qualifier: lowFlow ? 'lowFlow' : 'highFlow',
        basis: 'EDF Open Data, amended 2008 Tricastin decision',
      } as const;
    }
    case 'golfech': {
      const summer = within(inputs.date, 601, 930);
      return {
        downstream: '< 28 °C',
        delta: summer ? '< 1.25 °C' : '< 2 °C',
        qualifier: summer ? 'summer' : 'winter',
        basis: 'EDF Open Data, decree of 18 September 2006',
      } as const;
    }
    case 'nogent':
      return {
        downstream: '< 28 °C', delta: '< 3 °C', qualifier: 'allYear',
        basis: 'EDF Open Data, decree of 29 December 2004',
      } as const;
    case 'saintalban': {
      const summer = within(inputs.date, 516, 930);
      return {
        downstream: summer ? '≤ 28 °C' : '≤ 26 °C',
        delta: summer ? '≤ 3 °C' : '≤ 4 °C',
        qualifier: summer ? 'summer' : 'winter',
        basis: 'EDF Open Data, 2014 Saint-Alban decision',
      } as const;
    }
  }
};

const cceRules = {
  bugey: { downstream: '≤ 27 °C', delta: '≤ 1 °C', basis: 'Permanent second tier, ASNR July 2025 note' },
  tricastin: { downstream: '≤ 29 °C', delta: '≤ 3 °C', basis: 'Permanent second tier, ASNR July 2025 note' },
  golfech: { downstream: '≤ 30 °C', delta: '≤ 1.25 °C', basis: 'Permanent second tier, EDF Open Data' },
  nogent: { downstream: '< 30 °C', delta: '< 1.5 °C', basis: 'Permanent second tier, EDF Open Data and EDF 25 June 2026' },
  saintalban: { downstream: '≤ 29 °C', delta: 'Not specified', basis: 'Permanent second tier, EDF Open Data' },
} as const;

const isTemporaryBugeyDate = (date: string) => date >= '2026-07-12' && date <= '2026-07-20';

export function evaluateThermalThreshold(candidate: Partial<ThermalThresholdInputs> = {}): ThermalThresholdResult {
  const inputs = normalizeThermalThresholdInputs(candidate);
  const showTemporary = inputs.site === 'bugey';
  const temporaryAvailable = showTemporary && isTemporaryBugeyDate(inputs.date);
  let contextStatus: ThermalContextStatus = 'hidden';
  if (showTemporary) {
    contextStatus = temporaryAvailable
      ? inputs.temporaryBugeyDecision && !inputs.rteRequired ? 'needsRte' : 'available'
      : 'outside';
  }

  if (temporaryAvailable && inputs.temporaryBugeyDecision && inputs.rteRequired) {
    return {
      inputs, regime: 'exceptional', downstream: 'Projected ≤ 28 °C', delta: '≤ 1 °C',
      qualifier: 'projected', scope: 'bugey45', basis: 'ASNR 2026-DC-052, 12 to 20 July 2026',
      showFlow: false, showTemporary, temporaryAvailable, contextStatus,
    };
  }

  if (inputs.rteRequired) {
    const rule = cceRules[inputs.site];
    return {
      inputs, regime: 'cce', downstream: rule.downstream, delta: rule.delta,
      qualifier: 'allYear', scope: inputs.site === 'bugey' ? 'bugey45' : 'all', basis: rule.basis,
      showFlow: inputs.site === 'tricastin', showTemporary, temporaryAvailable, contextStatus,
    };
  }

  const rule = normalRule(inputs);
  return {
    inputs, regime: 'normal', ...rule, scope: 'all',
    showFlow: inputs.site === 'tricastin', showTemporary, temporaryAvailable, contextStatus,
  };
}
