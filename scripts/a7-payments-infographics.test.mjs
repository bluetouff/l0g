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
import { a7PaymentsSvg, A7_PAYMENTS_KINDS } from '../src/lib/a7PaymentsFigures.mjs';
import { assertFontLicenseReferences } from './font-license-assertions.mjs';

const read = file => readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
const digest = value => createHash('sha256').update(value).digest('hex');
// Independent complete XML/browser-tree goldens from the supplied 24 SVG exports.
// Sixteen exports are byte-identical; four measures headings and four backing metadata scopes receive approved wording edits.
const originals = {
  "mirror-fr-desktop": {
    "rawHash": "8550838ce388700c90aa05511701b5aaaff1a9af17702d60ac8a29e0c5ea1b26",
    "domHash": "791cf54caab9bcc9c4d398570c888f4c24c0a78358e818d05fadc146f4b875ca",
    "viewBox": "0 0 1000 730"
  },
  "mirror-fr-mobile": {
    "rawHash": "20b3c5572c10a5c1aa310476a2f24a998369b2cad4f6ae923e42b9726c94aaee",
    "domHash": "3d857e9201718372935bb36bcfd21e13a439df328bcebe152de7829f4db87740",
    "viewBox": "0 0 400 1010"
  },
  "backing-fr-desktop": {
    "rawHash": "84ddb0ff6cd50d7702cc9a0eaf4a253f3d3b44ad4ccb0d5fc4be65e7594303a7",
    "domHash": "17011f5107798c6092ff7f30c2ea76b640ab39a15a96190edd55acc2245c70ff",
    "viewBox": "0 0 1000 765"
  },
  "backing-fr-mobile": {
    "rawHash": "1fa42126e3deaf2c08198ffa59e07560134b67eae843b071f8758b00a20543ed",
    "domHash": "621d418f8bb67045523167d274a3d65b4c97784f488a0319bfdf178edbd8824b",
    "viewBox": "0 0 400 1235"
  },
  "turnover-fr-desktop": {
    "rawHash": "6d25eda778ed9256f29ccd5733afe587023272b8a622ed39e85f8f9528801862",
    "domHash": "daf73b83789802bd3a4965dc89d8882c62ee2ccbaf1bd5faba8b86ab6b02dfcb",
    "viewBox": "0 0 1000 789"
  },
  "turnover-fr-mobile": {
    "rawHash": "95211594ebcb95d9e7cc34c67eb2108d75e4b2f17f446fce2b98a9718d3e8995",
    "domHash": "8d4e2efcc6fe6c8622fbc2a267d59adc1f6667c50340e3ce831ee7bd32fc6dc5",
    "viewBox": "0 0 400 1105"
  },
  "activity-fr-desktop": {
    "rawHash": "559e51214c4de9da62289e43b94ca29f5ac042e2241189d3d78ffc6f6c248669",
    "domHash": "75867e201b539cc8ffcf398a670afc8b66a16a22ba426afc1406bae978f14e7e",
    "viewBox": "0 0 1000 768"
  },
  "activity-fr-mobile": {
    "rawHash": "b25815a8bb2b5da25dcfda5f2097e57b0ad6af426022096edbc1818c04fd5d5c",
    "domHash": "b48a60a8027c89f6f6ea8ded8e1c5cdcc909c3d0440709d4fe3825c8fb389f63",
    "viewBox": "0 0 400 946"
  },
  "measures-fr-desktop": {
    "rawHash": "90032f6e29154157a4d77269a90ecfcf1e2c2f0173c959a228d8220261c1df8e",
    "domHash": "06b4627cd6147066459b8057f240b4dac691c5cdcda8d21db635b65d6dc6b446",
    "viewBox": "0 0 1000 837"
  },
  "measures-fr-mobile": {
    "rawHash": "eb690dbcc74827abd568f2de1a00e1de9874a819761130a58c976e4044037393",
    "domHash": "443d7a23c17b4b944b497b75ad8d60ea7e7337a5231295faa609fbf41b5eff47",
    "viewBox": "0 0 400 1237"
  },
  "liquidity-fr-desktop": {
    "rawHash": "e9997e2d6e5a356dc44740d295de725d7bc8d2776d2b0120f2973cda7940fb4c",
    "domHash": "6cc7a40151d090f2dcf9fa577deda6159f5e2451b4d541b2ce419a357e18e64a",
    "viewBox": "0 0 1000 790"
  },
  "liquidity-fr-mobile": {
    "rawHash": "eba8f77d01d33bd1d0016500eca72544f62866fc898f16bea77a3767275e19fa",
    "domHash": "c3186fffce4627c25b33a723014600217ec15867e409e9aa06d99a3b2bd6e04a",
    "viewBox": "0 0 400 997"
  },
  "mirror-en-desktop": {
    "rawHash": "051641aa4160be420e649c8f5e007a17d00aea7834b49a09c85dda3563bcdaf2",
    "domHash": "90bb17a8e06128922b2da7df540202c019dd07f847031aa34c99ff66ae4eae7d",
    "viewBox": "0 0 1000 730"
  },
  "mirror-en-mobile": {
    "rawHash": "7106942477d3a6f7cb801d75976488e58ba38a207a84012b00865ad2bd6aa768",
    "domHash": "ea54d455f9e0b5f2bea0b6e988f88e41a78138bd71c863b1c3bd8db410950358",
    "viewBox": "0 0 400 1010"
  },
  "backing-en-desktop": {
    "rawHash": "9ee0a0b667b7406504c5460e1525379d230cdfdc0ffead31725b84b6f97799fb",
    "domHash": "7d318b615313eed29f33b6d329cc73a6a0d4f238034db6928aa3ca006916cd64",
    "viewBox": "0 0 1000 765"
  },
  "backing-en-mobile": {
    "rawHash": "197c94c429bbc64e94806341c2c903833ddde97b31e047968f73cdc118054d36",
    "domHash": "9c9a72a19dd84cc54ca214c85eb1c985a4dfba5e2f30a4a17590815d2fa0b78c",
    "viewBox": "0 0 400 1235"
  },
  "turnover-en-desktop": {
    "rawHash": "8ea219dcd643a3c4e7cf9f197b54fd42f20ba9d0ad44be77c3a1f4c4c94ed07a",
    "domHash": "7ab24454793df5911c35aa29fa670fa3538740ea8bed37ba760cda8d026609bb",
    "viewBox": "0 0 1000 789"
  },
  "turnover-en-mobile": {
    "rawHash": "f7feb92f73692122be33055c5f7cc17d0a3afc3c68338afba49edbabe7e89408",
    "domHash": "80d95e7387c6933f3a265ad2b24899371bed55f9aa808007a3e5b038ecb69d74",
    "viewBox": "0 0 400 1105"
  },
  "activity-en-desktop": {
    "rawHash": "fce22bb3d165d8638f311344ce89c6e9c28327272892a572ea1bcf7e3f895296",
    "domHash": "f633c14a67aa5f6b050f13531d8acbcfe40a2dc49eaa6a5cf7c07a84adf46804",
    "viewBox": "0 0 1000 768"
  },
  "activity-en-mobile": {
    "rawHash": "ff141ad435f5c97fb8d2e9a69a69691ab2a4a7169475667e835966172525e355",
    "domHash": "87163932ec83428289e796ef682ab8b1dc47866c21787060e17921dcc79dc7d5",
    "viewBox": "0 0 400 946"
  },
  "measures-en-desktop": {
    "rawHash": "683eaf6029e2683e99a3f32ccba5ceadaec28355857549f954e47a58264a0787",
    "domHash": "5f70e459a05d877495643f172cdc4cd0cb841563cc2d9461ece95e8cf7c5b7ef",
    "viewBox": "0 0 1000 837"
  },
  "measures-en-mobile": {
    "rawHash": "8b3175a6064b28a18c3ddc47e2af1cae9321dbc48580e6c08f0581a9081d2adb",
    "domHash": "2f143f0b3d18001dd8870e18a04868780145cffd5cfb2c514423a710803f2c53",
    "viewBox": "0 0 400 1237"
  },
  "liquidity-en-desktop": {
    "rawHash": "4389db911bb66c2a7b95ebd5ee792358bf6dc750fce42d96b554c9125c49d08d",
    "domHash": "1a67b2bec0934c5cb8dcec6b3406cde67573073e7bd766c8ade2cd79f6325230",
    "viewBox": "0 0 1000 790"
  },
  "liquidity-en-mobile": {
    "rawHash": "053db57e9b1e50641ccb81a57f374e108d10ea1828c5953a57744545e00c72d0",
    "domHash": "6ab2a4293e221f7f253af3bf190ae35c04c0e789e962dea69e461978272586aa",
    "viewBox": "0 0 400 997"
  }
};
const metadata = {
  "mirror-fr-desktop": {
    "asOf": "2026-10-15",
    "kind": "mirror",
    "language": "fr",
    "variant": "desktop",
    "status": "documented-mechanism",
    "sources": [
      "https://cryptoslate.com/press-releases/a7-to-unveil-a-service-that-will-re-invent-the-international-payments-market/",
      "https://www.swift.com/about-us/who-we-are",
      "https://www.govinfo.gov/content/pkg/FR-2026-10-05/html/2026-20371.htm"
    ],
    "method": "Architecture conceptuelle simplifiée à partir de la description du FinCEN, confrontée à l’annonce commerciale d’A7. Aucune route opérationnelle, banque partenaire ou opération individuelle n’est reconstituée. Swift est une messagerie ; la disponibilité des fonds dépend des établissements."
  },
  "mirror-fr-mobile": {
    "asOf": "2026-10-15",
    "kind": "mirror",
    "language": "fr",
    "variant": "mobile",
    "status": "documented-mechanism",
    "sources": [
      "https://cryptoslate.com/press-releases/a7-to-unveil-a-service-that-will-re-invent-the-international-payments-market/",
      "https://www.swift.com/about-us/who-we-are",
      "https://www.govinfo.gov/content/pkg/FR-2026-10-05/html/2026-20371.htm"
    ],
    "method": "Architecture conceptuelle simplifiée à partir de la description du FinCEN, confrontée à l’annonce commerciale d’A7. Aucune route opérationnelle, banque partenaire ou opération individuelle n’est reconstituée. Swift est une messagerie ; la disponibilité des fonds dépend des établissements."
  },
  "backing-fr-desktop": {
    "asOf": "2026-10-15",
    "kind": "backing",
    "language": "fr",
    "variant": "desktop",
    "status": "documented-mechanism",
    "sources": [
      "https://www.fincen.gov/system/files/2026-10/FinCEN-Alert-A7-Network.pdf",
      "https://www.bis.org/publications/qr-202606/uncovering-fx-settlement-risk-new-measures-2025-bis-triennial-survey"
    ],
    "method": "Schéma de créances et de conditions, sans montant ni bilan consolidé reconstitué. L’adossement annoncé à des dépôts PSB est décrit par le FinCEN, sans certification par l0g. Le droit au remboursement, sa liquidité et le change dépendent de conditions non auditées."
  },
  "backing-fr-mobile": {
    "asOf": "2026-10-15",
    "kind": "backing",
    "language": "fr",
    "variant": "mobile",
    "status": "documented-mechanism",
    "sources": [
      "https://www.fincen.gov/system/files/2026-10/FinCEN-Alert-A7-Network.pdf",
      "https://www.bis.org/publications/qr-202606/uncovering-fx-settlement-risk-new-measures-2025-bis-triennial-survey"
    ],
    "method": "Schéma de créances et de conditions, sans montant ni bilan consolidé reconstitué. L’adossement annoncé à des dépôts PSB est décrit par le FinCEN, sans certification par l0g. Le droit au remboursement, sa liquidité et le change dépendent de conditions non auditées."
  },
  "turnover-fr-desktop": {
    "asOf": "2026-10-15",
    "kind": "turnover",
    "language": "fr",
    "variant": "desktop",
    "status": "hypothetical",
    "sources": [
      "https://www.govinfo.gov/content/pkg/FR-2026-10-05/html/2026-20371.htm",
      "https://home.treasury.gov/news/press-releases/sb0644/"
    ],
    "method": "Quatre comptes fictifs et une boucle de quatre transferts de 100 unités. Le montant cumulé des transferts vaut 4 × 100 = 400 ; le montant de la facture illustrée vaut 100. Ce rapport n’est ni une estimation ni un coefficient correcteur applicable aux volumes A7. La liaison entre les deux mesures est à documenter."
  },
  "turnover-fr-mobile": {
    "asOf": "2026-10-15",
    "kind": "turnover",
    "language": "fr",
    "variant": "mobile",
    "status": "hypothetical",
    "sources": [
      "https://www.govinfo.gov/content/pkg/FR-2026-10-05/html/2026-20371.htm",
      "https://home.treasury.gov/news/press-releases/sb0644/"
    ],
    "method": "Quatre comptes fictifs et une boucle de quatre transferts de 100 unités. Le montant cumulé des transferts vaut 4 × 100 = 400 ; le montant de la facture illustrée vaut 100. Ce rapport n’est ni une estimation ni un coefficient correcteur applicable aux volumes A7. La liaison entre les deux mesures est à documenter."
  },
  "activity-fr-desktop": {
    "asOf": "2026-10-15",
    "kind": "activity",
    "language": "fr",
    "variant": "desktop",
    "status": "published-measurement",
    "sources": [
      "https://www.elliptic.co/insights/the-fall-of-a7a5-how-sanctions-strangled-the-ruble-stablecoin/"
    ],
    "method": "Source : texte Elliptic publié le 29 juillet 2026. Moyenne quotidienne de juin : 24,3 millions USD. Indice l0g, pic de juillet 2025 = 100 ; 100 × (1 − 0,96) = environ 4, car le taux source est arrondi. Barres à origine zéro. Pas d’interpolation mensuelle, de montant de pic reconstitué ou d’actualisation à octobre. A7A5 n’est pas l’ensemble d’A7."
  },
  "activity-fr-mobile": {
    "asOf": "2026-10-15",
    "kind": "activity",
    "language": "fr",
    "variant": "mobile",
    "status": "published-measurement",
    "sources": [
      "https://www.elliptic.co/insights/the-fall-of-a7a5-how-sanctions-strangled-the-ruble-stablecoin/"
    ],
    "method": "Source : texte Elliptic publié le 29 juillet 2026. Moyenne quotidienne de juin : 24,3 millions USD. Indice l0g, pic de juillet 2025 = 100 ; 100 × (1 − 0,96) = environ 4, car le taux source est arrondi. Barres à origine zéro. Pas d’interpolation mensuelle, de montant de pic reconstitué ou d’actualisation à octobre. A7A5 n’est pas l’ensemble d’A7."
  },
  "measures-fr-desktop": {
    "asOf": "2026-10-15",
    "kind": "measures",
    "language": "fr",
    "variant": "desktop",
    "status": "documented-mechanism",
    "sources": [
      "https://www.govinfo.gov/content/pkg/FR-2026-10-05/html/2026-20371.htm",
      "https://home.treasury.gov/news/press-releases/sb0644/",
      "https://home.treasury.gov/news/press-releases/sb0225",
      "https://www.consilium.europa.eu/en/press/press-releases/2025/10/23/19th-package-of-sanctions-against-russia-eu-targets-russian-energy-third-country-banks-and-crypto-providers/",
      "https://eur-lex.europa.eu/eli/reg/2025/2033/oj/eng",
      "https://www.fincen.gov/resources/statutes-and-regulations/special-measures"
    ],
    "method": "Repères chronologiques, distances non proportionnelles au temps. OFAC : entités en août 2025, réseau en octobre 2026. UE : entrée A7A5 au 25 novembre 2025 après adoption le 23 octobre. La proposition FinCEN est annoncée le 1er octobre, publiée le 5, avec commentaires au 4 novembre. Chaque juridiction conserve son champ ; cette figure n’est pas une revue exhaustive des sanctions."
  },
  "measures-fr-mobile": {
    "asOf": "2026-10-15",
    "kind": "measures",
    "language": "fr",
    "variant": "mobile",
    "status": "documented-mechanism",
    "sources": [
      "https://www.govinfo.gov/content/pkg/FR-2026-10-05/html/2026-20371.htm",
      "https://home.treasury.gov/news/press-releases/sb0644/",
      "https://home.treasury.gov/news/press-releases/sb0225",
      "https://www.consilium.europa.eu/en/press/press-releases/2025/10/23/19th-package-of-sanctions-against-russia-eu-targets-russian-energy-third-country-banks-and-crypto-providers/",
      "https://eur-lex.europa.eu/eli/reg/2025/2033/oj/eng",
      "https://www.fincen.gov/resources/statutes-and-regulations/special-measures"
    ],
    "method": "Repères chronologiques, distances non proportionnelles au temps. OFAC : entités en août 2025, réseau en octobre 2026. UE : entrée A7A5 au 25 novembre 2025 après adoption le 23 octobre. La proposition FinCEN est annoncée le 1er octobre, publiée le 5, avec commentaires au 4 novembre. Chaque juridiction conserve son champ ; cette figure n’est pas une revue exhaustive des sanctions."
  },
  "liquidity-fr-desktop": {
    "asOf": "2026-10-15",
    "kind": "liquidity",
    "language": "fr",
    "variant": "desktop",
    "status": "hypothetical",
    "sources": [
      "https://www.govinfo.gov/content/pkg/FR-2026-10-05/html/2026-20371.htm",
      "https://www.bis.org/publications/qr-202606/uncovering-fx-settlement-risk-new-measures-2025-bis-triennial-survey"
    ],
    "method": "Moyennes en régime stabilisé : encours en attente = flux quotidien × délai moyen. Préfinancement intégral, flux de 10 unités/jour inchangé ; absence de défaut, frais et mouvement de change. Délais de 2 et 8 jours entièrement fictifs. Si les ressources manquent, maintenir le débit peut devenir impossible ; aucun délai ou déficit de trésorerie d’A7 n’est estimé."
  },
  "liquidity-fr-mobile": {
    "asOf": "2026-10-15",
    "kind": "liquidity",
    "language": "fr",
    "variant": "mobile",
    "status": "hypothetical",
    "sources": [
      "https://www.govinfo.gov/content/pkg/FR-2026-10-05/html/2026-20371.htm",
      "https://www.bis.org/publications/qr-202606/uncovering-fx-settlement-risk-new-measures-2025-bis-triennial-survey"
    ],
    "method": "Moyennes en régime stabilisé : encours en attente = flux quotidien × délai moyen. Préfinancement intégral, flux de 10 unités/jour inchangé ; absence de défaut, frais et mouvement de change. Délais de 2 et 8 jours entièrement fictifs. Si les ressources manquent, maintenir le débit peut devenir impossible ; aucun délai ou déficit de trésorerie d’A7 n’est estimé."
  },
  "mirror-en-desktop": {
    "asOf": "2026-10-15",
    "kind": "mirror",
    "language": "en",
    "variant": "desktop",
    "status": "documented-mechanism",
    "sources": [
      "https://cryptoslate.com/press-releases/a7-to-unveil-a-service-that-will-re-invent-the-international-payments-market/",
      "https://www.swift.com/about-us/who-we-are",
      "https://www.govinfo.gov/content/pkg/FR-2026-10-05/html/2026-20371.htm"
    ],
    "method": "Simplified conceptual architecture from FinCEN’s description, compared with A7’s commercial announcement. No operational route, partner bank or individual transaction is reconstructed. Swift is a messaging system; institutions determine fund availability."
  },
  "mirror-en-mobile": {
    "asOf": "2026-10-15",
    "kind": "mirror",
    "language": "en",
    "variant": "mobile",
    "status": "documented-mechanism",
    "sources": [
      "https://cryptoslate.com/press-releases/a7-to-unveil-a-service-that-will-re-invent-the-international-payments-market/",
      "https://www.swift.com/about-us/who-we-are",
      "https://www.govinfo.gov/content/pkg/FR-2026-10-05/html/2026-20371.htm"
    ],
    "method": "Simplified conceptual architecture from FinCEN’s description, compared with A7’s commercial announcement. No operational route, partner bank or individual transaction is reconstructed. Swift is a messaging system; institutions determine fund availability."
  },
  "backing-en-desktop": {
    "asOf": "2026-10-15",
    "kind": "backing",
    "language": "en",
    "variant": "desktop",
    "status": "documented-mechanism",
    "sources": [
      "https://www.fincen.gov/system/files/2026-10/FinCEN-Alert-A7-Network.pdf",
      "https://www.bis.org/publications/qr-202606/uncovering-fx-settlement-risk-new-measures-2025-bis-triennial-survey"
    ],
    "method": "Claims-and-conditions diagram with no amounts or reconstructed consolidated balance sheet. FinCEN describes the advertised backing by PSB deposits; l0g has not certified those reserves. Redemption rights, liquidity and FX access depend on terms not audited here."
  },
  "backing-en-mobile": {
    "asOf": "2026-10-15",
    "kind": "backing",
    "language": "en",
    "variant": "mobile",
    "status": "documented-mechanism",
    "sources": [
      "https://www.fincen.gov/system/files/2026-10/FinCEN-Alert-A7-Network.pdf",
      "https://www.bis.org/publications/qr-202606/uncovering-fx-settlement-risk-new-measures-2025-bis-triennial-survey"
    ],
    "method": "Claims-and-conditions diagram with no amounts or reconstructed consolidated balance sheet. FinCEN describes the advertised backing by PSB deposits; l0g has not certified those reserves. Redemption rights, liquidity and FX access depend on terms not audited here."
  },
  "turnover-en-desktop": {
    "asOf": "2026-10-15",
    "kind": "turnover",
    "language": "en",
    "variant": "desktop",
    "status": "hypothetical",
    "sources": [
      "https://www.govinfo.gov/content/pkg/FR-2026-10-05/html/2026-20371.htm",
      "https://home.treasury.gov/news/press-releases/sb0644/"
    ],
    "method": "Four fictional accounts and a loop of four 100-unit transfers. Gross transfers equal 4 × 100 = 400; the illustrated invoice is 100. This ratio is neither an estimate nor a correction factor for A7 volumes. Linking the two measures requires evidence."
  },
  "turnover-en-mobile": {
    "asOf": "2026-10-15",
    "kind": "turnover",
    "language": "en",
    "variant": "mobile",
    "status": "hypothetical",
    "sources": [
      "https://www.govinfo.gov/content/pkg/FR-2026-10-05/html/2026-20371.htm",
      "https://home.treasury.gov/news/press-releases/sb0644/"
    ],
    "method": "Four fictional accounts and a loop of four 100-unit transfers. Gross transfers equal 4 × 100 = 400; the illustrated invoice is 100. This ratio is neither an estimate nor a correction factor for A7 volumes. Linking the two measures requires evidence."
  },
  "activity-en-desktop": {
    "asOf": "2026-10-15",
    "kind": "activity",
    "language": "en",
    "variant": "desktop",
    "status": "published-measurement",
    "sources": [
      "https://www.elliptic.co/insights/the-fall-of-a7a5-how-sanctions-strangled-the-ruble-stablecoin/"
    ],
    "method": "Source: Elliptic text published 29 July 2026. June daily average: USD 24.3 million. l0g index, July 2025 peak = 100; 100 × (1 − 0.96) ≈ 4 because the source rate is rounded. Zero-based bars. No monthly interpolation, reconstructed peak amount or October update. A7A5 is not the whole A7 network."
  },
  "activity-en-mobile": {
    "asOf": "2026-10-15",
    "kind": "activity",
    "language": "en",
    "variant": "mobile",
    "status": "published-measurement",
    "sources": [
      "https://www.elliptic.co/insights/the-fall-of-a7a5-how-sanctions-strangled-the-ruble-stablecoin/"
    ],
    "method": "Source: Elliptic text published 29 July 2026. June daily average: USD 24.3 million. l0g index, July 2025 peak = 100; 100 × (1 − 0.96) ≈ 4 because the source rate is rounded. Zero-based bars. No monthly interpolation, reconstructed peak amount or October update. A7A5 is not the whole A7 network."
  },
  "measures-en-desktop": {
    "asOf": "2026-10-15",
    "kind": "measures",
    "language": "en",
    "variant": "desktop",
    "status": "documented-mechanism",
    "sources": [
      "https://www.govinfo.gov/content/pkg/FR-2026-10-05/html/2026-20371.htm",
      "https://home.treasury.gov/news/press-releases/sb0644/",
      "https://home.treasury.gov/news/press-releases/sb0225",
      "https://www.consilium.europa.eu/en/press/press-releases/2025/10/23/19th-package-of-sanctions-against-russia-eu-targets-russian-energy-third-country-banks-and-crypto-providers/",
      "https://eur-lex.europa.eu/eli/reg/2025/2033/oj/eng",
      "https://www.fincen.gov/resources/statutes-and-regulations/special-measures"
    ],
    "method": "Chronological markers; distances are not proportional to time. OFAC: entities in August 2025, network in October 2026. EU: A7A5 entry dated 25 November 2025 after 23 October adoption. FinCEN proposal announced 1 October, published 5 October, comments due 4 November. Jurisdictions retain their respective scope; this is not an exhaustive sanctions review."
  },
  "measures-en-mobile": {
    "asOf": "2026-10-15",
    "kind": "measures",
    "language": "en",
    "variant": "mobile",
    "status": "documented-mechanism",
    "sources": [
      "https://www.govinfo.gov/content/pkg/FR-2026-10-05/html/2026-20371.htm",
      "https://home.treasury.gov/news/press-releases/sb0644/",
      "https://home.treasury.gov/news/press-releases/sb0225",
      "https://www.consilium.europa.eu/en/press/press-releases/2025/10/23/19th-package-of-sanctions-against-russia-eu-targets-russian-energy-third-country-banks-and-crypto-providers/",
      "https://eur-lex.europa.eu/eli/reg/2025/2033/oj/eng",
      "https://www.fincen.gov/resources/statutes-and-regulations/special-measures"
    ],
    "method": "Chronological markers; distances are not proportional to time. OFAC: entities in August 2025, network in October 2026. EU: A7A5 entry dated 25 November 2025 after 23 October adoption. FinCEN proposal announced 1 October, published 5 October, comments due 4 November. Jurisdictions retain their respective scope; this is not an exhaustive sanctions review."
  },
  "liquidity-en-desktop": {
    "asOf": "2026-10-15",
    "kind": "liquidity",
    "language": "en",
    "variant": "desktop",
    "status": "hypothetical",
    "sources": [
      "https://www.govinfo.gov/content/pkg/FR-2026-10-05/html/2026-20371.htm",
      "https://www.bis.org/publications/qr-202606/uncovering-fx-settlement-risk-new-measures-2025-bis-triennial-survey"
    ],
    "method": "Steady-state averages: pending balance = daily flow × average delay. Fully prefunded, unchanged flow of 10 units/day; no default, fees or exchange-rate movements. The two- and eight-day delays are entirely fictional. Insufficient resources may prevent the same throughput from continuing; no A7 delay or cash shortfall is estimated."
  },
  "liquidity-en-mobile": {
    "asOf": "2026-10-15",
    "kind": "liquidity",
    "language": "en",
    "variant": "mobile",
    "status": "hypothetical",
    "sources": [
      "https://www.govinfo.gov/content/pkg/FR-2026-10-05/html/2026-20371.htm",
      "https://www.bis.org/publications/qr-202606/uncovering-fx-settlement-risk-new-measures-2025-bis-triennial-survey"
    ],
    "method": "Steady-state averages: pending balance = daily flow × average delay. Fully prefunded, unchanged flow of 10 units/day; no default, fees or exchange-rate movements. The two- and eight-day delays are entirely fictional. Insufficient resources may prevent the same throughput from continuing; no A7 delay or cash shortfall is estimated."
  }
};
const kinds = ["mirror","backing","turnover","activity","measures","liquidity"];
const figureSources = {"mirror":[1,2,5],"backing":[6,16],"turnover":[5,7],"activity":[11],"measures":[5,7,12,13,14,15],"liquidity":[5,16]};
const variants = ['fr', 'en'].flatMap(lang => kinds.flatMap(kind => [false, true].map(mobile => ({ lang, kind, mobile, key: `${kind}-${lang}-${mobile ? 'mobile' : 'desktop'}`, svg: a7PaymentsSvg(lang, kind, mobile) }))));
const articles = () => ['fr', 'en'].map(lang => ({ lang, raw: read(`src/content/${lang === 'fr' ? 'posts/a7-banques-detour-paiements-russes' : 'posts-en/a7-banks-russia-payment-detour'}.mdx`) }));
const parser = new XMLParser({ preserveOrder: true, ignoreAttributes: false, attributeNamePrefix: '', trimValues: false, parseTagValue: false, parseAttributeValue: false });
const builder = new XMLBuilder({ preserveOrder: true, ignoreAttributes: false, attributeNamePrefix: '' });
const tag = n => Object.keys(n).find(k => k !== ':@');
const attrs = n => n[':@'] ?? {};
const children = n => n[tag(n)] ?? [];
const xmlNodes = n => tag(n) === '#text' ? [] : [n, ...children(n).flatMap(xmlNodes)];
const xmlText = n => tag(n) === '#text' ? n['#text'] : children(n).map(xmlText).join('');
const htmlNodes = n => [n, ...(n.childNodes ?? []).flatMap(htmlNodes)];
const htmlAttr = (n, k) => n.attrs?.find(a => a.name === k)?.value;
const htmlText = n => n.nodeName === '#text' ? n.value : (n.childNodes ?? []).map(htmlText).join('');
const canonical = n => n.nodeName === '#text' ? ['#text', n.value] : [n.tagName, (n.attrs ?? []).map(a => [a.name, a.value]).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0), (n.childNodes ?? []).filter(c => c.nodeName !== '#text' || c.value.trim() || ['text', 'title', 'desc', 'metadata'].includes(n.tagName)).map(canonical)];
const domHash = raw => {
  const roots = htmlNodes(parse(raw)).filter(n => n.tagName === 'svg');
  assert.equal(roots.length, 1);
  return digest(JSON.stringify(canonical(roots[0])));
};
const allowed = Object.fromEntries(Object.entries({
  svg: 'xmlns viewBox role aria-labelledby style',
  title: 'id', desc: 'id', metadata: '',
  rect: 'x y width height rx fill stroke stroke-width stroke-dasharray opacity',
  text: 'x y fill font-family font-size font-weight text-anchor',
  line: 'x1 y1 x2 y2 stroke stroke-width stroke-dasharray',
  circle: 'cx cy r fill stroke stroke-width',
  path: 'd fill stroke stroke-width stroke-linecap stroke-linejoin stroke-dasharray opacity',
}).map(([k, v]) => [k, new Set(v ? v.split(' ') : [])]));
const paints = new Set(['none',
  'var(--color-accent, #ff4d87)', 'var(--color-amber, #f5b13d)',
  'var(--color-ink, #0c0d10)', 'var(--color-muted, #8b909b)',
  'var(--color-paper, #e7e9ee)', 'var(--color-signal, #5eead4)',
  'var(--color-surface, #121419)', 'var(--color-surface-2, #171a20)',
  'var(--color-topic-blue, #7aa2f7)',
  'var(--color-line-strong, rgba(255, 255, 255, 0.20))',
]);
const numeric = new Set('x y x1 y1 x2 y2 width height rx cx cy r font-size stroke-width'.split(' '));
function number(value) {
  assert.equal(typeof value, 'string');
  assert.ok(value.length > 0 && value.length <= 32);
  assert.match(value, /^-?(?:\d{1,4}(?:\.\d{1,16})?|\.\d{1,16})$/u);
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
  const token = /[MLHVZCQT]|-?(?:\d{1,4}(?:\.\d{1,16})?|\.\d{1,16})/uy;
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
function inspect(v) {
  assert.ok(v.svg.length > 100 && v.svg.length < 30000);
  assert.doesNotMatch(v.svg, /<!|<\?|&(?!amp;|lt;|gt;|quot;|apos;)/u);
  assert.doesNotMatch(v.svg, /\b(?:__proto__|constructor|prototype)\s*=/u);
  assert.equal(XMLValidator.validate(v.svg), true);
  const roots = parser.parse(v.svg); assert.equal(roots.length, 1);
  const root = roots[0]; assert.equal(tag(root), 'svg');
  const prefix = `a7-${v.kind}-${v.lang}-${v.mobile ? 'mobile' : 'desktop'}`;
  assert.deepEqual(attrs(root), { xmlns: 'http://www.w3.org/2000/svg', viewBox: originals[v.key].viewBox, role: 'img', 'aria-labelledby': `${prefix}-title ${prefix}-desc`, style: 'display:block;width:100%;height:auto' });
  const nodes = xmlNodes(root); assert.ok(nodes.length < 512);
  const ids = [];
  for (const n of nodes) {
    assert.ok(Object.hasOwn(allowed, tag(n)), `Passive tag ${tag(n)}`);
    for (const [k, val] of Object.entries(attrs(n))) {
      assert.ok(allowed[tag(n)].has(k), `Known field ${tag(n)}.${k}`);
      assert.equal(typeof val, 'string'); assert.ok(val.length <= 8192);
      if (numeric.has(k)) {
        const num = number(val);
        if (['width', 'height', 'rx', 'r', 'stroke-width'].includes(k)) assert.ok(num >= 0);
      }
      if (k === 'fill' || k === 'stroke') assert.ok(paints.has(val), `Semantic paint ${val}`);
      if (k === 'id') { assert.ok([`${prefix}-title`, `${prefix}-desc`].includes(val)); ids.push(val); }
      if (k === 'font-family') assert.equal(val, 'Arial, Helvetica, sans-serif');
      if (k === 'font-weight') assert.ok(['400', '700'].includes(val));
      if (k === 'font-size') assert.ok(number(val) >= 12 && number(val) <= 64);
      if (k === 'text-anchor') assert.ok(['start', 'middle', 'end'].includes(val));
      if (k === 'stroke-dasharray') assert.ok(['5 5', '6 5', '6 6'].includes(val));
      if (k === 'stroke-linecap' || k === 'stroke-linejoin') assert.equal(val, 'round');
      if (k === 'd') pathPoints(val);
      if (k === 'opacity') assert.fail('No authored A7 opacity');
      if (k === 'transform') assert.fail('No authored A7 transforms');
    }
  }
  assert.deepEqual(ids.sort(), [`${prefix}-desc`, `${prefix}-title`]);

  for (const type of ['title', 'desc', 'metadata']) { const found = nodes.filter(n => tag(n) === type); assert.equal(found.length, 1); assert.ok(xmlText(found[0]).trim()); }
  const meta = JSON.parse(xmlText(nodes.find(n => tag(n) === 'metadata')));
  assert.deepEqual(meta, metadata[v.key]);
  const [, , width, height] = attrs(root).viewBox.split(' ').map(number);
  return { root, nodes, width, height };
}
function faithful(v) {
  inspect(v);
  assert.equal(digest(v.svg), originals[v.key].rawHash, `${v.key}: approved source bytes preserved`);
  assert.equal(domHash(v.svg), originals[v.key].domHash, `${v.key}: complete browser SVG tree`);
}
const mutate = (v, change) => { const root = parser.parse(v.svg)[0]; change(root, xmlNodes(root)); return { ...v, svg: builder.build([root]) }; };
const fontFrom = file => {
  const bytes = readFileSync(new URL(`../${file}`, import.meta.url));
  return opentype.parse(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength));
};
const fonts = Object.fromEntries([400, 700].map(w => [w, fontFrom(`public/fonts/a7-payments/liberation-sans-${w}.ttf`)]));
const within = (a, b, tolerance = 0) => a.x >= b.x - tolerance && a.y >= b.y - tolerance && a.right <= b.right + tolerance && a.bottom <= b.bottom + tolerance;
const overlaps = (a, b) => a.x < b.right && a.right > b.x && a.y < b.bottom && a.bottom > b.y;
const pointsBox = points => { assert.ok(points.length && points.flat().every(Number.isFinite)); return { x: Math.min(...points.map(p => p[0])), y: Math.min(...points.map(p => p[1])), right: Math.max(...points.map(p => p[0])), bottom: Math.max(...points.map(p => p[1])) }; };
function shapeBox(n) {
  if (tag(n) === 'rect') return { x: value(n, 'x'), y: value(n, 'y'), right: value(n, 'x') + value(n, 'width'), bottom: value(n, 'y') + value(n, 'height') };
  if (tag(n) === 'circle') return { x: value(n, 'cx') - value(n, 'r'), y: value(n, 'cy') - value(n, 'r'), right: value(n, 'cx') + value(n, 'r'), bottom: value(n, 'cy') + value(n, 'r') };
  if (tag(n) === 'line') return pointsBox([[value(n, 'x1'), value(n, 'y1')], [value(n, 'x2'), value(n, 'y2')]]);
  if (tag(n) === 'path') return pointsBox(pathPoints(attrs(n).d));
}
function textBox(n) {
  const label = xmlText(n), font = fonts[attrs(n)['font-weight']], size = value(n, 'font-size');
  for (const c of label) assert.ok(font.charToGlyphIndex(c) > 0, `Glyph U+${c.codePointAt(0).toString(16)}`);
  const advance = font.getAdvanceWidth(label, size);
  const x = value(n, 'x') - (attrs(n)['text-anchor'] === 'middle' ? advance / 2 : attrs(n)['text-anchor'] === 'end' ? advance : 0);
  // Include quadratic/cubic extrema, rather than treating control points as
  // visible ink or depending on an API absent from the installed font library.
  const points = []; let current, origin;
  const curve = (p, t) => p.length === 3
    ? [0, 1].map(k => (1 - t) ** 2 * p[0][k] + 2 * (1 - t) * t * p[1][k] + t ** 2 * p[2][k])
    : [0, 1].map(k => (1 - t) ** 3 * p[0][k] + 3 * (1 - t) ** 2 * t * p[1][k] + 3 * (1 - t) * t ** 2 * p[2][k] + t ** 3 * p[3][k]);
  for (const command of font.getPath(label, x, value(n, 'y'), size).commands) {
    assert.ok(['M', 'L', 'Q', 'C', 'Z'].includes(command.type));
    if (command.type === 'Z') { assert.ok(origin); current = [...origin]; points.push(current); continue; }
    const end = [command.x, command.y]; assert.ok(end.every(Number.isFinite));
    if (command.type === 'M') origin = [...end];
    if (command.type === 'Q' || command.type === 'C') {
      assert.ok(current); const p = [current, [command.x1, command.y1], ...(command.type === 'C' ? [[command.x2, command.y2]] : []), end];
      for (const k of [0, 1]) {
        let roots;
        if (p.length === 3) { const denominator = p[0][k] - 2 * p[1][k] + p[2][k]; roots = denominator === 0 ? [] : [(p[0][k] - p[1][k]) / denominator]; }
        else {
          const a = -p[0][k] + 3 * p[1][k] - 3 * p[2][k] + p[3][k], b = 2 * (p[0][k] - 2 * p[1][k] + p[2][k]), c = p[1][k] - p[0][k], discriminant = b * b - 4 * a * c;
          roots = Math.abs(a) < 1e-12 ? (Math.abs(b) < 1e-12 ? [] : [-c / b]) : discriminant < 0 ? [] : [(-b - Math.sqrt(discriminant)) / (2 * a), (-b + Math.sqrt(discriminant)) / (2 * a)];
        }
        for (const t of roots) if (t > 0 && t < 1) points.push(curve(p, t));
      }
    }
    points.push(end); current = end;
  }
  return { ...pointsBox(points), label };
}
function geometry(v) {
  const { nodes, width, height } = inspect(v), canvas = { x: 0, y: 0, right: width, bottom: height };
  const shapes = nodes.filter(n => ['rect', 'circle', 'line', 'path', 'text'].includes(tag(n)));
  const panels = shapes.filter(n => tag(n) === 'rect' && value(n, 'rx') >= 9 && value(n, 'x') > 1 && value(n, 'width') >= 100 && value(n, 'height') >= 40).map(shapeBox);
  const labels = [];
  for (const n of shapes) {
    if (tag(n) !== 'text') {
      const b = shapeBox(n), stroke = attrs(n).stroke && attrs(n).stroke !== 'none' ? value(n, 'stroke-width', '1') / 2 : 0;
      assert.ok(within({ x: b.x - stroke, y: b.y - stroke, right: b.right + stroke, bottom: b.bottom + stroke }, canvas, .01), `${v.key}: shape outside viewBox`);
      continue;
    }
    const b = textBox(n);
    assert.ok(within(b, canvas, .01), `${v.key}: text outside viewBox: ${b.label}`);
    const centre = { x: (b.x + b.right) / 2, y: (b.y + b.bottom) / 2, right: (b.x + b.right) / 2, bottom: (b.y + b.bottom) / 2 };
    const panel = panels.filter(p => within(centre, p)).at(-1);
    if (panel) assert.ok(within(b, panel, .1), `${v.key}: text outside panel: ${b.label}`);
    for (const prior of labels) assert.ok(!overlaps(b, prior), `${v.key}: labels overlap: ${b.label} / ${prior.label}`);
    labels.push(b);
  }
}
test('A7 payments variant selection is frozen, complete and rejects prototypes or coercion', () => {
  assert.deepEqual(A7_PAYMENTS_KINDS, kinds); assert.ok(Object.isFrozen(A7_PAYMENTS_KINDS)); assert.equal(variants.length, 24);
  for (const lang of ['', 'FR', '__proto__', 'constructor', {}, null, ['fr']]) assert.throws(() => a7PaymentsSvg(lang, 'mirror', false), TypeError);
  for (const kind of ['', '__proto__', 'constructor', 'prototype', {}, null, ['mirror']]) assert.throws(() => a7PaymentsSvg('fr', kind, false), TypeError);
  for (const mobile of [0, 1, '', 'false', null, new Boolean(false), {}, []]) assert.throws(() => a7PaymentsSvg('fr', 'mirror', mobile), TypeError);
  assert.equal(a7PaymentsSvg('fr', 'mirror'), a7PaymentsSvg('fr', 'mirror', false));
});
test('sixteen exports are byte-identical; four measures headings and four backing metadata scopes retain approved edits', () => { for (const v of variants) faithful(v); });
test('all original shapes and font glyphs remain in viewBox and panels', () => {
  const issues = []; for (const v of variants) { try { geometry(v); } catch (error) { issues.push(error.message); } }
  assert.deepEqual(issues, []);
});
test('geometry checks reject shape overflow and overlapping ink', () => {
  const v = variants[0];
  for (const change of [
    (_, ns) => { attrs(ns.find(n => tag(n) === 'rect')).x = '9999'; },
    (_, ns) => { attrs(ns.find(n => tag(n) === 'text')).x = '-10'; },
    (_, ns) => { const root = ns[0], label=ns.find(n => tag(n)==='text'); root.svg.push(JSON.parse(JSON.stringify(label))); },
  ]) assert.throws(() => geometry(mutate(v, change)));
});
test('complete fingerprints detect geometry, text, metadata, palette and child-order mutations', () => {
  const v = variants[0];
  for (const change of [(_, ns) => { attrs(ns.find(n => tag(n) === 'text')).x = '0'; }, (_, ns) => { attrs(ns.find(n => tag(n) === 'rect')).fill = 'var(--color-surface, #121419)'; }, (_, ns) => { ns.find(n => tag(n) === 'title').title = [{ '#text': 'Changed' }]; }, (_, ns) => { ns.find(n => tag(n) === 'metadata').metadata = [{ '#text': '{}' }]; }, root => { root.svg.reverse(); }]) assert.throws(() => faithful(mutate(v, change)));
});
test('passive SVG validation rejects active markup, entities, URL paints, prototypes and malformed fields', () => {
  const v = variants[0];
  for (const type of ['script', 'foreignObject', 'image', 'use', 'a', 'style', 'animate', 'filter']) assert.throws(() => inspect(mutate(v, root => { root.svg.push({ [type]: [] }); })));
  for (const [field, val] of [['onload', 'alert(1)'], ['href', 'https://example.org/'], ['xlink:href', 'javascript:alert(1)'], ['constructor', 'x'], ['prototype', 'x'], ['transform', 'translate(0 0)'], ['style', 'fill:red'], ['font-size', 'Infinity'], ['x', '1e999'], ['x', '10001']]) assert.throws(() => inspect(mutate(v, (_, ns) => { attrs(ns.find(n => tag(n) === 'text'))[field] = val; })));
  for (const paint of ['url(#x)', 'url(https://example.org/x)', 'var(--color-ink, red)', '#0c0d10', 'red']) assert.throws(() => inspect(mutate(v, (_, ns) => { attrs(ns.find(n => tag(n) === 'rect')).fill = paint; })));
  assert.throws(() => inspect(mutate(v, (_, ns) => { attrs(ns.find(n => tag(n) === 'rect')).width = '-1'; })));
  for (const raw of ['<!DOCTYPE svg><svg/>', '<?xml version="1.0"?><svg/>', '<svg>&external;</svg>', '<svg>&#65;</svg>', '<svg><text></svg>', v.svg.replace('<text ', '<text __proto__="x" ')]) assert.throws(() => inspect({ ...v, svg: raw }));
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
// Read bounded sfnt names directly. The installed outline parser intentionally
// omits name records, and the source job must not depend on Python/fontTools.
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
    if ([1, 16].includes(record.id)) assert.equal(record.value, 'l0g A7 Sans');
    if ([2, 17].includes(record.id)) assert.equal(record.value, style);
    if ([3, 4, 18].includes(record.id)) assert.equal(record.value, `l0g A7 Sans ${style}`);
    if (record.id === 6) assert.equal(record.value, `l0gA7Sans-${style}`);
  }
}
test('redistributed font subsets retain copyrights and use the licensed derivative family name', () => {
  for (const weight of [400, 700]) {
    const subsetBytes = readFileSync(new URL(`../public/fonts/a7-payments/liberation-sans-${weight}.ttf`, import.meta.url));
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
  const licence = read('public/fonts/a7-payments/LICENSE.txt'); assertFontLicenseReferences(licence, 'liberation');
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
test('responsive component uses compact article proportions, charter tokens and dedicated fonts', () => {
  const component = read('src/components/A7PaymentsFigure.astro'), styles = component.match(/<style>([\s\S]*?)<\/style>/u); assert.ok(styles);
  const css = postcss.parse(styles[1]), declarations = n => Object.fromEntries(n.nodes.filter(d => d.type === 'decl').map(d => [d.prop, d.value]));
  const base = declarations(css.nodes.find(n => n.type === 'rule' && n.selector === '.a7-payments-figure'));
  assert.deepEqual([base.width, base['max-width'], base['container-type'], base['padding-bottom']], ['100%', '760px', 'inline-size', '.85rem']);
  assert.equal(base.overflow, 'visible');
  const graphic = declarations(css.nodes.find(n => n.type === 'rule' && n.selector === '.a7-payments-figure :global(svg)'));
  assert.deepEqual([graphic.width, graphic.height, graphic.overflow, graphic['letter-spacing']], ['100%', 'auto', 'visible', 'normal']);
  const labelFont = declarations(css.nodes.find(n => n.type === 'rule' && n.selector === '.a7-payments-figure :global(svg text)'));
  assert.equal(labelFont['font-family'], "'l0g A7 Payments', 'Liberation Sans', Arial, sans-serif");
  const mobile = declarations(css.nodes.find(n => n.type === 'rule' && n.selector === '.a7-payments-mobile'));
  assert.deepEqual([mobile.display, mobile.width, mobile['max-width'], mobile['margin-inline']], ['none', '100%', '400px', 'auto']);
  for (const kind of ['media', 'container']) {
    const rule = css.nodes.find(n => n.type === 'atrule' && n.name === kind && n.params === '(max-width: 640px)'); assert.ok(rule);
    assert.deepEqual(rule.nodes.map(n => [n.selector, declarations(n).display]), [['.a7-payments-desktop', 'none'], ['.a7-payments-mobile', 'block']]);
  }
  const faces = css.nodes.filter(n => n.type === 'atrule' && n.name === 'font-face').map(n => declarations(n));
  assert.deepEqual(faces.map(d => [d['font-family'], d.src, d['font-weight'], d['font-style']]), [400, 700].map(w => ["'l0g A7 Payments'", `url('/fonts/a7-payments/liberation-sans-${w}.ttf') format('truetype')`, String(w), 'normal']));
  assert.doesNotMatch(styles[1], /#(?:[a-f0-9]{3}){1,2}\b|(?:clip-path|overflow\s*:\s*hidden|transform\s*:|100vw)/iu);
  const themes = { dark: new Map(), light: new Map() };
  postcss.parse(read('src/styles/global.css')).walkDecls(d => { if (d.parent.type === 'atrule' && d.parent.name === 'theme') themes.dark.set(d.prop, d.value); if (d.parent.type === 'rule' && d.parent.selector === ':root[data-theme="light"]') themes.light.set(d.prop, d.value); });
  for (const theme of Object.values(themes)) for (const token of ['ink', 'paper', 'surface', 'surface-2', 'muted', 'signal', 'amber', 'accent', 'topic-blue', 'line-strong']) assert.ok(theme.has(`--color-${token}`));
});
const mdxNodes = n => [n, ...(n.children ?? []).flatMap(mdxNodes)];
const mdxText = n => n.type === 'text' ? n.value : (n.children ?? []).map(mdxText).join('');
const mdxBody = raw => raw.replace(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/u, '');
function articleFigures(raw, lang) {
  const tree = createProcessor().parse(mdxBody(raw));
  const figures = mdxNodes(tree).filter(n => n.name === 'A7PaymentsFigure'); assert.equal(figures.length, 6);
  for (const [i, figure] of figures.entries()) {
    assert.deepEqual(figure.attributes.map(a => a.name), ['lang', 'kind', 'number', 'sources', 'caption']);
    assert.ok(figure.attributes.every(a => a.type === 'mdxJsxAttribute'));
    const fields = Object.fromEntries(figure.attributes.map(a => [a.name, a.value]));
    assert.deepEqual(['lang', 'kind', 'number', 'sources'].map(k => fields[k]), [lang, kinds[i], String(i + 1).padStart(2, '0'), figureSources[kinds[i]].join(' ')]);
    const caption = fields.caption;
    if (typeof caption === 'string') assert.ok(caption.length > 100);
    else {
      assert.equal(caption.type, 'mdxJsxAttributeValueExpression');
      const program = caption.data.estree; assert.equal(program.type, 'Program'); assert.equal(program.body.length, 1);
      const expression = program.body[0]; assert.equal(expression.type, 'ExpressionStatement'); assert.equal(expression.expression.type, 'Literal');
      assert.equal(typeof expression.expression.value, 'string'); assert.ok(expression.expression.value.length > 100);
    }
    const details = mdxNodes(figure).filter(n => n.name === 'details'); assert.equal(details.length, 1);
    assert.equal(mdxNodes(details[0]).filter(n => n.name === 'summary').length, 1); assert.ok(mdxText(details[0]).length > 150);
  }
  const headings = mdxNodes(tree).filter(n => n.type === 'heading').map(mdxText);
  for (const title of headings) assert.doesNotMatch(title, /ce qu[ei’']|ce qui|ce que|what .*(?:reveals|means)|what happens behind|, (?:pas|not) /iu);
  assert.doesNotMatch(raw, /horloges|clocks|—/iu);
}
test('six article figures per language preserve native MDX order, static captions, references and method notes', () => {
  for (const { lang, raw } of articles()) articleFigures(raw, lang);
});
test('article figure contracts reject wrong kinds, source references and executable captions', () => {
  const raw = mdxBody(articles()[0].raw);
  for (const [a, b] of [['kind="mirror"', 'kind="liquidity"'], ['number="01"', 'number="06"'], ['sources="1 2 5"', 'sources="1 2 99"'], ['lang="fr"', 'lang="en"']]) assert.throws(() => articleFigures(raw.replace(a, b), 'fr'));
  const first = mdxNodes(createProcessor().parse(raw)).find(n => n.name === 'A7PaymentsFigure');
  const attribute = first.attributes.find(a=>a.name==='caption');
  const invalid = raw.slice(0, attribute.position.start.offset) + 'caption={process.env.SECRET}' + raw.slice(attribute.position.end.offset);
  assert.throws(() => articleFigures(invalid, 'fr'));
});


function quantitativeGeometry(v) {
  const { nodes } = inspect(v), labels = nodes.filter(n => tag(n) === 'text').map(xmlText);
  const meta = JSON.parse(xmlText(nodes.find(n => tag(n) === 'metadata')));
  if (v.kind === 'activity') {
    assert.equal(meta.status, 'published-measurement');
    assert.deepEqual(meta.sources, ['https://www.elliptic.co/insights/the-fall-of-a7a5-how-sanctions-strangled-the-ruble-stablecoin/']);
    const bars = nodes.filter(n => tag(n) === 'rect' && value(n, 'rx') === 0 && ['var(--color-topic-blue, #7aa2f7)', 'var(--color-signal, #5eead4)'].includes(attrs(n).fill));
    assert.equal(bars.length, 2); assert.equal(value(bars[0], 'x'), value(bars[1], 'x'));
    assert.equal(value(bars[0], 'height'), value(bars[1], 'height'));
    assert.ok(Math.abs(value(bars[1], 'width') / value(bars[0], 'width') - (1 - .96)) < 1e-12, 'Rounded base-100 index equals approximately four');
    const ticks = nodes.filter(n => tag(n) === 'line' && value(n, 'x1') === value(n, 'x2'));
    assert.equal(ticks.length, 5);
    assert.equal(value(ticks[0], 'x1'), value(bars[0], 'x'), 'Scale starts at zero');
    assert.equal(value(ticks.at(-1), 'x1'), value(bars[0], 'x') + value(bars[0], 'width'), 'Scale ends at 100');
    for (const [i, tick] of ticks.entries()) assert.equal(value(tick, 'x1'), value(bars[0], 'x') + value(bars[0], 'width') * i / 4);
    assert.ok(labels.includes('≈ 4') && labels.includes(v.lang === 'fr' ? '−96 %' : '−96%'));
    assert.match(meta.method, /July 2025|juillet 2025/u); assert.ok(labels.includes(v.lang === 'fr' ? 'Juin 2026' : 'June 2026'));
    assert.match(meta.method, /rounded|arrondi/u); assert.match(meta.method, /October|octobre/u);
  }
  if (v.kind === 'liquidity') {
    assert.equal(meta.status, 'hypothetical');
    const units = nodes.filter(n => tag(n) === 'rect' && value(n, 'rx') === 2);
    const short = units.filter(n => attrs(n).fill === 'var(--color-topic-blue, #7aa2f7)');
    const long = units.filter(n => attrs(n).fill === 'var(--color-amber, #f5b13d)');
    assert.equal(short.length, 2); assert.equal(long.length, 8); assert.equal(units.length, 10);
    assert.equal(new Set(units.map(n => `${value(n, 'x')},${value(n, 'y')}`)).size, 10);
    assert.equal(new Set(units.map(n => `${value(n, 'width')},${value(n, 'height')}`)).size, 1, 'Equal units use equal area');
    assert.equal(labels.filter(label => label === '10').length, units.length);
    assert.ok(labels.includes('+60')); assert.equal((long.length - short.length) * 10, 60);
    assert.match(meta.method, /fictifs|fictional/u); assert.match(meta.method, /perte|loss|défaut|default/u);
  }
  if (v.kind === 'turnover') {
    assert.equal(meta.status, 'hypothetical');
    const accounts = nodes.filter(n => tag(n) === 'circle'); assert.equal(accounts.length, 4);
    assert.deepEqual(labels.filter(label => ['A', 'B', 'C', 'D'].includes(label)).sort(), ['A', 'B', 'C', 'D']);
    assert.ok(labels.includes('4 × 100') && labels.includes('= 400'));
    assert.match(meta.method, /fictional|fictifs/u); assert.match(meta.method, /4 × 100 = 400/u);
    assert.match(meta.method, /ni une estimation|neither an estimate/u);
  }
}
test('published activity keeps a zero-based common scale and toy figures keep their explicit hypothetical status', () => {
  for (const v of variants) quantitativeGeometry(v);
});
test('quantitative guards reject changed bar scales, dates, fictional scope and liquidity block counts', () => {
  for (const v of variants.filter(v => v.kind === 'activity')) {
    assert.throws(() => quantitativeGeometry(mutate(v, (_, ns) => { attrs(ns.find(n => tag(n) === 'rect' && attrs(n).fill === 'var(--color-signal, #5eead4)')).width = '100'; })));
    assert.throws(() => quantitativeGeometry(mutate(v, (_, ns) => { const n = ns.find(n => tag(n) === 'metadata'), meta = JSON.parse(xmlText(n)); meta.method = ''; n.metadata = [{ '#text': JSON.stringify(meta) }]; })));
  }
  for (const v of variants.filter(v => v.kind === 'liquidity')) {
    assert.throws(() => quantitativeGeometry(mutate(v, root => { const i = root.svg.findIndex(n => tag(n) === 'rect' && attrs(n).fill === 'var(--color-amber, #f5b13d)'); root.svg.splice(i, 1); })));
    assert.throws(() => quantitativeGeometry(mutate(v, (_, ns) => { const n = ns.find(n => tag(n) === 'metadata'), meta = JSON.parse(xmlText(n)); meta.status = 'published-measurement'; n.metadata = [{ '#text': JSON.stringify(meta) }]; })));
  }
});
