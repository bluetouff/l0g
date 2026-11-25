// Editorial apparatus prepared for the second volume. Chapter texts retain
// their publication dates and their original reference catalogues.
/** @type {Array<[string, string, string, string | null, number[]]>} */
const documents = [
  ['B01', 'Nvidia / SEC · 8-K', 'https://www.sec.gov/Archives/edgar/data/1045810/000104581026000090/nvda-20261122.htm', '2026-11-23', [23, 26]],
  ['B02', 'Nvidia / SEC · Exhibit 99.1', 'https://www.sec.gov/Archives/edgar/data/1045810/000104581026000090/nov23pressrelease.htm', '2026-11-23', [23, 26]],
  ['B03', 'Nvidia · Q3 FY2027 earnings call', 'https://s201.q4cdn.com/141608511/files/content_files/NVDA-3Q27-Earnings-Transcript.pdf', null, [23, 26]],
  ['B04', 'CNBC / Versant · Donald Trump', 'https://pressroom.versantmedia.com/cnbc/press-releases/cnbc-transcript-president-donald-trump-speaks-cnbcs-eamon-javers-and-squawk', '2026-11-23', [26]],
  ['B05', 'New York Post · Donald Trump', 'https://nypost.com/2026/11/24/us-news/trump-leaves-door-open-to-jensen-huang-pardon-and-urges-him-not-to-plead-5th-to-congress-next-week/', '2026-11-24', [26]],
  ['B06', 'Intel / SEC · 8-K', 'https://www.sec.gov/Archives/edgar/data/50863/000005086325000135/intc-20250827.htm', '2025-08-28', [26]],
  ['B07', 'MP Materials / SEC · Transaction Agreement', 'https://www.sec.gov/Archives/edgar/data/1801368/000119312525157310/d43796dex101.htm', '2025-07-10', [26]],
  ['B08', 'BIS · Addressing Remote Access to Advanced Semiconductors', 'https://www.federalregister.gov/documents/2026/11/19/2026-23529/addressing-remote-access-to-advanced-semiconductors', '2026-11-19', [21]],
  ['B09', 'House Foreign Affairs Committee · BIS license decisions', 'https://democrats-foreignaffairs.house.gov/wp-content/uploads/2026/11/11.19.26-ECRA-Information-Disclosure-of-BIS-License-Decisions.pdf', '2026-11-19', [21]],
  ['B10', 'Anthropic · IPO and Concurrent Private Placement Close', 'https://www.anthropic.com/news/ipo-close', '2026-11-20', [22]],
  ['B11', 'Apollo / Goldman Sachs · SpaceX equipment financing', 'https://ir.apollo.com/news-events/press-releases/detail/662/apollo-and-goldman-sachs-announce-pricing-of-44-billion', '2026-11-20', [22]],
  ['B12', 'House Energy and Commerce Committee · Letter to Trump', 'https://democrats-energycommerce.house.gov/sites/evo-subsites/democrats-energycommerce.house.gov/files/evo-media-document/2026.11.24-multi-committee-letter-to-president-trump-re-jensen-huang.pdf', '2026-11-24', [26]],
  ['B13', 'California Department of Justice · Nvidia investigative subpoena', 'https://oag.ca.gov/node/633133', '2026-11-19', []],
  ['B14', 'Congressional Research Service · Executive Clemency and Judicial Power', 'https://www.congress.gov/crs_external_products/LSB/PDF/LSB11294/LSB11294.1.pdf', '2025-04-25', []],
  ['B15', 'BIS · Additions to the Entity List', 'https://www.federalregister.gov/public-inspection/2026-23999/additions-to-the-entity-list', '2026-11-23', [25]],
  ['B16', 'U.S. Office of Government Ethics · Donald Trump, OGE Form 278e', 'https://extapps2.oge.gov/201/Presiden.nsf/PAS%2BIndex/69AEAA9D7455ACD585258E27002DDEE1/%24FILE/Donald-J-Trump-2026-278ANNUAL.pdf', null, [24, 25, 26]],
];

