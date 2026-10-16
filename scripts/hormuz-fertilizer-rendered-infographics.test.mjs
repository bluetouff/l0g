import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { parse } from 'parse5';
const pages=['fr','en'].map(lang=>({lang,html:readFileSync(new URL(`../dist/${lang==='fr'?'posts/ormuz-engrais-pari-cinq-navires':'en/analysis/hormuz-fertilizer-corridor-crop-calendar'}/index.html`,import.meta.url),'utf8')}));
const nodes=n=>[n,...(n.childNodes??[]).flatMap(nodes)];
const attr=(n,k)=>n.attrs?.find(a=>a.name===k)?.value;
const text=n=>n.nodeName==='#text'?n.value:(n.childNodes??[]).map(text).join('');
const canonical=n=>n.nodeName==='#text'?['#text',n.value]:[n.tagName,(n.attrs??[]).map(a=>[a.name,a.value]).sort(([a],[b])=>a<b?-1:a>b?1:0),(n.childNodes??[]).filter(c=>c.nodeName!=='#text'||c.value.trim()||['text','tspan','title','desc','metadata','style'].includes(n.tagName)).map(canonical)];
// Full browser-tree goldens computed independently from the supplied passive XML.
const originals={
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
const kinds=["corridor","inputs","prices","trade","bangladesh","timing"];
const references={corridor:[1,2,15],inputs:[5,6,7,8,9],prices:[3],trade:[4],bangladesh:[11],timing:[]};
const classes=(n,name)=>(attr(n,'class')??'').split(/\s+/u).includes(name);
function figures(tree,lang){
 const all=nodes(tree),selected=all.filter(n=>n.tagName==='figure'&&classes(n,'hormuz-fertilizer-figure'));assert.equal(selected.length,6);
 for(const[i,figure]of selected.entries()){
  assert.deepEqual(['id','data-figure','data-kind'].map(k=>attr(figure,k)),[`figure-${i+1}`,String(i+1).padStart(2,'0'),kinds[i]]);
  const roots=nodes(figure).filter(n=>n.tagName==='svg');assert.equal(roots.length,2);
  for(const[j,root]of roots.entries()){
   const key=`${kinds[i]}-${lang}-${j?'mobile':'desktop'}`,prefix=`fert-f${String(i+1).padStart(2,'0')}-${lang}-${j?'m':'d'}`;
   assert.deepEqual(root.attrs.map(a=>[a.name,a.value]).sort(([a],[b])=>a<b?-1:a>b?1:0),Object.entries({xmlns:'http://www.w3.org/2000/svg',id:prefix,class:'l0g-fert-svg',viewBox:originals[key].viewBox,role:'img','aria-labelledby':`${prefix}-title ${prefix}-desc`,style:'width:100%;height:auto'}).sort(([a],[b])=>a<b?-1:a>b?1:0));
   // Remove only the already-asserted exact root responsive style; compare every remaining original field and child.
   const projection={...root,attrs:root.attrs.filter(a=>a.name!=='style')};
   const hash=createHash('sha256').update(JSON.stringify(canonical(projection))).digest('hex');assert.equal(hash,(textCorrections[key]?.expectedDomHash??originals[key].domHash),`${key}: all native geometry, text, metadata, stylesheet, markers and child order`);
   assert.ok(classes(root.parentNode,`hormuz-fertilizer-${j?'mobile':'desktop'}`));
   for(const type of ['title','desc']){const found=nodes(root).filter(n=>n.tagName===type);assert.equal(found.length,1);assert.equal(attr(found[0],'id'),`${prefix}-${type}`);assert.ok(text(found[0]).trim());}
  }
  const caption=nodes(figure).filter(n=>n.tagName==='figcaption');assert.equal(caption.length,1);assert.ok(text(caption[0]).length>70);
  const links=nodes(caption[0]).filter(n=>n.tagName==='a');assert.deepEqual(links.map(n=>[attr(n,'href'),text(n)]),references[kinds[i]].map(n=>[`#source-s${String(n).padStart(2,'0')}`,`[S${String(n).padStart(2,'0')}]`]));
  for(const id of references[kinds[i]])assert.equal(all.filter(n=>attr(n,'id')===`source-s${String(id).padStart(2,'0')}`).length,1);
  const details=nodes(figure).filter(n=>n.tagName==='details');assert.equal(details.length,1);assert.equal(nodes(details[0]).filter(n=>n.tagName==='summary').length,1);assert.ok(text(details[0]).length>100);
 }
 const ids=all.map(n=>attr(n,'id')).filter(Boolean);assert.equal(new Set(ids).size,ids.length,'Every document ID remains unique');
}
function setAttribute(n,k,value){const a=n.attrs.find(a=>a.name===k);if(a)a.value=value;else n.attrs.push({name:k,value});}
test('compiled FR/EN preserve24 complete originals and six accessible figures each',()=>{for(const page of pages)figures(parse(page.html),page.lang);});
test('compiled SVG checks detect changed native geometry, labels, styles and active nodes',()=>{
 const pick=tree=>nodes(tree).find(n=>n.tagName==='svg'&&attr(n,'id')==='fert-f01-fr-d');
 for(const field of ['id','viewBox','role','aria-labelledby','style']){const tree=parse(pages[0].html);setAttribute(pick(tree),field,'changed');assert.throws(()=>figures(tree,'fr'));}
 {const tree=parse(pages[0].html);pick(tree).attrs=pick(tree).attrs.filter(a=>a.name!=='style');assert.throws(()=>figures(tree,'fr'));}
 for(const[field,value]of [['font-family','Arial'],['font-size','1'],['x','0'],['fill','url(https://example.org/x)']]){const tree=parse(pages[0].html),label=nodes(pick(tree)).find(n=>n.tagName==='text');setAttribute(label,field,value);assert.throws(()=>figures(tree,'fr'));}
 for(const type of ['script','foreignObject','image','animate']){const tree=parse(pages[0].html);pick(tree).childNodes.push({nodeName:type,tagName:type,attrs:[],childNodes:[]});assert.throws(()=>figures(tree,'fr'));}
 for(const type of ['tspan','style','metadata','path']){const tree=parse(pages[0].html),n=nodes(pick(tree)).find(n=>n.tagName===type);if(type==='path')setAttribute(n,'d','M0 0 L9999 0');else n.childNodes=[{nodeName:'#text',value:'changed'}];assert.throws(()=>figures(tree,'fr'));}
});
