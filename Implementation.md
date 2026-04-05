# Voting DApp Overhaul - Implementation Plan

## Step 1: Scaffold Next.js project - DONE
- Removed `client/` directory
- Scaffolded Next.js 15 with TypeScript, Tailwind v4, ESLint, App Router
- Installed: wagmi v2, viem v2, @web3modal/wagmi, ethers v6, hardhat v2.22

## Step 2: Update Tailwind config - DONE
- Added semantic colors in `src/app/globals.css` using Tailwind v4 `@theme`:
  - `#1F2544` → `deep-navy`
  - `#474F7A` → `muted-blue`
  - `#81689D` → `soft-purple`
  - `#FFD0EC` → `light-pink`

## Step 3: Fix & improve smart contract
- Add events to `Voting.sol`: `VoteCast`, `VotingEnded`
- Add `getWinner()` view function
- Fix `scripts/deploy.js` (fix variable name, pass constructor args correctly)
- Add Sepolia network config to `hardhat.config.js`
- Write proper tests in `test/Voting.js` (replacing `test/Lock.js`)

## Step 4: Create wagmi config & Next.js root layout - DONE
- `src/config/wagmi.ts` — wagmi config with Sepolia, HTTP transport, injected + WalletConnect connectors
- `src/components/providers/Web3ModalProvider.tsx` — WagmiProvider + QueryClientProvider wrapper, Web3Modal with dark theme & brand colors
- `src/app/layout.tsx` — metadata updated, Web3ModalProvider wrapper, semantic colors applied
- `.env.example` — all env vars documented (WalletConnect ID, RPC URL, contract address, private key, Etherscan, Neon DB)
- Build passes successfully

## Step 5: Build core components - DONE
- `src/components/layout/Header.tsx` — navigation bar with Vote/Results tabs + `w3m-button`
- `src/components/wallet/ConnectWallet.tsx` — disconnect button
- `src/components/voting/CandidateSelector.tsx` — clickable candidate cards with selection highlighting
- `src/components/voting/CountdownTimer.tsx` — real-time countdown with drift-corrected tick every 1s, re-sync at `initialSeconds` prop change
- `src/components/voting/VotingTable.tsx` — candidate list with live vote counts, share bars
- `src/components/voting/TxStatusModal.tsx` — pending/confirming/rejected transaction states + Etherscan link
- `src/components/results/ResultsPage.tsx` — winner card, bar chart, voter stats, percentage breakdown
- `src/hooks/useVoting.ts` — wagmi hooks: read candidates/vote status/votingActive/remainingTime, write vote, tx status
- `src/lib/abi.ts` — Voting ABI + contract address
- `src/types/custom-elements.d.ts` — JSX type declarations for web3modal custom elements
- `src/app/voting/page.tsx` — voting page integrating all components (wallet connect gate, tx modal)
- `src/app/results/page.tsx` — results page with live/final views
- `src/app/page.tsx` — redirects to `/voting`
- Contract deployed to Sepolia: `0x214AE6C5Cc1da15b76C9255f961c0817e778616C` (RPC: `https://ethereum-sepolia-rpc.publicnode.com`)
- Build passes cleanly (only optional peer dep warnings from web3modal/wagmi)

## Step 6: Set up Neon DB & API routes
- `src/components/wallet/ConnectWallet.tsx` — wagmi ConnectButton
- `src/components/voting/CandidateSelector.tsx` — clickable cards instead of numeric input
- `src/components/voting/CountdownTimer.tsx` — real-time HH:MM:SS countdown, drift-corrected every 15s from chain
- `src/components/voting/VotingTable.tsx` — candidate list with live vote counts
- `src/components/voting/TxStatusModal.tsx` — pending/confirmed/rejected transaction states
- `src/components/results/ResultsPage.tsx` — winner card, bar chart, voter stats
- `src/components/layout/Header.tsx` — navigation (Vote | Results)

## Step 6: Build pages
- `src/app/page.tsx` — landing redirect to `/voting`
- `src/app/voting/page.tsx` — main voting interface (uses CandidateSelector, CountdownTimer, VotingTable)
- `src/app/results/page.tsx` — results display

## Step 7: Set up Neon DB & API routes
- Schema (3 tables):
  - `vote_records` — voter_address, candidate_index, tx_hash, block_number, voted_at
  - `voting_sessions` — contract_address, chain_id, candidate_names[], duration, start/end times
  - `candidates` — session_id, name, chain_index, vote_count_cache
- `src/lib/db.ts` — Neon `@neondatabase/serverless` client
- API routes:
  - `GET /api/candidates` — cached candidate list, chain refetch if stale >30s
  - `POST /api/vote` — record confirmed vote in DB (analytics only, chain is source of truth)
  - `GET /api/results` — aggregated vote counts from DB
  - `GET /api/voting-status` — active/inactive + remaining seconds
  - `POST /api/sync` — manual chain→DB sync (for Vercel Cron)

## Step 8: Vercel deployment config
- `vercel.json` with cron job hitting `/api/sync` every 5 min during active voting
- `.env.example` documenting all required env vars

## Verification
1. `npx hardhat test` — all Solidity tests pass
2. `npm run dev` — Next.js starts, voting UI renders, wallet connects
3. Test voting flow with Sepolia testnet — vote confirms, countdown ticks, results update
4. Test DB sync — `/api/candidates` returns cached data, `/api/sync` updates from chain
