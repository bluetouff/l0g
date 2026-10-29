/** Fictional one-year, simple-rate model. Money units are 10^-10 USD. */
export const STABLECOIN_REVENUE_FIELDS = Object.freeze(['principal', 'reserveRate', 'platformShare', 'rewardRate']);
export const STABLECOIN_REVENUE_DEFAULTS = Object.freeze({ principal: '1000000', reserveRate: '4', platformShare: '50', rewardRate: '1.5' });
const LIMITS = Object.freeze({ principal: 100000000000n, reserveRate: 2000n, platformShare: 10000n, rewardRate: 2000n });
const MONEY_CENT = 100000000n;

export function parseStablecoinDecimal(raw, field) {
  if (!Object.hasOwn(LIMITS, field) || typeof raw !== 'string' || raw.length > 13 || raw.trim() !== raw || !/^\d{1,10}(?:[.,]\d{1,2})?$/.test(raw)) throw new RangeError('Invalid model quantity');
  const [whole, fraction = ''] = raw.replace(',', '.').split('.');
  const scaled = BigInt(whole) * 100n + BigInt(fraction.padEnd(2, '0'));
  if (scaled > LIMITS[field]) throw new RangeError('Model quantity exceeds its limit');
  return scaled;
}

export function calculateStablecoinRevenue(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input) || Object.keys(input).length !== 4 || STABLECOIN_REVENUE_FIELDS.some(key => !Object.hasOwn(input, key))) throw new RangeError('Four model fields required');
  const values = Object.fromEntries(STABLECOIN_REVENUE_FIELDS.map(key => [key, parseStablecoinDecimal(input[key], key)]));
  const reserveIncome = values.principal * values.reserveRate * 10000n;
  const platformBeforeRewards = values.principal * values.reserveRate * values.platformShare;
  const issuerBeforeCosts = reserveIncome - platformBeforeRewards;
  const rewards = values.principal * values.rewardRate * 10000n;
  const platformAfterRewards = platformBeforeRewards - rewards;
  const additionalFunding = platformAfterRewards < 0n ? -platformAfterRewards : 0n;
  if (issuerBeforeCosts + platformBeforeRewards !== reserveIncome || platformAfterRewards + rewards !== platformBeforeRewards) throw new Error('Income allocation invariant failed');
  return Object.freeze({ principal: values.principal * MONEY_CENT, reserveIncome, issuerBeforeCosts, platformBeforeRewards, rewards, platformAfterRewards, additionalFunding,
    thresholdMicroPercent: values.principal === 0n ? null : values.reserveRate * values.platformShare,
  });
}

function groupInteger(value, lang) {
  const groups = [];
  for (let end = value.length; end > 0; end -= 3) groups.push(value.slice(Math.max(0, end - 3), end));
  return groups.reverse().join(lang === 'en' ? ',' : '\u202f');
}
export function formatStablecoinMoney(units, lang) {
  if (typeof units !== 'bigint' || !['fr', 'en'].includes(lang)) throw new RangeError('Integer model money and supported language required');
  const absolute = units < 0n ? -units : units, cents = (absolute + MONEY_CENT / 2n) / MONEY_CENT;
  const value = `${groupInteger(String(cents / 100n), lang)}${lang === 'en' ? '.' : ','}${String(cents % 100n).padStart(2, '0')}`;
  const sign = units < 0n && cents !== 0n ? '−' : '';
  return lang === 'en' ? `${sign}$${value}` : `${sign}${value}\u00a0$`;
}
export function formatStablecoinThreshold(value, lang) {
  if (!['fr', 'en'].includes(lang)) throw new RangeError('Supported language required');
  if (value === null) return lang === 'en' ? 'Unavailable: zero principal' : 'Indisponible : principal nul';
  if (typeof value !== 'bigint' || value < 0n || !['fr', 'en'].includes(lang)) throw new RangeError('Nonnegative threshold and supported language required');
  const fraction = String(value % 1000000n).padStart(6, '0').replace(/0+$/, '');
  return `${value / 1000000n}${fraction ? (lang === 'en' ? '.' : ',') + fraction : ''}\u00a0%`;
}
