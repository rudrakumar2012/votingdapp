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

### Steps remaining
1. Build core components
2. Build pages
3. Set up Neon DB & API routes
4. Vercel deployment config
