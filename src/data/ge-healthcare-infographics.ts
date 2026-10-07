// Controlled, audited repository SVG assets. No user-supplied markup.
import f18_clock_fr_desktop from '../../public/images/ge-healthcare/f18-clock-fr-desktop.svg?raw';
import f18_clock_fr_mobile from '../../public/images/ge-healthcare/f18-clock-fr-mobile.svg?raw';
import f18_clock_en_desktop from '../../public/images/ge-healthcare/f18-clock-en-desktop.svg?raw';
import f18_clock_en_mobile from '../../public/images/ge-healthcare/f18-clock-en-mobile.svg?raw';
import factory_clock_fr_desktop from '../../public/images/ge-healthcare/factory-clock-fr-desktop.svg?raw';
import factory_clock_fr_mobile from '../../public/images/ge-healthcare/factory-clock-fr-mobile.svg?raw';
import factory_clock_en_desktop from '../../public/images/ge-healthcare/factory-clock-en-desktop.svg?raw';
import factory_clock_en_mobile from '../../public/images/ge-healthcare/factory-clock-en-mobile.svg?raw';
import network_scale_fr_desktop from '../../public/images/ge-healthcare/network-scale-fr-desktop.svg?raw';
import network_scale_fr_mobile from '../../public/images/ge-healthcare/network-scale-fr-mobile.svg?raw';
import network_scale_en_desktop from '../../public/images/ge-healthcare/network-scale-en-desktop.svg?raw';
import network_scale_en_mobile from '../../public/images/ge-healthcare/network-scale-en-mobile.svg?raw';
import deal_anatomy_fr_desktop from '../../public/images/ge-healthcare/deal-anatomy-fr-desktop.svg?raw';
import deal_anatomy_fr_mobile from '../../public/images/ge-healthcare/deal-anatomy-fr-mobile.svg?raw';
import deal_anatomy_en_desktop from '../../public/images/ge-healthcare/deal-anatomy-en-desktop.svg?raw';
import deal_anatomy_en_mobile from '../../public/images/ge-healthcare/deal-anatomy-en-mobile.svg?raw';
import pdx_context_fr_desktop from '../../public/images/ge-healthcare/pdx-context-fr-desktop.svg?raw';
import pdx_context_fr_mobile from '../../public/images/ge-healthcare/pdx-context-fr-mobile.svg?raw';
import pdx_context_en_desktop from '../../public/images/ge-healthcare/pdx-context-en-desktop.svg?raw';
import pdx_context_en_mobile from '../../public/images/ge-healthcare/pdx-context-en-mobile.svg?raw';
import cms_gate_fr_desktop from '../../public/images/ge-healthcare/cms-gate-fr-desktop.svg?raw';
import cms_gate_fr_mobile from '../../public/images/ge-healthcare/cms-gate-fr-mobile.svg?raw';
import cms_gate_en_desktop from '../../public/images/ge-healthcare/cms-gate-en-desktop.svg?raw';
import cms_gate_en_mobile from '../../public/images/ge-healthcare/cms-gate-en-mobile.svg?raw';
import valuation_sensitivity_fr_desktop from '../../public/images/ge-healthcare/valuation-sensitivity-fr-desktop.svg?raw';
import valuation_sensitivity_fr_mobile from '../../public/images/ge-healthcare/valuation-sensitivity-fr-mobile.svg?raw';
import valuation_sensitivity_en_desktop from '../../public/images/ge-healthcare/valuation-sensitivity-en-desktop.svg?raw';
import valuation_sensitivity_en_mobile from '../../public/images/ge-healthcare/valuation-sensitivity-en-mobile.svg?raw';

