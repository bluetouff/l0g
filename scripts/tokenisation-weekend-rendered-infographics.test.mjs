import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { parse } from 'parse5';
const pages=['fr','en'].map(lang=>({lang,html:readFileSync(new URL(`../dist/${lang==='fr'?'posts/tokenisation-qui-finance-weekend':'en/analysis/tokenized-markets-weekend-funding'}/index.html`,import.meta.url),'utf8')}));
const nodes=n=>[n,...(n.childNodes??[]).flatMap(nodes)];
const attr=(n,k)=>n.attrs?.find(a=>a.name===k)?.value;
const text=n=>n.nodeName==='#text'?n.value:(n.childNodes??[]).map(text).join('');
const canonical=n=>n.nodeName==='#text'?['#text',n.value]:[n.tagName,(n.attrs??[]).map(a=>[a.name,a.value]).sort(([a],[b])=>a<b?-1:a>b?1:0),(n.childNodes??[]).filter(c=>c.nodeName!=='#text'||c.value.trim()||['text','tspan','title','desc','metadata','style'].includes(n.tagName)).map(canonical)];
// Full browser-tree goldens computed independently from the supplied passive XML.
const originals={
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
const textCorrections={
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
const kinds=["calendar","stock","funding","quote","collateral","settlement","evidence"];
const references={"calendar":[5,6,8],"stock":[1],"funding":[4],"quote":[11,12],"collateral":[13],"settlement":[3,18],"evidence":[1]};
const classes=(n,name)=>(attr(n,'class')??'').split(/\s+/u).includes(name);
function figures(tree,lang){
 const all=nodes(tree),selected=all.filter(n=>n.tagName==='figure'&&classes(n,'tokenisation-weekend-figure'));assert.equal(selected.length,7);
 for(const[i,figure]of selected.entries()){
  assert.deepEqual(['id','data-figure','data-kind'].map(k=>attr(figure,k)),[`figure-${i+1}`,String(i+1).padStart(2,'0'),kinds[i]]);
  const roots=nodes(figure).filter(n=>n.tagName==='svg');assert.equal(roots.length,2);
  for(const[j,root]of roots.entries()){
   const key=`${kinds[i]}-${lang}-${j?'mobile':'desktop'}`,prefix=`tkn-f${String(i+1).padStart(2,'0')}-${lang}-${j?'m':'d'}`;
   assert.deepEqual(root.attrs.map(a=>[a.name,a.value]).sort(([a],[b])=>a<b?-1:a>b?1:0),Object.entries({xmlns:'http://www.w3.org/2000/svg',id:prefix,class:'l0g-tkn-svg',viewBox:originals[key].viewBox,role:'img','aria-labelledby':`${prefix}-title ${prefix}-desc`,style:'width:100%;height:auto'}).sort(([a],[b])=>a<b?-1:a>b?1:0));
   // Remove only the already-asserted exact root responsive style; compare every remaining original field and child.
   const projection={...root,attrs:root.attrs.filter(a=>a.name!=='style')};
   const hash=createHash('sha256').update(JSON.stringify(canonical(projection))).digest('hex');assert.equal(hash,(textCorrections[key]?.expectedDomHash??originals[key].domHash),`${key}: all native geometry, text, metadata, stylesheet, markers and child order`);
   assert.ok(classes(root.parentNode,`tokenisation-weekend-${j?'mobile':'desktop'}`));
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
test('compiled FR/EN preserve28 complete originals and seven accessible figures each',()=>{for(const page of pages)figures(parse(page.html),page.lang);});
test('compiled SVG checks detect changed native geometry, labels, styles and active nodes',()=>{
 const pick=tree=>nodes(tree).find(n=>n.tagName==='svg'&&attr(n,'id')==='tkn-f01-fr-d');
 for(const field of ['id','viewBox','role','aria-labelledby','style']){const tree=parse(pages[0].html);setAttribute(pick(tree),field,'changed');assert.throws(()=>figures(tree,'fr'));}
 {const tree=parse(pages[0].html);pick(tree).attrs=pick(tree).attrs.filter(a=>a.name!=='style');assert.throws(()=>figures(tree,'fr'));}
 for(const[field,value]of [['font-family','Arial'],['font-size','1'],['x','0'],['fill','url(https://example.org/x)']]){const tree=parse(pages[0].html),label=nodes(pick(tree)).find(n=>n.tagName==='text');setAttribute(label,field,value);assert.throws(()=>figures(tree,'fr'));}
 for(const type of ['script','foreignObject','image','animate']){const tree=parse(pages[0].html);pick(tree).childNodes.push({nodeName:type,tagName:type,attrs:[],childNodes:[]});assert.throws(()=>figures(tree,'fr'));}
 for(const type of ['tspan','style','metadata','path']){const tree=parse(pages[0].html),n=nodes(pick(tree)).find(n=>n.tagName===type);if(type==='path')setAttribute(n,'d','M0 0 L9999 0');else n.childNodes=[{nodeName:'#text',value:'changed'}];assert.throws(()=>figures(tree,'fr'));}
});
