// The recording shows clicks in the real local component, with fictional fares.
export const AIRFARE_DEMO_CAPTIONS = [
  { start: 0, end: 4, action: null, fr: 'Un même vol. Des places à 180 €, 240 € et 300 €.', en: 'One flight. Seats at €180, €240 and €300.' },
  { start: 4, end: 8, action: 'search', fr: 'Les bots cherchent. Le prix reste à 180 €.', en: 'The bots search. The price stays at €180.' },
  { start: 8, end: 12, action: 'hold', fr: 'Ils bloquent 2 places. Il reste des billets à 180 €.', en: 'They hold 2 seats. Some €180 tickets remain.' },
  { start: 12, end: 16, action: 'hold', fr: 'Les places à 180 € sont bloquées. Le prix passe à 240 €.', en: 'The €180 seats are held. The price rises to €240.' },
  { start: 16, end: 20, action: 'hold', fr: 'Deux places de plus sont bloquées. Le prix reste à 240 €.', en: 'Two more seats are held. The price stays at €240.' },
  { start: 20, end: 24, action: 'hold', fr: 'Plus de places libres à 240 €. Le prix passe à 300 €.', en: 'No €240 seats remain available. The price rises to €300.' },
  { start: 24, end: 28, action: 'release', fr: 'Les bots libèrent les places. Le prix revient à 180 €.', en: 'The bots release the seats. The price returns to €180.' },
  { start: 28, end: 32, action: null, fr: 'Bloquer les places les moins chères peut faire monter le prix.', en: 'Holding the cheapest seats can raise the price.' },
] as const;
