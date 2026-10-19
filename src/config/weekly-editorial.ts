import type { WeeklyEditorial } from './weekly-editions.ts';

// Revue explicite, séparée des instantanés automatiques figés. Une nouvelle
// édition conserve sa date de parution ; sa révision porte sa propre date.
export const weeklyEditorialReviews: Record<string, WeeklyEditorial> = {
  '2026-10-18': {
    reviewedAt: '2026-10-19T09:14:34Z',
    title: 'Le calendrier de la liquidité',
    description: 'Dette française, marchés tokenisés, SoftBank et USDC : quatre lectures pour suivre les échéances, les financeurs et les conditions de remboursement.',
    opening: [
      'Une échéance oblige à trouver de l’argent à une date précise. La négociation d’un jeton peut continuer pendant la fermeture d’autres circuits financiers. La disponibilité de la monnaie dépend alors des financeurs. Les enquêtes de cette semaine examinent cette contrainte, du Trésor français aux actifs tokenisés.',
      'Notre fil de lecture : repérer le prochain paiement, la ressource qui le finance et les conditions pour la mobiliser. Les quatre dossiers gardent leurs périmètres propres. Leur rapprochement aide à distinguer une valeur d’actif, un droit au remboursement et de la trésorerie disponible.',
    ],
    readings: [
      {
        topic: 'Dette publique',
        title: 'France : le coût se transmet aux échéances',
        href: '/posts/dette-francaise-refinancement-calendrier-taux/',
        fact: 'Le relevé AFT au 31 août 2026 permet d’isoler 165,642 milliards d’euros d’OAT nominales à taux fixe arrivant à échéance en 2027.',
        importance: 'Le coût des nouvelles émissions entre progressivement dans les comptes, selon le renouvellement des titres. Le taux du jour ne s’applique pas d’un coup à toute la dette.',
        uncertainty: 'Ce périmètre exclut les titres indexés et les besoins nouveaux. Les simulations de coupons du dossier ne prédisent pas les décaissements budgétaires.',
        source: { label: 'AFT · bulletin de septembre 2026, p. 5', href: 'https://www.aft.gouv.fr/files/medias-aft/7_Publications/7.2_BM/436_Bulletin%20mensuel%20septembre%202026.pdf' },
      },
      {
        topic: 'Marchés tokenisés',
        title: 'Le week-end, quelqu’un doit avancer le cash',
        href: '/posts/tokenisation-qui-finance-weekend/',
        fact: 'Un jeton peut continuer à changer de mains pendant la fermeture du marché de référence. Le FSB décrit les risques de ce décalage dans son rapport de 2024.',
        importance: 'Lorsque le rachat ferme, la sortie dépend d’un acheteur et de son bilan. La négociation continue exige d’examiner le financement disponible et les conditions de conversion.',
        uncertainty: 'Le rapport décrit des mécanismes possibles. Il ne mesure ni un manque global de liquidité actuel ni la probabilité d’une crise le dimanche.',
        source: { label: 'FSB · tokenisation, octobre 2024, pp. 14–15', href: 'https://www.fsb.org/uploads/P221024-2.pdf' },
      },
      {
        topic: 'Financement de l’IA',
        title: 'SoftBank : regarder les sorties de trésorerie',
        href: '/posts/softbank-openai-echeances-liberte-attendre/',
        fact: 'SoftBank a annoncé pour le 22 octobre 2026 le remboursement anticipé de 405,103 millions d’euros d’obligations.',
        importance: 'Cette échéance donne un point de contrôle concret à côté des annonces d’investissement. Le dossier suit les moyens de financement et la liberté de conserver longtemps des actifs peu liquides.',
        uncertainty: 'Au moment de cette revue, le remboursement reste annoncé. Il ne permet pas de reconstituer la trésorerie actuelle du groupe ni l’encours de tous ses prêts.',
        source: { label: 'SoftBank · annonce du 9 octobre 2026', href: 'https://group.softbank/en/news/press/20261009' },
      },
      {
        topic: 'Stablecoins',
        title: 'USDC : du droit au remboursement au compte bancaire',
        href: '/posts/usdc-reserves-suivre-jeton-mica/',
        fact: 'La politique européenne de Circle prévoit un parcours de remboursement avec vérifications et paiement bancaire. Elle distingue particuliers et clients institutionnels.',
        importance: 'Détenir le jeton, pouvoir le vendre et recevoir des dollars sur un compte sont des étapes différentes. Les délais et les conditions d’accès comptent dans la lecture des réserves.',
        uncertainty: 'La procédure ordinaire des particuliers prévoit jusqu’à cinq jours ouvrés, sauf anomalies ; des mesures spécifiques existent sous stress. Ce n’est pas le délai de chaque transfert de jetons.',
        source: { label: 'Circle Europe · politique MiCA du 15 septembre 2026, §§ 4 et 8', href: 'https://www.circle.com/legal/mica-redemption-policy' },
      },
    ],
    watchlist: [
      { title: '22 octobre · SoftBank', detail: 'Chercher une confirmation du remboursement annoncé, puis son traitement dans les prochaines informations financières. L’annonce ne prouve pas encore l’exécution.', href: 'https://group.softbank/en/news/press/20261009' },
      { title: 'Prochains relevés · dette française', detail: 'Actualiser les encours et les rachats avant de réutiliser les montants de 2027. Conserver la date d’observation du tableau AFT.', href: 'https://www.aft.gouv.fr/files/medias-aft/7_Publications/7.2_BM/436_Bulletin%20mensuel%20septembre%202026.pdf' },
      { title: 'Conditions de sortie · jetons et stablecoins', detail: 'Suivre les fenêtres de conversion, les financeurs engagés et les exceptions contractuelles. Une plage d’ouverture ne mesure pas la profondeur du marché.', href: '/posts/tokenisation-qui-finance-weekend/' },
    ],
    takeaway: 'Pour lire un risque de liquidité, identifier la date du paiement, la monnaie exigée et la contrepartie capable de la fournir.',
    cover: { src: '/illustrations/news/france-debt-refinancing-v1.jpg', alt: 'Illustration de dossiers répartis en échéances devant une fenêtre parisienne.' },
  },
};
