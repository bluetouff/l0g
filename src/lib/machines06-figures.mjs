export const MACHINES06_FIGURE_KINDS = Object.freeze(["stock", "scope", "transition", "support", "deployment"]);
export const MACHINES06_FIGURE_SOURCES = Object.freeze([["01", "02"], ["02", "04", "06"], ["02", "03", "04", "05"], ["02"], ["02", "04", "07", "08"]].map(x => Object.freeze(x)));
export const MACHINES06_SUPPORT_EXAMPLE = Object.freeze({
  "status": "Illustration fictive l0g / fictional l0g illustration",
  "support_start": "2028-01",
  "support_end": "2036-01",
  "update_release": "2035-01",
  "minimum_years_available": 10,
  "update_available_until_at_least": "2045-01",
  "rule": "max(update release + 10 calendar years, support end)",
  "legal_reference": "CRA Article 13(9)",
  "financial_values": null
});
export const MACHINES06_FAQ_EXAMPLE = Object.freeze({
  "status": "non-binding Commission illustration",
  "version": "1.4",
  "version_date": "2026-09-04",
  "section": "4.5.3",
  "placement": "2028-01",
  "assumed_support_years": 5,
  "support_until": "2033-01",
  "later_remaining_stock_sale_possible": true,
  "installation_date": null
});
const metadata = {
  "stock": {
    "fr": {
      "title": "Neuf, avec une assistance déjà expirée",
      "description": "Le cas d’école de la Commission sépare la première mise sur le marché, la distribution et la période d’assistance.",
      "method": "Illustration administrative non contraignante, FAQ CRA v1.4 du 4 septembre 2026, §4.5.3 (pp.50–51) : unités mises sur le marché en janvier 2028, assistance jusqu’en janvier 2033, vente ultérieure possible du stock restant. Aucune vente ni durée industrielle observée. Cinq ans est la durée choisie dans cet exemple ; la durée appropriée doit être justifiée selon l’article 13(8). La date d’installation finale est inconnue. Espacements du parcours schématiques.",
      "sources": [
        "01",
        "02"
      ],
      "number": "01"
    },
    "en": {
      "title": "New stock, expired support",
      "description": "The Commission’s hypothetical example separates first placement, distribution and support.",
      "method": "Non-binding administrative illustration, CRA FAQ v1.4 dated 4 September 2026, §4.5.3 (pp.50–51): units placed in January 2028, support until January 2033, remaining stock may be supplied later. No observed sale or industrial support term. Five years is the example’s assumption; the appropriate period must be justified under article 13(8). Installation date unspecified. Process spacing schematic.",
      "sources": [
        "01",
        "02"
      ],
      "number": "01"
    }
  },
  "scope": {
    "fr": {
      "title": "Même chaîne physique, périmètres distincts",
      "description": "Le produit traverse des entreprises dont les activités et les obligations doivent être qualifiées séparément.",
      "method": "Schéma générique de chaîne alimentaire, sans entreprise identifiée. CRA : articles 2–3 et 13. NIS2 : articles 2–3 et 21, annexe II.4 ; lecture non cumulative des activités alimentaires par l’ANSSI. Les seuils, liens d’entreprise, autres activités et désignations nationales restent à vérifier. Les flèches décrivent des relations matérielles ou documentaires, sans valeur de décision d’assujettissement.",
      "sources": [
        "02",
        "04",
        "06"
      ],
      "number": "02"
    },
    "en": {
      "title": "One physical chain, different legal scopes",
      "description": "The product passes through businesses whose activities and obligations require separate assessment.",
      "method": "Generic food-chain diagram, no identified business. CRA articles 2–3 and 13; NIS2 articles 2–3 and 21, Annex II.4; ANSSI’s non-cumulative reading. Size, enterprise links, other activities and national identification require review. Arrows show physical or documentary relationships, not eligibility decisions.",
      "sources": [
        "02",
        "04",
        "06"
      ],
      "number": "02"
    }
  },
  "transition": {
    "fr": {
      "title": "Les étapes du CRA pour le parc existant",
      "description": "Les notifications concernent déjà les produits anciens couverts, alors que les autres exigences suivent la transition de décembre 2027.",
      "method": "CRA, articles 69(2)–(3) et 71. La date considérée est la première mise sur le marché de l’unité, non la seule date d’achat ou d’installation. Les conditions propres à l’article 14 restent nécessaires. Une modification substantielle se qualifie selon l’article 3(30) ; la responsabilité est examinée notamment sous les articles 21–22. France : état annoncé par l’ANSSI consulté au 3 novembre 2026. Frise et branchements schématiques.",
      "sources": [
        "02",
        "03",
        "04",
        "05"
      ],
      "number": "03"
    },
    "en": {
      "title": "CRA transition for installed products",
      "description": "Reporting already covers older in-scope products; other requirements follow the December 2027 transition.",
      "method": "CRA articles 69(2)–(3) and 71. The relevant date is the unit’s first placement, not purchase or installation alone. Article 14 triggers still apply. Substantial modification uses article 3(30); responsibility also requires review of articles 21–22. France: ANSSI status reviewed 3 November 2026. Timeline and branches schematic.",
      "sources": [
        "02",
        "03",
        "04",
        "05"
      ],
      "number": "03"
    }
  },
  "support": {
    "fr": {
      "title": "Un correctif accessible après l’assistance",
      "description": "Le traitement des vulnérabilités et la disponibilité d’un correctif déjà publié ont des échéances différentes.",
      "method": "Illustration l0g entièrement fictive. Assistance supposée janvier 2028–janvier 2036. Correctif publié janvier 2035. Article 13(9) : disponibilité au moins jusqu’au maximum entre janvier 2035 + 10 ans et janvier 2036, soit janvier 2045. Le choix de huit ans ne préjuge pas d’une durée conforme pour un produit réel. Axe temporel proportionnel ; aucune promesse de fabricant ni produit observé.",
      "sources": [
        "02"
      ],
      "number": "04"
    },
    "en": {
      "title": "Update availability after support ends",
      "description": "Vulnerability handling and availability of an already released update have different end dates.",
      "method": "Entirely fictional l0g illustration. Assumed support January 2028 to January 2036; update issued in January 2035. Article 13(9): availability at least until max(January 2035 + 10 calendar years, January 2036), giving January 2045. Eight years is a fictional assumption; support adequacy for a real product needs individual assessment. Time scale proportional; no actual manufacturer commitment.",
      "sources": [
        "02"
      ],
      "number": "04"
    }
  },
  "deployment": {
    "fr": {
      "title": "Du correctif à la continuité du procédé",
      "description": "La fourniture du fichier et son déploiement mobilisent des décisions, des travaux et des preuves distincts.",
      "method": "Organisation explicative proposée par l0g à partir de CRA annexe I II(8), NIS2 articles20–21 et ReCyF 2.5, p.14, 5.B.4–5.B.9. ReCyF est un document de travail : les périmètres EE/EI diffèrent selon les lignes. L’échéance de réévaluation est une proposition éditoriale, pas un délai légal uniforme. La branche d’atténuation exige une analyse qualifiée de sécurité et de continuité ; aucune commande ni manipulation n’est prescrite.",
      "sources": [
        "02",
        "04",
        "07",
        "08"
      ],
      "number": "05"
    },
    "en": {
      "title": "From security update to process continuity",
      "description": "Supplying an update and deploying it require different decisions, work and evidence.",
      "method": "l0g explanatory workflow based on CRA Annex I II(8), NIS2 articles 20–21 and ReCyF 2.5 p.14, 5.B.4–5.B.9. ReCyF is a working draft; EE/EI scope varies by provision. Review timing is an editorial proposal, not a uniform legal deadline. Mitigation requires qualified safety and continuity assessment; no equipment commands are prescribed.",
      "sources": [
        "02",
        "04",
        "07",
        "08"
      ],
      "number": "05"
    }
  }
};
export function machines06FigureMeta(lang, kind) {
  if (typeof lang !== 'string' || !['fr', 'en'].includes(lang) || typeof kind !== 'string' || !MACHINES06_FIGURE_KINDS.includes(kind)) throw new TypeError('Unknown machines06 figure variant');
  const index = MACHINES06_FIGURE_KINDS.indexOf(kind);
  return { caption: metadata[kind][lang].description, method: metadata[kind][lang].method, sources: MACHINES06_FIGURE_SOURCES[index], number: String(index + 1).padStart(2, '0') };
}
