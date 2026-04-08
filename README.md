# Voting DApp — On-Chain Transparent Voting

A customizable, tamper-proof voting application built on Ethereum Sepolia. Every vote is permanently recorded on-chain, publicly verifiable, and immutable.

> **Note:** This is a demonstration/educational project. See [Security & Limitations](#security--limitations) below.

## Features

- **On-Chain Transparency** — every vote is recorded on-chain via smart contract
- **Admin-Deployed Elections** — create new voting sessions with custom candidates and duration
- **Live Vote Sync** — blockchain votes synced to Neon Postgres for fast queries
- **Real-Time Results** — cached counts update as votes are cast
- **Scheduled Sync** — GitHub Actions automatically syncs votes every 5 minutes
- **Responsive UI** — Next.js 15 + Tailwind CSS v4 with custom theme colors
- **MetaMask + WalletConnect** — supports dozens of wallet providers

## Tech Stack

- **Frontend:** Next.js 15 (App Router), TypeScript, Tailwind CSS v4
- **Web3:** wagmi v2, viem v2, @web3modal/wagmi (WalletConnect Cloud)
- **Smart Contracts:** Solidity, Hardhat v2
- **Database:** Neon Postgres (serverless) with `@neondatabase/serverless`
- **Deployment:** Vercel with GitHub Actions for cron jobs
- **Design System:** Semantic theme colors: deep-navy, muted-blue, soft-purple, light-pink

## Quick Deploy (Vercel)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/rudrakumar2012/votingdapp&env=DATABASE_URL,NEXT_PUBLIC_CONTRACT_ADDRESS,SEPOLIA_RPC_URL,NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,OWNER_ADDRESS,PRIVATE_KEY,ETHERSCAN_API_KEY&env-description=See%20.env.example%20for%20details)

1. Click the button above (requires GitHub repo access)
2. Add environment variables (see below)
3. Deploy → you get a production URL
4. Add GitHub Actions secret `APP_URL` with your Vercel URL for auto-sync
5. See [DEPLOY.md](./DEPLOY.md) for full guide

## Getting Started (Local Development)

```bash
# Install dependencies
npm install

# Copy and configure environment variables
cp .env.example .env
# Edit .env with your values (NEON DB, Sepolia RPC, WalletConnect ID)

# Run the development server
npm run dev
```

Open **http://localhost:3000** in your browser.

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (hot reload) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npx hardhat test` | Run Solidity unit tests (21 tests) |
| `npx hardhat compile` | Compile smart contracts |

### Environment Variables

See `.env.example` for up-to-date list:

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | Neon Postgres connection string |
| `NEXT_PUBLIC_CONTRACT_ADDRESS` | Yes | Deployed Voting contract address |
| `SEPOLIA_RPC_URL` | Yes | Ethereum Sepolia RPC endpoint |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | Yes | WalletConnect Cloud project ID |
| `OWNER_ADDRESS` | Yes | Admin wallet address (for `/admin` page access) |
| `PRIVATE_KEY` | Yes (Production only) | Deployer account private key (for `/api/deploy`) |
| `ETHERSCAN_API_KEY` | Optional | Etherscan API key for contract verification |

## Project Structure

```
├── contracts/                    # Solidity smart contracts
│   └── Voting.sol               # Core voting contract
│   └── test/Voting.js           # Hardhat tests (21 passing)
├── scripts/
│   └── deploy.js                # Deployment script
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── page.tsx             # Landing page
│   │   ├── voting/page.tsx      # Voting wizard
│   │   ├── results/page.tsx     # Results page
│   │   ├── admin/page.tsx       # Admin deploy form
│   │   └── api/                 # API routes
│   │       ├── candidates/      # GET candidates
│   │       ├── config/          # GET/POST contract config
│   │       ├── deploy/          # POST new contract deployment
│   │       ├── results/         # GET vote results
│   │       ├── sync/            # POST blockchain sync
│   │       ├── vote/            # POST submit vote
│   │       ├── voter/history    # GET voter history
│   │       └── voting-status/   # GET voting status
│   ├── components/
│   │   ├── layout/              # Header, LandingPage
│   │   ├── voting/              # CandidateSelector, CountdownTimer, StepWizard, TxStatusModal, VoteReceipt
│   │   ├── results/             # Results chart
│   │   ├── wallet/              # ConnectWallet, WalletConnectButton
│   │   ├── ui/                  # Radix UI components (Card, Button, etc.)
│   │   └── providers/           # Web3ModalProvider
│   ├── hooks/
│   │   └── useVoting.ts         # Main voting logic (wagmi + auto-refetch)
│   ├── lib/
│   │   ├── abi.ts               # Contract ABI & event parsing
│   │   ├── db.ts                # Neon DB client
│   │   ├── schema.sql           # DB schema (tables & indexes)
│   │   └── init-db.ts           # DB initialization script
│   ├── config/
│   │   └── wagmi.ts             # wagmi client config
│   └── types/
│       └── index.d.ts           # Global TypeScript declarations
├── hardhat.config.js             # Hardhat config (Solidity compiler, networks)
├── vercel.json                   # Vercel functions & cron config (if Pro plan)
├── .env.example                  # Environment variable template
├── DEPLOY.md                     # Full deployment guide
└── README.md                     # This file
```

## Voting Flow

### For Voters
1. **Connect Wallet** — Use MetaMask or any WalletConnect-compatible wallet
2. **View Candidates** — See current candidates and live vote counts (from cache)
3. **Select Candidate** — Step 1: Choose one candidate
4. **Confirm** — Step 2: Review and submit transaction (pay gas)
5. **Receipt** — See transaction hash, block number, timestamp
6. **Auto-Redirect** — After 2 seconds, redirect to `/results` page
7. **Result** — View live results; your vote is now reflected

### For Admins (Owner Only)
1. Navigate to `/admin` (must be connected with `OWNER_ADDRESS`)
2. Fill deployment form:
   - **Candidates** (JSON array): `["Alice", "Bob", "Charlie"]`
   - **Duration** (minutes): e.g., `5` for 5-minute election
3. Click **Deploy**
4. New contract address is stored in `active_contract` table
5. The app automatically uses the new contract — no env var changes needed!

## Smart Contract

- **Network:** Sepolia (Chain ID: 11155111)
- **RPC:** `https://ethereum-sepolia-rpc.publicnode.com`
- **Compiled with:** Solidity 0.8.28
- **Tests:** 21/21 passing (Hardhat)

### Contract Functions
- `vote(uint256 candidateIndex)` — cast vote (1 per address)
- `endVoting()` — closes election (only owner)
- `getWinner()` → `(string name, uint256 votes)` — get current winner
- `getAllVotesOfCandiates()` → `Candidate[]` — all candidates + vote counts
- `votingActive()` → `bool` — is election open
- `getRemainingTime()` → `uint256` — seconds left
- Events: `VoteCast(address voter, uint256 candidateIndex, string candidateName)`, `VotingEnded(string winner, uint256 votes)`

## Database Schema (Neon Postgres)

```sql
-- Candidates table (cached vote counts)
candidates: chain_index, name, vote_count_cache, deployed_at

-- Vote records (on-chain votes)
vote_records: id, voter_address, candidate_index, tx_hash, block_number, created_at

-- Voting sessions (track deployed contracts)
voting_sessions: id, contract_address, deployed_at, ended_at

-- Sync state (last synced block)
sync_state: id, last_synced_block, last_sync_at

-- Active contract (single row)
active_contract: id, contract_address
```

## Security & Limitations ⚠️

### Known Vulnerabilities

#### Sybil Attack (Critical)
**The Problem:** The current implementation uses "one wallet = one vote." However, anyone can create unlimited Ethereum addresses and vote multiple times. There is **no Sybil resistance** in this system.

**Why This Matters:** A malicious actor can:
- Generate 1000+ wallets (using one mnemonic)
- Fund each with a small amount of ETH
- Vote 1000 times, effectively hijacking the election

**Mitigations (Not Implemented Here):**
1. **Token-weighted voting:** 1 token = 1 vote (natural barrier — buying tokens affects price)
2. **Proof of Personhood:** Use Worldcoin, BrightID, or Gitcoin Passport attestations
3. **KYC Whitelist:** Admin manually approves eligible voter addresses
4. **Quadratic Voting:** Cost scales quadratically to prevent whales
5. **Reputation systems:** Non-transferable reputation tokens earned via contribution
6. **One Per Device:** Fingerprinting (privacy-invasive, easily bypassed)

**Bottom Line:** This dapp is **not suitable for real-world elections, governance, or any scenario requiring electoral integrity**. It's an educational demonstration of on-chain voting mechanics.

#### Other Assumptions & Risks
- **Trusted Admin:** The `OWNER_ADDRESS` can deploy unlimited contracts. If compromised, attacker can flood DB with fake elections.
- **RPC Reliability:** Sync depends on external RPC. If `SEPOLIA_RPC_URL` goes down, voting continues but results lag.
- **Database as Cache:** The Postgres DB is a performance cache, not the source of truth. Source of truth is the blockchain.
- **No Vote Privacy:** All votes are public on-chain (address + candidate visible).
- **No Voter Suppression Protection:** Owner could call `endVoting()` early to disenfranchise late voters.
- **No Recounts/Disputes:** No mechanism for challenge or audit beyond reading blockchain directly.
- **Testnet Only:** Deployed on Sepolia, which has no real economic value. Testnet ETH is free, so Sybil cost is near-zero.

### Do NOT Use This For:
- Political elections
- Corporate governance (unless highly trusted, small group)
- Any legally-binding decisions
- High-value token allocations
- Anything requiring regulatory compliance

### Suitable Use Cases:
- Educational demos and workshops
- Internal team polls (trusted environment)
- Game mechanics/voting within a dApp (where multiple accounts are same user anyway)
- Testing smart contract integration patterns
- Prototyping before adding proper Sybil resistance

## Deployment

See [DEPLOY.md](./DEPLOY.md) for complete guide.

### Vercel (Recommended)
1. Push code to GitHub
2. Import repo into Vercel
3. Add all environment variables
4. Deploy
5. Add `APP_URL` secret to GitHub Actions for automatic sync

### Free Plan Considerations
- Vercel Hobby plan **cannot** use cron jobs with `*/5 * * * *` (max 1/day)
- The repo includes `.github/workflows/sync.yml` as a free alternative (uses GitHub Actions)
- After deploy, set `APP_URL` secret to your Vercel URL
- Sync runs every 5 minutes automatically

## License

MIT — feel free to fork, modify, and use for learning. Please respect the license.

## Credits

Built with [Next.js](https://nextjs.org/), [wagmi](https://wagmi.sh/), [Tailwind CSS](https://tailwindcss.com/), [Hardhat](https://hardhat.org/), [Neon](https://neon.tech/). Favicon inspired by minimalist geometric design.
