export type AirfareAction = 'search' | 'hold' | 'release';
export type AirfarePrice = 180 | 240 | 300;

export interface AirfareState {
  heldSeats: number;
}

export interface AirfareSeat {
  number: number;
  price: AirfarePrice;
}

export interface AirfareScenario {
  heldSeats: number;
  availableSeats: number;
  price: AirfarePrice | null;
  remainingAtPrice: number;
  extraPrice: number | null;
}

// Entirely fictional teaching inventory. These prices and allocations are not
// airline data. A search never holds a seat; a hold uses the cheapest seats first.
export const AIRFARE_SEATS: readonly Readonly<AirfareSeat>[] = Object.freeze(
  Array.from({ length: 12 }, (_, index) => Object.freeze({
    number: index + 1,
    price: (index < 4 ? 180 : index < 8 ? 240 : 300) as AirfarePrice,
  })),
);

export const AIRFARE_DEFAULTS: Readonly<AirfareState> = Object.freeze({ heldSeats: 0 });

function validate(input: unknown): AirfareState {
  if (input === null || typeof input !== 'object' || Array.isArray(input)) {
    throw new RangeError('Invalid airfare state');
  }
  const prototype = Object.getPrototypeOf(input);
  if (prototype !== Object.prototype && prototype !== null) {
    throw new RangeError('Invalid airfare state');
  }
  const keys = Reflect.ownKeys(input);
  if (keys.length !== 1 || keys[0] !== 'heldSeats') {
    throw new RangeError('Invalid airfare state fields');
  }
  // Read only an own data property. Accessors and implicit conversions are not inputs.
  const descriptor = Object.getOwnPropertyDescriptor(input, 'heldSeats');
  if (!descriptor || !Object.hasOwn(descriptor, 'value')) {
    throw new RangeError('Invalid airfare state fields');
  }
  const heldSeats = descriptor.value;
  if (typeof heldSeats !== 'number' || !Number.isSafeInteger(heldSeats)
    || heldSeats < 0 || heldSeats > AIRFARE_SEATS.length) {
    throw new RangeError('Invalid held-seat count');
  }
  return { heldSeats };
}

export function calculateAirfareScenario(input: unknown): AirfareScenario {
  const { heldSeats } = validate(input);
  const available = AIRFARE_SEATS.slice(heldSeats);
  const price = available[0]?.price ?? null;
  return {
    heldSeats,
    availableSeats: available.length,
    price,
    remainingAtPrice: price === null ? 0 : available.filter(seat => seat.price === price).length,
    extraPrice: price === null ? null : price - AIRFARE_SEATS[0].price,
  };
}

export function applyAirfareAction(input: unknown, action: unknown): AirfareState {
  const { heldSeats } = validate(input);
  if (action === 'search') return { heldSeats };
  if (action === 'hold') return { heldSeats: Math.min(AIRFARE_SEATS.length, heldSeats + 2) };
  if (action === 'release') return { heldSeats: 0 };
  throw new RangeError('Invalid airfare action');
}
