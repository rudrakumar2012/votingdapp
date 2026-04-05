# Workflow & Codeflow — VoteChain

## User Workflow

### 1. Landing Page (`/`)
User opens the app → sees hero section with "Vote with confidence" headline → can click "Start Voting" or scroll through:
- Features (why vote on-chain)
- How It Works (3 steps)
- FAQ
- Final CTA → clicking "Start Voting" navigates to `/voting`

### 2. Voting Page (`/voting`)
**If wallet not connected:**
- Wallet connection prompt appears with instructions ("Connect MetaMask or Sepolia wallet")
- `<w3m-button />` from web3modal renders the connect button
- After connecting → page re-renders with the voting flow

**If wallet connected:**

**Step 1 — Select Candidate:**
- Step wizard shows ① Select → ② Confirm → ③ Done
- Candidate cards display name + current vote count
- User clicks one card → it highlights
- "Next: Review Vote" button becomes active

**Step 2 — Confirm Vote:**
- Summary card shows selected candidate name
- Warning: "One vote per wallet. You cannot change your vote."
- Two buttons: "Back to Selection" or "Submit Vote"
- Clicking "Submit Vote" triggers:
  1. MetaMask popup appears asking for approval
  2. Transaction is sent to Sepolia
  3. TxStatusModal shows: pending → confirming → confirmed
  4. On confirmed → user sees "Vote Recorded!" screen with link to results

**If already voted:**
- Shows success message with candidate they voted for
- "View Results" link

**If voting ended:**
- Shows "Voting Has Ended" message with link to `/results`

### 3. Results Page (`/results`)
**While voting active:**
- "Voting Still Active" message
- "View Live Table" (shows current standings)
- "Back to Vote" link

**After voting ended:**
- Winner card with vote count and percentage
- Bar chart for all candidates
- Total votes, candidate count stats
- "Back to Vote" link

---

## Technical Codeflow

### Data Flow Architecture

```
User Browser
    │
    ▼
┌─────────────────────┐
│  Next.js Pages      │    (src/app/)
│  page.tsx           │ → LandingPage (static SSR)
│  voting/page.tsx    │ → Step wizard (client)
│  results/page.tsx   │ → Results (client)
│  api/*             │ → DB-backed API endpoints
└────────┬────────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌────────┐  ┌─────────────┐
│ wagmi  │  │ Neon DB     │
│ (chain)│  │ (@neondb)   │
└───┬────┘  └──┬──────────┘
    │          │
    ▼          ▼
 Sepolia   Postgres
 RPC      Tables
```

### Component Responsibility Matrix

