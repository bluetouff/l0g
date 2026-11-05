export type AirfareStage = 0 | 1 | 2;

export interface AirfareState {
  stage: AirfareStage;
}

export interface AirfareScenario {
  stage: AirfareStage;
  travelers: 1;
  purchases: 0;
  requests: 1 | 100;
  recognized: boolean;
  lowFareOpen: boolean;
  price: 180 | 240;
  extraPrice: 0 | 60;
}

// Fictional teaching scenario: an intentionally naive seller mistakes repeated
// requests for demand. Neither these prices nor this rule describe an airline.
// The scenario models no real inventory, purchases or measured price effect.
export const AIRFARE_DEFAULTS: Readonly<AirfareState> = Object.freeze({ stage: 0 });

function validate(input: unknown): AirfareState {
  if (input === null || typeof input !== 'object' || Array.isArray(input)) {
    throw new RangeError('Invalid airfare state');
  }
  const prototype = Object.getPrototypeOf(input);
  if (prototype !== Object.prototype && prototype !== null) {
    throw new RangeError('Invalid airfare state');
  }
  const keys = Reflect.ownKeys(input);
  if (keys.length !== 1 || keys[0] !== 'stage') {
    throw new RangeError('Invalid airfare state fields');
  }
  // Read only an own data property. Accessors and implicit conversions are not inputs.
  const descriptor = Object.getOwnPropertyDescriptor(input, 'stage');
  if (!descriptor || !Object.hasOwn(descriptor, 'value')) {
    throw new RangeError('Invalid airfare state fields');
  }
  const stage: unknown = descriptor.value;
  if (stage !== 0 && stage !== 1 && stage !== 2) {
    throw new RangeError('Invalid airfare stage');
  }
  return { stage };
}

export function calculateAirfareScenario(input: unknown): AirfareScenario {
  const { stage } = validate(input);
  return {
    stage,
    travelers: 1,
    purchases: 0,
    requests: stage === 0 ? 1 : 100,
    recognized: stage === 2,
    lowFareOpen: stage !== 1,
    price: stage === 1 ? 240 : 180,
    extraPrice: stage === 1 ? 60 : 0,
  };
}

export function nextAirfareStage(input: unknown): AirfareState {
  const { stage } = validate(input);
  return { stage: ((stage + 1) % 3) as AirfareStage };
}
