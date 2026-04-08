# Vercel Deployment Guide

## Pre-flight Checklist

✅ Build passes: `npm run build`  
✅ Cron configured in `vercel.json`  
✅ Faviocn: `public/favicon.svg` (matches theme: deep-navy background, soft-purple ballot box, light-pink checkmark)  
✅ Database: Neon PostgreSQL (serverless)  
✅ Environment files: `.env.local` (local), `.env.example` (template)  

---

## 1. Push to GitHub

```bash
git add .
git commit -m "feat: add theme-based favicon and prepare for Vercel deployment"
git push origin main
```

---

## 2. Connect Repository to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **New Project**
3. **Import** from GitHub → select `rudrakumar2012/votingdapp`
4. Click **Create Project**

> **Note for Free Plan Users**: Vercel cron jobs require Pro plan or higher. If you're on the free plan, skip the cron in `vercel.json` and use **GitHub Actions** (see step 2b below).

### 2b. Set Up GitHub Actions (Free Cron Alternative)

Already configured: `.github/workflows/sync.yml` will call `/api/sync` every 5 minutes.

After deployment, your Vercel app URL will be something like:
- `https://votingdapp.vercel.app` (default)
- Or your custom domain

**Important**: You must add this URL as a GitHub secret:

1. In GitHub repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**
2. Name: `APP_URL`
3. Value: `https://your-app.vercel.app` (use your actual production URL)
4. Click **Add secret**

The workflow will automatically start running after you add the secret. You can also manually trigger it from GitHub → **Actions** → **Sync Votes from Blockchain** → **Run workflow**.

