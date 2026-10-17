import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { XMLBuilder, XMLParser, XMLValidator } from 'fast-xml-parser';
import { parse } from 'parse5';
import { createProcessor } from '@mdx-js/mdx';
import postcss from 'postcss';
import { starshieldSvg, STARSHIELD_KINDS } from '../src/lib/starshieldFigures.mjs';

const read = file => readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
const digest = value => createHash('sha256').update(value).digest('hex');
// Independent complete supplied XML, browser DOM and attribute-tree goldens.
const originals={
  "metrics-fr-desktop": {
    "rawHash": "8e047c350cd7f56b3b5519e29023b3ad11182f763db7ec2d422039214258fabd",
    "domHash": "eed23d4f629dbe68d480af5a6b8bfa26cc358a98079b50ea7aa73eac211a2190",
    "geometryHash": "6adfc587139386bb141053df19c5367a45808dd69216cb16f2d0c3d759d2b3de",
    "viewBox": "0 0 1200 700"
  },
  "metrics-fr-mobile": {
    "rawHash": "8b4e564e9d24846fc8156ee2ef95e1d33fa069cbc862dcc18951d8ed4924c0d6",
    "domHash": "a5157962a4afcb92c183f4e0fbfa02fc2a39ddbf1f4439a9356b477d9d6cb7f6",
    "geometryHash": "1420d9fefa8a5b388696c77c934f21443da0ac8f324b134e63964711e1060a00",
    "viewBox": "0 0 480 1280"
  },
  "permissions-fr-desktop": {
    "rawHash": "b2c83bb8d8a229ff00ed833fd3d26fcdc87dce7a0e2560197106749037cd74eb",
    "domHash": "9f13aec9f5ab05166f7b6970fa20ff88c196d470cc68b97b5092771fb48e3c8c",
    "geometryHash": "a28c6ed9a995d35f462fd79a1356b8542dc59d9de7c183118d619cca7b59702e",
    "viewBox": "0 0 1200 820"
  },
  "permissions-fr-mobile": {
    "rawHash": "618dda05537a4ec468e1bb10132380ee4e99d3b2287bc820bd52dd6fa5ff1715",
    "domHash": "e0fb3145e06abb66fbec69de893e22b3c677b22c54b0d78eef98d33f5281f0a9",
    "geometryHash": "c1cd5ddb173c1eb400a24c39ccadb862a0759385e0e564c61cafc39040761736",
    "viewBox": "0 0 480 1110"
  },
  "chronology-fr-desktop": {
    "rawHash": "12c20ec46d0ec646a5152ffb428510774c052a879533af1fb4bb03df91702ec5",
    "domHash": "fc032ecdce29106dca12d29db4ddb71ff76adb3afe02ee3f72d6c1022b4354fc",
    "geometryHash": "c89a37ea8b7ea3f9148971294d3a089412b363872998d122df5f4820e15043ee",
    "viewBox": "0 0 1200 920"
  },
  "chronology-fr-mobile": {
    "rawHash": "4905ecbda69e72289d81c2c7c4b59b33996a2a502a045d57761ea84f358530ca",
    "domHash": "ae040872cee5015f9f33b6a8490486909910c047d9bafff9587e5f7b358218bb",
    "geometryHash": "aec84c4b3eaf901302cb1a0837959fe06d826c03b6f67ad7b6f85dc226e4e266",
    "viewBox": "0 0 480 1330"
  },
  "dependency-fr-desktop": {
    "rawHash": "d662492c6d5e1188b0d35db766c53ce88fe2ddebe298d9a2e2b093cdd0e42430",
    "domHash": "ecbe4e22ca7c384cddb22bea3bb71a3c8a842c5dd78493e9fb1bef3cf59532d5",
    "geometryHash": "70b31659512aeb6aedc643cb76350d0cb1a497145e2df23bc9a18f9abf151b5a",
    "viewBox": "0 0 1200 875"
  },
  "dependency-fr-mobile": {
    "rawHash": "eb58c7e3cd61c4e5a877b51e1f730cf65506568baa74bb7b17108b6a74998a95",
    "domHash": "c403a295dbf9335804d20708f563af35d559d36903651c4adc00eda311364d2c",
    "geometryHash": "7a57c2f84f4a85332fb02dcc2a913ed3c4cdd1d4794609fe04a1a071e189ffeb",
    "viewBox": "0 0 480 1550"
  },
  "capacity-fr-desktop": {
    "rawHash": "b2c0c9f5bf68695fb2f4155dae55c837c8165d82a89d629e2b738f7b0b6efd73",
    "domHash": "6c133fb4fa5f192e0aa34d4f6821c82f81a26383e5c325f38ebfcdb1a2df3592",
    "geometryHash": "06c925c68738b3d7610d45acaf6b7208944dd2dff02ef2f9ab4413cc5a546b33",
    "viewBox": "0 0 1200 830"
  },
  "capacity-fr-mobile": {
    "rawHash": "ce602cfd81e532df62e25a61c4e35897a4b642ea4b6d11fe297ffb596f60349d",
    "domHash": "718d164cdd6a73917aeda0072322535c6e1daee98259f3a72b9714c94be941ff",
    "geometryHash": "09c85efa3c4ca5ea14b22259f93f066d70c7d5c2ccf4bd7924ff7b3774f95daf",
    "viewBox": "0 0 480 1140"
  },
  "milestones-fr-desktop": {
    "rawHash": "420149ad6d98c837fd7ad9697ed88de240560b374a12aa348e1508ad6a70d9cc",
    "domHash": "1895e40741d281ad40dc8f7834037f99e4d9505c379dd4c73fe1e9a433f8e5ac",
    "geometryHash": "1da2a958da3ae3a9ed9cd9f80464baf62ad22da136999340281134c3ff2ac17e",
    "viewBox": "0 0 1200 960"
  },
  "milestones-fr-mobile": {
    "rawHash": "69fbbdcbc47f5cd6c969828dda6349db0444dc25fb28c9604b9b6d6d331727a4",
    "domHash": "cecefe49a278865563453dae85f6f7494560234edd8a4b1eeeba4655056056af",
    "geometryHash": "099140e417c64ae82f91e2a12bcfe71d7c0bc7841a9c02c57b11d27da948dc55",
    "viewBox": "0 0 480 1360"
  },
  "metrics-en-desktop": {
    "rawHash": "2638b147a831185d27d946cb284d32f548975fad0c61c75a00236d034f642cdd",
    "domHash": "0da2da6a52433f2149c953c082d66167eb1c63282f4c9552daa9dc3f18261ea3",
    "geometryHash": "bdf5839d93068aa84af977b6c6dbbcdd7b502702c45bef740a8c7b7f61674646",
    "viewBox": "0 0 1200 700"
  },
  "metrics-en-mobile": {
    "rawHash": "3e72e04a017013a3696dea7d4ff5cdc75d9185dafa6142b5364383896cc7eabc",
    "domHash": "9b40b1cfff9997a70f2570c8d105b3b910791a88ba21982bff330040b4908fef",
    "geometryHash": "ed12982404a8c2ac75badb9a9dbe9230e126bf1f42c80e5dcd99f197c3dffa00",
    "viewBox": "0 0 480 1280"
  },
  "permissions-en-desktop": {
    "rawHash": "11307d2f67428ebae17e8a07d7feb1bc91c6e641603159280b874f3d9f8c052f",
    "domHash": "5459b8703037714852ea2bd3d44aecca15f76006be339ed44a334a25780423f3",
    "geometryHash": "a17f6177000b7f72974034f39cfb7ebdf0399ea374ec42d44ba11c70583f9b89",
    "viewBox": "0 0 1200 820"
  },
  "permissions-en-mobile": {
    "rawHash": "6edc433944bcecb2cec37a50aff528ea35da7b774d6ba1e7205a9322240e4d63",
    "domHash": "dc5be7083d5b07d1e1a405a5aa304708b0130f30848ac45cb0b3cef0c30d49b8",
    "geometryHash": "1b6c245b779034dae34ac9188eacc378b884ea09f21d320a8a0cbe49186b1b2f",
    "viewBox": "0 0 480 1110"
  },
  "chronology-en-desktop": {
    "rawHash": "c46f77a46cba4dba4a396cb9a28765db4e2f637b1a363a2922f711d55f412c04",
    "domHash": "cdfb58b00ad593ff590adee2df7d37b66624b45b2995c6bbede6d87f5518615e",
    "geometryHash": "eccf0b16dbfe06fac990430bf28d41f4d693c4663dfb285554c41b3fecaf776a",
    "viewBox": "0 0 1200 920"
  },
  "chronology-en-mobile": {
    "rawHash": "06e76a658900fae0e169a14183228fca08e23fda46eb8dc93f05a07c82003b1d",
    "domHash": "b0f910c9e1b5580cc71ad7d978aee6d9efa91f9fecc508196b6e2240233fcaec",
    "geometryHash": "4a955817a0efc93b41d3de247335d532f3d936ede7afe52599a25590764ef8cc",
    "viewBox": "0 0 480 1330"
  },
  "dependency-en-desktop": {
    "rawHash": "961df55a2568c8970a30305dca3204f81b6f296ec2a5c5bc02ff7d7fe0314021",
    "domHash": "650d37394f66b447b92f0dfd20518a12e56fe7c8065fb931846ce14cf735c4e5",
    "geometryHash": "3aff5594c1769789bb85b2b5cbc2cb44ef6f7564abb2cb91245d3637066a78b3",
    "viewBox": "0 0 1200 875"
  },
  "dependency-en-mobile": {
    "rawHash": "5bc988ae95f7730cc3c898655f2bb59c435f2c6bf865bdeec2e448fa3d239894",
    "domHash": "c8f2e5f00afaf768934100bd3560f06ae769bd833f7998b8494811d8af4dcaef",
    "geometryHash": "5f517b963a58eb90b04f7a188522e635d5d417441316c1190ae4eb6b9bcbaf8a",
    "viewBox": "0 0 480 1550"
  },
  "capacity-en-desktop": {
    "rawHash": "0cb908f75c527674f79e8071e5efccc1204c846bc6c2c9a5d15fbfc0fa48f824",
    "domHash": "906a3256eceba013bc93babd5ab29a55558da4a8064c225e3f16ce0b5463eba5",
    "geometryHash": "83a48f06645b61def82d13198978124b5111c9425545b17e6bda0c87eb91978e",
    "viewBox": "0 0 1200 830"
  },
  "capacity-en-mobile": {
    "rawHash": "e60d6ba437eaffd4f91077da27005b7b24b47dab50ceca702e02c2683d7fc758",
    "domHash": "c65e089459b86a8161cca162cbfa513b33da8664e253965c3f919c9533f074f0",
    "geometryHash": "ae3cca1299ec5c62609597779024269cb222e8e7290733de228a56c93de98d89",
    "viewBox": "0 0 480 1140"
  },
  "milestones-en-desktop": {
    "rawHash": "5f2bf223f25aa08aec89a32f7fd8fd71616363a113a3c2bfea7edcd9efa64302",
    "domHash": "0c5e23cca36d2fdeb670b6a5dc40655808e06259311b61eb35df2d6afd35a4b7",
    "geometryHash": "cc80f5b0177e92eadbec4b7550f03de3e8894c6c09b0e283882b071aea851ea6",
    "viewBox": "0 0 1200 960"
  },
  "milestones-en-mobile": {
    "rawHash": "383713f7cfe9795b04cf2b69eab640e3b0ec8e9b6cb4a162053e67ebfe4f8b03",
    "domHash": "23bb44f4c5ef1c7ea1cc07d270548b0ecfc45757694d02315fc7ca4f703799db",
    "geometryHash": "d0e35adc19991317751d85db89e52df10ebce56a3326559b22708dd4707f1ec7",
    "viewBox": "0 0 480 1360"
  }
};
const textCorrections={
  "chronology-fr-desktop": {
    "pairs": [
      [
        "<metadata>{&quot;as_of&quot;: &quot;2026-10-17&quot;, &quot;sources&quot;: [{&quot;id&quot;: &quot;S01&quot;, &quot;organisation&quot;: &quot;The Kyiv Independent&quot;, &quot;url&quot;: &quot;https://kyivindependent.com/breaking-starlink-service-in-ukraine-restored-defense-ministry-source-says/&quot;, &quot;publication_date&quot;: &quot;2026-10-15&quot;}, {&quot;id&quot;: &quot;S02&quot;, &quot;organisation&quot;: &quot;Reuters&quot;, &quot;url&quot;: &quot;https://www.reuters.com/world/europe/order-limit-starshield-ukraine-came-inside-white-house-sources-say-2026-10-15/&quot;, &quot;publication_date&quot;: &quot;2026-10-15&quot;}, {&quot;id&quot;: &quot;S03&quot;, &quot;organisation&quot;: &quot;Reuters&quot;, &quot;url&quot;: &quot;https://www.reuters.com/world/europe/trump-says-neither-he-nor-musk-responsible-ukraine-starlink-access-2026-10-16/&quot;, &quot;publication_date&quot;: &quot;2026-10-16T17:29:00Z&quot;}, {&quot;id&quot;: &quot;S04&quot;, &quot;organisation&quot;: &quot;Reuters&quot;, &quot;url&quot;: &quot;https://www.reuters.com/business/aerospace-defense/starlink-disruptions-are-being-felt-front-lines-ukraine-2026-10-16/&quot;, &quot;publication_date&quot;: &quot;2026-10-16&quot;}, {&quot;id&quot;: &quot;S05&quot;, &quot;organisation&quot;: &quot;U.S. Senate, Foreign Relations Committee&quot;, &quot;url&quot;: &quot;https://www.foreign.senate.gov/press/dem/release/shaheen-tillis-lead-bipartisan-senators-in-calling-for-department-of-defense-inspector-general-investigation-into-starlink-disruptions-in-ukraine&quot;, &quot;publication_date&quot;: &quot;2026-10-15&quot;}, {&quot;id&quot;: &quot;S06&quot;, &quot;organisation&quot;: &quot;U.S. Senate&quot;, &quot;url&quot;: &quot;https://www.foreign.senate.gov/download/letter-to-dodig-re-starlink-over-ukraine_-final-signed&quot;, &quot;publication_date&quot;: &quot;2026-10-15&quot;}, {&quot;id&quot;: &quot;S08&quot;, &quot;organisation&quot;: &quot;UNN&quot;, &quot;url&quot;: &quot;https://unn.ua/en/news/ukraine-awaits-confirmation-from-the-pentagon-and-spacex-regarding-the-restoration-of-starshield&quot;, &quot;publication_date&quot;: &quot;2026-10-17&quot;}], &quot;scope&quot;: &quot;Signalements du 14 au 17 octobre 2026 : reprise annoncée, restrictions attribuées puis démenties, confirmation complète encore attendue. Les affirmations ne sont pas des mesures réseau.&quot;}</metadata>",
        "<metadata>{&quot;as_of&quot;: &quot;2026-10-17&quot;, &quot;sources&quot;: [{&quot;id&quot;: &quot;S01&quot;, &quot;organisation&quot;: &quot;The Kyiv Independent&quot;, &quot;url&quot;: &quot;https://kyivindependent.com/breaking-starlink-service-in-ukraine-restored-defense-ministry-source-says/&quot;, &quot;publication_date&quot;: &quot;2026-10-15&quot;}, {&quot;id&quot;: &quot;S02&quot;, &quot;organisation&quot;: &quot;Reuters&quot;, &quot;url&quot;: &quot;https://www.reuters.com/world/europe/order-limit-starshield-ukraine-came-inside-white-house-sources-say-2026-10-15/&quot;, &quot;publication_date&quot;: &quot;2026-10-15&quot;}, {&quot;id&quot;: &quot;S03&quot;, &quot;organisation&quot;: &quot;Reuters&quot;, &quot;url&quot;: &quot;https://www.reuters.com/world/europe/trump-says-neither-he-nor-musk-responsible-ukraine-starlink-access-2026-10-16/&quot;, &quot;publication_date&quot;: &quot;2026-10-16&quot;}, {&quot;id&quot;: &quot;S04&quot;, &quot;organisation&quot;: &quot;Reuters&quot;, &quot;url&quot;: &quot;https://www.reuters.com/business/aerospace-defense/starlink-disruptions-are-being-felt-front-lines-ukraine-2026-10-16/&quot;, &quot;publication_date&quot;: &quot;2026-10-16&quot;}, {&quot;id&quot;: &quot;S05&quot;, &quot;organisation&quot;: &quot;U.S. Senate, Foreign Relations Committee&quot;, &quot;url&quot;: &quot;https://www.foreign.senate.gov/press/dem/release/shaheen-tillis-lead-bipartisan-senators-in-calling-for-department-of-defense-inspector-general-investigation-into-starlink-disruptions-in-ukraine&quot;, &quot;publication_date&quot;: &quot;2026-10-15&quot;}, {&quot;id&quot;: &quot;S06&quot;, &quot;organisation&quot;: &quot;U.S. Senate&quot;, &quot;url&quot;: &quot;https://www.foreign.senate.gov/download/letter-to-dodig-re-starlink-over-ukraine_-final-signed&quot;, &quot;publication_date&quot;: &quot;2026-10-15&quot;}, {&quot;id&quot;: &quot;S08&quot;, &quot;organisation&quot;: &quot;UNN&quot;, &quot;url&quot;: &quot;https://unn.ua/en/news/ukraine-awaits-confirmation-from-the-pentagon-and-spacex-regarding-the-restoration-of-starshield&quot;, &quot;publication_date&quot;: &quot;2026-10-17&quot;}], &quot;scope&quot;: &quot;Signalements du 14 au 17 octobre 2026 : reprise annoncée, restrictions attribuées puis démenties, confirmation complète encore attendue. Les affirmations ne sont pas des mesures réseau.&quot;}</metadata>",
        1
      ]
    ],
    "expectedHash": "628152cca453ac27613bf44ddd86a0d483b7249e0b74ec9014ebc516049e010b",
    "expectedDomHash": "d67fb45e93f6739127218ae5aa55de25ca636148083b014a9c63b29d47955fdc"
  },
  "chronology-fr-mobile": {
    "pairs": [
      [
        "<metadata>{&quot;as_of&quot;: &quot;2026-10-17&quot;, &quot;sources&quot;: [{&quot;id&quot;: &quot;S01&quot;, &quot;organisation&quot;: &quot;The Kyiv Independent&quot;, &quot;url&quot;: &quot;https://kyivindependent.com/breaking-starlink-service-in-ukraine-restored-defense-ministry-source-says/&quot;, &quot;publication_date&quot;: &quot;2026-10-15&quot;}, {&quot;id&quot;: &quot;S02&quot;, &quot;organisation&quot;: &quot;Reuters&quot;, &quot;url&quot;: &quot;https://www.reuters.com/world/europe/order-limit-starshield-ukraine-came-inside-white-house-sources-say-2026-10-15/&quot;, &quot;publication_date&quot;: &quot;2026-10-15&quot;}, {&quot;id&quot;: &quot;S03&quot;, &quot;organisation&quot;: &quot;Reuters&quot;, &quot;url&quot;: &quot;https://www.reuters.com/world/europe/trump-says-neither-he-nor-musk-responsible-ukraine-starlink-access-2026-10-16/&quot;, &quot;publication_date&quot;: &quot;2026-10-16T17:29:00Z&quot;}, {&quot;id&quot;: &quot;S04&quot;, &quot;organisation&quot;: &quot;Reuters&quot;, &quot;url&quot;: &quot;https://www.reuters.com/business/aerospace-defense/starlink-disruptions-are-being-felt-front-lines-ukraine-2026-10-16/&quot;, &quot;publication_date&quot;: &quot;2026-10-16&quot;}, {&quot;id&quot;: &quot;S05&quot;, &quot;organisation&quot;: &quot;U.S. Senate, Foreign Relations Committee&quot;, &quot;url&quot;: &quot;https://www.foreign.senate.gov/press/dem/release/shaheen-tillis-lead-bipartisan-senators-in-calling-for-department-of-defense-inspector-general-investigation-into-starlink-disruptions-in-ukraine&quot;, &quot;publication_date&quot;: &quot;2026-10-15&quot;}, {&quot;id&quot;: &quot;S06&quot;, &quot;organisation&quot;: &quot;U.S. Senate&quot;, &quot;url&quot;: &quot;https://www.foreign.senate.gov/download/letter-to-dodig-re-starlink-over-ukraine_-final-signed&quot;, &quot;publication_date&quot;: &quot;2026-10-15&quot;}, {&quot;id&quot;: &quot;S08&quot;, &quot;organisation&quot;: &quot;UNN&quot;, &quot;url&quot;: &quot;https://unn.ua/en/news/ukraine-awaits-confirmation-from-the-pentagon-and-spacex-regarding-the-restoration-of-starshield&quot;, &quot;publication_date&quot;: &quot;2026-10-17&quot;}], &quot;scope&quot;: &quot;Signalements du 14 au 17 octobre 2026 : reprise annoncée, restrictions attribuées puis démenties, confirmation complète encore attendue. Les affirmations ne sont pas des mesures réseau.&quot;}</metadata>",
        "<metadata>{&quot;as_of&quot;: &quot;2026-10-17&quot;, &quot;sources&quot;: [{&quot;id&quot;: &quot;S01&quot;, &quot;organisation&quot;: &quot;The Kyiv Independent&quot;, &quot;url&quot;: &quot;https://kyivindependent.com/breaking-starlink-service-in-ukraine-restored-defense-ministry-source-says/&quot;, &quot;publication_date&quot;: &quot;2026-10-15&quot;}, {&quot;id&quot;: &quot;S02&quot;, &quot;organisation&quot;: &quot;Reuters&quot;, &quot;url&quot;: &quot;https://www.reuters.com/world/europe/order-limit-starshield-ukraine-came-inside-white-house-sources-say-2026-10-15/&quot;, &quot;publication_date&quot;: &quot;2026-10-15&quot;}, {&quot;id&quot;: &quot;S03&quot;, &quot;organisation&quot;: &quot;Reuters&quot;, &quot;url&quot;: &quot;https://www.reuters.com/world/europe/trump-says-neither-he-nor-musk-responsible-ukraine-starlink-access-2026-10-16/&quot;, &quot;publication_date&quot;: &quot;2026-10-16&quot;}, {&quot;id&quot;: &quot;S04&quot;, &quot;organisation&quot;: &quot;Reuters&quot;, &quot;url&quot;: &quot;https://www.reuters.com/business/aerospace-defense/starlink-disruptions-are-being-felt-front-lines-ukraine-2026-10-16/&quot;, &quot;publication_date&quot;: &quot;2026-10-16&quot;}, {&quot;id&quot;: &quot;S05&quot;, &quot;organisation&quot;: &quot;U.S. Senate, Foreign Relations Committee&quot;, &quot;url&quot;: &quot;https://www.foreign.senate.gov/press/dem/release/shaheen-tillis-lead-bipartisan-senators-in-calling-for-department-of-defense-inspector-general-investigation-into-starlink-disruptions-in-ukraine&quot;, &quot;publication_date&quot;: &quot;2026-10-15&quot;}, {&quot;id&quot;: &quot;S06&quot;, &quot;organisation&quot;: &quot;U.S. Senate&quot;, &quot;url&quot;: &quot;https://www.foreign.senate.gov/download/letter-to-dodig-re-starlink-over-ukraine_-final-signed&quot;, &quot;publication_date&quot;: &quot;2026-10-15&quot;}, {&quot;id&quot;: &quot;S08&quot;, &quot;organisation&quot;: &quot;UNN&quot;, &quot;url&quot;: &quot;https://unn.ua/en/news/ukraine-awaits-confirmation-from-the-pentagon-and-spacex-regarding-the-restoration-of-starshield&quot;, &quot;publication_date&quot;: &quot;2026-10-17&quot;}], &quot;scope&quot;: &quot;Signalements du 14 au 17 octobre 2026 : reprise annoncée, restrictions attribuées puis démenties, confirmation complète encore attendue. Les affirmations ne sont pas des mesures réseau.&quot;}</metadata>",
        1
      ]
    ],
    "expectedHash": "41587bbc04a804a1f49b75a396c5257c27555747ccd8f93820935934676c5c17",
    "expectedDomHash": "a30ae43e8a028f50f982ab68cb020d0db571761aa20e61b0e2ebbcee9a52d457"
  },
  "capacity-fr-desktop": {
    "pairs": [
      [
        "<text x=\"65\" y=\"533.0\" fill=\"#f0f5fa\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"26\" font-weight=\"700\" text-anchor=\"start\">Ce que la capacité doit définir</text>",
        "<text x=\"65\" y=\"533.0\" fill=\"#f0f5fa\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"26\" font-weight=\"700\" text-anchor=\"start\">Les clauses de capacité</text>",
        1
      ]
    ],
    "expectedHash": "e9e9880f6c54018fa19848bf78db644a9e7b718e2ef4ad31bb4e51aca4c99276",
    "expectedDomHash": "74da387baaf7c5243520d8ee5b72198672cfa48cb83b3f22fc2f128551bdbe5e"
  },
  "capacity-fr-mobile": {
    "pairs": [
      [
        "<text x=\"30\" y=\"699.0\" fill=\"#f0f5fa\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"26\" font-weight=\"700\" text-anchor=\"start\">Ce que la capacité doit définir</text>",
        "<text x=\"30\" y=\"699.0\" fill=\"#f0f5fa\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"26\" font-weight=\"700\" text-anchor=\"start\">Les clauses de capacité</text>",
        1
      ]
    ],
    "expectedHash": "fd523868b31a0a998061d98480d4af9b2af8abe0317bbde0573cabd1235f4b40",
    "expectedDomHash": "a2f996555f57ec196560e2e135326a546f6904d7b5ff1183ce4a585c02e2c266"
  },
  "chronology-en-desktop": {
    "pairs": [
      [
        "<metadata>{&quot;as_of&quot;: &quot;2026-10-17&quot;, &quot;sources&quot;: [{&quot;id&quot;: &quot;S01&quot;, &quot;organisation&quot;: &quot;The Kyiv Independent&quot;, &quot;url&quot;: &quot;https://kyivindependent.com/breaking-starlink-service-in-ukraine-restored-defense-ministry-source-says/&quot;, &quot;publication_date&quot;: &quot;2026-10-15&quot;}, {&quot;id&quot;: &quot;S02&quot;, &quot;organisation&quot;: &quot;Reuters&quot;, &quot;url&quot;: &quot;https://www.reuters.com/world/europe/order-limit-starshield-ukraine-came-inside-white-house-sources-say-2026-10-15/&quot;, &quot;publication_date&quot;: &quot;2026-10-15&quot;}, {&quot;id&quot;: &quot;S03&quot;, &quot;organisation&quot;: &quot;Reuters&quot;, &quot;url&quot;: &quot;https://www.reuters.com/world/europe/trump-says-neither-he-nor-musk-responsible-ukraine-starlink-access-2026-10-16/&quot;, &quot;publication_date&quot;: &quot;2026-10-16T17:29:00Z&quot;}, {&quot;id&quot;: &quot;S04&quot;, &quot;organisation&quot;: &quot;Reuters&quot;, &quot;url&quot;: &quot;https://www.reuters.com/business/aerospace-defense/starlink-disruptions-are-being-felt-front-lines-ukraine-2026-10-16/&quot;, &quot;publication_date&quot;: &quot;2026-10-16&quot;}, {&quot;id&quot;: &quot;S05&quot;, &quot;organisation&quot;: &quot;U.S. Senate, Foreign Relations Committee&quot;, &quot;url&quot;: &quot;https://www.foreign.senate.gov/press/dem/release/shaheen-tillis-lead-bipartisan-senators-in-calling-for-department-of-defense-inspector-general-investigation-into-starlink-disruptions-in-ukraine&quot;, &quot;publication_date&quot;: &quot;2026-10-15&quot;}, {&quot;id&quot;: &quot;S06&quot;, &quot;organisation&quot;: &quot;U.S. Senate&quot;, &quot;url&quot;: &quot;https://www.foreign.senate.gov/download/letter-to-dodig-re-starlink-over-ukraine_-final-signed&quot;, &quot;publication_date&quot;: &quot;2026-10-15&quot;}, {&quot;id&quot;: &quot;S08&quot;, &quot;organisation&quot;: &quot;UNN&quot;, &quot;url&quot;: &quot;https://unn.ua/en/news/ukraine-awaits-confirmation-from-the-pentagon-and-spacex-regarding-the-restoration-of-starshield&quot;, &quot;publication_date&quot;: &quot;2026-10-17&quot;}], &quot;scope&quot;: &quot;Reports dated 14–17 October 2026: restoration claims, conflicting accounts of responsibility and confirmation still awaited. Statements are not network measurements.&quot;}</metadata>",
        "<metadata>{&quot;as_of&quot;: &quot;2026-10-17&quot;, &quot;sources&quot;: [{&quot;id&quot;: &quot;S01&quot;, &quot;organisation&quot;: &quot;The Kyiv Independent&quot;, &quot;url&quot;: &quot;https://kyivindependent.com/breaking-starlink-service-in-ukraine-restored-defense-ministry-source-says/&quot;, &quot;publication_date&quot;: &quot;2026-10-15&quot;}, {&quot;id&quot;: &quot;S02&quot;, &quot;organisation&quot;: &quot;Reuters&quot;, &quot;url&quot;: &quot;https://www.reuters.com/world/europe/order-limit-starshield-ukraine-came-inside-white-house-sources-say-2026-10-15/&quot;, &quot;publication_date&quot;: &quot;2026-10-15&quot;}, {&quot;id&quot;: &quot;S03&quot;, &quot;organisation&quot;: &quot;Reuters&quot;, &quot;url&quot;: &quot;https://www.reuters.com/world/europe/trump-says-neither-he-nor-musk-responsible-ukraine-starlink-access-2026-10-16/&quot;, &quot;publication_date&quot;: &quot;2026-10-16&quot;}, {&quot;id&quot;: &quot;S04&quot;, &quot;organisation&quot;: &quot;Reuters&quot;, &quot;url&quot;: &quot;https://www.reuters.com/business/aerospace-defense/starlink-disruptions-are-being-felt-front-lines-ukraine-2026-10-16/&quot;, &quot;publication_date&quot;: &quot;2026-10-16&quot;}, {&quot;id&quot;: &quot;S05&quot;, &quot;organisation&quot;: &quot;U.S. Senate, Foreign Relations Committee&quot;, &quot;url&quot;: &quot;https://www.foreign.senate.gov/press/dem/release/shaheen-tillis-lead-bipartisan-senators-in-calling-for-department-of-defense-inspector-general-investigation-into-starlink-disruptions-in-ukraine&quot;, &quot;publication_date&quot;: &quot;2026-10-15&quot;}, {&quot;id&quot;: &quot;S06&quot;, &quot;organisation&quot;: &quot;U.S. Senate&quot;, &quot;url&quot;: &quot;https://www.foreign.senate.gov/download/letter-to-dodig-re-starlink-over-ukraine_-final-signed&quot;, &quot;publication_date&quot;: &quot;2026-10-15&quot;}, {&quot;id&quot;: &quot;S08&quot;, &quot;organisation&quot;: &quot;UNN&quot;, &quot;url&quot;: &quot;https://unn.ua/en/news/ukraine-awaits-confirmation-from-the-pentagon-and-spacex-regarding-the-restoration-of-starshield&quot;, &quot;publication_date&quot;: &quot;2026-10-17&quot;}], &quot;scope&quot;: &quot;Reports dated 14–17 October 2026: restoration claims, conflicting accounts of responsibility and confirmation still awaited. Statements are not network measurements.&quot;}</metadata>",
        1
      ]
    ],
    "expectedHash": "cb5d7bf7dbfa00d40151e516db63426a14463bdaf2435395d9cacbcb921b7499",
    "expectedDomHash": "fd70a64f5ee6fa0fe5f76b41cb490ce05f74b56d5c84f79bc614b57edef5cb59"
  },
  "chronology-en-mobile": {
    "pairs": [
      [
        "<metadata>{&quot;as_of&quot;: &quot;2026-10-17&quot;, &quot;sources&quot;: [{&quot;id&quot;: &quot;S01&quot;, &quot;organisation&quot;: &quot;The Kyiv Independent&quot;, &quot;url&quot;: &quot;https://kyivindependent.com/breaking-starlink-service-in-ukraine-restored-defense-ministry-source-says/&quot;, &quot;publication_date&quot;: &quot;2026-10-15&quot;}, {&quot;id&quot;: &quot;S02&quot;, &quot;organisation&quot;: &quot;Reuters&quot;, &quot;url&quot;: &quot;https://www.reuters.com/world/europe/order-limit-starshield-ukraine-came-inside-white-house-sources-say-2026-10-15/&quot;, &quot;publication_date&quot;: &quot;2026-10-15&quot;}, {&quot;id&quot;: &quot;S03&quot;, &quot;organisation&quot;: &quot;Reuters&quot;, &quot;url&quot;: &quot;https://www.reuters.com/world/europe/trump-says-neither-he-nor-musk-responsible-ukraine-starlink-access-2026-10-16/&quot;, &quot;publication_date&quot;: &quot;2026-10-16T17:29:00Z&quot;}, {&quot;id&quot;: &quot;S04&quot;, &quot;organisation&quot;: &quot;Reuters&quot;, &quot;url&quot;: &quot;https://www.reuters.com/business/aerospace-defense/starlink-disruptions-are-being-felt-front-lines-ukraine-2026-10-16/&quot;, &quot;publication_date&quot;: &quot;2026-10-16&quot;}, {&quot;id&quot;: &quot;S05&quot;, &quot;organisation&quot;: &quot;U.S. Senate, Foreign Relations Committee&quot;, &quot;url&quot;: &quot;https://www.foreign.senate.gov/press/dem/release/shaheen-tillis-lead-bipartisan-senators-in-calling-for-department-of-defense-inspector-general-investigation-into-starlink-disruptions-in-ukraine&quot;, &quot;publication_date&quot;: &quot;2026-10-15&quot;}, {&quot;id&quot;: &quot;S06&quot;, &quot;organisation&quot;: &quot;U.S. Senate&quot;, &quot;url&quot;: &quot;https://www.foreign.senate.gov/download/letter-to-dodig-re-starlink-over-ukraine_-final-signed&quot;, &quot;publication_date&quot;: &quot;2026-10-15&quot;}, {&quot;id&quot;: &quot;S08&quot;, &quot;organisation&quot;: &quot;UNN&quot;, &quot;url&quot;: &quot;https://unn.ua/en/news/ukraine-awaits-confirmation-from-the-pentagon-and-spacex-regarding-the-restoration-of-starshield&quot;, &quot;publication_date&quot;: &quot;2026-10-17&quot;}], &quot;scope&quot;: &quot;Reports dated 14–17 October 2026: restoration claims, conflicting accounts of responsibility and confirmation still awaited. Statements are not network measurements.&quot;}</metadata>",
        "<metadata>{&quot;as_of&quot;: &quot;2026-10-17&quot;, &quot;sources&quot;: [{&quot;id&quot;: &quot;S01&quot;, &quot;organisation&quot;: &quot;The Kyiv Independent&quot;, &quot;url&quot;: &quot;https://kyivindependent.com/breaking-starlink-service-in-ukraine-restored-defense-ministry-source-says/&quot;, &quot;publication_date&quot;: &quot;2026-10-15&quot;}, {&quot;id&quot;: &quot;S02&quot;, &quot;organisation&quot;: &quot;Reuters&quot;, &quot;url&quot;: &quot;https://www.reuters.com/world/europe/order-limit-starshield-ukraine-came-inside-white-house-sources-say-2026-10-15/&quot;, &quot;publication_date&quot;: &quot;2026-10-15&quot;}, {&quot;id&quot;: &quot;S03&quot;, &quot;organisation&quot;: &quot;Reuters&quot;, &quot;url&quot;: &quot;https://www.reuters.com/world/europe/trump-says-neither-he-nor-musk-responsible-ukraine-starlink-access-2026-10-16/&quot;, &quot;publication_date&quot;: &quot;2026-10-16&quot;}, {&quot;id&quot;: &quot;S04&quot;, &quot;organisation&quot;: &quot;Reuters&quot;, &quot;url&quot;: &quot;https://www.reuters.com/business/aerospace-defense/starlink-disruptions-are-being-felt-front-lines-ukraine-2026-10-16/&quot;, &quot;publication_date&quot;: &quot;2026-10-16&quot;}, {&quot;id&quot;: &quot;S05&quot;, &quot;organisation&quot;: &quot;U.S. Senate, Foreign Relations Committee&quot;, &quot;url&quot;: &quot;https://www.foreign.senate.gov/press/dem/release/shaheen-tillis-lead-bipartisan-senators-in-calling-for-department-of-defense-inspector-general-investigation-into-starlink-disruptions-in-ukraine&quot;, &quot;publication_date&quot;: &quot;2026-10-15&quot;}, {&quot;id&quot;: &quot;S06&quot;, &quot;organisation&quot;: &quot;U.S. Senate&quot;, &quot;url&quot;: &quot;https://www.foreign.senate.gov/download/letter-to-dodig-re-starlink-over-ukraine_-final-signed&quot;, &quot;publication_date&quot;: &quot;2026-10-15&quot;}, {&quot;id&quot;: &quot;S08&quot;, &quot;organisation&quot;: &quot;UNN&quot;, &quot;url&quot;: &quot;https://unn.ua/en/news/ukraine-awaits-confirmation-from-the-pentagon-and-spacex-regarding-the-restoration-of-starshield&quot;, &quot;publication_date&quot;: &quot;2026-10-17&quot;}], &quot;scope&quot;: &quot;Reports dated 14–17 October 2026: restoration claims, conflicting accounts of responsibility and confirmation still awaited. Statements are not network measurements.&quot;}</metadata>",
        1
      ]
    ],
    "expectedHash": "0f8e4970562561befeee4b11fdf485d34d8ac27c4d7436046f745e98f4fd7cb2",
    "expectedDomHash": "fd718c51e3dec8aa679343ad533edce6561bef9c5445eda10674dc18092724c8"
  },
  "capacity-en-desktop": {
    "pairs": [
      [
        "<text x=\"65\" y=\"533.0\" fill=\"#f0f5fa\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"26\" font-weight=\"700\" text-anchor=\"start\">What the capacity arrangement specifies</text>",
        "<text x=\"65\" y=\"533.0\" fill=\"#f0f5fa\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"26\" font-weight=\"700\" text-anchor=\"start\">Capacity terms and service rights</text>",
        1
      ]
    ],
    "expectedHash": "74031833daf4122566f6066de9170e0cd466084cc590ab9fc3c1f89771bc4050",
    "expectedDomHash": "8224368c8f800d91eb5afe94814784b89cd274b96c591956a5da54d260df4906"
  },
  "capacity-en-mobile": {
    "pairs": [
      [
        "<text x=\"30\" y=\"699.0\" fill=\"#f0f5fa\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"26\" font-weight=\"700\" text-anchor=\"start\">What the capacity arrangement</text>",
        "<text x=\"30\" y=\"699.0\" fill=\"#f0f5fa\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"26\" font-weight=\"700\" text-anchor=\"start\">Capacity terms</text>",
        1
      ],
      [
        "<text x=\"30\" y=\"733.32\" fill=\"#f0f5fa\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"26\" font-weight=\"700\" text-anchor=\"start\">specifies</text>",
        "<text x=\"30\" y=\"733.32\" fill=\"#f0f5fa\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"26\" font-weight=\"700\" text-anchor=\"start\">and service rights</text>",
        1
      ]
    ],
    "expectedHash": "5f0b237914f2bed2af99612b4dd87860e45c2030ed3abb6db5e95faa2abf67dd",
    "expectedDomHash": "45a0e8a87c0be6e8afbc1812607c835af424a19dc796a89e981ac6b7f12d7388"
  }
};
const kinds=["metrics", "permissions", "chronology", "dependency", "capacity", "milestones"];
const variants=['fr','en'].flatMap(lang=>kinds.flatMap(kind=>[false,true].map(mobile=>({lang,kind,mobile,key:`${kind}-${lang}-${mobile?'mobile':'desktop'}`,svg:starshieldSvg(lang,kind,mobile)}))));
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
// SVG 2 Appendix B.2 endpoint-to-center conversion, with true rotated extrema.
// https://www.w3.org/TR/SVG2/implnote.html#ArcImplementationNotes
function arcPoints(start, radii, rotation, large, sweep, end) {
  assert.ok([start, radii, end].every(p => p.length === 2 && p.every(Number.isFinite)));
  assert.ok(Number.isFinite(rotation) && [0, 1].includes(large) && [0, 1].includes(sweep));
  let [rx, ry] = radii.map(Math.abs);
  if ((start[0] === end[0] && start[1] === end[1]) || rx === 0 || ry === 0) return [start, end];
  const phi = (rotation % 360) * Math.PI / 180, cos = Math.cos(phi), sin = Math.sin(phi);
  const dx = (start[0] - end[0]) / 2, dy = (start[1] - end[1]) / 2;
  const xp = cos * dx + sin * dy, yp = -sin * dx + cos * dy;
  const scale = xp * xp / (rx * rx) + yp * yp / (ry * ry);
  if (scale > 1) { rx *= Math.sqrt(scale); ry *= Math.sqrt(scale); }
  const denominator = rx * rx * yp * yp + ry * ry * xp * xp;
  const factor = (large === sweep ? -1 : 1) * Math.sqrt(Math.max(0, (rx * rx * ry * ry - denominator) / denominator));
  const cxp = factor * rx * yp / ry, cyp = -factor * ry * xp / rx;
  const cx = cos * cxp - sin * cyp + (start[0] + end[0]) / 2;
  const cy = sin * cxp + cos * cyp + (start[1] + end[1]) / 2;
  const u = [(xp - cxp) / rx, (yp - cyp) / ry], v = [(-xp - cxp) / rx, (-yp - cyp) / ry];
  const theta = Math.atan2(u[1], u[0]), tau = 2 * Math.PI;
  let delta = Math.atan2(u[0] * v[1] - u[1] * v[0], u[0] * v[0] + u[1] * v[1]);
  if (!sweep && delta > 0) delta -= tau;
  if (sweep && delta < 0) delta += tau;
  const mod = a => ((a % tau) + tau) % tau;
  const withinSweep = a => (sweep ? mod(a - theta) : mod(theta - a)) <= Math.abs(delta) + 1e-12;
  const at = a => [cx + rx * Math.cos(a) * cos - ry * Math.sin(a) * sin, cy + rx * Math.cos(a) * sin + ry * Math.sin(a) * cos];
  const xCritical = Math.atan2(-ry * sin, rx * cos), yCritical = Math.atan2(ry * cos, rx * sin);
  const result = [start, end, ...[xCritical, xCritical + Math.PI, yCritical, yCritical + Math.PI].filter(withinSweep).map(at)];
  assert.ok(result.flat().every(Number.isFinite)); return result;
}
function pathPoints(raw) {
  assert.equal(typeof raw, 'string'); assert.ok(raw.length > 0 && raw.length <= 8192);
  // The supplied polylines use legal comma separators only between coordinate numbers.
  raw = raw.replace(/(?<=\d),(?=-?(?:\d|\.\d))/gu, ' ');
  const token = /[MLHVZCQTAlz]|-?(?:\d{1,4}(?:\.\d{1,18})?|\.\d{1,18})/uy;
  const tokens = []; let offset = 0;
  while (offset < raw.length) {
    if (/\s/u.test(raw[offset])) { offset++; continue; }
    token.lastIndex = offset; const match = token.exec(raw); assert.ok(match, 'Complete path token');
    tokens.push(match[0]); assert.ok(tokens.length <= 2048); offset = token.lastIndex;
  }
  assert.equal(tokens[0], 'M'); const points = []; let i = 0, current, origin, quadraticControl, count = 0, repeat;
  const pair = () => [number(tokens[i++]), number(tokens[i++])];
  while (i < tokens.length) {
    const command = /^[MLHVZCQTAlz]$/u.test(tokens[i]) ? tokens[i++] : repeat; assert.ok(['M', 'L', 'H', 'V', 'Z', 'C', 'Q', 'T', 'A', 'l', 'z'].includes(command));
    assert.ok(++count <= 512); repeat = command === 'M' ? 'L' : ['Z','z'].includes(command) ? undefined : command;
    if (command === 'Z' || command === 'z') { assert.ok(origin); current = [...origin]; quadraticControl = undefined; }
    else if (command === 'M' || command === 'L' || command === 'l') {
      if (command !== 'M') assert.ok(current);
      const next=pair();current=command==='l'?next.map((v,k)=>v+current[k]):next;assert.ok(current.every(n=>Number.isFinite(n)&&Math.abs(n)<=10000));quadraticControl=undefined;
      if (command === 'M') origin = [...current];
    } else if (command === 'H' || command === 'V') {
      assert.ok(current); current = [...current]; current[command === 'H' ? 0 : 1] = number(tokens[i++]); quadraticControl = undefined;
    } else if (command === 'A') {
      assert.ok(current);const radii=pair(),rotation=number(tokens[i++]),large=number(tokens[i++]),sweep=number(tokens[i++]),end=pair();
      points.push(...arcPoints(current,radii,rotation,large,sweep,end));current=end;quadraticControl=undefined;
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
// Independent reviewed correspondence; only exact source href attributes change at render time.
const renderedSourceAnchors={
  "https://eu-space.europa.eu/news/observer-how-european-union-accelerating-and-reinforcing-iris2": "#source-s17",
  "https://eutelsat.mynewsdesk.com/pressreleases/eutelsat-et-le-ministere-des-armees-annoncent-la-signature-du-contrat-de-capacite-centaure-marche-subsequent-de-laccord-cadre-nexus-3454217": "#source-s14",
  "https://kyivindependent.com/breaking-starlink-service-in-ukraine-restored-defense-ministry-source-says/": "#source-s01",
  "https://new.spacex.com/starshield": "#source-s09",
  "https://nps.edu/web/acqnresearch/2024-archive/-/asset_publisher/riOLyDXewOgo/content/newsletter-4.5.2024": "#source-s24",
  "https://starlink.com/ki/support/article/413011a8-34c9-5b33-bf97-03f7ca7273ea": "#source-s10",
  "https://unn.ua/en/news/ukraine-awaits-confirmation-from-the-pentagon-and-spacex-regarding-the-restoration-of-starshield": "#source-s08",
  "https://www.airbus.com/en/newsroom/press-releases/2026-09-airbus-starts-the-development-of-iris2-satellites-on-behalf-of-eutelsat": "#source-s19",
  "https://www.defense.gouv.fr/dga/actualites/dga-poursuit-diversification-moyens-telecommunications-satellite-au-profit-forces": "#source-s12",
  "https://www.euspa.europa.eu/newsroom-events/news/commission-accelerates-iris2-deployment-enhanced-security-and-expanded": "#source-s18",
  "https://www.foreign.senate.gov/download/letter-to-dodig-re-starlink-over-ukraine_-final-signed": "#source-s06",
  "https://www.reuters.com/world/europe/order-limit-starshield-ukraine-came-inside-white-house-sources-say-2026-10-15/": "#source-s02",
  "https://www.vandenberg.spaceforce.mil/News/Article-Display/Article/3736616/ussf-releases-commercial-space-strategy-to-increase-competitive-advantage/": "#source-s25"
};
const originalSourceAnchors=Object.fromEntries(Object.entries(renderedSourceAnchors).map(([url,target])=>[target,url]));
function componentSourceAnchors(){
 const component=read('src/components/StarshieldFigure.astro'),literal=component.match(/const sourceAnchors: Readonly<Record<string, string>> = Object\.freeze\((\{[\s\S]*?\})\);/u)?.[1];
 assert.ok(literal);const mapping=JSON.parse(literal);assert.deepEqual(mapping,renderedSourceAnchors);
 assert.ok(component.includes(`.replace(/ href="([^"]+)"/gu, (_attribute: string, url: string) => {
    if (!Object.hasOwn(sourceAnchors, url)) throw new TypeError('Unknown Starshield SVG source URL');
    return \` href="\${sourceAnchors[url]}"\`;
  });`));return mapping;
}
function renderOnlySvg(svg){const mapping=componentSourceAnchors();return svg.replace(/^<svg /u,'<svg style="width:100%;height:auto" ').replace(/ href="([^"]+)"/gu,(_attribute,url)=>{assert.ok(Object.hasOwn(mapping,url));return ` href="${mapping[url]}"`;});}
function restoreSourceNavigation(node){return {...node,attrs:node.attrs?.map(a=>a.name==='href'?{...a,value:originalSourceAnchors[a.value]}:a),childNodes:node.childNodes?.map(restoreSourceNavigation)};}
const navigationUrls=["https://eu-space.europa.eu/news/observer-how-european-union-accelerating-and-reinforcing-iris2", "https://eutelsat.mynewsdesk.com/pressreleases/eutelsat-et-le-ministere-des-armees-annoncent-la-signature-du-contrat-de-capacite-centaure-marche-subsequent-de-laccord-cadre-nexus-3454217", "https://kyivindependent.com/breaking-starlink-service-in-ukraine-restored-defense-ministry-source-says/", "https://new.spacex.com/starshield", "https://nps.edu/web/acqnresearch/2024-archive/-/asset_publisher/riOLyDXewOgo/content/newsletter-4.5.2024", "https://starlink.com/ki/support/article/413011a8-34c9-5b33-bf97-03f7ca7273ea", "https://unn.ua/en/news/ukraine-awaits-confirmation-from-the-pentagon-and-spacex-regarding-the-restoration-of-starshield", "https://www.airbus.com/en/newsroom/press-releases/2026-09-airbus-starts-the-development-of-iris2-satellites-on-behalf-of-eutelsat", "https://www.defense.gouv.fr/dga/actualites/dga-poursuit-diversification-moyens-telecommunications-satellite-au-profit-forces", "https://www.euspa.europa.eu/newsroom-events/news/commission-accelerates-iris2-deployment-enhanced-security-and-expanded", "https://www.foreign.senate.gov/download/letter-to-dodig-re-starlink-over-ukraine_-final-signed", "https://www.reuters.com/world/europe/order-limit-starshield-ukraine-came-inside-white-house-sources-say-2026-10-15/", "https://www.vandenberg.spaceforce.mil/News/Article-Display/Article/3736616/ussf-releases-commercial-space-strategy-to-increase-competitive-advantage/"];
const sourceUrls={"S06": "https://www.foreign.senate.gov/download/letter-to-dodig-re-starlink-over-ukraine_-final-signed", "S10": "https://starlink.com/ki/support/article/413011a8-34c9-5b33-bf97-03f7ca7273ea", "S09": "https://new.spacex.com/starshield", "S01": "https://kyivindependent.com/breaking-starlink-service-in-ukraine-restored-defense-ministry-source-says/", "S02": "https://www.reuters.com/world/europe/order-limit-starshield-ukraine-came-inside-white-house-sources-say-2026-10-15/", "S03": "https://www.reuters.com/world/europe/trump-says-neither-he-nor-musk-responsible-ukraine-starlink-access-2026-10-16/", "S04": "https://www.reuters.com/business/aerospace-defense/starlink-disruptions-are-being-felt-front-lines-ukraine-2026-10-16/", "S05": "https://www.foreign.senate.gov/press/dem/release/shaheen-tillis-lead-bipartisan-senators-in-calling-for-department-of-defense-inspector-general-investigation-into-starlink-disruptions-in-ukraine", "S08": "https://unn.ua/en/news/ukraine-awaits-confirmation-from-the-pentagon-and-spacex-regarding-the-restoration-of-starshield", "S24": "https://nps.edu/web/acqnresearch/2024-archive/-/asset_publisher/riOLyDXewOgo/content/newsletter-4.5.2024", "S25": "https://www.vandenberg.spaceforce.mil/News/Article-Display/Article/3736616/ussf-releases-commercial-space-strategy-to-increase-competitive-advantage/", "S12": "https://www.defense.gouv.fr/dga/actualites/dga-poursuit-diversification-moyens-telecommunications-satellite-au-profit-forces", "S13": "https://www.defense.gouv.fr/de/node/23486", "S14": "https://eutelsat.mynewsdesk.com/pressreleases/eutelsat-et-le-ministere-des-armees-annoncent-la-signature-du-contrat-de-capacite-centaure-marche-subsequent-de-laccord-cadre-nexus-3454217", "S15": "https://www.euspa.europa.eu/pressroom/press-releases/cyprus-completes-first-operational-use-eu-govsatcom-hub-services-marking", "S16": "https://eu-space.europa.eu/secure-connectivity/govsatcom", "S17": "https://eu-space.europa.eu/news/observer-how-european-union-accelerating-and-reinforcing-iris2", "S18": "https://www.euspa.europa.eu/newsroom-events/news/commission-accelerates-iris2-deployment-enhanced-security-and-expanded", "S19": "https://www.airbus.com/en/newsroom/press-releases/2026-09-airbus-starts-the-development-of-iris2-satellites-on-behalf-of-eutelsat", "S20": "https://defence-industry-space.ec.europa.eu/document/download/5cb72e29-5eb0-4c4c-be48-95570ffa13d3_en?filename=IRIS2+-+EU+Secure+Connectivity+Programme_0.pdf"};
const sourcePublicationDates={"S06": "2026-10-15", "S10": null, "S09": null, "S01": "2026-10-15", "S02": "2026-10-15", "S03": "2026-10-16", "S04": "2026-10-16", "S05": "2026-10-15", "S08": "2026-10-17", "S24": "2024-04-05", "S25": "2024-04-10", "S12": "2026-06-16", "S13": null, "S14": "2026-06-15", "S15": "2026-03-10", "S16": null, "S17": "2026-08-07", "S18": "2026-08-07", "S19": "2026-09-10", "S20": null};
const originalNavigation={"metrics-fr-desktop": ["https://www.foreign.senate.gov/download/letter-to-dodig-re-starlink-over-ukraine_-final-signed", "https://starlink.com/ki/support/article/413011a8-34c9-5b33-bf97-03f7ca7273ea"], "metrics-fr-mobile": ["https://www.foreign.senate.gov/download/letter-to-dodig-re-starlink-over-ukraine_-final-signed", "https://starlink.com/ki/support/article/413011a8-34c9-5b33-bf97-03f7ca7273ea"], "permissions-fr-desktop": ["https://www.foreign.senate.gov/download/letter-to-dodig-re-starlink-over-ukraine_-final-signed", "https://new.spacex.com/starshield", "https://starlink.com/ki/support/article/413011a8-34c9-5b33-bf97-03f7ca7273ea"], "permissions-fr-mobile": ["https://www.foreign.senate.gov/download/letter-to-dodig-re-starlink-over-ukraine_-final-signed", "https://new.spacex.com/starshield", "https://starlink.com/ki/support/article/413011a8-34c9-5b33-bf97-03f7ca7273ea"], "chronology-fr-desktop": ["https://www.reuters.com/world/europe/order-limit-starshield-ukraine-came-inside-white-house-sources-say-2026-10-15/", "https://kyivindependent.com/breaking-starlink-service-in-ukraine-restored-defense-ministry-source-says/", "https://unn.ua/en/news/ukraine-awaits-confirmation-from-the-pentagon-and-spacex-regarding-the-restoration-of-starshield", "https://www.foreign.senate.gov/download/letter-to-dodig-re-starlink-over-ukraine_-final-signed"], "chronology-fr-mobile": ["https://www.reuters.com/world/europe/order-limit-starshield-ukraine-came-inside-white-house-sources-say-2026-10-15/", "https://kyivindependent.com/breaking-starlink-service-in-ukraine-restored-defense-ministry-source-says/", "https://unn.ua/en/news/ukraine-awaits-confirmation-from-the-pentagon-and-spacex-regarding-the-restoration-of-starshield", "https://www.foreign.senate.gov/download/letter-to-dodig-re-starlink-over-ukraine_-final-signed"], "dependency-fr-desktop": ["https://nps.edu/web/acqnresearch/2024-archive/-/asset_publisher/riOLyDXewOgo/content/newsletter-4.5.2024", "https://www.vandenberg.spaceforce.mil/News/Article-Display/Article/3736616/ussf-releases-commercial-space-strategy-to-increase-competitive-advantage/"], "dependency-fr-mobile": ["https://nps.edu/web/acqnresearch/2024-archive/-/asset_publisher/riOLyDXewOgo/content/newsletter-4.5.2024", "https://www.vandenberg.spaceforce.mil/News/Article-Display/Article/3736616/ussf-releases-commercial-space-strategy-to-increase-competitive-advantage/"], "capacity-fr-desktop": ["https://www.defense.gouv.fr/dga/actualites/dga-poursuit-diversification-moyens-telecommunications-satellite-au-profit-forces", "https://eutelsat.mynewsdesk.com/pressreleases/eutelsat-et-le-ministere-des-armees-annoncent-la-signature-du-contrat-de-capacite-centaure-marche-subsequent-de-laccord-cadre-nexus-3454217"], "capacity-fr-mobile": ["https://www.defense.gouv.fr/dga/actualites/dga-poursuit-diversification-moyens-telecommunications-satellite-au-profit-forces", "https://eutelsat.mynewsdesk.com/pressreleases/eutelsat-et-le-ministere-des-armees-annoncent-la-signature-du-contrat-de-capacite-centaure-marche-subsequent-de-laccord-cadre-nexus-3454217"], "milestones-fr-desktop": ["https://eu-space.europa.eu/news/observer-how-european-union-accelerating-and-reinforcing-iris2", "https://www.euspa.europa.eu/newsroom-events/news/commission-accelerates-iris2-deployment-enhanced-security-and-expanded", "https://www.airbus.com/en/newsroom/press-releases/2026-09-airbus-starts-the-development-of-iris2-satellites-on-behalf-of-eutelsat"], "milestones-fr-mobile": ["https://eu-space.europa.eu/news/observer-how-european-union-accelerating-and-reinforcing-iris2", "https://www.euspa.europa.eu/newsroom-events/news/commission-accelerates-iris2-deployment-enhanced-security-and-expanded", "https://www.airbus.com/en/newsroom/press-releases/2026-09-airbus-starts-the-development-of-iris2-satellites-on-behalf-of-eutelsat"], "metrics-en-desktop": ["https://www.foreign.senate.gov/download/letter-to-dodig-re-starlink-over-ukraine_-final-signed", "https://starlink.com/ki/support/article/413011a8-34c9-5b33-bf97-03f7ca7273ea"], "metrics-en-mobile": ["https://www.foreign.senate.gov/download/letter-to-dodig-re-starlink-over-ukraine_-final-signed", "https://starlink.com/ki/support/article/413011a8-34c9-5b33-bf97-03f7ca7273ea"], "permissions-en-desktop": ["https://www.foreign.senate.gov/download/letter-to-dodig-re-starlink-over-ukraine_-final-signed", "https://new.spacex.com/starshield", "https://starlink.com/ki/support/article/413011a8-34c9-5b33-bf97-03f7ca7273ea"], "permissions-en-mobile": ["https://www.foreign.senate.gov/download/letter-to-dodig-re-starlink-over-ukraine_-final-signed", "https://new.spacex.com/starshield", "https://starlink.com/ki/support/article/413011a8-34c9-5b33-bf97-03f7ca7273ea"], "chronology-en-desktop": ["https://www.reuters.com/world/europe/order-limit-starshield-ukraine-came-inside-white-house-sources-say-2026-10-15/", "https://kyivindependent.com/breaking-starlink-service-in-ukraine-restored-defense-ministry-source-says/", "https://unn.ua/en/news/ukraine-awaits-confirmation-from-the-pentagon-and-spacex-regarding-the-restoration-of-starshield", "https://www.foreign.senate.gov/download/letter-to-dodig-re-starlink-over-ukraine_-final-signed"], "chronology-en-mobile": ["https://www.reuters.com/world/europe/order-limit-starshield-ukraine-came-inside-white-house-sources-say-2026-10-15/", "https://kyivindependent.com/breaking-starlink-service-in-ukraine-restored-defense-ministry-source-says/", "https://unn.ua/en/news/ukraine-awaits-confirmation-from-the-pentagon-and-spacex-regarding-the-restoration-of-starshield", "https://www.foreign.senate.gov/download/letter-to-dodig-re-starlink-over-ukraine_-final-signed"], "dependency-en-desktop": ["https://nps.edu/web/acqnresearch/2024-archive/-/asset_publisher/riOLyDXewOgo/content/newsletter-4.5.2024", "https://www.vandenberg.spaceforce.mil/News/Article-Display/Article/3736616/ussf-releases-commercial-space-strategy-to-increase-competitive-advantage/"], "dependency-en-mobile": ["https://nps.edu/web/acqnresearch/2024-archive/-/asset_publisher/riOLyDXewOgo/content/newsletter-4.5.2024", "https://www.vandenberg.spaceforce.mil/News/Article-Display/Article/3736616/ussf-releases-commercial-space-strategy-to-increase-competitive-advantage/"], "capacity-en-desktop": ["https://www.defense.gouv.fr/dga/actualites/dga-poursuit-diversification-moyens-telecommunications-satellite-au-profit-forces", "https://eutelsat.mynewsdesk.com/pressreleases/eutelsat-et-le-ministere-des-armees-annoncent-la-signature-du-contrat-de-capacite-centaure-marche-subsequent-de-laccord-cadre-nexus-3454217"], "capacity-en-mobile": ["https://www.defense.gouv.fr/dga/actualites/dga-poursuit-diversification-moyens-telecommunications-satellite-au-profit-forces", "https://eutelsat.mynewsdesk.com/pressreleases/eutelsat-et-le-ministere-des-armees-annoncent-la-signature-du-contrat-de-capacite-centaure-marche-subsequent-de-laccord-cadre-nexus-3454217"], "milestones-en-desktop": ["https://eu-space.europa.eu/news/observer-how-european-union-accelerating-and-reinforcing-iris2", "https://www.euspa.europa.eu/newsroom-events/news/commission-accelerates-iris2-deployment-enhanced-security-and-expanded", "https://www.airbus.com/en/newsroom/press-releases/2026-09-airbus-starts-the-development-of-iris2-satellites-on-behalf-of-eutelsat"], "milestones-en-mobile": ["https://eu-space.europa.eu/news/observer-how-european-union-accelerating-and-reinforcing-iris2", "https://www.euspa.europa.eu/newsroom-events/news/commission-accelerates-iris2-deployment-enhanced-security-and-expanded", "https://www.airbus.com/en/newsroom/press-releases/2026-09-airbus-starts-the-development-of-iris2-satellites-on-behalf-of-eutelsat"]};
const allowed=Object.fromEntries(Object.entries({
 svg:'xmlns viewBox role aria-labelledby',metadata:'',title:'id',desc:'id',defs:'',a:'href',
 marker:'id viewBox refX refY markerWidth markerHeight orient',
 path:'d fill stroke stroke-width stroke-dasharray marker-end',
 rect:'x y width height rx fill stroke stroke-width stroke-dasharray',
 text:'x y fill font-family font-size font-weight text-anchor',
 circle:'cx cy r fill stroke stroke-width',line:'x1 y1 x2 y2 stroke stroke-width stroke-dasharray marker-end',
}).map(([k,v])=>[k,new Set(v?v.split(' '):[])]));
const palette=new Set(['#0b1724','#142638','#f0f5fa','#aec0ce','#405468','#83bdff','#ffd18a','#78ddcb']);
const numeric=new Set('x y width height rx cx cy r x1 y1 x2 y2 font-size stroke-width refX refY markerWidth markerHeight'.split(' '));
function number(value){assert.equal(typeof value,'string');assert.ok(value.length>0&&value.length<=32);assert.match(value,/^-?(?:\d{1,4}(?:\.\d{1,18})?|\.\d{1,18})$/u);const n=Number(value);assert.ok(Number.isFinite(n)&&Math.abs(n)<=10000);return n;}
const value=(n,k,fallback='0')=>number(attrs(n)[k]??fallback);
function inspect(v){
 assert.equal(typeof v.svg,'string');assert.ok(v.svg.length>100&&v.svg.length<40000);assert.doesNotMatch(v.svg,/<!|<\?|&(?!amp;|lt;|gt;|quot;|apos;)/u);assert.equal(XMLValidator.validate(v.svg),true);
 const roots=parser.parse(v.svg);assert.equal(roots.length,1);const root=roots[0];assert.equal(tag(root),'svg');
 const index=kinds.indexOf(v.kind)+1,prefix=`ss-${v.lang}-${index}-${v.mobile?'m':'d'}`;
 assert.deepEqual(attrs(root),{xmlns:'http://www.w3.org/2000/svg',viewBox:originals[v.key].viewBox,role:'img','aria-labelledby':`${prefix}-title ${prefix}-desc`});
 const nodes=xmlNodes(root);assert.ok(nodes.length<512);const ids=[];
 for(const n of nodes){
  assert.ok(Object.hasOwn(allowed,tag(n)),`Passive tag ${tag(n)}`);
  for(const[k,val]of Object.entries(attrs(n))){
   assert.ok(allowed[tag(n)].has(k),`Known field ${tag(n)}.${k}`);assert.equal(typeof val,'string');assert.ok(val.length<=8192);
   if(numeric.has(k)){const num=number(val);if(['width','height','rx','r','stroke-width','markerWidth','markerHeight'].includes(k))assert.ok(num>=0);}
   if(k==='fill'||k==='stroke')assert.ok(val==='none'||palette.has(val),`Passive literal paint ${val}`);
   if(k==='id'){assert.ok(['title','desc','arrow','amber'].some(s=>val===`${prefix}-${s}`));ids.push(val);}
   if(k==='font-family')assert.equal(val,'Arial, Helvetica, sans-serif');if(k==='font-weight')assert.ok(['400','700'].includes(val));if(k==='font-size')assert.ok(number(val)>=15&&number(val)<=80);
   if(k==='text-anchor')assert.ok(['start','middle','end'].includes(val));if(k==='stroke-dasharray')assert.ok(['5 6','7 5','6 4','6 5','8 6','5 4'].includes(val));
   if(k==='marker-end')assert.ok([`url(#${prefix}-arrow)`,`url(#${prefix}-amber)`].includes(val));if(k==='d')pathPoints(val);
   if(k==='href'){assert.equal(tag(n),'a');assert.ok(navigationUrls.includes(val),'Exact preselected source navigation URL');const url=new URL(val);assert.equal(url.href,val);assert.equal(url.protocol,'https:');assert.equal(url.username,'');assert.equal(url.password,'');assert.equal(url.hash,'');}
  }
  if(tag(n)==='marker'){
   assert.deepEqual(attrs(n),{id:attrs(n).id,viewBox:'0 0 10 10',refX:'9',refY:'5',markerWidth:'7',markerHeight:'7',orient:'auto-start-reverse'});
   assert.equal(children(n).length,1);assert.equal(tag(children(n)[0]),'path');assert.deepEqual(attrs(children(n)[0]),{d:'M 0 0 L 10 5 L 0 10 z',fill:attrs(n).id===`${prefix}-arrow`?'#83bdff':'#ffd18a'});
  }
  if(tag(n)==='text')assert.ok(children(n).length===1&&tag(children(n)[0])==='#text');
  if(tag(n)==='a'){assert.deepEqual(Object.keys(attrs(n)),['href']);assert.ok(children(n).filter(c=>tag(c)!=='#text'||xmlText(c).trim()).every(c=>tag(c)==='text'));}
 }
 assert.equal(new Set(ids).size,4);assert.equal(ids.length,4);
 for(const type of ['title','desc','metadata','defs']){const found=nodes.filter(n=>tag(n)===type);assert.equal(found.length,1);if(type!=='defs')assert.ok(xmlText(found[0]).trim());}
 assert.equal(nodes.filter(n=>tag(n)==='marker').length,2);
 const metadata=JSON.parse(xmlText(nodes.find(n=>tag(n)==='metadata')));assert.deepEqual(Object.keys(metadata).sort(),['as_of','scope','sources']);assert.equal(metadata.as_of,'2026-10-17');assert.ok(typeof metadata.scope==='string'&&metadata.scope.length>20&&metadata.scope.length<1500);assert.ok(Array.isArray(metadata.sources)&&metadata.sources.length>0&&metadata.sources.length<=10);
 for(const s of metadata.sources){assert.deepEqual(Object.keys(s).sort(),['id','organisation','publication_date','url']);assert.ok(Object.hasOwn(sourceUrls,s.id));assert.equal(s.url,sourceUrls[s.id]);assert.ok(typeof s.organisation==='string'&&s.organisation.length>1&&s.organisation.length<150);assert.equal(s.publication_date,sourcePublicationDates[s.id],'Exact original date and timezone precision');}
 assert.deepEqual(nodes.filter(n=>tag(n)==='a').map(n=>attrs(n).href),originalNavigation[v.key],'Every original source link and its order');
 const[,,width,height]=attrs(root).viewBox.split(' ').map(number);return{root,nodes,width,height};
}
function faithful(v){
 inspect(v);let original=v.svg;const correction=textCorrections[v.key];
 if(correction){assert.equal(digest(v.svg),correction.expectedHash);assert.equal(domHash(v.svg),correction.expectedDomHash);for(const[before,after,count]of [...correction.pairs].reverse()){assert.equal(original.split(after).length-1,count);original=original.replaceAll(after,before);}}
 assert.equal(digest(original),originals[v.key].rawHash,`${v.key}: complete supplied XML after exact approved inverse`);assert.equal(domHash(original),originals[v.key].domHash,`${v.key}: complete supplied browser tree`);
 const projection=n=>tag(n)==='#text'?null:[tag(n),Object.entries(attrs(n)).sort(),children(n).filter(n=>tag(n)!=='#text').map(projection)];
 assert.equal(digest(JSON.stringify(projection(parser.parse(v.svg)[0]))),originals[v.key].geometryHash,`${v.key}: every supplied attribute and element order`);
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
  if(['rect','circle','line','path'].includes(tag(n))){const b=shapeBox(n),s=attrs(n).stroke&&attrs(n).stroke!=='none'?value(n,'stroke-width','1')/2:0;assert.ok(within({x:b.x-s,y:b.y-s,right:b.right+s,bottom:b.bottom+s},canvas,.01),'shape outside viewBox');}
  if(tag(n)==='text'){const x=value(n,'x'),y=value(n,'y');assert.ok(x>=0&&x<=width&&y>=0&&y<=height,'text anchor outside viewBox');}
  if(attrs(n)['marker-end']){const points=tag(n)==='line'?[[value(n,'x1'),value(n,'y1')],[value(n,'x2'),value(n,'y2')]]:pathPoints(attrs(n).d),a=points.at(-2),b=points.at(-1);assert.ok(a&&b);assert.ok(Math.hypot(b[0]-a[0],b[1]-a[1])>0);const angle=Math.atan2(b[1]-a[1],b[0]-a[0]),scale=7/10*value(n,'stroke-width','1');const triangle=[[0,0],[10,5],[0,10]].map(([x,y])=>{const dx=(x-9)*scale,dy=(y-5)*scale;return[b[0]+Math.cos(angle)*dx-Math.sin(angle)*dy,b[1]+Math.sin(angle)*dx+Math.cos(angle)*dy];});assert.ok(within(pointsBox(triangle),canvas,.01),'marker outside viewBox');}

 }
}

test('Starshield variant selection is frozen, complete and rejects coercion or prototypes',()=>{
 assert.deepEqual(STARSHIELD_KINDS,kinds);assert.ok(Object.isFrozen(STARSHIELD_KINDS));assert.equal(variants.length,24);
 for(const lang of ['', 'FR','__proto__','constructor',{},null,['fr']])assert.throws(()=>starshieldSvg(lang,'metrics',false),TypeError);
 for(const kind of ['', '__proto__','constructor','prototype',{},null,['metrics']])assert.throws(()=>starshieldSvg('fr',kind,false),TypeError);
 for(const mobile of [0,1,'','false',null,new Boolean(false),{},[]])assert.throws(()=>starshieldSvg('fr','metrics',mobile),TypeError);
 assert.equal(starshieldSvg('fr','metrics'),starshieldSvg('fr','metrics',false));
});
test('all24 complete supplied XML trees are recovered by the exact approved inverse mapping',()=>{for(const v of variants)faithful(v);});
test('native shape bounds and text anchors remain in viewBoxes; browser QA measures actual platform glyphs',()=>{for(const v of variants)geometry(v);});
test('static checks reject off-canvas source shapes, coordinate lists and text anchors',()=>{
 const v=variants[0];for(const change of [(_,ns)=>{attrs(ns.find(n=>tag(n)==='rect')).x='9999';},(_,ns)=>{attrs(ns.find(n=>tag(n)==='text')).x='-10';}])assert.throws(()=>geometry(mutate(v,change)));

});
test('full XML goldens reject geometry, text, colour, root fields and child-order changes',()=>{
 const v=variants[0];for(const change of [(_,ns)=>{attrs(ns.find(n=>tag(n)==='text')).x='0';},(_,ns)=>{attrs(ns.find(n=>tag(n)==='rect')).fill='var(--panel)';},(_,ns)=>{ns.find(n=>tag(n)==='title').title=[{'#text':'Changed'}];},(_,ns)=>{attrs(ns.find(n=>tag(n)==='marker')).markerWidth='8';},root=>{root.svg.reverse();}])assert.throws(()=>faithful(mutate(v,change)));
});
test('passive SVG validator rejects active markup, external resources and malformed fields',()=>{
 const v=variants[0];for(const type of ['script','foreignObject','image','use','animate','filter','style','tspan'])assert.throws(()=>inspect(mutate(v,root=>{root.svg.push({[type]:[]});})));
 for(const[field,val]of [['onload','alert(1)'],['href','https://example.org/'],['xlink:href','javascript:alert(1)'],['constructor','x'],['prototype','x'],['transform','translate(0 0)'],['style','fill:red'],['font-family','Other'],['font-size','Infinity'],['x','1e999'],['x','10001']])assert.throws(()=>inspect(mutate(v,(_,ns)=>{attrs(ns.find(n=>tag(n)==='text'))[field]=val;})));
 for(const val of ['url(#x)','url(https://example.org/x)','var(--bg,red)','#fff','red'])assert.throws(()=>inspect(mutate(v,(_,ns)=>{attrs(ns.find(n=>tag(n)==='rect')).fill=val;})));
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
  const bad = ['L0 0', 'M0', 'M0 0 trailing', 'M0 0 Z 1 1', 'MNaN 0', 'M1e999 0', 'M0,,0',
    'M0 0 C1 2 3 4 5', 'M0 0 Q1 2 3', 'M0 0 T1', 'M0 0 C1 2 3 4 5 6 trailing',
    'M0 0 H', 'M0 0 V', 'M0 0 A1 1 0 2 0 1 1', 'M0 0 q1 2 3 4', 'M0 0 S1 2 3 4',
    'M10001 0', 'M0 0 L99999 0', 'M' + '.'.repeat(8000) + ' 0', 'M' + '9'.repeat(8000) + ' 0',
    'M0.' + '9'.repeat(8000) + ' 0', 'M0 0 ' + 'L1 1 '.repeat(513), 'M0 0 ' + 'C1 1 1 1 1 1 '.repeat(300)];
  for (const raw of bad) assert.throws(() => pathPoints(raw));
  for (const raw of ['', null, {}, [], 0, new String('M0 0')]) assert.throws(() => pathPoints(raw));
  const code = `import assert from 'node:assert/strict'; const number=${number.toString()}; const curvePoints=${curvePoints.toString()}; const arcPoints=${arcPoints.toString()}; const paths=${pathPoints.toString()}; for(let i=0;i<100;i++) for(const raw of ${JSON.stringify(bad)}) assert.throws(()=>paths(raw));`;
  execFileSync(process.execPath, ['--input-type=module', '-e', code], { timeout: 5000, maxBuffer: 8192, stdio: 'pipe' });
});
test('responsive component preserves supplied fonts and maps the source palette to both existing themes',()=>{
 const component=read('src/components/StarshieldFigure.astro'),style=component.match(/<style>([\s\S]*?)<\/style>/u)?.[1];assert.ok(style);
 const css=postcss.parse(style),decl=n=>Object.fromEntries(n.nodes.filter(d=>d.type==='decl').map(d=>[d.prop,d.value]));
 const rule=selector=>{const n=css.nodes.find(n=>n.type==='rule'&&n.selector===selector);assert.ok(n,selector);return decl(n);};
 const mapping={'#0b1724':'ink','#142638':'surface','#f0f5fa':'paper','#aec0ce':'muted','#405468':'line-strong','#83bdff':'topic-blue','#ffd18a':'amber','#78ddcb':'signal'};
 for(const[colour,variable]of Object.entries(mapping))assert.deepEqual(rule(`.starshield-figure :global([fill="${colour}"])`),{fill:`var(--color-${variable})`});
 for(const colour of ['#83bdff','#ffd18a','#405468','#78ddcb'])assert.deepEqual(rule(`.starshield-figure :global([stroke="${colour}"])`),{stroke:`var(--color-${mapping[colour]})`});
 const base=rule('.starshield-figure');assert.deepEqual([base.width,base['max-width'],base['container-type'],base['padding-bottom'],base.overflow],['100%','760px','inline-size','.85rem','visible']);
 const graphic=rule('.starshield-figure :global(svg)');assert.deepEqual([graphic.width,graphic.height,graphic['max-width'],graphic['letter-spacing'],graphic.overflow],['100%','auto','100%','normal','visible']);
 const mobile=rule('.starshield-mobile');assert.deepEqual([mobile.display,mobile.width,mobile['max-width'],mobile['margin-inline']],['none','100%','420px','auto']);
 assert.equal(css.nodes.filter(n=>n.type==='atrule'&&n.name==='font-face').length,0);css.walkDecls('font-family',()=>assert.fail('Keep the supplied explicit Arial/Helvetica text stack'));assert.doesNotMatch(component,/@font-face|\/fonts\//u);
 for(const name of ['media','container']){const n=css.nodes.find(n=>n.type==='atrule'&&n.name===name&&n.params==='(max-width: 640px)');assert.ok(n);assert.deepEqual(n.nodes.map(n=>[n.selector,decl(n).display]),[['.starshield-desktop','none'],['.starshield-mobile','block']]);}
 const themes={dark:new Map(),light:new Map()};postcss.parse(read('src/styles/global.css')).walkDecls(d=>{if((d.parent.type==='atrule'&&d.parent.name==='theme')||(d.parent.type==='rule'&&d.parent.selector===':root'))themes.dark.set(d.prop,d.value);if(d.parent.type==='rule'&&d.parent.selector===':root[data-theme="light"]')themes.light.set(d.prop,d.value);});
 for(const theme of Object.values(themes))for(const v of [...Object.values(mapping),'surface'])assert.ok(theme.has(`--color-${v}`));
 css.walkDecls(d=>assert.doesNotMatch(d.value,/#(?:[a-f0-9]{3}){1,2}\b|url\(/iu));assert.doesNotMatch(style,/clip-path|overflow\s*:\s*(?:hidden|clip)|transform\s*:|100vw/iu);
 assert.equal((component.match(/set:html=/gu)??[]).length,2);componentSourceAnchors();
 assert.ok(component.includes('id={`figure-${number}`}'));assert.doesNotMatch(component,/<script|client:|fetch\(|innerHTML/u);
});


const mdxNodes=n=>[n,...(n.children??[]).flatMap(mdxNodes)];
const figureSources={"metrics": "06 10", "permissions": "06 09 10", "chronology": "01 02 03 04 05 06 07 08", "dependency": "24 25", "capacity": "12 13 14", "milestones": "15 16 17 18 19 20"};
function articleFigures(raw,lang){
 const tree=createProcessor().parse(raw.replace(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/u,'')),nodes=mdxNodes(tree),figures=nodes.filter(n=>n.name==='StarshieldFigure');assert.equal(figures.length,6);
 const imports=nodes.filter(n=>n.type==='mdxjsEsm');assert.equal(imports.length,1);assert.match(imports[0].value,/^import StarshieldFigure from ['"]\.\.\/\.\.\/components\/StarshieldFigure\.astro['"];?$/u);
 for(const[i,n]of figures.entries()){
  const a=Object.fromEntries(n.attributes.map(a=>{assert.equal(a.type,'mdxJsxAttribute');assert.equal(typeof a.value,'string');return[a.name,a.value];}));
  assert.deepEqual(Object.keys(a).sort(),['caption','kind','lang','number','sources']);assert.equal(a.kind,kinds[i]);assert.equal(a.number,String(i+1).padStart(2,'0'));assert.equal(a.lang,lang);assert.ok(a.caption.length>70);
  assert.equal(a.sources,figureSources[kinds[i]]);const details=mdxNodes(n).filter(c=>c.name==='details');assert.equal(details.length,1);assert.equal(mdxNodes(details[0]).filter(c=>c.name==='summary').length,1);
  const note=mdxNodes(details[0]).filter(c=>c.type==='text').map(c=>c.value).join(' ');assert.ok(note.length>100);
 }
}
test('article native MDX includes six ordered static figures, verified references and method notes',()=>{
 for(const lang of ['fr','en'])articleFigures(read(`src/content/${lang==='fr'?'posts/starshield-ukraine-controle-connexion':'posts-en/starshield-ukraine-terms-of-connection'}.mdx`),lang);
});
test('article figure contract rejects reordered, dynamic and incomplete source or method declarations',()=>{
 const raw=read('src/content/posts/starshield-ukraine-controle-connexion.mdx');
 for(const [before,after]of [['kind="metrics"','kind="permissions"'],['number="01"','number="02"'],['sources="06 10"','sources="06"'],['lang="fr"','lang={"fr"}'],['<details>','<aside>']]){assert.ok(raw.includes(before),before);assert.throws(()=>articleFigures(raw.replace(before,after),'fr'));}
});
test('comma-delimited coordinate pairs are consumed completely without accepting malformed comma runs',()=>{
 assert.deepEqual(pathPoints('M 1,2 L 3,4 L 5,-6'),[[1,2],[3,4],[5,-6]]);
 for(const d of ['M,1 2','M1,,2','M1, 2','M1 2,','M1 2 L,3 4','M1 2 , L3 4'])assert.throws(()=>pathPoints(d));
});
test('render-only source citations preserve all64 raw URL attributes and every other supplied field',()=>{
 componentSourceAnchors();let total=0;
 for(const v of variants){const adapted=renderOnlySvg(v.svg),roots=htmlNodes(parse(adapted)).filter(n=>n.tagName==='svg');assert.equal(roots.length,1);const root=roots[0];assert.equal(root.attrs.filter(a=>a.name==='style').length,1);assert.equal(root.attrs.find(a=>a.name==='style').value,'width:100%;height:auto');
  const links=htmlNodes(root).filter(n=>n.tagName==='a');assert.deepEqual(links.map(n=>n.attrs),originalNavigation[v.key].map(url=>[{name:'href',value:renderedSourceAnchors[url]}]));total+=links.length;
  for(const link of links){const href=link.attrs[0].value;assert.match(href,/^#source-s(?:0[1-9]|1[0-9]|2[0-7])$/u);assert.ok(htmlNodes(link).filter(n=>n.nodeName==='#text').map(n=>n.value).join('').includes(href.slice(-3).toUpperCase()));}
  const projection=restoreSourceNavigation({...root,attrs:root.attrs.filter(a=>a.name!=='style')});assert.equal(digest(JSON.stringify(canonical(projection))),textCorrections[v.key]?.expectedDomHash??originals[v.key].domHash);
  let inverse=adapted.replace('<svg style="width:100%;height:auto" ','<svg ');for(const[target,url]of Object.entries(originalSourceAnchors))inverse=inverse.replaceAll(` href="${target}"`,` href="${url}"`);assert.equal(inverse,v.svg);
 }
 assert.equal(total,64);assert.equal(Object.keys(renderedSourceAnchors).length,13);
 for(const lang of ['fr','en']){const tree=createProcessor().parse(read(`src/content/${lang==='fr'?'posts/starshield-ukraine-controle-connexion':'posts-en/starshield-ukraine-terms-of-connection'}.mdx`).replace(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/u,'')),all=mdxNodes(tree);
  for(const[url,target]of Object.entries(renderedSourceAnchors)){const matches=all.filter(n=>n.name==='li'&&n.attributes.some(a=>a.name==='id'&&a.value===target.slice(1)));assert.equal(matches.length,1);assert.ok(mdxNodes(matches[0]).some(n=>n.name==='a'&&n.attributes.some(a=>a.name==='href'&&a.value===url)));}
 }
 for(const url of ['https://example.org/','javascript:alert(1)','__proto__','#source-s06'])assert.throws(()=>renderOnlySvg(`<svg ><a href="${url}"></a></svg>`));
});

test('elliptical arcs include actual extrema for both sweeps, large arcs, rotated ellipses and corrected radii',()=>{
 const box=(d)=>pointsBox(pathPoints(d)),expect=(actual,wanted)=>Object.keys(wanted).forEach(k=>near(actual[k],wanted[k]));
 assert.deepEqual(pathPoints('M40 0 L0 0 0 40'),[[40,0],[0,0],[0,40]]);
 assert.deepEqual(pathPoints('M0 0 1 1 2 3'),[[0,0],[1,1],[2,3]]);
 expect(box('M10 0 A10 10 0 0 1 0 10'),{x:0,y:0,right:10,bottom:10});
 expect(box('M10 0 A10 10 0 1 1 0 10'),{x:0,y:0,right:20,bottom:20});
 expect(box('M-10 0 A10 5 0 0 1 10 0'),{x:-10,y:-5,right:10,bottom:0});
 expect(box('M-10 0 A10 5 0 0 0 10 0'),{x:-10,y:0,right:10,bottom:5});
 expect(box('M0 -10 A10 5 90 0 1 0 10'),{x:0,y:-10,right:5,bottom:10});
 expect(box('M-10 0 A1 1 0 0 1 10 0'),{x:-10,y:-10,right:10,bottom:0});
 expect(box('M-10 0 A-10 -5 0 0 1 10 0'),{x:-10,y:-5,right:10,bottom:0});
 expect(box('M1 2 A0 5 20 0 1 8 9'),{x:1,y:2,right:8,bottom:9});
 expect(box('M1 2 A5 5 20 1 1 1 2'),{x:1,y:2,right:1,bottom:2});
 const s=Math.sqrt(50),extent=Math.sqrt(62.5),first=arcPoints([-s,-s],[10,5],45,0,1,[s,s]),second=arcPoints([-s,-s],[10,5],45,0,0,[s,s]);
 expect(pointsBox([...first,...second]),{x:-extent,y:-extent,right:extent,bottom:extent});
 for(const d of ['M0 0 A1 1 0 2 0 1 1','M0 0 A1 1 0 0 -1 1 1','M0 0 A1 1 0 0 1 1','M0 0 A1 1 0 0 1 1 1 trailing','M0 0 a1 1 0 0 1 1 1','M0 0 '+'A1 1 0 0 1 1 1 '.repeat(300)])assert.throws(()=>pathPoints(d));
});

test('relative line and close commands preserve every supplied point and reject malformed input within a deadline',()=>{
 assert.deepEqual(pathPoints('M10 20 l2 -3 l-4 5 L30 40 z'),[[10,20],[12,17],[8,22],[30,40],[10,20]]);
 assert.deepEqual(pathPoints('M0 0 L10 5 L0 10 z'),[[0,0],[10,5],[0,10],[0,0]]);
 const bad=['l0 0','M0 0 l1','M0 0 l1 2 trailing','M0 0 z 1 2','M0 0 m1 2','M0 0 l1e9 0','M9999 0 l2 0','M0 0 '+'l1 1 '.repeat(513)];
 for(const raw of bad)assert.throws(()=>pathPoints(raw));
 const code=`import assert from 'node:assert/strict';const number=${number.toString()};const curvePoints=${curvePoints.toString()};const arcPoints=${arcPoints.toString()};const paths=${pathPoints.toString()};for(let i=0;i<100;i++)for(const raw of ${JSON.stringify(bad)})assert.throws(()=>paths(raw));`;
 execFileSync(process.execPath,['--input-type=module','-e',code],{timeout:5000,maxBuffer:8192,stdio:'pipe'});
});
test('exact source navigation and inert metadata reject URL substitutions, extra attributes and changed source IDs',()=>{
 const v=variants[0];
 for(const url of ['javascript:alert(1)','data:text/html,x','http://www.foreign.senate.gov/','https://www.foreign.senate.gov.attacker.example/x','https://example.org/x',navigationUrls.find(u=>u!==originalNavigation[v.key][0])])assert.throws(()=>inspect(mutate(v,(_,ns)=>{attrs(ns.find(n=>tag(n)==='a')).href=url;})));
 for(const field of ['target','onclick','download','hrefLang'])assert.throws(()=>inspect(mutate(v,(_,ns)=>{attrs(ns.find(n=>tag(n)==='a'))[field]='changed';})));
 for(const change of [m=>{m.sources[0].url='https://example.org/x';},m=>{m.sources[0].id='__proto__';},m=>{m.extra=true;},m=>{m.sources[0].publication_date='yesterday';}])assert.throws(()=>inspect(mutate(v,(_,ns)=>{const n=ns.find(n=>tag(n)==='metadata'),m=JSON.parse(xmlText(n));change(m);n.metadata=[{'#text':JSON.stringify(m)}];})));
});
test('S03 metadata retains the reviewed calendar day and rejects the unauthenticated timestamp',()=>{
 for(const v of variants.filter(v=>v.kind==='chronology')){
  const m=JSON.parse(xmlText(inspect(v).nodes.find(n=>tag(n)==='metadata')));assert.equal(m.sources.find(s=>s.id==='S03').publication_date,'2026-10-16');
  assert.throws(()=>inspect(mutate(v,(_,ns)=>{const n=ns.find(n=>tag(n)==='metadata'),data=JSON.parse(xmlText(n));data.sources.find(s=>s.id==='S03').publication_date='2026-10-16T17:29:00Z';n.metadata=[{'#text':JSON.stringify(data)}];})));
 }
});
test('all24 title surfaces and approved capacity intertitles use concrete framing',()=>{
 for(const v of variants){const ns=inspect(v).nodes,title=xmlText(ns.find(n=>tag(n)==='title'));assert.doesNotMatch(title,/—|\b(?:ce que|ce qui|what\b|two clocks|different clocks|deux horloges|2 horloges)|, (?:pas|not) /iu);
  const headings=ns.filter(n=>tag(n)==='text'&&attrs(n)['font-weight']==='700').map(xmlText);for(const h of headings)assert.doesNotMatch(h,/—|\b(?:ce que|ce qui|what\b|two clocks|different clocks|deux horloges|2 horloges)|, (?:pas|not) /iu);
  if(v.kind==='capacity'){assert.equal(title,v.lang==='fr'?'CENTAURE : financer un droit de capacité':'CENTAURE purchases defined capacity rights');for(const label of v.lang==='fr'?['Les clauses de capacité']:v.mobile?['Capacity terms','and service rights']:['Capacity terms and service rights'])assert.ok(headings.includes(label));}
 }
});
const near=(actual,expected,tolerance=1e-7)=>assert.ok(Math.abs(actual-expected)<=tolerance,`${actual} ≈ ${expected}`);
function quantitativeGeometry(v){
 const{root,nodes}=inspect(v),labels=nodes.filter(n=>tag(n)==='text').map(xmlText),has=s=>assert.ok(labels.some(t=>t.includes(s)),`${v.key}: ${s}`);
 if(v.kind==='metrics'){near(100*1.609344,160.9344);for(const unit of ['100 mph','160 km/h','Mbit/s','ms'])has(unit);has(v.lang==='fr'?'seuil rapporté':'reported threshold');assert.equal(scene(root).filter(n=>tag(n)==='rect'&&attrs(n).fill==='#142638').length,3);}
 if(v.kind==='capacity'){const ceiling=300,firm=115,width=v.mobile?420:1070,bars=scene(root).filter(n=>tag(n)==='rect'&&value(n,'height')===(v.mobile?60:75));assert.equal(bars.length,2);near(value(bars[0],'width'),width);near(value(bars[1],'width'),width*firm/ceiling);near(firm/ceiling,23/60);has(v.lang==='fr'?'≈ 115 M€':'≈ €115m');has(v.lang==='fr'?'≈ 300 M€':'≈ €300m');has(v.lang==='fr'?'4 ans':'4 years');has(v.lang==='fr'?'8 ans':'8 years');has(v.lang==='fr'?'hors TVA':'excluding VAT');}
 if(v.kind==='chronology')for(const date of ['14 OCT','15 OCT','16 OCT','17 OCT'])has(date);
 if(v.kind==='milestones'){for(const year of ['2026','2027','2028','2029','2030'])has(year);has('GOVSATCOM');has('IRIS²');}
 if(v.kind==='dependency'){assert.equal(labels.filter(t=>t===(v.lang==='fr'?'Contrat A':'Contract A')).length,2);assert.equal(labels.filter(t=>t===(v.lang==='fr'?'Contrat B':'Contract B')).length,2);}
}
test('independent unit conversion, capacity ratio and declared timeline labels agree with source geometry',()=>{for(const v of variants)quantitativeGeometry(v);});
test('quantitative and marker guards detect changed bar lengths, reported units and arrow geometry',()=>{
 const capacity=variants.find(v=>v.kind==='capacity'&&!v.mobile&&v.lang==='fr');assert.throws(()=>quantitativeGeometry(mutate(capacity,(_,ns)=>{attrs(ns.find(n=>tag(n)==='rect'&&attrs(n).fill==='#78ddcb')).width='415';})));
 const metrics=variants[0];assert.throws(()=>quantitativeGeometry(mutate(metrics,(_,ns)=>{const n=ns.find(n=>tag(n)==='text'&&xmlText(n)==='100 mph');n.text=[{'#text':'100 Mbit/s'}];})));
 assert.throws(()=>faithful(mutate(metrics,(_,ns)=>{attrs(ns.find(n=>tag(n)==='marker')).refX='8';})));
});
