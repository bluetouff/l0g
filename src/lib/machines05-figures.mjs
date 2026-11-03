export const MACHINES05_FIGURE_KINDS = Object.freeze(['lot', 'money', 'coverage', 'clocks', 'recovery']);
export const MACHINES05_FIGURE_SOURCES = Object.freeze([["02", "03", "15"], ["03", "04"], ["05", "06", "07"], ["09", "10", "11"], ["12", "13", "14"]].map(x => Object.freeze(x)));
export const MACHINES05_MODEL = {
  "synthetic": true,
  "unit": "EUR",
  "tax_basis": "excluding VAT",
  "period": "unspecified fictional interruption period",
  "opening_inventory_paid_before_period": 20000,
  "normal_sales_collected": 40000,
  "normal_other_variable_costs_paid": 10000,
  "incident_extra_expenses_consumed_and_paid": 5000,
  "replacement_inventory_paid_at_period_end": 20000,
  "normal_result_before_unchanged_fixed_costs": 10000,
  "incident_result_before_unchanged_fixed_costs": -25000,
  "economic_loss": 35000,
  "normal_period_net_cash_flow": 30000,
  "incident_period_net_cash_flow": -25000,
  "relative_cash_deterioration": 55000,
  "extra_closing_inventory_asset": 20000,
  "selected_recovery_disbursements_only": 25000,
  "assumptions": [
    "Opening inventory paid before the period.",
    "No incident sales or salvage.",
    "Replacement inventory still unsold at period-end.",
    "Fixed costs identical and omitted on both sides.",
    "No insurance, tax, interest, payment terms or other flows."
  ],
  "not_measured": [
    "Actual victim losses",
    "Peak borrowing",
    "Total funding requirement",
    "Insurance recoverability",
    "Food fitness"
  ]
};
Object.freeze(MACHINES05_MODEL.assumptions);
Object.freeze(MACHINES05_MODEL.not_measured);
Object.freeze(MACHINES05_MODEL);
const metadata = {
  "lot": {
    "fr": {
      "title": "Du lot au préjudice",
      "description": "Le dossier relie le devenir des produits, leur quantité et leur valeur. La décision sanitaire appartient aux personnes habilitées.",
      "method": "Organisation documentaire proposée par l0g, éclairée par les articles 14, 18 et 19 du règlement 178/2002, IAS 2 pour le seul repère IFRS et l’article 1353 du Code civil. Le diagramme ne fournit ni seuil sanitaire ni règle universelle d’indemnisation. Aucune donnée de victime.",
      "sources": [
        "02",
        "03",
        "15"
      ],
      "number": "01"
    },
    "en": {
      "title": "From batch to loss",
      "description": "The record connects product disposition, quantity and value. Food-safety decisions belong to authorised professionals.",
      "method": "An l0g documentary framework informed by Regulation 178/2002, articles 14, 18 and 19; IAS 2 solely as an IFRS reference; and French Civil Code article 1353. No food-safety threshold or universal settlement rule. No victim data.",
      "sources": [
        "02",
        "03",
        "15"
      ],
      "number": "01"
    }
  },
  "money": {
    "fr": {
      "title": "Comparer la perte et la trésorerie",
      "description": "Cas fictif : perte économique de 35 000 €, écart de trésorerie de 55 000 €, réconciliés par 20 000 € de stock final supplémentaire.",
      "method": "Calcul original l0g, entièrement fictif, en euros hors TVA, sur une période non spécifiée. Stock initial de 20 000 € payé avant la période. Sans incident : ventes encaissées 40 000 €, coûts variables 30 000 € dont ce stock et 10 000 € d’autres coûts ; stock final nul. Avec incident : ventes nulles, stock initial détruit, frais supplémentaires payés et consommés 5 000 €, stock neuf payé 20 000 € encore invendu. Charges fixes identiques omises. Hypothèses : aucune indemnité, créance, dette, récupération, TVA ou charge financière. L’écart de 55 000 € compare les flux de période ; les 25 000 € de reprise isolent deux décaissements. Découvert maximal et besoin total de financement restent inconnus. Le stock final supplémentaire de 20 000 € réconcilie l’écart de trésorerie avec la perte de 35 000 €.",
      "sources": [
        "03",
        "04"
      ],
      "number": "02"
    },
    "en": {
      "title": "Compare loss and cash flows",
      "description": "Fictional case: €35,000 economic loss and €55,000 relative cash deterioration, reconciled by €20,000 of extra closing inventory.",
      "method": "Original l0g model, entirely fictional, in EUR excluding VAT, over an unspecified period. Opening stock of €20,000 was paid before the period. Normal case: €40,000 collected sales and €30,000 variable costs, comprising that stock and €10,000 other costs; zero closing stock. Incident: no sales, opening stock destroyed, €5,000 extra expenses paid and consumed, and €20,000 replacement stock paid and still unsold. Identical fixed costs omitted. Assumptions exclude insurance, receivables, payables, salvage, VAT and finance charges. The €55,000 gap compares period cash flows; €25,000 isolates two recovery outflows. Peak borrowing and total funding needs remain unknown. Extra closing stock of €20,000 reconciles the cash gap with the €35,000 economic loss.",
      "sources": [
        "03",
        "04"
      ],
      "number": "02"
    }
  },
  "coverage": {
    "fr": {
      "title": "Lire la jonction des garanties",
      "description": "Une perte doit traverser les définitions, les exclusions et les avenants de la police effectivement souscrite.",
      "method": "Diagramme analytique, sans fréquence ni estimation de couverture. Les trois documents ont des statuts distincts : conditions générales historiques Hiscox de 2019, bulletin LMA de modèles illustratifs, description commerciale FM sur sa page britannique. Aucun contrat de victime n’est connu. Les lignes indiquent des questions à vérifier, pas des droits acquis.",
      "sources": [
        "05",
        "06",
        "07"
      ],
      "number": "03"
    },
    "en": {
      "title": "Where policy wordings meet",
      "description": "A loss must be tested against the definitions, exclusions and endorsements in the policy actually purchased.",
      "method": "Analytical diagram, not a coverage estimate. Three documents with distinct statuses: historical 2019 Hiscox general conditions, illustrative LMA models and FM’s UK commercial description. No victim policy is available. Connections indicate questions to verify, not established entitlements.",
      "sources": [
        "05",
        "06",
        "07"
      ],
      "number": "03"
    }
  },
  "clocks": {
    "fr": {
      "title": "Plainte, avis et règlement",
      "description": "En droit français, plainte et déclaration à l’assureur ont leurs propres conditions. Le règlement relève encore du contrat.",
      "method": "Droit français, textes consultés le 3 novembre 2026. Article L12-10-1 : champ professionnel et atteintes visées par le texte. L113-2 : avis dès connaissance du sinistre, au plus tard dans le délai du contrat ; minimum général de cinq jours ouvrés pour le délai stipulé, sauf exceptions légales dont vol et mortalité du bétail. L113-5 : prestation et délai convenus. Les flèches sont schématiques ; les points de départ ne sont pas supposés simultanés. Aucune date réelle ni échelle de temps commune.",
      "sources": [
        "09",
        "10",
        "11"
      ],
      "number": "04"
    },
    "en": {
      "title": "Complaint, notice and payment",
      "description": "Under French law, the complaint and insurance notice have separate conditions. Payment timing is also contractual.",
      "method": "French law reviewed on 3 November 2026. Article L12-10-1 applies within its professional and offence scope. L113-2: notice as soon as the claim event is known, no later than the contractual deadline; a general minimum of five working days for the stipulated period, subject to statutory exceptions including theft and livestock mortality. L113-5: agreed benefit and timing. Arrows are schematic; starting points are not assumed simultaneous. No actual dates or common time scale.",
      "sources": [
        "09",
        "10",
        "11"
      ],
      "number": "04"
    }
  },
  "recovery": {
    "fr": {
      "title": "Après le paiement, le recours",
      "description": "L’indemnité transfère une part de la charge. L’assureur peut ensuite exercer les droits repris contre le tiers responsable.",
      "method": "Schéma des relations en droit français, fondé notamment sur L121-12. Traits pleins : paiement si la garantie est due. Pointillés : recours conditionnel, dépendant de la responsabilité établie et du recouvrement. Aucun montant, délai, taux de succès ou tiers réel. La part non indemnisée doit être examinée séparément, sans double réparation d’une même perte.",
      "sources": [
        "12",
        "13",
        "14"
      ],
      "number": "05"
    },
    "en": {
      "title": "After payment, recovery",
      "description": "An insurance payment transfers part of the burden. The insurer may then exercise acquired rights against the responsible third party.",
      "method": "French-law relationship diagram, notably based on L121-12. Solid arrow: payment if coverage is due. Dashed arrows: conditional legal recovery, depending on established liability and collection. No amounts, durations, success rates or actual third party. Any uninsured loss requires separate assessment, without duplicate compensation.",
      "sources": [
        "12",
        "13",
        "14"
      ],
      "number": "05"
    }
  }
};
export function machines05FigureMeta(lang, kind) {
  if (typeof lang !== 'string' || !['fr', 'en'].includes(lang) || typeof kind !== 'string' || !MACHINES05_FIGURE_KINDS.includes(kind)) throw new TypeError('Unknown machines05 figure variant');
  const index = MACHINES05_FIGURE_KINDS.indexOf(kind);
  return { caption: metadata[kind][lang].description, method: metadata[kind][lang].method, sources: MACHINES05_FIGURE_SOURCES[index], number: String(index + 1).padStart(2, '0') };
}