**Optional**: If your `/api/sync` endpoint requires authentication, also add:
- `VERCEL_TOKEN`: Create at [Vercel API Tokens](https://vercel.com/account/tokens) (Full Access)
- Then modify workflow to include `-H "Authorization: Bearer ${{ secrets.VERCEL_TOKEN }}"`

---

## 3. Configure Environment Variables

In Vercel Dashboard → Your Project → **Settings** → **Environment Variables**, add the following:

### Production Environment
| Key | Value | Description |
|-----|-------|-------------|
| `DATABASE_URL` | `<from .env.local>` | Neon PostgreSQL connection string |
| `NEXT_PUBLIC_CONTRACT_ADDRESS` | `0xb47156F7D72aa83bcC9db5CC44b3237C9B235d39` | Current deployed contract |
| `PRIVATE_KEY` | `<from .env.local>` | Deployer account private key (keep secret!) |
| `SEPOLIA_RPC_URL` | `https://ethereum-sepolia-rpc.publicnode.com` | Ethereum Sepolia RPC endpoint |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | `cad77b49498951680dfacc2fbf8aa4c2` | WalletConnect Cloud project ID |
| `OWNER_ADDRESS` | `<your wallet address>` | Admin address for `/admin` access |
| `ETHERSCAN_API_KEY` | *(optional)* | For contract verification |

### Preview Environment (for PRs/branches)
| Key | Value |
|-----|-------|
| `DATABASE_URL` | `<same as Production>` |
| `NEXT_PUBLIC_CONTRACT_ADDRESS` | `0xb47156F7D72aa83bcC9db5CC44b3237C9B235d39` |
| `SEPOLIA_RPC_URL` | `https://ethereum-sepolia-rpc.publicnode.com` |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | `cad77b49498951680dfacc2fbf8aa4c2` |
| `OWNER_ADDRESS` | `<your wallet address>` |

**Important:** Do NOT add `PRIVATE_KEY` to Preview environment.

---

## 4. Deploy

1. Click **Deploy** in Vercel
2. Vercel runs `npm run build` automatically
3. Wait for deployment to complete (~2-3 minutes)
4. Copy your production URL (e.g., `https://votingdapp.vercel.app`)

---

## 5. Post-Deployment Verification

### ✅ Essential Checks
- [ ] **Landing page** loads with deep-navy background and Tailwind styling
- [ ] **Favicon** appears in browser tab (purple ballot box with pink checkmark)
- [ ] **Connect Wallet** button opens Web3Modal
- [ ] **Voting page** (`/voting`) shows candidates from contract
- [ ] **Results page** (`/results`) displays current results

### ✅ Admin Features (as OWNER_ADDRESS)
- [ ] **Admin page** (`/admin`) accessible only to `OWNER_ADDRESS`
- [ ] **Deploy form** works: deploy new contract with test candidates
- [ ] New contract address saved to `active_contract` table
- [ ] After deployment, voting page reflects new contract automatically

### ✅ Cron Job
#### If on Vercel Pro plan (or higher):
- [ ] Wait 5 minutes, check Vercel logs for `/api/sync` execution
- [ ] Or manually trigger: `curl -X POST https://your-app.vercel.app/api/sync`
- [ ] Verify `vote_records` table syncs from chain

#### If on Vercel Free plan (using GitHub Actions):
- [ ] After deploy, go to GitHub repo → **Actions** tab
- [ ] You should see "Sync Votes from Blockchain" workflow active
- [ ] Wait for scheduled run (every 5 min) or manually trigger
- [ ] Check workflow logs for successful `curl` call (HTTP 200/201)
- [ ] Verify `vote_records` table syncs from chain by checking Neon DB or `/api/sync` GET response

### ✅ Database
- [ ] Neon DB `active_contract` table has initial row
- [ ] All tables exist: `vote_records`, `voting_sessions`, `candidates`, `sync_state`

---

## 6. Dynamic Contract Deployments

After initial deployment, you can deploy new contracts from the admin UI without changing environment variables:

1. Navigate to `/admin` (must be wallet connected to `OWNER_ADDRESS`)
2. Fill in candidates list (JSON array: `["Alice", "Bob", "Charlie"]`)
3. Set voting duration (in minutes)
4. Click **Deploy**
5. New contract address stored in `active_contract` table
6. App reads from `active_contract` → new voting session begins automatically

---

## 7. Troubleshooting

### Build Errors
```bash
# Check Next.js build locally first
npm run build

# If errors persist, check:
# - Node version: >= 18
# - Dependencies: npm install
```

### Environment Variables Not Set
- Vercel requires **re-deploy** after adding new env vars
- Verify in **Deployments** → click latest deployment → **Environment Variables** tab

### Database Connection Issues
- `DATABASE_URL` must be in correct format: `postgresql://user:pass@host/db?sslmode=require`
- Neon DB must be **activated** (not suspended)
- Check `active_contract` table exists and has at least one row

### Cron Job Not Running
- Vercel Cron requires **Pro** plan or higher
- Or use external scheduler (e.g., GitHub Actions) to call `/api/sync` every 5 minutes

### Favicon Not Appearing
- Clear browser cache (hard refresh: `Ctrl+Shift+R`)
- Verify `/favicon.svg` exists in Vercel **Deployments** → **Files** tab
- Check layout.tsx metadata configuration

---

## 8. Optional: Custom Domain

1. In Vercel → **Domains** → **Add Domain**
2. Enter your domain (e.g., `vote.yoursite.com`)
3. Update domain's DNS with Vercel's nameservers or CNAME
4. Add domain to **Environment Variables** if needed (same values as production)

---

## 9. Monitoring

- **Vercel Analytics**: View traffic, requests, errors
- **Neon DB**: Monitor query performance, connection pool
- **Etherscan**: Track contract transactions on Sepolia
- **GitHub**: Monitor issues/PRs for bug reports

---

## 10. Notes

- **Serverless Functions**: API routes have 30s timeout (configured in `vercel.json`)
- **Database**: Neon serverless driver (`@neondatabase/serverless`) optimized for Vercel
- **Contract Address**: Initially set via `NEXT_PUBLIC_CONTRACT_ADDRESS`, but can be updated via admin UI
- **Security**: `PRIVATE_KEY` and `DATABASE_URL` are **server-only** (not exposed to client)
- **Wallets**: WalletConnect integrates MetaMask, Coinbase Wallet, and 500+ others

---

**Next steps**: After deployment, add your production URL to the README.md and update any documentation links.
