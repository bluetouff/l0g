export const KOREA_FX_HEDGE_MODEL_VERSION = '1.0.0';

export interface KoreaFxHedgeInputs {
  foreignAssetsKrwTrn: number;
  grossAssetYieldPct: number;
  foreignShortRatePct: number;
  krwShortRatePct: number;
  basisBp: number;
  executionBp: number;
  hedgeRatioPct: number;
  assetMaturityYears: number;
  hedgeTenorMonths: number;
  foreignCurrencyMovePct: number;
}

export interface KoreaFxHedgeResults {
  coveredNotionalKrwTrn: number;
  openNotionalKrwTrn: number;
  indicativeHedgeCarryPct: number;
  annualHedgeCarryKrwTrn: number;
  indicativeNetYieldPct: number;
  openFxTranslationKrwTrn: number;
  rollsOverAssetLife: number;
  repricingCostFor100bpKrwTrn: number;
}

export const KOREA_FX_HEDGE_DEFAULTS: KoreaFxHedgeInputs = {
  foreignAssetsKrwTrn: 100,
  grossAssetYieldPct: 4.5,
  foreignShortRatePct: 4.0,
  krwShortRatePct: 2.5,
  basisBp: 20,
  executionBp: 10,
  hedgeRatioPct: 100,
  assetMaturityYears: 10,
  hedgeTenorMonths: 12,
  foreignCurrencyMovePct: 0,
};

const finite = (value: number, fallback: number): number => Number.isFinite(value) ? value : fallback;
const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));

export function normalizeKoreaFxHedgeInputs(input: Partial<KoreaFxHedgeInputs>): KoreaFxHedgeInputs {
  const d = KOREA_FX_HEDGE_DEFAULTS;
  return {
    foreignAssetsKrwTrn: clamp(finite(Number(input.foreignAssetsKrwTrn), d.foreignAssetsKrwTrn), 0, 1000),
    grossAssetYieldPct: clamp(finite(Number(input.grossAssetYieldPct), d.grossAssetYieldPct), -10, 30),
    foreignShortRatePct: clamp(finite(Number(input.foreignShortRatePct), d.foreignShortRatePct), -5, 30),
    krwShortRatePct: clamp(finite(Number(input.krwShortRatePct), d.krwShortRatePct), -5, 30),
    basisBp: clamp(finite(Number(input.basisBp), d.basisBp), -500, 500),
    executionBp: clamp(finite(Number(input.executionBp), d.executionBp), 0, 500),
    hedgeRatioPct: clamp(finite(Number(input.hedgeRatioPct), d.hedgeRatioPct), 0, 100),
    assetMaturityYears: clamp(finite(Number(input.assetMaturityYears), d.assetMaturityYears), 0.25, 50),
    hedgeTenorMonths: clamp(finite(Number(input.hedgeTenorMonths), d.hedgeTenorMonths), 1, 120),
    foreignCurrencyMovePct: clamp(finite(Number(input.foreignCurrencyMovePct), d.foreignCurrencyMovePct), -50, 50),
  };
}

export function calculateKoreaFxHedge(input: Partial<KoreaFxHedgeInputs>): KoreaFxHedgeResults {
  const x = normalizeKoreaFxHedgeInputs(input);
  const hedgeRatio = x.hedgeRatioPct / 100;
  const coveredNotionalKrwTrn = x.foreignAssetsKrwTrn * hedgeRatio;
  const openNotionalKrwTrn = x.foreignAssetsKrwTrn - coveredNotionalKrwTrn;

  // This is an educational carry decomposition, not a dealer quote.
  // A KRW investor selling foreign currency forward generally gives up the
  // foreign-minus-KRW short-rate differential. The user enters the basis with
  // convention that a positive value increases cost and a negative one lowers it.
  const indicativeHedgeCarryPct =
    x.foreignShortRatePct - x.krwShortRatePct + x.basisBp / 100 + x.executionBp / 100;
  const annualHedgeCarryKrwTrn = coveredNotionalKrwTrn * indicativeHedgeCarryPct / 100;
  const indicativeNetYieldPct = x.grossAssetYieldPct - hedgeRatio * indicativeHedgeCarryPct;
  const openFxTranslationKrwTrn = openNotionalKrwTrn * x.foreignCurrencyMovePct / 100;
  const rollsOverAssetLife = Math.max(1, Math.ceil(x.assetMaturityYears * 12 / x.hedgeTenorMonths));
  const repricingCostFor100bpKrwTrn = coveredNotionalKrwTrn * 0.01;

  return {
    coveredNotionalKrwTrn,
    openNotionalKrwTrn,
    indicativeHedgeCarryPct,
    annualHedgeCarryKrwTrn,
    indicativeNetYieldPct,
    openFxTranslationKrwTrn,
    rollsOverAssetLife,
    repricingCostFor100bpKrwTrn,
  };
}
