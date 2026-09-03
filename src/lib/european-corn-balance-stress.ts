// EU corn, 2026/27, August 2026 WASDE, million metric tonnes.
// https://esmis.nal.usda.gov/sites/default/release-files/796014/wasde0826.txt
export const CORN_BALANCE = Object.freeze({
  openingStocks: 5.95,
  production: 50.2,
  imports: 23.5,
  domesticUse: 73,
  exports: 1.6,
  endingStocks: 5.05,
});

export interface CornStressInput {
  extraHarvestLoss: number;
  importDeliveryShortfall: number;
  feedDemandReduction: number;
  stockDraw: number;
}

export const DEFAULT_CORN_STRESS_INPUT: Readonly<CornStressInput> = Object.freeze({
  extraHarvestLoss: 0,
  importDeliveryShortfall: 0,
  feedDemandReduction: 0,
  stockDraw: 0,
});

export type CornStressResult = { valid: false; errors: string[] } | {
  valid: true;
  production: number;
  availableImports: number;
  domesticUse: number;
  endingStocks: number;
  unresolvedGap: number;
  excessOffsets: number;
};

export function validateCornStress(input: CornStressInput): string[] {
  const errors: string[] = [];
  for (const [key, max] of Object.entries({
    extraHarvestLoss: 15,
    importDeliveryShortfall: 15,
    feedDemandReduction: 15,
    stockDraw: CORN_BALANCE.endingStocks,
  })) {
    const value = input[key as keyof CornStressInput];
    if (!Number.isFinite(value) || value < 0 || value > max) errors.push(`${key}-invalid`);
  }
  return errors;
}

/** Incremental accounting stress, not a calibrated forecast of demand or prices. */
export function assessCornStress(input: CornStressInput): CornStressResult {
  const errors = validateCornStress(input);
  if (errors.length) return { valid: false, errors };
  const gap = input.extraHarvestLoss + input.importDeliveryShortfall
    - input.feedDemandReduction - input.stockDraw;
  return {
    valid: true,
    production: CORN_BALANCE.production - input.extraHarvestLoss,
    availableImports: CORN_BALANCE.imports - input.importDeliveryShortfall,
    domesticUse: CORN_BALANCE.domesticUse - input.feedDemandReduction,
    endingStocks: CORN_BALANCE.endingStocks - input.stockDraw,
    unresolvedGap: Math.max(0, gap),
    excessOffsets: Math.max(0, -gap),
  };
}
