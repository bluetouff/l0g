import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { XMLBuilder, XMLParser, XMLValidator } from 'fast-xml-parser';
import { parse } from 'parse5';
import { createProcessor } from '@mdx-js/mdx';
import postcss from 'postcss';
import { tokenisationWeekendSvg, TOKENISATION_WEEKEND_KINDS } from '../src/lib/tokenisationWeekendFigures.mjs';

const read = file => readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
const digest = value => createHash('sha256').update(value).digest('hex');
// Independent complete supplied XML and parse5 goldens, with exact invertible text-only changes.
const originals = {
  "calendar-fr-desktop": {
    "rawHash": "a5e828c49f0eff4ea8aab8cb61797603293e4d622abd3fe0f410a9ef48d55c2b",
    "domHash": "5b88fd5e55f4405207f4f6f012d567dedaafa55f1f5eaa75bce17e9009ae8b97",
    "viewBox": "0 0 1100 835",
    "metadata": {
      "figure": 1,
      "language": "fr",
      "layout": "desktop",
      "as_of": "2026-10-16",
      "source_ids": [
        "S05",
        "S06",
        "S08",
        "S09"
      ],
      "creator": "l0g",
      "description": "Comparaison sur une fenêtre de 72 heures : secondaire 24/7, rachats Ondo interrompus 65 h 45, Fedwire interrompu 50 h, FedNow continu chez les participants. Aucun relevé de panne."
    }
  },
  "calendar-fr-mobile": {
    "rawHash": "be0af6143a8d9dc0e6732313c5e9893ebe15b9ef8aeab3fec62095d9865f7f55",
    "domHash": "2fc411a3e5d3b08ad3d4f76537a69d791bacb674f3718aad432701c3b795ebfc",
    "viewBox": "0 0 420 1120",
    "metadata": {
      "figure": 1,
      "language": "fr",
      "layout": "mobile",
      "as_of": "2026-10-16",
      "source_ids": [
        "S05",
        "S06",
        "S08",
        "S09"
      ],
      "creator": "l0g",
      "description": "Comparaison sur une fenêtre de 72 heures : secondaire 24/7, rachats Ondo interrompus 65 h 45, Fedwire interrompu 50 h, FedNow continu chez les participants. Aucun relevé de panne."
    }
  },
  "stock-fr-desktop": {
    "rawHash": "e7b37419825be20b9b926a6a0fd465888ec322ed4f8ad5c970128dc2254c5a55",
    "domHash": "cabcf5b80e57466af6c40ec1337679d75c01d8b6a8ea8a35efea4b8381864801",
    "viewBox": "0 0 1100 820",
    "metadata": {
      "figure": 2,
      "language": "fr",
      "layout": "desktop",
      "as_of": "2026-10-16",
      "source_ids": [
        "S01"
      ],
      "creator": "l0g",
      "description": "Un encours de 65,10 milliards d’actifs couverts par le FMI est décomposé par catégorie. Le flux de repos de 303 milliards par jour est isolé, jamais ajouté à cet encours."
    }
  },
  "stock-fr-mobile": {
    "rawHash": "ea74c880de9bb6b8b2066e40e5a444d6b9e784c54cf93f11be84d08ed0890044",
    "domHash": "928a9db1fc4eae710b2c563f230912b02c26bfb903fdb098bb41117d743fe9cb",
    "viewBox": "0 0 420 1190",
    "metadata": {
      "figure": 2,
      "language": "fr",
      "layout": "mobile",
      "as_of": "2026-10-16",
      "source_ids": [
        "S01"
      ],
      "creator": "l0g",
      "description": "Un encours de 65,10 milliards d’actifs couverts par le FMI est décomposé par catégorie. Le flux de repos de 303 milliards par jour est isolé, jamais ajouté à cet encours."
    }
  },
  "funding-fr-desktop": {
    "rawHash": "71eeb1ad9c75fdab26d38063777e9a358b7335be77f57cfe3b3388e9de21439d",
    "domHash": "86687b52a4e11e5e0f613c3f40a344f305b1986501a1bc63cbdfa7399d95faa8",
    "viewBox": "0 0 1100 850",
    "metadata": {
      "figure": 3,
      "language": "fr",
      "layout": "desktop",
      "as_of": "2026-10-16",
      "source_ids": [],
      "creator": "l0g",
      "description": "100 millions d’actifs dont 8 immédiatement utilisables, plus 4 de crédit disponible. Sorties cumulées de 20 : besoin non financé de 8, sans perte de valeur supposée sur les titres."
    }
  },
  "funding-fr-mobile": {
    "rawHash": "4d04fb257f670afdfc04344281909931c051b3c1f3e34b2329e4e2b4cb251b42",
    "domHash": "3894250764e229aedfd25cb0c6b476c26232d12d1b5c973a89495cb1a35df39b",
    "viewBox": "0 0 420 1200",
    "metadata": {
      "figure": 3,
      "language": "fr",
      "layout": "mobile",
      "as_of": "2026-10-16",
      "source_ids": [],
      "creator": "l0g",
      "description": "100 millions d’actifs dont 8 immédiatement utilisables, plus 4 de crédit disponible. Sorties cumulées de 20 : besoin non financé de 8, sans perte de valeur supposée sur les titres."
    }
  },
  "quote-fr-desktop": {
    "rawHash": "9111b28879cb130006d01e2be76181d86bf31a2968ae293d43cb1ff4ae038ea3",
    "domHash": "14be689d43d14a67a82a589779d8c30d1f35dfc8342e0c57abaf49ecb9a6b075",
    "viewBox": "0 0 1100 875",
    "metadata": {
      "figure": 4,
      "language": "fr",
      "layout": "desktop",
      "as_of": "2026-10-16",
      "source_ids": [
        "S11"
      ],
      "creator": "l0g",
      "description": "La quantité de stablecoins reçue vaut le prix dollar du titre divisé par le prix dollar du stablecoin. Une monnaie à 0,98 dollar peut faire monter une cotation sans hausse du titre, ou masquer sa baisse."
    }
  },
  "quote-fr-mobile": {
    "rawHash": "1b1f968da6973b9c1fee88c56acffea3cf499e830ba57ae1603f1b110d8e39c8",
    "domHash": "c610c8490e57a29cd39e9b97cd93c52b1d913cfd41c665566b9f6e6fd8dc3220",
    "viewBox": "0 0 420 1170",
    "metadata": {
      "figure": 4,
      "language": "fr",
      "layout": "mobile",
      "as_of": "2026-10-16",
      "source_ids": [
        "S11"
      ],
      "creator": "l0g",
      "description": "La quantité de stablecoins reçue vaut le prix dollar du titre divisé par le prix dollar du stablecoin. Une monnaie à 0,98 dollar peut faire monter une cotation sans hausse du titre, ou masquer sa baisse."
    }
  },
  "collateral-fr-desktop": {
    "rawHash": "4adce58241600848792d91370129dc97113a0128e9bb494b1552d74af79cb4f5",
    "domHash": "e465c49871a69fde1be2f3594096519d73b240a7b91acdc68e5b8e663ddbf6b4",
    "viewBox": "0 0 1100 1050",
    "metadata": {
      "figure": 5,
      "language": "fr",
      "layout": "desktop",
      "as_of": "2026-10-16",
      "source_ids": [
        "S13",
        "S04"
      ],
      "creator": "l0g",
      "description": "La valeur du collatéral tombe de 100 à 97 et le facteur de santé de 1,026 à 0,995. Le franchissement rend la position liquidable ; un liquidateur financé doit encore exécuter une transaction. Boucle de baisse conditionnelle."
    }
  },
  "collateral-fr-mobile": {
    "rawHash": "bbcf449898d742478a500452fdf70ce9df5c47f1a2c9f58bba68eb98ba33ddd6",
    "domHash": "4c692880d815bd088cb95257ebc7f15995e1677f5ef20853269863daa10cd117",
    "viewBox": "0 0 420 1520",
    "metadata": {
      "figure": 5,
      "language": "fr",
      "layout": "mobile",
      "as_of": "2026-10-16",
      "source_ids": [
        "S13",
        "S04"
      ],
      "creator": "l0g",
      "description": "La valeur du collatéral tombe de 100 à 97 et le facteur de santé de 1,026 à 0,995. Le franchissement rend la position liquidable ; un liquidateur financé doit encore exécuter une transaction. Boucle de baisse conditionnelle."
    }
  },
  "settlement-fr-desktop": {
    "rawHash": "208c1ca9588be2d7f70080f5a7ff9fe48ccfde21fc0018932cc0dadcba799158",
    "domHash": "a7bb46d524fcf650fedccfb026bb243e80c1c5544851dd8989bc16acec5ff791",
    "viewBox": "0 0 1100 1030",
    "metadata": {
      "figure": 6,
      "language": "fr",
      "layout": "desktop",
      "as_of": "2026-10-16",
      "source_ids": [
        "S03",
        "S04",
        "S18"
      ],
      "creator": "l0g",
      "description": "Compensation légale de deux obligations : 10 à verser. Si 100 doivent être payés avant le retour de 90, le besoin initial est 100. Les paiements bruts totalisent 190, sans exiger 190 simultanément."
    }
  },
  "settlement-fr-mobile": {
    "rawHash": "c4f93a4621dbed12957197cef7d1e64c35e042508cd82197138b77bedb463f83",
    "domHash": "ebfd8ef5400686a3fff6cf8e7166be3616ada003dc5035c6b25380b7afa36485",
    "viewBox": "0 0 420 1370",
    "metadata": {
      "figure": 6,
      "language": "fr",
      "layout": "mobile",
      "as_of": "2026-10-16",
      "source_ids": [
        "S03",
        "S04",
        "S18"
      ],
      "creator": "l0g",
      "description": "Compensation légale de deux obligations : 10 à verser. Si 100 doivent être payés avant le retour de 90, le besoin initial est 100. Les paiements bruts totalisent 190, sans exiger 190 simultanément."
    }
  },
  "evidence-fr-desktop": {
    "rawHash": "6639fb3a8be82bd2e8f2fedd2b8cc371068c49a5a574facdc04c2ae7c2538942",
    "domHash": "6ee8a8398a2355ec2637e63424c0883424681cc7e605c3559f9908d6e315ec3e",
    "viewBox": "0 0 1100 890",
    "metadata": {
      "figure": 7,
      "language": "fr",
      "layout": "desktop",
      "as_of": "2026-10-16",
      "source_ids": [
        "S01"
      ],
      "creator": "l0g",
      "description": "Le ratio publié d’environ 1,5 rapproche des fenêtres distinctes : horaires de séance américains pour les références et toutes heures pour les jetons. Plus de 50 % du volume est hors séance ; environ 80 % des transactions portent sur moins d’une action."
    }
  },
  "evidence-fr-mobile": {
    "rawHash": "711be2b25f7c3e3cfca9395bbcdc02fd206f941286975b98fe3801347f192010",
    "domHash": "d483675d832b8324363caa0f915809cb92fd22df2f9c255103d7bd9be3b60d72",
    "viewBox": "0 0 420 1200",
    "metadata": {
      "figure": 7,
      "language": "fr",
      "layout": "mobile",
      "as_of": "2026-10-16",
      "source_ids": [
        "S01"
      ],
      "creator": "l0g",
      "description": "Le ratio publié d’environ 1,5 rapproche des fenêtres distinctes : horaires de séance américains pour les références et toutes heures pour les jetons. Plus de 50 % du volume est hors séance ; environ 80 % des transactions portent sur moins d’une action."
    }
  },
  "calendar-en-desktop": {
    "rawHash": "434d357f072f39f6748cdb00270e964bae80d507a4df00a6ad4726697f53b345",
    "domHash": "caeeda92652d5d8c2b16d1e3b20adb7d8d2013de7dddbf3389427ee081afc0d2",
    "viewBox": "0 0 1100 835",
    "metadata": {
      "figure": 1,
      "language": "en",
      "layout": "desktop",
      "as_of": "2026-10-16",
      "source_ids": [
        "S05",
        "S06",
        "S08",
        "S09"
      ],
      "creator": "l0g",
      "description": "A 72-hour window: continuous selected secondary trading, a 65h45 primary gap, a 50h Fedwire gap and continuous FedNow at participating institutions. Not an outage record."
    }
  },
  "calendar-en-mobile": {
    "rawHash": "0cc7cd2dc3f51944bf33752f125ecb89f164b5aebefdfaabd13e32994c1cd4d8",
    "domHash": "a64356889637c622df4d14c96fb1c5fb114713970e43b51e0a208d6ac1241ee6",
    "viewBox": "0 0 420 1120",
    "metadata": {
      "figure": 1,
      "language": "en",
      "layout": "mobile",
      "as_of": "2026-10-16",
      "source_ids": [
        "S05",
        "S06",
        "S08",
        "S09"
      ],
      "creator": "l0g",
      "description": "A 72-hour window: continuous selected secondary trading, a 65h45 primary gap, a 50h Fedwire gap and continuous FedNow at participating institutions. Not an outage record."
    }
  },
  "stock-en-desktop": {
    "rawHash": "69ba8c0685a5235d8570250397702bec8af1db3a08184983f2eb3ec7964edb3f",
    "domHash": "998b4b4b1cea43943e16d9945778cb4aa754e27c1f2e81c99052742526130dd4",
    "viewBox": "0 0 1100 820",
    "metadata": {
      "figure": 2,
      "language": "en",
      "layout": "desktop",
      "as_of": "2026-10-16",
      "source_ids": [
        "S01"
      ],
      "creator": "l0g",
      "description": "The IMF’s covered $65.10bn asset stock is split by category. The $303bn mean daily repo flow is displayed separately, never added to that stock."
    }
  },
  "stock-en-mobile": {
    "rawHash": "9c58201fcda3e48c96cf5f309dc91ad95ca4dc9fc2ae14a23d39fe09c948d457",
    "domHash": "4f86d7422b9d68496237eb212ae792da858392ef589f99d24b6e83141f249490",
    "viewBox": "0 0 420 1190",
    "metadata": {
      "figure": 2,
      "language": "en",
      "layout": "mobile",
      "as_of": "2026-10-16",
      "source_ids": [
        "S01"
      ],
      "creator": "l0g",
      "description": "The IMF’s covered $65.10bn asset stock is split by category. The $303bn mean daily repo flow is displayed separately, never added to that stock."
    }
  },
  "funding-en-desktop": {
    "rawHash": "9857dcb1573d7b98ed6e4dd6bea1fa49f0bb0f3138f743636250d447142cdb3c",
    "domHash": "7bead8032c4678bff541bbf2e53ba25ae041239922129116ce3a369b73963ef9",
    "viewBox": "0 0 1100 850",
    "metadata": {
      "figure": 3,
      "language": "en",
      "layout": "desktop",
      "as_of": "2026-10-16",
      "source_ids": [],
      "creator": "l0g",
      "description": "100 in assets, 8 usable immediately, plus 4 of available credit. Cumulative outflows of 20 leave 8 unfunded, without assuming any loss in securities values."
    }
  },
  "funding-en-mobile": {
    "rawHash": "3a09dd6fc7923b66b89e1d68504f35769af22829db71f9701bdbb5439a84d440",
    "domHash": "05c02baa52fc0765eb777a53b60be6d78509c51dac2c99d9304470b448464798",
    "viewBox": "0 0 420 1200",
    "metadata": {
      "figure": 3,
      "language": "en",
      "layout": "mobile",
      "as_of": "2026-10-16",
      "source_ids": [],
      "creator": "l0g",
      "description": "100 in assets, 8 usable immediately, plus 4 of available credit. Cumulative outflows of 20 leave 8 unfunded, without assuming any loss in securities values."
    }
  },
  "quote-en-desktop": {
    "rawHash": "940332f538bd9647a20d5a3bccb5d333010d314534dfbb3546d5d9fc951809d7",
    "domHash": "3117ce252bd81a64786a584e45beaea79ffb3f0be43ab0f28d79efb84fe423ac",
    "viewBox": "0 0 1100 875",
    "metadata": {
      "figure": 4,
      "language": "en",
      "layout": "desktop",
      "as_of": "2026-10-16",
      "source_ids": [
        "S11"
      ],
      "creator": "l0g",
      "description": "The stablecoin quote equals the security’s dollar price divided by the stablecoin’s dollar price. A $0.98 payment coin can raise the quote without an asset gain, or hide a decline."
    }
  },
  "quote-en-mobile": {
    "rawHash": "4d21114dab370309f2ca6d6233b254dd54fea4973a4fa1618ee8da2fe6cc57e8",
    "domHash": "c1ef9c73c58b237cfcfc1e4f292ade449542cb252a47a703a08dc8379ce4484f",
    "viewBox": "0 0 420 1170",
    "metadata": {
      "figure": 4,
      "language": "en",
      "layout": "mobile",
      "as_of": "2026-10-16",
      "source_ids": [
        "S11"
      ],
      "creator": "l0g",
      "description": "The stablecoin quote equals the security’s dollar price divided by the stablecoin’s dollar price. A $0.98 payment coin can raise the quote without an asset gain, or hide a decline."
    }
  },
  "collateral-en-desktop": {
    "rawHash": "29b750fd81f48c75c85de723c9d8d57ab0fae899baf3129e0f55380e2db8db92",
    "domHash": "9596ca96d17ffd91fa6a53dfa851e8351f72daff07f81521dc9662457b53d1d4",
    "viewBox": "0 0 1100 1050",
    "metadata": {
      "figure": 5,
      "language": "en",
      "layout": "desktop",
      "as_of": "2026-10-16",
      "source_ids": [
        "S13",
        "S04"
      ],
      "creator": "l0g",
      "description": "Collateral falls from 100 to 97 and health factor from 1.026 to 0.995. Crossing the threshold makes liquidation possible; a funded liquidator must still transact. The downward feedback is conditional."
    }
  },
  "collateral-en-mobile": {
    "rawHash": "58c5e683c299d12d18153e41d1da669abb5b50326672ecf1e4cf3f1319ff75bd",
    "domHash": "f83c617de488860d506a5779f3eb3aa666549466d152f41eea1056947fa8c3b4",
    "viewBox": "0 0 420 1520",
    "metadata": {
      "figure": 5,
      "language": "en",
      "layout": "mobile",
      "as_of": "2026-10-16",
      "source_ids": [
        "S13",
        "S04"
      ],
      "creator": "l0g",
      "description": "Collateral falls from 100 to 97 and health factor from 1.026 to 0.995. Crossing the threshold makes liquidation possible; a funded liquidator must still transact. The downward feedback is conditional."
    }
  },
  "settlement-en-desktop": {
    "rawHash": "3adf940d468bd2f53f041f461082c0a4cc71b10dd400be1ce2030c69e371edb7",
    "domHash": "6c93784ef21cd2b660fe6ebdc42a44c9629c43fca4e9cc19526834baab9277ee",
    "viewBox": "0 0 1100 1030",
    "metadata": {
      "figure": 6,
      "language": "en",
      "layout": "desktop",
      "as_of": "2026-10-16",
      "source_ids": [
        "S03",
        "S04",
        "S18"
      ],
      "creator": "l0g",
      "description": "Legally netting two obligations leaves 10 due. If 100 must be paid before 90 returns, initial funding is 100. Gross turnover is 190, not a simultaneous need for 190."
    }
  },
  "settlement-en-mobile": {
    "rawHash": "2490e607c9ee49f7790ee64159f279a7b02462b27d16b314ff45f0aa3d5b2785",
    "domHash": "99ab3e1cff5e123508e4a95b56e3d3634203c859b23a36a299a7703069d059cc",
    "viewBox": "0 0 420 1370",
    "metadata": {
      "figure": 6,
      "language": "en",
      "layout": "mobile",
      "as_of": "2026-10-16",
      "source_ids": [
        "S03",
        "S04",
        "S18"
      ],
      "creator": "l0g",
      "description": "Legally netting two obligations leaves 10 due. If 100 must be paid before 90 returns, initial funding is 100. Gross turnover is 190, not a simultaneous need for 190."
    }
  },
  "evidence-en-desktop": {
    "rawHash": "c977d376d961f07aa1a849af75835ed59152d01d1053b2085d2b4a51e4656e96",
    "domHash": "dc33dbab145e44894ecacac3c794e784c88a8e3e06c5ab85d72c05a27681637d",
    "viewBox": "0 0 1100 890",
    "metadata": {
      "figure": 7,
      "language": "en",
      "layout": "desktop",
      "as_of": "2026-10-16",
      "source_ids": [
        "S01"
      ],
      "creator": "l0g",
      "description": "The published roughly 1.5 ratio uses US market hours for traditional references and all hours for tokens. More than 50% of volume is outside regular hours; about 80% of trades are smaller than one share."
    }
  },
  "evidence-en-mobile": {
    "rawHash": "901c24fb376d35f1f60d06557fde878906cdaa1b88bba4720d8db20568875ae9",
    "domHash": "93572a8161bd54041cba160b80635f966132212e279eac7849ec0f35648ece8e",
    "viewBox": "0 0 420 1200",
    "metadata": {
      "figure": 7,
      "language": "en",
      "layout": "mobile",
      "as_of": "2026-10-16",
      "source_ids": [
        "S01"
      ],
      "creator": "l0g",
      "description": "The published roughly 1.5 ratio uses US market hours for traditional references and all hours for tokens. More than 50% of volume is outside regular hours; about 80% of trades are smaller than one share."
    }
  }
};
const textCorrections = {
  "calendar-fr-desktop": {
    "pairs": [
      [
        "<text x=\"40\" y=\"87\" font-size=\"33\" font-weight=\"700\" text-anchor=\"start\" class=\"ink\"><tspan x=\"40\" dy=\"0\">Quatre horloges pour sortir</tspan></text>",
        "<text x=\"40\" y=\"87\" font-size=\"33\" font-weight=\"700\" text-anchor=\"start\" class=\"ink\"><tspan x=\"40\" dy=\"0\">Vente, rachat et règlement</tspan></text>",
        1
      ],
      [
        "<title id=\"tkn-f01-fr-d-title\">Quatre horloges pour sortir</title>",
        "<title id=\"tkn-f01-fr-d-title\">Vente, rachat et règlement</title>",
        1
      ],
      [
        "<desc id=\"tkn-f01-fr-d-desc\">Comparaison sur une fenêtre de 72 heures : secondaire 24/7, rachats Ondo interrompus 65 h 45, Fedwire interrompu 50 h, FedNow continu chez les participants. Aucun relevé de panne.</desc>",
        "<desc id=\"tkn-f01-fr-d-desc\">Comparaison sur une fenêtre de 72 heures : secondaire 24/7, rachats Ondo interrompus 65 h 45, Fedwire interrompu 50 h, FedNow continu chez les participants. Aucun relevé de panne. Traitement Ondo soumis aux horaires des constituants, aux pauses et à l’éligibilité.</desc>",
        1
      ],
      [
        "<metadata>{&quot;figure&quot;: 1, &quot;language&quot;: &quot;fr&quot;, &quot;layout&quot;: &quot;desktop&quot;, &quot;as_of&quot;: &quot;2026-10-16&quot;, &quot;source_ids&quot;: [&quot;S05&quot;, &quot;S06&quot;, &quot;S08&quot;, &quot;S09&quot;], &quot;creator&quot;: &quot;l0g&quot;, &quot;description&quot;: &quot;Comparaison sur une fenêtre de 72 heures : secondaire 24/7, rachats Ondo interrompus 65 h 45, Fedwire interrompu 50 h, FedNow continu chez les participants. Aucun relevé de panne.&quot;}</metadata>",
        "<metadata>{&quot;figure&quot;: 1, &quot;language&quot;: &quot;fr&quot;, &quot;layout&quot;: &quot;desktop&quot;, &quot;as_of&quot;: &quot;2026-10-16&quot;, &quot;source_ids&quot;: [&quot;S05&quot;, &quot;S06&quot;, &quot;S08&quot;, &quot;S09&quot;], &quot;creator&quot;: &quot;l0g&quot;, &quot;description&quot;: &quot;Comparaison sur une fenêtre de 72 heures : secondaire 24/7, rachats Ondo interrompus 65 h 45, Fedwire interrompu 50 h, FedNow continu chez les participants. Aucun relevé de panne. Traitement Ondo soumis aux horaires des constituants, aux pauses et à l’éligibilité.&quot;}</metadata>",
        1
      ]
    ],
    "expectedHash": "4ae00628cfc981908ffed86d1af1d32e0fccdb9ba38914fb6b197d184f07c7b4",
    "metadata": {
      "figure": 1,
      "language": "fr",
      "layout": "desktop",
      "as_of": "2026-10-16",
      "source_ids": [
        "S05",
        "S06",
        "S08",
        "S09"
      ],
      "creator": "l0g",
      "description": "Comparaison sur une fenêtre de 72 heures : secondaire 24/7, rachats Ondo interrompus 65 h 45, Fedwire interrompu 50 h, FedNow continu chez les participants. Aucun relevé de panne. Traitement Ondo soumis aux horaires des constituants, aux pauses et à l’éligibilité."
    },
    "expectedDomHash": "e6b6a24750750a5f606108dbe1d3e60773219b9e509cd7c2006d118e5e4e72b2"
  },
  "calendar-fr-mobile": {
    "pairs": [
      [
        "<text x=\"24\" y=\"72\" font-size=\"24\" font-weight=\"700\" text-anchor=\"start\" class=\"ink\"><tspan x=\"24\" dy=\"0\">Quatre horloges pour sortir</tspan></text>",
        "<text x=\"24\" y=\"72\" font-size=\"24\" font-weight=\"700\" text-anchor=\"start\" class=\"ink\"><tspan x=\"24\" dy=\"0\">Vente, rachat et règlement</tspan></text>",
        1
      ],
      [
        "<title id=\"tkn-f01-fr-m-title\">Quatre horloges pour sortir</title>",
        "<title id=\"tkn-f01-fr-m-title\">Vente, rachat et règlement</title>",
        1
      ],
      [
        "<desc id=\"tkn-f01-fr-m-desc\">Comparaison sur une fenêtre de 72 heures : secondaire 24/7, rachats Ondo interrompus 65 h 45, Fedwire interrompu 50 h, FedNow continu chez les participants. Aucun relevé de panne.</desc>",
        "<desc id=\"tkn-f01-fr-m-desc\">Comparaison sur une fenêtre de 72 heures : secondaire 24/7, rachats Ondo interrompus 65 h 45, Fedwire interrompu 50 h, FedNow continu chez les participants. Aucun relevé de panne. Traitement Ondo soumis aux horaires des constituants, aux pauses et à l’éligibilité.</desc>",
        1
      ],
      [
        "<metadata>{&quot;figure&quot;: 1, &quot;language&quot;: &quot;fr&quot;, &quot;layout&quot;: &quot;mobile&quot;, &quot;as_of&quot;: &quot;2026-10-16&quot;, &quot;source_ids&quot;: [&quot;S05&quot;, &quot;S06&quot;, &quot;S08&quot;, &quot;S09&quot;], &quot;creator&quot;: &quot;l0g&quot;, &quot;description&quot;: &quot;Comparaison sur une fenêtre de 72 heures : secondaire 24/7, rachats Ondo interrompus 65 h 45, Fedwire interrompu 50 h, FedNow continu chez les participants. Aucun relevé de panne.&quot;}</metadata>",
        "<metadata>{&quot;figure&quot;: 1, &quot;language&quot;: &quot;fr&quot;, &quot;layout&quot;: &quot;mobile&quot;, &quot;as_of&quot;: &quot;2026-10-16&quot;, &quot;source_ids&quot;: [&quot;S05&quot;, &quot;S06&quot;, &quot;S08&quot;, &quot;S09&quot;], &quot;creator&quot;: &quot;l0g&quot;, &quot;description&quot;: &quot;Comparaison sur une fenêtre de 72 heures : secondaire 24/7, rachats Ondo interrompus 65 h 45, Fedwire interrompu 50 h, FedNow continu chez les participants. Aucun relevé de panne. Traitement Ondo soumis aux horaires des constituants, aux pauses et à l’éligibilité.&quot;}</metadata>",
        1
      ]
    ],
    "expectedHash": "94f65ba1b98b23833140e192625787a5ba5690f221ee162ef9d843196b369538",
    "metadata": {
      "figure": 1,
      "language": "fr",
      "layout": "mobile",
      "as_of": "2026-10-16",
      "source_ids": [
        "S05",
        "S06",
        "S08",
        "S09"
      ],
      "creator": "l0g",
      "description": "Comparaison sur une fenêtre de 72 heures : secondaire 24/7, rachats Ondo interrompus 65 h 45, Fedwire interrompu 50 h, FedNow continu chez les participants. Aucun relevé de panne. Traitement Ondo soumis aux horaires des constituants, aux pauses et à l’éligibilité."
    },
    "expectedDomHash": "82a6481ae7d97797262eef5714276e97567867b95ec0c29ce07a56f311334ee3"
  },
  "stock-fr-desktop": {
    "pairs": [
      [
        "<text x=\"40\" y=\"87\" font-size=\"33\" font-weight=\"700\" text-anchor=\"start\" class=\"ink\"><tspan x=\"40\" dy=\"0\">La taille n’est pas la liquidité</tspan></text>",
        "<text x=\"40\" y=\"87\" font-size=\"33\" font-weight=\"700\" text-anchor=\"start\" class=\"ink\"><tspan x=\"40\" dy=\"0\">Encours et activité de repos</tspan></text>",
        1
      ],
      [
        "<title id=\"tkn-f02-fr-d-title\">La taille n’est pas la liquidité</title>",
        "<title id=\"tkn-f02-fr-d-title\">Encours et activité de repos</title>",
        1
      ],
      [
        "<text x=\"770\" y=\"550\" font-size=\"22\" font-weight=\"700\" text-anchor=\"start\" class=\"ink\"><tspan x=\"770\" dy=\"0\">Un flux renouvelable, à</tspan><tspan x=\"770\" dy=\"27.5\">ne pas additionner à</tspan><tspan x=\"770\" dy=\"27.5\">l’encours.</tspan></text>",
        "<text x=\"770\" y=\"550\" font-size=\"22\" font-weight=\"700\" text-anchor=\"start\" class=\"ink\"><tspan x=\"770\" dy=\"0\">Activité mesurée</tspan><tspan x=\"770\" dy=\"27.5\">en flux quotidien,</tspan><tspan x=\"770\" dy=\"27.5\">distincte de l’encours.</tspan></text>",
        1
      ]
    ],
    "expectedHash": "7667f9842b6ec63924e52d852027bf22d066d88931fbb6fd14fa77f43b4f97fb",
    "metadata": {
      "figure": 2,
      "language": "fr",
      "layout": "desktop",
      "as_of": "2026-10-16",
      "source_ids": [
        "S01"
      ],
      "creator": "l0g",
      "description": "Un encours de 65,10 milliards d’actifs couverts par le FMI est décomposé par catégorie. Le flux de repos de 303 milliards par jour est isolé, jamais ajouté à cet encours."
    },
    "expectedDomHash": "7e2175f6c7eb1b599dc9ebbf689bf1c82a9d2ed6153c34abb07b75df40624936"
  },
  "stock-fr-mobile": {
    "pairs": [
      [
        "<text x=\"24\" y=\"72\" font-size=\"24\" font-weight=\"700\" text-anchor=\"start\" class=\"ink\"><tspan x=\"24\" dy=\"0\">La taille n’est pas la liquidité</tspan></text>",
        "<text x=\"24\" y=\"72\" font-size=\"24\" font-weight=\"700\" text-anchor=\"start\" class=\"ink\"><tspan x=\"24\" dy=\"0\">Encours et activité de repos</tspan></text>",
        1
      ],
      [
        "<title id=\"tkn-f02-fr-m-title\">La taille n’est pas la liquidité</title>",
        "<title id=\"tkn-f02-fr-m-title\">Encours et activité de repos</title>",
        1
      ],
      [
        "<text x=\"30\" y=\"945\" font-size=\"19\" font-weight=\"700\" text-anchor=\"start\" class=\"ink\"><tspan x=\"30\" dy=\"0\">Une activité renouvelée ; aucun ajout</tspan><tspan x=\"30\" dy=\"23.75\">au stock ci-dessus.</tspan></text>",
        "<text x=\"30\" y=\"945\" font-size=\"19\" font-weight=\"700\" text-anchor=\"start\" class=\"ink\"><tspan x=\"30\" dy=\"0\">Une activité mesurée en flux</tspan><tspan x=\"30\" dy=\"23.75\">quotidien, distincte de l’encours.</tspan></text>",
        1
      ]
    ],
    "expectedHash": "5b13ef72a5b6bd0ab334de148fee64037812b59ea429535f0ae66d671eef1b44",
    "metadata": {
      "figure": 2,
      "language": "fr",
      "layout": "mobile",
      "as_of": "2026-10-16",
      "source_ids": [
        "S01"
      ],
      "creator": "l0g",
      "description": "Un encours de 65,10 milliards d’actifs couverts par le FMI est décomposé par catégorie. Le flux de repos de 303 milliards par jour est isolé, jamais ajouté à cet encours."
    },
    "expectedDomHash": "78ca2cfb47a18a7087d030eb00c2115c1cdf180a144075eec3f7798b954bd5f1"
  },
  "funding-fr-desktop": {
    "pairs": [
      [
        "<text x=\"400\" y=\"198\" font-size=\"17\" font-weight=\"700\" text-anchor=\"start\" class=\"muted\"><tspan x=\"400\" dy=\"0\">SORTIES CUMULÉES ET FINANCEMENT</tspan></text>",
        "<text x=\"400\" y=\"198\" font-size=\"17\" font-weight=\"700\" text-anchor=\"start\" class=\"muted\"><tspan x=\"400\" dy=\"0\">DEMANDES CUMULÉES ET FINANCEMENT</tspan></text>",
        1
      ],
      [
        "<text x=\"430\" y=\"645\" font-size=\"26\" font-weight=\"700\" text-anchor=\"start\" class=\"red\"><tspan x=\"430\" dy=\"0\">20 de sorties − 12 disponibles = 8 à financer</tspan></text>",
        "<text x=\"430\" y=\"645\" font-size=\"26\" font-weight=\"700\" text-anchor=\"start\" class=\"red\"><tspan x=\"430\" dy=\"0\">20 demandés − 12 disponibles = 8 à financer</tspan></text>",
        1
      ],
      [
        "<desc id=\"tkn-f03-fr-d-desc\">100 millions d’actifs dont 8 immédiatement utilisables, plus 4 de crédit disponible. Sorties cumulées de 20 : besoin non financé de 8, sans perte de valeur supposée sur les titres.</desc>",
        "<desc id=\"tkn-f03-fr-d-desc\">100 millions d’actifs dont 8 immédiatement utilisables, plus 4 de crédit disponible. Demandes cumulées de 20 : besoin non financé de 8, sans perte de valeur supposée sur les titres.</desc>",
        1
      ],
      [
        "<metadata>{&quot;figure&quot;: 3, &quot;language&quot;: &quot;fr&quot;, &quot;layout&quot;: &quot;desktop&quot;, &quot;as_of&quot;: &quot;2026-10-16&quot;, &quot;source_ids&quot;: [], &quot;creator&quot;: &quot;l0g&quot;, &quot;description&quot;: &quot;100 millions d’actifs dont 8 immédiatement utilisables, plus 4 de crédit disponible. Sorties cumulées de 20 : besoin non financé de 8, sans perte de valeur supposée sur les titres.&quot;}</metadata>",
        "<metadata>{&quot;figure&quot;: 3, &quot;language&quot;: &quot;fr&quot;, &quot;layout&quot;: &quot;desktop&quot;, &quot;as_of&quot;: &quot;2026-10-16&quot;, &quot;source_ids&quot;: [], &quot;creator&quot;: &quot;l0g&quot;, &quot;description&quot;: &quot;100 millions d’actifs dont 8 immédiatement utilisables, plus 4 de crédit disponible. Demandes cumulées de 20 : besoin non financé de 8, sans perte de valeur supposée sur les titres.&quot;}</metadata>",
        1
      ],
      [
        "<text x=\"40\" y=\"806.24\" font-size=\"17\" font-weight=\"400\" text-anchor=\"start\" class=\"muted\"><tspan x=\"40\" dy=\"0\">Source : scénario l0g ; calculs dans funding_scenario.csv. Trait rouge : demandes cumulées ; seuil bleu : monnaie +</tspan><tspan x=\"40\" dy=\"21.76\">crédit. Aucun chiffre observé, aucune calibration d’Ondo ou BUIDL.</tspan></text>",
        "<text x=\"40\" y=\"806.24\" font-size=\"17\" font-weight=\"400\" text-anchor=\"start\" class=\"muted\"><tspan x=\"40\" dy=\"0\">Source : scénario l0g ; calculs dans la légende. Trait rouge : demandes cumulées ; seuil bleu : monnaie +</tspan><tspan x=\"40\" dy=\"21.76\">crédit. Aucun chiffre observé, aucune calibration d’Ondo ou BUIDL.</tspan></text>",
        1
      ]
    ],
    "expectedHash": "e5ddbbf3fcea421402646bd624115271da3cb037b6ac7829872e00669f6b8b06",
    "metadata": {
      "figure": 3,
      "language": "fr",
      "layout": "desktop",
      "as_of": "2026-10-16",
      "source_ids": [],
      "creator": "l0g",
      "description": "100 millions d’actifs dont 8 immédiatement utilisables, plus 4 de crédit disponible. Demandes cumulées de 20 : besoin non financé de 8, sans perte de valeur supposée sur les titres."
    },
    "expectedDomHash": "3d6720858aa61f7a44b93b9a1ca1a9868687233af1466b9323e949dcc6734608"
  },
  "funding-fr-mobile": {
    "pairs": [
      [
        "<text x=\"30\" y=\"444\" font-size=\"14\" font-weight=\"700\" text-anchor=\"start\" class=\"muted\"><tspan x=\"30\" dy=\"0\">SORTIES CUMULÉES ET FINANCEMENT</tspan></text>",
        "<text x=\"30\" y=\"444\" font-size=\"14\" font-weight=\"700\" text-anchor=\"start\" class=\"muted\"><tspan x=\"30\" dy=\"0\">DEMANDES CUMULÉES ET FINANCEMENT</tspan></text>",
        1
      ],
      [
        "<text x=\"30\" y=\"856\" font-size=\"21\" font-weight=\"700\" text-anchor=\"start\" class=\"ink\"><tspan x=\"30\" dy=\"0\">20 de sorties − 12 disponibles</tspan></text>",
        "<text x=\"30\" y=\"856\" font-size=\"21\" font-weight=\"700\" text-anchor=\"start\" class=\"ink\"><tspan x=\"30\" dy=\"0\">20 demandés − 12 disponibles</tspan></text>",
        1
      ],
      [
        "<desc id=\"tkn-f03-fr-m-desc\">100 millions d’actifs dont 8 immédiatement utilisables, plus 4 de crédit disponible. Sorties cumulées de 20 : besoin non financé de 8, sans perte de valeur supposée sur les titres.</desc>",
        "<desc id=\"tkn-f03-fr-m-desc\">100 millions d’actifs dont 8 immédiatement utilisables, plus 4 de crédit disponible. Demandes cumulées de 20 : besoin non financé de 8, sans perte de valeur supposée sur les titres.</desc>",
        1
      ],
      [
        "<metadata>{&quot;figure&quot;: 3, &quot;language&quot;: &quot;fr&quot;, &quot;layout&quot;: &quot;mobile&quot;, &quot;as_of&quot;: &quot;2026-10-16&quot;, &quot;source_ids&quot;: [], &quot;creator&quot;: &quot;l0g&quot;, &quot;description&quot;: &quot;100 millions d’actifs dont 8 immédiatement utilisables, plus 4 de crédit disponible. Sorties cumulées de 20 : besoin non financé de 8, sans perte de valeur supposée sur les titres.&quot;}</metadata>",
        "<metadata>{&quot;figure&quot;: 3, &quot;language&quot;: &quot;fr&quot;, &quot;layout&quot;: &quot;mobile&quot;, &quot;as_of&quot;: &quot;2026-10-16&quot;, &quot;source_ids&quot;: [], &quot;creator&quot;: &quot;l0g&quot;, &quot;description&quot;: &quot;100 millions d’actifs dont 8 immédiatement utilisables, plus 4 de crédit disponible. Demandes cumulées de 20 : besoin non financé de 8, sans perte de valeur supposée sur les titres.&quot;}</metadata>",
        1
      ],
      [
        "<text x=\"24\" y=\"1101.2\" font-size=\"15\" font-weight=\"400\" text-anchor=\"start\" class=\"muted\"><tspan x=\"24\" dy=\"0\">Source : scénario l0g ; calculs dans</tspan><tspan x=\"24\" dy=\"19.2\">funding_scenario.csv. Trait rouge : demandes</tspan><tspan x=\"24\" dy=\"19.2\">cumulées ; seuil bleu : monnaie + crédit. Aucun</tspan><tspan x=\"24\" dy=\"19.2\">chiffre observé, aucune calibration d’Ondo ou</tspan><tspan x=\"24\" dy=\"19.2\">BUIDL.</tspan></text>",
        "<text x=\"24\" y=\"1101.2\" font-size=\"15\" font-weight=\"400\" text-anchor=\"start\" class=\"muted\"><tspan x=\"24\" dy=\"0\">Source : scénario l0g ; calculs dans</tspan><tspan x=\"24\" dy=\"19.2\">la légende. Trait rouge : demandes</tspan><tspan x=\"24\" dy=\"19.2\">cumulées ; seuil bleu : monnaie + crédit. Aucun</tspan><tspan x=\"24\" dy=\"19.2\">chiffre observé, aucune calibration d’Ondo ou</tspan><tspan x=\"24\" dy=\"19.2\">BUIDL.</tspan></text>",
        1
      ]
    ],
    "expectedHash": "b1f80f68ec95c7b32b6655367b23cef7e18af9e52b5ff3504cf634af88be6d1d",
    "metadata": {
      "figure": 3,
      "language": "fr",
      "layout": "mobile",
      "as_of": "2026-10-16",
      "source_ids": [],
      "creator": "l0g",
      "description": "100 millions d’actifs dont 8 immédiatement utilisables, plus 4 de crédit disponible. Demandes cumulées de 20 : besoin non financé de 8, sans perte de valeur supposée sur les titres."
    },
    "expectedDomHash": "9dfd760011e778c82640f2136ca4d0facaf02ecfc879e17c4e1e3e4e1a9388ee"
  },
  "quote-fr-desktop": {
    "pairs": [
      [
        "<text x=\"40\" y=\"831.24\" font-size=\"17\" font-weight=\"400\" text-anchor=\"start\" class=\"muted\"><tspan x=\"40\" dy=\"0\">Source : calculs l0g, quote_scenarios.csv. Hors frais et écarts acheteur-vendeur. 0,98 $ est une hypothèse, pas un</tspan><tspan x=\"40\" dy=\"21.76\">cours observé. S11 : risque de prix sur les plateformes tierces.</tspan></text>",
        "<text x=\"40\" y=\"831.24\" font-size=\"17\" font-weight=\"400\" text-anchor=\"start\" class=\"muted\"><tspan x=\"40\" dy=\"0\">Source : calculs l0g, exemple en légende. Hors frais et écarts acheteur-vendeur. 0,98 $ est une hypothèse, pas un</tspan><tspan x=\"40\" dy=\"21.76\">cours observé. S11 : risque de prix sur les plateformes tierces.</tspan></text>",
        1
      ]
    ],
    "expectedHash": "f33ab3ef998aa428c2bc11eccb2bac33fa4b0d57df634cfc38e0fce116607658",
    "metadata": {
      "figure": 4,
      "language": "fr",
      "layout": "desktop",
      "as_of": "2026-10-16",
      "source_ids": [
        "S11"
      ],
      "creator": "l0g",
      "description": "La quantité de stablecoins reçue vaut le prix dollar du titre divisé par le prix dollar du stablecoin. Une monnaie à 0,98 dollar peut faire monter une cotation sans hausse du titre, ou masquer sa baisse."
    },
    "expectedDomHash": "f8add51e5c3a226567f72bfc2d1c5de856cb91d20e4c05b7735f1ef1a4d79c25"
  },
  "quote-fr-mobile": {
    "pairs": [
      [
        "<text x=\"30\" y=\"1004\" font-size=\"22\" font-weight=\"700\" text-anchor=\"start\" class=\"ink\"><tspan x=\"30\" dy=\"0\">Une cotation stable ne garantit</tspan><tspan x=\"30\" dy=\"27.5\">pas un pouvoir d’achat stable</tspan><tspan x=\"30\" dy=\"27.5\">en dollars.</tspan></text>",
        "<text x=\"30\" y=\"1004\" font-size=\"22\" font-weight=\"700\" text-anchor=\"start\" class=\"ink\"><tspan x=\"30\" dy=\"0\">Le pouvoir d’achat en dollars</tspan><tspan x=\"30\" dy=\"27.5\">dépend aussi de la monnaie</tspan><tspan x=\"30\" dy=\"27.5\">reçue en paiement.</tspan></text>",
        1
      ],
      [
        "<text x=\"24\" y=\"1090.4\" font-size=\"15\" font-weight=\"400\" text-anchor=\"start\" class=\"muted\"><tspan x=\"24\" dy=\"0\">Source : calculs l0g, quote_scenarios.csv. Hors</tspan><tspan x=\"24\" dy=\"19.2\">frais et écarts acheteur-vendeur. 0,98 $ est une</tspan><tspan x=\"24\" dy=\"19.2\">hypothèse, pas un cours observé. S11 : risque de</tspan><tspan x=\"24\" dy=\"19.2\">prix sur les plateformes tierces.</tspan></text>",
        "<text x=\"24\" y=\"1090.4\" font-size=\"15\" font-weight=\"400\" text-anchor=\"start\" class=\"muted\"><tspan x=\"24\" dy=\"0\">Source : calculs l0g, exemple en légende. Hors</tspan><tspan x=\"24\" dy=\"19.2\">frais et écarts acheteur-vendeur. 0,98 $ est une</tspan><tspan x=\"24\" dy=\"19.2\">hypothèse, pas un cours observé. S11 : risque de</tspan><tspan x=\"24\" dy=\"19.2\">prix sur les plateformes tierces.</tspan></text>",
        1
      ]
    ],
    "expectedHash": "98c578ffe5d5c6f63f90672c66a7ee83ab235c65f09e16fa8ac282ae78d7404c",
    "metadata": {
      "figure": 4,
      "language": "fr",
      "layout": "mobile",
      "as_of": "2026-10-16",
      "source_ids": [
        "S11"
      ],
      "creator": "l0g",
      "description": "La quantité de stablecoins reçue vaut le prix dollar du titre divisé par le prix dollar du stablecoin. Une monnaie à 0,98 dollar peut faire monter une cotation sans hausse du titre, ou masquer sa baisse."
    },
    "expectedDomHash": "694fd631f0a776f07bf7bdf419694339f26616bbe3c65b91af78788a9745f96d"
  },
  "settlement-fr-desktop": {
    "pairs": [
      [
        "<text x=\"40\" y=\"860\" font-size=\"25\" font-weight=\"700\" text-anchor=\"start\" class=\"ink\"><tspan x=\"40\" dy=\"0\">Les 190 de paiements ne sont pas 190 de monnaie à mobiliser simultanément.</tspan></text>",
        "<text x=\"40\" y=\"860\" font-size=\"25\" font-weight=\"700\" text-anchor=\"start\" class=\"ink\"><tspan x=\"40\" dy=\"0\">Dans ce scénario, 190 de paiements circulent avec 100 au départ.</tspan></text>",
        1
      ]
    ],
    "expectedHash": "fe3051c889fc391d382b630efc14b0690d1fa23cda6da3103c5d832a221878c2",
    "metadata": {
      "figure": 6,
      "language": "fr",
      "layout": "desktop",
      "as_of": "2026-10-16",
      "source_ids": [
        "S03",
        "S04",
        "S18"
      ],
      "creator": "l0g",
      "description": "Compensation légale de deux obligations : 10 à verser. Si 100 doivent être payés avant le retour de 90, le besoin initial est 100. Les paiements bruts totalisent 190, sans exiger 190 simultanément."
    },
    "expectedDomHash": "f5feb8f46b99f1801e3cea8c7d39ab35e99a14ad93010cf140e089937ca1d395"
  },
  "evidence-fr-desktop": {
    "pairs": [
      [
        "<text x=\"40\" y=\"87\" font-size=\"33\" font-weight=\"700\" text-anchor=\"start\" class=\"ink\"><tspan x=\"40\" dy=\"0\">La volatilité n’a pas la même journée</tspan></text>",
        "<text x=\"40\" y=\"87\" font-size=\"33\" font-weight=\"700\" text-anchor=\"start\" class=\"ink\"><tspan x=\"40\" dy=\"0\">Volatilité et fenêtres de cotation</tspan></text>",
        1
      ],
      [
        "<title id=\"tkn-f07-fr-d-title\">La volatilité n’a pas la même journée</title>",
        "<title id=\"tkn-f07-fr-d-title\">Volatilité et fenêtres de cotation</title>",
        1
      ],
      [
        "<text x=\"340\" y=\"241\" font-size=\"23\" font-weight=\"700\" text-anchor=\"start\" class=\"ink\"><tspan x=\"340\" dy=\"0\">Des fenêtres différentes, pas un effet causal isolé.</tspan></text>",
        "<text x=\"340\" y=\"241\" font-size=\"23\" font-weight=\"700\" text-anchor=\"start\" class=\"ink\"><tspan x=\"340\" dy=\"0\">Comparaison descriptive de fenêtres distinctes.</tspan></text>",
        1
      ],
      [
        "<text x=\"40\" y=\"846.24\" font-size=\"17\" font-weight=\"400\" text-anchor=\"start\" class=\"muted\"><tspan x=\"40\" dy=\"0\">Source : FMI, GFSR, pp. 51–52 et figure 3.9 (S01). Rendements de cinq minutes, volatilité quotidienne non annualisée.</tspan><tspan x=\"40\" dy=\"21.76\">Échantillon non réexécuté ; bornes calendaires non précisées. Bandes : masque horaire schématique.</tspan></text>",
        "<text x=\"40\" y=\"846.24\" font-size=\"17\" font-weight=\"400\" text-anchor=\"start\" class=\"muted\"><tspan x=\"40\" dy=\"0\">Source : FMI, GFSR, pp. 51–52 et figure 3.9 (S01). Rendements de cinq minutes, volatilité quotidienne non annualisée.</tspan><tspan x=\"40\" dy=\"21.76\">Échantillon non réexécuté ; bornes absentes du chapitre. Bandes : masque horaire schématique.</tspan></text>",
        1
      ]
    ],
    "expectedHash": "d3102cb311c15140d7c40fa89492e07f82619ed59cf4d1d92cc3dbbb56969977",
    "metadata": {
      "figure": 7,
      "language": "fr",
      "layout": "desktop",
      "as_of": "2026-10-16",
      "source_ids": [
        "S01"
      ],
      "creator": "l0g",
      "description": "Le ratio publié d’environ 1,5 rapproche des fenêtres distinctes : horaires de séance américains pour les références et toutes heures pour les jetons. Plus de 50 % du volume est hors séance ; environ 80 % des transactions portent sur moins d’une action."
    },
    "expectedDomHash": "612e0ad2db3a3e9ebc436fce5574460198ebfe7bd41529d2dc515c77ab39ed37"
  },
  "evidence-fr-mobile": {
    "pairs": [
      [
        "<text x=\"24\" y=\"72\" font-size=\"24\" font-weight=\"700\" text-anchor=\"start\" class=\"ink\"><tspan x=\"24\" dy=\"0\">La volatilité n’a pas la même</tspan><tspan x=\"24\" dy=\"27.12\">journée</tspan></text>",
        "<text x=\"24\" y=\"72\" font-size=\"24\" font-weight=\"700\" text-anchor=\"start\" class=\"ink\"><tspan x=\"24\" dy=\"0\">Volatilité et fenêtres</tspan><tspan x=\"24\" dy=\"27.12\">de cotation</tspan></text>",
        1
      ],
      [
        "<title id=\"tkn-f07-fr-m-title\">La volatilité n’a pas la même journée</title>",
        "<title id=\"tkn-f07-fr-m-title\">Volatilité et fenêtres de cotation</title>",
        1
      ],
      [
        "<text x=\"30\" y=\"343\" font-size=\"21\" font-weight=\"700\" text-anchor=\"start\" class=\"ink\"><tspan x=\"30\" dy=\"0\">Des fenêtres différentes, pas un</tspan><tspan x=\"30\" dy=\"26.25\">effet causal isolé.</tspan></text>",
        "<text x=\"30\" y=\"343\" font-size=\"21\" font-weight=\"700\" text-anchor=\"start\" class=\"ink\"><tspan x=\"30\" dy=\"0\">Comparaison descriptive</tspan><tspan x=\"30\" dy=\"26.25\">de fenêtres distinctes.</tspan></text>",
        1
      ],
      [
        "<text x=\"24\" y=\"1101.2\" font-size=\"15\" font-weight=\"400\" text-anchor=\"start\" class=\"muted\"><tspan x=\"24\" dy=\"0\">Source : FMI, GFSR, pp. 51–52 et figure 3.9 (S01).</tspan><tspan x=\"24\" dy=\"19.2\">Rendements de cinq minutes, volatilité</tspan><tspan x=\"24\" dy=\"19.2\">quotidienne non annualisée. Échantillon non</tspan><tspan x=\"24\" dy=\"19.2\">réexécuté ; bornes calendaires non précisées.</tspan><tspan x=\"24\" dy=\"19.2\">Bandes : masque horaire schématique.</tspan></text>",
        "<text x=\"24\" y=\"1101.2\" font-size=\"15\" font-weight=\"400\" text-anchor=\"start\" class=\"muted\"><tspan x=\"24\" dy=\"0\">Source : FMI, GFSR, pp. 51–52 et figure 3.9 (S01).</tspan><tspan x=\"24\" dy=\"19.2\">Rendements de cinq minutes, volatilité</tspan><tspan x=\"24\" dy=\"19.2\">quotidienne non annualisée. Échantillon non</tspan><tspan x=\"24\" dy=\"19.2\">réexécuté ; bornes absentes du chapitre.</tspan><tspan x=\"24\" dy=\"19.2\">Bandes : masque horaire schématique.</tspan></text>",
        1
      ]
    ],
    "expectedHash": "57c0e181b8151676ba554aa0790b90abc70cc15200f326963903700679a8ee5b",
    "metadata": {
      "figure": 7,
      "language": "fr",
      "layout": "mobile",
      "as_of": "2026-10-16",
      "source_ids": [
        "S01"
      ],
      "creator": "l0g",
      "description": "Le ratio publié d’environ 1,5 rapproche des fenêtres distinctes : horaires de séance américains pour les références et toutes heures pour les jetons. Plus de 50 % du volume est hors séance ; environ 80 % des transactions portent sur moins d’une action."
    },
    "expectedDomHash": "2ed2262cefdfcd4ae9b4e9f5fe22210927fe517ff6699de2e1cf9512949de7a7"
  },
  "calendar-en-desktop": {
    "pairs": [
      [
        "<text x=\"40\" y=\"87\" font-size=\"33\" font-weight=\"700\" text-anchor=\"start\" class=\"ink\"><tspan x=\"40\" dy=\"0\">Four clocks on the way out</tspan></text>",
        "<text x=\"40\" y=\"87\" font-size=\"33\" font-weight=\"700\" text-anchor=\"start\" class=\"ink\"><tspan x=\"40\" dy=\"0\">Sale, redemption and settlement</tspan></text>",
        1
      ],
      [
        "<title id=\"tkn-f01-en-d-title\">Four clocks on the way out</title>",
        "<title id=\"tkn-f01-en-d-title\">Sale, redemption and settlement</title>",
        1
      ],
      [
        "<desc id=\"tkn-f01-en-d-desc\">A 72-hour window: continuous selected secondary trading, a 65h45 primary gap, a 50h Fedwire gap and continuous FedNow at participating institutions. Not an outage record.</desc>",
        "<desc id=\"tkn-f01-en-d-desc\">A 72-hour window: continuous selected secondary trading, a 65h45 primary gap, a 50h Fedwire gap and continuous FedNow at participating institutions. Not an outage record. Ondo processing is subject to constituent trading hours, platform pauses and investor eligibility.</desc>",
        1
      ],
      [
        "<metadata>{&quot;figure&quot;: 1, &quot;language&quot;: &quot;en&quot;, &quot;layout&quot;: &quot;desktop&quot;, &quot;as_of&quot;: &quot;2026-10-16&quot;, &quot;source_ids&quot;: [&quot;S05&quot;, &quot;S06&quot;, &quot;S08&quot;, &quot;S09&quot;], &quot;creator&quot;: &quot;l0g&quot;, &quot;description&quot;: &quot;A 72-hour window: continuous selected secondary trading, a 65h45 primary gap, a 50h Fedwire gap and continuous FedNow at participating institutions. Not an outage record.&quot;}</metadata>",
        "<metadata>{&quot;figure&quot;: 1, &quot;language&quot;: &quot;en&quot;, &quot;layout&quot;: &quot;desktop&quot;, &quot;as_of&quot;: &quot;2026-10-16&quot;, &quot;source_ids&quot;: [&quot;S05&quot;, &quot;S06&quot;, &quot;S08&quot;, &quot;S09&quot;], &quot;creator&quot;: &quot;l0g&quot;, &quot;description&quot;: &quot;A 72-hour window: continuous selected secondary trading, a 65h45 primary gap, a 50h Fedwire gap and continuous FedNow at participating institutions. Not an outage record. Ondo processing is subject to constituent trading hours, platform pauses and investor eligibility.&quot;}</metadata>",
        1
      ]
    ],
    "expectedHash": "5dd3a885ee760e197e33dd016c2e0bff6465626f2f335cb92c9af0df18160c5b",
    "metadata": {
      "figure": 1,
      "language": "en",
      "layout": "desktop",
      "as_of": "2026-10-16",
      "source_ids": [
        "S05",
        "S06",
        "S08",
        "S09"
      ],
      "creator": "l0g",
      "description": "A 72-hour window: continuous selected secondary trading, a 65h45 primary gap, a 50h Fedwire gap and continuous FedNow at participating institutions. Not an outage record. Ondo processing is subject to constituent trading hours, platform pauses and investor eligibility."
    },
    "expectedDomHash": "423fd754af09162e6c49c36375b2727769222a883cf741da3199e0c7ee7bef4e"
  },
  "calendar-en-mobile": {
    "pairs": [
      [
        "<text x=\"24\" y=\"72\" font-size=\"24\" font-weight=\"700\" text-anchor=\"start\" class=\"ink\"><tspan x=\"24\" dy=\"0\">Four clocks on the way out</tspan></text>",
        "<text x=\"24\" y=\"72\" font-size=\"24\" font-weight=\"700\" text-anchor=\"start\" class=\"ink\"><tspan x=\"24\" dy=\"0\">Sale, redemption and settlement</tspan></text>",
        1
      ],
      [
        "<title id=\"tkn-f01-en-m-title\">Four clocks on the way out</title>",
        "<title id=\"tkn-f01-en-m-title\">Sale, redemption and settlement</title>",
        1
      ],
      [
        "<desc id=\"tkn-f01-en-m-desc\">A 72-hour window: continuous selected secondary trading, a 65h45 primary gap, a 50h Fedwire gap and continuous FedNow at participating institutions. Not an outage record.</desc>",
        "<desc id=\"tkn-f01-en-m-desc\">A 72-hour window: continuous selected secondary trading, a 65h45 primary gap, a 50h Fedwire gap and continuous FedNow at participating institutions. Not an outage record. Ondo processing is subject to constituent trading hours, platform pauses and investor eligibility.</desc>",
        1
      ],
      [
        "<metadata>{&quot;figure&quot;: 1, &quot;language&quot;: &quot;en&quot;, &quot;layout&quot;: &quot;mobile&quot;, &quot;as_of&quot;: &quot;2026-10-16&quot;, &quot;source_ids&quot;: [&quot;S05&quot;, &quot;S06&quot;, &quot;S08&quot;, &quot;S09&quot;], &quot;creator&quot;: &quot;l0g&quot;, &quot;description&quot;: &quot;A 72-hour window: continuous selected secondary trading, a 65h45 primary gap, a 50h Fedwire gap and continuous FedNow at participating institutions. Not an outage record.&quot;}</metadata>",
        "<metadata>{&quot;figure&quot;: 1, &quot;language&quot;: &quot;en&quot;, &quot;layout&quot;: &quot;mobile&quot;, &quot;as_of&quot;: &quot;2026-10-16&quot;, &quot;source_ids&quot;: [&quot;S05&quot;, &quot;S06&quot;, &quot;S08&quot;, &quot;S09&quot;], &quot;creator&quot;: &quot;l0g&quot;, &quot;description&quot;: &quot;A 72-hour window: continuous selected secondary trading, a 65h45 primary gap, a 50h Fedwire gap and continuous FedNow at participating institutions. Not an outage record. Ondo processing is subject to constituent trading hours, platform pauses and investor eligibility.&quot;}</metadata>",
        1
      ]
    ],
    "expectedHash": "4ca31ba3045c262c951715f1161181cd665ff01618aba41b038aac7d47da564b",
    "metadata": {
      "figure": 1,
      "language": "en",
      "layout": "mobile",
      "as_of": "2026-10-16",
      "source_ids": [
        "S05",
        "S06",
        "S08",
        "S09"
      ],
      "creator": "l0g",
      "description": "A 72-hour window: continuous selected secondary trading, a 65h45 primary gap, a 50h Fedwire gap and continuous FedNow at participating institutions. Not an outage record. Ondo processing is subject to constituent trading hours, platform pauses and investor eligibility."
    },
    "expectedDomHash": "9a17351494c186bfee46871c0c3d1b5a87eca1c5adb85b3aaf07a4e714db0388"
  },
  "stock-en-desktop": {
    "pairs": [
      [
        "<text x=\"40\" y=\"87\" font-size=\"33\" font-weight=\"700\" text-anchor=\"start\" class=\"ink\"><tspan x=\"40\" dy=\"0\">Size is not exit liquidity</tspan></text>",
        "<text x=\"40\" y=\"87\" font-size=\"33\" font-weight=\"700\" text-anchor=\"start\" class=\"ink\"><tspan x=\"40\" dy=\"0\">Asset stock and repo activity</tspan></text>",
        1
      ],
      [
        "<title id=\"tkn-f02-en-d-title\">Size is not exit liquidity</title>",
        "<title id=\"tkn-f02-en-d-title\">Asset stock and repo activity</title>",
        1
      ],
      [
        "<text x=\"770\" y=\"550\" font-size=\"22\" font-weight=\"700\" text-anchor=\"start\" class=\"ink\"><tspan x=\"770\" dy=\"0\">A recurring flow, not an</tspan><tspan x=\"770\" dy=\"27.5\">addition to asset stock.</tspan></text>",
        "<text x=\"770\" y=\"550\" font-size=\"22\" font-weight=\"700\" text-anchor=\"start\" class=\"ink\"><tspan x=\"770\" dy=\"0\">Daily activity flow,</tspan><tspan x=\"770\" dy=\"27.5\">separate from asset stock.</tspan></text>",
        1
      ]
    ],
    "expectedHash": "018b0f21092b4b197908041a6fed678b3b29d40bbe437d808d6bbf4800f8e4c7",
    "metadata": {
      "figure": 2,
      "language": "en",
      "layout": "desktop",
      "as_of": "2026-10-16",
      "source_ids": [
        "S01"
      ],
      "creator": "l0g",
      "description": "The IMF’s covered $65.10bn asset stock is split by category. The $303bn mean daily repo flow is displayed separately, never added to that stock."
    },
    "expectedDomHash": "3490d3578085be9e3079c02c5f9aea7c4b5d649ca7dd8929ba5fc942d86f2939"
  },
  "stock-en-mobile": {
    "pairs": [
      [
        "<text x=\"24\" y=\"72\" font-size=\"24\" font-weight=\"700\" text-anchor=\"start\" class=\"ink\"><tspan x=\"24\" dy=\"0\">Size is not exit liquidity</tspan></text>",
        "<text x=\"24\" y=\"72\" font-size=\"24\" font-weight=\"700\" text-anchor=\"start\" class=\"ink\"><tspan x=\"24\" dy=\"0\">Asset stock and repo activity</tspan></text>",
        1
      ],
      [
        "<title id=\"tkn-f02-en-m-title\">Size is not exit liquidity</title>",
        "<title id=\"tkn-f02-en-m-title\">Asset stock and repo activity</title>",
        1
      ],
      [
        "<text x=\"30\" y=\"945\" font-size=\"19\" font-weight=\"700\" text-anchor=\"start\" class=\"ink\"><tspan x=\"30\" dy=\"0\">Recurring transactions; not an</tspan><tspan x=\"30\" dy=\"23.75\">addition to the asset stock.</tspan></text>",
        "<text x=\"30\" y=\"945\" font-size=\"19\" font-weight=\"700\" text-anchor=\"start\" class=\"ink\"><tspan x=\"30\" dy=\"0\">Daily activity flow,</tspan><tspan x=\"30\" dy=\"23.75\">separate from the asset stock.</tspan></text>",
        1
      ]
    ],
    "expectedHash": "d1e0f6ec81f19d3da0182740b2fe49fa81188e159dbe817519ad70d30eaffba4",
    "metadata": {
      "figure": 2,
      "language": "en",
      "layout": "mobile",
      "as_of": "2026-10-16",
      "source_ids": [
        "S01"
      ],
      "creator": "l0g",
      "description": "The IMF’s covered $65.10bn asset stock is split by category. The $303bn mean daily repo flow is displayed separately, never added to that stock."
    },
    "expectedDomHash": "3c17df96ae13f613379ee854e6312e7ebc23fb595b8135f2d786941609115f5d"
  },
  "funding-en-desktop": {
    "pairs": [
      [
        "<text x=\"400\" y=\"198\" font-size=\"17\" font-weight=\"700\" text-anchor=\"start\" class=\"muted\"><tspan x=\"400\" dy=\"0\">CUMULATIVE OUTFLOWS AND FUNDING</tspan></text>",
        "<text x=\"400\" y=\"198\" font-size=\"17\" font-weight=\"700\" text-anchor=\"start\" class=\"muted\"><tspan x=\"400\" dy=\"0\">CUMULATIVE REQUESTS AND FUNDING</tspan></text>",
        1
      ],
      [
        "<text x=\"430\" y=\"645\" font-size=\"26\" font-weight=\"700\" text-anchor=\"start\" class=\"red\"><tspan x=\"430\" dy=\"0\">20 outflows − 12 available = 8 to fund</tspan></text>",
        "<text x=\"430\" y=\"645\" font-size=\"26\" font-weight=\"700\" text-anchor=\"start\" class=\"red\"><tspan x=\"430\" dy=\"0\">20 requested − 12 available = 8 to fund</tspan></text>",
        1
      ],
      [
        "<desc id=\"tkn-f03-en-d-desc\">100 in assets, 8 usable immediately, plus 4 of available credit. Cumulative outflows of 20 leave 8 unfunded, without assuming any loss in securities values.</desc>",
        "<desc id=\"tkn-f03-en-d-desc\">100 in assets, 8 usable immediately, plus 4 of available credit. Cumulative withdrawal requests of 20 leave 8 unfunded, without assuming any loss in securities values.</desc>",
        1
      ],
      [
        "<metadata>{&quot;figure&quot;: 3, &quot;language&quot;: &quot;en&quot;, &quot;layout&quot;: &quot;desktop&quot;, &quot;as_of&quot;: &quot;2026-10-16&quot;, &quot;source_ids&quot;: [], &quot;creator&quot;: &quot;l0g&quot;, &quot;description&quot;: &quot;100 in assets, 8 usable immediately, plus 4 of available credit. Cumulative outflows of 20 leave 8 unfunded, without assuming any loss in securities values.&quot;}</metadata>",
        "<metadata>{&quot;figure&quot;: 3, &quot;language&quot;: &quot;en&quot;, &quot;layout&quot;: &quot;desktop&quot;, &quot;as_of&quot;: &quot;2026-10-16&quot;, &quot;source_ids&quot;: [], &quot;creator&quot;: &quot;l0g&quot;, &quot;description&quot;: &quot;100 in assets, 8 usable immediately, plus 4 of available credit. Cumulative withdrawal requests of 20 leave 8 unfunded, without assuming any loss in securities values.&quot;}</metadata>",
        1
      ],
      [
        "<text x=\"40\" y=\"806.24\" font-size=\"17\" font-weight=\"400\" text-anchor=\"start\" class=\"muted\"><tspan x=\"40\" dy=\"0\">Source: l0g scenario; calculations in funding_scenario.csv. Red: cumulative requests; blue threshold: cash plus credit.</tspan><tspan x=\"40\" dy=\"21.76\">No observed figures or calibration to Ondo or BUIDL.</tspan></text>",
        "<text x=\"40\" y=\"806.24\" font-size=\"17\" font-weight=\"400\" text-anchor=\"start\" class=\"muted\"><tspan x=\"40\" dy=\"0\">Source: l0g scenario; calculations in the caption. Red: cumulative requests; blue threshold: cash plus credit.</tspan><tspan x=\"40\" dy=\"21.76\">No observed figures or calibration to Ondo or BUIDL.</tspan></text>",
        1
      ]
    ],
    "expectedHash": "c61a06b28f27bcad0b153e60175901afd9efdc72eb92567ef42cc88837883478",
    "metadata": {
      "figure": 3,
      "language": "en",
      "layout": "desktop",
      "as_of": "2026-10-16",
      "source_ids": [],
      "creator": "l0g",
      "description": "100 in assets, 8 usable immediately, plus 4 of available credit. Cumulative withdrawal requests of 20 leave 8 unfunded, without assuming any loss in securities values."
    },
    "expectedDomHash": "a4bb9f2e184a4d288fd5bc5e1c48fbaee0c7339f65e9e85e0dfb9b03e0b0d37e"
  },
  "funding-en-mobile": {
    "pairs": [
      [
        "<text x=\"30\" y=\"444\" font-size=\"14\" font-weight=\"700\" text-anchor=\"start\" class=\"muted\"><tspan x=\"30\" dy=\"0\">CUMULATIVE OUTFLOWS AND FUNDING</tspan></text>",
        "<text x=\"30\" y=\"444\" font-size=\"14\" font-weight=\"700\" text-anchor=\"start\" class=\"muted\"><tspan x=\"30\" dy=\"0\">CUMULATIVE REQUESTS AND FUNDING</tspan></text>",
        1
      ],
      [
        "<text x=\"30\" y=\"856\" font-size=\"21\" font-weight=\"700\" text-anchor=\"start\" class=\"ink\"><tspan x=\"30\" dy=\"0\">20 outflows − 12 available</tspan></text>",
        "<text x=\"30\" y=\"856\" font-size=\"21\" font-weight=\"700\" text-anchor=\"start\" class=\"ink\"><tspan x=\"30\" dy=\"0\">20 requested − 12 available</tspan></text>",
        1
      ],
      [
        "<desc id=\"tkn-f03-en-m-desc\">100 in assets, 8 usable immediately, plus 4 of available credit. Cumulative outflows of 20 leave 8 unfunded, without assuming any loss in securities values.</desc>",
        "<desc id=\"tkn-f03-en-m-desc\">100 in assets, 8 usable immediately, plus 4 of available credit. Cumulative withdrawal requests of 20 leave 8 unfunded, without assuming any loss in securities values.</desc>",
        1
      ],
      [
        "<metadata>{&quot;figure&quot;: 3, &quot;language&quot;: &quot;en&quot;, &quot;layout&quot;: &quot;mobile&quot;, &quot;as_of&quot;: &quot;2026-10-16&quot;, &quot;source_ids&quot;: [], &quot;creator&quot;: &quot;l0g&quot;, &quot;description&quot;: &quot;100 in assets, 8 usable immediately, plus 4 of available credit. Cumulative outflows of 20 leave 8 unfunded, without assuming any loss in securities values.&quot;}</metadata>",
        "<metadata>{&quot;figure&quot;: 3, &quot;language&quot;: &quot;en&quot;, &quot;layout&quot;: &quot;mobile&quot;, &quot;as_of&quot;: &quot;2026-10-16&quot;, &quot;source_ids&quot;: [], &quot;creator&quot;: &quot;l0g&quot;, &quot;description&quot;: &quot;100 in assets, 8 usable immediately, plus 4 of available credit. Cumulative withdrawal requests of 20 leave 8 unfunded, without assuming any loss in securities values.&quot;}</metadata>",
        1
      ],
      [
        "<text x=\"24\" y=\"1120.4\" font-size=\"15\" font-weight=\"400\" text-anchor=\"start\" class=\"muted\"><tspan x=\"24\" dy=\"0\">Source: l0g scenario; calculations in</tspan><tspan x=\"24\" dy=\"19.2\">funding_scenario.csv. Red: cumulative requests;</tspan><tspan x=\"24\" dy=\"19.2\">blue threshold: cash plus credit. No observed</tspan><tspan x=\"24\" dy=\"19.2\">figures or calibration to Ondo or BUIDL.</tspan></text>",
        "<text x=\"24\" y=\"1120.4\" font-size=\"15\" font-weight=\"400\" text-anchor=\"start\" class=\"muted\"><tspan x=\"24\" dy=\"0\">Source: l0g scenario; calculations in</tspan><tspan x=\"24\" dy=\"19.2\">the caption. Red: cumulative requests;</tspan><tspan x=\"24\" dy=\"19.2\">blue threshold: cash plus credit. No observed</tspan><tspan x=\"24\" dy=\"19.2\">figures or calibration to Ondo or BUIDL.</tspan></text>",
        1
      ]
    ],
    "expectedHash": "df30d1d8b9d403ae41cb2503e29892c36d2334e0f6b1cf8822d0af6d8e51eb9f",
    "metadata": {
      "figure": 3,
      "language": "en",
      "layout": "mobile",
      "as_of": "2026-10-16",
      "source_ids": [],
      "creator": "l0g",
      "description": "100 in assets, 8 usable immediately, plus 4 of available credit. Cumulative withdrawal requests of 20 leave 8 unfunded, without assuming any loss in securities values."
    },
    "expectedDomHash": "64680b680c9dd1c1b96978597ff9e06efa1bed8b112ab606994f5e44d5011aed"
  },
  "quote-en-desktop": {
    "pairs": [
      [
        "<text x=\"40\" y=\"831.24\" font-size=\"17\" font-weight=\"400\" text-anchor=\"start\" class=\"muted\"><tspan x=\"40\" dy=\"0\">Source: l0g calculations, quote_scenarios.csv. Excludes fees and bid–ask spreads. $0.98 is hypothetical, not an</tspan><tspan x=\"40\" dy=\"21.76\">observed quote. S11: third-party market-price risk.</tspan></text>",
        "<text x=\"40\" y=\"831.24\" font-size=\"17\" font-weight=\"400\" text-anchor=\"start\" class=\"muted\"><tspan x=\"40\" dy=\"0\">Source: l0g calculations, example in caption. Excludes fees and bid–ask spreads. $0.98 is hypothetical, not an</tspan><tspan x=\"40\" dy=\"21.76\">observed quote. S11: third-party market-price risk.</tspan></text>",
        1
      ]
    ],
    "expectedHash": "76973a2983456bb3e953595de28a5e9413c70708d698d861cad8dc3691ca96e8",
    "metadata": {
      "figure": 4,
      "language": "en",
      "layout": "desktop",
      "as_of": "2026-10-16",
      "source_ids": [
        "S11"
      ],
      "creator": "l0g",
      "description": "The stablecoin quote equals the security’s dollar price divided by the stablecoin’s dollar price. A $0.98 payment coin can raise the quote without an asset gain, or hide a decline."
    },
    "expectedDomHash": "4e9879e6f5f65555d28bf29a9e10fb6185fd31843a84a60d3aae3a56fe7b7a30"
  },
  "quote-en-mobile": {
    "pairs": [
      [
        "<text x=\"30\" y=\"1004\" font-size=\"22\" font-weight=\"700\" text-anchor=\"start\" class=\"ink\"><tspan x=\"30\" dy=\"0\">A stable quote does not</tspan><tspan x=\"30\" dy=\"27.5\">guarantee stable dollar</tspan><tspan x=\"30\" dy=\"27.5\">purchasing power.</tspan></text>",
        "<text x=\"30\" y=\"1004\" font-size=\"22\" font-weight=\"700\" text-anchor=\"start\" class=\"ink\"><tspan x=\"30\" dy=\"0\">Dollar purchasing power</tspan><tspan x=\"30\" dy=\"27.5\">also depends on the</tspan><tspan x=\"30\" dy=\"27.5\">payment coin’s value.</tspan></text>",
        1
      ],
      [
        "<text x=\"24\" y=\"1090.4\" font-size=\"15\" font-weight=\"400\" text-anchor=\"start\" class=\"muted\"><tspan x=\"24\" dy=\"0\">Source: l0g calculations, quote_scenarios.csv.</tspan><tspan x=\"24\" dy=\"19.2\">Excludes fees and bid–ask spreads. $0.98 is</tspan><tspan x=\"24\" dy=\"19.2\">hypothetical, not an observed quote. S11:</tspan><tspan x=\"24\" dy=\"19.2\">third-party market-price risk.</tspan></text>",
        "<text x=\"24\" y=\"1090.4\" font-size=\"15\" font-weight=\"400\" text-anchor=\"start\" class=\"muted\"><tspan x=\"24\" dy=\"0\">Source: l0g calculations, example in caption.</tspan><tspan x=\"24\" dy=\"19.2\">Excludes fees and bid–ask spreads. $0.98 is</tspan><tspan x=\"24\" dy=\"19.2\">hypothetical, not an observed quote. S11:</tspan><tspan x=\"24\" dy=\"19.2\">third-party market-price risk.</tspan></text>",
        1
      ]
    ],
    "expectedHash": "997b770b9cd9f8956d0be409e6927f3306e80f61908a6ca5a53ea88abadff77b",
    "metadata": {
      "figure": 4,
      "language": "en",
      "layout": "mobile",
      "as_of": "2026-10-16",
      "source_ids": [
        "S11"
      ],
      "creator": "l0g",
      "description": "The stablecoin quote equals the security’s dollar price divided by the stablecoin’s dollar price. A $0.98 payment coin can raise the quote without an asset gain, or hide a decline."
    },
    "expectedDomHash": "cca4df5fee7ca99c94d0fe3cc772af83a9babdc4e59c7206530d17c9b8da8aba"
  },
  "settlement-en-desktop": {
    "pairs": [
      [
        "<text x=\"40\" y=\"860\" font-size=\"25\" font-weight=\"700\" text-anchor=\"start\" class=\"ink\"><tspan x=\"40\" dy=\"0\">The 190 of payment turnover is not 190 of simultaneous funding.</tspan></text>",
        "<text x=\"40\" y=\"860\" font-size=\"25\" font-weight=\"700\" text-anchor=\"start\" class=\"ink\"><tspan x=\"40\" dy=\"0\">This example circulates 190 in payments from 100 up front.</tspan></text>",
        1
      ]
    ],
    "expectedHash": "1913b2c3dc7c8bc7aa8689e32c15d16bbe2da7528b47b827e62ce02dca888f0a",
    "metadata": {
      "figure": 6,
      "language": "en",
      "layout": "desktop",
      "as_of": "2026-10-16",
      "source_ids": [
        "S03",
        "S04",
        "S18"
      ],
      "creator": "l0g",
      "description": "Legally netting two obligations leaves 10 due. If 100 must be paid before 90 returns, initial funding is 100. Gross turnover is 190, not a simultaneous need for 190."
    },
    "expectedDomHash": "e013eabd1ec4903e0ae681028946113dc1d4f37aa27028b9fd09a160167e95ce"
  },
  "evidence-en-desktop": {
    "pairs": [
      [
        "<text x=\"40\" y=\"87\" font-size=\"33\" font-weight=\"700\" text-anchor=\"start\" class=\"ink\"><tspan x=\"40\" dy=\"0\">Volatility uses different days</tspan></text>",
        "<text x=\"40\" y=\"87\" font-size=\"33\" font-weight=\"700\" text-anchor=\"start\" class=\"ink\"><tspan x=\"40\" dy=\"0\">Volatility and trading windows</tspan></text>",
        1
      ],
      [
        "<title id=\"tkn-f07-en-d-title\">Volatility uses different days</title>",
        "<title id=\"tkn-f07-en-d-title\">Volatility and trading windows</title>",
        1
      ],
      [
        "<text x=\"340\" y=\"241\" font-size=\"23\" font-weight=\"700\" text-anchor=\"start\" class=\"ink\"><tspan x=\"340\" dy=\"0\">Different windows, not an isolated causal effect.</tspan></text>",
        "<text x=\"340\" y=\"241\" font-size=\"23\" font-weight=\"700\" text-anchor=\"start\" class=\"ink\"><tspan x=\"340\" dy=\"0\">Descriptive comparison across trading windows.</tspan></text>",
        1
      ],
      [
        "<text x=\"40\" y=\"846.24\" font-size=\"17\" font-weight=\"400\" text-anchor=\"start\" class=\"muted\"><tspan x=\"40\" dy=\"0\">Source: IMF GFSR, pp. 51–52 and Figure 3.9 (S01). Five-minute returns; daily, not annualized volatility. Sample not</tspan><tspan x=\"40\" dy=\"21.76\">replicated; calendar bounds not stated. Bands are schematic observation windows.</tspan></text>",
        "<text x=\"40\" y=\"846.24\" font-size=\"17\" font-weight=\"400\" text-anchor=\"start\" class=\"muted\"><tspan x=\"40\" dy=\"0\">Source: IMF GFSR, pp. 51–52 and Figure 3.9 (S01). Five-minute returns; daily, not annualized volatility. Sample not</tspan><tspan x=\"40\" dy=\"21.76\">replicated; calendar bounds absent from chapter. Bands are schematic observation windows.</tspan></text>",
        1
      ]
    ],
    "expectedHash": "bd0e983f7474ddbed87698257ee67940c3ced4a2735928e9336666020c4acf50",
    "metadata": {
      "figure": 7,
      "language": "en",
      "layout": "desktop",
      "as_of": "2026-10-16",
      "source_ids": [
        "S01"
      ],
      "creator": "l0g",
      "description": "The published roughly 1.5 ratio uses US market hours for traditional references and all hours for tokens. More than 50% of volume is outside regular hours; about 80% of trades are smaller than one share."
    },
    "expectedDomHash": "c05a22c072aee441f781c95030ab582b0be7c6c79ada087dd3830f4d5df10c7a"
  },
  "evidence-en-mobile": {
    "pairs": [
      [
        "<text x=\"24\" y=\"72\" font-size=\"24\" font-weight=\"700\" text-anchor=\"start\" class=\"ink\"><tspan x=\"24\" dy=\"0\">Volatility uses different days</tspan></text>",
        "<text x=\"24\" y=\"72\" font-size=\"24\" font-weight=\"700\" text-anchor=\"start\" class=\"ink\"><tspan x=\"24\" dy=\"0\">Volatility and trading windows</tspan></text>",
        1
      ],
      [
        "<title id=\"tkn-f07-en-m-title\">Volatility uses different days</title>",
        "<title id=\"tkn-f07-en-m-title\">Volatility and trading windows</title>",
        1
      ],
      [
        "<text x=\"30\" y=\"343\" font-size=\"21\" font-weight=\"700\" text-anchor=\"start\" class=\"ink\"><tspan x=\"30\" dy=\"0\">Different windows, not an isolated</tspan><tspan x=\"30\" dy=\"26.25\">causal effect.</tspan></text>",
        "<text x=\"30\" y=\"343\" font-size=\"21\" font-weight=\"700\" text-anchor=\"start\" class=\"ink\"><tspan x=\"30\" dy=\"0\">Descriptive comparison across</tspan><tspan x=\"30\" dy=\"26.25\">trading windows.</tspan></text>",
        1
      ],
      [
        "<text x=\"24\" y=\"1101.2\" font-size=\"15\" font-weight=\"400\" text-anchor=\"start\" class=\"muted\"><tspan x=\"24\" dy=\"0\">Source: IMF GFSR, pp. 51–52 and Figure 3.9</tspan><tspan x=\"24\" dy=\"19.2\">(S01). Five-minute returns; daily, not annualized</tspan><tspan x=\"24\" dy=\"19.2\">volatility. Sample not replicated; calendar</tspan><tspan x=\"24\" dy=\"19.2\">bounds not stated. Bands are schematic</tspan><tspan x=\"24\" dy=\"19.2\">observation windows.</tspan></text>",
        "<text x=\"24\" y=\"1101.2\" font-size=\"15\" font-weight=\"400\" text-anchor=\"start\" class=\"muted\"><tspan x=\"24\" dy=\"0\">Source: IMF GFSR, pp. 51–52 and Figure 3.9</tspan><tspan x=\"24\" dy=\"19.2\">(S01). Five-minute returns; daily, not annualized</tspan><tspan x=\"24\" dy=\"19.2\">volatility. Sample not replicated; calendar</tspan><tspan x=\"24\" dy=\"19.2\">bounds absent from chapter. Bands are</tspan><tspan x=\"24\" dy=\"19.2\">schematic observation windows.</tspan></text>",
        1
      ]
    ],
    "expectedHash": "3358a899ff63bf71b0e55537824c63cf44495d043b98683c042acf55c73fec8d",
    "metadata": {
      "figure": 7,
      "language": "en",
      "layout": "mobile",
      "as_of": "2026-10-16",
      "source_ids": [
        "S01"
      ],
      "creator": "l0g",
      "description": "The published roughly 1.5 ratio uses US market hours for traditional references and all hours for tokens. More than 50% of volume is outside regular hours; about 80% of trades are smaller than one share."
    },
    "expectedDomHash": "27e48d604c0eb9eed61870606114957b598be9e09bbb339bfccd3780690065cc"
  }
};
const kinds = ["calendar","stock","funding","quote","collateral","settlement","evidence"];
const variants = ['fr', 'en'].flatMap(lang => kinds.flatMap(kind => [false, true].map(mobile => ({ lang, kind, mobile, key: `${kind}-${lang}-${mobile ? 'mobile' : 'desktop'}`, svg: tokenisationWeekendSvg(lang, kind, mobile) }))));
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
const suppliedStyleHash = "1442a37259973aefa79344a7dbeb322b884c14321baf802c57cba5b3b18309f4";
function inspect(v) {
  assert.equal(typeof v.svg, 'string'); assert.ok(v.svg.length > 100 && v.svg.length < 40000);
  assert.doesNotMatch(v.svg, /<!|<\?|&(?!amp;|lt;|gt;|quot;|apos;)/u);
  assert.equal(XMLValidator.validate(v.svg), true);
  const roots = parser.parse(v.svg); assert.equal(roots.length, 1); const root = roots[0]; assert.equal(tag(root), 'svg');
  const index = kinds.indexOf(v.kind) + 1, prefix = `tkn-f${String(index).padStart(2, '0')}-${v.lang}-${v.mobile ? 'm' : 'd'}`;
  assert.deepEqual(attrs(root), { xmlns: 'http://www.w3.org/2000/svg', id: prefix, class: 'l0g-tkn-svg', viewBox: originals[v.key].viewBox, role: 'img', 'aria-labelledby': `${prefix}-title ${prefix}-desc` });
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
      if (k === 'font-size') assert.ok(number(val) >= 12 && number(val) <= 74);
      if (k === 'text-anchor') assert.ok(['start','middle','end'].includes(val));
      if (k === 'stroke-dasharray') assert.ok(['6 5','7 5'].includes(val));
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
const within = (a,b,t=0) => a.x >= b.x-t && a.y >= b.y-t && a.right <= b.right+t && a.bottom <= b.bottom+t;
const overlaps = (a,b) => a.x < b.right && a.right > b.x && a.y < b.bottom && a.bottom > b.y;
const pointsBox = points => { assert.ok(points.length && points.flat().every(Number.isFinite)); return {x:Math.min(...points.map(p=>p[0])),y:Math.min(...points.map(p=>p[1])),right:Math.max(...points.map(p=>p[0])),bottom:Math.max(...points.map(p=>p[1]))}; };
function shapeBox(n) {
  if (tag(n) === 'rect') return { x: value(n, 'x'), y: value(n, 'y'), right: value(n, 'x') + value(n, 'width'), bottom: value(n, 'y') + value(n, 'height') };
  if (tag(n) === 'circle') return { x: value(n, 'cx') - value(n, 'r'), y: value(n, 'cy') - value(n, 'r'), right: value(n, 'cx') + value(n, 'r'), bottom: value(n, 'cy') + value(n, 'r') };
  if (tag(n) === 'line') return pointsBox([[value(n, 'x1'), value(n, 'y1')], [value(n, 'x2'), value(n, 'y2')]]);
  if (tag(n) === 'path') return pointsBox(pathPoints(attrs(n).d));
}
function scene(n) { return ['#text','defs'].includes(tag(n)) ? [] : [n,...children(n).flatMap(scene)]; }
function geometry(v) {
 const {root,width,height}=inspect(v),canvas={x:0,y:0,right:width,bottom:height};
 for(const n of scene(root)){
  if(['rect','circle','path'].includes(tag(n))){const b=shapeBox(n),s=attrs(n).stroke&&attrs(n).stroke!=='none'?value(n,'stroke-width','1')/2:0;assert.ok(within({x:b.x-s,y:b.y-s,right:b.right+s,bottom:b.bottom+s},canvas,.01),'shape outside viewBox');}
  if(tag(n)==='text'){let y=value(n,'y');for(const span of children(n)){y+=value(span,'dy');const x=value(span,'x');assert.ok(x>=0&&x<=width&&y>=0&&y<=height,'text anchor outside viewBox');}}
 }
}
test('Tokenisation weekend variant selection is frozen, complete and rejects coercion or prototypes', () => {
  assert.deepEqual(TOKENISATION_WEEKEND_KINDS,kinds);assert.ok(Object.isFrozen(TOKENISATION_WEEKEND_KINDS));assert.equal(variants.length,28);
  for(const lang of ['', 'FR','__proto__','constructor',{},null,['fr']])assert.throws(()=>tokenisationWeekendSvg(lang,'calendar',false),TypeError);
  for(const kind of ['', '__proto__','constructor','prototype',{},null,['calendar']])assert.throws(()=>tokenisationWeekendSvg('fr',kind,false),TypeError);
  for(const mobile of [0,1,'','false',null,new Boolean(false),{},[]])assert.throws(()=>tokenisationWeekendSvg('fr','calendar',mobile),TypeError);
  assert.equal(tokenisationWeekendSvg('fr','calendar'),tokenisationWeekendSvg('fr','calendar',false));
});
test('all 28 complete supplied XML trees are recovered by the exact approved inverse mapping',()=>{for(const v of variants)faithful(v);});
test('native shape bounds and text anchors remain in the viewBoxes; browser QA measures actual Arial glyphs',()=>{for(const v of variants)geometry(v);});
test('static shape and anchor checks reject off-canvas geometry',()=>{const v=variants[0];for(const change of [(_,ns)=>{attrs(ns.find(n=>tag(n)==='rect')).x='9999';},(_,ns)=>{attrs(ns.find(n=>tag(n)==='tspan')).x='-10';}])assert.throws(()=>geometry(mutate(v,change)));});
test('full XML goldens reject geometry, text, metadata, stylesheet and child-order changes', () => {
 const v=variants[0];for(const change of [(_,ns)=>{attrs(ns.find(n=>tag(n)==='tspan')).x='0';},(_,ns)=>{attrs(ns.find(n=>tag(n)==='rect')).fill='var(--panel)';},(_,ns)=>{ns.find(n=>tag(n)==='title').title=[{'#text':'Changed'}];},(_,ns)=>{ns.find(n=>tag(n)==='metadata').metadata=[{'#text':'{}'}];},(_,ns)=>{ns.find(n=>tag(n)==='style').style=[{'#text':'.l0g-tkn-svg{fill:red}'}];},root=>{root.svg.reverse();}])assert.throws(()=>faithful(mutate(v,change)));
});
test('passive SVG validator rejects active markup, external resources and malformed fields',()=>{
 const v=variants[0];for(const type of ['script','foreignObject','image','use','a','animate','filter'])assert.throws(()=>inspect(mutate(v,root=>{root.svg.push({[type]:[]});})));
 for(const[field,val]of [['onload','alert(1)'],['href','https://example.org/'],['xlink:href','javascript:alert(1)'],['constructor','x'],['prototype','x'],['transform','translate(0 0)'],['style','fill:red'],['font-size','Infinity'],['x','1e999'],['x','10001']])assert.throws(()=>inspect(mutate(v,(_,ns)=>{attrs(ns.find(n=>tag(n)==='text'))[field]=val;})));
 for(const val of ['url(#x)','url(https://example.org/x)','var(--bg,red)','#fff','red'])assert.throws(()=>inspect(mutate(v,(_,ns)=>{attrs(ns.find(n=>tag(n)==='rect')).fill=val;})));
 for(const val of ['url(https://example.org/x)','url(#tkn-f01-fr-d-arrow-teal) trailing','url(#unknown)'])assert.throws(()=>inspect(mutate(v,(_,ns)=>{attrs(ns.find(n=>tag(n)==='path'))['marker-end']=val;})));
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
test('responsive component preserves all theme, font and breakpoint contracts',()=>{
 const component=read('src/components/TokenisationWeekendFigure.astro'),style=component.match(/<style>([\s\S]*?)<\/style>/u)?.[1];assert.ok(style);
 const css=postcss.parse(style),declarations=n=>Object.fromEntries(n.nodes.filter(d=>d.type==='decl').map(d=>[d.prop,d.value]));
 const rule=selector=>{const n=css.nodes.find(n=>n.type==='rule'&&n.selector===selector);assert.ok(n,selector);return declarations(n);};
 const mapping={bg:'ink',panel:'surface-2',ink:'paper',muted:'muted',grid:'line-strong',teal:'signal',red:'accent',gold:'amber',blue:'topic-blue',white:'ink'};
 assert.deepEqual(rule('.tokenisation-weekend-figure :global(svg.l0g-tkn-svg)'),Object.fromEntries(Object.entries(mapping).map(([k,v])=>[`--${k}`,`var(--color-${v})`])));
 const base=rule('.tokenisation-weekend-figure');assert.deepEqual([base.width,base['max-width'],base['container-type'],base['padding-bottom'],base.overflow],['100%','760px','inline-size','.85rem','visible']);
 const graphic=rule('.tokenisation-weekend-figure :global(svg)');assert.deepEqual([graphic.width,graphic.height,graphic['max-width'],graphic['letter-spacing'],graphic.overflow],['100%','auto','100%','normal','visible']);
 const mobile=rule('.tokenisation-weekend-mobile');assert.deepEqual([mobile.display,mobile.width,mobile['max-width'],mobile['margin-inline']],['none','100%','420px','auto']);
 assert.equal(css.nodes.filter(n=>n.type==='atrule'&&n.name==='font-face').length,0);
 css.walkDecls('font-family',()=>assert.fail('The component must preserve the supplied Arial/Helvetica stack'));
 assert.doesNotMatch(component,/@font-face|\/fonts\/|Liberation/u);
 assert.equal(rule('.tokenisation-weekend-figure[data-kind="collateral"] .tokenisation-weekend-desktop')['max-width'],'586px');
 assert.equal(rule('.tokenisation-weekend-figure[data-kind="settlement"] .tokenisation-weekend-desktop')['max-width'],'598px');
 for(const kind of ['media','container']){
  const n=css.nodes.find(n=>n.type==='atrule'&&n.name===kind&&n.params==='(max-width: 640px)');assert.ok(n);
  assert.deepEqual(n.nodes.map(n=>[n.selector,declarations(n).display]),[['.tokenisation-weekend-desktop','none'],['.tokenisation-weekend-mobile','block']]);
 }
 const themes={dark:new Map(),light:new Map()};postcss.parse(read('src/styles/global.css')).walkDecls(d=>{if(d.parent.type==='atrule'&&d.parent.name==='theme')themes.dark.set(d.prop,d.value);if(d.parent.type==='rule'&&d.parent.selector===':root[data-theme="light"]')themes.light.set(d.prop,d.value);});
 for(const theme of Object.values(themes))for(const v of Object.values(mapping))assert.ok(theme.has(`--color-${v}`));
 assert.doesNotMatch(style,/#(?:[a-f0-9]{3}){1,2}\b|(?:clip-path|overflow\s*:\s*(?:hidden|clip)|transform\s*:|100vw)/iu);
 assert.equal((component.match(/set:html=/gu)??[]).length,2);assert.match(component,/set:html=\{responsiveSvg\(false\)\}/u);assert.match(component,/set:html=\{responsiveSvg\(true\)\}/u);
 assert.ok(component.includes(`const responsiveSvg = (mobile: boolean) => tokenisationWeekendSvg(lang, kind, mobile).replace(/^<svg /u, '<svg style="width:100%;height:auto" ');`));
 assert.doesNotMatch(component,/<script|client:|fetch\(|innerHTML/u);
});
const mdxNodes=n=>[n,...(n.children??[]).flatMap(mdxNodes)];
const figureSources={"calendar":[5,6,8],"stock":[1],"funding":[4],"quote":[11,12],"collateral":[13],"settlement":[3,18],"evidence":[1]};
function articleFigures(raw,lang){
 const tree=createProcessor().parse(raw.replace(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/u,'')),figures=mdxNodes(tree).filter(n=>n.name==='TokenisationWeekendFigure');assert.equal(figures.length,7);
 for(const[i,n]of figures.entries()){
  const a=Object.fromEntries(n.attributes.map(a=>{assert.equal(a.type,'mdxJsxAttribute');assert.equal(typeof a.value,'string');return[a.name,a.value];}));
  assert.deepEqual(Object.keys(a).sort(),['caption','kind','lang','number','sources']);assert.equal(a.kind,kinds[i]);assert.equal(a.number,String(i+1).padStart(2,'0'));assert.equal(a.lang,lang);assert.ok(a.caption.length>70);
  const refs=a.sources.trim()?a.sources.trim().split(/\s+/u).map(Number):[];assert.deepEqual(refs,figureSources[kinds[i]]);const details=mdxNodes(n).filter(c=>c.name==='details');assert.equal(details.length,1);assert.equal(mdxNodes(details[0]).filter(c=>c.name==='summary').length,1);
 }
}
test('article native MDX includes seven ordered static figures, accurate references and method notes',()=>{
 for(const lang of ['fr','en'])articleFigures(read(`src/content/${lang==='fr'?'posts/tokenisation-qui-finance-weekend':'posts-en/tokenized-markets-weekend-funding'}.mdx`),lang);
});

test('comma-delimited coordinate pairs are consumed completely without accepting malformed comma runs',()=>{
 assert.deepEqual(pathPoints('M 1,2 L 3,4 L 5,-6'),[[1,2],[3,4],[5,-6]]);
 for(const d of ['M,1 2','M1,,2','M1, 2','M1 2,','M1 2 L,3 4','M1 2 , L3 4'])assert.throws(()=>pathPoints(d));
});
test('the static root adapter adds exactly the responsive style and preserves the complete passive SVG tree',()=>{
 const component=read('src/components/TokenisationWeekendFigure.astro');assert.ok(component.includes(`const responsiveSvg = (mobile: boolean) => tokenisationWeekendSvg(lang, kind, mobile).replace(/^<svg /u, '<svg style="width:100%;height:auto" ');`));
 for(const v of variants){const adapted=v.svg.replace(/^<svg /u,'<svg style="width:100%;height:auto" '),roots=htmlNodes(parse(adapted)).filter(n=>n.tagName==='svg');assert.equal(roots.length,1);const root=roots[0];assert.equal(root.attrs.filter(a=>a.name==='style').length,1);assert.equal(root.attrs.find(a=>a.name==='style').value,'width:100%;height:auto');const projection={...root,attrs:root.attrs.filter(a=>a.name!=='style')};assert.equal(digest(JSON.stringify(canonical(projection))),textCorrections[v.key]?.expectedDomHash??originals[v.key].domHash);assert.equal(adapted.replace('<svg style="width:100%;height:auto" ','<svg '),v.svg);}
});

function quantitativeGeometry(v) {
 const {root,nodes}=inspect(v),visible=scene(root),rects=visible.filter(n=>tag(n)==='rect'),paths=visible.filter(n=>tag(n)==='path'),labels=nodes.filter(n=>tag(n)==='text').map(xmlText);
 const close=(actual,expected,t=.0051)=>assert.ok(Math.abs(actual-expected)<=t,`${v.key}: ${actual} != ${expected}`);
 const one=(array,predicate)=>{const found=array.filter(predicate);assert.equal(found.length,1);return found[0];};
 const has=label=>assert.ok(labels.some(s=>s.includes(label)),`${v.key}: missing ${label}`);
 if(v.kind==='calendar'){
  const x=v.mobile?30:315,w=v.mobile?360:725,ys=v.mobile?[277,457,637,817]:[245,357,469,581];
  for(const[y,color,intervals]of [[ys[0],'teal',[[0,72]]],[ys[1],'gold',[[0,3.75],[69.5,72]]],[ys[2],'blue',[[0,7],[57,72]]],[ys[3],'teal',[[0,72]]]]){
   const bars=rects.filter(n=>value(n,'y')===y&&attrs(n).fill===`var(--${color})`);assert.equal(bars.length,intervals.length);
   for(const[n,[a,b]]of bars.map((n,i)=>[n,intervals[i]])){close(value(n,'x'),x+w*a/72);close(value(n,'width'),w*(b-a)/72);assert.equal(value(n,'height'),18);}
  }
  close(69.5-3.75,65.75);close(57-7,50);has(v.lang==='fr'?'65 h 45':'65h 45m');
 } else if(v.kind==='stock'){
  const x=v.mobile?30:282,w=v.mobile?360:350,h=v.mobile?15:18,ys=v.mobile?[328,397,466,535]:[325,389,453,517];
  for(const[i,[amount,color]]of [[30.4,'teal'],[17.5,'blue'],[2.3,'gold'],[14.9,'muted']].entries()){
   const bar=one(rects,n=>value(n,'x')===x&&value(n,'y')===ys[i]&&attrs(n).fill===`var(--${color})`);close(value(bar,'width'),w*amount/65.1);assert.equal(value(bar,'height'),h);
  }
  close(30.4+17.5+2.3+14.9,65.1,1e-10);has(v.lang==='fr'?'65,10':'65.10');has('303');
 } else if(v.kind==='funding'){
  const x=v.mobile?60:430,w=v.mobile?315:600,bottom=v.mobile?785:560,height=v.mobile?270:285;
  const step=one(paths,n=>attrs(n).stroke==='var(--red)'&&attrs(n)['stroke-width']==='3.5');
  const data=[[0,0],[12,0],[12,6],[24,6],[24,14],[54,14],[54,20],[69.5,20]],points=pathPoints(attrs(step).d);assert.equal(points.length,data.length);
  for(const[i,[time,amount]]of data.entries()){close(points[i][0],x+w*time/72);close(points[i][1],bottom-height*amount/22);}
  const threshold=one(paths,n=>attrs(n).stroke==='var(--blue)'&&attrs(n)['stroke-dasharray']==='6 5');for(const p of pathPoints(attrs(threshold).d))close(p[1],bottom-height*12/22);
  const cash=one(rects,n=>value(n,'height')===28&&attrs(n).fill==='var(--teal)'&&value(n,'x')>0);close(value(cash,'width'),(v.mobile?360:275)*8/100);
  assert.equal(8+4,12);assert.equal(20-12,8);has(v.lang==='fr'?'20 demandés':'20 requested');
 } else if(v.kind==='quote'){
  for(const[numerator,denominator]of [[100,1],[100,.98],[98,.98]]){const result=(numerator/denominator).toFixed(2).replace('.',v.lang==='fr'?',':'.');has(result);}
  assert.equal((100/.98).toFixed(2),'102.04');assert.equal((98/.98).toFixed(2),'100.00');
 } else if(v.kind==='collateral'){
  for(const collateral of [100,97])has((collateral*.8/78).toFixed(3).replace('.',v.lang==='fr'?',':'.'));
  const critical=78/.8;assert.equal(critical,97.5);assert.equal(critical*.8/78,1);assert.ok(97*.8/78<1);has(v.lang==='fr'?'97,5':'97.5');
  const panels=rects.filter(n=>value(n,'rx')===12&&value(n,'x')>0);assert.equal(panels.length,4);
 } else if(v.kind==='settlement'){
  const net=one(rects,n=>attrs(n).fill==='var(--teal)'&&value(n,'y')===(v.mobile?943:656));const gross=one(rects,n=>attrs(n).fill==='var(--gold)'&&value(n,'y')===(v.mobile?1013:724));
  close(value(net,'width'),(v.mobile?360:700)*10/100);close(value(gross,'width'),v.mobile?360:700);assert.equal(100-90,10);assert.equal(100+90,190);has('190');
 } else if(v.kind==='evidence'){
  const x=v.mobile?30:315,w=v.mobile?360:725,y=v.mobile?532:390,bar=one(rects,n=>value(n,'y')===y&&attrs(n).fill==='var(--gold)');close(value(bar,'x'),x+w*9.5/24);close(value(bar,'width'),w*6.5/24);
  const all=one(rects,n=>value(n,'y')===(v.mobile?650:488)&&attrs(n).fill==='var(--teal)');close(value(all,'x'),x);close(value(all,'width'),w);has(v.lang==='fr'?'≈ 1,5×':'≈ 1.5×');has(v.lang==='fr'?'> 50 %':'> 50%');has(v.lang==='fr'?'≈ 80 %':'≈ 80%');
 }
}
test('independent arithmetic and native shapes preserve schedules, stock/flow scales, demand funding, quotes, collateral, netting and sample windows',()=>{for(const v of variants)quantitativeGeometry(v);});
test('quantitative guards reject shape-only changes to financial and timetable information',()=>{
 for(const kind of ['calendar','stock','funding','settlement','evidence']){
  const v=variants.find(v=>v.kind===kind&&v.lang==='en'&&!v.mobile);
  const changed=mutate(v,(_,ns)=>{if(kind==='funding'){const n=ns.find(n=>tag(n)==='path'&&attrs(n)['stroke-width']==='3.5');attrs(n).d=attrs(n).d.replace('530.0','531.0');}else{const n=ns.find(n=>tag(n)==='rect'&&value(n,'x')>0&&attrs(n).fill===(kind==='calendar'?'var(--gold)':kind==='stock'?'var(--teal)':kind==='settlement'?'var(--gold)':'var(--gold)')&&value(n,'height')<30);assert.ok(n);attrs(n).width=String(value(n,'width')+1);}});assert.throws(()=>quantitativeGeometry(changed));
 }
 for(const kind of ['quote','collateral']){const v=variants.find(v=>v.kind===kind&&v.lang==='en'&&!v.mobile),changed=mutate(v,(_,ns)=>{const span=ns.find(n=>tag(n)==='tspan'&&xmlText(n)===(kind==='quote'?'102.04':'0.995'));assert.ok(span);span.tspan=[{'#text':'999.99'}];});assert.throws(()=>quantitativeGeometry(changed));}
});
