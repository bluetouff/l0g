import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { parse } from 'parse5';
const pages=['fr','en'].map(lang=>({lang,html:readFileSync(new URL(`../dist/${lang==='fr'?'posts/credit-prive-prix-argent-a-placer':'en/analysis/private-credit-test-of-patience'}/index.html`,import.meta.url),'utf8')}));
const nodes=n=>[n,...(n.childNodes??[]).flatMap(nodes)];
const attr=(n,k)=>n.attrs?.find(a=>a.name===k)?.value;
const text=n=>n.nodeName==='#text'?n.value:(n.childNodes??[]).map(text).join('');
const canonical=n=>n.nodeName==='#text'?['#text',n.value]:[n.tagName,(n.attrs??[]).map(a=>[a.name,a.value]).sort(([a],[b])=>a<b?-1:a>b?1:0),(n.childNodes??[]).filter(c=>c.nodeName!=='#text'||c.value.trim()||['text','tspan','title','desc','metadata','style'].includes(n.tagName)).map(canonical)];
// Full browser-tree goldens computed independently from the supplied passive XML.
const originals={
  "observations-fr-desktop": {
    "rawHash": "e88ff2f7f868f97270786005be6859b15d59662661e24368e829e81e97983116",
    "domHash": "51fd47088ea4e8fbbda043b674a57b17bed688f439b5fbed7bac5ee528cd6945",
    "viewBox": "0 0 1100 950",
    "metadata": {
      "figure": 1,
      "language": "fr",
      "layout": "desktop",
      "as_of": "2026-10-16",
      "source_ids": [
        "S01"
      ],
      "creator": "l0g",
      "description": "Collecte janvier–septembre 2026 : 129,15 milliards de dollars, +35 %. Prêts estimés T3 2026 : 49,77 milliards, −28 %. Au T3, refinancements privé vers syndiqué 16,39 milliards ; sens inverse 2,60 milliards."
    }
  },
  "observations-fr-mobile": {
    "rawHash": "9bf916934235866c336f51b39dfb2683522e4608b961f2a47acda4752735eaeb",
    "domHash": "eff4ab25434223a4db1a7d695cbbfce1509d845dac289d9be2f1d3f81f7881b1",
    "viewBox": "0 0 420 1160",
    "metadata": {
      "figure": 1,
      "language": "fr",
      "layout": "mobile",
      "as_of": "2026-10-16",
      "source_ids": [
        "S01"
      ],
      "creator": "l0g",
      "description": "Collecte janvier–septembre 2026 : 129,15 milliards de dollars, +35 %. Prêts estimés T3 2026 : 49,77 milliards, −28 %. Au T3, refinancements privé vers syndiqué 16,39 milliards ; sens inverse 2,60 milliards."
    }
  },
  "commitments-fr-desktop": {
    "rawHash": "834ea84841322da28a73e4c938996eaa83d6d83bf07eb1470b6c0b163fa73e1d",
    "domHash": "141929c6f442ce047ae4788a2a50aa18e2e3496766d81bc916ea998de211b4c1",
    "viewBox": "0 0 1100 1020",
    "metadata": {
      "figure": 2,
      "language": "fr",
      "layout": "desktop",
      "as_of": "2026-10-16",
      "source_ids": [
        "S02",
        "S03"
      ],
      "creator": "l0g",
      "description": "100 promis : 60 restent chez les investisseurs et 40 sont appelés. Dans le fonds : 30 prêtés et 10 de cash. Réconciliation 100 = 60 + 30 + 10."
    }
  },
  "commitments-fr-mobile": {
    "rawHash": "a31f7ee27e35c1bde0a3ea121538d90ef851138c09d31323cb279d486348ff93",
    "domHash": "d2299991c35889ec75a539deaef42f2654c13f905bc75afffa5f7219e4018a58",
    "viewBox": "0 0 420 1400",
    "metadata": {
      "figure": 2,
      "language": "fr",
      "layout": "mobile",
      "as_of": "2026-10-16",
      "source_ids": [
        "S02",
        "S03"
      ],
      "creator": "l0g",
      "description": "100 promis : 60 restent chez les investisseurs et 40 sont appelés. Dans le fonds : 30 prêtés et 10 de cash. Réconciliation 100 = 60 + 30 + 10."
    }
  },
  "borrowers-fr-desktop": {
    "rawHash": "5d9360325598766b33436a12cf1d23e025fea1f9f556ab44848fdb54ab177e19",
    "domHash": "396de7641aee3668945f161dadc7740d099e8419d9ca6cd78111a65cf065554b",
    "viewBox": "0 0 1100 960",
    "metadata": {
      "figure": 3,
      "language": "fr",
      "layout": "desktop",
      "as_of": "2026-10-16",
      "source_ids": [
        "S04",
        "S05"
      ],
      "creator": "l0g",
      "description": "Grandes entreprises : 16 % privé seul, 41 % deux marchés, 43 % syndiqué seul. Petites : 57 %, 25 %, 18 %. Pourcentages arrondis en nombre de sociétés ; seuil de chiffre d’affaires 250 millions de dollars."
    }
  },
  "borrowers-fr-mobile": {
    "rawHash": "d698d639a1376af5fdcda0ef552d1efd1bc0c22fade780cbdf4fc1af0d29a6e6",
    "domHash": "48da27120fa1ff9dcedc643e5dbd5b905fe3ffb7c34bc96d3becdbaddffdd80b",
    "viewBox": "0 0 420 1190",
    "metadata": {
      "figure": 3,
      "language": "fr",
      "layout": "mobile",
      "as_of": "2026-10-16",
      "source_ids": [
        "S04",
        "S05"
      ],
      "creator": "l0g",
      "description": "Grandes entreprises : 16 % privé seul, 41 % deux marchés, 43 % syndiqué seul. Petites : 57 %, 25 %, 18 %. Pourcentages arrondis en nombre de sociétés ; seuil de chiffre d’affaires 250 millions de dollars."
    }
  },
  "ebitda-fr-desktop": {
    "rawHash": "46b93f5afa1244fd409d81d38fd185ad4e0a3034b159bd2c6d575de14c2ea358",
    "domHash": "e71c57adbddba74eaccc7e1dd886e39807ab250d6d47f50b4868a29bd8ea65f3",
    "viewBox": "0 0 1100 1160",
    "metadata": {
      "figure": 4,
      "language": "fr",
      "layout": "desktop",
      "as_of": "2026-10-16",
      "source_ids": [
        "S06",
        "S07"
      ],
      "creator": "l0g",
      "description": "Levier moyen US Proskauer : 4,8x en 2024 et 5,1x en 2025. Exemple : dette120, EBITDA20, ajout permis5 ; le ratio passe de6x à4,8x et respecte un plafond fictif5x."
    }
  },
  "ebitda-fr-mobile": {
    "rawHash": "a955e034be76eccd4c0e09408c1ab1c45c7afb554cdaeb1b46850b40831959a1",
    "domHash": "5db951d94623f8ced9976ee7e90b2e792a71805aa6cd176d9261c20f6c15f0ed",
    "viewBox": "0 0 420 1640",
    "metadata": {
      "figure": 4,
      "language": "fr",
      "layout": "mobile",
      "as_of": "2026-10-16",
      "source_ids": [
        "S06",
        "S07"
      ],
      "creator": "l0g",
      "description": "Levier moyen US Proskauer : 4,8x en 2024 et 5,1x en 2025. Exemple : dette120, EBITDA20, ajout permis5 ; le ratio passe de6x à4,8x et respecte un plafond fictif5x."
    }
  },
  "pik-fr-desktop": {
    "rawHash": "3a866699b639627be1f673917c8df0e411c2c13337321bfcff3c872863b612a5",
    "domHash": "ec44af383ff61fecb59b02127898c338d020568a6b22cf333a3d7e9f9f54b9aa",
    "viewBox": "0 0 1100 1180",
    "metadata": {
      "figure": 5,
      "language": "fr",
      "layout": "desktop",
      "as_of": "2026-10-16",
      "source_ids": [
        "S15",
        "S16"
      ],
      "creator": "l0g",
      "description": "Principal de100 à112,49 après trois ans, cash cumulé18,73 au lieu de30 avec coupon intégralement payé. Capitalisation annuelle sans défaut, frais ou remboursement."
    }
  },
  "pik-fr-mobile": {
    "rawHash": "65e99d67aa91f61269806c9533c048d4f4a8ef2b92973a15603f22279a102c03",
    "domHash": "9b1d2ee00857c95c1aea130f7218a249a5a394b20edce73d0cf5386e2b0ed8a7",
    "viewBox": "0 0 420 1550",
    "metadata": {
      "figure": 5,
      "language": "fr",
      "layout": "mobile",
      "as_of": "2026-10-16",
      "source_ids": [
        "S15",
        "S16"
      ],
      "creator": "l0g",
      "description": "Principal de100 à112,49 après trois ans, cash cumulé18,73 au lieu de30 avec coupon intégralement payé. Capitalisation annuelle sans défaut, frais ou remboursement."
    }
  },
  "leverage-fr-desktop": {
    "rawHash": "a6a74ae0c12d7a32ff44d6db3f2e4c1d763ce4a0ed44e75c4838fb2ecb60e92f",
    "domHash": "90bc909ee4a6682160991eebdf438238215e8284ba22d65bc5501b9bbdcbc3fe",
    "viewBox": "0 0 1100 1120",
    "metadata": {
      "figure": 6,
      "language": "fr",
      "layout": "desktop",
      "as_of": "2026-10-16",
      "source_ids": [
        "S11",
        "S15"
      ],
      "creator": "l0g",
      "description": "Échantillon Fed2012T3–2023T4 : les cinq premières banques représentent64,75% des prêts utilisés par les BDC. Exemple séparé : 200actifs,100dette,100fonds propres ; -10%actifs donne80fonds propres,-20%."
    }
  },
  "leverage-fr-mobile": {
    "rawHash": "e0dac5854408143baf1d8fb9ec7b6a0b1d09e513179aa66cbd83fb215f72d87a",
    "domHash": "56971d11c55c163785f9fc8c0c71badf2c0b70a98efa7ae3f13e5ac027b8999b",
    "viewBox": "0 0 420 1610",
    "metadata": {
      "figure": 6,
      "language": "fr",
      "layout": "mobile",
      "as_of": "2026-10-16",
      "source_ids": [
        "S11",
        "S15"
      ],
      "creator": "l0g",
      "description": "Échantillon Fed2012T3–2023T4 : les cinq premières banques représentent64,75% des prêts utilisés par les BDC. Exemple séparé : 200actifs,100dette,100fonds propres ; -10%actifs donne80fonds propres,-20%."
    }
  },
  "observations-en-desktop": {
    "rawHash": "d513771473faac9e1e36117f913362c1099ff1f210d6a46b70e2d05d8e860434",
    "domHash": "e4b5f1086c28ea2f18cda38a179a0eaeb5c193416219e0a554129e66e7db2b60",
    "viewBox": "0 0 1100 950",
    "metadata": {
      "figure": 1,
      "language": "en",
      "layout": "desktop",
      "as_of": "2026-10-16",
      "source_ids": [
        "S01"
      ],
      "creator": "l0g",
      "description": "Jan–Sep 2026 fundraising: US$129.15bn, +35%. Estimated Q3 lending: US$49.77bn, −28%. Q3 refinancing: private to syndicated US$16.39bn; reverse US$2.60bn."
    }
  },
  "observations-en-mobile": {
    "rawHash": "737d479708b33bf8e38f58ea4350f13481977e4b6477a94a69811118422a6942",
    "domHash": "9a8f02cef87d9ba4034e3fb44fc1d5b49c2f1e9955fa81aef5c70f08bb5775d5",
    "viewBox": "0 0 420 1160",
    "metadata": {
      "figure": 1,
      "language": "en",
      "layout": "mobile",
      "as_of": "2026-10-16",
      "source_ids": [
        "S01"
      ],
      "creator": "l0g",
      "description": "Jan–Sep 2026 fundraising: US$129.15bn, +35%. Estimated Q3 lending: US$49.77bn, −28%. Q3 refinancing: private to syndicated US$16.39bn; reverse US$2.60bn."
    }
  },
  "commitments-en-desktop": {
    "rawHash": "69d3b10d1fa50569c3e2aac80b2d2c28ecb7ffa04a88a96ff6572a0ef2122ad8",
    "domHash": "d39159e73b5b7f3deacc87bca693db01e18ec54f9cfac2cd999de797e1d6bd31",
    "viewBox": "0 0 1100 1020",
    "metadata": {
      "figure": 2,
      "language": "en",
      "layout": "desktop",
      "as_of": "2026-10-16",
      "source_ids": [
        "S02",
        "S03"
      ],
      "creator": "l0g",
      "description": "100 committed: 60 remains with investors and 40 is called. Inside the fund, 30 is lent and 10 held in cash. Reconciliation: 100 = 60 + 30 + 10."
    }
  },
  "commitments-en-mobile": {
    "rawHash": "25ee515516465c1e2737677bfc8d0dbf95833303ff4598fd2ea567cc1199c192",
    "domHash": "84abae1bf7c6adb6dbde5c571119ec32f0562513a4353cc9198afd4ad92c262d",
    "viewBox": "0 0 420 1400",
    "metadata": {
      "figure": 2,
      "language": "en",
      "layout": "mobile",
      "as_of": "2026-10-16",
      "source_ids": [
        "S02",
        "S03"
      ],
      "creator": "l0g",
      "description": "100 committed: 60 remains with investors and 40 is called. Inside the fund, 30 is lent and 10 held in cash. Reconciliation: 100 = 60 + 30 + 10."
    }
  },
  "borrowers-en-desktop": {
    "rawHash": "fcbc651ddee187796140d5687ce9ce37a4465b96968ecce104a5385dbb7fe5eb",
    "domHash": "f02e06e12500ecba74268e5849547fe95e87c37ba2b7f377e25243c0f1baccea",
    "viewBox": "0 0 1100 960",
    "metadata": {
      "figure": 3,
      "language": "en",
      "layout": "desktop",
      "as_of": "2026-10-16",
      "source_ids": [
        "S04",
        "S05"
      ],
      "creator": "l0g",
      "description": "Larger firms: 16% private only, 41% both, 43% syndicated only. Smaller firms: 57%, 25%, 18%. Rounded borrower shares; US$250 million revenue threshold."
    }
  },
  "borrowers-en-mobile": {
    "rawHash": "a904a369cd3d86fcda2753e3aa0f50ec3132c4b3d311a82c5328266a9bbe5fec",
    "domHash": "4f431bbbbf7752196458fb4f87482ce467eb1feb06f8ca44f2599ad45fd8851b",
    "viewBox": "0 0 420 1190",
    "metadata": {
      "figure": 3,
      "language": "en",
      "layout": "mobile",
      "as_of": "2026-10-16",
      "source_ids": [
        "S04",
        "S05"
      ],
      "creator": "l0g",
      "description": "Larger firms: 16% private only, 41% both, 43% syndicated only. Smaller firms: 57%, 25%, 18%. Rounded borrower shares; US$250 million revenue threshold."
    }
  },
  "ebitda-en-desktop": {
    "rawHash": "b2baea8f983fa302fc6d25e54d208df6a00f89e552bd6a133f360da5c4bf1043",
    "domHash": "bd63b25f4d340daa60ea4a3865db1129534e79e718f191c5a67a4f58f536974d",
    "viewBox": "0 0 1100 1160",
    "metadata": {
      "figure": 4,
      "language": "en",
      "layout": "desktop",
      "as_of": "2026-10-16",
      "source_ids": [
        "S06",
        "S07"
      ],
      "creator": "l0g",
      "description": "Proskauer US mean closing leverage: 4.8x in 2024 and 5.1x in 2025. Example: debt120, EBITDA20, permitted add-back5. Leverage falls from6x to4.8x against an illustrative5x limit."
    }
  },
  "ebitda-en-mobile": {
    "rawHash": "e350b4fead7fe71093bf152ec50ac85b0bbb7ab0004851af7842a5f1c02f6206",
    "domHash": "36b3c387109824d642a73887835eda848486ad7d4b4cc89d34df7b2a706eb0be",
    "viewBox": "0 0 420 1640",
    "metadata": {
      "figure": 4,
      "language": "en",
      "layout": "mobile",
      "as_of": "2026-10-16",
      "source_ids": [
        "S06",
        "S07"
      ],
      "creator": "l0g",
      "description": "Proskauer US mean closing leverage: 4.8x in 2024 and 5.1x in 2025. Example: debt120, EBITDA20, permitted add-back5. Leverage falls from6x to4.8x against an illustrative5x limit."
    }
  },
  "pik-en-desktop": {
    "rawHash": "d724135adbb72f1ab28d3f172f41f15cb29c1d86fa472909f037f9f118d8007c",
    "domHash": "f92a3034414137e122e6b8fd0160e4470a920c3db3b0503030e9723db5f7fc29",
    "viewBox": "0 0 1100 1180",
    "metadata": {
      "figure": 5,
      "language": "en",
      "layout": "desktop",
      "as_of": "2026-10-16",
      "source_ids": [
        "S15",
        "S16"
      ],
      "creator": "l0g",
      "description": "Principal rises from100 to112.49 over three years; cumulative cash18.73 instead of30 under an all-cash coupon. Annual compounding, no default, fees or principal repayment."
    }
  },
  "pik-en-mobile": {
    "rawHash": "1f9704c6db96491ea1a1502f5014214de55168ee407b5ff1c9d7f71974759318",
    "domHash": "d5957b617049866aedc4aa77b231dca7d5d81ff95c59f4b17fce380d901993c6",
    "viewBox": "0 0 420 1550",
    "metadata": {
      "figure": 5,
      "language": "en",
      "layout": "mobile",
      "as_of": "2026-10-16",
      "source_ids": [
        "S15",
        "S16"
      ],
      "creator": "l0g",
      "description": "Principal rises from100 to112.49 over three years; cumulative cash18.73 instead of30 under an all-cash coupon. Annual compounding, no default, fees or principal repayment."
    }
  },
  "leverage-en-desktop": {
    "rawHash": "8eaeca1778c71a96c4c94ea57db991d7932041a62b4e601fadd4320f17329ad1",
    "domHash": "27f707a12a1abf7c293acb87c0e38131376d0480fcbdfd1f0fb5cb9108327216",
    "viewBox": "0 0 1100 1120",
    "metadata": {
      "figure": 6,
      "language": "en",
      "layout": "desktop",
      "as_of": "2026-10-16",
      "source_ids": [
        "S11",
        "S15"
      ],
      "creator": "l0g",
      "description": "Fed2012Q3–2023Q4 sample: top five banks provide64.75% of utilized BDC bank lending. Separate example:200assets,100debt,100equity; a10%asset loss leaves80equity, a20%decline."
    }
  },
  "leverage-en-mobile": {
    "rawHash": "237310660a03d4f480f05cfacf804b0a9db496009a7415ff912369885069badc",
    "domHash": "55f7692902f1cf06a15e01d141e4d4b6d05297000e3544c393b3a478beac73c4",
    "viewBox": "0 0 420 1610",
    "metadata": {
      "figure": 6,
      "language": "en",
      "layout": "mobile",
      "as_of": "2026-10-16",
      "source_ids": [
        "S11",
        "S15"
      ],
      "creator": "l0g",
      "description": "Fed2012Q3–2023Q4 sample: top five banks provide64.75% of utilized BDC bank lending. Separate example:200assets,100debt,100equity; a10%asset loss leaves80equity, a20%decline."
    }
  }
};
const textCorrections={
  "observations-fr-desktop": {
    "pairs": [
      [
        "Une tension, pas un solde de trésorerie",
        "Périodes et univers distincts",
        1
      ]
    ],
    "expectedHash": "13583f803b9364e10f6abc8fbf24abf28e908de0776fa29634303d7e15273f8b",
    "expectedDomHash": "2c886a4c4852b1cb5554f9d4ced3567382bfe62428747aaf18381fe749bc941b",
    "metadata": {
      "figure": 1,
      "language": "fr",
      "layout": "desktop",
      "as_of": "2026-10-16",
      "source_ids": [
        "S01"
      ],
      "creator": "l0g",
      "description": "Collecte janvier–septembre 2026 : 129,15 milliards de dollars, +35 %. Prêts estimés T3 2026 : 49,77 milliards, −28 %. Au T3, refinancements privé vers syndiqué 16,39 milliards ; sens inverse 2,60 milliards."
    }
  },
  "borrowers-fr-desktop": {
    "pairs": [
      [
        "Un pouvoir de négociation inégal",
        "Historique des financements",
        1
      ]
    ],
    "expectedHash": "a45e5646b4f2511cc7c1543f730cdf23bec262ed116fce17c020a32e46901cec",
    "expectedDomHash": "21819e4d44fe8c613b5deb68c5aaccfc58d43f86fc0beddbed11c3852d6a13f5",
    "metadata": {
      "figure": 3,
      "language": "fr",
      "layout": "desktop",
      "as_of": "2026-10-16",
      "source_ids": [
        "S04",
        "S05"
      ],
      "creator": "l0g",
      "description": "Grandes entreprises : 16 % privé seul, 41 % deux marchés, 43 % syndiqué seul. Petites : 57 %, 25 %, 18 %. Pourcentages arrondis en nombre de sociétés ; seuil de chiffre d’affaires 250 millions de dollars."
    }
  },
  "borrowers-fr-mobile": {
    "pairs": [
      [
        "Historique, pas guichet garanti",
        "Historique des financements",
        1
      ]
    ],
    "expectedHash": "d433531b25810824586b66518df1b5bba9be7982cea60e1b6556e496aa92417b",
    "expectedDomHash": "2aed0b520cb7c5613fb75d06132ad6df15cd911a3f9f781e09132848eacf7c4a",
    "metadata": {
      "figure": 3,
      "language": "fr",
      "layout": "mobile",
      "as_of": "2026-10-16",
      "source_ids": [
        "S04",
        "S05"
      ],
      "creator": "l0g",
      "description": "Grandes entreprises : 16 % privé seul, 41 % deux marchés, 43 % syndiqué seul. Petites : 57 %, 25 %, 18 %. Pourcentages arrondis en nombre de sociétés ; seuil de chiffre d’affaires 250 millions de dollars."
    }
  },
  "leverage-fr-desktop": {
    "pairs": [
      [
        "Un canal de financement, pas un défaut bancaire automatique",
        "Financement bancaire et transmission du risque",
        1
      ]
    ],
    "expectedHash": "cf5a1776cae5e8ec2efb06d6a90757549db8bd6e85df0c5dd60e19efdea493d8",
    "expectedDomHash": "2f688ef86829fbd4e4c82279348e27e551bda923d0fcdd0fbe80d00cfac7ae41",
    "metadata": {
      "figure": 6,
      "language": "fr",
      "layout": "desktop",
      "as_of": "2026-10-16",
      "source_ids": [
        "S11",
        "S15"
      ],
      "creator": "l0g",
      "description": "Échantillon Fed2012T3–2023T4 : les cinq premières banques représentent64,75% des prêts utilisés par les BDC. Exemple séparé : 200actifs,100dette,100fonds propres ; -10%actifs donne80fonds propres,-20%."
    }
  },
  "observations-en-desktop": {
    "pairs": [
      [
        "A tension, not a cash balance",
        "Different periods and coverage",
        1
      ]
    ],
    "expectedHash": "1d51ac181b1ba6f12ce043e0d0a491285ce6134f887650aa21f9b51f77044e23",
    "expectedDomHash": "2ccc4e7db8bc7751e56089e3a8065ed32b9530a32b356c2fd3033f2171c67951",
    "metadata": {
      "figure": 1,
      "language": "en",
      "layout": "desktop",
      "as_of": "2026-10-16",
      "source_ids": [
        "S01"
      ],
      "creator": "l0g",
      "description": "Jan–Sep 2026 fundraising: US$129.15bn, +35%. Estimated Q3 lending: US$49.77bn, −28%. Q3 refinancing: private to syndicated US$16.39bn; reverse US$2.60bn."
    }
  },
  "borrowers-en-desktop": {
    "pairs": [
      [
        "Unequal negotiating options",
        "Observed financing history",
        1
      ]
    ],
    "expectedHash": "f36d622e5e60057fec41decd54b8b933d1514e8612d397610af8739053a9bf5e",
    "expectedDomHash": "382e6d31d1c2bf07dc26bf415858a702eab4e8729e4d92bdb9cb180bde6aba58",
    "metadata": {
      "figure": 3,
      "language": "en",
      "layout": "desktop",
      "as_of": "2026-10-16",
      "source_ids": [
        "S04",
        "S05"
      ],
      "creator": "l0g",
      "description": "Larger firms: 16% private only, 41% both, 43% syndicated only. Smaller firms: 57%, 25%, 18%. Rounded borrower shares; US$250 million revenue threshold."
    }
  },
  "borrowers-en-mobile": {
    "pairs": [
      [
        "History, not guaranteed access",
        "Observed financing history",
        1
      ]
    ],
    "expectedHash": "262fb718460637c1bd2cd455c9220b17d0538d8a12d60632118b57ef3de54d87",
    "expectedDomHash": "fb07d8fdcb20924fa0b99ab7737cafe66a7fd016252ec3021a71da2a319a31a7",
    "metadata": {
      "figure": 3,
      "language": "en",
      "layout": "mobile",
      "as_of": "2026-10-16",
      "source_ids": [
        "S04",
        "S05"
      ],
      "creator": "l0g",
      "description": "Larger firms: 16% private only, 41% both, 43% syndicated only. Smaller firms: 57%, 25%, 18%. Rounded borrower shares; US$250 million revenue threshold."
    }
  },
  "leverage-en-desktop": {
    "pairs": [
      [
        "A funding channel, not an automatic bank default",
        "Bank funding and risk transmission",
        1
      ]
    ],
    "expectedHash": "06985e6011e9961940d2411684ea33e012572cc8a9e4ccbcb380e2c6c4bc0794",
    "expectedDomHash": "c05aa00a9e798a15e4d8a5ce4ba2486bbef565b23d9950f0d1e8264b4c96055d",
    "metadata": {
      "figure": 6,
      "language": "en",
      "layout": "desktop",
      "as_of": "2026-10-16",
      "source_ids": [
        "S11",
        "S15"
      ],
      "creator": "l0g",
      "description": "Fed2012Q3–2023Q4 sample: top five banks provide64.75% of utilized BDC bank lending. Separate example:200assets,100debt,100equity; a10%asset loss leaves80equity, a20%decline."
    }
  },
  "commitments-fr-desktop": {
    "pairs": [
      [
        "L’argent promis n’est pas encore prêté",
        "Du capital promis aux prêts",
        2
      ]
    ],
    "expectedHash": "2b3a76abafc0f0251184ff78379cc49e1e9962816699a8a5ba9a31a15536646b",
    "expectedDomHash": "0181926431e4c0fba7f1e25ad03cd92c7f65e2e08d09df8045b6fc8da93fb129",
    "metadata": {
      "figure": 2,
      "language": "fr",
      "layout": "desktop",
      "as_of": "2026-10-16",
      "source_ids": [
        "S02",
        "S03"
      ],
      "creator": "l0g",
      "description": "100 promis : 60 restent chez les investisseurs et 40 sont appelés. Dans le fonds : 30 prêtés et 10 de cash. Réconciliation 100 = 60 + 30 + 10."
    }
  },
  "commitments-fr-mobile": {
    "pairs": [
      [
        "L’argent promis n’est pas encore prêté",
        "Du capital promis aux prêts",
        1
      ],
      [
        "<tspan x=\"24\" dy=\"0\">L’argent promis n’est pas</tspan>",
        "<tspan x=\"24\" dy=\"0\">Du capital promis</tspan>",
        1
      ],
      [
        "<tspan x=\"24\" dy=\"27.12\">encore prêté</tspan>",
        "<tspan x=\"24\" dy=\"27.12\">aux prêts</tspan>",
        1
      ]
    ],
    "expectedHash": "af443bbc27242ad4bc7dd0b1474f9d27173afe137b9cabe5e70f93efcd5ba8a4",
    "expectedDomHash": "5b5aa7aa254934f2344fcd71e80a488507e760f9abe839e624befe5dc0282823",
    "metadata": {
      "figure": 2,
      "language": "fr",
      "layout": "mobile",
      "as_of": "2026-10-16",
      "source_ids": [
        "S02",
        "S03"
      ],
      "creator": "l0g",
      "description": "100 promis : 60 restent chez les investisseurs et 40 sont appelés. Dans le fonds : 30 prêtés et 10 de cash. Réconciliation 100 = 60 + 30 + 10."
    }
  },
  "commitments-en-desktop": {
    "pairs": [
      [
        "Committed money has yet to be lent",
        "From committed capital to loans",
        2
      ]
    ],
    "expectedHash": "1fcb54e1f2b326d5d04381a11a5cdca6ee7411c6b8265a1a0dda2d31e5094954",
    "expectedDomHash": "3a5d86661e1085944932f630538084f731d7bf10b8daee506798b1e4036e9bd7",
    "metadata": {
      "figure": 2,
      "language": "en",
      "layout": "desktop",
      "as_of": "2026-10-16",
      "source_ids": [
        "S02",
        "S03"
      ],
      "creator": "l0g",
      "description": "100 committed: 60 remains with investors and 40 is called. Inside the fund, 30 is lent and 10 held in cash. Reconciliation: 100 = 60 + 30 + 10."
    }
  },
  "commitments-en-mobile": {
    "pairs": [
      [
        "Committed money has yet to be lent",
        "From committed capital to loans",
        1
      ],
      [
        "<tspan x=\"24\" dy=\"0\">Committed money has yet to</tspan>",
        "<tspan x=\"24\" dy=\"0\">From committed capital</tspan>",
        1
      ],
      [
        "<tspan x=\"24\" dy=\"27.12\">be lent</tspan>",
        "<tspan x=\"24\" dy=\"27.12\">to loans</tspan>",
        1
      ]
    ],
    "expectedHash": "bf5571792f0973230f572e1ca4cc9ca01436f69f65f131617de3347afbf5f040",
    "expectedDomHash": "e06f04f90d665e4a108f3cf6d4ff86c895cd8d431c516c9adca4efdcb1000df3",
    "metadata": {
      "figure": 2,
      "language": "en",
      "layout": "mobile",
      "as_of": "2026-10-16",
      "source_ids": [
        "S02",
        "S03"
      ],
      "creator": "l0g",
      "description": "100 committed: 60 remains with investors and 40 is called. Inside the fund, 30 is lent and 10 held in cash. Reconciliation: 100 = 60 + 30 + 10."
    }
  }
};
const kinds=["observations","commitments","borrowers","ebitda","pik","leverage"];
const references={observations:[1],commitments:[2,3],borrowers:[4,5],ebitda:[6,7],pik:[15,16],leverage:[11,15]};
const classes=(n,name)=>(attr(n,'class')??'').split(/\s+/u).includes(name);
function figures(tree,lang){
 const all=nodes(tree),selected=all.filter(n=>n.tagName==='figure'&&classes(n,'private-credit-discipline-figure'));assert.equal(selected.length,6);
 for(const[i,figure]of selected.entries()){
  assert.deepEqual(['id','data-figure','data-kind'].map(k=>attr(figure,k)),[`figure-${i+1}`,String(i+1).padStart(2,'0'),kinds[i]]);
  const roots=nodes(figure).filter(n=>n.tagName==='svg');assert.equal(roots.length,2);
  for(const[j,root]of roots.entries()){
   const key=`${kinds[i]}-${lang}-${j?'mobile':'desktop'}`,prefix=`credit-f${String(i+1).padStart(2,'0')}-${lang}-${j?'m':'d'}`;
   assert.deepEqual(root.attrs.map(a=>[a.name,a.value]).sort(([a],[b])=>a<b?-1:a>b?1:0),Object.entries({xmlns:'http://www.w3.org/2000/svg',id:prefix,class:'l0g-credit-svg',viewBox:originals[key].viewBox,role:'img','aria-labelledby':`${prefix}-title ${prefix}-desc`,style:'width:100%;height:auto'}).sort(([a],[b])=>a<b?-1:a>b?1:0));
   // Remove only the already-asserted exact root responsive style; compare every remaining original field and child.
   const projection={...root,attrs:root.attrs.filter(a=>a.name!=='style')};
   const hash=createHash('sha256').update(JSON.stringify(canonical(projection))).digest('hex');assert.equal(hash,(textCorrections[key]?.expectedDomHash??originals[key].domHash),`${key}: all native geometry, text, metadata, stylesheet, markers and child order`);
   assert.ok(classes(root.parentNode,`private-credit-discipline-${j?'mobile':'desktop'}`));
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
 const pick=tree=>nodes(tree).find(n=>n.tagName==='svg'&&attr(n,'id')==='credit-f01-fr-d');
 for(const field of ['id','viewBox','role','aria-labelledby','style']){const tree=parse(pages[0].html);setAttribute(pick(tree),field,'changed');assert.throws(()=>figures(tree,'fr'));}
 {const tree=parse(pages[0].html);pick(tree).attrs=pick(tree).attrs.filter(a=>a.name!=='style');assert.throws(()=>figures(tree,'fr'));}
 for(const[field,value]of [['font-family','Arial'],['font-size','1'],['x','0'],['fill','url(https://example.org/x)']]){const tree=parse(pages[0].html),label=nodes(pick(tree)).find(n=>n.tagName==='text');setAttribute(label,field,value);assert.throws(()=>figures(tree,'fr'));}
 for(const type of ['script','foreignObject','image','animate']){const tree=parse(pages[0].html);pick(tree).childNodes.push({nodeName:type,tagName:type,attrs:[],childNodes:[]});assert.throws(()=>figures(tree,'fr'));}
 for(const type of ['tspan','style','metadata','path']){const tree=parse(pages[0].html),n=nodes(pick(tree)).find(n=>n.tagName===type);if(type==='path')setAttribute(n,'d','M0 0 L9999 0');else n.childNodes=[{nodeName:'#text',value:'changed'}];assert.throws(()=>figures(tree,'fr'));}
});
