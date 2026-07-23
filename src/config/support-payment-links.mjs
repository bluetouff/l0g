const rawPaymentLinks = {
  oneTime: null,
  monthly5: null,
  monthly10: null,
  monthly25: null,
};

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
    || parsed.hostname !== 'buy.stripe.com'
    || parsed.port
    || parsed.username
    || parsed.password
    || parsed.search
    || parsed.hash
    || parsed.pathname === '/'
  ) {
    throw new TypeError(
      `Lien Stripe ${key} invalide : utiliser uniquement une URL https://buy.stripe.com/... sans paramètre.`
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
