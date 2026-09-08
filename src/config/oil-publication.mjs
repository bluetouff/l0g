export const oilPublication = {
  title: 'Les banquiers du baril',
  subtitle: 'Crédit, cargaisons et pouvoir pétrolier',
  date: '2026-09-08',
  modified: '2026-09-08T18:55:23Z',
  path: '/publications/les-banquiers-du-baril/',
  epub: '/publications/les-banquiers-du-baril-l0g.epub',
  cover: '/publications/les-banquiers-du-baril-cover.jpg',
  social: '/publications/les-banquiers-du-baril-cover-social.jpg',
  introduction: [
    'Un pétrolier quitte le port. Sa cargaison a un acheteur, un prix et une destination. Elle a aussi un calendrier financier : l’argent avancé pour l’acquérir, les garanties demandées par une banque, les sommes immobilisées pour couvrir son prix, puis le paiement attendu à l’arrivée. Entre ces échéances, quelqu’un doit tenir la trésorerie.',
    'Les banquiers du baril suit cet argent à travers huit enquêtes. Le parcours commence avec le financement d’une cargaison et remonte vers les établissements qui prêtent aux négociants. Il passe ensuite par les recettes pétrolières promises aux créanciers du Tchad, la formation d’une référence de prix et les raffineries, terminaux et stations qui donnent au commerce son ancrage physique.',
    'Deux dossiers judiciaires ouvrent une autre perspective. L’affaire du nickel de Trafigura éclaire les contrôles qui entourent une cargaison financée. Le dossier Trafigura–Petrobras permet de suivre la corruption jusque dans les contrats et les paiements. Ces situations ont leurs acteurs, leurs dates et leurs qualifications propres. Leur place dans le livre sert à comprendre les responsabilités et les failles de contrôle, sans généraliser leurs conclusions à tout le secteur.',
    'Le dernier chapitre relie ces mécanismes à la continuité des livraisons. Quand une garantie doit être versée avant qu’une vente soit encaissée, les délais deviennent décisifs. Les cas énergétiques de 2022 aident à examiner les relais disponibles. Ils concernent notamment le gaz et l’électricité ; ils ne constituent pas le récit d’une interruption mondiale du commerce pétrolier.',
    'Au fil des chapitres, le lecteur retrouvera les contrats, les comptes, les décisions et les publications institutionnelles sur lesquels repose l’analyse. Les exemples fictifs restent signalés, les montants gardent leur période et leur périmètre. Cette édition rassemble les articles publiés du 6 au 8 septembre 2026 dans un ordre de lecture continu. Les sources et les liens vers les versions en ligne accompagnent chaque enquête.',
  ],
};

export const oilChapters = [
  ['les-banquiers-du-baril-1-financement-cargaison-petrole', 'Pétrole : qui paie la cargaison avant vous ?', 'Le crédit, les garanties et le calendrier d’une cargaison.'],
  ['les-banquiers-du-baril-2-banques-financement-trafigura', 'Trafigura : les banques derrière le commerce du pétrole', 'Les établissements et les instruments qui financent le négoce.'],
  ['les-banquiers-du-baril-3-tchad-glencore-dette-petrole', 'Tchad–Glencore : le pétrole promis aux créanciers', 'La dette, les recettes d’exportation et le budget d’un État.'],
  ['les-banquiers-du-baril-4-trafigura-platts-prix-fioul', 'Trafigura : dans la fabrique du prix du fioul', 'Le dossier CFTC et la formation d’une référence Platts.'],
  ['les-banquiers-du-baril-5-vitol-raffineries-terminaux-engen', 'Vitol : raffineries, terminaux et stations au service du négoce', 'Les infrastructures et les conditions de concurrence.'],
  ['les-banquiers-du-baril-6-trafigura-nickel-fantome', 'Trafigura : le nickel fantôme', 'Les cargaisons mal décrites et les contrôles du financement.'],
  ['les-banquiers-du-baril-7-trafigura-petrobras-corruption', 'Trafigura–Petrobras : la corruption dans les contrats pétroliers', 'Les intermédiaires, les paiements et les sanctions.'],
  ['les-banquiers-du-baril-8-credit-livraisons-petrole', 'Pétrole : une crise de crédit peut-elle bloquer les livraisons ?', 'Les appels de marge, la liquidité et les relais d’approvisionnement.'],
].map(([slug, title, summary], index) => ({
  number: index + 1, slug, title, summary,
  route: `/posts/${slug}/`,
  chapter: `ch${String(index + 2).padStart(3, '0')}.xhtml`,
}));
