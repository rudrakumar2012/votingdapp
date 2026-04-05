# VoteChain — Decentralized Voting DApp

A transparent, tamper-proof voting application built on the Ethereum Sepolia testnet. Every vote is recorded on-chain, publicly verifiable, and immutable.

**Live Demo:** https://votingdappin.netlify.app/

> A MetaMask (or WalletConnect-compatible) wallet on Sepolia testnet is required to vote.

## Features

- **On-Chain Transparency** — every vote is permanently recorded on Sepolia
- **One Person, One Vote** — wallet-based identity prevents duplicate voting
- **Live Results** — real-time vote counting that updates as votes are cast
- **Caching Layer** — Neon Postgres database for fast reads and analytics
- **Responsive UI** — works on desktop and mobile browsers

## Tech Stack

- **Frontend:** Next.js 15 (App Router), TypeScript, Tailwind CSS v4
- **Web3:** wagmi v2, viem v2, @web3modal/wagmi
- **Smart Contracts:** Solidity, Hardhat v2
- **Database:** Neon Postgres (@neondatabase/serverless)
- **Deployment:** Netlify (frontend), Vercel (planned)

## Getting Started

```bash
# Install dependencies
npm install

# Copy and configure environment variables
cp .env.example .env

# Run the development server
npm run dev
```

Open **http://localhost:3000** in your browser.

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npx hardhat test` | Run Solidity unit tests |
| `npx hardhat compile` | Compile smart contracts |

### Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | WalletConnect project ID |
| `SEPOLIA_RPC_URL` | Sepolia RPC endpoint |
| `NEXT_PUBLIC_CONTRACT_ADDRESS` | Deployed Voting contract address |
| `PRIVATE_KEY` | Deployer account private key |
| `ETHERSCAN_API_KEY` | Etherscan API key for verification |
| `DATABASE_URL` | Neon Postgres connection string |

## Project Structure

```
├── contracts/              # Solidity smart contracts
│   └── Voting.sol         # Core voting contract
├── test/                  # Hardhat tests
│   └── Voting.js
├── scripts/               # Deployment scripts
│   └── deploy.js
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── page.tsx      # Landing page (hero, features, FAQ)
│   │   ├── voting/page.tsx  # Voting wizard (step-by-step)
│   │   ├── results/page.tsx # Results display
│   │   └── api/          # API routes (DB-backed)
│   ├── components/       # React components
│   │   ├── layout/       # LandingPage, Header
│   │   ├── voting/       # CandidateSelector, CountdownTimer, StepWizard, VotingTable, TxStatusModal
│   │   ├── results/      # ResultsPage
│   │   ├── wallet/       # ConnectWallet, WalletConnectButton
│   │   └── providers/    # Web3ModalProvider
│   ├── hooks/            # React hooks (useVoting)
│   ├── lib/              # ABI, DB client, schema, init script
│   ├── config/           # wagmi configuration
│   └── types/            # TypeScript type declarations
├── hardhat.config.js     # Hardhat configuration
└── .env.example          # Environment variable template
```

## Smart Contract

- **Network:** Sepolia (Chain ID: 11155111)
- **Address:** `0x214AE6C5Cc1da15b76C9255f961c0817e778616C`
- **RPC:** `https://ethereum-sepolia-rpc.publicnode.com`

## How Voting Works

1. **Connect Wallet** — Link MetaMask or WalletConnect
2. **Choose Candidate** — Browse and select from the candidate grid
3. **Confirm & Vote** — Review selection, submit on-chain transaction
4. **View Results** — Watch votes count in real-time

Full workflow and codeflow is documented in [WORKFLOW.md](./WORKFLOW.md).

## License

MIT
