@AGENTS.md

## Current State

### Completed
- Phase 1-7: Full app overhaul done (see original overhaul section below for details)
- Phase 2A-2C: Admin shell, End Voting, Add Candidates — DONE
- Phase 2D: Manual Sync from chain — DONE
- Nav links: All Header links now use `<Link>` elements directly (no broken onNavigate callbacks)
- Sync POST: Fixed infinite block range scan (now scans last 3000 blocks on first run)
- Contract: Deployed to Sepolia `0xb47156F7D72aa83bcC9db5CC44b3237C9B235d39` (updated .env)
- Build: Passes cleanly

### Remaining
- **Phase 3**: "Create New Voting" from admin UI (deploy new contract on demand, dynamic address) — see PLAN.md for subparts 3A-3E
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
- DB: Neon PostgreSQL, tables: vote_records, voting_sessions, candidates, sync_state
- Branch: `main` (only branch)
- Repo: github.com/rudrakumar2012/votingdapp
