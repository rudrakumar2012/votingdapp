# Plan — Voting DApp Remaining Work

## Phase 2: Admin Dashboard (`/admin`)

### Part 2A: Admin Shell + Session Overview
- Add `owner` read + `isOwner` check to `useVoting.ts`
- Create `/admin` page — wallet-gated, then owner-gated (not owner → denied screen)
- Session overview card: voting status, remaining time, isEnded flag, total votes from DB, last sync info
- Add "Admin" tab to Header (only visible when connected address === owner)
- [x] Done

### Part 2B: End Voting
- Add `endVoting()` write call to `useVoting.ts`
- "End Voting" button + confirmation in admin dashboard
- Reuse TxStatusModal for tx flow
- Status refresh after success
- [ ] Not started

### Part 2C: Add Candidates
- Form input for new candidate name
- `addCandidate()` write call in `useVoting.ts`
- Reuse TxStatusModal for tx flow
- Success + error handling
- [ ] Not started

### Part 2D: Manual Sync
- Add GET handler to `src/app/api/sync/route.ts`
- "Sync Now" button in admin dashboard
- Shows: last synced block, last sync time, votes synced in this run
- Loading state + result feedback
- [ ] Not started

## Deploy
- Connect repo to Vercel, add env vars, deploy
- Cron job (`vercel.json`) already in place
- [ ] Not started

## Key Details
- Contract: `0x214AE6C5Cc1da15b76C9255f961c0817e778616C` on Sepolia
- DB: Neon PostgreSQL, tables: vote_records, voting_sessions, candidates, sync_state
- Branch: `main` (only branch)
- Repo: github.com/rudrakumar2012/votingdapp
