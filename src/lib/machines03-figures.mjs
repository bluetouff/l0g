export const MACHINES03_FIGURE_KINDS = Object.freeze(['scope', 'tunnels', 'authority', 'lifecycle', 'isolation']);
export const MACHINES03_FIGURE_SOURCES = Object.freeze([["01", "03"], ["03", "05", "06"], ["07", "08", "09"], ["10", "13", "14", "16", "18"], ["02", "03", "17"]].map(x => Object.freeze(x)));
const metadata = {
  "scope": {
    "fr": {
      "title": "La mission et le réseau accessible",
      "description": "Le périmètre d’un dépannage peut viser une machine tandis que le réseau ouvert par défaut comprend les équipements joignables du sous-réseau. Un filtrage explicite resserre ce chemin.",
      "method": "Schéma conceptuel inspiré du comportement FlexEdge/Talk2m documenté par HMS le 20 mars 2026. Les trois pictogrammes représentent des catégories, sans compter des équipements observés. La seconde configuration illustre un périmètre volontairement restreint. La joignabilité réseau reste distincte des autorisations applicatives. Aucune architecture de victime ni exploitation de faille n’est représentée.",
      "sources": [
        "01",
        "03"
      ],
      "number": "01"
    },
    "en": {
      "title": "The assignment and the reachable network",
      "description": "A service assignment may target one machine while default network reach includes other reachable devices in the subnet. Explicit filtering narrows the route.",
      "method": "Conceptual diagram informed by HMS’s FlexEdge/Talk2m documentation of 20 March 2026. The three icons represent categories, not observed device counts. The second configuration illustrates deliberately restricted scope. Network reachability remains distinct from application permissions. No victim architecture or vulnerability exploitation is depicted.",
      "sources": [
        "01",
        "03"
      ],
      "number": "01"
    }
  },
  "tunnels": {
    "fr": {
      "title": "Une sortie peut ouvrir un aller-retour",
      "description": "Deux équipements rejoignent un intermédiaire. Après autorisation, la liaison transporte des échanges dans les deux sens, selon les permissions du service.",
      "method": "Représentation fonctionnelle d’un accès relayé. HMS documente l’établissement sortant ; NIST et NCSC décrivent les contrôles d’intermédiation. Les trajets ne constituent ni une configuration de produit ni une équivalence entre toutes les solutions VPN. Les flèches de création et d’utilisation représentent des fonctions différentes, sans durée ni débit.",
      "sources": [
        "03",
        "05",
        "06"
      ],
      "number": "02"
    },
    "en": {
      "title": "An outbound connection can carry two-way access",
      "description": "Two endpoints connect to an intermediary. Once authorised, the service carries exchanges in both directions, subject to its permissions.",
      "method": "Functional view of brokered access. HMS documents outbound establishment; NIST and NCSC describe intermediary controls. Routes are neither a product configuration nor a claim that VPN implementations are equivalent. Establishment and use are separate functions; arrows do not encode duration or throughput.",
      "sources": [
        "03",
        "05",
        "06"
      ],
      "number": "02"
    }
  },
  "authority": {
    "fr": {
      "title": "Le mandat traverse plusieurs entreprises",
      "description": "L’exploitant confie une mission ; le mainteneur et l’expert interviennent ; la plateforme applique les droits ; les preuves doivent revenir au client.",
      "method": "Organisation hypothétique construite pour interroger la chaîne contractuelle. Un fabricant peut être mainteneur ou intégrateur ; la plateforme peut être gérée par le client ou un fournisseur. Les rôles sont séparés pour montrer les décisions et les preuves à rapprocher. Le dessin ne représente aucun incident ni arrangement contractuel vérifié.",
      "sources": [
        "07",
        "08",
        "09"
      ],
      "number": "03"
    },
    "en": {
      "title": "Authority crosses organisational boundaries",
      "description": "The operator commissions work; a contractor and specialist intervene; the platform enforces permissions; evidence needs to return to the customer.",
      "method": "Hypothetical organisation for examining the contractual chain. A manufacturer may also maintain or integrate equipment; the platform may be managed by the customer or a supplier. Roles are separated to reveal decisions and evidence that need to be reconciled. This is not a verified contract or incident.",
      "sources": [
        "07",
        "08",
        "09"
      ],
      "number": "03"
    }
  },
  "lifecycle": {
    "fr": {
      "title": "Fermer le dossier, puis vérifier les accès",
      "description": "La clôture administrative, la fin d’une session et le devenir des identités humaines ou logicielles sont des états distincts, à documenter séparément.",
      "method": "Séquence logique sans échelle de temps. La fin d’une session est un état à confirmer. Les jetons API de comptes de service IXON sont documentés sans expiration automatique et peuvent subsister après suppression de leur créateur. Leur portée suit leurs permissions API ; les connexions protégées par Access Requests venant d’un compte de service sont automatiquement refusées. Ces jetons ne sont pas assimilés à un accès VPN universel ni à un droit de commande industrielle. Tout accès conservé demande une justification et un responsable.",
      "sources": [
        "10",
        "13",
        "14",
        "16",
        "18"
      ],
      "number": "04"
    },
    "en": {
      "title": "Close the job, then verify the access",
      "description": "Administrative closure, session termination and the fate of human or software identities are distinct states that need separate evidence.",
      "method": "Logical sequence without a time scale. Session termination is a state to confirm. IXON service-account API tokens are documented without automatic expiry and may outlive deletion of their creator. Their scope follows API permissions; connections protected by Access Requests from a service account are automatically rejected. These tokens are not equated with universal VPN access or industrial-control authority. Retained access needs a purpose and an owner.",
      "sources": [
        "10",
        "13",
        "14",
        "16",
        "18"
      ],
      "number": "04"
    }
  },
  "isolation": {
    "fr": {
      "title": "Retirer un accès, préserver les fonctions",
      "description": "Un scénario d’isolement ciblé sépare l’accès du mainteneur, les remontées d’informations indépendantes et le contrôle local. La continuité dépend des dépendances réelles.",
      "method": "Scénario conditionnel, inspiré des stratégies d’isolement du NCSC. La branche de données suppose une indépendance conçue et vérifiée, éventuellement des contrôles matériels ; le contrôle local suppose la disponibilité de toutes ses dépendances. Le passage sur site dépend du contrat et des compétences. Aucun geste de coupure ni comportement d’une installation particulière n’est prescrit.",
      "sources": [
        "02",
        "03",
        "17"
      ],
      "number": "05"
    },
    "en": {
      "title": "Remove an access path, preserve functions",
      "description": "A targeted-isolation scenario separates contractor access, independently designed telemetry and local control. Continuity depends on actual dependencies.",
      "method": "Conditional scenario informed by NCSC isolation strategies. The data branch assumes designed and verified independence, potentially hardware-enforced controls; local control assumes all its dependencies remain available. On-site support depends on contracts and skills. No disconnection step or behaviour of a particular installation is prescribed.",
      "sources": [
        "02",
        "03",
        "17"
      ],
      "number": "05"
    }
  }
};
export function machines03FigureMeta(lang, kind) {
  if (typeof lang !== 'string' || !['fr', 'en'].includes(lang) || typeof kind !== 'string' || !MACHINES03_FIGURE_KINDS.includes(kind)) throw new TypeError('Unknown machines03 figure variant');
  const index = MACHINES03_FIGURE_KINDS.indexOf(kind);
  return { caption: metadata[kind][lang].description, method: metadata[kind][lang].method, sources: MACHINES03_FIGURE_SOURCES[index], number: String(index + 1).padStart(2, '0') };
}
