/** Types for the dependency-free ESM model. Percent inputs, not decimal fractions. */
export interface ModelInputs {
  debt: number; growth: number; primaryDeficit: number; effectiveRate: number;
  marketRate: number; repricing: number; shock: number; maturity: number; coupon: number;
}
export interface ProjectionRow {
  readonly year: number; readonly openingDebt: number; readonly debt: number;
  readonly effectiveRate: number; readonly interest: number; readonly deficit: number;
}
export interface ModelResult {
  readonly values: Readonly<ModelInputs>;
  readonly reference: readonly ProjectionRow[];
  readonly stressed: readonly ProjectionRow[];
  readonly shockedMarketRate: number;
  readonly priceBefore: number; readonly priceAfter: number; readonly priceChangePct: number;
  readonly debtGap: number; readonly interestGap: number; readonly stabilisingDeficit: number;
}
export const MODEL_VERSION: string;
export const AS_OF: string;
export const HORIZON: number;
export const FIRST_YEAR: number;
export const DEFAULTS: Readonly<ModelInputs>;
export const LIMITS: Readonly<Record<keyof ModelInputs, readonly [number, number]>>;
export function parseNumber(value: unknown): number;
export function validateInputs(input: unknown): Readonly<ModelInputs>;
export function bondPrice(couponPct: number, yieldPct: number, years: number): number;
export function evaluate(input?: unknown): Readonly<ModelResult>;
