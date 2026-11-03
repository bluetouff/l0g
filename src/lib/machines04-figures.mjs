export const MACHINES04_FIGURE_KINDS = Object.freeze(['effects', 'clocks', 'labels', 'attribution', 'recovery']);
export const MACHINES04_FIGURE_SOURCES = Object.freeze([["04", "05"], ["04", "05"], ["09", "08", "10"], ["11", "12", "13"], ["04", "05", "14"]].map(x => Object.freeze(x)));
export const MACHINES04_CLOCK_EXAMPLE = {
  "status": "entirely_synthetic",
  "day": "same unspecified illustrative day",
  "unit": "HH:MM UTC; offsets in minutes",
  "rule": "normalised = raw - known offset",
  "offset_assumption": "Offsets are independently established for this example, not inferred to fit the hypothesis.",
  "causal_limit": "Correct time ordering alone does not establish causation or actor identity.",
  "records": [
    {
      "record": "remote_session",
      "raw_utc": "02:03",
      "known_offset_minutes": 5,
      "normalised_utc": "01:58"
    },
    {
      "record": "setting_change",
      "raw_utc": "02:01",
      "known_offset_minutes": 0,
      "normalised_utc": "02:01"
    },
    {
      "record": "independent_measurement",
      "raw_utc": "02:04",
      "known_offset_minutes": 0,
      "normalised_utc": "02:04"
    }
  ]
};
for (const record of MACHINES04_CLOCK_EXAMPLE.records) Object.freeze(record);
Object.freeze(MACHINES04_CLOCK_EXAMPLE.records);
Object.freeze(MACHINES04_CLOCK_EXAMPLE);
const metadata = {
  "effects": {
    "fr": {
      "title": "Relier la commande au dommage",
      "description": "Trois familles de pièces documentent l’action numérique, l’effet physique et la conséquence pour l’activité. Les liens entre elles se vérifient dans chaque cas.",
      "method": "Schéma analytique l0g, fondé sur les exigences de reconstitution NIST et NCSC. Les trois étapes sont des catégories de preuve, sans volumes, températures, durées ni architecture de victime observés. La décision sur les produits requiert son propre dossier. Le dommage s’établit avec des mesures et un constat d’exploitation.",
      "sources": [
        "04",
        "05"
      ],
      "number": "01"
    },
    "en": {
      "title": "Connect the command to the damage",
      "description": "Three kinds of evidence document a digital action, a physical effect and an operational consequence. Their connections must be established in each case.",
      "method": "An l0g analytical diagram informed by NIST and NCSC reconstruction guidance. The stages are evidence categories, without observed volumes, temperatures, durations or victim architecture. Product disposition requires its own record. A logged setpoint alone does not measure damage.",
      "sources": [
        "04",
        "05"
      ],
      "number": "01"
    }
  },
  "clocks": {
    "fr": {
      "title": "Quand l’horloge change l’ordre",
      "description": "Une avance connue de cinq minutes place une session à 01 h 58 UTC, avant le changement de 02 h 01. L’exemple est entièrement fictif.",
      "method": "Trois systèmes fictifs, le même jour non spécifié. Les heures affichées sont distinguées de la référence UTC. Session : 02:03 affiché, avec une avance connue de +5 minutes, donne 01:58 UTC. Réglage : 02:01 ; mesure : 02:04, tous deux supposés synchronisés avec la référence. Les décalages sont supposés établis indépendamment, sans ajustement pour soutenir une hypothèse. Les positions indiquent un ordre et aucune durée. Les originaux restent conservés. Causalité et identité demandent des preuves distinctes.",
      "sources": [
        "04",
        "05"
      ],
      "number": "02"
    },
    "en": {
      "title": "When the clock changes the order",
      "description": "A known five-minute clock lead places a session at 01:58 UTC, before the 02:01 change. The example is entirely synthetic.",
      "method": "Three synthetic systems on the same unspecified day. Displayed times are distinguished from the UTC reference. Session: 02:03 displayed, with a known +5-minute lead, gives 01:58 UTC. Change: 02:01; measurement: 02:04, both assumed synchronised with the reference. Offsets are assumed independently established, without adjustment to support a hypothesis. Positions encode order and no elapsed duration. Originals are retained. Causation and identity require separate evidence.",
      "sources": [
        "04",
        "05"
      ],
      "number": "02"
    }
  },
  "labels": {
    "fr": {
      "title": "Trois sources, trois descriptions",
      "description": "Le nom Z-Pentest recouvre des formulations différentes dans trois publications officielles de décembre 2025. Chaque conclusion conserve son statut et son périmètre.",
      "method": "Comparaison textuelle du communiqué du DOJ du 9 décembre 2025, de l’avis AA25-343A du même jour (p.5) et de la note du DDIS du 18 décembre. Les panneaux reproduisent le sens des formulations, sans résoudre les relations organisationnelles. Les dates sont des dates de publication, pas les dates des attaques. Le DDIS y évalue la Russie comme responsable de l’attaque danoise de 2024, en nommant Z-Pentest et ses liens étatiques. La note publique expose la conclusion ; les pièces sous-jacentes en sont absentes. Aucune attribution des incidents frigorifiques de 2026 n’est dessinée.",
      "sources": [
        "09",
        "08",
        "10"
      ],
      "number": "03"
    },
    "en": {
      "title": "Three sources, three descriptions",
      "description": "Z-Pentest is described differently in three official December 2025 publications. Each conclusion retains its own status and scope.",
      "method": "Textual comparison of the DOJ announcement of 9 December 2025, the same-day AA25-343A advisory (p.5) and the DDIS note of 18 December. Panels paraphrase the descriptions without resolving organisational relationships. Dates are publication dates, not attack dates. DDIS assesses Russia as responsible for the 2024 Danish attack, naming Z-Pentest and its state links. The public note states the conclusion; the underlying evidence is absent. No attribution of the 2026 refrigeration incidents is shown.",
      "sources": [
        "09",
        "08",
        "10"
      ],
      "number": "03"
    }
  },
  "attribution": {
    "fr": {
      "title": "Les liens qu’il faut établir",
      "description": "Un incident, un ensemble d’activités, une personne et un commanditaire posent des questions distinctes. Les ponts entre eux exigent des recoupements.",
      "method": "Graphe pédagogique l0g inspiré du cadre CERT-EU et du CRS. Chaque relation est une proposition à étayer, pas un niveau de certitude acquis. Les tirets et les losanges indiquent des liens à examiner; les distances et tailles n’expriment ni force ni probabilité. Les types de preuve sont illustratifs et dépendent du cas.",
      "sources": [
        "11",
        "12",
        "13"
      ],
      "number": "04"
    },
    "en": {
      "title": "The connections evidence must establish",
      "description": "An incident, an activity cluster, an individual and a sponsor pose different questions. Connecting them requires corroboration.",
      "method": "An l0g explanatory graph informed by CERT-EU and CRS. Each relationship is a proposition requiring support, not an attained confidence level. Dashes and diamonds indicate connections to examine; size and distance encode neither strength nor probability. Evidence types are illustrative and case-dependent.",
      "sources": [
        "11",
        "12",
        "13"
      ],
      "number": "04"
    }
  },
  "recovery": {
    "fr": {
      "title": "Reprendre et enquêter en parallèle",
      "description": "La reprise opérationnelle, la conservation des preuves et l’attribution progressent selon leurs propres critères. Leur coordination protège la décision.",
      "method": "Reconstruction conceptuelle, sans calendrier ni durées mesurées. Les branches décrivent des besoins à coordonner sous la responsabilité des équipes compétentes. Les flèches ne constituent ni une procédure technique ni une consigne de coupure. Les validations sur les produits dépendent du dossier opérationnel et sanitaire applicable.",
      "sources": [
        "04",
        "05",
        "14"
      ],
      "number": "05"
    },
    "en": {
      "title": "Recover and investigate in parallel",
      "description": "Operational recovery, evidence preservation and attribution progress under their own criteria. Coordination supports sound decisions.",
      "method": "Conceptual reconstruction with no measured schedule or durations. The branches describe needs to coordinate under competent supervision. Arrows are neither a technical procedure nor disconnection instructions. Product decisions depend on the relevant operational and safety record.",
      "sources": [
        "04",
        "05",
        "14"
      ],
      "number": "05"
    }
  }
};
export function machines04FigureMeta(lang, kind) {
  if (typeof lang !== 'string' || !['fr', 'en'].includes(lang) || typeof kind !== 'string' || !MACHINES04_FIGURE_KINDS.includes(kind)) throw new TypeError('Unknown machines04 figure variant');
  const index = MACHINES04_FIGURE_KINDS.indexOf(kind);
  return { caption: metadata[kind][lang].description, method: metadata[kind][lang].method, sources: MACHINES04_FIGURE_SOURCES[index], number: String(index + 1).padStart(2, '0') };
}
