/**
 * Contenu de la colonne de droite — édite UNIQUEMENT ce fichier.
 * Il alimente la version desktop (Sidebar.astro) et la version mobile
 * (SidebarMobile.astro) à partir de la même source.
 */

// Mini-graphe en haut de colonne (desktop). null = pas de graphe.
export const sidebarMarketSymbol: string | null = null;

// Liens listés dans la colonne.
export const sidebarLinks: { label: string; href: string }[] = [
  { label: 'US macro dashboard', href: 'https://us.l0g.fr' },
  { label: 'EU macro dashboard', href: 'https://euro.l0g.fr' },
  { label: 'Yen Carry Monitor', href: 'https://yct.l0g.fr' },
  { label: 'Energie Monitor', href: 'https://energie.l0g.fr' },
  { label: 'bluetouff.com', href: 'https://bluetouff.com' },
];

// Bloc « about » en bas de colonne.
export const sidebarAbout =
  "Journal de Bluetouff. Macro, crypto, finance. Sources primaires, lecture critique des annonces, et un peu de code pour rendre l'opacite lisible.";
