/** Fixed EDF Tarif Bleu rates effective 1 August 2026. Wh × 0.0001 EUR/kWh = 0.0000001 EUR. */
export const TEMPO_VOLUME_FIELDS = Object.freeze(['blue_hp', 'blue_hc', 'white_hp', 'white_hc', 'red_hp', 'red_hc']);
export const TEMPO_RATES = Object.freeze({ blue_hp: 1654n, blue_hc: 1356n, white_hp: 1921n, white_hc: 1536n, red_hp: 7295n, red_hc: 1615n });
export const TEMPO_DEFAULTS = Object.freeze({ blue_hp: '2400', blue_hc: '1200', white_hp: '344', white_hc: '172', red_hp: '176', red_hc: '88', capacity: '6', shift: '0' });
const MAX_WH = 200000000n;

export function parseTempoKWh(raw) {
  if (typeof raw !== 'string' || raw.length > 10 || !/^\d{1,6}(?:[.,]\d{1,3})?$/.test(raw)) throw new RangeError('Invalid kWh quantity');
  const [whole, fraction = ''] = raw.replace(',', '.').split('.');
  const wh = BigInt(whole) * 1000n + BigInt(fraction.padEnd(3, '0'));
  if (wh > MAX_WH) throw new RangeError('Quantity exceeds 200000 kWh');
  return wh;
}

export function calculateTempoBill(input) {
  const keys = [...TEMPO_VOLUME_FIELDS, 'capacity', 'shift'];
  if (!input || typeof input !== 'object' || Array.isArray(input) || Object.keys(input).length !== keys.length || keys.some(key => !Object.hasOwn(input, key))) throw new RangeError('Eight scenario fields required');
  if (input.capacity !== '6' && input.capacity !== '9') throw new RangeError('Unsupported capacity');
  const volumes = Object.fromEntries(TEMPO_VOLUME_FIELDS.map(key => [key, parseTempoKWh(input[key])]));
  const shiftWh = parseTempoKWh(input.shift);
  if (shiftWh > volumes.red_hp) throw new RangeError('Shift exceeds red peak consumption');
  const after = { ...volumes, red_hp: volumes.red_hp - shiftWh, red_hc: volumes.red_hc + shiftWh };
  const sum = (values, rate = false) => TEMPO_VOLUME_FIELDS.reduce((total, key) => total + values[key] * (rate ? TEMPO_RATES[key] : 1n), 0n);
  const totalWh = sum(volumes), variable = sum(volumes, true), variableAfter = sum(after, true);
  const subscription = (input.capacity === '6' ? 1580n : 1970n) * 12n * 100000n;
  const tempoBefore = variable + subscription, tempoAfter = variableAfter + subscription;
  const saving = tempoBefore - tempoAfter;
  if (sum(after) !== totalWh || saving !== shiftWh * (TEMPO_RATES.red_hp - TEMPO_RATES.red_hc)) throw new Error('Volume or cost invariant failed');
  const base = input.capacity === '6' ? totalWh * 2001n + 1586n * 12n * 100000n : null;
  return Object.freeze({ totalWh, variable, subscription, tempoBefore, tempoAfter, saving, base,
    baseDifference: base === null ? null : base - tempoAfter,
    redPeakCost: volumes.red_hp * TEMPO_RATES.red_hp,
    redEnergyShare: tempoPercent(volumes.red_hp, totalWh),
    redCostShare: tempoPercent(volumes.red_hp * TEMPO_RATES.red_hp, variable),
    redPeakAfterWh: after.red_hp, redOffPeakAfterWh: after.red_hc,
  });
}

export function tempoPercent(part, total) {
  if (typeof part !== 'bigint' || typeof total !== 'bigint' || part < 0n || total < 0n || part > total) throw new RangeError('Invalid share');
  if (total === 0n) return null;
  const tenths = (part * 2000n + total) / (total * 2n);
  return `${tenths / 10n}.${tenths % 10n}`;
}

function group(whole, lang) {
  const pieces = [];
  for (let end = whole.length; end > 0; end -= 3) pieces.push(whole.slice(Math.max(0, end - 3), end));
  return pieces.reverse().join(lang === 'en' ? ',' : '\u202f');
}
export function formatTempoMoney(units, lang) {
  if (typeof units !== 'bigint') throw new RangeError('Integer money required');
  const absolute = units < 0n ? -units : units;
  const cents = (absolute + 50000n) / 100000n;
  const value = `${group(String(cents / 100n), lang)}${lang === 'en' ? '.' : ','}${String(cents % 100n).padStart(2, '0')}`;
  const sign = units < 0n && cents !== 0n ? '−' : '';
  return lang === 'en' ? `${sign}€${value}` : `${sign}${value}\u00a0€`;
}
export function formatTempoEnergy(wh, lang) {
  if (typeof wh !== 'bigint' || wh < 0n) throw new RangeError('Nonnegative integer Wh required');
  const fraction = String(wh % 1000n).padStart(3, '0').replace(/0+$/, '');
  return `${group(String(wh / 1000n), lang)}${fraction ? (lang === 'en' ? '.' : ',') + fraction : ''}\u00a0kWh`;
}
