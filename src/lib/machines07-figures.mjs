export const MACHINES07_FIGURE_KINDS = Object.freeze(["hydro", "dependencies", "capacity", "threshold", "evidence"]);
export const MACHINES07_FIGURE_SOURCES = Object.freeze([["01", "02"], ["05", "08", "07"], ["09"], [], ["09", "11", "10", "13"]].map(x => Object.freeze(x)));
export const MACHINES07_MODEL = {
  "status": "entirely hypothetical",
  "observed": false,
  "sites": 6,
  "baseline_teams": 2,
  "alternative_teams": 3,
  "mobilisation_hours": 2,
  "job_hours": 4,
  "setup_eur": 30000,
  "upkeep_eur_per_year": 6000,
  "horizon_years": 5,
  "contribution_eur_per_site_hour": 2500,
  "incident_frequency": null,
  "assumptions": [
    "All six site functions unavailable from time zero",
    "All safety prerequisites satisfied before work starts",
    "Interchangeable teams and identical independent jobs",
    "Complete job includes validation",
    "No travel or handover delays",
    "Parts, configurations and trusted tools ready",
    "Equal site priority in illustration only",
    "No hazard, physical-damage or insurance model",
    "Permanently lost contribution; no later catch-up",
    "Constant illustrative EUR; no inflation, discounting or tax effects",
    "Zero residual value",
    "Incident-time costs identical between options; no differential term",
    "No replenishment or fatigue effect over repeated events"
  ],
  "limitations": [
    "Not a forecast, quote or staffing recommendation",
    "No target or equipment access",
    "Safety and essential-service priorities supersede the example order"
  ]
};
Object.freeze(MACHINES07_MODEL.assumptions);
Object.freeze(MACHINES07_MODEL.limitations);
Object.freeze(MACHINES07_MODEL);
export const MACHINES07_RESULTS = {
  "status": "wholly hypothetical; not a quotation, loss estimate, or attack forecast",
  "baseline_schedule": [
    {
      "site": 1,
      "team": 1,
      "start_hours": "2",
      "finish_hours": "6"
    },
    {
      "site": 2,
      "team": 2,
      "start_hours": "2",
      "finish_hours": "6"
    },
    {
      "site": 3,
      "team": 1,
      "start_hours": "6",
      "finish_hours": "10"
    },
    {
      "site": 4,
      "team": 2,
      "start_hours": "6",
      "finish_hours": "10"
    },
    {
      "site": 5,
      "team": 1,
      "start_hours": "10",
      "finish_hours": "14"
    },
    {
      "site": 6,
      "team": 2,
      "start_hours": "10",
      "finish_hours": "14"
    }
  ],
  "alternative_schedule": [
    {
      "site": 1,
      "team": 1,
      "start_hours": "2",
      "finish_hours": "6"
    },
    {
      "site": 2,
      "team": 2,
      "start_hours": "2",
      "finish_hours": "6"
    },
    {
      "site": 3,
      "team": 3,
      "start_hours": "2",
      "finish_hours": "6"
    },
    {
      "site": 4,
      "team": 1,
      "start_hours": "6",
      "finish_hours": "10"
    },
    {
      "site": 5,
      "team": 2,
      "start_hours": "6",
      "finish_hours": "10"
    },
    {
      "site": 6,
      "team": 3,
      "start_hours": "6",
      "finish_hours": "10"
    }
  ],
  "baseline_site_hours": "60",
  "alternative_site_hours": "48",
  "saved_site_hours": "12",
  "baseline_last_finish_hours": "14",
  "alternative_last_finish_hours": "10",
  "horizon_years": 5,
  "horizon_incremental_cost_eur": "60000",
  "benefit_per_specified_event_eur": "30000",
  "break_even_comparable_events": "2",
  "no_positive_benefit": false,
  "sensitivity": [
    {
      "contribution_eur_per_site_hour": "1000",
      "benefit_per_event_eur": "12000",
      "break_even_events": "5"
    },
    {
      "contribution_eur_per_site_hour": "2500",
      "benefit_per_event_eur": "30000",
      "break_even_events": "2"
    },
    {
      "contribution_eur_per_site_hour": "5000",
      "benefit_per_event_eur": "60000",
      "break_even_events": "1"
    }
  ]
};
for (const key of ['baseline_schedule', 'alternative_schedule', 'sensitivity']) { MACHINES07_RESULTS[key].forEach(Object.freeze); Object.freeze(MACHINES07_RESULTS[key]); }
Object.freeze(MACHINES07_RESULTS);
export const MACHINES07_HYDRO_SCOPE = {
  "date": "2019-03-26",
  "attribution": "Hydro company disclosure",
  "aggregate_units": [
    "Extrusion Europe",
    "Extrusion North America",
    "Precision Tubing"
  ],
  "aggregate_rate_percent": [
    70,
    80
  ],
  "other_states": {
    "Energy and Bauxite & Alumina": "normal",
    "Primary Metal and Rolled Products": "normal with increased manual operation",
    "Building Systems": "almost at a standstill"
  },
  "detailed_denominator": null,
  "avoided_losses": null
};
Object.freeze(MACHINES07_HYDRO_SCOPE.aggregate_units);
Object.freeze(MACHINES07_HYDRO_SCOPE.aggregate_rate_percent);
Object.freeze(MACHINES07_HYDRO_SCOPE.other_states);
Object.freeze(MACHINES07_HYDRO_SCOPE);
const metadata = {
  "hydro": {
    "fr": {
      "title": "Une reprise à plusieurs vitesses",
      "description": "Hydro, 26 mars 2019 : états d’activité déclarés une semaine après l’attaque. Le taux de 70–80 % concerne trois unités d’Extruded Solutions ; les autres états restent qualitatifs.",
      "method": "Source corporate datée du 26 mars 2019, recoupée avec l’annonce du 19 mars. Le taux agrégé de 70–80 % vise Extrusion Europe, Extrusion North America et Precision Tubing. La base détaillée du taux est absente. « Normal » et « presque à l’arrêt » sont les appréciations de l’entreprise ; aucun 100 % ou 0 % ne leur est imputé. Carte de situations, sans estimation de pertes évitées ni reconstitution d’architecture.",
      "sources": [
        "01",
        "02"
      ],
      "number": "01"
    },
    "en": {
      "title": "Recovery at different speeds",
      "description": "Hydro, 26 March 2019: reported operating conditions one week after the attack. The 70–80% rate covers three Extruded Solutions units; other states remain qualitative.",
      "method": "Company disclosures dated 26 and 19 March 2019. The aggregate 70–80% rate covers Extrusion Europe, Extrusion North America and Precision Tubing; its detailed denominator is not provided. “Normal” and “almost at a standstill” are company assessments; no 100% or 0% is imputed. A map of reported states, not an avoided-loss estimate or a reconstruction of internal architecture.",
      "sources": [
        "01",
        "02"
      ],
      "number": "01"
    }
  },
  "dependencies": {
    "fr": {
      "title": "Un secours exposé à une cause commune",
      "description": "Schéma hypothétique : deux équipements peuvent partager un même environnement d’administration. L’étude du secours doit suivre la dépendance commune, puis les ressources nécessaires à une reprise distincte.",
      "method": "Construction pédagogique issue des mécanismes décrits par le NIST et le NCSC. Aucun réseau réel, produit ou protocole d’exploitation n’est représenté. La branche de reprise est une liste de dépendances à prouver, pas une architecture certifiée. La séparation réelle, les fonctions conservées et les conditions de sûreté doivent être évaluées localement.",
      "sources": [
        "05",
        "08",
        "07"
      ],
      "number": "02"
    },
    "en": {
      "title": "Fallback exposed to a shared dependency",
      "description": "Hypothetical diagram: two devices can share one administrative environment. Fallback assessment must trace that dependency and the resources required for a separate recovery path.",
      "method": "Teaching diagram based on NIST and NCSC mechanisms. It depicts no real network, product or operating protocol. The recovery branch identifies dependencies to demonstrate, not a certified design. Actual separation, surviving functions and safety conditions require local assessment.",
      "sources": [
        "05",
        "08",
        "07"
      ],
      "number": "02"
    }
  },
  "capacity": {
    "fr": {
      "title": "Une équipe réduit la file d’attente",
      "description": "Cas entièrement fictif : six sites, mobilisation à deux heures, quatre heures par intervention complète. Deux équipes donnent 60 heures-sites d’arrêt ; trois équipes, 48.",
      "method": "Calcul l0g entièrement fictif : six fonctions de site indisponibles dès t = 0 ; mobilisation de 2 h ; intervention complète de 4 h, validation comprise. Sites identiques et de priorité égale, équipes interchangeables ; sûreté acquise avant travaux, pièces, configurations et outils fiables prêts ; aucun trajet, délai de relais ni goulot commun. Deux équipes : fins 6, 6, 10, 10, 14, 14 h, somme 60 heures-sites. Trois équipes : fins 6, 6, 6, 10, 10, 10 h, somme 48. Gain : 12 heures-sites ; premier rétablissement inchangé à 6 h, dernier avancé de 14 à 10 h. Les blocs montrent seulement le travail ; les totaux comprennent mobilisation et attente. ANSSI R76 motive la question multi-sites, sans fournir ces durées. La sûreté et la criticité priment sur cet ordre égalitaire fictif.",
      "sources": [
        "09"
      ],
      "number": "03"
    },
    "en": {
      "title": "One more team shortens the queue",
      "description": "Wholly hypothetical case: six sites, two-hour mobilisation, four hours per completed job. Two teams produce 60 site-hours of unavailability; three teams, 48.",
      "method": "Entirely fictional l0g calculation: six site functions unavailable from t = 0; two-hour mobilisation; four-hour complete jobs, including validation. Identical equal-priority sites and interchangeable teams; safety prerequisites met before work, parts, configurations and trusted tools ready; no travel, handover delays or shared bottleneck. Two-team finish times: 6, 6, 10, 10, 14, 14 h, totalling 60 site-hours. Three teams: 6, 6, 6, 10, 10, 10 h, totalling 48. Saving: 12 site-hours; first restoration unchanged at 6 h, final restoration advanced from 14 to 10 h. Blocks show work only; totals include mobilisation and waiting. ANSSI R76 motivates the multi-site question and supplies none of these durations. Safety and service criticality take priority over the fictional equal ordering.",
      "sources": [
        "09"
      ],
      "number": "03"
    }
  },
  "threshold": {
    "fr": {
      "title": "Un seuil, avec ses hypothèses",
      "description": "Le cas fictif relie un budget supplémentaire de 60 000 € sur cinq ans à douze heures-sites gagnées par événement. Avec 2 500 € de marge perdue par heure-site, l’équilibre exige deux événements comparables.",
      "method": "Toutes les valeurs sont fictives. Budget = 30 000 + 5 × 6 000 = 60 000 €. Bénéfice conditionnel = 12 heures-sites × marge contributive définitivement perdue par heure-site. Seuil = budget / bénéfice. Sensibilité : 1 000, 2 500 et 5 000 €/heure-site donnent respectivement 5, 2 et 1 événements comparables en cinq ans. Euros constants choisis pour le modèle ; aucune actualisation, fiscalité, valeur résiduelle ou fréquence probabilisée. Dépenses lors de l’incident supposées identiques entre options. Hors dommages physiques, assurance et effets sur des tiers. La sûreté est une contrainte préalable.",
      "sources": [],
      "number": "04"
    },
    "en": {
      "title": "A threshold with its assumptions",
      "description": "The hypothetical case links €60,000 of additional five-year cost to twelve site-hours saved per event. At €2,500 of lost contribution per site-hour, break-even requires two comparable events.",
      "method": "All values are fictional. Cost = 30,000 + 5 × 6,000 = €60,000. Conditional benefit = 12 site-hours × permanently lost contribution per site-hour. Threshold = cost / benefit. Sensitivity: €1,000, €2,500 and €5,000 per site-hour yield 5, 2 and 1 comparable events in five years. Constant euros assumed; no discounting, tax, residual value or estimated event probability. Incident-time expenses assumed identical between options. Physical damage, insurance and third-party effects excluded. Safety is a prerequisite.",
      "sources": [],
      "number": "04"
    }
  },
  "evidence": {
    "fr": {
      "title": "Acheter une capacité démontrable",
      "description": "Deux types de preuve se complètent : l’exercice sur table éprouve les décisions, l’essai technique autorisé mesure une reprise dans un périmètre donné. La capacité doit être réévaluée lorsque ses dépendances changent.",
      "method": "Schéma éditorial de gouvernance, inspiré des recommandations ANSSI et NCSC. L’exercice sur table ne démontre pas à lui seul une durée de restauration. Un essai technique exige une préparation adaptée au procédé, une autorisation compétente, des conditions de sûreté et une possibilité de retour. Le schéma ne prescrit aucune manipulation et ne définit aucun seuil technique. Les changements peuvent conduire à une analyse d’impact, puis à un essai ciblé si approprié.",
      "sources": [
        "09",
        "11",
        "10",
        "13"
      ],
      "number": "05"
    },
    "en": {
      "title": "Buy a capability you can demonstrate",
      "description": "Two kinds of evidence complement each other: a tabletop exercise tests decisions, while an authorised technical test measures recovery within a defined scope. Capability must be reassessed when its dependencies change.",
      "method": "Editorial governance diagram based on ANSSI and NCSC recommendations. A tabletop exercise does not by itself establish a restoration time. A technical test needs process-specific planning, competent authorisation, safety conditions and a rollback route. The diagram prescribes no intervention or technical threshold. Changes may require impact assessment, followed by a targeted test where appropriate.",
      "sources": [
        "09",
        "11",
        "10",
        "13"
      ],
      "number": "05"
    }
  }
};
export function machines07FigureMeta(lang, kind) {
 if (typeof lang !== 'string' || !['fr', 'en'].includes(lang) || typeof kind !== 'string' || !MACHINES07_FIGURE_KINDS.includes(kind)) throw new TypeError('Unknown machines07 figure variant');
 const index = MACHINES07_FIGURE_KINDS.indexOf(kind);
 return { caption: metadata[kind][lang].description, method: metadata[kind][lang].method, sources: MACHINES07_FIGURE_SOURCES[index], number: String(index + 1).padStart(2, '0') };
}
