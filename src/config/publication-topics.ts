export const publicationTopics = {
  technology: { fr:'Technologie et données', en:'Technology and data' },
  finance: { fr:'Finance et crédit', en:'Finance and credit' },
  energy: { fr:'Énergie et ressources', en:'Energy and resources' },
  tax: { fr:'Fiscalité', en:'Tax' },
  ai: { fr:'IA et travail', en:'AI and work' },
  property: { fr:'Immobilier', en:'Property' },
  money: { fr:'Monnaie et paiements', en:'Money and payments' },
};
type Topic = keyof typeof publicationTopics;
/** Editorial subjects of the existing editions, without inferred financial links. */
export const publicationTopicKeys: Record<string, Topic[]> = {
  'encryption-backdoor':['technology'],
  'ordinary-machines':['technology'],cumcum:['tax'], 'insurance-promise':['finance'],
  'cyber-recovery':['technology'], 'debt-chain':['finance'], microsoft:['technology'],
  reserves:['energy'], 'ai-slowdown':['ai'], 'ia-recouvrement':['ai','technology'],
  'commerce-traces':['technology'], scpi:['property','finance'], 'oil-trading':['energy','finance'],
  'digital-identity':['technology'], 'e-invoicing':['tax','money'], 'water-electricity':['energy'],
  'digital-euro':['money'], epstein:['finance'], 'auditer-opacite':['finance'],
};
