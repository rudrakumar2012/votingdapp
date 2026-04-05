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

### Steps remaining
1. Set up Neon DB & API routes (Step 6)
2. Vercel deployment config (Step 7)
