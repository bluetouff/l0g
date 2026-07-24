const rawPaymentLinks = {
  oneTime: 'https://donate.stripe.com/14A4gB8hC0EKd3e7m6enS00',
  monthly5: 'https://donate.stripe.com/eVqeVfbtObjo4wI49UenS01',
  monthly10: 'https://donate.stripe.com/aFa00l8hC5Z47IUeOyenS02',
  monthly25: 'https://donate.stripe.com/cNibJ341m9bg9R2bCmenS03',
};

const STRIPE_PAYMENT_LINK_HOSTS = Object.freeze([
  'buy.stripe.com',
  'donate.stripe.com',
]);

export const SUPPORT_PAYMENT_LINK_KEYS = Object.freeze(Object.keys(rawPaymentLinks));

export function validateStripePaymentLink(value, key = 'unknown') {
  if (value === null || value === undefined || value === '') return null;
  if (typeof value !== 'string') {
    throw new TypeError(`Lien Stripe ${key} invalide : une URL HTTPS est attendue.`);
  }

  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    throw new TypeError(`Lien Stripe ${key} invalide : URL illisible.`);
  }

  if (
    parsed.protocol !== 'https:'
    || !STRIPE_PAYMENT_LINK_HOSTS.includes(parsed.hostname)
    || parsed.port
    || parsed.username
    || parsed.password
    || parsed.search
    || parsed.hash
    || parsed.pathname === '/'
  ) {
    throw new TypeError(
      `Lien Stripe ${key} invalide : utiliser uniquement une URL Stripe Payment Links officielle sans paramètre.`
    );
  }

  if (parsed.pathname.startsWith('/test_')) {
    throw new TypeError(`Lien Stripe ${key} invalide : un lien de test ne peut pas être publié.`);
  }

  return parsed.toString();
}

export const supportPaymentLinks = Object.freeze(
  Object.fromEntries(
    Object.entries(rawPaymentLinks).map(([key, value]) => [
      key,
      validateStripePaymentLink(value, key),
    ])
  )
);

export const configuredSupportPaymentLinkCount = Object.values(supportPaymentLinks)
  .filter(Boolean)
  .length;
