export type AirfareMode = 'observe' | 'signal' | 'inventory';

export interface AirfareInputs {
  mode: AirfareMode;
  requestsPerIntention: number;
  filterPct: number;
  sensitivityPct: number;
  heldSeats: number;
  step: number;
}

export interface AirfareScenario {
  step: number;
  mode: AirfareMode;
  intensity: number;
  rawRequests: number;
  extraRequests: number;
  signalRequests: number;
  filteredRequests: number;
  intentions: number;
  bookings: number;
  queryConversionPct: number;
  intentionConversionPct: number;
  probability: number;
  expectedFutureRevenue: number;
  price: number;
  baselinePrice: number;
  heldNow: number;
  availableSeats: number;
  cheapAvailable: number;
  extraPrice: number;
}

export const AIRFARE_DEFAULTS: Readonly<AirfareInputs> = Object.freeze({
  mode: 'signal',
  requestsPerIntention: 800,
  filterPct: 0,
  sensitivityPct: 100,
  heldSeats: 8,
  step: 60,
});

const keys = Object.keys(AIRFARE_DEFAULTS);
const limits = {
  requestsPerIntention: [10, 1000],
  filterPct: [0, 100],
  sensitivityPct: [0, 100],
  heldSeats: [0, 12],
  step: [0, 60],
} as const;

function validate(input: unknown): AirfareInputs {
  if (input === null || typeof input !== 'object' || Array.isArray(input)) {
    throw new RangeError('Invalid airfare scenario');
  }
  const prototype = Object.getPrototypeOf(input);
  if (prototype !== Object.prototype && prototype !== null) {
    throw new RangeError('Invalid airfare scenario');
  }
  const ownKeys = Reflect.ownKeys(input);
  if (ownKeys.length !== keys.length || ownKeys.some(key => typeof key !== 'string' || !keys.includes(key))) {
    throw new RangeError('Invalid airfare scenario fields');
  }
  // Read data descriptors only: an accessor is not a numeric or enum input.
  const descriptors = Object.getOwnPropertyDescriptors(input);
  if (keys.some(key => !Object.hasOwn(descriptors, key) || !Object.hasOwn(descriptors[key], 'value'))) {
    throw new RangeError('Invalid airfare scenario fields');
  }
  const mode = descriptors.mode.value;
  if (mode !== 'observe' && mode !== 'signal' && mode !== 'inventory') {
    throw new RangeError('Invalid airfare mechanism');
  }
  for (const [key, [min, max]] of Object.entries(limits)) {
    const value = descriptors[key].value;
    if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < min || value > max) {
      throw new RangeError(`Invalid airfare parameter: ${key}`);
    }
  }
  return {
    mode,
    requestsPerIntention: descriptors.requestsPerIntention.value,
    filterPct: descriptors.filterPct.value,
    sensitivityPct: descriptors.sensitivityPct.value,
    heldSeats: descriptors.heldSeats.value,
    step: descriptors.step.value,
  };
}

function calculate(input: AirfareInputs): AirfareScenario {
  const { mode, requestsPerIntention, filterPct, sensitivityPct, heldSeats, step } = input;
  const intensity = 10 + Math.round((requestsPerIntention - 10) * Math.min(step / 40, 1));
  const rawRequests = intensity * 1000;
  const extraRequests = (intensity - 10) * 1000;
  const filteredRequests = extraRequests * filterPct / 100;
  const signalRequests = rawRequests - filteredRequests;

  // Entirely fictional teaching relationship, with no empirical calibration
  // from bot traffic to demand probabilities or real airline prices.
  const denominator = 990 * 100 * 100;
  const numerator = mode === 'signal'
    ? (intensity - 10) * (100 - filterPct) * sensitivityPct
    : 0;
  const probability = (40 * denominator + 40 * numerator) / (100 * denominator);
  const expectedFutureRevenue = (120 * denominator + 120 * numerator) / denominator;

  // The 24 currently available units are a separate illustrative inventory
  // snapshot. The cohort's 100 historical bookings do not consume them again.
  const heldNow = mode === 'inventory' && step < 50
    ? Math.floor(heldSeats * Math.min(step / 30, 1))
    : 0;
  const cheapAvailable = Math.max(0, 8 - heldNow);
  // Integer comparison preserves acceptance at exactly 60% / 180 euros.
  const closeLowFare = mode === 'inventory' ? cheapAvailable === 0 : 2 * numerator > denominator;
  const price = closeLowFare ? 300 : 180;

  return {
    step,
    mode,
    intensity,
    rawRequests,
    extraRequests,
    signalRequests,
    filteredRequests,
    intentions: 1000,
    bookings: 100,
    queryConversionPct: 100 / rawRequests * 100,
    intentionConversionPct: 10,
    probability,
    expectedFutureRevenue,
    price,
    baselinePrice: 180,
    heldNow,
    availableSeats: 24 - heldNow,
    cheapAvailable,
    extraPrice: price - 180,
  };
}

export function calculateAirfareScenario(input: unknown): AirfareScenario {
  return calculate(validate(input));
}

export function airfareTimeline(input: unknown): AirfareScenario[] {
  const valid = validate(input);
  return Array.from({ length: 61 }, (_, step) => calculate({ ...valid, step }));
}
