# Plan — Voting DApp Remaining Work

## Phase 2D: Manual Sync — DONE
## Phase 3: "Create New Voting" from Admin UI — DONE

### All completed sub-phases
- Part 3A: DB schema — `active_contract` table — DONE
- Part 3B: `/api/config` GET endpoint — DONE
- Part 3C: Dynamic contract address in useVoting.ts — DONE (+ fix rules of hooks)
- Part 3D: `/api/deploy` POST endpoint — DONE
- Part 3E: Admin UI — "Deploy New Voting" form — DONE

## Bug fixes — 2026-04-07 — DONE
- `/api/config` 500 — created `active_contract` table in Neon DB, seeded initial row
- `.env.local` contract address — updated from `0x214AE6C5...` to `0xb47156F7...`
- Deploy API "invalid private key" — added `0x` prefix normalization
- `fetchConnectionCache` deprecated — removed from `src/lib/db.ts`
- `/voting` page blank — added loading spinner + empty state
- Hydration error on `<w3m-button>` — client-side only render in `WalletConnectButton`
- "Launch App" button — removed from landing page hero nav
- Flashcard persisting after vote — auto-redirects to `/results` after 2s

## Deploy: Vercel deployment — Not started
- Connect GitHub repo to Vercel
- Set environment variables (`DATABASE_URL`, `NEXT_PUBLIC_CONTRACT_ADDRESS`, `PRIVATE_KEY`, `SEPOLIA_RPC_URL`, `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`, `OWNER_ADDRESS`)
- Deploy (cron in `vercel.json` already configured)

## Verification
- `npm run build` passes ✅
- Visit `/admin` as owner → deploy form works
- Deploy new contract with `["Alice", "Bob", "Charlie"]`, 5 min
- `/voting` page shows new candidates, countdown starts
- No .env changes needed between deploys
