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
import { hormuzFertilizerSvg, HORMUZ_FERTILIZER_KINDS } from '../src/lib/hormuzFertilizerFigures.mjs';
import { assertFontLicenseReferences } from './font-license-assertions.mjs';

const read = file => readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
const digest = value => createHash('sha256').update(value).digest('hex');
// Independent raw and complete browser-tree goldens derived from all 24 passive supplied XML exports.
const originals = {
  "corridor-fr-desktop": {
    "rawHash": "e0ca1139e071fd12d2e9fca3267fd81ef635f17f784030dd80ce1cd8b0f0bc03",
    "domHash": "f16615ca647fb317b73a7545c9297ac96cd638da6905c158307ded1fd231aa26",
    "viewBox": "0 0 1100 980",
    "metadata": {
      "figure": 1,
      "language": "fr",
      "layout": "desktop",
      "as_of": "2026-10-16",
      "source_ids": [
        "S01",
        "S02",
        "S15"
      ],
      "creator": "l0g",
      "description": "Un accord politique précède l’activation annoncée sous sept à dix jours. Cinq navires par jour sont un objectif déclaré. Le contrôle maritime est suivi d’une chaîne de transformation éventuelle et de livraison ; assurance et financement restent nécessaires."
    }
  },
  "corridor-fr-mobile": {
    "rawHash": "81258d982adedbea4930b8a89cb410f03fc1505f3aca2b6e047a5d2ba7d9e518",
    "domHash": "6e0d5ccae93d989e2d3de2296a10801479b771d5f4659b30cfa2c8fd12496216",
    "viewBox": "0 0 420 1550",
    "metadata": {
      "figure": 1,
      "language": "fr",
      "layout": "mobile",
      "as_of": "2026-10-16",
      "source_ids": [
        "S01",
        "S02",
        "S15"
      ],
      "creator": "l0g",
      "description": "Un accord politique précède l’activation annoncée sous sept à dix jours. Cinq navires par jour sont un objectif déclaré. Le contrôle maritime est suivi d’une chaîne de transformation éventuelle et de livraison ; assurance et financement restent nécessaires."
    }
  },
  "inputs-fr-desktop": {
    "rawHash": "c2516c9ae9e0d826bbf5748cb106a8c5945cde97df85ca7a1ac79e82a1ada19f",
    "domHash": "878e69dcb670a2787c4ff1c7294e1ab8c3f344153c726846c575c03158854bc3",
    "viewBox": "0 0 1100 980",
    "metadata": {
      "figure": 2,
      "language": "fr",
      "layout": "desktop",
      "as_of": "2026-10-16",
      "source_ids": [
        "S05",
        "S06",
        "S07",
        "S08",
        "S09"
      ],
      "creator": "l0g",
      "description": "Gaz naturel et azote de l’air permettent de produire de l’ammoniac, puis de l’urée. Le soufre récupéré fournit de l’acide sulfurique pour traiter la roche phosphatée. L’acide phosphorique et l’ammoniac produisent le DAP."
    }
  },
  "inputs-fr-mobile": {
    "rawHash": "aab2f4766dcb9724447b9e145fbb623853463c8cf57a4bd3573f4b12e6f482c8",
    "domHash": "9f3ee2b2675a7043aff40f170d1e83478766b17c5dc286f6d77c7f503501a807",
    "viewBox": "0 0 420 1650",
    "metadata": {
      "figure": 2,
      "language": "fr",
      "layout": "mobile",
      "as_of": "2026-10-16",
      "source_ids": [
        "S05",
        "S06",
        "S07",
        "S08",
        "S09"
      ],
      "creator": "l0g",
      "description": "Gaz naturel et azote de l’air permettent de produire de l’ammoniac, puis de l’urée. Le soufre récupéré fournit de l’acide sulfurique pour traiter la roche phosphatée. L’acide phosphorique et l’ammoniac produisent le DAP."
    }
  },
  "prices-fr-desktop": {
    "rawHash": "9a5794d6277c11a859f408dd4c2a4380384308020e4ea512116906474f7df367",
    "domHash": "aaaef96142d5a3498b42c5f881671896805d28d33eda267b2755acdd5a0efb87",
    "viewBox": "0 0 1100 830",
    "metadata": {
      "figure": 3,
      "language": "fr",
      "layout": "desktop",
      "as_of": "2026-10-16",
      "source_ids": [
        "S03"
      ],
      "creator": "l0g",
      "description": "Urée T1 537,7, T2 693,5, T3 399,2 dollars la tonne. DAP T1 634,7, T2 759,5, T3 791,8. Variation T3 sur T2 : urée moins 42,4 %, DAP plus 4,3 %."
    }
  },
  "prices-fr-mobile": {
    "rawHash": "89e69dc5433880dea06a7adb83b88f04a89eff0c1999a67cb25afdae9cb9d786",
    "domHash": "63848fcf4d9be5c007da15f5d7a48f80b9020b0ef87abea8540036b6481b5c85",
    "viewBox": "0 0 420 1040",
    "metadata": {
      "figure": 3,
      "language": "fr",
      "layout": "mobile",
      "as_of": "2026-10-16",
      "source_ids": [
        "S03"
      ],
      "creator": "l0g",
      "description": "Urée T1 537,7, T2 693,5, T3 399,2 dollars la tonne. DAP T1 634,7, T2 759,5, T3 791,8. Variation T3 sur T2 : urée moins 42,4 %, DAP plus 4,3 %."
    }
  },
  "trade-fr-desktop": {
    "rawHash": "8817c6473437ebab2ac8113554d1de85eaf5f0e0b34cd7fd5a7fb5ea4c0469c6",
    "domHash": "7204c80facce3e2573c4cecc9c4398c14e7ac64df6e0ab0e9c841feacd0e845e",
    "viewBox": "0 0 1100 900",
    "metadata": {
      "figure": 4,
      "language": "fr",
      "layout": "desktop",
      "as_of": "2026-10-16",
      "source_ids": [
        "S04"
      ],
      "creator": "l0g",
      "description": "Les flux azotés en équivalent nutriment reculent d’environ 9 %. Le soufre élémentaire passe de 13,5 à 9 millions de tonnes, environ un tiers de moins. Estimations miroir à partir de 77 importateurs ; aucun total des deux catégories."
    }
  },
  "trade-fr-mobile": {
    "rawHash": "113b65d5e15c048de0b57d9634db02e0fb469667ebb8b283a575b0c288137e14",
    "domHash": "31b5c94631cb7e80ba60feb2e4f1e775e5fa7ccd93d8103332c0c90565ab4223",
    "viewBox": "0 0 420 1310",
    "metadata": {
      "figure": 4,
      "language": "fr",
      "layout": "mobile",
      "as_of": "2026-10-16",
      "source_ids": [
        "S04"
      ],
      "creator": "l0g",
      "description": "Les flux azotés en équivalent nutriment reculent d’environ 9 %. Le soufre élémentaire passe de 13,5 à 9 millions de tonnes, environ un tiers de moins. Estimations miroir à partir de 77 importateurs ; aucun total des deux catégories."
    }
  },
  "bangladesh-fr-desktop": {
    "rawHash": "78fba5388c0ee5d325a5cedaea82d6c6a23a178b3de3d124dc9ea50aa9bc6ec2",
    "domHash": "cd563bbe4bedb99db0520147a6c76038b0e5259a35c6aec8bb71702dd8f97023",
    "viewBox": "0 0 1100 930",
    "metadata": {
      "figure": 5,
      "language": "fr",
      "layout": "desktop",
      "as_of": "2026-10-16",
      "source_ids": [
        "S11"
      ],
      "creator": "l0g",
      "description": "Le projet de 300 millions de dollars vise 600 000 tonnes importées, dont la moitié d’urée. Il soutient Aman juillet à octobre 2026 et Boro octobre 2026 à avril 2027. Le 16 octobre se situe dans les deux périodes indiquées par le financement."
    }
  },
  "bangladesh-fr-mobile": {
    "rawHash": "04a5b9d136e58141b5192c00e4f3631ed50cb7b76cca6b24dd7a0eb1bde9e3ce",
    "domHash": "2719df54cf0486d6ce3e4933d6db1152d057af697e251fe7fe0cf2469e66a483",
    "viewBox": "0 0 420 1430",
    "metadata": {
      "figure": 5,
      "language": "fr",
      "layout": "mobile",
      "as_of": "2026-10-16",
      "source_ids": [
        "S11"
      ],
      "creator": "l0g",
      "description": "Le projet de 300 millions de dollars vise 600 000 tonnes importées, dont la moitié d’urée. Il soutient Aman juillet à octobre 2026 et Boro octobre 2026 à avril 2027. Le 16 octobre se situe dans les deux périodes indiquées par le financement."
    }
  },
  "timing-fr-desktop": {
    "rawHash": "8a4dc965dbd67a97614722d6456ece75b9f86af62d9a0f788047a289bd3bda84",
    "domHash": "cfa7b75c00336a5ef6ea7d93c36c85ff90724096e2fff8fe3a0366e3e6204fe5",
    "viewBox": "0 0 1100 940",
    "metadata": {
      "figure": 6,
      "language": "fr",
      "layout": "desktop",
      "as_of": "2026-10-16",
      "source_ids": [],
      "creator": "l0g",
      "description": "Hypothèses : prix en dollars plus 25 %, coût local du dollar plus 10 %, budget fixe. Le coût local augmente de 37,5 %. Le volume achetable tombe à 72,7 % de son niveau initial, soit moins 27,3 %. Aucun effet de rendement n’est calculé."
    }
  },
  "timing-fr-mobile": {
    "rawHash": "084f8164de180af5fac2a04ef9ba002ae9142f16ae5d70b37760dc5856c89589",
    "domHash": "e3023a279683a7e3808567bd43e594c25f131ec2dd2ae054380ef249be06974a",
    "viewBox": "0 0 420 1320",
    "metadata": {
      "figure": 6,
      "language": "fr",
      "layout": "mobile",
      "as_of": "2026-10-16",
      "source_ids": [],
      "creator": "l0g",
      "description": "Hypothèses : prix en dollars plus 25 %, coût local du dollar plus 10 %, budget fixe. Le coût local augmente de 37,5 %. Le volume achetable tombe à 72,7 % de son niveau initial, soit moins 27,3 %. Aucun effet de rendement n’est calculé."
    }
  },
  "corridor-en-desktop": {
    "rawHash": "86b7f3e113afe5c72fc38374bf4200e427eaf9dce900cc99b64684d755ced247",
    "domHash": "f194658d4054e2635f1f5a3dd977a6e133595d6ad5ed1ff6823a00b49139480f",
    "viewBox": "0 0 1100 980",
    "metadata": {
      "figure": 1,
      "language": "en",
      "layout": "desktop",
      "as_of": "2026-10-16",
      "source_ids": [
        "S01",
        "S02",
        "S15"
      ],
      "creator": "l0g",
      "description": "Political agreement precedes the stated seven-to-ten-day activation. Five daily ships is a proposed target. The maritime mechanism is followed by any processing and inland delivery; insurance and finance are still required."
    }
  },
  "corridor-en-mobile": {
    "rawHash": "08f6624f29f63c76b63fbae7ca33d3ccddb8f6d1611d7528f0d3a98ce03204c0",
    "domHash": "8f9c310908600902f7859b6e4117e46fd4aa2f5682de627cf36939cf0b25f039",
    "viewBox": "0 0 420 1550",
    "metadata": {
      "figure": 1,
      "language": "en",
      "layout": "mobile",
      "as_of": "2026-10-16",
      "source_ids": [
        "S01",
        "S02",
        "S15"
      ],
      "creator": "l0g",
      "description": "Political agreement precedes the stated seven-to-ten-day activation. Five daily ships is a proposed target. The maritime mechanism is followed by any processing and inland delivery; insurance and finance are still required."
    }
  },
  "inputs-en-desktop": {
    "rawHash": "f444f07aada60fc80d86bf255d27814e4dc88f87c87fa3c4b2f4e67b905d0b18",
    "domHash": "be9b6096843d4f0f327380ac8f97f45cfbc8fd3e154cffeba1388df12a672f20",
    "viewBox": "0 0 1100 980",
    "metadata": {
      "figure": 2,
      "language": "en",
      "layout": "desktop",
      "as_of": "2026-10-16",
      "source_ids": [
        "S05",
        "S06",
        "S07",
        "S08",
        "S09"
      ],
      "creator": "l0g",
      "description": "Natural gas and nitrogen from air feed ammonia and urea production. Recovered sulfur provides sulfuric acid for phosphate rock processing. Phosphoric acid and ammonia produce DAP."
    }
  },
  "inputs-en-mobile": {
    "rawHash": "82c472f5a812a1a2801c0057ad07b03bfde58c682354dfbda7ce23f9406a733c",
    "domHash": "5d34e793c029b254876aad75293b5b2bf697e11f0286283cfea1437a382868bc",
    "viewBox": "0 0 420 1650",
    "metadata": {
      "figure": 2,
      "language": "en",
      "layout": "mobile",
      "as_of": "2026-10-16",
      "source_ids": [
        "S05",
        "S06",
        "S07",
        "S08",
        "S09"
      ],
      "creator": "l0g",
      "description": "Natural gas and nitrogen from air feed ammonia and urea production. Recovered sulfur provides sulfuric acid for phosphate rock processing. Phosphoric acid and ammonia produce DAP."
    }
  },
  "prices-en-desktop": {
    "rawHash": "238a5f138caf2004cf2aa6b5113d5fc690de23427468069d346b2697938d30d8",
    "domHash": "8103df14d43260e6a140d4c46165d172d9c06c65035d8aed1934764d7d5b081c",
    "viewBox": "0 0 1100 830",
    "metadata": {
      "figure": 3,
      "language": "en",
      "layout": "desktop",
      "as_of": "2026-10-16",
      "source_ids": [
        "S03"
      ],
      "creator": "l0g",
      "description": "Urea: Q1 537.7, Q2 693.5, Q3 399.2 dollars per tonne. DAP: Q1 634.7, Q2 759.5, Q3 791.8. Q3 versus Q2: urea down 42.4%, DAP up 4.3%."
    }
  },
  "prices-en-mobile": {
    "rawHash": "90c58d17512eccd05d9be9d33f98b62719492bf473678f5b424fa8bf9ac5becc",
    "domHash": "5e3e256dd251539abeaec86842a7ab514b9c3023332c780aa07c48026929bbfe",
    "viewBox": "0 0 420 1040",
    "metadata": {
      "figure": 3,
      "language": "en",
      "layout": "mobile",
      "as_of": "2026-10-16",
      "source_ids": [
        "S03"
      ],
      "creator": "l0g",
      "description": "Urea: Q1 537.7, Q2 693.5, Q3 399.2 dollars per tonne. DAP: Q1 634.7, Q2 759.5, Q3 791.8. Q3 versus Q2: urea down 42.4%, DAP up 4.3%."
    }
  },
  "trade-en-desktop": {
    "rawHash": "06c42f410410ad4590030637fd562a097da71263e73b79cb67352e6cf257da10",
    "domHash": "fe8f8d6b4612a9fa10bd69c0e1ea40340a7129a42d8732c26eddb7811ada5548",
    "viewBox": "0 0 1100 900",
    "metadata": {
      "figure": 4,
      "language": "en",
      "layout": "desktop",
      "as_of": "2026-10-16",
      "source_ids": [
        "S04"
      ],
      "creator": "l0g",
      "description": "Nitrogen flows in nutrient equivalents fall about 9%. Elemental sulfur falls from 13.5 to 9 million tonnes, about one-third lower. Mirror estimates from 77 importing reporters; categories are not added."
    }
  },
  "trade-en-mobile": {
    "rawHash": "0c362674b9798106783d645542246fa7465d0874b7e35b45f429ec21e1c72d28",
    "domHash": "738c8edca1bf49b65904e53001f27cd886f5d730db5438bc6b7b5e6c274b20a0",
    "viewBox": "0 0 420 1310",
    "metadata": {
      "figure": 4,
      "language": "en",
      "layout": "mobile",
      "as_of": "2026-10-16",
      "source_ids": [
        "S04"
      ],
      "creator": "l0g",
      "description": "Nitrogen flows in nutrient equivalents fall about 9%. Elemental sulfur falls from 13.5 to 9 million tonnes, about one-third lower. Mirror estimates from 77 importing reporters; categories are not added."
    }
  },
  "bangladesh-en-desktop": {
    "rawHash": "826a653fcb456ca5d9548b8f47bed7c8becfcce8c08bfaf98cd132a52ba75540",
    "domHash": "d51fb1232a048370aa505ccb68864279737dc8257ac543d706612a755ae42b9b",
    "viewBox": "0 0 1100 930",
    "metadata": {
      "figure": 5,
      "language": "en",
      "layout": "desktop",
      "as_of": "2026-10-16",
      "source_ids": [
        "S11"
      ],
      "creator": "l0g",
      "description": "The $300 million project targets 600,000 imported tonnes, half urea. It supports Aman July–October 2026 and Boro October 2026–April 2027. The 16 October cutoff falls within both indicated support periods."
    }
  },
  "bangladesh-en-mobile": {
    "rawHash": "49ee39d195556664959ca26241b5a8d2c3569e8d2c2444568c279ea0309fa0a7",
    "domHash": "1de6819c12bbcdc59aec2fececc6d77ce00344a4df72a6aa7162ebc8b02e39c2",
    "viewBox": "0 0 420 1430",
    "metadata": {
      "figure": 5,
      "language": "en",
      "layout": "mobile",
      "as_of": "2026-10-16",
      "source_ids": [
        "S11"
      ],
      "creator": "l0g",
      "description": "The $300 million project targets 600,000 imported tonnes, half urea. It supports Aman July–October 2026 and Boro October 2026–April 2027. The 16 October cutoff falls within both indicated support periods."
    }
  },
  "timing-en-desktop": {
    "rawHash": "509ed06dec4e237cbca6262d00384e64b92031420fc364911eac4812aad72e76",
    "domHash": "07a3af5c9deb1d77bedfd795abd9df651ab84b87fa15eea0eff94b669492083b",
    "viewBox": "0 0 1100 940",
    "metadata": {
      "figure": 6,
      "language": "en",
      "layout": "desktop",
      "as_of": "2026-10-16",
      "source_ids": [],
      "creator": "l0g",
      "description": "Assumptions: dollar price up 25%, local cost of a dollar up 10%, fixed budget. Local cost rises 37.5%. Purchasable volume falls to 72.7% of its initial level, down 27.3%. No yield effect is calculated."
    }
  },
  "timing-en-mobile": {
    "rawHash": "cd14bb28cc531a7e67dedfa66706890a5be3b04316fa466cedc6810c9c00e744",
    "domHash": "751ef1c885e02dfd734057326e80fb706989c36cb1ff68efc531730dab6167ce",
    "viewBox": "0 0 420 1320",
    "metadata": {
      "figure": 6,
      "language": "en",
      "layout": "mobile",
      "as_of": "2026-10-16",
      "source_ids": [],
      "creator": "l0g",
      "description": "Assumptions: dollar price up 25%, local cost of a dollar up 10%, fixed budget. Local cost rises 37.5%. Purchasable volume falls to 72.7% of its initial level, down 27.3%. No yield effect is calculated."
    }
  }
};
const textCorrections = {
  "trade-fr-desktop": {
    "pairs": [
      [
        "Estimations miroir à partir de 77 importateurs ; aucun total des deux catégories.",
        "Estimations miroir ; 77 importateurs déclarants pour les engrais azotés. La couverture du soufre n’est pas précisée séparément. Aucun total des deux catégories.",
        2
      ],
      [
        "<tspan x=\"165\" dy=\"0\">pays importateurs dans la reconstruction miroir</tspan>",
        "<tspan x=\"165\" dy=\"0\">déclarants pour les engrais azotés</tspan>",
        1
      ]
    ],
    "expectedHash": "c7d55019c0697318fb9424f31dc0996847fa40c09fc4e89da5500e217c00e51e",
    "expectedDomHash": "6488c8baaaedcd139e9b97a5265fdd61861b766dd8642752070c03d1a81ba512",
    "metadata": {
      "figure": 4,
      "language": "fr",
      "layout": "desktop",
      "as_of": "2026-10-16",
      "source_ids": [
        "S04"
      ],
      "creator": "l0g",
      "description": "Les flux azotés en équivalent nutriment reculent d’environ 9 %. Le soufre élémentaire passe de 13,5 à 9 millions de tonnes, environ un tiers de moins. Estimations miroir ; 77 importateurs déclarants pour les engrais azotés. La couverture du soufre n’est pas précisée séparément. Aucun total des deux catégories."
    }
  },
  "trade-fr-mobile": {
    "pairs": [
      [
        "Estimations miroir à partir de 77 importateurs ; aucun total des deux catégories.",
        "Estimations miroir ; 77 importateurs déclarants pour les engrais azotés. La couverture du soufre n’est pas précisée séparément. Aucun total des deux catégories.",
        2
      ],
      [
        "<tspan x=\"24\" dy=\"0\">77 importateurs déclarants</tspan>",
        "<tspan x=\"24\" dy=\"0\">Azote : 77 déclarants</tspan>",
        1
      ]
    ],
    "expectedHash": "5f44b238a5fb2895dba6acb8d1d8f64719fc17627b5b140e7f89b24f2fb7faf8",
    "expectedDomHash": "179ac83c2ae860dd7fc94bf1de7ea139a202340deaad6181c230a3cb31a3830b",
    "metadata": {
      "figure": 4,
      "language": "fr",
      "layout": "mobile",
      "as_of": "2026-10-16",
      "source_ids": [
        "S04"
      ],
      "creator": "l0g",
      "description": "Les flux azotés en équivalent nutriment reculent d’environ 9 %. Le soufre élémentaire passe de 13,5 à 9 millions de tonnes, environ un tiers de moins. Estimations miroir ; 77 importateurs déclarants pour les engrais azotés. La couverture du soufre n’est pas précisée séparément. Aucun total des deux catégories."
    }
  },
  "trade-en-desktop": {
    "pairs": [
      [
        "Mirror estimates from 77 importing reporters; categories are not added.",
        "Mirror estimates; 77 importing reporters for nitrogen fertilizers. Sulfur coverage is not stated separately. Categories are not added.",
        2
      ],
      [
        "<tspan x=\"165\" dy=\"0\">importing reporters in the mirror reconstruction</tspan>",
        "<tspan x=\"165\" dy=\"0\">importing reporters for nitrogen fertilizers</tspan>",
        1
      ]
    ],
    "expectedHash": "e33928a65f7eed77ed66640bbeb6dc61dc4ceeaa6a6ee239df0cc0345aabb009",
    "expectedDomHash": "e52f457d9db569f7181126f8822282d0f1f4d57e1bff2e9436d4ee541011f0be",
    "metadata": {
      "figure": 4,
      "language": "en",
      "layout": "desktop",
      "as_of": "2026-10-16",
      "source_ids": [
        "S04"
      ],
      "creator": "l0g",
      "description": "Nitrogen flows in nutrient equivalents fall about 9%. Elemental sulfur falls from 13.5 to 9 million tonnes, about one-third lower. Mirror estimates; 77 importing reporters for nitrogen fertilizers. Sulfur coverage is not stated separately. Categories are not added."
    }
  },
  "trade-en-mobile": {
    "pairs": [
      [
        "Mirror estimates from 77 importing reporters; categories are not added.",
        "Mirror estimates; 77 importing reporters for nitrogen fertilizers. Sulfur coverage is not stated separately. Categories are not added.",
        2
      ],
      [
        "<tspan x=\"24\" dy=\"0\">77 importing reporters</tspan>",
        "<tspan x=\"24\" dy=\"0\">Nitrogen: 77 reporters</tspan>",
        1
      ]
    ],
    "expectedHash": "00886b9d1468ef7adc32370d7d8cbb8214f79e65bf97d647aaf41e85ad40bd90",
    "expectedDomHash": "31b5984c5788b1d5c04017c492984943322b97a70a12e83c89dbf15375807ace",
    "metadata": {
      "figure": 4,
      "language": "en",
      "layout": "mobile",
      "as_of": "2026-10-16",
      "source_ids": [
        "S04"
      ],
      "creator": "l0g",
      "description": "Nitrogen flows in nutrient equivalents fall about 9%. Elemental sulfur falls from 13.5 to 9 million tonnes, about one-third lower. Mirror estimates; 77 importing reporters for nitrogen fertilizers. Sulfur coverage is not stated separately. Categories are not added."
    }
  }
};
const kinds = ["corridor","inputs","prices","trade","bangladesh","timing"];
const variants = ['fr', 'en'].flatMap(lang => kinds.flatMap(kind => [false, true].map(mobile => ({ lang, kind, mobile, key: `${kind}-${lang}-${mobile ? 'mobile' : 'desktop'}`, svg: hormuzFertilizerSvg(lang, kind, mobile) }))));
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
  circle: 'cx cy r fill stroke stroke-width',
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
  // The supplied polylines use legal comma separators only between coordinate numbers.
  raw = raw.replace(/(?<=\d),(?=-?(?:\d|\.\d))/gu, ' ');
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
const suppliedStyleHash = "2982e7f12ce1c79881762f2457b24cb8a8744580d2f8ab66a51fa327875f55b1";
function inspect(v) {
  assert.equal(typeof v.svg, 'string'); assert.ok(v.svg.length > 100 && v.svg.length < 40000);
  assert.doesNotMatch(v.svg, /<!|<\?|&(?!amp;|lt;|gt;|quot;|apos;)/u);
  assert.equal(XMLValidator.validate(v.svg), true);
  const roots = parser.parse(v.svg); assert.equal(roots.length, 1); const root = roots[0]; assert.equal(tag(root), 'svg');
  const index = kinds.indexOf(v.kind) + 1, prefix = `fert-f${String(index).padStart(2, '0')}-${v.lang}-${v.mobile ? 'm' : 'd'}`;
  assert.deepEqual(attrs(root), { xmlns: 'http://www.w3.org/2000/svg', id: prefix, class: 'l0g-fert-svg', viewBox: originals[v.key].viewBox, role: 'img', 'aria-labelledby': `${prefix}-title ${prefix}-desc` });
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
      if (k === 'stroke-dasharray') assert.ok(['4 5','4 7','5 7'].includes(val));
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
  assert.deepEqual(JSON.parse(xmlText(nodes.find(n => tag(n) === 'metadata'))), (textCorrections[v.key]?.metadata ?? originals[v.key].metadata));
  assert.equal(xmlText(nodes.find(n => tag(n) === 'desc')), (textCorrections[v.key]?.metadata ?? originals[v.key].metadata).description);
  const [, , width, height] = attrs(root).viewBox.split(' ').map(number); return { root, nodes, width, height };
}
function faithful(v) {
 inspect(v);let original=v.svg;const correction=textCorrections[v.key];
 if(correction){
  assert.equal(digest(v.svg),correction.expectedHash);assert.equal(domHash(v.svg),correction.expectedDomHash);
  for(const[before,after,count]of [...correction.pairs].reverse()){assert.equal(original.split(after).length-1,count);original=original.replaceAll(after,before);}
 }
 assert.equal(digest(original),originals[v.key].rawHash,`${v.key}: complete original XML after reversing the exact source-backed attribution correction`);
 assert.equal(domHash(original),originals[v.key].domHash,`${v.key}: complete original browser tree`);
}
const mutate = (v, change) => { const root = parser.parse(v.svg)[0]; change(root, xmlNodes(root)); return { ...v, svg: builder.build([root]) }; };
const fontFrom = file => { const b = readFileSync(new URL(`../${file}`, import.meta.url)); return opentype.parse(b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength)); };
const fonts = Object.fromEntries([400,700].map(w => [w,fontFrom(`public/fonts/hormuz-fertilizer/liberation-sans-${w}.ttf`)]));
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
test('Hormuz fertilizer variant selection is frozen, complete and rejects coercion or prototypes', () => {
  assert.deepEqual(HORMUZ_FERTILIZER_KINDS,kinds);assert.ok(Object.isFrozen(HORMUZ_FERTILIZER_KINDS));assert.equal(variants.length,24);
  for(const lang of ['', 'FR','__proto__','constructor',{},null,['fr']])assert.throws(()=>hormuzFertilizerSvg(lang,'corridor',false),TypeError);
  for(const kind of ['', '__proto__','constructor','prototype',{},null,['corridor']])assert.throws(()=>hormuzFertilizerSvg('fr',kind,false),TypeError);
  for(const mobile of [0,1,'','false',null,new Boolean(false),{},[]])assert.throws(()=>hormuzFertilizerSvg('fr','corridor',mobile),TypeError);
  assert.equal(hormuzFertilizerSvg('fr','corridor'),hormuzFertilizerSvg('fr','corridor',false));
});
test('20 supplied SVGs retain every byte; four exact source attribution corrections reverse to complete originals', () => { for(const v of variants)faithful(v); });
test('all original glyph outlines, curve extrema and panels remain inside their canvases', () => {
 const issues=[];for(const v of variants){try{geometry(v);}catch(error){issues.push(error.message);}}assert.deepEqual(issues,[]);
});
test('geometry guards reject off-canvas shapes, labels and internal panel overflows', () => {
 const v=variants[0];
 for(const change of [(_,ns)=>{attrs(ns.find(n=>tag(n)==='rect')).x='9999';},(_,ns)=>{attrs(ns.find(n=>tag(n)==='tspan')).x='-10';},(root,ns)=>{root.svg.push(JSON.parse(JSON.stringify(ns.find(n=>tag(n)==='text'))));}])assert.throws(()=>geometry(mutate(v,change)));
 const panel=variants.find(v=>v.kind==='prices'&&v.mobile);assert.throws(()=>geometry(mutate(panel,(_,ns)=>{const n=ns.find(n=>tag(n)==='text'&&xmlText(n)==='DAP');assert.ok(n);attrs(children(n)[0]).x='175';})), /text outside panel/u);
});
test('full XML goldens reject geometry, text, metadata, stylesheet and child-order changes', () => {
 const v=variants[0];for(const change of [(_,ns)=>{attrs(ns.find(n=>tag(n)==='tspan')).x='0';},(_,ns)=>{attrs(ns.find(n=>tag(n)==='rect')).fill='var(--panel)';},(_,ns)=>{ns.find(n=>tag(n)==='title').title=[{'#text':'Changed'}];},(_,ns)=>{ns.find(n=>tag(n)==='metadata').metadata=[{'#text':'{}'}];},(_,ns)=>{ns.find(n=>tag(n)==='style').style=[{'#text':'.l0g-fert-svg{fill:red}'}];},root=>{root.svg.reverse();}])assert.throws(()=>faithful(mutate(v,change)));
});
test('passive SVG validator rejects active markup, external resources and malformed fields',()=>{
 const v=variants[0];for(const type of ['script','foreignObject','image','use','a','animate','filter'])assert.throws(()=>inspect(mutate(v,root=>{root.svg.push({[type]:[]});})));
 for(const[field,val]of [['onload','alert(1)'],['href','https://example.org/'],['xlink:href','javascript:alert(1)'],['constructor','x'],['prototype','x'],['transform','translate(0 0)'],['style','fill:red'],['font-size','Infinity'],['x','1e999'],['x','10001']])assert.throws(()=>inspect(mutate(v,(_,ns)=>{attrs(ns.find(n=>tag(n)==='text'))[field]=val;})));
 for(const val of ['url(#x)','url(https://example.org/x)','var(--bg,red)','#fff','red'])assert.throws(()=>inspect(mutate(v,(_,ns)=>{attrs(ns.find(n=>tag(n)==='rect')).fill=val;})));
 for(const val of ['url(https://example.org/x)','url(#fert-f01-fr-d-arrow-teal) trailing','url(#unknown)'])assert.throws(()=>inspect(mutate(v,(_,ns)=>{attrs(ns.find(n=>tag(n)==='path'))['marker-end']=val;})));
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
    if ([1, 16].includes(record.id)) assert.equal(record.value, 'l0g Fertilizer Sans');
    if ([2, 17].includes(record.id)) assert.equal(record.value, style);
    if ([3, 4, 18].includes(record.id)) assert.equal(record.value, `l0g Fertilizer Sans ${style}`);
    if (record.id === 6) assert.equal(record.value, `l0gFertilizerSans-${style}`);
  }
}
test('redistributed font subsets retain copyrights and use the licensed derivative family name', () => {
  for (const weight of [400, 700]) {
    const subsetBytes = readFileSync(new URL(`../public/fonts/hormuz-fertilizer/liberation-sans-${weight}.ttf`, import.meta.url));
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

const canonicalSubsetNotice = 'The redistributed SVG subsets are renamed l0g Debt Sans; their original outlines, glyph mapping and metrics are unchanged.';
const fertilizerSubsetNotice = 'The redistributed SVG subsets are renamed l0g Fertilizer Sans; their original outlines, glyph mapping and metrics are unchanged.';
function assertFertilizerLicense(licence, canonical) {
 assertFontLicenseReferences(licence,'liberation');
 assert.equal(canonical.split('\n').filter(line=>line===canonicalSubsetNotice).length,1);
 assert.equal(licence.split('\n').filter(line=>line===fertilizerSubsetNotice).length,1);
 assert.equal(licence.replace(fertilizerSubsetNotice,canonicalSubsetNotice),canonical,'Only the exact descriptive derivative-family notice differs from the complete canonical licence');
 const copyright='Digitized data copyright (c) 2010 Google Corporation';
 assert.equal(licence.split(copyright).length,2);assert.equal(canonical.split(copyright).length,2);
 assert.equal(licence.slice(licence.indexOf(copyright)),canonical.slice(canonical.indexOf(copyright)),'Every original copyright and OFL clause remains byte-identical');
}

test('dedicated fonts retain every original glyph outline, metrics and canonical complete licence', () => {
  const licence = read('public/fonts/hormuz-fertilizer/LICENSE.txt');
  assertFertilizerLicense(licence,read('src/epub-assets/debt-chain-fonts/liberation-LICENSE.txt'));
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
 const licence=read('public/fonts/hormuz-fertilizer/LICENSE.txt');
 for(const text of [licence,licence.replaceAll('\r\n','\n').replaceAll('\n','\r\n')])assertFontLicenseReferences(text,'liberation');
 const urls=['https://github.com/liberationfonts/liberation-fonts','https://github.com/liberationfonts/liberation-fonts/blob/main/LICENSE'];
 for(const url of urls)for(const replacement of [`https://github.com.evil.example${new URL(url).pathname}`,`https://github.com@evil.example${new URL(url).pathname}`,`https://evil.example/?next=${url}`,`https://evil.example/#${url}`,`https://evil.example/${url}`,url.replace('https:','http:'),`${url}?next=bad`,`${url}#bad`,`${url}/bad`,`${url} trailing`,`${url}\u0000`]){
  const lines=licence.split('\n'),i=lines.findIndex(line=>line.endsWith(url));assert.ok(i>=0);lines[i]=lines[i].slice(0,-url.length)+replacement;assert.throws(()=>assertFontLicenseReferences(lines.join('\n'),'liberation'));
 }
 for(const line of licence.split('\n').filter(l=>l.startsWith('Source:')||l.startsWith('Licence source:')))for(const text of [licence.replace(line,''),`${licence}\n${line}`,licence.replace(line,` ${line}`)])assert.throws(()=>assertFontLicenseReferences(text,'liberation'));
});
test('responsive component preserves all theme, font and breakpoint contracts',()=>{
 const component=read('src/components/HormuzFertilizerFigure.astro'),style=component.match(/<style>([\s\S]*?)<\/style>/u)?.[1];assert.ok(style);
 const css=postcss.parse(style),declarations=n=>Object.fromEntries(n.nodes.filter(d=>d.type==='decl').map(d=>[d.prop,d.value]));
 const rule=selector=>{const n=css.nodes.find(n=>n.type==='rule'&&n.selector===selector);assert.ok(n,selector);return declarations(n);};
 const mapping={bg:'ink',panel:'surface-2',ink:'paper',muted:'muted',grid:'line-strong',teal:'signal',red:'accent',gold:'amber',blue:'topic-blue',white:'ink'};
 assert.deepEqual(rule('.hormuz-fertilizer-figure :global(svg.l0g-fert-svg)'),Object.fromEntries(Object.entries(mapping).map(([k,v])=>[`--${k}`,`var(--color-${v})`])));
 const base=rule('.hormuz-fertilizer-figure');assert.deepEqual([base.width,base['max-width'],base['container-type'],base['padding-bottom'],base.overflow],['100%','760px','inline-size','.85rem','visible']);
 const graphic=rule('.hormuz-fertilizer-figure :global(svg)');assert.deepEqual([graphic.width,graphic.height,graphic['max-width'],graphic['letter-spacing'],graphic.overflow],['100%','auto','100%','normal','visible']);
 assert.equal(rule('.hormuz-fertilizer-figure :global(svg text)')['font-family'],"'l0g Fertilizer', 'Liberation Sans', Arial, sans-serif");
 const mobile=rule('.hormuz-fertilizer-mobile');assert.deepEqual([mobile.display,mobile.width,mobile['max-width'],mobile['margin-inline']],['none','100%','420px','auto']);
 const faces=css.nodes.filter(n=>n.type==='atrule'&&n.name==='font-face').map(declarations);
 assert.deepEqual(faces.map(d=>[d['font-family'],d.src,d['font-weight'],d['font-style'],d['font-display']]),[400,700].map(w=>["'l0g Fertilizer'",`url('/fonts/hormuz-fertilizer/liberation-sans-${w}.ttf') format('truetype')`,String(w),'normal','swap']));
 for(const kind of ['media','container']){
  const n=css.nodes.find(n=>n.type==='atrule'&&n.name===kind&&n.params==='(max-width: 640px)');assert.ok(n);
  assert.deepEqual(n.nodes.map(n=>[n.selector,declarations(n).display]),[['.hormuz-fertilizer-desktop','none'],['.hormuz-fertilizer-mobile','block']]);
 }
 const themes={dark:new Map(),light:new Map()};postcss.parse(read('src/styles/global.css')).walkDecls(d=>{if(d.parent.type==='atrule'&&d.parent.name==='theme')themes.dark.set(d.prop,d.value);if(d.parent.type==='rule'&&d.parent.selector===':root[data-theme="light"]')themes.light.set(d.prop,d.value);});
 for(const theme of Object.values(themes))for(const v of Object.values(mapping))assert.ok(theme.has(`--color-${v}`));
 assert.doesNotMatch(style,/#(?:[a-f0-9]{3}){1,2}\b|(?:clip-path|overflow\s*:\s*(?:hidden|clip)|transform\s*:|100vw)/iu);
 assert.equal((component.match(/set:html=/gu)??[]).length,2);assert.match(component,/set:html=\{responsiveSvg\(false\)\}/u);assert.match(component,/set:html=\{responsiveSvg\(true\)\}/u);
 assert.ok(component.includes(`const responsiveSvg = (mobile: boolean) => hormuzFertilizerSvg(lang, kind, mobile).replace(/^<svg /u, '<svg style="width:100%;height:auto" ');`));
 assert.doesNotMatch(component,/<script|client:|fetch\(|innerHTML/u);
});
const mdxNodes=n=>[n,...(n.children??[]).flatMap(mdxNodes)];
const figureSources={corridor:[1,2,15],inputs:[5,6,7,8,9],prices:[3],trade:[4],bangladesh:[11],timing:[]};
function articleFigures(raw,lang){
 const tree=createProcessor().parse(raw.replace(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/u,'')),figures=mdxNodes(tree).filter(n=>n.name==='HormuzFertilizerFigure');assert.equal(figures.length,6);
 for(const[i,n]of figures.entries()){
  const a=Object.fromEntries(n.attributes.map(a=>{assert.equal(a.type,'mdxJsxAttribute');assert.equal(typeof a.value,'string');return[a.name,a.value];}));
  assert.deepEqual(Object.keys(a).sort(),['caption','kind','lang','number','sources']);assert.equal(a.kind,kinds[i]);assert.equal(a.number,String(i+1).padStart(2,'0'));assert.equal(a.lang,lang);assert.ok(a.caption.length>70);
  const refs=a.sources.trim()?a.sources.trim().split(/\s+/u).map(Number):[];assert.deepEqual(refs,figureSources[kinds[i]]);const details=mdxNodes(n).filter(c=>c.name==='details');assert.equal(details.length,1);assert.equal(mdxNodes(details[0]).filter(c=>c.name==='summary').length,1);
 }
}
test('article native MDX includes six ordered static figures, accurate references and method notes',()=>{
 for(const lang of ['fr','en'])articleFigures(read(`src/content/${lang==='fr'?'posts/ormuz-engrais-pari-cinq-navires':'posts-en/hormuz-fertilizer-corridor-crop-calendar'}.mdx`),lang);
});

function quantitativeGeometry(v) {
 const {root}=inspect(v),ns=scene(root),rects=ns.filter(n=>tag(n)==='rect'),paths=ns.filter(n=>tag(n)==='path');
 const near=(actual,expected,tolerance=.001)=>assert.ok(Number.isFinite(actual)&&Math.abs(actual-expected)<=tolerance,`${v.key}: ${actual} != ${expected}`);
 if(v.kind==='prices'){
  // World Bank Pink Sheet, 2 October 2026, published quarterly averages. Do not reconstruct from rounded months.
  const inputs={gold:[634.7,759.5,791.8],teal:[537.7,693.5,399.2]},xs=v.mobile?[100,230,358]:[175,450,725],zero=v.mobile?651:623,scale=v.mobile?.39:383/900;
  for(const[colour,prices]of Object.entries(inputs)){
   const selected=paths.filter(n=>attrs(n).stroke===`var(--${colour})`&&value(n,'stroke-width')===(v.mobile?3:4));assert.equal(selected.length,1);
   const points=pathPoints(attrs(selected[0]).d);assert.equal(points.length,3);
   for(const[i,p]of points.entries()){near(p[0],xs[i]);near(p[1],zero-prices[i]*scale);}
   const dots=ns.filter(n=>tag(n)==='circle'&&attrs(n).stroke===`var(--${colour})`);assert.equal(dots.length,3);
   for(const[i,n]of dots.entries()){near(value(n,'cx'),xs[i]);near(value(n,'cy'),zero-prices[i]*scale);}
  }
  near((inputs.gold[2]/inputs.gold[1]-1)*100,4.25279789335089,1e-10);near((inputs.teal[2]/inputs.teal[1]-1)*100,-42.43691420331651,1e-10);
 }
 if(v.kind==='trade'){
  const base=v.mobile?227:345,nitrogen=rects.filter(n=>attrs(n).fill==='var(--teal)'&&value(n,'height')===35),sulfur=rects.filter(n=>attrs(n).fill==='var(--gold)'&&value(n,'height')===35);
  assert.equal(nitrogen.length,1);assert.equal(sulfur.length,1);near(value(nitrogen[0],'width'),base*.91);near(value(sulfur[0],'width'),base*9/13.5);
  const baselines=rects.filter(n=>attrs(n).fill==='var(--grid)'&&value(n,'height')===35);assert.equal(baselines.length,2);for(const n of baselines)near(value(n,'width'),base);
  assert.match(xmlText(ns.find(n=>tag(n)==='desc')),v.lang==='fr'?/77 importateurs déclarants pour les engrais azotés/u:/77 importing reporters for nitrogen fertilizers/u);
 }
 if(v.kind==='bangladesh'){
  const allText=ns.filter(n=>tag(n)==='text').map(xmlText).join('\n');assert.match(allText,/600[ ,]000/);assert.match(allText,/300[ ,]000/);
  if(!v.mobile){const bars=rects.filter(n=>value(n,'height')===26);assert.equal(bars.length,2);near(value(bars[1],'width')/value(bars[0],'width'),300000/600000,1e-10);}
  const days=(a,b)=>(Date.parse(b+'T00:00:00Z')-Date.parse(a+'T00:00:00Z'))/86400000,scale=v.mobile?487/days('2026-07-01','2027-05-01'):2.875;
  const aman=rects.filter(n=>attrs(n).fill==='var(--gold)'&&value(n,'rx')===(v.mobile?6:7)),boro=rects.filter(n=>attrs(n).fill==='var(--teal)'&&value(n,'rx')===(v.mobile?6:7));assert.equal(aman.length,1);assert.equal(boro.length,1);
  near(value(aman[0],v.mobile?'height':'width'),days('2026-07-01','2026-11-01')*scale);near(value(boro[0],v.mobile?'height':'width'),days('2026-10-01','2027-05-01')*scale);near(value(boro[0],v.mobile?'y':'x'),(v.mobile?723:176)+days('2026-07-01','2026-10-01')*scale);
 }
 if(v.kind==='timing'){
  const height=v.mobile?31:54,before=rects.filter(n=>attrs(n).fill==='var(--grid)'&&value(n,'height')===height),after=rects.filter(n=>attrs(n).fill==='var(--teal)'&&value(n,'height')===height);assert.equal(before.length,1);assert.equal(after.length,1);
  near(value(before[0],'width'),v.mobile?238:810);near(value(after[0],'width'),value(before[0],'width')/(1.25*1.10));
  near(1.25*1.10,1.375,1e-12);near(100/(1.25*1.10),72.72727272727273,1e-10);
 }
}
test('verified quarterly prices, separate trade units, Bangladesh targets and illustrative purchasing power retain correct plotted scales',()=>{for(const v of variants)quantitativeGeometry(v);});
test('quantitative guards reject changed price paths, indices, targets and hypothetical quantity bars',()=>{
 for(const kind of ['prices','trade','bangladesh','timing']){
  const v=variants.find(v=>v.kind===kind&&!v.mobile);
  assert.throws(()=>quantitativeGeometry(mutate(v,(_,ns)=>{
   if(kind==='prices'){const p=ns.find(n=>tag(n)==='path'&&attrs(n).stroke==='var(--gold)'&&attrs(n)['stroke-width']==='4');assert.ok(p);attrs(p).d='M175 352 L450 299 L725 300';}
   else {const height=kind==='trade'?35:kind==='bangladesh'?26:54,n=ns.find(n=>tag(n)==='rect'&&attrs(n).fill==='var(--teal)'&&value(n,'height')===height);assert.ok(n);attrs(n).width='1';}
  })));
 }
});
test('comma-delimited coordinate pairs are consumed completely without accepting malformed comma runs',()=>{
 assert.deepEqual(pathPoints('M 1,2 L 3,4 L 5,-6'),[[1,2],[3,4],[5,-6]]);
 for(const d of ['M,1 2','M1,,2','M1, 2','M1 2,','M1 2 L,3 4','M1 2 , L3 4'])assert.throws(()=>pathPoints(d));
});
test('the static root adapter adds exactly the responsive style and preserves the complete passive SVG tree',()=>{
 const component=read('src/components/HormuzFertilizerFigure.astro');assert.ok(component.includes(`const responsiveSvg = (mobile: boolean) => hormuzFertilizerSvg(lang, kind, mobile).replace(/^<svg /u, '<svg style="width:100%;height:auto" ');`));
 for(const v of variants){const adapted=v.svg.replace(/^<svg /u,'<svg style="width:100%;height:auto" '),roots=htmlNodes(parse(adapted)).filter(n=>n.tagName==='svg');assert.equal(roots.length,1);const root=roots[0];assert.equal(root.attrs.filter(a=>a.name==='style').length,1);assert.equal(root.attrs.find(a=>a.name==='style').value,'width:100%;height:auto');const projection={...root,attrs:root.attrs.filter(a=>a.name!=='style')};assert.equal(digest(JSON.stringify(canonical(projection))),textCorrections[v.key]?.expectedDomHash??originals[v.key].domHash);assert.equal(adapted.replace('<svg style="width:100%;height:auto" ','<svg '),v.svg);}
});

test('the derivative-family notice projection rejects modified, missing, duplicate or truncated legal text',()=>{
 const canonical=read('src/epub-assets/debt-chain-fonts/liberation-LICENSE.txt'),licence=read('public/fonts/hormuz-fertilizer/LICENSE.txt');assertFertilizerLicense(licence,canonical);
 for(const changed of [licence.replace(fertilizerSubsetNotice,canonicalSubsetNotice),licence.replace('l0g Fertilizer Sans','l0g Other Sans'),licence+'\n'+fertilizerSubsetNotice,licence.replace('Copyright (c) 2012 Red Hat, Inc.','Copyright changed'),licence.replace('SIL OPEN FONT LICENSE Version 1.1 - 26 February 2007','SIL OPEN FONT LICENSE altered'),licence.slice(0,-100),'Extra notice\n'+licence,licence.replaceAll('\n','\r\n')])assert.throws(()=>assertFertilizerLicense(changed,canonical));
});