| File | Role | Type | Key Responsibility |
|------|------|------|--------------------|
| `.next/types/**/*.ts` | Generated | Build | Type safety |
| `src/app/page.tsx` | Page | Server | Landing page — hero, features, FAQ, footer |
| `src/app/voting/page.tsx` | Page | Client | Voting wizard — step manager, candidate selection, tx flow |
| `src/app/results/page.tsx` | Page | Client | Results display with live/final states |
| `src/app/layout.tsx` | Layout | Server | Root HTML: fonts, Web3ModalProvider, bg/text globals |
| `src/app/api/candidates/route.ts` | API | Server | GET cached candidates, refetch chain if >30s stale |
| `src/app/api/results/route.ts` | API | Server | GET vote totals, winner, percentages from DB |
| `src/app/api/voting-status/route.ts` | API | Server | GET active/remaining/isEnded from chain |
| `src/app/api/vote/route.ts` | API | Server | POST record vote in DB (analytics) |
| `src/app/api/sync/route.ts` | API | Server | POST chain→DB backfill via VoteCast events |
| `src/components/layout/LandingPage.tsx` | Component | Client | Full homepage: hero, features, how-it-works, FAQ, CTA, footer |
| `src/components/layout/Header.tsx` | Component | Client | Nav bar with Vote/Results tabs |
| `src/components/voting/StepWizard.tsx` | Component | Client | Visual step progress indicator (①→②→③) |
| `src/components/voting/CandidateSelector.tsx` | Component | Client | Clickable candidate cards grid |
| `src/components/voting/CountdownTimer.tsx` | Component | Client | Real-time countdown (HH:MM:SS) |
| `src/components/voting/VotingTable.tsx` | Component | Client | Candidate list with live vote bars |
| `src/components/voting/TxStatusModal.tsx` | Component | Client | Transaction states: pending/confirming/rejected |
| `src/components/results/ResultsPage.tsx` | Component | Client | Winner card, bar chart, voter stats |
| `src/components/wallet/ConnectWallet.tsx` | Component | Client | Disconnect button wrapper |
| `src/components/wallet/WalletConnectButton.tsx` | Component | Client | Wrapper for `<w3m-button />` custom element |
| `src/components/providers/Web3ModalProvider.tsx` | Provider | Client | WagmiProvider + QueryClient + Web3Modal |
| `src/hooks/useVoting.ts` | Hook | Client | All wagmi contract reads/writes: candidates, status, vote |
| `src/lib/abi.ts` | Library | Server+Client | Voting ABI + contract address export |
| `src/lib/db.ts` | Library | Server only | Neon SQL client (`@neondatabase/serverless`) |
| `src/lib/schema.sql` | Schema | — | 4 table definitions |
| `src/lib/init-db.ts` | Script | — | One-shot schema creation + table seeding |
| `src/config/wagmi.ts` | Config | Client | wagmi chain config (Sepolia, HTTP transport, connectors) |
| `src/types/custom-elements.d.ts` | Types | Dev | JSX types for web3modal custom elements |
| `contracts/Voting.sol` | Contract | — | Solidity voting contract (events, vote, results, endVoting) |
| `hardhat.config.js` | Config | — | Hardhat settings + Sepolia network |
| `scripts/deploy.js` | Script | — | Deploys Voting.sol to configured network |
| `test/Voting.js` | Test | — | 21 unit tests for Voting.sol |

### Request Lifecycle (Vote Transaction)

1. **User selects candidate** → `CandidateSelector` sets `selectedCandidate` state
2. **User clicks "Next"** → `handleNext()` in `voting/page.tsx` advances to step 2
3. **User clicks "Submit Vote"** → `handleConfirmVote()` calls `useVoting.voteForCandidate(index)`
4. **`useVoting.ts`** → `writeContract` sends tx to chain via wagmi (gas: 2,000,000)
5. **MetaMask pops up** → user confirms
6. **Chain processes** → `txPending` → `confirming` → `confirmed`
7. **TxStateModal** shows corresponding state → auto-hides on confirmed
8. **Page shows "Vote Recorded"** → button to view results
9. **API `/api/vote`** (optional) → client can POST vote record to DB for analytics

### Smart Contract Flow

```
Deploy → Voting.sol constructor(_candidateNames, _durationInMinutes)
         │
         ├─ votingStart = block.timestamp
         ├─ votingEnd = block.timestamp + duration
         └─ candidates[] populated
              │
              ▼
    Users call vote(_candidateIndex)
              │
              ├─ Check: !voters[msg.sender] (one vote)
              ├─ Check: block.timestamp < votingEnd (time limit)
              ├─ candidates[_candidateIndex].voteCount++
              ├─ voters[msg.sender] = true
              └─ emit VoteCast(voter, index, name)
              │
              ▼
    Owner calls endVoting()
              │
              ├─ isEnded = true
              ├─ votingEnd = block.timestamp
              └─ emit VotingEnded(winnerName, count)
```

### DB Sync Flow (Vercel Cron)

```
POST /api/sync
       │
       ├─ Read last_synced_block from sync_state
       ├─ publicClient.getLogs(VoteCast, fromBlock, toBlock)
       ├─ For each log not yet recorded:
       │    ├─ INSERT vote_records (tx_hash dedup)
       │    └─ UPDATE candidates.vote_count_cache += 1
       └─ UPDATE sync_state.last_synced_block
```

### Gas Fix Note

The vote transaction previously failed with "gas limit too high (cap: 16777216, tx: 21000000)" because wagmi's default gas estimation on Sepolia was overshooting. Fixed by setting explicit `gas: BigInt(2_000_000)` in `src/hooks/useVoting.ts`.
