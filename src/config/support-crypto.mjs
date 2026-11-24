import { supportBitcoin } from './support-bitcoin.mjs';

const ethereumAddress = '0xA9Aae53FF8be7A8E60Dc8D295418f5af490392E9';
const solanaAddress = 'BJpTf4Fq4bL7oZaF1CDbkenTMHhTFeKhDEgA6WZ2QVar';

// Public receiving addresses. If a recipient changes, regenerate and decode
// its local QR before updating the QR integrity test.
export const supportCrypto = [
  { id: 'bitcoin', asset: 'BTC', network: 'Bitcoin', ...supportBitcoin },
  {
    id: 'ethereum', asset: 'ETH', network: 'Ethereum', address: ethereumAddress,
    uri: `ethereum:${ethereumAddress}@1`,
  },
  {
    id: 'solana', asset: 'SOL', network: 'Solana', address: solanaAddress,
    uri: `solana:${solanaAddress}`,
  },
];
