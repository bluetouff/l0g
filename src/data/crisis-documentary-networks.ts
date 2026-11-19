import type { Network, NetworkLink, NetworkNode } from './crisis-networks';

type Slot = 'A' | 'B' | 'C' | 'D';
type Edge = keyof typeof paths;
type Copy = Network['note'];
const copy = (fr: string, en: string): Copy => ({ fr, en });

// Shared anchors keep the diagram and accessible actor buttons aligned in both layouts.
const anchors = {
  A: { x: 140, y: 77, mx: 90, my: 78 },
  B: { x: 500, y: 77, mx: 270, my: 78 },
  C: { x: 140, y: 281, mx: 90, my: 360 },
  D: { x: 500, y: 281, mx: 270, my: 360 },
};
const paths = {
  AB: { d: "M218 77H422", m: "M154 78H206", x: 320, y: 61, mx: 180, my: 60 },
  AC: { d: "M140 113V245", m: "M90 114V324", x: 104, y: 184, mx: 57, my: 218 },
  BD: { d: "M500 113V245", m: "M270 114V324", x: 550, y: 183, mx: 302, my: 217 },
  DA: { d: "M460 245Q290 235 150 113", m: "M246 324Q145 285 91 114", x: 315, y: 240, mx: 155, my: 278 },
  AD: { d: "M180 113Q350 120 490 245", m: "M114 114Q215 151 269 324", x: 330, y: 136, mx: 207, my: 170 },
  BC: { d: "M465 113L175 245", m: "M245 114L115 324", x: 299, y: 171, mx: 169, my: 197 },
  CB: { d: "M175 245L465 113", m: "M115 324L245 114", x: 300, y: 179, mx: 161, my: 207 },
  CD: { d: "M218 276Q320 230 422 276", m: "M154 358Q180 308 206 358", x: 320, y: 241, mx: 180, my: 318 },
  DC: { d: "M422 293Q320 345 218 293", m: "M206 377Q180 435 154 377", x: 320, y: 337, mx: 180, my: 430 },
};

function actor(slot: Slot, id: string, icon: NetworkNode['icon']): NetworkNode {
  return { id, icon, ...anchors[slot] };
}
function link(route: Edge, from: string, to: string, source: string, since: string,
  kind: NetworkLink['kind'], label: Copy, until?: string): NetworkLink {
  return { id: `${source}-${from}-${to}`, from, to, source, since, until, kind, label, ...paths[route] };
}

