@AGENTS.md

## Current State

### Completed
- Phase 1-7: Full app overhaul done (see original overhaul section below for details)
- Phase 2A-2C: Admin shell, End Voting, Add Candidates — DONE
- Phase 2D: Manual Sync from chain — DONE
- Phase 3A-3E: Create New Voting — DONE (active_contract table, /api/config, /api/deploy, dynamic address, admin deploy form)
- Nav links: All Header links now use `<Link>` elements directly (no broken onNavigate callbacks)
- Sync POST: Fixed infinite block range scan (now scans last 3000 blocks on first run)
- Contract: Deployed to Sepolia `0xb47156F7D72aa83bcC9db5CC44b3237C9B235d39` (updated .env.local)
- Build: Passes cleanly
- Bug fixes (2026-04-07):
  - `/api/config` 500 — `active_contract` table created & seeded in Neon DB
  - `.env.local` contract address corrected
  - `/api/deploy` private key 0x prefix fix
  - `fetchConnectionCache` deprecation removed from db.ts
  - `/voting` page loading + empty state
  - Hydration error on `<w3m-button>` — client-side only render
  - "Launch App" button removed from landing page
  - Vote auto-redirect to `/results` after 2s

### Remaining
- **Deploy to Vercel**: Connect repo, set env vars, deploy (cron already in vercel.json)

## Overhaul Progress (Historical)

### Step 2: Tailwind config - DONE
- Semantic colors in `src/app/globals.css` via Tailwind v4 `@theme`: `deep-navy`, `muted-blue`, `soft-purple`, `light-pink`
- Use these class names everywhere

### Step 3: Smart contract - DONE
- `Voting.sol`: VoteCast/VotingEnded events, getWinner, endVoting, votingActive modifier
- `test/Voting.js` — 21 tests passing

### Step 4: wagmi config + Next.js layout - DONE
- `src/config/wagmi.ts`, `Web3ModalProvider.tsx`, `layout.tsx`

### Step 5: Core components - DONE
- Header, ConnectWallet, CandidateSelector, CountdownTimer, VotingTable, TxStatusModal, ResultsPage
- `src/hooks/useVoting.ts`, `src/lib/abi.ts`, `src/app/voting/page.tsx`, `src/app/results/page.tsx`
- Contract deployed: `0x214AE6C5Cc1da15b76C9255f961c0817e778616C` (old, superseded by new deploy below)

### Step 6: Neon DB & API routes - DONE
- `src/lib/db.ts`, `src/lib/schema.sql`, `src/lib/init-db.ts`
- `/api/candidates`, `/api/results`, `/api/voting-status`, `/api/vote`, `/api/sync`

### Step 7: Full UI/UX redesign - DONE
- Landing page, step wizard, polished results
- Gas fix: `useVoting.ts` explicit `gas: 2_000_000`

### Key Details
- Contract: `0xb47156F7D72aa83bcC9db5CC44b3237C9B235d39` on Sepolia
- DB: Neon PostgreSQL, tables: vote_records, voting_sessions, candidates, sync_state, active_contract
- Branch: `main` (only branch)
- Repo: github.com/rudrakumar2012/votingdapp
