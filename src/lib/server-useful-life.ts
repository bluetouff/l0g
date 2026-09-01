export type UsefulLifeInput = {
  cost: number;
  residualValue?: number;
  originalLifeYears: number;
  revisedLifeYears: number;
  elapsedYears: number;
};

export type UsefulLifeRow = {
  year: number;
  originalExpense: number;
  revisedExpense: number;
  originalClosingBookValue: number;
  revisedClosingBookValue: number;
  pretaxProfitDifference: number;
};

export type UsefulLifeResult = {
  cost: number;
  residualValue: number;
  depreciableAmount: number;
  originalAnnualExpense: number;
  carryingAmountAtChange: number;
  revisedRemainingYears: number;
  revisedAnnualExpense: number;
  firstFullYearPretaxProfitDifference: number;
  expenseMovedBeyondOriginalLife: number;
  rows: UsefulLifeRow[];
};

const EPSILON = 1e-7;

function finite(value: number, label: string): number {
  if (!Number.isFinite(value)) throw new TypeError(`${label} must be finite`);
  return value;
}

function whole(value: number, label: string): number {
  finite(value, label);
  if (!Number.isInteger(value)) throw new RangeError(`${label} must be an integer`);
  return value;
}

export function calculateUsefulLifeScenario(input: UsefulLifeInput): UsefulLifeResult {
  const cost = finite(input.cost, 'cost');
  const residualValue = finite(input.residualValue ?? 0, 'residualValue');
  const originalLifeYears = whole(input.originalLifeYears, 'originalLifeYears');
  const revisedLifeYears = whole(input.revisedLifeYears, 'revisedLifeYears');
  const elapsedYears = whole(input.elapsedYears, 'elapsedYears');

  if (cost <= 0) throw new RangeError('cost must be greater than zero');
  if (residualValue < 0 || residualValue >= cost) {
    throw new RangeError('residualValue must be at least zero and lower than cost');
  }
  if (originalLifeYears < 1 || revisedLifeYears < 1) {
    throw new RangeError('useful lives must be at least one year');
  }
  if (elapsedYears < 0 || elapsedYears >= originalLifeYears) {
    throw new RangeError('elapsedYears must be between zero and originalLifeYears - 1');
  }
  if (elapsedYears >= revisedLifeYears) {
    throw new RangeError('revisedLifeYears must be greater than elapsedYears');
  }

  const depreciableAmount = cost - residualValue;
  const originalAnnualExpense = depreciableAmount / originalLifeYears;
  const accumulatedAtChange = Math.min(
    depreciableAmount,
    originalAnnualExpense * elapsedYears,
  );
  const carryingAmountAtChange = cost - accumulatedAtChange;
  const revisedRemainingYears = revisedLifeYears - elapsedYears;
  const revisedAnnualExpense = (carryingAmountAtChange - residualValue) / revisedRemainingYears;
  const horizon = Math.max(originalLifeYears, revisedLifeYears);

  let originalBook = cost;
  let revisedBook = cost;
  const rows: UsefulLifeRow[] = [];

  for (let year = 1; year <= horizon; year += 1) {
    const originalExpense = year <= originalLifeYears
      ? Math.min(originalAnnualExpense, originalBook - residualValue)
      : 0;

    let revisedExpense = 0;
    if (year <= elapsedYears) {
      revisedExpense = Math.min(originalAnnualExpense, revisedBook - residualValue);
    } else if (year <= revisedLifeYears) {
      revisedExpense = Math.min(revisedAnnualExpense, revisedBook - residualValue);
    }

    originalBook = Math.max(residualValue, originalBook - originalExpense);
    revisedBook = Math.max(residualValue, revisedBook - revisedExpense);

    rows.push({
      year,
      originalExpense,
      revisedExpense,
      originalClosingBookValue: originalBook,
      revisedClosingBookValue: revisedBook,
      pretaxProfitDifference: originalExpense - revisedExpense,
    });
  }

  const firstPostChange = rows.find((row) => row.year === elapsedYears + 1);
  const expenseMovedBeyondOriginalLife = rows
    .filter((row) => row.year > originalLifeYears)
    .reduce((sum, row) => sum + row.revisedExpense, 0);

  const originalTotal = rows.reduce((sum, row) => sum + row.originalExpense, 0);
  const revisedTotal = rows.reduce((sum, row) => sum + row.revisedExpense, 0);
  if (Math.abs(originalTotal - depreciableAmount) > EPSILON) {
    throw new Error('original schedule does not fully depreciate the asset');
  }
  if (Math.abs(revisedTotal - depreciableAmount) > EPSILON) {
    throw new Error('revised schedule does not fully depreciate the asset');
  }

  return {
    cost,
    residualValue,
    depreciableAmount,
    originalAnnualExpense,
    carryingAmountAtChange,
    revisedRemainingYears,
    revisedAnnualExpense,
    firstFullYearPretaxProfitDifference: firstPostChange?.pretaxProfitDifference ?? 0,
    expenseMovedBeyondOriginalLife,
    rows,
  };
}