const scope = {
  fr: [
    'Rubrique 5.02. Le vote du conseil et le retour effectif sont datés du 22 novembre. Le dépôt du 23 est un acte distinct.',
    'Décision unanime, avis reçu de responsables américains pour l’appréciation du risque et poursuite de l’enquête du comité indépendant.',
    'Page 2. Déclaration de Harvey Jones le 17 novembre sur la recherche d’un dirigeant et l’absence de projet de réintégration à cette date.',
    'Questions sur le rôle de Trump auprès du conseil et sur une éventuelle participation publique. Transcription de l’entretien par le diffuseur.',
    'Entretien publié le 24 à 22 h 56 UTC. Trump évoque une part pour l’État fédéral et répond à une question distincte sur la grâce. Heure de l’entretien inconnue.',
    'Rubrique 8.01. Clôture, versement à Intel, émission d’actions et bon de souscription. Les autres actions placées sous séquestre suivent leur calendrier.',
    'Sections 8.01, 8.03 et 8.05. L’accord du Pentagone précise les droits de vote et les opérations qui demandent son consentement.',
    'Texte sur certains accès à distance à des capacités de calcul avancé. Les critères et obligations se lisent dans la règle et ses annexes.',
    'Relevé du BIS arrêté au 11 mai, publié par la Chambre le 19 novembre. Les lignes décrivent des décisions de licence et leur périmètre.',
    'Annonce de la clôture de l’introduction en Bourse et de la vente privée simultanée. L’identité et le montant de l’apport Nvidia sont détaillés dans le prospectus définitif cité au chapitre XXII.',
    'Conditions annoncées de l’émission destinée au financement du matériel de SpaceX. Les conditions de marché et le règlement effectif correspondent à des jalons différents.',
    'Pages 3 et 4. Quatre élus demandent notamment les échanges avec le conseil du 12 au 23 novembre. Échéance demandée au 8 décembre.',
    'Communiqué du procureur général de Californie confirmant la remise à Nvidia d’une demande de pièces dans le cadre de son enquête.',
    'Pages 1 et 2. Champ fédéral pénal du pouvoir présidentiel de grâce et distinction avec le droit des États et les actions civiles.',
    'Mise à disposition publique de la règle d’inscription de sept entités. Le chapitre XXV distingue ce dépôt de sa publication au registre.',
    'Déclaration annuelle couvrant 2025. Les lignes 255 et 1025 identifient des positions Nvidia dans des comptes déclarés. Elles ne décrivent pas le portefeuille au retour de Huang.',
  ],
  en: [
    'Item 5.02. The board vote and effective reinstatement date were November 22. The November 23 filing was a separate event.',
    'Unanimous decision, input from senior US officials on the security assessment, and continuation of the independent committee’s inquiry.',
    'Page 2. Harvey Jones’s November 17 statement on the board’s search and its position on reinstatement at the time.',
    'Questions about Trump’s role with the board and a possible government stake. Transcript published by the broadcaster.',
    'Interview published November 24 at 22:56 UTC. Trump discusses a federal stake and separately answers a question on clemency. The interview time is unknown.',
    'Item 8.01. Closing, payment to Intel, share issuance and warrant. Other shares went into escrow on a separate schedule.',
    'Sections 8.01, 8.03 and 8.05. The Pentagon’s agreement specifies voting terms and the transactions that require consent.',
    'Rule covering specified remote access to advanced computing capacity. Its criteria and obligations appear in the rule and annexes.',
    'BIS table as of May 11, released by the House on November 19. The entries record licensing decisions and their scope.',
    'Announcement of the IPO and concurrent private placement closing. The final prospectus cited in Chapter XXII identifies Nvidia and the amount of its subscription.',
    'Announced terms of the securities offering to finance SpaceX equipment. Pricing and settlement are separate milestones.',
    'Pages 3 and 4. Four lawmakers ask for communications with the board from November 12 through 23, among other records, and request a reply by December 8.',
    'California’s attorney general confirms that Nvidia was served with an investigative subpoena.',
    'Pages 1 and 2. The federal criminal scope of presidential clemency and its limits as to state offenses and civil claims.',
    'Public inspection version of a rule adding seven entities. Chapter XXV distinguishes that step from its Federal Register publication.',
    'Annual disclosure covering 2025. Lines 255 and 1025 identify Nvidia positions in reported accounts. They do not establish the holdings on the reinstatement date.',
  ],
};

