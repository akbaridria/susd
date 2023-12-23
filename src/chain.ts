import { Chain } from '@wagmi/core'

export const tomoTestnet = {
  id: 89,
  name: 'Tomo Testnet',
  network: 'Tomo Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Tomo Testnet',
    symbol: 'TOMO',
  },
  rpcUrls: {
    public: { http: ['https://rpc.testnet.tomochain.com'] },
    default: { http: ['https://rpc.testnet.tomochain.com'] },
  },
  blockExplorers: {
    etherscan: { name: 'Tomoscan', url: 'https://testnet.tomoscan.io' },
    default: { name: 'Tomoscan', url: 'https://testnet.tomoscan.io' },
  }
} as const satisfies Chain
