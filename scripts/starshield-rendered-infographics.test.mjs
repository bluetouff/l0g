import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { parse } from 'parse5';
const pages=['fr','en'].map(lang=>({lang,html:readFileSync(new URL(`../dist/${lang==='fr'?'posts/starshield-ukraine-controle-connexion':'en/analysis/starshield-ukraine-terms-of-connection'}/index.html`,import.meta.url),'utf8')}));
const nodes=n=>[n,...(n.childNodes??[]).flatMap(nodes)];
const attr=(n,k)=>n.attrs?.find(a=>a.name===k)?.value;
const text=n=>n.nodeName==='#text'?n.value:(n.childNodes??[]).map(text).join('');
const canonical=n=>n.nodeName==='#text'?['#text',n.value]:[n.tagName,(n.attrs??[]).map(a=>[a.name,a.value]).sort(([a],[b])=>a<b?-1:a>b?1:0),(n.childNodes??[]).filter(c=>c.nodeName!=='#text'||c.value.trim()||['text','tspan','title','desc','metadata','style'].includes(n.tagName)).map(canonical)];
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
function restoreSourceNavigation(node){return {...node,attrs:node.attrs?.map(a=>a.name==='href'?{...a,value:originalSourceAnchors[a.value]}:a),childNodes:node.childNodes?.map(restoreSourceNavigation)};}
const kinds=["metrics", "permissions", "chronology", "dependency", "capacity", "milestones"];
const references={"metrics": "06 10", "permissions": "06 09 10", "chronology": "01 02 03 04 05 06 07 08", "dependency": "24 25", "capacity": "12 13 14", "milestones": "15 16 17 18 19 20"};
const classes=(n,name)=>(attr(n,'class')??'').split(/\s+/u).includes(name);
function figures(tree,lang){
 const all=nodes(tree),selected=all.filter(n=>n.tagName==='figure'&&classes(n,'starshield-figure'));assert.equal(selected.length,6);
 for(const[i,figure]of selected.entries()){
  const number=String(i+1).padStart(2,'0');assert.deepEqual(['id','data-figure','data-kind'].map(k=>attr(figure,k)),[`figure-${number}`,number,kinds[i]]);
  const roots=nodes(figure).filter(n=>n.tagName==='svg');assert.equal(roots.length,2);
  for(const[j,root]of roots.entries()){
   const key=`${kinds[i]}-${lang}-${j?'mobile':'desktop'}`,prefix=`ss-${lang}-${i+1}-${j?'m':'d'}`;
   const expected={xmlns:'http://www.w3.org/2000/svg',viewBox:originals[key].viewBox,role:'img','aria-labelledby':`${prefix}-title ${prefix}-desc`,style:'width:100%;height:auto'};
   const sorted=values=>values.sort(([a],[b])=>a<b?-1:a>b?1:0);assert.deepEqual(sorted(root.attrs.map(a=>[a.name,a.value])),sorted(Object.entries(expected)));
   // Restore only exact reviewed source hrefs and remove the asserted root style for the complete original-tree comparison.
   const sourceLinks=nodes(root).filter(n=>n.tagName==='a');
   for(const link of sourceLinks){const target=attr(link,'href');assert.deepEqual(link.attrs,[{name:'href',value:target}]);assert.ok(Object.hasOwn(originalSourceAnchors,target));assert.ok(text(link).includes(target.slice(-3).toUpperCase()));const found=all.filter(n=>attr(n,'id')===target.slice(1));assert.equal(found.length,1);assert.ok(nodes(found[0]).some(n=>n.tagName==='a'&&attr(n,'href')===originalSourceAnchors[target]));}
   const projection=restoreSourceNavigation({...root,attrs:root.attrs.filter(a=>a.name!=='style')}),hash=createHash('sha256').update(JSON.stringify(canonical(projection))).digest('hex');
   assert.equal(hash,textCorrections[key]?.expectedDomHash??originals[key].domHash,`${key}: all supplied fields, glyph strings and element order`);
   assert.ok(classes(root.parentNode,`starshield-${j?'mobile':'desktop'}`));
   for(const type of ['title','desc']){const found=nodes(root).filter(n=>n.tagName===type);assert.equal(found.length,1);assert.equal(attr(found[0],'id'),`${prefix}-${type}`);assert.ok(text(found[0]).trim());}
  }
  const caption=nodes(figure).filter(n=>n.tagName==='figcaption');assert.equal(caption.length,1);assert.ok(text(caption[0]).length>70);
  const refs=references[kinds[i]].split(' '),links=nodes(caption[0]).filter(n=>n.tagName==='a');assert.deepEqual(links.map(n=>[attr(n,'href'),text(n)]),refs.map(id=>[`#source-s${id}`,`[S${id}]`]));
  for(const id of refs)assert.equal(all.filter(n=>attr(n,'id')===(`source-s${id}`)).length,1);
  const details=nodes(figure).filter(n=>n.tagName==='details');assert.equal(details.length,1);assert.equal(nodes(details[0]).filter(n=>n.tagName==='summary').length,1);assert.ok(text(details[0]).length>100);
 }
 assert.equal(selected.flatMap(f=>nodes(f).filter(n=>n.tagName==='svg').flatMap(root=>nodes(root).filter(n=>n.tagName==='a'))).length,32);
 const ids=all.map(n=>attr(n,'id')).filter(Boolean);assert.equal(new Set(ids).size,ids.length,'Every document ID remains unique');
}
function setAttribute(n,k,value){const a=n.attrs.find(a=>a.name===k);if(a)a.value=value;else n.attrs.push({name:k,value});}
test('compiled FR/EN preserve24 complete supplied trees and six accessible figures each',()=>{for(const page of pages)figures(parse(page.html),page.lang);});
test('compiled SVG checks detect changed native geometry, labels, styles, fonts and active nodes',()=>{
 const pick=tree=>nodes(tree).find(n=>n.tagName==='svg'&&attr(n,'aria-labelledby')==='ss-fr-1-d-title ss-fr-1-d-desc');
 for(const field of ['width','height','lang','id','viewBox','role','aria-labelledby','style']){const tree=parse(pages[0].html);assert.ok(pick(tree));setAttribute(pick(tree),field,'changed');assert.throws(()=>figures(tree,'fr'));}
 {const tree=parse(pages[0].html);pick(tree).attrs=pick(tree).attrs.filter(a=>a.name!=='style');assert.throws(()=>figures(tree,'fr'));}
 for(const[field,value]of [['font-family','Other'],['font-size','1'],['x','0'],['fill','url(https://example.org/x)']]){const tree=parse(pages[0].html),label=nodes(pick(tree)).find(n=>n.tagName==='text');assert.ok(label);setAttribute(label,field,value);assert.throws(()=>figures(tree,'fr'));}

 for(const type of ['script','foreignObject','image','animate']){const tree=parse(pages[0].html);pick(tree).childNodes.push({nodeName:type,tagName:type,attrs:[],childNodes:[]});assert.throws(()=>figures(tree,'fr'));}
 for(const type of ['text','title','desc','path']){const tree=parse(pages[0].html),n=nodes(pick(tree)).find(n=>n.tagName===type);assert.ok(n);if(type==='path')setAttribute(n,'d','M0 0 L9999 0');else n.childNodes=[{nodeName:'#text',value:'changed'}];assert.throws(()=>figures(tree,'fr'));}
});

test('compiled source navigation rejects external URLs, wrong citations, target changes and missing bibliography targets',()=>{
 const pick=tree=>nodes(tree).find(n=>n.tagName==='svg'&&attr(n,'aria-labelledby')==='ss-fr-1-d-title ss-fr-1-d-desc'),link=tree=>nodes(pick(tree)).find(n=>n.tagName==='a');
 for(const href of ['https://example.org/','https://www.foreign.senate.gov/download/letter-to-dodig-re-starlink-over-ukraine_-final-signed','#source-s10','#source-s99','javascript:alert(1)']){const tree=parse(pages[0].html);setAttribute(link(tree),'href',href);assert.throws(()=>figures(tree,'fr'));}
 for(const field of ['target','download','onclick']){const tree=parse(pages[0].html);setAttribute(link(tree),field,'changed');assert.throws(()=>figures(tree,'fr'));}
 {const tree=parse(pages[0].html);setAttribute(nodes(tree).find(n=>attr(n,'id')==='source-s06'),'id','removed');assert.throws(()=>figures(tree,'fr'));}
});
