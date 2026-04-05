@AGENTS.md

## Overhaul Progress

### Step 2: Tailwind config - DONE
- Semantic colors added in `src/app/globals.css` using Tailwind v4 `@theme`:
  - `#1F2544` → `deep-navy`
  - `#474F7A` → `muted-blue`
  - `#81689D` → `soft-purple`
  - `#FFD0EC` → `light-pink`
- Use these class names everywhere (e.g., `bg-deep-navy`, `text-light-pink`)

### Step 3: Fix & improve smart contract - DONE
- Added `VoteCast` and `VotingEnded` events to `Voting.sol`
- Added `getWinner()` view function
- Added `endVoting()` function with `isEnded` flag
- Added `votingActive` modifier to `vote` and `addCandidate`
- Fixed `scripts/deploy.js` (was using wrong variable name, missing constructor args)
- Added Sepolia network config to `hardhat.config.js`
- Wrote `test/Voting.js` — 21 tests all passing (deleted old `test/Lock.js`)

### Step 4: Create wagmi config & Next.js root layout - DONE
- `src/config/wagmi.ts` — wagmi config with Sepolia, HTTP transport, injected + WalletConnect connectors
- `src/components/providers/Web3ModalProvider.tsx` — client provider wrapping WagmiProvider + QueryClient, creates Web3Modal instance with dark theme + brand colors
- `src/app/layout.tsx` — updated metadata, Web3ModalProvider wrapper, `bg-deep-navy text-light-pink` applied
- `.env.example` — all env vars documented (WalletConnect ID, RPC URL, contract address, private key, Etherscan, Neon DB)

### Step 5: Build core components - DONE
- `src/components/layout/Header.tsx` — navigation bar with Vote/Results tabs + `w3m-button`
- `src/components/wallet/ConnectWallet.tsx` — disconnect button
- `src/components/voting/CandidateSelector.tsx` — clickable candidate cards with selection highlighting
- `src/components/voting/CountdownTimer.tsx` — real-time countdown with drift-corrected tick
- `src/components/voting/VotingTable.tsx` — live vote counts with bar chart
- `src/components/voting/TxStatusModal.tsx` — pending/confirming/rejected transaction states
- `src/components/results/ResultsPage.tsx` — winner card, bar chart, voter stats
- `src/hooks/useVoting.ts` — wagmi hooks: candidates, vote status, votingActive, remainingTime, vote write, tx status
- `src/lib/abi.ts` — Voting ABI + contract address (`0x214AE6C5Cc1da15b76C9255f961c0817e778616C` on Sepolia)
- `src/types/custom-elements.d.ts` — JSX type declarations for web3modal custom elements
- `src/app/voting/page.tsx` — voting page with all components, wallet connect gate, tx modal
- `src/app/results/page.tsx` — results page with live/final views
- `src/app/page.tsx` — redirects to `/voting`
- Contract deployed to Sepolia: `0x214AE6C5Cc1da15b76C9255f961c0817e778616C`
- Build passes cleanly

### Step 6: Neon DB & API routes - DONE
- `src/lib/db.ts` — Neon client (`@neondatabase/serverless`)
- `src/lib/schema.sql` — 4 tables: vote_records, voting_sessions, candidates, sync_state
- `src/lib/init-db.ts` — one-shot migration + seed script
- `src/app/api/candidates/route.ts` — GET cached candidates, refetch chain if stale >30s
- `src/app/api/results/route.ts` — GET vote totals, winner, percentages
- `src/app/api/voting-status/route.ts` — GET active/remaining from chain
- `src/app/api/vote/route.ts` — POST record confirmed vote in DB (analytics)
- `src/app/api/sync/route.ts` — POST chain→DB backfill via VoteCast events (Vercel Cron target)
- Build passes cleanly

### Step 7: Full UI/UX redesign - DONE
- `src/app/page.tsx` — full landing page (hero, features, how-it-works, FAQ, footer, CTA)
- `src/app/voting/page.tsx` — step-by-step vote wizard (Select → Confirm → Done)
- `src/app/results/page.tsx` — polished results with back button, empty states
- `src/components/layout/LandingPage.tsx` — homepage sections
- `src/components/voting/StepWizard.tsx` — visual step progress indicator
- `src/components/wallet/WalletConnectButton.tsx` — w3m-button wrapper component
- Gas fix: `useVoting.ts` — explicit `gas: 2_000_000` to avoid Sepolia cap error
- Build passes cleanly

### Steps remaining
1. Vercel deployment config
