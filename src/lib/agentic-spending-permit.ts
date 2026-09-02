export type ExecutionMode = 'recommend' | 'prepare' | 'approve' | 'autonomous' | 'continuous';
export type MerchantPolicy = 'whitelist' | 'known' | 'any';
export type ConfirmationPolicy = 'every' | 'threshold' | 'none';
export type SubstitutionPolicy = 'never' | 'equivalent' | 'cheaper';
export type ProductCondition = 'new' | 'any';
export type RankingPriority = 'total-price' | 'delivery' | 'returns';
export type DataPermission = 'address' | 'purchase-history' | 'loyalty' | 'calendar';

export interface SpendingPermitInput {
  executionMode: ExecutionMode;
  totalBudget: number;
  perPurchaseCap: number;
  durationDays: number;
  confirmationPolicy: ConfirmationPolicy;
  confirmationThreshold: number;
  merchantPolicy: MerchantPolicy;
  subscriptionsAllowed: boolean;
  recurringAllowed: boolean;
  substitutionPolicy: SubstitutionPolicy;
  productCondition: ProductCondition;
  rankingPriority: RankingPriority;
  budgetIncludesFees: boolean;
  returnRequired: boolean;
  dataPermissions: DataPermission[];
}

export type PermitFlag =
  | 'budget-invalid'
  | 'purchase-cap-invalid'
  | 'duration-invalid'
  | 'threshold-invalid'
  | 'broad-merchant-access'
  | 'no-transaction-confirmation'
  | 'subscriptions-with-autonomy'
  | 'recurring-with-autonomy'
  | 'long-lived-mandate'
  | 'sensitive-context'
  | 'fees-outside-budget'
  | 'returns-not-required'
  | 'substitutions-allowed'
  | 'high-aggregate-capacity';

export type AmbiguityCode =
  | 'no-ranking-proof'
  | 'equivalence-undefined'
  | 'known-merchant-undefined'
  | 'delivery-address-missing'
  | 'after-sale-operator-undefined'
  | 'price-volatility-window';

export interface SpendingPermitAssessment {
  level: 0 | 1 | 2 | 3 | 4;
  valid: boolean;
  flags: PermitFlag[];
  ambiguities: AmbiguityCode[];
  requiredData: DataPermission[];
  maxAutomaticSpend: number;
  minAutomaticTransactionsToExhaustBudget: number;
}

const finite = (value: number): boolean => Number.isFinite(value);

export function validateSpendingPermit(input: SpendingPermitInput): PermitFlag[] {
  const flags: PermitFlag[] = [];
  if (!finite(input.totalBudget) || input.totalBudget <= 0 || input.totalBudget > 1_000_000) {
    flags.push('budget-invalid');
  }
  if (!finite(input.perPurchaseCap) || input.perPurchaseCap <= 0 || input.perPurchaseCap > input.totalBudget) {
    flags.push('purchase-cap-invalid');
  }
  if (!Number.isInteger(input.durationDays) || input.durationDays < 1 || input.durationDays > 365) {
    flags.push('duration-invalid');
  }
  if (
    input.confirmationPolicy === 'threshold' &&
    (!finite(input.confirmationThreshold) || input.confirmationThreshold <= 0 || input.confirmationThreshold > input.perPurchaseCap)
  ) {
    flags.push('threshold-invalid');
  }
  return flags;
}

export function assessSpendingPermit(input: SpendingPermitInput): SpendingPermitAssessment {
  const flags = validateSpendingPermit(input);
  const inputsValid = flags.length === 0;
  const ambiguities: AmbiguityCode[] = ['no-ranking-proof', 'after-sale-operator-undefined', 'price-volatility-window'];

  const levelMap: Record<ExecutionMode, 0 | 1 | 2 | 3 | 4> = {
    recommend: 0,
    prepare: 1,
    approve: 2,
    autonomous: 3,
    continuous: 4,
  };
  const level = levelMap[input.executionMode];

  if (input.merchantPolicy === 'any') flags.push('broad-merchant-access');
  if (input.merchantPolicy === 'known') ambiguities.push('known-merchant-undefined');
  if (input.confirmationPolicy === 'none' && level >= 3) flags.push('no-transaction-confirmation');
  if (input.subscriptionsAllowed && level >= 3) flags.push('subscriptions-with-autonomy');
  if (input.recurringAllowed && level >= 3) flags.push('recurring-with-autonomy');
  if (input.durationDays > 30 && level >= 3) flags.push('long-lived-mandate');
  if (!input.budgetIncludesFees) flags.push('fees-outside-budget');
  if (!input.returnRequired) flags.push('returns-not-required');
  if (input.substitutionPolicy !== 'never') {
    flags.push('substitutions-allowed');
    ambiguities.push('equivalence-undefined');
  }
  if (input.dataPermissions.includes('purchase-history') || input.dataPermissions.includes('calendar')) {
    flags.push('sensitive-context');
  }

  const requiredData = [...input.dataPermissions];
  if (!requiredData.includes('address') && level >= 2) ambiguities.push('delivery-address-missing');

  let automaticCap = 0;
  if (inputsValid && level >= 3) {
    if (input.confirmationPolicy === 'every') automaticCap = 0;
    if (input.confirmationPolicy === 'threshold') automaticCap = Math.min(input.perPurchaseCap, input.confirmationThreshold);
    if (input.confirmationPolicy === 'none') automaticCap = input.perPurchaseCap;
  }

  const maxAutomaticSpend = automaticCap > 0 ? input.totalBudget : 0;
  const minAutomaticTransactionsToExhaustBudget = automaticCap > 0
    ? Math.ceil(input.totalBudget / automaticCap)
    : 0;
  if (minAutomaticTransactionsToExhaustBudget >= 10 || (inputsValid && level === 4 && input.totalBudget >= input.perPurchaseCap * 5)) {
    flags.push('high-aggregate-capacity');
  }

  return {
    level,
    valid: flags.every((flag) => !flag.endsWith('-invalid')),
    flags: [...new Set(flags)],
    ambiguities: [...new Set(ambiguities)],
    requiredData: [...new Set(requiredData)],
    maxAutomaticSpend,
    minAutomaticTransactionsToExhaustBudget,
  };
}
