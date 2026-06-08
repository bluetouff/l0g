/**
 * Contenu de la colonne de droite — édite UNIQUEMENT ce fichier.
 * Il alimente la version desktop (Sidebar.astro) et la version mobile
 * (SidebarMobile.astro) à partir de la même source.
 */

// Symbole du mini-graphe affiché en haut de la colonne (desktop seulement).
// Mettre à null pour ne pas afficher de graphe.
export const sidebarMarketSymbol: string | null = 'BINANCE:BTCUSDT';

// Liens listés dans la colonne.
export const sidebarLinks: { label: string; href: string }[] = [
  { label: 'US macro dashboard', href: 'https://us.l0g.fr' },
  { label: 'euro macro dashboard', href: 'https://euro.l0g.fr' },
  { label: '13flow', href: 'https://13flow.eu' },
  { label: 'orbit', href: 'https://crypto.l0g.fr' },
  { label: 'bluetouff.com', href: 'https://bluetouff.com' },
];

// Bloc « about » en bas de colonne.
export const sidebarAbout =
  "Journal de Bluetouff. Macro, crypto, finance. Sources primaires, lecture critique des annonces, et un peu de code pour rendre l'opacite lisible.";
