# Plan — Voting DApp Remaining Work

## Phase 2D: Manual Sync — DONE

## Deploy: Vercel deployment — Not started

## Phase 3: "Create New Voting" from Admin UI

### Part 3A: DB schema — `active_contract` table
- Add `active_contract` table to `src/lib/schema.sql` (single-row, stores current contract address, owner, candidates, duration)
- Update `src/lib/init-db.ts` to include the migration
- Insert initial row for currently deployed contract

### Part 3B: `/api/config` GET endpoint
- New route `src/app/api/config/route.ts`
- Returns `{ contractAddress, owner }` from `active_contract` table
- Falls back to `NEXT_PUBLIC_CONTRACT_ADDRESS` env var if empty DB

### Part 3C: Dynamic contract address in useVoting.ts
- Change `CONTRACT_ADDRESS` static import in `src/hooks/useVoting.ts` to use `/api/config` at runtime
- All read/write contract calls reference the dynamic address
- Add `useContractAddress()` helper hook

### Part 3D: `/api/deploy` POST endpoint
- New route `src/app/api/deploy/route.ts`
- Uses viem with `PRIVATE_KEY` to deploy `Voting.sol` via compiled Hardhat artifact
- Takes body: `{ candidates: string[], durationMinutes: number }`
- Writes new contract to `active_contract` (replaces row), seeds candidates, resets sync_state
- Returns `{ address, owner, candidates, durationMinutes }`

### Part 3E: Admin UI — "Deploy New Voting" form - DONE
- Added deploy card to `src/components/admin/AdminDashboard.tsx`
- Candidate name inputs (add/remove rows), duration input, deploy button
- POST /api/deploy → loading → success with new address + copy-to-clipboard
- Auto-reloads page to propagate new contract address to all pages

### 3C fix: Rules of Hooks
- Fixed `src/app/voting/page.tsx` — moved `endedResults` useState/useEffect above early returns

## Verification
- `npm run build` passes
- Visit `/admin` as owner → deploy form works
- Deploy new contract with `["Alice", "Bob", "Charlie"]`, 5 min
- `/voting` page shows new candidates, countdown starts
- No .env changes needed between deploys
