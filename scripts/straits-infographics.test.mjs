import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { XMLBuilder, XMLParser, XMLValidator } from 'fast-xml-parser';
import { parse } from 'parse5';
import { createProcessor } from '@mdx-js/mdx';
import opentype from '@shuding/opentype.js';
import postcss from 'postcss';
import { straitsSvg, STRAITS_KINDS } from '../src/lib/straitsFigures.mjs';
import { assertFontLicenseReferences } from './font-license-assertions.mjs';

const read = file => readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
const digest = value => createHash('sha256').update(value).digest('hex');
// Independent raw and complete browser-tree goldens derived from all 24 passive supplied XML exports.
const originals = {
  "stocks-fr-desktop": {
    "rawHash": "4968630315923ab71622775a1e017f65e267d18a319030136a82b4f674084376",
    "domHash": "28c3a004bc3910414e1a437afc387ac4518d65e26547e482cfb68e11131e20e8",
    "viewBox": "0 0 1100 710",
    "metadata": {
      "figure": 1,
      "language": "fr",
      "layout": "desktop",
      "as_of": "2026-10-16",
      "source_ids": [
        "S02"
      ],
      "creator": "l0g",
      "description": "Septembre 2026 : stocks à terre −113 millions de barils, pétrole en mer +103, total −10. Il s’agit de variations de stocks, non de niveaux. La hausse en mer accompagne la reprise des exportations du Golfe."
    }
  },
  "stocks-fr-mobile": {
    "rawHash": "24eb5365700294496ed182a495d07783ad928bcab84da113632e38dfbbac9b32",
    "domHash": "ed8a866b8f56e606250b374d54eef2239dc09aefb997468b0f022f8fdf8a26e0",
    "viewBox": "0 0 420 880",
    "metadata": {
      "figure": 1,
      "language": "fr",
      "layout": "mobile",
      "as_of": "2026-10-16",
      "source_ids": [
        "S02"
      ],
      "creator": "l0g",
      "description": "Septembre 2026 : stocks à terre −113 millions de barils, pétrole en mer +103, total −10. Il s’agit de variations de stocks, non de niveaux. La hausse en mer accompagne la reprise des exportations du Golfe."
    }
  },
  "routes-fr-desktop": {
    "rawHash": "738bbb113dbe55e72d7d5dbe2182030bfb307e20e6701d9de98e0efa0bd38d8a",
    "domHash": "d2be0d1d0b8582918866ab331183b1d510b9652e87a1c29ba6da72eac07731be",
    "viewBox": "0 0 1100 1020",
    "metadata": {
      "figure": 2,
      "language": "fr",
      "layout": "desktop",
      "as_of": "2026-10-16",
      "source_ids": [
        "S03",
        "S06",
        "S11"
      ],
      "creator": "l0g",
      "description": "Une route Asie-Europe peut contourner Bab el-Mandeb et Suez par le cap. Le Golfe rejoint l’océan Indien via Ormuz ; un oléoduc saoudien rejoint Yanbu sur la mer Rouge, avec accès à Suez au nord et Bab el-Mandeb au sud. Les traits ne représentent aucun volume."
    }
  },
  "routes-fr-mobile": {
    "rawHash": "528e687f131523649dd189e0a111a3ece9b8a194156ac78474da0f7392855ed5",
    "domHash": "694d7020e619071930a0cb1af3abf39ed672dcfbd4982a7c85c9cabe21bbd5bd",
    "viewBox": "0 0 420 1380",
    "metadata": {
      "figure": 2,
      "language": "fr",
      "layout": "mobile",
      "as_of": "2026-10-16",
      "source_ids": [
        "S03",
        "S06",
        "S11"
      ],
      "creator": "l0g",
      "description": "Une route Asie-Europe peut contourner Bab el-Mandeb et Suez par le cap. Le Golfe rejoint l’océan Indien via Ormuz ; un oléoduc saoudien rejoint Yanbu sur la mer Rouge, avec accès à Suez au nord et Bab el-Mandeb au sud. Les traits ne représentent aucun volume."
    }
  },
  "transport-fr-desktop": {
    "rawHash": "8a4318bda54a7eaaf873ca947a50f732a89cacae7715745604d42ef5e2bc73c6",
    "domHash": "4c7ecf94100d45c2c667ac7c2c5e6c40a3cad055892350c23d3fb2a24ce4ecd7",
    "viewBox": "0 0 1100 830",
    "metadata": {
      "figure": 3,
      "language": "fr",
      "layout": "desktop",
      "as_of": "2026-10-16",
      "source_ids": [
        "S04",
        "CALC-CYCLE"
      ],
      "creator": "l0g",
      "description": "Volumes de transit janvier-février 2024, base 100 par route en janvier-février 2023 : Suez 50, cap 174, Panama environ 68. Exemple séparé : un cycle de 70 à 84 jours réduit le débit de 16,7 % à flotte constante."
    }
  },
  "transport-fr-mobile": {
    "rawHash": "b3d2f373d6610ae80b5b37687589212ac2193f40adc1594b1c9f56079df29e6f",
    "domHash": "92f3b245cbdd5e4dc08930a574290273be93e0a82324da4cd9ef0f570e386d2f",
    "viewBox": "0 0 420 1110",
    "metadata": {
      "figure": 3,
      "language": "fr",
      "layout": "mobile",
      "as_of": "2026-10-16",
      "source_ids": [
        "S04",
        "CALC-CYCLE"
      ],
      "creator": "l0g",
      "description": "Volumes de transit janvier-février 2024, base 100 par route en janvier-février 2023 : Suez 50, cap 174, Panama environ 68. Exemple séparé : un cycle de 70 à 84 jours réduit le débit de 16,7 % à flotte constante."
    }
  },
  "inventory-fr-desktop": {
    "rawHash": "4d033f82e9a1d4d7c0d4fb21a8edaf4199cfe1792d9f0305557f92474334cb5f",
    "domHash": "b81fa0b50a95aed15d075c02d276c1e7fd76e696f92e147345b3a6a84d323fc5",
    "viewBox": "0 0 1100 900",
    "metadata": {
      "figure": 4,
      "language": "fr",
      "layout": "desktop",
      "as_of": "2026-10-16",
      "source_ids": [
        "CALC-STOCK"
      ],
      "creator": "l0g",
      "description": "Modèle fictif continu : stock de 1 200, consommation 100 par jour, livraisons 60. Retour des livraisons à 100 au jour 20 : stock restant 400. Retour au jour 35 : stock épuisé au jour 30 et 200 unités de production non réalisées, sans rattrapage."
    }
  },
  "inventory-fr-mobile": {
    "rawHash": "0a79766f32ee68241b6d08eea5273db8dd63a2c532c5e113cb232919835bb68b",
    "domHash": "c68d43018207f6f7d6c65986210fb208101762af67243326b913e7585bd2cc98",
    "viewBox": "0 0 420 1100",
    "metadata": {
      "figure": 4,
      "language": "fr",
      "layout": "mobile",
      "as_of": "2026-10-16",
      "source_ids": [
        "CALC-STOCK"
      ],
      "creator": "l0g",
      "description": "Modèle fictif continu : stock de 1 200, consommation 100 par jour, livraisons 60. Retour des livraisons à 100 au jour 20 : stock restant 400. Retour au jour 35 : stock épuisé au jour 30 et 200 unités de production non réalisées, sans rattrapage."
    }
  },
  "financing-fr-desktop": {
    "rawHash": "29d6753d15428d615f45dc84df2b0d30de0d293cbf0ea3481f93b29b43229626",
    "domHash": "1244d9985913188cca7321cff9a4543baa6de347dbaf12d7f72f9ea6fa65fec8",
    "viewBox": "0 0 1100 860",
    "metadata": {
      "figure": 5,
      "language": "fr",
      "layout": "desktop",
      "as_of": "2026-10-16",
      "source_ids": [
        "S14",
        "CALC-CASH"
      ],
      "creator": "l0g",
      "description": "Un importateur qui paie au départ 50 000 euros de biens par jour immobilise 700 000 euros supplémentaires si le transit augmente durablement de 14 jours. Au taux fictif de 8 %, financer cet encours un an coûte 56 000 euros hors frais. Le capital est adossé aux marchandises, ce n’est pas une perte de 700 000 euros."
    }
  },
  "financing-fr-mobile": {
    "rawHash": "47ccf9ae849f41a92a4b02169e29f52d47b3873eec26b5e599f84ff6a8e46f04",
    "domHash": "3d98594464a2c4c427b75bd60b2a87ea61a04d7a8a5f26b9542ea158b854e84f",
    "viewBox": "0 0 420 1170",
    "metadata": {
      "figure": 5,
      "language": "fr",
      "layout": "mobile",
      "as_of": "2026-10-16",
      "source_ids": [
        "S14",
        "CALC-CASH"
      ],
      "creator": "l0g",
      "description": "Un importateur qui paie au départ 50 000 euros de biens par jour immobilise 700 000 euros supplémentaires si le transit augmente durablement de 14 jours. Au taux fictif de 8 %, financer cet encours un an coûte 56 000 euros hors frais. Le capital est adossé aux marchandises, ce n’est pas une perte de 700 000 euros."
    }
  },
  "liquidity-fr-desktop": {
    "rawHash": "a3a9ddd37d58bd21b2b1f677a4ff1c09ccfc4230b22e2b1decc5c58d986792ed",
    "domHash": "294729568f914466a041abcb720fd4ad37e40f6cfc4f9b91ae5847af75655aa9",
    "viewBox": "0 0 1100 1010",
    "metadata": {
      "figure": 6,
      "language": "fr",
      "layout": "desktop",
      "as_of": "2026-10-16",
      "source_ids": [
        "S01",
        "S14",
        "S15"
      ],
      "creator": "l0g",
      "description": "Les retards mobilisent les stocks et allongent le financement. Si le stock et le crédit sont disponibles, ils protègent la cadence au prix d’une réserve ou marge réduite. Si les limites sont atteintes, achats et production peuvent baisser. Des délais de paiement prolongés déplacent la contrainte vers les fournisseurs."
    }
  },
  "liquidity-fr-mobile": {
    "rawHash": "358525922032d23d1e246706916c8559e12514ab5af8029df604e7775dc9515c",
    "domHash": "3e7703b6d1dc886717b6f16cc451c7482b0fbf1bd9b0d58601fba8791749dac7",
    "viewBox": "0 0 420 1250",
    "metadata": {
      "figure": 6,
      "language": "fr",
      "layout": "mobile",
      "as_of": "2026-10-16",
      "source_ids": [
        "S01",
        "S14",
        "S15"
      ],
      "creator": "l0g",
      "description": "Les retards mobilisent les stocks et allongent le financement. Si le stock et le crédit sont disponibles, ils protègent la cadence au prix d’une réserve ou marge réduite. Si les limites sont atteintes, achats et production peuvent baisser. Des délais de paiement prolongés déplacent la contrainte vers les fournisseurs."
    }
  },
  "stocks-en-desktop": {
    "rawHash": "f3c3a33c2971f60f547cf67f15c1dc7002dd7cf75bc42e1776ed12431d1e9009",
    "domHash": "45514d0686fd42e3c3edf79197d24a8e38ee0cd1e861aab549b88c41c5280d31",
    "viewBox": "0 0 1100 710",
    "metadata": {
      "figure": 1,
      "language": "en",
      "layout": "desktop",
      "as_of": "2026-10-16",
      "source_ids": [
        "S02"
      ],
      "creator": "l0g",
      "description": "September 2026: on-land stocks −113 million barrels, oil on water +103, total −10. These are inventory changes, not levels. Oil on water rose alongside recovering Gulf exports."
    }
  },
  "stocks-en-mobile": {
    "rawHash": "5917a8d9dfa54e63c0cf65a4181bb58bdd63b41bd920f08b694415ec3fec9de1",
    "domHash": "9f782da1fb90667e642bb7f87ed1dc11979802f9ba8c2f47c3e994bca802209b",
    "viewBox": "0 0 420 880",
    "metadata": {
      "figure": 1,
      "language": "en",
      "layout": "mobile",
      "as_of": "2026-10-16",
      "source_ids": [
        "S02"
      ],
      "creator": "l0g",
      "description": "September 2026: on-land stocks −113 million barrels, oil on water +103, total −10. These are inventory changes, not levels. Oil on water rose alongside recovering Gulf exports."
    }
  },
  "routes-en-desktop": {
    "rawHash": "5a93426eea3efab874dc8733057da04627fe065c8354b468b9b30a973d93f006",
    "domHash": "473d9cedc0b3600457439c33b1fd851f7967ffb65fe8a2ae5299aab90bb24b7b",
    "viewBox": "0 0 1100 1020",
    "metadata": {
      "figure": 2,
      "language": "en",
      "layout": "desktop",
      "as_of": "2026-10-16",
      "source_ids": [
        "S03",
        "S06",
        "S11"
      ],
      "creator": "l0g",
      "description": "An Asia-Europe route can bypass Bab el-Mandeb and Suez via the Cape. The Gulf reaches the Indian Ocean through Hormuz. A Saudi pipeline reaches Yanbu on the Red Sea, north of Bab el-Mandeb and south of Suez. Line widths do not encode volume."
    }
  },
  "routes-en-mobile": {
    "rawHash": "0e4c34a68b45e67cb533c871eca9f7b59eb4888551bf2ba04e89b1878e648920",
    "domHash": "7ad8d151663502e5001d86bf0ba751ff73a8f4cfe1fa3612e497088fc929dbf3",
    "viewBox": "0 0 420 1380",
    "metadata": {
      "figure": 2,
      "language": "en",
      "layout": "mobile",
      "as_of": "2026-10-16",
      "source_ids": [
        "S03",
        "S06",
        "S11"
      ],
      "creator": "l0g",
      "description": "An Asia-Europe route can bypass Bab el-Mandeb and Suez via the Cape. The Gulf reaches the Indian Ocean through Hormuz. A Saudi pipeline reaches Yanbu on the Red Sea, north of Bab el-Mandeb and south of Suez. Line widths do not encode volume."
    }
  },
  "transport-en-desktop": {
    "rawHash": "9fd5bb20e6b58ce0d7502bacac4857de706faef4b992ca755c4764849ba72ad5",
    "domHash": "626f3a56e95f09ce2bf9da26d073603cfbb273ff851d02a9318495d7a95cdc2e",
    "viewBox": "0 0 1100 830",
    "metadata": {
      "figure": 3,
      "language": "en",
      "layout": "desktop",
      "as_of": "2026-10-16",
      "source_ids": [
        "S04",
        "CALC-CYCLE"
      ],
      "creator": "l0g",
      "description": "Transit volumes in January-February 2024, each route indexed to 100 in January-February 2023: Suez 50, Cape 174, Panama approximately 68. Separate example: lengthening a 70-day cycle to 84 days cuts throughput 16.7% with the same fleet."
    }
  },
  "transport-en-mobile": {
    "rawHash": "33a4bb55d867a5d4861dead4a44065423186fe7b8cf6349f9eb69175e90fbc6c",
    "domHash": "f873a0da07db894349495223bbfd8eeed643630baa5d01d8ad9c5541dde35688",
    "viewBox": "0 0 420 1110",
    "metadata": {
      "figure": 3,
      "language": "en",
      "layout": "mobile",
      "as_of": "2026-10-16",
      "source_ids": [
        "S04",
        "CALC-CYCLE"
      ],
      "creator": "l0g",
      "description": "Transit volumes in January-February 2024, each route indexed to 100 in January-February 2023: Suez 50, Cape 174, Panama approximately 68. Separate example: lengthening a 70-day cycle to 84 days cuts throughput 16.7% with the same fleet."
    }
  },
  "inventory-en-desktop": {
    "rawHash": "7e837dfce413daa8ce987837f264952670bb3151d3659919672372215fdd5590",
    "domHash": "1506de1729e0d31b3ad0c13275091a5842e5066816cd0e1c5cdcbef9eea00bc2",
    "viewBox": "0 0 1100 900",
    "metadata": {
      "figure": 4,
      "language": "en",
      "layout": "desktop",
      "as_of": "2026-10-16",
      "source_ids": [
        "CALC-STOCK"
      ],
      "creator": "l0g",
      "description": "Illustrative continuous model: stock 1,200, requirement 100/day, arrivals 60. Recovery to 100 at day 20 leaves 400 units. Recovery at day 35 exhausts stock at day 30 and causes 200 units of lost output, with no catch-up."
    }
  },
  "inventory-en-mobile": {
    "rawHash": "0f7636aceecdf8dc7eeab1d7fbaa7b1ba3e04c45a4f87aa9a3f19e09be803f9f",
    "domHash": "7a65e47996751b0b926c652ba16bd90b5162af29850b749481876d6e4ce30a2b",
    "viewBox": "0 0 420 1100",
    "metadata": {
      "figure": 4,
      "language": "en",
      "layout": "mobile",
      "as_of": "2026-10-16",
      "source_ids": [
        "CALC-STOCK"
      ],
      "creator": "l0g",
      "description": "Illustrative continuous model: stock 1,200, requirement 100/day, arrivals 60. Recovery to 100 at day 20 leaves 400 units. Recovery at day 35 exhausts stock at day 30 and causes 200 units of lost output, with no catch-up."
    }
  },
  "financing-en-desktop": {
    "rawHash": "baa82161eb23f0eb1bb446f04f9ead57280ee106b6f60aab71a59a7870b93b5b",
    "domHash": "e5f19829c6e84233fbee7d2dd60bf0a6d4a162b3b469256fc28cc663bcf491e1",
    "viewBox": "0 0 1100 860",
    "metadata": {
      "figure": 5,
      "language": "en",
      "layout": "desktop",
      "as_of": "2026-10-16",
      "source_ids": [
        "S14",
        "CALC-CASH"
      ],
      "creator": "l0g",
      "description": "An importer paying €50,000 per day at departure ties up an additional €700,000 when transit permanently lengthens by 14 days. Financing that amount for a year at an illustrative 8% costs €56,000 before fees. The capital is backed by goods, not a €700,000 loss."
    }
  },
  "financing-en-mobile": {
    "rawHash": "5891067be150aaa0d3b6cccd0266cbe61be71302dfa517d8655ad1853cfcbcfc",
    "domHash": "513c2b4825d4ef12c176918d13a7a416bd904bb417907e39baef9ce4bff90ffc",
    "viewBox": "0 0 420 1170",
    "metadata": {
      "figure": 5,
      "language": "en",
      "layout": "mobile",
      "as_of": "2026-10-16",
      "source_ids": [
        "S14",
        "CALC-CASH"
      ],
      "creator": "l0g",
      "description": "An importer paying €50,000 per day at departure ties up an additional €700,000 when transit permanently lengthens by 14 days. Financing that amount for a year at an illustrative 8% costs €56,000 before fees. The capital is backed by goods, not a €700,000 loss."
    }
  },
  "liquidity-en-desktop": {
    "rawHash": "0799b6436903b89e3d9279c6c2b723bd8e4c6e2a59b0a37063b0f996c2362e93",
    "domHash": "bb7cc010fb6e1ff3a21efccab3b986dcbbe7e44cb3cb7f06bdf2624f6842cd2e",
    "viewBox": "0 0 1100 1010",
    "metadata": {
      "figure": 6,
      "language": "en",
      "layout": "desktop",
      "as_of": "2026-10-16",
      "source_ids": [
        "S01",
        "S14",
        "S15"
      ],
      "creator": "l0g",
      "description": "Delays draw down stocks and lengthen financing needs. Available inventory and credit protect output while reducing buffers or margins. When limits are reached, purchases and production may fall. Longer payment terms can shift the constraint to suppliers."
    }
  },
  "liquidity-en-mobile": {
    "rawHash": "706613485e0a2c52e842358831ac711451aab4459838924d28b23352c8f6f685",
    "domHash": "29e1e1956535670337a11201340ca30a486df46e83438609562ade8ca5ec8ba8",
    "viewBox": "0 0 420 1250",
    "metadata": {
      "figure": 6,
      "language": "en",
      "layout": "mobile",
      "as_of": "2026-10-16",
      "source_ids": [
        "S01",
        "S14",
        "S15"
      ],
      "creator": "l0g",
      "description": "Delays draw down stocks and lengthen financing needs. Available inventory and credit protect output while reducing buffers or margins. When limits are reached, purchases and production may fall. Longer payment terms can shift the constraint to suppliers."
    }
  }
};
const baselineCorrections = {"liquidity-en-mobile": {"key": "liquidity-en-mobile", "before": "<text x=\"24\" y=\"1131\" font-size=\"23\" font-weight=\"700\" text-anchor=\"start\" class=\"ink\"><tspan x=\"24\" dy=\"0\">More credit ≠ more activity</tspan></text>", "after": "<text x=\"24\" y=\"1120\" font-size=\"23\" font-weight=\"700\" text-anchor=\"start\" class=\"ink\"><tspan x=\"24\" dy=\"0\">More credit ≠ more activity</tspan></text>", "originalHash": "706613485e0a2c52e842358831ac711451aab4459838924d28b23352c8f6f685", "expectedHash": "8fcc9555e3a94892ef5cb256458a5249f0290bf1ef1c5d497e05af2d89f35287", "expectedDomHash": "7ad9ad10f0838965a637b16f9485415a9f0c66aa7609aef8c72e892d3157daa8"}, "liquidity-fr-mobile": {"key": "liquidity-fr-mobile", "before": "<text x=\"24\" y=\"1131\" font-size=\"23\" font-weight=\"700\" text-anchor=\"start\" class=\"ink\"><tspan x=\"24\" dy=\"0\">Crédit accru ≠ activité accrue</tspan></text>", "after": "<text x=\"24\" y=\"1120\" font-size=\"23\" font-weight=\"700\" text-anchor=\"start\" class=\"ink\"><tspan x=\"24\" dy=\"0\">Crédit accru ≠ activité accrue</tspan></text>", "originalHash": "358525922032d23d1e246706916c8559e12514ab5af8029df604e7775dc9515c", "expectedHash": "d745c6d7e43c39d394f048d3de68872753bcc1f642cdf053aa56a5d110bb64d0", "expectedDomHash": "6c580230dc2900c840bf847d3980f349c326ea7dbb73406d77ba9c415c78e560"}};
const kinds = ['stocks', 'routes', 'transport', 'inventory', 'financing', 'liquidity'];
const variants = ['fr', 'en'].flatMap(lang => kinds.flatMap(kind => [false, true].map(mobile => ({ lang, kind, mobile, key: `${kind}-${lang}-${mobile ? 'mobile' : 'desktop'}`, svg: straitsSvg(lang, kind, mobile) }))));
const parser = new XMLParser({ preserveOrder: true, ignoreAttributes: false, attributeNamePrefix: '', trimValues: false, parseTagValue: false, parseAttributeValue: false });
const builder = new XMLBuilder({ preserveOrder: true, ignoreAttributes: false, attributeNamePrefix: '' });
const tag = n => Object.keys(n).find(k => k !== ':@');
const attrs = n => n[':@'] ?? {};
const children = n => n[tag(n)] ?? [];
const xmlNodes = n => tag(n) === '#text' ? [] : [n, ...children(n).flatMap(xmlNodes)];
const xmlText = n => tag(n) === '#text' ? n['#text'] : children(n).map(xmlText).join('');
const htmlNodes = n => [n, ...(n.childNodes ?? []).flatMap(htmlNodes)];
const canonical = n => n.nodeName === '#text' ? ['#text', n.value] : [n.tagName, (n.attrs ?? []).map(a => [a.name, a.value]).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0), (n.childNodes ?? []).filter(c => c.nodeName !== '#text' || c.value.trim() || ['text', 'tspan', 'title', 'desc', 'metadata', 'style'].includes(n.tagName)).map(canonical)];
const domHash = raw => { const roots = htmlNodes(parse(raw)).filter(n => n.tagName === 'svg'); assert.equal(roots.length, 1); return digest(JSON.stringify(canonical(roots[0]))); };
const allowed = Object.fromEntries(Object.entries({
  svg: 'xmlns id class viewBox role aria-labelledby', title: 'id', desc: 'id', metadata: '', style: '', defs: '',
  marker: 'id viewBox refX refY markerWidth markerHeight orient',
  rect: 'x y width height rx fill stroke stroke-width opacity',
  text: 'x y font-size font-weight text-anchor class', tspan: 'x dy',
  circle: 'cx cy r fill',
  path: 'd fill stroke stroke-width stroke-linecap stroke-linejoin stroke-dasharray marker-end',
}).map(([k,v]) => [k, new Set(v ? v.split(' ') : [])]));
const aliases = ['bg','panel','ink','muted','grid','teal','red','gold','blue','white'];
const paints = new Set(['none', ...aliases.map(v => `var(--${v})`)]);
const numeric = new Set('x y width height rx cx cy r font-size stroke-width opacity dy refX refY markerWidth markerHeight'.split(' '));
function number(value) {
  assert.equal(typeof value, 'string');
  assert.ok(value.length > 0 && value.length <= 32);
  assert.match(value, /^-?(?:\d{1,4}(?:\.\d{1,18})?|\.\d{1,18})$/u);
  const n = Number(value); assert.ok(Number.isFinite(n) && Math.abs(n) <= 10000);
  return n;
}
const value = (n, k, fallback = '0') => number(attrs(n)[k] ?? fallback);
// Complete bounded parser for the supplied absolute commands, with quadratic,
// cubic and reflected T control points. Every character must be consumed.
function curvePoints(p) {
  assert.ok([3, 4].includes(p.length) && p.flat().every(Number.isFinite));
  const points = [p[0], p.at(-1)];
  const at = t => p.length === 3
    ? [0, 1].map(k => (1 - t) ** 2 * p[0][k] + 2 * (1 - t) * t * p[1][k] + t ** 2 * p[2][k])
    : [0, 1].map(k => (1 - t) ** 3 * p[0][k] + 3 * (1 - t) ** 2 * t * p[1][k] + 3 * (1 - t) * t ** 2 * p[2][k] + t ** 3 * p[3][k]);
  for (const k of [0, 1]) {
    let roots;
    if (p.length === 3) {
      const denominator = p[0][k] - 2 * p[1][k] + p[2][k];
      roots = denominator === 0 ? [] : [(p[0][k] - p[1][k]) / denominator];
    } else {
      const a = -p[0][k] + 3 * p[1][k] - 3 * p[2][k] + p[3][k];
      const b = 2 * (p[0][k] - 2 * p[1][k] + p[2][k]);
      const c = p[1][k] - p[0][k], discriminant = b * b - 4 * a * c;
      roots = Math.abs(a) < 1e-12 ? (Math.abs(b) < 1e-12 ? [] : [-c / b])
        : discriminant < 0 ? [] : [(-b - Math.sqrt(discriminant)) / (2 * a), (-b + Math.sqrt(discriminant)) / (2 * a)];
    }
    for (const t of roots) if (t > 0 && t < 1) points.push(at(t));
  }
  assert.ok(points.flat().every(Number.isFinite)); return points;
}
function pathPoints(raw) {
  assert.equal(typeof raw, 'string'); assert.ok(raw.length > 0 && raw.length <= 8192);
  const token = /[MLHVZCQT]|-?(?:\d{1,4}(?:\.\d{1,18})?|\.\d{1,18})/uy;
  const tokens = []; let offset = 0;
  while (offset < raw.length) {
    if (/\s/u.test(raw[offset])) { offset++; continue; }
    token.lastIndex = offset; const match = token.exec(raw); assert.ok(match, 'Complete path token');
    tokens.push(match[0]); assert.ok(tokens.length <= 2048); offset = token.lastIndex;
  }
  assert.equal(tokens[0], 'M'); const points = []; let i = 0, current, origin, quadraticControl, count = 0;
  const pair = () => [number(tokens[i++]), number(tokens[i++])];
  while (i < tokens.length) {
    const command = tokens[i++]; assert.ok(['M', 'L', 'H', 'V', 'Z', 'C', 'Q', 'T'].includes(command));
    assert.ok(++count <= 512);
    if (command === 'Z') { assert.ok(origin); current = [...origin]; quadraticControl = undefined; }
    else if (command === 'M' || command === 'L') {
      if (command === 'L') assert.ok(current);
      current = pair(); quadraticControl = undefined;
      if (command === 'M') origin = [...current];
    } else if (command === 'H' || command === 'V') {
      assert.ok(current); current = [...current]; current[command === 'H' ? 0 : 1] = number(tokens[i++]); quadraticControl = undefined;
    } else {
      assert.ok(current); let controls;
      if (command === 'C') { controls = [pair(), pair()]; quadraticControl = undefined; }
      else {
        const control = command === 'Q' ? pair() : quadraticControl ? [2 * current[0] - quadraticControl[0], 2 * current[1] - quadraticControl[1]] : [...current];
        controls = [control]; quadraticControl = control;
      }
      const end = pair(); points.push(...curvePoints([current, ...controls, end])); current = end;
    }
    points.push([...current]);
  }
  assert.ok(points.length); return points;
}
const suppliedStyleHash = "e5714c172daeeb6eb7c179304ba2f618344dcd2f9b9813017400e2dc55c2ca15";
function inspect(v) {
  assert.equal(typeof v.svg, 'string'); assert.ok(v.svg.length > 100 && v.svg.length < 40000);
  assert.doesNotMatch(v.svg, /<!|<\?|&(?!amp;|lt;|gt;|quot;|apos;)/u);
  assert.equal(XMLValidator.validate(v.svg), true);
  const roots = parser.parse(v.svg); assert.equal(roots.length, 1); const root = roots[0]; assert.equal(tag(root), 'svg');
  const index = kinds.indexOf(v.kind) + 1, prefix = `det-f${String(index).padStart(2, '0')}-${v.lang}-${v.mobile ? 'm' : 'd'}`;
  assert.deepEqual(attrs(root), { xmlns: 'http://www.w3.org/2000/svg', id: prefix, class: 'l0g-det-svg', viewBox: originals[v.key].viewBox, role: 'img', 'aria-labelledby': `${prefix}-title ${prefix}-desc` });
  const nodes = xmlNodes(root); assert.ok(nodes.length < 512); const ids = [];
  for (const n of nodes) {
    assert.ok(Object.hasOwn(allowed, tag(n)), `Passive tag ${tag(n)}`);
    for (const [k,val] of Object.entries(attrs(n))) {
      assert.ok(allowed[tag(n)].has(k), `Known field ${tag(n)}.${k}`); assert.equal(typeof val, 'string'); assert.ok(val.length <= 8192);
      if (numeric.has(k)) { const num = number(val); if (['width','height','rx','r','stroke-width','markerWidth','markerHeight'].includes(k)) assert.ok(num >= 0); if(k === 'opacity') assert.ok(num >= 0 && num <= 1); }
      if (k === 'fill' || k === 'stroke') assert.ok(paints.has(val), `Passive local paint ${val}`);
      if (k === 'id') { assert.ok([prefix, `${prefix}-title`, `${prefix}-desc`, ...['teal','red','gold','blue','ink','muted'].map(c => `${prefix}-arrow-${c}`)].includes(val)); ids.push(val); }
      if (k === 'class' && tag(n) === 'text') assert.ok(['bg','ink','muted','teal','red','gold','blue'].includes(val));
      if (k === 'font-weight') assert.ok(['400','700'].includes(val));
      if (k === 'font-size') assert.ok(number(val) >= 12 && number(val) <= 64);
      if (k === 'text-anchor') assert.ok(['start','middle','end'].includes(val));
      if (k === 'stroke-dasharray') assert.ok(['3 5','4 5','4 6','4 7','5 6','7 6','7 7','8 7','9 8'].includes(val));
      if (k === 'stroke-linecap' || k === 'stroke-linejoin') assert.equal(val, 'round');
      if (k === 'marker-end') assert.ok(['teal','red','gold','blue','ink','muted'].some(c => val === `url(#${prefix}-arrow-${c})`));
      if (k === 'd') pathPoints(val);
    }
    if (tag(n) === 'marker') {
      assert.deepEqual(attrs(n), {id: attrs(n).id, viewBox:'0 0 10 10', refX:'9',refY:'5',markerWidth:'7',markerHeight:'7',orient:'auto-start-reverse'});
      assert.equal(children(n).length, 1); assert.equal(tag(children(n)[0]), 'path');
      assert.equal(attrs(children(n)[0]).d, 'M 0 1 L 9 5 L 0 9 Z');
    }
    if (tag(n) === 'text') assert.ok(children(n).length > 0 && children(n).every(c => tag(c) === 'tspan'));
    if (tag(n) === 'tspan') assert.ok(children(n).length === 1 && tag(children(n)[0]) === '#text');
  }
  assert.equal(new Set(ids).size, 9); assert.equal(ids.length, 9);
  for (const type of ['title','desc','metadata','style','defs']) { const found = nodes.filter(n => tag(n) === type); assert.equal(found.length, 1); if(type !== 'defs') assert.ok(xmlText(found[0]).trim()); }
  const style = xmlText(nodes.find(n => tag(n) === 'style')); assert.equal(digest(style), suppliedStyleHash, 'Complete supplied standalone stylesheet');
  const css = postcss.parse(style); css.walkAtRules(rule => assert.ok(rule.name === 'media' && rule.params === '(prefers-color-scheme:dark)'));
  css.walkDecls(decl => assert.doesNotMatch(decl.value, /url\(|expression\(|@import/iu));
  assert.deepEqual(JSON.parse(xmlText(nodes.find(n => tag(n) === 'metadata'))), originals[v.key].metadata);
  assert.equal(xmlText(nodes.find(n => tag(n) === 'desc')), originals[v.key].metadata.description);
  const [, , width, height] = attrs(root).viewBox.split(' ').map(number); return { root, nodes, width, height };
}
function faithful(v) {
 inspect(v);let original=v.svg;
 const baselineCorrection=baselineCorrections[v.key];
 if(baselineCorrection){
  assert.equal(v.svg.split(baselineCorrection.after).length-1,1,'Exactly one corrected baseline');assert.ok(!v.svg.includes(baselineCorrection.before));
  assert.equal(digest(v.svg),baselineCorrection.expectedHash);assert.equal(domHash(v.svg),baselineCorrection.expectedDomHash);
  original=v.svg.replace(baselineCorrection.after,baselineCorrection.before);
 }
 assert.equal(digest(original),originals[v.key].rawHash,`${v.key}: complete supplied XML, reversing only the one exact approved baseline change`);
 assert.equal(domHash(original),originals[v.key].domHash,`${v.key}: complete original browser tree`);
}
const mutate = (v, change) => { const root = parser.parse(v.svg)[0]; change(root, xmlNodes(root)); return { ...v, svg: builder.build([root]) }; };
const fontFrom = file => { const b = readFileSync(new URL(`../${file}`, import.meta.url)); return opentype.parse(b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength)); };
const fonts = Object.fromEntries([400,700].map(w => [w,fontFrom(`public/fonts/straits/liberation-sans-${w}.ttf`)]));
const within = (a,b,t=0) => a.x >= b.x-t && a.y >= b.y-t && a.right <= b.right+t && a.bottom <= b.bottom+t;
const overlaps = (a,b) => a.x < b.right && a.right > b.x && a.y < b.bottom && a.bottom > b.y;
const pointsBox = points => { assert.ok(points.length && points.flat().every(Number.isFinite)); return {x:Math.min(...points.map(p=>p[0])),y:Math.min(...points.map(p=>p[1])),right:Math.max(...points.map(p=>p[0])),bottom:Math.max(...points.map(p=>p[1]))}; };
function shapeBox(n) {
  if (tag(n) === 'rect') return { x: value(n, 'x'), y: value(n, 'y'), right: value(n, 'x') + value(n, 'width'), bottom: value(n, 'y') + value(n, 'height') };
  if (tag(n) === 'circle') return { x: value(n, 'cx') - value(n, 'r'), y: value(n, 'cy') - value(n, 'r'), right: value(n, 'cx') + value(n, 'r'), bottom: value(n, 'cy') + value(n, 'r') };
  if (tag(n) === 'line') return pointsBox([[value(n, 'x1'), value(n, 'y1')], [value(n, 'x2'), value(n, 'y2')]]);
  if (tag(n) === 'path') return pointsBox(pathPoints(attrs(n).d));
}
function textBoxes(n) {
  const font = fonts[attrs(n)['font-weight']], size = value(n,'font-size'); let y = value(n,'y');
  return children(n).map(span => {
    const label = xmlText(span); y += value(span,'dy');
    for (const c of label) assert.ok(font.charToGlyphIndex(c) > 0, `Glyph U+${c.codePointAt(0).toString(16)}`);
    const advance = font.getAdvanceWidth(label,size), anchor = attrs(n)['text-anchor'];
    const x = value(span,'x') - (anchor === 'middle' ? advance/2 : anchor === 'end' ? advance : 0), points = [];
    let current,origin;
    for (const command of font.getPath(label,x,y,size).commands) {
      assert.ok(['M','L','Q','C','Z'].includes(command.type));
      if (command.type === 'Z') { assert.ok(origin); current=[...origin]; points.push(current); continue; }
      const end=[command.x,command.y]; assert.ok(end.every(Number.isFinite));
      if (command.type === 'M') origin=[...end];
      if (command.type === 'Q' || command.type === 'C') points.push(...curvePoints([current,[command.x1,command.y1],...(command.type === 'C' ? [[command.x2,command.y2]]:[]),end]));
      points.push(end);current=end;
    }
    return {...pointsBox(points),label};
  });
}
function scene(n) { return ['#text','defs'].includes(tag(n)) ? [] : [n,...children(n).flatMap(scene)]; }
function geometry(v) {
  const {root,width,height}=inspect(v),canvas={x:0,y:0,right:width,bottom:height},panels=[],labels=[];
  for(const n of scene(root)) {
    if(!['rect','circle','line','path','text'].includes(tag(n))) continue;
    if(tag(n) !== 'text') {
      const b=shapeBox(n),stroke=attrs(n).stroke && attrs(n).stroke!=='none'?value(n,'stroke-width','1')/2:0;
      assert.ok(within({x:b.x-stroke,y:b.y-stroke,right:b.right+stroke,bottom:b.bottom+stroke},canvas,.01), `${v.key}: shape outside viewBox`);
      if(tag(n)==='rect' && value(n,'rx')>=9 && value(n,'x')>1 && value(n,'width')>=100 && value(n,'height')>=40)panels.push(b);
      continue;
    }
    for(const b of textBoxes(n)) {
      assert.ok(within(b,canvas,.01),`${v.key}: text outside viewBox: ${b.label}`);
      const centre={x:(b.x+b.right)/2,y:(b.y+b.bottom)/2,right:(b.x+b.right)/2,bottom:(b.y+b.bottom)/2};
      const panel=panels.filter(p=>within(centre,p)).at(-1);
      if(panel)assert.ok(within(b,panel,.1),`${v.key}: text outside panel: ${b.label}`);
      for(const prior of labels)assert.ok(!overlaps(b,prior),`${v.key}: labels overlap: ${b.label} / ${prior.label}`);
      labels.push(b);
    }
  }
}
test('straits variant selection is frozen, complete and rejects coercion or prototypes', () => {
  assert.deepEqual(STRAITS_KINDS,kinds);assert.ok(Object.isFrozen(STRAITS_KINDS));assert.equal(variants.length,24);
  for(const lang of ['', 'FR','__proto__','constructor',{},null,['fr']])assert.throws(()=>straitsSvg(lang,'stocks',false),TypeError);
  for(const kind of ['', '__proto__','constructor','prototype',{},null,['stocks']])assert.throws(()=>straitsSvg('fr',kind,false),TypeError);
  for(const mobile of [0,1,'','false',null,new Boolean(false),{},[]])assert.throws(()=>straitsSvg('fr','stocks',mobile),TypeError);
  assert.equal(straitsSvg('fr','stocks'),straitsSvg('fr','stocks',false));
});
test('22 supplied XML exports retain every byte; two exact corrected baselines reverse to the originals', () => { for(const v of variants)faithful(v); });
test('all original glyph outlines, curve extrema and panels remain inside their canvases', () => {
 const issues=[];for(const v of variants){try{geometry(v);}catch(error){issues.push(error.message);}}assert.deepEqual(issues,[]);
});
test('geometry guards reject off-canvas shapes, labels and internal panel overflows', () => {
 const v=variants[0];
 for(const change of [(_,ns)=>{attrs(ns.find(n=>tag(n)==='rect')).x='9999';},(_,ns)=>{attrs(ns.find(n=>tag(n)==='tspan')).x='-10';},(root,ns)=>{root.svg.push(JSON.parse(JSON.stringify(ns.find(n=>tag(n)==='text'))));}])assert.throws(()=>geometry(mutate(v,change)));
 const panel=variants.find(v=>v.kind==='routes'&&v.mobile);assert.throws(()=>geometry(mutate(panel,(_,ns)=>{const n=ns.find(n=>tag(n)==='text'&&xmlText(n)===(panel.lang==='fr'?'Asie':'Asia'));assert.ok(n);attrs(children(n)[0]).x='225';})), /text outside panel/u);
});
test('full XML goldens reject geometry, text, metadata, stylesheet and child-order changes', () => {
 const v=variants[0];for(const change of [(_,ns)=>{attrs(ns.find(n=>tag(n)==='tspan')).x='0';},(_,ns)=>{attrs(ns.find(n=>tag(n)==='rect')).fill='var(--panel)';},(_,ns)=>{ns.find(n=>tag(n)==='title').title=[{'#text':'Changed'}];},(_,ns)=>{ns.find(n=>tag(n)==='metadata').metadata=[{'#text':'{}'}];},(_,ns)=>{ns.find(n=>tag(n)==='style').style=[{'#text':'.l0g-det-svg{fill:red}'}];},root=>{root.svg.reverse();}])assert.throws(()=>faithful(mutate(v,change)));
});
test('passive SVG validator rejects active markup, external resources and malformed fields',()=>{
 const v=variants[0];for(const type of ['script','foreignObject','image','use','a','animate','filter'])assert.throws(()=>inspect(mutate(v,root=>{root.svg.push({[type]:[]});})));
 for(const[field,val]of [['onload','alert(1)'],['href','https://example.org/'],['xlink:href','javascript:alert(1)'],['constructor','x'],['prototype','x'],['transform','translate(0 0)'],['style','fill:red'],['font-size','Infinity'],['x','1e999'],['x','10001']])assert.throws(()=>inspect(mutate(v,(_,ns)=>{attrs(ns.find(n=>tag(n)==='text'))[field]=val;})));
 for(const val of ['url(#x)','url(https://example.org/x)','var(--bg,red)','#fff','red'])assert.throws(()=>inspect(mutate(v,(_,ns)=>{attrs(ns.find(n=>tag(n)==='rect')).fill=val;})));
 for(const val of ['url(https://example.org/x)','url(#det-f01-fr-d-arrow-teal) trailing','url(#unknown)'])assert.throws(()=>inspect(mutate(v,(_,ns)=>{attrs(ns.find(n=>tag(n)==='path'))['marker-end']=val;})));
 for(const raw of ['<!DOCTYPE svg><svg/>','<?xml version="1.0"?><svg/>','<svg>&external;</svg>','<svg>&#65;</svg>','<svg><text></svg>',v.svg.replace('<text ','<text __proto__="x" ')])assert.throws(()=>inspect({...v,svg:raw}));
});
test('complete M/L/H/V/Z/C/Q/T parsing computes actual curve extrema and reflected controls', () => {
  assert.deepEqual(pathPoints('M0 0 H10 V20 L30 40 Z M5 6 L7 8'), [[0, 0], [10, 0], [10, 20], [30, 40], [0, 0], [5, 6], [7, 8]]);
  const q = pointsBox(pathPoints('M0 0 Q10 20 20 0'));
  assert.deepEqual(q, { x: 0, y: 0, right: 20, bottom: 10 });
  const cubic = pointsBox(pathPoints('M0 0 C0 20 20 20 20 0'));
  assert.deepEqual(cubic, { x: 0, y: 0, right: 20, bottom: 15 });
  const smooth = pointsBox(pathPoints('M0 0 Q10 20 20 0 T40 0'));
  assert.deepEqual(smooth, { x: 0, y: -10, right: 40, bottom: 10 });
  const reset = pointsBox(pathPoints('M0 0 Q10 20 20 0 L30 0 T40 0'));
  assert.deepEqual(reset, { x: 0, y: 0, right: 40, bottom: 10 });
  assert.deepEqual(pointsBox(pathPoints('M0 0 T20 10')), { x: 0, y: 0, right: 20, bottom: 10 });
  assert.ok(pathPoints('M79.53999999999999 351.02 L0 0').flat().every(Number.isFinite));
});
test('path validation rejects malformed, unconsumed and excessive work within a child deadline', () => {
  const bad = ['L0 0', 'M0', 'M0 0 trailing', 'M0 0 1 1', 'MNaN 0', 'M1e999 0', 'M0,,0',
    'M0 0 C1 2 3 4 5', 'M0 0 Q1 2 3', 'M0 0 T1', 'M0 0 C1 2 3 4 5 6 trailing',
    'M0 0 H', 'M0 0 V', 'M0 0 A1 1 0 0 0 1 1', 'M0 0 q1 2 3 4', 'M0 0 S1 2 3 4',
    'M10001 0', 'M0 0 L99999 0', 'M' + '.'.repeat(8000) + ' 0', 'M' + '9'.repeat(8000) + ' 0',
    'M0.' + '9'.repeat(8000) + ' 0', 'M0 0 ' + 'L1 1 '.repeat(513), 'M0 0 ' + 'C1 1 1 1 1 1 '.repeat(300)];
  for (const raw of bad) assert.throws(() => pathPoints(raw));
  for (const raw of ['', null, {}, [], 0, new String('M0 0')]) assert.throws(() => pathPoints(raw));
  const code = `import assert from 'node:assert/strict'; const number=${number.toString()}; const curvePoints=${curvePoints.toString()}; const paths=${pathPoints.toString()}; for(let i=0;i<100;i++) for(const raw of ${JSON.stringify(bad)}) assert.throws(()=>paths(raw));`;
  execFileSync(process.execPath, ['--input-type=module', '-e', code], { timeout: 5000, maxBuffer: 8192, stdio: 'pipe' });
});
function fontNames(bytes) {
  assert.ok(Buffer.isBuffer(bytes) && bytes.length >= 12 && bytes.length < 2_000_000);
  assert.equal(bytes.readUInt32BE(0), 0x00010000, 'Authored TrueType sfnt');
  const count = bytes.readUInt16BE(4);
  assert.ok(count > 0 && count <= 128 && 12 + count * 16 <= bytes.length);
  const nameTables = [];
  for (let i = 0; i < count; i++) {
    const row = 12 + i * 16;
    if (bytes.toString('ascii', row, row + 4) === 'name') nameTables.push({ offset: bytes.readUInt32BE(row + 8), length: bytes.readUInt32BE(row + 12) });
  }
  assert.equal(nameTables.length, 1, 'Exactly one font name table');
  const { offset, length } = nameTables[0], end = offset + length;
  assert.ok(offset >= 12 + count * 16 && length >= 6 && end <= bytes.length, 'Bounded name table');
  assert.equal(bytes.readUInt16BE(offset), 0, 'Supported native name-table format');
  const recordCount = bytes.readUInt16BE(offset + 2), storage = offset + bytes.readUInt16BE(offset + 4);
  assert.ok(recordCount > 0 && recordCount <= 1024 && offset + 6 + recordCount * 12 <= storage && storage <= end);
  const records = [];
  for (let i = 0; i < recordCount; i++) {
    const row = offset + 6 + i * 12, platform = bytes.readUInt16BE(row), encoding = bytes.readUInt16BE(row + 2), language = bytes.readUInt16BE(row + 4), id = bytes.readUInt16BE(row + 6), size = bytes.readUInt16BE(row + 8), start = storage + bytes.readUInt16BE(row + 10);
    assert.ok([0, 1, 3].includes(platform) && start >= storage && start + size <= end, 'Bounded supported font name record');
    const raw = Buffer.from(bytes.subarray(start, start + size));
    if (platform === 0 || platform === 3) assert.equal(raw.length % 2, 0, 'UTF-16 font name');
    const value = platform === 0 || platform === 3 ? raw.swap16().toString('utf16le') : raw.toString('latin1');
    records.push({ platform, encoding, language, id, value });
  }
  return records;
}
function renamedSubsetNames(subset, original, weight) {
  const style = weight === 400 ? 'Regular' : 'Bold';
  assert.ok([400, 700].includes(weight));
  for (const id of [1, 2, 3, 4, 6]) assert.ok(subset.some(n => n.id === id), 'Required renamed subset name');
  assert.ok(original.some(n => n.id === 0), 'Original copyright record');
  assert.deepEqual(subset.filter(n => n.id === 0), original.filter(n => n.id === 0), 'Every original copyright record remains unchanged');
  for (const record of subset.filter(n => [1, 2, 3, 4, 6, 16, 17, 18].includes(n.id))) {
    assert.doesNotMatch(record.value, /Liberation|Arimo|Tinos|Cousine/iu, 'Reserved font names absent from derivative names');
    if ([1, 16].includes(record.id)) assert.equal(record.value, 'l0g Straits Sans');
    if ([2, 17].includes(record.id)) assert.equal(record.value, style);
    if ([3, 4, 18].includes(record.id)) assert.equal(record.value, `l0g Straits Sans ${style}`);
    if (record.id === 6) assert.equal(record.value, `l0gStraitsSans-${style}`);
  }
}
test('redistributed font subsets retain copyrights and use the licensed derivative family name', () => {
  for (const weight of [400, 700]) {
    const subsetBytes = readFileSync(new URL(`../public/fonts/straits/liberation-sans-${weight}.ttf`, import.meta.url));
    const originalBytes = readFileSync(new URL(`../src/epub-assets/debt-chain-fonts/liberation-sans-${weight}.ttf`, import.meta.url));
    renamedSubsetNames(fontNames(subsetBytes), fontNames(originalBytes), weight);
    for (const bytes of [Buffer.alloc(0), subsetBytes.subarray(0, 12), subsetBytes.subarray(0, 128)]) assert.throws(() => fontNames(bytes));
    const invalid = Buffer.from(subsetBytes); invalid.writeUInt16BE(65535, 4); assert.throws(() => fontNames(invalid));
    const subset = fontNames(subsetBytes), original = fontNames(originalBytes);
    for (const id of [0, 1, 2, 3, 4, 6]) {
      const changed = subset.map(record => ({ ...record, value: record.id === id ? 'Liberation Sans' : record.value }));
      assert.throws(() => renamedSubsetNames(changed, original, weight));
    }
    assert.throws(() => renamedSubsetNames(subset.filter(record => record.id !== 1), original, weight));
  }
});
test('dedicated fonts retain every original glyph outline, metrics and canonical complete licence', () => {
  const licence = read('public/fonts/straits/LICENSE.txt'); assertFontLicenseReferences(licence, 'liberation');
  assert.equal(licence, read('src/epub-assets/debt-chain-fonts/liberation-LICENSE.txt'));
  for (const weight of [400, 700]) {
    const font = fonts[weight], original = fontFrom(`src/epub-assets/debt-chain-fonts/liberation-sans-${weight}.ttf`);
    assert.deepEqual([font.unitsPerEm, font.ascender, font.descender], [original.unitsPerEm, original.ascender, original.descender]);
    const characters = new Set(variants.flatMap(v => inspect(v).nodes.filter(n => tag(n) === 'text' && attrs(n)['font-weight'] === String(weight)).flatMap(n => [...xmlText(n)])));
    for (const c of characters) {
      assert.ok(font.charToGlyphIndex(c) > 0); const a = font.charToGlyph(c), b = original.charToGlyph(c);
      assert.equal(a.advanceWidth, b.advanceWidth); assert.deepEqual(a.getPath(0, 0, font.unitsPerEm).commands, b.getPath(0, 0, original.unitsPerEm).commands);
    }
  }
});
test('font licence assertions reject forged references while accepting full canonical LF/CRLF',()=>{
 const licence=read('public/fonts/straits/LICENSE.txt');
 for(const text of [licence,licence.replaceAll('\r\n','\n').replaceAll('\n','\r\n')])assertFontLicenseReferences(text,'liberation');
 const urls=['https://github.com/liberationfonts/liberation-fonts','https://github.com/liberationfonts/liberation-fonts/blob/main/LICENSE'];
 for(const url of urls)for(const replacement of [`https://github.com.evil.example${new URL(url).pathname}`,`https://github.com@evil.example${new URL(url).pathname}`,`https://evil.example/?next=${url}`,`https://evil.example/#${url}`,`https://evil.example/${url}`,url.replace('https:','http:'),`${url}?next=bad`,`${url}#bad`,`${url}/bad`,`${url} trailing`,`${url}\u0000`]){
  const lines=licence.split('\n'),i=lines.findIndex(line=>line.endsWith(url));assert.ok(i>=0);lines[i]=lines[i].slice(0,-url.length)+replacement;assert.throws(()=>assertFontLicenseReferences(lines.join('\n'),'liberation'));
 }
 for(const line of licence.split('\n').filter(l=>l.startsWith('Source:')||l.startsWith('Licence source:')))for(const text of [licence.replace(line,''),`${licence}\n${line}`,licence.replace(line,` ${line}`)])assert.throws(()=>assertFontLicenseReferences(text,'liberation'));
});
test('responsive component preserves all theme, font and breakpoint contracts',()=>{
 const component=read('src/components/StraitsFigure.astro'),style=component.match(/<style>([\s\S]*?)<\/style>/u)?.[1];assert.ok(style);
 const css=postcss.parse(style),declarations=n=>Object.fromEntries(n.nodes.filter(d=>d.type==='decl').map(d=>[d.prop,d.value]));
 const rule=selector=>{const n=css.nodes.find(n=>n.type==='rule'&&n.selector===selector);assert.ok(n,selector);return declarations(n);};
 const mapping={bg:'ink',panel:'surface-2',ink:'paper',muted:'muted',grid:'line-strong',teal:'signal',red:'accent',gold:'amber',blue:'topic-blue',white:'ink'};
 assert.deepEqual(rule('.straits-figure :global(svg.l0g-det-svg)'),Object.fromEntries(Object.entries(mapping).map(([k,v])=>[`--${k}`,`var(--color-${v})`])));
 const base=rule('.straits-figure');assert.deepEqual([base.width,base['max-width'],base['container-type'],base['padding-bottom'],base.overflow],['100%','760px','inline-size','.85rem','visible']);
 const graphic=rule('.straits-figure :global(svg)');assert.deepEqual([graphic.width,graphic.height,graphic['max-width'],graphic['letter-spacing'],graphic.overflow],['100%','auto','100%','normal','visible']);
 assert.equal(rule('.straits-figure :global(svg text)')['font-family'],"'l0g Straits', 'Liberation Sans', Arial, sans-serif");
 const mobile=rule('.straits-mobile');assert.deepEqual([mobile.display,mobile.width,mobile['max-width'],mobile['margin-inline']],['none','100%','420px','auto']);
 const faces=css.nodes.filter(n=>n.type==='atrule'&&n.name==='font-face').map(declarations);
 assert.deepEqual(faces.map(d=>[d['font-family'],d.src,d['font-weight'],d['font-style'],d['font-display']]),[400,700].map(w=>["'l0g Straits'",`url('/fonts/straits/liberation-sans-${w}.ttf') format('truetype')`,String(w),'normal','swap']));
 for(const kind of ['media','container']){
  const n=css.nodes.find(n=>n.type==='atrule'&&n.name===kind&&n.params==='(max-width: 640px)');assert.ok(n);
  assert.deepEqual(n.nodes.map(n=>[n.selector,declarations(n).display]),[['.straits-desktop','none'],['.straits-mobile','block']]);
 }
 const themes={dark:new Map(),light:new Map()};postcss.parse(read('src/styles/global.css')).walkDecls(d=>{if(d.parent.type==='atrule'&&d.parent.name==='theme')themes.dark.set(d.prop,d.value);if(d.parent.type==='rule'&&d.parent.selector===':root[data-theme="light"]')themes.light.set(d.prop,d.value);});
 for(const theme of Object.values(themes))for(const v of Object.values(mapping))assert.ok(theme.has(`--color-${v}`));
 assert.doesNotMatch(style,/#(?:[a-f0-9]{3}){1,2}\b|(?:clip-path|overflow\s*:\s*(?:hidden|clip)|transform\s*:|100vw)/iu);
 assert.equal((component.match(/set:html=/gu)??[]).length,2);assert.match(component,/set:html=\{responsiveSvg\(false\)\}/u);assert.match(component,/set:html=\{responsiveSvg\(true\)\}/u);
 assert.ok(component.includes(`const responsiveSvg = (mobile: boolean) => straitsSvg(lang, kind, mobile).replace(/^<svg /u, '<svg style="width:100%;height:auto" ');`));
 assert.doesNotMatch(component,/<script|client:|fetch\(|innerHTML/u);
});
const mdxNodes=n=>[n,...(n.children??[]).flatMap(mdxNodes)];
const figureSources={stocks:[2],routes:[3,6,11],transport:[4],inventory:[],financing:[14],liquidity:[1,14,15]};
function articleFigures(raw,lang){
 const tree=createProcessor().parse(raw.replace(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/u,'')),figures=mdxNodes(tree).filter(n=>n.name==='StraitsFigure');assert.equal(figures.length,6);
 for(const[i,n]of figures.entries()){
  const a=Object.fromEntries(n.attributes.map(a=>{assert.equal(a.type,'mdxJsxAttribute');assert.equal(typeof a.value,'string');return[a.name,a.value];}));
  assert.deepEqual(Object.keys(a).sort(),['caption','kind','lang','number','sources']);assert.equal(a.kind,kinds[i]);assert.equal(a.number,String(i+1).padStart(2,'0'));assert.equal(a.lang,lang);assert.ok(a.caption.length>70);
  const refs=a.sources.trim()?a.sources.trim().split(/\s+/u).map(Number):[];assert.deepEqual(refs,figureSources[kinds[i]]);const details=mdxNodes(n).filter(c=>c.name==='details');assert.equal(details.length,1);assert.equal(mdxNodes(details[0]).filter(c=>c.name==='summary').length,1);
 }
}
test('article native MDX includes six ordered static figures, accurate references and method notes',()=>{
 for(const lang of ['fr','en'])articleFigures(read(`src/content/${lang==='fr'?'posts/detroits-prix-des-jours-gagnes':'posts-en/shipping-chokepoints-cost-of-buying-time'}.mdx`),lang);
});
function quantitativeGeometry(v) {
 const {root}=inspect(v),ns=scene(root),rects=ns.filter(n=>tag(n)==='rect');
 const close=(a,b,t=.002)=>assert.ok(Math.abs(a-b)<=t,`${v.key}: quantitative geometry ${a} != ${b}`);
 if(v.kind==='stocks'){
  const bars=rects.filter(n=>[3,4].includes(value(n,'rx')));assert.equal(bars.length,3);
  const scale=v.mobile?356/120:320/120;
  [113,103,10].forEach((n,i)=>close(value(bars[i],'height'),n*scale));
  close(value(bars[0],'y'),value(bars[2],'y'));
  close(value(bars[0],'y')+value(bars[0],'height'),value(bars[1],'y')+value(bars[1],'height'));
  close(value(bars[1],'y')-value(bars[0],'y'),10*scale);
 }
 if(v.kind==='transport'){
  const bars=rects.filter(n=>value(n,'rx')===3);assert.equal(bars.length,5);
  const scale=v.mobile?1.47:2.45;[50,174,68].forEach((n,i)=>close(value(bars[i],'width'),n*scale));
  assert.equal(new Set(bars.slice(0,3).map(n=>value(n,'x'))).size,1,'Transit indices start from a common zero');
  close(value(bars[4],'width')/value(bars[3],'width'),84/70,.00001);
  close(100*(1-70/84),16.666666666666668,.00001);
 }
 if(v.kind==='inventory'){
  const paths=ns.filter(n=>tag(n)==='path'&&['var(--teal)','var(--red)'].includes(attrs(n).stroke)&&value(n,'stroke-width')>=4);assert.equal(paths.length,2);
  const x0=v.mobile?69:95,x1=v.mobile?395:1028,top=v.mobile?310:235,bottom=v.mobile?648:605;
  for(const [i,p]of paths.entries()){
   const points=pathPoints(attrs(p).d);assert.equal(points.length,41);
   for(let day=0;day<=40;day++){
    const stock=Math.max(0,1200-40*Math.min(day,i?35:20));
    close(points[day][0],x0+(x1-x0)*day/40,.00001);close(points[day][1],bottom-stock*(bottom-top)/1200,.00001);
   }
  }
  assert.equal(1200/(100-60),30);assert.equal((35-30)*(100-60),200);assert.equal(1200/100,12);
 }
 if(v.kind==='financing'){
  const days=rects.filter(n=>attrs(n).opacity!==undefined);assert.equal(days.length,14);
  assert.equal(14*50000,700000);assert.equal(700000*.08,56000);
  assert.equal(new Set(days.map(n=>value(n,'width'))).size,1);assert.equal(new Set(days.map(n=>value(n,'height'))).size,1);
  for(let i=1;i<days.length;i++)assert.ok(value(days[i],'opacity')>value(days[i-1],'opacity'));
 }
}
test('waterfall, route indices, fleet capacity, stock paths and financing preserve verified units and calculations',()=>{for(const v of variants)quantitativeGeometry(v);});
test('quantitative guards reject changed bar scales, capacities and stock trajectories',()=>{
 for(const kind of ['stocks','transport','inventory','financing']){
  const v=variants.find(v=>v.kind===kind&&!v.mobile);
  assert.throws(()=>quantitativeGeometry(mutate(v,(_,ns)=>{
   if(kind==='inventory'){const n=ns.find(n=>tag(n)==='path'&&attrs(n)['stroke-width']==='5');attrs(n).d=attrs(n).d.replace('561.5 481.6666666666667','561.5 480');}
   else if(kind==='financing'){const n=ns.find(n=>tag(n)==='rect'&&attrs(n).opacity!==undefined);attrs(n).width='1';}
   else{const n=ns.find(n=>tag(n)==='rect'&&[3,4].includes(Number(attrs(n).rx)));attrs(n)[kind==='stocks'?'height':'width']='1';}
  })));
 }
});

function taglineClearance(v){
 const {root}=inspect(v),ns=scene(root),label=ns.find(n=>tag(n)==='text'&&xmlText(n)===(v.lang==='fr'?'Crédit accru ≠ activité accrue':'More credit ≠ more activity'));assert.ok(label);
 const boxes=textBoxes(label);assert.equal(boxes.length,1);
 const rule=ns.find(n=>tag(n)==='path'&&attrs(n).d==='M 24 1131.2 L 396 1131.2');assert.ok(rule);
 const y=pathPoints(attrs(rule).d)[0][1],clearance=y-value(rule,'stroke-width')/2-boxes[0].bottom;
 assert.ok(clearance>=5,`Tagline glyphs need5units clear of separator; actual${clearance}`);
 return {baseline:value(label,'y'),glyphBottom:boxes[0].bottom,separator:y,clearance};
}
test('the two exact mobile baseline corrections remove verified glyph/rule intersections',()=>{
 assert.equal(Object.keys(baselineCorrections).length,2);
 for(const baselineCorrection of Object.values(baselineCorrections)){
  const v=variants.find(v=>v.key===baselineCorrection.key);faithful(v);const after=taglineClearance(v);assert.equal(after.baseline,1120);assert.ok(after.glyphBottom<1125);
  const before={...v,svg:v.svg.replace(baselineCorrection.after,baselineCorrection.before)};
  assert.equal(digest(before.svg),baselineCorrection.originalHash);assert.throws(()=>taglineClearance(before),/Tagline glyphs need5units/u);
  for(const replacement of [baselineCorrection.after.replace('y="1120"','y="1119"'),baselineCorrection.after.replace('class="ink"','class="teal"')])assert.throws(()=>faithful({...v,svg:v.svg.replace(baselineCorrection.after,replacement)}));
 }
});

test('the static root adapter adds exactly the required responsive style to24 complete SVGs',()=>{
 for(const v of variants){
  faithful(v);assert.ok(v.svg.startsWith('<svg '));
  const rendered=v.svg.replace(/^<svg /u,'<svg style="width:100%;height:auto" '),root=parser.parse(rendered)[0];
  assert.equal(attrs(root).style,'width:100%;height:auto');
  assert.equal(rendered.replace('<svg style="width:100%;height:auto" ','<svg '),v.svg,'Only one controlled root attribute may be added');
  const check=raw=>assert.equal(attrs(parser.parse(raw)[0]).style,'width:100%;height:auto');
  assert.throws(()=>check(v.svg));assert.throws(()=>check(rendered.replace('style="width:100%;height:auto"','style="width:1100px;height:710px"')));
 }
});