/** @param {'fr' | 'en'} lang */
const references = lang => documents.map(([id, title, url, publication, chapters], index) => ({
  id, title, url, publication, consultation: '2026-11-25', chapters,
  scope: scope[lang][index], detail: scope[lang][index],
}));

/** @type {Array<[string, string, string, string, string, number, string, number | null]>} */
const terms = [
  ['controle-export', 'Contrôles à l’exportation', 'Export controls', 'Règles qui encadrent certaines livraisons, certains usages et certains accès selon le matériel, la destination et les personnes concernées.', 'Rules governing specified shipments, uses and forms of access based on the equipment, destination and parties involved.', 21, 'S03', 7],
  ['utilisateur-final', 'Utilisateur final', 'End user', 'Personne ou entité appelée à utiliser le matériel ou le calcul. Elle peut être distincte de l’acheteur et de l’exploitant du centre de données.', 'Person or company that will use the hardware or computing service. It can be different from the buyer or data center operator.', 21, 'S03', 7],
  ['collateral', 'Collatéral', 'Collateral', 'Actif affecté au remboursement d’une dette en cas de défaut. La valeur des machines au départ, le montant dû et la somme récupérable répondent à des règles différentes.', 'An asset pledged to secure a debt in the event of default. Initial equipment value, outstanding principal and eventual recovery are distinct.', 22, 'S03', 10],
  ['garantie', 'Garantie', 'Guarantee', 'Engagement pris au bénéfice d’une autre partie. Son champ dépend du contrat et de l’événement qui autorise le bénéficiaire à réclamer un paiement.', 'An undertaking for the benefit of another party. Its scope depends on the contract and the event that allows the beneficiary to demand payment.', 26, 'S14', null],
  ['dilution-du-capital', 'Dilution du capital', 'Equity dilution', 'Réduction de la part relative d’un actionnaire lors d’une émission à laquelle il souscrit moins que sa part. Les catégories d’actions déterminent l’effet sur le vote.', 'A reduction in a shareholder’s ownership percentage when newly issued shares go disproportionately to other investors. Share classes determine the effect on voting power.', 26, 'S07', 5],
  ['warrant', 'Bon de souscription', 'Warrant', 'Droit d’acheter des actions à des conditions fixées à l’avance. Le prix, la date limite et un éventuel déclencheur déterminent la portée du droit.', 'A right to buy shares on agreed terms. The exercise price, deadline and any trigger determine the scope of the right.', 26, 'S07', 5],
];

/** @param {'fr' | 'en'} lang */
function glossary(lang) {
  const paths = new Set(['controle-export', 'utilisateur-final', 'dilution-du-capital']);
  return terms.map(([slug, fr, en, frDef, enDef, chapter, reference, document]) => ({
    slug, title: lang === 'fr' ? fr : en, definition: lang === 'fr' ? frDef : enDef,
    ...(paths.has(slug) ? { path: `${lang === 'fr' ? '/glossaire' : '/en/glossary'}/${slug}/` } : {}),
    sources: [{ chapter, reference, url: document === null
      ? 'https://www.sec.gov/Archives/edgar/data/1045810/000104581026000088/q3fy27cfocommentary.htm'
      : documents[document][2] }],
  }));
}

