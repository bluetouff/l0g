export const COLD_CHAIN_FIGURE_KINDS = Object.freeze(['timeline','control','temperature','logging']);
export const COLD_CHAIN_FIGURE_SOURCES = Object.freeze([["02", "03", "04", "10"], ["02", "05", "06"], ["06", "11", "12", "13"], ["07"]].map(Object.freeze));
const figures = {
  "timeline": {
    "fr": {
      "caption": "Une chronologie, plusieurs niveaux de preuve",
      "method": "Les signalements et les révisions documentaires ont des dates distinctes. Les 21 jours entre le 12 octobre et le 2 novembre sont calculés en jours calendaires. L’espacement du dessin est éditorial, sans proportion temporelle. L’audition du 21 octobre concerne les compromissions alors examinées, tandis que le lien avec les incidents de novembre demeure ouvert.",
      "sources": [
        "02",
        "03",
        "04",
        "10"
      ],
      "number": "01"
    },
    "en": {
      "caption": "One timeline, different kinds of evidence",
      "method": "Reports and document revisions carry different dates. The 21 days from 12 October to 2 November are calendar days. Visual spacing is editorial, not a time scale. The 21 October testimony concerns the compromises examined at that point; a connection to the November incidents remains unproven.",
      "sources": [
        "02",
        "03",
        "04",
        "10"
      ],
      "number": "01"
    }
  },
  "control": {
    "fr": {
      "caption": "Du droit de commande à l’effet physique",
      "method": "Architecture explicative construite à partir des fonctions publiées par le fabricant et de l’alerte du CERT-FR. Le dessin suit un exemple de dégivrage électrique. Il distingue l’autorisation, la supervision, la régulation locale, l’effet thermique et le retour de mesure. Les protections, les liaisons et les réglages propres à chaque victime sont inconnus. La flèche de mesure ne démontre aucune indépendance du capteur ou du stockage des journaux.",
      "sources": [
        "02",
        "05",
        "06"
      ],
      "number": "02"
    },
    "en": {
      "caption": "From permission to physical effect",
      "method": "An explanatory architecture based on manufacturer capabilities and CERT-FR’s alert. The drawing follows an electric-defrost example and separates authorisation, supervision, local control, thermal effects and measurement feedback. Each victim’s protections, connections and settings are unknown. The measurement arrow makes no claim about sensor or log-storage independence.",
      "sources": [
        "02",
        "05",
        "06"
      ],
      "number": "02"
    }
  },
  "temperature": {
    "fr": {
      "caption": "Consigne, air et produit : trois objets de preuve",
      "method": "Le schéma oppose trois objets de preuve, sans valeur mesurée lors d’une attaque. La référence de −18 °C concerne les aliments surgelés au sens de la directive 89/108/CEE, avec les tolérances prévues par le texte. Le règlement 37/2005 porte sur la surveillance de l’air dans certains périmètres, avec des dérogations. Aucune durée de conservation ou décision de remise en vente n’est calculée.",
      "sources": [
        "06",
        "11",
        "12",
        "13"
      ],
      "number": "03"
    },
    "en": {
      "caption": "Setpoint, air and food: three objects of evidence",
      "method": "The diagram separates three objects of evidence, without depicting readings from an attack. The −18°C reference concerns quick-frozen foods under Directive 89/108/EEC, subject to its specified tolerances. Regulation 37/2005 addresses air monitoring in defined settings, with derogations. No storage time or decision to release goods for sale is calculated.",
      "sources": [
        "06",
        "11",
        "12",
        "13"
      ],
      "number": "03"
    }
  },
  "logging": {
    "fr": {
      "caption": "Quatre relevés peuvent devenir une seule moyenne horaire",
      "method": "Le manuel Danfoss BC337629891709en-001101, daté de juin 2026, décrit cette fonction en section 5.10, page imprimée 52. T1 à T4 sont des symboles, sans température inventée. La moyenne arithmétique est la somme divisée par quatre. Les intervalles dessinés séparent des observations successives ; aucun instant précis dans l’heure n’est attribué au logiciel. Le maximum et la durée d’un dépassement ne se déduisent pas d’une moyenne seule. L’utilisation de cette fonction chez les victimes est inconnue.",
      "sources": [
        "07"
      ],
      "number": "04"
    },
    "en": {
      "caption": "Four readings can become one hourly average",
      "method": "Danfoss manual BC337629891709en-001101, dated June 2026, describes this feature in section 5.10, printed page 52. T1 to T4 are symbols, not invented temperatures. Their arithmetic mean is their sum divided by four. The intervals separate successive samples; no exact position within the hour is attributed to the software. A mean alone cannot recover the maximum or time above a threshold. Use of this feature at victim sites is unknown.",
      "sources": [
        "07"
      ],
      "number": "04"
    }
  }
};
export function coldChainFigureMeta(lang, kind) {
  if (typeof lang !== 'string' || !['fr','en'].includes(lang) || typeof kind !== 'string' || !COLD_CHAIN_FIGURE_KINDS.includes(kind)) throw new TypeError('Unknown ColdChainFigure variant');
  const entry=figures[kind][lang]; return {...entry,sources:[...entry.sources]};
}
