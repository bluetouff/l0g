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
import { aiDemandSvg, AI_DEMAND_KINDS } from '../src/lib/aiDemandFigures.mjs';
import { assertFontLicenseReferences } from './font-license-assertions.mjs';

const read = file => readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
const digest = value => createHash('sha256').update(value).digest('hex');
// Independent raw and complete browser-tree goldens derived from all 24 passive supplied XML exports.
const originals = {
  "financing-fr-desktop": {
    "rawHash": "e0e013fc47f9d77ef9f0733315592dbbb8b3d223ee96927d71a33b595ef4b96d",
    "domHash": "aa9d5c1fef3c8c4f5182f651ff8249d09bb2f96a84042a6c83b857244159b439",
    "viewBox": "0 0 1100 880",
    "metadata": {
      "figure": 1,
      "language": "fr",
      "layout": "desktop",
      "as_of": "2026-10-16",
      "source_ids": [
        "S01",
        "S15",
        "S16"
      ],
      "creator": "l0g",
      "description": "Schéma sans échelle monétaire. La production est affectée à la consommation ou à l’investissement ; les rentes attendues, comparées au coût de recherche, déterminent la possibilité d’innover. Une variante autorise des rentes sur les biens d’investissement."
    }
  },
  "financing-fr-mobile": {
    "rawHash": "91ffb31ac25589d605fce9e20725100bf5246d1c7e2a4875aa32cd703499a601",
    "domHash": "63c1de5367c3fa9c7aaf9fe9c6fa02ff41b95d6b4d52e0d89dde2e06fe07b992",
    "viewBox": "0 0 420 1320",
    "metadata": {
      "figure": 1,
      "language": "fr",
      "layout": "mobile",
      "as_of": "2026-10-16",
      "source_ids": [
        "S01",
        "S15",
        "S16"
      ],
      "creator": "l0g",
      "description": "Schéma sans échelle monétaire. La production est affectée à la consommation ou à l’investissement ; les rentes attendues, comparées au coût de recherche, déterminent la possibilité d’innover. Une variante autorise des rentes sur les biens d’investissement."
    }
  },
  "consumption-fr-desktop": {
    "rawHash": "df2ca88384bfdf64e48fedd4028fc234102ab22a66d9ae225b09d7e224bf0be6",
    "domHash": "84aefadc5cbecdfb7e8a17ae06f87eef0519c90c4a1f50ffca4833f1a0288cb4",
    "viewBox": "0 0 1100 720",
    "metadata": {
      "figure": 2,
      "language": "fr",
      "layout": "desktop",
      "as_of": "2026-10-16",
      "source_ids": [
        "l0g calculation",
        "S15"
      ],
      "creator": "l0g",
      "description": "À prix constants : production 100, consommation 70 au départ ; deux variantes indépendantes de production 110 et 140, consommation 66 et 84."
    }
  },
  "consumption-fr-mobile": {
    "rawHash": "63d239971dff4a0c48840b8b4845efda18bddb2931a265f65ea55480f32e5973",
    "domHash": "5a839cf3961b899056cb03ac4ddba11cac103e3f4b9231174348bd0e43e832b8",
    "viewBox": "0 0 420 1080",
    "metadata": {
      "figure": 2,
      "language": "fr",
      "layout": "mobile",
      "as_of": "2026-10-16",
      "source_ids": [
        "l0g calculation",
        "S15"
      ],
      "creator": "l0g",
      "description": "À prix constants : production 100, consommation 70 au départ ; deux variantes indépendantes de production 110 et 140, consommation 66 et 84."
    }
  },
  "erosion-fr-desktop": {
    "rawHash": "239b3c2d6c1224cf7473a316a9ac1f5bbd80729f1f670c9f43c636d1ea97a9e9",
    "domHash": "ed0fa20db2024a0d9a4dd352a465a7efbad2c199138b051c844cbf9b898bf330",
    "viewBox": "0 0 1100 850",
    "metadata": {
      "figure": 3,
      "language": "fr",
      "layout": "desktop",
      "as_of": "2026-10-16",
      "source_ids": [
        "l0g calculation",
        "S09"
      ],
      "creator": "l0g",
      "description": "Un flux de rente décroît avec trois taux d’érosion. Avec une actualisation continue à 5 %, ses valeurs présentes sont 133,3, 66,7 et 44,4 unités. Le coût est 60."
    }
  },
  "erosion-fr-mobile": {
    "rawHash": "ba4af48decdce213417fdcbd54e0929f3aaaf7c99de0f67ec2a0c90d853555f7",
    "domHash": "b7a50fb6308236a956fddc15abcc48b457bdcb8b6c0784914c9128372adfa6c9",
    "viewBox": "0 0 420 1300",
    "metadata": {
      "figure": 3,
      "language": "fr",
      "layout": "mobile",
      "as_of": "2026-10-16",
      "source_ids": [
        "l0g calculation",
        "S09"
      ],
      "creator": "l0g",
      "description": "Un flux de rente décroît avec trois taux d’érosion. Avec une actualisation continue à 5 %, ses valeurs présentes sont 133,3, 66,7 et 44,4 unités. Le coût est 60."
    }
  },
  "distribution-fr-desktop": {
    "rawHash": "bd45fdf3f9225483299dbd637039f195f83e7bb1830f148e5e60336a0c464a2c",
    "domHash": "aaf822de369cd3e8decafd204f7cc07fdcb4d4953e5a944c65c5963529d27f5c",
    "viewBox": "0 0 1100 870",
    "metadata": {
      "figure": 4,
      "language": "fr",
      "layout": "desktop",
      "as_of": "2026-10-16",
      "source_ids": [
        "S01 Table2 printed p33"
      ],
      "creator": "l0g",
      "description": "Croissance annuelle de production : 2,5 ; 2,3 ; 3,9 ; 5,5 %. Écarts de salaire à la trajectoire sans IA : +7,4 ; −14,5 ; −43,9 ; −54,2 %. Aucune probabilité ni date de réalisation."
    }
  },
  "distribution-fr-mobile": {
    "rawHash": "229eb0585adbeb29bbbf04376a6c4a85dbaa1ab4d238567d59aaf5c439b0812a",
    "domHash": "ea08945e79a6f6871fe3702988327b31865c1af42f31c4d878a98eb73053b9b8",
    "viewBox": "0 0 420 1390",
    "metadata": {
      "figure": 4,
      "language": "fr",
      "layout": "mobile",
      "as_of": "2026-10-16",
      "source_ids": [
        "S01 Table2 printed p33"
      ],
      "creator": "l0g",
      "description": "Croissance annuelle de production : 2,5 ; 2,3 ; 3,9 ; 5,5 %. Écarts de salaire à la trajectoire sans IA : +7,4 ; −14,5 ; −43,9 ; −54,2 %. Aucune probabilité ni date de réalisation."
    }
  },
  "evidence-fr-desktop": {
    "rawHash": "7dec22c2594151ca466f36c318902aba790cfcd39b1601bebd80291929b95cd5",
    "domHash": "20642d2dcd2de6eb5d434d5ae1acfb4161452d2857f48825474bccb1172a26ee",
    "viewBox": "0 0 1100 880",
    "metadata": {
      "figure": 5,
      "language": "fr",
      "layout": "desktop",
      "as_of": "2026-10-16",
      "source_ids": [
        "S05",
        "S06",
        "S07"
      ],
      "creator": "l0g",
      "description": "Étude de support : +15 % de problèmes résolus par heure, 5 172 agents. METR début 2025 : +19 % de temps de réalisation, 16 développeurs et 246 tâches. METR en février 2026 signale des biais de sélection dans le suivi."
    }
  },
  "evidence-fr-mobile": {
    "rawHash": "31eaefbb27bd53dc70c6c3bde7ce459caf05b425bdf68dd10fde16654750e80a",
    "domHash": "e62a28b6d06b154343e215dffdacd3d6ec147851b16c22e7450e901a5e33e5e4",
    "viewBox": "0 0 420 1370",
    "metadata": {
      "figure": 5,
      "language": "fr",
      "layout": "mobile",
      "as_of": "2026-10-16",
      "source_ids": [
        "S05",
        "S06",
        "S07"
      ],
      "creator": "l0g",
      "description": "Étude de support : +15 % de problèmes résolus par heure, 5 172 agents. METR début 2025 : +19 % de temps de réalisation, 16 développeurs et 246 tâches. METR en février 2026 signale des biais de sélection dans le suivi."
    }
  },
  "valuation-fr-desktop": {
    "rawHash": "893c041e678407d28df136b4bea78e2dc805cd1516293c99d6f49fa7103dcc6c",
    "domHash": "d18a6ed3a453a988442cd08716b4f66714b2a27a2a78c4d6e38fa87ad3a7a17e",
    "viewBox": "0 0 1100 890",
    "metadata": {
      "figure": 6,
      "language": "fr",
      "layout": "desktop",
      "as_of": "2026-10-16",
      "source_ids": [
        "l0g calculation",
        "S14"
      ],
      "creator": "l0g",
      "description": "Valeur initiale 2 000. Baisse du taux requis de 8 à 7 %, croissance inchangée à 3 % : +500. Puis croissance réduite à 1 % : −833,3. Valeur finale 1 666,7."
    }
  },
  "valuation-fr-mobile": {
    "rawHash": "0712ab97df9fae859a6bf7f1deb7462c7b9a9d0096e47c2e63f004ea3afa756b",
    "domHash": "1cb2de7eab93be6e7e82c832af4cd7c2f93c02236bb193c6ba10786bfecea478",
    "viewBox": "0 0 420 1270",
    "metadata": {
      "figure": 6,
      "language": "fr",
      "layout": "mobile",
      "as_of": "2026-10-16",
      "source_ids": [
        "l0g calculation",
        "S14"
      ],
      "creator": "l0g",
      "description": "Valeur initiale 2 000. Baisse du taux requis de 8 à 7 %, croissance inchangée à 3 % : +500. Puis croissance réduite à 1 % : −833,3. Valeur finale 1 666,7."
    }
  },
  "financing-en-desktop": {
    "rawHash": "16e5da2764959c39e4b97372f147dc0171a3a3b97a0f1abf14d10da91054eb68",
    "domHash": "e092052d7732ceb3111c90c124476f290c4fe82062f2d4c374e079bbf3653b8b",
    "viewBox": "0 0 1100 880",
    "metadata": {
      "figure": 1,
      "language": "en",
      "layout": "desktop",
      "as_of": "2026-10-16",
      "source_ids": [
        "S01",
        "S15",
        "S16"
      ],
      "creator": "l0g",
      "description": "Unscaled mechanism. Production serves consumption or investment; expected rents relative to research costs determine whether another discovery can be financed. A variant permits rents on investment goods."
    }
  },
  "financing-en-mobile": {
    "rawHash": "73d265639415f77005cb1ee25aaa4ba89318e864b23ea4d0b4d8aa0e9771da4b",
    "domHash": "f814d634bb6c94cf8801b7ed498190c3d1bbd1a92af318a1a6e6ff0babb9932d",
    "viewBox": "0 0 420 1320",
    "metadata": {
      "figure": 1,
      "language": "en",
      "layout": "mobile",
      "as_of": "2026-10-16",
      "source_ids": [
        "S01",
        "S15",
        "S16"
      ],
      "creator": "l0g",
      "description": "Unscaled mechanism. Production serves consumption or investment; expected rents relative to research costs determine whether another discovery can be financed. A variant permits rents on investment goods."
    }
  },
  "consumption-en-desktop": {
    "rawHash": "feb60c18b0edce08b86da2a535f431cf5e206404bf7515636e294e4d71d4e368",
    "domHash": "f1475e67a8ce82c20187bf129607a73ed6af72f2eb633b13319e163f8767f06f",
    "viewBox": "0 0 1100 720",
    "metadata": {
      "figure": 2,
      "language": "en",
      "layout": "desktop",
      "as_of": "2026-10-16",
      "source_ids": [
        "l0g calculation",
        "S15"
      ],
      "creator": "l0g",
      "description": "Constant-price example: baseline output 100 and consumption 70; two independent alternatives have output 110 and 140, consumption 66 and 84."
    }
  },
  "consumption-en-mobile": {
    "rawHash": "d8b812c050f3bbf5b2b3023424539bf910e27107f9e169a5a9c72d7b135f4422",
    "domHash": "e9b79d50c904d46f1f2e62c29be48db981bee8df9177b7a1504a24416ab74f7f",
    "viewBox": "0 0 420 1080",
    "metadata": {
      "figure": 2,
      "language": "en",
      "layout": "mobile",
      "as_of": "2026-10-16",
      "source_ids": [
        "l0g calculation",
        "S15"
      ],
      "creator": "l0g",
      "description": "Constant-price example: baseline output 100 and consumption 70; two independent alternatives have output 110 and 140, consumption 66 and 84."
    }
  },
  "erosion-en-desktop": {
    "rawHash": "222aabb6af43b88d16aa6e457c374ec0172c0410212fd031cd9d26e2ed686d2f",
    "domHash": "88cecaa7b64c006e6b4c10a11795cfd89dd9bd421bb741d4ed3adc15c503a8fe",
    "viewBox": "0 0 1100 850",
    "metadata": {
      "figure": 3,
      "language": "en",
      "layout": "desktop",
      "as_of": "2026-10-16",
      "source_ids": [
        "l0g calculation",
        "S09"
      ],
      "creator": "l0g",
      "description": "A rent stream decays at three erosion rates. At a continuous 5% discount rate, present values are 133.3, 66.7 and 44.4 units. Research costs 60."
    }
  },
  "erosion-en-mobile": {
    "rawHash": "fc42f366d2e47348a937b496cab9a5b18110dc17bb2d7803b09e471194e764cc",
    "domHash": "be86ea70f71f13be617646d1a29dc352ec59fbdbe5e6f4e4a2aad24a01d0551c",
    "viewBox": "0 0 420 1300",
    "metadata": {
      "figure": 3,
      "language": "en",
      "layout": "mobile",
      "as_of": "2026-10-16",
      "source_ids": [
        "l0g calculation",
        "S09"
      ],
      "creator": "l0g",
      "description": "A rent stream decays at three erosion rates. At a continuous 5% discount rate, present values are 133.3, 66.7 and 44.4 units. Research costs 60."
    }
  },
  "distribution-en-desktop": {
    "rawHash": "3ecaab3c1af9511476947b65c74c69cb69702f687f5ea8c0eb22e81dde2326fb",
    "domHash": "b771b56e1e0f18b7c1c3558efbcbb309704e2d57632d6e47ade191b9fbe19f25",
    "viewBox": "0 0 1100 870",
    "metadata": {
      "figure": 4,
      "language": "en",
      "layout": "desktop",
      "as_of": "2026-10-16",
      "source_ids": [
        "S01 Table2 printed p33"
      ],
      "creator": "l0g",
      "description": "Annual output growth: 2.5, 2.3, 3.9, 5.5%. Wage gaps against the no-AI path: +7.4, −14.5, −43.9, −54.2%. No probabilities or calendar forecasts."
    }
  },
  "distribution-en-mobile": {
    "rawHash": "513a71fc837b22da323c4d241b4e9296f0eeb1f48894c9455538b7fdfd8f1224",
    "domHash": "580f0993cb9c288ecd3fede05ca569708a6f493b2bb7fb5da0be9a81c20fd024",
    "viewBox": "0 0 420 1390",
    "metadata": {
      "figure": 4,
      "language": "en",
      "layout": "mobile",
      "as_of": "2026-10-16",
      "source_ids": [
        "S01 Table2 printed p33"
      ],
      "creator": "l0g",
      "description": "Annual output growth: 2.5, 2.3, 3.9, 5.5%. Wage gaps against the no-AI path: +7.4, −14.5, −43.9, −54.2%. No probabilities or calendar forecasts."
    }
  },
  "evidence-en-desktop": {
    "rawHash": "01f39f1874fe040dad3217fd6db8a35b6ad1843f282e8e6faa025ce5dc5c8749",
    "domHash": "dd89ac8fe642ad20d5ba750834c8ff6693ed3b44bc79077cf3f02942757d3d11",
    "viewBox": "0 0 1100 880",
    "metadata": {
      "figure": 5,
      "language": "en",
      "layout": "desktop",
      "as_of": "2026-10-16",
      "source_ids": [
        "S05",
        "S06",
        "S07"
      ],
      "creator": "l0g",
      "description": "Support study: 15% more issues per hour, 5,172 agents. Early-2025 METR: 19% more task time, 16 developers and 246 tasks. METR reports selection issues in the February 2026 follow-up."
    }
  },
  "evidence-en-mobile": {
    "rawHash": "1b3b1607c223d587acbb2e996a9e6d4f9b53f0ced4a54312f2ee6479f6ed568f",
    "domHash": "921ef6cacb5e9e2ba0cb87e44f6769fb83a5a42c335f59dd12326aa789e6dc5b",
    "viewBox": "0 0 420 1370",
    "metadata": {
      "figure": 5,
      "language": "en",
      "layout": "mobile",
      "as_of": "2026-10-16",
      "source_ids": [
        "S05",
        "S06",
        "S07"
      ],
      "creator": "l0g",
      "description": "Support study: 15% more issues per hour, 5,172 agents. Early-2025 METR: 19% more task time, 16 developers and 246 tasks. METR reports selection issues in the February 2026 follow-up."
    }
  },
  "valuation-en-desktop": {
    "rawHash": "0024c89dea43583b1c016fa017aaf3c2a2277291725462b4a559a2b288683703",
    "domHash": "3725fe85c30ade9ccb7dcd8aca63f6311a84155b3bc69b759aef4e904b30d121",
    "viewBox": "0 0 1100 890",
    "metadata": {
      "figure": 6,
      "language": "en",
      "layout": "desktop",
      "as_of": "2026-10-16",
      "source_ids": [
        "l0g calculation",
        "S14"
      ],
      "creator": "l0g",
      "description": "Initial value 2,000. Required return falls from 8% to 7%, growth stays at 3%: +500. Growth then falls to 1%: −833.3. Final value 1,666.7."
    }
  },
  "valuation-en-mobile": {
    "rawHash": "4ce31c5ef672cdc039dd9109ddec2d5980b271dcffa46ac88d8d7c58811d8722",
    "domHash": "c12bcdf1af17db64e8da99666500397c5b51b80bd9a0d2e35e3bff0b63aeabca",
    "viewBox": "0 0 420 1270",
    "metadata": {
      "figure": 6,
      "language": "en",
      "layout": "mobile",
      "as_of": "2026-10-16",
      "source_ids": [
        "l0g calculation",
        "S14"
      ],
      "creator": "l0g",
      "description": "Initial value 2,000. Required return falls from 8% to 7%, growth stays at 3%: +500. Growth then falls to 1%: −833.3. Final value 1,666.7."
    }
  }
};
const textCorrections = {
  "distribution-fr-desktop": {
    "pairs": [
      [
        "Le salaire ne suit pas toujours la production",
        "Production et salaires suivent des voies distinctes",
        2
      ]
    ],
    "expectedHash": "76d3c67cdb9236f5ede35167117e64efb2e7cb4b3c5b86c033d2ca2c3786e5c2",
    "expectedDomHash": "4a5a649d8c01634b3c4c9bdc284f2ba0bb2465d65f466aad6c266b5558da82f9",
    "metadata": {
      "figure": 4,
      "language": "fr",
      "layout": "desktop",
      "as_of": "2026-10-16",
      "source_ids": [
        "S01 Table2 printed p33"
      ],
      "creator": "l0g",
      "description": "Croissance annuelle de production : 2,5 ; 2,3 ; 3,9 ; 5,5 %. Écarts de salaire à la trajectoire sans IA : +7,4 ; −14,5 ; −43,9 ; −54,2 %. Aucune probabilité ni date de réalisation."
    }
  },
  "distribution-fr-mobile": {
    "pairs": [
      [
        "Le salaire ne suit pas toujours la production",
        "Production et salaires suivent des voies distinctes",
        1
      ],
      [
        "<tspan x=\"24\" dy=\"0\">Le salaire ne suit pas toujours</tspan>",
        "<tspan x=\"24\" dy=\"0\">Production et salaires</tspan>",
        1
      ],
      [
        "<tspan x=\"24\" dy=\"27.12\">la production</tspan>",
        "<tspan x=\"24\" dy=\"27.12\">suivent des voies distinctes</tspan>",
        1
      ]
    ],
    "expectedHash": "2c60381374be25d3dbfd227c747b2e94af5f8919a41397b435913dd6429c8ae7",
    "expectedDomHash": "b6f288d9261bd61572cce636938b10b38ab7d9d991a1807b2a1c7f2bcf506ed1",
    "metadata": {
      "figure": 4,
      "language": "fr",
      "layout": "mobile",
      "as_of": "2026-10-16",
      "source_ids": [
        "S01 Table2 printed p33"
      ],
      "creator": "l0g",
      "description": "Croissance annuelle de production : 2,5 ; 2,3 ; 3,9 ; 5,5 %. Écarts de salaire à la trajectoire sans IA : +7,4 ; −14,5 ; −43,9 ; −54,2 %. Aucune probabilité ni date de réalisation."
    }
  },
  "evidence-fr-desktop": {
    "pairs": [
      [
        "L’ACTUALISATION QUI COMPTE · METR, 24 FÉVRIER 2026",
        "SUIVI DE TERRAIN · METR, 24 FÉVRIER 2026",
        1
      ]
    ],
    "expectedHash": "84584cd1f594ecd51d699737e1448cc288ad0b6d6548281065c3ad42ca80168b",
    "expectedDomHash": "82ace4504c1f985a95803331eef40d00d67fee14a7c58abea028043ec390723f",
    "metadata": {
      "figure": 5,
      "language": "fr",
      "layout": "desktop",
      "as_of": "2026-10-16",
      "source_ids": [
        "S05",
        "S06",
        "S07"
      ],
      "creator": "l0g",
      "description": "Étude de support : +15 % de problèmes résolus par heure, 5 172 agents. METR début 2025 : +19 % de temps de réalisation, 16 développeurs et 246 tâches. METR en février 2026 signale des biais de sélection dans le suivi."
    }
  },
  "distribution-en-desktop": {
    "pairs": [
      [
        "Higher output need not lift wages",
        "Output and wages follow different paths",
        2
      ]
    ],
    "expectedHash": "84c99d194db713f42e7a54fa884d4500a6a5439d4c17f85bbbe5fad99ffd4440",
    "expectedDomHash": "ff015ff7c8428c3dbfe132035ae81264c1d49c159cfb4e5d2a4db47c2d1e06ea",
    "metadata": {
      "figure": 4,
      "language": "en",
      "layout": "desktop",
      "as_of": "2026-10-16",
      "source_ids": [
        "S01 Table2 printed p33"
      ],
      "creator": "l0g",
      "description": "Annual output growth: 2.5, 2.3, 3.9, 5.5%. Wage gaps against the no-AI path: +7.4, −14.5, −43.9, −54.2%. No probabilities or calendar forecasts."
    }
  },
  "distribution-en-mobile": {
    "pairs": [
      [
        "Higher output need not lift wages",
        "Output and wages follow different paths",
        1
      ],
      [
        "<tspan x=\"24\" dy=\"0\">Higher output need not lift</tspan>",
        "<tspan x=\"24\" dy=\"0\">Output and wages follow</tspan>",
        1
      ],
      [
        "<tspan x=\"24\" dy=\"27.12\">wages</tspan>",
        "<tspan x=\"24\" dy=\"27.12\">different paths</tspan>",
        1
      ]
    ],
    "expectedHash": "5602efab720f8af40fd8d5a5174e56b9116df76e84023930097174ef009fa650",
    "expectedDomHash": "639f22bc05898ba90fa253a4ad9e707d7fee4789880f8567176d50b0d6990cbe",
    "metadata": {
      "figure": 4,
      "language": "en",
      "layout": "mobile",
      "as_of": "2026-10-16",
      "source_ids": [
        "S01 Table2 printed p33"
      ],
      "creator": "l0g",
      "description": "Annual output growth: 2.5, 2.3, 3.9, 5.5%. Wage gaps against the no-AI path: +7.4, −14.5, −43.9, −54.2%. No probabilities or calendar forecasts."
    }
  },
  "evidence-en-desktop": {
    "pairs": [
      [
        "THE UPDATE THAT MATTERS",
        "FIELDWORK FOLLOW-UP",
        1
      ]
    ],
    "expectedHash": "d86609ca149a5795532be308e46b1484a4636fa873b5f694b037702807be323d",
    "expectedDomHash": "18ad861a6ee5f9c4d38f04a41a53b96dd7a53366d84bc752200ecd561f602cea",
    "metadata": {
      "figure": 5,
      "language": "en",
      "layout": "desktop",
      "as_of": "2026-10-16",
      "source_ids": [
        "S05",
        "S06",
        "S07"
      ],
      "creator": "l0g",
      "description": "Support study: 15% more issues per hour, 5,172 agents. Early-2025 METR: 19% more task time, 16 developers and 246 tasks. METR reports selection issues in the February 2026 follow-up."
    }
  }
};
const kinds = ["financing","consumption","erosion","distribution","evidence","valuation"];
const variants = ['fr', 'en'].flatMap(lang => kinds.flatMap(kind => [false, true].map(mobile => ({ lang, kind, mobile, key: `${kind}-${lang}-${mobile ? 'mobile' : 'desktop'}`, svg: aiDemandSvg(lang, kind, mobile) }))));
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
const suppliedStyleHash = "01a9887827b6cc5bfb2d0cf6db4cf7e49a55dce22f012350f5e8cfe59d8d5ad0";
function inspect(v) {
  assert.equal(typeof v.svg, 'string'); assert.ok(v.svg.length > 100 && v.svg.length < 40000);
  assert.doesNotMatch(v.svg, /<!|<\?|&(?!amp;|lt;|gt;|quot;|apos;)/u);
  assert.equal(XMLValidator.validate(v.svg), true);
  const roots = parser.parse(v.svg); assert.equal(roots.length, 1); const root = roots[0]; assert.equal(tag(root), 'svg');
  const index = kinds.indexOf(v.kind) + 1, prefix = `ai-f${String(index).padStart(2, '0')}-${v.lang}-${v.mobile ? 'm' : 'd'}`;
  assert.deepEqual(attrs(root), { xmlns: 'http://www.w3.org/2000/svg', id: prefix, class: 'l0g-ai-svg', viewBox: originals[v.key].viewBox, role: 'img', 'aria-labelledby': `${prefix}-title ${prefix}-desc` });
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
      if (k === 'font-size') assert.ok(number(val) >= 12 && number(val) <= 66);
      if (k === 'text-anchor') assert.ok(['start','middle','end'].includes(val));
      if (k === 'stroke-dasharray') assert.ok(['5 7','7 5','2 6','8 5','4 5','3 4'].includes(val));
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
const fonts = Object.fromEntries([400,700].map(w => [w,fontFrom(`public/fonts/ai-demand/liberation-sans-${w}.ttf`)]));
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
test('AI demand variant selection is frozen, complete and rejects coercion or prototypes', () => {
  assert.deepEqual(AI_DEMAND_KINDS,kinds);assert.ok(Object.isFrozen(AI_DEMAND_KINDS));assert.equal(variants.length,24);
  for(const lang of ['', 'FR','__proto__','constructor',{},null,['fr']])assert.throws(()=>aiDemandSvg(lang,'financing',false),TypeError);
  for(const kind of ['', '__proto__','constructor','prototype',{},null,['financing']])assert.throws(()=>aiDemandSvg('fr',kind,false),TypeError);
  for(const mobile of [0,1,'','false',null,new Boolean(false),{},[]])assert.throws(()=>aiDemandSvg('fr','financing',mobile),TypeError);
  assert.equal(aiDemandSvg('fr','financing'),aiDemandSvg('fr','financing',false));
});
test('18 supplied SVGs retain every byte; six exact editorial title and callout corrections reverse to complete originals', () => { for(const v of variants)faithful(v); });
test('all original glyph outlines, curve extrema and panels remain inside their canvases', () => {
 const issues=[];for(const v of variants){try{geometry(v);}catch(error){issues.push(error.message);}}assert.deepEqual(issues,[]);
});
test('geometry guards reject off-canvas shapes, labels and internal panel overflows', () => {
 const v=variants[0];
 for(const change of [(_,ns)=>{attrs(ns.find(n=>tag(n)==='rect')).x='9999';},(_,ns)=>{attrs(ns.find(n=>tag(n)==='tspan')).x='-10';},(root,ns)=>{root.svg.push(JSON.parse(JSON.stringify(ns.find(n=>tag(n)==='text'))));}])assert.throws(()=>geometry(mutate(v,change)));
 const panel=variants.find(v=>v.kind==='financing'&&v.mobile);assert.throws(()=>geometry(mutate(panel,(_,ns)=>{const n=ns.find(n=>tag(n)==='text'&&xmlText(n)==='Productionbiens et services');assert.ok(n);attrs(children(n)[0]).x='360';})), /text outside panel/u);
});
test('full XML goldens reject geometry, text, metadata, stylesheet and child-order changes', () => {
 const v=variants[0];for(const change of [(_,ns)=>{attrs(ns.find(n=>tag(n)==='tspan')).x='0';},(_,ns)=>{attrs(ns.find(n=>tag(n)==='rect')).fill='var(--panel)';},(_,ns)=>{ns.find(n=>tag(n)==='title').title=[{'#text':'Changed'}];},(_,ns)=>{ns.find(n=>tag(n)==='metadata').metadata=[{'#text':'{}'}];},(_,ns)=>{ns.find(n=>tag(n)==='style').style=[{'#text':'.l0g-ai-svg{fill:red}'}];},root=>{root.svg.reverse();}])assert.throws(()=>faithful(mutate(v,change)));
});
test('passive SVG validator rejects active markup, external resources and malformed fields',()=>{
 const v=variants[0];for(const type of ['script','foreignObject','image','use','a','animate','filter'])assert.throws(()=>inspect(mutate(v,root=>{root.svg.push({[type]:[]});})));
 for(const[field,val]of [['onload','alert(1)'],['href','https://example.org/'],['xlink:href','javascript:alert(1)'],['constructor','x'],['prototype','x'],['transform','translate(0 0)'],['style','fill:red'],['font-size','Infinity'],['x','1e999'],['x','10001']])assert.throws(()=>inspect(mutate(v,(_,ns)=>{attrs(ns.find(n=>tag(n)==='text'))[field]=val;})));
 for(const val of ['url(#x)','url(https://example.org/x)','var(--bg,red)','#fff','red'])assert.throws(()=>inspect(mutate(v,(_,ns)=>{attrs(ns.find(n=>tag(n)==='rect')).fill=val;})));
 for(const val of ['url(https://example.org/x)','url(#ai-f01-fr-d-arrow-teal) trailing','url(#unknown)'])assert.throws(()=>inspect(mutate(v,(_,ns)=>{attrs(ns.find(n=>tag(n)==='path'))['marker-end']=val;})));
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
    if ([1, 16].includes(record.id)) assert.equal(record.value, 'l0g AI Demand Sans');
    if ([2, 17].includes(record.id)) assert.equal(record.value, style);
    if ([3, 4, 18].includes(record.id)) assert.equal(record.value, `l0g AI Demand Sans ${style}`);
    if (record.id === 6) assert.equal(record.value, `l0gAiDemandSans-${style}`);
  }
}
test('redistributed font subsets retain copyrights and use the licensed derivative family name', () => {
  for (const weight of [400, 700]) {
    const subsetBytes = readFileSync(new URL(`../public/fonts/ai-demand/liberation-sans-${weight}.ttf`, import.meta.url));
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
const aiDemandSubsetNotice = 'The redistributed SVG subsets are renamed l0g AI Demand Sans; their original outlines, glyph mapping and metrics are unchanged.';
function assertAiDemandLicense(licence, canonical) {
 assertFontLicenseReferences(licence,'liberation');
 assert.equal(canonical.split('\n').filter(line=>line===canonicalSubsetNotice).length,1);
 assert.equal(licence.split('\n').filter(line=>line===aiDemandSubsetNotice).length,1);
 assert.equal(licence.replace(aiDemandSubsetNotice,canonicalSubsetNotice),canonical,'Only the exact descriptive derivative-family notice differs from the complete canonical licence');
 const copyright='Digitized data copyright (c) 2010 Google Corporation';
 assert.equal(licence.split(copyright).length,2);assert.equal(canonical.split(copyright).length,2);
 assert.equal(licence.slice(licence.indexOf(copyright)),canonical.slice(canonical.indexOf(copyright)),'Every original copyright and OFL clause remains byte-identical');
}

test('dedicated fonts retain every original glyph outline, metrics and canonical complete licence', () => {
  const licence = read('public/fonts/ai-demand/LICENSE.txt');
  assertAiDemandLicense(licence,read('src/epub-assets/debt-chain-fonts/liberation-LICENSE.txt'));
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
 const licence=read('public/fonts/ai-demand/LICENSE.txt');
 for(const text of [licence,licence.replaceAll('\r\n','\n').replaceAll('\n','\r\n')])assertFontLicenseReferences(text,'liberation');
 const urls=['https://github.com/liberationfonts/liberation-fonts','https://github.com/liberationfonts/liberation-fonts/blob/main/LICENSE'];
 for(const url of urls)for(const replacement of [`https://github.com.evil.example${new URL(url).pathname}`,`https://github.com@evil.example${new URL(url).pathname}`,`https://evil.example/?next=${url}`,`https://evil.example/#${url}`,`https://evil.example/${url}`,url.replace('https:','http:'),`${url}?next=bad`,`${url}#bad`,`${url}/bad`,`${url} trailing`,`${url}\u0000`]){
  const lines=licence.split('\n'),i=lines.findIndex(line=>line.endsWith(url));assert.ok(i>=0);lines[i]=lines[i].slice(0,-url.length)+replacement;assert.throws(()=>assertFontLicenseReferences(lines.join('\n'),'liberation'));
 }
 for(const line of licence.split('\n').filter(l=>l.startsWith('Source:')||l.startsWith('Licence source:')))for(const text of [licence.replace(line,''),`${licence}\n${line}`,licence.replace(line,` ${line}`)])assert.throws(()=>assertFontLicenseReferences(text,'liberation'));
});
test('responsive component preserves all theme, font and breakpoint contracts',()=>{
 const component=read('src/components/AiDemandFigure.astro'),style=component.match(/<style>([\s\S]*?)<\/style>/u)?.[1];assert.ok(style);
 const css=postcss.parse(style),declarations=n=>Object.fromEntries(n.nodes.filter(d=>d.type==='decl').map(d=>[d.prop,d.value]));
 const rule=selector=>{const n=css.nodes.find(n=>n.type==='rule'&&n.selector===selector);assert.ok(n,selector);return declarations(n);};
 const mapping={bg:'ink',panel:'surface-2',ink:'paper',muted:'muted',grid:'line-strong',teal:'signal',red:'accent',gold:'amber',blue:'topic-blue',white:'ink'};
 assert.deepEqual(rule('.ai-demand-figure :global(svg.l0g-ai-svg)'),Object.fromEntries(Object.entries(mapping).map(([k,v])=>[`--${k}`,`var(--color-${v})`])));
 const base=rule('.ai-demand-figure');assert.deepEqual([base.width,base['max-width'],base['container-type'],base['padding-bottom'],base.overflow],['100%','760px','inline-size','.85rem','visible']);
 const graphic=rule('.ai-demand-figure :global(svg)');assert.deepEqual([graphic.width,graphic.height,graphic['max-width'],graphic['letter-spacing'],graphic.overflow],['100%','auto','100%','normal','visible']);
 assert.equal(rule('.ai-demand-figure :global(svg text)')['font-family'],"'l0g AI Demand', 'Liberation Sans', Arial, sans-serif");
 const mobile=rule('.ai-demand-mobile');assert.deepEqual([mobile.display,mobile.width,mobile['max-width'],mobile['margin-inline']],['none','100%','420px','auto']);
 const faces=css.nodes.filter(n=>n.type==='atrule'&&n.name==='font-face').map(declarations);
 assert.deepEqual(faces.map(d=>[d['font-family'],d.src,d['font-weight'],d['font-style'],d['font-display']]),[400,700].map(w=>["'l0g AI Demand'",`url('/fonts/ai-demand/liberation-sans-${w}.ttf') format('truetype')`,String(w),'normal','swap']));
 for(const kind of ['media','container']){
  const n=css.nodes.find(n=>n.type==='atrule'&&n.name===kind&&n.params==='(max-width: 640px)');assert.ok(n);
  assert.deepEqual(n.nodes.map(n=>[n.selector,declarations(n).display]),[['.ai-demand-desktop','none'],['.ai-demand-mobile','block']]);
 }
 const themes={dark:new Map(),light:new Map()};postcss.parse(read('src/styles/global.css')).walkDecls(d=>{if(d.parent.type==='atrule'&&d.parent.name==='theme')themes.dark.set(d.prop,d.value);if(d.parent.type==='rule'&&d.parent.selector===':root[data-theme="light"]')themes.light.set(d.prop,d.value);});
 for(const theme of Object.values(themes))for(const v of Object.values(mapping))assert.ok(theme.has(`--color-${v}`));
 assert.doesNotMatch(style,/#(?:[a-f0-9]{3}){1,2}\b|(?:clip-path|overflow\s*:\s*(?:hidden|clip)|transform\s*:|100vw)/iu);
 assert.equal((component.match(/set:html=/gu)??[]).length,2);assert.match(component,/set:html=\{responsiveSvg\(false\)\}/u);assert.match(component,/set:html=\{responsiveSvg\(true\)\}/u);
 assert.ok(component.includes(`const responsiveSvg = (mobile: boolean) => aiDemandSvg(lang, kind, mobile).replace(/^<svg /u, '<svg style="width:100%;height:auto" ');`));
 assert.doesNotMatch(component,/<script|client:|fetch\(|innerHTML/u);
});
const mdxNodes=n=>[n,...(n.children??[]).flatMap(mdxNodes)];
const figureSources={financing:[1,15,16],consumption:[15],erosion:[9],distribution:[1],evidence:[5,6,7],valuation:[14]};
function articleFigures(raw,lang){
 const tree=createProcessor().parse(raw.replace(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/u,'')),figures=mdxNodes(tree).filter(n=>n.name==='AiDemandFigure');assert.equal(figures.length,6);
 for(const[i,n]of figures.entries()){
  const a=Object.fromEntries(n.attributes.map(a=>{assert.equal(a.type,'mdxJsxAttribute');assert.equal(typeof a.value,'string');return[a.name,a.value];}));
  assert.deepEqual(Object.keys(a).sort(),['caption','kind','lang','number','sources']);assert.equal(a.kind,kinds[i]);assert.equal(a.number,String(i+1).padStart(2,'0'));assert.equal(a.lang,lang);assert.ok(a.caption.length>70);
  const refs=a.sources.trim()?a.sources.trim().split(/\s+/u).map(Number):[];assert.deepEqual(refs,figureSources[kinds[i]]);const details=mdxNodes(n).filter(c=>c.name==='details');assert.equal(details.length,1);assert.equal(mdxNodes(details[0]).filter(c=>c.name==='summary').length,1);
 }
}
test('article native MDX includes six ordered static figures, accurate references and method notes',()=>{
 for(const lang of ['fr','en'])articleFigures(read(`src/content/${lang==='fr'?'posts/ia-debouches-rentabilite-innovation':'posts-en/ai-growth-demand-innovation-returns'}.mdx`),lang);
});

test('comma-delimited coordinate pairs are consumed completely without accepting malformed comma runs',()=>{
 assert.deepEqual(pathPoints('M 1,2 L 3,4 L 5,-6'),[[1,2],[3,4],[5,-6]]);
 for(const d of ['M,1 2','M1,,2','M1, 2','M1 2,','M1 2 L,3 4','M1 2 , L3 4'])assert.throws(()=>pathPoints(d));
});
test('the static root adapter adds exactly the responsive style and preserves the complete passive SVG tree',()=>{
 const component=read('src/components/AiDemandFigure.astro');assert.ok(component.includes(`const responsiveSvg = (mobile: boolean) => aiDemandSvg(lang, kind, mobile).replace(/^<svg /u, '<svg style="width:100%;height:auto" ');`));
 for(const v of variants){const adapted=v.svg.replace(/^<svg /u,'<svg style="width:100%;height:auto" '),roots=htmlNodes(parse(adapted)).filter(n=>n.tagName==='svg');assert.equal(roots.length,1);const root=roots[0];assert.equal(root.attrs.filter(a=>a.name==='style').length,1);assert.equal(root.attrs.find(a=>a.name==='style').value,'width:100%;height:auto');const projection={...root,attrs:root.attrs.filter(a=>a.name!=='style')};assert.equal(digest(JSON.stringify(canonical(projection))),textCorrections[v.key]?.expectedDomHash??originals[v.key].domHash);assert.equal(adapted.replace('<svg style="width:100%;height:auto" ','<svg '),v.svg);}
});

test('the derivative-family notice projection rejects modified, missing, duplicate or truncated legal text',()=>{
 const canonical=read('src/epub-assets/debt-chain-fonts/liberation-LICENSE.txt'),licence=read('public/fonts/ai-demand/LICENSE.txt');assertAiDemandLicense(licence,canonical);
 for(const changed of [licence.replace(aiDemandSubsetNotice,canonicalSubsetNotice),licence.replace('l0g AI Demand Sans','l0g Other Sans'),licence+'\n'+aiDemandSubsetNotice,licence.replace('Copyright (c) 2012 Red Hat, Inc.','Copyright changed'),licence.replace('SIL OPEN FONT LICENSE Version 1.1 - 26 February 2007','SIL OPEN FONT LICENSE altered'),licence.slice(0,-100),'Extra notice\n'+licence,licence.replaceAll('\n','\r\n')])assert.throws(()=>assertAiDemandLicense(changed,canonical));
});


function quantitativeGeometry(v) {
 const {root}=inspect(v),ns=scene(root),rects=ns.filter(n=>tag(n)==='rect'),paths=ns.filter(n=>tag(n)==='path');
 const near=(actual,expected,tolerance=.001)=>assert.ok(Number.isFinite(actual)&&Math.abs(actual-expected)<=tolerance,`${v.key}: ${actual} != ${expected}`);
 const bars=(height,colour)=>rects.filter(n=>value(n,'height')===height&&attrs(n).fill===`var(--${colour})`);
 if(v.kind==='consumption'){
  // Independent fictional alternatives in constant-price units. Consumption share is not its level.
  const height=v.mobile?64:66,scale=(v.mobile?364:650)/140,c=bars(height,'teal'),other=bars(height,'panel');assert.equal(c.length,3);assert.equal(other.length,3);
  for(const[i,[output,share]]of [[100,.7],[110,.6],[140,.6]].entries()){
   near(value(c[i],'width'),output*share*scale);near(value(other[i],'width'),output*(1-share)*scale);near(value(other[i],'x'),value(c[i],'x')+value(c[i],'width'));
  }
  near((66/70-1)*100,-5.714285714285716,1e-10);near((84/70-1)*100,20,1e-10);near(70/.6,116.66666666666667,1e-10);
 }
 if(v.kind==='erosion'){
  // Continuous rates: PV is an infinite integral, while visible curves end at year15.
  const parameters=[['blue',.10],['gold',.25],['red',.40]],height=v.mobile?22:24,baseWidth=v.mobile?364:283;
  const x0=v.mobile?58:80,xSpan=v.mobile?326:600,yZero=v.mobile?650:616,ySpan=v.mobile?276:330;
  for(const[colour,erosion]of parameters){
   const curves=paths.filter(n=>attrs(n).stroke===`var(--${colour})`&&value(n,'stroke-width')===3.5);assert.equal(curves.length,1);
   const points=pathPoints(attrs(curves[0]).d);assert.equal(points.length,151);
   for(const[i,point]of points.entries()){const year=i/10;near(point[0],x0+xSpan*year/15,.0051);near(point[1],yZero-ySpan*Math.exp(-(.05+erosion)*year),.0051);}
   const pv=20/(.05+erosion),b=bars(height,colour);assert.equal(b.length,1);near(value(b[0],'width'),baseWidth*pv/150);
  }
  near(20/(.05+.10),133.33333333333331,1e-10);near(20/(.05+.25)-60,6.666666666666671,1e-10);near(20/(.05+.40)-60,-15.555555555555557,1e-10);
 }
 if(v.kind==='distribution'){
  // Four conditional simulations of one model; no probability or dated national forecast.
  const height=v.mobile?18:30,growthScale=(v.mobile?332:235)/6,wageScale=(v.mobile?332:276)/75,growth=bars(height,'blue'),positive=bars(height,'teal'),negative=bars(height,'red');
  assert.equal(growth.length,4);assert.equal(positive.length,1);assert.equal(negative.length,3);
  for(const[i,rate]of [2.5,2.3,3.9,5.5].entries())near(value(growth[i],'width'),rate*growthScale);
  const origin=v.mobile?40:747,zero=origin+60*wageScale;
  near(value(positive[0],'x'),zero);near(value(positive[0],'width'),7.4*wageScale);
  for(const[i,gap]of [14.5,43.9,54.2].entries()){near(value(negative[i],'x'),zero-gap*wageScale);near(value(negative[i],'width'),gap*wageScale);}
  const reference=paths.filter(n=>attrs(n).stroke==='var(--blue)'&&attrs(n)['stroke-dasharray']===(v.mobile?'3 4':'4 5'));assert.equal(reference.length,v.mobile?4:1);
  for(const line of reference)for(const point of pathPoints(attrs(line).d))near(point[0],(v.mobile?40:400)+2*growthScale);
 }
 if(v.kind==='valuation'){
  // Fictional perpetuity, next-year cash flow held at100. Required return is not the natural rate.
  const start=100/(.08-.03),afterReturn=100/(.07-.03),final=100/(.07-.01),increase=afterReturn-start,decline=afterReturn-final;
  near(start,2000);near(increase,500);near(decline,833.3333333333333);near(final,1666.6666666666665);near((final/start-1)*100,-16.666666666666675,1e-10);
  const plotBars=rects.filter(n=>value(n,v.mobile?'height':'width')===(v.mobile?32:139)),blue=plotBars.filter(n=>attrs(n).fill==='var(--blue)'),teal=plotBars.filter(n=>attrs(n).fill==='var(--teal)'),red=plotBars.filter(n=>attrs(n).fill==='var(--red)');assert.equal(blue.length,2);assert.equal(teal.length,1);assert.equal(red.length,1);
  if(v.mobile){
   const scale=364/2600;near(value(blue[0],'width'),start*scale);near(value(teal[0],'width'),increase*scale);near(value(teal[0],'x'),28+start*scale);near(value(red[0],'width'),decline*scale);near(value(red[0],'x'),28+final*scale);near(value(blue[1],'width'),final*scale);
  }else{
   const scale=418/2600,baseline=641;near(value(blue[0],'height'),start*scale);near(value(blue[0],'y'),baseline-start*scale);near(value(teal[0],'height'),increase*scale);near(value(teal[0],'y'),baseline-afterReturn*scale);near(value(red[0],'height'),decline*scale);near(value(red[0],'y'),baseline-afterReturn*scale);near(value(blue[1],'height'),final*scale);near(value(blue[1],'y'),baseline-final*scale);
  }
 }
}
test('independent calculations preserve constant-price consumption, discounted rents, separate model outcomes and fictional valuation scales',()=>{for(const v of variants)quantitativeGeometry(v);});
test('quantitative guards reject altered bars, curve samples and signed model outcomes',()=>{
 for(const kind of ['consumption','erosion','distribution','valuation']){
  const v=variants.find(v=>v.kind===kind&&!v.mobile);assert.throws(()=>quantitativeGeometry(mutate(v,(_,ns)=>{
   if(kind==='erosion'){const n=ns.find(n=>tag(n)==='path'&&attrs(n).stroke==='var(--blue)'&&value(n,'stroke-width')===3.5);assert.ok(n);attrs(n).d=attrs(n).d.replace('286.00','285.00');}
   else{const n=ns.find(n=>tag(n)==='rect'&&attrs(n).fill===(kind==='consumption'?'var(--teal)':'var(--blue)')&&(kind!=='consumption'||value(n,'height')===66));assert.ok(n);attrs(n)[kind==='valuation'?'height':'width']='1';}
  })));
 }
});