export const geHealthcareInfographics = {
  'f18-clock': { number: '01', illustrative: false,
    fr: { desktop: f18_clock_fr_desktop, mobile: f18_clock_fr_mobile, title: "110 minutes qui raccourcissent le marché", caption: "La demi-vie transforme les minutes de transport en besoin de production supplémentaire." },
    en: { desktop: f18_clock_en_desktop, mobile: f18_clock_en_mobile, title: "The 110-minute clock shrinking the market", caption: "Half-life turns transport minutes into additional production requirements." },
  },
  'factory-clock': { number: '02', illustrative: false,
    fr: { desktop: factory_clock_fr_desktop, mobile: factory_clock_fr_mobile, title: "Une usine dont le stock se dégrade pendant la livraison", caption: "Le produit perd de l’activité pendant toute la chaîne industrielle et logistique." },
    en: { desktop: factory_clock_en_desktop, mobile: factory_clock_en_mobile, title: "A factory whose inventory decays during delivery", caption: "The product loses activity throughout the manufacturing and logistics chain." },
  },
  'network-scale': { number: '03', illustrative: false,
    fr: { desktop: network_scale_fr_desktop, mobile: network_scale_fr_mobile, title: "Le réseau grandit avant même l’approbation commerciale", caption: "L’extension industrielle et clinique ne recouvre pas les mêmes périmètres." },
    en: { desktop: network_scale_en_desktop, mobile: network_scale_en_mobile, title: "The network grows before commercial approval", caption: "Industrial and clinical expansion use different scopes." },
  },
  'deal-anatomy': { number: '04', illustrative: false,
    fr: { desktop: deal_anatomy_fr_desktop, mobile: deal_anatomy_fr_mobile, title: "Ce que GE HealthCare achète pour 945 M$", caption: "Le prix annoncé par GE agrège plusieurs actifs dont la ventilation n’a pas été communiquée." },
    en: { desktop: deal_anatomy_en_desktop, mobile: deal_anatomy_en_mobile, title: "What GE HealthCare is buying for $945M", caption: "GE’s announced price covers several assets whose allocation it has not disclosed." },
  },
  'pdx-context': { number: '05', illustrative: false,
    fr: { desktop: pdx_context_fr_desktop, mobile: pdx_context_fr_mobile, title: "Le deal tombe dans le moteur de croissance de GE HealthCare", caption: "PDx : contexte financier de l’acquéreur avant la clôture." },
    en: { desktop: pdx_context_en_desktop, mobile: pdx_context_en_mobile, title: "The deal lands inside GE HealthCare’s growth engine", caption: "PDx: the buyer’s financial context ahead of closing." },
  },
  'cms-gate': { number: '06', illustrative: false, sourceIds: ['S13'], metric: 'CMS-estimated daily HCPCS code cost (threshold)',
    fr: { desktop: cms_gate_fr_desktop, mobile: cms_gate_fr_mobile, title: "Aux États-Unis, le remboursement a changé de mécanique", caption: "Le seuil OPPS 2026 modifie le mode de paiement des agents diagnostiques coûteux." },
    en: { desktop: cms_gate_en_desktop, mobile: cms_gate_en_mobile, title: "U.S. reimbursement now has a different gate", caption: "The 2026 OPPS threshold changes how high-cost diagnostic agents are paid." },
  },
  'valuation-sensitivity': { number: '07', illustrative: true,
    fr: { desktop: valuation_sensitivity_fr_desktop, mobile: valuation_sensitivity_fr_mobile, title: "945 M$ : le multiple dépend du chiffre qu’on ne connaît pas", caption: "Sans comptes récents de SOFIE, tout multiple de transaction dépend d’un dénominateur hypothétique." },
    en: { desktop: valuation_sensitivity_en_desktop, mobile: valuation_sensitivity_en_mobile, title: "$945M: the multiple depends on the number we do not know", caption: "Without current SOFIE financials, any transaction multiple depends on a hypothetical denominator." },
  },
} as const;
export type GeHealthcareFigure = keyof typeof geHealthcareInfographics;
export type GeHealthcareLanguage = 'fr' | 'en';
