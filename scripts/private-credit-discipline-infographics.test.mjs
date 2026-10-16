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
import { privateCreditDisciplineSvg, PRIVATE_CREDIT_DISCIPLINE_KINDS } from '../src/lib/privateCreditDisciplineFigures.mjs';
import { assertFontLicenseReferences } from './font-license-assertions.mjs';

const read = file => readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
const digest = value => createHash('sha256').update(value).digest('hex');
// Independent raw and complete browser-tree goldens derived from all 24 passive supplied XML exports.
const originals = {
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
const textCorrections = {
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
const kinds = ["observations","commitments","borrowers","ebitda","pik","leverage"];
const variants = ['fr', 'en'].flatMap(lang => kinds.flatMap(kind => [false, true].map(mobile => ({ lang, kind, mobile, key: `${kind}-${lang}-${mobile ? 'mobile' : 'desktop'}`, svg: privateCreditDisciplineSvg(lang, kind, mobile) }))));
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
const suppliedStyleHash = "dd2ce29367028f8fc71fa8b34685d6643037a58059a0be32b5af3b20b0b61fcb";
function inspect(v) {
  assert.equal(typeof v.svg, 'string'); assert.ok(v.svg.length > 100 && v.svg.length < 40000);
  assert.doesNotMatch(v.svg, /<!|<\?|&(?!amp;|lt;|gt;|quot;|apos;)/u);
  assert.equal(XMLValidator.validate(v.svg), true);
  const roots = parser.parse(v.svg); assert.equal(roots.length, 1); const root = roots[0]; assert.equal(tag(root), 'svg');
  const index = kinds.indexOf(v.kind) + 1, prefix = `credit-f${String(index).padStart(2, '0')}-${v.lang}-${v.mobile ? 'm' : 'd'}`;
  assert.deepEqual(attrs(root), { xmlns: 'http://www.w3.org/2000/svg', id: prefix, class: 'l0g-credit-svg', viewBox: originals[v.key].viewBox, role: 'img', 'aria-labelledby': `${prefix}-title ${prefix}-desc` });
  const nodes = xmlNodes(root); assert.ok(nodes.length < 512); const ids = [];
  for (const n of nodes) {
    assert.ok(Object.hasOwn(allowed, tag(n)), `Passive tag ${tag(n)}`);
    for (const [k,val] of Object.entries(attrs(n))) {
      assert.ok(allowed[tag(n)].has(k), `Known field ${tag(n)}.${k}`); assert.equal(typeof val, 'string'); assert.ok(val.length <= 8192);
      if (numeric.has(k)) { const num = number(val); if (['width','height','rx','r','stroke-width','markerWidth','markerHeight'].includes(k)) assert.ok(num >= 0); if(k === 'opacity') assert.ok(num >= 0 && num <= 1); }
      if (k === 'fill' || k === 'stroke') assert.ok(paints.has(val), `Passive local paint ${val}`);
      if (k === 'id') { assert.ok([prefix, `${prefix}-title`, `${prefix}-desc`, ...['teal','red','gold','blue','ink','muted'].map(c => `${prefix}-arrow-${c}`)].includes(val)); ids.push(val); }
      if (k === 'class' && tag(n) === 'text') assert.ok(['bg','ink','muted','teal','red','gold','blue','white'].includes(val));
      if (k === 'font-weight') assert.ok(['400','700'].includes(val));
      if (k === 'font-size') assert.ok(number(val) >= 12 && number(val) <= 64);
      if (k === 'text-anchor') assert.ok(['start','middle','end'].includes(val));
      if (k === 'stroke-dasharray') assert.ok(['5 5'].includes(val));
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
const fonts = Object.fromEntries([400,700].map(w => [w,fontFrom(`public/fonts/private-credit-discipline/liberation-sans-${w}.ttf`)]));
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
test('Private credit discipline variant selection is frozen, complete and rejects coercion or prototypes', () => {
  assert.deepEqual(PRIVATE_CREDIT_DISCIPLINE_KINDS,kinds);assert.ok(Object.isFrozen(PRIVATE_CREDIT_DISCIPLINE_KINDS));assert.equal(variants.length,24);
  for(const lang of ['', 'FR','__proto__','constructor',{},null,['fr']])assert.throws(()=>privateCreditDisciplineSvg(lang,'observations',false),TypeError);
  for(const kind of ['', '__proto__','constructor','prototype',{},null,['observations']])assert.throws(()=>privateCreditDisciplineSvg('fr',kind,false),TypeError);
  for(const mobile of [0,1,'','false',null,new Boolean(false),{},[]])assert.throws(()=>privateCreditDisciplineSvg('fr','observations',mobile),TypeError);
  assert.equal(privateCreditDisciplineSvg('fr','observations'),privateCreditDisciplineSvg('fr','observations',false));
});
test('12 supplied SVGs retain every byte; twelve exact editorial title and callout corrections reverse to complete originals', () => { for(const v of variants)faithful(v); });
test('all original glyph outlines, curve extrema and panels remain inside their canvases', () => {
 const issues=[];for(const v of variants){try{geometry(v);}catch(error){issues.push(error.message);}}assert.deepEqual(issues,[]);
});
test('geometry guards reject off-canvas shapes, labels and internal panel overflows', () => {
 const v=variants[0];
 for(const change of [(_,ns)=>{attrs(ns.find(n=>tag(n)==='rect')).x='9999';},(_,ns)=>{attrs(ns.find(n=>tag(n)==='tspan')).x='-10';},(root,ns)=>{root.svg.push(JSON.parse(JSON.stringify(ns.find(n=>tag(n)==='text'))));}])assert.throws(()=>geometry(mutate(v,change)));
 const panel=variants.find(v=>v.kind==='observations'&&v.mobile);assert.throws(()=>geometry(mutate(panel,(_,ns)=>{const n=ns.find(n=>tag(n)==='text'&&xmlText(n)==='129,15 Md$');assert.ok(n);attrs(children(n)[0]).x='225';})), /text outside panel/u);
});
test('full XML goldens reject geometry, text, metadata, stylesheet and child-order changes', () => {
 const v=variants[0];for(const change of [(_,ns)=>{attrs(ns.find(n=>tag(n)==='tspan')).x='0';},(_,ns)=>{attrs(ns.find(n=>tag(n)==='rect')).fill='var(--panel)';},(_,ns)=>{ns.find(n=>tag(n)==='title').title=[{'#text':'Changed'}];},(_,ns)=>{ns.find(n=>tag(n)==='metadata').metadata=[{'#text':'{}'}];},(_,ns)=>{ns.find(n=>tag(n)==='style').style=[{'#text':'.l0g-credit-svg{fill:red}'}];},root=>{root.svg.reverse();}])assert.throws(()=>faithful(mutate(v,change)));
});
test('passive SVG validator rejects active markup, external resources and malformed fields',()=>{
 const v=variants[0];for(const type of ['script','foreignObject','image','use','a','animate','filter'])assert.throws(()=>inspect(mutate(v,root=>{root.svg.push({[type]:[]});})));
 for(const[field,val]of [['onload','alert(1)'],['href','https://example.org/'],['xlink:href','javascript:alert(1)'],['constructor','x'],['prototype','x'],['transform','translate(0 0)'],['style','fill:red'],['font-size','Infinity'],['x','1e999'],['x','10001']])assert.throws(()=>inspect(mutate(v,(_,ns)=>{attrs(ns.find(n=>tag(n)==='text'))[field]=val;})));
 for(const val of ['url(#x)','url(https://example.org/x)','var(--bg,red)','#fff','red'])assert.throws(()=>inspect(mutate(v,(_,ns)=>{attrs(ns.find(n=>tag(n)==='rect')).fill=val;})));
 for(const val of ['url(https://example.org/x)','url(#credit-f01-fr-d-arrow-teal) trailing','url(#unknown)'])assert.throws(()=>inspect(mutate(v,(_,ns)=>{attrs(ns.find(n=>tag(n)==='path'))['marker-end']=val;})));
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
    if ([1, 16].includes(record.id)) assert.equal(record.value, 'l0g Credit Discipline Sans');
    if ([2, 17].includes(record.id)) assert.equal(record.value, style);
    if ([3, 4, 18].includes(record.id)) assert.equal(record.value, `l0g Credit Discipline Sans ${style}`);
    if (record.id === 6) assert.equal(record.value, `l0gCreditDisciplineSans-${style}`);
  }
}
test('redistributed font subsets retain copyrights and use the licensed derivative family name', () => {
  for (const weight of [400, 700]) {
    const subsetBytes = readFileSync(new URL(`../public/fonts/private-credit-discipline/liberation-sans-${weight}.ttf`, import.meta.url));
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
const disciplineSubsetNotice = 'The redistributed SVG subsets are renamed l0g Credit Discipline Sans; their original outlines, glyph mapping and metrics are unchanged.';
function assertDisciplineLicense(licence, canonical) {
 assertFontLicenseReferences(licence,'liberation');
 assert.equal(canonical.split('\n').filter(line=>line===canonicalSubsetNotice).length,1);
 assert.equal(licence.split('\n').filter(line=>line===disciplineSubsetNotice).length,1);
 assert.equal(licence.replace(disciplineSubsetNotice,canonicalSubsetNotice),canonical,'Only the exact descriptive derivative-family notice differs from the complete canonical licence');
 const copyright='Digitized data copyright (c) 2010 Google Corporation';
 assert.equal(licence.split(copyright).length,2);assert.equal(canonical.split(copyright).length,2);
 assert.equal(licence.slice(licence.indexOf(copyright)),canonical.slice(canonical.indexOf(copyright)),'Every original copyright and OFL clause remains byte-identical');
}

test('dedicated fonts retain every original glyph outline, metrics and canonical complete licence', () => {
  const licence = read('public/fonts/private-credit-discipline/LICENSE.txt');
  assertDisciplineLicense(licence,read('src/epub-assets/debt-chain-fonts/liberation-LICENSE.txt'));
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
 const licence=read('public/fonts/private-credit-discipline/LICENSE.txt');
 for(const text of [licence,licence.replaceAll('\r\n','\n').replaceAll('\n','\r\n')])assertFontLicenseReferences(text,'liberation');
 const urls=['https://github.com/liberationfonts/liberation-fonts','https://github.com/liberationfonts/liberation-fonts/blob/main/LICENSE'];
 for(const url of urls)for(const replacement of [`https://github.com.evil.example${new URL(url).pathname}`,`https://github.com@evil.example${new URL(url).pathname}`,`https://evil.example/?next=${url}`,`https://evil.example/#${url}`,`https://evil.example/${url}`,url.replace('https:','http:'),`${url}?next=bad`,`${url}#bad`,`${url}/bad`,`${url} trailing`,`${url}\u0000`]){
  const lines=licence.split('\n'),i=lines.findIndex(line=>line.endsWith(url));assert.ok(i>=0);lines[i]=lines[i].slice(0,-url.length)+replacement;assert.throws(()=>assertFontLicenseReferences(lines.join('\n'),'liberation'));
 }
 for(const line of licence.split('\n').filter(l=>l.startsWith('Source:')||l.startsWith('Licence source:')))for(const text of [licence.replace(line,''),`${licence}\n${line}`,licence.replace(line,` ${line}`)])assert.throws(()=>assertFontLicenseReferences(text,'liberation'));
});
test('responsive component preserves all theme, font and breakpoint contracts',()=>{
 const component=read('src/components/PrivateCreditDisciplineFigure.astro'),style=component.match(/<style>([\s\S]*?)<\/style>/u)?.[1];assert.ok(style);
 const css=postcss.parse(style),declarations=n=>Object.fromEntries(n.nodes.filter(d=>d.type==='decl').map(d=>[d.prop,d.value]));
 const rule=selector=>{const n=css.nodes.find(n=>n.type==='rule'&&n.selector===selector);assert.ok(n,selector);return declarations(n);};
 const mapping={bg:'ink',panel:'surface-2',ink:'paper',muted:'muted',grid:'line-strong',teal:'signal',red:'accent',gold:'amber',blue:'topic-blue',white:'ink'};
 assert.deepEqual(rule('.private-credit-discipline-figure :global(svg.l0g-credit-svg)'),Object.fromEntries(Object.entries(mapping).map(([k,v])=>[`--${k}`,`var(--color-${v})`])));
 const base=rule('.private-credit-discipline-figure');assert.deepEqual([base.width,base['max-width'],base['container-type'],base['padding-bottom'],base.overflow],['100%','760px','inline-size','.85rem','visible']);
 const graphic=rule('.private-credit-discipline-figure :global(svg)');assert.deepEqual([graphic.width,graphic.height,graphic['max-width'],graphic['letter-spacing'],graphic.overflow],['100%','auto','100%','normal','visible']);
 assert.equal(rule('.private-credit-discipline-figure :global(svg text)')['font-family'],"'l0g Credit Discipline', 'Liberation Sans', Arial, sans-serif");
 const mobile=rule('.private-credit-discipline-mobile');assert.deepEqual([mobile.display,mobile.width,mobile['max-width'],mobile['margin-inline']],['none','100%','420px','auto']);
 const faces=css.nodes.filter(n=>n.type==='atrule'&&n.name==='font-face').map(declarations);
 assert.deepEqual(faces.map(d=>[d['font-family'],d.src,d['font-weight'],d['font-style'],d['font-display']]),[400,700].map(w=>["'l0g Credit Discipline'",`url('/fonts/private-credit-discipline/liberation-sans-${w}.ttf') format('truetype')`,String(w),'normal','swap']));
 for(const kind of ['media','container']){
  const n=css.nodes.find(n=>n.type==='atrule'&&n.name===kind&&n.params==='(max-width: 640px)');assert.ok(n);
  assert.deepEqual(n.nodes.map(n=>[n.selector,declarations(n).display]),[['.private-credit-discipline-desktop','none'],['.private-credit-discipline-mobile','block']]);
 }
 const themes={dark:new Map(),light:new Map()};postcss.parse(read('src/styles/global.css')).walkDecls(d=>{if(d.parent.type==='atrule'&&d.parent.name==='theme')themes.dark.set(d.prop,d.value);if(d.parent.type==='rule'&&d.parent.selector===':root[data-theme="light"]')themes.light.set(d.prop,d.value);});
 for(const theme of Object.values(themes))for(const v of Object.values(mapping))assert.ok(theme.has(`--color-${v}`));
 assert.doesNotMatch(style,/#(?:[a-f0-9]{3}){1,2}\b|(?:clip-path|overflow\s*:\s*(?:hidden|clip)|transform\s*:|100vw)/iu);
 assert.equal((component.match(/set:html=/gu)??[]).length,2);assert.match(component,/set:html=\{responsiveSvg\(false\)\}/u);assert.match(component,/set:html=\{responsiveSvg\(true\)\}/u);
 assert.ok(component.includes(`const responsiveSvg = (mobile: boolean) => privateCreditDisciplineSvg(lang, kind, mobile).replace(/^<svg /u, '<svg style="width:100%;height:auto" ');`));
 assert.doesNotMatch(component,/<script|client:|fetch\(|innerHTML/u);
});
const mdxNodes=n=>[n,...(n.children??[]).flatMap(mdxNodes)];
const figureSources={observations:[1],commitments:[2,3],borrowers:[4,5],ebitda:[6,7],pik:[15,16],leverage:[11,15]};
function articleFigures(raw,lang){
 const tree=createProcessor().parse(raw.replace(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/u,'')),figures=mdxNodes(tree).filter(n=>n.name==='PrivateCreditDisciplineFigure');assert.equal(figures.length,6);
 for(const[i,n]of figures.entries()){
  const a=Object.fromEntries(n.attributes.map(a=>{assert.equal(a.type,'mdxJsxAttribute');assert.equal(typeof a.value,'string');return[a.name,a.value];}));
  assert.deepEqual(Object.keys(a).sort(),['caption','kind','lang','number','sources']);assert.equal(a.kind,kinds[i]);assert.equal(a.number,String(i+1).padStart(2,'0'));assert.equal(a.lang,lang);assert.ok(a.caption.length>70);
  const refs=a.sources.trim()?a.sources.trim().split(/\s+/u).map(Number):[];assert.deepEqual(refs,figureSources[kinds[i]]);const details=mdxNodes(n).filter(c=>c.name==='details');assert.equal(details.length,1);assert.equal(mdxNodes(details[0]).filter(c=>c.name==='summary').length,1);
 }
}
test('article native MDX includes six ordered static figures, accurate references and method notes',()=>{
 for(const lang of ['fr','en'])articleFigures(read(`src/content/${lang==='fr'?'posts/credit-prive-prix-argent-a-placer':'posts-en/private-credit-test-of-patience'}.mdx`),lang);
});

test('comma-delimited coordinate pairs are consumed completely without accepting malformed comma runs',()=>{
 assert.deepEqual(pathPoints('M 1,2 L 3,4 L 5,-6'),[[1,2],[3,4],[5,-6]]);
 for(const d of ['M,1 2','M1,,2','M1, 2','M1 2,','M1 2 L,3 4','M1 2 , L3 4'])assert.throws(()=>pathPoints(d));
});
test('the static root adapter adds exactly the responsive style and preserves the complete passive SVG tree',()=>{
 const component=read('src/components/PrivateCreditDisciplineFigure.astro');assert.ok(component.includes(`const responsiveSvg = (mobile: boolean) => privateCreditDisciplineSvg(lang, kind, mobile).replace(/^<svg /u, '<svg style="width:100%;height:auto" ');`));
 for(const v of variants){const adapted=v.svg.replace(/^<svg /u,'<svg style="width:100%;height:auto" '),roots=htmlNodes(parse(adapted)).filter(n=>n.tagName==='svg');assert.equal(roots.length,1);const root=roots[0];assert.equal(root.attrs.filter(a=>a.name==='style').length,1);assert.equal(root.attrs.find(a=>a.name==='style').value,'width:100%;height:auto');const projection={...root,attrs:root.attrs.filter(a=>a.name!=='style')};assert.equal(digest(JSON.stringify(canonical(projection))),textCorrections[v.key]?.expectedDomHash??originals[v.key].domHash);assert.equal(adapted.replace('<svg style="width:100%;height:auto" ','<svg '),v.svg);}
});

test('the derivative-family notice projection rejects modified, missing, duplicate or truncated legal text',()=>{
 const canonical=read('src/epub-assets/debt-chain-fonts/liberation-LICENSE.txt'),licence=read('public/fonts/private-credit-discipline/LICENSE.txt');assertDisciplineLicense(licence,canonical);
 for(const changed of [licence.replace(disciplineSubsetNotice,canonicalSubsetNotice),licence.replace('l0g Credit Discipline Sans','l0g Other Sans'),licence+'\n'+disciplineSubsetNotice,licence.replace('Copyright (c) 2012 Red Hat, Inc.','Copyright changed'),licence.replace('SIL OPEN FONT LICENSE Version 1.1 - 26 February 2007','SIL OPEN FONT LICENSE altered'),licence.slice(0,-100),'Extra notice\n'+licence,licence.replaceAll('\n','\r\n')])assert.throws(()=>assertDisciplineLicense(changed,canonical));
});

function quantitativeGeometry(v) {
 const {root}=inspect(v),ns=scene(root),rects=ns.filter(n=>tag(n)==='rect');
 const near=(actual,expected,tolerance=.001)=>assert.ok(Number.isFinite(actual)&&Math.abs(actual-expected)<=tolerance,`${v.key}: ${actual} != ${expected}`);
 const bars=(height,colour)=>rects.filter(n=>value(n,'height')===height&&attrs(n).fill===`var(--${colour})`);
 if(v.kind==='observations'){
  // Same-quarter refinancing only; nine-month fundraising and quarterly lending are not netted.
  const height=v.mobile?29:38,scale=(v.mobile?300:560)/20;
  for(const[colour,amount]of [['teal',16.39],['blue',2.60]]){const b=bars(height,colour);assert.equal(b.length,1);near(value(b[0],'width'),amount*scale);}
 }
 if(v.kind==='commitments'){
  if(v.mobile){
   const uncalled=rects.filter(n=>value(n,'height')===50&&attrs(n).fill==='none'),called=bars(50,'teal');assert.equal(uncalled.length,1);assert.equal(called.length,1);
   near(value(uncalled[0],'width'),372*.60);near(value(called[0],'width'),372*.40);near(value(called[0],'x'),value(uncalled[0],'x')+value(uncalled[0],'width'));
   const loans=bars(58,'blue'),cash=bars(58,'gold');assert.equal(loans.length,1);assert.equal(cash.length,1);near(value(loans[0],'width'),372*30/40);near(value(cash[0],'width'),372*10/40);near(value(cash[0],'x'),value(loans[0],'x')+value(loans[0],'width'));
  }else{
   const segments=rects.filter(n=>value(n,'height')===57);assert.equal(segments.length,3);for(const[i,amount]of [60,30,10].entries())near(value(segments[i],'width'),1020*amount/100);
   for(let i=1;i<segments.length;i++)near(value(segments[i],'x'),value(segments[i-1],'x')+value(segments[i-1],'width'));
  }
  assert.equal(60+30+10,100);assert.equal(30+10,40);
 }
 if(v.kind==='borrowers'){
  // Fed issuer counts by revenue group, rounded percentages; not outstanding loan amounts.
  const height=v.mobile?60:84,scale=(v.mobile?372:660)/100;
  for(const[colour,amounts]of [['teal',[16,57]],['blue',[41,25]],['gold',[43,18]]]){const b=bars(height,colour);assert.equal(b.length,2);for(const[i,amount]of amounts.entries())near(value(b[i],'width'),amount*scale);}
  assert.equal(16+41+43,100);assert.equal(57+25+18,100);
 }
 if(v.kind==='ebitda'){
  // Historical deal sample and separate hypothetical contractual EBITDA example.
  const b=bars(v.mobile?30:33,'blue'),scale=v.mobile?238/6:575/6;assert.equal(b.length,2);for(const[i,multiple]of [4.8,5.1].entries())near(value(b[i],'width'),multiple*scale);
  near(120/20,6);near(120/(20+5),4.8);assert.ok(120/20>5&&120/(20+5)<5);
 }
 if(v.kind==='pik'){
  // Annual 10% coupon on opening principal: 6% cash and 4% capitalized.
  const height=v.mobile?28:36,scale=(v.mobile?205:650)/120,original=bars(height,'blue'),added=bars(height,'gold');assert.equal(original.length,4);assert.equal(added.length,3);
  for(const n of original)near(value(n,'width'),100*scale);
  for(const[i,n]of added.entries()){near(value(n,'width'),(100*1.04**(i+1)-100)*scale);near(value(n,'x'),value(original[i+1],'x')+value(original[i+1],'width'));}
  near(100*1.04**3,112.4864,1e-10);near([0,1,2].reduce((sum,i)=>sum+100*1.04**i*.06,0),18.7296,1e-10);near(3*100*.10,30,1e-10);
 }
 if(v.kind==='leverage'){
  const assets=bars(v.mobile?34:57,'ink'),debt=bars(v.mobile?38:57,'blue'),equity=bars(v.mobile?38:57,'gold'),scale=(v.mobile?245:455)/200;
  assert.equal(assets.length,2);assert.equal(debt.length,2);assert.equal(equity.length,2);
  for(const[i,amount]of [200,180].entries())near(value(assets[i],'width'),amount*scale);
  for(const[i,amount]of [100,80].entries()){near(value(debt[i],'width'),100*scale);near(value(equity[i],'width'),amount*scale);near(value(equity[i],'x'),value(debt[i],'x')+value(debt[i],'width'));}
  if(v.mobile){const concentration=bars(24,'blue');assert.equal(concentration.length,1);near(value(concentration[0],'width'),372*.6475);}
  near((180/200-1)*100,-10,1e-10);near(((180-100)/(200-100)-1)*100,-20,1e-10);
 }
}
test('same-quarter refinancing, distinct commitments, borrower shares, deal leverage, PIK and fund-equity bars retain their separate correct scales',()=>{for(const v of variants)quantitativeGeometry(v);});
test('quantitative geometry checks reject changes to every scaled figure',()=>{
 for(const kind of kinds){const v=variants.find(v=>v.kind===kind&&!v.mobile);assert.throws(()=>quantitativeGeometry(mutate(v,(_,ns)=>{const height={observations:38,commitments:57,borrowers:84,ebitda:33,pik:36,leverage:57}[kind],n=ns.find(n=>tag(n)==='rect'&&value(n,'height')===height&&attrs(n).fill==='var(--blue)');assert.ok(n);attrs(n).width='1';})));}
});
