// Static documentary comparisons. Source IDs refer to the article bibliography.
const comparisons = [
  {
    "id": "beneficiaire",
    "title": {
      "fr": "Le bénéficiaire effectif entre dans la loi",
      "en": "Beneficial ownership enters the statute"
    },
    "scope": {
      "fr": "Article 119 bis : changement législatif",
      "en": "Article 119 bis: a statutory change"
    },
    "panels": [
      {
        "date": "08.12.2023",
        "label": {
          "fr": "Le texte alors applicable",
          "en": "The law then applicable"
        },
        "text": {
          "fr": "Le Conseil d’État refuse d’ajouter par doctrine une recherche générale du bénéficiaire effectif lorsque le titulaire du droit au dividende est résident français. Il réserve les fondements anti-abus.",
          "en": "The court rejects adding a general beneficial-owner look-through by guidance when the dividend entitlement belongs to a French resident. Anti-abuse routes are preserved."
        },
        "sources": [
          "S01"
        ]
      },
      {
        "date": "14.02.2025",
        "label": {
          "fr": "La loi est modifiée",
          "en": "Parliament changes the statute"
        },
        "text": {
          "fr": "L’article 96 inscrit expressément le bénéficiaire effectif dans l’article 119 bis. Identifier cette personne et qualifier un transfert de valeur restent deux questions distinctes.",
          "en": "Article 96 expressly inserts beneficial ownership into article 119 bis. Identifying that person and characterising a value transfer remain separate questions."
        },
        "sources": [
          "S04",
          "S03"
        ]
      }
    ],
    "limit": {
      "fr": "Le changement de loi ne requalifie pas automatiquement les opérations antérieures.",
      "en": "The legislative amendment does not automatically reclassify earlier transactions."
    }
  },
  {
    "id": "perimetre",
    "title": {
      "fr": "Le champ des transferts de valeur",
      "en": "The scope of value transfers"
    },
    "scope": {
      "fr": "Article 119 bis A : étendue du dispositif spécifique",
      "en": "Article 119 bis A: scope of the specific mechanism"
    },
    "panels": [
      {
        "date": {
          "fr": "AVANT 2025",
          "en": "BEFORE 2025"
        },
        "label": {
          "fr": "Moins de 45 jours",
          "en": "Fewer than 45 days"
        },
        "text": {
          "fr": "Dans la rédaction citée par le jugement de 2023, la période devait comprendre la date d’acquisition du droit au dividende. D’autres fondements de contrôle pouvaient rester mobilisables.",
          "en": "Under the version quoted in the 2023 judgment, the period had to include the date dividend entitlement arose. Other legal grounds for scrutiny could remain available."
        },
        "sources": [
          "S01"
        ]
      },
      {
        "date": "14.02.2025",
        "label": {
          "fr": "Combinaisons et instruments",
          "en": "Combinations and instruments"
        },
        "text": {
          "fr": "La réécriture supprime cette borne et vise notamment les instruments d’effet économique similaire à la possession des actions. Les conditions d’application et la sauvegarde demeurent nécessaires.",
          "en": "The rewritten provision removes that limit and covers instruments with an economic effect similar to share ownership. Statutory conditions and the safeguard still matter."
        },
        "sources": [
          "S04"
        ]
      }
    ],
    "limit": {
      "fr": "Une proximité avec le dividende ou un produit dérivé ne suffisent pas à établir un abus.",
      "en": "Dividend timing or the use of a derivative alone does not establish abuse."
    }
  },
  {
    "id": "marche",
    "title": {
      "fr": "Anonymat de marché et retenue",
      "en": "Market anonymity and withholding"
    },
    "scope": {
      "fr": "Trois textes de nature différente",
      "en": "Three documents with different legal functions"
    },
    "panels": [
      {
        "date": "28.11.2024",
        "label": {
          "fr": "Proposition gouvernementale rejetée",
          "en": "Rejected government proposal"
        },
        "text": {
          "fr": "I-2272 propose une exclusion sous conditions pour des opérations de marché lorsque la résidence ne peut être connue. Le Sénat indique que le sous-amendement est rejeté.",
          "en": "I-2272 proposes a conditional market exclusion where residence cannot be known. The Senate records the sub-amendment as rejected."
        },
        "sources": [
          "S02"
        ]
      },
      {
        "date": "27.01.2025",
        "label": {
          "fr": "Avis : lire les points 12 et 13 ensemble",
          "en": "Opinion: read paragraphs 12 and 13 together"
        },
        "text": {
          "fr": "Les limites d’information sont prises en compte. Les opérations négociées auparavant de gré à gré restent soumises à la retenue lorsque les conditions légales sont réunies.",
          "en": "Information limits are considered. Transactions negotiated beforehand over the counter remain subject to withholding where statutory conditions are met."
        },
        "sources": [
          "S03"
        ]
      },
      {
        "date": "17.04.2025",
        "label": {
          "fr": "Doctrine : ignorance effective",
          "en": "Guidance: actual lack of knowledge"
        },
        "text": {
          "fr": "Le paragraphe 4 décrit l’absence de retenue préventive lorsque le payeur ignore effectivement sa contrepartie. Il renvoie expressément aux deux points de l’avis.",
          "en": "Paragraph 4 describes the absence of preventive withholding when the payer actually does not know its counterparty. It expressly refers to both opinion paragraphs."
        },
        "sources": [
          "S05"
        ]
      }
    ],
    "limit": {
      "fr": "La comparaison établit des différences de rédaction, sans constituer une décision de légalité ni identifier l’auteur d’une influence.",
      "en": "The comparison establishes wording differences; it is neither a legality ruling nor proof of who influenced the drafting."
    }
  },
  {
    "id": "retrait",
    "title": {
      "fr": "Le retrait du paragraphe et la renumérotation",
      "en": "Withdrawal and paragraph renumbering"
    },
    "scope": {
      "fr": "Versions du même identifiant BOFiP",
      "en": "Versions under the same BOFiP identifier"
    },
    "panels": [
      {
        "date": "17.04.2025",
        "label": {
          "fr": "Ancien paragraphe 4",
          "en": "Former paragraph 4"
        },
        "text": {
          "fr": "Précision relative aux opérations conclues sur un marché réglementé.",
          "en": "Clarification concerning transactions on a regulated market."
        },
        "sources": [
          "S05"
        ]
      },
      {
        "date": "24.07.2025",
        "label": {
          "fr": "Suppression et renumérotation",
          "en": "Deletion and renumbering"
        },
        "text": {
          "fr": "La précision disparaît. Le nouveau paragraphe 4 concerne les exemptions des organismes de placement collectif et des fonds souverains ; le reste du rescrit subsiste.",
          "en": "The clarification disappears. New paragraph 4 concerns exemptions for investment undertakings and sovereign funds; the rest of the guidance remains."
        },
        "sources": [
          "S06"
        ]
      }
    ],
    "limit": {
      "fr": "Comparer le numéro seul ferait confondre deux objets. La version datée fait partie de la référence.",
      "en": "Matching paragraph numbers alone would conflate different subjects. The dated version is part of the reference."
    }
  },
  {
    "id": "garantie",
    "title": {
      "fr": "Opposabilité et abus de droit",
      "en": "Reliance on guidance and abuse of law"
    },
    "scope": {
      "fr": "Deux décisions, deux questions complémentaires",
      "en": "Two judgments addressing complementary questions"
    },
    "panels": [
      {
        "date": "20.01.2026",
        "label": {
          "fr": "Garantie de l’article L. 80 A",
          "en": "The article L. 80 A guarantee"
        },
        "text": {
          "fr": "Le contribuable peut, sous conditions, opposer la doctrine publiée au moment des opérations, même si elle est ensuite annulée. Le non-lieu ne tranche pas sa légalité au fond.",
          "en": "Subject to conditions, the taxpayer may rely on guidance published when the transactions occurred, even after later annulment. The mootness ruling does not decide substantive legality."
        },
        "sources": [
          "S07"
        ]
      },
      {
        "date": "28.10.2020",
        "label": {
          "fr": "Jurisprudence générale sur l’article L. 64",
          "en": "General case law on article L. 64"
        },
        "text": {
          "fr": "Des éléments objectifs établissant un montage artificiel dépourvu de substance et exclusivement fiscal peuvent permettre de combattre l’utilisation de la doctrine. Cette affaire était étrangère au cum-cum.",
          "en": "Objective proof of an artificial, substance-free arrangement with an exclusively tax-avoidance purpose can defeat reliance on guidance. This case was unrelated to cum-cum."
        },
        "sources": [
          "S08"
        ]
      }
    ],
    "limit": {
      "fr": "Il faut encore vérifier les faits et les conditions propres à chaque fondement ; cette fiche ne détermine aucune dette fiscale.",
      "en": "Facts and the conditions for each legal ground still require examination; this card determines no tax liability."
    }
  },
  {
    "id": "calendriers",
    "title": {
      "fr": "Dispositifs interne et externe : dates d’application",
      "en": "Effective dates of the internal and external mechanisms"
    },
    "scope": {
      "fr": "Entrée en vigueur et publication des commentaires",
      "en": "Effective dates and publication of guidance"
    },
    "panels": [
      {
        "date": "16.02.2025",
        "label": {
          "fr": "Dispositif interne, I de l’article 119 bis A",
          "en": "Internal mechanism, subsection I"
        },
        "text": {
          "fr": "Date du versement unique ou de l’accord sur la chose et le prix des opérations de transfert de valeur, selon les précisions administratives.",
          "en": "The relevant single payment or agreement on the subject matter and price of value-transfer transactions, as explained in the guidance."
        },
        "sources": [
          "S06"
        ]
      },
      {
        "date": "01.01.2026 / 16.03.2026",
        "label": {
          "fr": "Dispositif externe, II de l’article 119 bis A",
          "en": "External mechanism, subsection II"
        },
        "text": {
          "fr": "Application à compter du 1er janvier 2026 ; commentaires publiés le 16 mars 2026. Retenue puis restitution sous conditions dans certaines situations conventionnelles.",
          "en": "Effective from 1 January 2026; guidance published on 16 March 2026. Withholding followed by a conditional refund in specified treaty situations."
        },
        "sources": [
          "S04",
          "S10",
          "S11"
        ]
      }
    ],
    "limit": {
      "fr": "La controverse du paragraphe 4 d’avril 2025 portait sur le dispositif interne.",
      "en": "The dispute over April 2025 paragraph 4 concerned the internal mechanism."
    }
  }
];
export const CUMCUM05_COMPARISON_IDS = Object.freeze(comparisons.map(row => row.id));
export function cumCumDoctrineComparison(lang) {
  if (typeof lang !== 'string' || !['fr', 'en'].includes(lang)) throw new TypeError('Unexpected cum-cum comparison language');
  return comparisons.map(row => ({
    id: row.id, title: row.title[lang], scope: row.scope[lang], limit: row.limit[lang],
    panels: row.panels.map(panel => ({date: typeof panel.date === 'string' ? panel.date : panel.date[lang], label: panel.label[lang], text: panel.text[lang], sources: [...panel.sources]})),
  }));
}
