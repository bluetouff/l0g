export const microsoftWeekFields = Object.freeze([
  { key: 'revenue', initial: 1_000_000, max: 1e12 },
  { key: 'exposure', initial: 50, max: 100 },
  { key: 'fallback', initial: 40, max: 100 },
  { key: 'recovery', initial: 75, max: 100 },
  { key: 'margin', initial: 35, max: 100 },
  { key: 'extra', initial: 40_000, max: 1e12 },
]);

export const microsoftWeekRecoveryRates = Object.freeze([25, 75, 90]);

/** Monetary inputs are euros. Each rate is a percentage from 0 to 100. */
export function calculateMicrosoftWeek(input) {
  if (!input || !microsoftWeekFields.every(({ key, max }) => {
    const value = input[key];
    return Number.isFinite(value) && value >= 0 && value <= max;
  })) return null;

  const { revenue, exposure, fallback, recovery, margin, extra } = input;
  const exposed = revenue * (exposure / 100);
  const served = exposed * (fallback / 100);
  const backlog = exposed - served;
  const recovered = backlog * (recovery / 100);
  const lost = backlog - recovered;
  const contribution = lost * (margin / 100);

  return {
    revenue,
    exposed,
    served,
    backlog,
    recovered,
    lost,
    contribution,
    extra,
    total: contribution + extra,
  };
}