export const nvidiaVolumeTwoText = {
  fr: {
    subtitle: 'Le retour de Huang et les leviers de Washington',
    description: 'Le conseil rappelle Jensen Huang, Trump envisage une participation et les prêteurs suivent les licences. La suite de l’enquête l0g sur Nvidia.',
    introductionTitle: 'Les cinq jours qui ont changé la succession',
    introduction: [
      'Le 17 novembre, Harvey Jones écarte le retour de Jensen Huang devant les investisseurs de Nvidia. Cinq jours plus tard, le conseil le rétablit à l’unanimité. Les administrateurs expliquent qu’ils ont reçu l’avis de hauts responsables américains et s’en sont servis pour apprécier le risque de sécurité nationale. Donald Trump revendique son intervention. Il vient de montrer le poids qu’un président peut prendre dans une décision que le conseil doit assumer devant ses actionnaires. [B01] [B02] [B03] [B04]',
      'Au début de la série, Olivier Laurelli avait défendu une lecture précise de la crise. Trump pouvait y trouver une occasion de peser sur la succession et d’envisager une place pour l’État au capital de Nvidia. Le premier tome avait pris Intel et MP Materials comme précédents. Le 24 novembre, Trump dit au New York Post avoir pensé à une participation fédérale et ajoute qu’il est probablement encore temps. Le retour de Huang et cette déclaration donnent raison à cette lecture sur les deux points qu’elle soulevait. [B05] [B06] [B07]',
      'La question du pouvoir part de la salle du conseil et arrive jusque sur le bureau d’un prêteur. À quel client un centre de données peut-il vendre du calcul ? Qui paiera si ses machines restent sous-employées ? Les règles américaines sur l’accès distant suivent certaines utilisations à travers le cloud. Les licences de livraison obéissent à leur propre procédure. Un changement de clientèle autorisée peut donc modifier les recettes sur lesquelles une banque avait fondé son prêt. [B08] [B09]',
      'Les chapitres qui suivent reprennent l’enquête à partir du moment où Washington discute du successeur et où les clients cherchent toujours à faire financer leurs achats. Ils suivent les contrats jusqu’au stade que les pièces permettent de documenter. Anthropic annonce la clôture de son placement. Apollo et Goldman Sachs annoncent les conditions de l’émission destinée à financer des équipements de SpaceX. Même fournisseur au cœur de l’histoire, deux opérations à des étapes différentes. [B10] [B11]',
    ],
    conclusionTitle: 'Le retour de Huang et le prix d’une part de Nvidia',
    conclusion: [
      'Le conseil a pris une décision et il en a donné les raisons. La Maison-Blanche a apporté ses assurances. Trump revendique les démarches qu’il a menées. Aux administrateurs revient désormais une question pratique : à qui peuvent-ils demander des comptes, y compris quand le dirigeant qu’ils viennent de rétablir bénéficie du soutien du président ? La poursuite de l’enquête du comité indépendant donnera une première réponse sur l’autonomie de leur contrôle. [B01] [B02] [B04]',
      'Une participation fédérale prolongerait la question au-delà du mandat d’un patron. Dans le cas Intel, le Commerce a versé des fonds et reçu des actions. L’accord du Pentagone avec MP Materials lui donne des consentements sur des opérations définies. Le détenteur de titres et l’autorité qui délivre une licence peuvent alors relever de la même administration, avec des obligations très différentes. Un contrat Nvidia devrait expliquer qui engage l’argent, quels droits l’État reçoit et comment on contrôle leur exercice. L’entretien du 24 rend cette question concrète. Les modalités d’une opération restent à écrire. [B05] [B06] [B07]',
      'L’entretien soulève aussi la possibilité d’une grâce personnelle pour Huang. Trump pense qu’elle sera inutile. Le pouvoir de grâce concerne le pénal fédéral. La Californie a pris sa propre mesure d’enquête et les élus de la Chambre demandent les communications de l’exécutif avec le conseil. Le dossier du patrimoine déclaré du président obéit également à sa propre traçabilité. Chacun de ces éléments appelle les pièces de la personne ou de l’institution qui pouvait agir. [B05] [B12] [B13] [B14] [B16]',
      'Les puces de Nvidia font vivre des contrats de longue durée. Les sociétés qui les louent comptent sur leurs abonnés, les banques sur le paiement des loyers et Washington sur le respect de ses règles. Une même annonce peut rassurer un prêteur, inquiéter un client et déplacer le rapport de force au conseil. Pour mesurer le pouvoir que cette crise a donné à Trump, il faut partir des décisions qu’il a déjà influencées, puis lire les droits que Washington cherchera à inscrire dans les documents. [B02] [B08] [B11] [B15]',
    ],
    readerGuideTitle: 'Parcours de lecture',
    readerGuide: [
      'Ce tome reprend les volets XIII à XXVI de l’enquête Nvidia, publiés entre le 16 et le 25 novembre 2026. Les chapitres suivent l’ordre de publication. Le premier tome, Le système Nvidia, rassemble les volets I à XII.',
      'Les chapitres XIII à XVIII suivent la recherche d’un dirigeant, les intérêts de Cantor et les règles qui entrent au conseil de Nvidia. Les chapitres XIX à XXII reprennent les dossiers de crédit, de l’incertitude sur Aolani au placement d’Anthropic et au financement envisagé pour les puces de SpaceX.',
      'Les quatre derniers chapitres examinent le retour de Huang, le patrimoine déclaré de Trump, les mesures sur Megaspeed et la perspective d’une participation fédérale dans Nvidia.',
      'Les renvois numérotés ouvrent les notices de chaque chapitre. Les références B conduisent à la bibliographie de l’introduction et de la conclusion. Le glossaire et la table des figures peuvent se lire séparément.',
    ],
    methodTitle: 'Sources et méthode',
    method: [
      'Le corpus a été relevé le 25 novembre 2026 à 11 h 48, heure de Paris, à partir des pages françaises et anglaises servies par la même révision de l0g. La date éditoriale de chaque article reste visible. L’arrêté du volume figure au colophon.',
      'Les chapitres conservent le texte, les légendes et les notices déjà publiés. La mise en page et les renvois ont été adaptés à la lecture hors connexion. Les liens vers les documents extérieurs restent disponibles au retour d’une connexion.',
      'Les décisions d’un conseil, les conditions annoncées d’un financement et la réception des fonds correspondent à des actes différents. Les descriptions de conflits d’intérêts et les propos rapportés conservent leurs sources et leur attribution.',
      'Le hors-série sur le lobbying d’Anthropic constitue une lecture complémentaire en ligne. Les volets numérotés sur Anthropic et SpaceX sont inclus ici.',
    ],
    glossaryTitle: 'Glossaire',
    glossary: glossary('fr'),
    synthesisSourcesTitle: 'Sources de l’introduction et de la conclusion',
    synthesisSources: references('fr'),
    colophonTitle: 'Édition et crédits',
    colophon: [
      'Qui gouverne Nvidia ? Tome II de l’enquête publiée par Olivier Laurelli sur l0g.fr. Édition française du 25 novembre 2026. Introduction, conclusion et compléments préparés pour le livre.',
      'Textes et matériel éditorial sous licence Creative Commons Attribution 4.0 International, selon les conditions de l0g. Les documents cités restent soumis aux droits de leurs auteurs et de leurs éditeurs. La couverture est une illustration conceptuelle générée pour cette édition.',
      'Les polices et leurs licences sont incluses dans le livre. Aucun ISBN n’a été attribué à cette édition.',
    ],
  },
  en: {
    subtitle: 'Huang’s return and Washington’s leverage',
    description: 'Nvidia’s board brings Huang back, Trump considers a federal stake, and lenders follow the licensing decisions. The second volume of l0g’s investigation.',
    introductionTitle: 'Five days that changed the succession',
    introduction: [
      'On November 17, Harvey Jones told investors that Nvidia’s board did not intend to bring Jensen Huang back. Five days later, directors voted unanimously to reinstate him. They said they had received advice from senior US officials and relied on it in assessing the national security risk. Donald Trump took credit for intervening. A decision the board still had to defend to shareholders had become one in which the president could carry considerable weight. [B01] [B02] [B03] [B04]',
      'Early in the series, Olivier Laurelli argued that Trump could use the crisis to influence the succession and consider making the US government a Nvidia shareholder. The first volume drew on Intel and MP Materials to explain the prospect. On November 24, Trump told the New York Post he had thought about a federal stake and said it was probably still possible. Huang’s return and Trump’s remarks bear out both parts of that reading. [B05] [B06] [B07]',
      'The question of who has power leads from the boardroom to a lender’s desk. Who can buy the computing time a data center sells? Who will pay when its machines are underused? US remote-access rules follow some uses of advanced chips into the cloud. Shipment licenses follow their own process. A restriction on who can use a site may change the revenue a bank counted on when it financed the equipment. [B08] [B09]',
      'The chapters pick up when Washington was debating who should lead Nvidia and its customers still had machines to pay for. They follow deals as far as the record goes. Anthropic announced it had closed its private placement. Apollo and Goldman Sachs announced the pricing of securities for SpaceX equipment. Nvidia is central to both stories. The paperwork captures two different moments in a financing. [B10] [B11]',
    ],
    conclusionTitle: 'Huang’s return and the price of a stake in Nvidia',
    conclusion: [
      'The board made its decision and explained its reasons. The White House offered assurances. Trump took credit for his contacts. Directors now face a practical question about accountability when the executive they have restored has the president’s support. The independent committee’s continuing inquiry will be an early test of the board’s ability to exercise oversight. [B01] [B02] [B04]',
      'A federal stake would make this question outlast the succession. At Intel, Commerce put up money and received shares. The Pentagon’s contract with MP Materials gives it consent rights over specified decisions. The office exercising shareholder rights and the office granting export licenses can belong to the same administration while owing very different duties. A deal with Nvidia would need to specify who commits public money, which rights it buys and who can hold their holder to account. The November 24 interview makes the question immediate. A deal would have to supply the terms. [B05] [B06] [B07]',
      'In the same interview, Trump was asked about a pardon for Huang and said he thought it would be unnecessary. Presidential clemency applies to federal criminal matters. California has taken its own investigative step, and House lawmakers want the executive branch’s communications with the board. The president’s personal financial disclosures are a further set of records. Each leads to a different decision-maker and a different set of documents. [B05] [B12] [B13] [B14] [B16]',
      'Nvidia’s chips sit inside agreements that last for years. The operators leasing them need customers, banks need the rental payments and Washington wants its rules followed. A single announcement can reassure a lender, worry a customer and change the balance around the board table. The decisions Trump has already influenced show how far presidential power reached in this crisis. The rights Washington seeks on paper will show whether that influence lasts. [B02] [B08] [B11] [B15]',
    ],
    readerGuideTitle: 'Reading guide',
    readerGuide: [
      'This volume collects instalments XIII to XXVI of the Nvidia investigation, published from November 16 to November 25, 2026. The chapters follow publication order. The first volume, The Nvidia System, contains instalments I to XII.',
      'Chapters XIII to XVIII follow the search for a chief executive, Cantor’s interests and the arrival of national security oversight in Nvidia’s boardroom. Chapters XIX to XXII follow the credit side, from uncertainty over Aolani’s loan to the Anthropic placement and the proposed financing for SpaceX chips.',
      'The final four chapters cover Huang’s return, Trump’s financial disclosures, the measures affecting Megaspeed and the prospect of a federal stake.',
      'Numbered citations open the reference notices for each chapter. B references lead to sources for the introduction and conclusion. The glossary and list of figures can be used separately.',
    ],
    methodTitle: 'Sources and method',
    method: [
      'The French and English chapters were collected on November 25, 2026 at 11:48 Paris time, while the same revision of l0g served both languages. Each article retains its editorial date. The colophon records the volume’s cutoff.',
      'The chapters retain their published text, captions and reference notices. Layout and navigation have been adapted for offline reading. Links to external records remain available when readers go online.',
      'A board decision, a financing announcement and a receipt of funds describe different events. Accounts of conflicts of interest and reported remarks retain their attribution and sources.',
      'The separate investigation of Anthropic’s lobbying is available online as related reading. The numbered chapters on Anthropic and SpaceX are included here.',
    ],
    glossaryTitle: 'Glossary',
    glossary: glossary('en'),
    synthesisSourcesTitle: 'Sources for the introduction and conclusion',
    synthesisSources: references('en'),
    colophonTitle: 'Edition and credits',
    colophon: [
      'Who Governs Nvidia? Volume II of Olivier Laurelli’s investigation for l0g.fr. English edition of November 25, 2026. The introduction, conclusion and reading material were prepared for this book.',
      'The text and editorial material are licensed under Creative Commons Attribution 4.0 International, under l0g’s terms. Works cited remain subject to their authors’ and publishers’ rights. The cover is a generated conceptual illustration composed for this edition.',
      'Fonts and their licences are included in the book. No ISBN has been assigned to this edition.',
    ],
  },
};
