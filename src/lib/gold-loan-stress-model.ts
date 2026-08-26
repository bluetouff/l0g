export interface GoldLoanStressInputs {
  collateralLakh: number;
  principalLakh: number;
  annualInterestPct: number;
  months: number;
  goldShockPct: number;
  capPct: number;
}

export type GoldLoanStressStatus = 'within-cap' | 'cap-breach' | 'underwater';

export interface GoldLoanStressResult {
  collateralLakh: number;
  principalLakh: number;
  maturityDebtLakh: number;
  shockedCollateralLakh: number;
  currentPrincipalLtvPct: number;
  maturityLtvPct: number;
  postShockMaturityLtvPct: number;
  maxCompliantPrincipalLakh: number;
  headroomAtOriginationLakh: number;
  repaymentToRestoreCapLakh: number;
  breakEvenGoldDeclinePct: number;
  status: GoldLoanStressStatus;
}

export const GOLD_LOAN_STRESS_MODEL_VERSION = '1.0.0';
export const GOLD_LOAN_STRESS_DATA_DATE = '2026-08-26';

export const GOLD_LOAN_STRESS_DEFAULTS: GoldLoanStressInputs = {
  collateralLakh: 10,
  principalLakh: 6,
  annualInterestPct: 18,
  months: 12,
  goldShockPct: -20,
  capPct: 80,
};

const finiteOr = (value: number, fallback: number): number =>
  Number.isFinite(value) ? value : fallback;

const clamp = (value: number, minimum: number, maximum: number): number =>
  Math.min(maximum, Math.max(minimum, value));

export const evaluateGoldLoanStress = (
  raw: GoldLoanStressInputs,
): GoldLoanStressResult => {
  const collateralLakh = clamp(
    finiteOr(raw.collateralLakh, GOLD_LOAN_STRESS_DEFAULTS.collateralLakh),
    0.01,
    100000,
  );
  const principalLakh = clamp(
    finiteOr(raw.principalLakh, GOLD_LOAN_STRESS_DEFAULTS.principalLakh),
    0,
    100000,
  );
  const annualInterestPct = clamp(
    finiteOr(raw.annualInterestPct, GOLD_LOAN_STRESS_DEFAULTS.annualInterestPct),
    0,
    100,
  );
  const months = clamp(
    finiteOr(raw.months, GOLD_LOAN_STRESS_DEFAULTS.months),
    1,
    120,
  );
  const goldShockPct = clamp(
    finiteOr(raw.goldShockPct, GOLD_LOAN_STRESS_DEFAULTS.goldShockPct),
    -95,
    300,
  );
  const capPct = clamp(
    finiteOr(raw.capPct, GOLD_LOAN_STRESS_DEFAULTS.capPct),
    1,
    100,
  );

  const interestFactor = 1 + (annualInterestPct / 100) * (months / 12);
  const maturityDebtLakh = principalLakh * interestFactor;
  const shockedCollateralLakh = Math.max(
    collateralLakh * (1 + goldShockPct / 100),
    0.000001,
  );

  const currentPrincipalLtvPct = (principalLakh / collateralLakh) * 100;
  const maturityLtvPct = (maturityDebtLakh / collateralLakh) * 100;
  const postShockMaturityLtvPct =
    (maturityDebtLakh / shockedCollateralLakh) * 100;

  // RBI's cap for bullet loans applies to the total amount payable at maturity.
  // This is therefore the maximum principal that would remain under the chosen
  // cap if interest accrues on a simple-interest basis and gold is unchanged.
  const maxCompliantPrincipalLakh =
    (collateralLakh * (capPct / 100)) / interestFactor;
  const headroomAtOriginationLakh = Math.max(
    0,
    maxCompliantPrincipalLakh - principalLakh,
  );
  const repaymentToRestoreCapLakh = Math.max(
    0,
    maturityDebtLakh - shockedCollateralLakh * (capPct / 100),
  );
  const breakEvenGoldDeclinePct = Math.max(
    0,
    (1 - maturityDebtLakh / collateralLakh) * 100,
  );

  let status: GoldLoanStressStatus = 'within-cap';
  if (postShockMaturityLtvPct > 100) status = 'underwater';
  else if (postShockMaturityLtvPct > capPct) status = 'cap-breach';

  return {
    collateralLakh,
    principalLakh,
    maturityDebtLakh,
    shockedCollateralLakh,
    currentPrincipalLtvPct,
    maturityLtvPct,
    postShockMaturityLtvPct,
    maxCompliantPrincipalLakh,
    headroomAtOriginationLakh,
    repaymentToRestoreCapLakh,
    breakEvenGoldDeclinePct,
    status,
  };
};