export const documentaryNetworks = {
  wti: {
    nodes: [
      actor("A", "clearing", "bank"),
      actor("B", "contract", "paper"),
      actor("C", "buyers", "people"),
      actor("D", "tanks", "factory"),
    ],
    links: [
      link("AB", "clearing", "contract", "W01", "2020-04-15", "commitment", copy("test", "test")),
      link("BC", "contract", "buyers", "W02", "2020-04-20", "pressure", copy("échéance", "expiry")),
      link("CD", "buyers", "tanks", "W03", "2020-04-20", "exposure", copy("stockage", "storage")),
    ],
    note: copy("Les flèches relient le contrat financier à la capacité de recevoir du brut.", "Arrows connect the futures contract to the ability to receive physical crude."),
    method: copy("La frise suit le contrat américain livrable en mai 2020. Le règlement quotidien du 20 avril et l’expiration du 21 avril sont deux événements distincts.", "The timeline follows the US contract for May 2020 delivery. Daily settlement on 20 April and expiry on 21 April are separate events."),
    related: { frHref: '/outils/replay-crises/nickel/', enHref: '/en/tools/crisis-replay/nickel/', label: copy("Nickel", "Nickel") },
  },
  archegos: {
    nodes: [
      actor("A", "family", "fund"),
      actor("B", "brokers", "bank"),
      actor("C", "equities", "paper"),
      actor("D", "nomura", "tower"),
    ],
    links: [
      link("AB", "family", "brokers", "H03", "2021-03-26", "exposure", copy("swaps", "swaps")),
      link("BC", "brokers", "equities", "H03", "2021-03-26", "pressure", copy("ventes", "sales")),
      link("CD", "equities", "nomura", "H01", "2021-03-29", "pressure", copy("perte", "loss")),
    ],
    note: copy("Plusieurs intermédiaires peuvent détenir les mêmes titres en couverture.", "Several dealers can hold the same shares as hedges."),
    method: copy("La première alerte de Nomura porte sur un client anonyme. Le rapport de mai permet de nommer Archegos et d’expliquer les swaps. Les résultats d’une banque ne mesurent qu’une partie des pertes.", "Nomura’s first notice concerns an unnamed client. The May report identifies Archegos and explains the swaps. Each bank’s results capture only part of the losses."),
    related: { frHref: '/outils/replay-crises/ltcm/', enHref: '/en/tools/crisis-replay/ltcm/', label: copy("LTCM", "LTCM") },
  },
  euro: {
    nodes: [
      actor("A", "ecb", "bank"),
      actor("B", "market", "paper"),
      actor("C", "banks", "tower"),
      actor("D", "states", "shield"),
    ],
    links: [
      link("AB", "ecb", "market", "Z01", "2010-05-10", "response", copy("SMP", "SMP"), "2012-09-06"),
      link("AC", "ecb", "banks", "Z02", "2011-12-08", "response", copy("prêts", "loans")),
      link("AB", "ecb", "market", "Z04", "2012-09-06", "commitment", copy("OMT", "OMT")),
      link("CD", "banks", "states", "Z05", "2010-05-10", "pressure", copy("appel à l’État", "rescue need")),
      link("DC", "states", "banks", "Z05", "2010-05-10", "exposure", copy("dette", "debt")),
    ],
    note: copy("Les prêts vont aux banques. Les achats de titres passent par le marché secondaire.", "Loans go to banks. Securities purchases take place in the secondary market."),
    method: copy("Les liens entre banques et États illustrent un risque selon les expositions nationales. La branche OMT indique la possibilité d’acheter sous conditions. Le discours de Londres précède la décision de septembre.", "Bank–sovereign links illustrate a risk that depended on national exposures. The OMT branch denotes conditional capacity to buy. The London speech precedes the September decision."),
    related: { frHref: '/outils/replay-crises/gilts/', enHref: '/en/tools/crisis-replay/gilts/', label: copy("Gilts / LDI", "Gilts / LDI") },
  },
  ftx: {
    nodes: [
      actor("A", "clients", "people"),
      actor("B", "ftx", "tower"),
      actor("C", "token", "paper"),
      actor("D", "alameda", "fund"),
    ],
    links: [
      link("AB", "clients", "ftx", "F05", "2022-11-02", "exposure", copy("dépôts", "deposits")),
      link("BC", "ftx", "token", "F01", "2022-11-02", "exposure", copy("émission", "issuance")),
      link("CD", "token", "alameda", "F01", "2022-11-02", "exposure", copy("avoirs", "holdings")),
      link("BD", "ftx", "alameda", "F05", "2022-11-02", "pressure", copy("fonds clients", "client funds")),
    ],
    note: copy("Le jeton FTT et les dépôts des clients suivent deux circuits distincts.", "FTT holdings and customer money follow separate routes."),
    method: copy("Le bilan partiel, le gel bahamien et la requête américaine ont chacun leur périmètre. Le circuit des dépôts s’appuie sur les preuves présentées au procès pénal. La frise date séparément les accusations civiles.", "The partial balance sheet, Bahamian freeze and US petition each have a distinct scope. The deposit route draws on evidence heard at criminal trial. The civil allegations are dated separately."),
    related: { frHref: '/outils/replay-crises/terra-luna/', enHref: '/en/tools/crisis-replay/terra-luna/', label: copy("Terra / Luna", "Terra / Luna") },
  },
  argentina: {
    nodes: [
      actor("A", "state", "shield"),
      actor("B", "banks", "bank"),
      actor("C", "holders", "people"),
      actor("D", "borrowers", "fund"),
    ],
    links: [
      link("AB", "state", "banks", "R02", "2001-12-03", "commitment", copy("décret", "decree")),
      link("BC", "banks", "holders", "R02", "2001-12-03", "pressure", copy("plafond", "cash cap")),
      link("AC", "state", "holders", "R05", "2002-02-04", "exposure", copy("dépôts", "deposits")),
      link("BD", "banks", "borrowers", "R05", "2002-02-04", "response", copy("prêts", "loans")),
    ],
    note: copy("Le plafond porte sur les espèces. Les taux de conversion de février portent sur les soldes bancaires.", "The withdrawal limit applies to cash. The February conversion terms apply to bank balances."),
    method: copy("La frise retient les dates de publication officielles pour les textes normatifs et la date du discours pour l’annonce sur la dette. Les taux de février sont des bases légales, avant indexation.", "The chronology uses official publication dates for legislation and the speech date for the debt announcement. February rates are statutory conversion terms before indexation."),
    related: { frHref: '/outils/replay-crises/franc-suisse/', enHref: '/en/tools/crisis-replay/swiss-franc/', label: copy("Franc suisse", "Swiss franc") },
  },
  cash2020: {
    nodes: [
      actor("A", "fed", "bank"),
      actor("B", "treasuries", "paper"),
      actor("C", "investors", "people"),
      actor("D", "official", "globe"),
    ],
    links: [
      link("AB", "fed", "treasuries", "D01", "2020-03-15", "response", copy("achats", "purchases")),
      link("CB", "investors", "treasuries", "D05", "2020-03-12", "pressure", copy("ventes", "sales")),
      link("AD", "fed", "official", "D02", "2020-03-19", "response", copy("swaps", "swaps")),
      link("DA", "official", "fed", "D04", "2020-03-31", "commitment", copy("repo FIMA", "FIMA repo")),
    ],
    note: copy("Achats fermes, swaps entre banques centrales et pensions FIMA ont des contreparties et des garanties différentes.", "Outright purchases, central bank swaps and FIMA repos have different counterparties and collateral arrangements."),
    method: copy("Les dates correspondent aux annonces, sans présumer du montant effectivement utilisé. La pension FIMA est annoncée le 31 mars pour une ouverture le 6 avril. Le tracé des ventes s’appuie sur le bilan publié en 2021.", "Dates refer to announcements and do not imply take-up. FIMA repo is announced on 31 March for a 6 April opening. The selling channel draws on the review published in 2021."),
    related: { frHref: '/outils/replay-crises/lehman/', enHref: '/en/tools/crisis-replay/lehman/', label: copy("Lehman", "Lehman") },
  },
} satisfies Record<string, Network>;
