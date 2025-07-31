# Web3 Crowdfunding App

A decentralized crowdfunding platform built with **Next.js 15**, **React 19**, **TypeScript** and powered by **thirdweb SDK** & smart contracts on the Ethereum Sepolia testnet.

As a decentralized application (**dApp**), all core logic lives on-chain, ensuring trustless fund management and transparent campaign outcomes without relying on a centralized server.

## Features

- Create crowdfunding campaigns with goal amount, deadline and description.
- Contribute ETH to active campaigns from any wallet.
- Real-time campaign statistics (raised amount, backers, time left).
- Automatic campaign success / failure logic enforced by smart contracts.
- Campaign owner can withdraw funds when the goal is met and the deadline has passed.
- Responsive UI styled with Tailwind CSS.
- Transaction status and wallet connection handled by thirdweb React SDK.
- Live USD conversion for raised ETH via the CoinGecko API.

## How it works

1. The creator deploys a `CampaignFactory` contract (via thirdweb dashboard or CLI).
2. The web app lets the creator spin up new `Campaign` contracts through the factory.
3. Contributors call the `fund` function of a campaign contract to pledge ETH.
4. The contract tracks contributions and enforces the deadline & funding goal.
5. On success, the campaign owner can call `withdraw`; otherwise contributors can `refund` (coming soon).

## Tech stack & dependencies

Runtime dependencies (see `package.json`):

| Package | Version | Purpose |
|---------|---------|---------|
| `next` | ^15 | React App Router framework |
| `react`, `react-dom` | ^19 | UI rendering |
| `thirdweb` | ^5 | Wallet connection & contract interaction |
| `ethers` | ^6 | Low-level Ethereum utilities |

Dev / styling:

| Package | Version | Purpose |
|---------|---------|---------|
| `tailwindcss`, `postcss`, `autoprefixer` | ^3 / ^8 / ^10 | Utility-first CSS |
| `typescript` | ^5 | Static typing |
| `eslint`, `eslint-config-next` | ^8 / 14 | Linting |

## thirdweb specifics

The project uses **thirdweb V5** SDK:

- `client` is created in `src/app/client.ts` with your `CLIENT_ID`.
- Hooks such as `useReadContract`, `useActiveAccount`, and `TransactionButton` make contract reads/writes trivial.
- Default chain is **Sepolia**, but you can switch to any EVM network by changing the `chain` param.
- Get your **CLIENT_ID** from the [thirdweb dashboard](https://thirdweb.com/dashboard) → Settings → API Keys.

## Getting Started

1. **Clone & install**

```bash
git clone <repo>
cd web3-crowdfunding-app
yarn
```

2. **Configure environment**

Create a `.env.local` file and add:

```bash
CLIENT_ID=YOUR_THIRDWEB_CLIENT_ID
```

3. **Run locally**

```bash
yarn dev
```

4. **Build / preview production**

```bash
yarn build
yarn start
```

## Folder structure

```
src/
└── app/
    ├── components/         # Reusable UI pieces (CampaignCard, CampaignWithdraw, …)
    ├── campaign/[address]/  # Dynamic campaign page
    ├── constants/          # Contract ABIs & addresses
    └── …
```

## Resources

- [thirdweb Documentation](https://portal.thirdweb.com/typescript/v5)
- [Next.js Documentation](https://nextjs.org/docs)

## License

MIT
