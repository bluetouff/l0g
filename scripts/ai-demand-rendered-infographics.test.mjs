import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { parse } from 'parse5';
const pages=['fr','en'].map(lang=>({lang,html:readFileSync(new URL(`../dist/${lang==='fr'?'posts/ia-debouches-rentabilite-innovation':'en/analysis/ai-growth-demand-innovation-returns'}/index.html`,import.meta.url),'utf8')}));
const nodes=n=>[n,...(n.childNodes??[]).flatMap(nodes)];
const attr=(n,k)=>n.attrs?.find(a=>a.name===k)?.value;
const text=n=>n.nodeName==='#text'?n.value:(n.childNodes??[]).map(text).join('');
const canonical=n=>n.nodeName==='#text'?['#text',n.value]:[n.tagName,(n.attrs??[]).map(a=>[a.name,a.value]).sort(([a],[b])=>a<b?-1:a>b?1:0),(n.childNodes??[]).filter(c=>c.nodeName!=='#text'||c.value.trim()||['text','tspan','title','desc','metadata','style'].includes(n.tagName)).map(canonical)];
// Full browser-tree goldens computed independently from the supplied passive XML.
const originals={
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
const textCorrections={
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
const kinds=["financing","consumption","erosion","distribution","evidence","valuation"];
const references={financing:[1,15,16],consumption:[15],erosion:[9],distribution:[1],evidence:[5,6,7],valuation:[14]};
const classes=(n,name)=>(attr(n,'class')??'').split(/\s+/u).includes(name);
function figures(tree,lang){
 const all=nodes(tree),selected=all.filter(n=>n.tagName==='figure'&&classes(n,'ai-demand-figure'));assert.equal(selected.length,6);
 for(const[i,figure]of selected.entries()){
  assert.deepEqual(['id','data-figure','data-kind'].map(k=>attr(figure,k)),[`figure-${i+1}`,String(i+1).padStart(2,'0'),kinds[i]]);
  const roots=nodes(figure).filter(n=>n.tagName==='svg');assert.equal(roots.length,2);
  for(const[j,root]of roots.entries()){
   const key=`${kinds[i]}-${lang}-${j?'mobile':'desktop'}`,prefix=`ai-f${String(i+1).padStart(2,'0')}-${lang}-${j?'m':'d'}`;
   assert.deepEqual(root.attrs.map(a=>[a.name,a.value]).sort(([a],[b])=>a<b?-1:a>b?1:0),Object.entries({xmlns:'http://www.w3.org/2000/svg',id:prefix,class:'l0g-ai-svg',viewBox:originals[key].viewBox,role:'img','aria-labelledby':`${prefix}-title ${prefix}-desc`,style:'width:100%;height:auto'}).sort(([a],[b])=>a<b?-1:a>b?1:0));
   // Remove only the already-asserted exact root responsive style; compare every remaining original field and child.
   const projection={...root,attrs:root.attrs.filter(a=>a.name!=='style')};
   const hash=createHash('sha256').update(JSON.stringify(canonical(projection))).digest('hex');assert.equal(hash,(textCorrections[key]?.expectedDomHash??originals[key].domHash),`${key}: all native geometry, text, metadata, stylesheet, markers and child order`);
   assert.ok(classes(root.parentNode,`ai-demand-${j?'mobile':'desktop'}`));
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
 const pick=tree=>nodes(tree).find(n=>n.tagName==='svg'&&attr(n,'id')==='ai-f01-fr-d');
 for(const field of ['id','viewBox','role','aria-labelledby','style']){const tree=parse(pages[0].html);setAttribute(pick(tree),field,'changed');assert.throws(()=>figures(tree,'fr'));}
 {const tree=parse(pages[0].html);pick(tree).attrs=pick(tree).attrs.filter(a=>a.name!=='style');assert.throws(()=>figures(tree,'fr'));}
 for(const[field,value]of [['font-family','Arial'],['font-size','1'],['x','0'],['fill','url(https://example.org/x)']]){const tree=parse(pages[0].html),label=nodes(pick(tree)).find(n=>n.tagName==='text');setAttribute(label,field,value);assert.throws(()=>figures(tree,'fr'));}
 for(const type of ['script','foreignObject','image','animate']){const tree=parse(pages[0].html);pick(tree).childNodes.push({nodeName:type,tagName:type,attrs:[],childNodes:[]});assert.throws(()=>figures(tree,'fr'));}
 for(const type of ['tspan','style','metadata','path']){const tree=parse(pages[0].html),n=nodes(pick(tree)).find(n=>n.tagName===type);if(type==='path')setAttribute(n,'d','M0 0 L9999 0');else n.childNodes=[{nodeName:'#text',value:'changed'}];assert.throws(()=>figures(tree,'fr'));}
});
