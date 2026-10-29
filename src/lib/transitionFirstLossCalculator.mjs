/** Conditional, fictional principal-loss allocation. Money units are 10^-6 USD. */
export const FIRST_LOSS_FIELDS = Object.freeze(['capital', 'publicShare', 'equityShare', 'lossShare']);
export const FIRST_LOSS_DEFAULTS = Object.freeze({ capital: '100000000', publicShare: '10', equityShare: '20', lossShare: '25' });
export const FIRST_LOSS_ACTORS = Object.freeze(['public', 'equity', 'senior']);
const LIMITS = Object.freeze({ capital: 100000000000n, publicShare: 10000n, equityShare: 10000n, lossShare: 10000n });
const CENT = 10000n;
export function parseFirstLossQuantity(raw, field) {
  if (!Object.hasOwn(LIMITS, field) || typeof raw !== 'string' || raw.length > 13 || !/^\d{1,10}(?:[.,]\d{1,2})?$/.test(raw)) throw new RangeError('Invalid model quantity');
  const [integer, fraction = ''] = raw.replace(',', '.').split('.');
  const value = BigInt(integer) * 100n + BigInt(fraction.padEnd(2, '0'));
  if (value > LIMITS[field]) throw new RangeError('Model quantity exceeds limit');
  return value;
}
export function calculateFirstLoss(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input) || Object.keys(input).length !== 4 || FIRST_LOSS_FIELDS.some(key => !Object.hasOwn(input, key))) throw new RangeError('Four model fields required');
  const values = Object.fromEntries(FIRST_LOSS_FIELDS.map(key => [key, parseFirstLossQuantity(input[key], key)]));
  if (values.publicShare + values.equityShare > 10000n) throw new RangeError('Public and equity shares exceed total capital');
  const seniorShare = 10000n - values.publicShare - values.equityShare;
  const capital = values.capital * CENT, loss = values.capital * values.lossShare;
  const capacities = { public: values.capital * values.publicShare, equity: values.capital * values.equityShare, senior: values.capital * seniorShare };
  const allocate = order => {
    const rows = {}; let availableLoss = loss;
    order.forEach(actor => {
      const amount = capacities[actor] < availableLoss ? capacities[actor] : availableLoss;
      rows[actor] = Object.freeze({ capital: capacities[actor], loss: amount, remaining: capacities[actor] - amount });
      availableLoss -= amount;
    });
    const sum = key => FIRST_LOSS_ACTORS.reduce((total, actor) => total + rows[actor][key], 0n);
    if (availableLoss !== 0n || sum('loss') !== loss || sum('remaining') + loss !== capital) throw new Error('Loss allocation invariant failed');
    return Object.freeze(rows);
  };
  const publicFirst = allocate(['public', 'equity', 'senior']), equityFirst = allocate(['equity', 'public', 'senior']);
  const publicDifference = publicFirst.public.loss - equityFirst.public.loss;
  if (publicFirst.senior.loss !== equityFirst.senior.loss || publicDifference < 0n || publicDifference !== equityFirst.equity.loss - publicFirst.equity.loss) throw new Error('Priority comparison invariant failed');
  return Object.freeze({ capital, loss, remaining: capital - loss, publicDifference, seniorShare, publicFirst, equityFirst });
}
export function formatFirstLossMoney(value, lang) {
  if (typeof value !== 'bigint' || value < 0n || !['fr', 'en'].includes(lang)) throw new RangeError('Nonnegative model money and supported language required');
  const cents = (value + CENT / 2n) / CENT;
  const whole = String(cents / 100n), groups = [];
  for (let end = whole.length; end > 0; end -= 3) groups.push(whole.slice(Math.max(0, end - 3), end));
  const number = groups.reverse().join(lang === 'en' ? ',' : '\u202f') + (lang === 'en' ? '.' : ',') + String(cents % 100n).padStart(2, '0');
  return lang === 'en' ? `$${number}` : `${number}\u00a0$`;
}
